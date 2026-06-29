// `criteria` — offline reference lookup. The CORE reference is WCAG 2.2 AA: one
// success criterion (`criteria 1.4.3`), or the full list grouped by guideline
// (`criteria --list`). A country pack adds `--standard <pack>`: one pack criterion
// (`criteria --standard rgaa 8.3`), a pack theme (`--theme N`), or the theme list.
// Also generates references/criteria.md (never hand-edited).
import type { Lang, Sc } from "./types.js";
import { allSC, allGuidelines, allPrinciples, getSC, scsByGuideline, principleTitle, guidelineTitle, meta } from "./wcag.js";
import {
  type StandardId,
  isCore,
  loadPack,
  packsForSc,
  getCriterion as getPackCriterion,
  listTheme as listPackTheme,
  titlePlain as packTitlePlain,
  themeName,
  type StandardPack,
  type PackCriterion,
} from "./standards/index.js";

const AUTO_LABEL: Record<string, { fr: string; en: string }> = {
  static: { fr: "automatisable (moteur)", en: "automatable (engine)" },
  "needs-rendering": { fr: "nécessite un rendu", en: "needs rendering" },
  judgment: { fr: "jugement humain", en: "human judgment" },
};

// ---- WCAG core formatting -------------------------------------------------

export function formatSC(c: Sc, lang: Lang = "en"): string {
  const out: string[] = [];
  out.push(`${c.sc} — ${c.title} (${c.level}, ${lang === "fr" ? "ajouté en" : "added in"} WCAG ${c.addedIn})`);
  const auto = AUTO_LABEL[c.automatability]![lang];
  const gl = guidelineTitle(c.guideline) ?? "";
  const pr = principleTitle(c.principle) ?? "";
  out.push(
    `${lang === "fr" ? "Règle" : "Guideline"} ${c.guideline} (${gl}) · ${lang === "fr" ? "principe" : "principle"} ${c.principle} (${pr}) · ${lang === "fr" ? "automatisabilité" : "automatability"} : ${auto}${c.ruleIds.length ? ` · ${lang === "fr" ? "règles" : "rules"} : ${c.ruleIds.join(", ")}` : ""}`,
  );
  out.push(`${lang === "fr" ? "Comprendre" : "Understanding"} : ${c.understanding}`);
  if (c.techniques?.length) out.push(`Techniques : ${c.techniques.join(", ")}`);
  const packs = packsForSc(c.sc);
  if (packs.length)
    out.push(`${lang === "fr" ? "Référencé par" : "Mapped by"} : ${packs.map((p) => `${p.key.toUpperCase()} ${p.ids.join(", ")}`).join(" · ")}`);
  return out.join("\n");
}

function wcagList(lang: Lang): string {
  const m = meta();
  const out: string[] = [];
  out.push(
    lang === "fr"
      ? `WCAG ${m.wcagVersion} niveau ${m.level} — ${allPrinciples().length} principes, ${allGuidelines().length} règles, ${allSC().length} critères de succès`
      : `WCAG ${m.wcagVersion} Level ${m.level} — ${allPrinciples().length} principles, ${allGuidelines().length} guidelines, ${allSC().length} success criteria`,
  );
  const byG = scsByGuideline();
  for (const g of allGuidelines()) {
    out.push(`${g.number} ${g.title}`);
    for (const c of byG.get(g.number) ?? []) out.push(`  ${c.sc.padEnd(8)} [${c.level.padEnd(2)}] ${c.title}  [${c.automatability}]`);
  }
  return out.join("\n");
}

// ---- pack formatting ------------------------------------------------------

export function formatPackCriterion(pack: StandardPack, c: PackCriterion, lang: Lang = "en"): string {
  const out: string[] = [];
  out.push(`${pack.name} ${c.id} — ${packTitlePlain(pack, c, lang)}`);
  out.push(`${lang === "fr" ? "Thématique" : "Theme"} ${c.theme} (${themeName(pack, c.theme, lang) ?? ""}) · WCAG : ${c.wcag.join(", ") || "—"}`);
  if (c.techniques?.length) out.push(`Techniques : ${c.techniques.join(", ")}`);
  const testKeys = Object.keys(c.tests ?? {});
  if (testKeys.length) {
    out.push(`${lang === "fr" ? "Tests" : "Tests"} :`);
    for (const k of testKeys) for (const line of c.tests![k]!) out.push(`  ${c.id}.${k} ${line.replace(/\[([^\]]+)\]\(#[^)]*\)/g, "$1")}`);
  }
  if (c.technicalNote?.length) out.push(`${lang === "fr" ? "Note technique" : "Technical note"} : ${c.technicalNote.join(" ")}`);
  if (c.particularCases?.length) out.push(`${lang === "fr" ? "Cas particuliers" : "Particular cases"} : ${c.particularCases.join(" ")}`);
  return out.join("\n");
}

function packThemeList(pack: StandardPack, lang: Lang): string {
  const out: string[] = [];
  out.push(
    `${pack.name} ${pack.baseVersion} — ${pack.themes.length} ${lang === "fr" ? "thématiques" : "themes"}, ${pack.criteria.length} ${lang === "fr" ? "critères" : "criteria"}`,
  );
  for (const t of pack.themes) {
    out.push(
      `${String(t.number).padStart(2)}. ${(themeName(pack, t.number, lang) ?? "").padEnd(32).slice(0, 32)} ${String(t.count).padStart(3)} ${lang === "fr" ? "critères" : "criteria"}`,
    );
  }
  return out.join("\n");
}

// ---- query + run ----------------------------------------------------------

export interface CriteriaOpts {
  id?: string;
  theme?: number;
  list?: boolean;
  json?: boolean;
  lang: Lang;
  standard: StandardId;
}

function runWcag(opts: CriteriaOpts): number {
  if (opts.id) {
    const sc = getSC(opts.id);
    if (!sc) {
      console.error(`ultra11y criteria: unknown WCAG success criterion "${opts.id}".`);
      return 2;
    }
    console.log(opts.json ? JSON.stringify(sc, null, 2) : formatSC(sc, opts.lang));
    return 0;
  }
  if (typeof opts.theme === "number") {
    console.error(
      `ultra11y criteria: WCAG has no themes; use --list (grouped by guideline) or a success-criterion id, or pass --standard <pack> for a pack's themes.`,
    );
    return 2;
  }
  console.log(opts.json ? JSON.stringify(allSC(), null, 2) : wcagList(opts.lang));
  return 0;
}

function runPack(opts: CriteriaOpts): number {
  const pack = loadPack(opts.standard);
  if (opts.id) {
    const c = getPackCriterion(pack, opts.id);
    if (!c) {
      console.error(`ultra11y criteria: unknown ${pack.name} criterion "${opts.id}".`);
      return 2;
    }
    console.log(opts.json ? JSON.stringify(c, null, 2) : formatPackCriterion(pack, c, opts.lang));
    return 0;
  }
  if (typeof opts.theme === "number") {
    const crits = listPackTheme(pack, opts.theme);
    if (!crits.length) {
      console.error(`ultra11y criteria: unknown ${pack.name} theme "${opts.theme}".`);
      return 2;
    }
    if (opts.json) console.log(JSON.stringify(crits, null, 2));
    else for (const c of crits) console.log(`${c.id}\t${packTitlePlain(pack, c, opts.lang)}\t→ WCAG ${c.wcag.join(", ")}`);
    return 0;
  }
  console.log(opts.json ? JSON.stringify(pack.themes, null, 2) : packThemeList(pack, opts.lang));
  return 0;
}

export function runCriteria(opts: CriteriaOpts): number {
  return isCore(opts.standard) ? runWcag(opts) : runPack(opts);
}

/** Generate the references/criteria.md doc bundled with the skill (WCAG 2.2 AA core). */
export function renderCriteriaReference(): string {
  const out: string[] = [];
  out.push("<!-- GENERATED from src/data/wcag.json by `ultra11y criteria --generate` — do not edit by hand. -->");
  out.push("");
  out.push("# WCAG 2.2 Level AA — success-criteria reference");
  out.push("");
  out.push("The 55 Level A + AA success criteria across the 4 principles / 13 guidelines, with each");
  out.push("SC's level, the ultra11y automatability class (automatable / needs rendering / judgment),");
  out.push("the engine rules that cover it, and the RGAA criteria that map to it. SC ids, titles and");
  out.push("levels are derived from the W3C source (https://github.com/w3c/wcag); WCAG 2.2 © W3C.");
  out.push("");
  const byG = scsByGuideline();
  for (const g of allGuidelines()) {
    out.push(`## ${g.number} ${g.title}`);
    out.push("");
    out.push("| SC | Title | Level | Automatability | Rules | RGAA |");
    out.push("|---|---|---|---|---|---|");
    for (const c of byG.get(g.number) ?? []) {
      const rgaa =
        packsForSc(c.sc)
          .find((p) => p.key === "rgaa")
          ?.ids.join(", ") ?? "—";
      out.push(`| ${c.sc} | ${c.title.replace(/\|/g, "\\|")} | ${c.level} | ${c.automatability} | ${c.ruleIds.join(", ") || "—"} | ${rgaa} |`);
    }
    out.push("");
  }
  return out.join("\n");
}
