// `verify` — the high-assurance gate above `check`. Turns a report's
// non-conformities into a claim↔criterion↔element worklist for adversarial
// support-checking, then (--apply) reduces a filled worklist to pass/fail:
// any refuted/unsupported (or unadjudicated) claim fails the gate. Guards against
// fabricated non-conformities surviving into the final report.
import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import type { Lang } from "./types.js";
import { getSC, scTitle } from "./wcag.js";
import { type StandardId, isCore, loadPack, getCriterion as getPackCriterion, idCaptureSource } from "./standards/index.js";

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

// ---- CURRENT shape (Phase 4): report.ts §2 renders one auditor block per NC
// criterion (src/auditor.ts `renderAuditorUnit`) — a "#### <icon> <label>" heading,
// a "**<criterion term>** : <id>[ — <title>]" line, then a checklist of
// "- [ ] `file:line` (`sel`) — message" occurrences (one per finding). The id is
// stated ONCE per criterion (not per occurrence, unlike the legacy shape below), so
// parsing tracks the "current criterion" as it walks the lines. ----

/** The auditor block's criterion line. Deliberately does NOT anchor on the label
 *  TEXT ("Critère"/"Success criterion"/"Critère de succès"/…) — that's the active
 *  standard's vocabulary (src/standards/vocabulary.ts) and varies per pack/lang.
 *  Matches ANY bold label, keying only on the id + the em-dash grammar, end-of-line
 *  anchored so a pack's (possibly shorter) id pattern can never partial-match inside
 *  a longer line, e.g. "**WCAG** : 2.4.7 (A)" (no trailing em-dash there). */
function auditorCriterionLine(standard: StandardId): RegExp {
  const id = isCore(standard) ? "\\d{1,2}(?:\\.\\d{1,2}){2}" : idCaptureSource(loadPack(standard));
  return new RegExp(`^\\*\\*[^*:]+\\*\\*\\s*:\\s*(${id})(?:\\s*—.*)?\\s*$`);
}

// One checklist occurrence line under a criterion block.
const AUDITOR_OCCURRENCE = /^-\s\[ \]\s+`([^`]+):(\d+)`\s+\(`([^`]*)`\)\s+—\s+(.*)$/;
// Any markdown heading (##/###/####) — leaving one resets the "current criterion" so
// an occurrence-shaped line elsewhere in the document can never be mis-attributed.
const HEADING_LINE = /^#{2,4}\s/;

function buildWorklistFromAuditorBlocks(reportMd: string, standard: StandardId, max: number): VerifyItem[] {
  const items: VerifyItem[] = [];
  const critLine = auditorCriterionLine(standard);
  const lines = reportMd.split("\n");
  let currentId: string | null = null;
  for (let i = 0; i < lines.length && items.length < max; i++) {
    const line = lines[i]!;
    const c = critLine.exec(line);
    if (c) {
      currentId = c[1]!;
      continue;
    }
    if (HEADING_LINE.test(line)) {
      currentId = null;
      continue;
    }
    if (!currentId) continue;
    const occ = AUDITOR_OCCURRENCE.exec(line);
    if (!occ) continue;
    items.push({ n: items.length + 1, criteriaId: currentId, file: occ[1]!, line: Number(occ[2]), selector: occ[3]!, claim: occ[4]!, verdict: null, note: "" });
  }
  return items;
}

// ---- LEGACY shape (pre-Phase-4 reports): report.ts §2 used to render one FLAT
// bullet per finding, "- **<id> — <title>** — `file:line` (`sel`)" followed by a
// plain-message sub-bullet. Kept as a fallback ONLY — a report produced by an older
// ultra11y version (or re-rendered from an old on-disk report.md) must still verify,
// never silently produce a 0-item (un-gated) worklist. ----
function legacyNcHeader(standard: StandardId): RegExp {
  const id = isCore(standard) ? "\\d{1,2}(?:\\.\\d{1,2}){2}" : idCaptureSource(loadPack(standard));
  return new RegExp(`^- \\*\\*(?:[A-Za-z]+ )?(${id}) — (.*?)\\*\\* — \`([^\`]+):(\\d+)\` \\(\`([^\`]*)\`\\)`);
}

function buildWorklistLegacy(reportMd: string, standard: StandardId, max: number): VerifyItem[] {
  const items: VerifyItem[] = [];
  const header = legacyNcHeader(standard);
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

/** Turn a report's non-conformities into a claim↔criterion↔element worklist for
 *  adversarial support-checking. Parses the CURRENT auditor-block NC shape first
 *  (see `buildWorklistFromAuditorBlocks`); if that finds nothing, falls back to the
 *  LEGACY flat-bullet shape (`buildWorklistLegacy`) so an older report still verifies.
 *  The two shapes are structurally disjoint (legacy bullets start with "- **", the
 *  new checklist items with "- [ ] "), so there is no ambiguity about which parsed. */
export function buildWorklist(reportMd: string, standard: StandardId = "wcag", max = VERIFY_MAX): VerifyItem[] {
  const items = buildWorklistFromAuditorBlocks(reportMd, standard, max);
  if (items.length) return items;
  return buildWorklistLegacy(reportMd, standard, max);
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
    moreTests: (n: number, id: string) => `… +${n} autre(s) test(s) — voir \`criteria --standard <pack> ${id}\``,
    checklistTitle: "## Liste de contrôle avant clôture",
    checklist: [
      "- [ ] Chaque entrée porte un verdict (aucun `null`).",
      "- [ ] Aucune non-conformité inventée : chaque verdict `supported` cite un élément réel à la ligne indiquée.",
      "- [ ] Non-conformité UNIQUEMENT si un test précis du référentiel actif échoue — citez-le. Une bonne pratique sans test normatif est une recommandation ; une simple préoccupation UX n'est ni l'un ni l'autre.",
      "- [ ] Les critères « à évaluer » (rendu / jugement) ont été adjugés par l'agent (`verify --manual` → `--apply`), ou laissés en risque résiduel explicite (rendu → `scan`).",
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
    moreTests: (n: number, id: string) => `… +${n} more test(s) — see \`criteria --standard <pack> ${id}\``,
    checklistTitle: "## Pre-completion checklist",
    checklist: [
      "- [ ] Every entry has a verdict (no `null`).",
      "- [ ] No invented non-conformity: every `supported` verdict cites a real element at the given line.",
      "- [ ] Report NC ONLY if a precise test of the active standard fails — cite it. A good practice without a normative test is a recommendation; a purely UX concern is neither.",
      "- [ ] The “to assess” criteria (rendering / judgment) have been adjudicated by the agent (`verify --manual` → `--apply`), or left as an explicit residual risk (rendering → `scan`).",
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
        out.push(`      WCAG ${sc.sc} — ${scTitle(sc.sc, lang)} [${sc.level}] · ${s.understand}: ${sc.understanding}`);
        if (sc.techniques?.length) out.push(`      Techniques: ${sc.techniques.join(", ")}`);
      }
    } else if (pack) {
      const c = getPackCriterion(pack, it.criteriaId);
      const tests = Object.values(c?.tests ?? {}).flat();
      if (tests.length) {
        out.push(`      ${pack.name} ${it.criteriaId} :`);
        for (const test of tests.slice(0, 6)) out.push(`      - ${plain(test)}`);
        // Honest overflow count instead of a silent drop — point at the full list.
        if (tests.length > 6) out.push(`      - ${s.moreTests(tests.length - 6, it.criteriaId)}`);
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
  missing: number; // report NCs with no verdict at all (coverage gap) — only when `expected` is given
  failures: VerifyItem[];
}

const itemKey = (it: VerifyItem): string => `${it.criteriaId}|${it.file}|${it.line}|${it.selector}`;

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

/** Adjudicate a verdicts file. When `expected` (the worklist derived from the report via
 *  buildWorklist) is provided, ALSO fail on any report NC the verdicts file does not cover
 *  — so a truncated/empty verdicts set can't slip a to-be-refuted finding past the gate. */
export function applyVerdicts(items: VerifyItem[], expected?: VerifyItem[]): ApplyResult {
  let refuted = 0;
  let unsupported = 0;
  let unadjudicated = 0;
  let invalid = 0;
  let missing = 0;
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
  if (expected) {
    const covered = new Set(items.map(itemKey));
    for (const e of expected) {
      if (!covered.has(itemKey(e))) {
        failures.push(e);
        missing++;
      }
    }
  }
  const total = expected ? expected.length : items.length;
  return { ok: failures.length === 0, total, refuted, unsupported, unadjudicated, invalid, missing, failures };
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
