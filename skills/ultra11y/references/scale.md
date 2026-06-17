# Auditer à l'échelle — se focaliser intelligemment

On n'audite jamais « tout » un dépôt géant. Le moteur ne lit que le **markup**
(HTML/JSX/Vue/Svelte/Astro), parcourt en flux (mémoire bornée, un fichier à la fois,
le `Doc` est jeté après usage), et vous le **focalisez**. Boucle recommandée :

## La boucle

1. **Cartographier sans tout charger.** Le moteur ignore d'office `node_modules`,
   `.git`, `dist`, `build`, `.next`, `out`, `coverage`, `audits`. Restreignez encore :
   ```
   node scripts/ultra11y.mjs audit "apps/web/**/*.{html,tsx}" --json > audit.json
   ```
2. **Choisir la tranche qui compte.** Trois leviers, du plus ciblé au plus large :
   - **Le diff** (hooks/CI, revue de PR) : `--changed` (vs `HEAD`) ou `--since <ref>`
     — n'audite que les fichiers markup modifiés (via `git diff`, pas de parcours d'arbre).
   - **Les gabarits/composants partagés d'abord** : le moteur **priorise** layouts,
     templates, pages d'entrée, puis `components/`, `shared/`, `ui/`, `design-system/`,
     puis les feuilles. Un run partiel couvre donc d'abord le markup à plus fort impact.
   - **Un plafond explicite** : `--max-files <n>` borne le nombre de fichiers audités
     (les plus prioritaires d'abord) ; la troncature est **toujours journalisée**
     (jamais de perte silencieuse), et inscrite dans le rapport.
3. **Dédupliquer le répétitif.** Un composant identique répété N fois est audité **une
   fois** (`--dedup exact` par défaut ; `normalized` ignore le whitespace inter-balises ;
   `off` désactive). Le rapport cite le fichier canonique — inutile de noyer l'audit
   sous un design-system dupliqué.
4. **Auditer → corriger → ré-auditer → élargir.** Sur la tranche choisie : lisez
   l'`AuditResult`, complétez le jugement, appliquez les correctifs (`references/fix.md`),
   ré-auditez pour prouver l'absence de régression, puis élargissez le périmètre.

## Pourquoi c'est sûr à grande échelle

- **Mémoire bornée** : flux fichier-par-fichier ; seul le nombre de findings (pas la
  taille des sources) reste en mémoire.
- **Déterministe** : ordre stable (priorité puis chemin) → audits reproductibles,
  choix de fichier canonique stable, `check:build` tient.
- **Incrémental** : `--changed`/`--since` rendent l'audit proportionnel au diff, pas au
  dépôt — c'est ce qui rend les hooks/CI viables (voir `references/automation.md`).

> En `--changed`, la déduplication est désactivée : un fichier modifié est toujours
> audité, jamais fusionné avec un fichier non lu.
