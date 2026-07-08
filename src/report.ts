// `report` — render an AuditResult into a dated compliance report (Markdown). The
// CANONICAL, gated report is WCAG 2.2 Level AA (renderReport). A country standards
// pack (RGAA, …) gets a DERIVED report (renderPackReport) projected from the same
// WCAG-keyed result. Both keep the honest structure: per-guideline/theme synthesis,
// non-conformities, conforming + not-applicable lists, and the manual worklist
// (never silently C).
import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import type { AuditResult, Finding, Lang, Severity, Status } from "./types.js";
import { guidelineTitle, scTitle } from "./wcag.js";
import { prdUnits } from "./prd.js";
import { renderAuditorUnit } from "./auditor.js";
import { type StandardId, CORE, isCore, loadPack, derivePackResults, title as packTitle, themeName, type StandardPack } from "./standards/index.js";

const ICON: Record<Severity, string> = { bloquant: "🔴", majeur: "🟠", mineur: "🟡" };
const SEV_ORDER: Severity[] = ["bloquant", "majeur", "mineur"];

const L = {
  fr: {
    title: (std: string) => `Rapport d'audit d'accessibilité — ${std}`,
    wcagStd: "WCAG 2.2 niveau AA",
    date: "Date",
    tool: "Outil",
    toolNote: "moteur statique — audit préliminaire à compléter par une revue humaine",
    scope: "Périmètre",
    files: "fichier(s)",
    rate: "Taux de réussite automatique (vérifications statiques)",
    rateNote: "sous-ensemble décidable par la machine : C ÷ (C + NC)",
    warn: "Ce rapport couvre le sous-ensemble de critères vérifiables automatiquement. Les critères « à évaluer » (rendu / jugement) doivent être complétés par une revue humaine (voir la dernière section).",
    derived: (std: string) =>
      `Vue dérivée du ${std} : projection des critères de succès WCAG audités sur le référentiel. La vérification d'intégrité (\`check\`/\`verify\`) opère sur le rapport WCAG canonique.`,
    synthTitle: (by: string) => `1. Synthèse par ${by}`,
    byGuideline: "règle WCAG",
    byTheme: "thématique",
    th: (head: string) => [head, "C", "NC", "NA", "À évaluer"],
    total: "Total",
    ncTitle: "2. Non-conformités (par priorité)",
    sev: { bloquant: "Bloquant", majeur: "Majeur", mineur: "Mineur" } as Record<Severity, string>,
    none: "Aucune non-conformité détectée par le moteur statique.",
    cTitle: "3. Critères conformes (C)",
    naTitle: "4. Critères non applicables (NA)",
    manualTitle: "5. Critères à évaluer manuellement (rendu / jugement)",
    manualWarn: "Ne marquez aucun de ces critères « conforme » sans vérification humaine.",
    outOfScope: "Hors périmètre moteur — mappé sur des SC hors WCAG 2.2 AA ; vérification manuelle.",
    scopedOut: "Les non-conformités WCAG relevées concernent des éléments hors du périmètre de ce critère — à évaluer séparément.",
    nothing: "Aucun.",
    dedup: "Dédup",
    canonical: "fichier(s) canonique(s) audité(s)",
    duplicate: "doublon(s) identique(s) ignoré(s)",
    truncated: (l: number, t: number, s: number) =>
      `Périmètre tronqué : ${l}/${t} fichiers audités (priorité d'abord), ${s} ignoré(s). Élargir avec --max-files.`,
    rendered: (n: number, libs: string) =>
      `Verdict source préliminaire : ${n} fichier(s) rendent des composants de bibliothèque (${libs}) dont le HTML produit n'est pas visible en analyse statique. Auditez la sortie de build (\`render\` / \`audit <dist>\`) ou \`scan\` avant de conclure.`,
    sourceTemplate: (n: number, exts: string) =>
      `Verdict source préliminaire : ${n} composant(s) ${exts} audité(s) en SOURCE (template). Les slots, snippets et liaisons dynamiques (:attr, {@render}) sont invisibles en analyse statique — auditez le rendu (\`render\` / \`scan\`) avant de conclure.`,
    captures: (n: number) => `${n} fichier(s) de capture rendus audités à pleine fidélité (DOM réel) — le vrai HTML produit, pas l'appel de composant.`,
    blindSpots: (n: number) =>
      `${n} composant(s) sans capture rendue (angles morts) — audités sur source opaque uniquement ; auditez leur DOM rendu (\`render --setup\`).`,
  },
  en: {
    title: (std: string) => `Accessibility audit report — ${std}`,
    wcagStd: "WCAG 2.2 Level AA",
    date: "Date",
    tool: "Tool",
    toolNote: "static engine — preliminary audit to be completed by a human review",
    scope: "Scope",
    files: "file(s)",
    rate: "Automatic static-check pass rate",
    rateNote: "machine-decidable subset: C ÷ (C + NC)",
    warn: "This report covers the subset of criteria checkable automatically. The “to assess” criteria (rendering / judgment) must be completed by a human review (see the last section).",
    derived: (std: string) =>
      `Derived view of ${std}: the audited WCAG success criteria projected onto this standard. The integrity gates (\`check\`/\`verify\`) operate on the canonical WCAG report.`,
    synthTitle: (by: string) => `1. Synthesis by ${by}`,
    byGuideline: "WCAG guideline",
    byTheme: "theme",
    th: (head: string) => [head, "C", "NC", "NA", "To assess"],
    total: "Total",
    ncTitle: "2. Non-conformities (by priority)",
    sev: { bloquant: "Blocking", majeur: "Major", mineur: "Minor" } as Record<Severity, string>,
    none: "No non-conformity detected by the static engine.",
    cTitle: "3. Conforming criteria (C)",
    naTitle: "4. Not-applicable criteria (NA)",
    manualTitle: "5. Criteria to assess manually (rendering / judgment)",
    manualWarn: "Do not mark any of these criteria “conforming” without a human check.",
    outOfScope: "Out of engine scope — mapped to SCs outside WCAG 2.2 AA; manual verification.",
    scopedOut: "The WCAG failures found concern elements outside this criterion's scope — assess separately.",
    nothing: "None.",
    dedup: "Dedup",
    canonical: "canonical file(s) audited",
    duplicate: "identical duplicate(s) skipped",
    truncated: (l: number, t: number, s: number) => `Scope truncated: ${l}/${t} files audited (highest-priority first), ${s} skipped. Widen with --max-files.`,
    rendered: (n: number, libs: string) =>
      `Preliminary source verdict: ${n} file(s) render component-library components (${libs}) whose produced HTML is invisible to static analysis. Audit the build output (\`render\` / \`audit <dist>\`) or \`scan\` before concluding.`,
    sourceTemplate: (n: number, exts: string) =>
      `Preliminary source verdict: ${n} ${exts} component(s) audited as SOURCE (template). Slots, snippets and dynamic bindings (:attr, {@render}) are invisible to static analysis — audit the rendered output (\`render\` / \`scan\`) before concluding.`,
    captures: (n: number) => `${n} rendered capture file(s) audited at full fidelity (real DOM) — the true produced HTML, not the component call.`,
    blindSpots: (n: number) =>
      `${n} component(s) without a rendered capture (blind spots) — audited from opaque source only; audit their rendered DOM (\`render --setup\`).`,
  },
} as const;

// A normalized row the renderer is agnostic about: one labelled criterion + its status/findings.
interface Row {
  id: string;
  label: string; // "1.4.3 — Contrast (Minimum)" or "RGAA 1.1 — …"
  status: Status;
  findings: Finding[];
  justification?: string;
}

interface Group {
  key: string;
  title: string;
  rows: Row[];
}

// Shared renderer over normalized groups/rows — keeps the WCAG and pack reports identical
// in shape. `groupHead` labels the synthesis column ("WCAG guideline" / "theme"). `standard`
// drives the NC section below (`prdUnits`/`renderAuditorUnit` are standard-aware).
function render(r: AuditResult, lang: Lang, opts: { std: string; groupHead: string; groups: Group[]; standard: StandardId; derivedOf?: string }): string {
  const s = L[lang];
  const out: string[] = [];
  out.push(`# ${s.title(opts.std)}`, "");
  out.push(`- **${s.date}** : ${r.date}`);
  out.push(`- **${s.tool}** : ultra11y v${r.version} (${s.toolNote})`);
  out.push(`- **${s.scope}** : ${r.scope.files} ${s.files} — ${r.scope.inputs.join(", ")}`);
  out.push(`- **${s.rate}** : ${r.conformancePct}% (${s.rateNote})`);
  if (r.scope.dedup) out.push(`- **${s.dedup}** : ${r.scope.dedup.canonicalFiles} ${s.canonical}, ${r.scope.dedup.duplicateFiles} ${s.duplicate}`);
  out.push("", `> ⚠️ ${s.warn}`, "");
  if (opts.derivedOf) out.push(`> ↪️ ${s.derived(opts.derivedOf)}`, "");
  if (r.scope.truncated) out.push(`> ✂️ ${s.truncated(r.scope.truncated.limit, r.scope.truncated.total, r.scope.truncated.skipped)}`, "");
  if (r.scope.rendered) out.push(`> 🧩 ${s.rendered(r.scope.rendered.files, r.scope.rendered.opaqueLibraries.join(", "))}`, "");
  if (r.scope.sourceTemplate) out.push(`> 🧩 ${s.sourceTemplate(r.scope.sourceTemplate.files, r.scope.sourceTemplate.extensions.join(", "))}`, "");
  if (r.scope.captures) out.push(`> ✅ ${s.captures(r.scope.captures.files)}`, "");
  if (r.scope.captureCoverage?.blindSpots.length) out.push(`> ⚠️ ${s.blindSpots(r.scope.captureCoverage.blindSpots.length)}`, "");

  const rows = opts.groups.flatMap((g) => g.rows);

  // 1. synthesis
  const th = s.th(opts.groupHead);
  out.push(`## ${s.synthTitle(opts.groupHead)}`, "");
  out.push(`| ${th.join(" | ")} |`);
  out.push(`|${"---|".repeat(th.length)}`);
  const tot = { c: 0, nc: 0, na: 0, manual: 0 };
  for (const g of opts.groups) {
    const c = g.rows.filter((x) => x.status === "C").length;
    const nc = g.rows.filter((x) => x.status === "NC").length;
    const na = g.rows.filter((x) => x.status === "NA").length;
    const manual = g.rows.filter((x) => x.status === "manual").length;
    out.push(`| ${g.key} ${g.title} | ${c} | ${nc} | ${na} | ${manual} |`);
    tot.c += c;
    tot.nc += nc;
    tot.na += na;
    tot.manual += manual;
  }
  out.push(`| **${s.total}** | **${tot.c}** | **${tot.nc}** | **${tot.na}** | **${tot.manual}** |`, "");

  // 2. non-conformities by priority — one auditor block per NC criterion (core or
  // pack), the SAME human language `prd`/GitHub issues use (src/auditor.ts
  // `renderAuditorUnit`), grouped by severity like `renderAuditorBacklog`. Reuses
  // `prdUnits` so a criterion here is EXACTLY a `prd`/`gh` backlog item — no
  // report-local re-grouping logic, and the two stay impossible to drift apart.
  out.push(`## ${s.ncTitle}`, "");
  const ncUnits = prdUnits(r, opts.standard, lang);
  if (ncUnits.length === 0) {
    out.push(s.none, "");
  } else {
    for (const sev of SEV_ORDER) {
      const group = ncUnits.filter((u) => u.severity === sev);
      if (!group.length) continue;
      out.push(`### ${ICON[sev]} ${s.sev[sev]} (${group.length})`, "");
      for (const u of group) out.push(...renderAuditorUnit(u, opts.standard, lang, { heading: "####" }));
    }
  }

  // 3. conforming
  out.push(`## ${s.cTitle}`, "");
  const conform = rows.filter((x) => x.status === "C");
  out.push(conform.length ? conform.map((x) => `- ${x.label}`).join("\n") : s.nothing, "");

  // 4. not applicable
  out.push(`## ${s.naTitle}`, "");
  const na = rows.filter((x) => x.status === "NA");
  out.push(na.length ? na.map((x) => `- ${x.label}${x.justification ? ` — _${x.justification}_` : ""}`).join("\n") : s.nothing, "");

  // 5. manual worklist
  out.push(`## ${s.manualTitle}`, "", `> ${s.manualWarn}`, "");
  const manual = rows.filter((x) => x.status === "manual");
  out.push(manual.length ? manual.map((x) => `- ${x.label}${x.justification ? ` — _${x.justification}_` : ""}`).join("\n") : s.nothing, "");

  return out.join("\n");
}

/** The canonical, gated WCAG 2.2 AA report. */
export function renderReport(r: AuditResult, lang: Lang = "en"): string {
  const s = L[lang];
  const byGuideline = new Map<string, Row[]>();
  for (const c of r.criteria) {
    const title = scTitle(c.id, lang);
    const row: Row = { id: c.id, label: title ? `${c.id} — ${title}` : c.id, status: c.status, findings: c.findings, justification: c.justification };
    (byGuideline.get(c.guideline) ?? byGuideline.set(c.guideline, []).get(c.guideline)!).push(row);
  }
  // `g.title` on the AuditResult's GuidelineTally is the baked-in English title (kept for
  // JSON back-compat); resolve the localized label from the guideline KEY instead so
  // `--lang fr` renders the French guideline name here too.
  const groups: Group[] = r.guidelines.map((g) => ({ key: g.key, title: guidelineTitle(g.key, lang) ?? g.title, rows: byGuideline.get(g.key) ?? [] }));
  return render(r, lang, { std: s.wcagStd, groupHead: s.byGuideline, groups, standard: CORE });
}

/** A derived report for a country standards pack (RGAA, …), projected from the WCAG audit. */
export function renderPackReport(r: AuditResult, pack: StandardPack, lang: Lang = "en"): string {
  const derived = derivePackResults(r, pack.key);
  const std = `${pack.name} ${pack.baseVersion}`;
  const s = L[lang];
  const naReason =
    lang === "fr" ? "Aucun critère de succès WCAG mappé n'est applicable dans le périmètre." : "No mapped WCAG success criterion is applicable in scope.";
  const byTheme = new Map<number, Row[]>();
  for (const pr of derived) {
    const pc = pack.criteria.find((c) => c.id === pr.id)!;
    const row: Row = {
      id: pr.id,
      label: `${pack.name} ${pr.id} — ${packTitle(pack, pc, lang)}`,
      status: pr.status,
      findings: pr.findings,
      // outOfScope / scopedOut criteria are "manual" (not NA) with their own dedicated
      // justification — never mixed with the ordinary NA reason (see the manual section above).
      ...(pr.outOfScope
        ? { justification: s.outOfScope }
        : pr.scopedOut
          ? { justification: s.scopedOut }
          : pr.status === "NA"
            ? { justification: naReason }
            : {}),
    };
    (byTheme.get(pr.theme) ?? byTheme.set(pr.theme, []).get(pr.theme)!).push(row);
  }
  const groups: Group[] = pack.themes.map((t) => ({ key: `${t.number}.`, title: themeName(pack, t.number, lang) ?? "", rows: byTheme.get(t.number) ?? [] }));
  return render(r, lang, { std, groupHead: L[lang].byTheme, groups, derivedOf: std, standard: pack.key });
}

export interface ReportOpts {
  out: string;
  lang: Lang;
  standard: StandardId;
}

/** Render and write the report; returns the written path. The WCAG report is canonical
 *  (`wcag-<date>.md`); a pack report is a derived `<pack>-<date>.md`. */
export function writeReport(r: AuditResult, opts: ReportOpts): string {
  const core = isCore(opts.standard);
  const md = core ? renderReport(r, opts.lang) : renderPackReport(r, loadPack(opts.standard), opts.lang);
  mkdirSync(opts.out, { recursive: true });
  const path = join(opts.out, `${core ? "wcag" : opts.standard}-${r.date}.md`);
  writeFileSync(path, md);
  return path;
}
