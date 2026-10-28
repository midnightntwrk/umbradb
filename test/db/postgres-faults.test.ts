import { createServer } from "node:net";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import type { Database } from "../../src/db/api.js";
import { UmbraError } from "../../src/db/errors.js";
import { classifyDriverError, openPostgres } from "../../src/db/postgres.js";
import { TEST_CURSOR, TEST_SCHEMA } from "./backends.js";
import { type PostgresTestDatabase, type PostgresTestServer, startPostgresServer } from "./postgres-server.js";
import { connectionOfUrl } from "./connection.js";

/**
 * A19 [FAULT] (DB-13): terminating the writer's backend mid-transaction yields `connection-lost` with `retryable:
 * true`; a constraint violation yields a not-retryable error. Every other database error is not retryable either. The
 * faults are real: `pg_terminate_backend` from another connection, a server that refuses connections, a wrong
 * password.
 */

let server: PostgresTestServer;

beforeAll(async () => {
  server = await startPostgresServer();
}, 180_000);

afterAll(async () => {
  await server?.stop();
}, 60_000);

async function failure(run: () => Promise<unknown>): Promise<UmbraError> {
  try {
    await run();
  } catch (error) {
    if (error instanceof UmbraError) return error;
    throw error;
  }
  throw new Error("expected an UmbraError");
}

async function opened(): Promise<{ database: PostgresTestDatabase; db: Database }> {
  const database = await server.createDatabase();
  await database.exec(TEST_SCHEMA);
  return { database, db: database.open({ committedHeight: TEST_CURSOR }) };
}

const pidOf = async (handle: { query(sql: string): Promise<Record<string, unknown>[]> }) =>
  (await handle.query("SELECT pg_backend_pid() AS pid"))[0]?.pid as number;

const rowsOf = async (database: PostgresTestDatabase) =>
  (await database.admin.unsafe("SELECT height FROM t.blocks ORDER BY height")).map((row) => BigInt(row.height));

describe("A19 (DB-13) — a lost connection is connection-lost, retryable", () => {
  it(
    "[[db.connection-lost.retryable]] terminating the writer's backend mid-transaction gives connection-lost, " +
      "retryable; nothing commits; the next transaction runs on a new connection",
    async () => {
      const { database, db } = await opened();
      let firstPid = 0;
      const error = await failure(() =>
        db.transaction(async (tx) => {
          await tx.execute("INSERT INTO t.blocks VALUES (1)");
          firstPid = await pidOf(tx);
          await database.terminate(firstPid);
          await tx.execute("INSERT INTO t.blocks VALUES (2)");
        }),
      );
      expect(error.code).toBe("connection-lost");
      expect(error.retryable).toBe(true);
      expect(error.details.connection).toBe("writer");
      expect(await rowsOf(database)).toEqual([]);

      const secondPid = await db.transaction(async (tx) => {
        await tx.execute("INSERT INTO t.blocks VALUES (1)");
        return pidOf(tx);
      });
      expect(secondPid).not.toBe(firstPid);
      expect(await rowsOf(database)).toEqual([1n]);
    },
    60_000,
  );

  it("gives connection-lost to a statement running when the writer's backend is terminated", async () => {
    const { database, db } = await opened();
    const error = await failure(() =>
      db.transaction(async (tx) => {
        await tx.execute("INSERT INTO t.blocks VALUES (1)");
        const pid = await pidOf(tx);
        const running = tx.query("SELECT pg_sleep(30)");
        running.catch(() => undefined); // awaited below, after the termination it is meant to fail with
        await new Promise((resolve) => setTimeout(resolve, 200));
        await database.terminate(pid);
        await running;
      }),
    );
    expect(error).toMatchObject({ code: "connection-lost", retryable: true });
    expect(await rowsOf(database)).toEqual([]);
  }, 60_000);

  it("gives connection-lost when the connection is lost before COMMIT, and commits nothing", async () => {
    const { database, db } = await opened();
    const error = await failure(() =>
      db.transaction(async (tx) => {
        await tx.execute("INSERT INTO t.blocks VALUES (1)");
        await database.terminate(await pidOf(tx));
      }),
    );
    expect(error).toMatchObject({ code: "connection-lost", retryable: true });
    expect(await rowsOf(database)).toEqual([]);
  }, 60_000);

  it("refuses every later statement of a transaction whose connection was lost, even when the body catches the error", async () => {
    const { database, db } = await opened();
    const errors: UmbraError[] = [];
    const error = await failure(() =>
      db.transaction(async (tx) => {
        await tx.execute("INSERT INTO t.blocks VALUES (1)");
        await database.terminate(await pidOf(tx));
        for (const height of [2, 3, 4]) {
          await tx.execute("INSERT INTO t.blocks VALUES ($1)", [height]).catch((e: UmbraError) => errors.push(e));
        }
      }),
    );
    expect(errors.map((e) => e.code)).toEqual(["connection-lost", "connection-lost", "connection-lost"]);
    expect(error.code).toBe("connection-lost");
    expect(await rowsOf(database)).toEqual([]);
  }, 60_000);

  it("gives connection-lost when a reader's backend is terminated mid-read; the next read works", async () => {
    const { database, db } = await opened();
    await db.transaction((tx) => tx.execute("INSERT INTO t.blocks VALUES (1)"));
    const error = await failure(() =>
      db.read(async (read) => {
        await database.terminate(await pidOf(read));
        await read.query("SELECT 1");
      }),
    );
    expect(error).toMatchObject({ code: "connection-lost", retryable: true });
    expect(error.details.connection).toBe("reader");
    for (let i = 0; i < 12; i++) expect(await db.read(async (read) => read.height)).toBe(1n);
  }, 60_000);

  it("replaces a writer or read connection lost while idle: at most one connection-lost, then a new connection", async () => {
    const { database, db } = await opened();
    // A loss noticed only by the next statement is reported (retryable); one the driver already saw is replaced
    // silently. Either way the retry runs on a new connection.
    const retried = async <T>(run: () => Promise<T>): Promise<T> => {
      try {
        return await run();
      } catch (error) {
        expect(error).toMatchObject({ code: "connection-lost", retryable: true });
        return run();
      }
    };
    const writerPid = await db.transaction((tx) => pidOf(tx));
    const readerPid = await db.read((read) => pidOf(read));
    await database.terminate(writerPid);
    await database.terminate(readerPid);
    await new Promise((resolve) => setTimeout(resolve, 250));
    const newWriterPid = await retried(() =>
      db.transaction(async (tx) => {
        await tx.execute("INSERT INTO t.blocks VALUES (1)");
        return pidOf(tx);
      }),
    );
    const newReader = await retried(() => db.read(async (read) => [await pidOf(read), read.height] as const));
    expect(newWriterPid).not.toBe(writerPid);
    expect(newReader[0]).not.toBe(readerPid);
    expect(newReader[1]).toBe(1n);
  }, 60_000);

  it("gives connection-lost, retryable, when the server refuses connections", async () => {
    const port = await new Promise<number>((resolve, reject) => {
      const probe = createServer();
      probe.once("error", reject);
      probe.listen(0, "127.0.0.1", () => {
        const address = probe.address();
        probe.close(() => resolve(typeof address === "object" && address !== null ? address.port : 0));
      });
    });
    const db = openPostgres({
      connection: connectionOfUrl(`postgres://postgres:postgres@127.0.0.1:${port}/postgres`),
      committedHeight: async () => null,
      connectTimeoutSeconds: 5,
    });
    try {
      expect(await failure(() => db.read(async () => 1))).toMatchObject({ code: "connection-lost", retryable: true });
      expect(await failure(() => db.transaction(async () => 1))).toMatchObject({
        code: "connection-lost",
        retryable: true,
      });
    } finally {
      await db.close();
    }
  }, 60_000);
});

describe("A19 (DB-13) — every other database error is not retryable", () => {
  const violations: readonly (readonly [string, string, string, string])[] = [
    ["a unique violation", "INSERT INTO t.rows VALUES (1, 'a'), (1, 'b')", "23505", "rows_pkey"],
    ["a check violation", "INSERT INTO t.checked VALUES (-1)", "23514", "checked_v_check"],
    ["a not-null violation", "INSERT INTO t.rows VALUES (1, NULL)", "23502", ""],
    ["a foreign-key violation", "INSERT INTO t.child VALUES (99)", "23503", "child_parent_fkey"],
  ];

  for (const [what, statement, sqlstate, constraint] of violations) {
    it(`gives database-error, not retryable, for ${what}, and rolls the transaction back`, async () => {
      const { database, db } = await opened();
      await database.exec(`CREATE TABLE t.checked (v integer CHECK (v > 0));
                           CREATE TABLE t.child (parent bigint REFERENCES t.blocks (height))`);
      const error = await failure(() =>
        db.transaction(async (tx) => {
          await tx.execute("INSERT INTO t.blocks VALUES (1)");
          await tx.execute(statement);
        }),
      );
      expect(error.code).toBe("database-error");
      expect(error.retryable).toBe(false);
      expect(error.details.sqlstate).toBe(sqlstate);
      if (constraint !== "") expect(error.details.constraint).toBe(constraint);
      expect(error.details.schema).toBe("t");
      expect(await rowsOf(database)).toEqual([]);
    }, 60_000);
  }

  it("gives database-error, not retryable, for a syntax error, a division by zero and a missing table", async () => {
    const { db } = await opened();
    for (const [statement, sqlstate] of [
      ["SELEC 1", "42601"],
      ["SELECT 1 / 0", "22012"],
      ["SELECT * FROM t.nowhere", "42P01"],
    ] as const) {
      const error = await failure(() => db.read((read) => read.query(statement)));
      expect(error).toMatchObject({ code: "database-error", retryable: false });
      expect(error.details.sqlstate).toBe(sqlstate);
    }
  }, 60_000);

  it("gives database-error, not retryable, for a wrong password", async () => {
    const database = await server.createDatabase();
    const url = new URL(database.url);
    url.password = "wrong";
    const db = openPostgres({ connection: connectionOfUrl(url.toString()), committedHeight: async () => null });
    try {
      const error = await failure(() => db.read(async () => 1));
      expect(error).toMatchObject({ code: "database-error", retryable: false });
      expect(error.details.sqlstate).toBe("28P01");
      expect(error.message).not.toContain("wrong");
    } finally {
      await db.close();
    }
  }, 60_000);
});

describe("classifyDriverError — the driver's errors as UmbraErrors (DB-13)", () => {
  const driverError = (fields: Record<string, unknown>) => Object.assign(new Error("driver"), fields);

  it("marks the connection failures connection-lost, retryable", () => {
    const lost = [
      driverError({ code: "CONNECTION_CLOSED" }),
      driverError({ code: "CONNECTION_DESTROYED" }),
      driverError({ code: "CONNECT_TIMEOUT" }),
      driverError({ code: "ECONNREFUSED", errno: -61 }),
      driverError({ code: "ECONNRESET" }),
      driverError({ code: "ETIMEDOUT" }),
      driverError({ code: "EPIPE" }),
      driverError({ code: "EHOSTUNREACH" }),
      driverError({ code: "ENETUNREACH" }),
      driverError({ code: "ENOTFOUND" }),
      driverError({ code: "EAI_AGAIN" }),
      ...["08000", "08001", "08003", "08004", "08006", "08007", "08P01", "57P01", "57P02", "57P03", "25P03", "57P05"].map(
        (code) => driverError({ code, severity: "FATAL" }),
      ),
    ];
    for (const error of lost) {
      const classified = classifyDriverError(error, "writer");
      expect(classified.code, String(error.code)).toBe("connection-lost");
      expect(classified.retryable).toBe(true);
      expect(classified.cause).toBe(error);
      expect(classified.details).toEqual({ connection: "writer", cause: error.code });
    }
  });

  it("marks every other error database-error, not retryable, with the server's fields", () => {
    const unique = driverError({
      name: "PostgresError",
      code: "23505",
      severity: "ERROR",
      constraint_name: "rows_pkey",
      table_name: "rows",
      schema_name: "t",
      column_name: undefined,
      detail: "Key (height)=(1) already exists.",
    });
    const classified = classifyDriverError(unique, "reader");
    expect(classified).toMatchObject({ code: "database-error", retryable: false, cause: unique });
    expect(classified.details).toEqual({ sqlstate: "23505", constraint: "rows_pkey", table: "rows", schema: "t" });
    for (const error of [
      driverError({ code: "28P01", severity: "FATAL" }),
      driverError({ code: "57P04", severity: "FATAL" }),
      driverError({ code: "53300", severity: "FATAL" }),
      driverError({ code: "40001", severity: "ERROR" }),
      driverError({ code: "UNDEFINED_VALUE" }),
      new Error("no code"),
      "not an error",
    ]) {
      const other = classifyDriverError(error, "reader");
      expect(other.code).toBe("database-error");
      expect(other.retryable).toBe(false);
    }
  });
});
