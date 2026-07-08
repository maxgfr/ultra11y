// `adjudicate` — the AI-adjudication workflow for the criteria the static engine cannot
// decide. Where the engine leaves a judgment/needs-rendering success criterion as a
// `manual` residual risk, this turns it into a WORKLIST: one entry per manual criterion,
// pre-loaded with the concrete evidence the engine already captured (every image's alt,
// every link's text + context, literal colour pairs, control labels…). The AI agent reads
// the evidence and records a verdict — C / NC / NA / manual — with a justification (for C
// and NA), a groundable finding (for NC), or a reason (for a still-`manual` residual that
// truly needs a rendered DOM via `scan`, or is genuinely undecidable). `applyAdjudication`
// folds the verdicts back into the audit, FAIL-CLOSED: no null verdict, no unjustified
// C/NA, no ungroundable NC, no reasonless manual, full coverage of the residual set. The
// decisions are the AGENT's, statically, gated — not a deferral to a human.
import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import type { AuditResult, Automatability, Finding, Lang, ResidualRisk, Severity, Status } from "./types.js";
import { SCHEMA_VERSION } from "./types.js";
import { discover } from "./discover.js";
import { readText } from "./util.js";
import { parseSource } from "./parse/source.js";
import { type Doc, type El, elementsByTag, attr, textContent, snippet as elSnippet } from "./parse/html.js";
import { parseInlineStyle } from "./color.js";
import { scTitle, getSC } from "./wcag.js";
import { groundItems, type GroundingSummary } from "./grounding.js";
import type { StandardId } from "./standards/index.js";

/** Cap on evidence items harvested per criterion — bounded so a huge page can't produce an
 *  unreadable worklist; the honest overflow count is recorded in `evidenceTruncated`. */
export const ADJUDICATE_MAX_EVIDENCE = 30;

export interface Evidence {
  file: string;
  line: number;
  selector: string;
  snippet: string;
  note?: string; // extra context the harvester surfaced (e.g. a link's nearest heading)
}

export type CriterionVerdict = "C" | "NC" | "NA" | "manual" | null;

/** An agent-declared non-conformity — same shape a `Finding` needs to render + re-gate. */
export interface AgentFinding {
  file: string;
  line: number;
  selector?: string;
  message: string;
  snippet?: string;
  severity?: Severity;
}

export interface AdjudicationItem {
  criteriaId: string;
  automatability: Automatability;
  title?: string;
  evidence: Evidence[];
  evidenceTruncated?: { shown: number; total: number };
  verdict: CriterionVerdict; // the agent fills this
  justification: string; // REQUIRED for C and NA
  reason: string | null; // REQUIRED for a still-`manual` verdict ("needs-rendered-dom" | "undecidable")
  findings: AgentFinding[]; // REQUIRED (≥1, groundable) for NC
  decidedBy: "agent";
}

export interface AdjudicationFile {
  tool: "ultra11y";
  kind: "adjudication";
  schemaVersion: number;
  standard: StandardId;
  auditDate: string;
  items: AdjudicationItem[];
}

// ---- evidence harvesters ----
// Each harvester answers "for this SC, what did the engine see that the agent needs to
// rule?" — bounded, source-anchored, language-neutral. A criterion with no harvester gets
// an empty-evidence item (the agent decides from source, or leaves it manual with a reason).

const selectorFor = (el: El): string => {
  const id = el.attribs.id ? `#${el.attribs.id}` : "";
  const cls = el.attribs.class ? `.${el.attribs.class.trim().split(/\s+/)[0]}` : "";
  return `${el.tag}${id}${cls}`;
};

const ev = (doc: Doc, el: El, note?: string): Evidence => ({
  file: doc.file,
  line: el.line,
  selector: selectorFor(el),
  snippet: elSnippet(doc, el, 160),
  ...(note ? { note } : {}),
});

/** Nearest preceding heading text — the context a link/control is read in. */
function nearestHeading(doc: Doc, el: El): string | undefined {
  const headings = elementsByTag(doc, "h1", "h2", "h3", "h4", "h5", "h6").filter((h) => h.start < el.start);
  const h = headings[headings.length - 1];
  return h ? textContent(h).trim().slice(0, 80) : undefined;
}

type Harvester = (docs: Doc[]) => Evidence[];

const HARVESTERS: Record<string, Harvester> = {
  // 1.1.1 Non-text Content — every image-like element's text alternative
  "1.1.1": (docs) =>
    docs.flatMap((d) =>
      elementsByTag(d, "img", "svg", "area", "object", "embed", "canvas")
        .concat(d.elements.filter((e) => attr(e, "role") === "img"))
        .filter((e, i, a) => a.indexOf(e) === i)
        .map((e) => ev(d, e, `alt="${attr(e, "alt") ?? ""}" aria-label="${attr(e, "aria-label") ?? ""}"`)),
    ),
  // 2.4.4 Link Purpose (In Context) — link text + destination + nearest heading
  "2.4.4": (docs) =>
    docs.flatMap((d) =>
      elementsByTag(d, "a")
        .filter((e) => attr(e, "href") !== undefined)
        .map((e) => ev(d, e, `text="${textContent(e).trim().slice(0, 60)}" href="${attr(e, "href")}" under="${nearestHeading(d, e) ?? ""}"`)),
    ),
  // 1.4.3 Contrast (Minimum) — literal inline colour pairs (the ones statically visible)
  "1.4.3": (docs) =>
    docs.flatMap((d) =>
      d.elements
        .filter((e) => {
          const st = parseInlineStyle(attr(e, "style") ?? "");
          return st.has("color") || st.has("background-color") || st.has("background");
        })
        .map((e) => {
          const st = parseInlineStyle(attr(e, "style") ?? "");
          return ev(d, e, `color=${st.get("color") ?? "?"} background=${st.get("background-color") ?? st.get("background") ?? "?"}`);
        }),
    ),
  // 2.4.6 Headings and Labels — the heading + label text to judge for descriptiveness
  "2.4.6": (docs) =>
    docs.flatMap((d) =>
      elementsByTag(d, "h1", "h2", "h3", "h4", "h5", "h6", "label", "legend").map((e) => ev(d, e, `text="${textContent(e).trim().slice(0, 60)}"`)),
    ),
  // 3.3.2 Labels or Instructions — controls + their associated labels/placeholders
  "3.3.2": (docs) =>
    docs.flatMap((d) =>
      elementsByTag(d, "input", "select", "textarea").map((e) => {
        const id = attr(e, "id");
        const lbl = id ? elementsByTag(d, "label").find((l) => attr(l, "for") === id) : undefined;
        return ev(
          d,
          e,
          `label="${lbl ? textContent(lbl).trim().slice(0, 40) : ""}" placeholder="${attr(e, "placeholder") ?? ""}" aria-label="${attr(e, "aria-label") ?? ""}"`,
        );
      }),
    ),
  // 1.3.1 Info and Relationships — heading outline + tables (structure to judge)
  "1.3.1": (docs) =>
    docs.flatMap((d) =>
      elementsByTag(d, "h1", "h2", "h3", "h4", "h5", "h6", "table", "ul", "ol", "dl").map((e) =>
        ev(d, e, `<${e.tag}> "${textContent(e).trim().slice(0, 50)}"`),
      ),
    ),
  // 4.1.2 Name, Role, Value — elements carrying a role or ARIA state
  "4.1.2": (docs) =>
    docs.flatMap((d) =>
      d.elements
        .filter((e) => attr(e, "role") !== undefined || Object.keys(e.attribs).some((k) => k.startsWith("aria-")))
        .map((e) => ev(d, e, `role="${attr(e, "role") ?? ""}"`)),
    ),
  // 2.4.3 Focus Order — explicit tabindex values in DOM order
  "2.4.3": (docs) => docs.flatMap((d) => d.elements.filter((e) => attr(e, "tabindex") !== undefined).map((e) => ev(d, e, `tabindex="${attr(e, "tabindex")}"`))),
  // 3.1.2 Language of Parts — element-level lang overrides (not the root <html lang>)
  "3.1.2": (docs) =>
    docs.flatMap((d) => d.elements.filter((e) => e.tag !== "html" && attr(e, "lang") !== undefined).map((e) => ev(d, e, `lang="${attr(e, "lang")}"`))),
};

/** Resolve the audit's scope inputs back to parsed docs (harvesting reads the same files
 *  the audit did — run `verify --manual` from the audit's cwd). Best-effort: unreadable /
 *  vanished files are skipped, exactly like the audit's own read loop. */
function docsForAudit(audit: AuditResult, cwd?: string): Doc[] {
  const inputs = audit.scope.inputs.filter((i) => i !== "-" && i !== "<stdin>");
  if (!inputs.length) return [];
  const { files } = discover(inputs, {});
  const docs: Doc[] = [];
  for (const f of files) {
    try {
      docs.push(parseSource(readText(cwd ? join(cwd, f) : f), f));
    } catch {
      /* unreadable — skip, mirrors runAudit */
    }
  }
  return docs;
}

/** Build the adjudication worklist: one item per residual-risk (manual) criterion, with
 *  its harvested evidence (capped + honestly truncated). */
export function buildAdjudicationWorklist(audit: AuditResult, opts: { cwd?: string; standard?: StandardId } = {}): AdjudicationItem[] {
  const docs = docsForAudit(audit, opts.cwd);
  return audit.residualRisks.map((r: ResidualRisk) => {
    const harvested = HARVESTERS[r.criteriaId]?.(docs) ?? [];
    const evidence = harvested.slice(0, ADJUDICATE_MAX_EVIDENCE);
    return {
      criteriaId: r.criteriaId,
      automatability: r.automatability,
      title: scTitle(r.criteriaId) ?? undefined,
      evidence,
      ...(harvested.length > ADJUDICATE_MAX_EVIDENCE ? { evidenceTruncated: { shown: evidence.length, total: harvested.length } } : {}),
      verdict: null,
      justification: "",
      reason: null,
      findings: [],
      decidedBy: "agent" as const,
    };
  });
}

export interface ApplyAdjudicationResult {
  ok: boolean;
  audit: AuditResult;
  issues: string[];
  applied: number;
  stillManual: number;
  grounding: GroundingSummary;
}

const NC_SEVERITY_DEFAULT: Severity = "majeur";
const MANUAL_REASONS = new Set(["needs-rendered-dom", "undecidable"]);

/** Fold an adjudication file back into the audit. FAIL-CLOSED (see module header). Returns
 *  a NEW AuditResult with the decided statuses, agent findings, recomputed conformancePct,
 *  a shrunk residual set, and the `adjudicated` marker. */
export function applyAdjudication(audit: AuditResult, adj: AdjudicationFile, opts: { cwd?: string } = {}): ApplyAdjudicationResult {
  const issues: string[] = [];
  const byId = new Map(adj.items.map((it) => [it.criteriaId, it]));

  // Coverage: every residual criterion must be adjudicated.
  for (const r of audit.residualRisks) if (!byId.has(r.criteriaId)) issues.push(`criterion ${r.criteriaId}: missing from the adjudication (coverage gap)`);

  // Per-item fail-closed validation.
  const groundInputs: { file: string; line: number; selector?: string; snippet?: string }[] = [];
  for (const it of adj.items) {
    const v = it.verdict;
    if (v === null) {
      issues.push(`criterion ${it.criteriaId}: unadjudicated (verdict is null)`);
    } else if (v === "C" || v === "NA") {
      if (!it.justification || !it.justification.trim()) issues.push(`criterion ${it.criteriaId}: a ${v} verdict requires a justification`);
    } else if (v === "NC") {
      if (!it.findings || it.findings.length === 0) issues.push(`criterion ${it.criteriaId}: an NC verdict requires at least one groundable finding`);
      for (const f of it.findings ?? []) groundInputs.push({ file: f.file, line: f.line, selector: f.selector, snippet: f.snippet });
    } else if (v === "manual") {
      if (!it.reason || !MANUAL_REASONS.has(it.reason))
        issues.push(`criterion ${it.criteriaId}: a manual verdict requires reason ∈ {needs-rendered-dom, undecidable}`);
    } else {
      issues.push(`criterion ${it.criteriaId}: unknown verdict "${String(v)}"`);
    }
  }

  // Content-level grounding of every agent NC finding.
  const grounding = groundItems(groundInputs, { cwd: opts.cwd });
  for (const gi of grounding.issues) issues.push(gi);

  if (issues.length) {
    return { ok: false, audit, issues, applied: 0, stillManual: 0, grounding };
  }

  // Apply: clone the audit, update the decided criteria + append agent findings.
  const next: AuditResult = structuredClone(audit);
  const critById = new Map(next.criteria.map((c) => [c.id, c]));
  const newFindings: Finding[] = [];
  let applied = 0;
  let stillManual = 0;

  for (const it of adj.items) {
    const c = critById.get(it.criteriaId);
    if (!c) continue; // an item for a non-residual criterion — ignore (coverage already gated)
    if (it.verdict === "manual") {
      c.status = "manual";
      c.decidedBy = "agent";
      c.justification = it.reason === "needs-rendered-dom" ? residualScanReason() : residualUndecidableReason();
      stillManual++;
      continue;
    }
    applied++;
    c.status = it.verdict as Status;
    c.decidedBy = "agent";
    if (it.verdict === "C" || it.verdict === "NA") c.justification = it.justification.trim();
    if (it.verdict === "NC") {
      const fs: Finding[] = it.findings.map((f) => agentFinding(it.criteriaId, f));
      c.findings = fs;
      newFindings.push(...fs);
      delete c.justification;
    }
  }

  next.findings = [...next.findings, ...newFindings];
  // Residual set now holds only the still-manual criteria.
  next.residualRisks = next.residualRisks.filter((r) => byId.get(r.criteriaId)?.verdict === "manual");
  recomputeTallies(next);
  next.adjudicated = { date: adj.auditDate, applied, stillManual };
  return { ok: true, audit: next, issues: [], applied, stillManual, grounding };
}

function agentFinding(criteriaId: string, f: AgentFinding): Finding {
  return {
    ruleId: `agent:${criteriaId}`,
    criteriaId,
    file: f.file,
    line: f.line,
    col: 1,
    selectorHint: f.selector ?? "",
    severity: f.severity ?? NC_SEVERITY_DEFAULT,
    message: f.message,
    remediation: getSC(criteriaId)?.understanding ? `See WCAG ${criteriaId}.` : "Address the reported non-conformity.",
    snippet: f.snippet ?? "",
  };
}

/** Recompute guideline tallies + conformancePct after statuses changed. Mirrors the
 *  finalize() logic in src/audit.ts so an adjudicated audit is internally consistent. */
function recomputeTallies(a: AuditResult): void {
  for (const g of a.guidelines) {
    const inG = a.criteria.filter((c) => c.guideline === g.key);
    g.c = inG.filter((c) => c.status === "C").length;
    g.nc = inG.filter((c) => c.status === "NC").length;
    g.na = inG.filter((c) => c.status === "NA").length;
    g.manual = inG.filter((c) => c.status === "manual").length;
  }
  const decided = a.criteria.filter((c) => c.status === "C" || c.status === "NC");
  const conform = decided.filter((c) => c.status === "C").length;
  a.conformancePct = decided.length === 0 ? 100 : Math.round((conform / decided.length) * 100);
}

const residualScanReason = () => "Rendering criterion — decide on the rendered DOM (`scan`).";
const residualUndecidableReason = () => "Left as an explicit residual risk (not decidable from the available evidence).";

// ---- worklist file rendering ----
const T = {
  fr: {
    title: "# Adjudication des critères à évaluer (ultra11y)",
    intro:
      "Pour CHAQUE critère, lisez les évidences ci-dessous (extraites de la source auditée) et attribuez un verdict dans `ADJUDICATE.todo.json` (champ `verdict`) :",
    verdicts: [
      "- `C` — conforme (renseignez `justification`) ;",
      "- `NC` — non conforme (ajoutez au moins un `findings[]` : file/line/message, avec un `snippet` groundable) ;",
      "- `NA` — non applicable (renseignez `justification`) ;",
      "- `manual` — indécidable statiquement (renseignez `reason` : `needs-rendered-dom` → `scan`, ou `undecidable`).",
    ],
    then: "Puis : `ultra11y verify --apply ADJUDICATE.todo.json --in <audit.json> --out <dir>` (échoue si un verdict manque une justification/finding/reason).",
    evidence: "Évidences",
    none: "(aucune évidence automatique — décidez depuis la source, ou laissez `manual` avec une raison)",
  },
  en: {
    title: "# Criteria adjudication (ultra11y)",
    intro: "For EACH criterion, read the evidence below (harvested from the audited source) and set a verdict in `ADJUDICATE.todo.json` (field `verdict`):",
    verdicts: [
      "- `C` — conformant (fill `justification`);",
      "- `NC` — non-conformant (add at least one `findings[]`: file/line/message, with a groundable `snippet`);",
      "- `NA` — not applicable (fill `justification`);",
      "- `manual` — not statically decidable (fill `reason`: `needs-rendered-dom` → `scan`, or `undecidable`).",
    ],
    then: "Then: `ultra11y verify --apply ADJUDICATE.todo.json --in <audit.json> --out <dir>` (fails if any verdict lacks its justification/finding/reason).",
    evidence: "Evidence",
    none: "(no automatic evidence — decide from source, or leave `manual` with a reason)",
  },
} as const;

export function formatAdjudication(items: AdjudicationItem[], lang: Lang = "en"): string {
  const s = T[lang];
  const out: string[] = [s.title, "", s.intro, "", ...s.verdicts, "", s.then, ""];
  for (const it of items) {
    out.push(`## ${it.criteriaId}${it.title ? ` — ${it.title}` : ""}  _(${it.automatability})_`);
    out.push("", `> ${s.evidence} (${it.evidence.length}${it.evidenceTruncated ? ` / ${it.evidenceTruncated.total}` : ""}):`, "");
    if (!it.evidence.length) out.push(s.none, "");
    else {
      for (const e of it.evidence) out.push(`- \`${e.file}:${e.line}\` (\`${e.selector}\`)${e.note ? ` — ${e.note}` : ""}`);
      out.push("");
    }
  }
  return out.join("\n");
}

export interface WriteAdjudicationResult {
  todoPath: string;
  mdPath: string;
  count: number;
}

export function writeAdjudication(
  items: AdjudicationItem[],
  outDir: string,
  opts: { standard: StandardId; auditDate: string; lang?: Lang },
): WriteAdjudicationResult {
  mkdirSync(outDir, { recursive: true });
  const todoPath = join(outDir, "ADJUDICATE.todo.json");
  const mdPath = join(outDir, "ADJUDICATE.md");
  const file: AdjudicationFile = {
    tool: "ultra11y",
    kind: "adjudication",
    schemaVersion: SCHEMA_VERSION,
    standard: opts.standard,
    auditDate: opts.auditDate,
    items,
  };
  writeFileSync(todoPath, JSON.stringify(file, null, 2) + "\n");
  writeFileSync(mdPath, formatAdjudication(items, opts.lang ?? "en"));
  return { todoPath, mdPath, count: items.length };
}
