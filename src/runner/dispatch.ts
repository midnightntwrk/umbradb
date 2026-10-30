/**
 * The runner's point dispatch: which parts a point calls, in which order, and how, given one height range of the
 * resolved requirement graph (`src/modules/graph.ts`, {@link ResolvedRange}).
 * [RN-3, RN-9, RN-10; design §2; CORE-ARCH §4.2]
 *
 * **Order.** A point calls the parts of the range that register it, in the range's order: the backbone parts in their
 * fixed order, then the other modules by Kahn's algorithm, taking first the ready one with the smallest id by UTF-8
 * bytes. At `on-db-write` the order is the range's `writeOrder`, with `core-digest` last. [RN-3]
 * - `on-start-height` calls the core's parts (the backbone, which runs with the core entry) when the core's entry
 *   starts, then the modules whose entries start, in that order [RN-9].
 * - `on-stop-height` calls the stopping modules in reverse order, then the core's parts in their fixed order [RN-10].
 * - `on-start-db` belongs to the migration runner, in the startup order (`startDatabase`) [DB-9].
 *
 * **In series, or in waves** ({@link PointSchedule}). Every point runs in series, each callback awaited before the
 * next is called, except `on-fetch`, `on-parse` and `on-compute` ({@link PARALLEL_POINTS}), which run in parallel where
 * the graph allows. Their backbone parts run first, in series in their fixed order. The other modules then run in the
 * waves of Kahn's algorithm, restricted to the modules registered at the point. [RN-3; design §2]
 * - A module goes in the wave after the latest registered module on a requirement path from it. The path may pass
 *   through modules that do not register the point, so a module still waits for a provider two steps away.
 * - Each wave starts its callbacks one after another in the range's order, and awaits them all
 *   (`Promise.allSettled`) before the next wave starts.
 *
 * So no callback starts before every callback of a module it requires, directly or through others, has completed. A
 * module may also wait for modules of the previous wave that it does not require; this is allowed, since modules
 * without a requirement between them may, but need not, run concurrently. [RN-3, A38]
 *
 * **Calls.** Each callback is called as a method of its declaration's `points` object, `points[point].call(points,
 * …)`, as `migrationPart` calls `on-start-db` (`src/modules/adapters.ts`). So `this` is the same in every callback of a
 * module. The callback gets the module's process context first ({@link PointRun.contextOf}: one per module), then what
 * the point gives ({@link PointArguments}), which the caller supplies per part ({@link PointRun.invoke}): the database
 * handles, the block context and the item sink. [MD-7, RN-4]
 *
 * **Failures.** A callback that throws or rejects, or an invocation that fails around it, ends the point. In series,
 * no later part is called. In a wave, the wave's other callbacks are awaited, never cancelled, and nothing of the next
 * wave starts. The dispatch then rejects with a {@link CallbackFailure} that names the point and the module (the first
 * failing part in the point's order, whichever failed first in time) and carries the error unchanged as its `cause`.
 * The halt it leads to is the runner's. When the dispatch settles, no callback of the point is running. [RN-8, RN-17]
 */

import { CORE_ENTRY_ID } from "../config/entries.js";
import { BACKBONE_ORDER, type HeightRange, type ResolvedRange } from "../modules/graph.js";
import type { ModuleDeclaration, PointCallbacks, PointName, ProcessContext } from "../modules/declaration.js";

/** The points whose callbacks run in parallel where the graph allows; every other runs in series. [RN-3; design §2] */
export const PARALLEL_POINTS = Object.freeze(["on-fetch", "on-parse", "on-compute"] as const);

/** A point whose callbacks run in Kahn waves. */
export type ParallelPoint = (typeof PARALLEL_POINTS)[number];

/** Whether `point` runs in Kahn waves rather than in series. */
export function isParallelPoint(point: PointName): point is ParallelPoint {
  return (PARALLEL_POINTS as readonly PointName[]).includes(point);
}

/** The arguments of a callback at `P` after the process context (`PointCallbacks`). [CORE-ARCH §4.10] */
export type PointArguments<P extends PointName> = PointCallbacks[P] extends (
  context: ProcessContext,
  ...rest: infer R
) => Promise<void>
  ? R
  : never;

/**
 * The parts one point calls, in waves: the callbacks of a wave start one after another in the wave's order and run
 * together; a wave starts when every callback of the one before it has completed. A point in series has one part per
 * wave.
 */
export interface PointSchedule<P extends PointName = PointName> {
  readonly point: P;
  readonly waves: readonly (readonly ModuleDeclaration[])[];
}

/** What the runner gives one run of a point's schedule. */
export interface PointRun<P extends PointName = PointName> {
  /** The process context of module `id`: one per module, the same object at every point. [MD-7] */
  contextOf(id: string): ProcessContext;
  /**
   * Calls `part`'s callback by calling `call` once with the point's arguments for it — inside whatever the point needs
   * around it, e.g. at `on-db-write` `writes.write(part.id, (w) => call(block, w))` (`src/db/write-handles.ts`) — and
   * settles when the callback has: resolves when it returned, rejects with its error (or the invocation's own).
   */
  invoke(part: ModuleDeclaration, call: (...args: PointArguments<P>) => Promise<void>): Promise<void>;
}

/** The entries starting, or stopping, at a height: whether the core's does, and the ids of the modules' that do. */
export interface EntryBoundary {
  readonly core: boolean;
  readonly modules: readonly string[];
}

/** A callback that failed, with the point and the module; the error is its `cause`, unchanged. [RN-8] */
export class CallbackFailure extends Error {
  readonly point: PointName;
  readonly module: string;

  constructor(point: PointName, module: string, cause: unknown) {
    super(`the ${point} callback of ${module} failed: ${cause instanceof Error ? cause.message : String(cause)}`, {
      cause,
    });
    this.name = "CallbackFailure";
    this.point = point;
    this.module = module;
  }
}

// ── schedules ───────────────────────────────────────────────────────────────────────────────────────────────────────

/** Whether `part` registers a callback at `point`. */
const registers = (part: ModuleDeclaration, point: PointName): boolean => typeof part.points[point] === "function";

/** Whether `part` is a backbone part: one of the core's, in the fixed backbone order, run with the core entry. [RN-3] */
export const isBackbonePart = (part: Pick<ModuleDeclaration, "id">): boolean => BACKBONE_ORDER.includes(part.id);


/**
 * The entry whose start or stop `on-start-height` and `on-stop-height` announce to `part`: `core` for a backbone part,
 * which runs with the core entry, and the module's own id for a module. [RN-9, RN-10]
 */
export function entryIdOf(part: Pick<ModuleDeclaration, "id">): string {
  return isBackbonePart(part) ? CORE_ENTRY_ID : part.id;
}

/** A range in words: `10–19`, or `from 20 on`. */
const span = (range: HeightRange): string => (range.to === null ? `from ${range.from} on` : `${range.from}–${range.to}`);

const scheduled = <P extends PointName>(point: P, waves: readonly (readonly ModuleDeclaration[])[]): PointSchedule<P> =>
  Object.freeze({ point, waves: Object.freeze(waves.map((wave) => Object.freeze([...wave]))) });

/** `parts` that register `point`, in the order given, in series: one part per wave. */
export function seriesOf<P extends PointName>(point: P, parts: readonly ModuleDeclaration[]): PointSchedule<P> {
  return scheduled(point, parts.filter((part) => registers(part, point)).map((part) => [part]));
}

/**
 * The Kahn waves of `range`'s modules registered at `point` (not the backbone's): each module one wave after the latest
 * registered module on a requirement path from it, through any part active in the range; each wave in `order`. One pass
 * over `order`, a topological order: for each part, the first wave a module requiring it may run in — after its own
 * wave for a registered module, else the latest such wave among its providers, which carries the waits through a part
 * that does not register the point.
 */
function moduleWaves(range: ResolvedRange, point: PointName): ModuleDeclaration[][] {
  const after = new Map<string, number>();
  const waves: ModuleDeclaration[][] = [];
  for (const part of range.order) {
    const firsts = part.requires.map((item) => {
      const provider = range.providerOf.get(item);
      // A private process's public item: the public core committed it, so there is nothing here to wait for. [PP-13]
      if (provider === undefined && range.publicItems?.has(item) === true) return 0;
      if (provider === undefined) {
        throw new Error(
          `scheduleAt: ${part.id} requires the item ${item}, which no single part provides at heights ` +
            `${span(range.range)}; ${point} runs only in ranges startup checks whole, where each has one provider`,
        );
      }
      return after.get(provider) as number;
    });
    const wave = Math.max(0, ...firsts);
    if (isBackbonePart(part) || !registers(part, point)) {
      after.set(part.id, wave);
      continue;
    }
    after.set(part.id, wave + 1);
    // A wave above 0 is one past a registered module's, so no wave is left empty.
    while (waves.length <= wave) waves.push([]);
    (waves[wave] as ModuleDeclaration[]).push(part);
  }
  return waves;
}

/**
 * The schedule of `point` in `range`: its registered parts in the range's `order` (`writeOrder` at `on-db-write`, with
 * `core-digest` last), in series. At a parallel point, the backbone parts run in series, then the modules' Kahn waves.
 * [RN-3; design §2]
 *
 * Throws for `on-start-db`, which the migration runner runs in the startup order, and for `on-start-height` and
 * `on-stop-height`, which need the entries ({@link startHeightSchedule}, {@link stopHeightSchedule}). [DB-9, Q95]
 */
export function scheduleAt<P extends PointName>(range: ResolvedRange, point: P): PointSchedule<P> {
  if (point === "on-start-db") {
    throw new Error(
      "scheduleAt: on-start-db runs in the migration runner's startup order, after each part's migrations " +
        "(startDatabase with migrationPart), not in a range's order",
    );
  }
  if (point === "on-start-height" || point === "on-stop-height") {
    const builder = point === "on-start-height" ? "startHeightSchedule" : "stopHeightSchedule";
    throw new Error(`scheduleAt: ${point} calls only the entries starting or stopping at a height: use ${builder}`);
  }
  if (point === "on-db-write") return seriesOf(point, range.writeOrder);
  if (!isParallelPoint(point)) return seriesOf(point, range.order);
  const backbone = seriesOf(point, range.order.filter(isBackbonePart)).waves;
  return scheduled(point, [...backbone, ...moduleWaves(range, point)]);
}

/** The modules of `boundary`, checked to be modules active in `range`, as a set. */
function boundaryModules(range: ResolvedRange, boundary: EntryBoundary, builder: string): Set<string> {
  const modules = new Set(range.order.filter((part) => !isBackbonePart(part)).map((part) => part.id));
  for (const id of boundary.modules) {
    if (!modules.has(id)) {
      throw new Error(
        `${builder}: ${id} is not a module active at heights ${span(range.range)}; an entry that starts or stops at ` +
          "a height is active there (the core's entry is `core: true`, its parts the backbone's)",
      );
    }
  }
  return new Set(boundary.modules);
}

/**
 * `on-start-height` at a height of `range`, in series: when the core's entry starts there, first the core's parts (the
 * backbone) in their fixed order; then the modules whose entries start there, in the range's order. Only parts
 * registered at the point are called. Throws for a module not active in `range`. [RN-9; design §2]
 */
export function startHeightSchedule(range: ResolvedRange, starting: EntryBoundary): PointSchedule<"on-start-height"> {
  const modules = boundaryModules(range, starting, "startHeightSchedule");
  const parts = range.order.filter((part) => (isBackbonePart(part) ? starting.core : modules.has(part.id)));
  return seriesOf("on-start-height", parts);
}

/**
 * `on-stop-height` at a height of `range`, in series: first the modules whose entries stop there, in reverse range
 * order; then, when the core's entry stops there, the core's parts (the backbone) in their fixed order. Only parts
 * registered at the point are called. Throws for a module not active in `range`. [RN-10; design §2]
 */
export function stopHeightSchedule(range: ResolvedRange, stopping: EntryBoundary): PointSchedule<"on-stop-height"> {
  const modules = boundaryModules(range, stopping, "stopHeightSchedule");
  const stopped = range.order.filter((part) => !isBackbonePart(part) && modules.has(part.id)).reverse();
  const core = stopping.core ? range.order.filter(isBackbonePart) : [];
  return seriesOf("on-stop-height", [...stopped, ...core]);
}

// ── running ─────────────────────────────────────────────────────────────────────────────────────────────────────────

type Callback<P extends PointName> = (this: unknown, context: ProcessContext, ...args: PointArguments<P>) => unknown;

/** Calls `part`'s callback at `point` through `run`: settles when it has, rejecting with the callback's error. */
async function call<P extends PointName>(point: P, part: ModuleDeclaration, run: PointRun<P>): Promise<void> {
  await run.invoke(part, async (...args) => {
    const { points } = part;
    await (points[point] as unknown as Callback<P>).call(points, run.contextOf(part.id), ...args);
  });
}

/**
 * Runs `schedule` (see the module comment): each wave's callbacks started in order and all awaited, then the next
 * wave; rejects with a {@link CallbackFailure} for the first failing part of the first wave with a failure, after the
 * rest of that wave has settled. Throws, calling nothing, for a schedule with a part that does not register its point.
 */
export async function runSchedule<P extends PointName>(schedule: PointSchedule<P>, run: PointRun<P>): Promise<void> {
  const { point, waves } = schedule;
  for (const part of waves.flat()) {
    if (!registers(part, point)) {
      throw new Error(
        `runSchedule: ${part.id} registers no ${point} callback; a schedule holds only the parts registered at its point`,
      );
    }
  }
  for (const wave of waves) {
    const outcomes = await Promise.allSettled(wave.map((part) => call(point, part, run)));
    const failed = outcomes.findIndex((outcome) => outcome.status === "rejected");
    if (failed >= 0) {
      const { reason } = outcomes[failed] as PromiseRejectedResult;
      throw new CallbackFailure(point, (wave[failed] as ModuleDeclaration).id, reason);
    }
  }
}

/** Runs `point` in `range`: {@link runSchedule} of {@link scheduleAt}. */
export function dispatch<P extends PointName>(range: ResolvedRange, point: P, run: PointRun<P>): Promise<void> {
  return runSchedule(scheduleAt(range, point), run);
}
