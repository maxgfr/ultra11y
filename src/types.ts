// Single source of truth for shared types + the embedded version. sync-version.mjs
// rewrites VERSION at release time (kept in lockstep with package.json + SKILL.md).
export const VERSION = "2.0.0";
export const SCHEMA_VERSION = 1;

export type Lang = "fr" | "en";
export type Severity = "bloquant" | "majeur" | "mineur";
// C = conforme, NC = non conforme, NA = non applicable, manual = à évaluer
// (needs-rendering / judgment criteria the engine cannot decide on its own).
export type Status = "C" | "NC" | "NA" | "manual";
export type Automatability = "static" | "needs-rendering" | "judgment";
export type ParserKind = "html" | "css" | "jsx" | "cross";

// ---- RGAA reference data (src/data/rgaa.json, produced by scripts/fetch-rgaa.mjs)
export interface Criterion {
  id: string; // dotted "<theme>.<n>", e.g. "1.1"
  theme: number; // 1..13
  title: string; // French, may contain [term](#glossary-anchor) links
  titlePlain: string; // anchors reduced to their label
  tests: Record<string, string[]>;
  wcag: string[]; // e.g. ["1.1.1 Non-text Content (A)"]
  techniques: string[]; // e.g. ["H36", "H37"]
  technicalNote?: string[];
  particularCases?: string[];
  automatability: Automatability;
  ruleIds: string[]; // engine rules contributing to this criterion
}

export interface Theme {
  number: number;
  name: string;
  count: number;
}

export interface RgaaData {
  rgaaVersion: string; // "4.1.2"
  wcagVersion: string; // "2.1"
  source: string;
  license: string;
  themes: Theme[];
  criteria: Criterion[];
}

export interface GlossaryEntry {
  title: string;
  body: string;
}
export type Glossary = Record<string, GlossaryEntry>;

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
  related?: { file: string; line: number; col: number; selectorHint: string; note: string };
}

export interface CriterionResult {
  id: string;
  theme: number;
  status: Status;
  findings: Finding[];
  justification?: string;
}

export interface ThemeTally {
  number: number;
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
  };
  themes: ThemeTally[];
  criteria: CriterionResult[];
  findings: Finding[];
  residualRisks: ResidualRisk[];
  conformancePct: number;
}

// ---- optional Docker dynamic tier (axe-core in a headless browser)
export interface DynamicFinding {
  criteriaId: string;
  axeRule: string;
  impact: string;
  severity: Severity;
  message: string;
  selector: string;
  snippet: string;
  engine: "axe" | "reflow";
  page?: string; // the scanned URL/page this finding came from (multi-page crawl)
}

export interface DynamicResult {
  tool: "ultra11y";
  engine: string; // e.g. "axe-core@playwright (docker)"
  target: string;
  date: string;
  findings: DynamicFinding[];
}
