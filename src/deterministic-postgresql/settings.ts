/**
 * The session settings of the `deterministic_postgresql` component: what every session of the database API starts
 * with, whatever the defaults of the server, the database or the role. [DB-2, DB-15, Q65, Q71; design §4]
 *
 * Each backend applies them in its own way and takes them from here, as {@link SESSION_SETTINGS}:
 *
 * - the PostgreSQL backend as startup parameters of every connection (`src/db/postgres.ts`, which also refuses a
 *   `database` URL that sets one);
 * - the PGlite backend as `-c` start parameters of its engine (`src/db/pglite.ts`, which also refuses an engine running
 *   without them).
 */

/**
 * The settings every session of the database API starts with (each PostgreSQL connection, and PGlite's single
 * session). They fix how PostgreSQL prints values, so every mapped value and every text the server prints is the same
 * on both backends, on every server and in every database, whatever their defaults. [Q65]
 *
 * - `bytea_output`: the `bytea` mapping reads hex;
 * - `DateStyle`: the date and time mapping reads ISO;
 * - `IntervalStyle`;
 * - `TimeZone`: the mapping reads a `timestamptz` printed with `+00`, and a literal without an offset means UTC;
 * - `extra_float_digits`: floats are printed exactly.
 */
export const PINNED_SETTINGS: readonly (readonly [string, string])[] = [
  ["bytea_output", "hex"],
  ["DateStyle", "ISO, MDY"],
  ["IntervalStyle", "postgres"],
  ["TimeZone", "UTC"],
  ["extra_float_digits", "1"],
];

/**
 * The zero timeouts: every session also starts with each server-side timeout at 0. Work the runner must finish (the
 * writer, migrations, setup, and the read handles given to callbacks) is then never cut off. [DB-15, Q71]
 *
 * What each one would otherwise cut off:
 *
 * - `statement_timeout`: a migration building an index on a large table.
 * - `lock_timeout`: a migration waiting for reads to release a table.
 * - `idle_in_transaction_session_timeout`: a block transaction idle while a callback awaits the ledger worker; this
 *   timeout would also end the session.
 * - `transaction_timeout` (PostgreSQL 17 and later): a slow block, which is reported but never cut off. [RN-17]
 * - `idle_session_timeout` (PostgreSQL 14 and later): a default would end the writer's session while it waits between
 *   blocks, and the writer lock with it, and would end idle pooled read connections. [DB-11, Q93]
 *
 * A read for a module API request sets two of them for that read only (`SET LOCAL`, `src/db/postgres.ts`).
 *
 * PGlite enforces none of them, but one that fires hangs it, synchronously, with the whole process: a nonzero
 * `idle_in_transaction_session_timeout`, `transaction_timeout` or `idle_session_timeout` does so once its time passes
 * (checked on PGlite 0.5.10, 2026-10-25). Its configuration file can set them, so the zeros are pinned there too.
 * [design §14]
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
