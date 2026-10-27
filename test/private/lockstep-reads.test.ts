import { setTimeout as sleep } from "node:timers/promises";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { z } from "zod";
import { privateCursorHeight } from "../../src/backbone/core-private-source/index.js";
import type { ModuleDeclaration } from "../../src/modules/declaration.js";
import { FinalizedLoop } from "../../src/runner/loop.js";
import type { ProcessStatus } from "../../src/runner/process.js";
import { PRIVATE_BACKENDS, type PrivateBackend, REACH_TIMEOUT_MS, START_TIMEOUT_MS, type TestDatabase, TEST_TIMEOUT_MS } from "./backends.js";
import { launchPrivate, launchPublicCore, PRIVATE_ROWS_SQL } from "./builds.js";

/**
 * Owner decision Q142 (task 14.3; PP-4, PP-6), on PostgreSQL 18.6 and PGlite 0.5.10: a private module's read of public
 * data through the core is one `read` per statement, each at the public cursor when the core runs it, so a lockstep
 * instance reads the public cursor again after its block's data and halts with `lockstep-behind` if it moved past h.
 * The instance reads its public database through the core on both backends (no `publicDatabase`). Its core lists it but
 * does not wait for it (a loop without the wait), so only the instance's own check keeps it at its height: its module's
 * `on-fetch` at height 1 reads the public block, waits while the core commits 2, and reads again — and the instance halts
 * at 1, nothing of it committed. Committed negative control: an instance that does not read the cursor again
 * (`PrivateIntakeOptions.reread` false) commits height 1 with data read across two public heights.
 */

const INSTANCE = "q142-1";

/** Waits until `check` holds, or fails after `ms`. */
async function until(check: () => boolean, what: string, ms: number = REACH_TIMEOUT_MS): Promise<void> {
  const deadline = Date.now() + ms;
  while (!check()) {
    if (Date.now() > deadline) throw new Error(`timed out after ${ms} ms: ${what}`);
    await sleep(20);
  }
}

/** A core that lists its instances but does not wait for them: the instances' own check is all that is left. */
class SkipsLockstep extends FinalizedLoop {
  protected override async lockstepWait(): Promise<boolean> {
    return true;
  }
}

/** Where the module `pm` of {@link pausing} is: paused in its on-fetch of height 1 between its two reads, or not. */
interface Pause {
  paused: boolean;
  release(): void;
  readonly released: Promise<void>;
}

function pauseGate(): Pause {
  let release = (): void => undefined;
  const released = new Promise<void>((resolve) => {
    release = resolve;
  });
  return { paused: false, release, released };
}

/**
 * A private module `pm` (PP-13: requiring the public `blocks`): its `on-fetch` reads the public block at its height,
 * and at height 1 waits on `pause` before it reads it again; its `on-db-write` stores the hash it read.
 */
function pausing(pause: Pause): ModuleDeclaration {
  const query = "SELECT hash FROM core_block_commit.blocks WHERE height = $1";
  return {
    id: "pm",
    version: "1.0.0",
    side: "private",
    requires: ["admitted-keys", "blocks"],
    provides: [
      { name: "pm-public", lifetimes: ["block"] },
      { name: "pm-rows", lifetimes: ["table"], table: { schema: "pm", tables: ["rows"], kind: "append-only" } },
    ],
    startsMidChain: true,
    configSchema: z.object({ salt: z.number().int().default(0).meta({ kind: "data" }) }),
    migrations: [{ id: "001", sql: PRIVATE_ROWS_SQL("pm") }],
    points: {
      async "on-fetch"(_p, b, out, read) {
        if (read === undefined) throw new Error("pm's on-fetch got no read of public data");
        const [first] = await read.query(query, [b.height]);
        if (b.height === 1n) {
          pause.paused = true;
          await pause.released;
        }
        const [again] = await read.query(query, [b.height]);
        out.put("pm-public", (again ?? first)?.hash);
      },
      async "on-db-write"(_p, b, w) {
        await w.execute("INSERT INTO pm.rows (height, public_hash, salt) VALUES ($1, $2, 0)", [b.height, b.items.get("pm-public")]);
      },
    },
  };
}

/** What one Q142 run saw. */
interface Q142Observation {
  readonly status: ProcessStatus;
  readonly rows: readonly number[];
}

/** Q142's oracle: every problem with what was observed, none when the instance halted at 1 with nothing committed. */
function q142Problems(observed: Q142Observation): string[] {
  const problems: string[] = [];
  const { status } = observed;
  if (status.cursor !== null || observed.rows.length > 0) {
    problems.push("the instance committed height 1 though the public cursor moved to 2 while its on-fetch read the public data of 1");
  }
  if (status.state !== "halted" || status.reason?.code !== "lockstep-behind" || status.reason.height !== 1n) {
    problems.push(`the instance was not halted with lockstep-behind at 1: ${status.state}, ${status.reason?.code} at ${status.reason?.height}`);
  }
  return problems;
}

/** Runs Q142 on `backend`; `reread: false` is the negative control's instance. */
async function q142Run(backend: PrivateBackend, reread?: boolean): Promise<Q142Observation> {
  const publicDb = await backend.database("public");
  const privateDb: TestDatabase = await backend.database("private");
  // S 1 and the head 0: the core waits for the node (IN-2) with its transport listening.
  const core = launchPublicCore({
    database: publicDb.setting,
    head: 0n,
    loop: SkipsLockstep,
    extra: { listen: { transport: "127.0.0.1:0" }, lockstepInstances: [INSTANCE] },
  });
  const pause = pauseGate();
  try {
    const address = await core.transportWithin(START_TIMEOUT_MS);
    const instance = launchPrivate({
      database: privateDb.setting,
      instanceId: INSTANCE,
      coreTransport: address,
      modules: [pausing(pause)],
      extra: { backoffCeilingMs: 1_000 },
      ...(reread === undefined ? {} : { intake: { reread } }),
    });
    try {
      // The instance connects (and learns it is lockstep) before anything is committed.
      await until(() => core.lines.some((line) => line.startsWith(`transport: instance ${INSTANCE} connected at 0`)), "the instance connects", START_TIMEOUT_MS);
      core.source.finalize(1n);
      await until(() => pause.paused, "the instance's on-fetch of 1 pauses between its reads");
      core.source.finalize(2n);
      await until(() => core.handle.status().cursor === 2n, "the core commits 2 meanwhile");
      pause.release();
      await until(
        () => instance.handle.status().state === "halted" || (instance.handle.status().cursor ?? 0n) >= 1n,
        "the instance halts or commits 1",
      );
      const status = instance.handle.status();
      await instance.stop();
      const rows = await privateDb.read(
        async (read) =>
          (await read.query("SELECT to_regclass('pm.rows') IS NOT NULL AS present"))[0]?.present === true
            ? (await read.query("SELECT height::int AS h FROM pm.rows ORDER BY height")).map((row) => Number(row.h))
            : [],
        privateCursorHeight,
      );
      return { status, rows };
    } finally {
      pause.release();
      await instance.stop();
    }
  } finally {
    await core.stop();
  }
}

describe.each(PRIVATE_BACKENDS)("Q142: a lockstep instance's reads through the core on $name (PP-4, PP-6)", (backend: PrivateBackend) => {
  beforeAll(() => backend.start(), START_TIMEOUT_MS);
  afterAll(() => backend.stop(), START_TIMEOUT_MS);

  it(
    "Q142: a lockstep instance reads the public cursor again after its block's data and halts with lockstep-behind when it moved past h",
    async () => {
      expect(q142Problems(await q142Run(backend))).toEqual([]);
    },
    TEST_TIMEOUT_MS,
  );

  it(
    "Q142 negative control (committed): an instance that does not read the cursor again processes a moved cursor",
    async () => {
      const problems = q142Problems(await q142Run(backend, false));
      expect(problems).toContain("the instance committed height 1 though the public cursor moved to 2 while its on-fetch read the public data of 1");
    },
    TEST_TIMEOUT_MS,
  );
});
