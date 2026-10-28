/**
 * The public data a private process reads (`openspec/changes/core-arch/specs/private-processes/spec.md` PP-1–PP-5;
 * `design.md` §8; CORE-ARCH §4.14): a private process reads the public database — never the reverse (PP-1) — for its
 * binding (PP-2), the public cursor and each public block it processes (PP-3), and the reads its modules' `on-fetch`
 * make of public data at a height (decision record Q100); and it is woken when the public cursor may have moved.
 *
 * **Every read of public tables is here**, in one place: {@link readPublicIdentity} (`core_chain.identity`'s genesis
 * hash and S, through `core-chain`'s own `readIdentity`, task 10.2), {@link readPublicItems} (the public core's `table`
 * items with their heights, from `core_chain.config`'s `provides`; PP-13, task 14.1a), {@link readPublicBlock}
 * (`core_block_commit.blocks`' height, hash and parent hash, which its other columns, partitions and `hashes` table do
 * not change), and the public cursor, which is `core-block-commit`'s own `readCursor` — the blocks table's last row, as
 * the core reads it.
 *
 * **Where the public data comes from** ({@link PublicDatabase}): on PostgreSQL directly — `publicDatabase`, the parts of
 * a login that may only read, opened by {@link openPublicDatabase} with reads only (one `REPEATABLE READ READ ONLY`
 * transaction each, its height the public cursor's, DB-2); when the public database is PGlite, which only the core can
 * open (DB-4), or when none is given, through the core's transport (`read` messages, PP-4; task 14.2,
 * `src/private/private-transport.ts`), at the `core` entry's `coreTransport`; a private process with neither is refused.
 *
 * **What wakes the private process** ({@link PublicWakes}): with `coreTransport`, the core's `committed` messages and
 * every (re)connection of its transport (PP-3: they only wake it; it reads the public cursor itself), and nothing else;
 * a private process without one (its public database PostgreSQL, read directly) reads the public cursor every
 * {@link PUBLIC_POLL_MS} instead ({@link pollingWakes}). {@link openPublicSide} makes both from the `core` revision.
 */

import type { PostgresParts } from "../../config/database-parts.js";
import { BLOCKS_TABLE, cursorHeight, readCursor } from "../core-block-commit/core-block-commit.js";
import { readIdentity } from "../core-chain/core-chain.js";
import { readConfigRows } from "../core-chain/history.js";
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
   * Runs `body` with one consistent read of the public database, at its committed height — the public cursor —, as
   * `Database.read` does (DB-2); rejects with `body`'s error or the database's (`connection-lost` is retried).
   */
  read<T>(body: (read: ReadHandle) => Promise<T>): Promise<T>;
  /** Closes what reading it opened. */
  close(): Promise<void>;
  /**
   * How many connections to it were lost so far (a PostgreSQL public database read directly: its read pool's lost
   * sessions); each is followed by a reconnection, at which a private process without a transport reads the public
   * configuration history again (PP-14). None for a database that does not count them.
   */
  reconnections?(): number;
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

/** How often {@link pollingWakes} wakes a private process that has no transport to the core. */
export const PUBLIC_POLL_MS = 1_000;

const CONFIG_PRESENT_SQL = "SELECT to_regclass('core_chain.config') IS NOT NULL AS present";
const ITEMS_SQL = "SELECT entry_id, start, stop, provides FROM core_chain.config";
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

/**
 * The public core's `table` items with their heights (PP-13, task 14.1a; `design.md` §8): every row of its
 * `core_chain.config` — the revisions of its entries, with the `table` items each provides (`provides`) — as
 * `publicItemRanges` gives them, each from its revision's start to its last height by CF-5; none before the table exists.
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

/** The public configuration as a private process reads it at startup: its `table` items and its configuration hash. */
export interface PublicConfiguration {
  readonly items: PublicItem[];
  /** `configHashOf` the rows of the public `core_chain.config` (RN-16, PP-14); null before the table exists. */
  readonly configHash: string | null;
}

/**
 * The public core's `table` items with their heights ({@link readPublicItems}' result) and its configuration hash — the
 * core's own, by the same rows and function (`readConfigHash`, RN-16) — from one statement of `read` (PP-13, PP-14;
 * tasks 14.1a, 14.1b).
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

/** Whether `setting` is a `publicDatabase` read directly: PostgreSQL's parts (not PGlite, which only the core opens). */
const readsDirectly = (setting: unknown): setting is PostgresParts =>
  typeof setting === "object" && setting !== null && (setting as { kind?: unknown }).kind === "postgres";

/**
 * The public database of `core`, a private process's `core` revision (Q102): its `publicDatabase`, PostgreSQL's parts,
 * opened for reads only — no writer, no lock; no connection until the first read —, counting the read sessions it lost
 * ({@link PublicDatabase.reconnections}, PP-14). Throws `invalid-configuration`
 * (`details.reason` `public-database-transport`, not retried) without one, or for a PGlite one, which is read through
 * the core's transport instead ({@link openPublicSide}, PP-4).
 */
export function openPublicDatabase(core: CheckedEntry): PublicDatabase {
  const setting = (core.settings as PlainObject).publicDatabase;
  if (!readsDirectly(setting)) {
    const found = setting === undefined ? "the private process's core entry has no publicDatabase" : "it is PGlite";
    throw new UmbraError(
      "invalid-configuration",
      `${found}: openPublicDatabase reads a PostgreSQL public database directly, through publicDatabase (a login ` +
        "that may only read); a PGlite public database, which only the core opens, or one not given, is read " +
        "through the core's transport, at the core entry's coreTransport (PP-4)",
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
  /** Whether its transport checks the core's `configHash` (PP-14); `check` unless given (the negative control's `ignore`). */
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
 * The public side of a private process from its `core` revision (see the module comment): a transport to the core when
 * it has `coreTransport` (with its `tls`, `instanceId` and `backoffCeilingMs`); its public database read directly when
 * `publicDatabase` is PostgreSQL's parts, else through that transport; its wake-ups the transport's, else a poll. Throws
 * `invalid-configuration` (`public-database-transport`) for a revision with neither a PostgreSQL `publicDatabase` nor a
 * `coreTransport`: it has no way to read public data. `given` replaces either part (the tests' direct reads and links).
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
        "core's transport (coreTransport, the core's listen.transport), which also wakes it at every public commit " +
        "(PP-3, PP-4); give it one of them",
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
