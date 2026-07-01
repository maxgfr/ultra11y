import { describe, it, expect } from "vitest";
import { findOf } from "./helpers.js";

describe("meta-viewport-zoom-block (10.4)", () => {
  it("conforming: viewport allowing zoom", () => {
    expect(findOf(`<meta name="viewport" content="width=device-width, initial-scale=1">`, "meta-viewport-zoom-block")).toHaveLength(0);
  });
  it("non-conforming: user-scalable=no", () => {
    const f = findOf(`<meta name="viewport" content="width=device-width, user-scalable=no">`, "meta-viewport-zoom-block");
    expect(f).toHaveLength(1);
    expect(f[0]!.criteriaId).toBe("1.4.4");
  });
  it("non-conforming: maximum-scale below 2", () => {
    expect(findOf(`<meta name="viewport" content="width=device-width, maximum-scale=1.0">`, "meta-viewport-zoom-block")).toHaveLength(1);
  });
});

describe("meta-viewport-zoom-block — malformed maximum-scale", () => {
  it("conforming: an empty maximum-scale= must not be read as 0 and flagged", () => {
    expect(findOf(`<meta name="viewport" content="width=device-width, maximum-scale=">`, "meta-viewport-zoom-block")).toHaveLength(0);
    expect(findOf(`<meta name="viewport" content="width=device-width, maximum-scale=abc">`, "meta-viewport-zoom-block")).toHaveLength(0);
  });
  it("still flags a real maximum-scale below 2 (and >=2 conforms)", () => {
    expect(findOf(`<meta name="viewport" content="width=device-width, maximum-scale=1">`, "meta-viewport-zoom-block")).toHaveLength(1);
    expect(findOf(`<meta name="viewport" content="width=device-width, maximum-scale=2">`, "meta-viewport-zoom-block")).toHaveLength(0);
  });
});
