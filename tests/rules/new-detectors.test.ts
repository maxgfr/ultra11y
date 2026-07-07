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
  it("does not flag a refresh longer than 20 hours (WCAG 2.2.1 exception)", () => {
    expect(findOf(`<meta http-equiv="refresh" content="86400">`, "meta-refresh-redirect")).toHaveLength(0); // 24h > 20h
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

describe("live-region-conflict (4.1.3)", () => {
  it("flags an invalid aria-live value", () => {
    const f = findOf(`<div aria-live="urgent">Erreur</div>`, "live-region-conflict");
    expect(f).toHaveLength(1);
    expect(f[0]!.criteriaId).toBe("4.1.3");
  });
  it("flags role=alert contradicted by aria-live=polite (majeur)", () => {
    const f = findOf(`<div role="alert" aria-live="polite">Erreur</div>`, "live-region-conflict");
    expect(f).toHaveLength(1);
    expect(f[0]!.severity).toBe("majeur");
  });
  it("flags role=status contradicted by aria-live=assertive (mineur)", () => {
    const f = findOf(`<p role="status" aria-live="assertive">3 résultats</p>`, "live-region-conflict");
    expect(f).toHaveLength(1);
    expect(f[0]!.severity).toBe("mineur");
  });
  it("does not flag consistent or plain live regions", () => {
    expect(findOf(`<div role="alert">Erreur</div>`, "live-region-conflict")).toHaveLength(0);
    expect(findOf(`<div aria-live="polite">Sauvegardé</div>`, "live-region-conflict")).toHaveLength(0);
    expect(findOf(`<div role="status" aria-live="polite">ok</div>`, "live-region-conflict")).toHaveLength(0);
  });
  it("does not flag a dynamic aria-live value or a component prop (JSX)", () => {
    expect(findOf(`<div aria-live={mode}>x</div>`, "live-region-conflict", "t.tsx")).toHaveLength(0);
    expect(findOf(`<Toast aria-live="urgent">x</Toast>`, "live-region-conflict", "t.tsx")).toHaveLength(0);
  });
});

describe("aria-invalid-no-description (3.3.1)", () => {
  it("flags aria-invalid=true without a linked description", () => {
    const f = findOf(`<input type="email" aria-invalid="true">`, "aria-invalid-no-description");
    expect(f).toHaveLength(1);
    expect(f[0]!.criteriaId).toBe("3.3.1");
  });
  it("does not flag when aria-describedby or aria-errormessage links the error", () => {
    expect(findOf(`<input aria-invalid="true" aria-describedby="e">`, "aria-invalid-no-description")).toHaveLength(0);
    expect(findOf(`<input aria-invalid="true" aria-errormessage="e">`, "aria-invalid-no-description")).toHaveLength(0);
  });
  it("does not flag aria-invalid=false / absent, or a dynamic value (JSX)", () => {
    expect(findOf(`<input aria-invalid="false">`, "aria-invalid-no-description")).toHaveLength(0);
    expect(findOf(`<input type="text">`, "aria-invalid-no-description")).toHaveLength(0);
    expect(findOf(`<input aria-invalid={hasError} />`, "aria-invalid-no-description", "t.tsx")).toHaveLength(0);
  });
});

describe("missing-main-landmark (1.3.1)", () => {
  it("flags a full page with body content but no <main>", () => {
    const f = findOf(page(`<header>h</header><div>contenu</div><footer>f</footer>`), "missing-main-landmark");
    expect(f).toHaveLength(1);
    expect(f[0]!.criteriaId).toBe("1.3.1");
  });
  it("does not flag when a <main> or role=main is present", () => {
    expect(findOf(page(`<main>contenu</main>`), "missing-main-landmark")).toHaveLength(0);
    expect(findOf(page(`<div role="main">contenu</div>`), "missing-main-landmark")).toHaveLength(0);
  });
  it("does not run on a fragment/component (page-scoped)", () => {
    expect(findOf(`<div>contenu</div>`, "missing-main-landmark")).toHaveLength(0);
  });
});

describe("multiple-main-landmark (1.3.1)", () => {
  it("flags more than one main landmark", () => {
    const f = findOf(page(`<main>a</main><main>b</main>`), "multiple-main-landmark");
    expect(f).toHaveLength(1);
  });
  it("does not flag a single main", () => {
    expect(findOf(page(`<main>a</main>`), "multiple-main-landmark")).toHaveLength(0);
  });
});

describe("control-name-title-only (4.1.2)", () => {
  it("flags a button/link named only by title", () => {
    expect(findOf(`<button title="Fermer"><svg aria-hidden="true"></svg></button>`, "control-name-title-only")).toHaveLength(1);
    expect(findOf(`<a href="/x" title="Aide"></a>`, "control-name-title-only")[0]!.criteriaId).toBe("4.1.2");
  });
  it("does not flag when visible text, aria-label, or an alt image names the control", () => {
    expect(findOf(`<button title="Fermer">Fermer</button>`, "control-name-title-only")).toHaveLength(0);
    expect(findOf(`<a href="/x" title="Aide" aria-label="Aide">i</a>`, "control-name-title-only")).toHaveLength(0);
    expect(findOf(`<a href="/x" title="Profil"><img src="a.png" alt="Profil"></a>`, "control-name-title-only")).toHaveLength(0);
  });
  it("does not flag a control without title", () => {
    expect(findOf(`<button>Fermer</button>`, "control-name-title-only")).toHaveLength(0);
  });
});

describe("object-embed-no-name (1.1.1)", () => {
  it("flags <object>/<embed> with no name or fallback", () => {
    expect(findOf(`<object data="a.pdf"></object>`, "object-embed-no-name")).toHaveLength(1);
    expect(findOf(`<embed src="a.svg">`, "object-embed-no-name")[0]!.criteriaId).toBe("1.1.1");
  });
  it("does not flag when named or with fallback content or aria-hidden", () => {
    expect(findOf(`<object data="a.pdf" title="Rapport annuel"></object>`, "object-embed-no-name")).toHaveLength(0);
    expect(findOf(`<object data="a.pdf">Rapport annuel (PDF)</object>`, "object-embed-no-name")).toHaveLength(0);
    expect(findOf(`<embed src="a.svg" aria-hidden="true">`, "object-embed-no-name")).toHaveLength(0);
  });
});

describe("status-message-not-assertive (4.1.3)", () => {
  it("flags an error container with aria-live=polite and no role", () => {
    const f = findOf(`<div class="fr-alert fr-alert--error" aria-live="polite">Erreur serveur</div>`, "status-message-not-assertive");
    expect(f).toHaveLength(1);
    expect(f[0]!.criteriaId).toBe("4.1.3");
  });
  it("does not flag a polite container that is not an error/alert", () => {
    expect(findOf(`<div class="results" aria-live="polite">3 résultats</div>`, "status-message-not-assertive")).toHaveLength(0);
  });
  it("does not overlap live-region-conflict (a role is present) or a dynamic value", () => {
    expect(findOf(`<div role="status" class="fr-error" aria-live="polite">x</div>`, "status-message-not-assertive")).toHaveLength(0);
    expect(findOf(`<div className="fr-error" aria-live={mode}>x</div>`, "status-message-not-assertive", "t.tsx")).toHaveLength(0);
  });
});

describe("error-not-associated (3.3.1)", () => {
  it("flags an error-text node with an id referenced by no field", () => {
    const f = findOf(`<input type="text"><p class="fr-error-text" id="email-error">Email invalide</p>`, "error-not-associated");
    expect(f).toHaveLength(1);
    expect(f[0]!.criteriaId).toBe("3.3.1");
  });
  it("does not flag when a field references the error via aria-describedby", () => {
    expect(findOf(`<input aria-describedby="email-error"><p class="fr-error-text" id="email-error">x</p>`, "error-not-associated")).toHaveLength(0);
  });
  it("does not flag an error node without an id (not provable)", () => {
    expect(findOf(`<p class="fr-error-text">Email invalide</p>`, "error-not-associated")).toHaveLength(0);
  });
});

describe("field-purpose-incomplete (1.3.5 / 4.1.2)", () => {
  it("flags an email/tel input without autocomplete (1.3.5)", () => {
    const f = findOf(`<input type="email">`, "field-purpose-incomplete");
    expect(f).toHaveLength(1);
    expect(f[0]!.criteriaId).toBe("1.3.5");
  });
  it("flags a purpose-named text input without autocomplete", () => {
    expect(findOf(`<input type="text" name="postal-code">`, "field-purpose-incomplete")).toHaveLength(1);
  });
  it("does not flag when autocomplete is present, a search field, or a generic text field", () => {
    expect(findOf(`<input type="email" autocomplete="email">`, "field-purpose-incomplete")).toHaveLength(0);
    expect(findOf(`<input type="search">`, "field-purpose-incomplete")).toHaveLength(0);
    expect(findOf(`<input type="text" name="comment">`, "field-purpose-incomplete")).toHaveLength(0);
  });
  it("flags a custom required widget without aria-required (4.1.2)", () => {
    const f = findOf(`<div role="checkbox" class="field required"></div>`, "field-purpose-incomplete");
    expect(f).toHaveLength(1);
    expect(f[0]!.criteriaId).toBe("4.1.2");
  });
});

describe("sortable-header-no-aria-sort (1.3.1)", () => {
  it("flags a sortable th with a sort control but no aria-sort", () => {
    const f = findOf(`<table><tr><th><button class="sort">Nom</button></th></tr></table>`, "sortable-header-no-aria-sort");
    expect(f).toHaveLength(1);
    expect(f[0]!.criteriaId).toBe("1.3.1");
  });
  it("does not flag when aria-sort is present, or a plain th with no sort control", () => {
    expect(findOf(`<table><tr><th aria-sort="none"><button class="sort">Nom</button></th></tr></table>`, "sortable-header-no-aria-sort")).toHaveLength(0);
    expect(findOf(`<table><tr><th scope="col">Nom</th></tr></table>`, "sortable-header-no-aria-sort")).toHaveLength(0);
  });
});

describe("chart-no-accessible-name (1.1.1)", () => {
  it("flags a charting container with no accessible name", () => {
    const f = findOf(`<div class="recharts-wrapper"><svg class="recharts-surface"></svg></div>`, "chart-no-accessible-name");
    expect(f).toHaveLength(1);
    expect(f[0]!.criteriaId).toBe("1.1.1");
  });
  it("does not flag when wrapped in role=img with a label, or an aria-label is present", () => {
    expect(findOf(`<div role="img" aria-label="Courbe"><div class="recharts-wrapper"></div></div>`, "chart-no-accessible-name")).toHaveLength(0);
    expect(findOf(`<div class="echarts" aria-label="Répartition"></div>`, "chart-no-accessible-name")).toHaveLength(0);
  });
});
