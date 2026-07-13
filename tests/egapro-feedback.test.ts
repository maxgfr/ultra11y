// Regression corpus encoding a professional human auditor's review of ultra11y's own
// RGAA audit of egapro (compared against the official Ara audit). False positives must
// raise ZERO normative non-conformities; missed patterns MUST fire. Cases are phase-gated
// so the suite stays green at every commit: only IMPLEMENTED_PHASES run today, later
// phases (P1 normativity layer, P3 new rules) turn the gated cases on as they land.
import { describe, it, expect } from "vitest";
import { runAudit } from "../src/audit.js";
import { derivePackResults } from "../src/standards/index.js";
import { toDynamicResult, mergeDynamic, type RunnerOutput } from "../src/scan.js";
import type { Finding } from "../src/types.js";

const FIX_ROOT = new URL("./fixtures/", import.meta.url).pathname;
const FIX = `${FIX_ROOT}egapro-feedback/`;

// Phases whose cases must pass TODAY. Each later phase adds its tag here as it lands —
// the gated cases then run for real, with no rewrite needed.
const IMPLEMENTED_PHASES = new Set<string>(["P0"]);

// `Finding.advisory` does not exist yet (Phase 1 adds it) — the cast keeps this
// typechecking both before and after that field lands.
const normative = (fs: Finding[]) => fs.filter((f) => !(f as { advisory?: boolean }).advisory);

describe("egapro-feedback — false positives (must raise zero normative NC)", () => {
  describe("download-links.html — a 'Télécharger' link not naming its file format is not an NC", () => {
    const audit = runAudit({ inputs: [`${FIX}fp/download-links.html`] });
    it.skipIf(!IMPLEMENTED_PHASES.has("P0"))("emits no finding at all", () => {
      expect(audit.findings, `unexpected findings: ${audit.findings.map((f) => `${f.ruleId}@${f.line}`).join(", ")}`).toEqual([]);
    });
  });

  describe("tooltip-placeholder.html — lorem-ipsum tooltip content is a content-quality (UX) concern, not accessibility", () => {
    const audit = runAudit({ inputs: [`${FIX}fp/tooltip-placeholder.html`] });
    it.skipIf(!IMPLEMENTED_PHASES.has("P0"))("emits no finding at all", () => {
      expect(audit.findings, `unexpected findings: ${audit.findings.map((f) => `${f.ruleId}@${f.line}`).join(", ")}`).toEqual([]);
    });
  });

  describe("two-h1.html — 'one h1 per page' is not a rule in HTML, a11y, or SEO (h1-multiple becomes advisory)", () => {
    const audit = runAudit({ inputs: [`${FIX}fp/two-h1.html`] });
    it.skipIf(!IMPLEMENTED_PHASES.has("P1"))("raises no normative NC despite two <h1> elements", () => {
      expect(normative(audit.findings)).toEqual([]);
      expect(audit.criteria.filter((c) => c.status === "NC").map((c) => c.id)).toEqual([]);
    });
  });

  describe("starts-at-h2.html — a page starting at h2 (no h1) with no order skip is not an NC (h1-missing becomes advisory)", () => {
    const audit = runAudit({ inputs: [`${FIX}fp/starts-at-h2.html`] });
    it.skipIf(!IMPLEMENTED_PHASES.has("P1"))("raises no normative NC", () => {
      expect(normative(audit.findings)).toEqual([]);
      expect(audit.criteria.filter((c) => c.status === "NC").map((c) => c.id)).toEqual([]);
    });
  });
});

describe("axe best-practice channel", () => {
  it.skipIf(!IMPLEMENTED_PHASES.has("P1"))(
    "a best-practice-only axe violation (no wcag* tag) merges as advisory, not a criterion NC — an empty <th> is not an NC under any criterion",
    () => {
      const out: RunnerOutput = {
        url: "https://exemple.fr",
        violations: [
          {
            id: "empty-table-header",
            impact: "minor",
            help: "Table header text should not be empty",
            tags: ["cat.name-role-value", "best-practice"],
            nodes: [{ target: ["th"], html: "<th></th>" }],
          },
        ],
        reflow: { horizontalScroll: false },
      };
      const dyn = toDynamicResult(out, "https://exemple.fr");
      const audit = runAudit({ inputs: [`${FIX_ROOT}conforming/good.html`] });
      const merged = mergeDynamic(audit, dyn);
      const finding = merged.findings.find((f) => f.ruleId === "axe:empty-table-header");
      expect((finding as (Finding & { advisory?: boolean }) | undefined)?.advisory).toBe(true);
      expect(normative(merged.findings).some((f) => f.ruleId === "axe:empty-table-header")).toBe(false);
      expect(merged.criteria.find((c) => c.id === "1.3.1")?.status).not.toBe("NC");
    },
  );
});

describe("egapro-feedback — missed patterns (must fire)", () => {
  it.skipIf(!IMPLEMENTED_PHASES.has("P3"))("nav-landmark-missing fires when no <nav>/role=navigation exists anywhere", () => {
    const audit = runAudit({ inputs: [`${FIX}missed/no-nav-landmark.html`] });
    expect(audit.findings.some((f) => f.ruleId === "nav-landmark-missing")).toBe(true);
  });

  it.skipIf(!IMPLEMENTED_PHASES.has("P3"))("nav-landmark-unnamed fires on the unnamed <nav> only", () => {
    const audit = runAudit({ inputs: [`${FIX}missed/nav-unnamed.html`] });
    expect(audit.findings.some((f) => f.ruleId === "nav-landmark-unnamed")).toBe(true);
  });

  it.skipIf(!IMPLEMENTED_PHASES.has("P3"))("disabled-context-content fires on a disabled fieldset read-only recap", () => {
    const audit = runAudit({ inputs: [`${FIX}missed/fieldset-disabled.html`] });
    expect(audit.findings.some((f) => f.ruleId === "disabled-context-content")).toBe(true);
  });

  it.skipIf(!IMPLEMENTED_PHASES.has("P3"))("date-fields-ungrouped fires on two adjacent ungrouped date inputs", () => {
    const audit = runAudit({ inputs: [`${FIX}missed/date-fields-ungrouped.html`] });
    expect(audit.findings.some((f) => f.ruleId === "date-fields-ungrouped")).toBe(true);
  });

  it.skipIf(!IMPLEMENTED_PHASES.has("P3"))("radio-checkbox-group-ungrouped fires on radios with no fieldset/role=radiogroup", () => {
    const audit = runAudit({ inputs: [`${FIX}missed/radios-ungrouped.html`] });
    expect(audit.findings.some((f) => f.ruleId === "radio-checkbox-group-ungrouped")).toBe(true);
  });

  it.skipIf(!IMPLEMENTED_PHASES.has("P3"))("table-empty-data-cell fires as advisory, without forcing its criterion to NC", () => {
    const audit = runAudit({ inputs: [`${FIX}missed/empty-data-cells.html`] });
    const finding = audit.findings.find((f) => f.ruleId === "table-empty-data-cell");
    expect((finding as (Finding & { advisory?: boolean }) | undefined)?.advisory).toBe(true);
    expect(audit.criteria.find((c) => c.id === "1.3.1")?.status).not.toBe("NC");
  });

  it.skipIf(!IMPLEMENTED_PHASES.has("P0"))("table-caption-missing still fires on an unnamed data table", () => {
    const audit = runAudit({ inputs: [`${FIX}missed/table-no-caption.html`] });
    expect(audit.findings.some((f) => f.ruleId === "table-caption-missing")).toBe(true);
  });

  it.skipIf(!IMPLEMENTED_PHASES.has("P0"))(
    "a div/div label-value modal (the 'Mon profil' pattern, RGAA 8.9) is never silently Conforming — it stays a manual residual",
    () => {
      const audit = runAudit({ inputs: [`${FIX}missed/modal-div-fields.html`] });
      const c131 = audit.criteria.find((c) => c.id === "1.3.1");
      expect(c131?.status).toBe("manual");
      expect(c131?.status).not.toBe("C");
      expect(audit.residualRisks.some((r) => r.criteriaId === "1.3.1")).toBe(true);
    },
  );
});

describe("rgaa derivation", () => {
  it.skipIf(!IMPLEMENTED_PHASES.has("P3"))("no-nav-landmark.html derives RGAA 9.2 and 12.6 as NC", () => {
    const audit = runAudit({ inputs: [`${FIX}missed/no-nav-landmark.html`] });
    const rows = derivePackResults(audit, "rgaa");
    expect(rows.find((r) => r.id === "9.2")?.status).toBe("NC");
    expect(rows.find((r) => r.id === "12.6")?.status).toBe("NC");
  });

  it.skipIf(!IMPLEMENTED_PHASES.has("P3"))("fieldset-disabled.html derives RGAA 7.1 and 10.8 as NC", () => {
    const audit = runAudit({ inputs: [`${FIX}missed/fieldset-disabled.html`] });
    const rows = derivePackResults(audit, "rgaa");
    expect(rows.find((r) => r.id === "7.1")?.status).toBe("NC");
    expect(rows.find((r) => r.id === "10.8")?.status).toBe("NC");
  });
});
