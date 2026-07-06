import { describe, it, expect } from "vitest";
import { runAudit } from "../src/audit.js";
import { renderReport } from "../src/report.js";
import { checkReport } from "../src/check.js";
import { registerRuntimePack } from "../src/standards/index.js";

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

  it("gates a pack report by the PACK'S OWN idPattern grammar, not a fixed 2-segment shape (e.g. Section 508 E205.4)", () => {
    registerRuntimePack({
      key: "synth508check",
      name: "Synth508",
      org: "O",
      country: "US",
      baseVersion: "1",
      wcagVersion: "2.2",
      locales: ["en"],
      defaultLocale: "en",
      license: "x",
      source: "x",
      attribution: "x",
      idPattern: "^E\\d+\\.\\d+$",
      themes: [{ number: 1, name: { en: "Interface" }, count: 1 }],
      criteria: [{ id: "E205.4", theme: 1, title: { en: "Focus Visible" }, titlePlain: { en: "Focus Visible" }, wcag: ["2.4.7"] }],
    });
    const md = `# Report — Synth508 1
- **Rate** : 50%
## 1. x
## 2. y
- **E205.4 — Focus Visible** — \`a.html:1\` (\`a\`)
  - missing
## 3. z
## 4. NA
- E999.9 — invented — _x_
## 5. manual
`;
    const r = checkReport(md, "synth508check");
    expect(r.ok).toBe(false);
    expect(r.issues.some((i) => i.includes("E999.9"))).toBe(true); // fabricated id
    expect(r.issues.some((i) => i.includes("E205.4"))).toBe(false); // real criterion recognized
  });
});
