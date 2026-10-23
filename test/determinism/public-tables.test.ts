import { afterAll, beforeAll, describe, expect, it } from "vitest";
import {
  countRows,
  PublicContentsError,
  type PublicContentsFailure,
  type PublicTable,
  publicTables,
  rowsInKeyOrder,
} from "../../src/determinism/public-tables.js";
import { startPostgres, type TestDatabase, type TestServer } from "./postgres-database.js";

/**
 * A54 (DT-2) and the table list of DT-3, on PostgreSQL 17 (task 1.2; the PGlite half runs in task 2.2).
 *
 * DT-2: rows are ordered by their primary-key columns in order, integers numerically, `bytea` and `text` by their
 * bytes (`COLLATE "C"`). DT-3: the public schemas, then each table, in name order (byte order). Every expected order
 * below is written out by hand from those rules (UTF-8 bytes of each text; unsigned bytes, a prefix first; integers by
 * value), never computed by the code under test. Rows are inserted in shuffled order and every listing is repeated
 * with page sizes 1, 2, 3 and the default, so a paging error cannot hide behind one page.
 */

const PAGE_SIZES = [1, 2, 3, undefined] as const;

let server: TestServer;

beforeAll(async () => {
  server = await startPostgres();
}, 120_000);

afterAll(async () => {
  await server?.stop();
}, 60_000);

async function freshDatabase(setup: string): Promise<TestDatabase> {
  const db = await server.create();
  await db.exec(setup);
  return db;
}

async function table(db: TestDatabase, schema: string, name: string): Promise<PublicTable> {
  const found = (await db.read((read) => publicTables(read))).find((t) => t.schema === schema && t.name === name);
  if (found === undefined) throw new Error(`no public table ${schema}.${name}`);
  return found;
}

async function listRows(db: TestDatabase, t: PublicTable, pageSize?: number): Promise<unknown[][]> {
  return db.read(async (read) => {
    const rows: unknown[][] = [];
    for await (const row of rowsInKeyOrder(read, t, pageSize === undefined ? {} : { pageSize })) rows.push(row);
    return rows;
  });
}

/** The first column of each row, in every page size. */
async function expectKeyOrder(db: TestDatabase, schema: string, name: string, expected: readonly unknown[]) {
  const t = await table(db, schema, name);
  for (const pageSize of PAGE_SIZES) {
    const rows = await listRows(db, t, pageSize);
    expect(rows.map((row) => row[0]), `page size ${pageSize ?? "default"}`).toEqual(expected);
  }
}

const hex = (bytes: unknown): string => Buffer.from(bytes as Uint8Array).toString("hex");

async function failure(run: () => Promise<unknown>): Promise<PublicContentsError> {
  try {
    await run();
  } catch (error) {
    if (error instanceof PublicContentsError) return error;
    throw error;
  }
  throw new Error("expected a PublicContentsError, but the read succeeded");
}

function shuffled<T>(values: readonly T[]): T[] {
  // A fixed permutation (reverse, then interleave halves), so the insertion order differs from the expected order.
  const reversed = [...values].reverse();
  const half = Math.ceil(reversed.length / 2);
  const out: T[] = [];
  for (let i = 0; i < half; i++) {
    out.push(reversed[i] as T);
    if (i + half < reversed.length) out.push(reversed[i + half] as T);
  }
  return out;
}

const sqlText = (value: string): string => `'${value.replace(/'/g, "''")}'`;

describe("A54 (DT-2) — rows in primary-key order on PostgreSQL 17", () => {
  // Expected order by UTF-8 bytes: "" | 42 "B" | 5a "Z" | 61 "a" | 61 20 62 "a b" | 61 61 "aa" | 62 "b" |
  // c3 a9 "é" | ef bd a1 U+FF61 | f0 9f 98 80 U+1F600. JavaScript's UTF-16 comparison puts U+1F600 (d83d de00)
  // before U+FF61, and a locale puts "a" before "B": neither is DT-2's order.
  const TEXT_KEYS = ["", "B", "Z", "a", "a b", "aa", "b", "é", "\u{FF61}", "\u{1F600}"];

  it("orders text keys by their bytes — \"B\" < \"a\" < \"b\" — whatever the column's collation", async () => {
    const values = shuffled(TEXT_KEYS)
      .map((k) => `(${sqlText(k)})`)
      .join(", ");
    const db = await freshDatabase(`
      CREATE SCHEMA m;
      CREATE TABLE m.text_default (k text PRIMARY KEY);
      CREATE TABLE m.text_icu (k text COLLATE "und-x-icu" PRIMARY KEY);
      INSERT INTO m.text_default VALUES ${values};
      INSERT INTO m.text_icu VALUES ${values};
    `);
    // The control that makes this test bite: the column's own collation orders these keys differently.
    const own = (await db.read((read) => read.query(`SELECT k FROM m.text_icu ORDER BY k`))).map((row) => row.k);
    expect(own).not.toEqual(TEXT_KEYS);
    expect(own.indexOf("a")).toBeLessThan(own.indexOf("B"));

    await expectKeyOrder(db, "m", "text_default", TEXT_KEYS);
    await expectKeyOrder(db, "m", "text_icu", TEXT_KEYS);
  }, 60_000);

  it("orders bytea keys by their bytes, unsigned, a prefix before its extensions", async () => {
    const expected = ["", "00", "0000", "01", "0100", "7f", "80", "ff", "ff00"];
    const db = await freshDatabase(`
      CREATE SCHEMA m;
      CREATE TABLE m.b (k bytea PRIMARY KEY);
      INSERT INTO m.b VALUES ${shuffled(expected)
        .map((k) => `('\\x${k}')`)
        .join(", ")};
    `);
    const t = await table(db, "m", "b");
    for (const pageSize of PAGE_SIZES) {
      const rows = await listRows(db, t, pageSize);
      expect(rows.map((row) => hex(row[0])), `page size ${pageSize ?? "default"}`).toEqual(expected);
      for (const row of rows) expect(row[0]).toBeInstanceOf(Uint8Array);
    }
  }, 60_000);

  it("orders integer keys numerically, negatives included, for bigint, integer and smallint", async () => {
    const bigints = [
      -9223372036854775808n,
      -9007199254740993n,
      -10n,
      -2n,
      -1n,
      0n,
      1n,
      2n,
      10n,
      9007199254740993n,
      9223372036854775807n,
    ];
    const integers = [-2147483648, -10, -2, -1, 0, 1, 2, 10, 2147483647];
    const smallints = [-32768, -10, -1, 0, 9, 10, 32767];
    const db = await freshDatabase(`
      CREATE SCHEMA m;
      CREATE TABLE m.i8 (k bigint PRIMARY KEY);
      CREATE TABLE m.i4 (k integer PRIMARY KEY);
      CREATE TABLE m.i2 (k smallint PRIMARY KEY);
      INSERT INTO m.i8 VALUES ${shuffled(bigints).map((k) => `(${k})`).join(", ")};
      INSERT INTO m.i4 VALUES ${shuffled(integers).map((k) => `(${k})`).join(", ")};
      INSERT INTO m.i2 VALUES ${shuffled(smallints).map((k) => `(${k})`).join(", ")};
    `);
    await expectKeyOrder(db, "m", "i8", bigints);
    await expectKeyOrder(db, "m", "i4", integers);
    await expectKeyOrder(db, "m", "i2", smallints);
  }, 60_000);

  it("orders composite keys column by column, in the key's declared order rather than the table's", async () => {
    // Columns (t, h, n, v); key (n, t, h): n numerically, then t by bytes, then h by bytes.
    const expected: readonly (readonly [string, string, bigint, string | null])[] = [
      ["b", "01", -5n, "r1"],
      ["B", "ff", -1n, "r2"],
      ["a", "", -1n, "r3"],
      ["a", "00", -1n, null],
      ["a", "0000", -1n, "r5"],
      ["b", "00", -1n, "r6"],
      ["B", "", 2n, "r7"],
      ["a", "ff", 10n, "r8"],
    ];
    const db = await freshDatabase(`
      CREATE SCHEMA m;
      CREATE TABLE m.c (t text, h bytea, n bigint, v text, PRIMARY KEY (n, t, h));
      INSERT INTO m.c VALUES ${shuffled(expected)
        .map(([t, h, n, v]) => `(${sqlText(t)}, '\\x${h}', ${n}, ${v === null ? "NULL" : sqlText(v)})`)
        .join(", ")};
    `);
    const t = await table(db, "m", "c");
    expect(t.key.map((i) => t.columns[i]?.name)).toEqual(["n", "t", "h"]);
    for (const pageSize of PAGE_SIZES) {
      const rows = await listRows(db, t, pageSize);
      expect(
        rows.map(([text, bytes, n, v]) => [text, hex(bytes), n, v]),
        `page size ${pageSize ?? "default"}`,
      ).toEqual(expected);
    }
  }, 60_000);

  it("lists a partitioned table's rows from every partition in one key order", async () => {
    const db = await freshDatabase(`
      CREATE SCHEMA m;
      CREATE TABLE m.p (height bigint, idx integer, PRIMARY KEY (height, idx)) PARTITION BY RANGE (height);
      CREATE TABLE m.p_hi PARTITION OF m.p FOR VALUES FROM (100) TO (MAXVALUE);
      CREATE TABLE m.p_lo PARTITION OF m.p FOR VALUES FROM (MINVALUE) TO (100);
      INSERT INTO m.p VALUES (150, 1), (-1, 0), (99, 2), (100, 0), (5, 7), (99, 1);
    `);
    const t = await table(db, "m", "p");
    expect(t.partitioned).toBe(true);
    for (const pageSize of PAGE_SIZES) {
      expect(await listRows(db, t, pageSize)).toEqual([
        [-1n, 0],
        [5n, 7],
        [99n, 1],
        [99n, 2],
        [100n, 0],
        [150n, 1],
      ]);
    }
    expect(await db.read((read) => countRows(read, t))).toBe(6);
  }, 60_000);

  it("lists only a table's own rows when another table inherits from it", async () => {
    const db = await freshDatabase(`
      CREATE SCHEMA m;
      CREATE TABLE m.parent (k integer PRIMARY KEY);
      CREATE TABLE m.child (PRIMARY KEY (k)) INHERITS (m.parent);
      INSERT INTO m.parent VALUES (2), (1);
      INSERT INTO m.child VALUES (3), (0);
    `);
    const parent = await table(db, "m", "parent");
    const child = await table(db, "m", "child");
    expect(await listRows(db, parent)).toEqual([[1], [2]]);
    expect(await listRows(db, child)).toEqual([[0], [3]]);
    expect(await db.read((read) => countRows(read, parent))).toBe(2);
  }, 60_000);

  it("refuses a page size that is not a positive integer", async () => {
    const db = await freshDatabase(`CREATE SCHEMA m; CREATE TABLE m.t (k integer PRIMARY KEY);`);
    const t = await table(db, "m", "t");
    for (const pageSize of [0, -1, 1.5, Number.NaN]) {
      await expect(listRows(db, t, pageSize)).rejects.toThrow(RangeError);
    }
  }, 60_000);
});

describe("DT-3's table list — public schemas and tables in name order, read from the catalog", () => {
  it("lists schemas and tables by the bytes of their names, not by creation order or locale", async () => {
    // Created in the reverse of the expected order. By bytes: "m0" (6d 30) < "m_x" (6d 5f 78) — a locale puts "_"
    // before digits — and "B" (42) < "a" (61) < "b" (62); U+FF61 (ef bd a1) < U+1F600 (f0 9f 98 80), which
    // JavaScript's UTF-16 comparison reverses.
    const db = await freshDatabase(`
      CREATE SCHEMA m_x;
      CREATE SCHEMA m0;
      CREATE TABLE m_x.t (k integer PRIMARY KEY);
      CREATE TABLE m_x.s (k integer PRIMARY KEY);
      CREATE TABLE m0."\u{1F600}" (k integer PRIMARY KEY);
      CREATE TABLE m0."\u{FF61}" (k integer PRIMARY KEY);
      CREATE TABLE m0.b (k integer PRIMARY KEY);
      CREATE TABLE m0.a (k integer PRIMARY KEY);
      CREATE TABLE m0."B" (k integer PRIMARY KEY);
    `);
    const tables = await db.read((read) => publicTables(read));
    expect(tables.map((t) => [t.schema, t.name])).toEqual([
      ["m0", "B"],
      ["m0", "a"],
      ["m0", "b"],
      ["m0", "\u{FF61}"],
      ["m0", "\u{1F600}"],
      ["m_x", "s"],
      ["m_x", "t"],
    ]);
  }, 60_000);

  it("leaves out PostgreSQL's own schemas, the reserved public schema, partitions, views and sequences", async () => {
    const db = await freshDatabase(`
      CREATE SCHEMA m;
      CREATE TABLE public.extension_table (k integer PRIMARY KEY);
      CREATE TABLE m.p (k bigint PRIMARY KEY) PARTITION BY RANGE (k);
      CREATE TABLE m.p_all PARTITION OF m.p FOR VALUES FROM (MINVALUE) TO (MAXVALUE);
      CREATE TABLE m.plain (k bigint PRIMARY KEY);
      CREATE VIEW m.v AS SELECT 1 AS x;
      CREATE MATERIALIZED VIEW m.mv AS SELECT 1 AS x;
      CREATE SEQUENCE m.q;
      CREATE TYPE m.pair AS (a integer, b integer);
    `);
    const tables = await db.read((read) => publicTables(read));
    expect(tables.map((t) => [t.schema, t.name, t.partitioned])).toEqual([
      ["m", "p", true],
      ["m", "plain", false],
    ]);
  }, 60_000);

  it("reads columns in column order with format_type's names, skips dropped ones, keeps the key's order", async () => {
    const db = await freshDatabase(`
      CREATE SCHEMA m;
      CREATE TABLE m.t (
        z smallint, gone integer, y integer, x bigint, w numeric(38, 0), v bytea, u text, "we""ird col" boolean,
        s jsonb, r bigint[], q text[][], PRIMARY KEY (u, x, z)
      );
      ALTER TABLE m.t DROP COLUMN gone;
    `);
    const [t] = await db.read((read) => publicTables(read));
    expect(t).toEqual({
      schema: "m",
      name: "t",
      partitioned: false,
      columns: [
        { name: "z", type: "smallint" },
        { name: "y", type: "integer" },
        { name: "x", type: "bigint" },
        { name: "w", type: "numeric" },
        { name: "v", type: "bytea" },
        { name: "u", type: "text" },
        { name: 'we"ird col', type: "boolean" },
        { name: "s", type: "jsonb" },
        { name: "r", type: "bigint[]" },
        { name: "q", type: "text[]" },
      ],
      key: [5, 2, 0],
    });
  }, 60_000);

  it("gives the same list whatever order the schemas, tables and keys were created in", async () => {
    const first = await freshDatabase(`
      CREATE SCHEMA a; CREATE SCHEMA b;
      CREATE TABLE a.t1 (k bytea PRIMARY KEY, v text);
      CREATE TABLE b.t2 (n bigint, m text, PRIMARY KEY (m, n));
    `);
    const second = await freshDatabase(`
      CREATE SCHEMA b; CREATE SCHEMA a;
      CREATE TABLE b.t2 (n bigint, m text);
      ALTER TABLE b.t2 ADD PRIMARY KEY (m, n);
      CREATE TABLE a.t1 (k bytea, v text);
      CREATE UNIQUE INDEX t1_k ON a.t1 (k);
      ALTER TABLE a.t1 ADD PRIMARY KEY USING INDEX t1_k;
    `);
    const listed = await first.read((read) => publicTables(read));
    expect(await second.read((read) => publicTables(read))).toEqual(listed);
    expect(listed.map((t) => [t.schema, t.name, t.key])).toEqual([
      ["a", "t1", [0]],
      ["b", "t2", [1, 0]],
    ]);
  }, 60_000);

  async function expectRefusal(
    setup: string,
    reason: PublicContentsFailure,
    where: { schema: string; table: string; column: string | null },
  ) {
    const db = await freshDatabase(setup);
    const error = await failure(() => db.read((read) => publicTables(read)));
    expect(error.reason).toBe(reason);
    expect({ schema: error.schema, table: error.table, column: error.column }).toEqual(where);
    expect(error.message).toContain(reason);
  }

  it("refuses a public table without a primary key, which DT-2 cannot order", async () => {
    await expectRefusal(
      `CREATE SCHEMA m; CREATE TABLE m.ok (k integer PRIMARY KEY); CREATE TABLE m.loose (k integer UNIQUE);`,
      "no-primary-key",
      { schema: "m", table: "loose", column: null },
    );
    await expectRefusal(`CREATE SCHEMA m; CREATE TABLE m.empty ();`, "no-primary-key", {
      schema: "m",
      table: "empty",
      column: null,
    });
  }, 60_000);

  it("refuses a primary-key column whose type DT-2 does not order", async () => {
    for (const type of ["numeric", "boolean", "jsonb", "bigint[]"]) {
      await expectRefusal(
        `CREATE SCHEMA m; CREATE TABLE m.t (id ${type} PRIMARY KEY, v text);`,
        "unsupported-key-type",
        { schema: "m", table: "t", column: "id" },
      );
    }
  }, 60_000);

  it("refuses a column whose type DT-1 does not encode", async () => {
    for (const type of ["character varying", "timestamp with time zone", "real", "uuid", "json"]) {
      await expectRefusal(
        `CREATE SCHEMA m; CREATE TABLE m.t (id bigint PRIMARY KEY, v ${type});`,
        "unsupported-column-type",
        { schema: "m", table: "t", column: "v" },
      );
    }
  }, 60_000);
});
