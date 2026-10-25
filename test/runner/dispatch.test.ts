import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";
import { type ModuleDeclaration, POINTS, type PointName } from "../../src/modules/declaration.js";
import { type ResolvedRange, resolveGraph } from "../../src/modules/graph.js";
import {
  CallbackFailure,
  dispatch,
  isParallelPoint,
  PARALLEL_POINTS,
  type PointRun,
  type PointSchedule,
  runSchedule,
  scheduleAt,
  seriesOf,
  startHeightSchedule,
  stopHeightSchedule,
} from "../../src/runner/dispatch.js";
import { declaration } from "../modules/declarations.js";
import {
  BACKBONE,
  blockItem,
  consumer,
  CORE_BLOCK_COMMIT,
  CORE_BLOCK_FETCH,
  CORE_CHAIN,
  CORE_DIGEST,
  entry,
  graphInput,
  provider,
} from "../modules/graph-fixtures.js";
import { ARGUMENTS, Contexts, Recorder, recording, runOf, yields } from "./fixtures.js";

/**
 * The runner's point dispatch (task 5.1; RN-3, RN-9, RN-10, `design.md` §2): given a resolved range, a point and how
 * to call one part, the dispatch calls the parts registered at the point in RN-3's order — in series, each awaited
 * before the next, or, at `on-fetch`, `on-parse` and `on-compute`, the backbone parts in series and then the other
 * modules in Kahn waves restricted to the modules registered at the point, a module waiting for every registered
 * module on a requirement path from it (through modules that do not register the point too). Each callback is called
 * as a method of its declaration's `points`, with its module's process context first. A failing callback ends the
 * point: in a wave the others are awaited, nothing of the next wave starts, and the first failure in the point's order
 * is thrown as a `CallbackFailure` naming the point and the module. A38's property test is `order.property.test.ts`.
 */

const ids = (parts: readonly ModuleDeclaration[]): string[] => parts.map((part) => part.id);
const waveIds = (schedule: PointSchedule): string[][] => schedule.waves.map(ids);

/** `d` registering `points`, each with a callback that records itself (waiting `wait[point]` microtasks). */
function registering(
  d: ModuleDeclaration,
  recorder: Recorder,
  points: readonly PointName[],
  wait: Partial<Record<PointName, number>> = {},
): ModuleDeclaration {
  return { ...d, points: Object.fromEntries(points.map((p) => [p, recording(recorder, d.id, p, wait[p])])) };
}

/** A module requiring `requires` and providing the `block` items `provides`. */
function part(id: string, requires: readonly string[], provides: readonly string[] = []): ModuleDeclaration {
  return declaration(id, { requires: [...requires], provides: provides.map(blockItem), migrations: [] });
}

/** The one range from S of `user` (each with an entry from S) on `backbone`. */
function rangeOf(user: readonly ModuleDeclaration[], backbone: readonly ModuleDeclaration[] = BACKBONE): ResolvedRange {
  const graph = resolveGraph(graphInput(user, user.map((d) => entry(d.id, 1)), { backbone }));
  expect(graph.ranges).toHaveLength(1);
  return graph.ranges[0] as ResolvedRange;
}

/** Whatever `promise` settles with, or "pending" if it has not settled after `ms` milliseconds. */
async function settledWithin(promise: Promise<unknown>, ms: number): Promise<"resolved" | "rejected" | "pending"> {
  const timer = new Promise<"pending">((resolve) => setTimeout(() => resolve("pending"), ms));
  return Promise.race([promise.then(() => "resolved" as const, () => "rejected" as const), timer]);
}

/** The error `promise` rejects with; fails the test if it resolves. */
async function rejection(promise: Promise<unknown>): Promise<unknown> {
  try {
    await promise;
  } catch (error) {
    return error;
  }
  return expect.unreachable("expected the dispatch to reject");
}

describe("design.md §2: which points run in series and which in parallel where the graph allows", () => {
  /** The `| point | When | Handle | Runs |` rows of design.md §2's table. */
  function designRuns(): Map<string, string> {
    const path = fileURLToPath(new URL("../../openspec/changes/core-arch/design.md", import.meta.url));
    const text = readFileSync(path, "utf8");
    const section = text.slice(text.indexOf("## 2. Points"), text.indexOf("## 3. Block source"));
    const runs = new Map<string, string>();
    for (const line of section.split("\n")) {
      const match = /^\| `(on-[a-z-]+)` \|[^|]*\|[^|]*\| ([^|]+) \|$/.exec(line);
      if (match !== null) runs.set(match[1] as string, (match[2] as string).trim());
    }
    return runs;
  }

  it("marks exactly the points the table runs 'Parallel where the graph allows', and lists every point", () => {
    const runs = designRuns();
    expect([...runs.keys()].sort()).toEqual([...POINTS].sort());
    const parallel = [...runs].filter(([, how]) => how === "Parallel where the graph allows").map(([point]) => point);
    expect([...PARALLEL_POINTS].sort()).toEqual(parallel.sort());
    expect(parallel.sort()).toEqual(["on-compute", "on-fetch", "on-parse"]);
    for (const [point, how] of runs) {
      expect(isParallelPoint(point as PointName)).toBe(how === "Parallel where the graph allows");
      if (!isParallelPoint(point as PointName)) expect(how.startsWith("In series")).toBe(true);
    }
  });
});

describe("this and the arguments: each callback is a method of its declaration's points, as migrationPart calls on-start-db", () => {
  it("calls every point's callback with this = the declaration's points, its module's context first, then the run's arguments", async () => {
    const seen: { point: PointName; self: unknown; args: unknown[] }[] = [];
    const points = Object.fromEntries(
      POINTS.map((point) => [
        point,
        async function (this: unknown, ...args: unknown[]) {
          seen.push({ point, self: this, args });
        },
      ]),
    );
    const m = declaration("m", { points });
    const contexts = new Contexts();
    for (const point of POINTS) await runSchedule(seriesOf(point, [m]), runOf(point, contexts));
    expect(seen.map((s) => s.point)).toEqual([...POINTS]);
    const context = contexts.of("m");
    for (const { point, self, args } of seen) {
      expect(self, point).toBe(m.points);
      expect(args, point).toHaveLength(1 + ARGUMENTS[point].length);
      expect(args[0], point).toBe(context);
      ARGUMENTS[point].forEach((argument, index) => expect(args[index + 1], point).toBe(argument));
    }
  });

  it("gives each module its own process context, the same object at every point and height", async () => {
    const seen = new Map<string, unknown[]>();
    const log = (id: string) =>
      async function (context: unknown) {
        seen.set(id, [...(seen.get(id) ?? []), context]);
      };
    const a = declaration("a", { points: { "on-compute": log("a"), "on-db-write": log("a") } });
    const b = declaration("b", { points: { "on-compute": log("b"), "on-db-write": log("b") } });
    const range = rangeOf([a, b]);
    const contexts = new Contexts();
    for (let height = 0; height < 2; height++) {
      await dispatch(range, "on-compute", runOf("on-compute", contexts));
      await dispatch(range, "on-db-write", runOf("on-db-write", contexts));
    }
    expect(seen.get("a")).toHaveLength(4);
    expect(new Set(seen.get("a")).size).toBe(1);
    expect(new Set(seen.get("b")).size).toBe(1);
    expect(seen.get("a")?.[0]).toBe(contexts.of("a"));
    expect(seen.get("b")?.[0]).toBe(contexts.of("b"));
    expect(contexts.of("a")).not.toBe(contexts.of("b"));
  });

  it("asks for a part's context only when its callback is called, and resolves with nothing", async () => {
    const order: string[] = [];
    const contexts = new Contexts();
    const m = declaration("m", {
      points: {
        "on-db-write": async () => {
          order.push("callback");
          return 42 as unknown as void;
        },
      },
    });
    const run: PointRun<"on-db-write"> = {
      contextOf: (id) => {
        order.push(`context ${id}`);
        return contexts.of(id);
      },
      invoke: async (_part, call) => {
        order.push("invoke");
        await yields(1);
        await call(...ARGUMENTS["on-db-write"]);
      },
    };
    await expect(runSchedule(seriesOf("on-db-write", [m]), run)).resolves.toBeUndefined();
    expect(order).toEqual(["invoke", "context m", "callback"]);
  });

  it("passes the part being called to the run, in the point's order", async () => {
    const recorder = new Recorder();
    const a = registering(declaration("a"), recorder, ["on-db-write"]);
    const b = registering(declaration("b"), recorder, ["on-db-write"]);
    const invoked: string[] = [];
    await runSchedule(seriesOf("on-db-write", [b, a]), {
      contextOf: (id) => new Contexts().of(id),
      invoke: (p, call) => {
        invoked.push(p.id);
        return call(...ARGUMENTS["on-db-write"]);
      },
    });
    expect(invoked).toEqual(["b", "a"]);
    expect(recorder.starts("on-db-write")).toEqual(["b", "a"]);
  });
});

describe("RN-3 in series: the registered parts in the range's order, each awaited before the next", () => {
  const SERIES: readonly PointName[] = POINTS.filter(
    (point) => !isParallelPoint(point) && !["on-start-db", "on-start-height", "on-stop-height"].includes(point),
  );

  function world(recorder: Recorder) {
    const backbone = [
      registering(CORE_CHAIN, recorder, POINTS),
      CORE_BLOCK_FETCH,
      registering(CORE_BLOCK_COMMIT, recorder, POINTS),
      registering(CORE_DIGEST, recorder, POINTS),
    ];
    const user = [
      registering(consumer("b-mod", ["block-header"]), recorder, POINTS),
      registering(consumer("a-mod", ["block-header"]), recorder, POINTS),
      consumer("c-mod", ["block-header"]),
      registering(consumer("ch-mod", ["block-header"]), recorder, ["on-db-write"]),
    ];
    return rangeOf(user, backbone);
  }

  it("RN-3's scenario: unrelated modules write in id order, after the backbone parts and before core-digest", async () => {
    const recorder = new Recorder();
    const range = world(recorder);
    await dispatch(range, "on-db-write", runOf("on-db-write"));
    expect(recorder.starts("on-db-write")).toEqual([
      "core-chain",
      "core-block-commit",
      "a-mod",
      "b-mod",
      "ch-mod",
      "core-digest",
    ]);
    expect(waveIds(scheduleAt(range, "on-db-write"))).toEqual(recorder.starts("on-db-write").map((id) => [id]));
  });

  it("uses the range's order at every other point in series, core-digest in its backbone place", async () => {
    for (const point of SERIES.filter((p) => p !== "on-db-write")) {
      const recorder = new Recorder();
      await dispatch(world(recorder), point, runOf(point));
      expect(recorder.starts(point), point).toEqual(["core-chain", "core-block-commit", "core-digest", "a-mod", "b-mod"]);
    }
  });

  it("awaits each callback before calling the next", async () => {
    for (const point of SERIES) {
      const recorder = new Recorder();
      const range = world(recorder);
      await dispatch(range, point, runOf(point));
      const events = recorder.events.filter((e) => e.point === point);
      expect(events.length, point).toBeGreaterThan(8);
      events.forEach((event, index) => {
        expect(event.kind, point).toBe(index % 2 === 0 ? "start" : "end");
        if (index % 2 === 1) expect(event.module, point).toBe(events[index - 1]?.module);
      });
    }
  });

  it("awaits a slow callback before the next, even one that waits on a timer", async () => {
    const recorder = new Recorder();
    const slow = declaration("a-slow", {
      points: { "on-after-db-write": recording(recorder, "a-slow", "on-after-db-write", 1, () => new Promise((r) => setTimeout(r, 20))) },
    });
    const quick = registering(declaration("b-quick"), recorder, ["on-after-db-write"]);
    await dispatch(rangeOf([quick, slow]), "on-after-db-write", runOf("on-after-db-write"));
    expect(recorder.events.map((e) => `${e.kind} ${e.module}`)).toEqual([
      "start a-slow",
      "end a-slow",
      "start b-quick",
      "end b-quick",
    ]);
  });

  it("seriesOf keeps the order it is given, one part per wave, leaving out the parts that do not register the point", () => {
    const recorder = new Recorder();
    const a = registering(declaration("a"), recorder, ["on-start-api"]);
    const b = declaration("b");
    const c = registering(declaration("c"), recorder, ["on-start-api", "on-key"]);
    const schedule = seriesOf("on-start-api", [c, b, a]);
    expect(schedule.point).toBe("on-start-api");
    expect(waveIds(schedule)).toEqual([["c"], ["a"]]);
    expect(waveIds(seriesOf("on-key", [c, b, a]))).toEqual([["c"]]);
    expect(Object.isFrozen(schedule)).toBe(true);
    expect(Object.isFrozen(schedule.waves)).toBe(true);
    expect(schedule.waves.every((wave) => Object.isFrozen(wave))).toBe(true);
  });

  it("freezes a parallel point's schedule, each wave included, so a runner may keep it for the range", () => {
    const recorder = new Recorder();
    const user = [
      registering(provider("p", ["x"]), recorder, ["on-parse"]),
      registering(consumer("c", ["x"]), recorder, ["on-parse"]),
      registering(consumer("d", ["block-header"]), recorder, ["on-parse"]),
    ];
    const schedule = scheduleAt(rangeOf(user, [registering(CORE_CHAIN, recorder, ["on-parse"]), ...BACKBONE.slice(1)]), "on-parse");
    expect(waveIds(schedule)).toEqual([["core-chain"], ["d", "p"], ["c"]]);
    expect(Object.isFrozen(schedule)).toBe(true);
    expect(Object.isFrozen(schedule.waves)).toBe(true);
    expect(schedule.waves.every((wave) => Object.isFrozen(wave))).toBe(true);
  });
});

describe("RN-3 parallel where the graph allows: the Kahn waves of the modules registered at the point (design.md §2)", () => {
  it("RN-3's scenario: a provider finishes before its consumer starts at on-compute", async () => {
    const recorder = new Recorder();
    const p = registering(provider("provider", ["x"]), recorder, ["on-compute"], { "on-compute": 6 });
    const c = registering(consumer("consumer", ["x"]), recorder, ["on-compute"]);
    const range = rangeOf([c, p]);
    await dispatch(range, "on-compute", runOf("on-compute"));
    expect(recorder.at("consumer", "on-compute", "start")).toBeGreaterThan(recorder.at("provider", "on-compute", "end"));
    expect(waveIds(scheduleAt(range, "on-compute"))).toEqual([["provider"], ["consumer"]]);
  });

  it("starts the modules of one wave together, in RN-3's order, before any of them ends", async () => {
    for (const point of PARALLEL_POINTS) {
      const recorder = new Recorder();
      const unrelated = ["d-mod", "ch-mod", "m9", "m10", "b-mod", "a-mod"].map((id, index) =>
        registering(consumer(id, ["block-header"]), recorder, [point], { [point]: 6 - index }),
      );
      const range = rangeOf(unrelated);
      await dispatch(range, point, runOf(point));
      const expected = ["a-mod", "b-mod", "ch-mod", "d-mod", "m10", "m9"];
      expect(recorder.waves(point), point).toEqual([expected]);
      expect(waveIds(scheduleAt(range, point)), point).toEqual([expected]);
      // They end in another order than they started: each waited for a different number of microtasks.
      const ends = recorder.events.filter((e) => e.kind === "end").map((e) => e.module);
      expect(ends, point).not.toEqual(expected);
    }
  });

  it("puts each module in the wave after the last of its registered providers: a diamond and a late join", () => {
    const recorder = new Recorder();
    const at = (d: ModuleDeclaration) => registering(d, recorder, ["on-parse"]);
    const user = [
      at(part("a", ["block-header"], ["a-out"])),
      at(part("b", ["a-out"], ["b-out"])),
      at(part("c", ["a-out"], ["c-out"])),
      at(part("d", ["b-out", "c-out"], ["d-out"])),
      at(part("e", ["a-out", "d-out"])),
      at(part("f", ["block-header"])),
    ];
    expect(waveIds(scheduleAt(rangeOf(user), "on-parse"))).toEqual([["a", "f"], ["b", "c"], ["d"], ["e"]]);
  });

  it("keeps the waits through a module that does not register the point: a provider two and three steps away", async () => {
    const recorder = new Recorder();
    const user = [
      registering(part("a", ["b-out"]), recorder, ["on-compute"]),
      part("b", ["c-out"], ["b-out"]),
      registering(part("c", ["block-header"], ["c-out"]), recorder, ["on-compute"], { "on-compute": 6 }),
      registering(part("x", ["y-out"]), recorder, ["on-compute"]),
      part("y", ["z-out"], ["y-out"]),
      part("z", ["c-out"], ["z-out"]),
    ];
    const range = rangeOf(user);
    expect(waveIds(scheduleAt(range, "on-compute"))).toEqual([["c"], ["a", "x"]]);
    await dispatch(range, "on-compute", runOf("on-compute"));
    expect(recorder.at("a", "on-compute", "start")).toBeGreaterThan(recorder.at("c", "on-compute", "end"));
    expect(recorder.at("x", "on-compute", "start")).toBeGreaterThan(recorder.at("c", "on-compute", "end"));
  });

  it("runs the backbone parts registered at the point first, in their fixed order, each awaited, then the modules", async () => {
    const recorder = new Recorder();
    const backbone = [CORE_DIGEST, CORE_BLOCK_COMMIT, CORE_BLOCK_FETCH, CORE_CHAIN].map((d) =>
      registering(d, recorder, ["on-parse"], { "on-parse": 3 }),
    );
    const user = [registering(consumer("a-mod", ["config"]), recorder, ["on-parse"])];
    const range = rangeOf(user, backbone);
    expect(waveIds(scheduleAt(range, "on-parse"))).toEqual([
      ["core-chain"],
      ["core-block-fetch"],
      ["core-block-commit"],
      ["core-digest"],
      ["a-mod"],
    ]);
    await dispatch(range, "on-parse", runOf("on-parse"));
    expect(recorder.events.map((e) => `${e.kind} ${e.module}`)).toEqual([
      "start core-chain",
      "end core-chain",
      "start core-block-fetch",
      "end core-block-fetch",
      "start core-block-commit",
      "end core-block-commit",
      "start core-digest",
      "end core-digest",
      "start a-mod",
      "end a-mod",
    ]);
  });

  it("treats a core module as a module, not a backbone part, though its id starts with core-", async () => {
    const recorder = new Recorder();
    const points: PointName[] = ["on-parse", "on-start-height", "on-stop-height"];
    const a = registering(part("a", ["block-header"], ["a-out"]), recorder, points);
    const coreX = registering(part("core-x", ["a-out"], ["x-out"]), recorder, points);
    const backbone = [registering(CORE_CHAIN, recorder, points), ...BACKBONE.slice(1)];
    const graph = resolveGraph(graphInput([a], [entry("a", 1), entry("core-x", 1)], { core: [coreX], backbone }));
    const range = graph.rangeAt(1n) as ResolvedRange;
    expect(ids(range.order)).toEqual(["core-chain", "core-block-fetch", "core-block-commit", "core-digest", "a", "core-x"]);
    expect(waveIds(scheduleAt(range, "on-parse"))).toEqual([["core-chain"], ["a"], ["core-x"]]);
    await dispatch(range, "on-parse", runOf("on-parse"));
    expect(recorder.at("core-x", "on-parse", "start")).toBeGreaterThan(recorder.at("a", "on-parse", "end"));
    // Its entry is its own, not the core's.
    expect(waveIds(startHeightSchedule(range, { core: true, modules: [] }))).toEqual([["core-chain"]]);
    expect(waveIds(startHeightSchedule(range, { core: false, modules: ["core-x"] }))).toEqual([["core-x"]]);
    expect(waveIds(stopHeightSchedule(range, { core: true, modules: ["a", "core-x"] }))).toEqual([
      ["core-x"],
      ["a"],
      ["core-chain"],
    ]);
  });

  it("waits for the provider active in each range: an item handed over at 100", () => {
    const recorder = new Recorder();
    const at = (d: ModuleDeclaration) => registering(d, recorder, ["on-compute"]);
    const user = [at(provider("p1", ["x"])), at(provider("p2", ["x"])), at(consumer("c", ["x"])), at(consumer("u", ["block-header"]))];
    const graph = resolveGraph(
      graphInput(user, [entry("p1", 1, 99), entry("p2", 100), entry("c", 1), entry("u", 1)]),
    );
    expect(waveIds(scheduleAt(graph.rangeAt(1n) as ResolvedRange, "on-compute"))).toEqual([["p1", "u"], ["c"]]);
    expect(waveIds(scheduleAt(graph.rangeAt(100n) as ResolvedRange, "on-compute"))).toEqual([["p2", "u"], ["c"]]);
  });

  it("refuses to schedule a module whose required item has no single provider in the range (the cursor's, Q97)", () => {
    const recorder = new Recorder();
    const at = (d: ModuleDeclaration) => registering(d, recorder, ["on-compute", "on-after-db-write"]);
    const user = [at(provider("p1", ["x"])), at(provider("p2", ["x"])), at(provider("p3", ["x"])), at(consumer("c", ["x"]))];
    const graph = resolveGraph(
      graphInput(user, [entry("p1", 1, 20), entry("p2", 10, 20), entry("p3", 21), entry("c", 1)], { cursor: 20n }),
    );
    const atCursor = graph.rangeAt(20n) as ResolvedRange;
    expect(atCursor.range).toEqual({ from: 10n, to: 20n });
    expect(() => scheduleAt(atCursor, "on-compute")).toThrow(
      /c requires the item x, which no single part provides at heights 10–20/,
    );
    // RN-11's re-delivery there is in series and needs no provider.
    expect(waveIds(scheduleAt(atCursor, "on-after-db-write"))).toEqual([["p1"], ["p2"], ["c"]]);
    expect(waveIds(scheduleAt(graph.rangeAt(21n) as ResolvedRange, "on-compute"))).toEqual([["p3"], ["c"]]);
    expect(recorder.events).toEqual([]);
  });
});

describe("a callback that fails: what the dispatch gives back for RN-8's halt (task 5.4)", () => {
  it("in series: throws a CallbackFailure naming the point and the module, the error unchanged; later parts are not called", async () => {
    const recorder = new Recorder();
    const error = new Error("disk on fire");
    const a = registering(declaration("a"), recorder, ["on-db-write"]);
    const b = declaration("b", {
      points: { "on-db-write": recording(recorder, "b", "on-db-write", 1, () => Promise.reject(error)) },
    });
    const c = registering(declaration("c"), recorder, ["on-db-write"]);
    const failure = await rejection(dispatch(rangeOf([c, b, a]), "on-db-write", runOf("on-db-write")));
    expect(failure).toBeInstanceOf(CallbackFailure);
    expect(failure).toBeInstanceOf(Error);
    const { point, module, cause, message, name } = failure as CallbackFailure;
    expect({ point, module, name }).toEqual({ point: "on-db-write", module: "b", name: "CallbackFailure" });
    expect(cause).toBe(error);
    expect(message).toBe("the on-db-write callback of b failed: disk on fire");
    expect(recorder.starts("on-db-write")).toEqual(["a", "b"]);
    expect(recorder.at("c", "on-db-write", "start")).toBe(-1);
  });

  it("treats a callback that throws before returning a promise like one that rejects", async () => {
    const error = new Error("thrown at once");
    const m = declaration("m", {
      points: {
        "on-finalized": (() => {
          throw error;
        }) as unknown as () => Promise<void>,
      },
    });
    const failure = (await rejection(runSchedule(seriesOf("on-finalized", [m]), runOf("on-finalized")))) as CallbackFailure;
    expect(failure).toBeInstanceOf(CallbackFailure);
    expect([failure.point, failure.module, failure.cause]).toEqual(["on-finalized", "m", error]);
  });

  it("names the part whose invocation failed before its callback ran (the write handles refusing, say)", async () => {
    const recorder = new Recorder();
    const m = registering(declaration("m"), recorder, ["on-db-write"]);
    const error = new Error("not a part of the plan");
    const failure = (await rejection(
      runSchedule(seriesOf("on-db-write", [m]), {
        contextOf: (id) => new Contexts().of(id),
        invoke: () => Promise.reject(error),
      }),
    )) as CallbackFailure;
    expect([failure.point, failure.module, failure.cause]).toEqual(["on-db-write", "m", error]);
    expect(recorder.events).toEqual([]);
    // An invocation that throws before returning a promise, too.
    const thrown = (await rejection(
      runSchedule(seriesOf("on-db-write", [m]), {
        contextOf: (id) => new Contexts().of(id),
        invoke: () => {
          throw error;
        },
      }),
    )) as CallbackFailure;
    expect([thrown.point, thrown.module, thrown.cause]).toEqual(["on-db-write", "m", error]);
  });

  it("keeps a value that is not an Error as the cause, and shows it in the message", async () => {
    const m = declaration("m", { points: { "on-key": () => Promise.reject("just a string") } });
    const failure = (await rejection(runSchedule(seriesOf("on-key", [m]), runOf("on-key")))) as CallbackFailure;
    expect(failure.cause).toBe("just a string");
    expect(failure.message).toBe("the on-key callback of m failed: just a string");
    const none = declaration("n", { points: { "on-key": () => Promise.reject(undefined) } });
    const empty = (await rejection(runSchedule(seriesOf("on-key", [none]), runOf("on-key")))) as CallbackFailure;
    expect(empty.cause).toBeUndefined();
    expect("cause" in empty).toBe(true);
    expect(empty.message).toBe("the on-key callback of n failed: undefined");
  });

  it("in a wave: awaits the wave's other callbacks, starts nothing of the next wave, then throws the failure", async () => {
    for (const point of PARALLEL_POINTS) {
      const recorder = new Recorder();
      const error = new Error("parse failed");
      const user = [
        registering(part("a", ["block-header"], ["a-out"]), recorder, [point], { [point]: 8 }),
        declaration("b", {
          requires: ["block-header"],
          provides: [],
          migrations: [],
          points: { [point]: recording(recorder, "b", point, 1, () => Promise.reject(error)) },
        }),
        registering(part("c", ["block-header"]), recorder, [point], { [point]: 12 }),
        registering(part("d", ["a-out"]), recorder, [point]),
      ];
      const range = rangeOf(user);
      expect(waveIds(scheduleAt(range, point))).toEqual([["a", "b", "c"], ["d"]]);
      const failure = (await rejection(dispatch(range, point, runOf(point)))) as CallbackFailure;
      expect([failure.point, failure.module, failure.cause], point).toEqual([point, "b", error]);
      // Both others ended before the dispatch settled; the next wave never started.
      expect(recorder.at("a", point, "end"), point).toBeGreaterThan(-1);
      expect(recorder.at("c", point, "end"), point).toBeGreaterThan(-1);
      expect(recorder.at("d", point, "start"), point).toBe(-1);
    }
  });

  it("in a wave with two failures: throws the first in the point's order, although the other failed first", async () => {
    const recorder = new Recorder();
    const late = new Error("a failed late");
    const early = new Error("b failed early");
    const user = [
      declaration("b", {
        requires: ["block-header"],
        provides: [],
        migrations: [],
        points: { "on-compute": recording(recorder, "b", "on-compute", 1, () => Promise.reject(early)) },
      }),
      declaration("a", {
        requires: ["block-header"],
        provides: [],
        migrations: [],
        points: { "on-compute": recording(recorder, "a", "on-compute", 10, () => Promise.reject(late)) },
      }),
    ];
    const failure = (await rejection(dispatch(rangeOf(user), "on-compute", runOf("on-compute")))) as CallbackFailure;
    expect([failure.module, failure.cause]).toEqual(["a", late]);
  });

  it("in a wave: does not settle while another callback of the wave has not settled, never cancelling it (RN-17)", async () => {
    let release: () => void = () => undefined;
    const held = new Promise<void>((resolve) => {
      release = resolve;
    });
    const recorder = new Recorder();
    const error = new Error("fails at once");
    const user = [
      declaration("a", {
        requires: ["block-header"],
        provides: [],
        migrations: [],
        points: { "on-fetch": recording(recorder, "a", "on-fetch", 1, () => Promise.reject(error)) },
      }),
      declaration("b", {
        requires: ["block-header"],
        provides: [],
        migrations: [],
        points: { "on-fetch": recording(recorder, "b", "on-fetch", 1, () => held) },
      }),
    ];
    const running = dispatch(rangeOf(user), "on-fetch", runOf("on-fetch"));
    running.catch(() => undefined);
    expect(await settledWithin(running, 30)).toBe("pending");
    expect(recorder.at("a", "on-fetch", "start")).toBeGreaterThan(-1);
    expect(recorder.at("b", "on-fetch", "end")).toBe(-1);
    release();
    const failure = (await rejection(running)) as CallbackFailure;
    expect([failure.module, failure.cause]).toEqual(["a", error]);
    expect(recorder.at("b", "on-fetch", "end")).toBeGreaterThan(-1);
  });

  it("starts no module when a backbone part fails at a parallel point", async () => {
    const recorder = new Recorder();
    const error = new Error("no block");
    const backbone = [
      CORE_CHAIN,
      { ...CORE_BLOCK_FETCH, points: { "on-fetch": recording(recorder, "core-block-fetch", "on-fetch", 1, () => Promise.reject(error)) } },
      registering(CORE_BLOCK_COMMIT, recorder, ["on-fetch"]),
      CORE_DIGEST,
    ];
    const user = [registering(consumer("m", ["config"]), recorder, ["on-fetch"])];
    const failure = (await rejection(dispatch(rangeOf(user, backbone), "on-fetch", runOf("on-fetch")))) as CallbackFailure;
    expect([failure.module, failure.cause]).toEqual(["core-block-fetch", error]);
    expect(recorder.starts("on-fetch")).toEqual(["core-block-fetch"]);
  });

  it("refuses a schedule with a part that does not register its point before calling anything (the runner's error)", async () => {
    const recorder = new Recorder();
    const a = registering(declaration("a"), recorder, ["on-db-write"]);
    const b = registering(declaration("b"), recorder, ["on-compute"]);
    const schedule: PointSchedule<"on-db-write"> = { point: "on-db-write", waves: [[a], [b]] };
    const error = await rejection(runSchedule(schedule, runOf("on-db-write")));
    expect(error).not.toBeInstanceOf(CallbackFailure);
    expect(error).toBeInstanceOf(Error);
    expect((error as Error).message).toMatch(/b registers no on-db-write callback/);
    expect(recorder.events).toEqual([]);
  });
});

describe("on-start-height and on-stop-height (RN-9, RN-10): the core's parts and the modules whose entries start or stop", () => {
  function world(recorder: Recorder) {
    const both: PointName[] = ["on-start-height", "on-stop-height"];
    const backbone = [
      registering(CORE_CHAIN, recorder, both),
      registering(CORE_BLOCK_FETCH, recorder, both),
      CORE_BLOCK_COMMIT,
      registering(CORE_DIGEST, recorder, both),
    ];
    const user = [
      registering(provider("p", ["x"]), recorder, both),
      registering(consumer("c", ["x"]), recorder, both),
      registering(consumer("b", ["block-header"]), recorder, both),
      consumer("quiet", ["block-header"]),
    ];
    return rangeOf(user, backbone);
  }

  it("starts: the core's parts first, in their fixed order, then the starting modules in the range's order", () => {
    const range = world(new Recorder());
    const all = { core: true, modules: ["c", "p", "b", "quiet"] };
    expect(waveIds(startHeightSchedule(range, all))).toEqual([
      ["core-chain"],
      ["core-block-fetch"],
      ["core-digest"],
      ["b"],
      ["p"],
      ["c"],
    ]);
    expect(waveIds(startHeightSchedule(range, { core: false, modules: ["c", "p"] }))).toEqual([["p"], ["c"]]);
    expect(waveIds(startHeightSchedule(range, { core: true, modules: [] }))).toEqual([
      ["core-chain"],
      ["core-block-fetch"],
      ["core-digest"],
    ]);
    expect(waveIds(startHeightSchedule(range, { core: false, modules: [] }))).toEqual([]);
    expect(startHeightSchedule(range, all).point).toBe("on-start-height");
  });

  it("stops: the stopping modules in reverse order, then the core's parts in their fixed order", () => {
    const range = world(new Recorder());
    expect(waveIds(stopHeightSchedule(range, { core: true, modules: ["p", "b", "c", "quiet"] }))).toEqual([
      ["c"],
      ["p"],
      ["b"],
      ["core-chain"],
      ["core-block-fetch"],
      ["core-digest"],
    ]);
    expect(waveIds(stopHeightSchedule(range, { core: false, modules: ["p", "c"] }))).toEqual([["c"], ["p"]]);
    expect(waveIds(stopHeightSchedule(range, { core: true, modules: [] }))).toEqual([
      ["core-chain"],
      ["core-block-fetch"],
      ["core-digest"],
    ]);
    expect(stopHeightSchedule(range, { core: false, modules: [] }).point).toBe("on-stop-height");
  });

  it("runs them in series through runSchedule", async () => {
    const recorder = new Recorder();
    const range = world(recorder);
    await runSchedule(stopHeightSchedule(range, { core: true, modules: ["p", "c"] }), runOf("on-stop-height"));
    expect(recorder.starts("on-stop-height")).toEqual(["c", "p", "core-chain", "core-block-fetch", "core-digest"]);
    expect(recorder.waves("on-stop-height")).toEqual([["c"], ["p"], ["core-chain"], ["core-block-fetch"], ["core-digest"]]);
  });

  it("refuses a module entry that is not a module active in the range, or a backbone part named as a module", () => {
    const range = world(new Recorder());
    for (const schedule of [startHeightSchedule, stopHeightSchedule]) {
      expect(() => schedule(range, { core: false, modules: ["p", "gone"] })).toThrow(
        /gone is not a module active at heights from 1 on/,
      );
      expect(() => schedule(range, { core: false, modules: ["core-chain"] })).toThrow(
        /core-chain is not a module active at heights from 1 on/,
      );
    }
  });

  it("scheduleAt refuses on-start-db, on-start-height and on-stop-height, which need another order or the entries", () => {
    const range = world(new Recorder());
    expect(() => scheduleAt(range, "on-start-db")).toThrow(/on-start-db runs in the migration runner's startup order/);
    expect(() => scheduleAt(range, "on-start-height")).toThrow(/startHeightSchedule/);
    expect(() => scheduleAt(range, "on-stop-height")).toThrow(/stopHeightSchedule/);
  });
});
