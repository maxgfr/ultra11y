// Generic pack loader: localized lookups over a StandardPack (the genericized
// successor of the old src/rgaa.ts criterion/theme/glossary helpers).
import type { StandardPack, PackCriterion, LocaleString } from "./types.js";
import type { Lang, GlossaryEntry } from "../types.js";
import { packGlossary } from "./registry.js";

/** Resolve a localized string: requested lang → pack default → English → first available.
 *  `lang` is deliberately `string`, not the UI frame's `Lang` — a pack's own locales
 *  (`LocaleString` keys) are not constrained to "fr"|"en" (see src/standards/types.ts). */
export function localize(pack: StandardPack, s: LocaleString | undefined, lang: string): string {
  if (!s) return "";
  return s[lang] ?? s[pack.defaultLocale] ?? s.en ?? Object.values(s)[0] ?? "";
}

export function allCriteria(pack: StandardPack): PackCriterion[] {
  return pack.criteria;
}

export function getCriterion(pack: StandardPack, id: string): PackCriterion | undefined {
  return pack.criteria.find((c) => c.id === id);
}

export function hasId(pack: StandardPack, id: string): boolean {
  return pack.criteria.some((c) => c.id === id);
}

export function listTheme(pack: StandardPack, n: number): PackCriterion[] {
  return pack.criteria.filter((c) => c.theme === n);
}

export function themeName(pack: StandardPack, n: number, lang: Lang): string | undefined {
  const t = pack.themes.find((x) => x.number === n);
  return t ? localize(pack, t.name, lang) : undefined;
}

export function title(pack: StandardPack, c: PackCriterion, lang: Lang): string {
  return localize(pack, c.title, lang);
}

export function titlePlain(pack: StandardPack, c: PackCriterion, lang: Lang): string {
  return localize(pack, c.titlePlain, lang);
}

export function resolveGlossary(packKey: string, anchor: string): GlossaryEntry | undefined {
  return packGlossary(packKey)?.[anchor];
}

/** The pack's `idPattern` with its full-match anchors (`^`/`$`) stripped, for embedding
 *  as a capture group inside a larger line pattern — the generic seam `check.ts`/
 *  `verify.ts` use to recognize THIS standard's own criterion-id grammar in a rendered
 *  report (WCAG's fixed 3-segment "1.4.3", or a pack's own shape: RGAA "8.3", a
 *  hypothetical Section 508 "E205.4"…). `idPattern` is validated compilable by
 *  `validatePack` before a pack is ever registered, so this is always a legal regex
 *  source. */
export function idCaptureSource(pack: StandardPack): string {
  return pack.idPattern.replace(/^\^/, "").replace(/\$$/, "");
}
