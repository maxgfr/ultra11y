// Regression-only gating for the repo automation (`init` hook / CI). A finding's
// identity is (ruleId, criteriaId, file, source-range) — NOT line/col (drifts on
// every edit) and NOT selectorHint (ambiguous). NEW findings are those in the
// current audit absent from the committed baseline; the gate fails only on new
// findings at/above `--fail-on`, so the existing backlog never blocks a commit.
import type { AuditResult, Finding, Severity } from "./types.js";

const RANK: Record<Severity, number> = { bloquant: 0, majeur: 1, mineur: 2 };

/** Stable identity surviving line drift: prefer source byte range, else fall back
 *  to line/col + selector (JSX/stdin findings, which carry no offsets). */
export function findingId(f: Finding): string {
  const pos = f.sourceStart !== undefined ? `b${f.sourceStart}-${f.sourceEnd}` : `l${f.line}:${f.col}:${f.selectorHint}`;
  return `${f.ruleId}|${f.criteriaId}|${f.file}|${pos}`;
}

// Accept English aliases (blocking|major|minor) on input — the tool is English-first —
// while the internal Severity union stays fr (bloquant|majeur|mineur). STRICT: an
// unrecognized value returns null (the caller reports and exits) rather than silently
// degrading to "bloquant" — a `--fail-on majr` typo must not weaken the gate.
export function parseFailOn(v: string | boolean | undefined): Severity | null {
  if (v === undefined || v === true) return "bloquant"; // flag absent, or present with no value → default
  if (v === "bloquant" || v === "blocking") return "bloquant";
  if (v === "majeur" || v === "major") return "majeur";
  if (v === "mineur" || v === "minor") return "mineur";
  return null; // unrecognized token
}

/** Findings at or above a severity threshold — the standalone `audit --fail-on`
 *  gate (no baseline): unlike diffAgainstBaseline this counts ALL findings, not
 *  just newly-introduced ones. */
export function findingsAtOrAbove(findings: Finding[], failOn: Severity): Finding[] {
  return findings.filter((f) => RANK[f.severity] <= RANK[failOn]);
}

export interface BaselineDiff {
  newFindings: Finding[];
  fixedFindings: Finding[];
  ok: boolean; // no NEW finding at/above failOn
  failOn: Severity;
}

export function diffAgainstBaseline(current: AuditResult, baseline: AuditResult | null, failOn: Severity = "bloquant"): BaselineDiff {
  const baseIds = new Set((baseline?.findings ?? []).map(findingId));
  const curIds = new Set(current.findings.map(findingId));
  const newFindings = current.findings.filter((f) => !baseIds.has(findingId(f)));
  // "fixed" is informational; scope it to files the current run actually touched
  // (present in current findings) so unchanged files in --changed mode are never
  // mis-reported as "fixed".
  const auditedFiles = new Set(current.findings.map((f) => f.file));
  const fixedFindings = (baseline?.findings ?? []).filter((f) => auditedFiles.has(f.file) && !curIds.has(findingId(f)));
  const ok = !newFindings.some((f) => RANK[f.severity] <= RANK[failOn]);
  return { newFindings, fixedFindings, ok, failOn };
}

/** Human gate report for the CLI / hook output. */
export function baselineSummary(diff: BaselineDiff, lang: "fr" | "en" = "fr"): string {
  const out: string[] = [];
  const blocking = diff.newFindings.filter((f) => RANK[f.severity] <= RANK[diff.failOn]);
  if (diff.ok) {
    out.push(
      lang === "fr"
        ? `✓ Aucune nouvelle non-conformité ≥ ${diff.failOn} (${diff.newFindings.length} nouvelle(s) au total, ${diff.fixedFindings.length} corrigée(s)).`
        : `✓ No new non-conformity ≥ ${diff.failOn} (${diff.newFindings.length} new total, ${diff.fixedFindings.length} fixed).`,
    );
  } else {
    out.push(
      lang === "fr"
        ? `✗ ${blocking.length} nouvelle(s) non-conformité(s) ≥ ${diff.failOn} introduite(s) :`
        : `✗ ${blocking.length} new non-conformity(ies) ≥ ${diff.failOn} introduced:`,
    );
    for (const f of blocking) out.push(`  [${f.severity}] ${f.ruleId} (WCAG ${f.criteriaId}) — ${f.file}:${f.line} (${f.selectorHint})`);
  }
  return out.join("\n");
}
