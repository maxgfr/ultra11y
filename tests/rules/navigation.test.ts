import { describe, it, expect } from "vitest";
import { findOf, page } from "./helpers.js";

describe("skip-link-target-missing (12.7)", () => {
  it("conforming: skip link whose target exists", () => {
    expect(findOf(page(`<a href="#main">Aller au contenu</a><main id="main">x</main>`), "skip-link-target-missing")).toHaveLength(0);
  });
  it("non-conforming: anchor with no matching id", () => {
    const f = findOf(page(`<a href="#main">Aller au contenu</a><main>x</main>`), "skip-link-target-missing");
    expect(f).toHaveLength(1);
    expect(f[0]!.criteriaId).toBe("12.7");
  });
});

describe("positive-tabindex (12.8)", () => {
  it("conforming: tabindex 0 or -1", () => {
    expect(findOf(`<div tabindex="0">x</div><div tabindex="-1">y</div>`, "positive-tabindex")).toHaveLength(0);
  });
  it("non-conforming: tabindex > 0", () => {
    const f = findOf(`<button tabindex="3">x</button>`, "positive-tabindex");
    expect(f).toHaveLength(1);
    expect(f[0]!.criteriaId).toBe("12.8");
  });
});
