import { describe, it, expect } from "vitest";
import { findOf, page } from "./helpers.js";

describe("html-lang-missing (8.3)", () => {
  it("conforming: <html lang=fr>", () => {
    expect(findOf(page("<p>x</p>"), "html-lang-missing")).toHaveLength(0);
  });
  it("non-conforming: <html> without lang", () => {
    const f = findOf(page("<p>x</p>", "<title>T</title>", ""), "html-lang-missing");
    expect(f).toHaveLength(1);
    expect(f[0]!.criteriaId).toBe("8.3");
  });
  it("does not fire on a fragment (page-scoped)", () => {
    expect(findOf(`<p>fragment</p>`, "html-lang-missing")).toHaveLength(0);
  });
});

describe("title-missing-empty (8.5)", () => {
  it("conforming: non-empty title", () => {
    expect(findOf(page("<p>x</p>", "<title>Accueil</title>"), "title-missing-empty")).toHaveLength(0);
  });
  it("non-conforming: missing or empty title", () => {
    expect(findOf(page("<p>x</p>", ""), "title-missing-empty")).toHaveLength(1);
    expect(findOf(page("<p>x</p>", "<title>  </title>"), "title-missing-empty")).toHaveLength(1);
  });
});

describe("duplicate-id (8.2)", () => {
  it("conforming: unique ids", () => {
    expect(findOf(`<div id="a"></div><div id="b"></div>`, "duplicate-id")).toHaveLength(0);
  });
  it("non-conforming: a repeated id reports the extra occurrences", () => {
    const f = findOf(`<div id="x"></div><span id="x"></span><p id="x"></p>`, "duplicate-id");
    expect(f).toHaveLength(2);
    expect(f[0]!.criteriaId).toBe("8.2");
  });
});

describe("inline-lang-change-missing (8.7)", () => {
  it("conforming: valid inline lang", () => {
    expect(findOf(`<span lang="en">Hello</span>`, "inline-lang-change-missing")).toHaveLength(0);
  });
  it("non-conforming: empty lang attribute", () => {
    expect(findOf(`<span lang="">Hello</span>`, "inline-lang-change-missing")).toHaveLength(1);
  });
});
