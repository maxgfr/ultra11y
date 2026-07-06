// The committed src/data/standards/rgaa.json (+ rgaa.glossary.json) is GENERATED
// from the vendored DINUM source (scripts/vendor/rgaa/*.json) by
// scripts/build-pack-rgaa.mjs. Guard it against drift the same way
// criteria-md-sync.test.ts guards references/criteria.md: run the generator's
// `--check` mode (offline, vendored data only — no network) and assert it reports
// the committed pack as up to date.
import { describe, it, expect } from "vitest";
import { execFileSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");

describe("src/data/standards/rgaa*.json stays in sync with the vendored source", () => {
  it("`build-pack-rgaa.mjs --check` reports no drift and exits 0", () => {
    const out = execFileSync(process.execPath, [join(ROOT, "scripts/build-pack-rgaa.mjs"), "--check"], {
      encoding: "utf8",
      stdio: "pipe",
    });
    expect(out).toMatch(/match the vendored source/);
  });
});
