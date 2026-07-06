// Output helpers: a tiny fr/en string table and the human-readable `audit`
// summary (the --json path prints the AuditResult verbatim instead).
import type { AuditResult, Lang, Severity } from "./types.js";
import type { CaptureCoverage } from "./capture.js";
import { guidelineTitle } from "./wcag.js";
import { resolveMessage } from "./messages.js";

type Key =
  | "summaryTitle"
  | "files"
  | "autoConformance"
  | "guideline"
  | "findingsTitle"
  | "noFindings"
  | "residualTitle"
  | "manualNote"
  | "renderedNote"
  | "sfcNote"
  | "capturesNote";

const STR: Record<Lang, Record<Key, string>> = {
  fr: {
    summaryTitle: "Audit WCAG 2.2 AA (moteur statique ultra11y)",
    files: "fichiers analysés",
    autoConformance: "réussite automatique (vérifications statiques)",
    guideline: "Règle WCAG",
    findingsTitle: "Non-conformités détectées",
    noFindings: "Aucune non-conformité détectée par le moteur statique.",
    residualTitle: "À évaluer manuellement (jugement / rendu)",
    manualNote: "critères non décidables par le moteur — à compléter par une revue humaine.",
    renderedNote: "fichier(s) rendent des composants de bibliothèque non analysés en source — auditez le build (render) ou scan",
    sfcNote:
      "composant(s) .vue/.svelte/.astro audité(s) en SOURCE (template) — slots et liaisons dynamiques invisibles : verdict préliminaire, auditez le rendu (render/scan)",
    capturesNote: "fichier(s) de capture rendus audités à pleine fidélité (DOM réel) — le vrai HTML produit",
  },
  en: {
    summaryTitle: "WCAG 2.2 AA audit (ultra11y static engine)",
    files: "files analysed",
    autoConformance: "automatic static-check pass rate",
    guideline: "WCAG guideline",
    findingsTitle: "Non-conformities detected",
    noFindings: "No non-conformity detected by the static engine.",
    residualTitle: "To assess manually (judgment / rendering)",
    manualNote: "criteria the engine cannot decide — complete with a human review.",
    renderedNote: "file(s) render component-library output not analysed from source — audit the build (render) or scan",
    sfcNote:
      ".vue/.svelte/.astro file(s) audited as SOURCE (template) — slots and dynamic bindings are invisible: preliminary verdict, audit the rendered output (render/scan)",
    capturesNote: "rendered capture file(s) audited at full fidelity (real DOM) — the true produced HTML",
  },
};

export function t(lang: Lang, key: Key): string {
  return STR[lang][key];
}

const ICON: Record<Severity, string> = { bloquant: "🔴", majeur: "🟠", mineur: "🟡" };

export function auditSummary(r: AuditResult, lang: Lang): string {
  const lines: string[] = [];
  lines.push(`${t(lang, "summaryTitle")} — ${r.date}`);
  lines.push(`${r.scope.files} ${t(lang, "files")} · ${r.conformancePct}% ${t(lang, "autoConformance")}`);
  lines.push("");
  lines.push(`${t(lang, "guideline")}        C  NC  NA  ⏳`);
  for (const g of r.guidelines) {
    // `g.title` is the baked-in English title (JSON back-compat); resolve by key + lang.
    const name = `${g.key} ${guidelineTitle(g.key, lang) ?? g.title}`.padEnd(28).slice(0, 28);
    lines.push(`${name} ${String(g.c).padStart(2)}  ${String(g.nc).padStart(2)}  ${String(g.na).padStart(2)}  ${String(g.manual).padStart(2)}`);
  }
  lines.push("");
  if (r.findings.length === 0) {
    lines.push(t(lang, "noFindings"));
  } else {
    lines.push(`${t(lang, "findingsTitle")} (${r.findings.length}) :`);
    for (const f of r.findings.slice(0, 20)) {
      lines.push(`  ${ICON[f.severity]} [${f.criteriaId}] ${f.file}:${f.line}  ${resolveMessage(f, lang)}`);
    }
    if (r.findings.length > 20) lines.push(`  … (+${r.findings.length - 20})`);
  }
  lines.push("");
  lines.push(`${t(lang, "residualTitle")} : ${r.residualRisks.length} ${t(lang, "manualNote")}`);
  if (r.scope.rendered) lines.push(`🧩 ${r.scope.rendered.files} ${t(lang, "renderedNote")} (${r.scope.rendered.opaqueLibraries.join(", ")}).`);
  if (r.scope.sourceTemplate) lines.push(`🧩 ${r.scope.sourceTemplate.files} ${t(lang, "sfcNote")} (${r.scope.sourceTemplate.extensions.join(", ")}).`);
  if (r.scope.captures) lines.push(`✅ ${r.scope.captures.files} ${t(lang, "capturesNote")}.`);
  return lines.join("\n");
}

/** Human-readable rendered-capture coverage: covered vs opaque-source-only blind spots.
 *  Reused by `audit --require-captures` (as a gate note) and `render --coverage`. */
export function captureCoverageSummary(cov: CaptureCoverage, lang: Lang): string {
  const fr = lang === "fr";
  const lines: string[] = [];
  if (cov.total === 0) {
    lines.push(fr ? "Couverture captures : aucun composant à couvrir dans le périmètre." : "Capture coverage: no components to cover in scope.");
  } else {
    lines.push(
      fr
        ? `Couverture captures : ${cov.covered.length}/${cov.total} composant(s) couvert(s) par un rendu.`
        : `Capture coverage: ${cov.covered.length}/${cov.total} component(s) covered by a render.`,
    );
    if (cov.blindSpots.length) {
      lines.push(fr ? "Angles morts (audités sur source opaque uniquement) :" : "Blind spots (audited from opaque source only):");
      for (const k of cov.blindSpots) lines.push(`  · ${k}`);
    }
  }
  if (cov.unattributed)
    lines.push(fr ? `${cov.unattributed} capture(s) sans provenance (non rattachée·s).` : `${cov.unattributed} capture(s) without provenance (unattributed).`);
  return lines.join("\n");
}
