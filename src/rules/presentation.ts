// Theme 10 — Presentation: the statically-checkable slice of zoom support.
// 10.4 (text legible at 200%) generally needs rendering, but a viewport meta that
// blocks zooming is a DEFINITE failure detectable from the markup alone.
import type { Doc } from "../parse/html.js";
import { attr } from "../parse/html.js";
import type { Rule, RuleFinding } from "./rule.js";

const metaViewportZoomBlock: Rule = {
  id: "meta-viewport-zoom-block",
  criteria: ["1.4.4"],
  severity: "majeur",
  run(doc: Doc): RuleFinding[] {
    const out: RuleFinding[] = [];
    for (const el of doc.elements) {
      if (el.tag !== "meta" || (attr(el, "name") ?? "").toLowerCase() !== "viewport") continue;
      const content = (attr(el, "content") ?? "").toLowerCase();
      const pairs = new Map<string, string>();
      for (const part of content.split(/[,;]/)) {
        const [k, v] = part.split("=").map((s) => s.trim());
        if (k) pairs.set(k, v ?? "");
      }
      const userScalable = pairs.get("user-scalable");
      const maxScale = pairs.get("maximum-scale");
      // Only a real, finite maximum-scale < 2 blocks zoom. An empty (`maximum-scale=`)
      // or malformed value must NOT be treated as 0 (Number("") === 0) and falsely flagged.
      const maxScaleNum = maxScale !== undefined && maxScale.trim() !== "" ? Number(maxScale) : Number.NaN;
      const blocked = userScalable === "no" || userScalable === "0" || (Number.isFinite(maxScaleNum) && maxScaleNum < 2);
      if (!blocked) continue;
      out.push({
        criteriaId: "1.4.4",
        el,
        message: `<meta viewport> bloque le zoom (${userScalable === "no" || userScalable === "0" ? "user-scalable=no" : `maximum-scale=${maxScale}`}) — agrandissement à 200% empêché.`,
        remediation: `Retirez user-scalable=no et maximum-scale (ou maximum-scale ≥ 2) du content du viewport.`,
      });
    }
    return out;
  },
};

export const presentationRules: Rule[] = [metaViewportZoomBlock];
