import { describe, it, expect } from "vitest";
import { findOf } from "./helpers.js";

describe("autoplay-media (4.10/13.8)", () => {
  it("conforming: media without autoplay", () => {
    expect(findOf(`<video src="v" controls></video>`, "autoplay-media")).toHaveLength(0);
    expect(findOf(`<audio src="a" controls></audio>`, "autoplay-media")).toHaveLength(0);
  });
  it("non-conforming: audio autoplay → 4.10", () => {
    const f = findOf(`<audio src="a" autoplay></audio>`, "autoplay-media");
    expect(f).toHaveLength(1);
    expect(f[0]!.criteriaId).toBe("1.4.2");
  });
  it("non-conforming: muted video autoplay → 13.8 (moving content)", () => {
    const f = findOf(`<video src="v" autoplay muted></video>`, "autoplay-media");
    expect(f).toHaveLength(1);
    expect(f[0]!.criteriaId).toBe("2.2.2");
  });
});
