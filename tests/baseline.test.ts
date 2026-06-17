import { describe, it, expect } from "vitest";
import { findingId, diffAgainstBaseline, parseFailOn } from "../src/baseline.js";
import type { AuditResult, Finding } from "../src/types.js";

const F = (over: Partial<Finding> = {}): Finding => ({
  ruleId: "img-alt-missing",
  criteriaId: "1.1",
  file: "a.html",
  line: 1,
  col: 1,
  selectorHint: "img",
  severity: "bloquant",
  message: "",
  remediation: "",
  snippet: "",
  sourceStart: 10,
  sourceEnd: 20,
  ...over,
});

const audit = (findings: Finding[]): AuditResult => ({ findings } as AuditResult);

describe("finding identity", () => {
  it("is stable across line drift (keyed by source range, not line)", () => {
    expect(findingId(F({ line: 1 }))).toBe(findingId(F({ line: 99 })));
  });
  it("falls back to line/col/selector when no source range (JSX/stdin)", () => {
    const j = F({ sourceStart: undefined, sourceEnd: undefined });
    expect(findingId(j)).toContain("l1:1:img");
  });
  it("distinguishes different elements", () => {
    expect(findingId(F({ sourceStart: 10 }))).not.toBe(findingId(F({ sourceStart: 50 })));
  });
});

describe("baseline diff gate", () => {
  it("fails on a NEW blocking finding but lets the backlog through", () => {
    const baseline = audit([F({ sourceStart: 10 })]);
    const current = audit([F({ sourceStart: 10 }), F({ sourceStart: 50, line: 9 })]);
    const d = diffAgainstBaseline(current, baseline, "bloquant");
    expect(d.newFindings.map((f) => f.sourceStart)).toEqual([50]);
    expect(d.ok).toBe(false);
  });

  it("ignores a new finding below the --fail-on threshold", () => {
    const current = audit([F({ sourceStart: 50, severity: "mineur" })]);
    expect(diffAgainstBaseline(current, audit([]), "majeur").ok).toBe(true);
    expect(diffAgainstBaseline(current, audit([]), "mineur").ok).toBe(false);
  });

  it("reports fixed findings only for files the run actually audited", () => {
    const baseline = audit([F({ file: "a.html", sourceStart: 10 }), F({ file: "a.html", sourceStart: 30 }), F({ file: "b.html", sourceStart: 5 })]);
    const current = audit([F({ file: "a.html", sourceStart: 10 })]); // only a.html audited; 30 fixed
    const d = diffAgainstBaseline(current, baseline, "bloquant");
    expect(d.fixedFindings.map((f) => `${f.file}:${f.sourceStart}`)).toEqual(["a.html:30"]);
    // b.html was NOT audited in this run → never mis-reported as "fixed"
    expect(d.fixedFindings.some((f) => f.file === "b.html")).toBe(false);
  });

  it("treats a missing baseline as empty (every current finding is new)", () => {
    const current = audit([F({ sourceStart: 10 })]);
    expect(diffAgainstBaseline(current, null, "bloquant").newFindings.length).toBe(1);
  });

  it("parseFailOn defaults to bloquant", () => {
    expect(parseFailOn(undefined)).toBe("bloquant");
    expect(parseFailOn("majeur")).toBe("majeur");
    expect(parseFailOn("nonsense")).toBe("bloquant");
  });
});
