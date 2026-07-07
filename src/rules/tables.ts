// Theme 5 — Data tables (+ layout-table heuristic to avoid false positives).
import type { Doc, El } from "../parse/html.js";
import { attr, hasAttr, hasBoundAttr, descendants, ancestors } from "../parse/html.js";
import type { Rule, RuleFinding } from "./rule.js";

const declaredLayout = (t: El): boolean => ["presentation", "none"].includes((attr(t, "role") ?? "").trim());
const named = (t: El): boolean => !!(attr(t, "aria-label") ?? "").trim() || hasAttr(t, "aria-labelledby");

// Heuristic: treat a table as LAYOUT (skip data-table rules) when it declares
// role=presentation/none, OR nests another table (data tables don't nest), OR is
// a trivial single-row table with no <th>/<caption>. Cuts the classic
// table-based-layout false positive without missing real data tables.
function isLayoutTable(t: El): boolean {
  if (declaredLayout(t)) return true;
  const desc = descendants(t);
  if (desc.some((d) => d.tag === "table")) return true;
  const hasTh = desc.some((d) => d.tag === "th");
  const hasCaption = t.children.some((c) => c.type === "element" && c.tag === "caption");
  const rows = desc.filter((d) => d.tag === "tr").length;
  return !hasTh && !hasCaption && rows <= 1;
}

const dataTableNoHeaders: Rule = {
  id: "data-table-no-headers",
  criteria: ["1.3.1"],
  severity: "majeur",
  run(doc: Doc): RuleFinding[] {
    const out: RuleFinding[] = [];
    for (const t of doc.elements) {
      if (t.tag !== "table" || isLayoutTable(t)) continue;
      const desc = descendants(t);
      // No statically-visible rows/cells means the body is injected dynamically
      // ({children}/slot — e.g. a generic <table> wrapper component) or simply absent;
      // we cannot tell whether headers exist, so we do not assert a definite NC.
      if (!desc.some((d) => d.tag === "tr" || d.tag === "td" || d.tag === "th")) continue;
      const ths = desc.filter((d) => d.tag === "th");
      const hasTh = ths.length > 0;
      // hasBoundAttr also matches a dynamic :scope / v-bind:scope binding (Vue/Svelte).
      const hasAssoc = desc.some((d) => (d.tag === "td" || d.tag === "th") && (hasBoundAttr(d, "scope") || hasBoundAttr(d, "headers")));
      // Implicit scope per HTML's header-association algorithm (WCAG technique H51): a simple
      // table needs no explicit scope= when its headers sit in <thead>, OR form one complete
      // header ROW (column headers), OR are the first cell of every row (row headers).
      // (Order-independent: descendants() is not in document order.)
      const rows = desc.filter((d) => d.tag === "tr");
      const cellsOf = (tr: El): El[] => tr.children.filter((c): c is El => c.type === "element" && (c.tag === "th" || c.tag === "td"));
      const allThInThead = hasTh && ths.every((th) => ancestors(th).some((a) => a.tag === "thead"));
      const headerRow = rows.find((r) => {
        const cells = cellsOf(r);
        return cells.length > 0 && cells.every((c) => c.tag === "th");
      });
      const allThInHeaderRow = hasTh && headerRow !== undefined && ths.every((th) => cellsOf(headerRow).includes(th));
      const allThFirstCol = hasTh && ths.every((th) => {
        const tr = ancestors(th).find((a) => a.tag === "tr");
        return tr !== undefined && cellsOf(tr)[0] === th;
      });
      if (hasTh && (hasAssoc || allThInThead || allThInHeaderRow || allThFirstCol)) continue;
      if (!hasTh) {
        out.push({
          criteriaId: "1.3.1",
          el: t,
          msgId: "data-table-no-headers.no-th",
        });
      } else if (!hasAssoc) {
        out.push({
          criteriaId: "1.3.1",
          el: t,
          msgId: "data-table-no-headers.no-assoc",
        });
      }
    }
    return out;
  },
};

const tableCaptionMissing: Rule = {
  id: "table-caption-missing",
  criteria: ["1.3.1"],
  severity: "mineur",
  run(doc: Doc): RuleFinding[] {
    const out: RuleFinding[] = [];
    for (const t of doc.elements) {
      if (t.tag !== "table" || isLayoutTable(t)) continue;
      const hasCaption = t.children.some((c) => c.type === "element" && c.tag === "caption");
      if (hasCaption || named(t)) continue;
      out.push({
        criteriaId: "1.3.1",
        el: t,
        msgId: "table-caption-missing",
      });
    }
    return out;
  },
};

const layoutTableDataMarkup: Rule = {
  id: "layout-table-data-markup",
  criteria: ["1.3.1"],
  severity: "mineur",
  run(doc: Doc): RuleFinding[] {
    const out: RuleFinding[] = [];
    for (const t of doc.elements) {
      if (t.tag !== "table" || !declaredLayout(t)) continue;
      const desc = descendants(t);
      const dataMarkup =
        desc.some((d) => d.tag === "th") ||
        t.children.some((c) => c.type === "element" && c.tag === "caption") ||
        desc.some((d) => hasAttr(d, "scope") || hasAttr(d, "headers"));
      if (!dataMarkup) continue;
      out.push({
        criteriaId: "1.3.1",
        el: t,
        msgId: "layout-table-data-markup",
        params: { role: attr(t, "role") ?? "" },
      });
    }
    return out;
  },
};

// A sortable column header that doesn't expose its sort state. When a <th>
// (or role=columnheader) contains a real sort control (button/link) AND signals
// sorting (a sort/tri class or label) but carries no aria-sort, AT cannot restitute
// the current sort order (WCAG 1.3.1). Layout tables are skipped.
const SORT_SIGNAL = /sort|trier|tri\b/i;
const isSortControl = (e: El): boolean => e.tag === "button" || (e.tag === "a" && hasAttr(e, "href")) || (attr(e, "role") ?? "").trim() === "button";
const signalsSort = (e: El): boolean => SORT_SIGNAL.test(`${attr(e, "class") ?? ""} ${attr(e, "aria-label") ?? ""}`) || hasAttr(e, "data-sort");

const sortableHeaderNoAriaSort: Rule = {
  id: "sortable-header-no-aria-sort",
  criteria: ["1.3.1"],
  severity: "mineur",
  run(doc: Doc): RuleFinding[] {
    const out: RuleFinding[] = [];
    for (const el of doc.elements) {
      const isHeader = el.tag === "th" || (attr(el, "role") ?? "").trim() === "columnheader";
      if (!isHeader) continue;
      if (hasAttr(el, "aria-sort")) continue; // already declares sort state (any value)
      const table = ancestors(el).find((a) => a.tag === "table");
      if (table && isLayoutTable(table)) continue;
      const desc = descendants(el);
      if (!isSortControl(el) && !desc.some(isSortControl)) continue; // no actual sort control
      if (!signalsSort(el) && !desc.some(signalsSort)) continue; // nothing marks it as sortable
      out.push({
        criteriaId: "1.3.1",
        el,
        msgId: "sortable-header-no-aria-sort",
      });
    }
    return out;
  },
};

export const tablesRules: Rule[] = [dataTableNoHeaders, tableCaptionMissing, layoutTableDataMarkup, sortableHeaderNoAriaSort];
