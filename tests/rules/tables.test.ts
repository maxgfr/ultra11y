import { describe, it, expect } from "vitest";
import { findOf } from "./helpers.js";

describe("data-table-no-headers (5.6/5.7)", () => {
  it("conforming: th with scope", () => {
    expect(findOf(`<table><caption>T</caption><tr><th scope="col">A</th></tr><tr><td>1</td></tr></table>`, "data-table-no-headers")).toHaveLength(0);
  });
  it("conforming: layout table marked presentation", () => {
    expect(findOf(`<table role="presentation"><tr><td>x</td></tr></table>`, "data-table-no-headers")).toHaveLength(0);
  });
  it("non-conforming: data table with no th → 5.6", () => {
    const f = findOf(`<table><tr><td>A</td></tr><tr><td>1</td></tr></table>`, "data-table-no-headers");
    expect(f).toHaveLength(1);
    expect(f[0]!.criteriaId).toBe("1.3.1");
  });
  it("non-conforming: th without scope/headers → 5.7", () => {
    const f = findOf(`<table><tr><th>A</th></tr><tr><td>1</td></tr></table>`, "data-table-no-headers");
    expect(f).toHaveLength(1);
    expect(f[0]!.criteriaId).toBe("1.3.1");
  });
  it("skips a layout table (nested tables) — no false positive", () => {
    const html = `<table><tr><td><table><tr><td>x</td></tr></table></td><td>y</td></tr></table>`;
    expect(findOf(html, "data-table-no-headers")).toHaveLength(0);
  });
  // A generic table wrapper injects its rows/headers via {children} (egapro: DsfrTable)
  // — no <th> is statically visible, but the headers exist at runtime. Asserting a
  // definite NC there is a false positive.
  it("does not assert when rows/cells are injected via {children} (JSX wrapper)", () => {
    expect(findOf(`<table><caption>T</caption>{children}</table>`, "data-table-no-headers", "t.tsx")).toHaveLength(0);
  });
  it("does not assert on a table with no static row/cell markup", () => {
    expect(findOf(`<table><caption>T</caption></table>`, "data-table-no-headers")).toHaveLength(0);
  });
});

describe("layout-table-data-markup (5.8)", () => {
  it("conforming: presentation table with no data markup", () => {
    expect(findOf(`<table role="presentation"><tr><td>x</td></tr></table>`, "layout-table-data-markup")).toHaveLength(0);
  });
  it("non-conforming: presentation table using th/caption", () => {
    const f = findOf(`<table role="presentation"><caption>x</caption><tr><th>A</th></tr></table>`, "layout-table-data-markup");
    expect(f).toHaveLength(1);
    expect(f[0]!.criteriaId).toBe("1.3.1");
  });
});

describe("table-caption-missing (5.4)", () => {
  it("conforming: table with caption", () => {
    expect(findOf(`<table><caption>Ventes</caption><tr><th scope="col">A</th></tr></table>`, "table-caption-missing")).toHaveLength(0);
  });
  it("non-conforming: data table without caption", () => {
    const f = findOf(`<table><tr><th scope="col">A</th></tr></table>`, "table-caption-missing");
    expect(f).toHaveLength(1);
    expect(f[0]!.criteriaId).toBe("1.3.1");
  });
});
