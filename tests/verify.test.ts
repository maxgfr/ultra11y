import { describe, it, expect } from "vitest";
import { existsSync, readFileSync, mkdtempSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { runAudit } from "../src/audit.js";
import { renderReport, renderPackReport } from "../src/report.js";
import { buildWorklist, applyVerdicts, writeWorklist, formatWorklist, type VerifyItem } from "../src/verify.js";
import { registerRuntimePack, loadPack, derivePackResults } from "../src/standards/index.js";
import type { AuditResult } from "../src/types.js";

const FIX = new URL("./fixtures/", import.meta.url).pathname;
const bad = runAudit({ inputs: [`${FIX}non-conforming/bad.html`] });
const good = runAudit({ inputs: [`${FIX}conforming/good.html`] });
const report = renderReport(bad, "fr");

describe("buildWorklist", () => {
  it("turns each non-conformity into a claim↔criterion↔element item", () => {
    const items = buildWorklist(report);
    expect(items.length).toBeGreaterThan(5);
    const first = items[0]!;
    expect(first.criteriaId).toMatch(/^\d+\.\d+\.\d+$/); // WCAG success-criterion id
    expect(first.file).toContain("bad.html");
    expect(first.line).toBeGreaterThan(0);
    expect(first.claim.length).toBeGreaterThan(0);
    expect(first.verdict).toBeNull();
  });

  it("respects --max-verify", () => {
    expect(buildWorklist(report, "wcag", 2)).toHaveLength(2);
  });

  // Parser-twin: a report containing advisory (« Recommandation ») blocks must yield the
  // EXACT same worklist as one without them — advisory blocks are deliberately rendered
  // without the criterion-line grammar the worklist parser keys on (src/verify.ts
  // auditorCriterionLine), so they never enter the non-conformity worklist.
  it("advisory recommendation blocks do not enter the worklist (parser-twin)", () => {
    const dir = mkdtempSync(join(tmpdir(), "u11y-adv-"));
    // 1.3.1 advisory-only (two <h1> → h1-multiple) + 1.1.1 normative NC (img with no alt).
    const withAdvisory = join(dir, "mixed.html");
    writeFileSync(
      withAdvisory,
      `<!doctype html><html lang="en"><head><title>t</title></head><body><main><h1>A</h1><h1>B</h1><img src="x.png"></main></body></html>`,
    );
    const audit = runAudit({ inputs: [withAdvisory] });
    // Sanity: the audit really carries an advisory finding AND a normative one.
    expect(audit.findings.some((f) => f.advisory)).toBe(true);
    expect(audit.findings.some((f) => !f.advisory)).toBe(true);

    const reportWithAdvisory = renderReport(audit, "en");
    expect(reportWithAdvisory).toMatch(/Recommendations \(non-normative\)/);

    // The twin: the same audit with every advisory finding stripped (so no advisory blocks
    // render at all). The worklist must be identical.
    const stripped: AuditResult = structuredClone(audit);
    stripped.findings = stripped.findings.filter((f) => !f.advisory);
    for (const c of stripped.criteria) c.findings = c.findings.filter((f) => !f.advisory);
    const reportWithout = renderReport(stripped, "en");
    expect(reportWithout).not.toMatch(/Recommendations \(non-normative\)/);

    const twinKeys = (md: string) =>
      buildWorklist(md, "wcag", Number.POSITIVE_INFINITY).map((i) => `${i.criteriaId}|${i.file}|${i.line}|${i.selector}|${i.claim}`);
    const a = twinKeys(reportWithAdvisory);
    const b = twinKeys(reportWithout);
    expect(a).toEqual(b);
    // And the advisory criterion (1.3.1) is NOT in the worklist.
    expect(buildWorklist(reportWithAdvisory, "wcag", Number.POSITIVE_INFINITY).some((i) => i.criteriaId === "1.3.1")).toBe(false);
    // …while the normative one (1.1.1) IS.
    expect(a.some((k) => k.startsWith("1.1.1|"))).toBe(true);
  });

  it("parses a pack's NC header by the PACK'S OWN idPattern grammar, not a fixed 2-segment shape (e.g. Section 508 E205.4)", () => {
    registerRuntimePack({
      key: "synth508verify",
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
  - focus indicator missing
## 3. z
## 4. NA
## 5. manual
`;
    const items = buildWorklist(md, "synth508verify");
    expect(items).toHaveLength(1);
    expect(items[0]!.criteriaId).toBe("E205.4");
  });

  it("does not mis-align positional captures when the pack's idPattern itself contains capturing groups (e.g. Section 508 E205.4 as `^E(\\d+)\\.(\\d+)$`)", () => {
    registerRuntimePack({
      key: "synth508capturegroups",
      name: "Synth508Groups",
      org: "O",
      country: "US",
      baseVersion: "1",
      wcagVersion: "2.2",
      locales: ["en"],
      defaultLocale: "en",
      license: "x",
      source: "x",
      attribution: "x",
      idPattern: "^E(\\d+)\\.(\\d+)$",
      themes: [{ number: 1, name: { en: "Interface" }, count: 1 }],
      criteria: [{ id: "E205.4", theme: 1, title: { en: "Focus Visible" }, titlePlain: { en: "Focus Visible" }, wcag: ["2.4.7"] }],
    });
    const md = `# Report — Synth508Groups 1
- **Rate** : 50%
## 1. x
## 2. y
- **E205.4 — Focus Visible** — \`a.html:42\` (\`button.cta\`)
  - focus indicator missing
## 3. z
## 4. NA
## 5. manual
`;
    const items = buildWorklist(md, "synth508capturegroups");
    expect(items).toHaveLength(1);
    const item = items[0]!;
    expect(item.criteriaId).toBe("E205.4");
    expect(item.claim).toBe("focus indicator missing");
    expect(item.file).toBe("a.html");
    expect(item.line).toBe(42);
    expect(Number.isNaN(item.line)).toBe(false);
    expect(item.selector).toBe("button.cta");
  });
});

// THE critical anti-hallucination guard for Phase 4: report.ts §2 now renders one
// auditor block PER CRITERION (not one flat bullet per finding), so `buildWorklist`
// must walk the criterion↔occurrence structure correctly. If this guard didn't exist
// and the parsing regex silently under/over-matched, `verify` would gate the WRONG
// number of claims (or none at all) without any test ever noticing.
describe("round-trip guard: buildWorklist(renderReport(...)) recovers EXACTLY the fixture's NC findings", () => {
  const NO_CAP = Number.MAX_SAFE_INTEGER;

  it("core WCAG, fr: item count == total NC findings", () => {
    const items = buildWorklist(renderReport(bad, "fr"), "wcag", NO_CAP);
    expect(items.length).toBe(bad.findings.length);
    expect(items.length).toBeGreaterThan(0);
  });

  it("core WCAG, en: item count == total NC findings", () => {
    const items = buildWorklist(renderReport(bad, "en"), "wcag", NO_CAP);
    expect(items.length).toBe(bad.findings.length);
  });

  it("RGAA pack, fr: item count == the pack-projected NC finding count (a WCAG finding may fan out to several RGAA criteria)", () => {
    const expectedCount = derivePackResults(bad, "rgaa").reduce((n, p) => n + p.findings.length, 0);
    const items = buildWorklist(renderPackReport(bad, loadPack("rgaa"), "fr"), "rgaa", NO_CAP);
    expect(items.length).toBe(expectedCount);
    expect(items.length).toBeGreaterThan(bad.findings.length); // confirms the fan-out actually happened
  });

  it("RGAA pack, en: item count == the pack-projected NC finding count", () => {
    const expectedCount = derivePackResults(bad, "rgaa").reduce((n, p) => n + p.findings.length, 0);
    const items = buildWorklist(renderPackReport(bad, loadPack("rgaa"), "en"), "rgaa", NO_CAP);
    expect(items.length).toBe(expectedCount);
  });

  it("a conforming report round-trips to zero items (no false positives)", () => {
    expect(buildWorklist(renderReport(good, "fr"), "wcag", NO_CAP)).toHaveLength(0);
  });

  it("every item's criteriaId/file/line/claim is a real, non-empty value (no partial/garbled captures)", () => {
    const items = buildWorklist(renderReport(bad, "en"), "wcag", NO_CAP);
    for (const it of items) {
      expect(it.criteriaId).toMatch(/^\d+\.\d+\.\d+$/);
      expect(it.file.length).toBeGreaterThan(0);
      expect(it.line).toBeGreaterThan(0);
      expect(it.claim.length).toBeGreaterThan(0);
    }
  });

  it("still verifies a LEGACY (pre-Phase-4) flat-bullet report via the fallback parser", () => {
    const legacy = [
      "# Report",
      "- **Rate** : 50%",
      "## 1. x",
      "## 2. y",
      "- **1.4.3 — Contrast (Minimum)** — `a.html:1` (`div`)",
      "  - contrast too low",
      "  - _Fix :_ increase contrast",
      "## 3. z",
      "## 4. NA",
      "## 5. manual",
      "",
    ].join("\n");
    const items = buildWorklist(legacy, "wcag");
    expect(items).toHaveLength(1);
    expect(items[0]!.criteriaId).toBe("1.4.3");
    expect(items[0]!.claim).toBe("contrast too low");
  });
});

describe("applyVerdicts", () => {
  const base = (): VerifyItem[] => buildWorklist(report, "wcag", 3);

  it("passes when every claim is supported", () => {
    const items = base().map((i) => ({ ...i, verdict: "supported" as const }));
    expect(applyVerdicts(items).ok).toBe(true);
  });

  it("fails on a refuted or unsupported claim", () => {
    const items = base().map((i, n) => ({ ...i, verdict: n === 0 ? ("refuted" as const) : ("supported" as const) }));
    const r = applyVerdicts(items);
    expect(r.ok).toBe(false);
    expect(r.refuted).toBe(1);
  });

  it("fails when a claim is left unadjudicated", () => {
    const items = base(); // verdicts still null
    const r = applyVerdicts(items);
    expect(r.ok).toBe(false);
    expect(r.unadjudicated).toBe(3);
  });

  it("rejects an unknown/typo verdict token instead of silently passing", () => {
    const items = base().map((i) => ({ ...i, verdict: "conforming" as unknown as VerifyItem["verdict"] }));
    const r = applyVerdicts(items);
    expect(r.ok).toBe(false);
  });

  it("with an `expected` worklist, an empty verdicts set FAILS on coverage (missing NCs)", () => {
    const expected = base();
    const r = applyVerdicts([], expected);
    expect(r.ok).toBe(false);
    expect(r.missing).toBe(expected.length);
    expect(r.total).toBe(expected.length);
  });

  it("with an `expected` worklist, dropping one to-be-refuted item is caught as missing", () => {
    const expected = base();
    const items = expected.slice(1).map((i) => ({ ...i, verdict: "supported" as const })); // hide item 0
    const r = applyVerdicts(items, expected);
    expect(r.ok).toBe(false);
    expect(r.missing).toBe(1);
  });

  it("with an `expected` worklist, full coverage all-supported passes", () => {
    const expected = base();
    const items = expected.map((i) => ({ ...i, verdict: "supported" as const }));
    expect(applyVerdicts(items, expected).ok).toBe(true);
  });

  it("normalizes case: 'Refuted' fails the gate, 'Supported' passes", () => {
    const refuted = base().map((i) => ({ ...i, verdict: "Refuted" as unknown as VerifyItem["verdict"] }));
    expect(applyVerdicts(refuted).ok).toBe(false);
    const supported = base().map((i) => ({ ...i, verdict: "Supported" as unknown as VerifyItem["verdict"] }));
    expect(applyVerdicts(supported).ok).toBe(true);
  });

  it("accepts 'partial' as supporting the non-conformity", () => {
    const items = base().map((i) => ({ ...i, verdict: "partial" as const }));
    expect(applyVerdicts(items).ok).toBe(true);
  });
});

describe("formatWorklist (judgment grounding)", () => {
  it("grounds each SC on its W3C Understanding doc and a pre-completion validation checklist", () => {
    const md = formatWorklist(buildWorklist(report, "wcag", 3), false);
    expect(md).toContain("Understanding");
    expect(md).toContain("Pre-completion checklist");
  });

  // Scoped fix (Task 5): the worklist's grounding line used to print the raw baked
  // English `sc.title` even in `--lang fr`. It now resolves through `scTitle(id, lang)`
  // like every other renderer, so a `--lang fr` verify worklist is fully French.
  it("localizes the grounding SC title through scTitle(id, lang) instead of the raw English bake", () => {
    const items = buildWorklist(renderReport(bad, "en"), "wcag", 1);
    expect(items[0]!.criteriaId).toBe("1.1.1"); // Non-text Content / Contenu non textuel

    const fr = formatWorklist(items, false, "wcag", "fr");
    expect(fr).toContain("Contenu non textuel"); // W3C authorized French title
    expect(fr).not.toContain("Non-text Content");

    const en = formatWorklist(items, false, "wcag", "en");
    expect(en).toContain("Non-text Content");
  });
});

describe("writeWorklist", () => {
  it("writes VERIFY.todo.json + VERIFY.md", () => {
    const out = join(tmpdir(), "ultra11y-verify");
    const { todoPath, mdPath, count } = writeWorklist(buildWorklist(report, "wcag", 5), out, true);
    expect(existsSync(todoPath)).toBe(true);
    expect(existsSync(mdPath)).toBe(true);
    expect(count).toBe(5);
    expect(readFileSync(mdPath, "utf8")).toContain("--semantic");
  });
});
