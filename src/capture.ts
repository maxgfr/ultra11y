// Rendered-DOM "captures": real HTML serialized from a component render (a test or a
// build) so the static engine can audit the TRUE markup a component library / SFC
// emits — the output that lives in node_modules at runtime and is invisible to
// source analysis. A capture carries a leading provenance comment
//   <!-- ultra11y:capture v="1" source="src/Button.tsx" component="Button" test="…" name="…" -->
// linking the serialized DOM back to the source component. This module parses that
// provenance; coverage (which components have a capture) lives alongside it.
//
// NOTE: the harvester that WRITES captures is assets/capture-setup.mjs — a separate,
// dependency-free module embedded into the bundle and copied into user projects. It
// carries its own copy of the escaping below (it cannot import from src at runtime),
// so keep the two schemes byte-identical.
import type { CaptureProvenance } from "./parse/html.js";
import type { DepGraph } from "./graph/graph.js";
import type { ComponentDef } from "./graph/imports.js";
import { toPosix } from "./glob.js";

// A capture's provenance comment must contain no literal `"` (it would end an
// attribute value early) and no `--` digraph (it would end the HTML comment early).
// We entity-escape both — plus `& < >` — so the value round-trips and the surrounding
// file stays valid HTML. Single hyphens are preserved so kebab paths stay readable.
export function escapeCommentValue(s: string): string {
  return s.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/--/g, "&#45;&#45;");
}

export function unescapeCommentValue(s: string): string {
  return s
    .replace(/&#45;/g, "-")
    .replace(/&gt;/g, ">")
    .replace(/&lt;/g, "<")
    .replace(/&quot;/g, '"')
    .replace(/&amp;/g, "&");
}

// Only the head of the file can hold the marker (the harvester writes it first), so
// scan a bounded prefix — never the whole (potentially large) capture.
const SCAN_LIMIT = 4096;
const MARKER = /<!--\s*ultra11y:capture\b([\s\S]*?)-->/;
const PAIR = /(\w+)="([^"]*)"/g;

/** Parse a capture's provenance comment, or return undefined when absent — so
 *  Storybook / manual dumps with no marker still audit as ordinary HTML. */
export function parseCaptureProvenance(source: string): CaptureProvenance | undefined {
  const head = source.length > SCAN_LIMIT ? source.slice(0, SCAN_LIMIT) : source;
  const m = MARKER.exec(head);
  if (!m) return undefined;
  const body = m[1] ?? "";
  const kv = new Map<string, string>();
  PAIR.lastIndex = 0;
  for (let p = PAIR.exec(body); p; p = PAIR.exec(body)) {
    kv.set(p[1] as string, unescapeCommentValue(p[2] as string));
  }
  const vRaw = kv.get("v");
  const v = vRaw ? Number.parseInt(vRaw, 10) : 1;
  return {
    v: Number.isFinite(v) ? v : 1,
    ...(kv.has("source") ? { sourceFile: kv.get("source") } : {}),
    ...(kv.has("component") ? { component: kv.get("component") } : {}),
    ...(kv.has("test") ? { test: kv.get("test") } : {}),
    ...(kv.has("name") ? { name: kv.get("name") } : {}),
  };
}

// ---- coverage: which components have a rendered capture vs which remain blind spots

export interface CaptureEntry {
  file: string; // the capture file's path
  provenance?: CaptureProvenance; // absent for un-tagged dumps (Storybook/manual)
}

export interface CaptureCoverage {
  total: number; // components in scope that warrant a capture
  covered: string[]; // "posix/path#Component" keys with a matching capture
  blindSpots: string[]; // component keys still audited from opaque source only
  unattributed: number; // capture files with no resolvable source component
}

// Capture provenance is repo-relative ("src/Button.tsx"); graph node paths may be
// cwd-relative or absolute. Match on a path suffix so either side resolves the other.
function pathMatch(a: string, b: string): boolean {
  return a === b || a.endsWith(`/${b}`) || b.endsWith(`/${a}`);
}

/** Cross-reference the component graph against the captures present. A component needs a
 *  capture when its runtime a11y can't be judged from source: it renders an intrinsic
 *  control (whose accessible name may be injected) OR lives in a file that renders
 *  component-LIBRARY components (the real markup lives in node_modules). */
export function computeCaptureCoverage(graph: DepGraph, captures: CaptureEntry[]): CaptureCoverage {
  const sigs = captures
    .map((c) => c.provenance)
    .filter((p): p is CaptureProvenance => !!p?.sourceFile)
    .map((p) => ({ sourceFile: toPosix(p.sourceFile as string), component: p.component }));
  const covered: string[] = [];
  const blindSpots: string[] = [];
  const seen = new Set<string>();
  for (const node of graph.nodes.values()) {
    const opaque = node.opaqueComponents.length > 0;
    for (const def of new Set<ComponentDef>(node.components.values())) {
      if (!def.hasControl && !opaque) continue; // nothing rendered worth capturing
      const key = `${node.file}#${def.name}`;
      if (seen.has(key)) continue;
      seen.add(key);
      const isCovered = sigs.some((s) => pathMatch(s.sourceFile, node.file) && (!s.component || s.component === def.name || def.name === "default"));
      (isCovered ? covered : blindSpots).push(key);
    }
  }
  covered.sort();
  blindSpots.sort();
  return { total: covered.length + blindSpots.length, covered, blindSpots, unattributed: captures.filter((c) => !c.provenance?.sourceFile).length };
}
