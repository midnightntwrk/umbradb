import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { UmbraError } from "../../src/db/errors.js";
import type { ModuleDeclaration, PendingKey } from "../../src/modules/declaration.js";
import { FinalizedLoop, HeightFailure, type HeightRun, type PendingKeys } from "../../src/runner/loop.js";
import { declaration } from "../modules/declarations.js";
import { entry } from "../modules/graph-fixtures.js";
import { heightsIn, InMemoryBlockSource, loopInput, RUNNER_BACKENDS, startWith } from "./loop-harness.js";

/**
 * The finalized loop's `on-key` (task 14.4; PP-8, RN-4, `design.md` §2), on PostgreSQL 18.6 and PGlite 0.5.10: given
 * `LoopInput.keys` (a private process's `core-key-registry`: the keys that become pending at each height), the loop
 * fires `on-key` for each key that becomes pending at h before h's `on-compute` — after its `on-start-height` —, one key
 * after the other, each callback in series in the range's order with its own read at the cursor (h − 1); a height whose
 * retry resumes at `on-compute` fires none again (its keys are still pending), one whose retry resumes before it — a
 * failure in `on-key` itself — fires them again; without `keys` no `on-key` fires. Committed negative control: a loop
 * that fires `on-key` after `on-compute` fails the oracle.
 */

const key = (byte: number): PendingKey => Object.freeze({ keyId: new Uint8Array(32).fill(byte), kind: "viewing", bytes: new Uint8Array([byte]) });

/** Keys that become pending: `k1` and `k2` at 2, `k3` at 3. */
const KEYS = new Map<bigint, readonly PendingKey[]>([
  [2n, [key(1), key(2)]],
  [3n, [key(3)]],
]);

/** The pending keys of {@link KEYS}, counting how often each height was asked. */
function pendingOf(keys: ReadonlyMap<bigint, readonly PendingKey[]> = KEYS) {
  const asked: bigint[] = [];
  const pending: PendingKeys = {
    at(height) {
      asked.push(height);
      return keys.get(height) ?? [];
    },
  };
  return { pending, asked };
}

/** What a module saw: `<module> <point> <height or key byte> read <read height>`. */
type Seen = string[];

/**
 * A module `id` recording its `on-start-height`, `on-key`, `on-compute` and `on-db-write`, writing one row per height;
 * `fail` makes one of its callbacks reject once with `connection-lost` (retryable, IN-10).
 */
function recorder(id: string, seen: Seen, rest: Partial<ModuleDeclaration> = {}, fail?: { point: "on-key" | "on-db-write"; height: bigint }): ModuleDeclaration {
  let failed = false;
  const failOnce = (point: string, height: bigint | null): void => {
    if (fail !== undefined && !failed && fail.point === point && fail.height === height) {
      failed = true;
      throw new UmbraError("connection-lost", `${id} lost its connection at ${point}`);
    }
  };
  return declaration(id, {
    ...rest,
    points: {
      async "on-start-height"(_p, e, read) {
        seen.push(`${id} on-start-height ${e.height} read ${read.height}`);
      },
      async "on-key"(_p, k, read) {
        seen.push(`${id} on-key k${k.bytes[0]} read ${read.height}`);
        failOnce("on-key", (read.height ?? 0n) + 1n);
      },
      async "on-compute"(_p, b, read) {
        seen.push(`${id} on-compute ${b.height} read ${read.height}`);
      },
      async "on-db-write"(_p, b, w) {
        seen.push(`${id} on-db-write ${b.height}`);
        failOnce("on-db-write", b.height);
        await w.execute(`INSERT INTO ${id}.rows (height) VALUES ($1)`, [b.height]);
      },
    },
  });
}

/**
 * The oracle of `on-key`'s place (PP-8): every problem with `seen`, none when each key of {@link KEYS} that becomes
 * pending at h fired `on-key` once per module, in the order the keys are given and the modules' order, each with a read
 * at h − 1 (the cursor), after h's `on-start-height` and before h's `on-compute`, and no other `on-key` fired.
 */
function keyPointProblems(seen: Seen, modules: readonly string[]): string[] {
  const problems: string[] = [];
  for (const [height, keys] of KEYS) {
    const expected = keys.flatMap((k) => modules.map((m) => `${m} on-key k${k.bytes[0]} read ${height - 1n}`));
    const fired = seen.filter((line) => expected.includes(line));
    if (fired.join(" | ") !== expected.join(" | ")) problems.push(`at ${height} on-key fired ${fired.join(", ") || "never"}`);
    const firstCompute = seen.indexOf(`${modules[0]} on-compute ${height} read ${height - 1n}`);
    const lastKey = seen.lastIndexOf(expected.at(-1) as string);
    const firstKey = seen.indexOf(expected[0] as string);
    if (firstCompute < 0 || lastKey < 0 || lastKey > firstCompute) {
      problems.push(`at ${height} on-key did not fire before on-compute: ${seen.join(", ")}`);
    }
    const start = seen.indexOf(`${modules[0]} on-start-height ${height} read ${height - 1n}`);
    if (start >= 0 && firstKey >= 0 && firstKey < start) problems.push(`at ${height} on-key fired before on-start-height`);
  }
  const all = [...KEYS].flatMap(([height, keys]) => keys.flatMap((k) => modules.map((m) => `${m} on-key k${k.bytes[0]} read ${height - 1n}`)));
  const other = seen.filter((line) => line.includes(" on-key ") && !all.includes(line));
  if (other.length > 0) problems.push(`on-key fired otherwise: ${other.join(", ")}`);
  return problems;
}

/** A negative control's loop: it fires `on-key` after `on-compute`. */
class KeysAfterCompute extends FinalizedLoop {
  protected override async keyPoint(): Promise<void> {
    return undefined;
  }

  protected override async compute(run: HeightRun, open: Parameters<FinalizedLoop["compute"]>[1]): Promise<void> {
    await super.compute(run, open);
    await super.keyPoint(run);
  }
}

describe.each(RUNNER_BACKENDS)("the loop's on-key on $name (PP-8)", (backend) => {
  beforeAll(() => backend.start(), 180_000);
  afterAll(() => backend.stop(), 60_000);

  /** Runs `kind` over heights 1–3 with modules `a` from 1 and `b` from 2 (b requires a's item); what they saw. */
  async function run(kind: typeof FinalizedLoop = FinalizedLoop, keys = pendingOf()) {
    const opened = await backend.database();
    const seen: Seen = [];
    const a = recorder("a", seen);
    const b = recorder("b", seen, { requires: ["a-rows"] });
    const started = await startWith(opened.db, [a, b], [entry("a", 1), entry("b", 2)]);
    const source = new InMemoryBlockSource({ head: 3n });
    const controller = new AbortController();
    const running = new kind({ ...loopInput(started, source, controller), keys: keys.pending }).run();
    try {
      await Promise.race([source.waiting(3n), running]);
    } finally {
      controller.abort();
    }
    await running;
    return { seen, asked: keys.asked, rows: await heightsIn(opened.db, "a.rows") };
  }

  it("fires on-key for each key pending at h before h's on-compute, after its on-start-height, reading at the cursor", async () => {
    const { seen, asked, rows } = await run();
    expect(keyPointProblems(seen.filter((line) => !line.startsWith("b ")), ["a"])).toEqual([]);
    // b starts at 2: its on-start-height comes first, then each key to a, then b, in the range's order.
    const at2 = seen.slice(seen.indexOf("b on-start-height 2 read 1"), seen.indexOf("a on-compute 2 read 1"));
    expect(at2).toEqual(["b on-start-height 2 read 1", "a on-key k1 read 1", "b on-key k1 read 1", "a on-key k2 read 1", "b on-key k2 read 1"]);
    expect(seen.filter((line) => line.includes(" on-key ")).length).toBe(6);
    expect(asked).toEqual([1n, 2n, 3n]);
    expect(rows).toEqual([1n, 2n, 3n]);
  });

  it("fires none without LoopInput.keys", async () => {
    const opened = await backend.database();
    const seen: Seen = [];
    const started = await startWith(opened.db, [recorder("a", seen)], [entry("a", 1)]);
    const source = new InMemoryBlockSource({ head: 2n });
    const controller = new AbortController();
    const running = new FinalizedLoop(loopInput(started, source, controller)).run();
    await Promise.race([source.waiting(2n), running]);
    controller.abort();
    await running;
    expect(seen.filter((line) => line.includes("on-key"))).toEqual([]);
    expect(seen).toContain("a on-compute 2 read 1");
  });

  it("a retry resuming at on-compute fires no on-key again; one resuming before it (on-key failed) fires them again", async () => {
    for (const fail of [
      { point: "on-db-write", height: 2n },
      { point: "on-key", height: 2n },
    ] as const) {
      const opened = await backend.database();
      const seen: Seen = [];
      const started = await startWith(opened.db, [recorder("a", seen, {}, fail)], [entry("a", 1)]);
      const source = new InMemoryBlockSource({ head: 3n });
      const controller = new AbortController();
      const loop = new FinalizedLoop({ ...loopInput(started, source, controller), keys: pendingOf().pending });
      const first = await loop.run().then(
        () => expect.unreachable("the first run should fail"),
        (error: unknown) => error,
      );
      expect(first).toBeInstanceOf(HeightFailure);
      expect((first as HeightFailure).height).toBe(2n);
      const again = loop.run();
      await Promise.race([source.waiting(3n), again]);
      controller.abort();
      await again;
      // k1 fired once, and its failure (when on-key failed) left k2 unfired in the first run.
      const k1 = seen.filter((line) => line === "a on-key k1 read 1").length;
      const k2 = seen.filter((line) => line === "a on-key k2 read 1").length;
      expect([k1, k2], fail.point).toEqual(fail.point === "on-key" ? [2, 1] : [1, 1]);
      expect(seen.filter((line) => line === "a on-key k3 read 2"), fail.point).toHaveLength(1);
      expect(await heightsIn(opened.db, "a.rows"), fail.point).toEqual([1n, 2n, 3n]);
    }
  });

  it("gives each on-key callback a read of its own: one callback's failed statement leaves the next one's read whole", async () => {
    const opened = await backend.database();
    const reads: unknown[] = [];
    const seen: string[] = [];
    const failing = declaration("a", {
      points: {
        async "on-key"(_p, _k, read) {
          reads.push(read);
          await read.query("SELECT 1 / 0 AS never").catch(() => seen.push("a's statement failed"));
        },
      },
    });
    const reading = declaration("b", {
      requires: ["a-rows"],
      points: {
        async "on-key"(_p, _k, read) {
          reads.push(read);
          const [row] = await read.query("SELECT 1 AS one");
          seen.push(`b read ${String(row?.one)} at ${read.height}`);
        },
      },
    });
    const started = await startWith(opened.db, [failing, reading], [entry("a", 1), entry("b", 1)]);
    const source = new InMemoryBlockSource({ head: 2n });
    const controller = new AbortController();
    const keys = pendingOf(new Map([[2n, [key(1)]]]));
    const running = new FinalizedLoop({ ...loopInput(started, source, controller), keys: keys.pending }).run();
    try {
      await Promise.race([source.waiting(2n), running]);
    } finally {
      controller.abort();
    }
    await running;
    expect(seen).toEqual(["a's statement failed", "b read 1 at 1"]);
    expect(reads).toHaveLength(2);
    expect(reads[0]).not.toBe(reads[1]);
  });

  it("negative control: a loop firing on-key after on-compute fails the oracle", async () => {
    const { seen } = await run(KeysAfterCompute);
    expect(keyPointProblems(seen.filter((line) => !line.startsWith("b ")), ["a"]).join("\n")).toContain("did not fire before on-compute");
  });
});
