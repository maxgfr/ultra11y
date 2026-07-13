// A declarative pack rule's finding must render in the UI frame's language. Pack rules are
// loaded at runtime and cannot register into the compiled MSG_CATALOG, so `toFinding`
// attaches the rule's localized {en,fr} pair onto `Finding.i18n`, and resolveMessage /
// resolveRemediation read it BEFORE the English bake. Regression for the Task 6 review item:
// a French RGAA report previously showed the download-link rule's English text.
import { describe, it, expect } from "vitest";
import { runAudit } from "../src/audit.js";
import { loadPack } from "../src/standards/registry.js";
import { renderPackReport } from "../src/report.js";
import { resolveMessage, resolveRemediation } from "../src/messages.js";

const FIX = new URL("./fixtures/egapro-feedback/fp/", import.meta.url).pathname;

// The fp/download-links.html links say "Télécharger" with .pdf/.docx/.xlsx hrefs but name
// neither format nor size in their visible text — the RGAA download-link-format rule fires
// (advisory), so it lands in packFindings without raising any normative NC.
const audit = runAudit({ inputs: [`${FIX}download-links.html`] });
const rgaa = loadPack("rgaa");

describe("declarative pack rule findings are localized (Finding.i18n)", () => {
  it("the download-link-format rule fires as an advisory pack finding", () => {
    const packFindings = audit.packFindings ?? [];
    const dl = packFindings.filter((f) => f.ruleId === "pack:rgaa:download-link-format");
    expect(dl.length).toBeGreaterThan(0);
    expect(dl.every((f) => f.advisory === true)).toBe(true);
    expect(dl[0]!.i18n?.message?.fr).toBeTruthy();
    expect(dl[0]!.i18n?.message?.en).toBeTruthy();
  });

  it("resolveMessage/resolveRemediation pick the active lang from the rule's i18n pair", () => {
    const f = (audit.packFindings ?? []).find((x) => x.ruleId === "pack:rgaa:download-link-format")!;
    expect(resolveMessage(f, "fr")).toContain("ne précise ni le format ni le poids");
    expect(resolveMessage(f, "en")).toContain("states neither the file format nor its size");
    expect(resolveRemediation(f, "fr")).toContain("le format et le poids du fichier");
    expect(resolveRemediation(f, "en")).toContain("State the file format and size");
  });

  it("an RGAA report at lang=fr renders the download-link rule's FRENCH text (not the English bake)", () => {
    const fr = renderPackReport(audit, rgaa, "fr");
    expect(fr).toContain("ne précise ni le format ni le poids");
    expect(fr).not.toContain("states neither the file format nor its size");
  });

  it("the same RGAA report at lang=en renders the English text", () => {
    const en = renderPackReport(audit, rgaa, "en");
    expect(en).toContain("states neither the file format nor its size");
    expect(en).not.toContain("ne précise ni le format ni le poids");
  });
});
