import { describe, it, expect } from "vitest";
import { mkdtempSync, existsSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { toDynamicResult, mergeDynamic, cleanTempContexts } from "../src/scan.js";
import { runAudit } from "../src/audit.js";

const FIX = new URL("./fixtures/", import.meta.url).pathname;

// a recorded runner output (no Docker needed to test the mapping/merge logic)
const sampleOut = {
  url: "https://exemple.fr",
  violations: [
    { id: "color-contrast", impact: "serious", help: "Elements must have sufficient color contrast", nodes: [{ target: ["p.lead"], html: "<p class='lead'>x</p>" }] },
    { id: "button-name", impact: "critical", help: "Buttons must have discernible text", nodes: [{ target: ["button"], html: "<button></button>" }] },
  ],
  reflow: { horizontalScroll: true },
};

describe("toDynamicResult", () => {
  const dyn = toDynamicResult(sampleOut, "https://exemple.fr");
  it("maps axe color-contrast → 3.2 and reflow → 10.11", () => {
    expect(dyn.findings.find((f) => f.axeRule === "color-contrast")?.criteriaId).toBe("3.2");
    expect(dyn.findings.find((f) => f.engine === "reflow")?.criteriaId).toBe("10.11");
  });
  it("derives severity from axe impact", () => {
    expect(dyn.findings.find((f) => f.axeRule === "button-name")?.severity).toBe("bloquant");
  });
});

describe("cleanTempContexts", () => {
  it("removes leftover dynamic build contexts from the temp dir", () => {
    const a = mkdtempSync(join(tmpdir(), "ultra11y-dyn-"));
    const b = mkdtempSync(join(tmpdir(), "ultra11y-dyn-"));
    expect(existsSync(a)).toBe(true);
    const removed = cleanTempContexts();
    expect(removed).toBeGreaterThanOrEqual(2);
    expect(existsSync(a)).toBe(false);
    expect(existsSync(b)).toBe(false);
  });
});

describe("mergeDynamic", () => {
  it("upgrades a needs-rendering 'manual' criterion to NC and drops it from residual risks", () => {
    const audit = runAudit({ inputs: [`${FIX}conforming/good.html`] });
    expect(audit.criteria.find((c) => c.id === "3.2")?.status).toBe("manual");
    const dyn = toDynamicResult(sampleOut, "https://exemple.fr");
    const merged = mergeDynamic(audit, dyn);
    expect(merged.criteria.find((c) => c.id === "3.2")?.status).toBe("NC");
    expect(merged.criteria.find((c) => c.id === "10.11")?.status).toBe("NC");
    expect(merged.residualRisks.some((r) => r.criteriaId === "3.2")).toBe(false);
    expect(merged.findings.some((f) => f.ruleId === "axe:color-contrast")).toBe(true);
    // theme tallies stay consistent
    for (const t of merged.themes) {
      const inTheme = merged.criteria.filter((c) => c.theme === t.number).length;
      expect(t.c + t.nc + t.na + t.manual).toBe(inTheme);
    }
  });
});
