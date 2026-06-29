// The standards registry: the WCAG 2.2 core ("wcag", canonical, lives in src/wcag.ts)
// plus the statically-imported country PACKS. Adding a country = drop a pack JSON under
// src/data/standards/ and add one `register(...)` line here (static imports are required
// so tsup inlines every pack into the single zero-dependency bundle — no runtime fs/glob).
import rgaaPack from "../data/standards/rgaa.json";
import rgaaGlossary from "../data/standards/rgaa.glossary.json";
import type { StandardPack } from "./types.js";
import type { Glossary } from "../types.js";
import { validatePack, type PackValidation } from "./validate.js";

export const CORE_KEY = "wcag";

interface Registered {
  pack: StandardPack;
  glossary: Glossary;
}

const registry = new Map<string, Registered>();

function register(pack: StandardPack, glossary: Glossary): void {
  if (pack.key === CORE_KEY) throw new Error(`pack key "${CORE_KEY}" is reserved for the WCAG core`);
  registry.set(pack.key, { pack, glossary });
}

register(rgaaPack as unknown as StandardPack, rgaaGlossary as unknown as Glossary);

/**
 * Register an EXTERNAL pack at runtime (from `--pack` / `.ultra11yrc.json`) — the
 * pluggable counterpart to the build-time `register` above. It runs the shared
 * `validatePack` guardrail first; on ANY error-severity issue it does not register and
 * returns the validation so the caller can fail loudly (never a silent accept). A key
 * that collides with a built-in/loaded standard is an error unless `opts.override`.
 */
export function registerRuntimePack(raw: unknown, glossary: Glossary = {}, opts: { override?: boolean } = {}): PackValidation {
  const v = validatePack(raw, { knownKeys: new Set(listStandards()), allowOverride: opts.override });
  if (v.ok && v.pack) registry.set(v.pack.key, { pack: v.pack, glossary });
  return v;
}

export function isCore(key: string): boolean {
  return key === CORE_KEY;
}

export function hasStandard(key: string): boolean {
  return key === CORE_KEY || registry.has(key);
}

/** Resolve a pack by key; throws on unknown (never silently falls back to the core). */
export function loadPack(key: string): StandardPack {
  const r = registry.get(key);
  if (!r) throw new Error(`unknown standards pack "${key}" (known packs: ${[...registry.keys()].join(", ") || "none"})`);
  return r.pack;
}

export function getPack(key: string): StandardPack | undefined {
  return registry.get(key)?.pack;
}

export function packGlossary(key: string): Glossary | undefined {
  return registry.get(key)?.glossary;
}

/** All standard keys: the core first, then every registered pack. */
export function listStandards(): string[] {
  return [CORE_KEY, ...registry.keys()];
}

export function listPacks(): StandardPack[] {
  return [...registry.values()].map((r) => r.pack);
}

/** Reverse cross-reference: which packs (and their criterion ids) map to a WCAG SC. */
export function packsForSc(sc: string): { key: string; ids: string[] }[] {
  const out: { key: string; ids: string[] }[] = [];
  for (const { pack } of registry.values()) {
    const ids = pack.criteria.filter((c) => c.wcag.includes(sc)).map((c) => c.id);
    if (ids.length) out.push({ key: pack.key, ids });
  }
  return out;
}
