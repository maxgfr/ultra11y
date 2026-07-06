// `scan --merge` resolves its output language from the MERGED audit's scope.langs
// (a French repo audited without --lang must not get English dyn-* text baked with
// no way back — see src/cli.ts cmdScan/peekMergeAudit). Mocks the Docker runtime
// tier (dockerAvailable/runScan) so this exercises the real CLI merge path without
// needing an actual Docker/Playwright install.
import { describe, it, expect, vi } from "vitest";
import { mkdtempSync, rmSync, readFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import type { DynamicResult } from "../src/types.js";

const FIX = new URL("./fixtures/", import.meta.url).pathname;

const dynamicResult: DynamicResult = {
  tool: "ultra11y",
  engine: "axe-core@playwright (docker)",
  target: "https://exemple.fr",
  date: "2026-07-06",
  findings: [
    {
      criteriaId: "1.4.10",
      axeRule: "reflow",
      impact: "serious",
      severity: "majeur",
      message: "Horizontal scrolling at 320px width — content does not reflow.",
      selector: "document",
      snippet: "",
      engine: "reflow",
      page: "https://exemple.fr",
    },
  ],
};

vi.mock("../src/scan.js", async (importOriginal) => {
  const actual = await importOriginal<typeof import("../src/scan.js")>();
  return {
    ...actual,
    dockerAvailable: () => true,
    runScan: () => dynamicResult,
  };
});

const { main } = await import("../src/cli.js");

describe("scan --merge — language resolved from the merged audit BEFORE baking dyn-* text", () => {
  it('no --lang, French-repo audit (scope.langs=["fr"]) → the merged ultra11y-authored reflow finding is French', async () => {
    const tmp = mkdtempSync(join(tmpdir(), "u11y-scan-merge-lang-fr-"));
    try {
      const auditCode = await main(["audit", `${FIX}conforming/good.html`, "--out", tmp, "--json"]); // <html lang="fr">
      expect(auditCode).toBe(0);
      const auditPath = join(tmp, "audit-latest.json");
      const code = await main(["scan", "https://exemple.fr", "--runtime", "docker", "--merge", auditPath, "--out", tmp]);
      expect(code).toBe(0);
      const merged = JSON.parse(readFileSync(join(tmp, "audit-latest.json"), "utf8"));
      const reflow = merged.findings.find((f: { ruleId: string }) => f.ruleId === "dyn-reflow");
      expect(reflow).toBeTruthy();
      // The mocked Docker runner always returns an English-baked DynamicFinding.message
      // (the real Docker ScanOpts has no --lang wiring, unlike the local runtime — out
      // of scope here); what THIS fix controls is mergeDynamic's own remediation bake.
      expect(reflow.remediation).toBe("Vérifié au rendu par axe-core ; corrigez l'élément cité.");
    } finally {
      rmSync(tmp, { recursive: true, force: true });
    }
  });

  it("--lang en explicit still wins over the French-repo audit", async () => {
    const tmp = mkdtempSync(join(tmpdir(), "u11y-scan-merge-lang-en-"));
    try {
      await main(["audit", `${FIX}conforming/good.html`, "--out", tmp, "--json"]);
      const auditPath = join(tmp, "audit-latest.json");
      const code = await main(["scan", "https://exemple.fr", "--runtime", "docker", "--merge", auditPath, "--out", tmp, "--lang", "en"]);
      expect(code).toBe(0);
      const merged = JSON.parse(readFileSync(join(tmp, "audit-latest.json"), "utf8"));
      const reflow = merged.findings.find((f: { ruleId: string }) => f.ruleId === "dyn-reflow");
      expect(reflow.remediation).toBe("Verified at render time by axe-core; fix the cited element.");
    } finally {
      rmSync(tmp, { recursive: true, force: true });
    }
  });

  it("no repo-language signal (bad.html has no <html lang>) falls back to English, as before", async () => {
    const tmp = mkdtempSync(join(tmpdir(), "u11y-scan-merge-lang-none-"));
    try {
      await main(["audit", `${FIX}non-conforming/bad.html`, "--out", tmp, "--json"]);
      const auditPath = join(tmp, "audit-latest.json");
      const code = await main(["scan", "https://exemple.fr", "--runtime", "docker", "--merge", auditPath, "--out", tmp]);
      expect(code).toBe(0);
      const merged = JSON.parse(readFileSync(join(tmp, "audit-latest.json"), "utf8"));
      const reflow = merged.findings.find((f: { ruleId: string }) => f.ruleId === "dyn-reflow");
      expect(reflow.remediation).toBe("Verified at render time by axe-core; fix the cited element.");
    } finally {
      rmSync(tmp, { recursive: true, force: true });
    }
  });
});
