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

**`.vue`/`.svelte`/`.astro` single-file components are the same case.** They are parsed as
SOURCE templates (the HTML path with component case preserved), so `<slot>`/`{@render}`,
`v-for`/`{#each}`, dynamic bindings (`:aria-label`) and child components are invisible to
static analysis. Every finding raised on them is flagged **`preliminary: true`** and the run
adds a **`scope.sourceTemplate`** caveat ("audited SOURCE template only — audit the rendered
output"). Treat those verdicts as provisional: audit the rendered HTML (a static Storybook
build is ideal for SFCs) or `scan` a live page before concluding, and refute any source
finding the rendered DOM disproves (`verify --apply`). See `references/false-positives.md`.

## Zero-touch test-render captures (recommended)

Rather than hand-write a render list, let your existing tests do the rendering. Install the
capture harvester once and every component your tests already render is serialized to a
provenance-tagged `.html` the static engine audits at full fidelity — the real markup a
library/SFC emits, not its source call:

```
node scripts/ultra11y.mjs render --setup     # writes .ultra11y/capture-setup.mjs + prints the runner wiring
# wire it into your runner (Vitest: setupFiles + globals:true; Jest: setupFilesAfterEnv), then:
npm test                                      # every rendered component → .ultra11y/captures/*.html
node scripts/ultra11y.mjs audit              # auto-ingests .ultra11y/captures; findings attribute to the source component
```

- **Attribution.** Each capture carries `<!-- ultra11y:capture source="src/Button.tsx" component="Button" … -->`,
  so a finding on the rendered DOM is reported against the SOURCE component, not the anonymous
  capture file. Storybook/manual dumps with no marker still audit as plain HTML.
- **Coverage + gate.** `render --coverage` lists which components have a capture vs which are
  still opaque-source-only blind spots; `audit --require-captures` fails when an opaque/control
  component lacks one — so "all components" actually get rendered-DOM coverage.
- **Commit `.ultra11y/captures`** and stage it with the source change so `audit --staged` (the
  pre-commit gate) verifies the real markup. `fix` never rewrites captures (generated output).
  Add `.gitattributes`: `.ultra11y/captures/*.html text eol=lf` for stable cross-platform diffs.
- ultra11y renders nothing itself — your test toolchain (jsdom/happy-dom) does. Disable with `ULTRA11Y_CAPTURES=off`.

## Get rendered HTML

`node scripts/ultra11y.mjs render [<dir>]` detects the framework and prints the
"build → audit" recipe for the project (and flags the libraries it detects). Other routes,
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

- Components WITH a test suite → zero-touch captures (`render --setup`), then `audit --require-captures`.
- Components / design system (no tests) → static Storybook **or** SSR snapshot, then `audit`.
- Full pages / SSG → build output (`dist`/`out`), then `audit`.
- Rendering criteria (contrast, focus, zoom) → `scan` (browser).
- In all cases, do not conclude "conforming" on a library component from the source: that is
  what the scope risk reminds you.
