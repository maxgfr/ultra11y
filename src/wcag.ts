// Loads the bundled WCAG 2.2 Level AA reference (offline, embedded by tsup) and exposes
// success-criterion / principle / guideline / technique lookups. This is the engine's
// CANONICAL key: everything downstream (audit, report, criteria, check, verify) resolves
// success criteria through here. Country standards (RGAA, …) are derived packs that map
// their criteria onto these SCs — see src/standards/.
import wcagJson from "./data/wcag.json";
import type { WcagData, Sc, WcagPrinciple, WcagGuideline, Automatability } from "./types.js";

const data = wcagJson as unknown as WcagData;

const byId = new Map<string, Sc>(data.criteria.map((c) => [c.sc, c]));

export function allSC(): Sc[] {
  return data.criteria;
}

export function getSC(id: string): Sc | undefined {
  return byId.get(id);
}

export function hasSC(id: string): boolean {
  return byId.has(id);
}

export function allPrinciples(): WcagPrinciple[] {
  return data.principles;
}

export function allGuidelines(): WcagGuideline[] {
  return data.guidelines;
}

export function principleTitle(n: number): string | undefined {
  return data.principles.find((p) => p.number === n)?.title;
}

export function guidelineTitle(n: string): string | undefined {
  return data.guidelines.find((g) => g.number === n)?.title;
}

/** SCs grouped by guideline ("1.4" → [...]), in dataset (numbering) order. */
export function scsByGuideline(): Map<string, Sc[]> {
  const m = new Map<string, Sc[]>();
  for (const c of data.criteria) (m.get(c.guideline) ?? m.set(c.guideline, []).get(c.guideline)!).push(c);
  return m;
}

/** SCs grouped by principle (1..4 → [...]), in dataset (numbering) order. */
export function scsByPrinciple(): Map<number, Sc[]> {
  const m = new Map<number, Sc[]>();
  for (const c of data.criteria) (m.get(c.principle) ?? m.set(c.principle, []).get(c.principle)!).push(c);
  return m;
}

export function automatability(id: string): Automatability | undefined {
  return byId.get(id)?.automatability;
}

export function techniques(id: string): string[] {
  return byId.get(id)?.techniques ?? [];
}

export function ruleIds(id: string): string[] {
  return byId.get(id)?.ruleIds ?? [];
}

export function understanding(id: string): string | undefined {
  return byId.get(id)?.understanding;
}

export function meta(): Pick<WcagData, "wcagVersion" | "level" | "source" | "license" | "criteriaSource"> {
  return {
    wcagVersion: data.wcagVersion,
    level: data.level,
    source: data.source,
    license: data.license,
    criteriaSource: data.criteriaSource,
  };
}

/** Numeric SC compare: sorts "1.4.10" after "1.4.3" (version tuples). Moved from standard.ts. */
export function compareSC(a: string, b: string): number {
  const pa = a.split(".").map(Number);
  const pb = b.split(".").map(Number);
  for (let i = 0; i < Math.max(pa.length, pb.length); i++) {
    const d = (pa[i] ?? 0) - (pb[i] ?? 0);
    if (d) return d;
  }
  return 0;
}

export { data as wcag };
