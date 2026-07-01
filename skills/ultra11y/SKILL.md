---
name: ultra11y
description: "Use to AUDIT existing HTML/CSS/JSX against WCAG 2.2 AA accessibility and produce a dated report, OR to AUTHOR/REVIEW accessible markup (native-HTML-first, ARIA last). An install-free engine (`node scripts/ultra11y.mjs`, no keys) runs 53 static checks across WCAG criteria — alt/lang/title, unlabeled fields, empty links/buttons, tables, heading skips, landmarks, invalid ARIA, live regions, error association, positive tabindex — deciding what it can; YOU supply judgment (alt relevance, link purpose) and needs-rendering criteria (contrast, focus, zoom) as residual risks. WCAG 2.2 AA is the worldwide core; RGAA and other standards are pluggable packs (`--standard rgaa`, `--pack`), with `pack check` gating AI-ingested packs. JSX/TSX parse to a real AST; `audit --graph` resolves cross-file imports; `prd` emits a fix backlog or PRD doc; check/verify reject hallucinated non-conformities. Triggers: 'audit WCAG/a11y', 'make accessible', 'fix a11y', 'audit RGAA'."
license: MIT
metadata:
  version: 2.6.0
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
US **Section 508**, the EU **EN 301 549** — are pluggable *standards packs* that map their
criteria onto WCAG. Add `--standard rgaa` to re-key reports/criteria; **plug an external
pack at runtime** with `--pack ./pack.json` (or a `.ultra11yrc.json`), no rebuild; or
contribute your country (see `references/standards.md`). Packs (and their concrete
**implementation guidance** — the RGAA SocialGouv/etalab good/bad patterns) can be
**AI-ingested** and gated by `pack check` so a fabricated mapping never passes — see
`references/packs.md` and `references/guidance.md`.

> **Core rules:**
> 1. **Never invent a non-conformity**: every `NC` cites a real, resolvable element (`check` verifies it).
> 2. **Native HTML first, ARIA last**; never duplicate implicit semantics.
> 3. **Residual is explicit**: any *rendering*/*judgment* criterion not proven goes to
>    "to assess manually", never silently marked conforming.
> 4. **The FINAL rendered semantic HTML must be correct.** The engine sees only source; a
>    component library (DSFR/MUI…) or `.vue`/`.svelte`/`.astro` SFC hides the real markup, so
>    a green source audit is not proof. Verify the produced semantic HTML — install the
>    zero-touch **capture** harvester (`render --setup`) so every component your tests render
>    is serialized to `.ultra11y/captures` and audited, with `audit --require-captures` gating
>    the blind spots. See `references/automation.md` / `rendered.md`.

## Choose by situation

- **"Audit / compliance report"** → `node scripts/ultra11y.mjs audit … --json`, then
  `report`, then `check`; read **`references/audit.md`**.
- **"Code rendered by a library (DSFR, MUI…) or a `.vue`/`.svelte`/`.astro` SFC / avoid
  false negatives"** → audit the **produced HTML**, not the source template. Easiest:
  install the zero-touch **capture** harvester (`render --setup`) so your tests serialize
  every rendered component to `.ultra11y/captures` (auto-ingested, findings attributed to the
  source component; `render --coverage` and `audit --require-captures` track blind spots). Or
  `render` (build→audit recipe or SSR snapshot `--scaffold`) then `audit` on the output, and
  `scan` for computed rendering. SFC-source findings are flagged `preliminary` (a
  `scope.sourceTemplate` caveat); read **`references/rendered.md`**.
- **"A finding looks wrong / false positive on a component"** → the engine auto-suppresses
  most component false positives (slot/prop-injected names, component children, dynamic
  bindings, conditional headings) and marks SFC/library-source findings `preliminary`;
  confirm or refute the rest with `verify --apply`; read **`references/false-positives.md`**.
- **"Large repo / audit smartly"** → focus: `--changed` (git diff), template
  prioritization, dedup, `--max-files`; read **`references/scale.md`**.
- **"Cross-file analysis (tree + dependencies), JSX/TSX as a real AST"** →
  `audit --graph` resolves imports and applies cross-file rules (an icon-only component
  used without a name, an anchor target in another file…), no browser; read
  **`references/cross-file.md`**.
- **"Generate the fix markdown / PRDs (→ GitHub issues)"** → `prd` (fix backlog by
  default with before/after guidance + effort, `--split criterion`, `--format doc` for a
  product-requirements doc with epics/user-stories/Given-When-Then, `--gh-issues` for one
  issue per criterion or `--gh-single` for a single consolidated issue via the `gh` CLI);
  read **`references/prd.md`**.
- **"Plug or author a standards pack (RGAA & beyond), AI-ingest external rules"** →
  `--pack`/`.ultra11yrc.json` to load at runtime, `pack check` to gate it (the
  anti-hallucination guardrail), `pack scaffold` to start one; concrete before/after
  implementation guidance attaches to findings/PRD; read **`references/packs.md`** and
  **`references/guidance.md`**.
- **"Decide the judgment / rendering criteria (judgment phase)"** → `verify` produces a
  checklist grounded in each SC's W3C Understanding reference; rule on each, then
  `verify --apply`; read **`references/judgment.md`**.
- **"Focus, keyboard & interaction logic (the human-logic part)"** → the engine marks
  focus order/visible/trap and on-focus/on-input criteria as residual risks; YOU read the
  full component source and reason about the keyboard/focus behaviour; read
  **`references/focus-and-logic.md`**.
- **"Put the fixes in place"** → `fix` (dry-run by default, `--write` applies the safe
  codemods, proposes the rest without inventing anything); read **`references/fix.md`**.
- **"Fix by priority, no regressions (correction phase)"** → `fix` (`--write`,
  `--iterate`) + the `prd` backlog, blocking→major→minor; read **`references/correction.md`**.
- **"Automatic repo gate (hook / CI)"** → `init --hook` writes a git pre-commit gate over
  the **strict staged snapshot** (audits the exact index blobs, auto-applies safe fixes and
  re-stages them, blocks only on judgment issues); `init --baseline`/`--ci` is the opt-in
  "block only NEW non-conformities" variant. For library/SFC code, commit rendered
  **captures** (`render --setup`) and stage them so the real semantic HTML is what's
  checked (`audit --require-captures`); read **`references/automation.md`**.
- **"Make this code accessible / review it"** → audit the snippet
  (`audit - < component.html`) native-first; read **`references/authoring.md`** and
  **`references/forbidden-patterns.md`**.
- **"What does criterion X mean"** → `criteria` (e.g. `criteria 1.4.3`, or
  `criteria --standard rgaa 8.3`); see **`references/criteria.md`**.
- **"Country standard (RGAA, Section 508, EN 301 549)"** → `--standard <pack>` on
  `report`/`prd`/`criteria`/`check`/`verify`; see **`references/standards.md`** and
  **`references/methodology.md`**.
- **"High-assurance audit"** → `verify --report … --semantic`; see **`references/verify.md`**.
- **"Check contrast / rendering (dynamic tier)"** → `scan <url> --merge …` (axe-core in a
  headless browser). `--runtime local` (default when Playwright resolves from `--cwd`, **no
  Docker**) also probes focus visibility (2.4.7), 200% zoom (1.4.4), text spacing (1.4.12) and
  content-on-hover (1.4.13) (target size 2.5.8 via axe), and takes `--storage-state` for
  authenticated pages; see **`references/dynamic.md`**.

## Command cheat sheet

```
node scripts/ultra11y.mjs audit "src/**/*.html" --json > audit.json
node scripts/ultra11y.mjs audit - < component.html          # HTML via stdin
node scripts/ultra11y.mjs audit "src/**/*.tsx" --jsx        # JSX/TSX as a real AST (streams to stdout; add --out audits to persist)
node scripts/ultra11y.mjs audit "src/**/*.tsx" --graph      # + imports & cross-file rules
node scripts/ultra11y.mjs audit --changed --json            # only the git diff (large repo)
node scripts/ultra11y.mjs audit --staged --fail-on blocking # gate EXACTLY the staged snapshot (pre-commit)
node scripts/ultra11y.mjs audit "src/**" --no-default-excludes   # also audit test/spec/story markup
node scripts/ultra11y.mjs report --in audit.json --out audits          # → audits/wcag-YYYY-MM-DD.md
node scripts/ultra11y.mjs report --in audit.json --standard rgaa       # derived RGAA report (France pack)
node scripts/ultra11y.mjs prd    --in audit.json --gh-issues           # fix backlog (+ one GitHub issue per criterion)
node scripts/ultra11y.mjs prd    --in audit.json --gh-single          # fix backlog (+ ONE consolidated GitHub issue)
node scripts/ultra11y.mjs prd    --in audit.json --format doc          # product-requirements doc (epics/stories/AC)
node scripts/ultra11y.mjs audit "src/**/*.tsx" --graph --pack ./packs/section508.json   # load an external pack at runtime
node scripts/ultra11y.mjs pack check ./packs/section508.json --guidance ./packs/section508.guidance.json   # gate an (AI-)authored pack
node scripts/ultra11y.mjs criteria 1.4.3                    # one WCAG success criterion
node scripts/ultra11y.mjs criteria --list                   # all SCs grouped by guideline
node scripts/ultra11y.mjs criteria --standard rgaa --theme 8   # a pack theme
node scripts/ultra11y.mjs check  --report audits/wcag-YYYY-MM-DD.md
node scripts/ultra11y.mjs verify --report audits/wcag-YYYY-MM-DD.md --semantic
node scripts/ultra11y.mjs render                            # build→audit recipe (or --scaffold SSR)
node scripts/ultra11y.mjs render --setup                    # install the zero-touch capture harvester (tests → .ultra11y/captures)
node scripts/ultra11y.mjs render --coverage                 # which components have a rendered capture vs blind spots
node scripts/ultra11y.mjs audit --require-captures          # gate: every opaque/control component must have a rendered capture
node scripts/ultra11y.mjs audit "dist/**/*.html"            # audit the RENDERED HTML (reliable for DSFR/MUI…)
node scripts/ultra11y.mjs fix "src/**/*.html" --write --iterate    # fix and re-apply to a fixpoint
node scripts/ultra11y.mjs fix --staged --write --safe       # auto-apply SAFE fixes to staged files + re-stage
node scripts/ultra11y.mjs init --hook                       # pre-commit gate: strict staged snapshot + safe auto-fix
node scripts/ultra11y.mjs init --hook --baseline            # opt-in: regression gate (hook + baseline)
node scripts/ultra11y.mjs audit "src/**/*.tsx" --jsx --out audits   # persist audits/audit-latest.json (for scan --merge / report --in)
node scripts/ultra11y.mjs scan https://example.com --merge audits/audit-latest.json  # dynamic tier (auto runtime)
node scripts/ultra11y.mjs scan http://localhost:3000 --runtime local --cwd packages/app --storage-state .auth/user.json  # no-Docker axe + probes, authed
```
Machine output everywhere with `--json`. Reports default to English; `--lang fr` available.

## The loop: audit → render → judge → fix → re-audit

To converge on conformance (not a single pass), chain the steps, letting the agent
drive the judgment and content stages:

1. **Audit** the source (`audit … --graph`) for a first map; on library-rendered code,
   **audit the render** (`render` → build/SSR → `audit`) for reliable verdicts (otherwise
   the scope-risk note reminds you).
2. **Judge & refute** with `verify` (W3C Understanding grounding): rule on each
   rendering/judgment criterion, AND **refute any `preliminary`/SFC/library-source finding**
   that the rendered DOM disproves — fill the `VERIFY.todo.json` verdicts, then
   `verify --apply` drops the refuted/unsupported ones (the anti-hallucination gate). This
   includes **focus & interaction logic** (read the full component source: keyboard
   operability, focus order/visibility, traps, on-focus/on-input changes; see
   `references/focus-and-logic.md`) and the per-rule traps in `references/false-positives.md`.
3. **Fix** by priority: `fix --write --iterate` for the mechanical part (anti-regression
   gate), then hand-apply the judgment/content fixes (alt, labels, structure) guided by
   `references/correction.md`.
4. **Re-audit** (on the render where relevant) and repeat.

**Stop** when `check` and `verify --apply` are green again and only explicitly-named
residual risks remain. (To automate the outer cadence, the harness `/loop` command can
re-run this cycle.)

## Combining engine, judgment and residual risk

The `audit` output classes each success criterion: `C`/`NC`/`NA` for the static subset;
`manual` for the rendering/judgment criteria (listed in `residualRisks`). Each SC carries an
`automatability` class — **`static`** (the engine can decide), **`needs-rendering`** (decide
via `scan`/the rendered DOM, never source), or **`judgment`** (you decide from source +
context) — which tells you *why* a criterion is `manual` and how to close it. The engine's
`NC`s are **confirmed candidates** (cited `file:line`); a finding marked `preliminary: true`
(SFC/library source) is provisional — confirm against the render or refute it. You rule on
the `manual` criteria and mark the rendering criteria "to verify manually". The report is
complete only when every applicable criterion is a justified `C`/`NC`/`NA` and every residual
risk is named.

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
reflow) are covered by the optional `scan` tier (axe-core, Docker **or** `--runtime local`).
The local runtime additionally **probes** focus visibility (2.4.7), 200% text zoom (1.4.4),
text spacing (1.4.12) and content-on-hover (1.4.13) — observed in the rendered page, raised
as NC only when the failure is seen (a clean probe leaves the SC `manual`, never silently
conforming); reading order and alt relevance stay human judgment.
Data: WCAG 2.2 ©
W3C (W3C Document License); the RGAA pack is RGAA 4.1.2 © DINUM, Licence Ouverte / Etalab
2.0 (see `NOTICE`).
