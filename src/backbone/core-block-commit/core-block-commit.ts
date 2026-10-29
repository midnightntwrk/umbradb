/**
 * The backbone part `core-block-commit`. It owns the blocks table, `core_block_commit.blocks`, with one row per
 * committed block. The part's `on-db-write` writes it first among the parts that write in every block, inside the block's one
 * transaction. [CD-3, IN-4, RN-3, RN-6, RN-14; CORE-ARCH §4.5, §4.11; design §3]
 *
 * The table's last row is the cursor. (This is the blocks table, not the cursor-table helper in `src/helpers/`.) The
 * block sources read it through the read they are given ({@link readCursor}), and so does the database API's committed
 * height ({@link cursorHeight}), so a read's height and its snapshot always agree. [DB-2, SH-1]
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
 *
 * **Per block** ({@link commitBlock}), in this order:
 * 1. the block's row ({@link writeBlockRow}, so the cursor comes first), from the block context and the `block` items
 *    `block-header` (its spec version and time) and `ledger-version`, which `core-block-fetch` puts at `on-fetch`. It
 *    is refused before anything is sent when the items are missing or unreadable. [CD-2, CD-3]
 * 2. its hash's row ({@link writeHashRow}); a primary-key violation fails the block with `duplicate-block-hash`.
 * 3. the parent check ({@link checkParent}): a block whose parent hash is not the hash of the block stored at h − 1
 *    fails with `parent-mismatch`. The anchor, block S, has no stored parent and is not checked. [IN-4]
 *
 * The duplicate check comes first, so an earlier block delivered again (its hash repeated, its parent not the cursor)
 * is named for what it is. Both failures are halts: the part's `on-db-write` rejects with the `UmbraError`, the block
 * rolls back and the loop stops at h. [design §11]
 */

import { z } from "zod";
import { UMBRADB_VERSION } from "../../config/build.js";
import type { BlockWriteHandle, CommittedHeight, ReadHandle } from "../../db/api.js";
import { UmbraError } from "../../db/errors.js";
import { type BlockContext, defineModule } from "../../modules/declaration.js";
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
const HASHES_PRIMARY_KEY = "hashes_pkey";

/**
 * The latest block time stored, in milliseconds since 1970: 9999-12-31T23:59:59.999Z. The database API reads a
 * `timestamptz` in years 0001 to 9999 only, so a later one could not be read back. [DB-2, Q81]
 */
export const MAX_BLOCK_TIME_MS = 253_402_300_799_999n;

/** The largest spec version the `integer` column holds: 2^31 − 1. */
const MAX_SPEC_VERSION = 2_147_483_647;

/**
 * What `core-block-commit` reads of the `block` item `block-header`, which `core-block-fetch` puts at `on-fetch`
 * and may give more fields: [CD-2]
 * - the spec version of the runtime that built the block (its `MNSV` digest) [CORE-ARCH §4.8];
 * - the block's own time in milliseconds since 1970 (the node's `Timestamp::set`, a `u64`).
 */
export interface BlockHeaderItem {
  readonly specVersion: number;
  readonly timestampMs: bigint;
}

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

/** A hash as `0x`-prefixed lowercase hex, as the process transport and the chain-data envelope write hashes. */
function hex(bytes: Uint8Array): string {
  return `0x${Array.from(bytes, (byte) => byte.toString(16).padStart(2, "0")).join("")}`;
}

/** Whether two byte strings are equal. */
function sameBytes(a: Uint8Array, b: Uint8Array): boolean {
  return a.length === b.length && a.every((byte, index) => byte === b[index]);
}

/**
 * The `block-header` item of `b`, as {@link BlockHeaderItem}: throws a `TypeError`, naming the height, for a missing
 * item, a spec version that is no integer from 0 to 2^31 − 1, or a time that is no `bigint` from 0 to
 * {@link MAX_BLOCK_TIME_MS}.
 */
export function blockHeaderOf(b: BlockContext): BlockHeaderItem {
  const header = b.items.get("block-header");
  if (typeof header !== "object" || header === null) {
    throw new TypeError(
      `the block at height ${b.height} has no block-header item core-block-commit can read: core-block-fetch puts one ` +
        "at on-fetch, with the block's specVersion and timestampMs",
    );
  }
  const { specVersion, timestampMs } = header as Partial<Record<keyof BlockHeaderItem, unknown>>;
  if (typeof specVersion !== "number" || !Number.isInteger(specVersion) || specVersion < 0 || specVersion > MAX_SPEC_VERSION) {
    throw new TypeError(
      `the block-header item of the block at height ${b.height} has the spec version ${String(specVersion)}: a spec ` +
        `version is an integer from 0 to ${MAX_SPEC_VERSION} (the integer column spec_version)`,
    );
  }
  if (typeof timestampMs !== "bigint" || timestampMs < 0n || timestampMs > MAX_BLOCK_TIME_MS) {
    throw new TypeError(
      `the block-header item of the block at height ${b.height} has the time ${String(timestampMs)}: a block's own ` +
        `time is a bigint of milliseconds since 1970-01-01T00:00:00Z, from 0 to ${MAX_BLOCK_TIME_MS} ` +
        "(9999-12-31T23:59:59.999Z, the latest time the database API reads back)",
    );
  }
  return { specVersion, timestampMs };
}

/** The `ledger-version` item of `b`: throws a `TypeError`, naming the height, unless it is a non-empty text. */
export function ledgerVersionOf(b: BlockContext): string {
  const ledger = b.items.get("ledger-version");
  if (typeof ledger !== "string" || ledger === "") {
    throw new TypeError(
      `the block at height ${b.height} has no ledger-version item core-block-commit can read: core-block-fetch puts ` +
        "the block's ledger version, a non-empty text such as v9, at on-fetch",
    );
  }
  return ledger;
}

/**
 * Writes the block's row of the blocks table. Its height, hash and parent hash come from the block context; its spec
 * version, ledger version and time come from the block items (see {@link blockHeaderOf} and {@link ledgerVersionOf},
 * which refuse before anything is sent). The time is converted exactly (see the module comment). [CD-3]
 */
export async function writeBlockRow(w: Pick<BlockWriteHandle, "execute">, b: BlockContext): Promise<void> {
  const { specVersion, timestampMs } = blockHeaderOf(b);
  const ledger = ledgerVersionOf(b);
  await w.execute(BLOCK_SQL, [b.height, b.hash, b.parentHash, specVersion, ledger, timestampMs]);
}

/**
 * Writes the block's row of the hashes table. A hash another block already has fails the block with
 * `duplicate-block-hash` (with the height and the hash), raised from the table's primary-key violation as its cause.
 * [CD-3]
 */
export async function writeHashRow(w: Pick<BlockWriteHandle, "execute">, b: BlockContext): Promise<void> {
  try {
    await w.execute(HASH_SQL, [b.hash, b.height]);
  } catch (error) {
    const details = error instanceof UmbraError ? error.details : undefined;
    if (details?.sqlstate !== "23505" || details.constraint !== HASHES_PRIMARY_KEY) throw error;
    throw new UmbraError(
      "duplicate-block-hash",
      `the block at height ${b.height} has the hash ${hex(b.hash)}, which an earlier block already has: a chain never ` +
        `repeats a block's hash, so the block source gave a wrong block, and ${HASHES_TABLE}'s primary key refused it ` +
        `; processing halts at ${b.height}`,
      { height: b.height, hash: hex(b.hash) },
      { cause: error },
    );
  }
}

/**
 * The parent check. The block's parent hash must be the hash of the block stored at h − 1 (the cursor, for the block
 * the loop processes), or the block fails with `parent-mismatch` (with the height and both hashes). With no block
 * stored at h − 1 there is nothing to compare: that is the anchor, block S, whose parent the database never holds.
 * [IN-4]
 */
export async function checkParent(w: Pick<BlockWriteHandle, "query">, b: BlockContext): Promise<void> {
  const [parent] = await w.query(PARENT_SQL, [b.height - 1n]);
  if (parent === undefined) return;
  const stored = parent.hash as Uint8Array;
  if (sameBytes(stored, b.parentHash)) return;
  throw new UmbraError(
    "parent-mismatch",
    `the block at height ${b.height} names the parent ${hex(b.parentHash)}, but the block at height ${b.height - 1n} ` +
      `is ${hex(stored)}: the block does not extend the database's chain; processing halts at ${b.height}`,
    { height: b.height, parentHash: hex(b.parentHash), stored: hex(stored) },
  );
}

/** `core-block-commit`'s work for block `b`, in its order (see the module comment). */
export async function commitBlock(w: Pick<BlockWriteHandle, "query" | "execute">, b: BlockContext): Promise<void> {
  await writeBlockRow(w, b);
  await writeHashRow(w, b);
  await checkParent(w, b);
}

/**
 * `core-block-commit` (see the module comment). It is a backbone part: it runs with the core from S, which is a
 * mid-chain start whenever S is above 0. It requires the `block` items `block-header` and `ledger-version` (from
 * `core-block-fetch`) and provides the `table` item `blocks`: its two tables, in its own schema. [Q96]
 */
export const CORE_BLOCK_COMMIT = defineModule({
  id: "core-block-commit",
  version: UMBRADB_VERSION,
  side: "public",
  requires: ["block-header", "ledger-version"],
  provides: [
    {
      name: "blocks",
      lifetimes: ["table"],
      table: { schema: "core_block_commit", tables: ["blocks", "hashes"], kind: "append-only" },
    },
  ],
  startsMidChain: true,
  configSchema: z.object({}),
  migrations: CORE_BLOCK_COMMIT_MIGRATIONS.map(({ id, sql }) => ({ id, sql })),
  points: {
    async "on-db-write"(_p, b, w) {
      await commitBlock(w, b);
    },
  },
});

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
