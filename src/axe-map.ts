// Curated axe-core rule → WCAG 2.2 success-criterion mapping. axe emits native
// `wcag<abc>` tags per rule, so this curated map only carries deliberate choices
// (e.g. color-contrast → 1.4.3, the needs-rendering SC the static engine can't
// decide); everything else falls back to axe's own wcag tags, then to 4.1.2.
import type { Severity } from "./types.js";
import { hasSC } from "./wcag.js";

export const AXE_WCAG: Record<string, string> = {
  // images
  "image-alt": "1.1.1",
  "input-image-alt": "1.1.1",
  "area-alt": "1.1.1",
  "role-img-alt": "1.1.1",
  "image-redundant-alt": "1.1.1",
  "svg-img-alt": "1.1.1",
  // frames
  "frame-title": "4.1.2",
  "frame-title-unique": "4.1.2",
  // colour (the headline dynamic win)
  "color-contrast": "1.4.3",
  "color-contrast-enhanced": "1.4.3",
  "link-in-text-block": "1.4.1",
  // tables / structure
  "td-headers-attr": "1.3.1",
  "th-has-data-cells": "1.3.1",
  "scope-attr-valid": "1.3.1",
  "table-fake-caption": "1.3.1",
  "td-has-header": "1.3.1",
  "empty-table-header": "1.3.1",
  // links & buttons
  "link-name": "2.4.4",
  "button-name": "4.1.2",
  "input-button-name": "4.1.2",
  // scripts / ARIA
  "aria-allowed-attr": "4.1.2",
  "aria-allowed-role": "4.1.2",
  "aria-command-name": "4.1.2",
  "aria-hidden-body": "4.1.2",
  "aria-hidden-focus": "4.1.2",
  "aria-input-field-name": "4.1.2",
  "aria-required-attr": "4.1.2",
  "aria-required-children": "4.1.2",
  "aria-required-parent": "4.1.2",
  "aria-roles": "4.1.2",
  "aria-toggle-field-name": "4.1.2",
  "aria-valid-attr": "4.1.2",
  "aria-valid-attr-value": "4.1.2",
  "nested-interactive": "4.1.2",
  "aria-tooltip-name": "4.1.2",
  "aria-meter-name": "4.1.2",
  "aria-progressbar-name": "4.1.2",
  "aria-dialog-name": "4.1.2",
  "presentation-role-conflict": "4.1.2",
  "duplicate-id-aria": "4.1.2",
  // mandatory elements / language
  "duplicate-id": "4.1.2",
  "duplicate-id-active": "4.1.2",
  "html-has-lang": "3.1.1",
  "html-xml-lang-mismatch": "3.1.1",
  "html-lang-valid": "3.1.1",
  "valid-lang": "3.1.2",
  "document-title": "2.4.2",
  // structure
  "heading-order": "1.3.1",
  "empty-heading": "1.3.1",
  "page-has-heading-one": "1.3.1",
  list: "1.3.1",
  listitem: "1.3.1",
  "definition-list": "1.3.1",
  dlitem: "1.3.1",
  "landmark-one-main": "1.3.1",
  region: "1.3.1",
  // presentation / zoom
  "meta-viewport": "1.4.4",
  "meta-viewport-large": "1.4.4",
  // forms
  label: "4.1.2",
  "form-field-multiple-labels": "4.1.2",
  "select-name": "4.1.2",
  "label-title-only": "4.1.2",
  "autocomplete-valid": "1.3.5",
  fieldset: "1.3.1",
  // multimedia
  "audio-caption": "1.2.2",
  "video-caption": "1.2.2",
  "no-autoplay-audio": "1.4.2",
  blink: "2.2.2",
  marquee: "2.2.2",
  // navigation
  tabindex: "2.4.3",
  "skip-link": "2.4.1",
  bypass: "2.4.1",
  accesskeys: "2.1.1",
};

export const FALLBACK_SC = "4.1.2";

/** Read a WCAG SC from axe's native rule tags. axe tags each rule with `wcag<abc>`
 *  (e.g. "wcag111" → 1.1.1, "wcag1410" → 1.4.10) plus level umbrellas ("wcag2aa",
 *  "wcag22aa", "best-practice") that carry no SC and are skipped. Returns the first
 *  tag that resolves to a real SC in the WCAG 2.2 AA core (so AAA tags are ignored). */
export function scFromWcagTags(tags: string[] | undefined): string | null {
  if (!tags) return null;
  for (const t of tags) {
    const m = /^wcag(\d)(\d)(\d+)$/.exec(t);
    if (m) {
      const sc = `${m[1]}.${m[2]}.${m[3]}`;
      if (hasSC(sc)) return sc;
    }
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

export function scForAxeRule(ruleId: string): string {
  return AXE_WCAG[ruleId] ?? FALLBACK_SC;
}

/** Resolve an axe rule to a WCAG SC: the curated map first (deliberate, e.g.
 *  color-contrast → 1.4.3), then axe's own wcag tags, then the 4.1.2 fallback. */
export function scForAxe(ruleId: string, tags?: string[]): string {
  return AXE_WCAG[ruleId] ?? scFromWcagTags(tags) ?? FALLBACK_SC;
}
