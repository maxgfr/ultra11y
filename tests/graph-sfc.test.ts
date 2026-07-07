import { describe, it, expect } from "vitest";
import { buildGraphStreaming } from "../src/graph/build.js";
import { resolveUsage } from "../src/graph/graph.js";
import { computeCaptureCoverage } from "../src/capture.js";
import { discover } from "../src/discover.js";
import { GRAPH_ONLY_EXT } from "../src/glob.js";

const FIX = new URL("./fixtures/graph-sfc/", import.meta.url).pathname;

function graph() {
  return buildGraphStreaming(discover([FIX], { ext: GRAPH_ONLY_EXT }).files);
}

describe("graph — SFC (.vue/.svelte/.astro) synthesizes a self component def", () => {
  it("resolves a .tsx default import of a .vue SFC to a synthesized component def", () => {
    const g = graph();
    const consumerFile = [...g.nodes.keys()].find((f) => f.endsWith("Consumer.tsx"))!;
    const def = resolveUsage(g, consumerFile, "Widget");
    expect(def?.file.endsWith("Widget.vue")).toBe(true);
    expect(def?.name).toBe("Widget");
  });

  it("resolves the SFC's own <script> imports (Widget.vue imports ./helper)", () => {
    const g = graph();
    const widgetFile = [...g.nodes.keys()].find((f) => f.endsWith("Widget.vue"))!;
    const node = g.nodes.get(widgetFile)!;
    expect(node.imports.some((i) => i.local === "helper" && i.source === "./helper")).toBe(true);
  });

  it("reads BOTH <script> and <script setup> blocks (imports from either are seen)", () => {
    const g = graph();
    const widgetFile = [...g.nodes.keys()].find((f) => f.endsWith("Widget.vue"))!;
    const node = g.nodes.get(widgetFile)!;
    expect(node.imports.some((i) => i.local === "helper" && i.source === "./helper")).toBe(true); // <script>
    expect(node.imports.some((i) => i.local === "helper2" && i.source === "./helper2")).toBe(true); // <script setup>
  });

  it("puts the SFC in the capture-coverage universe (hasControl) so it shows as a blind spot without a capture", () => {
    const g = graph();
    const cov = computeCaptureCoverage(g, []);
    expect(cov.blindSpots.some((k) => k.endsWith("Widget.vue#Widget"))).toBe(true);
  });
});
