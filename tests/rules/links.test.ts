import { describe, it, expect } from "vitest";
import { findOf } from "./helpers.js";

describe("link-empty-name (6.2)", () => {
  it("conforming: link with text or aria-label", () => {
    expect(findOf(`<a href="/">Accueil</a>`, "link-empty-name")).toHaveLength(0);
    expect(findOf(`<a href="/" aria-label="Accueil"></a>`, "link-empty-name")).toHaveLength(0);
  });
  it("non-conforming: empty link (no icon)", () => {
    const f = findOf(`<a href="/"><span></span></a>`, "link-empty-name");
    expect(f).toHaveLength(1);
    expect(f[0]!.criteriaId).toBe("2.4.4");
  });
  it("defers icon-only links to icon-only-control-unnamed", () => {
    expect(findOf(`<a href="/"><svg></svg></a>`, "link-empty-name")).toHaveLength(0);
  });
});

describe("button-empty-name (7.1)", () => {
  it("conforming: button with text / submit with default", () => {
    expect(findOf(`<button>Envoyer</button>`, "button-empty-name")).toHaveLength(0);
    expect(findOf(`<input type="submit">`, "button-empty-name")).toHaveLength(0);
  });
  it("non-conforming: empty button", () => {
    const f = findOf(`<button></button>`, "button-empty-name");
    expect(f).toHaveLength(1);
    expect(f[0]!.criteriaId).toBe("4.1.2");
  });
});

describe("icon-only-control-unnamed (6.2/7.1)", () => {
  it("conforming: icon button with aria-label", () => {
    expect(findOf(`<button aria-label="Fermer"><svg></svg></button>`, "icon-only-control-unnamed")).toHaveLength(0);
  });
  it("non-conforming: icon-only button → 7.1, icon-only link → 6.2", () => {
    const b = findOf(`<button><svg></svg></button>`, "icon-only-control-unnamed");
    expect(b).toHaveLength(1);
    expect(b[0]!.criteriaId).toBe("4.1.2");
    const a = findOf(`<a href="/"><img src="i" alt=""></a>`, "icon-only-control-unnamed");
    expect(a).toHaveLength(1);
    expect(a[0]!.criteriaId).toBe("2.4.4");
  });
});
