// Regression guard for backlog #10: `CROSS_RULES` includes suppressor-only cross-*
// rules (they never call `crossToFinding`, so they can never make an RGAA criterion
// NC) alongside the two that DO raise findings. `crossRuleIds()` names the
// finding-raising subset but had no real consumer (dead code, tree-shaken out of the
// build). This test gives it one: no suppressor-only cross-* id may appear in any
// RGAA criterion's `appliesTo.ruleIds` — such an entry is inert data that could mask
// a genuinely wrong future mapping (see scripts/build-pack-rgaa.mjs RULE_TO_CRITERIA).
import { describe, it, expect } from "vitest";
import { CROSS_RULES, crossRuleIds } from "../src/rules/cross-registry.js";
import { loadPack } from "../src/standards/index.js";

describe("RGAA appliesTo never lists a suppressor-only cross-rule id", () => {
  const rgaa = loadPack("rgaa");
  const findingRaisers = new Set(crossRuleIds());
  const suppressorOnly = CROSS_RULES.map((r) => r.id).filter((id) => !findingRaisers.has(id));

  it("crossRuleIds() names a strict, non-empty subset of CROSS_RULES", () => {
    expect(findingRaisers.size).toBeGreaterThan(0);
    for (const id of findingRaisers)
      expect(
        CROSS_RULES.some((r) => r.id === id),
        `${id} must be a real CROSS_RULES entry`,
      ).toBe(true);
  });

  it("has at least one suppressor-only cross-rule to guard against (sanity check)", () => {
    expect(suppressorOnly.length).toBeGreaterThan(0);
  });

  it("no suppressor-only cross-rule id appears in any RGAA criterion's appliesTo.ruleIds", () => {
    for (const c of rgaa.criteria) {
      const ruleIds = c.appliesTo?.ruleIds ?? [];
      for (const id of suppressorOnly) {
        expect(ruleIds.includes(id), `RGAA ${c.id} appliesTo.ruleIds must not contain suppressor-only "${id}"`).toBe(false);
      }
    }
  });
});
