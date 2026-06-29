import { describe, it, expect } from "vitest";
import { runAudit } from "../src/audit.js";
import type { Status } from "../src/types.js";

const FIX = new URL("./fixtures/", import.meta.url).pathname;
const statusOf = (r: ReturnType<typeof runAudit>, id: string): Status | undefined => r.criteria.find((c) => c.id === id)?.status;

describe("runAudit — non-conforming page", () => {
  const r = runAudit({ inputs: [`${FIX}non-conforming/bad.html`] });

  it("produces a well-formed WCAG-keyed AuditResult (55 SCs, schema v2)", () => {
    expect(r.tool).toBe("ultra11y");
    expect(r.standard).toBe("wcag");
    expect(r.schemaVersion).toBe(2);
    expect(r.criteria).toHaveLength(55);
    expect(r.date).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    expect(r.scope.files).toBe(1);
  });

  it("flags the expected success criteria as NC", () => {
    // img-alt → 1.1.1, iframe-title → 4.1.2, html-lang → 3.1.1, title → 2.4.2,
    // headings/tables → 1.3.1, link-name → 2.4.4, autoplay video → 2.2.2.
    for (const id of ["1.1.1", "4.1.2", "3.1.1", "2.4.2", "1.3.1", "2.4.4", "2.2.2"]) {
      expect(statusOf(r, id), `SC ${id}`).toBe("NC");
    }
  });

  it("conformance is below 100% and findings are present", () => {
    expect(r.conformancePct).toBeLessThan(100);
    expect(r.findings.length).toBeGreaterThan(5);
    expect(r.findings.every((f) => f.file.endsWith("bad.html"))).toBe(true);
  });

  it("non-static SCs are marked manual and listed as residual risks", () => {
    expect(statusOf(r, "1.4.3")).toBe("manual"); // contrast (needs-rendering), no literal-contrast finding
    expect(statusOf(r, "2.4.5")).toBe("manual"); // Multiple Ways (judgment, no rule)
    expect(r.residualRisks.length).toBeGreaterThan(30);
  });

  it("guideline tallies add up to each guideline's criteria count", () => {
    for (const g of r.guidelines) {
      const inGuideline = r.criteria.filter((c) => c.guideline === g.key).length;
      expect(g.c + g.nc + g.na + g.manual).toBe(inGuideline);
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
    expect(r.residualRisks.length).toBeGreaterThan(40);
  });

  it("marks static SCs with no relevant elements as NA", () => {
    expect(statusOf(r, "1.4.2")).toBe("NA"); // Audio Control — no audio/video on the good page
  });
});

describe("runAudit — stdin", () => {
  it("audits raw HTML passed via stdin", () => {
    const r = runAudit({ inputs: ["-"], stdin: `<img src="x">` });
    expect(r.scope.files).toBe(1);
    expect(r.findings.some((f) => f.ruleId === "img-alt-missing")).toBe(true);
  });
});
