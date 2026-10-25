import fc from "fast-check";
import { describe, expect, it } from "vitest";
import type { ModuleDeclaration, PointName } from "../../src/modules/declaration.js";
import {
  BACKBONE_ORDER,
  GRAPH_RULES,
  type GraphInput,
  type ResolvedGraph,
  type ResolvedRange,
  resolveGraph,
  resolveWith,
} from "../../src/modules/graph.js";
import {
  dispatch,
  isParallelPoint,
  PARALLEL_POINTS,
  type PointRun,
  runSchedule,
  scheduleAt,
  seriesOf,
} from "../../src/runner/dispatch.js";
import { declaration } from "../modules/declarations.js";
import { BACKBONE, blockItem, entry, graphInput, S } from "../modules/graph-fixtures.js";
import { Contexts, Recorder, recording, runOf } from "./fixtures.js";

/**
 * A38 `[PROP]` (task 5.1; RN-3, `design.md` §2): for random acyclic module graphs of up to 12 modules, resolved by
 * `resolveGraph` on the test backbone and run through the dispatch with callbacks that record when they start and end
 * (a logical clock: the order of the recorder's events), the `on-db-write` order is the backbone, then Kahn order with
 * the smallest id by UTF-8 bytes first, then `core-digest`; and at the parallel points no callback starts before every
 * registered callback of a module it requires — directly or through modules that do not register the point — has
 * completed. The oracle is this file's own: the graph's requirements as generated, Kahn's algorithm with
 * `Buffer.compare` on UTF-8 bytes, and the backbone's fixed order written out; none of it comes from `resolveGraph`.
 * Each committed negative control — a dispatcher that ties by the order given or by a locale, one that starts a wave's
 * module before its provider completes, one that runs `core-digest` anywhere but last at `on-db-write` — fails exactly
 * the check it controls and passes the other two.
 */

/** fast-check's seed and run count for every property here. */
const SEED = 20261025;
const RUNS = 200;

/**
 * Module ids to draw from: neighbours whose order differs by UTF-8 bytes, by Czech collation ("ch" after "h"), by
 * numeric collation ("m9" before "m10") and with `-` and digits, so that a wrong tie-break shows.
 */
const POOL = [
  "a", "a-b", "a1", "ab", "b", "b-mod", "c", "ch", "ch-x", "d", "d-mod", "h",
  "h1", "i", "m1", "m10", "m2", "m9", "x", "x-y", "y", "z", "z-a", "zz",
] as const;

/** The points A38 is about: the three parallel ones and `on-db-write`. */
const TESTED = ["on-fetch", "on-parse", "on-compute", "on-db-write"] as const;
type Tested = (typeof TESTED)[number];

/** The test backbone's ids in RN-3's fixed order (`graph-fixtures.ts`), written out. */
const BACKBONE_IDS = ["core-chain", "core-block-fetch", "core-block-commit", "core-digest"] as const;

/** What each test backbone part requires an item of (`graph-fixtures.ts`). */
const BACKBONE_REQUIRES: Readonly<Record<string, readonly string[]>> = {
  "core-chain": [],
  "core-block-fetch": ["core-chain"],
  "core-block-commit": ["core-block-fetch"],
  "core-digest": ["core-block-commit"],
};

/** The backbone items a random module may require, and the part that provides each. */
const BACKBONE_ITEMS: Readonly<Record<string, string>> = {
  config: "core-chain",
  "node-client": "core-chain",
  "block-header": "core-block-fetch",
  "ledger-version": "core-block-fetch",
  blocks: "core-block-commit",
  "digest-tables": "core-digest",
};

/** One random module: its id, the modules it requires an item of, the backbone items it requires, its points. */
interface ModuleSpec {
  readonly id: string;
  readonly requires: readonly string[];
  readonly backbone: readonly string[];
  readonly points: readonly Tested[];
  readonly wait: Readonly<Record<Tested, number>>;
}

/** One random graph: the modules in the order they are given in, and the points of each backbone part. */
interface GraphSpec {
  readonly modules: readonly ModuleSpec[];
  readonly backbonePoints: Readonly<Record<string, readonly Tested[]>>;
  readonly backboneWait: Readonly<Record<string, Readonly<Record<Tested, number>>>>;
}

const waits = fc
  .array(fc.nat({ max: 4 }), { minLength: TESTED.length, maxLength: TESTED.length })
  .map((ns) => Object.fromEntries(TESTED.map((point, index) => [point, ns[index] as number])) as Record<Tested, number>);

/**
 * Random acyclic graphs of 1 to 12 modules: a random rank orders the modules (independently of the order they are given
 * in), and each requires an item of a lower-ranked module with probability 1/3, and up to two backbone items; one with
 * no requirement requires `block-header` (MD-2). Each module and backbone part registers a random subset of the
 * points; `core-digest` always registers `on-db-write`.
 */
const graphs: fc.Arbitrary<GraphSpec> = fc
  .uniqueArray(fc.constantFrom(...POOL), { minLength: 1, maxLength: 12 })
  .chain((ids) => {
    const n = ids.length;
    const indexes = [...Array(n).keys()];
    return fc
      .record({
        ranks: fc.shuffledSubarray(indexes, { minLength: n, maxLength: n }),
        edges: fc.array(fc.integer({ min: 0, max: 2 }), { minLength: n * n, maxLength: n * n }),
        backbone: fc.array(fc.subarray(Object.keys(BACKBONE_ITEMS), { maxLength: 2 }), { minLength: n, maxLength: n }),
        points: fc.array(fc.subarray([...TESTED]), { minLength: n, maxLength: n }),
        wait: fc.array(waits, { minLength: n, maxLength: n }),
        backbonePoints: fc.array(fc.subarray([...TESTED]), { minLength: 4, maxLength: 4 }),
        backboneWait: fc.array(waits, { minLength: 4, maxLength: 4 }),
      })
      .map((r): GraphSpec => {
        const rank = (i: number) => r.ranks.indexOf(i);
        const modules = ids.map((id, i): ModuleSpec => {
          const requires = indexes.filter((j) => rank(j) < rank(i) && r.edges[i * n + j] === 0).map((j) => ids[j] as string);
          const backbone = r.backbone[i] as string[];
          return {
            id,
            requires,
            backbone: requires.length + backbone.length === 0 ? ["block-header"] : backbone,
            points: r.points[i] as Tested[],
            wait: r.wait[i] as Record<Tested, number>,
          };
        });
        const backbonePoints = Object.fromEntries(
          BACKBONE_IDS.map((id, k) => {
            const points = r.backbonePoints[k] as Tested[];
            return [id, id === "core-digest" && !points.includes("on-db-write") ? [...points, "on-db-write" as Tested] : points];
          }),
        );
        const backboneWait = Object.fromEntries(BACKBONE_IDS.map((id, k) => [id, r.backboneWait[k] as Record<Tested, number>]));
        return { modules, backbonePoints, backboneWait };
      });
  });

// ── the oracle ──────────────────────────────────────────────────────────────────────────────────────────────────────

const isBackboneId = (id: string): boolean => (BACKBONE_IDS as readonly string[]).includes(id);

function moduleOf(spec: GraphSpec, id: string): ModuleSpec {
  return spec.modules.find((m) => m.id === id) as ModuleSpec;
}

/** Whether `id` (a module or a backbone part) registers `point`. */
function registers(spec: GraphSpec, id: string, point: Tested): boolean {
  return isBackboneId(id) ? (spec.backbonePoints[id] as readonly Tested[]).includes(point) : moduleOf(spec, id).points.includes(point);
}

/** The parts `id` requires an item of, directly. */
function providersOf(spec: GraphSpec, id: string): readonly string[] {
  if (isBackboneId(id)) return BACKBONE_REQUIRES[id] as readonly string[];
  const m = moduleOf(spec, id);
  return [...m.requires, ...m.backbone.map((item) => BACKBONE_ITEMS[item] as string)];
}

/** Every part on a requirement path from `id`. */
function upstream(spec: GraphSpec, id: string): Set<string> {
  const seen = new Set<string>();
  const stack = [...providersOf(spec, id)];
  while (stack.length > 0) {
    const next = stack.pop() as string;
    if (seen.has(next)) continue;
    seen.add(next);
    stack.push(...providersOf(spec, next));
  }
  return seen;
}

const byBytes = (a: string, b: string): number => Buffer.compare(Buffer.from(a, "utf8"), Buffer.from(b, "utf8"));

/** RN-3's order of the modules: Kahn's algorithm over their requirements, the ready one with the smallest id first. */
function kahnOrder(spec: GraphSpec): string[] {
  const left = new Set(spec.modules.map((m) => m.id));
  const order: string[] = [];
  while (left.size > 0) {
    const ready = [...left].filter((id) => moduleOf(spec, id).requires.every((p) => !left.has(p))).sort(byBytes);
    const pick = ready[0] as string;
    order.push(pick);
    left.delete(pick);
  }
  return order;
}

/**
 * The waves design.md §2 gives a parallel point: the backbone parts registered there, one at a time in their fixed
 * order, then Kahn's waves of the registered modules — a module one wave after the latest registered module on a
 * requirement path from it —, each wave in RN-3's order.
 */
function expectedWaves(spec: GraphSpec, point: Tested): string[][] {
  const backbone = BACKBONE_IDS.filter((id) => registers(spec, id, point)).map((id) => [id]);
  const order = kahnOrder(spec);
  const level = new Map<string, number>();
  for (const id of order) {
    const before = [...upstream(spec, id)].filter((q) => !isBackboneId(q) && registers(spec, q, point));
    level.set(id, before.length === 0 ? 0 : 1 + Math.max(...before.map((q) => level.get(q) as number)));
  }
  const waves: string[][] = [];
  for (const id of order.filter((id) => registers(spec, id, point))) {
    const at = level.get(id) as number;
    while (waves.length <= at) waves.push([]);
    (waves[at] as string[]).push(id);
  }
  return [...backbone, ...waves.filter((wave) => wave.length > 0)];
}

// ── running a graph ─────────────────────────────────────────────────────────────────────────────────────────────────

/** How a graph is resolved and its points dispatched: the real ones, or a negative control's. */
interface Pipeline {
  readonly resolve: (input: GraphInput) => ResolvedGraph;
  readonly dispatch: <P extends PointName>(range: ResolvedRange, point: P, run: PointRun<P>) => Promise<void>;
}

const REAL: Pipeline = { resolve: resolveGraph, dispatch };

/** The declarations of `spec`, each callback recording itself in `recorder`. */
function declarationsOf(spec: GraphSpec, recorder: Recorder) {
  const callbacks = (id: string, points: readonly Tested[], wait: Readonly<Record<Tested, number>>) =>
    Object.fromEntries(points.map((point) => [point, recording(recorder, id, point, wait[point])]));
  const backbone = BACKBONE.map((d) => ({
    ...d,
    points: callbacks(d.id, spec.backbonePoints[d.id] as readonly Tested[], spec.backboneWait[d.id] as Record<Tested, number>),
  }));
  const user = spec.modules.map((m) =>
    declaration(m.id, {
      requires: [...m.requires.map((id) => `${id}-out`), ...m.backbone],
      provides: [blockItem(`${m.id}-out`)],
      migrations: [],
      points: callbacks(m.id, m.points, m.wait),
    }),
  );
  return { backbone, user };
}

/** Resolves `spec` with every module from S and dispatches the tested points at S, in RN-1's order. */
async function observe(spec: GraphSpec, pipeline: Pipeline): Promise<Recorder> {
  const recorder = new Recorder();
  const { backbone, user } = declarationsOf(spec, recorder);
  const graph = pipeline.resolve(graphInput(user, user.map((d) => entry(d.id, 1)), { backbone }));
  const range = graph.rangeAt(S) as ResolvedRange;
  const contexts = new Contexts();
  for (const point of TESTED) await pipeline.dispatch(range, point, runOf(point, contexts));
  return recorder;
}

// ── A38's checks ────────────────────────────────────────────────────────────────────────────────────────────────────

/** A38: `on-db-write` runs the backbone parts present in their fixed order, then the modules in Kahn order. */
function checkWriteOrder(spec: GraphSpec, recorder: Recorder): void {
  const observed = recorder.starts("on-db-write").filter((id) => id !== "core-digest");
  const expected = [
    ...BACKBONE_IDS.filter((id) => id !== "core-digest" && registers(spec, id, "on-db-write")),
    ...kahnOrder(spec).filter((id) => registers(spec, id, "on-db-write")),
  ];
  expect(observed).toEqual(expected);
}

/** A38: `core-digest` runs at `on-db-write` once, last. */
function checkDigestLast(_spec: GraphSpec, recorder: Recorder): void {
  const observed = recorder.starts("on-db-write");
  expect(observed.filter((id) => id === "core-digest")).toHaveLength(1);
  expect(observed.at(-1)).toBe("core-digest");
}

let waitsChecked = 0;
let waitsThroughOthers = 0;

/** A38: at a parallel point no callback starts before every registered callback of a module it requires has ended. */
function checkParallelWaits(spec: GraphSpec, recorder: Recorder): void {
  for (const point of PARALLEL_POINTS) {
    const parts = [...BACKBONE_IDS, ...spec.modules.map((m) => m.id)].filter((id) => registers(spec, id, point));
    for (const id of parts) {
      const direct = providersOf(spec, id);
      for (const q of upstream(spec, id)) {
        if (!registers(spec, q, point)) continue;
        const ended = recorder.at(q, point, "end");
        expect(ended, `${q} at ${point}`).toBeGreaterThanOrEqual(0);
        expect(recorder.at(id, point, "start"), `${id} after ${q} at ${point}`).toBeGreaterThan(ended);
        waitsChecked++;
        if (!direct.includes(q)) waitsThroughOthers++;
      }
    }
  }
}

/** Every registered callback of the tested points runs exactly once, and nothing else runs. */
function checkEachOnce(spec: GraphSpec, recorder: Recorder): void {
  for (const point of TESTED) {
    const parts = [...BACKBONE_IDS, ...spec.modules.map((m) => m.id)].filter((id) => registers(spec, id, point));
    expect([...recorder.starts(point)].sort(), point).toEqual([...parts].sort());
    const ends = recorder.events.filter((e) => e.point === point && e.kind === "end").map((e) => e.module);
    expect(ends.sort(), point).toEqual([...parts].sort());
  }
}

/** RN-3: `on-db-write` is in series — each callback ends before the next starts. */
function checkInSeries(recorder: Recorder): void {
  const events = recorder.events.filter((e) => e.point === "on-db-write");
  events.forEach((event, index) => {
    expect(event.kind).toBe(index % 2 === 0 ? "start" : "end");
    if (index % 2 === 1) expect(event.module).toBe(events[index - 1]?.module);
  });
}

let concurrentWaves = 0;

/** design.md §2: the parallel points run as Kahn's waves, each wave's callbacks all started before any ends. */
function checkWaves(spec: GraphSpec, recorder: Recorder): void {
  for (const point of PARALLEL_POINTS) {
    const seen = recorder.waves(point);
    expect(seen, point).toEqual(expectedWaves(spec, point));
    concurrentWaves += seen.filter((wave) => wave.length > 1).length;
  }
}

describe("A38: on-db-write's order and the parallel points' waits for random acyclic graphs (RN-3)", () => {
  it(`holds for random acyclic graphs of up to 12 modules (property, seed ${SEED})`, async () => {
    waitsChecked = 0;
    waitsThroughOthers = 0;
    concurrentWaves = 0;
    let largest = 0;
    let modulesWriting = 0;
    await fc.assert(
      fc.asyncProperty(graphs, async (spec) => {
        const recorder = await observe(spec, REAL);
        checkWriteOrder(spec, recorder);
        checkDigestLast(spec, recorder);
        checkParallelWaits(spec, recorder);
        checkEachOnce(spec, recorder);
        checkInSeries(recorder);
        checkWaves(spec, recorder);
        largest = Math.max(largest, spec.modules.length);
        modulesWriting += spec.modules.filter((m) => m.points.includes("on-db-write")).length;
      }),
      { seed: SEED, numRuns: RUNS },
    );
    // Not vacuous: graphs of 12 modules, modules writing, waits checked (many on a part the module requires only
    // through others), and waves running several callbacks at once.
    expect(largest).toBe(12);
    expect(modulesWriting).toBeGreaterThan(300);
    expect(waitsChecked).toBeGreaterThan(2000);
    expect(waitsThroughOthers).toBeGreaterThan(200);
    expect(concurrentWaves).toBeGreaterThan(200);
  }, 120_000);
});

// ── negative controls ───────────────────────────────────────────────────────────────────────────────────────────────

const CHECKS = {
  "the on-db-write order": checkWriteOrder,
  "core-digest last": checkDigestLast,
  "the parallel points' waits": checkParallelWaits,
} as const;
type CheckName = keyof typeof CHECKS;

/** A dispatcher whose parallel points use `waves` instead of the real schedule's. */
function withParallelWaves(waves: (range: ResolvedRange, point: PointName) => readonly (readonly ModuleDeclaration[])[]): Pipeline {
  function wrong<P extends PointName>(range: ResolvedRange, point: P, run: PointRun<P>): Promise<void> {
    if (!isParallelPoint(point)) return dispatch(range, point, run);
    return runSchedule<P>({ point, waves: waves(range, point) }, run);
  }
  return { resolve: resolveGraph, dispatch: wrong };
}

/** Every callback of a parallel point in one wave: nothing waits for its providers. */
const allAtOnce = withParallelWaves((range, point) => [scheduleAt(range, point).waves.flat()]);

/** The backbone as the real schedule has it, then waves that wait only for registered providers required directly. */
const directWaitsOnly = withParallelWaves((range, point) => {
  const isBackbone = (d: ModuleDeclaration) => BACKBONE_ORDER.includes(d.id);
  const registered = (d: ModuleDeclaration) => typeof d.points[point] === "function";
  const backbone = range.order.filter((d) => isBackbone(d) && registered(d)).map((d) => [d]);
  const modules = range.order.filter((d) => !isBackbone(d) && registered(d));
  const level = new Map<string, number>();
  for (const d of modules) {
    const direct = d.requires.map((item) => range.providerOf.get(item) as string).filter((id) => level.has(id));
    level.set(d.id, direct.length === 0 ? 0 : 1 + Math.max(...direct.map((id) => level.get(id) as number)));
  }
  const waves: ModuleDeclaration[][] = [];
  for (const d of modules) {
    const at = level.get(d.id) as number;
    while (waves.length <= at) waves.push([]);
    (waves[at] as ModuleDeclaration[]).push(d);
  }
  return [...backbone, ...waves.filter((wave) => wave.length > 0)];
});

/** `on-db-write` in the order of every other point: `core-digest` in its backbone place. */
function inBackbonePlace<P extends PointName>(range: ResolvedRange, point: P, run: PointRun<P>): Promise<void> {
  if (point !== "on-db-write") return dispatch(range, point, run);
  return runSchedule<P>(seriesOf<P>(point, range.order), run);
}
const digestInPlace: Pipeline = { resolve: resolveGraph, dispatch: inBackbonePlace };

/** The graph resolved with another tie-break among ready modules, dispatched for real. */
const tiedBy = (compare: (a: string, b: string) => number): Pipeline => ({
  resolve: (input) => resolveWith(input, GRAPH_RULES, compare),
  dispatch,
});

const CONTROLS: readonly { readonly name: string; readonly pipeline: Pipeline; readonly fails: CheckName }[] = [
  { name: "ties by the order the modules are given in", pipeline: tiedBy(() => 0), fails: "the on-db-write order" },
  {
    name: "ties by Czech collation",
    pipeline: tiedBy((a, b) => a.localeCompare(b, "cs")),
    fails: "the on-db-write order",
  },
  {
    name: "ties by numeric collation",
    pipeline: tiedBy((a, b) => a.localeCompare(b, "en", { numeric: true })),
    fails: "the on-db-write order",
  },
  { name: "starts every callback of a parallel point at once", pipeline: allAtOnce, fails: "the parallel points' waits" },
  {
    name: "waits only for the registered providers a module requires directly",
    pipeline: directWaitsOnly,
    fails: "the parallel points' waits",
  },
  { name: "runs core-digest in its backbone place at on-db-write", pipeline: digestInPlace, fails: "core-digest last" },
];

describe.each(CONTROLS)("negative control: a dispatcher that $name", ({ pipeline, fails }) => {
  it.each(Object.keys(CHECKS) as CheckName[])(`fails %s only if that is the check it controls (seed ${SEED})`, async (name) => {
    const check = CHECKS[name];
    const result = await fc.check(
      fc.asyncProperty(graphs, async (spec) => check(spec, await observe(spec, pipeline))),
      { seed: SEED, numRuns: RUNS },
    );
    expect(result.failed, result.failed ? String(result.errorInstance) : "passed").toBe(name === fails);
  }, 120_000);
});
