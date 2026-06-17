// Zero-dependency input expansion for `audit`: turn file paths, directories and
// globs into a concrete file list, then apply --include/--exclude predicates.
import { readdirSync, statSync, existsSync } from "node:fs";
import { join, sep } from "node:path";
import { escapeRegExp, ext } from "./util.js";

// HTML + JSX/TSX + the HTML-shaped single-file component formats (Vue/Svelte/Astro
// templates parse cleanly through the HTML path). Server templates (.twig/.erb/.hbs/
// .liquid/.njk…) are opt-in via `--ext` since their extensions are ambiguous.
const DEFAULT_EXT = new Set([".html", ".htm", ".xhtml", ".jsx", ".tsx", ".vue", ".svelte", ".astro"]);

/** Normalise extensions (`twig` → `.twig`, lowercased) into a lookup set merged
 *  with the built-in defaults. */
function extSet(extra: string[] | undefined): Set<string> {
  const set = new Set(DEFAULT_EXT);
  for (const raw of extra ?? []) {
    for (const e of raw.split(",")) {
      const t = e.trim().toLowerCase();
      if (t) set.add(t.startsWith(".") ? t : `.${t}`);
    }
  }
  return set;
}
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

export const toPosix = (p: string): string => p.split(sep).join("/");
export const hasGlob = (s: string): boolean => /[*?]/.test(s);

/** A reusable file predicate (extension + include/exclude) for callers that
 *  already have a file list (e.g. git-changed discovery) and skip the walk. */
export function makeFilter(opts: ExpandOpts = {}): (file: string) => boolean {
  const include = compileGlobs(opts.include);
  const exclude = compileGlobs(opts.exclude);
  const exts = extSet(opts.ext);
  return (file: string): boolean => {
    if (!exts.has(ext(file))) return false;
    const rel = toPosix(file);
    if (include && !include(rel)) return false;
    if (exclude && exclude(rel)) return false;
    return true;
  };
}

/** Match a file against explicit input scopes (globs OR directory prefixes).
 *  Used by `--changed` to keep only git-changed files inside the audited scope.
 *  Returns null when inputs impose no scope (only "." / "-"). */
export function inScopeMatcher(inputs: string[]): ((file: string) => boolean) | null {
  const scopes = inputs.filter((i) => i !== "-" && i !== ".");
  if (!scopes.length) return null;
  const globMatch = compileGlobs(scopes.filter(hasGlob));
  const prefixes = scopes.filter((i) => !hasGlob(i)).map((p) => toPosix(p).replace(/\/+$/, ""));
  return (file: string): boolean => {
    const rel = toPosix(file);
    if (globMatch && globMatch(rel)) return true;
    return prefixes.some((p) => rel === p || rel.startsWith(`${p}/`));
  };
}

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
  ext?: string[];
}

/** Expand inputs (paths/dirs/globs) into a sorted, de-duplicated file list. */
export function expandInputs(inputs: string[], opts: ExpandOpts = {}): string[] {
  const include = compileGlobs(opts.include);
  const exclude = compileGlobs(opts.exclude);
  const exts = extSet(opts.ext);
  const files = new Set<string>();

  for (const input of inputs) {
    if (input === "-") continue; // stdin handled by the caller
    if (hasGlob(input)) {
      const re = globToRegExp(input);
      const acc: string[] = [];
      walk(staticBase(input), acc);
      // Honour the markup allowlist for globs too — a broad `src/**` must not pull
      // in .js/.css/.json and parse them as HTML (engine scope is markup only).
      for (const f of acc) if (re.test(toPosix(f)) && exts.has(ext(f))) files.add(f);
    } else if (existsSync(input)) {
      if (statSync(input).isDirectory()) {
        const acc: string[] = [];
        walk(input, acc);
        for (const f of acc) if (exts.has(ext(f))) files.add(f);
      } else if (exts.has(ext(input))) {
        files.add(input);
      }
    }
  }

  let list = [...files];
  if (include) list = list.filter((f) => include(toPosix(f)));
  if (exclude) list = list.filter((f) => !exclude(toPosix(f)));
  return list.sort();
}
