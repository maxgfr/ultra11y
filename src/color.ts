// Zero-dependency colour maths for the static contrast check (theme 3). Parses the
// literal colour values an author can write inline, and computes the WCAG 2.x
// contrast ratio. Anything non-literal (var(), currentColor, named-but-unknown,
// gradients) returns null so the engine stays conservative and never invents a NC.

export interface RGBA {
  r: number;
  g: number;
  b: number;
  a: number;
}

// The subset of CSS named colours common in hand-written inline styles. Unknown
// names fall through to null (→ criterion stays a residual risk, not a false NC).
const NAMED: Record<string, RGBA> = {
  transparent: { r: 0, g: 0, b: 0, a: 0 },
  white: { r: 255, g: 255, b: 255, a: 1 },
  black: { r: 0, g: 0, b: 0, a: 1 },
  red: { r: 255, g: 0, b: 0, a: 1 },
  lime: { r: 0, g: 255, b: 0, a: 1 },
  green: { r: 0, g: 128, b: 0, a: 1 },
  blue: { r: 0, g: 0, b: 255, a: 1 },
  yellow: { r: 255, g: 255, b: 0, a: 1 },
  cyan: { r: 0, g: 255, b: 255, a: 1 },
  aqua: { r: 0, g: 255, b: 255, a: 1 },
  magenta: { r: 255, g: 0, b: 255, a: 1 },
  fuchsia: { r: 255, g: 0, b: 255, a: 1 },
  silver: { r: 192, g: 192, b: 192, a: 1 },
  gray: { r: 128, g: 128, b: 128, a: 1 },
  grey: { r: 128, g: 128, b: 128, a: 1 },
  maroon: { r: 128, g: 0, b: 0, a: 1 },
  olive: { r: 128, g: 128, b: 0, a: 1 },
  purple: { r: 128, g: 0, b: 128, a: 1 },
  teal: { r: 0, g: 128, b: 128, a: 1 },
  navy: { r: 0, g: 0, b: 128, a: 1 },
  orange: { r: 255, g: 165, b: 0, a: 1 },
};

function hex(part: string): number {
  return parseInt(part.length === 1 ? part + part : part, 16);
}

/** Parse a literal CSS colour to RGBA, or null if it isn't a static literal. */
export function parseColor(input: string): RGBA | null {
  const s = input.trim().toLowerCase();
  if (!s) return null;
  if (s in NAMED) return { ...NAMED[s]! };

  if (s.startsWith("#")) {
    const h = s.slice(1);
    if (/^[0-9a-f]{3}$/.test(h)) return { r: hex(h[0]!), g: hex(h[1]!), b: hex(h[2]!), a: 1 };
    if (/^[0-9a-f]{4}$/.test(h)) return { r: hex(h[0]!), g: hex(h[1]!), b: hex(h[2]!), a: hex(h[3]!) / 255 };
    if (/^[0-9a-f]{6}$/.test(h)) return { r: hex(h.slice(0, 2)), g: hex(h.slice(2, 4)), b: hex(h.slice(4, 6)), a: 1 };
    if (/^[0-9a-f]{8}$/.test(h)) return { r: hex(h.slice(0, 2)), g: hex(h.slice(2, 4)), b: hex(h.slice(4, 6)), a: hex(h.slice(6, 8)) / 255 };
    return null;
  }

  const m = /^rgba?\(([^)]+)\)$/.exec(s);
  if (m) {
    const parts = m[1]!.split(/[,/\s]+/).filter(Boolean);
    if (parts.length < 3) return null;
    const chan = (p: string): number => (p.endsWith("%") ? Math.round((parseFloat(p) / 100) * 255) : parseFloat(p));
    const r = chan(parts[0]!);
    const g = chan(parts[1]!);
    const b = chan(parts[2]!);
    const a = parts[3] !== undefined ? (parts[3].endsWith("%") ? parseFloat(parts[3]) / 100 : parseFloat(parts[3])) : 1;
    if ([r, g, b, a].some((n) => Number.isNaN(n))) return null;
    return { r, g, b, a };
  }
  return null;
}

function channelLuminance(c: number): number {
  const cs = c / 255;
  return cs <= 0.03928 ? cs / 12.92 : ((cs + 0.055) / 1.055) ** 2.4;
}

/** WCAG relative luminance of an opaque colour. */
export function relativeLuminance({ r, g, b }: RGBA): number {
  return 0.2126 * channelLuminance(r) + 0.7152 * channelLuminance(g) + 0.0722 * channelLuminance(b);
}

/** WCAG 2.x contrast ratio between two opaque colours (1 … 21). */
export function contrastRatio(a: RGBA, b: RGBA): number {
  const la = relativeLuminance(a);
  const lb = relativeLuminance(b);
  const [hi, lo] = la >= lb ? [la, lb] : [lb, la];
  return (hi + 0.05) / (lo + 0.05);
}

/** Split an inline `style` attribute into a lowercased property → value map. */
export function parseInlineStyle(style: string): Map<string, string> {
  const out = new Map<string, string>();
  for (const decl of style.split(";")) {
    const i = decl.indexOf(":");
    if (i === -1) continue;
    const prop = decl.slice(0, i).trim().toLowerCase();
    const val = decl.slice(i + 1).trim();
    if (prop && val) out.set(prop, val);
  }
  return out;
}
