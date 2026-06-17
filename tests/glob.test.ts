import { describe, it, expect, beforeAll, afterAll } from "vitest";
import { mkdtempSync, writeFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { expandInputs } from "../src/glob.js";

describe("expandInputs file-type coverage", () => {
  let dir: string;
  beforeAll(() => {
    dir = mkdtempSync(join(tmpdir(), "ultra11y-glob-"));
    writeFileSync(join(dir, "page.html"), "<p>x</p>");
    writeFileSync(join(dir, "Comp.vue"), "<template><img src='x'></template>");
    writeFileSync(join(dir, "Card.svelte"), "<img src='x'>");
    writeFileSync(join(dir, "Page.astro"), "<img src='x'>");
    writeFileSync(join(dir, "tpl.twig"), "<img src='x'>");
    writeFileSync(join(dir, "notes.md"), "# hi");
    writeFileSync(join(dir, "app.js"), "const x = 1;");
  });
  afterAll(() => rmSync(dir, { recursive: true, force: true }));

  it("walks Vue/Svelte/Astro single-file components by default", () => {
    const files = expandInputs([dir]);
    expect(files.some((f) => f.endsWith("Comp.vue"))).toBe(true);
    expect(files.some((f) => f.endsWith("Card.svelte"))).toBe(true);
    expect(files.some((f) => f.endsWith("Page.astro"))).toBe(true);
  });

  it("keeps HTML and excludes non-markup (.js, .md) and server templates by default", () => {
    const files = expandInputs([dir]);
    expect(files.some((f) => f.endsWith("page.html"))).toBe(true);
    expect(files.some((f) => f.endsWith("app.js"))).toBe(false);
    expect(files.some((f) => f.endsWith("notes.md"))).toBe(false);
    expect(files.some((f) => f.endsWith("tpl.twig"))).toBe(false);
  });

  it("opts in to extra extensions via ext (e.g. server templates), normalising a bare ext", () => {
    const files = expandInputs([dir], { ext: ["twig"] });
    expect(files.some((f) => f.endsWith("tpl.twig"))).toBe(true);
  });

  it("splits a comma-separated ext value like the include/exclude flags do", () => {
    const files = expandInputs([dir], { ext: [".twig,.md"] });
    expect(files.some((f) => f.endsWith("tpl.twig"))).toBe(true);
    expect(files.some((f) => f.endsWith("notes.md"))).toBe(true);
  });

  it("a broad glob honours the markup allowlist (no .js/.md leak)", () => {
    const files = expandInputs([`${dir}/*`]);
    expect(files.some((f) => f.endsWith("page.html"))).toBe(true);
    expect(files.some((f) => f.endsWith("app.js"))).toBe(false);
    expect(files.some((f) => f.endsWith("notes.md"))).toBe(false);
  });

  it("excludes an explicit non-markup file unless its ext is opted in", () => {
    expect(expandInputs([join(dir, "app.js")])).toEqual([]);
    expect(expandInputs([join(dir, "app.js")], { ext: [".js"] })).toEqual([join(dir, "app.js")]);
  });
});
