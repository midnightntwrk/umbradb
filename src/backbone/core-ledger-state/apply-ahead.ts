/**
 * The next block applied ahead: what `core-ledger-state` keeps of the apply it sends before the block's turn, and the
 * rules that decide whether its result is used. Core.
 *
 * **What runs ahead, and when.** A block's transaction holds its rows' writes, its reclamation (`on-settle`), the
 * cursor check and its `COMMIT`; the ledger worker had nothing to do meanwhile, and applied the next block only at that
 * block's `on-compute`. Now block h's `on-settle` sends the apply of h + 1, marked ahead (`ApplyBlock.ahead`), right
 * after it sent h's eviction (right after its computation when it evicts nothing), so the worker applies h + 1 on the
 * pending state after h while the main thread writes h's net change, commits, and runs h + 1's points before its
 * `on-compute`. h + 1's `on-compute` takes the result where it would have asked for the apply. Nothing else moves:
 * no point moves (a block's `on-fetch` and `on-parse` may run before the block before it committed, as they did).
 *
 * **The rule.** No block above a settle point is applied before that settle's eviction has been sent to the worker.
 * Every block is a settle point (a run is one block), so at most one block is applied ahead, and only by its parent's
 * settle, after that settle's eviction.
 *
 * **Why such a result is the result of an apply at the block's turn.** The apply of n is sent by n − 1's settle after
 * that settle's eviction, and every settle below sent its own before; the worker runs requests in the order sent
 * (`src/ledger/worker/run.ts`), so when it applies n its package has forgotten every node those settles deleted. Every
 * node it believes stored was flushed by a block up to n − 1 and not deleted since, so it is stored once n − 1 commits.
 * A flush leaves out only what the package believes stored, so each node n's batch leaves out is stored after n − 1:
 * the batch is the one an apply after n − 1's `COMMIT` gets, but for nodes a rolled-back settle had the package forget,
 * which it flushes again and the computation counts as written again unchanged. One eviction can be sent between n's
 * apply and n's own settle: that of n − 1 made again after its transaction failed, which names the keys the first one
 * named; the package forgets them again, or refuses, and the thread is restarted (`docs/research/apply-ahead.md`,
 * section 3). Two things remain to check, at n's `on-compute` (`core-ledger-state.ts`):
 * 1. **The same input** ({@link sameApplyInput}): the input built ahead, from n's own `block` items and what n − 1's
 *    rows hold, equals the input built at n's turn. The worker's engine makes the same comparison on the input it kept
 *    with the pending state, and refuses another input (`ApplyNeedsNewThread`).
 * 2. **The same worker thread**: the thread that applied it has not been replaced since (`LedgerHost.restarts`).
 *
 * **When the block before turns out not to be the committed one.** The result rests on n − 1 committing as the state
 * the worker applied n on, in the same process and on the same writer session, as the other memories kept from one
 * block to the next do (`BlockContext.continues`). So it is used only when n's block context says it continues n − 1.
 * It is dropped, and n applied at its turn, when n − 1's `on-settle` threw (at once), when n − 1 is made again or n
 * does not continue it (a failure after the settle, a `COMMIT` whose answer was lost, a replaced writer session: the
 * `on-compute` that follows sees `continues` false), when the thread was replaced (a refused eviction's restart, a trap
 * ahead), and when the apply ahead failed. An apply ahead that failed after its state was made leaves a part of it in
 * the package: the engine then applies no block in that thread, and n's apply at its turn is refused
 * (`ApplyNeedsNewThread`), restarts the thread and runs in the new one.
 *
 * **What a dropped result leaves in the worker.** The thread that applied n ahead holds n's state pending, and asked for
 * n again with the same input, marked ahead or not, gives that result back (the same block again,
 * `src/ledger/worker/engine.ts`): it cannot apply n anew, since its package counts the first apply's flush stored. So a
 * dropped result is kept, never as a result, for what it says the worker holds, until n has been applied: at n's turn,
 * when that thread is still the worker's and the turn's input differs (or names another block), the thread is restarted
 * first, and the new one loads the state after n − 1 from the database. With the same input the worker's pending result
 * is the result of an apply at n's turn by the argument above. The settle of a block made again sends no second apply
 * of the block after it to a thread that may hold it (the node source prepares the heights above a retried height only
 * once the loop asks for the next one, so usually it has none prepared), and what was kept stays.
 *
 * The `core` entry's `applyAhead` turns it on and off: on unless set to false ({@link applyAheadOf}).
 */

import { latestBuildCoreEntry } from "../../config/process.js";
import type { CheckedConfig } from "../../config/validate.js";
import { type AppliedState, type ApplyBlock, type BlockId, ownedInput, sameInput } from "../../ledger/worker/engine.js";

/** The setting's default (`src/config/core-settings.ts`). */
export const APPLY_AHEAD_DEFAULT = true;

/**
 * Whether the process applies the next block ahead: an operational setting, so the one of the latest `core` revision of
 * the build's version (`src/config/process.ts`); the default when that revision does not give it.
 */
export function applyAheadOf(config: Pick<CheckedConfig, "entries">): boolean {
  const settings = latestBuildCoreEntry(config)?.settings as { readonly applyAhead?: unknown } | null | undefined;
  return typeof settings?.applyAhead === "boolean" ? settings.applyAhead : APPLY_AHEAD_DEFAULT;
}

/** The apply of a block sent ahead by the settle of the block before it (see the module comment). */
export interface AheadApply {
  /** The block it was applied on top of: the block whose settle sent it. */
  readonly on: BlockId;
  /** The block applied. */
  readonly block: BlockId;
  /** The input the worker was given, without its `ahead` mark, as copies this record owns. */
  readonly input: ApplyBlock;
  /** The worker's restarts when it was sent (`LedgerHost.restarts`). */
  readonly restarts: number;
  /** The apply's result, or its failure; never rejects. */
  readonly result: Promise<AppliedState | Error>;
}

/**
 * Whether `ahead` and `now` are the same apply input, the `ahead` mark apart (rule 1 of the module comment): the
 * comparison the worker's engine makes for a pending block asked for again (`sameInput`).
 */
export function sameApplyInput(ahead: ApplyBlock, now: ApplyBlock): boolean {
  return sameInput(ahead, now);
}

/**
 * `input` without its `ahead` mark, as a copy that owns every byte string it holds: the buffers it was built from are
 * the block context's and the kept block's, which another module may change before the block's turn.
 */
export function ownedApplyInput(input: ApplyBlock): ApplyBlock {
  return ownedInput(input);
}
