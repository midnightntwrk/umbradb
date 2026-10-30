import { describe, expect, it } from "vitest";
import { firstRegularAtParentTime, parentTimestampMs } from "../../src/ledger/replay.js";

// Which blocks accept their first regular transaction at the parent's time + 12 s, decided by the runtime that built
// the block (its `MNSV` `spec_version`), and the parent time a block is applied with. The table is the requirement's,
// written out here from the official indexer's ranges (`midnight-indexer`
// `indexer-common/src/domain/protocol_version.rs`, `chain-indexer/src/domain/ledger_state.rs`
// `node_skews_first_regular_tblock`, `should_bump_first_regular_tblock`), not from the code under test. [LG-8]

describe("LG-8's replay rules", () => {
  it("bumps the first regular transaction for runtimes 0.22, 1.0 below 1.0.300 and 2.0, never at block 0", () => {
    const rows: readonly [number, boolean][] = [
      [22_000, true],
      [22_999, true],
      [21_999, false],
      [23_000, false],
      [999_999, false],
      [1_000_000, true],
      [1_000_299, true],
      [1_000_300, false],
      [1_000_999, false],
      [1_001_000, false],
      [1_999_999, false],
      [2_000_000, true],
      [2_000_999, true],
      [2_001_000, false],
      [2_001_999, false],
      [2_002_000, false],
      [0, false],
      [4_294_967_295, false],
    ];
    for (const [specVersion, bumped] of rows) {
      expect(firstRegularAtParentTime(1n, specVersion), `spec_version ${specVersion} at height 1`).toBe(bumped);
      expect(firstRegularAtParentTime(10_000_000n, specVersion), `spec_version ${specVersion} later`).toBe(bumped);
      expect(firstRegularAtParentTime(0n, specVersion), `spec_version ${specVersion} at block 0`).toBe(false);
    }
  });

  it("applies a block with its parent's time, or its own when the parent has none (block 0's, time 0)", () => {
    expect(parentTimestampMs(1_750_000_000_000n, 1_750_000_006_000n)).toBe(1_750_000_000_000n);
    expect(parentTimestampMs(0n, 1_750_000_006_000n)).toBe(1_750_000_006_000n);
    expect(parentTimestampMs(null, 1_750_000_006_000n)).toBe(1_750_000_006_000n);
    expect(parentTimestampMs(null, 0n)).toBe(0n);
  });
});
