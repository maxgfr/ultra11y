import { describe, it, expect, afterEach } from "vitest";
import { mkdtempSync, readdirSync, readFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import type { AuditResult } from "../src/types.js";
import { prdUnits, renderBacklog, renderPerCriterion, renderPrdDoc, writePrd } from "../src/prd.js";

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
  standard: "wcag",
  version: "9.9.9",
  schemaVersion: 2,
  date: "2026-06-29",
  scope: { inputs: ["src"], files: 3 },
  guidelines: [],
  criteria: [],
  findings: [
    {
      ruleId: "positive-tabindex",
      criteriaId: "2.4.3",
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
      criteriaId: "1.1.1",
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
      criteriaId: "4.1.2",
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
  it("groups findings by WCAG SC, ordered by severity then SC id", () => {
    const units = prdUnits(AUDIT);
    expect(units.map((u) => u.criteriaId)).toEqual(["1.1.1", "4.1.2", "2.4.3"]);
    expect(units[0]!.severity).toBe("bloquant");
    expect(units[2]!.severity).toBe("majeur");
    expect(units[0]!.label).toMatch(/^1\.1\.1 — /); // SC label resolved from the WCAG dataset
  });
});

describe("renderBacklog", () => {
  const md = renderBacklog(AUDIT, "fr");
  it("is a single doc sectioned by priority with occurrences and remediation", () => {
    expect(md).toContain("# Plan de correction");
    expect(md).toContain("WCAG 2.2 AA");
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
  it("produces one PRD doc per SC", () => {
    const files = renderPerCriterion(AUDIT, "fr");
    expect(files.map((f) => f.name)).toEqual(["prd-1.1.1-2026-06-29.md", "prd-4.1.2-2026-06-29.md", "prd-2.4.3-2026-06-29.md"]);
    expect(files[0]!.content).toContain("# PRD — 1.1.1");
  });

  it("writes a single AUDITOR backlog file by default", () => {
    const out = tmp();
    const paths = writePrd(AUDIT, { out, lang: "fr", standard: "wcag" });
    expect(paths).toEqual([join(out, "prd-2026-06-29.md")]);
    const md = readFileSync(paths[0]!, "utf8");
    expect(md).toContain("Critère d'accessibilité"); // auditor doc title (core fr vocabulary)
    expect(md).toContain("Constat"); // auditor finding line, not the dev "Correction"
  });

  it("writes the legacy dev backlog with --format remediation", () => {
    const out = tmp();
    const paths = writePrd(AUDIT, { out, lang: "fr", format: "remediation", standard: "wcag" });
    expect(readFileSync(paths[0]!, "utf8")).toContain("Plan de correction");
  });

  it("writes one file per SC with --split criterion", () => {
    const out = tmp();
    const paths = writePrd(AUDIT, { out, lang: "fr", split: "criterion", standard: "wcag" });
    expect(paths.length).toBe(3);
    expect(readdirSync(out).sort()).toEqual(["prd-1.1.1-2026-06-29.md", "prd-2.4.3-2026-06-29.md", "prd-4.1.2-2026-06-29.md"]);
  });
});

describe("renderPrdDoc (--format doc)", () => {
  it("emits epics, one user story per criterion, and a Given/When/Then per criterion", () => {
    const doc = renderPrdDoc(AUDIT, "en", "wcag");
    expect(doc).toContain("## Epic — ");
    expect(doc).toMatch(/### .*User story —/);
    expect(doc).toContain("As a user relying on assistive technology");
    expect(doc).toMatch(/\*\*Given\*\*.*\*\*When\*\*.*\*\*Then\*\*/);
    expect(doc).toContain("`src/a.html:3`"); // task list keeps the occurrences
  });

  it("groups by RGAA theme under --standard rgaa", () => {
    // The pack view projects from r.criteria (CriterionResult[]), so populate it.
    const withCriteria: AuditResult = {
      ...AUDIT,
      criteria: [{ id: "1.1.1", guideline: "1.1", status: "NC", findings: [AUDIT.findings[1]!] }],
    };
    const doc = renderPrdDoc(withCriteria, "fr", "rgaa");
    expect(doc).toContain("## Épopée — ");
    expect(doc).toContain("RGAA"); // pack-labelled stories
  });

  it("writePrd --format doc writes a prd-doc-<date>.md file", () => {
    const out = tmp();
    const paths = writePrd(AUDIT, { out, lang: "en", format: "doc", standard: "wcag" });
    expect(paths).toEqual([join(out, "prd-doc-2026-06-29.md")]);
    expect(readFileSync(paths[0]!, "utf8")).toContain("Epic — ");
  });
});
