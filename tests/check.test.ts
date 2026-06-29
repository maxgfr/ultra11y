import { describe, it, expect } from "vitest";
import { runAudit } from "../src/audit.js";
import { renderReport } from "../src/report.js";
import { checkReport } from "../src/check.js";

const FIX = new URL("./fixtures/", import.meta.url).pathname;
const validReport = renderReport(runAudit({ inputs: [`${FIX}non-conforming/bad.html`] }), "fr");

const BROKEN = `# Rapport d'audit
- **Taux de réussite automatique** : 50%

## 1. Synthèse par règle WCAG
| Règle | C |
|---|---|

## 2. Non-conformités (par priorité)
- **9.9.9 — Invented criterion** — \`x.html:1\` (\`div\`)
  - une non-conformité hallucinée

## 4. Critères non applicables (NA)
- 1.4.5 — Images of Text

## 5. Critères à évaluer manuellement
- 1.4.3 — Contrast — _à vérifier_
`;

describe("checkReport", () => {
  it("passes a well-formed WCAG report", () => {
    const r = checkReport(validReport);
    expect(r.ok).toBe(true);
    expect(r.issues).toHaveLength(0);
  });

  it("flags a missing section, an invented SC, and an unjustified NA", () => {
    const r = checkReport(BROKEN);
    expect(r.ok).toBe(false);
    expect(r.issues.some((i) => i.includes("Section 3"))).toBe(true);
    expect(r.issues.some((i) => i.includes("9.9.9"))).toBe(true);
    expect(r.issues.some((i) => i.includes("1.4.5"))).toBe(true);
  });

  it("flags a pass rate outside 0–100", () => {
    const tampered = validReport.replace(/:\s*\d+(?:[.,]\d+)?\s*%/, ": 999%");
    const r = checkReport(tampered);
    expect(r.ok).toBe(false);
    expect(r.issues.some((i) => i.includes("999") || i.toLowerCase().includes("range") || i.toLowerCase().includes("born"))).toBe(true);
  });

  it("gates a derived pack report against the pack's own 2-segment ids", () => {
    const rgaaReport = `# Rapport — RGAA 4.1.2
- **Taux** : 50%
## 1. x
## 2. y
- **RGAA 8.3 — Langue** — \`a.html:1\` (\`html\`)
  - manquant
## 3. z
## 4. NA
- RGAA 9.9 — invented — _x_
## 5. manual
`;
    const r = checkReport(rgaaReport, "rgaa");
    expect(r.ok).toBe(false);
    expect(r.issues.some((i) => i.includes("9.9"))).toBe(true); // 9.9 is not a real RGAA id
  });
});
