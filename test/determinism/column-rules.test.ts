import { readdirSync, readFileSync } from "node:fs";
import { basename, join } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";
import { CanonicalEncodingError, type ColumnType, encodeRow, SCALAR_COLUMN_TYPES } from "../../src/determinism/cbor.js";
import {
  type Because,
  type CatalogFunction,
  catalogNeeds,
  COLUMN_TYPE_RULES,
  type ColumnFacts,
  columnVerdict,
  DEFAULT_DESIGN,
  type DefaultCatalog,
  type DefaultPart,
  type DefaultReference,
  databaseRefusals,
  defaultReferences,
  FUNCTION_ID_FIELDS,
  keyOrder,
  notImmutableParts,
  numericScale,
  parseExpressionTree,
  type Refusal,
  type RefusalPlace,
  type RelationFacts,
  refusalMessage,
  refusalOfTypeName,
  relationRefusals,
  TABLE_RULES,
  type TableFacts,
  type TableRule,
  type TreeNode,
  tableRefusals,
  type TypeRule,
  valueFailureBecause,
} from "../../src/determinism/column-rules.js";

/**
 * Tasks 1.3 and 1.4 (owner decisions Q58 to Q61): the column-type rules of DT-1, DT-2 and DT-6, and DT-6's
 * non-deterministic columns and tables, without a database.
 *
 * The rules take a plain, catalog-shaped description of a column (`format_type(atttypid, NULL)`, `format_type(atttypid,
 * atttypmod)`, `atttypmod`, `pg_type.typtype` of the type and of an array's element, whether the column is in the
 * primary key, `attidentity`, and what in its default is not immutable) and of a relation (`relkind`,
 * `relpersistence`), so the contents hash and task 7.1's migration-time check read the same facts and give the same
 * verdicts. The descriptions and expression trees below are written or copied by hand from what PostgreSQL 17.11
 * reports for each declaration (checked 2026-10-23; `column-refusals.test.ts` reads them from a real catalog). The last
 * section keeps the rules in step with `design.md` §4, their single source.
 */

function column(type: string, options: Partial<ColumnFacts> = {}): ColumnFacts {
  return {
    name: "c",
    type,
    declaredType: type,
    typeModifier: -1,
    typeKind: "b",
    elementKind: type.endsWith("[]") ? "b" : null,
    inPrimaryKey: false,
    identity: null,
    notImmutable: [],
    ...options,
  };
}

const key = (type: string, options: Partial<ColumnFacts> = {}): ColumnFacts =>
  column(type, { ...options, inPrimaryKey: true });

/** The rule a column falls under, by id, and the code when refused. */
function verdictOf(facts: ColumnFacts): [string, string | null] {
  const verdict = columnVerdict(facts);
  return [verdict.rule.id, verdict.allowed ? null : verdict.code];
}

function becauseOf(facts: ColumnFacts): Because {
  const verdict = columnVerdict(facts);
  if (verdict.allowed) throw new Error(`expected ${facts.declaredType} to be refused`);
  return verdict.because;
}

// The atttypmod PostgreSQL 17.11 stores for each declaration, as `format_type(atttypid, atttypmod)` prints it.
const NUMERIC_MODIFIERS: readonly (readonly [string, number])[] = [
  ["numeric(10,0)", 655364],
  ["numeric(38,2)", 2490374],
  ["numeric(5,-2)", 329730],
  ["numeric(3,5)", 196617],
  ["numeric(1000,1000)", 65537004],
  ["numeric(1000,-1000)", 65537052],
];

const VALUE_TYPES = [
  "smallint",
  "integer",
  "bigint",
  "numeric",
  "bytea",
  "text",
  "character varying",
  "uuid",
  "boolean",
  "jsonb",
] as const;

describe("DT-1 values: the types a public table may store", () => {
  it("allows exactly DT-1's types and their arrays, each encoded as itself", () => {
    for (const type of VALUE_TYPES) {
      for (const name of [type, `${type}[]`]) {
        const verdict = columnVerdict(column(name));
        expect(verdict.allowed, name).toBe(true);
        if (verdict.allowed) expect(verdict.encoding).toBe(name);
      }
    }
  });

  it("is the encoder's own list of column types", () => {
    const allowedScalars = COLUMN_TYPE_RULES.flatMap((rule) => (rule.allowed ? rule.types : []));
    expect([...allowedScalars].sort()).toEqual([...SCALAR_COLUMN_TYPES].sort());
    expect([...allowedScalars].sort()).toEqual([...VALUE_TYPES].sort());
    // Every allowed type, and its array, is a column type the encoder takes.
    for (const type of VALUE_TYPES) {
      expect(() => encodeRow([null, null], [type as ColumnType, `${type}[]` as ColumnType])).not.toThrow();
    }
  });

  it("reads numeric's declared scale from the type modifier, negative scales included", () => {
    expect(numericScale(-1)).toBeNull();
    for (const [declared, modifier] of NUMERIC_MODIFIERS) {
      const scale = Number(/,(-?[0-9]+)\)$/.exec(declared)?.[1]);
      expect(numericScale(modifier), declared).toBe(scale);
    }
  });

  it("allows a numeric without a declared scale above 0, and refuses one with a scale, its arrays too", () => {
    expect(verdictOf(column("numeric"))).toEqual(["numeric", null]);
    for (const [declared, typeModifier] of NUMERIC_MODIFIERS) {
      const scale = numericScale(typeModifier) as number;
      const expected = scale > 0 ? ["numeric-scaled", "unsupported-column-type"] : ["numeric", null];
      expect(verdictOf(column("numeric", { declaredType: declared, typeModifier })), declared).toEqual(expected);
      expect(verdictOf(column("numeric[]", { declaredType: `${declared}[]`, typeModifier })), declared).toEqual(
        scale > 0 ? expected : ["array", null],
      );
    }
    expect(becauseOf(column("numeric[]", { declaredType: "numeric(38,2)[]", typeModifier: 2490374 }))).toEqual(
      becauseOf(column("numeric", { declaredType: "numeric(38,2)", typeModifier: 2490374 })),
    );
  });

  it("refuses floating-point types with non-deterministic-column and an example that holds in each", () => {
    expect(verdictOf(column("real"))).toEqual(["floating-point", "non-deterministic-column"]);
    expect(verdictOf(column("double precision"))).toEqual(["floating-point", "non-deterministic-column"]);
    expect(verdictOf(column("real[]"))).toEqual(["floating-point", "non-deterministic-column"]);
    // Q60: 0.1 + 0.2 = 0.3 holds in real; 0.1 + 0.6 does not give 0.7 there.
    expect(becauseOf(column("double precision")).reason).toContain("0.1 + 0.2");
    expect(becauseOf(column("real")).reason).toContain("0.1 + 0.6");
    expect(becauseOf(column("real")).reason).not.toContain("0.1 + 0.2");
  });

  it("refuses every date and time type, each with the reason true for it (Q59)", () => {
    // Each reason names its type as the amended design row does (Q59: `timestamptz` and `timestamp`, `date`,
    // `interval`, `time` and `timetz`), so a reason can never be read as another type's.
    const cases: readonly (readonly [string, readonly string[], readonly string[]])[] = [
      [
        "timestamp with time zone",
        ["a timestamptz as", "JavaScript Date", "milliseconds only", "TimeZone", "DateStyle"],
        ["IntervalStyle"],
      ],
      [
        "timestamp without time zone",
        ["a timestamp as", "JavaScript Date", "milliseconds only", "DateStyle"],
        ["TimeZone"],
      ],
      ["date", ["a date as", "JavaScript Date", "DateStyle"], ["milliseconds only", "TimeZone", "IntervalStyle"]],
      ["interval", ["an interval as", "text", "IntervalStyle"], ["JavaScript Date", "DateStyle", "TimeZone"]],
      [
        "time without time zone",
        ["(time, timetz)", "no canonical encoding"],
        ["JavaScript Date", "DateStyle", "TimeZone"],
      ],
      [
        "time with time zone",
        ["(time, timetz)", "no canonical encoding"],
        ["JavaScript Date", "DateStyle", "TimeZone"],
      ],
    ];
    for (const [type, present, absent] of cases) {
      expect(verdictOf(column(type)), type).toEqual(["date-time", "unsupported-column-type"]);
      const { reason, alternative } = becauseOf(column(type));
      for (const text of present) expect(reason, type).toContain(text);
      for (const text of absent) expect(reason, type).not.toContain(text);
      expect(alternative, type).toContain("bigint milliseconds");
      expect(alternative, type).toContain("core_block_commit.blocks.block_timestamp_ms");
    }
    expect(verdictOf(column("timestamp with time zone[]"))).toEqual(["date-time", "unsupported-column-type"]);
  });

  it("gives a row with a reason per type a reason for each of its types, and only those", () => {
    for (const rule of COLUMN_TYPE_RULES) {
      if (rule.allowed || !("byType" in rule.because)) continue;
      expect(Object.keys(rule.because.byType).sort(), rule.id).toEqual([...rule.types].sort());
      for (const type of rule.types) expect(becauseOf(column(type)), type).toEqual(rule.because.byType[type]);
    }
  });

  it("refuses json, char(n) and money by name", () => {
    expect(verdictOf(column("json"))).toEqual(["json", "unsupported-column-type"]);
    expect(verdictOf(column("json[]"))).toEqual(["json", "unsupported-column-type"]);
    expect(verdictOf(column("character", { declaredType: "character(4)", typeModifier: 8 }))).toEqual([
      "char",
      "unsupported-column-type",
    ]);
    expect(verdictOf(column("character", { declaredType: "bpchar" }))).toEqual(["char", "unsupported-column-type"]);
    expect(verdictOf(column("money"))).toEqual(["money", "unsupported-column-type"]);
  });

  it("refuses enums, domains and composite types by their kind, whatever their name", () => {
    expect(verdictOf(column("m.mood", { typeKind: "e" }))).toEqual(["user-defined", "unsupported-column-type"]);
    expect(verdictOf(column("m.positive", { typeKind: "d" }))).toEqual(["user-defined", "unsupported-column-type"]);
    expect(verdictOf(column("m.pair", { typeKind: "c" }))).toEqual(["user-defined", "unsupported-column-type"]);
    // A domain over an array is a domain; arrays of user-defined types take their element's kind.
    expect(verdictOf(column("m.ints", { typeKind: "d" }))).toEqual(["user-defined", "unsupported-column-type"]);
    for (const kind of ["e", "d", "c"]) {
      expect(verdictOf(column("m.x[]", { elementKind: kind })), kind).toEqual(["user-defined", "unsupported-column-type"]);
    }
    // A domain whose name, in the search path, reads like an allowed type is still a domain.
    expect(verdictOf(column("text", { typeKind: "d" }))).toEqual(["user-defined", "unsupported-column-type"]);
    expect(verdictOf(column("text[]", { elementKind: "d" }))).toEqual(["user-defined", "unsupported-column-type"]);
  });

  it("refuses every other type: ranges, multiranges, network, bit-string, XML, geometric, full-text and the rest", () => {
    expect(verdictOf(column("int4range", { typeKind: "r" }))).toEqual(["other", "unsupported-column-type"]);
    expect(verdictOf(column("int4multirange", { typeKind: "m" }))).toEqual(["other", "unsupported-column-type"]);
    expect(verdictOf(column("int4range[]", { elementKind: "r" }))).toEqual(["other", "unsupported-column-type"]);
    for (const type of ["inet", "cidr", "bit", "bit varying", "xml", "point", "tsvector", '"char"', "name", "oid"]) {
      expect(verdictOf(column(type)), type).toEqual(["other", "unsupported-column-type"]);
    }
    // oidvector has an element type but no "[]" in format_type's name: it is not one of DT-1's arrays.
    expect(verdictOf(column("oidvector"))).toEqual(["other", "unsupported-column-type"]);
    // An array described without its element's kind is not taken for an array of an allowed type.
    expect(verdictOf(column("integer[]", { elementKind: null }))).toEqual(["other", "unsupported-column-type"]);
    expect(becauseOf(column("inet")).alternative).toContain("character varying");
  });
});

describe("DT-2 keys: the types a primary key may use, and how they are ordered", () => {
  it("orders integers numerically, boolean false first, bytea and uuid by bytes, text and varchar by bytes in C", () => {
    const orders: readonly (readonly [string, string])[] = [
      ["smallint", "numerically"],
      ["integer", "numerically"],
      ["bigint", "numerically"],
      ["boolean", "false-first"],
      ["bytea", "by-bytes"],
      ["uuid", "by-bytes"],
      ["text", "by-bytes-collate-c"],
      ["character varying", "by-bytes-collate-c"],
    ];
    for (const [type, order] of orders) {
      const verdict = columnVerdict(key(type));
      expect(verdict.allowed, type).toBe(true);
      if (verdict.allowed) expect(verdict.keyOrder, type).toBe(order);
      expect(keyOrder(type), type).toBe(order);
    }
    expect(keyOrder("numeric")).toBeNull();
    expect(keyOrder("jsonb")).toBeNull();
    expect(keyOrder("text[]")).toBeNull();
    // A column outside the key has no key order.
    const outside = columnVerdict(column("text"));
    expect(outside.allowed && outside.keyOrder).toBeNull();
  });

  it("refuses numeric, jsonb and array keys with unsupported-key-type, each with its own reason", () => {
    expect(verdictOf(key("numeric"))).toEqual(["numeric", "unsupported-key-type"]);
    expect(verdictOf(key("numeric", { declaredType: "numeric(10,0)", typeModifier: 655364 }))).toEqual([
      "numeric",
      "unsupported-key-type",
    ]);
    expect(verdictOf(key("jsonb"))).toEqual(["jsonb", "unsupported-key-type"]);
    expect(verdictOf(key("bigint[]"))).toEqual(["array", "unsupported-key-type"]);
    expect(verdictOf(key("text[]"))).toEqual(["array", "unsupported-key-type"]);
    expect(becauseOf(key("numeric")).reason).toContain("does not sort by value");
    expect(becauseOf(key("jsonb")).reason).toContain("by kind, then size, then contents");
    expect(becauseOf(key("bigint[]")).reason).toContain("element by element");
  });

  it("refuses a key column of a type no table may store with the value's code, not the key's", () => {
    expect(verdictOf(key("timestamp with time zone"))).toEqual(["date-time", "unsupported-column-type"]);
    expect(verdictOf(key("double precision"))).toEqual(["floating-point", "non-deterministic-column"]);
    expect(verdictOf(key("numeric", { declaredType: "numeric(38,2)", typeModifier: 2490374 }))).toEqual([
      "numeric-scaled",
      "unsupported-column-type",
    ]);
    expect(verdictOf(key("m.mood", { typeKind: "e" }))).toEqual(["user-defined", "unsupported-column-type"]);
  });
});

describe("DT-6 tables: every refusal of a table, in a fixed order", () => {
  const table = (columns: ColumnFacts[]): TableFacts => ({ schema: "m", name: "t", columns });

  it("refuses nothing in a table of allowed types with an allowed key", () => {
    expect(
      tableRefusals(
        table([
          key("uuid", { name: "id" }),
          key("boolean", { name: "shielded" }),
          column("character varying", { name: "v", declaredType: "character varying(32)", typeModifier: 36 }),
          column("numeric", { name: "n", declaredType: "numeric(38,0)", typeModifier: 2490372 }),
          column("jsonb[]", { name: "j" }),
        ]),
      ),
    ).toEqual([]);
  });

  it("lists no-primary-key first, then each refused column in column order", () => {
    const refusals = tableRefusals(
      table([
        column("timestamp with time zone", { name: "at" }),
        column("text", { name: "ok" }),
        column("real", { name: "price" }),
      ]),
    );
    expect(refusals.map((r) => [r.code, r.column?.name ?? null])).toEqual([
      ["no-primary-key", null],
      ["unsupported-column-type", "at"],
      ["non-deterministic-column", "price"],
    ]);
    expect(refusals[0]?.because).toEqual(TABLE_RULES.noPrimaryKey.because);
  });

  it("refuses a table without columns as one without a primary key", () => {
    expect(tableRefusals(table([])).map((r) => r.code)).toEqual(["no-primary-key"]);
  });

  it("names each refused column with its declared type", () => {
    const [refusal] = tableRefusals(
      table([key("numeric", { name: "id", declaredType: "numeric(20,0)", typeModifier: 1310724 })]),
    );
    expect(refusal?.code).toBe("unsupported-key-type");
    expect(refusal?.column).toEqual({ name: "id", declaredType: "numeric(20,0)" });
  });
});

describe("refusal messages: what, where, why, and what to use instead", () => {
  const timestamp: Refusal = {
    code: "unsupported-column-type",
    column: { name: "created_at", declaredType: "timestamp(3) with time zone" },
    what: "this type cannot be stored in a public table",
    because: becauseOf(column("timestamp with time zone")),
  };

  it("reads as one explanation for a developer who has never read DT-1", () => {
    expect(refusalMessage(timestamp, { schema: "shop", table: "orders" })).toBe(
      'unsupported-column-type: table "shop"."orders", column "created_at" (timestamp(3) with time zone): ' +
        "this type cannot be stored in a public table. " +
        "The drivers return a timestamptz as a JavaScript Date, which keeps milliseconds only " +
        "(10:00:00.123456 and 10:00:00.123999 read back equal), and its text depends on the TimeZone and DateStyle " +
        "settings. Instead, store bigint milliseconds since the epoch, as " +
        "core_block_commit.blocks.block_timestamp_ms does.",
    );
  });

  it("names the module first when one is given, as the migration-time check will", () => {
    expect(refusalMessage(timestamp, { module: "shop", schema: "shop", table: "orders" })).toBe(
      refusalMessage(timestamp, { schema: "shop", table: "orders" }).replace(
        "unsupported-column-type: table",
        'unsupported-column-type: module "shop", table',
      ),
    );
  });

  it("says what a refused key and a missing key are", () => {
    const [noKey] = tableRefusals({ schema: "m", name: "loose", columns: [column("integer", { name: "k" })] });
    expect(refusalMessage(noKey as Refusal, { schema: "m", table: "loose" })).toBe(
      'no-primary-key: table "m"."loose": the table has no primary key. ' +
        "Rows are hashed and digested in primary-key order, and without a key there is no order every database " +
        "agrees on. Instead, add a primary key whose columns are smallint, integer, bigint, bytea, text, character " +
        "varying, uuid or boolean.",
    );
    const [numericKey] = tableRefusals({ schema: "m", name: "t", columns: [key("numeric", { name: "id" })] });
    const message = refusalMessage(numericKey as Refusal, { schema: "m", table: "t" });
    expect(message.startsWith('unsupported-key-type: table "m"."t", column "id" (numeric): ')).toBe(true);
    expect(message).toContain("this type cannot be part of a primary key.");
    expect(message).toContain('"10" sorts before "9"');
    expect(message).toContain("Instead, use bigint, or bytea holding a fixed-width big-endian unsigned value.");
  });

  it("quotes identifiers as SQL does, so odd names stay readable", () => {
    const message = refusalMessage(
      { ...timestamp, column: { name: 'we"ird', declaredType: "date" } },
      { schema: "a b", table: "T" },
    );
    expect(message).toContain('table "a b"."T", column "we""ird" (date): ');
  });
});

describe("the encoder's refusals, by type name alone", () => {
  it("gives a refused type's own code and reason", () => {
    expect(refusalOfTypeName("json").code).toBe("unsupported-column-type");
    expect(refusalOfTypeName("json").because).toEqual(becauseOf(column("json")));
    expect(refusalOfTypeName("double precision").code).toBe("non-deterministic-column");
    expect(refusalOfTypeName("timestamp with time zone[]").because).toEqual(
      becauseOf(column("timestamp with time zone")),
    );
  });

  it("gives any other name the reason of 'any other type', which lists the names the encoder takes", () => {
    for (const name of ["inet", "varchar", "integer[][]", "m.mood"]) {
      const { code, because } = refusalOfTypeName(name);
      expect(code, name).toBe("unsupported-column-type");
      expect(because, name).toEqual(becauseOf(column("inet")));
    }
    for (const type of VALUE_TYPES) expect(refusalOfTypeName("varchar").because.alternative).toContain(type);
  });

  it("is what encodeRow throws for a column type outside DT-1", () => {
    for (const name of ["json", "double precision", "varchar", "money"]) {
      const { code, because } = refusalOfTypeName(name);
      let error: unknown;
      try {
        encodeRow([null], [name as ColumnType]);
      } catch (caught) {
        error = caught;
      }
      expect(error, name).toBeInstanceOf(CanonicalEncodingError);
      expect((error as CanonicalEncodingError).reason, name).toBe(code);
      expect((error as CanonicalEncodingError).message, name).toContain(because.reason);
      expect((error as CanonicalEncodingError).message, name).toContain(because.alternative);
    }
  });
});

describe("why a stored number cannot be hashed (DT-1, DT-6, Q57)", () => {
  it("explains numeric fractions and NaN, and jsonb numbers that are not 64-bit integers", () => {
    const numeric = valueFailureBecause("numeric", "numeric-fraction");
    expect(numeric?.reason).toContain("100.00");
    expect(numeric?.alternative).toBe("store integer smallest units in numeric(p) or bigint");
    expect(valueFailureBecause("numeric[]", "numeric-invalid")).toEqual(numeric);
    const json = valueFailureBecause("jsonb", "not-integer");
    expect(json?.reason).toContain("signed 64-bit range");
    expect(valueFailureBecause("jsonb[]", "integer-out-of-range")).toEqual(json);
  });

  it("explains nothing for failures no stored value can cause", () => {
    expect(valueFailureBecause("numeric", "type-mismatch")).toBeNull();
    expect(valueFailureBecause("jsonb", "unsupported-value")).toBeNull();
    expect(valueFailureBecause("bigint", "integer-out-of-range")).toBeNull();
    expect(valueFailureBecause("text", "lone-surrogate")).toBeNull();
  });
});

// ── task 1.4: defaults that are not immutable (DT-6, owner decision Q61) ────────────────────────────────────────────

/**
 * Default expression trees exactly as PostgreSQL 17.11 stores them (`pg_attrdef.adbin::text`, copied 2026-10-23 from
 * `postgres:17-alpine`; PGlite 0.5.10, PostgreSQL 18.6, stores the same node kinds and OIDs). The declaration of each
 * is in its key.
 */
const TREES = {
  // bigint DEFAULT extract(epoch from now())::bigint
  now:
    "{FUNCEXPR :funcid 1779 :funcresulttype 20 :funcretset false :funcvariadic false :funcformat 1 :funccollid 0 " +
    ":inputcollid 0 :args ({FUNCEXPR :funcid 6203 :funcresulttype 1700 :funcretset false :funcvariadic false " +
    ":funcformat 3 :funccollid 0 :inputcollid 100 :args ({CONST :consttype 25 :consttypmod -1 :constcollid 100 " +
    ":constlen -1 :constbyval false :constisnull false :location -1 :constvalue 9 [ 36 0 0 0 101 112 111 99 104 ]} " +
    "{FUNCEXPR :funcid 1299 :funcresulttype 1184 :funcretset false :funcvariadic false :funcformat 0 :funccollid 0 " +
    ":inputcollid 0 :args <> :location -1}) :location -1}) :location -1}",
  // bigint DEFAULT extract(epoch from CURRENT_TIMESTAMP)::bigint
  currentTimestamp:
    "{FUNCEXPR :funcid 1779 :funcresulttype 20 :funcretset false :funcvariadic false :funcformat 1 :funccollid 0 " +
    ":inputcollid 0 :args ({FUNCEXPR :funcid 6203 :funcresulttype 1700 :funcretset false :funcvariadic false " +
    ":funcformat 3 :funccollid 0 :inputcollid 100 :args ({CONST :consttype 25 :consttypmod -1 :constcollid 100 " +
    ":constlen -1 :constbyval false :constisnull false :location -1 :constvalue 9 [ 36 0 0 0 101 112 111 99 104 ]} " +
    "{SQLVALUEFUNCTION :op 3 :type 1184 :typmod -1 :location -1}) :location -1}) :location -1}",
  // text DEFAULT CURRENT_USER (the value function, of type name, inside the immutable cast text(name))
  currentUser:
    "{FUNCEXPR :funcid 406 :funcresulttype 25 :funcretset false :funcvariadic false :funcformat 2 :funccollid 950 " +
    ":inputcollid 950 :args ({SQLVALUEFUNCTION :op 10 :type 19 :typmod -1 :location -1}) :location -1}",
  // integer DEFAULT (CURRENT_DATE - DATE '2020-01-01') (an operator, date_mi, which is immutable)
  currentDate:
    "{OPEXPR :opno 1099 :opfuncid 1140 :opresulttype 23 :opretset false :opcollid 0 :inputcollid 0 :args " +
    "({SQLVALUEFUNCTION :op 0 :type 1082 :typmod -1 :location -1} {CONST :consttype 1082 :consttypmod -1 " +
    ":constcollid 0 :constlen 4 :constbyval true :constisnull false :location -1 :constvalue 4 " +
    "[ 137 28 0 0 0 0 0 0 ]}) :location -1}",
  // serial (an integer column whose default is nextval('m.t_d_ser_seq'::regclass), cast with int4(bigint))
  serial:
    "{FUNCEXPR :funcid 480 :funcresulttype 23 :funcretset false :funcvariadic false :funcformat 2 :funccollid 0 " +
    ":inputcollid 0 :args ({FUNCEXPR :funcid 1574 :funcresulttype 20 :funcretset false :funcvariadic false " +
    ":funcformat 0 :funccollid 0 :inputcollid 0 :args ({CONST :consttype 2205 :consttypmod -1 :constcollid 0 " +
    ":constlen 4 :constbyval true :constisnull false :location -1 :constvalue 4 [ 1 64 0 0 0 0 0 0 ]}) " +
    ":location -1}) :location -1}",
  // text DEFAULT (('now'::text)::timestamptz)::text: two conversions through input and output functions
  textToTimestamptzToText:
    "{COERCEVIAIO :arg {COERCEVIAIO :arg {CONST :consttype 25 :consttypmod -1 :constcollid 100 :constlen -1 " +
    ":constbyval false :constisnull false :location -1 :constvalue 7 [ 28 0 0 0 110 111 119 ]} :resulttype 1184 " +
    ":resultcollid 0 :coerceformat 1 :location -1} :resulttype 25 :resultcollid 100 :coerceformat 1 :location -1}",
  // text DEFAULT ((1 + 2))::text
  sumToText:
    "{COERCEVIAIO :arg {OPEXPR :opno 551 :opfuncid 177 :opresulttype 23 :opretset false :opcollid 0 :inputcollid 0 " +
    ":args ({CONST :consttype 23 :consttypmod -1 :constcollid 0 :constlen 4 :constbyval true :constisnull false " +
    ":location -1 :constvalue 4 [ 1 0 0 0 0 0 0 0 ]} {CONST :consttype 23 :consttypmod -1 :constcollid 0 " +
    ":constlen 4 :constbyval true :constisnull false :location -1 :constvalue 4 [ 2 0 0 0 0 0 0 0 ]}) :location -1} " +
    ":resulttype 25 :resultcollid 100 :coerceformat 1 :location -1}",
  // boolean DEFAULT (ROW('2020-01-01'::date, 1) < ROW('2020-01-01 00:00:00+00'::timestamptz, 2))
  rowCompare:
    "{ROWCOMPAREEXPR :rctype 1 :opnos (o 2358 97) :opfamilies (o 434 1976) :inputcollids (o 0 0) :largs " +
    "({CONST :consttype 1082 :consttypmod -1 :constcollid 0 :constlen 4 :constbyval true :constisnull false " +
    ":location -1 :constvalue 4 [ 137 28 0 0 0 0 0 0 ]} {CONST :consttype 23 :consttypmod -1 :constcollid 0 " +
    ":constlen 4 :constbyval true :constisnull false :location -1 :constvalue 4 [ 1 0 0 0 0 0 0 0 ]}) :rargs " +
    "({CONST :consttype 1184 :consttypmod -1 :constcollid 0 :constlen 8 :constbyval true :constisnull false " +
    ":location -1 :constvalue 8 [ 0 96 194 134 7 62 2 0 ]} {CONST :consttype 23 :consttypmod -1 :constcollid 0 " +
    ":constlen 4 :constbyval true :constisnull false :location -1 :constvalue 4 [ 2 0 0 0 0 0 0 0 ]})}",
  // jsonb DEFAULT JSON_OBJECT('a': 1 RETURNING jsonb): no function id (:func <>)
  jsonObject:
    "{JSONCONSTRUCTOREXPR :type 1 :args ({CONST :consttype 705 :consttypmod -1 :constcollid 0 :constlen -2 " +
    ":constbyval false :constisnull false :location -1 :constvalue 2 [ 97 0 ]} {CONST :consttype 23 :consttypmod -1 " +
    ":constcollid 0 :constlen 4 :constbyval true :constisnull false :location -1 :constvalue 4 [ 1 0 0 0 0 0 0 0 ]}) " +
    ":func <> :coercion <> :returning {JSONRETURNING :format {JSONFORMAT :format_type 2 :encoding 0 :location -1} " +
    ":typid 3802 :typmod -1} :absent_on_null false :unique false :location -1}",
  // text DEFAULT JSON_VALUE(jsonb '{"a":"2020-01-01"}', '$.a')
  jsonValue:
    "{JSONEXPR :op 2 :column_name <> :formatted_expr {CONST :consttype 3802 :consttypmod -1 :constcollid 0 " +
    ":constlen -1 :constbyval false :constisnull false :location -1 :constvalue 27 [ 108 0 0 0 1 0 0 32 1 0 0 128 " +
    "10 0 0 0 97 50 48 50 48 45 48 49 45 48 49 ]} :format {JSONFORMAT :format_type 0 :encoding 0 :location -1} " +
    ":path_spec {CONST :consttype 4072 :consttypmod -1 :constcollid 0 :constlen -1 :constbyval false " +
    ":constisnull false :location -1 :constvalue 30 [ 120 0 0 0 1 0 0 128 27 0 0 0 8 0 0 0 25 0 0 0 0 0 0 0 1 0 0 0 " +
    "97 0 ]} :returning {JSONRETURNING :format {JSONFORMAT :format_type 0 :encoding 0 :location -1} :typid 25 " +
    ":typmod -1} :passing_names <> :passing_values <> :on_empty {JSONBEHAVIOR :btype 0 :expr {CONST :consttype 23 " +
    ":consttypmod -1 :constcollid 0 :constlen 4 :constbyval true :constisnull true :location -1 :constvalue <>} " +
    ":coerce true :location -1} :on_error {JSONBEHAVIOR :btype 0 :expr {CONST :consttype 23 :consttypmod -1 " +
    ":constcollid 0 :constlen 4 :constbyval true :constisnull true :location -1 :constvalue <>} :coerce true " +
    ":location -1} :use_io_coercion false :use_json_coercion false :wrapper 0 :omit_quotes true :collation 100 " +
    ":location -1}",
  // date[] DEFAULT ARRAY['2020-01-01']::text[]::date[]: each element converted by date_in
  textArrayToDates:
    "{ARRAYCOERCEEXPR :arg {ARRAYEXPR :array_typeid 1009 :array_collid 100 :element_typeid 25 :elements ({CONST " +
    ":consttype 25 :consttypmod -1 :constcollid 100 :constlen -1 :constbyval false :constisnull false :location -1 " +
    ":constvalue 14 [ 56 0 0 0 50 48 50 48 45 48 49 45 48 49 ]}) :multidims false :location -1} :elemexpr " +
    "{COERCEVIAIO :arg {CASETESTEXPR :typeId 25 :typeMod -1 :collation 0} :resulttype 1082 :resultcollid 0 " +
    ":coerceformat 1 :location -1} :resulttype 1182 :resulttypmod -1 :resultcollid 0 :coerceformat 1 :location -1}",
} as const;

const references = (tree: string): DefaultReference[] => defaultReferences(parseExpressionTree(tree));

const fn = (name: string, volatility: string, nextval = false): CatalogFunction => ({ name, volatility, nextval });

/** What PostgreSQL 17.11's catalog says about the functions, operators and types the trees above use (2026-10-23). */
const CATALOG: DefaultCatalog = {
  functions: new Map([
    ["177", fn("int4pl()", "i")],
    ["406", fn("text()", "i")],
    ["480", fn("int4()", "i")],
    ["1140", fn("date_mi()", "i")],
    ["1299", fn("now()", "s")],
    ["1574", fn("nextval()", "v", true)],
    ["1598", fn("random()", "v")],
    ["1779", fn("int8()", "i")],
    ["6203", fn("extract()", "s")],
  ]),
  operators: new Map([
    ["97", fn("int4lt()", "i")],
    ["2358", fn("date_lt_timestamptz()", "s")],
  ]),
  types: new Map([
    ["23", { name: "integer", input: fn("int4in()", "i"), output: fn("int4out()", "i") }],
    ["25", { name: "text", input: fn("textin()", "i"), output: fn("textout()", "i") }],
    ["1082", { name: "date", input: fn("date_in()", "s"), output: fn("date_out()", "s") }],
    [
      "1184",
      { name: "timestamp with time zone", input: fn("timestamptz_in()", "s"), output: fn("timestamptz_out()", "s") },
    ],
  ]),
};

const parts = (tree: string): DefaultPart[] => notImmutableParts(references(tree), CATALOG);
const does = (tree: string): string[] => parts(tree).map((part) => part.does);

describe("default expression trees: what a default calls, read as PostgreSQL's own check reads it", () => {
  it("parses nodes, fields, lists, multi-token values and empty values", () => {
    const tree = parseExpressionTree("{A :x 1 :y <> :z (o 7 8) :w ({B :v 2} {C}) :c 4 [ 1 -2 ] :end x}");
    expect(tree.kind).toBe("A");
    expect([...tree.fields.keys()]).toEqual(["x", "y", "z", "w", "c", "end"]);
    expect(tree.fields.get("x")).toEqual(["1"]);
    expect(tree.fields.get("y")).toEqual(["<>"]);
    expect(tree.fields.get("z")).toEqual([{ list: ["o", "7", "8"] }]);
    expect(tree.fields.get("c")).toEqual(["4", "[", "1", "-2", "]"]);
    const [list] = tree.fields.get("w") ?? [];
    const kinds = typeof list === "object" && "list" in list ? list.list.map((node) => (node as TreeNode).kind) : [];
    expect(kinds).toEqual(["B", "C"]);
  });

  it("reads backslash-escaped characters as part of a token, never as structure", () => {
    const tree = parseExpressionTree("{A :name \\{not\\ a\\ node\\} :next 1 :odd :colon}");
    expect(tree.fields.get("name")).toEqual(["{not a node}"]);
    expect(tree.fields.get("next")).toEqual(["1"]);
    // A field's first item is its value whatever it looks like; only later items stop at the next ":field".
    expect(tree.fields.get("odd")).toEqual([":colon"]);
  });

  it("refuses text that is not one well-formed node", () => {
    const malformed = ["", "{", "{(}", "{A :x 1", "{A :x (1 2", "{A x 1}", "{A :x 1} trailing", "(1 2)", "{A :x (1 2}"];
    for (const text of [...malformed, "{A :x}", "{ :x 1}"]) {
      expect(() => parseExpressionTree(text), JSON.stringify(text)).toThrow(/expression tree/);
    }
  });

  it("refuses an OID that is not decimal digits, since OIDs are written into the catalog query", () => {
    expect(() => references("{FUNCEXPR :funcid 12x :args <>}")).toThrow(/"12x" is not an OID/);
    expect(() => references("{FUNCEXPR :funcid 1);DROP :args <>}")).toThrow(/expression tree/);
    expect(() => references("{COERCEVIAIO :arg {CONST :consttype 25} :resulttype <>}")).toThrow(/"<>" is not an OID/);
    expect(() => references("{COERCEVIAIO :arg {CONST :consttype 2x5} :resulttype 25}")).toThrow(/"2x5" is not an OID/);
    expect(() => references("{OPEXPR :opfuncid 0 :args <>}")).toThrow(/null is not an OID/);
    expect(() => references("{ROWCOMPAREEXPR :opnos (o 97 {CONST}) :largs <>}")).toThrow(/is not an OID/);
    // A row comparison without operators names none.
    expect(references("{ROWCOMPAREEXPR :opnos <> :largs <> :rargs <>}")).toEqual([]);
  });

  it("lists every function id, value function and conversion of PostgreSQL's trees, in tree order", () => {
    expect(references(TREES.now)).toEqual([
      { kind: "function", oid: "1779" },
      { kind: "function", oid: "6203" },
      { kind: "function", oid: "1299" },
    ]);
    expect(references(TREES.currentTimestamp)).toEqual([
      { kind: "function", oid: "1779" },
      { kind: "function", oid: "6203" },
      { kind: "value-function", op: 3 },
    ]);
    expect(references(TREES.currentUser)).toEqual([
      { kind: "function", oid: "406" },
      { kind: "value-function", op: 10 },
    ]);
    // An operator's function is its :opfuncid.
    expect(references(TREES.currentDate)).toEqual([
      { kind: "function", oid: "1140" },
      { kind: "value-function", op: 0 },
    ]);
    expect(references(TREES.serial)).toEqual([
      { kind: "function", oid: "480" },
      { kind: "function", oid: "1574" },
    ]);
  });

  it("reads a conversion through input and output functions (COERCEVIAIO) with the type it converts from", () => {
    // The outer conversion's argument is the inner one, whose type is its result type.
    expect(references(TREES.textToTimestamptzToText)).toEqual([
      { kind: "conversion", from: "1184", to: "25" },
      { kind: "conversion", from: "25", to: "1184" },
    ]);
    expect(references(TREES.sumToText)).toEqual([
      { kind: "conversion", from: "23", to: "25" },
      { kind: "function", oid: "177" },
    ]);
    // An array coercion converts each element: its element expression's argument is a placeholder of the element type.
    expect(references(TREES.textArrayToDates)).toEqual([{ kind: "conversion", from: "25", to: "1082" }]);
  });

  it("reads the type a conversion converts from for every kind of argument PostgreSQL's exprType knows", () => {
    const from = (arg: string): string | null => {
      const [first] = references(`{COERCEVIAIO :arg ${arg} :resulttype 25}`);
      return first?.kind === "conversion" ? first.from : null;
    };
    expect(from("{CONST :consttype 1184 :constvalue <>}")).toBe("1184");
    expect(from("{RELABELTYPE :arg {CONST :consttype 25} :resulttype 1043}")).toBe("1043");
    expect(from("{CASEEXPR :casetype 1082 :args <>}")).toBe("1082");
    expect(from("{COALESCEEXPR :coalescetype 1114 :args <>}")).toBe("1114");
    expect(from("{ARRAYEXPR :array_typeid 1007 :elements <>}")).toBe("1007");
    expect(from("{ROWEXPR :args <> :row_typeid 2249}")).toBe("2249");
    expect(from("{MINMAXEXPR :minmaxtype 1700 :args <>}")).toBe("1700");
    expect(from("{SQLVALUEFUNCTION :op 0 :type 1082 :typmod -1}")).toBe("1082");
    // Boolean-valued nodes, and nodes whose type is their argument's.
    expect(from("{BOOLEXPR :boolop 0 :args <>}")).toBe("16");
    expect(from("{NULLTEST :arg {CONST :consttype 23} :nulltesttype 0}")).toBe("16");
    expect(from("{COLLATEEXPR :arg {CONST :consttype 25} :collOid 950}")).toBe("25");
    const nested = "{COLLATEEXPR :arg {COLLATEEXPR :arg {OPEXPR :opno 1 :opfuncid 2 :opresulttype 1043} :collOid 1}}";
    expect(from(nested)).toBe("1043");
    // SQL/JSON nodes: the type they return.
    expect(from(TREES.jsonObject)).toBe("3802");
    expect(from(TREES.jsonValue)).toBe("25");
    // A kind whose type is not read (XMLEXPR) leaves the type undetermined, which fails closed (below).
    expect(from("{XMLEXPR :op 6 :name <> :args <>}")).toBeNull();
    expect(from("{COLLATEEXPR :collOid 950}")).toBeNull();
  });

  it("reads row comparisons by their operators, and an operator without its function id by the operator", () => {
    expect(references(TREES.rowCompare)).toEqual([
      { kind: "operator", oid: "2358" },
      { kind: "operator", oid: "97" },
    ]);
    // PostgreSQL's set_opfuncid: an operator node stored without its function id is read through pg_operator.
    expect(references("{OPEXPR :opno 2358 :opfuncid 0 :opresulttype 16 :args <>}")).toEqual([
      { kind: "operator", oid: "2358" },
    ]);
    expect(references("{SCALARARRAYOPEXPR :opno 96 :opfuncid 0 :hashfuncid 0 :negfuncid 0 :args <>}")).toEqual([
      { kind: "operator", oid: "96" },
    ]);
    // The planner's hash and negator function ids, when a tree carries them, are function ids too.
    expect(references("{SCALARARRAYOPEXPR :opno 96 :opfuncid 65 :hashfuncid 400 :negfuncid 401 :args <>}")).toEqual([
      { kind: "function", oid: "65" },
      { kind: "function", oid: "400" },
      { kind: "function", oid: "401" },
    ]);
  });

  it("marks the nodes PostgreSQL treats as not immutable without a function id", () => {
    expect(references("{NEXTVALUEEXPR :seqid 16390 :typeId 20}")).toEqual([{ kind: "next-value" }]);
    expect(references(TREES.jsonObject)).toEqual([{ kind: "sql-json", node: "constructor" }]);
    expect(references(TREES.jsonValue)).toEqual([{ kind: "sql-json", node: "query" }]);
  });

  it("asks the catalog for each function, operator and type once, in numeric order", () => {
    const all = [TREES.now, TREES.serial, TREES.rowCompare, TREES.textToTimestamptzToText, TREES.sumToText].flatMap(
      references,
    );
    expect(catalogNeeds(all)).toEqual({
      functions: ["177", "480", "1299", "1574", "1779", "6203"],
      operators: ["97", "2358"],
      types: ["23", "25", "1184"],
    });
    expect(catalogNeeds(references("{COERCEVIAIO :arg {XMLEXPR :op 6} :resulttype 25}"))).toEqual({
      functions: [],
      operators: [],
      types: ["25"],
    });
  });
});

describe("what in a default is not immutable, and why", () => {
  it("keeps only what PostgreSQL marks stable or volatile, in tree order", () => {
    expect(does(TREES.now)).toEqual([
      "calls extract(), which PostgreSQL marks stable",
      "calls now(), which PostgreSQL marks stable",
    ]);
    expect(does(TREES.currentTimestamp)).toEqual([
      "calls extract(), which PostgreSQL marks stable",
      "uses CURRENT_TIMESTAMP, an SQL value function, which PostgreSQL treats as stable",
    ]);
    // The cast text(name) is immutable; the value function inside it is not.
    expect(does(TREES.currentUser)).toEqual([
      "uses CURRENT_USER, an SQL value function, which PostgreSQL treats as stable",
    ]);
    expect(does(TREES.currentDate)).toEqual([
      "uses CURRENT_DATE, an SQL value function, which PostgreSQL treats as stable",
    ]);
    expect(does(TREES.rowCompare)).toEqual(["calls date_lt_timestamptz(), which PostgreSQL marks stable"]);
    expect(does(TREES.sumToText)).toEqual([]);
  });

  it("names the function a conversion calls: the result type's input, then the argument type's output", () => {
    expect(does(TREES.textToTimestamptzToText)).toEqual([
      "converts timestamp with time zone to text with timestamptz_out(), which PostgreSQL marks stable",
      "converts text to timestamp with time zone with timestamptz_in(), which PostgreSQL marks stable",
    ]);
    expect(does(TREES.textArrayToDates)).toEqual([
      "converts text to date with date_in(), which PostgreSQL marks stable",
    ]);
    // Both functions of one conversion, when neither is immutable.
    const dateToDate = notImmutableParts([{ kind: "conversion", from: "1082", to: "1082" }], CATALOG);
    expect(dateToDate.map((part) => part.does)).toEqual([
      "converts date to date with date_in(), which PostgreSQL marks stable",
      "converts date to date with date_out(), which PostgreSQL marks stable",
    ]);
  });

  it("marks what draws from a sequence: nextval() and an identity column's NEXTVALUEEXPR", () => {
    expect(parts(TREES.serial)).toEqual([
      { does: "calls nextval(), which PostgreSQL marks volatile", drawsFromSequence: true, undecided: false },
    ]);
    expect(notImmutableParts([{ kind: "next-value" }], CATALOG)).toEqual([
      { does: "draws from a sequence", drawsFromSequence: true, undecided: false },
    ]);
    expect(parts(TREES.now).every((part) => !part.drawsFromSequence && !part.undecided)).toBe(true);
  });

  // These are refused without knowing: PostgreSQL may call them immutable (`JSON_OBJECT('a': 1)` is), so they are
  // marked undecided, and a refusal made of them alone does not claim the default is not immutable.
  it("fails closed on SQL/JSON constructors and queries, and on a conversion from a type it cannot determine", () => {
    expect(parts(TREES.jsonObject)).toEqual([
      {
        does:
          "uses an SQL/JSON constructor (JSON_OBJECT, JSON_ARRAY, JSON, JSON_SCALAR or JSON_SERIALIZE), whose result " +
          "can depend on session settings (a timestamptz is written in the session's TimeZone); UmbraDB does not " +
          "check its arguments' types, so it refuses every such default",
        drawsFromSequence: false,
        undecided: true,
      },
    ]);
    expect(parts(TREES.jsonValue)).toEqual([
      {
        does:
          "uses JSON_VALUE, JSON_QUERY or JSON_EXISTS, whose result can depend on the session's TimeZone; UmbraDB " +
          "does not check its path, so it refuses every such default",
        drawsFromSequence: false,
        undecided: true,
      },
    ]);
    expect(notImmutableParts([{ kind: "conversion", from: null, to: "25" }], CATALOG)).toEqual([
      {
        does: "converts a value of a type UmbraDB cannot determine to text, through an output function it cannot check",
        drawsFromSequence: false,
        undecided: true,
      },
    ]);
  });

  it("names an SQL value function by its op, and one it does not know generically", () => {
    const named = (op: number) => notImmutableParts([{ kind: "value-function", op }], CATALOG)[0]?.does;
    expect(named(5)).toBe("uses LOCALTIME, an SQL value function, which PostgreSQL treats as stable");
    expect(named(14)).toBe("uses CURRENT_SCHEMA, an SQL value function, which PostgreSQL treats as stable");
    expect(named(15)).toBe("uses an SQL value function, which PostgreSQL treats as stable");
  });

  it("says each thing once", () => {
    const twice = [...references(TREES.now), ...references(TREES.now)];
    expect(notImmutableParts(twice, CATALOG).map((part) => part.does)).toEqual(does(TREES.now));
  });

  it("refuses to guess when the catalog does not list something the tree names", () => {
    expect(() => notImmutableParts([{ kind: "function", oid: "999999" }], CATALOG)).toThrow(/function 999999/);
    expect(() => notImmutableParts([{ kind: "operator", oid: "999999" }], CATALOG)).toThrow(/operator 999999/);
    expect(() => notImmutableParts([{ kind: "conversion", from: "25", to: "999999" }], CATALOG)).toThrow(/type 999999/);
  });
});

describe("DT-6 (Q61): identity, serial and non-immutable defaults refuse their column", () => {
  const NOW = parts(TREES.now);
  const SERIAL = parts(TREES.serial);
  const table = (columns: ColumnFacts[]): TableFacts => ({ schema: "m", name: "t", columns });

  it("refuses an identity column, ALWAYS or BY DEFAULT, as drawing from a sequence", () => {
    for (const [identity, clause] of [
      ["always", "GENERATED ALWAYS AS IDENTITY"],
      ["by default", "GENERATED BY DEFAULT AS IDENTITY"],
    ] as const) {
      const [refusal] = tableRefusals(table([key("bigint", { name: "id", identity })]));
      expect(refusal).toEqual({
        code: "non-deterministic-column",
        column: { name: "id", declaredType: "bigint" },
        what: `the column draws its values from a sequence: it is an identity column (${clause})`,
        because: TABLE_RULES.identityOrSerial.because,
      });
    }
  });

  it("refuses a serial column, whose default calls nextval(), as drawing from a sequence", () => {
    const [refusal] = tableRefusals(table([key("integer", { name: "id", notImmutable: SERIAL })]));
    expect(refusal).toEqual({
      code: "non-deterministic-column",
      column: { name: "id", declaredType: "integer" },
      what: "the column draws its values from a sequence: its default calls nextval(), which PostgreSQL marks volatile",
      because: TABLE_RULES.identityOrSerial.because,
    });
  });

  it("refuses a default that is not immutable, naming everything in it that is not", () => {
    const [refusal] = tableRefusals(
      table([key("bigint", { name: "id" }), column("bigint", { name: "at_ms", notImmutable: NOW })]),
    );
    expect(refusal).toEqual({
      code: "non-deterministic-column",
      column: { name: "at_ms", declaredType: "bigint" },
      what:
        "the column's default is not immutable: it calls extract(), which PostgreSQL marks stable; it calls now(), " +
        "which PostgreSQL marks stable",
      because: TABLE_RULES.nonImmutableDefault.because,
    });
  });

  it("lists a column's refusals in a fixed order: its type, its identity, a sequence draw, then the rest", () => {
    const mixed = [...SERIAL, ...NOW];
    const refusals = tableRefusals(
      table([
        key("bigint", { name: "id", identity: "always" }),
        column("timestamp with time zone", { name: "at", notImmutable: NOW }),
        column("bigint", { name: "n", notImmutable: mixed }),
      ]),
    );
    expect(refusals.map((r) => [r.column?.name, r.code, r.what.split(":")[0]])).toEqual([
      ["id", "non-deterministic-column", "the column draws its values from a sequence"],
      ["at", "unsupported-column-type", "this type cannot be stored in a public table"],
      ["at", "non-deterministic-column", "the column's default is not immutable"],
      ["n", "non-deterministic-column", "the column draws its values from a sequence"],
      ["n", "non-deterministic-column", "the column's default is not immutable"],
    ]);
    // The sequence draw and the rest of one default are said apart.
    expect(refusals[3]?.what).toBe(
      "the column draws its values from a sequence: its default calls nextval(), which PostgreSQL marks volatile",
    );
    expect(refusals[4]?.what).not.toContain("nextval");
  });

  it("says it cannot tell when everything refused in a default is refused without knowing", () => {
    const [undecided] = tableRefusals(
      table([key("bigint", { name: "id" }), column("jsonb", { name: "j", notImmutable: parts(TREES.jsonObject) })]),
    );
    expect(undecided?.what).toBe(
      "UmbraDB cannot tell that the column's default is immutable: it uses an SQL/JSON constructor (JSON_OBJECT, " +
        "JSON_ARRAY, JSON, JSON_SCALAR or JSON_SERIALIZE), whose result can depend on session settings (a " +
        "timestamptz is written in the session's TimeZone); UmbraDB does not check its arguments' types, so it " +
        "refuses every such default",
    );
    expect(undecided?.because).toEqual(TABLE_RULES.nonImmutableDefault.because);
    // With something PostgreSQL marks stable or volatile in it too, the default is not immutable, and says so.
    const [mixed] = tableRefusals(
      table([
        key("bigint", { name: "id" }),
        column("jsonb", { name: "j", notImmutable: [...NOW, ...parts(TREES.jsonValue)] }),
      ]),
    );
    expect(mixed?.what.startsWith("the column's default is not immutable: it calls extract(), ")).toBe(true);
    expect(mixed?.what.endsWith("; it uses JSON_VALUE, JSON_QUERY or JSON_EXISTS, whose result can depend on the " +
      "session's TimeZone; UmbraDB does not check its path, so it refuses every such default")).toBe(true);
  });

  it("allows a column without a default, with an immutable one, or with a generated expression (no default)", () => {
    expect(tableRefusals(table([key("bigint", { name: "id" }), column("text", { notImmutable: [] })]))).toEqual([]);
  });

  it("reads as one explanation: where, what, why, and what to do instead", () => {
    const place = { schema: "m", table: "t" };
    const [serial] = tableRefusals(table([key("integer", { name: "id", notImmutable: SERIAL })]));
    expect(refusalMessage(serial as Refusal, place)).toBe(
      'non-deterministic-column: table "m"."t", column "id" (integer): the column draws its values from a sequence: ' +
        "its default calls nextval(), which PostgreSQL marks volatile. A sequence, such as the one behind an " +
        "identity or serial column, never rolls back, so its next value depends on rolled-back and retried blocks, " +
        "not only on the chain. Instead, derive keys from the block (height, transaction index).",
    );
    const [atMs] = tableRefusals(
      table([key("bigint", { name: "id" }), column("bigint", { name: "at_ms", notImmutable: NOW })]),
    );
    expect(refusalMessage(atMs as Refusal, place)).toBe(
      'non-deterministic-column: table "m"."t", column "at_ms" (bigint): the column\'s default is not immutable: it ' +
        "calls extract(), which PostgreSQL marks stable; it calls now(), which PostgreSQL marks stable. PostgreSQL " +
        "evaluates a default on each insert, and when the default calls a function PostgreSQL marks stable or " +
        "volatile (now(), random(), gen_random_uuid()) or uses an SQL value function (CURRENT_TIMESTAMP, " +
        "CURRENT_USER), each machine, or each retry, gets a different value. Instead, compute the value from the " +
        "block in on-db-write.",
    );
  });
});

describe("DT-6 (Q61): sequences and unlogged tables refuse their public schema", () => {
  const relation = (kind: string, persistence: string, name = "r"): RelationFacts => ({
    schema: "m",
    name,
    kind,
    persistence,
  });

  it("refuses every sequence, logged or not, and every unlogged table or partitioned table", () => {
    for (const persistence of ["p", "u"]) {
      expect(relationRefusals(relation("S", persistence))).toEqual([
        {
          code: "non-deterministic-table",
          column: null,
          what: TABLE_RULES.sequence.what,
          because: TABLE_RULES.sequence.because,
        },
      ]);
    }
    for (const kind of ["r", "p"]) {
      expect(relationRefusals(relation(kind, "u"))).toEqual([
        {
          code: "non-deterministic-table",
          column: null,
          what: TABLE_RULES.unloggedTable.what,
          because: TABLE_RULES.unloggedTable.because,
        },
      ]);
      expect(relationRefusals(relation(kind, "p"))).toEqual([]);
    }
  });

  it("places a sequence as a sequence and an unlogged table as a table, after every table's own refusals", () => {
    const tables: TableFacts[] = [
      { schema: "a", name: "t", columns: [key("bigint", { name: "id", identity: "always" })] },
      { schema: "b", name: "fine", columns: [key("bigint", { name: "id" })] },
    ];
    const relations = [
      { schema: "a", name: "t_id_seq", kind: "S", persistence: "p" },
      { schema: "b", name: "scratch", kind: "r", persistence: "u" },
    ];
    expect(databaseRefusals(tables, relations).map(({ refusal, place }) => [refusal.code, place])).toEqual([
      ["non-deterministic-column", { schema: "a", table: "t" }],
      ["non-deterministic-table", { schema: "a", sequence: "t_id_seq" }],
      ["non-deterministic-table", { schema: "b", table: "scratch" }],
    ]);
    expect(databaseRefusals([tables[1] as TableFacts], [])).toEqual([]);
  });

  it("reads as one explanation, naming the sequence by its schema and name", () => {
    const [sequence] = databaseRefusals([], [relation("S", "p", "counter")]);
    expect(refusalMessage(sequence?.refusal as Refusal, sequence?.place as RefusalPlace)).toBe(
      'non-deterministic-table: sequence "m"."counter": a public schema cannot hold a sequence. Module code can draw ' +
        "from a sequence at any time, and a sequence never rolls back, so its values depend on rolled-back and " +
        "retried blocks, not only on the chain. Instead, derive values from the block (height, transaction index), " +
        "and drop the sequence.",
    );
    expect(
      refusalMessage(sequence?.refusal as Refusal, { module: "shop", schema: "m", sequence: "counter" }).startsWith(
        'non-deterministic-table: module "shop", sequence "m"."counter": ',
      ),
    ).toBe(true);
    const [unlogged] = databaseRefusals([], [relation("r", "u", "scratch")]);
    expect(refusalMessage(unlogged?.refusal as Refusal, unlogged?.place as RefusalPlace)).toBe(
      'non-deterministic-table: table "m"."scratch": a public schema cannot hold an unlogged table. PostgreSQL ' +
        "empties an unlogged table after a crash, while the cursor still records its blocks as committed, so the " +
        "table loses rows the chain still holds. Instead, make the table logged: create it without UNLOGGED, or run " +
        "ALTER TABLE ... SET LOGGED.",
    );
  });
});

// ── design.md §4's column-type table: the single source of every reason and alternative ─────────────────────────────

/**
 * The table is found by its heading paragraph anywhere under `openspec/`, not by the change's folder, so it is still
 * found after `openspec archive` moves the change to `openspec/changes/archive/<date>-core-arch/`. It must be found
 * exactly once: a later change that copies or revises the table must point this test at the table it keeps.
 */
const MARKER = "**Column types (Q58).**";
const HEADER = "| Type | As a value | As a key | Refused because / use instead |";
const REPOSITORY = fileURLToPath(new URL("../..", import.meta.url));

interface DesignTable {
  readonly path: string;
  /** The paragraph that opens with the marker, its lines joined. */
  readonly prose: string;
  /** Each row's four cells, verbatim. */
  readonly rows: readonly (readonly [string, string, string, string])[];
}

function readDesignTable(): DesignTable {
  const openspec = join(REPOSITORY, "openspec");
  const paths = readdirSync(openspec, { recursive: true, encoding: "utf8" })
    .filter((path) => basename(path) === "design.md")
    .map((path) => join(openspec, path))
    .filter((path) => readFileSync(path, "utf8").includes(MARKER));
  if (paths.length !== 1) {
    throw new Error(`expected one design.md under openspec/ holding ${MARKER}, found ${JSON.stringify(paths)}`);
  }
  const path = paths[0] as string;
  const lines = readFileSync(path, "utf8").split("\n");
  const start = lines.findIndex((line) => line.startsWith(MARKER));
  const blank = lines.findIndex((line, index) => index > start && line.trim() === "");
  const header = lines.indexOf(HEADER);
  if (header < blank) throw new Error(`no column-type table after ${MARKER} in ${path}`);
  const rows: [string, string, string, string][] = [];
  for (let index = header + 2; (lines[index] ?? "").startsWith("|"); index++) {
    const cells = (lines[index] as string).split("|").slice(1, -1).map((cell) => cell.trim());
    if (cells.length !== 4) throw new Error(`row ${index + 1} of ${path} has ${cells.length} cells`);
    rows.push(cells as [string, string, string, string]);
  }
  return { path, prose: lines.slice(start, blank).join(" "), rows };
}

const KEY_CELLS: Readonly<Record<string, string>> = {
  "yes, numerically": "numerically",
  "yes, by bytes": "by-bytes",
  'yes, by bytes (`COLLATE "C"`)': "by-bytes-collate-c",
  "yes, `false` first": "false-first",
};

/** Every backticked term of a cell, as the rules write it (without backticks). */
const termsOf = (cell: string): string[] => [...cell.matchAll(/`([^`]+)`/g)].map((match) => match[1] as string);

const textsOf = (rule: TypeRule): Because[] => {
  if (rule.allowed) return typeof rule.key === "string" ? [] : [rule.key];
  return "byType" in rule.because ? Object.values(rule.because.byType) : [rule.because];
};

/**
 * Where the rules and the design table disagree: an empty list when they agree. Each rule keeps its row's four cells
 * verbatim (`design`), so any edit to the table or to a rule's mirror shows here; its decisions (allowed or not, the
 * code, the key order) must be the ones the cells state; and its messages, adapted into sentences for a developer,
 * must keep every concrete term of the cell (types, settings, examples, the column to copy).
 */
function designDifferences(rules: readonly TypeRule[], table: DesignTable): string[] {
  const out: string[] = [];
  if (rules.length !== table.rows.length) out.push(`${rules.length} rules for ${table.rows.length} rows`);
  table.rows.forEach(([type, value, keyCell, because], index) => {
    const rule = rules[index];
    if (rule === undefined) return;
    const where = `row ${index + 1} (${type}), rule ${rule.id}`;
    const design = rule.design;
    if (design.type !== type || design.value !== value || design.key !== keyCell || design.because !== because) {
      out.push(`${where}: the rule's design cells differ from the table`);
    }
    if (rule.allowed === value.startsWith("refused")) out.push(`${where}: allowed as a value differs`);
    if (!rule.allowed && (rule.code === "non-deterministic-column") !== value.includes("`non-deterministic-column`")) {
      out.push(`${where}: the code differs`);
    }
    const order = KEY_CELLS[keyCell] ?? null;
    const ruleOrder = rule.allowed && typeof rule.key === "string" ? rule.key : null;
    if (order !== ruleOrder) out.push(`${where}: the key order differs (${order} vs ${ruleOrder})`);
    if (because.startsWith("—") !== (textsOf(rule).length === 0)) out.push(`${where}: a refusal text differs`);
    const shipped = textsOf(rule)
      .map((text) => `${text.reason} ${text.alternative}`)
      .join(" ");
    for (const term of because.startsWith("—") ? [] : termsOf(because)) {
      if (!shipped.includes(term)) out.push(`${where}: the messages lose "${term}"`);
    }
  });
  return out;
}

/**
 * Where the paragraph's refusals and the table-level rules disagree. Each sentence of the paragraph that refuses
 * something ("… is refused with `code`") belongs to at least one rule, kept verbatim in its `design`; the sequence and
 * the unlogged table share one sentence (Q61), each with its own message.
 */
function proseDifferences(rules: Readonly<Record<string, TableRule>>, table: DesignTable): string[] {
  const out: string[] = [];
  const prose = table.prose.replace(/\s+/g, " ");
  const sentences = Object.entries(rules);
  const distinct = new Set(sentences.map(([, rule]) => rule.design)).size;
  if ((prose.match(/ is refused with `/g) ?? []).length !== distinct) {
    out.push(`the paragraph's refusals are not ${distinct}`);
  }
  for (const [name, rule] of sentences) {
    if (!prose.includes(rule.design)) out.push(`${name}: its design sentence is not in the paragraph`);
    if (!rule.design.includes(`refused with \`${rule.code}\``)) out.push(`${name}: the code differs`);
    const shipped = `${rule.because.reason} ${rule.because.alternative}`;
    for (const term of termsOf(rule.design).filter((t) => t !== rule.code)) {
      if (!shipped.includes(term)) out.push(`${name}: the message loses "${term}"`);
    }
  }
  return out;
}

/**
 * Where the paragraph's sentences on allowed defaults and on detection, and the detection itself, disagree: both
 * sentences verbatim in the paragraph, and the function-id fields the expression tree is read for exactly those the
 * detection sentence names (`:funcid`, …).
 */
function defaultDesignDifferences(
  design: typeof DEFAULT_DESIGN,
  fields: readonly string[],
  table: DesignTable,
): string[] {
  const out: string[] = [];
  const prose = table.prose.replace(/\s+/g, " ");
  if (!prose.includes(design.allowed)) out.push("the allowed-defaults sentence is not in the paragraph");
  if (!prose.includes(design.detection)) out.push("the detection sentence is not in the paragraph");
  const named = termsOf(design.detection)
    .filter((term) => term.startsWith(":"))
    .map((term) => term.slice(1));
  if ([...named].sort().join() !== [...fields].sort().join()) {
    out.push(`the tree is read for ${fields.join(", ")}, the design names ${named.join(", ")}`);
  }
  return out;
}

describe("design.md §4's column-type table and the rules agree", () => {
  const table = readDesignTable();

  it("finds the table once, under openspec/, wherever the change folder is", () => {
    expect(table.path.startsWith(join(REPOSITORY, "openspec"))).toBe(true);
    expect(table.rows.length).toBe(16);
  });

  it("mirrors every row: the same cells, the same decisions, and every concrete term in the messages", () => {
    expect(designDifferences(COLUMN_TYPE_RULES, table)).toEqual([]);
  });

  it("mirrors the paragraph's refusals: no primary key, identity and serial, defaults, sequences, unlogged", () => {
    expect(proseDifferences(TABLE_RULES, table)).toEqual([]);
  });

  it("mirrors the paragraph's allowed defaults and its detection, whose function ids the tree is read for", () => {
    expect(defaultDesignDifferences(DEFAULT_DESIGN, FUNCTION_ID_FIELDS, table)).toEqual([]);
    // The node the detection sentence names for SQL value functions is one the tree is read for.
    expect(DEFAULT_DESIGN.detection).toContain("`SQLVALUEFUNCTION`");
    const valueFunction = parseExpressionTree("{SQLVALUEFUNCTION :op 3 :type 1184 :typmod -1 :location -1}");
    expect(defaultReferences(valueFunction)).toEqual([{ kind: "value-function", op: 3 }]);
  });

  describe("negative controls: each kind of drift is caught", () => {
    const replaced = (index: number, rule: TypeRule): TypeRule[] =>
      COLUMN_TYPE_RULES.map((each, at) => (at === index ? rule : each));
    const indexOf = (id: string): number => COLUMN_TYPE_RULES.findIndex((rule) => rule.id === id);
    const at = (id: string): TypeRule => COLUMN_TYPE_RULES[indexOf(id)] as TypeRule;

    it("an allowed type taken for a refused one", () => {
      const uuid = at("uuid");
      const refused = { ...uuid, allowed: false, code: "unsupported-column-type", because: becauseOf(column("json")) };
      expect(designDifferences(replaced(indexOf("uuid"), refused as TypeRule), table)).not.toEqual([]);
    });

    it("a refused type taken for an allowed one", () => {
      const money = at("money");
      const allowed = { ...money, allowed: true, types: ["money"], key: "by-bytes" };
      expect(designDifferences(replaced(indexOf("money"), allowed as TypeRule), table)).not.toEqual([]);
    });

    it("a key order changed, a key refusal dropped, a code changed", () => {
      const text = at("text");
      expect(designDifferences(replaced(indexOf("text"), { ...text, key: "by-bytes" } as TypeRule), table)).not.toEqual(
        [],
      );
      const jsonb = at("jsonb");
      expect(
        designDifferences(replaced(indexOf("jsonb"), { ...jsonb, key: "by-bytes" } as TypeRule), table),
      ).not.toEqual([]);
      const floats = at("floating-point");
      expect(
        designDifferences(
          replaced(indexOf("floating-point"), { ...floats, code: "unsupported-column-type" } as TypeRule),
          table,
        ),
      ).not.toEqual([]);
    });

    it("a design cell edited on either side, a row added or removed", () => {
      const json = at("json");
      const edited = { ...json, design: { ...json.design, because: `${json.design.because}.` } };
      expect(designDifferences(replaced(indexOf("json"), edited as TypeRule), table)).not.toEqual([]);
      const editedTable = { ...table, rows: table.rows.map((row, i) => (i === 0 ? [...row.slice(0, 3), "x"] : row)) };
      expect(designDifferences(COLUMN_TYPE_RULES, editedTable as DesignTable)).not.toEqual([]);
      expect(designDifferences(COLUMN_TYPE_RULES.slice(1), table)).not.toEqual([]);
    });

    it("a message that loses a concrete term of its cell", () => {
      const money = at("money");
      if (money.allowed || "byType" in money.because) throw new Error("money has one reason");
      const lost = { ...money, because: { ...money.because, reason: "Its text depends on a setting" } };
      expect(designDifferences(replaced(indexOf("money"), lost as TypeRule), table)).toContainEqual(
        expect.stringContaining('the messages lose "lc_monetary"'),
      );
    });

    it("a table-level refusal whose sentence or code drifted", () => {
      const noKey = TABLE_RULES.noPrimaryKey;
      expect(
        proseDifferences(
          { ...TABLE_RULES, noPrimaryKey: { ...noKey, design: noKey.design.replace("primary-key order", "key order") } },
          table,
        ),
      ).not.toEqual([]);
      expect(
        proseDifferences({ ...TABLE_RULES, noPrimaryKey: { ...noKey, code: "unsupported-key-type" } }, table),
      ).not.toEqual([]);
      const defaults = TABLE_RULES.nonImmutableDefault;
      const lost = { ...defaults, because: { ...defaults.because, reason: "Each machine gets a different value" } };
      expect(proseDifferences({ ...TABLE_RULES, nonImmutableDefault: lost }, table)).toContainEqual(
        expect.stringContaining('loses "now()"'),
      );
      const identity = TABLE_RULES.identityOrSerial;
      const noSerial = { ...identity, because: { ...identity.because, reason: "A sequence never rolls back" } };
      expect(proseDifferences({ ...TABLE_RULES, identityOrSerial: noSerial }, table)).toContainEqual(
        expect.stringContaining('loses "serial"'),
      );
    });

    it("a refusal of the paragraph that no rule mirrors", () => {
      const { sequence: _sequence, unloggedTable: _unlogged, ...withoutQ61 } = TABLE_RULES;
      expect(proseDifferences(withoutQ61, table)).toContainEqual("the paragraph's refusals are not 3");
      const { nonImmutableDefault: _default, ...withoutDefaults } = TABLE_RULES;
      expect(proseDifferences(withoutDefaults, table)).toContainEqual("the paragraph's refusals are not 4");
    });

    it("an allowed-defaults or detection sentence that drifted, a function-id field dropped or added", () => {
      const allowed = { ...DEFAULT_DESIGN, allowed: DEFAULT_DESIGN.allowed.replace("`1 + 2`", "`1 + 1`") };
      expect(defaultDesignDifferences(allowed, FUNCTION_ID_FIELDS, table)).not.toEqual([]);
      const detection = { ...DEFAULT_DESIGN, detection: DEFAULT_DESIGN.detection.replace("provolatile", "prokind") };
      expect(defaultDesignDifferences(detection, FUNCTION_ID_FIELDS, table)).not.toEqual([]);
      const withoutOpfuncid = FUNCTION_ID_FIELDS.filter((field) => field !== "opfuncid");
      expect(defaultDesignDifferences(DEFAULT_DESIGN, withoutOpfuncid, table)).not.toEqual([]);
      expect(defaultDesignDifferences(DEFAULT_DESIGN, [...FUNCTION_ID_FIELDS, "aggfnoid"], table)).not.toEqual([]);
    });
  });
});
