import { describe, it, expect } from "vitest";
import { parseJsxAst } from "../src/parse/jsx-ast.js";
import { jsxAstToDoc } from "../src/parse/jsx-bridge.js";
import { extractGraphNode, type FileGraphNode } from "../src/graph/imports.js";
import { buildGraph, resolveUsage, idDefinedAnywhere, htmlLangProvidedFor } from "../src/graph/graph.js";

function node(src: string, file: string): FileGraphNode {
  const ast = parseJsxAst(src)!;
  const doc = jsxAstToDoc(ast, src, file);
  return extractGraphNode(ast, doc, file);
}

const ICON = `export default function IconButton({ label, ...rest }) { return <button {...rest}><svg /></button>; }`;
const BUTTON = `export function Button() { return <button>Save</button>; }`;
const NAMED = `export function CloseButton({ onClick }) { return <button onClick={onClick} aria-label="Close"><svg /></button>; }`;
const LAYOUT = `export default function Layout({ children }) { return <html lang="fr"><body><main id="main">{children}</main></body></html>; }`;
const PAGE = `import IconButton from "./IconButton";\nimport Layout from "./Layout";\nexport default function Page() { return <Layout><IconButton /></Layout>; }`;

describe("graph extraction — component signals", () => {
  it("flags an icon-only control that accepts a name via spread props", () => {
    const n = node(ICON, "IconButton.tsx");
    const def = n.components.get("default")!;
    expect(def.rendersIconOnlyControl).toBe(true);
    expect(def.spreadsProps).toBe(true);
    expect(def.acceptsName).toBe(true);
  });

  it("does not flag a control with literal text", () => {
    const def = node(BUTTON, "Button.tsx").components.get("Button")!;
    expect(def.rendersIconOnlyControl).toBe(false);
  });

  it("does not flag an icon control that already carries a literal aria-label", () => {
    const def = node(NAMED, "CloseButton.tsx").components.get("CloseButton")!;
    expect(def.rendersIconOnlyControl).toBe(false); // literal aria-name present
  });

  it("records defined ids and html lang from the rendered tree", () => {
    const n = node(LAYOUT, "Layout.tsx");
    expect(n.definesIds).toContain("main");
    expect(n.providesHtmlLang).toBe(true);
  });
});

describe("graph queries", () => {
  const graph = buildGraph([node(ICON, "IconButton.tsx"), node(BUTTON, "Button.tsx"), node(LAYOUT, "Layout.tsx"), node(PAGE, "page.tsx")]);

  it("resolves a default-imported component usage to its definition across files", () => {
    const def = resolveUsage(graph, "page.tsx", "IconButton");
    expect(def?.file).toBe("IconButton.tsx");
    expect(def?.rendersIconOnlyControl).toBe(true);
  });

  it("resolves a locally-defined component", () => {
    expect(resolveUsage(graph, "Button.tsx", "Button")?.name).toBe("Button");
  });

  it("returns undefined for an unresolved/bare component", () => {
    expect(resolveUsage(graph, "page.tsx", "Unknown")).toBeUndefined();
  });

  it("finds ids defined anywhere in the graph", () => {
    expect(idDefinedAnywhere(graph, "main")).toBe(true);
    expect(idDefinedAnywhere(graph, "nav")).toBe(false);
  });

  it("reports html lang provided by a transitively imported layout", () => {
    expect(htmlLangProvidedFor(graph, "page.tsx")).toBe(true);
    expect(htmlLangProvidedFor(graph, "Button.tsx")).toBe(false);
  });
});

describe("graph queries — namespace imports", () => {
  const UI = `export function Button() { return <button>Save</button>; }`;
  const NS = `import * as UI from "./ui";\nexport default function P(){ return <UI.Button/>; }`;
  const graph = buildGraph([node(UI, "ui.tsx"), node(NS, "nspage.tsx")]);

  it("resolves a namespace-member usage <UI.Button/> to its definition", () => {
    const def = resolveUsage(graph, "nspage.tsx", "UI.Button");
    expect(def?.file).toBe("ui.tsx");
    expect(def?.name).toBe("Button");
  });

  it("returns undefined for a namespace member that isn't exported", () => {
    expect(resolveUsage(graph, "nspage.tsx", "UI.Missing")).toBeUndefined();
  });
});
