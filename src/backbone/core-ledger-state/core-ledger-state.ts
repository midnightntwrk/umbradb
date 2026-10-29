/**
 * The core module `core-ledger-state`: the ledger state after every block. It is applied in the ledger worker
 * (`src/ledger/worker/`) from genesis, its root is checked against the node's at every height, and what applying it
 * produced is stored and published. [LG-7, LG-8, LG-10, LG-11, LG-15, LG-16, Q31, Q36, Q49, Q113; CORE-ARCH §4.8;
 * design §5, §10]
 *
 * It is off by default and cannot start mid-chain: it needs the state of the block before, from genesis or from a
 * backup. So the requirement graph rejects it above height 0 with `cannot-start-mid-chain`. [LG-16, BK-3, MD-4]
 *
 * **At `on-compute`** of height h, given the read at h − 1, it asks the ledger worker that the runner bound to its
 * process context ({@link bindCoreLedgerState}) to apply the block. The worker gets: [LG-7, LG-8]
 * - the transactions that `core-block-parsed` had the same worker parse at `on-parse`, which it reuses;
 * - their chain outcomes, from `tx-results`;
 * - the block's time, and its parent's (read from `core_block_commit.blocks` at h − 1; for block 0, which has no
 *   parent, the replay rules set it);
 * - whether the block's first regular transaction may also be checked at the parent's time, which the replay rules
 *   decide from the runtime of the block's `MNSV` digest (`block-header`, `../../ledger/replay.ts`).
 *
 * Meanwhile it asks the node, through the block source bound with the worker, for its root after h
 * (`midnight_ledgerStateRoot`). Stored nodes the worker needs are read through the callback's read (the node-store
 * bridge). [IN-8]
 *
 * **Block 0.** The genesis state is the node's `system_properties.genesis_state`. If its root is the node's root at
 * block 0, block 0's transactions run on an empty state for their results only, and the genesis state is the state
 * after block 0. Otherwise they are applied to the genesis state. [IN-7]
 *
 * **The root check.** The state's root after h must be the node's, or the callback throws `root-mismatch`
 * (`UmbraError`, with the height, the block's hash and both roots as `0x` hex in its details). That halts at h before
 * the block's transaction begins, so nothing of h is stored. [LG-15, RN-8]
 *
 * Then it puts the `block` items: [LG-16, Q54]
 * - `ledger-state` ({@link LedgerStateItem}): the state's key, root, summary and parameters, as plain data;
 * - `ledger-events`: every ledger event except contract logs;
 * - `segment-results`: each transaction's outcome and segments;
 * - `vm-logs`: the contract logs of applied segments, numbered in the block in emission order (none on ledger v8).
 *
 * **At `on-db-write`** it writes, in the block's transaction: [LG-11, LG-16, Q53, Q138 A]
 * - the batch the worker flushed: the nodes created since the previous block that the new state reaches
 *   (`core_ledger_state.nodes`; an existing key is left as it is, since a node is its key's content), and each changed
 *   root count as a signed change added to the stored one, a count that reaches 0 being deleted
 *   (`core_ledger_state.root_counts`);
 * - the block's `states` row: the state key and root, and the first free index and root of the zswap tree and of the
 *   DUST commitment and generation trees, none null, read as the official indexer reads them (the packages'
 *   `stateTrees`);
 * - its `segment_results`, and its ledger `events` (each transaction's numbered from 0 in emission order).
 *
 * **The tables** and every statement are in `./sql.ts`.
 *
 * **At `on-after-db-write`** it tells the worker the block committed, so the state after h becomes the one h + 1 is
 * applied on. It does not wait for the answer, since that callback holds a read (see the callback).
 *
 * **The stored state.** Before each apply after block 0 it reads the state at h − 1 from `states` (its key and root),
 * with the block's ledger there (`core_block_commit.blocks`), and asks the worker to hold that state
 * (`LedgerHost.load`). A state the worker already holds is kept. Otherwise (a restarted process, a fresh worker) it is
 * read from its key through the node-store bridge, and the package checks each node against its key. A node that does
 * not match aborts the load: the worker fails and processing halts with `callback-error`. The root the worker returns
 * must be the stored one, which is the node's at h − 1. [LG-11]
 *
 * **The ledger conversion.** The first ledger v9 block on a v8 state is the conversion block F: the worker converts
 * the state first and applies F to it (`../../ledger/worker/engine.ts`). [LG-9]
 *
 * **Releases and contract keys.** The block's batch releases the states that leave the retention window. The window is
 * set by the `core` entry's `retainStates` at each height, read from the `config` item (`./retention.ts`): block h
 * releases the heights L(h − 1) to L(h) − 1, their keys read from `states`. [LG-12]
 *
 * While `core-contract-states` is active at h, the batch also persists, and never releases, the state and zswap-state
 * keys of every contract the block touched. The `ledger-state` item carries them, for that module to store. They are:
 * [LG-13, CC-1]
 * - the contracts its transactions call or deploy (`block-parsed`);
 * - the contracts its chain events name as maintained (`Midnight::ContractMaintain`), since a maintenance update
 *   changes the contract's state too;
 * - at F, every contract deployed before it (its `contract-deploy` events, read at h − 1), since every contract gets a
 *   row with its converted keys at F.
 *
 * **Retained states.** The `ledger-state` item is also a `process` item ({@link RetainedStates}, published at
 * `on-start-db`). A module that requires it loads the state after a height inside the window at its read's cursor, in
 * the worker, and gets it as plain data. Outside the window the load fails with `state-not-retained`. [LG-12]
 *
 * **The sweep** (`./sweep.ts`). After the root check, `on-compute` computes the block's step of the fixed-budget
 * mark-and-sweep, from `sweep`, `grey`, `marks`, `nodes` and `root_counts` as committed at h − 1 and the block's batch.
 * It has the worker evict the nodes the step deletes (`LedgerHost.evict`) before the block commits; `on-db-write`
 * writes the step after the batch. With the `core` entry's `sweep` off at h no step runs, and the first such block
 * after one with it on clears the sweep's sets. [LG-14]
 *
 * If the package still refuses an eviction after the worker freed what it can, the worker thread is ended. A new one
 * loads the state at h − 1 from the database and applies h again; only a second refusal fails the block
 * ({@link computeBlock}). [LG-14, Q144 B]
 *
 * The declaration ({@link CORE_LEDGER_STATE}) is a constant built over its rules. A negative control's build composes
 * its own with {@link coreLedgerState}, with one rule replaced.
 */

import { z } from "zod";
import { UMBRADB_VERSION } from "../../config/build.js";
import type { CheckedConfig } from "../../config/validate.js";
import type { BlockWriteHandle, ReadHandle } from "../../db/api.js";
import { UmbraError } from "../../db/errors.js";
import { firstRegularAtParentTime, parentTimestampMs } from "../../ledger/replay.js";
import type { ChainOutcome, LedgerEvent, LedgerName, StateSummary, TransactionResult, VmLog } from "../../ledger/types.js";
import { type AppliedState, type ContractKeys, isEvictionRefused } from "../../ledger/worker/engine.js";
import type { LedgerHost } from "../../ledger/worker/host.js";
import { type BlockContext, type DefinedModule, defineModule, type ModuleDeclaration, type ProcessContext } from "../../modules/declaration.js";
import { blockHeaderOf, ledgerVersionOf } from "../core-block-commit/core-block-commit.js";
import type { BlockLedgerSource } from "../core-block-fetch/ledger-source.js";
import { blockParsedItemOf } from "../core-block-parsed/core-block-parsed.js";
import { chainEventsItemOf } from "../core-chain-events/core-chain-events.js";
import { txResultsItemOf } from "../core-tx-results/core-tx-results.js";
import { type CoreRevision, coreRevisionsOf, releasedBy, retainedFrom, retentionWindow, revisionAt } from "./retention.js";
import {
  addRootCounts,
  blockTimeMsAt,
  CORE_LEDGER_STATE_MIGRATIONS,
  deployedBelow,
  insertEvents,
  insertNodes,
  insertSegmentResults,
  insertStateRow,
  STATES_TABLE,
  stateAt,
  stateKeysBetween,
} from "./sql.js";
import {
  type GreyPicker,
  SWEEP_BUDGET,
  sqlSweepTables,
  sweepReset,
  sweepStep,
  type SweepWrites,
  writeSweep,
} from "./sweep.js";

/** The module's id. */
export const CORE_LEDGER_STATE_ID = "core-ledger-state";

/** The module whose contracts' keys `core-ledger-state` persists while it is active. [LG-13] */
export const CORE_CONTRACT_STATES_ID = "core-contract-states";

/** The `block` and `table` items it provides. [LG-16] */
export const LEDGER_STATE_ITEM = "ledger-state";
export const LEDGER_EVENTS_ITEM = "ledger-events";
export const SEGMENT_RESULTS_ITEM = "segment-results";
/** A `block` item only: the logs' table, `contract_logs.logs`, belongs to the `core-contract-logs-*` modules. */
export const VM_LOGS_ITEM = "vm-logs";

/** The nodes written per statement: a block's batch is chunked so no statement's parameters grow without bound. */
export const NODES_PER_STATEMENT = 1_000;

/** The `ledger-state` item: the state after the block as plain data; the state itself stays in the worker. [LG-16] */
export interface LedgerStateItem extends StateSummary {
  readonly ledger: LedgerName;
  readonly height: bigint;
  readonly hash: Uint8Array;
  /** Its root node's key, which `core_ledger_state.states.state_key` holds. [Q55] */
  readonly stateKey: Uint8Array;
  /** Its root, which equals the node's. [LG-15] */
  readonly stateRoot: Uint8Array;
  /** The ledger parameters after the block, in the ledger's tagged serialization. */
  readonly parameters: Uint8Array;
  /**
   * The keys persisted for each contract the block's transactions call or deploy, in byte order, while
   * `core-contract-states` is active (that module stores them); none otherwise. [LG-13]
   */
  readonly contracts: readonly ContractKeys[];
}

/** A retained state, loaded in the ledger worker, as plain data; the state itself stays in the worker. [LG-12] */
export interface RetainedState {
  readonly ledger: LedgerName;
  readonly height: bigint;
  readonly hash: Uint8Array;
  readonly stateKey: Uint8Array;
  readonly stateRoot: Uint8Array;
}

/** What a module requiring `ledger-state` gets as its `process` item (see the module comment). [LG-12] */
export interface RetainedStates {
  /** The heights whose states are retained at cursor `cursor`, `from` to `to`; null before anything committed. */
  window(cursor: bigint | null): { readonly from: bigint; readonly to: bigint } | null;
  /**
   * The state after block `height`, loaded in the ledger worker through `read`, inside the window at `read`'s cursor;
   * rejects with `state-not-retained` outside it.
   */
  load(height: bigint, read: Pick<ReadHandle, "query" | "height">): Promise<RetainedState>;
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
  /** Whether block 0's genesis state already includes its transactions: when its root is the node's at 0. [IN-7] */
  readonly includesBlockZero?: (genesisRoot: Uint8Array, nodeRoot: Uint8Array) => boolean;
  /** Whether a computed root passes the check: when it equals the node's. [LG-15] */
  readonly rootMatches?: (computed: Uint8Array, node: Uint8Array) => boolean;
  /** The chain outcomes the apply is given: the block's `tx-results`. */
  readonly outcomes?: (b: BlockContext) => readonly ChainOutcome[] | undefined;
  /** Whether the worker is asked to hold the stored state at h − 1 before the apply; true by default. [LG-11] */
  readonly loadParent?: boolean;
  /** The ledger the block is applied with, given the state's at h − 1: the block's own (`ledger-version`). [LG-9] */
  readonly ledgerOf?: (b: BlockContext, parent: LedgerName) => LedgerName;
  /** L(h), the lowest height retained after block h: `./retention.ts`'s {@link retainedFrom}. [LG-12] */
  readonly retainedFrom?: (revisions: readonly CoreRevision[], height: bigint) => bigint;
  /** Whether the block's contracts' keys are persisted: while `core-contract-states` is active. [LG-13] */
  readonly persistsContracts?: (b: BlockContext) => boolean;
  /** The node units of each block's sweep step: {@link SWEEP_BUDGET}, or a test's smaller K. [LG-14] */
  readonly sweepBudget?: number;
  /** Which grey keys a marking round visits: the smallest in byte order. [LG-14] */
  readonly greyPicker?: GreyPicker;
  /**
   * Whether an eviction the package still refuses after the worker freed what it can ends the worker thread and
   * applies the block again in a new one; true by default. False halts at the first refusal. [LG-14, Q144 B]
   */
  readonly restartOnRefusedEviction?: boolean;
}

const hex = (bytes: Uint8Array): string => `0x${Array.from(bytes, (byte) => byte.toString(16).padStart(2, "0")).join("")}`;
const sameBytes = (a: Uint8Array, b: Uint8Array): boolean => a.length === b.length && a.every((byte, i) => byte === b[i]);

/** The block's outcomes as `tx-results` gives them, one per transaction of `block-parsed`. */
export function chainOutcomesOf(b: BlockContext): readonly ChainOutcome[] {
  return txResultsItemOf(b);
}

/** Block `b`'s parent time in milliseconds, read at h − 1 (block 0 has none), with the replay rules applied. [LG-8] */
export async function parentTimeOf(read: Pick<ReadHandle, "query">, b: BlockContext, ownMs: bigint): Promise<bigint> {
  if (b.height === 0n) return parentTimestampMs(null, ownMs);
  const ms = await blockTimeMsAt(read, b.height - 1n);
  if (ms === undefined) {
    throw new Error(`block ${b.height}: the blocks table holds no block ${b.height - 1n} to take the parent time from`);
  }
  return parentTimestampMs(ms, ownMs);
}

/** The pending writes of each process context: the block `on-compute` applied and its sweep step, for its `on-db-write`. */
const PENDING = new WeakMap<ProcessContext, { readonly applied: AppliedState; readonly sweep: SweepWrites | null }>();

/** The `core` revisions of each process context, read once from its `config` item. */
const REVISIONS = new WeakMap<ProcessContext, readonly CoreRevision[]>();

/** The `core` revisions of `p`'s configuration (the `config` item, `./retention.ts`). */
export function revisionsOf(p: ProcessContext): readonly CoreRevision[] {
  let revisions = REVISIONS.get(p);
  if (revisions === undefined) {
    const config = p.items.get("config") as Pick<CheckedConfig, "entries"> | undefined;
    if (config === undefined) throw new Error("core-ledger-state ran without the config item (core-chain's), which it requires");
    revisions = Object.freeze(coreRevisionsOf(config));
    REVISIONS.set(p, revisions);
  }
  return revisions;
}

/** The keys of the states that block `b` releases from the retention window (see the module comment). [LG-12] */
async function releasesOf(
  p: ProcessContext,
  b: BlockContext,
  read: Pick<ReadHandle, "query">,
  options: CoreLedgerStateOptions,
): Promise<Uint8Array[]> {
  const { from, to } = releasedBy(revisionsOf(p), b.height, options.retainedFrom ?? retainedFrom);
  if (from >= to) return [];
  const keys = await stateKeysBetween(read, from, to);
  if (keys.length !== Number(to - from)) {
    throw new Error(
      `block ${b.height} releases the states of ${from} to ${to - 1n}, ` +
        `and ${STATES_TABLE} holds ${keys.length} of them`,
    );
  }
  return keys;
}

/**
 * The contracts the block's transactions call or deploy, and the `others` (maintained, and at F every contract), each
 * once, in byte order. [LG-13]
 */
function contractsOf(
  transactions: readonly { readonly segments: readonly { readonly calls: readonly { readonly address: Uint8Array }[]; readonly deploys: readonly { readonly address: Uint8Array }[] }[] }[],
  ...others: readonly (readonly Uint8Array[])[]
): Uint8Array[] {
  const byHex = new Map<string, Uint8Array>();
  for (const transaction of transactions) {
    for (const segment of transaction.segments) {
      for (const { address } of [...segment.calls, ...segment.deploys]) byHex.set(hex(address), address);
    }
  }
  for (const address of others.flat()) byHex.set(hex(address), address);
  return [...byHex.keys()].sort().map((key) => byHex.get(key) as Uint8Array);
}

/** The chain event of a maintenance update of a contract (`pallet-midnight`'s `ContractMaintain`). [CD-4] */
export const CONTRACT_MAINTAIN = Object.freeze({ pallet: "Midnight", name: "ContractMaintain" } as const);

/** The prefix of a contract address's tagged serialization (`coin-structure` `ContractAddress`, `contract-address[v2]`). */
const ADDRESS_TAG = /^midnight:contract-address\[v[0-9]+\]:$/;

/**
 * The 32 bytes of a contract address as `pallet-midnight`'s contract events carry it: the ledger's tagged serialization
 * of the address (`midnight-node` `ledger/src/ledger_9/mod.rs`, `tagged_serialize(&address)`). Throws for anything
 * else. [CD-4]
 */
export function taggedAddress(bytes: Uint8Array): Uint8Array {
  const at = bytes.length - 32;
  if (at <= 0 || !ADDRESS_TAG.test(Buffer.from(bytes.subarray(0, at)).toString("latin1"))) {
    throw new Error(`a contract event's address is not the ledger's tagged serialization of one: ${hex(bytes)}`);
  }
  return bytes.slice(at);
}

/** The contracts block `b`'s chain events name maintained (see the module comment), as their 32-byte addresses. */
function maintainedOf(b: BlockContext): Uint8Array[] {
  return chainEventsItemOf(b, CORE_LEDGER_STATE_ID)
    .filter((event) => event.pallet === CONTRACT_MAINTAIN.pallet && event.name === CONTRACT_MAINTAIN.name)
    .map((event) => {
      const address = (event.fields as { readonly contract_address?: unknown } | null)?.contract_address;
      if (!(address instanceof Uint8Array)) throw new TypeError(`block ${b.height}: a ContractMaintain event without its contract_address bytes`);
      return taggedAddress(address);
    });
}

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
    throw new Error(`block ${b.height}: ${outcomes.length} chain outcomes for ${transactions.length} transactions`);
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
    // The worker holds the stored state at h − 1, read from the database after a restart, with its root. [LG-11]
    const parent = await stateAt(read, b.height - 1n);
    if (options.loadParent !== false) {
      const held = await host.load({ ledger: parent.ledger, height: b.height - 1n, hash: b.parentHash, stateKey: parent.stateKey }, read);
      if (!sameBytes(held.stateRoot, parent.stateRoot)) {
        throw new Error(
          `the ledger state loaded for block ${b.height - 1n} has the root ${hex(held.stateRoot)}, and ${STATES_TABLE} ` +
            `stores ${hex(parent.stateRoot)} for it`,
        );
      }
    }
    const persists = (options.persistsContracts ?? ((c: BlockContext) => c.active(CORE_CONTRACT_STATES_ID)))(b);
    const applyWith = (options.ledgerOf ?? (() => ledger))(b, parent.ledger);
    // At the conversion block F the worker converts the v8 state first, so every contract it holds gets new keys.
    // [LG-9, CC-1]
    const others = persists ? [maintainedOf(b), parent.ledger === "v8" && applyWith === "v9" ? await deployedBelow(read, b.height) : []] : [];
    applied = await host.apply(
      {
        ledger: applyWith,
        ...block,
        parentHash: b.parentHash,
        timestampMs: header.timestampMs,
        parentTimestampMs: await parentTimeOf(read, b, header.timestampMs),
        firstRegularAtParentTime: firstRegularAtParentTime(b.height, header.specVersion),
        transactions: transactions.length,
        ...(outcomes === undefined ? {} : { outcomes }),
        release: await releasesOf(p, b, read, options),
        contracts: persists ? contractsOf(transactions, ...others) : [],
      },
      read,
    );
  }
  const node = await nodeRoot;
  if (!(options.rootMatches ?? sameBytes)(applied.stateRoot, node)) {
    throw new UmbraError(
      "root-mismatch",
      `the ledger state root after block ${b.height} (${hex(b.hash)}) is ${hex(applied.stateRoot)}, and the node's is ` +
        `${hex(node)}: the replay differs from the node's, so nothing of the block is stored`,
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
    contracts: Object.freeze([...applied.contracts]),
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
  const { batch, output, summary, height, stateKey, stateRoot } = applied;
  for (let at = 0; at < batch.inserts.length; at += NODES_PER_STATEMENT) {
    const chunk = batch.inserts.slice(at, at + NODES_PER_STATEMENT);
    await insertNodes(w, chunk);
  }
  const counts = batch.rootCounts.filter((count) => count.delta !== 0);
  if (counts.length > 0) await addRootCounts(w, counts);
  await insertStateRow(w, { ...summary, height, stateKey, stateRoot });
  const segments = output.results.flatMap((result, tx) => result.segments.map((s) => ({ tx, ...s })));
  if (segments.length > 0) await insertSegmentResults(w, height, segments);
  if (output.events.length > 0) {
    const numbers = new Map<number, number>();
    const indexes = output.events.map((event) => {
      const index = numbers.get(event.transaction) ?? 0;
      numbers.set(event.transaction, index + 1);
      return BigInt(index);
    });
    await insertEvents(w, height, output.events, indexes);
  }
}

/** The block `on-compute` applied for `b`, with its sweep step, taken for its `on-db-write`; throws when it is not `b`'s. */
function pendingOf(p: ProcessContext, b: BlockContext): { readonly applied: AppliedState; readonly sweep: SweepWrites | null } {
  const pending = PENDING.get(p);
  if (pending === undefined || pending.applied.height !== b.height || !sameBytes(pending.applied.hash, b.hash)) {
    throw new Error(`block ${b.height}: core-ledger-state's on-compute applied no such block for its on-db-write`);
  }
  PENDING.delete(p);
  return pending;
}

/**
 * Block `b`'s sweep step (`./sweep.ts`). There is none while the `core` entry's `sweep` is off at h, and the reset at
 * the first such block after one with it on. The nodes it deletes are evicted from the worker before the block
 * commits. [LG-14]
 */
export async function sweepOf(
  p: ProcessContext,
  b: BlockContext,
  read: Pick<ReadHandle, "query">,
  applied: AppliedState,
  options: CoreLedgerStateOptions = {},
): Promise<SweepWrites | null> {
  const revisions = revisionsOf(p);
  const on = (height: bigint): boolean => revisionAt(revisions, height)?.sweep !== "off";
  const tables = sqlSweepTables(read);
  if (!on(b.height)) return b.height > 0n && revisionAt(revisions, b.height - 1n) !== undefined && on(b.height - 1n) ? sweepReset(await tables.state()) : null;
  const step = await sweepStep(tables, applied.batch, {
    budget: options.sweepBudget ?? SWEEP_BUDGET,
    ...(options.greyPicker === undefined ? {} : { picker: options.greyPicker }),
  });
  if (step.deleted.length > 0) await boundLedger(p).ledger.evict(step.deleted);
  return step;
}

/**
 * Block `b`'s `on-compute` work (see the module comment): the block is applied, its root checked, its sweep step
 * computed, and the nodes the step deletes evicted.
 *
 * When the package still refuses that eviction after the worker freed what it can (`EvictionRefused`), the worker
 * thread is ended and a new one started. The new one loads the state at h − 1 from the database (the apply's usual
 * load) and applies the block again, and the sweep step is computed and evicted again; a refusal then fails the block.
 * [LG-14, Q144 B]
 *
 * The stored rows and roots do not depend on the restart: the new thread applies the same block to the same stored
 * state, and a node it writes again is left as it is (`ON CONFLICT DO NOTHING`).
 */
export async function computeBlock(
  p: ProcessContext,
  b: BlockContext,
  read: Pick<ReadHandle, "query">,
  options: CoreLedgerStateOptions = {},
): Promise<{ readonly applied: AppliedState; readonly sweep: SweepWrites | null }> {
  const applied = await applyBlock(p, b, read, options);
  try {
    return { applied, sweep: await sweepOf(p, b, read, applied, options) };
  } catch (error) {
    if (!isEvictionRefused(error) || options.restartOnRefusedEviction === false) throw error;
    await boundLedger(p).ledger.restart();
    const again = await applyBlock(p, b, read, options);
    return { applied: again, sweep: await sweepOf(p, b, read, again, options) };
  }
}

/** The {@link RetainedStates} of core-ledger-state's context `p` (see the module comment). */
export function retainedStates(p: ProcessContext, options: CoreLedgerStateOptions = {}): RetainedStates {
  const from = options.retainedFrom ?? retainedFrom;
  const window = (cursor: bigint | null) => retentionWindow(revisionsOf(p), cursor, from);
  return Object.freeze({
    window,
    async load(height: bigint, read: Pick<ReadHandle, "query" | "height">): Promise<RetainedState> {
      const retained = window(read.height);
      if (retained === null || height < retained.from || height > retained.to) {
        throw new UmbraError(
          "state-not-retained",
          `the ledger state after block ${height} is not retained at the cursor ${read.height ?? "(none)"}: ` +
            (retained === null ? "no block is committed" : `the window holds the states of ${retained.from} to ${retained.to}`) +
            " (see the core entry's retainStates)",
          { height, cursor: read.height, from: retained?.from ?? null, to: retained?.to ?? null },
        );
      }
      const stored = await stateAt(read, height);
      const { stateRoot } = await boundLedger(p).ledger.retained(
        { ledger: stored.ledger, height, hash: stored.hash, stateKey: stored.stateKey },
        read,
      );
      if (!sameBytes(stateRoot, stored.stateRoot)) {
        throw new Error(`the ledger state loaded for block ${height} has another root than ${STATES_TABLE} stores for it`);
      }
      return Object.freeze({ ledger: stored.ledger, height, hash: stored.hash, stateKey: stored.stateKey, stateRoot });
    },
  });
}

/** What a module requiring `ledger-state` loads retained states with: its `process` item. [LG-12] */
export function retainedStatesOf(p: ProcessContext): RetainedStates {
  const item = p.items.get(LEDGER_STATE_ITEM) as RetainedStates | undefined;
  if (item === undefined) throw new Error("retainedStatesOf: the module does not require ledger-state, whose process item it is");
  return item;
}

/**
 * `core-ledger-state` with `options`' rules (see the module comment): a core module that requires `block-header`,
 * `ledger-version` (`core-block-fetch`'s), `block-parsed`, `tx-results` and `config` (`core-chain`'s), provides its four
 * items (`ledger-state` also as a `process` item), and cannot start mid-chain.
 */
export function coreLedgerState(options: CoreLedgerStateOptions = {}): DefinedModule<ModuleDeclaration> {
  return defineModule({
    id: CORE_LEDGER_STATE_ID,
    version: UMBRADB_VERSION,
    side: "public",
    requires: ["block-header", "ledger-version", "block-parsed", "tx-results", "config"],
    provides: [
      {
        name: LEDGER_STATE_ITEM,
        lifetimes: ["block", "table", "process"],
        table: { schema: "core_ledger_state", tables: ["nodes", "root_counts", "states", "sweep", "grey", "marks"], kind: "mutable" },
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
      async "on-start-db"(p) {
        p.publish(LEDGER_STATE_ITEM, retainedStates(p, options));
      },
      async "on-compute"(p, b, read, out) {
        const computed = await computeBlock(p, b, read, options);
        PENDING.set(p, computed);
        const items = itemsOf(computed.applied);
        out.put(LEDGER_STATE_ITEM, items.state);
        out.put(LEDGER_EVENTS_ITEM, items.events);
        out.put(SEGMENT_RESULTS_ITEM, items.segments);
        out.put(VM_LOGS_ITEM, items.logs);
      },
      async "on-db-write"(p, b, w) {
        const { applied, sweep } = pendingOf(p, b);
        await writeBlock(w, applied);
        if (sweep !== null) await writeSweep(w, sweep);
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
