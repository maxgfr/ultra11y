// `verify` — the high-assurance gate above `check`. Turns a report's
// non-conformities into a claim↔criterion↔element worklist for adversarial
// support-checking, then (--apply) reduces a filled worklist to pass/fail:
// any refuted/unsupported (or unadjudicated) claim fails the gate. Guards against
// fabricated non-conformities surviving into the final report.
import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import type { Lang } from "./types.js";
import { getSC } from "./wcag.js";
import { type StandardId, isCore, loadPack, getCriterion as getPackCriterion } from "./standards/index.js";

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

const plain = (s: string) => s.replace(/\[([^\]]+)\]\(#[^)]*\)/g, "$1");

// matches the section-2 non-conformity header emitted by report.ts. The id is the
// active standard's grammar (WCAG 3-segment "1.4.3" or a pack's 2-segment "8.3",
// optionally prefixed by the pack name, e.g. "RGAA 8.3").
function ncHeader(standard: StandardId): RegExp {
  const id = isCore(standard) ? "\\d{1,2}(?:\\.\\d{1,2}){2}" : "\\d{1,2}\\.\\d{1,2}";
  return new RegExp(`^- \\*\\*(?:[A-Za-z]+ )?(${id}) — (.*?)\\*\\* — \`([^\`]+):(\\d+)\` \\(\`([^\`]*)\`\\)`);
}

export function buildWorklist(reportMd: string, standard: StandardId = "wcag", max = VERIFY_MAX): VerifyItem[] {
  const items: VerifyItem[] = [];
  const header = ncHeader(standard);
  const lines = reportMd.split("\n");
  for (let i = 0; i < lines.length && items.length < max; i++) {
    const h = header.exec(lines[i]!);
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

const T = {
  fr: {
    title: "# Vérification des non-conformités (ultra11y)",
    intro: "Pour CHAQUE entrée, ouvrez le fichier à la ligne citée et attribuez un verdict dans\n`VERIFY.todo.json` (champ `verdict`), avec une `note` :",
    supported: "- `supported` — la non-conformité est réelle et correctement rattachée au critère ;",
    partial: "- `partial` — réelle mais le critère/la formulation est imprécis ;",
    refuted: "- `refuted` — fausse (l'élément cité est en réalité conforme) ;",
    unsupported: "- `unsupported` — l'élément cité ne permet pas de trancher.",
    semantic: "> Mode --semantic : vérifiez que l'extrait cité **étaye** réellement la non-conformité.",
    then: "Puis : `ultra11y verify --apply VERIFY.todo.json` (échoue si un verdict est refuted/unsupported).",
    understand: "Comprendre",
    checklistTitle: "## Liste de contrôle avant clôture",
    checklist: [
      "- [ ] Chaque entrée porte un verdict (aucun `null`).",
      "- [ ] Aucune non-conformité inventée : chaque verdict `supported` cite un élément réel à la ligne indiquée.",
      "- [ ] Les critères « à évaluer » (rendu / jugement) du rapport ont été tranchés (ou laissés en risque résiduel explicite).",
      "- [ ] Pour un code rendu par une bibliothèque (DSFR…), le verdict s'appuie sur le HTML **produit** (build / `scan`), pas sur la source JSX.",
      "- [ ] `ultra11y verify --apply VERIFY.todo.json` repasse au vert.",
    ],
  },
  en: {
    title: "# Non-conformity verification (ultra11y)",
    intro: "For EACH entry, open the file at the cited line and assign a verdict in\n`VERIFY.todo.json` (field `verdict`), with a `note`:",
    supported: "- `supported` — the non-conformity is real and correctly tied to the criterion;",
    partial: "- `partial` — real but the criterion/wording is imprecise;",
    refuted: "- `refuted` — false (the cited element is actually conforming);",
    unsupported: "- `unsupported` — the cited element is not enough to decide.",
    semantic: "> --semantic mode: confirm the cited snippet actually **supports** the non-conformity.",
    then: "Then: `ultra11y verify --apply VERIFY.todo.json` (fails if any verdict is refuted/unsupported).",
    understand: "Understanding",
    checklistTitle: "## Pre-completion checklist",
    checklist: [
      "- [ ] Every entry has a verdict (no `null`).",
      "- [ ] No invented non-conformity: every `supported` verdict cites a real element at the given line.",
      "- [ ] The report's “to assess” criteria (rendering / judgment) have been decided (or left as an explicit residual risk).",
      "- [ ] For component-library-rendered code (DSFR…), the verdict relies on the **produced** HTML (build / `scan`), not the JSX source.",
      "- [ ] `ultra11y verify --apply VERIFY.todo.json` is green again.",
    ],
  },
} as const;

export function formatWorklist(items: VerifyItem[], semantic: boolean, standard: StandardId = "wcag", lang: Lang = "en"): string {
  const s = T[lang];
  const core = isCore(standard);
  const pack = core ? null : loadPack(standard);
  const out: string[] = [];
  out.push(s.title, "");
  out.push(s.intro, "");
  out.push(s.supported, s.partial, s.refuted, s.unsupported, "");
  if (semantic) out.push(s.semantic, "");
  out.push(s.then, "");
  for (const it of items) {
    out.push(`- [ ] #${it.n} **${it.criteriaId}** @ \`${it.file}:${it.line}\` (\`${it.selector}\`) — ${it.claim}`);
    // Ground the judgment in the active standard's reference so the verdict is checked
    // against real conditions, not a guess.
    if (core) {
      const sc = getSC(it.criteriaId);
      if (sc) {
        out.push(`      WCAG ${sc.sc} — ${sc.title} [${sc.level}] · ${s.understand}: ${sc.understanding}`);
        if (sc.techniques?.length) out.push(`      Techniques: ${sc.techniques.slice(0, 8).join(", ")}`);
      }
    } else if (pack) {
      const c = getPackCriterion(pack, it.criteriaId);
      const tests = Object.values(c?.tests ?? {}).flat();
      if (tests.length) {
        out.push(`      ${pack.name} ${it.criteriaId} :`);
        for (const test of tests.slice(0, 6)) out.push(`      - ${plain(test)}`);
      }
    }
  }
  out.push("");
  out.push(s.checklistTitle, "");
  for (const line of s.checklist) out.push(line);
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

export function writeWorklist(items: VerifyItem[], outDir: string, semantic: boolean, standard: StandardId = "wcag", lang: Lang = "en"): WriteWorklistResult {
  mkdirSync(outDir, { recursive: true });
  const todoPath = join(outDir, "VERIFY.todo.json");
  const mdPath = join(outDir, "VERIFY.md");
  writeFileSync(todoPath, JSON.stringify(items, null, 2) + "\n");
  writeFileSync(mdPath, formatWorklist(items, semantic, standard, lang));
  return { todoPath, mdPath, count: items.length };
}
