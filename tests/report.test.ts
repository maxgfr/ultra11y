import { describe, it, expect } from "vitest";
import { readFileSync, existsSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { runAudit } from "../src/audit.js";
import { renderReport, writeReport } from "../src/report.js";

const FIX = new URL("./fixtures/", import.meta.url).pathname;
const bad = runAudit({ inputs: [`${FIX}non-conforming/bad.html`] });
const good = runAudit({ inputs: [`${FIX}conforming/good.html`] });

describe("renderReport (etalab-style markdown)", () => {
  const md = renderReport(bad, "fr");

  it("has the 5 sections + metadata header", () => {
    expect(md).toContain("# Rapport d'audit d'accessibilité — RGAA 4.1.2");
    expect(md).toContain("## 1. Synthèse par thématique");
    expect(md).toContain("## 2. Non-conformités (par priorité)");
    expect(md).toContain("## 3. Critères conformes (C)");
    expect(md).toContain("## 4. Critères non applicables (NA)");
    expect(md).toContain("## 5. Critères à évaluer manuellement (rendu / jugement)");
    expect(md).toMatch(/Taux de conformité automatique\*\* : \d+%/);
  });

  it("synthesis table has 13 theme rows plus a Total row", () => {
    expect(md).toContain("| 1. Images |");
    expect(md).toContain("| 13. Consultation |");
    expect(md).toContain("| **Total** |");
  });

  it("groups non-conformities by priority with criterion titles", () => {
    expect(md).toMatch(/### 🔴 Bloquant/);
    expect(md).toContain("8.3 —");
    expect(md).toContain("_Correction :_");
    // blocking section appears before the minor section
    expect(md.indexOf("🔴 Bloquant")).toBeLessThan(md.indexOf("🟡 Mineur"));
  });

  it("lists manual criteria under the residual-risk section with a warning", () => {
    expect(md).toContain("Ne marquez aucun de ces critères");
    expect(md).toContain("3.2 —"); // contrast, needs-rendering
  });

  it("a conforming page reports no non-conformity", () => {
    const ok = renderReport(good, "fr");
    expect(ok).toContain("Aucune non-conformité détectée par le moteur statique.");
  });

  it("renders in English when asked", () => {
    expect(renderReport(bad, "en")).toContain("## 2. Non-conformities (by priority)");
  });
});

describe("writeReport", () => {
  it("writes audits/rgaa-<date>.md and returns its path", () => {
    const out = join(tmpdir(), `ultra11y-report-${bad.date}`);
    const path = writeReport(bad, { out, lang: "fr" });
    expect(path).toBe(join(out, `rgaa-${bad.date}.md`));
    expect(existsSync(path)).toBe(true);
    expect(readFileSync(path, "utf8")).toContain("RGAA 4.1.2");
  });
});
