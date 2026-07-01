// Theme 1 — Images.
import type { Doc, El } from "../parse/html.js";
import { attr, hasAttr, hasBoundAttr, boundAttr, hasDynamicSpread, visibleText, ancestors, descendants } from "../parse/html.js";
import { accessibleName } from "../name.js";
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
      if (hasDynamicSpread(el)) continue; // {...props} / Svelte {alt} shorthand may carry alt
      // role="img" on a non-<img> element (e.g. <svg role="img"><title>…) is named by its
      // <title>/text content, not an alt attribute — accept that accessible name.
      if (el.tag !== "img" && el.tag !== "area" && accessibleName(el, doc).trim() !== "") continue;
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
      if (attr(el, "aria-hidden") === "true") continue; // explicitly removed from the a11y tree (named on a role=img wrapper)
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

// <object>/<embed> embed non-text content (PDF, Flash-era media, SVG, video) and need an
// accessible name or text fallback, like <img>. (Decorative ones should be aria-hidden.)
const objectEmbedNoName: Rule = {
  id: "object-embed-no-name",
  criteria: ["1.1.1"],
  severity: "majeur",
  run(doc: Doc): RuleFinding[] {
    const out: RuleFinding[] = [];
    for (const el of doc.elements) {
      if (el.tag !== "object" && el.tag !== "embed") continue;
      if (isHidden(el)) continue;
      if (hasDynamicSpread(el)) continue; // a spread may inject aria-label/title
      if (accessibleName(el, doc).trim() !== "") continue; // aria-label/labelledby, title, or <object> fallback content
      out.push({
        criteriaId: "1.1.1",
        el,
        message: `<${el.tag}> sans nom accessible ni contenu de repli — média embarqué sans alternative textuelle.`,
        remediation: `Ajoutez aria-label/title décrivant le contenu (et un contenu de repli textuel dans <object>…</object>), ou aria-hidden="true" si décoratif.`,
      });
    }
    return out;
  },
};

// A charting container (<svg>/<div> of a known charting library) with no accessible
// name — the data visualization carries information with no text alternative
// (WCAG 1.1.1). Distinct from canvas-fallback-missing (which owns <canvas>): charting
// libs (recharts/echarts/chart.js/…) render into <svg>/<div>. Only the OUTERMOST chart
// container is reported (inner chart nodes are skipped), and a class allowlist bounds FP.
const CHART_CLASS = /(^|[-_ ])(chart|graph|recharts|highcharts|chart-?js|plotly|nivo|apexcharts|echarts|d3)/i;

const chartNoAccessibleName: Rule = {
  id: "chart-no-accessible-name",
  criteria: ["1.1.1"],
  severity: "majeur",
  run(doc: Doc): RuleFinding[] {
    const out: RuleFinding[] = [];
    for (const el of doc.elements) {
      if (el.tag !== "svg" && el.tag !== "div") continue;
      const cls = attr(el, "class") ?? "";
      if (!CHART_CLASS.test(cls)) continue;
      if (isHidden(el)) continue;
      if (hasDynamicSpread(el)) continue;
      // report only the outermost chart container (skip nested chart nodes)
      if (ancestors(el).some((a) => CHART_CLASS.test(attr(a, "class") ?? ""))) continue;
      if (named(el) || accessibleName(el, doc).trim() !== "") continue; // aria-label/labelledby, <svg><title>, text
      // named by a wrapping <figure><figcaption> or a role=img wrapper
      const fig = ancestors(el).find((a) => a.tag === "figure");
      if (fig && descendants(fig).some((d) => d.tag === "figcaption" && visibleText(d))) continue;
      if (ancestors(el).some((a) => (attr(a, "role") ?? "") === "img" && (named(a) || (attr(a, "aria-label") ?? "").trim()))) continue;
      out.push({
        criteriaId: "1.1.1",
        el,
        message: `Graphique (<${el.tag}> ${cls.trim().split(/\s+/)[0]}) sans nom accessible — alternative textuelle manquante.`,
        remediation: `Enveloppez le graphique dans <div role="img" aria-label="…"> décrivant la tendance (ou ajoutez un <title>/aria-label).`,
      });
    }
    return out;
  },
};

export const imagesRules: Rule[] = [imgAltMissing, decorativeAltMisuse, canvasFallbackMissing, inputImageAltMissing, objectEmbedNoName, chartNoAccessibleName];
