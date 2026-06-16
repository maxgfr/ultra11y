// Theme 5 — Data tables.
import type { Doc, El } from "../parse/html.js";
import { attr, hasAttr, descendants } from "../parse/html.js";
import type { Rule, RuleFinding } from "./rule.js";

const isLayout = (t: El): boolean => ["presentation", "none"].includes((attr(t, "role") ?? "").trim());
const named = (t: El): boolean => !!(attr(t, "aria-label") ?? "").trim() || hasAttr(t, "aria-labelledby");

const dataTableNoHeaders: Rule = {
  id: "data-table-no-headers",
  criteria: ["5.6", "5.7"],
  parser: ["html", "jsx"],
  severity: "majeur",
  run(doc: Doc): RuleFinding[] {
    const out: RuleFinding[] = [];
    for (const t of doc.elements) {
      if (t.tag !== "table" || isLayout(t)) continue;
      const desc = descendants(t);
      const hasTh = desc.some((d) => d.tag === "th");
      const hasAssoc = desc.some((d) => (d.tag === "td" || d.tag === "th") && (hasAttr(d, "scope") || hasAttr(d, "headers")));
      if (hasTh && hasAssoc) continue;
      if (!hasTh) {
        out.push({
          criteriaId: "5.6",
          el: t,
          message: `Tableau de données sans <th> — en-têtes de colonne/ligne non déclarés.`,
          remediation: `Déclarez les en-têtes avec <th>, et associez-les via scope="col"/"row" (ou headers/id).`,
        });
      } else if (!hasAssoc) {
        out.push({
          criteriaId: "5.7",
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
  criteria: ["5.4"],
  parser: ["html", "jsx"],
  severity: "mineur",
  run(doc: Doc): RuleFinding[] {
    const out: RuleFinding[] = [];
    for (const t of doc.elements) {
      if (t.tag !== "table" || isLayout(t)) continue;
      const hasCaption = t.children.some((c) => c.type === "element" && c.tag === "caption");
      if (hasCaption || named(t)) continue;
      out.push({
        criteriaId: "5.4",
        el: t,
        message: `Tableau de données sans <caption> ni nom accessible — titre du tableau absent.`,
        remediation: `Ajoutez un <caption> en première position du <table> (ou aria-label/aria-labelledby).`,
      });
    }
    return out;
  },
};

export const tablesRules: Rule[] = [dataTableNoHeaders, tableCaptionMissing];
