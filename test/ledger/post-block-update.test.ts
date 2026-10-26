import { readFileSync } from "node:fs";
import { beforeAll, describe, expect, it } from "vitest";
import { loadLedgerPackage } from "../../src/ledger/load.js";
import type { LedgerPackage } from "../../src/ledger/types.js";
import { block, contractFixture, fromHex, hex, type Ledger, NETWORK_ID, RAW, systemTransaction } from "./adapter-fixtures.js";
import {
  costOf,
  expectAdapterUpdates,
  expectChainFailureSkipped,
  expectNodeFullness,
  expectNodeState,
  expectSystemTransactionCosts,
  fullnessOf,
  ORACLE,
  oracleCase,
  publishedFullness,
  publishedUpdate,
  sha256Hex,
  T0_DATE,
} from "./post-block-update-checks.js";

// Task 12.1a of `openspec/changes/core-arch` (A151; LG-5, LG-8, LG-15; owner decision Q113 A): the node's end-of-block
// update in the vendored ledger packages (`postBlockUpdateExact`, `blockFullness`, `systemTransactionCost`, from
// `vendor/ledger/v8/patches/0004-…` and `v9/patches/0006-…`) and in the adapters' `apply`, against the node's arithmetic
// at the pinned revisions (`fixtures/post-block-update/`); and the chain outcomes `apply` takes.

const LONG = 120_000;
const UPSTREAM = (ledger: Ledger): { commit: string; versionName: string } =>
  JSON.parse(readFileSync(new URL(`../../vendor/ledger/${ledger}/upstream.json`, import.meta.url), "utf8")) as {
    commit: string;
    versionName: string;
  };

describe("the oracle's values: the node's arithmetic at the vendored ledger revisions", () => {
  for (const ledger of ["v8", "v9"] as const) {
    it(`${ledger}: were computed at the commit the vendored package is built from, for a blank state like the package's`, () => {
      const oracle = ORACLE[ledger];
      expect([oracle.release, oracle.commit]).toEqual([UPSTREAM(ledger).versionName, UPSTREAM(ledger).commit]);
      const blank = RAW[ledger].LedgerState.blank(NETWORK_ID);
      expect(hex(RAW[ledger].stateRoot(blank))).toBe(oracle.blankStateRoot);
      expect(sha256Hex(blank.parameters.serialize())).toBe(oracle.blankParametersSha256);
      expect(costOf(oracle.limits)).toEqual({
        readTime: 10n ** 12n,
        computeTime: 10n ** 12n,
        blockUsage: 200_000n,
        bytesWritten: 50_000n,
        bytesChurned: 1_000_000n,
      });
    });
  }
});

for (const ledger of ["v8", "v9"] as const) {
  const raw = RAW[ledger];

  describe(`${ledger} package: the node's post-block update, with no JavaScript number in between (A151)`, () => {
    for (const entry of ORACLE[ledger].cases) {
      it(`${entry.name}: the node's FixedPoint fullness, fee prices and state root`, () => {
        const blank = raw.LedgerState.blank(NETWORK_ID);
        const cost = costOf(entry.cost);
        expectNodeFullness(raw.blockFullness(blank.parameters, cost), entry, ledger);
        expectNodeState(raw, raw.postBlockUpdateExact(blank, T0_DATE, cost), entry.exact, `${ledger}, ${entry.name}`);
      });
    }

    it("gives a deploy's block usage of 2,635 of 200,000 as the node's FixedPoint(243035853171123343)", () => {
      const cost = costOf(oracleCase(ledger, "a deploy's block usage: 2,635 of 200,000").cost);
      const blank = raw.LedgerState.blank(NETWORK_ID);
      expect(raw.blockFullness(blank.parameters, cost).blockUsage).toBe(243_035_853_171_123_343n);
      expect(publishedFullness(raw, cost).blockUsage, "the published API's round trip").toBe(243_035_853_171_123_328n);
    });

    it("clamps a block above its limits to them, as the node does, where the published API refuses it", () => {
      const ONE = 2n ** 64n;
      for (const name of ["above the limits in four dimensions", "the largest sum, every dimension saturated"]) {
        const cost = costOf(oracleCase(ledger, name).cost);
        const blank = raw.LedgerState.blank(NETWORK_ID);
        const fullness = raw.blockFullness(blank.parameters, cost);
        expect([fullness.readTime, fullness.blockUsage, fullness.bytesWritten, fullness.overall], name).toEqual([
          ONE,
          ONE,
          ONE,
          ONE,
        ]);
        expect(() => raw.postBlockUpdateExact(blank, T0_DATE, cost)).not.toThrow();
        expect(() => blank.parameters.normalizeFullness(cost), name).toThrow(/exceeded block limits/);
      }
    });

    it("refuses a fullness that is not a cost", () => {
      const blank = raw.LedgerState.blank(NETWORK_ID);
      const tooLarge = { ...costOf(oracleCase(ledger, "an empty block").cost), blockUsage: 2n ** 64n };
      expect(() => raw.postBlockUpdateExact(blank, T0_DATE, tooLarge)).toThrow();
      expect(() => raw.blockFullness(blank.parameters, { readTime: 1n } as never)).toThrow();
    });

    it("systemTransactionCost is the node's cost of each system transaction", () => {
      for (const system of ORACLE[ledger].systemTransactions) {
        const blank = raw.LedgerState.blank(NETWORK_ID);
        const transaction = raw.SystemTransaction.deserialize(fromHex(system.bytes));
        expect(raw.systemTransactionCost(transaction, blank.parameters), system.name).toEqual(costOf(system.cost));
      }
      expect(hex(systemTransaction(ledger))).toBe(ORACLE[ledger].systemTransactions[0]!.bytes);
    });

    it("the published API's round trip is the one the oracle computes, for the cases within the limits", () => {
      for (const entry of ORACLE[ledger].cases) {
        if (entry.roundTrip === null) continue;
        const cost = costOf(entry.cost);
        expect(publishedFullness(raw, cost), entry.name).toEqual(fullnessOf(entry.roundTrip.fullness));
        expectNodeState(raw, publishedUpdate(raw, cost), entry.roundTrip, `${ledger}, ${entry.name} (round trip)`);
      }
    });
  });

  describe(`${ledger} adapter: the post-block update and the chain outcomes in apply (A151)`, () => {
    let adapter: LedgerPackage;
    beforeAll(async () => {
      adapter = await loadLedgerPackage(ledger, { networkId: NETWORK_ID });
    });

    it("gives the node's fee prices after blocks of a deploy, a deploy and a call, and twenty deploys above the limits", {
      timeout: LONG,
    }, async () => {
      await expectAdapterUpdates(adapter, ledger);
    });

    it("adds each system transaction's cost to the block's fullness", { timeout: LONG }, async () => {
      await expectSystemTransactionCosts(adapter, ledger);
    });

    it("skips an extrinsic the chain reports failed, as the official indexer does", { timeout: LONG }, async () => {
      await expectChainFailureSkipped(adapter, ledger);
    });

    it("skips a system transaction the chain reports failed, and replays a partial or successful one as the ledger decides", {
      timeout: LONG,
    }, async () => {
      const skipped = adapter.apply(adapter.emptyState(), block([systemTransaction(ledger)], { outcomes: ["failure"] }));
      expect(skipped.output.results).toEqual([{ outcome: "failure", segments: [] }]);
      const empty = adapter.apply(adapter.emptyState(), block([]));
      expect(hex(adapter.stateRoot(skipped.state))).toBe(hex(adapter.stateRoot(empty.state)));

      const { deploy } = await contractFixture(raw);
      const unknown = adapter.apply(adapter.emptyState(), block([deploy]));
      for (const outcome of ["success", "partial"] as const) {
        const told = adapter.apply(adapter.emptyState(), block([deploy], { outcomes: [outcome] }));
        expect(told.output, outcome).toEqual(unknown.output);
        expect(hex(adapter.stateRoot(told.state)), outcome).toBe(hex(adapter.stateRoot(unknown.state)));
      }
    });

    it("refuses outcomes that are not one per transaction", () => {
      for (const outcomes of [[], ["success", "success"]] as const) {
        expect(() => adapter.apply(adapter.emptyState(), block([systemTransaction(ledger)], { outcomes }))).toThrow(
          /block 1: \d chain outcomes for 1 transactions/,
        );
      }
    });
  });
}

