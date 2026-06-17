# ultra11y

> Audit HTML/CSS/JSX for **RGAA 4.1.2** + WCAG 2.1/2.2 AA accessibility and produce a dated compliance report — or author/review accessible markup without regressions. A [skills.sh](https://skills.sh) agent skill: a deterministic, zero-dependency static engine **plus** the agent's judgment, with `check`/`verify` gates against hallucinated non-conformities.

ultra11y is built around an honest **division of labour**. Automated tools only catch a fraction of accessibility problems, so the engine does the *mechanical* work — the ~35 machine-detectable checks across the 13 RGAA themes — and is explicit about everything it cannot decide:

- **Automatable (engine):** missing `alt`/`lang`/`title`, unlabeled fields, empty links/buttons, icon-only controls, iframes without title, tables without headers, heading-level skips, duplicate ids, invalid/broken ARIA, positive `tabindex`, autoplay media…
- **Needs rendering (you):** computed contrast, visible focus, zoom/reflow, content on hover — flagged as **residual risks**, never silently "conforming".
- **Human judgment (you):** alt-text relevance, link purpose in context, reading/tab order, caption accuracy…

## Install

```sh
npx skills add maxgfr/ultra11y
```

Or clone and run the bundled engine directly (Node ≥ 18, zero dependencies):

```sh
node scripts/ultra11y.mjs --help
```

## Commands

```
ultra11y audit    <globs… | ->  [--out <dir>] [--include <glob>] [--exclude <glob>] [--ext <list>] [--jsx] [--json] [--lang fr|en]
ultra11y audit    [--changed | --since <ref>] [--max-files <n>] [--dedup exact|normalized|off] [--baseline <file>] [--fail-on bloquant|majeur|mineur]
ultra11y report   --in <audit.json> [--out <dir>] [--standard rgaa|wcag] [--lang fr|en]
ultra11y criteria [<id>] [--theme <N>] [--list] [--standard rgaa|wcag] [--json] [--lang fr|en]
ultra11y check    --report <md> [--quiet] [--json]
ultra11y verify   --report <md> [--semantic] [--apply <verdicts.json>] [--max-verify <n>] [--json]
ultra11y fix      <globs… | ->  [--write] [--changed | --since <ref>] [--only <ids>] [--jsx] [--json]
ultra11y init     [--hook] [--ci] [--baseline] [--fail-on bloquant|majeur|mineur]
ultra11y scan     <url|file> [--merge <audit.json>] [--out <dir>] [--docker] [--json]
```

### Scale, fixes, and repo automation

- **Scale** — the engine streams file-by-file (bounded memory), audits **only markup**,
  and lets you focus: `--changed`/`--since` (git diff only), priority ordering
  (layouts/templates/shared components first), content de-duplication, and an explicit
  `--max-files` cap with logged truncation. See `references/scale.md`.
- **Fixes** — `fix` puts the fixes in place (native-first, anti-hallucination): deterministic
  auto-codemods, fill-in `TODO` placeholders for the agent to complete, and judgment-only
  proposals. `--dry-run` is the default; `--write` applies but only after a re-audit proves
  no new non-conformity, and never on lossy JSX/TSX. See `references/fix.md`.
- **Automation** — `init` wires a zero-dependency git pre-commit hook and/or a GitHub Actions
  job that run `audit --changed --baseline` so only **new** blocking non-conformities fail (not
  the existing backlog). See `references/automation.md`.
- **Worldwide** — RGAA stays the engine's key; `--standard wcag` re-keys `report`/`criteria` by
  WCAG 2.1 AA success criterion (presentation-only), with an EN 301 549 / Section 508 equivalence
  note. See `references/methodology.md`.

### Optional dynamic tier (Docker + axe-core)

`scan` runs **axe-core in a headless browser** (Playwright, in a self-contained Docker image built on first use) to decide the *needs-rendering* criteria the static engine leaves as residual risks — chiefly **computed colour contrast (3.2/3.3)** plus a 320px **reflow** check (10.11) and a render cross-check of the structural rules. `--merge` folds the findings into a static `AuditResult`, upgrading `manual` criteria to `C`/`NC`:

```sh
node scripts/ultra11y.mjs audit "src/**/*.html" --out audits --json > /dev/null
node scripts/ultra11y.mjs scan https://example.com --merge audits/audit-latest.json --out audits
node scripts/ultra11y.mjs report --in audits/audit-latest.json --out audits
```

Requires Docker (the rest of the skill is zero-dependency and Docker-free). The runner + Dockerfile are embedded in the engine and mirrored under `docker/` (with a `docker-compose.yml`). See `skills/ultra11y/references/dynamic.md`.

Typical audit flow:

```sh
node scripts/ultra11y.mjs audit "src/**/*.html" --json > audit.json
node scripts/ultra11y.mjs report --in audit.json --out audits      # audits/rgaa-YYYY-MM-DD.md
node scripts/ultra11y.mjs check  --report audits/rgaa-YYYY-MM-DD.md # integrity gate
```

The skill (`skills/ultra11y/SKILL.md` + `references/`) teaches the agent when and how to run these, how to complete the manual criteria, and the native-first authoring doctrine.

## Development

```sh
pnpm install
pnpm test            # vitest
pnpm run typecheck
pnpm run build       # tsup → scripts/ultra11y.mjs, mirrored into skills/ultra11y/scripts/
pnpm run check:build # asserts the committed bundle is reproducible
pnpm run fetch:rgaa  # re-fetch + transform the official RGAA dataset
```

Releases are cut automatically by semantic-release on push to `main` (GitHub release + tarball, no npm publish).

## Data & licensing

- ultra11y's code: **MIT** (see `LICENSE`).
- The bundled RGAA dataset (`src/data/rgaa.json`, `glossary.json`) is derived from the official **RGAA 4.1.2** reference published by DINUM/DISIC, under the **Licence Ouverte / Etalab 2.0** — see `NOTICE`. Attribution: « RGAA 4.1.2 — DINUM ».
- The report format is inspired by DINUM/etalab-ia audit conventions; the native-first authoring rules are adapted from the SocialGouv accessibility skill. No source code was copied.
