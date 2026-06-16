import { parseSource } from "../../src/parse/source.js";
import { runRules } from "../../src/rules/registry.js";
import type { Finding } from "../../src/types.js";

/** Run a single rule over a source string and return its findings. */
export function findOf(src: string, ruleId: string, file = "t.html"): Finding[] {
  const doc = parseSource(src, file);
  return runRules(doc, new Set([ruleId]));
}

/** Wrap a body fragment in a minimal full HTML document (for page-scoped rules). */
export function page(body: string, head = "<title>T</title>", htmlAttrs = ' lang="fr"'): string {
  return `<!doctype html><html${htmlAttrs}><head>${head}</head><body>${body}</body></html>`;
}
