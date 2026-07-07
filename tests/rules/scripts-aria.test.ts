import { describe, it, expect } from "vitest";
import { findOf } from "./helpers.js";

describe("invalid-aria-role (7.1)", () => {
  it("conforming: valid role", () => {
    expect(findOf(`<div role="navigation">x</div>`, "invalid-aria-role")).toHaveLength(0);
  });
  it("non-conforming: made-up role", () => {
    const f = findOf(`<div role="navbar">x</div>`, "invalid-aria-role");
    expect(f).toHaveLength(1);
    expect(f[0]!.criteriaId).toBe("4.1.2");
  });
});

describe("aria-ref-missing-id (7.1)", () => {
  it("conforming: aria-labelledby resolves", () => {
    expect(findOf(`<h2 id="t">Titre</h2><div aria-labelledby="t">x</div>`, "aria-ref-missing-id")).toHaveLength(0);
  });
  it("non-conforming: dangling aria-labelledby / aria-controls", () => {
    expect(findOf(`<div aria-labelledby="ghost">x</div>`, "aria-ref-missing-id")).toHaveLength(1);
    expect(findOf(`<button aria-controls="nope">x</button>`, "aria-ref-missing-id")).toHaveLength(1);
  });
});

describe("redundant-aria (7.1)", () => {
  it("conforming: no redundant role", () => {
    expect(findOf(`<button>x</button>`, "redundant-aria")).toHaveLength(0);
    expect(findOf(`<div role="button">x</div>`, "redundant-aria")).toHaveLength(0);
  });
  it("non-conforming: role duplicating implicit role", () => {
    expect(findOf(`<button role="button">x</button>`, "redundant-aria")).toHaveLength(1);
    expect(findOf(`<nav role="navigation">x</nav>`, "redundant-aria")).toHaveLength(1);
    expect(findOf(`<a href="/" role="link">x</a>`, "redundant-aria")).toHaveLength(1);
  });
});

describe("clickable-noninteractive (7.1/7.3)", () => {
  it("conforming: native button, or upgraded div", () => {
    expect(findOf(`<button onClick={f}>x</button>`, "clickable-noninteractive", "C.tsx")).toHaveLength(0);
    expect(findOf(`<div onClick={f} role="button" tabIndex={0}>x</div>`, "clickable-noninteractive", "C.tsx")).toHaveLength(0);
  });
  it("non-conforming: clickable div without keyboard/role", () => {
    const f = findOf(`<div onClick={f}>Valider</div>`, "clickable-noninteractive", "C.tsx");
    expect(f).toHaveLength(1);
    expect(f[0]!.criteriaId).toBe("2.1.1");
  });
  it("conforming: APG custom radio (role=radio + tabIndex=0 + handler) is a properly upgraded control", () => {
    expect(findOf(`<div onClick={f} role="radio" aria-checked={true} tabIndex={0}>Basic</div>`, "clickable-noninteractive", "C.tsx")).toHaveLength(0);
  });
  it("non-conforming: role upgrade with a NEGATIVE tabindex is not keyboard-reachable → 2.1.1", () => {
    const f = findOf(`<div onClick={f} role="button" tabIndex={-1}>x</div>`, "clickable-noninteractive", "C.tsx");
    expect(f).toHaveLength(1);
    expect(f[0]!.criteriaId).toBe("2.1.1");
  });
});

describe("aria-required-children (7.1)", () => {
  it("conforming: tablist with a tab, list role with li", () => {
    expect(findOf(`<div role="tablist"><button role="tab">A</button></div>`, "aria-required-children")).toHaveLength(0);
    expect(findOf(`<div role="list"><li>x</li></div>`, "aria-required-children")).toHaveLength(0);
  });
  it("non-conforming: tablist without any tab", () => {
    const f = findOf(`<div role="tablist"><span>A</span></div>`, "aria-required-children");
    expect(f).toHaveLength(1);
    expect(f[0]!.criteriaId).toBe("4.1.2");
  });
});

describe("aria-hidden-focusable (7.1)", () => {
  it("conforming: aria-hidden on non-focusable content", () => {
    expect(findOf(`<span aria-hidden="true">★</span>`, "aria-hidden-focusable")).toHaveLength(0);
  });
  it("non-conforming: aria-hidden wrapping a focusable link", () => {
    const f = findOf(`<div aria-hidden="true"><a href="/">Lien</a></div>`, "aria-hidden-focusable");
    expect(f).toHaveLength(1);
    expect(f[0]!.criteriaId).toBe("4.1.2");
  });
  it("conforming: an interactive element neutralised exactly as prescribed (tabindex=-1 / disabled)", () => {
    expect(findOf(`<button aria-hidden="true" tabindex="-1">x</button>`, "aria-hidden-focusable")).toHaveLength(0);
    expect(findOf(`<input aria-hidden="true" disabled>`, "aria-hidden-focusable")).toHaveLength(0);
  });
});

describe("live-region-conflict (7.5) — spec-permitted overrides", () => {
  it("conforming: overriding an 'off'-default role (timer/marquee) up to polite is a valid author choice", () => {
    expect(findOf(`<div role="timer" aria-live="polite">0:30</div>`, "live-region-conflict")).toHaveLength(0);
  });
  it("still non-conforming: an alert downgraded to polite degrades restitution", () => {
    const f = findOf(`<div role="alert" aria-live="polite">Erreur</div>`, "live-region-conflict");
    expect(f).toHaveLength(1);
    expect(f[0]!.criteriaId).toBe("4.1.3");
  });
});

describe("nested-interactive (7.1)", () => {
  it("conforming: sibling controls", () => {
    expect(findOf(`<div><a href="/">A</a><button>B</button></div>`, "nested-interactive")).toHaveLength(0);
  });
  it("non-conforming: a button inside a link", () => {
    const f = findOf(`<a href="/"><button>X</button></a>`, "nested-interactive");
    expect(f).toHaveLength(1);
    expect(f[0]!.criteriaId).toBe("4.1.2");
  });
});

describe("status-message-not-assertive (7.5) — error/success precision", () => {
  it("non-conforming: a polite ERROR alert with no role should be assertive", () => {
    const f = findOf(`<div class="fr-alert fr-alert--error" aria-live="polite"><p>Erreur</p></div>`, "status-message-not-assertive");
    expect(f).toHaveLength(1);
    expect(f[0]!.criteriaId).toBe("4.1.3");
  });
  it("conforming: a polite SUCCESS alert (polite is the correct pattern for a success status)", () => {
    expect(findOf(`<div class="fr-alert fr-alert--success" aria-live="polite"><p>Enregistré</p></div>`, "status-message-not-assertive")).toHaveLength(0);
  });
  it("conforming: a polite INFO alert and a bare fr-alert (no error signal)", () => {
    expect(findOf(`<div class="fr-alert fr-alert--info" aria-live="polite"><p>Info</p></div>`, "status-message-not-assertive")).toHaveLength(0);
    expect(findOf(`<div class="fr-alert" aria-live="polite"><p>x</p></div>`, "status-message-not-assertive")).toHaveLength(0);
  });
});
