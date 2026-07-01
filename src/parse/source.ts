// Detect the input kind and normalise it into a position-aware Doc the engine
// walks. HTML is parsed directly. JSX/TSX is parsed into a real Babel AST and
// lowered to the same Doc model (accurate offsets, not lossy); only if that hard
// fails do we fall back to the best-effort lossy regex transform, so an audit
// always produces a result.
import { parseHtml, type Doc } from "./html.js";
import { jsxToHtml } from "./jsx.js";
import { parseJsxAst } from "./jsx-ast.js";
import { jsxAstToDoc } from "./jsx-bridge.js";
import { parseCaptureProvenance } from "../capture.js";

export type SourceKind = "html" | "jsx" | "sfc";

export function detectKind(file: string, forceJsx = false): SourceKind {
  if (forceJsx) return "jsx";
  if (/\.(jsx|tsx)$/i.test(file)) return "jsx";
  // Single-file components: parsed via the HTML path but with component case
  // preserved (so PascalCase components keep their identity and rules skip them).
  if (/\.(vue|svelte|astro)$/i.test(file)) return "sfc";
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
  // SFC templates parse as HTML but keep component case (preserveCase) and a
  // distinct kind so the injected-content guards treat them like JSX, not HTML.
  const doc = parseHtml(source, file, false, kind === "sfc");
  // A rendered capture is real HTML (kind "html"): attach its provenance so findings
  // are re-attributed to the source component. SFC/JSX are source, never captures.
  if (kind === "html") {
    const capture = parseCaptureProvenance(source);
    if (capture) doc.capture = capture;
  }
  return doc;
}
