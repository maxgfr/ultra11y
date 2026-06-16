import { describe, it, expect } from "vitest";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { RUNNER, DOCKERFILE, PKG } from "../src/scan.js";

// The dynamic-tier runner/Dockerfile are embedded in scan.ts (so the skill ships
// as one bundle) AND mirrored under docker/ for transparency + docker-compose.
// Keep them byte-identical (trailing whitespace aside).
const DOCKER = join(dirname(fileURLToPath(import.meta.url)), "..", "docker");
const read = (f: string): string => readFileSync(join(DOCKER, f), "utf8");

describe("embedded dynamic-tier files match docker/", () => {
  it("runner.mjs", () => {
    expect(read("runner.mjs").trimEnd()).toBe(RUNNER.trimEnd());
  });
  it("Dockerfile", () => {
    expect(read("Dockerfile").trimEnd()).toBe(DOCKERFILE.trimEnd());
  });
  it("package.json", () => {
    expect(read("package.json").trimEnd()).toBe(PKG.trimEnd());
  });
});
