import { describe, it, expect } from "vitest";
import { validatePack, classifySc } from "../src/standards/validate.js";

// A minimal, valid StandardPack to mutate per-case.
function base(): Record<string, unknown> {
  return {
    key: "mypack",
    name: "MyPack",
    org: "Org",
    country: "XX",
    baseVersion: "1.0",
    wcagVersion: "2.2",
    locales: ["en"],
    defaultLocale: "en",
    license: "x",
    source: "https://x",
    attribution: "x",
    idPattern: "^\\d+\\.\\d+$",
    themes: [{ number: 1, name: { en: "Images" }, count: 1 }],
    criteria: [{ id: "1.1", theme: 1, title: { en: "Alt" }, titlePlain: { en: "Alt" }, wcag: ["1.1.1"] }],
  };
}
const errs = (r: ReturnType<typeof validatePack>) => r.issues.filter((i) => i.severity === "error");
const warns = (r: ReturnType<typeof validatePack>) => r.issues.filter((i) => i.severity === "warn");

describe("validatePack", () => {
  it("accepts a clean pack and lower-cases the key", () => {
    const r = validatePack({ ...base(), key: "MyPack" });
    expect(r.ok).toBe(true);
    expect(r.pack?.key).toBe("mypack");
  });

  it("rejects the reserved core key", () => {
    expect(validatePack({ ...base(), key: "wcag" }).ok).toBe(false);
  });

  it("errors on a known-key collision unless allowOverride", () => {
    const known = new Set(["mypack"]);
    expect(validatePack(base(), { knownKeys: known }).ok).toBe(false);
    const overridden = validatePack(base(), { knownKeys: known, allowOverride: true });
    expect(overridden.ok).toBe(true);
    expect(warns(overridden).some((w) => /override/.test(w.message))).toBe(true);
  });

  it("rejects a non-compiling idPattern", () => {
    expect(validatePack({ ...base(), idPattern: "[" }).ok).toBe(false);
  });

  it("rejects a fabricated SC but only warns on the removed 4.1.1", () => {
    const fabricated = validatePack({ ...base(), criteria: [{ id: "1.1", theme: 1, title: { en: "x" }, titlePlain: { en: "x" }, wcag: ["9.9.9"] }] });
    expect(fabricated.ok).toBe(false);
    const legacy = validatePack({ ...base(), criteria: [{ id: "1.1", theme: 1, title: { en: "x" }, titlePlain: { en: "x" }, wcag: ["4.1.1"] }] });
    expect(legacy.ok).toBe(true);
    expect(warns(legacy).some((w) => w.message.includes("4.1.1"))).toBe(true);
  });

  it("errors on a theme count that disagrees with the criteria", () => {
    expect(validatePack({ ...base(), themes: [{ number: 1, name: { en: "Images" }, count: 7 }] }).ok).toBe(false);
  });

  it("errors on duplicate criterion ids and a missing required field", () => {
    const dup = base();
    (dup.criteria as unknown[]).push({ id: "1.1", theme: 1, title: { en: "y" }, titlePlain: { en: "y" }, wcag: ["1.1.1"] });
    (dup.themes as Array<{ count: number }>)[0]!.count = 2;
    expect(errs(validatePack(dup)).some((e) => /duplicate/.test(e.message))).toBe(true);
    const { name: _drop, ...noName } = base();
    expect(validatePack(noName).ok).toBe(false);
  });

  it("warns when a criterion id is not the 2-segment gate grammar", () => {
    const r = validatePack({
      ...base(),
      idPattern: "^E?\\d+(\\.\\d+)*$",
      criteria: [{ id: "E205.4", theme: 1, title: { en: "x" }, titlePlain: { en: "x" }, wcag: ["1.1.1"] }],
    });
    expect(r.ok).toBe(true);
    expect(warns(r).some((w) => /check.*verify|grammar|gate/i.test(w.message))).toBe(true);
  });
});

describe("classifySc", () => {
  it("classifies core / legit / unknown / malformed", () => {
    expect(classifySc("1.1.1")).toBe("core");
    expect(classifySc("4.1.1")).toBe("legit");
    expect(classifySc("9.9.9")).toBe("unknown");
    expect(classifySc("1.1")).toBe("malformed");
  });
});
