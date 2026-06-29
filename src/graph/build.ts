// Pass 1 of `audit --graph`: stream every discovered file, parse it, extract a
// compact FileGraphNode, and DISCARD the AST/Doc — so only O(file count) small
// records are ever held, never whole-repo source. Then assemble the DepGraph.
import { readText } from "../util.js";
import { detectKind } from "../parse/source.js";
import { parseJsxAst } from "../parse/jsx-ast.js";
import { jsxAstToDoc } from "../parse/jsx-bridge.js";
import { parseHtml, type Doc } from "../parse/html.js";
import { jsxToHtml } from "../parse/jsx.js";
import { extractGraphNode, type FileGraphNode } from "./imports.js";
import { buildGraph, type DepGraph } from "./graph.js";

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
    if (detectKind(file) === "jsx") {
      ast = parseJsxAst(content);
      doc = ast ? jsxAstToDoc(ast, content, file) : parseHtml(jsxToHtml(content), file, true);
    } else {
      doc = parseHtml(content, file, false);
    }
    nodes.push(extractGraphNode(ast, doc, file));
  }
  return buildGraph(nodes);
}
