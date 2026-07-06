# Auditor backlog (`prd`) + GitHub issues

`prd` turns an `AuditResult` into an **auditor-legible conformance backlog**, grouped by WCAG
success criterion (or, with `--standard <pack>`, by a country standard's criteria). It is the
"action" counterpart of `report` (which is the compliance document).

```
node scripts/ultra11y.mjs audit "src/**/*.tsx" --graph --json > audit.json
node scripts/ultra11y.mjs prd --in audit.json                      # auditor backlog (default)
node scripts/ultra11y.mjs prd --in audit.json --split criterion    # one file per criterion
node scripts/ultra11y.mjs prd --in audit.json --gh-issues          # + one GitHub issue per criterion
node scripts/ultra11y.mjs prd --in audit.json --gh-single          # + ONE consolidated GitHub issue (whole audit)
node scripts/ultra11y.mjs prd --in audit.json --standard rgaa --lang fr   # rendered with the RGAA (fr) vocabulary
node scripts/ultra11y.mjs prd --in audit.json --format doc         # product-requirements doc (epics/stories/AC)
node scripts/ultra11y.mjs prd --in audit.json --format remediation # legacy dev fix-backlog
```

## Output

- **Default (`--format audit`) — the auditor conformance block**: one document
  `audits/prd-YYYY-MM-DD.md`, sectioned by priority (🔴 blocking → 🟠 major → 🟡 minor). Each
  criterion becomes an entry rendered **with the active standard's vocabulary** (see
  `references/standards.md` → *Auditor vocabulary*): **theme** (RGAA *Thématique* / WCAG core
  *Principle · Guideline*), **criterion** + its official wording, **test(s)** (RGAA test
  numbers `11.6.1` / WCAG techniques), **WCAG** mapping + level, the **finding** (non-conformity,
  labelled with the standard's *non-conformant* verdict), the **expected** conformant state, a
  **verification** method, and the occurrence **checklist** (`file:line`) with the cross-file
  **definition site** (`related`) when present. Localized by `--lang fr|en`. The **GitHub issues**
  below use this same block by default.
- **`--format remediation` (legacy dev backlog)**: the previous developer-oriented block —
  fix(es), an **effort estimate** (S/M/L), a **before/after example** from the implementation
  guidance (`references/guidance.md`), and the occurrence checklist.
- **`--format doc` (product-requirements doc)**: `audits/prd-doc-YYYY-MM-DD.md` — epics
  grouped by theme, one **user story** per criterion, **Given/When/Then** acceptance criteria
  templated from the real SC title/techniques (anchored to W3C text), and the task list.
- **`--split criterion`**: a `prd-<criterion>-YYYY-MM-DD.md` file per criterion (handy for batching).
- The markdown is **always** written, even with `--gh-issues`.
- **`--json`**: emits a machine-readable object instead of the file paths —
  `{paths, units, gh?}` where `units` is the structured per-criterion backlog an agent can consume.

## GitHub issues (`--gh-issues` / `--gh-single`, opt-in)

- Uses the **`gh` CLI** (which handles its own auth) — **no** npm dependency, no key in
  ultra11y.
- **`--gh-issues` → one issue per criterion** (regardless of `--split`), stable title
  `"[a11y] WCAG <sc> — <title>"` (or `"[a11y] <PACK> <id> — …"` under `--standard`), labels
  `accessibility`, `wcag` (or the pack key), severity. The body is the **auditor conformance
  block** (theme, criterion + wording, test(s), WCAG + level, finding, expected, verification,
  `file:line` occurrences + definition site) — same as the default backlog, in the active
  standard's vocabulary. `--format remediation` files the legacy dev body instead.
- **`--gh-single` → ONE consolidated issue** for the whole audit, stable title
  `"[a11y] WCAG — Accessibility audit"` (or `"[a11y] <PACK> — Accessibility audit"`). The body
  is the full backlog **sectioned by severity** (🔴 blocking → 🟠 major → 🟡 minor), each
  criterion carrying the auditor block. Labelled by the **most severe** criterion.
- `--gh-single` **wins** if both flags are passed.
- **De-dupe by title**: an existing issue (open or closed) is skipped, so re-running never
  creates duplicates. The consolidated title carries **no count or date**, so it stays stable
  across re-runs.
- **Caveat — `--lang` changes the title**: the issue title embeds the localized criterion/pack
  title (e.g. `[a11y] WCAG 1.4.3 — Contrast (Minimum)` vs `[a11y] WCAG 1.4.3 — Contraste (minimum)`).
  Since de-dupe matches on the **exact title string**, re-running `prd --gh-issues` with a
  **different `--lang`** than a previous run does **not** match the earlier issue and creates a
  new one instead of updating it. Keep `--lang` consistent across re-runs against the same
  repo, or accept the duplicate and close the stale one manually.
- **Graceful degradation**: if `gh` is absent / unauthenticated, the command says so and exits
  `0` — the markdown was still produced.

> `prd` reads the `AuditResult` produced by `audit` (ideally `--graph` for cross-file
> coverage); it reuses the criterion titles, severities, messages, remediations and
> `file:line` already computed.
