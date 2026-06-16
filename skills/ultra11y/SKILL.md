---
name: ultra11y
description: "Use to AUDIT existing HTML/CSS/JSX for RGAA 4.1.2 + WCAG 2.1/2.2 AA accessibility and produce a dated compliance report, OR to AUTHOR/REVIEW accessible markup without regressions (native-HTML-first, ARIA last). A deterministic zero-dependency engine (`node scripts/ultra11y.mjs`, no install, no keys) runs ~35 static checks across the 13 RGAA themes — missing alt/lang/title, unlabeled fields, empty links/buttons, iframes without title, tables without headers, heading skips, invalid/broken ARIA, positive tabindex, autoplay — and decides the criteria it can; YOU supply the judgment (alt relevance, link purpose, reading order) and the needs-rendering criteria (contrast, focus, zoom) it cannot see, reported as residual risks (never silently conforming). check/verify gates reject hallucinated non-conformities. Triggers: 'audit accessibilité / RGAA', 'rapport de conformité RGAA', 'is this accessible', 'check WCAG / a11y', 'make this component accessible', 'accessible form/table/modal', 'fix accessibility', 'audit de ce site/composant'."
license: MIT
metadata:
  version: 1.1.0
---

# ultra11y — auditer le RGAA 4.1.2 et écrire de l'accessible

Sur l'accessibilité, un outil automatique ne voit qu'une partie des problèmes.
`ultra11y` l'assume par une **division du travail** : le moteur déterministe et
zéro-dépendance (`node scripts/ultra11y.mjs <commande>` — pas de `npm install`,
pas de clé) fait le travail *mécanique* — détecter les non-conformités
machine-vérifiables et les rattacher au bon critère RGAA ; **vous** faites le
*jugement* — pertinence des alternatives, intitulés en contexte, ordre de lecture
— et les critères qui exigent un **rendu** (contraste, focus, zoom). Des gates
empêchent toute non-conformité hallucinée de survivre.

> **Règles cœur :**
> 1. **Ne jamais inventer de non-conformité** : chaque `NC` cite un élément réel
>    et résoluble (`check` le vérifie).
> 2. **HTML natif d'abord, ARIA en dernier** ; ne dupliquez pas une sémantique implicite.
> 3. **Le résidu est explicite** : tout critère *rendu*/*jugement* non prouvé va dans
>    « à évaluer manuellement », jamais marqué conforme en silence.

## Choisir selon la situation

- **« Auditer / rapport de conformité »** → `node scripts/ultra11y.mjs audit … --json`,
  puis `report`, puis `check` ; lire **`references/audit.md`**.
- **« Rendre ce code accessible / le revoir »** → auditer l'extrait
  (`audit - < composant.html`) en suivant le natif-d'abord ; lire
  **`references/authoring.md`** et **`references/forbidden-patterns.md`**.
- **« Que signifie le critère X / quelle thématique »** → `criteria` ; voir
  **`references/criteria.md`**.
- **« Audit à haute assurance »** → `verify --report … --semantic` ; voir
  **`references/verify.md`**. Méthodologie & format : **`references/methodology.md`**.
- **« Vérifier le contraste / le rendu (tier optionnel Docker) »** → `scan <url> --merge …`
  (axe-core dans un navigateur headless) ; voir **`references/dynamic.md`**.

## Aide-mémoire des commandes

```
node scripts/ultra11y.mjs audit "src/**/*.html" --json > audit.json
node scripts/ultra11y.mjs audit - < composant.html        # HTML via stdin
node scripts/ultra11y.mjs audit "src/**/*.tsx" --jsx       # JSX/TSX best-effort
node scripts/ultra11y.mjs report --in audit.json --out audits
node scripts/ultra11y.mjs criteria 11.1                    # un critère + ses tests
node scripts/ultra11y.mjs criteria --theme 8 --list        # une thématique / la liste
node scripts/ultra11y.mjs check  --report audits/rgaa-AAAA-MM-JJ.md
node scripts/ultra11y.mjs verify --report audits/rgaa-AAAA-MM-JJ.md --semantic
node scripts/ultra11y.mjs scan https://exemple.fr --merge audits/audit-latest.json  # tier Docker
```
Sortie machine partout avec `--json`. Rapport en français par défaut, `--lang en` disponible.

## Combiner moteur, jugement et risque résiduel

La sortie `audit` classe chaque critère : `C`/`NC`/`NA` pour le sous-ensemble
statique ; `manual` pour les critères de rendu/jugement (listés en
`residualRisks`). Les `NC` du moteur sont des **candidats confirmés** (cités
`fichier:ligne`). À vous de trancher les critères `manual`, et de marquer les
critères de rendu « à vérifier manuellement ». Le rapport n'est complet que
lorsque chaque critère applicable est `C`/`NC`/`NA` justifié et que chaque risque
résiduel est nommé.

## À ne pas faire

- Inventer une non-conformité que le moteur n'a pas trouvée et que vous ne pouvez
  pas voir (le **contraste** est explicitement hors moteur — ne le déclarez pas sans rendu).
- Ajouter de l'ARIA qui double la sémantique native.
- Marquer un critère de rendu/jugement « conforme » sans vérification humaine.
- Éditer à la main `references/criteria.md` (généré depuis le référentiel).

## Portée

Hors-ligne, déterministe, zéro-dépendance ; entrées HTML + JSX/TSX (best-effort)
+ stdin. **Hors v1** (→ jugement humain) : contraste calculé, focus visible,
zoom/reflow, contenus au survol, animations — aucun navigateur embarqué.
Données : RGAA 4.1.2 © DINUM, Licence Ouverte / Etalab 2.0 (voir `NOTICE`).
