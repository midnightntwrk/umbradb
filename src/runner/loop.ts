/**
 * The finalized loop: the runner's processing of finalized heights. It runs from the cursor + 1 (S on a new database)
 * up to the block source's finalized head, in order and without skipping one, then waits for the head to rise.
 * [RN-1, RN-4, RN-14; design §2, §3; CORE-ARCH §4.2, §4.5]
 *
 * **Per new head** the loop calls `on-finalized` once, before the head's heights, each callback with its own read handle
 * at the cursor. **Per height h**, it runs these steps through the point dispatch (`./dispatch.ts`), in the order of the
 * range of the resolved graph holding h:
 * 1. `on-fetch` and `on-parse`: the block context and an item sink, no database handle. On a private process each
 *    `on-fetch` callback also gets its own read of public data (the block source's `fetchRead`). [PP-3, Q100]
 * 2. `on-compute`: the block context, a read handle at h − 1 and an item sink. Each callback runs inside its own read
 *    (`Database.read`), so on PGlite a `db.read` from inside it fails with `nested-call` rather than waiting, and a
 *    callback's failing statement aborts no other callback's read. [DB-4, Q73]
 * 3. The block transaction: one `BEGIN … COMMIT` holding every `on-db-write` callback of h, each with its block write
 *    handle (`src/db/write-handles.ts`), in the point's fixed callback order. `core-block-commit` runs first and writes
 *    the cursor row (on a private process, `core-private-source` does). Before the `COMMIT`, the loop checks that the
 *    block source's cursor is h with the block's hash. Nothing else of the loop writes. [RN-2, RN-3, RN-6, CD-3]
 * 4. `on-after-db-write`: the block context without `block` items and a read handle at h, each callback in its own
 *    read.
 *
 * Between `on-parse` and `on-compute`, `on-start-height` runs for the entries starting at h: the core's parts when h is
 * S, then the modules one of whose segments of the graph (`ResolvedGraph.segments`) starts at h. Revisions that continue
 * each other are one segment, so a revision boundary starts nothing. Each callback gets a read at h − 1.
 * [RN-9, CF-5, A42]
 *
 * After `on-after-db-write`, `on-stop-height` runs for the entries stopping at h: the modules one of whose segments ends
 * at h, in reverse order, then the core's parts when h is the core's stop. Each gets a read at h. [RN-10]
 *
 * **The lockstep wait.** Given {@link LoopInput.lockstep} (the core's bookkeeping of the private instances its `core`
 * entry lists in `lockstepInstances`, `src/private/lockstep.ts`), the loop awaits it for each height h after h's
 * `on-compute` and before h's block transaction, once every read of h has ended. Nothing is open while it waits, so a
 * private instance's reads through the core (on PGlite, its one queue) are served meanwhile. It resolves true once every
 * listed instance has committed h − 1, and the loop goes on to `BEGIN`. It resolves false when the loop's signal stopped
 * it first; h's transaction never began, and the loop ends with its signal, h not committed. [PP-6, RN-13]
 *
 * **The pause between heights.** Given {@link LoopInput.pause}, the loop stops at each point between two heights while
 * a hold is kept (`./pause.ts`). These points are:
 * - before it reads the head: after the re-delivery at a run's start, after a head's last height, after a wait;
 * - before each height: after `on-finalized`, after the previous height's `on-stop-height`.
 *
 * No transaction is open there and every read of the previous height has ended. The wait for the head counts as between
 * heights: a hold asked for meanwhile is reached at once, and when the head rises the loop stops at its next step.
 * Paused, the loop reads no head, runs no point and has no slow-height window open. Its signal ends the pause, and the
 * loop then ends with it. [BK-1, Q152 B, RN-11, RN-13, RN-17]
 *
 * **At a restart**, with the cursor c, the loop first runs `on-after-db-write` for c and `on-stop-height` for the
 * entries stopping at c (the core's when c is at or above its stop), before c + 1, because a crash may have come before
 * they completed. They run in the order of the range holding c, with the block context of c and no `block` items. Both
 * points run in series, so the range ending at the cursor, which startup checks for a cycle only, gives them their
 * order. [RN-11]
 *
 * **Where it ends.** The loop ends after the core's stop ({@link LoopInput.coreStop}); with the cursor already at or
 * above it, it processes nothing. It also ends after the height before an upgrade boundary ({@link LoopInput.boundary}),
 * the first height of a revision whose version this build does not carry. In both cases it commits that height,
 * completes its `on-after-db-write` and `on-stop-height`, and resolves with a {@link LoopEnd} saying which. [RN-10, RN-12]
 *
 * Its signal stops it before the next height, or while it waits; the height in progress finishes. While a height's
 * block transaction is open (from its request until it has committed or rolled back),
 * {@link FinalizedLoop.blockTransaction} gives it: the process's stop closes the node client at once when none is open,
 * else once it settled (`./process.ts`). [RN-13]
 *
 * **The block context** of each callback holds the block's height, hash and parent hash, the `block` items published
 * before the callback started (`./block-context.ts`: a callback's puts are published when it completes), the calling
 * module's settings for the revision covering h, and whether a module's entry is active at h. At `on-after-db-write` it
 * holds no items. [RN-5]
 *
 * **Nothing is open while the loop waits** for the head: every read and the block transaction have ended. [RN-6, RN-14]
 *
 * **Failures** stop the loop: {@link FinalizedLoop.run} rejects with a {@link HeightFailure} naming the height, whether
 * it committed and, for a callback's failure, the point and the module (the dispatch's `CallbackFailure`, with the error
 * itself as its cause). [RN-8]
 *
 * A use of a closed write handle, or a put from a kept item sink, is a callback error even when no callback rejects with
 * it (a timer, a module that catches it). The loop keeps the first, names its module and point, and fails the height in
 * progress before its `COMMIT`, or stops once the height's last point ended, or before the next height. The same holds
 * for a `publish` the process contexts refuse (`./process-context.ts`): they report it to the loop
 * ({@link LoopInput.misuses}), named by its module and the point the loop was dispatching, none while it waits.
 * [DB-3, MD-7]
 *
 * The halt (the state `halted` with its reason, the process staying up) and the retries of a lost connection or an
 * unreachable node, which run the loop again, belong to the process (`./process.ts`, `./failures.ts`). [RN-8, IN-10]
 *
 * **A height held for a retry.** A retryable failure (`UmbraError.retryable`: `connection-lost`, `node-unreachable`,
 * directly or as a callback's) may stop h after its `on-parse` and before it committed. Then the loop keeps h
 * ({@link HeldHeight}): its block, its range, the cursor before it, its `block` items as `on-fetch` and `on-parse` left
 * them, the point it resumes at, and whether the failure came from the `COMMIT`. The process runs the same loop again
 * after its back-off, and that next run starts with h instead of the cursor's re-delivery: [IN-10, IN-11]
 * 1. It reads the cursor inside a transaction, on the writer. After a lost connection that is a new session, which
 *    takes the writer lock again before anything else (`writer-lock-lost` when another process took it), so nothing can
 *    move the cursor after it is read. A failure of that read keeps h held for the run after. [DB-11]
 * 2. {@link FinalizedLoop.commitOutcome} reads the cursor: [IN-11]
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
 * fetches h again. [IN-10, RN-11]
 *
 * **A source that fetches ahead** (`core-block-fetch`'s node source) is given, for each run, the runner's dispatch
 * interface for its queue ({@link QueueRunner}: `on-fetch` and `on-parse` of a block it fetched ahead, `on-best-block`,
 * `on-rollback`, and the hash stored at a height), taken back when the run ends. The loop takes each height from it
 * prepared (`BlockSource.prepared`), with `on-fetch` and `on-parse` already run and their items in the height's, and
 * goes on to `on-start-height` and `on-compute` with them. The queue's callbacks run outside the loop's points, each
 * with its block context as the loop builds it. [IN-4, IN-5, IN-6]
 *
 * **A slow height** is reported, never cut off: nothing here cancels, times out or retries a height for its time. Each
 * run of a height has a window, from its first callback after `on-finalized` to its `COMMIT`. Where the window starts:
 * [RN-17, Q71]
 * - normally, at its `on-fetch`;
 * - for a height the source prepares ahead: when the loop asks for it, if its `on-fetch` or `on-parse` runs in the
 *   queue by then, else when one starts there. The queue's earlier work for it, beside the heights before it, is not
 *   its time, nor is the fetch from the node before its first callback;
 * - for a held height processed again: where it resumes. A back-off is never in a window.
 *
 * While the window is open the loop knows the point the height is in and the modules whose callbacks run. The point is
 * the last of its points that began; from the block transaction's request on, it is `on-db-write` (its `BEGIN`, its
 * callbacks, the cursor check, the `COMMIT`). Once a window has been open longer than {@link LoopInput.slowBlockMs} (a
 * timer of the main thread, so not while a callback blocks it), {@link FinalizedLoop.slowBlock} gives the height, its
 * point and the first module running in the point's order, and the observer is told ({@link LoopObserver.slow}). The
 * window closes when the height commits, or when its run fails or stops (a halt, a retry, whose run opens a window of
 * its own, or a stop at the lockstep wait), and the observer is told again. [RN-17]
 *
 * **The callbacks the loop awaits outside a height's processing** are timed alike, each in a window of its own
 * ({@link SlowWindow}): opened when the loop starts them, timed against `slowBlockMs`, closed when they end or fail.
 * These are: [RN-17, Q145 B]
 * - a height's `on-after-db-write` and `on-stop-height` after its commit: one window, from the commit to the end of
 *   `on-stop-height` (after a `COMMIT` that landed though its connection was lost, from the retry's start of them);
 * - each `on-finalized`, named by the height of the head it announces;
 * - the re-delivery at a run's start, named by the cursor's height. [RN-11]
 *
 * One window is open at a time: the loop awaits them in series.
 */

import { BLOCKS_TABLE } from "../backbone/core-block-commit/sql.js";
import type { Database, ReadHandle, Transaction } from "../db/api.js";
import { UmbraError } from "../db/errors.js";
import type { SchemaPlan } from "../db/roles.js";
import { openBlockWrites } from "../db/write-handles.js";
import type {
  BlockContext,
  ModuleDeclaration,
  PointName,
  ProcessContext,
} from "../modules/declaration.js";
import type { HeightRange, ResolvedGraph, ResolvedRange } from "../modules/graph.js";
import { BlockItems, revisionAt } from "./block-context.js";
import type { BlockRef, BlockSource, QueueRunner } from "./block-source.js";
import {
  CallbackFailure,
  type EntryBoundary,
  entryIdOf,
  isBackbonePart,
  type PointArguments,
  type PointSchedule,
  runSchedule,
  scheduleAt,
  startHeightSchedule,
  stopHeightSchedule,
} from "./dispatch.js";
import type { LoopPause } from "./pause.js";
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
  /** Each module's process context: one per module, the same object at every point. [MD-7] */
  readonly contextOf: (id: string) => ProcessContext;
  /**
   * Where the process contexts report a refused `publish`: a callback error of its module even when the module caught
   * it, or when a timer made it (`ProcessContexts`, `./process-context.ts`). [MD-7]
   */
  readonly misuses?: MisuseReports;
  /** Stops the loop: before the next height, or while it waits for the head. */
  readonly signal?: AbortSignal;
  /**
   * The core entry's stop: the last height the loop processes, after whose `on-stop-height` (the core's among them) it
   * ends. With the cursor at or above it, it processes nothing. Absent or null: no stop. [CF-4, RN-10]
   */
  readonly coreStop?: bigint | null;
  /**
   * The upgrade boundary: the first height above the cursor that starts a revision of a version this build does not
   * carry. The loop ends after the height before it. Absent or null: none. [RN-12, Q43]
   */
  readonly boundary?: bigint | null;
  /** Told of the finalized heads the loop reads and the heights it commits (the process's state). */
  readonly observer?: LoopObserver;
  /**
   * The slow-window threshold (the configuration's `slowBlockMs`): a window open longer is slow, whether a height's
   * processing or a callback the loop awaits outside it (see the module comment). Absent or null: none is. [RN-17, CF-4]
   */
  readonly slowBlockMs?: number | null;
  /** The lockstep wait before each block's transaction (see the module comment); none unless given. [PP-6] */
  readonly lockstep?: LockstepWait;
  /** The pause between heights (see the module comment); none unless given. [BK-1, Q152 B] */
  readonly pause?: LoopPause;
}

/** The lockstep wait (`src/private/lockstep.ts`'s `Lockstep`): before `BEGIN` of `height`. [PP-6] */
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
  /** A window became slow, or a slow window closed (see the module comment). [RN-17] */
  slow?(event: SlowBlockEvent): void;
}

/**
 * The windows the loop times for slowness (see the module comment): [RN-17, Q145 B]
 * - `height`: a height's processing, from its first callback after `on-finalized` to its `COMMIT`;
 * - `after-commit`: its `on-after-db-write` and `on-stop-height` after the `COMMIT`;
 * - `finalized`: one `on-finalized`;
 * - `redelivery`: the re-delivery of the cursor's callbacks at a run's start. [RN-11]
 */
export type SlowWindow = "height" | "after-commit" | "finalized" | "redelivery";

/**
 * What the loop does in an open window: which window, its height (for `finalized` the head announced), the point it is
 * in, the first module running there, and since when. [RN-17]
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
 * they started (at a point in waves, the point's order). [RN-17]
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

/** An open slow-height window (see the module comment): a height's processing, or callbacks awaited outside it. [RN-17] */
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

/** How the loop ended. [RN-10, RN-12, RN-13] */
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
   * nothing. [RN-11]
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
 * loop's next run processes it again with. [IN-10, IN-11]
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
   * have committed or not. False when the transaction failed before, and certainly did not commit. [IN-11]
   */
  readonly uncertain: boolean;
}

/**
 * What the cursor read after a held height's failure says ({@link FinalizedLoop.commitOutcome}): the height
 * `committed`, `not-committed` (the cursor is the one before it), or `unexpected` (anything else: `unexpected-cursor`).
 * [IN-11]
 */
export type CommitOutcome = "committed" | "not-committed" | "unexpected";

/** Opens a read for one callback, and runs `body` inside it. */
export type ReadOpener = <T>(body: (read: ReadHandle) => Promise<T>) => Promise<T>;

/**
 * The halt `unexpected-cursor`. It is raised when the loop's check before the `COMMIT`, that the block transaction left
 * the cursor at the height with the block's hash, failed; or when the cursor read after a held height's failure was
 * neither the height nor the one before it. [IN-11; design §11]
 */
export class UnexpectedCursor extends Error {
  constructor(message: string) {
    super(message);
    this.name = "UnexpectedCursor";
  }
}

/** Why the loop stopped: the height, and the point and module when a callback failed. [RN-8] */
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

/** `invoke`, each callback recorded as running in `activity` when there is one. [RN-17] */
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

/** Whether the process retries `failure`: a retryable `UmbraError`, itself or a callback's. [IN-10] */
function isRetryable(failure: HeightFailure): boolean {
  const cause = failure.cause instanceof CallbackFailure ? failure.cause.cause : failure.cause;
  return cause instanceof UmbraError && cause.retryable;
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
  /** The runs whose block transaction's body ended: a failure after that is the `COMMIT`'s. [IN-11] */
  readonly #bodiesEnded = new WeakSet<HeightRun>();
  /** The height the last run held for the next (see the module comment). */
  #held: HeldHeight | undefined;
  /** The held height this run processes again, once it reaches it. */
  #resume: HeldHeight | undefined;
  /**
   * The window open: the height the loop is on, from the start of its processing to its commit or its failure, or the
   * callbacks it awaits outside a height's processing while they run. [RN-17]
   */
  #watch: Watch | undefined;
  /** What the source's queue runs for each height it prepares (`on-fetch`, `on-parse`), while it does. */
  readonly #preparing = new Map<bigint, Activity>();
  /** The open block transaction ({@link blockTransaction}), settling when it has committed or rolled back. */
  #transaction: Promise<void> | undefined;

  constructor(input: LoopInput) {
    this.input = input;
    this.#signal = input.signal ?? new AbortController().signal;
  }

  /**
   * The open window once it has been open longer than `slowBlockMs` (see the module comment): which, its height, the
   * point it is in and the first module running there now, and its time. Null otherwise: none open, none slow yet, or no
   * `slowBlockMs`. [RN-17]
   */
  slowBlock(): HeightActivity | null {
    const watch = this.#watch;
    return watch === undefined || !watch.raised ? null : this.#activityOf(watch);
  }

  /**
   * The height's block transaction while it is open, from its request (its `BEGIN` waits for the writer) until it has
   * committed or rolled back: a promise that settles then and never rejects. Null while none is open. The process's
   * stop closes the node client at once when none is open, else once it settles (`./process.ts`). [RN-6, RN-13]
   */
  blockTransaction(): Promise<void> | null {
    return this.#transaction ?? null;
  }

  /**
   * The slow-window threshold for a window of the kind `_window`: the input's `slowBlockMs`, null for none (a negative
   * control's seam). [RN-17]
   */
  protected slowBlockMs(_window: SlowWindow): number | null {
    return this.input.slowBlockMs ?? null;
  }

  /**
   * Re-delivers the cursor's callbacks or, after a run that held a height, settles that height first (see the module
   * comment). Then processes every finalized height above it, waiting for the head to rise, up to its last height
   * ({@link lastHeight}), and resolves with how it ended, or with `signal` when its signal stopped it. Rejects with a
   * {@link HeightFailure} when processing fails. [RN-11]
   */
  async run(): Promise<LoopEnd> {
    const unwatch = this.input.misuses?.watch((error, module) => this.#misused({ error, module, point: this.#point }));
    try {
      return await this.#run();
    } finally {
      unwatch?.();
    }
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
    this.#resume = undefined;
    let cursor: BlockRef | null;
    if (held === undefined) {
      cursor = await db.read((read) => source.cursor(read));
      const at = cursor;
      if (at !== null) await this.#timed("redelivery", at.height, "on-after-db-write", () => this.redeliver(at));
    } else {
      cursor = await this.#settle(held);
    }
    const last = this.lastHeight();
    if (cursor !== null && last !== null && cursor.height >= last) return this.#stopped(cursor.height);
    for (;;) {
      if (this.#signal.aborted) return SIGNALLED;
      // Between heights a pause holds the loop here, before it reads the head. [BK-1, Q152 B]
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
        // A held height not reached yet stays held for the next run, its items kept. [IN-10]
        if (this.#resume !== undefined && isRetryable(failure)) this.#held = this.#resume;
        throw failure;
      }
      for (let height = next; height <= head.height; height++) {
        if (this.#signal.aborted) return SIGNALLED;
        // Between heights: before this one, after on-finalized or the height before's points.
        await this.pauseBetween();
        if (this.#signal.aborted) return SIGNALLED;
        const done = await this.#process(height, cursor);
        // Stopped at the lockstep wait: the height's transaction never began.
        if (done === null) return SIGNALLED;
        cursor = done;
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
   * loop with the height committed. [RN-11]
   */
  protected async redeliver(cursor: BlockRef): Promise<void> {
    const { height } = cursor;
    try {
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
   * [BK-1, Q152 B]
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
   * in the range's order. Each callback gets its entry and its own read at h − 1. [RN-9]
   */
  protected async startHeight(run: HeightRun): Promise<void> {
    const schedule = startHeightSchedule(run.range, this.startingAt(run));
    await this.#schedule(schedule, (part, call) => this.#entry(run, part, call));
  }

  /**
   * `on-stop-height`: the entries stopping at the height ({@link stoppingAt}), in {@link stopSchedule}'s order, each
   * callback with its entry and its own read at h. [RN-10]
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
   * modules a segment of which ends there. [RN-10]
   */
  protected stoppingAt(run: HeightRun): EntryBoundary {
    const { coreStop = null } = this.input;
    const modules = this.#modules(run, (segment) => segment.to === run.height);
    return { core: coreStop !== null && run.height >= coreStop, modules };
  }

  /** `on-stop-height`'s order: the stopping modules in reverse order, then the core's parts. [RN-10] */
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
        const context = this.#context(run, part, run.items.visible());
        return open((read) => run.items.collect(part, "on-fetch", (sink) => call(context, sink, read)), run.height);
      });
      return;
    }
    await this.#dispatch(run.range, point, (part, call) => {
      const context = this.#context(run, part, run.items.visible());
      return run.items.collect(part, point, (sink) => call(context, sink));
    });
  }

  /** `on-compute`: each callback with its block context, a read `open` opens for it, and an item sink. */
  protected async compute(run: HeightRun, open: ReadOpener): Promise<void> {
    await this.#dispatch(run.range, "on-compute", (part, call) => {
      const context = this.#context(run, part, run.items.visible());
      return open((read) => run.items.collect(part, "on-compute", (sink) => call(context, read, sink)));
    });
  }

  /**
   * The block transaction: one `BEGIN … COMMIT` holding the height's {@link write}. Once its body ended, a failure is
   * the `COMMIT`'s, which may have committed. [IN-11]
   */
  protected async commit(run: HeightRun): Promise<void> {
    await this.input.db.transaction(async (tx) => {
      await this.write(tx, run);
      this.#bodiesEnded.add(run);
    });
  }

  /**
   * Inside the block transaction `tx`: every `on-db-write` callback with its block write handle, in order; then, before
   * the `COMMIT`, a misuse during the block fails it, and the block source's cursor, read in `tx`, must be the height
   * with the block's hash.
   */
  protected async write(tx: Transaction, run: HeightRun): Promise<void> {
    const writes = openBlockWrites(tx, this.input.plan, {
      height: run.previous?.height ?? null,
      onClosedUse: (error) => this.#closedUse(error),
    });
    await this.#dispatch(run.range, "on-db-write", (part, call) => {
      const context = this.#context(run, part, run.items.visible());
      return writes.write(part.id, (w) => call(context, w));
    });
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
  }

  /**
   * The points after the `COMMIT`: `on-after-db-write`, each callback with a read at h and no `block` items
   * ({@link afterWriteItems}), then `on-stop-height` ({@link stopHeight}).
   */
  protected async after(run: HeightRun): Promise<void> {
    await this.#dispatch(run.range, "on-after-db-write", (part, call) => {
      const context = this.#context(run, part, this.afterWriteItems(run));
      return this.input.db.read((read) => call(context, read));
    });
    await this.stopHeight(run);
  }

  /**
   * The `block` items of an `on-after-db-write` callback's context at the height of `run`: none, a map of its own, so
   * the same context can be rebuilt after a restart. A negative control's seam. [RN-5, RN-11]
   */
  protected afterWriteItems(_run: HeightRun): ReadonlyMap<string, unknown> {
    return new Map();
  }

  /** The height kept for the next run when a retryable failure stopped `held`'s (see the module comment): a seam. */
  protected held(held: HeldHeight): HeldHeight | undefined {
    return held;
  }

  /**
   * What `cursor`, read after `held`'s failure, says: [IN-11]
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
  async #process(height: bigint, previous: BlockRef | null): Promise<BlockRef | null> {
    let committed = false;
    const resume = this.#resume?.run.height === height ? this.#resume : undefined;
    this.#resume = undefined;
    let run: HeightRun | undefined;
    const watch = this.#watchHeight(height);
    try {
      run = resume === undefined ? await this.#begin(height, previous) : this.#again(resume);
      await this.prepare(run);
      if (!(await this.lockstepWait(run))) {
        // Stopped at the lockstep wait: the height's run, and its window, end here.
        this.#unwatch(watch, false);
        return null;
      }
      // For slow-height reports the block transaction is on-db-write's: its BEGIN, its callbacks, the cursor check, the
      // COMMIT. [RN-17]
      this.#enter("on-db-write");
      await this.#transacting(this.commit(run));
      committed = true;
      this.input.observer?.committed?.(run.block);
      this.#unwatch(watch, true);
      await this.#afterCommit(run);
      this.#check();
      return run.block;
    } catch (error) {
      if (!committed) this.#unwatch(watch, false);
      const failure = this.#failure(height, error, committed);
      if (!committed && run !== undefined) this.#hold(run, failure);
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

  /** A new run of `height` above `previous`: its block from the source, prepared by it when it prepares heights. */
  async #begin(height: bigint, previous: BlockRef | null): Promise<HeightRun> {
    const { source } = this.input;
    const prepared = source.prepared === undefined ? undefined : await source.prepared(height);
    const block = prepared?.block ?? (await source.block(height));
    const items = prepared?.items ?? this.itemsAt(height);
    return { height, block, range: this.#rangeAt(height), items, previous, prepared: prepared !== undefined };
  }

  /** `held`'s run again: its items as `on-parse` left them, from the point it resumes at. */
  #again(held: HeldHeight): HeightRun {
    held.run.items.restore(held.items);
    return { ...held.run, from: held.from };
  }

  /**
   * The loop is on `height` (see the module comment): its window opens at once when the source's queue runs its
   * `on-fetch` or `on-parse` now, else with the first callback of it that starts. [RN-17]
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
   * open from now in `point`, closed when `body` ends or fails. [RN-17, Q145 B]
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
    observer?.committed?.(run.block);
    try {
      await this.#afterCommit(run);
      this.#check();
    } catch (error) {
      throw this.#failure(run.height, error, true);
    }
    return run.block;
  }

  /**
   * `on-finalized` for `head`, before its heights from `next` on: each callback with a read at the cursor, in a window
   * of its own, named by the head's height. [RN-17, Q145 B]
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
          const context = this.#context(run, part, run.items.visible());
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
      storedHash: (height: bigint) =>
        db.read(async (read) => {
          const [row] = await read.query(`SELECT hash FROM ${BLOCKS_TABLE} WHERE height = $1`, [height]);
          return row === undefined ? null : (row.hash as Uint8Array);
        }),
    });
  }

  /** Runs `point` in `range`, each callback through `invoke`, after checking no misuse is pending. */
  async #dispatch<P extends PointName>(range: ResolvedRange, point: P, invoke: Invoke<P>): Promise<void> {
    await this.#schedule(scheduleAt(range, point), invoke);
  }

  /**
   * Runs `schedule`, each callback through `invoke`, after checking no misuse is pending; for the height in progress,
   * recording the point and its running callbacks. [RN-17]
   */
  async #schedule<P extends PointName>(schedule: PointSchedule<P>, invoke: Invoke<P>): Promise<void> {
    this.#check();
    this.#point = schedule.point;
    const activity = this.#enter(schedule.point);
    try {
      await runSchedule(schedule, { contextOf: this.input.contextOf, invoke: tracked(activity, invoke) });
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

  /** The block context of `part`'s callback at the height of `run`, with `items`. */
  #context(run: HeightRun, part: ModuleDeclaration, items: ReadonlyMap<string, unknown>): BlockContext {
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
    });
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

  /** A write handle used after its callback ended: its error names the module and the point. [DB-3] */
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
    if (error instanceof CallbackFailure) {
      return new HeightFailure(height, error, { point: error.point, module: error.module, committed });
    }
    return new HeightFailure(height, error, { committed });
  }
}

/** Runs the finalized loop over `input` (see {@link FinalizedLoop.run}). */
export function runFinalized(input: LoopInput): Promise<LoopEnd> {
  return new FinalizedLoop(input).run();
}
