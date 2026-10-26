import { setTimeout as sleep } from "node:timers/promises";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { privateCursorHeight } from "../../src/backbone/core-private-source/index.js";
import { inMemoryBlock } from "../../src/runner/in-memory-source.js";
import { FinalizedLoop, type HeightRun, type LoopInput } from "../../src/runner/loop.js";
import { PRIVATE_BACKENDS, type PrivateBackend, START_TIMEOUT_MS, type TestDatabase, TEST_TIMEOUT_MS } from "./backends.js";
import {
  launchPrivate,
  type PrivateOptions,
  type PrivateProcess,
  type PrivateSeen,
  type PublicCore,
  startPrivate,
  startPublicCore,
} from "./builds.js";
import { TestLink } from "./link.js";

/**
 * Block intake of a private process (PP-3, PP-5; task 14.1): `core-private-source` reads the public cursor when the
 * process starts and whenever its transport wakes it, and processes every height from its own cursor + 1 up to the
 * public cursor, in order, reading public data at each height; the core's `committed` messages only wake it.
 *
 * - A114 `[FAULT]`: the transport (`link.ts`, the stand-in for task 14.2's) drops while the public cursor advances 50
 *   heights, and every `committed` message of those heights is lost; after reconnecting, the private process processes
 *   the 50 heights in order.
 * - A116: an independent instance stopped for 100 blocks never pauses the core, and catches up from public data.
 */

/** The heights of a private module's `on-db-write` calls, in order, from `from` on in `seen`. */
const writes = (seen: readonly PrivateSeen[], from = 0): bigint[] =>
  seen.slice(from).filter((call) => call.point === "on-db-write").map((call) => call.height);

/** `from` to `to` as a list. */
const heights = (from: number, to: number): bigint[] => Array.from({ length: to - from + 1 }, (_, i) => BigInt(from + i));

/** The private module's rows, `[height, public hash as hex]`, from outside. */
async function rowsIn(db: TestDatabase): Promise<[number, string][]> {
  const rows = await db.read(
    (read) => read.query("SELECT height::int AS h, public_hash FROM pm.rows ORDER BY height"),
    privateCursorHeight,
  );
  return rows.map((row) => [Number(row.h), Buffer.from(row.public_hash as Uint8Array).toString("hex")]);
}

/** Problems with rows that should hold heights 1–`head`, each with the hash of the core's block there. */
function rowProblems(rows: readonly [number, string][], head: number): string[] {
  const wanted = heights(1, head).map((h) => [Number(h), Buffer.from(inMemoryBlock(h).hash).toString("hex")]);
  if (JSON.stringify(rows) === JSON.stringify(wanted)) return [];
  const missing = wanted.filter(([h]) => !rows.some(([r]) => r === h)).map(([h]) => h);
  const wrong = rows.filter(([h, hash]) => wanted.some(([w, want]) => w === h && want !== hash)).map(([h]) => h);
  return [
    `the private rows hold ${rows.length} heights, not 1–${head}` +
      (missing.length > 0 ? `; missing ${missing.join(",")}` : "") +
      (wrong.length > 0 ? `; another public hash at ${wrong.join(",")}` : ""),
  ];
}

/**
 * Problems with the reads and items the private module saw: `on-fetch`'s read of public data at its block's height or
 * above, `on-compute`'s of the private database at h − 1 with an empty `admitted-keys` (no key source until task
 * 14.4), `on-after-db-write`'s at h.
 */
function readProblems(seen: readonly PrivateSeen[]): string[] {
  const problems: string[] = [];
  for (const call of seen) {
    const at = call.readHeight;
    if (call.point === "on-fetch" && (at === null || (at as bigint) < call.height)) {
      problems.push(`on-fetch at ${call.height} read public data at ${at}`);
    }
    if (call.point === "on-compute" && (at !== (call.height === 1n ? null : call.height - 1n) || call.admitted !== 0)) {
      problems.push(`on-compute at ${call.height} read the private database at ${at}, admitted-keys ${call.admitted}`);
    }
    if (call.point === "on-after-db-write" && at !== call.height) {
      problems.push(`on-after-db-write at ${call.height} read the private database at ${at}`);
    }
  }
  return problems;
}

/** A private start's options against `core`'s public database `db`. */
function against(backend: PrivateBackend, db: TestDatabase, core: PublicCore, rest: PrivateOptions): PrivateOptions {
  return backend.kind === "postgres"
    ? { ...rest, publicDatabase: db.readerSetting as string }
    : { ...rest, direct: () => core.db() };
}

// ── A114 ────────────────────────────────────────────────────────────────────────────────────────────────────────

const A114_FROM = 5;
const A114_TO = A114_FROM + 50;

/** What one A114 run saw. */
interface A114Observation {
  readonly seen: readonly PrivateSeen[];
  /** Where in `seen` the reconnect came. */
  readonly reconnectedAt: number;
  /** The private cursor while the link was dropped and the core at {@link A114_TO}. */
  readonly cursorDuringDrop: bigint | null;
  /** The messages lost while dropped. */
  readonly lost: number;
  readonly rows: readonly [number, string][];
}

/** A114's oracle: every problem with what was observed, none when A114 holds. */
function a114Problems(observed: A114Observation): string[] {
  const problems: string[] = [];
  if (observed.lost !== 50) problems.push(`${observed.lost} committed messages were lost, not 50`);
  if (observed.cursorDuringDrop !== BigInt(A114_FROM)) {
    problems.push(
      `while the transport was dropped the private process moved to ${observed.cursorDuringDrop}: the drop was not ` +
        "its only wake-up",
    );
  }
  const before = writes(observed.seen.slice(0, observed.reconnectedAt));
  if (JSON.stringify(before.map(String)) !== JSON.stringify(heights(1, A114_FROM).map(String))) {
    problems.push(`before the drop it wrote ${before.join(",")}, not 1–${A114_FROM}`);
  }
  const after = writes(observed.seen, observed.reconnectedAt);
  const wanted = heights(A114_FROM + 1, A114_TO);
  if (after.join(",") !== wanted.join(",")) {
    problems.push(`after reconnecting it processed ${after.join(",")}, not ${A114_FROM + 1}–${A114_TO} in order`);
  }
  problems.push(...rowProblems(observed.rows, A114_TO), ...readProblems(observed.seen));
  return problems;
}

/** A negative control's intake: after each wake-up it skips the next height (its points and its commit). */
class SkipsAfterReconnect extends FinalizedLoop {
  #skip = false;

  protected override async wait(above: bigint): Promise<void> {
    await super.wait(above);
    this.#skip = true;
  }

  protected override async prepare(run: HeightRun): Promise<void> {
    if (!this.#skip) await super.prepare(run);
  }

  protected override async commit(run: HeightRun): Promise<void> {
    if (!this.#skip) await super.commit(run);
  }

  protected override async after(run: HeightRun): Promise<void> {
    if (this.#skip) this.#skip = false;
    else await super.after(run);
  }
}

/** Runs A114 on `backend` with the private process's `loop`. */
async function a114Run(backend: PrivateBackend, loop?: new (input: LoopInput) => FinalizedLoop): Promise<A114Observation> {
  const publicDb = await backend.database("public");
  const privateDb = await backend.database("private");
  const core = await startPublicCore({ database: publicDb.setting, head: BigInt(A114_FROM) });
  try {
    const seen: PrivateSeen[] = [];
    const link = new TestLink();
    const running = await startPrivate(
      against(backend, publicDb, core, { database: privateDb.setting, seen, wakes: link, ...(loop === undefined ? {} : { loop }) }),
    );
    let observed: Omit<A114Observation, "rows">;
    try {
      await running.reach(BigInt(A114_FROM));
      await link.waiting();
      link.drop();
      await core.advance(BigInt(A114_TO));
      for (let height = A114_FROM + 1; height <= A114_TO; height++) link.committed();
      // Time for anything else that could wake the private process to do so; nothing should.
      await sleep(1_000);
      const cursorDuringDrop = running.handle.status().cursor;
      const reconnectedAt = seen.length;
      link.connect();
      await running.reach(BigInt(A114_TO));
      observed = { seen: [...seen], reconnectedAt, cursorDuringDrop, lost: link.lost };
    } finally {
      await running.stop();
    }
    return { ...observed, rows: await rowsIn(privateDb) };
  } finally {
    await core.stop();
  }
}

// ── A116 ────────────────────────────────────────────────────────────────────────────────────────────────────────

const A116_FROM = 10;
const A116_TO = A116_FROM + 100;
/** How long the core may go without committing a height it has before it counts as paused. */
const STALL_MS = 15_000;

/** What one A116 run saw. */
interface A116Observation {
  /** The core's cursor once it reached the head, or where it stalled, while the instance was stopped. */
  readonly coreCursor: bigint | null;
  /** Whether it went {@link STALL_MS} without committing a height it had, and the conditions it reported. */
  readonly paused: boolean;
  readonly conditions: readonly string[];
  readonly restartSeen: readonly PrivateSeen[];
  readonly rows: readonly [number, string][];
}

/** A116's oracle: every problem with what was observed, none when A116 holds. */
function a116Problems(observed: A116Observation): string[] {
  const problems: string[] = [];
  if (observed.paused) {
    problems.push(`the core paused at ${observed.coreCursor} while the independent instance was stopped`);
  }
  if (observed.coreCursor !== BigInt(A116_TO)) {
    problems.push(`while the instance was stopped the core reached ${observed.coreCursor}, not ${A116_TO}`);
  }
  if (observed.conditions.length > 0) problems.push(`the core reported ${observed.conditions.join(", ")}`);
  const after = writes(observed.restartSeen);
  if (after.join(",") !== heights(A116_FROM + 1, A116_TO).join(",")) {
    problems.push(`after its restart the instance processed ${after.length} heights, not ${A116_FROM + 1}–${A116_TO} in order`);
  }
  problems.push(...rowProblems(observed.rows, A116_TO), ...readProblems(observed.restartSeen));
  return problems;
}

/**
 * A negative control's core: before each block's transaction it waits until the instance has committed the height
 * before (lockstep's wait, PP-6, for an instance that is not listed).
 */
function waitingFor(instance: () => bigint): new (input: LoopInput) => FinalizedLoop {
  return class WaitsForInstance extends FinalizedLoop {
    protected override async commit(run: HeightRun): Promise<void> {
      while (instance() < run.height - 1n && this.input.signal?.aborted !== true) await sleep(20);
      await super.commit(run);
    }
  };
}

/** Raises `core`'s head to `head` and follows its cursor: until it reaches it, or goes `STALL_MS` without progress. */
async function follow(core: PublicCore, head: bigint): Promise<{ readonly cursor: bigint | null; readonly paused: boolean; readonly conditions: string[] }> {
  core.source.finalize(head);
  const conditions = new Set<string>();
  let last = core.handle.status().cursor;
  let since = Date.now();
  for (;;) {
    const status = core.handle.status();
    for (const condition of status.conditions) conditions.add(condition.code);
    if (status.cursor === head) return { cursor: status.cursor, paused: false, conditions: [...conditions] };
    if (status.cursor !== last) {
      last = status.cursor;
      since = Date.now();
    } else if (Date.now() - since > STALL_MS) {
      return { cursor: status.cursor, paused: true, conditions: [...conditions] };
    }
    await sleep(25);
  }
}

/** Runs A116 on `backend`; `waits` makes the core the negative control's. */
async function a116Run(backend: PrivateBackend, waits = false): Promise<A116Observation> {
  const publicDb = await backend.database("public");
  const privateDb = await backend.database("private");
  let instance: PrivateProcess | undefined;
  const instanceCursor = (): bigint => instance?.handle.status().cursor ?? 0n;
  // The core at 1: a private process at S = 1 then starts without waiting for the public cursor (the bootstrap's wait).
  const core = await startPublicCore({ database: publicDb.setting, head: 1n, ...(waits ? { loop: waitingFor(instanceCursor) } : {}) });
  try {
    const options = against(backend, publicDb, core, { database: privateDb.setting });
    instance = await startPrivate(options);
    try {
      await core.advance(BigInt(A116_FROM));
      await instance.reach(BigInt(A116_FROM));
    } finally {
      await instance.stop();
    }
    const followed = await follow(core, BigInt(A116_TO));
    const restartSeen: PrivateSeen[] = [];
    const restarted = launchPrivate({ ...options, seen: restartSeen });
    try {
      await restarted.handle.started;
      if (!followed.paused) await restarted.reach(BigInt(A116_TO));
    } finally {
      await restarted.stop();
    }
    return {
      coreCursor: followed.cursor,
      paused: followed.paused,
      conditions: followed.conditions,
      restartSeen,
      rows: await rowsIn(privateDb),
    };
  } finally {
    await core.stop();
  }
}

describe.each(PRIVATE_BACKENDS)("private block intake ($name)", (backend) => {
  beforeAll(() => backend.start(), START_TIMEOUT_MS);
  afterAll(() => backend.stop(), START_TIMEOUT_MS);

  it(
    "A114: dropping the transport while the public cursor advances 50 heights, the private process processes the 50 " +
      "heights in order after reconnecting",
    async () => {
      expect(a114Problems(await a114Run(backend))).toEqual([]);
    },
    TEST_TIMEOUT_MS,
  );

  it(
    "A114 negative control: an intake that skips a height after a reconnect fails it",
    async () => {
      const problems = a114Problems(await a114Run(backend, SkipsAfterReconnect));
      expect(problems).toContain(
        `after reconnecting it processed ${heights(A114_FROM + 2, A114_TO).join(",")}, not ${A114_FROM + 1}–${A114_TO} in order`,
      );
    },
    TEST_TIMEOUT_MS,
  );

  it(
    "A116: an independent instance stopped for 100 blocks never pauses the core and catches up from public data",
    async () => {
      expect(a116Problems(await a116Run(backend))).toEqual([]);
    },
    TEST_TIMEOUT_MS,
  );

  it(
    "A116 negative control: a core that waits for an independent instance fails it",
    async () => {
      const problems = a116Problems(await a116Run(backend, true));
      expect(problems).toContain(`the core paused at ${A116_FROM + 1} while the independent instance was stopped`);
    },
    TEST_TIMEOUT_MS,
  );
});
