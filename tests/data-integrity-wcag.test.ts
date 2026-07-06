import { describe, it, expect } from "vitest";
import { wcag, getSC, hasSC, allSC, allPrinciples, allGuidelines, compareSC, scTitle, guidelineTitle, principleTitle } from "../src/wcag.js";

// The WCAG 2.2 dataset is the spine of the whole tool: it is the engine's canonical
// key, derived from the official W3C source (https://github.com/w3c/wcag). Assert
// MEMBERSHIP invariants (not a brittle count) so a future W3C errata that adds/renames
// a technique doesn't break the gate, while the load-bearing 2.2 facts stay locked.
describe("WCAG 2.2 dataset integrity", () => {
  it("declares WCAG 2.2 Level AA from the W3C source", () => {
    expect(wcag.wcagVersion).toBe("2.2");
    expect(wcag.level).toBe("AA");
    expect(wcag.criteriaSource).toContain("w3c/wcag");
    expect(wcag.principles.length).toBe(4);
    expect(wcag.guidelines.length).toBe(13);
  });

  it("contains only Level A and AA criteria (no AAA)", () => {
    for (const c of allSC()) expect(["A", "AA"], `level of ${c.sc}`).toContain(c.level);
  });

  it("drops the obsolete 4.1.1 Parsing (removed in WCAG 2.2)", () => {
    expect(hasSC("4.1.1")).toBe(false);
    expect(hasSC("4.1.2")).toBe(true); // Name, Role, Value stays put
  });

  it("includes the new-in-2.2 A/AA success criteria", () => {
    for (const sc of ["2.4.11", "2.5.7", "2.5.8", "3.2.6", "3.3.7", "3.3.8"]) {
      expect(hasSC(sc), `new-in-2.2 ${sc}`).toBe(true);
      expect(getSC(sc)?.addedIn, `addedIn of ${sc}`).toBe("2.2");
    }
  });

  it("excludes the AAA criteria new in 2.2 and the AAA Target Size", () => {
    for (const sc of ["2.4.12", "2.4.13", "3.3.9", "2.5.5"]) expect(hasSC(sc), sc).toBe(false);
  });

  it("every id is a well-formed, unique 3-segment SC composing <principle>.<guideline>", () => {
    const ids = new Set<string>();
    for (const c of allSC()) {
      expect(c.sc, c.sc).toMatch(/^\d+\.\d+\.\d+$/);
      const [p, g] = c.sc.split(".");
      expect(Number(p), `principle of ${c.sc}`).toBe(c.principle);
      expect(`${p}.${g}`, `guideline of ${c.sc}`).toBe(c.guideline);
      expect(ids.has(c.sc), `duplicate ${c.sc}`).toBe(false);
      ids.add(c.sc);
    }
  });

  it("automatability is in the enum; static SCs carry at least one rule; every SC has a W3C Understanding URL", () => {
    for (const c of allSC()) {
      expect(["static", "needs-rendering", "judgment"]).toContain(c.automatability);
      if (c.automatability === "static") expect(c.ruleIds.length, `ruleIds of ${c.sc}`).toBeGreaterThan(0);
      expect(c.understanding, `understanding of ${c.sc}`).toMatch(/^https:\/\/www\.w3\.org\/WAI\/WCAG22\/Understanding\//);
    }
  });

  it("the conservative static set is exactly {1.4.2, 2.4.2, 3.1.1}", () => {
    const staticSet = allSC()
      .filter((c) => c.automatability === "static")
      .map((c) => c.sc)
      .sort();
    expect(staticSet).toEqual(["1.4.2", "2.4.2", "3.1.1"]);
  });

  it("lookups + SC ordering", () => {
    expect(getSC("1.4.3")?.title).toBe("Contrast (Minimum)");
    expect(getSC("9.9.9")).toBeUndefined();
    expect(allPrinciples().map((p) => p.title)).toEqual(["Perceivable", "Operable", "Understandable", "Robust"]);
    expect(allGuidelines().some((g) => g.number === "1.4")).toBe(true);
    expect(compareSC("1.4.10", "1.4.3")).toBeGreaterThan(0); // 10 sorts after 3
  });
});

// French titles: the W3C AUTHORIZED translation (https://www.w3.org/Translations/WCAG22-fr/),
// vendored at scripts/vendor/wcag-2.2-fr.json and merged into wcag.json as `titleFr` by
// scripts/build-standards.mjs. Assert COMPLETENESS (every core SC/guideline/principle
// carries a non-empty titleFr — the build fails otherwise) rather than re-asserting the
// whole vendored text, which would just duplicate the dataset in the test.
describe("WCAG 2.2 French titles (W3C authorized translation)", () => {
  it("every success criterion carries a non-empty titleFr", () => {
    for (const c of allSC()) {
      expect(c.titleFr, `titleFr of ${c.sc}`).toBeTruthy();
      expect(c.titleFr?.trim().length, `titleFr of ${c.sc} is non-empty`).toBeGreaterThan(0);
    }
  });

  it("every guideline carries a non-empty titleFr", () => {
    for (const g of allGuidelines()) {
      expect(g.titleFr, `titleFr of guideline ${g.number}`).toBeTruthy();
    }
  });

  it("every principle carries a non-empty titleFr", () => {
    for (const p of allPrinciples()) {
      expect(p.titleFr, `titleFr of principle ${p.number}`).toBeTruthy();
    }
  });

  it("scTitle/guidelineTitle/principleTitle default to English (back-compat) and resolve fr on request", () => {
    expect(scTitle("1.4.3")).toBe("Contrast (Minimum)"); // no lang arg → unchanged English default
    expect(scTitle("1.4.3", "en")).toBe("Contrast (Minimum)");
    expect(scTitle("1.4.3", "fr")).toBe("Contraste (minimum)"); // W3C authorized fr translation, verbatim
    expect(guidelineTitle("1.1")).toBe("Text Alternatives");
    expect(guidelineTitle("1.1", "fr")).toBe("Équivalents textuels");
    expect(principleTitle(1)).toBe("Perceivable");
    expect(principleTitle(1, "fr")).toBe("Perceptible");
    expect(scTitle("9.9.9", "fr")).toBeUndefined(); // unknown id, both langs
  });
});
