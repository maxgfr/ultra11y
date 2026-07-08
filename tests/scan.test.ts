import { describe, it, expect } from "vitest";
import { mkdtempSync, existsSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { toDynamicResult, mergeDynamic, cleanTempContexts } from "../src/scan.js";
import { runAudit } from "../src/audit.js";
import { resolveMessage, resolveRemediation } from "../src/messages.js";

const FIX = new URL("./fixtures/", import.meta.url).pathname;

// a recorded runner output (no Docker needed to test the mapping/merge logic)
const sampleOut = {
  url: "https://exemple.fr",
  violations: [
    {
      id: "color-contrast",
      impact: "serious",
      help: "Elements must have sufficient color contrast",
      nodes: [{ target: ["p.lead"], html: "<p class='lead'>x</p>" }],
    },
    { id: "button-name", impact: "critical", help: "Buttons must have discernible text", nodes: [{ target: ["button"], html: "<button></button>" }] },
  ],
  reflow: { horizontalScroll: true },
};

describe("toDynamicResult", () => {
  const dyn = toDynamicResult(sampleOut, "https://exemple.fr");
  it("maps axe color-contrast → 1.4.3 and reflow → 1.4.10", () => {
    expect(dyn.findings.find((f) => f.axeRule === "color-contrast")?.criteriaId).toBe("1.4.3");
    expect(dyn.findings.find((f) => f.engine === "reflow")?.criteriaId).toBe("1.4.10");
  });
  it("derives severity from axe impact", () => {
    expect(dyn.findings.find((f) => f.axeRule === "button-name")?.severity).toBe("bloquant");
  });
  it("tags each finding with the page it came from", () => {
    expect(dyn.findings.find((f) => f.axeRule === "color-contrast")?.page).toBe("https://exemple.fr");
  });
  it("maps an axe rule absent from the curated map via its native wcag tag, not the 4.1.2 fallback", () => {
    const out = {
      url: "https://exemple.fr",
      violations: [{ id: "some-future-rule", impact: "moderate", help: "X", tags: ["wcag2aa", "wcag131"], nodes: [{ target: ["div"], html: "<div></div>" }] }],
      reflow: { horizontalScroll: false },
    };
    const r = toDynamicResult(out, "https://exemple.fr");
    expect(r.findings.find((f) => f.axeRule === "some-future-rule")?.criteriaId).toBe("1.3.1");
  });
});

describe("toDynamicResult — residual-criteria probes (local runtime)", () => {
  const out = {
    url: "https://exemple.fr",
    violations: [],
    reflow: { horizontalScroll: false },
    focusVisible: [{ selector: "button.x", html: "<button>", detail: "no focus indicator" }],
    textSpacing: [{ selector: "p.z", html: "<p>", detail: "clipped" }],
    hover: [],
    reflowZoom: [{ selector: "document", html: "", detail: "200% scroll" }],
  };
  const dyn = toDynamicResult(out, "https://exemple.fr", "en", "axe-core@playwright (local)");
  it("maps each probe to its WCAG SC + severity", () => {
    expect(dyn.findings.find((f) => f.engine === "focus-visible")?.criteriaId).toBe("2.4.7");
    expect(dyn.findings.find((f) => f.engine === "text-spacing")?.criteriaId).toBe("1.4.12");
    expect(dyn.findings.find((f) => f.engine === "reflow-zoom")?.criteriaId).toBe("1.4.4");
    expect(dyn.findings.find((f) => f.engine === "focus-visible")?.severity).toBe("majeur");
    expect(dyn.findings.find((f) => f.engine === "text-spacing")?.severity).toBe("mineur");
  });
  it("carries the local engine label", () => {
    expect(dyn.engine).toBe("axe-core@playwright (local)");
  });
  it("merges probe findings into the static audit, upgrading manual SCs to NC with a dyn- ruleId", () => {
    const audit = runAudit({ inputs: [`${FIX}conforming/good.html`] });
    expect(audit.criteria.find((c) => c.id === "2.4.7")?.status).toBe("manual");
    const merged = mergeDynamic(audit, dyn);
    expect(merged.criteria.find((c) => c.id === "2.4.7")?.status).toBe("NC");
    expect(merged.findings.some((f) => f.ruleId === "dyn-focus-visible")).toBe(true);
    expect(merged.residualRisks.some((r) => r.criteriaId === "2.4.7")).toBe(false);
  });
});

describe("cleanTempContexts", () => {
  it("removes leftover dynamic build contexts from the temp dir", () => {
    const a = mkdtempSync(join(tmpdir(), "ultra11y-dyn-"));
    const b = mkdtempSync(join(tmpdir(), "ultra11y-dyn-"));
    expect(existsSync(a)).toBe(true);
    const removed = cleanTempContexts();
    expect(removed).toBeGreaterThanOrEqual(2);
    expect(existsSync(a)).toBe(false);
    expect(existsSync(b)).toBe(false);
  });
});

describe("mergeDynamic", () => {
  it("upgrades a needs-rendering 'manual' SC to NC and drops it from residual risks", () => {
    const audit = runAudit({ inputs: [`${FIX}conforming/good.html`] });
    expect(audit.criteria.find((c) => c.id === "1.4.3")?.status).toBe("manual");
    const dyn = toDynamicResult(sampleOut, "https://exemple.fr");
    const merged = mergeDynamic(audit, dyn);
    expect(merged.criteria.find((c) => c.id === "1.4.3")?.status).toBe("NC");
    expect(merged.criteria.find((c) => c.id === "1.4.10")?.status).toBe("NC");
    expect(merged.residualRisks.some((r) => r.criteriaId === "1.4.3")).toBe(false);
    expect(merged.findings.some((f) => f.ruleId === "axe:color-contrast")).toBe(true);
    // guideline tallies stay consistent
    for (const g of merged.guidelines) {
      const inGuideline = merged.criteria.filter((c) => c.guideline === g.key).length;
      expect(g.c + g.nc + g.na + g.manual).toBe(inGuideline);
    }
  });
  it("uses each finding's page as its file when merging multi-page (crawl) results", () => {
    const audit = runAudit({ inputs: [`${FIX}conforming/good.html`] });
    const dyn = {
      tool: "ultra11y" as const,
      engine: "axe-core@playwright (docker)",
      target: "crawl:https://exemple.fr",
      date: "2026-06-17",
      findings: [
        {
          criteriaId: "1.4.3",
          axeRule: "color-contrast",
          impact: "serious",
          severity: "majeur" as const,
          message: "m",
          selector: "p",
          snippet: "",
          engine: "axe" as const,
          page: "https://exemple.fr/contact",
        },
      ],
    };
    const merged = mergeDynamic(audit, dyn);
    expect(merged.findings.find((f) => f.ruleId === "axe:color-contrast")?.file).toBe("https://exemple.fr/contact");
  });

  // Whatever `lang` the CLI resolves at merge time, the baked English/French text must
  // stay RE-LOCALIZABLE afterwards (a later `report`/`prd --lang` re-render) — not a
  // dead end. `dyn-reflow` is ultra11y's own bilingual prose; `dyn-remediation` covers
  // axe/probe findings, whose MESSAGE is the engine's own (never translated).
  it("attaches a msg catalog id to the reflow finding's ultra11y-authored message + remediation", () => {
    const dyn = toDynamicResult(sampleOut, "https://exemple.fr", "en");
    const audit = runAudit({ inputs: [`${FIX}conforming/good.html`] });
    const merged = mergeDynamic(audit, dyn, "en");
    const reflow = merged.findings.find((f) => f.ruleId === "dyn-reflow");
    expect(reflow?.msg?.id).toBe("dyn-reflow");
    expect(resolveMessage(reflow!, "fr")).toBe("Défilement horizontal à 320px de large — le contenu ne se redistribue pas (reflow).");
    expect(resolveRemediation(reflow!, "fr")).toBe("Vérifié au rendu par axe-core ; corrigez l'élément cité.");
    // and re-resolves back to English too — it never gets stuck in one language
    expect(resolveMessage(reflow!, "en")).toBe("Horizontal scrolling at 320px width — content does not reflow.");
  });

  it("attaches a msg catalog id to axe findings whose MESSAGE passes through unchanged (axe never translates) but whose REMEDIATION is re-localizable", () => {
    const dyn = toDynamicResult(sampleOut, "https://exemple.fr", "en");
    const audit = runAudit({ inputs: [`${FIX}conforming/good.html`] });
    const merged = mergeDynamic(audit, dyn, "fr");
    const axeFinding = merged.findings.find((f) => f.ruleId === "axe:color-contrast");
    expect(axeFinding?.msg?.id).toBe("dyn-remediation");
    // axe's own English help text is never translated, in either language
    expect(resolveMessage(axeFinding!, "en")).toBe(axeFinding!.message);
    expect(resolveMessage(axeFinding!, "fr")).toBe(axeFinding!.message);
    // baked at merge time in fr (current lang) …
    expect(axeFinding!.remediation).toBe("Vérifié au rendu par axe-core ; corrigez l'élément cité.");
    // … but still resolves back to English on a later re-render
    expect(resolveRemediation(axeFinding!, "en")).toBe("Verified at render time by axe-core; fix the cited element.");
  });
});

// ---- R3: host-source anchoring of dynamic findings ----
import { writeFileSync as wf, mkdtempSync as mkd } from "node:fs";
import { pathToFileURL } from "node:url";

describe("toDynamicResult — host-source anchoring (R3)", () => {
  it("maps the container mount (/work/input.html) back to the host target path", () => {
    const out = {
      url: "/work/input.html",
      violations: [{ id: "image-alt", impact: "critical", help: "Images must have alt", nodes: [{ target: ["img"], html: "<img src=x>" }] }],
    };
    const dyn = toDynamicResult(out as never, "/repo/site/index.html");
    expect(dyn.findings[0]!.page).toBe("/repo/site/index.html");
    expect(dyn.findings[0]!.page).not.toContain("/work/input.html");
  });
  it("converts a file:// url to a host filesystem path", () => {
    const out = { url: pathToFileURL("/repo/site/index.html").href, violations: [] as unknown[], reflow: { horizontalScroll: true } };
    const dyn = toDynamicResult(out as never, "/repo/site/index.html");
    expect(dyn.findings.find((f) => f.engine === "reflow")!.page).toBe("/repo/site/index.html");
  });
  it("keeps a real served URL untouched", () => {
    const dyn = toDynamicResult(sampleOut, "https://exemple.fr");
    expect(dyn.findings[0]!.page).toBe("https://exemple.fr");
  });
});

describe("mergeDynamic — resolves an axe snippet to a real host file:line (R3)", () => {
  const dir = mkd(join(tmpdir(), "u11y-anchor-"));
  const page = join(dir, "page.html");
  wf(page, `<!doctype html>\n<html lang="en">\n<head><title>t</title></head>\n<body>\n<main>\n<img src="hero.png">\n</main>\n</body>\n</html>\n`);

  it("anchors the finding at the line where the cited outerHTML actually sits, with a source range", () => {
    const audit = runAudit({ inputs: [page] });
    const dyn = {
      tool: "ultra11y" as const,
      engine: "axe",
      target: page,
      date: "2026-07-08",
      findings: [
        {
          criteriaId: "1.1.1",
          axeRule: "image-alt",
          impact: "critical",
          severity: "bloquant" as const,
          message: "Images must have alternate text (axe: image-alt)",
          selector: "img",
          snippet: '<img src="hero.png">',
          engine: "axe" as const,
          page,
        },
      ],
    };
    const merged = mergeDynamic(audit, dyn);
    const f = merged.findings.find((x) => x.ruleId === "axe:image-alt")!;
    expect(f.file).toBe(page);
    expect(f.line).toBe(6); // the <img> is on line 6
    expect(f.sourceStart).toBeGreaterThan(0);
    expect(f.selectorHint).toBe("img"); // selector kept
    expect(f.snippet).toContain("hero.png"); // snippet kept
  });

  it("keeps selector + snippet and line 0 when the snippet resolves nowhere — never a fabricated line", () => {
    const audit = runAudit({ inputs: [page] });
    const dyn = {
      tool: "ultra11y" as const,
      engine: "axe",
      target: page,
      date: "2026-07-08",
      findings: [
        {
          criteriaId: "1.4.3",
          axeRule: "color-contrast",
          impact: "serious",
          severity: "majeur" as const,
          message: "contrast",
          selector: "span.ghost",
          snippet: "<span class='ghost'>nowhere</span>",
          engine: "axe" as const,
          page,
        },
      ],
    };
    const merged = mergeDynamic(audit, dyn);
    const f = merged.findings.find((x) => x.ruleId === "axe:color-contrast")!;
    expect(f.line).toBe(0);
    expect(f.selectorHint).toBe("span.ghost");
    expect(f.snippet).toContain("nowhere");
  });
});
