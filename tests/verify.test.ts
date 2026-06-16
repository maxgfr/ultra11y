import { describe, it, expect } from "vitest";
import { existsSync, readFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { runAudit } from "../src/audit.js";
import { renderReport } from "../src/report.js";
import { buildWorklist, applyVerdicts, writeWorklist, type VerifyItem } from "../src/verify.js";

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
