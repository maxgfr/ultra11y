import { describe, it, expect } from "vitest";
import { parseSource, detectKind } from "../src/parse/source.js";
import { elementsByTag, attr, getById } from "../src/parse/html.js";
import { accessibleName, controlLabel } from "../src/name.js";

describe("detectKind", () => {
  it("classifies by extension, with forceJsx override", () => {
    expect(detectKind("App.tsx")).toBe("jsx");
    expect(detectKind("a.jsx")).toBe("jsx");
    expect(detectKind("page.html")).toBe("html");
    expect(detectKind("-")).toBe("html");
    expect(detectKind("page.html", true)).toBe("jsx");
  });
});

describe("parseSource (JSX best-effort)", () => {
  it("flags the doc lossy and maps className→class, htmlFor→for, tabIndex→tabindex", () => {
    const doc = parseSource(`<div className="box" tabIndex={0}><label htmlFor="n">Nom</label><input id="n" /></div>`, "C.tsx");
    expect(doc.lossy).toBe(true);
    const div = elementsByTag(doc, "div")[0]!;
    expect(attr(div, "class")).toBe("box");
    expect(attr(div, "tabindex")).toBe("{0}");
    const label = elementsByTag(doc, "label")[0]!;
    expect(attr(label, "for")).toBe("n");
  });

  it("treats alt={expr} as a present (non-empty) name", () => {
    const doc = parseSource(`<img src={logo} alt={t("home")} />`, "C.tsx");
    const img = elementsByTag(doc, "img")[0]!;
    expect(attr(img, "alt")).toBeDefined();
    expect(accessibleName(img, doc)).not.toBe("");
  });

  it("an <img> with no alt remains nameless (rule will flag)", () => {
    const doc = parseSource(`<img src={logo} />`, "C.tsx");
    const img = elementsByTag(doc, "img")[0]!;
    expect(attr(img, "alt")).toBeUndefined();
    expect(accessibleName(img, doc)).toBe("");
  });

  it("exposes onClick on a div (lowercased) for the clickable-div rule", () => {
    const doc = parseSource(`<div onClick={handle}>Valider</div>`, "C.tsx");
    const div = elementsByTag(doc, "div")[0]!;
    expect(attr(div, "onclick")).toBeDefined();
  });

  it("strips {/* comments */} and keeps a label association", () => {
    const doc = parseSource(`{/* form */}<label htmlFor="e">Email</label><input id="e" type="email" />`, "C.tsx");
    expect(getById(doc, "e")).toBeDefined();
    const input = elementsByTag(doc, "input")[0]!;
    expect(controlLabel(input, doc)).toEqual({ hasLabel: true, via: "for" });
  });
});
