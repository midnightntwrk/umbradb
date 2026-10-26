import { existsSync, mkdirSync, mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { createServer, type Server } from "node:net";
import { dirname, join } from "node:path";
import { z } from "zod";
import { afterAll, afterEach, beforeAll, describe, expect, it, vi } from "vitest";
import { CHECK_STEPS, type CheckStep, configCheck, type ConfigCheckReport, HISTORY_NOT_RUN } from "../../src/cli/config-check.js";
import { buildDeclarations } from "../../src/cli/build-modules.js";
import { inferSide } from "../../src/cli/config-check.js";
import { EXIT } from "../../src/cli/command.js";
import { buildCoreVersion } from "../../src/config/build.js";
import { defineModule } from "../../src/modules/declaration.js";
import { validateDeclarations } from "../../src/modules/validation.js";
import { type CliProject, cliProject, configText, coreSettings, inProcess, lineOf, treeOf } from "./cli-fixtures.js";

/**
 * A35 `[CI]` without `--database` (CF-10), through `configCheck` and `runCommand` in this process: `umbradb config check
 * <file>` type-checks the file with the TypeScript compiler (`noEmit`), evaluates it (CF-1) and validates it (CF-3), and
 * prints every finding of every check with its path — a type error at `file:line:column`, a schema error at its path in
 * the configuration —, exits 0 only if every check it ran passed, opens no database and says the history checks were
 * not run. `./config-check-database.test.ts` has the `--database` half, `./umbradb.test.ts` the command in a child
 * process (Node.js's own type stripping, real exit codes).
 */

// Each test runs the TypeScript compiler on a file (about a second alone) and many open a database or start a process;
// in the full parallel run some exceeded Vitest's 5 s default (the conformance run of 2026-10-25), so they get 60 s.
vi.setConfig({ testTimeout: 60_000 });

let project: CliProject;
let listener: Server;
let connections = 0;
/** A PostgreSQL URL no server answers: a TCP listener that counts the connections made to it. */
let unanswered = "";

beforeAll(async () => {
  project = await cliProject();
  listener = createServer((socket) => {
    connections++;
    socket.destroy();
  });
  await new Promise<void>((resolve) => listener.listen(0, "127.0.0.1", resolve));
  const { port } = listener.address() as { port: number };
  unanswered = `postgres://checker:pw-4-4-CONFIG@127.0.0.1:${port}/indexer`;
}, 120_000);

afterAll(async () => {
  await new Promise<void>((resolve) => listener?.close(() => resolve()));
  project?.remove();
});

afterEach(() => {
  expect(connections, "config check without --database connects to no database").toBe(0);
});

/** A configuration with one `core` entry from 0 whose settings are `settings` (JSON or a TypeScript expression). */
function coreOnly(settings: string, before: readonly string[] = []): string {
  return configText(project.builders, [
    ...before,
    "export default defineConfig({",
    "  entries: [",
    `    coreEntry({ start: 0, config: ${settings} }),`,
    "  ],",
    "});",
  ]);
}

/** A35's "prints both with their paths": the type error at `file:line:column`, the schema error at its path. */
function printsBoth(text: string, file: string, typeLine: number): boolean {
  return (
    text.includes(`  ${file}:${typeLine}:7: Type 'string' is not assignable to type 'number'. [TS2322]`) &&
    /^ {2}entries\[0\]\.config\.apiReadTimeoutMs \(core from 0\): Too small: expected number to be >=1 \(CF-3\) \[invalid-configuration settings-schema\]$/m.test(
      text,
    )
  );
}

/** Runs `umbradb config check <file>` in this process. */
const check = (file: string, extra: readonly string[] = []) => inProcess(["config", "check", file, ...extra], project.dir);

/** The findings of `step` in `report`, as `code path` lines. */
const codesOf = (report: ConfigCheckReport, step: string) =>
  (report.steps.find((s) => s.name === step)?.findings ?? []).map((f) => `${f.code} ${f.path}`);

describe("A35: a valid file", () => {
  it("exits 0, every check passed, and says the history checks were not run, opening no database", async () => {
    const file = project.write("valid.config.ts", coreOnly(coreSettings(unanswered)));
    const result = await check(file);
    expect(result.stderr).toBe("");
    expect(result.code).toBe(EXIT.ok);
    expect(result.stdout).toContain(`umbradb config check ${file}`);
    expect(result.stdout).toMatch(/^type check \(TypeScript 5\.9\.\d+, noEmit\): passed$/m);
    expect(result.stdout).toMatch(/^configuration \(CF-1, CF-3\): passed$/m);
    expect(result.stdout).toContain(HISTORY_NOT_RUN);
    expect(HISTORY_NOT_RUN).toBe(
      "history (CF-3 for versionEntry revisions, CF-5, CF-6, CF-8): not run — no --database given, so no database was " +
        "opened and the history checks were not run",
    );
    expect(result.stdout).toMatch(/^passed: every check that ran passed; the history checks were not run$/m);
    const report = await configCheck({ file, cwd: project.dir });
    expect(report.passed).toBe(true);
    expect(report.steps.map((s) => [s.name, s.status])).toEqual([
      ["type check", "passed"],
      ["configuration", "passed"],
      ["history", "not run"],
    ]);
    expect(report.text).toBe(result.stdout);
  });

  it("a relative file is read from the working directory", async () => {
    project.write("relative.config.ts", coreOnly(coreSettings(unanswered)));
    const result = await check("relative.config.ts");
    expect(result.code).toBe(EXIT.ok);
    expect(result.stdout).toContain(`umbradb config check ${join(project.dir, "relative.config.ts")}`);
  });
});

describe("A35: one type error and one schema error", () => {
  it("prints both with their paths and exits non-zero, opening no database, the history checks not run", async () => {
    const text = coreOnly(coreSettings(unanswered, { apiReadTimeoutMs: 0 }), ['const label: number = "core";', "void label;"]);
    const file = project.write("two-errors.config.ts", text);
    const result = await check(file);
    expect(result.code).toBe(EXIT.failed);
    const typeLine = lineOf(text, "const label");
    expect(printsBoth(result.stdout, file, typeLine)).toBe(true);
    expect(result.stdout).toMatch(/^type check \(TypeScript 5\.9\.\d+, noEmit\): 1 finding$/m);
    expect(result.stdout).toMatch(/^configuration \(CF-1, CF-3\): 1 finding$/m);
    expect(result.stdout).toContain(HISTORY_NOT_RUN);
    expect(result.stdout).toMatch(/^failed: 2 findings$/m);
    const report = await configCheck({ file, cwd: project.dir });
    expect(codesOf(report, "type check")).toEqual([`TS2322 ${file}:${typeLine}:7`]);
    expect(codesOf(report, "configuration")).toEqual([
      "invalid-configuration settings-schema entries[0].config.apiReadTimeoutMs",
    ]);
  });

  it("CF-10's scenario — one unknown property and one wrong type — is found by both checks, each finding with its path", async () => {
    const text = configText(project.builders, [
      "export default defineConfig({",
      "  entries: [",
      "    coreEntry({",
      "      start: 0,",
      "      config: {",
      '        network: "preprod",',
      '        node: "ws://127.0.0.1:9944",',
      `        database: ${JSON.stringify(unanswered)},`,
      "        retainState: 1,",
      "      },",
      "    }),",
      "    coreEntry({",
      "      start: 100,",
      "      config: {",
      '        network: "preprod",',
      '        node: "ws://127.0.0.1:9944",',
      `        database: ${JSON.stringify(unanswered)},`,
      '        livenessTimeoutMs: "30000",',
      "      },",
      "    }),",
      "  ],",
      "});",
    ]);
    const file = project.write("cf10.config.ts", text);
    const report = await configCheck({ file, cwd: project.dir });
    expect(report.passed).toBe(false);
    expect(codesOf(report, "type check")).toEqual([
      `TS2561 ${file}:${lineOf(text, "retainState: 1")}:9`,
      `TS2322 ${file}:${lineOf(text, "livenessTimeoutMs")}:9`,
    ]);
    expect(codesOf(report, "configuration")).toEqual([
      "invalid-configuration settings-unknown entries[0].config.retainState",
      "invalid-configuration settings-schema entries[1].config.livenessTimeoutMs",
    ]);
    expect(report.text).toContain("Did you mean to write 'retainStates'?");
    expect(report.text).toContain("(did you mean retainStates?)");
    expect(report.text).toMatch(/^failed: 4 findings$/m);
  });
});

describe("CF-1's refusals are configuration findings", () => {
  it("no file: one finding, nothing else run", async () => {
    const file = join(project.dir, "missing.config.ts");
    const report = await configCheck({ file, cwd: project.dir });
    expect(report.steps.map((s) => [s.name, s.status])).toEqual([
      ["type check", "not run"],
      ["configuration", "failed"],
      ["history", "not run"],
    ]);
    expect(codesOf(report, "configuration")).toEqual([`invalid-configuration file-not-found ${file}`]);
    expect(report.text).toMatch(/^type check \(TypeScript\): not run — no configuration file at the path$/m);
    expect(report.text).toContain(`no configuration file at ${file}`);
  });

  it("a directory is no file", async () => {
    mkdirSync(join(project.dir, "a-directory.config.ts"), { recursive: true });
    const report = await configCheck({ file: "a-directory.config.ts", cwd: project.dir });
    expect(report.steps[0]?.status).toBe("not run");
    expect(codesOf(report, "configuration")).toEqual([
      `invalid-configuration file-not-found ${join(project.dir, "a-directory.config.ts")}`,
    ]);
  });

  it("a syntax error: the compiler's finding and the loader's", async () => {
    const text = configText(project.builders, ["export default defineConfig({ entries: [ }"]);
    const file = project.write("syntax.config.ts", text);
    const report = await configCheck({ file, cwd: project.dir });
    expect(codesOf(report, "type check").length).toBeGreaterThan(0);
    expect(codesOf(report, "type check")[0]).toMatch(new RegExp(`^TS\\d+ ${file}:${lineOf(text, "export default")}:\\d+$`));
    expect(codesOf(report, "configuration")).toEqual([`invalid-configuration load-failed ${file}`]);
  });

  it("no default export", async () => {
    const file = project.write("no-default.config.ts", configText(project.builders, ["export const entries = [];"]));
    const report = await configCheck({ file, cwd: project.dir });
    expect(codesOf(report, "type check")).toEqual([]);
    expect(codesOf(report, "configuration")).toEqual([`invalid-configuration no-default-export ${file}`]);
  });

  it("a value that is not plain data, at its path", async () => {
    const text = configText(project.builders, [
      "export default defineConfig({",
      "  entries: [",
      `    coreEntry({ start: 0, config: ${coreSettings(unanswered)} }),`,
      '    versionEntry({ id: "stats", start: 1, version: "1.0.0", config: { onError: (() => 0) as never } }),',
      "  ],",
      "});",
    ]);
    const file = project.write("function.config.ts", text);
    const report = await configCheck({ file, cwd: project.dir });
    expect(codesOf(report, "configuration")).toEqual(["not-plain-data entries[1].config.onError"]);
    expect(report.text).toMatch(/^ {2}entries\[1\]\.config\.onError: .*a function.* \[not-plain-data\]$/m);
  });

  it("an enum is refused by the type check (erasable TypeScript only), as Node.js refuses it", async () => {
    const text = coreOnly(coreSettings(unanswered), ['enum Network { Preprod = "preprod" }', "void Network.Preprod;"]);
    const file = project.write("enum.config.ts", text);
    const report = await configCheck({ file, cwd: project.dir });
    expect(codesOf(report, "type check")).toEqual([`TS1294 ${file}:${lineOf(text, "enum Network")}:6`]);
  });

  it("an error the file throws is a load-failed finding with the error's message", async () => {
    const file = project.write(
      "throws.config.ts",
      configText(project.builders, ['throw new Error("the operator\'s own failure");', "export default {};"]),
    );
    const report = await configCheck({ file, cwd: project.dir });
    expect(codesOf(report, "configuration")).toEqual([`invalid-configuration load-failed ${file}`]);
    expect(report.text).toContain("the operator's own failure");
  });

  it("every core entry another version's: the process has no core revision of its own (Q102), a finding", async () => {
    const text = configText(project.builders, [
      "export default defineConfig({",
      "  entries: [",
      `    versionEntry({ id: "core", start: 0, version: { umbradb: "0.9.4", ledgers: [] }, config: ${coreSettings(unanswered)} }),`,
      "  ],",
      "});",
    ]);
    const file = project.write("no-own-core.config.ts", text);
    const report = await configCheck({ file, cwd: project.dir });
    expect(codesOf(report, "configuration")).toEqual([`invalid-configuration no-build-core-revision ${file}`]);
  });
});

describe("the type check reads the file as Node.js loads it", () => {
  it("a .ts file whose package.json has no type field is an ES module (Node.js's syntax detection), not CommonJS", async () => {
    project.write("plain-package/package.json", "{}\n");
    const file = project.write("plain-package/umbradb.config.ts", coreOnly(coreSettings(unanswered)));
    const report = await configCheck({ file, cwd: project.dir });
    expect(codesOf(report, "type check")).toEqual([]);
    expect(report.passed).toBe(true);
  });

  it('a .ts file under "type": "commonjs" is CommonJS, where import and export are refused', async () => {
    project.write("cjs-package/package.json", '{ "type": "commonjs" }\n');
    const file = project.write("cjs-package/umbradb.config.ts", coreOnly(coreSettings(unanswered)));
    const report = await configCheck({ file, cwd: project.dir });
    // At each name the import brings in (column 10 is defineConfig's, the first) and at the export.
    expect(codesOf(report, "type check")[0]).toBe(`TS1295 ${file}:1:10`);
    expect(codesOf(report, "type check").every((code) => code.startsWith("TS1295 "))).toBe(true);
  });

  it("a .mts file is an ES module whatever its package.json says", async () => {
    const file = project.write("cjs-package/umbradb.config.mts", coreOnly(coreSettings(unanswered)));
    const report = await configCheck({ file, cwd: project.dir });
    expect(codesOf(report, "type check")).toEqual([]);
  });

  it("a local file the configuration imports is checked too, a local declaration file's syntax included", async () => {
    project.write("helpers/values.ts", 'export const timeout: number = "slow";\n');
    project.write("helpers/typed.js", "export const limit = 5;\n");
    project.write("helpers/typed.d.ts", "export declare const limit: ;\n");
    const text = coreOnly(coreSettings(unanswered), [
      'import { timeout } from "./helpers/values.ts";',
      'import { limit } from "./helpers/typed.js";',
      "void timeout;",
      "void limit;",
    ]);
    const file = project.write("imports-helper.config.ts", text);
    const report = await configCheck({ file, cwd: project.dir });
    expect(codesOf(report, "type check")).toEqual([
      `TS1110 ${join(project.dir, "helpers", "typed.d.ts")}:1:29`,
      `TS2322 ${join(project.dir, "helpers", "values.ts")}:1:14`,
    ]);
  });
});

describe("the type check's options, as the process loads the file", () => {
  it("strict: an implicitly any parameter is a finding", async () => {
    const text = coreOnly(coreSettings(unanswered), ["function twice(value) { return value * 2; }", "void twice;"]);
    const file = project.write("implicit-any.config.ts", text);
    const report = await configCheck({ file, cwd: project.dir });
    expect(codesOf(report, "type check")).toEqual([`TS7006 ${file}:${lineOf(text, "function twice")}:16`]);
  });

  it("the language and its library are a recent ECMAScript's (Node.js 24's): Array.prototype.at, Object.hasOwn", async () => {
    const text = coreOnly(coreSettings(unanswered), ['const last: string | undefined = ["a"].at(-1);', "void Object.hasOwn({}, 'a');", "void last;"]);
    const file = project.write("recent-library.config.ts", text);
    const report = await configCheck({ file, cwd: project.dir });
    expect(codesOf(report, "type check")).toEqual([]);
  });

  it("a local declaration file's types are not checked (skipLibCheck), only its syntax", async () => {
    project.write("helpers/loose.js", "export const value = 1;\n");
    project.write("helpers/loose.d.ts", "export declare const value: NoSuchType;\n");
    const text = coreOnly(coreSettings(unanswered), ['import { value } from "./helpers/loose.js";', "void value;"]);
    const file = project.write("loose-types.config.ts", text);
    const report = await configCheck({ file, cwd: project.dir });
    expect(codesOf(report, "type check")).toEqual([]);
  });

  it("a declaration file and a .cts file keep the compiler's reading of their format, under no type field", async () => {
    // A CommonJS module's declaration file: export = is no finding where the compiler reads it as CommonJS.
    project.write("plain-package/legacy.js", "module.exports = { limit: 5 };\n");
    project.write("plain-package/legacy.d.ts", "declare const legacy: { limit: number };\nexport = legacy;\n");
    // A .cts file is CommonJS, where import.meta is refused (as Node.js refuses it).
    const meta = project.write("plain-package/meta.cts", "void import.meta.url;\n");
    const text = coreOnly(coreSettings(unanswered), [
      'import legacy from "./legacy.js";',
      'import "./meta.cts";',
      "void legacy.limit;",
    ]);
    const file = project.write("plain-package/commonjs-helpers.config.ts", text);
    const report = await configCheck({ file, cwd: project.dir });
    expect(codesOf(report, "type check")).toEqual([`TS1470 ${meta}:1:6`]);
  });

  it('a directory below a "type": "commonjs" package.json, with none of its own, is CommonJS too', async () => {
    project.write("cjs-package/package.json", '{ "type": "commonjs" }\n');
    const file = project.write("cjs-package/below/umbradb.config.ts", coreOnly(coreSettings(unanswered)));
    const report = await configCheck({ file, cwd: project.dir });
    expect(codesOf(report, "type check")[0]).toBe(`TS1295 ${file}:1:10`);
  });

  it("a package's TypeScript sources are not checked: their findings are the package's", async () => {
    const outside = mkdtempSync(join(tmpdir(), "umbradb-cli-package-"));
    try {
      mkdirSync(join(outside, "node_modules", "tspkg"), { recursive: true });
      writeFileSync(
        join(outside, "node_modules", "tspkg", "package.json"),
        '{ "name": "tspkg", "type": "module", "exports": { ".": "./index.ts" } }\n',
      );
      writeFileSync(join(outside, "node_modules", "tspkg", "index.ts"), 'export const n: number = "not a number";\n');
      writeFileSync(join(outside, "package.json"), '{ "type": "module" }\n');
      const file = join(outside, "umbradb.config.ts");
      writeFileSync(file, 'import { n } from "tspkg";\nexport default { entries: [n] };\n');
      const report = await configCheck({ file, cwd: outside });
      expect(codesOf(report, "type check")).toEqual([]);
    } finally {
      rmSync(outside, { recursive: true, force: true });
    }
  });
});

describe("the process's side, from the configuration", () => {
  it("private when a core entry has instanceId and none has node", () => {
    const entry = (config: Record<string, unknown>) => ({ id: "core", start: 0, config });
    expect(inferSide({ entries: [entry({ instanceId: "a" })] })).toBe("private");
    expect(inferSide({ entries: [entry({ instanceId: "a" }), entry({ node: "ws://n" })] })).toBe("public");
    expect(inferSide({ entries: [entry({ node: "ws://n" })] })).toBe("public");
    expect(inferSide({ entries: [entry({})] })).toBe("public");
    expect(inferSide({ entries: [{ id: "m", start: 0, config: { instanceId: "a" } }] })).toBe("public");
    expect(inferSide({ entries: "none" })).toBe("public");
    expect(inferSide(null)).toBe("public");
    expect(inferSide({ entries: [null, { id: "core", config: null }, entry({ instanceId: "a" })] })).toBe("private");
  });

  it("a private configuration is validated against the private core schema", async () => {
    const settings = JSON.stringify({ network: "preprod", database: unanswered, instanceId: "wallet-1" });
    const file = project.write("private.config.ts", coreOnly(settings));
    const report = await configCheck({ file, cwd: project.dir });
    expect(codesOf(report, "configuration")).toEqual([]);
    const forced = await configCheck({ file, cwd: project.dir, side: "public" });
    expect(codesOf(forced, "configuration")).toContain("invalid-configuration settings-unknown entries[0].config.instanceId");
  });
});

describe("modules: the build's, or a host program's", () => {
  /** A user module declared in the configuration file itself, as a module package's file would declare it. */
  function withStats(): string {
    return configText(project.builders, [
      'import { z } from "zod";',
      "const stats = defineModule({",
      '  id: "stats", version: "1.2.0", side: "public", requires: ["block-header"], provides: [],',
      "  startsMidChain: true, migrations: [], points: {},",
      '  configSchema: z.object({ pollMs: z.number().int().meta({ kind: "operational" }) }),',
      "});",
      "export default defineConfig({",
      "  entries: [",
      `    coreEntry({ start: 0, config: ${coreSettings(unanswered)} }),`,
      "    stats.entry({ start: 10, config: { pollMs: 500 } }),",
      "  ],",
      "});",
    ]);
  }

  const STATS = defineModule({
    id: "stats",
    version: "1.2.0",
    side: "public",
    requires: ["block-header"],
    provides: [],
    startsMidChain: true,
    migrations: [],
    points: {},
    configSchema: z.object({ pollMs: z.number().int().meta({ kind: "operational" }) }),
  });

  it("the command checks against the build's own modules, which hold no user module", async () => {
    const file = project.write("stats.config.ts", withStats());
    const result = await check(file);
    expect(result.code).toBe(EXIT.failed);
    expect(result.stdout).toContain("entries[1].id (stats from 10): this build has no module stats");
    expect(buildDeclarations().user).toEqual([]);
  });

  it("a host program passes its own declarations to configCheck, and the file checks against them", async () => {
    const file = project.write("stats-host.config.ts", withStats());
    const build = buildDeclarations();
    const declarations = validateDeclarations({ backbone: build.backbone, core: build.core, user: [STATS] });
    const report = await configCheck({ file, cwd: project.dir, declarations });
    expect(report.passed).toBe(true);
  });

  it("the build's modules are its backbone parts with declarations, validated", () => {
    const build = buildDeclarations();
    expect(build.backbone.map((part) => part.id)).toEqual(["core-chain", "core-block-commit", "core-digest"]);
    expect(build.core).toEqual([]);
    expect(Object.isFrozen(build)).toBe(true);
  });
});

describe("no database is opened without --database", () => {
  it("a PGlite directory the file names is not created, nor its lock file", async () => {
    const data = join(project.dir, "never-created");
    const file = project.write(
      "pglite.config.ts",
      coreOnly(coreSettings(`pglite:${data}`, { developmentOptIn: true })),
    );
    const before = treeOf(project.dir).filter((path) => !path.startsWith("node_modules"));
    const report = await configCheck({ file, cwd: project.dir });
    expect(report.passed).toBe(true);
    expect(existsSync(data)).toBe(false);
    expect(existsSync(`${data}.lock.sqlite`)).toBe(false);
    expect(treeOf(project.dir).filter((path) => !path.startsWith("node_modules"))).toEqual(before);
  });
});

describe("the report's other paths", () => {
  it("a finding at the default export itself is shown as such", async () => {
    const file = project.write("number.config.ts", "export default 5;\n");
    const report = await configCheck({ file, cwd: project.dir });
    expect(codesOf(report, "configuration")).toEqual(["invalid-configuration top-level "]);
    expect(report.text).toMatch(/^ {2}\(the default export\): .* \[invalid-configuration top-level\]$/m);
  });

  it("a --database the check cannot take is the caller's error", async () => {
    const file = project.write("caller.config.ts", coreOnly(coreSettings(unanswered)));
    await expect(configCheck({ file, cwd: project.dir, database: "mysql://u:pw@h/db" })).rejects.toThrow(
      "configCheck: --database takes a PostgreSQL URL (postgres:// or postgresql://) or pglite:<directory>",
    );
    await expect(configCheck({ file, cwd: project.dir, database: "pglite:memory" })).rejects.toThrow("in-memory");
  });

  it("a --database URL the driver cannot read is a finding at --database", async () => {
    const file = project.write("bad-url.config.ts", coreOnly(coreSettings(unanswered)));
    const report = await configCheck({ file, cwd: project.dir, database: "postgres://checker:pw-4-4-PORT@h:notaport/db" });
    expect(codesOf(report, "history")).toEqual(["error --database"]);
    expect(report.text).toContain(
      "  --database: the database given with --database could not be read: Invalid URL [error]",
    );
    expect(report.text).toMatch(/— the database given with --database was not read$/m);
    expect(report.text).not.toContain("pw-4-4-PORT");
  });

  it("declarations that skipped validateDeclarations (a setting of no kind) make the check reject: the caller's error", async () => {
    const unvalidated = {
      backbone: [],
      core: [],
      user: [
        defineModule({
          id: "kindless",
          version: "1.0.0",
          side: "public",
          requires: ["block-header"],
          provides: [],
          startsMidChain: true,
          migrations: [],
          points: {},
          configSchema: z.object({ pollMs: z.number() }),
        }),
      ],
    };
    const file = project.write(
      "kindless.config.ts",
      configText(project.builders, [
        "export default defineConfig({",
        "  entries: [",
        `    coreEntry({ start: 0, config: ${coreSettings(unanswered)} }),`,
        '    { id: "kindless", start: 0, version: "1.0.0", config: { pollMs: 1 } },',
        "  ],",
        "});",
      ]),
    );
    await expect(configCheck({ file, cwd: project.dir, declarations: unvalidated })).rejects.toThrow("has no kind");
  });
});

describe("the type check's view of the file's surroundings", () => {
  let bare = "";

  beforeAll(() => {
    bare = mkdtempSync(join(tmpdir(), "umbradb-cli-bare-"));
  });

  afterAll(() => {
    if (bare !== "") rmSync(bare, { recursive: true, force: true });
  });

  /** A plain-data configuration with no import, so that it needs no package. */
  const plain = `export default { entries: [{ id: "core", start: 0, version: ${JSON.stringify(buildCoreVersion())}, config: ${coreSettings(
    "postgres://indexer@127.0.0.1:1/indexer",
  )} }] };\n`;

  it("a file with no package.json above it is an ES module, as Node.js's syntax detection reads it", async () => {
    let at = bare;
    while (dirname(at) !== at) {
      expect(existsSync(join(at, "package.json")), `no package.json above the test's directory (${at})`).toBe(false);
      at = dirname(at);
    }
    const file = join(bare, "umbradb.config.ts");
    writeFileSync(file, plain);
    const report = await configCheck({ file, cwd: bare });
    expect(codesOf(report, "type check")).toEqual([]);
    expect(report.passed).toBe(true);
  });

  it("a package.json that is no JSON says no type: the file is an ES module to the compiler", async () => {
    mkdirSync(join(bare, "broken-package"));
    writeFileSync(join(bare, "broken-package", "package.json"), "{ not json\n");
    const file = join(bare, "broken-package", "umbradb.config.ts");
    writeFileSync(file, plain);
    const report = await configCheck({ file, cwd: bare });
    expect(codesOf(report, "type check")).toEqual([]);
  });

  it("a diagnostic of no file — a broken @types package in scope — is a finding at (compiler)", async () => {
    mkdirSync(join(bare, "broken-types", "node_modules", "@types", "broken"), { recursive: true });
    writeFileSync(join(bare, "broken-types", "node_modules", "@types", "broken", "package.json"), '{ "name": "@types/broken" }\n');
    const file = join(bare, "broken-types", "umbradb.config.ts");
    writeFileSync(file, plain);
    const report = await configCheck({ file, cwd: bare });
    expect(codesOf(report, "type check")).toEqual(["TS2688 (compiler)"]);
    expect(report.text).toMatch(/^ {2}\(compiler\): Cannot find type definition file for 'broken'\..* \[TS2688\]$/m);
  });
});

describe("no secret is printed (CF-4, AE-6)", () => {
  it("a secret setting's value quoted by the compiler is redacted", async () => {
    const node = "ws://127.0.0.1:9944/node-secret-4-4";
    const text = configText(project.builders, [
      `const node = ${JSON.stringify(node)};`,
      'const shown: "a" | "b" = node;',
      "void shown;",
      "export default defineConfig({",
      "  entries: [",
      `    coreEntry({ start: 0, config: { network: "preprod", node, database: ${JSON.stringify(unanswered)} } }),`,
      "  ],",
      "});",
    ]);
    const file = project.write("quoted-secret.config.ts", text);
    const result = await check(file);
    expect(result.code).toBe(EXIT.failed);
    expect(result.stdout).toContain(`Type '"[redacted]"' is not assignable to type '"a" | "b"'. [TS2322]`);
    expect(result.stdout).not.toContain("node-secret-4-4");
    // The report's findings, which a host program reads, are redacted as its text is.
    const report = await configCheck({ file, cwd: project.dir });
    expect(report.steps[0]?.findings[0]?.message).toBe(`Type '"[redacted]"' is not assignable to type '"a" | "b"'.`);
    expect(JSON.stringify(report.steps)).not.toContain("node-secret-4-4");
  });

  it("a URL's password in a field that is no secret is redacted wherever it is quoted", async () => {
    const text = coreOnly(
      coreSettings(unanswered, { network: "postgres://reader:pw-4-4-NETWORK@db/x" }),
    );
    const file = project.write("network-url.config.ts", text);
    const result = await check(file);
    expect(result.code).toBe(EXIT.failed);
    expect(result.stdout).toContain("TS2322");
    expect(result.stdout).toContain("settings-schema");
    expect(result.stdout).not.toContain("pw-4-4-NETWORK");
    expect(result.stdout).not.toContain("pw-4-4-CONFIG");
  });

  it("the --database URL in an error the file throws is redacted, though the file gave no data", async () => {
    const url = "postgres://checker:pw-4-4-FLAG@127.0.0.1:1/indexer";
    process.env.UMBRADB_4_4_URL = url;
    try {
      const file = project.write(
        "throws-url.config.ts",
        configText(project.builders, ["throw new Error(`cannot use ${process.env.UMBRADB_4_4_URL}`);", "export default {};"]),
      );
      const result = await check(file, ["--database", url]);
      expect(result.code).toBe(EXIT.failed);
      expect(result.stdout).toContain("cannot use [redacted]");
      expect(`${result.stdout}${result.stderr}`).not.toContain("pw-4-4-FLAG");
      // The control: the same check with the redaction left out prints the password.
      const leaky = await configCheck(
        { file, cwd: project.dir, database: url },
        { redactor: () => ({ text: (text: string) => text, settings: (settings) => settings }) },
      );
      expect(leaky.text).toContain("pw-4-4-FLAG");
    } finally {
      delete process.env.UMBRADB_4_4_URL;
    }
  });
});

describe("A35's negative control: a check that stops at its first finding", () => {
  it("fails A35's 'prints both' on the file with a type error and a schema error", async () => {
    const text = coreOnly(coreSettings(unanswered, { apiReadTimeoutMs: 0 }), ['const label: number = "core";', "void label;"]);
    const file = project.write("two-errors-control.config.ts", text);
    const typeLine = lineOf(text, "const label");
    const stopping: CheckStep[] = CHECK_STEPS.map((step) => ({
      name: step.name,
      run: async (state) =>
        state.reports.some((report) => report.findings.length > 0)
          ? { name: step.name, title: step.name, status: "not run", findings: [], note: "stopped at the first finding" }
          : step.run(state),
    }));
    const stopped = await configCheck({ file, cwd: project.dir }, { steps: stopping });
    expect(stopped.passed).toBe(false);
    expect(printsBoth(stopped.text, file, typeLine)).toBe(false);
    expect(printsBoth((await configCheck({ file, cwd: project.dir })).text, file, typeLine)).toBe(true);
  });
});
