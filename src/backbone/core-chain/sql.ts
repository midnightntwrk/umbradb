/**
 * The SQL of `core-chain` (`./core-chain.ts`, `./history.ts`): its tables, its migrations, the statements that record
 * the identity and the configuration history, and the reads of both.
 *
 * **Its tables** live in its reserved schema `core_chain`. Its migrations create them as the writer's login, and every
 * module role can read them: [DB-6, DB-8; design §10]
 * - `001`: the history's `core_chain.config` ({@link CONFIG_MIGRATION});
 * - `002`: `core_chain.identity`, one row holding the genesis hash, S, and the anchor hash, which is null until block S
 *   commits. [CD-1]
 *
 * **The history table's columns**: [design §10]
 * - `(entry_id, start)`: the key;
 * - `stop`: null when absent, and always null for `core`, enforced by a `CHECK` (its stop is operational) [CF-4];
 * - `version`: text, a module's semver or the core version's canonical JSON;
 * - `data` and `data_hash`: the data fields as `jsonb` (written as their canonical JSON) and their SHA-256. Both are
 *   null for a scheduled revision, which records only id, start, stop and version, and otherwise both are present (a
 *   `CHECK`) [CF-3];
 * - `provides`: the names of the `table` items the revision provides (`tableItemsOf`, `./history.ts`): a module's from
 *   the build's declaration of it, and `core`'s from the build's backbone parts. A private process's graph counts them
 *   as provided at the revision's heights. [PP-13, Q126 B; design §8]
 *
 * Every module role reads the history table (through the database API's default privileges on `core_chain`); none
 * writes it. [DB-6]
 */

import type { ConfigHashRow, HistoryRow } from "../../config/history.js";
import type { PlainObject } from "../../config/plain-data.js";
import type { BlockWriteHandle, ReadHandle, Transaction } from "../../db/api.js";
import { keyOrderTerm } from "../../deterministic-postgresql/index.js";

/**
 * `core-chain`'s migration `001`, which creates the history's table. It is applied once and recorded under
 * `core-chain`, and it never changes once a database has applied it, since its checksum is fixed by the databases that
 * applied it. (`provides` was added in place before any database existed.) The part's other migrations follow it
 * ({@link CORE_CHAIN_MIGRATIONS}). [DB-9]
 */
export const CONFIG_MIGRATION: { readonly id: string; readonly sql: string } = Object.freeze({
  id: "001",
  sql: `CREATE TABLE core_chain.config (
  entry_id text NOT NULL,
  start bigint NOT NULL CHECK (start >= 0),
  stop bigint CHECK (stop >= start),
  version text NOT NULL,
  data jsonb,
  data_hash bytea,
  provides text[] NOT NULL,
  PRIMARY KEY (entry_id, start),
  CHECK ((data IS NULL AND data_hash IS NULL) OR (data IS NOT NULL AND octet_length(data_hash) = 32)),
  CHECK (entry_id <> 'core' OR stop IS NULL)
);`,
});

/** The identity's table: one row (id = 1). */
export const IDENTITY_TABLE = "core_chain.identity";

/** `core-chain`'s migration `002`, which creates the identity's table; it never changes. [DB-9] */
export const IDENTITY_MIGRATION: { readonly id: string; readonly sql: string } = Object.freeze({
  id: "002",
  sql: `CREATE TABLE ${IDENTITY_TABLE} (
  id smallint PRIMARY KEY CHECK (id = 1),
  genesis_hash bytea NOT NULL CHECK (octet_length(genesis_hash) = 32),
  start_height bigint NOT NULL CHECK (start_height >= 0),
  anchor_hash bytea CHECK (octet_length(anchor_hash) = 32)
);`,
});

/** `core-chain`'s migrations, in order: `001` creates the history's table, `002` the identity's. [DB-9] */
export const CORE_CHAIN_MIGRATIONS: readonly { readonly id: string; readonly sql: string }[] = Object.freeze([
  CONFIG_MIGRATION,
  IDENTITY_MIGRATION,
]);

/** The chain's identity as `core_chain.identity` holds it. [CD-1] */
export interface ChainIdentity {
  readonly genesisHash: Uint8Array;
  /** S. */
  readonly start: bigint;
  /** The hash of block S; null until it commits. */
  readonly anchorHash: Uint8Array | null;
}

const IDENTITY_PRESENT_SQL = "SELECT to_regclass('core_chain.identity') IS NOT NULL AS present";
const IDENTITY_SQL = `SELECT genesis_hash, start_height, anchor_hash FROM ${IDENTITY_TABLE} WHERE id = 1`;
const RECORD_IDENTITY_SQL = `INSERT INTO ${IDENTITY_TABLE} (id, genesis_hash, start_height) VALUES (1, $1, $2)
  ON CONFLICT (id) DO UPDATE SET genesis_hash = EXCLUDED.genesis_hash, start_height = EXCLUDED.start_height`;
const ANCHOR_SQL = `UPDATE ${IDENTITY_TABLE} SET anchor_hash = $1 WHERE id = 1 AND anchor_hash IS NULL`;

const PRESENT_SQL = "SELECT to_regclass('core_chain.config') IS NOT NULL AS present";

/**
 * In primary-key order (the component's `keyOrderTerm`: ids by their bytes), so refusals list rows the same way
 * everywhere. [DT-2]
 */
const ROWS_SQL = `SELECT entry_id, start, stop, version, data, data_hash FROM core_chain.config
  ORDER BY ${keyOrderTerm("entry_id", "text")}, ${keyOrderTerm("start", "bigint")}`;

const DELETE_SQL = "DELETE FROM core_chain.config WHERE entry_id = $1 AND start = $2";

/** The columns the configuration hash reads, from every row, with the data read by its hash only. [RN-16, PP-14] */
const CONFIG_HASH_SQL = "SELECT entry_id, start, stop, version, data_hash, provides FROM core_chain.config";

const RECORD_SQL = `INSERT INTO core_chain.config (entry_id, start, stop, version, data, data_hash, provides)
  VALUES ($1, $2, $3, $4, $5::jsonb, $6, $7::text[])
  ON CONFLICT (entry_id, start) DO UPDATE
  SET stop = EXCLUDED.stop, version = EXCLUDED.version, data = EXCLUDED.data, data_hash = EXCLUDED.data_hash,
    provides = EXCLUDED.provides`;

/** A revision above the cursor given this build's `provides`, only where its row's differ (so nothing else is written). */
const PROVIDES_SQL = `UPDATE core_chain.config SET provides = $3::text[]
  WHERE entry_id = $1 AND start = $2 AND provides IS DISTINCT FROM $3::text[]`;

/**
 * The chain's identity, read through `read` (a read handle, a transaction or a write handle); null before the table
 * exists (a database before its first startup) or while it holds no row.
 */
export async function readIdentity(read: Pick<ReadHandle, "query">): Promise<ChainIdentity | null> {
  const [table] = await read.query(IDENTITY_PRESENT_SQL);
  if (table?.present !== true) return null;
  const [row] = await read.query(IDENTITY_SQL);
  if (row === undefined) return null;
  return Object.freeze({
    genesisHash: row.genesis_hash as Uint8Array,
    start: row.start_height as bigint,
    anchorHash: row.anchor_hash as Uint8Array | null,
  });
}

/** Records the identity's genesis hash and S (`start`) in its one row, replacing those of a row already there. */
export async function recordIdentity(
  w: Pick<BlockWriteHandle, "execute">,
  genesisHash: Uint8Array,
  start: bigint,
): Promise<void> {
  await w.execute(RECORD_IDENTITY_SQL, [genesisHash, start]);
}

/** Records the anchor hash in the identity's row if it holds none yet; resolves with the rows changed (1, or 0). */
export async function recordAnchor(w: Pick<BlockWriteHandle, "execute">, anchorHash: Uint8Array): Promise<number> {
  return w.execute(ANCHOR_SQL, [anchorHash]);
}

/**
 * The rows of `core_chain.config`, by id (in UTF-8 byte order) and start; none while the table does not exist (a new
 * database, before `core-chain`'s migration). Takes a read handle, a transaction or a write handle.
 */
export async function readHistory(read: Pick<ReadHandle, "query">): Promise<HistoryRow[]> {
  const [{ present }] = (await read.query(PRESENT_SQL)) as [{ present: boolean }];
  if (!present) return [];
  const rows = await read.query(ROWS_SQL);
  return rows.map((row) =>
    Object.freeze({
      id: row.entry_id as string,
      start: row.start as bigint,
      stop: row.stop as bigint | null,
      version: row.version as string,
      data: row.data as PlainObject | null,
      dataHash: row.data_hash === null ? null : new Uint8Array(row.data_hash as Uint8Array),
    }),
  );
}

/**
 * The rows of `core_chain.config` as the configuration hash reads them, in no order (`configHashOf` orders them); null
 * while the table does not exist. Takes any handle that reads. [RN-16, PP-14; design §8]
 */
export async function readConfigRows(read: Pick<ReadHandle, "query">): Promise<ConfigHashRow[] | null> {
  const [{ present }] = (await read.query(PRESENT_SQL)) as [{ present: boolean }];
  if (!present) return null;
  const rows = await read.query(CONFIG_HASH_SQL);
  return rows.map((row) =>
    Object.freeze({
      id: row.entry_id as string,
      start: row.start as bigint,
      stop: row.stop as bigint | null,
      version: row.version as string,
      dataHash: row.data_hash === null ? null : new Uint8Array(row.data_hash as Uint8Array),
      provides: Object.freeze([...(row.provides as string[])]),
    }),
  );
}

/** Deletes the row of `(id, start)` from `core_chain.config`. */
export async function deleteConfigRow(tx: Pick<Transaction, "execute">, id: string, start: bigint): Promise<void> {
  await tx.execute(DELETE_SQL, [id, start]);
}

/** One row of `core_chain.config`, as {@link writeConfigRow} writes it. */
export interface ConfigRow {
  readonly id: string;
  readonly start: bigint;
  readonly stop: bigint | null;
  readonly version: string;
  /** The data fields' canonical JSON, or null for a scheduled revision. [CF-3] */
  readonly data: string | null;
  readonly dataHash: Uint8Array | null;
  readonly provides: readonly string[];
}

/** Inserts one row of `core_chain.config`, or replaces the row of its `(id, start)`. */
export async function writeConfigRow(tx: Pick<Transaction, "execute">, row: ConfigRow): Promise<void> {
  const { id, start, stop, version, data, dataHash, provides } = row;
  await tx.execute(RECORD_SQL, [id, start, stop, version, data, dataHash, provides]);
}

/** Gives the row of `(id, start)` the `provides` given, only where its own differ (so nothing else is written). */
export async function updateProvides(
  tx: Pick<Transaction, "execute">,
  id: string,
  start: bigint,
  provides: readonly string[],
): Promise<void> {
  await tx.execute(PROVIDES_SQL, [id, start, provides]);
}
