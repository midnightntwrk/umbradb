import { afterAll, beforeAll, describe, expect, it } from "vitest";
import type { BlockWriteHandle, ReadHandle, ReadOnlyDatabase, Transaction } from "../../src/db/api.js";
import { UmbraError } from "../../src/db/errors.js";
import { readOnlyDatabase } from "../../src/db/read-only.js";
import type {
  BlockContext,
  ItemSink,
  ModuleDeclaration,
  PointName,
  ProcessContext,
} from "../../src/modules/declaration.js";
import { resolveGraph } from "../../src/modules/graph.js";
import { validateDeclarations } from "../../src/modules/validation.js";
import { BlockItems } from "../../src/runner/block-context.js";
import { CallbackFailure } from "../../src/runner/dispatch.js";
import { inMemoryBlock } from "../../src/runner/in-memory-source.js";
import { FinalizedLoop, HeightFailure, type HeightRun, runFinalized } from "../../src/runner/loop.js";
import { declaration } from "../modules/declarations.js";
import { blockItem, consumer, entry } from "../modules/graph-fixtures.js";
import { Contexts } from "./fixtures.js";
import {
  cursorOf,
  failureOf,
  heightsIn,
  InMemoryBlockSource,
  LOOP_BACKBONE,
  type LoopClass,
  loopInput,
  recordingModule,
  RUNNER_BACKENDS,
  runUntilWaiting,
  type SeenCall,
  type Started,
  startWith,
} from "./loop-harness.js";

/**
 * The finalized loop (task 5.2; RN-1, RN-2, RN-4, RN-5, RN-8's typed failure, RN-14; `design.md` §2, §3) through an
 * in-memory block source and the real cursor table, on both backends: A36 (the points of RN-1 per height), A37 (every row
 * in a module's or a backbone part's schema, written through a handle), A39 (each point's handle), A40 (the item sink).
 * A41 and A49 (one transaction per height, none while waiting) are `catch-up.test.ts`.
 */

/** A module requiring `requires` whose `points` are given; one table `<schema>.rows (height)` unless `rest` says not. */
function mod(id: string, points: ModuleDeclaration["points"], rest: Partial<ModuleDeclaration> = {}): ModuleDeclaration {
  return declaration(id, { points, ...rest });
}

/** `HeightFailure`'s fields, for one assertion. */
function where(failure: unknown) {
  expect(failure).toBeInstanceOf(HeightFailure);
  expect((failure as HeightFailure).name).toBe("HeightFailure");
  const { height, point, module, committed } = failure as HeightFailure;
  return { height, point, module, committed };
}

/** The innermost cause of `error`. */
function rootCause(error: unknown): unknown {
  let cause = error;
  while (cause instanceof Error && cause.cause !== undefined) cause = cause.cause;
  return cause;
}

/** The first `UmbraError` in the chain of causes of `error`. */
function umbraCause(error: unknown): UmbraError | undefined {
  for (let cause = error; cause instanceof Error; cause = cause.cause) if (cause instanceof UmbraError) return cause;
  return undefined;
}

describe.each(RUNNER_BACKENDS)("the finalized loop on $name", (backend) => {
  beforeAll(() => backend.start(), 180_000);
  afterAll(() => backend.stop(), 60_000);

  describe("A36: RN-1's points for every height (RN-1)", () => {
    it("a recording module observes on-finalized once per new head, then each height's points in order", async () => {
      const { db } = await backend.database();
      const seen: SeenCall[] = [];
      const started = await startWith(db, [recordingModule("recorder", seen, declaration)], [entry("recorder", 1)]);
      const source = new InMemoryBlockSource({ head: 3n });
      await runUntilWaiting(started, source, 3n);
      const height = (h: number): string[] =>
        ["on-fetch", "on-parse", "on-compute", "on-db-write", "on-after-db-write"].map((p) => `${p}@${h}`);
      const calls = () => seen.map((c) => (c.height === undefined ? c.point : `${c.point}@${c.height}`));
      // on-start-db ran at startup (startDatabase); RN-1's scenario: head 3 on an empty database, S = 1.
      expect(calls()).toEqual(["on-start-db", "on-finalized@3", ...height(1), ...height(2), ...height(3)]);

      // The head rises: one on-finalized for the new head, before its heights, from the cursor on.
      source.finalize(5n);
      await runUntilWaiting(started, source, 5n);
      expect(calls().slice(17)).toEqual(["on-finalized@5", ...height(4), ...height(5)]);
      expect(seen.some((c) => c.point === "on-best-block" || c.point === "on-rollback")).toBe(false);
      expect(await heightsIn(db, "recorder.rows")).toEqual([1n, 2n, 3n, 4n, 5n]);
      expect(await cursorOf(db)).toBe(5n);
    }, 60_000);

    it("fires on-finalized again only for a higher head, and for a head reported while it catches up", async () => {
      const { db } = await backend.database();
      const seen: SeenCall[] = [];
      let source!: InMemoryBlockSource;
      const raiser = mod("raiser", {
        async "on-db-write"(_p, b) {
          if (b.height === 2n) source.finalize(6n);
        },
      });
      const started = await startWith(
        db,
        [recordingModule("recorder", seen, declaration), raiser],
        [entry("recorder", 1), entry("raiser", 1)],
      );
      source = new InMemoryBlockSource({ head: 3n });
      await runUntilWaiting(started, source, 6n);
      const finalized = seen.filter((c) => c.point === "on-finalized").map((c) => c.height);
      expect(finalized).toEqual([3n, 6n]);
      // Head 6 was announced after height 3, the last of head 3, and before height 4.
      const at = (point: PointName, h: bigint) => seen.findIndex((c) => c.point === point && c.height === h);
      expect(at("on-finalized", 6n)).toBeGreaterThan(at("on-after-db-write", 3n));
      expect(at("on-finalized", 6n)).toBeLessThan(at("on-fetch", 4n));
      // finalize with the same head is no new head.
      source.finalize(6n);
      await runUntilWaiting(started, source, 6n);
      expect(seen.filter((c) => c.point === "on-finalized")).toHaveLength(2);
    }, 60_000);

    it("announces only the new head when the head rises while it waits", async () => {
      const { db } = await backend.database();
      const seen: SeenCall[] = [];
      const started = await startWith(db, [recordingModule("recorder", seen, declaration)], [entry("recorder", 1)]);
      const source = new InMemoryBlockSource({ head: 2n });
      const controller = new AbortController();
      const running = new FinalizedLoop(loopInput(started, source, controller)).run();
      await source.waiting(2n);
      source.finalize(4n);
      await source.waiting(4n);
      controller.abort();
      await running;
      expect(seen.filter((c) => c.point === "on-finalized").map((c) => c.height)).toEqual([2n, 4n]);
      expect(await heightsIn(db, "recorder.rows")).toEqual([1n, 2n, 3n, 4n]);
    }, 60_000);

    it("runs RN-3's two scenarios through the loop: id order at on-db-write, a provider before its consumer", async () => {
      const { db } = await backend.database();
      const log: string[] = [];
      const logged = (id: string): ModuleDeclaration["points"] => ({
        async "on-compute"() {
          log.push(`${id} compute start`);
          await new Promise((resolve) => setTimeout(resolve, 5));
          log.push(`${id} compute end`);
        },
        async "on-db-write"() {
          log.push(`${id} write`);
        },
      });
      const provider = mod("provider", logged("provider"), { provides: [blockItem("p-item")] });
      const consumerMod = consumer("consumer", ["p-item"], { points: logged("consumer") });
      const started = await startWith(
        db,
        [mod("b-mod", logged("b-mod")), mod("a-mod", logged("a-mod")), consumerMod, provider],
        ["b-mod", "a-mod", "consumer", "provider"].map((id) => entry(id, 1)),
      );
      await runUntilWaiting(started, new InMemoryBlockSource({ head: 2n }), 2n);
      const writes = log.filter((line) => line.endsWith("write"));
      expect(writes).toEqual([1, 2].flatMap(() => ["a-mod write", "b-mod write", "provider write", "consumer write"]));
      for (const h of [0, 1]) {
        const height = log.filter((line) => line.includes("compute")).slice(h * 8, h * 8 + 8);
        expect(height.indexOf("consumer compute start")).toBeGreaterThan(height.indexOf("provider compute end"));
      }
    }, 60_000);

    it("waits while S is above the head, then starts at S", async () => {
      const { db } = await backend.database();
      const seen: SeenCall[] = [];
      const started = await startWith(db, [recordingModule("recorder", seen, declaration)], [entry("recorder", 10)], {
        start: 10n,
      });
      const source = new InMemoryBlockSource({ head: 5n });
      await runUntilWaiting(started, source, 9n);
      expect(seen.map((c) => c.point)).toEqual(["on-start-db"]);
      source.finalize(11n);
      await runUntilWaiting(started, source, 11n);
      expect(await heightsIn(db, "recorder.rows")).toEqual([10n, 11n]);
      expect(seen.filter((c) => c.point === "on-finalized").map((c) => c.height)).toEqual([11n]);
    }, 60_000);

    it("stops at once when stopped before it starts, processing nothing", async () => {
      const { db } = await backend.database();
      const seen: SeenCall[] = [];
      const started = await startWith(db, [recordingModule("recorder", seen, declaration)], [entry("recorder", 1)]);
      const controller = new AbortController();
      controller.abort();
      const loop = new FinalizedLoop({
        db,
        graph: started.graph,
        plan: started.plan,
        source: new InMemoryBlockSource({ head: 3n }),
        contextOf: (id) => started.contexts.of(id),
        signal: controller.signal,
      });
      await expect(loop.run()).resolves.toBeUndefined();
      expect(seen.map((c) => c.point)).toEqual(["on-start-db"]);
      expect(await cursorOf(db)).toBeNull();
    }, 60_000);
  });

  describe("A39: each point's handle (RN-4, design.md §2)", () => {
    /** What one callback was given. */
    interface Given {
      readonly point: PointName;
      readonly height: bigint;
      readonly args: number;
      readonly keys: string[];
      readonly handleHeight?: bigint | null;
      readonly rows?: bigint[];
      readonly items?: number;
    }

    const keysOf = (value: unknown): string[] => Object.keys(value as object).sort();

    function observing(given: Given[]): ModuleDeclaration {
      const rows = async (read: ReadHandle) =>
        (await read.query("SELECT height FROM observer.rows ORDER BY height")).map((row) => row.height as bigint);
      return mod("observer", {
        async "on-finalized"(...args: unknown[]) {
          const [, head, read] = args as [unknown, { height: bigint }, ReadHandle];
          given.push({ point: "on-finalized", height: head.height, args: args.length, keys: keysOf(read), handleHeight: read.height });
        },
        async "on-fetch"(...args: unknown[]) {
          const [, b, sink] = args as [unknown, BlockContext, ItemSink];
          given.push({ point: "on-fetch", height: b.height, args: args.length, keys: keysOf(sink) });
        },
        async "on-parse"(...args: unknown[]) {
          const [, b, sink] = args as [unknown, BlockContext, ItemSink];
          given.push({ point: "on-parse", height: b.height, args: args.length, keys: keysOf(sink) });
        },
        async "on-compute"(...args: unknown[]) {
          const [, b, read, sink] = args as [unknown, BlockContext, ReadHandle, ItemSink];
          given.push({
            point: "on-compute",
            height: b.height,
            args: args.length,
            keys: [...keysOf(read), ...keysOf(sink).map((k) => `sink.${k}`)],
            handleHeight: read.height,
            rows: await rows(read),
          });
        },
        async "on-db-write"(...args: unknown[]) {
          const [, b, w] = args as [unknown, BlockContext, BlockWriteHandle];
          await w.execute("INSERT INTO observer.rows (height) VALUES ($1)", [b.height]);
          given.push({ point: "on-db-write", height: b.height, args: args.length, keys: keysOf(w), handleHeight: w.height });
        },
        async "on-after-db-write"(...args: unknown[]) {
          const [, b, read] = args as [unknown, BlockContext, ReadHandle];
          given.push({
            point: "on-after-db-write",
            height: b.height,
            args: args.length,
            keys: keysOf(read),
            handleHeight: read.height,
            rows: await rows(read),
            items: b.items.size,
          });
        },
      });
    }

    /** Runs `observer` over heights 1–3 with a loop of `kind`; what each callback was given, and the failure if any. */
    async function observe(kind?: LoopClass): Promise<{ given: Given[]; failure: unknown }> {
      const { db } = await backend.database();
      const given: Given[] = [];
      const started = await startWith(db, [observing(given)], [entry("observer", 1)]);
      try {
        await runUntilWaiting(started, new InMemoryBlockSource({ head: 3n }), 3n, kind);
        return { given, failure: undefined };
      } catch (failure) {
        return { given, failure };
      }
    }

    /** A39's oracle for on-compute: its read reports h − 1 (null before the first commit) and holds no row of h. */
    function computeProblems(given: readonly Given[]): string[] {
      const computes = given.filter((g) => g.point === "on-compute");
      if (computes.length !== 3) return [`on-compute ran ${computes.length} times, not 3`];
      return computes.flatMap((g) => {
        const expected = g.height === 1n ? null : g.height - 1n;
        const problems: string[] = [];
        if (g.handleHeight !== expected) problems.push(`at ${g.height} the read reports ${g.handleHeight}, not ${expected}`);
        if (g.rows?.includes(g.height)) problems.push(`at ${g.height} the read sees the row written at ${g.height}`);
        return problems;
      });
    }

    it("gives each point the handle of design.md §2, at its height", async () => {
      const { given, failure } = await observe();
      expect(failure).toBeUndefined();
      const at = (point: PointName) => given.filter((g) => g.point === point);
      // on-finalized: a read handle at the cursor (null: nothing committed yet); (p, head, read).
      expect(at("on-finalized")).toEqual([
        { point: "on-finalized", height: 3n, args: 3, keys: ["height", "query"], handleHeight: null },
      ]);
      for (const h of [1n, 2n, 3n]) {
        const before = h === 1n ? null : h - 1n;
        const prior = Array.from({ length: Number(h) - 1 }, (_, i) => BigInt(i + 1));
        const of = (point: PointName) => at(point).find((g) => g.height === h);
        // on-fetch and on-parse: (p, b, sink), no database handle; the sink only puts.
        expect(of("on-fetch")).toEqual({ point: "on-fetch", height: h, args: 3, keys: ["put"] });
        expect(of("on-parse")).toEqual({ point: "on-parse", height: h, args: 3, keys: ["put"] });
        // on-compute: (p, b, read, sink), a read handle at h − 1 that holds no row of h.
        expect(of("on-compute")).toEqual({
          point: "on-compute",
          height: h,
          args: 4,
          keys: ["height", "query", "sink.put"],
          handleHeight: before,
          rows: prior,
        });
        // on-db-write: (p, b, w), the block write handle, reporting the cursor before the block.
        expect(of("on-db-write")).toEqual({
          point: "on-db-write",
          height: h,
          args: 3,
          keys: ["execute", "height", "query"],
          handleHeight: before,
        });
        // on-after-db-write: (p, b, read), a read handle at h holding h's row, and no block items.
        expect(of("on-after-db-write")).toEqual({
          point: "on-after-db-write",
          height: h,
          args: 3,
          keys: ["height", "query"],
          handleHeight: h,
          rows: [...prior, h],
          items: 0,
        });
      }
      expect(computeProblems(given)).toEqual([]);
    }, 60_000);

    it("on-finalized's read handle reports the cursor once a height has committed", async () => {
      const { db } = await backend.database();
      const reported: (bigint | null)[] = [];
      const m = mod("m", {
        async "on-finalized"(_p, head, read) {
          reported.push(read.height);
          // The head is announced as its height and hash only, frozen.
          expect(Object.keys(head)).toEqual(["height", "hash"]);
          expect(Object.isFrozen(head)).toBe(true);
        },
      });
      const started = await startWith(db, [m], [entry("m", 1)]);
      const source = new InMemoryBlockSource({ head: 2n });
      await runUntilWaiting(started, source, 2n);
      source.finalize(4n);
      await runUntilWaiting(started, source, 4n);
      expect(reported).toEqual([null, 2n]);
    }, 60_000);

    it("a write attempted from on-after-db-write fails and halts, with the height committed", async () => {
      const { db } = await backend.database();
      const w = mod("w", {
        async "on-after-db-write"(_p, b, read) {
          await read.query("INSERT INTO w.rows (height) VALUES ($1)", [b.height + 1000n]);
        },
      });
      const started = await startWith(db, [w], [entry("w", 1)]);
      const failure = await failureOf(started, new InMemoryBlockSource({ head: 3n }), 3n);
      expect(where(failure)).toEqual({ height: 1n, point: "on-after-db-write", module: "w", committed: true });
      expect((failure as HeightFailure).cause).toBeInstanceOf(CallbackFailure);
      expect(umbraCause(failure)?.details.sqlstate).toBe("25006");
      expect(await cursorOf(db)).toBe(1n);
      expect(await heightsIn(db, "w.rows")).toEqual([]);
    }, 60_000);

    it("a read handle has no execute: calling one from on-after-db-write fails and halts", async () => {
      const { db } = await backend.database();
      const w = mod("w", {
        async "on-after-db-write"(_p, b, read) {
          await (read as unknown as BlockWriteHandle).execute("INSERT INTO w.rows (height) VALUES ($1)", [b.height]);
        },
      });
      const started = await startWith(db, [w], [entry("w", 1)]);
      const failure = await failureOf(started, new InMemoryBlockSource({ head: 3n }), 3n);
      expect(where(failure)).toEqual({ height: 1n, point: "on-after-db-write", module: "w", committed: true });
      expect(rootCause(failure)).toBeInstanceOf(TypeError);
      expect(await cursorOf(db)).toBe(1n);
    }, 60_000);

    it("negative control: on-compute given a read at h (inside the block, after on-db-write) fails A39", async () => {
      /** A loop that runs on-compute inside the block transaction, after on-db-write, with a read of it at h. */
      class ComputeAtH extends FinalizedLoop {
        protected override async prepare(run: HeightRun): Promise<void> {
          await this.blockPoint(run, "on-fetch");
          await this.blockPoint(run, "on-parse");
        }

        protected override async write(tx: Transaction, run: HeightRun): Promise<void> {
          await super.write(tx, run);
          await this.compute(run, (body) => body({ height: run.height, query: (sql, params) => tx.query(sql, params) }));
        }
      }
      const { given, failure } = await observe(ComputeAtH);
      expect(failure).toBeUndefined();
      expect(computeProblems(given)).toEqual([
        "at 1 the read reports 1, not null",
        "at 1 the read sees the row written at 1",
        "at 2 the read reports 2, not 1",
        "at 2 the read sees the row written at 2",
        "at 3 the read reports 3, not 2",
        "at 3 the read sees the row written at 3",
      ]);
    }, 60_000);
  });

  describe("A40: the block items (RN-5)", () => {
    /** What the consumers saw: the value of `x` per point and height, and whether a sibling saw it. */
    interface Seen {
      readonly compute: (string | undefined)[];
      readonly write: (string | undefined)[];
      readonly after: number[];
      readonly sibling: boolean[];
      readonly computeSibling: boolean[];
      readonly computeLater: (string | undefined)[];
      readonly parsed: (string | undefined)[];
    }

    /**
     * `p` puts `x` in on-parse at odd heights (before its first await); `s`, in p's wave, looks for it at on-parse; `c`
     * requires `x` and reads it in on-compute and on-db-write, and counts the items at on-after-db-write; `q` puts `y` in
     * on-compute, `r` (q's wave) looks for it, `z` (requires `y`, a later wave) reads it.
     */
    function items(seen: Seen): ModuleDeclaration[] {
      const p = mod(
        "p",
        {
          async "on-parse"(_p, b, sink) {
            if (b.height % 2n === 1n) sink.put("x", `x@${b.height}`);
            await Promise.resolve();
          },
        },
        { provides: [blockItem("x")] },
      );
      const s = mod("s", {
        async "on-parse"(_p, b) {
          await new Promise((resolve) => setTimeout(resolve, 5));
          seen.sibling.push(b.items.has("x"));
        },
      });
      const c = consumer("c", ["x"], {
        points: {
          async "on-compute"(_p, b) {
            seen.compute.push(b.items.get("x") as string | undefined);
          },
          async "on-db-write"(_p, b) {
            seen.write.push(b.items.get("x") as string | undefined);
          },
          async "on-after-db-write"(_p, b) {
            seen.after.push(b.items.size);
          },
        },
      });
      const q = mod(
        "q",
        {
          async "on-compute"(_p, b, _read, sink) {
            sink.put("y", `y@${b.height}`);
          },
        },
        { provides: [blockItem("y")] },
      );
      const r = mod("r", {
        async "on-compute"(_p, b) {
          await new Promise((resolve) => setTimeout(resolve, 5));
          seen.computeSibling.push(b.items.has("y"));
        },
      });
      const z = consumer("z", ["y"], {
        points: {
          async "on-compute"(_p, b) {
            seen.computeLater.push(b.items.get("y") as string | undefined);
          },
        },
      });
      // f puts w in on-fetch; g, requiring w, reads it in on-parse.
      const f = mod(
        "f",
        {
          async "on-fetch"(_p, b, sink) {
            sink.put("w", `w@${b.height}`);
          },
        },
        { provides: [blockItem("w")] },
      );
      const g = consumer("g", ["w"], {
        points: {
          async "on-parse"(_p, b) {
            seen.parsed.push(b.items.get("w") as string | undefined);
          },
        },
      });
      return [p, s, c, q, r, z, f, g];
    }

    async function run(kind?: LoopClass): Promise<{ seen: Seen; failure: unknown }> {
      const { db } = await backend.database();
      const seen: Seen = {
        compute: [],
        write: [],
        after: [],
        sibling: [],
        computeSibling: [],
        computeLater: [],
        parsed: [],
      };
      const modules = items(seen);
      const started = await startWith(
        db,
        modules,
        modules.map((m) => entry(m.id, 1)),
      );
      try {
        await runUntilWaiting(started, new InMemoryBlockSource({ head: 4n }), 4n, kind);
        return { seen, failure: undefined };
      } catch (failure) {
        return { seen, failure };
      }
    }

    const EXPECTED: Seen = {
      compute: ["x@1", undefined, "x@3", undefined],
      write: ["x@1", undefined, "x@3", undefined],
      after: [0, 0, 0, 0],
      sibling: [false, false, false, false],
      computeSibling: [false, false, false, false],
      computeLater: ["y@1", "y@2", "y@3", "y@4"],
      parsed: ["w@1", "w@2", "w@3", "w@4"],
    };

    it("an item put in on-parse at h reaches a requiring module at h only, after its putter completed", async () => {
      const { seen, failure } = await run();
      expect(failure).toBeUndefined();
      expect(seen).toEqual(EXPECTED);
    }, 60_000);

    it("negative control: a sink that publishes a put at once, before its callback completes, fails A40", async () => {
      /** Items published the moment they are put. */
      class EagerItems extends BlockItems {
        override collect(part: ModuleDeclaration, point: PointName, body: (sink: ItemSink) => Promise<void>) {
          return super.collect(part, point, (sink) =>
            body({
              put: (item, value) => {
                sink.put(item, value);
                this.published.set(item, value);
              },
            }),
          );
        }
      }
      class EagerLoop extends FinalizedLoop {
        protected override itemsAt(height: bigint): BlockItems {
          return new EagerItems(height);
        }
      }
      const { seen, failure } = await run(EagerLoop);
      expect(failure).toBeUndefined();
      expect(seen).not.toEqual(EXPECTED);
      // p's wave-mate at on-parse saw x before p completed (on-compute's wave-mates start their reads first).
      expect(seen.sibling).toEqual([true, false, true, false]);
    }, 60_000);

    it("negative control: items kept for h + 1 fail A40", async () => {
      /** Each height's items start with the previous height's. */
      class KeptItems extends BlockItems {
        constructor(height: bigint, previous: BlockItems | undefined) {
          super(height);
          for (const [item, value] of previous?.visible() ?? []) this.published.set(item, value);
        }

        override collect(part: ModuleDeclaration, point: PointName, body: (sink: ItemSink) => Promise<void>) {
          // A put replaces the value kept from the height before, as a store kept across heights would.
          return super.collect(part, point, (sink) =>
            body({
              put: (item, value) => {
                this.published.delete(item);
                sink.put(item, value);
              },
            }),
          );
        }
      }
      class KeptLoop extends FinalizedLoop {
        #last: BlockItems | undefined;

        protected override itemsAt(height: bigint): BlockItems {
          this.#last = new KeptItems(height, this.#last);
          return this.#last;
        }
      }
      const { seen, failure } = await run(KeptLoop);
      expect(failure).toBeUndefined();
      expect(seen).not.toEqual(EXPECTED);
      expect(seen.compute).toEqual(["x@1", "x@1", "x@3", "x@3"]);
    }, 60_000);

    /** Runs one module `m` (providing `x` with `lifetimes`) whose callback at `point` does `body`; its failure. */
    async function putting(
      point: "on-fetch" | "on-parse" | "on-compute",
      body: (sink: ItemSink) => void | Promise<void>,
      lifetimes: ("block" | "table" | "process")[] = ["block"],
      extra: ModuleDeclaration["points"] = {},
    ): Promise<{ failure: unknown; cursor: bigint | null }> {
      const { db } = await backend.database();
      const item =
        lifetimes.includes("table")
          ? { name: "x", lifetimes, table: { schema: "m", tables: ["rows"], kind: "append-only" as const } }
          : { name: "x", lifetimes };
      const callback = async (...args: unknown[]) => body(args.at(-1) as ItemSink);
      const m = mod("m", { ...extra, [point]: callback }, { provides: [item] });
      const started = await startWith(db, [m], [entry("m", 1)]);
      const failure = await failureOf(started, new InMemoryBlockSource({ head: 2n }), 2n);
      return { failure, cursor: await cursorOf(db) };
    }

    it("a second put of one item in one block is a callback error, and nothing of the block is kept", async () => {
      const twice = await putting("on-parse", (sink) => {
        sink.put("x", 1);
        sink.put("x", 2);
      });
      expect(where(twice.failure)).toEqual({ height: 1n, point: "on-parse", module: "m", committed: false });
      expect(String(rootCause(twice.failure))).toMatch(/put the item x twice at height 1/);
      expect(twice.cursor).toBeNull();
    }, 60_000);

    it("a second put the module catches is still a callback error", async () => {
      const caught = await putting("on-compute", (sink) => {
        sink.put("x", 1);
        try {
          sink.put("x", 2);
        } catch {
          // The module ignores the refusal.
        }
      });
      expect(where(caught.failure)).toEqual({ height: 1n, point: "on-compute", module: "m", committed: false });
      expect(caught.cursor).toBeNull();
    }, 60_000);

    it("a put at on-parse of an item put at on-fetch of the same block is a second put", async () => {
      const across = await putting("on-parse", (sink) => sink.put("x", 2), ["block"], {
        async "on-fetch"(_p, _b, sink) {
          sink.put("x", 1);
        },
      });
      expect(where(across.failure)).toEqual({ height: 1n, point: "on-parse", module: "m", committed: false });
    }, 60_000);

    it("refuses an item the module does not declare, or declares without the block lifetime", async () => {
      const undeclared = await putting("on-fetch", (sink) => sink.put("not-mine", 1));
      expect(where(undeclared.failure)).toEqual({ height: 1n, point: "on-fetch", module: "m", committed: false });
      expect(String(rootCause(undeclared.failure))).toMatch(/does not declare with the block lifetime/);
      const tableOnly = await putting("on-fetch", (sink) => sink.put("x", 1), ["table"]);
      expect(where(tableOnly.failure)).toEqual({ height: 1n, point: "on-fetch", module: "m", committed: false });
    }, 60_000);

    it("a put from a sink kept past its callback halts before the next point starts", async () => {
      let kept: ItemSink | undefined;
      let wrote = false;
      const late = await putting(
        "on-parse",
        (sink) => {
          kept = sink;
        },
        ["block"],
        {
          async "on-compute"() {
            expect(() => kept?.put("x", 1)).toThrow(/after its on-parse callback at height 1 ended/);
          },
          async "on-db-write"() {
            wrote = true;
          },
        },
      );
      expect(where(late.failure)).toEqual({ height: 1n, point: "on-parse", module: "m", committed: false });
      expect(late.cursor).toBeNull();
      expect(wrote).toBe(false);
    }, 60_000);
  });

  describe("A37: every row is in a module's or a backbone part's schema, written through a handle (RN-2)", () => {
    /** Rows of every table outside PostgreSQL's own schemas, by `schema.table`. */
    async function rowCounts(started: Started): Promise<Map<string, number>> {
      return started.db.read(async (read) => {
        const tables = await read.query(
          "SELECT n.nspname AS schema, c.relname AS name FROM pg_class c JOIN pg_namespace n ON n.oid = c.relnamespace " +
            "WHERE c.relkind IN ('r', 'p') AND n.nspname NOT IN ('pg_catalog', 'information_schema') " +
            "AND n.nspname NOT LIKE 'pg\\_%' ORDER BY 1, 2",
        );
        const counts = new Map<string, number>();
        for (const { schema, name } of tables) {
          const [row] = await read.query(`SELECT count(*)::int AS n FROM "${String(schema)}"."${String(name)}"`);
          counts.set(`${String(schema)}.${String(name)}`, row?.n as number);
        }
        return counts;
      });
    }

    /** `d` with its on-db-write's handle counting the rows each `execute` affects into `written`. */
    function counted(d: ModuleDeclaration, written: { rows: number }): ModuleDeclaration {
      const write = d.points["on-db-write"];
      if (write === undefined) return d;
      const points = {
        ...d.points,
        async "on-db-write"(p: Parameters<typeof write>[0], b: BlockContext, w: BlockWriteHandle) {
          const counting: BlockWriteHandle = {
            height: w.height,
            query: (sql, params) => w.query(sql, params),
            execute: async (sql, params) => {
              const n = await w.execute(sql, params);
              written.rows += n;
              return n;
            },
          };
          await write.call(d.points, p, b, counting);
        },
      };
      return { ...d, points };
    }

    /** A module writing one row per height, and who wrote it. */
    const writer = (id: string) =>
      mod(
        id,
        {
          async "on-db-write"(_p, b, w) {
            await w.execute(`INSERT INTO ${id}.rows (height, written_as) VALUES ($1, current_user)`, [b.height]);
          },
        },
        { migrations: [{ id: "001", sql: `CREATE TABLE ${id}.rows (height bigint PRIMARY KEY, written_as text NOT NULL)` }] },
      );

    async function fifty(kind?: LoopClass) {
      const { db } = await backend.database();
      const written = { rows: 0 };
      const backbone = LOOP_BACKBONE.map((d) => counted(d, written));
      const user = ["alpha", "beta", "gamma"].map((id) => counted(writer(id), written));
      const started = await startWith(db, user, ["alpha", "beta", "gamma"].map((id) => entry(id, 1)), { backbone });
      const source = new InMemoryBlockSource({ head: 50n });
      await runUntilWaiting(started, source, 50n, kind);
      return { started, written, source };
    }

    /** A37's oracle: the problems found (none when every row is where it may be and was written through a handle). */
    async function problems(started: Started, written: { rows: number }): Promise<string[]> {
      const found: string[] = [];
      const counts = await rowCounts(started);
      const planSchemas = new Set(started.plan.schemas.map((schema) => schema.name));
      const allowed = new Set([...planSchemas, "core_chain", "core_digest"]);
      let inPlan = 0;
      for (const [table, n] of counts) {
        const schema = table.split(".")[0] as string;
        if (n > 0 && !allowed.has(schema)) found.push(`${table} holds ${n} rows outside every allowed schema`);
        if (planSchemas.has(schema)) inPlan += n;
      }
      if (inPlan !== written.rows) found.push(`the plan's schemas hold ${inPlan} rows; ${written.rows} were written through handles`);
      for (const id of ["alpha", "beta", "gamma"]) {
        const rows = await started.db.read((read) => read.query(`SELECT height, written_as FROM ${id}.rows ORDER BY height`));
        const role = started.plan.writeRole(id);
        const wrong = rows.filter((row) => row.written_as !== role);
        if (wrong.length > 0) found.push(`${wrong.length} rows of ${id}.rows were not written under ${role}`);
        if (rows.length !== 50) found.push(`${id}.rows holds ${rows.length} rows, not 50`);
      }
      return found;
    }

    it("after 50 heights, every row is in an allowed schema and every row there was written through a handle", async () => {
      const { started, written, source } = await fifty();
      expect(await problems(started, written)).toEqual([]);
      expect(written.rows).toBe(200);
      // The cursor table holds one row per height, written by core-block-commit's callback from the source's blocks.
      const blocks = await started.db.read((read) =>
        read.query("SELECT height, hash, parent_hash FROM core_block_commit.blocks ORDER BY height"),
      );
      const expected = await Promise.all(Array.from({ length: 50 }, (_, i) => source.block(BigInt(i + 1))));
      expect(blocks).toEqual(expected.map((b) => ({ height: b.height, hash: b.hash, parent_hash: b.parentHash })));
      const counts = await rowCounts(started);
      expect([...counts].filter(([, n]) => n > 0).map(([table]) => table)).toEqual([
        "alpha.rows",
        "beta.rows",
        "core_block_commit.blocks",
        "core_chain.migrations",
        "gamma.rows",
      ]);
    }, 120_000);

    it("negative control: a loop that writes a row itself, outside every handle, fails A37", async () => {
      class WritingLoop extends FinalizedLoop {
        protected override async write(tx: Transaction, run: HeightRun): Promise<void> {
          await super.write(tx, run);
          await tx.execute("INSERT INTO alpha.rows (height, written_as) VALUES ($1, current_user)", [run.height + 1000n]);
        }
      }
      const { started, written } = await fifty(WritingLoop);
      const found = await problems(started, written);
      expect(found).toEqual([
        "the plan's schemas hold 250 rows; 200 were written through handles",
        `50 rows of alpha.rows were not written under ${started.plan.writeRole("alpha")}`,
        "alpha.rows holds 100 rows, not 50",
      ]);
    }, 120_000);
  });

  describe("failures stop the loop with the height, point and module (RN-8's halt is task 5.4's)", () => {
    for (const point of ["on-fetch", "on-parse", "on-compute", "on-db-write"] as const) {
      it(`a callback failing in ${point} stops it at that height with nothing of the height kept`, async () => {
        const { db } = await backend.database();
        const error = new Error(`${point} broke`);
        const m = mod("m", {
          async "on-db-write"(_p, b, w) {
            await w.execute("INSERT INTO m.rows (height) VALUES ($1)", [b.height]);
          },
        });
        const breaker = mod("breaker", {
          async [point](...args: unknown[]) {
            const b = args[1] as BlockContext;
            if (point === "on-db-write") {
              await (args[2] as BlockWriteHandle).execute("INSERT INTO breaker.rows (height) VALUES ($1)", [b.height]);
            }
            if (b.height === 3n) throw error;
          },
        } as ModuleDeclaration["points"]);
        const started = await startWith(db, [m, breaker], [entry("m", 1), entry("breaker", 1)]);
        const failure = await failureOf(started, new InMemoryBlockSource({ head: 5n }), 5n);
        expect(where(failure)).toEqual({ height: 3n, point, module: "breaker", committed: false });
        expect(rootCause(failure)).toBe(error);
        expect((failure as HeightFailure).message).toBe(
          `processing stopped at height 3 in ${point} of breaker, before the height committed: the ${point} callback ` +
            `of breaker failed: ${point} broke`,
        );
        expect(await cursorOf(db)).toBe(2n);
        expect(await heightsIn(db, "m.rows")).toEqual([1n, 2n]);
      }, 60_000);
    }

    it("a failing statement in one on-compute callback aborts no other callback's read", async () => {
      const { db } = await backend.database();
      // a-good starts first and reads after b-bad's statement failed; a shared read would be aborted by then (25P02).
      const good = mod("a-good", {
        async "on-compute"(_p, _b, read) {
          await new Promise((resolve) => setTimeout(resolve, 20));
          await read.query("SELECT 1 AS one");
        },
      });
      const bad = mod("b-bad", {
        async "on-compute"(_p, _b, read) {
          await read.query("SELECT 1 / 0 AS boom");
        },
      });
      const started = await startWith(db, [good, bad], [entry("a-good", 1), entry("b-bad", 1)]);
      const failure = await failureOf(started, new InMemoryBlockSource({ head: 2n }), 2n);
      expect(where(failure)).toEqual({ height: 1n, point: "on-compute", module: "b-bad", committed: false });
      expect(umbraCause(failure)?.details.sqlstate).toBe("22012");
    }, 60_000);

    it("a failure after the commit that is no callback's keeps the height committed", async () => {
      const { db } = await backend.database();
      const error = new Error("after the commit");
      class FailingAfter extends FinalizedLoop {
        protected override async after(): Promise<void> {
          throw error;
        }
      }
      const started = await startWith(db, [mod("m", {})], [entry("m", 1)]);
      const failure = await failureOf(started, new InMemoryBlockSource({ head: 2n }), 2n, FailingAfter);
      expect(where(failure)).toEqual({ height: 1n, point: undefined, module: undefined, committed: true });
      expect((failure as HeightFailure).cause).toBe(error);
      expect(await cursorOf(db)).toBe(1n);
    }, 60_000);

    it("a failing on-finalized stops it before the heights of its head", async () => {
      const { db } = await backend.database();
      const m = mod("m", {
        async "on-finalized"() {
          throw new Error("no");
        },
      });
      const started = await startWith(db, [m], [entry("m", 1)]);
      const failure = await failureOf(started, new InMemoryBlockSource({ head: 2n }), 2n);
      expect(where(failure)).toEqual({ height: 1n, point: "on-finalized", module: "m", committed: false });
      expect(await cursorOf(db)).toBeNull();
    }, 60_000);

    it("a source that cannot give a block stops it at that height, naming no point", async () => {
      const { db } = await backend.database();
      const started = await startWith(db, [mod("m", {})], [entry("m", 1)]);
      const error = new Error("the node is gone");
      class Broken extends InMemoryBlockSource {
        override async block(height: bigint) {
          if (height === 2n) throw error;
          return super.block(height);
        }
      }
      const failure = await failureOf(started, new Broken({ head: 3n }), 3n);
      expect(where(failure)).toEqual({ height: 2n, point: undefined, module: undefined, committed: false });
      expect((failure as HeightFailure).cause).toBe(error);
      expect((failure as HeightFailure).message).toBe(
        "processing stopped at height 2, before the height committed: the node is gone",
      );
      expect(await cursorOf(db)).toBe(1n);
    }, 60_000);

    it("a source that rejects with a value that is not an Error stops it with that value as the cause", async () => {
      const { db } = await backend.database();
      const started = await startWith(db, [mod("m", {})], [entry("m", 1)]);
      class Broken extends InMemoryBlockSource {
        override block(): Promise<never> {
          return Promise.reject("no block today");
        }
      }
      const failure = await failureOf(started, new Broken({ head: 3n }), 3n);
      expect((failure as HeightFailure).cause).toBe("no block today");
      expect((failure as HeightFailure).message).toBe(
        "processing stopped at height 1, before the height committed: no block today",
      );
    }, 60_000);

    it("a source that gives the block of another height stops it before COMMIT: the cursor is not the height's", async () => {
      const { db } = await backend.database();
      const started = await startWith(db, [mod("m", {})], [entry("m", 1)]);
      class Shifted extends InMemoryBlockSource {
        override async block(height: bigint) {
          return inMemoryBlock(height === 2n ? 7n : height);
        }
      }
      const failure = await failureOf(started, new Shifted({ head: 3n }), 3n);
      expect(where(failure)).toEqual({ height: 2n, point: undefined, module: undefined, committed: false });
      expect((failure as HeightFailure).message).toMatch(
        /the block transaction of height 2 left the cursor at height 7, not at height 2 with the block's hash/,
      );
      expect(await cursorOf(db)).toBe(1n);
    }, 60_000);

    it("a block whose cursor row the block does not write stops it before COMMIT", async () => {
      const { db } = await backend.database();
      const silent = LOOP_BACKBONE.map((d) => (d.id === "core-block-commit" ? { ...d, points: {} } : d));
      const m = mod("m", {
        async "on-db-write"(_p, b, w) {
          await w.execute("INSERT INTO m.rows (height) VALUES ($1)", [b.height]);
        },
      });
      const started = await startWith(db, [m], [entry("m", 1)], { backbone: silent });
      const failure = await failureOf(started, new InMemoryBlockSource({ head: 2n }), 2n);
      expect(where(failure)).toEqual({ height: 1n, point: undefined, module: undefined, committed: false });
      expect((failure as HeightFailure).message).toMatch(
        /the block transaction of height 1 left the cursor at none, not at height 1 with the block's hash/,
      );
      expect(await heightsIn(db, "m.rows")).toEqual([]);
    }, 60_000);

    for (const [what, hashOf] of [
      ["another hash than the block's", () => new Uint8Array(32).fill(7)],
      ["the block's hash cut short", (b: BlockContext) => b.hash.slice(0, 31)],
    ] as const) {
      it(`a cursor row with ${what} stops it before COMMIT`, async () => {
        const { db } = await backend.database();
        const wrong = LOOP_BACKBONE.map((d) =>
          d.id === "core-block-commit"
            ? {
                ...d,
                points: {
                  async "on-db-write"(_p: unknown, b: BlockContext, w: BlockWriteHandle) {
                    await w.execute(
                      "INSERT INTO core_block_commit.blocks (height, hash, parent_hash) VALUES ($1, $2, $3)",
                      [b.height, hashOf(b), b.parentHash],
                    );
                  },
                },
              }
            : d,
        ) as ModuleDeclaration[];
        const started = await startWith(db, [mod("m", {})], [entry("m", 1)], { backbone: wrong });
        const failure = await failureOf(started, new InMemoryBlockSource({ head: 2n }), 2n);
        expect(where(failure)).toEqual({ height: 1n, point: undefined, module: undefined, committed: false });
        expect((failure as HeightFailure).message).toMatch(/left the cursor at height 1 with another hash/);
        expect(await cursorOf(db)).toBeNull();
      }, 60_000);
    }

    it("a block write handle used from a timer after its block halts once the height's last point ends (A10)", async () => {
      const { db } = await backend.database();
      let kept: BlockWriteHandle | undefined;
      let used: unknown;
      const m = mod("m", {
        async "on-db-write"(_p, b, w) {
          if (b.height === 1n) kept = w;
        },
        async "on-after-db-write"(_p, b) {
          if (b.height !== 1n) return;
          // After the COMMIT, a timer uses the handle and the module catches the refusal: no callback fails.
          used = await new Promise((resolve) => setTimeout(resolve, 0)).then(() =>
            kept?.execute("INSERT INTO m.rows (height) VALUES (99)").catch((error: unknown) => error),
          );
        },
      });
      const started = await startWith(db, [m], [entry("m", 1)]);
      const failure = await failureOf(started, new InMemoryBlockSource({ head: 3n }), 3n);
      // The height had committed when the timer used the handle: the loop stops there, before height 2.
      expect(where(failure)).toEqual({ height: 1n, point: "on-db-write", module: "m", committed: true });
      const cause = (failure as HeightFailure).cause;
      expect(cause).toBeInstanceOf(UmbraError);
      expect((cause as UmbraError).code).toBe("handle-closed");
      expect(used).toBe(cause);
      expect(await cursorOf(db)).toBe(1n);
      expect(await heightsIn(db, "m.rows")).toEqual([]);
    }, 60_000);

    it("a block write handle used while the loop waits for the head halts before the next height", async () => {
      const { db } = await backend.database();
      let kept: BlockWriteHandle | undefined;
      const m = mod("m", {
        async "on-db-write"(_p, _b, w) {
          kept = w;
        },
      });
      const started = await startWith(db, [m], [entry("m", 1)]);
      const source = new InMemoryBlockSource({ head: 1n });
      const controller = new AbortController();
      const running = new FinalizedLoop({
        db,
        graph: started.graph,
        plan: started.plan,
        source,
        contextOf: (id) => started.contexts.of(id),
        signal: controller.signal,
      }).run();
      await source.waiting(1n);
      await expect(kept?.execute("INSERT INTO m.rows (height) VALUES (7)")).rejects.toThrow(/write handle of m/);
      source.finalize(2n);
      const failure = await running.then(
        () => "resolved",
        (error: unknown) => error,
      );
      expect(where(failure)).toEqual({ height: 2n, point: "on-db-write", module: "m", committed: false });
      expect(await cursorOf(db)).toBe(1n);
    }, 60_000);

    for (const catches of [false, true]) {
      const how = catches ? ", which catches the refusal," : "";
      it(`a block write handle kept and used in a later block's callback${how} names the module that kept it`, async () => {
        const { db } = await backend.database();
        let kept: BlockWriteHandle | undefined;
        const keeper = mod("keeper", {
          async "on-db-write"(_p, _b, w) {
            kept ??= w;
          },
        });
        const borrower = mod("borrower", {
          async "on-db-write"(_p, b) {
            if (b.height !== 2n) return;
            const use = kept?.execute("INSERT INTO keeper.rows (height) VALUES (5)");
            await (catches ? use?.catch(() => undefined) : use);
          },
        });
        const started = await startWith(db, [keeper, borrower], [entry("keeper", 1), entry("borrower", 1)]);
        const failure = await failureOf(started, new InMemoryBlockSource({ head: 3n }), 3n);
        expect(where(failure)).toEqual({ height: 2n, point: "on-db-write", module: "keeper", committed: false });
        expect(await cursorOf(db)).toBe(1n);
        expect(await heightsIn(db, "keeper.rows")).toEqual([]);
      }, 60_000);
    }
  });

  describe("stopping, and the loop's own errors", () => {
    it("finishes the height in progress when stopped during it, and starts no other", async () => {
      const { db } = await backend.database();
      const controller = new AbortController();
      const m = mod("m", {
        async "on-db-write"(_p, b, w) {
          await w.execute("INSERT INTO m.rows (height) VALUES ($1)", [b.height]);
          if (b.height === 2n) controller.abort();
        },
      });
      const started = await startWith(db, [m], [entry("m", 1)]);
      const input = {
        db,
        graph: started.graph,
        plan: started.plan,
        source: new InMemoryBlockSource({ head: 5n }),
        contextOf: (id: string) => started.contexts.of(id),
        signal: controller.signal,
      };
      await expect(new FinalizedLoop(input).run()).resolves.toBeUndefined();
      expect(await heightsIn(db, "m.rows")).toEqual([1n, 2n]);
      expect(await cursorOf(db)).toBe(2n);
    }, 60_000);

    it("stops without processing when stopped just as the head rises", async () => {
      const { db } = await backend.database();
      const seen: SeenCall[] = [];
      const started = await startWith(db, [recordingModule("recorder", seen, declaration)], [entry("recorder", 1)]);
      const source = new InMemoryBlockSource({ head: 1n });
      const controller = new AbortController();
      const running = new FinalizedLoop({
        db,
        graph: started.graph,
        plan: started.plan,
        source,
        contextOf: (id) => started.contexts.of(id),
        signal: controller.signal,
      }).run();
      await source.waiting(1n);
      source.finalize(3n);
      controller.abort();
      await expect(running).resolves.toBeUndefined();
      expect(await cursorOf(db)).toBe(1n);
      expect(seen.filter((c) => c.point === "on-finalized")).toHaveLength(1);
    }, 60_000);

    it("stops at a failing wait for the head, naming the next height", async () => {
      const { db } = await backend.database();
      const started = await startWith(db, [mod("m", {})], [entry("m", 1)]);
      const error = new Error("the subscription is gone");
      class Lost extends InMemoryBlockSource {
        override waitForHead(): Promise<void> {
          return Promise.reject(error);
        }
      }
      const failure = await failureOf(started, new Lost({ head: 2n }), 2n);
      expect(where(failure)).toEqual({ height: 3n, point: undefined, module: undefined, committed: false });
      expect((failure as HeightFailure).cause).toBe(error);
      expect(await cursorOf(db)).toBe(2n);
    }, 60_000);

    it("refuses a graph resolved from another cursor, which has no range for the next height", async () => {
      const { db } = await backend.database();
      const started = await startWith(db, [mod("m", {})], [entry("m", 1)]);
      // The same build's graph as a database at cursor 20 would resolve it: its ranges start at the one holding 20.
      const late = resolveGraph({
        declarations: validateDeclarations({ backbone: LOOP_BACKBONE, core: [], user: [mod("m", {})] }),
        start: 1n,
        entries: [entry("m", 1, 9), entry("m", 10)],
        developmentOptIn: false,
        cursor: 20n,
      });
      const failure = await failureOf({ ...started, graph: late }, new InMemoryBlockSource({ head: 2n }), 2n);
      expect(where(failure)).toEqual({ height: 1n, point: undefined, module: undefined, committed: false });
      expect((failure as HeightFailure).message).toMatch(
        /the resolved graph has no range holding height 1: it must be resolved from this database's cursor/,
      );
    }, 60_000);

    it("runFinalized runs the loop; without a signal it runs until it fails", async () => {
      const { db } = await backend.database();
      const m = mod("m", {
        async "on-after-db-write"(_p, b) {
          if (b.height === 2n) throw new Error("enough");
        },
      });
      const started = await startWith(db, [m], [entry("m", 1)]);
      const failure = await runFinalized({
        db,
        graph: started.graph,
        plan: started.plan,
        source: new InMemoryBlockSource({ head: 9n }),
        contextOf: (id) => started.contexts.of(id),
      }).catch((error: unknown) => error);
      expect(where(failure)).toEqual({ height: 2n, point: "on-after-db-write", module: "m", committed: true });
      expect(await cursorOf(db)).toBe(2n);
    }, 60_000);
  });

  describe("on-finalized's callbacks", () => {
    it("are those of the modules active at the first height the head announces", async () => {
      const { db } = await backend.database();
      const told: string[] = [];
      const telling = (id: string) =>
        mod(id, {
          async "on-finalized"(_p, head) {
            told.push(`${id}@${head.height}`);
          },
        });
      const started = await startWith(
        db,
        [telling("early"), telling("later")],
        [entry("early", 1), entry("later", 3)],
      );
      const source = new InMemoryBlockSource({ head: 4n });
      await runUntilWaiting(started, source, 4n);
      source.finalize(6n);
      await runUntilWaiting(started, source, 6n);
      expect(told).toEqual(["early@4", "early@6", "later@6"]);
    }, 60_000);
  });

  describe("two misuses", () => {
    it("the loop names the first", async () => {
      const { db } = await backend.database();
      const kept = new Map<string, BlockWriteHandle>();
      const keeper = (id: string) =>
        mod(id, {
          async "on-db-write"(_p, b, w) {
            if (b.height === 1n) kept.set(id, w);
          },
        });
      const borrower = mod("borrower", {
        async "on-db-write"(_p, b) {
          if (b.height !== 2n) return;
          for (const id of ["z-keeper", "a-keeper"]) await kept.get(id)?.execute("SELECT 1").catch(() => undefined);
        },
      });
      const started = await startWith(
        db,
        [keeper("a-keeper"), keeper("z-keeper"), borrower],
        ["a-keeper", "z-keeper", "borrower"].map((id) => entry(id, 1)),
      );
      const failure = await failureOf(started, new InMemoryBlockSource({ head: 3n }), 3n);
      expect(where(failure)).toEqual({ height: 2n, point: "on-db-write", module: "z-keeper", committed: false });
    }, 60_000);
  });

  describe("A144 through the loop: the db item from inside a callback (DB-4, Q73)", () => {
    /** m's process context holds the `db` item as core-chain will publish it (task 10.2): the database, read-only. */
    class WithDb extends Contexts {
      constructor(readonly item: ReadOnlyDatabase) {
        super();
      }

      override of(id: string) {
        const context = super.of(id);
        return id === "m" ? Object.freeze({ ...context, items: new Map([["db", this.item]]) }) : context;
      }
    }

    for (const point of ["on-compute", "on-db-write"] as const) {
      it(`a db.read from inside ${point}: nested-call on PGlite, the data committed before the block on PostgreSQL`, async () => {
        const { db } = await backend.database();
        const seen: (bigint | null)[] = [];
        const m = mod("m", {
          async [point](p: ProcessContext) {
            const item = p.items.get("db") as ReadOnlyDatabase;
            seen.push(await item.read(async (read) => read.height));
          },
        } as ModuleDeclaration["points"]);
        const started = await startWith(db, [m], [entry("m", 1)], { contexts: new WithDb(readOnlyDatabase(db)) });
        const source = new InMemoryBlockSource({ head: 2n });
        if (backend.name.startsWith("PGlite")) {
          const failure = await failureOf(started, source, 2n);
          expect(where(failure)).toEqual({ height: 1n, point, module: "m", committed: false });
          expect(umbraCause(failure)?.details.reason).toBe("nested-call");
          expect(await cursorOf(db)).toBeNull();
        } else {
          await runUntilWaiting(started, source, 2n);
          expect(seen).toEqual([null, 1n]);
        }
      }, 60_000);
    }
  });

  describe("the block context (RN-5, RN-7)", () => {
    it("holds the block's height, hash and parent hash, the module's settings at h and the active entries", async () => {
      const { db } = await backend.database();
      const seen: { height: bigint; hash: Uint8Array; parent: Uint8Array; k: unknown; active: boolean[] }[] = [];
      const frozen: boolean[] = [];
      const defaults: boolean[] = [];
      const late = mod("late", {
        async "on-compute"(_p, b) {
          defaults.push(Object.isFrozen(b.settings) && Object.keys(b.settings).length === 0);
        },
      });
      const m = mod("m", {
        async "on-compute"(_p, b) {
          frozen.push(Object.isFrozen(b) && Object.isFrozen(b.settings));
          seen.push({
            height: b.height,
            hash: b.hash,
            parent: b.parentHash,
            k: b.settings.k,
            active: ["m", "late", "gone", "core-block-commit", "nobody"].map((id) => b.active(id)),
          });
        },
      });
      const revisions = [
        { start: 1n, stop: null, version: "1.0.0", settings: Object.freeze({ k: 1 }) },
        { start: 3n, stop: null, version: "1.0.0", settings: Object.freeze({ k: 2 }) },
      ];
      /** m's process context carries its two revisions (task 4.3 reads them from the configuration). */
      class WithRevisions extends Contexts {
        readonly #m = Object.freeze({ items: new Map(), revisions, publish: () => undefined });

        override of(id: string) {
          return id === "m" ? this.#m : super.of(id);
        }
      }
      const contexts = new WithRevisions();
      const started = await startWith(
        db,
        [m, late, mod("gone", {})],
        [entry("m", 1), entry("late", 3), entry("gone", 1, 2)],
        { contexts },
      );
      await runUntilWaiting(started, new InMemoryBlockSource({ head: 4n }), 4n);
      expect(frozen).toEqual([true, true, true, true]);
      // late has no revisions in its context: its settings are empty and frozen, at 3 and 4, where it runs.
      expect(defaults).toEqual([true, true]);
      expect(seen).toEqual(
        [1n, 2n, 3n, 4n].map((h) => ({
          height: h,
          hash: inMemoryBlock(h).hash,
          parent: inMemoryBlock(h).parentHash,
          k: h < 3n ? 1 : 2,
          active: [true, h >= 3n, h <= 2n, true, false],
        })),
      );
    }, 60_000);
  });
});
