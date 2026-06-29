# Dynamic tier (Docker + axe-core) — optional

The static engine leaves some criteria "to assess" because they need a **render**: computed
contrast (1.4.3), focus visible (2.4.7), reflow/zoom (1.4.4/1.4.10). The dynamic tier decides
them by running **axe-core in a real headless browser** (Playwright), packaged in a Docker image
auto-built on first use — the skill stays a single bundle (runner + Dockerfile embedded).

## Prerequisites

Docker must be running. Without Docker, `scan` fails with an explicit message; the rest of the
skill (static audit) works without Docker.

## Usage

```
# dynamic audit alone (URL or HTML file)
node scripts/ultra11y.mjs scan https://example.com --json

# merge with a static audit: the "to assess" criteria turn C/NC
node scripts/ultra11y.mjs audit "src/**/*.html" --out audits --json > /dev/null
node scripts/ultra11y.mjs scan https://example.com --merge audits/audit-latest.json --out audits
node scripts/ultra11y.mjs report --in audits/audit-latest.json --out audits
```

The first run builds the image (`node:22` + Playwright/Chromium + axe-core) — a few minutes;
later runs are immediate.

### Cover many pages (crawl)

`scan` can sweep a whole rendered site, not a single URL:

```
# every URL listed in a sitemap.xml
node scripts/ultra11y.mjs scan --sitemap https://example.com/sitemap.xml --json

# BFS of served same-origin links, from an entry page
node scripts/ultra11y.mjs scan --crawl https://example.com --depth 2 --max 50 --json
```

Each finding keeps the **page** it came from (`--merge` reports that URL as `file`). `--crawl`
follows links in the **served HTML** (SSR/MPA); for a pure SPA (client-rendered routes), use
`--sitemap`. One page = one container (a browser per page): `--max` bounds the page count.

## What the dynamic tier adds

- **Real contrast (1.4.3)** — axe computes the rendered colours (the main win).
- **Reflow (1.4.10)** — checks there is no horizontal scroll at 320px wide.
- **Cross-check** — axe re-validates the structural criteria (alt, labels, ARIA, headings…) at
  render; a render finding is **authoritative** and turns the criterion NC.

axe findings map to WCAG success criteria via a curated table (`axe-rule → SC`), completed by
axe's **native WCAG tags** (`wcag<abc>`) for rules outside the table — instead of a generic
fallback. On merge (`--merge`), a `manual` criterion the tier decides leaves the residual risks
and becomes `C`/`NC`.

## Limits

axe does not cover all of "render": **focus visibility** (2.4.7), 200% text zoom (1.4.4 beyond
the viewport block) and some content-on-hover stay manual (always flagged as residual risk).
pa11y can be added as a second source if needed.
