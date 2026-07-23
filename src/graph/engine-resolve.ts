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
// docs/MIGRATION.md: never regress; report the gap).
//
// RESOLVED as of the v2.10.0 re-pin (was previously a gap here — see
// tests/golden-graph.test.ts and tests/graph-sfc.test.ts for the pinning
// tests, and src/graph/resolve.ts for the now-reduced fallback candidate
// list): the engine's own candidate probe (JS_EXT_PROBES) now tries
// .vue/.svelte/.astro/.html/.htm, for both relative AND alias targets, so an
// extensionless `import Widget from "./Widget"` (or an alias "@/Widget")
// reaches Widget.vue directly. `resolveImport` also now dispatches SFC/HTML
// importer extensions (its own SFC_HTML set) straight to the JS/TS resolver,
// so the importing file's REAL extension is passed through below instead of
// being forced to ".tsx".
//
// Still-open engine gap:
//   - `extends` targets without a ./ or ../ prefix (e.g. "base.json") are
//     treated as bare package specifiers and skipped.
import { resolve as absPath } from "node:path";
import { toPosix } from "../glob.js";
import { ext } from "../util.js";
import { buildResolveContext, type FileRecord, type RepoScan, resolveImport } from "../vendor/codeindex-engine.mjs";
import { resolveSpecifier } from "./resolve.js";
import { type AliasMap, tsconfigChain } from "./tsconfig.js";

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
    const r = resolveImport(toPosix(absPath(fromFile)), ext(fromFile), spec, ctx);
    if (r.kind === "resolved") {
      const hit = backMap.get(r.target);
      if (hit) return hit;
    }
    // Engine gap fallback ("extends" without ./) — the original resolver,
    // unchanged, over the same known set.
    return resolveSpecifier(fromFile, spec, known, aliases);
  };
}
