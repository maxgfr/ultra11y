// Project a WCAG-keyed AuditResult DOWN onto a pack's criteria — the inverse of the old
// presentation-only WCAG view (former src/standard.ts). For each pack criterion, gather
// the results of the WCAG SCs it maps to and fold them with the same NC-dominates rule.
// Presentation-only: the canonical, gated verdict lives on the WCAG core.
import type { AuditResult, CriterionResult, Status, Finding } from "../types.js";
import { loadPack } from "./registry.js";
import { knownScStatus } from "../wcag.js";

export interface PackCriterionResult {
  id: string;
  theme: number;
  status: Status;
  findings: Finding[];
  scs: string[]; // contributing WCAG SCs
  // Set when EVERY WCAG SC this criterion maps to is outside the engine's WCAG 2.2 AA
  // core (out-of-core AAA, or removed) — the engine has no core SC to project a verdict
  // from, so it's neither a genuine C/NC/NA, just permanently out of scope (status
  // "manual" — see src/report.ts renderPackReport for the dedicated justification).
  outOfScope?: boolean;
}

// NC dominates (a real failure anywhere fails the criterion); then a decided C; then
// manual (residual); else NA. Mirrors the core's aggregation.
function aggregate(statuses: Status[]): Status {
  if (statuses.includes("NC")) return "NC";
  if (statuses.includes("C")) return "C";
  if (statuses.includes("manual")) return "manual";
  return "NA";
}

export function derivePackResults(audit: AuditResult, packKey: string): PackCriterionResult[] {
  const pack = loadPack(packKey);
  const byScId = new Map(audit.criteria.map((c) => [c.id, c]));
  return pack.criteria.map((pc) => {
    // A criterion whose WCAG mapping is ENTIRELY outside the engine's core (e.g. RGAA 8.1
    // → only the removed 4.1.1, or a hypothetical pack criterion citing only an AAA SC)
    // has no core SC the engine could ever audit — it's out of scope, not a silent NA.
    const outOfScope = pc.wcag.every((sc) => {
      const s = knownScStatus(sc);
      return s === "out-of-core" || s === "removed";
    });
    if (outOfScope) {
      return { id: pc.id, theme: pc.theme, status: "manual" as Status, findings: [], scs: pc.wcag, outOfScope: true };
    }
    const scResults = pc.wcag.map((sc) => byScId.get(sc)).filter((x): x is CriterionResult => !!x);
    const findings = scResults.flatMap((r) => r.findings);
    const status: Status = scResults.length ? aggregate(scResults.map((r) => r.status)) : "NA";
    return { id: pc.id, theme: pc.theme, status, findings, scs: pc.wcag };
  });
}
