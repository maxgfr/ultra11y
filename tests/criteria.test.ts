import { describe, it, expect } from "vitest";
import { queryCriteria, formatCriterion, renderCriteriaReference } from "../src/criteria.js";
import type { Criterion } from "../src/types.js";

describe("queryCriteria", () => {
  it("looks up a single criterion", () => {
    const q = queryCriteria({ id: "1.1", lang: "fr" });
    expect(q?.kind).toBe("one");
    expect((q!.result as Criterion).theme).toBe(1);
  });

  it("lists a theme's criteria", () => {
    const q = queryCriteria({ theme: 8, lang: "fr" });
    expect(q?.kind).toBe("theme");
    expect((q!.result as Criterion[]).length).toBe(10);
  });

  it("lists all 13 themes by default", () => {
    const q = queryCriteria({ lang: "fr" });
    expect(q?.kind).toBe("list");
    expect((q!.result as unknown[]).length).toBe(13);
  });

  it("returns null for an unknown id or theme", () => {
    expect(queryCriteria({ id: "42.1", lang: "fr" })).toBeNull();
    expect(queryCriteria({ theme: 99, lang: "fr" })).toBeNull();
  });
});

describe("formatCriterion", () => {
  it("renders title, WCAG, automatability and rules", () => {
    const q = queryCriteria({ id: "1.1", lang: "fr" })!;
    const text = formatCriterion(q.result as Criterion, "fr");
    expect(text).toContain("1.1 —");
    expect(text).toContain("WCAG : 1.1.1");
    expect(text).toContain("img-alt-missing");
    expect(text).toContain("automatisabilité : automatisable");
  });
});

describe("renderCriteriaReference", () => {
  const md = renderCriteriaReference();
  it("is a generated doc covering all 13 themes", () => {
    expect(md).toContain("do not edit by hand");
    expect(md).toContain("## 1. Images");
    expect(md).toContain("## 13. Consultation");
  });
  it("includes a row for criterion 1.1 with its rule", () => {
    expect(md).toMatch(/\| 1\.1 \|.*\| static \|.*\| img-alt-missing/);
  });
});
