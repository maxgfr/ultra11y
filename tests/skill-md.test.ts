import { describe, it, expect } from "vitest";
import { execFileSync } from "node:child_process";
import { readFileSync, readdirSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { parse } from "yaml";
import { VERSION } from "../src/types.js";

// Guards that the published SKILL.md stays installable via `npx skills add` and
// that its docs never drift from the CLI they describe.
const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const FRONTMATTER_RE = /^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/;
const SKILL_DIR = "skills/ultra11y";
const REFS_DIR = join(ROOT, SKILL_DIR, "references");

const pkg = JSON.parse(readFileSync(join(ROOT, "package.json"), "utf8")) as { version: string };
const raw = readFileSync(join(ROOT, SKILL_DIR, "SKILL.md"), "utf8");
const match = raw.match(FRONTMATTER_RE);
const frontmatter = match?.[1] ?? "";
const body = match?.[2] ?? "";
const refFiles = readdirSync(REFS_DIR).filter((f) => f.endsWith(".md"));
const refBodies = Object.fromEntries(refFiles.map((f) => [f, readFileSync(join(REFS_DIR, f), "utf8")]));

describe("SKILL.md is installable", () => {
  it("is the only skill", () => {
    expect(readdirSync(join(ROOT, "skills"))).toEqual(["ultra11y"]);
  });

  it("has a frontmatter block that parses as YAML", () => {
    expect(match).not.toBeNull();
    expect(() => parse(frontmatter)).not.toThrow();
  });

  it("exposes name 'ultra11y' and a non-empty description", () => {
    const data = parse(frontmatter) as Record<string, unknown>;
    expect(data.name).toBe("ultra11y");
    expect(typeof data.description).toBe("string");
    expect((data.description as string).length).toBeGreaterThan(0);
  });

  it("describes BOTH scopes (audit AND author/review)", () => {
    const description = (parse(frontmatter) as { description: string }).description;
    expect(description).toMatch(/audit/i);
    expect(description).toMatch(/author|accessible|review/i);
  });

  it("keeps version in lockstep with package.json and src/types.ts", () => {
    const data = parse(frontmatter) as { metadata?: { version?: string } };
    expect(data.metadata?.version).toBe(pkg.version);
    expect(VERSION).toBe(pkg.version);
  });
});

const CLI_COMMANDS = new Set(["audit", "report", "prd", "render", "criteria", "check", "verify", "scan", "fix", "init"]);

describe("skill docs stay in sync with the CLI", () => {
  const docs: [string, string][] = [["SKILL.md", body], ...Object.entries(refBodies)];

  it.each(docs)("%s only references commands the CLI actually has", (_name, text) => {
    for (const m of text.matchAll(/ultra11y\.mjs\s+([a-z-]+)/g)) {
      expect(CLI_COMMANDS.has(m[1]!), `references unknown command "${m[1]}"`).toBe(true);
    }
  });

  it("teaches the machine-readable surface (--json)", () => {
    expect(body).toContain("--json");
  });

  it("documents every CLI flag the skill mentions (guards help-text drift)", () => {
    const help = execFileSync(process.execPath, [join(ROOT, "scripts/ultra11y.mjs"), "--help"], { encoding: "utf8" });
    const docText = [body, ...Object.values(refBodies)].join("\n");
    const flags = new Set(docText.match(/--[a-z][a-z-]+/g) ?? []);
    for (const f of flags) {
      expect(help.includes(f), `--help omits ${f}, which the skill documents`).toBe(true);
    }
  });
});

describe("SKILL.md routes to the references (progressive disclosure)", () => {
  it("ships exactly the sixteen reference docs", () => {
    expect(refFiles.sort()).toEqual([
      "audit.md",
      "authoring.md",
      "automation.md",
      "correction.md",
      "criteria.md",
      "cross-file.md",
      "dynamic.md",
      "fix.md",
      "forbidden-patterns.md",
      "judgment.md",
      "methodology.md",
      "prd.md",
      "rendered.md",
      "scale.md",
      "standards.md",
      "verify.md",
    ]);
  });

  it("mentions every reference file that exists", () => {
    for (const f of refFiles) {
      expect(body, `SKILL.md never routes to references/${f}`).toContain(`references/${f}`);
    }
  });
});
