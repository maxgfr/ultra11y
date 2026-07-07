import { describe, it, expect } from "vitest";
import { findOf } from "./helpers.js";

describe("iframe-title-missing (2.1)", () => {
  it("conforming: iframe with title or aria-label or aria-hidden", () => {
    expect(findOf(`<iframe src="x" title="Carte"></iframe>`, "iframe-title-missing")).toHaveLength(0);
    expect(findOf(`<iframe src="x" aria-label="Carte"></iframe>`, "iframe-title-missing")).toHaveLength(0);
    expect(findOf(`<iframe src="x" aria-hidden="true"></iframe>`, "iframe-title-missing")).toHaveLength(0);
  });
  it("non-conforming: iframe without a title", () => {
    const f = findOf(`<iframe src="x"></iframe>`, "iframe-title-missing");
    expect(f).toHaveLength(1);
    expect(f[0]!.criteriaId).toBe("4.1.2");
    expect(f[0]!.severity).toBe("bloquant");
  });
});

describe("iframe-title-missing — aria-labelledby (4.1.2)", () => {
  it("conforming: iframe named via aria-labelledby resolving in-document", () => {
    const src = `<h2 id="vid">Weekly briefing</h2><iframe src="x" aria-labelledby="vid"></iframe>`;
    expect(findOf(src, "iframe-title-missing")).toHaveLength(0);
  });
});
