---
name: ultra11y
description: "Use to AUDIT existing HTML/CSS/JSX for RGAA 4.1.2 + WCAG 2.1/2.2 AA accessibility and a dated compliance report, OR to AUTHOR/REVIEW accessible markup (native-HTML-first, ARIA last). An install-free engine (`node scripts/ultra11y.mjs`, no npm install, no keys) runs 36 static checks across the 13 RGAA themes — missing alt/lang/title, unlabeled fields, empty links/buttons, iframes/tables, heading skips, invalid ARIA, positive tabindex — and decides the criteria it can; YOU supply the judgment (alt relevance, link purpose) and needs-rendering criteria (contrast, focus, zoom) as residual risks. JSX/TSX parse to a real AST; `audit --graph` resolves cross-file imports for component-level rules; `prd` emits a fix backlog (optionally GitHub issues). check/verify gates reject hallucinated non-conformities. Triggers: 'audit accessibilité / RGAA', 'check WCAG / a11y', 'make this component accessible', 'fix accessibility', 'générer des PRD / issues a11y', 'audit de ce composant'."
license: MIT
metadata:
  version: 2.0.0
---

# ultra11y — auditer le RGAA 4.1.2 et écrire de l'accessible

Sur l'accessibilité, un outil automatique ne voit qu'une partie des problèmes.
`ultra11y` l'assume par une **division du travail** : le moteur déterministe et
sans installation (`node scripts/ultra11y.mjs <commande>` — pas de `npm install`,
pas de clé ; le parseur JSX/TSX est embarqué dans le bundle) fait le travail
*mécanique* — détecter les non-conformités
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
- **« Code rendu par une bibliothèque (DSFR, MUI…) / éviter les faux négatifs »** →
  auditer le **HTML produit**, pas la source JSX : `render` (recette build→audit ou
  snapshot SSR `--scaffold`) puis `audit` sur le rendu, et `scan` pour le rendu
  calculé ; lire **`references/rendered.md`**.
- **« Sur un gros dépôt / auditer malin »** → se focaliser : `--changed` (diff git),
  priorisation des gabarits, dédup, `--max-files` ; lire **`references/scale.md`**.
- **« Analyse inter-fichiers (arbre + dépendances), JSX/TSX en vrai AST »** →
  `audit --graph` résout les imports et applique les règles inter-fichiers (composant
  à icône seule utilisé sans nom, cible d'ancre dans un autre fichier…), sans
  navigateur ; lire **`references/cross-file.md`**.
- **« Générer le markdown des correctifs / des PRD (→ issues GitHub) »** → `prd`
  (backlog par défaut, `--split criterion`, `--gh-issues` via le CLI `gh`) ; lire
  **`references/prd.md`**.
- **« Trancher les critères de jugement / rendu (phase de jugement) »** → `verify`
  produit une liste de contrôle ancrée sur les **tests RGAA** de chaque critère ;
  statuez, puis `verify --apply` ; lire **`references/judgment.md`**.
- **« Mettre en place les fix »** → `fix` (dry-run par défaut, `--write` applique les
  correctifs sûrs, propose le reste sans rien inventer) ; lire **`references/fix.md`**.
- **« Corriger par priorité, sans régression (phase de correction) »** → `fix`
  (`--write`, `--iterate`) + le backlog `prd`, dans l'ordre bloquant→majeur→mineur ;
  lire **`references/correction.md`**.
- **« Garde automatique dans le repo (hook / CI) »** → `init --hook`/`--ci`/`--baseline`
  (n'échoue que sur les nouvelles non-conformités) ; lire **`references/automation.md`**.
- **« Rendre ce code accessible / le revoir »** → auditer l'extrait
  (`audit - < composant.html`) en suivant le natif-d'abord ; lire
  **`references/authoring.md`** et **`references/forbidden-patterns.md`**.
- **« Que signifie le critère X / quelle thématique »** → `criteria` ; voir
  **`references/criteria.md`**.
- **« Lecture internationale (WCAG / EN 301 549 / Section 508) »** → `--standard wcag`
  sur `report`/`criteria` ; voir **`references/methodology.md`**.
- **« Audit à haute assurance »** → `verify --report … --semantic` ; voir
  **`references/verify.md`**. Méthodologie & format : **`references/methodology.md`**.
- **« Vérifier le contraste / le rendu (tier optionnel Docker) »** → `scan <url> --merge …`
  (axe-core dans un navigateur headless) ; voir **`references/dynamic.md`**.

## Aide-mémoire des commandes

```
node scripts/ultra11y.mjs audit "src/**/*.html" --json > audit.json
node scripts/ultra11y.mjs audit - < composant.html        # HTML via stdin
node scripts/ultra11y.mjs audit "src/**/*.tsx" --jsx       # JSX/TSX en vrai AST
node scripts/ultra11y.mjs audit "src/**/*.tsx" --graph     # + imports & règles inter-fichiers
node scripts/ultra11y.mjs audit --changed --json           # seulement le diff git (gros dépôt)
node scripts/ultra11y.mjs report --in audit.json --out audits
node scripts/ultra11y.mjs report --in audit.json --standard wcag   # vue WCAG (présentation)
node scripts/ultra11y.mjs prd    --in audit.json --gh-issues       # backlog des fix (+ issues GitHub)
node scripts/ultra11y.mjs criteria 11.1                    # un critère + ses tests
node scripts/ultra11y.mjs criteria --theme 8 --list        # une thématique / la liste
node scripts/ultra11y.mjs check  --report audits/rgaa-AAAA-MM-JJ.md
node scripts/ultra11y.mjs verify --report audits/rgaa-AAAA-MM-JJ.md --semantic
node scripts/ultra11y.mjs render                           # recette build→audit du projet (ou --scaffold SSR)
node scripts/ultra11y.mjs audit "dist/**/*.html"           # auditer le HTML RENDU (fiable pour DSFR/MUI…)
node scripts/ultra11y.mjs verify --report audits/rgaa-AAAA-MM-JJ.md  # liste de jugement (tests RGAA inline)
node scripts/ultra11y.mjs fix "src/**/*.html" --write --iterate      # corrige et ré-applique jusqu'à stabilité
node scripts/ultra11y.mjs init --hook --baseline           # garde de régression (hook + baseline)
node scripts/ultra11y.mjs scan https://exemple.fr --merge audits/audit-latest.json  # tier Docker
```
Sortie machine partout avec `--json`. Rapport en français par défaut, `--lang en` disponible.

## La boucle : auditer → rendre → juger → corriger → ré-auditer

Pour converger vers la conformité (et non un seul passage), enchaînez, en
laissant l'agent piloter les étapes de jugement et de contenu :

1. **Auditer** la source (`audit … --graph`) pour une première carte ; sur du code
   rendu par une bibliothèque, **auditer le rendu** (`render` → build/SSR → `audit`)
   pour des verdicts fiables (sinon le risque de périmètre vous le rappelle).
2. **Juger** les critères de rendu/jugement avec `verify` (grille RGAA inline) et
   trancher chaque entrée.
3. **Corriger** par priorité : `fix --write --iterate` pour le mécanique (garde
   anti-régression), puis appliquer à la main les corrections de jugement/contenu
   (alt, intitulés, structure) guidées par `references/correction.md`.
4. **Ré-auditer** (sur le rendu si pertinent) et répéter.

**Arrêt** : `check` et `verify --apply` repassent au vert, et il ne reste que des
risques résiduels explicitement nommés. (Pour automatiser la cadence externe, la
commande `/loop` du harness peut relancer ce cycle.)

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
  pas voir (le contraste sur **couleurs inline littérales** est tranché en statique ;
  le contraste **calculé** — CSS externe, variables — passe par `scan` (tier Docker)
  ou se vérifie au rendu avant d'être déclaré).
- Ajouter de l'ARIA qui double la sémantique native.
- Marquer un critère de rendu/jugement « conforme » sans vérification humaine.
- Éditer à la main `references/criteria.md` (généré depuis le référentiel).

## Portée

Moteur statique : hors-ligne, déterministe, sans installation ; entrées HTML +
JSX/TSX (vrai AST, analyse inter-fichiers via `--graph`) + stdin. Les critères de **rendu** (contraste calculé,
reflow) sont couverts par le tier optionnel `scan` (axe-core dans Docker) ; le
**focus visible**, le zoom texte 200% et les contenus au survol restent en revue
humaine (risque résiduel). Données : RGAA 4.1.2 © DINUM, Licence Ouverte / Etalab
2.0 (voir `NOTICE`).
