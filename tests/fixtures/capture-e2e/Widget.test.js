// Simulates a component "render" with pure DOM writes (no React/framework) — the
// capture harvester (installed as a setupFiles global afterEach) doesn't care HOW
// document.body got its markup, only that it's there when the test ends.
import { describe, it, expect } from "vitest";

describe("Widget", () => {
  it("renders a button into the document body", () => {
    document.body.innerHTML = '<button aria-label="Save">Save</button>';
    expect(document.body.innerHTML).toContain("Save");
  });
});
