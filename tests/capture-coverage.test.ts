import { describe, it, expect } from "vitest";
import { computeCaptureCoverage, parseCaptureProvenance, type CaptureEntry } from "../src/capture.js";
import { buildGraphStreaming } from "../src/graph/build.js";
import { discover } from "../src/discover.js";
import { runAudit } from "../src/audit.js";
import { readText } from "../src/util.js";

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
  it("computes scope.captureCoverage with the blind spots when captureCoverage is set", () => {
    const r = runAudit({ inputs: [`${ROOT}src`, `${ROOT}.ultra11y/captures`], captureCoverage: true });
    expect(r.scope.captureCoverage?.total).toBe(3);
    expect(r.scope.captureCoverage?.covered.some((k) => k.endsWith("Button.tsx#Button"))).toBe(true);
    expect(r.scope.captureCoverage?.blindSpots.length).toBe(2);
  });

  it("omits captureCoverage entirely on a plain audit (opt-in only)", () => {
    const r = runAudit({ inputs: [`${ROOT}src`] });
    expect(r.scope.captureCoverage).toBeUndefined();
  });

  it("ingests the captures as real DOM (scope.captures credited, Button attributed)", () => {
    const r = runAudit({ inputs: [`${ROOT}src`, `${ROOT}.ultra11y/captures`], captureCoverage: true });
    expect(r.scope.captures?.files).toBe(1); // only Button.html carries provenance
    expect(r.scope.captures?.components).toEqual(["Button"]);
  });
});
