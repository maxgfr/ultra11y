// Optional GitHub issue creation for `prd --gh-issues`. Shells out to the `gh`
// CLI (which handles its own auth) — NO npm dependency, no tokens in ultra11y.
// Everything is best-effort: if gh is absent/unauthenticated, the caller still
// wrote the markdown and we just report that issues were skipped. De-dupes by
// issue title so re-running never creates duplicates.
import { execFileSync } from "node:child_process";
import type { Lang } from "./types.js";
import type { PrdUnit } from "./prd.js";
import { type StandardId, isCore, loadPack } from "./standards/index.js";

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

export function issueBody(unit: PrdUnit, lang: Lang): string {
  const t = lang === "fr" ? { fix: "Correction", occ: "Occurrence(s)", def: "↳ définition" } : { fix: "Fix", occ: "Occurrence(s)", def: "↳ definition" };
  const lines: string[] = [];
  if (unit.refs.length) lines.push(`**WCAG** : ${unit.refs.join(", ")}`, "");
  for (const fx of [...new Set(unit.findings.map((f) => f.remediation))]) lines.push(`**${t.fix}** : ${fx}`);
  lines.push("", `**${t.occ} (${unit.findings.length})**`, "");
  for (const f of unit.findings) {
    lines.push(`- [ ] \`${f.file}:${f.line}\` (\`${f.selectorHint}\`) — ${f.message}`);
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
export function pushIssues(units: PrdUnit[], lang: Lang, standard: StandardId = "wcag"): PushResult {
  const { label, tag } = standardTag(standard);
  const existing = existingIssueTitles();
  const result: PushResult = { created: 0, skipped: 0, failed: 0, createdTitles: [] };
  for (const u of units) {
    const title = issueTitle(u, label);
    if (existing.has(title)) {
      result.skipped++;
      continue;
    }
    if (createIssue(title, issueBody(u, lang), ["accessibility", tag, u.severity])) {
      result.created++;
      result.createdTitles.push(title);
      existing.add(title); // guard against duplicate units in one run
    } else {
      result.failed++;
    }
  }
  return result;
}
