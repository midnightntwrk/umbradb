/**
 * The `jsonb` and `numeric` `CHECK`s: stored numbers are integers, so two databases whose contents hashes are equal
 * also answer queries alike. The value encoding writes a `numeric` as its integer text and fails on a fraction, and
 * writes `jsonb` parsed, where `1.0` and `1` are the same number. These `CHECK`s refuse, when the row is written, what
 * the encoding would fail on or would hide. [DT-1, DT-6, Q57, Q58; design §4]
 *
 * - **`core_chain.jsonb_numbers_ok(jsonb)`** is false when the document holds, at any depth, a JSON number that is
 *   either outside the signed 64-bit range the encoding supports ({@link INTEGER_RULES}), or whose text (`jsonpath`
 *   `.string()`) is not `-?[0-9]+`: a fraction, an exponent PostgreSQL did not resolve into an integer, or a zero
 *   fraction such as `1.0`, whose text keeps its scale. PostgreSQL stores `1e2` as `100`, which passes. [DT-1, Q57]
 * - **`core_chain.numeric_ok(numeric)`** is `c IS NULL OR coalesce(scale(c) = 0, false)`. A value with a fraction
 *   (`100.00` included) is refused, and so are `NaN`, `Infinity` and `-Infinity`, whose `scale()` is NULL: a `CHECK`
 *   passes on NULL, so that NULL must become false. A NULL value stays allowed (checked on PGlite 0.5.10 and
 *   PostgreSQL 18.6). [design §4]
 * - **Their array forms**, `jsonb_numbers_ok(jsonb[])` and `numeric_ok(numeric[])`, apply the same rule to every
 *   element, in any number of dimensions; a NULL element is allowed, as a NULL value is.
 *
 * The functions are SQL functions with a standard body (`RETURN …`). PostgreSQL parses such a body when the function
 * is created and binds it to the objects it names, so no `search_path` reaches it. The functions are immutable. The
 * writer's login creates them in `core_chain` at every startup, so they keep `EXECUTE` for every role (the module
 * roles' revocation applies only to routines a module role creates).
 *
 * The database API adds one `CHECK` per such column of every module table not declared `deterministic: false`
 * (`./opt-out.ts`), named {@link integerCheckName}, and drops those of a table that became opted out
 * (`src/db/module-rules.ts` applies {@link integerCheckStatements}). A `CHECK` on a partitioned table holds on its
 * partitions too.
 */

import { createHash } from "node:crypto";
import type { CatalogTable } from "./catalog.js";
import { quoteIdentifier } from "./column-rules.js";
import { optOut, type TableName } from "./opt-out.js";

/** One rule of a `CHECK`: an id, what it refuses, and its part of the function. */
export interface IntegerRule {
  readonly id: string;
  /** What it refuses, for a reader of the code and of the tests. */
  readonly refuses: string;
}

/** A rule of `jsonb_numbers_ok`: a `jsonpath` condition on a JSON number `@` that refuses it. */
export interface JsonbNumberRule extends IntegerRule {
  readonly condition: string;
}

/** The rules of the two functions (each test of a rule's negative control builds them without it). */
export interface IntegerRules {
  readonly jsonb: readonly JsonbNumberRule[];
  readonly numeric: readonly IntegerRule[];
}

/**
 * The signed 64-bit range of the integers a `jsonb` document may hold (`src/determinism/cbor.ts` encodes no wider one).
 * [DT-1]
 */
const INT64_MIN = "-9223372036854775808";
const INT64_MAX = "9223372036854775807";

/**
 * The rules, in the order the functions apply them. `jsonb`: a JSON number is refused when any condition holds.
 * `numeric`: `null-allowed` makes `c IS NULL OR …`, `not-a-number` the `coalesce(…, false)` that refuses `NaN` and the
 * infinities, `no-fraction` the `scale(c) = 0`: together `c IS NULL OR coalesce(scale(c) = 0, false)`. [design §4]
 */
export const INTEGER_RULES: IntegerRules = {
  jsonb: [
    {
      id: "integer-text",
      refuses: "a number whose text has a fraction or an exponent, a zero fraction such as 1.0 included",
      condition: '!(@.string() like_regex "^-?[0-9]+$")',
    },
    {
      id: "at-least-int64-min",
      refuses: `an integer below ${INT64_MIN}, which the value encoding cannot encode`,
      condition: `@ < ${INT64_MIN}`,
    },
    {
      id: "at-most-int64-max",
      refuses: `an integer above ${INT64_MAX}, which the value encoding cannot encode`,
      condition: `@ > ${INT64_MAX}`,
    },
  ],
  numeric: [
    { id: "null-allowed", refuses: "nothing: a NULL value is allowed, while a CHECK on NULL would refuse it" },
    { id: "not-a-number", refuses: "NaN, Infinity and -Infinity, whose scale() is NULL" },
    { id: "no-fraction", refuses: "a value with a fraction, 100.00 included" },
  ],
};

/** The `jsonpath` that finds, at any depth (`strict`, so no array is unwrapped twice), a number some rule refuses. */
export function refusedNumbersPath(rules: readonly JsonbNumberRule[] = INTEGER_RULES.jsonb): string {
  const refused = rules.length === 0 ? "false" : rules.map((rule) => `(${rule.condition})`).join(" || ");
  return `strict $.** ? (@.type() == "number" && (${refused}))`;
}

/** `numeric_ok`'s predicate on its argument `c`, from its rules. */
export function numericOkPredicate(rules: readonly IntegerRule[] = INTEGER_RULES.numeric): string {
  const has = (id: string): boolean => rules.some((rule) => rule.id === id);
  // Without `no-fraction`, every finite value passes the scale test; `scale()` is still NULL for NaN and infinities.
  const scale = has("no-fraction") ? "pg_catalog.scale(c) = 0" : "pg_catalog.scale(c) >= 0";
  const decided = has("not-a-number") ? `coalesce(${scale}, false)` : scale;
  return has("null-allowed") ? `c IS NULL OR ${decided}` : decided;
}

/** What {@link checkFunctionsSql} builds. */
export interface CheckFunctionsOptions {
  /** The schema the functions are created in: `core_chain`, or another one for a test. */
  readonly schema?: string;
  readonly rules?: IntegerRules;
}

/**
 * The statements that create (or replace) the four functions in `schema` (default `core_chain`): each scalar function
 * from its rules, and each array form calling its scalar function on every element.
 */
export function checkFunctionsSql(options: CheckFunctionsOptions = {}): string[] {
  const schema = quoteIdentifier(options.schema ?? "core_chain");
  const rules = options.rules ?? INTEGER_RULES;
  const head = (name: string, argument: string, type: string): string =>
    `CREATE OR REPLACE FUNCTION ${schema}.${name}(${argument} ${type}) RETURNS boolean LANGUAGE sql IMMUTABLE PARALLEL SAFE`;
  const path = refusedNumbersPath(rules.jsonb).replace(/'/g, "''");
  return [
    `${head("jsonb_numbers_ok", "j", "jsonb")}\n  RETURN NOT pg_catalog.jsonb_path_exists(j, '${path}')`,
    `${head("jsonb_numbers_ok", "a", "jsonb[]")}\n  RETURN NOT EXISTS (SELECT 1 FROM pg_catalog.unnest(a) AS e(j) ` +
      `WHERE NOT ${schema}.jsonb_numbers_ok(e.j))`,
    `${head("numeric_ok", "c", "numeric")}\n  RETURN ${numericOkPredicate(rules.numeric)}`,
    `${head("numeric_ok", "a", "numeric[]")}\n  RETURN NOT EXISTS (SELECT 1 FROM pg_catalog.unnest(a) AS e(c) ` +
      `WHERE NOT ${schema}.numeric_ok(e.c))`,
  ];
}

/** The functions as the database API creates them in `core_chain` at every startup. */
export const CHECK_FUNCTIONS_SQL: readonly string[] = Object.freeze(checkFunctionsSql());

/**
 * The column types that get a `CHECK`, named as `format_type(atttypid, NULL)` names them (an array of any number of
 * dimensions is `T[]`; a `numeric(p)` is `numeric`), with the function backing it.
 */
export const CHECKED_TYPES: Readonly<Record<string, string>> = Object.freeze({
  jsonb: "jsonb_numbers_ok",
  "jsonb[]": "jsonb_numbers_ok",
  numeric: "numeric_ok",
  "numeric[]": "numeric_ok",
});

/** The prefix of every `CHECK` the database API adds, by which it finds its own. */
export const INTEGER_CHECK_PREFIX = "umbradb_integers_";

/** PostgreSQL's longest name, in bytes (`NAMEDATALEN` − 1). */
const NAME_BYTES = 63;

/**
 * The name of the `CHECK` on `column`: the prefix and the column's name when that fits PostgreSQL's 63 bytes, else the
 * prefix and the first 32 hex digits of SHA-256 of the column's name (a longer name would be cut, and two cut names
 * could collide). One per column, so unique within its table.
 */
export function integerCheckName(column: string): string {
  const name = `${INTEGER_CHECK_PREFIX}${column}`;
  if (Buffer.byteLength(name, "utf8") <= NAME_BYTES) return name;
  return `${INTEGER_CHECK_PREFIX}${createHash("sha256").update(column, "utf8").digest("hex").slice(0, 32)}`;
}

/**
 * Lists the `CHECK`s named with {@link INTEGER_CHECK_PREFIX} on the tables (not the partitions) of the schemas given as
 * `$1` (`text[]`): each with its table and name.
 */
export const INTEGER_CHECKS_SQL = `SELECT n.nspname::text AS schema, c.relname::text AS "table", k.conname::text AS name
  FROM pg_catalog.pg_constraint k
  JOIN pg_catalog.pg_class c ON c.oid = k.conrelid
  JOIN pg_catalog.pg_namespace n ON n.oid = c.relnamespace
 WHERE k.contype = 'c' AND NOT c.relispartition AND n.nspname = ANY($1::text[])
   AND starts_with(k.conname::text, '${INTEGER_CHECK_PREFIX}')`;

/** A row of {@link INTEGER_CHECKS_SQL}. */
export interface IntegerCheckRow {
  readonly schema: string;
  readonly table: string;
  readonly name: string;
}

/**
 * The statements that give exactly the listed tables that are not opted out one `CHECK` per column of a type of
 * {@link CHECKED_TYPES}, added where it is missing, and that drop the database API's `CHECK`s from the tables declared
 * `deterministic: false`. `tables` are module tables as `catalogTables` describes them (partitioned tables whole, so
 * their partitions inherit the `CHECK`); `existing` are the `CHECK`s {@link INTEGER_CHECKS_SQL} lists. [DT-6, Q76]
 */
export function integerCheckStatements(
  tables: readonly CatalogTable[],
  existing: readonly IntegerCheckRow[],
  optedOut: readonly TableName[],
): string[] {
  const out = optOut(optedOut);
  const present = new Set(existing.map((row) => JSON.stringify([row.schema, row.table, row.name])));
  const statements: string[] = [];
  for (const table of tables) {
    const target = `${quoteIdentifier(table.schema)}.${quoteIdentifier(table.name)}`;
    if (out.covers({ schema: table.schema, table: table.name })) {
      for (const row of existing) {
        if (row.schema === table.schema && row.table === table.name) {
          statements.push(`ALTER TABLE ${target} DROP CONSTRAINT ${quoteIdentifier(row.name)}`);
        }
      }
      continue;
    }
    for (const column of table.columns) {
      const fn = CHECKED_TYPES[column.type];
      if (fn === undefined) continue;
      const name = integerCheckName(column.name);
      if (present.has(JSON.stringify([table.schema, table.name, name]))) continue;
      statements.push(
        `ALTER TABLE ${target} ADD CONSTRAINT ${quoteIdentifier(name)} ` +
          `CHECK (core_chain.${fn}(${quoteIdentifier(column.name)}))`,
      );
    }
  }
  return statements;
}
