import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { loadLedgerPackage } from "../../src/ledger/load.js";
import type { LedgerPackage, StateSummary, StoredNode } from "../../src/ledger/types.js";
import { hex, type Ledger, NETWORK_ID, RAW } from "./adapter-fixtures.js";
import { AdapterWorkerHost, type LoadedState } from "./adapter-worker-host.js";
import { stateBytes, stateTreesProblems, TREES_ORACLE } from "./state-trees-checks.js";
import { STAGENET } from "./v9-rc3-checks.js";

/**
 * A158 (`openspec/changes/core-arch/acceptance.md` §12; LG-5, LG-16; owner decision Q138 A; task 12.1b): for each
 * vendored ledger package, the patched export `stateTrees(state)` gives a state's zswap first free index and root and
 * its DUST commitment and generation trees' first free indexes and roots exactly as the ledger's Rust state gives them
 * (`zswap.first_free`, `zswap.coin_coms.rehash().root()`, `dust.utxo.commitments_first_free`,
 * `dust.utxo.commitments.rehash().root()`, `dust.generation.generating_tree_first_free`,
 * `dust.generation.generating_tree.rehash().root()`, as the official indexer reads them), checked against the values
 * `fixtures/state-trees/oracle/` writes for fixed states at the vendored commits; and the adapters' `stateSummary`
 * gives all six, none null, as plain data — also for a state loaded from its stored nodes in a fresh worker. The
 * stored rows (`core_ledger_state.states`, none null at every height) are `test/backbone/`'s (A107, A99's ranges);
 * the rebuilt packages' `SHA256SUMS` are `vendored-ledger-files.test.ts`'s and `package-identity.test.ts`'s.
 */

const LONG = 240_000;
const LEDGERS = ["v8", "v9-rc3", "v9"] as const satisfies readonly Ledger[];
const sha256 = (bytes: Uint8Array): string => createHash("sha256").update(bytes).digest("hex");
const upstream = (ledger: Ledger): { commit: string; versionName: string } =>
  JSON.parse(readFileSync(new URL(`../../vendor/ledger/${ledger}/upstream.json`, import.meta.url), "utf8")) as {
    commit: string;
    versionName: string;
  };

/** The raw package's export, on the state its tagged serialization gives. */
function exported(ledger: Ledger): (bytes: Uint8Array) => StateSummary {
  const raw = RAW[ledger] as unknown as {
    LedgerState: { deserialize(bytes: Uint8Array): { free(): void } };
    stateTrees(state: unknown): StateSummary;
  };
  return (bytes) => {
    const state = raw.LedgerState.deserialize(bytes);
    try {
      return raw.stateTrees(state);
    } finally {
      state.free();
    }
  };
}

describe("the oracle's values: the ledger's Rust state at the vendored commits", () => {
  it("were computed at each commit a vendored package is built from, for the fixed states' very bytes", () => {
    for (const ledger of LEDGERS) {
      expect([TREES_ORACLE[ledger].release, TREES_ORACLE[ledger].commit], ledger).toEqual([
        upstream(ledger).versionName,
        upstream(ledger).commit,
      ]);
      for (const state of TREES_ORACLE[ledger].states) expect(sha256(stateBytes(state)), state.name).toBe(state.sha256);
    }
    // Every tree of the v9 states is filled, each root another: a value read from the wrong tree shows.
    for (const state of TREES_ORACLE.v9.states) {
      expect(new Set([state.zswapRoot, state.dustCommitmentRoot, state.dustGenerationRoot]).size, state.name).toBe(3);
    }
    // Each version has a state whose DUST trees' first free indexes differ (after DUST spends: preview after block 687
    // for v8, stagenet after block 4,950 for both v9 packages), so a first free index read from the other DUST tree
    // shows in every package.
    for (const ledger of LEDGERS) {
      const differing = TREES_ORACLE[ledger].states
        .filter((s) => s.dustCommitmentFirstFree !== s.dustGenerationFirstFree)
        .map((s) => s.name);
      expect(differing, ledger).toEqual([ledger === "v8" ? "preview-687" : "stagenet-4950"]);
    }
  });

  it("holds the states taken past genesis as their nodes gave them: each package's root of each is its node's", () => {
    expect(STAGENET.nodeRoots.get(3n)).toBe(TREES_ORACLE["v9-rc3"].states.find((s) => s.name === "stagenet-3")?.node?.stateRoot);
    const taken = LEDGERS.flatMap((ledger) => TREES_ORACLE[ledger].states.filter((s) => s.node !== undefined).map((s) => [ledger, s] as const));
    expect(taken.map(([ledger, s]) => `${ledger} ${s.name}`)).toEqual([
      "v8 preview-687",
      "v9-rc3 stagenet-3",
      "v9-rc3 stagenet-4950",
      "v9 stagenet-3",
      "v9 stagenet-4950",
    ]);
    for (const [ledger, state] of taken) {
      const raw = RAW[ledger];
      const loaded = raw.LedgerState.deserialize(stateBytes(state));
      expect(hex(raw.stateRoot(loaded)), `${ledger} ${state.name}`).toBe(state.node!.stateRoot);
      (loaded as unknown as { free(): void }).free();
    }
  });
});

for (const ledger of LEDGERS) {
  describe(`${ledger}: LG-16's tree values, the ledger's own (A158)`, () => {
    const host = new AdapterWorkerHost();
    let adapter: LedgerPackage;
    beforeAll(async () => {
      adapter = await loadLedgerPackage(ledger, { networkId: NETWORK_ID });
      await host.start();
    }, LONG);
    afterAll(() => host.stop());

    it("the package's stateTrees gives the six values of each fixed state as the ledger's Rust state gives them", () => {
      expect(stateTreesProblems(ledger, exported(ledger))).toEqual([]);
    });

    it("the adapter's stateSummary gives them, none null, as plain data", () => {
      expect(
        stateTreesProblems(ledger, (bytes) => {
          const state = adapter.genesisState(bytes);
          try {
            const summary = adapter.stateSummary(state);
            expect(structuredClone(summary)).toEqual(summary);
            expect(Object.values(summary)).not.toContain(null);
            return summary;
          } finally {
            adapter.dispose(state);
          }
        }),
      ).toEqual([]);
    });

    it("gives them for a state loaded from its stored nodes in a fresh worker", { timeout: LONG }, async () => {
      const store = new Map<string, StoredNode>();
      const summaries = new Map<string, StateSummary>();
      for (const state of TREES_ORACLE[ledger].states) {
        const held = adapter.genesisState(stateBytes(state));
        const key = adapter.stateKey(held);
        adapter.persist(key);
        for (const node of adapter.flush().inserts) store.set(hex(node.key), node);
        adapter.release(key);
        adapter.flush();
        adapter.dispose(held);
        const loaded = await host.run<LoadedState>({ op: "load", ledger, networkId: NETWORK_ID, key, nodes: [...store.values()] });
        expect(loaded.error, state.name).toBeUndefined();
        summaries.set(state.sha256, loaded.result!.summary!);
      }
      const bySha = (bytes: Uint8Array): StateSummary => summaries.get(sha256(bytes))!;
      expect(stateTreesProblems(ledger, bySha)).toEqual([]);
    });
  });
}
