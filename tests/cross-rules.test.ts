import { describe, it, expect } from "vitest";
import { runAudit } from "../src/audit.js";
import type { Finding } from "../src/types.js";

const SCOPE = ["tests/fixtures/cross-file"];
const find = (fs: Finding[], ruleId: string, fileEndsWith: string): Finding | undefined => fs.find((f) => f.ruleId === ruleId && f.file.endsWith(fileEndsWith));

describe("cross-file rules (audit --graph)", () => {
  const plain = runAudit({ inputs: SCOPE, dedup: "off" }).findings;
  const graph = runAudit({ inputs: SCOPE, dedup: "off", graph: true }).findings;

  it("flags an icon-only component used without a name, pointing at its definition", () => {
    const f = find(graph, "cross-icon-only-unnamed", "page-bad.tsx");
    expect(f).toBeDefined();
    expect(f?.related?.file).toMatch(/IconButton\.tsx$/);
    expect(f?.criteriaId).toBe("4.1.2");
  });

  it("does not flag a usage that passes an accessible name", () => {
    expect(find(graph, "cross-icon-only-unnamed", "page-good.tsx")).toBeUndefined();
  });

  it("suppresses the single-file icon-only finding on a spread-props component definition", () => {
    // Without the graph the definition's <button> trips the single-file rule…
    expect(find(plain, "icon-only-control-unnamed", "IconButton.tsx")).toBeDefined();
    // …with the graph, cross-aria-forwarding suppresses it.
    expect(find(graph, "icon-only-control-unnamed", "IconButton.tsx")).toBeUndefined();
  });

  it("suppresses a skip-link-target false positive whose target lives in another file", () => {
    expect(find(plain, "skip-link-target-missing", "Layout.tsx")).toBeDefined();
    expect(find(graph, "skip-link-target-missing", "Layout.tsx")).toBeUndefined();
  });

  it("only adds/removes cross-file effects — the rest of the findings are unchanged", () => {
    // every plain finding that isn't one of the two suppressed kinds still appears
    const suppressed = new Set(["icon-only-control-unnamed", "skip-link-target-missing"]);
    const stillThere = plain.filter((f) => !suppressed.has(f.ruleId));
    for (const f of stillThere) {
      expect(graph.some((g) => g.ruleId === f.ruleId && g.file === f.file && g.line === f.line)).toBe(true);
    }
  });
});
