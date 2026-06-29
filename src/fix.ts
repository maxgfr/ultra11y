// `fix` — put the fixes in place. Hybrid by design (anti-hallucination first):
//   • auto codemods are applied deterministically;
//   • placeholders insert a valid attribute with a TODO sentinel the agent fills;
//   • proposals are judgment-only and never auto-written.
// --dry-run (default) prints a unified diff; --write applies, but ONLY after a
// re-audit proves no NEW non-conformity was introduced (regression gate). JSX/TSX
// parsed to a real AST is editable (jsxSafe codemods only); the lossy JSX fallback
// stays proposal-only (its offsets index the transformed string, not the file).
import { writeFileSync } from "node:fs";
import type { Finding, Lang } from "./types.js";
import { discover } from "./discover.js";
import { parseSource } from "./parse/source.js";
import { runRules } from "./rules/registry.js";
import { readText } from "./util.js";
import { applyEdits, type Edit } from "./fix/edits.js";
import { CODEMODS, fixabilityOf, type Fixability } from "./fix/codemods.js";
import { unifiedDiff } from "./fix/diff.js";

export interface FixInput {
  inputs: string[];
  stdin?: string;
  forceJsx?: boolean;
  include?: string[];
  exclude?: string[];
  ext?: string[];
  changed?: boolean;
  since?: string;
  only?: string[]; // limit to these ruleIds
  write?: boolean; // default false → dry-run
  onWarn?: (m: string) => void;
}

export interface FixItem {
  ruleId: string;
  criteriaId: string;
  line: number;
  selectorHint: string;
  fixability: Fixability;
}

export interface FileFix {
  file: string;
  lossy: boolean;
  items: FixItem[];
  diff: string;
  applied: number; // edits applied (auto + placeholder)
  written: boolean;
  regression: boolean; // gate tripped → not written
}

export interface FixResult {
  files: FileFix[];
  totals: { auto: number; placeholder: number; proposal: number; filesWritten: number; regressions: number };
}

function itemOf(f: Finding): FixItem {
  return { ruleId: f.ruleId, criteriaId: f.criteriaId, line: f.line, selectorHint: f.selectorHint, fixability: fixabilityOf(f.ruleId) };
}

function fixOne(file: string, source: string, opts: FixInput): FileFix {
  const doc = parseSource(source, file, { forceJsx: opts.forceJsx });
  const findings = runRules(doc);
  const items = findings.map(itemOf);

  const edits: Edit[] = [];
  // Real-AST docs (HTML or jsx-ast) carry accurate file offsets, so codemods edit
  // by range. On jsx-ast we apply only codemods marked jsxSafe (attribute removal /
  // insertion of React-valid props); name-rewriting codemods stay off so we never
  // turn tabIndex={5} into tabindex="0". The lossy fallback (jsx-lossy) edits nothing.
  const isJsxAst = doc.kind === "jsx-ast";
  if (!doc.lossy) {
    for (const f of findings) {
      if (opts.only && !opts.only.includes(f.ruleId)) continue;
      const cm = CODEMODS[f.ruleId];
      if (!cm?.build || f.sourceStart === undefined) continue;
      if (isJsxAst && !cm.jsxSafe) continue;
      edits.push(...cm.build(source, f.sourceStart));
    }
  } else if (opts.write && findings.some((f) => CODEMODS[f.ruleId]?.build)) {
    opts.onWarn?.(`ultra11y fix: ${file} is JSX/TSX (lossy parse fallback) — fixes are proposal-only here; edit the source by hand.`);
  }

  let diff = "";
  let applied = 0;
  let written = false;
  let regression = false;

  if (edits.length) {
    const { output, applied: n } = applyEdits(source, edits);
    applied = n;
    diff = unifiedDiff(file, source, output);
    // regression gate: re-audit the fixed text; a fix must never add an NC — not
    // just in total count, but also no NEW kind of finding (catches one-NC-for-another
    // swaps, e.g. a bad placeholder value that trips a different rule).
    const after = runRules(parseSource(output, file, { forceJsx: opts.forceJsx }));
    const beforeKinds = new Set(findings.map((f) => f.ruleId));
    regression = after.length > findings.length || after.some((f) => !beforeKinds.has(f.ruleId));
    if (opts.write && !regression && file !== "<stdin>") {
      writeFileSync(file, output);
      written = true;
    }
    if (regression) opts.onWarn?.(`ultra11y fix: ${file} not written — fix would introduce a new non-conformity (regression gate).`);
  }

  return { file, lossy: doc.lossy, items, diff, applied, written, regression };
}

export function runFix(opts: FixInput): FixResult {
  const { files } = discover(opts.inputs, {
    include: opts.include,
    exclude: opts.exclude,
    ext: opts.ext,
    changed: opts.changed,
    since: opts.since,
    onWarn: opts.onWarn,
  });

  const out: FileFix[] = [];
  for (const file of files) {
    let src: string;
    try {
      src = readText(file);
    } catch {
      continue;
    }
    out.push(fixOne(file, src, opts));
  }
  if (opts.inputs.includes("-") && opts.stdin !== undefined) {
    out.push(fixOne("<stdin>", opts.stdin, { ...opts, write: false }));
  }

  const totals = { auto: 0, placeholder: 0, proposal: 0, filesWritten: 0, regressions: 0 };
  for (const ff of out) {
    for (const it of ff.items) totals[it.fixability]++;
    if (ff.written) totals.filesWritten++;
    if (ff.regression) totals.regressions++;
  }
  return { files: out, totals };
}

const FIX_LABEL: Record<Fixability, { fr: string; en: string }> = {
  auto: { fr: "auto", en: "auto" },
  placeholder: { fr: "à compléter", en: "fill-in" },
  proposal: { fr: "jugement", en: "judgment" },
};

/** Human summary for the CLI. */
export function fixSummary(r: FixResult, lang: Lang = "fr", write = false): string {
  const out: string[] = [];
  const t = r.totals;
  const head =
    lang === "fr"
      ? `${write ? "Corrections appliquées" : "Corrections proposées (dry-run)"} : ${t.auto} auto, ${t.placeholder} à compléter, ${t.proposal} jugement · ${t.filesWritten} fichier(s) écrit(s)${t.regressions ? `, ${t.regressions} bloqué(s) par le garde anti-régression` : ""}.`
      : `${write ? "Fixes applied" : "Proposed fixes (dry-run)"}: ${t.auto} auto, ${t.placeholder} fill-in, ${t.proposal} judgment · ${t.filesWritten} file(s) written${t.regressions ? `, ${t.regressions} blocked by the regression gate` : ""}.`;
  out.push(head, "");
  for (const ff of r.files) {
    const fixable = ff.items.filter((i) => i.fixability !== "proposal");
    if (!fixable.length && !ff.items.length) continue;
    out.push(`### ${ff.file}${ff.lossy ? " (JSX/TSX — " + (lang === "fr" ? "proposition seule" : "proposal-only") + ")" : ""}`);
    for (const it of ff.items)
      out.push(`- [${FIX_LABEL[it.fixability][lang]}] ${it.ruleId} (RGAA ${it.criteriaId}) — \`${it.selectorHint}\` @ ${ff.file}:${it.line}`);
    if (ff.diff) out.push("", "```diff", ff.diff, "```");
    if (ff.regression) out.push(`> ⚠️ ${lang === "fr" ? "non écrit : régression détectée" : "not written: regression detected"}`);
    out.push("");
  }
  return out.join("\n");
}
