# PRD / backlog de correction (`prd`) + issues GitHub

`prd` transforme un `AuditResult` en **markdown des correctifs à faire**, groupé
par critère RGAA. C'est le pendant « action » du `report` (qui, lui, est le
document de conformité).

```
node scripts/ultra11y.mjs audit "src/**/*.tsx" --graph --json > audit.json
node scripts/ultra11y.mjs prd --in audit.json                     # backlog unique (par défaut)
node scripts/ultra11y.mjs prd --in audit.json --split criterion   # un PRD par critère
node scripts/ultra11y.mjs prd --in audit.json --gh-issues         # + une issue GitHub par critère
```

## Sortie

- **Par défaut** : un seul document `audits/prd-AAAA-MM-JJ.md`, sectionné par
  priorité (🔴 bloquant → 🟠 majeur → 🟡 mineur). Chaque critère devient un bloc :
  intitulé + WCAG, correction(s), puis une **checklist** des occurrences
  (`fichier:ligne`), avec le **site de définition** (`related`) quand un
  signalement inter-fichiers le porte.
- **`--split criterion`** : un fichier `prd-<critère>-AAAA-MM-JJ.md` par critère
  ayant des non-conformités (pratique pour découper en lots).
- Le markdown est **toujours** écrit, même avec `--gh-issues`.

## Issues GitHub (`--gh-issues`, opt-in)

- S'appuie sur le **CLI `gh`** (qui gère son auth) — **aucune** dépendance npm,
  aucune clé dans ultra11y.
- **Une issue par critère** (quel que soit `--split`), titre stable
  `"[a11y] RGAA <id> — <intitulé>"`, labels `accessibility`, `rgaa`, sévérité.
  Le corps reprend correction + occurrences `fichier:ligne` + site de définition.
- **Déduplication par titre** : une issue déjà présente (ouverte ou fermée) est
  ignorée, donc relancer ne crée pas de doublon.
- **Dégradation propre** : si `gh` est absent / non authentifié, la commande
  l'indique et sort en `0` — le markdown a quand même été produit.

> `prd` lit le `AuditResult` produit par `audit` (idéalement `--graph` pour la
> couverture inter-fichiers) ; il réutilise intitulés de critères, sévérités,
> messages, remédiations et `fichier:ligne` déjà calculés.
