/**
 * The `LedgerPackage` interface (`openspec/changes/core-arch/design.md` §5.1; `specs/ledger/spec.md` LG-6, LG-7;
 * task 12.1): one adapter per ledger version, so that the ledger worker and ledger tasks use every version the same
 * way. The adapters are `./v8.ts` and `./v9.ts`, built on `./adapter.ts`; `./load.ts` loads them in Node.js.
 *
 * **What crosses threads (LG-7, owner decision Q49).** The native objects of a ledger package — its ledger states
 * ({@link StateHandle}), its parsed transactions ({@link LedgerPackage.nativeTransaction}), the packages themselves
 * ({@link LedgerPackage.rawPackages}) and the {@link NodeStore} it reads through — stay in the thread that made them,
 * the ledger worker (task 12.3): Node.js's structured clone drops their prototypes. Everything else an adapter returns
 * is plain, structured-cloneable data made of objects, arrays, strings, numbers, booleans, `bigint`s, `null` and
 * `Uint8Array`s — {@link ParsedTransaction}, {@link ApplyOutput}, {@link NodeBatch}, keys, roots and {@link LogItem}s —
 * and is what the worker posts to the main thread. An adapter works the same in any thread: nothing in it is tied to
 * the main thread or to a worker.
 *
 * **Refinements of `design.md` §5.1 (task 12.1, question Q114).** §5.1's `apply` returns no state, its
 * `parseTransaction` can neither number a transaction nor hand on the native object a ledger task needs, and §5.1
 * leaves `LedgerEvent` and `LogItem` undefined: `apply` returns the state after the block with its output
 * ({@link AppliedBlock}); `parseTransaction` takes the transaction's index; {@link LedgerPackage.nativeTransaction}
 * gives the native object one parse made; an adapter is made for one network id (for
 * {@link LedgerPackage.emptyState}).
 */

import type { LedgerName } from "../config/build.js";

export type { LedgerName };

declare const stateHandle: unique symbol;

/**
 * A ledger state of one ledger package: the package's own native object, opaque outside its adapter. It never leaves
 * the thread that made it (Q49); the adapter that made it is the only one that may be given it.
 */
export interface StateHandle {
  readonly [stateHandle]: "ledger-state";
}

/**
 * A synchronous store of ledger nodes, in the node's `layout-v2` storage (LG-11): a node under its 32-byte key with its
 * payload and the serialization of its child list. The ledger worker's store reads the database through the node-store
 * bridge (`design.md` §5.3, task 12.3). `get` must not call into the ledger package.
 */
export interface NodeStore {
  get(key: Uint8Array): { data: Uint8Array; children: Uint8Array } | null;
}

/** A ledger node as `core_ledger_state.nodes` stores it (LG-11). */
export interface StoredNode {
  key: Uint8Array;
  data: Uint8Array;
  children: Uint8Array;
}

/**
 * What a flush gives the writer (LG-11): the nodes created since the previous flush that a key whose root count rose
 * reaches, and the signed change of each root count changed since then (owner decision Q53); both in key order.
 */
export interface NodeBatch {
  inserts: StoredNode[];
  rootCounts: { key: Uint8Array; delta: number }[];
}

/**
 * A transaction's outcome as the chain recorded it, in CD-6's words: `success` (`TxApplied`, and a system transaction's
 * `SystemTransactionApplied`), `partial` (`TxPartialSuccess`), `failure` (`ExtrinsicFailed`: the extrinsic failed at
 * dispatch, so the node left the state as it was).
 */
export type ChainOutcome = "success" | "partial" | "failure";

/** A block to apply (LG-8): its transactions in application order (CD-5), as the chain carries them. */
export interface ApplyInput {
  transactions: Uint8Array[];
  /**
   * Each transaction's chain outcome, in {@link transactions}' order, as many as there are transactions (task 12.1a,
   * owner decision Q113 A). A transaction whose outcome is `failure` is skipped, as the official indexer skips it
   * (`midnight-indexer` `chain-indexer/src/domain/ledger_state.rs` `apply_transactions`, `failed_regular_transaction`):
   * the ledger is not asked, its result is a `failure`, its cost is not counted, and it is not the first regular
   * transaction LG-8's rule looks for. Any other is replayed and the ledger decides its result. Absent: no outcome is
   * known (a block built offline, as in tests), and every transaction is replayed — exact wherever the chain applied
   * them all or the ledger itself fails each one the chain failed; the v9 node also fails an extrinsic whose cost would
   * take the block over its limits (`midnight-node` `ledger/src/ledger_9/post_block_update.rs`
   * `prevalidate_post_block_update`), which only the outcome shows, so a chain block always gives them (task 12.3).
   */
  outcomes?: readonly ChainOutcome[];
  height: bigint;
  hash: Uint8Array;
  parentHash: Uint8Array;
  timestampMs: bigint;
  parentTimestampMs: bigint;
  /**
   * True for blocks built by runtimes 0.22, 1.0 below 1.0.300 and 2.0, and never for block 0 (LG-8): the first regular
   * transaction to apply, and any failed regular transactions before it, are then also accepted when they are well
   * formed at the parent block's timestamp + 12,000 ms.
   */
  firstRegularAtParentTime: boolean;
}

/** How a transaction applied, and each of its segments: 0, the guaranteed one, then the fallible ones in order. */
export interface TransactionResult {
  outcome: "success" | "partial" | "failure";
  segments: { segment: number; success: boolean }[];
}

/** The kinds of ledger event `apply` reports: every event but contract logs (LG-16), named as `design.md` §10 does. */
export type LedgerEventKind =
  | "zswap-input"
  | "zswap-output"
  | "contract-deploy"
  | "param-change"
  | "dust-initial-utxo"
  | "dust-generation-dtime-update"
  | "dust-spend-processed";

/** A ledger event other than a contract log, as LG-16 stores it. */
export interface LedgerEvent {
  /** The index of its transaction in {@link ApplyInput.transactions}. */
  transaction: number;
  kind: LedgerEventKind;
  logicalSegment: number;
  physicalSegment: number;
  /** The ledger's tagged serialization of the event. */
  bytes: Uint8Array;
  /** A zswap input's nullifier, or a DUST spend's (32 bytes, the field element little-endian). */
  nullifier: Uint8Array | null;
  /** A zswap output's commitment, or a DUST spend's new commitment (32 bytes, as `nullifier`). */
  commitment: Uint8Array | null;
  /** A zswap output's tree index, a DUST spend's commitment index, or a DUST initial UTXO's generation index. */
  treeIndex: bigint | null;
  /** The contract a zswap input or output belongs to, or the contract a deploy created. */
  contractAddress: Uint8Array | null;
}

/** The event types of a MIP-0002 contract log, as the ledger names them. */
export type LogEventType =
  | "ShieldedSpend"
  | "ShieldedReceive"
  | "ShieldedMint"
  | "ShieldedBurn"
  | "UnshieldedSpend"
  | "UnshieldedReceive"
  | "UnshieldedMint"
  | "UnshieldedBurn"
  | "Paused"
  | "Unpaused"
  | "Misc";

/** A contract log as the VM decodes it (CC-3): `data` is the tagged serialization of the logged value. */
export interface LogItem {
  version: number;
  eventType: LogEventType;
  data: Uint8Array;
}

/** A contract log an applied segment emitted (LG-16's `vm-logs`, CC-2's `contract_logs.logs`). */
export interface VmLog extends LogItem {
  /** The index of its transaction in {@link ApplyInput.transactions}. */
  transaction: number;
  /** Its number within the block, in emission order, from 0. */
  index: number;
  address: Uint8Array;
  entryPoint: Uint8Array;
  logicalSegment: number;
  physicalSegment: number;
}

/** What applying a block produced (LG-8, LG-16): plain data. */
export interface ApplyOutput {
  /** One per transaction, in {@link ApplyInput.transactions}' order. */
  results: TransactionResult[];
  events: LedgerEvent[];
  /** Ledger v8 never has any (owner decision Q54). */
  logs: VmLog[];
  /** The ledger parameters after the block, in the ledger's tagged serialization. */
  parameters: Uint8Array;
}

/** {@link LedgerPackage.apply}'s result: the state after the block, which stays in the worker, and the plain output. */
export interface AppliedBlock {
  state: StateHandle;
  output: ApplyOutput;
}

/** What modules on the main thread receive as `block-parsed` (Q49, LG-7): plain, structured-cloneable data. */
export interface ParsedTransaction {
  /** Application order (CD-5). */
  index: number;
  hash: Uint8Array;
  kind: "regular" | "system";
  size: number;
  bytes: Uint8Array;
  segments: {
    segment: number;
    calls: { address: Uint8Array; entryPoint: Uint8Array }[];
    deploys: { address: Uint8Array }[];
  }[];
}

/**
 * What `core_ledger_state.states` stores of a state besides its key and root (LG-16; tasks 12.3, 12.1b): the zswap
 * commitment tree's first free index and root, and the DUST commitment and generation trees' first free indexes and
 * roots, as the official indexer reads them from the ledger's Rust state — each root its tree's root after `rehash()`,
 * in the ledger's untagged serialization (the vendored packages' patched `stateTrees`, owner decision Q138 A). None is
 * null.
 */
export interface StateSummary {
  zswapFirstFree: bigint;
  zswapRoot: Uint8Array;
  dustCommitmentFirstFree: bigint;
  dustCommitmentRoot: Uint8Array;
  dustGenerationFirstFree: bigint;
  dustGenerationRoot: Uint8Array;
}

/**
 * What a module's ledger task is given for a block (LG-17, `design.md` §5.5; task 12.6), in the ledger worker only: the
 * block, its native parsed transactions (the block's one parse, LG-7), `rawPackages()` of its ledger and, for a task
 * that declares `needsState`, the state before the block — read-only, the committed state the worker holds (at an
 * upgrade's F, the state of the ledger before it; none before block 0).
 */
export interface LedgerTaskBlock {
  readonly height: bigint;
  readonly hash: Uint8Array;
  readonly ledger: LedgerName;
  /** The native parsed objects ({@link LedgerPackage.nativeTransaction}), in application order (CD-5). */
  readonly transactions: readonly unknown[];
  /** Only for a task that declares `needsState`, and none at block 0. */
  readonly stateBefore?: StateHandle;
  readonly packages: Readonly<Record<string, unknown>>;
}

/**
 * A module's ledger task (LG-17, `design.md` §5.5, Q49; task 12.6): run in the ledger worker once per block; its result,
 * structured-cloneable plain data (or a promise of it), becomes the module's `block` item named
 * {@link LedgerTask.name}. It writes nothing and keeps no native object between blocks; what it allocates it frees
 * before it returns.
 */
export interface LedgerTask {
  /** The `block` item of its module its result becomes. */
  readonly name: string;
  /** True: it gets the state before the block, and its module must require `ledger-state` (LG-17). */
  readonly needsState: boolean;
  run(block: LedgerTaskBlock): unknown;
}

/** One ledger version's adapter (LG-6). */
export interface LedgerPackage {
  readonly ledger: LedgerName;
  /** The ledger release the packages were built from (`vendor/ledger/<version>/upstream.json`). */
  readonly versionName: string;
  /** The loaded WASM packages, unwrapped, by package name. */
  rawPackages(): Readonly<Record<string, unknown>>;
  /**
   * Parses a transaction as the chain carries it, once (LG-7): the native object is kept for this very `Uint8Array`, so
   * {@link apply} and {@link nativeTransaction} do not parse it again. Throws when the bytes are not a transaction of
   * this ledger version.
   */
  parseTransaction(bytes: Uint8Array, index: number): ParsedTransaction;
  /** The native parsed transaction for these bytes, parsed now if they were not before; for ledger tasks (LG-17). */
  nativeTransaction(bytes: Uint8Array): unknown;
  /**
   * Frees the native objects parsed from these very arrays now (task 12.5): what the ledger worker no longer needs, so
   * that no object the garbage collector has not reached yet keeps a node the sweep deletes (LG-14); parsed again if
   * asked for again.
   */
  forgetTransactions(transactions: readonly Uint8Array[]): void;
  /**
   * A blank state of `networkId`, the adapter's network id unless given: block 0's empty state (IN-7), whose network id
   * is the genesis state's ({@link networkIdOf}, task 12.3).
   */
  emptyState(networkId?: string): StateHandle;
  /** The state `system_properties.genesis_state` carries (IN-7). */
  genesisState(bytes: Uint8Array): StateHandle;
  /** The state whose root node has key `stateKey`, read from `store` as needed (LG-11). */
  load(stateKey: Uint8Array, store: NodeStore): StateHandle;
  /** Applies a block with the replay rules of LG-8; `state` itself is unchanged. */
  apply(state: StateHandle, block: ApplyInput): AppliedBlock;
  /**
   * The network id a state carries (task 12.3): the node makes block 0's empty state with the genesis state's own
   * (`midnight-node` `node/src/genesis/verification/verify_ledger_state_genesis.rs`, `state.network_id`). Read from the
   * state's `Debug` rendering, which names it first — a cost that grows with the state, paid at block 0 only.
   */
  networkIdOf(state: StateHandle): string;
  /** Compared with `midnight_ledgerStateRoot` (LG-15). */
  stateRoot(state: StateHandle): Uint8Array;
  /** What `core_ledger_state.states` stores of the state besides its key and root (LG-16, task 12.3). */
  stateSummary(state: StateHandle): StateSummary;
  /**
   * Frees the state's WebAssembly memory now (wasm-bindgen's `free`): a state the worker no longer holds (task 12.3);
   * the handle must not be used afterwards. Its nodes another state shares stay.
   */
  dispose(state: StateHandle): void;
  /** Its root node's 32-byte key, what {@link load} takes (owner decision Q55). */
  stateKey(state: StateHandle): Uint8Array;
  /** Nodes created, and root-count changes, since the last flush. */
  flush(): NodeBatch;
  persist(key: Uint8Array): void;
  release(key: Uint8Array): void;
  /** A node's by-reference keys, through embedded children. */
  childRefs(children: Uint8Array): Uint8Array[];
  /** Drops swept nodes from the package's caches. */
  evict(keys: Uint8Array[]): void;
  contractStateKey(state: StateHandle, address: Uint8Array): Uint8Array | null;
  contractZswapStateKey(state: StateHandle, address: Uint8Array): Uint8Array | null;
  /** The VM's own log decoding (CC-3); ledger v8: null for every input (owner decision Q54). */
  decodeLogItem(value: Uint8Array): LogItem | null;
  /** Ledger v9 only (LG-9). */
  convertFromV8?(v8StateKey: Uint8Array, store: NodeStore): StateHandle;
}

/** What an adapter is made for. */
export interface LedgerPackageOptions {
  /** The network id of the chain, for {@link LedgerPackage.emptyState}. */
  readonly networkId: string;
}
