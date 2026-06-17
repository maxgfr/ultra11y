import { describe, it, expect } from "vitest";
import { openTag, setAttr, removeAttr, getAttr, applyEdits, type Edit } from "../src/fix/edits.js";

const apply = (src: string, e: Edit | null): string => (e ? applyEdits(src, [e]).output : src);

describe("open-tag scanning", () => {
  it("finds the tag name and the closing '>' past quoted values", () => {
    const s = `<a href="x>y" class='c'>txt</a>`;
    const ot = openTag(s, 0)!;
    expect(ot.tagName).toBe("a");
    expect(s[ot.gt]).toBe(">");
    expect(ot.selfClose).toBe(false);
  });
  it("recognises self-closing tags", () => {
    expect(openTag(`<img src="x"/>`, 0)!.selfClose).toBe(true);
  });
});

describe("attribute codemod primitives", () => {
  it("inserts a missing attribute before '>'", () => {
    expect(apply(`<img src="x">`, setAttr(`<img src="x">`, 0, "alt", "TODO"))).toBe(`<img src="x" alt="TODO">`);
  });
  it("inserts before '/>' on a self-closing tag", () => {
    expect(apply(`<img src="x"/>`, setAttr(`<img src="x"/>`, 0, "alt", "T"))).toBe(`<img src="x" alt="T"/>`);
  });
  it("rewrites an existing attribute value", () => {
    expect(apply(`<a tabindex="3">`, setAttr(`<a tabindex="3">`, 0, "tabindex", "0"))).toBe(`<a tabindex="0">`);
  });
  it("removes an attribute with its leading whitespace", () => {
    expect(apply(`<button role="button">`, removeAttr(`<button role="button">`, 0, "role"))).toBe(`<button>`);
  });
  it("does not match a longer attribute name (alt vs alt_backup/data-alt)", () => {
    const s = `<img alt_backup="keep" data-alt="x" src="y">`;
    const out = apply(s, setAttr(s, 0, "alt", "new")); // must INSERT, not touch alt_backup/data-alt
    expect(out).toContain('alt_backup="keep"');
    expect(out).toContain('data-alt="x"');
    expect(out).toContain('alt="new"');
  });
  it("reads an attribute value", () => {
    expect(getAttr(`<meta content="width=device-width, user-scalable=no">`, 0, "content")).toBe("width=device-width, user-scalable=no");
  });
});

describe("applyEdits", () => {
  it("applies multiple edits back-to-front, keeping offsets valid", () => {
    const s = `<img src="a"><img src="b">`;
    const e1 = setAttr(s, 0, "alt", "1")!;
    const e2 = setAttr(s, 13, "alt", "2")!;
    expect(applyEdits(s, [e1, e2]).output).toBe(`<img src="a" alt="1"><img src="b" alt="2">`);
  });
  it("drops a second insertion at the same position", () => {
    const s = `<img src="x">`;
    const r = applyEdits(s, [setAttr(s, 0, "alt", "1")!, setAttr(s, 0, "title", "2")!]);
    expect(r.applied).toBe(1);
    expect(r.conflicts).toBe(1);
  });
  it("drops an edit that overlaps an already-applied one", () => {
    const s = `<a role="x" id="y">`;
    const r = applyEdits(s, [
      { start: 3, end: 18, replacement: "ROLE..ID" }, // wide
      { start: 11, end: 17, replacement: "z" }, // overlaps the first
    ]);
    expect(r.applied).toBe(1);
    expect(r.conflicts).toBe(1);
  });
});
