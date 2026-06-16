// Theme 9 — Information structure (headings).
import type { Doc, El } from "../parse/html.js";
import { attr, elementsByTag } from "../parse/html.js";
import type { Rule, RuleFinding } from "./rule.js";

function headingLevel(el: El): number | null {
  const m = /^h([1-6])$/.exec(el.tag);
  if (m) return Number(m[1]);
  if ((attr(el, "role") ?? "") === "heading") {
    const lvl = Number(attr(el, "aria-level"));
    if (Number.isInteger(lvl) && lvl >= 1) return lvl;
  }
  return null;
}

function headings(doc: Doc): { el: El; level: number }[] {
  const out: { el: El; level: number }[] = [];
  for (const el of doc.elements) {
    const lvl = headingLevel(el);
    if (lvl !== null) out.push({ el, level: lvl });
  }
  return out;
}

const headingOrderSkip: Rule = {
  id: "heading-order-skip",
  criteria: ["9.1"],
  parser: ["html", "jsx"],
  severity: "majeur",
  run(doc: Doc): RuleFinding[] {
    const hs = headings(doc);
    const out: RuleFinding[] = [];
    let prev = 0;
    for (const { el, level } of hs) {
      if (prev !== 0 && level - prev > 1) {
        out.push({
          criteriaId: "9.1",
          el,
          message: `Saut de niveau de titre : <h${level}> après <h${prev}> (niveau h${prev + 1} attendu).`,
          remediation: `Ne sautez pas de niveau : enchaînez les titres sans omettre de palier.`,
        });
      }
      prev = level;
    }
    return out;
  },
};

const h1Missing: Rule = {
  id: "h1-missing",
  criteria: ["9.1"],
  parser: ["html"],
  severity: "majeur",
  scope: "page",
  run(doc: Doc): RuleFinding[] {
    const hasH1 = headings(doc).some((h) => h.level === 1);
    if (hasH1) return [];
    const anchor = elementsByTag(doc, "body")[0] ?? elementsByTag(doc, "html")[0];
    if (!anchor) return [];
    return [
      {
        criteriaId: "9.1",
        el: anchor,
        message: `Aucun <h1> dans la page — le titre principal de niveau 1 est manquant.`,
        remediation: `Ajoutez un <h1> décrivant le contenu principal de la page.`,
      },
    ];
  },
};

const h1Multiple: Rule = {
  id: "h1-multiple",
  criteria: ["9.1"],
  parser: ["html"],
  severity: "mineur",
  scope: "page",
  run(doc: Doc): RuleFinding[] {
    const h1s = elementsByTag(doc, "h1");
    if (h1s.length <= 1) return [];
    return h1s.slice(1).map((el) => ({
      criteriaId: "9.1",
      el,
      message: `Plusieurs <h1> dans la page (${h1s.length}) — un seul titre de niveau 1 est recommandé.`,
      remediation: `Conservez un unique <h1> et hiérarchisez le reste avec h2…h6.`,
    }));
  },
};

export const headingsRules: Rule[] = [headingOrderSkip, h1Missing, h1Multiple];
