# Audit existing code → WCAG report

Goal: produce a dated, reliable WCAG 2.2 AA compliance report. The engine decides the
automatable subset; the **AI agent** adjudicates the judgment criteria (`verify --manual`,
gated) and routes the rendering criteria to `scan`; the gates stop any hallucinated
non-conformity.

## The loop

1. **Scope it.** Which files / components? HTML, JSX/TSX and Vue/Svelte/Astro components
   (`.vue`/`.svelte`/`.astro`) are walked by default; add server templates (Twig, ERB,
   Handlebars…) with `--ext .twig,.erb`. **Test/spec/story markup** (`*.test.*`,
   `*.spec.*`, `*.stories.*`, `__tests__/`) is excluded by default — it is bad-by-design
   and never shipped; pass `--no-default-excludes` (or name the file) to audit it anyway.
   **`.vue`/`.svelte`/`.astro` are audited as SOURCE templates**: slots, snippets and
   dynamic bindings are invisible, so their findings are flagged `preliminary` and the run
   carries a `scope.sourceTemplate` caveat — audit the rendered output to confirm (step 3,
   and `references/rendered.md`).
2. **Run the engine:**
   ```
   node scripts/ultra11y.mjs audit "src/**/*.html" --json > audit.json
   ```
   or on a snippet: `node scripts/ultra11y.mjs audit - < page.html --json`.
   The `AuditResult` classes each success criterion as `C` / `NC` / `NA` (static) or
   `manual` (rendering / judgment, listed in `residualRisks`). It also records the repo's
   declared language(s) as `scope.langs` (the primary `<html lang>` subtags seen, most
   frequent first, e.g. `["fr"]`) — the repo signal `--lang auto` resolves from downstream.
3. **Triage the results:**
   - engine `NC` = confirmed candidates (each finding cites `file:line`);
   - `manual` *needs-rendering* criteria (contrast 1.4.3, focus visible 2.4.7, reflow
     1.4.10…) → route to `scan`, **never** silently `C`. Note: contrast on
     **inline literal colours** is now decided statically (1.4.3 turns `NC` for that
     subset); contrast via external CSS or variables stays residual (→ dynamic tier);
   - `manual` *judgment* criteria (alt relevance under 1.1.1, link purpose 2.4.4, reading
     / tab order…) → the AI agent adjudicates them from context via `verify --manual` (gated).
4. **Decide each applicable criterion**: `C`, `NC` or `NA` (with a justification). For a
   criterion's detail and grounding: `node scripts/ultra11y.mjs criteria 1.1.1`.
5. **Render the report:**
   ```
   node scripts/ultra11y.mjs report --in audit.json --out audits
   ```
   → `audits/wcag-YYYY-MM-DD.md` (5 sections, see `references/methodology.md`); section 2
   renders one **auditor conformance block** per NC criterion (theme, criterion + official
   wording, test(s), WCAG mapping + level, finding, expected state, verification,
   `file:line` occurrences), grouped by severity — the SAME block `prd` and `--gh-issues`
   emit (see `references/prd.md`), so report and backlog never drift. For a country
   standard, add `--standard rgaa` (see `references/standards.md`). Pass `--lang` to match
   your conversation; without it, `auto` resolves the audit's `scope.langs` → the
   standard's default locale → English. Add `--json` to `report` for a machine summary
   (`{path, conformancePct, date, standard}`) instead of just the path.
6. **Check integrity:**
   ```
   node scripts/ultra11y.mjs check --report audits/wcag-YYYY-MM-DD.md
   ```
   Fails if a section is missing, a cited criterion does not exist, or an `NA` is unjustified.
7. **High assurance (optional)**: `references/verify.md` — prove every non-conformity is
   real before you ship.

## Golden rules

- **Never invent a non-conformity**: every `NC` must cite a real, resolvable element
  (`check` verifies it).
- **Residual is explicit, never silently `C`**: an unproven *needs-rendering* criterion goes to
  `scan`; a *judgment* criterion the AI agent adjudicates via `verify --manual` (gated). Any
  criterion still undecided stays in the "to assess manually" section with a recorded reason.
- The report's **automatic static-check pass rate** covers only the machine-decidable
  subset; full WCAG conformance requires your manual review (it is not a conformance rate).
