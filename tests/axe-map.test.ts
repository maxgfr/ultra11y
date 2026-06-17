import { describe, it, expect } from "vitest";
import { criterionForAxe, criterionFromRgaaTags } from "../src/axe-map.js";

describe("criterionFromRgaaTags", () => {
  it("collapses an axe per-test RGAA tag to its criterion", () => {
    expect(criterionFromRgaaTags(["wcag2aa", "RGAA-3.2.1"])).toBe("3.2");
  });
  it("handles a two-digit theme", () => {
    expect(criterionFromRgaaTags(["RGAA-13.9.1"])).toBe("13.9");
  });
  it("returns the first RGAA tag when several are present", () => {
    expect(criterionFromRgaaTags(["RGAA-7.1.1", "RGAA-7.1.2"])).toBe("7.1");
  });
  it("returns null when no RGAA tag is present", () => {
    expect(criterionFromRgaaTags(["wcag2a", "cat.color"])).toBeNull();
  });
  it("ignores the RGAAv4 umbrella tag (no criterion in it)", () => {
    expect(criterionFromRgaaTags(["RGAAv4"])).toBeNull();
  });
  it("tolerates undefined tags", () => {
    expect(criterionFromRgaaTags(undefined)).toBeNull();
  });
});

describe("criterionForAxe", () => {
  it("prefers the curated map over the rule's RGAA tags", () => {
    // color-contrast is deliberately mapped to 3.2; its tags must not override that
    expect(criterionForAxe("color-contrast", ["RGAA-3.3.1"])).toBe("3.2");
  });
  it("falls back to the RGAA tag for a rule absent from the curated map", () => {
    expect(criterionForAxe("some-future-axe-rule", ["RGAA-13.9.1"])).toBe("13.9");
  });
  it("falls back to 7.1 only when neither the map nor a tag resolves", () => {
    expect(criterionForAxe("totally-unknown", [])).toBe("7.1");
  });
  it("still resolves curated rules with no tags supplied", () => {
    expect(criterionForAxe("button-name")).toBe("7.1");
    expect(criterionForAxe("label")).toBe("11.1");
  });
});
