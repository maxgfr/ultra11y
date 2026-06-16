// Best-effort JSX/TSX → HTML-ish normalisation so the HTML pipeline + rules can
// run on React components. This is deliberately lossy (flagged in the Doc): JSX
// expression children become text, surrounding TS code may leave noise tags, and
// PascalCase components are lowercased. It is enough to catch the structural
// a11y issues the static rules target (missing alt, clickable div, unlabeled
// field…), never a substitute for auditing rendered output.
export function jsxToHtml(source: string): string {
  let s = source;
  // {/* JSX comments */}
  s = s.replace(/\{\/\*[\s\S]*?\*\/\}/g, " ");
  // React attribute names → HTML names the rules look for
  s = s.replace(/\bclassName=/g, "class=");
  s = s.replace(/\bhtmlFor=/g, "for=");
  s = s.replace(/\btabIndex=/g, "tabindex=");
  // {expr} attribute values stay as a present, non-empty token so "attribute
  // present" checks (alt={x}, aria-label={t}) are honoured. htmlparser2 reads
  // `attr={expr}` as attr="{expr}" already; nothing to do here.
  return s;
}
