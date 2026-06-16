#!/usr/bin/env node
// DEV-ONLY (not in `bin`). Fetch the official RGAA 4.1.2 dataset from DINUM/DISIC
// and transform it into the bundled, offline src/data/{rgaa,glossary}.json that
// the engine ships. Re-run on an RGAA bump. The RGAA content is Licence Ouverte /
// Etalab 2.0 — see NOTICE. Usage:
//   node scripts/fetch-rgaa.mjs            # fetch from GitHub
//   node scripts/fetch-rgaa.mjs --offline  # read the /tmp/rgaa-inspect cache
//   node scripts/fetch-rgaa.mjs --dump     # also print the 106-criteria index
import { writeFileSync, readFileSync, mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const DATA = join(root, "src", "data");
const CACHE = "/tmp/rgaa-inspect";
const BASE = "https://raw.githubusercontent.com/DISIC/accessibilite.numerique.gouv.fr/main/RGAA";
const offline = process.argv.includes("--offline");
const dump = process.argv.includes("--dump");

async function load(name) {
  if (!offline) {
    try {
      const r = await fetch(`${BASE}/${name}`);
      if (r.ok) return await r.json();
      console.error(`fetch-rgaa: ${name} HTTP ${r.status}, falling back to cache`);
    } catch (e) {
      console.error(`fetch-rgaa: fetch failed (${e.message}), falling back to cache`);
    }
  }
  return JSON.parse(readFileSync(join(CACHE, name), "utf8"));
}

// Slug used by the official site for glossary anchors: NFD-strip diacritics,
// lowercase, apostrophes -> space, any non-alphanumeric run -> single hyphen.
const slug = (s) =>
  s
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .toLowerCase()
    .replace(/['’]/g, " ")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

// [term](#anchor) -> term  (markdown link to glossary reduced to its label)
const plain = (s) => s.replace(/\[([^\]]+)\]\(#[^)]*\)/g, "$1");

const toArr = (v) => (Array.isArray(v) ? v.map(String) : v == null ? [] : [String(v)]);

// crude HTML -> plaintext for glossary bodies
const deHtml = (s) =>
  s
    .replace(/<\/(p|li|ul|ol|div|tr|h[1-6])>/gi, "\n")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&#39;|&rsquo;|&#8217;/g, "’")
    .replace(/&quot;/g, '"')
    .replace(/[ \t]+/g, " ")
    .replace(/\n{3,}/g, "\n\n")
    .trim();

// --- engine coverage: criterion id -> static rule ids (mirror of SKILL plan §rules).
// The M2 registry test cross-checks this against the live rule registry.
// NOTE: "pertinence" criteria (5.5 caption relevant, 8.4 lang code relevant,
// 8.6 title relevant, 11.2 label relevant, 6.1 link explicit) are JUDGMENT, not
// static — a parser can detect presence/structure, never relevance. They are
// deliberately left out of this map so the engine never claims to decide them.
const RULE_COVERAGE = {
  "1.1": ["img-alt-missing", "canvas-fallback-missing", "icon-only-control-unnamed"],
  "1.2": ["decorative-alt-misuse"],
  "2.1": ["iframe-title-missing"],
  "4.10": ["autoplay-media"], // sound triggered automatically must be controllable
  "5.4": ["table-caption-missing"],
  "5.6": ["data-table-no-headers"],
  "5.7": ["data-table-no-headers"],
  "6.2": ["link-empty-name", "icon-only-control-unnamed"], // link HAS a label (presence)
  "7.1": ["invalid-aria-role", "redundant-aria", "button-empty-name", "clickable-noninteractive", "aria-ref-missing-id", "icon-only-control-unnamed"],
  "7.3": ["clickable-noninteractive"], // keyboard operability of scripted widgets
  "8.2": ["duplicate-id"], // valid source (duplicate id = invalid)
  "8.3": ["html-lang-missing"], // default language present
  "8.5": ["title-missing-empty"], // page has a title
  "8.7": ["inline-lang-change-missing"], // language change indicated
  "9.1": ["heading-order-skip", "h1-missing", "h1-multiple"],
  "11.1": ["control-label-missing", "placeholder-as-label"], // field has a label
  "12.7": ["skip-link-target-missing"],
  "12.8": ["positive-tabindex"], // tab order coherence
  "13.8": ["autoplay-media"], // moving/blinking content controllable
};

// criteria that fundamentally need a rendered DOM (computed colours/layout/focus)
const NEEDS_RENDERING = new Set([
  "3.2", "3.3", // computed contrast
  "10.4", // text legible at 200% zoom
  "10.7", // visible focus indicator
  "10.11", // reflow without scroll at 320px/256px
  "10.12", // user-redefinable text spacing
  "10.13", // additional content on hover/focus controllable
  "10.14", // CSS-only additional content reachable by keyboard
]);

function automatabilityOf(id) {
  if (RULE_COVERAGE[id]) return "static";
  if (NEEDS_RENDERING.has(id)) return "needs-rendering";
  return "judgment";
}

async function main() {
  const criteres = await load("criteres.json");
  const glossaire = await load("glossaire.json");

  // glossary: slug -> { title, body(plaintext) }
  const glossary = {};
  for (const e of glossaire.glossary) glossary[slug(e.title)] = { title: e.title, body: deHtml(e.body) };
  const glossSlugs = new Set(Object.keys(glossary));

  const themes = [];
  const criteria = [];
  const anchorRefs = new Set();
  const collectAnchors = (s) => {
    const re = /\(#([a-z0-9-]+)\)/g;
    let m;
    while ((m = re.exec(s))) anchorRefs.add(m[1]);
  };

  for (const topic of criteres.topics) {
    let count = 0;
    for (const { criterium } of topic.criteria) {
      const id = `${topic.number}.${criterium.number}`;
      const wcag = [];
      const techniques = [];
      for (const ref of criterium.references || []) {
        if (Array.isArray(ref.wcag)) wcag.push(...ref.wcag);
        if (Array.isArray(ref.techniques)) techniques.push(...ref.techniques);
      }
      collectAnchors(criterium.title);
      for (const k of Object.keys(criterium.tests || {})) for (const line of criterium.tests[k]) collectAnchors(line);

      criteria.push({
        id,
        theme: topic.number,
        title: criterium.title,
        titlePlain: plain(criterium.title),
        tests: criterium.tests || {},
        wcag,
        techniques,
        ...(criterium.technicalNote ? { technicalNote: toArr(criterium.technicalNote) } : {}),
        ...(criterium.particularCases ? { particularCases: toArr(criterium.particularCases) } : {}),
        automatability: automatabilityOf(id),
        ruleIds: RULE_COVERAGE[id] || [],
      });
      count++;
    }
    themes.push({ number: topic.number, name: topic.topic, count });
  }

  const out = {
    rgaaVersion: "4.1.2",
    wcagVersion: String(criteres.wcag.version),
    source: "https://github.com/DISIC/accessibilite.numerique.gouv.fr",
    license: "Licence Ouverte / Etalab 2.0",
    themes,
    criteria,
  };

  mkdirSync(DATA, { recursive: true });
  writeFileSync(join(DATA, "rgaa.json"), JSON.stringify(out, null, 2) + "\n");
  writeFileSync(join(DATA, "glossary.json"), JSON.stringify(glossary, null, 2) + "\n");

  // --- report
  const unresolved = [...anchorRefs].filter((a) => !glossSlugs.has(a));
  const tally = { static: 0, "needs-rendering": 0, judgment: 0 };
  for (const c of criteria) tally[c.automatability]++;
  console.log(`fetch-rgaa: ${themes.length} themes, ${criteria.length} criteria written to src/data/rgaa.json`);
  console.log(`fetch-rgaa: glossary ${Object.keys(glossary).length} entries; anchors referenced ${anchorRefs.size}, unresolved ${unresolved.length}`);
  if (unresolved.length) console.log(`fetch-rgaa: UNRESOLVED ANCHORS: ${unresolved.join(", ")}`);
  console.log(`fetch-rgaa: automatability — static ${tally.static}, needs-rendering ${tally["needs-rendering"]}, judgment ${tally.judgment}`);
  const noRef = criteria.filter((c) => c.wcag.length + c.techniques.length === 0).map((c) => c.id);
  const noWcag = criteria.filter((c) => c.wcag.length === 0).map((c) => c.id);
  console.log(`fetch-rgaa: criteria with no reference at all: ${noRef.length ? noRef.join(", ") : "none"}`);
  console.log(`fetch-rgaa: criteria with no WCAG ref: ${noWcag.length ? noWcag.join(", ") : "none"} (${noWcag.length})`);
  const badIds = criteria.filter((c) => !/^\d+\.\d+$/.test(c.id)).map((c) => c.id);
  if (badIds.length) console.log(`fetch-rgaa: MALFORMED IDS: ${badIds.join(", ")}`);
  if (dump) {
    for (const c of criteria) console.log(`  ${c.id}\t[${c.automatability}]\t${c.titlePlain}`);
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
