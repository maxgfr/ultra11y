// The AUDITOR conformance block — the DEFAULT rendering of `prd` (backlog + per-criterion)
// and of the GitHub issues it files. Where `renderBacklog`/`issueBody` (prd.ts/gh.ts) speak
// to a developer (Fix / Effort / Occurrences), this speaks to an accessibility AUDITOR: per
// criterion it states the theme, the criterion + its official wording, the test(s), the WCAG
// mapping + level, the finding (non-conformity), the expected conformant state, and a
// verification method. Crucially it renders with the ACTIVE STANDARD's vocabulary
// (src/standards/vocabulary.ts): RGAA reads "Thématique / Critère / Test / C-NC-NA", the WCAG
// core reads "Principle · Guideline / Success criterion / Technique / Pass-Fail", and any
// future country pack reads its own — no term is hardcoded to one standard.
import type { AuditResult, Lang, Severity } from "./types.js";
import { prdUnits, type PrdUnit, type PrdFile } from "./prd.js";
import { getSC, guidelineTitle, principleTitle, techniques as scTechniques } from "./wcag.js";
import { resolveMessage, resolveRemediation, resolveNote } from "./messages.js";
import { type StandardId, isCore, loadPack, standardLabel, themeName, vocabularyFor } from "./standards/index.js";

const SEV_ORDER: Severity[] = ["bloquant", "majeur", "mineur"];
const ICON: Record<Severity, string> = { bloquant: "🔴", majeur: "🟠", mineur: "🟡" };
const SEV_LABEL: Record<Lang, Record<Severity, string>> = {
  fr: { bloquant: "Bloquant", majeur: "Majeur", mineur: "Mineur" },
  en: { bloquant: "Blocking", majeur: "Major", mineur: "Minor" },
};

// Generic (standard-agnostic) auditor labels; the standard-specific NOUNS come from the
// resolved vocabulary. Kept separate so a pack overrides only its terminology, not the
// auditor frame.
const L = {
  fr: {
    lead: "Lecture auditeur",
    tail: "Correspondance normative.",
    finding: "Constat",
    expected: "Attendu",
    verification: "Vérification",
    occ: "occurrence(s)",
    verify: "contrôler chaque occurrence ci-dessous (inspecteur / lecteur d'écran), puis rejouer l'audit (`ultra11y` / axe).",
    intro:
      "Lecture auditeur : une entrée par critère non conforme (constat, attendu, méthode de vérification). Les critères « à évaluer » (rendu / jugement) restent à compléter par une revue humaine.",
    date: "Date",
    scope: "Périmètre",
    files: "fichier(s)",
    none: "Aucune non-conformité relevée automatiquement par le moteur statique.",
  },
  en: {
    lead: "Auditor view",
    tail: "Normative mapping.",
    finding: "Finding",
    expected: "Expected",
    verification: "Verification",
    occ: "occurrence(s)",
    verify: "check each occurrence below (inspector / screen reader), then re-run the audit (`ultra11y` / axe).",
    intro:
      "Auditor view: one entry per non-conforming criterion (finding, expected state, verification method). The “to assess” criteria (rendering / judgment) remain for a human review.",
    date: "Date",
    scope: "Scope",
    files: "file(s)",
    none: "No non-conformity found automatically by the static engine.",
  },
} as const;

const uniq = (xs: string[]): string[] => [...new Set(xs.filter(Boolean))];

export interface AuditorUnitOpts {
  heading?: string; // "###"/"##" → emit a criterion heading; omit for a bare issue body
}

/** The auditor block for ONE criterion (a PrdUnit), localized and rendered with the active
 *  standard's vocabulary. Returns lines (caller joins). */
export function renderAuditorUnit(unit: PrdUnit, standard: StandardId, lang: Lang, opts: AuditorUnitOpts = {}): string[] {
  const s = L[lang];
  const v = vocabularyFor(standard, lang);
  const out: string[] = [];
  if (opts.heading) out.push(`${opts.heading} ${ICON[unit.severity]} ${unit.label}`, "");
  out.push(`> ${v.normativeNote ?? `${s.lead} — ${standardLabel(standard)}. ${s.tail}`}`, "");

  if (isCore(standard)) {
    const sc = getSC(unit.criteriaId);
    if (sc) {
      const pr = `${sc.principle} ${principleTitle(sc.principle, lang) ?? ""}`.trim();
      const gl = `${sc.guideline} ${guidelineTitle(sc.guideline, lang) ?? ""}`.trim();
      out.push(`**${v.theme}** : ${[pr, gl].filter(Boolean).join(" · ")}`);
    }
    out.push(`**${v.criterion}** : ${unit.criteriaId}${sc ? ` — ${unit.title}` : ""}`);
    const techs = scTechniques(unit.criteriaId);
    if (techs.length) out.push(`**${v.test}** : ${techs.slice(0, 12).join(", ")}${techs.length > 12 ? ", …" : ""}`);
    out.push(`**WCAG** : ${unit.criteriaId}${sc ? ` (${sc.level})` : ""}`);
  } else {
    const pack = loadPack(standard);
    const pc = pack.criteria.find((c) => c.id === unit.criteriaId);
    if (pc) out.push(`**${v.theme}** : ${pc.theme}. ${themeName(pack, pc.theme, lang) ?? ""}`.trimEnd());
    out.push(`**${v.criterion}** : ${unit.criteriaId} — ${unit.title}`);
    const testNums = pc?.tests ? Object.keys(pc.tests).map((k) => `${unit.criteriaId}.${k}`) : [];
    if (testNums.length) out.push(`**${v.test}(s)** : ${testNums.join(" · ")}`);
    if (unit.refs.length) out.push(`**WCAG** : ${unit.refs.map((sc) => `${sc}${scLevel(sc)}`).join(" · ")}`);
  }

  const messages = uniq(unit.findings.map((f) => resolveMessage(f, lang)));
  const fixes = uniq(unit.findings.map((f) => resolveRemediation(f, lang)));
  out.push("");
  out.push(`**${s.finding} (${v.nonConformant})** : ${unit.findings.length} ${s.occ} — ${messages.join(" ; ")}`);
  if (fixes.length) out.push(`**${s.expected} (${v.conformant})** : ${fixes.join(" ; ")}`);
  out.push(`**${s.verification}** : ${s.verify}`, "");

  for (const f of unit.findings) {
    out.push(`- [ ] \`${f.file}:${f.line}\` (\`${f.selectorHint}\`) — ${resolveMessage(f, lang)}`);
    if (f.related) out.push(`  - ↳ ${resolveNote(f.related, lang)} : \`${f.related.file}:${f.related.line}\` (\`${f.related.selectorHint}\`)`);
  }
  out.push("");
  return out;
}

function scLevel(sc: string): string {
  const c = getSC(sc);
  return c ? ` (${c.level})` : "";
}

function auditorHeader(r: AuditResult, lang: Lang, standard: StandardId): string[] {
  const s = L[lang];
  const v = vocabularyFor(standard, lang);
  return [
    `# ${v.auditorHeading} — ${standardLabel(standard)}`,
    "",
    `- **${s.date}** : ${r.date}`,
    `- **${s.scope}** : ${r.scope.files} ${s.files} — ${r.scope.inputs.join(", ")}`,
    "",
    `> ${s.intro}`,
    "",
  ];
}

/** A single auditor backlog, sectioned by priority (bloquant → majeur → mineur). Default `prd`. */
export function renderAuditorBacklog(r: AuditResult, lang: Lang = "en", standard: StandardId = "wcag"): string {
  const s = L[lang];
  const units = prdUnits(r, standard, lang);
  const out = auditorHeader(r, lang, standard);
  if (!units.length) {
    out.push(s.none, "");
    return out.join("\n");
  }
  for (const sev of SEV_ORDER) {
    const group = units.filter((u) => u.severity === sev);
    if (!group.length) continue;
    out.push(`## ${ICON[sev]} ${SEV_LABEL[lang][sev]} (${group.length})`, "");
    for (const u of group) out.push(...renderAuditorUnit(u, standard, lang, { heading: "###" }));
  }
  return out.join("\n");
}

/** One standalone auditor document per criterion (`prd --split criterion`). */
export function renderAuditorPerCriterion(r: AuditResult, lang: Lang = "en", standard: StandardId = "wcag"): PrdFile[] {
  return prdUnits(r, standard, lang).map((u) => {
    const out = auditorHeader(r, lang, standard);
    out.push(...renderAuditorUnit(u, standard, lang, { heading: "##" }));
    return { name: `prd-${u.criteriaId}-${r.date}.md`, content: out.join("\n") };
  });
}
