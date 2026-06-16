// Output helpers: a tiny fr/en string table and the human-readable `audit`
// summary (the --json path prints the AuditResult verbatim instead).
import type { AuditResult, Lang, Severity } from "./types.js";

type Key =
  | "summaryTitle"
  | "files"
  | "autoConformance"
  | "theme"
  | "findingsTitle"
  | "noFindings"
  | "residualTitle"
  | "manualNote";

const STR: Record<Lang, Record<Key, string>> = {
  fr: {
    summaryTitle: "Audit RGAA 4.1.2 (moteur statique ultra11y)",
    files: "fichiers analysés",
    autoConformance: "conformité automatique (sous-ensemble statique)",
    theme: "Thématique",
    findingsTitle: "Non-conformités détectées",
    noFindings: "Aucune non-conformité détectée par le moteur statique.",
    residualTitle: "À évaluer manuellement (jugement / rendu)",
    manualNote: "critères non décidables par le moteur — à compléter par une revue humaine.",
  },
  en: {
    summaryTitle: "RGAA 4.1.2 audit (ultra11y static engine)",
    files: "files analysed",
    autoConformance: "automatic conformance (static subset)",
    theme: "Theme",
    findingsTitle: "Non-conformities detected",
    noFindings: "No non-conformity detected by the static engine.",
    residualTitle: "To assess manually (judgment / rendering)",
    manualNote: "criteria the engine cannot decide — complete with a human review.",
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
  lines.push(`${t(lang, "theme")}            C  NC  NA  ⏳`);
  for (const th of r.themes) {
    const name = `${th.number}. ${th.title}`.padEnd(28).slice(0, 28);
    lines.push(`${name} ${String(th.c).padStart(2)}  ${String(th.nc).padStart(2)}  ${String(th.na).padStart(2)}  ${String(th.manual).padStart(2)}`);
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
  return lines.join("\n");
}
