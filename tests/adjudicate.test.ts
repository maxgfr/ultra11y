import { describe, it, expect } from "vitest";
import { mkdtempSync, writeFileSync, readFileSync, existsSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { runAudit } from "../src/audit.js";
import { renderReport } from "../src/report.js";
import { buildWorklist } from "../src/verify.js";
import { buildAdjudicationWorklist, applyAdjudication, writeAdjudication, ADJUDICATE_MAX_EVIDENCE, type AdjudicationFile, type AdjudicationItem } from "../src/adjudicate.js";

const dir = mkdtempSync(join(tmpdir(), "u11y-adj-"));
function fixture(name: string, html: string): string {
  const f = join(dir, name);
  writeFileSync(f, html);
  return f;
}

// A page rich enough to harvest evidence for several judgment criteria.
const PAGE = fixture(
  "page.html",
  `<!doctype html>
<html lang="en">
<head><title>Shop</title></head>
<body>
<main>
<h1>Welcome</h1>
<img src="hero.png" alt="A hiker on a ridge at sunrise">
<img src="chart.png" alt="chart">
<p style="color:#333; background:#fff">Readable</p>
<a href="/pricing">Read more</a>
<a href="/help">Contact support</a>
<label for="email">Email</label><input id="email" type="email">
</main>
</body>
</html>`,
);

function auditPage() {
  return runAudit({ inputs: [PAGE] });
}

function file(items: AdjudicationItem[], auditDate = "2026-07-08"): AdjudicationFile {
  return { tool: "ultra11y", kind: "adjudication", schemaVersion: 2, standard: "wcag", auditDate, items };
}

describe("buildAdjudicationWorklist", () => {
  const audit = auditPage();
  const items = buildAdjudicationWorklist(audit);

  it("emits exactly one item per residual-risk (manual) criterion", () => {
    const residualIds = new Set(audit.residualRisks.map((r) => r.criteriaId));
    const itemIds = new Set(items.map((i) => i.criteriaId));
    expect(itemIds).toEqual(residualIds);
    expect(items.every((i) => i.verdict === null && i.decidedBy === "agent")).toBe(true);
  });

  it("harvests every image's alt value for 1.1.1", () => {
    const c = items.find((i) => i.criteriaId === "1.1.1")!;
    const alts = c.evidence.map((e) => e.snippet).join(" ");
    expect(alts).toContain("A hiker on a ridge at sunrise");
    expect(alts).toContain('alt="chart"');
    expect(c.evidence.every((e) => e.line > 0 && e.file.includes("page.html"))).toBe(true);
  });

  it("harvests link text + href + nearest heading context for 2.4.4", () => {
    const c = items.find((i) => i.criteriaId === "2.4.4")!;
    const blob = JSON.stringify(c.evidence);
    expect(blob).toContain("Read more");
    expect(blob).toContain("/pricing");
    expect(c.evidence.some((e) => (e.note ?? "").includes("Welcome"))).toBe(true); // preceding <h1>
  });

  it("harvests literal inline color pairs for 1.4.3", () => {
    const c = items.find((i) => i.criteriaId === "1.4.3");
    // 1.4.3 is needs-rendering; if present as residual it should carry the color evidence.
    if (c) expect(JSON.stringify(c.evidence)).toMatch(/#333|#fff/);
  });

  it("caps evidence per criterion and records the truncation honestly", () => {
    const many = fixture("many.html", `<!doctype html><html lang="en"><head><title>t</title></head><body><main><h1>h</h1>${Array.from({ length: 50 }, (_, i) => `<a href="/l${i}">link ${i}</a>`).join("")}</main></body></html>`);
    const a = runAudit({ inputs: [many] });
    const c = buildAdjudicationWorklist(a).find((i) => i.criteriaId === "2.4.4")!;
    expect(c.evidence.length).toBe(ADJUDICATE_MAX_EVIDENCE);
    expect(c.evidenceTruncated).toBeDefined();
    expect(c.evidenceTruncated!.total).toBeGreaterThan(ADJUDICATE_MAX_EVIDENCE);
  });
});

describe("applyAdjudication — updates the audit + records provenance", () => {
  it("applies a C verdict with justification and records decidedBy:agent", () => {
    const audit = auditPage();
    const items = buildAdjudicationWorklist(audit).map((i) =>
      i.criteriaId === "2.4.4" ? { ...i, verdict: "C" as const, justification: "Every link text is self-describing in context." } : { ...i, verdict: "manual" as const, reason: "undecidable" },
    );
    const r = applyAdjudication(audit, file(items));
    expect(r.ok).toBe(true);
    const c = r.audit.criteria.find((c) => c.id === "2.4.4")!;
    expect(c.status).toBe("C");
    expect(c.decidedBy).toBe("agent");
    expect(c.justification).toContain("self-describing");
  });

  it("an agent NC lands in audit.findings, renders in §2, and re-enters the verify worklist", () => {
    const audit = auditPage();
    const items = buildAdjudicationWorklist(audit).map((i) =>
      i.criteriaId === "1.1.1"
        ? { ...i, verdict: "NC" as const, findings: [{ file: PAGE, line: 9, selector: "img", message: 'alt="chart" is not descriptive', snippet: 'alt="chart"', severity: "majeur" as const }] }
        : { ...i, verdict: "manual" as const, reason: "undecidable" },
    );
    const r = applyAdjudication(audit, file(items));
    expect(r.ok).toBe(true);
    expect(r.audit.findings.some((f) => f.ruleId === "agent:1.1.1")).toBe(true);
    const report = renderReport(r.audit, "en");
    expect(report).toMatch(/1\.1\.1/);
    const wl = buildWorklist(report, "wcag", Number.POSITIVE_INFINITY);
    expect(wl.some((w) => w.criteriaId === "1.1.1")).toBe(true);
  });

  it("recomputes conformancePct over the newly decided set", () => {
    const audit = auditPage();
    const before = audit.conformancePct;
    const items = buildAdjudicationWorklist(audit).map((i) => ({ ...i, verdict: "C" as const, justification: "assessed conforming from source" }));
    const r = applyAdjudication(audit, file(items));
    expect(r.ok).toBe(true);
    expect(r.audit.conformancePct).not.toBe(before); // many manual → C shifts the ratio
    expect(r.audit.residualRisks.length).toBe(0);
  });

  it("§5 shrinks to only still-manual items and keeps the '## 5.' heading", () => {
    const audit = auditPage();
    const items = buildAdjudicationWorklist(audit).map((i, idx) => (idx === 0 ? { ...i, verdict: "manual" as const, reason: "needs-rendered-dom" } : { ...i, verdict: "C" as const, justification: "assessed from source" }));
    const r = applyAdjudication(audit, file(items));
    const report = renderReport(r.audit, "en");
    expect(report).toContain("## 5.");
    const manualCount = r.audit.criteria.filter((c) => c.status === "manual").length;
    expect(manualCount).toBe(1);
  });
});

describe("applyAdjudication — fail-closed validation", () => {
  const baseItems = () => buildAdjudicationWorklist(auditPage());
  const decideAll = (over: Partial<AdjudicationItem>, only?: string) =>
    baseItems().map((i) => (only && i.criteriaId !== only ? { ...i, verdict: "manual" as const, reason: "undecidable" } : { ...i, verdict: "manual" as const, reason: "undecidable", ...over }));

  it("fails on a null verdict (unadjudicated criterion)", () => {
    const items = baseItems(); // all verdict null
    expect(applyAdjudication(auditPage(), file(items)).ok).toBe(false);
  });

  it("fails a C without a justification", () => {
    const items = decideAll({ verdict: "C", justification: "" }, "2.4.4");
    const r = applyAdjudication(auditPage(), file(items));
    expect(r.ok).toBe(false);
    expect(r.issues.join("\n")).toMatch(/2\.4\.4/);
  });

  it("fails an NA without a justification", () => {
    const items = decideAll({ verdict: "NA", justification: "" }, "2.4.4");
    expect(applyAdjudication(auditPage(), file(items)).ok).toBe(false);
  });

  it("fails an NC without a groundable finding", () => {
    const items = decideAll({ verdict: "NC", findings: [] }, "1.1.1");
    expect(applyAdjudication(auditPage(), file(items)).ok).toBe(false);
  });

  it("fails a manual verdict without a reason", () => {
    const items = decideAll({ verdict: "manual", reason: null }, "1.1.1");
    expect(applyAdjudication(auditPage(), file(items)).ok).toBe(false);
  });

  it("fails when a residual criterion is missing from the adjudication file (coverage gap)", () => {
    const items = baseItems()
      .map((i) => ({ ...i, verdict: "manual" as const, reason: "undecidable" }))
      .slice(0, -1); // drop one
    expect(applyAdjudication(auditPage(), file(items)).ok).toBe(false);
  });

  it("fails an agent NC whose snippet does not match the cited source", () => {
    const items = decideAll(
      { verdict: "NC", findings: [{ file: PAGE, line: 9, selector: "video", message: "bogus", snippet: "<video controls></video>" }] },
      "1.1.1",
    );
    const r = applyAdjudication(auditPage(), file(items));
    expect(r.ok).toBe(false);
    expect(r.grounding.failed).toBeGreaterThan(0);
  });
});

describe("writeAdjudication", () => {
  it("writes ADJUDICATE.todo.json + ADJUDICATE.md", () => {
    const items = buildAdjudicationWorklist(auditPage());
    const out = join(dir, "wl");
    const w = writeAdjudication(items, out, { standard: "wcag", auditDate: "2026-07-08", lang: "en" });
    expect(existsSync(w.todoPath)).toBe(true);
    expect(existsSync(w.mdPath)).toBe(true);
    const todo = JSON.parse(readFileSync(w.todoPath, "utf8")) as AdjudicationFile;
    expect(todo.kind).toBe("adjudication");
    expect(todo.items.length).toBe(items.length);
    expect(readFileSync(w.mdPath, "utf8")).toMatch(/C \/ NC \/ NA|verdict/i);
  });
});
