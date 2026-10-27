import { beforeAll, describe, expect, it } from "vitest";
import { loadLedgerPackage } from "../../src/ledger/load.js";
import type { LedgerPackage, StateSummary } from "../../src/ledger/types.js";
import { type Ledger, NETWORK_ID } from "./adapter-fixtures.js";
import { stateTreesProblems } from "./state-trees-checks.js";

/**
 * The committed negative control of task 12.1b (A158; LG-16; owner decision Q138 A): an export that reads a tree's root
 * from the wrong tree — the DUST commitment tree's root taken from the zswap commitment tree — fails A158's check
 * (`./state-trees-checks.ts`) against the ledger's own values, on every vendored version; the real adapter passes the
 * same check here. (The DUST generation tree's root taken from the DUST commitment tree fails it too.)
 */

const LONG = 240_000;
const LEDGERS = ["v8", "v9-rc3", "v9"] as const satisfies readonly Ledger[];

for (const ledger of LEDGERS) {
  describe(`${ledger}: A158's check fails on a root read from the wrong tree`, () => {
    let adapter: LedgerPackage;
    beforeAll(async () => {
      adapter = await loadLedgerPackage(ledger, { networkId: NETWORK_ID });
    }, LONG);

    const summaryWith = (wrong: (summary: StateSummary) => StateSummary) => (bytes: Uint8Array): StateSummary => {
      const state = adapter.genesisState(bytes);
      try {
        return wrong(adapter.stateSummary(state));
      } finally {
        adapter.dispose(state);
      }
    };

    it("the DUST commitment root taken from the zswap tree, or the DUST generation root from the commitment tree", () => {
      const zswapForDust = stateTreesProblems(ledger, summaryWith((s) => ({ ...s, dustCommitmentRoot: s.zswapRoot })));
      expect(zswapForDust.length).toBeGreaterThan(0);
      expect(zswapForDust.every((line) => line.includes("dustCommitmentRoot is "))).toBe(true);
      const commitmentForGeneration = stateTreesProblems(
        ledger,
        summaryWith((s) => ({ ...s, dustGenerationRoot: s.dustCommitmentRoot })),
      );
      expect(commitmentForGeneration.length).toBeGreaterThan(0);
      expect(stateTreesProblems(ledger, summaryWith((s) => s))).toEqual([]);
    });
  });
}
