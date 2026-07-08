// R8 — broaden the objective e2e surface: cheap exit-code + shape probes over the command
// families the harness previously left uncovered (prd, criteria, fix dry-run, render, init
// --help, pack scaffold/check) PLUS the new agent-adjudication surface (verify --manual,
// verify --apply fail-closed, check --semantic, audit --out <file>.json). Drives the
// shipped bundle as a subprocess.
import { describe, it, expect, afterAll } from "vitest";
import { existsSync, readFileSync, writeFileSync, readdirSync } from "node:fs";
import { join } from "node:path";
import { runCli, FIX, mkTmp, cleanupTmp } from "./helpers.js";

afterAll(cleanupTmp);

const auditTo = (dir: string, fixture = FIX.bad) => {
  expect(runCli(["audit", fixture, "--out", dir, "--json"]).code).toBe(0);
  return join(dir, "audit-latest.json");
};

describe("e2e: prd", () => {
  it("--format audit writes a backlog markdown", () => {
    const dir = mkTmp();
    const r = runCli(["prd", "--in", auditTo(dir), "--out", dir, "--format", "audit"]);
    expect(r.code).toBe(0);
    expect(readdirSync(dir).some((f) => f.startsWith("prd-") && f.endsWith(".md"))).toBe(true);
  });
  it("--format doc + --split criterion emit valid output", () => {
    const dir = mkTmp();
    const audit = auditTo(dir);
    expect(runCli(["prd", "--in", audit, "--out", dir, "--format", "doc"]).code).toBe(0);
    expect(runCli(["prd", "--in", audit, "--out", dir, "--split", "criterion"]).code).toBe(0);
    expect(readdirSync(dir).filter((f) => f.startsWith("prd-")).length).toBeGreaterThan(1);
  });
});

describe("e2e: criteria", () => {
  it("--list prints the WCAG success criteria", () => {
    const r = runCli(["criteria", "--list"]);
    expect(r.code).toBe(0);
    expect(r.stdout).toMatch(/success criteria/i);
  });
  it("--json emits a parseable array", () => {
    const r = runCli(["criteria", "--json"]);
    expect(r.code).toBe(0);
    expect(Array.isArray(JSON.parse(r.stdout))).toBe(true);
  });
});

describe("e2e: fix (dry-run) leaves the file byte-identical", () => {
  it("a default (no --write) fix does not modify the source", () => {
    const dir = mkTmp();
    const f = join(dir, "page.html");
    const before = `<!doctype html><html><head><title>t</title></head><body><main><img src="x"></main></body></html>`;
    writeFileSync(f, before);
    const r = runCli(["fix", f]); // dry-run by default
    expect(r.code).toBe(0);
    expect(readFileSync(f, "utf8")).toBe(before);
  });
});

describe("e2e: render prints a setup recipe", () => {
  it("render --json reports framework detection", () => {
    const r = runCli(["render", ".", "--json"]);
    expect(r.code).toBe(0);
    expect(() => JSON.parse(r.stdout)).not.toThrow();
  });
});

describe("e2e: init --help is inert (no files written)", () => {
  it("writes nothing", () => {
    const dir = mkTmp();
    const r = runCli(["init", "--help"], { cwd: dir });
    expect(r.code).toBe(0);
    expect(readdirSync(dir)).toEqual([]);
  });
});

describe("e2e: pack scaffold + check", () => {
  it("scaffold prints a valid pack the checker accepts", () => {
    const dir = mkTmp();
    const scaffold = runCli(["pack", "scaffold"]);
    expect(scaffold.code).toBe(0);
    const packPath = join(dir, "pack.json");
    writeFileSync(packPath, scaffold.stdout);
    expect(() => JSON.parse(scaffold.stdout)).not.toThrow();
    expect(runCli(["pack", "check", packPath]).code).toBe(0);
  });
});

// ---- new agent-adjudication surface ----
describe("e2e: verify --manual emits an adjudication worklist", () => {
  it("writes ADJUDICATE.todo.json + ADJUDICATE.md over the residual criteria", () => {
    const dir = mkTmp();
    const r = runCli(["verify", "--in", auditTo(dir), "--manual", "--out", dir, "--json"]);
    expect(r.code).toBe(0);
    expect(existsSync(join(dir, "ADJUDICATE.todo.json"))).toBe(true);
    const todo = JSON.parse(readFileSync(join(dir, "ADJUDICATE.todo.json"), "utf8"));
    expect(todo.kind).toBe("adjudication");
    expect(todo.items.length).toBeGreaterThan(0);
  });
});

describe("e2e: verify --apply is fail-closed on an unadjudicated file", () => {
  it("exits 1 on a worklist full of null verdicts", () => {
    const dir = mkTmp();
    const audit = auditTo(dir);
    expect(runCli(["verify", "--in", audit, "--manual", "--out", dir]).code).toBe(0);
    const r = runCli(["verify", "--apply", join(dir, "ADJUDICATE.todo.json"), "--in", audit, "--out", dir]);
    expect(r.code).toBe(1);
  });
  it("exits 2 when --apply is given without --in / --report (coverage cannot be established)", () => {
    const dir = mkTmp();
    const empty = join(dir, "empty.json");
    writeFileSync(empty, "[]");
    expect(runCli(["verify", "--apply", empty]).code).toBe(2);
  });
});

describe("e2e: check --semantic fails closed without a verdicts artifact", () => {
  it("exits 1 with an explicit message", () => {
    const dir = mkTmp();
    const audit = auditTo(dir);
    expect(runCli(["report", "--in", audit, "--out", dir, "--lang", "en"]).code).toBe(0);
    const reportPath = join(dir, readdirSync(dir).find((f) => f.startsWith("wcag-") && f.endsWith(".md"))!);
    const r = runCli(["check", "--report", reportPath, "--semantic"]);
    expect(r.code).toBe(1);
    expect((r.stdout + r.stderr).toLowerCase()).toMatch(/semantic/);
  });
});

describe("e2e: audit --out <file>.json writes that exact file (R6)", () => {
  it("treats a .json value as a file, not a directory", () => {
    const dir = mkTmp();
    const target = join(dir, "run.json");
    const r = runCli(["audit", FIX.good, "--out", target, "--json"]);
    expect(r.code).toBe(0);
    expect(existsSync(target)).toBe(true);
    expect(existsSync(join(target, "audit-latest.json"))).toBe(false);
  });
});
