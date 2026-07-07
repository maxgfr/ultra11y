import { describe, it, expect } from "vitest";
import { parseSource } from "../src/parse/source.js";
import { runAudit } from "../src/audit.js";
import { runRules } from "../src/rules/registry.js";
import { crossToFinding } from "../src/rules/cross-rule.js";
import { renderReport } from "../src/report.js";
import { auditSummary } from "../src/output.js";

describe("preliminary marking for less-trustworthy sources", () => {
  it("marks lossy-JSX findings preliminary (regex fallback, offsets into transformed HTML)", () => {
    // Babel-unparseable JSX → lossy regex fallback. Its findings can be fabricated from
    // string literals at wrong lines, so they must be flagged provisional, not definitive.
    const lossy = "{/* c\nc */}\nconst fake = `<img src=\"fake.png\">`;\n<a href=\"#\">x</a><img src=\"x.png\"/>\n";
    const doc = parseSource(lossy, "lossy.tsx");
    expect(doc.kind).toBe("jsx-lossy");
    const findings = runRules(doc, new Set(["img-alt-missing"]));
    expect(findings.length).toBeGreaterThan(0);
    expect(findings.every((f) => f.preliminary === true)).toBe(true);
  });

  it("marks a cross-file finding on SFC source preliminary (like the per-doc findings there)", () => {
    const doc = parseSource(`<template><button class="w"><svg/></button></template>`, "W.vue");
    expect(doc.kind).toBe("sfc");
    const el = doc.elements.find((e) => e.tag === "button")!;
    const cf = { criteriaId: "1.1.1", el, msgId: "img-alt-missing", params: { tag: "button" } };
    const finding = crossToFinding(doc, "cross-icon-only-unnamed", "majeur", cf);
    expect(finding.preliminary).toBe(true);
  });
});

describe("opaque component detection (honesty for component libraries)", () => {
  it("flags library-component imports rendered in a file, but not local/aliased ones", () => {
    const src = `import { Button } from "@codegouvfr/react-dsfr/Button";\nimport Card from "./Card";\nimport { Foo } from "@/components/Foo";\nexport default function P(){ return <div><Button iconId="fr-icon-add-line" /><Card /><Foo /></div>; }`;
    const doc = parseSource(src, "P.tsx");
    expect(doc.opaqueComponents).toEqual(["@codegouvfr/react-dsfr/Button"]);
  });

  it("does not flag a file that only renders native elements and local components", () => {
    const doc = parseSource(`import Card from "./Card";\nexport default function P(){ return <main><Card /><button>ok</button></main>; }`, "P.tsx");
    expect(doc.opaqueComponents).toBeUndefined();
  });

  it("surfaces a scope.rendered caveat in the AuditResult", () => {
    const r = runAudit({ inputs: ["tests/fixtures/rendered"], dedup: "off" });
    expect(r.scope.rendered).toBeDefined();
    expect(r.scope.rendered?.opaqueLibraries).toContain("@codegouvfr/react-dsfr/Button");
    expect(r.scope.rendered?.files).toBeGreaterThanOrEqual(1);
  });

  it("renders the caveat in the report and the summary, naming the build/scan path", () => {
    const r = runAudit({ inputs: ["tests/fixtures/rendered"], dedup: "off" });
    const md = renderReport(r, "fr");
    expect(md).toContain("🧩");
    expect(md).toMatch(/build|render|scan/);
    expect(md).toContain("@codegouvfr/react-dsfr/Button");
    expect(auditSummary(r, "fr")).toContain("🧩");
  });

  it("a plain HTML audit has no rendered caveat", () => {
    const r = runAudit({ inputs: ["tests/fixtures/conforming"], dedup: "off" });
    expect(r.scope.rendered).toBeUndefined();
  });
});
