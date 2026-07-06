// The zero-touch capture harvester (captureSetup() in src/render.ts, written to
// .ultra11y/capture-setup.mjs in a user's repo) cannot import from src at runtime —
// it carries its OWN copy of the provenance-comment escaping, which must stay
// byte-identical to capture.ts's escapeCommentValue (see the header note in
// src/capture.ts). This test extracts the harvester's generated `esc` function
// straight from captureSetup()'s output (never hand-copied here) and confronts it
// against escapeCommentValue on a corpus, plus a write→parse round trip through
// parseCaptureProvenance for both schemes.
import { describe, it, expect } from "vitest";
import { captureSetup } from "../src/render.js";
import { escapeCommentValue, parseCaptureProvenance, formatCaptureComment } from "../src/capture.js";

function extractHarvesterEscape(): (s: string) => string {
  const src = captureSetup();
  const m = /const esc = \(s\) => (.+);/.exec(src);
  if (!m) throw new Error("captureSetup(): could not find the `const esc = (s) => …;` line — this sync test needs updating alongside it");
  return new Function("s", `return ${m[1]};`) as (s: string) => string;
}

const CORPUS = [
  "plain/path.tsx",
  "a--b",
  "-->",
  '"quoted"',
  "<tag>&amp;",
  'mixed --> "quotes" <tags> & unicode: café 🚀 — em—dash',
  "multiple--hyphens----in--a--row",
  'édge cases: <>&"--',
  '&<>"--&<>"--',
];

describe("capture escaping — harvester (captureSetup) and capture.ts stay byte-identical", () => {
  const harvesterEsc = extractHarvesterEscape();

  it.each(CORPUS)("escapes %j identically in both schemes", (s) => {
    expect(harvesterEsc(s)).toBe(escapeCommentValue(s));
  });

  it.each(CORPUS)("round-trips %j: write via formatCaptureComment, read via parseCaptureProvenance", (s) => {
    const comment = formatCaptureComment({ v: 1, sourceFile: s });
    expect(parseCaptureProvenance(comment)?.sourceFile).toBe(s);
  });

  it.each(CORPUS)("round-trips %j through the harvester's OWN inline comment-building scheme", (s) => {
    // Mirrors captureSetup()'s generated `'source="' + esc(source) + '"'` construction.
    const harvesterComment = `<!-- ultra11y:capture v="1" source="${harvesterEsc(s)}" -->`;
    expect(parseCaptureProvenance(harvesterComment)?.sourceFile).toBe(s);
  });
});
