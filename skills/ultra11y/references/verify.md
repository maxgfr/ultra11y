# `check` and `verify` gates

Two assurance levels before shipping a report.

## `check` — structural integrity

```
node scripts/ultra11y.mjs check --report audits/wcag-YYYY-MM-DD.md
```
Fails (non-zero) if: one of the 5 sections is missing, a cited criterion id does not exist in
the active standard, an `NA` criterion has no justification, or the pass rate is absent. This
is the baseline anti-hallucination guard. `--quiet` emits only the exit code; `--json` the
structured list of problems. For a country pack report, add `--standard <pack>` so the right
id grammar/registry is validated.

## `verify` — adversarial verification of non-conformities

```
node scripts/ultra11y.mjs verify --report audits/wcag-YYYY-MM-DD.md --semantic
```
Generates a **worklist** `VERIFY.md` + `VERIFY.todo.json`: one entry per non-conformity
(criterion ↔ `file:line` ↔ cited claim), capped by `--max-verify` (default 40). For each
entry, open the cited code and assign a verdict in `VERIFY.todo.json`:

- `supported` — the non-conformity is real;
- `partial` — real but the criterion/wording is imprecise;
- `refuted` — false (the cited element is actually conforming);
- `unsupported` — the cited element is not enough to decide.

In `--semantic` mode, explicitly confirm the cited snippet **supports** the non-conformity.
Then apply the gate:
```
node scripts/ultra11y.mjs verify --apply VERIFY.todo.json
```
The gate fails (non-zero) if any entry is `refuted`, `unsupported`, or unadjudicated. Goal: no
fabricated non-conformity survives into the final report.

## Residual risk

`verify` only covers the declared non-conformities. The undecided *needs-rendering* and
*judgment* criteria stay in the report's "to assess manually" section — never mark them
conforming without a human check.
