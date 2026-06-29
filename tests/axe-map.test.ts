import { describe, it, expect } from "vitest";
import { scForAxe, scFromWcagTags, scForAxeRule, FALLBACK_SC } from "../src/axe-map.js";

describe("scFromWcagTags", () => {
  it("parses axe's native wcag tag into a success-criterion id", () => {
    expect(scFromWcagTags(["wcag2aa", "wcag143"])).toBe("1.4.3");
  });
  it("handles a two-digit guideline component", () => {
    expect(scFromWcagTags(["wcag1410"])).toBe("1.4.10");
  });
  it("returns the first tag that resolves to a real WCAG 2.2 AA SC", () => {
    expect(scFromWcagTags(["wcag111", "wcag143"])).toBe("1.1.1");
  });
  it("skips AAA / level-umbrella tags and unknown SCs", () => {
    // 1.4.6 is AAA (absent from the AA core); the level umbrellas carry no SC.
    expect(scFromWcagTags(["wcag2aaa", "wcag146", "best-practice"])).toBeNull();
  });
  it("returns null when no wcag tag is present", () => {
    expect(scFromWcagTags(["cat.color", "wcag2a"])).toBeNull();
  });
  it("tolerates undefined tags", () => {
    expect(scFromWcagTags(undefined)).toBeNull();
  });
});

describe("scForAxe", () => {
  it("prefers the curated map over the rule's wcag tags", () => {
    // color-contrast is deliberately mapped to 1.4.3; its tags must not override that
    expect(scForAxe("color-contrast", ["wcag111"])).toBe("1.4.3");
  });
  it("falls back to the rule's wcag tag for a rule absent from the curated map", () => {
    expect(scForAxe("some-future-axe-rule", ["wcag131"])).toBe("1.3.1");
  });
  it("falls back to 4.1.2 only when neither the map nor a tag resolves", () => {
    expect(scForAxe("totally-unknown", [])).toBe(FALLBACK_SC);
    expect(FALLBACK_SC).toBe("4.1.2");
  });
  it("still resolves curated rules with no tags supplied", () => {
    expect(scForAxeRule("button-name")).toBe("4.1.2");
    expect(scForAxeRule("label")).toBe("4.1.2");
    expect(scForAxeRule("link-name")).toBe("2.4.4");
  });
});
