// `check` — structural integrity gate on a produced report. Catches the ways a
// report can lie: a section dropped, a cited criterion that doesn't exist in the
// active standard, an NA without a justification, a missing pass rate. Exit non-zero
// on any issue. This is the anti-hallucination guard around the audit deliverable.
// The canonical WCAG report is keyed by 3-segment success criteria (1.4.3); a pack
// report by the pack's own 2-segment ids (RGAA 8.3) — the id grammar is per-standard
// so the version token "WCAG 2.2 —" can never be mistaken for a criterion.
import { existsSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import type { AuditResult, Lang } from "./types.js";
import { hasSC } from "./wcag.js";
import { type StandardId, isCore, loadPack, hasId, idCaptureSource, derivePackResults } from "./standards/index.js";
import { buildWorklist, applyVerdicts, type VerifyItem } from "./verify.js";
import { groundItems } from "./grounding.js";

export interface CheckResult {
  ok: boolean;
  issues: string[];
}

const M = {
  fr: {
    section: (n: number) => `Section ${n} manquante dans le rapport.`,
    crit: (id: string) => `Critère inexistant cité dans le rapport : ${id}.`,
    na: (id: string) => `Critère NA sans justification : ${id}.`,
    rateMissing: "Taux de réussite absent de l'en-tête du rapport.",
    rateRange: (v: string) => `Taux de réussite hors bornes (0–100) : ${v}%.`,
    overProject: (id: string) =>
      `Critère sur-projeté : ${id} est marqué non conforme dans le rapport mais l'audit ne le dérive pas comme NC (élément hors périmètre du critère).`,
    underProject: (id: string) => `Critère absent : l'audit dérive ${id} comme non conforme mais le rapport ne le présente pas.`,
    semanticMissing: (p: string) =>
      `Gate sémantique : aucun artefact de verdicts trouvé (${p}). Générez la worklist (\`verify --report <md>\`), statuez, puis relancez — ou passez \`--verdicts <fichier>\`.`,
    semanticUnreadable: (p: string) => `Gate sémantique : artefact de verdicts illisible ou JSON invalide : ${p}.`,
    semanticGate: (failed: number, total: number) => `Gate sémantique : ${failed}/${total} verdict(s) en échec (non statué, réfuté, non étayé ou non couvert).`,
    semanticGround: (issue: string) => `Gate sémantique : ${issue}`,
  },
  en: {
    section: (n: number) => `Section ${n} missing from the report.`,
    crit: (id: string) => `Non-existent criterion cited in the report: ${id}.`,
    na: (id: string) => `NA criterion without a justification: ${id}.`,
    rateMissing: "Pass rate missing from the report header.",
    rateRange: (v: string) => `Pass rate out of range (0–100): ${v}%.`,
    overProject: (id: string) =>
      `Over-projected criterion: ${id} is marked non-conformant in the report but the audit does not derive it as NC (element outside the criterion's scope).`,
    underProject: (id: string) => `Missing criterion: the audit derives ${id} as non-conformant but the report does not present it.`,
    semanticMissing: (p: string) =>
      `Semantic gate: no verdicts artifact found (${p}). Generate the worklist (\`verify --report <md>\`), adjudicate it, then re-run — or pass \`--verdicts <file>\`.`,
    semanticUnreadable: (p: string) => `Semantic gate: verdicts artifact unreadable or invalid JSON: ${p}.`,
    semanticGate: (failed: number, total: number) => `Semantic gate: ${failed}/${total} verdict(s) failing (unadjudicated, refuted, unsupported or uncovered).`,
    semanticGround: (issue: string) => `Semantic gate: ${issue}`,
  },
} as const;

export interface CheckOpts {
  /** When given (with a pack standard), the applicability gate (R1) re-derives the pack
   *  view from this audit and fails on any NC criterion the report over- or under-projects. */
  audit?: AuditResult;
}

export function checkReport(md: string, standard: StandardId = "wcag", lang: Lang = "en", opts: CheckOpts = {}): CheckResult {
  const issues: string[] = [];
  const s = M[lang];
  const core = isCore(standard);
  const pack = core ? null : loadPack(standard);
  const exists = (id: string) => (core ? hasSC(id) : hasId(pack!, id));
  // Core = the fixed 3-segment WCAG grammar (1.4.3). A pack's grammar is whatever its own
  // `idPattern` declares (RGAA's 2-segment "8.3", a hypothetical Section 508 "E205.4"…) —
  // built from the pack itself so the version token "WCAG 2.2 —" can never be mistaken
  // for a criterion, without the engine hardcoding a single fixed pack shape.
  const idGrammar = core ? "\\d{1,2}(?:\\.\\d{1,2}){2}" : idCaptureSource(pack!);
  // A REAL criterion always renders "<id> — <title>", so "<id> —" (below) recognizes it
  // wherever it sits. But a FABRICATED id has no title (the lookup fails), so the auditor
  // block renders it BARE — on its "### 🔴 <id>" heading and its "**<criterion>** :" /
  // "**WCAG** :" lines with no em-dash. Anchoring ONLY on "<id> —" is therefore blind to
  // fabrications by construction (the exact P0 the gate exists to stop), so we ALSO scan
  // those bare structural positions. The trailing `(?=\s|—|$)` lookahead keeps a pack's
  // 2-segment grammar from mis-matching a 3-segment WCAG mapping ref (e.g. "1.3.1" on a
  // pack's **WCAG** line stops at "1.3" then a ".", never a boundary).
  const bound = "(?=\\s|—|$)";
  const critRefs = [
    new RegExp(`(${idGrammar})\\s*—`, "g"), // "<id> — <title>" (real criteria, anywhere)
    new RegExp(`^#{2,4}\\s+\\S+\\s+(?:.*?\\s)?(${idGrammar})${bound}`, "gm"), // auditor-block heading "### 🔴 <id>" (pack: "### 🔴 RGAA <id>")
    new RegExp(`^\\*\\*[^*\\n]+\\*\\*\\s*:\\s*(${idGrammar})${bound}`, "gm"), // "**Success criterion** : <id>" / "**WCAG** : <id>"
  ];
  const naItem = core ? /^-\s+(?:[A-Za-z]+\s+)?(\d{1,2}(?:\.\d{1,2}){2})\s*—/ : new RegExp(`^-\\s+(?:[A-Za-z]+\\s+)?(${idCaptureSource(pack!)})\\s*—`);

  // 1. required sections (language-agnostic: "## 1." … "## 5.")
  for (let n = 1; n <= 5; n++) {
    if (!new RegExp(`^##\\s+${n}\\.`, "m").test(md)) issues.push(s.section(n));
  }

  // 2. every cited criterion id must resolve to a real criterion in the active standard
  const seen = new Set<string>();
  for (const critRef of critRefs) {
    let m: RegExpExecArray | null;
    critRef.lastIndex = 0;
    while ((m = critRef.exec(md))) {
      const id = m[1]!;
      if (seen.has(id)) continue;
      seen.add(id);
      if (!exists(id)) issues.push(s.crit(id));
    }
  }

  // 3. every NA entry must carry a justification (section 4 list items)
  const naSection = sectionBody(md, 4);
  for (const line of naSection.split("\n")) {
    const item = naItem.exec(line);
    if (item && !line.includes("_")) issues.push(s.na(item[1]!));
  }

  // 4. a pass rate must be present in a header bullet AND be a sane 0–100 value
  const rateM = /^-\s+\*\*[^*\n]*\*\*\s*:\s*(\d+(?:[.,]\d+)?)\s*%/m.exec(md);
  if (!rateM) {
    issues.push(s.rateMissing);
  } else {
    const pct = parseFloat(rateM[1]!.replace(",", "."));
    if (pct < 0 || pct > 100) issues.push(s.rateRange(rateM[1]!));
  }

  // 5. applicability gate (pack + --in audit): the report's non-conformant criteria set
  // must EQUAL what the audit derives with applicability (src/standards/derive.ts). Catches
  // a hand-edited report that over-projects an NC onto an inapplicable criterion (RGAA R1),
  // or drops a real one. Only runs for a pack standard with an audit in hand.
  if (!core && pack && opts.audit) {
    const derivedNc = new Set(
      derivePackResults(opts.audit, standard)
        .filter((r) => r.status === "NC")
        .map((r) => r.id),
    );
    const reportNc = packReportNcIds(md, idCaptureSource(pack));
    for (const id of reportNc) if (!derivedNc.has(id)) issues.push(s.overProject(id));
    for (const id of derivedNc) if (!reportNc.has(id)) issues.push(s.underProject(id));
  }

  return { ok: issues.length === 0, issues };
}

/** The set of criterion ids the report presents as non-conformant — parsed from the
 *  section-2 auditor blocks' "**<criterion>** : <id> — …" lines (the theme line "8." can't
 *  match the 2-segment id grammar, so it's never mistaken for a criterion). */
function packReportNcIds(md: string, idGrammar: string): Set<string> {
  const body = sectionBody(md, 2);
  const re = new RegExp(`^\\*\\*[^*\\n]+\\*\\*\\s*:\\s*(${idGrammar})\\s*—`, "gm");
  const ids = new Set<string>();
  let m: RegExpExecArray | null;
  while ((m = re.exec(body))) ids.add(m[1]!);
  return ids;
}

export interface SemanticOptions {
  /** Path of the report file — anchors the artifact auto-discovery. */
  reportPath: string;
  /** Explicit verdicts artifact; default: `VERIFY.todo.json` next to the report. */
  verdictsPath?: string;
  standard?: StandardId;
  lang?: Lang;
  /** Base dir for resolving the citations' relative file paths (default: cwd). */
  cwd?: string;
}

export interface SemanticResult {
  ok: boolean;
  issues: string[];
  total: number;
  grounded: number;
  moved: number;
  failed: number;
}

/** `check --semantic` — the support-level gate above the structural `checkReport`.
 *  Fails CLOSED: no adjudicated verdicts artifact → fail (a green semantic exit must
 *  always mean the gate actually engaged). Coverage is re-derived from the report
 *  UNCAPPED, so a truncated worklist can't hide non-conformities; every passing
 *  verdict is then re-grounded content-level against the cited source (grounding.ts). */
export function checkSemantic(md: string, opts: SemanticOptions): SemanticResult {
  const lang = opts.lang ?? "en";
  const standard = opts.standard ?? "wcag";
  const s = M[lang];
  const empty = { total: 0, grounded: 0, moved: 0, failed: 0 };

  const artifact = opts.verdictsPath ?? join(dirname(opts.reportPath), "VERIFY.todo.json");
  if (!existsSync(artifact)) return { ok: false, issues: [s.semanticMissing(artifact)], ...empty };
  let items: VerifyItem[];
  try {
    const parsed: unknown = JSON.parse(readFileSync(artifact, "utf8"));
    if (!Array.isArray(parsed)) throw new Error("not an array");
    items = parsed as VerifyItem[];
  } catch {
    return { ok: false, issues: [s.semanticUnreadable(artifact)], ...empty };
  }

  const issues: string[] = [];
  const expected = buildWorklist(md, standard, Number.POSITIVE_INFINITY);
  const gate = applyVerdicts(items, expected);
  if (!gate.ok) issues.push(s.semanticGate(gate.failures.length, gate.total));

  // Content-level re-validation of every verdict that passed the adjudication gate.
  const passing = items.filter((it) => typeof it.verdict === "string" && ["supported", "partial"].includes(it.verdict.trim().toLowerCase()));
  const grounding = groundItems(
    passing.map((it) => ({ file: it.file, line: it.line, selector: it.selector, snippet: (it as { snippet?: string }).snippet })),
    { cwd: opts.cwd },
  );
  for (const issue of grounding.issues) issues.push(s.semanticGround(issue));

  return { ok: issues.length === 0, issues, total: gate.total, grounded: grounding.grounded, moved: grounding.moved, failed: grounding.failed };
}

/** The body of section N (between "## N." and the next "## "). */
function sectionBody(md: string, n: number): string {
  const start = new RegExp(`^##\\s+${n}\\.`, "m").exec(md);
  if (!start) return "";
  const from = start.index + start[0].length;
  const next = /^##\s+/m.exec(md.slice(from));
  return next ? md.slice(from, from + next.index) : md.slice(from);
}
