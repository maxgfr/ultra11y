import { describe, it, expect } from "vitest";
import { findOf } from "./helpers.js";

describe("img-alt-missing (1.1)", () => {
  it("conforming: img with alt, decorative alt, aria-label, aria-hidden", () => {
    expect(findOf(`<img src="a" alt="Un chat">`, "img-alt-missing")).toHaveLength(0);
    expect(findOf(`<img src="a" alt="">`, "img-alt-missing")).toHaveLength(0);
    expect(findOf(`<img src="a" aria-label="Chat">`, "img-alt-missing")).toHaveLength(0);
    expect(findOf(`<img src="a" aria-hidden="true">`, "img-alt-missing")).toHaveLength(0);
  });
  it("non-conforming: whitespace-only alt yields no accessible name (only alt=\"\" is decorative)", () => {
    // alt=" " is not the empty string, so the image is NOT mapped to presentation, yet its
    // accessible name trims to empty — a non-decorative image with no text alternative.
    const f = findOf(`<img src="a" alt=" ">`, "img-alt-missing");
    expect(f).toHaveLength(1);
    expect(f[0]!.criteriaId).toBe("1.1.1");
  });
  it("non-conforming: img without alt", () => {
    const f = findOf(`<img src="a">`, "img-alt-missing");
    expect(f).toHaveLength(1);
    expect(f[0]!.criteriaId).toBe("1.1.1");
    expect(f[0]!.severity).toBe("bloquant");
  });
  it("conforming: <svg role=img> named by a <title> child", () => {
    expect(findOf(`<svg role="img"><title>Astro</title><path /></svg>`, "img-alt-missing")).toHaveLength(0);
  });
  it("non-conforming: <svg role=img> with no title/name", () => {
    expect(findOf(`<svg role="img"><path /></svg>`, "img-alt-missing")).toHaveLength(1);
  });
});

describe("decorative-alt-misuse (1.2)", () => {
  it("conforming: decorative alt without a name", () => {
    expect(findOf(`<img src="a" alt="">`, "decorative-alt-misuse")).toHaveLength(0);
  });
  it("non-conforming: alt='' but titled, or role=presentation with alt text", () => {
    expect(findOf(`<img src="a" alt="" title="Logo">`, "decorative-alt-misuse")).toHaveLength(1);
    expect(findOf(`<img src="a" role="presentation" alt="Logo">`, "decorative-alt-misuse")).toHaveLength(1);
  });
});

describe("canvas-fallback-missing (1.1)", () => {
  it("conforming: canvas with fallback content or aria-label", () => {
    expect(findOf(`<canvas><p>Graphique</p></canvas>`, "canvas-fallback-missing")).toHaveLength(0);
    expect(findOf(`<canvas role="img" aria-label="Graphique"></canvas>`, "canvas-fallback-missing")).toHaveLength(0);
  });
  it("non-conforming: empty canvas", () => {
    expect(findOf(`<canvas></canvas>`, "canvas-fallback-missing")).toHaveLength(1);
  });
});

describe("chart-no-accessible-name (1.1.1)", () => {
  it("non-conforming: charting container with no name", () => {
    expect(findOf(`<div class="recharts-wrapper"></div>`, "chart-no-accessible-name")).toHaveLength(1);
    expect(findOf(`<div class="chart"></div>`, "chart-no-accessible-name")).toHaveLength(1);
  });
  it("conforming: 'graph' token must not prefix-match 'graphics'/'graphic'", () => {
    expect(findOf(`<div class="info-graphics"></div>`, "chart-no-accessible-name")).toHaveLength(0);
    expect(findOf(`<div class="typography-graphic"></div>`, "chart-no-accessible-name")).toHaveLength(0);
  });
  it("conforming: named chart", () => {
    expect(findOf(`<div class="chart" aria-label="Ventes 2024"></div>`, "chart-no-accessible-name")).toHaveLength(0);
  });
});
