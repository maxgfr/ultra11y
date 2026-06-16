// Detect the input kind and normalise it into a position-aware Doc the engine
// walks. HTML is parsed directly; JSX/TSX goes through the best-effort transform
// and is flagged lossy so findings on it can be reported as lower-confidence.
import { parseHtml, type Doc } from "./html.js";
import { jsxToHtml } from "./jsx.js";

export type SourceKind = "html" | "jsx";

export function detectKind(file: string, forceJsx = false): SourceKind {
  if (forceJsx) return "jsx";
  if (/\.(jsx|tsx)$/i.test(file)) return "jsx";
  return "html"; // .html/.htm/.xhtml, stdin, and unknown extensions default to HTML
}

export function parseSource(source: string, file: string, opts: { forceJsx?: boolean } = {}): Doc {
  const kind = detectKind(file, opts.forceJsx);
  if (kind === "jsx") return parseHtml(jsxToHtml(source), file, true);
  return parseHtml(source, file, false);
}
