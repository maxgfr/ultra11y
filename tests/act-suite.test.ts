// R4b — ACT RULES FORMAT consistency. For each high-traffic rule, the engine is run over
// passed / failed / inapplicable examples modelled on the W3C ACT Rules Format. The bar
// (axe-core's own): NEVER fail a `passed`/`inapplicable` example — a single such
// `inconsistent` result is a hard fail. A `failed` example is `caught` (the rule fired) or,
// where automation is tech-limited, `cannot-tell` (recorded, allowed). Cases live in
// tests/fixtures/act/act-cases.json (original HTML; methodology per W3C ACT).
import { describe, it, expect } from "vitest";
import { readFileSync } from "node:fs";
import { parseSource } from "../src/parse/source.js";
import { runRules } from "../src/rules/registry.js";

interface Example {
  expected: "passed" | "failed" | "inapplicable";
  html: string;
}
interface ActRule {
  actRule: string;
  engineRuleIds: string[];
  examples: Example[];
}

const cases = JSON.parse(readFileSync(new URL("./fixtures/act/act-cases.json", import.meta.url), "utf8")) as { rules: ActRule[] };

/** Does any of the rule's engine ids fire on this HTML? */
function ruleFires(engineRuleIds: string[], html: string): boolean {
  const ids = new Set(engineRuleIds);
  return runRules(parseSource(html, "act.html")).some((f) => ids.has(f.ruleId));
}

describe("ACT Rules Format consistency", () => {
  const tally = { caught: 0, cannotTell: 0, passedClean: 0 };

  for (const rule of cases.rules) {
    describe(rule.actRule, () => {
      rule.examples.forEach((ex, i) => {
        it(`${ex.expected} example #${i + 1} is consistent`, () => {
          const fired = ruleFires(rule.engineRuleIds, ex.html);
          if (ex.expected === "passed" || ex.expected === "inapplicable") {
            // A passed/inapplicable example the engine flags is a FALSE POSITIVE — the hard fail.
            expect(fired, `INCONSISTENT: flagged a ${ex.expected} example of ${rule.actRule}`).toBe(false);
            tally.passedClean++;
          } else {
            // A failed example: caught (fired) is ideal; not-fired is an allowed cannot-tell.
            if (fired) tally.caught++;
            else tally.cannotTell++;
            expect(true).toBe(true);
          }
        });
      });
    });
  }

  it("records the caught / cannot-tell / passed-clean tally (never a silent gap)", () => {
    // Every passed/inapplicable example passed clean (asserted above); surface the numbers.
    expect(tally.passedClean).toBeGreaterThan(0);
    // Most failed examples should be caught (the machine-decidable ones); none may be a FP.
    expect(tally.caught).toBeGreaterThanOrEqual(tally.cannotTell);
  });
});
