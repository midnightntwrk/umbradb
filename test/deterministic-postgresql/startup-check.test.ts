import { afterAll, beforeAll, describe, expect, it } from "vitest";
import type { Database } from "../../src/db/api.js";
import { UmbraError } from "../../src/db/errors.js";
import { type MigrationPart, startDatabase } from "../../src/db/migrate.js";
import { planSchemas, type SchemaModule } from "../../src/db/roles.js";
import { contentsHash } from "../../src/determinism/contents-hash.js";
import { ModuleContentsError } from "../../src/determinism/module-tables.js";
import { BACKENDS } from "../db/backends.js";

/**
 * A58's startup half and A145's startup part (DT-6, owner decisions Q58, Q61, Q74, Q75; task 7.1), on both backends: a
 * module's migration that creates a table the determinism rules refuse refuses startup, with the code, the module, the
 * table or sequence, the column and its declared type, and the message the contents hash gives for the same table —
 * the module named in front (the `deterministic_postgresql` component's `databaseRefusals` and `refusalMessage`, task
 * 1.4's detection). The check runs in the migration's own transaction, after its SQL and before its record, so a refused
 * migration rolls back like a failing one: nothing of it is applied or recorded, the module's `on-start-db` does not
 * run, and the same build with the migration fixed starts. Tables of earlier startups are checked again at every
 * startup, after the module's pending migrations and before its `on-start-db`.
 *
 * Every expected code, place and phrase is written by hand from DT-6, A58 and `design.md` §4; the message is also
 * compared with the contents hash's for the same table, created outside the API.
 */

const MODULE: SchemaModule = {
  id: "m",
  requires: [],
  provides: [{ name: "m-rows", table: { schema: "m", tables: ["fine", "t", "u"] } }],
  migrations: [],
};

const FINE = "CREATE TABLE m.fine (k bigint PRIMARY KEY)";

interface Case {
  readonly what: string;
  /** The second migration's SQL. */
  readonly sql: string;
  readonly code: string;
  readonly place: { readonly table: string } | { readonly sequence: string };
  readonly column: string | null;
  readonly declaredType: string | null;
  /** Phrases the message must hold. */
  readonly says: readonly string[];
}

const COLUMN = "this type cannot be stored in a module table";
const SERIAL = "the column draws its values from a sequence";
const SEQUENCE_REASON = "never rolls back, so its next value depends on rolled-back and retried blocks";
const DEFAULT = "the column's default is not immutable";

const CASES: readonly Case[] = [
  {
    what: "a serial column",
    sql: "CREATE TABLE m.t (id serial PRIMARY KEY, v text)",
    code: "non-deterministic-column",
    place: { table: "t" },
    column: "id",
    declaredType: "integer",
    says: [SERIAL, SEQUENCE_REASON, "derive keys from the block (height, transaction index)"],
  },
  {
    what: "an identity column",
    sql: "CREATE TABLE m.t (id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY)",
    code: "non-deterministic-column",
    place: { table: "t" },
    column: "id",
    declaredType: "bigint",
    says: [SERIAL, "it is an identity column (GENERATED ALWAYS AS IDENTITY)", "derive keys from the block"],
  },
  {
    what: "a real column",
    sql: "CREATE TABLE m.t (k bigint PRIMARY KEY, x real)",
    code: "non-deterministic-column",
    place: { table: "t" },
    column: "x",
    declaredType: "real",
    says: [COLUMN, "0.1 + 0.6"],
  },
  {
    what: "a double precision column",
    sql: "CREATE TABLE m.t (k bigint PRIMARY KEY, x double precision)",
    code: "non-deterministic-column",
    place: { table: "t" },
    column: "x",
    declaredType: "double precision",
    says: [COLUMN, "0.30000000000000004"],
  },
  ...(
    [
      ["now()", "timestamptz DEFAULT now()", "timestamp with time zone", "now()"],
      ["CURRENT_TIMESTAMP", "timestamptz DEFAULT CURRENT_TIMESTAMP", "timestamp with time zone", "CURRENT_TIMESTAMP"],
      ["random()", "bigint DEFAULT (random() * 10)::bigint", "bigint", "random()"],
      ["gen_random_uuid()", "uuid DEFAULT gen_random_uuid()", "uuid", "gen_random_uuid()"],
    ] as const
  ).map(
    ([name, column, declared, named]): Case => ({
      what: `a ${name} default`,
      sql: `CREATE TABLE m.t (k bigint PRIMARY KEY, x ${column})`,
      code: "non-deterministic-column",
      place: { table: "t" },
      column: "x",
      declaredType: declared,
      says: [DEFAULT, named, "each machine, or each retry, gets a different value", "compute the value from the block in on-db-write"],
    }),
  ),
  {
    what: "a nextval() default",
    sql: "CREATE SEQUENCE m.s; CREATE TABLE m.t (k bigint PRIMARY KEY, x bigint DEFAULT nextval('m.s'))",
    code: "non-deterministic-column",
    place: { table: "t" },
    column: "x",
    declaredType: "bigint",
    says: [SERIAL, SEQUENCE_REASON],
  },
  {
    what: "a CURRENT_TIMESTAMP default in a bigint column (DT-6's scenario)",
    sql: "CREATE TABLE m.t (k bigint PRIMARY KEY, at bigint DEFAULT extract(epoch from CURRENT_TIMESTAMP)::bigint)",
    code: "non-deterministic-column",
    place: { table: "t" },
    column: "at",
    declaredType: "bigint",
    says: [DEFAULT, "CURRENT_TIMESTAMP", "each machine, or each retry, gets a different value", "compute the value from the block in on-db-write"],
  },
  {
    what: "a sequence",
    sql: "CREATE SEQUENCE m.s",
    code: "non-deterministic-table",
    place: { sequence: "s" },
    column: null,
    declaredType: null,
    says: ["a module schema cannot hold a sequence", "derive values from the block (height, transaction index), and drop the sequence"],
  },
  {
    what: "an unlogged table",
    sql: "CREATE UNLOGGED TABLE m.t (k bigint PRIMARY KEY)",
    code: "non-deterministic-table",
    place: { table: "t" },
    column: null,
    declaredType: null,
    says: ["a module schema cannot hold an unlogged table", "empties an unlogged table after a crash", "SET LOGGED"],
  },
  {
    what: "a table without a primary key",
    sql: "CREATE TABLE m.t (k bigint UNIQUE, v text)",
    code: "no-primary-key",
    place: { table: "t" },
    column: null,
    declaredType: null,
    says: ["the table has no primary key", "hashed and digested in primary-key order", "add a primary key"],
  },
  ...(
    [
      ["numeric", "numeric"],
      ["jsonb", "jsonb"],
      ["bigint[]", "bigint[]"],
    ] as const
  ).map(
    ([type, declared]): Case => ({
      what: `a ${type} key`,
      sql: `CREATE TABLE m.t (id ${type} PRIMARY KEY)`,
      code: "unsupported-key-type",
      place: { table: "t" },
      column: "id",
      declaredType: declared,
      says: ["this type cannot be part of a primary key"],
    }),
  ),
  ...(
    [
      ["numeric(38,2)", "numeric(38,2)", "integer smallest units"],
      ["timestamp", "timestamp without time zone", "use timestamptz, written with Z"],
      ["date", "date", "use timestamptz, written with Z"],
      ["time", "time without time zone", "use timestamptz, written with Z"],
      ["timetz", "time with time zone", "use timestamptz, written with Z"],
      ["interval", "interval", "use timestamptz, written with Z"],
      ["json", "json", "use jsonb"],
      ["char(4)", "character(4)", "use text or varchar(n)"],
      ["money", "money", "bigint smallest units"],
      ["m.mood", "m.mood", "use the base type"],
      ["m.positive", "m.positive", "use the base type"],
    ] as const
  ).map(
    ([type, declared, alternative]): Case => ({
      what: `a ${type} column`,
      sql:
        (type === "m.mood" ? "CREATE TYPE m.mood AS ENUM ('sad', 'ok'); " : "") +
        (type === "m.positive" ? "CREATE DOMAIN m.positive AS integer CHECK (VALUE > 0); " : "") +
        `CREATE TABLE m.t (k bigint PRIMARY KEY, x ${type})`,
      code: "unsupported-column-type",
      place: { table: "t" },
      column: "x",
      declaredType: declared,
      says: [COLUMN, alternative],
    }),
  ),
];

function outcome(run: Promise<unknown>): Promise<unknown> {
  return run.then(
    () => "started",
    (error: unknown) => error,
  );
}

describe.each(BACKENDS)("A58: startup refuses what the contents hash refuses, on $name (DT-6)", (backend) => {
  beforeAll(() => backend.start(), 180_000);
  afterAll(() => backend.stop());

  /** Module `m` with `fine` and then `sql` as its migrations, and an `on-start-db` that records that it ran. */
  function part(sql: string | null, setup: string[] = []): MigrationPart {
    return {
      id: "m",
      version: "1.0.0",
      migrations: [{ id: "001", sql: FINE }, ...(sql === null ? [] : [{ id: "002", sql }])],
      onStartDb: async () => {
        setup.push("m");
      },
    };
  }

  function start(db: Database, migration: string | null, setup: string[] = []): Promise<unknown> {
    return outcome(
      startDatabase(db, {
        plan: planSchemas([MODULE]),
        parts: [part(migration, setup)],
        committedVersions: new Map(),
        handles: { height: null },
      }),
    );
  }

  /** The contents hash's refusal of the same migration's objects, created outside the API in a database of their own. */
  async function hashRefusal(sql: string): Promise<ModuleContentsError> {
    const { db } = await backend.database(`CREATE SCHEMA m; ${FINE}; ${sql}`);
    const error = await db.read((read) => contentsHash(read)).then(
      () => undefined,
      (failure: unknown) => failure,
    );
    if (!(error instanceof ModuleContentsError)) throw new Error(`expected the hash to refuse ${sql}`);
    return error;
  }

  for (const c of CASES) {
    it(`refuses ${c.what} when the migration creating it runs, and rolls that migration back`, async () => {
      const { db } = await backend.database("SELECT 1");
      const setup: string[] = [];
      const refused = await start(db, c.sql, setup);
      expect(refused).toBeInstanceOf(UmbraError);
      const error = refused as UmbraError;
      expect(error.code).toBe(c.code);
      expect(error.retryable).toBe(false);
      expect(error.details).toMatchObject({
        module: "m",
        schema: "m",
        ...("table" in c.place ? { table: c.place.table, sequence: null } : { table: null, sequence: c.place.sequence }),
        column: c.column,
        declaredType: c.declaredType,
        migration: "002",
        position: 2,
      });
      const name = "table" in c.place ? `table "m"."${c.place.table}"` : `sequence "m"."${c.place.sequence}"`;
      const column = c.column === null ? "" : `, column "${c.column}" (${c.declaredType})`;
      expect(error.message.startsWith(`${c.code}: module "m", ${name}${column}: `), error.message).toBe(true);
      for (const phrase of c.says) expect(error.message).toContain(phrase);
      expect(error.message).toContain(" Instead, ");
      // The same message as the contents hash's for the same table, the module named in front (DT-6).
      const hash = await hashRefusal(c.sql);
      expect(hash.reason).toBe(c.code);
      expect(error.message).toBe(hash.message.replace(`${c.code}: `, `${c.code}: module "m", `));

      // The refused migration rolled back: nothing of it exists or is recorded, and on-start-db did not run.
      const left = await db.read((read) =>
        read.query(
          `SELECT to_regclass('m.t') IS NULL AS no_t, to_regclass('m.s') IS NULL AS no_s,
                  (SELECT array_agg(migration_id ORDER BY position) FROM core_chain.migrations WHERE module = 'm') AS applied`,
        ),
      );
      expect(left).toEqual([{ no_t: true, no_s: true, applied: ["001"] }]);
      expect(setup).toEqual([]);

      // The same build with that migration fixed starts: the refused one was never recorded, so no checksum changed.
      expect(await start(db, "CREATE TABLE m.t (k bigint PRIMARY KEY)", setup)).toBe("started");
      expect(setup).toEqual(["m"]);
    }, 60_000);
  }

  it("A58 controls: immutable defaults, a stored generated column and every allowed type start (A145's bigint and text times too)", async () => {
    const { db } = await backend.database("SELECT 1");
    const sql = `CREATE TABLE m.t (
      k bigint PRIMARY KEY, a text DEFAULT 'abc', b bigint DEFAULT 1 + 2, c text DEFAULT lower('X'),
      g bigint GENERATED ALWAYS AS (k * 2) STORED, at timestamptz, at_ms bigint, at_text text, id uuid, f boolean,
      n numeric(38,0), j jsonb, aj jsonb[], an numeric[], v varchar(32), bytes bytea
    )`;
    expect(await start(db, sql)).toBe("started");
    expect(await db.read((read) => read.query("SELECT to_regclass('m.t') IS NOT NULL AS made"))).toEqual([{ made: true }]);
  }, 60_000);

  it("A145: refuses each date and time type but timestamptz with \"use timestamptz, written with Z\"", async () => {
    for (const [type, declared] of [
      ["timestamp", "timestamp without time zone"],
      ["date", "date"],
      ["time", "time without time zone"],
      ["timetz", "time with time zone"],
      ["interval", "interval"],
    ] as const) {
      const { db } = await backend.database("SELECT 1");
      const error = (await start(db, `CREATE TABLE m.t (k bigint PRIMARY KEY, x ${type})`)) as UmbraError;
      expect(error.code, type).toBe("unsupported-column-type");
      expect(error.details).toMatchObject({ declaredType: declared });
      expect(error.message).toContain("use timestamptz, written with Z");
    }
  }, 120_000);

  it("refuses at a later startup a table made outside the module's migrations, before its on-start-db", async () => {
    const { db } = await backend.database("SELECT 1");
    const setup: string[] = [];
    expect(await start(db, null, setup)).toBe("started");
    expect(setup).toEqual(["m"]);
    // A table no migration created — an operator's, in the module's schema.
    await db.transaction(async (tx) => {
      await tx.execute("SET LOCAL ROLE umbradb_m_m");
      await tx.execute("CREATE TABLE m.u (k bigint, at timestamp)");
    });
    const refused = (await start(db, null, setup)) as UmbraError;
    expect(refused).toBeInstanceOf(UmbraError);
    expect(refused.code).toBe("no-primary-key");
    expect(refused.details).toMatchObject({ module: "m", schema: "m", table: "u", column: null });
    expect(refused.details).not.toHaveProperty("migration");
    expect(setup).toEqual(["m"]);
  }, 60_000);

  it("checks a shared item's provider in the item's schema it writes and in its own", async () => {
    const shared: SchemaModule = {
      id: "provider",
      requires: [],
      provides: [{ name: "shared-x", table: { schema: "shared_x", tables: ["rows"] } }],
      migrations: [],
    };
    const providerPart = (sql: string | null): MigrationPart => ({
      id: "provider",
      version: "1.0.0",
      migrations: sql === null ? [] : [{ id: "001", sql }],
    });
    const run = (db: Database, sql: string | null) =>
      outcome(
        startDatabase(db, {
          plan: planSchemas([shared]),
          parts: [providerPart(sql)],
          committedVersions: new Map(),
          handles: { height: null },
        }),
      );
    // The item's schema, which its migrations write under the item's role.
    const { db } = await backend.database("SELECT 1");
    const inItem = (await run(db, "CREATE TABLE shared_x.rows (k bigint PRIMARY KEY, x real)")) as UmbraError;
    expect(inItem.code).toBe("non-deterministic-column");
    expect(inItem.details).toMatchObject({ module: "provider", schema: "shared_x", table: "rows", migration: "001" });
    // Its own schema, which nothing of it writes, holding a table made by hand.
    const { db: other } = await backend.database("SELECT 1");
    expect(await run(other, null)).toBe("started");
    await other.transaction(async (tx) => {
      await tx.execute("SET LOCAL ROLE umbradb_m_provider");
      await tx.execute("CREATE TABLE provider.notes (body text)");
    });
    const own = (await run(other, null)) as UmbraError;
    expect(own.code).toBe("no-primary-key");
    expect(own.details).toMatchObject({ module: "provider", schema: "provider", table: "notes" });
  }, 60_000);

  it("checks only module tables: UmbraDB's own schemas and a schema no module of the plan has are not refused", async () => {
    const { db } = await backend.database("CREATE SCHEMA ops; CREATE TABLE ops.notes (id serial, body text)");
    const coreChain: MigrationPart = {
      id: "core-chain",
      version: "1.0.0",
      migrations: [{ id: "001", sql: "CREATE TABLE core_chain.scratch (k bigint)" }],
    };
    const started = await outcome(
      startDatabase(db, {
        plan: planSchemas([MODULE]),
        parts: [coreChain, part(null)],
        committedVersions: new Map(),
        handles: { height: null },
      }),
    );
    expect(started).toBe("started");
  }, 60_000);
});
