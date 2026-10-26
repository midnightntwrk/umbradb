import { readFile } from "node:fs/promises";
import { afterAll, beforeAll, describe, expect, expectTypeOf, it } from "vitest";
import type { BlockWriteHandle, ReadHandle, Transaction } from "../../src/db/api.js";
import { UmbraError } from "../../src/db/errors.js";
import { migrationChecksum } from "../../src/db/roles.js";
import { encodeRow } from "../../src/determinism/cbor.js";
import { contentsHash } from "../../src/determinism/contents-hash.js";
import { moduleTables, rowsInKeyOrder } from "../../src/determinism/module-tables.js";
import { integerCheckName } from "../../src/deterministic-postgresql/index.js";
import {
  type HeightVersionedTable,
  heightVersionedTable,
  type VersionedValue,
} from "../../src/helpers/height-versioned.js";
import type { BlockContext, Migration } from "../../src/modules/declaration.js";
import { InMemoryBlockSource } from "../../src/runner/in-memory-source.js";
import { HeightFailure } from "../../src/runner/loop.js";
import { BACKENDS } from "../db/backends.js";
import { entry } from "../modules/graph-fixtures.js";
import { cursorOf, failureOf, runUntilWaiting, startWith } from "../runner/loop-harness.js";
import { freshDatabase, type HelperDatabase } from "./cursor-harness.js";
import {
  LENIENT,
  METADATA,
  type StoredVersion,
  TOKEN_METADATA_ROLE,
  tokenMetadata,
  versionedDatabase,
  versionsOf,
} from "./height-versioned-harness.js";

/**
 * The height-versioned-table helper (task 6.2; SH-2, SH-3; `design.md` §1, §10, §12; CORE-ARCH §4.11a; owner decisions
 * Q27, Q30), refactored from 0.9.5's TemporalKV with block heights for its wall-clock times: a library function a
 * module calls to get its tables' migration and the read, write and delete functions over the handles its callbacks
 * are given — never a module of its own, never a connection or a transaction of its own. Its property, A60, is
 * `height-versioned.property.test.ts`; A61 (SH-3) is here, with its committed negative control (the `lenient` table of
 * `height-versioned-harness.ts`, which lets a second change of a key in one block through). That the cursor table does
 * not share SH-3 is `cursor-table.test.ts`' "does not share SH-3", unchanged.
 *
 * The cases of 0.9.5's `test/postgres/temporal-kv.test.ts` that still apply are here, retargeted (that file stays, on
 * `PgTemporalKV`, until task 17.2 retires the class with it): a value read as of a version's start and within it, and
 * nothing before the key existed (`getAt`); a second write of a key in one transaction refused at the trigger (now one
 * block, SH-3); writes of a rolled-back block gone (`opts.tx`); history versions that neither overlap nor gap (P5, now
 * A60). Its CAS (`expectedVersion`), version-number addressing, `listKeys`, transaction handles, schema threading,
 * abort signals and validation cases test the 0.9.5 API, which the helper does not have.
 */

/** The migration's SQL for `"<schema>"."<table>"`, as the helper must give it (its text is in the checksum). */
function expectedSql(schema: string, table: string): string {
  const current = `"${schema}"."${table}"`;
  const history = `"${schema}"."${table}_history"`;
  const fill = `"${schema}"."${table}_versions"`;
  return [
    `CREATE TABLE ${current} (key text PRIMARY KEY, value jsonb NOT NULL, from_height bigint NOT NULL)`,
    "  WITH (fillfactor = 90);",
    `CREATE TABLE ${history} (key text NOT NULL, from_height bigint NOT NULL, to_height bigint NOT NULL,`,
    "  value jsonb NOT NULL, PRIMARY KEY (key, from_height), CHECK (from_height < to_height));",
    `CREATE FUNCTION ${fill}() RETURNS trigger LANGUAGE plpgsql AS $versions$`,
    "DECLARE",
    "  k text;",
    "  height bigint;",
    "  reached bigint;",
    "BEGIN",
    "  IF TG_OP = 'INSERT' THEN",
    "    k := NEW.key;",
    "    -- An upsert of a key with a current version is its UPDATE's to decide.",
    `    IF EXISTS (SELECT FROM ${current} WHERE key = k) THEN`,
    "      RETURN NEW;",
    "    END IF;",
    "    height := NEW.from_height;",
    `    SELECT to_height INTO reached FROM ${history} WHERE key = k ORDER BY from_height DESC LIMIT 1;`,
    "  ELSIF TG_OP = 'UPDATE' THEN",
    "    k := OLD.key;",
    "    IF NEW.key IS DISTINCT FROM k THEN",
    "      RAISE EXCEPTION USING ERRCODE = 'feature_not_supported', SCHEMA = TG_TABLE_SCHEMA, TABLE = TG_TABLE_NAME,",
    "        MESSAGE = format('%I.%I: the key %L cannot change to %L; delete it, and write the new key',",
    "          TG_TABLE_SCHEMA, TG_TABLE_NAME, k, NEW.key);",
    "    END IF;",
    "    -- The value the key has already: no version (SH-2), and the row is left as it is.",
    "    IF NEW.value = OLD.value THEN",
    "      RETURN NULL;",
    "    END IF;",
    "    height := NEW.from_height;",
    "    reached := OLD.from_height;",
    "  ELSE",
    "    k := OLD.key;",
    "    height := nullif(pg_catalog.current_setting('umbradb.delete_height', true), '')::bigint;",
    "    IF height IS NULL THEN",
    "      RAISE EXCEPTION USING ERRCODE = 'feature_not_supported', SCHEMA = TG_TABLE_SCHEMA, TABLE = TG_TABLE_NAME,",
    "        MESSAGE = format('%I.%I: the key %L is deleted only through the helper''s delete, " +
      "which gives the height',",
    "          TG_TABLE_SCHEMA, TG_TABLE_NAME, k);",
    "    END IF;",
    "    reached := OLD.from_height;",
    "  END IF;",
    "  IF height = reached THEN",
    "    RAISE EXCEPTION USING ERRCODE = 'unique_violation', SCHEMA = TG_TABLE_SCHEMA, TABLE = TG_TABLE_NAME,",
    "      MESSAGE = format('%I.%I: the key %L changed already at height %s, in this block; a height-versioned table '",
    "        'takes one change of a key per block (SH-3)', TG_TABLE_SCHEMA, TG_TABLE_NAME, k, height);",
    "  ELSIF height < reached THEN",
    "    RAISE EXCEPTION USING ERRCODE = 'exclusion_violation', SCHEMA = TG_TABLE_SCHEMA, TABLE = TG_TABLE_NAME,",
    "      MESSAGE = format('%I.%I: the key %L cannot change at height %s: its versions reach height %s, and heights '",
    "        'only go up', TG_TABLE_SCHEMA, TG_TABLE_NAME, k, height, reached);",
    "  END IF;",
    "  IF TG_OP = 'INSERT' THEN",
    "    RETURN NEW;",
    "  END IF;",
    `  INSERT INTO ${history} (key, from_height, to_height, value) VALUES (k, OLD.from_height, height, OLD.value);`,
    "  IF TG_OP = 'DELETE' THEN",
    "    RETURN OLD;",
    "  END IF;",
    "  RETURN NEW;",
    "END",
    "$versions$;",
    `CREATE TRIGGER versions BEFORE INSERT OR UPDATE OR DELETE ON ${current}`,
    `  FOR EACH ROW EXECUTE FUNCTION ${fill}();`,
  ].join("\n");
}

/** What `run` rejects with, or "resolved". */
function outcome(run: Promise<unknown>): Promise<unknown> {
  return run.then(
    () => "resolved",
    (error: unknown) => error,
  );
}

/** The first `UmbraError` in the chain of causes of `error`. */
function umbraCause(error: unknown): UmbraError | undefined {
  for (let cause = error; cause instanceof Error; cause = cause.cause) if (cause instanceof UmbraError) return cause;
  return undefined;
}

/** `error` is the database API's `database-error` for SQLSTATE `sqlstate`, raised on `table` of `token_metadata`. */
function expectRefused(error: unknown, sqlstate: string, table: string, message?: RegExp): void {
  expect(error).toBeInstanceOf(UmbraError);
  expect((error as UmbraError).code).toBe("database-error");
  expect((error as UmbraError).details).toMatchObject({ sqlstate, schema: "token_metadata", table });
  if (message !== undefined) expect((error as UmbraError).message).toMatch(message);
}

/** A version as `versionsOf` gives it. */
const version = (from: number, to: number | null, value: VersionedValue): StoredVersion => ({
  from: BigInt(from),
  to: to === null ? null : BigInt(to),
  value,
});

class BlockFails extends Error {}

describe("the height-versioned-table helper itself (SH-2; design §12's heightVersionedTable)", () => {
  it("gives the migration that creates its two tables and the trigger, with the module's id; its SQL is fixed", () => {
    const sql = expectedSql("token_metadata", "metadata");
    expect(METADATA.migration("001")).toEqual({ id: "001", sql });
    expect(METADATA.migration("014")).toEqual({ id: "014", sql });
    // The SQL is part of the checksum of the module's migration (DB-9): another text in a later build would make every
    // database that applied it refuse to start (`migration-checksum-changed`). This pins the bytes.
    expect(migrationChecksum(sql)).toBe("5288b37b8d2f15758ab36123ff19160f114aba2dfb93083896fcbe688cce6106");
    // Names are quoted, so a reserved word is a name like any other.
    expect(heightVersionedTable({ schema: "order", table: "select" }).migration("001").sql).toBe(
      expectedSql("order", "select"),
    );
  });

  it("is frozen, names its schema and its two tables, and gives frozen migrations", () => {
    expect(Object.isFrozen(METADATA)).toBe(true);
    expect([METADATA.schema, METADATA.table, METADATA.historyTable]).toEqual([
      "token_metadata",
      "metadata",
      "metadata_history",
    ]);
    const migration: Migration = METADATA.migration("001");
    expect(Object.isFrozen(migration)).toBe(true);
    expect(Object.keys(migration)).toEqual(["id", "sql"]);
    expect([METADATA.migration("001").id, METADATA.migration("002").id]).toEqual(["001", "002"]);
    expect(Object.keys(METADATA).sort()).toEqual([
      "delete",
      "historyTable",
      "migration",
      "read",
      "schema",
      "table",
      "write",
    ]);
  });

  it("refuses a schema of more than 63 bytes or a table of more than 54, or a name not a lowercase identifier", () => {
    const schema63 = `s${"x".repeat(62)}`;
    const table54 = `t${"x".repeat(53)}`;
    for (const name of ["_x", "x_1", "a", table54]) {
      const sql = heightVersionedTable({ schema: name, table: name }).migration("001").sql;
      expect(sql).toContain(`"${name}"."${name}_history"`);
      expect(sql).toContain(`"${name}"."${name}_versions"()`);
    }
    expect(heightVersionedTable({ schema: schema63, table: "t" }).schema).toBe(schema63);
    // `<table>_versions`, the trigger's function, and `<table>_history` stay within PostgreSQL's 63 bytes.
    expect(`${table54}_versions`).toHaveLength(63);
    for (const bad of ["", "Metadata", "1st", "a-b", "a b", 'a"b', "é", "a.b", "a$b"]) {
      const named = JSON.stringify(bad);
      expect(() => heightVersionedTable({ schema: bad, table: "metadata" }), named).toThrow(TypeError);
      expect(() => heightVersionedTable({ schema: "token_metadata", table: bad }), named).toThrow(TypeError);
    }
    expect(() => heightVersionedTable({ schema: `${schema63}x`, table: "t" })).toThrow(
      `heightVersionedTable: the schema "${schema63}x" is not a lowercase identifier ([a-z_][a-z0-9_]*) of at most ` +
        "63 bytes",
    );
    expect(() => heightVersionedTable({ schema: "token_metadata", table: `${table54}x` })).toThrow(
      `heightVersionedTable: the table "${table54}x" is not a lowercase identifier ([a-z_][a-z0-9_]*) of at most 54 ` +
        "bytes",
    );
    // From JavaScript: anything but a string is refused, also what would print as a valid name.
    for (const bad of [7, ["token_metadata"], null, undefined, { toString: () => "token_metadata" }]) {
      const options = { schema: bad, table: "metadata" } as unknown as { schema: string; table: string };
      expect(() => heightVersionedTable(options), String(bad)).toThrow(/^heightVersionedTable: the schema .* is not a/);
      const tables = { schema: "token_metadata", table: bad } as unknown as { schema: string; table: string };
      expect(() => heightVersionedTable(tables), String(bad)).toThrow(/^heightVersionedTable: the table .* is not a/);
    }
    expect(() => heightVersionedTable(undefined as unknown as { schema: string; table: string })).toThrow(TypeError);
  });

  it("writes and deletes through the block write handle at a block's height, reads through any handle's query", () => {
    type Height = Pick<BlockContext, "height">;
    expectTypeOf<HeightVersionedTable["write"]>().parameters.toEqualTypeOf<
      [BlockWriteHandle, Height, string, VersionedValue]
    >();
    expectTypeOf<HeightVersionedTable["delete"]>().parameters.toEqualTypeOf<[BlockWriteHandle, Height, string]>();
    expectTypeOf<HeightVersionedTable["write"]>().returns.toEqualTypeOf<Promise<void>>();
    expectTypeOf<HeightVersionedTable["delete"]>().returns.toEqualTypeOf<Promise<void>>();
    expectTypeOf<HeightVersionedTable["read"]>().parameters.toEqualTypeOf<
      [Pick<ReadHandle, "query">, string, (bigint | undefined)?]
    >();
    expectTypeOf<HeightVersionedTable["read"]>().returns.toEqualTypeOf<Promise<VersionedValue | undefined>>();
    expectTypeOf<ReadHandle>().toExtend<Parameters<HeightVersionedTable["read"]>[0]>();
    expectTypeOf<BlockWriteHandle>().toExtend<Parameters<HeightVersionedTable["read"]>[0]>();
    expectTypeOf<BlockContext>().toExtend<Parameters<HeightVersionedTable["write"]>[1]>();
    // A transaction is no block write handle: the helper never writes outside the handle `on-db-write` is given.
    expectTypeOf<Transaction>().not.toExtend<Parameters<HeightVersionedTable["write"]>[0]>();
    expectTypeOf<ReadHandle>().not.toExtend<Parameters<HeightVersionedTable["write"]>[0]>();
    expectTypeOf<ReadHandle>().not.toExtend<Parameters<HeightVersionedTable["delete"]>[0]>();
  });

  it("is a library, not a module: it imports types only, and opens no connection or transaction", async () => {
    const source = await readFile(new URL("../../src/helpers/height-versioned.ts", import.meta.url), "utf8");
    // Every import or re-export statement, however many lines it spans, up to its semicolon.
    const statements = (source.match(/^(?:import|export)\b[^;]*;/gm) ?? []).filter((statement) =>
      /\bfrom\s*["']|^import\s*["']/.test(statement),
    );
    expect(statements.length).toBeGreaterThan(0);
    for (const statement of statements) expect(statement).toMatch(/^import type /);
    expect(source).not.toMatch(/\bimport\s*\(|\brequire\s*\(/);
  });
});

/** The database's view of `key` in `METADATA`: its versions, and its value now. */
async function stateOf(database: HelperDatabase, key: string): Promise<{ versions: StoredVersion[]; now: unknown }> {
  return database.db.read(async (read) => ({
    versions: await versionsOf(read, METADATA, key),
    now: await METADATA.read(read, key),
  }));
}

/**
 * A61's check (SH-3): what it found wrong with `table`, empty when a second change of `key` in one block failed that
 * write and the block. Block 1 writes `key` = 1. Block 2 writes 2, then 3: the second write must be refused with
 * SQLSTATE 23505 and the block must fail; afterwards `key` must still be 1 from block 1, with no version of block 2,
 * and the committed height must not have moved.
 */
async function secondChangeProblems(
  database: HelperDatabase,
  table: HeightVersionedTable,
  key: string,
): Promise<string[]> {
  const problems: string[] = [];
  await database.block(async (w, b) => {
    await table.write(w, b, key, 1);
  });
  const before = database.committed;
  let second: unknown = "resolved";
  const block = await outcome(
    database.block(async (w, b) => {
      await table.write(w, b, key, 2);
      second = await outcome(table.write(w, b, key, 3));
      if (second instanceof Error) throw second;
    }),
  );
  if (block === "resolved") {
    problems.push("a second change of a key in one block went through, and the block committed");
  }
  if (!(second instanceof UmbraError) || second.details.sqlstate !== "23505") {
    problems.push(`the second write was not refused with 23505: ${String(second)}`);
  }
  if (database.committed !== before) {
    problems.push(`the committed height moved from ${before} to ${database.committed}`);
  }
  const after = await database.db.read(async (read) => ({
    versions: await versionsOf(read, table, key),
    now: await table.read(read, key),
  }));
  if (after.now !== 1) problems.push(`the key reads ${JSON.stringify(after.now)}, not 1`);
  if (after.versions.length !== 1 || after.versions[0]?.to !== null) {
    problems.push(`the key has versions ${after.versions.map((v) => `[${v.from}, ${v.to ?? "…"})`).join(" ")}`);
  }
  return problems;
}

// Each test runs a few blocks on a database migrated with four parts: seconds under the parallel conformance run's
// load, so each test has two minutes.
describe.each(BACKENDS)("the height-versioned table on $name (SH-2, SH-3)", { timeout: 120_000 }, (backend) => {
  let database: HelperDatabase;

  beforeAll(async () => {
    await backend.start();
    database = await versionedDatabase(backend);
  }, 180_000);

  afterAll(() => backend.stop(), 60_000);

  it("makes two tables of the module's schema, owned by its role, as its migration says, with the CHECKs", async () => {
    const shape = await database.db.read(async (read) => {
      const of = async (table: string) => ({
        table: await read.query(
          "SELECT pg_catalog.pg_get_userbyid(c.relowner)::text AS owner, c.reloptions AS options, " +
            "c.relkind::text AS kind, c.relpersistence::text AS persistence FROM pg_catalog.pg_class c " +
            "JOIN pg_catalog.pg_namespace n ON n.oid = c.relnamespace " +
            "WHERE n.nspname = 'token_metadata' AND c.relname = $1",
          [table],
        ),
        columns: await read.query(
          "SELECT a.attname::text AS name, pg_catalog.format_type(a.atttypid, a.atttypmod) AS type, " +
            "a.attnotnull AS not_null, co.collname::text AS collation, a.atthasdef AS has_default " +
            "FROM pg_catalog.pg_attribute a " +
            "LEFT JOIN pg_catalog.pg_collation co ON co.oid = a.attcollation AND a.attcollation <> 0 " +
            "WHERE a.attrelid = ('token_metadata.' || $1)::regclass AND a.attnum > 0 AND NOT a.attisdropped " +
            "ORDER BY a.attnum",
          [table],
        ),
        indexes: await read.query(
          "SELECT i.indisprimary AS is_primary, " +
            "(SELECT pg_catalog.array_agg(a.attname::text ORDER BY k.n) " +
            "FROM pg_catalog.unnest(i.indkey) WITH ORDINALITY AS k(attnum, n) " +
            "JOIN pg_catalog.pg_attribute a ON a.attrelid = i.indrelid AND a.attnum = k.attnum) AS columns " +
            "FROM pg_catalog.pg_index i WHERE i.indrelid = ('token_metadata.' || $1)::regclass",
          [table],
        ),
        constraints: await read.query(
          "SELECT conname::text AS name, contype::text AS type, pg_catalog.pg_get_constraintdef(oid) AS definition " +
            "FROM pg_catalog.pg_constraint WHERE conrelid = ('token_metadata.' || $1)::regclass ORDER BY conname",
          [table],
        ),
        triggers: await read.query(
          "SELECT tgname::text AS name FROM pg_catalog.pg_trigger " +
            "WHERE tgrelid = ('token_metadata.' || $1)::regclass AND NOT tgisinternal ORDER BY tgname",
          [table],
        ),
      });
      return {
        current: await of("metadata"),
        history: await of("metadata_history"),
        trigger: await read.query(
          "SELECT pg_catalog.pg_get_triggerdef(t.oid) AS definition, t.tgenabled::text AS enabled " +
            "FROM pg_catalog.pg_trigger t " +
            "WHERE t.tgrelid = 'token_metadata.metadata'::regclass AND t.tgname = 'versions'",
        ),
        function: await read.query(
          "SELECT pg_catalog.pg_get_userbyid(p.proowner)::text AS owner, p.prosecdef AS security_definer, " +
            "l.lanname::text AS language, p.proconfig AS config, p.provolatile::text AS volatility " +
            "FROM pg_catalog.pg_proc p JOIN pg_catalog.pg_language l ON l.oid = p.prolang " +
            "WHERE p.oid = 'token_metadata.metadata_versions()'::regprocedure",
        ),
      };
    });
    const table = (options: string[] | null) => [{ owner: TOKEN_METADATA_ROLE, options, kind: "r", persistence: "p" }];
    expect(shape.current.table).toEqual(table(["fillfactor=90"]));
    expect(shape.history.table).toEqual(table(null));
    // No collation of their own: DT-2's byte order is applied by the component where rows are read in key order.
    const column = (name: string, type: string, collation: string | null = null) => ({
      name,
      type,
      not_null: true,
      collation,
      has_default: false,
    });
    expect(shape.current.columns).toEqual([
      column("key", "text", "default"),
      column("value", "jsonb"),
      column("from_height", "bigint"),
    ]);
    expect(shape.history.columns).toEqual([
      column("key", "text", "default"),
      column("from_height", "bigint"),
      column("to_height", "bigint"),
      column("value", "jsonb"),
    ]);
    // No index but the keys: an index on the current table's `value` would stop its updates from being heap-only.
    expect(shape.current.indexes).toEqual([{ is_primary: true, columns: ["key"] }]);
    expect(shape.history.indexes).toEqual([{ is_primary: true, columns: ["key", "from_height"] }]);
    const byName = (a: { name: string }, b: { name: string }) => (a.name < b.name ? -1 : 1);
    const integers = { name: integerCheckName("value"), type: "c" };
    expect(shape.current.constraints.map(({ name, type }) => ({ name, type }))).toEqual(
      [
        integers,
        { name: "metadata_pkey", type: "p" },
        { name: "metadata_key_not_null", type: "n" },
        { name: "metadata_value_not_null", type: "n" },
        { name: "metadata_from_height_not_null", type: "n" },
      ].sort(byName),
    );
    expect(shape.history.constraints.map(({ name, type }) => ({ name, type }))).toEqual(
      [
        integers,
        { name: "metadata_history_check", type: "c" },
        { name: "metadata_history_pkey", type: "p" },
        { name: "metadata_history_key_not_null", type: "n" },
        { name: "metadata_history_from_height_not_null", type: "n" },
        { name: "metadata_history_to_height_not_null", type: "n" },
        { name: "metadata_history_value_not_null", type: "n" },
      ].sort(byName),
    );
    expect(shape.history.constraints.find((c) => c.name === "metadata_history_check")?.definition).toBe(
      "CHECK ((from_height < to_height))",
    );
    // The history trigger beside change capture's and the TRUNCATE guard; the history table has the other two.
    expect(shape.current.triggers.map((t) => t.name)).toEqual([
      "umbradb_capture_changes",
      "umbradb_truncate_not_allowed",
      "versions",
    ]);
    expect(shape.history.triggers.map((t) => t.name)).toEqual([
      "umbradb_capture_changes",
      "umbradb_truncate_not_allowed",
    ]);
    expect(shape.trigger).toEqual([
      {
        definition:
          "CREATE TRIGGER versions BEFORE INSERT OR DELETE OR UPDATE ON token_metadata.metadata FOR EACH ROW " +
          "EXECUTE FUNCTION token_metadata.metadata_versions()",
        enabled: "O",
      },
    ]);
    // The trigger runs as the module's role: its function is the role's, not SECURITY DEFINER, with no settings.
    expect(shape.function).toEqual([
      { owner: TOKEN_METADATA_ROLE, security_definer: false, language: "plpgsql", config: null, volatility: "v" },
    ]);
  });

  it("SH-2's scenario through the runner: A at 10, B at 20, deleted at 30; read at every height", async () => {
    const { db } = await freshDatabase(backend);
    const seen: [bigint, bigint | null, VersionedValue | undefined, VersionedValue | undefined][] = [];
    const module = tokenMetadata({
      async "on-db-write"(_p, b, w) {
        if (b.height === 10n) await METADATA.write(w, b, "k", "A");
        if (b.height === 20n) await METADATA.write(w, b, "k", "B");
        if (b.height === 30n) await METADATA.delete(w, b, "k");
      },
      async "on-after-db-write"(_p, b, read) {
        seen.push([b.height, read.height, await METADATA.read(read, "k"), await METADATA.read(read, "k", b.height)]);
      },
    });
    const started = await startWith(db, [module], [entry("token-metadata", 1)]);
    await runUntilWaiting(started, new InMemoryBlockSource({ head: 32n }), 32n);
    const expected = (h: bigint): VersionedValue | undefined =>
      h < 10n ? undefined : h < 20n ? "A" : h < 30n ? "B" : undefined;
    expect(seen).toEqual(
      Array.from({ length: 32 }, (_, i) => BigInt(i + 1)).map((h) => [h, h, expected(h), expected(h)]),
    );
    const read = await db.read(async (r) => {
      const all: [bigint, VersionedValue | undefined][] = [];
      for (let h = 0n; h <= 40n; h++) all.push([h, await METADATA.read(r, "k", h)]);
      return { all, now: await METADATA.read(r, "k"), versions: await versionsOf(r, METADATA, "k") };
    });
    expect(read.all).toEqual(Array.from({ length: 41 }, (_, i) => [BigInt(i), expected(BigInt(i))]));
    expect(read.now).toBeUndefined();
    expect(read.versions).toEqual([version(10, 20, "A"), version(20, 30, "B")]);
  });

  it("reads through the block write handle the block's writes at its height, before it what committed", async () => {
    await database.block(async (w, b) => {
      await METADATA.write(w, b, "own/k", "old");
    });
    const reads: unknown[] = [];
    await database.block(async (w, b) => {
      await METADATA.write(w, b, "own/k", "new");
      await METADATA.write(w, b, "own/fresh", "first");
      reads.push(
        await METADATA.read(w, "own/k"),
        await METADATA.read(w, "own/k", b.height),
        await METADATA.read(w, "own/k", b.height - 1n),
        await METADATA.read(w, "own/fresh", b.height),
        await METADATA.read(w, "own/fresh", b.height - 1n),
        await METADATA.read(w, "own/never"),
        await METADATA.read(w, "own/never", b.height),
      );
    });
    expect(reads).toEqual(["new", "new", "old", "first", undefined, undefined, undefined]);
    // A height above the read's own reads the version current then (nothing is known past it).
    const above = await database.db.read(async (r) => [
      r.height,
      await METADATA.read(r, "own/k", (r.height ?? 0n) + 50n),
    ]);
    expect(above).toEqual([database.committed, "new"]);
  });

  it("adds no version for the value the key has: the same members in another order, 1 as 1n (SH-2)", async () => {
    const digest = () =>
      database.db.read((r) =>
        r.query(
          `SELECT "table", height, digest FROM core_digest.tables WHERE "schema" = 'token_metadata' ORDER BY "table"`,
        ),
      );
    await database.block(async (w, b) => {
      await METADATA.write(w, b, "same/k", { a: 1, b: [2, "x"], c: null });
    });
    const from = database.committed as bigint;
    const digests = await digest();
    // The transaction that last wrote the row (`xmin`): the trigger skips a write of the value the row has, so the row
    // is left as it is — not rewritten with its own contents.
    const writer = () =>
      database.db.read((r) =>
        r.query("SELECT xmin::text AS xmin FROM token_metadata.metadata WHERE key = $1", ["same/k"]),
      );
    const before = await writer();
    await database.block(async (w, b) => {
      await METADATA.write(w, b, "same/k", { c: null, b: [2n, "x"], a: 1n });
    });
    expect((await stateOf(database, "same/k")).versions).toEqual([
      version(Number(from), null, { a: 1, b: [2, "x"], c: null }),
    ]);
    expect(await writer()).toEqual(before);
    // Nothing changed, so no table of the module has a new digest at this height (DT-4).
    expect(await digest()).toEqual(digests);
    // A different value closes the version: an array's order counts.
    await database.block(async (w, b) => {
      await METADATA.write(w, b, "same/k", { a: 1, b: ["x", 2], c: null });
    });
    const third = database.committed as bigint;
    expect((await stateOf(database, "same/k")).versions).toEqual([
      version(Number(from), Number(third), { a: 1, b: [2, "x"], c: null }),
      version(Number(third), null, { a: 1, b: ["x", 2], c: null }),
    ]);
  });

  it("stores JSON null as a value, distinct from a key with no version, and deletes it like any value", async () => {
    await database.block(async (w, b) => {
      await METADATA.write(w, b, "null/k", null);
    });
    const written = database.committed as bigint;
    await database.block(async (w, b) => {
      await METADATA.write(w, b, "null/k", null);
    });
    await database.block(async (w, b) => {
      await METADATA.delete(w, b, "null/k");
    });
    const deleted = database.committed as bigint;
    const read = await database.db.read(async (r) => ({
      at: await METADATA.read(r, "null/k", written),
      before: await METADATA.read(r, "null/k", written - 1n),
      after: await METADATA.read(r, "null/k", deleted),
      stored: await r.query(
        "SELECT value IS NULL AS sql_null, jsonb_typeof(value) AS kind FROM token_metadata.metadata_history " +
          "WHERE key = $1",
        ["null/k"],
      ),
    }));
    expect(read).toEqual({
      at: null,
      before: undefined,
      after: undefined,
      stored: [{ sql_null: false, kind: "null" }],
    });
    expect((await stateOf(database, "null/k")).versions).toEqual([version(Number(written), Number(deleted), null)]);
  });

  it("keeps canonical JSON losslessly in both tables: integers beyond 2^53 exactly (DB-2)", async () => {
    const values: VersionedValue[] = [
      9_007_199_254_740_993n,
      2n ** 63n - 1n,
      -(2n ** 63n),
      { amount: [7_000_000_000_000_000_000n] },
    ];
    const heights: bigint[] = [];
    for (const value of values) {
      await database.block(async (w, b) => {
        await METADATA.write(w, b, "lossless/k", value);
      });
      heights.push(database.committed as bigint);
    }
    const read = await database.db.read(async (r) => {
      const all: unknown[] = [];
      for (const h of heights) all.push(await METADATA.read(r, "lossless/k", h));
      return all;
    });
    expect(read).toEqual(values);
  });

  it("refuses non-canonical JSON (DT-1, Q57): a fraction or an integer beyond 64 bits fails the block", async () => {
    await database.block(async (w, b) => {
      await METADATA.write(w, b, "canonical/k", 1);
    });
    const at = database.committed as bigint;
    for (const bad of [1.5, { x: 0.1 }, 2n ** 63n, [1e21]]) {
      const error = await outcome(
        database.block(async (w, b) => {
          await METADATA.write(w, b, "canonical/k", bad);
        }),
      );
      expectRefused(error, "23514", "metadata");
      expect((error as UmbraError).details.constraint).toBe(integerCheckName("value"));
    }
    expect(database.committed).toBe(at);
    expect((await stateOf(database, "canonical/k")).versions).toEqual([version(Number(at), null, 1)]);
  });

  it("refuses a value JSON cannot hold before sending anything, so the block goes on (invalid-parameter)", async () => {
    const errors: unknown[] = [];
    await database.block(async (w, b) => {
      for (const bad of [Number.NaN, undefined, new Date(0), new Map(), { x: undefined }]) {
        errors.push(await outcome(METADATA.write(w, b, "json/k", bad as VersionedValue)));
      }
      // Nothing was sent, so the block's transaction is not aborted, and the key is still unchanged in it.
      await METADATA.write(w, b, "json/k", "kept");
    });
    for (const error of errors) {
      expect(error).toBeInstanceOf(UmbraError);
      expect((error as UmbraError).code).toBe("invalid-parameter");
      expect((error as UmbraError).details).toEqual({ index: 1 });
    }
    expect((await stateOf(database, "json/k")).now).toBe("kept");
  });

  describe("A61: a second change of a key in one block fails the block (SH-3)", () => {
    it("refuses the second write with 23505, rolls the block back and leaves the key as it was", async () => {
      expect(await secondChangeProblems(database, METADATA, "a61/k")).toEqual([]);
    });

    it("negative control: a table letting a second change of a key in one block through fails that check", async () => {
      const problems = await secondChangeProblems(database, LENIENT.table, "a61/lenient");
      expect(problems).toEqual([
        "a second change of a key in one block went through, and the block committed",
        "the second write was not refused with 23505: resolved",
        `the committed height moved from ${(database.committed as bigint) - 1n} to ${database.committed}`,
        "the key reads 3, not 1",
        `the key has versions [${(database.committed as bigint) - 1n}, ${database.committed}) ` +
          `[${database.committed}, …)`,
      ]);
    });

    it("refuses every second change: a new key twice, a write then a delete, a delete then a write", async () => {
      await database.block(async (w, b) => {
        await METADATA.write(w, b, "pairs/deleted", "d");
        await METADATA.write(w, b, "pairs/written", "w");
      });
      const committed = database.committed;
      const pairs: [string, (w: BlockWriteHandle, b: BlockContext) => Promise<void>][] = [
        [
          "pairs/new",
          async (w, b) => {
            await METADATA.write(w, b, "pairs/new", 1);
            await METADATA.write(w, b, "pairs/new", 2);
          },
        ],
        [
          "pairs/written",
          async (w, b) => {
            await METADATA.write(w, b, "pairs/written", "w2");
            await METADATA.delete(w, b, "pairs/written");
          },
        ],
        [
          "pairs/deleted",
          async (w, b) => {
            await METADATA.delete(w, b, "pairs/deleted");
            await METADATA.write(w, b, "pairs/deleted", "d2");
          },
        ],
      ];
      for (const [key, body] of pairs) {
        const error = await outcome(database.block(body));
        const at = (committed as bigint) + 1n;
        const message = new RegExp(`the key '${key}' changed already at height ${at}, in this block`);
        expectRefused(error, "23505", "metadata", message);
      }
      expect(database.committed).toBe(committed);
      expect((await stateOf(database, "pairs/new")).versions).toEqual([]);
      expect((await stateOf(database, "pairs/written")).versions).toEqual([version(Number(committed), null, "w")]);
      expect((await stateOf(database, "pairs/deleted")).versions).toEqual([version(Number(committed), null, "d")]);
    });

    it("checks a key's latest version, also after several: a delete then a write, a height below its end", async () => {
      for (const value of [1, 2, 3]) {
        await database.block(async (w, b) => {
          await METADATA.write(w, b, "latest/k", value);
        });
      }
      const third = database.committed as bigint;
      const twice = await outcome(
        database.block(async (w, b) => {
          await METADATA.delete(w, b, "latest/k");
          await METADATA.write(w, b, "latest/k", 4);
        }),
      );
      const changed = new RegExp(`'latest/k' changed already at height ${third + 1n}, in this block`);
      expectRefused(twice, "23505", "metadata", changed);
      await database.block(async (w, b) => {
        await METADATA.delete(w, b, "latest/k");
      });
      const deleted = database.committed as bigint;
      const below = await outcome(
        database.block(async (w) => {
          await METADATA.write(w, { height: deleted - 1n }, "latest/k", 5);
        }),
      );
      const reach = new RegExp(`at height ${deleted - 1n}: its versions reach height ${deleted},`);
      expectRefused(below, "23P01", "metadata", reach);
      const first = Number(third) - 2;
      expect((await stateOf(database, "latest/k")).versions).toEqual([
        version(first, first + 1, 1),
        version(first + 1, first + 2, 2),
        version(first + 2, Number(deleted), 3),
      ]);
    });

    it("fails the block even when the module catches the refusal: it aborted the block's transaction", async () => {
      const before = database.committed;
      let caught: unknown;
      const error = await outcome(
        database.block(async (w, b) => {
          await METADATA.write(w, b, "caught/k", 1);
          try {
            await METADATA.write(w, b, "caught/k", 2);
          } catch (refused) {
            caught = refused;
          }
        }),
      );
      expectRefused(caught, "23505", "metadata");
      // The next statement of the block — the role's reset after the callback — finds the transaction aborted.
      expect(error).toBeInstanceOf(UmbraError);
      expect((error as UmbraError).code).toBe("database-error");
      expect((error as UmbraError).details.sqlstate).toBe("25P02");
      expect(database.committed).toBe(before);
      expect((await stateOf(database, "caught/k")).versions).toEqual([]);
    });

    it("halts the finalized loop at that height, a callback error of the module in on-db-write (RN-8)", async () => {
      const { db } = await freshDatabase(backend);
      const module = tokenMetadata({
        async "on-db-write"(_p, b, w) {
          await METADATA.write(w, b, "k", `at ${b.height}`);
          if (b.height === 3n) await METADATA.write(w, b, "k", "again");
        },
      });
      const started = await startWith(db, [module], [entry("token-metadata", 1)]);
      const failure = await failureOf(started, new InMemoryBlockSource({ head: 5n }), 5n);
      expect(failure).toBeInstanceOf(HeightFailure);
      const { height, point, module: failed, committed } = failure as HeightFailure;
      expect({ height, point, module: failed, committed }).toEqual({
        height: 3n,
        point: "on-db-write",
        module: "token-metadata",
        committed: false,
      });
      expect(umbraCause(failure)?.details).toMatchObject({
        sqlstate: "23505",
        schema: "token_metadata",
        table: "metadata",
      });
      expect(await cursorOf(db)).toBe(2n);
      expect(await db.read((r) => versionsOf(r, METADATA, "k"))).toEqual([
        version(1, 2, "at 1"),
        version(2, null, "at 2"),
      ]);
    });

    it("does not refuse what changes nothing (Q110): the value a key has, a delete of a key with none", async () => {
      await database.block(async (w, b) => {
        await METADATA.write(w, b, "nothing/same-first", "v");
        await METADATA.write(w, b, "nothing/same-after", "v");
        await METADATA.write(w, b, "nothing/deleted-twice", "v");
      });
      const first = database.committed as bigint;
      await database.block(async (w, b) => {
        // The value it has (no version), then a change: the block's one change of the key.
        await METADATA.write(w, b, "nothing/same-first", "v");
        await METADATA.write(w, b, "nothing/same-first", "w");
        // A change, then the value it has now: nothing more changes.
        await METADATA.write(w, b, "nothing/same-after", "w");
        await METADATA.write(w, b, "nothing/same-after", "w");
        // A delete of a key with no version, then a write.
        await METADATA.delete(w, b, "nothing/none");
        await METADATA.write(w, b, "nothing/none", "w");
        // A delete, then a delete of the key that has no version now.
        await METADATA.delete(w, b, "nothing/deleted-twice");
        await METADATA.delete(w, b, "nothing/deleted-twice");
      });
      const second = database.committed as bigint;
      expect(second).toBe(first + 1n);
      const versions = await database.db.read(async (r) => {
        const all: Record<string, StoredVersion[]> = {};
        for (const key of ["same-first", "same-after", "none", "deleted-twice"]) {
          all[key] = await versionsOf(r, METADATA, `nothing/${key}`);
        }
        return all;
      });
      const [f, s] = [Number(first), Number(second)];
      expect(versions).toEqual({
        "same-first": [version(f, s, "v"), version(s, null, "w")],
        "same-after": [version(f, s, "v"), version(s, null, "w")],
        none: [version(s, null, "w")],
        "deleted-twice": [version(f, s, "v")],
      });
    });
  });

  it("refuses heights below a key's versions (23P01), a DELETE not by the helper, a key change (0A000)", async () => {
    await database.block(async (w, b) => {
      await METADATA.write(w, b, "misuse/k", 1);
      await METADATA.write(w, b, "misuse/gone", 1);
    });
    const at = database.committed as bigint;
    await database.block(async (w, b) => {
      await METADATA.delete(w, b, "misuse/gone");
    });
    const reach = (h: bigint, reached: bigint) =>
      new RegExp(`cannot change at height ${h}: its versions reach height ${reached}, and heights only go up`);
    const refusals: [(w: BlockWriteHandle) => Promise<unknown>, string, RegExp][] = [
      // A block other than the one being written: below the key's current version, below a delete's end.
      [(w) => METADATA.write(w, { height: at - 1n }, "misuse/k", 2), "23P01", reach(at - 1n, at)],
      [(w) => METADATA.delete(w, { height: at - 1n }, "misuse/k"), "23P01", reach(at - 1n, at)],
      [(w) => METADATA.write(w, { height: at }, "misuse/gone", 2), "23P01", reach(at, at + 1n)],
      // A DELETE the helper did not make has no height to close the version at.
      [
        (w) => w.execute("DELETE FROM token_metadata.metadata WHERE key = $1", ["misuse/k"]),
        "0A000",
        /the key 'misuse\/k' is deleted only through the helper's delete, which gives the height/,
      ],
      [
        (w) => w.execute("UPDATE token_metadata.metadata SET key = $1 WHERE key = $2", ["misuse/k2", "misuse/k"]),
        "0A000",
        /the key 'misuse\/k' cannot change to 'misuse\/k2'; delete it, and write the new key/,
      ],
    ];
    const committed = database.committed;
    for (const [body, sqlstate, message] of refusals) {
      const error = await outcome(
        database.block(async (w) => {
          await body(w);
        }),
      );
      expectRefused(error, sqlstate, "metadata", message);
    }
    expect(database.committed).toBe(committed);
    expect((await stateOf(database, "misuse/k")).versions).toEqual([version(Number(at), null, 1)]);
    expect((await stateOf(database, "misuse/gone")).versions).toEqual([version(Number(at), Number(at) + 1, 1)]);
  });

  it("writes only its module's schema: another module's writes and deletes fail (42501), its reads work", async () => {
    await database.block(async (w, b) => {
      await METADATA.write(w, b, "owned/k", "token-metadata");
    });
    const at = database.committed as bigint;
    const reads: unknown[] = [];
    for (const change of [
      (w: BlockWriteHandle, b: BlockContext) => METADATA.write(w, b, "owned/k", "token-scan"),
      (w: BlockWriteHandle, b: BlockContext) => METADATA.delete(w, b, "owned/k"),
    ]) {
      const error = await outcome(
        database.block(
          async (w, b) => {
            reads.push(await METADATA.read(w, "owned/k"), await METADATA.read(w, "owned/k", at));
            await change(w, b);
          },
          { part: "token-scan" },
        ),
      );
      expect(error).toBeInstanceOf(UmbraError);
      expect((error as UmbraError).details.sqlstate).toBe("42501");
      expect((error as UmbraError).message).toMatch(/permission denied for table metadata/);
    }
    expect(reads).toEqual(["token-metadata", "token-metadata", "token-metadata", "token-metadata"]);
    expect((await stateOf(database, "owned/k")).versions).toEqual([version(Number(at), null, "token-metadata")]);
  });

  it("keeps no handle: a use of a handle kept past its callback fails with handle-closed (DB-3, A10)", async () => {
    let kept: [BlockWriteHandle, BlockContext] | undefined;
    const closedUses: UmbraError[] = [];
    await database.block(
      async (w, b) => {
        kept = [w, b];
        await METADATA.write(w, b, "kept/k", 1);
      },
      { onClosedUse: (error) => closedUses.push(error) },
    );
    const [w, b] = kept as [BlockWriteHandle, BlockContext];
    const uses = [
      await outcome(METADATA.write(w, b, "kept/k", 2)),
      await outcome(METADATA.delete(w, b, "kept/k")),
      await outcome(METADATA.read(w, "kept/k")),
      await outcome(METADATA.read(w, "kept/k", b.height)),
    ];
    for (const error of uses) {
      expect(error).toBeInstanceOf(UmbraError);
      expect((error as UmbraError).code).toBe("handle-closed");
      expect((error as UmbraError).details).toEqual({
        handle: "block-write",
        module: "token-metadata",
        point: "on-db-write",
      });
    }
    expect(closedUses).toEqual(uses);
    expect((await stateOf(database, "kept/k")).now).toBe(1);
  });

  it("is digested per block like any module table, both tables; a write of the same value is no change", async () => {
    const digests = async () =>
      new Map(
        (
          await database.db.read((r) =>
            r.query(`SELECT "table", height, digest FROM core_digest.tables WHERE "schema" = 'token_metadata'`),
          )
        ).map((row) => [row.table as string, [row.height as bigint, row.digest as Uint8Array] as const]),
      );
    await database.block(async (w, b) => {
      await METADATA.write(w, b, "digest/k", { at: 1 });
    });
    const first = await digests();
    expect(first.get("metadata")?.[0]).toBe(database.committed);
    await database.block(async (w, b) => {
      await METADATA.write(w, b, "digest/k", { at: 1 });
    });
    expect(await digests()).toEqual(first);
    await database.block(async (w, b) => {
      await METADATA.write(w, b, "digest/k", { at: 2 });
    });
    const third = await digests();
    // The new version changes the current table; the closed one is a new row of the history.
    expect(third.get("metadata")?.[0]).toBe(database.committed);
    expect(third.get("metadata_history")?.[0]).toBe(database.committed);
    expect(third.get("metadata")?.[1]).not.toEqual(first.get("metadata")?.[1]);
  });

  it("keeps keys as text compared by bytes, read in DT-2's key order and encoded as DT-1 says (DT-3)", async () => {
    const fresh = await versionedDatabase(backend);
    // A precomposed and a decomposed "é" are two keys; a no-break space sorts after the letters.
    const keys = ["b", "B", "a", "é", "é", "", "a "];
    for (const round of [1, 2]) {
      await fresh.block(async (w, b) => {
        for (const [index, key] of keys.entries()) await METADATA.write(w, b, key, { index, round });
      });
    }
    const { current, history, hash } = await fresh.db.read(async (read) => {
      const tables = await moduleTables(read);
      const rowsOf = async (name: string) => {
        const table = tables.find((t) => t.schema === "token_metadata" && t.name === name);
        const all: unknown[][] = [];
        if (table !== undefined) for await (const row of rowsInKeyOrder(read, table)) all.push(row);
        return { columns: table?.columns.map(({ name: column, type }) => [column, type]), key: table?.key, rows: all };
      };
      return {
        current: await rowsOf("metadata"),
        history: await rowsOf("metadata_history"),
        hash: await contentsHash(read),
      };
    });
    expect(current.columns).toEqual([
      ["key", "text"],
      ["value", "jsonb"],
      ["from_height", "bigint"],
    ]);
    expect(current.key).toEqual([0]);
    expect(history.columns).toEqual([
      ["key", "text"],
      ["from_height", "bigint"],
      ["to_height", "bigint"],
      ["value", "jsonb"],
    ]);
    expect(history.key).toEqual([0, 1]);
    const byBytes = [...keys].sort((x, y) => Buffer.compare(Buffer.from(x, "utf8"), Buffer.from(y, "utf8")));
    expect(byBytes).toEqual(["", "B", "a", "a ", "b", "é", "é"]);
    expect(current.rows).toEqual(byBytes.map((key) => [key, { index: keys.indexOf(key), round: 2 }, 2n]));
    expect(history.rows).toEqual(byBytes.map((key) => [key, 1n, 2n, { index: keys.indexOf(key), round: 1 }]));
    for (const row of current.rows) expect(encodeRow(row, ["text", "jsonb", "bigint"]).length).toBeGreaterThan(0);
    for (const row of history.rows) {
      expect(encodeRow(row, ["text", "bigint", "bigint", "jsonb"]).length).toBeGreaterThan(0);
    }
    expect(hash).toHaveLength(32);
  });

  it("writes in the block's transaction: a block that rolls back takes its versions with it", async () => {
    await database.block(async (w, b) => {
      await METADATA.write(w, b, "rollback/k", "kept");
    });
    const at = database.committed as bigint;
    const failed = await outcome(
      database.block(async (w, b) => {
        await METADATA.write(w, b, "rollback/k", "gone");
        await METADATA.write(w, b, "rollback/new", "gone");
        throw new BlockFails("the block fails after its writes");
      }),
    );
    expect(failed).toBeInstanceOf(BlockFails);
    expect(database.committed).toBe(at);
    expect((await stateOf(database, "rollback/k")).versions).toEqual([version(Number(at), null, "kept")]);
    expect((await stateOf(database, "rollback/new")).versions).toEqual([]);
    // The retried height writes again, as the runner retries it.
    await database.block(async (w, b) => {
      await METADATA.write(w, b, "rollback/k", "retried");
    });
    expect((await stateOf(database, "rollback/k")).versions).toEqual([
      version(Number(at), Number(at) + 1, "kept"),
      version(Number(at) + 1, null, "retried"),
    ]);
  });
});
