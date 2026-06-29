import { describe, it, expect } from "vitest";
import { parseSource } from "../src/parse/source.js";
import { runAudit } from "../src/audit.js";
import { renderReport } from "../src/report.js";
import { auditSummary } from "../src/output.js";

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
