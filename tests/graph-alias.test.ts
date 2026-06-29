import { describe, it, expect } from "vitest";
import { mkdtempSync, writeFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { readTsAliases } from "../src/graph/tsconfig.js";
import { runAudit } from "../src/audit.js";

describe("readTsAliases (tsconfig paths)", () => {
  it("parses baseUrl + paths into cwd-relative alias rules", () => {
    const dir = mkdtempSync(join(tmpdir(), "u11y-ts-"));
    try {
      writeFileSync(
        join(dir, "tsconfig.json"),
        JSON.stringify({ compilerOptions: { baseUrl: ".", paths: { "@/*": ["src/*"], "@lib": ["src/lib/index.ts"] } } }),
      );
      const aliases = readTsAliases(dir, dir); // cwd = dir → bases relative to dir
      const wild = aliases.find((a) => a.prefix === "@/");
      expect(wild?.wildcard).toBe(true);
      expect(wild?.bases).toEqual(["src"]);
      const exact = aliases.find((a) => a.prefix === "@lib");
      expect(exact?.wildcard).toBe(false);
      expect(exact?.bases).toEqual(["src/lib/index.ts"]);
    } finally {
      rmSync(dir, { recursive: true, force: true });
    }
  });

  it("returns an empty map when there is no tsconfig nearby", () => {
    const dir = mkdtempSync(join(tmpdir(), "u11y-none-"));
    try {
      expect(readTsAliases(dir, dir)).toEqual([]);
    } finally {
      rmSync(dir, { recursive: true, force: true });
    }
  });
});

describe("alias resolution end-to-end (audit --graph)", () => {
  // Page.tsx imports SaveButton through the "@/*" tsconfig alias only. The cross-file
  // rule can only fire if the alias resolved the usage to the SaveButton definition.
  const SCOPE = ["tests/fixtures/alias-proj"];

  it("resolves an aliased import and flags the prop-drilled name loss across it", () => {
    const graph = runAudit({ inputs: SCOPE, dedup: "off", graph: true }).findings;
    const f = graph.find((x) => x.ruleId === "cross-prop-drilled-name-lost" && x.file.endsWith("Page.tsx"));
    expect(f, "alias import must resolve so the cross-rule can fire").toBeDefined();
    expect(f?.related?.file).toMatch(/SaveButton\.tsx$/);
  });
});
