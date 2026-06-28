// Maps each rule to how `fix` may repair it, keyed by ruleId (NOT a field on the
// Rule objects — keeps the registry's 36-rule invariant + rule purity intact, and
// centralises the risky edit logic here). Three classes:
//  - auto:        deterministic, no judgment — safe to write unattended.
//  - placeholder: insert a syntactically-valid attribute with a TODO sentinel the
//                 agent fills with a real, context-appropriate value.
//  - proposal:    judgment only — the engine never invents the content; the agent
//                 writes it (alt text relevance, link purpose, table structure…).
import { type Edit, setAttr, removeAttr, getAttr, openTag } from "./edits.js";

export type Fixability = "auto" | "placeholder" | "proposal";

export const PLACEHOLDER = "TODO"; // sentinel the agent replaces with a real value
// `lang` needs a VALID BCP-47 value or the lang-invalid rule fires (swapping one NC
// for another). "und" = ISO 639-2 "undetermined": valid, and a clear fill-me signal.
export const LANG_PLACEHOLDER = "und";

export interface Codemod {
  fixability: Fixability;
  build?: (source: string, start: number) => Edit[];
}

const one =
  (fn: (s: string, start: number) => Edit | null) =>
  (s: string, start: number): Edit[] => {
    const e = fn(s, start);
    return e ? [e] : [];
  };

// Re-enable zoom: drop user-scalable=no/0 and any maximum-scale that blocks 200%.
function viewportFix(source: string, start: number): Edit[] {
  const content = getAttr(source, start, "content");
  if (content === null) return [];
  const kept = content
    .split(/[,;]/)
    .map((p) => p.trim())
    .filter(Boolean)
    .filter((p) => {
      const [k, v] = p.split("=").map((x) => x.trim().toLowerCase());
      if (k === "user-scalable") return false;
      if (k === "maximum-scale") return Number(v) >= 2;
      return true;
    });
  const e = setAttr(source, start, "content", kept.join(", "));
  return e ? [e] : [];
}

// Native <img>/<area> take alt; a role="img" on something else takes aria-label.
function altFix(source: string, start: number): Edit[] {
  const tag = openTag(source, start)?.tagName;
  const name = tag === "img" || tag === "area" ? "alt" : "aria-label";
  const e = setAttr(source, start, name, PLACEHOLDER);
  return e ? [e] : [];
}

export const CODEMODS: Record<string, Codemod> = {
  // auto
  "positive-tabindex": { fixability: "auto", build: one((s, st) => setAttr(s, st, "tabindex", "0")) },
  "redundant-aria": { fixability: "auto", build: one((s, st) => removeAttr(s, st, "role")) },
  "meta-viewport-zoom-block": { fixability: "auto", build: viewportFix },
  // placeholder
  "iframe-title-missing": { fixability: "placeholder", build: one((s, st) => setAttr(s, st, "title", PLACEHOLDER)) },
  "html-lang-missing": { fixability: "placeholder", build: one((s, st) => setAttr(s, st, "lang", LANG_PLACEHOLDER)) },
  "img-alt-missing": { fixability: "placeholder", build: altFix },
  "control-label-missing": { fixability: "placeholder", build: one((s, st) => setAttr(s, st, "aria-label", PLACEHOLDER)) },
};

export function fixabilityOf(ruleId: string): Fixability {
  return CODEMODS[ruleId]?.fixability ?? "proposal";
}
