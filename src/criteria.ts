// `criteria` — offline lookup of the RGAA reference: one criterion, a theme, or
// the 13-theme list. Also generates the references/criteria.md doc shipped with
// the skill (never hand-edited).
import type { Criterion, Lang } from "./types.js";
import { allCriteria, allThemes, getCriterion, listTheme } from "./rgaa.js";

const AUTO_LABEL: Record<string, { fr: string; en: string }> = {
  static: { fr: "automatisable (moteur)", en: "automatable (engine)" },
  "needs-rendering": { fr: "nécessite un rendu", en: "needs rendering" },
  judgment: { fr: "jugement humain", en: "human judgment" },
};

export function formatCriterion(c: Criterion, lang: Lang = "fr"): string {
  const out: string[] = [];
  out.push(`${c.id} — ${c.titlePlain}`);
  const auto = AUTO_LABEL[c.automatability]![lang];
  const theme = allThemes().find((t) => t.number === c.theme)?.name ?? "";
  out.push(`${lang === "fr" ? "Thématique" : "Theme"} ${c.theme} (${theme}) · ${lang === "fr" ? "automatisabilité" : "automatability"} : ${auto}${c.ruleIds.length ? ` · ${lang === "fr" ? "règles" : "rules"} : ${c.ruleIds.join(", ")}` : ""}`);
  if (c.wcag.length) out.push(`WCAG : ${c.wcag.join(" ; ")}`);
  if (c.techniques.length) out.push(`${lang === "fr" ? "Techniques" : "Techniques"} : ${c.techniques.join(", ")}`);
  const testKeys = Object.keys(c.tests);
  if (testKeys.length) {
    out.push(`${lang === "fr" ? "Tests" : "Tests"} :`);
    for (const k of testKeys) for (const line of c.tests[k]!) out.push(`  ${c.id}.${k} ${line.replace(/\[([^\]]+)\]\(#[^)]*\)/g, "$1")}`);
  }
  if (c.technicalNote?.length) out.push(`${lang === "fr" ? "Note technique" : "Technical note"} : ${c.technicalNote.join(" ")}`);
  if (c.particularCases?.length) out.push(`${lang === "fr" ? "Cas particuliers" : "Particular cases"} : ${c.particularCases.join(" ")}`);
  return out.join("\n");
}

function themeList(lang: Lang): string {
  const out: string[] = [];
  out.push(lang === "fr" ? "RGAA 4.1.2 — 13 thématiques, 106 critères" : "RGAA 4.1.2 — 13 themes, 106 criteria");
  for (const t of allThemes()) {
    const crits = listTheme(t.number);
    const stat = crits.filter((c) => c.automatability === "static").length;
    out.push(`${String(t.number).padStart(2)}. ${t.name.padEnd(32).slice(0, 32)} ${String(t.count).padStart(3)} ${lang === "fr" ? "critères" : "criteria"} (${stat} ${lang === "fr" ? "auto" : "auto"})`);
  }
  return out.join("\n");
}

export interface CriteriaOpts {
  id?: string;
  theme?: number;
  list?: boolean;
  json?: boolean;
  lang: Lang;
}

export interface CriteriaQuery {
  kind: "one" | "theme" | "list";
  result: unknown;
}

/** Pure resolver (used by the CLI and tests). Returns null when an id/theme is unknown. */
export function queryCriteria(opts: CriteriaOpts): CriteriaQuery | null {
  if (opts.id) {
    const c = getCriterion(opts.id);
    return c ? { kind: "one", result: c } : null;
  }
  if (typeof opts.theme === "number") {
    const crits = listTheme(opts.theme);
    return crits.length ? { kind: "theme", result: crits } : null;
  }
  return { kind: "list", result: allThemes() };
}

export function runCriteria(opts: CriteriaOpts): number {
  const q = queryCriteria(opts);
  if (!q) {
    console.error(`ultra11y criteria: unknown ${opts.id ? `criterion "${opts.id}"` : `theme "${opts.theme}"`}.`);
    return 2;
  }
  if (opts.json) {
    console.log(JSON.stringify(q.result, null, 2));
    return 0;
  }
  if (q.kind === "one") {
    console.log(formatCriterion(q.result as Criterion, opts.lang));
  } else if (q.kind === "theme") {
    for (const c of q.result as Criterion[]) console.log(`${c.id}\t[${c.automatability}]\t${c.titlePlain}`);
  } else {
    console.log(themeList(opts.lang));
  }
  return 0;
}

/** Generate the references/criteria.md doc bundled with the skill. */
export function renderCriteriaReference(): string {
  const out: string[] = [];
  out.push("<!-- GENERATED from src/data/rgaa.json by `ultra11y criteria` — do not edit by hand. -->");
  out.push("");
  out.push("# RGAA 4.1.2 — référentiel des critères");
  out.push("");
  out.push("Les 106 critères des 13 thématiques, avec leur correspondance WCAG, la classe");
  out.push("d'automatisabilité ultra11y (automatisable / nécessite un rendu / jugement) et les");
  out.push("règles du moteur qui les couvrent. Source : RGAA 4.1.2 © DINUM, Licence Ouverte 2.0.");
  out.push("");
  for (const t of allThemes()) {
    out.push(`## ${t.number}. ${t.name}`);
    out.push("");
    out.push("| Critère | Intitulé | Automatisabilité | WCAG | Règles |");
    out.push("|---|---|---|---|---|");
    for (const c of listTheme(t.number)) {
      const wcag = c.wcag.map((w) => w.split(" ")[0]).join(", ");
      out.push(`| ${c.id} | ${c.titlePlain.replace(/\|/g, "\\|")} | ${c.automatability} | ${wcag} | ${c.ruleIds.join(", ") || "—"} |`);
    }
    out.push("");
  }
  return out.join("\n");
}
