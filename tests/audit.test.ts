import { describe, it, expect } from "vitest";
import { runAudit } from "../src/audit.js";
import type { Status } from "../src/types.js";

const FIX = new URL("./fixtures/", import.meta.url).pathname;
const statusOf = (r: ReturnType<typeof runAudit>, id: string): Status | undefined => r.criteria.find((c) => c.id === id)?.status;

describe("runAudit — non-conforming page", () => {
  const r = runAudit({ inputs: [`${FIX}non-conforming/bad.html`] });

  it("produces a well-formed AuditResult with all 106 criteria", () => {
    expect(r.tool).toBe("ultra11y");
    expect(r.criteria).toHaveLength(106);
    expect(r.date).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    expect(r.scope.files).toBe(1);
  });

  it("flags the expected criteria as NC", () => {
    for (const id of ["1.1", "2.1", "8.3", "8.5", "9.1", "6.2", "11.1", "5.6", "5.4", "13.8"]) {
      expect(statusOf(r, id), `criterion ${id}`).toBe("NC");
    }
  });

  it("conformance is below 100% and findings are present", () => {
    expect(r.conformancePct).toBeLessThan(100);
    expect(r.findings.length).toBeGreaterThan(5);
    expect(r.findings.every((f) => f.file.endsWith("bad.html"))).toBe(true);
  });

  it("non-static criteria are marked manual and listed as residual risks", () => {
    expect(statusOf(r, "3.2")).toBe("manual"); // contrast (needs-rendering)
    expect(statusOf(r, "1.3")).toBe("manual"); // alt relevance (judgment)
    expect(r.residualRisks.length).toBeGreaterThan(50);
  });

  it("theme tallies add up to each theme's criteria count", () => {
    for (const t of r.themes) {
      const inTheme = r.criteria.filter((c) => c.theme === t.number).length;
      expect(t.c + t.nc + t.na + t.manual).toBe(inTheme);
    }
  });
});

describe("runAudit — conforming page", () => {
  const r = runAudit({ inputs: [`${FIX}conforming/good.html`] });

  it("finds no non-conformity and reports 100% automatic conformance", () => {
    expect(r.findings).toHaveLength(0);
    expect(r.conformancePct).toBe(100);
    expect(r.criteria.some((c) => c.status === "NC")).toBe(false);
  });

  it("still surfaces manual criteria as residual risks", () => {
    expect(r.residualRisks.length).toBeGreaterThan(50);
  });

  it("marks criteria with no relevant elements as NA", () => {
    expect(statusOf(r, "4.10")).toBe("NA"); // no audio/video on the good page
  });
});

describe("runAudit — stdin", () => {
  it("audits raw HTML passed via stdin", () => {
    const r = runAudit({ inputs: ["-"], stdin: `<img src="x">` });
    expect(r.scope.files).toBe(1);
    expect(r.findings.some((f) => f.ruleId === "img-alt-missing")).toBe(true);
  });
});
