# Standards packs — WCAG core + pluggable country standards

ultra11y's engine is keyed on **WCAG 2.2 Level AA** — the worldwide standard. Country
accessibility standards ship as **standards packs**: small in-repo JSON files that map a
national standard's criteria onto WCAG success criteria. The WCAG verdict is canonical and
gated; a pack report is a *derived view* projected from the same audit.

## Model

- **Core = WCAG 2.2 AA.** 55 success criteria (Level A + AA), the engine's canonical key.
  SC ids/titles/levels are derived from the W3C source (https://github.com/w3c/wcag).
- **Packs = country standards.** Each pack (`src/data/standards/<key>.json`) declares its
  own localized criteria and, per criterion, the WCAG SC ids it maps to. The engine audits
  WCAG; `derivePackResults` projects that onto the pack's criteria with the same
  NC-dominates rule. A pack carries **no** engine rules or automatability — only the mapping.

## Using a pack

`--standard <pack>` re-keys the output of `report`, `prd`, `criteria`, `check` and `verify`.
The default is the WCAG core.

```
node scripts/ultra11y.mjs report   --in audits/audit-latest.json --standard rgaa   # → audits/rgaa-YYYY-MM-DD.md
node scripts/ultra11y.mjs criteria --standard rgaa --theme 1                       # a pack theme
node scripts/ultra11y.mjs criteria --standard rgaa 8.3                             # one pack criterion (shows its WCAG SCs)
node scripts/ultra11y.mjs check    --report audits/rgaa-YYYY-MM-DD.md --standard rgaa
```

An unknown `--standard` value errors out (never a silent fallback to WCAG).

## Shipped packs

- **RGAA 4.1.2** (`--standard rgaa`) — France, © DINUM, Licence Ouverte / Etalab 2.0.
  13 themes, 106 criteria, French. The flagship example pack.

## International equivalence (version-accurate)

Several standards incorporate WCAG by reference, but **not all at the same version** — state
the right one rather than blanket-claiming 2.2:

- **Section 508** (US, revised 2018) incorporates **WCAG 2.0 Level AA** for web content.
- **EN 301 549** (EU): v3.2.1 references **WCAG 2.1**; v4 (2024+) references **WCAG 2.2**.
- **AODA** (Ontario, Canada) references **WCAG 2.0 AA**.

A WCAG 2.2 AA audit therefore covers the web requirements of these standards at their
respective WCAG versions; a country pack adds that standard's own numbering and wording.

## Adding your country

Two ways, depending on whether you want it shipped or just plugged locally:

- **Built-in (shipped):** drop a pack JSON under `src/data/standards/`, register it in
  `src/standards/registry.ts`, add a test, and open a PR. The full authoring contract
  (pack schema, locale rules, licence requirements, the WCAG-SC mapping, tests) is in
  **`../../CONTRIBUTING.md`**.
- **Runtime (no rebuild):** author the pack JSON, gate it with `pack check`, and load it
  with `--pack ./pack.json` (or a `.ultra11yrc.json`). An external standard or rule source
  can be **AI-ingested** into a pack + implementation guidance and validated by the same
  gate — see **`packs.md`** and **`guidance.md`**.
