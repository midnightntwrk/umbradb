/**
 * The session settings of the `deterministic_postgresql` component (`openspec/changes/core-arch/design.md` §4, "Session
 * settings (Q65) and timeouts (Q71)"; DB-2, DB-15): what every session of the database API starts with, whatever the
 * server's, the database's or the role's defaults. Each backend applies them its own way — the PostgreSQL backend as
 * startup parameters of every connection (`src/db/postgres.ts`, which also refuses a `database` URL that sets one), the
 * PGlite backend as `-c` start parameters of its engine (`src/db/pglite.ts`, which also refuses an engine running
 * without them) — and takes them from here, as {@link SESSION_SETTINGS}.
 */

/**
 * The session settings every session of the database API starts with — each PostgreSQL connection and PGlite's one
 * session: how PostgreSQL prints values, so that every mapped value and every text the server prints is the same on
 * both backends, on every server and in every database, whatever their defaults — `bytea_output` (the `bytea` mapping
 * reads hex), `DateStyle` (the date and time mapping reads ISO), `IntervalStyle`, `TimeZone` (the mapping reads a
 * `timestamptz` printed with `+00`, and a literal without an offset means UTC) and `extra_float_digits` (floats
 * printed exactly). Owner decision Q65.
 */
export const PINNED_SETTINGS: readonly (readonly [string, string])[] = [
  ["bytea_output", "hex"],
  ["DateStyle", "ISO, MDY"],
  ["IntervalStyle", "postgres"],
  ["TimeZone", "UTC"],
  ["extra_float_digits", "1"],
];

/**
 * The zero timeouts (DB-15, owner decision Q71): every session also starts with each server-side timeout at 0, so that
 * the writer, migrations, setup and the read handles given to callbacks — work the runner must finish — are never cut
 * off: a migration building an index on a large table (`statement_timeout`), or waiting for reads to release a table
 * (`lock_timeout`); a block transaction idle while a callback awaits the ledger worker
 * (`idle_in_transaction_session_timeout`, which would also end the session); a slow block, which is reported, never
 * cut off (`transaction_timeout`, PostgreSQL 17 and later; RN-17). A read for a module API request sets two of them
 * for that read only (`SET LOCAL`, `src/db/postgres.ts`).
 *
 * `idle_session_timeout` (PostgreSQL 14 and later) is not one of DB-15's four: decision record Q93. A default for it
 * would end the writer's session while it waits between blocks, and the writer lock with it (DB-11), and would end idle
 * pooled read connections; so it is pinned to 0 with the others. Reverting Q93 is removing its entry here.
 *
 * PGlite enforces none of them, but one that fires hangs it — synchronously, the whole process — as a nonzero
 * `idle_in_transaction_session_timeout`, `transaction_timeout` or `idle_session_timeout` does once its time passes
 * (`design.md` §14; checked on PGlite 0.5.10, 2026-10-25); its configuration file can set them, so the zeros are pinned
 * there too.
 */
export const ZERO_TIMEOUTS: readonly (readonly [string, string])[] = [
  ["statement_timeout", "0"],
  ["lock_timeout", "0"],
  ["idle_in_transaction_session_timeout", "0"],
  ["transaction_timeout", "0"],
  ["idle_session_timeout", "0"],
];

/** What every session of the database API starts with: {@link PINNED_SETTINGS}, then {@link ZERO_TIMEOUTS}. */
export const SESSION_SETTINGS: readonly (readonly [string, string])[] = [...PINNED_SETTINGS, ...ZERO_TIMEOUTS];
