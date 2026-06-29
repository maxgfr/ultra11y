// Contract for cross-file rules. Unlike a single-file Rule (which sees one Doc),
// a CrossRule also sees the dependency graph, and can BOTH raise findings (anchored
// at a usage site, with the related definition site attached) AND suppress
// single-file findings that the graph proves are false positives (e.g. a skip-link
// target that lives in an imported layout). Cross findings fold into the same
// Finding/AuditResult as everything else.
import type { Doc, El } from "../parse/html.js";
import type { Finding, Severity } from "../types.js";
import { snippet } from "../parse/html.js";
import { selectorOf } from "./rule.js";
import type { DepGraph } from "../graph/graph.js";

export interface RelatedSite {
  file: string;
  line: number;
  col: number;
  selectorHint: string;
  note: string;
}

export interface CrossFinding {
  criteriaId: string;
  el: El; // anchor (the usage site) for line/col/snippet/selector
  message: string;
  remediation: string;
  severity?: Severity;
  selectorHint?: string;
  related?: RelatedSite; // the OTHER site (definition) that explains the finding
}

// Drop a single-file finding the graph proves is a false positive. Matched on the
// same Doc by ruleId + anchor line.
export interface Suppression {
  ruleId: string;
  line: number;
  reason: string;
}

export interface CrossRuleResult {
  findings: CrossFinding[];
  suppress: Suppression[];
}

export interface CrossRule {
  id: string;
  criteria: string[];
  severity: Severity;
  run(doc: Doc, graph: DepGraph): CrossRuleResult;
}

/** Normalise a CrossFinding into a Finding (mirrors rule.ts toFinding, plus related). */
export function crossToFinding(doc: Doc, ruleId: string, def: Severity, cf: CrossFinding): Finding {
  return {
    ruleId,
    criteriaId: cf.criteriaId,
    file: doc.file,
    line: cf.el.line,
    col: cf.el.col,
    selectorHint: cf.selectorHint ?? selectorOf(cf.el),
    severity: cf.severity ?? def,
    message: cf.message,
    remediation: cf.remediation,
    snippet: snippet(doc, cf.el),
    ...(doc.lossy ? {} : { sourceStart: cf.el.start, sourceEnd: cf.el.end }),
    ...(cf.related ? { related: cf.related } : {}),
  };
}
