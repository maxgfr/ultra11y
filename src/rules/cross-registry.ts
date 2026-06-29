// The cross-file rule set + runner. Two raise findings the graph makes visible,
// two suppress single-file findings the graph proves are false positives. Findings
// fold into the same AuditResult; suppressions are applied (by ruleId + line) to
// the same Doc's single-file findings in audit.ts.
import type { Doc, El } from "../parse/html.js";
import type { Finding } from "../types.js";
import { attr, hasAttr, visibleText } from "../parse/html.js";
import { isIntrinsic } from "../parse/jsx-bridge.js";
import { isFullDocument } from "./rule.js";
import { type CrossRule, type Suppression, crossToFinding } from "./cross-rule.js";
import { type DepGraph, resolveUsage, idDefinedAnywhere, htmlLangProvidedFor } from "../graph/graph.js";

const SEVERITY_ORDER: Record<string, number> = { bloquant: 0, majeur: 1, mineur: 2 };
const NAME_PROPS = ["aria-label", "aria-labelledby", "title", "label", "alt"];

// A JSX component usage (PascalCase / namespaced); excludes intrinsic tags and #fragment.
function isComponentUsage(el: El): boolean {
  return !isIntrinsic(el.tag) && el.tag !== "#fragment";
}

// Could this component usage already be carrying an accessible name?
function usageHasName(el: El): boolean {
  if (el.spread) return true; // {...props} may inject a name — stay conservative
  if (visibleText(el) !== "") return true;
  return NAME_PROPS.some((p) => (attr(el, p) ?? "").trim() !== "");
}

function isNameableControl(el: El): boolean {
  if (el.tag === "button" || el.tag === "select" || el.tag === "textarea") return true;
  if (el.tag === "a" && hasAttr(el, "href")) return true;
  if (el.tag === "input" || el.tag === "img") return true;
  return false;
}

// 1) An icon-only component that CAN be named (spread/aria-prop/{children}) but is
//    used without a name → flag at the usage, point at the definition.
const crossIconOnlyUnnamed: CrossRule = {
  id: "cross-icon-only-unnamed",
  criteria: ["1.1", "6.2", "7.1"],
  severity: "bloquant",
  run(doc, graph) {
    const findings = [];
    for (const el of doc.elements) {
      if (!isComponentUsage(el)) continue;
      const def = resolveUsage(graph, doc.file, el.tag);
      if (!def?.rendersIconOnlyControl || !def.acceptsName) continue;
      if (usageHasName(el)) continue;
      findings.push({
        criteriaId: "7.1",
        el,
        message: `<${el.tag}> rend un contrôle à icône seule mais est utilisé sans nom accessible (aucun aria-label/title/texte passé).`,
        remediation: `Passez un nom au composant à cet endroit, p. ex. <${el.tag} aria-label="…" /> (le composant ${def.name} rend une icône sans texte).`,
        related: { file: def.file, line: def.line, col: def.col, selectorHint: def.name, note: "définition du composant à icône seule" },
      });
    }
    return { findings, suppress: [] };
  },
};

// 2) A document whose <html> has no lang, but a wrapper/layout it imports declares
//    one → suppress the missing-lang false positive.
const crossPageLang: CrossRule = {
  id: "cross-page-lang",
  criteria: ["8.3"],
  severity: "bloquant",
  run(doc, graph) {
    const suppress: Suppression[] = [];
    const html = doc.elements.find((e) => e.tag === "html");
    if (html && (attr(html, "lang") ?? "") === "" && htmlLangProvidedFor(graph, doc.file)) {
      suppress.push({ ruleId: "html-lang-missing", line: html.line, reason: "lang fourni par un layout/wrapper importé" });
    }
    return { findings: [], suppress };
  },
};

// 3) An intrinsic control/img that spreads {...props} can be named by its parent →
//    suppress single-file name-missing findings on it (the component def site).
const SUPPRESSIBLE_BY_SPREAD = ["icon-only-control-unnamed", "button-empty-name", "link-empty-name", "control-label-missing", "img-alt-missing"];
const crossAriaForwarding: CrossRule = {
  id: "cross-aria-forwarding",
  criteria: ["7.1"],
  severity: "bloquant",
  run(doc) {
    const suppress: Suppression[] = [];
    for (const el of doc.elements) {
      if (!el.spread || !isNameableControl(el)) continue;
      for (const ruleId of SUPPRESSIBLE_BY_SPREAD) suppress.push({ ruleId, line: el.line, reason: "nommable via {...props} au point d'utilisation" });
    }
    return { findings: [], suppress };
  },
};

// 4) A skip-link target that lives in another file (imported layout/component) →
//    suppress the in-page "broken anchor" false positive. Only on full documents
//    (mirrors skip-link-target-missing's page scope). A target defined NOWHERE is
//    left to the single-file rule (true positive).
const crossSkipLinkTarget: CrossRule = {
  id: "cross-skip-link-target",
  criteria: ["12.7"],
  severity: "majeur",
  run(doc, graph) {
    const suppress: Suppression[] = [];
    if (!isFullDocument(doc)) return { findings: [], suppress };
    const sameDocHas = (id: string): boolean => doc.byId.has(id) || doc.elements.some((e) => attr(e, "name") === id);
    for (const el of doc.elements) {
      if (el.tag !== "a") continue;
      const href = attr(el, "href") ?? "";
      if (!href.startsWith("#") || href === "#") continue;
      let id = href.slice(1);
      try {
        id = decodeURIComponent(id);
      } catch {
        /* keep raw */
      }
      if (sameDocHas(id)) continue; // single-file rule won't fire anyway
      if (idDefinedAnywhere(graph, id))
        suppress.push({ ruleId: "skip-link-target-missing", line: el.line, reason: `cible #${id} définie dans un autre fichier du graphe` });
    }
    return { findings: [], suppress };
  },
};

export const CROSS_RULES: CrossRule[] = [crossIconOnlyUnnamed, crossPageLang, crossAriaForwarding, crossSkipLinkTarget];

/** Rule ids that can raise a finding (for dataset/registry cross-checks). Suppressors
 *  raise none and are intentionally excluded. */
export function crossRuleIds(): string[] {
  return ["cross-icon-only-unnamed"];
}

export interface CrossRunResult {
  findings: Finding[];
  suppress: Suppression[];
}

export function runCrossRules(doc: Doc, graph: DepGraph): CrossRunResult {
  const findings: Finding[] = [];
  const suppress: Suppression[] = [];
  for (const rule of CROSS_RULES) {
    const r = rule.run(doc, graph);
    for (const cf of r.findings) findings.push(crossToFinding(doc, rule.id, rule.severity, cf));
    suppress.push(...r.suppress);
  }
  findings.sort((a, b) => a.line - b.line || a.col - b.col || SEVERITY_ORDER[a.severity]! - SEVERITY_ORDER[b.severity]!);
  return { findings, suppress };
}
