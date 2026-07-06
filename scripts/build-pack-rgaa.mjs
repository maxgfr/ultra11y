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
//   node scripts/build-pack-rgaa.mjs --check     # rebuild in memory and byte-compare vs the committed
//                                                 # pack; no writes; exit 1 on drift (CI gate)
import { writeFileSync, readFileSync, mkdirSync, existsSync } from "node:fs";
import { execFileSync } from "node:child_process";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const OUT = join(root, "src", "data", "standards");
const VENDOR = join(root, "scripts", "vendor", "rgaa");
const BIOME = join(root, "node_modules", ".bin", "biome");
const BASE = "https://raw.githubusercontent.com/DISIC/accessibilite.numerique.gouv.fr/main/RGAA";
const doFetch = process.argv.includes("--fetch");
const doCheck = process.argv.includes("--check");

// The committed pack JSON is biome-formatted (short arrays collapse onto one line —
// see biome.json's default `--expand=auto`), not raw `JSON.stringify` output. Route
// both the write path and the --check comparison through biome so the two can never
// disagree over whitespace alone; `relPath` (project-relative, e.g.
// "src/data/standards/rgaa.json") only picks the JSON formatter, no file is touched.
function biomeFormat(text, relPath) {
  return execFileSync(BIOME, ["format", `--stdin-file-path=${relPath}`], { input: text, encoding: "utf8" });
}

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
    // Auditor-display vocabulary (FR): the nouns an RGAA auditor reads. Rendered by the
    // `prd` auditor block + GitHub issues; see src/standards/vocabulary.ts.
    vocabulary: {
      theme: { fr: "Thématique" },
      criterion: { fr: "Critère" },
      test: { fr: "Test" },
      conformant: { fr: "Conforme (C)" },
      nonConformant: { fr: "Non conforme (NC)" },
      notApplicable: { fr: "Non applicable (NA)" },
      auditorHeading: { fr: "Critère d’accessibilité" },
    },
    themes,
    criteria,
  };

  const packText = biomeFormat(JSON.stringify(pack, null, 2) + "\n", "src/data/standards/rgaa.json");
  const glossaryText = biomeFormat(JSON.stringify(glossary, null, 2) + "\n", "src/data/standards/rgaa.glossary.json");

  if (doCheck) {
    const packPath = join(OUT, "rgaa.json");
    const glossaryPath = join(OUT, "rgaa.glossary.json");
    const drift = [];
    if (!existsSync(packPath) || readFileSync(packPath, "utf8") !== packText) drift.push("src/data/standards/rgaa.json");
    if (!existsSync(glossaryPath) || readFileSync(glossaryPath, "utf8") !== glossaryText)
      drift.push("src/data/standards/rgaa.glossary.json");
    if (drift.length > 0) {
      console.error(`build-pack-rgaa --check: OUT OF DATE vs vendored source — re-run \`pnpm run build:pack:rgaa\`: ${drift.join(", ")}`);
      process.exit(1);
    }
    console.log("build-pack-rgaa --check: src/data/standards/rgaa.json and rgaa.glossary.json match the vendored source.");
    return;
  }

  mkdirSync(OUT, { recursive: true });
  writeFileSync(join(OUT, "rgaa.json"), packText);
  writeFileSync(join(OUT, "rgaa.glossary.json"), glossaryText);

  const noWcag = criteria.filter((c) => c.wcag.length === 0).map((c) => c.id);
  console.log(`build-pack-rgaa: ${themes.length} themes, ${criteria.length} criteria → src/data/standards/rgaa.json`);
  console.log(`build-pack-rgaa: glossary ${Object.keys(glossary).length} entries → src/data/standards/rgaa.glossary.json`);
  console.log(`build-pack-rgaa: criteria with no WCAG mapping (pack-local): ${noWcag.length ? noWcag.join(", ") : "none"} (${noWcag.length})`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
