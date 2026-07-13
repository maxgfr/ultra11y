// Core, STANDARD-AGNOSTIC page-sample (échantillon) mechanics. A real accessibility audit
// runs over a representative set of served pages (+ transverse elements), not the whole
// file tree — this validates the `sample` block of an Ultra11yConfig (hard error on
// malformed entries, mirroring the pack-loading validation style), projects it to the
// storageState-free shape recorded in an AuditResult, and lints a configured sample against
// a pack's NORMATIVE methodology (which required page kinds it covers).
//
// SECURITY: `storageState` values are FILE PATHS (Playwright session files). Their CONTENT
// is NEVER read here nor embedded in any output/finding/report — only the path is validated
// as a non-empty string. The required-kinds LIST is standard-specific and lives in the pack
// (src/standards/types.ts SampleMethodology), never in this core module.
import type { SampleConfig, SamplePage, SampleScope } from "./types.js";
import type { SampleMethodology, SampleRequiredKind } from "./standards/types.js";

export interface SampleIssue {
  path: string; // dotted path into the sample, e.g. "sample.pages[2].url"
  message: string;
}

export interface SampleValidation {
  ok: boolean;
  issues: SampleIssue[];
  sample?: SampleConfig; // the normalized sample, present only when ok
}

/** A served URL (http(s)://) or a local HTML file path — the two things `scan` can target. */
function looksLikeTarget(u: string): boolean {
  return /^https?:\/\//i.test(u) || /^(\.\.?[/\\]|[/\\])/.test(u) || /\.x?html?$/i.test(u);
}

/** Validate an untrusted `sample` config block. Any malformed entry is a hard error. */
export function validateSample(raw: unknown): SampleValidation {
  const issues: SampleIssue[] = [];
  const err = (path: string, message: string) => issues.push({ path, message });

  if (typeof raw !== "object" || raw === null || Array.isArray(raw)) {
    err("sample", "sample must be an object { pages: [...], transverse?: [...] }");
    return { ok: false, issues };
  }
  const s = raw as Record<string, unknown>;
  const pages = Array.isArray(s.pages) ? (s.pages as unknown[]) : null;
  if (!pages || pages.length === 0) err("sample.pages", "sample.pages must be a non-empty array");
  const ids = new Set<string>();
  pages?.forEach((pg, i) => {
    if (typeof pg !== "object" || pg === null || Array.isArray(pg)) {
      err(`sample.pages[${i}]`, "each page must be an object { id, name, url, auth?, storageState?, notes? }");
      return;
    }
    const p = pg as Record<string, unknown>;
    const id = p.id;
    if (typeof id !== "string" || id.trim() === "") {
      err(`sample.pages[${i}].id`, "page id must be a non-empty string");
    } else {
      if (ids.has(id)) err(`sample.pages[${i}].id`, `duplicate page id "${id}"`);
      ids.add(id);
    }
    if (typeof p.name !== "string" || p.name.trim() === "") err(`sample.pages[${i}].name`, "page name must be a non-empty string");
    if (typeof p.url !== "string" || p.url.trim() === "") err(`sample.pages[${i}].url`, "page url must be a non-empty string");
    else if (!looksLikeTarget(p.url)) err(`sample.pages[${i}].url`, `malformed url "${p.url}" (expected an http(s):// URL or an HTML file path)`);
    if (p.auth !== undefined && typeof p.auth !== "boolean") err(`sample.pages[${i}].auth`, "auth must be a boolean");
    if (p.storageState !== undefined && (typeof p.storageState !== "string" || p.storageState.trim() === ""))
      err(`sample.pages[${i}].storageState`, "storageState must be a non-empty file path string");
    if (p.notes !== undefined && typeof p.notes !== "string") err(`sample.pages[${i}].notes`, "notes must be a string");
  });

  if (s.transverse !== undefined) {
    if (!Array.isArray(s.transverse)) {
      err("sample.transverse", "transverse must be an array of strings");
    } else {
      (s.transverse as unknown[]).forEach((t, i) => {
        if (typeof t !== "string" || t.trim() === "") err(`sample.transverse[${i}]`, "transverse entries must be non-empty strings");
      });
    }
  }

  const ok = issues.length === 0;
  return { ok, issues, sample: ok ? normalizeSample(s) : undefined };
}

function normalizeSample(s: Record<string, unknown>): SampleConfig {
  const pages = (s.pages as Record<string, unknown>[]).map((p) => ({
    id: String(p.id),
    name: String(p.name),
    url: String(p.url),
    ...(typeof p.auth === "boolean" ? { auth: p.auth } : {}),
    ...(typeof p.storageState === "string" ? { storageState: p.storageState } : {}),
    ...(typeof p.notes === "string" ? { notes: p.notes } : {}),
  }));
  const transverse = Array.isArray(s.transverse) ? (s.transverse as string[]).map(String) : undefined;
  return { pages, ...(transverse?.length ? { transverse } : {}) };
}

/** Project a validated sample to the storageState-free shape recorded on an AuditResult /
 *  DynamicResult. The Playwright session PATH is deliberately dropped — never persisted. */
export function sampleScope(sample: SampleConfig): SampleScope {
  return {
    pages: sample.pages.map((p) => ({
      id: p.id,
      name: p.name,
      url: p.url,
      ...(p.auth !== undefined ? { auth: p.auth } : {}),
      ...(p.notes ? { notes: p.notes } : {}),
    })),
    ...(sample.transverse?.length ? { transverse: sample.transverse } : {}),
  };
}

export interface SampleLint {
  missing: SampleRequiredKind[]; // required kinds not covered by any configured page
}

// Accent-insensitive, case-folded normalization for fuzzy matching (RGAA labels carry
// diacritics; a user's page names rarely match verbatim).
const norm = (s: string): string =>
  s
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .toLowerCase();

/** Lint a configured sample against a standard's normative methodology: which required page
 *  KINDS does no configured page cover? Fuzzy — matches a kind's keywords against each
 *  page's name/notes/url/id (accent-insensitive), and treats the "transverse" kind as
 *  covered when the sample declares any transverse element. Advisory output, never a gate. */
export function lintSample(sample: SampleConfig, methodology: SampleMethodology): SampleLint {
  const haystacks = sample.pages.map((p) => norm([p.name, p.notes ?? "", p.url, p.id].join(" ")));
  const transverseHay = norm((sample.transverse ?? []).join(" "));
  const hasTransverse = (sample.transverse ?? []).length > 0;
  const missing: SampleRequiredKind[] = [];
  for (const kind of methodology.requiredKinds) {
    const kws = kind.keywords.map(norm).filter(Boolean);
    const covered =
      haystacks.some((h) => kws.some((k) => h.includes(k))) ||
      (transverseHay !== "" && kws.some((k) => transverseHay.includes(k))) ||
      (hasTransverse && /transverse/.test(kind.id));
    if (!covered) missing.push(kind);
  }
  return { missing };
}

/** Localized label for a required kind (default-locale-first fallback). */
export function kindLabel(kind: SampleRequiredKind, locale = "fr"): string {
  return kind.label[locale] ?? Object.values(kind.label)[0] ?? kind.id;
}

export type { SamplePage };
