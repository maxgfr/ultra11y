// `prd` — turn an AuditResult into an actionable "fixes to do" backlog (Markdown),
// grouped by WCAG success criterion (or, with --standard <pack>, by the pack's
// criteria projected from the WCAG audit). Default: one combined backlog sectioned
// by priority. `--split criterion`: one PRD file per criterion. The same per-criterion
// units feed optional GitHub issue creation (see gh.ts).
import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import type { AuditResult, Finding, Lang, Severity } from "./types.js";
import { getSC } from "./wcag.js";
import { type StandardId, isCore, loadPack, derivePackResults, titlePlain as packTitlePlain } from "./standards/index.js";

const SEV_ORDER: Severity[] = ["bloquant", "majeur", "mineur"];
const SEV_RANK: Record<Severity, number> = { bloquant: 0, majeur: 1, mineur: 2 };
const ICON: Record<Severity, string> = { bloquant: "🔴", majeur: "🟠", mineur: "🟡" };

const L = {
  fr: {
    title: (std: string) => `Plan de correction d'accessibilité — ${std}`,
    date: "Date",
    scope: "Périmètre",
    files: "fichier(s)",
    rate: "Taux de réussite automatique",
    note: "Backlog des corrections détectées automatiquement. Les critères « à évaluer » (rendu / jugement) sont à compléter par une revue humaine (voir le rapport).",
    none: "Aucune correction automatique à faire : le moteur statique n'a relevé aucune non-conformité.",
    sev: { bloquant: "Bloquant", majeur: "Majeur", mineur: "Mineur" } as Record<Severity, string>,
    fix: "Correction",
    affected: "Occurrence(s)",
    prdTitle: (label: string) => `PRD — ${label}`,
  },
  en: {
    title: (std: string) => `Accessibility fix plan — ${std}`,
    date: "Date",
    scope: "Scope",
    files: "file(s)",
    rate: "Automatic static-check pass rate",
    note: "Backlog of automatically-detected fixes. The “to assess” criteria (rendering / judgment) must be completed by a human review (see the report).",
    none: "No automatic fix to do: the static engine found no non-conformity.",
    sev: { bloquant: "Blocking", majeur: "Major", mineur: "Minor" } as Record<Severity, string>,
    fix: "Fix",
    affected: "Occurrence(s)",
    prdTitle: (label: string) => `PRD — ${label}`,
  },
} as const;

export interface PrdUnit {
  criteriaId: string;
  title: string; // criterion plain title
  label: string; // "<id> — <title>" (pack: "<name> <id> — <title>")
  refs: string[]; // related WCAG SC ids (pack units) — empty for the WCAG core
  severity: Severity; // most severe finding in the group
  findings: Finding[];
}

function stdLabel(standard: StandardId): string {
  return isCore(standard)
    ? "WCAG 2.2 AA"
    : (() => {
        const p = loadPack(standard);
        return `${p.name} ${p.baseVersion}`;
      })();
}

/** Group findings into actionable units (one backlog item / one GitHub issue),
 *  ordered by severity then id. Core groups by WCAG SC; a pack groups by its own
 *  criteria projected from the WCAG-keyed audit. */
export function prdUnits(r: AuditResult, standard: StandardId = "wcag", lang: Lang = "en"): PrdUnit[] {
  const units: PrdUnit[] = [];
  const mostSevere = (fs: Finding[]): Severity => [...fs].sort((a, b) => SEV_RANK[a.severity] - SEV_RANK[b.severity])[0]?.severity ?? "mineur";
  const sortFindings = (fs: Finding[]) => [...fs].sort((a, b) => a.file.localeCompare(b.file) || a.line - b.line);

  if (isCore(standard)) {
    const byCrit = new Map<string, Finding[]>();
    for (const f of r.findings) (byCrit.get(f.criteriaId) ?? byCrit.set(f.criteriaId, []).get(f.criteriaId)!).push(f);
    for (const [criteriaId, fs] of byCrit) {
      const sc = getSC(criteriaId);
      units.push({
        criteriaId,
        title: sc?.title ?? criteriaId,
        label: sc ? `${criteriaId} — ${sc.title}` : criteriaId,
        refs: [],
        severity: mostSevere(fs),
        findings: sortFindings(fs),
      });
    }
  } else {
    const pack = loadPack(standard);
    for (const pr of derivePackResults(r, standard)) {
      if (!pr.findings.length) continue;
      const pc = pack.criteria.find((c) => c.id === pr.id)!;
      const t = packTitlePlain(pack, pc, lang);
      units.push({
        criteriaId: pr.id,
        title: t,
        label: `${pack.name} ${pr.id} — ${t}`,
        refs: pc.wcag,
        severity: mostSevere(pr.findings),
        findings: sortFindings(pr.findings),
      });
    }
  }
  units.sort((a, b) => SEV_RANK[a.severity] - SEV_RANK[b.severity] || a.criteriaId.localeCompare(b.criteriaId, undefined, { numeric: true }));
  return units;
}

// One backlog item: criterion heading, fix, and a checklist of occurrences.
function unitBlock(unit: PrdUnit, lang: Lang, heading: string): string[] {
  const s = L[lang];
  const out: string[] = [];
  const refs = unit.refs.length ? `  ·  WCAG ${unit.refs.join(", ")}` : "";
  out.push(`${heading} ${ICON[unit.severity]} ${unit.label}${refs}`, "");
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
export function renderBacklog(r: AuditResult, lang: Lang = "en", standard: StandardId = "wcag"): string {
  const s = L[lang];
  const units = prdUnits(r, standard, lang);
  const out = header(r, lang, s.title(stdLabel(standard)));
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
  name: string;
  content: string;
}

/** One standalone PRD document per criterion (for `--split criterion`). */
export function renderPerCriterion(r: AuditResult, lang: Lang = "en", standard: StandardId = "wcag"): PrdFile[] {
  const s = L[lang];
  return prdUnits(r, standard, lang).map((u) => {
    const out = header(r, lang, s.prdTitle(u.label));
    out.push(...unitBlock(u, lang, "##"));
    return { name: `prd-${u.criteriaId}-${r.date}.md`, content: out.join("\n") };
  });
}

export interface PrdOpts {
  out: string;
  lang: Lang;
  split?: "criterion";
  standard: StandardId;
}

/** Render and write the PRD markdown; returns the written path(s). */
export function writePrd(r: AuditResult, opts: PrdOpts): string[] {
  mkdirSync(opts.out, { recursive: true });
  if (opts.split === "criterion") {
    const paths: string[] = [];
    for (const f of renderPerCriterion(r, opts.lang, opts.standard)) {
      const p = join(opts.out, f.name);
      writeFileSync(p, f.content);
      paths.push(p);
    }
    return paths;
  }
  const p = join(opts.out, `prd-${r.date}.md`);
  writeFileSync(p, renderBacklog(r, opts.lang, opts.standard));
  return [p];
}
