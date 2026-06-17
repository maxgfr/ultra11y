# Mettre en place les correctifs — `fix` (hybride, native-first)

`fix` applique ce qui est **mécaniquement sûr**, prépare ce qui demande un mot à
compléter, et **propose** ce qui relève du jugement — sans jamais inventer de contenu
(doctrine anti-hallucination). Par défaut c'est un **dry-run** (diff) ; `--write` applique.

```
node scripts/ultra11y.mjs fix "src/**/*.html"            # dry-run : diff + liste
node scripts/ultra11y.mjs fix "src/**/*.html" --write     # applique les correctifs sûrs
node scripts/ultra11y.mjs fix --changed --write           # seulement le diff git
node scripts/ultra11y.mjs fix page.html --only positive-tabindex --write
```

## Trois classes de correctifs

- **auto** — déterministe, aucun jugement, écrit tel quel :
  `positive-tabindex` (→ `tabindex="0"`), `redundant-aria` (retrait du `role` redondant),
  `meta-viewport-zoom-block` (retrait de `user-scalable=no` / `maximum-scale` bloquant).
- **à compléter (placeholder)** — insère un attribut **valide** avec une sentinelle
  `TODO` que **vous** remplacez par une valeur pertinente en contexte :
  `html-lang-missing` (`lang="TODO"`), `iframe-title-missing` (`title="TODO"`),
  `img-alt-missing` (`alt="TODO"` ou `aria-label="TODO"`), `control-label-missing`
  (`aria-label="TODO"`).
- **jugement (proposal)** — le moteur ne corrige **jamais** seul : pertinence de l'alt
  (1.3), intitulé de lien/bouton (6.1/7.1), contraste, structure de tableau/fieldset…
  C'est à vous d'écrire le contenu.

## Garanties

- **Édition par plage source** : les codemods relisent localement la balise ouvrante
  (les offsets d'attributs ne sont pas fournis par le parseur) et appliquent les edits
  **de la fin vers le début** ; les edits qui se chevauchent sur un même élément sont
  écartés, jamais mal appliqués.
- **Garde anti-régression** : après `--write`, le fichier est ré-audité ; si un correctif
  **introduisait** une nouvelle non-conformité, il n'est **pas** écrit.
- **JSX/TSX jamais réécrit** : les offsets pointent dans le HTML transformé (lossy), pas
  dans le `.tsx` ; sur ces fichiers `fix` reste en **proposition seule** — éditez à la main.

## Ordre de correction (native-first)

sémantique native → noms accessibles / labels → accès clavier → focus visible →
sens non porté par la seule couleur → médias. Voir `references/authoring.md` et
`references/forbidden-patterns.md`. Après correction, ré-auditez et complétez les
critères de jugement et de rendu (jamais marqués conformes sans vérification).
