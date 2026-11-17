import { afterAll, beforeAll, describe, expect, it } from "vitest";
import type { Database } from "../../src/db/api.js";
import { runMultiStatement } from "../../src/db/multi-statement.js";
import { type PostgresTestServer, startPostgresServer } from "./postgres-server.js";

/**
 * PostgreSQL's prepared statements (00033 F2): a session prepares a parameterized text once and reuses it, at most 256
 * texts in its life. A text PostgreSQL plans is prepared too when it takes no parameter: the statements a block
 * repeats without one are then planned once, under the same bound and the same rule for schema changes; transaction
 * control and `SET` are never prepared. A schema change on any session the process opened to the database, through any
 * pool, or a writer's rollback, retires the texts prepared before it, so a reused text never meets `cached plan must
 * not change result type` inside a transaction. Privileges are checked at each execution, under the role then current.
 * A pool opened with `preparedStatements: false` prepares nothing.
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

  it("prepares a text that takes no parameter once per session and reuses it, whatever PostgreSQL plans; never transaction control or SET", async () => {
    const { db, exec } = await database();
    await exec("CREATE ROLE umbradb_parameterless_reader NOLOGIN; GRANT USAGE ON SCHEMA t TO umbradb_parameterless_reader; GRANT SELECT ON t.rows TO umbradb_parameterless_reader; GRANT umbradb_parameterless_reader TO CURRENT_USER");
    const texts = [
      "SELECT height, label FROM t.rows ORDER BY height DESC LIMIT 1",
      "  select count(*)::int AS n FROM t.rows",
      "WITH d AS (DELETE FROM t.rows WHERE height < 0 RETURNING *) SELECT count(*)::int AS n FROM d",
      "INSERT INTO t.rows SELECT height, label FROM t.rows WHERE height < 0",
      "UPDATE t.rows SET label = label WHERE height < 0",
      "DELETE FROM t.rows WHERE height < 0",
      "VALUES (1)",
      "TABLE t.blocks",
    ];
    for (let i = 0; i < 4; i++) {
      await db.transaction(async (tx) => {
        await tx.execute('SET LOCAL ROLE "umbradb_parameterless_reader"');
        expect(await tx.query(texts[0] as string)).toEqual([{ height: 1n, label: "one" }]);
        await tx.execute("RESET ROLE");
        for (const text of texts.slice(1)) await tx.query(text);
      });
    }
    const prepared = await db.transaction((tx) => tx.query("SELECT statement FROM pg_prepared_statements"));
    const statements = prepared.map((row) => String(row.statement));
    // Each once, on the writer's session.
    for (const text of texts) expect(statements.filter((statement) => statement === text), text).toHaveLength(1);
    expect(statements.filter((statement) => /^\s*(SET|RESET|BEGIN|COMMIT|ROLLBACK)\b/i.test(statement))).toEqual([]);
    await db.close();
  });

  it("prepares a text once on a session when many executions of it are sent at once, before the first is answered", async () => {
    const { db } = await database();
    const texts = [1, 2, 3].map((batch) => `SELECT height, label, ${batch} AS batch FROM t.rows ORDER BY height`);
    const prepared = await db.transaction(async (tx) => {
      for (const [index, text] of texts.entries()) {
        const answers = await Promise.all(Array.from({ length: 100 }, () => tx.query(text)));
        for (const rows of answers) expect(rows).toEqual([{ height: 1n, label: "one", batch: index + 1 }]);
      }
      // A text with parameters, the same way: the driver describes it first and sends nothing behind it meanwhile.
      const answers = await Promise.all(Array.from({ length: 100 }, () => tx.query(READ_ROW, [1n])));
      for (const rows of answers) expect(rows).toEqual([{ height: 1n, label: "one" }]);
      return tx.query("SELECT statement FROM pg_prepared_statements");
    });
    const statements = prepared.map((row) => String(row.statement));
    expect([...texts, READ_ROW].map((text) => statements.filter((statement) => statement === text).length)).toEqual([
      1, 1, 1, 1,
    ]);
    expect(statements.length).toBeLessThanOrEqual(256);
    await db.close();
  });

  it("keeps the bound of 256 on the server's prepared statements when executions of new texts are sent at once", async () => {
    const { db } = await database();
    const prepared = await db.read(async (read) => {
      const texts = Array.from({ length: 300 }, (_, i) => `SELECT ${i} AS n`);
      const answers = await Promise.all(texts.flatMap((text) => [read.query(text), read.query(text)]));
      expect(answers.map((rows) => rows[0]?.n)).toEqual(texts.flatMap((_, i) => [i, i]));
      return read.query("SELECT statement FROM pg_prepared_statements");
    });
    expect(prepared.length).toBeLessThanOrEqual(256);
    expect(prepared.length).toBeGreaterThanOrEqual(200);
    await db.close();
  });

  it("runs statements sent at once in the order they were sent, a text's first named execution among them", async () => {
    const { db } = await database();
    const count = "SELECT count(*)::int AS n FROM t.rows";
    const add = "INSERT INTO t.rows SELECT max(height) + 1, 'added' FROM t.rows";
    const counts = await db.transaction(async (tx) => {
      const sent = [count, count, add, count, add, count, count].map((text) => tx.query(text));
      return (await Promise.all(sent)).map((rows) => rows[0]?.n);
    });
    expect(counts).toEqual([1, 1, undefined, 2, undefined, 3, 3]);
    await db.close();
  });

  it("reuses a parameterless text after a column was added: no cached plan of another result type is met", async () => {
    const { db } = await database();
    const all = "SELECT * FROM t.rows ORDER BY height";
    await db.transaction((tx) => tx.query(all));
    await db.read((read) => read.query(all));
    await db.transaction((tx) => tx.execute("ALTER TABLE t.rows ADD COLUMN extra integer NOT NULL DEFAULT 7"));
    const inBlock = await db.transaction(async (tx) => {
      const rows = await tx.query(all);
      await tx.execute("INSERT INTO t.blocks VALUES (2)");
      return rows;
    });
    expect(inBlock).toEqual([{ height: 1n, label: "one", extra: 7 }]);
    expect(await db.read((read) => read.query(all))).toEqual([{ height: 1n, label: "one", extra: 7 }]);
    await db.close();
  });

  it("counts parameterless texts in the bound of 256, and answers every query above it, unprepared", async () => {
    const { db } = await database();
    for (let i = 0; i < 400; i++) {
      const [row] = await db.read((read) => read.query(`SELECT ${i} AS n`));
      expect(row?.n).toBe(i);
    }
    expect(await preparedCount(db)).toBeLessThanOrEqual(256);
    expect(await preparedCount(db)).toBeGreaterThanOrEqual(200);
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
