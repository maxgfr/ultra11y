# Auditer du code existant → rapport RGAA

Objectif : produire un rapport de conformité RGAA 4.1.2 daté et fiable. Le moteur
décide le sous-ensemble automatisable ; **vous** complétez les critères de
jugement et de rendu ; les gates empêchent toute non-conformité hallucinée.

## La boucle

1. **Délimiter le périmètre.** Quels fichiers / composants ? (HTML, JSX/TSX.)
2. **Lancer le moteur :**
   ```
   node scripts/ultra11y.mjs audit "src/**/*.html" --json > audit.json
   ```
   ou sur un extrait : `node scripts/ultra11y.mjs audit - < page.html --json`.
   La sortie `AuditResult` classe chaque critère en `C` / `NC` / `NA` (statique)
   ou `manual` (rendu / jugement, listé dans `residualRisks`).
3. **Trier les résultats :**
   - `NC` du moteur = candidats confirmés (chaque finding cite `fichier:ligne`) ;
   - critères `manual` *needs-rendering* (contraste 3.2/3.3, focus 10.7, zoom 10.11…)
     → marquez « à vérifier manuellement », **jamais** `C` en silence ;
   - critères `manual` *judgment* (pertinence de l'alt 1.3, intitulé de lien 6.1,
     ordre de lecture/tabulation…) → évaluez-les avec le contexte.
4. **Décider chaque critère applicable** : `C`, `NC` ou `NA` (avec justification).
   Pour le détail d'un critère et ses tests : `node scripts/ultra11y.mjs criteria 1.1`.
5. **Rendre le rapport :**
   ```
   node scripts/ultra11y.mjs report --in audit.json --out audits
   ```
   → `audits/rgaa-AAAA-MM-JJ.md` (5 sections, voir `references/methodology.md`).
6. **Contrôler l'intégrité :**
   ```
   node scripts/ultra11y.mjs check --report audits/rgaa-AAAA-MM-JJ.md
   ```
   Échec si une section manque, un critère cité n'existe pas, ou un `NA` n'est pas
   justifié.
7. **Haute assurance (optionnel)** : `references/verify.md` — prouver que chaque
   non-conformité est réelle avant de livrer.

## Règles d'or

- **Ne jamais inventer de non-conformité** : chaque `NC` doit citer un élément réel
  et résoluble (`check` le vérifie).
- **Le résidu est explicite** : tout critère *needs-rendering* / *judgment* non prouvé
  figure dans la section « à évaluer manuellement », jamais passé en `C`.
- Le **taux de conformité automatique** du rapport ne couvre que le sous-ensemble
  statique ; la conformité RGAA complète exige votre revue manuelle.
