# Cross-file analysis (`audit --graph`)

By default the engine audits **each file in isolation**. `--graph` (alias `--cross-file`)
adds a pass that **resolves imports between files**, builds a dependency + component graph,
and applies rules only the cross-file context makes visible — **without a browser** (no
Playwright). It complements the per-file static engine and the optional dynamic tier
(`scan`): all three feed the **same** `AuditResult`.

```
node scripts/ultra11y.mjs audit "src/**/*.tsx" --graph --json > audit.json
node scripts/ultra11y.mjs audit --changed --graph     # git diff, graph over the whole scope
```

## How it works (and why it scales)

- **Real AST**: `.jsx/.tsx` are parsed by a real JS/TS/JSX parser (`@babel/parser`, embedded
  in the bundle — still "no install"), not regex normalization. `PascalCase` components keep
  their case (per-file rules ignore them; only cross-file rules resolve them); native
  elements stay lowercase.
- **Two passes, bounded memory**: pass 1 — read each file, extract a small *graph node*
  (imports, components + render-control signals, ids, `<html lang>`), then **drop** the
  AST/Doc. Pass 2 — the usual audit loop, which also runs the cross-file rules with the graph
  in hand. The whole repo is never held in memory: O(number of files) small nodes.
- **`--changed --graph`**: the graph indexes the **whole** scope (to resolve a reference into
  an unchanged definition), but only the diffed files are audited.

## The cross-file rules

- **`cross-icon-only-unnamed`** (WCAG 2.4.4/4.1.2, *flag*): a component that renders an
  **icon-only** control and *can* receive a name (`{...props}` / `aria-label={…}` /
  `{children}`) is used **without a name**. The flag is placed **at the usage site**, with the
  component **definition** in `related`.
- **`cross-aria-forwarding`** (WCAG 4.1.2, *suppression*): a native control that forwards
  `{...props}` is nameable by its parent → it **suppresses** the false
  `button-empty-name`/`icon-only-control-unnamed` on the **definition**.
- **`cross-skip-link-target`** (WCAG 2.4.1, *suppression*): an `href="#id"` anchor whose
  target lives in **another** file (imported layout/component) → suppresses the false "broken
  anchor". A target missing everywhere stays a true positive.
- **`cross-page-lang`** (WCAG 3.1.1, *suppression*): an `<html>` without `lang` whose imported
  layout/wrapper declares the language → suppresses the false positive.

## Benefit for `fix`

Because the AST indexes the **real file** (exact offsets, non-*lossy* `Doc`), `fix` can apply
its *safe* codemods on JSX/TSX (remove redundant ARIA, insert `alt`/`lang`/`title`/
`aria-label`), always behind the anti-regression gate. Codemods that **rewrite** an attribute
name stay disabled on JSX (so `tabIndex={5}` is never turned into `tabindex="0"`).

> Cross-file flags merge into the same `AuditResult`: `report`, `prd`, `check` and `verify`
> consume them unchanged.
