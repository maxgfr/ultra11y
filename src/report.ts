// `report` — render an AuditResult into a dated RGAA compliance report (Markdown,
// etalab-style): metadata, per-theme synthesis, non-conformities by priority,
// conforming + not-applicable lists, and the manual worklist (never silently C).
import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import type { AuditResult, Finding, Lang, Severity } from "./types.js";
import { getCriterion } from "./rgaa.js";

const ICON: Record<Severity, string> = { bloquant: "🔴", majeur: "🟠", mineur: "🟡" };
const SEV_ORDER: Severity[] = ["bloquant", "majeur", "mineur"];

const L = {
  fr: {
    title: "Rapport d'audit d'accessibilité — RGAA 4.1.2",
    date: "Date",
    tool: "Outil",
    toolNote: "moteur statique — audit préliminaire à compléter par une revue humaine",
    scope: "Périmètre",
    files: "fichier(s)",
    rate: "Taux de conformité automatique",
    rateNote: "sous-ensemble statique : C ÷ (C + NC)",
    warn: "Ce rapport couvre le sous-ensemble de critères vérifiables automatiquement. Les critères « à évaluer » (rendu / jugement) doivent être complétés par une revue humaine (voir la dernière section).",
    synthTitle: "1. Synthèse par thématique",
    th: ["Thématique", "C", "NC", "NA", "À évaluer"],
    total: "Total",
    ncTitle: "2. Non-conformités (par priorité)",
    sev: { bloquant: "Bloquant", majeur: "Majeur", mineur: "Mineur" } as Record<Severity, string>,
    fix: "Correction",
    none: "Aucune non-conformité détectée par le moteur statique.",
    cTitle: "3. Critères conformes (C)",
    naTitle: "4. Critères non applicables (NA)",
    manualTitle: "5. Critères à évaluer manuellement (rendu / jugement)",
    manualWarn: "Ne marquez aucun de ces critères « conforme » sans vérification humaine.",
    nothing: "Aucun.",
  },
  en: {
    title: "Accessibility audit report — RGAA 4.1.2",
    date: "Date",
    tool: "Tool",
    toolNote: "static engine — preliminary audit to be completed by a human review",
    scope: "Scope",
    files: "file(s)",
    rate: "Automatic conformance rate",
    rateNote: "static subset: C ÷ (C + NC)",
    warn: "This report covers the subset of criteria checkable automatically. The “to assess” criteria (rendering / judgment) must be completed by a human review (see the last section).",
    synthTitle: "1. Per-theme synthesis",
    th: ["Theme", "C", "NC", "NA", "To assess"],
    total: "Total",
    ncTitle: "2. Non-conformities (by priority)",
    sev: { bloquant: "Blocking", majeur: "Major", mineur: "Minor" } as Record<Severity, string>,
    fix: "Fix",
    none: "No non-conformity detected by the static engine.",
    cTitle: "3. Conforming criteria (C)",
    naTitle: "4. Not-applicable criteria (NA)",
    manualTitle: "5. Criteria to assess manually (rendering / judgment)",
    manualWarn: "Do not mark any of these criteria “conforming” without a human check.",
    nothing: "None.",
  },
} as const;

function critLabel(id: string): string {
  const c = getCriterion(id);
  return c ? `${id} — ${c.titlePlain}` : id;
}

function ncEntry(f: Finding, fixLabel: string): string {
  return `- **${critLabel(f.criteriaId)}** — \`${f.file}:${f.line}\` (\`${f.selectorHint}\`)\n  - ${f.message}\n  - _${fixLabel} :_ ${f.remediation}`;
}

export function renderReport(r: AuditResult, lang: Lang = "fr"): string {
  const s = L[lang];
  const out: string[] = [];
  out.push(`# ${s.title}`, "");
  out.push(`- **${s.date}** : ${r.date}`);
  out.push(`- **${s.tool}** : ultra11y v${r.version} (${s.toolNote})`);
  out.push(`- **${s.scope}** : ${r.scope.files} ${s.files} — ${r.scope.inputs.join(", ")}`);
  out.push(`- **${s.rate}** : ${r.conformancePct}% (${s.rateNote})`);
  out.push("", `> ⚠️ ${s.warn}`, "");

  // 1. synthesis
  out.push(`## ${s.synthTitle}`, "");
  out.push(`| ${s.th.join(" | ")} |`);
  out.push(`|${"---|".repeat(s.th.length)}`);
  const tot = { c: 0, nc: 0, na: 0, manual: 0 };
  for (const th of r.themes) {
    out.push(`| ${th.number}. ${th.title} | ${th.c} | ${th.nc} | ${th.na} | ${th.manual} |`);
    tot.c += th.c; tot.nc += th.nc; tot.na += th.na; tot.manual += th.manual;
  }
  out.push(`| **${s.total}** | **${tot.c}** | **${tot.nc}** | **${tot.na}** | **${tot.manual}** |`, "");

  // 2. non-conformities by priority
  out.push(`## ${s.ncTitle}`, "");
  if (r.findings.length === 0) {
    out.push(s.none, "");
  } else {
    const sorted = [...r.findings].sort(
      (a, b) => SEV_ORDER.indexOf(a.severity) - SEV_ORDER.indexOf(b.severity) || a.criteriaId.localeCompare(b.criteriaId, undefined, { numeric: true }) || a.line - b.line,
    );
    for (const sev of SEV_ORDER) {
      const group = sorted.filter((f) => f.severity === sev);
      if (!group.length) continue;
      out.push(`### ${ICON[sev]} ${s.sev[sev]} (${group.length})`, "");
      for (const f of group) out.push(ncEntry(f, s.fix));
      out.push("");
    }
  }

  // 3. conforming
  out.push(`## ${s.cTitle}`, "");
  const conform = r.criteria.filter((c) => c.status === "C");
  out.push(conform.length ? conform.map((c) => `- ${critLabel(c.id)}`).join("\n") : s.nothing, "");

  // 4. not applicable
  out.push(`## ${s.naTitle}`, "");
  const na = r.criteria.filter((c) => c.status === "NA");
  out.push(na.length ? na.map((c) => `- ${critLabel(c.id)}${c.justification ? ` — _${c.justification}_` : ""}`).join("\n") : s.nothing, "");

  // 5. manual worklist
  out.push(`## ${s.manualTitle}`, "", `> ${s.manualWarn}`, "");
  out.push(
    r.residualRisks.length
      ? r.residualRisks.map((rr) => `- ${critLabel(rr.criteriaId)} — _${rr.reason}_`).join("\n")
      : s.nothing,
    "",
  );

  return out.join("\n");
}

export interface ReportOpts {
  out: string;
  lang: Lang;
}

/** Render and write the report; returns the written path. */
export function writeReport(r: AuditResult, opts: ReportOpts): string {
  const md = renderReport(r, opts.lang);
  mkdirSync(opts.out, { recursive: true });
  const path = join(opts.out, `rgaa-${r.date}.md`);
  writeFileSync(path, md);
  return path;
}
