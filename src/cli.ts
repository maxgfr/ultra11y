import { realpathSync, writeFileSync, mkdirSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { VERSION, type Lang, type AuditResult } from "./types.js";
import { runAudit } from "./audit.js";
import { writeReport } from "./report.js";
import { auditSummary } from "./output.js";
import { readStdin, readText } from "./util.js";

const HELP = `ultra11y v${VERSION}
Audit HTML/CSS/JSX for RGAA 4.1.2 + WCAG 2.1/2.2 AA accessibility and produce a
dated compliance report, or author/review accessible markup (native-HTML-first).
A deterministic zero-dependency static engine plus your judgment, with check/verify
gates against hallucinated non-conformities.

Usage:
  ultra11y audit    <globs… | -> [--out <dir>] [--include <glob>] [--exclude <glob>] [--jsx] [--json] [--lang fr|en]
  ultra11y report   --in <audit.json> [--out <dir>] [--lang fr|en]
  ultra11y criteria [<id>] [--theme <N>] [--list] [--json] [--lang fr|en]
  ultra11y check    --report <md> [--quiet] [--json]
  ultra11y verify   --report <md> [--semantic] [--apply <verdicts.json>] [--max-verify <n>] [--json]

Commands:
  audit      Run the static engine over the inputs (files/globs, or '-' for stdin)
             and emit an AuditResult JSON (consumed by 'report'). Without --json,
             prints a French summary. The engine decides the machine-detectable
             criteria; you supply the judgment + needs-rendering ones.
  report     Render an AuditResult into a dated RGAA compliance report
             (audits/rgaa-YYYY-MM-DD.md): metadata, per-theme synthesis table,
             non-conformities by priority, conforming + not-applicable lists.
  criteria   Look up the RGAA reference offline: one criterion, a whole theme,
             or the 13-theme list. Carries WCAG cross-refs + automatability class.
  check      Integrity gate on a produced report: every cited criterion resolves,
             every NA is justified, sections + conformance maths are well-formed.
  verify     Adversarial claim↔criterion worklist for the report's non-conformities,
             then (--apply) gate on refuted/unsupported findings.

Options:
  --out <dir>        audit/report: output dir for AuditResult + report  (default: audits)
  --in <file>        report: the AuditResult JSON to render ('-' for stdin)
  --include <glob>   audit: only include paths matching (comma-separated)
  --exclude <glob>   audit: skip paths matching (comma-separated)
  --jsx              audit: force best-effort JSX/TSX parsing
  --report <file>    check/verify: the report markdown to gate
  --theme <N>        criteria: list the criteria of theme N (1..13)
  --list             criteria: print the 13-theme table
  --apply <file>     verify: reduce a filled verdicts file to a pass/fail gate
  --max-verify <n>   verify: cap the worklist size                       (default: 40)
  --semantic         verify: fold the support-check into one pass
  --lang fr|en       output language                                     (default: fr)
  --json             machine-readable output
  --quiet            check: exit code only, no output
  -h, --help         show this help
  -v, --version      print version

Data: RGAA 4.1.2 © DINUM, Licence Ouverte / Etalab 2.0 (see NOTICE).`;

const COMMANDS = ["audit", "report", "criteria", "check", "verify"] as const;
type Command = (typeof COMMANDS)[number];

function isCommand(s: string | undefined): s is Command {
  return !!s && (COMMANDS as readonly string[]).includes(s);
}

const VALUE_FLAGS = new Set(["out", "in", "include", "exclude", "report", "theme", "apply", "max-verify", "lang"]);

export interface ParsedArgs {
  command: string;
  positionals: string[];
  flags: Record<string, string | boolean>;
}

export function parseArgs(argv: string[]): ParsedArgs {
  const [command, ...rest] = argv;
  const positionals: string[] = [];
  const flags: Record<string, string | boolean> = {};
  for (let i = 0; i < rest.length; i++) {
    const a = rest[i]!;
    if (a.startsWith("--")) {
      const key = a.slice(2);
      if (VALUE_FLAGS.has(key)) flags[key] = rest[++i] ?? "";
      else flags[key] = true;
    } else if (a.startsWith("-") && a !== "-") {
      flags[a.slice(1)] = true;
    } else {
      positionals.push(a);
    }
  }
  return { command: command ?? "", positionals, flags };
}

function langOf(flags: Record<string, string | boolean>): Lang {
  return flags["lang"] === "en" ? "en" : "fr";
}

function asList(v: string | boolean | undefined): string[] | undefined {
  return typeof v === "string" && v ? [v] : undefined;
}

async function cmdAudit(p: ParsedArgs): Promise<number> {
  const inputs = p.positionals.length ? p.positionals : ["."];
  if (inputs.length === 0) {
    console.error("ultra11y audit: provide files/globs, or '-' to read stdin.");
    return 2;
  }
  const stdin = inputs.includes("-") ? await readStdin() : undefined;
  const result = runAudit({
    inputs,
    stdin,
    forceJsx: p.flags["jsx"] === true,
    include: asList(p.flags["include"]),
    exclude: asList(p.flags["exclude"]),
  });

  const out = typeof p.flags["out"] === "string" ? (p.flags["out"] as string) : "audits";
  try {
    mkdirSync(out, { recursive: true });
    writeFileSync(join(out, "audit-latest.json"), JSON.stringify(result, null, 2) + "\n");
  } catch {
    /* non-fatal: still print the result */
  }

  if (p.flags["json"]) console.log(JSON.stringify(result, null, 2));
  else console.log(auditSummary(result, langOf(p.flags)));
  return 0;
}

async function cmdReport(p: ParsedArgs): Promise<number> {
  const inFlag = p.flags["in"];
  if (typeof inFlag !== "string" || !inFlag) {
    console.error("ultra11y report: --in <audit.json> is required ('-' for stdin).");
    return 2;
  }
  const raw = inFlag === "-" ? await readStdin() : readText(inFlag);
  let result: AuditResult;
  try {
    result = JSON.parse(raw) as AuditResult;
  } catch {
    console.error("ultra11y report: --in is not valid JSON (expected an AuditResult).");
    return 2;
  }
  if (result.tool !== "ultra11y" || !Array.isArray(result.criteria)) {
    console.error("ultra11y report: input is not an ultra11y AuditResult.");
    return 2;
  }
  const out = typeof p.flags["out"] === "string" ? (p.flags["out"] as string) : "audits";
  const path = writeReport(result, { out, lang: langOf(p.flags) });
  console.log(path);
  return 0;
}

export async function main(argv: string[]): Promise<number> {
  const first = argv[0];

  if (!first || first === "-h" || first === "--help") {
    console.log(HELP);
    return 0;
  }
  if (first === "-v" || first === "--version") {
    console.log(VERSION);
    return 0;
  }
  if (!isCommand(first)) {
    console.error(`ultra11y: unknown command "${first}". Run \`ultra11y --help\`.`);
    return 2;
  }

  const p = parseArgs(argv);
  switch (p.command as Command) {
    case "audit":
      return cmdAudit(p);
    case "report":
      return cmdReport(p);
    default:
      console.error(`ultra11y: "${p.command}" is not implemented yet`);
      return 1;
  }
}

// Only run when invoked directly (node scripts/ultra11y.mjs), not when imported
// by tests. Realpath both sides: Node canonicalizes import.meta.url but leaves
// process.argv[1] as-typed, so on a symlinked path (macOS /tmp → /private/tmp)
// a raw URL compare silently fails and main() never runs.
function isInvokedDirectly(): boolean {
  const argv1 = process.argv[1];
  if (argv1 === undefined) return false;
  const modulePath = fileURLToPath(import.meta.url);
  try {
    if (realpathSync(argv1) === realpathSync(modulePath)) return true;
  } catch {
    /* a path may be virtual — fall through */
  }
  return import.meta.url === pathToFileURL(argv1).href;
}

if (isInvokedDirectly()) {
  main(process.argv.slice(2)).then(
    (code) => process.exit(code),
    (err: unknown) => {
      console.error(err instanceof Error ? err.message : err);
      process.exit(1);
    },
  );
}
