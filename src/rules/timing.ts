// Theme 13 — Timing & moving content (the statically-checkable slice): timed meta
// refresh/redirect (WCAG 2.2.1) and the legacy <blink>/<marquee> auto-motion (2.2.2).
import type { Doc } from "../parse/html.js";
import { attr } from "../parse/html.js";
import type { Rule, RuleFinding } from "./rule.js";

const metaRefreshRedirect: Rule = {
  id: "meta-refresh-redirect",
  criteria: ["2.2.1"],
  severity: "majeur",
  run(doc: Doc): RuleFinding[] {
    const out: RuleFinding[] = [];
    for (const el of doc.elements) {
      if (el.tag !== "meta") continue;
      if ((attr(el, "http-equiv") ?? "").toLowerCase() !== "refresh") continue;
      const content = (attr(el, "content") ?? "").trim();
      const seconds = Number.parseInt(content, 10);
      if (!Number.isFinite(seconds) || seconds <= 0) continue; // non-numeric / instant (0s) handled elsewhere
      out.push({
        criteriaId: "2.2.1",
        el,
        message: `<meta http-equiv="refresh" content="${content}"> impose un délai de ${seconds}s — rafraîchissement/redirection temporisé non contrôlable.`,
        remediation: `Supprimez le meta refresh temporisé, ou laissez l'utilisateur contrôler/désactiver/prolonger le délai.`,
      });
    }
    return out;
  },
};

const blinkMarquee: Rule = {
  id: "blink-marquee",
  criteria: ["2.2.2"],
  severity: "majeur",
  run(doc: Doc): RuleFinding[] {
    const out: RuleFinding[] = [];
    for (const el of doc.elements) {
      if (el.tag !== "blink" && el.tag !== "marquee") continue;
      out.push({
        criteriaId: "2.2.2",
        el,
        message: `<${el.tag}> — contenu en mouvement/clignotant automatique sans mécanisme de pause.`,
        remediation: `Remplacez <${el.tag}> par du contenu statique, ou fournissez un contrôle pause/stop/masquer.`,
      });
    }
    return out;
  },
};

export const timingRules: Rule[] = [metaRefreshRedirect, blinkMarquee];
