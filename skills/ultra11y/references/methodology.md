# Methodology & report format

## Per-criterion statuses

- **C** — conforming (every applicable test passes).
- **NC** — non-conforming (at least one test fails; a finding cites `file:line`).
- **NA** — not applicable (no element in scope is concerned — justified).
- **To assess (manual)** — a criterion the engine cannot decide on its own (rendering or
  judgment); to be completed by a human review.

## Pass rate

Conformance rate = **conforming criteria ÷ applicable criteria × 100**.

The engine only computes the **automatic static-check pass rate**, over the small
machine-decidable subset it can actually decide: `C ÷ (C + NC)`. Because WCAG success
criteria are coarser than the engine's rules, that denominator is deliberately small —
it is **not** a full conformance rate. Full WCAG 2.2 AA conformance requires completing
the "to assess" criteria by hand.

## Non-conformity priorities

- 🔴 **Blocking** — prevents access to content/function (e.g. missing alt, unlabeled
  field, empty link).
- 🟠 **Major** — high impact but workaroundable (heading order, contrast, invisible focus).
- 🟡 **Minor** — light friction (missing caption, redundant ARIA).

## The division of labour (static / rendering / judgment)

ultra11y is honest about what a static analyzer can decide:

- **Automatable (static)** — decided by the engine: missing alt/lang/title, unlabeled
  fields, `iframe` without a title, empty links/buttons, tables without headers, heading
  skips, duplicate `id`s, invalid/broken ARIA, positive `tabindex`, autoplay…
- **Needs rendering** — computed contrast (1.4.3), focus visible (2.4.7), zoom/reflow
  (1.4.4/1.4.10), content on hover/focus (1.4.13). **Out of the engine**: verify in a
  browser, flagged as residual risk.
- **Human judgment** — alt relevance (1.1.1), link purpose in context (2.4.4), reading/tab
  order, navigation consistency, caption accuracy…

See the full table of the 55 WCAG 2.2 AA success criteria in `references/criteria.md`.

## Report format (`report`)

`audits/wcag-YYYY-MM-DD.md` has 5 sections: (1) synthesis by WCAG guideline
(C/NC/NA/to assess), (2) non-conformities by priority, (3) conforming criteria,
(4) justified not-applicable criteria, (5) criteria to assess manually.

## Worldwide: WCAG core, country standards as packs

WCAG 2.2 Level AA is the engine's canonical key — the worldwide standard. A country
standard (France's RGAA, the US Section 508, the EU's EN 301 549) is a pluggable in-repo
**pack** that maps its criteria onto WCAG success criteria; `report --standard rgaa` (and
`criteria`/`check`/`verify`/`prd --standard <pack>`) re-key the deliverable for that
standard (`rgaa-YYYY-MM-DD.md`). The WCAG report is the canonical, gated one; a pack report
is a derived view. See `references/standards.md`.

**International equivalence (version-accurate)**: Section 508 incorporates WCAG 2.0 AA;
EN 301 549 v3.2.1 references WCAG 2.1 and v4 references WCAG 2.2; AODA references WCAG 2.0
AA. A WCAG 2.2 AA audit therefore covers these standards' web requirements at their
respective WCAG versions.
