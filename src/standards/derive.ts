// Project a WCAG-keyed AuditResult DOWN onto a pack's criteria — the inverse of the old
// presentation-only WCAG view (former src/standard.ts). For each pack criterion, gather
// the results of the WCAG SCs it maps to and fold them with the same NC-dominates rule.
// Presentation-only: the canonical, gated verdict lives on the WCAG core.
import type { AuditResult, CriterionResult, Status, Finding, Severity } from "../types.js";
import { loadPack } from "./registry.js";
import { knownScStatus } from "../wcag.js";
import type { PackOverride } from "./types.js";

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

/** Apply a pack's normativity/severity overrides to a finding WITHIN the pack projection.
 *  Returns a COPY when an override applies (the core finding is never mutated), or the
 *  original reference when there is nothing to change. */
function overrideFinding(f: Finding, overrides: Record<string, PackOverride> | undefined): Finding {
  const o = overrides?.[f.ruleId];
  if (!o) return f;
  const patched: Finding = { ...f };
  if (o.advisory !== undefined) patched.advisory = o.advisory;
  if (o.severity) patched.severity = o.severity as Severity;
  return patched;
}

export function derivePackResults(audit: AuditResult, packKey: string): PackCriterionResult[] {
  const pack = loadPack(packKey);
  const byScId = new Map(audit.criteria.map((c) => [c.id, c]));
  // Declarative pack-rule findings belonging to THIS pack (namespaced pack:<key>:). They
  // ride in the audit's dedicated `packFindings` list (never the core criteria), and are
  // routed onto a criterion here via the same appliesTo/ruleMatches machinery as engine
  // findings, keyed by the SC the rule declared.
  const myPackFindings = (audit.packFindings ?? []).filter((f) => f.ruleId.startsWith(`pack:${packKey}:`));
  const overrides = pack.overrides;
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
    // Declarative pack findings whose declared SC this criterion maps to — merged with the
    // core SC findings, then run through the pack's overrides (advisory/severity flips that
    // apply ONLY in this projection; the core copies are never mutated).
    const packFs = myPackFindings.filter((f) => pc.wcag.includes(f.criteriaId));
    const allFindings = [...scResults.flatMap((r) => r.findings), ...packFs].map((f) => overrideFinding(f, overrides));

    // No applicability data (third-party pack) → legacy fan-out: every mapped SC's
    // findings attach (advisory ones project too, so a pack view can render the
    // recommendation) and the SC statuses aggregate directly. The SC status already
    // excludes advisory findings (src/audit.ts finalize), so the aggregate is NC-clean.
    if (!pc.appliesTo) {
      const status: Status = scResults.length ? aggregate(scResults.map((r) => r.status)) : "NA";
      return { id: pc.id, theme: pc.theme, status, findings: allFindings, scs: pc.wcag };
    }

    // Applicability-aware projection: a finding attaches ONLY if its rule is one this
    // criterion can actually be non-conformant on. NC is driven by NON-ADVISORY findings
    // only; advisory findings still attach (so the pack report/PRD renders the
    // recommendation) but never flip the criterion to NC.
    const findings = allFindings.filter((f) => ruleMatches(f.ruleId, pc.appliesTo!.ruleIds));
    const normativeFindings = findings.filter((f) => !f.advisory);
    if (normativeFindings.length) {
      return { id: pc.id, theme: pc.theme, status: "NC" as Status, findings, scs: pc.wcag };
    }
    // No NORMATIVE finding attaches. A mapped SC may still be NC, but on out-of-scope
    // elements (a sibling criterion's failure) — that NC is NOT ours: derive as manual
    // (assess separately), never a foreign NC. Any advisory findings that DO belong here
    // still attach for display (a recommendation, never a non-conformity). This ordering
    // matters: an attached advisory recommendation must not let a scoped-out sibling NC
    // silently flip us to a foreign verdict.
    if (scResults.some((r) => r.status === "NC")) {
      return { id: pc.id, theme: pc.theme, status: "manual" as Status, findings, scs: pc.wcag, scopedOut: true };
    }
    // Otherwise the ordinary non-NC aggregate (C / manual / NA) over the mapped SCs, with
    // any advisory findings kept on the result so the pack view surfaces them.
    const status: Status = scResults.length ? aggregate(scResults.map((r) => r.status)) : "NA";
    return { id: pc.id, theme: pc.theme, status, findings, scs: pc.wcag };
  });
}
