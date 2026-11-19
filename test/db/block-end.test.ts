import { afterAll, beforeAll, describe, expect, it } from "vitest";
import type { Transaction } from "../../src/db/api.js";
import { endBlock, OWN_CURSOR, STATE } from "../../src/db/block-end.js";
import { UmbraError } from "../../src/db/errors.js";
import { BACKENDS } from "./backends.js";

/**
 * The read at a block's end (`src/db/block-end.ts`), on PostgreSQL 18 and PGlite 0.5.10, each case on a database of its
 * own: `endBlock` resolves true when a `COMMIT` of the transaction would have nothing to do but make its writes
 * durable, and nothing of the session would be carried into the next transaction; false when anything exists that a
 * `COMMIT` acts on. It sends one statement and changes nothing. The cases also show what a `COMMIT` does in two cases
 * that no statement inside the transaction reproduces: a deferred trigger whose own statements need a deferred
 * constraint, and a cursor declared `WITH HOLD`.
 */

/** A schema with nothing a `COMMIT` acts on: a table, an ordinary trigger, a rule. */
const PLAIN = `
  CREATE SCHEMA t;
  CREATE TABLE t.rows (id bigint PRIMARY KEY, k bigint);
  CREATE TABLE t.log (id bigint);
  CREATE FUNCTION t.note() RETURNS trigger LANGUAGE plpgsql AS $$ BEGIN INSERT INTO t.log (id) VALUES (NEW.id); RETURN NULL; END $$;
  CREATE TRIGGER noted AFTER INSERT ON t.rows FOR EACH ROW EXECUTE FUNCTION t.note();
  CREATE RULE mirrored AS ON UPDATE TO t.rows DO ALSO INSERT INTO t.log (id) VALUES (NEW.id);
`;

/**
 * A deferred constraint trigger on `t.rows` that inserts a child row and then its parent, through a foreign key that is
 * deferred too: at a `COMMIT` the trigger runs to its end and the key is checked after it.
 */
const NESTED = `
  CREATE TABLE t.parents (id bigint PRIMARY KEY);
  CREATE TABLE t.children (id bigint PRIMARY KEY, parent bigint NOT NULL,
    CONSTRAINT child_parent FOREIGN KEY (parent) REFERENCES t.parents (id) DEFERRABLE INITIALLY DEFERRED);
  CREATE FUNCTION t.pair() RETURNS trigger LANGUAGE plpgsql AS $$ BEGIN
    INSERT INTO t.children (id, parent) VALUES (NEW.id, NEW.id);
    INSERT INTO t.parents (id) VALUES (NEW.id);
    RETURN NULL;
  END $$;
  CREATE CONSTRAINT TRIGGER paired AFTER INSERT ON t.rows DEFERRABLE INITIALLY DEFERRED FOR EACH ROW EXECUTE FUNCTION t.pair();
`;

/** A table with a row whose division fails. */
const DIVISION = "CREATE TABLE t.denominators (d bigint); INSERT INTO t.denominators (d) VALUES (0);";

/** The error `run` fails with: its code and its SQLSTATE; `ok` when it does not fail. */
async function failureOf(run: () => Promise<unknown>): Promise<{ code: string; sqlstate: unknown } | "ok"> {
  try {
    await run();
    return "ok";
  } catch (error) {
    if (!(error instanceof UmbraError)) throw error;
    return { code: error.code, sqlstate: error.details.sqlstate };
  }
}

const row = (tx: Transaction, id: number) => tx.execute("INSERT INTO t.rows (id) VALUES ($1)", [id]);

describe.each(BACKENDS)("the read at a block's end on $name", { timeout: 120_000 }, (backend) => {
  beforeAll(() => backend.start(), 180_000);
  afterAll(() => backend.stop(), 60_000);

  const fresh = async (more = "") => (await backend.database(PLAIN + more)).db;

  /** What `endBlock` says after `statements` ran in a transaction of a database with `schema`. */
  const after = async (schema: string, ...statements: string[]): Promise<boolean> => {
    const db = await fresh(schema);
    return db.transaction(async (tx) => {
      for (const sql of statements) await tx.execute(sql);
      return endBlock(tx);
    });
  };

  it("is one statement at every end, whatever it finds, and it changes nothing", async () => {
    for (const schema of ["", NESTED]) {
      const { db, sent } = await backend.counted(PLAIN + schema);
      const ends: string[][] = [];
      const answers: boolean[] = [];
      await db.transaction(async (tx) => {
        for (const block of [1, 2, 3]) {
          await row(tx, block);
          const from = sent.length;
          answers.push(await endBlock(tx));
          ends.push(sent.slice(from));
        }
      });
      expect(ends).toEqual([[STATE], [STATE], [STATE]]);
      expect(answers).toEqual(schema === "" ? [true, true, true] : [false, false, false]);
    }
    expect(OWN_CURSOR).toBe("");
  });

  it("finds nothing in a schema with tables, an ordinary trigger and a rule, nor in a transaction that set a local setting, took a transaction-level lock or notified", async () => {
    expect(await after("")).toBe(true);
    expect(await after("", "INSERT INTO t.rows (id) VALUES (1)", "UPDATE t.rows SET k = 1")).toBe(true);
    expect(await after("", "SET LOCAL statement_timeout = 0", "SELECT pg_advisory_xact_lock(4711)", "NOTIFY t_changed")).toBe(true);
  });

  it("leaves what belongs to the transaction: a setting made for it and a transaction-level advisory lock are still there after the read", async () => {
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

  it("finds a deferrable constraint: declared deferred or immediate, made deferrable by ALTER TABLE, or made in the transaction", async () => {
    expect(await after("ALTER TABLE t.rows ADD CONSTRAINT k_once UNIQUE (k) DEFERRABLE INITIALLY DEFERRED;")).toBe(false);
    expect(await after("ALTER TABLE t.rows ADD CONSTRAINT k_once UNIQUE (k) DEFERRABLE INITIALLY IMMEDIATE;")).toBe(false);
    const key = "CREATE TABLE t.kids (id bigint PRIMARY KEY, CONSTRAINT kid_row FOREIGN KEY (id) REFERENCES t.rows (id));";
    expect(await after(key)).toBe(true);
    expect(await after(key, "ALTER TABLE t.kids ALTER CONSTRAINT kid_row DEFERRABLE")).toBe(false);
    expect(await after("", "ALTER TABLE t.rows ADD CONSTRAINT k_once UNIQUE (k) DEFERRABLE INITIALLY DEFERRED")).toBe(false);
    // Made and dropped by the same block: nothing is left for a COMMIT.
    expect(
      await after("", "ALTER TABLE t.rows ADD CONSTRAINT k_once UNIQUE (k) DEFERRABLE INITIALLY DEFERRED", "ALTER TABLE t.rows DROP CONSTRAINT k_once"),
    ).toBe(true);
  });

  it("finds a constraint trigger, deferred or not, also one made in the transaction", async () => {
    const trigger = (mode: string): string => `CREATE CONSTRAINT TRIGGER checked AFTER INSERT ON t.rows ${mode} FOR EACH ROW EXECUTE FUNCTION t.note()`;
    expect(await after(`${trigger("DEFERRABLE INITIALLY DEFERRED")};`)).toBe(false);
    expect(await after(`${trigger("DEFERRABLE INITIALLY IMMEDIATE")};`)).toBe(false);
    expect(await after(`${trigger("NOT DEFERRABLE")};`)).toBe(false);
    expect(await after("", trigger("DEFERRABLE INITIALLY DEFERRED"))).toBe(false);
  });

  it("finds a temporary table or sequence of the session, whatever its ON COMMIT action, and no longer once it is dropped", async () => {
    const db = await fresh();
    const answers: boolean[] = [];
    await db.transaction(async (tx) => {
      answers.push(await endBlock(tx));
      await tx.execute("CREATE TEMPORARY TABLE scratch (id bigint) ON COMMIT DROP");
      answers.push(await endBlock(tx));
    });
    await db.transaction(async (tx) => {
      // Dropped at the COMMIT.
      answers.push(await endBlock(tx));
      await tx.execute("CREATE TEMPORARY TABLE kept (id bigint) ON COMMIT DELETE ROWS");
    });
    await db.transaction(async (tx) => {
      answers.push(await endBlock(tx));
      await tx.execute("DROP TABLE kept");
      answers.push(await endBlock(tx));
      await tx.execute("CREATE TEMPORARY SEQUENCE counted");
      answers.push(await endBlock(tx));
      await tx.execute("DROP SEQUENCE counted");
    });
    expect(answers).toEqual([true, false, true, false, true, false]);
  });

  it("finds an open cursor, with or without hold, also one a transaction before left open, and no longer once it is closed", async () => {
    const db = await fresh();
    const answers: boolean[] = [];
    await db.transaction(async (tx) => {
      await tx.execute("DECLARE walk CURSOR FOR SELECT id FROM t.rows");
      answers.push(await endBlock(tx));
      await tx.execute("CLOSE walk");
      answers.push(await endBlock(tx));
      await tx.execute("DECLARE held CURSOR WITH HOLD FOR SELECT id FROM t.rows");
      answers.push(await endBlock(tx));
    });
    await db.transaction(async (tx) => {
      // Still open: the COMMIT kept it.
      answers.push(await endBlock(tx));
      await tx.execute("CLOSE held");
      answers.push(await endBlock(tx));
    });
    expect(answers).toEqual([false, true, false, false, true]);
  });

  it("a deferred trigger that inserts a child before its parent through a deferred key: a COMMIT passes, SET CONSTRAINTS ALL IMMEDIATE fails, and the read says commit", async () => {
    const committed = await fresh(NESTED);
    expect(await failureOf(() => committed.transaction((tx) => row(tx, 1)))).toBe("ok");
    const rows = await committed.read((read) => read.query("SELECT (SELECT count(*) FROM t.children)::int AS children, (SELECT count(*) FROM t.parents)::int AS parents"));
    expect(rows).toEqual([{ children: 1, parents: 1 }]);
    // No statement inside the transaction does what the COMMIT does: this one makes the key immediate before the trigger fires.
    const forced = await fresh(NESTED);
    const inside = await failureOf(() =>
      forced.transaction(async (tx) => {
        await row(tx, 1);
        await tx.execute("SET CONSTRAINTS ALL IMMEDIATE");
      }),
    );
    expect(inside).toEqual({ code: "database-error", sqlstate: "23503" });
    const read = await fresh(NESTED);
    let answer: boolean | undefined;
    expect(
      await failureOf(() =>
        read.transaction(async (tx) => {
          await row(tx, 1);
          answer = await endBlock(tx);
        }),
      ),
    ).toBe("ok");
    expect(answer).toBe(false);
  });

  it("a cursor WITH HOLD whose query fails: its COMMIT fails, closing it unfetched in the same transaction does not, and the read says commit while it is open", async () => {
    const declare = "DECLARE held CURSOR WITH HOLD FOR SELECT 10 / d FROM t.denominators";
    const alone = await fresh(DIVISION);
    expect(await failureOf(() => alone.transaction((tx) => tx.execute(declare)))).toEqual({ code: "database-error", sqlstate: "22012" });
    const closed = await fresh(DIVISION);
    const answers: boolean[] = [];
    expect(
      await failureOf(() =>
        closed.transaction(async (tx) => {
          await tx.execute(declare);
          answers.push(await endBlock(tx));
          await tx.execute("CLOSE held");
          answers.push(await endBlock(tx));
        }),
      ),
    ).toBe("ok");
    expect(answers).toEqual([false, true]);
  });
});
