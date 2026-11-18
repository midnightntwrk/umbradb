import type { Sql } from "postgres";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import type { ReadHandle } from "../../src/db/api.js";
import { openPostgres } from "../../src/db/postgres.js";
import { spareRead } from "../../src/db/spare-read.js";
import { settlesWithin, TEST_CURSOR, TEST_SCHEMA } from "./backends.js";
import { type PostgresTestServer, startPostgresServer } from "./postgres-server.js";

/**
 * The PostgreSQL backend has one writer connection for transactions, and a pool of read-only connections that see
 * committed data only.
 *
 * A reader polling while a block transaction is open never sees a row of that block before its COMMIT.
 */

let server: PostgresTestServer;

beforeAll(async () => {
  server = await startPostgresServer();
}, 180_000);

afterAll(async () => {
  await server?.stop();
}, 60_000);

/** The backends the API opened on the admin connection's database (the API names its connections `umbradb`). */
const apiBackends = async (admin: Sql): Promise<number[]> =>
  (
    await admin.unsafe(
      "SELECT pid FROM pg_stat_activity WHERE datname = current_database() AND application_name = 'umbradb'",
    )
  ).map((row) => row.pid as number);

describe("a reader never sees a block's rows before its COMMIT", () => {
  it("sees none of block h's rows, and the height h − 1, while the transaction for h is open", async () => {
    const database = await server.createDatabase();
    await database.exec(`${TEST_SCHEMA} CREATE TABLE t.items (height bigint, n integer, PRIMARY KEY (height, n));`);
    const db = database.open({ committedHeight: TEST_CURSOR });
    await db.transaction((tx) => tx.execute("INSERT INTO t.blocks VALUES (1)"));

    type Phase = "before" | "open" | "committing" | "committed";
    let phase = "before" as Phase;
    // A poll's snapshot is taken between its start and its end, so one that starts and ends before the body sets
    // "committing" (before COMMIT is sent) read while the transaction was open.
    const polls: { start: Phase; end: Phase; height: bigint | null; rows: bigint }[] = [];
    let polling = true;
    const poller = (async () => {
      while (polling) {
        const start = phase;
        const seen = await db.read(async (read) => {
          const [row] = await read.query("SELECT count(*) AS n FROM t.items WHERE height = 2");
          return { height: read.height, rows: row?.n as bigint };
        });
        polls.push({ start, end: phase, ...seen });
      }
    })();

    let insideSaw: bigint | undefined;
    try {
      await db.transaction(async (tx) => {
        await tx.execute("INSERT INTO t.blocks VALUES (2)");
        phase = "open";
        for (let n = 0; n < 20; n++) {
          await tx.execute("INSERT INTO t.items VALUES (2, $1)", [n]);
          await new Promise((resolve) => setTimeout(resolve, 10));
        }
        // Control: the rows exist inside the transaction, so a reader that saw them would have seen them here.
        const [row] = await tx.query("SELECT count(*) AS n FROM t.items WHERE height = 2");
        insideSaw = row?.n as bigint;
        await new Promise((resolve) => setTimeout(resolve, 50));
        phase = "committing";
      });
      phase = "committed";
      // Until a poll that started after the COMMIT has finished (a fixed wait failed under the suites' full load).
      await expect.poll(() => polls.some((poll) => poll.start === "committed"), { timeout: 10_000, interval: 5 }).toBe(true);
    } finally {
      polling = false;
      await poller;
    }

    expect(insideSaw).toBe(20n);
    const beforeCommit = polls.filter((poll) => poll.start !== "committing" && poll.end !== "committing" && poll.end !== "committed");
    expect(beforeCommit.filter((poll) => poll.start === "open").length).toBeGreaterThanOrEqual(10);
    for (const poll of beforeCommit) expect(poll).toMatchObject({ height: 1n, rows: 0n });
    const after = polls.filter((poll) => poll.start === "committed");
    expect(after.length).toBeGreaterThan(0);
    for (const poll of after) expect(poll).toMatchObject({ height: 2n, rows: 20n });
  }, 60_000);

  it("reads on pooled connections, never the writer's", async () => {
    const database = await server.createDatabase();
    await database.exec(TEST_SCHEMA);
    const db = database.open({ committedHeight: TEST_CURSOR, readConnections: 2 });
    const writerPid = await db.transaction(async (tx) => (await tx.query("SELECT pg_backend_pid() AS pid"))[0]?.pid);
    const readerPids = new Set<unknown>();
    await Promise.all(
      Array.from({ length: 8 }, () =>
        db.read(async (read) => {
          const [row] = await read.query("SELECT pg_backend_pid() AS pid, pg_sleep(0.02)");
          readerPids.add(row?.pid);
        }),
      ),
    );
    expect(readerPids.has(writerPid)).toBe(false);
    expect(readerPids.size).toBeGreaterThanOrEqual(1);
    expect(readerPids.size).toBeLessThanOrEqual(2);
    const backends = await apiBackends(database.admin);
    expect(backends).toContain(writerPid);
    expect(backends.length).toBeLessThanOrEqual(3);
  }, 60_000);

  it("waits for a free read connection when every one is in use", async () => {
    const database = await server.createDatabase();
    const db = database.open({ readConnections: 1 });
    const order: string[] = [];
    let release!: () => void;
    const held = new Promise<void>((resolve) => {
      release = resolve;
    });
    const first = db.read(async () => {
      order.push("first starts");
      await held;
      order.push("first ends");
    });
    // Until the first read holds the one connection (a fixed wait failed under the suites' full load).
    await expect.poll(() => order.includes("first starts"), { timeout: 10_000, interval: 5 }).toBe(true);
    const second = db.read(async () => {
      order.push("second starts");
    });
    await new Promise((resolve) => setTimeout(resolve, 50));
    expect(order).toEqual(["first starts"]);
    release();
    await Promise.all([first, second]);
    expect(order).toEqual(["first starts", "first ends", "second starts"]);
  }, 60_000);
});

describe("the spare read (the ledger worker's node reads) does not wait for the reader pool", () => {
  const pidOf = async (read: ReadHandle): Promise<number> => Number((await read.query("SELECT pg_backend_pid() AS pid"))[0]?.pid);

  it("takes a pooled reader while one is free, and runs on one more session, opened then, while every pooled reader is held", async () => {
    const database = await server.createDatabase();
    await database.exec(`${TEST_SCHEMA} INSERT INTO t.blocks VALUES (7);`);
    const db = database.open({ committedHeight: TEST_CURSOR, readConnections: 1 });
    const spare = spareRead(db);
    // The pooled reader is free: the spare read runs on it, and opens no session.
    const pooled = await db.read(pidOf);
    expect(await spare(pidOf)).toBe(pooled);
    expect(await apiBackends(database.admin)).toEqual([pooled]);
    // The one pooled reader held: a read of the pool waits for it, the spare read does not.
    let release!: () => void;
    const gate = new Promise<void>((resolve) => {
      release = resolve;
    });
    let holding = false;
    const held = db.read(async (read) => {
      holding = true;
      await gate;
      return pidOf(read);
    });
    await expect.poll(() => holding, { timeout: 10_000, interval: 5 }).toBe(true);
    const waiting = db.read(pidOf);
    expect(await settlesWithin(waiting, 200)).toBe(false);
    const spared = await spare(async (read) => ({ pid: await pidOf(read), height: read.height }));
    // A read like any other: it sees the committed height, on a session that is not the pool's.
    expect(spared.height).toBe(7n);
    expect(spared.pid).not.toBe(pooled);
    expect((await apiBackends(database.admin)).sort()).toEqual([pooled, spared.pid].sort());
    // There is one such session: two spare reads at once run on it one after the other.
    const order: string[] = [];
    let releaseFirst!: () => void;
    const firstGate = new Promise<void>((resolve) => {
      releaseFirst = resolve;
    });
    const first = spare(async (read) => {
      order.push("first starts");
      await firstGate;
      order.push("first ends");
      return pidOf(read);
    });
    await expect.poll(() => order.includes("first starts"), { timeout: 10_000, interval: 5 }).toBe(true);
    const second = spare(async (read) => {
      order.push("second starts");
      return pidOf(read);
    });
    expect(await settlesWithin(second, 200)).toBe(false);
    releaseFirst();
    expect(await Promise.all([first, second])).toEqual([spared.pid, spared.pid]);
    expect(order).toEqual(["first starts", "first ends", "second starts"]);
    // The pool's reads go on as they were: the one waiting gets the pooled reader once it is free.
    release();
    expect(await Promise.all([held, waiting])).toEqual([pooled, pooled]);
    expect((await apiBackends(database.admin)).length).toBe(2);
    // Its options are the read's, and a closed database refuses it.
    await expect(spare(pidOf, { timeoutMs: 0 })).rejects.toMatchObject({ code: "invalid-configuration" });
    expect(await spare(pidOf, { timeoutMs: 60_000 })).toBe(pooled);
    await db.close();
    await expect(spare(pidOf)).rejects.toMatchObject({ code: "handle-closed" });
    await expect.poll(() => apiBackends(database.admin), { timeout: 10_000, interval: 20 }).toEqual([]);
  }, 60_000);

  it("is a database's own read where its backend has none (PGlite's one queue, a database of another make)", async () => {
    const calls: unknown[][] = [];
    const other = {
      read: async <T>(body: (read: ReadHandle) => Promise<T>, options?: unknown): Promise<T> => {
        calls.push([options]);
        return body({ height: 3n, query: async () => [] });
      },
    };
    expect(await spareRead(other)(async (read) => read.height, { timeoutMs: 5 })).toBe(3n);
    expect(calls).toEqual([[{ timeoutMs: 5 }]]);
  });
});

describe("the database's parts (the `database`)", () => {
  // The parts carry no URL, so no URL query parameter can override a session setting: only the backend's own
  // `connection` option sets a startup parameter.
  it("refuses a read pool size that is not a positive integer", () => {
    for (const readConnections of [0, -1, 1.5, Number.NaN]) {
      let error: unknown;
      try {
        openPostgres({
          connection: { host: "127.0.0.1", port: 1, user: "u", name: "db", ssl: "disable" },
          committedHeight: async () => null,
          readConnections,
        });
      } catch (caught) {
        error = caught;
      }
      expect(error).toMatchObject({ code: "invalid-configuration", details: { parameter: "readConnections" } });
    }
  });

  it("connects with the database's parts", async () => {
    const database = await server.createDatabase();
    const { kind: _kind, ...connection } = database.setting;
    for (const parts of [connection]) {
      const db = openPostgres({ connection: parts, committedHeight: async () => null });
      expect(await db.read(async (read) => (await read.query("SELECT 1 AS one"))[0])).toEqual({ one: 1 });
      await db.close();
    }
  }, 60_000);
});
