// Runtime validator for a StandardPack — the deterministic guardrail shared by the
// runtime `--pack` loader (src/config.ts), the `pack check` command (src/pack.ts), and
// the AI-assisted ingestion gate. It promotes the invariants previously only asserted in
// tests/packs.test.ts into one reusable, fail-loud function so an AI-produced (or
// hand-authored) pack cannot fabricate a criterion→SC mapping and slip through. No new
// dependency: pure TS over the bundled types + the WCAG core (`hasSC`).
import type { StandardPack } from "./types.js";
import type { Lang } from "../types.js";
import { hasSC } from "../wcag.js";

// Mirrors CORE_KEY in registry.ts; inlined to avoid an import cycle (the registry
// imports this validator for registerRuntimePack).
const RESERVED_CORE_KEY = "wcag";
const KNOWN_LANGS: readonly Lang[] = ["fr", "en"];
const SC_SHAPE = /^\d+\.\d+\.\d+$/; // a WCAG success-criterion id, e.g. "1.4.3"

// WCAG SCs that legitimately appear in country packs but are absent from our WCAG 2.2 AA
// core dataset — currently only 4.1.1 Parsing (valid in 2.0/2.1, removed in 2.2; RGAA 8.1
// maps to it). Any OTHER well-formed-but-unknown SC is treated as fabricated (error), so
// an AI cannot invent a plausible-looking "9.9.9" and have it pass the gate.
const LEGIT_OUT_OF_CORE: ReadonlySet<string> = new Set(["4.1.1"]);

/** Classify a WCAG SC id for pack/guidance validation. */
export function classifySc(sc: string): "core" | "legit" | "malformed" | "unknown" {
  if (!SC_SHAPE.test(sc)) return "malformed";
  if (hasSC(sc)) return "core";
  if (LEGIT_OUT_OF_CORE.has(sc)) return "legit";
  return "unknown";
}
const GATE_ID_SHAPE = /^\d+\.\d+$/; // the 2-segment pack-id grammar check.ts/verify.ts parse
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
    if (!KNOWN_LANGS.includes(l as Lang)) err("locales", `unsupported locale "${String(l)}" (known: ${KNOWN_LANGS.join(", ")})`);
  }
  const defaultLocale = p.defaultLocale;
  if (typeof defaultLocale !== "string" || !locales.includes(defaultLocale)) {
    err("defaultLocale", "defaultLocale must be one of locales");
  }
  const loc = (typeof defaultLocale === "string" ? defaultLocale : KNOWN_LANGS[0]) as Lang;

  let idRe: RegExp | null = null;
  if (typeof p.idPattern === "string") {
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
  let nonGateId = false;
  criteria?.forEach((c, i) => {
    const id = c?.id;
    if (typeof id !== "string" || id === "") {
      err(`criteria[${i}].id`, "criterion id must be a non-empty string");
    } else {
      if (ids.has(id)) err(`criteria[${i}].id`, `duplicate criterion id "${id}"`);
      ids.add(id);
      if (idRe && !idRe.test(id)) err(`criteria[${i}].id`, `id "${id}" does not match idPattern ${String(p.idPattern)}`);
      if (!GATE_ID_SHAPE.test(id)) nonGateId = true;
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
            err(where, `SC "${sc}" is not a recognized WCAG success criterion (not in the WCAG 2.2 AA core and not a known removed SC) — fabricated?`);
            break;
          case "legit":
            warn(where, `SC "${sc}" is outside the WCAG 2.2 AA core (removed in 2.2) — kept as a pack-local mapping`);
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

  if (nonGateId) {
    warn(
      "criteria",
      "some criterion ids are not the 2-segment <n>.<n> grammar that `check`/`verify` parse — reports against this pack may not pass those gates (see references/packs.md)",
    );
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
