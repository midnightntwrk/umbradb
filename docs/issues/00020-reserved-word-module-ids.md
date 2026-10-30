# 00020 — A module id that is a reserved SQL key word passes DB-8, and every unquoted reference to its schema fails

- **Status:** OPEN
- **Area:** logic
- **Severity:** low
- **Effort:** medium — refuse module ids that are reserved SQL words, which needs a reliable keyword list for both
  databases.
- **GitHub:** NOT IN GITHUB ISSUE
- **Found:** 2026-10-26, during task 5.4 of `openspec/changes/core-arch` (failure handling), when a test module named
  `user` refused startup with `migration-failed` on PostgreSQL 18.6 and on PGlite 0.5.10.

## Problem

DB-8's id rule (`src/db/roles.ts:47`, `ID_PATTERN = /^[a-z][a-z0-9]*(-[a-z0-9]+)*$/`, within 40 bytes) accepts every
lowercase word, PostgreSQL's reserved key words among them: `user`, `order`, `group`, `table`, `select`, `check`,
`default`, `offset`, `limit`, `analyse`, … (`pg_get_keywords()` gives them `catcode` `R`). A module's schema is named
after its id. UmbraDB's own SQL quotes every name (`quoteIdentifier`, `src/db/roles.ts:372`, `:453`–`:475`), so the
schema and its role are created; but the module's own SQL — its migrations, its callbacks' statements — names its
tables `<schema>.<table>`, as the module guide and every example do, and a reserved word there is a syntax error:

- Observed: a module `user` with the migration `CREATE TABLE user.rows (height bigint PRIMARY KEY)` (the test build's
  `loggingModule`, `test/runner/process-build.ts`) refused startup with `migration-failed` on both backends.
- Probe (PGlite 0.5.10 in memory, outside the clone): after `CREATE SCHEMA "user"`, `CREATE TABLE user.rows (height
  bigint)` fails with `syntax error at or near "user"`; `CREATE TABLE "user".rows (height bigint)` succeeds.

So the id is accepted at validation, and the module fails later with a database syntax error that does not say why. A
hyphenated id is not affected (`user-data` gives the schema `user_data`, no key word); only ids whose schema name is a
reserved word are.

## Evidence

- `src/db/roles.ts:47` — the id pattern, with no key-word check.
- `docs/module-guide.md` — every example writes `<schema>.<table>` unquoted.

## Suggested fix

Refuse a module id (and an item name that names a schema) whose schema name is a PostgreSQL reserved key word with
`bad-id` at declaration validation (task 3.1's `validateDeclarations`, DB-8), listing the words from PostgreSQL 18's
`pg_get_keywords()` with `catcode = 'R'` (fixed per PostgreSQL major version; a test can compare the list with the
pinned server's). Or, if such ids are to stay allowed, say in the module guide that a module's SQL must quote its schema
name when it is a reserved word. Refusing is the smaller surprise: the failure then names the rule at startup instead
of a syntax error inside the module's first migration.
