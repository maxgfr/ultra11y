// Theme 3 — Colours. Computed contrast (3.2/3.3) generally needs rendering, but the
// slice an author writes with LITERAL inline colours is decidable from the markup
// alone: text colour vs the nearest painted background, both resolved to opaque
// literals. Anything non-literal (var(), currentColor, external CSS, translucent)
// is left untouched so 3.2 stays a residual risk rather than a false non-conformity.
import type { Doc, El } from "../parse/html.js";
import { attr } from "../parse/html.js";
import type { Rule, RuleFinding } from "./rule.js";
import { parseColor, parseInlineStyle, contrastRatio, type RGBA } from "../color.js";

const SKIP_TAGS = new Set(["script", "style", "head", "title", "meta", "noscript", "link"]);

function styleOf(el: El): Map<string, string> {
  const s = attr(el, "style");
  return s ? parseInlineStyle(s) : new Map();
}

/** First colour literal in a declaration value (handles the `background` shorthand). */
function colorFromValue(v: string): RGBA | null {
  const whole = parseColor(v);
  if (whole) return whole;
  for (const tok of v.split(/\s+/)) {
    const c = parseColor(tok);
    if (c) return c;
  }
  return null;
}

/** Foreground: nearest self-or-ancestor inline `color` (colour inherits). */
function fgOf(el: El): RGBA | null {
  for (let p: El | null = el; p; p = p.parent) {
    const v = styleOf(p).get("color");
    if (v) {
      const c = colorFromValue(v);
      if (c) return c;
    }
  }
  return null;
}

/** Background: nearest self-or-ancestor inline solid background. Background does not
 *  inherit, but text visually sits on the nearest painted ancestor. */
function bgOf(el: El): RGBA | null {
  for (let p: El | null = el; p; p = p.parent) {
    const st = styleOf(p);
    const v = st.get("background-color") ?? st.get("background");
    if (v) {
      const c = colorFromValue(v);
      if (c) return c;
    }
  }
  return null;
}

function fontPx(el: El): number | null {
  for (let p: El | null = el; p; p = p.parent) {
    const v = styleOf(p).get("font-size");
    if (!v) continue;
    const m = /^([\d.]+)(px|pt|rem|em)?$/.exec(v.trim());
    if (!m) return null;
    const n = parseFloat(m[1]!);
    if (Number.isNaN(n)) return null;
    const unit = m[2] ?? "px";
    return unit === "pt" ? (n * 4) / 3 : unit === "rem" || unit === "em" ? n * 16 : n;
  }
  return null;
}

function isBold(el: El): boolean {
  for (let p: El | null = el; p; p = p.parent) {
    const v = styleOf(p).get("font-weight");
    if (v) return v === "bold" || Number(v) >= 700;
  }
  return false;
}

/** WCAG 1.4.3's "large scale text": ≥ 24px (18pt) regular, or ≥ 18.66px (14pt) bold —
 *  the exact 14pt-bold cutoff, not the commonly-rounded 18.5px. */
function isLarge(el: El): boolean {
  const px = fontPx(el);
  if (px === null) return false;
  return px >= 24 || (px >= 18.66 && isBold(el));
}

function hasDirectText(el: El): boolean {
  return el.children.some((c) => c.type === "text" && c.data.trim() !== "");
}

const contrastLiteral: Rule = {
  id: "contrast-literal",
  criteria: ["1.4.3"],
  severity: "majeur",
  run(doc: Doc): RuleFinding[] {
    const out: RuleFinding[] = [];
    for (const el of doc.elements) {
      if (SKIP_TAGS.has(el.tag) || !hasDirectText(el)) continue;
      const fg = fgOf(el);
      const bg = bgOf(el);
      if (!fg || !bg || fg.a < 1 || bg.a < 1) continue; // need two opaque literals
      const ratio = contrastRatio(fg, bg);
      const large = isLarge(el);
      const min = large ? 3 : 4.5;
      if (ratio >= min) continue;
      out.push({
        criteriaId: "1.4.3",
        el,
        msgId: "contrast-literal",
        params: { ratio: ratio.toFixed(2), min, textSize: large ? "large" : "normal" },
      });
    }
    return out;
  },
};

export const colorsRules: Rule[] = [contrastLiteral];
