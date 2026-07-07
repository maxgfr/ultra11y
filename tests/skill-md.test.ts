import { describe, it, expect } from "vitest";
import { execFileSync } from "node:child_process";
import { readFileSync, readdirSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { parse } from "yaml";
import { VERSION } from "../src/types.js";

// Guards that the published skills stay installable via `npx skills add` and
// that their docs never drift from the CLI they describe.
const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const FRONTMATTER_RE = /^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/;
const SKILL_NAMES = ["review-a11y", "ultra11y"];
const REFS_DIR = join(ROOT, "skills/ultra11y", "references");

const pkg = JSON.parse(readFileSync(join(ROOT, "package.json"), "utf8")) as { version: string };
const skills = Object.fromEntries(
  SKILL_NAMES.map((name) => {
    const raw = readFileSync(join(ROOT, "skills", name, "SKILL.md"), "utf8");
    const match = raw.match(FRONTMATTER_RE);
    return [name, { raw, frontmatter: match?.[1] ?? "", body: match?.[2] ?? "", matched: match !== null }];
  }),
);
const body = skills.ultra11y!.body;
const refFiles = readdirSync(REFS_DIR).filter((f) => f.endsWith(".md"));
const refBodies = Object.fromEntries(refFiles.map((f) => [f, readFileSync(join(REFS_DIR, f), "utf8")]));

describe("the skills are installable", () => {
  it("ships exactly the two skills", () => {
    expect(readdirSync(join(ROOT, "skills")).sort()).toEqual(SKILL_NAMES);
  });

  it.each(SKILL_NAMES)("%s has a frontmatter block that parses as YAML", (name) => {
    expect(skills[name]!.matched).toBe(true);
    expect(() => parse(skills[name]!.frontmatter)).not.toThrow();
  });

  it.each(SKILL_NAMES)("%s exposes its own name and a non-empty description", (name) => {
    const data = parse(skills[name]!.frontmatter) as Record<string, unknown>;
    expect(data.name).toBe(name);
    expect(typeof data.description).toBe("string");
    expect((data.description as string).length).toBeGreaterThan(0);
  });

  it("ultra11y describes BOTH scopes (audit AND author/review)", () => {
    const description = (parse(skills.ultra11y!.frontmatter) as { description: string }).description;
    expect(description).toMatch(/audit/i);
    expect(description).toMatch(/author|accessible|review/i);
  });

  it("review-a11y describes the review scope and its change-based scoping", () => {
    const description = (parse(skills["review-a11y"]!.frontmatter) as { description: string }).description;
    expect(description).toMatch(/review/i);
    expect(description).toMatch(/staged|diff|branch|change/i);
  });

  it.each(SKILL_NAMES)("%s keeps version in lockstep with package.json and src/types.ts", (name) => {
    const data = parse(skills[name]!.frontmatter) as { metadata?: { version?: string } };
    expect(data.metadata?.version).toBe(pkg.version);
    expect(VERSION).toBe(pkg.version);
  });
});

const CLI_COMMANDS = new Set(["audit", "report", "prd", "render", "criteria", "check", "verify", "scan", "fix", "init", "pack"]);

describe("skill docs stay in sync with the CLI", () => {
  const docs: [string, string][] = [["ultra11y/SKILL.md", body], ["review-a11y/SKILL.md", skills["review-a11y"]!.body], ...Object.entries(refBodies)];

  it.each(docs)("%s only references commands the CLI actually has", (_name, text) => {
    for (const m of text.matchAll(/ultra11y\.mjs\s+([a-z-]+)/g)) {
      expect(CLI_COMMANDS.has(m[1]!), `references unknown command "${m[1]}"`).toBe(true);
    }
  });

  it("teaches the machine-readable surface (--json)", () => {
    expect(body).toContain("--json");
    expect(skills["review-a11y"]!.body).toContain("--json");
  });

  it("documents every CLI flag the skills mention (guards help-text drift)", () => {
    const help = execFileSync(process.execPath, [join(ROOT, "scripts/ultra11y.mjs"), "--help"], { encoding: "utf8" });
    const docText = [body, skills["review-a11y"]!.body, ...Object.values(refBodies)].join("\n");
    const flags = new Set(docText.match(/--[a-z][a-z-]+/g) ?? []);
    for (const f of flags) {
      expect(help.includes(f), `--help omits ${f}, which the skills document`).toBe(true);
    }
  });
});

describe("SKILL.md routes to the references (progressive disclosure)", () => {
  it("ships exactly the twenty reference docs", () => {
    expect(refFiles.sort()).toEqual([
      "audit.md",
      "authoring.md",
      "automation.md",
      "correction.md",
      "criteria.md",
      "cross-file.md",
      "dynamic.md",
      "false-positives.md",
      "fix.md",
      "focus-and-logic.md",
      "forbidden-patterns.md",
      "guidance.md",
      "judgment.md",
      "methodology.md",
      "packs.md",
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
