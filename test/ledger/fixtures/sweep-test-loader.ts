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
//
// The extended DAG (`loaderData` {@link FixtureData}: `dag: "extended"`; without it, the original DAG as above) is
// served by a package that keeps, per thread, the node it holds for each key, the child list it believes stored for
// each key, and its live states. Building the state after a height takes the fixture's nodes; its flush writes, from
// each key whose root count rose, every node it holds whose child list is not the one it believes stored, so a node it
// builds in another form is written again; `evict` forgets a node (held and stored). Before it builds the state after
// `AGAIN` its memory drops `again`, which it then writes again unchanged. A state it did not make is read lazily from
// the node store: every row it reaches is read, its key checked against its content, its child list counted stored,
// and the keys reached (rows and embedded nodes) checked against the fixture's node set; the thread holds none of
// those nodes until it builds them. By `keeping` ({@link Keeping}), it keeps nodes in one of three ways:
// - `writes-again` (the default): building a node takes the fixture's child list, so its flush writes the child list
//   the fixture has at that height, restarted or not;
// - `keeps-old-copy`: building a node the thread already holds keeps the node it holds, as the ledger's back-end keeps
//   the old copy of a node it creates again; so a thread that never restarted keeps a rewritten node's old child list
//   and writes nothing for it, while a thread that loaded the state before from the node store holds no copy and
//   writes the new one [R28];
// - `holds-by-reference`: it writes what `writes-again` writes, but its live objects keep each node in the form the
//   thread first built it; so after `rewrite to-embedded` is written embedding its small child, a live state still
//   holds that child by reference, and the package refuses to forget a node a live state holds by reference, as the
//   v9 package does; a new thread, whose state is loaded from the node store, holds the stored form [R30, Q144 B].
// By `withhold` and `persistUnknown` ({@link FixtureData}) it also makes the batches the reclamation checks refuse: a
// flush that leaves out one node a node of its batch references (a new node's child, or the child a rewritten node now
// references), and one that persists a key no node has [R11]. By `persist`, a flush also persists a node it holds and
// never releases it: a queued key that a later block persists [R27].
// [A105, R11, R27, R28, R30; LG-11, LG-14]
// Erasable TypeScript only: the worker runs it through Node.js's type stripping.

import { createHash } from "node:crypto";
import type { LedgerName, LedgerPackage, LedgerPackageOptions, NodeBatch, NodeStore, StateHandle } from "../../../src/ledger/types.js";
import { AGAIN, contentOf, extendedCases, type FixtureDag, type FixtureNode, rootOf, stateKeys, stateNodes } from "./sweep-fixture.js";

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

/** How the package keeps the extended DAG's nodes (see the module comment). */
export type Keeping = "writes-again" | "keeps-old-copy" | "holds-by-reference";

/** What a test asks of the package: a refusal ({@link RefusalData}), and the DAG and the way it keeps nodes. */
export interface FixtureData extends RefusalData {
  /** The DAG it serves: the original unless `"extended"`. */
  readonly dag?: FixtureDag;
  /** How it keeps the extended DAG's nodes: `"writes-again"` unless given; refused with the original DAG. */
  readonly keeping?: Keeping;
  /**
   * The extended DAG only: the flush after the height `at` (decimal text) leaves out the node `key` (hex), which it then
   * believes stored. [R11]
   */
  readonly withhold?: { readonly at: string; readonly key: string };
  /** The extended DAG only: the flush after this height (decimal text) also persists {@link UNKNOWN_KEY}. [R11] */
  readonly persistUnknown?: string;
  /**
   * The extended DAG only: the flush after the height `at` (decimal text) also persists the node `key` (hex), which no
   * later flush releases. [R27]
   */
  readonly persist?: { readonly at: string; readonly key: string };
}

/** A key no node of the fixture has: what `persistUnknown` persists. [R11] */
export const UNKNOWN_KEY: Uint8Array = Uint8Array.from(createHash("sha256").update("a key no node of the fixture has").digest());

/** A state of this package: the height whose fixture state it is. */
interface FakeState {
  readonly height: number;
}

const evicted: string[] = [];

/** The ledger worker's loader: the fake adapter (see the module comment). */
export async function loadLedger(ledger: LedgerName, _options: LedgerPackageOptions, data?: FixtureData | null): Promise<LedgerPackage> {
  if (data?.dag === "extended") return extendedPackage(ledger, data);
  for (const field of ["keeping", "withhold", "persistUnknown", "persist"] as const) {
    if (data?.[field] !== undefined) throw new Error(`the sweep test package's ${field} applies to the extended DAG only (dag: "extended")`);
  }
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

/** A state of the extended DAG's package: its height, and the keys it holds by reference (its root included). */
interface ExtendedState {
  readonly height: number;
  readonly holds: ReadonlySet<string>;
}

/** The package of the extended DAG (see the module comment). [A105, R27, R28, R30; LG-11, LG-14] */
function extendedPackage(ledger: LedgerName, data: FixtureData): LedgerPackage {
  const keeping = data.keeping ?? "writes-again";
  const counters = data.counters === undefined ? new Int32Array(Object.keys(COUNTERS).length) : new Int32Array(data.counters);
  const thread = Atomics.add(counters, COUNTERS.threads, 1);
  const refusing = data.refuseAt !== undefined && thread < (data.threads ?? 1);
  const again = hex(extendedCases(AGAIN).again.node.key);
  let applied: number | null = null;
  let dropped = false;
  /** The node the thread holds for each key: what its flush writes. */
  const held = new Map<string, FixtureNode>();
  /** Each node in the form the thread first built it: what its live objects carry when it holds by reference. */
  const carried = new Map<string, FixtureNode>();
  const live = keeping === "holds-by-reference" ? carried : held;
  /** The child list the thread believes stored for each key. */
  const stored = new Map<string, string>();
  /** The height of each state the thread made or read, by its root key; the rows of each it read. */
  const roots = new Map<string, number>();
  const reads = new Map<string, ReadonlySet<string>>();
  const states = new Set<ExtendedState>();
  let deltas = new Map<string, { key: Uint8Array; delta: number }>();
  const rootKey = (height: number): Uint8Array => rootOf(height, "extended").slice(1);
  const heightOf = (handle: StateHandle): number => (handle as unknown as ExtendedState).height;
  /** The keys `root` reaches by reference through `nodes`, `root` included. */
  const reach = (root: string, nodes: ReadonlyMap<string, FixtureNode>): Set<string> => {
    const reached = new Set<string>();
    const frontier = [root];
    while (frontier.length > 0) {
      const key = frontier.pop() as string;
      if (reached.has(key)) continue;
      reached.add(key);
      for (const ref of nodes.get(key)?.refs ?? []) frontier.push(hex(ref));
    }
    return reached;
  };
  const handle = (height: number, holds: ReadonlySet<string>): StateHandle => {
    const state: ExtendedState = { height, holds };
    states.add(state);
    return state as unknown as StateHandle;
  };
  /** The state after `height`, built from the fixture's nodes as `keeping` says. */
  const build = (height: number): StateHandle => {
    if (height === AGAIN && !dropped) {
      // Its memory drops `again`: building the state creates it anew, and the flush writes it again. [A105, R12 (b)]
      dropped = true;
      held.delete(again);
      stored.delete(again);
    }
    for (const node of stateNodes(height, "extended")) {
      const key = hex(node.key);
      if (keeping !== "keeps-old-copy" || !held.has(key)) held.set(key, node);
      if (!carried.has(key)) carried.set(key, node);
    }
    const root = hex(rootKey(height));
    roots.set(root, height);
    return handle(height, reach(root, live));
  };
  /**
   * The state whose root is `key`, read lazily from `store`: each row it reaches read and its key checked against its
   * content, each child list counted stored, the keys reached checked against the fixture's node set. [A160, R27, R30]
   */
  const read = (key: Uint8Array, store: NodeStore): StateHandle => {
    const root = store.get(key);
    const named = root === null ? null : /^state (\d+)$/.exec(Buffer.from(root.data).toString("utf8"));
    if (named === null || named === undefined) throw new Error(`the sweep test package finds no state ${hex(key)} in the node store`);
    const at = Number(named[1]);
    const rows = new Set<string>();
    const keys = new Set<string>();
    const frontier = [key];
    while (frontier.length > 0) {
      const next = frontier.pop() as Uint8Array;
      const name = hex(next);
      if (rows.has(name)) continue;
      const row = store.get(next);
      if (row === null) throw new Error(`the node store lacks node ${name} of the state after ${at}`);
      const content = contentOf(row.data, row.children);
      if (hex(content.key) !== name) throw new Error(`the node store holds node ${name} of the state after ${at} with a content that is not its key`);
      rows.add(name);
      keys.add(name);
      for (const embedded of content.embedded) keys.add(hex(embedded));
      stored.set(name, hex(row.children));
      frontier.push(...content.refs);
    }
    const expected = stateKeys(at, "extended");
    const found = [...keys].sort();
    if (JSON.stringify(found) !== JSON.stringify(expected)) {
      throw new Error(`the node store holds ${found.length} nodes of the state after ${at}, not the fixture's ${expected.length}`);
    }
    Atomics.add(counters, COUNTERS.storeLoads, 1);
    Atomics.store(counters, COUNTERS.storeLoadHeight, at);
    roots.set(hex(key), at);
    reads.set(hex(key), rows);
    return handle(at, rows);
  };
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
    emptyState: () => build(0),
    genesisState: () => build(0),
    networkIdOf: () => "undeployed",
    load(key, store) {
      const height = roots.get(hex(key));
      if (height === undefined) return read(key, store);
      return handle(height, reads.get(hex(key)) ?? reach(hex(key), live));
    },
    apply: (_state, input) => {
      applied = Number(input.height);
      return {
        state: build(applied),
        output: { results: [], events: [], logs: [], parameters: Uint8Array.of(0) },
      };
    },
    stateRoot: (handle) => rootOf(heightOf(handle), "extended"),
    // The six state tree values, none null: this package's states hold no trees, so empty ones' values. [LG-16]
    stateSummary: () => ({
      zswapFirstFree: 0n,
      zswapRoot: Uint8Array.of(0),
      dustCommitmentFirstFree: 0n,
      dustCommitmentRoot: Uint8Array.of(0),
      dustGenerationFirstFree: 0n,
      dustGenerationRoot: Uint8Array.of(0),
    }),
    dispose: (handle) => {
      states.delete(handle as unknown as ExtendedState);
    },
    stateKey: (handle) => rootKey(heightOf(handle)),
    flush(): NodeBatch {
      if (data.persistUnknown !== undefined && `${applied}` === data.persistUnknown) change(UNKNOWN_KEY, 1);
      if (data.persist !== undefined && `${applied}` === data.persist.at) change(Uint8Array.from(Buffer.from(data.persist.key, "hex")), 1);
      const taken = new Map<string, FixtureNode>();
      const frontier = [...deltas.values()].filter((d) => d.delta > 0).map((d) => hex(d.key));
      while (frontier.length > 0) {
        const key = frontier.pop() as string;
        const node = held.get(key);
        if (taken.has(key) || node === undefined || stored.get(key) === hex(node.children)) continue;
        taken.set(key, node);
        for (const ref of node.refs) frontier.push(hex(ref));
      }
      for (const [key, node] of taken) stored.set(key, hex(node.children));
      // A node left out of the batch, though the package now believes it stored. [R11]
      if (data.withhold !== undefined && `${applied}` === data.withhold.at) taken.delete(data.withhold.key);
      const rootCounts = [...deltas.values()].filter((d) => d.delta !== 0).sort((a, b) => (hex(a.key) < hex(b.key) ? -1 : 1));
      deltas = new Map();
      const inserts = [...taken.values()].sort((a, b) => (hex(a.key) < hex(b.key) ? -1 : 1)).map((n) => ({ key: n.key, data: n.data, children: n.children }));
      return { inserts, rootCounts };
    },
    persist: (key) => change(key, 1),
    release: (key) => change(key, -1),
    // A child list's references do not depend on the payload, so it is read with an empty one.
    childRefs: (children) => [...contentOf(new Uint8Array(0), children).refs],
    evict(keys) {
      if (refusing && `${applied}` === data.refuseAt) {
        Atomics.add(counters, COUNTERS.refusals, 1);
        throw new Error(`the sweep test package refuses to forget ${keys.length} node(s) after ${applied}: still held by a live object (A160)`);
      }
      if (keeping === "holds-by-reference") {
        // A live state holding one by reference: refused, as the v9 package refuses. [R30, Q144 B]
        const holding = keys.map(hex).filter((key) => [...states].some((state) => state.holds.has(key)));
        if (holding.length > 0) {
          Atomics.add(counters, COUNTERS.refusals, 1);
          throw new Error(`the sweep test package refuses to forget ${holding.join(", ")} after ${applied}: still held by a live object`);
        }
      }
      Atomics.add(counters, COUNTERS.evictions, 1);
      for (const key of keys) {
        held.delete(hex(key));
        carried.delete(hex(key));
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
