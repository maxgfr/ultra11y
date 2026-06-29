import { describe, it, expect } from "vitest";
import { parseSource } from "../src/parse/source.js";
import { parseJsxAst } from "../src/parse/jsx-ast.js";
import { jsxAstToDoc } from "../src/parse/jsx-bridge.js";
import { elementsByTag, attr, getById, visibleText } from "../src/parse/html.js";

describe("JSX/TSX AST bridge", () => {
  it("lowercases intrinsic elements but preserves PascalCase component names", () => {
    const doc = parseSource(`function P(){ return <div><IconButton aria-label="Fermer" /></div>; }`, "P.tsx");
    expect(doc.lossy).toBe(false);
    expect(doc.kind).toBe("jsx-ast");
    expect(elementsByTag(doc, "div").length).toBe(1);
    // component keeps original casing → the existing tag-literal rules skip it,
    // only cross-file rules resolve it.
    const icon = doc.elements.find((e) => e.tag === "IconButton")!;
    expect(icon).toBeDefined();
    expect(attr(icon, "aria-label")).toBe("Fermer");
  });

  it("gives accurate source offsets indexing the ORIGINAL file (fix-safe)", () => {
    const src = `const x = <img src="a.png" />;`;
    const doc = parseSource(src, "C.tsx");
    const img = elementsByTag(doc, "img")[0]!;
    // start/end bracket the real <img …/> in the untransformed source.
    expect(src.slice(img.start, img.end)).toBe(`<img src="a.png" />`);
    expect(img.line).toBe(1);
  });

  it("computes 1-based line/col across multiple lines", () => {
    const src = `export default function Page() {\n  return (\n    <main id="m">\n      <h1>Titre</h1>\n    </main>\n  );\n}\n`;
    const doc = parseSource(src, "Page.tsx");
    const h1 = elementsByTag(doc, "h1")[0]!;
    expect(h1.line).toBe(4);
    expect(h1.col).toBe(7);
    expect(getById(doc, "m")?.tag).toBe("main");
  });

  it("treats {expr} attribute values as present and surfaces JSX nested in expressions", () => {
    const doc = parseSource(`function C(){ return <button>{cond && <img src="x" />}</button>; }`, "C.tsx");
    const button = elementsByTag(doc, "button")[0]!;
    // non-empty text content (so button-empty-name does not fire)…
    expect(visibleText(button)).not.toBe("");
    // …and the conditionally-rendered <img> is a real child (img-alt-missing can fire).
    expect(elementsByTag(doc, "img").length).toBe(1);
  });

  it("represents fragments as a transparent container", () => {
    const doc = parseSource(`function P(){ return <><h1>A</h1><p>b</p></>; }`, "P.tsx");
    expect(elementsByTag(doc, "h1").length).toBe(1);
    expect(elementsByTag(doc, "p").length).toBe(1);
  });

  it("recognises a JSX <html lang> as a full document (page-scoped rules apply)", () => {
    const doc = parseSource(`export default function Root(){ return <html lang="fr"><body>{children}</body></html>; }`, "layout.tsx");
    const html = elementsByTag(doc, "html")[0]!;
    expect(attr(html, "lang")).toBe("fr");
  });

  it("falls back to the lossy path when the AST cannot be parsed", () => {
    // two adjacent top-level JSX elements after a block comment is not valid as a
    // module; parseJsxAst returns null and parseSource degrades gracefully.
    expect(parseJsxAst(`{/* x */}<a>1</a><b>2</b>`)).toBeNull();
    const doc = parseSource(`{/* form */}<label htmlFor="e">Email</label><input id="e" type="email" />`, "C.tsx");
    expect(doc.lossy).toBe(true);
    expect(doc.kind).toBe("jsx-lossy");
    expect(getById(doc, "e")).toBeDefined();
  });

  it("jsxAstToDoc keeps the original source for snippets", () => {
    const src = `const x = <img alt="ok" />;`;
    const ast = parseJsxAst(src)!;
    const doc = jsxAstToDoc(ast, src, "C.tsx");
    expect(doc.source).toBe(src);
  });
});
