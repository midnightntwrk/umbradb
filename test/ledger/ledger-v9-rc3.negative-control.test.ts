import { beforeAll, describe, expect, it } from "vitest";
import { loadLedgerPackage } from "../../src/ledger/load.js";
import type { LedgerPackage } from "../../src/ledger/types.js";
import { NETWORK_ID } from "./adapter-fixtures.js";
import { V8_PACKAGE_PATH, V9_PACKAGE_PATH } from "./ledger-states.js";
import { carriedLoadProblems, stagenetReplay } from "./v9-rc3-checks.js";

/**
 * Committed negative controls of task 12.2a (A159, A99; owner decision Q139 A): each runs a check of
 * `./v9-rc3-checks.ts` with one thing wrong and must see it fail, and the real packages pass the same check here.
 *
 * - **The old table** (runtime 2.0 → rc.5, what tasks 12.2 and 12.3 shipped): the rc.5 package replaying stagenet's
 *   runtime 2.0 blocks gives another root than the node's from block 1 on, the block of its first DUST generation — the
 *   adapter-level form of the stagenet tape's control ("A99's control" in `test/backbone/ledger-state.test.ts`).
 * - **A package that does not share rc.3's storage format**: the v8 package (another `LedgerState` type, under another
 *   tag) reads the state rc.3 stored by its key — the root of a state loaded by its key is that key, in any package —
 *   but not as rc.3's state: what it serializes is another, so A159's load check fails; the rc.5 package, which shares
 *   the format, passes.
 */

const LONG = 240_000;

describe("A159's and A99's checks fail on the wrong package, and pass on the right one", () => {
  let rc3: LedgerPackage;
  let rc5: LedgerPackage;
  beforeAll(async () => {
    [rc3, rc5] = await Promise.all([
      loadLedgerPackage("v9-rc3", { networkId: NETWORK_ID }),
      loadLedgerPackage("v9", { networkId: NETWORK_ID }),
    ]);
  }, LONG);

  it("the old table: the rc.5 package does not replay stagenet's runtime 2.0 blocks with the node's roots, from block 1", { timeout: LONG }, () => {
    const wrong = stagenetReplay(rc5);
    rc5.dispose(wrong.state);
    expect(wrong.problems.length).toBeGreaterThan(0);
    expect(wrong.problems[0]).toMatch(/^v9: the root after block 1 is /);
    const right = stagenetReplay(rc3);
    rc3.dispose(right.state);
    expect(right.problems).toEqual([]);
  });

  it("a package of another storage format (v8) does not load the state rc.3 stored; rc.5 does", { timeout: LONG }, async () => {
    const wrong = await carriedLoadProblems(rc3, V8_PACKAGE_PATH);
    expect(wrong.length).toBeGreaterThan(0);
    // A state loaded by its key has that key as its root in any package: the v8 package reads the root node under its
    // own types, and what it gives is not rc.3's state (its serialization is another).
    expect(wrong).toContain("the loaded state serializes otherwise than the stored one");
    expect(await carriedLoadProblems(rc3, V9_PACKAGE_PATH)).toEqual([]);
  });
});
