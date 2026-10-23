import type { Sql } from "postgres";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { UmbraError } from "../../src/db/errors.js";
import { openPostgres } from "../../src/db/postgres.js";
import { PINNED_SETTINGS } from "../../src/deterministic-postgresql/index.js";
import { TEST_CURSOR, TEST_SCHEMA } from "./backends.js";
import { type PostgresTestServer, startPostgresServer } from "./postgres-server.js";

/**
 * DB-5 on PostgreSQL: one writer connection for transactions, and a pool of read-only connections that see committed
 * data only. A12: a reader polling while a block transaction is open never sees a row of that block before its COMMIT.
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

describe("A12 (DB-5) — a reader never sees a block's rows before its COMMIT", () => {
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
      await new Promise((resolve) => setTimeout(resolve, 50));
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
    await new Promise((resolve) => setTimeout(resolve, 50));
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

describe("the database URL (CF-4's `database`)", () => {
  it("refuses a URL query parameter that would override a pinned setting, before connecting", () => {
    for (const name of PINNED_SETTINGS.map(([setting]) => setting)) {
      for (const spelling of [name, name.toLowerCase(), name.toUpperCase()]) {
        let error: unknown;
        try {
          openPostgres({
            url: `postgres://user:secret@127.0.0.1:1/db?sslmode=disable&${spelling}=x`,
            committedHeight: async () => null,
          });
        } catch (caught) {
          error = caught;
        }
        expect(error, spelling).toBeInstanceOf(UmbraError);
        expect((error as UmbraError).code).toBe("invalid-configuration");
        expect((error as UmbraError).message).toContain(name);
        expect((error as UmbraError).message).not.toContain("secret");
      }
    }
  });

  it("refuses a read pool size that is not a positive integer", () => {
    for (const readConnections of [0, -1, 1.5, Number.NaN]) {
      let error: unknown;
      try {
        openPostgres({ url: "postgres://127.0.0.1:1/db", committedHeight: async () => null, readConnections });
      } catch (caught) {
        error = caught;
      }
      expect(error).toMatchObject({ code: "invalid-configuration", details: { parameter: "readConnections" } });
    }
  });

  it("accepts unrelated query parameters, and a URL without any", async () => {
    const database = await server.createDatabase();
    for (const url of [database.url, `${database.url}?application_name=umbradb-test`]) {
      const db = openPostgres({ url, committedHeight: async () => null });
      expect(await db.read(async (read) => (await read.query("SELECT 1 AS one"))[0])).toEqual({ one: 1 });
      await db.close();
    }
  }, 60_000);
});
