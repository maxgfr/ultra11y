import { describe, it, expect } from "vitest";
import manualQuestions from "../src/data/manual-questions.json";
import { hasSC } from "../src/wcag.js";

// The curated judgment-question bank (src/data/manual-questions.json) is rendered per
// residual criterion by `formatAdjudication`. It is SC-keyed onto the WCAG core — mirror
// the data-integrity.test.ts style: every key must be a real SC, every question must carry
// both languages, non-empty. This is the honest-judgment-tier guard: the bank never keys a
// question to a fabricated criterion, and never ships a half-translated prompt.
const bank = manualQuestions as Record<string, { fr: string; en: string }[]>;

describe("manual-questions.json integrity", () => {
  it("is non-empty and keys only real WCAG success criteria", () => {
    const keys = Object.keys(bank);
    expect(keys.length).toBeGreaterThan(0);
    for (const sc of keys) {
      expect(sc, `key shape ${sc}`).toMatch(/^\d+\.\d+\.\d+$/);
      expect(hasSC(sc), `${sc} must be a real WCAG 2.2 AA success criterion`).toBe(true);
    }
  });

  it("every criterion carries at least one question", () => {
    for (const [sc, questions] of Object.entries(bank)) {
      expect(Array.isArray(questions), `${sc} value is an array`).toBe(true);
      expect(questions.length, `${sc} has ≥1 question`).toBeGreaterThan(0);
    }
  });

  it("every question has non-empty fr AND en prose", () => {
    for (const [sc, questions] of Object.entries(bank)) {
      questions.forEach((q, i) => {
        expect(typeof q.fr, `${sc}[${i}].fr`).toBe("string");
        expect(typeof q.en, `${sc}[${i}].en`).toBe("string");
        expect(q.fr.trim().length, `${sc}[${i}].fr non-empty`).toBeGreaterThan(0);
        expect(q.en.trim().length, `${sc}[${i}].en non-empty`).toBeGreaterThan(0);
      });
    }
  });

  it("covers the judgment criteria the Ara audit surfaced (8.9/9.3 under 1.3.1, SPA 12.8 under 2.4.3, 6.1 under 2.4.4, 5.5 concision under 2.4.6, 7.5 under 4.1.3)", () => {
    for (const sc of ["1.3.1", "2.4.3", "2.4.4", "2.4.6", "4.1.3"]) {
      expect(bank[sc], `question bank covers ${sc}`).toBeDefined();
    }
    // The 5.5 caption-CONCISION question specifically (the auditor's case: a clear but
    // verbose caption should become a short intro, details via aria-labelledby) lives
    // under 2.4.6 — the headings-and-labels judgment SC whose harvester surfaces captions.
    const concision = (bank["2.4.6"] ?? []).find((q) => /concision/i.test(q.fr) && /concision/i.test(q.en));
    expect(concision, "2.4.6 carries the RGAA 5.5 caption-concision question").toBeDefined();
    expect(concision!.fr).toContain("5.5");
    expect(concision!.en).toContain("aria-labelledby");
  });

  it("keys questions only onto residual (non-static) SCs, so every one actually renders in an adjudication worklist", () => {
    // 2.4.2/1.4.2/3.1.1 are STATIC (auto-decided, never residual) — a question keyed there
    // would never surface. The bank must avoid them.
    for (const sc of ["2.4.2", "1.4.2", "3.1.1"]) {
      expect(bank[sc], `${sc} is static — must not carry manual questions`).toBeUndefined();
    }
  });
});
