// Theme 1 — Images.
import type { Doc, El } from "../parse/html.js";
import { attr, hasAttr, visibleText } from "../parse/html.js";
import type { Rule, RuleFinding } from "./rule.js";

const isHidden = (el: El): boolean => attr(el, "aria-hidden") === "true" || ["presentation", "none"].includes((attr(el, "role") ?? "").trim());
const named = (el: El): boolean => !!(attr(el, "aria-label") ?? "").trim() || hasAttr(el, "aria-labelledby");

const imgAltMissing: Rule = {
  id: "img-alt-missing",
  criteria: ["1.1"],
  parser: ["html", "jsx"],
  severity: "bloquant",
  run(doc: Doc): RuleFinding[] {
    const out: RuleFinding[] = [];
    for (const el of doc.elements) {
      const isImg = el.tag === "img" || el.tag === "area" || (attr(el, "role") ?? "") === "img";
      if (!isImg) continue;
      if (isHidden(el) && el.tag !== "area") continue;
      if (hasAttr(el, "alt") || named(el)) continue;
      out.push({
        criteriaId: "1.1",
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
  criteria: ["1.2"],
  parser: ["html", "jsx"],
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
          criteriaId: "1.2",
          el,
          message: `Image décorative (alt="") mais nommée par aria-label/title — incohérence décoratif/informatif.`,
          remediation: `Si l'image est décorative, retirez aria-label/title ; sinon donnez un alt descriptif.`,
        });
      } else if (["presentation", "none"].includes(role) && alt?.trim()) {
        out.push({
          criteriaId: "1.2",
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
  criteria: ["1.1"],
  parser: ["html", "jsx"],
  severity: "majeur",
  run(doc: Doc): RuleFinding[] {
    const out: RuleFinding[] = [];
    for (const el of doc.elements) {
      if (el.tag !== "canvas") continue;
      const hasFallback = el.children.some((c) => (c.type === "element" ? true : c.data.trim().length > 0));
      if (hasFallback || named(el) || visibleText(el)) continue;
      out.push({
        criteriaId: "1.1",
        el,
        message: `<canvas> sans contenu alternatif ni nom accessible.`,
        remediation: `Placez un contenu de repli entre <canvas>…</canvas> ou ajoutez role="img" + aria-label.`,
      });
    }
    return out;
  },
};

export const imagesRules: Rule[] = [imgAltMissing, decorativeAltMisuse, canvasFallbackMissing];
