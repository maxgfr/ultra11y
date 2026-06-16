// Theme 11 — Forms: every field has a programmatic label.
import type { Doc } from "../parse/html.js";
import { attr, hasAttr } from "../parse/html.js";
import { controlLabel, isFormField } from "../name.js";
import type { Rule, RuleFinding } from "./rule.js";

// title/placeholder are NOT real labels for these rules
const REAL_LABEL = new Set(["for", "wrapping", "aria-label", "aria-labelledby"]);

const controlLabelMissing: Rule = {
  id: "control-label-missing",
  criteria: ["11.1"],
  parser: ["html", "jsx"],
  severity: "bloquant",
  run(doc: Doc): RuleFinding[] {
    const out: RuleFinding[] = [];
    for (const el of doc.elements) {
      if (!isFormField(el)) continue;
      const { via } = controlLabel(el, doc);
      if (via && REAL_LABEL.has(via)) continue;
      if (hasAttr(el, "placeholder")) continue; // reported by placeholder-as-label
      out.push({
        criteriaId: "11.1",
        el,
        message: `Champ de formulaire <${el.tag}> sans étiquette — aucun label associé.`,
        remediation: `Associez un <label for="…"> (ou enveloppez le champ d'un <label>, ou aria-label/aria-labelledby).`,
      });
    }
    return out;
  },
};

const placeholderAsLabel: Rule = {
  id: "placeholder-as-label",
  criteria: ["11.1"],
  parser: ["html", "jsx"],
  severity: "majeur",
  run(doc: Doc): RuleFinding[] {
    const out: RuleFinding[] = [];
    for (const el of doc.elements) {
      if (!isFormField(el)) continue;
      if (!hasAttr(el, "placeholder")) continue;
      const { via } = controlLabel(el, doc);
      if (via && REAL_LABEL.has(via)) continue;
      out.push({
        criteriaId: "11.1",
        el,
        message: `placeholder="${attr(el, "placeholder")}" utilisé comme seule étiquette — le placeholder n'est pas un label.`,
        remediation: `Ajoutez un <label> réel ; le placeholder ne doit que compléter, pas remplacer l'étiquette.`,
      });
    }
    return out;
  },
};

export const formsRules: Rule[] = [controlLabelMissing, placeholderAsLabel];
