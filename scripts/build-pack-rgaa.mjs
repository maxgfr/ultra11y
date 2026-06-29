#!/usr/bin/env node
// DEV-ONLY (not in `bin`). Builds the RGAA 4.1.2 STANDARDS PACK that ships at
// src/data/standards/rgaa.json (+ rgaa.glossary.json). RGAA is the first of many
// pluggable, in-repo country packs (see CONTRIBUTING.md): a pack does NOT carry the
// engine's rules or automatability — it is a localized criterion set that maps each
// of its criteria onto WCAG success criteria (bare SC ids). The WCAG↔rule coverage
// lives in the core (scripts/build-standards.mjs). The RGAA content is Licence
// Ouverte / Etalab 2.0 — see NOTICE. The official source is vendored under
// scripts/vendor/rgaa/ so the build is reproducible offline.
//   node scripts/build-pack-rgaa.mjs            # build from the vendored source
//   node scripts/build-pack-rgaa.mjs --offline  # alias (the source is always local)
//   node scripts/build-pack-rgaa.mjs --fetch     # refresh the vendored source from DINUM, then build
import { writeFileSync, readFileSync, mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const OUT = join(root, "src", "data", "standards");
const VENDOR = join(root, "scripts", "vendor", "rgaa");
const BASE = "https://raw.githubusercontent.com/DISIC/accessibilite.numerique.gouv.fr/main/RGAA";
const doFetch = process.argv.includes("--fetch");

async function source(name) {
  if (doFetch) {
    const r = await fetch(`${BASE}/${name}`);
    if (!r.ok) throw new Error(`build-pack-rgaa: ${name} HTTP ${r.status}`);
    const text = await r.text();
    mkdirSync(VENDOR, { recursive: true });
    writeFileSync(join(VENDOR, name), text);
    return JSON.parse(text);
  }
  return JSON.parse(readFileSync(join(VENDOR, name), "utf8"));
}

// Slug used by the official site for glossary anchors.
const slug = (s) =>
  s
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .toLowerCase()
    .replace(/['’]/g, " ")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

// [term](#anchor) -> term
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

// "1.1.1 Non-text Content (A)" -> "1.1.1"  (bare WCAG SC id; the WCAG core owns titles/levels)
const bareSc = (w) => String(w).trim().split(/\s+/)[0];

async function main() {
  const criteres = await source("criteres.json");
  const glossaire = await source("glossaire.json");

  const glossary = {};
  for (const e of glossaire.glossary) glossary[slug(e.title)] = { title: e.title, body: deHtml(e.body) };

  const themes = [];
  const criteria = [];
  for (const topic of criteres.topics) {
    let count = 0;
    for (const { criterium } of topic.criteria) {
      const id = `${topic.number}.${criterium.number}`;
      const wcag = new Set();
      const techniques = new Set();
      for (const ref of criterium.references || []) {
        for (const w of ref.wcag || []) wcag.add(bareSc(w));
        for (const t of ref.techniques || []) techniques.add(String(t));
      }
      criteria.push({
        id,
        theme: topic.number,
        title: { fr: criterium.title },
        titlePlain: { fr: plain(criterium.title) },
        tests: criterium.tests || {},
        techniques: [...techniques],
        ...(criterium.technicalNote ? { technicalNote: toArr(criterium.technicalNote) } : {}),
        ...(criterium.particularCases ? { particularCases: toArr(criterium.particularCases) } : {}),
        wcag: [...wcag],
      });
      count++;
    }
    themes.push({ number: topic.number, name: { fr: topic.topic }, count });
  }

  const pack = {
    key: "rgaa",
    name: "RGAA",
    fullName: "Référentiel général d’amélioration de l’accessibilité",
    org: "DINUM",
    country: "FR",
    baseVersion: "4.1.2",
    wcagVersion: String(criteres.wcag.version),
    locales: ["fr"],
    defaultLocale: "fr",
    license: "Licence Ouverte / Etalab 2.0",
    source: "https://github.com/DISIC/accessibilite.numerique.gouv.fr",
    attribution: "RGAA 4.1.2 © DINUM (Direction interministérielle du numérique) — Licence Ouverte / Etalab 2.0",
    idPattern: "^\\d+\\.\\d+$",
    themes,
    criteria,
  };

  mkdirSync(OUT, { recursive: true });
  writeFileSync(join(OUT, "rgaa.json"), JSON.stringify(pack, null, 2) + "\n");
  writeFileSync(join(OUT, "rgaa.glossary.json"), JSON.stringify(glossary, null, 2) + "\n");

  const noWcag = criteria.filter((c) => c.wcag.length === 0).map((c) => c.id);
  console.log(`build-pack-rgaa: ${themes.length} themes, ${criteria.length} criteria → src/data/standards/rgaa.json`);
  console.log(`build-pack-rgaa: glossary ${Object.keys(glossary).length} entries → src/data/standards/rgaa.glossary.json`);
  console.log(`build-pack-rgaa: criteria with no WCAG mapping (pack-local): ${noWcag.length ? noWcag.join(", ") : "none"} (${noWcag.length})`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
