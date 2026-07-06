// Barrel + the `--standard <id>` resolver. `StandardId` is either the reserved core key
// "wcag" or a registered pack key. The default is the WCAG core; an unknown value throws
// (never a silent fallback).
import { CORE_KEY, hasStandard, listStandards } from "./registry.js";

export type StandardId = string;
export const CORE: StandardId = CORE_KEY;

export function resolveStandard(flag: string | boolean | undefined): StandardId {
  if (flag === undefined || flag === true || flag === "") return CORE_KEY;
  const key = String(flag).toLowerCase();
  if (!hasStandard(key)) {
    throw new Error(`unknown standard "${key}" (known: ${listStandards().join(", ")})`);
  }
  return key;
}

export * from "./types.js";
export * from "./registry.js";
export * from "./pack.js";
export * from "./derive.js";
export * from "./vocabulary.js";
