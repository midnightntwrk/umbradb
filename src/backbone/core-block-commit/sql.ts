/**
 * The SQL of `core-block-commit` (`./core-block-commit.ts`): its tables, its migration, the statements it writes each
 * block with, and the cursor reads.
 *
 * **The tables**, created by its migration `001` under the part's role: [design §10]
 * - `core_block_commit.blocks (height) → hash, parent_hash, spec_version, ledger_version, block_time`,
 *   range-partitioned by height as 0.9.5's `chain_archive` store was (`../height-partitions.ts`); hashes are 32 bytes
 *   (`CHECK`s). `block_time` is the block's own time, a `timestamptz` converted exactly from the node's milliseconds
 *   and read back as RFC 3339 text. The conversion uses PostgreSQL's integer interval input (`'<ms> milliseconds'`),
 *   never a floating-point value: `to_timestamp`, and `bigint * interval` (which multiplies by a `double precision`),
 *   both round far from 1970. On PostgreSQL 18.6 and PGlite 0.5.10, 253402300799999 ms becomes `…59.999008Z` that way.
 *   [Q74, DB-2]
 * - `core_block_commit.hashes (hash) → height`, not partitioned. PostgreSQL cannot enforce a unique hash on the
 *   height-partitioned `blocks` table (a unique index there must include the partition key), so this table's primary
 *   key enforces it across every partition. [CD-3]
 */

import type { BlockWriteHandle, CommittedHeight, ReadHandle } from "../../db/api.js";
import type { BlockRef } from "../../runner/block-source.js";
import { heightPartitionsSql } from "../height-partitions.js";

/** The blocks table, whose last row is the cursor. */
export const BLOCKS_TABLE = "core_block_commit.blocks";

/** The hashes table: one row per block hash, with the hash as its primary key. [CD-3] */
export const HASHES_TABLE = "core_block_commit.hashes";

/**
 * The blocks table's former name, being retired (the cursor-table helper, `cursorTable`, is a different thing).
 * `src/runner/loop.ts` still imports it.
 * @deprecated Use {@link BLOCKS_TABLE}.
 */
export const CURSOR_TABLE = BLOCKS_TABLE;

/** The hashes table's primary key, whose violation is `duplicate-block-hash`. */
export const HASHES_PRIMARY_KEY = "hashes_pkey";

/** `core-block-commit`'s migrations: applied once and recorded under `core-block-commit`; they never change. [DB-9] */
export const CORE_BLOCK_COMMIT_MIGRATIONS: readonly { readonly id: string; readonly sql: string }[] = Object.freeze([
  {
    id: "001",
    sql: `CREATE TABLE ${BLOCKS_TABLE} (
  height bigint NOT NULL CHECK (height >= 0),
  hash bytea NOT NULL CHECK (octet_length(hash) = 32),
  parent_hash bytea NOT NULL CHECK (octet_length(parent_hash) = 32),
  spec_version integer NOT NULL CHECK (spec_version >= 0),
  ledger_version text NOT NULL CHECK (ledger_version <> ''),
  block_time timestamptz NOT NULL,
  PRIMARY KEY (height)
) PARTITION BY RANGE (height);
${heightPartitionsSql(BLOCKS_TABLE)}
CREATE TABLE ${HASHES_TABLE} (
  hash bytea PRIMARY KEY CHECK (octet_length(hash) = 32),
  height bigint NOT NULL CHECK (height >= 0)
);`,
  },
]);

const PRESENT_SQL = "SELECT to_regclass('core_block_commit.blocks') IS NOT NULL AS present";
const CURSOR_SQL = `SELECT height, hash, parent_hash FROM ${BLOCKS_TABLE} ORDER BY height DESC LIMIT 1`;
const BLOCK_SQL = `INSERT INTO ${BLOCKS_TABLE} (height, hash, parent_hash, spec_version, ledger_version, block_time)
  VALUES ($1, $2, $3, $4, $5, timestamptz 'epoch' + ($6::bigint::text || ' milliseconds')::interval)`;
const HASH_SQL = `INSERT INTO ${HASHES_TABLE} (hash, height) VALUES ($1, $2)`;
const PARENT_SQL = `SELECT hash FROM ${BLOCKS_TABLE} WHERE height = $1`;

/** One row of the blocks table, as {@link insertBlockRow} writes it. */
export interface BlockRow {
  readonly height: bigint;
  readonly hash: Uint8Array;
  readonly parentHash: Uint8Array;
  readonly specVersion: number;
  readonly ledgerVersion: string;
  /** The block's own time in milliseconds since 1970, converted exactly (see the file comment). */
  readonly timestampMs: bigint;
}

/** Inserts one row of the blocks table. */
export async function insertBlockRow(w: Pick<BlockWriteHandle, "execute">, row: BlockRow): Promise<void> {
  const { height, hash, parentHash, specVersion, ledgerVersion, timestampMs } = row;
  await w.execute(BLOCK_SQL, [height, hash, parentHash, specVersion, ledgerVersion, timestampMs]);
}

/** Inserts one row of the hashes table; a hash already there violates {@link HASHES_PRIMARY_KEY}. */
export async function insertHashRow(
  w: Pick<BlockWriteHandle, "execute">,
  hash: Uint8Array,
  height: bigint,
): Promise<void> {
  await w.execute(HASH_SQL, [hash, height]);
}

/** The hash of the block stored at `height`, or `undefined` if none is. */
export async function hashAt(w: Pick<BlockWriteHandle, "query">, height: bigint): Promise<Uint8Array | undefined> {
  const [row] = await w.query(PARENT_SQL, [height]);
  return row?.hash as Uint8Array | undefined;
}

/**
 * The cursor, read through `read` (a read handle, or the block's transaction): the blocks table's row of the highest
 * height; null before the table exists (a database before its first startup) or while it holds no row.
 */
export async function readCursor(read: Pick<ReadHandle, "query">): Promise<BlockRef | null> {
  const [table] = await read.query(PRESENT_SQL);
  if (table?.present !== true) return null;
  const [row] = await read.query(CURSOR_SQL);
  if (row === undefined) return null;
  return Object.freeze({
    height: row.height as bigint,
    hash: row.hash as Uint8Array,
    parentHash: row.parent_hash as Uint8Array,
  });
}

/** The database API's committed height: the cursor's height, read through the read's own handle. [DB-2] */
export const cursorHeight: CommittedHeight = async (read) => (await readCursor(read))?.height ?? null;

/**
 * {@link cursorHeight} for one opened database: once a read found the blocks table, later reads skip the `to_regclass`
 * check, one statement fewer in every read. The table is append-only and never dropped while the database is open.
 * [DB-2]
 */
export function openedCursorHeight(): CommittedHeight {
  let present = false;
  return async (read) => {
    if (!present) {
      const [table] = await read.query(PRESENT_SQL);
      if (table?.present !== true) return null;
      present = true;
    }
    const [row] = await read.query(CURSOR_SQL);
    return (row?.height as bigint | undefined) ?? null;
  };
}
