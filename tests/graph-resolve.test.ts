import { describe, it, expect } from "vitest";
import { resolveSpecifier } from "../src/graph/resolve.js";
import type { AliasMap } from "../src/graph/tsconfig.js";
import { buildGraphStreaming } from "../src/graph/build.js";
import { resolveUsage } from "../src/graph/graph.js";
import { discover } from "../src/discover.js";
import { GRAPH_ONLY_EXT } from "../src/glob.js";

const known = new Set(["src/IconButton.tsx", "src/ui/Button.jsx", "src/lib/index.ts", "src/pages/home.tsx", "src/Layout.tsx"]);

describe("resolveSpecifier", () => {
  it("resolves a relative sibling import adding the extension", () => {
    expect(resolveSpecifier("src/pages/home.tsx", "../IconButton", known)).toBe("src/IconButton.tsx");
  });

  it("resolves a same-dir import", () => {
    expect(resolveSpecifier("src/pages/home.tsx", "../Layout", known)).toBe("src/Layout.tsx");
  });

  it("resolves a directory index import", () => {
    expect(resolveSpecifier("src/pages/home.tsx", "../lib", known)).toBe("src/lib/index.ts");
  });

  it("resolves an explicit-extension import", () => {
    expect(resolveSpecifier("src/pages/home.tsx", "../ui/Button.jsx", known)).toBe("src/ui/Button.jsx");
  });

  it("resolves an ESM/NodeNext '.js' specifier to its .tsx/.ts source", () => {
    expect(resolveSpecifier("src/pages/home.tsx", "../IconButton.js", known)).toBe("src/IconButton.tsx");
    expect(resolveSpecifier("src/pages/home.tsx", "../lib/index.js", known)).toBe("src/lib/index.ts");
  });

  it("returns null for bare and alias specifiers (out of scope v1)", () => {
    expect(resolveSpecifier("src/pages/home.tsx", "react", known)).toBeNull();
    expect(resolveSpecifier("src/pages/home.tsx", "@/components/Button", known)).toBeNull();
  });

  it("returns null when the target is not a known file", () => {
    expect(resolveSpecifier("src/pages/home.tsx", "../Missing", known)).toBeNull();
  });

  it("resolves a tsconfig-paths alias specifier when an alias map is supplied", () => {
    const aliases: AliasMap = [{ prefix: "@/", wildcard: true, bases: ["src"] }];
    expect(resolveSpecifier("src/pages/home.tsx", "@/ui/Button", known, aliases)).toBe("src/ui/Button.jsx");
    expect(resolveSpecifier("src/pages/home.tsx", "@/IconButton", known, aliases)).toBe("src/IconButton.tsx");
    // a bare node_modules specifier stays out of scope even with aliases present
    expect(resolveSpecifier("src/pages/home.tsx", "react", known, aliases)).toBeNull();
    // an alias prefix that doesn't match falls through to null
    expect(resolveSpecifier("src/pages/home.tsx", "~/Nope", known, aliases)).toBeNull();
  });

  it("resolves an exact (non-wildcard) alias", () => {
    const aliases: AliasMap = [{ prefix: "@app", wildcard: false, bases: ["src/lib"] }];
    expect(resolveSpecifier("src/pages/home.tsx", "@app", known, aliases)).toBe("src/lib/index.ts");
  });
});

describe("buildGraphStreaming — GRAPH_ONLY_EXT (.ts/.js barrels never audited, always graphed)", () => {
  const ROOT = new URL("./fixtures/graph-barrel/", import.meta.url).pathname;

  it("discovers the plain .ts barrel only when GRAPH_ONLY_EXT is passed to discover", () => {
    const auditFiles = discover([ROOT]).files;
    expect(auditFiles.some((f) => f.endsWith("components/index.ts"))).toBe(false); // never an audit target
    const graphFiles = discover([ROOT], { ext: GRAPH_ONLY_EXT }).files;
    expect(graphFiles.some((f) => f.endsWith("components/index.ts"))).toBe(true);
  });

  it("resolves Page.tsx's `import { Button } from \"./components\"` through the barrel to Button.tsx's real definition", () => {
    const graph = buildGraphStreaming(discover([ROOT], { ext: GRAPH_ONLY_EXT }).files);
    const pageFile = [...graph.nodes.keys()].find((f) => f.endsWith("Page.tsx"))!;
    const def = resolveUsage(graph, pageFile, "Button");
    expect(def?.file.endsWith("components/Button.tsx")).toBe(true);
    expect(def?.rendersIconOnlyControl).toBe(true); // Button renders an <svg> with no literal name
  });
});
