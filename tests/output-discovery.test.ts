import { describe, it, expect } from "vitest";
import { runAudit } from "../src/audit.js";
import { expandInputs } from "../src/glob.js";

describe("scope.sourceTemplate + finding.preliminary (SFC source audits)", () => {
  const r = runAudit({ inputs: ["tests/fixtures/sfc"], dedup: "off" });
  it("flags the run as a preliminary SFC-source audit", () => {
    expect(r.scope.sourceTemplate).toBeDefined();
    expect(r.scope.sourceTemplate?.files).toBeGreaterThan(0);
    expect(r.scope.sourceTemplate?.extensions).toContain(".vue");
  });
  it("marks SFC-source findings as preliminary", () => {
    const f = r.findings.find((x) => x.ruleId === "button-empty-name");
    expect(f).toBeDefined();
    expect(f?.preliminary).toBe(true);
  });
  it("plain HTML findings are not marked preliminary", () => {
    const h = runAudit({ inputs: ["tests/fixtures/non-conforming/bad.html"], dedup: "off" });
    expect(h.scope.sourceTemplate).toBeUndefined();
    expect(h.findings.every((f) => f.preliminary === undefined)).toBe(true);
  });
});

describe("default test/spec/story exclusion (--no-default-excludes opt-out)", () => {
  const ends = (fs: string[], s: string): boolean => fs.some((f) => f.endsWith(s));

  it("excludes *.test.*, *.stories.* and __tests__/ by default", () => {
    const files = expandInputs(["tests/fixtures/excl"]);
    expect(ends(files, "Comp.tsx")).toBe(true); // real product code kept
    expect(ends(files, "Comp.test.tsx")).toBe(false);
    expect(ends(files, "Comp.stories.tsx")).toBe(false);
    expect(files.some((f) => /__tests__/.test(f))).toBe(false);
  });
  it("--no-default-excludes audits them", () => {
    const all = expandInputs(["tests/fixtures/excl"], { noDefaultExcludes: true });
    expect(ends(all, "Comp.test.tsx")).toBe(true);
    expect(all.some((f) => /__tests__/.test(f))).toBe(true);
  });
  it("a directly-named test file is re-admitted", () => {
    expect(expandInputs(["tests/fixtures/excl/Comp.test.tsx"]).length).toBe(1);
  });
  it("an explicit --include re-admits matching test files", () => {
    const inc = expandInputs(["tests/fixtures/excl"], { include: ["**/*.test.tsx"] });
    expect(ends(inc, "Comp.test.tsx")).toBe(true);
  });
  it("warns (no silent drop) when default excludes drop files", () => {
    const msgs: string[] = [];
    expandInputs(["tests/fixtures/excl"], { onWarn: (m) => msgs.push(m) });
    expect(msgs.some((m) => /test\/spec\/story/.test(m))).toBe(true);
  });
});
