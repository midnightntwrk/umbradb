import { readFile } from "node:fs/promises";
import { afterAll, beforeAll, describe, expect, expectTypeOf, it } from "vitest";
import type { BlockWriteHandle, ReadHandle, Transaction } from "../../src/db/api.js";
import { UmbraError } from "../../src/db/errors.js";
import { migrationChecksum } from "../../src/db/roles.js";
import { encodeRow } from "../../src/determinism/cbor.js";
import { contentsHash } from "../../src/determinism/contents-hash.js";
import { moduleTables, rowsInKeyOrder } from "../../src/determinism/module-tables.js";
import { integerCheckName } from "../../src/deterministic-postgresql/index.js";
import { type CursorTable, type CursorValue, cursorTable } from "../../src/helpers/cursor-table.js";
import type { Migration } from "../../src/modules/declaration.js";
import { InMemoryBlockSource } from "../../src/runner/in-memory-source.js";
import { BACKENDS } from "../db/backends.js";
import { entry } from "../modules/graph-fixtures.js";
import { runUntilWaiting, startWith } from "../runner/loop-harness.js";
import {
  CURSORS,
  type CursorDatabase,
  cursorDatabase,
  freshDatabase,
  WALLET_SCAN_ROLE,
  walletScan,
} from "./cursor-harness.js";

/**
 * The cursor-table helper (task 6.1; SH-1; `design.md` §1, §10, §12; CORE-ARCH §4.11a; owner decisions Q27, Q30),
 * refactored from 0.9.5's Watermarks: a library function a module calls to get its table's migration and the read and
 * write functions over the handles its callbacks are given — never a module of its own, never a connection or a
 * transaction of its own. Its property, A59 (P9 retargeted), is `cursor-table.property.test.ts`.
 *
 * The cases of 0.9.5's `test/postgres/watermarks.test.ts` that still apply are here, retargeted (that file stays, on
 * `PgWatermarks`, until task 17.2 retires the class): the table as its migration makes it (fillfactor 90, no index but
 * the key), a missing key reading as nothing, the last of several writes, other keys untouched, scalar roots, a write
 * seen before the commit and gone after a rollback, and large integers — now exact as `bigint`, where 0.9.5 asked for
 * decimal strings because its driver's `JSON.parse` rounded them.
 */

const CREATE_SQL =
  'CREATE TABLE "wallet_scan"."cursors" ' +
  "(key text PRIMARY KEY, value jsonb NOT NULL) WITH (fillfactor = 90)";

/** What `run` rejects with, or "resolved". */
function outcome(run: Promise<unknown>): Promise<unknown> {
  return run.then(
    () => "resolved",
    (error: unknown) => error,
  );
}

class BlockFails extends Error {}

describe("the cursor-table helper itself (SH-1; design §12's cursorTable)", () => {
  it("gives the migration that creates its table, with the id the module gives it; its SQL is fixed", () => {
    expect(CURSORS.migration("001")).toEqual({ id: "001", sql: CREATE_SQL });
    expect(CURSORS.migration("014")).toEqual({ id: "014", sql: CREATE_SQL });
    // The SQL is part of the checksum of the module's migration (DB-9): another text in a later build would make every
    // database that applied it refuse to start (`migration-checksum-changed`). This pins the bytes.
    expect(migrationChecksum(CREATE_SQL)).toBe("07497a4875b7ef5a9145d3bc9a367678332d355fa71269b4c89ce0c6fa6a5d53");
    // Names are quoted, so a reserved word is a name like any other.
    expect(cursorTable({ schema: "order", table: "select" }).migration("001").sql).toBe(
      'CREATE TABLE "order"."select" (key text PRIMARY KEY, value jsonb NOT NULL) WITH (fillfactor = 90)',
    );
  });

  it("is frozen, names its schema and table, and gives frozen migrations", () => {
    expect(Object.isFrozen(CURSORS)).toBe(true);
    expect([CURSORS.schema, CURSORS.table]).toEqual(["wallet_scan", "cursors"]);
    const migration: Migration = CURSORS.migration("001");
    expect(Object.isFrozen(migration)).toBe(true);
    expect(Object.keys(migration)).toEqual(["id", "sql"]);
    expect([CURSORS.migration("001").id, CURSORS.migration("002").id]).toEqual(["001", "002"]);
    expect(Object.keys(CURSORS).sort()).toEqual(["migration", "read", "schema", "table", "write"]);
  });

  it("refuses a schema or table name that is not a lowercase identifier of at most 63 bytes, naming it", () => {
    const longest = `t${"x".repeat(62)}`;
    for (const name of ["_x", "x_1", "a", longest]) {
      expect(cursorTable({ schema: name, table: name }).migration("001").sql).toContain(`"${name}"."${name}"`);
    }
    for (const bad of ["", "Cursors", "1st", "a-b", "a b", 'a"b', "é", `${longest}x`, "a.b"]) {
      expect(() => cursorTable({ schema: bad, table: "cursors" }), JSON.stringify(bad)).toThrow(TypeError);
      expect(() => cursorTable({ schema: "wallet_scan", table: bad }), JSON.stringify(bad)).toThrow(TypeError);
    }
    expect(() => cursorTable({ schema: "Wallet", table: "cursors" })).toThrow(
      'cursorTable: the schema "Wallet" is not a lowercase identifier ([a-z_][a-z0-9_]*) of at most 63 bytes',
    );
    expect(() => cursorTable({ schema: "wallet_scan", table: `${longest}x` })).toThrow(
      `cursorTable: the table "${longest}x" is not a lowercase identifier ([a-z_][a-z0-9_]*) of at most 63 bytes`,
    );
    // From JavaScript: anything but a string is refused, also what would print as a valid name.
    for (const bad of [7, ["wallet_scan"], null, undefined, { toString: () => "wallet_scan" }]) {
      const options = { schema: bad, table: "cursors" } as unknown as { schema: string; table: string };
      expect(() => cursorTable(options), String(bad)).toThrow(/^cursorTable: the schema .* is not a lowercase/);
    }
    expect(() => cursorTable(undefined as unknown as { schema: string; table: string })).toThrow(TypeError);
  });

  it("writes through the block write handle and reads through any handle's query (CORE-ARCH §4.10)", () => {
    expectTypeOf<CursorTable["write"]>().parameters.toEqualTypeOf<[BlockWriteHandle, string, CursorValue]>();
    expectTypeOf<CursorTable["write"]>().returns.toEqualTypeOf<Promise<void>>();
    expectTypeOf<CursorTable["read"]>().parameters.toEqualTypeOf<[Pick<ReadHandle, "query">, string]>();
    expectTypeOf<CursorTable["read"]>().returns.toEqualTypeOf<Promise<CursorValue | undefined>>();
    expectTypeOf<ReadHandle>().toExtend<Parameters<CursorTable["read"]>[0]>();
    expectTypeOf<BlockWriteHandle>().toExtend<Parameters<CursorTable["read"]>[0]>();
    // A transaction is no block write handle: the helper never writes outside the handle `on-db-write` is given.
    expectTypeOf<Transaction>().not.toExtend<Parameters<CursorTable["write"]>[0]>();
    expectTypeOf<ReadHandle>().not.toExtend<Parameters<CursorTable["write"]>[0]>();
  });

  it("is a library, not a module: it imports types only, and opens no connection or transaction", async () => {
    const source = await readFile(new URL("../../src/helpers/cursor-table.ts", import.meta.url), "utf8");
    // Every import or re-export statement, however many lines it spans, up to its semicolon.
    const statements = (source.match(/^(?:import|export)\b[^;]*;/gm) ?? []).filter((statement) =>
      /\bfrom\s*["']|^import\s*["']/.test(statement),
    );
    expect(statements.length).toBeGreaterThan(0);
    for (const statement of statements) expect(statement).toMatch(/^import type /);
    expect(source).not.toMatch(/\bimport\s*\(|\brequire\s*\(/);
  });
});

// Each test runs a few blocks on a database migrated with four parts: seconds under the parallel conformance run's
// load, so each test has two minutes.
describe.each(BACKENDS)("the cursor table on $name (SH-1)", { timeout: 120_000 }, (backend) => {
  let database: CursorDatabase;

  beforeAll(async () => {
    await backend.start();
    database = await cursorDatabase(backend);
  }, 180_000);

  afterAll(() => backend.stop(), 60_000);

  it("is a table of the module's schema, owned by its role, as its migration made it, with DT-6's CHECK", async () => {
    const shape = await database.db.read(async (read) => ({
      table: await read.query(
        "SELECT pg_catalog.pg_get_userbyid(c.relowner)::text AS owner, c.reloptions AS options, " +
          "c.relkind::text AS kind, c.relpersistence::text AS persistence FROM pg_catalog.pg_class c " +
          "JOIN pg_catalog.pg_namespace n ON n.oid = c.relnamespace " +
          "WHERE n.nspname = 'wallet_scan' AND c.relname = 'cursors'",
      ),
      columns: await read.query(
        "SELECT a.attname::text AS name, pg_catalog.format_type(a.atttypid, a.atttypmod) AS type, " +
          "a.attnotnull AS not_null, co.collname::text AS collation, a.atthasdef AS has_default " +
          "FROM pg_catalog.pg_attribute a " +
          "LEFT JOIN pg_catalog.pg_collation co ON co.oid = a.attcollation AND a.attcollation <> 0 " +
          "WHERE a.attrelid = 'wallet_scan.cursors'::regclass AND a.attnum > 0 AND NOT a.attisdropped " +
          "ORDER BY a.attnum",
      ),
      indexes: await read.query(
        "SELECT i.indisprimary AS is_primary, i.indisunique AS is_unique, " +
          "(SELECT pg_catalog.array_agg(a.attname::text ORDER BY k.n) " +
          "FROM pg_catalog.unnest(i.indkey) WITH ORDINALITY AS k(attnum, n) " +
          "JOIN pg_catalog.pg_attribute a ON a.attrelid = i.indrelid AND a.attnum = k.attnum) AS columns " +
          "FROM pg_catalog.pg_index i WHERE i.indrelid = 'wallet_scan.cursors'::regclass",
      ),
      constraints: await read.query(
        "SELECT conname::text AS name, contype::text AS type FROM pg_catalog.pg_constraint " +
          "WHERE conrelid = 'wallet_scan.cursors'::regclass ORDER BY conname",
      ),
    }));
    expect(shape.table).toEqual([{ owner: WALLET_SCAN_ROLE, options: ["fillfactor=90"], kind: "r", persistence: "p" }]);
    expect(shape.columns).toEqual([
      // No collation of its own: DT-2's byte order is applied by the component where rows are read in key order.
      { name: "key", type: "text", not_null: true, collation: "default", has_default: false },
      { name: "value", type: "jsonb", not_null: true, collation: null, has_default: false },
    ]);
    // No index but the key: an index on `value` would stop updates from being heap-only (0.9.5's fillfactor rule).
    expect(shape.indexes).toEqual([{ is_primary: true, is_unique: true, columns: ["key"] }]);
    // PostgreSQL 18 records each NOT NULL as a constraint of its own (type n).
    expect(shape.constraints).toEqual(
      [
        { name: integerCheckName("value"), type: "c" },
        { name: "cursors_pkey", type: "p" },
        { name: "cursors_key_not_null", type: "n" },
        { name: "cursors_value_not_null", type: "n" },
      ].sort((a, b) => (a.name < b.name ? -1 : 1)),
    );
  });

  it("reads a key never written as nothing, a key as its last write, and leaves other keys alone", async () => {
    await database.block(async (w) => {
      await CURSORS.write(w, "last/k", 1);
      await CURSORS.write(w, "last/other", "o");
    });
    await database.block(async (w) => {
      await CURSORS.write(w, "last/k", 2);
    });
    await database.block(async (w) => {
      await CURSORS.write(w, "last/k", 3);
    });
    const read = await database.db.read(async (r) => ({
      k: await CURSORS.read(r, "last/k"),
      other: await CURSORS.read(r, "last/other"),
      never: await CURSORS.read(r, "last/never"),
      height: r.height,
    }));
    expect(read).toEqual({ k: 3, other: "o", never: undefined, height: database.committed });
    expect("never" in read && read.never === undefined).toBe(true);
  });

  it("stores JSON null as a value, distinct from a key never written", async () => {
    await database.block(async (w) => {
      await CURSORS.write(w, "null/k", null);
    });
    const [stored] = await database.db.read((r) =>
      r.query(
        "SELECT value IS NULL AS sql_null, jsonb_typeof(value) AS kind FROM wallet_scan.cursors WHERE key = $1",
        ["null/k"],
      ),
    );
    expect(stored).toEqual({ sql_null: false, kind: "null" });
    expect(await database.db.read((r) => CURSORS.read(r, "null/k"))).toBeNull();
    expect(await database.db.read((r) => CURSORS.read(r, "null/none"))).toBeUndefined();
  });

  it("stores canonical JSON losslessly: scalars, arrays, objects, integers beyond 2^53 exactly (DB-2)", async () => {
    const values: [string, CursorValue, CursorValue][] = [
      ["string", "'quotes', \"doubles\", \u00e9", "'quotes', \"doubles\", \u00e9"],
      ["number", 42, 42],
      ["negative", -7, -7],
      ["zero", 0, 0],
      ["true", true, true],
      ["false", false, false],
      ["array", [1, "two", [3], { four: 4 }], [1, "two", [3], { four: 4 }]],
      [
        "object",
        { height: 12, hash: "0xab", nested: { list: [] } },
        { hash: "0xab", height: 12, nested: { list: [] } },
      ],
      ["empty-object", {}, {}],
      ["safe-bigint", 9_007_199_254_740_991n, 9_007_199_254_740_991],
      ["beyond-2^53", 9_007_199_254_740_993n, 9_007_199_254_740_993n],
      ["int64-max", 2n ** 63n - 1n, 2n ** 63n - 1n],
      ["int64-min", -(2n ** 63n), -(2n ** 63n)],
      ["nested-bigint", { amount: [7_000_000_000_000_000_000n] }, { amount: [7_000_000_000_000_000_000n] }],
    ];
    await database.block(async (w) => {
      for (const [key, written] of values) await CURSORS.write(w, `values/${key}`, written);
    });
    const read = await database.db.read(async (r) => {
      const all: [string, CursorValue | undefined][] = [];
      for (const [key] of values) all.push([key, await CURSORS.read(r, `values/${key}`)]);
      return all;
    });
    expect(read).toEqual(values.map(([key, , back]) => [key, back]));
  });

  it("refuses non-canonical JSON (DT-1, Q57): a fraction or an integer beyond 64 bits fails the block", async () => {
    await database.block(async (w) => {
      await CURSORS.write(w, "canonical/k", 1);
    });
    for (const bad of [1.5, { x: 0.1 }, 2n ** 63n, -(2n ** 63n) - 1n, [1e21]]) {
      const error = await outcome(
        database.block(async (w) => {
          await CURSORS.write(w, "canonical/k", bad);
        }),
      );
      expect(error, String(bad)).toBeInstanceOf(UmbraError);
      expect((error as UmbraError).code).toBe("database-error");
      const details = (error as UmbraError).details;
      expect(details).toMatchObject({ sqlstate: "23514", constraint: integerCheckName("value") });
    }
    expect(await database.db.read((r) => CURSORS.read(r, "canonical/k"))).toBe(1);
  });

  it("refuses a value JSON cannot hold before sending anything, so the block goes on (invalid-parameter)", async () => {
    const notJson: unknown[] = [
      Number.NaN,
      Number.POSITIVE_INFINITY,
      undefined,
      new Date(0),
      new Uint8Array([1]),
      new Map(),
      () => 1,
      { x: undefined },
    ];
    const errors: unknown[] = [];
    await database.block(async (w) => {
      for (const bad of notJson) errors.push(await outcome(CURSORS.write(w, "json/k", bad as CursorValue)));
      // Nothing was sent, so the block's transaction is not aborted: the next write lands.
      await CURSORS.write(w, "json/k", "kept");
    });
    for (const error of errors) {
      expect(error).toBeInstanceOf(UmbraError);
      expect((error as UmbraError).code).toBe("invalid-parameter");
      expect((error as UmbraError).details).toEqual({ index: 1 });
    }
    expect(await database.db.read((r) => CURSORS.read(r, "json/k"))).toBe("kept");
  });

  it("does not share SH-3: a second write of a key in one block wins, and the block commits", async () => {
    const seen: (CursorValue | undefined)[] = [];
    await database.block(async (w) => {
      await CURSORS.write(w, "twice/k", 1);
      seen.push(await CURSORS.read(w, "twice/k"));
      await CURSORS.write(w, "twice/k", 2);
      seen.push(await CURSORS.read(w, "twice/k"));
    });
    expect(seen).toEqual([1, 2]);
    expect(await database.db.read((r) => CURSORS.read(r, "twice/k"))).toBe(2);
  });

  it("writes in the block's transaction, under the module's role: seen in it, gone if it rolls back", async () => {
    expect(await problemsOf(database, CURSORS, "oracle/real")).toEqual([]);
  });

  it(
    backend.singleQueue
      ? "negative control: a helper writing in a transaction of its own fails that check (PGlite: nested-call)"
      : "negative control: a helper writing on a connection of its own fails that check",
    async () => {
      if (backend.singleQueue) {
        // PGlite has one connection; a transaction asked for inside the block's job is refused at once (DB-4, Q73).
        const problems = await problemsOf(database, ownTransaction(database), "oracle/own-transaction");
        expect(problems).toHaveLength(1);
        expect(problems[0]).toMatch(/^the block failed: db\.transaction\(\) was called inside a running read/);
      } else {
        expect(await problemsOf(database, ownConnection(database), "oracle/own-connection")).toEqual([
          `written as ${database.login}, not ${WALLET_SCAN_ROLE}`,
          "written in another transaction than the block's",
          "a write of a block that rolled back stayed",
        ]);
      }
    },
  );

  it("writes only its module's schema: another module's write is refused (42501, A13), its read works", async () => {
    await database.block(async (w) => {
      await CURSORS.write(w, "own/k", "wallet");
    });
    let read: CursorValue | undefined;
    const error = await outcome(
      database.block(
        async (w) => {
          read = await CURSORS.read(w, "own/k");
          await CURSORS.write(w, "own/k", "token");
        },
        { part: "token-scan" },
      ),
    );
    expect(read).toBe("wallet");
    expect(error).toBeInstanceOf(UmbraError);
    expect((error as UmbraError).code).toBe("database-error");
    expect((error as UmbraError).details.sqlstate).toBe("42501");
    expect((error as UmbraError).message).toMatch(/permission denied for table cursors/);
    expect(await database.db.read((r) => CURSORS.read(r, "own/k"))).toBe("wallet");
  });

  it("keeps no handle: a use of a handle kept past its callback fails with handle-closed (DB-3, A10)", async () => {
    let kept: BlockWriteHandle | undefined;
    const closedUses: UmbraError[] = [];
    await database.block(
      async (w) => {
        kept = w;
        await CURSORS.write(w, "kept/k", 1);
      },
      { onClosedUse: (error) => closedUses.push(error) },
    );
    const write = await outcome(CURSORS.write(kept as BlockWriteHandle, "kept/k", 2));
    const read = await outcome(CURSORS.read(kept as BlockWriteHandle, "kept/k"));
    for (const error of [write, read]) {
      expect(error).toBeInstanceOf(UmbraError);
      expect((error as UmbraError).code).toBe("handle-closed");
      const details = (error as UmbraError).details;
      expect(details).toEqual({ handle: "block-write", module: "wallet-scan", point: "on-db-write" });
    }
    expect(closedUses).toEqual([write, read]);
    expect(await database.db.read((r) => CURSORS.read(r, "kept/k"))).toBe(1);
  });

  it("is digested per block like any module table, a write of the same value being no change (DT-4)", async () => {
    const digestOf = () =>
      database.db.read(async (r) => {
        const [row] = await r.query(
          `SELECT height, digest FROM core_digest.tables WHERE "schema" = 'wallet_scan' AND "table" = 'cursors'`,
        );
        return row as { height: bigint; digest: Uint8Array } | undefined;
      });
    await database.block(async (w) => {
      await CURSORS.write(w, "digest/k", { at: 1 });
    });
    const first = await digestOf();
    expect(first?.height).toBe(database.committed);
    await database.block(async (w) => {
      await CURSORS.write(w, "digest/k", { at: 1 });
    });
    expect(await digestOf()).toEqual(first);
    await database.block(async (w) => {
      await CURSORS.write(w, "digest/k", { at: 2 });
    });
    const third = await digestOf();
    expect(third?.height).toBe(database.committed);
    expect(third?.digest).not.toEqual(first?.digest);
  });

  it("keeps keys as text compared by bytes, read in DT-2's key order and encoded as DT-1 says (DT-3)", async () => {
    const fresh = await cursorDatabase(backend);
    // A precomposed and a decomposed "é" are two keys; a no-break space sorts after the letters.
    const keys = ["b", "B", "a", "\u00e9", "e\u0301", "", "a\u00a0"];
    await fresh.block(async (w) => {
      for (const [index, key] of keys.entries()) await CURSORS.write(w, key, { index });
    });
    const { rows, hash } = await fresh.db.read(async (read) => {
      const tables = await moduleTables(read);
      const table = tables.find((t) => t.schema === "wallet_scan" && t.name === "cursors");
      expect(table?.columns.map(({ name, type }) => [name, type])).toEqual([
        ["key", "text"],
        ["value", "jsonb"],
      ]);
      expect(table?.key).toEqual([0]);
      const all: unknown[][] = [];
      if (table !== undefined) for await (const row of rowsInKeyOrder(read, table)) all.push(row);
      return { rows: all, hash: await contentsHash(read) };
    });
    const byBytes = [...keys].sort((x, y) => Buffer.compare(Buffer.from(x, "utf8"), Buffer.from(y, "utf8")));
    expect(byBytes).toEqual(["", "B", "a", "a\u00a0", "b", "e\u0301", "\u00e9"]);
    expect(rows).toEqual(byBytes.map((key) => [key, { index: keys.indexOf(key) }]));
    // Each row is encodable as DT-1 says; the contents hash encoded every row of the database, this table's too.
    for (const row of rows) expect(encodeRow(row, ["text", "jsonb"]).length).toBeGreaterThan(0);
    expect(hash).toHaveLength(32);
  });

  it("SH-1's scenario through the runner: k = 1 at height 5, k = 2 at 6; read at 6 or later, k is 2", async () => {
    const { db } = await freshDatabase(backend);
    const seen: [bigint, bigint | null, CursorValue | undefined][] = [];
    const module = walletScan({
      async "on-db-write"(_p, b, w) {
        if (b.height === 5n) await CURSORS.write(w, "k", 1);
        if (b.height === 6n) await CURSORS.write(w, "k", 2);
      },
      async "on-after-db-write"(_p, b, read) {
        seen.push([b.height, read.height, await CURSORS.read(read, "k")]);
      },
    });
    const started = await startWith(db, [module], [entry("wallet-scan", 1)]);
    await runUntilWaiting(started, new InMemoryBlockSource({ head: 8n }), 8n);
    expect(seen).toEqual([
      [1n, 1n, undefined],
      [2n, 2n, undefined],
      [3n, 3n, undefined],
      [4n, 4n, undefined],
      [5n, 5n, 1],
      [6n, 6n, 2],
      [7n, 7n, 2],
      [8n, 8n, 2],
    ]);
    expect(await db.read((r) => CURSORS.read(r, "k"))).toBe(2);
  });
});

/** A write function under test: the helper's, or a negative control's. */
type Writes = Pick<CursorTable, "write">;

const SELECT_VALUE = "SELECT value FROM wallet_scan.cursors WHERE key = $1";

/**
 * The check of "written only through the module's block write handle" (SH-1, DB-3, DB-6): what it found wrong, empty
 * when `writes` wrote `key` in the block's own transaction under the module's role. A block writes `key`; through the
 * same handle, the row must be there, and the audit trigger (`cursor-harness.ts`) must have recorded the module's role
 * and the block's transaction. A second block writes `key` again and then fails: afterwards the first value must stand.
 */
async function problemsOf(database: CursorDatabase, writes: Writes, key: string): Promise<string[]> {
  const problems: string[] = [];
  try {
    await database.block(async (w) => {
      await writes.write(w, key, { n: 1 });
      const [row] = await w.query(SELECT_VALUE, [key]);
      if (JSON.stringify(row?.value) !== '{"n":1}') problems.push("the write is not seen in the block's transaction");
      const [audit] = await w.query("SELECT role, xid FROM wallet_scan.audit WHERE key = $1", [key]);
      const [block] = await w.query("SELECT pg_current_xact_id()::text AS xid");
      if (audit?.role !== WALLET_SCAN_ROLE) problems.push(`written as ${String(audit?.role)}, not ${WALLET_SCAN_ROLE}`);
      if (audit === undefined || audit.xid !== block?.xid) {
        problems.push("written in another transaction than the block's");
      }
    });
  } catch (error) {
    problems.push(`the block failed: ${(error as Error).message}`);
    return problems;
  }
  const failed = await outcome(
    database.block(async (w) => {
      await writes.write(w, key, { n: 2 });
      throw new BlockFails("the block fails after the write");
    }),
  );
  if (!(failed instanceof BlockFails)) problems.push(`the failing block failed otherwise: ${String(failed)}`);
  const [after] = await database.db.read((read) => read.query(SELECT_VALUE, [key]));
  if (JSON.stringify(after?.value) !== '{"n":1}') problems.push("a write of a block that rolled back stayed");
  return problems;
}

const UPSERT_SQL =
  "INSERT INTO wallet_scan.cursors (key, value) VALUES ($1, ($2::jsonb) -> 'value') " +
  "ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value";

/**
 * Negative control (PostgreSQL): a helper writing on a connection of its own — the test's, as the login, committed at
 * once.
 */
function ownConnection(database: CursorDatabase): Writes {
  const literal = (text: string) => `'${text.replaceAll("'", "''")}'`;
  return {
    async write(_w, key, written) {
      await database.outside.exec(
        "INSERT INTO wallet_scan.cursors (key, value) " +
          `VALUES (${literal(key)}, ${literal(JSON.stringify(written))}::jsonb) ` +
          "ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value",
      );
    },
  };
}

/** Negative control (PGlite, which has one connection): a helper writing in a transaction of its own. */
function ownTransaction(database: CursorDatabase): Writes {
  return {
    async write(_w, key, written) {
      await database.db.transaction((tx) => tx.execute(UPSERT_SQL, [key, { value: written }]));
    },
  };
}
