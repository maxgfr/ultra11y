// Theme 4 / 13 — Auto-starting media + missing captions track (statically-checkable slice).
import type { Doc, El } from "../parse/html.js";
import { attr, hasAttr, descendants } from "../parse/html.js";
import type { Rule, RuleFinding } from "./rule.js";

// `muted` is statically TRUE only as a bare boolean attr, a literal "muted"/"true", or the
// JSX literal `{true}`. A JSX expression like `muted={isMuted}` or `muted={false}` is NOT
// statically muted — an audit must not assume silence from it (avoids a captions false
// negative on a sound-bearing video).
function mutedStatically(el: El): boolean {
  if (!hasAttr(el, "muted")) return false;
  const v = (attr(el, "muted") ?? "").trim().toLowerCase();
  return v === "" || v === "muted" || v === "true" || v === "{true}";
}

const autoplayMedia: Rule = {
  id: "autoplay-media",
  criteria: ["1.4.2", "2.2.2"],
  severity: "majeur",
  run(doc: Doc): RuleFinding[] {
    const out: RuleFinding[] = [];
    for (const el of doc.elements) {
      if (el.tag !== "audio" && el.tag !== "video") continue;
      if (!hasAttr(el, "autoplay")) continue;
      // muted video has no sound → it falls under moving content (13.8), audio always 4.10
      if (el.tag === "video" && mutedStatically(el)) {
        out.push({
          criteriaId: "2.2.2",
          el,
          msgId: "autoplay-media.muted-video",
        });
        continue;
      }
      out.push({
        criteriaId: el.tag === "audio" ? "1.4.2" : "2.2.2",
        el,
        msgId: "autoplay-media.audible",
        params: { tag: el.tag },
      });
    }
    return out;
  },
};

// A <video> that carries audio (not muted) but ships no <track> — no synchronized
// captions/subtitles. We flag the structural absence; whether captions are *required*
// (the video may be silent/decorative) stays a human judgment, hence majeur not bloquant.
const mediaNoTrack: Rule = {
  id: "media-no-track",
  criteria: ["1.2.2"],
  severity: "majeur",
  run(doc: Doc): RuleFinding[] {
    const out: RuleFinding[] = [];
    for (const el of doc.elements) {
      if (el.tag !== "video") continue;
      if (mutedStatically(el)) continue; // statically-muted video carries no audio to caption
      if (descendants(el).some((d) => d.tag === "track")) continue;
      out.push({
        criteriaId: "1.2.2",
        el,
        msgId: "media-no-track",
      });
    }
    return out;
  },
};

export const multimediaRules: Rule[] = [autoplayMedia, mediaNoTrack];
