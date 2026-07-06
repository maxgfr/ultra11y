// Optional GitHub issue creation for `prd --gh-issues`. Shells out to the `gh`
// CLI (which handles its own auth) — NO npm dependency, no tokens in ultra11y.
// Everything is best-effort: if gh is absent/unauthenticated, the caller still
// wrote the markdown and we just report that issues were skipped. De-dupes by
// issue title so re-running never creates duplicates.
import { execFileSync } from "node:child_process";
import type { Lang, Severity } from "./types.js";
import type { PrdUnit } from "./prd.js";
import { type StandardId, isCore, loadPack } from "./standards/index.js";
import { renderAuditorUnit } from "./auditor.js";
import { resolveMessage, resolveRemediation } from "./messages.js";

// Issue-body shape: `audit` (DEFAULT) = the auditor conformance block; `remediation` = the
// legacy dev body (WCAG refs / Fix / Occurrences). Mirrors `prd --format`.
export type IssueFormat = "audit" | "remediation";

const SEV_ORDER: Severity[] = ["bloquant", "majeur", "mineur"];
const SEV_RANK: Record<Severity, number> = { bloquant: 0, majeur: 1, mineur: 2 };
const ICON: Record<Severity, string> = { bloquant: "🔴", majeur: "🟠", mineur: "🟡" };
const SEV_LABEL: Record<Lang, Record<Severity, string>> = {
  fr: { bloquant: "Bloquant", majeur: "Majeur", mineur: "Mineur" },
  en: { bloquant: "Blocking", majeur: "Major", mineur: "Minor" },
};

/** Display label + issue tag for the active standard ("WCAG"/"wcag" or a pack's). */
function standardTag(standard: StandardId): { label: string; tag: string } {
  return isCore(standard)
    ? { label: "WCAG", tag: "wcag" }
    : (() => {
        const p = loadPack(standard);
        return { label: p.name, tag: p.key };
      })();
}

function gh(args: string[], input?: string): string {
  return execFileSync("gh", args, { encoding: "utf8", stdio: ["pipe", "pipe", "ignore"], ...(input !== undefined ? { input } : {}) });
}

/** Is the `gh` CLI installed AND authenticated here? */
export function ghAvailable(): boolean {
  try {
    execFileSync("gh", ["auth", "status"], { stdio: "ignore" });
    return true;
  } catch {
    return false;
  }
}

/** One issue per criterion (stable de-dupe grain, regardless of --split). The label
 *  is the active standard ("WCAG" for the core, else the pack name e.g. "RGAA"). */
export function issueTitle(unit: PrdUnit, label = "WCAG"): string {
  return `[a11y] ${label} ${unit.criteriaId} — ${unit.title}`;
}

/** Titles of all existing issues (open + closed), for de-duplication. Empty on any failure. */
export function existingIssueTitles(): Set<string> {
  try {
    const raw = gh(["issue", "list", "--state", "all", "--limit", "1000", "--json", "title"]);
    const arr = JSON.parse(raw) as Array<{ title?: string }>;
    return new Set(arr.map((i) => i.title ?? "").filter(Boolean));
  } catch {
    return new Set();
  }
}

export function issueBody(unit: PrdUnit, lang: Lang, standard: StandardId = "wcag", format: IssueFormat = "audit"): string {
  if (format === "audit") return renderAuditorUnit(unit, standard, lang).join("\n").trimEnd();
  const t = lang === "fr" ? { fix: "Correction", occ: "Occurrence(s)", def: "↳ définition" } : { fix: "Fix", occ: "Occurrence(s)", def: "↳ definition" };
  const lines: string[] = [];
  if (unit.refs.length) lines.push(`**WCAG** : ${unit.refs.join(", ")}`, "");
  for (const fx of [...new Set(unit.findings.map((f) => resolveRemediation(f, lang)))]) lines.push(`**${t.fix}** : ${fx}`);
  lines.push("", `**${t.occ} (${unit.findings.length})**`, "");
  for (const f of unit.findings) {
    lines.push(`- [ ] \`${f.file}:${f.line}\` (\`${f.selectorHint}\`) — ${resolveMessage(f, lang)}`);
    if (f.related) lines.push(`  - ${t.def} : \`${f.related.file}:${f.related.line}\` (\`${f.related.selectorHint}\`)`);
  }
  return lines.join("\n");
}

/** Create one issue. Retries without labels if the labelled call fails (labels may
 *  not exist in the repo). Returns true on success. */
export function createIssue(title: string, body: string, labels: string[]): boolean {
  const base = ["issue", "create", "--title", title, "--body-file", "-"];
  try {
    gh([...base, "--label", labels.join(",")], body);
    return true;
  } catch {
    try {
      gh(base, body);
      return true;
    } catch {
      return false;
    }
  }
}

export interface PushResult {
  created: number;
  skipped: number; // already existed (by title)
  failed: number;
  createdTitles: string[];
}

/** Create a GitHub issue per unit, skipping titles that already exist. */
export function pushIssues(units: PrdUnit[], lang: Lang, standard: StandardId = "wcag", format: IssueFormat = "audit"): PushResult {
  const { label, tag } = standardTag(standard);
  const existing = existingIssueTitles();
  const result: PushResult = { created: 0, skipped: 0, failed: 0, createdTitles: [] };
  for (const u of units) {
    const title = issueTitle(u, label);
    if (existing.has(title)) {
      result.skipped++;
      continue;
    }
    if (createIssue(title, issueBody(u, lang, standard, format), ["accessibility", tag, u.severity])) {
      result.created++;
      result.createdTitles.push(title);
      existing.add(title); // guard against duplicate units in one run
    } else {
      result.failed++;
    }
  }
  return result;
}

/** Stable title for the single consolidated audit issue. No counts/date so re-runs de-dupe. */
export function singleIssueTitle(label = "WCAG"): string {
  return `[a11y] ${label} — Accessibility audit`;
}

/** One consolidated issue body: every criterion, sectioned by severity (blocking → minor),
 *  each criterion reusing the same fix + occurrences block as the per-criterion issues. */
export function singleIssueBody(units: PrdUnit[], lang: Lang, standard: StandardId = "wcag", format: IssueFormat = "audit"): string {
  const { label } = standardTag(standard);
  const intro =
    lang === "fr"
      ? `Audit d'accessibilité ${label} — ${units.length} critère(s) non conforme(s).`
      : `${label} accessibility audit — ${units.length} non-conforming criteria.`;
  const lines: string[] = [intro, ""];
  for (const sev of SEV_ORDER) {
    const group = units.filter((u) => u.severity === sev);
    if (!group.length) continue;
    lines.push(`## ${ICON[sev]} ${SEV_LABEL[lang][sev]} (${group.length})`, "");
    for (const u of group) {
      if (format === "audit") lines.push(...renderAuditorUnit(u, standard, lang, { heading: "###" }));
      else lines.push(`### ${u.label}`, "", issueBody(u, lang, standard, format), "");
    }
  }
  return lines.join("\n");
}

/** Create ONE consolidated issue for the whole audit, de-duped by its stable title and
 *  labelled by the most severe criterion. Mirrors pushIssues' best-effort/skip semantics. */
export function pushSingleIssue(units: PrdUnit[], lang: Lang, standard: StandardId = "wcag", format: IssueFormat = "audit"): PushResult {
  const { label, tag } = standardTag(standard);
  const result: PushResult = { created: 0, skipped: 0, failed: 0, createdTitles: [] };
  if (!units.length) return result;
  const title = singleIssueTitle(label);
  if (existingIssueTitles().has(title)) {
    result.skipped = 1;
    return result;
  }
  const severity = [...units].sort((a, b) => SEV_RANK[a.severity] - SEV_RANK[b.severity])[0]!.severity;
  if (createIssue(title, singleIssueBody(units, lang, standard, format), ["accessibility", tag, severity])) {
    result.created = 1;
    result.createdTitles.push(title);
  } else {
    result.failed = 1;
  }
  return result;
}
