// Project a WCAG-keyed AuditResult DOWN onto a pack's criteria — the inverse of the old
// presentation-only WCAG view (former src/standard.ts). For each pack criterion, gather
// the results of the WCAG SCs it maps to and fold them with the same NC-dominates rule.
// Presentation-only: the canonical, gated verdict lives on the WCAG core.
import type { AuditResult, CriterionResult, Status, Finding } from "../types.js";
import { loadPack } from "./registry.js";

export interface PackCriterionResult {
  id: string;
  theme: number;
  status: Status;
  findings: Finding[];
  scs: string[]; // contributing WCAG SCs
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
    const scResults = pc.wcag.map((sc) => byScId.get(sc)).filter((x): x is CriterionResult => !!x);
    const findings = scResults.flatMap((r) => r.findings);
    const status: Status = scResults.length ? aggregate(scResults.map((r) => r.status)) : "NA";
    return { id: pc.id, theme: pc.theme, status, findings, scs: pc.wcag };
  });
}
