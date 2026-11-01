import { mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { pathToFileURL } from "node:url";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { CORE_BLOCK_PARSED } from "../../src/backbone/core-block-parsed/core-block-parsed.js";
import { CORE_CHAIN_EVENTS } from "../../src/backbone/core-chain-events/core-chain-events.js";
import { commandBuild } from "../../src/cli/build-modules.js";
import { loadConfig } from "../../src/config/load.js";
import { startUmbraDB, type UmbraDBHandle } from "../../src/library/start-umbradb.js";
import { InMemoryBlockSource } from "../../src/runner/in-memory-source.js";
import { PROCESS_BACKENDS, type ProcessBackend } from "../runner/process-backends.js";
import { startProcess } from "../runner/process-build.js";
import { TASK_ROWS } from "./fixtures/task-modules.js";
import { cursorReaches, libraryData, PGLITE_MEMORY, rowsModule } from "./library-fixtures.js";

/**
 * A library process's user modules (LM-7): `modules` objects, or `modulesFrom`, a module URL both threads import; a
 * `{ file }`'s own `modules` export. [LM-7, MD-1, LG-17]
 *
 * - L43: `{ data, modules: [m] }` (no ledger tasks) with `core-block-parsed` starts and processes; a `{ file }`'s
 *   own `modules` export is its user modules.
 * - L44 `[NEG]`: `modules-given-twice` for `modules` with `{ file }`, `modules` with `modulesFrom`, `modulesFrom` with
 *   `{ file }`; the control is the engine, which takes `{ file }` with `{ modules }` (the given list wins).
 * - L45 `[NEG]`: `modules` objects declaring ledger tasks are refused `ledger-tasks-need-modules-from`; the control runs
 *   the same build through the engine's own build seam, past the rule: its worker has no such task, and processing
 *   halts at the first height.
 * - L46: `modulesFrom` with a ledger task: the task runs in the ledger worker (its item names the thread).
 * - L63 `[NEG]`: a `modulesFrom` that fails to import is refused `load-failed`, one whose `modules` export is missing or
 *   not an array `modules-not-a-list`, each naming the URL; the control is a configuration file's export, where a
 *   missing one is an empty list.
 */

const FIXTURES = new URL("./fixtures/", import.meta.url);

/** The entries that make the build parse blocks: `core-chain-events` and `core-block-parsed` from 1. */
const PARSING = [CORE_CHAIN_EVENTS, CORE_BLOCK_PARSED].map((part) => ({ id: part.id, start: 1, version: part.version, config: {} }));

/** The configuration data of a parsing process on `database` with entries for `modules` from 1. */
const parsingData = (database: Parameters<typeof libraryData>[0], modules: Parameters<typeof libraryData>[1] = []) => {
  const data = libraryData(database, modules);
  return { entries: [...data.entries, ...PARSING] };
};

/** Waits for `handle`'s process to end by itself (a configuration refusal) within 30 s. */
async function closedByItself(handle: UmbraDBHandle): Promise<void> {
  let timer: NodeJS.Timeout | undefined;
  try {
    await Promise.race([
      handle.closed,
      new Promise<never>((_, reject) => {
        timer = setTimeout(() => reject(new Error("the process did not end by itself within 30 s")), 30_000);
      }),
    ]);
  } finally {
    clearTimeout(timer);
  }
}

describe.each(PROCESS_BACKENDS)("L43: { data, modules } with core-block-parsed, on $name", (backend: ProcessBackend) => {
  beforeAll(() => backend.start(), 180_000);
  afterAll(() => backend.stop(), 60_000);

  it("a user module without ledger tasks, given as an object, runs beside core-block-parsed", async () => {
    const seen: string[] = [];
    const m = rowsModule("m", seen);
    const handle = startUmbraDB({
      config: { data: parsingData((await backend.database()).setting, [m]) },
      modules: [m],
      source: new InMemoryBlockSource({ head: 3n }),
    });
    try {
      await handle.started;
      await cursorReaches(handle, 3n);
      expect(seen).toEqual(["m 1", "m 2", "m 3"]);
    } finally {
      await handle.stop();
    }
  }, 120_000);
});

describe("LM-7: a { file } configuration's own modules export is its user modules", () => {
  it("the module the file exports runs, with no modules option", async () => {
    const file = new URL("file-modules.config.ts", FIXTURES);
    const handle = startUmbraDB({ config: { file }, source: new InMemoryBlockSource({ head: 2n }) });
    try {
      await handle.started;
      await cursorReaches(handle, 2n);
    } finally {
      await handle.stop();
    }
    const { SEEN } = (await import(file.href)) as { SEEN: string[] };
    expect(SEEN.slice(-2)).toEqual(["from-file 1", "from-file 2"]);
  }, 60_000);
});

describe("L44: user modules given twice are refused modules-given-twice (LM-7)", () => {
  let dir: string;
  let file: string;
  beforeAll(() => {
    dir = mkdtempSync(join(tmpdir(), "umbradb-library-modules-"));
    file = join(dir, "given.config.ts");
    writeFileSync(file, `export default ${JSON.stringify(libraryData(PGLITE_MEMORY))};\nexport const modules = [];\n`);
  });
  afterAll(() => rmSync(dir, { recursive: true, force: true }));

  it("modules with { file }, modules with modulesFrom, modulesFrom with { file }: each refused, naming both", async () => {
    const url = new URL("task-modules.ts", FIXTURES);
    const m = rowsModule("m");
    for (const [options, given] of [
      [{ config: { file }, modules: [m] }, ["modules", "config.file"]],
      [{ config: { data: libraryData(PGLITE_MEMORY) }, modules: [m], modulesFrom: url }, ["modules", "modulesFrom"]],
      [{ config: { file }, modulesFrom: url }, ["modulesFrom", "config.file"]],
    ] as const) {
      const handle = startUmbraDB(options);
      await expect(handle.started).rejects.toMatchObject({ code: "modules-given-twice", details: { given } });
      await closedByItself(handle);
      expect(handle.status()).toMatchObject({ state: "refused", reason: { code: "modules-given-twice" } });
    }
  }, 60_000);

  it("negative control: the engine takes a { file } with { modules }, the given list in place of the file's", async () => {
    const handle = startProcess({
      config: { file },
      userModules: { modules: [rowsModule("m")] },
      source: new InMemoryBlockSource({ head: 1n }),
    });
    // Nothing refuses the two sources there: the process starts with the list given (its module, with no entry in the
    // file, is not enabled).
    expect(await handle.started.then(() => "started", (error: { code?: string }) => error.code)).toBe("started");
    await handle.stop();
  }, 60_000);
});

describe("L45: modules objects declaring ledger tasks are refused ledger-tasks-need-modules-from (LM-7)", () => {
  it("refused before anything opens, naming the module", async () => {
    const handle = startUmbraDB({
      config: { data: parsingData(PGLITE_MEMORY, [TASK_ROWS]) },
      modules: [TASK_ROWS],
      source: new InMemoryBlockSource({ head: 3n }),
    });
    await expect(handle.started).rejects.toMatchObject({ code: "ledger-tasks-need-modules-from", details: { modules: ["task-rows"] } });
    await closedByItself(handle);
  }, 60_000);

  it("negative control: past the rule (the engine's own build seam), the worker has no such task and processing halts", async () => {
    const handle = startProcess({
      declarations: commandBuild([TASK_ROWS]),
      config: { data: parsingData(PGLITE_MEMORY, [TASK_ROWS]) },
      source: new InMemoryBlockSource({ head: 3n }),
      network: {},
    });
    try {
      await handle.started;
      for (let waited = 0; handle.status().state !== "halted" && waited < 60_000; waited += 20) {
        await new Promise((resolve) => setTimeout(resolve, 20));
      }
      expect(handle.status()).toMatchObject({ state: "halted", cursor: null, reason: { code: "callback-error" } });
    } finally {
      await handle.stop();
    }
  }, 120_000);
});

describe.each(PROCESS_BACKENDS)("L46: modulesFrom with a ledger task, on $name", (backend: ProcessBackend) => {
  beforeAll(() => backend.start(), 180_000);
  afterAll(() => backend.stop(), 60_000);

  it("both threads import the URL: the task runs in the ledger worker, its item reaching the module", async () => {
    const url = new URL("task-modules.ts", FIXTURES);
    const handle = startUmbraDB({
      config: { data: parsingData((await backend.database()).setting, [TASK_ROWS]) },
      modulesFrom: url,
      source: new InMemoryBlockSource({ head: 3n }),
    });
    try {
      await handle.started;
      await cursorReaches(handle, 3n);
    } finally {
      await handle.stop();
    }
    // The module the process ran is the one this test imports from the same URL.
    const { SEEN } = (await import(url.href)) as { SEEN: string[] };
    expect(SEEN.slice(-3)).toEqual(["1 worker", "2 worker", "3 worker"]);
  }, 120_000);
});

describe("L63: a modulesFrom that cannot give its list is refused, naming the URL (LM-7)", () => {
  it.each([
    ["modules-throws.ts", "load-failed"],
    ["modules-missing.ts", "modules-not-a-list"],
    ["modules-not-a-list.ts", "modules-not-a-list"],
    ["no-such-module.ts", "load-failed"],
  ])("%s: invalid-configuration, %s", async (name, reason) => {
    const url = new URL(name, FIXTURES);
    const handle = startUmbraDB({ config: { data: libraryData(PGLITE_MEMORY) }, modulesFrom: url });
    const error = await handle.started.then(
      () => null,
      (caught: { code: string; message: string; details: { reason: string; file: string } }) => caught,
    );
    expect(error).toMatchObject({ code: "invalid-configuration", details: { reason, file: url.href } });
    expect(error?.message).toContain(url.href);
    await closedByItself(handle);
  }, 60_000);

  it("negative control: a configuration file's export is optional — the same missing export reads as no modules", async () => {
    const dir = mkdtempSync(join(tmpdir(), "umbradb-library-l63-"));
    try {
      const file = join(dir, "no-modules.config.ts");
      writeFileSync(file, `export default ${JSON.stringify(libraryData(PGLITE_MEMORY))};\nexport const others = [];\n`);
      expect((await loadConfig({ file: pathToFileURL(file), cwd: dir })).modules).toEqual([]);
    } finally {
      rmSync(dir, { recursive: true, force: true });
    }
  });
});
