// `check` — structural integrity gate on a produced report. Catches the ways a
// report can lie: a section dropped, a cited criterion that doesn't exist in
// RGAA, an NA without a justification, a missing conformance rate. Exit non-zero
// on any issue. This is the anti-hallucination guard around the audit deliverable.
import { hasCriterion } from "./rgaa.js";

export interface CheckResult {
  ok: boolean;
  issues: string[];
}

const CRIT_REF = /(\d{1,2}\.\d{1,2})\s*—/g;

export function checkReport(md: string): CheckResult {
  const issues: string[] = [];

  // 1. required sections (language-agnostic: "## 1." … "## 5.")
  for (let n = 1; n <= 5; n++) {
    if (!new RegExp(`^##\\s+${n}\\.`, "m").test(md)) issues.push(`Section ${n} manquante dans le rapport.`);
  }

  // 2. every cited criterion id must resolve to a real RGAA criterion
  const seen = new Set<string>();
  let m: RegExpExecArray | null;
  CRIT_REF.lastIndex = 0;
  while ((m = CRIT_REF.exec(md))) {
    const id = m[1]!;
    if (seen.has(id)) continue;
    seen.add(id);
    if (!hasCriterion(id)) issues.push(`Critère inexistant cité dans le rapport : ${id}.`);
  }

  // 3. every NA entry must carry a justification (section 4 list items)
  const naSection = sectionBody(md, 4);
  for (const line of naSection.split("\n")) {
    const item = /^-\s+(\d{1,2}\.\d{1,2})\s*—/.exec(line);
    if (item && !line.includes("_")) issues.push(`Critère NA sans justification : ${item[1]}.`);
  }

  // 4. a conformance rate must be present
  if (!/\d+\s*%/.test(md)) issues.push("Taux de conformité absent de l'en-tête du rapport.");

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
