// Resolve the localized AUDITOR-DISPLAY vocabulary for a standard — the nouns the
// auditor block (src/auditor.ts) and GitHub issues render. The standard-specific terms
// come from `pack.vocabulary` (see types.ts); the WCAG core is canonical (not a pack) so
// its terms live here; anything a pack omits falls back to a generic default. This is the
// modular seam: a new country pack ships its own vocabulary and the output speaks its
// language, with zero engine changes.
import type { Lang } from "../types.js";
import type { LocaleString, PackVocabulary } from "./types.js";
import { isCore, getPack } from "./registry.js";

// The fully-resolved terms (every field present, in the requested language).
export interface ResolvedVocabulary {
  theme: string;
  criterion: string;
  test: string;
  conformant: string;
  nonConformant: string;
  notApplicable: string;
  auditorHeading: string;
  normativeNote?: string; // present only when a pack supplies a bespoke note
}

type TermKey = Exclude<keyof PackVocabulary, "normativeNote">;

// Generic fallback for a pack that omits a term.
const DEFAULT: Record<TermKey, Record<Lang, string>> = {
  theme: { en: "Theme", fr: "Thématique" },
  criterion: { en: "Criterion", fr: "Critère" },
  test: { en: "Test", fr: "Test" },
  conformant: { en: "Conformant", fr: "Conforme" },
  nonConformant: { en: "Non-conformant", fr: "Non conforme" },
  notApplicable: { en: "Not applicable", fr: "Non applicable" },
  auditorHeading: { en: "Accessibility criterion", fr: "Critère d'accessibilité" },
};

// The WCAG 2.2 core vocabulary (the core is not a pack, so it cannot carry `vocabulary`).
const CORE: Record<TermKey, Record<Lang, string>> = {
  theme: { en: "Principle · Guideline", fr: "Principe · Règle" },
  criterion: { en: "Success criterion", fr: "Critère de succès" },
  test: { en: "Technique", fr: "Technique" },
  conformant: { en: "Pass", fr: "Conforme" },
  nonConformant: { en: "Fail", fr: "Non conforme" },
  notApplicable: { en: "Not applicable", fr: "Non applicable" },
  auditorHeading: { en: "Accessibility criterion", fr: "Critère d'accessibilité" },
};

/** Resolve a localized string: requested lang → pack default → English → first available.
 *  `lang`/`fallbackLang` are `string`, not the UI frame's `Lang` — a pack's own locale
 *  (its `defaultLocale`) is not constrained to "fr"|"en" (see src/standards/types.ts). */
function pick(s: LocaleString | undefined, lang: string, fallbackLang: string): string | undefined {
  if (!s) return undefined;
  return s[lang] ?? s[fallbackLang] ?? s.en ?? Object.values(s)[0];
}

/** The resolved auditor vocabulary for a standard (WCAG core or a pack) in `lang`. */
export function vocabularyFor(standard: string, lang: string): ResolvedVocabulary {
  const base = isCore(standard) ? CORE : DEFAULT;
  const pack = isCore(standard) ? undefined : getPack(standard);
  const voc = pack?.vocabulary;
  const packDefault = pack?.defaultLocale ?? "en";
  // The core/default fallback tables only ever carry "fr"/"en" — a pack-only locale
  // (e.g. "de") that isn't one of those two falls through to "en" here, same as any
  // other unmapped requested lang.
  const term = (k: TermKey): string => pick(voc?.[k], lang, packDefault) ?? (base[k] as Record<string, string>)[lang] ?? base[k].en;
  return {
    theme: term("theme"),
    criterion: term("criterion"),
    test: term("test"),
    conformant: term("conformant"),
    nonConformant: term("nonConformant"),
    notApplicable: term("notApplicable"),
    auditorHeading: term("auditorHeading"),
    normativeNote: pick(voc?.normativeNote, lang, packDefault),
  };
}
