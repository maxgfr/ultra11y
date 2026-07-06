# Pluggable standards packs — runtime loading + AI ingestion, gated

WCAG 2.2 AA is the engine's canonical key. A **standards pack** is a localized criterion
set (RGAA, Section 508, EN 301 549…) that maps each of its criteria onto WCAG success
criteria. RGAA ships built-in; you can add more **without rebuilding** the engine.

## Load an external pack at runtime

A pack is plain JSON conforming to `StandardPack` (see `references/standards.md` and
`CONTRIBUTING.md`). Point the CLI at one — no install, no rebuild:

```
node scripts/ultra11y.mjs audit "src/**/*.tsx" --graph --pack ./packs/section508.json
node scripts/ultra11y.mjs report --in audit.json --standard section508 --pack ./packs/section508.json
```

`--pack` accepts a JSON file, a directory holding `pack.json` (+ optional `glossary.json`
/ `guidance.json`), or a comma-separated list. Or declare it once in a `.ultra11yrc.json`
at the project root:

```json
{ "packs": ["./packs/section508.json"], "guidance": ["./packs/section508.guidance.json"], "standard": "section508" }
```

Every pack is validated **before** it is registered. An invalid pack is a hard error
(never a silent skip): the runtime loader, the `pack check` command, and the AI-ingestion
gate all share the one validator, so the rules below hold everywhere. A runtime pack whose
`key` collides with a **built-in or already-loaded** standard (e.g. `rgaa`) is rejected —
pass `--override` to deliberately replace it.

## `pack check` — the anti-hallucination gate

```
node scripts/ultra11y.mjs pack check ./packs/rgaa.json
node scripts/ultra11y.mjs pack check ./packs/rgaa.json --guidance ./packs/rgaa.guidance.json
node scripts/ultra11y.mjs pack scaffold > ./packs/mypack.json     # a blank, valid skeleton to fill
```

`pack check` fails (exit 1) on any error: a missing required field, a `key` that collides
with the reserved core `wcag`, an `idPattern` that won't compile, a theme `count` that
disagrees with its criteria, a criterion whose `wcag` SC is **not a recognized WCAG
success criterion**, and — with `--guidance` — a guidance entry whose `criterionId`
doesn't resolve to a real pack criterion, or whose code example won't parse. This is what
makes an AI-authored pack trustworthy: the model proposes, the deterministic gate refuses
fabrication.

**SC classification runs against the full WCAG 2.x universe** — every real 2.x success
criterion at every level (A/AA/AAA) plus the removed ones, vendored from the same W3C
source as the AA core (never invented, no id ever special-cased):

- **core** (in the WCAG 2.2 AA core) — the normal case; the engine can audit it.
- **out-of-core** (a real SC outside the AA core, e.g. an AAA criterion) or **removed**
  (the obsolete `4.1.1 Parsing`) — accepted with a *warning*. At report/derive time a pack
  criterion whose mapping is ENTIRELY out-of-core/removed is classed **out of engine
  scope**: status `manual` with a dedicated out-of-scope justification (`outOfScope: true`
  from `derivePackResults`), never a silent NA and never a fabricated verdict. RGAA 8.1
  (doctype → the removed 4.1.1) is the shipped example.
- **unknown** (a well-formed id that never existed — `9.9.9`) — **rejected** (error).

**Pack locales are free-form.** `LocaleString` keys are BCP-47-ish tags (`fr`, `en`,
`pt-BR`, `nl-BE`…) validated by shape only — a pack may be authored in any language,
independent of the CLI's own `--lang fr|en` UI frame. The pack's `defaultLocale` also
feeds the CLI's `--lang auto` fallback chain (used when it is `fr`/`en` and neither an
explicit `--lang` nor a repo `<html lang>` signal decided the output language).

## AI-assisted ingestion of any rule source (the primary path)

To turn an external rule source — the RGAA SocialGouv/etalab rule packs, or any other
national standard — into something ultra11y can use, drive this loop:

1. **Read** the source (its criteria list, and its concrete good/bad implementation
   rules). The fuzzy mapping `rule → criterion → WCAG SC` is yours to do — the model is
   far better at it than a regex.
2. **Draft** three artifacts: the `StandardPack` JSON (if the standard isn't already
   built-in), a guidance dataset (`references/guidance.md`), and a list of *proposed*
   new detectors (only the machine-checkable ones — see the honesty rule in
   `references/guidance.md`).
3. **Gate**: run `pack check <pack.json> --guidance <guidance.json>`. Fix every error.
   A bogus criterion id misses; a bogus SC is rejected; an unparseable example fails.
4. **Iterate** until green, then load it with `--pack` / `.ultra11yrc.json`.

An optional deterministic scaffolder, `scripts/import-pack.mjs`, pre-fills a *draft*
guidance dataset from a SocialGouv-style rules directory (frontmatter + before/after code
blocks + reference link), leaving any unresolved `criterionId` as `null` for you to
complete; it never finalizes — `pack check` is always the gate. See the script header for
usage.

## Gate-compatibility note (id grammar)

`check` and `verify` recognize a pack's criterion ids in a rendered report by building
their citation regex FROM the pack's own `idPattern` (already validated compilable by
`pack check`) — not a single fixed shape. RGAA's 2-segment `<n>.<n>` (`8.3`) and a
hypothetical Section 508 `E<n>.<n>` (`E205.4`) are both fully gate-compatible out of the
box; any `idPattern` a pack declares works, with zero engine changes.
