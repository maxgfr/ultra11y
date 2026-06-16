import { describe, it, expect } from "vitest";
import { findOf } from "./helpers.js";

describe("invalid-aria-role (7.1)", () => {
  it("conforming: valid role", () => {
    expect(findOf(`<div role="navigation">x</div>`, "invalid-aria-role")).toHaveLength(0);
  });
  it("non-conforming: made-up role", () => {
    const f = findOf(`<div role="navbar">x</div>`, "invalid-aria-role");
    expect(f).toHaveLength(1);
    expect(f[0]!.criteriaId).toBe("7.1");
  });
});

describe("aria-ref-missing-id (7.1)", () => {
  it("conforming: aria-labelledby resolves", () => {
    expect(findOf(`<h2 id="t">Titre</h2><div aria-labelledby="t">x</div>`, "aria-ref-missing-id")).toHaveLength(0);
  });
  it("non-conforming: dangling aria-labelledby / aria-controls", () => {
    expect(findOf(`<div aria-labelledby="ghost">x</div>`, "aria-ref-missing-id")).toHaveLength(1);
    expect(findOf(`<button aria-controls="nope">x</button>`, "aria-ref-missing-id")).toHaveLength(1);
  });
});

describe("redundant-aria (7.1)", () => {
  it("conforming: no redundant role", () => {
    expect(findOf(`<button>x</button>`, "redundant-aria")).toHaveLength(0);
    expect(findOf(`<div role="button">x</div>`, "redundant-aria")).toHaveLength(0);
  });
  it("non-conforming: role duplicating implicit role", () => {
    expect(findOf(`<button role="button">x</button>`, "redundant-aria")).toHaveLength(1);
    expect(findOf(`<nav role="navigation">x</nav>`, "redundant-aria")).toHaveLength(1);
    expect(findOf(`<a href="/" role="link">x</a>`, "redundant-aria")).toHaveLength(1);
  });
});

describe("clickable-noninteractive (7.1/7.3)", () => {
  it("conforming: native button, or upgraded div", () => {
    expect(findOf(`<button onClick={f}>x</button>`, "clickable-noninteractive", "C.tsx")).toHaveLength(0);
    expect(findOf(`<div onClick={f} role="button" tabIndex={0}>x</div>`, "clickable-noninteractive", "C.tsx")).toHaveLength(0);
  });
  it("non-conforming: clickable div without keyboard/role", () => {
    const f = findOf(`<div onClick={f}>Valider</div>`, "clickable-noninteractive", "C.tsx");
    expect(f).toHaveLength(1);
    expect(f[0]!.criteriaId).toBe("7.3");
  });
});
