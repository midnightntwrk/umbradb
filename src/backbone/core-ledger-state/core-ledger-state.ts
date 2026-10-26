/**
 * The core module `core-ledger-state` (`openspec/changes/core-arch/specs/ledger/spec.md` LG-7, LG-8, LG-10, LG-11,
 * LG-15, LG-16; `specs/ingest/spec.md` IN-7; `design.md` §5, §10; CORE-ARCH §4.8; decision record Q31, Q36, Q49,
 * Q113; task 12.3): the ledger state after every block, applied in the ledger worker (`src/ledger/worker/`) from
 * genesis, its root checked against the node's at every height, and what applying it gave stored and published. Off by
 * default; it cannot start mid-chain (LG-16: it needs the state of the block before, from genesis or a backup, BK-3),
 * so the graph refuses it above 0 with `cannot-start-mid-chain` (MD-4).
 *
 * **At `on-compute`** of height h, given the read at h − 1, it asks the ledger worker the runner bound to its process
 * context ({@link bindCoreLedgerState}) to apply the block — the transactions `core-block-parsed` had the same worker
 * parse at `on-parse`, which it reuses (LG-7), with their chain outcomes, `tx-results` (task 12.1a), the block's time,
 * its parent's (read from `core_block_commit.blocks` at h − 1; LG-8's rule for a parent with none) and LG-8's
 * first-regular rule for the runtime of the block's `MNSV` digest (`block-header`, `../../ledger/replay.ts`) — while it
 * asks the node, through the block source bound with it, for its root after h (`midnight_ledgerStateRoot`, IN-8); stored
 * nodes the worker needs are read through that read (the node-store bridge). Block 0 (IN-7): the genesis state is the
 * node's `system_properties.genesis_state`; if its root is the node's root at block 0, block 0's transactions run on an
 * empty state for their results only and the genesis state is the state after block 0, otherwise they are applied to
 * it. **The root check (LG-15):** the state's root after h must be the node's, or the callback throws `root-mismatch`
 * (`UmbraError`, details: the height, the block's hash, both roots as `0x` hex) — a halt at h before its transaction
 * begins, so nothing of h is stored (RN-8). Then it puts the `block` items: `ledger-state` ({@link LedgerStateItem}: the
 * state's key, root, summary and parameters, plain), `ledger-events` (every ledger event but contract logs),
 * `segment-results` (each transaction's outcome and segments) and `vm-logs` (the contract logs of applied segments,
 * numbered in the block in emission order; none on ledger v8, Q54).
 *
 * **At `on-db-write`** it writes, in the block's transaction: the batch the worker flushed — the nodes created since the
 * previous block that the new state reaches (`core_ledger_state.nodes`, an existing key left as it is: a node is its
 * key's content) and each changed root count as a signed change added to the stored one, a count reaching 0 deleted
 * (Q53, `core_ledger_state.root_counts`) —, the block's `states` row (LG-16: key, root, the zswap tree's first free index
 * and the five tree values the packages do not export, null — decision record question Q138), its
 * `segment_results` and its ledger `events` (each transaction's numbered from 0 in emission order). **At
 * `on-after-db-write`** it tells the worker the block committed, so the state after h becomes the one h + 1 applies on
 * — without waiting for the answer, as that callback holds a read (see the callback).
 *
 * **What task 12.4 adds** (LG-9, LG-11 to LG-13): the state's reload at a restart (today a worker with no state, or one
 * at another height, refuses the block, naming what it holds), the retention window (today the state before each block
 * is released in its batch, as with `retainStates` 0, whatever the setting), contract-state keys and the v8 → v9
 * conversion (today a block of another ledger than the state's is refused). Task 12.5 adds the sweep's tables.
 *
 * The declaration ({@link CORE_LEDGER_STATE}) is a constant over its rules; a negative control's build composes its own
 * with {@link coreLedgerState}, one rule replaced.
 */

import { z } from "zod";
import { UMBRADB_VERSION } from "../../config/build.js";
import type { BlockWriteHandle, ReadHandle } from "../../db/api.js";
import { UmbraError } from "../../db/errors.js";
import { firstRegularAtParentTime, parentTimestampMs } from "../../ledger/replay.js";
import type { ChainOutcome, LedgerEvent, LedgerName, StateSummary, TransactionResult, VmLog } from "../../ledger/types.js";
import type { AppliedState } from "../../ledger/worker/engine.js";
import type { LedgerHost } from "../../ledger/worker/host.js";
import { type BlockContext, defineModule, type ModuleDeclaration, type ProcessContext } from "../../modules/declaration.js";
import { BLOCKS_TABLE, blockHeaderOf, ledgerVersionOf } from "../core-block-commit/core-block-commit.js";
import type { BlockLedgerSource } from "../core-block-fetch/ledger-source.js";
import { blockParsedItemOf } from "../core-block-parsed/core-block-parsed.js";
import { txResultsItemOf } from "../core-tx-results/core-tx-results.js";
import { heightPartitionsSql } from "../height-partitions.js";

/** The module's id. */
export const CORE_LEDGER_STATE_ID = "core-ledger-state";

/** The `block` and `table` items it provides (LG-16). */
export const LEDGER_STATE_ITEM = "ledger-state";
export const LEDGER_EVENTS_ITEM = "ledger-events";
export const SEGMENT_RESULTS_ITEM = "segment-results";
/** A `block` item only: the logs' table is `core-contract-logs-*`' (`contract_logs.logs`, task 13.1). */
export const VM_LOGS_ITEM = "vm-logs";

/** Its tables (`design.md` §10). */
export const NODES_TABLE = "core_ledger_state.nodes";
export const ROOT_COUNTS_TABLE = "core_ledger_state.root_counts";
export const STATES_TABLE = "core_ledger_state.states";
export const SEGMENT_RESULTS_TABLE = "core_ledger_state.segment_results";
export const EVENTS_TABLE = "core_ledger_state.events";

/** The kinds of `core_ledger_state.events` (`design.md` §10, with `contract-deploy`, which LG-16 stores too). */
export const EVENT_KINDS = Object.freeze([
  "zswap-input",
  "zswap-output",
  "contract-deploy",
  "dust-initial-utxo",
  "dust-generation-dtime-update",
  "dust-spend-processed",
  "param-change",
] as const);

/** The nodes written per statement: a block's batch is chunked so no statement's parameters grow without bound. */
export const NODES_PER_STATEMENT = 1_000;

const kinds = EVENT_KINDS.map((kind) => `'${kind}'`).join(", ");

/** `core-ledger-state`'s migrations (DB-9): applied once, recorded under `core-ledger-state`; never changed. */
export const CORE_LEDGER_STATE_MIGRATIONS: readonly { readonly id: string; readonly sql: string }[] = Object.freeze([
  {
    id: "001",
    sql: `CREATE TABLE ${NODES_TABLE} (
  node_key bytea NOT NULL CHECK (octet_length(node_key) = 32),
  data bytea NOT NULL,
  children bytea NOT NULL,
  PRIMARY KEY (node_key)
);
CREATE TABLE ${ROOT_COUNTS_TABLE} (
  node_key bytea NOT NULL CHECK (octet_length(node_key) = 32),
  count integer NOT NULL CHECK (count > 0),
  PRIMARY KEY (node_key)
);
CREATE TABLE ${STATES_TABLE} (
  height bigint NOT NULL CHECK (height >= 0),
  state_key bytea NOT NULL CHECK (octet_length(state_key) = 32),
  state_root bytea NOT NULL,
  zswap_first_free bigint NOT NULL CHECK (zswap_first_free >= 0),
  zswap_root bytea,
  dust_commitment_first_free bigint CHECK (dust_commitment_first_free >= 0),
  dust_commitment_root bytea,
  dust_generation_first_free bigint CHECK (dust_generation_first_free >= 0),
  dust_generation_root bytea,
  PRIMARY KEY (height)
) PARTITION BY RANGE (height);
${heightPartitionsSql(STATES_TABLE)}
CREATE TABLE ${SEGMENT_RESULTS_TABLE} (
  height bigint NOT NULL CHECK (height >= 0),
  tx_index bigint NOT NULL CHECK (tx_index >= 0),
  segment integer NOT NULL CHECK (segment >= 0),
  success boolean NOT NULL,
  PRIMARY KEY (height, tx_index, segment)
) PARTITION BY RANGE (height);
${heightPartitionsSql(SEGMENT_RESULTS_TABLE)}
CREATE TABLE ${EVENTS_TABLE} (
  height bigint NOT NULL CHECK (height >= 0),
  tx_index bigint NOT NULL CHECK (tx_index >= 0),
  event_index bigint NOT NULL CHECK (event_index >= 0),
  kind text NOT NULL CHECK (kind IN (${kinds})),
  logical_segment integer NOT NULL CHECK (logical_segment >= 0),
  physical_segment integer NOT NULL CHECK (physical_segment >= 0),
  bytes bytea NOT NULL,
  nullifier bytea,
  commitment bytea,
  tree_index bigint CHECK (tree_index >= 0),
  contract_address bytea,
  PRIMARY KEY (height, tx_index, event_index)
) PARTITION BY RANGE (height);
${heightPartitionsSql(EVENTS_TABLE)}`,
  },
]);

const PARENT_TIME_SQL = `SELECT (extract(epoch FROM block_time) * 1000)::bigint AS ms FROM ${BLOCKS_TABLE} WHERE height = $1`;
const NODES_SQL = `INSERT INTO ${NODES_TABLE} (node_key, data, children)
  SELECT n.node_key, n.data, n.children FROM unnest($1::bytea[], $2::bytea[], $3::bytea[]) AS n (node_key, data, children)
  ON CONFLICT (node_key) DO NOTHING`;
const ROOT_COUNTS_SQL = `WITH d AS (SELECT * FROM unnest($1::bytea[], $2::integer[]) AS d (node_key, delta)),
  merged AS (SELECT d.node_key, coalesce(r.count, 0) + d.delta AS count FROM d LEFT JOIN ${ROOT_COUNTS_TABLE} r USING (node_key)),
  gone AS (DELETE FROM ${ROOT_COUNTS_TABLE} r USING merged m WHERE r.node_key = m.node_key AND m.count = 0)
  INSERT INTO ${ROOT_COUNTS_TABLE} (node_key, count) SELECT node_key, count FROM merged WHERE count <> 0
  ON CONFLICT (node_key) DO UPDATE SET count = EXCLUDED.count`;
const STATES_SQL = `INSERT INTO ${STATES_TABLE} (height, state_key, state_root, zswap_first_free, zswap_root,
  dust_commitment_first_free, dust_commitment_root, dust_generation_first_free, dust_generation_root)
  VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)`;
const SEGMENTS_SQL = `INSERT INTO ${SEGMENT_RESULTS_TABLE} (height, tx_index, segment, success)
  SELECT $1::bigint, s.tx_index, s.segment, s.success FROM unnest($2::bigint[], $3::integer[], $4::boolean[])
    AS s (tx_index, segment, success)`;
const EVENTS_SQL = `INSERT INTO ${EVENTS_TABLE} (height, tx_index, event_index, kind, logical_segment, physical_segment, bytes,
  nullifier, commitment, tree_index, contract_address)
  SELECT $1::bigint, e.tx_index, e.event_index, e.kind, e.logical_segment, e.physical_segment, e.bytes, e.nullifier,
    e.commitment, e.tree_index, e.contract_address
  FROM unnest($2::bigint[], $3::bigint[], $4::text[], $5::integer[], $6::integer[], $7::bytea[], $8::bytea[], $9::bytea[],
    $10::bigint[], $11::bytea[])
    AS e (tx_index, event_index, kind, logical_segment, physical_segment, bytes, nullifier, commitment, tree_index,
      contract_address)`;

/** The `ledger-state` item (LG-16): the state after the block, as plain data; the state itself stays in the worker. */
export interface LedgerStateItem extends StateSummary {
  readonly ledger: LedgerName;
  readonly height: bigint;
  readonly hash: Uint8Array;
  /** Its root node's key, what `core_ledger_state.states.state_key` holds (Q55). */
  readonly stateKey: Uint8Array;
  /** Its root, the node's (LG-15). */
  readonly stateRoot: Uint8Array;
  /** The ledger parameters after the block, in the ledger's tagged serialization. */
  readonly parameters: Uint8Array;
}

/** What the runner binds `core-ledger-state` to: the process's ledger worker and its block source's ledger calls. */
export interface LedgerBinding {
  readonly ledger: LedgerHost;
  readonly source: BlockLedgerSource;
}

const BOUND = new WeakMap<ProcessContext, LedgerBinding>();

/**
 * Binds `core-ledger-state` to its process context `context` with the process's ledger worker and its block source,
 * before the loop runs. Throws when `context` is bound already.
 */
export function bindCoreLedgerState(context: ProcessContext, binding: LedgerBinding): void {
  if (BOUND.has(context)) throw new Error("bindCoreLedgerState: core-ledger-state is bound once per process context");
  BOUND.set(context, Object.freeze({ ...binding }));
}

/** The binding of `p` (see {@link bindCoreLedgerState}); throws when there is none. */
export function boundLedger(p: ProcessContext): LedgerBinding {
  const binding = BOUND.get(p);
  if (binding === undefined) {
    throw new Error(
      "core-ledger-state ran with a process context the runner did not bind to a ledger worker and a block source that " +
        "gives the node's ledger state roots (bindCoreLedgerState): the node source does",
    );
  }
  return binding;
}

/** The rules a negative control may replace (see the module comment). */
export interface CoreLedgerStateOptions {
  /** IN-7: whether block 0's genesis state already includes its transactions; its root is the node's at block 0. */
  readonly includesBlockZero?: (genesisRoot: Uint8Array, nodeRoot: Uint8Array) => boolean;
  /** LG-15: whether a computed root passes the check; equal to the node's. */
  readonly rootMatches?: (computed: Uint8Array, node: Uint8Array) => boolean;
  /** Task 12.1a: the chain outcomes the apply is given; the block's `tx-results`. */
  readonly outcomes?: (b: BlockContext) => readonly ChainOutcome[] | undefined;
}

const hex = (bytes: Uint8Array): string => `0x${Array.from(bytes, (byte) => byte.toString(16).padStart(2, "0")).join("")}`;
const sameBytes = (a: Uint8Array, b: Uint8Array): boolean => a.length === b.length && a.every((byte, i) => byte === b[i]);

/** The block's outcomes as `tx-results` gives them, one per transaction of `block-parsed`. */
export function chainOutcomesOf(b: BlockContext): readonly ChainOutcome[] {
  return txResultsItemOf(b);
}

/** Block `b`'s parent time in milliseconds, read at h − 1 (block 0: none), LG-8's rule applied. */
export async function parentTimeOf(read: Pick<ReadHandle, "query">, b: BlockContext, ownMs: bigint): Promise<bigint> {
  if (b.height === 0n) return parentTimestampMs(null, ownMs);
  const [row] = await read.query(PARENT_TIME_SQL, [b.height - 1n]);
  if (row === undefined) {
    throw new Error(`block ${b.height}: the blocks table holds no block ${b.height - 1n} to take the parent time from (LG-8)`);
  }
  return parentTimestampMs(BigInt(row.ms as bigint | number | string), ownMs);
}

/** The pending writes of each process context: the block `on-compute` applied, for its `on-db-write`. */
const PENDING = new WeakMap<ProcessContext, AppliedState>();

/** `core-ledger-state`'s `on-compute` (see the module comment): returns what the block's `on-db-write` writes. */
export async function applyBlock(
  p: ProcessContext,
  b: BlockContext,
  read: Pick<ReadHandle, "query">,
  options: CoreLedgerStateOptions = {},
): Promise<AppliedState> {
  const { ledger: host, source } = boundLedger(p);
  const header = blockHeaderOf(b);
  const ledger = ledgerVersionOf(b) as LedgerName;
  const { transactions } = blockParsedItemOf(b, CORE_LEDGER_STATE_ID);
  const outcomes = (options.outcomes ?? chainOutcomesOf)(b);
  if (outcomes !== undefined && outcomes.length !== transactions.length) {
    throw new Error(`block ${b.height}: ${outcomes.length} chain outcomes for ${transactions.length} transactions (CD-6)`);
  }
  const block = { height: b.height, hash: b.hash };
  const nodeRoot = source.ledgerStateRoot({ height: b.height, hash: b.hash, parentHash: b.parentHash });
  nodeRoot.catch(() => undefined);
  let applied: AppliedState;
  if (b.height === 0n) {
    const genesisState = await source.genesisState();
    const genesisRoot = await host.genesisRoot(ledger, genesisState);
    const includesBlockZero = (options.includesBlockZero ?? sameBytes)(genesisRoot, await nodeRoot);
    applied = await host.genesis(
      {
        ledger,
        ...block,
        parentHash: b.parentHash,
        timestampMs: header.timestampMs,
        transactions: transactions.length,
        ...(outcomes === undefined ? {} : { outcomes }),
        genesisState,
        includesBlockZero,
      },
      read,
    );
  } else {
    applied = await host.apply(
      {
        ledger,
        ...block,
        parentHash: b.parentHash,
        timestampMs: header.timestampMs,
        parentTimestampMs: await parentTimeOf(read, b, header.timestampMs),
        firstRegularAtParentTime: firstRegularAtParentTime(b.height, header.specVersion),
        transactions: transactions.length,
        ...(outcomes === undefined ? {} : { outcomes }),
      },
      read,
    );
  }
  const node = await nodeRoot;
  if (!(options.rootMatches ?? sameBytes)(applied.stateRoot, node)) {
    throw new UmbraError(
      "root-mismatch",
      `the ledger state root after block ${b.height} (${hex(b.hash)}) is ${hex(applied.stateRoot)}, and the node's is ` +
        `${hex(node)} (LG-15): the replay differs from the node's, so nothing of the block is stored`,
      { height: b.height, hash: hex(b.hash), computed: hex(applied.stateRoot), node: hex(node) },
    );
  }
  return applied;
}

/** The `block` items of an applied block (see the module comment). */
export function itemsOf(applied: AppliedState): {
  readonly state: LedgerStateItem;
  readonly events: readonly LedgerEvent[];
  readonly segments: readonly TransactionResult[];
  readonly logs: readonly VmLog[];
} {
  const state: LedgerStateItem = Object.freeze({
    ledger: applied.ledger,
    height: applied.height,
    hash: applied.hash,
    stateKey: applied.stateKey,
    stateRoot: applied.stateRoot,
    parameters: applied.output.parameters,
    ...applied.summary,
  });
  return Object.freeze({
    state,
    events: Object.freeze([...applied.output.events]),
    segments: Object.freeze([...applied.output.results]),
    logs: Object.freeze([...applied.output.logs]),
  });
}

/** Writes the block `applied` describes, in its transaction (see the module comment). */
export async function writeBlock(w: Pick<BlockWriteHandle, "execute">, applied: AppliedState): Promise<void> {
  const { batch, output, summary } = applied;
  for (let at = 0; at < batch.inserts.length; at += NODES_PER_STATEMENT) {
    const chunk = batch.inserts.slice(at, at + NODES_PER_STATEMENT);
    await w.execute(NODES_SQL, [chunk.map((n) => n.key), chunk.map((n) => n.data), chunk.map((n) => n.children)]);
  }
  const counts = batch.rootCounts.filter((count) => count.delta !== 0);
  if (counts.length > 0) await w.execute(ROOT_COUNTS_SQL, [counts.map((c) => c.key), counts.map((c) => c.delta)]);
  await w.execute(STATES_SQL, [
    applied.height,
    applied.stateKey,
    applied.stateRoot,
    summary.zswapFirstFree,
    summary.zswapRoot,
    summary.dustCommitmentFirstFree,
    summary.dustCommitmentRoot,
    summary.dustGenerationFirstFree,
    summary.dustGenerationRoot,
  ]);
  const segments = output.results.flatMap((result, tx) => result.segments.map((s) => ({ tx, ...s })));
  if (segments.length > 0) {
    await w.execute(SEGMENTS_SQL, [
      applied.height,
      segments.map((s) => BigInt(s.tx)),
      segments.map((s) => s.segment),
      segments.map((s) => s.success),
    ]);
  }
  if (output.events.length > 0) {
    const numbers = new Map<number, number>();
    const indexes = output.events.map((event) => {
      const index = numbers.get(event.transaction) ?? 0;
      numbers.set(event.transaction, index + 1);
      return BigInt(index);
    });
    const events = output.events;
    await w.execute(EVENTS_SQL, [
      applied.height,
      events.map((e) => BigInt(e.transaction)),
      indexes,
      events.map((e) => e.kind),
      events.map((e) => e.logicalSegment),
      events.map((e) => e.physicalSegment),
      events.map((e) => e.bytes),
      events.map((e) => e.nullifier),
      events.map((e) => e.commitment),
      events.map((e) => e.treeIndex),
      events.map((e) => e.contractAddress),
    ]);
  }
}

/** The block `on-compute` applied for `b`, taken for its `on-db-write`; throws when it is not `b`'s. */
function pendingOf(p: ProcessContext, b: BlockContext): AppliedState {
  const applied = PENDING.get(p);
  if (applied === undefined || applied.height !== b.height || !sameBytes(applied.hash, b.hash)) {
    throw new Error(`block ${b.height}: core-ledger-state's on-compute applied no such block for its on-db-write`);
  }
  PENDING.delete(p);
  return applied;
}

/**
 * `core-ledger-state` with `options`' rules (see the module comment): a core module that requires `block-header`,
 * `ledger-version` (`core-block-fetch`'s), `block-parsed` and `tx-results`, provides its four items, and cannot start
 * mid-chain.
 */
export function coreLedgerState(options: CoreLedgerStateOptions = {}): ModuleDeclaration {
  return defineModule({
    id: CORE_LEDGER_STATE_ID,
    version: UMBRADB_VERSION,
    side: "public",
    requires: ["block-header", "ledger-version", "block-parsed", "tx-results"],
    provides: [
      {
        name: LEDGER_STATE_ITEM,
        lifetimes: ["block", "table"],
        table: { schema: "core_ledger_state", tables: ["nodes", "root_counts", "states"], kind: "mutable" },
      },
      {
        name: LEDGER_EVENTS_ITEM,
        lifetimes: ["block", "table"],
        table: { schema: "core_ledger_state", tables: ["events"], kind: "append-only" },
      },
      {
        name: SEGMENT_RESULTS_ITEM,
        lifetimes: ["block", "table"],
        table: { schema: "core_ledger_state", tables: ["segment_results"], kind: "append-only" },
      },
      { name: VM_LOGS_ITEM, lifetimes: ["block"] },
    ],
    startsMidChain: false,
    configSchema: z.object({}),
    migrations: CORE_LEDGER_STATE_MIGRATIONS.map(({ id, sql }) => ({ id, sql })),
    points: {
      async "on-compute"(p, b, read, out) {
        const applied = await applyBlock(p, b, read, options);
        PENDING.set(p, applied);
        const items = itemsOf(applied);
        out.put(LEDGER_STATE_ITEM, items.state);
        out.put(LEDGER_EVENTS_ITEM, items.events);
        out.put(SEGMENT_RESULTS_ITEM, items.segments);
        out.put(VM_LOGS_ITEM, items.logs);
      },
      async "on-db-write"(p, b, w) {
        await writeBlock(w, pendingOf(p, b));
      },
      async "on-after-db-write"(p, b) {
        // Not awaited: this callback runs inside a read, which on PGlite holds the one queue, and the commit may wait
        // in the worker behind a parse whose stored nodes need that queue; the worker answers requests in order, so
        // the next block's apply still finds the state committed, and a worker that failed fails that apply.
        void BOUND.get(p)
          ?.ledger.commit({ height: b.height, hash: b.hash })
          .catch(() => undefined);
      },
    },
  });
}

/** `core-ledger-state` (see the module comment). */
export const CORE_LEDGER_STATE = coreLedgerState();
