import fc from "fast-check";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import type { Database, Row } from "../../src/db/api.js";
import { UmbraError } from "../../src/db/errors.js";
import { RESULT_TYPES } from "../../src/db/mapping.js";
import { BACKENDS } from "./backends.js";

/**
 * A9 (DB-2): query results map `bigint` → `bigint`, `bytea` → `Uint8Array`, `numeric` → decimal string, `jsonb` →
 * parsed JSON without loss; and the rest of the mapping (`src/db/mapping.ts`), arrays included — the NULL-element
 * cases of docs/issues/00006 — against a real server, on every backend of `backends.ts`.
 */

const SEED = 20261023;

for (const backend of BACKENDS) {
  describe(`A9 (DB-2) — result mapping on ${backend.name}`, () => {
    let db: Database;

    // The database's own defaults print every value differently from the API's settings: every test below reads
    // through connections that must override them (`bytea_output = escape` would break the bytea mapping).
    const HOSTILE_DEFAULTS: readonly (readonly [string, string])[] = [
      ["bytea_output", "escape"],
      ["DateStyle", "German, DMY"],
      ["IntervalStyle", "iso_8601"],
      ["TimeZone", "Asia/Tokyo"],
      ["extra_float_digits", "0"],
    ];

    beforeAll(async () => {
      await backend.start();
      const defaults = HOSTILE_DEFAULTS.map(
        ([name, value]) => `EXECUTE format('ALTER DATABASE %I SET ${name} = %L', current_database(), '${value}');`,
      );
      db = (
        await backend.database(`
          CREATE TYPE mood AS ENUM ('ok', 'sad');
          CREATE DOMAIN small AS integer;
          DO $$ BEGIN ${defaults.join(" ")} END $$;
        `)
      ).db;
    }, 180_000);

    afterAll(async () => {
      await backend.stop();
    }, 60_000);

    const one = async (sql: string, params?: unknown[]): Promise<Row> => {
      const rows = await db.read((read) => read.query(sql, params));
      expect(rows).toHaveLength(1);
      return rows[0] as Row;
    };

    it("maps bigint to bigint, bytea to Uint8Array, numeric to a decimal string, jsonb to parsed JSON", async () => {
      const row = await one(`SELECT 9223372036854775807::bigint AS max, (-9223372036854775807 - 1)::bigint AS min,
                                    '\\x00ff10'::bytea AS bytes, ''::bytea AS empty,
                                    340282366920938463463374607431768211456::numeric AS big, (-12.50)::numeric AS frac,
                                    'NaN'::numeric AS nan,
                                    '{"a": [1, "x", null, true, {"b": -1.5}]}'::jsonb AS doc`);
      expect(row.max).toBe(9223372036854775807n);
      expect(row.min).toBe(-9223372036854775808n);
      expect(row.bytes).toEqual(new Uint8Array([0, 255, 16]));
      expect(Object.getPrototypeOf(row.bytes)).toBe(Uint8Array.prototype);
      expect(row.empty).toEqual(new Uint8Array([]));
      expect(row.big).toBe("340282366920938463463374607431768211456");
      expect(row.frac).toBe("-12.50");
      expect(row.nan).toBe("NaN");
      expect(row.doc).toEqual({ a: [1, "x", null, true, { b: -1.5 }] });
    });

    it("reads the jsonb values 9007199254740992 and 9007199254740993 as two different bigints, and 42 as 42", async () => {
      const row = await one(`SELECT '9007199254740992'::jsonb AS a, '9007199254740993'::jsonb AS b, '42'::jsonb AS c,
                                    '{"n": -9007199254740993}'::jsonb AS d`);
      expect(row.a).toBe(9007199254740992n);
      expect(row.b).toBe(9007199254740993n);
      expect(row.a).not.toBe(row.b);
      expect(row.c).toBe(42);
      expect(row.d).toEqual({ n: -9007199254740993n });
    });

    it("maps the types design.md §4 refuses but a query can still return, as the drivers do", async () => {
      const row = await one(`SELECT true AS yes, 1::smallint AS s, 2::integer AS i, 26::oid AS o,
                                    0.1::real AS r, 'Infinity'::double precision AS d,
                                    'abc'::text AS t, 'abc'::varchar(5) AS v, 'ab'::char(4) AS c, 'n'::name AS n,
                                    'x'::"char" AS ch, 'FFFFFFFF-0000-0000-0000-0000000000AB'::uuid AS u,
                                    '{"n": 9007199254740993, "k": 1}'::json AS j,
                                    '2026-10-23'::date AS day, '2026-10-23 10:00:00.123456+00'::timestamptz AS at,
                                    now() AS now, '10:00:00'::time AS tm, '10:00:00+02'::timetz AS tz,
                                    '1 day 2 hours'::interval AS iv, 1.5::money AS m,
                                    'ok'::mood AS mood, 5::small AS dom, ROW(1, 'x') AS rec,
                                    '[1,3)'::int4range AS range, '192.168.0.1'::inet AS ip`);
      expect(row).toMatchObject({
        yes: true,
        s: 1,
        i: 2,
        o: 26,
        r: 0.1,
        d: Infinity,
        t: "abc",
        v: "abc",
        c: "ab  ",
        n: "n",
        ch: "x",
        u: "ffffffff-0000-0000-0000-0000000000ab",
        j: { n: 9007199254740993n, k: 1 },
        day: new Date("2026-10-23T00:00:00.000Z"),
        at: new Date("2026-10-23T10:00:00.123Z"),
        tm: "10:00:00",
        tz: "10:00:00+02",
        iv: "1 day 02:00:00",
        m: "$1.50",
        mood: "ok",
        dom: 5,
        rec: "(1,x)",
        range: "[1,3)",
        ip: "192.168.0.1",
      });
      expect(row.now).toBeInstanceOf(Date);
    });

    it("maps NULL to null for every named type and its array", async () => {
      const columns = RESULT_TYPES.flatMap((type, index) => [
        `NULL::${type.name} AS s${index}`,
        `NULL::${type.name}[] AS a${index}`,
      ]);
      const row = await one(`SELECT ${columns.join(", ")}`);
      expect(Object.values(row)).toHaveLength(columns.length);
      for (const value of Object.values(row)) expect(value).toBeNull();
    });

    it("reads a NULL array element as null, apart from false, 0, '' and the text 'NULL' (docs/issues/00006)", async () => {
      const row = await one(`SELECT ARRAY['x', NULL] AS null_element, ARRAY['x', 'NULL'] AS null_text,
                                    ARRAY[true, NULL, false] AS booleans, ARRAY[1, NULL, 0]::smallint[] AS smallints,
                                    ARRAY[1, NULL, 0] AS integers, ARRAY[9007199254740993, NULL, 0]::bigint[] AS bigints,
                                    ARRAY[1.5, NULL]::numeric[] AS numerics, ARRAY['\\x01'::bytea, NULL] AS byteas,
                                    ARRAY['{"a": 9007199254740993}'::jsonb, NULL, 'null'] AS jsonbs,
                                    ARRAY['', NULL] AS empties, ARRAY[0.5::real, NULL] AS reals,
                                    ARRAY['2026-10-23'::date, NULL] AS dates`);
      expect(row).toEqual({
        null_element: ["x", null],
        null_text: ["x", "NULL"],
        booleans: [true, null, false],
        smallints: [1, null, 0],
        integers: [1, null, 0],
        bigints: [9007199254740993n, null, 0n],
        numerics: ["1.5", null],
        byteas: [new Uint8Array([1]), null],
        jsonbs: [{ a: 9007199254740993n }, null, null],
        empties: ["", null],
        reals: [0.5, null],
        dates: [new Date("2026-10-23T00:00:00.000Z"), null],
      });
    });

    it("reads quoted elements, nested arrays, and arrays whose lower bound is not 1", async () => {
      const row = await one(`SELECT ARRAY['a"b', 'c\\d', 'e,f', '{g}', ' h ', 'NULL', 'null', ''] AS quoted,
                                    ARRAY[[1, 2], [3, NULL]] AS nested, '[0:1]={7,8}'::integer[] AS shifted,
                                    '{}'::text[] AS empty, ARRAY[ARRAY['x']] AS deep`);
      expect(row).toEqual({
        quoted: ['a"b', "c\\d", "e,f", "{g}", " h ", "NULL", "null", ""],
        nested: [
          [1, 2],
          [3, null],
        ],
        shifted: [7, 8],
        empty: [],
        deep: [["x"]],
      });
    });

    it("returns an array of a type the mapping does not name as its text", async () => {
      const row = await one(`SELECT ARRAY['ok', NULL]::mood[] AS moods, ARRAY['192.168.0.1'::inet] AS ips`);
      expect(row).toEqual({ moods: "{ok,NULL}", ips: "{192.168.0.1}" });
    });

    it("lists the types by the OIDs the server gives them", async () => {
      const names = RESULT_TYPES.map((type) => type.name);
      const rows = await db.read((read) =>
        read.query(
          `SELECT t.oid::integer AS oid, t.typarray::integer AS array_oid, format_type(t.oid, NULL) AS name
             FROM unnest($1::text[]) WITH ORDINALITY AS n(name, position)
             JOIN pg_type t ON t.oid = n.name::regtype ORDER BY n.position`,
          [names],
        ),
      );
      expect(rows.map((row) => [row.name, row.oid, row.array_oid])).toEqual(
        RESULT_TYPES.map((type) => [type.name, type.oid, type.arrayOid]),
      );
    });

    it("sends each kind of parameter as the value PostgreSQL reads back", async () => {
      const row = await one(
        `SELECT $1::bigint AS big, $2::bytea AS bytes, $3::jsonb AS doc, $4::integer[] AS ints, $5::text[] AS texts,
                $6::boolean AS flag, $7::timestamptz AS at, $8::numeric AS amount, $9::text AS nothing,
                $10::bytea[] AS blobs, $11::jsonb[] AS docs, $12::double precision AS half`,
        [
          9223372036854775807n,
          new Uint8Array([0, 1, 255]),
          { a: 9007199254740993n, b: ["x", null] },
          [1, null, -3],
          ['a"b', "c\\d", "NULL", "", " ", "{,}"],
          true,
          new Date("2026-10-23T10:00:00.123Z"),
          "-12.50",
          null,
          [new Uint8Array([1]), null],
          [{ k: 1 }, null],
          0.5,
        ],
      );
      expect(row).toEqual({
        big: 9223372036854775807n,
        bytes: new Uint8Array([0, 1, 255]),
        doc: { a: 9007199254740993n, b: ["x", null] },
        ints: [1, null, -3],
        texts: ['a"b', "c\\d", "NULL", "", " ", "{,}"],
        flag: true,
        at: new Date("2026-10-23T10:00:00.123Z"),
        amount: "-12.50",
        nothing: null,
        blobs: [new Uint8Array([1]), null],
        docs: [{ k: 1 }, null],
        half: 0.5,
      });
    });

    it("prints values with the same output settings on every connection, whatever the server's defaults", async () => {
      const settings = `SELECT current_setting('bytea_output') AS bytea_output, current_setting('DateStyle') AS date_style,
                               current_setting('IntervalStyle') AS interval_style, current_setting('TimeZone') AS time_zone,
                               current_setting('extra_float_digits') AS extra_float_digits`;
      const expected = {
        bytea_output: "hex",
        date_style: "ISO, MDY",
        interval_style: "postgres",
        time_zone: "UTC",
        extra_float_digits: "1",
      };
      expect(await one(settings)).toEqual(expected);
      expect(await db.transaction(async (tx) => (await tx.query(settings))[0])).toEqual(expected);
      // Control: the database's defaults are the hostile ones, so the values above come from the API's connections.
      const configured = await one(`SELECT s.setconfig AS config FROM pg_db_role_setting s
                                      JOIN pg_database d ON d.oid = s.setdatabase
                                     WHERE d.datname = current_database() AND s.setrole = 0`);
      expect([...(configured.config as string[])].sort()).toEqual(
        HOSTILE_DEFAULTS.map(([name, value]) => `${name}=${value}`).sort(),
      );
    });

    it("refuses a parameter it cannot send before running the statement", async () => {
      const error = await db.read((read) => read.query("SELECT $1::text AS v", [undefined])).catch((e: unknown) => e);
      expect(error).toBeInstanceOf(UmbraError);
      expect((error as UmbraError).code).toBe("invalid-parameter");
      expect((error as UmbraError).retryable).toBe(false);
    });

    it("round-trips random text and bigint arrays and jsonb documents through parameters (property, seed 20261023)", async () => {
      const text = fc.oneof(
        fc.string({ unit: "grapheme", maxLength: 6 }).filter((s) => !s.includes("\u0000")),
        fc.constantFrom("NULL", "null", "", " ", '"', "\\", "{", "}", ",", "\t"),
        fc.constant(null),
      );
      const bigints = fc.array(fc.oneof(fc.bigInt({ min: -(2n ** 63n), max: 2n ** 63n - 1n }), fc.constant(null)), {
        maxLength: 5,
      });
      const json = fc.dictionary(
        fc.string({ maxLength: 4 }).filter((s) => !s.includes("\u0000")),
        fc.oneof(
          fc.bigInt({ min: -(2n ** 63n), max: 2n ** 63n - 1n }).map((n) =>
            n >= -9007199254740991n && n <= 9007199254740991n ? Number(n) : n,
          ),
          fc.boolean(),
          fc.constant(null),
          fc.string({ maxLength: 4 }).filter((s) => !s.includes("\u0000")),
        ),
        { maxKeys: 4 },
      );
      await fc.assert(
        fc.asyncProperty(fc.array(text, { maxLength: 5 }), bigints, json, async (texts, numbers, doc) => {
          const row = await one("SELECT $1::text[] AS texts, $2::bigint[] AS numbers, $3::jsonb AS doc", [
            texts,
            numbers,
            doc,
          ]);
          expect(row).toEqual({ texts, numbers, doc });
        }),
        { seed: SEED, numRuns: 150 },
      );
    }, 120_000);
  });
}
