/**
 * The column-type rules of DT-1, DT-2 and DT-6 (`openspec/changes/core-arch/specs/determinism/spec.md`, owner decision
 * Q58): for each column of a public table, whether its type may be stored (as a value) and whether it may be part of
 * the primary key (as a key) — and, when it may not, why, and what to use instead.
 *
 * **One source.** Every reason and alternative here comes from `design.md` §4's column-type table and the paragraph
 * above it, adapted into sentences for a module developer who has never read DT-1. Each rule keeps its row's four cells
 * verbatim (`design`), and `test/determinism/column-rules.test.ts` fails when the table and the rules part ways. The
 * contents hash (DT-3) refuses with these rules today; task 7.1's migration-time check (DT-6) calls the same
 * {@link tableRefusals} and {@link refusalMessage}, adding the module's id, so a refusal reads the same in both.
 *
 * **The input** is what PostgreSQL's catalog says about a column ({@link ColumnFacts}), nothing more: the type's name
 * (`format_type(atttypid, NULL)`), the declared type for messages (`format_type(atttypid, atttypmod)`), the type
 * modifier (`atttypmod`, which holds `numeric`'s declared scale), the kind of type (`pg_type.typtype`, which tells
 * enums, domains, composite, range and multirange types apart, whatever their name) and of an array's element, and
 * whether the column is in the primary key.
 *
 * Two rows of the table give one reason to several types although it is not true of each of them (decision record
 * Q59 and Q60, 2026-10-23): the date and time types and the floating-point types. For those, each type gets the
 * clauses that are true of it, checked on PostgreSQL 17.11 and PGlite 0.5.10
 * (`test/determinism/column-refusals.test.ts` checks them again through the driver).
 */

import type { CanonicalEncodingFailure, ColumnType, ScalarColumnType } from "./cbor.js";

// ── input: what the catalog says about a column ─────────────────────────────────────────────────────────────────────

/** A column as PostgreSQL's catalog describes it. */
export interface ColumnFacts {
  readonly name: string;
  /**
   * `format_type(atttypid, NULL)`: the type's name without modifiers (`numeric`, `character varying`, `bigint[]`,
   * `timestamp with time zone`, `m.mood`). An array is named by its element and `[]`, whatever its dimensions.
   */
  readonly type: string;
  /** `format_type(atttypid, atttypmod)`: the type as declared, for messages (`numeric(38,2)`, `character(4)`). */
  readonly declaredType: string;
  /** `atttypmod`, −1 when the type has none; for `numeric` and its arrays it holds the declared precision and scale. */
  readonly typeModifier: number;
  /**
   * `pg_type.typtype` of the column's type: `b` base, `c` composite, `d` domain, `e` enum, `r` range, `m` multirange,
   * `p` pseudo-type.
   */
  readonly typeKind: string;
  /** For an array column (its `type` ends in `[]`), `pg_type.typtype` of its element type; `null` otherwise. */
  readonly elementKind: string | null;
  /** Whether the column is one of the primary key's columns. */
  readonly inPrimaryKey: boolean;
}

/** A table as PostgreSQL's catalog describes it: its columns in column order. */
export interface TableFacts {
  readonly schema: string;
  readonly name: string;
  readonly columns: readonly ColumnFacts[];
}

// ── the rules ───────────────────────────────────────────────────────────────────────────────────────────────────────

/** The codes of DT-6's startup refusals that the rules decide (`design.md` §11). */
export type RefusalCode =
  | "no-primary-key"
  | "unsupported-key-type"
  | "unsupported-column-type"
  | "non-deterministic-column";

/** How DT-2 orders a key column: integers numerically, `boolean` with `false` first, the others by their bytes. */
export type KeyOrder = "numerically" | "false-first" | "by-bytes" | "by-bytes-collate-c";

/** Why something is refused, as a sentence without its final period, and what to use instead, as a clause. */
export interface Because {
  readonly reason: string;
  readonly alternative: string;
}

/** A row of `design.md` §4's column-type table, cell by cell, verbatim. */
export interface DesignRow {
  readonly type: string;
  readonly value: string;
  readonly key: string;
  readonly because: string;
}

interface RuleBase {
  readonly id: string;
  readonly design: DesignRow;
}

/** A row whose types may be stored. */
export interface AllowedRule extends RuleBase {
  readonly allowed: true;
  /** The scalar types it covers, as `format_type(atttypid, NULL)` names them (none for the arrays row). */
  readonly types: readonly ScalarColumnType[];
  /** As a key: DT-2's order, or why such a key is refused (`unsupported-key-type`). */
  readonly key: KeyOrder | Because;
}

/** A row whose types may not be stored, and therefore not be keys either. */
export interface RefusedRule extends RuleBase {
  readonly allowed: false;
  readonly code: "unsupported-column-type" | "non-deterministic-column";
  /** The scalar types it covers by name (none for the rows matched by kind or by scale, or for every other type). */
  readonly types: readonly string[];
  /** Why, and what instead: one for the row, or one for each of its types. */
  readonly because: Because | { readonly byType: Readonly<Record<string, Because>> };
}

export type TypeRule = AllowedRule | RefusedRule;

/** A refusal of a whole table or of a kind of column, from the paragraph above the column-type table. */
export interface TableRule {
  readonly code: RefusalCode;
  /** What is refused, as the start of a message. */
  readonly what: string;
  /** Its sentence in `design.md` §4, verbatim. */
  readonly design: string;
  readonly because: Because;
}

// Integers. Their encoding is their value (CBOR major types 0 and 1), and PostgreSQL compares them by value, which is
// DT-2's order for them.
const INTEGERS: AllowedRule = {
  id: "integer",
  design: { type: "`smallint`, `integer`, `bigint`", value: "integer", key: "yes, numerically", because: "—" },
  allowed: true,
  types: ["smallint", "integer", "bigint"],
  key: "numerically",
};

// `numeric` without a declared scale above 0 (`numeric`, `numeric(p)`, `numeric(p,0)`, and `numeric(p,s)` with s < 0,
// which rounds to tens, hundreds, …): stored as its canonical integer text (DT-1); task 7.1's `CHECK` refuses a
// fraction or `NaN` on write (Q57). Not a key: DT-2 orders keys by value or by bytes, and a text's bytes do not follow
// its value (Q58 kept numeric keys out; its option C, ordering them numerically, was not chosen).
const NUMERIC: AllowedRule = {
  id: "numeric",
  design: {
    type: "`numeric`, `numeric(p)`, `numeric(p,0)`",
    value: "canonical integer text; the `CHECK` refuses a fraction or `NaN`",
    key: "no",
    because:
      "As a key: DT-2 orders keys by value or by bytes, and a `numeric`'s text does not sort by value; use `bigint`, " +
      "or `bytea` holding a fixed-width big-endian unsigned value",
  },
  allowed: true,
  types: ["numeric"],
  key: {
    reason:
      "Rows are hashed and digested in primary-key order, which compares integer and boolean keys by value and every " +
      'other key by its bytes, and a numeric is encoded as its decimal text, which does not sort by value ("10" ' +
      'sorts before "9")',
    alternative: "use bigint, or bytea holding a fixed-width big-endian unsigned value",
  },
};

// `numeric(p,s)` with s > 0: every value prints with s decimals, so under Q57 (a zero fraction is a fraction) none of
// its values could be encoded; Q58 refuses the column at migration time instead of failing at hash time. Its scale is
// read from the type modifier, because `format_type(atttypid, NULL)` names it plain `numeric`.
const NUMERIC_SCALED: RefusedRule = {
  id: "numeric-scaled",
  design: {
    type: "`numeric(p,s)`, s > 0",
    value: "refused",
    key: "refused",
    because:
      "Every value prints with s decimals (`100` → `100.00`), and stored numbers are integers so that equal hashes " +
      "mean equal query results (Q57); store integer smallest units in `numeric(p)` or `bigint`",
  },
  allowed: false,
  code: "unsupported-column-type",
  types: [],
  because: {
    reason:
      "A numeric with a declared scale above 0 prints every value with that many decimals (100 → 100.00 at scale 2), " +
      "and stored numbers are integers so that equal contents hashes mean equal query results",
    alternative: "store integer smallest units in numeric(p) or bigint",
  },
};

// `bytea`: a byte string, compared by its bytes in both PostgreSQL and the encoding.
const BYTEA: AllowedRule = {
  id: "bytea",
  design: { type: "`bytea`", value: "byte string", key: "yes, by bytes", because: "—" },
  allowed: true,
  types: ["bytea"],
  key: "by-bytes",
};

// `text` and `varchar(n)`: the same characters, one text string. As keys they are compared by their UTF-8 bytes, which
// PostgreSQL does only under `COLLATE "C"` (a column's own collation may put "a" before "B").
const TEXT: AllowedRule = {
  id: "text",
  design: { type: "`text`, `varchar(n)`", value: "text string", key: 'yes, by bytes (`COLLATE "C"`)', because: "—" },
  allowed: true,
  types: ["text", "character varying"],
  key: "by-bytes-collate-c",
};

// `uuid`: 16 bytes, which PostgreSQL compares with memcmp and always prints as lowercase hex, so the byte order and
// the order of its text agree. A `gen_random_uuid()` default is refused by task 7.1 as random, not here.
const UUID: AllowedRule = {
  id: "uuid",
  design: {
    type: "`uuid`",
    value: "byte string of its 16 bytes",
    key: "yes, by bytes",
    because: "— (a `gen_random_uuid()` default is still refused as random)",
  },
  allowed: true,
  types: ["uuid"],
  key: "by-bytes",
};

// `boolean`: PostgreSQL orders `false` first, and CBOR encodes `false` (f4) before `true` (f5), so the orders agree
// (owner decision Q58, which added boolean keys).
const BOOLEAN: AllowedRule = {
  id: "boolean",
  design: { type: "`boolean`", value: "`false` / `true`", key: "yes, `false` first", because: "—" },
  allowed: true,
  types: ["boolean"],
  key: "false-first",
};

// `jsonb`: PostgreSQL normalizes it on write; the encoding sorts map keys (RFC 8949 §4.2.1) and task 7.1's `CHECK`
// keeps its numbers integral (Q57). Not a key: PostgreSQL's jsonb order is not the order of the encoded bytes.
const JSONB: AllowedRule = {
  id: "jsonb",
  design: {
    type: "`jsonb`",
    value: "CBOR, map keys sorted; the `CHECK` on numbers",
    key: "no",
    because:
      "As a key: PostgreSQL's `jsonb` order (by kind, then size, then contents) is not the order of the encoded " +
      "bytes; use a `text` or `bytea` key",
  },
  allowed: true,
  types: ["jsonb"],
  key: {
    reason:
      "Rows are hashed and digested in primary-key order, which compares keys by value or by their encoded bytes, " +
      "and PostgreSQL orders jsonb by kind, then size, then contents, which is not the order of the encoded bytes",
    alternative: "use a text or bytea key",
  },
};

// Arrays of an allowed type, any number of dimensions. Not a key: PostgreSQL compares arrays element by element, the
// encoding's bytes start with the length.
const ARRAY: AllowedRule = {
  id: "array",
  design: {
    type: "arrays of the value types above",
    value: "array",
    key: "no",
    because:
      "As a key: PostgreSQL compares arrays element by element, while the encoding puts the length first; use a " +
      "composite key",
  },
  allowed: true,
  types: [],
  key: {
    reason:
      "PostgreSQL compares arrays element by element, while the encoding puts an array's length first, so the two " +
      "orders differ ({1,5} sorts before {2} in PostgreSQL, after it when encoded)",
    alternative: "use a composite primary key, one column per element",
  },
};

/** The rows whose types may be stored, in the table's order. */
const ALLOWED: readonly AllowedRule[] = [INTEGERS, NUMERIC, BYTEA, TEXT, UUID, BOOLEAN, JSONB, ARRAY];

const KEY_TYPES = ALLOWED.flatMap((rule) => (typeof rule.key === "string" ? rule.types : []));
const VALUE_TYPES = ALLOWED.flatMap((rule) =>
  rule.types.map((type) => (type === "numeric" ? "numeric (with no declared scale above 0)" : type)),
);

// `real` and `double precision`: DT-6 refuses floating-point columns with `non-deterministic-column`. The row's example
// (0.1 + 0.2 against 0.3) holds in double precision only; in real, 0.1 + 0.2 equals 0.3 (Q60), so real gets its own.
const FLOATING_POINT: RefusedRule = {
  id: "floating-point",
  design: {
    type: "`real`, `double precision`",
    value: "refused (`non-deterministic-column`)",
    key: "refused",
    because:
      "Approximate: a value computed two ways (`0.1 + 0.2`, `0.3`) can differ in its last bits; use integers in " +
      "fixed units (`bigint`, `numeric(p)`)",
  },
  allowed: false,
  code: "non-deterministic-column",
  types: ["real", "double precision"],
  because: {
    byType: {
      real: {
        reason:
          "Floating-point values are approximate: a value computed two ways can differ in its last bits (in real, " +
          "0.1 + 0.6 gives 0.70000005, not 0.7)",
        alternative: "use integers in fixed units (bigint, numeric(p))",
      },
      "double precision": {
        reason:
          "Floating-point values are approximate: a value computed two ways can differ in its last bits (in double " +
          "precision, 0.1 + 0.2 gives 0.30000000000000004, not 0.3)",
        alternative: "use integers in fixed units (bigint, numeric(p))",
      },
    },
  },
};

const SINCE_EPOCH = "store bigint milliseconds since the epoch, as core_block_commit.blocks.block_timestamp_ms does";
const MILLISECONDS = "store bigint milliseconds, as core_block_commit.blocks.block_timestamp_ms does";
const MILLISECOND_DATE =
  "The drivers return it as a JavaScript Date, which keeps milliseconds only (10:00:00.123456 and 10:00:00.123999 " +
  "read back equal)";
const TIME_OF_DAY: Because = {
  reason:
    "UmbraDB defines no canonical encoding for a time of day: the drivers return its text, and, as for every date " +
    "and time type, an encoding would need a rule of its own",
  alternative: MILLISECONDS,
};

// Date and time types: refused (Q58, option D kept them out). `postgres` 3.4.9 (src/types.js:28-32) and PGlite 0.5.10
// parse `date`, `timestamp` and `timestamptz` into a `Date` (milliseconds only); `time`, `timetz` and `interval` come
// back as text. `date` and `timestamp` text follows DateStyle, `timestamptz` also TimeZone, `interval` IntervalStyle;
// `time` and `timetz` text follows no setting (checked on PostgreSQL 17.11 and PGlite 0.5.10, Q59), so their reason is
// the one Q58 gives for every date and time type: an encoding would need its own rule.
const DATE_TIME: RefusedRule = {
  id: "date-time",
  design: {
    type: "`timestamptz`, `timestamp`, `date`, `time`, `timetz`, `interval`",
    value: "refused",
    key: "refused",
    because:
      "The drivers return a JavaScript `Date`, which keeps milliseconds only (`10:00:00.123456` and " +
      "`10:00:00.123999` read back equal), and the text depends on `TimeZone`, `DateStyle` and `IntervalStyle`; " +
      "store `bigint` milliseconds since the epoch, as `core_block_commit.blocks.block_timestamp_ms` does",
  },
  allowed: false,
  code: "unsupported-column-type",
  types: [
    "timestamp with time zone",
    "timestamp without time zone",
    "date",
    "time without time zone",
    "time with time zone",
    "interval",
  ],
  because: {
    byType: {
      "timestamp with time zone": {
        reason: `${MILLISECOND_DATE}, and its text depends on the TimeZone and DateStyle settings`,
        alternative: SINCE_EPOCH,
      },
      "timestamp without time zone": {
        reason: `${MILLISECOND_DATE}, and its text depends on the DateStyle setting`,
        alternative: SINCE_EPOCH,
      },
      date: {
        reason:
          "The drivers return it as a JavaScript Date, and its text depends on the DateStyle setting (2026-10-23 or " +
          "23/10/2026)",
        alternative: SINCE_EPOCH,
      },
      interval: {
        reason: "The drivers return its text, which depends on the IntervalStyle setting (1 day 02:00:00 or P1DT2H)",
        alternative: MILLISECONDS,
      },
      "time without time zone": TIME_OF_DAY,
      "time with time zone": TIME_OF_DAY,
    },
  },
};

// `json`: PostgreSQL keeps the input text, the drivers parse it, so a hash of what they return would call two
// different stored texts equal. `jsonb` normalizes on write, which is why DT-1 takes it.
const JSON_TYPE: RefusedRule = {
  id: "json",
  design: {
    type: "`json`",
    value: "refused",
    key: "refused",
    because:
      "PostgreSQL keeps `json`'s input text (spaces, key order, duplicate keys), but the drivers parse it, so " +
      "different stored texts read back equal; use `jsonb`",
  },
  allowed: false,
  code: "unsupported-column-type",
  types: ["json"],
  because: {
    reason:
      "PostgreSQL keeps json's input text (spaces, key order, duplicate keys), but the drivers parse it, so " +
      'different stored texts read back equal ({"b":1,  "a":2, "a":3} and {"b": 1, "a": 3} both read back as ' +
      '{"b": 1, "a": 3})',
    alternative: "use jsonb",
  },
};

// `char(n)` (format_type's `character`, `bpchar` included): its padding is kept, ignored or dropped depending on how
// the value is read, so it has no one value to encode.
const CHAR: RefusedRule = {
  id: "char",
  design: {
    type: "`char(n)`",
    value: "refused",
    key: "refused",
    because:
      "Stored padded with spaces, compared ignoring them and cast to `text` without them, so its value depends on " +
      "how it is read; use `text` or `varchar(n)`",
  },
  allowed: false,
  code: "unsupported-column-type",
  types: ["character"],
  because: {
    reason:
      "A char(n) value is stored padded with spaces, compared ignoring them and cast to text without them, so its " +
      "value depends on how it is read ('ab' in a char(4) column reads back as 'ab  ', and as 'ab' once cast to text)",
    alternative: "use text or varchar(n)",
  },
};

// `money`: its output is formatted for the `lc_monetary` locale (PostgreSQL's cash_out).
const MONEY: RefusedRule = {
  id: "money",
  design: {
    type: "`money`",
    value: "refused",
    key: "refused",
    because: "Its text depends on the `lc_monetary` setting; use `bigint` smallest units",
  },
  allowed: false,
  code: "unsupported-column-type",
  types: ["money"],
  because: {
    reason: "The text of a money value depends on the lc_monetary setting",
    alternative: "use bigint smallest units",
  },
};

// Enums, domains and composite types, recognised by `pg_type.typtype` (and an array's element's), never by name: a
// domain could be named like an allowed type. Their meaning lives in the catalog, which the hash does not cover.
const USER_DEFINED: RefusedRule = {
  id: "user-defined",
  design: {
    type: "enums, domains, composite types",
    value: "refused",
    key: "refused",
    because:
      "User-defined: their labels, base type or fields live in the catalog, not in the row, and no rule here covers " +
      "them; use the base type (`text` with a `CHECK` for an enum or a domain, separate columns for a composite)",
  },
  allowed: false,
  code: "unsupported-column-type",
  types: [],
  because: {
    reason:
      "Enums, domains and composite types are user-defined: their labels, base type or fields live in the catalog, " +
      "not in the row, and no rule covers them",
    alternative: "use the base type (text with a CHECK for an enum or a domain, separate columns for a composite)",
  },
};

// Every other type (network, bit-string, XML, geometric, range and multirange, full-text, …): DT-1's list of types is
// closed, so a type outside it never gets an accidental encoding.
const OTHER: RefusedRule = {
  id: "other",
  design: {
    type: "any other type (network, bit-string, XML, geometric, range, full-text, …)",
    value: "refused",
    key: "refused",
    because: "No canonical encoding is defined; the supported types are those above",
  },
  allowed: false,
  code: "unsupported-column-type",
  types: [],
  because: {
    reason: "No canonical encoding is defined for this type",
    alternative: `use one of the supported types: ${VALUE_TYPES.join(", ")}, or an array of one of them`,
  },
};

/** The rules, one per row of `design.md` §4's column-type table, in its order. */
export const COLUMN_TYPE_RULES: readonly TypeRule[] = [
  INTEGERS,
  NUMERIC,
  NUMERIC_SCALED,
  BYTEA,
  TEXT,
  UUID,
  BOOLEAN,
  JSONB,
  ARRAY,
  FLOATING_POINT,
  DATE_TIME,
  JSON_TYPE,
  CHAR,
  MONEY,
  USER_DEFINED,
  OTHER,
];

/** The refusals of the paragraph above the column-type table; the last two are task 7.1's to detect. */
export const TABLE_RULES: {
  readonly noPrimaryKey: TableRule;
  readonly sequenceColumn: TableRule;
  readonly nonDeterministicDefault: TableRule;
} = {
  // DT-2 orders rows by their primary key; the contents hash and the digests depend on that order.
  noPrimaryKey: {
    code: "no-primary-key",
    what: "the table has no primary key",
    design:
      "A table without a primary key is refused with `no-primary-key`: rows are hashed and digested in primary-key " +
      "order (DT-2), and without a key there is no order every database agrees on; add a primary key of the key " +
      "types below.",
    because: {
      reason:
        "Rows are hashed and digested in primary-key order, and without a key there is no order every database " +
        "agrees on",
      alternative: `add a primary key whose columns are ${KEY_TYPES.slice(0, -1).join(", ")} or ${KEY_TYPES.at(-1)}`,
    },
  },
  // A sequence's value survives the rollback of the block that drew it.
  sequenceColumn: {
    code: "non-deterministic-column",
    what: "a sequence, serial or identity column cannot be in a public table",
    design:
      "A sequence, `serial` or identity column is refused with `non-deterministic-column`: a sequence never rolls " +
      "back, so its next value depends on rolled-back and retried blocks, not only on the chain; derive keys from " +
      "the block (height, transaction index).",
    because: {
      reason:
        "A sequence, the one behind a serial or identity column too, never rolls back, so its next value depends on " +
        "rolled-back and retried blocks, not only on the chain",
      alternative: "derive keys from the block (height, transaction index)",
    },
  },
  // Defaults evaluated on each machine at write time.
  nonDeterministicDefault: {
    code: "non-deterministic-column",
    what: "a column's default cannot read the wall clock or draw a random value",
    design:
      "A wall-clock or random default (`now()`, `random()`, `gen_random_uuid()`) is refused with " +
      "`non-deterministic-column`: each machine gets a different value; compute the value from the block in " +
      "`on-db-write`.",
    because: {
      reason:
        "A default that reads the wall clock or draws at random (now(), random(), gen_random_uuid()) gives each " +
        "machine a different value",
      alternative: "compute the value from the block in on-db-write",
    },
  },
};

// ── verdicts ────────────────────────────────────────────────────────────────────────────────────────────────────────

/** What the rules decide for one column. */
export type ColumnVerdict =
  | {
      readonly allowed: true;
      readonly rule: AllowedRule;
      /** The column type the encoder takes for it: its `type`. */
      readonly encoding: ColumnType;
      /** For a primary-key column, DT-2's order; `null` for any other column. */
      readonly keyOrder: KeyOrder | null;
    }
  | {
      readonly allowed: false;
      readonly rule: TypeRule;
      readonly code: Exclude<RefusalCode, "no-primary-key">;
      readonly because: Because;
    };

/**
 * The verdict on one column. A column whose type may not be stored is refused for that, with its row's code, even in
 * the primary key: no key can make it storable, and its alternative is a valid key type. Only a storable type that DT-2
 * does not order is refused as a key (`unsupported-key-type`).
 */
export function columnVerdict(column: ColumnFacts): ColumnVerdict {
  const { rule, scalar } = ruleOf(column);
  if (!rule.allowed) return { allowed: false, rule, code: rule.code, because: becauseOf(rule, scalar) };
  const encoding = column.type as ColumnType;
  if (!column.inPrimaryKey) return { allowed: true, rule, encoding, keyOrder: null };
  if (typeof rule.key === "string") return { allowed: true, rule, encoding, keyOrder: rule.key };
  return { allowed: false, rule, code: "unsupported-key-type", because: rule.key };
}

/** One refusal of a table: its code, the column (null for the table itself), what is refused, and why. */
export interface Refusal {
  readonly code: RefusalCode;
  readonly column: { readonly name: string; readonly declaredType: string } | null;
  readonly what: string;
  readonly because: Because;
}

/**
 * Every refusal of a table, in a fixed order: a missing primary key first, then each refused column in column order.
 * Empty when the table may be stored, hashed and digested. The contents hash refuses with the first; so will startup.
 */
export function tableRefusals(table: TableFacts): Refusal[] {
  const refusals: Refusal[] = [];
  if (!table.columns.some((column) => column.inPrimaryKey)) {
    const { code, what, because } = TABLE_RULES.noPrimaryKey;
    refusals.push({ code, column: null, what, because });
  }
  for (const column of table.columns) {
    const verdict = columnVerdict(column);
    if (verdict.allowed) continue;
    refusals.push({
      code: verdict.code,
      column: { name: column.name, declaredType: column.declaredType },
      what: verdict.code === "unsupported-key-type" ? REFUSED_AS_KEY : REFUSED_AS_VALUE,
      because: verdict.because,
    });
  }
  return refusals;
}

/** Where a refusal is: the module (startup only; at hash time the schema stands in for it), the schema, the table. */
export interface RefusalPlace {
  readonly module?: string;
  readonly schema: string;
  readonly table: string;
}

/**
 * The message of a refusal, for a developer who has never read DT-1: the code, where (module, table, column and its
 * declared type), what is refused, why, and what to use instead. The contents hash and startup give it alike.
 */
export function refusalMessage(refusal: Refusal, place: RefusalPlace): string {
  return `${refusal.code}: ${describeLocation(place, refusal.column)}: ${explainRefusal(refusal)}`;
}

/** The location part of a message: `module "m", table "s"."t", column "c" (declared type)`. */
export function describeLocation(
  place: RefusalPlace,
  column: { readonly name: string; readonly declaredType: string } | null,
): string {
  const parts = place.module === undefined ? [] : [`module ${JSON.stringify(place.module)}`];
  parts.push(`table ${quoteIdentifier(place.schema)}.${quoteIdentifier(place.table)}`);
  if (column !== null) parts.push(`column ${quoteIdentifier(column.name)} (${column.declaredType})`);
  return parts.join(", ");
}

/** What is refused, why, and what to use instead, as sentences. */
export function explainRefusal(refusal: Refusal): string {
  return `${refusal.what}. ${explain(refusal.because)}`;
}

/** A reason and its alternative as two sentences. */
export function explain(because: Because): string {
  return `${because.reason}. Instead, ${because.alternative}.`;
}

/** The declared scale of a `numeric` type modifier (PostgreSQL's numeric.c, `numeric_typmod_scale`); null for none. */
export function numericScale(typeModifier: number): number | null {
  // A valid numeric typmod is at least VARHDRSZ (4); the scale is the low 11 bits after it, as a signed number.
  if (typeModifier < 4) return null;
  return (((typeModifier - 4) & 0x7ff) ^ 1024) - 1024;
}

/** DT-2's order of a key column of `type`, or null when such a column cannot be a key. */
export function keyOrder(type: string): KeyOrder | null {
  const rule = ALLOWED_BY_NAME.get(type);
  return rule !== undefined && typeof rule.key === "string" ? rule.key : null;
}

/**
 * The refusal of a column type known by its name alone, for the encoder, which receives `format_type(atttypid, NULL)`
 * names and no catalog facts: a name a row refuses gets that row's code and reason; any other name — one the encoder
 * does not take, which is never a name a row allows — is "any other type". Without the catalog an enum or a domain is
 * one of those, and a `numeric` name carries no scale.
 */
export function refusalOfTypeName(type: string): { readonly code: RefusedRule["code"]; readonly because: Because } {
  const scalar = type.endsWith("[]") ? type.slice(0, -2) : type;
  const rule = REFUSED_BY_NAME.get(scalar) ?? OTHER;
  return { code: rule.code, because: becauseOf(rule, scalar) };
}

/**
 * Why a stored value of an allowed type could not be encoded, when a stored value can cause it: a `numeric` with a
 * fraction or `NaN`, a `jsonb` number that is not a 64-bit integer (DT-1, DT-6, Q57). Null for failures only a broken
 * read handle can cause (a value of the wrong JavaScript type, a lossy JSON parser, …).
 */
export function valueFailureBecause(type: string, failure: CanonicalEncodingFailure): Because | null {
  const scalar = type.endsWith("[]") ? type.slice(0, -2) : type;
  if (scalar === "numeric" && (failure === "numeric-fraction" || failure === "numeric-invalid")) return NUMERIC_VALUES;
  if (scalar === "jsonb" && (failure === "not-integer" || failure === "integer-out-of-range")) return JSON_NUMBERS;
  return null;
}

/** Quotes an SQL identifier as PostgreSQL does (`"a""b"`). */
export function quoteIdentifier(name: string): string {
  return `"${name.replace(/"/g, '""')}"`;
}

// ── internals ───────────────────────────────────────────────────────────────────────────────────────────────────────

const REFUSED_AS_VALUE = "this type cannot be stored in a public table";
const REFUSED_AS_KEY = "this type cannot be part of a primary key";

// The value rows of the table (`numeric`: "the CHECK refuses a fraction or NaN"; `jsonb`: "the CHECK on numbers"), with
// the reason and alternative of the `numeric(p,s)` row and DT-6 (Q57).
const NUMERIC_VALUES: Because = {
  reason:
    "A stored number must be an integer, so that equal contents hashes mean equal query results: a numeric with a " +
    "fraction, even a zero one such as 100.00, or NaN has no canonical encoding",
  alternative: "store integer smallest units in numeric(p) or bigint",
};
const JSON_NUMBERS: Because = {
  reason:
    "A stored number must be an integer, so that equal contents hashes mean equal query results: a JSON number must " +
    "be an integer within the signed 64-bit range, without a fraction, even a zero one such as 1.0",
  alternative: "store integers in smallest units, within the signed 64-bit range",
};

const ALLOWED_BY_NAME: ReadonlyMap<string, AllowedRule> = new Map(
  ALLOWED.flatMap((rule) => rule.types.map((type) => [type, rule] as const)),
);
const REFUSED_BY_NAME: ReadonlyMap<string, RefusedRule> = new Map(
  COLUMN_TYPE_RULES.flatMap((rule) => (rule.allowed ? [] : rule.types.map((type) => [type, rule] as const))),
);

/** The row a column falls under, and the scalar type (an array's element) whose reason applies. */
function ruleOf(column: ColumnFacts): { readonly rule: TypeRule; readonly scalar: string } {
  const isArray = column.type.endsWith("[]");
  const scalar = isArray ? column.type.slice(0, -2) : column.type;
  const kind = isArray ? column.elementKind : column.typeKind;
  if (kind === "e" || kind === "d" || kind === "c") return { rule: USER_DEFINED, scalar };
  // Ranges, multiranges, pseudo-types, and an array described without its element's kind.
  if (kind !== "b") return { rule: OTHER, scalar };
  const allowed = ALLOWED_BY_NAME.get(scalar);
  if (allowed === undefined) return { rule: REFUSED_BY_NAME.get(scalar) ?? OTHER, scalar };
  if (allowed === NUMERIC && (numericScale(column.typeModifier) ?? 0) > 0) return { rule: NUMERIC_SCALED, scalar };
  return { rule: isArray ? ARRAY : allowed, scalar };
}

function becauseOf(rule: RefusedRule, scalar: string): Because {
  // A row with a reason per type matches only the types it lists (its `types`), each of which has one.
  return "byType" in rule.because ? (rule.because.byType[scalar] as Because) : rule.because;
}
