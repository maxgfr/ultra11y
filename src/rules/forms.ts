// Theme 11 — Forms: every field has a programmatic label + group/structure checks.
import type { Doc } from "../parse/html.js";
import { attr, hasAttr, descendants, visibleText } from "../parse/html.js";
import { controlLabel, isFormField } from "../name.js";
import type { Rule, RuleFinding } from "./rule.js";

// title/placeholder are NOT real labels for these rules
const REAL_LABEL = new Set(["for", "wrapping", "aria-label", "aria-labelledby"]);

const controlLabelMissing: Rule = {
  id: "control-label-missing",
  criteria: ["4.1.2"],
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
        criteriaId: "4.1.2",
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
  criteria: ["4.1.2"],
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
        criteriaId: "4.1.2",
        el,
        message: `placeholder="${attr(el, "placeholder")}" utilisé comme seule étiquette — le placeholder n'est pas un label.`,
        remediation: `Ajoutez un <label> réel ; le placeholder ne doit que compléter, pas remplacer l'étiquette.`,
      });
    }
    return out;
  },
};

const fieldsetLegendMissing: Rule = {
  id: "fieldset-legend-missing",
  criteria: ["1.3.1"],
  parser: ["html", "jsx"],
  severity: "majeur",
  run(doc: Doc): RuleFinding[] {
    const out: RuleFinding[] = [];
    for (const el of doc.elements) {
      if (el.tag !== "fieldset") continue;
      const legend = el.children.find((c) => c.type === "element" && c.tag === "legend");
      if (legend && legend.type === "element" && visibleText(legend)) continue;
      if (hasAttr(el, "aria-label") || hasAttr(el, "aria-labelledby")) continue;
      out.push({
        criteriaId: "1.3.1",
        el,
        message: `<fieldset> sans <legend> (ou légende vide) — regroupement de champs sans légende.`,
        remediation: `Ajoutez un <legend> non vide en premier enfant du <fieldset>.`,
      });
    }
    return out;
  },
};

const formFieldMultipleLabels: Rule = {
  id: "form-field-multiple-labels",
  criteria: ["4.1.2"],
  parser: ["html", "jsx"],
  severity: "mineur",
  run(doc: Doc): RuleFinding[] {
    const counts = new Map<string, number>();
    for (const el of doc.elements) {
      if (el.tag !== "label") continue;
      const f = attr(el, "for");
      if (f) counts.set(f, (counts.get(f) ?? 0) + 1);
    }
    const out: RuleFinding[] = [];
    for (const el of doc.elements) {
      if (!isFormField(el)) continue;
      const id = attr(el, "id");
      if (id && (counts.get(id) ?? 0) > 1) {
        out.push({
          criteriaId: "4.1.2",
          el,
          message: `Champ <${el.tag}> référencé par ${counts.get(id)} <label for="${id}"> — étiquettes multiples ambiguës.`,
          remediation: `Un seul <label> doit cibler le champ ; fusionnez ou retirez les étiquettes superflues.`,
        });
      }
    }
    return out;
  },
};

const selectHasOption: Rule = {
  id: "select-has-option",
  criteria: ["4.1.2"],
  parser: ["html", "jsx"],
  severity: "mineur",
  run(doc: Doc): RuleFinding[] {
    const out: RuleFinding[] = [];
    for (const el of doc.elements) {
      if (el.tag !== "select") continue;
      if (descendants(el).some((d) => d.tag === "option")) continue;
      out.push({
        criteriaId: "4.1.2",
        el,
        message: `<select> sans aucune <option> — liste de choix vide.`,
        remediation: `Ajoutez des <option> (et un <optgroup>/option par défaut si pertinent).`,
      });
    }
    return out;
  },
};

export const formsRules: Rule[] = [controlLabelMissing, placeholderAsLabel, fieldsetLegendMissing, formFieldMultipleLabels, selectHasOption];
