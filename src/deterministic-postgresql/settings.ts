/**
 * The session settings of the `deterministic_postgresql` component (`openspec/changes/core-arch/design.md` §4, "Session
 * settings (Q65) and timeouts (Q71)"; DB-2): what every session of the database API starts with, whatever the server's,
 * the database's or the role's defaults. Each backend applies them its own way — the PostgreSQL backend as startup
 * parameters of every connection (`src/db/postgres.ts`, which also refuses a `database` URL that sets one), the PGlite
 * backend as `-c` start parameters of its engine (`src/db/pglite.ts`, which also refuses an engine running without
 * them) — and takes them from here.
 *
 * Task 2.7 adds here the zero timeouts of the writer, migrations, setup and callback reads (DB-15, owner decision Q71).
 */

/**
 * The session settings every session of the database API starts with — each PostgreSQL connection and PGlite's one
 * session: how PostgreSQL prints values, so that every mapped value and every text the server prints is the same on
 * both backends, on every server and in every database, whatever their defaults — `bytea_output` (the `bytea` mapping
 * reads hex), `DateStyle` (the `Date` mapping reads ISO), `IntervalStyle`, `TimeZone` and `extra_float_digits` (floats
 * printed exactly). Owner decision Q65.
 */
export const PINNED_SETTINGS: readonly (readonly [string, string])[] = [
  ["bytea_output", "hex"],
  ["DateStyle", "ISO, MDY"],
  ["IntervalStyle", "postgres"],
  ["TimeZone", "UTC"],
  ["extra_float_digits", "1"],
];
