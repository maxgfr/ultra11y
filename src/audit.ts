// `audit` — run the static engine over the inputs and aggregate findings into an
// AuditResult: a preliminary, engine-only verdict per criterion (C/NC/NA for the
// static criteria it can decide; "manual" for everything needing rendering or
// judgment, surfaced as residual risks). `report` renders this; Claude completes
// the manual criteria.
import type { AuditResult, CriterionResult, Finding, ResidualRisk, Status, ThemeTally } from "./types.js";
import { VERSION, SCHEMA_VERSION } from "./types.js";
import { allCriteria, allThemes, getCriterion } from "./rgaa.js";
import { parseSource } from "./parse/source.js";
import { type Doc, attr, hasAttr } from "./parse/html.js";
import { isFormField } from "./name.js";
import { isFullDocument } from "./rules/rule.js";
import { runRules } from "./rules/registry.js";
import { expandInputs } from "./glob.js";
import { readText, today } from "./util.js";

export interface AuditInput {
  inputs: string[];
  stdin?: string;
  forceJsx?: boolean;
  include?: string[];
  exclude?: string[];
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

export function buildAudit(docs: Doc[], inputs: string[]): AuditResult {
  const findings: Finding[] = [];
  for (const d of docs) findings.push(...runRules(d));

  const byCriterion = new Map<string, Finding[]>();
  for (const f of findings) {
    const arr = byCriterion.get(f.criteriaId) ?? [];
    arr.push(f);
    byCriterion.set(f.criteriaId, arr);
  }

  const criteria: CriterionResult[] = [];
  const residualRisks: ResidualRisk[] = [];

  for (const c of allCriteria()) {
    const fs = byCriterion.get(c.id) ?? [];
    let status: Status;
    let justification: string | undefined;

    if (c.automatability === "static") {
      const pred = APPLICABLE[c.id];
      const applicable = pred ? docs.some((d) => pred(d)) : docs.some((d) => isFullDocument(d));
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
    scope: { inputs, files: docs.length },
    themes,
    criteria,
    findings,
    residualRisks,
    conformancePct,
  };
}

/** Resolve inputs, parse each source, and build the AuditResult. */
export function runAudit(opts: AuditInput): AuditResult {
  const docs: Doc[] = [];
  for (const file of expandInputs(opts.inputs, { include: opts.include, exclude: opts.exclude })) {
    docs.push(parseSource(readText(file), file, { forceJsx: opts.forceJsx }));
  }
  if (opts.inputs.includes("-") && opts.stdin !== undefined) {
    docs.push(parseSource(opts.stdin, "<stdin>", { forceJsx: opts.forceJsx }));
  }
  return buildAudit(docs, opts.inputs);
}

// re-exported so report/check can reuse the criterion lookup without re-importing
export { getCriterion };
