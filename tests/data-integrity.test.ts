import { describe, it, expect } from "vitest";
import { rgaa, glossary, getCriterion, listTheme, allThemes } from "../src/rgaa.js";

// The dataset is the spine of the whole tool: every criterion id, theme count
// and WCAG cross-ref the engine/report rely on must be exactly the official
// RGAA 4.1.2 shape. This is the M0 gate — it runs before any rule exists.
describe("RGAA dataset integrity", () => {
  it("has 13 themes and 106 criteria", () => {
    expect(rgaa.themes.length).toBe(13);
    expect(rgaa.criteria.length).toBe(106);
  });

  it("declares RGAA 4.1.2 on WCAG 2.1", () => {
    expect(rgaa.rgaaVersion).toBe("4.1.2");
    expect(rgaa.wcagVersion).toBe("2.1");
  });

  it("per-theme counts sum to 106 and match the criteria list", () => {
    const sum = rgaa.themes.reduce((s, t) => s + t.count, 0);
    expect(sum).toBe(106);
    for (const t of rgaa.themes) {
      expect(listTheme(t.number).length, `theme ${t.number}`).toBe(t.count);
    }
  });

  it("every id is well-formed, unique, and composes <theme>.<n>", () => {
    const ids = new Set<string>();
    for (const c of rgaa.criteria) {
      expect(c.id).toMatch(/^\d+\.\d+$/);
      expect(Number(c.id.split(".")[0]), `theme of ${c.id}`).toBe(c.theme);
      expect(ids.has(c.id), `duplicate id ${c.id}`).toBe(false);
      ids.add(c.id);
    }
  });

  it("every criterion has at least one reference (WCAG or technique)", () => {
    for (const c of rgaa.criteria) {
      expect(c.wcag.length + c.techniques.length, `refs of ${c.id}`).toBeGreaterThan(0);
      expect(c.wcag.length, `wcag of ${c.id}`).toBeGreaterThan(0);
    }
  });

  it("automatability is in the enum; static criteria carry at least one rule", () => {
    for (const c of rgaa.criteria) {
      expect(["static", "needs-rendering", "judgment"]).toContain(c.automatability);
      // static => engine fully covers it, so it must carry a rule. Non-static MAY
      // carry a rule (one that raises only definite NCs, e.g. 10.4 viewport zoom).
      if (c.automatability === "static") {
        expect(c.ruleIds.length, `ruleIds of ${c.id}`).toBeGreaterThan(0);
      }
    }
  });

  it("every glossary anchor referenced in a title resolves", () => {
    const re = /\(#([a-z0-9-]+)\)/g;
    for (const c of rgaa.criteria) {
      let m: RegExpExecArray | null;
      const t = c.title;
      re.lastIndex = 0;
      while ((m = re.exec(t))) {
        expect(glossary[m[1]!], `anchor #${m[1]} in ${c.id}`).toBeDefined();
      }
    }
  });

  it("lookups: getCriterion / allThemes", () => {
    expect(getCriterion("1.1")?.theme).toBe(1);
    expect(getCriterion("8.5")?.titlePlain).toContain("titre");
    expect(allThemes().find((t) => t.number === 8)?.count).toBe(10);
    expect(getCriterion("99.9")).toBeUndefined();
  });
});
