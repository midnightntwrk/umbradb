/**
 * The backbone part `core-chain` (`openspec/changes/core-arch/specs/chain-data/spec.md` CD-1, `specs/ingest/spec.md`
 * IN-2, IN-3, `specs/modules/spec.md` MD-7; `design.md` §10, §11; CORE-ARCH §4.4, §4.11): the chain's identity, the
 * configuration history (`./history.ts`, task 4.3), the startup checks against the node, and the `process` items every
 * module may require — `config`, `node-client`, `db` (read-only, Q73) and `ledger-table`.
 *
 * **Its tables**, in its reserved schema `core_chain` (DB-8), created by its migrations as the writer's login and
 * readable by every module role (DB-6): `001` the history's `core_chain.config` ({@link CONFIG_MIGRATION}, unchanged),
 * `002` `core_chain.identity` — one row: the genesis hash, S, and the anchor hash, null until block S commits (CD-1).
 *
 * **Startup**, as the runner (`src/runner/process.ts`) runs it:
 * 1. after the history's check and before any migration, {@link checkChain} asks the block source — the node, through
 *    `core-block-fetch` (task 10.3), or the in-memory source — for its genesis hash (block 0's, `chain_getBlockHash(0)`
 *    on the node) and, on a database with a cursor, compares it with the stored one (`genesis-mismatch`), waits while
 *    the node's finalized head is below the cursor (the condition `waiting-for-node`), and compares the node's
 *    finalized hash at the cursor's height with the cursor's (`cursor-hash-mismatch`) — IN-3;
 * 2. the runner binds the part to its process context ({@link bindCoreChain}) with what it checked and opened, and runs
 *    the migrations; the part's `on-start-db` ({@link coreChainStartDb}) records the configuration history (CF-6), on a
 *    database without a cursor records the genesis hash and S — again at every start until block S commits, so an
 *    interrupted bootstrap is repeated (IN-2) —, and publishes its four `process` items (MD-7);
 * 3. on a database without a cursor, once the module API listens, {@link waitForNode} waits, `starting` with
 *    `waiting-for-node`, while S is above the node's finalized head (IN-2).
 *
 * **Per block**, its `on-db-write` ({@link coreChainDbWrite}) records the anchor hash in block S's own transaction
 * (IN-2) and writes nothing at any other height. RN-3 runs it first, before `core-block-commit`'s (CD-3 says the latter
 * runs first: decision record question Q118).
 *
 * The declaration ({@link CORE_CHAIN}) is a constant, as `CORE_DIGEST` is: its callbacks find their process's facts
 * through the process context the runner bound (a `WeakMap`), so one build's declarations serve every process —
 * `umbradb config check`'s and the runner's alike — and a test may add points to a copy of it.
 */

import { z } from "zod";
import { UMBRADB_VERSION } from "../../config/build.js";
import type { HistoryOptions } from "../../config/history.js";
import type { CheckedConfig } from "../../config/validate.js";
import type { BlockWriteHandle, Database, ReadHandle, SchemaWriteHandle } from "../../db/api.js";
import { UmbraError } from "../../db/errors.js";
import { readOnlyDatabase } from "../../db/read-only.js";
import { type BlockContext, defineModule, type ModuleDeclaration, type ProcessContext } from "../../modules/declaration.js";
import type { DeclarationSet } from "../../modules/validation.js";
import { NodeClient, type NodeClientOptions } from "../../node/client.js";
import type { BlockRef, BlockSource } from "../../runner/block-source.js";
import { CONFIG_MIGRATION, recordHistory } from "./history.js";

/** The part's id: first of RN-3's fixed order (`BACKBONE_ORDER`). */
export const CORE_CHAIN_ID = "core-chain";

/** The identity's table: one row (id = 1). */
export const IDENTITY_TABLE = "core_chain.identity";

/** `core-chain`'s migration `002` (DB-9): the identity's table; never changed. */
export const IDENTITY_MIGRATION: { readonly id: string; readonly sql: string } = Object.freeze({
  id: "002",
  sql: `CREATE TABLE ${IDENTITY_TABLE} (
  id smallint PRIMARY KEY CHECK (id = 1),
  genesis_hash bytea NOT NULL CHECK (octet_length(genesis_hash) = 32),
  start_height bigint NOT NULL CHECK (start_height >= 0),
  anchor_hash bytea CHECK (octet_length(anchor_hash) = 32)
);`,
});

/** `core-chain`'s migrations (DB-9), in order: `001` the history's table, `002` the identity's. */
export const CORE_CHAIN_MIGRATIONS: readonly { readonly id: string; readonly sql: string }[] = Object.freeze([
  CONFIG_MIGRATION,
  IDENTITY_MIGRATION,
]);

/**
 * The `ledger-table` item until tasks 12.x give it (CORE-ARCH §4.8: the built-in table for the network, rows
 * `{ specVersionMin, specVersionMax, ledger }` and pins `{ height, hash, specVersion }`, with the `core` entry's
 * `ledgerTable` and package sources): no rows and no pins.
 */
export const PENDING_LEDGER_TABLE: { readonly rows: readonly never[]; readonly pins: readonly never[] } = Object.freeze({
  rows: Object.freeze([]),
  pins: Object.freeze([]),
});

/** The chain's identity as `core_chain.identity` holds it (CD-1). */
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

/** A hash as `0x`-prefixed lowercase hex, as the process transport writes hashes. */
function hex(bytes: Uint8Array): string {
  return `0x${Array.from(bytes, (byte) => byte.toString(16).padStart(2, "0")).join("")}`;
}

/** Whether two byte strings are equal. */
function sameBytes(a: Uint8Array, b: Uint8Array): boolean {
  return a.length === b.length && a.every((byte, index) => byte === b[index]);
}

/** A wait for the node (the condition `waiting-for-node`): the height waited for, and the node's head when it began. */
export interface NodeWait {
  readonly height: bigint;
  readonly head: bigint;
}

/** Told when a wait for the node begins (the wait) and ends (null). */
export type WaitingListener = (wait: NodeWait | null) => void;

/** What the node is asked: the block source's finalized head, its finalized blocks, and a wait for the head. */
export type ChainSource = Pick<BlockSource, "finalizedHead" | "block" | "waitForHead">;

/**
 * Waits while the source's finalized head is below `height` (IN-2, IN-3: the condition `waiting-for-node`): not at all
 * when it is at or above it; otherwise tells `onWaiting` the wait, waits for the head to reach `height`, and tells it
 * the wait ended (null), also when `signal` stops it — then rejecting with the signal's reason.
 */
export async function waitForNode(
  source: ChainSource,
  height: bigint,
  signal: AbortSignal,
  onWaiting?: WaitingListener,
): Promise<void> {
  const head = await source.finalizedHead();
  if (head.height >= height) return;
  onWaiting?.(Object.freeze({ height, head: head.height }));
  try {
    await source.waitForHead(height - 1n, signal);
  } finally {
    onWaiting?.(null);
  }
}

/** What {@link checkChain} takes. */
export interface ChainCheckInput {
  /** The node, as the block source answers for it. */
  readonly source: ChainSource;
  /** The stored identity (`readIdentity`), null on a new database. */
  readonly identity: ChainIdentity | null;
  /** The cursor (the blocks table's last row), null on a new database. */
  readonly cursor: BlockRef | null;
  /** Stops a wait for the node. */
  readonly signal: AbortSignal;
  readonly onWaiting?: WaitingListener;
}

/** What {@link checkChain} found. */
export interface ChainCheck {
  /** The node's genesis hash: the hash of its block 0. */
  readonly genesisHash: Uint8Array;
}

/**
 * IN-3's startup checks, before any migration (see the module comment): the node's genesis hash — its block 0's — and,
 * on a database with a cursor, the stored genesis hash compared with it (`genesis-mismatch`, both hashes), then a wait
 * while the node's finalized head is below the cursor ({@link waitForNode}), then the node's finalized hash at the
 * cursor's height compared with the cursor's (`cursor-hash-mismatch`, the height and both hashes). A database without
 * a cursor compares nothing: its bootstrap is repeated (IN-2). Throws a plain `Error` for a cursor without an identity.
 */
export async function checkChain(input: ChainCheckInput): Promise<ChainCheck> {
  const { source, identity, cursor } = input;
  const genesisHash = (await source.block(0n)).hash;
  if (cursor === null) return Object.freeze({ genesisHash });
  if (identity === null) {
    throw new Error(
      `the database has a cursor (height ${cursor.height}) but no ${IDENTITY_TABLE} row: core-chain records the ` +
        "identity before block S commits, so this database was not written by core-chain",
    );
  }
  if (!sameBytes(identity.genesisHash, genesisHash)) {
    throw new UmbraError(
      "genesis-mismatch",
      `the node's genesis hash is ${hex(genesisHash)}, but the database's chain has the genesis hash ` +
        `${hex(identity.genesisHash)}: the configured node serves another chain (IN-3); configure a node of the ` +
        "database's network",
      { stored: hex(identity.genesisHash), node: hex(genesisHash) },
    );
  }
  await waitForNode(source, cursor.height, input.signal, input.onWaiting);
  const atCursor = (await source.block(cursor.height)).hash;
  if (!sameBytes(atCursor, cursor.hash)) {
    throw new UmbraError(
      "cursor-hash-mismatch",
      `the node's finalized block at height ${cursor.height} has the hash ${hex(atCursor)}, but the database committed ` +
        `${hex(cursor.hash)} there: the node finalized another chain than the one the database holds (IN-3)`,
      { height: cursor.height, stored: hex(cursor.hash), node: hex(atCursor) },
    );
  }
  return Object.freeze({ genesisHash });
}

/**
 * The node client's options from the process's `core` settings (CF-4, Q102): its `node` and `backoffCeilingMs`; null for
 * a process without a node (a private process, whose `core` entry has none).
 */
export function nodeOptionsOf(settings: Readonly<Record<string, unknown>>): NodeClientOptions | null {
  if (typeof settings.node !== "string") return null;
  return { url: settings.node, backoffCeilingMs: settings.backoffCeilingMs as number };
}

/** What a process gives `core-chain` (see {@link bindCoreChain}). */
export interface CoreChainFacts {
  /** The validated configuration: its history recorded (CF-6), and published as the `config` item. */
  readonly config: CheckedConfig;
  /** The build's validated declarations, which the history's check reads. */
  readonly declarations: DeclarationSet<ModuleDeclaration>;
  /** The cursor's height at startup, null on a new database. */
  readonly cursor: bigint | null;
  /** The database, opened and its writer started: published read-only as the `db` item (Q73). */
  readonly db: Database;
  /** S. */
  readonly start: bigint;
  /** The node's genesis hash, as {@link checkChain} found it. */
  readonly genesisHash: Uint8Array;
  /** The node client's options (`nodeOptionsOf`), or null for none: no `node-client` item is then published. */
  readonly node: NodeClientOptions | null;
}

/** A process's `core-chain`, bound by {@link bindCoreChain}. */
export interface CoreChainBinding {
  /** The node client it publishes as `node-client`, or null. */
  readonly nodeClient: NodeClient | null;
  /** Closes what the part opened: its node client (every call and subscription ends with `handle-closed`). */
  close(): Promise<void>;
}

/** What a bound context holds. */
interface Bound {
  readonly facts: CoreChainFacts;
  readonly nodeClient: NodeClient | null;
  /** The `db` item, made once and shared by every module that requires it (task 2.8's note (b)). */
  readonly db: ReturnType<typeof readOnlyDatabase>;
}

const BOUND = new WeakMap<ProcessContext, Bound>();

/**
 * Binds `core-chain` to its process context `context` with the process's `facts` (see the module comment), before
 * `startDatabase` runs its `on-start-db`: makes the node client (no connection until its first call) and the read-only
 * `db` item. Throws when `context` is bound already.
 */
export function bindCoreChain(context: ProcessContext, facts: CoreChainFacts): CoreChainBinding {
  if (BOUND.has(context)) throw new Error("bindCoreChain: core-chain is bound once per process context");
  const nodeClient = facts.node === null ? null : new NodeClient(facts.node);
  BOUND.set(context, Object.freeze({ facts, nodeClient, db: readOnlyDatabase(facts.db) }));
  return Object.freeze({
    nodeClient,
    close: async () => {
      await nodeClient?.close();
    },
  });
}

/** What the runner bound to `p`; throws for a context no runner bound. */
function boundTo(p: ProcessContext, point: "on-start-db" | "on-db-write"): Bound {
  const bound = BOUND.get(p);
  if (bound === undefined) {
    throw new Error(
      `core-chain's ${point} ran with a process context the runner did not bind: the runner gives core-chain the ` +
        "facts of its startup (bindCoreChain) before startDatabase runs its on-start-db",
    );
  }
  return bound;
}

/**
 * `core-chain`'s `on-start-db` (see the module comment): the history recorded in the callback's transaction (CF-6,
 * `recordHistory`, with `options.history` — a negative control's), the identity's genesis hash and S on a database
 * without a cursor (IN-2), and the `process` items `config`, `node-client` (when the process has a node), `db` and
 * `ledger-table` published (MD-7).
 */
export async function coreChainStartDb(
  p: ProcessContext,
  w: SchemaWriteHandle,
  options: { readonly history?: HistoryOptions } = {},
): Promise<void> {
  const { facts, nodeClient, db } = boundTo(p, "on-start-db");
  await recordHistory(w, { config: facts.config, declarations: facts.declarations, cursor: facts.cursor }, options.history);
  if (facts.cursor === null) await w.execute(RECORD_IDENTITY_SQL, [facts.genesisHash, facts.start]);
  p.publish("config", facts.config);
  if (nodeClient !== null) p.publish("node-client", nodeClient);
  p.publish("db", db);
  p.publish("ledger-table", PENDING_LEDGER_TABLE);
}

/**
 * `core-chain`'s `on-db-write` (see the module comment): at block S, the anchor hash — the block's hash — recorded in the
 * block's transaction (IN-2, CD-1), failing the block when the identity holds no row or an anchor already; at every
 * other height, nothing.
 */
export async function coreChainDbWrite(p: ProcessContext, b: BlockContext, w: BlockWriteHandle): Promise<void> {
  const { facts } = boundTo(p, "on-db-write");
  if (b.height !== facts.start) return;
  const recorded = await w.execute(ANCHOR_SQL, [b.hash]);
  if (recorded !== 1) {
    throw new Error(
      `core-chain could not record the anchor hash of block S (${b.height}) in ${IDENTITY_TABLE}: the row is missing ` +
        "or holds an anchor already, which only block S's own transaction writes (IN-2, CD-1)",
    );
  }
}

/**
 * `core-chain` (see the module comment): a backbone part that requires nothing and provides the `process` items
 * `config`, `node-client`, `db` and `ledger-table` and the `table` item `chain-identity`; every backbone part starts at
 * S, a mid-chain start when S is above 0 (Q96).
 */
export const CORE_CHAIN = defineModule({
  id: CORE_CHAIN_ID,
  version: UMBRADB_VERSION,
  side: "public",
  requires: [],
  provides: [
    { name: "config", lifetimes: ["process"] },
    { name: "node-client", lifetimes: ["process"] },
    { name: "db", lifetimes: ["process"] },
    { name: "ledger-table", lifetimes: ["process"] },
    {
      name: "chain-identity",
      lifetimes: ["table"],
      table: { schema: "core_chain", tables: ["identity"], kind: "mutable" },
    },
  ],
  startsMidChain: true,
  configSchema: z.object({}),
  migrations: CORE_CHAIN_MIGRATIONS.map(({ id, sql }) => ({ id, sql })),
  points: {
    async "on-start-db"(p, w) {
      await coreChainStartDb(p, w);
    },
    async "on-db-write"(p, b, w) {
      await coreChainDbWrite(p, b, w);
    },
  },
});
