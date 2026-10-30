import fc from "fast-check";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import type { Database } from "../../src/db/api.js";
import { UmbraError } from "../../src/db/errors.js";
import { RESULT_TYPES } from "../../src/deterministic-postgresql/index.js";
import { BACKENDS, TEST_CURSOR, TEST_SCHEMA, type TestBackend, type TestDatabase } from "./backends.js";

/**
 * The database API gives identical query results on PostgreSQL 18 and PGlite 0.5.10 (PostgreSQL 18.6 inside). The
 * same statements, with the same parameters, run on one database of each backend built by the same setup. The mapped
 * results (every row and every value, its JavaScript type included) are compared with each other, not only with an
 * expectation. So are the rows a write affects and the errors a statement fails with (code, retryability, details,
 * message). The suites that iterate `BACKENDS` (`results.test.ts`, `handles.test.ts`, `read-height.property.test.ts`)
 * show that each backend passes on its own; this file shows the two agree. [A7 DIFF, DB-1]
 *
 * Date and time values are compared as the values the mapping makes of them, like every other value: RFC 3339 text,
 * `infinity` as the word, arrays element by element. Their case also checks them against values written out by hand.
 * `now()`, `version()` and other values that differ between two servers by nature are not in the corpus. [DB-2, Q68]
 */

const SEED = 20261023;

const SETUP = `${TEST_SCHEMA}
  CREATE TYPE t.mood AS ENUM ('sad', 'ok');
  CREATE DOMAIN t.positive AS integer CHECK (VALUE > 0);
  CREATE TYPE t.pair AS (a integer, b text);
  CREATE TABLE t.checked (k integer PRIMARY KEY, v text NOT NULL CHECK (v <> 'bad'), p t.positive);
  CREATE TABLE t.parent (k integer PRIMARY KEY);
  CREATE TABLE t.child (k integer PRIMARY KEY, parent integer REFERENCES t.parent (k));
  CREATE TABLE t.values (id bigint PRIMARY KEY, t text, b bytea, j jsonb, n numeric, a text[], i bigint[], flag boolean);
  INSERT INTO t.parent VALUES (1);
  INSERT INTO t.checked VALUES (1, 'a', 1);
`;

/** One statement of the corpus: what it shows, its SQL and its parameters. */
interface Case {
  readonly name: string;
  readonly sql: string;
  readonly params?: readonly unknown[];
}

/** Read statements whose mapped rows must be identical on both backends. */
const READS: readonly Case[] = [
  {
    name: "integers at their limits, and oid",
    sql: `SELECT 32767::smallint AS s_max, (-32768)::smallint AS s_min, 2147483647 AS i_max, (-2147483648)::integer AS
                 i_min, 9223372036854775807 AS b_max, (-9223372036854775807 - 1)::bigint AS b_min, 0::bigint AS zero,
                 1::bigint AS one, 4294967295::oid AS o`,
  },
  {
    name: "floats in their shortest exact form, and their special values",
    sql: `SELECT 0.1::real AS r1, 3.4028235e38::real AS r_max, 1e-45::real AS r_tiny, 0.1::float8 AS d1,
                 0.1::float8 + 0.2::float8 AS d_sum, 1e308::float8 AS d_big, 5e-324::float8 AS d_tiny,
                 'NaN'::float8 AS nan, 'Infinity'::real AS inf, '-Infinity'::float8 AS ninf, '-0'::float8 AS nzero`,
  },
  {
    name: "numeric as decimal text, special values included",
    sql: `SELECT 340282366920938463463374607431768211456::numeric AS big, (-12.50)::numeric AS frac, 0::numeric AS z,
                 'NaN'::numeric AS nan, 'Infinity'::numeric AS inf, 1e-20::numeric AS small, 100.00::numeric(10,2) AS
                 scaled, (2::numeric ^ 100) AS pow`,
  },
  {
    name: "bytea: empty and every byte value",
    sql: `SELECT ''::bytea AS empty, string_agg(set_byte('\\x00'::bytea, 0, g), ''::bytea ORDER BY g) AS all_bytes
            FROM generate_series(0, 255) g`,
  },
  {
    name: "boolean, text, varchar, char(n), name, \"char\" and uuid",
    sql: `SELECT true AS yes, false AS no, '' AS empty, 'é ü 中 😀 ''q'' "d" \\ ' AS unicode, 'abc'::varchar(5) AS v,
                 'ab'::char(4) AS c, 'n'::name AS n, 'x'::"char" AS ch,
                 'A0EEBC99-9C0B-4EF8-BB6D-6BB9BD380A11'::uuid AS u, '{a0eebc999c0b4ef8bb6d6bb9bd380a11}'::uuid AS u2`,
  },
  {
    name: "jsonb and json without loss: integers beyond 2^53, nesting, key order, duplicate keys, spacing",
    sql: `SELECT '9007199254740992'::jsonb AS a, '9007199254740993'::jsonb AS b, '-9223372036854775808'::jsonb AS c,
                 '42'::jsonb AS d, '{"b": [1, {"z": null, "a": true}], "a": "x", "a": 2}'::jsonb AS e,
                 '{"n": 1.5, "e": 1e2, "m": -0, "s": "\\u00e9"}'::jsonb AS f, '[]'::jsonb AS g, 'null'::jsonb AS h,
                 '{"k":  1, "k": 18446744073709551615}'::json AS i, '"text"'::json AS j`,
  },
  {
    name: "date and time values as values: RFC 3339 text, infinity as the word (Q68)",
    sql: `SELECT '2026-10-23'::date AS d, '2026-10-23 10:00:00.123456'::timestamp AS ts,
                 '2026-10-23 10:00:00.123456+02'::timestamptz AS tz, '10:00:00.5'::time AS tm,
                 '10:00:00+02'::timetz AS ttz, '1 day 2 hours 3 minutes'::interval AS iv,
                 '-1 year -2 mons +3 days -04:05:06'::interval AS iv2, 1.5::money AS m, '-1234567.89'::money AS m2,
                 'infinity'::timestamptz AS inf, '-infinity'::timestamp AS ninf, 'infinity'::date AS dinf,
                 '0001-01-01 00:00:00.000001+00'::timestamptz AS first, '9999-12-31 23:59:59.999999+00'::timestamptz AS
                 last, ARRAY['2026-10-23 10:00:00+00'::timestamptz, NULL, 'infinity'] AS tzs,
                 ARRAY['2026-10-23 10:00:00.5'::timestamp, NULL] AS tss, ARRAY[['2026-10-23'::date], [NULL::date]] AS ds`,
  },
  {
    name: "arrays of every named type, with NULL elements, nesting, quoting and lower bounds",
    sql: `SELECT ARRAY[true, NULL, false] AS bools, ARRAY[1, NULL, -3]::smallint[] AS smalls, ARRAY[1, NULL]::integer[] AS
                 ints, ARRAY[9007199254740993, NULL]::bigint[] AS bigs, ARRAY[1.5, NULL, 'NaN']::numeric[] AS nums,
                 ARRAY['\\x01'::bytea, NULL, ''] AS bytes, ARRAY['a"b', 'c\\d', 'e,f', '{g}', ' h ', 'NULL', NULL, '']
                 AS texts, ARRAY['{"a": 9007199254740993}'::jsonb, NULL, 'null', '[1]'] AS docs,
                 ARRAY['{"a":1}'::json, NULL] AS jsons, ARRAY[0.5::real, NULL, 'NaN'] AS reals,
                 ARRAY[0.1::float8, '-Infinity'] AS doubles, ARRAY['ab'::char(3), NULL] AS chars,
                 ARRAY['x'::varchar, NULL] AS varchars, ARRAY['n'::name] AS names, ARRAY['c'::"char"] AS chs,
                 ARRAY[26::oid] AS oids, ARRAY['a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11'::uuid, NULL] AS uuids,
                 ARRAY['10:00'::time, NULL] AS times, ARRAY['1 day'::interval] AS intervals,
                 ARRAY['10:00+01'::timetz] AS timetzs, ARRAY[1.5::money] AS moneys,
                 ARRAY[[1, 2], [3, NULL]] AS nested, '[0:1]={7,8}'::integer[] AS shifted,
                 '[-2:-1][3:3]={{a},{b}}'::text[] AS shifted2, '{}'::text[] AS empty, ARRAY[ARRAY[ARRAY['x']]] AS deep`,
  },
  {
    name: "types the mapping does not name come back as their text, arrays of them too (Q66)",
    sql: `SELECT 'ok'::t.mood AS mood, ARRAY['ok', NULL]::t.mood[] AS moods, 5::t.positive AS dom,
                 ROW(1, 'x y')::t.pair AS pair, ROW(1, NULL) AS rec, '[1,3)'::int4range AS range,
                 '192.168.0.1/24'::inet AS ip, ARRAY['10.0.0.1'::inet] AS ips, B'1010' AS bits, '(1,2)'::point AS pt,
                 'a fat cat'::tsvector AS tsv, '{"a": 1}'::jsonb #> '{a}' AS path, 'abc'::bytea::text AS byte_text`,
  },
  {
    name: "duplicate column names keep the later value; columns keep their order",
    sql: "SELECT 1 AS a, 2 AS b, 'x' AS a, NULL::integer AS c",
  },
  { name: "no rows", sql: "SELECT 1 AS a WHERE false" },
  {
    name: "many rows, in the statement's order",
    sql: "SELECT g AS n, g::text AS t, (g % 7 = 0) AS seven FROM generate_series(1, 1000) g ORDER BY g DESC",
  },
  {
    name: "catalog names, as the determinism code reads them",
    sql: `SELECT format_type('numeric'::regtype, NULL) AS n, format_type('character varying'::regtype, 36) AS v,
                 format_type('timestamptz'::regtype, NULL) AS tz, pg_typeof(1::bigint)::text AS ty,
                 (SELECT array_agg(typname ORDER BY oid) FROM pg_type WHERE oid IN (16, 17, 20, 25, 3802)) AS names`,
  },
  {
    name: "text order and case without COLLATE: byte order on both databases here",
    sql: `SELECT string_agg(x, ' ' ORDER BY x) AS ordered, lower('ÉÀ') AS l, upper('ßé') AS u, 'a' < 'B' AS lt,
                 'é' ~* 'É' AS ci FROM unnest(ARRAY['B', 'a', 'b', 'é', 'E', '_', 'Z']) x`,
  },
  {
    name: "parameters of every kind, sent as untyped text",
    sql: `SELECT $1::bigint AS big, $2::bytea AS bytes, $3::jsonb AS doc, $4::integer[] AS ints, $5::text[] AS texts,
                 $6::boolean AS flag, $7::numeric AS amount, $8::text AS nothing, $9::bytea[] AS blobs,
                 $10::jsonb[] AS docs, $11::double precision AS half, $12::jsonb AS json_text, $13::smallint AS small,
                 $14::uuid AS id, $15 || '!' AS untyped_text, $16::timestamptz AS at, $17::timestamptz AS at_text`,
    params: [
      9223372036854775807n,
      new Uint8Array([0, 1, 255]),
      { a: 9007199254740993n, b: ["x", null, { c: true }] },
      [1, null, -3],
      ['a"b', "c\\d", "NULL", "", " ", "{,}"],
      false,
      "-12.50",
      null,
      [new Uint8Array([1]), null],
      [{ k: 1 }, null],
      0.5,
      '"just text"',
      -7,
      "A0EEBC99-9C0B-4EF8-BB6D-6BB9BD380A11",
      "x",
      new Date("2026-10-23T10:00:00.123Z"),
      "2026-10-23T10:00:00.123456Z",
    ],
  },
];

/** Statements that fail; each backend must give the same error. */
const FAILURES: readonly Case[] = [
  { name: "unique violation", sql: "INSERT INTO t.checked VALUES (1, 'again', 2)" },
  { name: "check violation", sql: "INSERT INTO t.checked VALUES (2, 'bad', 2)" },
  { name: "not-null violation", sql: "INSERT INTO t.checked VALUES (3, NULL, 2)" },
  { name: "domain check violation", sql: "INSERT INTO t.checked VALUES (4, 'x', -1)" },
  { name: "foreign-key violation", sql: "INSERT INTO t.child VALUES (1, 99)" },
  { name: "syntax error", sql: "SELEC 1" },
  { name: "undefined column", sql: "SELECT nope FROM t.checked" },
  { name: "undefined table", sql: "SELECT 1 FROM t.nope" },
  { name: "division by zero", sql: "SELECT 1 / $1::integer", params: [0] },
  { name: "invalid input syntax", sql: "SELECT $1::integer", params: ["one"] },
  { name: "numeric out of range", sql: "SELECT 32768::smallint" },
  { name: "two statements in one call", sql: "SELECT 1; SELECT 2" },
  // `SELECT $1` alone is typed `text` (PostgreSQL 17.11 and 18.6 alike); in `$1 IS NULL` nothing gives $1 a type.
  { name: "a parameter PostgreSQL cannot type", sql: "SELECT $1 IS NULL AS x", params: ["x"] },
  { name: "an error raised by PL/pgSQL", sql: "DO $$ BEGIN RAISE EXCEPTION 'boom %', 7 USING ERRCODE = 'P0001'; END $$" },
  { name: "a parameter the API cannot send", sql: "SELECT $1::text", params: [undefined] },
];

/** The comparable shape of an error: what a caller sees of it. */
function shape(error: unknown): unknown {
  if (!(error instanceof UmbraError)) return { notAnUmbraError: String(error) };
  return { code: error.code, retryable: error.retryable, details: error.details, message: error.message };
}

async function outcome(run: () => Promise<unknown>): Promise<unknown> {
  try {
    return { result: await run() };
  } catch (error) {
    return { error: shape(error) };
  }
}

describe("A7 (DB-1) — identical results on PostgreSQL 18 and PGlite 0.5.10", () => {
  const [postgres, pglite] = BACKENDS as readonly [TestBackend, TestBackend];
  let pg: TestDatabase;
  let lite: TestDatabase;

  beforeAll(async () => {
    expect([postgres.name, pglite.name]).toEqual(["PostgreSQL 18", "PGlite 0.5.10"]);
    await Promise.all([postgres.start(), pglite.start()]);
    [pg, lite] = await Promise.all([postgres.database(SETUP, TEST_CURSOR), pglite.database(SETUP, TEST_CURSOR)]);
  }, 180_000);

  afterAll(async () => {
    await Promise.all([postgres.stop(), pglite.stop()]);
  }, 60_000);

  /** Runs `run` on each backend's database and returns both outcomes. */
  const both = async (run: (db: Database) => Promise<unknown>) =>
    Promise.all([outcome(() => run(pg.db)), outcome(() => run(lite.db))]);

  it("the corpus covers every type the mapping names, as a value and in an array", () => {
    const corpus = READS.map((c) => c.sql).join("\n");
    for (const type of RESULT_TYPES) {
      const spelled = {
        boolean: ["true", "bool"],
        bytea: ["bytea"],
        '"char"': ['"char"'],
        name: ["::name"],
        bigint: ["bigint"],
        smallint: ["smallint"],
        integer: ["integer", "2147483647"],
        text: ["text"],
        oid: ["::oid"],
        json: ["::json"],
        real: ["::real"],
        "double precision": ["float8", "double precision"],
        money: ["money"],
        character: ["char("],
        "character varying": ["varchar"],
        date: ["::date"],
        "time without time zone": ["::time"],
        "timestamp without time zone": ["::timestamp"],
        "timestamp with time zone": ["::timestamptz"],
        interval: ["::interval"],
        "time with time zone": ["::timetz"],
        numeric: ["numeric"],
        uuid: ["uuid"],
        jsonb: ["jsonb"],
      }[type.name];
      expect(spelled, type.name).toBeDefined();
      expect(spelled?.some((word) => corpus.includes(word)), type.name).toBe(true);
    }
  });

  for (const c of READS) {
    it(`gives identical rows: ${c.name}`, async () => {
      const [onPostgres, onPglite] = await both((db) => db.read((read) => read.query(c.sql, c.params as unknown[])));
      expect(onPostgres).toHaveProperty("result");
      expect(onPglite).toEqual(onPostgres);
    });
  }

  it("gives the date and time values written out by hand, on both backends (DB-2, Q68)", async () => {
    const dates = READS.find((c) => c.name.startsWith("date and time values as values")) as Case;
    const [onPostgres, onPglite] = await both((db) => db.read((read) => read.query(dates.sql)));
    expect(onPglite).toEqual(onPostgres);
    expect(onPostgres).toEqual({
      result: [
        {
          d: "2026-10-23",
          ts: "2026-10-23T10:00:00.123456",
          tz: "2026-10-23T08:00:00.123456Z",
          tm: "10:00:00.5",
          ttz: "10:00:00+02",
          iv: "1 day 02:03:00",
          iv2: "-1 years -2 mons +3 days -04:05:06",
          m: "$1.50",
          m2: "-$1,234,567.89",
          inf: "infinity",
          ninf: "-infinity",
          dinf: "infinity",
          first: "0001-01-01T00:00:00.000001Z",
          last: "9999-12-31T23:59:59.999999Z",
          tzs: ["2026-10-23T10:00:00Z", null, "infinity"],
          tss: ["2026-10-23T10:00:00.5", null],
          ds: [["2026-10-23"], [null]],
        },
      ],
    });
    // A Date parameter and an RFC 3339 text parameter read back as RFC 3339 text.
    const parameters = READS.find((c) => c.name.startsWith("parameters of every kind")) as Case;
    const [sent] = await both((db) => db.read((read) => read.query(parameters.sql, parameters.params as unknown[])));
    expect(sent).toMatchObject({
      result: [{ at: "2026-10-23T10:00:00.123Z", at_text: "2026-10-23T10:00:00.123456Z" }],
    });
  });

  it("gives identical rows for the date and time values a query compares", async () => {
    const sql = `SELECT '2026-10-23'::date = '2026-10-23 00:00:00+00'::timestamptz AS same_instant,
                        extract(epoch FROM '2026-10-23 10:00:00.123456+02'::timestamptz)::text AS epoch,
                        to_char('2026-10-23 10:00:00+00'::timestamptz, 'YYYY-MM-DD"T"HH24:MI:SS') AS formatted`;
    const [onPostgres, onPglite] = await both((db) => db.read((read) => read.query(sql)));
    expect(onPglite).toEqual(onPostgres);
    expect(onPostgres).toEqual({
      result: [{ same_instant: true, epoch: "1792742400.123456", formatted: "2026-10-23T10:00:00" }],
    });
  });

  for (const c of FAILURES) {
    it(`gives the identical error: ${c.name}`, async () => {
      const [onPostgres, onPglite] = await both((db) => db.read((read) => read.query(c.sql, c.params as unknown[])));
      expect(onPostgres).toHaveProperty("error");
      expect(onPglite).toEqual(onPostgres);
    });
  }

  it("gives identical errors for writes in a transaction, and rolls back on both", async () => {
    for (const c of FAILURES.slice(0, 5)) {
      const [onPostgres, onPglite] = await both((db) => db.transaction((tx) => tx.execute(c.sql)));
      expect(onPostgres, c.name).toHaveProperty("error");
      expect(onPglite, c.name).toEqual(onPostgres);
    }
    const count = "SELECT count(*) AS n FROM t.checked";
    const [onPostgres, onPglite] = await both((db) => db.read((read) => read.query(count)));
    expect(onPglite).toEqual(onPostgres);
    expect(onPostgres).toEqual({ result: [{ n: 1n }] });
  });

  it("gives the identical refusal of a COMMIT that PostgreSQL turned into ROLLBACK", async () => {
    const [onPostgres, onPglite] = await both((db) =>
      db.transaction(async (tx) => {
        await tx.execute("INSERT INTO t.checked VALUES (10, 'x', 1)");
        await tx.execute("INSERT INTO t.checked VALUES (10, 'y', 1)").catch(() => undefined);
      }),
    );
    expect(onPostgres).toEqual({
      error: expect.objectContaining({ code: "database-error", details: { reason: "commit-rolled-back" } }),
    });
    expect(onPglite).toEqual(onPostgres);
  });

  it("returns identical row counts from execute for every kind of statement", async () => {
    const statements = [
      "INSERT INTO t.values (id, t) VALUES (1, 'a'), (2, 'b'), (3, 'c')",
      "INSERT INTO t.values (id, t) SELECT g, 'g' FROM generate_series(10, 14) g RETURNING id",
      "UPDATE t.values SET flag = true WHERE id > 1",
      "UPDATE t.values SET flag = false WHERE id > 100",
      "DELETE FROM t.values WHERE id = 3",
      "SELECT * FROM t.values",
      "SELECT * FROM t.values WHERE false",
      "CREATE TABLE t.made (k integer PRIMARY KEY)",
      "INSERT INTO t.made VALUES (1) ON CONFLICT DO NOTHING",
      "INSERT INTO t.made VALUES (1) ON CONFLICT DO NOTHING",
      "MERGE INTO t.made m USING (VALUES (1), (2)) AS s(k) ON m.k = s.k WHEN NOT MATCHED THEN INSERT VALUES (s.k)",
      "SET LOCAL TimeZone = 'UTC'",
      "DROP TABLE t.made",
      "DELETE FROM t.values",
    ];
    const [onPostgres, onPglite] = await both((db) =>
      db.transaction(async (tx) => {
        const counts: number[] = [];
        for (const sql of statements) counts.push(await tx.execute(sql));
        return counts;
      }),
    );
    expect(onPostgres).toEqual({ result: [3, 5, 7, 0, 1, 7, 0, 0, 1, 0, 1, 0, 0, 7] });
    expect(onPglite).toEqual(onPostgres);
  });

  it("round-trips random rows identically through parameters on both (property, seed 20261023)", async () => {
    const text = fc.oneof(
      fc.string({ unit: "grapheme", maxLength: 6 }).filter((s) => !s.includes("\u0000")),
      fc.constantFrom("NULL", "null", "", " ", '"', "\\", "{", "}", ",", "\t"),
    );
    const integer = fc.bigInt({ min: -(2n ** 63n), max: 2n ** 63n - 1n });
    const json: fc.Arbitrary<unknown> = fc.letrec<{ value: unknown }>((tie) => ({
      value: fc.oneof(
        { depthSize: "small" },
        integer.map((n) => (n >= -9007199254740991n && n <= 9007199254740991n ? Number(n) : n)),
        fc.boolean(),
        fc.constant(null),
        text,
        fc.array(tie("value"), { maxLength: 3 }),
        fc.dictionary(text, tie("value"), { maxKeys: 3 }),
      ),
    })).value;
    const row = fc.record({
      t: fc.option(text, { nil: null }),
      b: fc.option(fc.uint8Array({ maxLength: 8 }), { nil: null }),
      j: fc.option(fc.dictionary(text, json, { maxKeys: 4 }), { nil: null }),
      n: fc.option(integer.map(String), { nil: null }),
      a: fc.option(fc.array(fc.option(text, { nil: null }), { maxLength: 4 }), { nil: null }),
      i: fc.option(fc.array(fc.option(integer, { nil: null }), { maxLength: 4 }), { nil: null }),
      flag: fc.option(fc.boolean(), { nil: null }),
    });
    let runs = 0;
    await fc.assert(
      fc.asyncProperty(fc.array(row, { minLength: 1, maxLength: 5 }), async (rows) => {
        const write = (db: Database) =>
          db.transaction(async (tx) => {
            await tx.execute("DELETE FROM t.values");
            for (const [index, r] of rows.entries()) {
              await tx.execute("INSERT INTO t.values VALUES ($1, $2, $3, $4, $5, $6, $7, $8)", [
                BigInt(index),
                r.t,
                r.b,
                r.j,
                r.n,
                r.a,
                r.i,
                r.flag,
              ]);
            }
          });
        await Promise.all([write(pg.db), write(lite.db)]);
        const [onPostgres, onPglite] = await both((db) =>
          db.read((read) => read.query("SELECT * FROM t.values ORDER BY id")),
        );
        expect(onPglite).toEqual(onPostgres);
        expect(onPostgres).toEqual({
          result: rows.map((r, index) => ({ id: BigInt(index), ...r, b: r.b === null ? null : new Uint8Array(r.b) })),
        });
        runs++;
      }),
      { seed: SEED, numRuns: 120 },
    );
    expect(runs).toBe(120);
  }, 180_000);
});
