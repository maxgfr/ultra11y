// Smart file discovery for `audit` at scale. The static engine never needs to
// hold a whole monorepo in memory — it focuses: only markup files, optionally
// only what git says changed, ordered so the highest-value markup (layouts,
// templates, shared components) is audited first. Dedup + the --max-files cap are
// enforced by the streaming loop in audit.ts (single read per file). Zero deps:
// just node:fs + node:child_process (git) + node:path.
import { existsSync } from "node:fs";
import { execFileSync } from "node:child_process";
import { join, relative } from "node:path";
import { expandInputs, makeFilter, inScopeMatcher, toPosix, type ExpandOpts } from "./glob.js";

export interface DiscoverOpts extends ExpandOpts {
  changed?: boolean; // audit only files changed vs `since` (default HEAD)
  since?: string; // git ref to diff against (implies changed)
  onWarn?: (msg: string) => void;
}

export interface Discovery {
  files: string[]; // ordered: priority tier, then path (deterministic)
  changedMode: boolean;
  gitUnavailable: boolean; // changed mode requested but not a git repo / no git
}

function git(args: string[]): string | null {
  try {
    return execFileSync("git", args, { encoding: "utf8", stdio: ["ignore", "pipe", "ignore"] });
  } catch {
    return null;
  }
}

/** Files changed vs `ref` (working tree + index + untracked), repo-root-relative
 *  paths resolved to cwd-relative. null if git is unavailable / not a repo. */
export function gitChangedFiles(ref?: string): string[] | null {
  const top = git(["rev-parse", "--show-toplevel"]);
  if (top === null) return null;
  const repoRoot = top.trim();
  const base = ref && ref.trim() ? ref.trim() : "HEAD";
  const out = new Set<string>();
  const add = (s: string | null): void => {
    if (!s) return;
    for (const line of s.split("\n")) {
      const t = line.trim();
      if (t) out.add(t);
    }
  };
  // --diff-filter=d drops deletions: we never audit a file that no longer exists.
  add(git(["diff", "--name-only", "--diff-filter=d", base]));
  add(git(["diff", "--name-only", "--diff-filter=d", "--cached", base]));
  add(git(["ls-files", "--others", "--exclude-standard"]));
  const cwd = process.cwd();
  return [...out].map((p) => relative(cwd, join(repoRoot, p)));
}

// Audit the highest-value markup first so a partial / capped run still covers
// what matters. Lower number = earlier.
const TIER0 = /(^|\/)(layout|template|_app|_document|app|main|index)[.\-/]|(^|\/)(layouts?|templates?)\//i;
const TIER1 = /(^|\/)(components?|shared|ui|design-system|ds|partials?|includes?)\//i;
export function priority(file: string): number {
  const rel = toPosix(file);
  if (TIER0.test(rel)) return 0;
  if (TIER1.test(rel)) return 1;
  return 2;
}

function byPriorityThenPath(a: string, b: string): number {
  return priority(a) - priority(b) || (a < b ? -1 : a > b ? 1 : 0);
}

/** Resolve inputs into an ordered candidate file list. In `--changed` mode this
 *  starts from git's changed set (no full tree walk) filtered to the audited
 *  scope; otherwise it expands inputs normally. */
export function discover(inputs: string[], opts: DiscoverOpts = {}): Discovery {
  const changedMode = !!(opts.changed || opts.since);
  let files: string[];
  let gitUnavailable = false;

  if (changedMode) {
    const changed = gitChangedFiles(opts.since);
    if (changed === null) {
      gitUnavailable = true;
      opts.onWarn?.("ultra11y: --changed requested but git is unavailable here — falling back to a full scan.");
      files = expandInputs(inputs, opts);
    } else {
      const filter = makeFilter(opts);
      const inScope = inScopeMatcher(inputs);
      files = changed.filter((f) => existsSync(f) && filter(f) && (!inScope || inScope(f)));
    }
  } else {
    files = expandInputs(inputs, opts);
  }

  files = [...new Set(files)].sort(byPriorityThenPath);
  return { files, changedMode, gitUnavailable };
}
