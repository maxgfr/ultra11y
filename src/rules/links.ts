// Theme 6 / 7 — Links & buttons: accessible-name presence (empty-name + icon-only).
import type { Doc, El } from "../parse/html.js";
import { attr, hasAttr, descendants, visibleText } from "../parse/html.js";
import { accessibleName } from "../name.js";
import type { Rule, RuleFinding } from "./rule.js";

function hasIconChild(el: El): boolean {
  return descendants(el).some((d) => {
    if (d.tag === "img") {
      const a = attr(d, "alt");
      return a === undefined || a.trim() === "";
    }
    if (d.tag === "svg") {
      const titled = descendants(d).some((x) => x.tag === "title" && visibleText(x));
      return !titled && !(attr(d, "aria-label") ?? "").trim();
    }
    if (d.tag === "i") return /(^|\s|-)(icon|fa|glyphicon|material-icons)/.test((attr(d, "class") ?? "").toLowerCase());
    return false;
  });
}

const isButton = (el: El): boolean => {
  if (el.tag === "button") return true;
  if ((attr(el, "role") ?? "") === "button") return true;
  if (el.tag === "input") return (attr(el, "type") ?? "").toLowerCase() === "button";
  return false;
};

const linkEmptyName: Rule = {
  id: "link-empty-name",
  criteria: ["6.2"],
  parser: ["html", "jsx"],
  severity: "bloquant",
  run(doc: Doc): RuleFinding[] {
    const out: RuleFinding[] = [];
    for (const el of doc.elements) {
      if (el.tag !== "a" || !hasAttr(el, "href")) continue;
      if (attr(el, "aria-hidden") === "true") continue;
      if (accessibleName(el, doc) !== "") continue;
      if (hasIconChild(el)) continue; // handled by icon-only-control-unnamed
      out.push({
        criteriaId: "6.2",
        el,
        message: `Lien sans intitulé — aucun nom accessible.`,
        remediation: `Donnez un intitulé textuel au lien (texte visible, ou aria-label si vraiment nécessaire).`,
      });
    }
    return out;
  },
};

const buttonEmptyName: Rule = {
  id: "button-empty-name",
  criteria: ["7.1"],
  parser: ["html", "jsx"],
  severity: "bloquant",
  run(doc: Doc): RuleFinding[] {
    const out: RuleFinding[] = [];
    for (const el of doc.elements) {
      if (!isButton(el)) continue;
      if (attr(el, "aria-hidden") === "true") continue;
      if (accessibleName(el, doc) !== "") continue;
      if (hasIconChild(el)) continue; // handled by icon-only-control-unnamed
      out.push({
        criteriaId: "7.1",
        el,
        message: `Bouton sans intitulé — aucun nom accessible.`,
        remediation: `Donnez un intitulé au bouton (texte, value, ou aria-label).`,
      });
    }
    return out;
  },
};

const iconOnlyControlUnnamed: Rule = {
  id: "icon-only-control-unnamed",
  criteria: ["1.1", "6.2", "7.1"],
  parser: ["html", "jsx"],
  severity: "bloquant",
  run(doc: Doc): RuleFinding[] {
    const out: RuleFinding[] = [];
    for (const el of doc.elements) {
      const link = el.tag === "a" && hasAttr(el, "href");
      const button = isButton(el);
      if (!link && !button) continue;
      if (attr(el, "aria-hidden") === "true") continue;
      if (accessibleName(el, doc) !== "") continue;
      if (!hasIconChild(el)) continue;
      out.push({
        criteriaId: link ? "6.2" : "7.1",
        el,
        message: `${link ? "Lien" : "Bouton"} avec une icône seule (img/svg/i) sans nom accessible.`,
        remediation: `Ajoutez un alt/aria-label sur l'icône ou un texte masqué visuellement (classe visually-hidden).`,
      });
    }
    return out;
  },
};

export const linksRules: Rule[] = [linkEmptyName, buttonEmptyName, iconOnlyControlUnnamed];
