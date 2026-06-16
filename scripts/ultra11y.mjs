#!/usr/bin/env node

// src/cli.ts
import { realpathSync } from "fs";
import { fileURLToPath, pathToFileURL } from "url";

// src/types.ts
var VERSION = "0.0.0";

// src/cli.ts
var HELP = `ultra11y v${VERSION}
Audit HTML/CSS/JSX for RGAA 4.1.2 + WCAG 2.1/2.2 AA accessibility and produce a
dated compliance report, or author/review accessible markup (native-HTML-first).
A deterministic zero-dependency static engine plus your judgment, with check/verify
gates against hallucinated non-conformities.

Usage:
  ultra11y audit    <globs\u2026 | -> [--out <dir>] [--include <glob>] [--exclude <glob>] [--jsx] [--json] [--lang fr|en]
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
  verify     Adversarial claim\u2194criterion worklist for the report's non-conformities,
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

Data: RGAA 4.1.2 \xA9 DINUM, Licence Ouverte / Etalab 2.0 (see NOTICE).`;
var COMMANDS = ["audit", "report", "criteria", "check", "verify"];
function isCommand(s) {
  return !!s && COMMANDS.includes(s);
}
async function main(argv) {
  const [cmd, ...rest] = argv;
  if (!cmd || cmd === "-h" || cmd === "--help") {
    console.log(HELP);
    return 0;
  }
  if (cmd === "-v" || cmd === "--version") {
    console.log(VERSION);
    return 0;
  }
  if (!isCommand(cmd)) {
    console.error(`ultra11y: unknown command "${cmd}". Run \`ultra11y --help\`.`);
    return 2;
  }
  switch (cmd) {
    // Commands are wired in as each milestone lands (M3 audit, M4 report,
    // M5 criteria, M6 check/verify). Until then they report not-implemented.
    default:
      console.error(`ultra11y: "${cmd}" is not implemented yet`);
      void rest;
      return 1;
  }
}
function isInvokedDirectly() {
  const argv1 = process.argv[1];
  if (argv1 === void 0) return false;
  const modulePath = fileURLToPath(import.meta.url);
  try {
    if (realpathSync(argv1) === realpathSync(modulePath)) return true;
  } catch {
  }
  return import.meta.url === pathToFileURL(argv1).href;
}
if (isInvokedDirectly()) {
  main(process.argv.slice(2)).then(
    (code) => process.exit(code),
    (err) => {
      console.error(err instanceof Error ? err.message : err);
      process.exit(1);
    }
  );
}
export {
  main
};
