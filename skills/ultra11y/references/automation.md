# Automate in the repo — `init` (hook / CI)

ultra11y can stay an **on-demand** skill, or become a **regression gate** that runs on its own.
`init` wires both (zero-dependency, no husky):

```
node scripts/ultra11y.mjs init --baseline      # writes audits/baseline.json (the reference)
node scripts/ultra11y.mjs init --hook          # .git/hooks/pre-commit
node scripts/ultra11y.mjs init --ci            # .github/workflows/a11y.yml
node scripts/ultra11y.mjs init                 # default: --hook + --baseline
```

## The principle: only block regressions

The hook and CI actually run:

```
node scripts/ultra11y.mjs audit --changed --baseline audits/baseline.json --fail-on blocking
```

- `--changed` (or `--since <ref>` in CI) restricts the audit to the **diff** — proportional to
  the change, not the repo.
- `--baseline audits/baseline.json` is the committed snapshot of the known state. The gate
  **only fails on NEW** non-conformities introduced by the diff, never on the existing backlog.
  Stable finding identity: `(rule, criterion, file, source range)` — robust to line drift.
- `--fail-on blocking|major|minor` sets the blocking threshold (default: `blocking`; the French
  aliases `bloquant|majeur|mineur` are also accepted).

## Setup

1. `init --baseline` then **commit `audits/baseline.json`** (without a reference, any diff
   non-conformity at the threshold blocks).
2. `init --hook` for the local gate (pre-commit). One-off bypass: `SKIP_A11Y=1 git commit …`.
   When the hook flags, open the cited code, complete the judgment, or run `fix --changed
   --write` (see `references/fix.md`).
3. `init --ci` for the PR gate (GitHub Actions, on the diff vs the target branch).
4. Refresh the baseline as you burn down backlog: `init --baseline` again.

> The gate relies on the static engine. The **rendering** (contrast, focus, zoom) and
> **judgment** criteria still need checking in the full audit — the gate stops mechanical
> regressions, it does not replace human review.
