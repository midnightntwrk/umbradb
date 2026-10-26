import { existsSync } from "node:fs";
import { setTimeout as sleep } from "node:timers/promises";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { type AdminStarter, startAdminServer } from "../../src/admin/server.js";
import { openConfiguredDatabase } from "../../src/config/database.js";
import { processCoreEntry } from "../../src/config/process.js";
import { validateConfig } from "../../src/config/validate.js";
import type { ModuleDeclaration } from "../../src/modules/declaration.js";
import { type ProcessHandle, type ProcessInput, startProcess } from "../../src/runner/process.js";
import { PROCESS_BACKENDS, type ProcessBackend, type ProcessDatabase } from "../runner/process-backends.js";
import { entryOf, loggingModule, testBuild } from "../runner/process-build.js";
import { freePort } from "../runner/process-harness.js";
import {
  ADMIN_BACKBONE,
  adminCore,
  adminSource,
  type Answered,
  ask,
  ENDPOINTS,
  observe,
  OTHER_REQUESTS,
  routeProblems,
  stateProblems,
  statusWhen,
  within,
} from "./admin-harness.js";

/**
 * The admin endpoints by default (task 8.1a; owner decision Q128 B; AE-1, A62, A64): `startProcess` serves them on
 * `listen.admin` unless its caller passes `admin: false` — a process started without `admin`, as `umbradb run` will
 * start one, answers on its admin listener in every state it reaches, its four endpoints and 404 elsewhere —, and an
 * admin address another listener holds refuses startup with `listen-failed` before the database opens (the owner:
 * "check if free; or it does not start"): no session on PostgreSQL 18.6, no data directory on PGlite 0.5.10.
 */

/** How a test starts a process: the runner's `startProcess`, or a negative control's. */
type Start = (input: ProcessInput) => ProcessHandle;

/** A negative control: task 8.1's opt-in default (Q128's option A) — a process started without `admin` serves none. */
const optIn: Start = (input) => startProcess(input.admin === undefined ? { ...input, admin: false } : input);

/** The entries of a process of the tests on `database` with `listen.admin` at `address`, with `user`'s from 1. */
const entriesOf = (database: string, address: string, user: readonly ModuleDeclaration[] = []) => [
  adminCore(database, 1, { extra: { listen: { admin: address } } }),
  ...user.map((part) => entryOf(part, 1)),
];

/** A process of the tests' build (the admin endpoints' parts among its backbone, as the command's) started by `start`. */
function started(
  start: Start,
  database: string,
  address: string,
  rest: { readonly user?: readonly ModuleDeclaration[]; readonly admin?: AdminStarter } = {},
): { readonly handle: ProcessHandle; readonly lines: string[] } {
  const build = testBuild(rest.user ?? []);
  const lines: string[] = [];
  const handle = start({
    declarations: { ...build.declarations, backbone: [...build.declarations.backbone, ...ADMIN_BACKBONE] },
    config: { data: { entries: entriesOf(database, address, rest.user) } },
    source: adminSource(3n),
    log: (line) => lines.push(line),
    ...(rest.admin === undefined ? {} : { admin: rest.admin }),
  });
  return { handle, lines };
}

/** Waits until the process itself says it is `state` (its admin listener may not exist). */
async function stateOf(handle: ProcessHandle, state: string, patienceMs = 60_000): Promise<void> {
  const until = Date.now() + patienceMs;
  while (handle.status().state !== state) {
    if (Date.now() > until) throw new Error(`the process is ${handle.status().state}, not ${state}, after ${patienceMs} ms`);
    await sleep(25);
  }
}

/**
 * The 8.1a criterion "a process started without `admin` answers on its admin listener" over a process started by
 * `start` without `admin` on `database`, its `listen.admin` a free port: once the process says it is `following` at
 * the head, A64's oracle over its four endpoints — live 200, ready 200, `/status` `following`, `/config` 200 —; none
 * when it answers.
 */
async function defaultProblems(start: Start, database: string): Promise<string[]> {
  const port = await freePort();
  const run = started(start, database, `127.0.0.1:${port}`);
  try {
    await run.handle.started;
    await stateOf(run.handle, "following");
    // The admin worker publishes the state a heartbeat after the handle has it: wait for /status to say so, then judge
    // every endpoint. A process with no admin listener (the negative control) never answers, which the check reports.
    await statusWhen(`http://127.0.0.1:${port}`, (body) => body.state === "following", 10_000).catch(() => undefined);
    return stateProblems(await observe(`http://127.0.0.1:${port}`), { state: "following", ready: true, reason: null });
  } finally {
    await run.handle.stop();
  }
}

/** On PostgreSQL, the sessions `db`'s database has had (`total`) and has (`now`), read from `observer`'s. */
async function sessionsOf(observer: ProcessDatabase, db: ProcessDatabase): Promise<{ total: number; now: number }> {
  const name = new URL(db.setting).pathname.slice(1);
  const [row] = await observer.query(
    `SELECT sessions::int AS total, numbackends::int AS now FROM pg_stat_database WHERE datname = '${name}'`,
  );
  return { total: Number(row?.total), now: Number(row?.now) };
}

/**
 * The 8.1a criterion "a second process given the same admin address refuses with `listen-failed` and opens no database
 * session" on `backend`: a first process started without `admin` listens on a free port's address; a second, started
 * by `start` (with `admin` when given) on a database of its own and the same address, must refuse startup with
 * `listen-failed` (Node.js's `EADDRINUSE` on `listen`) and stay refused until stopped, while the first still answers;
 * and its database must have no session — PostgreSQL's cumulative session count of that database unchanged, read
 * from another database's connection once its sessions ended — or, on PGlite, no data directory. None when so.
 */
async function takenProblems(backend: ProcessBackend, start: Start, admin?: (database: string) => AdminStarter): Promise<string[]> {
  const problems: string[] = [];
  const address = `127.0.0.1:${await freePort()}`;
  const firstDb = await backend.database();
  const first = started(startProcess, firstDb.setting, address);
  const secondDb = await backend.database();
  try {
    await first.handle.started;
    const before = backend.kind === "postgres" ? await sessionsOf(firstDb, secondDb) : null;
    const second = started(start, secondDb.setting, address, admin === undefined ? {} : { admin: admin(secondDb.setting) });
    const outcome = await second.handle.started.then(
      () => "started",
      (error: NodeJS.ErrnoException) => `${error.code} on ${error.syscall}`,
    );
    if (outcome !== "EADDRINUSE on listen") problems.push(`second: ${outcome}`);
    else {
      await second.handle.ended;
      const status = second.handle.status();
      if (status.state !== "refused" || status.reason?.code !== "listen-failed") {
        problems.push(`second: ${status.state} (${status.reason?.code ?? "no reason"})`);
      }
      if (await within(second.handle.closed, 300)) problems.push("second: closed by itself");
    }
    await second.handle.stop();
    if (before !== null) {
      let after = await sessionsOf(firstDb, secondDb);
      for (let waited = 0; after.now > before.now && waited < 30_000; waited += 50) {
        await sleep(50);
        after = await sessionsOf(firstDb, secondDb);
      }
      if (after.total !== before.total) problems.push(`second: ${after.total - before.total} session(s) on its database`);
    } else if (secondDb.directory !== undefined && existsSync(secondDb.directory)) {
      problems.push("second: its database directory exists");
    }
    const live: Answered = await ask(`http://${address}`, "/health/live");
    if (live.status !== 200) problems.push(`first: /health/live answered ${live.status ?? live.error}`);
  } finally {
    await first.handle.stop();
  }
  return problems;
}

/**
 * A negative control's admin starter: the process's database — as its `core` revision names it, opened by
 * `openConfiguredDatabase` as the process opens it — read once before the admin listener listens, so that a session
 * (PostgreSQL) or the data directory (PGlite) exists when the listen fails; the database closed after.
 */
const databaseFirst =
  (database: string): AdminStarter =>
  async (options) => {
    const checked = validateConfig({
      config: { data: { entries: entriesOf(database, options.address) as never } },
      declarations: { backbone: [], core: [], user: [] },
      side: "public",
    });
    const db = await openConfiguredDatabase(processCoreEntry(checked), { committedHeight: async () => null });
    try {
      await db.read(async (read) => read.query("SELECT 1"));
      return await startAdminServer(options);
    } finally {
      await db.close();
    }
  };

describe.each(PROCESS_BACKENDS)("the admin endpoints by default on $name (task 8.1a, Q128 B)", (backend) => {
  beforeAll(() => backend.start(), 180_000);
  afterAll(() => backend.stop(), 60_000);

  it("a process started without admin answers on its admin listener", async () => {
    expect(await defaultProblems(startProcess, (await backend.database()).setting)).toEqual([]);
  }, 120_000);

  it("negative control: task 8.1's opt-in default fails 'a process started without admin answers'", async () => {
    expect(await defaultProblems(optIn, (await backend.database()).setting)).toEqual([
      "live answered ECONNREFUSED, not 200",
      "ready answered ECONNREFUSED, not 200",
      "/status answered ECONNREFUSED, not 200 with JSON",
      "/config answered ECONNREFUSED, not 200",
    ]);
  }, 120_000);

  it("A62 and A64 with the default: the four endpoints and 404 elsewhere, following, a refused start live and not ready", async () => {
    const port = await freePort();
    const origin = `http://127.0.0.1:${port}`;
    const run = started(startProcess, (await backend.database()).setting, `127.0.0.1:${port}`);
    try {
      await run.handle.started;
      await statusWhen(origin, (body) => body.state === "following" && body.cursor === "3");
      expect(run.lines).toContain(`admin endpoints listening on 127.0.0.1:${port}`);
      const endpoints = [...ENDPOINTS, "/status?verbose=1", "/config?x"];
      const answers = [];
      for (const path of endpoints) answers.push(await ask(origin, path));
      const others = [];
      for (const [method, path] of OTHER_REQUESTS) others.push(await ask(origin, path, method));
      expect(routeProblems(answers, others)).toEqual([]);
      expect(stateProblems(await observe(origin), { state: "following", ready: true, reason: null })).toEqual([]);
    } finally {
      await run.handle.stop();
    }
    expect(await ask(origin, "/health/live")).toMatchObject({ status: null, error: "ECONNREFUSED" });
    // A refused start (a module's on-start-db fails) stays up, live and not ready.
    const failing = loggingModule("f", [], [], {
      points: {
        async "on-start-db"() {
          throw new Error("f cannot set up");
        },
      },
    });
    const refusedPort = await freePort();
    const refusedOrigin = `http://127.0.0.1:${refusedPort}`;
    const refused = started(startProcess, (await backend.database()).setting, `127.0.0.1:${refusedPort}`, {
      user: [failing],
    });
    try {
      await expect(refused.handle.started).rejects.toBeDefined();
      await statusWhen(refusedOrigin, (body) => body.state === "refused");
      const seen = await observe(refusedOrigin);
      const reason = { code: "callback-error", module: "f", point: "on-start-db" };
      expect(stateProblems(seen, { state: "refused", ready: false, reason })).toEqual([]);
      expect(await within(refused.handle.closed, 300)).toBe(false);
    } finally {
      await refused.handle.stop();
    }
  }, 180_000);

  it("a second process given the same admin address refuses with listen-failed and opens no database session", async () => {
    expect(await takenProblems(backend, startProcess)).toEqual([]);
  }, 120_000);

  it("negative control: a process that opens its database before listening fails 'opens no database session'", async () => {
    const opened = backend.kind === "postgres" ? "second: 1 session(s) on its database" : "second: its database directory exists";
    expect(await takenProblems(backend, startProcess, databaseFirst)).toEqual([opened]);
  }, 120_000);
});
