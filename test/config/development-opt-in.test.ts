import { existsSync, mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { databaseOptions, databaseTarget, openConfiguredDatabase } from "../../src/config/database.js";
import { checkHistory, graphInputOf } from "../../src/config/history.js";
import { loadConfig } from "../../src/config/load.js";
import { processCoreEntry } from "../../src/config/process.js";
import { validateConfig } from "../../src/config/validate.js";
import type { CommittedHeight } from "../../src/db/api.js";
import { UmbraError } from "../../src/db/errors.js";
import { resolveGraph } from "../../src/modules/graph.js";
import { REPOSITORY } from "./config-fixtures.js";
import { build, DEVTOOL } from "./history-fixtures.js";

/**
 * A34 `[CI]` (CF-9; task 4.3): the development-only features refuse without the `core` entry's `developmentOptIn`,
 * naming the feature — each through a configuration file, loaded, validated and taken to where the refusal is made:
 *
 * - PGlite: the `database` setting of the process's `core` revision (the latest of the build's version, decision record
 *   Q102, option A) opens the database (`openConfiguredDatabase`), and `openPglite` refuses without the opt-in before
 *   anything is created (task 2.5, reused);
 * - a development-only module: the requirement graph refuses it (MD-5, `development-opt-in-required`, task 3.2a), given
 *   the history check's opt-in;
 * - `sweep: "off"`: the history check refuses it (CF-9's configuration half; the sweep itself is task 12.x's).
 *
 * Backups of a private database (CF-9's fourth feature) are task 15.x's. "Startup refuses" through the runner's
 * refused state is 5.x's.
 */

/** The configuration's builders and the test modules, imported by absolute path as an operator's file imports them. */
const CONFIG = join(REPOSITORY, "src", "config", "index.js");
const MODULES = join(REPOSITORY, "test", "config", "history-fixtures.js");

let directory = "";

beforeAll(() => {
  directory = mkdtempSync(join(tmpdir(), "umbradb-4-3-"));
  writeFileSync(join(directory, "package.json"), JSON.stringify({ type: "module" }));
});

afterAll(() => {
  if (directory !== "") rmSync(directory, { recursive: true, force: true });
});

let files = 0;

/** A configuration file whose entries are `entries` (TypeScript source), written and loaded as startup loads it. */
async function load(entries: string) {
  const file = join(directory, `umbradb-${++files}.config.ts`);
  writeFileSync(
    file,
    [
      `import { coreEntry, defineConfig } from ${JSON.stringify(CONFIG)};`,
      `import { DEVTOOL } from ${JSON.stringify(MODULES)};`,
      "",
      'const settings = { network: "preprod", node: "ws://127.0.0.1:9944" } as const;',
      "",
      `export default defineConfig({ entries: [${entries}] });`,
      "",
    ].join("\n"),
  );
  return loadConfig({ file });
}

const noHeight: CommittedHeight = async () => null;

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

describe("A34: PGlite refuses without developmentOptIn, through a configuration file (CF-9)", () => {
  it("refuses pglite:<directory> naming PGlite and the opt-in, creating nothing; opens it with the opt-in", async () => {
    const dataDir = join(directory, "pglite-data");
    const coreOf = (optIn: string) =>
      `coreEntry({ start: 0, config: { ...settings, database: ${JSON.stringify(`pglite:${dataDir}`)}${optIn} } })`;
    const declarations = build([]);
    const without = processCoreEntry(validateConfig({ config: await load(coreOf("")), declarations, side: "public" }));
    const error = await refusal(() => openConfiguredDatabase(without, { committedHeight: noHeight }));
    expect(error.code).toBe("development-opt-in-required");
    expect(error.details).toEqual({ feature: "pglite" });
    for (const words of ["PGlite", "developmentOptIn: true"]) expect(error.message).toContain(words);
    expect(existsSync(dataDir)).toBe(false);
    const withOptIn = processCoreEntry(
      validateConfig({ config: await load(coreOf(", developmentOptIn: true")), declarations, side: "public" }),
    );
    const db = await openConfiguredDatabase(withOptIn, { committedHeight: noHeight });
    try {
      expect(await db.read((read) => read.query("SELECT 1 AS one"))).toEqual([{ one: 1 }]);
    } finally {
      await db.close();
    }
    expect(existsSync(dataDir)).toBe(true);
  });

  it("refuses pglite:memory (CF-9's scenario), and takes the opt-in of the latest core revision (Q102, option A)", async () => {
    const declarations = build([]);
    const process = async (entries: string) =>
      processCoreEntry(validateConfig({ config: await load(entries), declarations, side: "public" }));
    const earlierOnly = await process(
      'coreEntry({ start: 0, config: { ...settings, database: "pglite:memory", developmentOptIn: true } }), ' +
        'coreEntry({ start: 10, config: { ...settings, database: "pglite:memory" } })',
    );
    expect((await refusal(() => openConfiguredDatabase(earlierOnly, { committedHeight: noHeight }))).details).toEqual({ feature: "pglite" });
    const latest = await process(
      'coreEntry({ start: 0, config: { ...settings, database: "pglite:memory" } }), ' +
        'coreEntry({ start: 10, config: { ...settings, database: "pglite:memory", developmentOptIn: true } })',
    );
    const db = await openConfiguredDatabase(latest, { committedHeight: noHeight });
    await db.close();
  });

  it("maps the database setting to a backend: pglite:memory, a PGlite directory, a PostgreSQL URL (task 2.5's note)", () => {
    expect(databaseTarget("pglite:memory")).toEqual({ backend: "pglite", dataDir: "memory://" });
    expect(databaseTarget("pglite:/var/lib/umbradb")).toEqual({ backend: "pglite", dataDir: "/var/lib/umbradb" });
    expect(databaseTarget("pglite:data/db")).toEqual({ backend: "pglite", dataDir: "data/db" });
    expect(databaseTarget("postgres://u:p@db:5432/x")).toEqual({ backend: "postgres", url: "postgres://u:p@db:5432/x" });
    expect(databaseTarget("postgresql://db/x")).toEqual({ backend: "postgres", url: "postgresql://db/x" });
  });

  it("passes the revision's developmentOptIn to PGlite and its fullPageWritesOffAllowed to PostgreSQL (DB-12)", async () => {
    const declarations = build([]);
    const process = async (config: string) =>
      processCoreEntry(validateConfig({ config: await load(`coreEntry({ start: 0, config: { ...settings, ${config} } })`), declarations, side: "public" }));
    const options = { committedHeight: noHeight };
    expect(databaseOptions(await process('database: "pglite:memory"'), options)).toEqual({
      backend: "pglite",
      options: { dataDir: "memory://", committedHeight: noHeight, developmentOptIn: false },
    });
    expect(databaseOptions(await process('database: "pglite:memory", developmentOptIn: true'), options).options).toMatchObject({
      developmentOptIn: true,
    });
    expect(databaseOptions(await process('database: "postgres://db/x", developmentOptIn: true'), options)).toEqual({
      backend: "postgres",
      options: { url: "postgres://db/x", committedHeight: noHeight, fullPageWritesOffAllowed: false },
    });
    expect(
      databaseOptions(await process('database: "postgres://db/x", fullPageWritesOffAllowed: true'), options).options,
    ).toMatchObject({ fullPageWritesOffAllowed: true });
  });

  it("does not ask PostgreSQL for the opt-in (it is no development-only feature)", async () => {
    const declarations = build([]);
    const entry = processCoreEntry(
      validateConfig({
        config: await load('coreEntry({ start: 0, config: { ...settings, database: "postgres://127.0.0.1:1/none" } })'),
        declarations,
        side: "public",
      }),
    );
    // No connection is made until one is needed (`openPostgres`): opening succeeds, and closing it is harmless.
    const db = await openConfiguredDatabase(entry, { committedHeight: noHeight });
    await db.close();
  });
});

describe("A34: a development-only module refuses without developmentOptIn, through a configuration file (CF-9, MD-5)", () => {
  /** Loads `entries`, validates them and resolves the graph on a new database, as startup does. */
  async function resolve(entries: string) {
    const declarations = build([DEVTOOL]);
    const config = validateConfig({ config: await load(entries), declarations, side: "public" });
    const check = checkHistory({ config, cursor: null, declarations, history: [] });
    return resolveGraph(graphInputOf(check, declarations));
  }

  const devtool = "DEVTOOL.entry({ start: 0, config: {} })";

  it("refuses it naming the module and the feature, and accepts it with the opt-in", async () => {
    const error = await refusal(() => resolve(`coreEntry({ start: 0, config: { ...settings, database: "pglite:memory" } }), ${devtool}`));
    expect(error.code).toBe("development-opt-in-required");
    expect(error.details).toEqual({ feature: "development-only-module", module: "devtool" });
    for (const words of ["devtool", "developmentOptIn: true"]) expect(error.message).toContain(words);
    const graph = await resolve(
      `coreEntry({ start: 0, config: { ...settings, database: "pglite:memory", developmentOptIn: true } }), ${devtool}`,
    );
    expect(graph.segments.get("devtool")).toEqual([{ from: 0n, to: null }]);
  });

  it("takes the opt-in of the latest core revision of the build's version (Q102, option A)", async () => {
    const earlierOnly =
      'coreEntry({ start: 0, config: { ...settings, database: "pglite:memory", developmentOptIn: true } }), ' +
      `coreEntry({ start: 10, config: { ...settings, database: "pglite:memory" } }), ${devtool}`;
    expect((await refusal(() => resolve(earlierOnly))).details).toEqual({ feature: "development-only-module", module: "devtool" });
  });
});

describe("CF-9: sweep: off refuses without developmentOptIn, through a configuration file", () => {
  it("refuses it naming the feature, and accepts it with the opt-in", async () => {
    const declarations = build([]);
    const check = async (optIn: string) => {
      const config = validateConfig({
        config: await load(`coreEntry({ start: 0, config: { ...settings, database: "pglite:memory", sweep: "off"${optIn} } })`),
        declarations,
        side: "public",
      });
      return checkHistory({ config, cursor: null, declarations, history: [] });
    };
    const error = await refusal(() => check(""));
    expect(error.code).toBe("development-opt-in-required");
    expect(error.details.feature).toBe("sweep-off");
    expect((await check(", developmentOptIn: true")).writes).toHaveLength(1);
  });
});
