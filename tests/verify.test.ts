import { describe, it, expect } from "vitest";
import { existsSync, readFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { runAudit } from "../src/audit.js";
import { renderReport } from "../src/report.js";
import { buildWorklist, applyVerdicts, writeWorklist, formatWorklist, type VerifyItem } from "../src/verify.js";
import { registerRuntimePack } from "../src/standards/index.js";

const FIX = new URL("./fixtures/", import.meta.url).pathname;
const report = renderReport(runAudit({ inputs: [`${FIX}non-conforming/bad.html`] }), "fr");

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
