// The cross-file dependency + component graph: a map of compact per-file nodes
// plus the queries the cross-file rules need. Built once (pass 1) over the full
// discovered scope; consumed (read-only) during the audit pass.
import type { FileGraphNode, ComponentDef } from "./imports.js";
import { resolveSpecifier } from "./resolve.js";
import type { AliasMap } from "./tsconfig.js";
import { toPosix } from "../glob.js";

export interface DepGraph {
  nodes: Map<string, FileGraphNode>; // posix file -> node
  known: ReadonlySet<string>; // all discovered files (posix), for specifier resolution
  allIds: ReadonlySet<string>; // every literal id defined anywhere (global skip-link lookup)
  aliases: AliasMap; // tsconfig-paths aliases for "@/…" specifier resolution
}

export function buildGraph(nodes: FileGraphNode[], aliases: AliasMap = []): DepGraph {
  const map = new Map<string, FileGraphNode>();
  const known = new Set<string>();
  const allIds = new Set<string>();
  // Deterministic: index in sorted-path order so re-runs are byte-identical.
  for (const n of [...nodes].sort((a, b) => (a.file < b.file ? -1 : a.file > b.file ? 1 : 0))) {
    map.set(n.file, n);
    known.add(n.file);
    for (const id of n.definesIds) allIds.add(id);
  }
  return { nodes: map, known, allIds, aliases };
}

/** Resolve a component used as `<localName/>` in `file` to its definition, following the
 *  import binding across files (relative or aliased), a namespace member (`<UI.Button/>`),
 *  a local definition, or a chain of barrel re-exports (`export { X } from "./x"`, modeled
 *  as an import-like binding by extractGraphNode) — however many barrels deep. `seen`
 *  guards against a re-export cycle (each file+name hop visited at most once). */
export function resolveUsage(graph: DepGraph, file: string, localName: string, seen: Set<string> = new Set()): ComponentDef | undefined {
  const posix = toPosix(file);
  const visitKey = `${posix}#${localName}`;
  if (seen.has(visitKey)) return undefined;
  seen.add(visitKey);
  const node = graph.nodes.get(posix);
  if (!node) return undefined;
  // Namespaced usage `<UI.Button/>` → namespace import `import * as UI` + member Button.
  if (localName.includes(".")) {
    const dot = localName.indexOf(".");
    const ns = localName.slice(0, dot);
    const member = localName.slice(dot + 1);
    const nsImp = node.imports.find((i) => i.imported === "*" && i.local === ns);
    if (!nsImp) return undefined;
    const target = resolveSpecifier(posix, nsImp.source, graph.known, graph.aliases);
    return target ? graph.nodes.get(target)?.components.get(member) : undefined;
  }
  const imp = node.imports.find((i) => i.local === localName);
  if (imp) {
    if (imp.imported === "*") return undefined; // bare namespace binding used without a member
    const target = resolveSpecifier(posix, imp.source, graph.known, graph.aliases);
    if (!target) return undefined;
    const direct = graph.nodes.get(target)?.components.get(imp.imported);
    if (direct) return direct;
    // The target doesn't define it directly — it may itself re-export it from
    // elsewhere (a barrel of barrels). Follow one more hop.
    return resolveUsage(graph, target, imp.imported, seen);
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
      const target = resolveSpecifier(cur, imp.source, graph.known, graph.aliases);
      if (target && !seen.has(target)) {
        seen.add(target);
        queue.push(target);
      }
    }
  }
  return false;
}
