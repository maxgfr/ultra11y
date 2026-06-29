// Theme 7 — Scripts / ARIA correctness (the statically-checkable slice).
import type { Doc, El } from "../parse/html.js";
import { attr, hasAttr, descendants, ancestors } from "../parse/html.js";
import type { Rule, RuleFinding } from "./rule.js";

const INTERACTIVE_ROLES = [
  "button",
  "link",
  "checkbox",
  "radio",
  "tab",
  "menuitem",
  "menuitemcheckbox",
  "menuitemradio",
  "option",
  "switch",
  "textbox",
  "combobox",
  "slider",
  "spinbutton",
];

function isInteractive(el: El): boolean {
  if (el.tag === "a") return hasAttr(el, "href");
  if (["button", "select", "textarea"].includes(el.tag)) return true;
  if (el.tag === "input") return (attr(el, "type") ?? "text").toLowerCase() !== "hidden";
  return INTERACTIVE_ROLES.includes((attr(el, "role") ?? "").trim());
}

function isFocusable(el: El): boolean {
  if (isInteractive(el)) return true;
  const ti = attr(el, "tabindex");
  if (ti !== undefined && Number(ti) >= 0) return true;
  return hasAttr(el, "contenteditable") && attr(el, "contenteditable") !== "false";
}

// Concrete WAI-ARIA 1.2 roles (abstract roles like "widget"/"range" are invalid as author values).
const VALID_ROLES = new Set([
  "alert",
  "alertdialog",
  "application",
  "article",
  "banner",
  "blockquote",
  "button",
  "caption",
  "cell",
  "checkbox",
  "code",
  "columnheader",
  "combobox",
  "complementary",
  "contentinfo",
  "definition",
  "deletion",
  "dialog",
  "directory",
  "document",
  "emphasis",
  "feed",
  "figure",
  "form",
  "generic",
  "grid",
  "gridcell",
  "group",
  "heading",
  "img",
  "insertion",
  "link",
  "list",
  "listbox",
  "listitem",
  "log",
  "main",
  "marquee",
  "math",
  "menu",
  "menubar",
  "menuitem",
  "menuitemcheckbox",
  "menuitemradio",
  "meter",
  "navigation",
  "none",
  "note",
  "option",
  "paragraph",
  "presentation",
  "progressbar",
  "radio",
  "radiogroup",
  "region",
  "row",
  "rowgroup",
  "rowheader",
  "scrollbar",
  "search",
  "searchbox",
  "separator",
  "slider",
  "spinbutton",
  "status",
  "strong",
  "subscript",
  "superscript",
  "switch",
  "tab",
  "table",
  "tablist",
  "tabpanel",
  "term",
  "textbox",
  "time",
  "timer",
  "toolbar",
  "tooltip",
  "tree",
  "treegrid",
  "treeitem",
]);

const IDREF_ATTRS = ["aria-labelledby", "aria-describedby", "aria-controls", "aria-owns", "aria-details", "aria-errormessage", "aria-flowto"];
const IDREF_SINGLE = ["aria-activedescendant"];

const invalidAriaRole: Rule = {
  id: "invalid-aria-role",
  criteria: ["4.1.2"],
  parser: ["html", "jsx"],
  severity: "majeur",
  run(doc: Doc): RuleFinding[] {
    const out: RuleFinding[] = [];
    for (const el of doc.elements) {
      const role = (attr(el, "role") ?? "").trim();
      if (!role) continue;
      const tokens = role.split(/\s+/);
      const bad = tokens.filter((t) => !VALID_ROLES.has(t.toLowerCase()));
      if (bad.length) {
        out.push({
          criteriaId: "4.1.2",
          el,
          message: `Rôle ARIA invalide : "${bad.join(" ")}" n'est pas un rôle WAI-ARIA valide.`,
          remediation: `Utilisez un rôle ARIA valide ou un élément HTML natif équivalent.`,
        });
      }
    }
    return out;
  },
};

const ariaRefMissingId: Rule = {
  id: "aria-ref-missing-id",
  criteria: ["4.1.2"],
  parser: ["html", "jsx"],
  severity: "bloquant",
  run(doc: Doc): RuleFinding[] {
    const out: RuleFinding[] = [];
    for (const el of doc.elements) {
      const refs: { attr: string; ids: string[] }[] = [];
      for (const a of IDREF_ATTRS) {
        const v = attr(el, a);
        if (v) refs.push({ attr: a, ids: v.split(/\s+/).filter(Boolean) });
      }
      for (const a of IDREF_SINGLE) {
        const v = (attr(el, a) ?? "").trim();
        if (v) refs.push({ attr: a, ids: [v] });
      }
      for (const { attr: a, ids } of refs) {
        const missing = ids.filter((id) => !doc.byId.has(id));
        if (missing.length) {
          out.push({
            criteriaId: "4.1.2",
            el,
            message: `${a} référence un id inexistant : ${missing.map((m) => `#${m}`).join(", ")}.`,
            remediation: `Corrigez la référence ou ajoutez l'élément cible avec l'id attendu.`,
          });
        }
      }
    }
    return out;
  },
};

// implicit roles that make role="…" redundant
const IMPLICIT_ROLE: Record<string, string> = {
  button: "button",
  nav: "navigation",
  main: "main",
  ul: "list",
  ol: "list",
  li: "listitem",
  table: "table",
  h1: "heading",
  h2: "heading",
  h3: "heading",
  h4: "heading",
  h5: "heading",
  h6: "heading",
  form: "form",
  article: "article",
  aside: "complementary",
  dialog: "dialog",
  figure: "figure",
};

const redundantAria: Rule = {
  id: "redundant-aria",
  criteria: ["4.1.2"],
  parser: ["html", "jsx"],
  severity: "mineur",
  run(doc: Doc): RuleFinding[] {
    const out: RuleFinding[] = [];
    for (const el of doc.elements) {
      const role = (attr(el, "role") ?? "").trim().toLowerCase();
      if (!role) continue;
      let implicit = IMPLICIT_ROLE[el.tag];
      if (el.tag === "a" && hasAttr(el, "href")) implicit = "link";
      if (implicit && implicit === role) {
        out.push({
          criteriaId: "4.1.2",
          el,
          message: `role="${role}" est redondant : <${el.tag}> a déjà ce rôle implicite.`,
          remediation: `Retirez l'attribut role redondant et laissez la sémantique native.`,
        });
      }
    }
    return out;
  },
};

const NONINTERACTIVE = new Set(["div", "span"]);

const clickableNoninteractive: Rule = {
  id: "clickable-noninteractive",
  criteria: ["4.1.2", "2.1.1"],
  parser: ["html", "jsx"],
  severity: "majeur",
  run(doc: Doc): RuleFinding[] {
    const out: RuleFinding[] = [];
    for (const el of doc.elements) {
      if (!NONINTERACTIVE.has(el.tag)) continue;
      if (!hasAttr(el, "onclick")) continue;
      const role = (attr(el, "role") ?? "").trim();
      const hasTab = hasAttr(el, "tabindex");
      const interactiveRole = ["button", "link", "checkbox", "tab", "menuitem", "switch", "option"].includes(role);
      if (interactiveRole && hasTab) continue; // properly upgraded
      const noKeyboard = !hasTab;
      out.push({
        criteriaId: noKeyboard ? "2.1.1" : "4.1.2",
        el,
        message: `<${el.tag}> avec onClick mais ${noKeyboard ? "non focalisable (tabindex absent)" : "sans rôle interactif"} — contrôle non accessible au clavier/AT.`,
        remediation: `Utilisez <button>/<a> natif, ou ajoutez role + tabindex="0" + gestion clavier (Enter/Espace).`,
      });
    }
    return out;
  },
};

const REQUIRED_CHILDREN: Record<string, string[]> = {
  list: ["listitem"],
  tablist: ["tab"],
  radiogroup: ["radio"],
  tree: ["treeitem"],
  menu: ["menuitem", "menuitemcheckbox", "menuitemradio"],
  menubar: ["menuitem", "menuitemcheckbox", "menuitemradio"],
};

function satisfiesChild(d: El, reqRoles: string[]): boolean {
  const role = (attr(d, "role") ?? "").trim();
  if (reqRoles.includes(role)) return true;
  if (reqRoles.includes("listitem") && d.tag === "li") return true;
  if (reqRoles.includes("radio") && d.tag === "input" && (attr(d, "type") ?? "").toLowerCase() === "radio") return true;
  return false;
}

const ariaRequiredChildren: Rule = {
  id: "aria-required-children",
  criteria: ["4.1.2"],
  parser: ["html", "jsx"],
  severity: "majeur",
  run(doc: Doc): RuleFinding[] {
    const out: RuleFinding[] = [];
    for (const el of doc.elements) {
      const role = (attr(el, "role") ?? "").trim();
      const req = REQUIRED_CHILDREN[role];
      if (!req) continue;
      if (hasAttr(el, "aria-owns")) continue; // children may be referenced elsewhere
      if (descendants(el).some((d) => satisfiesChild(d, req))) continue;
      out.push({
        criteriaId: "4.1.2",
        el,
        message: `role="${role}" sans enfant requis (${req.join("/")}) — structure ARIA incomplète.`,
        remediation: `Ajoutez les éléments enfants au rôle approprié, ou utilisez les éléments HTML natifs.`,
      });
    }
    return out;
  },
};

const ariaHiddenFocusable: Rule = {
  id: "aria-hidden-focusable",
  criteria: ["4.1.2"],
  parser: ["html", "jsx"],
  severity: "majeur",
  run(doc: Doc): RuleFinding[] {
    const out: RuleFinding[] = [];
    for (const el of doc.elements) {
      if (attr(el, "aria-hidden") !== "true") continue;
      const focusableHere = isFocusable(el) || descendants(el).some(isFocusable);
      if (!focusableHere) continue;
      out.push({
        criteriaId: "4.1.2",
        el,
        message: `aria-hidden="true" sur (ou contenant) un élément focalisable — piège pour les technologies d'assistance.`,
        remediation: `Retirez aria-hidden, ou rendez l'élément non focalisable (tabindex="-1", disabled).`,
      });
    }
    return out;
  },
};

const nestedInteractive: Rule = {
  id: "nested-interactive",
  criteria: ["4.1.2"],
  parser: ["html", "jsx"],
  severity: "majeur",
  run(doc: Doc): RuleFinding[] {
    const out: RuleFinding[] = [];
    for (const el of doc.elements) {
      if (!isInteractive(el)) continue;
      if (!ancestors(el).some(isInteractive)) continue;
      out.push({
        criteriaId: "4.1.2",
        el,
        message: `Élément interactif <${el.tag}> imbriqué dans un autre élément interactif — non restitué correctement.`,
        remediation: `Ne pas imbriquer des contrôles interactifs (lien/bouton) ; mettez-les côte à côte.`,
      });
    }
    return out;
  },
};

export const scriptsAriaRules: Rule[] = [
  invalidAriaRole,
  ariaRefMissingId,
  redundantAria,
  clickableNoninteractive,
  ariaRequiredChildren,
  ariaHiddenFocusable,
  nestedInteractive,
];
