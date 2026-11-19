import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { z } from "zod";
import { writeBlockRow, writeHashRow } from "../../src/backbone/core-block-commit/core-block-commit.js";
import type { BlockWriteHandle, Database, Transaction } from "../../src/db/api.js";
import { UmbraError } from "../../src/db/errors.js";
import type { BlockContext, ModuleDeclaration } from "../../src/modules/declaration.js";
import type { EntryRange } from "../../src/modules/graph.js";
import type { BlockRef } from "../../src/runner/block-source.js";
import { type CommitOutcome, FinalizedLoop, type HeightRun, type HeldHeight, type LoopInput } from "../../src/runner/loop.js";
import { entry } from "../modules/graph-fixtures.js";
import { continuesModule, type COptions, H, HEAD, loggingFollower, losingCommits } from "./block-continues-harness.js";
import { type ChainBlock, chainOf, finalized, opening, RUNTIME } from "../backbone/fetch-fixtures.js";
import { halted, ingest, PATIENCE_MS, slow } from "../backbone/ingest-harness.js";
import { cursorOf, InMemoryBlockSource, LOOP_BACKBONE, loopInput, RUNNER_BACKENDS, startWith } from "./loop-harness.js";
import { PROCESS_BACKENDS } from "./process-backends.js";

/**
 * What the finalized loop (`src/runner/loop.ts`) tells the follower of each block's transaction
 * (`LoopInput.follower`: the process's ledger worker host when it has one), on PostgreSQL 18 and PGlite 0.5.10. Each
 * fact is told once, where it happens, for heights 1 to 5, h = 3 the one a test interrupts:
 * - `written h` when h's body ended (its `on-db-write` and `on-settle` callbacks and the cursor check), before its
 *   `COMMIT`; `committed h` once that `COMMIT` answered, before h's `on-after-db-write`;
 * - a `COMMIT` lost before it landed: nothing at the failure; `rolledBack h` once the next run's cursor read says it
 *   did not commit, then h made again is written and committed;
 * - a `COMMIT` lost after it landed: nothing at the failure; `committed h` once the next run's cursor read finds it;
 * - a failure before h's body ended (held for a retry, or halting): `rolledBack h` at the failure, never written;
 * - the lockstep wait stopping the loop before h's transaction: `rolledBack h`;
 * - a failure after the commit (`on-after-db-write`): `committed h` only;
 * - the re-delivery at a run's start: `committed c` for the cursor's block, before its `on-after-db-write`;
 * - a cursor neither committed nor not committed after a lost `COMMIT` (another writer changed it): the loop halts and
 *   tells neither `committed` nor `rolledBack`, since it does not know what became of the transaction;
 * - a block transaction whose cursor check rejects the cursor: `rolledBack h` once, never `written h`;
 * - a failure at any point before the `COMMIT` (`on-fetch`, `on-parse`, `on-compute`, `on-db-write`, `on-settle`), or a
 *   `COMMIT` the database refused: `rolledBack h` exactly once (after `written h` for the refused `COMMIT`, whose body
 *   ended);
 * - a cursor read after a `COMMIT` lost before or after it landed that fails itself: nothing told until a later run's
 *   read succeeds, which tells `rolledBack h` or `committed h`;
 * - a misuse (a kept write handle used) while h's `COMMIT` runs, that `COMMIT` landing with its answer lost: the misuse
 *   is the failure reported and halts, and nothing of h's outcome is told, since the loop does not know it; the next
 *   start tells `committed h` at its re-delivery;
 * - a failure in `on-start-height` of an entry starting at h: `rolledBack h`, never written; in `on-stop-height` of an
 *   entry stopping at h, after the commit: `committed h` only;
 * - a stop while a height is held with its `COMMIT`'s answer lost: nothing told; the next start re-delivers the
 *   cursor's block and tells it committed, h when the `COMMIT` landed, h − 1 when it did not (and h is then made again);
 * - through the process over the node source, whose queue prepares heights ahead of the loop: a failure in h's
 *   `on-fetch` or `on-parse` there: `rolledBack h` once the loop takes h, never written;
 * - a retryable failure after the commit (in `on-after-db-write`), then the same loop's next run: `committed h` once,
 *   not again at that run's re-delivery of h, which this loop released already.
 * The loop also logs `COMMIT answered h` when h's block transaction resolved and `cursor read <outcome> h` after a lost
 * `COMMIT`, so each fact's place is seen.
 */

describe.each(RUNNER_BACKENDS)("what the loop tells the transaction's follower on $name", (backend) => {
  beforeAll(() => backend.start(), 180_000);
  afterAll(() => backend.stop(), 60_000);

  /** Module `c` over a fresh database able to lose a `COMMIT`, and loops over it telling a logging follower. */
  async function setUp(
    options: COptions = {},
    head: bigint = HEAD,
    more: Partial<LoopInput> = {},
    build: {
      readonly backbone?: readonly ModuleDeclaration[];
      readonly modules?: (log: string[]) => readonly ModuleDeclaration[];
      /** The entries of those modules: each from 1 unless given. */
      readonly entries?: readonly EntryRange[];
      /** The loops' database over the one that can lose a `COMMIT`. */
      readonly wrap?: (db: Database) => Database;
    } = {},
  ) {
    const { db: raw } = await backend.database();
    const log: string[] = [];
    const losing = losingCommits(raw);
    const others = build.modules?.(log) ?? [];
    const started = await startWith(
      raw,
      [continuesModule(log, options), ...others],
      [entry("c", 1), ...(build.entries ?? others.map((module) => entry(module.id, 1)))],
      build.backbone === undefined ? {} : { backbone: build.backbone },
    );
    const source = new InMemoryBlockSource({ head });
    /** A loop logging where its block transactions resolved and what its cursor reads after a lost `COMMIT` said. */
    class Logging extends FinalizedLoop {
      protected override async commit(run: HeightRun): Promise<void> {
        await super.commit(run);
        log.push(`COMMIT answered ${run.height}`);
      }

      protected override commitOutcome(held: HeldHeight, cursor: BlockRef | null): CommitOutcome {
        const outcome = super.commitOutcome(held, cursor);
        log.push(`cursor read ${outcome} ${held.run.height}`);
        return outcome;
      }
    }
    const loopOf = () => {
      const stop = new AbortController();
      const db = build.wrap?.(losing.db) ?? losing.db;
      const input: LoopInput = { ...loopInput(started, source, stop), db, follower: loggingFollower(log), ...more };
      return { loop: new Logging(input), stop };
    };
    /** One run of a loop: its failure or end, or — once it waits for a head above the source's, stopped — undefined. */
    const run = async ({ loop, stop }: ReturnType<typeof loopOf>): Promise<unknown> => {
      const running = loop.run().then(
        (end) => (end.kind === "signal" && !stop.signal.aborted ? end : undefined),
        (error: unknown) => error,
      );
      if ((await Promise.race([source.waiting(source.head).then(() => "waiting" as const), running])) === "waiting") stop.abort();
      return running;
    };
    return { raw, log, losing, source, loopOf, run };
  }

  /** The follower's facts and the loop's two markers, in order. */
  const told = (log: readonly string[]): string[] =>
    log.filter((line) => line.startsWith("told ") || line.startsWith("COMMIT answered ") || line.startsWith("cursor read "));

  /** What an uninterrupted height h gives. */
  const plain = (h: bigint): string[] => [`told written ${h}`, `COMMIT answered ${h}`, `told committed ${h}`];

  it("each height: written once its body ended, committed once its COMMIT answered, before its on-after-db-write", async () => {
    const { raw, log, loopOf, run } = await setUp();
    expect(await run(loopOf())).toBeUndefined();
    expect(told(log)).toEqual([1n, 2n, 3n, 4n, 5n].flatMap(plain));
    for (let h = 1n; h <= HEAD; h++) {
      expect(log.indexOf(`told written ${h}`)).toBeGreaterThan(log.indexOf(`c on-db-write@${h} ${String(h > 1n)}`));
      expect(log.indexOf(`told committed ${h}`)).toBeLessThan(log.indexOf(`c on-after-db-write@${h} ${String(h > 1n)}`));
    }
    expect(await cursorOf(raw)).toBe(HEAD);
  }, 60_000);

  it("a COMMIT lost before it landed: nothing at the failure, rolledBack after the next run's cursor read, then h written and committed once", async () => {
    const armed = { done: false };
    const { raw, log, losing, loopOf, run } = await setUp({
      atWrite: (height) => {
        if (height === H && !armed.done) {
          armed.done = true;
          losing.state.armed = "lost";
        }
      },
    });
    const made = loopOf();
    expect(await run(made)).toMatchObject({ height: H, committed: false });
    expect(told(log)).toEqual([...plain(1n), ...plain(2n), `told written ${H}`]);
    expect(await run(made)).toBeUndefined();
    expect(told(log)).toEqual([
      ...plain(1n),
      ...plain(2n),
      `told written ${H}`,
      `cursor read not-committed ${H}`,
      `told rolledBack ${H}`,
      ...plain(H),
      ...plain(4n),
      ...plain(5n),
    ]);
    expect(await cursorOf(raw)).toBe(HEAD);
  }, 60_000);

  it("a COMMIT lost after it landed: nothing at the failure, committed once the next run's cursor read finds it", async () => {
    const armed = { done: false };
    const { raw, log, losing, loopOf, run } = await setUp({
      atWrite: (height) => {
        if (height === H && !armed.done) {
          armed.done = true;
          losing.state.armed = "landed";
        }
      },
    });
    const made = loopOf();
    expect(await run(made)).toMatchObject({ height: H, committed: false });
    expect(await run(made)).toBeUndefined();
    expect(told(log)).toEqual([
      ...plain(1n),
      ...plain(2n),
      `told written ${H}`,
      `cursor read committed ${H}`,
      `told committed ${H}`,
      ...plain(4n),
      ...plain(5n),
    ]);
    expect(await cursorOf(raw)).toBe(HEAD);
  }, 60_000);

  it("a failure before h's body ended: rolledBack at the failure, never written; held for a retry, h is written and committed in the next run", async () => {
    const faults = new Map([[`on-db-write@${H}`, new UmbraError("connection-lost", "the writer's connection was lost")]]);
    const { raw, log, loopOf, run } = await setUp({ faults });
    const made = loopOf();
    expect(await run(made)).toMatchObject({ height: H, committed: false });
    expect(told(log)).toEqual([...plain(1n), ...plain(2n), `told rolledBack ${H}`]);
    expect(await run(made)).toBeUndefined();
    expect(told(log)).toEqual([
      ...plain(1n),
      ...plain(2n),
      `told rolledBack ${H}`,
      `cursor read not-committed ${H}`,
      ...plain(H),
      ...plain(4n),
      ...plain(5n),
    ]);
    expect(await cursorOf(raw)).toBe(HEAD);
  }, 60_000);

  it("a failure that halts before h's transaction: rolledBack, never written", async () => {
    const faults = new Map([[`on-compute@${H}`, new Error("c cannot compute h")]]);
    const { raw, log, loopOf, run } = await setUp({ faults });
    expect(await run(loopOf())).toMatchObject({ height: H, committed: false, point: "on-compute", module: "c" });
    expect(told(log)).toEqual([...plain(1n), ...plain(2n), `told rolledBack ${H}`]);
    expect(await cursorOf(raw)).toBe(H - 1n);
  }, 60_000);

  it("the lockstep wait stopping the loop before h's transaction: rolledBack, never written", async () => {
    const lockstep = { wait: async (height: bigint) => height !== H };
    const { raw, log, loopOf, run } = await setUp({}, HEAD, { lockstep });
    expect(await run(loopOf())).toEqual({ kind: "signal" });
    expect(told(log)).toEqual([...plain(1n), ...plain(2n), `told rolledBack ${H}`]);
    expect(await cursorOf(raw)).toBe(H - 1n);
  }, 60_000);

  it("a failure after the commit, in on-after-db-write: committed once, nothing more", async () => {
    const faults = new Map([[`on-after-db-write@${H}`, new Error("c cannot finish h")]]);
    const { raw, log, loopOf, run } = await setUp({ faults });
    expect(await run(loopOf())).toMatchObject({ height: H, committed: true, point: "on-after-db-write", module: "c" });
    expect(told(log)).toEqual([...plain(1n), ...plain(2n), ...plain(H)]);
    expect(await cursorOf(raw)).toBe(H);
  }, 60_000);

  it("the re-delivery at a run's start: committed for the cursor's block, before its on-after-db-write", async () => {
    const { raw, log, source, loopOf, run } = await setUp({}, H);
    expect(await run(loopOf())).toBeUndefined();
    source.finalize(HEAD);
    log.push("the next run");
    expect(await run(loopOf())).toBeUndefined();
    const next = log.slice(log.indexOf("the next run"));
    expect(told(next)).toEqual([`told committed ${H}`, ...plain(4n), ...plain(5n)]);
    expect(next.indexOf(`told committed ${H}`)).toBeLessThan(next.indexOf(`c on-after-db-write@${H} false`));
    expect(await cursorOf(raw)).toBe(HEAD);
  }, 60_000);
  it("a cursor neither committed nor not committed after a lost COMMIT (another writer changed it): a halt, and neither committed nor rolledBack is told", async () => {
    for (const how of ["lost", "landed"] as const) {
      const armed = { done: false };
      const { raw, log, losing, loopOf, run } = await setUp({
        atWrite: (height) => {
          if (height === H && !armed.done) {
            armed.done = true;
            losing.state.armed = how;
          }
        },
      });
      const made = loopOf();
      expect(await run(made)).toMatchObject({ height: H, committed: false });
      // Another writer, while the connection was away: the cursor is neither h nor h − 1.
      await raw.transaction(async (tx) => {
        if (how === "lost") {
          await tx.execute(`DELETE FROM core_block_commit.hashes WHERE height = ${H - 1n}`);
          await tx.execute(`DELETE FROM core_block_commit.blocks WHERE height = ${H - 1n}`);
        } else {
          await tx.execute(`UPDATE core_block_commit.blocks SET hash = $1 WHERE height = ${H}`, [new Uint8Array(32).fill(7)]);
        }
      });
      const failure = await run(made);
      expect(failure, how).toMatchObject({ height: H });
      expect(String((failure as { cause?: unknown }).cause), how).toContain("another writer changed the database");
      expect(told(log), how).toEqual([...plain(1n), ...plain(2n), `told written ${H}`, `cursor read unexpected ${H}`]);
    }
  }, 120_000);

  it("a cursor check that rejects the block transaction's cursor: rolledBack once, never written", async () => {
    // A core-block-commit that stores another hash for h: the cursor is h with another hash.
    const backbone = LOOP_BACKBONE.map((part) =>
      part.id !== "core-block-commit"
        ? part
        : ({
            ...part,
            points: {
              async "on-db-write"(_p: unknown, b: BlockContext, w: BlockWriteHandle) {
                const block = b.height === H ? { ...b, hash: new Uint8Array(32).fill(9) } : b;
                await writeBlockRow(w, block);
                await writeHashRow(w, block);
              },
            },
          } as ModuleDeclaration),
    );
    const { raw, log, loopOf, run } = await setUp({}, HEAD, {}, { backbone });
    expect(await run(loopOf())).toMatchObject({ height: H, committed: false });
    expect(told(log)).toEqual([...plain(1n), ...plain(2n), `told rolledBack ${H}`]);
    expect(await cursorOf(raw)).toBe(H - 1n);
  }, 60_000);

  it("a failure at each point before the COMMIT: rolledBack exactly once, never written", async () => {
    for (const point of ["on-fetch", "on-parse", "on-compute", "on-db-write", "on-settle"] as const) {
      const faults = new Map([[`${point}@${H}`, new Error(`c cannot ${point} h`)]]);
      const settling = (log: string[]): readonly ModuleDeclaration[] => [settlingModule(log, point === "on-settle" ? H : null)];
      const { raw, log, loopOf, run } = await setUp(point === "on-settle" ? {} : { faults }, HEAD, {}, { modules: settling });
      expect(await run(loopOf()), point).toMatchObject({ height: H, committed: false, point });
      expect(told(log), point).toEqual([...plain(1n), ...plain(2n), `told rolledBack ${H}`]);
      expect(await cursorOf(raw), point).toBe(H - 1n);
    }
  }, 180_000);

  it("a COMMIT the database refused (a deferred constraint): written, then rolledBack exactly once", async () => {
    const { raw, log, loopOf, run } = await setUp({}, HEAD, {}, { modules: () => [deferredModule()] });
    const failure = await run(loopOf());
    expect(failure).toMatchObject({ height: H, committed: false });
    expect(told(log)).toEqual([...plain(1n), ...plain(2n), `told written ${H}`, `told rolledBack ${H}`]);
    expect(await cursorOf(raw)).toBe(H - 1n);
  }, 60_000);

  it.each(["lost", "landed"] as const)("a cursor read after a COMMIT lost (%s) that fails itself: nothing told then; the next run's read tells the outcome", async (how) => {
    const armed = { done: false };
    const { raw, log, losing, loopOf, run } = await setUp({
      atWrite: (height) => {
        if (height === H && !armed.done) {
          armed.done = true;
          losing.state.armed = how;
        }
      },
    });
    const made = loopOf();
    expect(await run(made)).toMatchObject({ height: H, committed: false });
    losing.state.failNext = true;
    // The cursor read of the next run fails: the height stays held, and nothing is told.
    expect(await run(made)).toMatchObject({ height: H, committed: false });
    expect(told(log)).toEqual([...plain(1n), ...plain(2n), `told written ${H}`]);
    expect(await run(made)).toBeUndefined();
    const outcome =
      how === "lost"
        ? [`cursor read not-committed ${H}`, `told rolledBack ${H}`, ...plain(H)]
        : [`cursor read committed ${H}`, `told committed ${H}`];
    expect(told(log)).toEqual([...plain(1n), ...plain(2n), `told written ${H}`, ...outcome, ...plain(4n), ...plain(5n)]);
    expect(await cursorOf(raw)).toBe(HEAD);
  }, 60_000);

  it("a misuse while h's COMMIT runs, the COMMIT landed with its answer lost: the misuse halts, the follower is told nothing of h's outcome, and the next start tells h committed", async () => {
    const keeper: { w?: BlockWriteHandle; misuse: boolean } = { misuse: false };
    // After the loop's body ended and before the COMMIT: a use of the write handle module k kept (a timer of its).
    const wrap = (db: Database): Database => ({
      read: (body, options) => db.read(body, options),
      transaction: <T>(body: (tx: Transaction) => Promise<T>): Promise<T> =>
        db.transaction(async (tx) => {
          const value = await body(tx);
          if (keeper.misuse) {
            keeper.misuse = false;
            await keeper.w?.execute("SELECT 1").catch(() => undefined);
          }
          return value;
        }),
      writerSession: () => db.writerSession(),
      close: () => db.close(),
    });
    const armed = { done: false };
    const { raw, log, losing, loopOf, run } = await setUp(
      {
        atWrite: (height) => {
          if (height === H && !armed.done) {
            armed.done = true;
            losing.state.armed = "landed";
            keeper.misuse = true;
          }
        },
      },
      HEAD,
      {},
      { modules: () => [keepingModule(keeper)], wrap },
    );
    const failure = await run(loopOf());
    expect(failure).toMatchObject({ height: H, committed: false });
    expect(String((failure as { cause?: unknown }).cause)).toContain("handle");
    expect(told(log)).toEqual([...plain(1n), ...plain(2n), `told written ${H}`]);
    // h committed: the next start re-delivers it and tells it committed.
    expect(await cursorOf(raw)).toBe(H);
    log.push("the next start");
    expect(await run(loopOf())).toBeUndefined();
    expect(told(log.slice(log.indexOf("the next start")))).toEqual([`told committed ${H}`, ...plain(4n), ...plain(5n)]);
  }, 60_000);

  it("a failure in on-start-height of an entry starting at h: rolledBack, never written", async () => {
    const { raw, log, loopOf, run } = await setUp({}, HEAD, {}, { modules: () => [edgeModule({ start: H })], entries: [entry("e", Number(H))] });
    expect(await run(loopOf())).toMatchObject({ height: H, committed: false, point: "on-start-height", module: "e" });
    expect(told(log)).toEqual([...plain(1n), ...plain(2n), `told rolledBack ${H}`]);
    expect(await cursorOf(raw)).toBe(H - 1n);
  }, 60_000);

  it("a failure in on-stop-height of an entry stopping at h: committed once, nothing more", async () => {
    const { raw, log, loopOf, run } = await setUp({}, HEAD, {}, { modules: () => [edgeModule({ stop: H })], entries: [entry("e", 1, Number(H))] });
    expect(await run(loopOf())).toMatchObject({ height: H, committed: true, point: "on-stop-height", module: "e" });
    expect(told(log)).toEqual([...plain(1n), ...plain(2n), ...plain(H)]);
    expect(await cursorOf(raw)).toBe(H);
  }, 60_000);

  it("a stop while a height is held with its COMMIT's answer lost: nothing told; the next start tells the cursor's block committed at its re-delivery", async () => {
    for (const how of ["landed", "lost"] as const) {
      const armed = { done: false };
      const { raw, log, losing, loopOf, run } = await setUp({
        atWrite: (height) => {
          if (height === H && !armed.done) {
            armed.done = true;
            losing.state.armed = how;
          }
        },
      });
      expect(await run(loopOf()), how).toMatchObject({ height: H, committed: false });
      // The process stops during its back-off: that loop never runs again, and the follower was told nothing of h's
      // outcome.
      expect(told(log), how).toEqual([...plain(1n), ...plain(2n), `told written ${H}`]);
      log.push("the next start");
      expect(await run(loopOf()), how).toBeUndefined();
      const next = told(log.slice(log.indexOf("the next start")));
      const rest = how === "landed" ? [`told committed ${H}`] : [`told committed ${H - 1n}`, ...plain(H)];
      expect(next, how).toEqual([...rest, ...plain(4n), ...plain(5n)]);
      expect(await cursorOf(raw), how).toBe(HEAD);
    }
  }, 120_000);

  it("a retryable failure in on-after-db-write, then the same loop's next run: committed once, not told again at that run's re-delivery", async () => {
    const faults = new Map([[`on-after-db-write@${H}`, new UmbraError("connection-lost", "the connection was lost (the test's fault)")]]);
    const { raw, log, loopOf, run } = await setUp({ faults });
    const made = loopOf();
    expect(await run(made)).toMatchObject({ height: H, committed: true });
    expect(await run(made)).toBeUndefined();
    expect(told(log)).toEqual([...plain(1n), ...plain(2n), ...plain(H), ...plain(4n), ...plain(5n)]);
    // The re-delivery ran h's on-after-db-write again.
    expect(log.filter((line) => line.startsWith(`c on-after-db-write@${H} `))).toHaveLength(2);
    expect(await cursorOf(raw)).toBe(HEAD);
  }, 60_000);
});

/** Module `s`, which declares `on-settle` and fails there at `failAt` (none when null). */
function settlingModule(log: string[], failAt: bigint | null): ModuleDeclaration {
  return {
    id: "s",
    version: "1.0.0",
    side: "public",
    requires: ["block-header"],
    provides: [{ name: "s-rows", lifetimes: ["table"], table: { schema: "s", tables: ["rows"], kind: "append-only" } }],
    startsMidChain: true,
    configSchema: z.object({}),
    migrations: [{ id: "001", sql: "CREATE TABLE s.rows (height bigint PRIMARY KEY)" }],
    points: {
      async "on-settle"(_p, run, w) {
        log.push(`s on-settle@${run.last}`);
        if (run.last === failAt) throw new Error("s cannot settle h");
        await w.execute("INSERT INTO s.rows (height) VALUES ($1)", [run.last]);
      },
    },
  };
}

/** Module `d`, whose table's deferred unique key refuses h's `COMMIT`: its `on-db-write` writes one key twice at h. */
function deferredModule(): ModuleDeclaration {
  return {
    id: "d",
    version: "1.0.0",
    side: "public",
    requires: ["block-header"],
    provides: [{ name: "d-rows", lifetimes: ["table"], table: { schema: "d", tables: ["rows"], kind: "append-only" } }],
    startsMidChain: true,
    configSchema: z.object({}),
    migrations: [
      {
        id: "001",
        sql: "CREATE TABLE d.rows (height bigint PRIMARY KEY, k bigint NOT NULL, CONSTRAINT rows_k UNIQUE (k) DEFERRABLE INITIALLY DEFERRED)",
      },
    ],
    points: {
      async "on-db-write"(_p, b, w) {
        await w.execute("INSERT INTO d.rows (height, k) VALUES ($1, $1)", [b.height]);
        // At h a second row with the key of h − 1: refused only when the transaction commits.
        if (b.height === H) await w.execute("UPDATE d.rows SET k = $1 WHERE height = $2", [H - 1n, b.height]);
      },
    },
  };
}

/** Through the process over the node source and a tape node, whose queue prepares heights ahead of the loop. */
describe.each(PROCESS_BACKENDS)("what the loop tells the follower of a height the node source prepared, through the process on $name", (backend) => {
  beforeAll(() => backend.start(), 180_000);
  afterAll(() => backend.stop(), 60_000);

  const LAST = 8;

  it.each(["on-fetch", "on-parse"] as const)("a failure in %s of h, run in the source's queue: rolledBack h once when the loop reaches h, never written", async (point) => {
    const db = await backend.database();
    const chain = chainOf(BigInt(LAST));
    const records = [
      ...opening(chain[0] as ChainBlock, chain[LAST] as ChainBlock),
      ...chain.slice(1).flatMap((block, index) => finalized(block, RUNTIME, index === 0)),
    ];
    const log: string[] = [];
    /** The process's loop, telling a logging follower. */
    class Following extends FinalizedLoop {
      constructor(input: LoopInput) {
        super({ ...input, follower: loggingFollower(log) });
      }
    }
    // A slow on-compute keeps the loop behind the prefetch, so h is prepared ahead of it.
    const run = await ingest(db, records, {
      start: 1n,
      settings: { prefetchWindow: 8 },
      user: [failingAt(point, H), slow(20)],
      loop: Following,
    });
    let status: unknown;
    try {
      await halted(run);
      status = run.handle.status();
    } finally {
      await run.close();
    }
    expect(status).toMatchObject({ state: "halted", cursor: H - 1n });
    expect(log.filter((line) => line.startsWith("told "))).toEqual([
      "told written 1",
      "told committed 1",
      "told written 2",
      "told committed 2",
      `told rolledBack ${H}`,
    ]);
  }, PATIENCE_MS * 2);
});

/** Module `f`, which fails at `point` of `height` every time it runs there (the queue may prepare a height twice). */
function failingAt(point: "on-fetch" | "on-parse", height: bigint): ModuleDeclaration {
  const fail = (b: BlockContext): void => {
    if (b.height === height) throw new Error(`f cannot ${point} ${height}`);
  };
  return {
    id: "f",
    version: "1.0.0",
    side: "public",
    requires: ["block-header"],
    provides: [{ name: "f-rows", lifetimes: ["table"], table: { schema: "f", tables: ["rows"], kind: "append-only" } }],
    startsMidChain: true,
    configSchema: z.object({}),
    migrations: [{ id: "001", sql: "CREATE TABLE f.rows (height bigint PRIMARY KEY)" }],
    points: point === "on-fetch" ? { async "on-fetch"(_p, b) { fail(b); } } : { async "on-parse"(_p, b) { fail(b); } },
  };
}

/** Module `k`, which keeps the block write handle of its `on-db-write` in `keeper` (a module that leaves a timer behind). */
function keepingModule(keeper: { w?: BlockWriteHandle }): ModuleDeclaration {
  return {
    id: "k",
    version: "1.0.0",
    side: "public",
    requires: ["block-header"],
    provides: [{ name: "k-rows", lifetimes: ["table"], table: { schema: "k", tables: ["rows"], kind: "append-only" } }],
    startsMidChain: true,
    configSchema: z.object({}),
    migrations: [{ id: "001", sql: "CREATE TABLE k.rows (height bigint PRIMARY KEY)" }],
    points: {
      async "on-db-write"(_p, _b, w) {
        keeper.w = w;
      },
    },
  };
}

/** Module `e`, whose `on-start-height` fails at `failAt.start` and whose `on-stop-height` fails at `failAt.stop`. */
function edgeModule(failAt: { readonly start?: bigint; readonly stop?: bigint }): ModuleDeclaration {
  return {
    id: "e",
    version: "1.0.0",
    side: "public",
    requires: ["block-header"],
    provides: [{ name: "e-rows", lifetimes: ["table"], table: { schema: "e", tables: ["rows"], kind: "append-only" } }],
    startsMidChain: true,
    configSchema: z.object({}),
    migrations: [{ id: "001", sql: "CREATE TABLE e.rows (height bigint PRIMARY KEY)" }],
    points: {
      async "on-start-height"(_p, at) {
        if (at.height === failAt.start) throw new Error("e cannot start at h");
      },
      async "on-stop-height"(_p, at) {
        if (at.height === failAt.stop) throw new Error("e cannot stop at h");
      },
    },
  };
}
