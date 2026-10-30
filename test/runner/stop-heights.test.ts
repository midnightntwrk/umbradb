import { afterAll, beforeAll, describe, expect, it } from "vitest";
import type { ModuleDeclaration, PointName } from "../../src/modules/declaration.js";
import type { ResolvedRange } from "../../src/modules/graph.js";
import { type EntryBoundary, isBackbonePart, type PointSchedule, seriesOf } from "../../src/runner/dispatch.js";
import { InMemoryBlockSource } from "../../src/runner/in-memory-source.js";
import { chainDataHeaders, readChainDataView } from "../../src/runner/envelope.js";
import { FinalizedLoop, HeightFailure, type LoopInput } from "../../src/runner/loop.js";
import type { ProcessingEnd, ProcessStatus } from "../../src/runner/process.js";
import { createdDirectory, cursorIn, PROCESS_BACKENDS, type ProcessDatabase } from "./process-backends.js";
import { core, entryOf, loggingModule, settle, startProcess, testBuild } from "./process-build.js";
import type { DatabaseParts } from "../../src/config/database-parts.js";

/**
 * Start and stop heights through the process, including the callbacks delivered again at the cursor after a restart,
 * and a raised core stop. With the core's stop at 10 and the head at 20, the cursor ends at 10, the stopping modules
 * and then the core get `on-stop-height`, and the state is `stopped` and ready. A restart at cursor 10 processes
 * nothing and fires the core's `on-stop-height` again. Also tested: the orders, handles and failures of the two points.
 * [RN-9, RN-10, RN-11, CF-6, A45]
 */

const POINTS: readonly PointName[] = [
  "on-fetch",
  "on-parse",
  "on-start-height",
  "on-compute",
  "on-db-write",
  "on-after-db-write",
  "on-stop-height",
];

/** The modules: `a` and `b` stop with the core at 10, `c` runs on, `d` stops at 6, `e` starts at 4. [A45] */
function modules(log: string[]): ModuleDeclaration[] {
  const reader = loggingModule("reader", log, [], {
    points: {
      async "on-start-api"(_p, api) {
        // The module states its height itself, with the envelope's helpers. [RN-16]
        api.http("GET", "/height", async (_request, read) => ({
          status: 200,
          headers: chainDataHeaders(await readChainDataView(read)),
          body: { height: read.height },
        }));
      },
    },
  });
  return [...["a", "b", "c", "d", "e"].map((id) => loggingModule(id, log, POINTS)), reader];
}

/** The configuration on `database`, with the core's stop. [A45] */
function entries(database: DatabaseParts, user: readonly ModuleDeclaration[], stop: number | undefined) {
  const of = (id: string) => user.find((part) => part.id === id) as ModuleDeclaration;
  return [
    core(database, 1, { ...(stop === undefined ? {} : { stop }), extra: { listen: { api: "127.0.0.1:0" } } }),
    entryOf(of("a"), 1, {}, 10),
    entryOf(of("b"), 1, {}, 10),
    entryOf(of("c"), 1),
    entryOf(of("d"), 1, {}, 6),
    entryOf(of("e"), 4),
    entryOf(of("reader"), 1),
  ];
}

/** What one run of the process showed. */
interface RunObservation {
  readonly log: readonly string[];
  /** The process's own log lines. */
  readonly lines: readonly string[];
  readonly status: ProcessStatus;
  readonly ended: ProcessingEnd | "waiting";
  /** The module API's `X-Umbra-Height` while the process was up after processing. */
  readonly servedHeight: string | null;
  readonly cursor: number | null;
}

/** Runs the process on `db` with the core's `stop` and head 20 until it stops or waits, observes it, stops it. */
async function run(
  db: ProcessDatabase,
  stop: number | undefined,
  loop?: new (input: LoopInput) => FinalizedLoop,
): Promise<RunObservation> {
  const log: string[] = [];
  const user = modules(log);
  const build = testBuild(user, { log });
  const source = new InMemoryBlockSource({ head: 20n });
  const lines: string[] = [];
  const handle = startProcess({
    declarations: build.declarations,
    config: { data: { entries: entries(db.setting, user, stop) } },
    source,
    log: (line) => createdDirectory(line) || lines.push(line),
    ...(loop === undefined ? {} : { loop }),
  });
  let observation: Omit<RunObservation, "cursor">;
  try {
    const ended = await settle(handle, source, 20n);
    const { api } = await handle.started;
    const response = await fetch(`http://${api!.host}:${api!.port}/height`);
    const servedHeight = response.headers.get("x-umbra-height");
    observation = { log: [...log], lines: [...lines], status: handle.status(), ended, servedHeight };
  } finally {
    await handle.stop();
  }
  return { ...observation, cursor: await cursorIn(db) };
}

const at = (log: readonly string[], point: PointName, height: number): string[] =>
  log.filter((line) => line.includes(` ${point}@${height}`));

/** Whether `log` holds any call of a height above `height`. */
const anyAbove = (log: readonly string[], height: number): boolean =>
  log.some((line) => Number(/@(\d+)/.exec(line)?.[1]) > height);

/** The oracle over the first run (stop 10, head 20) and the restart at cursor 10: every problem, none when it holds.
 *  [A45] */
function a45Problems(first: RunObservation, restart: RunObservation): string[] {
  const problems: string[] = [];
  const stops = ["b on-stop-height@10", "a on-stop-height@10", "core-chain on-stop-height@10 core"];
  if (first.cursor !== 10) problems.push(`the cursor ended at ${first.cursor}, not at 10`);
  if (anyAbove(first.log, 10)) problems.push("a callback ran for a height above the core's stop");
  if (at(first.log, "on-stop-height", 10).join("; ") !== stops.join("; ")) {
    problems.push(`on-stop-height at 10 ran ${at(first.log, "on-stop-height", 10).join("; ")}`);
  }
  for (const [name, observed] of [
    ["the first run", first],
    ["the restart", restart],
  ] as const) {
    if (observed.status.state !== "stopped" || !observed.status.ready) {
      problems.push(`${name} is ${observed.status.state}${observed.status.ready ? "" : ", not ready"}`);
    }
    if (observed.servedHeight !== "10") problems.push(`${name} served reads at ${observed.servedHeight}, not at 10`);
  }
  if (restart.cursor !== 10) problems.push(`the restart left the cursor at ${restart.cursor}`);
  if (restart.log.some((line) => / on-(fetch|compute|db-write|start-height)@/.test(line))) {
    problems.push("the restart processed a height");
  }
  if (!restart.log.includes("core-chain on-stop-height@10 core")) {
    problems.push("the restart did not fire the core's on-stop-height at 10 again");
  }
  if (at(restart.log, "on-stop-height", 10).join("; ") !== stops.join("; ")) {
    problems.push(`the restart's on-stop-height at 10 ran ${at(restart.log, "on-stop-height", 10).join("; ")}`);
  }
  return problems;
}

/** A negative control's loop: at `on-stop-height` the core's parts run first, then the stopping modules. */
class CoreStopsFirst extends FinalizedLoop {
  protected override stopSchedule(range: ResolvedRange, stopping: EntryBoundary): PointSchedule<"on-stop-height"> {
    const parts = super.stopSchedule(range, stopping).waves.flat();
    return seriesOf("on-stop-height", [...parts.filter(isBackbonePart), ...parts.filter((part) => !isBackbonePart(part))]);
  }
}

/** A negative control's loop: a restart delivers nothing again at the cursor. [RN-11] */
class NoRedelivery extends FinalizedLoop {
  protected override async redeliver(): Promise<void> {}
}

describe.each(PROCESS_BACKENDS)("start and stop heights (RN-9, RN-10, RN-11) on $name", (backend) => {
  beforeAll(() => backend.start(), 180_000);
  afterAll(() => backend.stop(), 60_000);

  describe("A45: the core's stop (RN-10)", () => {
    it("A45: the cursor ends at 10, stopping modules then the core get on-stop-height, stopped and ready; a restart processes nothing and fires the core's on-stop-height again", async () => {
      const db = await backend.database();
      const first = await run(db, 10);
      const restart = await run(db, 10);
      expect(a45Problems(first, restart)).toEqual([]);
      expect(first.ended).toEqual({ kind: "stopped", height: 10n, core: true, upgrade: null });
      expect(restart.ended).toEqual({ kind: "stopped", height: 10n, core: true, upgrade: null });
      expect(first.status).toMatchObject({ state: "stopped", ready: true, cursor: 10n, conditions: [] });
      expect(first.status.ended).toEqual(first.ended);
      expect(first.lines).toEqual(["processing stopped at 10: the core's stop"]);
      // The restart delivered on-after-db-write for 10 again to the modules active there, in order, before the stops.
      // [RN-11]
      expect(restart.log).toEqual([
        "a on-after-db-write@10",
        "b on-after-db-write@10",
        "c on-after-db-write@10",
        "e on-after-db-write@10",
        "b on-stop-height@10",
        "a on-stop-height@10",
        "core-chain on-stop-height@10 core",
      ]);
    }, 180_000);

    it("negative control: a loop whose core gets on-stop-height before the stopping modules fails A45", async () => {
      const db = await backend.database();
      const first = await run(db, 10, CoreStopsFirst);
      const restart = await run(db, 10, CoreStopsFirst);
      expect(a45Problems(first, restart)).toEqual([
        "on-stop-height at 10 ran core-chain on-stop-height@10 core; b on-stop-height@10; a on-stop-height@10",
        "the restart's on-stop-height at 10 ran core-chain on-stop-height@10 core; b on-stop-height@10; a on-stop-height@10",
      ]);
    }, 180_000);

    it("negative control: a loop that does not fire the core's on-stop-height again after a restart at the stop fails A45", async () => {
      const db = await backend.database();
      const first = await run(db, 10, NoRedelivery);
      const restart = await run(db, 10, NoRedelivery);
      expect(a45Problems(first, restart)).toEqual([
        "the restart did not fire the core's on-stop-height at 10 again",
        "the restart's on-stop-height at 10 ran ",
      ]);
    }, 180_000);

    it("raising the core's stop after it stopped goes on to the new stop; the modules stopping at 10 are re-delivered, the core is not (CF-6, RN-11)", async () => {
      const db = await backend.database();
      await run(db, 10);
      const raised = await run(db, 20);
      expect(raised.ended).toEqual({ kind: "stopped", height: 20n, core: true, upgrade: null });
      expect(raised.cursor).toBe(20);
      expect(at(raised.log, "on-stop-height", 10)).toEqual(["b on-stop-height@10", "a on-stop-height@10"]);
      expect(at(raised.log, "on-stop-height", 20)).toEqual(["core-chain on-stop-height@20 core"]);
      expect(raised.log.filter((line) => line.endsWith("on-db-write@11"))).toEqual(["c on-db-write@11", "e on-db-write@11"]);
      expect(raised.servedHeight).toBe("20");
      // Without a stop it would wait at the head: no stop of its own.
      const unbounded = await run(db, undefined);
      expect(unbounded.ended).toBe("waiting");
      expect(unbounded.status.state).toBe("following");
      expect(at(unbounded.log, "on-stop-height", 20)).toEqual([]);
    }, 180_000);

    it("a stop during the core's last height ends processing at the core's stop, the process stopping (RN-10, RN-13)", async () => {
      const db = await backend.database();
      let stopping: Promise<void> | undefined;
      const handles: { current?: ReturnType<typeof startProcess> } = {};
      const stopper = loggingModule("stopper", [], [], {
        points: {
          async "on-db-write"(_p, b) {
            if (b.height === 3n) stopping = handles.current?.stop();
          },
        },
      });
      const build = testBuild([stopper]);
      const source = new InMemoryBlockSource({ head: 5n });
      handles.current = startProcess({
        declarations: build.declarations,
        config: { data: { entries: [core(db.setting, 1, { stop: 3 }), entryOf(stopper, 1)] } },
        source,
        log: () => undefined,
      });
      expect(await handles.current.ended).toEqual({ kind: "stopped", height: 3n, core: true, upgrade: null });
      expect(handles.current.status()).toMatchObject({ state: "stopping", ready: false });
      await stopping;
      expect(await cursorIn(db)).toBe(3);
    }, 180_000);

    it("a core stop below the cursor processes nothing and fires the core's on-stop-height at the cursor (Q109)", async () => {
      const db = await backend.database();
      await run(db, 10);
      const lowered = await run(db, 5);
      expect(lowered.ended).toEqual({ kind: "stopped", height: 10n, core: true, upgrade: null });
      expect(lowered.cursor).toBe(10);
      expect(lowered.log.some((line) => / on-(fetch|db-write)@/.test(line))).toBe(false);
      expect(at(lowered.log, "on-stop-height", 10)).toEqual([
        "b on-stop-height@10",
        "a on-stop-height@10",
        "core-chain on-stop-height@10 core",
      ]);
    }, 180_000);
  });

  describe("RN-9 and RN-10's orders and handles", () => {
    it("fires on-start-height before on-compute at an entry's start, the core's first, then graph order; a stopped module runs no more", async () => {
      const db = await backend.database();
      const first = await run(db, 10);
      const one = first.log.filter((line) => line.endsWith("@1") || line.endsWith("@1 core"));
      expect(one.slice(0, 14)).toEqual([
        "a on-fetch@1",
        "b on-fetch@1",
        "c on-fetch@1",
        "d on-fetch@1",
        "a on-parse@1",
        "b on-parse@1",
        "c on-parse@1",
        "d on-parse@1",
        "core-chain on-start-height@1 core",
        "a on-start-height@1",
        "b on-start-height@1",
        "c on-start-height@1",
        "d on-start-height@1",
        "a on-compute@1",
      ]);
      expect(at(first.log, "on-start-height", 4)).toEqual(["e on-start-height@4"]);
      expect(first.log.indexOf("e on-start-height@4")).toBeLessThan(first.log.indexOf("e on-compute@4"));
      expect(first.log.indexOf("e on-start-height@4")).toBeGreaterThan(first.log.indexOf("e on-parse@4"));
      expect(first.log.some((line) => line.startsWith("e ") && line.endsWith("@3"))).toBe(false);
      expect(at(first.log, "on-stop-height", 6)).toEqual(["d on-stop-height@6"]);
      expect(first.log.indexOf("d on-stop-height@6")).toBeGreaterThan(first.log.indexOf("d on-after-db-write@6"));
      expect(first.log.some((line) => line.startsWith("d ") && /@(7|8|9|10)$/.test(line))).toBe(false);
    }, 180_000);

    it("gives on-start-height a read at h − 1 and on-stop-height a read at h, each with its entry (RN-4, Q100)", async () => {
      const db = await backend.database();
      const seen: string[] = [];
      const probe = loggingModule("probe", [], [], {
        points: {
          async "on-start-height"(_p, e, read) {
            if (!Object.isFrozen(e)) seen.push("start entry not frozen");
            const [row] = await read.query("SELECT count(*)::int AS n FROM core_block_commit.blocks");
            seen.push(`start ${e.entryId}@${e.height}: read ${read.height}, ${row?.n} blocks`);
          },
          async "on-stop-height"(_p, e, read) {
            if (!Object.isFrozen(e)) seen.push("stop entry not frozen");
            const [row] = await read.query("SELECT count(*)::int AS n FROM core_block_commit.blocks");
            seen.push(`stop ${e.entryId}@${e.height}: read ${read.height}, ${row?.n} blocks`);
          },
        },
      });
      const build = testBuild([probe]);
      const source = new InMemoryBlockSource({ head: 8n });
      const handle = startProcess({
        declarations: build.declarations,
        config: { data: { entries: [core(db.setting), entryOf(probe, 4, {}, 6)] } },
        source,
        log: () => undefined,
      });
      try {
        expect(await settle(handle, source, 8n)).toBe("waiting");
      } finally {
        await handle.stop();
      }
      expect(seen).toEqual(["start probe@4: read 3, 3 blocks", "stop probe@6: read 6, 6 blocks"]);
    }, 180_000);

    it("a failing re-delivered callback stops the restart with the cursor's height committed, processing nothing more (RN-11)", async () => {
      const db = await backend.database();
      let fail = false;
      const flaky = loggingModule("flaky", [], [], {
        points: {
          async "on-after-db-write"() {
            if (fail) throw new Error("on-after-db-write fails at the restart");
          },
        },
      });
      for (const head of [3n, 6n]) {
        const build = testBuild([flaky]);
        const source = new InMemoryBlockSource({ head });
        const handle = startProcess({
          declarations: build.declarations,
          config: { data: { entries: [core(db.setting), entryOf(flaky, 1)] } },
          source,
          log: () => undefined,
        });
        const ended = await settle(handle, source, head);
        await handle.stop();
        if (!fail) {
          expect(ended).toBe("waiting");
          fail = true;
          continue;
        }
        expect(ended).toMatchObject({ kind: "failed" });
        expect((ended as { error: unknown }).error).toMatchObject({
          name: "HeightFailure",
          height: 3n,
          point: "on-after-db-write",
          module: "flaky",
          committed: true,
        });
      }
      expect(await cursorIn(db)).toBe(3);
    }, 180_000);

    it("a publish the module catches in a re-delivered on-stop-height stops the restart at the cursor (RN-11, MD-7)", async () => {
      const db = await backend.database();
      let restarted = false;
      const sneaky = loggingModule("sneaky", [], [], {
        provides: [
          { name: "sneaky-rows", lifetimes: ["table"], table: { schema: "sneaky", tables: ["rows"], kind: "append-only" } },
          { name: "sneaky-client", lifetimes: ["process"] },
        ],
        points: {
          async "on-start-db"(p) {
            if (!restarted) p.publish("sneaky-client", 1);
            else p.publish("sneaky-client", 2);
          },
          async "on-stop-height"(p) {
            if (!restarted) return;
            try {
              p.publish("sneaky-client", 3);
            } catch {
              // Caught: still a callback error. [MD-7]
            }
          },
        },
      });
      for (const head of [3n, 6n]) {
        const build = testBuild([sneaky]);
        const source = new InMemoryBlockSource({ head });
        const handle = startProcess({
          declarations: build.declarations,
          config: { data: { entries: [core(db.setting), entryOf(sneaky, 1, {}, 3)] } },
          source,
          log: () => undefined,
        });
        const ended = await settle(handle, source, head);
        await handle.stop();
        if (!restarted) {
          expect(ended).toBe("waiting");
          restarted = true;
          continue;
        }
        expect((ended as { error: unknown }).error).toMatchObject({
          name: "HeightFailure",
          height: 3n,
          point: "on-stop-height",
          module: "sneaky",
          committed: true,
        });
      }
      expect(await cursorIn(db)).toBe(3);
    }, 180_000);

    it("a failing on-start-height stops the process before its height commits; a failing on-stop-height after it", async () => {
      for (const [point, height, committed, cursor] of [
        ["on-start-height", 4n, false, 3],
        ["on-stop-height", 6n, true, 6],
      ] as const) {
        const db = await backend.database();
        const failing = loggingModule("failing", [], [], {
          points: {
            [point]: async () => {
              throw new Error(`${point} fails`);
            },
          } as ModuleDeclaration["points"],
        });
        const build = testBuild([failing]);
        const source = new InMemoryBlockSource({ head: 8n });
        const lines: string[] = [];
        const handle = startProcess({
          declarations: build.declarations,
          config: { data: { entries: [core(db.setting), entryOf(failing, 4, {}, 6)] } },
          source,
          log: (line) => createdDirectory(line) || lines.push(line),
        });
        const ended = await settle(handle, source, 8n);
        await handle.stop();
        expect(ended).toMatchObject({ kind: "failed" });
        const failure = (ended as { error: unknown }).error;
        expect(failure).toBeInstanceOf(HeightFailure);
        expect(failure).toMatchObject({ height, point, module: "failing", committed });
        expect(lines).toEqual([`processing halted (callback-error): ${(failure as Error).message}`]);
        expect(lines[0]).toContain(`${point} fails`);
        expect(await cursorIn(db)).toBe(cursor);
      }
    }, 180_000);
  });
});
