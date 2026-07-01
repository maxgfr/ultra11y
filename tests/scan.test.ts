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
    {
      id: "color-contrast",
      impact: "serious",
      help: "Elements must have sufficient color contrast",
      nodes: [{ target: ["p.lead"], html: "<p class='lead'>x</p>" }],
    },
    { id: "button-name", impact: "critical", help: "Buttons must have discernible text", nodes: [{ target: ["button"], html: "<button></button>" }] },
  ],
  reflow: { horizontalScroll: true },
};

describe("toDynamicResult", () => {
  const dyn = toDynamicResult(sampleOut, "https://exemple.fr");
  it("maps axe color-contrast → 1.4.3 and reflow → 1.4.10", () => {
    expect(dyn.findings.find((f) => f.axeRule === "color-contrast")?.criteriaId).toBe("1.4.3");
    expect(dyn.findings.find((f) => f.engine === "reflow")?.criteriaId).toBe("1.4.10");
  });
  it("derives severity from axe impact", () => {
    expect(dyn.findings.find((f) => f.axeRule === "button-name")?.severity).toBe("bloquant");
  });
  it("tags each finding with the page it came from", () => {
    expect(dyn.findings.find((f) => f.axeRule === "color-contrast")?.page).toBe("https://exemple.fr");
  });
  it("maps an axe rule absent from the curated map via its native wcag tag, not the 4.1.2 fallback", () => {
    const out = {
      url: "https://exemple.fr",
      violations: [{ id: "some-future-rule", impact: "moderate", help: "X", tags: ["wcag2aa", "wcag131"], nodes: [{ target: ["div"], html: "<div></div>" }] }],
      reflow: { horizontalScroll: false },
    };
    const r = toDynamicResult(out, "https://exemple.fr");
    expect(r.findings.find((f) => f.axeRule === "some-future-rule")?.criteriaId).toBe("1.3.1");
  });
});

describe("toDynamicResult — residual-criteria probes (local runtime)", () => {
  const out = {
    url: "https://exemple.fr",
    violations: [],
    reflow: { horizontalScroll: false },
    focusVisible: [{ selector: "button.x", html: "<button>", detail: "no focus indicator" }],
    textSpacing: [{ selector: "p.z", html: "<p>", detail: "clipped" }],
    hover: [],
    reflowZoom: [{ selector: "document", html: "", detail: "200% scroll" }],
  };
  const dyn = toDynamicResult(out, "https://exemple.fr", "en", "axe-core@playwright (local)");
  it("maps each probe to its WCAG SC + severity", () => {
    expect(dyn.findings.find((f) => f.engine === "focus-visible")?.criteriaId).toBe("2.4.7");
    expect(dyn.findings.find((f) => f.engine === "text-spacing")?.criteriaId).toBe("1.4.12");
    expect(dyn.findings.find((f) => f.engine === "reflow-zoom")?.criteriaId).toBe("1.4.4");
    expect(dyn.findings.find((f) => f.engine === "focus-visible")?.severity).toBe("majeur");
    expect(dyn.findings.find((f) => f.engine === "text-spacing")?.severity).toBe("mineur");
  });
  it("carries the local engine label", () => {
    expect(dyn.engine).toBe("axe-core@playwright (local)");
  });
  it("merges probe findings into the static audit, upgrading manual SCs to NC with a dyn- ruleId", () => {
    const audit = runAudit({ inputs: [`${FIX}conforming/good.html`] });
    expect(audit.criteria.find((c) => c.id === "2.4.7")?.status).toBe("manual");
    const merged = mergeDynamic(audit, dyn);
    expect(merged.criteria.find((c) => c.id === "2.4.7")?.status).toBe("NC");
    expect(merged.findings.some((f) => f.ruleId === "dyn-focus-visible")).toBe(true);
    expect(merged.residualRisks.some((r) => r.criteriaId === "2.4.7")).toBe(false);
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
  it("upgrades a needs-rendering 'manual' SC to NC and drops it from residual risks", () => {
    const audit = runAudit({ inputs: [`${FIX}conforming/good.html`] });
    expect(audit.criteria.find((c) => c.id === "1.4.3")?.status).toBe("manual");
    const dyn = toDynamicResult(sampleOut, "https://exemple.fr");
    const merged = mergeDynamic(audit, dyn);
    expect(merged.criteria.find((c) => c.id === "1.4.3")?.status).toBe("NC");
    expect(merged.criteria.find((c) => c.id === "1.4.10")?.status).toBe("NC");
    expect(merged.residualRisks.some((r) => r.criteriaId === "1.4.3")).toBe(false);
    expect(merged.findings.some((f) => f.ruleId === "axe:color-contrast")).toBe(true);
    // guideline tallies stay consistent
    for (const g of merged.guidelines) {
      const inGuideline = merged.criteria.filter((c) => c.guideline === g.key).length;
      expect(g.c + g.nc + g.na + g.manual).toBe(inGuideline);
    }
  });
  it("uses each finding's page as its file when merging multi-page (crawl) results", () => {
    const audit = runAudit({ inputs: [`${FIX}conforming/good.html`] });
    const dyn = {
      tool: "ultra11y" as const,
      engine: "axe-core@playwright (docker)",
      target: "crawl:https://exemple.fr",
      date: "2026-06-17",
      findings: [
        {
          criteriaId: "1.4.3",
          axeRule: "color-contrast",
          impact: "serious",
          severity: "majeur" as const,
          message: "m",
          selector: "p",
          snippet: "",
          engine: "axe" as const,
          page: "https://exemple.fr/contact",
        },
      ],
    };
    const merged = mergeDynamic(audit, dyn);
    expect(merged.findings.find((f) => f.ruleId === "axe:color-contrast")?.file).toBe("https://exemple.fr/contact");
  });
});
