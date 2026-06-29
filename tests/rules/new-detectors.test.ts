import { describe, it, expect } from "vitest";
import { findOf, page } from "./helpers.js";

// Behavioral coverage for the v2.1 detectors (registry only asserted their COUNT before).

describe("meta-refresh-redirect (2.2.1)", () => {
  it("flags a timed meta refresh/redirect", () => {
    const f = findOf(`<meta http-equiv="refresh" content="30;url=/next">`, "meta-refresh-redirect");
    expect(f).toHaveLength(1);
    expect(f[0]!.criteriaId).toBe("2.2.1");
  });
  it("does not flag an instant (0s) refresh or a non-refresh meta", () => {
    expect(findOf(`<meta http-equiv="refresh" content="0;url=/x">`, "meta-refresh-redirect")).toHaveLength(0);
    expect(findOf(`<meta charset="utf-8">`, "meta-refresh-redirect")).toHaveLength(0);
  });
});

describe("blink-marquee (2.2.2)", () => {
  it("flags <blink> and <marquee>", () => {
    expect(findOf(`<marquee>news</marquee>`, "blink-marquee")).toHaveLength(1);
    expect(findOf(`<blink>x</blink>`, "blink-marquee")[0]!.criteriaId).toBe("2.2.2");
  });
  it("does not flag ordinary elements", () => {
    expect(findOf(`<div>news</div>`, "blink-marquee")).toHaveLength(0);
  });
});

describe("empty-heading (1.3.1)", () => {
  it("flags an empty heading", () => {
    expect(findOf(`<h2></h2>`, "empty-heading")).toHaveLength(1);
  });
  it("does not flag a heading named by text, an img alt, or aria-hidden", () => {
    expect(findOf(`<h2>Section</h2>`, "empty-heading")).toHaveLength(0);
    expect(findOf(`<h2><img alt="Section"></h2>`, "empty-heading")).toHaveLength(0);
    expect(findOf(`<h2 aria-hidden="true"></h2>`, "empty-heading")).toHaveLength(0);
  });
});

describe("label-for-dangling (1.3.1)", () => {
  it("flags a label whose for-target is absent in the document", () => {
    const f = findOf(`<label for="missing">Email</label><input type="text" id="present">`, "label-for-dangling");
    expect(f).toHaveLength(1);
    expect(f[0]!.criteriaId).toBe("1.3.1");
  });
  it("does not flag when the target id exists", () => {
    expect(findOf(`<label for="email">Email</label><input id="email">`, "label-for-dangling")).toHaveLength(0);
  });
});

describe("input-image-alt-missing (1.1.1)", () => {
  it("flags <input type=image> without a name", () => {
    expect(findOf(`<input type="image" src="go.png">`, "input-image-alt-missing")).toHaveLength(1);
  });
  it("does not flag when alt/aria-label/title is present", () => {
    expect(findOf(`<input type="image" src="go.png" alt="Search">`, "input-image-alt-missing")).toHaveLength(0);
  });
});

describe("media-no-track (1.2.2)", () => {
  it("flags a non-muted <video> with no <track>", () => {
    expect(findOf(`<video src="talk.mp4"></video>`, "media-no-track")).toHaveLength(1);
  });
  it("does not flag a video with a track, or a statically-muted video", () => {
    expect(findOf(`<video src="v"><track kind="captions" src="c.vtt"></video>`, "media-no-track")).toHaveLength(0);
    expect(findOf(`<video src="v" muted></video>`, "media-no-track")).toHaveLength(0);
  });
  it("treats muted={false}/{expr} as NOT statically muted (fires) but muted={true} as muted (skips)", () => {
    expect(findOf(`<video muted={false} src="v.mp4" />`, "media-no-track", "t.tsx")).toHaveLength(1);
    expect(findOf(`<video muted={isMuted} src="v.mp4" />`, "media-no-track", "t.tsx")).toHaveLength(1);
    expect(findOf(`<video muted={true} src="v.mp4" />`, "media-no-track", "t.tsx")).toHaveLength(0);
  });
});

describe("JSX-expression guards (real-world false-positive regressions)", () => {
  it("aria-ref-missing-id ignores a dynamic aria-describedby expression (no garbage ids)", () => {
    expect(findOf(`<input aria-describedby={err ? "e-id" : undefined} />`, "aria-ref-missing-id", "t.tsx")).toHaveLength(0);
  });
  it("aria-ref-missing-id still flags a literal dangling idref", () => {
    expect(findOf(`<input aria-describedby="nope" />`, "aria-ref-missing-id", "t.tsx")).toHaveLength(1);
  });
  it("label-for-dangling does not fire when the id is passed to a sibling via an id-prop", () => {
    // The DSFR/MUI pattern: <FileUpload inputId="x"/> renders <input id="x"> internally.
    expect(findOf(`<div><label htmlFor="up">F</label><FileUpload inputId="up" /></div>`, "label-for-dangling", "t.tsx")).toHaveLength(0);
  });
});

describe("page-scoped detectors still behave in a full document", () => {
  it("meta-refresh fires inside a complete page", () => {
    const html = page("<h1>Home</h1>", `<title>T</title><meta http-equiv="refresh" content="5">`);
    expect(findOf(html, "meta-refresh-redirect")).toHaveLength(1);
  });
});
