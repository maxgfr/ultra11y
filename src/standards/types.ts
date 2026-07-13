// Types for a STANDARDS PACK — a pluggable, in-repo country accessibility standard
// (RGAA, Section 508, EN 301 549, AODA…) that maps its localized criteria onto WCAG
// success criteria. The WCAG 2.2 core (src/types.ts `Sc` / src/wcag.ts) stays canonical;
// a pack is a derived view. See CONTRIBUTING.md for the authoring contract.
// A localized string, keyed by a BCP-47-ish locale tag ("fr", "en", "pt-BR", "de"…) — NOT
// the UI frame's `Lang` ("fr"|"en", see src/types.ts): a pack may legitimately be
// authored in any language (e.g. a hypothetical German-only standard), decoupled from
// the languages the CLI's own tables (`L`) render in. `defaultLocale` (declared on the
// pack) MUST be present; other locales are optional. English is recommended for
// worldwide readability but a French-only standard like RGAA legitimately ships fr-only.
export type LocaleString = Partial<Record<string, string>>;

export interface PackTheme {
  number: number;
  name: LocaleString;
  count: number;
}

export interface PackCriterion {
  id: string; // pack-local id, e.g. RGAA "1.1"
  theme: number;
  title: LocaleString;
  titlePlain: LocaleString;
  tests?: Record<string, string[]>;
  techniques?: string[];
  technicalNote?: string[];
  particularCases?: string[];
  wcag: string[]; // bare WCAG SC ids this criterion maps to, e.g. ["1.1.1", "4.1.2"]
  // Per-criterion APPLICABILITY: the engine rule ids whose findings this criterion can
  // actually be non-conformant on. A single WCAG SC maps to MANY pack criteria (RGAA
  // 1.1.1 → 19 criteria: informative-image, CAPTCHA, detailed-description, layout
  // tables, downloadable documents…), so an `img-alt-missing` failure must attach ONLY
  // to the informative-image criterion, not fan out to CAPTCHA/description/etc. A finding
  // collected via a mapped SC attaches iff its `ruleId` matches one of these (exact, or a
  // "prefix:*" wildcard for `axe:*`/`dyn-*`/`agent:*`). An empty list means "no engine
  // rule can evidence this criterion" (it stays manual/NA, never NC from a sibling's
  // failure). Optional/additive: a pack WITHOUT `appliesTo` keeps the legacy fan-out
  // (every mapped SC's findings attach) so third-party packs are unaffected.
  appliesTo?: { ruleIds: string[] };
}

// The localized DISPLAY vocabulary a standard uses when its audit is rendered for an
// AUDITOR (the `prd` auditor block + GitHub issues): the NOUNS the standard gives to a
// theme, a criterion, a test, and its three conformance verdicts, plus an optional
// section heading and a bespoke normative note. Every field is optional and localized —
// missing terms fall back to a generic default and the WCAG core keeps its own set (see
// src/standards/vocabulary.ts), so a pack that omits `vocabulary` still renders. This is
// what lets the auditor output speak each country's language rather than hardcoding RGAA
// ("Thématique / Critère / Test / C-NC-NA") or WCAG ("Principle · Guideline / Success
// criterion / Technique / Pass-Fail").
export interface PackVocabulary {
  theme?: LocaleString; // grouping noun, e.g. RGAA "Thématique"
  criterion?: LocaleString; // item noun, e.g. "Critère"
  test?: LocaleString; // sub-item noun, e.g. "Test"
  conformant?: LocaleString; // verdict, e.g. "Conforme (C)"
  nonConformant?: LocaleString; // verdict, e.g. "Non conforme (NC)"
  notApplicable?: LocaleString; // verdict, e.g. "Non applicable (NA)"
  auditorHeading?: LocaleString; // section/doc title, e.g. "Critère d'accessibilité"
  normativeNote?: LocaleString; // overrides the composed "Lecture auditeur — …" blockquote
}

// The NORMATIVE page-sample methodology for a standard — the REQUIRED page KINDS a real
// audit of it must cover. Standard-agnostic sample MECHANICS live in the core
// (src/types.ts SampleConfig + src/sample.ts); this pack field carries only the standard's
// own required-kinds LIST (RGAA: accueil, contact, mentions légales, déclaration
// d'accessibilité, plan du site, aide, authentification, pages représentatives + éléments
// transverses). Advisory: `ultra11y sample check` / `scan --sample` report which kinds the
// configured sample lacks (fuzzy match on a page's name/notes/url) — never a hard gate.
export interface SampleRequiredKind {
  id: string; // slug, e.g. "mentions-legales"
  label: LocaleString; // display label, e.g. { fr: "Mentions légales" }
  keywords: string[]; // fuzzy-match terms (accent-insensitive) against a page's name/notes/url
}
export interface SampleMethodology {
  requiredKinds: SampleRequiredKind[];
}

export interface StandardPack {
  key: string; // unique slug, e.g. "rgaa" (may not be the reserved core key "wcag")
  name: string; // short display name, e.g. "RGAA"
  fullName?: string;
  org: string; // authoring body, e.g. "DINUM"
  country: string; // ISO-ish code, e.g. "FR"
  baseVersion: string; // standard version, e.g. "4.1.2"
  wcagVersion: string; // the WCAG version the pack maps to, e.g. "2.1"
  locales: string[]; // BCP-47-ish tags, e.g. ["fr"] or ["de"] — the pack's OWN locales,
  // independent of the UI frame's `Lang` (see `LocaleString` above)
  defaultLocale: string;
  license: string;
  source: string;
  attribution: string;
  idPattern: string; // regex (string) the pack's criterion ids match
  vocabulary?: PackVocabulary; // localized auditor-display terms (optional; defaults apply)
  sampleMethodology?: SampleMethodology; // normative required page kinds (optional; advisory lint)
  themes: PackTheme[];
  criteria: PackCriterion[];
}
