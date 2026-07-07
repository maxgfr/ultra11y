// Theme 7 — Scripts / ARIA correctness (the statically-checkable slice).
import type { Doc, El } from "../parse/html.js";
import { attr, hasAttr, descendants, ancestors } from "../parse/html.js";
import { isIntrinsic } from "../parse/jsx-bridge.js";
import { mayInjectContent } from "../name.js";
import type { Rule, RuleFinding } from "./rule.js";

const INTERACTIVE_ROLES = [
  "button",
  "link",
  "checkbox",
  "radio",
  "tab",
  "menuitem",
  "menuitemcheckbox",
  "menuitemradio",
  "option",
  "switch",
  "textbox",
  "combobox",
  "slider",
  "spinbutton",
];

function isInteractive(el: El): boolean {
  if (el.tag === "a") return hasAttr(el, "href");
  if (["button", "select", "textarea"].includes(el.tag)) return true;
  if (el.tag === "input") return (attr(el, "type") ?? "text").toLowerCase() !== "hidden";
  return INTERACTIVE_ROLES.includes((attr(el, "role") ?? "").trim());
}

const DISABLEABLE = new Set(["button", "input", "select", "textarea", "fieldset", "optgroup", "option"]);
const isDisabled = (el: El): boolean => DISABLEABLE.has(el.tag) && hasAttr(el, "disabled");

function isFocusable(el: El): boolean {
  // An explicit tabindex wins: -1 removes an element from the tab order (not keyboard-
  // focusable), >=0 puts it in — even on an intrinsically-interactive element.
  const tiRaw = attr(el, "tabindex");
  if (tiRaw !== undefined) {
    const ti = Number(tiRaw.trim());
    if (!Number.isNaN(ti)) return ti >= 0;
  }
  if (isDisabled(el)) return false; // a disabled control is not focusable
  if (isInteractive(el)) return true;
  return hasAttr(el, "contenteditable") && attr(el, "contenteditable") !== "false";
}

// Concrete WAI-ARIA 1.2 roles (abstract roles like "widget"/"range" are invalid as author values).
const VALID_ROLES = new Set([
  "alert",
  "alertdialog",
  "application",
  "article",
  "banner",
  "blockquote",
  "button",
  "caption",
  "cell",
  "checkbox",
  "code",
  "columnheader",
  "combobox",
  "complementary",
  "contentinfo",
  "definition",
  "deletion",
  "dialog",
  "directory",
  "document",
  "emphasis",
  "feed",
  "figure",
  "form",
  "generic",
  "grid",
  "gridcell",
  "group",
  "heading",
  "img",
  "insertion",
  "link",
  "list",
  "listbox",
  "listitem",
  "log",
  "main",
  "marquee",
  "math",
  "menu",
  "menubar",
  "menuitem",
  "menuitemcheckbox",
  "menuitemradio",
  "meter",
  "navigation",
  "none",
  "note",
  "option",
  "paragraph",
  "presentation",
  "progressbar",
  "radio",
  "radiogroup",
  "region",
  "row",
  "rowgroup",
  "rowheader",
  "scrollbar",
  "search",
  "searchbox",
  "separator",
  "slider",
  "spinbutton",
  "status",
  "strong",
  "subscript",
  "superscript",
  "switch",
  "tab",
  "table",
  "tablist",
  "tabpanel",
  "term",
  "textbox",
  "time",
  "timer",
  "toolbar",
  "tooltip",
  "tree",
  "treegrid",
  "treeitem",
]);

const IDREF_ATTRS = ["aria-labelledby", "aria-describedby", "aria-controls", "aria-owns", "aria-details", "aria-errormessage", "aria-flowto"];
const IDREF_SINGLE = ["aria-activedescendant"];

const invalidAriaRole: Rule = {
  id: "invalid-aria-role",
  criteria: ["4.1.2"],
  severity: "majeur",
  run(doc: Doc): RuleFinding[] {
    const out: RuleFinding[] = [];
    for (const el of doc.elements) {
      if (!isIntrinsic(el.tag)) continue; // a component's `role` is a prop, not the HTML role attr
      const role = (attr(el, "role") ?? "").trim();
      if (!role) continue;
      if (role.includes("{")) continue; // dynamic role expression (role={…}) — value unknown, can't validate
      const tokens = role.split(/\s+/);
      const bad = tokens.filter((t) => !VALID_ROLES.has(t.toLowerCase()));
      if (bad.length) {
        out.push({
          criteriaId: "4.1.2",
          el,
          msgId: "invalid-aria-role",
          params: { roles: bad.join(" ") },
        });
      }
    }
    return out;
  },
};

const ariaRefMissingId: Rule = {
  id: "aria-ref-missing-id",
  criteria: ["4.1.2"],
  severity: "bloquant",
  run(doc: Doc): RuleFinding[] {
    const out: RuleFinding[] = [];
    for (const el of doc.elements) {
      const refs: { attr: string; ids: string[] }[] = [];
      for (const a of IDREF_ATTRS) {
        const v = attr(el, a);
        // A JSX expression value (e.g. aria-describedby={err ? "x" : undefined}) is dynamic,
        // not a literal id list — never split/verify it (would yield garbage ids).
        if (v && !v.includes("{")) refs.push({ attr: a, ids: v.split(/\s+/).filter(Boolean) });
      }
      for (const a of IDREF_SINGLE) {
        const v = (attr(el, a) ?? "").trim();
        if (v && !v.includes("{")) refs.push({ attr: a, ids: [v] });
      }
      for (const { attr: a, ids } of refs) {
        const missing = ids.filter((id) => !doc.byId.has(id));
        if (missing.length) {
          out.push({
            criteriaId: "4.1.2",
            el,
            msgId: "aria-ref-missing-id",
            params: { attr: a, ids: missing.map((m) => `#${m}`).join(", ") },
          });
        }
      }
    }
    return out;
  },
};

// implicit roles that make role="…" redundant
const IMPLICIT_ROLE: Record<string, string> = {
  button: "button",
  nav: "navigation",
  main: "main",
  ul: "list",
  ol: "list",
  li: "listitem",
  table: "table",
  h1: "heading",
  h2: "heading",
  h3: "heading",
  h4: "heading",
  h5: "heading",
  h6: "heading",
  form: "form",
  article: "article",
  aside: "complementary",
  dialog: "dialog",
  figure: "figure",
};

const redundantAria: Rule = {
  id: "redundant-aria",
  criteria: ["4.1.2"],
  severity: "mineur",
  run(doc: Doc): RuleFinding[] {
    const out: RuleFinding[] = [];
    for (const el of doc.elements) {
      const role = (attr(el, "role") ?? "").trim().toLowerCase();
      if (!role) continue;
      let implicit = IMPLICIT_ROLE[el.tag];
      if (el.tag === "a" && hasAttr(el, "href")) implicit = "link";
      if (implicit && implicit === role) {
        out.push({
          criteriaId: "4.1.2",
          el,
          msgId: "redundant-aria",
          params: { role, tag: el.tag },
        });
      }
    }
    return out;
  },
};

const NONINTERACTIVE = new Set(["div", "span"]);

const clickableNoninteractive: Rule = {
  id: "clickable-noninteractive",
  criteria: ["4.1.2", "2.1.1"],
  severity: "majeur",
  run(doc: Doc): RuleFinding[] {
    const out: RuleFinding[] = [];
    for (const el of doc.elements) {
      if (!NONINTERACTIVE.has(el.tag)) continue;
      if (!hasAttr(el, "onclick")) continue;
      const role = (attr(el, "role") ?? "").trim();
      // Keyboard-focusable via tabindex means value >= 0 (a negative tabindex is not in the
      // tab order); check the VALUE, not mere presence.
      const tiRaw = (attr(el, "tabindex") ?? "").trim();
      const hasTab = tiRaw !== "" && Number(tiRaw) >= 0;
      const interactiveRole = INTERACTIVE_ROLES.includes(role); // the canonical list (radio/slider/…), not an ad-hoc subset
      if (interactiveRole && hasTab) continue; // properly upgraded (interactive role + keyboard-focusable)
      const noKeyboard = !hasTab;
      out.push({
        criteriaId: noKeyboard ? "2.1.1" : "4.1.2",
        el,
        msgId: "clickable-noninteractive",
        params: { tag: el.tag, focusIssue: noKeyboard ? "no-tabindex" : "no-role" },
      });
    }
    return out;
  },
};

const REQUIRED_CHILDREN: Record<string, string[]> = {
  list: ["listitem"],
  tablist: ["tab"],
  radiogroup: ["radio"],
  tree: ["treeitem"],
  menu: ["menuitem", "menuitemcheckbox", "menuitemradio"],
  menubar: ["menuitem", "menuitemcheckbox", "menuitemradio"],
};

function satisfiesChild(d: El, reqRoles: string[]): boolean {
  const role = (attr(d, "role") ?? "").trim();
  if (reqRoles.includes(role)) return true;
  if (reqRoles.includes("listitem") && d.tag === "li") return true;
  if (reqRoles.includes("radio") && d.tag === "input" && (attr(d, "type") ?? "").toLowerCase() === "radio") return true;
  return false;
}

const ariaRequiredChildren: Rule = {
  id: "aria-required-children",
  criteria: ["4.1.2"],
  severity: "majeur",
  run(doc: Doc): RuleFinding[] {
    const out: RuleFinding[] = [];
    for (const el of doc.elements) {
      const role = (attr(el, "role") ?? "").trim();
      const req = REQUIRED_CHILDREN[role];
      if (!req) continue;
      if (hasAttr(el, "aria-owns")) continue; // children may be referenced elsewhere
      if (descendants(el).some((d) => satisfiesChild(d, req))) continue;
      if (mayInjectContent(el)) continue; // required children injected via <slot>/component/{@render}
      out.push({
        criteriaId: "4.1.2",
        el,
        msgId: "aria-required-children",
        params: { role, req: req.join("/") },
      });
    }
    return out;
  },
};

const ariaHiddenFocusable: Rule = {
  id: "aria-hidden-focusable",
  criteria: ["4.1.2"],
  severity: "majeur",
  run(doc: Doc): RuleFinding[] {
    const out: RuleFinding[] = [];
    for (const el of doc.elements) {
      if (attr(el, "aria-hidden") !== "true") continue;
      const focusableHere = isFocusable(el) || descendants(el).some(isFocusable);
      if (!focusableHere) continue;
      out.push({
        criteriaId: "4.1.2",
        el,
        msgId: "aria-hidden-focusable",
      });
    }
    return out;
  },
};

const nestedInteractive: Rule = {
  id: "nested-interactive",
  criteria: ["4.1.2"],
  severity: "majeur",
  run(doc: Doc): RuleFinding[] {
    const out: RuleFinding[] = [];
    for (const el of doc.elements) {
      if (!isInteractive(el)) continue;
      if (!ancestors(el).some(isInteractive)) continue;
      out.push({
        criteriaId: "4.1.2",
        el,
        msgId: "nested-interactive",
        params: { tag: el.tag },
      });
    }
    return out;
  },
};

// WAI-ARIA implicit live-region politeness per role. A status message whose role and
// aria-live disagree — or whose aria-live value is invalid — is restituted incoherently
// (an alert announced "polite" is queued and may be missed; an invalid value is ignored).
const ROLE_LIVENESS: Record<string, "assertive" | "polite" | "off"> = {
  alert: "assertive",
  alertdialog: "assertive",
  status: "polite",
  log: "polite",
  timer: "off",
  marquee: "off",
};
const VALID_LIVE = new Set(["off", "polite", "assertive"]);

const liveRegionConflict: Rule = {
  id: "live-region-conflict",
  criteria: ["4.1.3"],
  severity: "majeur",
  run(doc: Doc): RuleFinding[] {
    const out: RuleFinding[] = [];
    for (const el of doc.elements) {
      if (!isIntrinsic(el.tag)) continue; // a component's aria-live/role is a prop, not the HTML attr
      const liveRaw = attr(el, "aria-live");
      if (liveRaw === undefined || liveRaw.includes("{")) continue; // absent or dynamic value — nothing to assert
      const live = liveRaw.trim().toLowerCase();
      if (!live) continue;
      if (!VALID_LIVE.has(live)) {
        out.push({
          criteriaId: "4.1.3",
          el,
          msgId: "live-region-conflict.invalid-value",
          params: { value: liveRaw },
        });
        continue;
      }
      const role = (attr(el, "role") ?? "").trim().toLowerCase();
      if (role.includes("{")) continue; // dynamic role expression — can't compare
      const want = ROLE_LIVENESS[role];
      // Overriding an 'off'-default role (timer/marquee) up to polite/assertive is a
      // spec-permitted author choice (aria-live overrides the implicit default), not a
      // conflict — so only alert/alertdialog/status/log (want !== "off") are checked.
      if (want && want !== "off" && want !== live) {
        out.push({
          criteriaId: "4.1.3",
          el,
          severity: want === "assertive" ? "majeur" : "mineur",
          msgId: "live-region-conflict.mismatch",
          params: { role, want, live },
        });
      }
    }
    return out;
  },
};

// An error/alert container announced politely (aria-live="polite") instead of
// assertively. A status MESSAGE that reports an error should interrupt
// (role="alert" / aria-live="assertive") so it is not queued and missed. This is the
// `polite`-with-no-role case the existing live-region-conflict (role↔aria-live) leaves
// open; only fired when the container's class/id marks it as an ERROR specifically.
// The bare `alert`/`fr-alert` tokens are intentionally excluded: DSFR (and Bootstrap)
// reuse them for success/info/warning variants — `fr-alert fr-alert--success` with
// aria-live="polite" is the CORRECT status pattern, not a defect. `error`/`danger`/
// `invalid` still match error variants (`fr-alert--error`, `fr-error`, `alert-danger`).
const ERROR_ALERT_CONTAINER = /(^|[-_ ])(error|danger|invalid)/i;

const statusMessageNotAssertive: Rule = {
  id: "status-message-not-assertive",
  criteria: ["4.1.3"],
  severity: "mineur",
  run(doc: Doc): RuleFinding[] {
    const out: RuleFinding[] = [];
    for (const el of doc.elements) {
      if (!isIntrinsic(el.tag)) continue; // a component's aria-live/role is a prop, not the HTML attr
      const liveRaw = attr(el, "aria-live");
      if (liveRaw === undefined || liveRaw.includes("{")) continue; // absent or dynamic value
      if (liveRaw.trim().toLowerCase() !== "polite") continue; // only polite is at issue here
      if (hasAttr(el, "role")) continue; // role-driven liveness is live-region-conflict's job
      const signal = (attr(el, "class") ?? "") + " " + (attr(el, "id") ?? "");
      if (!ERROR_ALERT_CONTAINER.test(signal)) continue;
      out.push({
        criteriaId: "4.1.3",
        el,
        msgId: "status-message-not-assertive",
      });
    }
    return out;
  },
};

export const scriptsAriaRules: Rule[] = [
  invalidAriaRole,
  ariaRefMissingId,
  redundantAria,
  clickableNoninteractive,
  ariaRequiredChildren,
  ariaHiddenFocusable,
  nestedInteractive,
  liveRegionConflict,
  statusMessageNotAssertive,
];
