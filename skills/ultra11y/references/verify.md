# Gates `check` et `verify`

Deux niveaux d'assurance avant de livrer un rapport.

## `check` — intégrité structurelle

```
node scripts/ultra11y.mjs check --report audits/rgaa-AAAA-MM-JJ.md
```
Échoue (code ≠ 0) si : une des 5 sections manque, un identifiant de critère cité
n'existe pas dans le RGAA, un critère `NA` n'a pas de justification, ou le taux de
conformité est absent. C'est le garde-fou anti-hallucination de base. `--quiet`
n'émet que le code de sortie ; `--json` la liste structurée des problèmes.

## `verify` — vérification adversariale des non-conformités

```
node scripts/ultra11y.mjs verify --report audits/rgaa-AAAA-MM-JJ.md --semantic
```
Génère une **worklist** `VERIFY.md` + `VERIFY.todo.json` : une entrée par
non-conformité (critère ↔ `fichier:ligne` ↔ intitulé cité), plafonnée par
`--max-verify` (défaut 40). Pour chaque entrée, ouvrez le code cité et attribuez
un verdict dans `VERIFY.todo.json` :

- `supported` — la non-conformité est réelle ;
- `partial` — réelle mais critère/formulation imprécis ;
- `refuted` — fausse (l'élément cité est en réalité conforme) ;
- `unsupported` — l'élément cité ne permet pas de trancher.

En mode `--semantic`, vérifiez explicitement que l'extrait cité **étaye** la
non-conformité. Puis appliquez le gate :
```
node scripts/ultra11y.mjs verify --apply VERIFY.todo.json
```
Le gate échoue (code ≠ 0) si une entrée est `refuted`, `unsupported`, ou non
statuée. Objectif : aucune non-conformité fabriquée ne survit dans le rapport final.

## Risque résiduel

`verify` ne couvre que les non-conformités déclarées. Les critères *needs-rendering*
et *judgment* non tranchés restent dans la section « à évaluer manuellement » du
rapport — ne les marquez jamais conformes sans vérification humaine.
