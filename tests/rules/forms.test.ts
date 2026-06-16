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
    expect(f[0]!.criteriaId).toBe("11.1");
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
