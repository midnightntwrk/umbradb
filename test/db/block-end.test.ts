import { afterAll, beforeAll, describe, expect, it } from "vitest";
import type { Database, Transaction } from "../../src/db/api.js";
import { CONSTRAINTS, endBlock, STATE } from "../../src/db/block-end.js";
import { UmbraError } from "../../src/db/errors.js";
import { readView } from "../../src/db/read-view.js";
import { BACKENDS } from "./backends.js";

/**
 * The end of a block inside a transaction that goes on (`src/db/block-end.ts`), on PostgreSQL 18 and PGlite 0.5.10,
 * each case on a database of its own. A "block" here is a group of statements followed by `endBlock`, inside one
 * transaction; the same statements each in a transaction of its own are what they are compared with.
 */

const SCHEMA = `
  CREATE SCHEMA t;
  CREATE TABLE t.parents (id bigint PRIMARY KEY);
  CREATE TABLE t.children (id bigint PRIMARY KEY, parent bigint NOT NULL,
    CONSTRAINT child_parent FOREIGN KEY (parent) REFERENCES t.parents (id) DEFERRABLE INITIALLY DEFERRED);
  CREATE TABLE t.once (id bigint PRIMARY KEY, k bigint NOT NULL, CONSTRAINT k_once UNIQUE (k) DEFERRABLE INITIALLY DEFERRED);
  CREATE TABLE t.fired (id bigint PRIMARY KEY);
  CREATE FUNCTION t.note() RETURNS trigger LANGUAGE plpgsql AS $$ BEGIN INSERT INTO t.fired (id) VALUES (NEW.id); RETURN NULL; END $$;
  CREATE CONSTRAINT TRIGGER noted AFTER INSERT ON t.parents DEFERRABLE INITIALLY DEFERRED FOR EACH ROW EXECUTE FUNCTION t.note();
`;

/** A schema with no deferrable constraint. */
const PLAIN = "CREATE SCHEMA t; CREATE TABLE t.rows (id bigint PRIMARY KEY);";

/** A constraint that is deferrable and checked at each statement unless a transaction defers it. */
const IMMEDIATE = "CREATE TABLE t.pairs (id bigint PRIMARY KEY, k bigint NOT NULL, CONSTRAINT k_pair UNIQUE (k) DEFERRABLE INITIALLY IMMEDIATE);";

/** The error `run` fails with: its code, its SQLSTATE and its message; `ok` when it does not fail. */
async function failureOf(run: () => Promise<unknown>): Promise<{ code: string; sqlstate: unknown; message: string } | "ok"> {
  try {
    await run();
    return "ok";
  } catch (error) {
    if (!(error instanceof UmbraError)) throw error;
    return { code: error.code, sqlstate: error.details.sqlstate, message: error.message };
  }
}

/** The ids of `table`, in order, read after everything committed. */
async function ids(db: Database, table: string): Promise<number[]> {
  const rows = await db.read((read) => read.query(`SELECT id FROM ${table} ORDER BY id`));
  return rows.map((row) => Number(row.id));
}

const child = (tx: Transaction, id: number, parent: number) => tx.execute("INSERT INTO t.children (id, parent) VALUES ($1, $2)", [id, parent]);
const parent = (tx: Transaction, id: number) => tx.execute("INSERT INTO t.parents (id) VALUES ($1)", [id]);

describe.each(BACKENDS)("a block's end inside its transaction on $name", { timeout: 120_000 }, (backend) => {
  beforeAll(() => backend.start(), 180_000);
  afterAll(() => backend.stop(), 60_000);

  const fresh = async (more = "") => (await backend.database(SCHEMA + more)).db;

  it("a deferred foreign key left violated fails at the block's end with the error its COMMIT gives, and nothing of the transaction commits", async () => {
    const alone = await failureOf(async () => {
      const db = await fresh();
      await db.transaction((tx) => child(tx, 1, 99));
    });
    const db = await fresh();
    let after: unknown;
    const inside = await failureOf(() =>
      db.transaction(async (tx) => {
        await parent(tx, 7);
        await child(tx, 1, 99);
        try {
          await endBlock(tx);
        } catch (error) {
          // The transaction is aborted: a later block's repair is refused, and the COMMIT rolls back.
          after = await failureOf(() => parent(tx, 99));
          throw error;
        }
      }),
    );
    expect(alone).toMatchObject({ code: "database-error", sqlstate: "23503" });
    expect(inside).toEqual(alone);
    expect(after).toMatchObject({ sqlstate: "25P02" });
    expect(await ids(db, "t.parents")).toEqual([]);
    expect(await ids(db, "t.children")).toEqual([]);
  });

  it("a deferred unique constraint left violated fails at the block's end with the error its COMMIT gives", async () => {
    const twice = async (tx: Transaction) => {
      await tx.execute("INSERT INTO t.once (id, k) VALUES (1, 5)");
      await tx.execute("INSERT INTO t.once (id, k) VALUES (2, 5)");
    };
    const alone = await failureOf(async () => (await fresh()).transaction(twice));
    const inside = await failureOf(async () =>
      (await fresh()).transaction(async (tx) => {
        await twice(tx);
        await endBlock(tx);
      }),
    );
    expect(alone).toMatchObject({ code: "database-error", sqlstate: "23505" });
    expect(inside).toEqual(alone);
  });

  it("a block that breaks and repairs its deferred constraints is stored, in every block of the transaction: they are deferred again after each end", async () => {
    const db = await fresh();
    const goesOn: boolean[] = [];
    await db.transaction(async (tx) => {
      for (const block of [1, 2, 3]) {
        // The child before its parent, and a key taken twice for one statement.
        await child(tx, block, block * 10);
        await parent(tx, block * 10);
        await tx.execute("INSERT INTO t.once (id, k) VALUES ($1, 1)", [block]);
        await tx.execute("UPDATE t.once SET k = id + 100 WHERE id = $1", [block]);
        if (block < 3) goesOn.push(await endBlock(tx));
      }
    });
    expect(goesOn).toEqual([true, true]);
    expect(await ids(db, "t.children")).toEqual([1, 2, 3]);
    expect(await ids(db, "t.once")).toEqual([1, 2, 3]);
  });

  it("a deferred constraint a block set immediate is deferred again for the next block, as in a new transaction", async () => {
    const db = await fresh();
    const outcomes: unknown[] = [];
    await db.transaction(async (tx) => {
      await tx.execute("SET CONSTRAINTS t.child_parent IMMEDIATE");
      await parent(tx, 10);
      await child(tx, 1, 10);
      await endBlock(tx);
      // Checked at the statement, this insert would fail: the block's own SET CONSTRAINTS ended with it.
      outcomes.push(await failureOf(() => child(tx, 2, 20)));
      await parent(tx, 20);
    });
    expect(outcomes).toEqual(["ok"]);
    expect(await ids(db, "t.children")).toEqual([1, 2]);
  });

  it("a deferred constraint trigger fires at its block's end, once, and the next block reads what it wrote", async () => {
    const db = await fresh();
    const fired: number[][] = [];
    const seen = async (tx: Transaction) => fired.push((await tx.query("SELECT id FROM t.fired ORDER BY id")).map((row) => Number(row.id)));
    await db.transaction(async (tx) => {
      await parent(tx, 1);
      await seen(tx);
      await endBlock(tx);
      await seen(tx);
      await parent(tx, 2);
      await seen(tx);
      await endBlock(tx);
      await seen(tx);
    });
    expect(fired).toEqual([[], [1], [1], [1, 2]]);
    expect(await ids(db, "t.fired")).toEqual([1, 2]);
  });

  it("with a deferrable constraint in the database: one text of two statements and one read at every end, in that order, and nothing else", async () => {
    const { db, sent } = await backend.counted(SCHEMA);
    const ends: string[][] = [];
    const goesOn: boolean[] = [];
    await db.transaction(async (tx) => {
      for (const block of [1, 2, 3]) {
        await parent(tx, block);
        const from = sent.length;
        goesOn.push(await endBlock(tx));
        ends.push(sent.slice(from));
      }
    });
    expect(goesOn).toEqual([true, true, true]);
    expect(ends).toEqual([
      [CONSTRAINTS, STATE],
      [CONSTRAINTS, STATE],
      [CONSTRAINTS, STATE],
    ]);
  });

  it("with no deferrable constraint: the text and the read at a transaction's first end, then the read alone; a new transaction starts over", async () => {
    const { db, sent } = await backend.counted(PLAIN);
    const ends: string[][] = [];
    for (const first of [1, 4]) {
      await db.transaction(async (tx) => {
        for (const block of [first, first + 1, first + 2]) {
          await tx.execute("INSERT INTO t.rows (id) VALUES ($1)", [block]);
          const from = sent.length;
          expect(await endBlock(tx)).toBe(true);
          ends.push(sent.slice(from));
        }
      });
    }
    expect(ends).toEqual([[CONSTRAINTS, STATE], [STATE], [STATE], [CONSTRAINTS, STATE], [STATE], [STATE]]);
    expect(await ids(db, "t.rows")).toEqual([1, 2, 3, 4, 5, 6]);
  });

  it("with no deferrable constraint until a block makes one: that block's end finds it, checks it, and the block fails or passes as its COMMIT would say", async () => {
    const deferredKey = "ALTER TABLE t.rows ADD CONSTRAINT k_once UNIQUE (k) DEFERRABLE INITIALLY DEFERRED";
    for (const violates of [true, false]) {
      const { db, sent } = await backend.counted(`${PLAIN} ALTER TABLE t.rows ADD COLUMN k bigint;`);
      let texts: string[] = [];
      const outcome = await failureOf(() =>
        db.transaction(async (tx) => {
          await tx.execute("INSERT INTO t.rows (id, k) VALUES (1, 1)");
          await endBlock(tx);
          // The second block: the constraint, and two rows that share its key, one of them moved away or not.
          await tx.execute(deferredKey);
          await tx.execute("INSERT INTO t.rows (id, k) VALUES (2, 1)");
          if (!violates) await tx.execute("UPDATE t.rows SET k = 2 WHERE id = 2");
          const from = sent.length;
          try {
            await endBlock(tx);
          } finally {
            texts = sent.slice(from);
          }
          // From here on the constraint is known: the next end checks it with its read.
          const next = sent.length;
          await endBlock(tx);
          expect(sent.slice(next)).toEqual([CONSTRAINTS, STATE]);
        }),
      );
      if (violates) {
        expect(outcome).toMatchObject({ code: "database-error", sqlstate: "23505" });
        expect(texts.slice(0, 2)).toEqual([STATE, CONSTRAINTS]);
        expect(await ids(db, "t.rows")).toEqual([]);
      } else {
        expect(outcome).toBe("ok");
        expect(texts).toEqual([STATE, CONSTRAINTS, STATE]);
        expect(await ids(db, "t.rows")).toEqual([1, 2]);
      }
    }
  });

  it("says the transaction must end when a constraint is deferrable and initially immediate, also one made in the transaction", async () => {
    const declared = await fresh(IMMEDIATE);
    const outcomes: boolean[] = [];
    await declared.transaction(async (tx) => {
      await parent(tx, 1);
      outcomes.push(await endBlock(tx));
    });
    const made = await fresh();
    await made.transaction(async (tx) => {
      outcomes.push(await endBlock(tx));
      await tx.execute("ALTER TABLE t.fired ADD CONSTRAINT fired_once UNIQUE (id) DEFERRABLE INITIALLY IMMEDIATE");
      outcomes.push(await endBlock(tx));
    });
    expect(outcomes).toEqual([false, true, false]);
  });

  it("says the transaction must end while the session has a temporary table, whatever its ON COMMIT action, and no longer once it is dropped", async () => {
    const db = await fresh();
    const outcomes: boolean[] = [];
    await db.transaction(async (tx) => {
      outcomes.push(await endBlock(tx));
      await tx.execute("CREATE TEMPORARY TABLE scratch (id bigint) ON COMMIT DROP");
      outcomes.push(await endBlock(tx));
    });
    await db.transaction(async (tx) => {
      // Dropped at the COMMIT.
      outcomes.push(await endBlock(tx));
      await tx.execute("CREATE TEMPORARY TABLE kept (id bigint) ON COMMIT DELETE ROWS");
    });
    await db.transaction(async (tx) => {
      outcomes.push(await endBlock(tx));
      await tx.execute("DROP TABLE kept");
      outcomes.push(await endBlock(tx));
    });
    expect(outcomes).toEqual([true, false, true, false, true]);
  });

  it("says the transaction must end while a cursor without hold is open, not for one closed or declared WITH HOLD", async () => {
    const db = await fresh();
    const outcomes: boolean[] = [];
    await db.transaction(async (tx) => {
      await tx.execute("DECLARE walk CURSOR FOR SELECT id FROM t.parents");
      outcomes.push(await endBlock(tx));
      await tx.execute("CLOSE walk");
      outcomes.push(await endBlock(tx));
      await tx.execute("DECLARE held CURSOR WITH HOLD FOR SELECT id FROM t.parents");
      outcomes.push(await endBlock(tx));
      await tx.execute("CLOSE held");
    });
    expect(outcomes).toEqual([false, true, true]);
  });

  it("leaves what belongs to the transaction: a setting made for it and a transaction-level advisory lock are still there after the end", async () => {
    const db = await fresh();
    let setting: unknown;
    let locks: unknown;
    await db.transaction(async (tx) => {
      await tx.query("SELECT set_config('umbradb_test.block', 'one', true), pg_advisory_xact_lock(4711)");
      expect(await endBlock(tx)).toBe(true);
      [{ setting }] = (await tx.query("SELECT current_setting('umbradb_test.block', true) AS setting")) as [{ setting: unknown }];
      [{ locks }] = (await tx.query(
        "SELECT count(*)::int AS locks FROM pg_locks WHERE locktype = 'advisory' AND pid = pg_backend_pid() AND objid = 4711",
      )) as [{ locks: unknown }];
    });
    expect(setting).toBe("one");
    expect(locks).toBe(1);
  });

  it("refuses a handle that is no transaction of the API, and a transaction with a read view open, sending nothing", async () => {
    const { db, sent } = await backend.counted(SCHEMA);
    const handle: Transaction = { query: async () => [], execute: async () => 0 };
    await expect(endBlock(handle)).rejects.toThrow(/not a transaction/);
    let refused: unknown;
    let texts: string[] = [];
    await db.transaction(async (tx) => {
      await readView(tx, { height: null }, async (read) => {
        await read.query("SELECT 1");
        const from = sent.length;
        refused = await endBlock(tx).then(
          () => "sent",
          (error: unknown) => (error as Error).message,
        );
        texts = sent.slice(from);
      });
      expect(await endBlock(tx)).toBe(true);
    });
    expect(refused).toMatch(/a view of this transaction is open/);
    expect(texts).toEqual([]);
  });
});
