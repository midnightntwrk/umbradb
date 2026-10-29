/**
 * The SQL of `core-private-source` (`./core-private-source.ts`): its tables, its migrations, the statements its part
 * writes the binding, the accepted hash and the private cursor with, and the reads of its own rows. It also holds the
 * statements a private process reads the public database with (`./public-database.ts`), on tables of the public core.
 *
 * **Its table**, created by its migration under its own role, is `core_private_source.cursor`, with one row (`id = 1`):
 * - the private cursor: the public block the private process last committed (`height`, `hash` and `parent_hash`), null
 *   before its first block. The runner's cursor needs the parent hash, and so does delivering the block at the cursor
 *   again after a restart. [RN-11, Q124]
 * - the binding: the public database's genesis hash and S (`public_genesis_hash`, `public_start_height`).
 * It is a module table of the private plan like any other: the determinism check covers it, its `CHECK`s and change
 * capture are added, `core-digest` digests it and the contents hash reads it. [DT-6, Q75; design §10]
 *
 * Its migration `002` adds `core_private_source.accepted_config` (one row, `id = 1`: `config_hash`, 32 bytes): the
 * public configuration hash the private process last accepted, left out of change capture, the digests and the contents
 * hash (see `./core-private-source.ts`). [PP-14, Q159]
 */

import { publicItemRanges } from "../../config/history.js";
import type { BlockWriteHandle, ReadHandle, SchemaWriteHandle } from "../../db/api.js";
import type { PublicItem } from "../../modules/graph.js";
import type { BlockRef } from "../../runner/block-source.js";
import { BLOCKS_TABLE } from "../core-block-commit/sql.js";
import type { PublicIdentity } from "./public-database.js";

/** `core-private-source`'s migrations: applied once, in order, and never changed. [DB-9] */
export const CORE_PRIVATE_SOURCE_MIGRATIONS: readonly { readonly id: string; readonly sql: string }[] = Object.freeze([
  {
    id: "001",
    sql: `CREATE TABLE core_private_source.cursor (
  id smallint PRIMARY KEY CHECK (id = 1),
  height bigint,
  hash bytea,
  parent_hash bytea,
  public_genesis_hash bytea NOT NULL CHECK (octet_length(public_genesis_hash) = 32),
  public_start_height bigint NOT NULL,
  CHECK ((height IS NULL) = (hash IS NULL) AND (height IS NULL) = (parent_hash IS NULL))
)`,
  },
  {
    // The public configuration hash the private process accepted. [PP-14, Q159]
    id: "002",
    sql: `CREATE TABLE core_private_source.accepted_config (
  id smallint PRIMARY KEY CHECK (id = 1),
  config_hash bytea NOT NULL CHECK (octet_length(config_hash) = 32)
)`,
  },
]);

const PRESENT_SQL = "SELECT to_regclass('core_private_source.cursor') IS NOT NULL AS present";
const CURSOR_SQL =
  "SELECT height, hash, parent_hash, public_genesis_hash, public_start_height FROM core_private_source.cursor WHERE id = 1";
const BINDING_SQL = "SELECT public_genesis_hash, public_start_height FROM core_private_source.cursor WHERE id = 1";
const BIND_SQL =
  "INSERT INTO core_private_source.cursor (id, public_genesis_hash, public_start_height) VALUES (1, $1, $2)";
const MOVE_SQL = "UPDATE core_private_source.cursor SET height = $1, hash = $2, parent_hash = $3 WHERE id = 1";
const ACCEPTED_PRESENT_SQL = "SELECT to_regclass('core_private_source.accepted_config') IS NOT NULL AS present";
const ACCEPTED_SQL = "SELECT config_hash FROM core_private_source.accepted_config WHERE id = 1";
const ACCEPT_SQL =
  "INSERT INTO core_private_source.accepted_config (id, config_hash) VALUES (1, $1) " +
  "ON CONFLICT (id) DO UPDATE SET config_hash = EXCLUDED.config_hash";

// The public database's tables, which a private process only reads (`./public-database.ts`). [PP-1, PP-13]
const CONFIG_PRESENT_SQL = "SELECT to_regclass('core_chain.config') IS NOT NULL AS present";
const ITEMS_SQL = "SELECT entry_id, start, stop, provides FROM core_chain.config";
const BLOCKS_PRESENT_SQL = `SELECT to_regclass('${BLOCKS_TABLE}') IS NOT NULL AS present`;
const BLOCK_SQL = `SELECT height, hash, parent_hash FROM ${BLOCKS_TABLE} WHERE height = $1`;

/**
 * The private cursor, read through `read` (a read handle, or the block's transaction): the public block the private
 * process last committed; null before its first block, and before the table exists (a database before its first
 * startup).
 */
export async function readPrivateCursor(read: Pick<ReadHandle, "query">): Promise<BlockRef | null> {
  return (await readPrivateRow(read)).cursor;
}

/**
 * The private cursor ({@link readPrivateCursor}) and the binding the same row records — the public database's genesis
 * hash and S, null before the first start recorded them —, in one statement.
 */
export async function readPrivateRow(
  read: Pick<ReadHandle, "query">,
): Promise<{ readonly cursor: BlockRef | null; readonly binding: PublicIdentity | null }> {
  const [table] = await read.query(PRESENT_SQL);
  if (table?.present !== true) return { cursor: null, binding: null };
  const [row] = await read.query(CURSOR_SQL);
  if (row === undefined) return { cursor: null, binding: null };
  const binding = Object.freeze({
    genesisHash: row.public_genesis_hash as Uint8Array,
    start: row.public_start_height as bigint,
  });
  if (row.height === null) return { cursor: null, binding };
  const cursor = Object.freeze({
    height: row.height as bigint,
    hash: row.hash as Uint8Array,
    parentHash: row.parent_hash as Uint8Array,
  });
  return { cursor, binding };
}

/**
 * The binding a private database records: its public database's genesis hash and S, read through `read`. Null before
 * its first start recorded them, and before the table exists. A restore of a private process's backup compares it with
 * its public database's identity before the commit. [PP-2, BK-3, Q153]
 */
export async function readPrivateBinding(read: Pick<ReadHandle, "query">): Promise<PublicIdentity | null> {
  return (await readPrivateRow(read)).binding;
}

/** A private database's committed height: the private cursor's height. [DB-2] */
export const privateCursorHeight = async (read: Pick<ReadHandle, "query">): Promise<bigint | null> =>
  (await readPrivateCursor(read))?.height ?? null;

/**
 * The public configuration hash a private database accepted, as `0x` hex, read through `read`. Null before its first
 * start recorded one, and before its table exists (migration `002`). [PP-14, Q159]
 */
export async function readAcceptedConfigHash(read: Pick<ReadHandle, "query">): Promise<string | null> {
  const [table] = await read.query(ACCEPTED_PRESENT_SQL);
  if (table?.present !== true) return null;
  const [row] = await read.query(ACCEPTED_SQL);
  return row?.config_hash instanceof Uint8Array ? `0x${Buffer.from(row.config_hash).toString("hex")}` : null;
}

/** The binding a private database recorded, read in its `on-start-db`'s transaction; null on its first start. */
export async function recordedBinding(w: Pick<SchemaWriteHandle, "query">): Promise<PublicIdentity | null> {
  const [row] = await w.query(BINDING_SQL);
  if (row === undefined) return null;
  return { genesisHash: row.public_genesis_hash as Uint8Array, start: row.public_start_height as bigint };
}

/** Records the binding, the public database's identity, in the row's first insert (a private database's first start). */
export async function insertBinding(w: Pick<SchemaWriteHandle, "execute">, identity: PublicIdentity): Promise<void> {
  await w.execute(BIND_SQL, [identity.genesisHash, identity.start]);
}

/** Records `hash` (32 bytes) as the public configuration hash the private process accepted, replacing any earlier. */
export async function writeAcceptedConfigHash(
  w: Pick<SchemaWriteHandle, "execute">,
  hash: Uint8Array,
): Promise<void> {
  await w.execute(ACCEPT_SQL, [hash]);
}

/** Moves the private cursor to `block`, in the block's transaction. */
export async function movePrivateCursor(w: Pick<BlockWriteHandle, "execute">, block: BlockRef): Promise<void> {
  await w.execute(MOVE_SQL, [block.height, block.hash, block.parentHash]);
}

/** Whether `read` finds the table a `to_regclass` statement asks for. */
async function present(read: Pick<ReadHandle, "query">, sql: string): Promise<boolean> {
  const [row] = await read.query(sql);
  return row?.present === true;
}

/**
 * The public core's `table` items with their heights. Every row of its `core_chain.config` is a revision of one of its
 * entries, with the `table` items it provides (`provides`); `publicItemRanges` turns them into items, each from its
 * revision's start to the revision's last height. Empty before the table exists. [PP-13, CF-5; design §8]
 */
export async function readPublicItems(read: Pick<ReadHandle, "query">): Promise<PublicItem[]> {
  if (!(await present(read, CONFIG_PRESENT_SQL))) return [];
  const rows = await read.query(ITEMS_SQL);
  return publicItemRanges(
    rows.map((row) => ({
      id: row.entry_id as string,
      start: row.start as bigint,
      stop: row.stop as bigint | null,
      provides: row.provides as string[],
    })),
  );
}

/** The public block at `height` — its height, hash and parent hash —, or null when the public database has none. */
export async function readPublicBlock(read: Pick<ReadHandle, "query">, height: bigint): Promise<BlockRef | null> {
  if (!(await present(read, BLOCKS_PRESENT_SQL))) return null;
  const [row] = await read.query(BLOCK_SQL, [height]);
  if (row === undefined) return null;
  return Object.freeze({
    height: row.height as bigint,
    hash: row.hash as Uint8Array,
    parentHash: row.parent_hash as Uint8Array,
  });
}
