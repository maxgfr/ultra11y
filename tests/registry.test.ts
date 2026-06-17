import { describe, it, expect } from "vitest";
import { ALL_RULES, ruleIds } from "../src/rules/registry.js";
import { rgaa, getCriterion } from "../src/rgaa.js";

describe("rule registry ↔ dataset coverage", () => {
  it("registers 36 rules with unique ids", () => {
    expect(ALL_RULES.length).toBe(36);
    expect(new Set(ruleIds()).size).toBe(36);
  });

  it("every rule maps only to real RGAA criteria", () => {
    for (const r of ALL_RULES) {
      expect(r.criteria.length).toBeGreaterThan(0);
      for (const c of r.criteria) expect(getCriterion(c), `${r.id} → ${c}`).toBeDefined();
    }
  });

  it("every ruleId in the dataset is a registered rule (no dangling mapping)", () => {
    const registered = new Set(ruleIds());
    for (const c of rgaa.criteria) {
      for (const rid of c.ruleIds) expect(registered.has(rid), `${c.id} cites unknown rule ${rid}`).toBe(true);
    }
  });

  it("every registered rule is referenced by the dataset (no orphan rule)", () => {
    const cited = new Set(rgaa.criteria.flatMap((c) => c.ruleIds));
    for (const r of ALL_RULES) expect(cited.has(r.id), `rule ${r.id} is not cited by any criterion`).toBe(true);
  });

  it("rule.criteria and dataset ruleIds agree both ways", () => {
    // if a criterion lists a rule, that rule must list the criterion
    for (const c of rgaa.criteria) {
      for (const rid of c.ruleIds) {
        const r = ALL_RULES.find((x) => x.id === rid)!;
        expect(r.criteria, `${rid} should cover ${c.id}`).toContain(c.id);
      }
    }
    // every static criterion has at least one rule (non-static may carry a
    // definite-NC rule, e.g. 10.4 meta-viewport-zoom-block)
    for (const c of rgaa.criteria) {
      if (c.automatability === "static") expect(c.ruleIds.length, c.id).toBeGreaterThan(0);
    }
  });
});
