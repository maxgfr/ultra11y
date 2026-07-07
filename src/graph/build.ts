// Pass 1 of `audit --graph`: stream every discovered file, parse it, extract a
// compact FileGraphNode, and DISCARD the AST/Doc — so only O(file count) small
// records are ever held, never whole-repo source. Then assemble the DepGraph.
import { readText, ext } from "../util.js";
import { GRAPH_ONLY_EXT } from "../glob.js";
import { detectKind, splitAstroFrontmatter } from "../parse/source.js";
import { parseJsxAst } from "../parse/jsx-ast.js";
import { jsxAstToDoc } from "../parse/jsx-bridge.js";
import { parseHtml, type Doc } from "../parse/html.js";
import { jsxToHtml } from "../parse/jsx.js";
import { dirname } from "node:path";
import { extractGraphNode, type FileGraphNode } from "./imports.js";
import { buildGraph, type DepGraph } from "./graph.js";
import { readTsAliases } from "./tsconfig.js";

const GRAPH_ONLY = new Set(GRAPH_ONLY_EXT);

// A plain TS/JS module has no markup — an empty Doc keeps extractGraphNode from
// reading nothing but its (non-existent) elements, while still handing the real
// source's AST to the import/export extraction below. Never fed through `parseHtml`
// on the real TS/JS text: generics like `Array<string>` would look like tags to it.
function emptyDoc(file: string, source: string): Doc {
  return { file, source, lossy: false, kind: "html", roots: [], elements: [], byId: new Map(), lineStarts: [0] };
}

// .vue/.svelte's own <script>/<script setup>…</script> block — the only part of an
// SFC that's real JS/TS. Astro's frontmatter fence is handled separately (it isn't
// a <script> tag) via splitAstroFrontmatter.
const SCRIPT_BLOCK_RE = /<script\b[^>]*>([\s\S]*?)<\/script>/gi;

// The graph-relevant script source of an SFC: Astro's `---…---` frontmatter, or a
// .vue/.svelte file's <script> block(s). A Vue SFC commonly has BOTH `<script>` and
// `<script setup>` — concatenate ALL blocks so imports/exports from either are seen.
// "" when there is none to parse (template-only SFC) — extractGraphNode still
// synthesizes the self component def either way.
function sfcScriptSource(content: string, file: string): string {
  if (/\.astro$/i.test(file)) return splitAstroFrontmatter(content).frontmatter;
  return [...content.matchAll(SCRIPT_BLOCK_RE)].map((m) => m[1] ?? "").join("\n");
}

export function buildGraphStreaming(files: string[]): DepGraph {
  const nodes: FileGraphNode[] = [];
  for (const file of files) {
    let content: string;
    try {
      content = readText(file);
    } catch {
      continue; // unreadable / vanished — skip, like the audit loop does
    }
    let ast = null;
    let doc: Doc;
    let sfc = false;
    if (GRAPH_ONLY.has(ext(file))) {
      // Plain .ts/.js/.mjs/.cjs: never an audit target (see GRAPH_ONLY_EXT), but real
      // cross-file structure (barrel re-exports, plain-JS component definitions) the
      // graph needs. Babel's typescript+jsx plugins parse pure TS/JS fine.
      ast = parseJsxAst(content);
      doc = emptyDoc(file, content);
    } else if (detectKind(file) === "jsx") {
      ast = parseJsxAst(content);
      doc = ast ? jsxAstToDoc(ast, content, file) : parseHtml(jsxToHtml(content), file, true);
    } else if (detectKind(file) === "sfc") {
      // sfc=true aligns with the audit's own parse (parseSource) — PascalCase tags
      // stay identifiable instead of being folded to lowercase. The script/frontmatter
      // AST is parsed SEPARATELY from the template doc (see sfcScriptSource) purely
      // for imports/re-exports; extractGraphNode also synthesizes a self component def
      // (opts.sfc) so cross-file resolution and capture coverage see the SFC itself.
      sfc = true;
      // .astro: blank the frontmatter fence first (same reasoning as parseSource —
      // TS generics like `Array<string>` must never look like a tag to parseHtml).
      const htmlSource = /\.astro$/i.test(file) ? splitAstroFrontmatter(content).blanked : content;
      doc = parseHtml(htmlSource, file, false, true);
      const scriptSrc = sfcScriptSource(content, file);
      if (scriptSrc) ast = parseJsxAst(scriptSrc);
    } else {
      doc = parseHtml(content, file, false);
    }
    nodes.push(extractGraphNode(ast, doc, file, { sfc }));
  }
  // tsconfig-paths aliases, found by walking up from the first file's dir (cwd-relative
  // bases to match the discovered file paths). Empty when there is no tsconfig.
  const aliases = readTsAliases(files[0] ? dirname(files[0]) : process.cwd());
  return buildGraph(nodes, aliases);
}
