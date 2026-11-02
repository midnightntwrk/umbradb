import { mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { pathToFileURL } from "node:url";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { CORE_BLOCK_PARSED } from "../../src/backbone/core-block-parsed/core-block-parsed.js";
import { CORE_CHAIN_EVENTS } from "../../src/backbone/core-chain-events/core-chain-events.js";
import { commandBuild } from "../../src/cli/build-modules.js";
import { loadConfig, loadModuleList } from "../../src/config/load.js";
import type { DatabaseParts } from "../../src/config/database-parts.js";
import { configurationRefusalLines } from "../../src/runner/configuration-refusal.js";
import { startUmbraDB, type UmbraDBHandle, type UmbraDBOptions } from "../../src/library/start-umbradb.js";
import { InMemoryBlockSource } from "../../src/runner/in-memory-source.js";
import { PROCESS_BACKENDS, type ProcessBackend } from "../runner/process-backends.js";
import { startProcess } from "../runner/process-build.js";
import { TASK_ROWS } from "./fixtures/task-modules.js";
import { cursorReaches, libraryData, PGLITE_MEMORY, rowsModule } from "./library-fixtures.js";
import { exchange, mountHandlers } from "./mounted-fixtures.js";
import { L63_CASES, moduleListProblems } from "./module-list-cases.js";

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
 *   not an array `modules-not-a-list`, each naming the URL (the cases and oracle are `./module-list-cases.ts`'s); a
 *   configuration file's export, unlike it, is optional. The negative controls, `./modules.negative-control.test.ts`:
 *   each of `loadModuleList`'s three rules removed fails the oracle on its own cases.
 * - CF-4 `[NEG]` on the refusals that come before the configuration is validated — a `modulesFrom` that cannot be
 *   imported, a user module's own refusal, a `{ file }` whose `modules` export is no list: a credential the
 *   configuration holds (`database.password`, the node URL's) that the refusal's text would show is shown nowhere — not
 *   on the host's log, in `started`'s error (its message, stack and details), `status()`, nor mounted `/status` and
 *   `/config` — while the refusal keeps its code, reason and URL. The committed control runs the oracle over the same
 *   refusal shown without the configuration's redaction (as before the fix): it finds the credential.
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
  it.each(L63_CASES)("%s: invalid-configuration, %s", async (name, reason) => {
    // The oracle (`./module-list-cases.ts`): refused with the reason, naming the URL, ended by itself.
    expect(await moduleListProblems(name, reason)).toEqual([]);
  }, 60_000);

  it("a configuration file's export is optional, unlike modulesFrom's: the same missing export reads as no modules", async () => {
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

/** A credential the tests' configurations hold, and the text that would show it. [CF-4] */
const CREDENTIAL = "s3cr3t-cf2-credential";

/** A PostgreSQL database's parts holding {@link CREDENTIAL} as its password: never contacted (refused before). */
const SECRET_DATABASE = Object.freeze({
  kind: "postgres",
  host: "127.0.0.1",
  port: 9,
  user: "umbradb",
  password: CREDENTIAL,
  name: "never-opened",
  ssl: "disable",
}) as unknown as DatabaseParts;

/** The configuration data with {@link CREDENTIAL} in `database.password` and in the node URL, `modules`' entries. */
const secretData = (modules: Parameters<typeof libraryData>[1] = []) =>
  libraryData(SECRET_DATABASE, modules, { node: `wss://node-user:${CREDENTIAL}@node.invalid/` });

/** What a refused start showed, everywhere a host reads it. */
interface Shown {
  readonly code: string;
  readonly reason: unknown;
  readonly places: Readonly<Record<string, string>>;
}

/** Starts UmbraDB with `options`, its admin mounted and its log kept, until it ended refused; what it showed. */
async function shownBy(options: Omit<UmbraDBOptions, "log">): Promise<Shown> {
  const lines: string[] = [];
  const handle = startUmbraDB({ ...options, log: (line) => lines.push(line) } as UmbraDBOptions);
  const host = await mountHandlers(handle);
  try {
    const error = (await handle.started.then(
      () => {
        throw new Error("startup completed");
      },
      (caught: unknown) => caught,
    )) as { code: string; message: string; stack?: string; details: Record<string, unknown> };
    await closedByItself(handle);
    const json = (value: unknown) => JSON.stringify(value, (_key, inner: unknown) => (typeof inner === "bigint" ? String(inner) : inner));
    const ended = (await handle.ended) as { error?: { message?: string } };
    return {
      code: error.code,
      reason: error.details.reason,
      places: {
        log: lines.join("\n"),
        "started's message": error.message,
        "started's stack": error.stack ?? "",
        "started's details": json(error.details),
        "status()": json(handle.status()),
        "ended's error": ended.error?.message ?? "",
        "mounted /status": (await exchange(host.admin, "GET", "/status")).text,
        "mounted /config": (await exchange(host.admin, "GET", "/config")).text,
      },
    };
  } finally {
    await handle.stop();
    await host.close();
  }
}

/** The places {@link CREDENTIAL} appears in, in any form a redaction knows (as written, URL-encoded). */
const leaks = (shown: Pick<Shown, "places">): string[] =>
  Object.entries(shown.places)
    .filter(([, text]) => text.includes(CREDENTIAL) || text.includes(encodeURIComponent(CREDENTIAL)))
    .map(([place]) => place);

describe("CF-4: a refusal before the configuration is validated shows no credential the configuration holds (AE-6)", () => {
  it("a modulesFrom whose import throws an error naming it: load-failed, naming the URL, the credential nowhere", async () => {
    const url = new URL("modules-throws-secret.ts", FIXTURES);
    const shown = await shownBy({ config: { data: secretData() }, modulesFrom: url });
    expect([shown.code, shown.reason]).toEqual(["invalid-configuration", "load-failed"]);
    expect(shown.places["started's message"]).toContain(url.href);
    expect(leaks(shown)).toEqual([]);
  }, 60_000);

  it("a user module's own refusal whose text holds it (a declaration naming it): the credential nowhere", async () => {
    const named = rowsModule("named", undefined, { version: CREDENTIAL } as never);
    const shown = await shownBy({ config: { data: secretData([named]) }, modules: [named] });
    expect(shown.code).toBe("invalid-declaration");
    expect(leaks(shown)).toEqual([]);
  }, 60_000);

  it("a user module whose declaration throws an error naming it when read: the credential nowhere", async () => {
    const declaration = Object.defineProperty({ ...rowsModule("reads") }, "migrations", {
      enumerable: true,
      get: () => {
        throw new Error(`a migration could not be read with ${CREDENTIAL}`);
      },
    });
    const shown = await shownBy({ config: { data: secretData([declaration]) }, modules: [declaration] });
    expect(leaks(shown)).toEqual([]);
  }, 60_000);

  it("a { file } whose modules export is no list, in a directory whose name holds it: modules-not-a-list, the credential nowhere", async () => {
    const dir = mkdtempSync(join(tmpdir(), `umbradb-${CREDENTIAL}-`));
    try {
      const file = join(dir, "umbradb.config.ts");
      writeFileSync(file, `export default ${JSON.stringify(secretData())};\nexport const modules = "no list";\n`);
      const shown = await shownBy({ config: { file }, cwd: dir });
      expect([shown.code, shown.reason]).toEqual(["invalid-configuration", "modules-not-a-list"]);
      expect(leaks(shown)).toEqual([]);
    } finally {
      rmSync(dir, { recursive: true, force: true });
    }
  }, 60_000);

  it("negative control (committed): the same refusal shown without the configuration's redaction, as before, is found by the oracle", async () => {
    const url = new URL("modules-throws-secret.ts", FIXTURES);
    const error = await loadModuleList(url).then(
      () => {
        throw new Error("the module file loaded");
      },
      (caught: Error) => caught,
    );
    const unredacted = { places: { log: configurationRefusalLines(error, (text) => text).join("\n"), "started's message": error.message } };
    expect(leaks(unredacted)).toEqual(["log", "started's message"]);
  }, 60_000);
});

/**
 * What a refused start shows in UmbraDB's own words, never a value of the host's: the code, the reason, the findings'
 * rules and paths, the network problems' fields, the log's header and each finding line's code, and the reason mounted
 * `/status` shows. [CF-4, L63, LM-9]
 */
interface OwnWords {
  readonly code: unknown;
  readonly reason: unknown;
  readonly findings: readonly string[];
  readonly problems: readonly string[];
  readonly header: string | undefined;
  readonly lineCodes: readonly (string | null)[];
  readonly status: unknown;
}

/** A refused start of `options`: its {@link OwnWords}, and the texts it showed (`started`'s message, the log). */
async function ownWordsOf(options: Omit<UmbraDBOptions, "log">): Promise<{ readonly words: OwnWords; readonly texts: string }> {
  const lines: string[] = [];
  const handle = startUmbraDB({ ...options, log: (line) => lines.push(line) } as UmbraDBOptions);
  const host = await mountHandlers(handle);
  try {
    const error = (await handle.started.then(
      () => {
        throw new Error("startup completed");
      },
      (caught: unknown) => caught,
    )) as { code: string; message: string; details: Record<string, unknown> };
    await closedByItself(handle);
    const findings = (error.details.findings ?? []) as readonly { rule: string; path: string }[];
    const problems = (error.details.problems ?? []) as readonly Record<string, unknown>[];
    const status = JSON.parse((await exchange(host.admin, "GET", "/status")).text) as { reason?: unknown };
    return {
      words: {
        code: error.code,
        reason: error.details.reason,
        findings: findings.map((found) => `${found.rule} at ${found.path}`),
        problems: problems.map((one) => [one.code, one.reason, one.surface, one.request, one.setting].map(String).join(" ")),
        header: lines[0],
        // A finding line ends with its code in brackets, after its message: `… [invalid-configuration load-failed]`.
        lineCodes: lines.slice(1).map((line) => /\[([a-z][a-z0-9-]*(?: [a-z][a-z0-9-]*)?)\]$/.exec(line)?.[1] ?? null),
        status: status.reason,
      },
      texts: [error.message, ...lines].join("\n"),
    };
  } finally {
    await handle.stop();
    await host.close();
  }
}

/** The configuration data of {@link ownWordsOf}'s starts: `password` as `database.password`, `extra` in `core`. */
const dataWith = (password: string, extra: Readonly<Record<string, unknown>> = {}) =>
  libraryData({ ...SECRET_DATABASE, password } as unknown as DatabaseParts, [], extra);

describe("CF-4: a secret whose text is one of a refusal's own words leaves those words as they are (L63, LM-9)", () => {
  let dir: string;
  beforeAll(() => {
    dir = mkdtempSync(join(tmpdir(), "umbradb-library-own-words-"));
  });
  afterAll(() => rmSync(dir, { recursive: true, force: true }));

  /** A module file whose import throws an error quoting `password`, as a host's store would. */
  const throwing = (password: string): URL => {
    const file = join(dir, `throws-${password}.mjs`);
    writeFileSync(file, `throw new Error(${JSON.stringify(`the store refused ${password}`)});\n`);
    return pathToFileURL(file);
  };

  /** Each refusal, the password equal to one of its own words, and the options that make it. */
  const CASES: readonly (readonly [string, string, (password: string) => Omit<UmbraDBOptions, "log">])[] = [
    ["a modulesFrom that cannot be imported (L63)", "load-failed", (password) => ({ config: { data: dataWith(password) }, modulesFrom: throwing(password) })],
    [
      "the validation's finding",
      "settings-schema",
      (password) => ({ config: { data: dataWith(password, { livenessTimeoutMs: "30s" }) } }),
    ],
    [
      "the network plan's refusal",
      "wrong-side",
      (password) => ({ config: { data: dataWith(password) }, network: { privateLink: { privateSide: true } } }),
    ],
  ];

  it.each(CASES)("%s, with the password %s: its own words are those of the same refusal with another password", async (_name, password, options) => {
    const innocent = await ownWordsOf(options("an-innocent-password"));
    const secret = await ownWordsOf(options(password));
    // The oracle is the same refusal with a password that is none of its words: what it shows of them is the truth.
    expect(innocent.words.lineCodes.every((code) => code !== null)).toBe(true);
    expect(JSON.stringify(innocent.words)).toContain(password);
    expect(secret.words).toEqual(innocent.words);
    // The host's own text holding the password is still redacted.
    expect(secret.texts).not.toContain(`the store refused ${password}`);
  }, 60_000);
});
