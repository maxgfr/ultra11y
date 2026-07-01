#!/usr/bin/env node
// DEV-ONLY (not in `bin`). Builds the canonical WCAG 2.2 Level AA dataset that the
// engine ships at src/data/wcag.json. The success-criterion list (id/title/level/
// version-added/principle/guideline) is DERIVED PROGRAMMATICALLY from the official
// W3C source (https://github.com/w3c/wcag) — never hand-typed — by positional
// numbering of guidelines/index.html, then decorated with the engine-specific
// fields (rule coverage, automatability, and manual-test seeds rolled up from any
// shipped standards pack). WCAG 2.2 © W3C, reused under the W3C Document License;
// only SC ids/titles/levels are reproduced. See NOTICE.
//
// Usage:
//   node scripts/build-standards.mjs                 # emit src/data/wcag.json from the vendored snapshot
//   node scripts/build-standards.mjs --offline       # same (alias; the snapshot is always local)
//   node scripts/build-standards.mjs --refresh <dir> # re-derive the vendored snapshot from a w3c/wcag checkout
import { writeFileSync, readFileSync, readdirSync, existsSync, mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const DATA = join(root, "src", "data");
const VENDOR = join(root, "scripts", "vendor", "wcag-2.2-sc.json");
const PACKS_DIR = join(DATA, "standards");

const VER_DIR = { 20: "2.0", 21: "2.1", 22: "2.2" };

// ---------------------------------------------------------------------------
// Refresh mode: parse a w3c/wcag checkout into the vendored SC snapshot.
// SC numbers are positional within guidelines/index.html (principle → guideline →
// success-criterion include order) — exactly how the W3C Eleventy build numbers
// them. The obsolete 4.1.1 Parsing is still physically listed (so it must be
// counted to keep 4.1.2 correct) but has no conformance level and is dropped below.
// ---------------------------------------------------------------------------
function deriveSnapshot(srcDir) {
  const idx = readFileSync(join(srcDir, "guidelines", "index.html"), "utf8");
  const tok =
    /<section class="(principle|guideline)" id="([^"]+)">|<h([23])>\s*([\s\S]*?)\s*<\/h\3>|data-include="sc\/(\d+)\/([^"]+)\.html"/g;
  let p = 0,
    g = 0,
    s = 0,
    curP = null,
    curG = null,
    awaitP = false,
    awaitG = false;
  const principles = [];
  const guidelines = [];
  const criteria = [];
  let m;
  while ((m = tok.exec(idx))) {
    if (m[1] === "principle") {
      p++;
      g = 0;
      curP = { number: p, id: m[2], title: "" };
      principles.push(curP);
      awaitP = true;
    } else if (m[1] === "guideline") {
      g++;
      s = 0;
      curG = { number: `${p}.${g}`, id: m[2], title: "" };
      guidelines.push(curG);
      awaitG = true;
    } else if (m[3] === "2" && awaitP) {
      curP.title = m[4].replace(/\s+/g, " ").trim();
      awaitP = false;
    } else if (m[3] === "3" && awaitG) {
      curG.title = m[4].replace(/\s+/g, " ").trim();
      awaitG = false;
    } else if (m[5]) {
      s++;
      const version = Number(m[5]);
      const slug = m[6];
      const frag = readFileSync(join(srcDir, "guidelines", "sc", m[5], `${slug}.html`), "utf8");
      const title = (frag.match(/<h4>\s*([\s\S]*?)\s*<\/h4>/) || [])[1]?.replace(/\s+/g, " ").trim() ?? "";
      const level = (frag.match(/<p class="conformance-level">\s*([A]{1,3})\s*<\/p>/) || [])[1] ?? "";
      criteria.push({ sc: `${p}.${g}.${s}`, slug, title, level, addedIn: VER_DIR[version], principle: p, guideline: curG.number });
    }
  }
  const aa = criteria.filter((c) => (c.level === "A" || c.level === "AA") && c.sc !== "4.1.1");
  const usedGuidelines = new Set(aa.map((c) => c.guideline));
  const snapshot = {
    wcagVersion: "2.2",
    source: "https://www.w3.org/TR/WCAG22/",
    criteriaSource: "https://github.com/w3c/wcag",
    principles: principles.map((x) => ({ number: x.number, title: x.title })),
    guidelines: guidelines.filter((x) => usedGuidelines.has(x.number)).map((x) => ({ number: x.number, title: x.title })),
    criteria: aa,
  };
  mkdirSync(dirname(VENDOR), { recursive: true });
  writeFileSync(VENDOR, JSON.stringify(snapshot, null, 2) + "\n");
  console.log(`build-standards --refresh: ${aa.length} A/AA criteria derived from ${srcDir} → ${VENDOR}`);
  return snapshot;
}

// ---------------------------------------------------------------------------
// Engine-specific decoration (the only hand-maintained part: which SCs the static
// engine can fully decide, which need a rendered DOM, and the per-SC rule coverage).
// ---------------------------------------------------------------------------

// An SC is `static` (absence of a finding can be reported Conforming) ONLY when the
// engine both detects every failure AND can judge applicability. WCAG SCs are coarser
// than the rules, so this set is deliberately tiny — every other mapped SC raises
// DEFINITE non-conformities on a finding and stays `manual` (residual risk) otherwise,
// never silently Conforming.
const STATIC = new Set(["1.4.2", "2.4.2", "3.1.1"]);

// SCs that fundamentally need a rendered DOM (computed colour/layout/focus/zoom).
// They may still carry rules that raise definite NCs; no finding ⇒ `manual`.
const NEEDS_RENDERING = new Set([
  "1.3.4", "1.4.1", "1.4.3", "1.4.4", "1.4.5", "1.4.10", "1.4.11", "1.4.12", "1.4.13",
  "2.1.2", "2.3.1", "2.4.7", "2.4.11", "2.5.8",
]);

// SC → engine rule ids. Inverse of the per-finding rule→SC map. Rules whose findings
// branch across SCs (clickable-noninteractive, lang-invalid, autoplay-media,
// icon-only-control-unnamed) appear under BOTH their SCs so registry's bidirectional
// rule↔dataset cross-check holds.
const RULE_SC_COVERAGE = {
  "1.1.1": ["img-alt-missing", "canvas-fallback-missing", "decorative-alt-misuse", "input-image-alt-missing", "object-embed-no-name", "chart-no-accessible-name"],
  "1.2.2": ["media-no-track"],
  "1.3.1": [
    "fieldset-legend-missing", "data-table-no-headers", "table-caption-missing",
    "layout-table-data-markup", "heading-order-skip", "h1-missing", "h1-multiple", "list-structure",
    "empty-heading", "label-for-dangling", "missing-main-landmark", "multiple-main-landmark",
    "sortable-header-no-aria-sort",
  ],
  "1.3.5": ["field-purpose-incomplete"],
  "1.4.2": ["autoplay-media"],
  "1.4.3": ["contrast-literal"],
  "1.4.4": ["meta-viewport-zoom-block"],
  "2.1.1": ["clickable-noninteractive"],
  "2.2.1": ["meta-refresh-redirect"],
  "2.2.2": ["autoplay-media", "blink-marquee"],
  "2.4.1": ["skip-link-target-missing"],
  "2.4.2": ["title-missing-empty"],
  "2.4.3": ["positive-tabindex"],
  "2.4.4": ["link-empty-name", "icon-only-control-unnamed"],
  "3.1.1": ["html-lang-missing", "lang-invalid"],
  "3.1.2": ["inline-lang-change-missing", "lang-invalid"],
  "3.3.1": ["aria-invalid-no-description", "error-not-associated"],
  "4.1.2": [
    "iframe-title-missing", "invalid-aria-role", "aria-ref-missing-id", "redundant-aria",
    "clickable-noninteractive", "aria-required-children", "aria-hidden-focusable", "nested-interactive",
    "duplicate-id", "control-label-missing", "placeholder-as-label", "form-field-multiple-labels",
    "select-has-option", "button-empty-name", "icon-only-control-unnamed", "control-name-title-only",
    "field-purpose-incomplete",
  ],
  "4.1.3": ["live-region-conflict", "status-message-not-assertive"],
};

function automatabilityOf(sc) {
  if (STATIC.has(sc)) return "static";
  if (NEEDS_RENDERING.has(sc)) return "needs-rendering";
  return "judgment";
}

// Best-effort, language-NEUTRAL technique seeds: roll up any shipped standards pack's
// criteria (or the legacy src/data/rgaa.json) onto the WCAG SCs they map to. Only the
// W3C technique CODES (e.g. "H36", "ARIA6") are carried — they are language-neutral, so
// the WCAG core stays English-clean. Localized test PROSE stays in the packs; the WCAG
// `verify` worklist grounds on these codes + each SC's W3C Understanding URL instead.
function seedFromPacks() {
  const techniques = {}; // sc -> string[]
  const sources = [];
  if (existsSync(PACKS_DIR)) {
    for (const f of readdirSync(PACKS_DIR)) if (f.endsWith(".json") && !f.endsWith(".glossary.json")) sources.push(join(PACKS_DIR, f));
  }
  const legacy = join(DATA, "rgaa.json");
  if (!sources.length && existsSync(legacy)) sources.push(legacy);
  for (const path of sources) {
    let pack;
    try {
      pack = JSON.parse(readFileSync(path, "utf8"));
    } catch {
      continue;
    }
    for (const c of pack.criteria || []) {
      // Pack maps to bare SC ids ("1.1.1"); legacy rgaa.json carries "1.1.1 Title (A)".
      const scs = (c.wcag || []).map((w) => String(w).trim().split(/\s+/)[0]);
      for (const sc of scs) if (Array.isArray(c.techniques)) (techniques[sc] ??= []).push(...c.techniques);
    }
  }
  const dedup = (m) => Object.fromEntries(Object.entries(m).map(([k, v]) => [k, [...new Set(v)].sort()]));
  return { techniques: dedup(techniques), sources };
}

function build() {
  if (!existsSync(VENDOR)) {
    console.error(`build-standards: missing vendored snapshot ${VENDOR}. Run: node scripts/build-standards.mjs --refresh <w3c/wcag checkout>`);
    process.exit(1);
  }
  const snap = JSON.parse(readFileSync(VENDOR, "utf8"));
  const { techniques, sources } = seedFromPacks();

  const criteria = snap.criteria.map((c) => {
    const sc = {
      sc: c.sc,
      principle: c.principle,
      guideline: c.guideline,
      title: c.title,
      level: c.level,
      addedIn: c.addedIn,
      automatability: automatabilityOf(c.sc),
      ruleIds: RULE_SC_COVERAGE[c.sc] || [],
      understanding: `https://www.w3.org/WAI/WCAG22/Understanding/${c.slug}.html`,
    };
    if (techniques[c.sc]?.length) sc.techniques = techniques[c.sc];
    return sc;
  });

  const out = {
    wcagVersion: snap.wcagVersion,
    level: "AA",
    source: snap.source,
    license: "W3C Document License",
    criteriaSource: snap.criteriaSource,
    principles: snap.principles,
    guidelines: snap.guidelines,
    criteria,
  };
  mkdirSync(DATA, { recursive: true });
  writeFileSync(join(DATA, "wcag.json"), JSON.stringify(out, null, 2) + "\n");

  // --- guards
  const all = new Set(criteria.map((c) => c.sc));
  const missingForRules = Object.keys(RULE_SC_COVERAGE).filter((sc) => !all.has(sc));
  if (missingForRules.length) {
    console.error(`build-standards: RULE_SC_COVERAGE references SCs absent from the dataset: ${missingForRules.join(", ")}`);
    process.exit(1);
  }
  // Any pack referencing an SC not in the core is a dangling ref (e.g. dropped 4.1.1).
  for (const path of sources) {
    const pack = JSON.parse(readFileSync(path, "utf8"));
    if (!pack.criteria) continue;
    const dangling = new Set();
    for (const c of pack.criteria) for (const w of c.wcag || []) {
      const id = String(w).trim().split(/\s+/)[0];
      if (!all.has(id)) dangling.add(id);
    }
    if (dangling.size) console.warn(`build-standards: ${path} maps to SCs absent from WCAG 2.2 AA core: ${[...dangling].sort().join(", ")} (expected for dropped/AAA SCs like 4.1.1)`);
  }

  const tally = { static: 0, "needs-rendering": 0, judgment: 0 };
  for (const c of criteria) tally[c.automatability]++;
  console.log(`build-standards: ${criteria.length} WCAG 2.2 A/AA criteria → src/data/wcag.json`);
  console.log(`build-standards: automatability — static ${tally.static}, needs-rendering ${tally["needs-rendering"]}, judgment ${tally.judgment}`);
  console.log(`build-standards: seeded techniques from ${sources.length ? sources.map((s) => s.replace(root + "/", "")).join(", ") : "(no pack found — empty)"}`);
}

const refreshIdx = process.argv.indexOf("--refresh");
if (refreshIdx !== -1) deriveSnapshot(process.argv[refreshIdx + 1]);
build();
