import { createHash } from "node:crypto";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import type { Database, Transaction } from "../../src/db/api.js";
import { UmbraError } from "../../src/db/errors.js";
import { type MigrationPart, OWN_PARTS, startDatabase } from "../../src/db/migrate.js";
import { runMultiStatement } from "../../src/db/multi-statement.js";
import { openPostgres } from "../../src/db/postgres.js";
import { planSchemas, type SchemaItem, type SchemaMigration, type SchemaModule, type SchemaPlan, setModuleRole } from "../../src/db/roles.js";
import { markMigration } from "../../src/db/truncate-guard.js";
import { MIGRATION_MARK } from "../../src/deterministic-postgresql/index.js";
import { BACKENDS } from "./backends.js";
import { type PostgresTestServer, startPostgresServer } from "./postgres-server.js";

/**
 * Migrations, `core_chain.migrations` and setup after migrations (DB-9; task 2.4), on both backends: A16 — a changed
 * checksum of an applied migration and a migration recorded as applied but missing from the build each refuse startup
 * with the module, the migration id and the checksums before any migration runs; with `001` and `002` pending and `002`
 * failing halfway, `001` is applied and recorded (in one transaction with its changes), nothing of `002` is visible or
 * recorded, the module's `on-start-db` did not run, and startup refuses. Its committed negative control: a runner that
 * records each row in a transaction of its own (before or after the migration's) fails the same checks.
 *
 * Also: one migration's multi-statement SQL on the script path, which nothing but the runner reaches; each part's SQL
 * under its write role (a shared item's under the item's, Q89; UmbraDB's own parts as the login); a shared item's
 * migrations recorded once, under the item's name (DB-8); Q91's order check; `on-start-db` after each part's
 * migrations, in a transaction of its own, unmarked.
 *
 * Refactored from 0.9.5's `test/postgres/migrate.test.ts` (`design.md` §13): its idempotent second run, its "nothing left
 * on the connection" (now: no role, migration mark or setting on the writer's session) and its connection failure (now
 * `connection-lost`, retryable) are here, against `src/db/migrate.ts`. Its concurrent runs are the writer lock's (task
 * 2.5, A17); its schema-name length is DB-8's (`schema-names.test.ts`); its `btree_gist` race, hostile `kv_history`
 * and exclusion violation test 0.9.5 parts that task 17.2 removes with them. 0.9.5's `migration-lock-timeout.test.ts` is
 * retired with the migration advisory lock (`design.md` §4, §13).
 */

/** A backbone part or module as the runner and the schema plan take it. */
type TestPart = MigrationPart & SchemaModule;

interface PartOptions {
  readonly version?: string;
  readonly requiresResync?: true;
  readonly requires?: readonly string[];
  readonly provides?: readonly SchemaItem[];
  readonly onStartDb?: (tx: Transaction) => Promise<void>;
}

function part(id: string, migrations: readonly SchemaMigration[], options: PartOptions = {}): TestPart {
  const schema = id.replace(/-/g, "_");
  return {
    id,
    version: options.version ?? "1.0.0",
    ...(options.requiresResync === undefined ? {} : { requiresResync: options.requiresResync }),
    requires: options.requires ?? [],
    provides: options.provides ?? [{ name: `${id}-rows`, table: { schema, tables: ["t"] } }],
    migrations,
    ...(options.onStartDb === undefined ? {} : { onStartDb: options.onStartDb }),
  };
}

function plan(parts: readonly TestPart[]): SchemaPlan {
  return planSchemas(parts.filter((candidate) => !OWN_PARTS.includes(candidate.id)));
}

function startup(db: Database, parts: readonly TestPart[], committed: ReadonlyMap<string, readonly string[]> = new Map()) {
  return startDatabase(db, { plan: plan(parts), parts, committedVersions: committed, handles: { height: null } });
}

/** SHA-256 of the UTF-8 SQL, in hex, computed here independently of the runner (DB-9). */
function sha256(sql: string): string {
  return createHash("sha256").update(Buffer.from(sql, "utf8")).digest("hex");
}

/** What `run` rejects with, or "resolved". */
function outcome(run: Promise<unknown>): Promise<unknown> {
  return run.then(
    () => "resolved",
    (error: unknown) => error,
  );
}

function refusal(result: unknown, code: string): UmbraError {
  expect(result).toBeInstanceOf(UmbraError);
  const error = result as UmbraError;
  expect(error.code, error.message).toBe(code);
  expect(error.retryable).toBe(false);
  return error;
}

interface MigrationRow {
  readonly module: string;
  readonly migration_id: string;
  readonly checksum: string;
  readonly position: number;
}

async function migrationRows(db: Database): Promise<MigrationRow[]> {
  const rows = await db.read((read) =>
    read.query(
      `SELECT module, migration_id, encode(checksum, 'hex') AS checksum, position
         FROM core_chain.migrations ORDER BY module, position`,
    ),
  );
  return rows as unknown as MigrationRow[];
}

async function exists(db: Database, relation: string): Promise<boolean> {
  const [row] = await db.read((read) => read.query("SELECT to_regclass($1) IS NOT NULL AS found", [relation]));
  return row?.found === true;
}

async function owner(db: Database, relation: string): Promise<string> {
  const [row] = await db.read((read) =>
    read.query("SELECT pg_get_userbyid(relowner) AS owner FROM pg_class WHERE oid = $1::regclass", [relation]),
  );
  return row?.owner as string;
}

/** Records each `on-start-db` call: the part, and the role and migration mark it ran with. */
function recorder() {
  const calls: { part: string; role: string; marked: boolean }[] = [];
  const onStartDb = (id: string) => async (tx: Transaction) => {
    const [row] = await tx.query(
      `SELECT current_user AS role, coalesce(current_setting('${MIGRATION_MARK}', true), '') <> '' AS marked`,
    );
    calls.push({ part: id, role: row?.role as string, marked: row?.marked as boolean });
  };
  return { calls, onStartDb };
}

const A_001 = "CREATE TABLE a.t (k bigint PRIMARY KEY, v text NOT NULL); INSERT INTO a.t (k, v) VALUES (1, 'one')";
/** Fails halfway: its first two statements succeed, the third divides by zero. */
const A_002_FAILING = "CREATE TABLE a.t2 (k bigint PRIMARY KEY); INSERT INTO a.t2 VALUES (1); SELECT 1 / 0; CREATE TABLE a.t3 (k bigint PRIMARY KEY)";
const A_002 = "CREATE TABLE a.t2 (k bigint PRIMARY KEY); INSERT INTO a.t2 VALUES (1)";
const B_001 = "CREATE TABLE b.t (k bigint PRIMARY KEY); INSERT INTO b.t VALUES (1)";

/**
 * A16's checks after `001` and a failing `002` of module `a` ran (`b` follows `a`): every property the half-failed
 * migration must leave, as the list of those it does not. Empty for a correct runner.
 */
async function halfFailedViolations(db: Database, aOnly = false): Promise<string[]> {
  const violations: string[] = [];
  const rows = await migrationRows(db);
  const row001 = rows.find((row) => row.module === "a" && row.migration_id === "001");
  if (row001 === undefined) violations.push("001 not recorded");
  else if (row001.checksum !== sha256(A_001) || row001.position !== 1) violations.push("001 recorded wrongly");
  if (!(await exists(db, "a.t"))) {
    violations.push("001 not applied");
  } else {
    // DB-9: "each in its own transaction together with its migrations row": 001's row and the row 001 inserted have one
    // writer, the same transaction id.
    const [same] = await db.read((read) =>
      read.query(
        `SELECT (SELECT xmin::text FROM core_chain.migrations WHERE module = 'a' AND migration_id = '001')
                  = (SELECT xmin::text FROM a.t WHERE k = 1) AS same`,
      ),
    );
    if (same?.same !== true) violations.push("001's row written by another transaction than 001's changes");
  }
  if (await exists(db, "a.t2")) violations.push("002's changes visible");
  if (await exists(db, "a.t3")) violations.push("002's later statements ran");
  if (rows.some((row) => row.module === "a" && row.migration_id === "002")) violations.push("002 recorded");
  if (!aOnly && (await exists(db, "b.t"))) violations.push("a later module migrated");
  return violations;
}

describe.each(BACKENDS)("migrations and setup on $name (DB-9, A16)", (backend) => {
  beforeAll(() => backend.start(), 180_000);
  afterAll(() => backend.stop());

  async function fresh(): Promise<Database> {
    return (await backend.database("SELECT 1")).db;
  }

  async function schemaExists(db: Database, schema: string): Promise<boolean> {
    const [row] = await db.read((read) => read.query("SELECT to_regnamespace($1) IS NOT NULL AS found", [schema]));
    return row?.found === true;
  }

  it("creates core_chain.migrations (module, migration id, checksum, position) and records each applied migration", async () => {
    const db = await fresh();
    const sqlA = [A_001, A_002];
    const applied = await startup(db, [
      part("a", [
        { id: "001", sql: sqlA[0] as string },
        { id: "002", sql: sqlA[1] as string },
      ]),
      part("b", [{ id: "001", sql: B_001 }]),
    ]);
    expect(applied).toEqual([
      { module: "a", migration: "001", position: 1 },
      { module: "a", migration: "002", position: 2 },
      { module: "b", migration: "001", position: 1 },
    ]);
    expect(await migrationRows(db)).toEqual([
      { module: "a", migration_id: "001", checksum: sha256(A_001), position: 1 },
      { module: "a", migration_id: "002", checksum: sha256(A_002), position: 2 },
      { module: "b", migration_id: "001", checksum: sha256(B_001), position: 1 },
    ]);
    const columns = await db.read((read) =>
      read.query(
        `SELECT a.attname AS name, format_type(a.atttypid, a.atttypmod) AS type, a.attnotnull AS not_null
           FROM pg_attribute a WHERE a.attrelid = 'core_chain.migrations'::regclass AND a.attnum > 0 AND NOT a.attisdropped
          ORDER BY a.attnum`,
      ),
    );
    expect(columns).toEqual([
      { name: "module", type: "text", not_null: true },
      { name: "migration_id", type: "text", not_null: true },
      { name: "checksum", type: "bytea", not_null: true },
      { name: "position", type: "integer", not_null: true },
    ]);
    const [key] = await db.read((read) =>
      read.query(
        `SELECT pg_get_constraintdef(oid) AS key FROM pg_constraint
          WHERE conrelid = 'core_chain.migrations'::regclass AND contype = 'p'`,
      ),
    );
    expect(key?.key).toBe("PRIMARY KEY (module, migration_id)");
    // PostgreSQL 18 lists NOT NULL as constraints too (contype 'n'); attnotnull above covers them.
    const constraints = await db.read((read) =>
      read.query(
        `SELECT contype::text AS kind, pg_get_constraintdef(oid) AS definition FROM pg_constraint
          WHERE conrelid = 'core_chain.migrations'::regclass AND contype <> 'n' ORDER BY 1, 2`,
      ),
    );
    expect(constraints).toEqual([
      { kind: "c", definition: "CHECK ((\"position\" >= 1))" },
      { kind: "c", definition: "CHECK ((octet_length(checksum) = 32))" },
      { kind: "p", definition: "PRIMARY KEY (module, migration_id)" },
      { kind: "u", definition: "UNIQUE (module, \"position\")" },
    ]);
    expect(await db.read((read) => read.query("SELECT k, v FROM a.t"))).toEqual([{ k: 1n, v: "one" }]);
  });

  it("runs a migration's several statements, with semicolons in strings, comments and function bodies", async () => {
    const db = await fresh();
    const sql = `
      -- a comment; with a semicolon
      CREATE TABLE a.t (k bigint PRIMARY KEY, v text NOT NULL);
      INSERT INTO a.t (k, v) VALUES (1, 'semi;colon'), (2, $q$dollar; quoted$q$);
      /* a block comment; */
      CREATE FUNCTION a.next_k() RETURNS bigint LANGUAGE plpgsql SECURITY DEFINER
        SET search_path = pg_catalog, a, pg_temp
      AS $body$
      BEGIN
        RETURN (SELECT max(k) + 1 FROM a.t);
      END;
      $body$;
    `;
    await startup(db, [part("a", [{ id: "001", sql }])]);
    expect(await db.read((read) => read.query("SELECT k, v FROM a.t ORDER BY k"))).toEqual([
      { k: 1n, v: "semi;colon" },
      { k: 2n, v: "dollar; quoted" },
    ]);
    expect(await db.read((read) => read.query("SELECT a.next_k() AS k"))).toEqual([{ k: 3n }]);
    expect(await migrationRows(db)).toEqual([{ module: "a", migration_id: "001", checksum: sha256(sql), position: 1 }]);
  });

  it("runs each module's migrations under its role, so its tables are its role's (DB-6)", async () => {
    const db = await fresh();
    await startup(db, [part("a", [{ id: "001", sql: A_001 }]), part("b", [{ id: "001", sql: B_001 }])]);
    expect(await owner(db, "a.t")).toBe("umbradb_m_a");
    expect(await owner(db, "b.t")).toBe("umbradb_m_b");
  });

  it("refuses a migration writing another module's schema: migration-failed with the permission error, nothing recorded", async () => {
    const db = await fresh();
    await startup(db, [part("a", [{ id: "001", sql: A_001 }]), part("b", [{ id: "001", sql: B_001 }])]);
    const result = await outcome(
      startup(db, [
        part("a", [{ id: "001", sql: A_001 }]),
        part("b", [
          { id: "001", sql: B_001 },
          { id: "002", sql: "INSERT INTO a.t (k, v) VALUES (9, 'from b')" },
        ]),
      ]),
    );
    const error = refusal(result, "migration-failed");
    expect(error.details).toEqual({ module: "b", migration: "002", position: 2, sqlstate: "42501" });
    expect((error.cause as UmbraError).details.sqlstate).toBe("42501");
    expect(await db.read((read) => read.query("SELECT count(*)::int AS n FROM a.t"))).toEqual([{ n: 1 }]);
    expect((await migrationRows(db)).map((row) => `${row.module}/${row.migration_id}`)).toEqual(["a/001", "b/001"]);
  });

  it("fails closed on a name without its schema: no search_path leads a module's CREATE anywhere (module guide)", async () => {
    const db = await fresh();
    const error = refusal(await outcome(startup(db, [part("a", [{ id: "001", sql: "CREATE TABLE t (k bigint PRIMARY KEY)" }])])), "migration-failed");
    expect((error.cause as UmbraError).details.sqlstate).toBe("42501");
    expect(await migrationRows(db)).toEqual([]);
  });

  it("applies nothing on a second startup, changes no row, and runs on-start-db again (0.9.5's idempotent run)", async () => {
    const db = await fresh();
    const { calls, onStartDb } = recorder();
    const parts = [
      part("a", [{ id: "001", sql: A_001 }], { onStartDb: onStartDb("a") }),
      part("b", [{ id: "001", sql: B_001 }], { onStartDb: onStartDb("b") }),
    ];
    await startup(db, parts);
    const before = await db.read((read) =>
      read.query("SELECT module, migration_id, xmin::text AS writer FROM core_chain.migrations ORDER BY 1, 2"),
    );
    expect(await startup(db, parts)).toEqual([]);
    expect(
      await db.read((read) =>
        read.query("SELECT module, migration_id, xmin::text AS writer FROM core_chain.migrations ORDER BY 1, 2"),
      ),
    ).toEqual(before);
    expect(calls.map((call) => call.part)).toEqual(["a", "b", "a", "b"]);
  });

  it("calls each part's on-start-db after its own migrations and before the next part's, under its role, unmarked", async () => {
    const db = await fresh();
    const seen: string[] = [];
    const parts = [
      part("a", [{ id: "001", sql: A_001 }], {
        onStartDb: async (tx) => {
          const [row] = await tx.query(
            `SELECT current_user AS role, coalesce(current_setting('${MIGRATION_MARK}', true), '') AS mark,
                    to_regclass('a.t') IS NOT NULL AS own, to_regclass('b.t') IS NOT NULL AS next`,
          );
          seen.push(JSON.stringify(row));
          await tx.execute("INSERT INTO a.t (k, v) VALUES (2, 'setup')");
        },
      }),
      part("b", [{ id: "001", sql: B_001 }]),
    ];
    await startup(db, parts);
    expect(seen).toEqual([JSON.stringify({ role: "umbradb_m_a", mark: "", own: true, next: false })]);
    expect(await db.read((read) => read.query("SELECT k FROM a.t ORDER BY k"))).toEqual([{ k: 1n }, { k: 2n }]);
  });

  it("leaves no role, migration mark or setting on the writer's session (0.9.5's clean connection)", async () => {
    const db = await fresh();
    const state = (tx: Transaction) =>
      tx.query(
        `SELECT current_user AS role, coalesce(current_setting('${MIGRATION_MARK}', true), '') AS mark,
                current_setting('search_path') AS search_path`,
      );
    const [before] = await db.transaction(state);
    await startup(db, [part("a", [{ id: "001", sql: A_001 }], { onStartDb: async (tx) => void (await tx.query("SELECT 1")) })]);
    const [after] = await db.transaction(state);
    expect(after).toEqual(before);
    expect(after?.mark).toBe("");
    expect(after?.role).not.toMatch(/^umbradb_/);
  });

  it("lets module roles read core_chain.migrations and never write it", async () => {
    const db = await fresh();
    const parts = [part("a", [{ id: "001", sql: A_001 }])];
    const planned = plan(parts);
    await startDatabase(db, { plan: planned, parts, committedVersions: new Map(), handles: { height: null } });
    const rows = await db.transaction(async (tx) => {
      await setModuleRole(tx, planned, "a");
      return tx.query("SELECT module, migration_id FROM core_chain.migrations");
    });
    expect(rows).toEqual([{ module: "a", migration_id: "001" }]);
    const error = refusal(
      await outcome(
        db.transaction(async (tx) => {
          await setModuleRole(tx, planned, "a");
          await tx.execute("DELETE FROM core_chain.migrations");
        }),
      ),
      "database-error",
    );
    expect(error.details.sqlstate).toBe("42501");
  });

  it("A16: a changed checksum of an applied migration refuses startup with the module, the id and both checksums, before any migration runs", async () => {
    const db = await fresh();
    await startup(db, [part("b", [{ id: "001", sql: B_001 }]), part("a", [{ id: "001", sql: A_001 }])]);
    const edited = A_001.replace("'one'", "'One'");
    const { calls, onStartDb } = recorder();
    const result = await outcome(
      startup(db, [
        // b comes first and has a pending migration: it must not run either.
        part("b", [{ id: "001", sql: B_001 }, { id: "002", sql: "CREATE TABLE b.u (k bigint PRIMARY KEY)" }], {
          onStartDb: onStartDb("b"),
        }),
        part("a", [{ id: "001", sql: edited }], { onStartDb: onStartDb("a") }),
      ]),
    );
    const error = refusal(result, "migration-checksum-changed");
    expect(error.details).toEqual({ module: "a", migration: "001", position: 1, applied: sha256(A_001), build: sha256(edited) });
    for (const text of ["a", "001", sha256(A_001), sha256(edited)]) expect(error.message).toContain(text);
    expect(await exists(db, "b.u")).toBe(false);
    expect((await migrationRows(db)).map((row) => `${row.module}/${row.migration_id}`)).toEqual(["a/001", "b/001"]);
    expect(calls).toEqual([]);
  });

  it("A16: a migration recorded as applied but missing from the build refuses startup with the module, the id and its checksum, before any migration runs", async () => {
    const db = await fresh();
    await startup(db, [part("a", [{ id: "001", sql: A_001 }, { id: "002", sql: A_002 }])]);
    const { calls, onStartDb } = recorder();
    const result = await outcome(
      startup(db, [
        part("b", [{ id: "001", sql: B_001 }], { onStartDb: onStartDb("b") }),
        part("a", [{ id: "001", sql: A_001 }], { onStartDb: onStartDb("a") }),
      ]),
    );
    const error = refusal(result, "migration-missing");
    expect(error.details).toEqual({ module: "a", migration: "002", position: 2, applied: sha256(A_002), build: null });
    for (const text of ["a", "002", sha256(A_002)]) expect(error.message).toContain(text);
    expect(await exists(db, "b.t")).toBe(false);
    expect(await exists(db, "b.u")).toBe(false);
    // The refusal rolled the whole bootstrap back: the new module's schema was never created.
    expect(await schemaExists(db, "b")).toBe(false);
    expect(calls).toEqual([]);
  });

  it("A16: refuses migrations recorded for a module the build does not have at all (DB-9's words)", async () => {
    const db = await fresh();
    await startup(db, [part("a", [{ id: "001", sql: A_001 }]), part("b", [{ id: "001", sql: B_001 }])]);
    const result = await outcome(startup(db, [part("a", [{ id: "001", sql: A_001 }])]));
    const error = refusal(result, "migration-missing");
    expect(error.details).toEqual({ module: "b", migration: "001", position: 1, applied: sha256(B_001), build: null });
  });

  it("A16: with 001 and 002 pending and 002 failing halfway, 001 is applied and recorded, nothing of 002 is, on-start-db did not run, and startup refuses", async () => {
    const db = await fresh();
    const { calls, onStartDb } = recorder();
    const result = await outcome(
      startup(db, [
        part("a", [{ id: "001", sql: A_001 }, { id: "002", sql: A_002_FAILING }], { onStartDb: onStartDb("a") }),
        part("b", [{ id: "001", sql: B_001 }], { onStartDb: onStartDb("b") }),
      ]),
    );
    const error = refusal(result, "migration-failed");
    expect(error.details).toEqual({ module: "a", migration: "002", position: 2, sqlstate: "22012" });
    expect(error.message).toContain("002");
    expect(error.message).toContain("division by zero");
    expect(error.cause).toBeInstanceOf(UmbraError);
    expect(await halfFailedViolations(db)).toEqual([]);
    expect(calls).toEqual([]);
    // The next startup, with 002 fixed, continues from 002.
    const applied = await startup(db, [
      part("a", [{ id: "001", sql: A_001 }, { id: "002", sql: A_002 }], { onStartDb: onStartDb("a") }),
      part("b", [{ id: "001", sql: B_001 }], { onStartDb: onStartDb("b") }),
    ]);
    expect(applied.map((row) => `${row.module}/${row.migration}`)).toEqual(["a/002", "b/001"]);
    expect(calls.map((call) => call.part)).toEqual(["a", "b"]);
  });

  it("A16 negative control: a runner that records each row in a transaction of its own fails the half-failed checks", async () => {
    // Built from the runner's own pieces (the bootstrap, the mark, the role, the script path), with one difference: the
    // row is written in another transaction than the migration — first, or last.
    for (const order of ["row first", "row last"] as const) {
      const db = await fresh();
      const migrations = [
        { id: "001", sql: A_001 },
        { id: "002", sql: A_002_FAILING },
      ];
      const parts = [part("a", [])];
      const planned = plan(parts);
      await startDatabase(db, { plan: planned, parts, committedVersions: new Map(), handles: { height: null } });
      const record = (migration: SchemaMigration, position: number) => (tx: Transaction) =>
        tx.execute(
          "INSERT INTO core_chain.migrations (module, migration_id, checksum, position) VALUES ($1, $2, decode($3, 'hex'), $4::integer)",
          ["a", migration.id, sha256(migration.sql), position],
        );
      const separate = async () => {
        for (const [index, migration] of migrations.entries()) {
          if (order === "row first") await db.transaction(record(migration, index + 1));
          await db.transaction(async (tx) => {
            await markMigration(tx);
            await setModuleRole(tx, planned, "a");
            await runMultiStatement(tx, migration.sql);
          });
          if (order === "row last") await db.transaction(record(migration, index + 1));
        }
      };
      expect(await outcome(separate())).toBeInstanceOf(UmbraError);
      const violations = await halfFailedViolations(db, true);
      expect(violations, order).toEqual(
        order === "row first"
          ? ["001's row written by another transaction than 001's changes", "002 recorded"]
          : ["001's row written by another transaction than 001's changes"],
      );
    }
  });

  it("refuses a record whose position does not match the build's list (a record changed by hand)", async () => {
    const database = await backend.database("SELECT 1");
    const { db } = database;
    const parts = [part("a", [{ id: "001", sql: A_001 }, { id: "002", sql: A_002 }])];
    await startup(db, parts);
    await database.exec("UPDATE core_chain.migrations SET position = 3 WHERE module = 'a' AND migration_id = '002'");
    const error = refusal(await outcome(startup(db, parts)), "migration-missing");
    expect(error.details).toEqual({
      module: "a",
      migration: "002",
      position: 3,
      applied: sha256(A_002),
      build: sha256(A_002),
      reason: "out-of-order",
      declared: "002",
    });
  });

  it("wraps a TRUNCATE refused inside a migration (its mark cleared by its own SQL) as migration-failed", async () => {
    const db = await fresh();
    await startup(db, [part("a", [{ id: "001", sql: A_001 }])]);
    const cleared = `SELECT set_config('${MIGRATION_MARK}', '', true); TRUNCATE a.t`;
    const error = refusal(
      await outcome(startup(db, [part("a", [{ id: "001", sql: A_001 }, { id: "002", sql: cleared }])])),
      "migration-failed",
    );
    expect(error.details).toEqual({ module: "a", migration: "002", position: 2, sqlstate: "UM014", schema: "a", table: "t" });
    expect((error.cause as UmbraError).code).toBe("truncate-not-allowed");
    expect(await db.read((read) => read.query("SELECT count(*)::int AS n FROM a.t"))).toEqual([{ n: 1 }]);
  });

  it("Q91: refuses a pending migration declared before an applied one, before any migration runs", async () => {
    const db = await fresh();
    await startup(db, [part("a", [{ id: "001", sql: A_001 }, { id: "002", sql: A_002 }])]);
    const inserted = "CREATE INDEX t_v ON a.t (v)";
    const result = await outcome(
      startup(db, [part("a", [{ id: "001", sql: A_001 }, { id: "001a", sql: inserted }, { id: "002", sql: A_002 }])]),
    );
    const error = refusal(result, "migration-missing");
    expect(error.details).toEqual({
      module: "a",
      migration: "002",
      position: 2,
      applied: sha256(A_002),
      build: sha256(inserted),
      reason: "out-of-order",
      declared: "001a",
    });
    expect(error.message).toContain("001a");
    const [index] = await db.read((read) => read.query("SELECT to_regclass('a.t_v') IS NOT NULL AS found"));
    expect(index?.found).toBe(false);
  });

  it("refuses a migration whose SQL ends its own transaction: its row is never written (migration-failed, transaction-ended)", async () => {
    const db = await fresh();
    const result = await outcome(
      startup(db, [part("a", [{ id: "001", sql: "CREATE TABLE a.t (k bigint PRIMARY KEY); COMMIT; CREATE TABLE a.u (k bigint PRIMARY KEY)" }])]),
    );
    const error = refusal(result, "migration-failed");
    expect(error.details).toEqual({ module: "a", migration: "001", position: 1, reason: "transaction-ended" });
    expect(await migrationRows(db)).toEqual([]);
  });

  it("records a shared item's migrations once, under the item's name, as the item's role (DB-8, Q89)", async () => {
    const db = await fresh();
    const { calls, onStartDb } = recorder();
    const shared = { name: "shared-x", table: { schema: "shared_x", tables: ["logs"] } };
    const migrations = [{ id: "001", sql: "CREATE TABLE shared_x.logs (k bigint PRIMARY KEY); INSERT INTO shared_x.logs VALUES (1)" }];
    const parts = [
      part("p1", migrations, { provides: [shared], onStartDb: onStartDb("p1") }),
      part("p2", migrations, { provides: [shared], onStartDb: onStartDb("p2") }),
    ];
    expect(await startup(db, parts)).toEqual([{ module: "shared-x", migration: "001", position: 1 }]);
    expect(await migrationRows(db)).toEqual([
      { module: "shared-x", migration_id: "001", checksum: sha256(migrations[0]?.sql as string), position: 1 },
    ]);
    expect(await owner(db, "shared_x.logs")).toBe("umbradb_i_shared_x");
    expect(calls).toEqual([
      { part: "p1", role: "umbradb_i_shared_x", marked: false },
      { part: "p2", role: "umbradb_i_shared_x", marked: false },
    ]);
    // A later build with p2 alone (the handoff) finds the item's migrations applied.
    expect(await startup(db, [parts[1] as TestPart])).toEqual([]);
  });

  it("runs UmbraDB's own core_chain part as the writer's login, recorded under its id", async () => {
    const db = await fresh();
    const [login] = await db.transaction((tx) => tx.query("SELECT current_user AS login"));
    const { calls, onStartDb } = recorder();
    const coreChain = part("core-chain", [{ id: "001", sql: "CREATE TABLE core_chain.identity (id smallint PRIMARY KEY CHECK (id = 1))" }], {
      provides: [],
      onStartDb: onStartDb("core-chain"),
    });
    const parts = [coreChain, part("a", [{ id: "001", sql: A_001 }])];
    const planned = plan(parts);
    await startDatabase(db, { plan: planned, parts, committedVersions: new Map(), handles: { height: null } });
    expect(await owner(db, "core_chain.identity")).toBe(login?.login);
    // Created by a migration after the bootstrap's grants: module roles read it by the login's default privilege.
    const read = await db.transaction(async (tx) => {
      await setModuleRole(tx, planned, "a");
      return tx.query("SELECT count(*)::int AS n FROM core_chain.identity");
    });
    expect(read).toEqual([{ n: 0 }]);
    expect(calls).toEqual([{ part: "core-chain", role: login?.login, marked: false }]);
    expect((await migrationRows(db)).map((row) => row.module)).toEqual(["a", "core-chain"]);
  });

  it("runs a database with UmbraDB's own parts only, whose plan has no role to grant", async () => {
    const db = await fresh();
    const coreChain = part("core-chain", [{ id: "001", sql: "CREATE TABLE core_chain.identity (id smallint PRIMARY KEY)" }], {
      provides: [],
    });
    expect(await startDatabase(db, { plan: planSchemas([]), parts: [coreChain], committedVersions: new Map(), handles: { height: null } })).toEqual([
      { module: "core-chain", migration: "001", position: 1 },
    ]);
    expect(await exists(db, "core_chain.identity")).toBe(true);
  });

  it("refuses a part given twice, before anything is created", async () => {
    const db = await fresh();
    const a = part("a", [{ id: "001", sql: A_001 }]);
    await expect(startDatabase(db, { plan: plan([a]), parts: [a, a], committedVersions: new Map(), handles: { height: null } })).rejects.toThrow(
      /the part a is given twice/,
    );
    expect(await exists(db, "core_chain.migrations")).toBe(false);
  });

  it("refuses a part that is neither in the schema plan nor one of UmbraDB's own", async () => {
    const db = await fresh();
    const parts = [part("a", [{ id: "001", sql: A_001 }])];
    await expect(
      startDatabase(db, { plan: planSchemas([]), parts, committedVersions: new Map(), handles: { height: null } }),
    ).rejects.toThrow(/a.*neither in the schema plan nor one of UmbraDB's own parts/);
    expect(await exists(db, "core_chain.migrations")).toBe(false);
  });

  it("keeps the script path from callbacks: a transaction runs one statement per call, and only the transactions the backend opened take scripts", async () => {
    const db = await fresh();
    let kept: Transaction | undefined;
    await db.transaction(async (tx) => {
      kept = tx;
      expect(Object.keys(tx).sort()).toEqual(["execute", "query"]);
    });
    const error = refusal(await outcome(db.transaction((tx) => tx.execute("SELECT 1; SELECT 2"))), "database-error");
    expect(error.details.sqlstate).toBe("42601");
    const handle = { query: async () => [], execute: async () => 0 };
    await expect(runMultiStatement(handle, "SELECT 1; SELECT 2")).rejects.toThrow(/not a transaction/);
    refusal(await outcome(runMultiStatement(kept as Transaction, "SELECT 1; SELECT 2")), "handle-closed");
  });
});

describe("a connection lost during a migration (DB-13), on PostgreSQL 18", () => {
  let server: PostgresTestServer;
  beforeAll(async () => {
    server = await startPostgresServer();
  }, 180_000);
  afterAll(() => server?.stop());

  it("is connection-lost and retryable, the migration unrecorded; a retried startup applies it", async () => {
    const database = await server.createDatabase();
    const db = database.open();
    const parts = [part("a", [{ id: "001", sql: "CREATE TABLE a.t (k bigint PRIMARY KEY); SELECT pg_sleep(2)" }])];
    const running = outcome(startup(db, parts));
    let pid: number | undefined;
    for (let attempt = 0; attempt < 200 && pid === undefined; attempt++) {
      const rows = await database.admin.unsafe<{ pid: number }[]>(
        "SELECT pid FROM pg_stat_activity WHERE query LIKE '%pg_sleep(2)%' AND pid <> pg_backend_pid()",
      );
      pid = rows[0]?.pid;
      if (pid === undefined) await new Promise((resolve) => setTimeout(resolve, 25));
    }
    expect(pid).toBeDefined();
    await database.terminate(pid as number);
    const result = await running;
    expect(result).toBeInstanceOf(UmbraError);
    expect((result as UmbraError).code).toBe("connection-lost");
    expect((result as UmbraError).retryable).toBe(true);
    const [after] = await database.admin.unsafe<{ t: string | null; n: number }[]>(
      "SELECT to_regclass('a.t')::text AS t, (SELECT count(*)::int FROM core_chain.migrations) AS n",
    );
    expect(after).toEqual({ t: null, n: 0 });
    expect(await startup(db, parts)).toEqual([{ module: "a", migration: "001", position: 1 }]);
  }, 60_000);
});

describe("a lost connection during startup (DB-13)", () => {
  it("is connection-lost and retryable, not a migration failure (0.9.5's connection failure)", async () => {
    const db = openPostgres({
      url: "postgres://nouser:nopass@127.0.0.1:1/nonexistent",
      committedHeight: async () => null,
      connectTimeoutSeconds: 2,
    });
    try {
      const result = await outcome(startup(db, [part("a", [{ id: "001", sql: A_001 }])]));
      expect(result).toBeInstanceOf(UmbraError);
      expect((result as UmbraError).code).toBe("connection-lost");
      expect((result as UmbraError).retryable).toBe(true);
    } finally {
      await db.close();
    }
  }, 20_000);
});
