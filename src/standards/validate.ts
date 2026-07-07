// Runtime validator for a StandardPack — the deterministic guardrail shared by the
// runtime `--pack` loader (src/config.ts), the `pack check` command (src/pack.ts), and
// the AI-assisted ingestion gate. It promotes the invariants previously only asserted in
// tests/packs.test.ts into one reusable, fail-loud function so an AI-produced (or
// hand-authored) pack cannot fabricate a criterion→SC mapping and slip through. No new
// dependency: pure TS over the bundled types + the WCAG core (`hasSC`).
import type { StandardPack } from "./types.js";
import { hasSC, knownScStatus } from "../wcag.js";

// Mirrors CORE_KEY in registry.ts; inlined to avoid an import cycle (the registry
// imports this validator for registerRuntimePack).
const RESERVED_CORE_KEY = "wcag";
// A pack locale is a BCP-47-ish tag ("fr", "en", "pt-BR", "nl-BE"…) — NOT constrained to
// the UI frame's `Lang` ("fr"|"en"): a pack may legitimately be authored in any language
// (see src/standards/types.ts `LocaleString`).
const LOCALE_SHAPE = /^[a-z]{2,3}(-[a-zA-Z]{2,4})?$/;
const SC_SHAPE = /^\d+\.\d+\.\d+$/; // a WCAG success-criterion id, e.g. "1.4.3"

/** Classify a WCAG SC id for pack/guidance validation, against the REAL WCAG 2.x
 *  universe (src/wcag.ts `knownScStatus`) — never a single hardcoded tolerated id, so a
 *  second pack (Section 508, EN 301 549…) can legitimately cite an AAA success criterion
 *  or the removed 4.1.1 without the gate having to special-case it. */
export function classifySc(sc: string): "core" | "out-of-core" | "removed" | "malformed" | "unknown" {
  if (!SC_SHAPE.test(sc)) return "malformed";
  if (hasSC(sc)) return "core";
  const status = knownScStatus(sc);
  if (status === "out-of-core" || status === "removed") return status;
  return "unknown";
}
const REQUIRED_STRING_FIELDS = ["key", "name", "org", "country", "baseVersion", "wcagVersion", "license", "source", "attribution", "idPattern"] as const;

export interface PackIssue {
  path: string; // dotted path into the pack, e.g. "criteria[3].wcag[0]" ("" = whole pack)
  message: string;
  severity: "error" | "warn";
}

export interface PackValidation {
  ok: boolean; // false iff there is at least one error-severity issue
  issues: PackIssue[];
  pack?: StandardPack; // the normalized pack (key lower-cased), present only when ok
}

export interface ValidateOpts {
  knownKeys?: ReadonlySet<string>; // built-in + already-registered keys (collision check)
  allowOverride?: boolean; // permit a pack to replace a known key (warns instead of errors)
}

/** Validate an untrusted pack object. Errors block registration; warnings are advisory. */
export function validatePack(raw: unknown, opts: ValidateOpts = {}): PackValidation {
  const issues: PackIssue[] = [];
  const err = (path: string, message: string) => issues.push({ path, message, severity: "error" });
  const warn = (path: string, message: string) => issues.push({ path, message, severity: "warn" });
  const done = (): PackValidation => {
    const ok = !issues.some((x) => x.severity === "error");
    return { ok, issues, pack: ok ? normalize(raw as Record<string, unknown>) : undefined };
  };

  if (typeof raw !== "object" || raw === null || Array.isArray(raw)) {
    err("", "pack must be a JSON object");
    return { ok: false, issues };
  }
  const p = raw as Record<string, unknown>;

  for (const f of REQUIRED_STRING_FIELDS) {
    const v = p[f];
    if (typeof v !== "string" || v.trim() === "") err(f, `"${f}" must be a non-empty string`);
  }

  const key = typeof p.key === "string" ? p.key.toLowerCase() : "";
  if (key === RESERVED_CORE_KEY) err("key", `pack key "${RESERVED_CORE_KEY}" is reserved for the WCAG core`);
  if (key && opts.knownKeys?.has(key)) {
    if (opts.allowOverride) warn("key", `pack key "${key}" overrides a built-in/loaded standard`);
    else err("key", `pack key "${key}" collides with a built-in/loaded standard (use --override to replace it)`);
  }

  const locales = Array.isArray(p.locales) ? p.locales : [];
  if (locales.length === 0) err("locales", "locales must be a non-empty array");
  for (const l of locales) {
    if (typeof l !== "string" || !LOCALE_SHAPE.test(l)) err("locales", `malformed locale "${String(l)}" (expected a BCP-47-ish tag, e.g. "en", "fr", "pt-BR")`);
  }
  // A pack need not carry fr/en at all (a "de"-only standard is legitimate — the UI frame
  // falls back to its own generic terms), but it's worth flagging: WARNING, not an error.
  if (locales.length && !locales.some((l) => l === "fr" || l === "en")) {
    warn("locales", 'pack carries neither "fr" nor "en" — the UI frame will fall back to its own generic auditor-display terms');
  }
  const defaultLocale = p.defaultLocale;
  if (typeof defaultLocale !== "string" || !locales.includes(defaultLocale)) {
    err("defaultLocale", "defaultLocale must be one of locales");
  }
  const loc = typeof defaultLocale === "string" ? defaultLocale : ((locales[0] as string | undefined) ?? "en");

  let idRe: RegExp | null = null;
  if (typeof p.idPattern === "string") {
    // Classic catastrophic-backtracking (ReDoS) shape: a group whose body is a SINGLE
    // quantified atom, itself quantified — (a+)+ / (a*)* / (\d+)+ / (.*)+ . The inner and
    // outer quantifiers then match overlapping input. A group with a required prefix
    // (e.g. (\.\d+)*, the normal "E205.4" criterion grammar) is NOT flagged — each outer
    // iteration is anchored by the literal, so there is no exponential blowup.
    if (/\((?:\\.|\[[^\]]*\]|[^()\\])[*+]\)[*+]/.test(p.idPattern)) {
      err("idPattern", "idPattern has a nested quantifier (e.g. (a+)+) — a catastrophic-backtracking (ReDoS) shape; simplify it");
    }
    try {
      idRe = new RegExp(p.idPattern);
    } catch (e) {
      err("idPattern", `idPattern is not a valid regex: ${(e as Error).message}`);
    }
  }

  const themes = Array.isArray(p.themes) ? (p.themes as Record<string, unknown>[]) : null;
  if (!themes) err("themes", "themes must be an array");
  const themeNumbers = new Set<number>();
  themes?.forEach((t, i) => {
    const n = t?.number;
    if (typeof n !== "number") {
      err(`themes[${i}].number`, "theme number must be a number");
      return;
    }
    if (themeNumbers.has(n)) err(`themes[${i}].number`, `duplicate theme number ${n}`);
    themeNumbers.add(n);
    const name = t?.name as Record<string, unknown> | undefined;
    if (!name || typeof name[loc] !== "string") err(`themes[${i}].name`, `theme ${n} missing name[${loc}]`);
  });

  const criteria = Array.isArray(p.criteria) ? (p.criteria as Record<string, unknown>[]) : null;
  if (!criteria) err("criteria", "criteria must be an array");
  const ids = new Set<string>();
  const countByTheme = new Map<number, number>();
  criteria?.forEach((c, i) => {
    const id = c?.id;
    if (typeof id !== "string" || id === "") {
      err(`criteria[${i}].id`, "criterion id must be a non-empty string");
    } else {
      if (ids.has(id)) err(`criteria[${i}].id`, `duplicate criterion id "${id}"`);
      ids.add(id);
      if (idRe && !idRe.test(id)) err(`criteria[${i}].id`, `id "${id}" does not match idPattern ${String(p.idPattern)}`);
    }
    const theme = c?.theme;
    if (typeof theme !== "number") {
      err(`criteria[${i}].theme`, "criterion theme must be a number");
    } else {
      if (themes && !themeNumbers.has(theme)) err(`criteria[${i}].theme`, `criterion "${String(id)}" references unknown theme ${theme}`);
      countByTheme.set(theme, (countByTheme.get(theme) ?? 0) + 1);
    }
    const title = c?.title as Record<string, unknown> | undefined;
    if (!title || typeof title[loc] !== "string") err(`criteria[${i}].title`, `criterion "${String(id)}" missing title[${loc}]`);
    const titlePlain = c?.titlePlain as Record<string, unknown> | undefined;
    if (!titlePlain || typeof titlePlain[loc] !== "string") err(`criteria[${i}].titlePlain`, `criterion "${String(id)}" missing titlePlain[${loc}]`);
    const wcag = Array.isArray(c?.wcag) ? (c.wcag as unknown[]) : null;
    if (!wcag || wcag.length === 0) {
      err(`criteria[${i}].wcag`, `criterion "${String(id)}" must map to at least one WCAG SC`);
    } else {
      wcag.forEach((sc, j) => {
        const where = `criteria[${i}].wcag[${j}]`;
        if (typeof sc !== "string") {
          err(where, `malformed SC id "${String(sc)}" (expected N.N.N)`);
          return;
        }
        switch (classifySc(sc)) {
          case "malformed":
            err(where, `malformed SC id "${sc}" (expected N.N.N)`);
            break;
          case "unknown":
            err(
              where,
              `SC "${sc}" is not a recognized WCAG success criterion (not in the WCAG 2.2 AA core, and not a real WCAG AAA or removed SC) — fabricated?`,
            );
            break;
          case "out-of-core":
            warn(
              where,
              `SC "${sc}" is a real WCAG AAA success criterion, outside the WCAG 2.2 AA core — kept as a pack-local mapping (out of engine scope; derive as manual)`,
            );
            break;
          case "removed":
            warn(
              where,
              `SC "${sc}" is a real but removed WCAG success criterion (obsolete) — kept as a pack-local mapping (out of engine scope; derive as manual)`,
            );
            break;
        }
      });
    }
  });

  themes?.forEach((t, i) => {
    const n = t?.number;
    if (typeof n !== "number") return;
    const declared = t?.count;
    const actual = countByTheme.get(n) ?? 0;
    if (typeof declared === "number" && declared !== actual) {
      err(`themes[${i}].count`, `theme ${n} declares count ${declared} but has ${actual} criteria`);
    }
  });

  // Optional auditor-display vocabulary. Absent → the generic/core defaults apply (never an
  // error). Present → each supplied term must be a LocaleString carrying at least the default
  // locale; a partial/unknown/malformed term is a WARNING (the default is used), never a hard
  // failure — a pack should not be blocked over presentation strings.
  if (p.vocabulary !== undefined) {
    if (typeof p.vocabulary !== "object" || p.vocabulary === null || Array.isArray(p.vocabulary)) {
      warn("vocabulary", "vocabulary must be an object of localized terms — ignored");
    } else {
      const VOC_KEYS = ["theme", "criterion", "test", "conformant", "nonConformant", "notApplicable", "auditorHeading", "normativeNote"];
      const voc = p.vocabulary as Record<string, unknown>;
      for (const k of Object.keys(voc)) {
        if (!VOC_KEYS.includes(k)) {
          warn(`vocabulary.${k}`, `unknown vocabulary term "${k}" (ignored)`);
          continue;
        }
        const term = voc[k] as Record<string, unknown> | undefined;
        if (typeof term !== "object" || term === null || Array.isArray(term)) {
          warn(`vocabulary.${k}`, `term "${k}" must be a localized object (e.g. { "${loc}": "…" }) — default used`);
        } else if (typeof term[loc] !== "string") {
          warn(`vocabulary.${k}`, `term "${k}" has no string for the default locale "${loc}" — default used`);
        }
      }
    }
  }

  return done();
}

function normalize(p: Record<string, unknown>): StandardPack {
  return { ...p, key: String(p.key).toLowerCase() } as unknown as StandardPack;
}

/** Format issues for CLI output (one line each, errors first). */
export function formatIssues(issues: PackIssue[]): string[] {
  const order = (s: PackIssue["severity"]) => (s === "error" ? 0 : 1);
  return [...issues]
    .sort((a, b) => order(a.severity) - order(b.severity))
    .map((x) => `  ${x.severity === "error" ? "✗" : "⚠"} ${x.path ? `${x.path}: ` : ""}${x.message}`);
}
