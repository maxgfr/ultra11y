import { describe, it, expect } from "vitest";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const REFS = join(dirname(fileURLToPath(import.meta.url)), "..", "skills/ultra11y/references");
const read = (f: string): string => readFileSync(join(REFS, f), "utf8");

describe("audit.md teaches the audit → report → check loop", () => {
  const t = read("audit.md");
  it("walks audit, report and check, and names residual risk", () => {
    expect(t).toMatch(/ultra11y\.mjs audit/);
    expect(t).toMatch(/ultra11y\.mjs report/);
    expect(t).toMatch(/ultra11y\.mjs check/);
    expect(t).toMatch(/résidu/i);
  });
});

describe("authoring.md teaches native-first / ARIA-last", () => {
  const t = read("authoring.md");
  it("states the doctrine", () => {
    expect(t).toMatch(/natif|native/i);
    expect(t).toContain("ARIA");
  });
});

describe("forbidden-patterns.md covers the 15 anti-patterns", () => {
  const t = read("forbidden-patterns.md");
  it("has 15 entries", () => {
    expect((t.match(/^### /gm) ?? []).length).toBe(15);
  });
});

describe("methodology.md states the formula and the static/rendering/judgment split", () => {
  const t = read("methodology.md");
  it("gives the conformance formula", () => {
    expect(t).toContain("÷");
  });
  it("names the three automatability tiers", () => {
    expect(t).toMatch(/statique/i);
    expect(t).toMatch(/rendu/i);
    expect(t).toMatch(/jugement/i);
  });
});

describe("verify.md teaches the verify gate", () => {
  const t = read("verify.md");
  it("covers the command, --semantic and the verdict tokens", () => {
    expect(t).toMatch(/ultra11y\.mjs verify/);
    expect(t).toContain("--semantic");
    expect(t).toMatch(/supported/);
    expect(t).toMatch(/refuted/);
    expect(t).toMatch(/unsupported/);
  });
});
