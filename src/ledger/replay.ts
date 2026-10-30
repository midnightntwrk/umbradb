/**
 * The block-level replay rules: which blocks accept their first regular transaction at the parent's time + 12 s, and
 * the parent time a block is applied with. `core-ledger-state` passes both to the adapter's `apply`
 * (`ApplyInput.firstRegularAtParentTime`, `parentTimestampMs`), and the adapter applies the rule within the block
 * (`./adapter.ts`). Pure: no Node.js import. [LG-8]
 */

/**
 * True for a block after block 0 built by one of these runtimes:
 *
 * - 0.22 (`spec_version` 22,000 to 22,999);
 * - 1.0 below 1.0.300 (1,000,000 to 1,000,299);
 * - 2.0 (2,000,000 to 2,000,999).
 *
 * The runtime is the one in the block's `MNSV` digest, not the one in its state, which is already newer at an upgrade's
 * enactment block. This is how the official indexer decides it (`midnight-indexer`
 * `chain-indexer/src/domain/ledger_state.rs` `node_skews_first_regular_tblock`, `should_bump_first_regular_tblock`;
 * `indexer-common/src/domain/protocol_version.rs` for the ranges). [LG-8]
 *
 * Every other runtime checks at the block time only: 1.0 from 1.0.300, 2.1, and any other `spec_version` a custom
 * network's table may map to a ledger. Block 0 is always false: its transactions never passed through the mempool.
 * [LG-8]
 */
export function firstRegularAtParentTime(height: bigint, specVersion: number): boolean {
  if (height === 0n) return false;
  return (
    (specVersion >= 22_000 && specVersion < 23_000) ||
    (specVersion >= 1_000_000 && specVersion < 1_000_300) ||
    (specVersion >= 2_000_000 && specVersion < 2_001_000)
  );
}

/**
 * The parent time a block is applied with, in milliseconds. It is the parent's time, except that the block's own time
 * is used when the parent has none (block 0, whose time is 0 without `Timestamp::set`) and for block 0 itself (`null`).
 * The official indexer does the same (`chain-indexer/src/application.rs`: a parent timestamp of 0 becomes the
 * block's). [IN-7]
 */
export function parentTimestampMs(parentMs: bigint | null, ownMs: bigint): bigint {
  return parentMs === null || parentMs === 0n ? ownMs : parentMs;
}
