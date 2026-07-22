// Engine-backed import resolution for the component graph. The vendored
// codeindex engine resolves relative specifiers, ESM/NodeNext ".js"-for-".ts"
// specifiers and tsconfig path aliases (with full `extends`-chain and
// multi-config semantics, string-aware JSONC parsing) against the SAME bounded
// universe as before: only the files the audit discovered, plus the up-walked
// tsconfig chain. Bare node_modules specifiers stay out of scope (no
// package.json is ever handed to the engine, so its workspace-package
// resolution never activates).
//
// The engine is NOT a superset of the old resolver, so the old resolver stays
// as the fallback for every case the engine misses (per codeindex
// docs/MIGRATION.md: never regress; report the gap). Known engine gaps:
//   - no .vue/.svelte/.astro/.html/.htm candidate probes — an extensionless
//     `import Widget from "./Widget"` never reaches Widget.vue, and neither
//     does an alias target ("@/Widget") pointing at an SFC;
//   - `resolveImport` dispatches on the IMPORTING file's extension and treats
//     SFC/HTML extensions as non-code (returns `external`) — adapted here by
//     dispatching SFC/HTML importers as ".tsx" (their imports come from real
//     <script>/frontmatter JS/TS that ultra11y parsed);
//   - `extends` targets without a ./ or ../ prefix (e.g. "base.json") are
//     treated as bare package specifiers and skipped.
import { resolve as absPath } from "node:path";
import { toPosix } from "../glob.js";
import { ext } from "../util.js";
import { buildResolveContext, type FileRecord, type RepoScan, resolveImport } from "../vendor/codeindex-engine.mjs";
import { resolveSpecifier } from "./resolve.js";
import { type AliasMap, tsconfigChain } from "./tsconfig.js";

// The importing-file extensions the engine dispatches to its JS/TS resolver.
const JS_TS = new Set([".ts", ".tsx", ".mts", ".cts", ".js", ".jsx", ".mjs", ".cjs"]);

export type SpecResolver = (fromFile: string, spec: string) => string | null;

/** Build a specifier resolver over the discovered file set. `startDir` anchors
 *  the tsconfig up-walk (the dir of the first discovered file, as before). */
export function makeSpecResolver(known: ReadonlySet<string>, aliases: AliasMap = [], startDir?: string): SpecResolver {
  // The engine refuses ".."-escaping relative candidates and resolves config
  // targets against its own file set, so hand it one coherent ABSOLUTE-posix
  // universe and map hits back to the caller's own (posix, possibly relative)
  // paths on the way out.
  const backMap = new Map<string, string>();
  for (const rel of known) backMap.set(toPosix(absPath(rel)), rel);
  const files: FileRecord[] = [...backMap.keys()].sort().map((rel) => ({ rel }) as FileRecord);
  for (const cfg of startDir ? tsconfigChain(startDir) : []) files.push({ rel: toPosix(cfg) } as FileRecord);
  // Only `root` (path base for config reads — "" keeps absolute rels intact)
  // and `files[].rel` are consulted by buildResolveContext.
  const ctx = buildResolveContext({ root: "", files } as RepoScan);

  return (fromFile: string, spec: string): string | null => {
    const e = ext(fromFile);
    const r = resolveImport(toPosix(absPath(fromFile)), JS_TS.has(e) ? e : ".tsx", spec, ctx);
    if (r.kind === "resolved") {
      const hit = backMap.get(r.target);
      if (hit) return hit;
    }
    // Engine gap fallback (SFC/HTML candidates, "extends" without ./) — the
    // original resolver, unchanged, over the same known set.
    return resolveSpecifier(fromFile, spec, known, aliases);
  };
}
