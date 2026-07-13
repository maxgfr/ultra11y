// Theme 12 — Navigation + page landmarks (statically-checkable slice).
import type { Doc, El } from "../parse/html.js";
import { attr, descendants, elementsByTag, hasAttr, hasBoundAttr, hasDynamicSpread } from "../parse/html.js";
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

/** Visible <nav>/role="navigation" landmarks (aria-hidden ones don't count). */
function navLandmarks(doc: Doc): El[] {
  return doc.elements.filter((e) => {
    if (attr(e, "aria-hidden") === "true") return false;
    if (e.tag === "nav") return true;
    return (attr(e, "role") ?? "").trim().toLowerCase() === "navigation";
  });
}

/** A <nav> carries a distinguishing accessible name (literal or dynamically bound). */
function navIsNamed(el: El): boolean {
  if ((attr(el, "aria-label") ?? "").trim() || hasAttr(el, "aria-labelledby")) return true;
  if (hasBoundAttr(el, "aria-label") || hasBoundAttr(el, "aria-labelledby")) return true; // value injected at runtime
  return hasDynamicSpread(el); // a spread may inject aria-label — can't prove it unnamed
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
      // HTML parses tabindex with integer rules (parseInt), so "1.5" is a positive 1.
      const ti = Number.parseInt((attr(el, "tabindex") ?? "").trim(), 10);
      if (ti > 0) {
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

// A full content page whose navigation links sit in a header/aside cluster with NO
// <nav>/role="navigation" landmark anywhere — AT users cannot reach a "navigation" region
// (RGAA 9.2/12.6). Conservative to stay precise: requires a real content page (<main>), a
// DENSE link cluster (≥4 links) inside a single <header>/<aside>, and ZERO nav landmarks.
const NAV_CLUSTER_MIN = 4;

const navLandmarkMissing: Rule = {
  id: "nav-landmark-missing",
  criteria: ["1.3.1"],
  severity: "majeur",
  scope: "page",
  run(doc: Doc): RuleFinding[] {
    if (navLandmarks(doc).length > 0) return []; // a navigation region already exists
    if (mainLandmarks(doc).length === 0) return []; // not a real content page — don't assert
    if (contentMaybeInjected(doc) || shellBodyInjected(doc)) return []; // <nav> may be injected at runtime
    for (const el of doc.elements) {
      if (el.tag !== "header" && el.tag !== "aside") continue;
      const links = descendants(el).filter((d) => d.tag === "a" && hasAttr(d, "href"));
      if (links.length >= NAV_CLUSTER_MIN) {
        return [
          {
            criteriaId: "1.3.1",
            el,
            msgId: "nav-landmark-missing",
            params: { count: links.length, region: el.tag },
          },
        ];
      }
    }
    return [];
  },
};

// ≥2 navigation regions where at least one lacks a distinguishing accessible name — AT
// users cannot tell them apart (RGAA 12.6). Fires only on the unnamed landmark(s); a
// single unnamed <nav> is fine (nothing to disambiguate) and never fires.
const navLandmarkUnnamed: Rule = {
  id: "nav-landmark-unnamed",
  criteria: ["1.3.1"],
  severity: "mineur",
  scope: "page",
  run(doc: Doc): RuleFinding[] {
    const navs = navLandmarks(doc);
    if (navs.length < 2) return [];
    return navs.filter((n) => !navIsNamed(n)).map((el) => ({ criteriaId: "1.3.1", el, msgId: "nav-landmark-unnamed" }));
  },
};

export const navigationRules: Rule[] = [
  skipLinkTargetMissing,
  positiveTabindex,
  missingMainLandmark,
  multipleMainLandmark,
  navLandmarkMissing,
  navLandmarkUnnamed,
];
