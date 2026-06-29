// Accessible-name computation — a pragmatic subset of the ARIA accname algorithm,
// enough for the link/button/image/control naming rules. Not a full implementation
// (no rendered CSS), so it stays conservative: it only claims a name it can see.
import type { Doc, El, HNode } from "./parse/html.js";
import { attr, boundAttr, hasBoundAttr, descendants, ancestors } from "./parse/html.js";
import { isIntrinsic } from "./parse/jsx-bridge.js";

const collapse = (s: string): string => s.replace(/\s+/g, " ").trim();

/** JSX/SFC: the element's content/name may be injected at runtime in a way the static
 *  parse can't see — a `<slot>` projection or a child component (which can render
 *  anything). Rules that assert "this element is empty / unnamed" must bail on these. */
export function mayInjectContent(el: El): boolean {
  return descendants(el).some((d) => d.tag === "slot" || (d.tag !== "#fragment" && !isIntrinsic(d.tag)));
}

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
  // 1. aria-labelledby (a dynamically-bound :aria-labelledby can't be resolved, but it
  //    names the element — treat as present so we don't hallucinate a missing name)
  const labelledby = ariaLabelledbyText(el, doc);
  if (labelledby) return labelledby;
  if (hasBoundAttr(el, "aria-labelledby") && !attr(el, "aria-labelledby")) return " ";
  // 2. aria-label (incl. dynamic `:aria-label`/`v-bind:` binding → value unknown but present)
  const ariaLabel = (boundAttr(el, "aria-label") ?? "").trim();
  if (ariaLabel) return ariaLabel;
  // 3. element-specific
  if (el.tag === "img" || el.tag === "area") {
    return (boundAttr(el, "alt") ?? "").trim(); // alt="" → intentional empty name; :alt="x" → present
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
  if ((attr(el, "aria-labelledby") && ariaLabelledbyText(el, doc)) || hasBoundAttr(el, "aria-labelledby")) return { hasLabel: true, via: "aria-labelledby" };
  if ((boundAttr(el, "aria-label") ?? "").trim()) return { hasLabel: true, via: "aria-label" };
  const id = attr(el, "id");
  if (id) {
    const lbl = doc.elements.find((e) => e.tag === "label" && attr(e, "for") === id);
    if (lbl) return { hasLabel: true, via: "for" };
  }
  if (ancestors(el).some((a) => a.tag === "label")) return { hasLabel: true, via: "wrapping" };
  if ((attr(el, "title") ?? "").trim()) return { hasLabel: true, via: "title" };
  return { hasLabel: false, via: null };
}
