import { readdirSync, readFileSync } from "node:fs";
import { basename, join } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";
import { CanonicalEncodingError, type ColumnType, encodeRow, SCALAR_COLUMN_TYPES } from "../../src/determinism/cbor.js";
import {
  type Because,
  COLUMN_TYPE_RULES,
  type ColumnFacts,
  columnVerdict,
  keyOrder,
  numericScale,
  type Refusal,
  refusalMessage,
  refusalOfTypeName,
  TABLE_RULES,
  type TableFacts,
  tableRefusals,
  type TypeRule,
  valueFailureBecause,
} from "../../src/determinism/column-rules.js";

/**
 * Task 1.3 (owner decision Q58): the column-type rules of DT-1, DT-2 and DT-6, without a database.
 *
 * The rules take a plain, catalog-shaped description of a column (`format_type(atttypid, NULL)`, `format_type(atttypid,
 * atttypmod)`, `atttypmod`, `pg_type.typtype` of the type and of an array's element, and whether the column is in the
 * primary key), so the contents hash and task 7.1's migration-time check read the same facts and give the same
 * verdicts. The descriptions below are written by hand from what PostgreSQL 17.11 reports for each declaration
 * (checked 2026-10-23; `column-refusals.test.ts` reads them from a real catalog). The last section keeps the rules in
 * step with `design.md` §4's column-type table, their single source.
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
    const cases: readonly (readonly [string, readonly string[], readonly string[]])[] = [
      ["timestamp with time zone", ["JavaScript Date", "milliseconds only", "TimeZone", "DateStyle"], ["IntervalStyle"]],
      ["timestamp without time zone", ["JavaScript Date", "milliseconds only", "DateStyle"], ["TimeZone"]],
      ["date", ["JavaScript Date", "DateStyle"], ["milliseconds only", "TimeZone", "IntervalStyle"]],
      ["interval", ["text", "IntervalStyle"], ["JavaScript Date", "DateStyle", "TimeZone"]],
      ["time without time zone", ["no canonical encoding"], ["JavaScript Date", "DateStyle", "TimeZone"]],
      ["time with time zone", ["no canonical encoding"], ["JavaScript Date", "DateStyle", "TimeZone"]],
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
        "The drivers return it as a JavaScript Date, which keeps milliseconds only " +
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

function proseDifferences(rules: typeof TABLE_RULES, table: DesignTable): string[] {
  const out: string[] = [];
  const prose = table.prose.replace(/\s+/g, " ");
  const sentences = Object.entries(rules);
  if ((prose.match(/ is refused with `/g) ?? []).length !== sentences.length) {
    out.push(`the paragraph's refusals are not ${sentences.length}`);
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

describe("design.md §4's column-type table and the rules agree", () => {
  const table = readDesignTable();

  it("finds the table once, under openspec/, wherever the change folder is", () => {
    expect(table.path.startsWith(join(REPOSITORY, "openspec"))).toBe(true);
    expect(table.rows.length).toBe(16);
  });

  it("mirrors every row: the same cells, the same decisions, and every concrete term in the messages", () => {
    expect(designDifferences(COLUMN_TYPE_RULES, table)).toEqual([]);
  });

  it("mirrors the paragraph's table-level refusals (no primary key, sequences, wall-clock and random defaults)", () => {
    expect(proseDifferences(TABLE_RULES, table)).toEqual([]);
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
      const defaults = TABLE_RULES.nonDeterministicDefault;
      const lost = { ...defaults, because: { ...defaults.because, reason: "Each machine gets a different value" } };
      expect(proseDifferences({ ...TABLE_RULES, nonDeterministicDefault: lost }, table)).toContainEqual(
        expect.stringContaining('loses "now()"'),
      );
    });
  });
});
