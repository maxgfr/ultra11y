# Judgment phase (the criteria the engine does not decide)

The engine decides the machine-checkable subset; **you** decide the rest: the **judgment**
criteria (alt relevance, link purpose in context, reading order) and the **rendering**
criteria (computed contrast, focus, zoom/reflow), plus the adversarial verification of the
detected non-conformities. This phase makes each verdict defensible, never invented.

## Judgment loop

1. **List the work**: `node scripts/ultra11y.mjs verify --report audits/wcag-YYYY-MM-DD.md`
   writes `VERIFY.md` (checklist) + `VERIFY.todo.json`. Each entry carries the **WCAG success
   criterion's W3C Understanding reference** + techniques, so you judge against the real
   conditions, not by guessing.
2. **Rule** on each entry, opening the file at the cited line, filling `verdict` in
   `VERIFY.todo.json`:
   - `supported` — the non-conformity is real and correctly tied;
   - `partial` — real but the criterion/wording is imprecise;
   - `refuted` — false (the cited element is actually conforming);
   - `unsupported` — the cited element is not enough to decide.
3. **"To assess" criteria** (rendering / judgment) from the report: get a criterion's detail
   off the worklist with `node scripts/ultra11y.mjs criteria 1.4.3` (level, techniques,
   Understanding URL), then rule — or leave an explicit residual risk. Never mark "conforming"
   without proof.
4. **Rendering required**: for computed contrast, visible focus, 200% zoom, 320px reflow —
   verify on the **render** (the `scan` tier, or inspection), not the source.
5. **Library code (DSFR…)**: a `<Button>`/`<Card>` does not show its HTML in source. Judge on
   the **produced** HTML (see `render` / audit the build), otherwise the verdict is a false
   negative.
6. **Close**: the `VERIFY.md` checklist must be fully ticked, then
   `node scripts/ultra11y.mjs verify --apply VERIFY.todo.json` is green again (fails on any
   `refuted`/`unsupported`/missing verdict). `--semantic` folds the support-check into the
   same pass.

> For a country standard's own test grid, `criteria --standard rgaa <id>` shows the RGAA
> tests behind a WCAG SC. The pre-completion checklist stops you concluding too early.
