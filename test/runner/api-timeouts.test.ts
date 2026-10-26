import { setTimeout as sleep } from "node:timers/promises";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { cursorHeight } from "../../src/backbone/core-block-commit/core-block-commit.js";
import type { Database, ReadHandle } from "../../src/db/api.js";
import { UmbraError } from "../../src/db/errors.js";
import type { ModuleDeclaration } from "../../src/modules/declaration.js";
import { startPgliteServer, type PgliteTestServer } from "../db/pglite-server.js";
import { type PostgresTestDatabase, type PostgresTestServer, startPostgresServer } from "../db/postgres-server.js";
import { declaration } from "../modules/declarations.js";
import { entry } from "../modules/graph-fixtures.js";
import { InMemoryBlockSource, type Process, runLoop, startProcess } from "./process-harness.js";

/**
 * A141's request half through a registered handler (task 5.2a; DB-15, RN-15, owner decision Q71): the module API reads
 * for each request with `db.read(…, { timeoutMs: apiReadTimeoutMs })`, so on PostgreSQL a handler's read running
 * `pg_sleep(60)` with `apiReadTimeoutMs` 1000 fails with `query-timeout`, not retryable, within 2 s — the response 504 —
 * and the next read on that connection succeeds; a handler's read that awaits 2 s between two statements fails with
 * `query-timeout`, and the next read succeeds on a new connection; on PGlite an API read sets neither timeout. The
 * database API's half (the read option itself) is task 2.7's `test/db/read-timeouts.test.ts`.
 *
 * Every test has a timeout far above its work; "within 2 s" is asserted as A141 states it.
 */

const TIMEOUT_MS = 1_000;
const TEST_TIMEOUT = 60_000;
const SHOW = "SELECT current_setting('statement_timeout') AS statement, current_setting('idle_in_transaction_session_timeout') AS idle";
const PID = "SELECT pg_backend_pid() AS pid";

/** What the handlers of `slow-api` saw: each request's backend and the error its read's statement failed with. */
interface Seen {
  readonly pids: unknown[];
  readonly errors: unknown[];
}

/** The module `slow-api`: `/pid`, `/sleep` (pg_sleep(60)), `/idle` (2 s between two statements), `/timeouts`. */
function slowApi(seen: Seen): ModuleDeclaration {
  const pid = async (read: ReadHandle) => {
    const value = (await read.query(PID))[0]?.pid;
    seen.pids.push(value);
    return value;
  };
  const failing = async (run: () => Promise<unknown>) => {
    try {
      await run();
    } catch (error) {
      seen.errors.push(error);
      throw error;
    }
  };
  return declaration("slow-api", {
    provides: [],
    migrations: [],
    points: {
      async "on-start-api"(_p, api) {
        api.http("GET", "/pid", async (_req, read) => ({ status: 200, body: { pid: await pid(read) } }));
        api.http("GET", "/sleep", async (_req, read) => {
          await pid(read);
          await failing(() => read.query("SELECT pg_sleep(60)"));
          return { status: 200, body: "slept" };
        });
        api.http("GET", "/idle", async (_req, read) => {
          await pid(read);
          await sleep(2_000);
          await failing(() => read.query("SELECT 1 AS one"));
          return { status: 200, body: "idled" };
        });
        api.http("GET", "/timeouts", async (_req, read) => ({ status: 200, body: (await read.query(SHOW))[0] }));
      },
    },
  });
}

/** The error a handler's read failed with is A141's: `query-timeout`, not retryable. */
function isQueryTimeout(error: unknown): boolean {
  return error instanceof UmbraError && error.code === "query-timeout" && error.retryable === false;
}

/**
 * A141's request-half oracle on PostgreSQL over a process serving `slow-api` with `apiReadTimeoutMs` 1000 and one read
 * connection: the problems found — none when the handler's read is bounded as DB-15 says. `cancel` ends a statement a
 * read without the bound would leave running, so the check ends either way.
 */
async function a141Problems(url: string, seen: Seen, cancel: (pid: number) => Promise<void>): Promise<string[]> {
  const problems: string[] = [];
  const shown = (await (await fetch(`${url}/timeouts`)).json()) as Record<string, string>;
  if (shown.statement !== "1s" || shown.idle !== "1s") problems.push(`the handler's read runs with ${JSON.stringify(shown)}`);

  // pg_sleep(60): query-timeout within 2 s, and the next read on the same connection.
  seen.pids.length = 0;
  seen.errors.length = 0;
  const started = performance.now();
  const slept = await fetch(`${url}/sleep`, { signal: AbortSignal.timeout(4_000) }).catch((error: unknown) => error);
  const ms = performance.now() - started;
  if (!(slept instanceof Response)) {
    problems.push("pg_sleep(60): no answer within 4 s");
    await cancel(seen.pids[0] as number);
  } else {
    const body = (await slept.json()) as { error?: { code?: string } };
    if (slept.status !== 504 || body.error?.code !== "query-timeout") problems.push(`pg_sleep(60): ${slept.status} ${JSON.stringify(body)}`);
    if (ms >= 2_000) problems.push(`pg_sleep(60): answered after ${Math.round(ms)} ms`);
    if (ms <= 900) problems.push(`pg_sleep(60): answered after ${Math.round(ms)} ms, before its timeout`);
    if (!isQueryTimeout(seen.errors[0])) problems.push(`pg_sleep(60): the read failed with ${String(seen.errors[0])}`);
  }
  const slowPid = seen.pids[0];
  const next = await fetch(`${url}/pid`);
  const nextPid = ((await next.json()) as { pid?: unknown }).pid;
  if (next.status !== 200 || nextPid !== slowPid) problems.push(`after pg_sleep(60): ${next.status} on ${String(nextPid)}, not ${String(slowPid)}`);

  // 2 s idle between two statements: query-timeout, and the next read on a new connection.
  seen.pids.length = 0;
  seen.errors.length = 0;
  const idled = await fetch(`${url}/idle`, { signal: AbortSignal.timeout(10_000) });
  const idleBody = (await idled.json()) as { error?: { code?: string } };
  if (idled.status !== 504 || idleBody.error?.code !== "query-timeout") problems.push(`idle: ${idled.status} ${JSON.stringify(idleBody)}`);
  if (!isQueryTimeout(seen.errors[0])) problems.push(`idle: the second statement failed with ${String(seen.errors[0])}`);
  const idlePid = seen.pids[0];
  const after = await fetch(`${url}/pid`);
  const afterPid = ((await after.json()) as { pid?: unknown }).pid;
  if (after.status !== 200 || typeof afterPid !== "number" || afterPid === idlePid) {
    problems.push(`after the idle read: ${after.status} on ${String(afterPid)}, the idle read's ${String(idlePid)}`);
  }
  return problems;
}

describe("A141's request half on PostgreSQL 18: a handler's read is bounded by apiReadTimeoutMs (DB-15)", () => {
  let server: PostgresTestServer;
  const processes: Process[] = [];
  beforeAll(async () => {
    server = await startPostgresServer();
  }, 180_000);
  afterAll(async () => {
    for (const process of processes) await process.close();
    await server?.stop();
  }, 60_000);

  /** A process serving `slow-api` on a fresh database with one read connection, at committed height 1. */
  async function serving(apiDb?: (db: Database) => Pick<Database, "read">) {
    const database: PostgresTestDatabase = await server.createDatabase();
    const db = database.open({ committedHeight: cursorHeight, readConnections: 1 });
    const seen: Seen = { pids: [], errors: [] };
    const process = await startProcess(db, [slowApi(seen)], [entry("slow-api", 1)], {
      apiReadTimeoutMs: TIMEOUT_MS,
      ...(apiDb === undefined ? {} : { apiDb: apiDb(db) }),
    });
    processes.push(process);
    await runLoop(process, new InMemoryBlockSource({ head: 1n }), 1n);
    const cancel = async (pid: number) => {
      await database.admin.unsafe("SELECT pg_cancel_backend($1)", [pid]);
    };
    return { process, seen, cancel };
  }

  it("passes A141's request half through a registered handler", async () => {
    const { process, seen, cancel } = await serving();
    expect(await a141Problems(process.url, seen, cancel)).toEqual([]);
  }, TEST_TIMEOUT);

  it("negative control: a handler's read that ignores apiReadTimeoutMs fails A141's request half", async () => {
    const { process, seen, cancel } = await serving((db) => ({ read: (body) => db.read(body) }));
    const problems = await a141Problems(process.url, seen, cancel);
    expect(problems).toContain('the handler\'s read runs with {"statement":"0","idle":"0"}');
    expect(problems).toContain("pg_sleep(60): no answer within 4 s");
    expect(problems.some((p) => p.startsWith("idle: 200"))).toBe(true);
    expect(problems.some((p) => p.startsWith("after the idle read: 200"))).toBe(true);
  }, TEST_TIMEOUT);
});

describe("A141's request half on PGlite 0.5.10: an API read sets neither timeout (DB-15)", () => {
  let server: PgliteTestServer;
  const processes: Process[] = [];
  beforeAll(async () => {
    server = await startPgliteServer();
  }, 60_000);
  afterAll(async () => {
    for (const process of processes) await process.close();
    await server?.stop();
  }, 60_000);

  it("answers a handler whose read shows both timeouts at 0 with apiReadTimeoutMs 1000", async () => {
    const database = await server.createDatabase();
    const db = await database.open({ committedHeight: cursorHeight });
    const seen: Seen = { pids: [], errors: [] };
    const process = await startProcess(db, [slowApi(seen)], [entry("slow-api", 1)], { apiReadTimeoutMs: TIMEOUT_MS });
    processes.push(process);
    await runLoop(process, new InMemoryBlockSource({ head: 1n }), 1n);
    const response = await fetch(`${process.url}/timeouts`);
    expect(response.status).toBe(200);
    expect(response.headers.get("x-umbra-height")).toBe("1");
    expect(await response.json()).toEqual({ statement: "0", idle: "0" });
  }, TEST_TIMEOUT);
});
