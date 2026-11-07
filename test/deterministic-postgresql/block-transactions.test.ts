import { afterAll, beforeAll, describe, expect, it } from "vitest";
import type { BlockWriteHandle, Database, SchemaWriteHandle } from "../../src/db/api.js";
import { UmbraError } from "../../src/db/errors.js";
import { planSchemas, prepareSchemas, type SchemaModule, type SchemaPlan, setModuleRole } from "../../src/db/roles.js";
import { type MigrationPart, startDatabase } from "../../src/db/migrate.js";
import { guardTables, markMigration } from "../../src/db/truncate-guard.js";
import { openBlockWrites } from "../../src/db/write-handles.js";
import {
  MIGRATION_MARK,
  TRUNCATE_GUARD_TRIGGER,
  TRUNCATE_NOT_ALLOWED_SQLSTATE,
} from "../../src/deterministic-postgresql/index.js";
import { BACKENDS } from "../db/backends.js";

/**
 * Block transactions change rows only, on both backends. `TRUNCATE` fires no row trigger, so it would escape digest
 * capture without an error. The `deterministic_postgresql` component's `BEFORE TRUNCATE` trigger
 * (`src/deterministic-postgresql/block-transactions.ts`), which the database API attaches to every module table not
 * declared `deterministic: false` (`src/db/truncate-guard.ts`), refuses it with `truncate-not-allowed`: in a block, in
 * `on-start-db`, anywhere, except in a transaction the migration runner marked as a migration. [A73, DB-14, DT-4]
 *
 * A block is played by module `a`'s `on-db-write` in a block transaction of the database API, through the block write
 * handle it would get (`src/db/write-handles.ts`), which never carries the migration mark. A migration runs through
 * the migration runner (`src/db/migrate.ts`), which marks each migration's transaction with {@link markMigration}; the
 * mark's own rules are also shown on transactions that set it directly. "The block rolls back" is shown here; halting
 * is the runner's job.
 */

const MODULE: SchemaModule = {
  id: "a",
  requires: [],
  provides: [
    { name: "a-rows", table: { schema: "a", tables: ["t", "p", "u"] } },
    { name: "a-cache", table: { schema: "a", tables: ["cache", "q"], deterministic: false } },
  ],
  migrations: [],
};

const TABLES = [
  "CREATE TABLE a.t (k bigint PRIMARY KEY, v text NOT NULL)",
  "CREATE TABLE a.u (k bigint PRIMARY KEY)",
  "CREATE TABLE a.cache (k bigint PRIMARY KEY)",
  "CREATE TABLE a.p (height bigint PRIMARY KEY) PARTITION BY RANGE (height)",
  "CREATE TABLE a.p_1 PARTITION OF a.p FOR VALUES FROM (0) TO (1000)",
  "CREATE TABLE a.q (height bigint PRIMARY KEY) PARTITION BY RANGE (height)",
  "CREATE TABLE a.q_1 PARTITION OF a.q FOR VALUES FROM (0) TO (1000)",
  "INSERT INTO a.t (k, v) VALUES (1, 'one'), (2, 'two')",
  "INSERT INTO a.u VALUES (1)",
  "INSERT INTO a.cache VALUES (1)",
  "INSERT INTO a.p VALUES (1), (2)",
  "INSERT INTO a.q VALUES (1), (2)",
];

/** What `run` rejects with, or "resolved". */
function outcome(run: Promise<unknown>): Promise<unknown> {
  return run.then(
    () => "resolved",
    (error: unknown) => error,
  );
}

describe.each(BACKENDS)("A73: TRUNCATE in a block transaction is refused, on $name (DB-14)", (backend) => {
  beforeAll(() => backend.start(), 180_000);
  afterAll(() => backend.stop());

  /** Module `a`'s schema with guarded tables, opted-out tables and partitions, set up as startup will. */
  async function guarded(plan: SchemaPlan = planSchemas([MODULE])): Promise<{ readonly db: Database; readonly plan: SchemaPlan }> {
    const { db } = await backend.database("SELECT 1");
    await db.transaction((tx) => prepareSchemas(tx, plan));
    await db.transaction(async (tx) => {
      await setModuleRole(tx, plan, "a");
      for (const statement of TABLES) await tx.execute(statement);
    });
    await db.transaction((tx) => guardTables(tx, plan));
    return { db, plan };
  }

  /** Runs `body` as module `a`'s `on-db-write` in a block: one transaction, with its block write handle. */
  function block<T>(db: Database, plan: SchemaPlan, body: (w: BlockWriteHandle) => Promise<T>): Promise<T> {
    return db.transaction((tx) => openBlockWrites(tx, plan, { height: null }).write("a", body));
  }

  async function rows(db: Database, table: string): Promise<number> {
    const [row] = await db.read((read) => read.query(`SELECT count(*)::int AS n FROM ${table}`));
    return row?.n as number;
  }

  function expectRefused(error: unknown, table: string): void {
    expect(error).toBeInstanceOf(UmbraError);
    const refused = error as UmbraError;
    expect(refused.code).toBe("truncate-not-allowed");
    expect(refused.retryable).toBe(false);
    expect(refused.details).toMatchObject({ sqlstate: TRUNCATE_NOT_ALLOWED_SQLSTATE, schema: "a", table });
    expect(refused.message).toContain(`a.${table}`);
    expect(refused.message).toContain("digest");
    expect(refused.message).toContain("DELETE");
  }

  // The required id names one test (the gate refuses an id two tests carry): the PostgreSQL 18 copy.
  const requiredId = backend.name.startsWith("PostgreSQL") ? "[[db.block.truncate-refused]] " : "";
  it(`${requiredId}A73: TRUNCATE of a module's own table in a block fails with truncate-not-allowed and the block rolls back`, async () => {
    const { db, plan } = await guarded();
    const result = await outcome(
      block(db, plan, async (tx) => {
        await tx.execute("INSERT INTO a.t (k, v) VALUES (3, 'three')");
        await tx.execute("TRUNCATE a.t");
      }),
    );
    expectRefused(result, "t");
    expect(await rows(db, "a.t")).toBe(2);
    expect(await db.read((read) => read.query("SELECT k FROM a.t ORDER BY k"))).toEqual([{ k: 1n }, { k: 2n }]);
  });

  it("A73: the same statement in a migration succeeds, through the migration runner", async () => {
    const { db } = await backend.database("SELECT 1");
    const first = [{ id: "001", sql: TABLES.join(";\n") }];
    const part = (migrations: MigrationPart["migrations"], onStartDb?: MigrationPart["onStartDb"]) => ({
      ...MODULE,
      version: "1.0.0",
      migrations,
      ...(onStartDb === undefined ? {} : { onStartDb }),
    });
    const startup = (migrations: MigrationPart["migrations"], onStartDb?: MigrationPart["onStartDb"]) => {
      const declared = part(migrations, onStartDb);
      return startDatabase(db, { plan: planSchemas([declared]), parts: [declared], committedVersions: new Map(), handles: { height: null } });
    };
    await startup(first);
    const plan = planSchemas([part(first)]);
    // Not vacuous: the table is guarded, and a block's TRUNCATE of it is refused.
    expectRefused(await outcome(block(db, plan, (tx) => tx.execute("TRUNCATE a.t"))), "t");
    const applied = await startup([...first, { id: "002", sql: "TRUNCATE a.t; INSERT INTO a.t (k, v) VALUES (3, 'three')" }]);
    expect(applied).toEqual([{ module: "a", migration: "002", position: 2 }]);
    expect(await db.read((read) => read.query("SELECT k FROM a.t"))).toEqual([{ k: 3n }]);
  });

  it("A73: refuses TRUNCATE in on-start-db, which runs unmarked, also of a table a migration of the same startup created", async () => {
    const { db } = await backend.database("SELECT 1");
    const declared = (statement: string) => ({
      ...MODULE,
      version: "1.0.0",
      migrations: [{ id: "001", sql: TABLES.join(";\n") }],
      onStartDb: (w: SchemaWriteHandle) => w.execute(statement).then(() => undefined),
    });
    const startup = (statement: string) => {
      const part = declared(statement);
      return startDatabase(db, { plan: planSchemas([part]), parts: [part], committedVersions: new Map(), handles: { height: null } });
    };
    expectRefused(await outcome(startup("TRUNCATE a.t")), "t");
    // The migration committed before on-start-db ran; its table was guarded in between.
    expect(await rows(db, "a.t")).toBe(2);
    expectRefused(await outcome(startup("TRUNCATE a.u")), "u");
    expect(await rows(db, "a.u")).toBe(1);
  });

  it("guards at every startup, before any migration: a later build's opt-out, and a table no migration of the startup created", async () => {
    const { db } = await backend.database("SELECT 1");
    const migrations = [{ id: "001", sql: TABLES.join(";\n") }];
    const startup = (provides: SchemaModule["provides"]) => {
      const declared = { ...MODULE, provides, version: "1.0.0", migrations };
      return startDatabase(db, { plan: planSchemas([declared]), parts: [declared], committedVersions: new Map(), handles: { height: null } });
    };
    await startup(MODULE.provides);
    const plan = planSchemas([MODULE]);
    // A table no migration created (as the "late" control above), then a startup with nothing to apply.
    await db.transaction(async (tx) => {
      await setModuleRole(tx, plan, "a");
      await tx.execute("CREATE TABLE a.late (k bigint PRIMARY KEY)");
      await tx.execute("INSERT INTO a.late VALUES (1)");
    });
    expect(await startup(MODULE.provides)).toEqual([]);
    expectRefused(await outcome(block(db, plan, (tx) => tx.execute("TRUNCATE a.late"))), "late");
    // A later build opts a.t out, with no new migration: its trigger is gone after startup.
    const optedOut: SchemaModule["provides"] = [
      { name: "a-rows", table: { schema: "a", tables: ["p", "u", "late"] } },
      { name: "a-cache", table: { schema: "a", tables: ["cache", "q", "t"], deterministic: false } },
    ];
    expect(await startup(optedOut)).toEqual([]);
    await block(db, plan, (tx) => tx.execute("TRUNCATE a.t"));
    expect(await rows(db, "a.t")).toBe(0);
  });

  it("A73: the mark the migration runner sets allows TRUNCATE in the transaction that carries it", async () => {
    const { db, plan } = await guarded();
    await db.transaction(async (tx) => {
      await setModuleRole(tx, plan, "a");
      await markMigration(tx);
      await tx.execute("TRUNCATE a.t");
    });
    expect(await rows(db, "a.t")).toBe(0);
  });

  it("ends the migration mark with the migration's transaction: the next transaction on the session has none", async () => {
    const { db, plan } = await guarded();
    await db.transaction(async (tx) => {
      await setModuleRole(tx, plan, "a");
      await markMigration(tx);
      const [inside] = await tx.query(`SELECT current_setting('${MIGRATION_MARK}', true) AS mark`);
      expect(inside?.mark).toMatch(/^[0-9]+$/);
    });
    // PostgreSQL's writer is one session, PGlite has one: the next transaction runs on the same session.
    const [after] = await db.transaction((tx) => tx.query(`SELECT coalesce(current_setting('${MIGRATION_MARK}', true), '') AS mark`));
    expect(after?.mark).toBe("");
  });

  it("refuses TRUNCATE in any transaction the migration runner did not mark: on-start-db, or the login's own", async () => {
    const { db } = await guarded();
    expectRefused(await outcome(db.transaction((tx) => tx.execute("TRUNCATE a.t"))), "t");
    expect(await rows(db, "a.t")).toBe(2);
  });

  it("lets no mark outlive its transaction: one left on the session by an earlier transaction does not allow TRUNCATE", async () => {
    const { db, plan } = await guarded();
    await db.transaction((tx) => tx.query(`SELECT set_config('${MIGRATION_MARK}', pg_current_xact_id()::text, false)`));
    const result = await outcome(
      block(db, plan, async (tx) => {
        // Not vacuous: the session still carries the earlier transaction's mark.
        const [setting] = await tx.query(`SELECT current_setting('${MIGRATION_MARK}', true) AS mark`);
        expect(setting?.mark).toMatch(/^[0-9]+$/);
        await tx.execute("TRUNCATE a.t");
      }),
    );
    expectRefused(result, "t");
    expect(await rows(db, "a.t")).toBe(2);
  });

  it("refuses TRUNCATE after a mark that was rolled back with its savepoint, or that is not this transaction's", async () => {
    const { db, plan } = await guarded();
    const rolledBack = await outcome(
      block(db, plan, async (tx) => {
        await tx.execute("SAVEPOINT s");
        await markMigration(tx);
        await tx.execute("ROLLBACK TO SAVEPOINT s");
        await tx.execute("TRUNCATE a.t");
      }),
    );
    expectRefused(rolledBack, "t");
    const other = await outcome(
      block(db, plan, async (tx) => {
        await tx.query(`SELECT set_config('${MIGRATION_MARK}', 'on', true)`);
        await tx.execute("TRUNCATE a.t");
      }),
    );
    expectRefused(other, "t");
    expect(await rows(db, "a.t")).toBe(2);
  });

  it("allows TRUNCATE of a table declared deterministic: false, and of its partitions (Q76)", async () => {
    const { db, plan } = await guarded();
    await block(db, plan, async (tx) => {
      await tx.execute("TRUNCATE a.cache");
      await tx.execute("TRUNCATE a.q");
    });
    expect(await rows(db, "a.cache")).toBe(0);
    expect(await rows(db, "a.q")).toBe(0);
  });

  it("refuses TRUNCATE of a guarded partitioned table and of its partition named directly", async () => {
    const { db, plan } = await guarded();
    expectRefused(await outcome(block(db, plan, (tx) => tx.execute("TRUNCATE a.p"))), "p");
    expectRefused(await outcome(block(db, plan, (tx) => tx.execute("TRUNCATE a.p_1"))), "p_1");
    expect(await rows(db, "a.p")).toBe(2);
  });

  it("refuses a TRUNCATE naming a guarded table with an opted-out one, and keeps both", async () => {
    const { db, plan } = await guarded();
    const result = await outcome(block(db, plan, (tx) => tx.execute("TRUNCATE a.cache, a.u")));
    expectRefused(result, "u");
    expect(await rows(db, "a.cache")).toBe(1);
    expect(await rows(db, "a.u")).toBe(1);
  });

  it("attaches one BEFORE TRUNCATE statement trigger to every module table but the opted-out ones", async () => {
    const { db } = await guarded();
    const triggers = await db.read((read) =>
      read.query(
        `SELECT c.relname AS "table", t.tgname AS name, t.tgtype AS type, p.proname AS function, pn.nspname AS function_schema
           FROM pg_trigger t JOIN pg_class c ON c.oid = t.tgrelid JOIN pg_namespace n ON n.oid = c.relnamespace
           JOIN pg_proc p ON p.oid = t.tgfoid JOIN pg_namespace pn ON pn.oid = p.pronamespace
          WHERE n.nspname = 'a' ORDER BY 1`,
      ),
    );
    // tgtype 34 = TRIGGER_TYPE_TRUNCATE (32) | TRIGGER_TYPE_BEFORE (2), statement level (no ROW bit).
    const expected = (table: string) => ({
      table,
      name: TRUNCATE_GUARD_TRIGGER,
      type: 34,
      function: "truncate_not_allowed",
      function_schema: "core_chain",
    });
    expect(triggers).toEqual([expected("p"), expected("p_1"), expected("t"), expected("u")]);
  });

  it("control: a table created after the triggers were attached truncates until they are attached again", async () => {
    const { db, plan } = await guarded();
    await db.transaction(async (tx) => {
      await setModuleRole(tx, plan, "a");
      await tx.execute("CREATE TABLE a.late (k bigint PRIMARY KEY)");
      await tx.execute("INSERT INTO a.late VALUES (1)");
    });
    await block(db, plan, (tx) => tx.execute("TRUNCATE a.late"));
    expect(await rows(db, "a.late")).toBe(0);
    await db.transaction(async (tx) => {
      await setModuleRole(tx, plan, "a");
      await tx.execute("INSERT INTO a.late VALUES (1)");
    });
    await db.transaction((tx) => guardTables(tx, plan));
    expectRefused(await outcome(block(db, plan, (tx) => tx.execute("TRUNCATE a.late"))), "late");
    expect(await rows(db, "a.late")).toBe(1);
  });

  it("removes the trigger from a table that a later build declares deterministic: false", async () => {
    const { db } = await guarded();
    const later = planSchemas([
      {
        ...MODULE,
        provides: [
          { name: "a-rows", table: { schema: "a", tables: ["p", "u"] } },
          { name: "a-cache", table: { schema: "a", tables: ["cache", "q", "t"], deterministic: false } },
        ],
      },
    ]);
    await db.transaction((tx) => guardTables(tx, later));
    await block(db, later, (tx) => tx.execute("TRUNCATE a.t"));
    expect(await rows(db, "a.t")).toBe(0);
    expectRefused(await outcome(block(db, later, (tx) => tx.execute("TRUNCATE a.u"))), "u");
  });
});
