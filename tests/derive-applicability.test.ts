import { describe, it, expect } from "vitest";
import { mkdtempSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { runAudit } from "../src/audit.js";
import { derivePackResults, loadPack, registerRuntimePack } from "../src/standards/index.js";
import { toDynamicResult, mergeDynamic } from "../src/scan.js";

const dir = mkdtempSync(join(tmpdir(), "u11y-derive-"));
function auditHtml(html: string) {
  const f = join(dir, `page-${Math.abs(hash(html))}.html`);
  writeFileSync(f, html);
  return runAudit({ inputs: [f] });
}
// deterministic label helper (no Math.random / Date in tests here)
function hash(s: string): number {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) | 0;
  return h;
}

const statusOf = (rows: ReturnType<typeof derivePackResults>, id: string) => rows.find((r) => r.id === id)?.status;

describe("RGAA applicability — an image-alt NC no longer over-projects", () => {
  // A page whose ONLY failure is an informative <img> with no alt (WCAG 1.1.1).
  const audit = auditHtml(`<!doctype html><html lang="en"><head><title>t</title></head><body><main><h1>H</h1><img src="hero.png"></main></body></html>`);
  const rows = derivePackResults(audit, "rgaa");

  it("attaches the finding to RGAA 1.1 (informative image alternative) as NC", () => {
    expect(statusOf(rows, "1.1")).toBe("NC");
    const c11 = rows.find((r) => r.id === "1.1")!;
    expect(c11.findings.some((f) => f.ruleId === "img-alt-missing")).toBe(true);
  });

  it("leaves the plainly-inapplicable image criteria NON-NC (CAPTCHA 1.4/1.5, detailed-description 1.6/1.7)", () => {
    for (const id of ["1.4", "1.5", "1.6", "1.7"]) {
      expect(statusOf(rows, id), `RGAA ${id} must not be NC`).not.toBe("NC");
    }
  });

  it("leaves downloadable-document (13.3/13.4) and layout-table (5.3) criteria NON-NC", () => {
    for (const id of ["13.3", "13.4", "5.3"]) {
      expect(statusOf(rows, id), `RGAA ${id} must not be NC`).not.toBe("NC");
    }
  });

  it("a criterion whose mapped SC failed on out-of-scope elements derives as manual with a scoped justification (never a foreign finding)", () => {
    const c14 = rows.find((r) => r.id === "1.4")!;
    expect(c14.status).toBe("manual");
    expect(c14.findings).toHaveLength(0); // no img-alt finding leaks in
    expect(c14.scopedOut).toBe(true);
  });
});

describe("RGAA applicability — real per-element mapping holds across themes", () => {
  const audit = auditHtml(`<!doctype html><html><head></head><body><main><h1>H</h1><iframe src="x"></iframe></main></body></html>`);
  const rows = derivePackResults(audit, "rgaa");

  it("html-lang-missing → RGAA 8.3 (default language) NC, not other 3.1.1 criteria", () => {
    expect(statusOf(rows, "8.3")).toBe("NC");
  });

  it("iframe-title-missing → RGAA 2.1 (frame title) NC", () => {
    expect(statusOf(rows, "2.1")).toBe("NC");
    // 2.2 (frame-title relevance, judgment) must stay non-NC.
    expect(statusOf(rows, "2.2")).not.toBe("NC");
  });
});

describe("RGAA applicability — a pack WITHOUT appliesTo keeps the legacy fan-out (third-party compat)", () => {
  registerRuntimePack({
    key: "legacyfan",
    name: "LegacyFan",
    org: "O",
    country: "US",
    baseVersion: "1",
    wcagVersion: "2.2",
    locales: ["en"],
    defaultLocale: "en",
    license: "x",
    source: "x",
    attribution: "x",
    idPattern: "^L\\d+$",
    themes: [{ number: 1, name: { en: "T" }, count: 2 }],
    // Two criteria BOTH mapping 1.1.1, neither declaring appliesTo → both fan out.
    criteria: [
      { id: "L1", theme: 1, title: { en: "A" }, titlePlain: { en: "A" }, wcag: ["1.1.1"] },
      { id: "L2", theme: 1, title: { en: "B" }, titlePlain: { en: "B" }, wcag: ["1.1.1"] },
    ],
  });
  it("both criteria are NC (no applicability data = old behavior, unchanged)", () => {
    const audit = auditHtml(`<!doctype html><html lang="en"><head><title>t</title></head><body><main><h1>H</h1><img src="x"></main></body></html>`);
    const rows = derivePackResults(audit, "legacyfan");
    expect(statusOf(rows, "L1")).toBe("NC");
    expect(statusOf(rows, "L2")).toBe("NC");
  });
});

describe("RGAA applicability — the stateful scan probes project onto the right themes", () => {
  // A merged audit carrying the Task-4 stateful probe findings, then derived to RGAA.
  const audit = auditHtml(`<!doctype html><html lang="fr"><head><title>t</title></head><body><main><h1>H</h1></main></body></html>`);
  const dyn = toDynamicResult(
    {
      url: "https://exemple.fr",
      violations: [],
      reflow: { horizontalScroll: false },
      inputOverflowReflow: [{ selector: "input.a", html: "<input>", detail: "clip 320" }],
      inputOverflowZoom: [{ selector: "input.a", html: "<input>", detail: "clip 200%" }],
      inputOverflowSpacing: [{ selector: "input.a", html: "<input>", detail: "clip spacing" }],
      liveRegion: [{ selector: "div.toast", html: "<div>", detail: "unannounced update" }],
    },
    "https://exemple.fr",
    "fr",
    "axe-core@playwright (local)",
  );
  const rows = derivePackResults(mergeDynamic(audit, dyn, "fr"), "rgaa");
  const statusOfR = (id: string) => rows.find((r) => r.id === id)?.status;

  it("input-overflow lands on RGAA 10.11 (320px), 10.4 (zoom) and 10.12 (text-spacing)", () => {
    expect(statusOfR("10.11")).toBe("NC");
    expect(statusOfR("10.4")).toBe("NC");
    expect(statusOfR("10.12")).toBe("NC");
  });

  it("live-region lands on RGAA 7.5 (status messages), NOT 7.4 (change of context)", () => {
    expect(statusOfR("7.5")).toBe("NC");
    expect(statusOfR("7.4")).not.toBe("NC");
  });
});

describe("RGAA declarative rule — download-link-format (advisory, criterion 6.1)", () => {
  const page = (link: string) => `<!doctype html><html lang="fr"><head><title>t</title></head><body><main><h1>H</h1>${link}</main></body></html>`;

  it("a download link whose text omits format/weight raises a namespaced pack finding kept OUT of the core result", () => {
    const audit = auditHtml(page(`<a href="rapport.pdf">Rapport annuel</a>`));
    // The finding rides in packFindings only — the core WCAG findings/criteria are untouched.
    expect(audit.packFindings?.some((f) => f.ruleId === "pack:rgaa:download-link-format")).toBe(true);
    expect(audit.findings.some((f) => f.ruleId.startsWith("pack:"))).toBe(false);
    expect(audit.criteria.every((c) => c.findings.every((f) => !f.ruleId.startsWith("pack:")))).toBe(true);
  });

  it("projects onto RGAA 6.1 as an ADVISORY recommendation and NEVER makes 6.1 NC", () => {
    const rows = derivePackResults(auditHtml(page(`<a href="rapport.pdf">Rapport annuel</a>`)), "rgaa");
    const c61 = rows.find((r) => r.id === "6.1")!;
    expect(c61.findings.some((f) => f.ruleId === "pack:rgaa:download-link-format" && f.advisory === true)).toBe(true);
    expect(c61.status).not.toBe("NC");
  });

  it("does not fire when the link text already states the format and weight", () => {
    const audit = auditHtml(page(`<a href="rapport.pdf">Rapport annuel (PDF, 2 Mo)</a>`));
    expect(audit.packFindings?.some((f) => f.ruleId === "pack:rgaa:download-link-format") ?? false).toBe(false);
  });
});

describe("the built RGAA pack carries applicability data", () => {
  it("every RGAA criterion declares an explicit appliesTo (so no SC-sibling can leak a foreign finding)", () => {
    const pack = loadPack("rgaa");
    for (const c of pack.criteria) {
      expect(c.appliesTo, `RGAA ${c.id} missing appliesTo`).toBeDefined();
      expect(Array.isArray(c.appliesTo!.ruleIds)).toBe(true);
    }
  });
  it("RGAA 1.1 lists the image-alt rules and 1.4 (CAPTCHA) lists none", () => {
    const pack = loadPack("rgaa");
    const c11 = pack.criteria.find((c) => c.id === "1.1")!;
    expect(c11.appliesTo!.ruleIds).toContain("img-alt-missing");
    const c14 = pack.criteria.find((c) => c.id === "1.4")!;
    expect(c14.appliesTo!.ruleIds).toEqual([]);
  });
});
