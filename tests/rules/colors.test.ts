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

  // font-size in % must resolve like em/rem (200% == 2em == 32px = large), not fall
  // through to the strict normal threshold — #888 on #fff (~3.55:1) passes large (3:1).
  it("resolves % font-size to the large-text threshold (200% == 2em)", () => {
    expect(findOf(`<p style="color:#888;background:#fff;font-size:2em">em</p>`, "contrast-literal")).toHaveLength(0);
    expect(findOf(`<p style="color:#888;background:#fff;font-size:200%">percent</p>`, "contrast-literal")).toHaveLength(0);
  });

  it("does not assume normal size when font-size is declared in an unresolvable unit (vw/calc)", () => {
    expect(findOf(`<p style="color:#888;background:#fff;font-size:3vw">vw</p>`, "contrast-literal")).toHaveLength(0);
    expect(findOf(`<p style="color:#888;background:#fff;font-size:calc(1rem + 1vw)">calc</p>`, "contrast-literal")).toHaveLength(0);
  });

  it("still flags a definite failure that fails even the large threshold, whatever the unit", () => {
    // #aaa on #fff ≈ 2.32:1 — below 3:1, so a non-conformity at any text size.
    expect(findOf(`<p style="color:#aaa;background:#fff;font-size:200%">too light</p>`, "contrast-literal")).toHaveLength(1);
  });

  it("still holds small text set in % to the normal threshold", () => {
    // 80% == 12.8px (normal); #888 on #fff (~3.55:1) fails the 4.5 normal threshold.
    expect(findOf(`<p style="color:#888;background:#fff;font-size:80%">small</p>`, "contrast-literal")).toHaveLength(1);
  });
});
