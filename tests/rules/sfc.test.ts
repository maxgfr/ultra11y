import { describe, it, expect } from "vitest";
import { findOf } from "./helpers.js";
import { parseSource } from "../../src/parse/source.js";

// .vue/.svelte/.astro are parsed via the HTML path, but with component case
// PRESERVED and kind:"sfc" — so single-file rules skip PascalCase components the
// same way they do for real JSX, and the injected-content guards engage.
describe("SFC parsing (.vue/.svelte/.astro)", () => {
  it("stamps kind:sfc and preserves component case", () => {
    const doc = parseSource(`<template><Select><slot></slot></Select></template>`, "C.vue");
    expect(doc.kind).toBe("sfc");
    expect(doc.elements.some((e) => e.tag === "Select")).toBe(true);
  });
  it("keeps native tags matchable (author-lowercase)", () => {
    const doc = parseSource(`<div><img src="x" alt="y" /></div>`, "C.svelte");
    expect(doc.elements.some((e) => e.tag === "div")).toBe(true);
    expect(doc.elements.some((e) => e.tag === "img")).toBe(true);
  });
  it("plain .html still parses as html (unchanged, lowercased)", () => {
    const doc = parseSource(`<DIV><SPAN>x</SPAN></DIV>`, "p.html");
    expect(doc.kind).toBe("html");
    expect(doc.elements.every((e) => e.tag === e.tag.toLowerCase())).toBe(true);
  });
});

describe("SFC: tag-matching rules skip PascalCase components", () => {
  it("select-has-option does not fire on a <Select> component", () => {
    expect(findOf(`<Select><slot></slot></Select>`, "select-has-option", "C.vue")).toHaveLength(0);
  });
  it("list-structure does not fire on a component child of <ul> (SFC)", () => {
    expect(findOf(`<ul><MenuItem /></ul>`, "list-structure", "C.svelte")).toHaveLength(0);
  });
  it("invalid-aria-role does not fire on a component's role prop", () => {
    expect(findOf(`<UChatMessage role="user">x</UChatMessage>`, "invalid-aria-role", "C.vue")).toHaveLength(0);
  });
});

describe("slot/snippet-injected content suppresses emptiness FPs", () => {
  it("button with a <slot> is not flagged empty", () => {
    expect(findOf(`<button><slot></slot></button>`, "button-empty-name", "C.vue")).toHaveLength(0);
  });
  it("link with a <slot> is not flagged empty", () => {
    expect(findOf(`<a href="/x"><slot></slot></a>`, "link-empty-name", "C.astro")).toHaveLength(0);
  });
  it("heading with a <slot> is not flagged empty", () => {
    expect(findOf(`<h2><slot></slot></h2>`, "empty-heading", "C.vue")).toHaveLength(0);
  });
  it("select with a <slot> is not flagged option-less", () => {
    expect(findOf(`<select><slot></slot></select>`, "select-has-option", "C.svelte")).toHaveLength(0);
  });
});

describe("dynamic attribute bindings count as 'name present'", () => {
  it("button with :aria-label (Vue bind) is not flagged empty", () => {
    expect(findOf(`<button :aria-label="t('x')"></button>`, "button-empty-name", "C.vue")).toHaveLength(0);
  });
  it("img with :alt (Vue bind) is not flagged missing alt", () => {
    expect(findOf(`<img :src="s" :alt="d" />`, "img-alt-missing", "C.vue")).toHaveLength(0);
  });
  it("input with v-bind:aria-label is treated as labelled", () => {
    expect(findOf(`<input v-bind:aria-label="lbl" />`, "control-label-missing", "C.vue")).toHaveLength(0);
  });
  it('input with a v-bind="…" object spread is not flagged unlabelled (name may be spread in)', () => {
    expect(findOf(`<input v-bind="$attrs" />`, "control-label-missing", "C.vue")).toHaveLength(0);
  });
});

describe("dynamic-value / injected-content guards (SFC)", () => {
  it("invalid-aria-role skips a dynamic role expression (role={…})", () => {
    expect(findOf(`<button role={x ? "link" : undefined}>z</button>`, "invalid-aria-role", "C.svelte")).toHaveLength(0);
  });
  it("data-table accepts a dynamic :scope binding", () => {
    expect(findOf(`<table><tr><th :scope="col">A</th></tr><tr><td>1</td></tr></table>`, "data-table-no-headers", "C.vue")).toHaveLength(0);
  });
  it("aria-required-children skips when children are slotted", () => {
    expect(findOf(`<div role="list"><slot></slot></div>`, "aria-required-children", "C.vue")).toHaveLength(0);
  });
  it("fieldset-legend skips when the legend is injected via {@render}", () => {
    expect(findOf(`<fieldset>{@render children?.()}</fieldset>`, "fieldset-legend-missing", "C.svelte")).toHaveLength(0);
  });
  it("fieldset-legend STILL flags a fieldset that only contains component fields (no slot legend)", () => {
    expect(findOf(`<fieldset><MyInput /><MyInput /></fieldset>`, "fieldset-legend-missing", "C.vue")).toHaveLength(1);
  });
  it("control-label skips a Svelte {...rest} spread on the field", () => {
    expect(findOf(`<input {...rest} />`, "control-label-missing", "C.svelte")).toHaveLength(0);
  });
  it("img-alt skips a Svelte {alt} shorthand / spread", () => {
    expect(findOf(`<img {alt} src={src} />`, "img-alt-missing", "C.svelte")).toHaveLength(0);
  });
  it("control-label skips a [hidden] form field (not an exposed control)", () => {
    expect(findOf(`<input hidden value="x" name="dob" />`, "control-label-missing", "C.svelte")).toHaveLength(0);
  });
  it("canvas-fallback skips an aria-hidden canvas", () => {
    expect(findOf(`<canvas aria-hidden="true"></canvas>`, "canvas-fallback-missing")).toHaveLength(0);
  });
  it('duplicate-id skips dynamic ids (id="x-{id}")', () => {
    expect(findOf(`<div id="email-{id}"></div><div id="email-{id}"></div>`, "duplicate-id", "C.svelte")).toHaveLength(0);
  });
  it("select-has-option skips a {@render children()} snippet wrapper", () => {
    expect(findOf(`<select>{@render children?.()}</select>`, "select-has-option", "C.svelte")).toHaveLength(0);
  });
});

describe("no over-suppression: genuinely empty markup still flagged in SFCs", () => {
  it("a truly empty button is still flagged", () => {
    expect(findOf(`<button></button>`, "button-empty-name", "C.vue")).toHaveLength(1);
  });
  it("an img with no alt is still flagged", () => {
    expect(findOf(`<img src="x" />`, "img-alt-missing", "C.vue")).toHaveLength(1);
  });
  it("a role=list with no children is still flagged", () => {
    expect(findOf(`<div role="list"></div>`, "aria-required-children", "C.vue")).toHaveLength(1);
  });
  it("a dynamic role still flags nothing but a static invalid role does", () => {
    expect(findOf(`<div role="notarole">x</div>`, "invalid-aria-role", "C.vue")).toHaveLength(1);
  });
});
