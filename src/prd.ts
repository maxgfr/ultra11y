// `prd` — turn an AuditResult into an actionable "fixes to do" backlog (Markdown),
// grouped by RGAA criterion. Default: one combined backlog sectioned by priority.
// `--split criterion`: one PRD file per criterion. The same per-criterion units
// feed optional GitHub issue creation (see gh.ts). Reuses the audit's own data —
// criterion labels, severities, messages, remediations, file:line, and the
// cross-file `related` definition site.
import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import type { AuditResult, Finding, Lang, Severity } from "./types.js";
import { getCriterion } from "./rgaa.js";

const SEV_ORDER: Severity[] = ["bloquant", "majeur", "mineur"];
const SEV_RANK: Record<Severity, number> = { bloquant: 0, majeur: 1, mineur: 2 };
const ICON: Record<Severity, string> = { bloquant: "🔴", majeur: "🟠", mineur: "🟡" };

const L = {
  fr: {
    title: "Plan de correction d'accessibilité — RGAA 4.1.2",
    date: "Date",
    scope: "Périmètre",
    files: "fichier(s)",
    rate: "Taux de conformité automatique",
    note: "Backlog des corrections détectées automatiquement. Les critères « à évaluer » (rendu / jugement) sont à compléter par une revue humaine (voir le rapport).",
    none: "Aucune correction automatique à faire : le moteur statique n'a relevé aucune non-conformité.",
    sev: { bloquant: "Bloquant", majeur: "Majeur", mineur: "Mineur" } as Record<Severity, string>,
    fix: "Correction",
    affected: "Occurrence(s)",
    def: "Définition",
    prdTitle: (label: string) => `PRD — ${label}`,
  },
  en: {
    title: "Accessibility fix plan — RGAA 4.1.2",
    date: "Date",
    scope: "Scope",
    files: "file(s)",
    rate: "Automatic conformance rate",
    note: "Backlog of automatically-detected fixes. The “to assess” criteria (rendering / judgment) must be completed by a human review (see the report).",
    none: "No automatic fix to do: the static engine found no non-conformity.",
    sev: { bloquant: "Blocking", majeur: "Major", mineur: "Minor" } as Record<Severity, string>,
    fix: "Fix",
    affected: "Occurrence(s)",
    def: "Definition",
    prdTitle: (label: string) => `PRD — ${label}`,
  },
} as const;

export interface PrdUnit {
  criteriaId: string;
  title: string; // criterion titlePlain
  label: string; // "<id> — <titlePlain>"
  wcag: string[];
  severity: Severity; // most severe finding in the group
  findings: Finding[];
}

/** Group findings by RGAA criterion into actionable units, ordered by severity
 *  then criterion id. Each unit is one backlog item / one GitHub issue. */
export function prdUnits(r: AuditResult): PrdUnit[] {
  const byCrit = new Map<string, Finding[]>();
  for (const f of r.findings) {
    const arr = byCrit.get(f.criteriaId) ?? [];
    arr.push(f);
    byCrit.set(f.criteriaId, arr);
  }
  const units: PrdUnit[] = [];
  for (const [criteriaId, fs] of byCrit) {
    const c = getCriterion(criteriaId);
    const severity = [...fs].sort((a, b) => SEV_RANK[a.severity] - SEV_RANK[b.severity])[0]?.severity ?? "mineur";
    units.push({
      criteriaId,
      title: c?.titlePlain ?? criteriaId,
      label: c ? `${criteriaId} — ${c.titlePlain}` : criteriaId,
      wcag: c?.wcag ?? [],
      severity,
      findings: [...fs].sort((a, b) => a.file.localeCompare(b.file) || a.line - b.line),
    });
  }
  units.sort((a, b) => SEV_RANK[a.severity] - SEV_RANK[b.severity] || a.criteriaId.localeCompare(b.criteriaId, undefined, { numeric: true }));
  return units;
}

// One backlog item: criterion heading, fix, and a checklist of occurrences.
function unitBlock(unit: PrdUnit, lang: Lang, heading: string): string[] {
  const s = L[lang];
  const out: string[] = [];
  const wcag = unit.wcag.length ? `  ·  WCAG ${unit.wcag.join(", ")}` : "";
  out.push(`${heading} ${ICON[unit.severity]} ${unit.label}${wcag}`, "");
  // remediation: the findings of a criterion usually share one; list distinct ones.
  const fixes = [...new Set(unit.findings.map((f) => f.remediation))];
  for (const fx of fixes) out.push(`- _${s.fix} :_ ${fx}`);
  out.push("", `**${s.affected} (${unit.findings.length})**`, "");
  for (const f of unit.findings) {
    out.push(`- [ ] \`${f.file}:${f.line}\` (\`${f.selectorHint}\`) — ${f.message}`);
    if (f.related) out.push(`  - ↳ ${f.related.note} : \`${f.related.file}:${f.related.line}\` (\`${f.related.selectorHint}\`)`);
  }
  out.push("");
  return out;
}

function header(r: AuditResult, lang: Lang, title: string): string[] {
  const s = L[lang];
  return [
    `# ${title}`,
    "",
    `- **${s.date}** : ${r.date}`,
    `- **${s.scope}** : ${r.scope.files} ${s.files} — ${r.scope.inputs.join(", ")}`,
    `- **${s.rate}** : ${r.conformancePct}%`,
    "",
    `> ${s.note}`,
    "",
  ];
}

/** A single combined backlog, sectioned by priority (bloquant → majeur → mineur). */
export function renderBacklog(r: AuditResult, lang: Lang = "fr"): string {
  const s = L[lang];
  const units = prdUnits(r);
  const out = header(r, lang, s.title);
  if (!units.length) {
    out.push(s.none, "");
    return out.join("\n");
  }
  for (const sev of SEV_ORDER) {
    const group = units.filter((u) => u.severity === sev);
    if (!group.length) continue;
    out.push(`## ${ICON[sev]} ${s.sev[sev]} (${group.length})`, "");
    for (const u of group) out.push(...unitBlock(u, lang, "###"));
  }
  return out.join("\n");
}

export interface PrdFile {
  name: string; // file name (no dir)
  content: string;
}

/** One standalone PRD document per criterion (for `--split criterion`). */
export function renderPerCriterion(r: AuditResult, lang: Lang = "fr"): PrdFile[] {
  const s = L[lang];
  return prdUnits(r).map((u) => {
    const out = header(r, lang, s.prdTitle(u.label));
    out.push(...unitBlock(u, lang, "##"));
    return { name: `prd-${u.criteriaId}-${r.date}.md`, content: out.join("\n") };
  });
}

export interface PrdOpts {
  out: string;
  lang: Lang;
  split?: "criterion";
}

/** Render and write the PRD markdown; returns the written path(s). */
export function writePrd(r: AuditResult, opts: PrdOpts): string[] {
  mkdirSync(opts.out, { recursive: true });
  if (opts.split === "criterion") {
    const files = renderPerCriterion(r, opts.lang);
    const paths: string[] = [];
    for (const f of files) {
      const p = join(opts.out, f.name);
      writeFileSync(p, f.content);
      paths.push(p);
    }
    return paths;
  }
  const p = join(opts.out, `prd-${r.date}.md`);
  writeFileSync(p, renderBacklog(r, opts.lang));
  return [p];
}
