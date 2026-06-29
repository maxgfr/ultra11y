import { describe, it, expect, afterEach } from "vitest";
import { mkdtempSync, readdirSync, readFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import type { AuditResult } from "../src/types.js";
import { prdUnits, renderBacklog, renderPerCriterion, writePrd } from "../src/prd.js";

const tmps: string[] = [];
function tmp(): string {
  const d = mkdtempSync(join(tmpdir(), "u11y-prd-"));
  tmps.push(d);
  return d;
}
afterEach(() => {
  for (const d of tmps.splice(0)) rmSync(d, { recursive: true, force: true });
});

const AUDIT: AuditResult = {
  tool: "ultra11y",
  version: "9.9.9",
  schemaVersion: 1,
  date: "2026-06-29",
  scope: { inputs: ["src"], files: 3 },
  themes: [],
  criteria: [],
  findings: [
    {
      ruleId: "positive-tabindex",
      criteriaId: "12.8",
      file: "src/a.html",
      line: 9,
      col: 1,
      selectorHint: "div",
      severity: "majeur",
      message: "tabindex positif",
      remediation: "Utilisez tabindex=0",
      snippet: "<div tabindex=5>",
    },
    {
      ruleId: "img-alt-missing",
      criteriaId: "1.1",
      file: "src/a.html",
      line: 3,
      col: 1,
      selectorHint: "img",
      severity: "bloquant",
      message: "img sans alt",
      remediation: "Ajoutez alt",
      snippet: "<img>",
    },
    {
      ruleId: "cross-icon-only-unnamed",
      criteriaId: "7.1",
      file: "src/page.tsx",
      line: 5,
      col: 7,
      selectorHint: "IconButton",
      severity: "bloquant",
      message: "icône seule sans nom",
      remediation: "Passez aria-label",
      snippet: "<IconButton/>",
      related: { file: "src/IconButton.tsx", line: 2, col: 10, selectorHint: "IconButton", note: "définition du composant" },
    },
  ],
  residualRisks: [],
  conformancePct: 50,
};

describe("prdUnits", () => {
  it("groups findings by criterion, ordered by severity then criterion id", () => {
    const units = prdUnits(AUDIT);
    expect(units.map((u) => u.criteriaId)).toEqual(["1.1", "7.1", "12.8"]);
    expect(units[0]!.severity).toBe("bloquant");
    expect(units[2]!.severity).toBe("majeur");
    expect(units[0]!.label).toMatch(/^1\.1 — /); // criterion label resolved from the registry
  });
});

describe("renderBacklog", () => {
  const md = renderBacklog(AUDIT, "fr");
  it("is a single doc sectioned by priority with occurrences and remediation", () => {
    expect(md).toContain("# Plan de correction");
    expect(md).toContain("## 🔴 Bloquant (2)");
    expect(md).toContain("## 🟠 Majeur (1)");
    expect(md).toContain("`src/a.html:3`");
    expect(md).toContain("Ajoutez alt");
  });
  it("renders the cross-file definition site for a related finding", () => {
    expect(md).toContain("`src/IconButton.tsx:2`");
    expect(md).toContain("↳");
  });
  it("handles an empty audit gracefully", () => {
    const empty = renderBacklog({ ...AUDIT, findings: [] }, "fr");
    expect(empty).toContain("Aucune correction");
  });
});

describe("renderPerCriterion + writePrd", () => {
  it("produces one PRD doc per criterion", () => {
    const files = renderPerCriterion(AUDIT, "fr");
    expect(files.map((f) => f.name)).toEqual(["prd-1.1-2026-06-29.md", "prd-7.1-2026-06-29.md", "prd-12.8-2026-06-29.md"]);
    expect(files[0]!.content).toContain("# PRD — 1.1");
  });

  it("writes a single backlog file by default", () => {
    const out = tmp();
    const paths = writePrd(AUDIT, { out, lang: "fr" });
    expect(paths).toEqual([join(out, "prd-2026-06-29.md")]);
    expect(readFileSync(paths[0]!, "utf8")).toContain("Plan de correction");
  });

  it("writes one file per criterion with --split criterion", () => {
    const out = tmp();
    const paths = writePrd(AUDIT, { out, lang: "fr", split: "criterion" });
    expect(paths.length).toBe(3);
    expect(readdirSync(out).sort()).toEqual(["prd-1.1-2026-06-29.md", "prd-12.8-2026-06-29.md", "prd-7.1-2026-06-29.md"]);
  });
});
