// The cross-file dependency + component graph: a map of compact per-file nodes
// plus the queries the cross-file rules need. Built once (pass 1) over the full
// discovered scope; consumed (read-only) during the audit pass.
import type { FileGraphNode, ComponentDef } from "./imports.js";
import { resolveSpecifier } from "./resolve.js";
import { toPosix } from "../glob.js";

export interface DepGraph {
  nodes: Map<string, FileGraphNode>; // posix file -> node
  known: ReadonlySet<string>; // all discovered files (posix), for specifier resolution
  allIds: ReadonlySet<string>; // every literal id defined anywhere (global skip-link lookup)
}

export function buildGraph(nodes: FileGraphNode[]): DepGraph {
  const map = new Map<string, FileGraphNode>();
  const known = new Set<string>();
  const allIds = new Set<string>();
  // Deterministic: index in sorted-path order so re-runs are byte-identical.
  for (const n of [...nodes].sort((a, b) => (a.file < b.file ? -1 : a.file > b.file ? 1 : 0))) {
    map.set(n.file, n);
    known.add(n.file);
    for (const id of n.definesIds) allIds.add(id);
  }
  return { nodes: map, known, allIds };
}

/** Resolve a component used as `<localName/>` in `file` to its definition,
 *  following the import binding across files (or a local definition). */
export function resolveUsage(graph: DepGraph, file: string, localName: string): ComponentDef | undefined {
  const posix = toPosix(file);
  const node = graph.nodes.get(posix);
  if (!node) return undefined;
  const imp = node.imports.find((i) => i.local === localName);
  if (imp) {
    if (imp.imported === "*") return undefined; // namespace import — not resolved in v1
    const target = resolveSpecifier(posix, imp.source, graph.known);
    if (!target) return undefined;
    return graph.nodes.get(target)?.components.get(imp.imported);
  }
  return node.components.get(localName); // locally-defined component
}

/** Is `id` defined as a literal id by any file in the graph? */
export function idDefinedAnywhere(graph: DepGraph, id: string): boolean {
  return graph.allIds.has(id);
}

/** Does any file `file` transitively imports declare an <html lang> (wrapper/layout
 *  pattern)? Used to suppress a missing-lang false positive on a wrapped document. */
export function htmlLangProvidedFor(graph: DepGraph, file: string): boolean {
  const start = toPosix(file);
  const seen = new Set<string>([start]);
  const queue: string[] = [start];
  while (queue.length) {
    const cur = queue.shift() as string;
    const node = graph.nodes.get(cur);
    if (!node) continue;
    if (cur !== start && node.providesHtmlLang) return true;
    for (const imp of node.imports) {
      const target = resolveSpecifier(cur, imp.source, graph.known);
      if (target && !seen.has(target)) {
        seen.add(target);
        queue.push(target);
      }
    }
  }
  return false;
}
