// `scan` — OPTIONAL dynamic tier. Runs axe-core in a real headless browser
// (Playwright) to decide the needs-rendering criteria the static engine can't:
// computed contrast (3.2/3.3) above all, plus a 320px reflow check (10.11) and a
// cross-check of the structural rules. Everything runs in a self-contained Docker
// image built on first use (the runner + Dockerfile are embedded below, so the
// skill stays a single distributable bundle). `--merge <audit.json>` folds the
// dynamic findings back into a static AuditResult, upgrading "manual" criteria.
import { execFileSync } from "node:child_process";
import { mkdtempSync, writeFileSync, existsSync, statSync, readdirSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";
import type { AuditResult, DynamicFinding, DynamicResult, Lang, Severity } from "./types.js";
import { allGuidelines } from "./wcag.js";
import { scForAxe, severityFromImpact } from "./axe-map.js";
import { parseSitemapUrls, crawlUrls } from "./crawl.js";
import { today } from "./util.js";

export const IMAGE_TAG = "ultra11y-dyn:1";
const MOUNT = "/work/input.html";

// The browser runner — lives INSIDE the Docker image (its own deps), never bundled
// into the zero-dep engine. Injects axe.source, runs axe, then a 320px reflow probe.
// Mirrored to docker/runner.mjs (kept byte-identical by docker-sync.test).
export const RUNNER = `import { chromium } from "playwright";
import axe from "axe-core";
const target = process.argv[2];
const isFile = target.startsWith("/work/");
const browser = await chromium.launch({ args: ["--no-sandbox", "--disable-dev-shm-usage"] });
try {
  const page = await browser.newPage();
  await page.goto(isFile ? "file://" + target : target, { waitUntil: "load", timeout: 45000 });
  await page.addScriptTag({ content: axe.source });
  const axeRes = await page.evaluate(async () => await window.axe.run(document, { resultTypes: ["violations"] }));
  await page.setViewportSize({ width: 320, height: 800 });
  const reflow = await page.evaluate(() => {
    const el = document.scrollingElement || document.documentElement;
    return { horizontalScroll: el.scrollWidth > el.clientWidth + 2 };
  });
  const violations = axeRes.violations.map((v) => ({
    id: v.id, impact: v.impact, help: v.help, tags: v.tags,
    nodes: v.nodes.slice(0, 10).map((n) => ({ target: n.target, html: (n.html || "").slice(0, 200) })),
  }));
  console.log(JSON.stringify({ url: target, violations, reflow }));
} finally {
  await browser.close();
}
`;

export const PKG = JSON.stringify(
  { name: "ultra11y-dynamic", private: true, type: "module", dependencies: { playwright: "^1.49.0", "axe-core": "^4.10.0" } },
  null,
  2,
);

export const DOCKERFILE = `FROM node:22-bookworm-slim
WORKDIR /app
COPY package.json ./
RUN npm install --omit=dev && npx playwright install --with-deps chromium
COPY runner.mjs ./
WORKDIR /work
ENTRYPOINT ["node", "/app/runner.mjs"]
`;

export function dockerAvailable(): boolean {
  try {
    execFileSync("docker", ["info"], { stdio: "ignore", timeout: 10000 });
    return true;
  } catch {
    return false;
  }
}

function imageExists(tag: string): boolean {
  try {
    execFileSync("docker", ["image", "inspect", tag], { stdio: "ignore" });
    return true;
  } catch {
    return false;
  }
}

const CTX_PREFIX = "ultra11y-dyn-";

/** Build the dynamic-tier image from the embedded context (first use only).
 *  The temp build context is always removed afterwards — the host stays clean. */
export function buildImage(tag = IMAGE_TAG): void {
  const ctx = mkdtempSync(join(tmpdir(), CTX_PREFIX));
  try {
    writeFileSync(join(ctx, "runner.mjs"), RUNNER);
    writeFileSync(join(ctx, "package.json"), PKG);
    writeFileSync(join(ctx, "Dockerfile"), DOCKERFILE);
    execFileSync("docker", ["build", "-t", tag, ctx], { stdio: "inherit", timeout: 900000 });
  } finally {
    rmSync(ctx, { recursive: true, force: true });
  }
}

/** Remove any leftover temp build contexts (pure fs; safe to call always). */
export function cleanTempContexts(): number {
  let removed = 0;
  const dir = tmpdir();
  for (const name of readdirSync(dir)) {
    if (!name.startsWith(CTX_PREFIX)) continue;
    rmSync(join(dir, name), { recursive: true, force: true });
    removed++;
  }
  return removed;
}

export interface CleanResult {
  imageRemoved: boolean;
  tempContextsRemoved: number;
}

/** Tear down the dynamic tier: remove the image + any leftover build contexts.
 *  Answers "clean it up easily from the script" — nothing is left on the host. */
export function cleanDynamic(tag = IMAGE_TAG): CleanResult {
  let imageRemoved = false;
  if (dockerAvailable() && imageExists(tag)) {
    try {
      execFileSync("docker", ["rmi", "-f", tag], { stdio: "ignore" });
      imageRemoved = true;
    } catch {
      /* image in use or already gone */
    }
  }
  return { imageRemoved, tempContextsRemoved: cleanTempContexts() };
}

interface RunnerOutput {
  url: string;
  violations: { id: string; impact: string | null; help: string; tags?: string[]; nodes: { target: string[]; html: string }[] }[];
  reflow: { horizontalScroll: boolean };
}

function runRunner(target: string, isFile: boolean, tag: string): RunnerOutput {
  const args = ["run", "--rm"];
  if (isFile) args.push("-v", `${resolve(target)}:${MOUNT}:ro`);
  args.push(tag, isFile ? MOUNT : target);
  let stdout: string;
  try {
    // Pipe (not ignore) the container's stderr so a failed run surfaces the real
    // cause (e.g. ERR_NAME_NOT_RESOLVED / a navigation timeout) instead of a bare
    // "Command failed: docker run …".
    stdout = execFileSync("docker", args, { encoding: "utf8", timeout: 240000, maxBuffer: 32 * 1024 * 1024, stdio: ["ignore", "pipe", "pipe"] });
  } catch (e) {
    const err = e as { stderr?: Buffer | string; message?: string };
    const detail = (err.stderr ? String(err.stderr).trim() : "") || err.message || String(e);
    throw new Error(`docker run failed — ${detail}`);
  }
  const line = stdout.trim().split("\n").filter(Boolean).pop() ?? "{}";
  return JSON.parse(line) as RunnerOutput;
}

export function toDynamicResult(out: RunnerOutput, target: string, lang: Lang = "en"): DynamicResult {
  const page = out.url || target;
  const findings: DynamicFinding[] = [];
  for (const v of out.violations) {
    const criteriaId = scForAxe(v.id, v.tags);
    const severity: Severity = severityFromImpact(v.impact);
    for (const n of v.nodes.length ? v.nodes : [{ target: [], html: "" }]) {
      findings.push({
        criteriaId,
        axeRule: v.id,
        impact: v.impact ?? "minor",
        severity,
        message: `${v.help} (axe: ${v.id})`,
        selector: n.target.join(" ") || "—",
        snippet: n.html,
        engine: "axe",
        page,
      });
    }
  }
  if (out.reflow?.horizontalScroll) {
    findings.push({
      criteriaId: "1.4.10",
      axeRule: "reflow",
      impact: "serious",
      severity: "majeur",
      message:
        lang === "fr"
          ? "Défilement horizontal à 320px de large — le contenu ne se redistribue pas (reflow)."
          : "Horizontal scrolling at 320px width — content does not reflow.",
      selector: "document",
      snippet: "",
      engine: "reflow",
      page,
    });
  }
  return { tool: "ultra11y", engine: "axe-core@playwright (docker)", target, date: today(), findings };
}

export interface ScanOpts {
  target: string;
  tag?: string;
}

/** Run the dynamic tier (builds the image on first use). Throws if Docker absent. */
export function runScan(opts: ScanOpts): DynamicResult {
  // A non-URL target must exist as a file BEFORE we spend a Docker build on a typo
  // (otherwise a mistyped path silently falls through to URL mode and fails deep
  // inside `docker run`, leaking the raw command).
  const isUrl = /^https?:\/\//i.test(opts.target);
  if (!isUrl && !existsSync(opts.target)) {
    throw new Error(`File not found: ${opts.target}. Pass an http(s):// URL or an existing HTML file.`);
  }
  if (!dockerAvailable()) {
    throw new Error("Docker is not available. Start Docker, then re-run `scan --docker`.");
  }
  const tag = opts.tag ?? IMAGE_TAG;
  if (!imageExists(tag)) buildImage(tag);
  const isFile = !isUrl && existsSync(opts.target) && statSync(opts.target).isFile();
  const out = runRunner(opts.target, isFile, tag);
  return toDynamicResult(out, opts.target);
}

/** Fetch a URL's served HTML (zero-dep, Node global fetch). Empty string on error. */
async function fetchHtml(url: string): Promise<string> {
  try {
    const res = await fetch(url, { redirect: "follow" });
    if (!res.ok) return "";
    return await res.text();
  } catch {
    return "";
  }
}

export interface DiscoverOpts {
  sitemap?: string; // sitemap.xml URL — scan every <loc>
  crawl?: string; // start URL — BFS the served HTML for same-origin links
  depth?: number; // crawl: link hops from the start URL  (default 2)
  max?: number; // cap on pages scanned                  (default 50)
}

/** Resolve the page URLs to scan from a sitemap or by crawling (zero-dep). */
export async function discoverUrls(opts: DiscoverOpts): Promise<string[]> {
  const max = opts.max ?? 50;
  if (opts.sitemap) {
    return parseSitemapUrls(await fetchHtml(opts.sitemap)).slice(0, max);
  }
  if (opts.crawl) {
    return crawlUrls(opts.crawl, { fetchHtml, depth: opts.depth ?? 2, max });
  }
  return [];
}

/** Run the dynamic tier over many URLs and aggregate into one DynamicResult.
 *  Each URL is one container run (browser per page); slow but reuses the proven
 *  single-page runner. Findings keep the page they came from. */
export function runScanMany(urls: string[], tag = IMAGE_TAG): DynamicResult {
  if (!dockerAvailable()) {
    throw new Error("Docker is not available. Start Docker, then re-run `scan`.");
  }
  if (!imageExists(tag)) buildImage(tag);
  const findings: DynamicFinding[] = [];
  for (const url of urls) {
    const out = runRunner(url, false, tag);
    findings.push(...toDynamicResult(out, url).findings);
  }
  return { tool: "ultra11y", engine: "axe-core@playwright (docker)", target: `${urls.length} page(s)`, date: today(), findings };
}

/** Discover URLs (sitemap/crawl) then scan them all through the dynamic tier. */
export async function runCrawlScan(opts: DiscoverOpts & { tag?: string }): Promise<DynamicResult> {
  const urls = await discoverUrls(opts);
  if (urls.length === 0) {
    throw new Error("No URL to scan (empty/unreachable sitemap, or entry page with no same-origin link).");
  }
  return runScanMany(urls, opts.tag ?? IMAGE_TAG);
}

const sevRank: Record<Severity, number> = { bloquant: 3, majeur: 2, mineur: 1 };

/** Fold dynamic findings into a static AuditResult: a needs-rendering/manual or
 *  clean criterion that axe flags becomes NC; tallies + conformance recompute. */
export function mergeDynamic(audit: AuditResult, dynamic: DynamicResult, lang: Lang = "en"): AuditResult {
  const merged: AuditResult = JSON.parse(JSON.stringify(audit)) as AuditResult;
  const byId = new Map(merged.criteria.map((c) => [c.id, c]));
  const remediation =
    lang === "fr" ? "Vérifié au rendu par axe-core ; corrigez l'élément cité." : "Verified at render time by axe-core; fix the cited element.";

  for (const df of dynamic.findings) {
    const c = byId.get(df.criteriaId);
    if (!c) continue;
    const finding = {
      ruleId: df.engine === "reflow" ? "dyn-reflow" : `axe:${df.axeRule}`,
      criteriaId: df.criteriaId,
      file: df.page ?? dynamic.target,
      line: 0,
      col: 0,
      selectorHint: df.selector,
      severity: df.severity,
      message: df.message,
      remediation,
      snippet: df.snippet,
    };
    c.findings.push(finding);
    c.status = "NC"; // a rendered-tool finding is authoritative
    delete c.justification;
    merged.findings.push(finding);
  }

  // drop upgraded criteria from residual risks
  const nowNc = new Set(dynamic.findings.map((d) => d.criteriaId));
  merged.residualRisks = merged.residualRisks.filter((r) => !nowNc.has(r.criteriaId));

  // recompute tallies + conformance (by WCAG guideline)
  merged.guidelines = allGuidelines().map((g) => {
    const inG = merged.criteria.filter((c) => c.guideline === g.number);
    return {
      key: g.number,
      title: g.title,
      c: inG.filter((c) => c.status === "C").length,
      nc: inG.filter((c) => c.status === "NC").length,
      na: inG.filter((c) => c.status === "NA").length,
      manual: inG.filter((c) => c.status === "manual").length,
    };
  });
  const decided = merged.criteria.filter((c) => c.status === "C" || c.status === "NC");
  const conform = decided.filter((c) => c.status === "C").length;
  merged.conformancePct = decided.length === 0 ? 100 : Math.round((conform / decided.length) * 100);
  merged.findings.sort((a, b) => sevRank[b.severity] - sevRank[a.severity]);
  return merged;
}
