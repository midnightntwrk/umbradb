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
 * every point of a block still runs after the block before committed.
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
 * which it flushes again and the computation counts as written again unchanged. No eviction is sent between n's apply
 * and n's own settle, so no later eviction needs checking. Two things remain to check, at n's `on-compute`
 * (`core-ledger-state.ts`):
 * 1. **The same input** ({@link sameApplyInput}): the input built ahead, from n's own `block` items and what n − 1's
 *    rows hold, equals the input built at n's turn.
 * 2. **The same worker thread**: the thread that applied it has not been replaced since (`LedgerHost.restarts`).
 *
 * **When the block before turns out not to be the committed one.** The result rests on n − 1 committing as the state
 * the worker applied n on, in the same process and on the same writer session, as the other memories kept from one
 * block to the next do (`BlockContext.continues`). So it is used only when n's block context says it continues n − 1.
 * It is dropped, and n applied at its turn, when n − 1's `on-settle` threw (at once), when n − 1 is made again or n
 * does not continue it (a failure after the settle, a `COMMIT` whose answer was lost, a replaced writer session: the
 * `on-compute` that follows sees `continues` false), when the thread was replaced (a refused eviction's restart, a trap
 * ahead), and when the apply ahead failed.
 *
 * **What a dropped result leaves in the worker.** The thread that applied n ahead holds n's state pending, and asked for
 * n again, marked ahead or not, gives that result back (the same block again, `src/ledger/worker/engine.ts`): it cannot
 * apply n anew, since its package counts the first apply's flush stored. So a dropped result is kept, never as a result,
 * for what it says the worker holds: at n's turn, when that thread is still the worker's and the turn's input differs
 * (or names another block), the thread is restarted first, and the new one loads the state after n − 1 from the
 * database. With the same input the worker's pending result is the result of an apply at n's turn by the argument
 * above. A block made again sends the apply of the block after it again when the runner has that block prepared (the
 * node source prepares the heights above a retried height only once the loop asks for the next one, so usually it has
 * not), and the worker answers it from what it holds.
 *
 * The `core` entry's `applyAhead` turns it on and off: on unless set to false ({@link applyAheadOf}).
 */

import { latestBuildCoreEntry } from "../../config/process.js";
import type { CheckedConfig } from "../../config/validate.js";
import type { AppliedState, ApplyBlock, BlockId } from "../../ledger/worker/engine.js";

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

/** Whether two plain values (what an apply's input holds) are equal: bytes by content, arrays and objects by member. */
function plainEqual(a: unknown, b: unknown): boolean {
  if (a === b) return true;
  if (a instanceof Uint8Array || b instanceof Uint8Array) {
    return a instanceof Uint8Array && b instanceof Uint8Array && a.length === b.length && a.every((byte, i) => byte === b[i]);
  }
  if (Array.isArray(a) || Array.isArray(b)) {
    return Array.isArray(a) && Array.isArray(b) && a.length === b.length && a.every((item, i) => plainEqual(item, b[i]));
  }
  if (a === null || b === null || typeof a !== "object" || typeof b !== "object") return false;
  const left = Object.entries(a).filter(([, value]) => value !== undefined);
  const right = new Map(Object.entries(b).filter(([, value]) => value !== undefined));
  return left.length === right.size && left.every(([key, value]) => right.has(key) && plainEqual(value, right.get(key)));
}

/** Whether `ahead` and `now` are the same apply input, the `ahead` mark apart (rule 1 of the module comment). */
export function sameApplyInput(ahead: ApplyBlock, now: ApplyBlock): boolean {
  const { ahead: _a, ...left } = ahead;
  const { ahead: _b, ...right } = now;
  return plainEqual(left, right);
}

/**
 * `input` without its `ahead` mark, as a copy that owns every byte string it holds: the buffers it was built from are
 * the block context's and the kept block's, which another module may change before the block's turn.
 */
export function ownedApplyInput(input: ApplyBlock): ApplyBlock {
  const { ahead: _mark, ...rest } = input;
  return ownedCopy(rest) as ApplyBlock;
}

/**
 * A copy of the plain value `value`: each byte string copied to a buffer of its own length (a view into a larger buffer
 * keeps none of it), arrays and objects member by member.
 */
function ownedCopy(value: unknown): unknown {
  if (value instanceof Uint8Array) return Uint8Array.from(value);
  if (Array.isArray(value)) return value.map(ownedCopy);
  if (value !== null && typeof value === "object") return Object.fromEntries(Object.entries(value).map(([key, member]) => [key, ownedCopy(member)]));
  return value;
}
