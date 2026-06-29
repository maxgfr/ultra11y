// Theme 2 — Frames.
import type { Doc, El } from "../parse/html.js";
import { attr } from "../parse/html.js";
import type { Rule, RuleFinding } from "./rule.js";

const iframeTitleMissing: Rule = {
  id: "iframe-title-missing",
  criteria: ["4.1.2"],
  parser: ["html", "jsx"],
  severity: "bloquant",
  run(doc: Doc): RuleFinding[] {
    const out: RuleFinding[] = [];
    for (const el of doc.elements) {
      if (el.tag !== "iframe") continue;
      if (attr(el, "aria-hidden") === "true") continue;
      const title = (attr(el, "title") ?? "").trim();
      const aria = (attr(el, "aria-label") ?? "").trim();
      if (title || aria) continue;
      out.push({
        criteriaId: "4.1.2",
        el: el as El,
        message: `<iframe> sans attribut title — le cadre n'a pas de titre.`,
        remediation: `Ajoutez un title décrivant le contenu du cadre, ex. title="Carte de localisation".`,
      });
    }
    return out;
  },
};

export const framesRules: Rule[] = [iframeTitleMissing];
