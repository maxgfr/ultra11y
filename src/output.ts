// Output helpers: a tiny fr/en string table and the human-readable `audit`
// summary (the --json path prints the AuditResult verbatim instead).
import type { AuditResult, Lang, Severity } from "./types.js";

type Key = "summaryTitle" | "files" | "autoConformance" | "guideline" | "findingsTitle" | "noFindings" | "residualTitle" | "manualNote" | "renderedNote";

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
    const name = `${g.key} ${g.title}`.padEnd(28).slice(0, 28);
    lines.push(`${name} ${String(g.c).padStart(2)}  ${String(g.nc).padStart(2)}  ${String(g.na).padStart(2)}  ${String(g.manual).padStart(2)}`);
  }
  lines.push("");
  if (r.findings.length === 0) {
    lines.push(t(lang, "noFindings"));
  } else {
    lines.push(`${t(lang, "findingsTitle")} (${r.findings.length}) :`);
    for (const f of r.findings.slice(0, 20)) {
      lines.push(`  ${ICON[f.severity]} [${f.criteriaId}] ${f.file}:${f.line}  ${f.message}`);
    }
    if (r.findings.length > 20) lines.push(`  … (+${r.findings.length - 20})`);
  }
  lines.push("");
  lines.push(`${t(lang, "residualTitle")} : ${r.residualRisks.length} ${t(lang, "manualNote")}`);
  if (r.scope.rendered) lines.push(`🧩 ${r.scope.rendered.files} ${t(lang, "renderedNote")} (${r.scope.rendered.opaqueLibraries.join(", ")}).`);
  return lines.join("\n");
}
