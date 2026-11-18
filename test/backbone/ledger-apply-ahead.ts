import { z } from "zod";
import { CORE_LEDGER_STATE_ID, type CoreLedgerStateOptions } from "../../src/backbone/core-ledger-state/core-ledger-state.js";
import type { CoreRevision } from "../../src/backbone/core-ledger-state/retention.js";
import type { BlockWriteHandle } from "../../src/db/api.js";
import { UmbraError } from "../../src/db/errors.js";
import type { BlockWrites } from "../../src/db/write-handles.js";
import type { LedgerHost } from "../../src/ledger/worker/host.js";
import type { ModuleDeclaration } from "../../src/modules/declaration.js";
import { FinalizedLoop, type HeightRun, type LoopInput } from "../../src/runner/loop.js";
import type { TraceSink } from "../../src/trace/trace.js";
import { type LostCommit, losingCommits } from "../runner/block-continues-harness.js";
import { COUNTERS } from "../ledger/fixtures/sweep-test-loader.js";
import type { DagRun } from "./refcount-process.js";

/**
 * Shared by the tests of the next block applied ahead through the process (`ledger-apply-ahead.test.ts`,
 * `ledger-apply-ahead-failures.test.ts` and their negative control): the `core` settings that turn it on and off, a
 * block trace kept in memory, a run's tables as text, a loop and a worker that record the order of each block's settle,
 * eviction, apply ahead and `COMMIT`, a net write that loses its connection once, a loop whose `COMMIT` is lost once, a
 * retention window raised at a block's turn, a worker whose restart waits for the applies ahead in flight, an
 * `on-compute` read that loses its connection once, a loop that still gives the next block's context when a height is
 * made again, a retention window raised when a net write is lost, and a worker that arms the test package's failing
 * release for one apply ahead. Imports nothing of Vitest.
 */

/** The `core` settings of a run that applies each block at its own turn, and of one that applies the next ahead. */
export const AT_ITS_TURN = Object.freeze({ applyAhead: false });
export const AHEAD = Object.freeze({ applyAhead: true });

const hex = (bytes: Uint8Array): string => Buffer.from(bytes).toString("hex");

/** The tables of every height of `run` as text, for comparing two runs. */
export const tablesText = (run: DagRun): string =>
  JSON.stringify([...run.tables].map(([h, t]) => [`${h}`, [...t.rows].map(([k, c]) => `${k}:${hex(c)}`), [...t.refs], [...t.roots], [...t.queue], [...t.digests]]));

/** A trace sink that keeps the block lines, and what they say of the blocks applied ahead. */
export function aheadTrace() {
  let blocks = "";
  const sink: TraceSink = {
    blocks: (text) => void (blocks += text),
    statements: () => undefined,
    worker: () => undefined,
  };
  const lines = (): Record<string, unknown>[] =>
    blocks === "" ? [] : blocks.trimEnd().split("\n").map((line) => JSON.parse(line) as Record<string, unknown>);
  const heights = (field: "aheadUsed" | "aheadDropped"): number[] =>
    lines()
      .filter((line) => typeof line[field] === "number" && (line[field] as number) > 0)
      .map((line) => line.h as number);
  return {
    sink,
    lines,
    /** The heights whose block was applied ahead and the result used. */
    used: () => heights("aheadUsed"),
    /** The heights whose block was applied ahead and the result dropped. */
    dropped: () => heights("aheadDropped"),
    /** The chain of step outputs at each height. */
    chain: () => lines().map((line) => line.sh),
  };
}

/** What a run's loop and worker did, in order: a word and the height it was for. */
export type Event = readonly [string, bigint];

/**
 * A loop recording, for each height, when its `on-settle` point began (`settle`) and ended (`settled`) and when its
 * `COMMIT` answered (`committed`); `settling` holds the height whose `on-settle` point runs.
 */
export function orderLoop(events: Event[], settling: { height: bigint | null }): new (input: LoopInput) => FinalizedLoop {
  return class OrderLoop extends FinalizedLoop {
    protected override async settlePoint(run: HeightRun, writes: BlockWrites): Promise<void> {
      events.push(["settle", run.height]);
      settling.height = run.height;
      try {
        await super.settlePoint(run, writes);
      } finally {
        settling.height = null;
      }
      events.push(["settled", run.height]);
    }

    protected override async commit(run: HeightRun): Promise<void> {
      await super.commit(run);
      events.push(["committed", run.height]);
    }
  };
}

/**
 * `host` recording in `events` each eviction when it is sent (`evict`, under the height whose `on-settle` sends it),
 * each apply marked ahead (`ahead`) and each apply at a block's turn (`apply`), by the block's height.
 */
export function orderHost(events: Event[], settling: { readonly height: bigint | null }): (host: LedgerHost) => LedgerHost {
  return (host) =>
    new Proxy(host, {
      get(target, name) {
        if (name === "apply") {
          return (input: Parameters<LedgerHost["apply"]>[0], read?: Parameters<LedgerHost["apply"]>[1]) => {
            events.push([input.ahead === true ? "ahead" : "apply", input.height]);
            return target.apply(input, read);
          };
        }
        if (name === "evict") {
          return (keys: readonly Uint8Array[]) => {
            events.push(["evict", settling.height ?? -1n]);
            return target.evict(keys);
          };
        }
        const value: unknown = Reflect.get(target, name, target);
        return typeof value === "function" ? (value as (...args: unknown[]) => unknown).bind(target) : value;
      },
    });
}

/**
 * Where `events` break the rule (none when it holds): every apply of a block n marked ahead is sent inside an attempt of
 * n − 1's `on-settle` point (after its `settle`, before its `settled`), after that attempt's eviction when it sends one;
 * every apply of n at its turn (n from 2 on) is sent after n − 1 committed. So no apply of n precedes the eviction of
 * the settle of n − 1 it follows.
 */
export function aheadOrderProblems(events: readonly Event[]): string[] {
  const problems: string[] = [];
  const lastBefore = (word: string, height: bigint, before: number): number => {
    for (let index = before - 1; index >= 0; index--) {
      const [w, h] = events[index] as Event;
      if (w === word && h === height) return index;
    }
    return -1;
  };
  const firstAfter = (word: string, height: bigint, after: number): number => {
    for (let index = after + 1; index < events.length; index++) {
      const [w, h] = events[index] as Event;
      if (w === word && h === height) return index;
    }
    return events.length;
  };
  for (const [index, [word, height]] of events.entries()) {
    if (word === "ahead") {
      const settle = lastBefore("settle", height - 1n, index);
      const settled = firstAfter("settled", height - 1n, settle);
      if (settle < 0 || settled < index) {
        problems.push(`the apply ahead of ${height} sent outside an on-settle point of ${height - 1n}`);
        continue;
      }
      // The attempt's eviction, if it sends one, is sent before the apply ahead.
      const evicts = events.slice(settle, settled).some(([w, h]) => w === "evict" && h === height - 1n);
      const evictedFirst = events.slice(settle, index).some(([w, h]) => w === "evict" && h === height - 1n);
      if (evicts && !evictedFirst) problems.push(`the apply ahead of ${height} sent before the eviction of ${height - 1n}'s settle`);
    } else if (word === "apply" && height >= 2n && lastBefore("committed", height - 1n, index) < 0) {
      problems.push(`the apply of ${height} at its turn sent before ${height - 1n} committed`);
    }
  }
  return problems;
}

/**
 * `core-ledger-state`'s node writer whose first statement at `height`'s net write throws `connection-lost` once, as a
 * lost writer connection does inside `on-settle`, after the eviction and the apply ahead were sent: the block's
 * transaction rolls back and the process makes the height again after its back-off.
 */
export function losesNetWriteOnce(height: bigint): Pick<CoreLedgerStateOptions, "nodeWriter"> {
  let lost = false;
  return {
    nodeWriter: (w, at) =>
      at !== height || lost
        ? w
        : ({
            async execute(...args: Parameters<BlockWriteHandle["execute"]>) {
              if (!lost) {
                lost = true;
                throw new UmbraError("connection-lost", `the writer's connection was lost at the net write of block ${height} (the test's)`);
              }
              return w.execute(...args);
            },
          } as Pick<BlockWriteHandle, "execute">),
  };
}

/**
 * A loop whose block transaction at `height` loses its `COMMIT` once, as `how` says: after it landed, or rolled back
 * (`../runner/block-continues-harness.ts`). The process runs the loop again after its back-off, which reads the cursor.
 */
export function losingCommitLoop(height: bigint, how: LostCommit): new (input: LoopInput) => FinalizedLoop {
  let armed = false;
  let losing: ReturnType<typeof losingCommits> | undefined;
  return class LosingCommit extends FinalizedLoop {
    constructor(input: LoopInput) {
      losing = losingCommits(input.db);
      super({ ...input, db: losing.db });
    }

    protected override async commit(run: HeightRun): Promise<void> {
      if (run.height === height && !armed && losing !== undefined) {
        armed = true;
        losing.state.armed = how;
      }
      await super.commit(run);
    }
  };
}

/**
 * A retention window that `core-ledger-state` sees raised only once `height`'s turn has come: L(h), the lowest height
 * retained after h, is h before and h − 1 from `height` on, read through its `retainedFrom` rule, which a user module
 * switches at the `on-after-db-write` of the block before `height`. So `height` releases no state at its turn, while its
 * apply ahead, built at the `on-settle` of the block before, before the switch, releases the state before it: the two
 * inputs differ (rule 1 of `apply-ahead.ts`). `window` is L for the checks, from the start.
 */
export function windowRaisedAt(height: bigint): {
  readonly core: Pick<CoreLedgerStateOptions, "retainedFrom">;
  readonly user: readonly ModuleDeclaration[];
  readonly window: (h: number) => number;
} {
  let raised = false;
  const module: ModuleDeclaration = {
    id: "raise-window",
    version: "1.0.0",
    side: "public",
    requires: ["block-header"],
    provides: [{ name: "raise-window-rows", lifetimes: ["table"], table: { schema: "raise_window", tables: ["rows"], kind: "append-only" } }],
    startsMidChain: true,
    configSchema: z.object({}),
    migrations: [{ id: "001", sql: "CREATE TABLE raise_window.rows (height bigint PRIMARY KEY)" }],
    points: {
      async "on-after-db-write"(_p, b) {
        if (b.height === height - 1n) raised = true;
      },
    },
  };
  return {
    core: { retainedFrom: (_revisions: readonly CoreRevision[], h: bigint) => (raised && h >= height ? h - 1n : h) },
    user: [module],
    window: (h) => (h >= Number(height) ? h - 1 : h),
  };
}

/**
 * `host` whose restart first waits until every apply marked ahead that was sent has been answered or has failed, so
 * that the result of an apply ahead sent before a refused eviction's restart comes from the thread the restart ends
 * (otherwise the restart fails it in flight). `restarts` counts the restarts asked.
 */
export function restartAfterAheads(host: LedgerHost): LedgerHost {
  const aheads: Promise<unknown>[] = [];
  return new Proxy(host, {
    get(target, name) {
      if (name === "apply") {
        return (input: Parameters<LedgerHost["apply"]>[0], read?: Parameters<LedgerHost["apply"]>[1]) => {
          const applying = target.apply(input, read);
          if (input.ahead === true) aheads.push(applying.catch(() => undefined));
          return applying;
        };
      }
      if (name === "restart") {
        return async () => {
          await Promise.all(aheads);
          await target.restart();
        };
      }
      const value: unknown = Reflect.get(target, name, target);
      return typeof value === "function" ? (value as (...args: unknown[]) => unknown).bind(target) : value;
    },
  });
}

/** The keys `run` had the worker evict at `height`, as a set of hex keys. */
export const evictedAt = (run: DagRun, height: number): Set<string> => new Set(run.evicted.get(BigInt(height)) ?? []);

/** Whether `run`'s batch of `height` holds again a node of `keys`. */
export const holdsAgain = (run: DagRun, height: number, keys: ReadonlySet<string>): boolean =>
  (run.batches.get(BigInt(height))?.inserts ?? []).some((node) => keys.has(hex(node.key)));

/**
 * Each core module as the process gets it (`DagRunOptions.modules`), `core-ledger-state`'s `on-compute` at `height`
 * given a read whose first statement throws `connection-lost`, once: the callback fails after it looked at the apply
 * ahead of its block and before it read the block before, and the process makes the height again after its back-off.
 */
export function losesComputeReadOnce(height: bigint): (module: ModuleDeclaration) => ModuleDeclaration {
  let lost = false;
  return (module) => {
    const compute = module.points["on-compute"];
    if (module.id !== CORE_LEDGER_STATE_ID || compute === undefined) return module;
    const points: ModuleDeclaration["points"] = {
      ...module.points,
      async "on-compute"(p, b, read, out) {
        if (b.height !== height || lost) return compute(p, b, read, out);
        const losing = {
          height: read.height,
          async query(...args: Parameters<typeof read.query>) {
            if (lost) return read.query(...args);
            lost = true;
            throw new UmbraError("connection-lost", `the read's connection was lost at the on-compute of block ${height} (the test's)`);
          },
        };
        return compute(p, b, losing, out);
      },
    };
    return { ...module, points };
  };
}

/**
 * A loop whose {@link FinalizedLoop.ahead} still gives a height's block context once it gave it, also when the source no
 * longer has that height prepared: the node source drops what it prepared above a height made again, while the
 * interface (`BlockSource.ahead`) lets a source keep it. So the settle of a height made again finds the next block.
 */
export function keepsAheadLoop(): new (input: LoopInput) => FinalizedLoop {
  const given = new Map<string, NonNullable<ReturnType<FinalizedLoop["ahead"]>>>();
  return class KeepsAhead extends FinalizedLoop {
    override ahead(height: bigint, part: string): ReturnType<FinalizedLoop["ahead"]> {
      const context = super.ahead(height, part);
      if (context !== null) given.set(`${part} ${height}`, context);
      return context ?? given.get(`${part} ${height}`) ?? null;
    }
  };
}

/**
 * `core-ledger-state`'s rules for a net write of `height` that loses its connection once (as {@link losesNetWriteOnce})
 * and a retention window raised at that moment: L(h), the lowest height retained after h, is h before, and h − 1 for
 * the heights above `height` from then on. So the apply ahead of `height` + 1 that the first settle of `height` sent
 * releases the state after `height`, and the input of that block built after the loss releases none. `window` is L for
 * the checks.
 */
export function windowRaisedWhenNetWriteLost(height: bigint): {
  readonly core: Pick<CoreLedgerStateOptions, "retainedFrom" | "nodeWriter">;
  readonly window: (h: number) => number;
} {
  let lost = false;
  return {
    core: {
      retainedFrom: (_revisions: readonly CoreRevision[], h: bigint) => (lost && h > height ? h - 1n : h),
      nodeWriter: (w, at) =>
        at !== height || lost
          ? w
          : ({
              async execute(...args: Parameters<BlockWriteHandle["execute"]>) {
                if (lost) return w.execute(...args);
                lost = true;
                throw new UmbraError("connection-lost", `the writer's connection was lost at the net write of block ${height} (the test's)`);
              },
            } as Pick<BlockWriteHandle, "execute">),
    },
    window: (h) => (h > Number(height) ? h - 1 : h),
  };
}

/**
 * `host` arming the test package's failing release (`RefusalData.releaseFailsAt`, through `counters`) when the apply of
 * `height` marked ahead is sent, so that this apply fails after the engine persisted the new state's key, and no apply
 * at a block's turn does.
 */
export function failsAheadAfterPersist(height: bigint, counters: SharedArrayBuffer): (host: LedgerHost) => LedgerHost {
  return (host) =>
    new Proxy(host, {
      get(target, name) {
        if (name === "apply") {
          return (input: Parameters<LedgerHost["apply"]>[0], read?: Parameters<LedgerHost["apply"]>[1]) => {
            if (input.ahead === true && input.height === height) Atomics.store(new Int32Array(counters), COUNTERS.releaseArmed, 1);
            return target.apply(input, read);
          };
        }
        const value: unknown = Reflect.get(target, name, target);
        return typeof value === "function" ? (value as (...args: unknown[]) => unknown).bind(target) : value;
      },
    });
}
