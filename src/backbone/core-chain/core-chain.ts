/**
 * The backbone part `core-chain`. It holds the chain's identity, the configuration history (`./history.ts`), the
 * startup checks against the node, and the `process` items every module may require: `config`, `node-client`, `db`
 * (read-only) and `ledger-table`. [CD-1, IN-2, IN-3, MD-7, Q73; CORE-ARCH §4.4, §4.11; design §11]
 *
 * **Its tables** live in its reserved schema `core_chain`. Its migrations create them as the writer's login, and every
 * module role can read them: [DB-6, DB-8; design §10]
 * - `001`: the history's `core_chain.config` ({@link CONFIG_MIGRATION});
 * - `002`: `core_chain.identity`, one row holding the genesis hash, S, and the anchor hash, which is null until block S
 *   commits. [CD-1]
 *
 * **Startup**, as the runner (`src/runner/process.ts`) runs it:
 * 1. After the history's check and before any migration, {@link checkChain} asks the block source (the node, through
 *    `core-block-fetch`, or the in-memory source) for its genesis hash: block 0's, `chain_getBlockHash(0)` on the node.
 *    At every start it compares that hash with the configured network's ({@link configuredGenesisOf}): built in for the
 *    four known networks and read through the built-in network table, or the `core` entry's `genesisHash` for
 *    `custom`. It refuses a known network whose built-in table records no genesis hash. Then, on a database with a
 *    cursor, it compares the hash with the stored one (`genesis-mismatch`), waits while the node's finalized head is
 *    below the cursor (the condition `waiting-for-node`), and compares the node's finalized hash at the cursor's height
 *    with the cursor's (`cursor-hash-mismatch`). [IN-3, Q117, Q120]
 * 2. The runner binds the part to its process context ({@link bindCoreChain}) with what it checked and opened, and runs
 *    the migrations. The part's `on-start-db` ({@link coreChainStartDb}) then:
 *    - records the configuration history [CF-6];
 *    - on a database without a cursor, records the genesis hash and S. It does so again at every start until block S
 *      commits, so an interrupted bootstrap is repeated [IN-2];
 *    - publishes its `process` items. `node-client` is the process's one node client, the one its block source
 *      (`core-block-fetch`'s node source) reads the chain through; `ledger-table` is the `core` revision's ledger
 *      table in effect (`ledgerTable`). [MD-7, LG-3]
 * 3. On a database without a cursor, once the module API listens, {@link waitForNode} waits (state `starting`,
 *    condition `waiting-for-node`) while S is above the node's finalized head. [IN-2]
 *
 * **Per block**, its `on-db-write` ({@link coreChainDbWrite}) records the anchor hash in block S's own transaction and
 * writes nothing at any other height. The fixed backbone order runs it first, before `core-block-commit`'s, although
 * the chain-data requirement says the latter runs first. [IN-2, RN-3, CD-3, Q118]
 *
 * The declaration ({@link CORE_CHAIN}) is a constant, as `CORE_DIGEST` is. Its callbacks find their process's facts
 * through the process context the runner bound (a `WeakMap`), so one build's declarations serve every process
 * (`umbradb config check`'s and the runner's alike), and a test may add points to a copy of it.
 */

import { z } from "zod";
import { UMBRADB_VERSION } from "../../config/build.js";
import type { HistoryOptions } from "../../config/history.js";
import type { CheckedConfig } from "../../config/validate.js";
import type { BlockWriteHandle, Database, ReadHandle, SchemaWriteHandle } from "../../db/api.js";
import { UmbraError } from "../../db/errors.js";
import { readOnlyDatabase } from "../../db/read-only.js";
import { type BuiltInNetwork, builtInNetwork } from "../../ledger/networks.js";
import type { LedgerTable } from "../../ledger/version-table.js";
import { type BlockContext, defineModule, type ModuleDeclaration, type ProcessContext } from "../../modules/declaration.js";
import type { PublicItem } from "../../modules/graph.js";
import type { DeclarationSet } from "../../modules/validation.js";
import type { NodeClient, NodeClientOptions } from "../../node/client.js";
import type { BlockRef, BlockSource } from "../../runner/block-source.js";
import { CONFIG_MIGRATION, recordHistory } from "./history.js";

/** The part's id: the first in the fixed backbone order (`BACKBONE_ORDER`). [RN-3] */
export const CORE_CHAIN_ID = "core-chain";

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
 * Waits while the source's finalized head is below `height` (the condition `waiting-for-node`). It does not wait when
 * the head is at or above `height`. Otherwise it tells `onWaiting` the wait, waits for the head to reach `height`, and
 * tells `onWaiting` that the wait ended (null). It does so also when `signal` stops the wait, and then rejects with the
 * signal's reason. [IN-2, IN-3]
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

/**
 * The genesis hash the configuration names: the configured network's, which the node's must equal at every start.
 * [IN-3, Q117, Q120]
 */
export interface ConfiguredGenesis {
  /** The `core` entry's `network`. [CF-4] */
  readonly network: string;
  /**
   * Its genesis hash: the built-in table's for a known network (`src/ledger/networks.json`), or the entry's
   * `genesisHash` for `custom`. It is null for a known network whose built-in table records none, which is refused.
   * [LG-3, Q117]
   */
  readonly hash: Uint8Array | null;
}

/** `text`, `0x`-prefixed hex as the configuration and the built-in tables write hashes (both checked so), as bytes. */
function bytesOf(text: string): Uint8Array {
  const bytes = new Uint8Array((text.length - 2) / 2);
  for (let index = 0; index < bytes.length; index++) bytes[index] = Number.parseInt(text.slice(2 + 2 * index, 4 + 2 * index), 16);
  return bytes;
}

/**
 * The configured network's genesis hash ({@link ConfiguredGenesis}), frozen, from a `core` revision's settings: the
 * process's, whose `network` and `genesisHash` data fields the validation has checked. [CF-4]
 * - For `custom`, it is `genesisHash`.
 * - Otherwise it is the built-in network table's, read through `lookup` (`builtInNetwork`; never a constant), or null
 *   when the table has no entry for the network or records no genesis hash for it.
 */
export function configuredGenesisOf(
  settings: Readonly<Record<string, unknown>>,
  lookup: (network: string) => BuiltInNetwork | null = builtInNetwork,
): ConfiguredGenesis {
  const network = settings.network as string;
  const text = network === "custom" ? (settings.genesisHash as string) : (lookup(network)?.genesis?.hash ?? null);
  return Object.freeze({ network, hash: text === null ? null : bytesOf(text) });
}

/** What {@link checkChain} takes. */
export interface ChainCheckInput {
  /** The node, as the block source answers for it. */
  readonly source: ChainSource;
  /** The configured network's genesis hash ({@link configuredGenesisOf}), compared with the node's at every start. */
  readonly configured: ConfiguredGenesis;
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
  /**
   * Set only by a private process's source (`PrivateBlockSource.checkChain`): the public core's `table` items with
   * their heights, read from its public database's configuration history, which the runner gives the graph
   * (`GraphInput.publicItems`). Absent from `core-chain`'s own check, since a public process has none. [PP-13]
   */
  readonly publicItems?: readonly PublicItem[];
}

/**
 * The startup checks against the node, run before any migration (see the module comment), in this order: [IN-3]
 * 1. A known network whose built-in table records no genesis hash is refused before the node is asked, since the build
 *    has nothing to check the node against (`genesis-mismatch`, `details { network, configured: null }`). [Q117]
 * 2. The node's genesis hash (its block 0's) is compared with the configured network's at every start, on a database
 *    without a cursor too (`genesis-mismatch`, `details { network, configured, node }`). [Q120]
 * 3. On a database with a cursor, the stored genesis hash is compared with the node's (`genesis-mismatch`,
 *    `details { stored, node }`: a database written for another chain).
 * 4. It waits while the node's finalized head is below the cursor ({@link waitForNode}).
 * 5. The node's finalized hash at the cursor's height is compared with the cursor's (`cursor-hash-mismatch`, with the
 *    height and both hashes). This comes last, as the node's hash there is a finalized one only once its head has
 *    reached the cursor.
 *
 * A database without a cursor compares nothing more: its bootstrap is repeated. Throws a plain `Error` for a cursor
 * without an identity. [IN-2]
 */
export async function checkChain(input: ChainCheckInput): Promise<ChainCheck> {
  const { source, identity, cursor, configured } = input;
  if (configured.hash === null) {
    throw new UmbraError(
      "genesis-mismatch",
      `this build records no genesis hash for the network ${configured.network}, so the node's genesis hash cannot be ` +
        "checked against it: a known network starts only with a build whose built-in table records its genesis hash",
      { network: configured.network, configured: null },
    );
  }
  const genesisHash = (await source.block(0n)).hash;
  if (!sameBytes(configured.hash, genesisHash)) {
    throw new UmbraError(
      "genesis-mismatch",
      `the node's genesis hash is ${hex(genesisHash)}, but the configured network ${configured.network} has the genesis ` +
        `hash ${hex(configured.hash)}: the configured node serves another network; configure a node of ` +
        `${configured.network}, or the network the node serves`,
      { network: configured.network, configured: hex(configured.hash), node: hex(genesisHash) },
    );
  }
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
        `${hex(identity.genesisHash)}: the configured node serves another chain; configure a node of the ` +
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
        `${hex(cursor.hash)} there: the node finalized another chain than the one the database holds`,
      { height: cursor.height, stored: hex(cursor.hash), node: hex(atCursor) },
    );
  }
  return Object.freeze({ genesisHash });
}

/**
 * The node client's options from the process's `core` settings: its `node` and `backoffCeilingMs`. Null for a process
 * without a node (a private process, whose `core` entry has none). The process makes its one node client from them
 * (`src/runner/process.ts`). [CF-4, Q102]
 */
export function nodeOptionsOf(settings: Readonly<Record<string, unknown>>): NodeClientOptions | null {
  if (typeof settings.node !== "string") return null;
  return { url: settings.node, backoffCeilingMs: settings.backoffCeilingMs as number };
}

/** What a process gives `core-chain` (see {@link bindCoreChain}). */
export interface CoreChainFacts {
  /** The validated configuration: its history is recorded, and it is published as the `config` item. [CF-6] */
  readonly config: CheckedConfig;
  /** The build's validated declarations, which the history's check reads. */
  readonly declarations: DeclarationSet<ModuleDeclaration>;
  /** The cursor's height at startup, null on a new database. */
  readonly cursor: bigint | null;
  /** The database, opened and with its writer started: published read-only as the `db` item. [Q73] */
  readonly db: Database;
  /** S. */
  readonly start: bigint;
  /** The node's genesis hash, as {@link checkChain} found it. */
  readonly genesisHash: Uint8Array;
  /**
   * The process's node client, published as `node-client`: the one connection its block source shares, which the
   * process closes. Null for none, and then no `node-client` item is published.
   */
  readonly nodeClient: NodeClient | null;
  /** The `core` revision's ledger table in effect (`ledgerTable`), published as `ledger-table`. [LG-3] */
  readonly ledgerTable: LedgerTable;
}

/** A process's `core-chain`, bound by {@link bindCoreChain}. */
export interface CoreChainBinding {
  /** The node client it publishes as `node-client`, or null. */
  readonly nodeClient: NodeClient | null;
}

/** What a bound context holds. */
interface Bound {
  readonly facts: CoreChainFacts;
  /** The `db` item, made once and shared by every module that requires it. */
  readonly db: ReturnType<typeof readOnlyDatabase>;
}

const BOUND = new WeakMap<ProcessContext, Bound>();

/**
 * Binds `core-chain` to its process context `context` with the process's `facts` (see the module comment), before
 * `startDatabase` runs its `on-start-db`: makes the read-only `db` item. Throws when `context` is bound already.
 */
export function bindCoreChain(context: ProcessContext, facts: CoreChainFacts): CoreChainBinding {
  if (BOUND.has(context)) throw new Error("bindCoreChain: core-chain is bound once per process context");
  BOUND.set(context, Object.freeze({ facts, db: readOnlyDatabase(facts.db) }));
  return Object.freeze({ nodeClient: facts.nodeClient });
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
 * `core-chain`'s `on-start-db` (see the module comment). It:
 * - records the history in the callback's transaction (`recordHistory`, with `options.history`, which a negative
 *   control sets) [CF-6];
 * - on a database without a cursor, records the identity's genesis hash and S [IN-2];
 * - publishes the `process` items `config`, `node-client` (when the process has a node), `db` and `ledger-table`
 *   [MD-7].
 */
export async function coreChainStartDb(
  p: ProcessContext,
  w: SchemaWriteHandle,
  options: { readonly history?: HistoryOptions } = {},
): Promise<void> {
  const { facts, db } = boundTo(p, "on-start-db");
  await recordHistory(w, { config: facts.config, declarations: facts.declarations, cursor: facts.cursor }, options.history);
  if (facts.cursor === null) await w.execute(RECORD_IDENTITY_SQL, [facts.genesisHash, facts.start]);
  p.publish("config", facts.config);
  if (facts.nodeClient !== null) p.publish("node-client", facts.nodeClient);
  p.publish("db", db);
  p.publish("ledger-table", facts.ledgerTable);
}

/**
 * `core-chain`'s `on-db-write` (see the module comment). At block S it records the anchor hash (the block's hash) in
 * the block's transaction, and fails the block when the identity has no row or already holds an anchor. At every other
 * height it does nothing. [IN-2, CD-1]
 */
export async function coreChainDbWrite(p: ProcessContext, b: BlockContext, w: BlockWriteHandle): Promise<void> {
  const { facts } = boundTo(p, "on-db-write");
  if (b.height !== facts.start) return;
  const recorded = await w.execute(ANCHOR_SQL, [b.hash]);
  if (recorded !== 1) {
    throw new Error(
      `core-chain could not record the anchor hash of block S (${b.height}) in ${IDENTITY_TABLE}: the row is missing ` +
        "or holds an anchor already, which only block S's own transaction writes",
    );
  }
}

/**
 * `core-chain` (see the module comment): a backbone part that requires nothing. It provides the `process` items
 * `config`, `node-client`, `db` and `ledger-table`, and the `table` item `chain-identity`. Like every backbone part it
 * starts at S, which is a mid-chain start when S is above 0. [Q96]
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
