// `audit` — run the static engine over the inputs and aggregate findings into an
// AuditResult: a preliminary, engine-only verdict per criterion (C/NC/NA for the
// static criteria it can decide; "manual" for everything needing rendering or
// judgment, surfaced as residual risks). `report` renders this; Claude completes
// the manual criteria.
import { createHash } from "node:crypto";
import type { AuditResult, CriterionResult, Finding, ResidualRisk, Status, ThemeTally } from "./types.js";
import { VERSION, SCHEMA_VERSION } from "./types.js";
import { allCriteria, allThemes, getCriterion } from "./rgaa.js";
import { parseSource } from "./parse/source.js";
import { type Doc, attr, hasAttr } from "./parse/html.js";
import { isFormField } from "./name.js";
import { isFullDocument } from "./rules/rule.js";
import { runRules } from "./rules/registry.js";
import { runCrossRules } from "./rules/cross-registry.js";
import { buildGraphStreaming } from "./graph/build.js";
import type { DepGraph } from "./graph/graph.js";
import { discover } from "./discover.js";
import { readText, today } from "./util.js";

export type DedupMode = "exact" | "normalized" | "off";

export interface AuditInput {
  inputs: string[];
  stdin?: string;
  forceJsx?: boolean;
  include?: string[];
  exclude?: string[];
  ext?: string[];
  // scale controls
  changed?: boolean; // audit only git-changed files
  since?: string; // git ref to diff against (implies changed)
  dedup?: DedupMode; // collapse identical files to one canonical audit (default exact)
  maxFiles?: number; // hard cap on canonical files audited (logged truncation)
  graph?: boolean; // also run cross-file rules over a dependency graph (--graph)
  onWarn?: (msg: string) => void;
}

const has = (d: Doc, ...tags: string[]): boolean => d.elements.some((e) => tags.includes(e.tag));
const hasAria = (d: Doc): boolean => d.elements.some((e) => hasAttr(e, "role") || Object.keys(e.attribs).some((a) => a.startsWith("aria-")));

// Applicability predicate per static criterion: is there any relevant element to
// check? If not, the criterion is NA rather than a hollow "C".
const APPLICABLE: Record<string, (d: Doc) => boolean> = {
  "1.1": (d) => has(d, "img", "area", "canvas") || d.elements.some((e) => attr(e, "role") === "img"),
  "1.2": (d) => has(d, "img"),
  "2.1": (d) => has(d, "iframe"),
  "4.10": (d) => has(d, "audio", "video"),
  "13.8": (d) => has(d, "audio", "video"),
  "5.4": (d) => has(d, "table"),
  "5.6": (d) => has(d, "table"),
  "5.7": (d) => has(d, "table"),
  "6.2": (d) => d.elements.some((e) => e.tag === "a" && hasAttr(e, "href")),
  "7.1": (d) => hasAria(d) || has(d, "button") || d.elements.some((e) => ["div", "span"].includes(e.tag) && hasAttr(e, "onclick")),
  "7.3": (d) => d.elements.some((e) => ["div", "span"].includes(e.tag) && hasAttr(e, "onclick")),
  "8.2": (d) => isFullDocument(d),
  "8.3": (d) => isFullDocument(d),
  "8.5": (d) => isFullDocument(d),
  "8.7": (d) => d.elements.some((e) => e.tag !== "html" && hasAttr(e, "lang")),
  "9.1": (d) => isFullDocument(d),
  "9.3": (d) => has(d, "ul", "ol", "dl", "li", "dt", "dd"),
  "11.1": (d) => d.elements.some(isFormField),
  "11.6": (d) => has(d, "fieldset"),
  "12.7": (d) => isFullDocument(d) && d.elements.some((e) => e.tag === "a" && (attr(e, "href") ?? "").startsWith("#")),
  "12.8": (d) => d.elements.some((e) => hasAttr(e, "tabindex")),
  "5.8": (d) => has(d, "table"),
};

function residualReason(automatability: string): string {
  return automatability === "needs-rendering"
    ? "Nécessite un rendu (contraste, focus, zoom/reflow) — à vérifier manuellement."
    : "Critère de jugement — à évaluer manuellement avec le contexte.";
}

// Streaming accumulator: parse → run rules → fold → DISCARD each Doc, so the
// engine never holds a whole repo in memory. The only cross-document state is
// (a) the flat findings list (bounded by finding count, not source size) and
// (b) per-criterion applicability, OR-folded across docs (NA only if NO doc made
// the criterion applicable — never because findings happened to be absent).
interface Accum {
  byCriterion: Map<string, Finding[]>;
  applicable: Map<string, boolean>; // static criteria only
  allFindings: Finding[];
  fileCount: number;
  opaqueLibs: Set<string>; // component-library specifiers rendered but not source-analysable
  opaqueFiles: number; // count of source files that render such components
}

// Precompute the static criteria + their applicability predicates once.
const STATIC_PREDS: ReadonlyArray<readonly [string, (d: Doc) => boolean]> = allCriteria()
  .filter((c) => c.automatability === "static")
  .map((c) => [c.id, APPLICABLE[c.id] ?? isFullDocument] as const);

function newAccum(): Accum {
  return { byCriterion: new Map(), applicable: new Map(), allFindings: [], fileCount: 0, opaqueLibs: new Set(), opaqueFiles: 0 };
}

/** Fold one parsed document into the accumulator, then let it be GC'd. When a
 *  graph is supplied, cross-file findings are added and graph-proven false
 *  positives are suppressed (matched by ruleId + line on this same doc). */
export function foldDoc(acc: Accum, doc: Doc, graph?: DepGraph): void {
  let findings = runRules(doc);
  if (graph) {
    const cross = runCrossRules(doc, graph);
    if (cross.suppress.length) {
      findings = findings.filter((f) => !cross.suppress.some((s) => s.ruleId === f.ruleId && s.line === f.line));
    }
    findings = findings.concat(cross.findings);
    // A cross finding is evidence its criterion is applicable here (the per-doc
    // static predicates only know native elements, not resolved components).
    for (const f of cross.findings) acc.applicable.set(f.criteriaId, true);
  }
  for (const f of findings) {
    acc.allFindings.push(f);
    const arr = acc.byCriterion.get(f.criteriaId) ?? [];
    arr.push(f);
    acc.byCriterion.set(f.criteriaId, arr);
  }
  for (const [id, pred] of STATIC_PREDS) {
    if (!acc.applicable.get(id) && pred(doc)) acc.applicable.set(id, true);
  }
  if (doc.opaqueComponents?.length) {
    for (const lib of doc.opaqueComponents) acc.opaqueLibs.add(lib);
    acc.opaqueFiles++;
  }
  acc.fileCount++;
}

interface FinalizeExtra {
  truncated?: { limit: number; total: number; skipped: number };
  dedup?: { canonicalFiles: number; duplicateFiles: number };
}

function finalize(acc: Accum, inputs: string[], extra: FinalizeExtra = {}): AuditResult {
  const criteria: CriterionResult[] = [];
  const residualRisks: ResidualRisk[] = [];

  for (const c of allCriteria()) {
    const fs = acc.byCriterion.get(c.id) ?? [];
    let status: Status;
    let justification: string | undefined;

    if (c.automatability === "static") {
      const applicable = acc.applicable.get(c.id) ?? false;
      if (!applicable) {
        status = "NA";
        justification = "Aucun élément concerné par ce critère dans le périmètre audité.";
      } else if (fs.length > 0) {
        status = "NC";
      } else {
        status = "C";
      }
    } else if (fs.length > 0) {
      // a rule on a needs-rendering / judgment criterion raised a DEFINITE failure
      status = "NC";
    } else {
      // engine can't decide — leave it for the human review
      status = "manual";
      residualRisks.push({ criteriaId: c.id, reason: residualReason(c.automatability), automatability: c.automatability });
    }
    criteria.push({ id: c.id, theme: c.theme, status, findings: fs, ...(justification ? { justification } : {}) });
  }

  const themes: ThemeTally[] = allThemes().map((t) => {
    const inTheme = criteria.filter((c) => c.theme === t.number);
    return {
      number: t.number,
      title: t.name,
      c: inTheme.filter((c) => c.status === "C").length,
      nc: inTheme.filter((c) => c.status === "NC").length,
      na: inTheme.filter((c) => c.status === "NA").length,
      manual: inTheme.filter((c) => c.status === "manual").length,
    };
  });

  const decided = criteria.filter((c) => c.status === "C" || c.status === "NC");
  const conform = decided.filter((c) => c.status === "C").length;
  const conformancePct = decided.length === 0 ? 100 : Math.round((conform / decided.length) * 100);

  return {
    tool: "ultra11y",
    version: VERSION,
    schemaVersion: SCHEMA_VERSION,
    date: today(),
    scope: {
      inputs,
      files: acc.fileCount,
      ...(extra.truncated ? { truncated: extra.truncated } : {}),
      ...(extra.dedup ? { dedup: extra.dedup } : {}),
      ...(acc.opaqueLibs.size ? { rendered: { opaqueLibraries: [...acc.opaqueLibs].sort(), files: acc.opaqueFiles } } : {}),
    },
    themes,
    criteria,
    findings: acc.allFindings,
    residualRisks,
    conformancePct,
  };
}

/** Build an AuditResult from already-parsed docs (eager path; used by tests and
 *  any in-memory caller). The streaming runAudit produces an identical result. */
export function buildAudit(docs: Doc[], inputs: string[]): AuditResult {
  const acc = newAccum();
  for (const d of docs) foldDoc(acc, d);
  return finalize(acc, inputs);
}

function hashContent(content: string, mode: Exclude<DedupMode, "off">): string {
  const norm = mode === "normalized" ? content.replace(/>\s+</g, "><").trim() : content;
  return createHash("sha1").update(norm).digest("hex");
}

/** Resolve inputs and audit them in a single streaming pass: read → (dedup) →
 *  parse → fold → discard. Bounded memory, deterministic order. */
export function runAudit(opts: AuditInput): AuditResult {
  const acc = newAccum();
  // Content dedup is off in --changed mode: a changed file must always be audited,
  // and it could otherwise collapse against an unchanged file we never read.
  const dedupMode: DedupMode = opts.changed || opts.since ? "off" : (opts.dedup ?? "exact");
  const seen = new Set<string>();
  let duplicateFiles = 0;
  let truncated: FinalizeExtra["truncated"];

  const { files } = discover(opts.inputs, {
    include: opts.include,
    exclude: opts.exclude,
    ext: opts.ext,
    changed: opts.changed,
    since: opts.since,
    onWarn: opts.onWarn,
  });

  // Cross-file pass: build the dependency graph over the FULL scope (so a changed
  // file's references resolve into unchanged definitions), then run cross rules in
  // the audit loop below. Off by default — a plain audit is byte-identical.
  let graph: DepGraph | undefined;
  if (opts.graph) {
    const graphFiles = opts.changed || opts.since ? discover(opts.inputs, { include: opts.include, exclude: opts.exclude, ext: opts.ext }).files : files;
    graph = buildGraphStreaming(graphFiles);
  }

  for (let i = 0; i < files.length; i++) {
    if (opts.maxFiles && opts.maxFiles > 0 && acc.fileCount >= opts.maxFiles) {
      // skipped = candidates not audited (reconciles: audited + skipped == total),
      // counting both never-examined files and any read failures along the way.
      const skipped = files.length - acc.fileCount;
      truncated = { limit: opts.maxFiles, total: files.length, skipped };
      opts.onWarn?.(
        `ultra11y: --max-files=${opts.maxFiles} reached; audited ${acc.fileCount}/${files.length} files (highest-priority first). Skipped ${skipped}.`,
      );
      break;
    }
    const file = files[i]!;
    let content: string;
    try {
      content = readText(file);
    } catch {
      continue; // unreadable / vanished between discovery and read
    }
    if (dedupMode !== "off") {
      const h = hashContent(content, dedupMode);
      if (seen.has(h)) {
        duplicateFiles++;
        continue; // identical to an already-audited file — cite the canonical one
      }
      seen.add(h);
    }
    foldDoc(acc, parseSource(content, file, { forceJsx: opts.forceJsx }), graph);
  }

  const canonicalFiles = acc.fileCount;
  // Respect --max-files for stdin too (don't let the stdin doc push past the cap).
  if (opts.inputs.includes("-") && opts.stdin !== undefined && !(opts.maxFiles && opts.maxFiles > 0 && acc.fileCount >= opts.maxFiles)) {
    foldDoc(acc, parseSource(opts.stdin, "<stdin>", { forceJsx: opts.forceJsx }), graph);
  }

  return finalize(acc, opts.inputs, {
    ...(truncated ? { truncated } : {}),
    ...(duplicateFiles > 0 ? { dedup: { canonicalFiles, duplicateFiles } } : {}),
  });
}

// re-exported so report/check can reuse the criterion lookup without re-importing
export { getCriterion };
