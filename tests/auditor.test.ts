import { describe, it, expect } from "vitest";
import type { AuditResult } from "../src/types.js";
import type { PrdUnit } from "../src/prd.js";
import { renderAuditorUnit, renderAuditorBacklog, renderAuditorPerCriterion } from "../src/auditor.js";
import { vocabularyFor } from "../src/standards/vocabulary.js";

function unit(criteriaId: string, title: string, refs: string[] = []): PrdUnit {
  return {
    criteriaId,
    title,
    label: `${criteriaId} — ${title}`,
    refs,
    severity: "bloquant",
    findings: [
      {
        ruleId: "img-alt-missing",
        criteriaId,
        file: "src/a.tsx",
        line: 3,
        col: 1,
        selectorHint: "img",
        severity: "bloquant",
        message: "image sans alternative",
        remediation: "Ajoutez alt",
        snippet: "<img>",
      },
    ],
  };
}

const AUDIT: AuditResult = {
  tool: "ultra11y",
  standard: "wcag",
  version: "9.9.9",
  schemaVersion: 2,
  date: "2026-06-29",
  scope: { inputs: ["src"], files: 1 },
  guidelines: [],
  criteria: [{ id: "1.1.1", guideline: "1.1", status: "NC", findings: [unit("x", "x").findings[0]!] }],
  findings: [unit("1.1.1", "x").findings[0]!],
  residualRisks: [],
  conformancePct: 50,
};

describe("vocabularyFor", () => {
  it("uses the WCAG core vocabulary for the core standard", () => {
    const v = vocabularyFor("wcag", "en");
    expect(v.criterion).toBe("Success criterion");
    expect(v.test).toBe("Technique");
    expect(v.nonConformant).toBe("Fail");
  });

  it("uses the RGAA pack vocabulary (fr) for --standard rgaa", () => {
    const v = vocabularyFor("rgaa", "fr");
    expect(v.theme).toBe("Thématique");
    expect(v.criterion).toBe("Critère");
    expect(v.nonConformant).toBe("Non conforme (NC)");
    expect(v.auditorHeading).toBe("Critère d’accessibilité");
  });

  it("falls back to the generic default when a standard/term is unknown", () => {
    const v = vocabularyFor("does-not-exist", "fr");
    expect(v.theme).toBe("Thématique"); // generic fr default
    expect(v.criterion).toBe("Critère");
  });
});

describe("renderAuditorUnit", () => {
  it("renders the WCAG core block with core vocabulary + SC level", () => {
    const md = renderAuditorUnit(unit("1.1.1", "Non-text Content"), "wcag", "en").join("\n");
    expect(md).toContain("**Success criterion** : 1.1.1 — Non-text Content");
    expect(md).toContain("**WCAG** : 1.1.1 (A)");
    expect(md).toContain("**Finding (Fail)**");
    expect(md).toContain("**Expected (Pass)** : Ajoutez alt");
    expect(md).toContain("`src/a.tsx:3`");
  });

  it("renders the RGAA pack block with theme, test numbers, and pack vocabulary (fr)", () => {
    const md = renderAuditorUnit(unit("11.6", "Légende", ["1.3.1", "3.3.2"]), "rgaa", "fr").join("\n");
    expect(md).toContain("**Thématique** : 11."); // theme name resolved
    expect(md).toContain("**Critère** : 11.6 — Légende");
    expect(md).toContain("**Test(s)** : 11.6.1"); // test numbers from pack tests
    expect(md).toContain("**WCAG** : 1.3.1 (A) · 3.3.2 (A)"); // per-ref level
    expect(md).toContain("**Constat (Non conforme (NC))**");
    expect(md).toContain("**Attendu (Conforme (C))** : Ajoutez alt");
  });

  it("renders the WCAG core block in French with localized principle/guideline titles (W3C authorized translation)", () => {
    const md = renderAuditorUnit(unit("1.4.3", "Contraste (minimum)"), "wcag", "fr").join("\n");
    expect(md).toContain("**Principe · Règle** : 1 Perceptible · 1.4 Distinguable"); // resolved by lang, not hardcoded English
    expect(md).toContain("**Critère de succès** : 1.4.3 — Contraste (minimum)");
    expect(md).toContain("**WCAG** : 1.4.3 (AA)");
  });

  it("emits a criterion heading only when asked (issue body omits it)", () => {
    expect(renderAuditorUnit(unit("1.1.1", "X"), "wcag", "en", { heading: "###" })[0]).toMatch(/^### /);
    expect(renderAuditorUnit(unit("1.1.1", "X"), "wcag", "en")[0]).toMatch(/^> /); // starts with the normative note
  });

  // The `_rendered capture of …_` origin-attribution line (moved from report.ts's deleted
  // ncEntry into this shared block) was untested end to end. Mirrors the origin shape
  // produced by real capture ingestion (see tests/capture.test.ts).
  it("renders the origin-attribution line for a capture-originated finding (component + source file)", () => {
    const u = unit("1.1.1", "Non-text Content");
    u.findings[0]!.origin = { capture: "captures/button-icon.html", sourceFile: "src/Button.tsx", component: "Button" };
    const md = renderAuditorUnit(u, "wcag", "en").join("\n");
    expect(md).toContain("- _rendered capture of `Button` — source `src/Button.tsx`_");
  });

  it("anchors the origin line at the source component's definition line once graph-resolved (origin.sourceLine)", () => {
    const u = unit("1.1.1", "Non-text Content");
    u.findings[0]!.origin = { capture: "captures/button-icon.html", sourceFile: "src/Button.tsx", component: "Button", sourceLine: 12 };
    const md = renderAuditorUnit(u, "wcag", "en").join("\n");
    expect(md).toContain("- _rendered capture of `Button` — source `src/Button.tsx:12`_");
  });

  it("falls back to the finding's own file / capture path when component or sourceFile is unknown", () => {
    const u = unit("1.1.1", "Non-text Content");
    u.findings[0]!.origin = { capture: "captures/storybook-dump.html" };
    const md = renderAuditorUnit(u, "wcag", "en").join("\n");
    expect(md).toContain("- _rendered capture of `src/a.tsx` — source `captures/storybook-dump.html`_");
  });

  it("renders the localized (fr) origin-attribution line", () => {
    const u = unit("1.1.1", "Non-text Content");
    u.findings[0]!.origin = { capture: "captures/button-icon.html", sourceFile: "src/Button.tsx", component: "Button" };
    const md = renderAuditorUnit(u, "wcag", "fr").join("\n");
    expect(md).toContain("- _capture rendue de `Button` — source `src/Button.tsx`_");
  });

  // An advisory unit renders the « Recommandation (non normative) » vocabulary and
  // MUST NOT emit the "**<criterion>** : <id>" colon grammar the verify worklist parser
  // keys on — so it can never enter the non-conformity worklist.
  it("renders an advisory unit with recommendation vocabulary, not the NC criterion-line grammar (fr)", () => {
    const u = { ...unit("1.3.1", "Structuration de l'information"), advisory: true };
    const md = renderAuditorUnit(u, "wcag", "fr").join("\n");
    expect(md).toContain("Recommandation (non normative)");
    expect(md).not.toContain("**Critère de succès** : 1.3.1"); // no NC criterion line
    expect(md).not.toContain("**Constat (Non conforme"); // no NC finding wording
    // The verify worklist parser's criterion-line shape must be absent.
    expect(md).not.toMatch(/^\*\*[^*:]+\*\*\s*:\s*1\.3\.1(?:\s*—.*)?\s*$/m);
  });

  it("renders an advisory unit in English with the non-normative recommendation vocabulary", () => {
    const u = { ...unit("1.3.1", "Info and Relationships"), advisory: true };
    const md = renderAuditorUnit(u, "wcag", "en").join("\n");
    expect(md).toContain("Recommendation (non-normative)");
    expect(md).not.toContain("**Success criterion** : 1.3.1");
  });
});

describe("renderAuditorBacklog / renderAuditorPerCriterion", () => {
  it("titles the backlog with the standard's auditor heading and sections by severity", () => {
    const md = renderAuditorBacklog(AUDIT, "en", "wcag");
    expect(md).toContain("# Accessibility criterion — WCAG 2.2 AA");
    expect(md).toContain("## 🔴 Blocking (1)");
  });

  it("titles the RGAA backlog in French", () => {
    const md = renderAuditorBacklog(AUDIT, "fr", "rgaa");
    expect(md).toContain("# Critère d’accessibilité — RGAA 4.1.2");
  });

  it("writes one auditor doc per criterion", () => {
    const files = renderAuditorPerCriterion(AUDIT, "en", "wcag");
    expect(files.map((f) => f.name)).toEqual(["prd-1.1.1-2026-06-29.md"]);
    expect(files[0]!.content).toContain("Accessibility criterion");
  });
});
