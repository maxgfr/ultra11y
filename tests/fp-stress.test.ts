// R4a — FALSE-POSITIVE STRESS. The trust-killer dimension (a single fabricated
// non-conformity is a hard fail per W3C ACT). A conformant-but-tricky page — text over
// image/gradient backgrounds, CSS-variable and currentColor colours, decorative alt="",
// valid ARIA widgets, aria-hidden decorations, inline SVG <title>, icon buttons named by
// aria-label — must produce ZERO non-conformities. The engine must route anything it can't
// statically resolve to `manual`/needs-rendering, never invent a failure.
import { describe, it, expect } from "vitest";
import { runAudit } from "../src/audit.js";

const FIX = new URL("./fixtures/", import.meta.url).pathname;

describe("false-positive discipline — the conformant-but-tricky page raises ZERO NC", () => {
  const audit = runAudit({ inputs: [`${FIX}fp/tricky.html`] });

  it("emits no finding at all", () => {
    expect(audit.findings, `unexpected findings: ${audit.findings.map((f) => `${f.ruleId}@${f.line}`).join(", ")}`).toEqual([]);
  });

  it("marks no criterion NC", () => {
    expect(audit.criteria.filter((c) => c.status === "NC").map((c) => c.id)).toEqual([]);
  });

  it("routes the undecidable colour/rendering criteria to manual, never a silent pass", () => {
    // contrast-over-image / gradient / CSS-var / currentColor are not statically resolvable
    expect(audit.criteria.find((c) => c.id === "1.4.3")?.status).toBe("manual");
  });
});

describe("false-positive discipline — the richer ARIA-widget stress page raises ZERO NC", () => {
  const audit = runAudit({ inputs: [`${FIX}fp/aria-widgets.html`] });

  it("emits no finding on valid tab/menu/dialog widgets, aria-hidden decorations and SVG <title>", () => {
    expect(audit.findings, `unexpected findings: ${audit.findings.map((f) => `${f.ruleId}@${f.line}`).join(", ")}`).toEqual([]);
  });
});
