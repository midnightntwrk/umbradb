/**
 * The backbone part `core-block-commit`. It owns the blocks table, `core_block_commit.blocks`, with one row per
 * committed block. The part's `on-db-write` writes it first among the parts that write in every block, inside the block's one
 * transaction. [CD-3, IN-4, RN-3, RN-6, RN-14; CORE-ARCH §4.5, §4.11; design §3]
 *
 * The table's last row is the cursor. (This is the blocks table, not the cursor-table helper in `src/helpers/`.) The
 * block sources read it through the read they are given (`readCursor`, in `./sql.ts`), and so does the database API's
 * committed height (`cursorHeight`), so a read's height and its snapshot always agree. [DB-2, SH-1]
 *
 * **The tables** and every statement are in `./sql.ts`.
 *
 * **Per block** ({@link commitBlock}), in this order:
 * 1. the block's row ({@link writeBlockRow}, so the cursor comes first), from the block context and the `block` items
 *    `block-header` (its spec version and time) and `ledger-version`, which `core-block-fetch` puts at `on-fetch`. It
 *    is refused before anything is sent when the items are missing or unreadable. [CD-2, CD-3]
 * 2. its hash's row ({@link writeHashRow}); a primary-key violation fails the block with `duplicate-block-hash`.
 * 3. the parent check ({@link checkParent}): a block whose parent hash is not the hash of the block stored at h − 1,
 *    or that has no block stored at h − 1, fails with `parent-mismatch`. Only the anchor, block S, has no stored parent
 *    and is not checked. The part takes S from its process context's revisions ({@link startOf}), in memory, so the
 *    check still sends one statement per block. [IN-4, CF-2]
 *
 * The duplicate check comes first, so an earlier block delivered again (its hash repeated, its parent not the cursor)
 * is named for what it is. Both failures are halts: the part's `on-db-write` rejects with the `UmbraError`, the block
 * rolls back and the loop stops at h. [design §11]
 */

import { z } from "zod";
import { UMBRADB_VERSION } from "../../config/build.js";
import type { BlockWriteHandle } from "../../db/api.js";
import { UmbraError } from "../../db/errors.js";
import { type BlockContext, defineModule, type ProcessContext } from "../../modules/declaration.js";
import {
  CORE_BLOCK_COMMIT_MIGRATIONS,
  HASHES_PRIMARY_KEY,
  HASHES_TABLE,
  hashAt,
  insertBlockRow,
  insertHashRow,
} from "./sql.js";

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
  await insertBlockRow(w, {
    height: b.height,
    hash: b.hash,
    parentHash: b.parentHash,
    specVersion,
    ledgerVersion: ledger,
    timestampMs,
  });
}

/**
 * Writes the block's row of the hashes table. A hash another block already has fails the block with
 * `duplicate-block-hash` (with the height and the hash), raised from the table's primary-key violation as its cause.
 * [CD-3]
 */
export async function writeHashRow(w: Pick<BlockWriteHandle, "execute">, b: BlockContext): Promise<void> {
  try {
    await insertHashRow(w, b.hash, b.height);
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
 * S, the database's start height, from `core-block-commit`'s process context `p`. The runner gives every backbone part
 * the `core` entry's revisions in start order (`processRevisions`, `src/runner/process.ts`), and S is the earliest
 * `core` entry's start, so it is the first revision's start: the height `core-chain` records in `core_chain.identity`
 * and whose block's hash it records as the anchor. A restored database keeps the backup's S, which restore requires
 * the configuration to have, so S is the same there. It is in memory, so the parent check sends no statement for it.
 * Throws a plain `Error` for a context without revisions, which the runner never gives a backbone part.
 * [CF-2, IN-2, BK-4, MD-7]
 */
export function startOf(p: Pick<ProcessContext, "revisions">): bigint {
  const first = p.revisions[0];
  if (first === undefined) {
    throw new Error(
      "core-block-commit ran with a process context that has no revision: the runner gives every backbone part the " +
        "core entry's revisions, the first starting at S, which the parent check needs",
    );
  }
  return first.start;
}

/**
 * The parent check, for a database whose start height is `start` (S). The anchor, block S, passes unchecked: its parent
 * is below S, which the database never holds. Every other block's parent hash must be the hash of the block stored at
 * h − 1 (the cursor, for the block the loop processes), or the block fails with `parent-mismatch`, with the height,
 * its parent hash and the stored hash. [IN-4]
 *
 * With no block stored at h − 1 the block fails too, its stored hash null: committed, it would leave a missing height
 * that every later block extends. That happens when the loop's cursor is not the database's (a bug), when another
 * writer deleted the rows below the block, or for a first block that is not S. [IN-4]
 */
export async function checkParent(w: Pick<BlockWriteHandle, "query">, b: BlockContext, start: bigint): Promise<void> {
  if (b.height === start) return;
  const stored = await hashAt(w, b.height - 1n);
  if (stored !== undefined && sameBytes(stored, b.parentHash)) return;
  const found =
    stored === undefined
      ? `the database holds no block at height ${b.height - 1n}`
      : `the block at height ${b.height - 1n} is ${hex(stored)}`;
  throw new UmbraError(
    "parent-mismatch",
    `the block at height ${b.height} names the parent ${hex(b.parentHash)}, but ${found}: the block does not extend ` +
      `the database's chain; processing halts at ${b.height}`,
    { height: b.height, parentHash: hex(b.parentHash), stored: stored === undefined ? null : hex(stored) },
  );
}

/** `core-block-commit`'s work for block `b` of a database whose S is `start`, in its order (see the module comment). */
export async function commitBlock(
  w: Pick<BlockWriteHandle, "query" | "execute">,
  b: BlockContext,
  start: bigint,
): Promise<void> {
  await writeBlockRow(w, b);
  await writeHashRow(w, b);
  await checkParent(w, b, start);
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
    async "on-db-write"(p, b, w) {
      await commitBlock(w, b, startOf(p));
    },
  },
});
