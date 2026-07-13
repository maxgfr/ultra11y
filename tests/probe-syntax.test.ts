// CI-level probe-string guard (same spirit as capture-escape-sync.test.ts): the local
// dynamic runtime evaluates browser-context code AS STRINGS (src/scan-local.ts's
// PRELUDE/probe/step constants + parameterized builders), and every page.evaluate is
// wrapped in a `.catch(() => [])` — so a syntax typo in a probe string would silently
// yield zero findings at scan time instead of failing. This browser-free test compiles
// EVERY probe source via `new Function` (compiled, never called — nothing executes, no
// DOM needed): a typo fails CI here. probeSources() bakes representative arguments into
// the builders and must list every new probe/step added to the runtime.
import { describe, it, expect } from "vitest";
import { probeSources, clicksAllowed } from "../src/scan-local.js";

const sources = probeSources();
const names = Object.keys(sources);

describe("scan-local probe strings — every string-evaluated expression parses (browser-free)", () => {
  it("probeSources() lists the full probe surface (pre-existing + Task-4 stateful)", () => {
    // 10 pre-existing entries + 9 stateful ones (builders instantiated per variant); a
    // probe added without listing it (or removed) is a conscious update, never silent.
    expect(names.length).toBeGreaterThanOrEqual(19);
    for (const expected of [
      "REFLOW_PROBE",
      "REFLOW_ZOOM_PROBE",
      "TEXT_SPACING_PROBE",
      "FOCUS_CHECK_PROBE",
      "HOVER_SETUP_PROBE",
      "FILL_INPUTS_STEP",
      "RESTORE_INPUTS_STEP",
      "OPEN_DIALOGS_STEP",
      "CLOSE_DIALOGS_STEP",
    ]) {
      expect(names, `probeSources() must list ${expected}`).toContain(expected);
    }
  });

  it.each(names)("%s compiles via new Function (syntax-valid JS)", (name) => {
    const src = sources[name]!;
    expect(src.trim().length).toBeGreaterThan(0);
    // `new Function` COMPILES the body at construction — a SyntaxError throws here —
    // but the body only runs when the function is CALLED, which we never do (the
    // sources reference document/window and must not execute in Node).
    expect(() => new Function(`return (${src});`)).not.toThrow();
  });
});

describe("live-region click policy (authenticated-scan safety)", () => {
  it("clicksAllowed: clicks ON for unauthenticated scans, OFF with a storageState, back ON with --interact-clicks", () => {
    expect(clicksAllowed(undefined, undefined)).toBe(true); // unauthenticated default
    expect(clicksAllowed(undefined, true)).toBe(true);
    expect(clicksAllowed(".auth/user.json", undefined)).toBe(false); // authenticated default
    expect(clicksAllowed(".auth/user.json", false)).toBe(false);
    expect(clicksAllowed(".auth/user.json", true)).toBe(true); // explicit opt-in
  });

  it("the noClicks variant carries NO button-click loop; the clicks variant does, with the destructive-name skip", () => {
    const withClicks = sources["liveRegionExpr(clicks)"]!;
    const noClicks = sources["liveRegionExpr(noClicks)"]!;
    expect(withClicks).toContain('button[type="button"]');
    expect(withClicks).toMatch(/supprim.*delete|delete.*supprim/); // fr + en destructive verbs present
    expect(noClicks).not.toContain('button[type="button"]');
    // fill/toggle interactions (the confirmed real-world need) remain in BOTH variants
    for (const s of [withClicks, noClicks]) {
      expect(s).toContain('input[type="checkbox"], input[type="radio"]');
      expect(s).toContain("MutationObserver");
    }
  });

  it("no probe source ever clicks a link or a submit button", () => {
    for (const name of names) {
      const src = sources[name]!;
      // the only .click() calls target button[type=button] / checkbox / radio — never
      // an <a> or a submit control; and no probe ever calls submit()/requestSubmit().
      expect(src, `${name} must not submit forms`).not.toMatch(/\.(submit|requestSubmit)\s*\(/);
      expect(src, `${name} must not query links for interaction`).not.toMatch(/querySelectorAll\(\s*['"]a[\s['"]/);
      expect(src, `${name} must not click submit buttons`).not.toMatch(/type=["']?submit/);
    }
  });
});
