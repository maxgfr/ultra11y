// Theme 4 / 13 — Auto-starting media (statically-checkable slice).
import type { Doc } from "../parse/html.js";
import { hasAttr } from "../parse/html.js";
import type { Rule, RuleFinding } from "./rule.js";

const autoplayMedia: Rule = {
  id: "autoplay-media",
  criteria: ["1.4.2", "2.2.2"],
  parser: ["html", "jsx"],
  severity: "majeur",
  run(doc: Doc): RuleFinding[] {
    const out: RuleFinding[] = [];
    for (const el of doc.elements) {
      if (el.tag !== "audio" && el.tag !== "video") continue;
      if (!hasAttr(el, "autoplay")) continue;
      // muted video has no sound → it falls under moving content (13.8), audio always 4.10
      if (el.tag === "video" && hasAttr(el, "muted")) {
        out.push({
          criteriaId: "2.2.2",
          el,
          message: `<video autoplay> démarre automatiquement — contenu en mouvement non contrôlé.`,
          remediation: `Évitez l'autoplay ou fournissez un contrôle pause/stop accessible (et controls).`,
        });
        continue;
      }
      out.push({
        criteriaId: el.tag === "audio" ? "1.4.2" : "2.2.2",
        el,
        message: `<${el.tag} autoplay> démarre automatiquement ${el.tag === "audio" ? "du son" : "une vidéo sonore"} — non contrôlable par l'utilisateur.`,
        remediation: `Retirez autoplay, ou ajoutez un contrôle de lecture (controls + pause/stop) facilement accessible.`,
      });
    }
    return out;
  },
};

export const multimediaRules: Rule[] = [autoplayMedia];
