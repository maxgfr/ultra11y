// `pack` — the standards-pack toolbox and the anti-hallucination GATE for AI-assisted
// ingestion. `pack check <pack.json> [--guidance <g.json>]` validates a pack (via the
// shared validatePack) and, if given, its guidance dataset: every entry must resolve to a
// REAL pack criterion, map to well-formed SCs, and carry code examples that actually
// parse. `pack scaffold` prints a minimal valid StandardPack skeleton to fill in. This is
// how an external rule source (RGAA SocialGouv/etalab, or any other standard) is turned
// into a pack the runtime `--pack` loader can trust: the agent drafts, the gate refuses
// fabrication (a bogus criterion id or SC, or an unparseable example, fails loudly).
import { existsSync } from "node:fs";
import { readText } from "./util.js";
import { validatePack, classifySc } from "./standards/validate.js";
import { getCriterion } from "./standards/pack.js";
import { ruleIds as engineRuleIds } from "./rules/registry.js";
import type { StandardPack } from "./standards/types.js";
import type { GuidanceDataset, GuidanceExample } from "./guidance/types.js";
import { parseHtml } from "./parse/html.js";
import { parseJsxAst } from "./parse/jsx-ast.js";

export interface PackCheckResult {
  ok: boolean;
  errors: string[];
  warnings: string[];
}

/** Confirm a guidance code example actually parses (JSX via the real Babel parser; HTML
 *  via htmlparser2). Returns an error message, or null when it parses. */
function exampleParses(ex: GuidanceExample): string | null {
  for (const code of [ex.bad, ex.good]) {
    if (!code) continue;
    if (ex.lang === "jsx") {
      if (!parseJsxAst(code)) return `unparseable JSX example: ${code.slice(0, 48)}…`;
    } else if (ex.lang === "html") {
      try {
        parseHtml(code, "<guidance>.html", false);
      } catch (e) {
        return `unparseable HTML example (${e instanceof Error ? e.message : String(e)})`;
      }
    }
    // css: the engine only parses inline style — guidance css snippets are not gated.
  }
  return null;
}

/** Validate a guidance dataset against the (already-validated) pack it augments. Shared by
 *  `pack check` and the runtime guidance loader (src/config.ts) so the same gate applies. */
export function checkGuidance(ds: unknown, pack: StandardPack): { errors: string[]; warnings: string[] } {
  const errors: string[] = [];
  const warnings: string[] = [];
  if (typeof ds !== "object" || ds === null || !Array.isArray((ds as GuidanceDataset).entries)) {
    errors.push("guidance: must be an object with an entries[] array");
    return { errors, warnings };
  }
  const dataset = ds as GuidanceDataset;
  if (dataset.pack && dataset.pack !== pack.key) warnings.push(`guidance: dataset.pack "${dataset.pack}" ≠ pack key "${pack.key}"`);
  dataset.entries.forEach((e, i) => {
    const at = `guidance.entries[${i}]${e.id ? ` (${e.id})` : ""}`;
    const crit = e.criterionId ? getCriterion(pack, e.criterionId) : undefined;
    if (!e.criterionId) {
      errors.push(`${at}: criterionId is unresolved — resolve it to a real ${pack.key} criterion (no fabrication)`);
    } else if (!crit) {
      errors.push(`${at}: criterionId "${e.criterionId}" does not exist in ${pack.key}`);
    }
    if (!Array.isArray(e.wcag) || e.wcag.length === 0) {
      errors.push(`${at}: must map to at least one WCAG SC`);
    } else {
      for (const sc of e.wcag) {
        switch (classifySc(sc)) {
          case "malformed":
            errors.push(`${at}: malformed SC "${sc}"`);
            break;
          case "unknown":
            errors.push(`${at}: SC "${sc}" is not a recognized WCAG success criterion — fabricated?`);
            break;
          case "out-of-core":
            warnings.push(`${at}: SC "${sc}" is a real WCAG AAA success criterion, outside the WCAG 2.2 AA core`);
            break;
          case "removed":
            warnings.push(`${at}: SC "${sc}" is a real but removed WCAG success criterion (obsolete)`);
            break;
        }
      }
      if (crit) {
        const extra = e.wcag.filter((sc) => !crit.wcag.includes(sc));
        if (extra.length) warnings.push(`${at}: SC(s) ${extra.join(", ")} not in criterion ${crit.id} mapping (${crit.wcag.join(", ")})`);
      }
    }
    if (!Array.isArray(e.examples) || e.examples.length === 0) {
      warnings.push(`${at}: no code examples`);
    } else {
      e.examples.forEach((ex, j) => {
        const bad = exampleParses(ex);
        if (bad) errors.push(`${at}.examples[${j}]: ${bad}`);
      });
    }
  });
  return { errors, warnings };
}

/** Run `pack check`: validate a pack file and (optionally) its guidance dataset. */
export function runPackCheck(packPath: string, guidancePath: string | undefined): PackCheckResult {
  const errors: string[] = [];
  const warnings: string[] = [];
  if (!existsSync(packPath)) return { ok: false, errors: [`pack file not found: ${packPath}`], warnings };
  let raw: unknown;
  try {
    raw = JSON.parse(readText(packPath));
  } catch {
    return { ok: false, errors: [`${packPath}: not valid JSON`], warnings };
  }
  // Lint the artifact's internal consistency — no registry-collision check (we are
  // checking a file, not registering it), so the built-in rgaa.json passes `pack check`.
  const v = validatePack(raw);
  for (const issue of v.issues) (issue.severity === "error" ? errors : warnings).push(`${issue.path ? `${issue.path}: ` : ""}${issue.message}`);
  // Advisory: an appliesTo ruleId unknown to the engine registry is a WARNING, not a hard
  // error — a pack may target a renamed/future rule, and axe:*/dyn-*/agent:* namespaced ids
  // (dynamic-tier + agent-adjudicated findings) are legitimately outside the static registry.
  if (v.ok && v.pack) {
    const known = new Set(engineRuleIds());
    const isNamespaced = (r: string) => /^(axe:|dyn-|agent:)/.test(r);
    // A pack's OWN declarative rules are legitimate ruleIds (`pack:<key>:<id>`).
    const ownRuleIds = new Set((v.pack.rules ?? []).map((r) => `pack:${v.pack!.key}:${r.id}`));
    const resolvable = (r: string) => isNamespaced(r) || known.has(r) || r.startsWith(`pack:${v.pack!.key}:`) || ownRuleIds.has(r);
    for (const c of v.pack.criteria) {
      for (const r of c.appliesTo?.ruleIds ?? []) {
        if (!resolvable(r)) warnings.push(`criteria "${c.id}": appliesTo ruleId "${r}" is not a known engine rule (renamed/future?)`);
      }
    }
    // Overrides target a finding ruleId — a core engine rule, an axe:/dyn-/agent: id, or
    // one of this pack's own declarative rules. An unresolvable key is advisory (a pack may
    // target a future rule), never a hard error.
    for (const key of Object.keys(v.pack.overrides ?? {})) {
      if (!resolvable(key)) warnings.push(`overrides: ruleId "${key}" is not a known engine rule or a rule of this pack (renamed/future?)`);
    }
  }
  if (v.ok && v.pack && guidancePath) {
    if (!existsSync(guidancePath)) {
      errors.push(`guidance file not found: ${guidancePath}`);
    } else {
      let gRaw: unknown;
      try {
        gRaw = JSON.parse(readText(guidancePath));
      } catch {
        errors.push(`${guidancePath}: not valid JSON`);
      }
      if (gRaw !== undefined) {
        const g = checkGuidance(gRaw, v.pack);
        errors.push(...g.errors);
        warnings.push(...g.warnings);
      }
    }
  }
  return { ok: errors.length === 0, errors, warnings };
}

/** A minimal, valid StandardPack skeleton (for `pack scaffold` — the agent fills it). */
export function packScaffold(): string {
  return JSON.stringify(
    {
      key: "mypack",
      name: "MyPack",
      fullName: "My national accessibility standard",
      org: "Org",
      country: "XX",
      baseVersion: "1.0",
      wcagVersion: "2.2",
      locales: ["en"],
      defaultLocale: "en",
      license: "…",
      source: "https://…",
      attribution: "… © …",
      idPattern: "^\\d+\\.\\d+$",
      vocabulary: {
        theme: { en: "Theme" },
        criterion: { en: "Criterion" },
        test: { en: "Test" },
        conformant: { en: "Conformant" },
        nonConformant: { en: "Non-conformant" },
        notApplicable: { en: "Not applicable" },
        auditorHeading: { en: "Accessibility criterion" },
      },
      themes: [{ number: 1, name: { en: "Theme one" }, count: 1 }],
      criteria: [{ id: "1.1", theme: 1, title: { en: "Criterion one" }, titlePlain: { en: "Criterion one" }, wcag: ["1.1.1"] }],
    },
    null,
    2,
  );
}
