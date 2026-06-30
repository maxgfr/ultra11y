# ultra11y

> Audit HTML/CSS/JSX against **WCAG 2.2 AA** accessibility and produce a dated compliance report — or author/review accessible markup without regressions. A [skills.sh](https://skills.sh) agent skill: a deterministic, zero-dependency static engine **plus** the agent's judgment, with `check`/`verify` gates against hallucinated non-conformities. **WCAG is the worldwide core; country standards (RGAA, …) are pluggable in-repo packs.**

ultra11y is built around an honest **division of labour**. Automated tools only catch a fraction of accessibility problems, so the engine does the *mechanical* work — 42 machine-detectable checks tied to the WCAG 2.2 success criteria — and is explicit about everything it cannot decide:

- **Automatable (engine):** missing `alt`/`lang`/`title`, unlabeled fields, empty links/buttons, icon-only controls, iframes without title, tables without headers, heading-level skips, empty/dangling headings & labels, duplicate ids, invalid/broken ARIA, positive `tabindex`, autoplay/timed-refresh/`blink`/`marquee` media…
- **Needs rendering (you):** computed contrast, visible focus, zoom/reflow, content on hover — flagged as **residual risks**, never silently "conforming".
- **Human judgment (you):** alt-text relevance, link purpose in context, reading/tab order, caption accuracy…

## Install

```sh
npx skills add maxgfr/ultra11y
```

Or clone and run the bundled engine directly (Node ≥ 22.18, zero dependencies):

```sh
node scripts/ultra11y.mjs --help
```

## Commands

```
ultra11y audit    <globs… | ->  [--out <dir>] [--include <glob>] [--exclude <glob>] [--ext <list>] [--jsx] [--graph] [--json] [--lang en|fr]
ultra11y audit    [--changed | --since <ref>] [--max-files <n>] [--dedup exact|normalized|off] [--baseline <file>] [--fail-on blocking|major|minor]
ultra11y report   --in <audit.json> [--out <dir>] [--standard <pack>] [--lang en|fr]
ultra11y prd      --in <audit.json> [--out <dir>] [--split criterion] [--standard <pack>] [--gh-issues | --gh-single] [--lang en|fr]
ultra11y criteria [<sc>] [--list] [--standard <pack> [--theme <N>]] [--generate] [--json] [--lang en|fr]
ultra11y check    --report <md> [--standard <pack>] [--quiet] [--json]
ultra11y verify   --report <md> [--standard <pack>] [--semantic] [--apply <verdicts.json>] [--max-verify <n>] [--json]
ultra11y fix      <globs… | ->  [--write] [--iterate] [--changed | --since <ref>] [--only <ids>] [--jsx] [--json]
ultra11y init     [--hook] [--ci] [--baseline] [--fail-on blocking|major|minor]
ultra11y scan     <url|file> [--merge <audit.json>] [--out <dir>] [--docker] [--json]
```

## Standards packs (RGAA France first; add your country)

WCAG 2.2 AA is the engine's canonical key. Each country standard ships as an in-repo
**standards pack** — a small JSON that maps the national standard's criteria onto WCAG
success criteria — so the same audit re-keys to any standard:

```sh
node scripts/ultra11y.mjs report   --in audits/audit-latest.json --standard rgaa   # → audits/rgaa-YYYY-MM-DD.md
node scripts/ultra11y.mjs criteria --standard rgaa 8.3                              # a pack criterion (+ its WCAG SCs)
```

**RGAA 4.1.2** (France) ships as the flagship pack. Section 508 (US), EN 301 549 (EU) and
others are welcome — adding a country is a single PR (pack JSON + one registration line +
a test). See [`CONTRIBUTING.md`](CONTRIBUTING.md) and `skills/ultra11y/references/standards.md`.

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

### Optional dynamic tier (Docker + axe-core)

`scan` runs **axe-core in a headless browser** (Playwright, in a self-contained Docker image built on first use) to decide the *needs-rendering* criteria the static engine leaves as residual risks — chiefly **computed colour contrast (1.4.3)** plus a 320px **reflow** check (1.4.10) and a render cross-check of the structural rules. `--merge` folds the findings into a static `AuditResult`, upgrading `manual` criteria to `C`/`NC`:

```sh
node scripts/ultra11y.mjs audit "src/**/*.html" --out audits --json > /dev/null
node scripts/ultra11y.mjs scan https://example.com --merge audits/audit-latest.json --out audits
node scripts/ultra11y.mjs report --in audits/audit-latest.json --out audits
```

Requires Docker (the rest of the skill is zero-dependency and Docker-free). The runner + Dockerfile are embedded in the engine and mirrored under `docker/` (with a `docker-compose.yml`). See `skills/ultra11y/references/dynamic.md`.

Typical audit flow:

```sh
node scripts/ultra11y.mjs audit "src/**/*.html" --json > audit.json
node scripts/ultra11y.mjs report --in audit.json --out audits      # audits/wcag-YYYY-MM-DD.md
node scripts/ultra11y.mjs check  --report audits/wcag-YYYY-MM-DD.md # integrity gate
```

The skill (`skills/ultra11y/SKILL.md` + `references/`) teaches the agent when and how to run these, how to complete the manual criteria, and the native-first authoring doctrine.

## Development

```sh
pnpm install
pnpm test               # vitest
pnpm run typecheck
pnpm run build          # tsup → scripts/ultra11y.mjs, mirrored into skills/ultra11y/scripts/
pnpm run check:build    # asserts the committed bundle is reproducible
pnpm run build:wcag     # re-derive src/data/wcag.json from the vendored W3C source
pnpm run build:pack:rgaa # re-build the RGAA pack from the vendored DINUM source
pnpm run build:criteria  # regenerate skills/ultra11y/references/criteria.md
```

Releases are cut automatically by semantic-release on push to `main` (GitHub release + tarball, no npm publish).

## Data & licensing

- ultra11y's code: **MIT** (see `LICENSE`).
- The **WCAG 2.2** success-criteria dataset (`src/data/wcag.json`) is derived from the official W3C source ([w3c/wcag](https://github.com/w3c/wcag)); WCAG 2.2 is © **W3C**, reused under the **W3C Document License** (only SC ids/titles/levels are reproduced) — see `NOTICE`.
- The **RGAA pack** (`src/data/standards/rgaa.json`, `rgaa.glossary.json`) is derived from the official **RGAA 4.1.2** reference published by DINUM/DISIC, under the **Licence Ouverte / Etalab 2.0** — see `NOTICE`. Attribution: « RGAA 4.1.2 — DINUM ».
- The report format is inspired by DINUM/etalab-ia audit conventions; the native-first authoring rules are adapted from the SocialGouv accessibility skill. No source code was copied.
