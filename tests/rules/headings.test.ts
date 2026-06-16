import { describe, it, expect } from "vitest";
import { findOf, page } from "./helpers.js";

describe("heading-order-skip (9.1)", () => {
  it("conforming: h1 → h2 → h3", () => {
    expect(findOf(`<h1>A</h1><h2>B</h2><h3>C</h3><h2>D</h2>`, "heading-order-skip")).toHaveLength(0);
  });
  it("non-conforming: h2 → h4 skips h3", () => {
    const f = findOf(`<h2>A</h2><h4>B</h4>`, "heading-order-skip");
    expect(f).toHaveLength(1);
    expect(f[0]!.criteriaId).toBe("9.1");
  });
});

describe("h1-missing (9.1)", () => {
  it("conforming: page has an h1", () => {
    expect(findOf(page("<h1>Titre</h1><p>x</p>"), "h1-missing")).toHaveLength(0);
  });
  it("non-conforming: page without h1", () => {
    expect(findOf(page("<h2>Sous-titre</h2>"), "h1-missing")).toHaveLength(1);
  });
  it("does not fire on a fragment", () => {
    expect(findOf(`<section><h2>x</h2></section>`, "h1-missing")).toHaveLength(0);
  });
});

describe("h1-multiple (9.1)", () => {
  it("conforming: a single h1", () => {
    expect(findOf(page("<h1>A</h1>"), "h1-multiple")).toHaveLength(0);
  });
  it("non-conforming: two h1 reports the extra", () => {
    const f = findOf(page("<h1>A</h1><h1>B</h1>"), "h1-multiple");
    expect(f).toHaveLength(1);
    expect(f[0]!.severity).toBe("mineur");
  });
});

describe("list-structure (9.3)", () => {
  it("conforming: ul of li", () => {
    expect(findOf(`<ul><li>a</li><li>b</li></ul>`, "list-structure")).toHaveLength(0);
  });
  it("non-conforming: a div directly inside a ul", () => {
    const f = findOf(`<ul><div>a</div></ul>`, "list-structure");
    expect(f).toHaveLength(1);
    expect(f[0]!.criteriaId).toBe("9.3");
  });
  it("non-conforming: an li outside any list", () => {
    expect(findOf(`<section><li>x</li></section>`, "list-structure")).toHaveLength(1);
  });
});
