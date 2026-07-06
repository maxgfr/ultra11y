// `prd` — turn an AuditResult into an actionable "fixes to do" backlog (Markdown),
// grouped by WCAG success criterion (or, with --standard <pack>, by the pack's
// criteria projected from the WCAG audit). Default: one combined backlog sectioned
// by priority. `--split criterion`: one PRD file per criterion. The same per-criterion
// units feed optional GitHub issue creation (see gh.ts).
import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import type { AuditResult, Finding, Lang, Severity } from "./types.js";
import { getSC, guidelineTitle, scTitle, techniques as scTechniques } from "./wcag.js";
import { resolveMessage, resolveRemediation, resolveNote } from "./messages.js";
import { type StandardId, isCore, loadPack, derivePackResults, standardLabel, themeName, titlePlain as packTitlePlain } from "./standards/index.js";
import { guidanceForWcag, guidanceForCriterion } from "./guidance/index.js";
import type { GuidanceEntry } from "./guidance/types.js";
import { renderAuditorBacklog, renderAuditorPerCriterion } from "./auditor.js";

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
    effort: "Effort estimé",
    avoid: "À éviter",
    recommended: "Recommandé",
    example: "Exemple",
    prdTitle: (label: string) => `PRD — ${label}`,
    epic: "Épopée",
    story: "User story",
    ac: "Critères d'acceptation (Given/When/Then)",
    tasks: "Tâches",
    asUser: "En tant qu'utilisateur en situation de handicap",
    iNeed: (t: string) => `je dois pouvoir compter sur : ${t}`,
    given: "Étant donné",
    when: "Lorsque",
    then: "Alors",
    acWhen: "un utilisateur de technologie d'assistance y accède",
    givenElements: (sel: string) => `les éléments ${sel} concernés`,
    techniques: "Techniques WCAG",
    docNote:
      "Document d'exigences (PRD) généré depuis l'audit statique : une épopée par thème, une user story par critère, des critères d'acceptation ancrés sur les intitulés WCAG. Complétez les critères « à évaluer » par une revue humaine.",
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
    effort: "Estimated effort",
    avoid: "Avoid",
    recommended: "Recommended",
    example: "Example",
    prdTitle: (label: string) => `PRD — ${label}`,
    epic: "Epic",
    story: "User story",
    ac: "Acceptance criteria (Given/When/Then)",
    tasks: "Tasks",
    asUser: "As a user relying on assistive technology",
    iNeed: (t: string) => `I need: ${t}`,
    given: "Given",
    when: "When",
    then: "Then",
    acWhen: "a user of assistive technology reaches them",
    givenElements: (sel: string) => `the affected ${sel} elements`,
    techniques: "WCAG techniques",
    docNote:
      "Product-requirements document generated from the static audit: one epic per theme, one user story per criterion, acceptance criteria anchored to the WCAG success-criterion text. Complete the “to assess” criteria with a human review.",
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
      const title = scTitle(criteriaId, lang);
      units.push({
        criteriaId,
        title: title ?? criteriaId,
        label: title ? `${criteriaId} — ${title}` : criteriaId,
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

const SEV_WEIGHT: Record<Severity, number> = { bloquant: 3, majeur: 2, mineur: 1 };

/** Deterministic effort heuristic: Σ severity weights over the occurrences, bucketed. */
function effortOf(unit: PrdUnit): { bucket: "S" | "M" | "L"; points: number } {
  const points = unit.findings.reduce((sum, f) => sum + SEV_WEIGHT[f.severity], 0);
  return { bucket: points <= 4 ? "S" : points <= 12 ? "M" : "L", points };
}

/** Guidance entries for a unit: by pack criterion (pack view) or WCAG SC (core view),
 *  falling back to the unit's WCAG refs so a pack criterion with no direct entry still
 *  surfaces its SCs' guidance. Stable order, deduped by id. */
export function guidanceFor(unit: PrdUnit, standard: StandardId): GuidanceEntry[] {
  const seen = new Set<string>();
  const out: GuidanceEntry[] = [];
  const push = (es: GuidanceEntry[]) => {
    for (const e of es) {
      if (seen.has(e.id)) continue;
      seen.add(e.id);
      out.push(e);
    }
  };
  if (isCore(standard)) push(guidanceForWcag(unit.criteriaId));
  else {
    push(guidanceForCriterion(standard, unit.criteriaId));
    for (const sc of unit.refs) push(guidanceForWcag(sc));
  }
  return out;
}

/** The first guidance example (before/after) for a unit, rendered as fenced code. */
function guidanceExampleBlock(entries: GuidanceEntry[], lang: Lang): string[] {
  const s = L[lang];
  for (const e of entries) {
    const ex = (e.examples ?? []).find((x) => x.bad || x.good);
    if (!ex) continue;
    const note = ex.note?.[lang] ?? ex.note?.fr ?? ex.note?.en;
    const out: string[] = [`**${s.example}**${note ? ` — ${note}` : ""}`, ""];
    if (ex.bad) out.push(`_${s.avoid} :_`, "```" + ex.lang, ex.bad, "```", "");
    if (ex.good) out.push(`_${s.recommended} :_`, "```" + ex.lang, ex.good, "```", "");
    return out;
  }
  return [];
}

// One backlog item: criterion heading, fix, effort, a guidance example, and the checklist.
function unitBlock(unit: PrdUnit, lang: Lang, heading: string, standard: StandardId): string[] {
  const s = L[lang];
  const out: string[] = [];
  const refs = unit.refs.length ? `  ·  WCAG ${unit.refs.join(", ")}` : "";
  out.push(`${heading} ${ICON[unit.severity]} ${unit.label}${refs}`, "");
  const fixes = [...new Set(unit.findings.map((f) => resolveRemediation(f, lang)))];
  for (const fx of fixes) out.push(`- _${s.fix} :_ ${fx}`);
  const { bucket, points } = effortOf(unit);
  out.push(`- _${s.effort} :_ ${bucket} (${points} pts)`, "");
  out.push(...guidanceExampleBlock(guidanceFor(unit, standard), lang));
  out.push(`**${s.affected} (${unit.findings.length})**`, "");
  for (const f of unit.findings) {
    out.push(`- [ ] \`${f.file}:${f.line}\` (\`${f.selectorHint}\`) — ${resolveMessage(f, lang)}`);
    if (f.related) out.push(`  - ↳ ${resolveNote(f.related, lang)} : \`${f.related.file}:${f.related.line}\` (\`${f.related.selectorHint}\`)`);
  }
  out.push("");
  return out;
}

function header(r: AuditResult, lang: Lang, title: string, note: string = L[lang].note): string[] {
  const s = L[lang];
  return [
    `# ${title}`,
    "",
    `- **${s.date}** : ${r.date}`,
    `- **${s.scope}** : ${r.scope.files} ${s.files} — ${r.scope.inputs.join(", ")}`,
    `- **${s.rate}** : ${r.conformancePct}%`,
    "",
    `> ${note}`,
    "",
  ];
}

/** A single combined backlog, sectioned by priority (bloquant → majeur → mineur). */
export function renderBacklog(r: AuditResult, lang: Lang = "en", standard: StandardId = "wcag"): string {
  const s = L[lang];
  const units = prdUnits(r, standard, lang);
  const out = header(r, lang, s.title(standardLabel(standard)));
  if (!units.length) {
    out.push(s.none, "");
    return out.join("\n");
  }
  for (const sev of SEV_ORDER) {
    const group = units.filter((u) => u.severity === sev);
    if (!group.length) continue;
    out.push(`## ${ICON[sev]} ${s.sev[sev]} (${group.length})`, "");
    for (const u of group) out.push(...unitBlock(u, lang, "###", standard));
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
    out.push(...unitBlock(u, lang, "##", standard));
    return { name: `prd-${u.criteriaId}-${r.date}.md`, content: out.join("\n") };
  });
}

interface DocEpic {
  key: string;
  title: string;
  units: PrdUnit[];
}

/** Group PRD units into epics: by WCAG guideline (core view) or pack theme (pack view). */
function epicsOf(units: PrdUnit[], standard: StandardId, lang: Lang): DocEpic[] {
  const pack = isCore(standard) ? null : loadPack(standard);
  const groups = new Map<string, DocEpic>();
  for (const u of units) {
    let key: string;
    let title: string;
    if (pack) {
      const themeNum = pack.criteria.find((c) => c.id === u.criteriaId)?.theme ?? 0;
      key = String(themeNum).padStart(3, "0");
      title = (themeNum ? themeName(pack, themeNum, lang) : undefined) ?? `#${themeNum}`;
    } else {
      const g = getSC(u.criteriaId)?.guideline ?? u.criteriaId;
      key = g;
      title = `${g} ${guidelineTitle(g, lang) ?? ""}`.trim();
    }
    let epic = groups.get(key);
    if (!epic) {
      epic = { key, title, units: [] };
      groups.set(key, epic);
    }
    epic.units.push(u);
  }
  return [...groups.values()].sort((a, b) => a.key.localeCompare(b.key, undefined, { numeric: true }));
}

/** A product-requirements document: epics by theme, one user story per criterion, with
 *  Given/When/Then acceptance criteria anchored to the real WCAG SC titles + the task list. */
export function renderPrdDoc(r: AuditResult, lang: Lang = "en", standard: StandardId = "wcag"): string {
  const s = L[lang];
  const units = prdUnits(r, standard, lang);
  const out = header(r, lang, s.title(standardLabel(standard)), s.docNote);
  if (!units.length) {
    out.push(s.none, "");
    return out.join("\n");
  }
  for (const epic of epicsOf(units, standard, lang)) {
    out.push(`## ${s.epic} — ${epic.title}`, "");
    for (const u of epic.units) {
      const refs = u.refs.length ? `  ·  WCAG ${u.refs.join(", ")}` : "";
      out.push(`### ${ICON[u.severity]} ${s.story} — ${u.label}${refs}`, "");
      out.push(`> ${s.asUser}, ${s.iNeed(u.title)}.`, "");
      const hints = [...new Set(u.findings.map((f) => `\`${f.selectorHint}\``))].slice(0, 3).join(", ") || "—";
      out.push(`**${s.ac}**`, "");
      const scs = isCore(standard) ? [u.criteriaId] : u.refs;
      for (const sc of scs) {
        const req = scTitle(sc, lang) ?? sc;
        out.push(`- **${s.given}** ${s.givenElements(hints)} · **${s.when}** ${s.acWhen} · **${s.then}** « ${req} » (WCAG ${sc}).`);
      }
      const techs = isCore(standard) ? scTechniques(u.criteriaId) : [...new Set(u.refs.flatMap((sc) => scTechniques(sc)))];
      if (techs.length) out.push("", `_${s.techniques} : ${techs.slice(0, 12).join(", ")}${techs.length > 12 ? ", …" : ""}_`);
      out.push("", `**${s.tasks} (${u.findings.length})**`, "");
      for (const f of u.findings) {
        out.push(`- [ ] \`${f.file}:${f.line}\` (\`${f.selectorHint}\`) — ${resolveMessage(f, lang)}`);
        if (f.related) out.push(`  - ↳ ${resolveNote(f.related, lang)} : \`${f.related.file}:${f.related.line}\``);
      }
      out.push("");
    }
  }
  return out.join("\n");
}

// Output shape: `audit` (DEFAULT) = the auditor conformance block (src/auditor.ts);
// `remediation` = the dev backlog above (kept for back-compat); `doc` = the user-story PRD.
export type PrdFormat = "audit" | "remediation" | "doc";

export interface PrdOpts {
  out: string;
  lang: Lang;
  split?: "criterion";
  format?: PrdFormat;
  standard: StandardId;
}

/** Render and write the PRD markdown; returns the written path(s). */
export function writePrd(r: AuditResult, opts: PrdOpts): string[] {
  mkdirSync(opts.out, { recursive: true });
  if (opts.format === "doc") {
    const p = join(opts.out, `prd-doc-${r.date}.md`);
    writeFileSync(p, renderPrdDoc(r, opts.lang, opts.standard));
    return [p];
  }
  const remediation = opts.format === "remediation";
  const perCriterion = remediation ? renderPerCriterion : renderAuditorPerCriterion;
  const backlog = remediation ? renderBacklog : renderAuditorBacklog;
  if (opts.split === "criterion") {
    const paths: string[] = [];
    for (const f of perCriterion(r, opts.lang, opts.standard)) {
      const p = join(opts.out, f.name);
      writeFileSync(p, f.content);
      paths.push(p);
    }
    return paths;
  }
  const p = join(opts.out, `prd-${r.date}.md`);
  writeFileSync(p, backlog(r, opts.lang, opts.standard));
  return [p];
}
