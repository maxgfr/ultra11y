import { realpathSync, writeFileSync, mkdirSync, existsSync } from "node:fs";
import { join, relative, sep } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { VERSION, type Lang, type AuditResult, type DynamicResult } from "./types.js";
import { runAudit } from "./audit.js";
import { writeReport } from "./report.js";
import { writePrd, prdUnits } from "./prd.js";
import { ghAvailable, pushIssues } from "./gh.js";
import { detectFrameworks, renderPlan, ssrHarness, type Detection } from "./render.js";
import { runCriteria } from "./criteria.js";
import { checkReport } from "./check.js";
import { buildWorklist, writeWorklist, applyVerdicts, VERIFY_MAX, type VerifyItem } from "./verify.js";
import { runScan, runCrawlScan, mergeDynamic, cleanDynamic } from "./scan.js";
import { runFix, fixSummary } from "./fix.js";
import { diffAgainstBaseline, baselineSummary, parseFailOn, findingsAtOrAbove } from "./baseline.js";
import { repoRoot, writeHook, writeCi } from "./init.js";
import { auditSummary } from "./output.js";
import { parseStandard } from "./standard.js";
import { readStdin, readText } from "./util.js";

const HELP = `ultra11y v${VERSION}
Audit HTML/CSS/JSX for RGAA 4.1.2 + WCAG 2.1/2.2 AA accessibility and produce a
dated compliance report, or author/review accessible markup (native-HTML-first).
A deterministic, install-free static engine plus your judgment, with check/verify
gates against hallucinated non-conformities.

Usage:
  ultra11y audit    <globs… | -> [--out <dir>] [--include <glob>] [--exclude <glob>] [--ext <list>] [--jsx] [--graph] [--json] [--lang fr|en]
  ultra11y audit    [--changed | --since <ref>] [--max-files <n>] [--dedup exact|normalized|off] [--baseline <file>] [--fail-on bloquant|majeur|mineur]
  ultra11y report   --in <audit.json> [--out <dir>] [--standard rgaa|wcag] [--lang fr|en]
  ultra11y prd      --in <audit.json> [--out <dir>] [--split criterion] [--gh-issues] [--lang fr|en]
  ultra11y render   [<dir>] [--scaffold] [--out <file>] [--json] [--lang fr|en]
  ultra11y criteria [<id>] [--theme <N>] [--list] [--standard rgaa|wcag] [--json] [--lang fr|en]
  ultra11y check    --report <md> [--quiet] [--json]
  ultra11y verify   --report <md> [--semantic] [--apply <verdicts.json>] [--max-verify <n>] [--out <dir>] [--json]
  ultra11y fix      <globs… | -> [--write] [--iterate] [--changed | --since <ref>] [--include <glob>] [--exclude <glob>] [--ext <list>] [--only <ids>] [--jsx] [--json] [--lang fr|en]
  ultra11y init     [--hook] [--ci] [--baseline] [--fail-on bloquant|majeur|mineur]
  ultra11y scan     <url|file> [--merge <audit.json>] [--out <dir>] [--docker] [--json]
  ultra11y scan     --sitemap <url> | --crawl <url> [--depth <n>] [--max <n>] [--merge <audit.json>] [--json]
  ultra11y scan     --clean        (remove the dynamic-tier Docker image + temp contexts)

Commands:
  audit      Run the static engine over the inputs (files/globs, or '-' for stdin)
             and emit an AuditResult JSON (consumed by 'report'). Without --json,
             prints a French summary. The engine decides the machine-detectable
             criteria; you supply the judgment + needs-rendering ones.
  report     Render an AuditResult into a dated RGAA compliance report
             (audits/rgaa-YYYY-MM-DD.md): metadata, per-theme synthesis table,
             non-conformities by priority, conforming + not-applicable lists.
  prd        Turn an AuditResult into an actionable "fixes to do" backlog
             (audits/prd-YYYY-MM-DD.md), grouped by criterion and sectioned by
             priority; --split criterion writes one PRD file per criterion, and
             --gh-issues files one de-duplicated GitHub issue per criterion (gh CLI).
  render     Get RENDERED HTML to audit (so component libraries like DSFR are
             checked as the HTML they emit, not their JSX sources): detect the
             framework and print the build→audit recipe, or --scaffold a
             react-dom/server SSR snapshot harness to fill in. Then audit the
             produced HTML, and use scan for the needs-rendering criteria.
  criteria   Look up the RGAA reference offline: one criterion, a whole theme,
             or the 13-theme list. Carries WCAG cross-refs + automatability class.
  check      Integrity gate on a produced report: every cited criterion resolves,
             every NA is justified, sections + conformance maths are well-formed.
  verify     Adversarial claim↔criterion worklist for the report's non-conformities,
             then (--apply) gate on refuted/unsupported findings.
  fix        Put the fixes in place (hybrid, native-first): apply deterministic
             codemods (tabindex, redundant role, viewport zoom), insert fill-in
             placeholders (alt/lang/title TODO) for the agent to complete, and list
             judgment-only proposals. --dry-run (default) prints a diff; --write
             applies, but only after a re-audit proves no new NC; on real-AST JSX
             only jsxSafe codemods apply (never name-rewriting). --iterate loops to a fixpoint.
  init       Wire ultra11y into the repo as a regression gate (zero-dep, no husky):
             a git pre-commit --hook (audit --changed, vs HEAD) and/or a GitHub
             Actions --ci job (audit --since the PR base ref), both gating against
             --baseline so only NEW blocking NCs fail; --baseline writes
             audits/baseline.json (the committed reference).
  scan       OPTIONAL dynamic tier: run axe-core in a headless browser (Docker) to
             decide the needs-rendering criteria the static engine can't — computed
             contrast (3.2/3.3), 320px reflow (10.11) — over a URL or HTML file.
             --merge folds the findings into a static AuditResult (manual → C/NC).
             --sitemap/--crawl scan many pages (every sitemap URL, or same-origin
             links BFS-crawled from a start URL) and aggregate the findings.

Options:
  --out <dir>        audit/report: output dir for AuditResult + report  (default: audits)
  --in <file>        report: the AuditResult JSON to render ('-' for stdin)
  --include <glob>   audit/fix: only include paths matching (comma-separated)
  --exclude <glob>   audit/fix: skip paths matching (comma-separated)
  --ext <list>       audit/fix: extra file extensions to walk (e.g. .twig,.erb);
                     .html/.htm/.xhtml/.jsx/.tsx/.vue/.svelte/.astro are built-in
  --jsx              audit/fix: force JSX/TSX parsing for inputs of any extension
  --graph            audit: also resolve imports + run cross-file rules (alias --cross-file)
  --cross-file       audit: alias of --graph
  --changed          audit/fix: only files changed vs HEAD (git; for hooks/CI)
  --since <ref>      audit/fix: only files changed vs the given git ref
  --max-files <n>    audit: cap canonical files audited (logged truncation, no silent drop)
  --dedup <mode>     audit: collapse identical files — exact|normalized|off  (default: exact)
  --standard <std>   report/criteria: key the output by rgaa|wcag  (default: rgaa)
  --split <mode>     prd: split the backlog — currently only 'criterion' (one file per criterion)
  --gh-issues        prd: also create one GitHub issue per criterion via the gh CLI (opt-in)
  --scaffold         render: write an SSR-snapshot harness (default: ultra11y-render.tsx)
  --write            fix: apply fixes to disk (default is a dry-run diff)
  --iterate          fix: with --write, re-audit + re-apply mechanical fixes until stable (bounded)
  --dry-run          fix: preview only — never write (this is the default)
  --only <ids>       fix: limit auto-fixes to these rule ids (comma-separated)
  --baseline <file>  audit/init: regression-gate vs / write this baseline AuditResult
  --fail-on <sev>    audit/init: gate severity — bloquant|majeur|mineur  (default: bloquant)
  --hook             init: write a git pre-commit accessibility gate
  --ci               init: write a GitHub Actions accessibility gate
  --report <file>    check/verify: the report markdown to gate
  --theme <N>        criteria: list the criteria of theme N (1..13)
  --list             criteria: print the 13-theme table
  --apply <file>     verify: reduce a filled verdicts file to a pass/fail gate
  --max-verify <n>   verify: cap the worklist size                       (default: 40)
  --merge <file>     scan: fold dynamic findings into this AuditResult JSON
  --sitemap <url>    scan: scan every URL listed in a sitemap.xml
  --crawl <url>      scan: BFS same-origin links from a start URL (served HTML)
  --depth <n>        scan: crawl link-hop depth from the start URL          (default: 2)
  --max <n>          scan: cap on pages scanned (sitemap/crawl)             (default: 50)
  --docker           scan: run the dynamic tier in Docker (default; built on first use)
  --clean            scan: remove the dynamic-tier image + temp contexts, then exit
  --semantic         verify: fold the support-check into one pass
  --lang fr|en       output language                                     (default: fr)
  --json             machine-readable output
  --quiet            check: exit code only, no output
  -h, --help         show this help
  -v, --version      print version

Data: RGAA 4.1.2 © DINUM, Licence Ouverte / Etalab 2.0 (see NOTICE).`;

const COMMANDS = ["audit", "report", "prd", "render", "criteria", "check", "verify", "scan", "fix", "init"] as const;
type Command = (typeof COMMANDS)[number];

function isCommand(s: string | undefined): s is Command {
  return !!s && (COMMANDS as readonly string[]).includes(s);
}

const VALUE_FLAGS = new Set([
  "out",
  "in",
  "include",
  "exclude",
  "ext",
  "report",
  "theme",
  "apply",
  "max-verify",
  "lang",
  "merge",
  "sitemap",
  "crawl",
  "depth",
  "max",
  "since",
  "max-files",
  "dedup",
  "only",
  "standard",
  "baseline",
  "fail-on",
  "split",
]);
// `init` treats --baseline as a boolean selector ("write the baseline"), not a
// path, so it must NOT consume the following token. audit/fix keep it as a value
// flag (`--baseline <file>`). Without this split, `init --baseline --hook` swallows
// --hook, and `init --baseline` never matches the `=== true` selector in cmdInit.
const INIT_VALUE_FLAGS = new Set([...VALUE_FLAGS].filter((f) => f !== "baseline"));

function valueFlagsFor(command: string): ReadonlySet<string> {
  return command === "init" ? INIT_VALUE_FLAGS : VALUE_FLAGS;
}

export interface ParsedArgs {
  command: string;
  positionals: string[];
  flags: Record<string, string | boolean>;
}

export function parseArgs(argv: string[]): ParsedArgs {
  const [command, ...rest] = argv;
  const valueFlags = valueFlagsFor(command ?? "");
  const positionals: string[] = [];
  const flags: Record<string, string | boolean> = {};
  for (let i = 0; i < rest.length; i++) {
    const a = rest[i]!;
    if (a.startsWith("--")) {
      const key = a.slice(2);
      if (valueFlags.has(key)) flags[key] = rest[++i] ?? "";
      else flags[key] = true;
    } else if (a.startsWith("-") && a !== "-") {
      flags[a.slice(1)] = true;
    } else {
      positionals.push(a);
    }
  }
  return { command: command ?? "", positionals, flags };
}

function langOf(flags: Record<string, string | boolean>): Lang {
  return flags.lang === "en" ? "en" : "fr";
}

function asList(v: string | boolean | undefined): string[] | undefined {
  return typeof v === "string" && v ? [v] : undefined;
}

async function cmdAudit(p: ParsedArgs): Promise<number> {
  const inputs = p.positionals.length ? p.positionals : ["."];
  if (inputs.length === 0) {
    console.error("ultra11y audit: provide files/globs, or '-' to read stdin.");
    return 2;
  }
  const stdin = inputs.includes("-") ? await readStdin() : undefined;
  const since = typeof p.flags.since === "string" ? (p.flags.since as string) : undefined;
  const dedupFlag = p.flags.dedup;
  const result = runAudit({
    inputs,
    stdin,
    forceJsx: p.flags.jsx === true,
    include: asList(p.flags.include),
    exclude: asList(p.flags.exclude),
    ext: asList(p.flags.ext),
    changed: p.flags.changed === true || since !== undefined,
    since,
    dedup: dedupFlag === "normalized" || dedupFlag === "off" ? dedupFlag : undefined,
    maxFiles: typeof p.flags["max-files"] === "string" ? Number(p.flags["max-files"]) : undefined,
    graph: p.flags.graph === true || p.flags["cross-file"] === true,
    onWarn: (m) => console.error(m),
  });

  const out = typeof p.flags.out === "string" ? (p.flags.out as string) : "audits";
  try {
    mkdirSync(out, { recursive: true });
    writeFileSync(join(out, "audit-latest.json"), JSON.stringify(result, null, 2) + "\n");
  } catch {
    /* non-fatal: still print the result */
  }

  // Regression-gate mode (used by the init hook / CI): diff against a committed
  // baseline and exit non-zero only on NEW non-conformities at/above --fail-on.
  const baselineFlag = p.flags.baseline;
  if (typeof baselineFlag === "string" && baselineFlag) {
    let baseline = null;
    if (existsSync(baselineFlag)) {
      try {
        baseline = JSON.parse(readText(baselineFlag)) as AuditResult;
      } catch {
        console.error(`ultra11y audit: --baseline ${baselineFlag} is not valid JSON; treating as empty.`);
      }
    }
    const diff = diffAgainstBaseline(result, baseline, parseFailOn(p.flags["fail-on"]));
    if (p.flags.json) console.log(JSON.stringify(diff, null, 2));
    else console.log(baselineSummary(diff, langOf(p.flags)));
    return diff.ok ? 0 : 1;
  }

  // Standalone gate: `--fail-on` without a baseline gates the WHOLE audit by exit
  // code (linter-style), not just newly-introduced findings. Only triggers when
  // --fail-on is passed explicitly, so a plain `audit` still always exits 0.
  if (p.flags["fail-on"] !== undefined) {
    const failOn = parseFailOn(p.flags["fail-on"]);
    const failing = findingsAtOrAbove(result.findings, failOn);
    if (p.flags.json) console.log(JSON.stringify(result, null, 2));
    else {
      console.log(auditSummary(result, langOf(p.flags)));
      if (failing.length)
        console.error(langOf(p.flags) === "fr" ? `✗ ${failing.length} non-conformité(s) ≥ ${failOn}.` : `✗ ${failing.length} non-conformity(ies) ≥ ${failOn}.`);
    }
    return failing.length ? 1 : 0;
  }

  if (p.flags.json) console.log(JSON.stringify(result, null, 2));
  else console.log(auditSummary(result, langOf(p.flags)));
  return 0;
}

function cmdInit(p: ParsedArgs): number {
  const root = repoRoot() ?? process.cwd();
  let engineRel = process.argv[1] ?? "scripts/ultra11y.mjs";
  try {
    const abs = realpathSync(engineRel);
    engineRel = abs.startsWith(root + sep) ? relative(root, abs) : abs;
  } catch {
    /* keep as-is */
  }
  const failOn = parseFailOn(p.flags["fail-on"]);
  const want = { hook: p.flags.hook === true, ci: p.flags.ci === true, baseline: p.flags.baseline === true };
  if (!want.hook && !want.ci && !want.baseline) {
    want.hook = true;
    want.baseline = true; // sensible default: local gate + its baseline
  }
  const wrote: string[] = [];
  if (want.baseline) {
    const inputs = p.positionals.length ? p.positionals : ["."];
    const result = runAudit({ inputs, onWarn: (m) => console.error(m) });
    mkdirSync(join(root, "audits"), { recursive: true });
    const bp = join(root, "audits", "baseline.json");
    writeFileSync(bp, JSON.stringify(result, null, 2) + "\n");
    wrote.push(bp);
  }
  if (want.hook) wrote.push(writeHook(root, engineRel, failOn));
  if (want.ci) wrote.push(writeCi(root, engineRel, failOn));
  for (const w of wrote) console.log(`ultra11y init: wrote ${w}`);
  console.log(`ultra11y init: done. Commit audits/baseline.json so the gate has a reference.`);
  return 0;
}

function cmdCriteria(p: ParsedArgs): number {
  const themeFlag = p.flags.theme;
  return runCriteria({
    id: p.positionals[0],
    theme: typeof themeFlag === "string" && themeFlag ? Number(themeFlag) : undefined,
    list: p.flags.list === true,
    json: p.flags.json === true,
    lang: langOf(p.flags),
    standard: parseStandard(p.flags.standard),
  });
}

async function cmdReport(p: ParsedArgs): Promise<number> {
  const inFlag = p.flags.in;
  if (typeof inFlag !== "string" || !inFlag) {
    console.error("ultra11y report: --in <audit.json> is required ('-' for stdin).");
    return 2;
  }
  const raw = inFlag === "-" ? await readStdin() : readText(inFlag);
  let result: AuditResult;
  try {
    result = JSON.parse(raw) as AuditResult;
  } catch {
    console.error("ultra11y report: --in is not valid JSON (expected an AuditResult).");
    return 2;
  }
  if (result.tool !== "ultra11y" || !Array.isArray(result.criteria)) {
    console.error("ultra11y report: input is not an ultra11y AuditResult.");
    return 2;
  }
  const out = typeof p.flags.out === "string" ? (p.flags.out as string) : "audits";
  const path = writeReport(result, { out, lang: langOf(p.flags), standard: parseStandard(p.flags.standard) });
  console.log(path);
  return 0;
}

async function cmdPrd(p: ParsedArgs): Promise<number> {
  const inFlag = p.flags.in;
  if (typeof inFlag !== "string" || !inFlag) {
    console.error("ultra11y prd: --in <audit.json> is required ('-' for stdin).");
    return 2;
  }
  const raw = inFlag === "-" ? await readStdin() : readText(inFlag);
  let result: AuditResult;
  try {
    result = JSON.parse(raw) as AuditResult;
  } catch {
    console.error("ultra11y prd: --in is not valid JSON (expected an AuditResult).");
    return 2;
  }
  if (result.tool !== "ultra11y" || !Array.isArray(result.criteria)) {
    console.error("ultra11y prd: input is not an ultra11y AuditResult.");
    return 2;
  }
  const out = typeof p.flags.out === "string" ? (p.flags.out as string) : "audits";
  const lang = langOf(p.flags);
  const split = p.flags.split === "criterion" ? "criterion" : undefined;
  const paths = writePrd(result, { out, lang, split });
  for (const path of paths) console.log(path);

  // --gh-issues: always-written markdown above; GitHub is opt-in + best-effort.
  if (p.flags["gh-issues"] === true) {
    const units = prdUnits(result);
    if (!ghAvailable()) {
      console.error("ultra11y prd: --gh-issues skipped — `gh` is not installed or not authenticated (run `gh auth login`). Markdown was still written.");
    } else if (units.length === 0) {
      console.error("ultra11y prd: --gh-issues skipped — no findings to file.");
    } else {
      const r = pushIssues(units, lang);
      console.log(`ultra11y prd: GitHub issues — ${r.created} créée(s), ${r.skipped} déjà existante(s)${r.failed ? `, ${r.failed} en échec` : ""}.`);
    }
  }
  return 0;
}

function cmdRender(p: ParsedArgs): number {
  const root = p.positionals[0] ?? ".";
  const lang = langOf(p.flags);
  if (p.flags.scaffold === true) {
    const out = typeof p.flags.out === "string" && p.flags.out ? p.flags.out : "ultra11y-render.tsx";
    try {
      writeFileSync(out, ssrHarness());
    } catch (e) {
      console.error(`ultra11y render: could not write ${out}: ${e instanceof Error ? e.message : String(e)}`);
      return 1;
    }
    console.log(
      lang === "fr"
        ? `Harnais SSR écrit : ${out}\nComplétez COMPONENTS, exécutez-le (ex. npx tsx ${out}), puis : node scripts/ultra11y.mjs audit "audits/rendered/**/*.html"`
        : `SSR harness written: ${out}\nFill in COMPONENTS, run it (e.g. npx tsx ${out}), then: node scripts/ultra11y.mjs audit "audits/rendered/**/*.html"`,
    );
    return 0;
  }
  let deps: Record<string, string> = {};
  const pkgPath = join(root, "package.json");
  if (existsSync(pkgPath)) {
    try {
      const pkg = JSON.parse(readText(pkgPath)) as { dependencies?: Record<string, string>; devDependencies?: Record<string, string> };
      deps = { ...(pkg.dependencies ?? {}), ...(pkg.devDependencies ?? {}) };
    } catch {
      /* not fatal — detection just sees no deps */
    }
  }
  const detection: Detection = detectFrameworks(deps, (f) => existsSync(join(root, f)));
  if (p.flags.json) console.log(JSON.stringify(detection, null, 2));
  else console.log(renderPlan(detection, lang));
  return 0;
}

function cmdCheck(p: ParsedArgs): number {
  const rep = p.flags.report;
  if (typeof rep !== "string" || !rep) {
    console.error("ultra11y check: --report <md> is required.");
    return 2;
  }
  const res = checkReport(readText(rep));
  if (p.flags.json) {
    console.log(JSON.stringify(res, null, 2));
  } else if (!p.flags.quiet) {
    if (res.ok) console.log("✓ Rapport valide : sections, critères cités et justifications NA cohérents.");
    else for (const i of res.issues) console.error(`✗ ${i}`);
  }
  return res.ok ? 0 : 1;
}

function cmdVerify(p: ParsedArgs): number {
  const apply = p.flags.apply;
  if (typeof apply === "string" && apply) {
    // Read and parse separately so a missing file is not mislabeled as bad JSON.
    let raw: string;
    try {
      raw = readText(apply);
    } catch {
      console.error(`ultra11y verify: --apply file introuvable : ${apply}.`);
      return 2;
    }
    let items: VerifyItem[];
    try {
      items = JSON.parse(raw) as VerifyItem[];
    } catch {
      console.error("ultra11y verify: --apply file is not valid JSON.");
      return 2;
    }
    if (!Array.isArray(items)) {
      console.error("ultra11y verify: --apply must be a JSON array of verdicts.");
      return 2;
    }
    const r = applyVerdicts(items);
    if (p.flags.json) console.log(JSON.stringify(r, null, 2));
    else if (r.ok) console.log(`✓ ${r.total} non-conformités vérifiées, toutes étayées.`);
    else
      console.error(
        `✗ ${r.failures.length}/${r.total} en échec (refuted ${r.refuted}, unsupported ${r.unsupported}, non statué ${r.unadjudicated}${r.invalid ? `, invalide ${r.invalid}` : ""}).`,
      );
    return r.ok ? 0 : 1;
  }

  const rep = p.flags.report;
  if (typeof rep !== "string" || !rep) {
    console.error("ultra11y verify: --report <md> is required (or --apply <verdicts.json>).");
    return 2;
  }
  let max = VERIFY_MAX;
  const mvFlag = p.flags["max-verify"];
  if (typeof mvFlag === "string" && mvFlag !== "") {
    const n = Number(mvFlag);
    if (!Number.isInteger(n) || n < 0) {
      console.error("ultra11y verify: --max-verify must be a non-negative integer.");
      return 2;
    }
    max = n;
  }
  const items = buildWorklist(readText(rep), max);
  const out = typeof p.flags.out === "string" ? (p.flags.out as string) : ".";
  const { todoPath, mdPath, count } = writeWorklist(items, out, p.flags.semantic === true);
  console.log(`${count} non-conformité(s) à vérifier → ${mdPath}, ${todoPath}`);
  return 0;
}

async function cmdFix(p: ParsedArgs): Promise<number> {
  const inputs = p.positionals.length ? p.positionals : ["."];
  const stdin = inputs.includes("-") ? await readStdin() : undefined;
  const since = typeof p.flags.since === "string" ? (p.flags.since as string) : undefined;
  const write = p.flags.write === true;
  const onlyFlag = p.flags.only;
  if (onlyFlag === "" || (typeof onlyFlag === "string" && !onlyFlag.trim())) {
    console.error("ultra11y fix: --only requires one or more rule ids (comma-separated).");
    return 2;
  }
  const opts = {
    inputs,
    stdin,
    forceJsx: p.flags.jsx === true,
    include: asList(p.flags.include),
    exclude: asList(p.flags.exclude),
    ext: asList(p.flags.ext),
    changed: p.flags.changed === true || since !== undefined,
    since,
    only:
      typeof onlyFlag === "string"
        ? onlyFlag
            .split(",")
            .map((s) => s.trim())
            .filter(Boolean)
        : undefined,
    write,
    onWarn: (m: string) => console.error(m),
  };

  // --iterate: re-audit and re-apply the mechanical fixes until a round writes
  // nothing new (bounded). Each round re-reads files, so it converges quickly —
  // a codemod removes the finding it fixed, so it is not re-applied. Round 1 holds
  // the meaningful diff; later rounds just confirm stability (or catch cascades).
  const result = runFix(opts);
  let rounds = 1;
  let totalWritten = result.totals.filesWritten;
  if (write && p.flags.iterate === true) {
    const MAX_ROUNDS = 5;
    let last = result;
    while (last.totals.filesWritten > 0 && rounds < MAX_ROUNDS) {
      last = runFix(opts);
      rounds++;
      totalWritten += last.totals.filesWritten;
    }
  }

  if (p.flags.json) console.log(JSON.stringify(p.flags.iterate === true ? { ...result, rounds, totalWritten } : result, null, 2));
  else {
    console.log(fixSummary(result, langOf(p.flags), write));
    if (write && p.flags.iterate === true)
      console.log(
        langOf(p.flags) === "fr"
          ? `\nItéré sur ${rounds} passe(s) jusqu'à stabilité — ${totalWritten} fichier(s) écrit(s) au total.`
          : `\nIterated over ${rounds} round(s) to a fixpoint — ${totalWritten} file(s) written in total.`,
      );
  }
  return 0;
}

async function cmdScan(p: ParsedArgs): Promise<number> {
  if (p.flags.clean) {
    const r = cleanDynamic();
    console.log(`Nettoyage : image dynamique ${r.imageRemoved ? "supprimée" : "absente"}, ${r.tempContextsRemoved} contexte(s) temporaire(s) supprimé(s).`);
    return 0;
  }
  const sitemap = typeof p.flags.sitemap === "string" ? (p.flags.sitemap as string) : undefined;
  const crawl = typeof p.flags.crawl === "string" ? (p.flags.crawl as string) : undefined;
  let dynamic: DynamicResult;
  try {
    if (sitemap || crawl) {
      const depth = typeof p.flags.depth === "string" ? Number(p.flags.depth) : undefined;
      const max = typeof p.flags.max === "string" ? Number(p.flags.max) : undefined;
      dynamic = await runCrawlScan({ sitemap, crawl, depth, max });
    } else {
      const target = p.positionals.find((a) => a !== "-");
      if (!target) {
        console.error("ultra11y scan: provide a URL or HTML file, --sitemap <url>, --crawl <url>, or --clean.");
        return 2;
      }
      dynamic = runScan({ target });
    }
  } catch (e) {
    console.error(`ultra11y scan: ${e instanceof Error ? e.message : String(e)}`);
    return 1;
  }
  const out = typeof p.flags.out === "string" ? (p.flags.out as string) : "audits";
  const mergeIn = p.flags.merge;
  if (typeof mergeIn === "string" && mergeIn) {
    let audit: AuditResult;
    try {
      audit = JSON.parse(readText(mergeIn)) as AuditResult;
    } catch {
      console.error("ultra11y scan: --merge is not valid JSON (expected an AuditResult).");
      return 2;
    }
    if (audit.tool !== "ultra11y" || !Array.isArray(audit.criteria)) {
      console.error("ultra11y scan: --merge input is not an ultra11y AuditResult.");
      return 2;
    }
    const merged = mergeDynamic(audit, dynamic);
    mkdirSync(out, { recursive: true });
    writeFileSync(join(out, "audit-latest.json"), JSON.stringify(merged, null, 2) + "\n");
    if (p.flags.json) console.log(JSON.stringify(merged, null, 2));
    else
      console.log(
        `Audit statique + dynamique fusionné → ${join(out, "audit-latest.json")} (${merged.conformancePct}% conformité, ${merged.findings.length} findings).`,
      );
    return 0;
  }
  if (p.flags.json) console.log(JSON.stringify(dynamic, null, 2));
  else {
    console.log(`Audit dynamique (${dynamic.engine}) de ${dynamic.target} — ${dynamic.findings.length} non-conformité(s) :`);
    for (const f of dynamic.findings.slice(0, 30)) console.log(`  [${f.criteriaId}] ${f.selector} — ${f.message}`);
  }
  return 0;
}

export async function main(argv: string[]): Promise<number> {
  const first = argv[0];

  if (!first || first === "-h" || first === "--help") {
    console.log(HELP);
    return 0;
  }
  if (first === "-v" || first === "--version") {
    console.log(VERSION);
    return 0;
  }
  if (!isCommand(first)) {
    console.error(`ultra11y: unknown command "${first}". Run \`ultra11y --help\`.`);
    return 2;
  }

  const p = parseArgs(argv);
  // `<cmd> --help` / `<cmd> -h` shows help with NO side effects. Without this every
  // subcommand ignored the flag and ran — and `init --help` would write a hook +
  // baseline into the cwd repo.
  if (p.flags.help === true || p.flags.h === true) {
    console.log(HELP);
    return 0;
  }
  switch (p.command as Command) {
    case "audit":
      return cmdAudit(p);
    case "report":
      return cmdReport(p);
    case "prd":
      return cmdPrd(p);
    case "render":
      return cmdRender(p);
    case "criteria":
      return cmdCriteria(p);
    case "check":
      return cmdCheck(p);
    case "verify":
      return cmdVerify(p);
    case "scan":
      return cmdScan(p);
    case "fix":
      return cmdFix(p);
    case "init":
      return cmdInit(p);
    default:
      console.error(`ultra11y: "${p.command}" is not implemented yet`);
      return 1;
  }
}

// Only run when invoked directly (node scripts/ultra11y.mjs), not when imported
// by tests. Realpath both sides: Node canonicalizes import.meta.url but leaves
// process.argv[1] as-typed, so on a symlinked path (macOS /tmp → /private/tmp)
// a raw URL compare silently fails and main() never runs.
function isInvokedDirectly(): boolean {
  const argv1 = process.argv[1];
  if (argv1 === undefined) return false;
  const modulePath = fileURLToPath(import.meta.url);
  try {
    if (realpathSync(argv1) === realpathSync(modulePath)) return true;
  } catch {
    /* a path may be virtual — fall through */
  }
  return import.meta.url === pathToFileURL(argv1).href;
}

if (isInvokedDirectly()) {
  main(process.argv.slice(2)).then(
    (code) => process.exit(code),
    (err: unknown) => {
      console.error(err instanceof Error ? err.message : err);
      process.exit(1);
    },
  );
}
