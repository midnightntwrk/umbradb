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
 * `on-start-height` (between `on-parse` and `on-compute`), `on-stop-height` (after `on-after-db-write`), the lockstep
 * wait (before `BEGIN`) and RN-11's re-delivery at the cursor are tasks 5.3, 14.x and 5.4's.
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
 * The halt — the state `halted`, its code, the process staying up — and the retries of a lost connection are task 5.4's
 * (RN-8, IN-10).
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
import type { ResolvedGraph, ResolvedRange } from "../modules/graph.js";
import { BlockItems, revisionAt } from "./block-context.js";
import type { BlockRef, BlockSource } from "./block-source.js";
import { CallbackFailure, type PointArguments, runSchedule, scheduleAt } from "./dispatch.js";
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
}

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
  /** The cursor before the height: null before the first block. */
  readonly previous: BlockRef | null;
}

/** Opens a read for one callback, and runs `body` inside it. */
export type ReadOpener = <T>(body: (read: ReadHandle) => Promise<T>) => Promise<T>;

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
   * Processes every finalized height above the cursor, then waits for the head to rise, until the signal aborts —
   * then resolves; rejects with a {@link HeightFailure} when processing fails.
   */
  async run(): Promise<void> {
    const unwatch = this.input.misuses?.watch((error, module) => this.#misused({ error, module, point: this.#point }));
    try {
      await this.#run();
    } finally {
      unwatch?.();
    }
  }

  /** {@link run}, while the process contexts' refusals are reported to the loop. */
  async #run(): Promise<void> {
    const { db, graph, source } = this.input;
    let cursor = await db.read((read) => source.cursor(read));
    for (;;) {
      if (this.#signal.aborted) return;
      const next = cursor === null ? graph.start : cursor.height + 1n;
      let head: BlockRef;
      try {
        head = await source.finalizedHead();
        if (head.height < next) {
          await this.wait(next - 1n);
          continue;
        }
        await this.#finalized(head, next);
      } catch (error) {
        throw this.#failure(next, error, false);
      }
      for (let height = next; height <= head.height; height++) {
        if (this.#signal.aborted) return;
        cursor = await this.#process(height, cursor);
      }
    }
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

  /** The points before the block transaction: `on-fetch`, `on-parse`, then `on-compute` with a read at h − 1. */
  protected async prepare(run: HeightRun): Promise<void> {
    await this.blockPoint(run, "on-fetch");
    await this.blockPoint(run, "on-parse");
    await this.compute(run, (body) => this.input.db.read(body));
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
      throw new Error(
        `the block transaction of height ${run.height} left the cursor at ${left}, not at height ${run.height} with ` +
          `the block's hash: core-block-commit writes the block's row of ${CURSOR_TABLE} first in every block (CD-3)`,
      );
    }
  }

  /** The points after the `COMMIT`: `on-after-db-write`, each callback with a read at h and no `block` items. */
  protected async after(run: HeightRun): Promise<void> {
    await this.#dispatch(run.range, "on-after-db-write", (part, call) => {
      const context = this.#context(run, part, new Map());
      return this.input.db.read((read) => call(context, read));
    });
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
    this.#check();
    this.#point = point;
    try {
      await runSchedule(scheduleAt(range, point), { contextOf: this.input.contextOf, invoke });
    } finally {
      this.#point = undefined;
    }
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
export function runFinalized(input: LoopInput): Promise<void> {
  return new FinalizedLoop(input).run();
}
