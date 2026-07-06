import { describe, it, expect } from "vitest";
import { findOf } from "./helpers.js";

describe("contrast-literal (3.2)", () => {
  it("conforming: black text on white inline → no finding", () => {
    expect(findOf(`<p style="color:#000;background:#fff">Bonjour</p>`, "contrast-literal")).toHaveLength(0);
  });

  it("non-conforming: #999 on #fff is below 4.5:1", () => {
    const f = findOf(`<p style="color:#999;background:#fff">Texte gris</p>`, "contrast-literal");
    expect(f).toHaveLength(1);
    expect(f[0]!.criteriaId).toBe("1.4.3");
  });

  it("resolves the background from the nearest ancestor with an inline background", () => {
    const f = findOf(`<div style="background:#fff"><p style="color:#999">x</p></div>`, "contrast-literal");
    expect(f).toHaveLength(1);
    expect(f[0]!.selectorHint).toContain("p");
  });

  it("inherits the text colour from an ancestor (color cascades)", () => {
    expect(findOf(`<div style="color:#999;background:#fff"><p>héritée</p></div>`, "contrast-literal")).toHaveLength(1);
  });

  it("stays silent when the background is not statically known (no false NC)", () => {
    expect(findOf(`<p style="color:#999">fond inconnu</p>`, "contrast-literal")).toHaveLength(0);
  });

  it("stays silent when a colour is non-literal (var / currentColor)", () => {
    expect(findOf(`<p style="color:var(--fg);background:#fff">x</p>`, "contrast-literal")).toHaveLength(0);
  });

  it("does not flag a translucent background it cannot composite", () => {
    expect(findOf(`<p style="color:#000;background:rgba(0,0,0,0.5)">x</p>`, "contrast-literal")).toHaveLength(0);
  });

  it("applies the 3:1 large-text threshold when font-size marks the text large", () => {
    // #888 on #fff ≈ 3.55:1 — fails normal (4.5) but passes large (3.0)
    expect(findOf(`<p style="color:#888;background:#fff">normal</p>`, "contrast-literal")).toHaveLength(1);
    expect(findOf(`<p style="color:#888;background:#fff;font-size:24px">large</p>`, "contrast-literal")).toHaveLength(0);
  });

  it("uses the exact 14pt-bold threshold (18.66px), not 18.5px, for bold large text (WCAG 1.4.3)", () => {
    // #888 on #fff ≈ 3.55:1 — fails normal (4.5), would pass large (3.0). 18.5px bold is
    // BELOW the real 14pt-bold cutoff (18.66px) and must stay held to the normal
    // threshold; 18.66px bold is large and passes at 3:1.
    expect(findOf(`<p style="color:#888;background:#fff;font-size:18.5px;font-weight:bold">just under</p>`, "contrast-literal")).toHaveLength(1);
    expect(findOf(`<p style="color:#888;background:#fff;font-size:18.66px;font-weight:bold">exact cutoff</p>`, "contrast-literal")).toHaveLength(0);
  });

  it("ignores elements without their own visible text", () => {
    expect(findOf(`<div style="color:#999;background:#fff"><span>only child text</span></div>`, "contrast-literal")).toHaveLength(1);
  });
});
