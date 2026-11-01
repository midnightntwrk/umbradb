import { subscribe, unsubscribe } from "node:diagnostics_channel";
import { EventEmitter, getEventListeners } from "node:events";
import { existsSync, mkdirSync, mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { startAdminServer } from "../../src/admin/server.js";
import { CORE_BLOCK_PARSED } from "../../src/backbone/core-block-parsed/core-block-parsed.js";
import { CORE_CHAIN_EVENTS } from "../../src/backbone/core-chain-events/core-chain-events.js";
import { runProcess } from "../../src/cli/run.js";
import type { DatabaseParts } from "../../src/config/database-parts.js";
import { startUmbraDB, type UmbraDBHandle } from "../../src/library/start-umbradb.js";
import { InMemoryBlockSource } from "../../src/runner/in-memory-source.js";
import { type CloseHelper, closeSteps } from "../../src/runner/process.js";
import { BACKUP_BACKENDS, type BackupBackend } from "../backup/backup-fixtures.js";
import { PROCESS_BACKENDS, type ProcessBackend } from "../runner/process-backends.js";
import { startProcess, startWithoutAdmin } from "../runner/process-build.js";
import { cursorReaches, libraryData, PGLITE_MEMORY, rowsModule } from "./library-fixtures.js";
import { runQuietChild } from "./quiet-child.js";

/**
 * The library's guarantees (design §7.1, G1–G10): what `startUmbraDB` does not do to its host program. [LM-1, LM-2,
 * LM-9]
 *
 * - L1, L2, L8 `[CI][NEG]` in a host process of their own (`./quiet-host.child.ts`): start → blocks → `backup()` →
 *   `stop()`, a start refused at its configuration and one refused after its database opened, a failed SQL statement
 *   and a halt — on PGlite in memory, on a PGlite directory (its `node:sqlite` import) and on PostgreSQL — add no
 *   `process` listener for any event, write nothing to stdout or stderr, and leave `process.exitCode` as it was; each
 *   negative control gives the engine one of the command's ports and fails its criterion.
 * - L5: no child process starts without `backup()`; `backup()` on PostgreSQL spawns exactly `pg_dump --version` and
 *   `pg_dump` (Node.js's `child_process` diagnostics channel), and on PGlite none.
 * - L6 `[NEG]`: no listening socket exists without a request (no `TCPServerWrap` among the process's resources, no
 *   thread that could listen); the control is the command's network with `listen.api` written.
 * - L7 `[NEG]`: a `umbradb.config.ts` in `cwd` is not read; the control is `umbradb run`, which reads it.
 * - L9 `[FAULT][NEG]`: a close step that fails is logged, the later ones run, `closed` resolves, no rejection is
 *   unhandled — in `stop()`'s close, startup's refusal cleanup and a configuration refusal's end; the control's
 *   closer stops at the first failure.
 * - L10, L11: relative paths resolve against `cwd`, or `process.cwd()` without it.
 * - L12: no ledger worker without the ledger, no admin thread without a listening admin (the `worker_threads`
 *   diagnostics channel, which sees the ledger worker and the admin worker when they start).
 * - L14: aborting `signal` stops like `stop()`, during startup and while processing.
 * - A handle's listener on the host's `signal` is removed once `closed` resolves, whichever way the process ended — a
 *   stop, a class-A refusal, a stop during startup, a class-B refusal then a stop — so that repeated starts under one
 *   long-lived signal leave its listener count where it started, on PostgreSQL, a PGlite directory and in memory.
 * - L47 `[NEG]`: `library-setting-refused` for `backupAtStop` and `backupOnSignal`; the control is the engine without
 *   the library's check, which starts.
 */

/** What `./quiet-host.child.ts` writes to its result file. */
interface QuietResult {
  readonly before: Readonly<Record<string, number>>;
  readonly during: Readonly<Record<string, number>>;
  readonly after: Readonly<Record<string, number>>;
  readonly exitCode: { readonly before: number | null; readonly after: number | null };
  readonly outcomes: readonly { readonly state: string; readonly code: string | null; readonly note: string }[];
}

/**
 * The quiet host's oracle: every problem with a child's run, none when it wrote nothing, every event's listener count
 * stayed as it was before (while the first run ran and after all), and `process.exitCode` did too. [L1, L2, L8]
 */
function quietProblems(run: { stdout: string; stderr: string; code: number | null; result: QuietResult | null }): string[] {
  const problems: string[] = [];
  if (run.code !== 0) problems.push(`the host exited ${run.code}`);
  if (run.stdout !== "") problems.push(`stdout: ${run.stdout.trim().split("\n")[0]}`);
  if (run.stderr !== "") problems.push(`stderr: ${run.stderr.trim().split("\n")[0]}`);
  const result = run.result;
  if (result === null) return [...problems, "no result"];
  for (const [when, counts] of [
    ["while it runs", result.during],
    ["after", result.after],
  ] as const) {
    for (const event of new Set([...Object.keys(result.before), ...Object.keys(counts)])) {
      const was = result.before[event] ?? 0;
      const now = counts[event] ?? 0;
      if (now !== was) problems.push(`${when}: ${now - was} ${event} listener(s) added`);
    }
  }
  if (result.exitCode.after !== result.exitCode.before) {
    problems.push(`process.exitCode ${result.exitCode.before} → ${result.exitCode.after}`);
  }
  return problems;
}

/** The runs' outcomes as the quiet host's runs must end them (see `./quiet-host.child.ts`). */
const QUIET_OUTCOMES = [
  { state: "stopping", code: null, note: "backup at 5" },
  { state: "refused", code: "invalid-configuration", note: "" },
  { state: "stopping", code: "migration-failed", note: "" },
  // The failed statement's own code, a listed halt (`database-error`); the thrown error's, `callback-error`.
  { state: "stopping", code: "database-error", note: "" },
  { state: "stopping", code: "callback-error", note: "" },
];

describe("L1, L2, L8: a quiet host (LM-2)", () => {
  let tmp: string;
  const postgres = BACKUP_BACKENDS[0] as BackupBackend;
  beforeAll(async () => {
    tmp = mkdtempSync(join(tmpdir(), "umbradb-quiet-host-"));
    await postgres.start();
  }, 300_000);
  afterAll(async () => {
    await postgres.stop();
    rmSync(tmp, { recursive: true, force: true });
  }, 120_000);

  /** A directory of its own for one child. */
  const dirOf = (name: string): string => {
    const dir = join(tmp, name);
    mkdirSync(dir);
    return dir;
  };

  it("on PGlite in memory: no listener, no output, no exit status", async () => {
    const run = await runQuietChild<QuietResult>("./quiet-host.child.ts", {
      mode: "quiet",
      databases: Array.from({ length: 5 }, () => PGLITE_MEMORY),
      dir: dirOf("memory"),
    });
    expect(quietProblems(run)).toEqual([]);
    expect(run.result?.outcomes).toEqual(QUIET_OUTCOMES);
  }, 300_000);

  it("on a PGlite directory, its first opening importing node:sqlite: no listener, no output, no exit status", async () => {
    const dir = dirOf("directory");
    const run = await runQuietChild<QuietResult>("./quiet-host.child.ts", {
      mode: "quiet",
      databases: ["run", "early", "late", "sql", "halt"].map((name) => ({ kind: "pglite", path: join(dir, name) })),
      dir,
    });
    expect(quietProblems(run)).toEqual([]);
    expect(run.result?.outcomes).toEqual(QUIET_OUTCOMES);
  }, 300_000);

  it("on PostgreSQL, the backup through pg_dump: no listener, no output, no exit status", async () => {
    const databases: DatabaseParts[] = [];
    for (let index = 0; index < 5; index++) databases.push((await postgres.database()).setting);
    const run = await runQuietChild<QuietResult>(
      "./quiet-host.child.ts",
      { mode: "quiet", databases, dir: dirOf("postgres") },
      postgres.env(),
    );
    expect(quietProblems(run)).toEqual([]);
    expect(run.result?.outcomes).toEqual(QUIET_OUTCOMES);
  }, 300_000);

  it("negative control (L1): the command's SIGUSR2 port with backupOnSignal fails it, a listener while it runs", async () => {
    const run = await runQuietChild<QuietResult>("./quiet-host.child.ts", {
      mode: "control-listener",
      databases: [PGLITE_MEMORY],
      dir: dirOf("control-listener"),
    });
    expect(quietProblems(run)).toEqual(["while it runs: 1 SIGUSR2 listener(s) added"]);
  }, 300_000);

  it("negative control (L2): the command's log on stderr fails it", async () => {
    const run = await runQuietChild<QuietResult>("./quiet-host.child.ts", {
      mode: "control-output",
      databases: [PGLITE_MEMORY],
      dir: dirOf("control-output"),
    });
    expect(quietProblems(run)).toEqual(["stderr: database: pglite in memory"]);
  }, 300_000);

  it("negative control (L8): a stop that sets process.exitCode fails it", async () => {
    const run = await runQuietChild<QuietResult>("./quiet-host.child.ts", {
      mode: "control-exit-code",
      databases: [PGLITE_MEMORY],
      dir: dirOf("control-exit-code"),
    });
    expect(quietProblems(run)).toEqual(["process.exitCode null → 3"]);
  }, 300_000);
});

/**
 * The arguments of every child process started while `body` runs (the `child_process` diagnostics channel, which
 * publishes each `ChildProcess` as it is made; its `spawnargs` are read once `body` ended).
 */
async function childrenDuring(body: () => Promise<void>): Promise<string[][]> {
  const spawned: { readonly spawnargs?: readonly string[] }[] = [];
  const listener = (message: unknown): void => {
    spawned.push((message as { process: { readonly spawnargs?: readonly string[] } }).process);
  };
  subscribe("child_process", listener);
  try {
    await body();
  } finally {
    unsubscribe("child_process", listener);
  }
  return spawned.map((child) => [...(child.spawnargs ?? [])]);
}

/** What starts worker threads while `body` runs (the `worker_threads` diagnostics channel): one entry per thread. */
async function threadsDuring(body: () => Promise<void>): Promise<number> {
  let threads = 0;
  const listener = (): void => {
    threads += 1;
  };
  subscribe("worker_threads", listener);
  try {
    await body();
  } finally {
    unsubscribe("worker_threads", listener);
  }
  return threads;
}

describe.each(BACKUP_BACKENDS)("L5: no child process without backup(); a backup's own, on $name", (backend: BackupBackend) => {
  let tmp: string;
  beforeAll(async () => {
    await backend.start();
    tmp = mkdtempSync(join(tmpdir(), "umbradb-library-children-"));
    if (backend.kind === "postgres") process.env.UMBRADB_PG_DUMP = backend.env().UMBRADB_PG_DUMP;
  }, 300_000);
  afterAll(async () => {
    delete process.env.UMBRADB_PG_DUMP;
    rmSync(tmp, { recursive: true, force: true });
    await backend.stop();
  }, 120_000);

  it("start → blocks → stop spawns nothing; backup() spawns pg_dump --version then pg_dump on PostgreSQL, nothing on PGlite", async () => {
    const db = await backend.database();
    const m = rowsModule("m");
    let handle: UmbraDBHandle | undefined;
    const running = await childrenDuring(async () => {
      handle = startUmbraDB({ config: { data: libraryData(db.setting, [m]) }, modules: [m], source: new InMemoryBlockSource({ head: 4n }) });
      await handle.started;
      await cursorReaches(handle, 4n);
    });
    expect(running).toEqual([]);
    const backup = await childrenDuring(async () => {
      await (handle as UmbraDBHandle).backup(join(tmp, `${backend.kind}.backup`));
    });
    const stopping = await childrenDuring(() => (handle as UmbraDBHandle).stop());
    expect(stopping).toEqual([]);
    if (backend.kind === "postgres") {
      const tool = process.env.UMBRADB_PG_DUMP as string;
      expect(backup.map((args) => args[0])).toEqual([tool, tool]);
      expect(backup[0]?.slice(1)).toEqual(["--version"]);
      expect(backup[1]?.slice(1)).not.toContain("--version");
    } else {
      expect(backup).toEqual([]);
    }
    expect(existsSync(join(tmp, `${backend.kind}.backup`))).toBe(true);
  }, 300_000);
});

/** The process's own listening sockets now: Node.js's `TCPServerWrap` resources. */
const listeningSockets = (): number => process.getActiveResourcesInfo().filter((resource) => resource === "TCPServerWrap").length;

describe.each([
  ...PROCESS_BACKENDS.map((backend) => [backend.name, backend] as const),
  ["PGlite in memory", null] as const,
])("L6, L12: no listening socket, no thread but the ledger's when it needs one, on %s", (_name, backend) => {
  beforeAll(() => backend?.start(), 180_000);
  afterAll(() => backend?.stop(), 60_000);
  const database = async (): Promise<DatabaseParts> => (backend === null ? PGLITE_MEMORY : (await backend.database()).setting);

  it("without a request: no listener and no thread while it starts, runs and stops; with the ledger, its worker only", async () => {
    const m = rowsModule("m");
    const sockets = listeningSockets();
    let during = -1;
    const plain = await threadsDuring(async () => {
      const handle = startUmbraDB({ config: { data: libraryData(await database(), [m]) }, modules: [m], source: new InMemoryBlockSource({ head: 3n }) });
      await handle.started;
      await cursorReaches(handle, 3n);
      during = listeningSockets();
      await handle.stop();
    });
    expect({ plain, during }).toEqual({ plain: 0, during: sockets });
    // With core-block-parsed the build needs the ledger: its worker starts, and no other thread.
    const parsed = [CORE_CHAIN_EVENTS, CORE_BLOCK_PARSED].map((part) => ({ id: part.id, start: 1, version: part.version, config: {} }));
    const ledger = await threadsDuring(async () => {
      const data = libraryData(await database());
      const handle = startUmbraDB({ config: { data: { entries: [...data.entries, ...parsed] } }, source: new InMemoryBlockSource({ head: 3n }) });
      await handle.started;
      await cursorReaches(handle, 3n);
      during = listeningSockets();
      await handle.stop();
    });
    expect({ ledger, during }).toEqual({ ledger: 1, during: sockets });
  }, 300_000);

  it("negative control: the command's network with listen.api written listens, and its admin port starts its thread", async () => {
    const sockets = listeningSockets();
    let during = -1;
    const threads = await threadsDuring(async () => {
      const handle = startProcess({
        config: { data: libraryData(await database(), [], { listen: { api: "127.0.0.1:0", admin: "127.0.0.1:0" } }) },
        userModules: { modules: [] },
        adminListener: startAdminServer,
        source: new InMemoryBlockSource({ head: 1n }),
      });
      await handle.started;
      during = listeningSockets();
      await handle.stop();
    });
    expect({ threads, listening: during - sockets }).toEqual({ threads: 1, listening: 1 });
  }, 120_000);
});

describe("L7: no configuration file is looked for or read but config.file (CF-1)", () => {
  let cwd: string;
  beforeAll(() => {
    cwd = mkdtempSync(join(tmpdir(), "umbradb-library-l7-"));
    // Importing it leaves a mark: a file that is read leaves `read.mark` beside it, then refuses.
    writeFileSync(
      join(cwd, "umbradb.config.ts"),
      'import { writeFileSync } from "node:fs";\nwriteFileSync(new URL("./read.mark", import.meta.url), "read");\nexport default 7;\n',
    );
  });
  afterAll(() => rmSync(cwd, { recursive: true, force: true }));

  it("startUmbraDB with { data } and cwd holding a umbradb.config.ts never reads it", async () => {
    const handle = startUmbraDB({ config: { data: libraryData(PGLITE_MEMORY) }, cwd, source: new InMemoryBlockSource({ head: 1n }) });
    await handle.started;
    await handle.stop();
    expect(existsSync(join(cwd, "read.mark"))).toBe(false);
  }, 60_000);

  it("negative control: umbradb run in that directory reads it", async () => {
    const end = await runProcess(
      { cwd, log: () => undefined },
      { signals: new EventEmitter(), backupSignals: new EventEmitter(), start: startWithoutAdmin },
    );
    expect(end).toMatchObject({ kind: "refused" });
    expect(existsSync(join(cwd, "read.mark"))).toBe(true);
  }, 60_000);
});

/** A closer that stops at the first step that fails, logging it: the negative control's. [L9] */
const stopsAtFirstFailure: CloseHelper = async (steps, log) => {
  for (const [name, work] of steps) {
    try {
      await work();
    } catch (error) {
      log(`close: ${name} failed: ${String(error)}`);
      return;
    }
  }
};

/** What one faulted close showed: the steps that ran, the log, how `started` settled, whether `closed` resolved. */
interface FaultedClose {
  readonly steps: readonly string[];
  readonly lines: readonly string[];
  readonly started: string;
  readonly closed: boolean;
}

/**
 * Runs one close with a fault at `step` (see L9 in the module comment): `kind` is `"stop"` (a process that started,
 * then stopped), `"refusal"` (a startup refused after its database opened: a migration that fails) or `"configuration"`
 * (a configuration refused at its validation, with the admin port given, so its end closes admin). `helper` is the
 * negative control's closer, when given.
 */
async function faultedClose(kind: "stop" | "refusal" | "configuration", step: string, helper?: CloseHelper): Promise<FaultedClose> {
  const steps: string[] = [];
  const lines: string[] = [];
  const broken = rowsModule("broken", undefined, { migrations: [{ id: "001", sql: "CREATE TABLE broken.rows (" }] });
  const extra = kind === "configuration" ? { livenessTimeoutMs: "thirty seconds" } : {};
  const modules = kind === "refusal" ? [broken] : [];
  const handle = startProcess({
    config: { data: libraryData(PGLITE_MEMORY, modules, extra) },
    userModules: { modules },
    network: {},
    source: new InMemoryBlockSource({ head: 2n }),
    log: (line) => lines.push(line),
    ...(kind === "configuration" ? { adminListener: startAdminServer } : {}),
    closeFault: (name) => {
      steps.push(name);
      if (name === step) throw new Error(`the ${name} step fails here`);
    },
    ...(helper === undefined ? {} : { closeHelper: helper }),
  });
  const started = await handle.started.then(
    () => "started",
    (error: { code?: string }) => `refused ${error.code}`,
  );
  if (kind === "stop") await handle.stop();
  else if (kind === "refusal") await handle.stop();
  let timer: NodeJS.Timeout | undefined;
  const closed = await Promise.race([
    handle.closed.then(() => true),
    new Promise<boolean>((resolve) => {
      timer = setTimeout(() => resolve(false), 10_000);
    }),
  ]);
  clearTimeout(timer);
  return { steps, lines, started, closed };
}

describe("L9: every close step runs, a failure logged, closed resolved, nothing unhandled (G7)", () => {
  const unhandled: unknown[] = [];
  const record = (reason: unknown): void => {
    unhandled.push(reason);
  };
  beforeAll(() => {
    process.on("unhandledRejection", record);
  });
  afterAll(() => {
    process.off("unhandledRejection", record);
  });

  it("stop()'s close: the node client's step fails, the database, the block source and admin still close", async () => {
    const run = await faultedClose("stop", "node client");
    expect(run.started).toBe("started");
    expect(run.steps).toEqual([
      "module API",
      "the stop's waits",
      "core transport",
      "transport reader",
      "node client",
      "ledger worker",
      "backup on signal",
      "database",
      "block source",
      "admin",
      "SIGUSR2 listener",
    ]);
    expect(run.lines).toContain("close: node client failed (error): the node client step fails here");
    expect(run.closed).toBe(true);
  }, 60_000);

  it("startup's refusal cleanup: the transport's step fails, the database still closes, the refusal stays the one thrown", async () => {
    const run = await faultedClose("refusal", "core transport");
    expect(run.started).toBe("refused migration-failed");
    expect(run.steps.slice(0, 6)).toEqual(["core transport", "transport reader", "node client", "ledger worker", "database", "block source"]);
    expect(run.lines).toContain("close: core transport failed (error): the core transport step fails here");
    expect(run.closed).toBe(true);
  }, 60_000);

  it("a configuration refusal's end: admin's step fails, closed still resolves", async () => {
    const run = await faultedClose("configuration", "admin");
    expect(run.started).toBe("refused invalid-configuration");
    // Startup's cleanup (nothing was opened), then the end's own step.
    expect(run.steps).toEqual(["core transport", "transport reader", "node client", "ledger worker", "database", "block source", "admin"]);
    expect(run.lines).toContain("close: admin failed (error): the admin step fails here");
    expect(run.closed).toBe(true);
  }, 60_000);

  it("closeSteps itself: a step that throws synchronously or rejects is logged with its code, and the rest run", async () => {
    const lines: string[] = [];
    const ran: string[] = [];
    const { UmbraError } = await import("../../src/db/errors.js");
    await closeSteps(
      [
        ["first", () => ran.push("first")],
        ["throws", () => {
          throw new UmbraError("handle-closed", "the handle was closed", {});
        }],
        ["rejects", () => Promise.reject(new Error("rejected"))],
        ["last", () => ran.push("last")],
      ],
      (line) => lines.push(line),
    );
    expect(ran).toEqual(["first", "last"]);
    expect(lines).toEqual(["close: throws failed (handle-closed): the handle was closed", "close: rejects failed (error): rejected"]);
  });

  it("no rejection was unhandled in these closes", () => {
    expect(unhandled).toEqual([]);
  });

  it("negative control: a closer that stops at the first failure fails it — the later steps never run", async () => {
    const run = await faultedClose("stop", "node client", stopsAtFirstFailure);
    expect(run.steps).toEqual(["module API", "the stop's waits", "core transport", "transport reader", "node client"]);
    // The refusal's cleanup stops at its first step; the later stop()'s close stops at the same step.
    const refused = await faultedClose("refusal", "core transport", stopsAtFirstFailure);
    expect(refused.steps).toEqual(["core transport", "module API", "the stop's waits", "core transport"]);
  }, 60_000);
});

describe.each([
  ...BACKUP_BACKENDS.map((backend) => [backend.name, backend] as const),
  ["PGlite in memory", null] as const,
])("L10, L11: relative paths resolve against cwd, or process.cwd() without it, on %s", (_name, backend) => {
  let base: string;
  beforeAll(async () => {
    await backend?.start();
    if (backend?.kind === "postgres") process.env.UMBRADB_PG_DUMP = backend.env().UMBRADB_PG_DUMP;
    base = mkdtempSync(join(tmpdir(), "umbradb-library-cwd-"));
  }, 300_000);
  afterAll(async () => {
    delete process.env.UMBRADB_PG_DUMP;
    rmSync(base, { recursive: true, force: true });
    await backend?.stop();
  }, 120_000);
  const database = async (relative: string): Promise<DatabaseParts> =>
    backend === null ? PGLITE_MEMORY : backend.kind === "pglite" ? { kind: "pglite", path: relative } : (await backend.database()).setting;

  it("L10: with cwd ≠ process.cwd(), a { file }, a { data } PGlite path and a backup's target resolve against cwd", async () => {
    const cwd = join(base, "given");
    mkdirSync(join(cwd, "conf"), { recursive: true });
    const setting = await database("data/db");
    writeFileSync(join(cwd, "conf", "library.config.ts"), `export default ${JSON.stringify(libraryData(setting))};\n`);
    expect(cwd).not.toBe(process.cwd());
    mkdirSync(join(cwd, "out"));
    const fromFile = startUmbraDB({ config: { file: "conf/library.config.ts" }, cwd, source: new InMemoryBlockSource({ head: 2n }) });
    await fromFile.started;
    await cursorReaches(fromFile, 2n);
    const first = await fromFile.backup("out/first.backup");
    await fromFile.stop();
    expect(first.file).toBe(join(cwd, "out", "first.backup"));
    const fromData = startUmbraDB({ config: { data: libraryData(setting) }, cwd, source: new InMemoryBlockSource({ head: 3n }) });
    await fromData.started;
    await cursorReaches(fromData, 3n);
    const backup = await fromData.backup("out/second.backup");
    await fromData.stop();
    expect(backup.file).toBe(join(cwd, "out", "second.backup"));
    expect(existsSync(join(cwd, "out", "second.backup"))).toBe(true);
    if (setting.kind === "pglite" && "path" in setting) expect(existsSync(join(cwd, "data", "db"))).toBe(true);
    expect(existsSync(join(process.cwd(), "data", "db"))).toBe(false);
  }, 120_000);

  it("L11: without cwd, they resolve against process.cwd()", async () => {
    const here = join(base, "here");
    mkdirSync(here);
    const setting = await database("data/db");
    const before = process.cwd();
    process.chdir(here);
    try {
      const handle = startUmbraDB({ config: { data: libraryData(setting) }, source: new InMemoryBlockSource({ head: 2n }) });
      await handle.started;
      await cursorReaches(handle, 2n);
      const backup = await handle.backup("here.backup");
      await handle.stop();
      expect(backup.file).toBe(join(process.cwd(), "here.backup"));
      if (setting.kind === "pglite" && "path" in setting) expect(existsSync(join(process.cwd(), "data", "db"))).toBe(true);
    } finally {
      process.chdir(before);
    }
  }, 120_000);
});

describe("L14: aborting signal stops like stop() (LM-9, RN-13)", () => {
  const unhandled: unknown[] = [];
  const record = (reason: unknown): void => {
    unhandled.push(reason);
  };
  beforeAll(() => {
    process.on("unhandledRejection", record);
  });
  afterAll(() => {
    process.off("unhandledRejection", record);
  });

  it("while processing: stopping, ended by the signal, closed resolved; no handler on started is needed", async () => {
    const controller = new AbortController();
    const handle = startUmbraDB({ config: { data: libraryData(PGLITE_MEMORY) }, signal: controller.signal, source: new InMemoryBlockSource({ head: 3n }) });
    await cursorReaches(handle, 3n);
    controller.abort();
    await handle.closed;
    expect(handle.status().state).toBe("stopping");
    expect(await handle.ended).toEqual({ kind: "signal" });
  }, 60_000);

  it("during startup, and with a signal aborted before the call: closed resolves, started rejects, nothing unhandled", async () => {
    const controller = new AbortController();
    const starting = startUmbraDB({ config: { data: libraryData(PGLITE_MEMORY) }, signal: controller.signal, source: new InMemoryBlockSource({ head: 3n }) });
    controller.abort();
    await starting.closed;
    await expect(starting.started).rejects.toBeDefined();
    expect(await starting.ended).toEqual({ kind: "signal" });
    const aborted = AbortSignal.abort(new Error("the host is leaving"));
    const early = startUmbraDB({ config: { data: libraryData(PGLITE_MEMORY) }, signal: aborted });
    await early.closed;
    expect(early.status().state).toBe("stopping");
    // A turn for any rejection nobody handled to be reported.
    await new Promise((resolve) => setImmediate(resolve));
    expect(unhandled).toEqual([]);
  }, 60_000);
});

/** The `abort` listeners `signal` holds now. */
const abortListeners = (signal: AbortSignal): number => getEventListeners(signal, "abort").length;

describe.each([
  ...PROCESS_BACKENDS.map((backend) => [backend.name, backend] as const),
  ["PGlite in memory", null] as const,
])("a closed handle leaves no listener on the host's signal, on %s (LM-9, RN-13)", (_name, backend) => {
  beforeAll(() => backend?.start(), 180_000);
  afterAll(() => backend?.stop(), 60_000);
  const database = async (): Promise<DatabaseParts> => (backend === null ? PGLITE_MEMORY : (await backend.database()).setting);

  it("a stop, a class-A refusal, a stop during startup, a class-B refusal then a stop, twice each: the count is back where it started", async () => {
    const { signal } = new AbortController();
    const before = abortListeners(signal);
    const failing = rowsModule("failing", undefined, {
      points: {
        async "on-start-db"() {
          throw new Error("the module cannot start");
        },
      },
    });
    const seen: string[] = [];
    for (let round = 1; round <= 2; round++) {
      const served = startUmbraDB({ config: { data: libraryData(await database()) }, signal, source: new InMemoryBlockSource({ head: 2n }) });
      await cursorReaches(served, 2n);
      // While it runs, its listener is there: aborting the signal stops it.
      seen.push(`round ${round} serving: ${abortListeners(signal) - before}`);
      await served.stop();
      seen.push(`round ${round} stopped: ${abortListeners(signal) - before}`);

      const refused = startUmbraDB({ config: { data: { entries: [] } }, signal });
      await refused.closed;
      seen.push(`round ${round} refused (class A): ${abortListeners(signal) - before}`);

      const interrupted = startUmbraDB({ config: { data: libraryData(await database()) }, signal, source: new InMemoryBlockSource({ head: 2n }) });
      await interrupted.stop();
      seen.push(`round ${round} stopped during startup: ${abortListeners(signal) - before}`);

      const broken = startUmbraDB({
        config: { data: libraryData(await database(), [failing]) },
        modules: [failing],
        signal,
        source: new InMemoryBlockSource({ head: 2n }),
      });
      await expect(broken.started).rejects.toMatchObject({ code: "callback-error" });
      // Refused after its configuration step, it stays up until stop(): the signal still stops it.
      seen.push(`round ${round} refused (class B): ${abortListeners(signal) - before}`);
      await broken.stop();
      seen.push(`round ${round} refused (class B), stopped: ${abortListeners(signal) - before}`);
    }
    expect(seen).toEqual(
      [1, 2].flatMap((round) => [
        `round ${round} serving: 1`,
        `round ${round} stopped: 0`,
        `round ${round} refused (class A): 0`,
        `round ${round} stopped during startup: 0`,
        `round ${round} refused (class B): 1`,
        `round ${round} refused (class B), stopped: 0`,
      ]),
    );
  }, 180_000);
});

describe.each(PROCESS_BACKENDS)("L47: library-setting-refused (LM-2, BK-1) on $name", (backend: ProcessBackend) => {
  let tmp: string;
  beforeAll(async () => {
    await backend.start();
    tmp = mkdtempSync(join(tmpdir(), "umbradb-library-l47-"));
  }, 180_000);
  afterAll(async () => {
    rmSync(tmp, { recursive: true, force: true });
    await backend.stop();
  }, 60_000);

  it("backupAtStop, backupOnSignal and both are each refused library-setting-refused, naming the setting; nothing opened", async () => {
    for (const [extra, setting, settings] of [
      [{ backupAtStop: "stop.backup" }, "backupAtStop", ["backupAtStop"]],
      [{ backupOnSignal: "signal.backup" }, "backupOnSignal", ["backupOnSignal"]],
      [{ backupAtStop: "stop.backup", backupOnSignal: "signal.backup" }, "backupAtStop", ["backupAtStop", "backupOnSignal"]],
    ] as const) {
      const db = await backend.database();
      const handle = startUmbraDB({ config: { data: libraryData(db.setting, [], extra) }, source: new InMemoryBlockSource({ head: 1n }) });
      await expect(handle.started).rejects.toMatchObject({ code: "library-setting-refused", details: { setting, settings } });
      await handle.closed;
      expect(handle.status()).toMatchObject({ state: "refused", reason: { code: "library-setting-refused" } });
      if (db.directory !== undefined) expect(existsSync(db.directory)).toBe(false);
    }
  }, 60_000);

  it("negative control: the engine without the library's check starts the same configuration", async () => {
    const db = await backend.database();
    const handle = startProcess({
      config: { data: libraryData(db.setting, [], { backupAtStop: join(tmp, "stop.backup"), backupOnSignal: join(tmp, "signal.backup") }) },
      userModules: { modules: [] },
      network: {},
      source: new InMemoryBlockSource({ head: 1n }),
    });
    expect(await handle.started.then(() => "started", (error: { code?: string }) => error.code)).toBe("started");
    await handle.stop();
  }, 60_000);
});
