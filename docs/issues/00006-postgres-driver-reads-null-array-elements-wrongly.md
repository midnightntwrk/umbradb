# 00006 — `postgres` 3.4.9 reads a NULL array element as the text "NULL", so equal hashes can hide different rows

- **Status:** OPEN
- **GitHub:** NOT IN GITHUB ISSUE
- **Found:** 2026-10-23, during task 1.3 of `openspec/changes/core-arch` (column-type rules), while writing a
  hand-computed contents-hash oracle for a `varchar[]` column.

## Problem

The `postgres` driver (3.4.9, a dependency) parses array results with its own `arrayParser`, which never turns an
unquoted `NULL` element into `null`. Every array column read through it, the contents hash's included, gets the
element wrong:

| Column | PostgreSQL value | What `postgres` 3.4.9 returns |
|---|---|---|
| `text[]` (any type without a parser: `varchar[]`, `uuid[]`, `numeric[]`, `bytea[]`) | `{x,NULL}` | `["x", "NULL"]` — the same as for `{x,"NULL"}`, the text `'NULL'` |
| `boolean[]` | `{t,NULL}` | `[true, false]` |
| `integer[]`, `smallint[]` | `{1,NULL}` | `[1, NaN]` |
| `bigint[]` (with `postgres.BigInt`) | `{1,NULL}` | throws `SyntaxError: Cannot convert NULL to a BigInt` |
| `jsonb[]` | `{"{}",NULL}` | throws (`JSON.parse("NULL")`) |

So the contents hash (DT-3) of a table holding `ARRAY['x', NULL]` equals that of the same table holding
`ARRAY['x', 'NULL']` — checked on PostgreSQL 17.11 through the test adapter: both gave
`6b911c2ff8e9224e13034d03263ed1f095e54eadf7a607b37a600eda275f9492`. A `boolean[]` NULL silently becomes `false`.
PGlite 0.5.10 parses the same output correctly (an unquoted `NULL` becomes `null`), so the two backends also read such
rows differently, which A55's cross-backend comparison (task 2.2) would catch only if its data held a NULL element.

DT-1 defines arrays "with `null` elements" and the encoder (`src/determinism/cbor.ts`) encodes them; DB-2 does not say
how arrays are mapped.

## Evidence

- `node_modules/postgres/src/types.js:281-316` (`arrayParserLoop`): elements are pushed as `x.slice(...)` or
  `parser(x.slice(...))` at `:305`, `:309` and `:314`, with no check for an unquoted `NULL`; a quoted element (`:291`)
  gives the same string.
- `node_modules/postgres/src/types.js:26` (boolean `parse: x => x === 't'`) and `:14` (number `parse: x => +x`): what
  a `"NULL"` element becomes for `boolean[]` and `integer[]`.
- `node_modules/@electric-sql/pglite/dist/chunk-3OMHRXTA.js` (`Ke`, the array parser): `u==="NULL"&&!t.quoted?
  i.push(null)` — PGlite returns `null`.
- `test/determinism/postgres-database.ts:49-58` (`connect`): the test adapter of tasks 1.2 and 1.3 uses the driver's
  array parsing as it is; no test before task 1.3 stored a NULL array element.
- `openspec/changes/core-arch/specs/database-api/spec.md:21-23` (DB-2): the mapping covers `bigint`, `bytea`,
  `numeric` and `jsonb`, not arrays.

## Suggested fix

In task 2.1 (the PostgreSQL backend of the database API), parse array results without the driver's `arrayParser`: for
every array type, register a parser that reads PostgreSQL's array output itself (unquoted `NULL` → `null`, quoted
elements unescaped, nested braces as dimensions) and applies the element type's DB-2 parser to each non-null element.
Extend DB-2 to say arrays are mapped element by element, `NULL` to `null`. Add a test reading `ARRAY['x', NULL]` and
`ARRAY['x', 'NULL']` (and `boolean[]`, `integer[]`, `bigint[]`, `jsonb[]` with NULL elements) on both backends, and a
contents-hash negative control showing the two `text[]` rows hash differently. Until then, the test adapter
(`test/determinism/postgres-database.ts`) gets the same parser, so tasks 1.2 and 1.3's PostgreSQL tests can hold NULL
array elements.
