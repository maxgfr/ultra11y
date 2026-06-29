---
name: ultra11y
description: "Use to AUDIT existing HTML/CSS/JSX against WCAG 2.2 AA accessibility and produce a dated compliance report, OR to AUTHOR/REVIEW accessible markup (native-HTML-first, ARIA last). An install-free engine (`node scripts/ultra11y.mjs`, no install, no keys) runs 36 static checks across WCAG success criteria — missing alt/lang/title, unlabeled fields, empty links/buttons, tables, heading skips, invalid ARIA, positive tabindex — and decides the criteria it can; YOU supply the judgment (alt relevance, link purpose) and needs-rendering criteria (contrast, focus, zoom) as residual risks. WCAG 2.2 AA is the worldwide core; RGAA (France) and other country standards are pluggable in-repo packs (`--standard rgaa`). JSX/TSX parse to a real AST; `audit --graph` resolves cross-file imports; `prd` emits a fix backlog; check/verify gates reject hallucinated non-conformities. Triggers: 'audit accessibility / WCAG / a11y', 'compliance report', 'make this accessible', 'fix accessibility', 'audit RGAA'."
license: MIT
metadata:
  version: 2.1.0
---

# ultra11y — audit WCAG 2.2 AA and write accessible markup

On accessibility, an automated tool only sees part of the problem. `ultra11y` owns
that with a **division of labour**: the deterministic, install-free engine
(`node scripts/ultra11y.mjs <command>` — no `npm install`, no key; the JSX/TSX parser
is embedded in the bundle) does the *mechanical* work — detect the machine-checkable
non-conformities and tie each to the right **WCAG success criterion** — and **you** do
the *judgment* — alt relevance, link purpose in context, reading order — plus the
criteria that need a **rendered DOM** (contrast, focus, zoom). Gates stop any
hallucinated non-conformity from surviving.

**WCAG 2.2 Level AA is the worldwide core.** Country standards — France's **RGAA**, the
US **Section 508**, the EU **EN 301 549** — are pluggable in-repo *standards packs* that
map their criteria onto WCAG; add `--standard rgaa` to re-key reports/criteria, or
contribute your country (see `references/standards.md`).

> **Core rules:**
> 1. **Never invent a non-conformity**: every `NC` cites a real, resolvable element (`check` verifies it).
> 2. **Native HTML first, ARIA last**; never duplicate implicit semantics.
> 3. **Residual is explicit**: any *rendering*/*judgment* criterion not proven goes to
>    "to assess manually", never silently marked conforming.

## Choose by situation

- **"Audit / compliance report"** → `node scripts/ultra11y.mjs audit … --json`, then
  `report`, then `check`; read **`references/audit.md`**.
- **"Code rendered by a library (DSFR, MUI…) / avoid false negatives"** → audit the
  **produced HTML**, not the JSX source: `render` (build→audit recipe or SSR snapshot
  `--scaffold`) then `audit` on the output, and `scan` for computed rendering; read
  **`references/rendered.md`**.
- **"Large repo / audit smartly"** → focus: `--changed` (git diff), template
  prioritization, dedup, `--max-files`; read **`references/scale.md`**.
- **"Cross-file analysis (tree + dependencies), JSX/TSX as a real AST"** →
  `audit --graph` resolves imports and applies cross-file rules (an icon-only component
  used without a name, an anchor target in another file…), no browser; read
  **`references/cross-file.md`**.
- **"Generate the fix markdown / PRDs (→ GitHub issues)"** → `prd` (backlog by default,
  `--split criterion`, `--gh-issues` via the `gh` CLI); read **`references/prd.md`**.
- **"Decide the judgment / rendering criteria (judgment phase)"** → `verify` produces a
  checklist grounded in each SC's W3C Understanding reference; rule on each, then
  `verify --apply`; read **`references/judgment.md`**.
- **"Put the fixes in place"** → `fix` (dry-run by default, `--write` applies the safe
  codemods, proposes the rest without inventing anything); read **`references/fix.md`**.
- **"Fix by priority, no regressions (correction phase)"** → `fix` (`--write`,
  `--iterate`) + the `prd` backlog, blocking→major→minor; read **`references/correction.md`**.
- **"Automatic repo gate (hook / CI)"** → `init --hook`/`--ci`/`--baseline` (fails only
  on NEW non-conformities); read **`references/automation.md`**.
- **"Make this code accessible / review it"** → audit the snippet
  (`audit - < component.html`) native-first; read **`references/authoring.md`** and
  **`references/forbidden-patterns.md`**.
- **"What does criterion X mean"** → `criteria` (e.g. `criteria 1.4.3`, or
  `criteria --standard rgaa 8.3`); see **`references/criteria.md`**.
- **"Country standard (RGAA, Section 508, EN 301 549)"** → `--standard <pack>` on
  `report`/`prd`/`criteria`/`check`/`verify`; see **`references/standards.md`** and
  **`references/methodology.md`**.
- **"High-assurance audit"** → `verify --report … --semantic`; see **`references/verify.md`**.
- **"Check contrast / rendering (optional Docker tier)"** → `scan <url> --merge …`
  (axe-core in a headless browser); see **`references/dynamic.md`**.

## Command cheat sheet

```
node scripts/ultra11y.mjs audit "src/**/*.html" --json > audit.json
node scripts/ultra11y.mjs audit - < component.html          # HTML via stdin
node scripts/ultra11y.mjs audit "src/**/*.tsx" --jsx        # JSX/TSX as a real AST
node scripts/ultra11y.mjs audit "src/**/*.tsx" --graph      # + imports & cross-file rules
node scripts/ultra11y.mjs audit --changed --json            # only the git diff (large repo)
node scripts/ultra11y.mjs report --in audit.json --out audits          # → audits/wcag-YYYY-MM-DD.md
node scripts/ultra11y.mjs report --in audit.json --standard rgaa       # derived RGAA report (France pack)
node scripts/ultra11y.mjs prd    --in audit.json --gh-issues           # fix backlog (+ GitHub issues)
node scripts/ultra11y.mjs criteria 1.4.3                    # one WCAG success criterion
node scripts/ultra11y.mjs criteria --list                   # all SCs grouped by guideline
node scripts/ultra11y.mjs criteria --standard rgaa --theme 8   # a pack theme
node scripts/ultra11y.mjs check  --report audits/wcag-YYYY-MM-DD.md
node scripts/ultra11y.mjs verify --report audits/wcag-YYYY-MM-DD.md --semantic
node scripts/ultra11y.mjs render                            # build→audit recipe (or --scaffold SSR)
node scripts/ultra11y.mjs audit "dist/**/*.html"            # audit the RENDERED HTML (reliable for DSFR/MUI…)
node scripts/ultra11y.mjs fix "src/**/*.html" --write --iterate    # fix and re-apply to a fixpoint
node scripts/ultra11y.mjs init --hook --baseline            # regression gate (hook + baseline)
node scripts/ultra11y.mjs scan https://example.com --merge audits/audit-latest.json  # Docker tier
```
Machine output everywhere with `--json`. Reports default to English; `--lang fr` available.

## The loop: audit → render → judge → fix → re-audit

To converge on conformance (not a single pass), chain the steps, letting the agent
drive the judgment and content stages:

1. **Audit** the source (`audit … --graph`) for a first map; on library-rendered code,
   **audit the render** (`render` → build/SSR → `audit`) for reliable verdicts (otherwise
   the scope-risk note reminds you).
2. **Judge** the rendering/judgment criteria with `verify` (W3C Understanding grounding)
   and decide each entry.
3. **Fix** by priority: `fix --write --iterate` for the mechanical part (anti-regression
   gate), then hand-apply the judgment/content fixes (alt, labels, structure) guided by
   `references/correction.md`.
4. **Re-audit** (on the render where relevant) and repeat.

**Stop** when `check` and `verify --apply` are green again and only explicitly-named
residual risks remain. (To automate the outer cadence, the harness `/loop` command can
re-run this cycle.)

## Combining engine, judgment and residual risk

The `audit` output classes each success criterion: `C`/`NC`/`NA` for the static subset;
`manual` for the rendering/judgment criteria (listed in `residualRisks`). The engine's
`NC`s are **confirmed candidates** (cited `file:line`). You rule on the `manual` criteria
and mark the rendering criteria "to verify manually". The report is complete only when
every applicable criterion is a justified `C`/`NC`/`NA` and every residual risk is named.

## Do not

- Invent a non-conformity the engine did not find and you cannot see (contrast on
  **inline literal colours** is decided statically; **computed** contrast — external CSS,
  variables — goes through `scan` (Docker tier) or is verified at render before being declared).
- Add ARIA that duplicates native semantics.
- Mark a rendering/judgment criterion "conforming" without a human check.
- Hand-edit `references/criteria.md` (generated from the WCAG dataset via `criteria --generate`).

## Scope

Static engine: offline, deterministic, install-free; inputs are HTML + JSX/TSX (real AST,
cross-file analysis via `--graph`) + stdin. The **rendering** criteria (computed contrast,
reflow) are covered by the optional `scan` tier (axe-core in Docker); **focus visible**,
200% text zoom and content-on-hover stay in human review (residual risk). Data: WCAG 2.2 ©
W3C (W3C Document License); the RGAA pack is RGAA 4.1.2 © DINUM, Licence Ouverte / Etalab
2.0 (see `NOTICE`).
