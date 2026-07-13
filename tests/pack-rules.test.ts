import { describe, it, expect } from "vitest";
import { parseHtml } from "../src/parse/html.js";
import { runPackRules } from "../src/standards/pack-rules.js";
import type { StandardPack, PackRule } from "../src/standards/types.js";

// Minimal pack — the interpreter only reads `key` + `rules`.
function pack(rules: PackRule[]): StandardPack {
  return { key: "test", rules } as unknown as StandardPack;
}
function doc(html: string) {
  return parseHtml(html, "t.html");
}
// A rule skeleton with a single match condition, so each test varies only what it needs.
function rule(match: PackRule["match"], over: Partial<PackRule> = {}): PackRule {
  return {
    id: "r",
    criterion: "1.1",
    wcag: ["1.1.1"],
    severity: "mineur",
    match,
    message: { en: "m", fr: "m" },
    remediation: { en: "x", fr: "x" },
    ...over,
  };
}
const run = (html: string, r: PackRule) => runPackRules(doc(html), pack([r]));

describe("pack-rules interpreter — attribute ops", () => {
  it("present / absent", () => {
    expect(run(`<a href="x">y</a>`, rule({ tag: "a", attrs: [{ name: "href", op: "present" }] }))).toHaveLength(1);
    expect(run(`<a>y</a>`, rule({ tag: "a", attrs: [{ name: "href", op: "present" }] }))).toHaveLength(0);
    expect(run(`<a>y</a>`, rule({ tag: "a", attrs: [{ name: "href", op: "absent" }] }))).toHaveLength(1);
    expect(run(`<a href="x">y</a>`, rule({ tag: "a", attrs: [{ name: "href", op: "absent" }] }))).toHaveLength(0);
  });

  it("equals is exact (not substring)", () => {
    expect(run(`<input type="text">`, rule({ tag: "input", attrs: [{ name: "type", op: "equals", value: "text" }] }))).toHaveLength(1);
    expect(run(`<input type="textarea">`, rule({ tag: "input", attrs: [{ name: "type", op: "equals", value: "text" }] }))).toHaveLength(0);
  });

  it("matches is a case-insensitive regex over the attribute value", () => {
    const r = rule({ tag: "a", attrs: [{ name: "href", op: "matches", value: "\\.pdf$" }] });
    expect(run(`<a href="doc.pdf">y</a>`, r)).toHaveLength(1);
    expect(run(`<a href="DOC.PDF">y</a>`, r)).toHaveLength(1); // case-insensitive
    expect(run(`<a href="doc.html">y</a>`, r)).toHaveLength(0);
  });

  it("ALL attr conditions must hold (AND)", () => {
    const r = rule({
      tag: "input",
      attrs: [
        { name: "type", op: "equals", value: "text" },
        { name: "required", op: "present" },
      ],
    });
    expect(run(`<input type="text" required>`, r)).toHaveLength(1);
    expect(run(`<input type="text">`, r)).toHaveLength(0);
  });
});

describe("pack-rules interpreter — visible-text ops", () => {
  it("text matches / lacks over the collapsed visible text", () => {
    const matches = rule({ tag: "a", text: { op: "matches", value: "pdf" } });
    expect(run(`<a href="x">Report (PDF)</a>`, matches)).toHaveLength(1); // case-insensitive
    expect(run(`<a href="x">Report</a>`, matches)).toHaveLength(0);
    const lacks = rule({ tag: "a", text: { op: "lacks", value: "pdf" } });
    expect(run(`<a href="x">Report</a>`, lacks)).toHaveLength(1);
    expect(run(`<a href="x">Report (PDF)</a>`, lacks)).toHaveLength(0);
  });
});

describe("pack-rules interpreter — has / lacks descendant conditions", () => {
  it("has: fires only when a descendant matches", () => {
    const r = rule({ tag: "button", has: [{ tag: "svg" }] });
    expect(run(`<button><svg></svg></button>`, r)).toHaveLength(1);
    expect(run(`<button>text</button>`, r)).toHaveLength(0);
  });

  it("lacks: fires only when NO descendant matches", () => {
    const r = rule({ tag: "figure", lacks: [{ tag: "figcaption" }] });
    expect(run(`<figure><img alt=""></figure>`, r)).toHaveLength(1);
    expect(run(`<figure><img alt=""><figcaption>c</figcaption></figure>`, r)).toHaveLength(0);
  });

  it("nested has (within the depth bound) is honored", () => {
    // depth 1 (li) → 2 (ul) → 3 (a): allowed.
    const r = rule({ tag: "li", has: [{ tag: "ul", has: [{ tag: "a" }] }] });
    expect(run(`<li><ul><li><a href="x">y</a></li></ul></li>`, r)).toHaveLength(1);
    expect(run(`<li><ul><li>text</li></ul></li>`, r)).toHaveLength(0);
  });

  it("beyond the depth bound (level 4) the interpreter stops matching (defensive)", () => {
    // has → has → has → has = depth 1→2→3→4; the 4th level is dropped, so a positive
    // condition there can never be satisfied.
    const r = rule({ tag: "a", has: [{ tag: "b", has: [{ tag: "c", has: [{ tag: "d" }] }] }] });
    expect(run(`<a><b><c><d></d></c></b></a>`, r)).toHaveLength(0);
  });
});

describe("pack-rules interpreter — scope, finding shape, flags", () => {
  it("scope 'page' fires only on a full document (has <html>)", () => {
    const r = rule({ tag: "a", scope: "page" });
    expect(run(`<html><body><a href="x">y</a></body></html>`, r)).toHaveLength(1);
    expect(run(`<a href="x">y</a>`, r)).toHaveLength(0); // fragment, not a page
  });

  it("scope 'fragment' (default) fires on any parsed source", () => {
    expect(run(`<a href="x">y</a>`, rule({ tag: "a", scope: "fragment" }))).toHaveLength(1);
    expect(run(`<a href="x">y</a>`, rule({ tag: "a" }))).toHaveLength(1);
  });

  it("emits a namespaced ruleId pack:<key>:<id>, keys on the declared SC, carries source range", () => {
    const [f] = run(`<a href="x">y</a>`, rule({ tag: "a" }, { id: "my-rule", wcag: ["2.4.4"] }));
    expect(f!.ruleId).toBe("pack:test:my-rule");
    expect(f!.criteriaId).toBe("2.4.4");
    expect(f!.file).toBe("t.html");
    expect(typeof f!.sourceStart).toBe("number");
  });

  it("advisory flag is carried onto the finding (and absent by default)", () => {
    const [adv] = run(`<a href="x">y</a>`, rule({ tag: "a" }, { advisory: true }));
    expect(adv!.advisory).toBe(true);
    const [norm] = run(`<a href="x">y</a>`, rule({ tag: "a" }));
    expect(norm!.advisory).toBeUndefined();
  });

  it("a pack with no rules is a no-op", () => {
    expect(runPackRules(doc(`<a href="x">y</a>`), pack([]))).toHaveLength(0);
    expect(runPackRules(doc(`<a href="x">y</a>`), { key: "k" } as unknown as StandardPack)).toHaveLength(0);
  });
});
