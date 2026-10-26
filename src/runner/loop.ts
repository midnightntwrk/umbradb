/**
 * The finalized loop (`openspec/changes/core-arch/specs/runner/spec.md` RN-1, RN-4, RN-5, RN-6, RN-14; `design.md` §2,
 * §3; CORE-ARCH §4.2, §4.5): the runner's processing of finalized heights, from the cursor + 1 (S on a new database) up
 * to the block source's finalized head, in order and without skipping one, then waiting for the head to rise.
 *
 * **Per new head** the loop calls `on-finalized` once, before the head's heights, each callback with its own read handle
 * at the cursor. **Per height h**, through the point dispatch (`./dispatch.ts`) in the order of the range of the
 * resolved graph holding h:
 * 1. `on-fetch` and `on-parse` — the block context and an item sink, no database handle;
 * 2. `on-compute` — the block context, a read handle at h − 1 and an item sink; each callback runs inside its own read
 *    (`Database.read`), so on PGlite a `db.read` from inside it fails with `nested-call` rather than waiting (DB-4, Q73),
 *    and a callback's failing statement aborts no other callback's read;
 * 3. the block transaction (RN-6): one `BEGIN … COMMIT` holding every `on-db-write` callback of h, each with its block
 *    write handle (`src/db/write-handles.ts`), in RN-3's order — `core-block-commit` first, which writes the cursor row
 *    (CD-3) — and, before the `COMMIT`, a check that the cursor is h with the block's hash; nothing else of the loop
 *    writes (RN-2);
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
 * unreachable node, which run the loop again from the cursor, are the process's (`./process.ts`, `./failures.ts`; RN-8,
 * IN-10).
 */

import { CURSOR_TABLE, readCursor } from "../backbone/core-block-commit/core-block-commit.js";
import type { Database, ReadHandle, Transaction } from "../db/api.js";
import type { UmbraError } from "../db/errors.js";
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
import type { BlockRef, BlockSource } from "./block-source.js";
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
}

/** What the loop tells as it runs (the process's state, `./process.ts`): neither may throw. */
export interface LoopObserver {
  /** The source's finalized head, each time the loop reads it. */
  head?(head: BlockRef): void;
  /** A height that committed: its block, the new cursor. */
  committed?(block: BlockRef): void;
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
}

/** Opens a read for one callback, and runs `body` inside it. */
export type ReadOpener = <T>(body: (read: ReadHandle) => Promise<T>) => Promise<T>;

/**
 * The loop's check before the `COMMIT` that the block transaction left the cursor at the height with the block's hash
 * failed: the halt `unexpected-cursor` (`design.md` §11).
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

/** Whether two byte strings are equal. */
function sameBytes(a: Uint8Array, b: Uint8Array): boolean {
  return a.length === b.length && a.every((byte, index) => byte === b[index]);
}

/** The finalized loop over a block source (see the module comment). */
export class FinalizedLoop {
  protected readonly input: LoopInput;
  readonly #signal: AbortSignal;
  #misuse: Misuse | undefined;
  /** The point being dispatched, if any. */
  #point: PointName | undefined;

  constructor(input: LoopInput) {
    this.input = input;
    this.#signal = input.signal ?? new AbortController().signal;
  }

  /**
   * Re-delivers at the cursor (RN-11), then processes every finalized height above it, waiting for the head to rise, up
   * to its last height ({@link lastHeight}) — then resolves with how it ended, or with `signal` when its signal stopped
   * it; rejects with a {@link HeightFailure} when processing fails.
   */
  async run(): Promise<LoopEnd> {
    const unwatch = this.input.misuses?.watch((error, module) => this.#misused({ error, module, point: this.#point }));
    try {
      return await this.#run();
    } finally {
      unwatch?.();
    }
  }

  /** {@link run}, while the process contexts' refusals are reported to the loop. */
  async #run(): Promise<LoopEnd> {
    const { db, graph, source, observer } = this.input;
    let cursor = await db.read((read) => source.cursor(read));
    if (cursor !== null) await this.redeliver(cursor);
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
        throw this.#failure(next, error, false);
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
   * `on-compute` with a read at h − 1.
   */
  protected async prepare(run: HeightRun): Promise<void> {
    await this.blockPoint(run, "on-fetch");
    await this.blockPoint(run, "on-parse");
    await this.startHeight(run);
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

  /** `on-fetch` or `on-parse`: each callback with its block context and an item sink. */
  protected async blockPoint(run: HeightRun, point: "on-fetch" | "on-parse"): Promise<void> {
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

  /** The block transaction: one `BEGIN … COMMIT` holding the height's {@link write}. */
  protected async commit(run: HeightRun): Promise<void> {
    await this.input.db.transaction((tx) => this.write(tx, run));
  }

  /**
   * Inside the block transaction `tx`: every `on-db-write` callback with its block write handle, in order; then, before
   * the `COMMIT`, a misuse during the block fails it, and the cursor must be the height with the block's hash.
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
    const cursor = await readCursor(tx);
    if (cursor === null || cursor.height !== run.height || !sameBytes(cursor.hash, run.block.hash)) {
      const left =
        cursor === null
          ? "none"
          : cursor.height === run.height
            ? `height ${run.height} with another hash`
            : `height ${cursor.height}`;
      throw new UnexpectedCursor(
        `the block transaction of height ${run.height} left the cursor at ${left}, not at height ${run.height} with ` +
          `the block's hash: core-block-commit writes the block's row of ${CURSOR_TABLE} first in every block (CD-3)`,
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

  /** Processes `height` above the cursor `previous`; resolves with the new cursor. */
  async #process(height: bigint, previous: BlockRef | null): Promise<BlockRef> {
    let committed = false;
    try {
      const block = await this.input.source.block(height);
      const run: HeightRun = { height, block, range: this.#rangeAt(height), items: this.itemsAt(height), previous };
      await this.prepare(run);
      await this.commit(run);
      committed = true;
      this.input.observer?.committed?.(block);
      await this.after(run);
      this.#check();
      return block;
    } catch (error) {
      throw this.#failure(height, error, committed);
    }
  }

  /** `on-finalized` for `head`, before its heights from `next` on: each callback with a read at the cursor. */
  async #finalized(head: BlockRef, next: bigint): Promise<void> {
    const announced = Object.freeze({ height: head.height, hash: head.hash });
    await this.#dispatch(this.#rangeAt(next), "on-finalized", (_part, call) =>
      this.input.db.read((read) => call(announced, read)),
    );
  }

  /** Runs `point` in `range`, each callback through `invoke`, after checking no misuse is pending. */
  async #dispatch<P extends PointName>(range: ResolvedRange, point: P, invoke: Invoke<P>): Promise<void> {
    await this.#schedule(scheduleAt(range, point), invoke);
  }

  /** Runs `schedule`, each callback through `invoke`, after checking no misuse is pending. */
  async #schedule<P extends PointName>(schedule: PointSchedule<P>, invoke: Invoke<P>): Promise<void> {
    this.#check();
    this.#point = schedule.point;
    try {
      await runSchedule(schedule, { contextOf: this.input.contextOf, invoke });
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
