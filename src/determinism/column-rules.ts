/**
 * The column-type rules of DT-1, DT-2 and DT-6 (`openspec/changes/core-arch/specs/determinism/spec.md`, owner decision
 * Q58): for each column of a public table, whether its type may be stored (as a value) and whether it may be part of
 * the primary key (as a key) — and, when it may not, why, and what to use instead. And DT-6's non-deterministic
 * columns and tables (owner decision Q61): identity and `serial` columns, defaults that are not immutable, and public
 * schemas holding a sequence or an unlogged table.
 *
 * **One source.** Every reason and alternative here comes from `design.md` §4's column-type table and the paragraph
 * above it, adapted into sentences for a module developer who has never read DT-1 or DT-6. Each rule keeps its row's
 * four cells, or its sentence, verbatim (`design`), and `test/determinism/column-rules.test.ts` fails when the design
 * and the rules part ways. The contents hash (DT-3) refuses with these rules in every public schema; task 7.1's
 * migration-time check (DT-6) calls the same {@link tableRefusals}, {@link relationRefusals} (or
 * {@link databaseRefusals}) and {@link refusalMessage}, adding the module's id, so a refusal reads the same in both.
 *
 * **The input** is what PostgreSQL's catalog says about a column ({@link ColumnFacts}), nothing more: the type's name
 * (`format_type(atttypid, NULL)`), the declared type for messages (`format_type(atttypid, atttypmod)`), the type
 * modifier (`atttypmod`, which holds `numeric`'s declared scale), the kind of type (`pg_type.typtype`, which tells
 * enums, domains, composite, range and multirange types apart, whatever their name) and of an array's element, whether
 * the column is in the primary key, whether it is an identity column (`attidentity`), and what in its default is not
 * immutable (read from `pg_attrdef.adbin` by {@link parseExpressionTree}, {@link defaultReferences} and
 * {@link notImmutableParts}); and about a relation ({@link RelationFacts}): `relkind` and `relpersistence`.
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
  /**
   * `pg_attribute.attidentity`: `always` (`GENERATED ALWAYS AS IDENTITY`, `a`), `by default` (`BY DEFAULT`, `d`), or
   * null for a column that is no identity column.
   */
  readonly identity: "always" | "by default" | null;
  /**
   * What the column's default does that PostgreSQL does not treat as immutable, in the order its expression tree lists
   * it ({@link notImmutableParts}); empty when the column has no default or an immutable one. A generated column's
   * expression is no default: PostgreSQL requires it to be immutable, and computes it from the row.
   */
  readonly notImmutable: readonly DefaultPart[];
}

/** A table as PostgreSQL's catalog describes it: its columns in column order. */
export interface TableFacts {
  readonly schema: string;
  readonly name: string;
  readonly columns: readonly ColumnFacts[];
}

/** A relation of a public schema as PostgreSQL's catalog describes it: a table (a partition included) or a sequence. */
export interface RelationFacts {
  readonly schema: string;
  readonly name: string;
  /** `pg_class.relkind`: `S` sequence, `r` table (a partition included), `p` partitioned table. */
  readonly kind: string;
  /** `pg_class.relpersistence`: `p` permanent, `u` unlogged. */
  readonly persistence: string;
}

// ── the rules ───────────────────────────────────────────────────────────────────────────────────────────────────────

/** The codes of DT-6's startup refusals that the rules decide (`design.md` §11). */
export type RefusalCode =
  | "no-primary-key"
  | "unsupported-key-type"
  | "unsupported-column-type"
  | "non-deterministic-column"
  | "non-deterministic-table";

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

// `real` and `double precision`: DT-6 refuses floating-point columns with `non-deterministic-column`. 0.1 + 0.2
// against 0.3 differs in double precision only; in real, 0.1 + 0.2 equals 0.3, so real has its own example (Q60).
const FLOATING_POINT: RefusedRule = {
  id: "floating-point",
  design: {
    type: "`real`, `double precision`",
    value: "refused (`non-deterministic-column`)",
    key: "refused",
    because:
      "Approximate: a value computed two ways can differ in its last bits (Q60: in `double precision`, `0.1 + 0.2` " +
      "is `0.30000000000000004`, not `0.3`; in `real`, `0.1 + 0.6` is `0.70000005`, not `0.7`); use integers in " +
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
const MILLISECOND_DATE = (type: string): string =>
  `The drivers return a ${type} as a JavaScript Date, which keeps milliseconds only (10:00:00.123456 and ` +
  "10:00:00.123999 read back equal)";
const TIME_OF_DAY: Because = {
  reason:
    "UmbraDB defines no canonical encoding for a time of day (time, timetz): the drivers return its text, and, as " +
    "for every date and time type, an encoding would need a rule of its own",
  alternative: MILLISECONDS,
};

// Date and time types: refused (Q58, option D kept them out). `postgres` 3.4.9 (src/types.js:28-32) and PGlite 0.5.10
// parse `date`, `timestamp` and `timestamptz` into a `Date` (milliseconds only); `time`, `timetz` and `interval` come
// back as text. `date` and `timestamp` text follows DateStyle, `timestamptz` also TimeZone, `interval` IntervalStyle;
// `time` and `timetz` text follows no setting (checked on PostgreSQL 17.11 and PGlite 0.5.10, Q59), so their reason is
// the one Q58 gives for every date and time type: an encoding would need its own rule. Each reason names its type as
// the row does.
const DATE_TIME: RefusedRule = {
  id: "date-time",
  design: {
    type: "`timestamptz`, `timestamp`, `date`, `time`, `timetz`, `interval`",
    value: "refused",
    key: "refused",
    because:
      "Per type (Q59): `timestamptz` and `timestamp` — the drivers return a JavaScript `Date`, which keeps " +
      "milliseconds only (`10:00:00.123456` and `10:00:00.123999` read back equal), and the text depends on " +
      "`DateStyle` (and, for `timestamptz`, `TimeZone`); `date` — the drivers return a JavaScript `Date`, and the " +
      "text depends on `DateStyle` (`2026-10-23` or `23/10/2026`); `interval` — the drivers return its text, which " +
      "depends on `IntervalStyle` (`1 day 02:00:00` or `P1DT2H`); `time` and `timetz` — no canonical encoding is " +
      "defined for a time of day (the drivers return its text). Store `bigint` milliseconds since the epoch, as " +
      "`core_block_commit.blocks.block_timestamp_ms` does",
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
        reason: `${MILLISECOND_DATE("timestamptz")}, and its text depends on the TimeZone and DateStyle settings`,
        alternative: SINCE_EPOCH,
      },
      "timestamp without time zone": {
        reason: `${MILLISECOND_DATE("timestamp")}, and its text depends on the DateStyle setting`,
        alternative: SINCE_EPOCH,
      },
      date: {
        reason:
          "The drivers return a date as a JavaScript Date, and its text depends on the DateStyle setting (2026-10-23 " +
          "or 23/10/2026)",
        alternative: SINCE_EPOCH,
      },
      interval: {
        reason:
          "The drivers return an interval as its text, which depends on the IntervalStyle setting (1 day 02:00:00 or " +
          "P1DT2H)",
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

// DT-6's sequence and unlogged-table refusals, one sentence each, with its reason and alternative (owner decisions
// Q61, Q64).
const SEQUENCE_DESIGN =
  "A public schema holding a sequence is refused with `non-deterministic-table` (Q61): module code can draw from a " +
  "sequence at any time, and its values depend on retries; derive values from the block (height, transaction index), " +
  "and drop the sequence (Q64).";
const UNLOGGED_DESIGN =
  "A public schema holding an unlogged table is refused with `non-deterministic-table` (Q61): PostgreSQL empties an " +
  "unlogged table after a crash, while the cursor still records its blocks as committed; make the table logged: " +
  "create it without `UNLOGGED`, or run `ALTER TABLE ... SET LOGGED` (Q64).";

/**
 * The refusals of the paragraph above the column-type table, each with its sentence verbatim (`design`). A refusal of
 * an identity, `serial` or default column says, after `what`, what in the column draws from a sequence or is not
 * immutable ({@link tableRefusals}).
 */
export const TABLE_RULES: {
  readonly noPrimaryKey: TableRule;
  readonly identityOrSerial: TableRule;
  readonly nonImmutableDefault: TableRule;
  readonly sequence: TableRule;
  readonly unloggedTable: TableRule;
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
  // A sequence's value survives the rollback of the block that drew it. An identity column draws from its own
  // sequence; a `serial` column is an integer column whose default calls nextval() on one.
  identityOrSerial: {
    code: "non-deterministic-column",
    what: "the column draws its values from a sequence",
    design:
      "An identity or `serial` column is refused with `non-deterministic-column`: a sequence never rolls back, so " +
      "its next value depends on rolled-back and retried blocks, not only on the chain; derive keys from the block " +
      "(height, transaction index).",
    because: {
      reason:
        "A sequence, such as the one behind an identity or serial column, never rolls back, so its next value " +
        "depends on rolled-back and retried blocks, not only on the chain",
      alternative: "derive keys from the block (height, transaction index)",
    },
  },
  // PostgreSQL evaluates a default on each insert, on each machine.
  nonImmutableDefault: {
    code: "non-deterministic-column",
    what: "the column's default is not immutable",
    design:
      "A default that is not immutable is refused with `non-deterministic-column`: it calls a function PostgreSQL " +
      "marks stable or volatile (`now()`, `random()`, `gen_random_uuid()`) or uses an SQL value function " +
      "(`CURRENT_TIMESTAMP`, `CURRENT_USER`), so each machine, or each retry, gets a different value; compute the " +
      "value from the block in `on-db-write`.",
    because: {
      reason:
        "PostgreSQL evaluates a default on each insert, and when the default calls a function PostgreSQL marks " +
        "stable or volatile (now(), random(), gen_random_uuid()) or uses an SQL value function (CURRENT_TIMESTAMP, " +
        "CURRENT_USER), each machine, or each retry, gets a different value",
      alternative: "compute the value from the block in on-db-write",
    },
  },
  // Module code may call nextval() on any sequence of its schema, in any block. The alternative is the identity and
  // serial rule's, for values as for keys (owner decision Q64).
  sequence: {
    code: "non-deterministic-table",
    what: "a public schema cannot hold a sequence",
    design: SEQUENCE_DESIGN,
    because: {
      reason:
        "Module code can draw from a sequence at any time, and a sequence never rolls back, so its values depend on " +
        "rolled-back and retried blocks, not only on the chain",
      alternative: "derive values from the block (height, transaction index), and drop the sequence",
    },
  },
  // An unlogged table is not written to the write-ahead log; crash recovery truncates it, while the blocks whose rows
  // it held stay committed in the cursor. The alternative is the table made logged (owner decision Q64).
  unloggedTable: {
    code: "non-deterministic-table",
    what: "a public schema cannot hold an unlogged table",
    design: UNLOGGED_DESIGN,
    because: {
      reason:
        "PostgreSQL empties an unlogged table after a crash, while the cursor still records its blocks as committed, " +
        "so the table loses rows the chain still holds",
      alternative: "make the table logged: create it without UNLOGGED, or run ALTER TABLE ... SET LOGGED",
    },
  },
};

/**
 * The paragraph's sentences on what is allowed and on how the rules detect it, verbatim. The detection reads every
 * function id the sentence names ({@link FUNCTION_ID_FIELDS}) and every node it names, as PostgreSQL's own check
 * (`contain_mutable_functions`) reads them: conversions through input and output functions, row comparisons,
 * `SQLVALUEFUNCTION`, `NEXTVALUEEXPR`, and SQL/JSON nodes, which it refuses outright (owner decisions Q62, Q63;
 * {@link defaultReferences}).
 */
export const DEFAULT_DESIGN = {
  allowed:
    "An immutable default (`'abc'`, `1 + 2`, `lower('X')`) and a stored generated column, which PostgreSQL requires " +
    "to be immutable, are allowed.",
  detection:
    "Detection, checked on PostgreSQL 17.11 and PGlite 0.5.10: `pg_attribute.attidentity`; a default's expression " +
    "tree (`pg_attrdef.adbin`), read as stored, as PostgreSQL's own immutability check reads it (Q62): every " +
    "function id (`:funcid`, and `:opfuncid`, `:hashfuncid` and `:negfuncid` for operators, an operator stored " +
    "without one read through `pg_operator`), each looked up in `pg_proc.provolatile`; a conversion through text " +
    "(`COERCEVIAIO`: the result type's input function and the argument type's output function); a row comparison's " +
    "operators (`ROWCOMPAREEXPR`); an SQL value function (`SQLVALUEFUNCTION`, stable) and `NEXTVALUEEXPR` " +
    "(volatile), which have no function id; SQL/JSON constructors and queries, refused outright because the tree " +
    "does not record whether they are immutable (Q63); a branch that can never run still counts, since the tree is " +
    "read without PostgreSQL's constant folding (Q63); `pg_class.relkind = 'S'` for a sequence and `relpersistence = " +
    "'u'` for an unlogged table.",
} as const;

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
 * Every refusal of a table, in a fixed order: a missing primary key first, then each refused column in column order,
 * and for each column its type (no default can make a type storable), its identity, what in its default draws from a
 * sequence (a `serial` column's `nextval()`), then the rest of its default that is not immutable. Empty when the table
 * may be stored, hashed and digested. The contents hash refuses with the first refusal of the database
 * ({@link databaseRefusals}); so will startup.
 */
export function tableRefusals(table: TableFacts): Refusal[] {
  const refusals: Refusal[] = [];
  if (!table.columns.some((column) => column.inPrimaryKey)) {
    const { code, what, because } = TABLE_RULES.noPrimaryKey;
    refusals.push({ code, column: null, what, because });
  }
  for (const column of table.columns) {
    const where = { name: column.name, declaredType: column.declaredType };
    const verdict = columnVerdict(column);
    if (!verdict.allowed) {
      refusals.push({
        code: verdict.code,
        column: where,
        what: verdict.code === "unsupported-key-type" ? REFUSED_AS_KEY : REFUSED_AS_VALUE,
        because: verdict.because,
      });
    }
    const { identityOrSerial, nonImmutableDefault } = TABLE_RULES;
    if (column.identity !== null) {
      const clause = column.identity === "always" ? "ALWAYS" : "BY DEFAULT";
      const what = `${identityOrSerial.what}: it is an identity column (GENERATED ${clause} AS IDENTITY)`;
      refusals.push({ code: identityOrSerial.code, column: where, what, because: identityOrSerial.because });
    }
    const draws = column.notImmutable.filter((part) => part.drawsFromSequence);
    if (draws.length > 0) {
      const what = `${identityOrSerial.what}: its default ${draws.map((part) => part.does).join("; it ")}`;
      refusals.push({ code: identityOrSerial.code, column: where, what, because: identityOrSerial.because });
    }
    const rest = column.notImmutable.filter((part) => !part.drawsFromSequence);
    if (rest.length > 0) {
      const lead = rest.every((part) => part.undecided) ? UNDECIDED_DEFAULT : nonImmutableDefault.what;
      const what = `${lead}: it ${rest.map((part) => part.does).join("; it ")}`;
      refusals.push({ code: nonImmutableDefault.code, column: where, what, because: nonImmutableDefault.because });
    }
  }
  return refusals;
}

/**
 * The refusal of a relation of a public schema: every sequence (an identity or `serial` column's own included), and
 * every unlogged table, partitioned table or partition; nothing for a logged table (DT-6, owner decision Q61).
 */
export function relationRefusals(relation: RelationFacts): Refusal[] {
  const isTable = relation.kind === "r" || relation.kind === "p";
  const rule =
    relation.kind === "S"
      ? TABLE_RULES.sequence
      : isTable && relation.persistence === "u"
        ? TABLE_RULES.unloggedTable
        : null;
  return rule === null ? [] : [{ code: rule.code, column: null, what: rule.what, because: rule.because }];
}

/**
 * Where a refusal is: the module (startup only; at hash time the schema stands in for it), the schema, and the table
 * or, for a sequence, the sequence.
 */
export type RefusalPlace =
  | { readonly module?: string; readonly schema: string; readonly table: string }
  | { readonly module?: string; readonly schema: string; readonly sequence: string };

/** A refusal and where it is. */
export interface PlacedRefusal {
  readonly refusal: Refusal;
  readonly place: RefusalPlace;
}

/**
 * Every refusal of a database's public tables and relations, in a fixed order: each table's refusals
 * ({@link tableRefusals}) in the order the tables are given, then each relation's ({@link relationRefusals}) in the
 * order given — `catalogTables` and `catalogRelations` of `./public-tables.ts` give DT-3's (by schema, then name, as
 * bytes). Tables come first because a column is what a developer wrote: an identity or `serial` column's sequence is
 * refused too, but it is dropped with its column, so the column's refusal is the one to read first.
 */
export function databaseRefusals(
  tables: readonly TableFacts[],
  relations: readonly RelationFacts[],
): PlacedRefusal[] {
  const placed: PlacedRefusal[] = [];
  for (const table of tables) {
    const place = { schema: table.schema, table: table.name };
    for (const refusal of tableRefusals(table)) placed.push({ refusal, place });
  }
  for (const relation of relations) {
    const place =
      relation.kind === "S"
        ? { schema: relation.schema, sequence: relation.name }
        : { schema: relation.schema, table: relation.name };
    for (const refusal of relationRefusals(relation)) placed.push({ refusal, place });
  }
  return placed;
}

/**
 * The message of a refusal, for a developer who has never read DT-1 or DT-6: the code, where (module, table or
 * sequence, column and its declared type), what is refused, why, and what to use instead. The contents hash and startup
 * give it alike.
 */
export function refusalMessage(refusal: Refusal, place: RefusalPlace): string {
  return `${refusal.code}: ${describeLocation(place, refusal.column)}: ${explainRefusal(refusal)}`;
}

/** The location part of a message: `module "m", table "s"."t", column "c" (declared type)`, or `sequence "s"."q"`. */
export function describeLocation(
  place: RefusalPlace,
  column: { readonly name: string; readonly declaredType: string } | null,
): string {
  const parts = place.module === undefined ? [] : [`module ${JSON.stringify(place.module)}`];
  const [kind, name] = "sequence" in place ? ["sequence", place.sequence] : ["table", place.table];
  parts.push(`${kind} ${quoteIdentifier(place.schema)}.${quoteIdentifier(name)}`);
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

// ── defaults that are not immutable (DT-6, owner decision Q61) ──────────────────────────────────────────────────────
//
// PostgreSQL stores a default as an expression tree (`pg_attrdef.adbin`, type `pg_node_tree`, written by outfuncs.c).
// A default is immutable when PostgreSQL's own check, `contain_mutable_functions` (clauses.c, with
// `check_functions_in_node` of nodeFuncs.c; read at REL_17_STABLE, 2026-10-23), finds nothing in it: every function it
// calls is marked immutable in `pg_proc.provolatile`, and it holds no SQL value function and no `NEXTVALUEEXPR`. The
// functions a node calls are its function ids (`:funcid`; `:opfuncid`, and for an array operator `:hashfuncid` and
// `:negfuncid`, of an operator), the input function of the result type and the output function of the argument type
// of a conversion through text (`COERCEVIAIO`, which lists no function id), and the operators' functions of a row
// comparison (`ROWCOMPAREEXPR`, which lists operators). Two kinds PostgreSQL decides from their arguments' types or
// their jsonpath — SQL/JSON constructors (`JSON_OBJECT`, …) and queries (`JSON_VALUE`, …) — are refused outright here,
// which refuses some that PostgreSQL would call immutable (decision record Q63). Everything is read as stored, without
// PostgreSQL's constant folding, so `CASE WHEN true THEN 1 ELSE random() END` is refused although it never calls
// random(). Aggregates, window functions and subqueries cannot be in a default (PostgreSQL refuses them there).
// Checked on PostgreSQL 17.11 and PGlite 0.5.10 (PostgreSQL 18.6), whose trees agree.

/** A node of PostgreSQL's expression-tree text: its kind (`FUNCEXPR`, `CONST`, …) and its fields, in order. */
export interface TreeNode {
  readonly kind: string;
  /** Each field's value: its items, usually one (a token, a node or a list), several for a `Const`'s `:constvalue`. */
  readonly fields: ReadonlyMap<string, readonly TreeItem[]>;
}

/** A parenthesised list: of nodes (`({…} {…})`), or of numbers after a marker (`(o 2358 97)`, OIDs). */
export interface TreeList {
  readonly list: readonly TreeItem[];
}

/** A token (`1184`, `true`, `<>` for no value), a node or a list. */
export type TreeItem = TreeNode | TreeList | string;

/**
 * Parses PostgreSQL's expression-tree text as `pg_attrdef.adbin::text` gives it, tokenized as PostgreSQL's reader does
 * (`pg_strtok`, read.c): `{`, `}`, `(` and `)` are tokens of their own, every other token runs to whitespace or to one
 * of them, and a backslash makes the next character part of the token. A field's value is its first item and every
 * following item up to the next `:field` (a `Const`'s `:constvalue 4 [ 1 0 0 0 ]` is several). Throws on text that is
 * not one well-formed node.
 */
export function parseExpressionTree(text: string): TreeNode {
  const tokens = tokenize(text);
  let at = 0;
  const fail = (why: string): never => {
    throw new Error(`malformed expression tree (${why}): ${text.slice(0, 200)}`);
  };
  const is = (token: Token | undefined, char: string): boolean => token?.structural === true && token.text === char;
  const startsField = (token: Token | undefined): boolean => token?.structural === false && token.text.startsWith(":");
  const item = (): TreeItem => {
    const token = tokens[at++];
    if (token === undefined) return fail("it ends inside a node");
    if (!token.structural) return token.text;
    if (token.text === "{") return node();
    if (token.text === "(") return list();
    return fail(`an unexpected "${token.text}"`);
  };
  const node = (): TreeNode => {
    const kind = tokens[at++];
    if (kind === undefined || kind.structural) return fail("a node without a kind");
    const fields = new Map<string, TreeItem[]>();
    while (!is(tokens[at], "}")) {
      const field = tokens[at++];
      if (!startsField(field)) return fail(`${JSON.stringify(field?.text ?? "the end")} where a field was expected`);
      if (is(tokens[at], "}")) return fail(`the field ${field?.text} has no value`);
      const values = [item()];
      while (at < tokens.length && !is(tokens[at], "}") && !startsField(tokens[at])) values.push(item());
      fields.set((field as Token).text.slice(1), values);
    }
    at++;
    return { kind: kind.text, fields };
  };
  const list = (): TreeList => {
    const items: TreeItem[] = [];
    while (!is(tokens[at], ")")) items.push(item());
    at++;
    return { list: items };
  };
  if (!is(tokens[at++], "{")) fail("it does not start with a node");
  const root = node();
  if (at !== tokens.length) fail("text follows the node");
  return root;
}

/** The function-id fields of a tree's nodes, read wherever they occur (`design.md` §4's detection). */
export const FUNCTION_ID_FIELDS = ["funcid", "opfuncid", "hashfuncid", "negfuncid"] as const;

/** Something a default does that the catalog decides is immutable or not, or that is not immutable in itself. */
export type DefaultReference =
  /** A function id. */
  | { readonly kind: "function"; readonly oid: string }
  /** An operator whose function the node does not list (a row comparison's, or one stored without its function id). */
  | { readonly kind: "operator"; readonly oid: string }
  /** A conversion through text: the input function of `to`, the output function of `from` (null: not determined). */
  | { readonly kind: "conversion"; readonly from: string | null; readonly to: string }
  /** An SQL value function (`CURRENT_TIMESTAMP`, …): stable, whichever it is. `op` is `SQLValueFunctionOp`. */
  | { readonly kind: "value-function"; readonly op: number }
  /** A `NEXTVALUEEXPR`: volatile, it draws from a sequence. */
  | { readonly kind: "next-value" }
  /** An SQL/JSON constructor or query, refused outright. */
  | { readonly kind: "sql-json"; readonly node: "constructor" | "query" };

/**
 * What a default's expression tree does that may not be immutable, in tree order (each node before its fields' nodes,
 * fields in the order stored): what `contain_mutable_functions` checks, node by node (see the section's comment).
 */
export function defaultReferences(tree: TreeNode): DefaultReference[] {
  const found: DefaultReference[] = [];
  const visit = (node: TreeNode): void => {
    for (const field of FUNCTION_ID_FIELDS) {
      const oid = tokenOf(node, field);
      if (oid !== null && oid !== "0") found.push({ kind: "function", oid: checkedOid(oid) });
    }
    // PostgreSQL's set_opfuncid: an operator stored without its function id is read through its operator.
    if (OPERATOR_NODES.has(node.kind) && tokenOf(node, "opfuncid") === "0") {
      found.push({ kind: "operator", oid: checkedOid(tokenOf(node, "opno")) });
    }
    switch (node.kind) {
      case "COERCEVIAIO": {
        const from = typeOf(childOf(node, "arg"));
        const to = checkedOid(tokenOf(node, "resulttype"));
        found.push({ kind: "conversion", from: from === null ? null : checkedOid(from), to });
        break;
      }
      case "ROWCOMPAREEXPR":
        // `:opnos (o 2358 97)`: the marker, then the operators.
        for (const oid of listOf(node, "opnos").slice(1)) {
          found.push({ kind: "operator", oid: checkedOid(String(oid)) });
        }
        break;
      case "SQLVALUEFUNCTION":
        found.push({ kind: "value-function", op: Number(tokenOf(node, "op")) });
        break;
      case "NEXTVALUEEXPR":
        found.push({ kind: "next-value" });
        break;
      case "JSONCONSTRUCTOREXPR":
        found.push({ kind: "sql-json", node: "constructor" });
        break;
      case "JSONEXPR":
        found.push({ kind: "sql-json", node: "query" });
        break;
    }
    for (const items of node.fields.values()) for (const each of items) visitItem(each);
  };
  const visitItem = (each: TreeItem): void => {
    if (typeof each === "string") return;
    if ("kind" in each) visit(each);
    else for (const inner of each.list) visitItem(inner);
  };
  visit(tree);
  return found;
}

/** A function as the catalog describes it, for a default's message. */
export interface CatalogFunction {
  /** `name()`, qualified by its schema outside `pg_catalog` (`now()`, `m.next_id()`). */
  readonly name: string;
  /** `pg_proc.provolatile`: `i` immutable, `s` stable, `v` volatile. */
  readonly volatility: string;
  /** Whether it is `pg_catalog.nextval(regclass)`, which draws from a sequence. */
  readonly nextval: boolean;
}

/** A type as the catalog describes it: its name (`format_type`) and its input and output functions. */
export interface CatalogType {
  readonly name: string;
  readonly input: CatalogFunction;
  readonly output: CatalogFunction;
}

/** What the catalog says about the functions, operators (their functions) and types a set of defaults refers to. */
export interface DefaultCatalog {
  readonly functions: ReadonlyMap<string, CatalogFunction>;
  readonly operators: ReadonlyMap<string, CatalogFunction>;
  readonly types: ReadonlyMap<string, CatalogType>;
}

/** The OIDs of the functions, operators and types to read from the catalog for `references`, each once, by number. */
export function catalogNeeds(references: readonly DefaultReference[]): {
  readonly functions: string[];
  readonly operators: string[];
  readonly types: string[];
} {
  const functions = new Set<string>();
  const operators = new Set<string>();
  const types = new Set<string>();
  for (const reference of references) {
    if (reference.kind === "function") functions.add(reference.oid);
    if (reference.kind === "operator") operators.add(reference.oid);
    if (reference.kind === "conversion") {
      types.add(reference.to);
      if (reference.from !== null) types.add(reference.from);
    }
  }
  const byNumber = (set: Set<string>): string[] => [...set].sort((a, b) => Number(a) - Number(b));
  return { functions: byNumber(functions), operators: byNumber(operators), types: byNumber(types) };
}

/** Something in a column's default that PostgreSQL does not treat as immutable, or that UmbraDB cannot judge. */
export interface DefaultPart {
  /** What it does, as a clause after "it": `calls now(), which PostgreSQL marks stable`. */
  readonly does: string;
  /** Whether it draws from a sequence: `nextval()`, or a `NEXTVALUEEXPR`. */
  readonly drawsFromSequence: boolean;
  /**
   * Whether it is refused without knowing whether it is immutable (an SQL/JSON node, or a conversion from a type that
   * is not determined): PostgreSQL may call it immutable, so a refusal of such parts alone does not say the default is
   * not immutable.
   */
  readonly undecided: boolean;
}

/**
 * What in a default is not immutable, in tree order, each said once: the functions PostgreSQL marks stable or volatile
 * that it calls (a conversion's input function before its output function, as PostgreSQL checks them), the SQL value
 * functions it uses, its sequence draws, and its SQL/JSON nodes and conversions from an undetermined type (refused
 * outright). Throws when the catalog does not list something the tree names: the read was not of one catalog.
 */
export function notImmutableParts(references: readonly DefaultReference[], catalog: DefaultCatalog): DefaultPart[] {
  const parts = new Map<string, DefaultPart>();
  const add = (does: string, drawsFromSequence = false, undecided = false): void => {
    if (!parts.has(does)) parts.set(does, { does, drawsFromSequence, undecided });
  };
  const marked = (fn: CatalogFunction): string =>
    `${fn.name}, which PostgreSQL marks ${fn.volatility === "s" ? "stable" : "volatile"}`;
  for (const reference of references) {
    switch (reference.kind) {
      case "function":
      case "operator": {
        const fn = listed(reference.kind === "function" ? catalog.functions : catalog.operators, reference);
        if (fn.volatility !== IMMUTABLE) add(`calls ${marked(fn)}`, fn.nextval);
        break;
      }
      case "conversion": {
        const to = listed(catalog.types, { kind: "type", oid: reference.to });
        const from = reference.from === null ? null : listed(catalog.types, { kind: "type", oid: reference.from });
        const fromName = from?.name ?? "a value of a type UmbraDB cannot determine";
        if (to.input.volatility !== IMMUTABLE) add(`converts ${fromName} to ${to.name} with ${marked(to.input)}`);
        if (from === null) {
          add(`converts ${fromName} to ${to.name}, through an output function it cannot check`, false, true);
        } else if (from.output.volatility !== IMMUTABLE) {
          add(`converts ${fromName} to ${to.name} with ${marked(from.output)}`);
        }
        break;
      }
      case "value-function": {
        const name = SQL_VALUE_FUNCTIONS[reference.op];
        const used = name === undefined ? "an SQL value function" : `${name}, an SQL value function`;
        add(`uses ${used}, which PostgreSQL treats as stable`);
        break;
      }
      case "next-value":
        add("draws from a sequence", true);
        break;
      case "sql-json":
        add(reference.node === "constructor" ? SQL_JSON_CONSTRUCTOR : SQL_JSON_QUERY, false, true);
        break;
    }
  }
  return [...parts.values()];
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

// ── internals of the default detection ──

interface Token {
  readonly text: string;
  readonly structural: boolean;
}

/** PostgreSQL's pg_strtok, over the whole text: whitespace is space, newline and tab. */
function tokenize(text: string): Token[] {
  const tokens: Token[] = [];
  const ends = (char: string): boolean => char === " " || char === "\n" || char === "\t" || "{}()".includes(char);
  let at = 0;
  while (at < text.length) {
    const char = text[at] as string;
    if (char === " " || char === "\n" || char === "\t") {
      at++;
    } else if ("{}()".includes(char)) {
      tokens.push({ text: char, structural: true });
      at++;
    } else {
      let token = "";
      while (at < text.length && !ends(text[at] as string)) {
        const escaped = text[at] === "\\" && at + 1 < text.length;
        token += text[escaped ? at + 1 : at];
        at += escaped ? 2 : 1;
      }
      tokens.push({ text: token, structural: false });
    }
  }
  return tokens;
}

const IMMUTABLE = "i";
const BOOLEAN_OID = "16";

/** Operator nodes whose function id PostgreSQL fills in from the operator when it is 0 (set_opfuncid). */
const OPERATOR_NODES: ReadonlySet<string> = new Set(["OPEXPR", "DISTINCTEXPR", "NULLIFEXPR", "SCALARARRAYOPEXPR"]);

/** The field holding the result type of each node kind that holds it (PostgreSQL's exprType, nodeFuncs.c). */
const TYPE_FIELDS: Readonly<Record<string, string>> = {
  CONST: "consttype",
  FUNCEXPR: "funcresulttype",
  OPEXPR: "opresulttype",
  DISTINCTEXPR: "opresulttype",
  NULLIFEXPR: "opresulttype",
  RELABELTYPE: "resulttype",
  COERCEVIAIO: "resulttype",
  ARRAYCOERCEEXPR: "resulttype",
  CONVERTROWTYPEEXPR: "resulttype",
  FIELDSELECT: "resulttype",
  FIELDSTORE: "resulttype",
  COERCETODOMAIN: "resulttype",
  COERCETODOMAINVALUE: "typeId",
  CASEEXPR: "casetype",
  CASETESTEXPR: "typeId",
  ARRAYEXPR: "array_typeid",
  ROWEXPR: "row_typeid",
  COALESCEEXPR: "coalescetype",
  MINMAXEXPR: "minmaxtype",
  SQLVALUEFUNCTION: "type",
  SUBSCRIPTINGREF: "refrestype",
  NEXTVALUEEXPR: "typeId",
};
/** Node kinds whose type is `boolean` (exprType's BOOLOID cases). */
const BOOLEAN_NODES: ReadonlySet<string> = new Set([
  "BOOLEXPR",
  "SCALARARRAYOPEXPR",
  "ROWCOMPAREEXPR",
  "NULLTEST",
  "BOOLEANTEST",
  "JSONISPREDICATE",
]);
/** Node kinds whose type is that of one of their fields' node. */
const TYPED_BY_FIELD: Readonly<Record<string, string>> = {
  COLLATEEXPR: "arg",
  NAMEDARGEXPR: "arg",
  JSONVALUEEXPR: "formatted_expr",
};

/**
 * The type of an expression node, as PostgreSQL's exprType gives it, for the node kinds a default can hold; null for
 * a kind not listed (an `XMLEXPR`, whose type depends on its operation), so that its conversion fails closed.
 */
function typeOf(node: TreeNode | null): string | null {
  if (node === null) return null;
  if (BOOLEAN_NODES.has(node.kind)) return BOOLEAN_OID;
  const field = TYPED_BY_FIELD[node.kind];
  if (field !== undefined) return typeOf(childOf(node, field));
  // SQL/JSON constructors and queries: the type of their RETURNING clause.
  if (node.kind === "JSONCONSTRUCTOREXPR" || node.kind === "JSONEXPR") {
    return tokenOf(childOf(node, "returning"), "typid");
  }
  const typeField = TYPE_FIELDS[node.kind];
  return typeField === undefined ? null : tokenOf(node, typeField);
}

/** A field's value when it is a token, else null. */
function tokenOf(node: TreeNode | null, field: string): string | null {
  const first = node?.fields.get(field)?.[0];
  return typeof first === "string" ? first : null;
}

/** A field's value when it is a node, else null (`<>`, no value). */
function childOf(node: TreeNode, field: string): TreeNode | null {
  const first = node.fields.get(field)?.[0];
  return typeof first === "object" && "kind" in first ? first : null;
}

/** A field's value when it is a list, its items; else none. */
function listOf(node: TreeNode, field: string): readonly TreeItem[] {
  const first = node.fields.get(field)?.[0];
  return typeof first === "object" && "list" in first ? first.list : [];
}

/** An OID read from a tree: decimal digits only, since it is written into the catalog query as a literal. */
function checkedOid(text: string | null): string {
  if (text === null || !/^[0-9]+$/.test(text)) {
    throw new Error(`malformed expression tree: ${JSON.stringify(text)} is not an OID`);
  }
  return text;
}

/** The catalog's entry for an OID the tree names. */
function listed<T>(entries: ReadonlyMap<string, T>, reference: { readonly kind: string; readonly oid: string }): T {
  const entry = entries.get(reference.oid);
  if (entry === undefined) throw new Error(`the catalog lists no ${reference.kind} ${reference.oid}`);
  return entry;
}

/** SQLValueFunctionOp's names, by number (primnodes.h; the same in PostgreSQL 17 and 18). */
const SQL_VALUE_FUNCTIONS: readonly string[] = [
  "CURRENT_DATE",
  "CURRENT_TIME",
  "CURRENT_TIME",
  "CURRENT_TIMESTAMP",
  "CURRENT_TIMESTAMP",
  "LOCALTIME",
  "LOCALTIME",
  "LOCALTIMESTAMP",
  "LOCALTIMESTAMP",
  "CURRENT_ROLE",
  "CURRENT_USER",
  "USER",
  "SESSION_USER",
  "CURRENT_CATALOG",
  "CURRENT_SCHEMA",
];

const SQL_JSON_CONSTRUCTOR =
  "uses an SQL/JSON constructor (JSON_OBJECT, JSON_ARRAY, JSON, JSON_SCALAR or JSON_SERIALIZE), whose result can " +
  "depend on session settings (a timestamptz is written in the session's TimeZone); UmbraDB does not check its " +
  "arguments' types, so it refuses every such default";
const SQL_JSON_QUERY =
  "uses JSON_VALUE, JSON_QUERY or JSON_EXISTS, whose result can depend on the session's TimeZone; UmbraDB does not " +
  "check its path, so it refuses every such default";

/** What a refusal of a default says when everything refused in it is refused without knowing (`undecided`). */
const UNDECIDED_DEFAULT = "UmbraDB cannot tell that the column's default is immutable";

// ── internals of the column-type rules ──

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
