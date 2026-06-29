import { describe, it, expect } from "vitest";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { renderCriteriaReference } from "../src/criteria.js";

// The committed references/criteria.md is GENERATED from the WCAG dataset
// (`ultra11y criteria --generate`, wired to `pnpm run build:criteria`). Guard it against
// drift: the committed file must equal the generator's current output.
const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const committed = readFileSync(join(ROOT, "skills/ultra11y/references/criteria.md"), "utf8");

describe("references/criteria.md stays in sync with the generator", () => {
  it("equals renderCriteriaReference() output", () => {
    expect(committed.trimEnd()).toBe(renderCriteriaReference().trimEnd());
  });
});
