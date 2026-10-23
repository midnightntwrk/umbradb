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
 * A54 (DT-2) and the table list of DT-3, on PostgreSQL 17 (tasks 1.2 and 1.3; the PGlite half runs in task 2.2).
 *
 * DT-2: rows are ordered by their primary-key columns in order, integers numerically, `boolean` with `false` first, and
 * `bytea`, `text`, `varchar(n)` and `uuid` by their bytes (`COLLATE "C"` for `text` and `varchar`; `varchar`, `uuid`
 * and `boolean` since owner decision Q58). DT-3: the public schemas, then each table, in name order (byte order).
 * Every expected order below is written out by hand from those rules (UTF-8 bytes of each text; unsigned bytes, a
 * prefix first; integers by value; `false` before `true`), never computed by the code under test. Rows are inserted
 * in shuffled order and every listing is repeated with page sizes 1, 2, 3 and the default, so a paging error cannot
 * hide behind one page.
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

  // Task 1.3 (owner decision Q58): varchar, uuid and boolean keys. Expected orders are written out by hand from DT-2:
  // varchar like text (UTF-8 bytes, COLLATE "C"), uuid by its 16 bytes, boolean false first.
  it("orders varchar keys by their bytes like text — \"B\" < \"a\" < \"b\" — whatever the column's collation", async () => {
    const values = shuffled(TEXT_KEYS)
      .map((k) => `(${sqlText(k)})`)
      .join(", ");
    const db = await freshDatabase(`
      CREATE SCHEMA m;
      CREATE TABLE m.varchar_default (k varchar(16) PRIMARY KEY);
      CREATE TABLE m.varchar_icu (k varchar COLLATE "und-x-icu" PRIMARY KEY);
      INSERT INTO m.varchar_default VALUES ${values};
      INSERT INTO m.varchar_icu VALUES ${values};
    `);
    const own = (await db.read((read) => read.query(`SELECT k FROM m.varchar_icu ORDER BY k`))).map((row) => row.k);
    expect(own.indexOf("a")).toBeLessThan(own.indexOf("B"));

    await expectKeyOrder(db, "m", "varchar_default", TEXT_KEYS);
    await expectKeyOrder(db, "m", "varchar_icu", TEXT_KEYS);
  }, 60_000);

  // By bytes, unsigned: 00… < 0f… < 7f… < 80… < ff…, and within one first byte by the next bytes.
  const UUID_KEYS = [
    "00000000-0000-0000-0000-000000000000",
    "00000000-0000-0000-0000-000000000001",
    "00000000-0000-0000-0000-0000000000ff",
    "00000000-0000-0000-0001-000000000000",
    "0fffffff-ffff-ffff-ffff-ffffffffffff",
    "7fffffff-ffff-ffff-ffff-ffffffffffff",
    "80000000-0000-0000-0000-000000000000",
    "a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11",
    "ffffffff-0000-0000-0000-000000000000",
    "ffffffff-ffff-ffff-ffff-ffffffffffff",
  ];

  it("orders uuid keys by their 16 bytes, unsigned, and reads them as lowercase text", async () => {
    // Inserted in upper case and without hyphens: PostgreSQL stores 16 bytes and prints them one way.
    const db = await freshDatabase(`
      CREATE SCHEMA m;
      CREATE TABLE m.u (k uuid PRIMARY KEY);
      INSERT INTO m.u VALUES ${shuffled(UUID_KEYS)
        .map((k, i) => `('${i % 2 === 0 ? k.toUpperCase() : k.replace(/-/g, "")}')`)
        .join(", ")};
    `);
    await expectKeyOrder(db, "m", "u", UUID_KEYS);
  }, 60_000);

  it("orders boolean keys false first", async () => {
    const db = await freshDatabase(`
      CREATE SCHEMA m;
      CREATE TABLE m.flag (k boolean PRIMARY KEY, v text);
      INSERT INTO m.flag VALUES (true, 'yes'), (false, 'no');
    `);
    const t = await table(db, "m", "flag");
    for (const pageSize of PAGE_SIZES) {
      expect(await listRows(db, t, pageSize), `page size ${pageSize ?? "default"}`).toEqual([
        [false, "no"],
        [true, "yes"],
      ]);
    }
  }, 60_000);

  it("DT-2's scenario: rows keyed by (id uuid, shielded boolean) by the uuid's bytes, then false before true", async () => {
    const expected: readonly (readonly [string, boolean])[] = [
      ["00000000-0000-0000-0000-0000000000ff", false],
      ["00000000-0000-0000-0000-0000000000ff", true],
      ["7fffffff-ffff-ffff-ffff-ffffffffffff", true],
      ["80000000-0000-0000-0000-000000000000", false],
      ["80000000-0000-0000-0000-000000000000", true],
      ["ffffffff-0000-0000-0000-000000000000", false],
    ];
    const db = await freshDatabase(`
      CREATE SCHEMA m;
      CREATE TABLE m.notes (id uuid, shielded boolean, PRIMARY KEY (id, shielded));
      INSERT INTO m.notes VALUES ${shuffled(expected)
        .map(([id, shielded]) => `('${id}', ${shielded})`)
        .join(", ")};
    `);
    const t = await table(db, "m", "notes");
    for (const pageSize of PAGE_SIZES) {
      expect(await listRows(db, t, pageSize), `page size ${pageSize ?? "default"}`).toEqual(expected);
    }
  }, 60_000);

  it("orders a composite key of varchar, boolean and uuid in the key's declared order", async () => {
    // Columns (flag, id, name, v); key (name, flag, id): name by bytes, then false first, then the uuid's bytes.
    const expected: readonly (readonly [boolean, string, string, string])[] = [
      [false, "00000000-0000-0000-0000-000000000002", "B", "r1"],
      [true, "00000000-0000-0000-0000-000000000001", "B", "r2"],
      [false, "00000000-0000-0000-0000-000000000001", "a", "r3"],
      [false, "ffffffff-ffff-ffff-ffff-ffffffffffff", "a", "r4"],
      [true, "00000000-0000-0000-0000-000000000000", "a", "r5"],
      [true, "80000000-0000-0000-0000-000000000000", "a", "r6"],
      [false, "00000000-0000-0000-0000-000000000000", "é", "r7"],
    ];
    const db = await freshDatabase(`
      CREATE SCHEMA m;
      CREATE TABLE m.c (flag boolean, id uuid, name varchar(8) COLLATE "und-x-icu", v text, PRIMARY KEY (name, flag, id));
      INSERT INTO m.c VALUES ${shuffled(expected)
        .map(([flag, id, name, v]) => `(${flag}, '${id}', ${sqlText(name)}, ${sqlText(v)})`)
        .join(", ")};
    `);
    const t = await table(db, "m", "c");
    expect(t.key.map((i) => t.columns[i]?.name)).toEqual(["name", "flag", "id"]);
    for (const pageSize of PAGE_SIZES) {
      expect(await listRows(db, t, pageSize), `page size ${pageSize ?? "default"}`).toEqual(expected);
    }
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

  // A sequence is no table; in a public schema it refuses the list (owner decision Q61, `column-refusals.test.ts`), so
  // the one here is in the reserved `public` schema.
  it("leaves out PostgreSQL's own schemas, the reserved public schema, partitions, views and sequences", async () => {
    const db = await freshDatabase(`
      CREATE SCHEMA m;
      CREATE TABLE public.extension_table (k integer PRIMARY KEY);
      CREATE TABLE m.p (k bigint PRIMARY KEY) PARTITION BY RANGE (k);
      CREATE TABLE m.p_all PARTITION OF m.p FOR VALUES FROM (MINVALUE) TO (MAXVALUE);
      CREATE TABLE m.plain (k bigint PRIMARY KEY);
      CREATE VIEW m.v AS SELECT 1 AS x;
      CREATE MATERIALIZED VIEW m.mv AS SELECT 1 AS x;
      CREATE SEQUENCE public.q;
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
        s jsonb, r bigint[], q text[][], p varchar(12), o uuid, n varchar(3)[], PRIMARY KEY (u, x, z)
      );
      ALTER TABLE m.t DROP COLUMN gone;
    `);
    const [t] = await db.read((read) => publicTables(read));
    // The declared type (format_type with the type modifier) is kept for refusal messages (task 1.3).
    expect(t).toEqual({
      schema: "m",
      name: "t",
      partitioned: false,
      columns: [
        { name: "z", type: "smallint", declaredType: "smallint" },
        { name: "y", type: "integer", declaredType: "integer" },
        { name: "x", type: "bigint", declaredType: "bigint" },
        { name: "w", type: "numeric", declaredType: "numeric(38,0)" },
        { name: "v", type: "bytea", declaredType: "bytea" },
        { name: "u", type: "text", declaredType: "text" },
        { name: 'we"ird col', type: "boolean", declaredType: "boolean" },
        { name: "s", type: "jsonb", declaredType: "jsonb" },
        { name: "r", type: "bigint[]", declaredType: "bigint[]" },
        { name: "q", type: "text[]", declaredType: "text[]" },
        { name: "p", type: "character varying", declaredType: "character varying(12)" },
        { name: "o", type: "uuid", declaredType: "uuid" },
        { name: "n", type: "character varying[]", declaredType: "character varying(3)[]" },
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

  // `boolean` keys are allowed since owner decision Q58 (DT-2); the refusals' messages are `column-refusals.test.ts`'s.
  it("refuses a primary-key column whose type DT-2 does not order", async () => {
    for (const type of ["numeric", "jsonb", "bigint[]"]) {
      await expectRefusal(
        `CREATE SCHEMA m; CREATE TABLE m.t (id ${type} PRIMARY KEY, v text);`,
        "unsupported-key-type",
        { schema: "m", table: "t", column: "id" },
      );
    }
  }, 60_000);

  // `varchar` and `uuid` are DT-1 types since owner decision Q58; floating-point columns are refused with
  // `non-deterministic-column`, DT-6's code for them (`design.md` §4's column-type table).
  it("refuses a column whose type DT-1 does not encode", async () => {
    for (const type of ["timestamp with time zone", "json", "character(4)", "numeric(38,2)"]) {
      await expectRefusal(
        `CREATE SCHEMA m; CREATE TABLE m.t (id bigint PRIMARY KEY, v ${type});`,
        "unsupported-column-type",
        { schema: "m", table: "t", column: "v" },
      );
    }
    for (const type of ["real", "double precision"]) {
      await expectRefusal(
        `CREATE SCHEMA m; CREATE TABLE m.t (id bigint PRIMARY KEY, v ${type});`,
        "non-deterministic-column",
        { schema: "m", table: "t", column: "v" },
      );
    }
  }, 60_000);

  // Owner decision Q61: a sequence or an unlogged table in a public schema refuses the list, and with it the hash.
  it("refuses a public schema holding a sequence or an unlogged table", async () => {
    const sequence = await freshDatabase(`
      CREATE SCHEMA m; CREATE TABLE m.t (k integer PRIMARY KEY); CREATE SEQUENCE m.q;
    `);
    const error = await failure(() => sequence.read((read) => publicTables(read)));
    expect([error.reason, error.schema, error.table, error.sequence, error.column]).toEqual([
      "non-deterministic-table",
      "m",
      null,
      "q",
      null,
    ]);
    await expectRefusal(
      `CREATE SCHEMA m; CREATE TABLE m.ok (k integer PRIMARY KEY);
       CREATE UNLOGGED TABLE m.scratch (k integer PRIMARY KEY);`,
      "non-deterministic-table",
      { schema: "m", table: "scratch", column: null },
    );
  }, 60_000);

  it("accepts varchar, uuid and boolean columns, and as keys", async () => {
    const db = await freshDatabase(`
      CREATE SCHEMA m;
      CREATE TABLE m.t (a varchar(4), b uuid, c boolean, d varchar(4)[], e uuid[], PRIMARY KEY (a, b, c));
    `);
    const [t] = await db.read((read) => publicTables(read));
    expect(t?.key).toEqual([0, 1, 2]);
  }, 60_000);
});
