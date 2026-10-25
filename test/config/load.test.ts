import { execFileSync } from "node:child_process";
import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";
import { pathToFileURL } from "node:url";
import { build } from "esbuild";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { buildCoreVersion } from "../../src/config/build.js";
import { DEFAULT_CONFIG_FILE, loadConfig } from "../../src/config/load.js";
import { UmbraError } from "../../src/db/errors.js";
import { CORE_SETTINGS, REPOSITORY } from "./config-fixtures.js";

/**
 * The configuration loader (CF-1, `design.md` §7; task 4.1): one TypeScript file, `umbradb.config.ts` in the working
 * directory or the path given (`--config`, task 4.4), imported — on Node.js 24 through its built-in type stripping —
 * and its default export taken, checked to be plain data and returned as a frozen copy: what is validated, compared,
 * recorded and shown is the evaluated data, never the source text. A file that cannot be read or evaluated, or has no
 * default export, refuses startup with `invalid-configuration` naming the file and the reason; a value that is not
 * plain data, with `not-plain-data` (A26, `./plain-data.test.ts`). "Startup refuses" is the runner's (task 5.x), which
 * calls the loader first; here the loader is called directly.
 *
 * Under Vitest a dynamic `import()` goes through Vitest's own TypeScript transform, which also accepts syntax Node.js
 * refuses (an `enum`). The last suite therefore bundles the loader with esbuild and runs it in a plain Node.js process,
 * so that the configuration file is loaded exactly as in production: by Node.js's type stripping.
 */

/** The builders, imported by absolute path (which Vitest's resolver reads, where it does not read a `file:` URL). */
const CONFIG = join(REPOSITORY, "src", "config", "index.js");

let directory = "";

beforeAll(() => {
  directory = mkdtempSync(join(tmpdir(), "umbradb-load-"));
  writeFileSync(join(directory, "package.json"), '{ "type": "module" }\n');
});

afterAll(() => {
  if (directory !== "") rmSync(directory, { recursive: true, force: true });
});

/** Writes `text` to `name` in the test's directory and returns its absolute path. */
function write(name: string, text: string): string {
  const file = join(directory, name);
  writeFileSync(file, text);
  return file;
}

/** A configuration file with one `core` entry, typed as an operator writes it. */
const VALID = [
  `import { coreEntry, defineConfig } from ${JSON.stringify(CONFIG)};`,
  "",
  "interface Settings { readonly node: string }",
  'const settings: Settings = { node: "ws://127.0.0.1:9944" };',
  "",
  "export default defineConfig({",
  '  entries: [coreEntry({ start: 0, config: { network: "preprod", database: "pglite:memory", node: settings.node } })],',
  "});",
  "",
].join("\n");

const EXPECTED = {
  entries: [{ id: "core", start: 0, version: buildCoreVersion(), config: { ...CORE_SETTINGS } }],
};

/** The `UmbraError` `run` rejects with; fails the test otherwise. */
async function refusal(run: () => Promise<unknown>): Promise<UmbraError> {
  try {
    await run();
  } catch (error) {
    expect(error).toBeInstanceOf(UmbraError);
    return error as UmbraError;
  }
  return expect.unreachable("expected a refusal");
}

describe("CF-1: the loader takes the file's default export as plain data", () => {
  it("loads umbradb.config.ts from the working directory by default", async () => {
    const cwd = join(directory, "project");
    mkdirSync(cwd);
    writeFileSync(join(cwd, DEFAULT_CONFIG_FILE), VALID);
    const loaded = await loadConfig({ cwd });
    expect(DEFAULT_CONFIG_FILE).toBe("umbradb.config.ts");
    expect(loaded.file).toBe(join(cwd, "umbradb.config.ts"));
    expect(loaded.data).toEqual(EXPECTED);
    expect(Object.isFrozen(loaded)).toBe(true);
  });

  it("uses the process's working directory when none is given", async () => {
    // The repository has no umbradb.config.ts, so the default path is named in the refusal.
    const error = await refusal(() => loadConfig());
    expect(error.details).toEqual({ file: resolve(process.cwd(), "umbradb.config.ts"), reason: "file-not-found" });
  });

  it("loads a given path, relative to the working directory or absolute", async () => {
    const file = write("relative.config.ts", VALID);
    expect((await loadConfig({ cwd: directory, file: "relative.config.ts" })).file).toBe(file);
    expect((await loadConfig({ cwd: "/", file })).data).toEqual(EXPECTED);
  });

  it("returns a frozen copy of the evaluated data: the file changing its export later changes nothing", async () => {
    // The file keeps its export where the test can see it, and changes it once the loader has returned.
    const file = write(
      "mutable.config.ts",
      [
        'const config = { entries: [{ id: "stats", start: 0, version: "1.2.0", config: { pollMs: 1000 } }] };',
        "(globalThis as Record<string, unknown>).umbradbTest41 = config;",
        "setTimeout(() => { config.entries[0]!.config.pollMs = 1; }, 0);",
        "export default config;",
        "",
      ].join("\n"),
    );
    const loaded = await loadConfig({ file });
    await new Promise((settle) => setTimeout(settle, 20));
    const exported = (globalThis as Record<string, unknown>).umbradbTest41 as { entries: { config: object }[] };
    expect(exported.entries[0]?.config).toEqual({ pollMs: 1 });
    expect(loaded.data).toEqual({ entries: [{ id: "stats", start: 0, version: "1.2.0", config: { pollMs: 1000 } }] });
    expect(loaded.data).not.toBe(exported);
    expect(Object.isFrozen((loaded.data as { entries: object[] }).entries[0])).toBe(true);
    delete (globalThis as Record<string, unknown>).umbradbTest41;
  });

  it("evaluates the file, so it may read environment variables, for example for secrets", async () => {
    process.env.UMBRADB_TEST_4_1_DATABASE = "postgres://indexer@db/umbradb";
    try {
      const file = write(
        "env.config.ts",
        "export default { entries: [{ id: \"core\", config: { database: process.env.UMBRADB_TEST_4_1_DATABASE! } }] };\n",
      );
      expect((await loadConfig({ file })).data).toEqual({
        entries: [{ id: "core", config: { database: "postgres://indexer@db/umbradb" } }],
      });
    } finally {
      delete process.env.UMBRADB_TEST_4_1_DATABASE;
    }
  });
});

describe("CF-1: a file that cannot be loaded refuses startup with invalid-configuration, naming the file", () => {
  it("no file at the path", async () => {
    const file = join(directory, "missing.config.ts");
    const error = await refusal(() => loadConfig({ file }));
    expect(error.code).toBe("invalid-configuration");
    expect(error.retryable).toBe(false);
    expect(error.details).toEqual({ file, reason: "file-not-found" });
    expect(error.message).toContain(`no configuration file at ${file}`);
    expect(error.message).toContain("--config");
    expect(error.message).toContain("(CF-1)");
  });

  it("a directory at the path", async () => {
    const file = join(directory, "a-directory.config.ts");
    mkdirSync(file);
    const error = await refusal(() => loadConfig({ file }));
    expect(error.details).toEqual({ file, reason: "file-not-found" });
  });

  it("no default export", async () => {
    const file = write("named.config.ts", "export const config = { entries: [] };\n");
    const error = await refusal(() => loadConfig({ file }));
    expect(error.code).toBe("invalid-configuration");
    expect(error.details).toEqual({ file, reason: "no-default-export" });
    expect(error.message).toContain(`${file} has no default export`);
    expect(error.message).toContain("export default defineConfig({ entries: [");
  });

  it("an error thrown while the file is evaluated, kept as the cause", async () => {
    const file = write("throws.config.ts", 'throw new Error("set UMBRADB_DATABASE");\nexport default {};\n');
    const error = await refusal(() => loadConfig({ file }));
    expect(error.code).toBe("invalid-configuration");
    expect(error.details).toEqual({ file, reason: "load-failed", errorCode: null });
    expect(error.message).toContain(`the configuration file ${file} could not be loaded: set UMBRADB_DATABASE`);
    expect((error.cause as Error).message).toBe("set UMBRADB_DATABASE");
  });

  it("a value thrown that is not an Error", async () => {
    const file = write("throws-text.config.ts", 'throw "no node configured";\nexport default {};\n');
    const error = await refusal(() => loadConfig({ file }));
    expect(error.details).toEqual({ file, reason: "load-failed", errorCode: null });
    expect(error.message).toContain("could not be loaded: no node configured (CF-1)");
  });

  it("an import the file makes that does not resolve is a load failure, not a missing file", async () => {
    const file = write("imports.config.ts", 'import "./not-there.js";\nexport default { entries: [] };\n');
    const error = await refusal(() => loadConfig({ file }));
    expect(error.details).toMatchObject({ file, reason: "load-failed" });
  });

  it("names the file in a not-plain-data refusal", async () => {
    const file = write("function.config.ts", "export default { entries: [{ id: \"core\", config: { onError: () => 0 } }] };\n");
    const error = await refusal(() => loadConfig({ file }));
    expect(error.code).toBe("not-plain-data");
    expect(error.details).toEqual({ file, path: "entries[0].config.onError", found: "a function" });
  });
});

describe("CF-1: in a plain Node.js process, the file is loaded by Node.js's own type stripping", () => {
  /** Runs `loadConfig` from the esbuild bundle in a Node.js process of its own and returns what it printed. */
  function loadInNode(bundle: string, file: string): Record<string, unknown> {
    const script = [
      `import { loadConfig } from ${JSON.stringify(pathToFileURL(bundle).href)};`,
      "const typescript = process.features.typescript;",
      "try {",
      `  const { data } = await loadConfig({ file: ${JSON.stringify(file)} });`,
      "  console.log(JSON.stringify({ typescript, data }));",
      "} catch (error) {",
      "  console.log(JSON.stringify({ typescript, code: error.code, details: error.details, message: error.message }));",
      "}",
    ].join("\n");
    const output = execFileSync(process.execPath, ["--input-type=module", "--no-warnings", "-e", script], {
      cwd: directory,
      encoding: "utf8",
    });
    return JSON.parse(output) as Record<string, unknown>;
  }

  let bundle = "";

  beforeAll(async () => {
    bundle = join(directory, "umbradb-config.mjs");
    await build({
      entryPoints: [join(REPOSITORY, "src", "config", "index.ts")],
      bundle: true,
      platform: "node",
      format: "esm",
      target: "node24",
      outfile: bundle,
      logLevel: "silent",
    });
  });

  it("loads erasable TypeScript: interfaces, annotations, satisfies, as const", () => {
    const file = write(
      "native.config.ts",
      [
        "import { coreEntry, defineConfig, type UmbraConfig } from \"./umbradb-config.mjs\";",
        "interface Node { readonly url: string }",
        'const node: Node = { url: "ws://127.0.0.1:9944" } as const;',
        "export default defineConfig({",
        '  entries: [coreEntry({ start: 0, config: { network: "preprod", database: "pglite:memory", node: node.url } })],',
        "} satisfies UmbraConfig);",
        "",
      ].join("\n"),
    );
    expect(loadInNode(bundle, file)).toEqual({ typescript: "strip", data: EXPECTED });
  });

  it("refuses TypeScript that type stripping cannot erase (an enum), naming the file and the reason", () => {
    const file = write(
      "enum.config.ts",
      'enum Network { Preprod = "preprod" }\nexport default { entries: [{ id: "core", config: { network: Network.Preprod } }] };\n',
    );
    const result = loadInNode(bundle, file);
    expect(result.code).toBe("invalid-configuration");
    expect(result.details).toEqual({ file, reason: "load-failed", errorCode: "ERR_UNSUPPORTED_TYPESCRIPT_SYNTAX" });
    expect(result.message).toContain("erasable TypeScript only");
  });

  it("refuses a value that is not plain data with its path", () => {
    const file = write(
      "native-function.config.ts",
      [
        "import { coreEntry, defineConfig, versionEntry } from \"./umbradb-config.mjs\";",
        "export default defineConfig({",
        "  entries: [",
        '    coreEntry({ start: 0, config: { network: "preprod", database: "pglite:memory", node: "ws://n" } }),',
        '    versionEntry({ id: "stats", start: 1, version: "1.0.0", config: { onError: (() => 0) as never } }),',
        "  ],",
        "});",
        "",
      ].join("\n"),
    );
    const result = loadInNode(bundle, file);
    expect(result.code).toBe("not-plain-data");
    expect(result.details).toEqual({ file, path: "entries[1].config.onError", found: "a function" });
  });
});
