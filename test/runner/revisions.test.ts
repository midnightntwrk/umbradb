import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { z } from "zod";
import type { BlockContext, ModuleDeclaration } from "../../src/modules/declaration.js";
import { defineModule } from "../../src/modules/declaration.js";
import type { EntryBoundary } from "../../src/runner/dispatch.js";
import { InMemoryBlockSource } from "../../src/runner/in-memory-source.js";
import { FinalizedLoop, type HeightRun, type LoopInput } from "../../src/runner/loop.js";
import { PROCESS_BACKENDS, pairs, type ProcessDatabase } from "./process-backends.js";
import { core, settle, startProcess, testBuild } from "./process-build.js";

/**
 * A42 (RN-7; task 5.3): a module's revisions continue each other — the settings switch at the later revision's start,
 * and the module does not start again there — through the process, from its configuration: `m.entry({ start: 1,
 * config: { k: 1 } })` and `m.entry({ start: 5, config: { k: 2 } })`, the configuration history checked and recorded,
 * each revision's settings in the module's process context, and the graph's segments deciding who starts at a height.
 */

/** One call `m` saw: the point, the height, and `k` from its block context (none for `on-start-height`). */
interface Seen {
  readonly point: string;
  readonly height: bigint;
  readonly k?: unknown;
  readonly entryId?: string;
}

/** Module `m`: one data setting `k`; its table holds each height with the `k` it was written with. */
function moduleM(seen: Seen[]) {
  const record = (point: string) => async (_p: unknown, b: BlockContext) => {
    seen.push({ point, height: b.height, k: b.settings.k });
  };
  return defineModule({
    id: "m",
    version: "1.0.0",
    side: "public",
    requires: ["block-header"],
    provides: [{ name: "m-rows", lifetimes: ["table"], table: { schema: "m", tables: ["rows"], kind: "append-only" } }],
    startsMidChain: true,
    configSchema: z.object({ k: z.number().int().meta({ kind: "data" }) }),
    migrations: [{ id: "001", sql: "CREATE TABLE m.rows (height bigint PRIMARY KEY, k integer NOT NULL)" }],
    points: {
      "on-fetch": record("on-fetch"),
      "on-parse": record("on-parse"),
      async "on-start-height"(_p, e) {
        seen.push({ point: "on-start-height", height: e.height, entryId: e.entryId });
      },
      "on-compute": record("on-compute"),
      async "on-db-write"(_p, b, w) {
        seen.push({ point: "on-db-write", height: b.height, k: b.settings.k });
        await w.execute("INSERT INTO m.rows (height, k) VALUES ($1, $2)", [b.height, b.settings.k]);
      },
      "on-after-db-write": record("on-after-db-write"),
    },
  });
}

/** What one A42 run observed: every call of `m`, and `m.rows` (height, k). */
interface A42Observation {
  readonly seen: readonly Seen[];
  readonly rows: readonly [number, unknown][];
}

const HEAD = 8;

/** A42's oracle: every problem with what was observed, none when A42 holds. */
function a42Problems(observed: A42Observation): string[] {
  const problems: string[] = [];
  const expected = (height: bigint): number => (height < 5n ? 1 : 2);
  for (const call of observed.seen) {
    if (call.point === "on-start-height") continue;
    if (call.k !== expected(call.height)) {
      problems.push(`${call.point} at ${call.height} saw k = ${String(call.k)}, not ${expected(call.height)}`);
    }
  }
  for (let height = 1; height <= HEAD; height++) {
    if (!observed.seen.some((call) => call.point === "on-compute" && call.height === BigInt(height))) {
      problems.push(`no on-compute at ${height}`);
    }
  }
  const rows = observed.rows.map(([height, k]) => `${height}:${String(k)}`);
  const wanted = Array.from({ length: HEAD }, (_, index) => `${index + 1}:${expected(BigInt(index + 1))}`);
  if (rows.join(",") !== wanted.join(",")) problems.push(`m.rows hold ${rows.join(",")}, not ${wanted.join(",")}`);
  const starts = observed.seen.filter((call) => call.point === "on-start-height").map((call) => call.height);
  if (starts.join(",") !== "1") problems.push(`on-start-height fired for m at ${starts.join(",") || "no height"}, not at 1 only`);
  if (observed.seen.some((call) => call.point === "on-start-height" && call.entryId !== "m")) {
    problems.push("on-start-height named another entry than m");
  }
  return problems;
}

/** A negative control's loop: it starts a module at every revision's start, continuing or not (CF-5 ignored). */
class StartsAtEveryRevision extends FinalizedLoop {
  protected override startingAt(run: HeightRun): EntryBoundary {
    const base = super.startingAt(run);
    const modules = run.range.order
      .filter((part) => this.input.contextOf(part.id).revisions.some((revision) => revision.start === run.height))
      .filter((part) => !part.id.startsWith("core-"))
      .map((part) => part.id);
    return { core: base.core, modules };
  }
}

/** Runs A42's two processes on `db` — to head 3, then restarted to head 8 — with `loop`, and observes them. */
async function a42Run(db: ProcessDatabase, loop?: new (input: LoopInput) => FinalizedLoop): Promise<A42Observation> {
  const seen: Seen[] = [];
  const m = moduleM(seen);
  const entries = [core(db.setting), m.entry({ start: 1, config: { k: 1 } }), m.entry({ start: 5, config: { k: 2 } })];
  for (const head of [3n, BigInt(HEAD)]) {
    const build = testBuild([m as ModuleDeclaration]);
    const source = new InMemoryBlockSource({ head });
    const handle = startProcess({
      declarations: build.declarations,
      config: { data: { entries } },
      source,
      log: () => undefined,
      ...(loop === undefined ? {} : { loop }),
    });
    try {
      expect(await settle(handle, source, head)).toBe("waiting");
    } finally {
      await handle.stop();
    }
  }
  return { seen, rows: await pairs(db, "SELECT height::int AS h, k AS v FROM m.rows ORDER BY height") };
}

describe.each(PROCESS_BACKENDS)("A42: revisions continue each other (RN-7), on $name", (backend) => {
  beforeAll(() => backend.start(), 180_000);
  afterAll(() => backend.stop(), 60_000);

  it("A42: revisions at 1 (k = 1) and 5 (k = 2) give k = 1 at 1–4 and k = 2 from 5, without on-start-height at 5", async () => {
    const observed = await a42Run(await backend.database());
    expect(a42Problems(observed)).toEqual([]);
    // The restart at cursor 3 re-delivered on-after-db-write for 3 (RN-11) with 3's settings, then went on at 4.
    const afterWrites = observed.seen.filter((call) => call.point === "on-after-db-write").map((call) => call.height);
    expect(afterWrites).toEqual([1n, 2n, 3n, 3n, 4n, 5n, 6n, 7n, 8n]);
  }, 180_000);

  it("negative control: a loop that fires on-start-height where a revision continues the one before fails A42", async () => {
    const observed = await a42Run(await backend.database(), StartsAtEveryRevision);
    expect(a42Problems(observed)).toEqual(["on-start-height fired for m at 1,5, not at 1 only"]);
  }, 180_000);
});
