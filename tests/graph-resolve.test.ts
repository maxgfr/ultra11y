import { describe, it, expect } from "vitest";
import { resolveSpecifier } from "../src/graph/resolve.js";

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

  it("returns null for bare and alias specifiers (out of scope v1)", () => {
    expect(resolveSpecifier("src/pages/home.tsx", "react", known)).toBeNull();
    expect(resolveSpecifier("src/pages/home.tsx", "@/components/Button", known)).toBeNull();
  });

  it("returns null when the target is not a known file", () => {
    expect(resolveSpecifier("src/pages/home.tsx", "../Missing", known)).toBeNull();
  });
});
