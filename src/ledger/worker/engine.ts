/**
 * The ledger worker's work (`openspec/changes/core-arch/design.md` §5.1, §5.3, §5.5; `specs/ledger/spec.md` LG-7, LG-8,
 * LG-11, LG-15, LG-16; `specs/ingest/spec.md` IN-7; task 12.3): what the worker thread does for the main thread, kept
 * apart from the thread's messaging (`./entry.ts`) so that it runs the same in a worker and — for a negative control
 * and the tests — in the main thread (`./host.ts`'s `inThreadLedger`).
 *
 * **Adapters.** One per ledger version, loaded the first time a request names it (`load`, `loadLedgerPackage` in the
 * worker), again after a failed load. They are made with {@link PARSE_NETWORK_ID}: the network id serves one thing,
 * block 0's empty state, which takes the genesis state's own id ({@link LedgerEngine.genesis}).
 *
 * **Parse once (LG-7).** {@link LedgerEngine.parse} parses a block's transactions with its ledger's adapter and keeps
 * the very arrays it parsed, under the block's hash, until the block is applied and released
 * ({@link LedgerEngine.release}): the adapter keeps each native object under its array (`../adapter.ts`), so the
 * block's apply and its ledger tasks find them and parse nothing again. A block parsed again (a retried height) gets the
 * kept parse back. Only plain data leaves (Q49): the parse is checked as such (`../plain-data.ts`).
 *
 * **Ledger tasks (LG-17; task 12.6).** {@link LedgerEngine.tasks} runs a module's tasks — given by the worker's entry,
 * `./run.ts` — on a block's kept parse: each with the native objects, `rawPackages()` and, for a task that declares
 * `needsState`, the committed state, which must be the state before the block; each result checked as plain data. A
 * task that throws or returns anything else fails the request with {@link LedgerTaskFailed}, naming the module and the
 * task; a trap ends the worker, as an apply's does.
 *
 * **The states.** The engine holds the state committed at a height — its cursor's — and at most one pending state, the
 * one after the block applied last and not yet committed ({@link LedgerEngine.commit}, called once the block's
 * transaction committed). {@link LedgerEngine.apply} applies a block on the committed state at h − 1 only — of the
 * block's ledger, its parent hash the committed block's — and refuses anything else, naming what it holds. The same
 * block applied again while pending — a height whose transaction was lost and is processed again — gets the same result
 * back, batch included: the database rolled back, so the batch is still to be written, and the nodes it holds are
 * already stored in the package's memory, so a second apply would flush none of them. A pending state for another block
 * is dropped.
 *
 * **The state at h − 1 from the database (LG-11; task 12.4).** {@link LedgerEngine.load} makes the state the database
 * stores for a block — its key, `core_ledger_state.states.state_key` — the committed one: at once when it holds it
 * already (committed, or pending and committed since in the database, whose commit has not reached it), else read
 * through the node store from its key, as after a restart, the pending block then dropped. `core-ledger-state` asks it
 * for the state at h − 1 before every apply, so a restarted process — a fresh worker, which holds nothing — loads the
 * state at the cursor once, and one that runs on reads nothing.
 *
 * **The v8 → v9 conversion (LG-9; task 12.4).** A block of ledger v9 on a committed v8 state is the first block F a v9
 * runtime built after v8 blocks: the engine converts the state first — the v9 package's `convertFromV8`, the ledger
 * team's translation shipped with the vendored v9, reading the v8 state's nodes from the node store by its key (the
 * state at U is committed, so its nodes are in the database) — and then applies F to the converted state, as the node
 * and the official indexer do, also when F has no transaction; F's batch is the v9 package's (the converted state's new
 * nodes with F's, the v9 key persisted, the released keys — the v8 state's among them — released).
 *
 * **The 2.0 → 2.1 upgrade (LG-3; task 12.2a, owner decision Q139 A, A159).** A block of ledger v9 (rc.5, runtime 2.1 on)
 * on a committed `v9-rc3` state (v9 as runtime 2.0 built it) is F of that upgrade: the two packages share one storage
 * format, so the engine loads the state at U in the rc.5 package by its key from the node store — as a restart loads a
 * stored state (its nodes are in the database: U is committed) — and applies F to it; F's batch is the rc.5 package's,
 * as at a conversion. Any other change of ledger is refused: no conversion to rc.3 exists (the node that builds it,
 * `midnight-node` 2.0.0-rc.4, carries none), and none goes back.
 *
 * **What a block gives** ({@link AppliedState}): the state's key and root (LG-15: the main thread compares the root
 * with the node's), its summary (LG-16), the adapter's output (results, events, logs, parameters) and the batch the
 * block writes (LG-11): the new state's key persisted, the keys {@link ApplyBlock.release} names released (LG-12's
 * window, which the main thread computes; the state before the block when none is given), and the state and
 * zswap-state keys of each contract {@link ApplyBlock.contracts} names persisted and never released (LG-13), flushed
 * with the nodes they reach; and each such contract's keys ({@link ContractKeys}).
 *
 * **A retained state** ({@link LedgerEngine.retained}; LG-12) is loaded by its key aside, its root read and the state
 * dropped: the states the engine holds are left as they are.
 *
 * **Eviction** ({@link LedgerEngine.evict}; LG-14, task 12.5): the nodes the sweep deletes are forgotten by every
 * loaded package, so a node needed again is flushed again. A package refuses to forget a node a live object holds; the
 * states the engine holds never hold a deleted node (the sweep marks them), so the engine frees a kept parse's native
 * objects when it drops the parse, and, should a later block's kept transaction still hold one, frees every kept
 * parse's native objects and tries again (those transactions are parsed again at their apply). A refusal after that
 * rejects with {@link EvictionRefused}: an object this thread cannot reach holds the node, and the main thread ends the
 * thread, starts a new one, and applies the block again there on the state at h − 1 loaded from the database (owner
 * decision Q144 B, task 12.5a; `./host.ts`'s `restart`).
 *
 * **The node store is installed from the first block on** (in the worker: the bridge's). A flushed node is a stored
 * node to the package, whose cache may then drop its bytes while the state still uses it; it reads them again, when it
 * serializes something of the state, from the store — the database, which holds every flushed node from the block's
 * commit on. Without a store the package aborts there ("Arena should contain current serialization target", seen at
 * preview's block 3,772). The package installs a store only in `loadState`, so the engine loads the state it just made
 * by its key once per package (in memory: no read) and drops that copy. A state's root and summary are read before the
 * flush, while its nodes are pending in memory: the database holds a block's nodes only once the block committed.
 *
 * **Block 0 (IN-7)** ({@link LedgerEngine.genesis}): the genesis state is `system_properties.genesis_state`; the main
 * thread, which holds the node's root at block 0, says whether it includes block 0's transactions (`includesBlockZero`:
 * its root is the node's, {@link LedgerEngine.genesisRoot}). If it does they are applied to an empty state of the
 * genesis state's network id for their results only, and the genesis state is the state after block 0; otherwise they
 * are applied to it. Block 0's parent time is its own (IN-7, the official indexer) and its first regular transaction
 * gets no bump (LG-8).
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

/** What loads an adapter: `loadLedgerPackage`, or a test package's loader. */
export type LedgerLoader = (ledger: LedgerName, options: LedgerPackageOptions) => Promise<LedgerPackage>;

/** The network id the engine's adapters are made with: parsing and applying read none (see the module comment). */
export const PARSE_NETWORK_ID = "undeployed";

/** The name of {@link EvictionRefused}, which an error keeps when it crosses from the worker (`./host.ts`'s `errorOf`). */
export const EVICTION_REFUSED = "EvictionRefused";

/**
 * A package still refusing to forget a swept node after the worker freed what it can (LG-14; see
 * {@link LedgerEngine.evict}): the main thread ends the worker thread and applies the block again in a new one (owner
 * decision Q144 B, task 12.5a).
 */
export class EvictionRefused extends Error {
  constructor(message: string) {
    super(message);
    this.name = EVICTION_REFUSED;
  }
}

/** The name of {@link LedgerTaskFailed}, which an error keeps when it crosses from the worker. */
export const LEDGER_TASK_FAILED = "LedgerTaskFailed";

/** A module's ledger task that failed a block (LG-17; see {@link LedgerEngine.tasks}), naming the module and the task. */
export class LedgerTaskFailed extends Error {
  constructor(module: string, task: string, height: bigint, why: string) {
    super(`the ledger task ${task} of ${module} at block ${height} ${why} (LG-17)`);
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

/** What the apply of a block after 0 takes: the block, its time and its parent's, LG-8's rule and its outcomes. */
export interface ApplyBlock extends BlockId {
  readonly ledger: LedgerName;
  readonly parentHash: Uint8Array;
  readonly timestampMs: bigint;
  readonly parentTimestampMs: bigint;
  readonly firstRegularAtParentTime: boolean;
  /** How many transactions the block holds: the parse kept must have as many. */
  readonly transactions: number;
  /** The chain's outcome of each, `tx-results` (task 12.1a); absent: every transaction replayed. */
  readonly outcomes?: readonly ChainOutcome[];
  /**
   * The keys of the stored states the block releases (LG-12's window: the states leaving it, task 12.4), each released
   * once in the block's batch; absent: the state before the block (`retainStates` 0).
   */
  readonly release?: readonly Uint8Array[];
  /** The contracts whose state and zswap-state keys the block persists, never to be released (LG-13, task 12.4). */
  readonly contracts?: readonly Uint8Array[];
}

/** A contract's keys after a block (LG-13): null for a contract the state does not hold. */
export interface ContractKeys {
  readonly address: Uint8Array;
  readonly stateKey: Uint8Array | null;
  readonly zswapStateKey: Uint8Array | null;
}

/** A module as the ledger worker needs it (LG-17; task 12.6): its id and its ledger tasks (its declaration is one). */
export interface LedgerWorkerModule {
  readonly id: string;
  readonly ledgerTasks?: readonly LedgerTask[];
}

/** The ledger tasks of `modules`, by module id (a module listed twice: its last listing's); throws for a non-module. */
export function ledgerTasksOf(modules: readonly LedgerWorkerModule[]): Map<string, readonly LedgerTask[]> {
  const tasks = new Map<string, readonly LedgerTask[]>();
  for (const module of modules) {
    if (module === null || typeof module !== "object" || typeof module.id !== "string") {
      throw new TypeError("the ledger worker takes the modules the host ships: each a declaration, with its id (MD-1)");
    }
    tasks.set(module.id, Object.freeze([...(module.ledgerTasks ?? [])]));
  }
  return tasks;
}

/** A block's ledger tasks of one module, as the main thread names them (LG-17; task 12.6; `../tasks.ts`). */
export interface TaskRun extends BlockId {
  readonly ledger: LedgerName;
  readonly parentHash: Uint8Array;
  /** How many transactions `block-parsed` holds: the parse kept must have as many. */
  readonly transactions: number;
  readonly module: string;
  /** The tasks' names, in the module's order. */
  readonly tasks: readonly string[];
}

/** What block 0's apply takes (IN-7). */
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

/** A stored state, by the block it is after and its key (LG-11, LG-12: the restart's load, a retained state's). */
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
  /** The keys of each contract {@link ApplyBlock.contracts} named, in its order (LG-13); none for block 0. */
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
  readonly pending: BlockId | null;
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

/** Block 0's keys: nothing released, no contract. */
const NO_KEYS: Keys = Object.freeze({ release: [], contracts: [] });

/** The ledger worker's engine (see the module comment). */
export class LedgerEngine {
  readonly #load: LedgerLoader;
  readonly #store: NodeStore | undefined;
  readonly #tasks: ReadonlyMap<string, readonly LedgerTask[]>;
  readonly #checkPlainData: boolean;
  readonly #adapters = new Map<LedgerName, Promise<LedgerPackage>>();
  readonly #kept = new Map<string, Kept>();
  /** The adapters whose package has the node store installed. */
  readonly #installed = new WeakSet<LedgerPackage>();
  #committed: Held | null = null;
  #pending: (Held & { readonly result: AppliedState }) | null = null;

  constructor(options: EngineOptions) {
    this.#load = options.load;
    this.#store = options.store;
    this.#tasks = options.tasks ?? new Map();
    this.#checkPlainData = options.checkPlainData !== false;
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

  /** Block `block`'s transactions parsed once with `ledger`'s adapter and kept for its apply (LG-7). */
  async parse(ledger: LedgerName, block: BlockId, transactions: readonly Uint8Array[]): Promise<readonly ParsedTransaction[]> {
    const key = hexOf(block.hash);
    const kept = this.#kept.get(key);
    if (kept !== undefined && kept.ledger === ledger && kept.transactions.length === transactions.length) return kept.parsed;
    if (transactions.length === 0) return Object.freeze([]);
    const adapter = await this.#adapter(ledger);
    const arrays = [...transactions];
    const parsed = Object.freeze(arrays.map((bytes, index) => adapter.parseTransaction(bytes, index)));
    // `block-parsed` reaches the main thread as plain data (LG-7, Q49): the adapter's parse is checked as such.
    this.#plain(parsed, (problem) => new TypeError(`the ${ledger} adapter parsed block ${block.height} into ${problem}, not plain data (LG-7)`));
    this.#kept.set(key, { height: block.height, ledger, transactions: arrays, parsed });
    return parsed;
  }

  /** The root of the genesis state `bytes` (IN-7: compared with the node's at block 0 on the main thread). */
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
          `${kept !== undefined && kept.ledger !== ledger ? ` with ${kept.ledger}` : ""}, not ${count}: core-block-parsed parses a block in the worker before its apply (LG-7)`,
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
    const { state: after, output } = adapter.apply(state, input);
    return this.#settled(adapter, block, after, output, keys);
  }

  /**
   * `state` after `block` persisted, `keys.release` released and `keys.contracts`' keys persisted, flushed, and
   * described as plain data.
   */
  #settled(
    adapter: LedgerPackage,
    block: BlockId & { readonly ledger: LedgerName },
    state: StateHandle,
    output: ApplyOutput,
    keys: Keys,
  ): Settled {
    const key = adapter.stateKey(state);
    this.#installStore(adapter, key);
    // Read before the flush, while every node of the state is still pending in memory (see the module comment).
    const stateRoot = adapter.stateRoot(state);
    const summary = adapter.stateSummary(state);
    adapter.persist(key);
    const contracts = keys.contracts.map((address): ContractKeys => {
      const stateKey = adapter.contractStateKey(state, address);
      const zswapStateKey = adapter.contractZswapStateKey(state, address);
      if (stateKey !== null) adapter.persist(stateKey);
      if (zswapStateKey !== null) adapter.persist(zswapStateKey);
      return { address, stateKey, zswapStateKey };
    });
    for (const released of keys.release) adapter.release(released);
    const batch = adapter.flush();
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

  /** Drops the pending state, if any. */
  #dropPending(): void {
    if (this.#pending === null) return;
    this.#pending.adapter.dispose(this.#pending.state);
    this.#pending = null;
  }

  /** Records `settled` as the pending state after `block`. */
  #pend(adapter: LedgerPackage, block: BlockId & { readonly ledger: LedgerName }, settled: Settled): AppliedState {
    this.#pending = {
      ...idOf(block),
      ledger: block.ledger,
      adapter,
      state: settled.state,
      key: settled.key,
      root: settled.result.stateRoot,
      result: settled.result,
    };
    return settled.result;
  }

  /** The node store, which a load and a conversion read through; throws on the main thread, which has none. */
  #storeFor(what: string): NodeStore {
    if (this.#store === undefined) throw new Error(`the ledger engine has no node store to ${what} from (the main thread has none)`);
    return this.#store;
  }

  /** Block 0 (IN-7; see the module comment). */
  async genesis(input: GenesisBlock): Promise<AppliedState> {
    if (this.#pending !== null && same(this.#pending, input)) return this.#pending.result;
    if (input.height !== 0n) throw new RangeError(`the genesis apply is block 0's, not block ${input.height}'s`);
    if (this.#committed !== null) {
      throw new Error(`block 0 cannot be applied: the ledger worker holds the state at ${this.#committed.height} already`);
    }
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

  /** A block after 0 (LG-8; see the module comment). */
  async apply(input: ApplyBlock): Promise<AppliedState> {
    if (this.#pending !== null && same(this.#pending, input)) return this.#pending.result;
    const committed = this.#committed;
    if (committed === null) {
      throw new Error(`block ${input.height} cannot be applied: the ledger worker holds no state (the stored state at h − 1 is loaded first, LG-11)`);
    }
    if (committed.height !== input.height - 1n) {
      throw new Error(`block ${input.height} cannot be applied: the ledger worker holds the state at ${committed.height}, not ${input.height - 1n}`);
    }
    if (!sameBytes(committed.hash, input.parentHash)) {
      throw new Error(`block ${input.height} cannot be applied: its parent is not block ${committed.height}, whose state the ledger worker holds`);
    }
    const converts = committed.ledger === "v8" && input.ledger === "v9";
    const carries = committed.ledger === "v9-rc3" && input.ledger === "v9";
    if (committed.ledger !== input.ledger && !converts && !carries) {
      throw new Error(
        `block ${input.height} is a ${input.ledger} block on a ${committed.ledger} state: the ledger worker changes a ` +
          "state's ledger only at an upgrade's first block, from v8 to v9 (LG-9: v8 → v9) and from v9-rc3 to v9 " +
          "(a 2.0 → 2.1 upgrade: v9-rc3 → v9)",
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
    const adapter = await this.#adapter("v9");
    let state: StateHandle;
    if (carries) {
      // A 2.0 → 2.1 upgrade: the rc.3 state at U loaded in the rc.5 package by its key, then F applied to it.
      state = adapter.load(committed.key, this.#storeFor("carry the v9-rc3 state into v9"));
    } else {
      // LG-9: the v8 state at U converted first, then F applied to it (see the module comment).
      const convert = adapter.convertFromV8;
      if (convert === undefined) throw new Error("the ledger v9 adapter has no convertFromV8 (LG-9)");
      state = convert(committed.key, this.#storeFor("convert the v8 state"));
    }
    this.#installed.add(adapter);
    try {
      return this.#pend(adapter, input, this.#applied(adapter, input, state, block, keys));
    } finally {
      adapter.dispose(state);
    }
  }

  /** `block` committed (its `on-after-db-write`): its pending state becomes the committed one. False when not pending. */
  commit(block: BlockId): boolean {
    const pending = this.#pending;
    if (pending === null || !same(pending, block)) return false;
    if (this.#committed !== null) this.#committed.adapter.dispose(this.#committed.state);
    this.#committed = {
      ...idOf(pending),
      ledger: pending.ledger,
      adapter: pending.adapter,
      state: pending.state,
      key: pending.key,
      root: pending.root,
    };
    this.#pending = null;
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
   * The state the database stores for block `input`, by its key, as the committed state (LG-11; see the module
   * comment): the one held already when it is that block's with that key, else read through the node store.
   */
  async load(input: LoadState): Promise<LoadedState> {
    const holds = (held: Held | null): boolean =>
      held !== null && same(held, input) && held.ledger === input.ledger && sameBytes(held.key, input.stateKey);
    const { committed: before, pending } = { committed: this.#committed, pending: this.#pending };
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
   * Drops the nodes the sweep deletes from every loaded package's caches (LG-14, task 12.5), so a later block that needs
   * one again flushes it again. When the package refuses — a live object still holds one — the kept parses' native
   * objects are freed and the eviction tried once more; a refusal then rejects with {@link EvictionRefused}, which the
   * main thread answers by ending this thread and starting a new one (Q144 B, task 12.5a). A trap is never retried.
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
        // A live object holds one: the states the engine holds are marked, so it is a kept parse's (a later block's
        // transaction carrying the same value) or, should one hold it, an object nothing here can reach. The kept
        // parses' native objects are freed — the block's apply parses them again — and the eviction tried once more.
        for (const kept of this.#kept.values()) await this.#forget(kept);
        try {
          adapter.evict([...keys]);
        } catch (second) {
          if (second instanceof WebAssembly.RuntimeError) throw second;
          throw new EvictionRefused(
            `the ${adapter.ledger} package refuses to forget ${keys.length} swept node(s) after the ledger worker freed ` +
              `every kept parse's native objects: ${second instanceof Error ? second.message : String(second)} (LG-14)`,
          );
        }
      }
      packages += 1;
    }
    return packages;
  }

  /**
   * Block `input`'s ledger tasks of one module (LG-17; task 12.6): each run on the block's kept parse — its native
   * objects, `rawPackages()` of its ledger and, for a task that declares `needsState`, the committed state, which must be
   * the state before the block — and its result checked as plain data; by task name. A task that throws, returns
   * anything else, or that the worker's entry does not give fails with {@link LedgerTaskFailed}; a trap is thrown as it
   * is (the worker ends).
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
            "(runLedgerWorker(modules), MD-1)",
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
      // Block 0 has no state before it (IN-7: the genesis state is made in its apply): such a task gets none there.
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
            `returned ${problem}: a task returns structured-cloneable plain data, never a ledger package's object (Q49)`,
          ),
      );
    }
    return results;
  }

  /** The state before block `input` for its task `task`: the committed state, which must be at h − 1 (LG-17). */
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

  /** A retained state's root, the state loaded by its key aside and dropped (LG-12; see the module comment). */
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
   * A node the pending block's batch inserts, or undefined: the database holds it only once the block committed, so the
   * worker's node store serves it from here (`./node-bridge.ts`); a retried height's batch, rolled back, too.
   */
  pendingNode(key: Uint8Array): StoredNode | undefined {
    const pending = this.#pending;
    if (pending === null) return undefined;
    const wanted = hexOf(key);
    return pending.result.batch.inserts.find((node) => hexOf(node.key) === wanted);
  }

  /** What the engine holds now. */
  holds(): EngineHolding {
    const parsed = [...this.#kept]
      .sort(([a, x], [b, y]) => (x.height < y.height ? -1 : x.height > y.height ? 1 : a < b ? -1 : a > b ? 1 : 0))
      .map(([key]) => key);
    return Object.freeze({
      committed: this.#committed === null ? null : idOf(this.#committed),
      pending: this.#pending === null ? null : idOf(this.#pending),
      parsed: Object.freeze(parsed),
    });
  }
}
