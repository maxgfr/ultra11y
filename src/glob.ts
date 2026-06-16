// Zero-dependency input expansion for `audit`: turn file paths, directories and
// globs into a concrete file list, then apply --include/--exclude predicates.
import { readdirSync, statSync, existsSync } from "node:fs";
import { join, sep } from "node:path";
import { escapeRegExp, ext } from "./util.js";

const DEFAULT_EXT = new Set([".html", ".htm", ".xhtml", ".jsx", ".tsx"]);
const SKIP_DIR = new Set(["node_modules", ".git", "dist", "build", "coverage", ".next", "out", "audits"]);

// `**` crosses `/`, `*` runs within a segment, `?` is one non-`/` char.
function globToRegExp(glob: string): RegExp {
  let re = "";
  for (let i = 0; i < glob.length; i++) {
    const c = glob[i]!;
    if (c === "*") {
      if (glob[i + 1] === "*") {
        i++;
        if (glob[i + 1] === "/") {
          i++;
          re += "(?:.*/)?";
        } else {
          re += ".*";
        }
      } else {
        re += "[^/]*";
      }
    } else if (c === "?") {
      re += "[^/]";
    } else {
      re += escapeRegExp(c);
    }
  }
  return new RegExp(`^${re}$`);
}

export function compileGlobs(globs: string[] | undefined): ((rel: string) => boolean) | null {
  if (!globs || globs.length === 0) return null;
  const res = globs.flatMap((g) => g.split(",")).map((g) => g.trim()).filter(Boolean).map(globToRegExp);
  return (rel: string) => res.some((r) => r.test(rel));
}

const toPosix = (p: string): string => p.split(sep).join("/");
const hasGlob = (s: string): boolean => /[*?]/.test(s);

function walk(dir: string, acc: string[]): void {
  let entries;
  try {
    entries = readdirSync(dir, { withFileTypes: true });
  } catch {
    return;
  }
  for (const e of entries) {
    if (e.isDirectory()) {
      if (SKIP_DIR.has(e.name)) continue;
      walk(join(dir, e.name), acc);
    } else if (e.isFile()) {
      acc.push(join(dir, e.name));
    }
  }
}

function staticBase(glob: string): string {
  const idx = glob.search(/[*?]/);
  const head = idx === -1 ? glob : glob.slice(0, idx);
  const slash = head.lastIndexOf("/");
  return slash === -1 ? "." : head.slice(0, slash) || ".";
}

export interface ExpandOpts {
  include?: string[];
  exclude?: string[];
}

/** Expand inputs (paths/dirs/globs) into a sorted, de-duplicated file list. */
export function expandInputs(inputs: string[], opts: ExpandOpts = {}): string[] {
  const include = compileGlobs(opts.include);
  const exclude = compileGlobs(opts.exclude);
  const files = new Set<string>();

  for (const input of inputs) {
    if (input === "-") continue; // stdin handled by the caller
    if (hasGlob(input)) {
      const re = globToRegExp(input);
      const acc: string[] = [];
      walk(staticBase(input), acc);
      for (const f of acc) if (re.test(toPosix(f))) files.add(f);
    } else if (existsSync(input)) {
      if (statSync(input).isDirectory()) {
        const acc: string[] = [];
        walk(input, acc);
        for (const f of acc) if (DEFAULT_EXT.has(ext(f))) files.add(f);
      } else {
        files.add(input);
      }
    }
  }

  let list = [...files];
  if (include) list = list.filter((f) => include(toPosix(f)));
  if (exclude) list = list.filter((f) => !exclude(toPosix(f)));
  return list.sort();
}
