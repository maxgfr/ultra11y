# Auditer le HTML RENDU (bibliothèques de composants : DSFR, MUI…)

Auditer les **sources** JSX d'une bibliothèque de composants donne des **faux
négatifs** : `<Button iconId="fr-icon-add-line" />` (DSFR) rend en réalité
`<button class="fr-btn fr-icon-add-line">` où l'icône est un pseudo-élément CSS
(décoratif) et le **nom accessible vient uniquement de `title`**. Ce HTML vit dans
`node_modules` à l'exécution — aucune analyse de source ne le voit. Conclusion :
pour ces composants, **auditez ce que le JS produit**, pas la source.

## Honnêteté par défaut

Quand `audit` voit un fichier JSX/TSX qui rend des composants importés d'une
**bibliothèque** (spécificateur de paquet, ex. `@codegouvfr/react-dsfr`), il
n'invente pas un verdict : il ajoute un **risque de périmètre** au rapport
(« verdict source préliminaire — auditez le build ou `scan` ») et nomme la/les
bibliothèque(s). Un verdict source n'est donc jamais silencieusement « complet ».

## Obtenir du HTML rendu

`node scripts/ultra11y.mjs render [<dir>]` détecte le framework et imprime la
recette « build → audit » adaptée au projet (et signale les bibliothèques
détectées). Trois voies, de la plus simple à la plus fidèle :

1. **Sortie de build** (recommandé) : construisez le site/les pages, puis auditez
   le HTML émis avec le moteur statique — c'est du vrai HTML, audité avec pleine
   fidélité :
   ```
   npx astro build   # ou next build (output:'export'), vite build, storybook build…
   node scripts/ultra11y.mjs audit "dist/**/*.html"
   ```
   Pour un design-system, un **build Storybook statique** est souvent le plus
   simple : chaque story devient une page rendue à auditer.
2. **Snapshot SSR** : `render --scaffold` écrit `ultra11y-render.tsx`, un harnais
   `react-dom/server` (`renderToStaticMarkup`) qui importe **vos** composants et
   écrit du HTML dans `audits/rendered/`. Complétez la liste, exécutez-le avec
   votre toolchain (`npx tsx ultra11y-render.tsx`), puis auditez `audits/rendered`.
   ultra11y n'embarque pas React : c'est votre projet qui rend.
3. **Navigateur headless** : `scan <url>` (tier Docker, axe-core) sur l'app en
   marche — le plus fidèle, et indispensable pour les critères de **rendu**
   (contraste calculé 3.2/3.3, reflow 10.11). `--merge` fond le résultat dans un
   AuditResult statique.

## Choisir

- Composants / design-system → build Storybook **ou** snapshot SSR, puis `audit`.
- Pages complètes / SSG → sortie de build (`dist`/`out`), puis `audit`.
- Critères de rendu (contraste, focus, zoom) → `scan` (navigateur).
- Dans tous les cas, ne concluez pas « conforme » sur un composant de bibliothèque
  depuis la source : c'est ce que le risque de périmètre vous rappelle.
