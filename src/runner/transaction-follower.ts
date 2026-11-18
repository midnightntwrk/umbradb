/**
 * The follower of each block's transaction. The finalized loop (`./loop.ts`) tells a follower the process gives it (the
 * ledger worker's host, `../ledger/worker/host.ts`, when the process has one) what became of each block's transaction,
 * as facts, where they happen:
 * - `written` once the block's rows are in the open transaction: its `on-db-write` and `on-settle` callbacks ended and
 *   the cursor check accepted the cursor;
 * - `committed` wherever the loop knows the block committed: the `COMMIT` that holds it answered, the cursor read after
 *   a lost answer found it committed, or, at a run's start, it is the cursor's block, committed before the run; once
 *   per block per loop: the same loop run again after a retry re-delivers the cursor's block without telling it again,
 *   while a new loop (a restart) tells it at its re-delivery;
 * - `rolledBack` once per transaction that did not commit: a failure before its `COMMIT` (or a `COMMIT` that answered
 *   with an error), the lockstep wait stopping the loop before it, or the cursor read after a lost answer finding the
 *   block before it as the cursor; and for a block whose `on-fetch` or `on-parse` failed in a source's queue, once the
 *   loop takes its height.
 *
 * After a `COMMIT` whose answer was lost the follower is told nothing until the loop's cursor read decides; an
 * unexpected cursor there halts processing and tells nothing, the outcome not being known. Whether the answer was lost
 * is the database's error, whatever failure the loop reports: a misuse recorded during the `COMMIT` is reported first
 * and halts, and nothing is told of the block then. A stop while such a block is
 * held (the process's back-off before that read) tells nothing either: the block is settled by the next start's
 * cursor read, which tells the follower `committed` when it committed.
 */

/** A block as the follower is told of it: its height and hash. */
export interface FollowedBlock {
  readonly height: bigint;
  readonly hash: Uint8Array;
}

/** What the loop tells of each block's transaction (see the module comment): facts, never requests. None may throw. */
export interface TransactionFollower {
  /**
   * The block's rows are in the open transaction: its `on-db-write` and `on-settle` callbacks and the cursor check
   * ended.
   */
  written(block: FollowedBlock): void;
  /**
   * The `COMMIT` that holds the block answered; or the cursor read after a lost answer found it committed; or, at a
   * run's start, it is the cursor's block, committed before the run.
   */
  committed(block: FollowedBlock): void;
  /**
   * The block will not be committed by the transaction it was processed for: that transaction ended without committing,
   * or the block's run ended before it was written (a failure, the lockstep wait stopping the loop).
   */
  rolledBack(block: FollowedBlock): void;
}
