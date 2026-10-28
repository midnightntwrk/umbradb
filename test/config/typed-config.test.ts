import { mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import ts from "typescript";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { REPOSITORY } from "./config-fixtures.js";

/**
 * A27 `[STATIC]` and CF-2's scenario, on a configuration file as an operator writes one (task 4.1): the TypeScript
 * compiler, run with `noEmit` and the repository's compiler options, reports each fault at its line — a misspelled
 * `core` field (CF-2's own `databse`), a wrong field type (CF-3's `livenessTimeoutMs: "30000"`), and a module's `entry`
 * given another module's settings — and nothing else; the same file with the faults corrected compiles without a
 * diagnostic. `./builders.test.ts` holds the same cases as `@ts-expect-error` lines, checked by `npm run typecheck`.
 * (`umbradb config check`, task 4.4, runs the compiler this way.)
 */

/** The builders and the fixture modules, imported by absolute path (the compiler does not resolve a `file:` URL). */
const CONFIG = join(REPOSITORY, "src", "config", "index.js");
const FIXTURES = join(REPOSITORY, "test", "config", "config-fixtures.js");

/** The configuration's lines; each fault is on a line of its own, and `fixed` corrects them. */
function lines(fixed: boolean): string[] {
  return [
    `import { coreEntry, defineConfig } from ${JSON.stringify(CONFIG)};`,
    `import { prices, stats } from ${JSON.stringify(FIXTURES)};`,
    "",
    "export default defineConfig({",
    "  entries: [",
    "    coreEntry({",
    "      start: 0,",
    "      config: {",
    '        network: "preprod",',
    '        node: "ws://127.0.0.1:9944",',
    fixed ? '        database: { kind: "postgres", host: "db", user: "indexer", name: "umbradb" },' : '        databse: { kind: "postgres", host: "db", user: "indexer", name: "umbradb" },',
    "      },",
    "    }),",
    "    coreEntry({",
    "      start: 100,",
    "      config: {",
    '        network: "preprod",',
    '        node: "ws://127.0.0.1:9944",',
    '        database: { kind: "postgres", host: "db", user: "indexer", name: "umbradb" },',
    fixed ? "        livenessTimeoutMs: 30000," : '        livenessTimeoutMs: "30000",',
    "      },",
    "    }),",
    fixed
      ? '    prices.entry({ start: 10, config: { feedUrl: "https://feed.example" } }),'
      : '    stats.entry({ start: 10, config: { feedUrl: "https://feed.example" } }),',
    "  ],",
    "});",
    "",
  ];
}

/** A diagnostic of the configuration file: its 1-based line, its code and its message. */
interface Finding {
  readonly line: number;
  readonly code: number;
  readonly message: string;
}

let directory = "";

beforeAll(() => {
  directory = mkdtempSync(join(tmpdir(), "umbradb-a27-"));
  writeFileSync(join(directory, "package.json"), '{ "type": "module" }\n');
});

afterAll(() => {
  if (directory !== "") rmSync(directory, { recursive: true, force: true });
});

/** Type-checks `text` as `name` with the repository's compiler options and `noEmit`; returns its file's findings. */
function check(name: string, text: string): Finding[] {
  const file = join(directory, name);
  writeFileSync(file, text);
  const read = ts.readConfigFile(join(REPOSITORY, "tsconfig.json"), (path) => ts.sys.readFile(path));
  const { options } = ts.parseJsonConfigFileContent(read.config, ts.sys, REPOSITORY);
  const program = ts.createProgram([file], { ...options, noEmit: true });
  return ts
    .getPreEmitDiagnostics(program)
    .filter((diagnostic) => diagnostic.file?.fileName === file)
    .map((diagnostic) => ({
      line: (diagnostic.file as ts.SourceFile).getLineAndCharacterOfPosition(diagnostic.start ?? 0).line + 1,
      code: diagnostic.code,
      message: ts.flattenDiagnosticMessageText(diagnostic.messageText, "\n"),
    }));
}

describe("A27: the compiler reports each fault of a configuration file at its line (CF-2)", () => {
  it("a misspelled core field, a wrong field type and another module's settings, and nothing else", () => {
    const findings = check("umbradb.config.ts", lines(false).join("\n"));
    expect(findings.map(({ line, code }) => ({ line, code }))).toEqual([
      { line: 11, code: 2561 },
      { line: 20, code: 2322 },
      { line: 23, code: 2353 },
    ]);
    const [misspelled, wrongType, otherModule] = findings.map((finding) => finding.message);
    expect(misspelled).toContain("'databse' does not exist in type");
    expect(misspelled).toContain("Did you mean to write 'database'?");
    expect(wrongType).toContain("Type 'string' is not assignable to type 'number'");
    expect(otherModule).toContain("'feedUrl' does not exist in type");
  }, 60_000);

  it("control: the same file with the faults corrected compiles without a diagnostic", () => {
    expect(check("fixed.config.ts", lines(true).join("\n"))).toEqual([]);
  }, 60_000);
});
