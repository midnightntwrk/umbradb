import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { encodeCanonical } from "../../src/determinism/cbor.js";
import { contentsHash } from "../../src/determinism/contents-hash.js";
import { ModuleContentsError, moduleTables } from "../../src/determinism/module-tables.js";
import {
  type CatalogTable,
  catalogRelations,
  catalogTables,
  type ConsistentRead,
  columnVerdict,
  databaseRefusals,
  numericScale,
  refusalMessage,
  tableRefusals,
} from "../../src/deterministic-postgresql/index.js";
import { DETERMINISM_BACKENDS } from "../determinism/backends.js";
import type { TestDatabase, TestServer } from "../determinism/postgres-database.js";

/**
 * The column-type rules and the refused non-deterministic columns and tables, read from a real catalog on PostgreSQL 18
 * (Testcontainers) and on PGlite 0.5.10. Also the contents-hash side of the refusals: the hash refuses what startup
 * refuses, with the same codes and the same messages, in every schema it hashes. [DT-6, A58, Q58, Q61, Q75]
 *
 * The startup check (`startup-check.test.ts`) calls the same `tableRefusals`, `databaseRefusals` and `refusalMessage`
 * with the module's id. [A58]
 *
 * Every expected code, location and phrase below is written by hand from the determinism rules; the code under test
 * is only compared with them, and the defaults it calls immutable or not are compared with PostgreSQL's own check (a
 * stored generated column must be immutable). The last section checks, through the same driver the hash reads with,
 * that the mechanisms the messages name are real. [DT-6; design §4]
 */

/** The backend's server while its suite runs: each backend's `describe` below starts and stops it. */
let server: TestServer;

const TYPES = `
  CREATE SCHEMA m;
  CREATE TYPE m.mood AS ENUM ('sad', 'ok');
  CREATE DOMAIN m.positive AS integer CHECK (VALUE > 0);
  CREATE TYPE m.pair AS (a integer, b text);
`;

async function freshDatabase(setup: string): Promise<TestDatabase> {
  const db = await server.create();
  await db.exec(setup);
  return db;
}

async function catalogTable(db: TestDatabase, schema: string, name: string): Promise<CatalogTable> {
  const found = (await db.read((read) => catalogTables(read))).find((t) => t.schema === schema && t.name === name);
  if (found === undefined) throw new Error(`no table ${schema}.${name}`);
  return found;
}

async function refusalOf(run: () => Promise<unknown>): Promise<ModuleContentsError> {
  try {
    await run();
  } catch (error) {
    if (error instanceof ModuleContentsError) return error;
    throw error;
  }
  throw new Error("expected a ModuleContentsError, but the read succeeded");
}

describe.each(DETERMINISM_BACKENDS)("on $name", (backend) => {
  beforeAll(async () => {
    server = await backend.start();
  }, 120_000);

  afterAll(async () => {
    await server?.stop();
  }, 60_000);

  describe("the rules read from the catalog", () => {
    // Each type the design table names, as a column; the rule each must fall under, written from the table's rows.
    const COLUMNS: readonly (readonly [string, string, string])[] = [
      ["c_smallint", "smallint", "integer"],
      ["c_integer", "integer", "integer"],
      ["c_bigint", "bigint", "integer"],
      ["c_serial", "serial", "integer"],
      ["c_numeric", "numeric", "numeric"],
      ["c_numeric_p", "numeric(10)", "numeric"],
      ["c_numeric_p0", "numeric(10,0)", "numeric"],
      ["c_numeric_neg", "numeric(5,-2)", "numeric"],
      ["c_numeric_ps", "numeric(38,2)", "numeric-scaled"],
      ["c_numeric_tiny", "numeric(3,5)", "numeric-scaled"],
      ["c_bytea", "bytea", "bytea"],
      ["c_text", "text", "text"],
      ["c_varchar", "varchar", "text"],
      ["c_varchar_n", "varchar(32)", "text"],
      ["c_uuid", "uuid", "uuid"],
      ["c_boolean", "boolean", "boolean"],
      ["c_jsonb", "jsonb", "jsonb"],
      ["a_integer", "integer[]", "array"],
      ["a_integer_2d", "integer[][]", "array"],
      ["a_varchar", "varchar(8)[]", "array"],
      ["a_numeric", "numeric(20)[]", "array"],
      ["a_uuid", "uuid[]", "array"],
      ["a_jsonb", "jsonb[]", "array"],
      ["c_real", "real", "floating-point"],
      ["c_double", "double precision", "floating-point"],
      ["c_float", "float", "floating-point"],
      ["c_timestamptz", "timestamptz", "timestamptz"],
      ["c_timestamptz_3", "timestamptz(3)", "timestamptz"],
      ["c_timestamp", "timestamp", "date-time"],
      ["c_date", "date", "date-time"],
      ["c_time", "time", "date-time"],
      ["c_timetz", "timetz", "date-time"],
      ["c_interval", "interval", "date-time"],
      ["c_json", "json", "json"],
      ["c_char", "char(4)", "char"],
      ["c_bpchar", "bpchar", "char"],
      ["c_money", "money", "money"],
      ["c_enum", "m.mood", "user-defined"],
      ["c_domain", "m.positive", "user-defined"],
      ["c_composite", "m.pair", "user-defined"],
      ["a_enum", "m.mood[]", "user-defined"],
      ["a_domain", "m.positive[]", "user-defined"],
      ["a_composite", "m.pair[]", "user-defined"],
      ["a_numeric_ps", "numeric(38,2)[]", "numeric-scaled"],
      ["a_timestamptz", "timestamptz[]", "array"],
      ["a_timestamp", "timestamp[]", "date-time"],
      ["a_interval", "interval[]", "date-time"],
      ["a_json", "json[]", "json"],
      ["c_range", "int4range", "other"],
      ["c_multirange", "int4multirange", "other"],
      ["a_range", "int4range[]", "other"],
      ["c_inet", "inet", "other"],
      ["c_bit", "bit(3)", "other"],
      ["c_xml", "xml", "other"],
      ["c_point", "point", "other"],
      ["c_tsvector", "tsvector", "other"],
      ["c_qchar", '"char"', "other"],
      ["c_name", "name", "other"],
      ["c_oidvector", "oidvector", "other"],
    ];

    it("puts each type the design table names under that row's rule", async () => {
      const db = await freshDatabase(`${TYPES}
        CREATE TABLE m.t (${COLUMNS.map(([name, type]) => `${name} ${type}`).join(", ")});
      `);
      const table = await catalogTable(db, "m", "t");
      expect(table.columns.map((c) => c.name)).toEqual(COLUMNS.map(([name]) => name));
      for (const [index, [name, declared, rule]] of COLUMNS.entries()) {
        expect(columnVerdict(table.columns[index] as CatalogTable["columns"][number]).rule.id, `${name} ${declared}`).toBe(
          rule,
        );
      }
      const byName = new Map(table.columns.map((c) => [c.name, c]));
      expect(byName.get("c_varchar_n")).toMatchObject({ type: "character varying", declaredType: "character varying(32)" });
      expect(byName.get("c_char")).toMatchObject({ type: "character", declaredType: "character(4)" });
      expect(byName.get("c_numeric_neg")).toMatchObject({ type: "numeric", declaredType: "numeric(5,-2)" });
      expect(byName.get("c_enum")).toMatchObject({ type: "m.mood", typeKind: "e", elementKind: null });
      expect(byName.get("a_domain")).toMatchObject({ type: "m.positive[]", typeKind: "b", elementKind: "d" });
      expect(byName.get("c_oidvector")).toMatchObject({ type: "oidvector", elementKind: null });
      expect(byName.get("c_integer")).toMatchObject({ typeModifier: -1, inPrimaryKey: false, keyPosition: null });
    }, 60_000);

    it("reads numeric's declared scale from atttypmod as format_type prints it, for every sign and size", async () => {
      const declared = ["numeric", "numeric(1)", "numeric(10)", "numeric(1000)"];
      for (const precision of [1, 5, 38, 1000]) {
        for (const scale of [-1000, -20, -2, -1, 0, 1, 2, 5, 20, 1000]) declared.push(`numeric(${precision},${scale})`);
      }
      const db = await freshDatabase(`
        CREATE SCHEMA m;
        CREATE TABLE m.t (${declared.map((type, i) => `c${i} ${type}`).join(", ")});
      `);
      const table = await catalogTable(db, "m", "t");
      for (const [index, column] of table.columns.entries()) {
        const written = declared[index] as string;
        const printed = /^numeric\((-?[0-9]+),(-?[0-9]+)\)$/.exec(column.declaredType);
        const expected = written === "numeric" ? null : Number(printed?.[2]);
        expect(numericScale(column.typeModifier), `${written} printed as ${column.declaredType}`).toBe(expected);
      }
    }, 60_000);

    it("knows the primary key's columns and their declared order", async () => {
      const db = await freshDatabase(`
        CREATE SCHEMA m;
        CREATE TABLE m.t (a text, b uuid, c boolean, d bigint, PRIMARY KEY (c, a, b));
      `);
      const table = await catalogTable(db, "m", "t");
      expect(table.columns.map((c) => [c.name, c.inPrimaryKey, c.keyPosition])).toEqual([
        ["a", true, 2],
        ["b", true, 3],
        ["c", true, 1],
        ["d", false, null],
      ]);
    }, 60_000);
  });

  describe("A58 (contents-hash half): the hash refuses what startup refuses, with the same code and message", () => {
    interface Case {
      readonly what: string;
      readonly table: string;
      readonly code: string;
      readonly column: string | null;
      readonly declaredType: string | null;
      /** Phrases the message must hold: what is refused, its mechanism, and what to use instead. */
      readonly says: readonly string[];
    }

    const COLUMN_TYPE = "this type cannot be stored in a module table";
    const KEY_TYPE = "this type cannot be part of a primary key";

    const CASES: readonly Case[] = [
      {
        what: "a table without a primary key",
        table: "CREATE TABLE m.t (k integer UNIQUE, v text)",
        code: "no-primary-key",
        column: null,
        declaredType: null,
        says: ["the table has no primary key", "hashed and digested in primary-key order", "add a primary key"],
      },
      {
        what: "a table without a primary key and with a refused column: the missing key first",
        table: "CREATE TABLE m.t (at timestamp, v text)",
        code: "no-primary-key",
        column: null,
        declaredType: null,
        says: ["the table has no primary key"],
      },
      {
        what: "a numeric key",
        table: "CREATE TABLE m.t (id numeric PRIMARY KEY, v text)",
        code: "unsupported-key-type",
        column: "id",
        declaredType: "numeric",
        says: [KEY_TYPE, "does not sort by value", "use bigint, or bytea holding a fixed-width big-endian unsigned value"],
      },
      {
        what: "a numeric(78,0) key, named with its declared type",
        table: "CREATE TABLE m.t (v text, id numeric(78,0) PRIMARY KEY)",
        code: "unsupported-key-type",
        column: "id",
        declaredType: "numeric(78,0)",
        says: [KEY_TYPE, "does not sort by value"],
      },
      {
        what: "a jsonb key",
        table: "CREATE TABLE m.t (doc jsonb PRIMARY KEY)",
        code: "unsupported-key-type",
        column: "doc",
        declaredType: "jsonb",
        says: [KEY_TYPE, "by kind, then size, then contents", "use a text or bytea key"],
      },
      {
        what: "an array key",
        table: "CREATE TABLE m.t (path bigint[] PRIMARY KEY)",
        code: "unsupported-key-type",
        column: "path",
        declaredType: "bigint[]",
        says: [KEY_TYPE, "element by element", "puts an array's length first", "use a composite primary key"],
      },
      {
        what: "a varchar array in a composite key",
        table: "CREATE TABLE m.t (h bigint, tags varchar(8)[], PRIMARY KEY (h, tags))",
        code: "unsupported-key-type",
        column: "tags",
        declaredType: "character varying(8)[]",
        says: [KEY_TYPE, "element by element"],
      },
      {
        what: "a numeric(38,2) column",
        table: "CREATE TABLE m.t (id bigint PRIMARY KEY, fee numeric(38,2))",
        code: "unsupported-column-type",
        column: "fee",
        declaredType: "numeric(38,2)",
        says: [
          COLUMN_TYPE,
          "100 → 100.00",
          "equal contents hashes mean equal query results",
          "integer smallest units",
        ],
      },
      {
        what: "a numeric(38,2)[] column",
        table: "CREATE TABLE m.t (id bigint PRIMARY KEY, fees numeric(38,2)[])",
        code: "unsupported-column-type",
        column: "fees",
        declaredType: "numeric(38,2)[]",
        says: [COLUMN_TYPE, "100 → 100.00"],
      },
      {
        what: "a timestamp column (DT-6's scenario: it holds no time zone; use timestamptz, written with Z)",
        table: "CREATE TABLE m.t (id bigint PRIMARY KEY, at timestamp)",
        code: "unsupported-column-type",
        column: "at",
        declaredType: "timestamp without time zone",
        says: [
          COLUMN_TYPE,
          "A timestamp holds no time zone",
          "2025-05-21 14:30:00 is 14:30Z in UTC and 18:30Z in New York",
          "use timestamptz, written with Z",
        ],
      },
      {
        what: "a timestamp key: refused as a column type, which no key can fix",
        table: "CREATE TABLE m.t (at timestamp(3) PRIMARY KEY)",
        code: "unsupported-column-type",
        column: "at",
        declaredType: "timestamp(3) without time zone",
        says: [COLUMN_TYPE, "holds no time zone", "use timestamptz, written with Z"],
      },
      {
        what: "a date column",
        table: "CREATE TABLE m.t (id bigint PRIMARY KEY, day date)",
        code: "unsupported-column-type",
        column: "day",
        declaredType: "date",
        says: [COLUMN_TYPE, "A date holds no time zone", "use timestamptz, written with Z", "2025-05-21T00:00:00Z"],
      },
      {
        what: "a time column",
        table: "CREATE TABLE m.t (id bigint PRIMARY KEY, opens time)",
        code: "unsupported-column-type",
        column: "opens",
        declaredType: "time without time zone",
        says: [COLUMN_TYPE, "is not an instant", "use timestamptz, written with Z", "bigint microseconds since midnight"],
      },
      {
        what: "a timetz column",
        table: "CREATE TABLE m.t (id bigint PRIMARY KEY, opens timetz)",
        code: "unsupported-column-type",
        column: "opens",
        declaredType: "time with time zone",
        says: [COLUMN_TYPE, "is not an instant", "use timestamptz, written with Z", "bigint microseconds since midnight"],
      },
      {
        what: "an interval column",
        table: "CREATE TABLE m.t (id bigint PRIMARY KEY, span interval)",
        code: "unsupported-column-type",
        column: "span",
        declaredType: "interval",
        says: [COLUMN_TYPE, "1 day and 24:00:00", "use timestamptz, written with Z", "store bigint microseconds"],
      },
      {
        what: "a timestamp[] column",
        table: "CREATE TABLE m.t (id bigint PRIMARY KEY, ats timestamp[])",
        code: "unsupported-column-type",
        column: "ats",
        declaredType: "timestamp without time zone[]",
        says: [COLUMN_TYPE, "holds no time zone"],
      },
      {
        what: "a json column",
        table: "CREATE TABLE m.t (id bigint PRIMARY KEY, doc json)",
        code: "unsupported-column-type",
        column: "doc",
        declaredType: "json",
        says: [COLUMN_TYPE, "keeps json's input text", "the drivers parse it", "read back equal", "use jsonb"],
      },
      {
        what: "a char(4) column",
        table: "CREATE TABLE m.t (id bigint PRIMARY KEY, code char(4))",
        code: "unsupported-column-type",
        column: "code",
        declaredType: "character(4)",
        says: [COLUMN_TYPE, "padded with spaces", "depends on how it is read", "use text or varchar(n)"],
      },
      {
        what: "a money column",
        table: "CREATE TABLE m.t (id bigint PRIMARY KEY, price money)",
        code: "unsupported-column-type",
        column: "price",
        declaredType: "money",
        says: [COLUMN_TYPE, "lc_monetary", "use bigint smallest units"],
      },
      {
        what: "an enum column",
        table: "CREATE TABLE m.t (id bigint PRIMARY KEY, mood m.mood)",
        code: "unsupported-column-type",
        column: "mood",
        declaredType: "m.mood",
        says: [COLUMN_TYPE, "user-defined", "live in the catalog, not in the row", "use the base type", "CHECK"],
      },
      {
        what: "a domain column",
        table: "CREATE TABLE m.t (id bigint PRIMARY KEY, n m.positive)",
        code: "unsupported-column-type",
        column: "n",
        declaredType: "m.positive",
        says: [COLUMN_TYPE, "user-defined", "use the base type"],
      },
      {
        what: "a composite column",
        table: "CREATE TABLE m.t (id bigint PRIMARY KEY, p m.pair)",
        code: "unsupported-column-type",
        column: "p",
        declaredType: "m.pair",
        says: [COLUMN_TYPE, "user-defined", "separate columns for a composite"],
      },
      {
        what: "an enum array column",
        table: "CREATE TABLE m.t (id bigint PRIMARY KEY, moods m.mood[])",
        code: "unsupported-column-type",
        column: "moods",
        declaredType: "m.mood[]",
        says: [COLUMN_TYPE, "user-defined"],
      },
      {
        what: "a range column",
        table: "CREATE TABLE m.t (id bigint PRIMARY KEY, heights int8range)",
        code: "unsupported-column-type",
        column: "heights",
        declaredType: "int8range",
        says: [COLUMN_TYPE, "No canonical encoding is defined", "smallint, integer, bigint", "character varying, uuid"],
      },
      {
        what: "an inet column (any other type)",
        table: "CREATE TABLE m.t (id bigint PRIMARY KEY, peer inet)",
        code: "unsupported-column-type",
        column: "peer",
        declaredType: "inet",
        says: [COLUMN_TYPE, "No canonical encoding is defined", "use one of the supported types"],
      },
      {
        what: "a real column",
        table: "CREATE TABLE m.t (id bigint PRIMARY KEY, price real)",
        code: "non-deterministic-column",
        column: "price",
        declaredType: "real",
        says: [COLUMN_TYPE, "approximate", "0.1 + 0.6", "0.7", "use integers in fixed units (bigint, numeric(p))"],
      },
      {
        what: "a double precision column",
        table: "CREATE TABLE m.t (id bigint PRIMARY KEY, price double precision)",
        code: "non-deterministic-column",
        column: "price",
        declaredType: "double precision",
        says: [COLUMN_TYPE, "approximate", "0.1 + 0.2", "0.30000000000000004", "use integers in fixed units"],
      },
      {
        what: "two refused columns: the first in column order",
        table: "CREATE TABLE m.t (id bigint PRIMARY KEY, b json, a money)",
        code: "unsupported-column-type",
        column: "b",
        declaredType: "json",
        says: [COLUMN_TYPE, "use jsonb"],
      },
    ];

    for (const c of CASES) {
      it(`refuses ${c.what}`, async () => {
        const db = await freshDatabase(`${TYPES}
          CREATE TABLE m.fine (k integer PRIMARY KEY);
          ${c.table};
        `);
        const error = await refusalOf(() => db.read((read) => contentsHash(read)));
        expect(error.reason).toBe(c.code);
        expect([error.schema, error.table, error.column, error.declaredType]).toEqual([
          "m",
          "t",
          c.column,
          c.declaredType,
        ]);
        // The location: the schema (standing in for the module at hash time), the table, the column and its type.
        const location =
          c.column === null ? 'table "m"."t": ' : `table "m"."t", column "${c.column}" (${c.declaredType}): `;
        expect(error.message.startsWith(`${c.code}: ${location}`), error.message).toBe(true);
        for (const phrase of c.says) expect(error.message).toContain(phrase);
        expect(error.message).toContain(" Instead, ");

        // The same message the startup check gives: the shared rules over the same catalog facts. [A58]
        const facts = await catalogTable(db, "m", "t");
        const [first] = tableRefusals(facts);
        expect(first?.code).toBe(c.code);
        expect(error.message).toBe(refusalMessage(first as NonNullable<typeof first>, { schema: "m", table: "t" }));
        // And the same refusal when only the table list is read.
        const listed = await refusalOf(() => db.read((read) => moduleTables(read)));
        expect(listed.message).toBe(error.message);
      }, 60_000);
    }

    it("controls: tables of every allowed type, keys included, are hashed", async () => {
      const db = await freshDatabase(`
        CREATE SCHEMA m;
        CREATE TABLE m.t (
          id uuid, flag boolean, name varchar(32), t text, b bytea, n numeric(38,0), n2 numeric(5,-2), n3 numeric,
          j jsonb, ai integer[], av varchar(8)[], au uuid[], ab boolean[], aj jsonb[], an numeric(10)[], s smallint,
          i integer, big bigint, at timestamptz, at3 timestamptz(3), ats timestamptz[], PRIMARY KEY (id, flag, name)
        );
        CREATE TABLE m.k (s smallint, i integer, big bigint, b bytea, t text, v varchar, z timestamptz,
                          PRIMARY KEY (s, i, big, b, t, v, z));
        INSERT INTO m.t VALUES ('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', true, 'x', 't', '\\x01', 12, 1200, 7,
          '{"a": 1}', '{1,2}', '{a,b}', '{a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11}', '{t,f}', ARRAY['{}'::jsonb], '{3}',
          1, 2, 3, '2025-05-21 14:30:00.123456+00', '2025-05-21 14:30:00.123+00', '{"2025-05-21 14:30:00+00",NULL}');
        INSERT INTO m.k VALUES (1, 2, 3, '\\x00', 'a', 'b', '2025-05-21 14:30:00+00');
      `);
      const hash = await db.read((read) => contentsHash(read));
      expect(hash.length).toBe(32);
      expect((await catalogTable(db, "m", "t")).columns.every((c) => columnVerdict(c).allowed)).toBe(true);
      expect((await catalogTable(db, "m", "k")).columns.every((c) => columnVerdict(c).allowed)).toBe(true);
    }, 60_000);

    it("A145: a bigint and a text column holding times are accepted (Q74)", async () => {
      const db = await freshDatabase(`
        CREATE SCHEMA m;
        CREATE TABLE m.t (at_ms bigint PRIMARY KEY, at_text text);
        INSERT INTO m.t VALUES (1747837800123, '2025-05-21T14:30:00.123Z');
      `);
      expect((await db.read((read) => contentsHash(read))).length).toBe(32);
    }, 60_000);
  });

  describe("A58 (contents-hash half), Q61: non-deterministic columns and tables, in every schema it hashes", () => {
    interface Case {
      readonly what: string;
      /** Run after `CREATE SCHEMA m` and a table the hash can read, `m.fine`. */
      readonly setup: string;
      readonly code: "non-deterministic-column" | "non-deterministic-table";
      readonly place: { readonly schema: string; readonly table?: string; readonly sequence?: string };
      readonly column: string | null;
      readonly declaredType: string | null;
      /** Phrases the message must hold: what is refused, why, and what to do instead. */
      readonly says: readonly string[];
      /** Phrases it must not hold: what in the default is immutable. */
      readonly saysNot?: readonly string[];
    }

    const DEFAULT = "the column's default is not immutable: it ";
    const EACH_MACHINE = "each machine, or each retry, gets a different value";
    const ON_DB_WRITE = "Instead, compute the value from the block in on-db-write.";
    const SEQUENCE_DRAW = "the column draws its values from a sequence: ";
    const NEVER_ROLLS_BACK = "never rolls back, so its next value depends on rolled-back and retried blocks";
    const FROM_THE_BLOCK = "Instead, derive keys from the block (height, transaction index).";
    const NEXTVAL = "its default calls nextval(), which PostgreSQL marks volatile";

    const CASES: readonly Case[] = [
      {
        what: "a now() default",
        setup: "CREATE TABLE m.t (id bigint PRIMARY KEY, at_ms bigint DEFAULT extract(epoch from now())::bigint)",
        code: "non-deterministic-column",
        place: { schema: "m", table: "t" },
        column: "at_ms",
        declaredType: "bigint",
        says: [DEFAULT, "calls now(), which PostgreSQL marks stable", EACH_MACHINE, ON_DB_WRITE],
      },
      {
        what: "the CURRENT_TIMESTAMP default of DT-6's scenario",
        setup:
          "CREATE TABLE m.t (id bigint PRIMARY KEY, at bigint DEFAULT extract(epoch from CURRENT_TIMESTAMP)::bigint)",
        code: "non-deterministic-column",
        place: { schema: "m", table: "t" },
        column: "at",
        declaredType: "bigint",
        says: [
          DEFAULT,
          "uses CURRENT_TIMESTAMP, an SQL value function",
          "each machine",
          "different value",
          ON_DB_WRITE,
        ],
      },
      {
        what: "a CURRENT_USER default, a value function inside an immutable cast",
        setup: "CREATE TABLE m.t (id bigint PRIMARY KEY, who text DEFAULT CURRENT_USER)",
        code: "non-deterministic-column",
        place: { schema: "m", table: "t" },
        column: "who",
        declaredType: "text",
        says: [DEFAULT, "uses CURRENT_USER, an SQL value function, which PostgreSQL treats as stable", EACH_MACHINE],
        saysNot: ["text()"],
      },
      {
        what: "a CURRENT_DATE default under an immutable operator, found by its value function alone",
        setup: "CREATE TABLE m.t (id bigint PRIMARY KEY, days integer DEFAULT (CURRENT_DATE - DATE '2020-01-01'))",
        code: "non-deterministic-column",
        place: { schema: "m", table: "t" },
        column: "days",
        declaredType: "integer",
        says: [DEFAULT, "uses CURRENT_DATE, an SQL value function"],
        saysNot: ["date_mi"],
      },
      {
        what: "a random() default",
        setup: "CREATE TABLE m.t (id bigint PRIMARY KEY, roll bigint DEFAULT (random() * 6)::bigint)",
        code: "non-deterministic-column",
        place: { schema: "m", table: "t" },
        column: "roll",
        declaredType: "bigint",
        says: [DEFAULT, "calls random(), which PostgreSQL marks volatile", ON_DB_WRITE],
      },
      {
        what: "a gen_random_uuid() key default",
        setup: "CREATE TABLE m.t (id uuid PRIMARY KEY DEFAULT gen_random_uuid(), v text)",
        code: "non-deterministic-column",
        place: { schema: "m", table: "t" },
        column: "id",
        declaredType: "uuid",
        says: [DEFAULT, "calls gen_random_uuid(), which PostgreSQL marks volatile", ON_DB_WRITE],
      },
      {
        what: "a nextval() default, before the sequence it draws from",
        setup: "CREATE SEQUENCE m.q; CREATE TABLE m.t (id bigint PRIMARY KEY DEFAULT nextval('m.q'))",
        code: "non-deterministic-column",
        place: { schema: "m", table: "t" },
        column: "id",
        declaredType: "bigint",
        says: [SEQUENCE_DRAW, NEXTVAL, NEVER_ROLLS_BACK, FROM_THE_BLOCK],
      },
      {
        what: "a serial key",
        setup: "CREATE TABLE m.t (id serial PRIMARY KEY, v text)",
        code: "non-deterministic-column",
        place: { schema: "m", table: "t" },
        column: "id",
        declaredType: "integer",
        says: [SEQUENCE_DRAW, NEXTVAL, "identity or serial column", NEVER_ROLLS_BACK, FROM_THE_BLOCK],
        saysNot: ["int4()"],
      },
      {
        what: "a bigserial column outside the key",
        setup: "CREATE TABLE m.t (k bigint PRIMARY KEY, n bigserial)",
        code: "non-deterministic-column",
        place: { schema: "m", table: "t" },
        column: "n",
        declaredType: "bigint",
        says: [SEQUENCE_DRAW, NEXTVAL],
      },
      {
        what: "an identity key, GENERATED ALWAYS",
        setup: "CREATE TABLE m.t (id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY, v text)",
        code: "non-deterministic-column",
        place: { schema: "m", table: "t" },
        column: "id",
        declaredType: "bigint",
        says: [
          SEQUENCE_DRAW,
          "it is an identity column (GENERATED ALWAYS AS IDENTITY)",
          NEVER_ROLLS_BACK,
          FROM_THE_BLOCK,
        ],
      },
      {
        what: "an identity column GENERATED BY DEFAULT",
        setup: "CREATE TABLE m.t (k bigint PRIMARY KEY, n integer GENERATED BY DEFAULT AS IDENTITY)",
        code: "non-deterministic-column",
        place: { schema: "m", table: "t" },
        column: "n",
        declaredType: "integer",
        says: [SEQUENCE_DRAW, "it is an identity column (GENERATED BY DEFAULT AS IDENTITY)"],
      },
      {
        what: "an operator's hand-made identity table in a schema no module declared (DT-6's scenario)",
        setup:
          "CREATE SCHEMA ops; CREATE TABLE ops.notes (id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY, body text)",
        code: "non-deterministic-column",
        place: { schema: "ops", table: "notes" },
        column: "id",
        declaredType: "bigint",
        says: [SEQUENCE_DRAW, "identity column", FROM_THE_BLOCK],
      },
      {
        what: "a sequence in a module schema",
        setup: "CREATE SEQUENCE m.counter",
        code: "non-deterministic-table",
        place: { schema: "m", sequence: "counter" },
        column: null,
        declaredType: null,
        says: [
          "a module schema cannot hold a sequence",
          "Module code can draw from a sequence at any time",
          "never rolls back",
          "Instead, derive values from the block (height, transaction index), and drop the sequence.",
        ],
      },
      {
        what: "an unlogged sequence in a module schema",
        setup: "CREATE UNLOGGED SEQUENCE m.counter",
        code: "non-deterministic-table",
        place: { schema: "m", sequence: "counter" },
        column: null,
        declaredType: null,
        says: ["a module schema cannot hold a sequence"],
      },
      {
        what: "an unlogged table (DT-6's scenario)",
        setup: "CREATE UNLOGGED TABLE m.t (id bigint PRIMARY KEY)",
        code: "non-deterministic-table",
        place: { schema: "m", table: "t" },
        column: null,
        declaredType: null,
        says: [
          "a module schema cannot hold an unlogged table",
          "PostgreSQL empties an unlogged table after a crash",
          "the cursor still records its blocks as committed",
          "Instead, make the table logged: create it without UNLOGGED, or run ALTER TABLE ... SET LOGGED.",
        ],
      },
      {
        what: "an unlogged partition of a logged partitioned table",
        setup: `CREATE TABLE m.t (k bigint PRIMARY KEY) PARTITION BY RANGE (k);
          CREATE TABLE m.t_0 PARTITION OF m.t FOR VALUES FROM (0) TO (10);
          CREATE UNLOGGED TABLE m.t_1 PARTITION OF m.t FOR VALUES FROM (10) TO (20)`,
        code: "non-deterministic-table",
        place: { schema: "m", table: "t_1" },
        column: null,
        declaredType: null,
        says: ["a module schema cannot hold an unlogged table"],
      },
      {
        what: "a conversion to timestamptz through its stable input function",
        setup: "CREATE TABLE m.t (id bigint PRIMARY KEY, c text DEFAULT (('now'::text)::timestamptz)::text)",
        code: "non-deterministic-column",
        place: { schema: "m", table: "t" },
        column: "c",
        declaredType: "text",
        says: [
          DEFAULT,
          "converts text to timestamp with time zone with timestamptz_in(), which PostgreSQL marks stable",
        ],
      },
      {
        what: "a conversion of a timestamptz constant through its stable output function",
        setup: "CREATE TABLE m.t (id bigint PRIMARY KEY, c text DEFAULT ('2020-01-01 00:00:00+00'::timestamptz)::text)",
        code: "non-deterministic-column",
        place: { schema: "m", table: "t" },
        column: "c",
        declaredType: "text",
        says: [
          DEFAULT,
          "converts timestamp with time zone to text with timestamptz_out(), which PostgreSQL marks stable",
        ],
      },
      {
        what: "a conversion of an array to text through array_out",
        setup: "CREATE TABLE m.t (id bigint PRIMARY KEY, c text DEFAULT (ARRAY[1, 2])::text)",
        code: "non-deterministic-column",
        place: { schema: "m", table: "t" },
        column: "c",
        declaredType: "text",
        says: [DEFAULT, "converts integer[] to text with array_out(), which PostgreSQL marks stable"],
      },
      {
        what: "an array coercion whose elements go through date_in",
        setup: `CREATE TABLE m.t (id bigint PRIMARY KEY,
          n integer DEFAULT array_length(ARRAY['2020-01-01']::text[]::date[], 1))`,
        code: "non-deterministic-column",
        place: { schema: "m", table: "t" },
        column: "n",
        declaredType: "integer",
        says: [DEFAULT, "converts text to date with date_in(), which PostgreSQL marks stable"],
      },
      {
        what: "a row comparison through a stable operator",
        setup: `CREATE TABLE m.t (id bigint PRIMARY KEY,
          b boolean DEFAULT (ROW('2020-01-01'::date, 1) < ROW('2020-01-01 00:00:00+00'::timestamptz, 2)))`,
        code: "non-deterministic-column",
        place: { schema: "m", table: "t" },
        column: "b",
        declaredType: "boolean",
        says: [DEFAULT, "calls date_lt_timestamptz(), which PostgreSQL marks stable"],
        saysNot: ["int4lt"],
      },
      {
        what: "an SQL/JSON constructor of a timestamptz",
        setup: `CREATE TABLE m.t (id bigint PRIMARY KEY,
          j jsonb DEFAULT JSON_OBJECT('a': '2020-01-01 00:00:00+00'::timestamptz RETURNING jsonb))`,
        code: "non-deterministic-column",
        place: { schema: "m", table: "t" },
        column: "j",
        declaredType: "jsonb",
        says: [
          "UmbraDB cannot tell that the column's default is immutable: it uses an SQL/JSON constructor",
          "the session's TimeZone",
          "refuses every such default",
        ],
      },
      {
        what: "a function of a module's own schema marked volatile",
        setup: `CREATE FUNCTION m.next_id() RETURNS bigint LANGUAGE sql VOLATILE AS 'SELECT 1::bigint';
          CREATE TABLE m.t (id bigint PRIMARY KEY DEFAULT m.next_id())`,
        code: "non-deterministic-column",
        place: { schema: "m", table: "t" },
        column: "id",
        declaredType: "bigint",
        says: [DEFAULT, "calls m.next_id(), which PostgreSQL marks volatile"],
      },
    ];

    const locationOf = (c: Case): string => {
      const relation =
        c.place.sequence === undefined
          ? `table "${c.place.schema}"."${c.place.table}"`
          : `sequence "${c.place.schema}"."${c.place.sequence}"`;
      return c.column === null ? relation : `${relation}, column "${c.column}" (${c.declaredType})`;
    };

    for (const c of CASES) {
      it(`refuses ${c.what}`, async () => {
        const db = await freshDatabase(`CREATE SCHEMA m; CREATE TABLE m.fine (k integer PRIMARY KEY); ${c.setup};`);
        const error = await refusalOf(() => db.read((read) => contentsHash(read)));
        expect(error.reason).toBe(c.code);
        expect([error.schema, error.table, error.sequence, error.column, error.declaredType]).toEqual([
          c.place.schema,
          c.place.table ?? null,
          c.place.sequence ?? null,
          c.column,
          c.declaredType,
        ]);
        expect(error.message.startsWith(`${c.code}: ${locationOf(c)}: `), error.message).toBe(true);
        for (const phrase of c.says) expect(error.message).toContain(phrase);
        for (const phrase of c.saysNot ?? []) expect(error.message).not.toContain(phrase);
        expect(error.message).toContain(" Instead, ");

        // The same message the startup check gives: the shared rules over the same catalog facts. [A58]
        const [first] = await db.read(async (read) =>
          databaseRefusals(await catalogTables(read), await catalogRelations(read)),
        );
        if (first === undefined) throw new Error("the catalog facts gave no refusal");
        expect(first.refusal.code).toBe(c.code);
        expect(error.message).toBe(refusalMessage(first.refusal, first.place));
        // And the same refusal when only the table list is read.
        const listed = await refusalOf(() => db.read((read) => moduleTables(read)));
        expect(listed.message).toBe(error.message);
      }, 60_000);
    }

    it("lists a serial column's refusal before its sequence's, and a column's refusals in a fixed order", async () => {
      const db = await freshDatabase(`
        CREATE SCHEMA m;
        CREATE TABLE m.t (id serial PRIMARY KEY, at timestamp DEFAULT now());
      `);
      // `at` is a `timestamp` (refused as a type, then for its default); a `timestamptz` is allowed. [Q74]
      const refusals = await db.read(async (read) =>
        databaseRefusals(await catalogTables(read), await catalogRelations(read)),
      );
      expect(refusals.map(({ refusal, place }) => [refusal.code, place, refusal.column?.name ?? null])).toEqual([
        ["non-deterministic-column", { schema: "m", table: "t" }, "id"],
        ["unsupported-column-type", { schema: "m", table: "t" }, "at"],
        ["non-deterministic-column", { schema: "m", table: "t" }, "at"],
        ["non-deterministic-table", { schema: "m", sequence: "t_id_seq" }, null],
      ]);
      const error = await refusalOf(() => db.read((read) => contentsHash(read)));
      expect(error.message.startsWith('non-deterministic-column: table "m"."t", column "id" (integer): ')).toBe(true);
    }, 60_000);

    it("reads identity, what each default does that is not immutable, sequences and unlogged tables", async () => {
      const db = await freshDatabase(`
        CREATE SCHEMA m;
        CREATE SCHEMA z;
        CREATE TABLE m.t (
          id bigint GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,
          at_ms bigint DEFAULT extract(epoch from now())::bigint,
          plain text DEFAULT 'abc',
          g bigint GENERATED ALWAYS AS (CASE WHEN true THEN id ELSE (random() * 10)::bigint END) STORED,
          n bigint
        );
        CREATE UNLOGGED TABLE z.scratch (k integer PRIMARY KEY);
        CREATE SEQUENCE z."B";
        CREATE SEQUENCE z.a;
        CREATE VIEW m.v AS SELECT 1 AS x;
        CREATE SEQUENCE public.outside;
        CREATE UNLOGGED TABLE public.outside_table (k integer PRIMARY KEY);
      `);
      const [tables, relations] = await db.read(async (read) => [
        await catalogTables(read),
        await catalogRelations(read),
      ]);
      const columns = new Map((tables.find((t) => t.name === "t")?.columns ?? []).map((c) => [c.name, c]));
      expect(columns.get("id")).toMatchObject({ identity: "by default", notImmutable: [] });
      expect(columns.get("at_ms")).toMatchObject({
        identity: null,
        notImmutable: [
          { does: "calls extract(), which PostgreSQL marks stable", drawsFromSequence: false },
          { does: "calls now(), which PostgreSQL marks stable", drawsFromSequence: false },
        ],
      });
      expect(columns.get("plain")).toMatchObject({ identity: null, notImmutable: [] });
      // A generated column's expression is no default, even when PostgreSQL's constant folding hides a random() in it.
      expect(columns.get("g")).toMatchObject({ identity: null, notImmutable: [] });
      expect(columns.get("n")).toMatchObject({ identity: null, notImmutable: [] });
      // Sequences and unlogged tables of module schemas (the identity's own sequence included), by bytes; not public's.
      expect(relations).toEqual([
        { schema: "m", name: "t_id_seq", kind: "S", persistence: "p", belongsTo: { schema: "m", table: "t" } },
        { schema: "z", name: "B", kind: "S", persistence: "p", belongsTo: null },
        { schema: "z", name: "a", kind: "S", persistence: "p", belongsTo: null },
        { schema: "z", name: "scratch", kind: "r", persistence: "u", belongsTo: { schema: "z", table: "scratch" } },
      ]);
    }, 60_000);

    it("controls: immutable defaults and stored generated columns are hashed; the schema public is not hashed", async () => {
      const db = await freshDatabase(`
        CREATE SCHEMA m;
        CREATE TABLE m.t (
          id bigint PRIMARY KEY,
          a text DEFAULT 'abc',
          b integer DEFAULT 1 + 2,
          c text DEFAULT lower('X'),
          d text DEFAULT (1 + 2)::text,
          e boolean DEFAULT (ROW(1, 2) < ROW(3, 4)),
          f boolean DEFAULT (1 = ANY (ARRAY[1, 2])),
          g jsonb DEFAULT '{"a": 1}'::jsonb,
          h bigint GENERATED ALWAYS AS (id * 2) STORED,
          i bigint GENERATED ALWAYS AS (CASE WHEN true THEN id ELSE (random() * 10)::bigint END) STORED,
          j text DEFAULT NULL,
          k uuid DEFAULT 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
          l text DEFAULT md5('x') COLLATE "C"
        );
        INSERT INTO m.t (id) VALUES (1), (2);
        CREATE SEQUENCE public.q;
        CREATE UNLOGGED TABLE public.scratch (k integer PRIMARY KEY);
        CREATE TABLE public.counted (id serial PRIMARY KEY, at timestamptz DEFAULT now());
      `);
      const hash = await db.read((read) => contentsHash(read));
      expect(hash.length).toBe(32);
      const [t] = await db.read((read) => catalogTables(read));
      expect(t?.columns.every((c) => c.identity === null && c.notImmutable.length === 0)).toBe(true);
      // The same table with a refused default is refused: the control above is not passing by reading nothing.
      await db.exec("ALTER TABLE m.t ALTER COLUMN a SET DEFAULT now()::text");
      expect((await refusalOf(() => db.read((read) => contentsHash(read)))).column).toBe("a");
    }, 60_000);

    // PostgreSQL's own check (contain_mutable_functions, which a stored generated column must pass) decides
    // "immutable" independently of the code under test. UmbraDB reads the default as stored and fails closed where
    // PostgreSQL decides from argument types or a jsonpath (SQL/JSON) or after folding constants: those divergences are
    // listed, and refused.
    it("refuses exactly the defaults PostgreSQL's check calls not immutable, except where it fails closed", async () => {
      const CORPUS: readonly (readonly [type: string, expression: string, divergence?: string])[] = [
        ["bigint", "extract(epoch from now())::bigint"],
        ["bigint", "extract(epoch from CURRENT_TIMESTAMP)::bigint"],
        ["text", "CURRENT_USER"],
        ["text", "CURRENT_SCHEMA"],
        ["integer", "CURRENT_DATE - DATE '2020-01-01'"],
        ["text", "(CURRENT_DATE)::text"],
        ["bigint", "(random() * 6)::bigint"],
        ["uuid", "gen_random_uuid()"],
        ["bigint", "nextval('public.q')"],
        ["text", "to_char(1, '999')"],
        ["bigint", "length(now()::text)"],
        ["text", "'abc'"],
        ["integer", "1 + 2"],
        ["text", "md5('x')"],
        ["numeric", "1.5 * 2"],
        ["text", "(1 + 2)::text"],
        ["text", "('2020-01-01 00:00:00+00'::timestamptz)::text"],
        ["text", "(('now'::text)::timestamptz)::text"],
        ["text", "(ARRAY[1, 2])::text"],
        ["integer", "array_length(ARRAY['2020-01-01']::text[]::date[], 1)"],
        ["boolean", "ROW('2020-01-01'::date, 1) < ROW('2020-01-01 00:00:00+00'::timestamptz, 2)"],
        ["boolean", "ROW(1, 2) < ROW(3, 4)"],
        ["boolean", "1 = ANY (ARRAY[1, 2])"],
        ["boolean", "'2020-01-01'::date = ANY (ARRAY['2020-01-01 00:00:00+00'::timestamptz])"],
        ["boolean", "'2020-01-01'::date IS DISTINCT FROM '2020-01-01 00:00:00+00'::timestamptz"],
        ["boolean", "NULLIF('2020-01-01'::date, '2020-01-01 00:00:00+00'::timestamptz) IS NULL"],
        ["text", "COALESCE(NULL, 'x')"],
        ["text", "('x'::text COLLATE \"C\")"],
        ["bigint", "GREATEST(1, 2)"],
        ["text", "CASE WHEN 1 > 2 THEN 'a' ELSE 'b' END"],
        ["jsonb", "'{\"a\": 1}'::jsonb"],
        ["jsonb", "jsonb_build_object('a', 1)"],
        ["jsonb", "JSON_OBJECT('a': '2020-01-01 00:00:00+00'::timestamptz RETURNING jsonb)"],
        ["jsonb", "JSON_OBJECT('a': 1 RETURNING jsonb)", "an SQL/JSON constructor: fails closed"],
        ["text", "JSON_VALUE(jsonb '{\"a\": \"x\"}', '$.a')", "an SQL/JSON query: fails closed"],
        ["bigint", "CASE WHEN true THEN 1 ELSE (random() * 10)::bigint END", "PostgreSQL folds constants first"],
      ];
      const columns = CORPUS.map(([type, expression], i) => `c${i} ${type} DEFAULT (${expression})`).join(", ");
      const db = await freshDatabase(`
        CREATE SCHEMA m;
        CREATE SEQUENCE public.q;
        CREATE TABLE m.t (id bigint PRIMARY KEY, ${columns});
      `);
      const [t] = await db.read((read) => catalogTables(read));
      const refusedColumns = new Set(
        tableRefusals(t as CatalogTable)
          .filter((refusal) => refusal.code === "non-deterministic-column")
          .map((refusal) => refusal.column?.name),
      );
      let immutableForPostgres = 0;
      for (const [index, [type, expression, divergence]] of CORPUS.entries()) {
        let postgresSaysImmutable = true;
        try {
          await db.exec(`CREATE TABLE m.g${index} (id bigint, c ${type} GENERATED ALWAYS AS (${expression}) STORED)`);
        } catch (error) {
          // 42P17: "generation expression is not immutable"; any other error means the probe itself is wrong.
          expect((error as { code?: string }).code, expression).toBe("42P17");
          postgresSaysImmutable = false;
        }
        if (postgresSaysImmutable) immutableForPostgres++;
        const refused = refusedColumns.has(`c${index}`);
        if (divergence === undefined) expect(refused, expression).toBe(!postgresSaysImmutable);
        else expect([refused, postgresSaysImmutable], `${expression}: ${divergence}`).toEqual([true, true]);
      }
      // Not vacuous: both verdicts occur, as often as the corpus was written to have them (counted by hand: 12
      // immutable and 21 not for both, and the 3 divergences, immutable for PostgreSQL and refused here).
      expect(immutableForPostgres).toBe(15);
      expect(refusedColumns.size).toBe(24);
    }, 120_000);
  });

  describe("the mechanisms the messages name, checked through the driver the hash reads with", () => {
    let db: TestDatabase;

    beforeAll(async () => {
      db = await freshDatabase(`
        CREATE SCHEMA m;
        CREATE TABLE m.times (k integer PRIMARY KEY, ts timestamptz, t timestamp, d date, ti time, tz timetz, iv interval);
        INSERT INTO m.times VALUES
          (1, '2026-10-23 10:00:00.123456+00', '2026-10-23 10:00:00.123456', '2026-10-23', '10:00:00.123456',
           '10:00:00.123456+02', '1 day 2 hours'),
          (2, '2026-10-23 10:00:00.123999+00', '2026-10-23 10:00:00.123999', '2026-10-23', '10:00:00.123999',
           '10:00:00.123999+02', '1 day 2 hours');
        CREATE TABLE m.docs (k integer PRIMARY KEY, j json);
        INSERT INTO m.docs VALUES (1, '{"b":1,  "a":2, "a":3}'), (2, '{"b": 1, "a": 3}');
        CREATE TABLE m.codes (k integer PRIMARY KEY, c char(4), f numeric(38,2));
        INSERT INTO m.codes VALUES (1, 'ab', 100);
      `);
    }, 60_000);

    const settings = (read: ConsistentRead, values: string) =>
      Promise.all(values.split(";").map((statement) => read.query(`SET LOCAL ${statement}`)));

    it("timestamps read back as text with their microseconds: .123456 and .123999 differ (DB-2, Q68)", async () => {
      const rows = await db.read((read) => read.query("SELECT ts, t FROM m.times ORDER BY k"));
      expect(rows).toEqual([
        { ts: "2026-10-23T10:00:00.123456Z", t: "2026-10-23T10:00:00.123456" },
        { ts: "2026-10-23T10:00:00.123999Z", t: "2026-10-23T10:00:00.123999" },
      ]);
    }, 60_000);

    it("a timestamp and a date hold no time zone: the same value is a different instant in each time zone", async () => {
      const instants = (zone: string) =>
        db.read(async (read) => {
          await settings(read, `TimeZone = '${zone}'`);
          const [row] = await read.query(`SELECT extract(epoch FROM '2025-05-21 14:30:00'::timestamp::timestamptz)::text AS t,
                                                 extract(epoch FROM '2025-05-21'::date::timestamptz)::text AS d`);
          return row;
        });
      // 14:30 in UTC, then in New York (EDT, UTC-4): 1747837800 and 1747852200 seconds since 1970.
      expect(await instants("UTC")).toEqual({ t: "1747837800.000000", d: "1747785600.000000" });
      expect(await instants("America/New_York")).toEqual({ t: "1747852200.000000", d: "1747800000.000000" });
    }, 60_000);

    it("interval: PostgreSQL compares months as 30 days and days as 24 hours, while equal values print differently", async () => {
      const [row] = await db.read((read) =>
        read.query(`SELECT '1 day'::interval = '24 hours'::interval AS day_is_24_hours,
                           '1 mon'::interval = '30 days'::interval AS month_is_30_days,
                           '1 day'::interval AS day, '24 hours'::interval AS hours`),
      );
      expect(row).toEqual({ day_is_24_hours: true, month_is_30_days: true, day: "1 day", hours: "24:00:00" });
    }, 60_000);

    it("date, timestamp and timestamptz text follow DateStyle and TimeZone; interval's follows IntervalStyle", async () => {
      const text = "SELECT ts::text AS ts, t::text AS t, d::text AS d, iv::text AS iv FROM m.times WHERE k = 1";
      const [iso] = await db.read((read) => read.query(text));
      const [other] = await db.read(async (read) => {
        await settings(read, "DateStyle = 'SQL, DMY'; TimeZone = 'Asia/Tokyo'; IntervalStyle = 'iso_8601'");
        return read.query(text);
      });
      expect(iso).toEqual({
        ts: "2026-10-23 10:00:00.123456+00",
        t: "2026-10-23 10:00:00.123456",
        d: "2026-10-23",
        iv: "1 day 02:00:00",
      });
      expect(other).toEqual({
        ts: "23/10/2026 19:00:00.123456 JST",
        t: "23/10/2026 10:00:00.123456",
        d: "23/10/2026",
        iv: "P1DT2H",
      });
    }, 60_000);

    it("Q59: time and timetz come back as text that no setting changes, interval as text too", async () => {
      const select = "SELECT ti, tz, iv FROM m.times WHERE k = 1";
      const [plain] = await db.read((read) => read.query(select));
      expect(plain).toEqual({ ti: "10:00:00.123456", tz: "10:00:00.123456+02", iv: "1 day 02:00:00" });
      for (const combination of [
        "DateStyle = 'SQL, DMY'; TimeZone = 'Asia/Tokyo'",
        "DateStyle = 'German'; TimeZone = 'America/New_York'",
        "DateStyle = 'Postgres, MDY'; IntervalStyle = 'sql_standard'",
      ]) {
        const [row] = await db.read(async (read) => {
          await settings(read, combination);
          return read.query("SELECT ti, tz FROM m.times WHERE k = 1");
        });
        expect(row, combination).toEqual({ ti: "10:00:00.123456", tz: "10:00:00.123456+02" });
      }
    }, 60_000);

    it("json: different stored texts read back equal", async () => {
      const rows = await db.read((read) => read.query("SELECT j, j::text AS text FROM m.docs ORDER BY k"));
      const [first, second] = rows as [Record<string, unknown>, Record<string, unknown>];
      expect(first.text).not.toBe(second.text);
      expect(first.j).toEqual(second.j);
      expect(first.j).toEqual({ b: 1, a: 3 });
    }, 60_000);

    it("char(4) reads padded, compares and casts without its spaces; numeric(38,2) prints two decimals", async () => {
      const [row] = await db.read((read) =>
        read.query("SELECT c, c::text AS text, c = 'ab' AS equal, f FROM m.codes WHERE k = 1"),
      );
      expect(row).toEqual({ c: "ab  ", text: "ab", equal: true, f: "100.00" });
    }, 60_000);

    it("Q60: 0.1 + 0.2 is not 0.3 in double precision but is in real, where 0.1 + 0.6 is not 0.7", async () => {
      const [row] = await db.read((read) =>
        read.query(`SELECT 0.1::float8 + 0.2::float8 AS double_sum, 0.1::float8 + 0.2::float8 = 0.3::float8 AS double_eq,
          0.1::real + 0.2::real = 0.3::real AS real_eq_02, (0.1::real + 0.6::real)::text AS real_sum,
          0.1::real + 0.6::real = 0.7::real AS real_eq_06`),
      );
      expect(row).toEqual({
        double_sum: 0.30000000000000004,
        double_eq: false,
        real_eq_02: true,
        real_sum: "0.70000005",
        real_eq_06: false,
      });
    }, 60_000);

    it("PostgreSQL's orders of numeric, jsonb and arrays are not the orders of their encoded bytes", async () => {
      const ordered = (sql: string) => db.read(async (read) => (await read.query(sql)).map((row) => row.v));
      // numeric by value: 9 before 10; its encoded text by bytes: "10" (31 30) before "9" (39).
      expect(await ordered("SELECT v FROM (VALUES (10::numeric), (9::numeric)) AS x(v) ORDER BY 1")).toEqual([
        "9",
        "10",
      ]);
      // jsonb: a string before a number; their encodings: 1 (01) before "a" (61 61).
      expect(await ordered(`SELECT v FROM (VALUES ('1'::jsonb), ('"a"'::jsonb)) AS x(v) ORDER BY 1`)).toEqual(["a", 1]);
      expect(Buffer.from(encodeCanonical(1)).compare(Buffer.from(encodeCanonical("a")))).toBeLessThan(0);
      // arrays element by element: {1,5} before {2}; their encodings put the length first: [2] (81 02) before [1, 5].
      expect(await ordered("SELECT v FROM (VALUES ('{2}'::int[]), ('{1,5}'::int[])) AS x(v) ORDER BY 1")).toEqual([
        [1, 5],
        [2],
      ]);
      expect(Buffer.from(encodeCanonical([2])).compare(Buffer.from(encodeCanonical([1, 5])))).toBeLessThan(0);
    }, 60_000);

    it("uuid comes back as PostgreSQL prints it: lowercase, hyphenated, whatever the input's form", async () => {
      const [row] = await db.read((read) =>
        read.query(`SELECT 'A0EEBC99-9C0B-4EF8-BB6D-6BB9BD380A11'::uuid AS a, '{a0eebc999c0b4ef8bb6d6bb9bd380a11}'::uuid AS b`),
      );
      expect(row).toEqual({ a: "a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11", b: "a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11" });
    }, 60_000);
  });
});
