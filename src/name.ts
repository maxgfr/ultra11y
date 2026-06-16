// Accessible-name computation — a pragmatic subset of the ARIA accname algorithm,
// enough for the link/button/image/control naming rules. Not a full implementation
// (no rendered CSS), so it stays conservative: it only claims a name it can see.
import type { Doc, El, HNode } from "./parse/html.js";
import { attr, descendants, ancestors } from "./parse/html.js";

const collapse = (s: string): string => s.replace(/\s+/g, " ").trim();

/** Text content of a subtree, with <img> alt and <svg><title> folded in. */
function nameFromContent(el: El): string {
  let out = "";
  const walk = (n: HNode): void => {
    if (n.type === "text") {
      out += n.data;
      return;
    }
    if (n.tag === "img") {
      const a = attr(n, "alt");
      if (a) out += " " + a;
      return;
    }
    if (n.tag === "svg") {
      const title = descendants(n).find((d) => d.tag === "title");
      if (title) out += " " + nameFromContent(title);
      return;
    }
    // aria-hidden subtrees contribute nothing
    if (attr(n, "aria-hidden") === "true") return;
    for (const c of n.children) walk(c);
  };
  for (const c of el.children) walk(c);
  return collapse(out);
}

function ariaLabelledbyText(el: El, doc: Doc): string {
  const ids = attr(el, "aria-labelledby");
  if (!ids) return "";
  const parts: string[] = [];
  for (const id of ids.split(/\s+/).filter(Boolean)) {
    const ref = doc.byId.get(id);
    if (ref) parts.push(nameFromContent(ref) || (attr(ref, "aria-label") ?? "").trim());
  }
  return collapse(parts.join(" "));
}

const BUTTON_INPUT = new Set(["button", "submit", "reset"]);
const NAMELESS_BY_DEFAULT = new Set(["submit", "reset"]); // UA supplies a default label

/** Compute the accessible name of an element (links, buttons, images, generic). */
export function accessibleName(el: El, doc: Doc): string {
  // 1. aria-labelledby
  const labelledby = ariaLabelledbyText(el, doc);
  if (labelledby) return labelledby;
  // 2. aria-label
  const ariaLabel = (attr(el, "aria-label") ?? "").trim();
  if (ariaLabel) return ariaLabel;
  // 3. element-specific
  if (el.tag === "img" || el.tag === "area") {
    return (attr(el, "alt") ?? "").trim(); // alt="" → intentional empty name
  }
  if (el.tag === "input") {
    const type = (attr(el, "type") ?? "text").toLowerCase();
    if (BUTTON_INPUT.has(type)) {
      const value = (attr(el, "value") ?? "").trim();
      if (value) return value;
      if (NAMELESS_BY_DEFAULT.has(type)) return type === "submit" ? "Submit" : "Reset";
      return (attr(el, "title") ?? "").trim();
    }
  }
  // 4. content + title fallback
  const content = nameFromContent(el);
  if (content) return content;
  return (attr(el, "title") ?? "").trim();
}

const FIELD_TAGS = new Set(["input", "select", "textarea"]);
const NON_LABELABLE_INPUT = new Set(["hidden", "submit", "reset", "button", "image"]);

/** Is this a labelable form field (excludes buttons/hidden)? */
export function isFormField(el: El): boolean {
  if (!FIELD_TAGS.has(el.tag)) return false;
  if (el.tag === "input") {
    const type = (attr(el, "type") ?? "text").toLowerCase();
    return !NON_LABELABLE_INPUT.has(type);
  }
  return true;
}

export interface LabelInfo {
  hasLabel: boolean;
  via: "for" | "wrapping" | "aria-labelledby" | "aria-label" | "title" | null;
}

/** Does a form field have a programmatic label/name? (placeholder does NOT count.) */
export function controlLabel(el: El, doc: Doc): LabelInfo {
  if (attr(el, "aria-labelledby") && ariaLabelledbyText(el, doc)) return { hasLabel: true, via: "aria-labelledby" };
  if ((attr(el, "aria-label") ?? "").trim()) return { hasLabel: true, via: "aria-label" };
  const id = attr(el, "id");
  if (id) {
    const lbl = doc.elements.find((e) => e.tag === "label" && attr(e, "for") === id);
    if (lbl) return { hasLabel: true, via: "for" };
  }
  if (ancestors(el).some((a) => a.tag === "label")) return { hasLabel: true, via: "wrapping" };
  if ((attr(el, "title") ?? "").trim()) return { hasLabel: true, via: "title" };
  return { hasLabel: false, via: null };
}
