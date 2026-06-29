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

export const tablesRules: Rule[] = [dataTableNoHeaders, tableCaptionMissing, layoutTableDataMarkup];
