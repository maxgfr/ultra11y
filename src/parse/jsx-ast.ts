// Parse JSX/TSX into a real Babel AST. Unlike the lossy regex transform
// (parse/jsx.ts), this gives accurate node positions (start/end byte offsets +
// loc) and a faithful tree — the basis for fix-safe ranges and the cross-file
// dependency graph. @babel/parser is pure JS and bundled into the engine, so the
// shipped scripts/ultra11y.mjs still runs with no install.
import { parse } from "@babel/parser";

// We deliberately describe only the node shape the bridge/graph read, instead of
// depending on @babel/types. Every Babel node carries a string `type`, numeric
// `start`/`end` offsets, and a `loc`; the rest is walked structurally.
export interface AstNode {
  type: string;
  start: number | null;
  end: number | null;
  loc?: { start: { line: number; column: number }; end: { line: number; column: number } } | null;
  [key: string]: unknown;
}

export interface AstFile extends AstNode {
  type: "File";
  program: AstNode; // Program; .body is AstNode[]
  errors?: unknown[];
}

// Parse with error recovery so a single malformed expression never aborts the
// audit. Returns null only on a catastrophic throw — the caller then falls back
// to the lossy HTML transform, so an audit always produces a result.
export function parseJsxAst(source: string): AstFile | null {
  try {
    return parse(source, {
      sourceType: "module",
      errorRecovery: true,
      plugins: ["typescript", "jsx"],
    }) as unknown as AstFile;
  } catch {
    return null;
  }
}

// ---- generic AST helpers shared by the JSX bridge and the graph extractor

// Structural keys we never recurse into (position/comment/token metadata).
const SKIP_KEYS = new Set(["type", "start", "end", "loc", "range", "leadingComments", "trailingComments", "innerComments", "extra", "comments", "tokens"]);

export function asNode(value: unknown): AstNode | undefined {
  return value && typeof value === "object" && !Array.isArray(value) ? (value as AstNode) : undefined;
}

export function asNodes(value: unknown): AstNode[] {
  return Array.isArray(value) ? (value as AstNode[]) : [];
}

/** Depth-first visit every AST node under `root` (arrays and child nodes), skipping
 *  position/comment metadata. The visitor cannot prune; for scoped walks pass a subtree. */
export function walkAst(root: unknown, visit: (node: AstNode) => void): void {
  if (Array.isArray(root)) {
    for (const item of root) walkAst(item, visit);
    return;
  }
  const n = asNode(root);
  if (!n || typeof n.type !== "string") return;
  visit(n);
  for (const key in n) {
    if (SKIP_KEYS.has(key)) continue;
    walkAst(n[key], visit);
  }
}
