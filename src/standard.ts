// `--standard wcag` — a PRESENTATION-ONLY re-keying of an audit by WCAG 2.1 success
// criteria, derived from the `wcag` cross-reference each RGAA criterion already
// carries. RGAA stays the engine's internal key and the canonical, gated report;
// this view never goes through `check`/`verify` (their regexes assume 2-segment
// RGAA ids like "8.3" and would mis-parse 3-segment SC ids like "1.4.3").
import type { AuditResult, CriterionResult, Lang, Status } from "./types.js";
import { allCriteria, getCriterion } from "./rgaa.js";

export type Standard = "rgaa" | "wcag";

export function parseStandard(v: string | boolean | undefined): Standard {
  return v === "wcag" ? "wcag" : "rgaa";
}

export interface WcagSC {
  sc: string; // "1.4.3"
  title: string; // "Contrast (Minimum)"
  level: string; // "A" | "AA" | "AAA"
}

// "1.1.1 Non-text Content (A)" / "1.4.3 Contrast (Minimum) (AA)" → parts. The
// LAST parenthesised group is the conformance level; greedy title keeps any inner
// parentheses ("(Minimum)"). Falls back gracefully on an unexpected shape.
const WCAG_RE = /^(\d+(?:\.\d+)+)\s+(.*?)\s*\(([A]{1,3})\)\s*$/;
export function parseWcag(entry: string): WcagSC {
  const m = WCAG_RE.exec(entry.trim());
  if (m) return { sc: m[1]!, title: m[2]!.trim(), level: m[3]! };
  const sp = entry.trim().split(/\s+/);
  return { sc: sp[0] ?? entry.trim(), title: sp.slice(1).join(" "), level: "" };
}

/** Numeric "1.4.10" < "1.4.3" → false; sorts SC ids as version tuples. */
export function compareSC(a: string, b: string): number {
  const pa = a.split(".").map(Number);
  const pb = b.split(".").map(Number);
  for (let i = 0; i < Math.max(pa.length, pb.length); i++) {
    const d = (pa[i] ?? 0) - (pb[i] ?? 0);
    if (d) return d;
  }
  return 0;
}

export interface WcagEntry extends WcagSC {
  rgaaIds: string[]; // RGAA criteria that reference this SC
}

/** Build the WCAG SC index from the bundled RGAA dataset (deterministic order). */
export function wcagIndex(): WcagEntry[] {
  const byScId = new Map<string, WcagEntry>();
  for (const c of allCriteria()) {
    for (const w of c.wcag) {
      const p = parseWcag(w);
      const e = byScId.get(p.sc) ?? { ...p, rgaaIds: [] };
      // Keep title/level in sync (the same SC is cross-referenced by several RGAA
      // criteria, occasionally with different casing) rather than freezing first-seen.
      e.title = p.title;
      e.level = p.level;
      if (!e.rgaaIds.includes(c.id)) e.rgaaIds.push(c.id);
      byScId.set(p.sc, e);
    }
  }
  return [...byScId.values()].sort((a, b) => compareSC(a.sc, b.sc));
}

// Aggregate the contributing RGAA criteria into one SC verdict. NC dominates (a
// real failure anywhere fails the SC); then a decided C; then manual; else NA.
function aggregateStatus(results: CriterionResult[]): Status {
  if (results.some((r) => r.status === "NC")) return "NC";
  if (results.some((r) => r.status === "C")) return "C";
  if (results.some((r) => r.status === "manual")) return "manual";
  return "NA";
}

export interface ScResult extends WcagEntry {
  status: Status;
  findingCount: number;
}

export function scResults(r: AuditResult): ScResult[] {
  const byId = new Map(r.criteria.map((c) => [c.id, c]));
  return wcagIndex().map((e) => {
    const results = e.rgaaIds.map((id) => byId.get(id)).filter((x): x is CriterionResult => !!x);
    return {
      ...e,
      status: aggregateStatus(results),
      findingCount: results.reduce((n, c) => n + c.findings.length, 0),
    };
  });
}

const STATUS_LABEL: Record<Status, { fr: string; en: string }> = {
  C: { fr: "Conforme", en: "Conforming" },
  NC: { fr: "Non conforme", en: "Non-conforming" },
  NA: { fr: "Non applicable", en: "Not applicable" },
  manual: { fr: "À évaluer", en: "To assess" },
};

const T = {
  fr: {
    title: "Rapport d'audit d'accessibilité — WCAG 2.1 niveau AA",
    sub: "Vue WCAG dérivée des correspondances du RGAA 4.1.2 (référentiel interne). Présentation seule — les contrôles d'intégrité (`check`/`verify`) opèrent sur le rapport RGAA.",
    date: "Date",
    scope: "Périmètre",
    files: "fichier(s)",
    rate: "Taux de conformité automatique",
    rateNote: "sous-ensemble statique des critères RGAA mappés",
    synth: "1. Critères de succès WCAG",
    th: ["SC", "Intitulé", "Niveau", "Statut", "RGAA", "Findings"],
    ncTitle: "2. Non-conformités (par critère de succès)",
    none: "Aucune non-conformité détectée par le moteur statique.",
    equiv: "Équivalence internationale",
    equivBody:
      "EN 301 549 §9 (Union européenne) et la Section 508 révisée (États-Unis) intègrent WCAG 2.1 niveau AA par référence ; cette vue couvre donc les exigences « web » de ces deux référentiels.",
  },
  en: {
    title: "Accessibility audit report — WCAG 2.1 Level AA",
    sub: "WCAG view derived from RGAA 4.1.2 cross-references (internal reference). Presentation only — integrity gates (`check`/`verify`) operate on the RGAA report.",
    date: "Date",
    scope: "Scope",
    files: "file(s)",
    rate: "Automatic conformance rate",
    rateNote: "static subset of mapped RGAA criteria",
    synth: "1. WCAG success criteria",
    th: ["SC", "Title", "Level", "Status", "RGAA", "Findings"],
    ncTitle: "2. Non-conformities (by success criterion)",
    none: "No non-conformity detected by the static engine.",
    equiv: "International equivalence",
    equivBody:
      "EN 301 549 §9 (European Union) and the revised Section 508 (United States) both incorporate WCAG 2.1 Level AA by reference; this view therefore maps to those standards' web requirements.",
  },
} as const;

/** Render the WCAG-keyed report (presentation-only; not gated). */
export function renderWcagReport(r: AuditResult, lang: Lang = "fr"): string {
  const s = T[lang];
  const out: string[] = [];
  out.push(`# ${s.title}`, "", `> ${s.sub}`, "");
  out.push(`- **${s.date}** : ${r.date}`);
  out.push(`- **${s.scope}** : ${r.scope.files} ${s.files} — ${r.scope.inputs.join(", ")}`);
  out.push(`- **${s.rate}** : ${r.conformancePct}% (${s.rateNote})`, "");

  const scs = scResults(r);
  out.push(`## ${s.synth}`, "");
  out.push(`| ${s.th.join(" | ")} |`);
  out.push(`|${"---|".repeat(s.th.length)}`);
  for (const sc of scs) {
    out.push(`| ${sc.sc} | ${sc.title} | ${sc.level} | ${STATUS_LABEL[sc.status][lang]} | ${sc.rgaaIds.join(", ")} | ${sc.findingCount || ""} |`);
  }
  out.push("");

  out.push(`## ${s.ncTitle}`, "");
  const ncScs = scs.filter((sc) => sc.status === "NC");
  if (!ncScs.length) {
    out.push(s.none, "");
  } else {
    const byId = new Map(r.criteria.map((c) => [c.id, c]));
    for (const sc of ncScs) {
      out.push(`### ${sc.sc} ${sc.title} (${sc.level})`, "");
      for (const id of sc.rgaaIds) {
        const cr = byId.get(id);
        if (!cr) continue;
        for (const f of cr.findings) {
          const c = getCriterion(id);
          out.push(`- **RGAA ${id}${c ? ` — ${c.titlePlain}` : ""}** — \`${f.file}:${f.line}\` (\`${f.selectorHint}\`)`);
          out.push(`  - ${f.message}`);
        }
      }
      out.push("");
    }
  }

  out.push(`## ${s.equiv}`, "", s.equivBody, "");
  return out.join("\n");
}

/** Text listing of WCAG SCs (for `criteria --standard wcag --list`). */
export function wcagListText(lang: Lang = "fr"): string {
  const out: string[] = [];
  out.push(lang === "fr" ? "WCAG 2.1 — critères de succès référencés par le RGAA 4.1.2" : "WCAG 2.1 — success criteria referenced by RGAA 4.1.2");
  for (const e of wcagIndex()) {
    out.push(`${e.sc.padEnd(8)} [${e.level.padEnd(3)}] ${e.title}  ←  RGAA ${e.rgaaIds.join(", ")}`);
  }
  return out.join("\n");
}

/** Detail of one WCAG SC (for `criteria --standard wcag <sc>`); null if unknown. */
export function wcagLookupText(sc: string, lang: Lang = "fr"): string | null {
  const e = wcagIndex().find((x) => x.sc === sc);
  if (!e) return null;
  const out: string[] = [];
  out.push(`${e.sc} — ${e.title} (${lang === "fr" ? "niveau" : "level"} ${e.level})`);
  out.push(`${lang === "fr" ? "Critères RGAA correspondants" : "Corresponding RGAA criteria"} :`);
  for (const id of e.rgaaIds) {
    const c = getCriterion(id);
    out.push(`  ${id} — ${c?.titlePlain ?? ""} [${c?.automatability ?? "?"}]`);
  }
  return out.join("\n");
}
