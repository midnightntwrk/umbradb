/**
 * The public data a private process reads (`openspec/changes/core-arch/specs/private-processes/spec.md` PP-1–PP-5;
 * `design.md` §8; CORE-ARCH §4.14): a private process reads the public database — never the reverse (PP-1) — for its
 * binding (PP-2), the public cursor and each public block it processes (PP-3), and the reads its modules' `on-fetch`
 * make of public data at a height (decision record Q100); and it is woken when the public cursor may have moved.
 *
 * **Every read of public tables is here**, in one place: {@link readPublicIdentity} (`core_chain.identity`'s genesis
 * hash and S, through `core-chain`'s own `readIdentity`, task 10.2), {@link readPublicBlock} (`core_block_commit.blocks`'
 * height, hash and parent hash, which its other columns, partitions and `hashes` table do not change), and the public
 * cursor, which is `core-block-commit`'s own `readCursor` — the blocks table's last row, as the core reads it.
 *
 * **Where the public data comes from** ({@link PublicDatabase}): on PostgreSQL directly — `publicDatabase`, the URL of
 * a login that may only read, opened by {@link openPublicDatabase} with reads only (one `REPEATABLE READ READ ONLY`
 * transaction each, its height the public cursor's, DB-2); when the public database is PGlite, which only the core can
 * open (DB-4), through the core's transport (`read` messages, PP-4) — task 14.2's, as is any `publicDatabase` absent,
 * which this task refuses.
 *
 * **What wakes the private process** ({@link PublicWakes}): the core's `committed` messages and every (re)connection of
 * its transport (PP-3: they only wake it; it reads the public cursor itself) — task 14.2's. Until then a private
 * process reads the public cursor every {@link PUBLIC_POLL_MS} ({@link pollingWakes}).
 */

import { BLOCKS_TABLE, cursorHeight, readCursor } from "../core-block-commit/core-block-commit.js";
import { readIdentity } from "../core-chain/core-chain.js";
import type { PlainObject } from "../../config/plain-data.js";
import type { CheckedEntry } from "../../config/validate.js";
import type { ReadHandle } from "../../db/api.js";
import { UmbraError } from "../../db/errors.js";
import { openPostgres } from "../../db/postgres.js";
import type { BlockRef } from "../../runner/block-source.js";

/** The public database as a private process reads it (see the module comment). */
export interface PublicDatabase {
  /**
   * Runs `body` with one consistent read of the public database, at its committed height — the public cursor —, as
   * `Database.read` does (DB-2); rejects with `body`'s error or the database's (`connection-lost` is retried).
   */
  read<T>(body: (read: ReadHandle) => Promise<T>): Promise<T>;
  /** Closes what reading it opened. */
  close(): Promise<void>;
}

/** What wakes a private process's wait for the public cursor (see the module comment). */
export interface PublicWakes {
  /**
   * Resolves at the next wake-up after the call — a `committed` message, a (re)connection of the transport, or a poll's
   * interval —, or rejects with `signal`'s reason once `signal` aborts (at once when it is aborted already).
   */
  next(signal: AbortSignal): Promise<void>;
}

/** The public database's chain identity (CORE-ARCH §4.11): its genesis hash and S. */
export interface PublicIdentity {
  readonly genesisHash: Uint8Array;
  readonly start: bigint;
}

/** How often {@link pollingWakes} wakes a private process until task 14.2's transport does. */
export const PUBLIC_POLL_MS = 1_000;

const BLOCKS_PRESENT_SQL = `SELECT to_regclass('${BLOCKS_TABLE}') IS NOT NULL AS present`;
const BLOCK_SQL = `SELECT height, hash, parent_hash FROM ${BLOCKS_TABLE} WHERE height = $1`;

/** Whether `read` finds the table a `to_regclass` statement asks for. */
async function present(read: Pick<ReadHandle, "query">, sql: string): Promise<boolean> {
  const [row] = await read.query(sql);
  return row?.present === true;
}

/**
 * The public database's chain identity — its genesis hash and S —, or null before its core first started (no
 * `core_chain.identity` row): `core-chain`'s `readIdentity`.
 */
export async function readPublicIdentity(read: Pick<ReadHandle, "query">): Promise<PublicIdentity | null> {
  const identity = await readIdentity(read);
  return identity === null ? null : Object.freeze({ genesisHash: identity.genesisHash, start: identity.start });
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

/** The public cursor: the last block the core committed (`core-block-commit`'s cursor table), or null before any. */
export const readPublicCursor: (read: Pick<ReadHandle, "query">) => Promise<BlockRef | null> = readCursor;

/**
 * The public database of `core`, a private process's `core` revision (Q102): its `publicDatabase`, a PostgreSQL URL,
 * opened for reads only — no writer, no lock; no connection until the first read. Throws `invalid-configuration`
 * (`details.reason` `public-database-transport`, not retried) without one, or for a PGlite one, which the core's
 * transport serves (PP-4, task 14.2).
 */
export function openPublicDatabase(core: CheckedEntry): PublicDatabase {
  const setting = (core.settings as PlainObject).publicDatabase;
  if (typeof setting !== "string" || setting.startsWith("pglite:")) {
    const found = setting === undefined ? "the private process's core entry has no publicDatabase" : "it is PGlite";
    throw new UmbraError(
      "invalid-configuration",
      `${found}: a private process reads a PostgreSQL public database directly, through publicDatabase (a login ` +
        "that may only read); a PGlite public database, which only the core opens, or one not given, is read " +
        "through the core's transport (PP-4), which this build does not have yet (task 14.2)",
      { reason: "public-database-transport" },
    );
  }
  const db = openPostgres({ url: setting, committedHeight: cursorHeight });
  return Object.freeze({
    read: <T>(body: (read: ReadHandle) => Promise<T>): Promise<T> => db.read(body),
    close: () => db.close(),
  });
}

/** Wakes a private process every `intervalMs` (see the module comment). */
export function pollingWakes(intervalMs: number = PUBLIC_POLL_MS): PublicWakes {
  return Object.freeze({
    next: (signal: AbortSignal) =>
      new Promise<void>((resolve, reject) => {
        if (signal.aborted) {
          reject(signal.reason);
          return;
        }
        const abort = (): void => {
          clearTimeout(timer);
          reject(signal.reason);
        };
        const timer = setTimeout(() => {
          signal.removeEventListener("abort", abort);
          resolve();
        }, intervalMs);
        signal.addEventListener("abort", abort, { once: true });
      }),
  });
}
