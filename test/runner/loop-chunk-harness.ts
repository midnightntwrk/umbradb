import { coreBlockCommit } from "../../src/backbone/core-block-commit/core-block-commit.js";
import { readOnlyDatabase } from "../../src/db/read-only.js";
import type { BlockWriteHandle, Database, ReadHandle, Transaction } from "../../src/db/api.js";
import type { BlockContext, BlockRun, ModuleDeclaration, ProcessContext } from "../../src/modules/declaration.js";
import type { BlockSource, QueueRunner } from "../../src/runner/block-source.js";
import { InMemoryBlockSource } from "../../src/runner/in-memory-source.js";
import { FinalizedLoop, type LoopInput, type LoopObserver } from "../../src/runner/loop.js";
import type { LoopPause } from "../../src/runner/pause.js";
import type { EntryRange } from "../../src/modules/graph.js";
import type { TransactionFollower } from "../../src/runner/transaction-follower.js";
import { blockFetchStandIn } from "../backbone/block-fetch-stand-in.js";
import { declaration } from "../modules/declarations.js";
import { CORE_CHAIN, CORE_DIGEST, entry } from "../modules/graph-fixtures.js";
import { Contexts } from "./fixtures.js";
import { type RunnerBackend, type Started, startWith } from "./loop-harness.js";

/**
 * What the tests of chunks in the finalized loop share (`loop-chunk*.test.ts`):
 * - the test backbone with `core-block-commit` checking what it keeps (`checkKept`);
 * - module `r`, which records each of its points (height, the handle's `height`, the last height its table holds as
 *   its handle sees it, `continues`) and writes its height at `on-db-write`;
 * - a database whose transactions mark `BEGIN` and `COMMIT` in the same order as the points;
 * - a source over the in-memory chain that hands the test the loop's queue runner;
 * - the chunks a setting forms over heights 1 to a head, and the order of points and transactions they give.
 */

/** One point `r` saw. */
export interface Seen {
  readonly point: string;
  readonly height: bigint;
  /** The handle's `height`, where the point has a handle. */
  readonly readHeight?: bigint | null;
  /** The highest height of `r.rows` as the handle sees it. */
  readonly sees?: bigint | null;
  readonly continues?: boolean;
  /** `on-settle`'s run, `first-last`. */
  readonly run?: string;
}

/** What `r` is given beyond its record. */
export interface RecorderOptions {
  /** Awaited at each point of `r`, after it recorded (a test acts while it runs). */
  readonly at?: (point: string, height: bigint, handle: ReadHandle | undefined) => Promise<void>;
}

/** The highest height of `r.rows` through `read`. */
async function highest(read: Pick<ReadHandle, "query">): Promise<bigint | null> {
  const [row] = await read.query("SELECT max(height) AS h FROM r.rows");
  return (row?.h as bigint | null | undefined) ?? null;
}

/** Module `r` over `order` (each point as `<point>@<h>`) and `seen` (see the module comment). */
export function recorder(order: string[], seen: Seen[], options: RecorderOptions = {}): ModuleDeclaration {
  const note = (entry: Seen): void => {
    order.push(`${entry.point}@${entry.height}`);
    seen.push(entry);
  };
  return declaration("r", {
    points: {
      async "on-finalized"(_p, head, read) {
        note({ point: "on-finalized", height: head.height, readHeight: read.height });
        await options.at?.("on-finalized", head.height, read);
      },
      async "on-fetch"(_p, b: BlockContext) {
        note({ point: "on-fetch", height: b.height, continues: b.continues });
        await options.at?.("on-fetch", b.height, undefined);
      },
      async "on-parse"(_p, b: BlockContext) {
        note({ point: "on-parse", height: b.height, continues: b.continues });
        await options.at?.("on-parse", b.height, undefined);
      },
      async "on-start-height"(_p, started, read) {
        note({ point: "on-start-height", height: started.height, readHeight: read.height });
        await options.at?.("on-start-height", started.height, read);
      },
      async "on-compute"(_p, b: BlockContext, read: ReadHandle) {
        note({ point: "on-compute", height: b.height, readHeight: read.height, sees: await highest(read), continues: b.continues });
        await options.at?.("on-compute", b.height, read);
      },
      async "on-db-write"(_p, b: BlockContext, w: BlockWriteHandle) {
        note({ point: "on-db-write", height: b.height, readHeight: w.height, sees: await highest(w), continues: b.continues });
        await w.execute("INSERT INTO r.rows (height) VALUES ($1)", [b.height]);
        await options.at?.("on-db-write", b.height, w);
      },
      async "on-settle"(_p, run: BlockRun, w: BlockWriteHandle) {
        note({ point: "on-settle", height: run.first, run: `${run.first}-${run.last}`, readHeight: w.height });
        await options.at?.("on-settle", run.first, w);
      },
      async "on-after-db-write"(_p, b: BlockContext, read: ReadHandle) {
        note({ point: "on-after-db-write", height: b.height, readHeight: read.height, sees: await highest(read), continues: b.continues });
        await options.at?.("on-after-db-write", b.height, read);
      },
      async "on-stop-height"(_p, stopped, read) {
        note({ point: "on-stop-height", height: stopped.height, readHeight: read.height });
        await options.at?.("on-stop-height", stopped.height, read);
      },
    },
  });
}

/** The test backbone with `core-block-commit` comparing what it keeps with the database (`checkKept`). */
export const CHECKED_BACKBONE: readonly ModuleDeclaration[] = [CORE_CHAIN, blockFetchStandIn(), coreBlockCommit({ checkKept: true }), CORE_DIGEST];

/** `db`, whose transactions push `BEGIN` once their body starts and `COMMIT` once they committed, into `order`. */
export function marking(db: Database, order: string[]): Database {
  return {
    read: (body, options) => db.read(body, options),
    async transaction<T>(body: (tx: Transaction) => Promise<T>): Promise<T> {
      const result = await db.transaction((tx) => {
        order.push("BEGIN");
        return body(tx);
      });
      order.push("COMMIT");
      return result;
    },
    writerSession: () => db.writerSession(),
    close: () => db.close(),
  };
}

/** The in-memory chain as a source that keeps the loop's queue runner while a run of the loop holds it. */
export function attachedSource(memory: InMemoryBlockSource): { readonly source: BlockSource; runner(): QueueRunner } {
  let runner: QueueRunner | undefined;
  const source: BlockSource = {
    cursor: (read) => memory.cursor(read),
    finalizedHead: () => memory.finalizedHead(),
    latestHead: () => memory.latestHead(),
    waitForHead: (above, signal) => memory.waitForHead(above, signal),
    block: (height) => memory.block(height),
    attach(given) {
      runner = given;
      return () => {
        runner = undefined;
      };
    },
  };
  return {
    source,
    runner() {
      if (runner === undefined) throw new Error("no run of the loop holds the source");
      return runner;
    },
  };
}

/** The chunks `blocks` forms over heights 1 to `head`, distance 0: each `[first, last]`, a height alone as `[h, h]`. */
export function chunksOf(blocks: number, head: bigint, distance = 0n): (readonly [bigint, bigint])[] {
  const chunks: (readonly [bigint, bigint])[] = [];
  for (let first = 1n; first <= head; ) {
    let last = first + BigInt(blocks) - 1n;
    if (last > head - distance) last = head - distance;
    if (blocks < 2 || last <= first) last = first;
    chunks.push([first, last]);
    first = last + 1n;
  }
  return chunks;
}

/**
 * The order of `r`'s points and the transactions' marks over `chunks` (heights from 1, `r` starting at 1), the
 * source not preparing ahead: `on-finalized` of the head; for each chunk, every block's `on-fetch` and `on-parse`,
 * the first block's `on-start-height` at 1 and `on-compute`, `BEGIN`, each block's writes (a later block's
 * `on-compute` first), `COMMIT`, then each block's `on-after-db-write`.
 */
export function orderOf(chunks: readonly (readonly [bigint, bigint])[], head: bigint): string[] {
  const order = [`on-finalized@${head}`];
  for (const [first, last] of chunks) {
    for (let h = first; h <= last; h++) order.push(`on-fetch@${h}`, `on-parse@${h}`);
    if (first === 1n) order.push("on-start-height@1");
    order.push(`on-compute@${first}`, "BEGIN");
    for (let h = first; h <= last; h++) {
      if (h > first) order.push(`on-compute@${h}`);
      order.push(`on-db-write@${h}`, `on-settle@${h}`);
    }
    order.push("COMMIT");
    for (let h = first; h <= last; h++) order.push(`on-after-db-write@${h}`);
  }
  return order;
}

/** What one run of `r` over heights 1 to a head gave. */
export interface ChunkRun {
  readonly db: Database;
  readonly started: Started;
  readonly order: string[];
  readonly seen: Seen[];
}

/** What {@link runChunks} takes. */
export interface ChunkRunOptions {
  readonly head: bigint;
  /** The setting's `blocks`; none: the mode off. */
  readonly blocks?: number;
  readonly distance?: number;
  readonly recorder?: RecorderOptions;
  /** More modules, each with an entry from 1. */
  readonly modules?: readonly ModuleDeclaration[];
  /** The module whose process context holds the `db` item: the run's database, read-only. */
  readonly dbItem?: string;
  /** The process contexts, when no `dbItem` is given; the fixtures' unless given. */
  readonly contexts?: Contexts;
  /** Where the order of points and marks goes; a new list unless given (a module reads it while the loop runs). */
  readonly order?: string[];
  readonly follower?: TransactionFollower;
  /** The source; the in-memory chain at `head` unless given. */
  readonly source?: (memory: InMemoryBlockSource) => BlockSource;
  /** The loop's class; the real one unless given (a negative control's). */
  readonly loop?: new (input: LoopInput) => FinalizedLoop;
  /** The pause between heights. */
  readonly pause?: LoopPause;
  /** The core's stop: the loop's last height. */
  readonly coreStop?: bigint;
  /** Each module's entry; from 1 with no stop unless given. */
  readonly entries?: (id: string) => EntryRange;
  /** Stops the loop; a new one unless given. */
  readonly controller?: AbortController;
  /** Told the run's database once it is open, before the loop runs. */
  readonly onDatabase?: (db: Database) => void;
  /** The loop's observer. */
  readonly observer?: LoopObserver;
  /** The loop's slow-window threshold. */
  readonly slowBlockMs?: number;
}

/** Runs `r` (and `options.modules`) over heights 1 to `options.head` on a new database of `backend`, until the loop waits. */
export async function runChunks(backend: RunnerBackend, options: ChunkRunOptions): Promise<ChunkRun> {
  const { db } = await backend.database();
  options.onDatabase?.(db);
  const order = options.order ?? [];
  const seen: Seen[] = [];
  const user = [recorder(order, seen, options.recorder), ...(options.modules ?? [])];
  const contexts = options.dbItem === undefined ? (options.contexts ?? new Contexts()) : new WithItem(options.dbItem, "db", readOnlyDatabase(db));
  const entries = user.map((part) => options.entries?.(part.id) ?? entry(part.id, 1));
  const started = await startWith(db, user, entries, { backbone: CHECKED_BACKBONE, contexts });
  const memory = new InMemoryBlockSource({ head: options.head });
  const source = options.source?.(memory) ?? memory;
  const controller = options.controller ?? new AbortController();
  const Loop = options.loop ?? FinalizedLoop;
  const loop = new Loop({
    db: marking(db, order),
    graph: started.graph,
    plan: started.plan,
    source,
    contextOf: (id) => started.contexts.of(id),
    signal: controller.signal,
    ...(options.blocks === undefined ? {} : { fastSync: { blocks: options.blocks, distance: options.distance ?? 0 } }),
    ...(options.follower === undefined ? {} : { follower: options.follower }),
    ...(options.pause === undefined ? {} : { pause: options.pause }),
    ...(options.coreStop === undefined ? {} : { coreStop: options.coreStop }),
    ...(options.observer === undefined ? {} : { observer: options.observer }),
    ...(options.slowBlockMs === undefined ? {} : { slowBlockMs: options.slowBlockMs }),
  });
  const running = loop.run();
  try {
    await Promise.race([memory.waiting(options.head), running]);
  } finally {
    controller.abort();
  }
  await running;
  return { db, started, order, seen };
}

/** `seen` by `<point>@<h>`, each a list in call order. */
export function byPoint(seen: readonly Seen[]): Map<string, Seen[]> {
  const map = new Map<string, Seen[]>();
  for (const entry of seen) {
    const key = `${entry.point}@${entry.height}`;
    map.set(key, [...(map.get(key) ?? []), entry]);
  }
  return map;
}

/** Process contexts in which module `id`'s holds the `process` item `key` (the `db` item, as core-chain publishes it). */
export class WithItem extends Contexts {
  #context: ProcessContext | undefined;

  constructor(
    readonly id: string,
    readonly key: string,
    readonly item: unknown,
  ) {
    super();
  }

  override of(id: string): ProcessContext {
    const context = super.of(id);
    if (id !== this.id) return context;
    this.#context ??= Object.freeze({ ...context, items: new Map([[this.key, this.item]]) });
    return this.#context;
  }
}
