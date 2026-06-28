// Rule contract + helpers shared by every rule module and the registry.
// Kept dependency-light (no value import of the registry) to avoid cycles.
import type { Doc, El } from "../parse/html.js";
import type { Finding, Severity, ParserKind } from "../types.js";
import { snippet } from "../parse/html.js";

export interface RuleFinding {
  /** the specific RGAA criterion this finding evidences */
  criteriaId: string;
  /** element the finding is anchored to (for line/col/snippet/selector) */
  el: El;
  message: string;
  remediation: string;
  severity?: Severity; // override the rule default
  selectorHint?: string; // override the derived selector
}

export interface Rule {
  id: string;
  /** every RGAA criterion this rule may contribute to (registry cross-check) */
  criteria: string[];
  parser: ParserKind[];
  severity: Severity; // default severity for findings
  /** "page" rules only run on a full document (skip fragments/components) */
  scope?: "page" | "any";
  run(doc: Doc): RuleFinding[];
}

/** A full document has an <html> element; fragments/JSX components do not. */
export function isFullDocument(doc: Doc): boolean {
  return doc.elements.some((e) => e.tag === "html");
}

/** A short, human CSS-ish selector to locate the element in source. */
export function selectorOf(el: El): string {
  const id = el.attribs.id;
  if (id) return `${el.tag}#${id}`;
  const type = el.attribs.type;
  if (type && (el.tag === "input" || el.tag === "button")) return `${el.tag}[type=${type}]`;
  const cls = el.attribs.class;
  if (cls) return `${el.tag}.${cls.trim().split(/\s+/)[0]}`;
  if (el.tag === "a" && el.attribs.href) {
    const h = el.attribs.href!;
    return `a[href=${h.length > 30 ? h.slice(0, 30) + "…" : h}]`;
  }
  return el.tag;
}

export function toFinding(doc: Doc, ruleId: string, def: Severity, rf: RuleFinding): Finding {
  return {
    ruleId,
    criteriaId: rf.criteriaId,
    file: doc.file,
    line: rf.el.line,
    col: rf.el.col,
    selectorHint: rf.selectorHint ?? selectorOf(rf.el),
    severity: rf.severity ?? def,
    message: rf.message,
    remediation: rf.remediation,
    snippet: snippet(doc, rf.el),
    // Only carry source offsets when they index into the *real* file. For lossy
    // JSX/TSX the offsets are into the transformed HTML string, so `fix` must not
    // edit by range and baseline diffing falls back to line/selector identity.
    ...(doc.lossy ? {} : { sourceStart: rf.el.start, sourceEnd: rf.el.end }),
  };
}
