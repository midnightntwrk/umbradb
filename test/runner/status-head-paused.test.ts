import { setTimeout as sleep } from "node:timers/promises";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import type { ModuleDeclaration } from "../../src/modules/declaration.js";
import type { ProcessHandle } from "../../src/runner/process.js";
import {
  PRIVATE_BACKENDS,
  type PrivateBackend,
  REACH_TIMEOUT_MS,
  START_TIMEOUT_MS,
  TEST_TIMEOUT_MS,
  type TestDatabase,
} from "../private/backends.js";
import {
  type PrivateOptions,
  type PrivateProcess,
  type PrivateSeen,
  privateModule,
  type PublicCore,
  startPrivate,
  startPublicCore,
} from "../private/builds.js";
import { TestLink } from "../private/link.js";

/**
 * The finalized head a paused private process reports — `status().head`, hence `/status`'s `head`, the lag, the state
 * and readiness — on PostgreSQL 18 and PGlite 0.5.10. A private process's head is the highest public cursor its block
 * source has read (`latestHead`, which reads nothing). A paused loop processes nothing and reads no head; a wait for
 * the public cursor that was already running when the loop paused still reads it, and so can raise the head.
 * - Paused while it waits for the public cursor: when the public cursor rises from 3 to 6 and the wait is woken, the
 *   private cursor stays 3, and the head becomes 6 — lag 3, `syncing`, not ready with `readinessLag` 2 (503) —, the
 *   condition `paused` kept. The wait then ends at the pause between heights: a rise to 9 during the same pause reads
 *   nothing, so the head stays 6. Resumed, the process runs to 9.
 * - Paused between two heights, not waiting (asked while the loop is inside height 3, the public cursor's): when the
 *   public cursor rises to 6 and a `committed` message comes, nothing reads it, so the head stays 3 — lag 0,
 *   `following`, ready. Resumed, the process runs to 6.
 *
 * The public core runs on an in-memory chain; the private process reads the public database (as `umbradb_reader` on
 * PostgreSQL, through the core's `db` item on PGlite) and is woken only by the test's `committed` messages, so each
 * read of the public cursor happens when the test says. `followingThreshold` 0, `readinessLag` 2.
 */

/** The `core` settings of these private processes: following only at the public cursor, ready up to 2 behind it. */
const LAGS = Object.freeze({ followingThreshold: 0, readinessLag: 2 });

/**
 * The core's `committed` messages as {@link TestLink} carries them, also keeping each pass of the private source's wait
 * for the public cursor: a pass asks for the next wake-up (`next`), reads the public cursor, and ends — at once when
 * the cursor is above the height it waits for, else once woken — by aborting the signal it asked with.
 */
class CountingLink extends TestLink {
  readonly #passes: AbortSignal[] = [];

  override next(signal: AbortSignal): Promise<void> {
    this.#passes.push(signal);
    return super.next(signal);
  }

  /** How many passes the wait has begun. */
  get passes(): number {
    return this.#passes.length;
  }

  /** Whether the private source is in a wait for the public cursor: its last pass has not ended. */
  get inWait(): boolean {
    return this.#passes.at(-1)?.aborted === false;
  }
}

/** A hold of `pm`'s `on-compute` at one height: `reached` once it waits there, `release` lets it go on. */
interface Hold {
  readonly reached: Promise<void>;
  readonly release: () => void;
  readonly wait: () => Promise<void>;
}

function hold(): Hold {
  let release!: () => void;
  const released = new Promise<void>((resolve) => {
    release = resolve;
  });
  let reach!: () => void;
  const reached = new Promise<void>((resolve) => {
    reach = resolve;
  });
  return {
    reached,
    release,
    wait: () => {
      reach();
      return released;
    },
  };
}

/** The private module `pm` of `../private/builds.ts`, its `on-compute` held at `height` by `held`. */
function heldAt(height: bigint, held: Hold, seen: PrivateSeen[]): ModuleDeclaration {
  const pm = privateModule("pm", seen);
  return {
    ...pm,
    points: {
      ...pm.points,
      async "on-compute"(_p, b) {
        if (b.height === height) await held.wait();
      },
    },
  };
}

/** `/status` and `/health/ready` as the process's mounted admin handler answers them now. */
async function admin(handle: ProcessHandle): Promise<{ readonly status: Record<string, unknown>; readonly ready: number }> {
  const status = (await (await handle.admin.fetch(new Request("http://admin/status"))).json()) as Record<string, unknown>;
  const ready = (await handle.admin.fetch(new Request("http://admin/health/ready"))).status;
  return { status, ready };
}

/** Resolves once `done()` is true, polling every 20 ms; throws with `what` after {@link REACH_TIMEOUT_MS}. */
async function until(what: string, done: () => boolean): Promise<void> {
  const deadline = Date.now() + REACH_TIMEOUT_MS;
  while (!done()) {
    if (Date.now() > deadline) throw new Error(`not seen within ${REACH_TIMEOUT_MS} ms: ${what}`);
    await sleep(20);
  }
}

/** A few turns of the event loop and 100 ms, for anything that would happen to happen. */
async function quiet(): Promise<void> {
  await sleep(100);
  for (let turn = 0; turn < 10; turn++) await new Promise((resolve) => setImmediate(resolve));
}

/** The highest height `pm` was called at, or null. */
const highest = (seen: readonly PrivateSeen[]): bigint | null =>
  seen.reduce<bigint | null>((top, call) => (top === null || call.height > top ? call.height : top), null);

/** The condition `paused` by `pause()`, as `status()` and `/status` list it. */
const PAUSED = expect.arrayContaining([expect.objectContaining({ code: "paused", by: "pause" })]);

/**
 * How the private process on `backend` reads the public database of `core`: on PostgreSQL as the login that may only
 * read it, on PGlite through the core's `db` item.
 */
function publicReads(
  backend: PrivateBackend,
  publicDb: TestDatabase,
  core: PublicCore,
): Pick<PrivateOptions, "publicDatabase" | "direct"> {
  if (backend.kind === "pglite") return { direct: () => core.db() };
  if (publicDb.readerSetting === undefined) throw new Error("the PostgreSQL public database has no reader login");
  return { publicDatabase: publicDb.readerSetting };
}

describe.each(PRIVATE_BACKENDS)("a paused private process's head, on $name", (backend: PrivateBackend) => {
  beforeAll(() => backend.start(), START_TIMEOUT_MS);
  afterAll(() => backend.stop(), 60_000);

  it(
    "paused while it waits for the public cursor: the cursor kept, the head raised by that wait to the public cursor, " +
      "with the lag, syncing and readiness (503) from it; then still until resumed",
    async () => {
      const publicDb = await backend.database("public");
      const privateDb = await backend.database("private");
      const core = await startPublicCore({ database: publicDb.setting, head: 3n });
      const link = new CountingLink();
      const seen: PrivateSeen[] = [];
      let running: PrivateProcess | undefined;
      try {
        running = await startPrivate({
          database: privateDb.setting,
          wakes: link,
          seen,
          extra: LAGS,
          ...publicReads(backend, publicDb, core),
        });
        const { handle } = running;
        await running.reach(3n);
        await link.waiting();
        expect(link.inWait).toBe(true);
        await handle.pause();
        expect(handle.status()).toMatchObject({ state: "following", ready: true, cursor: 3n, head: 3n, lag: 0n });
        expect(handle.status().conditions).toEqual(PAUSED);
        expect((await admin(handle)).ready).toBe(200);

        // The public cursor rises to 6 and its `committed` message wakes the wait already running: it reads 6 and ends.
        await core.advance(6n);
        link.committed();
        await until("the wait for the public cursor read it and ended", () => !link.inWait);
        const passes = link.passes;
        expect(handle.status()).toMatchObject({ state: "syncing", ready: false, cursor: 3n, head: 6n, lag: 3n });
        expect(handle.status().conditions).toEqual(PAUSED);
        expect(highest(seen)).toBe(3n);
        const raised = await admin(handle);
        expect(raised.status).toMatchObject({ state: "syncing", ready: false, cursor: "3", head: "6", lag: "3" });
        expect(raised.status.conditions).toEqual(PAUSED);
        expect(raised.ready).toBe(503);

        // The loop holds at its pause between heights, where nothing reads the public cursor: a rise to 9 shows
        // nowhere.
        await core.advance(9n);
        link.committed();
        await quiet();
        expect(link.passes).toBe(passes);
        expect(handle.status()).toMatchObject({ state: "syncing", ready: false, cursor: 3n, head: 6n, lag: 3n });
        expect(highest(seen)).toBe(3n);

        handle.resume();
        await running.reach(9n);
        await until("the private process at 9 is following", () => handle.status().state === "following");
        expect(handle.status()).toMatchObject({ state: "following", ready: true, cursor: 9n, head: 9n, lag: 0n });
        expect(handle.status().conditions).not.toEqual(PAUSED);
      } finally {
        await running?.stop();
        await core.stop();
      }
    },
    TEST_TIMEOUT_MS,
  );

  it(
    "paused between two heights, not waiting: a rise of the public cursor and its committed message leave the head, " +
      "the lag, following and readiness as they were",
    async () => {
      const publicDb = await backend.database("public");
      const privateDb = await backend.database("private");
      const core = await startPublicCore({ database: publicDb.setting, head: 3n });
      const link = new CountingLink();
      const seen: PrivateSeen[] = [];
      const atThree = hold();
      let running: PrivateProcess | undefined;
      try {
        running = await startPrivate({
          database: privateDb.setting,
          wakes: link,
          modules: [heldAt(3n, atThree, seen)],
          extra: LAGS,
          ...publicReads(backend, publicDb, core),
        });
        const { handle } = running;
        // Asked inside height 3, the loop's batch to the public cursor 3: the pause comes once 3 committed, before the
        // loop reads the head again, so it never waits.
        await atThree.reached;
        const paused = handle.pause();
        atThree.release();
        await paused;
        expect(link.inWait).toBe(false);
        const passes = link.passes;
        expect(handle.status()).toMatchObject({ state: "following", ready: true, cursor: 3n, head: 3n, lag: 0n });
        expect(handle.status().conditions).toEqual(PAUSED);

        await core.advance(6n);
        link.committed();
        await quiet();
        expect(link.passes).toBe(passes);
        expect(handle.status()).toMatchObject({ state: "following", ready: true, cursor: 3n, head: 3n, lag: 0n });
        expect(highest(seen)).toBe(3n);
        const kept = await admin(handle);
        expect(kept.status).toMatchObject({ state: "following", ready: true, cursor: "3", head: "3", lag: "0" });
        expect(kept.status.conditions).toEqual(PAUSED);
        expect(kept.ready).toBe(200);

        handle.resume();
        await running.reach(6n);
        await until("the private process at 6 is following", () => handle.status().state === "following");
        expect(handle.status()).toMatchObject({ state: "following", ready: true, cursor: 6n, head: 6n, lag: 0n });
      } finally {
        atThree.release();
        await running?.stop();
        await core.stop();
      }
    },
    TEST_TIMEOUT_MS,
  );
});
