# Focus & interaction logic — the agent reads the source and reasons about human logic

A static engine sees *structure*. It cannot see what happens when a user **tabs, types, or
opens a dialog** — focus visibility, focus order, focus traps, what changes on focus/input,
whether a mouse interaction has a keyboard equivalent. ultra11y therefore marks every such
criterion **`manual` / residual risk** (never silently "conforming") and hands it to **you,
the agent**. This is the human-logic half of the division of labour, and it is where reading
the *actual source* matters most.

> **Read the whole component, not just the report.** The audit parses every element in scope
> (`audit --graph` resolves imports across files), but a focus/logic verdict requires reading
> the real source of each interactive component — the JSX, the event handlers, the effects,
> the state — and reasoning about what a keyboard/screen-reader user experiences.

## The criteria you own (surfaced as residual risks)

| SC | What to reason about, reading the source |
|---|---|
| **2.1.1 Keyboard** | Every action reachable by mouse is reachable by keyboard. Mouse-only handlers (`onMouseEnter`/`onMouseLeave`/`onClick` on a non-interactive element) need a focus/key equivalent (`onFocus`/`onKeyDown`) or a native interactive element. |
| **2.1.2 No keyboard trap** | Focus can leave every widget (modals, menus, date pickers, embeds). Trace the trap logic and the Escape/return path. |
| **2.4.3 Focus order** | Tab order follows meaning. Watch DOM order vs visual order, portals/modals, and `tabIndex` (positive is already flagged; reason about roving `tabIndex` in menus/tabs/grids). |
| **2.4.7 Focus visible** | A visible focus indicator on every focusable element — check CSS (`:focus`/`:focus-visible`, never a bare `outline: none`) at render. |
| **2.4.11 Focus not obscured** | The focused element isn't hidden behind sticky headers/footers/overlays. |
| **3.2.1 On focus / 3.2.2 On input** | Focusing or changing a control doesn't trigger an unexpected context change (auto-submit, navigation, surprise modal). Trace `onFocus`/`onChange` handlers. |
| **2.5.3 Label in name** | The visible label text is contained in the accessible name (so voice control works). |

## Component patterns to trace (where focus logic lives)

- **Dialog / modal**: focus moves into it on open, is trapped while open, returns to the
  trigger on close, Escape closes it, `aria-modal`/`role="dialog"` + a label.
- **Menu / dropdown / combobox / listbox**: roving `tabIndex` (one tab stop), arrow-key
  navigation, Escape, `aria-expanded`/`aria-activedescendant`, focus returned to the trigger.
- **Tabs / accordion**: arrow keys move between tabs, focus follows selection appropriately.
- **Toast / live region**: announced without stealing focus.
- **Custom controls built on `<div>`/`<span>`**: prefer a native element; if not, they need
  `role`, `tabindex="0"`, key handlers (Enter/Space), and state in ARIA — the engine flags
  the clickable non-interactive element (2.1.1), but YOU verify the full keyboard contract.

## Workflow

1. **Audit the full scope** with `audit --graph` so every component/import is captured.
2. **Build the judgment worklist**: `verify --report … --semantic` lists each manual
   criterion grounded in its W3C Understanding reference (see `references/verify.md` /
   `references/judgment.md`).
3. **For each focus/logic item, open the real source** of the relevant components and reason
   about the keyboard/focus/interaction behaviour above. Decide `supported` / `partial` /
   `refuted` with a concrete cited reason (`file:line` + what the keyboard user experiences).
   What needs a rendered DOM (focus *visible*, *not obscured*) stays a named residual risk or
   goes through the `scan` dynamic tier (`references/dynamic.md`). The local runtime
   (`scan --runtime local`) now **probes focus visibility (2.4.7)** directly — tabbing through
   focusables and flagging any whose computed style does not change on focus — alongside 200%
   zoom (1.4.4), text spacing (1.4.12) and content-on-hover (1.4.13). A
   probe finding is a real NC; a clean probe still leaves the SC `manual` — never marked
   conforming on a guess.
4. **`verify --apply`** to gate: an unjudged or refuted focus/logic claim fails.

The rule that never bends: a focus/interaction criterion you could not verify by reading the
source (or rendering) is an **explicit residual risk**, not a silent pass.
