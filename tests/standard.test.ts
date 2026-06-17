import { describe, it, expect } from "vitest";
import { parseWcag, compareSC, wcagIndex, scResults, renderWcagReport, wcagLookupText, parseStandard } from "../src/standard.js";
import { runAudit } from "../src/audit.js";
import { allCriteria } from "../src/rgaa.js";

const FIX = new URL("./fixtures/", import.meta.url).pathname;

describe("WCAG success-criterion parsing", () => {
  it("splits sc / title / level, keeping inner parentheses", () => {
    expect(parseWcag("1.1.1 Non-text Content (A)")).toEqual({ sc: "1.1.1", title: "Non-text Content", level: "A" });
    expect(parseWcag("1.4.3 Contrast (Minimum) (AA)")).toEqual({ sc: "1.4.3", title: "Contrast (Minimum)", level: "AA" });
  });

  it("orders SC ids as version tuples (1.4.10 after 1.4.3)", () => {
    expect(compareSC("1.4.10", "1.4.3")).toBeGreaterThan(0);
    expect(compareSC("1.1.1", "1.1.1")).toBe(0);
    expect(compareSC("2.1.1", "1.4.13")).toBeGreaterThan(0);
  });

  it("parseStandard defaults to rgaa, opts into wcag", () => {
    expect(parseStandard(undefined)).toBe("rgaa");
    expect(parseStandard("rgaa")).toBe("rgaa");
    expect(parseStandard("wcag")).toBe("wcag");
    expect(parseStandard(true)).toBe("rgaa");
  });
});

describe("WCAG index covers the whole dataset", () => {
  const idx = wcagIndex();

  it("every SC parses and carries at least one RGAA criterion", () => {
    expect(idx.length).toBeGreaterThan(40);
    for (const e of idx) {
      expect(e.sc).toMatch(/^\d+(\.\d+)+$/);
      expect(e.rgaaIds.length).toBeGreaterThan(0);
    }
  });

  it("drops no RGAA criterion that carries a WCAG ref", () => {
    const mapped = new Set(idx.flatMap((e) => e.rgaaIds));
    for (const c of allCriteria()) {
      if (c.wcag.length) expect(mapped.has(c.id), `${c.id} missing from WCAG index`).toBe(true);
    }
  });

  it("is in stable numeric order", () => {
    for (let i = 1; i < idx.length; i++) expect(compareSC(idx[i - 1]!.sc, idx[i]!.sc)).toBeLessThan(0);
  });
});

describe("WCAG report view", () => {
  const r = runAudit({ inputs: [`${FIX}non-conforming/bad.html`] });

  it("aggregates a failing RGAA criterion into its SC", () => {
    const sc = scResults(r).find((s) => s.sc === "1.1.1");
    expect(sc?.status).toBe("NC"); // RGAA 1.1 (img alt) is NC on the bad page
  });

  it("renders a WCAG-keyed report with the international-equivalence note", () => {
    const md = renderWcagReport(r, "fr");
    expect(md).toContain("WCAG 2.1");
    expect(md).toContain("EN 301 549");
    expect(md).toContain("Section 508");
    expect(md).toContain("| SC |");
  });

  it("looks up a single success criterion", () => {
    expect(wcagLookupText("1.1.1", "fr")).toContain("1.1.1");
    expect(wcagLookupText("99.99.99", "fr")).toBeNull();
  });
});
