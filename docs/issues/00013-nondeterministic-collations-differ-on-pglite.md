# 00013 — A nondeterministic collation compares differently on PGlite and on PostgreSQL

- **Status:** OPEN
- **Area:** logic
- **Severity:** med
- **Effort:** needs the owner's decision: refusing these sorting rules (or allowing them) is a change to the determinism
  spec.
- **GitHub:** NOT IN GITHUB ISSUE
- **Found:** 2026-10-25, during task 7.1 of `openspec/changes/core-arch` (change capture for the digests), while testing
  that a shadow table keys its rows with the collations of its module table's key columns.

## Problem

DT-6 refuses module columns by their type, never by their collation, so a module table may declare a `text` column with
a nondeterministic ICU collation (`CREATE COLLATION m.ci (provider = icu, locale = 'und-u-ks-level2', deterministic =
false)`, a case-insensitive comparison) and make it its primary key. The two backends do not compare such a column
alike: PostgreSQL 18.6 treats `'a'` and `'A'` as equal under it, so a second row `'A'` violates the primary key, while
PGlite 0.5.10 treats them as different and stores both. The same chain can then succeed on PGlite and fail (or store
other rows) on PostgreSQL — against DB-1 (both backends give the same observable results) and against the convergence
the contents hash and the digests are there to show.

Checked 2026-10-25 (scratch probes outside the clone):

- PGlite 0.5.10 in Node.js v24.9.0 (`icu_unicode_version()` 16.0): `SELECT 'a' = 'A' COLLATE ci` gives `false`;
  `CREATE TABLE m.t (k text COLLATE m.ci PRIMARY KEY)`, then `INSERT 'a'` and `INSERT 'A'`, both succeed. The
  deterministic ICU collation `und-x-icu` orders as on PostgreSQL (`'a' < 'B'` true), so only the nondeterministic
  strength is missing.
- PostgreSQL 18.6 from the pinned `postgres:18-alpine` image (ICU 17.0): `'a' = 'A' COLLATE ci` gives `true`; the second
  insert fails with `duplicate key value violates unique constraint "t_pkey"`.

## Evidence

- `src/deterministic-postgresql/column-rules.ts` — `columnVerdict` and `tableRefusals` decide by `format_type`, the
  type's kind and the type modifier; `catalog.ts`'s `COLUMNS_SQL` reads no `attcollation`.
- `test/backbone/core-digest/capture.test.ts` — "keys a shadow table with a nondeterministic collation as its table does"
  runs on PostgreSQL only, for this reason.
- `openspec/changes/core-arch/specs/database-api/spec.md` DB-1; `specs/determinism/spec.md` DT-2 (keys ordered by their
  bytes, `COLLATE "C"`), DT-6.

## Suggested fix

Refuse at startup and in the contents hash (DT-6, the component's rules) every module column whose collation is
nondeterministic (`pg_collation.collisdeterministic = false`), with a message saying that its equality depends on the
ICU library's data, which differs between PostgreSQL and PGlite, and to use a deterministic collation (or `text` with
the default one) and compare case-insensitively in queries. A spec change (DT-6, `design.md` §4's column-type rules and
their messages), so for the owner to decide; until then the module guide could say to avoid nondeterministic
collations.
