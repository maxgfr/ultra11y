// Source-range edit primitives for `fix`. The parser gives us each element's
// [start, end) byte range (open+close, end EXCLUSIVE) but NO per-attribute or
// text-node offsets, and `end` points at the CLOSING tag. So codemods never splice
// blindly on start/end: they re-scan the *opening tag* locally from `start` to find
// the `>` and any attribute span. Edits are applied back-to-front so earlier offsets
// stay valid; overlapping edits on the same element are dropped, not mis-applied.

export interface Edit {
  start: number;
  end: number;
  replacement: string;
}

interface OpenTag {
  tagName: string;
  gt: number; // index of the '>' that closes the opening tag
  selfClose: boolean; // '/>' form
}

/** Locate the opening tag starting at `start` (must point at '<'), scanning to the
 *  first '>' that is not inside a quoted attribute value. */
export function openTag(source: string, start: number): OpenTag | null {
  if (source[start] !== "<") return null;
  let i = start + 1;
  let name = "";
  while (i < source.length && /[A-Za-z0-9:_-]/.test(source[i]!)) {
    name += source[i]!;
    i++;
  }
  if (!name) return null;
  let quote: string | null = null;
  for (; i < source.length; i++) {
    const ch = source[i]!;
    if (quote) {
      if (ch === quote) quote = null;
    } else if (ch === '"' || ch === "'") {
      quote = ch;
    } else if (ch === ">") {
      return { tagName: name.toLowerCase(), gt: i, selfClose: source[i - 1] === "/" };
    }
  }
  return null;
}

interface AttrSpan {
  attrStart: number; // includes the leading whitespace
  attrEnd: number;
  value: string | null; // unquoted value, if present
}

/** Find a whole attribute (name + optional value) inside the opening tag. */
export function findAttr(source: string, start: number, gt: number, name: string): AttrSpan | null {
  const seg = source.slice(start, gt);
  // The negative lookahead stops `alt` from matching inside `alt_backup`/`data-alt`:
  // the name must be a whole attribute token (next char is not name-continuing).
  const re = new RegExp(`(\\s+)(${name})(?![A-Za-z0-9_:-])(\\s*=\\s*("[^"]*"|'[^']*'|[^\\s>]+))?`, "i");
  const m = re.exec(seg);
  if (!m) return null;
  const attrStart = start + m.index;
  const attrEnd = attrStart + m[0].length;
  let value: string | null = null;
  if (m[4]) {
    const raw = m[4];
    value = raw.startsWith('"') || raw.startsWith("'") ? raw.slice(1, -1) : raw;
  }
  return { attrStart, attrEnd, value };
}

export function getAttr(source: string, start: number, name: string): string | null {
  const ot = openTag(source, start);
  if (!ot) return null;
  return findAttr(source, start, ot.gt, name)?.value ?? null;
}

/** Set (rewrite if present, else insert before '>') an attribute on the element
 *  whose opening tag begins at `start`. */
export function setAttr(source: string, start: number, name: string, value: string): Edit | null {
  const ot = openTag(source, start);
  if (!ot) return null;
  const existing = findAttr(source, start, ot.gt, name);
  if (existing) return { start: existing.attrStart, end: existing.attrEnd, replacement: ` ${name}="${value}"` };
  const insertAt = ot.selfClose ? ot.gt - 1 : ot.gt;
  return { start: insertAt, end: insertAt, replacement: ` ${name}="${value}"` };
}

/** Remove an attribute (and its leading whitespace) from the element at `start`. */
export function removeAttr(source: string, start: number, name: string): Edit | null {
  const ot = openTag(source, start);
  if (!ot) return null;
  const span = findAttr(source, start, ot.gt, name);
  if (!span) return null;
  return { start: span.attrStart, end: span.attrEnd, replacement: "" };
}

export interface ApplyResult {
  output: string;
  applied: number;
  conflicts: number;
}

/** Apply edits back-to-front; drop any edit that overlaps an already-applied
 *  (higher-offset) one so we never corrupt the source. */
export function applyEdits(source: string, edits: Edit[]): ApplyResult {
  const sorted = [...edits].sort((a, b) => b.start - a.start || b.end - a.end);
  let out = source;
  let lastStart = Infinity;
  const insertedAt = new Set<number>();
  let applied = 0;
  let conflicts = 0;
  for (const e of sorted) {
    // Ranges are half-open [start, end): `>` allows ADJACENT edits (one ending where
    // the next begins) but rejects true overlap into the already-applied region.
    // Zero-width insertions don't trip that test, so a second insertion at the same
    // point is caught separately.
    const isInsertion = e.start === e.end;
    if (e.end > lastStart || (isInsertion && insertedAt.has(e.start))) {
      conflicts++;
      continue;
    }
    out = out.slice(0, e.start) + e.replacement + out.slice(e.end);
    lastStart = e.start;
    if (isInsertion) insertedAt.add(e.start);
    applied++;
  }
  return { output: out, applied, conflicts };
}
