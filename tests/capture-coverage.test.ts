import { describe, it, expect } from "vitest";
import { computeCaptureCoverage, enrichCaptureOrigins, parseCaptureProvenance, type CaptureEntry } from "../src/capture.js";
import { buildGraphStreaming } from "../src/graph/build.js";
import { discover } from "../src/discover.js";
import { runAudit } from "../src/audit.js";
import { readText } from "../src/util.js";
import type { Finding } from "../src/types.js";

const ROOT = new URL("./fixtures/capture-project/", import.meta.url).pathname;

function coverage() {
  const graph = buildGraphStreaming(discover([`${ROOT}src`]).files);
  const capFiles = discover([`${ROOT}.ultra11y/captures`]).files;
  const entries: CaptureEntry[] = capFiles.map((f) => ({ file: f, provenance: parseCaptureProvenance(readText(f)) }));
  return computeCaptureCoverage(graph, entries);
}

describe("computeCaptureCoverage", () => {
  const cov = coverage();

  it("universe = control-rendering OR opaque-rendering components (excludes pure presentational)", () => {
    expect(cov.total).toBe(3); // Button (control+opaque), Menu (control), Widget (opaque); Card excluded
    const keys = [...cov.covered, ...cov.blindSpots];
    expect(keys.some((k) => k.endsWith("Card.tsx#Card"))).toBe(false);
  });

  it("credits a component with a matching capture as covered", () => {
    expect(cov.covered.some((k) => k.endsWith("src/Button.tsx#Button"))).toBe(true);
    expect(cov.covered).toHaveLength(1);
  });

  it("flags control and opaque components without a capture as blind spots", () => {
    expect(cov.blindSpots.some((k) => k.endsWith("src/Menu.tsx#Menu"))).toBe(true); // via hasControl
    expect(cov.blindSpots.some((k) => k.endsWith("src/Widget.tsx#Widget"))).toBe(true); // via opaque render
    expect(cov.blindSpots).toHaveLength(2);
  });

  it("counts captures without provenance as unattributed", () => {
    expect(cov.unattributed).toBe(1); // misc.html has no marker
  });
});

describe("runAudit --require-captures (coverage gate)", () => {
  const CAPS = `${ROOT}.ultra11y/captures`;

  it("computes scope.captureCoverage with the blind spots when captureCoverage is set", () => {
    const r = runAudit({ inputs: [`${ROOT}src`, CAPS], captureCoverage: true, captureDir: CAPS });
    expect(r.scope.captureCoverage?.total).toBe(3);
    expect(r.scope.captureCoverage?.covered.some((k) => k.endsWith("Button.tsx#Button"))).toBe(true);
    expect(r.scope.captureCoverage?.blindSpots.length).toBe(2);
  });

  it("omits captureCoverage entirely on a plain audit (opt-in only)", () => {
    const r = runAudit({ inputs: [`${ROOT}src`] });
    expect(r.scope.captureCoverage).toBeUndefined();
  });

  it("ingests the captures as real DOM (scope.captures credited, Button attributed)", () => {
    const r = runAudit({ inputs: [`${ROOT}src`, CAPS], captureCoverage: true, captureDir: CAPS });
    expect(r.scope.captures?.files).toBe(1); // only Button.html carries provenance
    expect(r.scope.captures?.components).toEqual(["Button"]);
  });

  it("reads coverage from captureDir independent of the audit input scope (diff-mode safe)", () => {
    // Only Button.tsx is in scope (the capture file is NOT an input) — coverage must still
    // credit Button from the captures dir. This is the --changed/--staged safety property.
    const r = runAudit({ inputs: [`${ROOT}src/Button.tsx`], captureCoverage: true, captureDir: CAPS });
    expect(r.scope.captureCoverage?.total).toBe(1); // graph scope = Button.tsx only
    expect(r.scope.captureCoverage?.covered.some((k) => k.endsWith("Button.tsx#Button"))).toBe(true);
    expect(r.scope.captureCoverage?.blindSpots).toHaveLength(0);
  });
});

describe("enrichCaptureOrigins", () => {
  it("resolves origin.sourceLine to the source component's definition line", () => {
    const graph = buildGraphStreaming(discover([`${ROOT}src`]).files);
    const buttonNode = [...graph.nodes.values()].find((n) => n.file.endsWith("Button.tsx"));
    const expectedLine = buttonNode?.components.get("Button")?.line;
    expect(expectedLine).toBeGreaterThan(0);
    const findings = [{ origin: { capture: "x.html", sourceFile: "src/Button.tsx", component: "Button" } }] as unknown as Finding[];
    enrichCaptureOrigins(findings, graph);
    expect(findings[0]?.origin?.sourceLine).toBe(expectedLine);
  });

  it("leaves sourceLine unset when the source is not in the graph", () => {
    const graph = buildGraphStreaming(discover([`${ROOT}src`]).files);
    const findings = [{ origin: { capture: "x.html", sourceFile: "src/DoesNotExist.tsx", component: "Nope" } }] as unknown as Finding[];
    enrichCaptureOrigins(findings, graph);
    expect(findings[0]?.origin?.sourceLine).toBeUndefined();
  });
});
