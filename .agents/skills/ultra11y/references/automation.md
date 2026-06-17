# Automatiser dans le repo — `init` (hook / CI)

ultra11y peut rester un skill **à la demande**, ou devenir une **garde de régression**
qui tourne toute seule. `init` câble les deux (zéro-dépendance, pas de husky) :

```
node scripts/ultra11y.mjs init --baseline      # écrit audits/baseline.json (référence)
node scripts/ultra11y.mjs init --hook          # .git/hooks/pre-commit
node scripts/ultra11y.mjs init --ci            # .github/workflows/a11y.yml
node scripts/ultra11y.mjs init                 # défaut : --hook + --baseline
```

## Le principe : ne bloquer que les régressions

Le hook et la CI lancent en réalité :

```
node scripts/ultra11y.mjs audit --changed --baseline audits/baseline.json --fail-on bloquant
```

- `--changed` (ou `--since <ref>` en CI) restreint l'audit au **diff** — proportionnel
  au changement, pas au dépôt.
- `--baseline audits/baseline.json` est la photo (commitée) de l'état connu. Le gate ne
  **échoue que sur les NOUVELLES** non-conformités introduites par le diff, jamais sur le
  backlog existant. Identité stable d'un finding : `(règle, critère, fichier, plage source)`
  — robuste aux décalages de lignes.
- `--fail-on bloquant|majeur|mineur` règle le seuil de blocage (défaut : `bloquant`).

## Mise en place

1. `init --baseline` puis **commitez `audits/baseline.json`** (sinon, sans référence,
   toute non-conformité du diff au seuil bloque).
2. `init --hook` pour la garde locale (pre-commit). Contournement ponctuel :
   `SKIP_A11Y=1 git commit …`. Quand le hook signale, ouvrez le code cité, complétez le
   jugement, ou lancez `fix --changed --write` (voir `references/fix.md`).
3. `init --ci` pour la garde de PR (GitHub Actions, sur le diff vs la branche cible).
4. Rafraîchissez la baseline quand vous résorbez du backlog : `init --baseline` à nouveau.

> Le gate s'appuie sur le moteur statique. Les critères de **rendu** (contraste, focus,
> zoom) et de **jugement** restent à vérifier dans l'audit complet — la garde empêche les
> régressions mécaniques, elle ne remplace pas la revue humaine.
