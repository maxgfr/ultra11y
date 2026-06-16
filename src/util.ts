// Small shared utilities. Runtime-only Node APIs (Date, fs) are fine here — the
// "no Date" rule applies to workflow scripts, not the CLI bundle.
import { readFileSync } from "node:fs";
import { extname } from "node:path";

export function escapeRegExp(s: string): string {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

/** Today as YYYY-MM-DD (local-agnostic, ISO date). */
export function today(): string {
  return new Date().toISOString().slice(0, 10);
}

export function readText(path: string): string {
  return readFileSync(path, "utf8");
}

export function ext(path: string): string {
  return extname(path).toLowerCase();
}

export function uniq<T>(items: T[]): T[] {
  return [...new Set(items)];
}

/** Read all of stdin as text (for `audit -`). */
export async function readStdin(): Promise<string> {
  const chunks: Buffer[] = [];
  for await (const chunk of process.stdin) chunks.push(chunk as Buffer);
  return Buffer.concat(chunks).toString("utf8");
}
