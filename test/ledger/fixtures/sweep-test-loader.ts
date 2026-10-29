// The test package of the sweep tests (`src/ledger/worker/`): a loader the ledger worker imports in place of `src/ledger/load.ts` (`startLedgerWorker({ loader })`), whose adapter
// is no ledger: its state after each height is the DAG of `./sweep-fixture.ts`, and it keeps nodes as the vendored
// packages do — a flush takes every node reachable from a key whose root count rose that it has not stored yet and
// counts it stored; `evict` forgets that it stored a node, so a node needed again after the sweep deleted it is flushed
// again. Without `evict` a node the database lost would never be written again: the oracle then finds a held key
// reaching a node that is not stored. Blocks carry no transactions; roots are the fixture's (`rootOf`). [A105, LG-14]
//
// Across a worker restart:
// - a state the thread did not make itself (a new worker thread's, after the main thread restarted it) is loaded from
//   the node store (the database, through the bridge): every node of it read, checked against the fixture and counted
//   stored;
// - by `loaderData` ({@link RefusalData}), the package of the first threads refuses every eviction it is asked for
//   after applying one height, as a package does whose live object still holds a swept node after the worker freed
//   what it can.
// What every thread did is counted in memory the threads share ({@link COUNTERS}), so the test reads it across a
// restart. [A160, LG-14, Q144 B]
// Erasable TypeScript only: the worker runs it through Node.js's type stripping.

import type { LedgerName, LedgerPackage, LedgerPackageOptions, NodeBatch, StateHandle } from "../../../src/ledger/types.js";
import { type FixtureNode, rootOf, stateNodes } from "./sweep-fixture.js";

const hex = (bytes: Uint8Array): string => Buffer.from(bytes).toString("hex");

/** The slots of {@link RefusalData.counters}, an `Int32Array` over a `SharedArrayBuffer`. */
export const COUNTERS = Object.freeze({
  /** Packages loaded: one per worker thread (the fixture has one ledger). */
  threads: 0,
  /** Evictions refused. */
  refusals: 1,
  /** States loaded from the node store (by a thread that did not make them). */
  storeLoads: 2,
  /** The height of the last state loaded from the node store. */
  storeLoadHeight: 3,
  /** Evictions taken (each `evict` the package did not refuse). */
  evictions: 4,
});

/** The counters' memory: {@link COUNTERS}' slots. */
export const countersMemory = (): SharedArrayBuffer => new SharedArrayBuffer(4 * Object.keys(COUNTERS).length);

/** What a test asks of the package (plain data through the worker's `workerData`; the memory is shared). */
export interface RefusalData {
  /** Shared counters ({@link COUNTERS}). */
  readonly counters?: SharedArrayBuffer;
  /** The height (decimal text) after whose apply the package refuses every eviction … */
  readonly refuseAt?: string;
  /** … in the first `threads` threads that load it (1 unless given). */
  readonly threads?: number;
}

/** A state of this package: the height whose fixture state it is. */
interface FakeState {
  readonly height: number;
}

const evicted: string[] = [];

/** The ledger worker's loader: the fake adapter (see the module comment). */
export async function loadLedger(ledger: LedgerName, _options: LedgerPackageOptions, data?: RefusalData | null): Promise<LedgerPackage> {
  const counters = data?.counters === undefined ? new Int32Array(Object.keys(COUNTERS).length) : new Int32Array(data.counters);
  const thread = Atomics.add(counters, COUNTERS.threads, 1);
  const refusing = data?.refuseAt !== undefined && thread < (data.threads ?? 1);
  let applied: number | null = null;
  const nodes = new Map<string, FixtureNode>();
  const roots = new Map<string, number>();
  const stored = new Set<string>();
  let deltas = new Map<string, { key: Uint8Array; delta: number }>();
  const state = (height: number): StateHandle => {
    const all = stateNodes(height);
    for (const node of all) nodes.set(hex(node.key), node);
    roots.set(hex((all[0] as FixtureNode).key), height);
    return { height } as unknown as StateHandle;
  };
  const heightOf = (handle: StateHandle): number => (handle as unknown as FakeState).height;
  const change = (key: Uint8Array, by: number): void => {
    const entry = deltas.get(hex(key)) ?? { key, delta: 0 };
    deltas.set(hex(key), { key, delta: entry.delta + by });
  };
  const unsupported = (what: string) => (): never => {
    throw new Error(`the sweep test package has no ${what}`);
  };
  return {
    ledger,
    versionName: "sweep-fixture",
    rawPackages: () => ({}),
    parseTransaction: unsupported("transactions"),
    nativeTransaction: unsupported("transactions"),
    forgetTransactions: () => undefined,
    emptyState: () => state(0),
    genesisState: () => state(0),
    networkIdOf: () => "undeployed",
    load(key, store) {
      const height = roots.get(hex(key));
      if (height !== undefined) return state(height);
      // A state this thread did not make: read from the node store, every node of it, each the fixture's. [A160]
      const root = store.get(key);
      const named = root === null ? null : /^state (\d+)$/.exec(Buffer.from(root.data).toString("utf8"));
      if (named === null || named === undefined) throw new Error(`the sweep test package finds no state ${hex(key)} in the node store`);
      const at = Number(named[1]);
      for (const node of stateNodes(at)) {
        const read = store.get(node.key);
        if (read === null || hex(read.data) !== hex(node.data) || hex(read.children) !== hex(node.children)) {
          throw new Error(`the node store lacks node ${hex(node.key)} of the state after ${at}, or holds other bytes`);
        }
        stored.add(hex(node.key));
      }
      Atomics.add(counters, COUNTERS.storeLoads, 1);
      Atomics.store(counters, COUNTERS.storeLoadHeight, at);
      return state(at);
    },
    apply: (_state, input) => {
      applied = Number(input.height);
      return {
        state: state(Number(input.height)),
        output: { results: [], events: [], logs: [], parameters: Uint8Array.of(0) },
      };
    },
    stateRoot: (handle) => rootOf(heightOf(handle)),
    // The six state tree values, none null: this package's states hold no trees, so empty ones' values. [LG-16]
    stateSummary: () => ({
      zswapFirstFree: 0n,
      zswapRoot: Uint8Array.of(0),
      dustCommitmentFirstFree: 0n,
      dustCommitmentRoot: Uint8Array.of(0),
      dustGenerationFirstFree: 0n,
      dustGenerationRoot: Uint8Array.of(0),
    }),
    dispose: () => undefined,
    stateKey: (handle) => (stateNodes(heightOf(handle))[0] as FixtureNode).key,
    flush(): NodeBatch {
      const taken = new Map<string, FixtureNode>();
      const frontier = [...deltas.values()].filter((d) => d.delta > 0).map((d) => hex(d.key));
      while (frontier.length > 0) {
        const key = frontier.pop() as string;
        if (stored.has(key) || taken.has(key)) continue;
        const node = nodes.get(key);
        if (node === undefined) continue;
        taken.set(key, node);
        for (const ref of node.refs) frontier.push(hex(ref));
      }
      for (const key of taken.keys()) stored.add(key);
      const rootCounts = [...deltas.values()].filter((d) => d.delta !== 0).sort((a, b) => (hex(a.key) < hex(b.key) ? -1 : 1));
      deltas = new Map();
      const inserts = [...taken.values()].sort((a, b) => (hex(a.key) < hex(b.key) ? -1 : 1)).map((n) => ({ key: n.key, data: n.data, children: n.children }));
      return { inserts, rootCounts };
    },
    persist: (key) => change(key, 1),
    release: (key) => change(key, -1),
    childRefs: (children) => {
      const refs: Uint8Array[] = [];
      for (let at = 1; at < children.length; at += 33) refs.push(children.slice(at + 1, at + 33));
      return refs;
    },
    evict(keys) {
      if (refusing && `${applied}` === data?.refuseAt) {
        Atomics.add(counters, COUNTERS.refusals, 1);
        throw new Error(`the sweep test package refuses to forget ${keys.length} node(s) after ${applied}: still held by a live object (A160)`);
      }
      Atomics.add(counters, COUNTERS.evictions, 1);
      for (const key of keys) {
        stored.delete(hex(key));
        evicted.push(hex(key));
      }
    },
    contractStateKey: () => null,
    contractZswapStateKey: () => null,
    decodeLogItem: () => null,
  };
}

/** What the package saw, for the test (`LedgerHost.probe()`): the keys it was told to evict, in order. */
export function probe(): { readonly evicted: readonly string[] } {
  return { evicted: [...evicted] };
}
