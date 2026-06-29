# Phase de jugement (les critères que le moteur ne décide pas)

Le moteur tranche le sous-ensemble machine-vérifiable ; **vous** tranchez le reste :
les critères de **jugement** (pertinence des alternatives, intitulés en contexte,
ordre de lecture) et de **rendu** (contraste calculé, focus, zoom/reflow), plus la
vérification adversariale des non-conformités détectées. Cette phase rend chaque
verdict défendable, jamais inventé.

## Boucle de jugement

1. **Lister le travail** : `node scripts/ultra11y.mjs verify --report audits/rgaa-AAAA-MM-JJ.md`
   écrit `VERIFY.md` (liste de contrôle) + `VERIFY.todo.json`. Chaque entrée
   embarque désormais **les tests RGAA du critère** (la grille), pour juger contre
   les vraies conditions et non à l'estime.
2. **Statuer** par entrée, en ouvrant le fichier à la ligne citée, et en
   renseignant `verdict` dans `VERIFY.todo.json` :
   - `supported` — la non-conformité est réelle et bien rattachée ;
   - `partial` — réelle mais critère/formulation imprécis ;
   - `refuted` — fausse (l'élément cité est conforme) ;
   - `unsupported` — l'élément cité ne permet pas de trancher.
3. **Critères « à évaluer »** (rendu / jugement) du rapport : récupérez la grille
   d'un critère hors worklist avec `node scripts/ultra11y.mjs criteria 3.2`
   (tests + références WCAG), puis tranchez — ou laissez un risque résiduel
   explicite. Ne marquez jamais « conforme » sans preuve.
4. **Rendu requis** : pour le contraste calculé, le focus visible, le zoom 200%,
   le reflow 320px — vérifiez sur le **rendu** (tier `scan`, ou inspection), pas
   sur la source.
5. **Code de bibliothèque (DSFR…)** : un `<Button>`/`<Card>` ne montre pas son HTML
   en source. Jugez sur le HTML **produit** (voir `render` / auditer le build),
   sinon le verdict est un faux négatif.
6. **Clôturer** : la liste de contrôle de `VERIFY.md` doit être entièrement cochée,
   puis `node scripts/ultra11y.mjs verify --apply VERIFY.todo.json` repasse au vert
   (échoue si un verdict est `refuted`/`unsupported`/absent). `--semantic` plie la
   vérification d'étaiement dans la même passe.

> Doctrine importée : la grille par critère (etalab) ancre chaque verdict ; la
> liste de contrôle avant clôture (SocialGouv) empêche de conclure trop vite.
