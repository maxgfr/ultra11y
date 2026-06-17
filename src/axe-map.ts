// Curated axe-core rule → RGAA 4.1.2 criterion mapping. axe gained in-tree RGAA
// tags (late 2025) but doesn't expose a machine-readable mapping, so we ship our
// own. The headline win is color-contrast → 3.2/3.3 (the needs-rendering criterion
// the static engine cannot decide). Unknown axe rules fall back to 7.1.
import type { Severity } from "./types.js";

export const AXE_RGAA: Record<string, string> = {
  // images
  "image-alt": "1.1",
  "input-image-alt": "1.1",
  "area-alt": "1.1",
  "role-img-alt": "1.1",
  "image-redundant-alt": "1.2",
  "svg-img-alt": "1.1",
  // frames
  "frame-title": "2.1",
  "frame-title-unique": "2.2",
  // colour (the headline dynamic win)
  "color-contrast": "3.2",
  "color-contrast-enhanced": "3.2",
  "link-in-text-block": "3.1",
  // tables
  "td-headers-attr": "5.7",
  "th-has-data-cells": "5.7",
  "scope-attr-valid": "5.7",
  "table-fake-caption": "5.4",
  "td-has-header": "5.6",
  "empty-table-header": "5.6",
  // links & buttons
  "link-name": "6.2",
  "button-name": "7.1",
  "input-button-name": "7.1",
  // scripts / ARIA
  "aria-allowed-attr": "7.1",
  "aria-allowed-role": "7.1",
  "aria-command-name": "7.1",
  "aria-hidden-body": "7.1",
  "aria-hidden-focus": "7.1",
  "aria-input-field-name": "11.1",
  "aria-required-attr": "7.1",
  "aria-required-children": "7.1",
  "aria-required-parent": "7.1",
  "aria-roles": "7.1",
  "aria-toggle-field-name": "11.1",
  "aria-valid-attr": "7.1",
  "aria-valid-attr-value": "7.1",
  "nested-interactive": "7.1",
  "aria-tooltip-name": "7.1",
  "aria-meter-name": "7.1",
  "aria-progressbar-name": "7.1",
  "aria-dialog-name": "7.1",
  "presentation-role-conflict": "7.1",
  "duplicate-id-aria": "8.2",
  // mandatory elements / language
  "duplicate-id": "8.2",
  "duplicate-id-active": "8.2",
  "html-has-lang": "8.3",
  "html-xml-lang-mismatch": "8.3",
  "html-lang-valid": "8.4",
  "valid-lang": "8.8",
  "document-title": "8.5",
  // structure
  "heading-order": "9.1",
  "empty-heading": "9.1",
  "page-has-heading-one": "9.1",
  "list": "9.3",
  "listitem": "9.3",
  "definition-list": "9.3",
  "dlitem": "9.3",
  "landmark-one-main": "12.6",
  "region": "12.6",
  // presentation / zoom
  "meta-viewport": "10.4",
  "meta-viewport-large": "10.4",
  // forms
  "label": "11.1",
  "form-field-multiple-labels": "11.1",
  "select-name": "11.1",
  "label-title-only": "11.1",
  "autocomplete-valid": "11.13",
  "fieldset": "11.6",
  // multimedia
  "audio-caption": "4.3",
  "video-caption": "4.3",
  "no-autoplay-audio": "4.10",
  "blink": "13.8",
  "marquee": "13.8",
  // navigation
  "tabindex": "12.8",
  "skip-link": "12.7",
  "bypass": "12.7",
  "accesskeys": "12.10",
};

export const FALLBACK_CRITERION = "7.1";

/** Collapse axe's per-test RGAA tag (e.g. "RGAA-3.2.1") to its criterion ("3.2").
 *  axe tags each rule with an `RGAAv4` umbrella tag plus per-test
 *  `RGAA-<theme>.<criterion>.<test>` tags; we read the first concrete one to fill
 *  the gaps the curated map doesn't cover, instead of dumping to 7.1. The umbrella
 *  `RGAAv4` tag carries no criterion and is skipped. */
export function criterionFromRgaaTags(tags: string[] | undefined): string | null {
  if (!tags) return null;
  for (const t of tags) {
    const m = /^RGAA-(\d+\.\d+)\.\d+$/.exec(t);
    if (m) return m[1]!;
  }
  return null;
}

/** Map an axe impact to an ultra11y severity. */
export function severityFromImpact(impact: string | null | undefined): Severity {
  switch (impact) {
    case "critical":
    case "serious":
      return "bloquant";
    case "moderate":
      return "majeur";
    default:
      return "mineur";
  }
}

export function criterionForAxeRule(ruleId: string): string {
  return AXE_RGAA[ruleId] ?? FALLBACK_CRITERION;
}

/** Resolve an axe rule to an RGAA criterion: the curated map first (deliberate,
 *  e.g. color-contrast → 3.2), then axe's own RGAA tags, then the 7.1 fallback. */
export function criterionForAxe(ruleId: string, tags?: string[]): string {
  return AXE_RGAA[ruleId] ?? criterionFromRgaaTags(tags) ?? FALLBACK_CRITERION;
}
