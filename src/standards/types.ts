// Types for a STANDARDS PACK — a pluggable, in-repo country accessibility standard
// (RGAA, Section 508, EN 301 549, AODA…) that maps its localized criteria onto WCAG
// success criteria. The WCAG 2.2 core (src/types.ts `Sc` / src/wcag.ts) stays canonical;
// a pack is a derived view. See CONTRIBUTING.md for the authoring contract.
import type { Lang } from "../types.js";

// A localized string. `defaultLocale` (declared on the pack) MUST be present; other
// locales are optional. English is recommended for worldwide readability but a
// French-only standard like RGAA legitimately ships fr-only.
export type LocaleString = Partial<Record<Lang, string>>;

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
}

export interface StandardPack {
  key: string; // unique slug, e.g. "rgaa" (may not be the reserved core key "wcag")
  name: string; // short display name, e.g. "RGAA"
  fullName?: string;
  org: string; // authoring body, e.g. "DINUM"
  country: string; // ISO-ish code, e.g. "FR"
  baseVersion: string; // standard version, e.g. "4.1.2"
  wcagVersion: string; // the WCAG version the pack maps to, e.g. "2.1"
  locales: Lang[];
  defaultLocale: Lang;
  license: string;
  source: string;
  attribution: string;
  idPattern: string; // regex (string) the pack's criterion ids match
  themes: PackTheme[];
  criteria: PackCriterion[];
}
