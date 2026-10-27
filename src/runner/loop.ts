/**
 * The finalized loop (`openspec/changes/core-arch/specs/runner/spec.md` RN-1, RN-4, RN-5, RN-6, RN-14; `design.md` §2,
 * §3; CORE-ARCH §4.2, §4.5): the runner's processing of finalized heights, from the cursor + 1 (S on a new database) up
 * to the block source's finalized head, in order and without skipping one, then waiting for the head to rise.
 *
 * **Per new head** the loop calls `on-finalized` once, before the head's heights, each callback with its own read handle
 * at the cursor. **Per height h**, through the point dispatch (`./dispatch.ts`) in the order of the range of the
 * resolved graph holding h:
 * 1. `on-fetch` and `on-parse` — the block context and an item sink, no database handle; on a private process each
 *    `on-fetch` callback also gets its own read of public data (the block source's `fetchRead`, PP-3, Q100);
 * 2. `on-compute` — the block context, a read handle at h − 1 and an item sink; each callback runs inside its own read
 *    (`Database.read`), so on PGlite a `db.read` from inside it fails with `nested-call` rather than waiting (DB-4, Q73),
 *    and a callback's failing statement aborts no other callback's read;
 * 3. the block transaction (RN-6): one `BEGIN … COMMIT` holding every `on-db-write` callback of h, each with its block
 *    write handle (`src/db/write-handles.ts`), in RN-3's order — `core-block-commit` first, which writes the cursor row
 *    (CD-3), or on a private process `core-private-source` — and, before the `COMMIT`, a check that the block source's
 *    cursor is h with the block's hash; nothing else of the loop writes (RN-2);
 * 4. `on-after-db-write` — the block context without `block` items and a read handle at h, each callback in its own read.
 * Between `on-parse` and `on-compute`, `on-start-height` for the entries starting at h (RN-9): the core's parts when h is
 * S, then the modules one of whose segments of the graph (`ResolvedGraph.segments`) starts at h — revisions continuing
 * each other are one segment (CF-5), so a revision boundary starts nothing (A42) —, each callback with a read at h − 1;
 * after `on-after-db-write`, `on-stop-height` for the entries stopping at h (RN-10): the modules one of whose segments
 * ends at h, in reverse order, then the core's parts when h is the core's stop, each with a read at h. The lockstep wait
 * (before `BEGIN`) is task 14.x's.
 *
 * **At a restart** (RN-11), with the cursor c, the loop first runs `on-after-db-write` for c and `on-stop-height` for
 * the entries stopping at c — the core's when c is at or above its stop — in the order of the range holding c, with the
 * block context of c and no `block` items, before c + 1: a crash may have come before they completed. Both points run in
 * series, so the range ending at the cursor, which startup checks for a cycle only, gives them their order.
 *
 * **Where it ends** (RN-10, RN-12): after the core's stop ({@link LoopInput.coreStop}) — with the cursor already at or
 * above it, it processes nothing — and after the height before an upgrade boundary ({@link LoopInput.boundary}), the
 * first height of a revision whose version this build does not carry: it commits that height, completes its
 * `on-after-db-write` and `on-stop-height`, and resolves with a {@link LoopEnd} saying which. Its signal stops it before
 * the next height, or while it waits (RN-13: the height in progress finishes).
 *
 * **The block context** of each callback (RN-5) holds the block's height, hash and parent hash, the `block` items
 * published before the callback started (`./block-context.ts`: a callback's puts are published when it completes), the
 * calling module's settings for the revision covering h, and whether a module's entry is active at h; at
 * `on-after-db-write` it holds no items. **Nothing is open while the loop waits** for the head (RN-6, RN-14): every read
 * and the block transaction have ended.
 *
 * **Failures** stop the loop: {@link FinalizedLoop.run} rejects with a {@link HeightFailure} naming the height, whether
 * it committed, and — for a callback's failure — the point and the module (the dispatch's `CallbackFailure`, the
 * error itself its cause). A use of a closed write handle (DB-3), or a put from a kept item sink, is a callback error
 * even when no callback rejects with it (a timer, a module that catches it): the loop keeps the first, names its module
 * and point, and fails the height in progress before its `COMMIT`, or stops once the height's last point ended, or before
 * the next height. So is a `publish` the process contexts refuse (MD-7, `./process-context.ts`), which they report to
 * the loop ({@link LoopInput.misuses}): named by its module and the point the loop was dispatching, none while it waits.
 * The halt — the state `halted` with its reason, the process staying up — and the retries of a lost connection or an
 * unreachable node, which run the loop again, are the process's (`./process.ts`, `./failures.ts`; RN-8, IN-10).
 *
 * **A height held for a retry** (IN-10, IN-11; task 10.4). When a retryable failure (`UmbraError.retryable`:
 * `connection-lost`, `node-unreachable`, directly or as a callback's) stops h after its `on-parse` and before it
 * committed, the loop keeps h ({@link HeldHeight}: its block, its range, the cursor before it, its `block` items as
 * `on-fetch` and `on-parse` left them, the point it resumes at, and whether the failure came from the `COMMIT`), and
 * its next run — the process runs the same loop again after IN-10's back-off — starts with it instead of the cursor's
 * re-delivery:
 * 1. it reads the cursor inside a transaction, on the writer: after a lost connection that is a new session, which
 *    takes the writer lock again before anything else (DB-11, `writer-lock-lost` when another process took it), so
 *    nothing can move the cursor after it is read; a failure of that read keeps h held for the run after;
 * 2. {@link FinalizedLoop.commitOutcome} reads it (IN-11): h with the block's hash after a failed `COMMIT` — h
 *    committed: the loop tells its observer, runs h's `on-after-db-write` and `on-stop-height`, and goes on from h + 1;
 *    the cursor before h — h did not commit: h is processed again from `on-compute` with its kept items (those its
 *    earlier `on-compute` published are dropped), or from `on-start-height` when the failure came before `on-compute`
 *    began; anything else halts with `unexpected-cursor` at h ({@link UnexpectedCursor}).
 * Nothing is fetched or parsed again, and the cursor's `on-after-db-write`, which ran before h began, is not
 * re-delivered; a retryable failure on the way to h (the head's read, its `on-finalized`) keeps h held for the run
 * after. A failure before `on-parse` ended holds nothing: the next run starts from the cursor, which it re-delivers
 * (RN-11), and fetches h again.
 *
 * **A source that fetches ahead** (`core-block-fetch`'s node source, task 10.3; IN-4 to IN-6) is given, for each run,
 * the runner's dispatch interface for its queue ({@link QueueRunner}: `on-fetch` and `on-parse` of a block it fetched
 * ahead, `on-best-block`, `on-rollback`, and the hash stored at a height), taken back when the run ends; and the loop
 * takes each height from it prepared (`BlockSource.prepared`) — `on-fetch` and `on-parse` already run, their items in
 * the height's — and goes on to `on-start-height` and `on-compute` with them. The queue's callbacks run outside the
 * loop's points, each with its block context as the loop builds it.
 *
 * **A slow height** (RN-17, Q71; task 5.5) is reported, never cut off: nothing here cancels, times out or retries a
 * height for its time. Each run of a height has a window, from its first callback after `on-finalized` to its `COMMIT`
 * — from its `on-fetch`; for a height the source prepares ahead, from when the loop asks for it if its `on-fetch` or
 * `on-parse` runs in the queue by then, else from when one starts there (the queue's earlier work for it, beside the
 * heights before it, is not its time, nor is the fetch from the node before its first callback); for a held height
 * processed again, from where it resumes (a back-off is never in a window) — and while it is open the loop knows the
 * point the height is in (the last of its points that began; from the block transaction's request on, `on-db-write`:
 * its `BEGIN`, its callbacks, the cursor check, the `COMMIT`) and the modules whose callbacks run. Once a window has
 * been open longer than {@link LoopInput.slowBlockMs} (a timer of the main thread, so not while a callback blocks it),
 * {@link FinalizedLoop.slowBlock} gives the height, its point and the first module running in the point's order, and
 * the observer is told ({@link LoopObserver.slow}); the window closes when the height commits, or when its run fails
 * — a halt, or a retry, whose run opens a window of its own —, and the observer is told again.
 */

import { BLOCKS_TABLE } from "../backbone/core-block-commit/core-block-commit.js";
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
  /** Each module's process context: one per module, the same object at every point (MD-7). */
  readonly contextOf: (id: string) => ProcessContext;
  /**
   * Where the process contexts report a refused `publish` (MD-7): a callback error of its module even when the module
   * caught it, or when a timer made it (`ProcessContexts`, `./process-context.ts`).
   */
  readonly misuses?: MisuseReports;
  /** Stops the loop: before the next height, or while it waits for the head. */
  readonly signal?: AbortSignal;
  /**
   * The core entry's stop (CF-4, RN-10): the last height the loop processes, after whose `on-stop-height` — the core's
   * among them — it ends; with the cursor at or above it, it processes nothing. Absent or null: no stop.
   */
  readonly coreStop?: bigint | null;
  /**
   * The upgrade boundary (RN-12, decision record Q43): the first height above the cursor that starts a revision of a
   * version this build does not carry; the loop ends after the height before it. Absent or null: none.
   */
  readonly boundary?: bigint | null;
  /** Told of the finalized heads the loop reads and the heights it commits (the process's state). */
  readonly observer?: LoopObserver;
  /**
   * RN-17's threshold (CF-4's `slowBlockMs`): a height whose window has been open longer is slow (see the module
   * comment). Absent or null: none is.
   */
  readonly slowBlockMs?: number | null;
}

/** What the loop tells as it runs (the process's state, `./process.ts`): none may throw. */
export interface LoopObserver {
  /** The source's finalized head, each time the loop reads it. */
  head?(head: BlockRef): void;
  /** A height that committed: its block, the new cursor. */
  committed?(block: BlockRef): void;
  /** A height became slow, or the window of a slow height closed (RN-17; see the module comment). */
  slow?(event: SlowBlockEvent): void;
}

/** What a height in progress does (RN-17): the point it is in, the first module running there, and since when. */
export interface HeightActivity {
  readonly height: bigint;
  readonly point: PointName;
  /** The first module whose callback runs, in the point's order; null while none runs. */
  readonly module: string | null;
  /** How long its window has been open, in milliseconds. */
  readonly sinceMs: number;
}

/** What {@link LoopObserver.slow} is told. */
export type SlowBlockEvent =
  /** The height's window has been open longer than `slowBlockMs`: what it does now. */
  | { readonly kind: "raised"; readonly activity: HeightActivity }
  /** The slow height's window closed: it committed, or its run failed; `ms` its time. */
  | { readonly kind: "ended"; readonly height: bigint; readonly committed: boolean; readonly ms: number };

/**
 * Where a height's processing is (RN-17): the last of its points that began, and the modules whose callbacks run, in
 * the order they started — at a point in waves, the point's order.
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

/** The height the loop is on (RN-17's window; see the module comment). */
interface Watch {
  readonly height: bigint;
  /** When its window opened (`performance.now()`); null while none of its callbacks has started. */
  began: number | null;
  activity: Activity | undefined;
  timer: ReturnType<typeof setTimeout> | undefined;
  /** Whether it was found slow (the observer told). */
  raised: boolean;
}

/** How the loop ended (RN-10, RN-12, RN-13). */
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
  /** The cursor before the height: null before the first block, and at a re-delivery (RN-11), which writes nothing. */
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
 * A height a retryable failure stopped before it committed, after its `on-parse` (IN-10, IN-11; see the module
 * comment): what the loop's next run processes it again with.
 */
export interface HeldHeight {
  /** The height's run: its block, its range, the cursor before it, its items. */
  readonly run: HeightRun;
  /** Its `block` items as `on-fetch` and `on-parse` left them: the items it is processed again with. */
  readonly items: ReadonlyMap<string, unknown>;
  /** The point it resumes at. */
  readonly from: ResumePoint;
  /**
   * True when the failure came after the block transaction's body ended — from its `COMMIT`, which the server may have
   * committed or not (IN-11) —; false when the transaction failed before, and certainly did not commit.
   */
  readonly uncertain: boolean;
}

/**
 * What the cursor read after a held height's failure says (IN-11, {@link FinalizedLoop.commitOutcome}): the height
 * `committed`, `not-committed` (the cursor is the one before it), or `unexpected` (anything else: `unexpected-cursor`).
 */
export type CommitOutcome = "committed" | "not-committed" | "unexpected";

/** Opens a read for one callback, and runs `body` inside it. */
export type ReadOpener = <T>(body: (read: ReadHandle) => Promise<T>) => Promise<T>;

/**
 * The loop's check before the `COMMIT` that the block transaction left the cursor at the height with the block's hash
 * failed, or the cursor read after a held height's failure was neither the height nor the one before it (IN-11): the
 * halt `unexpected-cursor` (`design.md` §11).
 */
export class UnexpectedCursor extends Error {
  constructor(message: string) {
    super(message);
    this.name = "UnexpectedCursor";
  }
}

/** Why the loop stopped: the height, and the point and module when a callback failed (RN-8). */
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

/** `invoke`, each callback recorded as running in `activity` when there is one (RN-17). */
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

/** Whether the process retries `failure` (IN-10): a retryable `UmbraError`, itself or a callback's. */
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
  /** The runs whose block transaction's body ended: a failure after that is the `COMMIT`'s (IN-11). */
  readonly #bodiesEnded = new WeakSet<HeightRun>();
  /** The height the last run held for the next (see the module comment). */
  #held: HeldHeight | undefined;
  /** The held height this run processes again, once it reaches it. */
  #resume: HeldHeight | undefined;
  /** The height the loop is on (RN-17), from the start of its processing to its commit or its failure. */
  #watch: Watch | undefined;
  /** What the source's queue runs for each height it prepares (`on-fetch`, `on-parse`), while it does. */
  readonly #preparing = new Map<bigint, Activity>();

  constructor(input: LoopInput) {
    this.input = input;
    this.#signal = input.signal ?? new AbortController().signal;
  }

  /**
   * The height in progress once its window has been open longer than `slowBlockMs` (RN-17; see the module comment):
   * the point it is in and the first module running there now, and its time; null otherwise — no height in progress,
   * none slow yet, or no `slowBlockMs`.
   */
  slowBlock(): HeightActivity | null {
    const watch = this.#watch;
    return watch === undefined || !watch.raised ? null : this.#activityOf(watch);
  }

  /** RN-17's threshold: the input's `slowBlockMs`, null for none (a negative control's seam). */
  protected slowBlockMs(): number | null {
    return this.input.slowBlockMs ?? null;
  }

  /**
   * Re-delivers at the cursor (RN-11) — or, after a run that held a height, settles it first (see the module
   * comment) —, then processes every finalized height above it, waiting for the head to rise, up to its last height
   * ({@link lastHeight}) — then resolves with how it ended, or with `signal` when its signal stopped it; rejects with a
   * {@link HeightFailure} when processing fails.
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
      if (cursor !== null) await this.redeliver(cursor);
    } else {
      cursor = await this.#settle(held);
    }
    const last = this.lastHeight();
    if (cursor !== null && last !== null && cursor.height >= last) return this.#stopped(cursor.height);
    for (;;) {
      if (this.#signal.aborted) return SIGNALLED;
      const next = cursor === null ? graph.start : cursor.height + 1n;
      let head: BlockRef;
      try {
        head = await source.finalizedHead();
        observer?.head?.(head);
        if (head.height < next) {
          await this.wait(next - 1n);
          continue;
        }
        await this.#finalized(head, next);
      } catch (error) {
        const failure = this.#failure(next, error, false);
        // A held height not reached yet stays held for the next run, its items kept (IN-10).
        if (this.#resume !== undefined && isRetryable(failure)) this.#held = this.#resume;
        throw failure;
      }
      for (let height = next; height <= head.height; height++) {
        if (this.#signal.aborted) return SIGNALLED;
        cursor = await this.#process(height, cursor);
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
   * RN-11's re-delivery at the cursor `cursor`, before its next height: `on-after-db-write` and `on-stop-height` of its
   * height ({@link after}), with its block context and no `block` items; a failure stops the loop with the height
   * committed.
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

  /** Waits for the source's head to exceed `above`, or for the signal to stop the loop (checked by the caller). */
  protected async wait(above: bigint): Promise<void> {
    try {
      await this.input.source.waitForHead(above, this.#signal);
    } catch (error) {
      if (!this.#signal.aborted) throw error;
    }
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
   * `on-start-height` (RN-9): the entries starting at the height ({@link startingAt}) — the core's parts first, then the
   * modules in the range's order —, each callback with its entry and its own read at h − 1.
   */
  protected async startHeight(run: HeightRun): Promise<void> {
    const schedule = startHeightSchedule(run.range, this.startingAt(run));
    await this.#schedule(schedule, (part, call) => this.#entry(run, part, call));
  }

  /**
   * `on-stop-height` (RN-10): the entries stopping at the height ({@link stoppingAt}), in {@link stopSchedule}'s order,
   * each callback with its entry and its own read at h.
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
   * The entries stopping at the height of `run`: the core's at and above its stop (above it only at a restart, RN-10),
   * and the modules a segment of which ends there.
   */
  protected stoppingAt(run: HeightRun): EntryBoundary {
    const { coreStop = null } = this.input;
    const modules = this.#modules(run, (segment) => segment.to === run.height);
    return { core: coreStop !== null && run.height >= coreStop, modules };
  }

  /** `on-stop-height`'s order (RN-10): the stopping modules in reverse order, then the core's parts. */
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
        return open((read) => run.items.collect(part, "on-fetch", (sink) => call(context, sink, read)));
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
   * The block transaction: one `BEGIN … COMMIT` holding the height's {@link write}; once its body ended, a failure is
   * the `COMMIT`'s, which may have committed (IN-11).
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
          `the block's hash: core-block-commit writes the block's row of ${BLOCKS_TABLE} first in every block (CD-3), ` +
          "and core-private-source the private cursor on a private process (PP-3)",
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
   * The `block` items of an `on-after-db-write` callback's context at the height of `run`: none, a map of its own (RN-5),
   * so the same context can be rebuilt after a restart (RN-11); a negative control's seam.
   */
  protected afterWriteItems(_run: HeightRun): ReadonlyMap<string, unknown> {
    return new Map();
  }

  /** The height kept for the next run when a retryable failure stopped `held`'s (see the module comment): a seam. */
  protected held(held: HeldHeight): HeldHeight | undefined {
    return held;
  }

  /**
   * What `cursor`, read after `held`'s failure, says (IN-11): after a failed `COMMIT` (`uncertain`), the height with
   * the block's hash committed; the cursor before the height — none before S — did not; anything else is unexpected, as
   * is the height itself after a transaction that failed before its `COMMIT`.
   */
  protected commitOutcome(held: HeldHeight, cursor: BlockRef | null): CommitOutcome {
    const { block, previous } = held.run;
    if (held.uncertain && isBlock(cursor, block)) return "committed";
    return isBlock(cursor, previous) ? "not-committed" : "unexpected";
  }

  /**
   * Processes `height` above the cursor `previous` — a held height again from where it resumes —; resolves with the new
   * cursor.
   */
  async #process(height: bigint, previous: BlockRef | null): Promise<BlockRef> {
    let committed = false;
    const resume = this.#resume?.run.height === height ? this.#resume : undefined;
    this.#resume = undefined;
    let run: HeightRun | undefined;
    const watch = this.#watchHeight(height);
    try {
      run = resume === undefined ? await this.#begin(height, previous) : this.#again(resume);
      await this.prepare(run);
      // The block transaction is on-db-write's (RN-17): its BEGIN, its callbacks, the cursor check, the COMMIT.
      this.#enter("on-db-write");
      await this.commit(run);
      committed = true;
      this.input.observer?.committed?.(run.block);
      this.#unwatch(watch, true);
      await this.after(run);
      this.#check();
      return run.block;
    } catch (error) {
      if (!committed) this.#unwatch(watch, false);
      const failure = this.#failure(height, error, committed);
      if (!committed && run !== undefined) this.#hold(run, failure);
      throw failure;
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
   * The loop is on `height` (RN-17; see the module comment): its window opens at once when the source's queue runs its
   * `on-fetch` or `on-parse` now, else with the first callback of it that starts.
   */
  #watchHeight(height: bigint): Watch {
    const watch: Watch = { height, began: null, activity: undefined, timer: undefined, raised: false };
    this.#watch = watch;
    const queued = this.#preparing.get(height);
    if (queued !== undefined) this.#open(watch, queued);
    return watch;
  }

  /** Opens `watch`'s window, recorded in `activity`, and starts the timer of `slowBlockMs` when there is one. */
  #open(watch: Watch, activity: Activity): void {
    watch.began = performance.now();
    watch.activity = activity;
    const ms = this.slowBlockMs();
    if (ms !== null) watch.timer = setTimeout(() => this.#raise(watch), ms);
  }

  /** `watch`'s window has been open longer than `slowBlockMs`: the height is slow, and the observer is told. */
  #raise(watch: Watch): void {
    watch.raised = true;
    this.input.observer?.slow?.({ kind: "raised", activity: this.#activityOf(watch) });
  }

  /**
   * `point` of the height in progress began, if a height is in progress: its window opens if it was not yet; returns
   * what records its callbacks.
   */
  #enter(point: PointName): Activity | undefined {
    const watch = this.#watch;
    if (watch === undefined) return undefined;
    if (watch.activity === undefined) this.#open(watch, new Activity(point));
    else watch.activity.point = point;
    return watch.activity;
  }

  /** Closes `watch`'s window — its height committed, or its run failed —; the observer is told when it was slow. */
  #unwatch(watch: Watch, committed: boolean): void {
    this.#watch = undefined;
    clearTimeout(watch.timer);
    if (!watch.raised) return;
    const ms = performance.now() - (watch.began as number);
    this.input.observer?.slow?.({ kind: "ended", height: watch.height, committed, ms });
  }

  /** What the height of an open window `watch` does now. */
  #activityOf(watch: Watch): HeightActivity {
    const activity = watch.activity as Activity;
    const sinceMs = performance.now() - (watch.began as number);
    return Object.freeze({ height: watch.height, point: activity.point, module: activity.module, sinceMs });
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
            "while the connection was lost (IN-10, IN-11)",
        ),
        false,
      );
    }
    observer?.committed?.(run.block);
    try {
      await this.after(run);
      this.#check();
    } catch (error) {
      throw this.#failure(run.height, error, true);
    }
    return run.block;
  }

  /** `on-finalized` for `head`, before its heights from `next` on: each callback with a read at the cursor. */
  async #finalized(head: BlockRef, next: bigint): Promise<void> {
    const announced = Object.freeze({ height: head.height, hash: head.hash });
    await this.#dispatch(this.#rangeAt(next), "on-finalized", (_part, call) =>
      this.input.db.read((read) => call(announced, read)),
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
   * recording the point and its running callbacks (RN-17).
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

  /** A write handle used after its callback ended (DB-3): its error names the module and the point. */
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
