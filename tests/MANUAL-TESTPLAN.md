# ultra11y — prompt de test manuel (end-to-end)

Prompt réutilisable pour exercer **toutes** les features du skill et corriger les bugs.
Copier-coller dans une session fraîche, au racine du dépôt. Le moteur tourne via
`node scripts/ultra11y.mjs <cmd>` (bundle zéro-dépendance). Fixtures :

| rôle | chemin |
|---|---|
| conforme | `tests/fixtures/conforming/good.html` |
| non conforme | `tests/fixtures/non-conforming/bad.html` |
| rendu / contraste | `tests/fixtures/dynamic/low-contrast.html` |

---

## Prompt

> Exerce le skill **ultra11y** de bout en bout et corrige tout bug. Moteur :
> `node scripts/ultra11y.mjs <cmd>`. Fixtures dans `tests/fixtures/`. Pour chaque
> commande : lance-la, vérifie **exit code / forme JSON / texte FR-EN / artefacts**.
> Pour tout ce qui casse : **reproduis → écris un test de non-régression rouge dans
> `tests/` → corrige la plus petite cause dans `src/` → `pnpm build` → relance**.
> Ne bumpe pas la version. Garde `ALL_RULES` à 53 (asserté par `tests/registry.test.ts` ;
> +7 règles cross-file sous `--graph`). Garde les 2 miroirs de bundle
> byte-identiques (`pnpm check:build`) et les fichiers `docker/` synchronisés.
> Mets tous les fichiers temporaires dans `/tmp`, ne modifie jamais les fixtures en
> place, et n'exécute jamais `init` (sans `--help`) ni `fix --write` dans le dépôt réel
> (utilise un dépôt git jetable dans `/tmp` ou une copie).
>
> **Santé d'abord** : `pnpm typecheck` ; `pnpm test` ; `pnpm check:build` ; `pnpm demo`.
>
> 1. **audit** — `good.html` (≈0 NC bloquante, exit 0) ; `bad.html` (violations connues) ;
>    stdin (`audit - < f.html`) ; `--json` (JSON valide : findings/criteria/scope) ;
>    `--jsx` sur un `.tsx` ; `--changed` / `--since HEAD~1` (vide = ok sur arbre propre) ;
>    `--max-files 1` (log de troncature + `scope.truncated`, pas de drop silencieux) ;
>    `--dedup exact|normalized|off` ; `--include`/`--exclude`/`--ext` ; `--baseline <file>`
>    (gate vs baseline) ; **`--fail-on bloquant|majeur|mineur` doit gater l'audit seul
>    (exit≠0) même sans `--baseline`** ; `--lang en`.
> 2. **report** — `--in audit.json` et `--in -` (stdin) ; `--out` ; défaut = WCAG
>    (`wcag-YYYY-MM-DD.md`) ; `--standard rgaa` (vue dérivée, doit différer,
>    `rgaa-YYYY-MM-DD.md`) ; `--standard nope` → exit 2 ; `--lang fr` ; 5 sections.
> 3. **criteria** — `criteria 1.4.3` (SC WCAG) ; `--list` (par règle) ; core `--theme 1`
>    → erreur (exit 2) ; `--standard rgaa --theme 1` / `--standard rgaa 8.3` ; `--json` ;
>    `--lang fr` ; `criteria 9.9.9` → erreur propre.
> 4. **check** — rapport valide → exit 0 ; critère inventé (`9.9.9`) → exit 1 ;
>    **taux de conformité hors [0..100] (ex. `999 %`) → exit 1** ; `--quiet` ; `--json`.
> 5. **verify** — `--report` génère `VERIFY.md` + `VERIFY.todo.json` ; `--max-verify N`
>    (cap) — **valeur non numérique → exit 2** ; `--semantic` ; `--apply` : verdict
>    refuted/unsupported → échec ; **verdict typo/mauvaise casse (`Refuted`, `conforming`)
>    → échec, pas de faux-vert** ; **fichier absent → "introuvable" exit 2** ;
>    **JSON non-tableau → exit 2 propre** ; tout `supported`/`partial` → exit 0.
> 6. **fix** — dry-run (défaut) sur `bad.html` (diff, aucune écriture) ; copie en `/tmp`
>    puis `--write` (n'applique qu'après re-audit sans nouvelle NC) ; classes auto
>    (tabindex/role/viewport), placeholder (alt/lang/title TODO, lang = BCP-47 `und`),
>    proposal ; `--only <ruleId>` ; `--json` ; JSX/TSX → `--write` applique les codemods
>    `jsxSafe` (offsets réels, non-lossy) ; le lossy-JSX reste proposal-only.
> 7. **init** — dépôt git jetable dans `/tmp` ; `init` (défaut = hook staged strict + auto-fix
>    sûr, SANS baseline) ; **`--baseline` seul → baseline UNIQUEMENT** ; **`--baseline --hook` → les deux** ;
>    **`--ci --baseline --fail-on majeur` → baseline + workflow gaté en `majeur`** ;
>    hook = `.git/hooks/pre-commit` (sh POSIX, bypass `SKIP_A11Y`, chemin moteur quoté) ;
>    **`init --help` n'écrit RIEN (pas d'effet de bord)**.
> 8. **scan** — statique : `scan` sans args / **fichier inexistant → erreur propre
>    "File not found", SANS build Docker** ; `--clean` idempotent ; sync des fichiers
>    embarqués (`pnpm test -- docker-sync`). Docker : `scan low-contrast.html` (NC
>    contraste), `scan <url>`, `--merge` dans un audit statique, `--sitemap`, `--crawl
>    --depth --max`.
>
> **Transverse** : `-h/--help` ; **`<cmd> --help` / `<cmd> -h` affiche l'aide sans rien
> exécuter** ; `-v/--version` (= version de `package.json`) ; commande inconnue + flag requis manquant → erreur
> propre (exit 2).
>
> Rends un tableau : commande/flag → statut (ok/bug) → fix appliqué → test ajouté.
> Termine seulement quand `pnpm test` + `typecheck` + `check:build` + `demo` passent tous.

---

Les comportements en **gras** sont des garde-fous ajoutés après une campagne de test
multi-agents (juin 2026) : ils étaient des bugs/faux-verts et sont désormais couverts par
des tests de non-régression (`tests/cli.test.ts`, `tests/verify.test.ts`, `tests/check.test.ts`).
