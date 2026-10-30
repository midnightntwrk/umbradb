import { setTimeout as sleep } from "node:timers/promises";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import type { Database, ReadOptions } from "../../src/db/api.js";
import { UmbraError } from "../../src/db/errors.js";
import { openPglite } from "../../src/db/pglite.js";
import { ALL_ZERO, SHOW_TIMEOUTS } from "../deterministic-postgresql/zero-timeouts-checks.js";
import { type PostgresTestDatabase, type PostgresTestServer, startPostgresServer } from "./postgres-server.js";

/**
 * The database's read timeout option. A read for a module API request is bounded by `apiReadTimeoutMs`, which the API
 * layer passes as `db.read(body, { timeoutMs })` when it registers the handlers. This file tests the database's half.
 * [DB-15, A141, CF-4]
 *
 * - On PostgreSQL that one read runs with `statement_timeout` and `idle_in_transaction_session_timeout` set to it
 *   (`SET LOCAL`, so they end with the read). A read that either one ends fails with `query-timeout`, not retryable.
 *   `statement_timeout` cancels the statement and leaves the connection usable; `idle_in_transaction_session_timeout`
 *   ends the session, and the pool replaces it.
 * - PGlite enforces neither and hangs on the second, so on PGlite an API read sets neither and is not bounded.
 *   [design §14]
 *
 * The "within 2 s" bound is asserted as stated; every test has a timeout far above its work. [A141]
 */

const TEST_TIMEOUT = 60_000;
const BOUND: ReadOptions = { timeoutMs: 1_000 };
const PID = "SELECT pg_backend_pid() AS pid";

/** What `run` rejects with, or "resolved". */
function outcome(run: Promise<unknown>): Promise<unknown> {
  return run.then(
    () => "resolved",
    (error: unknown) => error,
  );
}

/**
 * The expected error: `query-timeout`, not retryable, naming the read's timeout and the setting that ended it.
 * [A141]
 */
function expectQueryTimeout(
  error: unknown,
  setting: "statement_timeout" | "idle_in_transaction_session_timeout",
  timeoutMs = 1_000,
): void {
  expect(error).toBeInstanceOf(UmbraError);
  const timedOut = error as UmbraError;
  expect(timedOut.code).toBe("query-timeout");
  expect(timedOut.retryable).toBe(false);
  expect(timedOut.details).toEqual({ timeoutMs, setting });
  const what = setting === "statement_timeout" ? "a statement ran" : "the read stayed idle in its transaction";
  expect(timedOut.message).toBe(`the read was ended by its timeout: ${what} for ${timeoutMs} ms (${setting})`);
}

/** The read's two timeouts as `SHOW` prints them, and the other three at 0. */
const bounded = (shown: string): Record<string, string> => ({
  ...ALL_ZERO,
  statement_timeout: shown,
  idle_in_transaction_session_timeout: shown,
});

describe("A141 on PostgreSQL 18: a read for an API request is bounded by its timeout (DB-15)", () => {
  let server: PostgresTestServer;
  beforeAll(async () => {
    server = await startPostgresServer();
  }, 180_000);
  afterAll(() => server?.stop(), 60_000);

  /** A fresh database opened with one read connection, so "the next read" runs on the same connection if it is kept. */
  async function oneReader(): Promise<{ readonly database: PostgresTestDatabase; readonly db: Database }> {
    const database = await server.createDatabase();
    return { database, db: database.open({ readConnections: 1 }) };
  }

  it("fails pg_sleep(60) with query-timeout, not retryable, within 2 s; the next read on that connection succeeds", async () => {
    const { db } = await oneReader();
    let pid: unknown;
    const started = performance.now();
    const error = await outcome(
      db.read(async (read) => {
        pid = (await read.query(PID))[0]?.pid;
        await read.query("SELECT pg_sleep(60)");
      }, BOUND),
    );
    const ms = performance.now() - started;
    expectQueryTimeout(error, "statement_timeout");
    // The server's cancel, kept as the cause.
    expect((error as UmbraError).cause).toMatchObject({ code: "database-error", details: { sqlstate: "57014" } });
    expect(ms).toBeLessThan(2_000);
    // It was the timeout that ended it, not something sooner.
    expect(ms).toBeGreaterThan(900);
    const next = await db.read(async (read) => ({
      pid: (await read.query(PID))[0]?.pid,
      settings: (await read.query(SHOW_TIMEOUTS))[0],
    }));
    expect(next.pid).toBe(pid);
    expect(next.settings).toEqual(ALL_ZERO);
  }, TEST_TIMEOUT);

  it("fails a read that awaits 2 s between two statements with query-timeout; the next read succeeds on a new connection", async () => {
    const { database, db } = await oneReader();
    let pid: unknown;
    let serverEndedAfter = Number.NaN;
    let second: unknown;
    const error = await outcome(
      db.read(async (read) => {
        pid = (await read.query(PID))[0]?.pid;
        const idle = performance.now();
        // The server ends the session once the read has been idle in its transaction for its timeout, while the body
        // still awaits: the admin connection stops listing the read's backend.
        await expect
          .poll(async () => (await database.admin.unsafe("SELECT 1 FROM pg_stat_activity WHERE pid = $1", [pid as number])).length, {
            timeout: 10_000,
            interval: 20,
          })
          .toBe(0);
        serverEndedAfter = performance.now() - idle;
        await sleep(Math.max(0, 2_000 - (performance.now() - idle)));
        second = await outcome(read.query("SELECT 1 AS one"));
        return "body resolved";
      }, BOUND),
    );
    expectQueryTimeout(second, "idle_in_transaction_session_timeout");
    expectQueryTimeout(error, "idle_in_transaction_session_timeout");
    expect(serverEndedAfter).toBeGreaterThan(900);
    expect(serverEndedAfter).toBeLessThan(2_000);
    const next = await db.read(async (read) => (await read.query(PID))[0]?.pid);
    expect(next).toEqual(expect.any(Number));
    expect(next).not.toBe(pid);
  }, TEST_TIMEOUT);

  it("sets the two timeouts for that read only: SHOW reports them inside it, and 0 in the next read on the connection", async () => {
    const { db } = await oneReader();
    const inside = await db.read(async (read) => ({
      pid: (await read.query(PID))[0]?.pid,
      settings: (await read.query(SHOW_TIMEOUTS))[0],
    }), { timeoutMs: 1_500 });
    expect(inside.settings).toEqual(bounded("1500ms"));
    const after = await db.read(async (read) => ({
      pid: (await read.query(PID))[0]?.pid,
      settings: (await read.query(SHOW_TIMEOUTS))[0],
    }));
    expect(after.pid).toBe(inside.pid);
    expect(after.settings).toEqual(ALL_ZERO);
  }, TEST_TIMEOUT);

  it("resolves a read whose statements and gaps each stay under its timeout, however long it runs in all", async () => {
    const { db } = await oneReader();
    const started = performance.now();
    const result = await db.read(async (read) => {
      for (let i = 0; i < 4; i++) {
        await read.query("SELECT pg_sleep(0.2)");
        await sleep(200);
      }
      return (await read.query("SELECT 7 AS n"))[0];
    }, BOUND);
    expect(result).toEqual({ n: 7 });
    expect(performance.now() - started).toBeGreaterThan(1_000);
  }, TEST_TIMEOUT);

  it("fails a read with query-timeout even when its body caught the timeout's error, or threw its own after it", async () => {
    const { db } = await oneReader();
    const caught = await outcome(
      db.read(async (read) => {
        await read.query("SELECT pg_sleep(60)").catch(() => undefined);
        return "caught";
      }, BOUND),
    );
    expectQueryTimeout(caught, "statement_timeout");
    const own = await outcome(
      db.read(async (read) => {
        await read.query("SELECT pg_sleep(60)").catch(() => undefined);
        throw new Error("the body's own error");
      }, BOUND),
    );
    expectQueryTimeout(own, "statement_timeout");
    // The connection stayed usable.
    expect(await db.read(async (read) => (await read.query("SELECT 1 AS one"))[0])).toEqual({ one: 1 });
  }, TEST_TIMEOUT);

  it("fails every statement of the read once its timeout ended it: one sent with the cancelled one, and later ones", async () => {
    const { db } = await oneReader();
    const outcomes: unknown[] = [];
    const error = await outcome(
      db.read(async (read) => {
        outcomes.push(...(await Promise.all([outcome(read.query("SELECT pg_sleep(60)")), outcome(read.query("SELECT 1"))])));
        outcomes.push(await outcome(read.query("SELECT 2")));
      }, BOUND),
    );
    expect(outcomes).toHaveLength(3);
    for (const each of [...outcomes, error]) expectQueryTimeout(each, "statement_timeout");
  }, TEST_TIMEOUT);

  it("fails a read that stays idle past its timeout after its last statement, although its body resolved", async () => {
    const { db } = await oneReader();
    const error = await outcome(
      db.read(async (read) => {
        await read.query("SELECT 1 AS one");
        await sleep(1_500);
        return "late";
      }, BOUND),
    );
    expectQueryTimeout(error, "idle_in_transaction_session_timeout");
    expect(await db.read(async (read) => (await read.query("SELECT 1 AS one"))[0])).toEqual({ one: 1 });
  }, TEST_TIMEOUT);

  it("fails a read that runs no statement and stays idle past its timeout from its BEGIN", async () => {
    const { db } = await oneReader();
    const error = await outcome(
      db.read(async () => {
        await sleep(1_500);
        return "late";
      }, BOUND),
    );
    expectQueryTimeout(error, "idle_in_transaction_session_timeout");
  }, TEST_TIMEOUT);

  it("does not count a statement in flight as idle time: one asked while a long one runs, past the timeout, runs", async () => {
    const { db } = await oneReader();
    const result = await db.read(async (read) => {
      await read.query("SELECT 1 AS one");
      // 0.6 s idle, then a 0.9 s statement; 0.5 s into it — 1.1 s after the last statement settled — another one.
      await sleep(600);
      const long = read.query("SELECT pg_sleep(0.9)");
      await sleep(500);
      const asked = read.query("SELECT 2 AS two");
      await long;
      return (await asked)[0];
    }, BOUND);
    expect(result).toEqual({ two: 2 });
  }, TEST_TIMEOUT);

  describe("only a read that sets the option reports query-timeout; the same server errors elsewhere keep their meaning", () => {
    it("reports a statement_timeout a body set itself in a read without the option as database-error 57014", async () => {
      const { db } = await oneReader();
      const error = await outcome(
        db.read(async (read) => {
          await read.query("SET LOCAL statement_timeout = 1000");
          await read.query("SELECT pg_sleep(60)");
        }),
      );
      expect(error).toBeInstanceOf(UmbraError);
      expect(error).toMatchObject({ code: "database-error", retryable: false, details: { sqlstate: "57014" } });
      // Negative control of the check: a read whose 57014 is reported as anything but query-timeout fails it. [A141]
      expect(() => expectQueryTimeout(error, "statement_timeout")).toThrow();
    }, TEST_TIMEOUT);

    it("reports a session an idle timeout a body set itself ended, in a read without the option, as connection-lost", async () => {
      const { db } = await oneReader();
      const error = await outcome(
        db.read(async (read) => {
          await read.query("SET LOCAL idle_in_transaction_session_timeout = 1000");
          await sleep(2_000);
          await read.query("SELECT 1 AS one");
        }),
      );
      expect(error).toBeInstanceOf(UmbraError);
      expect(error).toMatchObject({ code: "connection-lost", retryable: true });
      expect(() => expectQueryTimeout(error, "idle_in_transaction_session_timeout")).toThrow();
      expect(await db.read(async (read) => (await read.query("SELECT 1 AS one"))[0])).toEqual({ one: 1 });
    }, TEST_TIMEOUT);
  });
});

describe("A141 on PGlite 0.5.10: an API read sets neither timeout and is not bounded (DB-15)", () => {
  let db: Database;
  beforeAll(async () => {
    db = await openPglite({ dataDir: "memory://", committedHeight: async () => null, developmentOptIn: true });
  }, 60_000);
  afterAll(() => db?.close(), 60_000);

  it("reports every timeout at 0 inside a read with the option, and runs past it, idle and in a statement", async () => {
    const result = await db.read(async (read) => {
      // Checked first: a read that set the idle timeout would hang PGlite below (test/db/pglite-timeouts.test.ts shows
      // it, bounded, in a process of its own).
      expect((await read.query(SHOW_TIMEOUTS))[0]).toEqual(ALL_ZERO);
      await sleep(1_500);
      await read.query("SELECT pg_sleep(1.5)");
      return (await read.query("SELECT 1 AS one"))[0];
    }, BOUND);
    expect(result).toEqual({ one: 1 });
  }, TEST_TIMEOUT);
});

describe("the read option is checked alike on both backends (DB-1)", () => {
  let server: PostgresTestServer;
  let both: readonly (readonly [string, Database])[];
  beforeAll(async () => {
    server = await startPostgresServer();
    const pglite = await openPglite({ dataDir: "memory://", committedHeight: async () => null, developmentOptIn: true });
    both = [
      ["PostgreSQL 18", (await server.createDatabase()).open()],
      ["PGlite 0.5.10", pglite],
    ];
  }, 180_000);
  afterAll(async () => {
    await both?.[1]?.[1].close();
    await server?.stop();
  }, 60_000);

  it("refuses a timeoutMs that is not a whole number of milliseconds from 1 to 2147483647, before the body runs", async () => {
    for (const [name, db] of both) {
      for (const timeoutMs of [0, -1, 1.5, Number.NaN, Number.POSITIVE_INFINITY, 2_147_483_648, "1000", 1000n, null]) {
        let ran = false;
        const error = await outcome(
          db.read(async () => {
            ran = true;
          }, { timeoutMs } as unknown as ReadOptions),
        );
        expect(error, `${name}: ${String(timeoutMs)}`).toBeInstanceOf(UmbraError);
        expect(error).toMatchObject({ code: "invalid-configuration", retryable: false, details: { parameter: "timeoutMs" } });
        expect(ran).toBe(false);
      }
    }
  }, TEST_TIMEOUT);

  it("accepts 1 to 2147483647 ms, and no option or an option without timeoutMs as an unbounded read", async () => {
    for (const [name, db] of both) {
      for (const options of [{ timeoutMs: 1_000 }, { timeoutMs: 2_147_483_647 }, {}, undefined]) {
        expect(await db.read(async () => "ran", options), `${name}: ${JSON.stringify(options)}`).toBe("ran");
      }
      // 1 ms is accepted: on PostgreSQL such a read may well be ended by it, but it is never refused.
      const shortest = await outcome(db.read(async () => "ran", { timeoutMs: 1 }));
      expect(shortest === "resolved" || (shortest as UmbraError).code === "query-timeout", `${name}: ${String(shortest)}`).toBe(
        true,
      );
    }
  }, TEST_TIMEOUT);
});
