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
      // <th> inside <thead> has an implicit column scope per HTML — a simple table whose
      // headers are all in <thead> needs no explicit scope=, so don't flag it.
      const allThInThead = hasTh && ths.every((th) => ancestors(th).some((a) => a.tag === "thead"));
      if (hasTh && (hasAssoc || allThInThead)) continue;
      if (!hasTh) {
        out.push({
          criteriaId: "1.3.1",
          el: t,
          message: `Tableau de données sans <th> — en-têtes de colonne/ligne non déclarés.`,
          remediation: `Déclarez les en-têtes avec <th>, et associez-les via scope="col"/"row" (ou headers/id).`,
        });
      } else if (!hasAssoc) {
        out.push({
          criteriaId: "1.3.1",
          el: t,
          message: `Tableau de données avec <th> mais sans scope/headers — association cellule↔en-tête absente.`,
          remediation: `Ajoutez scope="col"/"row" sur les <th> (ou headers="…"/id sur cellules complexes).`,
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
        message: `Tableau de données sans <caption> ni nom accessible — titre du tableau absent.`,
        remediation: `Ajoutez un <caption> en première position du <table> (ou aria-label/aria-labelledby).`,
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
        message: `Tableau de mise en forme (role="${attr(t, "role")}") utilisant du balisage de données (th/caption/scope).`,
        remediation: `Retirez th/caption/scope/headers d'un tableau de présentation, ou faites-en un vrai tableau de données.`,
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
        message: `En-tête de colonne triable sans aria-sort — l'état de tri (croissant/décroissant) n'est pas restitué.`,
        remediation: `Ajoutez aria-sort="none|ascending|descending" sur le <th> trié, et masquez le glyphe de tri (aria-hidden="true").`,
      });
    }
    return out;
  },
};

export const tablesRules: Rule[] = [dataTableNoHeaders, tableCaptionMissing, layoutTableDataMarkup, sortableHeaderNoAriaSort];
