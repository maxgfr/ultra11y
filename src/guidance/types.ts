// Types for the GUIDANCE layer — concrete, how-to-implement accessibility rules
// (good/bad code patterns) ingested from an external source such as the SocialGouv /
// etalab RGAA rule packs. Guidance is NOT the standard itself: a StandardPack
// (src/standards/) is a localized criterion set mapped onto WCAG SCs, whereas guidance
// is the *implementation rule* attached to those criteria — the before/after examples
// and remediation prose the agent and the PRD draw on. It is looked up at RENDER time
// by criterion / WCAG SC, so the canonical AuditResult JSON stays untouched.
import type { Lang } from "../types.js";

export type GuidanceLang = "html" | "jsx" | "css";

export interface GuidanceExample {
  lang: GuidanceLang;
  bad?: string; // a non-compliant snippet (the RGAA "non conforme" example)
  good?: string; // the compliant fix (the RGAA "conforme" example)
  note?: Partial<Record<Lang, string>>;
}

export interface GuidanceEntry {
  id: string; // source rule id, e.g. "images-decorative-alt"
  criterionId?: string; // pack-local criterion id (e.g. RGAA "1.2"); absent ⇒ unresolved ⇒ pack check fails
  wcag: string[]; // bare WCAG SC ids (derived from the criterion this rule implements)
  title: Partial<Record<Lang, string>>;
  summary: Partial<Record<Lang, string>>; // one-line "how to implement it" guidance
  impact?: "high" | "medium" | "low";
  examples: GuidanceExample[];
  reference: string; // the official criterion URL the mapping was derived from
}

export interface GuidanceDataset {
  pack: string; // the pack key this guidance augments, e.g. "rgaa"
  source: string;
  license: string;
  attribution: string;
  entries: GuidanceEntry[];
}
