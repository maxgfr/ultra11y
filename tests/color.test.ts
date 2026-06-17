import { describe, it, expect } from "vitest";
import { parseColor, contrastRatio, parseInlineStyle } from "../src/color.js";

describe("parseColor", () => {
  it("parses #rgb and #rrggbb hex", () => {
    expect(parseColor("#fff")).toEqual({ r: 255, g: 255, b: 255, a: 1 });
    expect(parseColor("#000000")).toEqual({ r: 0, g: 0, b: 0, a: 1 });
    expect(parseColor("#9a9A9a")).toEqual({ r: 154, g: 154, b: 154, a: 1 });
  });
  it("parses #rgba / #rrggbbaa with alpha", () => {
    expect(parseColor("#00000080")).toEqual({ r: 0, g: 0, b: 0, a: 128 / 255 });
  });
  it("parses rgb()/rgba()", () => {
    expect(parseColor("rgb(255, 255, 255)")).toEqual({ r: 255, g: 255, b: 255, a: 1 });
    expect(parseColor("rgba(0,0,0,0.5)")).toEqual({ r: 0, g: 0, b: 0, a: 0.5 });
  });
  it("parses common named colors and transparent", () => {
    expect(parseColor("white")).toEqual({ r: 255, g: 255, b: 255, a: 1 });
    expect(parseColor("Black")).toEqual({ r: 0, g: 0, b: 0, a: 1 });
    expect(parseColor("transparent")?.a).toBe(0);
  });
  it("returns null for unparseable / non-literal values", () => {
    expect(parseColor("var(--brand)")).toBeNull();
    expect(parseColor("currentColor")).toBeNull();
    expect(parseColor("nope")).toBeNull();
  });
});

describe("contrastRatio", () => {
  const W = { r: 255, g: 255, b: 255, a: 1 };
  const B = { r: 0, g: 0, b: 0, a: 1 };
  it("is 21 for black on white and 1 for identical colors", () => {
    expect(contrastRatio(W, B)).toBeCloseTo(21, 1);
    expect(contrastRatio(W, W)).toBeCloseTo(1, 5);
  });
  it("computes ~2.85 for #999 on #fff (a real AA failure)", () => {
    expect(contrastRatio(parseColor("#999")!, W)).toBeCloseTo(2.85, 2);
  });
});

describe("parseInlineStyle", () => {
  it("splits declarations into a lowercased property map, trimming", () => {
    const m = parseInlineStyle("Color:#999; Background-Color: #fff ;font-size:24px");
    expect(m.get("color")).toBe("#999");
    expect(m.get("background-color")).toBe("#fff");
    expect(m.get("font-size")).toBe("24px");
  });
});
