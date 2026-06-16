// Theme 8 — Mandatory elements (the statically-checkable slice).
import type { Doc, El } from "../parse/html.js";
import { attr, hasAttr, visibleText, allIds, elementsByTag } from "../parse/html.js";
import type { Rule, RuleFinding } from "./rule.js";

const htmlLangMissing: Rule = {
  id: "html-lang-missing",
  criteria: ["8.3"],
  parser: ["html", "jsx"],
  severity: "bloquant",
  scope: "page",
  run(doc: Doc): RuleFinding[] {
    const html = elementsByTag(doc, "html")[0];
    if (!html) return [];
    const lang = (attr(html, "lang") ?? attr(html, "xml:lang") ?? "").trim();
    if (lang) return [];
    return [
      {
        criteriaId: "8.3",
        el: html,
        message: `<html> sans attribut lang — la langue par défaut de la page n'est pas déclarée.`,
        remediation: `Ajoutez lang sur <html>, ex. <html lang="fr">.`,
      },
    ];
  },
};

const titleMissingEmpty: Rule = {
  id: "title-missing-empty",
  criteria: ["8.5"],
  parser: ["html", "jsx"],
  severity: "bloquant",
  scope: "page",
  run(doc: Doc): RuleFinding[] {
    const titles = elementsByTag(doc, "title");
    const hasNonEmpty = titles.some((t) => visibleText(t).length > 0);
    if (hasNonEmpty) return [];
    const anchor: El | undefined = elementsByTag(doc, "head")[0] ?? elementsByTag(doc, "html")[0] ?? doc.elements[0];
    if (!anchor) return [];
    return [
      {
        criteriaId: "8.5",
        el: anchor,
        message: titles.length ? `<title> vide — le titre de la page est absent de contenu.` : `<title> absent — la page n'a pas de titre.`,
        remediation: `Ajoutez un <title> non vide et pertinent dans <head>.`,
      },
    ];
  },
};

const duplicateId: Rule = {
  id: "duplicate-id",
  criteria: ["8.2"],
  parser: ["html", "jsx"],
  severity: "majeur",
  run(doc: Doc): RuleFinding[] {
    const seen = new Map<string, number>();
    const out: RuleFinding[] = [];
    for (const { id, el } of allIds(doc)) {
      const n = (seen.get(id) ?? 0) + 1;
      seen.set(id, n);
      if (n > 1) {
        out.push({
          criteriaId: "8.2",
          el,
          message: `id="${id}" dupliqué — un id doit être unique dans la page (HTML invalide).`,
          remediation: `Donnez un id unique à chaque élément ; ajustez les références (label[for], aria-*).`,
        });
      }
    }
    return out;
  },
};

const inlineLangChangeMissing: Rule = {
  id: "inline-lang-change-missing",
  criteria: ["8.7"],
  parser: ["html", "jsx"],
  severity: "mineur",
  run(doc: Doc): RuleFinding[] {
    const out: RuleFinding[] = [];
    for (const el of doc.elements) {
      if (el.tag === "html") continue;
      if (!hasAttr(el, "lang")) continue;
      if ((attr(el, "lang") ?? "").trim() === "") {
        out.push({
          criteriaId: "8.7",
          el,
          message: `Attribut lang vide sur <${el.tag}> — changement de langue mal indiqué.`,
          remediation: `Renseignez un code de langue valide (ex. lang="en") ou retirez l'attribut.`,
        });
      }
    }
    return out;
  },
};

// BCP47 primary subtag + optional subtags (syntactic validity only).
const BCP47 = /^[A-Za-z]{2,3}(-[A-Za-z0-9]{1,8})*$/;

const langInvalid: Rule = {
  id: "lang-invalid",
  criteria: ["8.4", "8.8"],
  parser: ["html", "jsx"],
  severity: "mineur",
  run(doc: Doc): RuleFinding[] {
    const out: RuleFinding[] = [];
    for (const el of doc.elements) {
      const lang = (attr(el, "lang") ?? "").trim();
      if (!lang) continue; // empty handled by inline-lang-change-missing / html-lang-missing
      if (BCP47.test(lang)) continue;
      out.push({
        criteriaId: el.tag === "html" ? "8.4" : "8.8",
        el,
        message: `Code de langue invalide lang="${lang}" sur <${el.tag}> — n'est pas un code BCP 47 valide.`,
        remediation: `Utilisez un code de langue valide (ex. "fr", "en", "fr-CA").`,
      });
    }
    return out;
  },
};

export const mandatoryRules: Rule[] = [htmlLangMissing, titleMissingEmpty, duplicateId, inlineLangChangeMissing, langInvalid];
