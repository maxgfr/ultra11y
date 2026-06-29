# Phase de correction (mettre les fix en place, par priorité)

Corriger sans rien casser ni inventer. Doctrine (HTML natif d'abord, plus petit
changement possible, aucune régression) appliquée dans l'ordre de priorité.

## Ordre de traitement

1. **🔴 Bloquant d'abord**, puis 🟠 majeur, puis 🟡 mineur — c'est l'ordre du
   backlog `prd` et du rapport. Sur un gros dépôt, traitez d'abord les gabarits
   partagés (layouts, design-system) : une correction y porte sur tout le site.
2. **Trois classes de correction** (`fix`) :
   - **auto** — codemods déterministes (tabindex positif, ARIA redondant, zoom
     bloqué) ; sûrs à appliquer sans supervision.
   - **placeholder** — insère un attribut valide avec un `TODO` (alt/lang/title/
     aria-label) que vous remplacez par une vraie valeur en contexte.
   - **proposal** — jugement seul ; le moteur n'invente pas le contenu (texte
     d'alternative, intitulé de lien, structure de tableau) — vous l'écrivez.
3. **Exemples conforme / non-conforme** : pour chaque motif, partez du plus petit
   changement qui rend le HTML **rendu** conforme (pas seulement la source). Si un
   composant de bibliothèque ne s'instancie pas correctement (ex. bouton à icône
   DSFR sans `title`), corrigez au point d'utilisation et re-vérifiez sur le rendu.

## Commandes

```
node scripts/ultra11y.mjs fix "src/**/*.html"            # dry-run : diff proposé
node scripts/ultra11y.mjs fix "src/**/*.html" --write     # applique (auto+placeholder)
node scripts/ultra11y.mjs fix "src/**/*.tsx"  --write     # JSX réel : codemods jsxSafe seulement
node scripts/ultra11y.mjs fix "src/**" --write --iterate   # ré-audite et ré-applique jusqu'à plus rien d'auto
node scripts/ultra11y.mjs fix "src/**" --only img-alt-missing,positive-tabindex
node scripts/ultra11y.mjs prd  --in audits/audit-latest.json   # backlog priorisé des fix restants
```

- **Garde anti-régression** : `--write` ne s'applique que si une ré-audit prouve
  qu'aucune nouvelle non-conformité n'est introduite (y compris aucun nouveau type
  de finding). Un placeholder invalide est donc bloqué.
- **JSX/TSX** : `fix --write` n'applique que les codemods sûrs (suppression d'ARIA,
  insertion d'attributs valides en React) ; il ne réécrit jamais un nom d'attribut
  (pas de `tabIndex={5}` → `tabindex="0"`). Le reste reste en proposition.
- Après correction, **bouclez** : ré-auditez, re-jugez les `proposal`, jusqu'à ce
  que `check`/`verify` repassent au vert (voir la section « boucle » du SKILL).
