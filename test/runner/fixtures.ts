import type { BlockWriteHandle, ReadHandle } from "../../src/db/api.js";
import type {
  ApiRegistry,
  BlockContext,
  BlockHeader,
  ItemSink,
  ModuleDeclaration,
  PendingKey,
  PointName,
  ProcessContext,
} from "../../src/modules/declaration.js";
import type { PointArguments, PointRun } from "../../src/runner/dispatch.js";

/**
 * What the runner's dispatch tests share (task 5.1; RN-3, `design.md` §2): a recorder of callbacks starting and ending
 * — its event list is the logical clock, an event's index its time —, callbacks that record themselves, one process
 * context per module, and stand-in arguments for every point, so that a test runs the dispatch with no database and no
 * block source (the real handles, block context and item sink are task 5.2's).
 */

/** A callback of `module` at `point` starting or ending. */
export interface CallEvent {
  readonly module: string;
  readonly point: PointName;
  readonly kind: "start" | "end";
}

/** Records callbacks in the order they start and end. */
export class Recorder {
  readonly events: CallEvent[] = [];

  record(module: string, point: PointName, kind: CallEvent["kind"]): void {
    this.events.push({ module, point, kind });
  }

  /** The modules whose callbacks started at `point`, in the order they started. */
  starts(point: PointName): string[] {
    return this.events.filter((e) => e.point === point && e.kind === "start").map((e) => e.module);
  }

  /** The time (event index) `module`'s callback at `point` started or ended; -1 if it did not. */
  at(module: string, point: PointName, kind: CallEvent["kind"]): number {
    return this.events.findIndex((e) => e.module === module && e.point === point && e.kind === kind);
  }

  /**
   * The waves seen at `point`: each maximal run of starts with no end between them. A wave the dispatch starts with
   * `Promise.all` starts every callback before any of them ends (each awaits at least once), so it shows as one run.
   */
  waves(point: PointName): string[][] {
    const waves: string[][] = [];
    let previous: CallEvent["kind"] = "end";
    for (const event of this.events) {
      if (event.point !== point) continue;
      if (event.kind === "start") {
        if (previous === "end") waves.push([]);
        (waves.at(-1) as string[]).push(event.module);
      }
      previous = event.kind;
    }
    return waves;
  }
}

/** Yields to the microtask queue `times` times. */
export async function yields(times: number): Promise<void> {
  for (let index = 0; index < times; index++) await Promise.resolve();
}

/**
 * A callback that records its start, yields `wait` microtasks (at least one, so a wave's callbacks all start before any
 * ends), runs `body` if given, and records its end — unless `body` throws, which it lets through.
 */
export function recording(
  recorder: Recorder,
  module: string,
  point: PointName,
  wait = 1,
  body?: () => void | Promise<void>,
): () => Promise<void> {
  return async () => {
    recorder.record(module, point, "start");
    await yields(Math.max(1, wait));
    await body?.();
    recorder.record(module, point, "end");
  };
}

const HASH = new Uint8Array(32);

/** A block context at height 1 with no items. */
export const BLOCK: BlockContext = Object.freeze({
  height: 1n,
  hash: HASH,
  parentHash: HASH,
  items: new Map<string, unknown>(),
  settings: Object.freeze({}),
  active: () => true,
});

export const SINK: ItemSink = Object.freeze({ put: () => undefined });
export const READ: ReadHandle = Object.freeze({ height: 0n, query: async () => [] });
export const WRITE: BlockWriteHandle = Object.freeze({ height: 0n, query: async () => [], execute: async () => 0 });
const HEADER: BlockHeader = Object.freeze({ height: 2n, hash: HASH, parentHash: HASH });
const API: ApiRegistry = Object.freeze({ http: () => undefined, subscription: () => undefined });
const KEY: PendingKey = Object.freeze({ keyId: HASH, kind: "test", bytes: new Uint8Array(1) });

/** Stand-in arguments of every point, after the process context (`PointCallbacks`, CORE-ARCH §4.10). */
export const ARGUMENTS: { readonly [P in PointName]: PointArguments<P> } = Object.freeze({
  "on-start-db": [WRITE],
  "on-start-api": [API],
  "on-best-block": [HEADER],
  "on-fetch": [BLOCK, SINK],
  "on-parse": [BLOCK, SINK],
  "on-rollback": [[HEADER]],
  "on-finalized": [{ height: 1n, hash: HASH }],
  "on-start-height": [{ entryId: "m", height: 1n }],
  "on-compute": [BLOCK, READ, SINK],
  "on-db-write": [BLOCK, WRITE],
  "on-after-db-write": [BLOCK, READ],
  "on-stop-height": [{ entryId: "m", height: 1n }],
  "on-key": [KEY],
});

/** One process context per module, made on first use and the same object afterwards (MD-7). */
export class Contexts {
  readonly #byId = new Map<string, ProcessContext>();
  readonly asked: string[] = [];

  of(id: string): ProcessContext {
    this.asked.push(id);
    let context = this.#byId.get(id);
    if (context === undefined) {
      context = Object.freeze({ items: new Map<string, unknown>(), revisions: [], publish: () => undefined });
      this.#byId.set(id, context);
    }
    return context;
  }
}

/** A run of `point` that gives every part its module's context and the point's stand-in arguments. */
export function runOf<P extends PointName>(point: P, contexts = new Contexts()): PointRun<P> {
  return {
    contextOf: (id) => contexts.of(id),
    invoke: (_part: ModuleDeclaration, call) => call(...ARGUMENTS[point]),
  };
}
