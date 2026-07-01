import { describe, it, expect, afterEach } from "vitest";
import { mkdtempSync, rmSync, statSync, readFileSync } from "node:fs";
import { execFileSync } from "node:child_process";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { parse } from "yaml";
import { hookScript, stagedHookScript, ciWorkflow, writeHook, writeCi } from "../src/init.js";

const tmps: string[] = [];
function tmp(): string {
  const d = mkdtempSync(join(tmpdir(), "u11y-init-"));
  tmps.push(d);
  return d;
}
afterEach(() => {
  for (const d of tmps.splice(0)) rmSync(d, { recursive: true, force: true });
});

describe("pre-commit hook", () => {
  it("defaults to the strict-staged auto-fix gate — valid POSIX sh, gated, bypassable", () => {
    const d = tmp();
    const path = writeHook(d, "scripts/ultra11y.mjs", "bloquant");
    const script = readFileSync(path, "utf8");
    // `sh -n` parses without executing — proves the generated script is valid.
    expect(() => execFileSync("sh", ["-n", path])).not.toThrow();
    expect(script).toContain("SKIP_A11Y");
    expect(script).toContain("command -v node");
    expect(script).toContain("audit --staged --fail-on blocking");
    expect(script).toContain("fix --staged --write --safe");
    expect(script).not.toContain("--baseline"); // the default gate needs no baseline
    expect(script).toContain('node "$ULTRA11Y"');
  });

  it('generates the legacy baseline regression gate with mode "baseline"', () => {
    const d = tmp();
    const path = writeHook(d, "scripts/ultra11y.mjs", "bloquant", "baseline");
    const script = readFileSync(path, "utf8");
    expect(() => execFileSync("sh", ["-n", path])).not.toThrow();
    expect(script).toContain("audit --changed --baseline audits/baseline.json --fail-on blocking");
    expect(script).not.toContain("--staged");
  });

  it("writes an executable hook and threads --fail-on into both variants", () => {
    const d = tmp();
    const path = writeHook(d, "x.mjs", "majeur");
    expect(statSync(path).mode & 0o111).not.toBe(0); // has an execute bit
    expect(stagedHookScript("x.mjs", "majeur")).toContain("--fail-on major");
    expect(hookScript("x.mjs", "majeur")).toContain("--fail-on major");
    // Both variants must be valid POSIX sh.
    for (const s of [stagedHookScript("x.mjs", "mineur"), hookScript("x.mjs", "mineur")]) {
      expect(s.startsWith("#!/bin/sh")).toBe(true);
    }
  });
});

describe("CI workflow", () => {
  it("is valid YAML with an ultra11y job running the gate", () => {
    const d = tmp();
    const path = writeCi(d, "scripts/ultra11y.mjs", "bloquant");
    const doc = parse(readFileSync(path, "utf8")) as { jobs: { ultra11y: { steps: { run?: string }[] } } };
    expect(doc.jobs.ultra11y).toBeDefined();
    const run = doc.jobs.ultra11y.steps.map((s) => s.run ?? "").join("\n");
    expect(run).toContain("--baseline audits/baseline.json");
    expect(run).toContain("--fail-on blocking");
    expect(ciWorkflow("x", "bloquant")).toContain("pull_request");
  });
});
