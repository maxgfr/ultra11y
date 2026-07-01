import { describe, it, expect } from "vitest";
import { findOf } from "./helpers.js";

describe("control-label-missing (11.1)", () => {
  it("conforming: label[for], wrapping label, aria-label", () => {
    expect(findOf(`<label for="n">Nom</label><input id="n">`, "control-label-missing")).toHaveLength(0);
    expect(findOf(`<label>Nom <input></label>`, "control-label-missing")).toHaveLength(0);
    expect(findOf(`<input aria-label="Recherche">`, "control-label-missing")).toHaveLength(0);
  });
  it("non-conforming: unlabeled field (no placeholder)", () => {
    const f = findOf(`<input type="text">`, "control-label-missing");
    expect(f).toHaveLength(1);
    expect(f[0]!.criteriaId).toBe("4.1.2");
    expect(f[0]!.severity).toBe("bloquant");
  });
  it("does not double-report a placeholder-only field", () => {
    expect(findOf(`<input type="text" placeholder="Nom">`, "control-label-missing")).toHaveLength(0);
  });
});

describe("placeholder-as-label (11.1)", () => {
  it("conforming: placeholder alongside a real label", () => {
    expect(findOf(`<label for="n">Nom</label><input id="n" placeholder="ex: Marie">`, "placeholder-as-label")).toHaveLength(0);
  });
  it("non-conforming: placeholder used as the only label", () => {
    const f = findOf(`<input type="text" placeholder="Nom">`, "placeholder-as-label");
    expect(f).toHaveLength(1);
    expect(f[0]!.severity).toBe("majeur");
  });
});

describe("fieldset-legend-missing (11.6)", () => {
  it("conforming: fieldset with a legend", () => {
    expect(findOf(`<fieldset><legend>Civilité</legend><input></fieldset>`, "fieldset-legend-missing")).toHaveLength(0);
  });
  it("non-conforming: fieldset without legend", () => {
    const f = findOf(`<fieldset><input></fieldset>`, "fieldset-legend-missing");
    expect(f).toHaveLength(1);
    expect(f[0]!.criteriaId).toBe("1.3.1");
  });
});

describe("form-field-multiple-labels (11.1)", () => {
  it("conforming: a single label", () => {
    expect(findOf(`<label for="n">Nom</label><input id="n">`, "form-field-multiple-labels")).toHaveLength(0);
  });
  it("non-conforming: two labels for the same field", () => {
    const f = findOf(`<label for="n">A</label><label for="n">B</label><input id="n">`, "form-field-multiple-labels");
    expect(f).toHaveLength(1);
    expect(f[0]!.criteriaId).toBe("4.1.2");
  });
});

describe("select-has-option (11.1)", () => {
  it("conforming: select with options", () => {
    expect(findOf(`<select><option>a</option></select>`, "select-has-option")).toHaveLength(0);
  });
  it("non-conforming: empty select", () => {
    expect(findOf(`<select></select>`, "select-has-option")).toHaveLength(1);
  });
});

describe("error-not-associated — conditional aria-describedby (React pattern)", () => {
  it('conforming: aria-describedby={cond ? "id" : undefined} associates the error (no FP)', () => {
    const src = `<div><input aria-describedby={error ? "women-error" : undefined} aria-invalid={error ? true : undefined} /><p className="fr-error-text" id="women-error">Erreur</p></div>`;
    expect(findOf(src, "error-not-associated", "Step.tsx")).toHaveLength(0);
  });
  it("still flags a truly orphan error <p> whose id no field references", () => {
    const src = `<div><input aria-invalid={true} /><p className="fr-error-text" id="lonely-error">Erreur</p></div>`;
    const f = findOf(src, "error-not-associated", "Step.tsx");
    expect(f).toHaveLength(1);
    expect(f[0]!.criteriaId).toBe("3.3.1");
  });
});
