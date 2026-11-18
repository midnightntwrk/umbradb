import { afterAll, beforeAll, describe, expect, it } from "vitest";
import type { Database } from "../../src/db/api.js";
import { runMultiStatement } from "../../src/db/multi-statement.js";
import { repeatedStatement } from "../../src/db/repeated-statements.js";
import { startTrace, stopTrace } from "../../src/trace/trace.js";
import { type PostgresTestServer, startPostgresServer } from "./postgres-server.js";

/**
 * PostgreSQL's prepared statements (00033 F2): a session prepares a parameterized text once and reuses it, at most 256
 * texts in its life. A text without parameters is prepared only where UmbraDB's own code marks it as one it repeats
 * at every block (`src/db/repeated-statements.ts`), under the same bound and the same rule for schema changes, and only
 * when it is sent with no other statement of the session unsettled; a marked text whose named execution failed is
 * retired.
 * Every other text without parameters runs unnamed, under the session's settings at each execution, as transaction
 * control and `SET` do. A schema change on any session the process opened to the database, through any pool, or a
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

/** `text`, marked as the engine marks its own repeated statements without parameters. */
const marked = (text: string): string => repeatedStatement(text);

/** What a promise rejects with, or "resolved". */
const outcome = (running: Promise<unknown>): Promise<unknown> =>
  running.then(
    () => "resolved",
    (error: unknown) => error,
  );

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

  it("prepares a marked text without parameters once per session and runs it by name; no other text without parameters, nor transaction control or SET", async () => {
    const { db } = await database();
    const head = marked("SELECT height, label FROM t.rows ORDER BY height DESC LIMIT 1");
    const blocks = marked("SELECT height FROM t.blocks ORDER BY height");
    // Every kind of text PostgreSQL plans, none of them marked.
    const others = [
      "SELECT height, label FROM t.rows ORDER BY height LIMIT 1",
      "  select count(*)::int AS n FROM t.rows",
      "WITH d AS (DELETE FROM t.rows WHERE height < 0 RETURNING *) SELECT count(*)::int AS n FROM d",
      "INSERT INTO t.rows SELECT height, label FROM t.rows WHERE height < 0",
      "UPDATE t.rows SET label = label WHERE height < 0",
      "DELETE FROM t.rows WHERE height < 0",
      "MERGE INTO t.rows AS r USING (VALUES (1::bigint)) AS v (height) ON r.height = v.height " +
        "WHEN MATCHED THEN UPDATE SET label = r.label",
      "VALUES (1)",
      "TABLE t.blocks",
    ];
    for (let i = 0; i < 4; i++) {
      await db.transaction(async (tx) => {
        await tx.execute("SET LOCAL TimeZone = 'UTC'");
        expect(await tx.query(head)).toEqual([{ height: 1n, label: "one" }]);
        expect(await tx.query(blocks)).toEqual([{ height: 1n }]);
        for (const text of others) await tx.query(text);
      });
    }
    const prepared = await db.transaction((tx) =>
      tx.query(
        "SELECT statement, (generic_plans + custom_plans)::int AS runs FROM pg_prepared_statements ORDER BY statement",
      ),
    );
    // Each marked text once, on the writer's session, and each of the four executions ran that prepared statement:
    // PostgreSQL counts a plan of it for each. No other text without parameters (the writer lock's have some).
    expect(prepared.filter((row) => !String(row.statement).includes("$"))).toEqual(
      [head, blocks].sort().map((statement) => ({ statement, runs: 4 })),
    );
    await db.close();
  });

  it("runs every other text without parameters unnamed, under the session's settings at each execution", async () => {
    const { db, exec } = await database();
    await exec("CREATE SCHEMA a; CREATE TABLE a.r (i integer); INSERT INTO a.r VALUES (1);");
    await exec("CREATE SCHEMA b; CREATE TABLE b.r (i integer, j integer); INSERT INTO b.r VALUES (1, 2);");
    const epoch = "SELECT extract(epoch FROM TIMESTAMPTZ '2000-01-01 00:00:00')::bigint AS n";
    const now = "SELECT 'now'::timestamptz AS t";
    // A literal parsed under the time zone of each execution.
    const epochs = await db.transaction(async (tx) => {
      const before = (await tx.query(epoch))[0]?.n;
      await tx.query(epoch);
      await tx.execute("SET LOCAL TimeZone = 'Asia/Tokyo'");
      return [before, (await tx.query(epoch))[0]?.n];
    });
    expect(epochs).toEqual([946684800n, 946652400n]);
    // A time read when each execution is parsed.
    const first = await db.transaction(async (tx) => {
      await tx.query(now);
      return (await tx.query(now))[0]?.t;
    });
    await new Promise((resolve) => setTimeout(resolve, 20));
    expect((await db.transaction((tx) => tx.query(now)))[0]?.t).not.toEqual(first);
    // A table found by the search path of each execution: another one, with other columns, after it changes.
    const tables = await db.transaction(async (tx) => {
      await tx.execute("SET LOCAL search_path = a");
      const before = await tx.query("SELECT * FROM r");
      await tx.query("SELECT * FROM r");
      await tx.execute("SET LOCAL search_path = b");
      return [before, await tx.query("SELECT * FROM r")];
    });
    expect(tables).toEqual([[{ i: 1 }], [{ i: 1, j: 2 }]]);
    for (const text of [epoch, now, "SELECT * FROM r"]) expect(await preparedCount(db), text).toBe(0);
    await db.close();
  });

  it("prepares a marked text once on a session when many executions of it are sent at once: the others run unnamed", async () => {
    const { db } = await database();
    const texts = [1, 2, 3].map((batch) =>
      marked(`SELECT height, label, ${batch} AS batch FROM t.rows ORDER BY height`),
    );
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
    await db.close();
  });

  it("runs statements sent at once in the order they were sent, a marked text among them", async () => {
    const { db } = await database();
    const count = marked("SELECT count(*)::int AS n FROM t.rows");
    const add = "INSERT INTO t.rows SELECT max(height) + 1, 'added' FROM t.rows";
    const counts = await db.transaction(async (tx) => {
      const sent = [count, count, add, count, add, count, count].map((text) => tx.query(text));
      return (await Promise.all(sent)).map((rows) => rows[0]?.n);
    });
    expect(counts).toEqual([1, 1, undefined, 2, undefined, 3, 3]);
    await db.close();
  });

  it("answers a text sent at once behind a change of its table's columns on one handle with the new columns, marked or not", async () => {
    for (const text of ["SELECT * FROM t.rows", marked("SELECT * FROM t.rows WHERE height > 0")]) {
      const { db } = await database();
      const rows = await db.transaction(async (tx) => {
        await tx.query(text);
        await tx.query(text);
        const [, answer] = await Promise.all([
          tx.execute("ALTER TABLE t.rows ADD COLUMN extra integer DEFAULT 7"),
          tx.query(text),
        ]);
        return answer;
      });
      expect(rows, text).toEqual([{ height: 1n, label: "one", extra: 7 }]);
      expect(await db.transaction((tx) => tx.query(text)), text).toEqual([{ height: 1n, label: "one", extra: 7 }]);
      await db.close();
    }
  });

  it("retires a marked text whose named execution failed: the server keeps one statement of it, whatever is sent after", async () => {
    const created = await server.createDatabase();
    await created.exec(SCHEMA);
    const db = created.open({ committedHeight, readConnections: 1 });
    const text = marked("SELECT * FROM t.rows ORDER BY height");
    await db.read((read) => read.query(text));
    await db.read((read) => read.query(text));
    const columns: Record<string, unknown> = { height: 1n, label: "one" };
    for (let round = 0; round < 3; round++) {
      // A change of the table's columns the process does not see (another client's): the reader's statement is stale.
      await created.exec(`ALTER TABLE t.rows ADD COLUMN c${round} integer NOT NULL DEFAULT ${round}`);
      columns[`c${round}`] = round;
      const failed = await outcome(db.read((read) => read.query(text)));
      if (round === 0) {
        expect(failed).toMatchObject({ message: expect.stringMatching(/cached plan must not change result type/) });
      } else {
        expect(failed).toBe("resolved");
      }
      const answers = await db.read((read) => Promise.all(Array.from({ length: 100 }, () => read.query(text))));
      for (const rows of answers) expect(rows).toEqual([columns]);
    }
    const [counts] = await db.read((read) =>
      read.query(
        "SELECT count(*)::int AS n, count(*) FILTER (WHERE statement = $1)::int AS of_text FROM pg_prepared_statements",
        [text],
      ),
    );
    expect(counts).toEqual({ n: 2, of_text: 1 });
    await db.close();
  });

  it("reuses a marked text after a column was added: no cached plan of another result type is met", async () => {
    const { db } = await database();
    const all = marked("SELECT * FROM t.rows ORDER BY height");
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

  it("counts marked texts in the bound of 256, and answers every query above it, unprepared", async () => {
    const { db } = await database();
    for (let i = 0; i < 400; i++) {
      const [row] = await db.read((read) => read.query(marked(`SELECT ${i} AS n`)));
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

  describe("the same for a marked text without parameters", () => {
    const READ_ONE = marked("SELECT * FROM t.rows WHERE height = 1");

    it("after a schema change made by a script (a migration's several statements)", async () => {
      const { db } = await database();
      await db.transaction((tx) => tx.query(READ_ONE));
      await db.transaction((tx) => runMultiStatement(tx, "ALTER TABLE t.rows ADD COLUMN extra integer NOT NULL DEFAULT 7; SELECT 1;"));
      const [row] = await db.transaction((tx) => tx.query(READ_ONE));
      expect(row).toEqual({ height: 1n, label: "one", extra: 7 });
      await db.close();
    });

    it("after a schema change the writer made, in a second pool of the process that only reads the same database", async () => {
      const created = await server.createDatabase();
      await created.exec(SCHEMA);
      const writer = created.open({ committedHeight, readConnections: 1 });
      const reads = created.open({ committedHeight, readConnections: 1 });
      await reads.read((read) => read.query(READ_ONE));
      await writer.transaction((tx) => tx.execute("ALTER TABLE t.rows ADD COLUMN extra integer NOT NULL DEFAULT 7"));
      const [row] = await reads.read((read) => read.query(READ_ONE));
      expect(row).toEqual({ height: 1n, label: "one", extra: 7 });
      await writer.close();
      await reads.close();
    });

    it("not reused after a schema change the transaction that prepared it then rolled back", async () => {
      const { db } = await database();
      const failed = new Error("the migration failed");
      await expect(
        db.transaction(async (tx) => {
          await tx.execute("ALTER TABLE t.rows ADD COLUMN extra integer NOT NULL DEFAULT 7");
          // Prepared here, against the altered table.
          await tx.query(READ_ONE);
          throw failed;
        }),
      ).rejects.toBe(failed);
      const [row] = await db.transaction((tx) => tx.query(READ_ONE));
      expect(row).toEqual({ height: 1n, label: "one" });
      await db.close();
    });

    it("privileges checked at each execution, under the role current then", async () => {
      const { db, exec } = await database();
      await exec("CREATE ROLE umbradb_parameterless_noread NOLOGIN; GRANT USAGE ON SCHEMA t TO umbradb_parameterless_noread;");
      await exec(`GRANT umbradb_parameterless_noread TO CURRENT_USER`);
      await db.transaction((tx) => tx.query(READ_ONE));
      await expect(
        db.transaction(async (tx) => {
          await tx.execute("SET LOCAL ROLE umbradb_parameterless_noread");
          return tx.query(READ_ONE);
        }),
      ).rejects.toMatchObject({ message: expect.stringMatching(/permission denied/) });
      await db.close();
    });
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

  it("runs a marked text right at every execution after a schema change, its retired statement never again", async () => {
    const { db } = await database();
    const all = marked("SELECT * FROM t.rows ORDER BY height");
    const runsOf = async (): Promise<Record<string, unknown>[]> =>
      db.transaction((tx) =>
        tx.query(
          "SELECT (generic_plans + custom_plans)::int AS runs FROM pg_prepared_statements WHERE statement = $1",
          [all],
        ),
      );
    for (let i = 0; i < 2; i++) await db.transaction((tx) => tx.query(all));
    expect(await runsOf()).toEqual([{ runs: 2 }]);
    await db.transaction((tx) => tx.execute("ALTER TABLE t.rows ADD COLUMN extra integer NOT NULL DEFAULT 7"));
    for (let i = 0; i < 3; i++) {
      expect(await db.transaction((tx) => tx.query(all))).toEqual([{ height: 1n, label: "one", extra: 7 }]);
    }
    // The statement prepared before the change ran no more, and none other was prepared for the text on this session.
    expect(await runsOf()).toEqual([{ runs: 2 }]);
    await db.close();
  });

  it("runs an unmarked text against the table the search path finds at each execution, a temporary one among them", async () => {
    const { db } = await database();
    const rows = await db.transaction(async (tx) => {
      await tx.execute("SET LOCAL search_path = t");
      const before = await tx.query("SELECT * FROM rows");
      await tx.query("SELECT * FROM rows");
      await tx.execute("CREATE TEMPORARY TABLE rows (height bigint, note text) ON COMMIT DROP");
      await tx.execute("INSERT INTO pg_temp.rows VALUES (9, 'temporary')");
      return [before, await tx.query("SELECT * FROM rows")];
    });
    expect(rows).toEqual([[{ height: 1n, label: "one" }], [{ height: 9n, note: "temporary" }]]);
    await db.close();
  });

  it("gives a replaced writer's session a bound of its own: a marked text is prepared there after the session before used it all", async () => {
    const created = await server.createDatabase();
    await created.exec(SCHEMA);
    const db = created.open({ committedHeight, readConnections: 1 });
    const text = marked("SELECT count(*)::int AS n FROM t.rows");
    const ofText =
      "SELECT pg_backend_pid() AS pid, count(*)::int AS n FROM pg_prepared_statements WHERE statement = $1";
    const pid = await db.transaction(async (tx) => {
      for (let i = 0; i < 300; i++) await tx.query(`SELECT $1::int + ${i} AS n`, [1]);
      await tx.query(text);
      await tx.query(text);
      const [row] = await tx.query(ofText, [text]);
      expect(row?.n).toBe(0);
      return row?.pid as number;
    });
    const before = db.writerSession();
    await created.terminate(pid);
    // The first transaction may find the session lost (retryable); a later one runs on a new session.
    let after: Record<string, unknown> | undefined;
    for (let attempt = 0; attempt < 5 && after === undefined; attempt++) {
      after = await db
        .transaction(async (tx) => {
          await tx.query(text);
          await tx.query(text);
          return (await tx.query(ofText, [text]))[0];
        })
        .catch((error: unknown) => {
          expect(error).toMatchObject({ code: "connection-lost" });
          return undefined;
        });
    }
    expect(after?.pid).not.toBe(pid);
    expect(after?.n).toBe(1);
    expect(db.writerSession()).not.toBe(before);
    await db.close();
  });

  it("counts every execution of a marked text in the trace's statements, named or unnamed, with its time", async () => {
    const { db } = await database();
    const text = marked("SELECT count(*)::int AS traced FROM t.rows");
    let totals = "[]";
    startTrace({ blocks: () => undefined, statements: (json) => void (totals = json), worker: () => undefined });
    let runs: unknown;
    try {
      runs = await db.transaction(async (tx) => {
        await tx.query(text);
        await tx.query(text);
        // The first of these is alone and runs by name; the two sent beside it run unnamed.
        await Promise.all([tx.query(text), tx.query(text), tx.query(text)]);
        const [row] = await tx.query(
          "SELECT (generic_plans + custom_plans)::int AS runs FROM pg_prepared_statements WHERE statement = $1",
          [text],
        );
        return row?.runs;
      });
    } finally {
      stopTrace();
    }
    expect(runs).toBe(3);
    const entry = (JSON.parse(totals) as { q: string; n: number; ms: number }[]).find((total) => total.q === text);
    expect(entry?.n).toBe(5);
    expect(entry?.ms).toBeGreaterThan(0);
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
