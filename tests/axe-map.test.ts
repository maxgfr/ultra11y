import { describe, it, expect } from "vitest";
import { scForAxe, scFromWcagTags, scForAxeRule, FALLBACK_SC, AXE_WCAG, AXE_ADVISORY_EXCEPTIONS, AXE_STATIC_TWIN, isAxeAdvisory } from "../src/axe-map.js";
import { ruleById } from "../src/rules/registry.js";

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

// Cross-channel normativity consistency: a rule ultra11y ships as NORMATIVE statically
// must not silently become advisory when the same defect is found dynamically (axe/scan).
// These assertions are DERIVED from the registry rather than hardcoded, so the check
// fails the moment AXE_ADVISORY_EXCEPTIONS/AXE_STATIC_TWIN drifts from src/rules/*.ts
// (a twin gets renamed, removed, or is (re)marked advisory).
describe("AXE_ADVISORY_EXCEPTIONS — cross-channel normativity consistency", () => {
  it("pins every exception to false (always normative) — no advisory pin exists today", () => {
    for (const [ruleId, advisory] of Object.entries(AXE_ADVISORY_EXCEPTIONS)) {
      expect(advisory, `${ruleId} is pinned advisory (true) — was this intended?`).toBe(false);
    }
  });

  it("declares a static twin for every pinned axe rule", () => {
    for (const ruleId of Object.keys(AXE_ADVISORY_EXCEPTIONS)) {
      expect(AXE_STATIC_TWIN[ruleId], `no AXE_STATIC_TWIN entry for pinned axe rule "${ruleId}"`).toBeDefined();
      expect(AXE_STATIC_TWIN[ruleId]!.length).toBeGreaterThan(0);
    }
  });

  it("every declared static twin is registered in src/rules/registry.ts AND normative", () => {
    for (const [axeRuleId, twinIds] of Object.entries(AXE_STATIC_TWIN)) {
      for (const twinId of twinIds) {
        const rule = ruleById(twinId);
        expect(rule, `static twin "${twinId}" (for axe rule "${axeRuleId}") is not registered in ALL_RULES`).toBeDefined();
        expect(rule!.advisory, `static twin "${twinId}" (for axe rule "${axeRuleId}") must be normative (advisory !== true)`).not.toBe(true);
      }
    }
  });

  it("deliberately-advisory rules (best-practice only, no normative twin) are NOT pinned", () => {
    // page-has-heading-one stays advisory consistent with h1-missing/h1-multiple
    // (src/rules/headings.ts) being advisory; the others have no static twin at all.
    for (const stillAdvisory of ["empty-table-header", "page-has-heading-one", "region", "accesskeys", "image-redundant-alt"]) {
      expect(AXE_ADVISORY_EXCEPTIONS[stillAdvisory], `${stillAdvisory} unexpectedly pinned`).toBeUndefined();
    }
  });

  it("isAxeAdvisory: a pinned rule stays normative even with best-practice-only tags", () => {
    expect(isAxeAdvisory("heading-order", ["cat.semantics", "best-practice"])).toBe(false);
    expect(isAxeAdvisory("tabindex", ["best-practice"])).toBe(false);
    expect(isAxeAdvisory("skip-link", ["best-practice"])).toBe(false);
    expect(isAxeAdvisory("label-title-only", ["best-practice"])).toBe(false);
    expect(isAxeAdvisory("landmark-one-main", ["cat.semantics", "best-practice"])).toBe(false);
    expect(isAxeAdvisory("empty-heading", ["cat.name-role-value", "best-practice"])).toBe(false);
    // Exact-id twins pinned for drift-proofing: axe tags these with real wcag<digits> tags
    // TODAY. axe-core is now pinned EXACTLY (4.12.1 in docker/package.json + scan.ts PKG),
    // but a future version BUMP of that pin could still re-tag them — so a re-tag must not
    // silently demote them: the pin, not the tags, decides.
    expect(isAxeAdvisory("duplicate-id", ["cat.parsing", "best-practice"])).toBe(false);
    expect(isAxeAdvisory("nested-interactive", ["cat.keyboard", "best-practice"])).toBe(false);
    expect(isAxeAdvisory("form-field-multiple-labels", ["cat.forms", "best-practice"])).toBe(false);
    expect(isAxeAdvisory("aria-required-children", ["cat.aria", "best-practice"])).toBe(false);
  });

  it("isAxeAdvisory: a non-pinned best-practice-only rule stays advisory", () => {
    expect(isAxeAdvisory("empty-table-header", ["cat.name-role-value", "best-practice"])).toBe(true);
  });

  // COMPLETENESS direction: the tests above guard pinned → twin (every pin is backed by a
  // registered normative twin); this guards the reverse for EXACT-id matches — an AXE_WCAG
  // key that IS a registered normative static rule id must be pinned (same defect, must
  // stay normative cross-channel regardless of axe's current tagging — axe-core is pinned
  // EXACTLY (docker/package.json + scan.ts PKG), yet a future version bump of that pin could
  // re-tag with no rule change here). This makes the guard two-directional for exact-id
  // matches only; near-twins with DIFFERENT
  // ids (heading-order vs heading-order-skip…) remain hand-curated and are not derivable.
  it("completeness: every AXE_WCAG key exactly matching a registered normative static rule id is pinned", () => {
    for (const axeRuleId of Object.keys(AXE_WCAG)) {
      const twin = ruleById(axeRuleId);
      if (!twin || twin.advisory === true) continue; // no exact-id normative static twin
      expect(
        axeRuleId in AXE_ADVISORY_EXCEPTIONS,
        `AXE_WCAG key "${axeRuleId}" exactly matches a registered normative static rule — pin it in AXE_ADVISORY_EXCEPTIONS`,
      ).toBe(true);
    }
  });
});
