// Theme 12 — Navigation + page landmarks (statically-checkable slice).
import type { Doc, El } from "../parse/html.js";
import { attr, elementsByTag, hasAttr } from "../parse/html.js";
import { isIntrinsic } from "../parse/jsx-bridge.js";
import { type Rule, type RuleFinding, shellBodyInjected } from "./rule.js";

// JSX/SFC: a child component or a `{children}`/`{expr}` child may inject the <main> at
// runtime (a Next.js layout supplies <main> via {children}). Never assert "no main" then.
function contentMaybeInjected(doc: Doc): boolean {
  if (doc.kind === "html") return false;
  return doc.elements.some((e) => e.tag === "slot" || (e.tag !== "#fragment" && !isIntrinsic(e.tag)));
}

/** Visible <main>/role="main" landmarks (aria-hidden ones don't count). */
function mainLandmarks(doc: Doc): El[] {
  return doc.elements.filter((e) => {
    if (attr(e, "aria-hidden") === "true") return false;
    if (e.tag === "main") return true;
    return (attr(e, "role") ?? "").trim().toLowerCase() === "main";
  });
}

const skipLinkTargetMissing: Rule = {
  id: "skip-link-target-missing",
  criteria: ["2.4.1"],
  severity: "majeur",
  scope: "page",
  run(doc: Doc): RuleFinding[] {
    const out: RuleFinding[] = [];
    const hasName = (id: string): boolean => doc.byId.has(id) || doc.elements.some((e) => attr(e, "name") === id);
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
      if (hasName(id)) continue;
      out.push({
        criteriaId: "2.4.1",
        el,
        msgId: "skip-link-target-missing",
        params: { href, id },
        // In a JSX/SFC component the target id often lives in a sibling/parent component
        // resolved at composition time (or via --graph). Single-file source can't prove it
        // missing, so flag it provisional rather than a hard NC. Full HTML pages stay firm.
        preliminary: doc.kind !== "html",
      });
    }
    return out;
  },
};

const positiveTabindex: Rule = {
  id: "positive-tabindex",
  criteria: ["2.4.3"],
  severity: "majeur",
  run(doc: Doc): RuleFinding[] {
    const out: RuleFinding[] = [];
    for (const el of doc.elements) {
      if (!hasAttr(el, "tabindex")) continue;
      const ti = Number((attr(el, "tabindex") ?? "").trim());
      if (Number.isInteger(ti) && ti > 0) {
        out.push({
          criteriaId: "2.4.3",
          el,
          msgId: "positive-tabindex",
          params: { value: ti },
        });
      }
    }
    return out;
  },
};

// A full page must expose its primary content in a <main> landmark so AT users can jump
// to it (and skip links have a target). Page-scoped: never runs on fragments/components.
const missingMainLandmark: Rule = {
  id: "missing-main-landmark",
  criteria: ["1.3.1"],
  severity: "majeur",
  scope: "page",
  run(doc: Doc): RuleFinding[] {
    if (mainLandmarks(doc).length > 0) return [];
    if (contentMaybeInjected(doc) || shellBodyInjected(doc)) return []; // <main> may be injected at runtime
    const anchor = elementsByTag(doc, "body")[0] ?? elementsByTag(doc, "html")[0];
    if (!anchor) return [];
    return [
      {
        criteriaId: "1.3.1",
        el: anchor,
        msgId: "missing-main-landmark",
      },
    ];
  },
};

const multipleMainLandmark: Rule = {
  id: "multiple-main-landmark",
  criteria: ["1.3.1"],
  severity: "majeur",
  scope: "page",
  run(doc: Doc): RuleFinding[] {
    const mains = mainLandmarks(doc);
    if (mains.length <= 1) return [];
    return mains.slice(1).map((el) => ({
      criteriaId: "1.3.1",
      el,
      msgId: "multiple-main-landmark",
      params: { count: mains.length },
    }));
  },
};

export const navigationRules: Rule[] = [skipLinkTargetMissing, positiveTabindex, missingMainLandmark, multipleMainLandmark];
