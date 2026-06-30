// Theme 6 / 7 — Links & buttons: accessible-name presence (empty-name + icon-only).
import type { Doc, El } from "../parse/html.js";
import { attr, hasAttr, descendants, visibleText } from "../parse/html.js";
import { accessibleName, mayInjectContent } from "../name.js";
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
  criteria: ["2.4.4"],
  severity: "bloquant",
  run(doc: Doc): RuleFinding[] {
    const out: RuleFinding[] = [];
    for (const el of doc.elements) {
      if (el.tag !== "a" || !hasAttr(el, "href")) continue;
      if (attr(el, "aria-hidden") === "true") continue;
      if (accessibleName(el, doc) !== "") continue;
      if (mayInjectContent(el)) continue; // name supplied by a <slot>/child component
      if (hasIconChild(el)) continue; // handled by icon-only-control-unnamed
      out.push({
        criteriaId: "2.4.4",
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
  criteria: ["4.1.2"],
  severity: "bloquant",
  run(doc: Doc): RuleFinding[] {
    const out: RuleFinding[] = [];
    for (const el of doc.elements) {
      if (!isButton(el)) continue;
      if (attr(el, "aria-hidden") === "true") continue;
      if (accessibleName(el, doc) !== "") continue;
      if (mayInjectContent(el)) continue; // name supplied by a <slot>/child component
      if (hasIconChild(el)) continue; // handled by icon-only-control-unnamed
      out.push({
        criteriaId: "4.1.2",
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
  criteria: ["2.4.4", "4.1.2"],
  severity: "bloquant",
  run(doc: Doc): RuleFinding[] {
    const out: RuleFinding[] = [];
    for (const el of doc.elements) {
      const link = el.tag === "a" && hasAttr(el, "href");
      const button = isButton(el);
      if (!link && !button) continue;
      if (attr(el, "aria-hidden") === "true") continue;
      if (accessibleName(el, doc) !== "") continue;
      if (mayInjectContent(el)) continue; // name supplied by a <slot>/child component
      if (!hasIconChild(el)) continue;
      out.push({
        criteriaId: link ? "2.4.4" : "4.1.2",
        el,
        message: `${link ? "Lien" : "Bouton"} avec une icône seule (img/svg/i) sans nom accessible.`,
        remediation: `Ajoutez un alt/aria-label sur l'icône ou un texte masqué visuellement (classe visually-hidden).`,
      });
    }
    return out;
  },
};

// A link/button whose ONLY accessible name comes from the title attribute. `title` is
// restituted unreliably (hover only — not on touch, often not by keyboard/AT), so a control
// named solely by it is effectively unlabeled in practice. (link-empty-name/button-empty-name
// skip these because title technically yields a name, so this rule covers the gap.)
const controlNameTitleOnly: Rule = {
  id: "control-name-title-only",
  criteria: ["4.1.2"],
  severity: "mineur",
  run(doc: Doc): RuleFinding[] {
    const out: RuleFinding[] = [];
    for (const el of doc.elements) {
      const link = el.tag === "a" && hasAttr(el, "href");
      if (!link && !isButton(el)) continue;
      if (attr(el, "aria-hidden") === "true") continue;
      const title = (attr(el, "title") ?? "").trim();
      if (!title || title.includes("{")) continue; // no title, or dynamic value
      if (hasAttr(el, "aria-label") || hasAttr(el, "aria-labelledby")) continue; // named by ARIA, title is supplementary
      if (mayInjectContent(el)) continue; // name may come from a <slot>/child component
      if (el.tag === "input" && (attr(el, "value") ?? "").trim()) continue; // value names the button
      const hasContentName =
        visibleText(el).trim() !== "" ||
        descendants(el).some(
          (d) =>
            (d.tag === "img" && (attr(d, "alt") ?? "").trim() !== "") ||
            (d.tag === "svg" && descendants(d).some((x) => x.tag === "title" && visibleText(x).trim() !== "")),
        );
      if (hasContentName) continue; // visible text / named image already provides the name
      out.push({
        criteriaId: "4.1.2",
        el,
        message: `${link ? "Lien" : "Bouton"} dont le seul nom accessible vient de l'attribut title — title n'est pas restitué de façon fiable (survol uniquement).`,
        remediation: `Donnez un intitulé via texte visible ou aria-label ; réservez title à une information complémentaire.`,
      });
    }
    return out;
  },
};

export const linksRules: Rule[] = [linkEmptyName, buttonEmptyName, iconOnlyControlUnnamed, controlNameTitleOnly];
