import { afterAll, beforeAll, describe, expect, it } from "vitest";
import type { BlockWriteHandle, Database } from "../../src/db/api.js";
import { UmbraError } from "../../src/db/errors.js";
import { planSchemas, prepareSchemas, type SchemaModule, type SchemaPlan, setModuleRole } from "../../src/db/roles.js";
import { guardTables } from "../../src/db/truncate-guard.js";
import { openBlockWrites } from "../../src/db/write-handles.js";
import { BACKENDS, type TestDatabase } from "./backends.js";

/**
 * The per-module roles, on both backends. [DB-6, DB-7]
 * - A module's write into another module's table is rejected by the database, with its negative control. [A13]
 * - A provider's `SECURITY DEFINER` function has `EXECUTE` granted only to the modules that require its item. [A14]
 * - The database half of the schema names: the roles and the shared item's schema. [A15]
 *
 * A callback is played here by one module's `on-db-write` in a block transaction of the database API, with the block
 * write handle it would get (`src/db/write-handles.ts`), under its module's role. A migration is played by a
 * transaction that sets the role with {@link setModuleRole} and runs DDL, as the migration runner (`src/db/migrate.ts`,
 * `migrate.test.ts`) does with its record and mark. Halting processing after a rejected write is the runner's job: a
 * callback's error is the `callback-error` halt. [A13, RN-8]
 *
 * Every database here is set up by a login that is a superuser (the test server's, PGlite's `postgres`);
 * `roles-login.test.ts` runs the same with a `CREATEROLE` login on PostgreSQL.
 */

const INSUFFICIENT_PRIVILEGE = "42501";

function tableModule(id: string, requires: string[] = []): SchemaModule {
  const schema = id.replace(/-/g, "_");
  return {
    id,
    requires,
    provides: [{ name: `${id}-rows`, table: { schema, tables: ["t"] } }],
    migrations: [{ id: "001", sql: `CREATE TABLE ${schema}.t (k bigint PRIMARY KEY, v text NOT NULL)` }],
  };
}

/** Plays a module's migration: each statement in a transaction of the API, under the module's write role. */
async function migrate(db: Database, plan: SchemaPlan, moduleId: string, statements: readonly string[]): Promise<void> {
  await db.transaction(async (tx) => {
    await setModuleRole(tx, plan, moduleId);
    for (const statement of statements) await tx.execute(statement);
  });
}

/** Runs `body` as the `on-db-write` callback of `moduleId`: in one block transaction, with its block write handle. */
function asModule<T>(db: Database, plan: SchemaPlan, moduleId: string, body: (w: BlockWriteHandle) => Promise<T>): Promise<T> {
  return db.transaction((tx) => openBlockWrites(tx, plan, { height: null }).write(moduleId, body));
}

/** What `run` rejects with, or "resolved". */
function outcome(run: Promise<unknown>): Promise<unknown> {
  return run.then(
    () => "resolved",
    (error: unknown) => error,
  );
}

async function count(db: Database, table: string): Promise<number> {
  const rows = await db.read((read) => read.query(`SELECT count(*)::int AS n FROM ${table}`));
  return rows[0]?.n as number;
}

describe.each(BACKENDS)("roles and grants on $name (DB-6, DB-7, DB-8)", (backend) => {
  beforeAll(() => backend.start(), 180_000);
  afterAll(() => backend.stop());

  /** A fresh database with modules `a` and `b`, each owning `<schema>.t`, set up as startup will. */
  async function twoModules(): Promise<TestDatabase & { readonly plan: SchemaPlan }> {
    const database = await backend.database("SELECT 1");
    const plan = planSchemas([tableModule("a"), tableModule("b")]);
    await database.db.transaction((tx) => prepareSchemas(tx, plan));
    for (const id of ["a", "b"]) await migrate(database.db, plan, id, [`CREATE TABLE ${id}.t (k bigint PRIMARY KEY, v text NOT NULL)`]);
    await database.db.transaction((tx) => guardTables(tx, plan));
    return { ...database, plan };
  }

  /**
   * The check: module `a` writes its own table, then `b`'s, in one transaction under its role. The database rejects
   * the second write with a permission error, and the transaction (the block) rolls back: neither table changed. [A13]
   */
  async function expectCrossSchemaWriteRejected(db: Database, plan: SchemaPlan): Promise<void> {
    const before = [await count(db, "a.t"), await count(db, "b.t")];
    const result = await outcome(
      asModule(db, plan, "a", async (tx) => {
        await tx.execute("INSERT INTO a.t (k, v) VALUES (-1, 'own')");
        await tx.execute("INSERT INTO b.t (k, v) VALUES (-1, 'from a')");
      }),
    );
    expect(result).toBeInstanceOf(UmbraError);
    const error = result as UmbraError;
    expect(error.code).toBe("database-error");
    expect(error.retryable).toBe(false);
    expect(error.details.sqlstate).toBe(INSUFFICIENT_PRIVILEGE);
    expect(error.message).toMatch(/permission denied for table t/);
    expect([await count(db, "a.t"), await count(db, "b.t")]).toEqual(before);
  }

  // The required id names one test (the gate refuses an id two tests carry): the PostgreSQL 18 copy.
  const requiredId = backend.name.startsWith("PostgreSQL") ? "[[db.roles.cross-schema-write-rejected]] " : "";
  it(`${requiredId}A13: a module's write into another module's table is rejected by the database and the block rolls back`, async () => {
    const { db, plan } = await twoModules();
    await expectCrossSchemaWriteRejected(db, plan);
  });

  it("A13: a module writes its own table under its role, and reads but never changes another's", async () => {
    const { db, plan } = await twoModules();
    await asModule(db, plan, "a", async (tx) => {
      expect(await tx.query("SELECT current_user AS role")).toEqual([{ role: "umbradb_m_a" }]);
      expect(await tx.execute("INSERT INTO a.t (k, v) VALUES (1, 'own'), (2, 'own')")).toBe(2);
    });
    await asModule(db, plan, "b", (tx) => tx.execute("INSERT INTO b.t (k, v) VALUES (7, 'b')"));
    expect(await count(db, "a.t")).toBe(2);
    expect(await asModule(db, plan, "a", (tx) => tx.query("SELECT k, v FROM b.t"))).toEqual([{ k: 7n, v: "b" }]);
    for (const statement of ["UPDATE b.t SET v = 'x'", "DELETE FROM b.t", "INSERT INTO b.t (k, v) VALUES (8, 'x')"]) {
      const error = (await outcome(asModule(db, plan, "a", (tx) => tx.execute(statement)))) as UmbraError;
      expect(error, statement).toBeInstanceOf(UmbraError);
      expect(error.details.sqlstate, statement).toBe(INSUFFICIENT_PRIVILEGE);
    }
    expect(await asModule(db, plan, "b", (tx) => tx.query("SELECT k, v FROM b.t"))).toEqual([{ k: 7n, v: "b" }]);
  });

  it("A13 negative control: granting a's role INSERT on b's table makes A13's check fail", async () => {
    const { db, plan, exec } = await twoModules();
    await exec("GRANT INSERT ON b.t TO umbradb_m_a");
    await expect(expectCrossSchemaWriteRejected(db, plan)).rejects.toThrow(/expected 'resolved' to be an instance of UmbraError/);
    expect(await count(db, "b.t")).toBe(1);
  });

  it("switches the role for the transaction only: the next transaction runs as the login again", async () => {
    const { db, plan } = await twoModules();
    const [login] = await db.transaction((tx) => tx.query("SELECT current_user AS role"));
    await asModule(db, plan, "b", async () => undefined);
    expect(await db.transaction((tx) => tx.query("SELECT current_user AS role"))).toEqual([login]);
    expect(login?.role).not.toBe("umbradb_m_b");
  });

  it("makes each module role NOLOGIN, owner of its schema, and gives every other role USAGE and SELECT", async () => {
    const { db } = await twoModules();
    const facts = await db.read((read) =>
      read.query(`
        SELECT n.nspname AS schema, pg_get_userbyid(n.nspowner) AS owner, r.rolcanlogin AS login, r.rolsuper AS superuser,
               has_schema_privilege('umbradb_m_a', n.oid, 'USAGE') AS a_usage,
               has_schema_privilege('umbradb_m_b', n.oid, 'USAGE') AS b_usage,
               has_schema_privilege('umbradb_m_a', n.oid, 'CREATE') AS a_create,
               has_schema_privilege('umbradb_m_b', n.oid, 'CREATE') AS b_create
          FROM pg_namespace n JOIN pg_roles r ON r.oid = n.nspowner
         WHERE n.nspname IN ('a', 'b') ORDER BY 1`),
    );
    expect(facts).toEqual([
      { schema: "a", owner: "umbradb_m_a", login: false, superuser: false, a_usage: true, b_usage: true, a_create: true, b_create: false },
      { schema: "b", owner: "umbradb_m_b", login: false, superuser: false, a_usage: true, b_usage: true, a_create: false, b_create: true },
    ]);
  });

  it("prepares the same plan twice without changing anything (startup runs it every time)", async () => {
    const { db, plan } = await twoModules();
    await asModule(db, plan, "a", (tx) => tx.execute("INSERT INTO a.t (k, v) VALUES (1, 'kept')"));
    await db.transaction((tx) => prepareSchemas(tx, plan));
    await db.transaction((tx) => guardTables(tx, plan));
    expect(await count(db, "a.t")).toBe(1);
    await expectCrossSchemaWriteRejected(db, plan);
  });

  it("leaves the transaction in the login's role, so that what follows in it runs as before", async () => {
    const database = await backend.database("SELECT 1");
    const plan = planSchemas([tableModule("a"), tableModule("b")]);
    const roles = await database.db.transaction(async (tx) => {
      const [before] = await tx.query("SELECT current_user AS role");
      await prepareSchemas(tx, plan);
      const [after] = await tx.query("SELECT current_user AS role");
      return [before, after];
    });
    expect(roles[1]).toEqual(roles[0]);
  });

  it("gives a module added later what the others hold already: their tables to read, its provider's functions", async () => {
    const database = await backend.database("SELECT 1");
    const provider: SchemaModule = {
      id: "p",
      requires: [],
      provides: [{ name: "store-x", table: { schema: "p", tables: ["store"] } }],
      migrations: [],
    };
    const first = planSchemas([provider, tableModule("a")]);
    await database.db.transaction((tx) => prepareSchemas(tx, first));
    await migrate(database.db, first, "p", [
      "CREATE TABLE p.store (k text PRIMARY KEY, v bigint NOT NULL)",
      "INSERT INTO p.store VALUES ('before', 1)",
      `CREATE FUNCTION p.persist(p_key text, p_value bigint) RETURNS void
         LANGUAGE plpgsql SECURITY DEFINER SET search_path = pg_catalog, p, pg_temp
         AS $$ BEGIN INSERT INTO store (k, v) VALUES (p_key, p_value); END $$`,
    ]);
    // The next build adds module c, which requires the provider's item.
    const later = planSchemas([provider, tableModule("a"), tableModule("c", ["store-x"])]);
    await database.db.transaction((tx) => prepareSchemas(tx, later));
    await asModule(database.db, later, "c", (tx) => tx.query("SELECT p.persist('from-c', 2)"));
    expect(await asModule(database.db, later, "c", (tx) => tx.query("SELECT k, v FROM p.store ORDER BY k"))).toEqual([
      { k: "before", v: 1n },
      { k: "from-c", v: 2n },
    ]);
    // Module a, which does not require the item, still may not execute it.
    const denied = (await outcome(asModule(database.db, later, "a", (tx) => tx.query("SELECT p.persist('a', 3)")))) as UmbraError;
    expect(denied.details.sqlstate).toBe(INSUFFICIENT_PRIVILEGE);
  });

  it("refuses a schema that exists already and belongs to another role (schema-collision)", async () => {
    const database = await backend.database("CREATE ROLE someone_else NOLOGIN; CREATE SCHEMA taken AUTHORIZATION someone_else;");
    const plan = planSchemas([tableModule("taken")]);
    const error = (await outcome(database.db.transaction((tx) => prepareSchemas(tx, plan)))) as UmbraError;
    expect(error).toBeInstanceOf(UmbraError);
    expect(error.code).toBe("schema-collision");
    expect(error.details).toMatchObject({ schema: "taken", owner: "someone_else", role: "umbradb_m_taken" });
    const roles = await database.db.read((read) => read.query("SELECT rolname FROM pg_roles WHERE rolname = 'umbradb_m_taken'"));
    expect(roles).toEqual([]);
  });

  describe("A14: provider functions (DB-7)", () => {
    /** Provider `p` (item `store-x`), consumer `c` (requires it) and `u` (requires `other-x` of `o` only). */
    async function providerAndConsumers(): Promise<TestDatabase & { readonly plan: SchemaPlan }> {
      const database = await backend.database("SELECT 1");
      const plan = planSchemas([
        { id: "p", requires: [], provides: [{ name: "store-x", table: { schema: "p", tables: ["store"] } }], migrations: [] },
        { id: "o", requires: [], provides: [{ name: "other-x" }], migrations: [] },
        { id: "c", requires: ["store-x"], provides: [{ name: "c-rows" }], migrations: [] },
        { id: "u", requires: ["other-x"], provides: [{ name: "u-rows" }], migrations: [] },
      ]);
      await database.db.transaction((tx) => prepareSchemas(tx, plan));
      await migrate(database.db, plan, "p", [
        "CREATE TABLE p.store (k text PRIMARY KEY, v bigint NOT NULL)",
        `CREATE FUNCTION p.persist(p_key text, p_value bigint) RETURNS void
           LANGUAGE plpgsql SECURITY DEFINER SET search_path = pg_catalog, p, pg_temp
           AS $$ BEGIN INSERT INTO store (k, v) VALUES (p_key, p_value); END $$`,
        // Negative control: without pg_temp last, PostgreSQL searches pg_temp first.
        `CREATE FUNCTION p.persist_unpinned(p_key text, p_value bigint) RETURNS void
           LANGUAGE plpgsql SECURITY DEFINER SET search_path = p
           AS $$ BEGIN INSERT INTO store (k, v) VALUES (p_key, p_value); END $$`,
      ]);
      await database.db.transaction((tx) => guardTables(tx, plan));
      return { ...database, plan };
    }

    it("lets a consumer change the provider's table through its SECURITY DEFINER function, and rejects its direct UPDATE", async () => {
      const { db, plan } = await providerAndConsumers();
      await asModule(db, plan, "c", (tx) => tx.query("SELECT p.persist($1, $2::bigint)", ["via-function", 1]));
      expect(await db.read((read) => read.query("SELECT k, v FROM p.store"))).toEqual([{ k: "via-function", v: 1n }]);
      const direct = (await outcome(
        asModule(db, plan, "c", (tx) => tx.execute("UPDATE p.store SET v = 2 WHERE k = 'via-function'")),
      )) as UmbraError;
      expect(direct).toBeInstanceOf(UmbraError);
      expect(direct.details.sqlstate).toBe(INSUFFICIENT_PRIVILEGE);
      expect(direct.message).toMatch(/permission denied for table store/);
      expect(await db.read((read) => read.query("SELECT k, v FROM p.store"))).toEqual([{ k: "via-function", v: 1n }]);
    });

    it("denies EXECUTE to a module that does not require the provider's item", async () => {
      const { db, plan } = await providerAndConsumers();
      const denied = (await outcome(asModule(db, plan, "u", (tx) => tx.query("SELECT p.persist('from-u', 1)")))) as UmbraError;
      expect(denied).toBeInstanceOf(UmbraError);
      expect(denied.details.sqlstate).toBe(INSUFFICIENT_PRIVILEGE);
      expect(denied.message).toMatch(/permission denied for function persist/);
      expect(await count(db, "p.store")).toBe(0);
    });

    it("revokes EXECUTE from PUBLIC through the provider's default privileges and grants it to the consumer's role", async () => {
      const { db } = await providerAndConsumers();
      const rows = await db.read((read) =>
        read.query(`
          SELECT pg_get_userbyid(proowner) AS owner, prosecdef AS definer, proconfig AS config,
                 has_function_privilege('public', oid, 'EXECUTE') AS public_execute,
                 has_function_privilege('umbradb_m_c', oid, 'EXECUTE') AS c_execute,
                 has_function_privilege('umbradb_m_u', oid, 'EXECUTE') AS u_execute,
                 has_function_privilege('umbradb_m_o', oid, 'EXECUTE') AS o_execute
            FROM pg_proc WHERE oid = 'p.persist(text, bigint)'::regprocedure`),
      );
      expect(rows).toEqual([
        {
          owner: "umbradb_m_p",
          definer: true,
          config: ["search_path=pg_catalog, p, pg_temp"],
          public_execute: false,
          c_execute: true,
          u_execute: false,
          o_execute: false,
        },
      ]);
    });

    it("grants EXECUTE on a function the provider creates after a consumer was added (default privileges)", async () => {
      const { db, plan } = await providerAndConsumers();
      await migrate(db, plan, "p", ["CREATE FUNCTION p.later() RETURNS int LANGUAGE sql SECURITY DEFINER SET search_path = pg_catalog, p, pg_temp AS 'SELECT 1'"]);
      expect(await asModule(db, plan, "c", (tx) => tx.query("SELECT p.later() AS one"))).toEqual([{ one: 1 }]);
      const denied = (await outcome(asModule(db, plan, "u", (tx) => tx.query("SELECT p.later()")))) as UmbraError;
      expect(denied.details.sqlstate).toBe(INSUFFICIENT_PRIVILEGE);
    });

    it("negative control: a provider function without pg_temp last writes the caller's temporary table instead", async () => {
      const { db, plan } = await providerAndConsumers();
      const shadow = [
        "CREATE TEMPORARY TABLE store (k text, v bigint) ON COMMIT DROP",
        "GRANT INSERT ON pg_temp.store TO PUBLIC",
      ];
      const pinned = await asModule(db, plan, "c", async (tx) => {
        for (const statement of shadow) await tx.execute(statement);
        await tx.query("SELECT p.persist('pinned', 1)");
        return tx.query("SELECT count(*)::int AS n FROM pg_temp.store");
      });
      expect(pinned).toEqual([{ n: 0 }]);
      const unpinned = await asModule(db, plan, "c", async (tx) => {
        for (const statement of shadow) await tx.execute(statement);
        await tx.query("SELECT p.persist_unpinned('shadowed', 2)");
        return tx.query("SELECT count(*)::int AS n FROM pg_temp.store");
      });
      expect(unpinned).toEqual([{ n: 1 }]);
      expect(await db.read((read) => read.query("SELECT k FROM p.store"))).toEqual([{ k: "pinned" }]);
    });
  });

  describe("A15: roles and schemas in the database (DB-8)", () => {
    it("creates two distinct roles, each owning its schema, for two 40-byte ids differing only in their last character", async () => {
      const first = `${"a".repeat(39)}b`;
      const second = `${"a".repeat(39)}c`;
      const database = await backend.database("SELECT 1");
      // No items: an item named after a 40-byte id would itself be longer than 40 bytes.
      const plan = planSchemas([
        { id: first, requires: [], provides: [], migrations: [] },
        { id: second, requires: [], provides: [], migrations: [] },
      ]);
      await database.db.transaction((tx) => prepareSchemas(tx, plan));
      const rows = await database.db.read((read) =>
        read.query(
          `SELECT nspname AS schema, pg_get_userbyid(nspowner) AS owner FROM pg_namespace
            WHERE nspname = ANY($1::text[]) ORDER BY 1`,
          [[first, second]],
        ),
      );
      expect(rows).toEqual([
        { schema: first, owner: `umbradb_m_${first}` },
        { schema: second, owner: `umbradb_m_${second}` },
      ]);
      expect(await asModule(database.db, plan, second, (tx) => tx.query("SELECT current_user AS role"))).toEqual([
        { role: `umbradb_m_${second}` },
      ]);
    });

    it("control: PostgreSQL cuts names at 63 bytes, so longer ids would give one role (the reason for 40 bytes)", async () => {
      const database = await backend.database("SELECT 1");
      const [row] = await database.db.read((read) =>
        read.query("SELECT $1::text::name = $2::text::name AS long_equal, $3::text::name = $4::text::name AS short_equal", [
          `umbradb_m_${"a".repeat(53)}b`,
          `umbradb_m_${"a".repeat(53)}c`,
          `umbradb_m_${"a".repeat(39)}b`,
          `umbradb_m_${"a".repeat(39)}c`,
        ]),
      );
      expect(row).toEqual({ long_equal: true, short_equal: false });
    });

    it("names schemas after module ids (- → _) and gives a shared item one schema, owned by its role, both providers write", async () => {
      const database = await backend.database("SELECT 1");
      const logs = "CREATE TABLE shared_x.logs (height bigint PRIMARY KEY, provider text NOT NULL)";
      const providerOf = (id: string): SchemaModule => ({
        id,
        requires: [],
        provides: [{ name: "shared-x", table: { schema: "shared_x", tables: ["logs"] } }],
        migrations: [{ id: "001", sql: logs }],
      });
      const plan = planSchemas([providerOf("logs-full"), providerOf("logs-fast"), tableModule("core-chain-events", ["shared-x"])]);
      await database.db.transaction((tx) => prepareSchemas(tx, plan));
      await migrate(database.db, plan, "logs-full", [logs]);
      await migrate(database.db, plan, "core-chain-events", ["CREATE TABLE core_chain_events.t (k bigint PRIMARY KEY)"]);
      await database.db.transaction((tx) => guardTables(tx, plan));
      const schemas = await database.db.read((read) =>
        read.query(
          `SELECT nspname AS schema, pg_get_userbyid(nspowner) AS owner FROM pg_namespace
            WHERE nspname IN ('shared_x', 'logs_full', 'logs_fast', 'core_chain_events') ORDER BY 1`,
        ),
      );
      expect(schemas).toEqual([
        { schema: "core_chain_events", owner: "umbradb_m_core_chain_events" },
        { schema: "logs_fast", owner: "umbradb_m_logs_fast" },
        { schema: "logs_full", owner: "umbradb_m_logs_full" },
        { schema: "shared_x", owner: "umbradb_i_shared_x" },
      ]);
      // A handoff: logs-full writes heights up to 99, logs-fast from 100 (the runner calls only the active provider).
      await asModule(database.db, plan, "logs-full", (tx) => tx.execute("INSERT INTO shared_x.logs VALUES (99, 'full')"));
      await asModule(database.db, plan, "logs-fast", (tx) => tx.execute("INSERT INTO shared_x.logs VALUES (100, 'fast')"));
      expect(
        await asModule(database.db, plan, "core-chain-events", (tx) => tx.query("SELECT height, provider FROM shared_x.logs ORDER BY 1")),
      ).toEqual([
        { height: 99n, provider: "full" },
        { height: 100n, provider: "fast" },
      ]);
      const denied = (await outcome(
        asModule(database.db, plan, "core-chain-events", (tx) => tx.execute("INSERT INTO shared_x.logs VALUES (101, 'x')")),
      )) as UmbraError;
      expect(denied.details.sqlstate).toBe(INSUFFICIENT_PRIVILEGE);
      expect(await database.db.read((read) => read.query("SELECT tableowner AS owner FROM pg_tables WHERE schemaname = 'shared_x'"))).toEqual([
        { owner: "umbradb_i_shared_x" },
      ]);
    });
  });
});
