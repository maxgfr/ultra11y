import { describe, it, expect, vi, afterEach } from "vitest";
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
  return { out, err, restore: () => (lo.mockRestore(), le.mockRestore()) };
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
    expect(p.flags["out"]).toBe("x");
    expect(p.flags["jsx"]).toBe(true);
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
