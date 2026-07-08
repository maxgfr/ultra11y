import { describe, it, expect, beforeAll, afterAll } from "vitest";
import { mkdtempSync, writeFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
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
