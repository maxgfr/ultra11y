import { describe, it, expect } from "vitest";
import { findOf } from "./helpers.js";

describe("img-alt-missing (1.1)", () => {
  it("conforming: img with alt, decorative alt, aria-label, aria-hidden", () => {
    expect(findOf(`<img src="a" alt="Un chat">`, "img-alt-missing")).toHaveLength(0);
    expect(findOf(`<img src="a" alt="">`, "img-alt-missing")).toHaveLength(0);
    expect(findOf(`<img src="a" aria-label="Chat">`, "img-alt-missing")).toHaveLength(0);
    expect(findOf(`<img src="a" aria-hidden="true">`, "img-alt-missing")).toHaveLength(0);
  });
  it("non-conforming: img without alt", () => {
    const f = findOf(`<img src="a">`, "img-alt-missing");
    expect(f).toHaveLength(1);
    expect(f[0]!.criteriaId).toBe("1.1");
    expect(f[0]!.severity).toBe("bloquant");
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
