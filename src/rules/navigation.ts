// Theme 12 — Navigation (statically-checkable slice).
import type { Doc } from "../parse/html.js";
import { attr, hasAttr } from "../parse/html.js";
import type { Rule, RuleFinding } from "./rule.js";

const skipLinkTargetMissing: Rule = {
  id: "skip-link-target-missing",
  criteria: ["2.4.1"],
  severity: "majeur",
  scope: "page",
  run(doc: Doc): RuleFinding[] {
    const out: RuleFinding[] = [];
    const hasName = (id: string): boolean => doc.byId.has(id) || doc.elements.some((e) => attr(e, "name") === id);
    for (const el of doc.elements) {
      if (el.tag !== "a") continue;
      const href = attr(el, "href") ?? "";
      if (!href.startsWith("#") || href === "#") continue;
      let id = href.slice(1);
      try {
        id = decodeURIComponent(id);
      } catch {
        /* keep raw */
      }
      if (hasName(id)) continue;
      out.push({
        criteriaId: "2.4.1",
        el,
        message: `Lien interne href="${href}" — la cible #${id} n'existe pas dans la page (lien d'évitement/ancre cassé).`,
        remediation: `Ajoutez un élément avec id="${id}" (ex. <main id="${id}">) ou corrigez l'ancre.`,
      });
    }
    return out;
  },
};

const positiveTabindex: Rule = {
  id: "positive-tabindex",
  criteria: ["2.4.3"],
  severity: "majeur",
  run(doc: Doc): RuleFinding[] {
    const out: RuleFinding[] = [];
    for (const el of doc.elements) {
      if (!hasAttr(el, "tabindex")) continue;
      const ti = Number((attr(el, "tabindex") ?? "").trim());
      if (Number.isInteger(ti) && ti > 0) {
        out.push({
          criteriaId: "2.4.3",
          el,
          message: `tabindex="${ti}" positif — force un ordre de tabulation incohérent avec l'ordre du DOM.`,
          remediation: `Utilisez tabindex="0" (ou pas de tabindex) et ordonnez via le DOM ; réservez les valeurs >0.`,
        });
      }
    }
    return out;
  },
};

export const navigationRules: Rule[] = [skipLinkTargetMissing, positiveTabindex];
