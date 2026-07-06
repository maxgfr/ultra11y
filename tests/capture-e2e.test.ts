// REAL end-to-end test of the zero-touch capture harvester (`render --setup` /
// captureSetup() in src/render.ts): generates the harvester exactly as `render
// --setup` would, spawns a genuinely separate `vitest run` (a standalone mini
// project under tests/fixtures/capture-e2e/ — excluded from the repo's own outer
// test run by vitest.config.ts's `exclude: tests/fixtures/**`) whose single test
// does a pure-DOM write (no React/framework), and asserts a provenance-tagged
// capture lands on disk and that the repo's own capture.ts/parse.ts ingest it.
// This is the ONE test in the suite that shells out to a nested vitest process —
// generous timeout, no network/ports involved, so it should be stable in CI.
import { describe, it, expect, afterAll } from "vitest";
import { execFileSync } from "node:child_process";
import { existsSync, mkdirSync, writeFileSync, rmSync, readdirSync, readFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { captureSetup } from "../src/render.js";
import { parseCaptureProvenance, readCaptureDir } from "../src/capture.js";
import { parseSource } from "../src/parse/source.js";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const FIXTURE = join(ROOT, "tests/fixtures/capture-e2e");
const ULTRA_DIR = join(FIXTURE, ".ultra11y");
const SETUP_PATH = join(ULTRA_DIR, "capture-setup.mjs");
const CAPTURES_DIR = join(ULTRA_DIR, "captures");
const VITEST_BIN = join(ROOT, "node_modules/vitest/vitest.mjs");

function cleanup(): void {
  rmSync(ULTRA_DIR, { recursive: true, force: true });
  // Vite/Vitest drops its own dep-cache (node_modules/.vite) at --root — gitignored
  // (node_modules/ matches at any depth) but tidy it up so repeated runs stay clean.
  rmSync(join(FIXTURE, "node_modules"), { recursive: true, force: true });
}

describe("capture harvester — real E2E (spawns a standalone vitest run)", () => {
  afterAll(cleanup);

  it("writes a provenance-tagged capture .html that capture.ts/parseSource ingest", () => {
    cleanup();
    mkdirSync(ULTRA_DIR, { recursive: true });
    // Byte-for-byte what `render --setup` would write — never hand-authored here.
    writeFileSync(SETUP_PATH, captureSetup());

    const env = { ...process.env };
    delete env.ULTRA11Y_CAPTURES; // never let an ambient override disable the harvester

    try {
      execFileSync(process.execPath, [VITEST_BIN, "run", "--config", join(FIXTURE, "vitest.config.mjs"), "--root", FIXTURE], {
        cwd: FIXTURE,
        env,
        timeout: 55_000,
        stdio: "pipe",
      });
    } catch (e) {
      const err = e as { stdout?: Buffer; stderr?: Buffer; message: string };
      throw new Error(`nested vitest run failed: ${err.message}\n--- stdout ---\n${err.stdout}\n--- stderr ---\n${err.stderr}`);
    }

    expect(existsSync(CAPTURES_DIR)).toBe(true);
    const files = readdirSync(CAPTURES_DIR).filter((f) => f.endsWith(".html"));
    expect(files.length).toBeGreaterThan(0);

    const capturePath = join(CAPTURES_DIR, files[0]!);
    const raw = readFileSync(capturePath, "utf8");

    // The harvester derives source/component from the test's own path: Widget.test.js
    // → source "Widget.js", component "Widget" (see captureSetup()'s generated `esc`/
    // `source`/`component` derivation).
    const prov = parseCaptureProvenance(raw);
    expect(prov?.sourceFile).toBe("Widget.js");
    expect(prov?.component).toBe("Widget");
    expect(prov?.test).toBe("Widget.test.js");
    expect(raw).toContain("Save"); // the actual rendered markup was serialized

    // The repo's OWN ingestion path sees it too: readCaptureDir (repo-wide capture
    // scan) and parseSource (per-file `doc.capture` attribution).
    const entries = readCaptureDir(CAPTURES_DIR);
    expect(entries.some((e) => e.provenance?.component === "Widget")).toBe(true);
    const doc = parseSource(raw, capturePath);
    expect(doc.capture?.component).toBe("Widget");

    cleanup();
  }, 60_000);
});
