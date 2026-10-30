/**
 * The public data a private process reads. A private process reads the public database, and the public side never
 * reads a private one. It reads:
 * - its binding to the public database;
 * - the public cursor, and each public block it processes;
 * - the public data its modules' `on-fetch` callbacks read at a height.
 * It is also woken whenever the public cursor may have moved.
 * [PP-1, PP-2, PP-3, PP-4, PP-5, Q100; CORE-ARCH §4.14; design §8]
 *
 * **Every read of public tables is in this file, or with its statement in `./sql.ts`:**
 * - {@link readPublicIdentity}: `core_chain.identity`'s genesis hash and S, through `core-chain`'s own `readIdentity`.
 * - `readPublicItems` (`./sql.ts`): the public core's `table` items with their heights, from `core_chain.config`'s
 *   `provides`. [PP-13]
 * - `readPublicBlock` (`./sql.ts`): the height, hash and parent hash in `core_block_commit.blocks`, which its other
 *   columns, its partitions and the `hashes` table do not affect.
 * - The public cursor: `core-block-commit`'s own `readCursor`, the last row of the blocks table, read the way the core
 *   reads it.
 *
 * **Where the public data comes from** ({@link PublicDatabase}):
 * - On PostgreSQL, directly: `publicDatabase` holds the parts of a login that may only read. {@link openPublicDatabase}
 *   opens it for reads only, each read one `REPEATABLE READ READ ONLY` transaction at the public cursor's height.
 *   [DB-2]
 * - Otherwise, through the core's transport (`read` messages, `src/private/private-transport.ts`), at the `core`
 *   entry's `coreTransport`. This covers a PGlite public database, which only the core can open, and a missing
 *   `publicDatabase`. [DB-4, PP-4]
 * - A private process with neither is refused.
 *
 * **What wakes the private process** ({@link PublicWakes}): with `coreTransport`, only the core's `committed` messages
 * and every connection or reconnection of the transport. These only wake it; it then reads the public cursor itself. A
 * private process without a transport (its public database is PostgreSQL, read directly) reads the public cursor every
 * {@link PUBLIC_POLL_MS} instead ({@link pollingWakes}). {@link openPublicSide} builds both from the `core` revision.
 * [PP-3]
 */

import type { PostgresParts } from "../../config/database-parts.js";
import { cursorHeight, readCursor } from "../core-block-commit/sql.js";
import { readIdentity } from "../core-chain/sql.js";
import { readConfigRows } from "../core-chain/sql.js";
import { configHashOf, publicItemRanges } from "../../config/history.js";
import type { PlainObject } from "../../config/plain-data.js";
import type { CheckedEntry } from "../../config/validate.js";
import type { ReadHandle } from "../../db/api.js";
import { UmbraError } from "../../db/errors.js";
import { openPostgres } from "../../db/postgres.js";
import { UMBRADB_VERSION } from "../../config/build.js";
import type { TransportTls } from "../../private/core-transport.js";
import { PrivateTransport, type TransportPosition } from "../../private/private-transport.js";
import type { PublicItem } from "../../modules/graph.js";
import type { BlockRef } from "../../runner/block-source.js";

/** The public database as a private process reads it (see the module comment). */
export interface PublicDatabase {
  /**
   * Runs `body` with one consistent read of the public database at its committed height (the public cursor), as
   * `Database.read` does. Rejects with `body`'s error or the database's; `connection-lost` is retried. [DB-2]
   */
  read<T>(body: (read: ReadHandle) => Promise<T>): Promise<T>;
  /** Closes what reading it opened. */
  close(): Promise<void>;
  /**
   * How many connections to it have been lost so far: for a PostgreSQL public database read directly, its read pool's
   * lost sessions. Each loss is followed by a reconnection, after which a private process without a transport reads the
   * public configuration history again. Absent for a database that does not count them. [PP-14]
   */
  reconnections?(): number;
}

/** What wakes a private process's wait for the public cursor (see the module comment). */
export interface PublicWakes {
  /**
   * Resolves at the next wake-up after the call: a `committed` message, a connection or reconnection of the transport,
   * or the end of a poll interval. Rejects with `signal`'s reason once `signal` aborts, at once if it already has.
   */
  next(signal: AbortSignal): Promise<void>;
}

/** The public database's chain identity: its genesis hash and S. [CORE-ARCH §4.11] */
export interface PublicIdentity {
  readonly genesisHash: Uint8Array;
  readonly start: bigint;
}

/** How often {@link pollingWakes} wakes a private process that has no transport to the core. */
export const PUBLIC_POLL_MS = 1_000;

/**
 * The public database's chain identity (its genesis hash and S), read by `core-chain`'s `readIdentity`. Null before
 * its core first started, when there is no `core_chain.identity` row.
 */
export async function readPublicIdentity(read: Pick<ReadHandle, "query">): Promise<PublicIdentity | null> {
  const identity = await readIdentity(read);
  return identity === null ? null : Object.freeze({ genesisHash: identity.genesisHash, start: identity.start });
}

/** The public configuration as a private process reads it at startup: its `table` items and its configuration hash. */
export interface PublicConfiguration {
  readonly items: PublicItem[];
  /** `configHashOf` the rows of the public `core_chain.config`; null before the table exists. [RN-16, PP-14] */
  readonly configHash: string | null;
}

/**
 * The public core's `table` items with their heights (as `readPublicItems`, in `./sql.ts`, returns them) and its
 * configuration hash, both from one statement of `read`. The hash is the same one the core computes
 * (`readConfigHash`), from the same rows with the same function. [PP-13, PP-14, RN-16]
 */
export async function readPublicConfiguration(read: Pick<ReadHandle, "query">): Promise<PublicConfiguration> {
  const rows = await readConfigRows(read);
  if (rows === null) return Object.freeze({ items: [], configHash: null });
  return Object.freeze({ items: publicItemRanges(rows), configHash: configHashOf(rows) });
}

/** The public configuration hash of `read` (`configHashOf` its `core_chain.config`; null before the table exists). */
export async function readPublicConfigHash(read: Pick<ReadHandle, "query">): Promise<string | null> {
  const rows = await readConfigRows(read);
  return rows === null ? null : configHashOf(rows);
}

/** The public cursor: the last block the core committed (`core-block-commit`'s cursor table), or null before any. */
export const readPublicCursor: (read: Pick<ReadHandle, "query">) => Promise<BlockRef | null> = readCursor;

/** Whether `setting` is a `publicDatabase` read directly: PostgreSQL's parts (not PGlite, which only the core opens). */
const readsDirectly = (setting: unknown): setting is PostgresParts =>
  typeof setting === "object" && setting !== null && (setting as { kind?: unknown }).kind === "postgres";

/**
 * The public database of `core`, a private process's `core` revision: its `publicDatabase` (PostgreSQL's parts),
 * opened for reads only. There is no writer and no lock, and no connection is made before the first read. It counts the
 * read sessions it lost ({@link PublicDatabase.reconnections}).
 * [Q102, PP-14]
 *
 * Throws `invalid-configuration` (`details.reason` `public-database-transport`, not retried) when there is no
 * `publicDatabase`, or when it is PGlite: that one is read through the core's transport instead
 * ({@link openPublicSide}). [PP-4]
 */
export function openPublicDatabase(core: CheckedEntry): PublicDatabase {
  const setting = (core.settings as PlainObject).publicDatabase;
  if (!readsDirectly(setting)) {
    const found = setting === undefined ? "the private process's core entry has no publicDatabase" : "it is PGlite";
    throw new UmbraError(
      "invalid-configuration",
      `${found}: openPublicDatabase reads a PostgreSQL public database directly, through publicDatabase (a login ` +
        "that may only read); a PGlite public database, which only the core opens, or one not given, is read " +
        "through the core's transport, at the core entry's coreTransport",
      { reason: "public-database-transport" },
    );
  }
  let lost = 0;
  const { kind: _kind, ...connection } = setting as PostgresParts;
  const db = openPostgres({
    connection,
    committedHeight: cursorHeight,
    onReadSessionLost: () => {
      lost += 1;
    },
    // The public process migrates its database at its own startups, which this process does not see.
    preparedStatements: false,
  });
  return Object.freeze({
    read: <T>(body: (read: ReadHandle) => Promise<T>): Promise<T> => db.read(body),
    close: () => db.close(),
    reconnections: () => lost,
  });
}

/** What {@link openPublicSide} needs besides the `core` revision: the private process's position, S and its log. */
export interface PublicSideOptions {
  /** Its position now, for each `hello` of its transport. */
  readonly position: () => TransportPosition;
  /** Where its transport's log lines go. */
  readonly log: (line: string) => void;
  /**
   * Whether its transport checks the core's `configHash`: `check` by default, `ignore` in a negative control. [PP-14]
   */
  readonly configHash?: "check" | "ignore";
}

/** A private process's public side: its public database, what wakes it, and its transport, if any (closed with it). */
export interface PublicSide {
  readonly publicDatabase: PublicDatabase;
  readonly wakes: PublicWakes;
  /** The transport to the core, made from `coreTransport`; null without it. */
  readonly transport: PrivateTransport | null;
}

/**
 * The public side of a private process, built from its `core` revision (see the module comment):
 * - a transport to the core when the revision has `coreTransport` (with its `tls`, `instanceId` and
 *   `backoffCeilingMs`);
 * - its public database, read directly when `publicDatabase` is PostgreSQL's parts, otherwise through the transport;
 * - its wake-ups: the transport's, otherwise a poll.
 *
 * Throws `invalid-configuration` (`public-database-transport`) for a revision with neither a PostgreSQL
 * `publicDatabase` nor a `coreTransport`, since it then has no way to read public data. `given` replaces the public
 * database or the wake-ups (tests use it for direct reads and links).
 */
export function openPublicSide(
  core: CheckedEntry,
  options: PublicSideOptions,
  given: { readonly publicDatabase?: PublicDatabase; readonly wakes?: PublicWakes } = {},
): PublicSide {
  const settings = core.settings as PlainObject;
  const address = settings.coreTransport;
  const transport =
    typeof address === "string"
      ? new PrivateTransport({
          address,
          tls: settings.tls as unknown as TransportTls | undefined,
          instance: settings.instanceId as string,
          version: UMBRADB_VERSION,
          position: options.position,
          backoffCeilingMs: settings.backoffCeilingMs as number,
          log: options.log,
          ...(options.configHash === undefined ? {} : { configHash: options.configHash }),
        })
      : null;
  let publicDatabase = given.publicDatabase;
  if (publicDatabase === undefined && readsDirectly(settings.publicDatabase)) publicDatabase = openPublicDatabase(core);
  if (publicDatabase === undefined && transport !== null) publicDatabase = transport.publicDatabase();
  if (publicDatabase === undefined) {
    const which = settings.publicDatabase === undefined ? "no publicDatabase" : "a PGlite publicDatabase";
    throw new UmbraError(
      "invalid-configuration",
      `the private process's core entry has ${which} and no coreTransport: a private process reads a PostgreSQL ` +
        "public database directly (publicDatabase, a login that may only read), or any public database through the " +
        "core's transport (coreTransport, the core's listen.transport), which also wakes it at every public commit; " +
        "give it one of them",
      { reason: "public-database-transport" },
    );
  }
  return Object.freeze({ publicDatabase, wakes: given.wakes ?? transport ?? pollingWakes(), transport });
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
