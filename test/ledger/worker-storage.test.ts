import { describe, expect, it } from "vitest";
import { loadLedgerPackage } from "../../src/ledger/load.js";
import type { LedgerName, NodeStore, StoredNode } from "../../src/ledger/types.js";
import { type AppliedState, type ApplyBlock, type BlockId, LedgerEngine } from "../../src/ledger/worker/engine.js";
import {
  callTransaction,
  cellValue,
  contractFixture,
  hex,
  NETWORK_ID,
  RAW,
  referenceReplay,
  T0,
  zswapOutputTransaction,
} from "./adapter-fixtures.js";
import { runInFreshInstance } from "./fresh-instance.js";
import { rebuildTagged } from "./stored-values.js";
import { STAGENET } from "./v9-rc3-checks.js";

// What the ledger worker's engine does with stored states:
// - the keys a block persists and releases;
// - the state at h − 1 loaded from the store;
// - the v8 → v9 conversion before the first v9 block (into `v9` and into `v9-rc5`);
// - a v9 state carried into a later v9 package (`v9-rc3` → `v9-rc5`, `v9-rc3` → `v9`, `v9-rc5` → `v9`);
// - the contracts' keys;
// - a retained state loaded aside.
//
// Run here in the test's thread over the real adapters and a store over a map that holds each committed block's nodes,
// as the database does.
//
// Oracles: the reference replay and the vendored packages' own exports, the conversion run in a fresh instance of the
// v9 package (`./fresh-instance.ts`), and the stored values rebuilt from their nodes without the packages
// (`./stored-values.ts`).

const LONG = 240_000;
/** The v9 packages a v8 state is converted into and an earlier v9 state is carried into: 9.1.0.1 and rc.5. */
const V9_PACKAGES = {
  v9: new URL("../../vendor/ledger/v9/pkg/midnight_ledger_wasm_v9_fs.js", import.meta.url).href,
  "v9-rc5": new URL("../../vendor/ledger/v9-rc5/pkg/midnight_ledger_wasm_v9_fs.js", import.meta.url).href,
} as const;
/** The upgrades within v9, each with the runtimes it is between: every one the engine carries a state across. */
const CARRIES = [
  ["v9-rc3", "v9-rc5", "2.0 → 2.1.0"],
  ["v9-rc3", "v9", "2.0 → 2.1.100"],
  ["v9-rc5", "v9", "2.1.0 → 2.1.100"],
] as const;
const hash = (byte: number): Uint8Array => new Uint8Array(32).fill(byte);
const at = (height: bigint): BlockId => ({ height, hash: hash(Number(height) + 1) });
const rows = (applied: AppliedState): string[] => applied.batch.rootCounts.map((c) => `${hex(c.key)} ${c.delta}`).sort();

/** A database of nodes as the engine's store reads it: the nodes of every block committed so far. */
class Nodes implements NodeStore {
  readonly #nodes = new Map<string, StoredNode>();
  reads = 0;
  get(key: Uint8Array): { data: Uint8Array; children: Uint8Array } | null {
    this.reads += 1;
    const node = this.#nodes.get(hex(key));
    return node === undefined ? null : { data: node.data, children: node.children };
  }
  write(applied: AppliedState): void {
    this.insert(applied.batch.inserts);
  }
  insert(inserts: readonly StoredNode[]): void {
    for (const node of inserts) if (!this.#nodes.has(hex(node.key))) this.#nodes.set(hex(node.key), node);
  }
  all(): StoredNode[] {
    return [...this.#nodes.values()];
  }
  find(key: string): StoredNode | undefined {
    return this.#nodes.get(key);
  }
}

/** Block `height`'s apply input on `ledger` (at T0 + 6 s × height, the parent 6 s older). */
function input(height: bigint, transactions: number, rest: Partial<ApplyBlock> = {}): ApplyBlock {
  return {
    ledger: "v9",
    ...at(height),
    parentHash: at(height - 1n).hash,
    timestampMs: BigInt(T0) + height * 6_000n,
    parentTimestampMs: BigInt(T0) + (height - 1n) * 6_000n,
    firstRegularAtParentTime: false,
    transactions,
    ...rest,
  };
}

/** An engine with a store over `nodes`, past block 0 on `ledger` (a blank genesis), block 0 written and committed. */
async function started(ledger: "v8" | "v9" | "v9-rc3" | "v9-rc5", nodes = new Nodes()) {
  const engine = new LedgerEngine({ load: loadLedgerPackage, store: nodes });
  const zero = await engine.genesis({
    ledger,
    ...at(0n),
    parentHash: new Uint8Array(32),
    timestampMs: BigInt(T0),
    transactions: 0,
    genesisState: RAW[ledger].LedgerState.blank(NETWORK_ID).serialize(),
    includesBlockZero: true,
  });
  nodes.write(zero);
  expect(engine.commit(at(0n))).toBe(true);
  return { engine, nodes, zero };
}

/** Applies `block` with `transactions` parsed, writes its nodes and commits it, as one height's callbacks do. */
async function step(engine: LedgerEngine, nodes: Nodes, block: ApplyBlock, transactions: Uint8Array[] = []): Promise<AppliedState> {
  if (transactions.length > 0) await engine.parse(block.ledger, block, transactions);
  const applied = await engine.apply(block);
  nodes.write(applied);
  expect(engine.commit(block)).toBe(true);
  return applied;
}

describe("the ledger worker's stored states", () => {
  it("persists the new state's key and releases exactly the keys it is given", { timeout: LONG }, async () => {
    const { engine, nodes, zero } = await started("v9");
    // Nothing released: the window keeps the state at 0 (retainStates 1 and more).
    const one = await step(engine, nodes, input(1n, 0, { release: [] }));
    expect(rows(one)).toEqual([`${hex(one.stateKey)} 1`]);
    // Two released at once: a revision that lowers the window releases every state leaving it in its first block.
    const two = await step(engine, nodes, input(2n, 0, { release: [zero.stateKey, one.stateKey] }));
    expect(rows(two)).toEqual([`${hex(two.stateKey)} 1`, `${hex(zero.stateKey)} -1`, `${hex(one.stateKey)} -1`].sort());
    // Without a list, the state before the block (the behaviour with retainStates 0).
    const three = await step(engine, nodes, input(3n, 0));
    expect(rows(three)).toEqual([`${hex(three.stateKey)} 1`, `${hex(two.stateKey)} -1`].sort());
  });

  it("loads the state at h − 1 from the store only when it does not hold it, and keeps a retried block's result", { timeout: LONG }, async () => {
    const { engine, nodes, zero } = await started("v9");
    // The engine holds the state at 0: nothing is read.
    const held = await engine.load({ ledger: "v9", ...at(0n), stateKey: zero.stateKey });
    expect([hex(held.stateRoot), held.loaded]).toEqual([hex(zero.stateRoot), false]);
    // A pending block survives the parent's load (a height processed again after a lost transaction gets the same
    // result back, batch included).
    await engine.parse("v9", at(1n), [zswapOutputTransaction(RAW.v9)]);
    const pending = await engine.apply(input(1n, 1));
    expect((await engine.load({ ledger: "v9", ...at(0n), stateKey: zero.stateKey })).loaded).toBe(false);
    expect(await engine.apply(input(1n, 1))).toBe(pending);
    expect(pending.batch.inserts.length).toBeGreaterThan(0);
    // The block committed in the database without its commit reaching the worker: the pending state is the one.
    nodes.write(pending);
    const promoted = await engine.load({ ledger: "v9", ...at(1n), stateKey: pending.stateKey });
    expect([hex(promoted.stateRoot), promoted.loaded]).toEqual([hex(pending.stateRoot), false]);
    expect(engine.holds()).toMatchObject({ committed: at(1n), pending: null });

    // A fresh engine (a restart) holds nothing: it loads the state from the store, and the next block applies on it.
    const restarted = new LedgerEngine({ load: loadLedgerPackage, store: nodes });
    const loaded = await restarted.load({ ledger: "v9", ...at(1n), stateKey: pending.stateKey });
    expect([hex(loaded.stateRoot), loaded.loaded]).toEqual([hex(pending.stateRoot), true]);
    expect(restarted.holds()).toMatchObject({ committed: at(1n), pending: null });
    const two = await step(restarted, nodes, input(2n, 0));
    const reference = referenceReplay(RAW.v9, RAW.v9.LedgerState.deserialize(rebuildTagged("ledger-state[v18]", pending.stateKey, (k) => nodes.find(k))), {
      ...input(2n, 0),
      transactions: [],
    });
    expect(hex(two.stateRoot)).toBe(hex(RAW.v9.stateRoot(reference.state)));
    // The state at 2 the engine holds is not taken when the store names another state for it (the database decides),
    // and a pending block applied on the state it held is dropped with it.
    await restarted.parse("v9", at(3n), [zswapOutputTransaction(RAW.v9)]);
    await restarted.apply(input(3n, 1));
    expect(restarted.holds().pending).toEqual(at(3n));
    const other = await restarted.load({ ledger: "v9", ...at(2n), stateKey: zero.stateKey });
    expect([hex(other.stateRoot), other.loaded]).toEqual([hex(zero.stateRoot), true]);
    expect(restarted.holds()).toMatchObject({ committed: at(2n), pending: null });
    await expect(new LedgerEngine({ load: loadLedgerPackage }).load({ ledger: "v9", ...at(0n), stateKey: zero.stateKey })).rejects.toThrow(/no node store/);
  });

  // One store for every run: in this thread the packages remember what they flushed before, as a database would.
  const converted = new Nodes();
  for (const to of ["v9", "v9-rc5"] as const) {
    it(`converts the v8 state to ${to} before it applies the first ${to} block, with no transaction and with one`, { timeout: LONG }, async () => {
      for (const transactions of [[], [zswapOutputTransaction(RAW[to])]]) {
        const { engine, nodes } = await started("v8", converted);
        const u = await step(engine, nodes, input(1n, 0, { ledger: "v8" }));
        expect(u.ledger).toBe("v8");
        const block = input(2n, transactions.length, { ledger: to });
        const f = await step(engine, nodes, block, transactions);
        // The node's order (the official indexer's): the v8 state at U converted, then F applied to it.
        const fresh = await runInFreshInstance({ packagePath: V9_PACKAGES[to], op: "convert", key: u.stateKey, nodes: nodes.all() });
        expect(fresh.error).toBeUndefined();
        const reference = referenceReplay(RAW[to], RAW[to].LedgerState.deserialize(fresh.serialized as Uint8Array), { ...block, transactions });
        expect(hex(f.stateRoot)).toBe(hex(RAW[to].stateRoot(reference.state)));
        expect(f.ledger).toBe(to);
        expect(f.output.results.map((r) => r.outcome)).toEqual(transactions.map(() => "success"));
        // The v9 state persisted and the v8 one released in F's batch, with the converted state's new nodes.
        expect(rows(f)).toEqual([`${hex(f.stateKey)} 1`, `${hex(u.stateKey)} -1`].sort());
        expect(f.batch.inserts.map((n) => hex(n.key))).toContain(hex(f.stateKey));
        // From the store alone the state at F loads in a fresh instance, as a restart after F would load it.
        const loaded = await runInFreshInstance({ packagePath: V9_PACKAGES[to], op: "load", key: f.stateKey, nodes: nodes.all() });
        expect(hex(loaded.stateRoot as Uint8Array)).toBe(hex(f.stateRoot));
        // The next block of the same ledger applies on the converted state.
        const output = zswapOutputTransaction(RAW[to]);
        const next = await step(engine, nodes, input(3n, 1, { ledger: to }), [output]);
        const after = referenceReplay(RAW[to], reference.state, { ...input(3n, 1, { ledger: to }), transactions: [output] });
        expect(hex(next.stateRoot)).toBe(hex(RAW[to].stateRoot(after.state)));
        expect(next.ledger).toBe(to);
      }
    });
  }

  it("refuses a block of a ledger it cannot convert the state to, naming both", { timeout: LONG }, async () => {
    const { engine } = await started("v9");
    await expect(engine.apply(input(1n, 0, { ledger: "v8" }))).rejects.toThrow(/block 1 is a v8 block on a v9 state.*v8 → v9/);
    // No way back within v9: from 9.1.0.1 to rc.5 or to rc.3, or from rc.5 to rc.3.
    await expect(engine.apply(input(1n, 0, { ledger: "v9-rc3" }))).rejects.toThrow(/block 1 is a v9-rc3 block on a v9 state.*v9-rc3 → v9/);
    await expect(engine.apply(input(1n, 0, { ledger: "v9-rc5" }))).rejects.toThrow(/block 1 is a v9-rc5 block on a v9 state.*v9-rc5 → v9/);
    const { engine: rc5 } = await started("v9-rc5");
    await expect(rc5.apply(input(1n, 0, { ledger: "v9-rc3" }))).rejects.toThrow(/block 1 is a v9-rc3 block on a v9-rc5 state/);
    await expect(rc5.apply(input(1n, 0, { ledger: "v8" }))).rejects.toThrow(/block 1 is a v8 block on a v9-rc5 state/);
    // No conversion from v8 to rc.3 (the node that builds rc.3 has none), and none back to v8.
    const { engine: v8 } = await started("v8");
    await expect(v8.apply(input(1n, 0, { ledger: "v9-rc3" }))).rejects.toThrow(/block 1 is a v9-rc3 block on a v8 state/);
    const { engine: rc3 } = await started("v9-rc3");
    await expect(rc3.apply(input(1n, 0, { ledger: "v8" }))).rejects.toThrow(/block 1 is a v8 block on a v9-rc3 state/);
  });

  // One store for every run: in this thread the packages remember what they flushed before, as a database would.
  const carried = new Nodes();
  for (const [from, to, upgrade] of CARRIES) {
    it(`carries a ${from} state into ${to} at the first ${to} block, loading it in the ${to} package by its key from the store: a ${upgrade} upgrade`, {
      timeout: LONG,
    }, async () => {
      for (const transactions of [[], [zswapOutputTransaction(RAW[to])]]) {
        const { engine, nodes } = await started(from, carried);
        const u = await step(engine, nodes, input(1n, 1, { ledger: from }), [zswapOutputTransaction(RAW[from])]);
        expect(u.ledger).toBe(from);
        const block = input(2n, transactions.length, { ledger: to });
        const f = await step(engine, nodes, block, transactions);
        // The reference: the state at U rebuilt from the stored nodes without the packages and read by F's package
        // (the same root), then F applied to it.
        const atU = RAW[to].LedgerState.deserialize(rebuildTagged("ledger-state[v18]", u.stateKey, (k) => nodes.find(k)));
        expect(hex(RAW[to].stateRoot(atU))).toBe(hex(u.stateRoot));
        const reference = referenceReplay(RAW[to], atU, { ...block, transactions });
        expect(hex(f.stateRoot)).toBe(hex(RAW[to].stateRoot(reference.state)));
        expect(f.ledger).toBe(to);
        expect(f.output.results.map((r) => r.outcome)).toEqual(transactions.map(() => "success"));
        // F's state persisted and the one at U released in F's batch.
        expect(rows(f)).toEqual([`${hex(f.stateKey)} 1`, `${hex(u.stateKey)} -1`].sort());
        // From the store alone the state at F loads in a fresh instance of F's package, as a restart after F would
        // load it.
        const loaded = await runInFreshInstance({ packagePath: V9_PACKAGES[to], op: "load", key: f.stateKey, nodes: nodes.all() });
        expect(hex(loaded.stateRoot as Uint8Array)).toBe(hex(f.stateRoot));
        // The next block of F's ledger applies on the carried state.
        const output = zswapOutputTransaction(RAW[to]);
        const next = await step(engine, nodes, input(3n, 1, { ledger: to }), [output]);
        const after = referenceReplay(RAW[to], reference.state, { ...input(3n, 1, { ledger: to }), transactions: [output] });
        expect(hex(next.stateRoot)).toBe(hex(RAW[to].stateRoot(after.state)));
        expect(next.ledger).toBe(to);
      }
    });
  }

  it("carries stagenet's rc.3 state into rc.5 and into 9.1.0.1, whose rules differ from rc.3's on its next block: F is the later package's", {
    timeout: LONG,
  }, async () => {
    // Stagenet's genesis state stored by the rc.3 package, as the database holds it after block 0.
    const rc3 = await loadLedgerPackage("v9-rc3", { networkId: NETWORK_ID });
    const genesis = rc3.genesisState(STAGENET.genesisState);
    const key = rc3.stateKey(genesis);
    rc3.persist(key);
    const nodes = new Nodes();
    nodes.insert(rc3.flush().inserts);
    rc3.dispose(genesis);
    const one = STAGENET.blocks[0]!;
    for (const to of ["v9-rc5", "v9"] as const) {
      const engine = new LedgerEngine({ load: loadLedgerPackage, store: nodes });
      await engine.load({ ledger: "v9-rc3", height: 0n, hash: one.parentHash, stateKey: key });
      // Block 1 taken as the first block of a 2.1 runtime: its DUST generation update, whose rules changed after rc.3.
      await engine.parse(to, { height: 1n, hash: one.hash }, one.transactions);
      const f = await engine.apply({
        ledger: to,
        height: 1n,
        hash: one.hash,
        parentHash: one.parentHash,
        timestampMs: one.timestampMs,
        parentTimestampMs: one.parentTimestampMs,
        firstRegularAtParentTime: one.firstRegularAtParentTime,
        transactions: one.transactions.length,
        outcomes: one.outcomes!,
      });
      // The reference: the later package applying block 1 to the same state; rc.3 would give the node's root, the later
      // package gives another.
      const later = await loadLedgerPackage(to, { networkId: NETWORK_ID });
      const reference = later.apply(later.genesisState(STAGENET.genesisState), one);
      expect(hex(f.stateRoot), to).toBe(hex(later.stateRoot(reference.state)));
      expect(hex(f.stateRoot), to).not.toBe(STAGENET.nodeRoots.get(1n));
      expect(f.ledger).toBe(to);
    }
  });

  it("persists the state and zswap-state keys of the contracts it is given, and never releases them", { timeout: LONG }, async () => {
    const { engine, nodes, zero } = await started("v9");
    const contract = await contractFixture(RAW.v9);
    const absent = hash(0xab);
    const one = await step(engine, nodes, input(1n, 1, { contracts: [contract.address, absent] }), [contract.deploy]);
    // The keys are the contract's state's and its zswap state's, as the packages serialize them.
    const reference = referenceReplay(RAW.v9, RAW.v9.LedgerState.blank(NETWORK_ID), { ...input(1n, 1), transactions: [contract.deploy] }).state;
    const state = reference.index(hex(contract.address));
    expect(state).toBeDefined();
    const zswap = reference.zswap.filter(hex(contract.address));
    expect(one.contracts).toHaveLength(2);
    expect(hex(one.contracts[0]?.address as Uint8Array)).toBe(hex(contract.address));
    expect(one.contracts[1]).toEqual({ address: absent, stateKey: null, zswapStateKey: null });
    const keys = one.contracts[0] as { stateKey: Uint8Array; zswapStateKey: Uint8Array };
    // Both persisted in the block's batch, and their nodes in it: rebuilt from the stored nodes, each is the value.
    expect(rows(one)).toEqual([`${hex(one.stateKey)} 1`, `${hex(zero.stateKey)} -1`, `${hex(keys.stateKey)} 1`, `${hex(keys.zswapStateKey)} 1`].sort());
    expect(hex(rebuildTagged("contract-state[v8]", keys.stateKey, (k) => nodes.find(k)))).toBe(hex(state!.serialize()));
    expect(hex(rebuildTagged("zswap-ledger-state[v5]", keys.zswapStateKey, (k) => nodes.find(k)))).toBe(hex(zswap.serialize()));
    // The contract changes at 2 (its state replaced by a cell): new keys; the old ones are not released.
    const change = callTransaction(RAW.v9, contract, [
      { push: { storage: true, value: cellValue(Uint8Array.of(42)) } },
      { swap: { n: 0 } },
      "pop",
    ] as never);
    const two = await step(engine, nodes, input(2n, 1, { contracts: [contract.address] }), [change]);
    const changed = two.contracts[0] as { stateKey: Uint8Array; zswapStateKey: Uint8Array };
    expect(hex(changed.stateKey)).not.toBe(hex(keys.stateKey));
    expect(rows(two)).not.toContain(`${hex(keys.stateKey)} -1`);
    expect(rows(two)).not.toContain(`${hex(keys.zswapStateKey)} -1`);
    // A block given no contracts persists none.
    const three = await step(engine, nodes, input(3n, 0));
    expect(three.contracts).toEqual([]);
    expect(rows(three)).toEqual([`${hex(three.stateKey)} 1`, `${hex(two.stateKey)} -1`].sort());
  });

  it("loads a retained state by its key aside, leaving the states it holds as they are", { timeout: LONG }, async () => {
    const { engine, nodes, zero } = await started("v9");
    const one = await step(engine, nodes, input(1n, 1, { release: [] }), [zswapOutputTransaction(RAW.v9)]);
    await engine.parse("v9", at(2n), [zswapOutputTransaction(RAW.v9)]);
    const pending = await engine.apply(input(2n, 1, { release: [] }));
    const retained = await engine.retained({ ledger: "v9", ...at(0n), stateKey: zero.stateKey });
    expect(hex(retained.stateRoot)).toBe(hex(zero.stateRoot));
    expect(engine.holds()).toMatchObject({ committed: at(1n), pending: at(2n) });
    expect(await engine.apply(input(2n, 1, { release: [] }))).toBe(pending);
    // In a fresh engine the nodes come from the store.
    const fresh = new LedgerEngine({ load: loadLedgerPackage, store: nodes });
    expect(hex((await fresh.retained({ ledger: "v9", ...at(1n), stateKey: one.stateKey })).stateRoot)).toBe(hex(one.stateRoot));
    expect(fresh.holds()).toMatchObject({ committed: null, pending: null });
  });
});
