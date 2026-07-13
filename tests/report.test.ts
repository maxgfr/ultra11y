import { describe, it, expect } from "vitest";
import { readFileSync, existsSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { runAudit } from "../src/audit.js";
import { renderReport, renderPackReport, writeReport, untestedNeedsRendering } from "../src/report.js";
import { mergeDynamic } from "../src/scan.js";
import { prdUnits } from "../src/prd.js";
import { loadPack } from "../src/standards/index.js";
import type { DynamicResult } from "../src/types.js";

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
    expect(md).toContain("## 5. Critères à adjuger (jugement / rendu) — non décidés par le moteur statique");
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

  it("lists manual criteria under the residual-risk section with the agent-adjudication warning", () => {
    expect(md).toContain("verify --manual"); // the agent adjudicates, gated — not a human
    expect(md).toContain("scan"); // rendering criteria go to the scan tier
    expect(md).not.toContain("revue humaine");
    expect(md).not.toContain("vérification humaine");
    expect(md).toContain("1.4.3 —"); // contrast, needs-rendering
  });

  it("no engine deliverable defers a decision to a human (agent adjudicates, gated)", () => {
    const en = renderReport(bad, "en");
    for (const doc of [md, en]) {
      expect(doc).not.toMatch(/human review|human check/i);
      expect(doc).not.toContain("revue humaine");
    }
    expect(en).toContain("verify --manual");
    expect(en).toMatch(/agent/i);
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

describe("partial-audit advisory banner (Task 5 — needs-rendering-aware coverage)", () => {
  const reflowFinding = {
    criteriaId: "1.4.10",
    axeRule: "reflow",
    impact: "serious",
    severity: "majeur",
    message: "reflow",
    selector: "document",
    snippet: "",
    engine: "reflow",
    page: "https://example.fr",
  } as const;
  // A Docker run measures axe + the 320px reflow probe ONLY (testedScs stamped by runScan*).
  const dockerScan: DynamicResult = {
    tool: "ultra11y",
    engine: "axe-core@playwright (docker)",
    target: "https://example.fr",
    date: "2026-07-13",
    findings: [reflowFinding],
    testedScs: ["1.4.10"],
  };
  // A local run with interactions measures the full needs-rendering set.
  const localScan: DynamicResult = {
    tool: "ultra11y",
    engine: "axe-core@playwright (local)",
    target: "https://example.fr",
    date: "2026-07-13",
    findings: [reflowFinding],
    testedScs: ["1.4.4", "1.4.10", "1.4.12", "2.4.7", "1.4.13", "4.1.3"],
  };

  it("appears on an RGAA report with NO merged scan results, naming every needs-rendering criterion", () => {
    const md = renderPackReport(bad, loadPack("rgaa"), "fr");
    expect(md).toContain("Audit partiel");
    expect(md).toContain("zoom 200 %");
    expect(md).toContain("reflow 320 px");
    expect(md).toContain("visibilité du focus");
    expect(md).toContain("scan --sample");
    expect(renderPackReport(bad, loadPack("rgaa"), "en")).toContain("Partial audit");
    expect(untestedNeedsRendering(bad)).toEqual(["1.4.4", "1.4.10", "1.4.12", "2.4.7", "1.4.13", "4.1.3"]);
  });

  it("does NOT appear on the core WCAG report", () => {
    expect(renderReport(bad, "fr")).not.toContain("Audit partiel");
    expect(renderReport(bad, "en")).not.toContain("Partial audit");
  });

  it("PERSISTS after a Docker-only scan (reflow measured, local probes never ran) — naming exactly the untested ones", () => {
    const merged = mergeDynamic(bad, dockerScan, "fr");
    expect(untestedNeedsRendering(merged)).toEqual(["1.4.4", "1.4.12", "2.4.7", "1.4.13", "4.1.3"]);
    const md = renderPackReport(merged, loadPack("rgaa"), "fr");
    expect(md).toContain("Audit partiel");
    // Names the local-only probes that never ran…
    expect(md).toContain("zoom 200 %");
    expect(md).toContain("espacement du texte");
    expect(md).toContain("visibilité du focus");
    expect(md).toContain("contenu au survol");
    expect(md).toContain("régions live");
    // …but NOT the reflow the Docker runner DID measure.
    expect(md).not.toContain("reflow 320 px");
  });

  it("is GONE after a full local scan (every needs-rendering criterion measured)", () => {
    const merged = mergeDynamic(bad, localScan, "fr");
    expect(untestedNeedsRendering(merged)).toEqual([]);
    expect(renderPackReport(merged, loadPack("rgaa"), "fr")).not.toContain("Audit partiel");
    expect(renderPackReport(merged, loadPack("rgaa"), "en")).not.toContain("Partial audit");
  });

  it("back-compat: an audit merged before the coverage stamp counts a dyn-* finding as coverage of its SC", () => {
    const noStamp: DynamicResult = { ...dockerScan, testedScs: undefined };
    const merged = mergeDynamic(bad, noStamp, "fr");
    expect(merged.scope.scan).toBeUndefined();
    expect(untestedNeedsRendering(merged)).not.toContain("1.4.10"); // dyn-reflow finding proves it ran
    expect(untestedNeedsRendering(merged)).toContain("2.4.7"); // no evidence the focus probe ran
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

// R7: technique lists are no longer truncated with "…" (full actionability)
describe("renderReport — advisory recommendations section", () => {
  // two-h1.html: 1.3.1 carries only the advisory h1-multiple → a recommendation, never NC.
  const twoH1 = runAudit({ inputs: [`${FIX}egapro-feedback/fp/two-h1.html`] });

  it("renders a Recommendations section AFTER the non-conformities, and NOT among them", () => {
    const md = renderReport(twoH1, "en");
    const recIdx = md.indexOf("Recommendations (non-normative)");
    const ncIdx = md.indexOf("## 2. Non-conformities");
    const conformingIdx = md.indexOf("## 3. Conforming");
    expect(recIdx).toBeGreaterThan(-1);
    expect(recIdx).toBeGreaterThan(ncIdx); // after §2
    expect(recIdx).toBeLessThan(conformingIdx); // before §3
    // The advisory 1.3.1 is a recommendation, never a non-conformity.
    expect(md).toContain("Recommendation (non-normative)");
    expect(md).not.toContain("### 🔴 Blocking");
    expect(md).not.toContain("### 🟠 Major");
    expect(md).toContain("No non-conformity detected by the static engine.");
  });

  it("omits the Recommendations section when there is no advisory finding", () => {
    const md = renderReport(bad, "en");
    expect(md).not.toContain("Recommendations (non-normative)");
  });

  it("still keeps the required 1–5 numbered sections intact with the advisory section present", () => {
    const md = renderReport(twoH1, "fr");
    for (const n of [1, 2, 3, 4, 5]) expect(md).toMatch(new RegExp(`^##\\s+${n}\\.`, "m"));
    expect(md).toContain("Recommandations (non normatives)");
  });
});

describe("report technique lists — full, never truncated (R7)", () => {
  const md7 = renderReport(bad, "fr");
  it("renders the whole technique list for a criterion with many techniques (1.3.1 has 67)", () => {
    // bad.html raises 1.3.1 NCs; its auditor block lists WCAG techniques.
    expect(md7).not.toContain(", …"); // the old slice(0,12) + ellipsis is gone
    // the auditor block's technique line ("**Technique** : G1, H2, …") — a 12-item cap
    // would have shown ≤12 comma-separated codes; 1.3.1's full list is far longer. Pick
    // the richest technique line in the report.
    const techLines = md7.split("\n").filter((l: string) => /\*\*Technique\*\*/.test(l));
    const richest = Math.max(0, ...techLines.map((l: string) => l.split(",").length));
    expect(richest).toBeGreaterThan(12);
  });
});
