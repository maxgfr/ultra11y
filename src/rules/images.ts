// Theme 1 — Images.
import type { Doc, El } from "../parse/html.js";
import { attr, hasAttr, hasBoundAttr, boundAttr, visibleText } from "../parse/html.js";
import type { Rule, RuleFinding } from "./rule.js";

const isHidden = (el: El): boolean => attr(el, "aria-hidden") === "true" || ["presentation", "none"].includes((attr(el, "role") ?? "").trim());
// A dynamically-bound name (`:aria-label`, `v-bind:aria-labelledby`) names the element
// even though we cannot resolve its value — treat it as present, not missing.
const named = (el: El): boolean => !!(boundAttr(el, "aria-label") ?? "").trim() || hasBoundAttr(el, "aria-labelledby");

const imgAltMissing: Rule = {
  id: "img-alt-missing",
  criteria: ["1.1.1"],
  severity: "bloquant",
  run(doc: Doc): RuleFinding[] {
    const out: RuleFinding[] = [];
    for (const el of doc.elements) {
      const isImg = el.tag === "img" || el.tag === "area" || (attr(el, "role") ?? "") === "img";
      if (!isImg) continue;
      if (isHidden(el) && el.tag !== "area") continue;
      if (hasBoundAttr(el, "alt") || named(el)) continue; // alt="" / :alt="x" / aria-* → present
      out.push({
        criteriaId: "1.1.1",
        el,
        message: `<${el.tag}> sans attribut alt ni nom accessible — alternative textuelle manquante.`,
        remediation: `Ajoutez alt="…" (description si l'image porte de l'information, alt="" si elle est décorative).`,
      });
    }
    return out;
  },
};

const decorativeAltMisuse: Rule = {
  id: "decorative-alt-misuse",
  criteria: ["1.1.1"],
  severity: "majeur",
  run(doc: Doc): RuleFinding[] {
    const out: RuleFinding[] = [];
    for (const el of doc.elements) {
      if (el.tag !== "img") continue;
      const alt = attr(el, "alt");
      const role = (attr(el, "role") ?? "").trim();
      const ariaLabel = (attr(el, "aria-label") ?? "").trim();
      const title = (attr(el, "title") ?? "").trim();
      if (alt === "" && (ariaLabel || title)) {
        out.push({
          criteriaId: "1.1.1",
          el,
          message: `Image décorative (alt="") mais nommée par aria-label/title — incohérence décoratif/informatif.`,
          remediation: `Si l'image est décorative, retirez aria-label/title ; sinon donnez un alt descriptif.`,
        });
      } else if (["presentation", "none"].includes(role) && alt?.trim()) {
        out.push({
          criteriaId: "1.1.1",
          el,
          message: `Image en role="${role}" mais porteuse d'un alt non vide — déclarée décorative pourtant nommée.`,
          remediation: `Retirez role="${role}" si l'image est informative, ou videz l'alt si elle est décorative.`,
        });
      }
    }
    return out;
  },
};

const canvasFallbackMissing: Rule = {
  id: "canvas-fallback-missing",
  criteria: ["1.1.1"],
  severity: "majeur",
  run(doc: Doc): RuleFinding[] {
    const out: RuleFinding[] = [];
    for (const el of doc.elements) {
      if (el.tag !== "canvas") continue;
      const hasFallback = el.children.some((c) => (c.type === "element" ? true : c.data.trim().length > 0));
      if (hasFallback || named(el) || visibleText(el)) continue;
      out.push({
        criteriaId: "1.1.1",
        el,
        message: `<canvas> sans contenu alternatif ni nom accessible.`,
        remediation: `Placez un contenu de repli entre <canvas>…</canvas> ou ajoutez role="img" + aria-label.`,
      });
    }
    return out;
  },
};

const inputImageAltMissing: Rule = {
  id: "input-image-alt-missing",
  criteria: ["1.1.1"],
  severity: "bloquant",
  run(doc: Doc): RuleFinding[] {
    const out: RuleFinding[] = [];
    for (const el of doc.elements) {
      if (el.tag !== "input" || (attr(el, "type") ?? "").toLowerCase() !== "image") continue;
      const alt = (boundAttr(el, "alt") ?? "").trim();
      if (alt || named(el) || (attr(el, "title") ?? "").trim()) continue;
      out.push({
        criteriaId: "1.1.1",
        el,
        message: `<input type="image"> sans alt ni nom accessible — le bouton image n'a pas d'alternative textuelle.`,
        remediation: `Ajoutez alt="…" décrivant l'action du bouton (ex. alt="Rechercher").`,
      });
    }
    return out;
  },
};

export const imagesRules: Rule[] = [imgAltMissing, decorativeAltMisuse, canvasFallbackMissing, inputImageAltMissing];
