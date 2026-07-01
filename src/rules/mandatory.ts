// Theme 8 — Mandatory elements (the statically-checkable slice).
import type { Doc, El } from "../parse/html.js";
import { attr, hasAttr, visibleText, allIds, elementsByTag } from "../parse/html.js";
import { type Rule, type RuleFinding, shellHeadInjected } from "./rule.js";

// Next.js App Router sets the document <title> via `export const metadata = { title }`
// or `generateMetadata`, not a literal <title> in JSX — invisible to source analysis.
// When that API is present in a JSX/TSX file, the title is managed by the framework, so
// title-missing-empty must not assert a (false) non-conformity.
const NEXT_METADATA = /export\s+(const\s+metadata\b|(async\s+)?function\s+generateMetadata\b)/;
function titleSetByFramework(doc: Doc): boolean {
  if (doc.kind === "html") return false;
  return NEXT_METADATA.test(doc.source) && /\btitle\s*:/.test(doc.source);
}

const htmlLangMissing: Rule = {
  id: "html-lang-missing",
  criteria: ["3.1.1"],
  severity: "bloquant",
  scope: "page",
  run(doc: Doc): RuleFinding[] {
    const html = elementsByTag(doc, "html")[0];
    if (!html) return [];
    const lang = (attr(html, "lang") ?? attr(html, "xml:lang") ?? "").trim();
    if (lang) return [];
    return [
      {
        criteriaId: "3.1.1",
        el: html,
        message: `<html> sans attribut lang — la langue par défaut de la page n'est pas déclarée.`,
        remediation: `Ajoutez lang sur <html>, ex. <html lang="fr">.`,
      },
    ];
  },
};

const titleMissingEmpty: Rule = {
  id: "title-missing-empty",
  criteria: ["2.4.2"],
  severity: "bloquant",
  scope: "page",
  run(doc: Doc): RuleFinding[] {
    const titles = elementsByTag(doc, "title");
    const hasNonEmpty = titles.some((t) => visibleText(t).length > 0);
    if (hasNonEmpty) return [];
    // <title> injected by the Next.js metadata API, or by a framework shell placeholder
    // in <head> (e.g. SvelteKit `%sveltekit.head%`, `<%= title %>`).
    if (titleSetByFramework(doc) || shellHeadInjected(doc)) return [];
    const anchor: El | undefined = elementsByTag(doc, "head")[0] ?? elementsByTag(doc, "html")[0] ?? doc.elements[0];
    if (!anchor) return [];
    return [
      {
        criteriaId: "2.4.2",
        el: anchor,
        message: titles.length ? `<title> vide — le titre de la page est absent de contenu.` : `<title> absent — la page n'a pas de titre.`,
        remediation: `Ajoutez un <title> non vide et pertinent dans <head>.`,
      },
    ];
  },
};

const duplicateId: Rule = {
  id: "duplicate-id",
  criteria: ["4.1.2"],
  severity: "majeur",
  run(doc: Doc): RuleFinding[] {
    const seen = new Map<string, number>();
    const out: RuleFinding[] = [];
    for (const { id, el } of allIds(doc)) {
      if (id.includes("{")) continue; // dynamic id (id={`x-${i}`}/id="x-{id}") — unique per instance at runtime
      const n = (seen.get(id) ?? 0) + 1;
      seen.set(id, n);
      if (n > 1) {
        out.push({
          criteriaId: "4.1.2",
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
  criteria: ["3.1.2"],
  severity: "mineur",
  run(doc: Doc): RuleFinding[] {
    const out: RuleFinding[] = [];
    for (const el of doc.elements) {
      if (el.tag === "html") continue;
      if (!hasAttr(el, "lang")) continue;
      if ((attr(el, "lang") ?? "").trim() === "") {
        out.push({
          criteriaId: "3.1.2",
          el,
          message: `Attribut lang vide sur <${el.tag}> — changement de langue mal indiqué.`,
          remediation: `Renseignez un code de langue valide (ex. lang="en") ou retirez l'attribut.`,
        });
      }
    }
    return out;
  },
};

// BCP47 primary subtag + optional subtags (syntactic validity only). The primary
// subtag is a 2-3 alpha language code, OR the `x`/`i` singleton that starts a
// private-use (`x-klingon`) or grandfathered (`i-navajo`) tag — those legitimate
// singletons must not be flagged invalid (the old /^[A-Za-z]{2,3}…/ rejected them).
const BCP47 = /^([A-Za-z]{2,3}|[xXiI])(-[A-Za-z0-9]{1,8})*$/;

const langInvalid: Rule = {
  id: "lang-invalid",
  criteria: ["3.1.1", "3.1.2"],
  severity: "mineur",
  run(doc: Doc): RuleFinding[] {
    const out: RuleFinding[] = [];
    for (const el of doc.elements) {
      const lang = (attr(el, "lang") ?? "").trim();
      if (!lang) continue; // empty handled by inline-lang-change-missing / html-lang-missing
      if (BCP47.test(lang)) continue;
      out.push({
        criteriaId: el.tag === "html" ? "3.1.1" : "3.1.2",
        el,
        message: `Code de langue invalide lang="${lang}" sur <${el.tag}> — n'est pas un code BCP 47 valide.`,
        remediation: `Utilisez un code de langue valide (ex. "fr", "en", "fr-CA").`,
      });
    }
    return out;
  },
};

export const mandatoryRules: Rule[] = [htmlLangMissing, titleMissingEmpty, duplicateId, inlineLangChangeMissing, langInvalid];
