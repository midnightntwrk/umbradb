/**
 * The `LedgerPackage` interface: one adapter per ledger version, so the ledger worker and ledger tasks use every
 * version the same way. The adapters are `./v8.ts` and `./v9.ts`, built on `./adapter.ts`; `./load.ts` loads them in
 * Node.js. [LG-6, LG-7; design §5.1]
 *
 * **What crosses threads.** A ledger package's native objects stay in the thread that made them, the ledger worker,
 * because Node.js's structured clone drops their prototypes. These are its ledger states ({@link StateHandle}), its
 * parsed transactions ({@link LedgerPackage.nativeTransaction}), the packages themselves
 * ({@link LedgerPackage.rawPackages}) and the {@link NodeStore} it reads through. Everything else an adapter returns is
 * plain, structured-cloneable data (objects, arrays, strings, numbers, booleans, `bigint`s, `null` and `Uint8Array`s):
 * {@link ParsedTransaction}, {@link ApplyOutput}, {@link NodeBatch}, keys, roots and {@link LogItem}s. That is what the
 * worker posts to the main thread. An adapter works the same in any thread: nothing in it is tied to the main thread
 * or to a worker. [LG-7, Q49]
 *
 * **Additions to the design's interface.** The design's `apply` returns no state, its `parseTransaction` can neither
 * number a transaction nor hand on the native object a ledger task needs, and it leaves `LedgerEvent` and `LogItem`
 * undefined. Here:
 * - `apply` returns the state after the block together with its output ({@link AppliedBlock});
 * - `parseTransaction` takes the transaction's index;
 * - {@link LedgerPackage.nativeTransaction} returns the native object made by the single parse;
 * - an adapter is made for one network id (for {@link LedgerPackage.emptyState}). [Q114; design §5.1]
 */

import type { LedgerName } from "../config/build.js";

export type { LedgerName };

declare const stateHandle: unique symbol;

/**
 * A ledger state of one ledger package: the package's own native object, opaque outside its adapter. It never leaves
 * the thread that made it, and only the adapter that made it may be given it. [Q49]
 */
export interface StateHandle {
  readonly [stateHandle]: "ledger-state";
}

/**
 * A synchronous store of ledger nodes in the node's `layout-v2` storage: each node under its 32-byte key, with its
 * payload and the serialization of its child list. The ledger worker's store reads the database through the node-store
 * bridge. `get` must not call into the ledger package. [LG-11; design §5.3]
 */
export interface NodeStore {
  get(key: Uint8Array): { data: Uint8Array; children: Uint8Array } | null;
}

/** A ledger node as `core_ledger_state.nodes` stores it. [LG-11] */
export interface StoredNode {
  key: Uint8Array;
  data: Uint8Array;
  children: Uint8Array;
}

/**
 * What a flush gives the writer, both lists in key order:
 * - the nodes created since the previous flush that are reachable from a key whose root count rose;
 * - the signed change of each root count that changed since then. [LG-11, Q53]
 */
export interface NodeBatch {
  inserts: StoredNode[];
  rootCounts: { key: Uint8Array; delta: number }[];
}

/**
 * A transaction's outcome as the chain recorded it in its events:
 * - `success`: `TxApplied`, or a system transaction's `SystemTransactionApplied`;
 * - `partial`: `TxPartialSuccess`;
 * - `failure`: `ExtrinsicFailed`; the extrinsic failed at dispatch, so the node left the state as it was. [CD-6]
 */
export type ChainOutcome = "success" | "partial" | "failure";

/** A block to apply: its transactions in application order, as the chain carries them. [LG-8, CD-5] */
export interface ApplyInput {
  transactions: Uint8Array[];
  /**
   * Each transaction's chain outcome, in {@link transactions}' order, one per transaction. [Q113 A]
   *
   * A transaction whose outcome is `failure` is skipped, as the official indexer skips it (`midnight-indexer`
   * `chain-indexer/src/domain/ledger_state.rs` `apply_transactions`, `failed_regular_transaction`): the ledger is not
   * asked, its result is a `failure`, its cost is not counted, and it does not count as the first regular transaction
   * for {@link ApplyInput.firstRegularAtParentTime}. Any other transaction is replayed and the ledger decides its
   * result. [LG-8]
   *
   * Absent means no outcome is known (a block built offline, as in tests), and every transaction is replayed. That is
   * exact when the chain applied them all, or when the ledger itself fails each one the chain failed. But the v9 node
   * also fails an extrinsic whose cost would take the block over its limits (`midnight-node`
   * `ledger/src/ledger_9/post_block_update.rs` `prevalidate_post_block_update`), which only the outcome shows; so a
   * block from the chain always carries outcomes.
   */
  outcomes?: readonly ChainOutcome[];
  height: bigint;
  hash: Uint8Array;
  parentHash: Uint8Array;
  timestampMs: bigint;
  parentTimestampMs: bigint;
  /**
   * True for blocks built by runtimes 0.22, 1.0 below 1.0.300 and 2.0, and never for block 0. The first regular
   * transaction to apply, and any failed regular transactions before it, are then also accepted when they are well
   * formed at the parent block's timestamp + 12,000 ms. [LG-8]
   */
  firstRegularAtParentTime: boolean;
}

/** How a transaction applied, and each of its segments: 0, the guaranteed one, then the fallible ones in order. */
export interface TransactionResult {
  outcome: "success" | "partial" | "failure";
  segments: { segment: number; success: boolean }[];
}

/** The kinds of ledger event `apply` reports: every event except contract logs. [LG-16; design §10] */
export type LedgerEventKind =
  | "zswap-input"
  | "zswap-output"
  | "contract-deploy"
  | "param-change"
  | "dust-initial-utxo"
  | "dust-generation-dtime-update"
  | "dust-spend-processed";

/** A ledger event other than a contract log, as `core-ledger-state` stores it. [LG-16] */
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

/** A contract log as the VM decodes it: `data` is the tagged serialization of the logged value. [CC-3] */
export interface LogItem {
  version: number;
  eventType: LogEventType;
  data: Uint8Array;
}

/** A contract log an applied segment emitted: the `vm-logs` item, stored in `contract_logs.logs`. [LG-16, CC-2] */
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

/** What applying a block produced, as plain data. [LG-8, LG-16] */
export interface ApplyOutput {
  /** One per transaction, in {@link ApplyInput.transactions}' order. */
  results: TransactionResult[];
  events: LedgerEvent[];
  /** Ledger v8 never has any. [Q54] */
  logs: VmLog[];
  /** The ledger parameters after the block, in the ledger's tagged serialization. */
  parameters: Uint8Array;
}

/** {@link LedgerPackage.apply}'s result: the state after the block, which stays in the worker, and the plain output. */
export interface AppliedBlock {
  state: StateHandle;
  output: ApplyOutput;
}

/** What modules on the main thread receive as `block-parsed`: plain, structured-cloneable data. [LG-7, Q49] */
export interface ParsedTransaction {
  /** Application order. [CD-5] */
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
 * What `core_ledger_state.states` stores of a state besides its key and root: the first free index and the root of the
 * zswap commitment tree, the DUST commitment tree and the DUST generation tree. They are read as the official indexer
 * reads them from the ledger's Rust state: each root is its tree's root after `rehash()`, in the ledger's untagged
 * serialization (from the vendored packages' patched `stateTrees`). None is null. [LG-16, Q138 A]
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
 * What a module's ledger task is given for a block, in the ledger worker only:
 * - the block;
 * - its native parsed transactions, from the block's single parse [LG-7];
 * - `rawPackages()` of its ledger;
 * - for a task that declares `needsState`, the state before the block. It is read-only: the committed state the worker
 *   holds. At an upgrade's first block F it is the state of the ledger before the upgrade; block 0 has none.
 *
 * [LG-17; design §5.5]
 */
export interface LedgerTaskBlock {
  readonly height: bigint;
  readonly hash: Uint8Array;
  readonly ledger: LedgerName;
  /** The native parsed objects ({@link LedgerPackage.nativeTransaction}), in application order. [CD-5] */
  readonly transactions: readonly unknown[];
  /** Only for a task that declares `needsState`, and none at block 0. */
  readonly stateBefore?: StateHandle;
  readonly packages: Readonly<Record<string, unknown>>;
}

/**
 * A module's ledger task, run in the ledger worker once per block. Its result is structured-cloneable plain data (or a
 * promise of it) and becomes the module's `block` item named {@link LedgerTask.name}. It writes nothing and keeps no
 * native object between blocks; it frees what it allocates before it returns. [LG-17, Q49; design §5.5]
 */
export interface LedgerTask {
  /** The `block` item of its module its result becomes. */
  readonly name: string;
  /** True: it gets the state before the block, and its module must require `ledger-state`. [LG-17] */
  readonly needsState: boolean;
  run(block: LedgerTaskBlock): unknown;
}

/** One ledger version's adapter. [LG-6] */
export interface LedgerPackage {
  readonly ledger: LedgerName;
  /** The ledger release the packages were built from (`vendor/ledger/<version>/upstream.json`). */
  readonly versionName: string;
  /** The loaded WASM packages, unwrapped, by package name. */
  rawPackages(): Readonly<Record<string, unknown>>;
  /**
   * Parses a transaction as the chain carries it, once: the native object is kept for this very `Uint8Array`, so
   * {@link apply} and {@link nativeTransaction} do not parse it again. Throws when the bytes are not a transaction of
   * this ledger version. [LG-7]
   */
  parseTransaction(bytes: Uint8Array, index: number): ParsedTransaction;
  /** The native parsed transaction for these bytes, parsed now if they were not before; for ledger tasks. [LG-17] */
  nativeTransaction(bytes: Uint8Array): unknown;
  /**
   * Frees now the native objects parsed from these very arrays, which the ledger worker no longer needs. This way no
   * object the garbage collector has not reached yet keeps alive a node the sweep deletes. They are parsed again if
   * asked for again. [LG-14]
   */
  forgetTransactions(transactions: readonly Uint8Array[]): void;
  /**
   * A blank state of `networkId` (the adapter's network id unless given): block 0's empty state, whose network id is
   * the genesis state's ({@link networkIdOf}). [IN-7]
   */
  emptyState(networkId?: string): StateHandle;
  /** The state `system_properties.genesis_state` carries. [IN-7] */
  genesisState(bytes: Uint8Array): StateHandle;
  /** The state whose root node has key `stateKey`, read from `store` as needed. [LG-11] */
  load(stateKey: Uint8Array, store: NodeStore): StateHandle;
  /** Applies a block with the node's replay rules; `state` itself is unchanged. [LG-8] */
  apply(state: StateHandle, block: ApplyInput): AppliedBlock;
  /**
   * The network id a state carries. The node makes block 0's empty state with the genesis state's own network id
   * (`midnight-node` `node/src/genesis/verification/verify_ledger_state_genesis.rs`, `state.network_id`). It is read
   * from the state's `Debug` rendering, which names it first; that cost grows with the state and is paid at block 0
   * only.
   */
  networkIdOf(state: StateHandle): string;
  /** Compared with `midnight_ledgerStateRoot`. [LG-15] */
  stateRoot(state: StateHandle): Uint8Array;
  /** What `core_ledger_state.states` stores of the state besides its key and root. [LG-16] */
  stateSummary(state: StateHandle): StateSummary;
  /**
   * Frees now the WebAssembly memory of a state the worker no longer holds (wasm-bindgen's `free`). The handle must
   * not be used afterwards. Nodes it shares with another state stay.
   */
  dispose(state: StateHandle): void;
  /** The 32-byte key of its root node, which is what {@link load} takes. [Q55] */
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
  /** The VM's own log decoding; ledger v8 returns null for every input. [CC-3, Q54] */
  decodeLogItem(value: Uint8Array): LogItem | null;
  /** Ledger v9 only: converts a v8 state. [LG-9] */
  convertFromV8?(v8StateKey: Uint8Array, store: NodeStore): StateHandle;
}

/** What an adapter is made for. */
export interface LedgerPackageOptions {
  /** The network id of the chain, for {@link LedgerPackage.emptyState}. */
  readonly networkId: string;
}
