// Detect the input kind and normalise it into a position-aware Doc the engine
// walks. HTML is parsed directly. JSX/TSX is parsed into a real Babel AST and
// lowered to the same Doc model (accurate offsets, not lossy); only if that hard
// fails do we fall back to the best-effort lossy regex transform, so an audit
// always produces a result.
import { parseHtml, type Doc } from "./html.js";
import { jsxToHtml } from "./jsx.js";
import { parseJsxAst } from "./jsx-ast.js";
import { jsxAstToDoc } from "./jsx-bridge.js";

export type SourceKind = "html" | "jsx";

export function detectKind(file: string, forceJsx = false): SourceKind {
  if (forceJsx) return "jsx";
  if (/\.(jsx|tsx)$/i.test(file)) return "jsx";
  return "html"; // .html/.htm/.xhtml, stdin, and unknown extensions default to HTML
}

export function parseSource(source: string, file: string, opts: { forceJsx?: boolean } = {}): Doc {
  const kind = detectKind(file, opts.forceJsx);
  if (kind === "jsx") {
    const ast = parseJsxAst(source);
    if (ast) return jsxAstToDoc(ast, source, file);
    // Catastrophic parse failure → lossy fallback (flagged lossy in the Doc).
    return parseHtml(jsxToHtml(source), file, true);
  }
  return parseHtml(source, file, false);
}
