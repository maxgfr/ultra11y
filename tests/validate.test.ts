import { describe, it, expect } from "vitest";
import { validatePack, classifySc } from "../src/standards/validate.js";
import { neutralizeCaptureGroups } from "../src/standards/pack.js";

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

  it("rejects an idPattern with a nested quantifier (ReDoS shape)", () => {
    for (const bad of ["^(a+)+$", "^(a*)*$", "^(\\d+)+$", "(.*)+"]) {
      const r = validatePack({ ...base(), idPattern: bad });
      expect(r.ok, bad).toBe(false);
      expect(errs(r).some((e) => e.message.toLowerCase().includes("redos") || e.message.toLowerCase().includes("nested quantifier"))).toBe(true);
    }
    // a normal criterion-id grammar is still accepted
    expect(validatePack({ ...base(), idPattern: "^E?\\d+(\\.\\d+)*$" }).ok).toBe(true);
  });

  it("rejects a fabricated SC but only warns on the removed 4.1.1", () => {
    const fabricated = validatePack({ ...base(), criteria: [{ id: "1.1", theme: 1, title: { en: "x" }, titlePlain: { en: "x" }, wcag: ["9.9.9"] }] });
    expect(fabricated.ok).toBe(false);
    const legacy = validatePack({ ...base(), criteria: [{ id: "1.1", theme: 1, title: { en: "x" }, titlePlain: { en: "x" }, wcag: ["4.1.1"] }] });
    expect(legacy.ok).toBe(true);
    expect(warns(legacy).some((w) => w.message.includes("4.1.1"))).toBe(true);
  });

  it("also warns (never errors) on a real WCAG AAA success criterion — not just the removed 4.1.1", () => {
    // 1.4.6 Contrast (Enhanced) is a REAL WCAG AAA criterion, outside the shipped 2.2 AA
    // core: a second pack (EN 301 549, Section 508…) legitimately mapping to it must not
    // be rejected as fabricated — this is the whole point of the SC-universe classifier.
    const r = validatePack({ ...base(), criteria: [{ id: "1.1", theme: 1, title: { en: "x" }, titlePlain: { en: "x" }, wcag: ["1.4.6"] }] });
    expect(r.ok).toBe(true);
    expect(warns(r).some((w) => w.message.includes("1.4.6"))).toBe(true);
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

  it("accepts an arbitrary idPattern grammar (e.g. Section 508 E205.4) with no gate-compatibility warning", () => {
    // check.ts/verify.ts now build their citation regex FROM the pack's own idPattern
    // (see src/standards/pack.ts idCaptureSource) — any grammar is gate-compatible, so
    // this is no longer a warning-worthy shape.
    const r = validatePack({
      ...base(),
      idPattern: "^E?\\d+(\\.\\d+)*$",
      criteria: [{ id: "E205.4", theme: 1, title: { en: "x" }, titlePlain: { en: "x" }, wcag: ["1.1.1"] }],
    });
    expect(r.ok).toBe(true);
    expect(warns(r)).toHaveLength(0);
  });

  it("warns (not errors) when a pack carries neither fr nor en, and accepts a de-only pack", () => {
    const deOnly = {
      ...base(),
      locales: ["de"],
      defaultLocale: "de",
      themes: [{ number: 1, name: { de: "Bilder" }, count: 1 }],
      criteria: [{ id: "1.1", theme: 1, title: { de: "Alt" }, titlePlain: { de: "Alt" }, wcag: ["1.1.1"] }],
    };
    const r = validatePack(deOnly);
    expect(r.ok).toBe(true);
    expect(warns(r).some((w) => /fr.*en|neither/i.test(w.message))).toBe(true);
  });

  it("errors on a malformed locale tag but accepts any well-formed BCP-47-ish tag", () => {
    const bad = validatePack({ ...base(), locales: ["ENGLISH"], defaultLocale: "ENGLISH" });
    expect(errs(bad).some((e) => e.path === "locales")).toBe(true);
    const good = validatePack({ ...base(), locales: ["pt-BR", "en"], defaultLocale: "en" });
    expect(errs(good).some((e) => e.path === "locales")).toBe(false);
  });
});

describe("neutralizeCaptureGroups (idCaptureSource's capturing-group neutralizer)", () => {
  // check.ts/verify.ts embed idCaptureSource(pack) as ONE outer capture group inside a
  // larger positional-capture regex (title/file/line/selector read by index). A pack
  // idPattern that itself contains capturing groups (legal, and validatePack accepts it —
  // see the "arbitrary idPattern grammar" test above) would otherwise shift every
  // downstream index. The neutralizer must strip the pack pattern's OWN capturing groups
  // to non-capturing, while leaving its matching semantics byte-identical.
  const netGroupCount = (source: string, sample: string): number => {
    const m = new RegExp(source).exec(sample);
    return m ? m.length - 1 : -1; // -1 = did not match at all
  };

  it("neutralizes unescaped capturing groups to non-capturing, without changing what the pattern matches", () => {
    const cases: { pattern: string; matches: string[]; rejects: string[] }[] = [
      { pattern: "^E(\\d+)\\.(\\d+)$", matches: ["E205.4", "E12.34"], rejects: ["E205", "F205.4"] },
      { pattern: "^E?\\d+(\\.\\d+)*$", matches: ["205", "E205.4", "205.4.6"], rejects: ["E", "205.", "x1"] },
      { pattern: "\\(literal\\)", matches: ["(literal)", "prefix (literal) suffix"], rejects: ["literal"] },
      { pattern: "^(?:a|b)\\d$", matches: ["a5", "b9"], rejects: ["c5", "a"] },
    ];
    for (const { pattern, matches, rejects } of cases) {
      const neutralized = neutralizeCaptureGroups(pattern);
      for (const s of matches) expect(netGroupCount(neutralized, s)).toBe(0); // zero net capturing groups
      for (const s of [...matches, ...rejects]) expect(new RegExp(neutralized).test(s)).toBe(new RegExp(pattern).test(s)); // same match/reject
    }
  });

  it("leaves a pattern with no capturing groups byte-identical", () => {
    expect(neutralizeCaptureGroups("^\\d+\\.\\d+$")).toBe("^\\d+\\.\\d+$");
    expect(neutralizeCaptureGroups("^E?\\d+$")).toBe("^E?\\d+$");
  });
});

describe("classifySc", () => {
  it("classifies core / out-of-core / removed / unknown / malformed", () => {
    expect(classifySc("1.1.1")).toBe("core");
    expect(classifySc("4.1.1")).toBe("removed");
    expect(classifySc("1.4.6")).toBe("out-of-core"); // Contrast (Enhanced), a real WCAG AAA SC
    expect(classifySc("9.9.9")).toBe("unknown");
    expect(classifySc("1.1")).toBe("malformed");
  });
});
