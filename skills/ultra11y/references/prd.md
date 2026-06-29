# PRD / fix backlog (`prd`) + GitHub issues

`prd` turns an `AuditResult` into the **markdown of fixes to do**, grouped by WCAG success
criterion (or, with `--standard <pack>`, by a country standard's criteria). It is the
"action" counterpart of `report` (which is the compliance document).

```
node scripts/ultra11y.mjs audit "src/**/*.tsx" --graph --json > audit.json
node scripts/ultra11y.mjs prd --in audit.json                     # single backlog (default)
node scripts/ultra11y.mjs prd --in audit.json --split criterion   # one PRD per criterion
node scripts/ultra11y.mjs prd --in audit.json --gh-issues         # + one GitHub issue per criterion
node scripts/ultra11y.mjs prd --in audit.json --standard rgaa     # backlog keyed by the RGAA pack
node scripts/ultra11y.mjs prd --in audit.json --format doc        # product-requirements doc (epics/stories/AC)
```

## Output

- **Default (fix backlog)**: one document `audits/prd-YYYY-MM-DD.md`, sectioned by priority
  (🔴 blocking → 🟠 major → 🟡 minor). Each criterion becomes a block: title + WCAG ref,
  fix(es), an **effort estimate** (S/M/L from Σ severity-weighted occurrences), a
  **before/after example** drawn from the implementation guidance (see
  `references/guidance.md`), then a **checklist** of occurrences (`file:line`), with the
  **definition site** (`related`) when a cross-file flag carries one.
- **`--format doc` (product-requirements doc)**: `audits/prd-doc-YYYY-MM-DD.md` — epics
  grouped by theme (WCAG guideline, or the pack theme under `--standard`), one **user
  story** per criterion, **Given/When/Then** acceptance criteria templated from the real SC
  title/techniques (anchored to W3C text, never invented outcomes), and the occurrence task
  list. Hand it to a dev team or pair it with `--gh-issues`.
- **`--split criterion`**: a `prd-<criterion>-YYYY-MM-DD.md` file per criterion with
  non-conformities (handy for batching).
- The markdown is **always** written, even with `--gh-issues`.

## GitHub issues (`--gh-issues`, opt-in)

- Uses the **`gh` CLI** (which handles its own auth) — **no** npm dependency, no key in
  ultra11y.
- **One issue per criterion** (regardless of `--split`), stable title
  `"[a11y] WCAG <sc> — <title>"` (or `"[a11y] <PACK> <id> — …"` under `--standard`), labels
  `accessibility`, `wcag` (or the pack key), severity. The body carries fix + `file:line`
  occurrences + definition site.
- **De-dupe by title**: an existing issue (open or closed) is skipped, so re-running never
  creates duplicates.
- **Graceful degradation**: if `gh` is absent / unauthenticated, the command says so and exits
  `0` — the markdown was still produced.

> `prd` reads the `AuditResult` produced by `audit` (ideally `--graph` for cross-file
> coverage); it reuses the criterion titles, severities, messages, remediations and
> `file:line` already computed.
