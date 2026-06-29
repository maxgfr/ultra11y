# Audit existing code → WCAG report

Goal: produce a dated, reliable WCAG 2.2 AA compliance report. The engine decides the
automatable subset; **you** complete the judgment and rendering criteria; the gates stop
any hallucinated non-conformity.

## The loop

1. **Scope it.** Which files / components? HTML, JSX/TSX and Vue/Svelte/Astro components
   (`.vue`/`.svelte`/`.astro`) are walked by default; add server templates (Twig, ERB,
   Handlebars…) with `--ext .twig,.erb`.
2. **Run the engine:**
   ```
   node scripts/ultra11y.mjs audit "src/**/*.html" --json > audit.json
   ```
   or on a snippet: `node scripts/ultra11y.mjs audit - < page.html --json`.
   The `AuditResult` classes each success criterion as `C` / `NC` / `NA` (static) or
   `manual` (rendering / judgment, listed in `residualRisks`).
3. **Triage the results:**
   - engine `NC` = confirmed candidates (each finding cites `file:line`);
   - `manual` *needs-rendering* criteria (contrast 1.4.3, focus visible 2.4.7, reflow
     1.4.10…) → mark "to verify manually", **never** silently `C`. Note: contrast on
     **inline literal colours** is now decided statically (1.4.3 turns `NC` for that
     subset); contrast via external CSS or variables stays residual (→ dynamic tier);
   - `manual` *judgment* criteria (alt relevance under 1.1.1, link purpose 2.4.4, reading
     / tab order…) → assess them with context.
4. **Decide each applicable criterion**: `C`, `NC` or `NA` (with a justification). For a
   criterion's detail and grounding: `node scripts/ultra11y.mjs criteria 1.1.1`.
5. **Render the report:**
   ```
   node scripts/ultra11y.mjs report --in audit.json --out audits
   ```
   → `audits/wcag-YYYY-MM-DD.md` (5 sections, see `references/methodology.md`). For a
   country standard, add `--standard rgaa` (see `references/standards.md`).
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
- **Residual is explicit**: any *needs-rendering* / *judgment* criterion not proven goes in
  the "to assess manually" section, never passed to `C`.
- The report's **automatic static-check pass rate** covers only the machine-decidable
  subset; full WCAG conformance requires your manual review (it is not a conformance rate).
