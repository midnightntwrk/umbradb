// The test package of task 12.5's sweep tests (`openspec/changes/core-arch` A105, LG-14; `src/ledger/worker/`): a
// loader the ledger worker imports in place of `src/ledger/load.ts` (`startLedgerWorker({ loader })`), whose adapter
// is no ledger: its state after each height is the DAG of `./sweep-fixture.ts`, and it keeps nodes as the vendored
// packages do — a flush takes every node reachable from a key whose root count rose that it has not stored yet and
// counts it stored; `evict` forgets that it stored a node, so a node needed again after the sweep deleted it is flushed
// again (LG-14). Without `evict` a node the database lost would never be written again: the oracle then finds a held
// key reaching a node that is not stored. Blocks carry no transactions; roots are the fixture's (`rootOf`).
// Erasable TypeScript only: the worker runs it through Node.js's type stripping.

import type { LedgerName, LedgerPackage, LedgerPackageOptions, NodeBatch, StateHandle } from "../../../src/ledger/types.js";
import { type FixtureNode, rootOf, stateNodes } from "./sweep-fixture.js";

const hex = (bytes: Uint8Array): string => Buffer.from(bytes).toString("hex");

/** A state of this package: the height whose fixture state it is. */
interface FakeState {
  readonly height: number;
}

const evicted: string[] = [];

/** The ledger worker's loader: the fake adapter (see the module comment). */
export async function loadLedger(ledger: LedgerName, _options: LedgerPackageOptions): Promise<LedgerPackage> {
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
    load(key) {
      const height = roots.get(hex(key));
      if (height === undefined) throw new Error(`the sweep test package holds no state ${hex(key)}`);
      return state(height);
    },
    apply: (_state, input) => ({
      state: state(Number(input.height)),
      output: { results: [], events: [], logs: [], parameters: Uint8Array.of(0) },
    }),
    stateRoot: (handle) => rootOf(heightOf(handle)),
    // LG-16's six values, none null (task 12.1b): this package's states hold no trees, so empty ones' values.
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
