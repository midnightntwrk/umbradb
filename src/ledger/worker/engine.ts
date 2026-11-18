/**
 * The ledger worker's work: what the worker thread does for the main thread. It is kept apart from the thread's
 * messaging (`./entry.ts`), so it runs the same in a worker and in the main thread (`./host.ts`'s `inThreadLedger`, for
 * a negative control and the tests).
 *
 * **Adapters.** One per ledger version, loaded the first time a request names it (`load`, which is
 * `loadLedgerPackage` in the worker), and loaded again after a failed load. They are made with
 * {@link PARSE_NETWORK_ID}. The network id serves only block 0's empty state, which takes the genesis state's own id
 * instead ({@link LedgerEngine.genesis}).
 *
 * **Parse once.** {@link LedgerEngine.parse} parses a block's transactions with its ledger's adapter. It keeps the very
 * arrays it parsed, under the block's hash, until the block is applied and released ({@link LedgerEngine.release}). The
 * adapter keeps each native object under its array (`../adapter.ts`), so the block's apply and its ledger tasks find
 * them and parse nothing again. A block parsed again (a retried height) gets the kept parse back. Only plain data
 * leaves the worker, so the parse is checked for that (`../plain-data.ts`).
 *
 * **Ledger tasks.** {@link LedgerEngine.tasks} runs a module's tasks, given by the worker's entry (`./run.ts`), on a
 * block's kept parse. Each task gets the native objects, `rawPackages()` and, if it declares `needsState`, the
 * committed state, which must be the state before the block. Each result is checked as plain data. A task that throws or returns
 * anything else fails the request with {@link LedgerTaskFailed}, naming the module and the task; a trap ends the
 * worker, as an apply's trap does.
 *
 * **The states.** The engine holds the state committed at a height (its cursor's) and the pending states, oldest
 * first: the one after the block applied on the committed state, not yet committed ({@link LedgerEngine.commit}, which
 * the host sends once the `COMMIT` of the block's transaction answered, `./host.ts`), then the one of the block applied
 * ahead on it (below). {@link LedgerEngine.apply} applies a block only on the committed state at h − 1, of the block's
 * ledger and with the committed block as its parent, and refuses anything else, naming what it holds.
 *
 * The same block applied again while pending (a height whose transaction was lost and is processed again, or a block
 * applied ahead asked for again) gets the same result back, batch included, marked ahead or not, when it is asked for
 * with the input it was applied from: each pending state keeps a copy of that input, and every member is compared, the
 * `ahead` mark apart ({@link sameInput}). The database rolled back, or never held the batch, so it still has to be
 * written; and the package's memory already counts the batch's nodes as stored, so a second apply would flush none of
 * them. For the same reason a pending block asked for with another input is refused with {@link ApplyNeedsNewThread}:
 * this thread can give neither the pending result (it is another input's) nor a new one. An apply that is not marked
 * ahead and names another block drops every pending state.
 *
 * **An apply that failed after its state was made.** Once the adapter has returned a block's new state, the engine
 * persists the state's key, reads and persists the contracts' keys, releases the keys the block names and flushes
 * ({@link LedgerEngine}'s `#settled`). A failure there leaves the package with a part of that work: a key persisted and
 * not flushed is counted again by the next flush, which would then give a root count of 2 where one apply gives 1. So
 * after such a failure the engine applies no block: every later apply, and block 0's, is refused with
 * {@link ApplyNeedsNewThread}, while a pending block asked for again with its input still gets its result. A failure
 * before that (a block the engine refuses, a missing parse, the adapter's own apply throwing) changes nothing a flush
 * writes, and the engine goes on. The main thread answers {@link ApplyNeedsNewThread} by ending this thread and applying
 * the block in a new one, from the state the database stores (`core-ledger-state`).
 *
 * **A block applied ahead** ({@link ApplyBlock.ahead}). While the main thread runs block h's transaction,
 * `core-ledger-state` has the worker apply h + 1 once h's eviction has been sent
 * (`src/backbone/core-ledger-state/apply-ahead.ts`). The engine then holds the state after h − 1 (committed) and those
 * after h and h + 1 (pending, in that order). An apply marked ahead takes the newest pending state as its parent, which
 * must be its parent block's and of its ledger: a change of ledger is never applied ahead. With none pending it is an
 * ordinary apply on the committed state. {@link LedgerEngine.commit} of h makes the state after h the committed one
 * and leaves h + 1's pending. Whether the result is used is the main thread's decision.
 *
 * **The state at h − 1 from the database.** {@link LedgerEngine.load} makes the state the database stores for a block
 * (by its key, `core_ledger_state.states.state_key`) the committed one. If the engine holds it already (committed, or
 * pending and committed in the database since, before the engine's commit reached it), this is immediate. Otherwise
 * the state is read through the node store from its key, as after a restart, and the pending block is dropped.
 * `core-ledger-state` asks for the state at h − 1 before every apply. So a restarted process, with a fresh worker
 * that holds nothing, loads the state at the cursor once, and a process that keeps running reads nothing.
 *
 * **The v8 → v9 conversion.** A block of ledger v9 (`v9`, or `v9-rc5` for runtime 2.1.0) on a committed v8 state is
 * the first block F built by a v9 runtime after v8 blocks. The engine first converts the state with that v9 package's
 * `convertFromV8`, the ledger team's translation shipped with it. It reads the v8 state's nodes from the node store by
 * its key (the state at U is committed, so its nodes are in the database). It then applies F to the converted state,
 * as the node and the official indexer do, even when F has no transaction. F's batch is the v9 package's: the
 * converted state's new nodes with F's, the v9 key persisted, and the released keys (the v8 state's among them)
 * released.
 *
 * **An upgrade within v9.** A block of a later v9 build on a committed state of an earlier one is F of an upgrade
 * within v9: `v9-rc3` (runtime 2.0) to `v9-rc5` (runtime 2.1.0) or `v9` (runtime 2.1.100 on), and `v9-rc5` to `v9`.
 * The packages share one storage format, so the engine loads the state at U in F's package by its key from the node
 * store, as a restart loads a stored state (U is committed, so its nodes are in the database), and applies F to it.
 * F's batch is F's package's, as at a conversion. Any other change of ledger is refused: no conversion to rc.3 exists
 * (the node that builds rc.3, `midnight-node` 2.0.0-rc.4, has none), and none goes back.
 *
 * **What a block gives** ({@link AppliedState}):
 * - the state's key and root; the main thread compares the root with the node's;
 * - its summary;
 * - the adapter's output: results, events, logs, parameters;
 * - the batch the block writes: the new state's key persisted; the keys {@link ApplyBlock.release} names released
 *   (the retention window, which the main thread computes; the state before the block when none is given); and the
 *   state and zswap-state keys of each contract {@link ApplyBlock.contracts} names, persisted and never released,
 *   flushed with the nodes they reach;
 * - each such contract's keys ({@link ContractKeys}).
 *
 * **A retained state** ({@link LedgerEngine.retained}) is loaded by its key beside the held states, its root read, and
 * the state dropped. The states the engine holds are left as they are.
 *
 * **Eviction** ({@link LedgerEngine.evict}): every loaded package forgets the nodes reclamation deletes, so a node
 * needed again is flushed again. A package refuses to forget a node that a live object holds. Reclamation deletes no
 * node that the states the engine holds reach through the child lists the database stores (it keeps, for one block,
 * what the state before the block reaches), so the engine frees a kept parse's native objects when it drops the parse.
 * If a later block's kept transaction still holds one, it frees every kept parse's native objects and tries again
 * (those transactions are parsed again at their apply). A refusal after that rejects with {@link EvictionRefused}: an
 * object this thread cannot reach holds the node, or a live object holds it by reference where the stored child lists
 * embed it (the package keeps the child list it first cached for a key). The main thread then ends the thread and
 * starts a new one (`./host.ts`'s `restart`), and the block commits: the new thread holds no state, so the next block
 * is applied on the state after it loaded from the database.
 *
 * **The node store is installed from the first block on** (in the worker, the bridge's store). To the package, a
 * flushed node is a stored node, so its cache may drop the node's bytes while the state still uses it. When it later
 * serializes something of the state, it reads them again from the store: the database, which holds every flushed node
 * from the block's commit on. Without a store the package aborts there ("Arena should contain current serialization
 * target", seen at preview's block 3,772). The package installs a store only in `loadState`, so the engine loads the
 * state it just made by its key once per package (from memory, with no read) and drops that copy. A state's root and
 * summary are read before the flush, while its nodes are pending in memory: the database holds a block's nodes only
 * once the block has committed.
 *
 * **Block 0** ({@link LedgerEngine.genesis}). The genesis state is `system_properties.genesis_state`. The main thread
 * holds the node's root at block 0 and says whether the genesis state already includes block 0's transactions
 * (`includesBlockZero`: its root is the node's, {@link LedgerEngine.genesisRoot}). If it does, the transactions are
 * applied, for their results only, to an empty state with the genesis state's network id, and the genesis state is the
 * state after block 0. Otherwise they are applied to the genesis state. Block 0's parent time is its own, as in the
 * official indexer, and its first regular transaction gets no time bump.
 */

import type {
  ApplyInput,
  ApplyOutput,
  ChainOutcome,
  LedgerName,
  LedgerPackage,
  LedgerPackageOptions,
  NodeBatch,
  NodeStore,
  ParsedTransaction,
  StateHandle,
  StateSummary,
  StoredNode,
  LedgerTask,
} from "../types.js";
import { plainDataProblem } from "../plain-data.js";
import { endApply, timed } from "../../trace/worker-trace.js";

/** What loads an adapter: `loadLedgerPackage`, or a test package's loader. */
export type LedgerLoader = (ledger: LedgerName, options: LedgerPackageOptions) => Promise<LedgerPackage>;

/** The network id the engine's adapters are made with: parsing and applying read none (see the module comment). */
export const PARSE_NETWORK_ID = "undeployed";

/** The name of {@link EvictionRefused}, which an error keeps when it crosses from the worker (`./host.ts`'s `errorOf`). */
export const EVICTION_REFUSED = "EvictionRefused";

/**
 * A package still refuses to forget a swept node after the worker freed what it can ({@link LedgerEngine.evict}). The
 * main thread then ends the worker thread and applies the block again in a new one.
 */
export class EvictionRefused extends Error {
  constructor(message: string) {
    super(message);
    this.name = EVICTION_REFUSED;
  }
}

/** The name of {@link ApplyNeedsNewThread}, which an error keeps when it crosses from the worker. */
export const APPLY_NEEDS_NEW_THREAD = "ApplyNeedsNewThread";

/**
 * This thread cannot apply the block (see the module comment): it holds the block pending, applied from another input,
 * or an earlier apply failed after its state was made. The main thread ends the thread and applies the block in a new
 * one.
 */
export class ApplyNeedsNewThread extends Error {
  constructor(message: string) {
    super(message);
    this.name = APPLY_NEEDS_NEW_THREAD;
  }
}

/** Whether `error` is an {@link ApplyNeedsNewThread}, here or as it crossed from the worker (its name kept). */
export const isApplyNeedsNewThread = (error: unknown): boolean => error instanceof Error && error.name === APPLY_NEEDS_NEW_THREAD;

/** The name of {@link LedgerTaskFailed}, which an error keeps when it crosses from the worker. */
export const LEDGER_TASK_FAILED = "LedgerTaskFailed";

/** A module's ledger task that failed a block ({@link LedgerEngine.tasks}), naming the module and the task. */
export class LedgerTaskFailed extends Error {
  constructor(module: string, task: string, height: bigint, why: string) {
    super(`the ledger task ${task} of ${module} at block ${height} ${why}`);
    this.name = LEDGER_TASK_FAILED;
  }
}

/** Whether `error` is an {@link EvictionRefused}, here or as it crossed from the worker (its name kept). */
export const isEvictionRefused = (error: unknown): boolean => error instanceof Error && error.name === EVICTION_REFUSED;

/** A block: its height and hash. */
export interface BlockId {
  readonly height: bigint;
  readonly hash: Uint8Array;
}

/**
 * What the apply of a block after 0 takes: the block, its time and its parent's, whether its first regular transaction
 * runs at the parent's time, and its outcomes.
 */
export interface ApplyBlock extends BlockId {
  readonly ledger: LedgerName;
  readonly parentHash: Uint8Array;
  readonly timestampMs: bigint;
  readonly parentTimestampMs: bigint;
  readonly firstRegularAtParentTime: boolean;
  /** How many transactions the block holds: the parse kept must have as many. */
  readonly transactions: number;
  /** The chain's outcome of each transaction, from `tx-results`; when absent, every transaction is replayed. */
  readonly outcomes?: readonly ChainOutcome[];
  /**
   * The keys of the stored states the block releases (the states leaving the retention window), each released once in
   * the block's batch. When absent, the state before the block is released (`retainStates` 0).
   */
  readonly release?: readonly Uint8Array[];
  /** The contracts whose state and zswap-state keys the block persists, never to be released. */
  readonly contracts?: readonly Uint8Array[];
  /**
   * True for a block applied ahead (see the module comment): its parent may be the newest pending block, not yet
   * committed.
   */
  readonly ahead?: boolean;
}

/** A contract's keys after a block: null for a contract the state does not hold. */
export interface ContractKeys {
  readonly address: Uint8Array;
  readonly stateKey: Uint8Array | null;
  readonly zswapStateKey: Uint8Array | null;
}

/** A module as the ledger worker needs it: its id and its ledger tasks (a module declaration is one). */
export interface LedgerWorkerModule {
  readonly id: string;
  readonly ledgerTasks?: readonly LedgerTask[];
}

/** The ledger tasks of `modules`, by module id (a module listed twice: its last listing's); throws for a non-module. */
export function ledgerTasksOf(modules: readonly LedgerWorkerModule[]): Map<string, readonly LedgerTask[]> {
  const tasks = new Map<string, readonly LedgerTask[]>();
  for (const module of modules) {
    if (module === null || typeof module !== "object" || typeof module.id !== "string") {
      throw new TypeError("the ledger worker takes the modules the host ships: each a declaration, with its id");
    }
    tasks.set(module.id, Object.freeze([...(module.ledgerTasks ?? [])]));
  }
  return tasks;
}

/** One module's ledger tasks for a block, as the main thread names them (`../tasks.ts`). */
export interface TaskRun extends BlockId {
  readonly ledger: LedgerName;
  readonly parentHash: Uint8Array;
  /** How many transactions `block-parsed` holds: the parse kept must have as many. */
  readonly transactions: number;
  readonly module: string;
  /** The tasks' names, in the module's order. */
  readonly tasks: readonly string[];
}

/** What block 0's apply takes. */
export interface GenesisBlock extends BlockId {
  readonly ledger: LedgerName;
  readonly parentHash: Uint8Array;
  readonly timestampMs: bigint;
  readonly transactions: number;
  readonly outcomes?: readonly ChainOutcome[];
  /** `system_properties.genesis_state`: the ledger's tagged serialization of the genesis state. */
  readonly genesisState: Uint8Array;
  /** True when the genesis state already holds block 0's transactions (its root is the node's at block 0). */
  readonly includesBlockZero: boolean;
}

/**
 * A stored state, by the block it is after and its key: the state a restart loads, or a retained state.
 */
export interface LoadState extends BlockId {
  readonly ledger: LedgerName;
  readonly stateKey: Uint8Array;
}

/** What applying a block gave: plain data (see the module comment). */
export interface AppliedState extends BlockId {
  readonly ledger: LedgerName;
  readonly stateKey: Uint8Array;
  readonly stateRoot: Uint8Array;
  readonly summary: StateSummary;
  readonly output: ApplyOutput;
  readonly batch: NodeBatch;
  /** The keys of each contract {@link ApplyBlock.contracts} named, in its order; none for block 0. */
  readonly contracts: readonly ContractKeys[];
}

/** What {@link LedgerEngine.load} gave: the state's root, and whether it was read from the node store. */
export interface LoadedState {
  readonly stateRoot: Uint8Array;
  readonly loaded: boolean;
}

/** What the engine holds now (for the tests and the host's reports). */
export interface EngineHolding {
  readonly committed: BlockId | null;
  /** The oldest pending block. */
  readonly pending: BlockId | null;
  /** The blocks applied ahead on the oldest pending one, in order; none without one. */
  readonly ahead: readonly BlockId[];
  /** The hashes, `0x`-less hex, of the blocks whose parse it keeps, by height then hash. */
  readonly parsed: readonly string[];
}

/** What {@link LedgerEngine} is made with. */
export interface EngineOptions {
  readonly load: LedgerLoader;
  /** The node store the package reads stored nodes from (the bridge's, in the worker); none on the main thread. */
  readonly store?: NodeStore;
  /** The modules' ledger tasks, by module id: the worker's entry's (`./run.ts`); none unless given. */
  readonly tasks?: ReadonlyMap<string, readonly LedgerTask[]>;
  /**
   * Whether parses and task results are checked as plain data before they leave (`../plain-data.ts`); true (false: a
   * negative control's).
   */
  readonly checkPlainData?: boolean;
  /**
   * Whether a pending block asked for again gets its result only for the input it was applied from; true (false: a
   * negative control's, which gives the result back for any input).
   */
  readonly checkSameInput?: boolean;
  /**
   * Whether the engine applies no block after an apply failed once its state was made; true (false: a negative
   * control's, which goes on in the same package).
   */
  readonly refuseAfterFailedApply?: boolean;
}

/** A state the engine holds, with the block it is after. */
interface Held extends BlockId {
  readonly ledger: LedgerName;
  readonly adapter: LedgerPackage;
  readonly state: StateHandle;
  readonly key: Uint8Array;
  readonly root: Uint8Array;
}

/** What a block's batch persists and releases besides the new state's key (see {@link ApplyBlock}). */
interface Keys {
  /** The keys released: the window's, or the state before the block. */
  readonly release: readonly Uint8Array[];
  readonly contracts: readonly Uint8Array[];
}

/** A state after a block, settled: persisted, flushed and described. */
interface Settled {
  readonly result: AppliedState;
  readonly state: StateHandle;
  readonly key: Uint8Array;
}

/** A parse kept for a block. */
interface Kept {
  readonly height: bigint;
  readonly ledger: LedgerName;
  readonly transactions: readonly Uint8Array[];
  readonly parsed: readonly ParsedTransaction[];
}

const hexOf = (bytes: Uint8Array): string => Array.from(bytes, (byte) => byte.toString(16).padStart(2, "0")).join("");
const sameBytes = (a: Uint8Array, b: Uint8Array): boolean => a.length === b.length && a.every((byte, i) => byte === b[i]);
const same = (a: BlockId, b: BlockId): boolean => a.height === b.height && sameBytes(a.hash, b.hash);
const idOf = (block: BlockId): BlockId => Object.freeze({ height: block.height, hash: block.hash });

/** Whether two plain values (what an apply's input holds) are equal: bytes by content, arrays and objects by member. */
function plainEqual(a: unknown, b: unknown): boolean {
  if (a === b) return true;
  if (a instanceof Uint8Array || b instanceof Uint8Array) {
    return a instanceof Uint8Array && b instanceof Uint8Array && a.length === b.length && a.every((byte, i) => byte === b[i]);
  }
  if (Array.isArray(a) || Array.isArray(b)) {
    return Array.isArray(a) && Array.isArray(b) && a.length === b.length && a.every((item, i) => plainEqual(item, b[i]));
  }
  if (a === null || b === null || typeof a !== "object" || typeof b !== "object") return false;
  const left = Object.entries(a).filter(([, value]) => value !== undefined);
  const right = new Map(Object.entries(b).filter(([, value]) => value !== undefined));
  return left.length === right.size && left.every(([key, value]) => right.has(key) && plainEqual(value, right.get(key)));
}

/**
 * A copy of the plain value `value`: each byte string copied to a buffer of its own length (a view into a larger buffer
 * keeps none of it), arrays and objects member by member.
 */
function ownedCopy(value: unknown): unknown {
  if (value instanceof Uint8Array) return Uint8Array.from(value);
  if (Array.isArray(value)) return value.map(ownedCopy);
  if (value !== null && typeof value === "object") return Object.fromEntries(Object.entries(value).map(([key, member]) => [key, ownedCopy(member)]));
  return value;
}

/** An apply's input: a block's after 0, or block 0's. */
type BlockInput = ApplyBlock | GenesisBlock;

/**
 * The members in which `a` and `b`, two inputs of an apply, differ, the `ahead` mark apart: bytes compared by content,
 * lists member by member in their order, an absent member equal to an undefined one only.
 */
export function inputDifferences(a: BlockInput, b: BlockInput): string[] {
  const left = a as unknown as Record<string, unknown>;
  const right = b as unknown as Record<string, unknown>;
  return [...new Set([...Object.keys(left), ...Object.keys(right)])].filter((name) => name !== "ahead" && !plainEqual(left[name], right[name])).sort();
}

/** Whether `a` and `b` are the same input of an apply, the `ahead` mark apart ({@link inputDifferences}). */
export function sameInput(a: BlockInput, b: BlockInput): boolean {
  return inputDifferences(a, b).length === 0;
}

/**
 * `input` without an `ahead` mark, as a copy that owns every byte string it holds: the buffers it was built from are
 * the caller's, which may change them later.
 */
export function ownedInput<T extends BlockInput>(input: T): T {
  const { ahead: _mark, ...rest } = input as T & { readonly ahead?: boolean };
  return ownedCopy(rest) as T;
}

/** Block 0's keys: nothing released, no contract. */
const NO_KEYS: Keys = Object.freeze({ release: [], contracts: [] });

/**
 * Whether a block of ledger `to` on a state of ledger `from` converts it with `to`'s `convertFromV8` (see the module
 * comment): the v9 packages that carry the translation, `v9` and `v9-rc5`, on a v8 state.
 */
export const convertsFromV8 = (from: LedgerName, to: LedgerName): boolean => from === "v8" && (to === "v9" || to === "v9-rc5");

/** The upgrades within v9 whose F loads the state at U in F's package (see the module comment): `[from, to]`. */
const V9_CARRIES: readonly (readonly [LedgerName, LedgerName])[] = Object.freeze([
  ["v9-rc3", "v9-rc5"],
  ["v9-rc3", "v9"],
  ["v9-rc5", "v9"],
] as const);

/** The ledger worker's engine (see the module comment). */
export class LedgerEngine {
  readonly #load: LedgerLoader;
  readonly #store: NodeStore | undefined;
  readonly #tasks: ReadonlyMap<string, readonly LedgerTask[]>;
  readonly #checkPlainData: boolean;
  readonly #checkSameInput: boolean;
  readonly #refuseAfterFailedApply: boolean;
  readonly #adapters = new Map<LedgerName, Promise<LedgerPackage>>();
  readonly #kept = new Map<string, Kept>();
  /** The adapters whose package has the node store installed. */
  readonly #installed = new WeakSet<LedgerPackage>();
  #committed: Held | null = null;
  /**
   * The pending states, oldest first, each with its result, its batch's nodes by key and a copy of the input it was
   * applied from (see the module comment).
   */
  #pending: (Held & { readonly result: AppliedState; readonly nodes: ReadonlyMap<string, StoredNode>; readonly input: BlockInput })[] = [];
  /** The apply that failed after its state was made, as later applies name it; null while none did. */
  #failed: string | null = null;

  constructor(options: EngineOptions) {
    this.#load = options.load;
    this.#store = options.store;
    this.#tasks = options.tasks ?? new Map();
    this.#checkPlainData = options.checkPlainData !== false;
    this.#checkSameInput = options.checkSameInput !== false;
    this.#refuseAfterFailedApply = options.refuseAfterFailedApply !== false;
  }

  /** `value` as it leaves the worker, checked as plain data (see {@link EngineOptions.checkPlainData}); throws `fail`'s. */
  #plain<T>(value: T, fail: (problem: string) => Error): T {
    const problem = this.#checkPlainData ? plainDataProblem(value) : null;
    if (problem !== null) throw fail(problem);
    return value;
  }

  /** The adapter of `ledger`, loaded once (again after a failed load). */
  #adapter(ledger: LedgerName): Promise<LedgerPackage> {
    let adapter = this.#adapters.get(ledger);
    if (adapter === undefined) {
      adapter = this.#load(ledger, { networkId: PARSE_NETWORK_ID });
      this.#adapters.set(ledger, adapter);
      adapter.catch(() => this.#adapters.delete(ledger));
    }
    return adapter;
  }

  /** Parses block `block`'s transactions once with `ledger`'s adapter and keeps them for its apply. */
  async parse(ledger: LedgerName, block: BlockId, transactions: readonly Uint8Array[]): Promise<readonly ParsedTransaction[]> {
    const key = hexOf(block.hash);
    const kept = this.#kept.get(key);
    if (kept !== undefined && kept.ledger === ledger && kept.transactions.length === transactions.length) return kept.parsed;
    if (transactions.length === 0) return Object.freeze([]);
    const adapter = await this.#adapter(ledger);
    const arrays = [...transactions];
    const parsed = timed("parse", () => Object.freeze(arrays.map((bytes, index) => adapter.parseTransaction(bytes, index))));
    // `block-parsed` reaches the main thread as plain data, so the adapter's parse is checked for that.
    this.#plain(parsed, (problem) => new TypeError(`the ${ledger} adapter parsed block ${block.height} into ${problem}, not plain data`));
    this.#kept.set(key, { height: block.height, ledger, transactions: arrays, parsed });
    return parsed;
  }

  /** The root of the genesis state `bytes`; the main thread compares it with the node's root at block 0. */
  async genesisRoot(ledger: LedgerName, bytes: Uint8Array): Promise<Uint8Array> {
    const adapter = await this.#adapter(ledger);
    const state = adapter.genesisState(bytes);
    try {
      return adapter.stateRoot(state);
    } finally {
      adapter.dispose(state);
    }
  }

  /** The kept transactions of `block`, as many as `count`; throws for a parse missing or of another size or ledger. */
  #transactions(block: BlockId, ledger: LedgerName, count: number): readonly Uint8Array[] {
    if (count === 0) return [];
    const kept = this.#kept.get(hexOf(block.hash));
    if (kept === undefined || kept.ledger !== ledger || kept.transactions.length !== count) {
      throw new Error(
        `block ${block.height}: the ledger worker parsed ${kept?.transactions.length ?? 0} transactions of it` +
          `${kept !== undefined && kept.ledger !== ledger ? ` with ${kept.ledger}` : ""}, not ${count}: core-block-parsed parses a block in the worker before its apply`,
      );
    }
    return kept.transactions;
  }

  /** The result of applying `input` to `state` (see the module comment), its batch persisting and releasing `keys`. */
  #applied(
    adapter: LedgerPackage,
    block: BlockId & { readonly ledger: LedgerName },
    state: StateHandle,
    input: ApplyInput,
    keys: Keys,
  ): Settled {
    const { state: after, output } = timed("adapterApply", () => adapter.apply(state, input));
    const settled = timed("settle", () => this.#settled(adapter, block, after, output, keys));
    endApply(block.height, input.transactions.length);
    return settled;
  }

  /**
   * `state` after `block` persisted, `keys.release` released and `keys.contracts`' keys persisted, flushed, and
   * described as plain data. When any of it throws, the package may hold a part of it, and the engine applies no block
   * afterwards (see the module comment).
   */
  #settled(
    adapter: LedgerPackage,
    block: BlockId & { readonly ledger: LedgerName },
    state: StateHandle,
    output: ApplyOutput,
    keys: Keys,
  ): Settled {
    try {
      return this.#settle(adapter, block, state, output, keys);
    } catch (error) {
      this.#failed = `the apply of block ${block.height} failed after its state was made (${error instanceof Error ? error.message : String(error)})`;
      throw error;
    }
  }

  /** {@link #settled}'s work. */
  #settle(
    adapter: LedgerPackage,
    block: BlockId & { readonly ledger: LedgerName },
    state: StateHandle,
    output: ApplyOutput,
    keys: Keys,
  ): Settled {
    const key = timed("stateKey", () => adapter.stateKey(state));
    this.#installStore(adapter, key);
    // Read before the flush, while every node of the state is still pending in memory (see the module comment).
    const stateRoot = timed("stateRoot", () => adapter.stateRoot(state));
    const summary = timed("summary", () => adapter.stateSummary(state));
    timed("persist", () => adapter.persist(key));
    const contracts = timed("contracts", () =>
      keys.contracts.map((address): ContractKeys => {
        const stateKey = adapter.contractStateKey(state, address);
        const zswapStateKey = adapter.contractZswapStateKey(state, address);
        if (stateKey !== null) adapter.persist(stateKey);
        if (zswapStateKey !== null) adapter.persist(zswapStateKey);
        return { address, stateKey, zswapStateKey };
      }),
    );
    timed("release", () => {
      for (const released of keys.release) adapter.release(released);
    });
    const batch = timed("flush", () => adapter.flush());
    const result: AppliedState = {
      ledger: block.ledger,
      height: block.height,
      hash: block.hash,
      stateKey: key,
      stateRoot,
      summary,
      output,
      batch,
      contracts,
    };
    return { result, state, key };
  }

  /**
   * Installs the node store in `adapter`'s package, once (see the module comment): the package's own `loadState` is
   * the one way to, so the state whose root key it was just given is loaded — from memory, where it still is — and
   * dropped.
   */
  #installStore(adapter: LedgerPackage, key: Uint8Array): void {
    if (this.#store === undefined || this.#installed.has(adapter)) return;
    adapter.dispose(adapter.load(key, this.#store));
    this.#installed.add(adapter);
  }

  /** Drops the pending states, if any. */
  #dropPending(): void {
    for (const pending of this.#pending) pending.adapter.dispose(pending.state);
    this.#pending = [];
  }

  /** Records `settled` as the newest pending state, after `block`, applied from `block` as its input. */
  #pend(adapter: LedgerPackage, block: BlockInput, settled: Settled): AppliedState {
    this.#pending.push({
      ...idOf(block),
      input: ownedInput(block),
      ledger: block.ledger,
      adapter,
      state: settled.state,
      key: settled.key,
      root: settled.result.stateRoot,
      result: settled.result,
      nodes: new Map(settled.result.batch.inserts.map((node) => [hexOf(node.key), node])),
    });
    return settled.result;
  }

  /**
   * The result of the pending block `input` names when it was applied from `input`, or undefined when the block is not
   * pending; a pending block asked for with another input is refused (see the module comment).
   */
  #pendingResult(input: BlockInput): AppliedState | undefined {
    const pending = this.#pending.find((held) => same(held, input));
    if (pending === undefined) return undefined;
    const differs = this.#checkSameInput ? inputDifferences(pending.input, input) : [];
    if (differs.length > 0) {
      throw new ApplyNeedsNewThread(
        `block ${input.height} is pending in this ledger worker thread, applied from another input (it differs in ` +
          `${differs.join(", ")}): the thread gives a pending block's result back only for the input it was applied from, ` +
          "and cannot apply the block anew, since its package counts the first apply's flush as stored",
      );
    }
    return pending.result;
  }

  /** Refuses the apply of block `height` once an apply failed after its state was made (see the module comment). */
  #refuseAfterFailure(height: bigint): void {
    if (this.#failed === null || !this.#refuseAfterFailedApply) return;
    throw new ApplyNeedsNewThread(
      `block ${height} cannot be applied in this ledger worker thread: ${this.#failed}, so its package may hold a part ` +
        "of that apply (a key persisted or released, a part of a flush), which the next flush would carry",
    );
  }

  /** The node store, which a load and a conversion read through; throws on the main thread, which has none. */
  #storeFor(what: string): NodeStore {
    if (this.#store === undefined) throw new Error(`the ledger engine has no node store to ${what} from (the main thread has none)`);
    return this.#store;
  }

  /** Applies block 0 (see the module comment). */
  async genesis(input: GenesisBlock): Promise<AppliedState> {
    const again = this.#pendingResult(input);
    if (again !== undefined) return again;
    if (input.height !== 0n) throw new RangeError(`the genesis apply is block 0's, not block ${input.height}'s`);
    if (this.#committed !== null) {
      throw new Error(`block 0 cannot be applied: the ledger worker holds the state at ${this.#committed.height} already`);
    }
    this.#refuseAfterFailure(0n);
    this.#dropPending();
    const adapter = await this.#adapter(input.ledger);
    const transactions = this.#transactions(input, input.ledger, input.transactions);
    const block: ApplyInput = {
      transactions: [...transactions],
      ...(input.outcomes === undefined ? {} : { outcomes: input.outcomes }),
      height: 0n,
      hash: input.hash,
      parentHash: input.parentHash,
      timestampMs: input.timestampMs,
      parentTimestampMs: input.timestampMs,
      firstRegularAtParentTime: false,
    };
    const genesis = adapter.genesisState(input.genesisState);
    let settled: Settled;
    try {
      if (input.includesBlockZero) {
        const empty = adapter.emptyState(adapter.networkIdOf(genesis));
        try {
          const { state: after, output } = adapter.apply(empty, block);
          adapter.dispose(after);
          settled = this.#settled(adapter, input, genesis, output, NO_KEYS);
        } finally {
          adapter.dispose(empty);
        }
      } else {
        settled = this.#applied(adapter, input, genesis, block, NO_KEYS);
        adapter.dispose(genesis);
      }
    } catch (error) {
      adapter.dispose(genesis);
      throw error;
    }
    return this.#pend(adapter, input, settled);
  }

  /** Applies a block after 0 (see the module comment). */
  async apply(input: ApplyBlock): Promise<AppliedState> {
    const again = this.#pendingResult(input);
    if (again !== undefined) return again;
    this.#refuseAfterFailure(input.height);
    if (input.ahead === true && this.#pending.length > 0) return this.#applyAhead(input);
    const committed = this.#committed;
    if (committed === null) {
      throw new Error(`block ${input.height} cannot be applied: the ledger worker holds no state (the stored state at h − 1 is loaded first)`);
    }
    if (committed.height !== input.height - 1n) {
      throw new Error(`block ${input.height} cannot be applied: the ledger worker holds the state at ${committed.height}, not ${input.height - 1n}`);
    }
    if (!sameBytes(committed.hash, input.parentHash)) {
      throw new Error(`block ${input.height} cannot be applied: its parent is not block ${committed.height}, whose state the ledger worker holds`);
    }
    const converts = convertsFromV8(committed.ledger, input.ledger);
    const carries = V9_CARRIES.some(([from, to]) => committed.ledger === from && input.ledger === to);
    if (committed.ledger !== input.ledger && !converts && !carries) {
      throw new Error(
        `block ${input.height} is a ${input.ledger} block on a ${committed.ledger} state: the ledger worker changes a ` +
          "state's ledger only at an upgrade's first block, from v8 to v9 or v9-rc5 (a conversion: v8 → v9) and from an " +
          "earlier v9 build to a later one (v9-rc3 → v9-rc5, v9-rc3 → v9, v9-rc5 → v9)",
      );
    }
    const transactions = this.#transactions(input, input.ledger, input.transactions);
    this.#dropPending();
    const block: ApplyInput = {
      transactions: [...transactions],
      ...(input.outcomes === undefined ? {} : { outcomes: input.outcomes }),
      height: input.height,
      hash: input.hash,
      parentHash: input.parentHash,
      timestampMs: input.timestampMs,
      parentTimestampMs: input.parentTimestampMs,
      firstRegularAtParentTime: input.firstRegularAtParentTime,
    };
    const keys: Keys = { release: input.release ?? [committed.key], contracts: input.contracts ?? [] };
    if (!converts && !carries) {
      return this.#pend(committed.adapter, input, this.#applied(committed.adapter, input, committed.state, block, keys));
    }
    const adapter = await this.#adapter(input.ledger);
    let state: StateHandle;
    if (carries) {
      // An upgrade within v9: the state at U loaded in F's package by its key, then F applied to it.
      state = adapter.load(committed.key, this.#storeFor(`carry the ${committed.ledger} state into ${input.ledger}`));
    } else {
      // The v8 state at U is converted first, then F is applied to it (see the module comment).
      const convert = adapter.convertFromV8;
      if (convert === undefined) throw new Error(`the ledger ${input.ledger} adapter has no convertFromV8`);
      state = convert(committed.key, this.#storeFor("convert the v8 state"));
    }
    this.#installed.add(adapter);
    try {
      return this.#pend(adapter, input, this.#applied(adapter, input, state, block, keys));
    } finally {
      adapter.dispose(state);
    }
  }

  /**
   * Applies `input` ahead (see the module comment): on the newest pending state, which must be its parent's and of its
   * ledger. Its batch releases what {@link ApplyBlock.release} names, or that pending state's key.
   */
  #applyAhead(input: ApplyBlock): AppliedState {
    const parent = this.#pending.at(-1) as Held;
    if (parent.height !== input.height - 1n || !sameBytes(parent.hash, input.parentHash)) {
      throw new Error(`block ${input.height} cannot be applied ahead: the ledger worker's newest pending block is ${parent.height}, which is not its parent`);
    }
    if (parent.ledger !== input.ledger) {
      throw new Error(`block ${input.height} cannot be applied ahead: it is a ${input.ledger} block on a ${parent.ledger} state, and a change of ledger is never applied ahead`);
    }
    const transactions = this.#transactions(input, input.ledger, input.transactions);
    const block: ApplyInput = {
      transactions: [...transactions],
      ...(input.outcomes === undefined ? {} : { outcomes: input.outcomes }),
      height: input.height,
      hash: input.hash,
      parentHash: input.parentHash,
      timestampMs: input.timestampMs,
      parentTimestampMs: input.parentTimestampMs,
      firstRegularAtParentTime: input.firstRegularAtParentTime,
    };
    const keys: Keys = { release: input.release ?? [parent.key], contracts: input.contracts ?? [] };
    return this.#pend(parent.adapter, input, this.#applied(parent.adapter, input, parent.state, block, keys));
  }

  /**
   * `block` committed (the host sends it once the `COMMIT` that holds the block answered): its pending state, the
   * oldest, becomes the committed one, and the block applied ahead on it stays pending. False when it is not the oldest
   * pending block.
   */
  commit(block: BlockId): boolean {
    const [pending] = this.#pending;
    if (pending === undefined || !same(pending, block)) return false;
    if (this.#committed !== null) this.#committed.adapter.dispose(this.#committed.state);
    this.#committed = {
      ...idOf(pending),
      ledger: pending.ledger,
      adapter: pending.adapter,
      state: pending.state,
      key: pending.key,
      root: pending.root,
    };
    this.#pending.shift();
    return true;
  }

  /**
   * Drops the kept parses at heights up to `upTo` and of the blocks `hashes` names, their native objects freed (task
   * 12.5: see {@link LedgerEngine.evict}); returns how many it dropped.
   */
  async release(drop: { readonly upTo?: bigint; readonly hashes?: readonly Uint8Array[] }): Promise<number> {
    const named = new Set((drop.hashes ?? []).map(hexOf));
    let dropped = 0;
    for (const [key, kept] of [...this.#kept]) {
      if (named.has(key) || (drop.upTo !== undefined && kept.height <= drop.upTo)) {
        this.#kept.delete(key);
        await this.#forget(kept);
        dropped += 1;
      }
    }
    return dropped;
  }

  /** Frees the native objects of a kept parse (its arrays and plain data stay where they are kept). */
  async #forget(kept: Kept): Promise<void> {
    const adapter = await this.#adapters.get(kept.ledger)?.catch(() => undefined);
    adapter?.forgetTransactions(kept.transactions);
  }

  /**
   * Makes the state the database stores for block `input`, by its key, the committed state (see the module comment):
   * the state held already when it is that block's with that key, else one read through the node store.
   */
  async load(input: LoadState): Promise<LoadedState> {
    const holds = (held: Held | null): boolean =>
      held !== null && same(held, input) && held.ledger === input.ledger && sameBytes(held.key, input.stateKey);
    const before = this.#committed;
    const pending = this.#pending[0] ?? null;
    if (before !== null && holds(before)) return { stateRoot: before.root, loaded: false };
    if (pending !== null && holds(pending)) {
      this.commit(input);
      return { stateRoot: pending.root, loaded: false };
    }
    const store = this.#storeFor("load a state");
    const adapter = await this.#adapter(input.ledger);
    const state = adapter.load(input.stateKey, store);
    this.#installed.add(adapter);
    this.#dropPending();
    if (this.#committed !== null) this.#committed.adapter.dispose(this.#committed.state);
    const root = adapter.stateRoot(state);
    this.#committed = { ...idOf(input), ledger: input.ledger, adapter, state, key: input.stateKey, root };
    return { stateRoot: root, loaded: true };
  }

  /**
   * Drops the nodes reclamation deletes from every loaded package's caches, so a later block that needs one again
   * flushes it again. When the package refuses (a live object still holds one), the kept parses' native objects are
   * freed and the eviction is tried once more. A second refusal rejects with {@link EvictionRefused}; the main thread
   * answers by ending this thread and starting a new one. A trap is never retried.
   */
  async evict(keys: readonly Uint8Array[]): Promise<number> {
    if (keys.length === 0) return 0;
    let packages = 0;
    for (const loading of [...this.#adapters.values()]) {
      const adapter = await loading.catch(() => undefined);
      if (adapter === undefined) continue;
      try {
        adapter.evict([...keys]);
      } catch (first) {
        if (first instanceof WebAssembly.RuntimeError) throw first;
        // A live object holds one: reclamation keeps what the held states reach through the stored child lists, so
        // it is a kept parse's (a later block's transaction carrying the same value) or, should one hold it, an
        // object nothing here can reach, or one holding it by reference where the stored lists embed it. The kept
        // parses' native objects are freed — the block's apply parses them again — and the eviction tried once more.
        for (const kept of this.#kept.values()) await this.#forget(kept);
        try {
          adapter.evict([...keys]);
        } catch (second) {
          if (second instanceof WebAssembly.RuntimeError) throw second;
          throw new EvictionRefused(
            `the ${adapter.ledger} package refuses to forget ${keys.length} swept node(s) after the ledger worker freed ` +
              `every kept parse's native objects: ${second instanceof Error ? second.message : String(second)}`,
          );
        }
      }
      packages += 1;
    }
    return packages;
  }

  /**
   * Runs one module's ledger tasks for block `input` and returns their results by task name. Each task runs on the
   * block's kept parse: its native objects, `rawPackages()` of its ledger and, for a task that declares `needsState`,
   * the committed state, which must be the state before the block. Each result is checked as plain data. A task that
   * throws, returns anything else, or that the worker's entry does not give fails with {@link LedgerTaskFailed}; a trap
   * is thrown as it is (the worker ends).
   */
  async tasks(input: TaskRun): Promise<Readonly<Record<string, unknown>>> {
    const declared = this.#tasks.get(input.module);
    const named = input.tasks.map((name) => {
      const task = declared?.find((candidate) => candidate.name === name);
      if (task === undefined) {
        throw new LedgerTaskFailed(
          input.module,
          name,
          input.height,
          "is not one the ledger worker has: its entry gives the worker the modules the host ships, with their tasks " +
            "(runLedgerWorker(modules))",
        );
      }
      return task;
    });
    const adapter = await this.#adapter(input.ledger);
    const kept = this.#transactions(input, input.ledger, input.transactions);
    const transactions = Object.freeze(kept.map((bytes) => adapter.nativeTransaction(bytes)));
    const packages = adapter.rawPackages();
    const results: Record<string, unknown> = {};
    for (const task of named) {
      // Block 0 has no state before it (the genesis state is made in its apply), so such a task gets none there.
      const stateBefore = task.needsState && input.height > 0n ? this.#stateBefore(input, task.name) : undefined;
      let result: unknown;
      try {
        result = await task.run(
          Object.freeze({
            height: input.height,
            hash: input.hash,
            ledger: input.ledger,
            transactions,
            packages,
            ...(stateBefore === undefined ? {} : { stateBefore }),
          }),
        );
      } catch (error) {
        if (error instanceof WebAssembly.RuntimeError) throw error;
        throw new LedgerTaskFailed(input.module, task.name, input.height, `threw: ${error instanceof Error ? error.message : String(error)}`);
      }
      results[task.name] = this.#plain(
        result,
        (problem) =>
          new LedgerTaskFailed(
            input.module,
            task.name,
            input.height,
            `returned ${problem}: a task returns structured-cloneable plain data, never a ledger package's object`,
          ),
      );
    }
    return results;
  }

  /** The state before block `input` for its task `task`: the committed state, which must be at h − 1. */
  #stateBefore(input: TaskRun, task: string): StateHandle {
    const committed = this.#committed;
    if (committed === null || committed.height !== input.height - 1n || !sameBytes(committed.hash, input.parentHash)) {
      throw new LedgerTaskFailed(
        input.module,
        task,
        input.height,
        `needs the state before the block, and the ledger worker holds ${committed === null ? "no state" : `the state at ${committed.height}`}` +
          " (core-ledger-state's on-compute has it hold that state)",
      );
    }
    return committed.state;
  }

  /** A retained state's root: the state is loaded by its key beside the held ones, then dropped. */
  async retained(input: LoadState): Promise<{ readonly stateRoot: Uint8Array }> {
    const store = this.#storeFor("load a retained state");
    const adapter = await this.#adapter(input.ledger);
    const state = adapter.load(input.stateKey, store);
    this.#installed.add(adapter);
    try {
      return { stateRoot: adapter.stateRoot(state) };
    } finally {
      adapter.dispose(state);
    }
  }

  /**
   * A node a pending block's batch inserts, or undefined: the database holds it only once the block committed, so the
   * worker's node store serves it from here (`./node-bridge.ts`); a retried height's batch, rolled back, too.
   */
  pendingNode(key: Uint8Array): StoredNode | undefined {
    if (this.#pending.length === 0) return undefined;
    const wanted = hexOf(key);
    for (const pending of this.#pending) {
      const node = pending.nodes.get(wanted);
      if (node !== undefined) return node;
    }
    return undefined;
  }

  /** What the engine holds now. */
  holds(): EngineHolding {
    const parsed = [...this.#kept]
      .sort(([a, x], [b, y]) => (x.height < y.height ? -1 : x.height > y.height ? 1 : a < b ? -1 : a > b ? 1 : 0))
      .map(([key]) => key);
    return Object.freeze({
      committed: this.#committed === null ? null : idOf(this.#committed),
      pending: this.#pending[0] === undefined ? null : idOf(this.#pending[0]),
      ahead: Object.freeze(this.#pending.slice(1).map(idOf)),
      parsed: Object.freeze(parsed),
    });
  }
}
