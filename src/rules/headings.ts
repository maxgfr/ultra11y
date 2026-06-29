// Theme 9 — Information structure (headings).
import type { Doc, El, HNode } from "../parse/html.js";
import { attr, elementsByTag } from "../parse/html.js";
import { isIntrinsic } from "../parse/jsx-bridge.js";
import { accessibleName, mayInjectContent } from "../name.js";
import type { Rule, RuleFinding } from "./rule.js";

// JSX/SFC only: true when a required element/content may be injected at runtime in a
// way static source analysis cannot see — a child component (non-intrinsic tag, which
// can render anything), a <slot>, or a {…}/{@render} expression child. Rules that
// assert "the page is missing X" must bail on these so a residual risk is never turned
// into a false non-conformity (e.g. a Next.js layout supplies its <h1> via {children}).
function contentMaybeInjected(doc: Doc): boolean {
  if (doc.kind === "html") return false; // plain HTML has no slots/components/expressions
  for (const el of doc.elements) {
    if (el.tag === "slot") return true;
    if (el.tag !== "#fragment" && !isIntrinsic(el.tag)) return true;
  }
  const stack: HNode[] = [...doc.roots];
  while (stack.length) {
    const n = stack.pop()!;
    if (n.type === "text") {
      if (n.data.includes("{")) return true; // {children}/{expr} — injected markup
    } else stack.push(...n.children);
  }
  return false;
}

function headingLevel(el: El): number | null {
  const m = /^h([1-6])$/.exec(el.tag);
  if (m) return Number(m[1]);
  if ((attr(el, "role") ?? "") === "heading") {
    const lvl = Number(attr(el, "aria-level"));
    if (Number.isInteger(lvl) && lvl >= 1) return lvl;
  }
  return null;
}

function headings(doc: Doc): { el: El; level: number }[] {
  const out: { el: El; level: number }[] = [];
  for (const el of doc.elements) {
    const lvl = headingLevel(el);
    if (lvl !== null) out.push({ el, level: lvl });
  }
  return out;
}

const headingOrderSkip: Rule = {
  id: "heading-order-skip",
  criteria: ["1.3.1"],
  severity: "majeur",
  run(doc: Doc): RuleFinding[] {
    const hs = headings(doc);
    const out: RuleFinding[] = [];
    let prev = 0;
    let prevArm: string | undefined;
    for (const { el, level } of hs) {
      // Only compare two headings that are in the SAME branch context: headings in
      // different JSX conditional arms are never both rendered, so a "skip" between
      // them is a flattening artefact, not a real order violation.
      if (prev !== 0 && el.branchArm === prevArm && level - prev > 1) {
        out.push({
          criteriaId: "1.3.1",
          el,
          message: `Saut de niveau de titre : <h${level}> après <h${prev}> (niveau h${prev + 1} attendu).`,
          remediation: `Ne sautez pas de niveau : enchaînez les titres sans omettre de palier.`,
        });
      }
      prev = level;
      prevArm = el.branchArm;
    }
    return out;
  },
};

const h1Missing: Rule = {
  id: "h1-missing",
  criteria: ["1.3.1"],
  severity: "majeur",
  scope: "page",
  run(doc: Doc): RuleFinding[] {
    const hasH1 = headings(doc).some((h) => h.level === 1);
    if (hasH1) return [];
    if (contentMaybeInjected(doc)) return []; // the h1 may be supplied by {children}/a child component
    const anchor = elementsByTag(doc, "body")[0] ?? elementsByTag(doc, "html")[0];
    if (!anchor) return [];
    return [
      {
        criteriaId: "1.3.1",
        el: anchor,
        message: `Aucun <h1> dans la page — le titre principal de niveau 1 est manquant.`,
        remediation: `Ajoutez un <h1> décrivant le contenu principal de la page.`,
      },
    ];
  },
};

const h1Multiple: Rule = {
  id: "h1-multiple",
  criteria: ["1.3.1"],
  severity: "mineur",
  scope: "page",
  run(doc: Doc): RuleFinding[] {
    const h1s = elementsByTag(doc, "h1");
    if (h1s.length <= 1) return [];
    return h1s.slice(1).map((el) => ({
      criteriaId: "1.3.1",
      el,
      message: `Plusieurs <h1> dans la page (${h1s.length}) — un seul titre de niveau 1 est recommandé.`,
      remediation: `Conservez un unique <h1> et hiérarchisez le reste avec h2…h6.`,
    }));
  },
};

// <slot> is allowed: it projects slotted <li>s (web components / SFC templates).
const ALLOWED_IN_LIST = new Set(["li", "script", "template", "slot"]);

const listStructure: Rule = {
  id: "list-structure",
  criteria: ["1.3.1"],
  severity: "majeur",
  run(doc: Doc): RuleFinding[] {
    const out: RuleFinding[] = [];
    for (const el of doc.elements) {
      if (el.tag === "ul" || el.tag === "ol") {
        // Only intrinsic (HTML) children are a definite violation; a PascalCase
        // component child may itself render an <li>, so it is left to the cross-file
        // graph / human, never asserted here.
        const bad = el.children.find((c) => c.type === "element" && isIntrinsic(c.tag) && !ALLOWED_IN_LIST.has(c.tag));
        if (bad && bad.type === "element") {
          out.push({
            criteriaId: "1.3.1",
            el: bad,
            message: `<${bad.tag}> enfant direct de <${el.tag}> — une liste ne doit contenir que des <li>.`,
            remediation: `Enveloppez le contenu dans des <li>, ou utilisez un autre élément que <${el.tag}>.`,
          });
        }
      } else if (el.tag === "li") {
        const parent = el.parent;
        if (parent && !["ul", "ol", "menu"].includes(parent.tag)) {
          out.push({
            criteriaId: "1.3.1",
            el,
            message: `<li> hors d'une liste (<${parent.tag}> parent) — structure de liste invalide.`,
            remediation: `Placez chaque <li> directement dans un <ul>, <ol> ou <menu>.`,
          });
        }
      }
    }
    return out;
  },
};

const emptyHeading: Rule = {
  id: "empty-heading",
  criteria: ["1.3.1"],
  severity: "majeur",
  run(doc: Doc): RuleFinding[] {
    const out: RuleFinding[] = [];
    for (const { el, level } of headings(doc)) {
      if (attr(el, "aria-hidden") === "true") continue;
      if (accessibleName(el, doc)) continue;
      if (mayInjectContent(el)) continue; // text supplied by a <slot>/child component
      out.push({
        criteriaId: "1.3.1",
        el,
        message: `Titre <${el.tag}> de niveau ${level} vide — un titre sans intitulé désoriente la navigation au clavier/lecteur d'écran.`,
        remediation: `Donnez un intitulé textuel au titre, ou retirez-le s'il est purement décoratif.`,
      });
    }
    return out;
  },
};

export const headingsRules: Rule[] = [headingOrderSkip, h1Missing, h1Multiple, listStructure, emptyHeading];
