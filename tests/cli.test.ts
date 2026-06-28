import { describe, it, expect, vi, afterEach } from "vitest";
import { writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { main, parseArgs } from "../src/cli.js";
import { VERSION } from "../src/types.js";

const FIX = new URL("./fixtures/", import.meta.url).pathname;

function capture() {
  const out: string[] = [];
  const err: string[] = [];
  const lo = vi.spyOn(console, "log").mockImplementation((...a: unknown[]) => void out.push(a.join(" ")));
  const le = vi.spyOn(console, "error").mockImplementation((...a: unknown[]) => void err.push(a.join(" ")));
  return {
    out,
    err,
    restore: () => {
      lo.mockRestore();
      le.mockRestore();
    },
  };
}
async function run(argv: string[]): Promise<{ code: number; out: string; err: string }> {
  const c = capture();
  const code = await main(argv);
  c.restore();
  return { code, out: c.out.join("\n"), err: c.err.join("\n") };
}

afterEach(() => vi.restoreAllMocks());

describe("parseArgs", () => {
  it("splits command, positionals and value/boolean flags", () => {
    const p = parseArgs(["audit", "a.html", "-", "--out", "x", "--jsx", "--json"]);
    expect(p.command).toBe("audit");
    expect(p.positionals).toEqual(["a.html", "-"]);
    expect(p.flags.out).toBe("x");
    expect(p.flags.jsx).toBe(true);
  });
});

describe("main — help / version / unknown", () => {
  it("--help lists all five commands", async () => {
    const r = await run(["--help"]);
    expect(r.code).toBe(0);
    for (const c of ["audit", "report", "criteria", "check", "verify"]) expect(r.out).toContain(c);
  });
  it("--version prints VERSION", async () => {
    const r = await run(["--version"]);
    expect(r.out.trim()).toBe(VERSION);
  });
  it("unknown command exits 2", async () => {
    expect((await run(["frobnicate"])).code).toBe(2);
  });
});

describe("main — command wiring", () => {
  it("audit a fixture returns 0 and prints JSON with --json", async () => {
    const r = await run(["audit", `${FIX}conforming/good.html`, "--out", join(tmpdir(), "u11y-cli"), "--json"]);
    expect(r.code).toBe(0);
    expect(JSON.parse(r.out).tool).toBe("ultra11y");
  });
  it("report without --in exits 2", async () => {
    expect((await run(["report"])).code).toBe(2);
  });
  it("check without --report exits 2", async () => {
    expect((await run(["check"])).code).toBe(2);
  });
  it("criteria --list returns the 13 themes", async () => {
    const r = await run(["criteria", "--list"]);
    expect(r.code).toBe(0);
    expect(r.out).toContain("13 thématiques");
  });
  it("criteria with an unknown theme exits 2", async () => {
    expect((await run(["criteria", "--theme", "99"])).code).toBe(2);
  });
  it("--lang en switches the criteria list language", async () => {
    const r = await run(["criteria", "--list", "--lang", "en"]);
    expect(r.out).toContain("13 themes");
  });
});

describe("init — --baseline is a boolean selector, not a value flag", () => {
  it("init --baseline does not swallow the following token", () => {
    const p = parseArgs(["init", "--baseline", "--hook"]);
    expect(p.flags.baseline).toBe(true);
    expect(p.flags.hook).toBe(true);
  });
  it("init --baseline alone selects baseline only", () => {
    const p = parseArgs(["init", "--baseline"]);
    expect(p.flags.baseline).toBe(true);
  });
  it("init --ci --baseline --fail-on majeur keeps fail-on as its value", () => {
    const p = parseArgs(["init", "--ci", "--baseline", "--fail-on", "majeur"]);
    expect(p.flags.ci).toBe(true);
    expect(p.flags.baseline).toBe(true);
    expect(p.flags["fail-on"]).toBe("majeur");
  });
  it("audit --baseline still consumes its path value", () => {
    const p = parseArgs(["audit", "x.html", "--baseline", "bl.json"]);
    expect(p.flags.baseline).toBe("bl.json");
  });
});

describe("subcommand --help is intercepted (no side effects)", () => {
  it("check --help prints help and exits 0 (instead of erroring on missing --report)", async () => {
    const r = await run(["check", "--help"]);
    expect(r.code).toBe(0);
    expect(r.out).toContain("Usage:");
  });
  it("verify -h prints help and exits 0", async () => {
    const r = await run(["verify", "-h"]);
    expect(r.code).toBe(0);
    expect(r.out).toContain("Usage:");
  });
});

describe("audit --fail-on gates a standalone audit (no --baseline)", () => {
  it("exits 1 when blocking NCs exist", async () => {
    const r = await run(["audit", `${FIX}non-conforming/bad.html`, "--fail-on", "bloquant"]);
    expect(r.code).toBe(1);
  });
  it("exits 0 on a conforming file", async () => {
    const r = await run(["audit", `${FIX}conforming/good.html`, "--fail-on", "bloquant"]);
    expect(r.code).toBe(0);
  });
  it("still exits 0 without --fail-on even with NCs", async () => {
    const r = await run(["audit", `${FIX}non-conforming/bad.html`, "--out", join(tmpdir(), "u11y-cli2"), "--json"]);
    expect(r.code).toBe(0);
  });
});

describe("verify — input validation hardening", () => {
  it("--apply on a missing file reports not-found and exits 2", async () => {
    const r = await run(["verify", "--apply", join(tmpdir(), "u11y-nope.json")]);
    expect(r.code).toBe(2);
    expect(r.err.toLowerCase()).toContain("introuvable");
  });
  it("--apply on non-array JSON exits 2 cleanly (no TypeError)", async () => {
    const f = join(tmpdir(), "u11y-apply-obj.json");
    writeFileSync(f, '{"verdict":"refuted"}');
    const r = await run(["verify", "--apply", f]);
    expect(r.code).toBe(2);
    expect(r.err).not.toContain("filter is not a function");
  });
  it("--max-verify with a non-numeric value exits 2 (no false-clean worklist)", async () => {
    const r = await run(["verify", "--report", `${FIX}non-conforming/bad.html`, "--max-verify", "abc", "--out", join(tmpdir(), "u11y-mv")]);
    expect(r.code).toBe(2);
  });
});
