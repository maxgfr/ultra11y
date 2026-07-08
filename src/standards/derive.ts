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
  // Set when a mapped SC DID fail, but on elements outside this criterion's applicability
  // scope (per the pack's `appliesTo`) — so the criterion is NOT non-conformant off a
  // sibling's failure. It derives as `manual` (assess separately) with a dedicated
  // scoped-out justification (see src/report.ts renderPackReport).
  scopedOut?: boolean;
}

// NC dominates (a real failure anywhere fails the criterion); then a decided C; then
// manual (residual); else NA. Mirrors the core's aggregation.
function aggregate(statuses: Status[]): Status {
  if (statuses.includes("NC")) return "NC";
  if (statuses.includes("C")) return "C";
  if (statuses.includes("manual")) return "manual";
  return "NA";
}

/** Does a finding's ruleId satisfy one of a criterion's applicability patterns?
 *  Exact match, or a "prefix:*" wildcard (axe:* / dyn-* / agent:*), or a bare "*". */
function ruleMatches(ruleId: string, patterns: string[]): boolean {
  for (const p of patterns) {
    if (p === "*") return true;
    if (p.endsWith(":*") || p.endsWith("-*")) {
      if (ruleId.startsWith(p.slice(0, -1))) return true;
    } else if (p === ruleId) return true;
  }
  return false;
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
    const allFindings = scResults.flatMap((r) => r.findings);

    // No applicability data (third-party pack) → legacy fan-out: every mapped SC's
    // findings attach and the SC statuses aggregate directly.
    if (!pc.appliesTo) {
      const status: Status = scResults.length ? aggregate(scResults.map((r) => r.status)) : "NA";
      return { id: pc.id, theme: pc.theme, status, findings: allFindings, scs: pc.wcag };
    }

    // Applicability-aware projection: a finding attaches ONLY if its rule is one this
    // criterion can actually be non-conformant on.
    const findings = allFindings.filter((f) => ruleMatches(f.ruleId, pc.appliesTo!.ruleIds));
    if (findings.length) {
      return { id: pc.id, theme: pc.theme, status: "NC" as Status, findings, scs: pc.wcag };
    }
    // A mapped SC failed but on out-of-scope elements (no applicable finding) → the NC is
    // NOT ours: derive as manual (assess separately), never a foreign NC, never a silent C.
    if (scResults.some((r) => r.status === "NC")) {
      return { id: pc.id, theme: pc.theme, status: "manual" as Status, findings: [], scs: pc.wcag, scopedOut: true };
    }
    // Otherwise the ordinary non-NC aggregate (C / manual / NA) over the mapped SCs.
    const status: Status = scResults.length ? aggregate(scResults.map((r) => r.status)) : "NA";
    return { id: pc.id, theme: pc.theme, status, findings: [], scs: pc.wcag };
  });
}
