import { createHash } from "node:crypto";
import { afterAll, beforeAll, describe, expect, expectTypeOf, it } from "vitest";
import { CanonicalEncodingError } from "../../src/determinism/cbor.js";
import { contentsHash } from "../../src/determinism/contents-hash.js";
import { type ConsistentRead, PublicContentsError } from "../../src/determinism/public-tables.js";
import { startPostgres, type TestDatabase, type TestServer } from "./postgres-database.js";

/**
 * A55 (DT-3) on PostgreSQL 17 (task 1.2; the PGlite half and the cross-backend comparison run in task 2.2).
 *
 * DT-3: the contents hash is SHA-256 of one canonical CBOR array holding, for each public schema and then each table
 * in name order (byte order), the array `[schema, table, [column names], [rows in primary-key order]]`.
 *
 * The expected hash of the fixed database below is not computed by the code under test: its CBOR bytes are written
 * out by hand from DT-3's structure and the RFC 8949 encoding rules (heads per §3, shortest form and map-key order per
 * §4.2.1), and only SHA-256 is computed here. The other tests are the negative controls: each changes exactly one
 * thing a wrong hash could ignore — a column, a row, which table or schema a row is in, a column's name — and shows
 * that the hash changes, then changes it back and shows that the hash returns.
 */

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

const hex = (bytes: Uint8Array): string => Buffer.from(bytes).toString("hex");

async function hashOf(db: TestDatabase, pageSize?: number): Promise<string> {
  return hex(await db.read((read) => contentsHash(read, pageSize === undefined ? {} : { pageSize })));
}

async function failure(run: () => Promise<unknown>): Promise<PublicContentsError> {
  try {
    await run();
  } catch (error) {
    if (error instanceof PublicContentsError) return error;
    throw error;
  }
  throw new Error("expected a PublicContentsError, but the hash succeeded");
}

describe("A55 (DT-3) — the contents hash of a fixed database equals a hash computed by hand", () => {
  // Created so that creation (OID) order differs from name order for the schemas and for the tables of each schema,
  // with a dropped column, a partitioned table, and objects that are not public tables (a table in the reserved
  // `public` schema, a view, a materialized view, and a sequence in `public`: a sequence in a public schema refuses the
  // hash, owner decision Q61, `column-refusals.test.ts`).
  const FIXED_DATABASE = `
    CREATE SCHEMA m_x;
    CREATE SCHEMA m0;
    CREATE TABLE m_x.t (k bigint PRIMARY KEY, "Val""ue" text) PARTITION BY RANGE (k);
    CREATE TABLE m_x.t_pos PARTITION OF m_x.t FOR VALUES FROM (0) TO (MAXVALUE);
    CREATE TABLE m_x.t_neg PARTITION OF m_x.t FOR VALUES FROM (MINVALUE) TO (0);
    CREATE TABLE m_x.s (k text PRIMARY KEY);
    CREATE TABLE m0.b (id smallint PRIMARY KEY, data jsonb, amount numeric, flag boolean);
    CREATE TABLE m0."B" (h bytea, junk integer, n integer, PRIMARY KEY (n, h));
    ALTER TABLE m0."B" DROP COLUMN junk;
    CREATE TABLE public.extension_table (x integer PRIMARY KEY);
    CREATE VIEW m0.v AS SELECT 1 AS x;
    CREATE MATERIALIZED VIEW m0.mv AS SELECT 1 AS x;
    CREATE SEQUENCE public.q;
    INSERT INTO public.extension_table VALUES (1);
    INSERT INTO m_x.t VALUES (2, 'b'), (-10, 'a'), (10, 'B'), (-3, 'ü'), (9007199254740993, NULL);
    INSERT INTO m_x.s VALUES ('b'), ('B'), ('a');
    INSERT INTO m0.b VALUES (2, '{"b": 1, "a": [true, null]}', -12, false),
                            (1, NULL, 340282366920938463463374607431768211456, true);
    INSERT INTO m0."B" VALUES ('\\x01', 1), ('\\x', 1), ('\\xff', -1);
  `;

  // The canonical CBOR of DT-3's array for FIXED_DATABASE, item by item. Schemas by bytes: "m0" (6d 30) before "m_x"
  // (6d 5f 78); tables: "B" (42) before "b" (62), "s" before "t"; the partitions, the view, the materialized view and
  // `public` (its table and its sequence) are not public tables. Rows in primary-key order; values per DT-1.
  const EXPECTED_CBOR: readonly (readonly [string, string])[] = [
    ["array(4): the four public tables", "84"],

    ["array(4): m0.\"B\"", "84"],
    ['text(2) "m0"', "62 6d 30"],
    ['text(1) "B"', "61 42"],
    ['["h", "n"]: the dropped column is not a column', "82 61 68 61 6e"],
    ["array(3): rows by the key (n, h), not by column order", "83"],
    ["[h'ff', -1]", "82 41 ff 20"],
    ["[h'', 1]", "82 40 01"],
    ["[h'01', 1]", "82 41 01 01"],

    ["array(4): m0.b", "84"],
    ['text(2) "m0"', "62 6d 30"],
    ['text(1) "b"', "61 62"],
    ['["id", "data", "amount", "flag"]', "84 62 69 64 64 64 61 74 61 66 61 6d 6f 75 6e 74 64 66 6c 61 67"],
    ["array(2): rows by id", "82"],
    [
      '[1, null, "340282366920938463463374607431768211456" (2^128, numeric as text(39)), true]',
      "84 01 f6 78 27 333430 323832 333636 393230 393338 343633 343633 333734 363037 343331 373638 323131 343536 f5",
    ],
    [
      '[2, {"a": [true, null], "b": 1} (keys in encoded order), "-12", false]',
      "84 02 a2 61 61 82 f5 f6 61 62 01 63 2d 31 32 f4",
    ],

    ["array(4): m_x.s", "84"],
    ['text(3) "m_x"', "63 6d 5f 78"],
    ['text(1) "s"', "61 73"],
    ['["k"]', "81 61 6b"],
    ['[["B"], ["a"], ["b"]]: text keys by their bytes', "83 81 61 42 81 61 61 81 61 62"],

    ["array(4): m_x.t (partitioned; its partitions are not tables of their own)", "84"],
    ['text(3) "m_x"', "63 6d 5f 78"],
    ['text(1) "t"', "61 74"],
    ['["k", "Val\\"ue"]', "82 61 6b 66 56 61 6c 22 75 65"],
    ["array(5): rows by k, numerically", "85"],
    ['[-10, "a"]', "82 29 61 61"],
    ['[-3, "ü"] (UTF-8 c3 bc)', "82 22 62 c3 bc"],
    ['[2, "b"]', "82 02 61 62"],
    ['[10, "B"]', "82 0a 61 42"],
    ["[9007199254740993 (2^53 + 1, eight-byte argument), null]", "82 1b 00 20 00 00 00 00 00 01 f6"],
  ];

  const expectedHash = createHash("sha256")
    .update(Buffer.from(EXPECTED_CBOR.map(([, bytes]) => bytes.replace(/ /g, "")).join(""), "hex"))
    .digest("hex");

  it("equals SHA-256 of DT-3's array written out by hand, at every page size", async () => {
    const db = await freshDatabase(FIXED_DATABASE);
    const hash = await db.read((read) => contentsHash(read));
    expect(hash).toBeInstanceOf(Uint8Array);
    expect(hash.length).toBe(32);
    expect(hex(hash)).toBe(expectedHash);
    for (const pageSize of [1, 2, 3, 4, 5]) {
      expect(await hashOf(db, pageSize), `page size ${pageSize}`).toBe(expectedHash);
    }
  }, 60_000);

  // Task 1.3 (owner decision Q58): a `uuid` is the byte string of its 16 bytes and a `varchar` a text string (DT-1);
  // rows are keyed by the uuid's bytes, then `false` before `true` (DT-2). The uuids are inserted in upper case and
  // without hyphens, which PostgreSQL stores as the same 16 bytes. No array holds a NULL element: `postgres` 3.4.9
  // reads one as the text "NULL" (docs/issues/00006).
  it("covers varchar values and uuid and boolean keys, written out by hand", async () => {
    const db = await freshDatabase(`
      CREATE SCHEMA k;
      CREATE TABLE k.notes (id uuid, shielded boolean, label varchar(8), tags varchar(4)[], PRIMARY KEY (id, shielded));
      INSERT INTO k.notes VALUES
        ('FFFFFFFF-0000-0000-0000-000000000001', false, 'z', NULL),
        ('00000000-0000-0000-0000-0000000000ff', true, NULL, '{}'),
        ('000000000000000000000000000000FF', false, 'Ab', '{x,y}');
    `);
    const cbor: readonly (readonly [string, string])[] = [
      ["array(1): one public table", "81"],
      ["array(4): k.notes", "84"],
      ['text(1) "k"', "61 6b"],
      ['text(5) "notes"', "65 6e6f746573"],
      ['["id", "shielded", "label", "tags"]', "84 62 6964 68 736869656c646564 65 6c6162656c 64 74616773"],
      ["array(3): rows by (id, shielded)", "83"],
      [
        "[h'00…00ff' (bytes(16)), false, \"Ab\", [\"x\", \"y\"]]",
        "84 50 000000000000000000000000000000ff f4 62 4162 82 6178 6179",
      ],
      ["[h'00…00ff', true, null, []]", "84 50 000000000000000000000000000000ff f5 f6 80"],
      ["[h'ffffffff…01', false, \"z\", null]", "84 50 ffffffff000000000000000000000001 f4 61 7a f6"],
    ];
    const expected = createHash("sha256")
      .update(Buffer.from(cbor.map(([, bytes]) => bytes.replace(/ /g, "")).join(""), "hex"))
      .digest("hex");
    for (const pageSize of [undefined, 1, 2]) {
      expect(await hashOf(db, pageSize), `page size ${pageSize ?? "default"}`).toBe(expected);
    }
  }, 60_000);
});

describe("A55 (DT-3) — the same rows give the same contents hash", () => {
  const BLOCKS = 2_500; // more than two default pages
  const balances = (order: "asc" | "desc") => `
    INSERT INTO tokens.balances
    SELECT owner, token, amount, meta FROM (VALUES
      ('\\x00'::bytea, 'NIGHT', 0::numeric, '{"n": 9223372036854775807, "tags": ["b", "a"]}'::jsonb),
      ('\\x00'::bytea, 'night', -1, NULL),
      ('\\x0001'::bytea, 'DUST', 18446744073709551616, '{"z": {"y": [1, -2]}, "a": null}'),
      ('\\xff'::bytea, 'a', 7, '[]'),
      ('\\x'::bytea, 'Z', 123456789012345678901234567890, '{}')
    ) AS v(owner, token, amount, meta)
    ORDER BY owner ${order}, token ${order};
  `;
  const FIRST = `
    CREATE SCHEMA chain;
    CREATE SCHEMA tokens;
    CREATE TABLE chain.blocks (height bigint PRIMARY KEY, hash bytea NOT NULL, parent_hash bytea NOT NULL)
      PARTITION BY RANGE (height);
    CREATE TABLE chain.blocks_0 PARTITION OF chain.blocks FOR VALUES FROM (0) TO (1000);
    CREATE TABLE chain.blocks_1 PARTITION OF chain.blocks FOR VALUES FROM (1000) TO (MAXVALUE);
    CREATE TABLE tokens.balances (owner bytea, token text, amount numeric NOT NULL, meta jsonb,
      PRIMARY KEY (owner, token));
    INSERT INTO chain.blocks
      SELECT h, sha256(int8send(h)), sha256(int8send(h - 1)) FROM generate_series(0, ${BLOCKS - 1}) AS h;
    ${balances("asc")}
  `;
  // The same rows, with every incidental difference a database may have: schemas and tables created in another
  // order, other partition bounds, rows inserted in reverse and rewritten afterwards, a dropped column, an extra
  // index, an empty schema, and objects that are not public tables (a view; a sequence and a table in `public`).
  const SECOND = `
    CREATE SCHEMA tokens;
    CREATE SCHEMA empty_one;
    CREATE TABLE tokens.balances (owner bytea, token text, scratch text, amount numeric NOT NULL, meta jsonb,
      PRIMARY KEY (owner, token));
    ALTER TABLE tokens.balances DROP COLUMN scratch;
    CREATE INDEX balances_by_token ON tokens.balances (token);
    CREATE SCHEMA chain;
    CREATE TABLE chain.blocks (height bigint PRIMARY KEY, hash bytea NOT NULL, parent_hash bytea NOT NULL)
      PARTITION BY RANGE (height);
    CREATE TABLE chain.blocks_c PARTITION OF chain.blocks FOR VALUES FROM (1500) TO (MAXVALUE);
    CREATE TABLE chain.blocks_b PARTITION OF chain.blocks FOR VALUES FROM (500) TO (1500);
    CREATE TABLE chain.blocks_a PARTITION OF chain.blocks FOR VALUES FROM (MINVALUE) TO (500);
    INSERT INTO chain.blocks
      SELECT h, '\\x00', '\\x00' FROM generate_series(${BLOCKS - 1}, 0, -1) AS h;
    UPDATE chain.blocks SET hash = sha256(int8send(height)), parent_hash = sha256(int8send(height - 1));
    ${balances("desc")}
    CREATE VIEW chain.recent AS SELECT * FROM chain.blocks WHERE height > 100;
    CREATE SEQUENCE public.counter;
    CREATE TABLE public.unrelated (k integer PRIMARY KEY);
    INSERT INTO public.unrelated VALUES (1), (2);
  `;
  // Not partitioned at all: DT-3 holds names, columns and rows, not storage layout.
  const THIRD = `
    CREATE SCHEMA chain;
    CREATE SCHEMA tokens;
    CREATE TABLE chain.blocks (height bigint PRIMARY KEY, hash bytea NOT NULL, parent_hash bytea NOT NULL);
    CREATE TABLE tokens.balances (owner bytea, token text, amount numeric NOT NULL, meta jsonb,
      PRIMARY KEY (owner, token));
    INSERT INTO chain.blocks
      SELECT h, sha256(int8send(h)), sha256(int8send(h - 1)) FROM generate_series(0, ${BLOCKS - 1}) AS h
      ORDER BY h % 7, h;
    ${balances("desc")}
  `;

  it("is equal for databases holding the same rows, however they were built", async () => {
    const first = await freshDatabase(FIRST);
    const second = await freshDatabase(SECOND);
    const third = await freshDatabase(THIRD);
    const reference = await hashOf(first);
    expect(await hashOf(second)).toBe(reference);
    expect(await hashOf(third)).toBe(reference);
    expect(await hashOf(first, 7)).toBe(reference);
    expect(await hashOf(second, 999)).toBe(reference);
  }, 120_000);

  it("changes when one byte of one row changes, and returns when the byte is restored", async () => {
    const db = await freshDatabase(FIRST);
    const before = await hashOf(db);
    const flip = `UPDATE chain.blocks SET hash = set_byte(hash, 17, get_byte(hash, 17) # 1) WHERE height = 1234`;
    await db.exec(flip);
    const changed = await hashOf(db);
    expect(changed).not.toBe(before);
    await db.exec(flip);
    expect(await hashOf(db)).toBe(before);
  }, 120_000);
});

describe("A55 negative controls — each thing a wrong hash could ignore changes the hash", () => {
  const BASE = `
    CREATE SCHEMA s1;
    CREATE SCHEMA s2;
    CREATE TABLE s1.t (k integer PRIMARY KEY, a text, b text, n bigint, payload bytea, doc jsonb);
    CREATE TABLE s2.t (k integer PRIMARY KEY, a text, b text, n bigint, payload bytea, doc jsonb);
    CREATE TABLE s1."left" (k integer PRIMARY KEY, v text);
    CREATE TABLE s1."right" (k integer PRIMARY KEY, v text);
    INSERT INTO s1.t VALUES
      (1, 'abc', 'x', 10, '\\x0102', '{"k": 1}'),
      (2, 'def', 'y', 20, '\\x0304', '{"k": 2}'),
      (3, 'ghi', 'z', 30, '\\x0506', '{"k": [3]}');
    INSERT INTO s2.t VALUES (1, 'abc', 'x', 10, '\\x0102', '{"k": 1}');
    INSERT INTO s1."left" VALUES (1, 'one'), (2, 'two');
    INSERT INTO s1."right" VALUES (3, 'three');
  `;

  let db: TestDatabase;
  let base: string;

  beforeAll(async () => {
    db = await freshDatabase(BASE);
    base = await hashOf(db);
  }, 120_000);

  // Each swap is its own inverse.
  const SWAP_TABLES = `ALTER TABLE s1."left" RENAME TO tmp; ALTER TABLE s1."right" RENAME TO "left";
    ALTER TABLE s1.tmp RENAME TO "right"`;
  const SWAP_SCHEMAS = `ALTER SCHEMA s1 RENAME TO tmp; ALTER SCHEMA s2 RENAME TO s1; ALTER SCHEMA tmp RENAME TO s2`;
  const SWAP_COLUMNS = `ALTER TABLE s1.t RENAME COLUMN a TO tmp; ALTER TABLE s1.t RENAME COLUMN b TO a;
    ALTER TABLE s1.t RENAME COLUMN tmp TO b`;

  // [what changes, the change, its undoing]
  const cases: readonly (readonly [string, string, string])[] = [
    [
      "one byte of a bytea value",
      `UPDATE s1.t SET payload = '\\x0105' WHERE k = 1`,
      `UPDATE s1.t SET payload = '\\x0102' WHERE k = 1`,
    ],
    [
      "one character of a text value",
      `UPDATE s1.t SET a = 'abd' WHERE k = 1`,
      `UPDATE s1.t SET a = 'abc' WHERE k = 1`,
    ],
    [
      "a column between others (ignoring a column)",
      `UPDATE s1.t SET n = 21 WHERE k = 2`,
      `UPDATE s1.t SET n = 20 WHERE k = 2`,
    ],
    [
      "the last column (ignoring a column)",
      `UPDATE s1.t SET doc = '{"k": [4]}' WHERE k = 3`,
      `UPDATE s1.t SET doc = '{"k": [3]}' WHERE k = 3`,
    ],
    ["a value replaced by NULL", `UPDATE s1.t SET b = NULL WHERE k = 2`, `UPDATE s1.t SET b = 'y' WHERE k = 2`],
    ["a key value", `UPDATE s1.t SET k = 4 WHERE k = 3`, `UPDATE s1.t SET k = 3 WHERE k = 4`],
    [
      "a row removed (ignoring a row)",
      `DELETE FROM s1.t WHERE k = 2`,
      `INSERT INTO s1.t VALUES (2, 'def', 'y', 20, '\\x0304', '{"k": 2}')`,
    ],
    [
      "a row added (ignoring a row)",
      `INSERT INTO s2.t VALUES (2, 'abc', 'x', 10, '\\x0102', '{"k": 1}')`,
      `DELETE FROM s2.t WHERE k = 2`,
    ],
    [
      "a row moved to another table with the same columns (ignoring which table holds it)",
      `DELETE FROM s1."left" WHERE k = 2; INSERT INTO s1."right" VALUES (2, 'two')`,
      `DELETE FROM s1."right" WHERE k = 2; INSERT INTO s1."left" VALUES (2, 'two')`,
    ],
    ["two tables' names swapped (ignoring table order)", SWAP_TABLES, SWAP_TABLES],
    ["two schemas' names swapped (ignoring schema order)", SWAP_SCHEMAS, SWAP_SCHEMAS],
    [
      "a column renamed (ignoring column names)",
      `ALTER TABLE s2.t RENAME COLUMN b TO c`,
      `ALTER TABLE s2.t RENAME COLUMN c TO b`,
    ],
    ["two columns' names swapped (ignoring column names)", SWAP_COLUMNS, SWAP_COLUMNS],
    ["an empty table added", `CREATE TABLE s2.extra (k integer PRIMARY KEY)`, `DROP TABLE s2.extra`],
    ["a table renamed", `ALTER TABLE s2.t RENAME TO u`, `ALTER TABLE s2.u RENAME TO t`],
    [
      "a jsonb key renamed",
      `UPDATE s1.t SET doc = '{"j": 1}' WHERE k = 1`,
      `UPDATE s1.t SET doc = '{"k": 1}' WHERE k = 1`,
    ],
  ];

  for (const [what, change, restore] of cases) {
    it(`changes with ${what}, and returns when it is undone`, async () => {
      await db.exec(change);
      expect(await hashOf(db)).not.toBe(base);
      await db.exec(restore);
      expect(await hashOf(db)).toBe(base);
    }, 60_000);
  }

  it("does not change with what DT-3 does not hold: same-value rewrites, empty schemas, views, indexes", async () => {
    await db.exec(`UPDATE s1.t SET a = a, payload = payload`);
    expect(await hashOf(db)).toBe(base);
    await db.exec(`CREATE SCHEMA nothing_here; CREATE VIEW s1.w AS SELECT k FROM s1.t; CREATE INDEX ON s1.t (b)`);
    expect(await hashOf(db)).toBe(base);
    await db.exec(`DROP SCHEMA nothing_here; DROP VIEW s1.w`);
  }, 60_000);
});

describe("DT-3 — the hash reads one consistent snapshot", () => {
  const SETUP = `
    CREATE SCHEMA m;
    CREATE TABLE m.a (k integer PRIMARY KEY, v text);
    CREATE TABLE m.b (k integer PRIMARY KEY, v text);
    INSERT INTO m.a VALUES (1, 'a-marker'), (2, 'a2');
    INSERT INTO m.b VALUES (1, 'b1'), (2, 'b2'), (3, 'b3'), (4, 'b4'), (5, 'b5'), (6, 'b6'), (7, 'b7');
  `;

  /** A handle that runs `write` once, right after the first result that satisfies `when`. */
  function interleaving(
    read: ConsistentRead,
    when: (rows: Record<string, unknown>[]) => boolean,
    write: () => Promise<void>,
  ): ConsistentRead {
    let done = false;
    return {
      query: async (sql, params) => {
        const rows = await read.query(sql, params);
        if (!done && when(rows)) {
          done = true;
          await write();
        }
        return rows;
      },
    };
  }

  // After m.a's rows have been read and before anything of m.b is: a commit that changes a row of each table.
  const afterTableA = (rows: Record<string, unknown>[]) => rows.some((row) => Object.values(row).includes("a-marker"));
  const UPDATE_BOTH = `UPDATE m.a SET v = 'a2-new' WHERE k = 2; UPDATE m.b SET v = 'b1-new' WHERE k = 1`;
  const UNDO_UPDATE = `UPDATE m.a SET v = 'a2' WHERE k = 2; UPDATE m.b SET v = 'b1' WHERE k = 1`;
  // After m.b's row count (7) has been read and before its rows are: a commit that adds a row to m.b.
  const afterCountOfB = (rows: Record<string, unknown>[]) => {
    const values = rows.length === 1 ? Object.values(rows[0] as object) : [];
    return values.length === 1 && (values[0] === 7n || values[0] === 7);
  };
  const INSERT_B = `INSERT INTO m.b VALUES (8, 'b8')`;

  it("is not affected by a commit between its statements", async () => {
    const db = await freshDatabase(SETUP);
    const before = await hashOf(db);
    const during = await db.read((read) => contentsHash(interleaving(read, afterTableA, () => db.exec(UPDATE_BOTH))));
    expect(hex(during)).toBe(before);
    const after = await hashOf(db);
    expect(after).not.toBe(before);
    await db.exec(UNDO_UPDATE);
    expect(await hashOf(db)).toBe(before);

    const duringInsert = await db.read((read) =>
      contentsHash(interleaving(read, afterCountOfB, () => db.exec(INSERT_B))),
    );
    expect(hex(duringInsert)).toBe(before);
    expect(await hashOf(db)).not.toBe(before);
  }, 60_000);

  it("negative control: a handle without one snapshot mixes two states, or is caught by the row count", async () => {
    const db = await freshDatabase(SETUP);
    const before = await hashOf(db);
    const mixed = hex(
      await db.readWithoutSnapshot((read) => contentsHash(interleaving(read, afterTableA, () => db.exec(UPDATE_BOTH)))),
    );
    const after = await hashOf(db);
    expect(mixed).not.toBe(before);
    expect(mixed).not.toBe(after);
    await db.exec(UNDO_UPDATE);

    const error = await failure(() =>
      db.readWithoutSnapshot((read) => contentsHash(interleaving(read, afterCountOfB, () => db.exec(INSERT_B)))),
    );
    expect(error.reason).toBe("row-count-changed");
    expect([error.schema, error.table, error.column]).toEqual(["m", "b", null]);
  }, 60_000);
});

describe("DT-1 failures inside the hash", () => {
  it("fails on a row DT-1 cannot encode, naming the table and the column", async () => {
    for (const [value, reason] of [
      ["1.5", "numeric-fraction"],
      ["100.00", "numeric-fraction"], // Q57 (owner decision C): a zero fraction is a fraction
    ] as const) {
      const db = await freshDatabase(`
        CREATE SCHEMA m;
        CREATE TABLE m.fees (id bigint PRIMARY KEY, note text, amount numeric);
        INSERT INTO m.fees VALUES (1, 'ok', 5), (2, 'bad', ${value});
      `);
      const error = await failure(() => db.read((read) => contentsHash(read)));
      expect(error.reason).toBe("unencodable-row");
      expect([error.schema, error.table, error.column]).toEqual(["m", "fees", "amount"]);
      expect(error.cause).toBeInstanceOf(CanonicalEncodingError);
      expect((error.cause as CanonicalEncodingError).reason).toBe(reason);
    }
  }, 60_000);

  it("fails on a jsonb number DT-1 refuses", async () => {
    const db = await freshDatabase(`
      CREATE SCHEMA m;
      CREATE TABLE m.docs (id bigint PRIMARY KEY, doc jsonb);
      INSERT INTO m.docs VALUES (1, '{"x": 1.5}');
    `);
    const error = await failure(() => db.read((read) => contentsHash(read)));
    expect(error.reason).toBe("unencodable-row");
    expect(error.column).toBe("doc");
    expect((error.cause as CanonicalEncodingError).reason).toBe("not-integer");
  }, 60_000);

  // Task 1.3: a refusal names the table, the column and its declared type, the row by its key, and says why and what
  // to store instead (the numeric rows of `design.md` §4's column-type table; DT-6 and Q57 for jsonb numbers).
  it("says where the value is and why a stored number must be an integer", async () => {
    const db = await freshDatabase(`
      CREATE SCHEMA m;
      CREATE TABLE m.fees (id bigint, tag text, amount numeric(20), doc jsonb, PRIMARY KEY (tag, id));
      INSERT INTO m.fees VALUES (1, 'a', 5, '{}'), (2, 'b"', 'NaN', '{}');
      CREATE SCHEMA n;
      CREATE TABLE n.docs (id bytea PRIMARY KEY, doc jsonb);
      INSERT INTO n.docs VALUES ('\\x00ff', '{"x": [1, 18446744073709551616]}');
    `);
    const numeric = await failure(() => db.read((read) => contentsHash(read)));
    expect([numeric.reason, numeric.declaredType]).toEqual(["unencodable-row", "numeric(20,0)"]);
    expect(numeric.message).toBe(
      'unencodable-row: table "m"."fees", column "amount" (numeric(20,0)): the row with primary key ' +
        '(tag, id) = ("b\\"", 2) cannot be encoded: $[2]: numeric-invalid: "NaN" is not decimal digits with an ' +
        'optional "-". A stored number must be an integer, so that equal contents hashes mean equal query results: ' +
        "a numeric with a fraction, even a zero one such as 100.00, or NaN has no canonical encoding. Instead, store " +
        "integer smallest units in numeric(p) or bigint.",
    );
    await db.exec(`DROP TABLE m.fees`);
    const json = await failure(() => db.read((read) => contentsHash(read)));
    expect([json.reason, json.schema, json.table, json.column, json.declaredType]).toEqual([
      "unencodable-row",
      "n",
      "docs",
      "doc",
      "jsonb",
    ]);
    expect(json.message).toContain('the row with primary key (id) = (\\x00ff) cannot be encoded: $[1]["x"][1]: ');
    expect(json.message).toContain("integer-out-of-range");
    expect(json.message).toContain("a JSON number must be an integer within the signed 64-bit range");
  }, 60_000);

  it("explains nothing more when only a broken handle could have caused the failure", async () => {
    const db = await freshDatabase(`
      CREATE SCHEMA m;
      CREATE TABLE m.notes (id bigint PRIMARY KEY, body text);
      INSERT INTO m.notes VALUES (7, 'seven');
    `);
    // A handle that returns a number where the text column's value should be.
    const broken = (read: ConsistentRead): ConsistentRead => ({
      query: async (sql, params) =>
        (await read.query(sql, params)).map((row) => (row.c1 === "seven" ? { ...row, c1: 7 } : row)),
    });
    const error = await failure(() => db.read((read) => contentsHash(broken(read))));
    expect(error.message).toBe(
      'unencodable-row: table "m"."notes", column "body" (text): the row with primary key (id) = (7) cannot be ' +
        "encoded: $[1]: type-mismatch: text cannot hold a number",
    );
  }, 60_000);

  it("names the table but no column when the rows read are not as many as counted", () => {
    const error = new PublicContentsError(
      "row-count-changed",
      { schema: "m", table: "b" },
      null,
      "counted 7 rows, then read 8",
    );
    expect(error.message).toBe('row-count-changed: table "m"."b": counted 7 rows, then read 8');
    expect(error.declaredType).toBeNull();
  });

  it("passes on an error that is not an encoding failure unchanged", async () => {
    const db = await freshDatabase(`
      CREATE SCHEMA m;
      CREATE TABLE m.docs (id bigint PRIMARY KEY, doc jsonb);
      INSERT INTO m.docs VALUES (1, '{"marker": 1}');
    `);
    const broken = new RangeError("a value that cannot be read");
    // A handle whose row value throws when the encoder reads it: the hash must not dress that up as a DT-1 failure.
    const poisoned = (read: ConsistentRead): ConsistentRead => ({
      query: async (sql, params) =>
        (await read.query(sql, params)).map((row) =>
          Object.fromEntries(
            Object.entries(row).map(([name, value]) => [
              name,
              typeof value === "object" && value !== null && "marker" in value
                ? Object.defineProperty({}, "marker", {
                    enumerable: true,
                    get: () => {
                      throw broken;
                    },
                  })
                : value,
            ]),
          ),
        ),
    });
    await expect(db.read((read) => contentsHash(poisoned(read)))).rejects.toBe(broken);
  }, 60_000);

  it("fails on a public table without a primary key, even when every other table can be hashed", async () => {
    const db = await freshDatabase(`
      CREATE SCHEMA m;
      CREATE TABLE m.fine (k integer PRIMARY KEY);
      CREATE TABLE m.loose (k integer);
    `);
    const error = await failure(() => db.read((read) => contentsHash(read)));
    expect(error.reason).toBe("no-primary-key");
  }, 60_000);
});

describe("the handle the contents hash needs", () => {
  // CORE-ARCH §4.10's handles (`design.md` §4), as task 2.1 will define them: the hash must accept them unchanged.
  interface ReadHandle {
    readonly height: bigint | null;
    query(sql: string, params?: unknown[]): Promise<Record<string, unknown>[]>;
  }
  interface BlockWriteHandle extends ReadHandle {
    execute(sql: string, params?: unknown[]): Promise<number>;
  }

  it("is the query of a read handle and nothing more", () => {
    expectTypeOf<ReadHandle>().toExtend<ConsistentRead>();
    expectTypeOf<BlockWriteHandle>().toExtend<ConsistentRead>();
    expectTypeOf<ConsistentRead>().toEqualTypeOf<{
      query(sql: string, params?: unknown[]): Promise<Record<string, unknown>[]>;
    }>();
    expectTypeOf(contentsHash).parameter(0).toEqualTypeOf<ConsistentRead>();
  });
});
