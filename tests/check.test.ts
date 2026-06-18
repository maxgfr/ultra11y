import { describe, it, expect } from "vitest";
import { runAudit } from "../src/audit.js";
import { renderReport } from "../src/report.js";
import { checkReport } from "../src/check.js";

const FIX = new URL("./fixtures/", import.meta.url).pathname;
const validReport = renderReport(runAudit({ inputs: [`${FIX}non-conforming/bad.html`] }), "fr");

const BROKEN = `# Rapport d'audit
- **Taux de conformité automatique** : 50%

## 1. Synthèse par thématique
| Thématique | C |
|---|---|

## 2. Non-conformités (par priorité)
- **99.9 — Critère inventé** — \`x.html:1\` (\`div\`)
  - une non-conformité hallucinée

## 4. Critères non applicables (NA)
- 12.1 — Une page « plan du site »

## 5. Critères à évaluer manuellement
- 3.2 — Contraste — _à vérifier_
`;

describe("checkReport", () => {
  it("passes a well-formed report", () => {
    const r = checkReport(validReport);
    expect(r.ok).toBe(true);
    expect(r.issues).toHaveLength(0);
  });

  it("flags a missing section, an invented criterion, and an unjustified NA", () => {
    const r = checkReport(BROKEN);
    expect(r.ok).toBe(false);
    expect(r.issues.some((i) => i.includes("Section 3"))).toBe(true);
    expect(r.issues.some((i) => i.includes("99.9"))).toBe(true);
    expect(r.issues.some((i) => i.includes("12.1"))).toBe(true);
  });

  it("flags a conformance rate outside 0–100", () => {
    const tampered = validReport.replace(/:\s*\d+(?:[.,]\d+)?\s*%/, ": 999%");
    const r = checkReport(tampered);
    expect(r.ok).toBe(false);
    expect(r.issues.some((i) => i.includes("999") || i.toLowerCase().includes("born"))).toBe(true);
  });
});
