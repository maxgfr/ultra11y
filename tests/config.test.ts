import { describe, it, expect } from "vitest";
import { mkdtempSync, mkdirSync, writeFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { loadConfig, loadRuntimeStandards } from "../src/config.js";
import { validateSample } from "../src/sample.js";
import { hasStandard } from "../src/standards/index.js";

const tmp = () => mkdtempSync(join(tmpdir(), "u11y-config-"));
// Each test uses a UNIQUE pack key — the registry is process-global and persists.
function packObj(key: string) {
  return {
    key,
    name: key,
    org: "O",
    country: "XX",
    baseVersion: "1",
    wcagVersion: "2.2",
    locales: ["en"],
    defaultLocale: "en",
    license: "x",
    source: "x",
    attribution: "x",
    idPattern: "^\\d+\\.\\d+$",
    themes: [{ number: 1, name: { en: "T" }, count: 1 }],
    criteria: [{ id: "1.1", theme: 1, title: { en: "C" }, titlePlain: { en: "C" }, wcag: ["1.1.1"] }],
  };
}

describe("loadConfig", () => {
  it("returns null when there is no .ultra11yrc.json, and throws on malformed JSON", () => {
    const d = tmp();
    try {
      expect(loadConfig(d)).toBeNull();
      writeFileSync(join(d, ".ultra11yrc.json"), "{ not json");
      expect(() => loadConfig(d)).toThrow();
    } finally {
      rmSync(d, { recursive: true, force: true });
    }
  });
});

describe("validateSample (normative page sample — Task 5)", () => {
  const validPage = { id: "accueil", name: "Page d'accueil", url: "https://example.fr/" };

  it("accepts a well-formed sample and keeps the storageState PATH in the normalized config", () => {
    const r = validateSample({
      pages: [
        validPage,
        {
          id: "compte",
          name: "Mon compte",
          url: "https://example.fr/compte",
          auth: true,
          storageState: "test-results/.auth/user.json",
          notes: "Se connecter d'abord.",
        },
      ],
      transverse: ["En-tête", "Navigation", "Pied de page"],
    });
    expect(r.ok).toBe(true);
    expect(r.issues).toEqual([]);
    expect(r.sample?.pages).toHaveLength(2);
    // storageState is a PATH, preserved in the config (its CONTENT is never read anywhere).
    expect(r.sample?.pages[1]?.storageState).toBe("test-results/.auth/user.json");
    expect(r.sample?.transverse).toEqual(["En-tête", "Navigation", "Pied de page"]);
  });

  it("hard-errors on a malformed URL", () => {
    const r = validateSample({ pages: [{ id: "x", name: "X", url: "not a url" }] });
    expect(r.ok).toBe(false);
    expect(r.sample).toBeUndefined();
    expect(r.issues.some((i) => i.path === "sample.pages[0].url")).toBe(true);
  });

  it("hard-errors on a missing name", () => {
    const r = validateSample({ pages: [{ id: "x", url: "https://example.fr/" }] });
    expect(r.ok).toBe(false);
    expect(r.issues.some((i) => i.path === "sample.pages[0].name")).toBe(true);
  });

  it("hard-errors on an empty pages array, a duplicate id, and a non-object sample", () => {
    expect(validateSample({ pages: [] }).ok).toBe(false);
    expect(validateSample("nope").ok).toBe(false);
    const dup = validateSample({ pages: [validPage, { ...validPage }] });
    expect(dup.ok).toBe(false);
    expect(dup.issues.some((i) => /duplicate/.test(i.message))).toBe(true);
  });
});

describe("loadRuntimeStandards", () => {
  it("registers a pack from .ultra11yrc.json and applies the default standard", () => {
    const d = tmp();
    try {
      writeFileSync(join(d, "cfgpack.json"), JSON.stringify(packObj("cfgpack")));
      writeFileSync(join(d, ".ultra11yrc.json"), JSON.stringify({ packs: ["cfgpack.json"], standard: "cfgpack" }));
      const r = loadRuntimeStandards(d, [], () => {});
      expect(r.errors).toEqual([]);
      expect(r.loadedPacks).toContain("cfgpack");
      expect(r.defaultStandard).toBe("cfgpack");
      expect(hasStandard("cfgpack")).toBe(true);
    } finally {
      rmSync(d, { recursive: true, force: true });
    }
  });

  it("hard-errors on a missing --pack path and on an invalid (fabricated-SC) pack", () => {
    const d = tmp();
    try {
      expect(loadRuntimeStandards(d, ["does-not-exist.json"], () => {}).errors.length).toBeGreaterThan(0);
      const bad = { ...packObj("badpack"), criteria: [{ id: "1.1", theme: 1, title: { en: "x" }, titlePlain: { en: "x" }, wcag: ["9.9.9"] }] };
      writeFileSync(join(d, "bad.json"), JSON.stringify(bad));
      const r = loadRuntimeStandards(d, ["bad.json"], () => {});
      expect(r.errors.length).toBeGreaterThan(0);
      expect(hasStandard("badpack")).toBe(false);
    } finally {
      rmSync(d, { recursive: true, force: true });
    }
  });

  it("errors on a built-in key collision unless --override is set", () => {
    const d = tmp();
    try {
      writeFileSync(join(d, "rgaa.json"), JSON.stringify(packObj("rgaa")));
      expect(loadRuntimeStandards(d, ["rgaa.json"], () => {}, false).errors.length).toBeGreaterThan(0);
      expect(loadRuntimeStandards(d, ["rgaa.json"], () => {}, true).errors).toEqual([]);
    } finally {
      rmSync(d, { recursive: true, force: true });
    }
  });

  it("gates runtime guidance the same way pack check does (bogus criterionId is a hard error)", () => {
    const d = tmp();
    const packDir = join(d, "gpack");
    mkdirSync(packDir, { recursive: true });
    try {
      writeFileSync(join(packDir, "pack.json"), JSON.stringify(packObj("gpack")));
      writeFileSync(
        join(packDir, "guidance.json"),
        JSON.stringify({
          pack: "gpack",
          source: "x",
          license: "x",
          attribution: "x",
          entries: [{ id: "r", criterionId: "7.42", wcag: ["1.1.1"], title: { en: "x" }, summary: { en: "x" }, examples: [], reference: "u" }],
        }),
      );
      const r = loadRuntimeStandards(d, [packDir], () => {});
      expect(r.errors.some((e) => /guidance/.test(e))).toBe(true);
    } finally {
      rmSync(d, { recursive: true, force: true });
    }
  });
});
