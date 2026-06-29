// Resolve an import specifier to a discovered file, the way a bundler would but
// only against the set of files the audit already walked (no extra fs probing —
// keeps the graph bounded and deterministic). v1 resolves RELATIVE specifiers
// only; bare ("react") and alias ("@/…") specifiers return null. The `aliases`
// map is accepted for a future tsconfig-paths pass but unused for now.
import { dirname, join } from "node:path";
import { toPosix } from "../glob.js";

// Try the specifier verbatim, then with each source extension, then as a
// directory index. Order matches typical TS/bundler resolution.
const EXT_ORDER = [".tsx", ".jsx", ".ts", ".js", ".vue", ".svelte", ".astro", ".html", ".htm"];

function candidates(base: string): string[] {
  const out = [base];
  for (const e of EXT_ORDER) out.push(base + e);
  for (const e of EXT_ORDER) out.push(join(base, `index${e}`));
  return out;
}

/**
 * @param fromFile  the importing file (posix or native; normalised internally)
 * @param spec      the import specifier as written
 * @param known     set of POSIX-normalised paths of all discovered files
 * @returns the matched known file (posix), or null if unresolved/out-of-scope
 */
export function resolveSpecifier(fromFile: string, spec: string, known: ReadonlySet<string>, _aliases?: ReadonlyMap<string, string>): string | null {
  if (!spec.startsWith(".")) return null; // bare / alias specifier — out of scope (v1)
  const base = join(dirname(toPosix(fromFile)), spec);
  for (const c of candidates(base)) {
    const key = toPosix(c);
    if (known.has(key)) return key;
  }
  return null;
}
