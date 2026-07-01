// `scan --runtime local` — the dynamic tier WITHOUT Docker. Resolves a host/target
// Playwright + @axe-core/playwright AT RUNTIME (createRequire, a node: builtin) from
// `--cwd`, so the zero-dep static engine bundle never gains a static browser import.
// It runs the SAME axe-core pass as the Docker RUNNER, then the residual-criteria
// probes axe cannot decide (focus visibility, 200% zoom, text spacing, content on
// hover, target size). The Docker RUNNER / docker/* files are untouched (docker-sync).
//
// Browser-context code is passed to page.evaluate AS STRINGS — like the Docker RUNNER —
// because the engine's tsconfig ships no DOM lib (it is a Node program); a typed
// arrow body referencing document/window would not type-check.
import { existsSync, statSync } from "node:fs";
import { createRequire } from "node:module";
import { resolve } from "node:path";
import type { DynamicFinding, DynamicResult, Lang } from "./types.js";
import { type DiscoverOpts, discoverUrls, type ProbeHit, type RunnerOutput, toDynamicResult } from "./scan.js";
import { today } from "./util.js";

export const LOCAL_ENGINE = "axe-core@playwright (local)";

// Playwright + AxeBuilder are resolved at runtime (never typed deps of this package),
// so they cross the boundary untyped. biome's noExplicitAny is off for this repo.
type Any = any;

interface LocalDeps {
  chromium: Any;
  AxeBuilder: Any;
}

const PW_SPEC = "@playwright/test";
const AXE_SPEC = "@axe-core/playwright";

/** Resolvable WITHOUT loading (cheap auto-detection): @playwright/test + @axe-core/playwright
 *  both resolve from `--cwd`. */
export function localAvailable(cwd: string): boolean {
  try {
    const req = createRequire(resolve(cwd, "package.json"));
    req.resolve(PW_SPEC);
    req.resolve(AXE_SPEC);
    return true;
  } catch {
    return false;
  }
}

/** Load Playwright `chromium` + the `AxeBuilder` class from the target project. */
export function resolveLocalDeps(cwd: string): LocalDeps {
  let chromium: Any;
  let AxeBuilder: Any;
  try {
    const req = createRequire(resolve(cwd, "package.json"));
    const pw = req(PW_SPEC);
    const axeMod = req(AXE_SPEC);
    chromium = pw.chromium;
    AxeBuilder = axeMod.default ?? axeMod;
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    throw new Error(
      `Playwright not resolvable from "${cwd}". Pass --cwd <dir> at a project with @playwright/test + @axe-core/playwright installed (e.g. --cwd packages/app), or use --runtime docker. (${msg})`,
    );
  }
  if (!chromium || typeof AxeBuilder !== "function") {
    throw new Error(
      `Resolved Playwright/@axe-core/playwright from "${cwd}" but they did not expose chromium / AxeBuilder. Check the installed versions, or use --runtime docker.`,
    );
  }
  return { chromium, AxeBuilder };
}

async function launchChromium(chromium: Any): Promise<Any> {
  try {
    return await chromium.launch({ args: ["--no-sandbox", "--disable-dev-shm-usage"] });
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    if (/Executable doesn'?t exist|playwright install|browserType\.launch/i.test(msg)) {
      throw new Error(
        `Could not launch Chromium for the resolved Playwright. Install it from the --cwd project: \`npx playwright install chromium\`. (${msg})`,
      );
    }
    throw e;
  }
}

// ---- residual-criteria probes (browser-context source, evaluated as strings) ----

// Shared helpers injected at the top of every probe expression.
const PRELUDE = `
const __sel = (e) => {
  if (!e || !e.tagName) return '—';
  const t = e.tagName.toLowerCase();
  if (e.id) return t + '#' + e.id;
  const c = typeof e.className === 'string' ? e.className.trim().split(/\\s+/)[0] : '';
  return c ? t + '.' + c : t;
};
const __vis = (e) => {
  const r = e.getBoundingClientRect();
  if (r.width <= 4 || r.height <= 4) return false; // tiny / 1px sr-only boxes
  const s = getComputedStyle(e);
  if (s.display === 'none' || s.visibility === 'hidden' || parseFloat(s.opacity) === 0) return false;
  // visually-hidden "screen-reader-only" pattern (clip rect / clip-path inset) — present in
  // the a11y tree but not painted; must not be measured for clipping/target-size.
  if (s.clip && s.clip !== 'auto' && s.clip !== 'rect(auto, auto, auto, auto)') return false;
  if (s.clipPath && (s.clipPath.indexOf('inset(100%') >= 0 || s.clipPath.indexOf('inset(50%') >= 0)) return false;
  return true;
};
const __html = (e) => (e.outerHTML || '').slice(0, 160);
`;

// The 320px reflow check (same semantics as the Docker RUNNER), mapped to 1.4.10.
const REFLOW_PROBE = `(() => {
  const el = document.scrollingElement || document.documentElement;
  return { horizontalScroll: el.scrollWidth > el.clientWidth + 2 };
})()`;

// Note: WCAG 2.5.8 Target Size is covered by axe-core's own `target-size` rule (which
// correctly applies the inline + 24px-spacing exceptions), so there is no bespoke probe
// for it — a hand-rolled one was strictly noisier than axe on real DSFR pages.

// 1.4.4 Resize Text: enlarge text to 200% and detect actual LOSS OF CONTENT — text
// clipped in an overflow:hidden / nowrap / ellipsis container. (A mere horizontal
// scrollbar at 200% text is NOT a 1.4.4 failure — 2D reflow is 1.4.10 — so we do not
// flag page-level horizontal scroll here; only content the user can no longer read.)
const REFLOW_ZOOM_PROBE = `(() => { ${PRELUDE}
  const root = document.documentElement;
  const prev = root.style.fontSize;
  root.style.fontSize = '200%';
  const hits = [];
  for (const e of Array.from(document.querySelectorAll('p,li,h1,h2,h3,h4,h5,h6,td,th,button,a,label,span'))) {
    if (!__vis(e)) continue;
    if ((e.textContent || '').trim().length < 8) continue;
    const s = getComputedStyle(e);
    const clip = s.overflow === 'hidden' || s.overflowY === 'hidden' || s.overflowX === 'hidden';
    const noWrap = s.whiteSpace === 'nowrap' || s.textOverflow === 'ellipsis';
    if ((clip || noWrap) && (e.scrollHeight > e.clientHeight + 6 || e.scrollWidth > e.clientWidth + 6)) {
      hits.push({ selector: __sel(e), html: __html(e), detail: 'Texte tronqué/masqué à 200% (conteneur overflow:hidden / nowrap) — perte de contenu au zoom (1.4.4).' });
    }
    if (hits.length >= 12) break;
  }
  root.style.fontSize = prev;
  return hits;
})()`;

// 1.4.12 Text Spacing override (line-height 1.5, letter 0.12em, word 0.16em, p 2em).
const TEXT_SPACING_CSS =
  "* { line-height: 1.5 !important; letter-spacing: 0.12em !important; word-spacing: 0.16em !important; } p { margin-bottom: 2em !important; }";
const TEXT_SPACING_PROBE = `(() => { ${PRELUDE}
  const hits = [];
  for (const e of Array.from(document.querySelectorAll('p,li,span,a,button,h1,h2,h3,h4,h5,h6,td,th,label,div'))) {
    if (!__vis(e)) continue;
    if ((e.textContent || '').trim().length < 8) continue;
    const s = getComputedStyle(e);
    const clipped = (s.overflowX === 'hidden' || s.overflowY === 'hidden' || s.overflow === 'hidden') && (e.scrollHeight > e.clientHeight + 2 || e.scrollWidth > e.clientWidth + 2);
    const ellipsis = s.textOverflow === 'ellipsis' && e.scrollWidth > e.clientWidth + 2;
    if (clipped || ellipsis) {
      hits.push({ selector: __sel(e), html: __html(e), detail: 'Texte tronqué/masqué sous l\\'espacement de texte WCAG 1.4.12 — perte de contenu.' });
    }
    if (hits.length >= 20) break;
  }
  return hits;
})()`;

// 2.4.7 Focus Visible — pass 1: tag each focusable + snapshot its unfocused style.
const FOCUS_SETUP_PROBE = `(() => { ${PRELUDE}
  const sel = 'a[href],button:not([disabled]),input:not([type=hidden]):not([disabled]),select:not([disabled]),textarea:not([disabled]),[tabindex]:not([tabindex="-1"]),[role=button]:not([disabled])';
  const snap = (e) => { const s = getComputedStyle(e); return [s.outlineStyle, s.outlineWidth, s.outlineColor, s.boxShadow, s.borderColor, s.borderTopWidth, s.borderBottomWidth, s.backgroundColor, s.color, s.textDecorationLine].join('|'); };
  window.__u11yF = {};
  let n = 0;
  for (const e of Array.from(document.querySelectorAll(sel))) {
    if (!__vis(e)) continue;
    const key = 'k' + n;
    e.setAttribute('data-u11y-f', key);
    window.__u11yF[key] = { rest: snap(e), sel: __sel(e), html: __html(e) };
    n++;
    if (n >= 120) break;
  }
  return n;
})()`;

// Pass 2 (after each Tab): is the active element a tagged focusable whose style is
// UNCHANGED vs its unfocused snapshot? If so, focus produced no visible indicator.
const FOCUS_CHECK_PROBE = `(() => {
  const e = document.activeElement;
  if (!e || e === document.body || e === document.documentElement) return null;
  const key = e.getAttribute && e.getAttribute('data-u11y-f');
  if (!key || !window.__u11yF || !window.__u11yF[key]) return null;
  const s = getComputedStyle(e);
  const now = [s.outlineStyle, s.outlineWidth, s.outlineColor, s.boxShadow, s.borderColor, s.borderTopWidth, s.borderBottomWidth, s.backgroundColor, s.color, s.textDecorationLine].join('|');
  const rec = window.__u11yF[key];
  return { key: key, changed: now !== rec.rest, selector: rec.sel, html: rec.html };
})()`;

// 1.4.13 Content on Hover — find triggers whose aria-describedby target is hidden, so
// hovering can reveal it. probeHover then checks it is dismissible (Escape).
const HOVER_SETUP_PROBE = `(() => { ${PRELUDE}
  const out = [];
  let n = 0;
  for (const e of Array.from(document.querySelectorAll('[aria-describedby]'))) {
    const id = (e.getAttribute('aria-describedby') || '').split(/\\s+/)[0];
    if (!id) continue;
    const t = document.getElementById(id);
    if (!t) continue;
    const s = getComputedStyle(t);
    const hidden = s.display === 'none' || s.visibility === 'hidden' || t.getBoundingClientRect().height === 0;
    if (!hidden) continue;
    const key = 'h' + n;
    e.setAttribute('data-u11y-h', key);
    out.push({ key: key, target: id, selector: __sel(e) });
    n++;
    if (n >= 10) break;
  }
  return out;
})()`;

function hoverVisibleExpr(id: string, wantHidden = false): string {
  const j = JSON.stringify(id);
  return `(() => { const t = document.getElementById(${j}); if (!t) return ${wantHidden ? "true" : "false"}; const s = getComputedStyle(t); const shown = s.display !== 'none' && s.visibility !== 'hidden' && t.getBoundingClientRect().height > 0; return ${wantHidden ? "!shown" : "shown"}; })()`;
}

async function probeFocusVisible(page: Any): Promise<ProbeHit[]> {
  const count = (await page.evaluate(FOCUS_SETUP_PROBE)) as number;
  if (!count) return [];
  const hits: ProbeHit[] = [];
  const seen = new Set<string>();
  const limit = Math.min(count + 2, 130);
  for (let i = 0; i < limit; i++) {
    await page.keyboard.press("Tab");
    const r = (await page.evaluate(FOCUS_CHECK_PROBE)) as { key: string; changed: boolean; selector: string; html: string } | null;
    if (!r) continue;
    if (seen.has(r.key)) break; // wrapped around the tab ring
    seen.add(r.key);
    if (!r.changed) {
      hits.push({
        selector: r.selector,
        html: r.html,
        detail: "Le focus clavier ne produit aucun changement visible (outline/box-shadow/bordure/fond) — focus non visible (2.4.7).",
      });
    }
    if (hits.length >= 20) break;
  }
  return hits;
}

async function probeHover(page: Any): Promise<ProbeHit[]> {
  const triggers = (await page.evaluate(HOVER_SETUP_PROBE)) as { key: string; target: string; selector: string }[];
  const hits: ProbeHit[] = [];
  for (const tr of triggers) {
    try {
      await page.hover(`[data-u11y-h="${tr.key}"]`);
    } catch {
      continue;
    }
    await page.waitForTimeout(150);
    const shown = (await page.evaluate(hoverVisibleExpr(tr.target))) as boolean;
    if (!shown) continue; // not actually a hover-revealed tooltip
    await page.keyboard.press("Escape");
    await page.waitForTimeout(100);
    const dismissed = (await page.evaluate(hoverVisibleExpr(tr.target, true))) as boolean;
    await page.mouse.move(2, 2).catch(() => {});
    if (!dismissed) {
      hits.push({
        selector: tr.selector,
        html: "",
        detail: `Le contenu révélé au survol (aria-describedby #${tr.target}) ne se masque pas avec Échap — Contenu au survol ou au focus (1.4.13).`,
      });
    }
    if (hits.length >= 8) break;
  }
  return hits;
}

const AXE_TAGS = ["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa", "best-practice"];

/** Drive one page through axe-core + every probe, returning a RunnerOutput. */
async function runOnPage(browser: Any, AxeBuilder: Any, target: string, isFile: boolean, storageState?: string): Promise<RunnerOutput> {
  const context = await browser.newContext(storageState ? { storageState } : {});
  const page = await context.newPage();
  try {
    const url = isFile ? "file://" + resolve(target) : target;
    await page.goto(url, { waitUntil: "load", timeout: 45000 });
    // Let the client hydrate and any framework JS inject content/landmarks (SPA routes,
    // DSFR JS) before measuring — otherwise axe/probes see the pre-hydration DOM and
    // report false "no h1 / not in a landmark". Bounded networkidle + a short settle.
    await page.waitForLoadState("networkidle", { timeout: 8000 }).catch(() => {});
    await page.waitForTimeout(1200);
    const axeRes = await new AxeBuilder({ page }).withTags(AXE_TAGS).analyze();
    const violations = (axeRes.violations as Any[]).map((v: Any) => ({
      id: v.id as string,
      impact: (v.impact ?? null) as string | null,
      help: v.help as string,
      tags: v.tags as string[],
      nodes: (v.nodes as Any[]).slice(0, 10).map((n: Any) => ({ target: (n.target as unknown[]).map(String), html: ((n.html as string) || "").slice(0, 200) })),
    }));
    // clean-DOM probes first (normal viewport), then viewport/zoom, then the
    // text-spacing override LAST (it mutates the page, so nothing runs after it).
    // Each probe is guarded: a single probe failing degrades to no findings for that
    // criterion rather than zeroing the whole page (axe results are already captured).
    const focusVisible = await probeFocusVisible(page).catch(() => [] as ProbeHit[]);
    const hover = await probeHover(page).catch(() => [] as ProbeHit[]);
    const reflowZoom = (await page.evaluate(REFLOW_ZOOM_PROBE).catch(() => [])) as ProbeHit[];
    await page.setViewportSize({ width: 320, height: 800 }).catch(() => {});
    const reflow = (await page.evaluate(REFLOW_PROBE).catch(() => ({ horizontalScroll: false }))) as { horizontalScroll: boolean };
    await page.setViewportSize({ width: 1280, height: 900 }).catch(() => {});
    await page.addStyleTag({ content: TEXT_SPACING_CSS }).catch(() => {});
    const textSpacing = (await page.evaluate(TEXT_SPACING_PROBE).catch(() => [])) as ProbeHit[];
    return { url: (page.url() as string) || target, violations, reflow, focusVisible, hover, reflowZoom, textSpacing };
  } finally {
    await context.close();
  }
}

export interface LocalScanOpts {
  target: string;
  cwd: string;
  storageState?: string;
  lang?: Lang;
}

/** Run the dynamic tier locally over a single URL/file (no Docker). */
export async function runScanLocal(opts: LocalScanOpts): Promise<DynamicResult> {
  const isUrl = /^https?:\/\//i.test(opts.target);
  if (!isUrl && !existsSync(opts.target)) {
    throw new Error(`File not found: ${opts.target}. Pass an http(s):// URL or an existing HTML file.`);
  }
  const isFile = !isUrl && statSync(opts.target).isFile();
  const { chromium, AxeBuilder } = resolveLocalDeps(opts.cwd);
  const browser = await launchChromium(chromium);
  try {
    const out = await runOnPage(browser, AxeBuilder, opts.target, isFile, opts.storageState);
    return toDynamicResult(out, opts.target, opts.lang ?? "en", LOCAL_ENGINE);
  } finally {
    await browser.close();
  }
}

export interface LocalManyOpts {
  cwd: string;
  storageState?: string;
  lang?: Lang;
}

/** Run the local dynamic tier over many URLs (one browser, one context per page). */
export async function runScanManyLocal(urls: string[], opts: LocalManyOpts): Promise<DynamicResult> {
  const { chromium, AxeBuilder } = resolveLocalDeps(opts.cwd);
  const browser = await launchChromium(chromium);
  const findings: DynamicFinding[] = [];
  try {
    for (const url of urls) {
      const out = await runOnPage(browser, AxeBuilder, url, false, opts.storageState);
      findings.push(...toDynamicResult(out, url, opts.lang ?? "en", LOCAL_ENGINE).findings);
    }
  } finally {
    await browser.close();
  }
  return { tool: "ultra11y", engine: LOCAL_ENGINE, target: `${urls.length} page(s)`, date: today(), findings };
}

/** Discover URLs (sitemap/crawl) then scan them all through the local dynamic tier. */
export async function runCrawlScanLocal(opts: DiscoverOpts & LocalManyOpts): Promise<DynamicResult> {
  const urls = await discoverUrls(opts);
  if (urls.length === 0) {
    throw new Error("No URL to scan (empty/unreachable sitemap, or entry page with no same-origin link).");
  }
  return runScanManyLocal(urls, opts);
}
