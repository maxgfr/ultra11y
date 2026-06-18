// `verify` — the high-assurance gate above `check`. Turns a report's
// non-conformities into a claim↔criterion↔element worklist for adversarial
// support-checking, then (--apply) reduces a filled worklist to pass/fail:
// any refuted/unsupported (or unadjudicated) claim fails the gate. Guards against
// fabricated non-conformities surviving into the final report.
import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";

export const VERIFY_MAX = 40;

export type Verdict = "supported" | "partial" | "refuted" | "unsupported" | null;

export interface VerifyItem {
  n: number;
  criteriaId: string;
  file: string;
  line: number;
  selector: string;
  claim: string;
  verdict: Verdict;
  note: string;
}

// matches the section-2 non-conformity header emitted by report.ts
const NC_HEADER = /^- \*\*(\d{1,2}\.\d{1,2}) — (.*?)\*\* — `([^`]+):(\d+)` \(`([^`]*)`\)/;

export function buildWorklist(reportMd: string, max = VERIFY_MAX): VerifyItem[] {
  const items: VerifyItem[] = [];
  const lines = reportMd.split("\n");
  for (let i = 0; i < lines.length && items.length < max; i++) {
    const h = NC_HEADER.exec(lines[i]!);
    if (!h) continue;
    let claim = h[2] ?? "";
    for (let j = i + 1; j < Math.min(i + 4, lines.length); j++) {
      const sub = /^\s+-\s+(.*)$/.exec(lines[j]!);
      if (sub && !sub[1]!.startsWith("_")) {
        claim = sub[1]!;
        break;
      }
    }
    items.push({ n: items.length + 1, criteriaId: h[1]!, file: h[3]!, line: Number(h[4]), selector: h[5]!, claim, verdict: null, note: "" });
  }
  return items;
}

export function formatWorklist(items: VerifyItem[], semantic: boolean): string {
  const out: string[] = [];
  out.push("# Vérification des non-conformités (ultra11y)", "");
  out.push("Pour CHAQUE entrée, ouvrez le fichier à la ligne citée et attribuez un verdict dans");
  out.push("`VERIFY.todo.json` (champ `verdict`), avec une `note` :");
  out.push("");
  out.push("- `supported` — la non-conformité est réelle et correctement rattachée au critère ;");
  out.push("- `partial` — réelle mais le critère/la formulation est imprécis ;");
  out.push("- `refuted` — fausse (l'élément cité est en réalité conforme) ;");
  out.push("- `unsupported` — l'élément cité ne permet pas de trancher.");
  out.push("");
  if (semantic) out.push("> Mode --semantic : vérifiez que l'extrait cité **étaye** réellement la non-conformité.", "");
  out.push(`Puis : \`ultra11y verify --apply VERIFY.todo.json\` (échoue si un verdict est refuted/unsupported).`, "");
  for (const it of items) {
    out.push(`- [ ] #${it.n} **${it.criteriaId}** @ \`${it.file}:${it.line}\` (\`${it.selector}\`) — ${it.claim}`);
  }
  out.push("");
  return out.join("\n");
}

export interface ApplyResult {
  ok: boolean;
  total: number;
  refuted: number;
  unsupported: number;
  unadjudicated: number;
  invalid: number;
  failures: VerifyItem[];
}

// Only these two verdicts clear the gate. Everything else — refuted, unsupported,
// null/unadjudicated, AND any unknown/typo/mis-cased token — must FAIL, so a
// fat-fingered verdict can never produce a false-green gate.
const PASSING: ReadonlySet<string> = new Set(["supported", "partial"]);

/** Canonicalise a stored verdict for gating: trim + lowercase, null if not a
 *  non-empty string. Does not coerce unknown tokens to a valid verdict. */
function normalizeVerdict(v: unknown): string | null {
  if (typeof v !== "string") return null;
  const s = v.trim().toLowerCase();
  return s ? s : null;
}

export function applyVerdicts(items: VerifyItem[]): ApplyResult {
  let refuted = 0;
  let unsupported = 0;
  let unadjudicated = 0;
  let invalid = 0;
  const failures: VerifyItem[] = [];
  for (const it of items) {
    const v = normalizeVerdict(it.verdict);
    if (v !== null && PASSING.has(v)) continue;
    failures.push(it);
    if (v === "refuted") refuted++;
    else if (v === "unsupported") unsupported++;
    else if (v === null) unadjudicated++;
    else invalid++; // unknown/typo token — counted as a failure, not silently passed
  }
  return { ok: failures.length === 0, total: items.length, refuted, unsupported, unadjudicated, invalid, failures };
}

export interface WriteWorklistResult {
  todoPath: string;
  mdPath: string;
  count: number;
}

export function writeWorklist(items: VerifyItem[], outDir: string, semantic: boolean): WriteWorklistResult {
  mkdirSync(outDir, { recursive: true });
  const todoPath = join(outDir, "VERIFY.todo.json");
  const mdPath = join(outDir, "VERIFY.md");
  writeFileSync(todoPath, JSON.stringify(items, null, 2) + "\n");
  writeFileSync(mdPath, formatWorklist(items, semantic));
  return { todoPath, mdPath, count: items.length };
}
