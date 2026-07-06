// `check` — structural integrity gate on a produced report. Catches the ways a
// report can lie: a section dropped, a cited criterion that doesn't exist in the
// active standard, an NA without a justification, a missing pass rate. Exit non-zero
// on any issue. This is the anti-hallucination guard around the audit deliverable.
// The canonical WCAG report is keyed by 3-segment success criteria (1.4.3); a pack
// report by the pack's own 2-segment ids (RGAA 8.3) — the id grammar is per-standard
// so the version token "WCAG 2.2 —" can never be mistaken for a criterion.
import type { Lang } from "./types.js";
import { hasSC } from "./wcag.js";
import { type StandardId, isCore, loadPack, hasId, idCaptureSource } from "./standards/index.js";

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
  },
  en: {
    section: (n: number) => `Section ${n} missing from the report.`,
    crit: (id: string) => `Non-existent criterion cited in the report: ${id}.`,
    na: (id: string) => `NA criterion without a justification: ${id}.`,
    rateMissing: "Pass rate missing from the report header.",
    rateRange: (v: string) => `Pass rate out of range (0–100): ${v}%.`,
  },
} as const;

export function checkReport(md: string, standard: StandardId = "wcag", lang: Lang = "en"): CheckResult {
  const issues: string[] = [];
  const s = M[lang];
  const core = isCore(standard);
  const pack = core ? null : loadPack(standard);
  const exists = (id: string) => (core ? hasSC(id) : hasId(pack!, id));
  // Core = the fixed 3-segment WCAG grammar (1.4.3). A pack's grammar is whatever its own
  // `idPattern` declares (RGAA's 2-segment "8.3", a hypothetical Section 508 "E205.4"…) —
  // built from the pack itself so the version token "WCAG 2.2 —" can never be mistaken
  // for a criterion, without the engine hardcoding a single fixed pack shape.
  const critRef = core ? /(\d{1,2}(?:\.\d{1,2}){2})\s*—/g : new RegExp(`(${idCaptureSource(pack!)})\\s*—`, "g");
  const naItem = core ? /^-\s+(?:[A-Za-z]+\s+)?(\d{1,2}(?:\.\d{1,2}){2})\s*—/ : new RegExp(`^-\\s+(?:[A-Za-z]+\\s+)?(${idCaptureSource(pack!)})\\s*—`);

  // 1. required sections (language-agnostic: "## 1." … "## 5.")
  for (let n = 1; n <= 5; n++) {
    if (!new RegExp(`^##\\s+${n}\\.`, "m").test(md)) issues.push(s.section(n));
  }

  // 2. every cited criterion id must resolve to a real criterion in the active standard
  const seen = new Set<string>();
  let m: RegExpExecArray | null;
  critRef.lastIndex = 0;
  while ((m = critRef.exec(md))) {
    const id = m[1]!;
    if (seen.has(id)) continue;
    seen.add(id);
    if (!exists(id)) issues.push(s.crit(id));
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

  return { ok: issues.length === 0, issues };
}

/** The body of section N (between "## N." and the next "## "). */
function sectionBody(md: string, n: number): string {
  const start = new RegExp(`^##\\s+${n}\\.`, "m").exec(md);
  if (!start) return "";
  const from = start.index + start[0].length;
  const next = /^##\s+/m.exec(md.slice(from));
  return next ? md.slice(from, from + next.index) : md.slice(from);
}
