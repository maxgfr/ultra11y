import { describe, it, expect } from "vitest";
import { parseHtml, elementsByTag } from "../src/parse/html.js";
import { accessibleName, controlLabel, isFormField } from "../src/name.js";

function el(html: string, tag: string) {
  const doc = parseHtml(html, "t.html");
  return { doc, el: elementsByTag(doc, tag)[0]! };
}

describe("accessibleName", () => {
  it("uses aria-labelledby first, resolving referenced text", () => {
    const { doc, el: a } = el(`<span id="t">Mon profil</span><a href="/p" aria-labelledby="t">x</a>`, "a");
    expect(accessibleName(a, doc)).toBe("Mon profil");
  });

  it("uses aria-label over content", () => {
    const { doc, el: b } = el(`<button aria-label="Fermer">×</button>`, "button");
    expect(accessibleName(b, doc)).toBe("Fermer");
  });

  it("uses img alt; empty alt is an intentional empty name", () => {
    const a = el(`<img src="x" alt="Chat">`, "img");
    expect(accessibleName(a.el, a.doc)).toBe("Chat");
    const b = el(`<img src="x" alt="">`, "img");
    expect(accessibleName(b.el, b.doc)).toBe("");
  });

  it("folds descendant img alt into a link's name", () => {
    const { doc, el: a } = el(`<a href="/"><img src="i" alt="Accueil"></a>`, "a");
    expect(accessibleName(a, doc)).toBe("Accueil");
  });

  it("an empty icon link has no accessible name", () => {
    const { doc, el: a } = el(`<a href="/"><svg></svg></a>`, "a");
    expect(accessibleName(a, doc)).toBe("");
  });

  it("input[type=submit] takes value, defaulting when absent", () => {
    expect(accessibleName(el(`<input type="submit" value="Envoyer">`, "input").el, el(`<input type="submit" value="Envoyer">`, "input").doc)).toBe("Envoyer");
    const d = el(`<input type="submit">`, "input");
    expect(accessibleName(d.el, d.doc)).toBe("Submit");
  });

  it("falls back to title", () => {
    const { doc, el: a } = el(`<a href="/" title="Aide"></a>`, "a");
    expect(accessibleName(a, doc)).toBe("Aide");
  });
});

describe("controlLabel / isFormField", () => {
  it("detects label[for] association", () => {
    const { doc, el: i } = el(`<label for="n">Nom</label><input id="n" type="text">`, "input");
    expect(isFormField(i)).toBe(true);
    expect(controlLabel(i, doc)).toEqual({ hasLabel: true, via: "for" });
  });

  it("detects wrapping label", () => {
    const { doc, el: i } = el(`<label>Nom <input type="text"></label>`, "input");
    expect(controlLabel(i, doc).hasLabel).toBe(true);
    expect(controlLabel(i, doc).via).toBe("wrapping");
  });

  it("placeholder is NOT a label", () => {
    const { doc, el: i } = el(`<input type="text" placeholder="Nom">`, "input");
    expect(controlLabel(i, doc)).toEqual({ hasLabel: false, via: null });
  });

  it("aria-label counts as a label", () => {
    const { doc, el: i } = el(`<input type="text" aria-label="Recherche">`, "input");
    expect(controlLabel(i, doc).via).toBe("aria-label");
  });

  it("submit/hidden are not labelable fields", () => {
    expect(isFormField(el(`<input type="submit" value="x">`, "input").el)).toBe(false);
    expect(isFormField(el(`<input type="hidden">`, "input").el)).toBe(false);
    expect(isFormField(el(`<select><option>a</option></select>`, "select").el)).toBe(true);
  });
});
