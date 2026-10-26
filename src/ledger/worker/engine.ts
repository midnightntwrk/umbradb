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
 * block's apply — and task 12.6's ledger tasks — find them and parse nothing again. A block parsed again (a retried
 * height) gets the kept parse back. Only plain data leaves (Q49).
 *
 * **The states.** The engine holds the state committed at a height — its cursor's — and at most one pending state, the
 * one after the block applied last and not yet committed ({@link LedgerEngine.commit}, called once the block's
 * transaction committed). {@link LedgerEngine.apply} applies a block on the committed state at h − 1 only — of the
 * block's ledger, its parent hash the committed block's — and refuses anything else, naming what it holds: a state to
 * load from the database first (a restart) is task 12.4's (`load`, the bridge's, is its seam), and so is a block of
 * another ledger than the state's (the v8 → v9 conversion, LG-9). The same block applied again while pending — a height
 * whose transaction was lost and is processed again — gets the same result back, batch included: the database rolled
 * back, so the batch is still to be written, and the nodes it holds are already stored in the package's memory, so a
 * second apply would flush none of them. A pending state for another block is dropped.
 *
 * **What a block gives** ({@link AppliedState}): the state's key and root (LG-15: the main thread compares the root
 * with the node's), its summary (LG-16), the adapter's output (results, events, logs, parameters) and the batch the
 * block writes (LG-11): the new state's key persisted, the previous one released — task 12.4 widens this to the
 * retention window (LG-12) —, flushed with the nodes they reach.
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
} from "../types.js";

/** What loads an adapter: `loadLedgerPackage`, or a test package's loader. */
export type LedgerLoader = (ledger: LedgerName, options: LedgerPackageOptions) => Promise<LedgerPackage>;

/** The network id the engine's adapters are made with: parsing and applying read none (see the module comment). */
export const PARSE_NETWORK_ID = "undeployed";

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

/** A state to load by its key (task 12.4's restart; the bridge's own test). */
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
}

/** A state the engine holds, with the block it is after. */
interface Held extends BlockId {
  readonly ledger: LedgerName;
  readonly adapter: LedgerPackage;
  readonly state: StateHandle;
  readonly key: Uint8Array;
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

/** The ledger worker's engine (see the module comment). */
export class LedgerEngine {
  readonly #load: LedgerLoader;
  readonly #store: NodeStore | undefined;
  readonly #adapters = new Map<LedgerName, Promise<LedgerPackage>>();
  readonly #kept = new Map<string, Kept>();
  /** The adapters whose package has the node store installed. */
  readonly #installed = new WeakSet<LedgerPackage>();
  #committed: Held | null = null;
  #pending: (Held & { readonly result: AppliedState }) | null = null;

  constructor(options: EngineOptions) {
    this.#load = options.load;
    this.#store = options.store;
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

  /** The result of applying `input` to `state` (see the module comment): `before` is released, unless null. */
  #applied(
    adapter: LedgerPackage,
    block: BlockId & { readonly ledger: LedgerName },
    state: StateHandle,
    input: ApplyInput,
    before: Uint8Array | null,
  ): Settled {
    const { state: after, output } = adapter.apply(state, input);
    return this.#settled(adapter, block, after, output, before);
  }

  /** `state` after `block` persisted (and `before` released), flushed, and described as plain data. */
  #settled(
    adapter: LedgerPackage,
    block: BlockId & { readonly ledger: LedgerName },
    state: StateHandle,
    output: ApplyOutput,
    before: Uint8Array | null,
  ): Settled {
    const key = adapter.stateKey(state);
    this.#installStore(adapter, key);
    // Read before the flush, while every node of the state is still pending in memory (see the module comment).
    const stateRoot = adapter.stateRoot(state);
    const summary = adapter.stateSummary(state);
    adapter.persist(key);
    if (before !== null) adapter.release(before);
    const batch = adapter.flush();
    const result: AppliedState = { ledger: block.ledger, height: block.height, hash: block.hash, stateKey: key, stateRoot, summary, output, batch };
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
    this.#pending = { ...idOf(block), ledger: block.ledger, adapter, state: settled.state, key: settled.key, result: settled.result };
    return settled.result;
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
          settled = this.#settled(adapter, input, genesis, output, null);
        } finally {
          adapter.dispose(empty);
        }
      } else {
        settled = this.#applied(adapter, input, genesis, block, null);
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
      throw new Error(`block ${input.height} cannot be applied: the ledger worker holds no state (loading a stored state is task 12.4's)`);
    }
    if (committed.height !== input.height - 1n) {
      throw new Error(`block ${input.height} cannot be applied: the ledger worker holds the state at ${committed.height}, not ${input.height - 1n}`);
    }
    if (!sameBytes(committed.hash, input.parentHash)) {
      throw new Error(`block ${input.height} cannot be applied: its parent is not block ${committed.height}, whose state the ledger worker holds`);
    }
    if (committed.ledger !== input.ledger) {
      throw new Error(
        `block ${input.height} is a ${input.ledger} block on a ${committed.ledger} state: the conversion (LG-9) is task 12.4's`,
      );
    }
    const transactions = this.#transactions(input, input.ledger, input.transactions);
    this.#dropPending();
    const settled = this.#applied(
      committed.adapter,
      input,
      committed.state,
      {
        transactions: [...transactions],
        ...(input.outcomes === undefined ? {} : { outcomes: input.outcomes }),
        height: input.height,
        hash: input.hash,
        parentHash: input.parentHash,
        timestampMs: input.timestampMs,
        parentTimestampMs: input.parentTimestampMs,
        firstRegularAtParentTime: input.firstRegularAtParentTime,
      },
      committed.key,
    );
    return this.#pend(committed.adapter, input, settled);
  }

  /** `block` committed (its `on-after-db-write`): its pending state becomes the committed one. False when not pending. */
  commit(block: BlockId): boolean {
    const pending = this.#pending;
    if (pending === null || !same(pending, block)) return false;
    if (this.#committed !== null) this.#committed.adapter.dispose(this.#committed.state);
    this.#committed = { ...idOf(pending), ledger: pending.ledger, adapter: pending.adapter, state: pending.state, key: pending.key };
    this.#pending = null;
    return true;
  }

  /** Drops the kept parses at heights up to `upTo` and of the blocks `hashes` names; returns how many it dropped. */
  release(drop: { readonly upTo?: bigint; readonly hashes?: readonly Uint8Array[] }): number {
    const named = new Set((drop.hashes ?? []).map(hexOf));
    let dropped = 0;
    for (const [key, kept] of [...this.#kept]) {
      if (named.has(key) || (drop.upTo !== undefined && kept.height <= drop.upTo)) {
        this.#kept.delete(key);
        dropped += 1;
      }
    }
    return dropped;
  }

  /** The state with root node `stateKey`, read from the node store, as the committed state at `input` (task 12.4's seam). */
  async load(input: LoadState): Promise<{ readonly stateRoot: Uint8Array }> {
    if (this.#store === undefined) throw new Error("the ledger engine has no node store to load a state from (the main thread has none)");
    const adapter = await this.#adapter(input.ledger);
    const state = adapter.load(input.stateKey, this.#store);
    this.#dropPending();
    if (this.#committed !== null) this.#committed.adapter.dispose(this.#committed.state);
    this.#committed = { ...idOf(input), ledger: input.ledger, adapter, state, key: input.stateKey };
    return { stateRoot: adapter.stateRoot(state) };
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
