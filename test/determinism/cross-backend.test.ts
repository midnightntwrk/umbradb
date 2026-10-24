import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { contentsHash } from "../../src/determinism/contents-hash.js";
import { ModuleContentsError, moduleTables, rowsInKeyOrder } from "../../src/determinism/module-tables.js";
import { startPglite } from "./pglite-database.js";
import { startPostgres, type TestDatabase, type TestServer } from "./postgres-database.js";

/**
 * A55's cross-backend comparison (DT-3, DB-1; tasks 1.2 and 2.2): the same rows, written by the same SQL into a
 * PostgreSQL 17 database and a PGlite 0.5.10 database (PostgreSQL 18.6 inside), give the same contents hash — and the
 * two hashes are compared with each other, not only each with an expectation. Also compared directly: A54's row
 * orders (DT-2) and A58's refusal messages (DT-6), which the per-backend suites (`module-tables.test.ts`,
 * `column-refusals.test.ts`) check against hand-written expectations on each backend.
 *
 * The database holds every column type DT-1 encodes (and its array, with NULL elements), every key type DT-2 orders,
 * a composite key, a text key whose column collation (`und-x-icu`) orders differently from bytes, a partitioned table,
 * a dropped column, an empty table, schema and table names whose byte order differs from creation and locale order,
 * objects that are not module tables, and enough rows that every table larger than a page spans several. Since task
 * 2.2b (owner decision Q74) it holds `timestamptz` values, arrays and a `timestamptz` key column too, with fractions,
 * times before 1970 and values beyond 2^53 microseconds.
 */

const DATABASE = `
  CREATE SCHEMA "m_Z";
  CREATE SCHEMA m_a;
  CREATE SCHEMA "M";
  CREATE TABLE m_a.everything (
    id bigint PRIMARY KEY, s smallint, i integer, n numeric, n0 numeric(30), b bytea, t text, v varchar(12), u uuid,
    flag boolean, doc jsonb, s_a smallint[], i_a integer[], b_a bigint[], n_a numeric[], by_a bytea[], t_a text[],
    v_a varchar(4)[], u_a uuid[], f_a boolean[], d_a jsonb[], at timestamptz, at_a timestamptz[]
  );
  INSERT INTO m_a.everything
    SELECT g, (g % 32767)::smallint, g * 7919 - 50000, (g::numeric ^ 3)::numeric(40,0) * (CASE WHEN g % 2 = 0 THEN 1
           ELSE -1 END), (2::numeric ^ 90 + g)::numeric(30), decode(md5(g::text), 'hex'), repeat(chr(32 + g % 90), g % 9)
           || 'é' || chr(128512 + g % 5), left(md5(g::text), g % 13), md5(g::text)::uuid, g % 3 = 0,
           jsonb_build_object('g', g, 'big', 9007199254740993 + g, 'neg', -g, 'nested', jsonb_build_array(g::text,
             NULL, true, jsonb_build_object('é', g % 2 = 0)), 'k' || (g % 4), 'v'),
           ARRAY[g % 100, NULL]::smallint[], ARRAY[g, -g, NULL], ARRAY[9223372036854775807 - g, NULL],
           ARRAY[g::numeric, NULL], ARRAY[decode(lpad(to_hex(g), 4, '0'), 'hex'), NULL, ''::bytea],
           ARRAY['NULL', NULL, '', ' ', '"q"', 'a,b', '{c}', g::text], ARRAY['x' || g % 10, NULL]::varchar(4)[],
           ARRAY[md5((g + 1)::text)::uuid, NULL], ARRAY[g % 2 = 0, NULL],
           ARRAY[jsonb_build_object('a', g), NULL, 'null'::jsonb],
           '1969-12-31 23:59:59+00'::timestamptz + (g * 7919 - 50000) * interval '1 second 333 microseconds',
           ARRAY['9999-12-31 23:59:59.999999+00'::timestamptz - g * interval '1 day 1 microsecond', NULL,
                 '0001-01-01 00:00:00+00'::timestamptz + g * interval '1 microsecond']
      FROM generate_series(1, 1500) g;
  INSERT INTO m_a.everything (id) VALUES (0);
  CREATE TABLE m_a."Keys" (t text COLLATE "und-x-icu", b bytea, u uuid, f boolean, v varchar(3), s smallint,
                           z timestamptz, PRIMARY KEY (f, z, v, s, t, b, u));
  INSERT INTO m_a."Keys" (f, z, v, s, t, b, u)
    SELECT g % 2 = 0, '2025-05-21 14:30:00+00'::timestamptz + ((g / 2) % 4 - 1) * interval '500 milliseconds',
           chr(65 + g % 3) || chr(97 + g % 2), (g % 5 - 2)::smallint,
           (ARRAY['a', 'B', 'b', 'é', '', 'Z', 'a b'])[1 + g % 7], decode(lpad(to_hex(g % 300), 4, '0'), 'hex'),
           md5((g / 3)::text)::uuid
      FROM generate_series(1, 1200) g;
  CREATE TABLE "m_Z".t (k integer PRIMARY KEY, junk text, label text) PARTITION BY RANGE (k);
  CREATE TABLE "m_Z".t_low PARTITION OF "m_Z".t FOR VALUES FROM (MINVALUE) TO (0);
  CREATE TABLE "m_Z".t_high PARTITION OF "m_Z".t FOR VALUES FROM (0) TO (MAXVALUE);
  ALTER TABLE "m_Z".t DROP COLUMN junk;
  INSERT INTO "m_Z".t SELECT g, 'label ' || g FROM generate_series(-1100, 1100, 3) g;
  CREATE TABLE "m_Z"."T" (k bytea PRIMARY KEY);
  CREATE TABLE "M"."ü" (k text PRIMARY KEY, n integer);
  INSERT INTO "M"."ü" VALUES ('b', 1), ('B', 2), ('a', 3), ('', 4), ('é', 5);
  CREATE TABLE public.not_public (x integer PRIMARY KEY);
  INSERT INTO public.not_public VALUES (1);
  CREATE VIEW m_a.v AS SELECT 1 AS x;
`;

let postgres: TestServer;
let pglite: TestServer;
let onPostgres: TestDatabase;
let onPglite: TestDatabase;

beforeAll(async () => {
  [postgres, pglite] = await Promise.all([startPostgres(), startPglite()]);
  [onPostgres, onPglite] = await Promise.all([postgres.create(), pglite.create()]);
  await Promise.all([onPostgres.exec(DATABASE), onPglite.exec(DATABASE)]);
}, 180_000);

afterAll(async () => {
  await Promise.all([postgres?.stop(), pglite?.stop()]);
}, 60_000);

const hex = (bytes: Uint8Array): string => Buffer.from(bytes).toString("hex");
const hashOf = async (db: TestDatabase, pageSize?: number) =>
  hex(await db.read((read) => contentsHash(read, pageSize === undefined ? {} : { pageSize })));

describe("A55 (DT-3) — the same rows give the same contents hash on PostgreSQL 17 and PGlite 0.5.10", () => {
  it("[[determinism.contents-hash.cross-backend]] gives equal hashes on both backends, at several page sizes", async () => {
    const [tablesOnPostgres, tablesOnPglite] = await Promise.all([
      onPostgres.read((read) => moduleTables(read)),
      onPglite.read((read) => moduleTables(read)),
    ]);
    // Not vacuous: the fixture's five module tables, in DT-3's order, the same on both.
    expect(tablesOnPglite).toEqual(tablesOnPostgres);
    expect(tablesOnPostgres.map((t) => `${t.schema}.${t.name}`)).toEqual([
      "M.ü",
      "m_Z.T",
      "m_Z.t",
      "m_a.Keys",
      "m_a.everything",
    ]);
    const hashes: string[] = [];
    for (const pageSize of [7, 250, undefined]) {
      const [a, b] = await Promise.all([hashOf(onPostgres, pageSize), hashOf(onPglite, pageSize)]);
      expect(b, `page size ${pageSize ?? "default"}`).toBe(a);
      hashes.push(a);
    }
    expect(new Set(hashes).size).toBe(1);
  }, 120_000);

  it("negative control: one byte changed on one backend gives different hashes, and changing it back equal ones", async () => {
    const before = await hashOf(onPostgres);
    await onPglite.exec(`UPDATE m_a.everything SET b = set_byte(b, 15, get_byte(b, 15) # 1) WHERE id = 777`);
    const changed = await hashOf(onPglite);
    expect(changed).not.toBe(before);
    await onPglite.exec(`UPDATE m_a.everything SET b = set_byte(b, 15, get_byte(b, 15) # 1) WHERE id = 777`);
    expect(await hashOf(onPglite)).toBe(before);
    expect(await hashOf(onPostgres)).toBe(before);
  }, 120_000);
});

describe("A54 (DT-2) — the same rows in the same order on both backends", () => {
  it("lists every module table's rows in the same primary-key order and with the same values", async () => {
    const listAll = (db: TestDatabase) =>
      db.read(async (read) => {
        const all: Record<string, unknown[][]> = {};
        for (const table of await moduleTables(read)) {
          const rows: unknown[][] = [];
          for await (const row of rowsInKeyOrder(read, table, { pageSize: 100 })) rows.push(row);
          all[`${table.schema}.${table.name}`] = rows;
        }
        return all;
      });
    const [a, b] = await Promise.all([listAll(onPostgres), listAll(onPglite)]);
    expect(b).toEqual(a);
    // Not vacuous: the tables hold what the fixture wrote, and the composite text key is in byte order.
    expect(a["m_a.everything"]).toHaveLength(1501);
    expect(a["m_a.Keys"]).toHaveLength(1200);
    expect(a["m_Z.t"]).toHaveLength(734);
    expect(a["M.ü"]?.map((row) => row[0])).toEqual(["", "B", "a", "b", "é"]);
    // The timestamptz key column (second in the key, after f) by time, a fraction after its whole second.
    const falseFirst = (a["m_a.Keys"] ?? []).filter((row) => row[3] === false).map((row) => row[6]);
    expect(falseFirst.filter((z, index) => z !== falseFirst[index - 1])).toEqual([
      "2025-05-21T14:29:59.5Z",
      "2025-05-21T14:30:00Z",
      "2025-05-21T14:30:00.5Z",
      "2025-05-21T14:30:01Z",
    ]);
  }, 120_000);
});

describe("A58 (DT-6) — the same refusal, with the same message, on both backends", () => {
  const CASES: readonly (readonly [string, string])[] = [
    ["no primary key", "CREATE TABLE r.t (a integer)"],
    ["a now() default", "CREATE TABLE r.t (k integer PRIMARY KEY, at bigint DEFAULT extract(epoch from now()))"],
    ["a CURRENT_TIMESTAMP default", "CREATE TABLE r.t (k integer PRIMARY KEY, at timestamptz DEFAULT CURRENT_TIMESTAMP)"],
    ["a serial column", "CREATE TABLE r.t (k serial PRIMARY KEY)"],
    ["an identity column", "CREATE TABLE r.t (k bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY)"],
    ["a sequence", "CREATE SEQUENCE r.q; CREATE TABLE r.t (k integer PRIMARY KEY)"],
    ["an unlogged table", "CREATE UNLOGGED TABLE r.t (k integer PRIMARY KEY)"],
    ["a conversion through text", "CREATE TABLE r.t (k integer PRIMARY KEY, c text DEFAULT (('now'::text)::timestamptz)::text)"],
    ["a json column", "CREATE TABLE r.t (k integer PRIMARY KEY, j json)"],
    ["a numeric(38,2) column", "CREATE TABLE r.t (k integer PRIMARY KEY, fee numeric(38,2))"],
    ["a jsonb key", "CREATE TABLE r.t (k jsonb PRIMARY KEY)"],
    ["a timestamp column", "CREATE TABLE r.t (k integer PRIMARY KEY, at timestamp)"],
    ["an interval key", "CREATE TABLE r.t (k interval PRIMARY KEY)"],
    ["an infinite timestamptz", "CREATE TABLE r.t (k timestamptz PRIMARY KEY); INSERT INTO r.t VALUES ('-infinity')"],
  ];

  it("refuses each case with the same code and the same message on PostgreSQL 17 and PGlite 0.5.10", async () => {
    const refusal = async (server: TestServer, setup: string) => {
      const db = await server.create();
      await db.exec(`CREATE SCHEMA r; ${setup}`);
      try {
        await db.read((read) => contentsHash(read));
      } catch (error) {
        if (error instanceof ModuleContentsError) return { code: error.code, message: error.message };
        throw error;
      }
      throw new Error(`no refusal for: ${setup}`);
    };
    for (const [what, setup] of CASES) {
      const [a, b] = await Promise.all([refusal(postgres, setup), refusal(pglite, setup)]);
      expect(b, what).toEqual(a);
    }
  }, 120_000);
});
