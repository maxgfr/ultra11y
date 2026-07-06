import { describe, it, expect, vi, afterEach } from "vitest";
import { mkdtempSync, mkdirSync, writeFileSync, readFileSync, readdirSync, existsSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { parseStorybookIndex, storyProvenance } from "../src/render.js";
import { parseCaptureProvenance } from "../src/capture.js";
import { main } from "../src/cli.js";

afterEach(() => vi.restoreAllMocks());

describe("parseStorybookIndex", () => {
  it("reads Storybook 7 index.json entries and drops docs/MDX", () => {
    const json = JSON.stringify({
      v: 5,
      entries: {
        "components-button--primary": {
          id: "components-button--primary",
          title: "Components/Button",
          name: "Primary",
          importPath: "./src/Button.stories.tsx",
          type: "story",
        },
        "components-button--docs": {
          id: "components-button--docs",
          title: "Components/Button",
          name: "Docs",
          importPath: "./src/Button.stories.tsx",
          type: "docs",
        },
      },
    });
    const stories = parseStorybookIndex(json);
    expect(stories).toHaveLength(1);
    expect(stories[0]?.id).toBe("components-button--primary");
  });

  it("reads Storybook 6 stories.json (no type field)", () => {
    const json = JSON.stringify({
      v: 3,
      stories: { "ui-card--default": { id: "ui-card--default", title: "UI/Card", name: "Default", importPath: "./src/Card.stories.jsx" } },
    });
    expect(parseStorybookIndex(json)).toHaveLength(1);
  });

  it("returns [] on malformed JSON", () => {
    expect(parseStorybookIndex("{not json")).toEqual([]);
    expect(parseStorybookIndex("{}")).toEqual([]);
  });

  it("tolerates a null/garbage entry value (no crash)", () => {
    const json = JSON.stringify({ v: 5, entries: { "a--b": null, "c--d": { id: "c--d", importPath: "./src/C.stories.tsx", type: "story" } } });
    const stories = parseStorybookIndex(json);
    expect(stories).toHaveLength(1);
    expect(stories[0]?.id).toBe("c--d");
  });
});

describe("storyProvenance", () => {
  it("derives the source component file and name from importPath + title", () => {
    const prov = storyProvenance({ id: "x", title: "Components/Button", name: "Primary", importPath: "./src/Button.stories.tsx" });
    expect(prov?.sourceFile).toBe("src/Button.tsx"); // .stories stripped
    expect(prov?.component).toBe("Button"); // last title segment
    expect(prov?.name).toBe("Primary");
  });

  it("returns undefined without an importPath", () => {
    expect(storyProvenance({ id: "x", title: "T" })).toBeUndefined();
  });
});

describe("render --storybook (attribution post-processor)", () => {
  it("attributes per-story HTML to source components via the index", async () => {
    const err = vi.spyOn(console, "error").mockImplementation(() => {});
    const log = vi.spyOn(console, "log").mockImplementation(() => {});
    const cwd = process.cwd();
    const tmp = mkdtempSync(join(tmpdir(), "u11y-sb-"));
    try {
      const sb = join(tmp, "storybook-static");
      mkdirSync(sb, { recursive: true });
      writeFileSync(
        join(sb, "index.json"),
        JSON.stringify({
          v: 5,
          entries: {
            "components-button--primary": {
              id: "components-button--primary",
              title: "Components/Button",
              name: "Primary",
              importPath: "./src/Button.stories.tsx",
              type: "story",
            },
          },
        }),
      );
      writeFileSync(join(sb, "components-button--primary.html"), '<button class="fr-btn"></button>');
      writeFileSync(join(sb, "iframe.html"), "<html><body>shell</body></html>"); // unmatched → skipped

      process.chdir(tmp);
      const code = await main(["render", "storybook-static", "--storybook", "--json"]);
      expect(code).toBe(0);

      const outDir = join(tmp, ".ultra11y/captures");
      const files = readdirSync(outDir);
      expect(files).toContain("components-button--primary.html");
      const html = readFileSync(join(outDir, "components-button--primary.html"), "utf8");
      const prov = parseCaptureProvenance(html);
      expect(prov?.sourceFile).toBe("src/Button.tsx");
      expect(prov?.component).toBe("Button");
      expect(html).toContain('<button class="fr-btn"></button>'); // original markup preserved
    } finally {
      process.chdir(cwd);
      rmSync(tmp, { recursive: true, force: true });
      log.mockRestore();
      err.mockRestore();
    }
  });

  it("attributes a prefixed filename to the correct (longest, boundary-matched) story — no substring collision", async () => {
    vi.spyOn(console, "error").mockImplementation(() => {});
    vi.spyOn(console, "log").mockImplementation(() => {});
    const cwd = process.cwd();
    const tmp = mkdtempSync(join(tmpdir(), "u11y-sbc-"));
    try {
      const sb = join(tmp, "storybook-static");
      mkdirSync(sb, { recursive: true });
      writeFileSync(
        join(sb, "index.json"),
        JSON.stringify({
          v: 5,
          entries: {
            "button--primary": { id: "button--primary", title: "Components/Button", importPath: "./src/Button.stories.tsx", type: "story" },
            "iconbutton--primary": { id: "iconbutton--primary", title: "Components/IconButton", importPath: "./src/IconButton.stories.tsx", type: "story" },
          },
        }),
      );
      // Prefixed filename (not an exact id) that ends with BOTH ids as raw substrings.
      writeFileSync(join(sb, "story-iconbutton--primary.html"), '<a href="/x"></a>');

      process.chdir(tmp);
      expect(await main(["render", "storybook-static", "--storybook", "--json"])).toBe(0);
      const files = readdirSync(join(tmp, ".ultra11y/captures"));
      expect(files).toEqual(["iconbutton--primary.html"]); // keyed by matched story id, not "button"
      const prov = parseCaptureProvenance(readFileSync(join(tmp, ".ultra11y/captures", "iconbutton--primary.html"), "utf8"));
      expect(prov?.sourceFile).toBe("src/IconButton.tsx"); // NOT src/Button.tsx
      expect(prov?.component).toBe("IconButton");
    } finally {
      process.chdir(cwd);
      rmSync(tmp, { recursive: true, force: true });
    }
  });

  it("exits 1 when there is no Storybook index", async () => {
    vi.spyOn(console, "error").mockImplementation(() => {});
    const tmp = mkdtempSync(join(tmpdir(), "u11y-sb2-"));
    try {
      expect(await main(["render", join(tmp, "nope"), "--storybook"])).toBe(1);
    } finally {
      rmSync(tmp, { recursive: true, force: true });
      expect(existsSync(tmp)).toBe(false);
    }
  });

  it("exits 1 (honest failure) when HTML candidates exist but NONE could be attributed — a bare `storybook build` never emits per-story HTML", async () => {
    const err = vi.spyOn(console, "error").mockImplementation(() => {});
    vi.spyOn(console, "log").mockImplementation(() => {});
    const cwd = process.cwd();
    const tmp = mkdtempSync(join(tmpdir(), "u11y-sb3-"));
    try {
      const sb = join(tmp, "storybook-static");
      mkdirSync(sb, { recursive: true });
      // A story entry with no importPath (storyProvenance() → undefined — realistic for
      // a hand-rolled/older index) and a candidate HTML file that can't match anything.
      writeFileSync(
        join(sb, "index.json"),
        JSON.stringify({
          v: 5,
          entries: { "components-button--primary": { id: "components-button--primary", title: "Components/Button", name: "Primary", type: "story" } },
        }),
      );
      writeFileSync(join(sb, "iframe.html"), "<html><body>shell</body></html>"); // the typical bare-build shell, not per-story HTML

      process.chdir(tmp);
      const code = await main(["render", "storybook-static", "--storybook"]);
      expect(code).toBe(1);
      expect(err.mock.calls.some((c) => String(c[0]).includes("@storybook/test-runner"))).toBe(true);
      expect(existsSync(join(tmp, ".ultra11y/captures"))).toBe(false); // nothing was written
    } finally {
      process.chdir(cwd);
      rmSync(tmp, { recursive: true, force: true });
    }
  });

  it("--json carries the same remedy when 0 attributed but candidates existed (still exit 1)", async () => {
    vi.spyOn(console, "error").mockImplementation(() => {});
    const log = vi.spyOn(console, "log").mockImplementation(() => {});
    const cwd = process.cwd();
    const tmp = mkdtempSync(join(tmpdir(), "u11y-sb4-"));
    try {
      const sb = join(tmp, "storybook-static");
      mkdirSync(sb, { recursive: true });
      writeFileSync(join(sb, "index.json"), JSON.stringify({ v: 5, entries: { "a--b": { id: "a--b", title: "A/B", name: "B", type: "story" } } }));
      writeFileSync(join(sb, "iframe.html"), "<html><body>shell</body></html>");

      process.chdir(tmp);
      const code = await main(["render", "storybook-static", "--storybook", "--json"]);
      expect(code).toBe(1);
      const out = JSON.parse(log.mock.calls[0]?.[0] as string);
      expect(out.attributed).toBe(0);
      expect(typeof out.remedy).toBe("string");
      expect(out.remedy).toContain("@storybook/test-runner");
    } finally {
      process.chdir(cwd);
      rmSync(tmp, { recursive: true, force: true });
    }
  });

  it("exits 0 with the current message when there is simply no per-story HTML at all (nothing to attribute)", async () => {
    vi.spyOn(console, "error").mockImplementation(() => {});
    vi.spyOn(console, "log").mockImplementation(() => {});
    const cwd = process.cwd();
    const tmp = mkdtempSync(join(tmpdir(), "u11y-sb5-"));
    try {
      const sb = join(tmp, "storybook-static");
      mkdirSync(sb, { recursive: true });
      writeFileSync(join(sb, "index.json"), JSON.stringify({ v: 5, entries: {} }));
      // No .html files under sb at all.
      process.chdir(tmp);
      expect(await main(["render", "storybook-static", "--storybook"])).toBe(0);
    } finally {
      process.chdir(cwd);
      rmSync(tmp, { recursive: true, force: true });
    }
  });
});
