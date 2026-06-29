# Audit the RENDERED HTML (component libraries: DSFR, MUI…)

Auditing a component library's **JSX sources** gives **false negatives**:
`<Button iconId="fr-icon-add-line" />` (DSFR) actually renders
`<button class="fr-btn fr-icon-add-line">` where the icon is a CSS pseudo-element
(decorative) and the **accessible name comes only from `title`**. That HTML lives in
`node_modules` at runtime — no source analysis sees it. So for those components, **audit
what the JS produces**, not the source.

## Honest by default

When `audit` sees a JSX/TSX file rendering components imported from a **library** (a package
specifier, e.g. `@codegouvfr/react-dsfr`), it does not invent a verdict: it adds a **scope
risk** to the report ("preliminary source verdict — audit the build or `scan`") and names the
library(ies). A source verdict is therefore never silently "complete".

## Get rendered HTML

`node scripts/ultra11y.mjs render [<dir>]` detects the framework and prints the
"build → audit" recipe for the project (and flags the libraries it detects). Three routes,
simplest to most faithful:

1. **Build output** (recommended): build the site/pages, then audit the emitted HTML with the
   static engine — it is real HTML, audited at full fidelity:
   ```
   npx astro build   # or next build (output:'export'), vite build, storybook build…
   node scripts/ultra11y.mjs audit "dist/**/*.html"
   ```
   For a design system, a **static Storybook build** is often simplest: each story becomes a
   rendered page to audit.
2. **SSR snapshot**: `render --scaffold` writes `ultra11y-render.tsx`, a `react-dom/server`
   harness (`renderToStaticMarkup`) that imports **your** components and writes HTML into
   `audits/rendered/`. Fill in the list, run it with your toolchain (`npx tsx
   ultra11y-render.tsx`), then audit `audits/rendered`. ultra11y does not embed React — your
   project renders.
3. **Headless browser**: `scan <url>` (Docker tier, axe-core) against the running app — the
   most faithful, and required for the **rendering** criteria (computed contrast 1.4.3, reflow
   1.4.10). `--merge` folds the result into a static AuditResult.

## Choosing

- Components / design system → static Storybook **or** SSR snapshot, then `audit`.
- Full pages / SSG → build output (`dist`/`out`), then `audit`.
- Rendering criteria (contrast, focus, zoom) → `scan` (browser).
- In all cases, do not conclude "conforming" on a library component from the source: that is
  what the scope risk reminds you.
