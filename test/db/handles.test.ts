import { afterAll, beforeAll, describe, expect, expectTypeOf, it } from "vitest";
import type {
  BlockWriteHandle,
  CommittedHeight,
  Database,
  ReadHandle,
  SchemaWriteHandle,
  Transaction,
} from "../../src/db/api.js";
import { UmbraError } from "../../src/db/errors.js";
import type { RepeatedStatement } from "../../src/db/repeated-statements.js";
import type { ConsistentRead } from "../../src/determinism/module-tables.js";
import { askedLater, BACKENDS, settlesWithin, TEST_CURSOR, TEST_SCHEMA } from "./backends.js";

/**
 * Read handles and writer transactions, on every backend of `backends.ts`:
 * - a read handle sees one committed height and reports it;
 * - a transaction commits when its body resolves and rolls back when it throws;
 * - a handle used after its read or transaction ended is refused (`handle-closed`) instead of reaching the database.
 *
 * A commit asked for while a read is open lands between the read's statements on PostgreSQL. On PGlite it waits until
 * the read ends, which the same tests check there instead of waiting for it inside the read.
 */

async function failure(run: () => Promise<unknown>): Promise<UmbraError> {
  try {
    await run();
  } catch (error) {
    if (error instanceof UmbraError) return error;
    throw error;
  }
  throw new Error("expected an UmbraError");
}

const commitHeight = (db: Database, height: bigint) =>
  db.transaction(async (tx) => {
    await tx.execute("INSERT INTO t.blocks VALUES ($1)", [height]);
    await tx.execute("INSERT INTO t.rows VALUES ($1, $2)", [height, `row ${height}`]);
  });

describe("the handles' types", () => {
  it("are the database API's interfaces, and each serves as the determinism code's ConsistentRead", () => {
    expectTypeOf<ReadHandle["height"]>().toEqualTypeOf<bigint | null>();
    // A statement's text, or one of the engine's marked statements (`src/db/repeated-statements.ts`).
    expectTypeOf<ReadHandle["query"]>().toEqualTypeOf<
      (sql: string | RepeatedStatement, params?: unknown[]) => Promise<Record<string, unknown>[]>
    >();
    expectTypeOf<Transaction["query"]>().toEqualTypeOf<ReadHandle["query"]>();
    expectTypeOf<Transaction["execute"]>().toEqualTypeOf<(sql: string, params?: unknown[]) => Promise<number>>();
    expectTypeOf<BlockWriteHandle>().toExtend<ReadHandle>();
    expectTypeOf<BlockWriteHandle["execute"]>().toEqualTypeOf<(sql: string, params?: unknown[]) => Promise<number>>();
    expectTypeOf<SchemaWriteHandle>().toEqualTypeOf<BlockWriteHandle>();
    expectTypeOf<ReadHandle>().toExtend<ConsistentRead>();
    expectTypeOf<BlockWriteHandle>().toExtend<ConsistentRead>();
    expectTypeOf<Transaction>().toExtend<ConsistentRead>();
    expectTypeOf<CommittedHeight>().parameter(0).toEqualTypeOf<Pick<ReadHandle, "query">>();
  });
});

for (const backend of BACKENDS) {
  beforeAll(() => backend.start(), 180_000);
  afterAll(() => backend.stop(), 60_000);

  describe(`read handles on ${backend.name}`, () => {
    it("reports a null height before any height commits", async () => {
      const { db } = await backend.database(TEST_SCHEMA, TEST_CURSOR);
      expect(await db.read(async (read) => read.height)).toBeNull();
    });

    it("lets two statements see the same height when the writer commits between them, and reports it", async () => {
      const { db } = await backend.database(TEST_SCHEMA, TEST_CURSOR);
      await commitHeight(db, 1n);
      const commit = askedLater(() => commitHeight(db, 2n));
      const seen = await db.read(async (read) => {
        const [first] = await read.query("SELECT max(height) AS height, count(*) AS n FROM t.rows");
        commit.gate();
        if (backend.singleQueue) expect(await settlesWithin(commit.result, 50)).toBe(false);
        else await commit.result;
        const [second] = await read.query("SELECT max(height) AS height, count(*) AS n FROM t.rows");
        return { reported: read.height, first, second };
      });
      await commit.result;
      expect(seen).toEqual({ reported: 1n, first: { height: 1n, n: 1n }, second: { height: 1n, n: 1n } });
      expect(await db.read(async (read) => read.height)).toBe(2n);
    });

    it("reads the height inside the handle's own snapshot, before the body runs", async () => {
      let calls = 0;
      const { db } = await backend.database(TEST_SCHEMA, async (read) => {
        calls++;
        return TEST_CURSOR(read);
      });
      await commitHeight(db, 1n);
      const commit = askedLater(() => commitHeight(db, 2n));
      const height = await db.read(async (read) => {
        expect(calls).toBe(1);
        commit.gate();
        if (backend.singleQueue) expect(await settlesWithin(commit.result, 50)).toBe(false);
        else await commit.result;
        const [row] = await read.query("SELECT max(height) AS height FROM t.blocks");
        return [read.height, row?.height];
      });
      await commit.result;
      expect(height).toEqual([1n, 1n]);
    });

    it("returns the body's result and passes the body's own error through unchanged", async () => {
      const { db } = await backend.database(TEST_SCHEMA, TEST_CURSOR);
      expect(await db.read(async () => "result")).toBe("result");
      const own = new Error("the body's own");
      await expect(db.read(async () => Promise.reject(own))).rejects.toBe(own);
    });

    it("is read-only: a write through a read handle is a database error, not retryable", async () => {
      const { db } = await backend.database(TEST_SCHEMA, TEST_CURSOR);
      const error = await failure(() => db.read((read) => read.query("INSERT INTO t.blocks VALUES (1)")));
      expect(error.code).toBe("database-error");
      expect(error.retryable).toBe(false);
      expect(error.details.sqlstate).toBe("25006");
      expect(await db.read(async (read) => read.height)).toBeNull();
    });

    it("refuses COMMIT and SAVEPOINT through a read handle before sending them: the read goes on, and the INSERT after the COMMIT is refused as a write", async () => {
      const { db } = await backend.database(TEST_SCHEMA, TEST_CURSOR);
      const seen = await db.read(async (read) => ({
        commit: await failure(() => read.query("COMMIT")),
        savepoint: await failure(() => read.query("SAVEPOINT s")),
        // Nothing was sent: the read's transaction is neither ended nor aborted.
        next: await read.query("SELECT count(*) AS n FROM t.rows"),
        insert: await failure(() => read.query("INSERT INTO t.rows VALUES (77, 'through a read handle')")),
      }));
      for (const [error, command] of [
        [seen.commit, "COMMIT"],
        [seen.savepoint, "SAVEPOINT"],
      ] as const) {
        expect(error.code).toBe("database-error");
        expect(error.retryable).toBe(false);
        expect(error.details).toEqual({ reason: "control-refused", command });
      }
      expect(seen.next).toEqual([{ n: 0n }]);
      expect(seen.insert.details.sqlstate).toBe("25006");
      expect(await db.read((read) => read.query("SELECT count(*) AS n FROM t.rows"))).toEqual([{ n: 0n }]);
    });

    it("refuses transaction control behind empty statements and a session authorization under a Unicode name through a read handle, and the session keeps its login", async () => {
      const role = "umbradb_handles_check";
      const { db } = await backend.database(
        `${TEST_SCHEMA} DO $$ BEGIN CREATE ROLE ${role} NOLOGIN; EXCEPTION WHEN duplicate_object THEN NULL; END $$;`,
        TEST_CURSOR,
      );
      const who = "SELECT current_user::text AS current_user, session_user::text AS session_user";
      const [before] = await db.read((read) => read.query(who));
      const spellings: readonly (readonly [string, string])[] = [
        ["; COMMIT", "COMMIT"],
        [";; ROLLBACK", "ROLLBACK"],
        [" ; /* a comment */ ; SAVEPOINT s", "SAVEPOINT"],
        // Two statements, the first one transaction control: refused here, not by the server.
        ["COMMIT; SELECT 1", "COMMIT"],
        [`; SET SESSION AUTHORIZATION ${role}`, "SET SESSION AUTHORIZATION"],
        [`SET U&"session_authorization" = '${role}'`, "SET SESSION AUTHORIZATION"],
        [`SET U&"\\0073ession_authorization" = '${role}'`, "SET SESSION AUTHORIZATION"],
        [`SET LOCAL U&"!0073ession_authorization" UESCAPE '!' = '${role}'`, "SET SESSION AUTHORIZATION"],
      ];
      const seen = await db.read(async (read) => {
        const refused: unknown[] = [];
        for (const [sql] of spellings) refused.push((await failure(() => read.query(sql))).details);
        return {
          refused,
          // Nothing was sent: the read's transaction is neither ended nor aborted, and still read-only.
          who: await read.query(who),
          insert: await failure(() => read.query("INSERT INTO t.rows VALUES (77, 'through a read handle')")),
        };
      });
      expect(seen.refused).toEqual(spellings.map(([, command]) => ({ reason: "control-refused", command })));
      expect(seen.who).toEqual([before]);
      expect(seen.insert.details.sqlstate).toBe("25006");
      expect(await db.read((read) => read.query(who))).toEqual([before]);
      expect(await db.read((read) => read.query("SELECT count(*) AS n FROM t.rows"))).toEqual([{ n: 0n }]);
    });

    it("accepts a statement prepared under the name transaction through a read handle; a text of two statements is refused by the server (42601)", async () => {
      const { db } = await backend.database(TEST_SCHEMA, TEST_CURSOR);
      const executed = await db.read(async (read) => {
        await read.query("PREPARE transaction AS SELECT 7 AS n");
        const plain = await read.query("EXECUTE transaction");
        await read.query("DEALLOCATE transaction");
        await read.query("PREPARE transaction (int) AS SELECT $1 + 1 AS n");
        const typed = await read.query("EXECUTE transaction (7)");
        await read.query("DEALLOCATE transaction");
        return [plain, typed];
      });
      expect(executed).toEqual([[{ n: 7 }], [{ n: 8 }]]);
      for (const [sql, params] of [
        ["SELECT 1 AS one; COMMIT", []],
        ["SELECT $1::int AS one; COMMIT", [1]],
      ] as const) {
        const refused = await db.read((read) => failure(() => read.query(sql, [...params])));
        expect(refused.details.sqlstate).toBe("42601");
      }
    });

    it("refuses a read handle used after its read ended (handle-closed)", async () => {
      const { db } = await backend.database(TEST_SCHEMA, TEST_CURSOR);
      const kept = await db.read(async (read) => read);
      const error = await failure(() => kept.query("SELECT 1"));
      expect(error.code).toBe("handle-closed");
      expect(error.retryable).toBe(false);
    });

    it("lets no session setting a transaction committed reach a later read, and keeps it for later transactions", async () => {
      const role = `t_role_${process.pid}`;
      const { db } = await backend.database(
        `${TEST_SCHEMA}
         DO $$ BEGIN CREATE ROLE ${role} NOLOGIN; EXCEPTION WHEN duplicate_object THEN NULL; END $$;`,
        TEST_CURSOR,
      );
      const state = `SELECT current_setting('TimeZone') AS zone, current_setting('bytea_output') AS bytea_output,
                            current_setting('search_path') AS path, current_user = session_user AS own_role,
                            '\\x01ff'::bytea AS bytes`;
      const before = (await db.read((read) => read.query(state)))[0];
      await db.transaction(async (tx) => {
        await tx.execute("SET TimeZone = 'Asia/Tokyo'");
        await tx.execute("SET search_path = pg_catalog");
        await tx.execute("SET bytea_output = escape");
        await tx.execute(`SET ROLE ${role}`);
      });
      for (let i = 0; i < 3; i++) expect((await db.read((read) => read.query(state)))[0]).toEqual(before);
      expect(before).toMatchObject({ zone: "UTC", bytea_output: "hex", own_role: true, bytes: new Uint8Array([1, 255]) });
      const kept = await db.transaction((tx) =>
        tx.query(`SELECT current_setting('TimeZone') AS zone, current_setting('search_path') AS path,
                         current_setting('bytea_output') AS bytea_output, current_user AS who`),
      );
      expect(kept).toEqual([{ zone: "Asia/Tokyo", path: "pg_catalog", bytea_output: "escape", who: role }]);
    });

    it("leaves no session setting behind for the next read", async () => {
      const { db } = await backend.database(TEST_SCHEMA, TEST_CURSOR);
      const zone = "SELECT current_setting('TimeZone') AS zone";
      for (let i = 0; i < 4; i++) {
        await db.read(async (read) => {
          const [before] = await read.query(zone);
          expect(before?.zone).toBe("UTC");
          await read.query("SET TimeZone = 'Asia/Tokyo'");
        });
      }
    });
  });

  describe(`writer transactions on ${backend.name}`, () => {
    it("commits when the body resolves, and execute returns the rows affected", async () => {
      const { db } = await backend.database(TEST_SCHEMA, TEST_CURSOR);
      const counts = await db.transaction(async (tx) => [
        await tx.execute("INSERT INTO t.rows VALUES (1, 'a'), (2, 'b'), (3, 'c')"),
        await tx.execute("UPDATE t.rows SET label = 'z' WHERE height > $1", [1n]),
        await tx.execute("DELETE FROM t.rows WHERE height = 99"),
      ]);
      expect(counts).toEqual([3, 2, 0]);
      const rows = await db.read((read) => read.query("SELECT height, label FROM t.rows ORDER BY height"));
      expect(rows).toEqual([
        { height: 1n, label: "a" },
        { height: 2n, label: "z" },
        { height: 3n, label: "z" },
      ]);
    });

    it("rolls back when the body throws, passing the body's own error through unchanged", async () => {
      const { db } = await backend.database(TEST_SCHEMA, TEST_CURSOR);
      const own = new Error("the body's own");
      await expect(
        db.transaction(async (tx) => {
          await tx.execute("INSERT INTO t.rows VALUES (1, 'a')");
          throw own;
        }),
      ).rejects.toBe(own);
      expect(await db.read((read) => read.query("SELECT count(*) AS n FROM t.rows"))).toEqual([{ n: 0n }]);
    });

    it("does not report a commit when a failed statement aborted the transaction and the body caught its error", async () => {
      const { db } = await backend.database(TEST_SCHEMA, TEST_CURSOR);
      let caught: unknown;
      const error = await failure(() =>
        db.transaction(async (tx) => {
          await tx.execute("INSERT INTO t.rows VALUES (1, 'a')");
          caught = await tx.execute("INSERT INTO t.rows VALUES (1, 'again')").catch((e: unknown) => e);
        }),
      );
      expect((caught as UmbraError).details.sqlstate).toBe("23505");
      expect(error.code).toBe("database-error");
      expect(error.retryable).toBe(false);
      expect(error.details.reason).toBe("commit-rolled-back");
      expect(await db.read((read) => read.query("SELECT count(*) AS n FROM t.rows"))).toEqual([{ n: 0n }]);
    });

    it("commits after a failed statement the body rolled back to a savepoint", async () => {
      const { db } = await backend.database(TEST_SCHEMA, TEST_CURSOR);
      await db.transaction(async (tx) => {
        await tx.execute("INSERT INTO t.rows VALUES (1, 'a')");
        await tx.execute("SAVEPOINT s");
        await tx.execute("INSERT INTO t.rows VALUES (1, 'again')").catch(() => undefined);
        await tx.execute("ROLLBACK TO SAVEPOINT s");
      });
      expect(await db.read((read) => read.query("SELECT label FROM t.rows"))).toEqual([{ label: "a" }]);
    });

    it("sees its own uncommitted rows", async () => {
      const { db } = await backend.database(TEST_SCHEMA, TEST_CURSOR);
      const inside = await db.transaction(async (tx) => {
        await tx.execute("INSERT INTO t.rows VALUES (7, 'mine')");
        return tx.query("SELECT label FROM t.rows");
      });
      expect(inside).toEqual([{ label: "mine" }]);
    });

    it("runs transactions one at a time, in the order they were asked for", async () => {
      const { db } = await backend.database(TEST_SCHEMA, TEST_CURSOR);
      const log: string[] = [];
      const run = (name: string) =>
        db.transaction(async (tx) => {
          log.push(`${name} begins`);
          await tx.query("SELECT pg_sleep(0.05)");
          log.push(`${name} ends`);
        });
      await Promise.all([run("a"), run("b"), run("c")]);
      expect(log).toEqual(["a begins", "a ends", "b begins", "b ends", "c begins", "c ends"]);
    });

    it("refuses a transaction handle used after its transaction ended (handle-closed)", async () => {
      const { db } = await backend.database(TEST_SCHEMA, TEST_CURSOR);
      const kept = await db.transaction(async (tx) => tx);
      for (const use of [() => kept.query("SELECT 1"), () => kept.execute("INSERT INTO t.rows VALUES (1, 'late')")]) {
        const error = await failure(use);
        expect(error.code).toBe("handle-closed");
      }
      expect(await db.read((read) => read.query("SELECT count(*) AS n FROM t.rows"))).toEqual([{ n: 0n }]);
    });

    it("refuses reads and transactions after the database is closed", async () => {
      const { db } = await backend.database(TEST_SCHEMA, TEST_CURSOR);
      await db.read(async (read) => read.height);
      await db.close();
      expect((await failure(() => db.read(async () => 1))).code).toBe("handle-closed");
      expect((await failure(() => db.transaction(async () => 1))).code).toBe("handle-closed");
      await db.close();
    });
  });
}
