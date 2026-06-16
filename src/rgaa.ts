// Loads the bundled RGAA 4.1.2 reference (offline, embedded by tsup) and exposes
// criterion / theme / WCAG / glossary lookups. Everything downstream (audit,
// report, criteria, check) resolves criteria through here.
import rgaaJson from "./data/rgaa.json";
import glossaryJson from "./data/glossary.json";
import type { RgaaData, Criterion, Theme, Glossary, GlossaryEntry, Automatability } from "./types.js";

const data = rgaaJson as unknown as RgaaData;
const glossaryData = glossaryJson as unknown as Glossary;

const byId = new Map<string, Criterion>(data.criteria.map((c) => [c.id, c]));

export function allCriteria(): Criterion[] {
  return data.criteria;
}

export function allThemes(): Theme[] {
  return data.themes;
}

export function getCriterion(id: string): Criterion | undefined {
  return byId.get(id);
}

export function hasCriterion(id: string): boolean {
  return byId.has(id);
}

export function listTheme(n: number): Criterion[] {
  return data.criteria.filter((c) => c.theme === n);
}

export function themeName(n: number): string | undefined {
  return data.themes.find((t) => t.number === n)?.name;
}

export function wcagRefs(id: string): string[] {
  return byId.get(id)?.wcag ?? [];
}

export function techniques(id: string): string[] {
  return byId.get(id)?.techniques ?? [];
}

export function automatability(id: string): Automatability | undefined {
  return byId.get(id)?.automatability;
}

export function resolveGlossary(anchor: string): GlossaryEntry | undefined {
  return glossaryData[anchor];
}

export function meta(): Pick<RgaaData, "rgaaVersion" | "wcagVersion" | "source" | "license"> {
  return {
    rgaaVersion: data.rgaaVersion,
    wcagVersion: data.wcagVersion,
    source: data.source,
    license: data.license,
  };
}

export { data as rgaa, glossaryData as glossary };
