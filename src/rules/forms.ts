// Theme 11 — Forms: every field has a programmatic label + group/structure checks.
import type { Doc, El } from "../parse/html.js";
import { attr, hasAttr, hasDynamicSpread, descendants, visibleText } from "../parse/html.js";
import { isIntrinsic } from "../parse/jsx-bridge.js";
import { controlLabel, isFormField, mayInjectContent } from "../name.js";

// The element's WHOLE content is a slot/snippet passthrough — a DIRECT `<slot>` child or
// a `{@render …}`/`{children}` render-expression text node — so the legend the caller
// provides is invisible here. (Must be a direct child: a fieldset that merely *contains*
// component fields with no legend is a real violation, not a passthrough.)
function contentInjected(el: El): boolean {
  return el.children.some((c) => (c.type === "element" && c.tag === "slot") || (c.type === "text" && /\{@render|\{children/.test(c.data)));
}
import type { Rule, RuleFinding } from "./rule.js";

// title/placeholder are NOT real labels for these rules
const REAL_LABEL = new Set(["for", "wrapping", "aria-label", "aria-labelledby"]);

const controlLabelMissing: Rule = {
  id: "control-label-missing",
  criteria: ["4.1.2"],
  severity: "bloquant",
  run(doc: Doc): RuleFinding[] {
    const out: RuleFinding[] = [];
    for (const el of doc.elements) {
      if (!isFormField(el)) continue;
      const { via } = controlLabel(el, doc);
      if (via && REAL_LABEL.has(via)) continue;
      // title yields an accessible name (accname fallback / WCAG H65) — a weak one, surfaced
      // as a minor control-name-title-only finding, not a blocking "no label".
      if (via === "title") continue;
      // A spread (JSX {...props} / Vue v-bind="…" / Svelte {...rest}) may inject
      // aria-label/aria-labelledby we can't see — don't assert a missing label.
      if (hasDynamicSpread(el)) continue;
      if (hasAttr(el, "placeholder")) continue; // reported by placeholder-as-label
      out.push({
        criteriaId: "4.1.2",
        el,
        msgId: "control-label-missing",
        params: { tag: el.tag },
      });
    }
    return out;
  },
};

const placeholderAsLabel: Rule = {
  id: "placeholder-as-label",
  criteria: ["4.1.2"],
  severity: "majeur",
  run(doc: Doc): RuleFinding[] {
    const out: RuleFinding[] = [];
    for (const el of doc.elements) {
      if (!isFormField(el)) continue;
      if (!hasAttr(el, "placeholder")) continue;
      const { via } = controlLabel(el, doc);
      if (via && REAL_LABEL.has(via)) continue;
      out.push({
        criteriaId: "4.1.2",
        el,
        msgId: "placeholder-as-label",
        params: { value: attr(el, "placeholder") ?? "" },
      });
    }
    return out;
  },
};

const fieldsetLegendMissing: Rule = {
  id: "fieldset-legend-missing",
  criteria: ["1.3.1"],
  severity: "majeur",
  run(doc: Doc): RuleFinding[] {
    const out: RuleFinding[] = [];
    for (const el of doc.elements) {
      if (el.tag !== "fieldset") continue;
      const legend = el.children.find((c) => c.type === "element" && c.tag === "legend");
      if (legend && legend.type === "element" && visibleText(legend)) continue;
      if (hasAttr(el, "aria-label") || hasAttr(el, "aria-labelledby")) continue;
      if (contentInjected(el)) continue; // legend supplied via slot/{@render children()}/a component
      out.push({
        criteriaId: "1.3.1",
        el,
        msgId: "fieldset-legend-missing",
      });
    }
    return out;
  },
};

const formFieldMultipleLabels: Rule = {
  id: "form-field-multiple-labels",
  criteria: ["4.1.2"],
  severity: "mineur",
  run(doc: Doc): RuleFinding[] {
    const counts = new Map<string, number>();
    for (const el of doc.elements) {
      if (el.tag !== "label") continue;
      const f = attr(el, "for");
      if (f) counts.set(f, (counts.get(f) ?? 0) + 1);
    }
    const out: RuleFinding[] = [];
    for (const el of doc.elements) {
      if (!isFormField(el)) continue;
      const id = attr(el, "id");
      if (id && (counts.get(id) ?? 0) > 1) {
        out.push({
          criteriaId: "4.1.2",
          el,
          msgId: "form-field-multiple-labels",
          params: { tag: el.tag, count: counts.get(id) ?? 0, id },
        });
      }
    }
    return out;
  },
};

const selectHasOption: Rule = {
  id: "select-has-option",
  criteria: ["4.1.2"],
  severity: "mineur",
  run(doc: Doc): RuleFinding[] {
    const out: RuleFinding[] = [];
    for (const el of doc.elements) {
      if (el.tag !== "select") continue;
      if (descendants(el).some((d) => d.tag === "option")) continue;
      if (mayInjectContent(el) || contentInjected(el)) continue; // options injected via <slot>/component/{@render}
      out.push({
        criteriaId: "4.1.2",
        el,
        msgId: "select-has-option",
      });
    }
    return out;
  },
};

// A <label for="x"> whose target id exists nowhere in the document — the visible label
// is not programmatically associated with any field (a common typo'd for/id pairing).
// Same-document only; cross-file label/field association is out of scope (see references/cross-file.md).
const labelForDangling: Rule = {
  id: "label-for-dangling",
  criteria: ["1.3.1"],
  severity: "majeur",
  run(doc: Doc): RuleFinding[] {
    const out: RuleFinding[] = [];
    for (const el of doc.elements) {
      if (el.tag !== "label") continue;
      const f = (attr(el, "for") ?? "").trim();
      if (!f || f.includes("{")) continue; // empty, or a JSX expression remnant (dynamic for=)
      if (doc.byId.has(f)) continue;
      // Wired via an id-bearing prop on a sibling component? Design-system field/upload
      // components take the input id as a prop (e.g. <FileUpload inputId="x"/>) and render
      // the <input id="x"> internally — the association is real, just not a literal id here.
      const passedAsIdProp = doc.elements.some((e) => e !== el && Object.entries(e.attribs).some(([k, v]) => v === f && /id/i.test(k)));
      if (passedAsIdProp) continue;
      out.push({
        criteriaId: "1.3.1",
        el,
        msgId: "label-for-dangling",
        params: { id: f },
      });
    }
    return out;
  },
};

// WCAG 3.3.1 Error Identification: a control flagged aria-invalid="true" must point AT
// the error text (aria-describedby or aria-errormessage) so assistive tech can restitute
// *why* it is invalid. aria-invalid alone announces "invalid" with no reason — the error
// is signalled but not associated (cross-referenced by RGAA 11.10). The inverse case
// (visible error text not linked at all) is a judgment call left to the auditor.
const ariaInvalidNoDescription: Rule = {
  id: "aria-invalid-no-description",
  criteria: ["3.3.1"],
  severity: "majeur",
  run(doc: Doc): RuleFinding[] {
    const out: RuleFinding[] = [];
    for (const el of doc.elements) {
      if (!isFormField(el)) continue;
      const invalid = attr(el, "aria-invalid");
      if (invalid === undefined || invalid.includes("{")) continue; // absent or dynamic value — nothing to assert
      if (invalid.trim().toLowerCase() !== "true") continue; // "false"/"grammar"/"spelling" are not unlinked errors
      if (hasAttr(el, "aria-describedby") || hasAttr(el, "aria-errormessage")) continue; // error text is linked
      if (hasDynamicSpread(el)) continue; // a spread (JSX {...props} / v-bind) may inject the description
      out.push({
        criteriaId: "3.3.1",
        el,
        msgId: "aria-invalid-no-description",
        params: { tag: el.tag },
      });
    }
    return out;
  },
};

// The complement of aria-invalid-no-description: a VISIBLE error-text node that carries
// a stable id but is referenced by NO field (no aria-describedby/aria-errormessage points
// at it). The error is shown but not programmatically tied to its field (WCAG 3.3.1).
// Only fired on a literal, present id with no literal referrer — provable, low FP.
const ERROR_TEXT_CLASS = /(^|[-_ ])(fr-error-text|fr-message--error|error-text|error-message|field-error|invalid-feedback)/i;

const errorNotAssociated: Rule = {
  id: "error-not-associated",
  criteria: ["3.3.1"],
  severity: "majeur",
  run(doc: Doc): RuleFinding[] {
    const referenced = new Set<string>();
    // Ids targeted by a same-document in-page anchor (<a href="#id">). An error SUMMARY that
    // a "jump to error" link points at is a page-level status region (G139), not a per-field
    // association gap — its restitution comes from the anchor + role/aria-live, not describedby.
    const anchorTargets = new Set<string>();
    for (const el of doc.elements) {
      if (el.tag === "a") {
        const href = (attr(el, "href") ?? "").trim();
        if (href.startsWith("#") && href.length > 1) anchorTargets.add(href.slice(1));
      }
      for (const a of ["aria-describedby", "aria-errormessage"]) {
        const v = attr(el, a);
        if (!v) continue;
        if (!v.includes("{")) {
          for (const id of v.split(/\s+/).filter(Boolean)) referenced.add(id);
        } else {
          // Dynamic value, e.g. aria-describedby={error ? "women-error" : undefined}. The
          // JSX parser keeps the raw `{…}` slice, so pull out any string-literal ids: a
          // conditionally-applied describedby still associates the error (common React
          // pattern) — otherwise the matching <p id="women-error"> is a false positive.
          for (const m of v.matchAll(/["'`]([^"'`]+)["'`]/g)) for (const id of m[1]!.split(/\s+/).filter(Boolean)) referenced.add(id);
        }
      }
    }
    const out: RuleFinding[] = [];
    for (const el of doc.elements) {
      const cls = attr(el, "class");
      if (!cls || !ERROR_TEXT_CLASS.test(cls)) continue;
      const id = (attr(el, "id") ?? "").trim();
      if (!id || id.includes("{")) continue; // no stable literal id to reference — not provable
      if (referenced.has(id)) continue; // already linked to a field
      // A live/alert summary region announces itself; it is not a per-field association gap.
      const role = (attr(el, "role") ?? "").trim();
      if (role === "alert" || role === "status" || hasAttr(el, "aria-live")) continue;
      if (anchorTargets.has(id)) continue; // an in-page "jump to error" link targets it — a summary, not a field error
      if (hasDynamicSpread(el)) continue;
      out.push({
        criteriaId: "3.3.1",
        el,
        msgId: "error-not-associated",
        params: { id },
      });
    }
    return out;
  },
};

// WCAG 1.3.5 (identify input purpose) + 4.1.2 (state). Two provable, conservative gaps:
//  (i)  an identify-purpose <input> (email/tel, or a purpose token in name/id) with no
//       autocomplete attribute — the field's purpose is not exposed programmatically.
//  (ii) a CUSTOM widget (role=textbox/combobox/checkbox/… on an intrinsic non-native
//       element) marked required by class but missing aria-required — required state lost.
const PURPOSE_TYPES = new Set(["email", "tel"]);
// Whole-token match (split on separators AND camelCase), so `city` doesn't match veloCITY
// and `tel` doesn't match hoTEL — an unanchored substring regex mislabels them 1.3.5 fields.
const PURPOSE_WORDS = new Set(["email", "tel", "telephone", "phone", "mobile", "postal", "zip", "address", "street", "city", "country"]);
const hasPurposeToken = (nameId: string): boolean => nameId.split(/[-_\s]+|(?<=[a-z0-9])(?=[A-Z])/).some((t) => PURPOSE_WORDS.has(t.toLowerCase()));
const SKIP_INPUT_TYPES = new Set(["search", "hidden", "submit", "reset", "button", "password", "checkbox", "radio", "file", "range", "color"]);
const CUSTOM_WIDGET_ROLES = new Set(["textbox", "combobox", "checkbox", "radio", "switch", "spinbutton"]);
const REQUIRED_SIGNAL = /(^|[-_ ])(required|mandatory|is-required)/i;

const fieldPurposeIncomplete: Rule = {
  id: "field-purpose-incomplete",
  criteria: ["1.3.5", "4.1.2"],
  severity: "mineur",
  run(doc: Doc): RuleFinding[] {
    const out: RuleFinding[] = [];
    for (const el of doc.elements) {
      // (i) identify-purpose input without autocomplete (1.3.5)
      if (el.tag === "input") {
        const type = (attr(el, "type") ?? "text").toLowerCase();
        if (!type.includes("{") && !SKIP_INPUT_TYPES.has(type)) {
          const nameId = `${attr(el, "name") ?? ""} ${attr(el, "id") ?? ""}`;
          const purpose = PURPOSE_TYPES.has(type) || hasPurposeToken(nameId);
          if (purpose && !hasAttr(el, "autocomplete") && !hasDynamicSpread(el)) {
            out.push({
              criteriaId: "1.3.5",
              el,
              msgId: "field-purpose-incomplete.autocomplete",
              params: { type },
            });
          }
        }
      }
      // (ii) custom required widget without aria-required (4.1.2)
      const role = (attr(el, "role") ?? "").trim().toLowerCase();
      if (isIntrinsic(el.tag) && CUSTOM_WIDGET_ROLES.has(role) && REQUIRED_SIGNAL.test(attr(el, "class") ?? "")) {
        if (!hasAttr(el, "aria-required") && !hasAttr(el, "required") && !hasDynamicSpread(el)) {
          out.push({
            criteriaId: "4.1.2",
            el,
            msgId: "field-purpose-incomplete.aria-required",
            params: { role },
          });
        }
      }
    }
    return out;
  },
};

export const formsRules: Rule[] = [
  controlLabelMissing,
  placeholderAsLabel,
  fieldsetLegendMissing,
  formFieldMultipleLabels,
  selectHasOption,
  labelForDangling,
  ariaInvalidNoDescription,
  errorNotAssociated,
  fieldPurposeIncomplete,
];
