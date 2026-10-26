/**
 * The block-level replay rules of LG-8 (`openspec/changes/core-arch/specs/ledger/spec.md` LG-8; task 12.3): which
 * blocks accept their first regular transaction at the parent's time + 12 s, and the parent time a block is applied
 * with — what `core-ledger-state` gives the adapter's `apply` (`ApplyInput.firstRegularAtParentTime`,
 * `parentTimestampMs`). The adapter applies the rule within the block (`./adapter.ts`). Pure: no Node.js import.
 */

/**
 * LG-8: true for a block after block 0 built by runtime 0.22 (`spec_version` 22,000 to 22,999), 1.0 below 1.0.300
 * (1,000,000 to 1,000,299) or 2.0 (2,000,000 to 2,000,999) — the runtime of its `MNSV` digest, not the one in its state,
 * which is newer at an upgrade's enactment block —, as the official indexer decides it (`midnight-indexer`
 * `chain-indexer/src/domain/ledger_state.rs` `node_skews_first_regular_tblock`, `should_bump_first_regular_tblock`;
 * `indexer-common/src/domain/protocol_version.rs` for the ranges). Every other runtime — 1.0 from 1.0.300, 2.1, and
 * any `spec_version` LG-8 does not name, which a custom network's table may map to a ledger — checks at the block time
 * only. Block 0's transactions never passed through the mempool: never.
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
 * The parent time a block is applied with, in milliseconds: its parent's, or — when the parent has none (block 0, whose
 * time is 0 without `Timestamp::set`, IN-7), and for block 0 itself (`null`) — the block's own, as the official indexer
 * applies it (`chain-indexer/src/application.rs`: a parent timestamp of 0 becomes the block's).
 */
export function parentTimestampMs(parentMs: bigint | null, ownMs: bigint): bigint {
  return parentMs === null || parentMs === 0n ? ownMs : parentMs;
}
