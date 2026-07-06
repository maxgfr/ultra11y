import { describe, it, expect } from "vitest";
import { readFileSync } from "node:fs";
import { parseSource } from "../src/parse/source.js";
import { runRules } from "../src/rules/registry.js";
import { buildGraphStreaming } from "../src/graph/build.js";
import { discover } from "../src/discover.js";
import { GRAPH_ONLY_EXT } from "../src/glob.js";

const FIX = new URL("./fixtures/astro-frontmatter/", import.meta.url).pathname;

describe("parseSource — .astro frontmatter is stripped before HTML parsing", () => {
  const file = `${FIX}Page.astro`;
  const source = readFileSync(file, "utf8");
  const doc = parseSource(source, file);

  it("never turns frontmatter TS syntax into phantom elements (Array<string> looks like a tag unstripped)", () => {
    // Only the <html>/<head>/<title>/<body>/<img> elements from the real template —
    // nothing named after the frontmatter's `string`/`Foo`/`Button` identifiers.
    const tags = new Set(doc.elements.map((e) => e.tag));
    expect(tags.has("string")).toBe(false);
    expect(tags.has("foo")).toBe(false);
  });

  it("keeps line numbers exact for a finding after the frontmatter", () => {
    const findings = runRules(doc);
    const imgFinding = findings.find((f) => f.ruleId === "img-alt-missing");
    expect(imgFinding).toBeDefined();
    expect(imgFinding?.line).toBe(9); // <img> is line 9 in the fixture, after a 5-line frontmatter
  });

  it("preserves byte offsets after the frontmatter (safe for `fix`'s range-based codemods)", () => {
    const imgIdx = source.indexOf("<img");
    const el = doc.elements.find((e) => e.tag === "img");
    expect(el?.start).toBe(imgIdx);
  });
});

describe("graph — .astro frontmatter imports resolve", () => {
  it('resolves Page.astro\'s frontmatter `import Button from "./Button"` to Button.tsx', () => {
    const graph = buildGraphStreaming(discover([FIX], { ext: GRAPH_ONLY_EXT }).files);
    const pageFile = [...graph.nodes.keys()].find((f) => f.endsWith("Page.astro"))!;
    const node = graph.nodes.get(pageFile)!;
    const imp = node.imports.find((i) => i.local === "Button");
    expect(imp?.source).toBe("./Button");
  });
});
