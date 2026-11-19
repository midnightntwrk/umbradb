/**
 * The finalized loop: the runner's processing of finalized heights. It runs from the cursor + 1 (S on a new database)
 * up to the block source's finalized head, in order and without skipping one, then waits for the head to rise.
 *
 * **Per new head** the loop calls `on-finalized` once, before the head's heights, each callback with its own read handle
 * at the cursor. **Per height h**, it runs these steps through the point dispatch (`./dispatch.ts`), in the order of the
 * range of the resolved graph holding h:
 * 1. `on-fetch` and `on-parse`: the block context and an item sink, no database handle. On a private process each
 *    `on-fetch` callback also gets its own read of public data (the block source's `fetchRead`).
 * 2. `on-compute`: the block context, a read handle at h − 1 and an item sink. Each callback runs inside its own read
 *    (`Database.read`), so on PGlite a `db.read` from inside it fails with `nested-call` rather than waiting, and a
 *    callback's failing statement aborts no other callback's read.
 * 3. The block transaction: one `BEGIN … COMMIT` holding every `on-db-write` callback of h, each with its block write
 *    handle (`src/db/write-handles.ts`), in the point's fixed callback order. `core-block-commit` runs first and writes
 *    the cursor row (on a private process, `core-private-source` does). Then every `on-settle` callback, in the same
 *    order, each with the run of heights it settles and its block write handle. In this version a run is always one
 *    block, `{ first: h, last: h }`. Before the `COMMIT`, the loop checks that the block source's cursor is h with the
 *    block's hash. Nothing else of the loop writes.
 * 4. `on-after-db-write`: the block context without `block` items and a read handle at h, each callback in its own
 *    read.
 *
 * Between `on-parse` and `on-compute`, `on-start-height` runs for the entries starting at h: the core's parts when h is
 * S, then the modules one of whose segments of the graph (`ResolvedGraph.segments`) starts at h. Revisions that continue
 * each other are one segment, so a revision boundary starts nothing. Each callback gets a read at h − 1.
 *
 * After `on-after-db-write`, `on-stop-height` runs for the entries stopping at h: the modules one of whose segments ends
 * at h, in reverse order, then the core's parts when h is the core's stop. Each gets a read at h.
 *
 * **The lockstep wait.** Given {@link LoopInput.lockstep} (the core's bookkeeping of the private instances its `core`
 * entry lists in `lockstepInstances`, `src/private/lockstep.ts`), the loop awaits it for each height h after h's
 * `on-compute` and before h's block transaction, once every read of h has ended. Nothing is open while it waits, so a
 * private instance's reads through the core (on PGlite, its one queue) are served meanwhile. It resolves true once every
 * listed instance has committed h − 1, and the loop goes on to `BEGIN`. It resolves false when the loop's signal stopped
 * it first; h's transaction never began, and the loop ends with its signal, h not committed.
 *
 * **The pause between heights.** Given {@link LoopInput.pause}, the loop stops at each point between two heights while
 * a hold is kept (`./pause.ts`). These points are:
 * - before it reads the head: after the re-delivery at a run's start, after a head's last height, after a wait;
 * - before each height: after `on-finalized`, after the previous height's `on-stop-height`.
 *
 * No transaction is open there and every read of the previous height has ended. The wait for the head counts as between
 * heights: a hold asked for meanwhile is reached at once, and when the head rises the loop stops at its next step.
 * Paused, the loop reads no head, runs no point and has no slow-height window open. Its signal ends the pause, and the
 * loop then ends with it.
 *
 * **At a restart**, with the cursor c, the loop first runs `on-after-db-write` for c and `on-stop-height` for the
 * entries stopping at c (the core's when c is at or above its stop), before c + 1, because a crash may have come before
 * they completed. They run in the order of the range holding c, with the block context of c and no `block` items. Both
 * points run in series, so the range ending at the cursor, which startup checks for a cycle only, gives them their
 * order.
 *
 * **Where it ends.** The loop ends after the core's stop ({@link LoopInput.coreStop}); with the cursor already at or
 * above it, it processes nothing. It also ends after the height before an upgrade boundary ({@link LoopInput.boundary}),
 * the first height of a revision whose version this build does not carry. In both cases it commits that height,
 * completes its `on-after-db-write` and `on-stop-height`, and resolves with a {@link LoopEnd} saying which.
 *
 * Its signal stops it before the next height, or while it waits; the height in progress finishes. While a height's
 * block transaction is open (from its request until it has committed or rolled back),
 * {@link FinalizedLoop.blockTransaction} gives it: the process's stop closes the node client at once when none is open,
 * else once it settled (`./process.ts`).
 *
 * **The block context** of each callback holds the block's height, hash and parent hash, the `block` items published
 * before the callback started (`./block-context.ts`: a callback's puts are published when it completes), the calling
 * module's settings for the revision covering h, and whether a module's entry is active at h. At `on-after-db-write` it
 * holds no items. Its `continues` is true from `on-compute` to `on-after-db-write` when h − 1 was stored in the same run
 * of the loop ({@link FinalizedLoop.run}) — the `COMMIT` of h − 1 answered, or h − 1 was written in the chunk's
 * transaction h is written in, still open —, so no failure, retry, rollback or restart came between, and the writer's
 * session that wrote it is the one the writer has when the context is made (`Database.writerSession`; at
 * `on-compute` and `on-after-db-write` once the callback's read is open), so no other writer can have held the writer
 * lock since; false at a run's first height, for a held height processed again, for every height made again after a
 * chunk's rollback, and the height after one whose `COMMIT` lost its answer, at the re-delivery, from the first context
 * made after the writer's session was replaced (to the end of the height), and always at `on-fetch` and `on-parse`. A height some of whose callbacks were told true must commit
 * on that same session: when its transaction finds another, the attempt fails before its first `on-db-write` callback
 * with `connection-lost` (retryable, `cause` `writer-session-replaced`), and the height is made again, with
 * `continues` false. A session lost after the `COMMIT` makes the later `on-after-db-write` callbacks say false.
 *
 * **The transaction's follower** ({@link LoopInput.follower}: the process's ledger worker host, when it has one) is
 * told what became of each block's transaction (`./transaction-follower.ts`): `written` once h's body ended (its
 * `on-db-write` and `on-settle` callbacks, and the cursor check accepted the cursor), `committed` wherever the loop
 * knows h committed (the `COMMIT`'s answer, the cursor read after a lost one, the re-delivery of the cursor's block at a
 * run's start), and `rolledBack` once for a transaction that did not commit (a failure before the `COMMIT`, or of a
 * `COMMIT` that answered with an error; the lockstep wait stopping the loop; the cursor read after a lost `COMMIT`
 * finding the cursor before h), also for a height whose `on-fetch` or `on-parse` failed in a source's queue, told when
 * the loop takes that height. After a `COMMIT` whose answer was lost it is told nothing until that cursor read, and
 * nothing then either when the cursor is unexpected (neither h nor the one before it: processing halts without knowing
 * the outcome). Whether the answer was lost is the database's error, whatever failure the loop reports: a misuse
 * recorded during the `COMMIT` is reported first and halts, and the follower is told nothing of h then. A stop while such a height is held tells nothing: the next start's cursor read settles it, and its
 * re-delivery tells the follower when it committed. One loop tells a block committed once: a run again after a retry,
 * which re-delivers the cursor's block, does not tell it again.
 *
 * **Nothing is open while the loop waits** for the head: every read and the block transaction have ended.
 *
 * **Failures** stop the loop: {@link FinalizedLoop.run} rejects with a {@link HeightFailure} naming the height, whether
 * it committed and, for a callback's failure, the point and the module (the dispatch's `CallbackFailure`, with the error
 * itself as its cause).
 *
 * A use of a closed write handle, or a put from a kept item sink, is a callback error even when no callback rejects with
 * it (a timer, a module that catches it). The loop keeps the first, names its module and point, and fails the height in
 * progress before its `COMMIT`, or stops once the height's last point ended, or before the next height. The same holds
 * for a `publish` the process contexts refuse (`./process-context.ts`): they report it to the loop
 * ({@link LoopInput.misuses}), named by its module and the point the loop was dispatching, none while it waits.
 *
 * The halt (the state `halted` with its reason, the process staying up) and the retries of a lost connection or an
 * unreachable node, which run the loop again, belong to the process (`./process.ts`, `./failures.ts`).
 *
 * **A height held for a retry.** A retryable failure (`UmbraError.retryable`: `connection-lost`, `node-unreachable`,
 * directly or as a callback's) may stop h after its `on-parse` and before it committed. Then the loop keeps h
 * ({@link HeldHeight}): its block, its range, the cursor before it, its `block` items as `on-fetch` and `on-parse` left
 * them, the point it resumes at, and whether the failure came from the `COMMIT`. The process runs the same loop again
 * after its back-off, and that next run starts with h instead of the cursor's re-delivery:
 * 1. It reads the cursor inside a transaction, on the writer. After a lost connection that is a new session, which
 *    takes the writer lock again before anything else (`writer-lock-lost` when another process took it), so nothing can
 *    move the cursor after it is read. A failure of that read keeps h held for the run after.
 * 2. {@link FinalizedLoop.commitOutcome} reads the cursor:
 *    - h with the block's hash, after a failed `COMMIT`: h committed. The loop tells its observer, runs h's
 *      `on-after-db-write` and `on-stop-height`, and goes on from h + 1.
 *    - the cursor before h: h did not commit. h is processed again from `on-compute` with its kept items (those its
 *      earlier `on-compute` published are dropped), or from `on-start-height` when the failure came before
 *      `on-compute` began.
 *    - anything else halts with `unexpected-cursor` at h ({@link UnexpectedCursor}).
 *
 * Nothing is fetched or parsed again, and the cursor's `on-after-db-write`, which ran before h began, is not delivered
 * again. A retryable failure on the way to h (the head's read, its `on-finalized`) keeps h held for the run after. A
 * failure before `on-parse` ended holds nothing: the next run starts from the cursor, re-delivers its callbacks, and
 * fetches h again.
 *
 * **A source that fetches ahead** (`core-block-fetch`'s node source) is given, for each run, the runner's dispatch
 * interface for its queue ({@link QueueRunner}: `on-fetch` and `on-parse` of a block it fetched ahead, `on-best-block`,
 * `on-rollback`, and the hash stored at a height), taken back when the run ends. The loop takes each height from it
 * prepared (`BlockSource.prepared`), with `on-fetch` and `on-parse` already run and their items in the height's, and
 * goes on to `on-start-height` and `on-compute` with them. The queue's callbacks run outside the loop's points, each
 * with its block context as the loop builds it.
 *
 * **A slow height** is reported, never cut off: nothing here cancels, times out or retries a height for its time. Each
 * run of a height has a window, from its first callback after `on-finalized` to its `COMMIT`. Where the window starts:
 * - normally, at its `on-fetch`;
 * - for a height the source prepares ahead: when the loop asks for it, if its `on-fetch` or `on-parse` runs in the
 *   queue by then, else when one starts there. The queue's earlier work for it, beside the heights before it, is not
 *   its time, nor is the fetch from the node before its first callback;
 * - for a held height processed again: where it resumes. A back-off is never in a window.
 *
 * While the window is open the loop knows the point the height is in and the modules whose callbacks run. The point is
 * the last of its points that began; from the block transaction's request on, it is `on-db-write` (its `BEGIN`, its
 * callbacks, the cursor check, the `COMMIT`), except while the callbacks of the `on-settle` point run. Once a window
 * has been open longer than {@link LoopInput.slowBlockMs} (a timer of the main thread, so not while a callback blocks
 * it), {@link FinalizedLoop.slowBlock} gives the height, its point and the first module running in the point's order,
 * and the observer is told ({@link LoopObserver.slow}). The
 * window closes when the height commits, or when its run fails or stops (a halt, a retry, whose run opens a window of
 * its own, or a stop at the lockstep wait), and the observer is told again.
 *
 * **The callbacks the loop awaits outside a height's processing** are timed alike, each in a window of its own
 * ({@link SlowWindow}): opened when the loop starts them, timed against `slowBlockMs`, closed when they end or fail.
 * These are:
 * - a height's `on-after-db-write` and `on-stop-height` after its commit: one window, from the commit to the end of
 *   `on-stop-height` (after a `COMMIT` that landed though its connection was lost, from the retry's start of them);
 * - each `on-finalized`, named by the height of the head it announces;
 * - the re-delivery at a run's start, named by the cursor's height.
 *
 * One window is open at a time: the loop awaits them in series.
 *
 * **Chunks** (fast-sync mode, {@link LoopInput.fastSync}, `./fast-sync.ts`). Far behind the finalized head the loop
 * stores a chunk of consecutive heights a..b in one transaction; every block still runs every point, and with the mode
 * off, or for a height processed alone, nothing above changes. At each height the loop asks `chunkEnd` (with the head
 * read for this pass): a chunk holds at least two blocks, inside one range of the resolved graph and one revision of
 * the `core` entry, no closer to the head than the setting's distance. A chunk:
 * 1. takes all its blocks first, in height order, with nothing open: each from the source (`prepared`, the source's
 *    queue running its `on-fetch` and `on-parse`; else `block`, the loop running them), kept with its items as
 *    `on-parse` left them. A take that fails at j makes the chunk a..j − 1 (a alone when that is a). The failure is
 *    kept for j until the loop reaches j, whatever becomes of the blocks below it meanwhile (a retry, a new run of the
 *    loop, a chunk that ends early): no chunk is planned across j, the source is not asked for j again, and j is
 *    processed alone, where the failure is thrown as j's;
 * 2. runs a's `on-start-height` and `on-compute` with their own reads, as a height alone does; then waits, still with
 *    nothing open, until the source holds what the callbacks of the blocks after a ask it for from `on-compute` on
 *    (`BlockSource.answered`: the node source's ledger state roots). The loop's signal ends that wait;
 * 3. opens one transaction: a's writes (`on-db-write`, `on-settle` with the run `{ a, a }`, the cursor check); then for
 *    each k > a, `on-compute` (its callbacks one at a time, each with a read at k − 1 that is a read-only view of the
 *    transaction, `../db/read-view.ts`, opened at its first statement), then k's writes. After the writes of each block
 *    but the chunk's last comes the block's end (`../db/block-end.ts`), where a block alone would `COMMIT`: every
 *    deferred constraint is checked and every deferred trigger fired, a failure being that block's, and the constraints
 *    are deferred again for the next block;
 * 4. at the `COMMIT`'s answer tells the follower `committed` for a..b in height order and the observer once, with b;
 *    then runs each block's `on-after-db-write` (its read at b, the chunk's last height) and `on-stop-height`, in
 *    height order, each in an `after-commit` window of its own.
 *
 * Before each block k > a, after k − 1's cursor check, the loop's signal or a pause hold ({@link LoopPause.held}) ends
 * the chunk at k − 1 with its `COMMIT` and points after it; the loop then returns, or pauses between heights, the
 * blocks taken above k − 1 kept for when it goes on. So does a block's end that finds what the transaction cannot give
 * the next block as a new one would (a constraint that is deferrable and initially immediate, a temporary table of
 * the writer's session, a cursor left open): the chunk commits at that block, and the heights up to its planned end
 * are stored one per transaction. Nothing in an open chunk waits for the chain, so a stop, a pause or a lost
 * connection is met within the time of the chunk's own work. A callback of k's `on-compute` that calls
 * `blockBeforeCommitted()` before its first statement ends the chunk at k − 1 too: its turn ends, the transaction's
 * body ends and commits, the follower and the observer are told, and the call resolves; the rest of k's `on-compute`
 * runs with no transaction open (each later callback with its own read at k − 1), then the points after the commit of
 * a..k − 1, then k's writes open the next transaction, k the first block of a chunk or alone. No callback runs twice.
 * With the mode off, and at a chunk's first block, `blockBeforeCommitted()` resolves at once; it throws a programming
 * error at any other point, or after the callback's first statement through its read.
 *
 * The transaction has one user at a time, in the order they asked: a block's writes, one `on-compute` callback's read,
 * or one read of {@link FinalizedLoop.read}, which the process's ledger worker host reads stored nodes through (a view
 * of the transaction while it is open). The source's finality check is answered, for a height taken and not committed,
 * from the block taken ({@link QueueRunner.storedHash}). A block's trace record is held when its writes end and written
 * after the `COMMIT` (`../trace/trace.ts`), and a block's slow window is held until the `COMMIT` or the rollback, which
 * tells its `ended`.
 *
 * **A failure inside a chunk** is handled as a height alone handles it at the same block k; what was written below k
 * is committed where the transaction allows, and stored again one block per transaction where it does not:
 * - taking block j fails: the chunk is a..j − 1, and j fails when the loop reaches it, as a height alone, its callbacks
 *   not called again;
 * - k > a fails before its first write (its `on-compute`, a misuse found there, the worker failing its apply): the
 *   chunk commits at k − 1, the follower is told `committed` a..k − 1 and `rolledBack` k, the points after the commit
 *   of a..k − 1 run, then k's failure stops the loop (a retryable one holds k, as a held height);
 * - k's writes fail, not retryable (a callback, the cursor check, the block's end, a misuse, a statement that aborted
 *   the transaction): the transaction rolls back, the follower is told `rolledBack` a..k, a..k − 1 are stored again in
 *   this run, then k's failure, kept, is thrown, k not called again;
 * - a retryable failure while the transaction is open (a lost connection, the writer's session replaced, a callback's
 *   retryable error in k's writes): the follower is told `rolledBack` a..k and the chunk is held ({@link HeldChunk}); the
 *   next run reads the cursor on the writer: at a − 1, a..k − 1 are stored again and k alone from where it resumes;
 *   anything else halts with `unexpected-cursor` at a;
 * - the `COMMIT` answered with an error: `rolledBack` a..b, then a..b stored again in this run, the block whose own
 *   `COMMIT` fails stopping the loop;
 * - the `COMMIT`'s answer lost: nothing is told, the chunk held with its trace records; the next run's cursor read at b
 *   with its hash tells `committed` a..b and runs their points after the commit; at a − 1 tells `rolledBack` a..b and
 *   stores them again; anything else halts with `unexpected-cursor` at a, nothing told;
 * - a failure of `on-after-db-write` or `on-stop-height` of block j stops the loop at j, committed, the cursor at b;
 *   the blocks above j get no such callbacks.
 * A block stored again runs from `on-compute` with its items as `on-parse` left them, nothing fetched or parsed again,
 * and its `continues` is false. No chunk forms again at or below the highest height of a chunk that did not commit,
 * until the cursor reaches it, so a failed chunk is never formed again. A failure of a block stored again is its own.
 * A failure kept for a block above (of its writes, or of its take) stays kept while the blocks below it are retried,
 * and is dropped and logged only when one of them stops processing ({@link LoopObserver.dropped}).
 */

import { BLOCKS_TABLE } from "../backbone/core-block-commit/sql.js";
import type { Database, ReadHandle, Transaction } from "../db/api.js";
import { handleClosed, UmbraError } from "../db/errors.js";
import { endBlock } from "../db/block-end.js";
import { readView } from "../db/read-view.js";
import type { SchemaPlan } from "../db/roles.js";
import { type BlockWrites, openBlockWrites } from "../db/write-handles.js";
import type {
  BlockContext,
  BlockRun,
  ModuleDeclaration,
  PointName,
  ProcessContext,
} from "../modules/declaration.js";
import type { HeightRange, ResolvedGraph, ResolvedRange } from "../modules/graph.js";
import { BlockItems, revisionAt } from "./block-context.js";
import type { BlockRef, BlockSource, PreparedBlock, QueueRunner } from "./block-source.js";
import {
  CallbackFailure,
  type EntryBoundary,
  entryIdOf,
  isBackbonePart,
  type PointArguments,
  type PointSchedule,
  runSchedule,
  type ScheduleOptions,
  scheduleAt,
  startHeightSchedule,
  stopHeightSchedule,
} from "./dispatch.js";
import { chunkEnd, type FastSync } from "./fast-sync.js";
import type { LoopPause } from "./pause.js";
import type { TransactionFollower } from "./transaction-follower.js";
import {
  traceAdd,
  traceCommitHeld,
  traceDropBlock,
  traceDropHeld,
  traceEndBlock,
  traceHoldBlock,
  traceResumeHeld,
} from "../trace/trace.js";
import type { MisuseReports } from "./process-context.js";

/** What the loop runs over. */
export interface LoopInput {
  /** The database, started (`startDatabase`) and opened with the cursor table's committed height (`cursorHeight`). */
  readonly db: Database;
  /** The resolved graph of the database (`resolveGraph`, with the cursor read after opening it). */
  readonly graph: ResolvedGraph;
  /** The schema plan of the graph's modules (`schemaPlan(graph.modules)`). */
  readonly plan: SchemaPlan;
  /** The runner's view of the chain. */
  readonly source: BlockSource;
  /** Each module's process context: one per module, the same object at every point. */
  readonly contextOf: (id: string) => ProcessContext;
  /**
   * Where the process contexts report a refused `publish`: a callback error of its module even when the module caught
   * it, or when a timer made it (`ProcessContexts`, `./process-context.ts`).
   */
  readonly misuses?: MisuseReports;
  /** Stops the loop: before the next height, or while it waits for the head. */
  readonly signal?: AbortSignal;
  /**
   * The core entry's stop: the last height the loop processes, after whose `on-stop-height` (the core's among them) it
   * ends. With the cursor at or above it, it processes nothing. Absent or null: no stop.
   */
  readonly coreStop?: bigint | null;
  /**
   * The upgrade boundary: the first height above the cursor that starts a revision of a version this build does not
   * carry. The loop ends after the height before it. Absent or null: none.
   */
  readonly boundary?: bigint | null;
  /** Told of the finalized heads the loop reads and the heights it commits (the process's state). */
  readonly observer?: LoopObserver;
  /**
   * The slow-window threshold (the configuration's `slowBlockMs`): a window open longer is slow, whether a height's
   * processing or a callback the loop awaits outside it (see the module comment). Absent or null: none is.
   */
  readonly slowBlockMs?: number | null;
  /** The lockstep wait before each block's transaction (see the module comment); none unless given. */
  readonly lockstep?: LockstepWait;
  /** The pause between heights (see the module comment); none unless given. */
  readonly pause?: LoopPause;
  /**
   * Told what became of each block's transaction (`./transaction-follower.ts`; see the module comment): the process's
   * ledger worker host, when it has one. None unless given.
   */
  readonly follower?: TransactionFollower;
  /**
   * Fast-sync mode (`./fast-sync.ts`): far behind the head, chunks of heights in one transaction (see the module
   * comment). Absent, or `blocks` below 2: every height in a transaction of its own.
   */
  readonly fastSync?: FastSync;
}

/** The lockstep wait (`src/private/lockstep.ts`'s `Lockstep`): before `BEGIN` of `height`. */
export interface LockstepWait {
  /** Resolves true once the loop may open `height`'s block transaction, false when `signal` aborted first. */
  wait(height: bigint, signal: AbortSignal): Promise<boolean>;
}

/** What the loop tells as it runs (the process's state, `./process.ts`): none may throw. */
export interface LoopObserver {
  /** The source's finalized head, each time the loop reads it. */
  head?(head: BlockRef): void;
  /** A height that committed: its block, the new cursor. */
  committed?(block: BlockRef): void;
  /** A window became slow, or a slow window closed (see the module comment). */
  slow?(event: SlowBlockEvent): void;
  /**
   * A failure kept for a block (of its writes in a chunk that rolled back, or of its take for a chunk), dropped because
   * a block below it failed first and stops processing (see the module comment): the process logs it.
   */
  dropped?(failure: HeightFailure): void;
}

/**
 * The windows the loop times for slowness (see the module comment):
 * - `height`: a height's processing, from its first callback after `on-finalized` to its `COMMIT`;
 * - `after-commit`: its `on-after-db-write` and `on-stop-height` after the `COMMIT`;
 * - `finalized`: one `on-finalized`;
 * - `redelivery`: the re-delivery of the cursor's callbacks at a run's start.
 */
export type SlowWindow = "height" | "after-commit" | "finalized" | "redelivery";

/**
 * What the loop does in an open window: which window, its height (for `finalized` the head announced), the point it is
 * in, the first module running there, and since when.
 */
export interface HeightActivity {
  readonly window: SlowWindow;
  readonly height: bigint;
  readonly point: PointName;
  /** The first module whose callback runs, in the point's order; null while none runs. */
  readonly module: string | null;
  /** How long its window has been open, in milliseconds. */
  readonly sinceMs: number;
}

/** What {@link LoopObserver.slow} is told. */
export type SlowBlockEvent =
  /** A window has been open longer than `slowBlockMs`: what it does now. */
  | { readonly kind: "raised"; readonly activity: HeightActivity }
  /**
   * A slow window closed, after `ms`: `completed` when its work did — the height committed (`height`), its callbacks
   * ended (the others) —, not when its run failed or stopped.
   */
  | {
      readonly kind: "ended";
      readonly window: SlowWindow;
      readonly height: bigint;
      readonly completed: boolean;
      readonly ms: number;
    };

/**
 * Where a height's processing is: the last of its points that began, and the modules whose callbacks run, in the order
 * they started (at a point in waves, the point's order).
 */
class Activity {
  point: PointName;
  readonly #running: string[] = [];

  constructor(point: PointName) {
    this.point = point;
  }

  /** The first module running, or null. */
  get module(): string | null {
    return this.#running[0] ?? null;
  }

  /** Runs `body`, module `module`'s callback, as running. */
  async during(module: string, body: () => Promise<void>): Promise<void> {
    this.#running.push(module);
    try {
      await body();
    } finally {
      this.#running.splice(this.#running.indexOf(module), 1);
    }
  }
}

/** An open slow-height window (see the module comment): a height's processing, or callbacks awaited outside it. */
interface Watch {
  readonly window: SlowWindow;
  readonly height: bigint;
  /** When it opened (`performance.now()`); null while none of a height's callbacks has started. */
  began: number | null;
  activity: Activity | undefined;
  timer: ReturnType<typeof setTimeout> | undefined;
  /** Whether it was found slow (the observer told). */
  raised: boolean;
}

/** How the loop ended. */
export type LoopEnd =
  /** Its signal stopped it, before a height or while it waited. */
  | { readonly kind: "signal" }
  /**
   * It ended at its last height, processed or at the cursor: `core` when that is at or above the core's stop (its
   * `on-stop-height` ran), `boundary` the upgrade boundary when it is the height before it, else null.
   */
  | { readonly kind: "stopped"; readonly height: bigint; readonly core: boolean; readonly boundary: bigint | null };

const SIGNALLED: LoopEnd = Object.freeze({ kind: "signal" });

/** One height in progress: what its points share. */
export interface HeightRun {
  /** The height the loop processes. */
  readonly height: bigint;
  /** The finalized block there, from the source. */
  readonly block: BlockRef;
  /** The range of the resolved graph holding the height. */
  readonly range: ResolvedRange;
  /** The height's `block` items. */
  readonly items: BlockItems;
  /**
   * The cursor before the height: null before the first block, and at a re-delivery after a restart, which writes
   * nothing.
   */
  readonly previous: BlockRef | null;
  /** True when the source prepared the height (`BlockSource.prepared`): its `on-fetch` and `on-parse` ran already. */
  readonly prepared?: boolean;
  /**
   * Set for a held height processed again ({@link HeldHeight}): the point it resumes at — its `on-fetch` and `on-parse`
   * ran in an earlier run of the loop, and with `on-compute` its `on-start-height` too.
   */
  readonly from?: ResumePoint;
}

/** Where a held height resumes: `on-start-height` when its failure came before `on-compute` began, else there. */
export type ResumePoint = "on-start-height" | "on-compute";

/**
 * A height a retryable failure stopped before it committed, after its `on-parse` (see the module comment): what the
 * loop's next run processes it again with.
 */
export interface HeldHeight {
  /** The height's run: its block, its range, the cursor before it, its items. */
  readonly run: HeightRun;
  /** Its `block` items as `on-fetch` and `on-parse` left them: the items it is processed again with. */
  readonly items: ReadonlyMap<string, unknown>;
  /** The point it resumes at. */
  readonly from: ResumePoint;
  /**
   * True when the failure came after the block transaction's body ended, so from its `COMMIT`, which the server may
   * have committed or not. False when the transaction failed before, and certainly did not commit.
   */
  readonly uncertain: boolean;
}

/**
 * What the cursor read after a held height's failure says ({@link FinalizedLoop.commitOutcome}): the height
 * `committed`, `not-committed` (the cursor is the one before it), or `unexpected` (anything else: `unexpected-cursor`).
 */
export type CommitOutcome = "committed" | "not-committed" | "unexpected";

/** Opens a read for one callback, and runs `body` inside it. */
export type ReadOpener = <T>(body: (read: ReadHandle) => Promise<T>) => Promise<T>;

/**
 * The users of a chunk's transaction, one at a time, in the order they asked (see the module comment): a block's write
 * phase, one `on-compute` callback's read, or one read the loop opens for itself ({@link FinalizedLoop.read}).
 */
class Turns {
  #tail: Promise<void> = Promise.resolve();

  /** Resolves, once every earlier turn ended, with the function that ends this one; ending it again does nothing. */
  take(): Promise<() => void> {
    let end!: () => void;
    const ended = new Promise<void>((resolve) => {
      end = resolve;
    });
    const before = this.#tail;
    this.#tail = before.then(() => ended);
    return before.then(() => end);
  }

  /** Runs `body` in a turn of its own. */
  async run<T>(body: () => Promise<T>): Promise<T> {
    const end = await this.take();
    try {
      return await body();
    } finally {
      end();
    }
  }
}

/** A promise and what settles it. */
interface Deferred<T> {
  readonly promise: Promise<T>;
  resolve(value: T): void;
  reject(error: unknown): void;
}

/** A new {@link Deferred}; a rejection nobody awaits is not reported as unhandled. */
function deferred<T>(): Deferred<T> {
  let resolve!: (value: T) => void;
  let reject!: (error: unknown) => void;
  const promise = new Promise<T>((done, failed) => {
    resolve = done;
    reject = failed;
  });
  promise.catch(() => undefined);
  return { promise, resolve, reject };
}

/** A chunk whose transaction the loop has asked for, until it has committed or rolled back. */
interface OpenChunk {
  /** The transaction, from its `BEGIN`. */
  tx: Transaction | undefined;
  readonly turns: Turns;
  /** True while the transaction's body runs: from then on its users read through views of it. */
  open: boolean;
  /** The height its reads see: the last block written in it, or the cursor before its first. */
  height: bigint | null;
  /** The block after the first whose `on-compute` runs inside the transaction now. */
  computing: HeightRun | undefined;
  /** Ends the turn of the `on-compute` callback that runs now. */
  endTurn: (() => void) | undefined;
  /** Resolves when a callback of {@link computing} asked for the block before to be committed (`blockBeforeCommitted`). */
  readonly asked: Deferred<void>;
  /** Settles once the `COMMIT` answered and was told, or with its failure. */
  readonly committed: Deferred<void>;
}

/** A new {@link OpenChunk} above the cursor `previous`. */
function openChunk(previous: BlockRef | null): OpenChunk {
  return {
    tx: undefined,
    turns: new Turns(),
    open: false,
    height: previous?.height ?? null,
    computing: undefined,
    endTurn: undefined,
    asked: deferred<void>(),
    committed: deferred<void>(),
  };
}

/**
 * A block whose `on-compute` ran in a chunk that committed at the block before it (`blockBeforeCommitted`): its writes
 * open the next transaction, as the first block of a chunk or alone. Its window stays open.
 */
interface Carried {
  readonly run: HeightRun;
  readonly watch: Watch;
}

/**
 * How a chunk ended: the new cursor, and the block it carries over when it committed below its last; or, `again`, it
 * did not commit, and its blocks are stored again one per transaction from the cursor before it.
 */
interface ChunkEnd {
  readonly cursor: BlockRef | null;
  readonly carried?: Carried;
  readonly again?: true;
}

/**
 * A failure the loop keeps while blocks of a chunk are stored again (see the module comment): thrown when the loop
 * reaches `at`, before anything of that height runs; dropped, and logged, when a block below `at` stops processing
 * first.
 */
interface KeptFailure {
  readonly failure: HeightFailure;
  readonly at: bigint;
}

/**
 * A chunk a retryable failure stopped, or whose `COMMIT` lost its answer (`uncertain`), kept for the loop's next run
 * (see the module comment). Its runs are the blocks begun in its transaction, in height order: when not `uncertain`,
 * the last of them is the block that failed, retried alone from where it resumes. `carried` is a block whose
 * `on-compute` ran after the chunk's last (`blockBeforeCommitted`), and `kept` that block's failure, thrown once the
 * chunk is settled.
 */
export interface HeldChunk {
  readonly runs: readonly HeightRun[];
  readonly uncertain: boolean;
  readonly carried?: HeightRun;
  readonly kept?: HeightFailure;
}

/** The programming error of `blockBeforeCommitted()` called where it is not allowed. */
function blockBeforeRefused(): Error {
  return new Error(
    "blockBeforeCommitted() is allowed at on-compute only, before the callback's first statement through its read",
  );
}

/** A block taken for a chunk before its transaction (see the module comment), with its items as `on-parse` left them. */
interface Taken {
  readonly block: BlockRef;
  readonly items: BlockItems;
}

/**
 * A take that failed, kept until the loop reaches its height (see the module comment): the error, and the block to
 * tell rolled back. It is the height's own: a retry or a new run of the blocks below it keeps it, no chunk is planned
 * across its height, and the source is not asked for that height again while it is kept.
 */
interface TakeFailure {
  readonly height: bigint;
  readonly error: unknown;
  readonly block: BlockRef | undefined;
}

/** Resolves once `work` settled or `signal`, not aborted yet, aborts, whichever comes first. */
async function untilAborted(work: Promise<unknown>, signal: AbortSignal): Promise<void> {
  let stop!: () => void;
  const aborted = new Promise<void>((resolve) => {
    stop = resolve;
  });
  signal.addEventListener("abort", stop, { once: true });
  try {
    await Promise.race([work, aborted]);
  } finally {
    signal.removeEventListener("abort", stop);
  }
}

/**
 * The last block this run of the loop stored ({@link FinalizedLoop.continues}): its block, the writer's session it was
 * written on, and the chunk whose transaction holds it while that is not committed (null once committed).
 */
interface Stored {
  readonly block: BlockRef;
  readonly session: number | null;
  readonly chunk: OpenChunk | null;
}

/**
 * The halt `unexpected-cursor`. It is raised when the loop's check before the `COMMIT`, that the block transaction left
 * the cursor at the height with the block's hash, failed; or when the cursor read after a held height's failure was
 * neither the height nor the one before it.
 */
export class UnexpectedCursor extends Error {
  constructor(message: string) {
    super(message);
    this.name = "UnexpectedCursor";
  }
}

/** Why the loop stopped: the height, and the point and module when a callback failed. */
export class HeightFailure extends Error {
  readonly height: bigint;
  readonly point: PointName | undefined;
  readonly module: string | undefined;
  /** True when the height committed before the failure (`on-after-db-write`, or after its last point). */
  readonly committed: boolean;

  constructor(
    height: bigint,
    cause: unknown,
    where: { readonly point?: PointName; readonly module?: string; readonly committed: boolean },
  ) {
    const point = where.point === undefined ? "" : ` in ${where.point}`;
    const module = where.module === undefined ? "" : ` of ${where.module}`;
    const kept = where.committed ? "after the height committed" : "before the height committed";
    const reason = cause instanceof Error ? cause.message : String(cause);
    super(`processing stopped at height ${height}${point}${module}, ${kept}: ${reason}`, { cause });
    this.name = "HeightFailure";
    this.height = height;
    this.point = where.point;
    this.module = where.module;
    this.committed = where.committed;
  }
}

/**
 * A callback error no callback rejected with: a use of a closed write handle, of a kept item sink, or a refused
 * `publish`; its point is the callback's, or for a refused `publish` the point being dispatched (none while waiting).
 */
interface Misuse {
  readonly error: Error;
  readonly module: string;
  readonly point: PointName | undefined;
}

/** The callbacks of a point, called with what `invoke` gives each. */
type Invoke<P extends PointName> = (
  part: ModuleDeclaration,
  call: (...args: PointArguments<P>) => Promise<void>,
) => Promise<void>;

/** `invoke`, each callback recorded as running in `activity` when there is one. */
function tracked<P extends PointName>(activity: Activity | undefined, invoke: Invoke<P>): Invoke<P> {
  return activity === undefined ? invoke : (part, call) => activity.during(part.id, () => invoke(part, call));
}

/** Whether two byte strings are equal. */
function sameBytes(a: Uint8Array, b: Uint8Array): boolean {
  return a.length === b.length && a.every((byte, index) => byte === b[index]);
}

/** Whether `ref` is the block `block`: its height and hash. */
function isBlock(ref: BlockRef | null, block: BlockRef | null): boolean {
  if (ref === null || block === null) return ref === block;
  return ref.height === block.height && sameBytes(ref.hash, block.hash);
}

/** A cursor as text, for a message. */
const cursorText = (cursor: BlockRef | null): string => (cursor === null ? "none" : `height ${cursor.height}`);

/**
 * The failure of a height's attempt whose callbacks were told the block before continues, when its transaction runs on
 * another writer's session than the one that committed that block (see the module comment): retryable, so the height
 * is made again, from the database.
 */
function writerSessionReplaced(height: bigint, committedOn: number, now: number | null): UmbraError {
  return new UmbraError(
    "connection-lost",
    `the writer's session was replaced since the block before height ${height} committed (session ${committedOn}, now ` +
      `${now ?? "none"}): another writer may have held the writer lock in between, so height ${height} is made again`,
    { height, cause: "writer-session-replaced" },
  );
}

/**
 * Whether `error`, with which a block transaction failed after its body ended, leaves its `COMMIT`'s outcome unknown:
 * the connection was lost (a retryable `UmbraError`), so the server may have committed. Any other error is the
 * server's answer, and the transaction rolled back. It is the database's error, not the failure the loop reports.
 */
function answerLost(error: unknown): boolean {
  return error instanceof UmbraError && error.retryable;
}

/** Whether the process retries `failure`: a retryable `UmbraError`, itself or a callback's. */
function isRetryable(failure: HeightFailure): boolean {
  const cause = failure.cause instanceof CallbackFailure ? failure.cause.cause : failure.cause;
  return cause instanceof UmbraError && cause.retryable;
}

/** The failure of `height` for `error`: a callback's failure with its point and module. */
function heightFailure(height: bigint, error: unknown, committed: boolean): HeightFailure {
  if (error instanceof CallbackFailure) return new HeightFailure(height, error, { point: error.point, module: error.module, committed });
  return new HeightFailure(height, error, { committed });
}

/** How far a height's run got before `on-compute`: what holding it needs (see {@link HeldHeight}). */
interface Progress {
  /** Its items when it reached `on-start-height`: as `on-fetch` and `on-parse` left them. */
  readonly items: ReadonlyMap<string, unknown>;
  /** The last point it reached of the two a held height resumes at. */
  from: ResumePoint;
}

/** The finalized loop over a block source (see the module comment). */
export class FinalizedLoop {
  protected readonly input: LoopInput;
  readonly #signal: AbortSignal;
  #misuse: Misuse | undefined;
  /** The point being dispatched, if any. */
  #point: PointName | undefined;
  /** How far each height's run got, by run. */
  readonly #progress = new WeakMap<HeightRun, Progress>();
  /** The runs whose block transaction's body ended: a failure after that is the `COMMIT`'s. */
  readonly #bodiesEnded = new WeakSet<HeightRun>();
  /** The height the last run held for the next (see the module comment). */
  #held: HeldHeight | undefined;
  /** The held height this run processes again, once it reaches it. */
  #resume: HeldHeight | undefined;
  /**
   * The window open: the height the loop is on, from the start of its processing to its commit or its failure, or the
   * callbacks it awaits outside a height's processing while they run.
   */
  #watch: Watch | undefined;
  /** What the source's queue runs for each height it prepares (`on-fetch`, `on-parse`), while it does. */
  readonly #preparing = new Map<bigint, Activity>();
  /** The open block transaction ({@link blockTransaction}), settling when it has committed or rolled back. */
  #transaction: Promise<void> | undefined;
  /**
   * The `on-settle` schedule of each range this loop processed a block of, built at its first block: null when no part
   * of the range declares the point, so its blocks skip it.
   */
  readonly #settleSchedules = new WeakMap<ResolvedRange, PointSchedule<"on-settle"> | null>();
  /**
   * The last block stored in this run of the loop, committed or written in the chunk's transaction still open; null
   * from the run's start, and after a rollback, until one is.
   */
  #lastStored: Stored | null = null;
  /** The chunk whose transaction is asked for or open, if any. */
  #chunkOpen: OpenChunk | undefined;
  /** The blocks taken for a chunk and not begun yet, by height. */
  readonly #taken = new Map<bigint, Taken>();
  /** The takes that failed, by height, each until the loop reaches its height or a block below it stops processing. */
  readonly #takeFailures = new Map<bigint, TakeFailure>();
  /** The blocks taken and not committed yet, by height: what the source's finality check is answered from. */
  readonly #uncommitted = new Map<bigint, BlockRef>();
  /**
   * The highest height the loop stores one block per transaction up to, until the cursor reaches it: no chunk forms at
   * or below it. It is the highest height of a chunk that did not commit, or the planned end of a chunk that ended at a
   * block whose transaction could not hold another ({@link endBlock}).
   */
  #alone: bigint | null = null;
  /**
   * The blocks of a chunk that did not commit, stored again one per transaction from where each resumes (from
   * `on-compute`, with its items as `on-parse` left them), by height; kept across runs until the loop processes them.
   */
  readonly #remade = new Map<bigint, HeldHeight>();
  /**
   * A failure kept while blocks of a chunk are stored again, thrown when the loop reaches the height `at` (the failing
   * block's, which is not called again), unless one of those blocks fails first.
   */
  #keptFailure: KeptFailure | undefined;
  /** The chunk the last run held for the next. */
  #heldChunk: HeldChunk | undefined;
  /**
   * The heights' runs of this run of the loop whose block before committed in it ({@link continues}), each with the
   * writer's session that committed it, which the writer must still have when a block context says true; a run leaves
   * it once a context finds another session.
   */
  #continuing = new WeakMap<HeightRun, number>();
  /** The writer's session each height's block transaction ran on, from its start. */
  readonly #writtenOn = new WeakMap<HeightRun, number | null>();
  /**
   * The block of each height whose last preparation in the source's queue failed, until the loop takes that height
   * ({@link #prepared}).
   */
  readonly #failedPreparations = new Map<bigint, BlockRef>();
  /** The heights' runs some of whose block contexts said `continues` true, with the session that held then. */
  readonly #toldContinuing = new WeakMap<HeightRun, number>();
  /** The last block this loop told the follower committed, which it does not tell again ({@link #tell}). */
  #toldCommitted: BlockRef | null = null;

  constructor(input: LoopInput) {
    this.input = input;
    this.#signal = input.signal ?? new AbortController().signal;
  }

  /**
   * The open window once it has been open longer than `slowBlockMs` (see the module comment): which, its height, the
   * point it is in and the first module running there now, and its time. Null otherwise: none open, none slow yet, or no
   * `slowBlockMs`.
   */
  slowBlock(): HeightActivity | null {
    const watch = this.#watch;
    return watch === undefined || !watch.raised ? null : this.#activityOf(watch);
  }

  /**
   * The height whose processing is open — from the loop's start on it to its `COMMIT`, or to its failure or stop —, or
   * null outside one: waiting for the head, in `on-finalized`, after a commit, or at a run's re-delivery. The process's
   * stop names it in its log line.
   */
  heightInProgress(): bigint | null {
    const watch = this.#watch;
    return watch?.window === "height" ? watch.height : null;
  }

  /**
   * The height's block transaction while it is open, from its request (its `BEGIN` waits for the writer) until it has
   * committed or rolled back: a promise that settles then and never rejects. Null while none is open. The process's
   * stop closes the node client at once when none is open, else once it settles (`./process.ts`).
   */
  blockTransaction(): Promise<void> | null {
    return this.#transaction ?? null;
  }

  /**
   * Runs `body` with a read: while a chunk's transaction is open, a read-only view of it at its last written height,
   * taken as one turn of the transaction (see the module comment), so it sees what the chunk wrote; otherwise its own
   * read (`Database.read`). The process's ledger worker host reads stored nodes through it for a request given no read.
   */
  read<T>(body: (read: ReadHandle) => Promise<T>): Promise<T> {
    const chunk = this.#chunkOpen;
    if (chunk === undefined || !chunk.open) return this.input.db.read(body);
    return chunk.turns.run(() =>
      chunk.open && chunk.tx !== undefined ? this.openView(chunk.tx, chunk.height, body) : this.input.db.read(body),
    );
  }

  /**
   * The slow-window threshold for a window of the kind `_window`: the input's `slowBlockMs`, null for none (a negative
   * control's seam).
   */
  protected slowBlockMs(_window: SlowWindow): number | null {
    return this.input.slowBlockMs ?? null;
  }

  /**
   * Re-delivers the cursor's callbacks or, after a run that held a height, settles that height first (see the module
   * comment). Then processes every finalized height above it, waiting for the head to rise, up to its last height
   * ({@link lastHeight}), and resolves with how it ended, or with `signal` when its signal stopped it. Rejects with a
   * {@link HeightFailure} when processing fails.
   */
  async run(): Promise<LoopEnd> {
    const unwatch = this.input.misuses?.watch((error, module) => this.#misused({ error, module, point: this.#point }));
    try {
      return await this.#run();
    } catch (error) {
      // Processing stops at a block below every take still kept, unless the failure is retried: each is dropped, and
      // logged.
      if (error instanceof HeightFailure && !isRetryable(error)) this.#dropTakeFailures();
      throw error;
    } finally {
      unwatch?.();
    }
  }

  /** Drops the take failures kept, the observer told of each ({@link LoopObserver.dropped}). */
  #dropTakeFailures(): void {
    const kept = [...this.#takeFailures.values()];
    this.#takeFailures.clear();
    for (const { height, error } of kept) this.input.observer?.dropped?.(heightFailure(height, error, false));
  }

  /** {@link run}, while the process contexts' refusals are reported to the loop, and the source has its queue runner. */
  async #run(): Promise<LoopEnd> {
    const detach = this.input.source.attach?.(this.#queueRunner());
    try {
      return await this.#follow();
    } finally {
      detach?.();
    }
  }

  /** The loop's work in {@link run} (see the module comment). */
  async #follow(): Promise<LoopEnd> {
    const { db, graph, source, observer } = this.input;
    const held = this.#held;
    this.#held = undefined;
    const heldChunk = this.#heldChunk;
    this.#heldChunk = undefined;
    this.#resume = undefined;
    // A new run: no block before continues into it, whatever an earlier run committed, and no block taken is kept. A
    // take that failed stays kept for its height: the blocks below it are processed first.
    this.#lastStored = null;
    this.#continuing = new WeakMap();
    this.#taken.clear();
    this.#uncommitted.clear();
    for (const run of heldChunk === undefined ? [] : [...heldChunk.runs, ...(heldChunk.carried === undefined ? [] : [heldChunk.carried])]) {
      this.#uncommitted.set(run.height, run.block);
    }
    let cursor: BlockRef | null;
    if (held !== undefined) {
      cursor = await this.#settle(held);
    } else if (heldChunk !== undefined) {
      cursor = await this.#settleChunk(heldChunk);
    } else {
      cursor = await db.read((read) => source.cursor(read));
      const at = cursor;
      if (at !== null) await this.#timed("redelivery", at.height, "on-after-db-write", () => this.redeliver(at));
    }
    // Blocks to store again that the cursor has passed are gone.
    for (const height of this.#remade.keys()) if (cursor !== null && height <= cursor.height) this.#remade.delete(height);
    const last = this.lastHeight();
    if (cursor !== null && last !== null && cursor.height >= last) return this.#stopped(cursor.height);
    for (;;) {
      if (this.#signal.aborted) return SIGNALLED;
      // Between heights a pause holds the loop here, before it reads the head.
      await this.pauseBetween();
      if (this.#signal.aborted) return SIGNALLED;
      const next = cursor === null ? graph.start : cursor.height + 1n;
      let head: BlockRef;
      try {
        head = await source.finalizedHead();
        observer?.head?.(head);
        if (head.height < next) {
          await this.#idle(() => this.wait(next - 1n));
          continue;
        }
        await this.#finalized(head, next);
      } catch (error) {
        const failure = this.#failure(next, error, false);
        // A held height not reached yet stays held for the next run, its items kept.
        if (this.#resume !== undefined && isRetryable(failure)) this.#held = this.#resume;
        throw failure;
      }
      /** A block whose on-compute ran in a chunk that committed below it: its writes come next. */
      let carried: Carried | undefined;
      for (let height = next; height <= head.height; height++) {
        if (carried === undefined) {
          if (this.#signal.aborted) return SIGNALLED;
          // Between heights: before this one, after on-finalized or the height before's points.
          await this.pauseBetween();
          if (this.#signal.aborted) return SIGNALLED;
        }
        // Far behind the head, a chunk of heights in one transaction; otherwise this height alone.
        const end = this.#chunkEndAt(height, head.height);
        const given = carried;
        let done: BlockRef | null;
        if (end === null && given === undefined) {
          done = await this.#process(height, cursor);
        } else {
          const ended = await this.#chunk(height, end ?? height, cursor, given);
          if (ended.again === true) {
            // Not committed: its blocks again from the cursor before it, one per transaction.
            cursor = ended.cursor;
            carried = undefined;
            height = cursor === null ? graph.start - 1n : cursor.height;
            continue;
          }
          done = ended.cursor;
          carried = ended.carried;
        }
        // Stopped at the lockstep wait: the height's transaction never began.
        if (done === null) return SIGNALLED;
        cursor = done;
        height = done.height;
        if (this.#alone !== null && height >= this.#alone) this.#alone = null;
        if (height === last) return this.#stopped(height);
      }
    }
  }

  /**
   * The last height the loop processes: the core's stop, or the height before the upgrade boundary, whichever is lower;
   * null for neither.
   */
  protected lastHeight(): bigint | null {
    const { coreStop = null, boundary = null } = this.input;
    const beforeBoundary = boundary === null ? null : boundary - 1n;
    if (coreStop === null) return beforeBoundary;
    return beforeBoundary === null || coreStop < beforeBoundary ? coreStop : beforeBoundary;
  }

  /**
   * The re-delivery at the cursor `cursor` after a restart, before its next height: `on-after-db-write` and
   * `on-stop-height` of its height ({@link after}), with its block context and no `block` items. A failure stops the
   * loop with the height committed. The cursor's block committed before this run: the follower is told so, once per
   * loop.
   */
  protected async redeliver(cursor: BlockRef): Promise<void> {
    const { height } = cursor;
    try {
      this.#tell("committed", cursor);
      const range = this.#rangeAt(height);
      await this.after({ height, block: cursor, range, items: this.itemsAt(height), previous: null });
      this.#check();
    } catch (error) {
      throw this.#failure(height, error, true);
    }
  }

  /** How the loop ended at `height`, its last: at or above the core's stop, before the upgrade boundary, or both. */
  #stopped(height: bigint): LoopEnd {
    const { coreStop = null, boundary = null } = this.input;
    return Object.freeze({
      kind: "stopped",
      height,
      core: coreStop !== null && height >= coreStop,
      boundary: boundary !== null && height === boundary - 1n ? boundary : null,
    });
  }

  /**
   * A point between two heights (see the module comment): resolves at once unless a pause holds the loop
   * ({@link LoopInput.pause}), else once it is lifted or the loop's signal aborts. A negative control's seam.
   */
  protected pauseBetween(): Promise<void> {
    return this.input.pause?.between(this.#signal) ?? Promise.resolve();
  }

  /** Runs `body`, the wait for the head, as between heights for the pause (see the module comment). */
  #idle(body: () => Promise<void>): Promise<void> {
    const { pause } = this.input;
    return pause === undefined ? body() : pause.idle(body);
  }

  /** Waits for the source's head to exceed `above`, or for the signal to stop the loop (checked by the caller). */
  protected async wait(above: bigint): Promise<void> {
    try {
      await this.input.source.waitForHead(above, this.#signal);
    } catch (error) {
      if (!this.#signal.aborted) throw error;
    }
  }

  /**
   * The lockstep wait for `run`'s height, before its block transaction (see the module comment): true to go on to
   * `BEGIN`, false when the loop's signal stopped it; true at once without {@link LoopInput.lockstep}. A negative
   * control's seam.
   */
  protected lockstepWait(run: HeightRun): Promise<boolean> {
    const { lockstep } = this.input;
    return lockstep === undefined ? Promise.resolve(true) : lockstep.wait(run.height, this.#signal);
  }

  /** The `block` items of `height`. */
  protected itemsAt(height: bigint): BlockItems {
    return new BlockItems(height, (error, module, point) => this.#misused({ error, module, point }));
  }

  /**
   * The points before the block transaction: `on-fetch`, `on-parse`, `on-start-height` ({@link startHeight}), then
   * `on-compute` with a read at h − 1; a held height from the point it resumes at ({@link HeightRun.from}).
   */
  protected async prepare(run: HeightRun): Promise<void> {
    if (run.prepared !== true && run.from === undefined) {
      await this.blockPoint(run, "on-fetch");
      await this.blockPoint(run, "on-parse");
    }
    this.#reached(run, "on-start-height");
    if (run.from !== "on-compute") await this.startHeight(run);
    this.#reached(run, "on-compute");
    await this.compute(run, (body) => this.input.db.read(body));
  }

  /**
   * `on-start-height`: the entries starting at the height ({@link startingAt}), the core's parts first, then the modules
   * in the range's order. Each callback gets its entry and its own read at h − 1.
   */
  protected async startHeight(run: HeightRun): Promise<void> {
    const schedule = startHeightSchedule(run.range, this.startingAt(run));
    await this.#schedule(schedule, (part, call) => this.#entry(run, part, call));
  }

  /**
   * `on-stop-height`: the entries stopping at the height ({@link stoppingAt}), in {@link stopSchedule}'s order, each
   * callback with its entry and its own read at h.
   */
  protected async stopHeight(run: HeightRun): Promise<void> {
    const schedule = this.stopSchedule(run.range, this.stoppingAt(run));
    await this.#schedule(schedule, (part, call) => this.#entry(run, part, call));
  }

  /** The entries starting at the height of `run`: the core's at S, and the modules a segment of which starts there. */
  protected startingAt(run: HeightRun): EntryBoundary {
    const modules = this.#modules(run, (segment) => segment.from === run.height);
    return { core: run.height === this.input.graph.start, modules };
  }

  /**
   * The entries stopping at the height of `run`: the core's at and above its stop (above it only at a restart), and the
   * modules a segment of which ends there.
   */
  protected stoppingAt(run: HeightRun): EntryBoundary {
    const { coreStop = null } = this.input;
    const modules = this.#modules(run, (segment) => segment.to === run.height);
    return { core: coreStop !== null && run.height >= coreStop, modules };
  }

  /** `on-stop-height`'s order: the stopping modules in reverse order, then the core's parts. */
  protected stopSchedule(range: ResolvedRange, stopping: EntryBoundary): PointSchedule<"on-stop-height"> {
    return stopHeightSchedule(range, stopping);
  }

  /**
   * `on-fetch` or `on-parse`: each callback with its block context and an item sink; at `on-fetch` on a private process
   * also with its own read of public data, inside which it runs (the block source's `fetchRead`).
   */
  protected async blockPoint(run: HeightRun, point: "on-fetch" | "on-parse"): Promise<void> {
    const open = this.input.source.fetchRead;
    if (point === "on-fetch" && open !== undefined) {
      await this.#dispatch(run.range, "on-fetch", (part, call) => {
        const context = this.#context(run, part, run.items.visible(), false);
        return open((read) => run.items.collect(part, "on-fetch", (sink) => call(context, sink, read)), run.height);
      });
      return;
    }
    await this.#dispatch(run.range, point, (part, call) => {
      const context = this.#context(run, part, run.items.visible(), false);
      return run.items.collect(part, point, (sink) => call(context, sink));
    });
  }

  /**
   * `on-compute`: each callback with its block context, a read `open` opens for it, and an item sink. Its `continues`
   * is decided once the read is open, against the writer's session then ({@link continues}).
   */
  protected async compute(run: HeightRun, open: ReadOpener, options: ScheduleOptions = {}): Promise<void> {
    await this.#dispatch(
      run.range,
      "on-compute",
      (part, call) => {
        const items = run.items.visible();
        return open((read) => {
          // blockBeforeCommitted() is allowed until the callback's first statement through its read.
          let sent = false;
          const tracked: ReadHandle = {
            height: read.height,
            query: (sql, params) => {
              sent = true;
              return read.query(sql, params);
            },
          };
          const before = (): Promise<void> => {
            if (sent) throw blockBeforeRefused();
            return this.#blockBefore(run);
          };
          const context = this.#context(run, part, items, this.continues(run), before);
          return run.items.collect(part, "on-compute", (sink) => call(context, tracked, sink));
        });
      },
      options,
    );
  }

  /**
   * The block transaction: one `BEGIN … COMMIT` holding the height's {@link write}. Once its body ended, a failure is
   * the `COMMIT`'s, which may have committed.
   */
  protected async commit(run: HeightRun): Promise<void> {
    await this.input.db.transaction(async (tx) => {
      await this.write(tx, run);
      this.#bodiesEnded.add(run);
    });
  }

  /**
   * Inside the block transaction `tx`: every `on-db-write` callback with its block write handle, in order, then the
   * `on-settle` point ({@link settlePoint}); then, before the `COMMIT`, a misuse during the block fails it, and the block
   * source's cursor, read in `tx`, must be the height with the block's hash. Then the block's rows are in the open
   * transaction, and the follower is told so.
   */
  protected async write(tx: Transaction, run: HeightRun): Promise<void> {
    // A height some of whose callbacks were told the block before continues commits only on the writer's session that
    // committed that block: on another, another writer may have held the lock in between.
    const session = this.input.db.writerSession();
    const told = this.#toldContinuing.get(run);
    if (told !== undefined && session !== told) throw writerSessionReplaced(run.height, told, session);
    this.#writtenOn.set(run, session);
    const writes = openBlockWrites(tx, this.input.plan, {
      height: run.previous?.height ?? null,
      onClosedUse: (error) => this.#closedUse(error),
    });
    await this.#dispatch(run.range, "on-db-write", (part, call) => {
      const context = this.#context(run, part, run.items.visible(), this.continues(run));
      return writes.write(part.id, (w) => call(context, w));
    });
    if (this.#settleScheduleOf(run.range) !== null) await this.settlePoint(run, writes);
    await writes.end();
    this.#check();
    const cursor = await this.input.source.cursor(tx);
    if (cursor === null || cursor.height !== run.height || !sameBytes(cursor.hash, run.block.hash)) {
      const left =
        cursor === null
          ? "none"
          : cursor.height === run.height
            ? `height ${run.height} with another hash`
            : `height ${cursor.height}`;
      throw new UnexpectedCursor(
        `the block transaction of height ${run.height} left the cursor at ${left}, not at height ${run.height} with ` +
          `the block's hash: core-block-commit writes the block's row of ${BLOCKS_TABLE} first in every block, ` +
          "and core-private-source the private cursor on a private process",
      );
    }
    this.#tell("written", run.block);
  }

  /**
   * The `on-settle` point, inside the block transaction of `run`, after its last `on-db-write` callback and before the
   * cursor check: each callback in `on-db-write`'s order, with the run of heights it settles and a block write handle
   * of `writes`. In this version a run is always one block, `{ first: h, last: h }`. Its schedule is the range's, built
   * once ({@link #settleScheduleOf}); in a range where no part declares the point, {@link write} does not call it, so a
   * block schedules, sends and awaits nothing for it, and the slow-height window stays in `on-db-write`. While its
   * callbacks run a slow-height report names `on-settle`, and `on-db-write` again for the cursor check and the `COMMIT`.
   * A negative control's seam.
   */
  protected async settlePoint(run: HeightRun, writes: BlockWrites): Promise<void> {
    const schedule = this.#settleScheduleOf(run.range);
    if (schedule === null) return;
    const blocks: BlockRun = Object.freeze({ first: run.height, last: run.height });
    await this.#schedule(schedule, (part, call) => writes.write(part.id, (w) => call(blocks, w), "on-settle"));
    this.#enter("on-db-write");
  }

  /** The `on-settle` schedule of `range`, built at its first block and kept; null when no part of it declares the point. */
  #settleScheduleOf(range: ResolvedRange): PointSchedule<"on-settle"> | null {
    let schedule = this.#settleSchedules.get(range);
    if (schedule === undefined) {
      const built = scheduleAt(range, "on-settle");
      schedule = built.waves.length === 0 ? null : built;
      this.#settleSchedules.set(range, schedule);
    }
    return schedule;
  }

  /**
   * The points after the `COMMIT`: `on-after-db-write`, each callback with a read at h and no `block` items
   * ({@link afterWriteItems}), then `on-stop-height` ({@link stopHeight}).
   */
  protected async after(run: HeightRun): Promise<void> {
    await this.#dispatch(run.range, "on-after-db-write", (part, call) => {
      const items = this.afterWriteItems(run);
      // Its continues is decided once its read is open: the writer's session may have been lost since the COMMIT.
      return this.input.db.read((read) => call(this.#context(run, part, items, this.continues(run)), read));
    });
    await this.stopHeight(run);
  }

  /**
   * The `block` items of an `on-after-db-write` callback's context at the height of `run`: none, a map of its own, so
   * the same context can be rebuilt after a restart. A negative control's seam.
   */
  protected afterWriteItems(_run: HeightRun): ReadonlyMap<string, unknown> {
    return new Map();
  }

  /**
   * Whether the block before `run`'s height continues into it, as the block context made now says, from `on-compute`
   * on (`BlockContext.continues`): its `COMMIT` answered in this run of the loop, so no failure, retry or restart came
   * between, and the writer's session that committed it is the one the writer has now. False at a run's first height,
   * for a held height processed again, at the re-delivery, and from the first context made after the writer's session
   * was replaced (then for the rest of the height). Once a context said true, the height's transaction must run on that
   * session ({@link write}). A negative control's seam.
   */
  protected continues(run: HeightRun): boolean {
    const session = this.#continuing.get(run);
    if (session === undefined) return false;
    if (this.input.db.writerSession() !== session) {
      this.#continuing.delete(run);
      return false;
    }
    this.#toldContinuing.set(run, session);
    return true;
  }

  /** The height kept for the next run when a retryable failure stopped `held`'s (see the module comment): a seam. */
  protected held(held: HeldHeight): HeldHeight | undefined {
    return held;
  }

  /**
   * What `cursor`, read after `held`'s failure, says:
   * - after a failed `COMMIT` (`uncertain`), the height with the block's hash: it committed;
   * - the cursor before the height (none before S): it did not;
   * - anything else is unexpected, as is the height itself after a transaction that failed before its `COMMIT`.
   */
  protected commitOutcome(held: HeldHeight, cursor: BlockRef | null): CommitOutcome {
    const { block, previous } = held.run;
    if (held.uncertain && isBlock(cursor, block)) return "committed";
    return isBlock(cursor, previous) ? "not-committed" : "unexpected";
  }

  /**
   * Processes `height` above the cursor `previous` — a held height again from where it resumes —; resolves with the new
   * cursor, or null when the loop's signal stopped it at the lockstep wait, before its transaction.
   */
  async #process(
    height: bigint,
    previous: BlockRef | null,
    opened?: { readonly watch: Watch; readonly beginFrom: number },
  ): Promise<BlockRef | null> {
    let committed = false;
    const resume = this.#resume?.run.height === height ? this.#resume : this.#remade.get(height);
    this.#resume = undefined;
    this.#remade.delete(height);
    const kept = this.#keptFailure;
    if (kept !== undefined && kept.at === height) {
      // Its failure was kept while the blocks below it were stored again: it is not called again.
      this.#keptFailure = undefined;
      if (opened !== undefined) this.#unwatch(opened.watch, false);
      throw kept.failure;
    }
    let run: HeightRun | undefined;
    // A chunk whose takes left this height alone hands over its window, open since the takes began.
    const watch = opened?.watch ?? this.#watchHeight(height);
    try {
      const beginFrom = opened?.beginFrom ?? performance.now();
      run = resume === undefined ? await this.#begin(height, previous) : this.#again(resume);
      // The block before committed in this run, no failure since, on the writer's session still in use: its block
      // contexts say it continues.
      if (resume === undefined) this.#continueFrom(run, previous, null);
      const prepareFrom = performance.now();
      // The wait for the block from its source, and the height's start.
      traceAdd("beginMs", prepareFrom - beginFrom);
      await this.prepare(run);
      traceAdd("prepareMs", performance.now() - prepareFrom);
      if (!(await this.lockstepWait(run))) {
        // Stopped at the lockstep wait: the height's run, and its window, end here.
        this.#unwatch(watch, false);
        traceDropBlock();
        this.#tell("rolledBack", run.block);
        return null;
      }
      // For slow-height reports the block transaction is on-db-write's: its BEGIN, its callbacks, the cursor check, the
      // COMMIT; only the callbacks of the on-settle point inside it are reported as theirs.
      this.#enter("on-db-write");
      const transactionFrom = performance.now();
      await this.#transacting(this.commit(run));
      traceAdd("txMs", performance.now() - transactionFrom);
      committed = true;
      // The COMMIT that holds the height answered: the follower is told, and the next height continues from it.
      this.#tell("committed", run.block);
      this.#uncommitted.delete(run.height);
      this.#lastStored = Object.freeze({ block: run.block, session: this.#writtenOn.get(run) ?? null, chunk: null });
      this.input.observer?.committed?.(run.block);
      this.#unwatch(watch, true);
      await this.#afterCommit(run);
      traceEndBlock(run.block.height);
      this.#check();
      return run.block;
    } catch (error) {
      if (!committed) this.#unwatch(watch, false);
      const failure = this.#failure(height, error, committed);
      // A block stored again failed: a failure kept for a block above it is dropped, and logged, when this one stops
      // processing; it stays kept while this one is retried.
      const above = this.#keptFailure;
      if (above !== undefined && above.at > height && !isRetryable(failure)) {
        this.#keptFailure = undefined;
        this.input.observer?.dropped?.(above.failure);
      }
      if (!committed && run !== undefined) {
        this.#hold(run, failure);
        // The transaction did not commit, unless its body ended and its COMMIT lost its answer: then its outcome is not
        // known, whatever failure is reported (a misuse during the COMMIT comes first) and whether or not the height is
        // held, and the follower learns it from a cursor read (#settle, or the next start's re-delivery).
        if (!(this.#bodiesEnded.has(run) && answerLost(error))) this.#tell("rolledBack", run.block);
      }
      // Held with its COMMIT's outcome unknown, the height keeps its trace line for the run that learns it (#settle).
      if (!(this.#held?.uncertain === true && this.#held.run === run)) traceDropBlock();
      throw failure;
    }
  }

  /** Awaits `transaction`, the height's block transaction, held as {@link blockTransaction} until it settles. */
  async #transacting(transaction: Promise<void>): Promise<void> {
    this.#transaction = transaction.then(
      () => undefined,
      () => undefined,
    );
    try {
      await transaction;
    } finally {
      this.#transaction = undefined;
    }
  }

  /**
   * Records whether the block before `run` continues into it ({@link continues}): the last block stored in this run of
   * the loop is `previous`, on the writer's session in use now, and committed, or written in `chunk`, whose transaction
   * is still open. Not called for a height processed again.
   */
  #continueFrom(run: HeightRun, previous: BlockRef | null, chunk: OpenChunk | null): void {
    const session = this.input.db.writerSession();
    const before = this.#lastStored;
    if (session === null || before === null || before.session !== session || !isBlock(before.block, previous)) return;
    if (before.chunk !== null && (before.chunk !== chunk || !before.chunk.open)) return;
    this.#continuing.set(run, session);
  }

  /**
   * The last height of the chunk that starts at `first` under the head `head` read for this pass (`./fast-sync.ts`), or
   * null to process `first` alone: the mode is off, the loop waits for private instances at every block, `first` is a
   * held height processed again, or a take of `first` failed. A height whose take failed ends the chunk at the height
   * below it: it is not taken again, and its failure is thrown when the loop reaches it, alone.
   */
  #chunkEndAt(first: bigint, head: bigint): bigint | null {
    const { fastSync, lockstep } = this.input;
    if (fastSync === undefined || lockstep !== undefined) return null;
    if (this.#resume?.run.height === first) return null;
    const limits = { head, rangeEnd: this.#rangeEndAt(first), last: this.lastHeight(), alone: this.aloneUpTo() };
    let end = chunkEnd(fastSync, first, limits);
    if (end === null) return null;
    for (const failed of this.#takeFailures.keys()) if (failed >= first && failed <= end) end = failed - 1n;
    return end > first ? end : null;
  }

  /**
   * The last height of `first`'s range of the resolved graph, or of the `core` entry's revision covering `first` if
   * that ends first (the graph's ranges split at every module revision's start and stop, not at the core's, whose
   * settings the backbone parts read at each height); null when neither ends.
   */
  #rangeEndAt(first: bigint): bigint | null {
    const range = this.#rangeAt(first);
    const backbone = range.order.find(isBackbonePart);
    const core = backbone === undefined ? undefined : revisionAt(this.input.contextOf(backbone.id).revisions, first);
    const ends = [range.range.to, core?.stop ?? null].filter((end): end is bigint => end !== null);
    return ends.length === 0 ? null : ends.reduce((low, end) => (end < low ? end : low));
  }

  /**
   * The highest height of a chunk that did not commit while the cursor is below it, else null: no chunk forms at or
   * below it (see the module comment). A negative control's seam.
   */
  protected aloneUpTo(): bigint | null {
    return this.#alone;
  }

  /**
   * The failure of a block above the blocks of a chunk stored again after a rollback: thrown once they are stored, when
   * the loop reaches the block, which is not called again. A negative control's seam: undefined stores that block again
   * alone too.
   */
  protected keptFailure(failure: HeightFailure): HeightFailure | undefined {
    return failure;
  }

  /**
   * The chunk `first`..`end` above the cursor `previous` (see the module comment): its blocks taken first, in height
   * order, within `first`'s window. A take that fails at j makes the chunk `first`..j − 1, and `first` is processed
   * alone ({@link #process}) when that leaves it alone. `carried`, a block whose `on-compute` ran in the chunk before,
   * is `first`: it is stored in a chunk of its own here, with the blocks after it when they form one. Resolves with
   * the new cursor.
   */
  async #chunk(first: bigint, end: bigint, previous: BlockRef | null, carried?: Carried): Promise<ChunkEnd> {
    const watch = carried?.watch ?? this.#watchHeight(first);
    const beginFrom = performance.now();
    let last = end;
    for (let height = first; height <= end; height++) {
      if ((carried !== undefined && height === first) || this.#taken.has(height)) continue;
      // A stop asked meanwhile ends the takes; the blocks taken are stored as the loop's signal says.
      if (this.#signal.aborted || !(await this.#take(height))) {
        last = height - 1n;
        break;
      }
    }
    if (carried !== undefined) return this.#storeChunk(first, last > first ? last : first, previous, watch, beginFrom, carried.run);
    if (last <= first) return { cursor: await this.#process(first, previous, { watch, beginFrom }) };
    return this.#storeChunk(first, last, previous, watch, beginFrom);
  }

  /**
   * Takes the block at `height` for a chunk (see the module comment): as the source prepared it when it prepares
   * heights, else from the source with `on-fetch` and `on-parse` run by the loop; kept with its items until the loop
   * begins its run. False when the take failed: the failure is kept, and thrown when the loop reaches the height
   * ({@link #begin}).
   */
  async #take(height: bigint): Promise<boolean> {
    const { source } = this.input;
    let block: BlockRef | undefined;
    try {
      let items: BlockItems;
      if (source.prepared === undefined) {
        block = await source.block(height);
        const run: HeightRun = { height, block, range: this.#rangeAt(height), items: this.itemsAt(height), previous: null };
        await this.blockPoint(run, "on-fetch");
        await this.blockPoint(run, "on-parse");
        items = run.items;
      } else {
        const prepared = await source.prepared(height);
        block = prepared.block;
        items = prepared.items;
      }
      this.#taken.set(height, Object.freeze({ block, items }));
      this.#uncommitted.set(height, block);
      return true;
    } catch (error) {
      // Told rolled back when the loop reaches it: the block whose callbacks failed, in the queue or here.
      const told = source.prepared === undefined ? block : this.#failedPreparations.get(height);
      this.#takeFailures.set(height, Object.freeze({ height, error, block: told }));
      return false;
    } finally {
      for (const at of this.#failedPreparations.keys()) if (at <= height) this.#failedPreparations.delete(at);
    }
  }

  /**
   * Stores the chunk `first`..`last` above the cursor `previous`, its blocks taken (see the module comment): `first`'s
   * points before the transaction (unless `computed`, `first`'s run whose `on-compute` ran already), then one
   * transaction holding every block's writes, each block after the first computed after the block before's cursor
   * check, with reads of the transaction; then, at the `COMMIT`'s answer, the follower, the observer and each block's
   * points after the commit, in height order. Before the transaction it waits for what the later blocks ask of the
   * source ({@link #answered}); after the writes of each block that is not the chunk's last comes the block's end
   * ({@link endBlock}). Before each block after the first, the loop's signal, a pause hold or a block's end that the
   * transaction cannot go on from ends the chunk at the block before, and a callback of the block's `on-compute`
   * asking that the block before be committed (`blockBeforeCommitted`) does too, the block then carried over. Resolves
   * with the new cursor.
   */
  async #storeChunk(
    first: bigint,
    last: bigint,
    previous: BlockRef | null,
    watch: Watch,
    beginFrom: number,
    computed?: HeightRun,
  ): Promise<ChunkEnd> {
    const chunk = openChunk(previous);
    /** The chunk's runs begun, in height order, and their windows. */
    const runs: HeightRun[] = [];
    const windows: Watch[] = [watch];
    let current: HeightRun | undefined;
    let bodyEnd: number | undefined;
    /** True once the transaction's body ended without a failure: a failure after it is the COMMIT's. */
    let bodyDone = false;
    /**
     * A block after the first whose on-compute asked that the block before be committed, or failed: the chunk commits
     * at the block before it, and it is carried over (or its failure thrown), not written here.
     */
    let carried: { readonly run: HeightRun; readonly computing: Promise<void>; readonly computeFrom: number } | undefined;
    /** True when the chunk ended at a block whose transaction could not hold another ({@link endBlock}). */
    let unheld = false;
    try {
      const head = computed ?? (await this.#begin(first, previous));
      current = head;
      runs.push(head);
      const prepareFrom = performance.now();
      // The takes of every block of the chunk, and its first height's start.
      traceAdd("beginMs", prepareFrom - beginFrom);
      if (computed === undefined) {
        this.#continueFrom(head, previous, null);
        await this.prepare(head);
      }
      // What the later blocks' callbacks ask of the source is answered before the BEGIN, with nothing open.
      await this.#answered(first, last);
      traceAdd("prepareMs", performance.now() - prepareFrom);
      this.#enter("on-db-write");
      const transactionFrom = performance.now();
      this.#chunkOpen = chunk;
      await this.#transacting(
        this.input.db.transaction(async (tx) => {
          chunk.tx = tx;
          chunk.open = true;
          try {
            let writeFrom = transactionFrom;
            for (let run = head; ; ) {
              const written = run;
              /** True when the chunk commits at this block. */
              let ends = false;
              await chunk.turns.run(async () => {
                try {
                  await this.write(tx, written);
                  // The planned end, the loop's signal, or a pause hold: the chunk commits here.
                  ends = written.height >= last || this.#signal.aborted || this.pauseHeld();
                  // Else the block ends where a block alone would commit: its deferred constraints are checked, and
                  // a failure is this block's. A transaction that cannot hold another block commits here too.
                  if (!ends && !(await this.endBlock(tx, written))) ends = unheld = true;
                } catch (error) {
                  // Nothing else reads through a transaction that fails.
                  chunk.open = false;
                  throw error;
                }
              });
              this.#lastStored = Object.freeze({ block: run.block, session: this.#writtenOn.get(run) ?? null, chunk });
              chunk.height = run.height;
              // The block's own part of the transaction, the first's with the BEGIN; its line is held for the COMMIT.
              traceAdd("txMs", performance.now() - writeFrom);
              this.holdTrace(run);
              if (ends) break;
              run = await this.#begin(run.height + 1n, run.block);
              current = run;
              runs.push(run);
              windows.push(this.#nextWindow(run.height));
              this.#continueFrom(run, run.previous, chunk);
              const computeFrom = performance.now();
              this.#reached(run, "on-start-height");
              this.#reached(run, "on-compute");
              chunk.computing = run;
              const computing = this.compute(run, this.#viewOpener(chunk, run), { inSeries: true });
              const settled = computing.then(
                () => "computed" as const,
                () => "failed" as const,
              );
              const outcome = await Promise.race([settled, chunk.asked.promise.then(() => "asked" as const)]);
              chunk.computing = undefined;
              if (outcome !== "computed") {
                // Asked, or failed before its first write: the chunk commits at the block before.
                computing.catch(() => undefined);
                carried = { run, computing, computeFrom };
                break;
              }
              traceAdd("prepareMs", performance.now() - computeFrom);
              this.#enter("on-db-write");
              writeFrom = performance.now();
            }
            // The transaction's last turn: every user that asked before it has ended; later ones read on their own.
            await chunk.turns.run(async () => {
              chunk.open = false;
            });
            for (const run of runs) if (run !== carried?.run) this.#bodiesEnded.add(run);
            bodyDone = true;
          } finally {
            chunk.open = false;
            bodyEnd = performance.now();
          }
        }),
      );
    } catch (error) {
      this.#chunkOpen = undefined;
      chunk.committed.reject(error);
      let carriedFailure: { readonly error: unknown } | undefined;
      if (carried !== undefined) {
        await carried.computing.catch((failed: unknown) => {
          carriedFailure = { error: failed };
        });
      }
      return this.#notCommitted(error, { first, previous, runs, current, windows, bodyDone, carried: carried?.run, carriedFailure });
    }
    this.#chunkOpen = undefined;
    // The blocks up to the planned end are stored one per transaction: what ended this chunk would end the next.
    if (unheld) this.#alone = last;
    const commitMs = performance.now() - (bodyEnd as number);
    const stored = carried === undefined ? runs : runs.slice(0, -1);
    // The COMMIT answered: the follower is told of every block in height order, the observer once, of the new cursor.
    for (const run of stored) {
      this.#tell("committed", run.block);
      this.#uncommitted.delete(run.height);
    }
    const lastRun = stored.at(-1) as HeightRun;
    this.#lastStored = Object.freeze({ block: lastRun.block, session: this.#writtenOn.get(lastRun) ?? null, chunk: null });
    this.input.observer?.committed?.(lastRun.block);
    this.#endWindows(windows.slice(0, stored.length), true);
    traceCommitHeld([first, lastRun.height], commitMs);
    // blockBeforeCommitted() resolves: the carried block's on-compute goes on, with no transaction open.
    chunk.committed.resolve();
    /** The carried block's failure before its writes: its own, taken before the points after the commit run. */
    let computeFailure: HeightFailure | undefined;
    if (carried !== undefined) {
      try {
        await carried.computing;
      } catch (error) {
        computeFailure = this.#consumed(this.#failure(carried.run.height, error, false));
      }
      traceAdd("prepareMs", performance.now() - carried.computeFrom);
      this.#park(windows.at(-1) as Watch);
    }
    for (const run of stored) {
      traceResumeHeld();
      try {
        await this.#afterCommit(run);
        traceEndBlock(run.height);
        this.#check();
      } catch (error) {
        traceDropHeld();
        traceDropBlock();
        // A block carried over is not written: its run ends here, with the loop's.
        if (carried !== undefined) {
          this.#unwatch(windows.at(-1) as Watch, false);
          this.#tell("rolledBack", carried.run.block);
        }
        throw this.#failure(run.height, error, true);
      }
    }
    if (carried === undefined) return { cursor: lastRun.block };
    const window = windows.at(-1) as Watch;
    if (computeFailure !== undefined) {
      // The carried block failed before its writes: as a height alone that fails at on-compute.
      this.#unwatch(window, false);
      traceDropBlock();
      this.#hold(carried.run, computeFailure);
      this.#tell("rolledBack", carried.run.block);
      throw computeFailure;
    }
    this.#unpark(window);
    return { cursor: lastRun.block, carried: { run: carried.run, watch: window } };
  }

  /**
   * `blockBeforeCommitted()` of an `on-compute` callback of `run` (see `BlockContext`): at once unless `run` is a block
   * after its chunk's first, computed inside the transaction; then the chunk ends at the block before: the callback's
   * turn ends, the transaction's body ends and commits, and this resolves once the `COMMIT` answered and was told, or
   * rejects with its failure.
   */
  #blockBefore(run: HeightRun): Promise<void> {
    const chunk = this.#chunkOpen;
    if (chunk === undefined || chunk.computing !== run) return Promise.resolve();
    chunk.computing = undefined;
    chunk.endTurn?.();
    chunk.asked.resolve();
    return chunk.committed.promise;
  }

  /**
   * Holds the trace record of `run`, a block of a chunk whose writes ended, until the chunk's `COMMIT` (see the module
   * comment). A negative control's seam.
   */
  protected holdTrace(_run: HeightRun): void {
    traceHoldBlock();
  }

  /**
   * Waits until the source holds what the callbacks of the chunk's blocks after `first`, up to `last`, ask it for from
   * `on-compute` on (`BlockSource.answered`: the node source's ledger state roots), each block as it was taken; or
   * until the loop's signal aborts, and not at all when it has: the chunk then ends at its first block. It comes after
   * `first`'s `on-compute` and before the chunk's `BEGIN`, so a transaction that holds several blocks never waits for
   * the chain, and neither does a stop or a pause behind it. An answer that is a failure is the callback's that asks
   * for it, at its block.
   */
  async #answered(first: bigint, last: bigint): Promise<void> {
    const { source } = this.input;
    if (source.answered === undefined || this.#signal.aborted) return;
    const asked: Promise<void>[] = [];
    for (let height = first + 1n; height <= last; height++) asked.push(source.answered((this.#taken.get(height) as Taken).block));
    await untilAborted(Promise.allSettled(asked), this.#signal);
  }

  /**
   * Ends `run`, a block of a chunk that goes on, in the transaction `tx`, where a block alone would commit
   * (`../db/block-end.ts`): every deferred constraint is checked and every deferred trigger fired, a failure being this
   * block's, and the constraints are deferred again for the next block. False when the transaction cannot give the
   * next block what a new one would (a constraint that is deferrable and initially immediate, a temporary table of the
   * session, a cursor left open): the chunk then commits at this block. A negative control's seam.
   */
  protected endBlock(tx: Transaction, _run: HeightRun): Promise<boolean> {
    return endBlock(tx);
  }

  /**
   * Whether a pause hold is kept now ({@link LoopInput.pause}): inside a chunk it ends the chunk before the next block.
   * A negative control's seam.
   */
  protected pauseHeld(): boolean {
    return this.input.pause?.held === true;
  }

  /** Stops `watch`'s timer while the callbacks after an earlier block's commit run in windows of their own. */
  #park(watch: Watch): void {
    clearTimeout(watch.timer);
    watch.timer = undefined;
  }

  /** Makes `watch` the open window again, its timer running for what is left of `slowBlockMs`. */
  #unpark(watch: Watch): void {
    this.#watch = watch;
    const ms = this.slowBlockMs(watch.window);
    if (ms === null || watch.raised || watch.began === null) return;
    watch.timer = setTimeout(() => this.#raise(watch), Math.max(0, ms - (performance.now() - watch.began)));
  }

  /**
   * The chunk's transaction did not commit, or its first block failed before or in its writes (see the module
   * comment's failure rule): the windows closed, the record of the last stored block cleared; then by where it failed:
   * - before the `BEGIN` or in the first block's writes: as a height alone (held for a retry when retryable);
   * - the `COMMIT`'s answer lost: the chunk held, its outcome unknown, nothing told, its trace records kept;
   * - in the writes of a block k after the first, retryable: the chunk held; the next run stores a..k − 1 again and k
   *   alone from where it resumes;
   * - in those writes, not retryable: a..k − 1 stored again in this run, then k's failure thrown, k not called again;
   * - the `COMMIT` answered with an error: every block stored again, one per transaction.
   * The follower is told `rolledBack` for each block begun but where the answer was lost. Resolves to store the blocks
   * again from the cursor before the chunk, or rejects with the failure that stops the loop.
   */
  async #notCommitted(
    error: unknown,
    at: {
      readonly first: bigint;
      readonly previous: BlockRef | null;
      readonly runs: readonly HeightRun[];
      readonly current: HeightRun | undefined;
      readonly windows: readonly Watch[];
      readonly bodyDone: boolean;
      readonly carried: HeightRun | undefined;
      readonly carriedFailure: { readonly error: unknown } | undefined;
    },
  ): Promise<ChunkEnd> {
    const { first, previous, runs, current, windows, bodyDone, carried, carriedFailure } = at;
    this.#endWindows(windows, false);
    this.#lastStored = null;
    const failing = current ?? runs[0];
    const stored = carried === undefined ? runs : runs.slice(0, -1);
    const last = stored.at(-1);
    const kept = carried !== undefined && carriedFailure !== undefined ? this.#consumed(this.#failure(carried.height, carriedFailure.error, false)) : undefined;
    if (bodyDone && answerLost(error) && last !== undefined) {
      // The COMMIT's outcome is not known: the next run's cursor read decides.
      traceDropBlock();
      this.#heldChunk = this.heldChunk(Object.freeze({ runs: stored, uncertain: true, ...(carried === undefined ? {} : { carried }), ...(kept === undefined ? {} : { kept }) }));
      throw this.#failure(last.height, error, false);
    }
    traceDropHeld();
    traceDropBlock();
    for (const run of runs) this.#tell("rolledBack", run.block);
    if (!bodyDone && (failing === undefined || failing === runs[0])) {
      // Before the BEGIN, or in the first block's own writes: as a height alone.
      const failure = this.#failure(failing?.height ?? first, error, false);
      if (failing !== undefined) this.#hold(failing, failure);
      throw failure;
    }
    if (!bodyDone) {
      const k = failing as HeightRun;
      const failure = this.#consumed(this.#failure(k.height, error, false));
      this.#alone = k.height;
      if (isRetryable(failure)) {
        this.#heldChunk = this.heldChunk(Object.freeze({ runs, uncertain: false }));
        throw failure;
      }
      const thrown = this.keptFailure(failure);
      this.#storeAgain(thrown === undefined ? runs : runs.slice(0, runs.indexOf(k)), runs.at(-1));
      this.#keptFailure = thrown === undefined ? undefined : Object.freeze({ failure: thrown, at: k.height });
      return { cursor: previous, again: true };
    }
    // The COMMIT answered with an error: every block again, one per transaction; the block whose own COMMIT fails stops.
    this.#alone = (carried ?? (last as HeightRun)).height;
    this.#storeAgain(kept === undefined && carried !== undefined ? runs : stored, carried);
    this.#keptFailure = kept === undefined ? undefined : Object.freeze({ failure: kept, at: kept.height });
    return { cursor: previous, again: true };
  }

  /**
   * Keeps `runs`, blocks of a chunk that did not commit, to be stored again one per transaction ({@link #remade}): each
   * from `on-compute` with its items as `on-parse` left them, but `resumeFrom`, the block that failed in its writes,
   * from where it resumes.
   */
  #storeAgain(runs: readonly HeightRun[], resumeFrom?: HeightRun): void {
    for (const run of runs) {
      const progress = this.#progress.get(run);
      if (progress === undefined) continue;
      const from: ResumePoint = run === resumeFrom ? progress.from : "on-compute";
      this.#remade.set(run.height, Object.freeze({ run, items: progress.items, from, uncertain: false }));
    }
  }

  /** `failure`, the misuse it carries taken from the loop's record, so the blocks stored after it are not failed by it. */
  #consumed(failure: HeightFailure): HeightFailure {
    if (this.#misuse !== undefined && failure.cause === this.#misuse.error) this.#misuse = undefined;
    return failure;
  }

  /** The chunk kept for the next run when a retryable failure or a lost answer stopped it (see {@link HeldChunk}): a seam. */
  protected heldChunk(held: HeldChunk): HeldChunk | undefined {
    return held;
  }

  /**
   * The start of a run after one that held the chunk `held` (see the module comment): the cursor read on the writer;
   * after a lost answer, at the chunk's last block with its hash, the chunk committed: the follower and the observer
   * are told and each block's points after the commit run; at the cursor before the chunk, it did not: (after a lost
   * answer, the follower told `rolledBack`) its blocks are kept to be stored again one per transaction; anything else
   * stops with `unexpected-cursor` at the chunk's first block, nothing told. Resolves with the cursor to go on from.
   */
  async #settleChunk(held: HeldChunk): Promise<BlockRef | null> {
    const { db, source, observer } = this.input;
    const first = held.runs[0] as HeightRun;
    const last = held.runs.at(-1) as HeightRun;
    let cursor: BlockRef | null;
    try {
      cursor = await db.transaction((tx) => source.cursor(tx));
    } catch (error) {
      this.#heldChunk = held;
      throw this.#failure(first.height, error, false);
    }
    const carried = held.carried === undefined ? [] : [held.carried];
    if (held.uncertain && isBlock(cursor, last.block)) {
      for (const run of held.runs) {
        this.#tell("committed", run.block);
        this.#uncommitted.delete(run.height);
      }
      observer?.committed?.(last.block);
      traceCommitHeld([first.height, last.height], 0);
      for (const run of held.runs) {
        traceResumeHeld();
        try {
          await this.#afterCommit(run);
          traceEndBlock(run.height);
          this.#check();
        } catch (error) {
          traceDropHeld();
          traceDropBlock();
          throw this.#failure(run.height, error, true);
        }
      }
      if (held.carried !== undefined) {
        this.#alone = held.carried.height;
        if (held.kept === undefined) this.#storeAgain(carried);
        this.#keptFailure = held.kept === undefined ? undefined : Object.freeze({ failure: held.kept, at: held.kept.height });
      }
      return last.block;
    }
    traceDropHeld();
    if (!isBlock(cursor, first.previous)) {
      const expected = held.uncertain
        ? `neither height ${last.height} with the block's hash (committed) nor ${cursorText(first.previous)} (not committed)`
        : `not ${cursorText(first.previous)}, where it was`;
      throw this.#failure(
        first.height,
        new UnexpectedCursor(
          `after the transaction of heights ${first.height} to ${last.height} was lost the cursor is at ` +
            `${cursorText(cursor)}, ${expected}: another writer changed the database while the connection was lost`,
        ),
        false,
      );
    }
    if (held.uncertain) {
      for (const run of [...held.runs, ...carried]) this.#tell("rolledBack", run.block);
      this.#alone = (held.carried ?? last).height;
      this.#storeAgain(held.kept === undefined ? [...held.runs, ...carried] : held.runs);
      this.#keptFailure = held.kept === undefined ? undefined : Object.freeze({ failure: held.kept, at: held.kept.height });
    } else {
      // The block that failed, last, again alone from where it resumes; the blocks below it from on-compute.
      this.#alone = last.height;
      this.#storeAgain(held.runs, last);
    }
    return first.previous;
  }

  /** The window of `height`, a block after its chunk's first: the window before it is held, its timer stopped. */
  #nextWindow(height: bigint): Watch {
    const before = this.#watch;
    if (before !== undefined) clearTimeout(before.timer);
    return this.#watchHeight(height);
  }

  /**
   * Closes a chunk's `windows` — `completed`: its `COMMIT` answered; else it rolled back —, the observer told of each
   * that was slow.
   */
  #endWindows(windows: readonly Watch[], completed: boolean): void {
    for (const watch of windows) {
      if (this.#watch === watch) this.#watch = undefined;
      clearTimeout(watch.timer);
      if (!watch.raised) continue;
      const ms = performance.now() - (watch.began as number);
      this.input.observer?.slow?.({ kind: "ended", window: watch.window, height: watch.height, completed, ms });
    }
  }

  /**
   * The reads of `run`'s `on-compute` callbacks, a block after its chunk's first: each callback takes a turn of the
   * transaction, and its read at the block before opens at its first statement, as a read-only view of the transaction
   * (`../db/read-view.ts`), or as its own read once the transaction has ended. It closes when the callback settles.
   */
  #viewOpener(chunk: OpenChunk, run: HeightRun): ReadOpener {
    const height = run.previous?.height ?? null;
    return async (body) => {
      const end = await chunk.turns.take();
      chunk.endTurn = end;
      try {
        return await this.#lazyRead(chunk, height, body);
      } finally {
        end();
        if (chunk.endTurn === end) chunk.endTurn = undefined;
      }
    };
  }

  /**
   * Runs `body` with a read-only view of the chunk's transaction `tx` reporting `height` (`../db/read-view.ts`): every
   * view of a chunk's transaction opens here, a later block's `on-compute` callback's ({@link #lazyRead}, whose handle
   * every statement of the callback goes through) and {@link read}'s. A negative control's seam.
   */
  protected openView<T>(tx: Transaction, height: bigint | null, body: (read: ReadHandle) => Promise<T>): Promise<T> {
    return readView(tx, { height }, body);
  }

  /** Runs `body` with a read reporting `height`, opened at its first statement (see {@link #viewOpener}). */
  async #lazyRead<T>(chunk: OpenChunk, height: bigint | null, body: (read: ReadHandle) => Promise<T>): Promise<T> {
    let settled = false;
    let opened: { readonly handle: Promise<ReadHandle>; readonly done: Promise<void>; readonly release: () => void } | undefined;
    const open = (): Promise<ReadHandle> => {
      if (opened === undefined) {
        let release!: () => void;
        const until = new Promise<void>((resolve) => {
          release = resolve;
        });
        let give!: (read: ReadHandle) => void;
        const given = new Promise<ReadHandle>((resolve) => {
          give = resolve;
        });
        const hold = async (read: ReadHandle): Promise<void> => {
          give(read);
          await until;
        };
        const done = chunk.open && chunk.tx !== undefined ? this.openView(chunk.tx, height, hold) : this.input.db.read(hold);
        // A read that fails before it opened rejects the statement that asked for it.
        opened = { handle: Promise.race([given, done.then(() => given)]), done, release };
      }
      return opened.handle;
    };
    const read: ReadHandle = {
      height,
      query: async (sql, params) => {
        if (settled) throw handleClosed("read");
        return (await open()).query(sql, params);
      },
    };
    let outcome: { readonly result: T } | { readonly error: unknown };
    try {
      outcome = { result: await body(read) };
    } catch (error) {
      outcome = { error };
    } finally {
      settled = true;
    }
    if (opened !== undefined) {
      opened.release();
      // A close that failed wins over the body's outcome, as the view's own.
      await opened.done;
    }
    if ("error" in outcome) throw outcome.error;
    return outcome.result;
  }

  /**
   * A new run of `height` above `previous`: its block taken for a chunk, or from the source, prepared by it when it
   * prepares heights. A take of the height that failed is thrown here, the source not asked again.
   */
  async #begin(height: bigint, previous: BlockRef | null): Promise<HeightRun> {
    const failed = this.#takeFailures.get(height);
    if (failed !== undefined) {
      this.#takeFailures.delete(height);
      if (failed.block !== undefined) this.#tell("rolledBack", failed.block);
      throw failed.error;
    }
    const taken = this.#taken.get(height);
    if (taken !== undefined) {
      this.#taken.delete(height);
      return { height, block: taken.block, range: this.#rangeAt(height), items: taken.items, previous, prepared: true };
    }
    const { source } = this.input;
    const prepared = source.prepared === undefined ? undefined : await this.#prepared(source.prepared.bind(source), height);
    const block = prepared?.block ?? (await source.block(height));
    const items = prepared?.items ?? this.itemsAt(height);
    return { height, block, range: this.#rangeAt(height), items, previous, prepared: prepared !== undefined };
  }

  /**
   * The height `height` as the source's queue prepared it (`BlockSource.prepared`). When the queue's `on-fetch` or
   * `on-parse` of it failed, the height's run ends here, before it was written: the follower is told `rolledBack` for
   * the block that failed, now that the loop takes that failure, never from the queue (another height's transaction
   * may be open while the queue prepares).
   */
  async #prepared(prepared: (height: bigint) => Promise<PreparedBlock>, height: bigint): Promise<PreparedBlock> {
    try {
      return await prepared(height);
    } catch (error) {
      const failed = this.#failedPreparations.get(height);
      if (failed !== undefined) this.#tell("rolledBack", failed);
      throw error;
    } finally {
      for (const at of this.#failedPreparations.keys()) if (at <= height) this.#failedPreparations.delete(at);
    }
  }

  /** `held`'s run again: its items as `on-parse` left them, from the point it resumes at. */
  #again(held: HeldHeight): HeightRun {
    held.run.items.restore(held.items);
    return { ...held.run, from: held.from };
  }

  /**
   * The loop is on `height` (see the module comment): its window opens at once when the source's queue runs its
   * `on-fetch` or `on-parse` now, else with the first callback of it that starts.
   */
  #watchHeight(height: bigint): Watch {
    const watch: Watch = {
      window: "height",
      height,
      began: null,
      activity: undefined,
      timer: undefined,
      raised: false,
    };
    this.#watch = watch;
    const queued = this.#preparing.get(height);
    if (queued !== undefined) this.#open(watch, queued);
    return watch;
  }

  /**
   * Runs `body`, callbacks the loop awaits outside a height's processing, in a window of its own, `window` at `height`,
   * open from now in `point`, closed when `body` ends or fails.
   */
  async #timed(
    window: Exclude<SlowWindow, "height">,
    height: bigint,
    point: PointName,
    body: () => Promise<void>,
  ): Promise<void> {
    const watch: Watch = { window, height, began: null, activity: undefined, timer: undefined, raised: false };
    this.#watch = watch;
    this.#open(watch, new Activity(point));
    let completed = false;
    try {
      await body();
      completed = true;
    } finally {
      this.#unwatch(watch, completed);
    }
  }

  /** `run`'s points after its `COMMIT` ({@link after}): one window, from the commit to the end of `on-stop-height`. */
  #afterCommit(run: HeightRun): Promise<void> {
    return this.#timed("after-commit", run.height, "on-after-db-write", () => this.after(run));
  }

  /** Opens `watch`'s window, recorded in `activity`, and starts the timer of `slowBlockMs` when there is one. */
  #open(watch: Watch, activity: Activity): void {
    watch.began = performance.now();
    watch.activity = activity;
    const ms = this.slowBlockMs(watch.window);
    if (ms !== null) watch.timer = setTimeout(() => this.#raise(watch), ms);
  }

  /** `watch`'s window has been open longer than `slowBlockMs`: it is slow, and the observer is told. */
  #raise(watch: Watch): void {
    watch.raised = true;
    this.input.observer?.slow?.({ kind: "raised", activity: this.#activityOf(watch) });
  }

  /**
   * `point` began in the open window, if one is open: a height's opens if it was not yet; returns what records its
   * callbacks.
   */
  #enter(point: PointName): Activity | undefined {
    const watch = this.#watch;
    if (watch === undefined) return undefined;
    if (watch.activity === undefined) this.#open(watch, new Activity(point));
    else watch.activity.point = point;
    return watch.activity;
  }

  /**
   * Closes `watch`'s window — `completed`: its height committed, or its callbacks ended; else its run failed or
   * stopped —; the observer is told when it was slow.
   */
  #unwatch(watch: Watch, completed: boolean): void {
    this.#watch = undefined;
    clearTimeout(watch.timer);
    if (!watch.raised) return;
    const ms = performance.now() - (watch.began as number);
    this.input.observer?.slow?.({ kind: "ended", window: watch.window, height: watch.height, completed, ms });
  }

  /** What the loop does in an open window `watch` now. */
  #activityOf(watch: Watch): HeightActivity {
    const activity = watch.activity as Activity;
    const sinceMs = performance.now() - (watch.began as number);
    const { window, height } = watch;
    return Object.freeze({ window, height, point: activity.point, module: activity.module, sinceMs });
  }

  /**
   * What the source's queue runs for `height` from now on (`QueueRunner.prepare`); when the loop is on that height and
   * no callback of it has started, its window opens with it.
   */
  #preparingAt(height: bigint): Activity {
    const activity = new Activity("on-fetch");
    this.#preparing.set(height, activity);
    const watch = this.#watch;
    if (watch?.height === height && watch.activity === undefined) this.#open(watch, activity);
    return activity;
  }

  /** Records that `run` reached `point`; at the first, its items (what holding it needs). */
  #reached(run: HeightRun, point: ResumePoint): void {
    const progress = this.#progress.get(run);
    if (progress === undefined) this.#progress.set(run, { items: run.items.visible(), from: point });
    else progress.from = point;
  }

  /** Keeps `run` for the next run of the loop when `failure` is retried and came after its `on-parse`. */
  #hold(run: HeightRun, failure: HeightFailure): void {
    const progress = this.#progress.get(run);
    if (progress === undefined || !isRetryable(failure)) return;
    const { items, from } = progress;
    this.#held = this.held(Object.freeze({ run, items, from, uncertain: this.#bodiesEnded.has(run) }));
  }

  /**
   * The start of a run after one that held `held` (see the module comment): the cursor read on the writer, then
   * {@link commitOutcome}; resolves with the cursor to go on from, or rejects with the height's failure.
   */
  async #settle(held: HeldHeight): Promise<BlockRef | null> {
    const { db, source, observer } = this.input;
    const { run } = held;
    let cursor: BlockRef | null;
    try {
      cursor = await db.transaction((tx) => source.cursor(tx));
    } catch (error) {
      this.#held = held;
      throw this.#failure(run.height, error, false);
    }
    const outcome = this.commitOutcome(held, cursor);
    // The height's trace line, kept through an uncertain COMMIT (#process): written if it committed, else dropped.
    if (outcome !== "committed") traceDropBlock();
    // The follower learns now what became of an unknown COMMIT (one that failed before its COMMIT was told at the
    // failure). An unexpected cursor tells nothing: the transaction's outcome is not known, and processing halts.
    if (outcome === "not-committed" && held.uncertain) this.#tell("rolledBack", run.block);
    if (outcome === "not-committed") {
      // The height again, above the cursor before it (which the cursor read is).
      this.#resume = held;
      return run.previous;
    }
    if (outcome === "unexpected") {
      const lost = held.uncertain
        ? `the COMMIT of height ${run.height} was lost`
        : `the block transaction of height ${run.height} was lost before its COMMIT`;
      const expected = held.uncertain
        ? `neither height ${run.height} with the block's hash (committed) nor ${cursorText(run.previous)} (not committed)`
        : `not ${cursorText(run.previous)}, where it was`;
      throw this.#failure(
        run.height,
        new UnexpectedCursor(
          `after ${lost} the cursor is at ${cursorText(cursor)}, ${expected}: another writer changed the database ` +
            "while the connection was lost",
        ),
        false,
      );
    }
    this.#tell("committed", run.block);
    observer?.committed?.(run.block);
    try {
      await this.#afterCommit(run);
      traceEndBlock(run.block.height);
      this.#check();
    } catch (error) {
      traceDropBlock();
      throw this.#failure(run.height, error, true);
    }
    return run.block;
  }

  /**
   * `on-finalized` for `head`, before its heights from `next` on: each callback with a read at the cursor, in a window
   * of its own, named by the head's height.
   */
  async #finalized(head: BlockRef, next: bigint): Promise<void> {
    const announced = Object.freeze({ height: head.height, hash: head.hash });
    const range = this.#rangeAt(next);
    await this.#timed("finalized", head.height, "on-finalized", () =>
      this.#dispatch(range, "on-finalized", (_part, call) => this.input.db.read((read) => call(announced, read))),
    );
  }

  /**
   * The runner's dispatch interface for the source's queue (see the module comment): each point through
   * `runSchedule` with the process contexts, outside the loop's own points; the item sinks' late uses are the loop's
   * misuses, as at its own points.
   */
  #queueRunner(): QueueRunner {
    const { contextOf, db } = this.input;
    const queuePoint = async (run: HeightRun, point: "on-fetch" | "on-parse", activity: Activity): Promise<void> => {
      activity.point = point;
      await runSchedule(scheduleAt(run.range, point), {
        contextOf,
        invoke: tracked<"on-fetch" | "on-parse">(activity, (part, call) => {
          const context = this.#context(run, part, run.items.visible(), false);
          return run.items.collect(part, point, (sink) => call(context, sink));
        }),
      });
    };
    const header = (block: BlockRef): BlockRef =>
      Object.freeze({ height: block.height, hash: block.hash, parentHash: block.parentHash });
    return Object.freeze({
      prepare: async (block: BlockRef) => {
        const run: HeightRun = {
          height: block.height,
          block,
          range: this.#rangeAt(block.height),
          items: this.itemsAt(block.height),
          previous: null,
        };
        const activity = this.#preparingAt(block.height);
        try {
          await queuePoint(run, "on-fetch", activity);
          await queuePoint(run, "on-parse", activity);
          this.#failedPreparations.delete(block.height);
        } catch (error) {
          // Told to the follower only when the loop takes this height and finds its preparation failed (#prepared).
          this.#failedPreparations.set(block.height, block);
          throw error;
        } finally {
          // A second prepare of the height still running (a best block and the finalized one) loses its entry: the
          // loop then waits for it with its window not yet open, which counts less, never more.
          this.#preparing.delete(block.height);
        }
        return run.items;
      },
      bestBlock: async (block: BlockRef) => {
        const announced = header(block);
        await runSchedule(scheduleAt(this.#rangeAt(block.height), "on-best-block"), {
          contextOf,
          invoke: (_part, call) => call(announced),
        });
      },
      rollback: async (dropped: readonly BlockRef[]) => {
        const first = dropped[0];
        if (first === undefined) return;
        const headers = Object.freeze(dropped.map(header)) as BlockRef[];
        await runSchedule(scheduleAt(this.#rangeAt(first.height), "on-rollback"), {
          contextOf,
          invoke: (_part, call) => call(headers),
        });
      },
      // A height taken and not committed is answered from the block taken: a read does not see the chunk's rows.
      storedHash: (height: bigint) => {
        const taken = this.#uncommitted.get(height);
        if (taken !== undefined) return Promise.resolve(taken.hash);
        return db.read(async (read) => {
          const [row] = await read.query(`SELECT hash FROM ${BLOCKS_TABLE} WHERE height = $1`, [height]);
          return row === undefined ? null : (row.hash as Uint8Array);
        });
      },
    });
  }

  /** Runs `point` in `range`, each callback through `invoke`, after checking no misuse is pending. */
  async #dispatch<P extends PointName>(
    range: ResolvedRange,
    point: P,
    invoke: Invoke<P>,
    options: ScheduleOptions = {},
  ): Promise<void> {
    await this.#schedule(scheduleAt(range, point), invoke, options);
  }

  /**
   * Runs `schedule`, each callback through `invoke`, after checking no misuse is pending; for the height in progress,
   * recording the point and its running callbacks.
   */
  async #schedule<P extends PointName>(
    schedule: PointSchedule<P>,
    invoke: Invoke<P>,
    options: ScheduleOptions = {},
  ): Promise<void> {
    this.#check();
    this.#point = schedule.point;
    const activity = this.#enter(schedule.point);
    try {
      await runSchedule(schedule, { contextOf: this.input.contextOf, invoke: tracked(activity, invoke) }, options);
    } finally {
      this.#point = undefined;
    }
  }

  /** An `on-start-height` or `on-stop-height` callback of `part` at the height of `run`: its entry, its own read. */
  #entry(
    run: HeightRun,
    part: ModuleDeclaration,
    call: (...args: PointArguments<"on-start-height" | "on-stop-height">) => Promise<void>,
  ): Promise<void> {
    const entry = Object.freeze({ entryId: entryIdOf(part), height: run.height });
    return this.input.db.read((read) => call(entry, read));
  }

  /** The ids of the modules (not the backbone's parts) of `run`'s range one of whose segments `matches`. */
  #modules(run: HeightRun, matches: (segment: HeightRange) => boolean): string[] {
    const { segments } = this.input.graph;
    return run.range.order
      .filter((part) => !isBackbonePart(part) && (segments.get(part.id) as readonly HeightRange[]).some(matches))
      .map((part) => part.id);
  }

  /**
   * The block context of `part`'s callback at the height of `run`, with `items`; `continues` says whether the block
   * before continues into it (always false at `on-fetch` and `on-parse`, which may run before the block before
   * committed); `blockBeforeCommitted` is `on-compute`'s ({@link compute}), and throws a programming error anywhere
   * else.
   */
  #context(
    run: HeightRun,
    part: ModuleDeclaration,
    items: ReadonlyMap<string, unknown>,
    continues: boolean,
    blockBeforeCommitted: () => Promise<void> = () => {
      throw blockBeforeRefused();
    },
  ): BlockContext {
    const { block } = run;
    const { graph, contextOf } = this.input;
    return Object.freeze({
      height: block.height,
      hash: block.hash,
      parentHash: block.parentHash,
      items,
      settings: revisionAt(contextOf(part.id).revisions, block.height)?.settings ?? Object.freeze({}),
      active: (id: string) =>
        (graph.segments.get(id) ?? []).some(
          (segment) => segment.from <= block.height && (segment.to === null || block.height <= segment.to),
        ),
      continues,
      blockBeforeCommitted,
    });
  }

  /**
   * Tells the follower, if any, `fact` of `block` (see the module comment): its height and hash. A block this loop told
   * committed already is not told again (a run again after a retry re-delivers it).
   */
  #tell(fact: keyof TransactionFollower, block: BlockRef): void {
    if (fact === "committed") {
      if (this.#toldCommitted !== null && isBlock(this.#toldCommitted, block)) return;
      this.#toldCommitted = block;
    }
    this.input.follower?.[fact](Object.freeze({ height: block.height, hash: block.hash }));
  }

  /** The range of the graph holding `height`; throws for none (a graph resolved from another cursor). */
  #rangeAt(height: bigint): ResolvedRange {
    const range = this.input.graph.rangeAt(height);
    if (range === undefined) {
      throw new Error(
        `the resolved graph has no range holding height ${height}: it must be resolved from this database's cursor`,
      );
    }
    return range;
  }

  /** A write handle used after its callback ended: its error names the module and the point. */
  #closedUse(error: UmbraError): void {
    this.#misused({ error, module: error.details.module as string, point: error.details.point as PointName });
  }

  /** Keeps the first misuse. */
  #misused(misuse: Misuse): void {
    this.#misuse ??= misuse;
  }

  /** Throws the misuse kept, if any. */
  #check(): void {
    if (this.#misuse !== undefined) throw this.#misuse.error;
  }

  /** The loop's failure at `height` for `error`: the misuse kept first, then a callback's failure, then `error`. */
  #failure(height: bigint, error: unknown, committed: boolean): HeightFailure {
    const misuse = this.#misuse;
    if (misuse !== undefined) {
      return new HeightFailure(height, misuse.error, { point: misuse.point, module: misuse.module, committed });
    }
    return heightFailure(height, error, committed);
  }
}

/** Runs the finalized loop over `input` (see {@link FinalizedLoop.run}). */
export function runFinalized(input: LoopInput): Promise<LoopEnd> {
  return new FinalizedLoop(input).run();
}
