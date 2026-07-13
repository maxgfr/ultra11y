// Task 5 — the standard-agnostic page-sample lint (src/sample.ts lintSample) and the
// storageState-dropping projection (sampleScope), plus the RGAA pack's normative
// sampleMethodology emitted by scripts/build-pack-rgaa.mjs.
import { describe, it, expect } from "vitest";
import { lintSample, sampleScope, kindLabel } from "../src/sample.js";
import { loadPack } from "../src/standards/index.js";
import type { SampleConfig } from "../src/types.js";

const rgaa = loadPack("rgaa");
const methodology = rgaa.sampleMethodology!;

describe("RGAA pack carries a normative sampleMethodology", () => {
  it("emits the required page kinds (accueil, contact, mentions légales, …)", () => {
    expect(methodology).toBeTruthy();
    const ids = methodology.requiredKinds.map((k) => k.id);
    expect(ids).toContain("accueil");
    expect(ids).toContain("mentions-legales");
    expect(ids).toContain("declaration-accessibilite");
    expect(ids).toContain("authentification");
    expect(ids).toContain("elements-transverses");
  });
});

describe("lintSample — which required page kinds a sample lacks (fuzzy, accent-insensitive)", () => {
  it("lists a missing kind (no « mentions légales » page in the sample)", () => {
    const sample: SampleConfig = {
      pages: [
        { id: "accueil", name: "Accueil", url: "https://example.fr/" },
        { id: "contact", name: "Contact", url: "https://example.fr/contact" },
      ],
    };
    const { missing } = lintSample(sample, methodology);
    const missingIds = missing.map((k) => k.id);
    expect(missingIds).toContain("mentions-legales");
    // Configured kinds are NOT reported missing.
    expect(missingIds).not.toContain("accueil");
    expect(missingIds).not.toContain("contact");
  });

  it("matches accent-insensitively via a page's notes and treats a non-empty transverse list as covering « éléments transverses »", () => {
    const sample: SampleConfig = {
      pages: [{ id: "ml", name: "Page legale", url: "https://example.fr/ml", notes: "Mentions Légales et CGU" }],
      transverse: ["En-tête", "Pied de page"],
    };
    const missingIds = lintSample(sample, methodology).missing.map((k) => k.id);
    expect(missingIds).not.toContain("mentions-legales"); // matched via notes ("mentions legales")
    expect(missingIds).not.toContain("elements-transverses"); // covered by the transverse list
  });

  it("kindLabel resolves the localized RGAA label", () => {
    const ml = methodology.requiredKinds.find((k) => k.id === "mentions-legales")!;
    expect(kindLabel(ml, "fr")).toBe("Mentions légales");
  });

  // Fix round 1 — lint precision: short keywords match whole words only, and the ambiguous
  // generic words ("plan", "support") are no longer keywords at all.
  it('does NOT credit plan-du-site for "Plan de formation" nor aide for "Support RH"', () => {
    const sample: SampleConfig = {
      pages: [
        { id: "pf", name: "Plan de formation", url: "https://example.fr/formation" },
        { id: "rh", name: "Support RH", url: "https://example.fr/rh" },
      ],
    };
    const missingIds = lintSample(sample, methodology).missing.map((k) => k.id);
    expect(missingIds).toContain("plan-du-site");
    expect(missingIds).toContain("aide");
  });

  it('short keywords are whole-word: "plaide" does not credit aide, "Page d\'aide" does', () => {
    const noAide: SampleConfig = { pages: [{ id: "x", name: "Il plaide coupable", url: "https://example.fr/x" }] };
    expect(lintSample(noAide, methodology).missing.map((k) => k.id)).toContain("aide");
    const withAide: SampleConfig = { pages: [{ id: "x", name: "Page d'aide", url: "https://example.fr/x" }] };
    expect(lintSample(withAide, methodology).missing.map((k) => k.id)).not.toContain("aide");
  });

  it('"Plan du site" still credits plan-du-site (canonical multi-word phrase)', () => {
    const sample: SampleConfig = { pages: [{ id: "plan", name: "Plan du site", url: "https://example.fr/plan-site" }] };
    expect(lintSample(sample, methodology).missing.map((k) => k.id)).not.toContain("plan-du-site");
  });

  // Fix round 1 — a multi-page sample de facto carries representative pages (documented
  // heuristic: ≥ 2 pages credit the kind), so it stops being a constant false nag.
  it("credits pages-representatives once the sample holds ≥ 2 pages, not for a single page", () => {
    const one: SampleConfig = { pages: [{ id: "a", name: "Accueil", url: "https://example.fr/" }] };
    expect(lintSample(one, methodology).missing.map((k) => k.id)).toContain("pages-representatives");
    const two: SampleConfig = {
      pages: [
        { id: "a", name: "Accueil", url: "https://example.fr/" },
        { id: "b", name: "Contact", url: "https://example.fr/contact" },
      ],
    };
    expect(lintSample(two, methodology).missing.map((k) => k.id)).not.toContain("pages-representatives");
  });
});

describe("sampleScope — the recorded shape drops the storageState PATH (never persisted)", () => {
  it("keeps id/name/url/auth/notes but never storageState", () => {
    const scope = sampleScope({
      pages: [{ id: "c", name: "Compte", url: "https://example.fr/compte", auth: true, storageState: "/secret/session.json", notes: "logged in" }],
      transverse: ["header"],
    });
    expect(scope.pages[0]).toEqual({ id: "c", name: "Compte", url: "https://example.fr/compte", auth: true, notes: "logged in" });
    expect(JSON.stringify(scope)).not.toContain("storageState");
    expect(JSON.stringify(scope)).not.toContain("session.json");
    expect(scope.transverse).toEqual(["header"]);
  });
});
