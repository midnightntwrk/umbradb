import { beforeAll, describe, expect, it } from "vitest";
import * as v8 from "../../vendor/ledger/v8/pkg/midnight_ledger_wasm_fs.js";
import * as v9 from "../../vendor/ledger/v9/pkg/midnight_ledger_wasm_v9_fs.js";
import { loadLedgerPackage } from "../../src/ledger/load.js";
import type { LedgerPackage } from "../../src/ledger/types.js";
import { createV8Adapter } from "../../src/ledger/v8.js";
import { createV9Adapter } from "../../src/ledger/v9.js";
import { NETWORK_ID, RAW } from "./adapter-fixtures.js";
import {
  costOf,
  expectAdapterUpdates,
  expectChainFailureSkipped,
  expectNodeFullness,
  expectNodeState,
  expectSystemTransactionCosts,
  ORACLE,
  publishedFullness,
  publishedUpdate,
} from "./post-block-update-checks.js";

/**
 * The committed negative controls of A151's clauses (task 12.1a, owner decision Q113 A): a wrong path or a wrong
 * adapter, each of which must make the check `post-block-update.test.ts` runs (`post-block-update-checks.ts`) fail; the
 * real ones pass the same checks in this file's build.
 *
 * - **The round trip** — the published `normalizeFullness` and `postBlockUpdate`, which pass the fullness through
 *   JavaScript numbers — gives another `FixedPoint` fullness, and so other fee prices and another state root, for
 *   every case of the table whose fullness a number cannot hold (the 2,635 of 200,000 among them), and refuses the
 *   cases above the limits.
 * - **An adapter that leaves the system transactions' cost out of the fullness** fails "adds each system
 *   transaction's cost".
 * - **An adapter that ignores the chain outcome** applies the extrinsic the chain reports failed, and fails "an
 *   extrinsic the chain reports failed is skipped".
 * - **An adapter on the published post-block update** (the round trip inside `apply`) fails the adapter's fee prices.
 *
 * A package file changed by one byte refusing startup with `package-hash-mismatch` (A97) is
 * `package-identity.test.ts`'s and `version.negative-control.test.ts`'s, which run on the rebuilt packages.
 */

/** The assertion error a check fails with; fails the test if the check passes or fails otherwise. */
async function assertionFailure(check: () => unknown): Promise<Error> {
  try {
    await check();
  } catch (error) {
    if (error instanceof Error && error.name === "AssertionError") return error;
    throw error;
  }
  throw new Error("the check passed against a wrong path or adapter");
}

const ZERO = { readTime: 0n, computeTime: 0n, blockUsage: 0n, bytesWritten: 0n, bytesChurned: 0n };

/** The adapter of `ledger` over its package with some of the package's functions replaced. */
function adapterOver(ledger: "v8" | "v9", replaced: Record<string, unknown>): LedgerPackage {
  return ledger === "v8"
    ? createV8Adapter({ ...v8, ...replaced } as typeof v8, { networkId: NETWORK_ID })
    : createV9Adapter({ ...v9, ...replaced } as typeof v9, { networkId: NETWORK_ID });
}

/** The published post-block update in place of the node's, as task 12.1's adapter had it. */
function publishedPostBlockUpdate(ledger: "v8" | "v9") {
  return (state: v9.LedgerState, tblock: Date, fullness: v9.SyntheticCost): v9.LedgerState => {
    const normalized = state.parameters.normalizeFullness(fullness);
    const overall = Math.max(...Object.values(normalized));
    return (state as v9.LedgerState).postBlockUpdate(tblock, normalized, overall) as never;
  };
}

for (const ledger of ["v8", "v9"] as const) {
  const raw = RAW[ledger];

  describe(`${ledger}: A151's negative controls`, () => {
    let real: LedgerPackage;
    beforeAll(async () => {
      real = await loadLedgerPackage(ledger, { networkId: NETWORK_ID });
    });

    it("the real package and adapter pass every check in this file's build", { timeout: 240_000 }, async () => {
      for (const entry of ORACLE[ledger].cases) {
        const blank = raw.LedgerState.blank(NETWORK_ID);
        expectNodeFullness(raw.blockFullness(blank.parameters, costOf(entry.cost)), entry, ledger);
        expectNodeState(raw, raw.postBlockUpdateExact(blank, new Date(1_750_000_000_000), costOf(entry.cost)), entry.exact, entry.name);
      }
      await expectAdapterUpdates(real, ledger);
      await expectSystemTransactionCosts(real, ledger);
      await expectChainFailureSkipped(real, ledger);
    });

    it("the round trip gives another FixedPoint fullness and other fee prices wherever a number cannot hold the fullness, and refuses a block above the limits", async () => {
      const lostFullness: string[] = [];
      const lostState: string[] = [];
      for (const entry of ORACLE[ledger].cases) {
        const cost = costOf(entry.cost);
        if (entry.roundTrip === null) {
          expect(() => publishedFullness(raw, cost), entry.name).toThrow(/exceeded block limits/);
          continue;
        }
        const found = publishedFullness(raw, cost);
        if (Object.entries(found).some(([key, value]) => value !== BigInt(entry.exact.fullness[key as keyof typeof found]))) {
          lostFullness.push(entry.name);
          await assertionFailure(() => expectNodeFullness(found, entry, ledger));
        }
        if (entry.roundTrip.parametersSha256 !== entry.exact.parametersSha256) {
          lostState.push(entry.name);
          await assertionFailure(() => expectNodeState(raw, publishedUpdate(raw, cost), entry.exact, entry.name));
        }
      }
      expect(lostFullness, "the cases whose FixedPoint fullness the round trip loses").toEqual(LOST);
      expect(lostState, "the cases whose fee prices and state root the round trip loses").toEqual(LOST);
    });

    it("an adapter on the published post-block update fails the adapter's fee prices", { timeout: 120_000 }, async () => {
      const wrong = adapterOver(ledger, { postBlockUpdateExact: publishedPostBlockUpdate(ledger) });
      await assertionFailure(() => expectAdapterUpdates(wrong, ledger));
    });

    it("an adapter that leaves the system transactions' cost out fails \"adds each system transaction's cost\"", async () => {
      const wrong = adapterOver(ledger, { systemTransactionCost: () => ZERO });
      await assertionFailure(() => expectSystemTransactionCosts(wrong, ledger));
    });

    it("an adapter that ignores the chain outcome applies a failed extrinsic and fails the skip", { timeout: 120_000 }, async () => {
      const wrong: LedgerPackage = { ...real, apply: (state, input) => real.apply(state, { ...input, outcomes: undefined }) };
      await assertionFailure(() => expectChainFailureSkipped(wrong, ledger));
    });
  });
}

/**
 * The table's cases whose `FixedPoint` fullness, and with it the fee prices and the state root, the round trip loses:
 * every case within the limits but those whose every `FixedPoint` a JavaScript number holds exactly (zero, one half,
 * one, and one picosecond of a second's read time, 18,446,745 × 2^-64, an integer below 2^53 over a power of two).
 */
const LOST = [
  "a deploy's block usage: 2,635 of 200,000",
  "every dimension, no value a round fraction",
  "a block of one deploy",
  "a block of a deploy and a call",
  "a block of the system transaction, a deploy and a call",
];
