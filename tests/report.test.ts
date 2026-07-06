import { describe, it, expect } from "vitest";
import { readFileSync, existsSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { runAudit } from "../src/audit.js";
import { renderReport, renderPackReport, writeReport } from "../src/report.js";
import { prdUnits } from "../src/prd.js";
import { loadPack } from "../src/standards/index.js";

const FIX = new URL("./fixtures/", import.meta.url).pathname;
const bad = runAudit({ inputs: [`${FIX}non-conforming/bad.html`] });
const good = runAudit({ inputs: [`${FIX}conforming/good.html`] });

describe("renderReport (WCAG 2.2 AA markdown)", () => {
  const md = renderReport(bad, "fr");

  it("has the 5 sections + metadata header", () => {
    expect(md).toContain("# Rapport d'audit d'accessibilité — WCAG 2.2 niveau AA");
    expect(md).toContain("## 1. Synthèse par règle WCAG");
    expect(md).toContain("## 2. Non-conformités (par priorité)");
    expect(md).toContain("## 3. Critères conformes (C)");
    expect(md).toContain("## 4. Critères non applicables (NA)");
    expect(md).toContain("## 5. Critères à évaluer manuellement (rendu / jugement)");
    expect(md).toMatch(/Taux de réussite automatique[^*]*\*\* : \d+%/);
  });

  it("synthesis table has WCAG guideline rows (localized fr titles) plus a Total row", () => {
    expect(md).toContain("| 1.1 Équivalents textuels |"); // fr guideline title, resolved by key — not the baked-in English g.title
    expect(md).toContain("| 4.1 Compatible |");
    expect(md).toContain("| **Total** |");
  });

  it("groups non-conformities by priority with success-criterion titles", () => {
    expect(md).toMatch(/### 🔴 Bloquant/);
    expect(md).toContain("3.1.1 —"); // Language of Page (html-lang NC)
  });

  // Task 5 (Phase 4): every NC criterion in §2 is now rendered with the SAME auditor
  // conformance block `prd`/GitHub issues use (src/auditor.ts `renderAuditorUnit`),
  // reused via `prdUnits` — not a report-local re-implementation.
  it("renders each NC criterion with the auditor conformance block (heading, criterion line, finding/expected/verification, checklist)", () => {
    expect(md).toContain("#### 🔴 3.1.1 — Langue de la page"); // per-criterion heading (h4, under the h3 severity group)
    expect(md).toContain("**Critère de succès** : 3.1.1 — Langue de la page"); // WCAG core vocabulary
    expect(md).toMatch(/\*\*Constat \(Non conforme\)\*\* : \d+ occurrence\(s\)/);
    expect(md).toContain("**Attendu (Conforme)** :");
    expect(md).toContain("**Vérification** :");
    expect(md).toMatch(/- \[ \] `.*bad\.html:\d+` \(`html`\) — .*lang/); // the actual finding checklist item
  });

  it("the NC section is EXACTLY the prd/auditor backlog units for this audit — no report-local re-grouping", () => {
    const units = prdUnits(bad, "wcag", "fr");
    for (const u of units) expect(md).toContain(`**Critère de succès** : ${u.criteriaId} — ${u.title}`);
  });

  it("lists manual criteria under the residual-risk section with a warning", () => {
    expect(md).toContain("Ne marquez aucun de ces critères");
    expect(md).toContain("1.4.3 —"); // contrast, needs-rendering
  });

  it("a conforming page reports no non-conformity", () => {
    const ok = renderReport(good, "fr");
    expect(ok).toContain("Aucune non-conformité détectée par le moteur statique.");
  });

  it("renders in English when asked", () => {
    expect(renderReport(bad, "en")).toContain("## 2. Non-conformities (by priority)");
    expect(renderReport(bad, "en")).toContain("WCAG 2.2 Level AA");
  });

  // The auditor block's `_rendered capture of …_` origin-attribution line (moved from
  // report.ts's deleted ncEntry into src/auditor.ts's shared renderAuditorUnit) was
  // untested end to end through the actual report renderer. Uses the same
  // provenance-tagged fixture as tests/capture.test.ts.
  it("renders the origin-attribution line for a capture-originated finding", () => {
    const capResult = runAudit({ inputs: [`${FIX}captures/button-icon.html`] });
    const md = renderReport(capResult, "en");
    expect(md).toContain("- _rendered capture of `Button` — source `src/Button.tsx`_");
  });
});

describe("renderPackReport (derived RGAA view)", () => {
  const md = renderPackReport(bad, loadPack("rgaa"), "fr");
  it("re-keys the same audit onto RGAA criteria/themes", () => {
    expect(md).toContain("RGAA 4.1.2");
    expect(md).toContain("## 1. Synthèse par thématique");
    expect(md).toMatch(/RGAA \d+\.\d+ —/); // pack-keyed criterion labels
  });

  it("surfaces RGAA 8.1 (doctype → removed 4.1.1) in the manual section with a dedicated out-of-scope justification, never mixed with NA", () => {
    const naSection = md.slice(md.indexOf("## 4."), md.indexOf("## 5."));
    expect(naSection).not.toContain("RGAA 8.1");
    const manualSection = md.slice(md.indexOf("## 5."));
    expect(manualSection).toContain("RGAA 8.1");
    expect(manualSection).toMatch(/RGAA 8\.1 —.*— _Hors périmètre moteur/);
  });

  it("renders the out-of-scope justification in English too", () => {
    const en = renderPackReport(bad, loadPack("rgaa"), "en");
    const manualSection = en.slice(en.indexOf("## 5."));
    expect(manualSection).toMatch(/RGAA 8\.1 —.*— _Out of engine scope/);
  });

  // Task 5 (Phase 4): the pack view's NC section renders the SAME auditor block too
  // (pack vocabulary: "Critère"/"Thématique"), and a pack criterion never leaks into
  // §2 unless it actually carries findings — outOfScope criteria stay §5-only.
  it("renders each NC criterion with the auditor conformance block using RGAA's own vocabulary", () => {
    const ncSection = md.slice(md.indexOf("## 2."), md.indexOf("## 3."));
    expect(ncSection).toMatch(/#### 🔴 RGAA 8\.3 —/);
    expect(ncSection).toContain("**Thématique** : 8.");
    expect(ncSection).toMatch(/\*\*Critère\*\* : 8\.3 —/);
    expect(ncSection).not.toContain("RGAA 8.1"); // out-of-scope — §5 only, never a fake NC block
  });
});

describe("writeReport", () => {
  it("writes audits/wcag-<date>.md (the canonical core report) and returns its path", () => {
    const out = join(tmpdir(), `ultra11y-report-${bad.date}`);
    const path = writeReport(bad, { out, lang: "fr", standard: "wcag" });
    expect(path).toBe(join(out, `wcag-${bad.date}.md`));
    expect(existsSync(path)).toBe(true);
    expect(readFileSync(path, "utf8")).toContain("WCAG 2.2");
  });

  it("a pack writes a separate <pack>-<date>.md derived report", () => {
    const out = join(tmpdir(), `ultra11y-report-std-${bad.date}`);
    const wcagPath = writeReport(bad, { out, lang: "fr", standard: "wcag" });
    const rgaaPath = writeReport(bad, { out, lang: "fr", standard: "rgaa" });
    expect(wcagPath).toBe(join(out, `wcag-${bad.date}.md`));
    expect(rgaaPath).toBe(join(out, `rgaa-${bad.date}.md`));
    // the core report is unchanged by the pack option
    expect(readFileSync(wcagPath, "utf8")).toBe(renderReport(bad, "fr"));
    expect(readFileSync(rgaaPath, "utf8")).toContain("RGAA 4.1.2");
  });
});
