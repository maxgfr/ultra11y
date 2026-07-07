// Single source of truth for shared types + the embedded version. sync-version.mjs
// rewrites VERSION at release time (kept in lockstep with package.json + SKILL.md).
export const VERSION = "2.10.0";
export const SCHEMA_VERSION = 2;

// Lang = the UI FRAME's language — the `L` localization tables each module (report,
// check, verify, criteria…) renders in. NOT a country pack's own locale set, which may
// carry any BCP-47-ish tag ("de", "pt-BR"…) — see `LocaleString` in
// src/standards/types.ts for that decoupled, per-pack concept.
export type Lang = "fr" | "en";
export type Severity = "bloquant" | "majeur" | "mineur";
// C = conforme, NC = non conforme, NA = non applicable, manual = à évaluer
// (needs-rendering / judgment criteria the engine cannot decide on its own).
export type Status = "C" | "NC" | "NA" | "manual";
export type Automatability = "static" | "needs-rendering" | "judgment";
export type ParserKind = "html" | "css" | "jsx" | "cross";

export interface GlossaryEntry {
  title: string;
  body: string;
}
export type Glossary = Record<string, GlossaryEntry>;

// ---- WCAG 2.2 canonical core (src/data/wcag.json, produced by scripts/build-standards.mjs)
// The engine's canonical key. Success-criterion ids/titles/levels are derived from the
// official W3C source (https://github.com/w3c/wcag); rule coverage + automatability are
// engine-specific. RGAA and other country standards are derived packs (see src/standards/).
export type WcagLevel = "A" | "AA";

export interface Sc {
  sc: string; // dotted SC id, "<principle>.<guideline>.<n>", e.g. "1.4.3"
  principle: number; // 1..4
  guideline: string; // "1.4"
  title: string; // authoritative W3C English title
  // Authoritative French title from the W3C AUTHORIZED translation
  // (https://www.w3.org/Translations/WCAG22-fr/), vendored at scripts/vendor/wcag-2.2-fr.json.
  // Present on every core-AA SC (the build fails otherwise) — optional only so older
  // wcag.json snapshots still parse. See src/wcag.ts `scTitle`.
  titleFr?: string;
  level: WcagLevel;
  addedIn: string; // "2.0" | "2.1" | "2.2"
  automatability: Automatability;
  ruleIds: string[]; // engine rules contributing to this SC
  understanding: string; // W3C Understanding doc URL (manual-check grounding)
  techniques?: string[]; // language-neutral W3C technique codes
  tests?: string[]; // optional manual-check lines
  notes?: string;
}

export interface WcagPrinciple {
  number: number;
  title: string;
  titleFr?: string; // W3C authorized French translation — see Sc.titleFr
}
export interface WcagGuideline {
  number: string; // "1.4"
  title: string;
  titleFr?: string; // W3C authorized French translation — see Sc.titleFr
}

export interface WcagData {
  wcagVersion: string; // "2.2"
  level: string; // "AA"
  source: string;
  license: string;
  criteriaSource: string;
  principles: WcagPrinciple[];
  guidelines: WcagGuideline[];
  criteria: Sc[];
}

// ---- WCAG SC universe (src/data/wcag-universe.json, produced by
// scripts/build-standards.mjs --refresh-universe + build()): EVERY real WCAG 2.x
// success criterion — every level (A/AA/AAA), plus the obsolete/removed 4.1.1 Parsing —
// derived from the same vendored W3C source as the AA core, never invented. This is the
// guardrail a pack's out-of-core SC mapping (e.g. an AAA criterion, or the removed 4.1.1)
// is checked against, so validation never has to hardcode a single tolerated exception —
// see src/wcag.ts `knownScStatus` and src/standards/validate.ts `classifySc`.
export type ScStatus = "core-AA" | "out-of-core" | "removed";

export interface WcagUniverseEntry {
  id: string; // dotted SC id, e.g. "1.4.6"
  title: string;
  level: string; // "A" | "AA" | "AAA" | "" (no level ⇒ removed/obsolete)
  status: ScStatus;
}

export interface WcagUniverseData {
  wcagVersion: string;
  source: string;
  criteriaSource: string;
  provenance: string;
  criteria: WcagUniverseEntry[];
}

// ---- engine findings + audit result
export interface Finding {
  ruleId: string;
  criteriaId: string;
  file: string;
  line: number;
  col: number;
  selectorHint: string;
  severity: Severity;
  message: string;
  remediation: string;
  // Language-neutral resolution key (src/messages.ts MSG_CATALOG), additive/optional so
  // older AuditResult JSON (no `msg`) still renders via the baked message/remediation
  // above. `message`/`remediation` are the canonical ENGLISH bake (AI-facing); a renderer
  // resolves `msg` through resolveMessage/resolveRemediation for `--lang fr` (or any other
  // supported lang), falling back to the baked strings when absent or the id is unknown.
  msg?: { id: string; params?: Record<string, string | number> };
  snippet: string;
  // Source byte range of the anchoring element (htmlparser2 [start, end), open+close
  // tag). Optional so older AuditResult JSON still parses. Used by `fix` (codemods
  // edit by range) and by `init` baseline diffing (stable finding identity that
  // survives line drift). Absent for stdin/JSX findings where it would be unusable.
  sourceStart?: number;
  sourceEnd?: number;
  // Cross-file context: the OTHER site that explains this finding — e.g. the
  // component definition for a finding raised at a usage site. Optional/additive
  // (cross-file rules only), so existing AuditResult JSON still parses.
  // `note` is the canonical baked ENGLISH prose (mirrors message/remediation above);
  // `noteId` is an optional key into src/messages.ts's note catalog, resolved at
  // render time by `resolveNote` for `--lang fr` (or any other supported lang),
  // falling back to the baked `note` when absent or the id is unknown.
  related?: { file: string; line: number; col: number; selectorHint: string; note: string; noteId?: string };
  // AI signal: this finding was raised on a .vue/.svelte/.astro SOURCE template, whose
  // slot/dynamic-injected content is invisible to static analysis — so it is a
  // PRELIMINARY verdict to confirm against the rendered output, not a certainty.
  // Optional/additive (no schemaVersion bump); absent = full-confidence static finding.
  preliminary?: boolean;
  // Set when this finding was raised on a RENDERED capture file (real serialized DOM)
  // and re-attributed to the source component that produced it. `file`/`sourceStart`
  // still index the capture bytes (so `fix` and baseline diffing stay stable); origin
  // points back to the source. Optional/additive (no schemaVersion bump).
  origin?: { capture: string; sourceFile?: string; component?: string; sourceLine?: number };
}

export interface CriterionResult {
  id: string; // WCAG success-criterion id, e.g. "1.4.3"
  guideline: string; // WCAG guideline this SC belongs to, e.g. "1.4"
  status: Status;
  findings: Finding[];
  justification?: string;
}

export interface GuidelineTally {
  key: string; // WCAG guideline number, e.g. "1.4"
  title: string;
  c: number;
  nc: number;
  na: number;
  manual: number;
}

export interface ResidualRisk {
  criteriaId: string;
  reason: string;
  automatability: Automatability;
}

export interface AuditResult {
  tool: "ultra11y";
  standard: "wcag"; // self-describing: the engine keys on WCAG 2.2 SCs (packs are derived views)
  version: string;
  schemaVersion: number;
  date: string; // YYYY-MM-DD
  scope: {
    inputs: string[];
    files: number;
    // Set when `--max-files` capped discovery (highest-priority files audited first).
    truncated?: { limit: number; total: number; skipped: number };
    // Set when content de-duplication collapsed identical files to one canonical audit.
    dedup?: { canonicalFiles: number; duplicateFiles: number };
    // Set when source files render component-LIBRARY components whose real HTML
    // output is invisible to static source analysis (e.g. DSFR). The source verdict
    // is preliminary for them — audit the build output (`render`) or `scan`.
    rendered?: { opaqueLibraries: string[]; files: number };
    // Set when .vue/.svelte/.astro SOURCE templates were audited. Their slots,
    // snippets and dynamic bindings are invisible to static analysis, so findings on
    // them are PRELIMINARY — audit the rendered output (`render`/`scan`) to confirm.
    sourceTemplate?: { files: number; extensions: string[] };
    // Set when RENDERED capture files (real serialized DOM) were audited at full
    // fidelity — the true markup a component library / SFC emits, not its source call.
    captures?: { files: number; components: string[] };
    // Set by the coverage pass (`--require-captures` / `render --coverage`): which
    // components have a rendered capture vs which are still opaque-source-only blind
    // spots. Keys are "posix/path#Component". `unattributed` = capture files with no
    // resolvable source (no provenance) — audited, but not credited to a component.
    captureCoverage?: { total: number; covered: string[]; blindSpots: string[]; unattributed: number };
    // Set when at least one `<html lang>`/`xml:lang` was seen: the repo's declared
    // language(s) (primary BCP-47 subtag, e.g. "fr-FR" → "fr"), sorted by descending
    // frequency. Used as the CLI's `--lang auto` repo-detection signal (see
    // `resolveLang` in src/cli.ts) — never invented when no document declares one.
    langs?: string[];
  };
  guidelines: GuidelineTally[];
  criteria: CriterionResult[];
  findings: Finding[];
  residualRisks: ResidualRisk[];
  // Automatic static-check pass rate over the machine-DECIDABLE SCs only (the small
  // static set + any judgment SC that fired a definite NC). NOT a full conformance
  // rate — most SCs are needs-rendering/judgment and stay manual (residual risk).
  conformancePct: number;
}

// ---- optional dynamic tier (axe-core in a headless browser): Docker image, or a
// host/target Playwright resolved at runtime (`scan --local`). `engine` widens from
// the axe + 320px-reflow pair to the bespoke residual-criteria probes the local
// runtime adds (focus visibility, 200% zoom reflow, text spacing, content-on-hover)
// — the criteria axe alone cannot decide. (Target size 2.5.8 is left to axe's own rule.)
export type DynamicEngine = "axe" | "reflow" | "focus-visible" | "reflow-zoom" | "text-spacing" | "hover";

export interface DynamicFinding {
  criteriaId: string;
  axeRule: string;
  impact: string;
  severity: Severity;
  message: string;
  selector: string;
  snippet: string;
  engine: DynamicEngine;
  page?: string; // the scanned URL/page this finding came from (multi-page crawl)
}

export interface DynamicResult {
  tool: "ultra11y";
  engine: string; // e.g. "axe-core@playwright (docker)"
  target: string;
  date: string;
  findings: DynamicFinding[];
}
