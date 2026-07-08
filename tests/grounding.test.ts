import { describe, it, expect } from "vitest";
import { mkdtempSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { groundFinding, groundItems } from "../src/grounding.js";

// A file long enough that the ±10-line window around a cited line does NOT cover the
// whole document — required to tell "at the cited line" apart from "moved elsewhere".
const dir = mkdtempSync(join(tmpdir(), "u11y-ground-"));
const file = join(dir, "page.html");
const filler = (n: number) => Array.from({ length: n }, (_, i) => `<p>filler ${i}</p>`).join("\n");
writeFileSync(
  file,
  `<!doctype html>
<html lang="en">
<body>
<main>
<img src="hero.png">
<p class="lead">Hello</p>
${filler(30)}
<footer><a href="/about">About</a></footer>
</body>
</html>
`,
);

describe("groundFinding", () => {
  it("passes an exact snippet at the cited line", () => {
    const r = groundFinding({ file, line: 5, snippet: '<img src="hero.png">' });
    expect(r.ok).toBe(true);
    expect(r.moved).toBe(false);
  });

  it("matches whitespace-insensitively (normalized snippet)", () => {
    const r = groundFinding({ file, line: 5, snippet: '<img    src="hero.png"  >'.replace("  >", ">") });
    expect(r.ok).toBe(true);
  });

  it("passes-with-moved when the snippet drifted outside the cited-line window", () => {
    // The <img> sits at line 5; cite line 30 — outside the ±10 window, still in the file.
    const r = groundFinding({ file, line: 30, snippet: '<img src="hero.png">' });
    expect(r.ok).toBe(true);
    expect(r.moved).toBe(true);
  });

  it("fails when the snippet exists nowhere in the file", () => {
    const r = groundFinding({ file, line: 5, snippet: '<video controls src="movie.mp4">' });
    expect(r.ok).toBe(false);
    expect(r.issue).toBeTruthy();
  });

  it("fails on a missing file", () => {
    const r = groundFinding({ file: join(dir, "nope.html"), line: 1, snippet: "<p>x</p>" });
    expect(r.ok).toBe(false);
    expect(r.issue).toContain("nope.html");
  });

  it("fails on an out-of-range line", () => {
    const r = groundFinding({ file, line: 9999, snippet: "<p>filler 0</p>" });
    expect(r.ok).toBe(false);
  });

  it("falls back to selector tokens when no snippet is given", () => {
    expect(groundFinding({ file, line: 6, selector: "p.lead" }).ok).toBe(true);
    const miss = groundFinding({ file, line: 6, selector: "video#player" });
    expect(miss.ok).toBe(false);
  });

  it("selector match outside the window counts as moved", () => {
    const r = groundFinding({ file, line: 20, selector: "footer > a" });
    expect(r.ok).toBe(true);
    expect(r.moved).toBe(true);
  });

  it("skips stdin and empty anchors (nothing resolvable to check)", () => {
    expect(groundFinding({ file: "-", line: 0, snippet: "<p>x</p>" }).ok).toBe(true);
    expect(groundFinding({ file: "<stdin>", line: 3 }).ok).toBe(true);
    // A real file with neither snippet nor selector: only file+line existence is checkable.
    expect(groundFinding({ file, line: 2 }).ok).toBe(true);
  });

  it("treats line 0 (unresolved dynamic finding) as whole-file search, never a crash", () => {
    const r = groundFinding({ file, line: 0, snippet: '<img src="hero.png">' });
    expect(r.ok).toBe(true);
  });
});

describe("groundItems", () => {
  it("summarizes grounded / moved / failed over a batch", () => {
    const s = groundItems([
      { file, line: 5, snippet: '<img src="hero.png">' },
      { file, line: 30, snippet: '<img src="hero.png">' },
      { file, line: 5, snippet: "<table></table>" },
    ]);
    expect(s.grounded).toBe(2); // moved still counts as grounded…
    expect(s.moved).toBe(1); // …but is reported honestly
    expect(s.failed).toBe(1);
    expect(s.issues).toHaveLength(1);
  });
});
