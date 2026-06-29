import { describe, it, expect } from "vitest";
import { loadPack, getPack, isCore, hasStandard, listStandards, packsForSc, resolveStandard, derivePackResults } from "../src/standards/index.js";
import { hasSC } from "../src/wcag.js";
import type { AuditResult, Finding } from "../src/types.js";

const finding = (criteriaId: string): Finding => ({
  ruleId: "x",
  criteriaId,
  file: "a.html",
  line: 1,
  col: 1,
  selectorHint: "x",
  severity: "bloquant",
  message: "m",
  remediation: "r",
  snippet: "s",
});

// A small synthetic WCAG-keyed AuditResult, so derive() is tested on a fixed input
// rather than a full live audit.
const synthetic = (): AuditResult => ({
  tool: "ultra11y",
  standard: "wcag",
  version: "test",
  schemaVersion: 2,
  date: "2026-01-01",
  scope: { inputs: ["a.html"], files: 1 },
  guidelines: [],
  criteria: [
    { id: "3.1.1", guideline: "3.1", status: "NC", findings: [finding("3.1.1")] },
    { id: "1.1.1", guideline: "1.1", status: "C", findings: [] },
  ],
  findings: [finding("3.1.1")],
  residualRisks: [],
  conformancePct: 50,
});

describe("standards registry", () => {
  it("knows the WCAG core and the RGAA pack", () => {
    expect(isCore("wcag")).toBe(true);
    expect(isCore("rgaa")).toBe(false);
    expect(hasStandard("wcag")).toBe(true);
    expect(hasStandard("rgaa")).toBe(true);
    expect(hasStandard("nope")).toBe(false);
    expect(listStandards()).toContain("wcag");
    expect(listStandards()).toContain("rgaa");
  });

  it("loadPack throws on an unknown key (never silent fallback)", () => {
    expect(() => loadPack("nope")).toThrow(/unknown standards pack/);
    expect(getPack("nope")).toBeUndefined();
    expect(loadPack("rgaa").key).toBe("rgaa");
  });

  it("resolveStandard defaults to wcag, lower-cases packs, throws on unknown", () => {
    expect(resolveStandard(undefined)).toBe("wcag");
    expect(resolveStandard(true)).toBe("wcag");
    expect(resolveStandard("rgaa")).toBe("rgaa");
    expect(resolveStandard("RGAA")).toBe("rgaa");
    expect(() => resolveStandard("nope")).toThrow(/unknown standard/);
  });

  it("packsForSc reverse-maps a WCAG SC to pack criteria", () => {
    const hits = packsForSc("3.1.1");
    const rgaa = hits.find((h) => h.key === "rgaa");
    expect(rgaa).toBeDefined();
    expect(rgaa!.ids).toContain("8.3");
  });
});

describe("RGAA pack schema", () => {
  const pack = loadPack("rgaa");
  const idRe = new RegExp(pack.idPattern);

  it("declares a valid header (key, default locale, attribution)", () => {
    expect(pack.key).toBe("rgaa");
    expect(pack.key).not.toBe("wcag"); // reserved
    expect(pack.locales).toContain(pack.defaultLocale);
    expect(pack.attribution).toMatch(/DINUM/);
    expect(pack.themes.length).toBe(13);
    expect(pack.criteria.length).toBe(106);
  });

  it("every theme + criterion carries the default locale", () => {
    for (const t of pack.themes) expect(t.name[pack.defaultLocale], `theme ${t.number}`).toBeDefined();
    for (const c of pack.criteria) {
      expect(c.id, c.id).toMatch(idRe);
      expect(c.title[pack.defaultLocale], `title ${c.id}`).toBeDefined();
      expect(c.titlePlain[pack.defaultLocale], `titlePlain ${c.id}`).toBeDefined();
    }
  });

  it("maps every criterion to well-formed SCs; only 4.1.1 (removed in 2.2) falls outside the AA core", () => {
    for (const c of pack.criteria) {
      expect(c.wcag.length, `wcag of ${c.id}`).toBeGreaterThan(0);
      for (const sc of c.wcag) {
        expect(sc, `SC shape ${sc}`).toMatch(/^\d+\.\d+\.\d+$/);
        // RGAA (a WCAG 2.1 standard) may map to SCs outside our WCAG 2.2 AA core, but
        // the ONLY such SC is 4.1.1 Parsing — obsolete and removed in 2.2.
        if (!hasSC(sc)) expect(sc, `${c.id} → ${sc} is the removed 4.1.1`).toBe("4.1.1");
      }
    }
  });

  it("all but one criterion (8.1 doctype → removed 4.1.1) map into the WCAG 2.2 AA core", () => {
    const orphaned = pack.criteria.filter((c) => !c.wcag.some((sc) => hasSC(sc))).map((c) => c.id);
    expect(orphaned).toEqual(["8.1"]);
  });
});

describe("derivePackResults (WCAG → pack projection)", () => {
  it("projects a WCAG-keyed audit onto RGAA criteria with NC-dominates", () => {
    const results = derivePackResults(synthetic(), "rgaa");
    const byId = new Map(results.map((r) => [r.id, r]));
    // RGAA 8.3 maps to WCAG 3.1.1 (NC in the fixture) → NC, carrying the finding.
    expect(byId.get("8.3")?.status).toBe("NC");
    expect(byId.get("8.3")?.findings.length).toBe(1);
    // RGAA 1.1 maps to 1.1.1 (C in the fixture) → C.
    expect(byId.get("1.1")?.status).toBe("C");
    // A criterion whose SCs are absent from the audit → NA.
    const na = results.find((r) => r.scs.every((sc) => sc !== "3.1.1" && sc !== "1.1.1"));
    expect(na?.status).toBe("NA");
  });
});
