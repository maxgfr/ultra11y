// Language-neutral message catalog for rule findings (Phase 3 of the modular
// auditor/lang work). Every RuleFinding/CrossFinding (src/rules/*.ts) now carries a
// `msgId` (+ optional `params`) instead of a baked string; this catalog resolves it
// to fr/en prose at RENDER time — mirroring how src/wcag.ts resolves SC titles by
// lang. `toFinding()`/`crossToFinding()` (src/rules/rule.ts, cross-rule.ts) still
// BAKE the English resolution into `Finding.message`/`remediation` (canonical,
// AI-facing, back-compat with any consumer that only reads those fields) and
// additionally attach `msg: { id, params }` so a `--lang fr` render can resolve the
// authored French original instead.
//
// The fr strings below are the ORIGINAL author strings, moved here verbatim from the
// rule modules (not rewritten); the en strings are faithful technical translations
// written for this catalog. Params carry raw DATA (tag names, attribute values,
// counts, small enums) — never pre-rendered phrases — so each language's template
// controls its own wording/word order.
import type { Lang } from "./types.js";

export type MsgParams = Record<string, string | number>;
type Tpl = (p: MsgParams) => string;
interface MsgEntry {
  message: Record<Lang, Tpl>;
  remediation: Record<Lang, Tpl>;
}

export const MSG_CATALOG: Record<string, MsgEntry> = {
  // ---- Theme 1 — Images (src/rules/images.ts) ---------------------------------
  "img-alt-missing": {
    message: {
      fr: (p) => `<${p.tag}> sans attribut alt ni nom accessible — alternative textuelle manquante.`,
      en: (p) => `<${p.tag}> has no alt attribute or accessible name — missing text alternative.`,
    },
    remediation: {
      fr: () => `Ajoutez alt="…" (description si l'image porte de l'information, alt="" si elle est décorative).`,
      en: () => `Add alt="…" (a description if the image conveys information, alt="" if it is decorative).`,
    },
  },
  "decorative-alt-misuse.empty-but-named": {
    message: {
      fr: () => `Image décorative (alt="") mais nommée par aria-label/title — incohérence décoratif/informatif.`,
      en: () => `Decorative image (alt="") but named via aria-label/title — decorative/informative inconsistency.`,
    },
    remediation: {
      fr: () => `Si l'image est décorative, retirez aria-label/title ; sinon donnez un alt descriptif.`,
      en: () => `If the image is decorative, remove aria-label/title; otherwise give it a descriptive alt.`,
    },
  },
  "decorative-alt-misuse.role-but-alt": {
    message: {
      fr: (p) => `Image en role="${p.role}" mais porteuse d'un alt non vide — déclarée décorative pourtant nommée.`,
      en: (p) => `Image with role="${p.role}" but carrying a non-empty alt — declared decorative yet named.`,
    },
    remediation: {
      fr: (p) => `Retirez role="${p.role}" si l'image est informative, ou videz l'alt si elle est décorative.`,
      en: (p) => `Remove role="${p.role}" if the image is informative, or empty the alt if it is decorative.`,
    },
  },
  "canvas-fallback-missing": {
    message: {
      fr: () => `<canvas> sans contenu alternatif ni nom accessible.`,
      en: () => `<canvas> has no fallback content or accessible name.`,
    },
    remediation: {
      fr: () => `Placez un contenu de repli entre <canvas>…</canvas> ou ajoutez role="img" + aria-label.`,
      en: () => `Place fallback content between <canvas>…</canvas>, or add role="img" + aria-label.`,
    },
  },
  "input-image-alt-missing": {
    message: {
      fr: () => `<input type="image"> sans alt ni nom accessible — le bouton image n'a pas d'alternative textuelle.`,
      en: () => `<input type="image"> has no alt or accessible name — the image button has no text alternative.`,
    },
    remediation: {
      fr: () => `Ajoutez alt="…" décrivant l'action du bouton (ex. alt="Rechercher").`,
      en: () => `Add alt="…" describing the button's action (e.g. alt="Search").`,
    },
  },
  "object-embed-no-name": {
    message: {
      fr: (p) => `<${p.tag}> sans nom accessible ni contenu de repli — média embarqué sans alternative textuelle.`,
      en: (p) => `<${p.tag}> has no accessible name or fallback content — embedded media with no text alternative.`,
    },
    remediation: {
      fr: () => `Ajoutez aria-label/title décrivant le contenu (et un contenu de repli textuel dans <object>…</object>), ou aria-hidden="true" si décoratif.`,
      en: () => `Add aria-label/title describing the content (and text fallback content inside <object>…</object>), or aria-hidden="true" if decorative.`,
    },
  },
  "chart-no-accessible-name": {
    message: {
      fr: (p) => `Graphique (<${p.tag}> ${p.cls}) sans nom accessible — alternative textuelle manquante.`,
      en: (p) => `Chart (<${p.tag}> ${p.cls}) has no accessible name — missing text alternative.`,
    },
    remediation: {
      fr: () => `Enveloppez le graphique dans <div role="img" aria-label="…"> décrivant la tendance (ou ajoutez un <title>/aria-label).`,
      en: () => `Wrap the chart in <div role="img" aria-label="…"> describing the trend (or add a <title>/aria-label).`,
    },
  },

  // ---- Theme 2 — Frames (src/rules/frames.ts) ---------------------------------
  "iframe-title-missing": {
    message: {
      fr: () => `<iframe> sans attribut title — le cadre n'a pas de titre.`,
      en: () => `<iframe> has no title attribute — the frame has no title.`,
    },
    remediation: {
      fr: () => `Ajoutez un title décrivant le contenu du cadre, ex. title="Carte de localisation".`,
      en: () => `Add a title describing the frame's content, e.g. title="Location map".`,
    },
  },

  // ---- Theme 3 — Colours (src/rules/colors.ts) --------------------------------
  "contrast-literal": {
    message: {
      fr: (p) =>
        `Contraste insuffisant : ratio ${p.ratio}:1 entre le texte et son fond (minimum ${p.min}:1 pour du texte ${p.textSize === "large" ? "large" : "normal"}).`,
      en: (p) =>
        `Insufficient contrast: ${p.ratio}:1 ratio between the text and its background (minimum ${p.min}:1 for ${p.textSize === "large" ? "large" : "normal"} text).`,
    },
    remediation: {
      fr: (p) => `Assombrissez le texte ou éclaircissez le fond pour atteindre au moins ${p.min}:1 (contraste calculé sur des couleurs inline littérales).`,
      en: (p) => `Darken the text or lighten the background to reach at least ${p.min}:1 (contrast computed from literal inline colours).`,
    },
  },

  // ---- Theme 5 — Data tables (src/rules/tables.ts) ----------------------------
  "data-table-no-headers.no-th": {
    message: {
      fr: () => `Tableau de données sans <th> — en-têtes de colonne/ligne non déclarés.`,
      en: () => `Data table with no <th> — column/row headers are not declared.`,
    },
    remediation: {
      fr: () => `Déclarez les en-têtes avec <th>, et associez-les via scope="col"/"row" (ou headers/id).`,
      en: () => `Declare headers with <th>, and associate them via scope="col"/"row" (or headers/id).`,
    },
  },
  "data-table-no-headers.no-assoc": {
    message: {
      fr: () => `Tableau de données avec <th> mais sans scope/headers — association cellule↔en-tête absente.`,
      en: () => `Data table with <th> but no scope/headers — the cell↔header association is missing.`,
    },
    remediation: {
      fr: () => `Ajoutez scope="col"/"row" sur les <th> (ou headers="…"/id sur cellules complexes).`,
      en: () => `Add scope="col"/"row" on the <th> elements (or headers="…"/id for complex cells).`,
    },
  },
  "table-caption-missing": {
    message: {
      fr: () => `Tableau de données sans <caption> ni nom accessible — titre du tableau absent.`,
      en: () => `Data table with no <caption> or accessible name — the table has no title.`,
    },
    remediation: {
      fr: () => `Ajoutez un <caption> en première position du <table> (ou aria-label/aria-labelledby).`,
      en: () => `Add a <caption> as the first child of the <table> (or aria-label/aria-labelledby).`,
    },
  },
  "layout-table-data-markup": {
    message: {
      fr: (p) => `Tableau de mise en forme (role="${p.role}") utilisant du balisage de données (th/caption/scope).`,
      en: (p) => `Layout table (role="${p.role}") using data markup (th/caption/scope).`,
    },
    remediation: {
      fr: () => `Retirez th/caption/scope/headers d'un tableau de présentation, ou faites-en un vrai tableau de données.`,
      en: () => `Remove th/caption/scope/headers from a presentation table, or turn it into a real data table.`,
    },
  },
  "sortable-header-no-aria-sort": {
    message: {
      fr: () => `En-tête de colonne triable sans aria-sort — l'état de tri (croissant/décroissant) n'est pas restitué.`,
      en: () => `Sortable column header with no aria-sort — the sort state (ascending/descending) is not conveyed.`,
    },
    remediation: {
      fr: () => `Ajoutez aria-sort="none|ascending|descending" sur le <th> trié, et masquez le glyphe de tri (aria-hidden="true").`,
      en: () => `Add aria-sort="none|ascending|descending" on the sorted <th>, and hide the sort glyph (aria-hidden="true").`,
    },
  },

  // ---- Theme 6/7 — Links & buttons (src/rules/links.ts) -----------------------
  "link-empty-name": {
    message: {
      fr: () => `Lien sans intitulé — aucun nom accessible.`,
      en: () => `Link with no label — no accessible name.`,
    },
    remediation: {
      fr: () => `Donnez un intitulé textuel au lien (texte visible, ou aria-label si vraiment nécessaire).`,
      en: () => `Give the link a text label (visible text, or aria-label if truly necessary).`,
    },
  },
  "button-empty-name": {
    message: {
      fr: () => `Bouton sans intitulé — aucun nom accessible.`,
      en: () => `Button with no label — no accessible name.`,
    },
    remediation: {
      fr: () => `Donnez un intitulé au bouton (texte, value, ou aria-label).`,
      en: () => `Give the button a label (text, value, or aria-label).`,
    },
  },
  "icon-only-control-unnamed": {
    message: {
      fr: (p) => `${p.kind === "link" ? "Lien" : "Bouton"} avec une icône seule (img/svg/i) sans nom accessible.`,
      en: (p) => `${p.kind === "link" ? "Link" : "Button"} with an icon only (img/svg/i) and no accessible name.`,
    },
    remediation: {
      fr: () => `Ajoutez un alt/aria-label sur l'icône ou un texte masqué visuellement (classe visually-hidden).`,
      en: () => `Add an alt/aria-label on the icon, or a visually-hidden text (visually-hidden class).`,
    },
  },
  "control-name-title-only": {
    message: {
      fr: (p) =>
        `${p.kind === "link" ? "Lien" : "Bouton"} dont le seul nom accessible vient de l'attribut title — title n'est pas restitué de façon fiable (survol uniquement).`,
      en: (p) =>
        `${p.kind === "link" ? "Link" : "Button"} whose only accessible name comes from the title attribute — title is not reliably conveyed (hover only).`,
    },
    remediation: {
      fr: () => `Donnez un intitulé via texte visible ou aria-label ; réservez title à une information complémentaire.`,
      en: () => `Give it a label via visible text or aria-label; reserve title for supplementary information.`,
    },
  },

  // ---- Theme 7 — Scripts / ARIA (src/rules/scripts-aria.ts) -------------------
  "invalid-aria-role": {
    message: {
      fr: (p) => `Rôle ARIA invalide : "${p.roles}" n'est pas un rôle WAI-ARIA valide.`,
      en: (p) => `Invalid ARIA role: "${p.roles}" is not a valid WAI-ARIA role.`,
    },
    remediation: {
      fr: () => `Utilisez un rôle ARIA valide ou un élément HTML natif équivalent.`,
      en: () => `Use a valid ARIA role, or an equivalent native HTML element.`,
    },
  },
  "aria-ref-missing-id": {
    message: {
      fr: (p) => `${p.attr} référence un id inexistant : ${p.ids}.`,
      en: (p) => `${p.attr} references a non-existent id: ${p.ids}.`,
    },
    remediation: {
      fr: () => `Corrigez la référence ou ajoutez l'élément cible avec l'id attendu.`,
      en: () => `Fix the reference, or add the target element with the expected id.`,
    },
  },
  "redundant-aria": {
    message: {
      fr: (p) => `role="${p.role}" est redondant : <${p.tag}> a déjà ce rôle implicite.`,
      en: (p) => `role="${p.role}" is redundant: <${p.tag}> already has this implicit role.`,
    },
    remediation: {
      fr: () => `Retirez l'attribut role redondant et laissez la sémantique native.`,
      en: () => `Remove the redundant role attribute and let the native semantics apply.`,
    },
  },
  "clickable-noninteractive": {
    message: {
      fr: (p) =>
        `<${p.tag}> avec onClick mais ${p.focusIssue === "no-tabindex" ? "non focalisable (tabindex absent)" : "sans rôle interactif"} — contrôle non accessible au clavier/AT.`,
      en: (p) =>
        `<${p.tag}> has onClick but ${p.focusIssue === "no-tabindex" ? "is not focusable (no tabindex)" : "has no interactive role"} — control not accessible via keyboard/AT.`,
    },
    remediation: {
      fr: () => `Utilisez <button>/<a> natif, ou ajoutez role + tabindex="0" + gestion clavier (Enter/Espace).`,
      en: () => `Use a native <button>/<a>, or add role + tabindex="0" + keyboard handling (Enter/Space).`,
    },
  },
  "aria-required-children": {
    message: {
      fr: (p) => `role="${p.role}" sans enfant requis (${p.req}) — structure ARIA incomplète.`,
      en: (p) => `role="${p.role}" with no required child (${p.req}) — incomplete ARIA structure.`,
    },
    remediation: {
      fr: () => `Ajoutez les éléments enfants au rôle approprié, ou utilisez les éléments HTML natifs.`,
      en: () => `Add child elements with the appropriate role, or use native HTML elements.`,
    },
  },
  "aria-hidden-focusable": {
    message: {
      fr: () => `aria-hidden="true" sur (ou contenant) un élément focalisable — piège pour les technologies d'assistance.`,
      en: () => `aria-hidden="true" on (or containing) a focusable element — a trap for assistive technology.`,
    },
    remediation: {
      fr: () => `Retirez aria-hidden, ou rendez l'élément non focalisable (tabindex="-1", disabled).`,
      en: () => `Remove aria-hidden, or make the element non-focusable (tabindex="-1", disabled).`,
    },
  },
  "nested-interactive": {
    message: {
      fr: (p) => `Élément interactif <${p.tag}> imbriqué dans un autre élément interactif — non restitué correctement.`,
      en: (p) => `Interactive element <${p.tag}> nested inside another interactive element — not conveyed correctly.`,
    },
    remediation: {
      fr: () => `Ne pas imbriquer des contrôles interactifs (lien/bouton) ; mettez-les côte à côte.`,
      en: () => `Do not nest interactive controls (link/button); place them side by side instead.`,
    },
  },
  "live-region-conflict.invalid-value": {
    message: {
      fr: (p) => `aria-live="${p.value}" invalide — seules les valeurs off, polite, assertive sont restituées.`,
      en: (p) => `aria-live="${p.value}" is invalid — only the values off, polite, assertive are honoured.`,
    },
    remediation: {
      fr: () => `Utilisez aria-live="polite" (ou "assertive" pour une alerte) ; toute autre valeur est ignorée.`,
      en: () => `Use aria-live="polite" (or "assertive" for an alert); any other value is ignored.`,
    },
  },
  "live-region-conflict.mismatch": {
    message: {
      fr: (p) => `role="${p.role}" implique aria-live="${p.want}" mais aria-live="${p.live}" — message de statut restitué de façon incohérente.`,
      en: (p) => `role="${p.role}" implies aria-live="${p.want}" but aria-live="${p.live}" — status message conveyed inconsistently.`,
    },
    remediation: {
      fr: (p) =>
        p.want === "assertive"
          ? `Laissez role="${p.role}" gérer la restitution (retirez aria-live) ou utilisez aria-live="assertive".`
          : `Alignez aria-live sur "${p.want}", cohérent avec role="${p.role}", ou retirez-le.`,
      en: (p) =>
        p.want === "assertive"
          ? `Let role="${p.role}" drive the announcement (remove aria-live), or use aria-live="assertive".`
          : `Align aria-live with "${p.want}", consistent with role="${p.role}", or remove it.`,
    },
  },
  "status-message-not-assertive": {
    message: {
      fr: () => `Conteneur d'erreur/alerte en aria-live="polite" — un message d'erreur doit être restitué de façon assertive.`,
      en: () => `Error/alert container with aria-live="polite" — an error message must be conveyed assertively.`,
    },
    remediation: {
      fr: () => `Utilisez role="alert" (ou aria-live="assertive") pour qu'un message d'erreur soit annoncé immédiatement.`,
      en: () => `Use role="alert" (or aria-live="assertive") so an error message is announced immediately.`,
    },
  },

  // ---- Theme 8 — Mandatory elements (src/rules/mandatory.ts) ------------------
  "html-lang-missing": {
    message: {
      fr: () => `<html> sans attribut lang — la langue par défaut de la page n'est pas déclarée.`,
      en: () => `<html> has no lang attribute — the page's default language is not declared.`,
    },
    remediation: {
      fr: () => `Ajoutez lang sur <html>, ex. <html lang="fr">.`,
      en: () => `Add lang on <html>, e.g. <html lang="en">.`,
    },
  },
  "title-missing-empty": {
    message: {
      fr: (p) => (p.titleState === "empty" ? `<title> vide — le titre de la page est absent de contenu.` : `<title> absent — la page n'a pas de titre.`),
      en: (p) => (p.titleState === "empty" ? `<title> is empty — the page title has no content.` : `<title> is missing — the page has no title.`),
    },
    remediation: {
      fr: () => `Ajoutez un <title> non vide et pertinent dans <head>.`,
      en: () => `Add a non-empty, relevant <title> in <head>.`,
    },
  },
  "duplicate-id": {
    message: {
      fr: (p) => `id="${p.id}" dupliqué — un id doit être unique dans la page (HTML invalide).`,
      en: (p) => `id="${p.id}" duplicated — an id must be unique in the page (invalid HTML).`,
    },
    remediation: {
      fr: () => `Donnez un id unique à chaque élément ; ajustez les références (label[for], aria-*).`,
      en: () => `Give each element a unique id; adjust references accordingly (label[for], aria-*).`,
    },
  },
  "inline-lang-change-missing": {
    message: {
      fr: (p) => `Attribut lang vide sur <${p.tag}> — changement de langue mal indiqué.`,
      en: (p) => `Empty lang attribute on <${p.tag}> — the language change is not properly indicated.`,
    },
    remediation: {
      fr: () => `Renseignez un code de langue valide (ex. lang="en") ou retirez l'attribut.`,
      en: () => `Provide a valid language code (e.g. lang="en") or remove the attribute.`,
    },
  },
  "lang-invalid": {
    message: {
      fr: (p) => `Code de langue invalide lang="${p.lang}" sur <${p.tag}> — n'est pas un code BCP 47 valide.`,
      en: (p) => `Invalid language code lang="${p.lang}" on <${p.tag}> — not a valid BCP 47 code.`,
    },
    remediation: {
      fr: () => `Utilisez un code de langue valide (ex. "fr", "en", "fr-CA").`,
      en: () => `Use a valid language code (e.g. "en", "fr", "en-US").`,
    },
  },

  // ---- Theme 9 — Headings (src/rules/headings.ts) -----------------------------
  "heading-order-skip": {
    message: {
      fr: (p) => `Saut de niveau de titre : <h${p.level}> après <h${p.prev}> (niveau h${p.expected} attendu).`,
      en: (p) => `Heading level skip: <h${p.level}> after <h${p.prev}> (level h${p.expected} expected).`,
    },
    remediation: {
      fr: () => `Ne sautez pas de niveau : enchaînez les titres sans omettre de palier.`,
      en: () => `Do not skip a level: chain heading levels without omitting a step.`,
    },
  },
  "h1-missing": {
    message: {
      fr: () => `Aucun <h1> dans la page — le titre principal de niveau 1 est manquant.`,
      en: () => `No <h1> in the page — the level-1 main heading is missing.`,
    },
    remediation: {
      fr: () => `Ajoutez un <h1> décrivant le contenu principal de la page.`,
      en: () => `Add an <h1> describing the page's main content.`,
    },
  },
  "h1-multiple": {
    message: {
      fr: (p) => `Plusieurs <h1> dans la page (${p.count}) — un seul titre de niveau 1 est recommandé.`,
      en: (p) => `Multiple <h1> in the page (${p.count}) — a single level-1 heading is recommended.`,
    },
    remediation: {
      fr: () => `Conservez un unique <h1> et hiérarchisez le reste avec h2…h6.`,
      en: () => `Keep a single <h1> and structure the rest with h2…h6.`,
    },
  },
  "list-structure.invalid-child": {
    message: {
      fr: (p) => `<${p.childTag}> enfant direct de <${p.parentTag}> — une liste ne doit contenir que des <li>.`,
      en: (p) => `<${p.childTag}> is a direct child of <${p.parentTag}> — a list must only contain <li>.`,
    },
    remediation: {
      fr: (p) => `Enveloppez le contenu dans des <li>, ou utilisez un autre élément que <${p.parentTag}>.`,
      en: (p) => `Wrap the content in <li> elements, or use a different element than <${p.parentTag}>.`,
    },
  },
  "list-structure.li-outside-list": {
    message: {
      fr: (p) => `<li> hors d'une liste (<${p.parentTag}> parent) — structure de liste invalide.`,
      en: (p) => `<li> outside a list (<${p.parentTag}> parent) — invalid list structure.`,
    },
    remediation: {
      fr: () => `Placez chaque <li> directement dans un <ul>, <ol> ou <menu>.`,
      en: () => `Place each <li> directly inside a <ul>, <ol> or <menu>.`,
    },
  },
  "empty-heading": {
    message: {
      fr: (p) => `Titre <${p.tag}> de niveau ${p.level} vide — un titre sans intitulé désoriente la navigation au clavier/lecteur d'écran.`,
      en: (p) => `Empty level-${p.level} <${p.tag}> heading — a heading with no label disorients keyboard/screen-reader navigation.`,
    },
    remediation: {
      fr: () => `Donnez un intitulé textuel au titre, ou retirez-le s'il est purement décoratif.`,
      en: () => `Give the heading a text label, or remove it if it is purely decorative.`,
    },
  },

  // ---- Theme 10 — Presentation / zoom (src/rules/presentation.ts) -------------
  "meta-viewport-zoom-block": {
    message: {
      fr: (p) =>
        `<meta viewport> bloque le zoom (${p.blockedBy === "user-scalable" ? "user-scalable=no" : `maximum-scale=${p.maxScale}`}) — agrandissement à 200% empêché.`,
      en: (p) =>
        `<meta viewport> blocks zoom (${p.blockedBy === "user-scalable" ? "user-scalable=no" : `maximum-scale=${p.maxScale}`}) — 200% zoom is prevented.`,
    },
    remediation: {
      fr: () => `Retirez user-scalable=no et maximum-scale (ou maximum-scale ≥ 2) du content du viewport.`,
      en: () => `Remove user-scalable=no and maximum-scale (or set maximum-scale ≥ 2) from the viewport content.`,
    },
  },

  // ---- Theme 11 — Forms (src/rules/forms.ts) ----------------------------------
  "control-label-missing": {
    message: {
      fr: (p) => `Champ de formulaire <${p.tag}> sans étiquette — aucun label associé.`,
      en: (p) => `Form field <${p.tag}> has no label — no associated label.`,
    },
    remediation: {
      fr: () => `Associez un <label for="…"> (ou enveloppez le champ d'un <label>, ou aria-label/aria-labelledby).`,
      en: () => `Associate a <label for="…"> (or wrap the field in a <label>, or use aria-label/aria-labelledby).`,
    },
  },
  "placeholder-as-label": {
    message: {
      fr: (p) => `placeholder="${p.value}" utilisé comme seule étiquette — le placeholder n'est pas un label.`,
      en: (p) => `placeholder="${p.value}" used as the only label — a placeholder is not a label.`,
    },
    remediation: {
      fr: () => `Ajoutez un <label> réel ; le placeholder ne doit que compléter, pas remplacer l'étiquette.`,
      en: () => `Add a real <label>; the placeholder should only supplement, not replace, the label.`,
    },
  },
  "fieldset-legend-missing": {
    message: {
      fr: () => `<fieldset> sans <legend> (ou légende vide) — regroupement de champs sans légende.`,
      en: () => `<fieldset> has no <legend> (or an empty one) — a field group with no legend.`,
    },
    remediation: {
      fr: () => `Ajoutez un <legend> non vide en premier enfant du <fieldset>.`,
      en: () => `Add a non-empty <legend> as the first child of the <fieldset>.`,
    },
  },
  "form-field-multiple-labels": {
    message: {
      fr: (p) => `Champ <${p.tag}> référencé par ${p.count} <label for="${p.id}"> — étiquettes multiples ambiguës.`,
      en: (p) => `Field <${p.tag}> referenced by ${p.count} <label for="${p.id}"> — ambiguous multiple labels.`,
    },
    remediation: {
      fr: () => `Un seul <label> doit cibler le champ ; fusionnez ou retirez les étiquettes superflues.`,
      en: () => `A single <label> should target the field; merge or remove the superfluous labels.`,
    },
  },
  "select-has-option": {
    message: {
      fr: () => `<select> sans aucune <option> — liste de choix vide.`,
      en: () => `<select> has no <option> at all — empty choice list.`,
    },
    remediation: {
      fr: () => `Ajoutez des <option> (et un <optgroup>/option par défaut si pertinent).`,
      en: () => `Add <option> elements (and an <optgroup>/default option if relevant).`,
    },
  },
  "label-for-dangling": {
    message: {
      fr: (p) => `<label for="${p.id}"> ne cible aucun élément — aucun champ n'a id="${p.id}".`,
      en: (p) => `<label for="${p.id}"> targets no element — no field has id="${p.id}".`,
    },
    remediation: {
      fr: (p) => `Donnez au champ id="${p.id}", corrigez l'attribut for, ou enveloppez le champ dans le <label>.`,
      en: (p) => `Give the field id="${p.id}", fix the for attribute, or wrap the field inside the <label>.`,
    },
  },
  "aria-invalid-no-description": {
    message: {
      fr: (p) => `<${p.tag}> a aria-invalid="true" mais aucun aria-describedby/aria-errormessage — l'erreur est signalée sans être reliée à son message.`,
      en: (p) => `<${p.tag}> has aria-invalid="true" but no aria-describedby/aria-errormessage — the error is signalled without being linked to its message.`,
    },
    remediation: {
      fr: () => `Reliez le message d'erreur au champ via aria-describedby (ou aria-errormessage) pointant vers le texte d'erreur.`,
      en: () => `Link the error message to the field via aria-describedby (or aria-errormessage) pointing at the error text.`,
    },
  },
  "error-not-associated": {
    message: {
      fr: (p) => `Message d'erreur (id="${p.id}") relié à aucun champ — aucun aria-describedby/aria-errormessage ne le référence.`,
      en: (p) => `Error message (id="${p.id}") linked to no field — no aria-describedby/aria-errormessage references it.`,
    },
    remediation: {
      fr: (p) => `Sur le champ concerné, ajoutez aria-describedby="${p.id}" (ou aria-errormessage) et aria-invalid="true".`,
      en: (p) => `On the relevant field, add aria-describedby="${p.id}" (or aria-errormessage) and aria-invalid="true".`,
    },
  },
  "field-purpose-incomplete.autocomplete": {
    message: {
      fr: (p) =>
        `Champ d'identification (${p.type === "email" || p.type === "tel" ? `type="${p.type}"` : "name/id"}) sans autocomplete — objet du champ non exposé.`,
      en: (p) =>
        `Identification field (${p.type === "email" || p.type === "tel" ? `type="${p.type}"` : "name/id"}) with no autocomplete — the field's purpose is not exposed.`,
    },
    remediation: {
      fr: () => `Ajoutez un autocomplete approprié (ex. email, tel, name, postal-code, street-address) — WCAG 1.3.5.`,
      en: () => `Add an appropriate autocomplete (e.g. email, tel, name, postal-code, street-address) — WCAG 1.3.5.`,
    },
  },
  "field-purpose-incomplete.aria-required": {
    message: {
      fr: (p) => `Widget personnalisé (role="${p.role}") requis sans aria-required — l'état requis n'est pas restitué.`,
      en: (p) => `Custom widget (role="${p.role}") is required but has no aria-required — the required state is not conveyed.`,
    },
    remediation: {
      fr: () => `Ajoutez aria-required="true" sur le widget personnalisé requis.`,
      en: () => `Add aria-required="true" on the required custom widget.`,
    },
  },

  // ---- Theme 12 — Navigation & landmarks (src/rules/navigation.ts) ------------
  "skip-link-target-missing": {
    message: {
      fr: (p) => `Lien interne href="${p.href}" — la cible #${p.id} n'existe pas dans la page (lien d'évitement/ancre cassé).`,
      en: (p) => `Internal link href="${p.href}" — target #${p.id} does not exist in the page (broken skip link/anchor).`,
    },
    remediation: {
      fr: (p) => `Ajoutez un élément avec id="${p.id}" (ex. <main id="${p.id}">) ou corrigez l'ancre.`,
      en: (p) => `Add an element with id="${p.id}" (e.g. <main id="${p.id}">) or fix the anchor.`,
    },
  },
  "positive-tabindex": {
    message: {
      fr: (p) => `tabindex="${p.value}" positif — force un ordre de tabulation incohérent avec l'ordre du DOM.`,
      en: (p) => `Positive tabindex="${p.value}" — forces a tab order inconsistent with DOM order.`,
    },
    remediation: {
      fr: () => `Utilisez tabindex="0" (ou pas de tabindex) et ordonnez via le DOM ; réservez les valeurs >0.`,
      en: () => `Use tabindex="0" (or no tabindex) and order via the DOM; reserve values >0.`,
    },
  },
  "missing-main-landmark": {
    message: {
      fr: () => `Aucun repère <main> dans la page — le contenu principal n'est pas identifié (et la cible d'un lien d'évitement manque).`,
      en: () => `No <main> landmark in the page — the main content is not identified (and a skip link's target is missing).`,
    },
    remediation: {
      fr: () => `Enveloppez le contenu principal dans un <main id="content"> (unique par page).`,
      en: () => `Wrap the main content in a <main id="content"> (unique per page).`,
    },
  },
  "multiple-main-landmark": {
    message: {
      fr: (p) => `Plusieurs repères <main> dans la page (${p.count}) — un seul contenu principal est autorisé.`,
      en: (p) => `Multiple <main> landmarks in the page (${p.count}) — only one main content area is allowed.`,
    },
    remediation: {
      fr: () => `Conservez un unique <main>/role="main" ; structurez le reste avec <section>/<aside>.`,
      en: () => `Keep a single <main>/role="main"; structure the rest with <section>/<aside>.`,
    },
  },

  // ---- Theme 4/13 — Multimedia (src/rules/multimedia.ts) ----------------------
  "autoplay-media.muted-video": {
    message: {
      fr: () => `<video autoplay> démarre automatiquement — contenu en mouvement non contrôlé.`,
      en: () => `<video autoplay> starts automatically — uncontrolled moving content.`,
    },
    remediation: {
      fr: () => `Évitez l'autoplay ou fournissez un contrôle pause/stop accessible (et controls).`,
      en: () => `Avoid autoplay, or provide an accessible pause/stop control (and controls).`,
    },
  },
  "autoplay-media.audible": {
    message: {
      fr: (p) => `<${p.tag} autoplay> démarre automatiquement ${p.tag === "audio" ? "du son" : "une vidéo sonore"} — non contrôlable par l'utilisateur.`,
      en: (p) => `<${p.tag} autoplay> automatically starts ${p.tag === "audio" ? "sound" : "a video with sound"} — not controllable by the user.`,
    },
    remediation: {
      fr: () => `Retirez autoplay, ou ajoutez un contrôle de lecture (controls + pause/stop) facilement accessible.`,
      en: () => `Remove autoplay, or add an easily accessible playback control (controls + pause/stop).`,
    },
  },
  "media-no-track": {
    message: {
      fr: () => `<video> sans élément <track> — aucune piste de sous-titres/légendes synchronisées.`,
      en: () => `<video> has no <track> element — no synchronized captions/subtitles track.`,
    },
    remediation: {
      fr: () => `Ajoutez <track kind="captions" src="…" srclang="fr" label="Français"> (ou subtitles) pour le média synchronisé.`,
      en: () => `Add <track kind="captions" src="…" srclang="en" label="English"> (or subtitles) for the synchronized media.`,
    },
  },

  // ---- Theme 13 — Timing & moving content (src/rules/timing.ts) ---------------
  "meta-refresh-redirect": {
    message: {
      fr: (p) =>
        `<meta http-equiv="refresh" content="${p.content}"> impose un délai de ${p.seconds}s — rafraîchissement/redirection temporisé non contrôlable.`,
      en: (p) => `<meta http-equiv="refresh" content="${p.content}"> imposes a ${p.seconds}s delay — an uncontrollable timed refresh/redirect.`,
    },
    remediation: {
      fr: () => `Supprimez le meta refresh temporisé, ou laissez l'utilisateur contrôler/désactiver/prolonger le délai.`,
      en: () => `Remove the timed meta refresh, or let the user control/disable/extend the delay.`,
    },
  },
  "blink-marquee": {
    message: {
      fr: (p) => `<${p.tag}> — contenu en mouvement/clignotant automatique sans mécanisme de pause.`,
      en: (p) => `<${p.tag}> — automatic moving/blinking content with no pause mechanism.`,
    },
    remediation: {
      fr: (p) => `Remplacez <${p.tag}> par du contenu statique, ou fournissez un contrôle pause/stop/masquer.`,
      en: (p) => `Replace <${p.tag}> with static content, or provide a pause/stop/hide control.`,
    },
  },

  // ---- Cross-file rules (src/rules/cross-registry.ts) -------------------------
  "cross-icon-only-unnamed": {
    message: {
      fr: (p) => `<${p.tag}> rend un contrôle à icône seule mais est utilisé sans nom accessible (aucun aria-label/title/texte passé).`,
      en: (p) => `<${p.tag}> renders an icon-only control but is used with no accessible name (no aria-label/title/text passed).`,
    },
    remediation: {
      fr: (p) => `Passez un nom au composant à cet endroit, p. ex. <${p.tag} aria-label="…" /> (le composant ${p.defName} rend une icône sans texte).`,
      en: (p) => `Pass a name to the component at this usage, e.g. <${p.tag} aria-label="…" /> (the component ${p.defName} renders an icon with no text).`,
    },
  },
  "cross-prop-drilled-name-lost": {
    message: {
      fr: (p) => `<${p.tag} ${p.passed}="…"> mais ${p.defName} ne transmet pas ce nom au contrôle rendu — le nom accessible est perdu.`,
      en: (p) => `<${p.tag} ${p.passed}="…"> but ${p.defName} does not forward this name to the rendered control — the accessible name is lost.`,
    },
    remediation: {
      fr: (p) => `Dans ${p.defName}, transmettez ${p.passed} (ou {...props}) au <button>/<a> rendu, ou nommez le contrôle directement.`,
      en: (p) => `In ${p.defName}, forward ${p.passed} (or {...props}) to the rendered <button>/<a>, or name the control directly.`,
    },
  },
};

function entryFor(id: string | undefined): MsgEntry | undefined {
  return id === undefined ? undefined : MSG_CATALOG[id];
}

/** Resolve a finding's message by lang: catalog template when `f.msg` is present and
 *  known, else the baked `f.message` (back-compat with old JSON / unknown ids). */
export function resolveMessage(f: { message: string; msg?: { id: string; params?: MsgParams } }, lang: Lang): string {
  const entry = entryFor(f.msg?.id);
  return entry ? entry.message[lang](f.msg?.params ?? {}) : f.message;
}

/** Resolve a finding's remediation by lang — mirrors resolveMessage. */
export function resolveRemediation(f: { remediation: string; msg?: { id: string; params?: MsgParams } }, lang: Lang): string {
  const entry = entryFor(f.msg?.id);
  return entry ? entry.remediation[lang](f.msg?.params ?? {}) : f.remediation;
}
