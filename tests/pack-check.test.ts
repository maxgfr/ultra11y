import { describe, it, expect, beforeAll, afterAll } from "vitest";
import { mkdtempSync, writeFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { runPackCheck, packScaffold } from "../src/pack.js";

let dir: string;
const packPath = () => join(dir, "pack.json");
const write = (name: string, obj: unknown) => {
  const p = join(dir, name);
  writeFileSync(p, JSON.stringify(obj));
  return p;
};

beforeAll(() => {
  dir = mkdtempSync(join(tmpdir(), "u11y-packcheck-"));
  writeFileSync(packPath(), packScaffold()); // a valid skeleton: criterion "1.1" → wcag ["1.1.1"]
});
afterAll(() => rmSync(dir, { recursive: true, force: true }));

const guidance = (entries: unknown[]) => ({ pack: "mypack", source: "x", license: "x", attribution: "x", entries });

describe("runPackCheck", () => {
  it("the scaffold round-trips through its own validator", () => {
    expect(runPackCheck(packPath(), undefined).ok).toBe(true);
  });

  it("accepts guidance whose entries resolve to real criteria + SCs and parse", () => {
    const g = write(
      "ok.json",
      guidance([
        {
          id: "r",
          criterionId: "1.1",
          wcag: ["1.1.1"],
          title: { en: "x" },
          summary: { en: "x" },
          examples: [{ lang: "html", bad: "<img>", good: '<img alt="x">' }],
          reference: "u",
        },
      ]),
    );
    expect(runPackCheck(packPath(), g).ok).toBe(true);
  });

  it("rejects a guidance entry whose criterionId does not exist in the pack", () => {
    const g = write(
      "bad-crit.json",
      guidance([{ id: "r", criterionId: "7.42", wcag: ["1.1.1"], title: { en: "x" }, summary: { en: "x" }, examples: [], reference: "u" }]),
    );
    expect(runPackCheck(packPath(), g).ok).toBe(false);
  });

  it("rejects a fabricated SC in guidance", () => {
    const g = write(
      "bad-sc.json",
      guidance([{ id: "r", criterionId: "1.1", wcag: ["9.9.9"], title: { en: "x" }, summary: { en: "x" }, examples: [], reference: "u" }]),
    );
    expect(runPackCheck(packPath(), g).ok).toBe(false);
  });

  it("rejects an unparseable code example", () => {
    const g = write(
      "bad-ex.json",
      guidance([
        {
          id: "r",
          criterionId: "1.1",
          wcag: ["1.1.1"],
          title: { en: "x" },
          summary: { en: "x" },
          examples: [{ lang: "jsx", bad: "const = (<<<" }],
          reference: "u",
        },
      ]),
    );
    expect(runPackCheck(packPath(), g).ok).toBe(false);
  });
});

describe("runPackCheck — appliesTo ruleId sanity", () => {
  const packWith = (appliesTo: unknown) => {
    const scaffold = JSON.parse(packScaffold()) as Record<string, unknown>;
    (scaffold.criteria as Record<string, unknown>[])[0]!.appliesTo = appliesTo;
    return write("applies.json", scaffold);
  };
  it("accepts real engine ruleIds and axe:/dyn:/agent: prefixed ids", () => {
    const p = packWith({ ruleIds: ["img-alt-missing", "axe:image-alt", "dyn-reflow", "agent:1.1.1"] });
    expect(runPackCheck(p, undefined).ok).toBe(true);
  });
  it("warns (not errors) on a ruleId unknown to the engine registry", () => {
    const p = packWith({ ruleIds: ["totally-made-up-rule"] });
    const r = runPackCheck(p, undefined);
    expect(r.ok).toBe(true); // advisory only — a pack may target a future/renamed rule
    expect(r.warnings.some((w) => w.includes("totally-made-up-rule"))).toBe(true);
  });
});

describe("runPackCheck — declarative rules + overrides", () => {
  const okRule = () => ({
    id: "demo",
    criterion: "1.1",
    wcag: ["1.1.1"],
    severity: "mineur",
    advisory: true,
    match: { tag: "a", attrs: [{ name: "href", op: "matches", value: "\\.pdf$" }] },
    message: { en: "m", fr: "m" },
    remediation: { en: "x", fr: "x" },
  });
  const packWithRule = (over: Record<string, unknown>, extra: Record<string, unknown> = {}) => {
    const scaffold = JSON.parse(packScaffold()) as Record<string, unknown>;
    scaffold.rules = [{ ...okRule(), ...over }];
    Object.assign(scaffold, extra);
    return write("rule.json", scaffold);
  };

  it("accepts a pack with a well-formed rule", () => {
    expect(runPackCheck(packWithRule({}), undefined).ok).toBe(true);
  });
  it("rejects a rule reporting under a non-existent criterion", () => {
    expect(runPackCheck(packWithRule({ criterion: "9.9" }), undefined).ok).toBe(false);
  });
  it("rejects a fabricated SC in a rule", () => {
    expect(runPackCheck(packWithRule({ wcag: ["9.9.9"] }), undefined).ok).toBe(false);
  });
  it("rejects a ReDoS-shaped regex in a rule matcher", () => {
    expect(runPackCheck(packWithRule({ match: { tag: "a", text: { op: "matches", value: "(a+)+" } } }), undefined).ok).toBe(false);
  });
  it("rejects a rule missing a message language", () => {
    expect(runPackCheck(packWithRule({ message: { en: "only-en" } }), undefined).ok).toBe(false);
  });
  it("warns (not errors) on an override targeting an unknown ruleId, accepts one targeting the pack's own rule", () => {
    const r = runPackCheck(packWithRule({}, { overrides: { "pack:mypack:demo": { advisory: false }, "made-up": { severity: "majeur" } } }), undefined);
    expect(r.ok).toBe(true);
    expect(r.warnings.some((w) => w.includes("made-up"))).toBe(true);
    expect(r.warnings.some((w) => w.includes("pack:mypack:demo"))).toBe(false);
  });
});

describe("the built-in RGAA pack passes pack check with its declarative rule", () => {
  it("validates clean (the download-link rule + its appliesTo wiring)", () => {
    const rgaaPath = join(dirname(fileURLToPath(import.meta.url)), "..", "src", "data", "standards", "rgaa.json");
    const r = runPackCheck(rgaaPath, undefined);
    expect(r.ok, r.errors.join("\n")).toBe(true);
  });
});
