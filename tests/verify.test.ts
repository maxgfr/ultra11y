import { describe, it, expect } from "vitest";
import { existsSync, readFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { runAudit } from "../src/audit.js";
import { renderReport } from "../src/report.js";
import { buildWorklist, applyVerdicts, writeWorklist, formatWorklist, type VerifyItem } from "../src/verify.js";

const FIX = new URL("./fixtures/", import.meta.url).pathname;
const report = renderReport(runAudit({ inputs: [`${FIX}non-conforming/bad.html`] }), "fr");

describe("buildWorklist", () => {
  it("turns each non-conformity into a claim↔criterion↔element item", () => {
    const items = buildWorklist(report);
    expect(items.length).toBeGreaterThan(5);
    const first = items[0]!;
    expect(first.criteriaId).toMatch(/^\d+\.\d+$/);
    expect(first.file).toContain("bad.html");
    expect(first.line).toBeGreaterThan(0);
    expect(first.claim.length).toBeGreaterThan(0);
    expect(first.verdict).toBeNull();
  });

  it("respects --max-verify", () => {
    expect(buildWorklist(report, 2)).toHaveLength(2);
  });
});

describe("applyVerdicts", () => {
  const base = (): VerifyItem[] => buildWorklist(report, 3);

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
  it("inlines the RGAA test conditions per criterion and a pre-completion validation checklist", () => {
    const md = formatWorklist(buildWorklist(report, 3), false);
    expect(md).toContain("Tests RGAA");
    expect(md).toContain("Liste de contrôle avant clôture");
  });
});

describe("writeWorklist", () => {
  it("writes VERIFY.todo.json + VERIFY.md", () => {
    const out = join(tmpdir(), "ultra11y-verify");
    const { todoPath, mdPath, count } = writeWorklist(buildWorklist(report, 5), out, true);
    expect(existsSync(todoPath)).toBe(true);
    expect(existsSync(mdPath)).toBe(true);
    expect(count).toBe(5);
    expect(readFileSync(mdPath, "utf8")).toContain("--semantic");
  });
});
