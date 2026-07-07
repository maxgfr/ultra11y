import { describe, it, expect } from "vitest";
import { findOf, page } from "./helpers.js";

describe("html-lang-missing (8.3)", () => {
  it("conforming: <html lang=fr>", () => {
    expect(findOf(page("<p>x</p>"), "html-lang-missing")).toHaveLength(0);
  });
  it("non-conforming: <html> without lang", () => {
    const f = findOf(page("<p>x</p>", "<title>T</title>", ""), "html-lang-missing");
    expect(f).toHaveLength(1);
    expect(f[0]!.criteriaId).toBe("3.1.1");
  });
  it("does not fire on a fragment (page-scoped)", () => {
    expect(findOf(`<p>fragment</p>`, "html-lang-missing")).toHaveLength(0);
  });
});

describe("title-missing-empty (8.5)", () => {
  it("conforming: non-empty title", () => {
    expect(findOf(page("<p>x</p>", "<title>Accueil</title>"), "title-missing-empty")).toHaveLength(0);
  });
  it("non-conforming: missing or empty title", () => {
    expect(findOf(page("<p>x</p>", ""), "title-missing-empty")).toHaveLength(1);
    expect(findOf(page("<p>x</p>", "<title>  </title>"), "title-missing-empty")).toHaveLength(1);
  });
  // Next.js App Router sets <title> via `export const metadata = { title }`, not a
  // literal <title> in JSX (egapro: layout.tsx). Flagging that is a false positive.
  it("does not assert when a Next.js metadata export sets the title (JSX)", () => {
    const src = `export const metadata = { title: "Egapro" };
export default function L({ children }) { return (<html lang="fr"><head><link /></head><body>{children}</body></html>); }`;
    expect(findOf(src, "title-missing-empty", "t.tsx")).toHaveLength(0);
  });
  it("still asserts on a JSX page with a literal head, no title and no metadata", () => {
    const src = `export default function P() { return (<html lang="fr"><head><link /></head><body><h1>x</h1></body></html>); }`;
    expect(findOf(src, "title-missing-empty", "t.tsx")).toHaveLength(1);
  });
  // SvelteKit/EJS shells inject the <title> via a head placeholder.
  it("does not assert when <head> injects the title via a framework placeholder", () => {
    const src = `<!doctype html><html lang="en"><head>%sveltekit.head%</head><body><h1>x</h1></body></html>`;
    expect(findOf(src, "title-missing-empty")).toHaveLength(0);
  });
});

describe("duplicate-id (8.2)", () => {
  it("conforming: unique ids", () => {
    expect(findOf(`<div id="a"></div><div id="b"></div>`, "duplicate-id")).toHaveLength(0);
  });
  it("non-conforming: a repeated id reports the extra occurrences", () => {
    const f = findOf(`<div id="x"></div><span id="x"></span><p id="x"></p>`, "duplicate-id");
    expect(f).toHaveLength(2);
    expect(f[0]!.criteriaId).toBe("4.1.2");
  });
});

// An id reused across mutually-exclusive JSX conditional arms is unique at runtime (only
// one arm renders) and must NOT be flagged; genuine collisions still are.
describe("duplicate-id — JSX conditional arms (branchArm)", () => {
  const jsx = (body: string) => `export default function C(){ return (<main>${body}</main>); }`;

  it("conforming: same id in the two arms of a ternary (mutually exclusive)", () => {
    const src = jsx(`{ok ? <p id="s">a</p> : <p id="s">b</p>}`);
    expect(findOf(src, "duplicate-id", "t.tsx")).toHaveLength(0);
  });

  it("conforming: same id across nested-ternary arms that are all mutually exclusive", () => {
    const src = jsx(`{a ? <p id="s">1</p> : (b ? <p id="s">2</p> : <p id="t">3</p>)}`);
    expect(findOf(src, "duplicate-id", "t.tsx")).toHaveLength(0);
  });

  it("non-conforming: same id in two INDEPENDENT conditionals (both can render)", () => {
    const src = jsx(`{a && <span id="s">1</span>}{b && <span id="s">2</span>}`);
    expect(findOf(src, "duplicate-id", "t.tsx")).toHaveLength(1);
  });

  it("non-conforming: an unconditional id colliding with a conditional one", () => {
    const src = jsx(`<span id="s">base</span>{a && <span id="s">extra</span>}`);
    expect(findOf(src, "duplicate-id", "t.tsx")).toHaveLength(1);
  });
});

describe("lang-invalid (8.4/8.8)", () => {
  it("conforming: valid BCP47 codes", () => {
    expect(findOf(page("<p>x</p>", "<title>T</title>", ' lang="fr"'), "lang-invalid")).toHaveLength(0);
    expect(findOf(`<span lang="fr-CA">x</span>`, "lang-invalid")).toHaveLength(0);
  });
  it("non-conforming: invalid html lang → 8.4, invalid inline lang → 8.8", () => {
    const h = findOf(page("<p>x</p>", "<title>T</title>", ' lang="francais"'), "lang-invalid");
    expect(h).toHaveLength(1);
    expect(h[0]!.criteriaId).toBe("3.1.1");
    const s = findOf(`<span lang="abcdefghij">x</span>`, "lang-invalid");
    expect(s).toHaveLength(1);
    expect(s[0]!.criteriaId).toBe("3.1.2");
  });
});

describe("inline-lang-change-missing (8.7)", () => {
  it("conforming: valid inline lang", () => {
    expect(findOf(`<span lang="en">Hello</span>`, "inline-lang-change-missing")).toHaveLength(0);
  });
  it("non-conforming: empty lang attribute", () => {
    expect(findOf(`<span lang="">Hello</span>`, "inline-lang-change-missing")).toHaveLength(1);
  });
});

describe("lang-invalid — private-use / grandfathered singletons", () => {
  it("conforming: x-/i- singleton primary subtags are valid BCP-47", () => {
    expect(findOf(`<span lang="x-klingon">x</span>`, "lang-invalid")).toHaveLength(0);
    expect(findOf(`<span lang="i-navajo">x</span>`, "lang-invalid")).toHaveLength(0);
  });
  it("non-conforming: underscore and over-long primary subtags are still flagged", () => {
    expect(findOf(`<span lang="en_US">x</span>`, "lang-invalid")).toHaveLength(1);
    expect(findOf(`<span lang="francais">x</span>`, "lang-invalid")).toHaveLength(1);
  });
});
