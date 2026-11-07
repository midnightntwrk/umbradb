import { afterAll, beforeAll, describe, expect, it } from "vitest";
import type { Database } from "../../src/db/api.js";
import { runMultiStatement } from "../../src/db/multi-statement.js";
import { type PostgresTestServer, startPostgresServer } from "./postgres-server.js";

/**
 * PostgreSQL's prepared statements (00033 F2): a session prepares a parameterized text once and reuses it, at most 256
 * texts in its life. A schema change on any session the process opened to the database, through any pool, or a
 * writer's rollback, retires the texts prepared before it, so a reused text never meets `cached plan must not change
 * result type` inside a transaction. Privileges are checked at each execution, under the role then current. A pool
 * opened with `preparedStatements: false` prepares nothing.
 */

const SCHEMA = `
  CREATE SCHEMA t;
  CREATE TABLE t.blocks (height bigint PRIMARY KEY);
  CREATE TABLE t.rows (height bigint PRIMARY KEY, label text NOT NULL);
  INSERT INTO t.blocks VALUES (1);
  INSERT INTO t.rows VALUES (1, 'one');
`;
const READ_ROW = "SELECT * FROM t.rows WHERE height = $1";
const committedHeight = async (read: { query(sql: string): Promise<Record<string, unknown>[]> }) =>
  ((await read.query("SELECT max(height) AS height FROM t.blocks"))[0]?.height ?? null) as bigint | null;

let server: PostgresTestServer;
beforeAll(async () => {
  server = await startPostgresServer();
}, 120_000);
afterAll(async () => {
  await server?.stop();
});

async function database(): Promise<{ db: Database; exec(sql: string): Promise<void> }> {
  const created = await server.createDatabase();
  await created.exec(SCHEMA);
  return { db: created.open({ committedHeight, readConnections: 1 }), exec: (sql) => created.exec(sql) };
}

/** The prepared statements of the session the read runs on. */
const preparedCount = async (db: Database): Promise<number> =>
  Number((await db.read((read) => read.query("SELECT count(*)::int AS n FROM pg_prepared_statements")))[0]?.n);

describe("prepared statements on PostgreSQL (00033 F2)", () => {
  it("prepares a parameterized text once per session and reuses it", async () => {
    const { db } = await database();
    for (let i = 0; i < 5; i++) await db.read((read) => read.query(READ_ROW, [1n]));
    const names = await db.read((read) =>
      read.query("SELECT statement FROM pg_prepared_statements WHERE statement LIKE 'SELECT * FROM t.rows%'"),
    );
    expect(names).toHaveLength(1);
    await db.close();
  });

  it("reuses a text after a column was added by the writer's migration: the block transaction commits, with the new column", async () => {
    const { db } = await database();
    await db.transaction((tx) => tx.query(READ_ROW, [1n]));
    await db.read((read) => read.query(READ_ROW, [1n]));
    // A later module's migration on the writer's session (a single statement, and a script).
    await db.transaction((tx) => tx.execute("ALTER TABLE t.rows ADD COLUMN extra integer NOT NULL DEFAULT 7"));
    const inBlock = await db.transaction(async (tx) => {
      const [row] = await tx.query(READ_ROW, [1n]);
      await tx.execute("INSERT INTO t.blocks VALUES (2)");
      return row;
    });
    expect(inBlock).toEqual({ height: 1n, label: "one", extra: 7 });
    // Another session (the reader) prepared it before the change too.
    const [read] = await db.read((r) => r.query(READ_ROW, [1n]));
    expect(read).toEqual({ height: 1n, label: "one", extra: 7 });
    await db.close();
  });

  it("does the same after a schema change made by a script (a migration's several statements)", async () => {
    const { db } = await database();
    await db.transaction((tx) => tx.query(READ_ROW, [1n]));
    await db.transaction((tx) => runMultiStatement(tx, "ALTER TABLE t.rows ADD COLUMN extra integer NOT NULL DEFAULT 7; SELECT 1;"));
    const [row] = await db.transaction((tx) => tx.query(READ_ROW, [1n]));
    expect(row).toEqual({ height: 1n, label: "one", extra: 7 });
    await db.close();
  });

  it("sees a schema change the writer made, in a second pool of the process that only reads the same database", async () => {
    const created = await server.createDatabase();
    await created.exec(SCHEMA);
    const writer = created.open({ committedHeight, readConnections: 1 });
    const reads = created.open({ committedHeight, readConnections: 1 });
    await reads.read((read) => read.query(READ_ROW, [1n]));
    await writer.transaction((tx) => tx.execute("ALTER TABLE t.rows ADD COLUMN extra integer NOT NULL DEFAULT 7"));
    const [row] = await reads.read((read) => read.query(READ_ROW, [1n]));
    expect(row).toEqual({ height: 1n, label: "one", extra: 7 });
    await writer.close();
    await reads.close();
  });

  it("does not reuse a text prepared after a schema change the transaction then rolled back", async () => {
    const { db } = await database();
    const failed = new Error("the migration failed");
    await expect(
      db.transaction(async (tx) => {
        await tx.execute("ALTER TABLE t.rows ADD COLUMN extra integer NOT NULL DEFAULT 7");
        // Prepared here, against the altered table.
        await tx.query(READ_ROW, [1n]);
        throw failed;
      }),
    ).rejects.toBe(failed);
    const [row] = await db.transaction((tx) => tx.query(READ_ROW, [1n]));
    expect(row).toEqual({ height: 1n, label: "one" });
    await db.close();
  });

  it("prepares nothing on a pool opened with preparedStatements: false", async () => {
    const created = await server.createDatabase();
    await created.exec(SCHEMA);
    const db = created.open({ committedHeight, readConnections: 1, preparedStatements: false });
    for (let i = 0; i < 3; i++) await db.read((read) => read.query(READ_ROW, [1n]));
    expect(await preparedCount(db)).toBe(0);
    await db.close();
  });

  it("prepares at most 256 texts on a session, and answers every query above that, unprepared", async () => {
    const { db } = await database();
    for (let i = 0; i < 400; i++) {
      const [row] = await db.read((read) => read.query(`SELECT $1::int + ${i} AS n`, [1]));
      expect(row?.n).toBe(1 + i);
    }
    expect(await preparedCount(db)).toBeLessThanOrEqual(256);
    expect(await preparedCount(db)).toBeGreaterThanOrEqual(200);
    await db.close();
  });

  it("checks privileges at each execution, under the role current then", async () => {
    const { db, exec } = await database();
    await exec("CREATE ROLE umbradb_00033_noread NOLOGIN; GRANT USAGE ON SCHEMA t TO umbradb_00033_noread;");
    await exec(`GRANT umbradb_00033_noread TO CURRENT_USER`);
    await db.transaction((tx) => tx.query(READ_ROW, [1n]));
    await expect(
      db.transaction(async (tx) => {
        await tx.execute("SET LOCAL ROLE umbradb_00033_noread");
        return tx.query(READ_ROW, [1n]);
      }),
    ).rejects.toMatchObject({ message: expect.stringMatching(/permission denied/) });
    await db.close();
  });
});
