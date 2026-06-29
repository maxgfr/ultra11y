import { describe, it, expect } from "vitest";
import { resolveSpecifier } from "../src/graph/resolve.js";
import type { AliasMap } from "../src/graph/tsconfig.js";

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
