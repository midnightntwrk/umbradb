import { afterAll, beforeAll, describe, expect, it } from "vitest";
import type { ModuleDeclaration } from "../../src/modules/declaration.js";
import { InMemoryBlockSource } from "../../src/runner/in-memory-source.js";
import type { ProcessHandle } from "../../src/runner/process.js";
import { PROCESS_BACKENDS, type ProcessBackend } from "./process-backends.js";
import { core, entryOf, loggingModule, settle, startProcess, testBuild } from "./process-build.js";

/**
 * The finalized head a process reports — `status().head`, hence `/status`'s `head` and `node.finalizedHead`, the lag,
 * the state and readiness — is the latest one its block source holds (`BlockSource.latestHead`, read without asking
 * the chain), not only the head the loop read when its batch began (issue 00074). Processing is unchanged: the loop
 * still reads the head once per batch, so a head's `on-finalized` comes after the batch it was found in, before the
 * heights it adds. [AE-3, AE-4, AE-5, RN-1]
 *
 * On PostgreSQL 18 and PGlite 0.5.10: an in-memory chain at head 400, S = 1, `followingThreshold` 3 and `readinessLag`
 * 5, a module held in its `on-compute` at heights 10 and 398; the source finalizes 600 while the loop is held at 10, in
 * its batch to 400.
 */

/** A hold of a module's `on-compute` at one height: `reached` once the module waits there, `release` lets it go on. */
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

/** `/status` and `/health/ready` as the process's mounted admin handler answers them now. */
async function admin(handle: ProcessHandle): Promise<{ readonly status: Record<string, unknown>; readonly ready: number }> {
  const status = (await (await handle.admin.fetch(new Request("http://admin/status"))).json()) as Record<string, unknown>;
  const ready = (await handle.admin.fetch(new Request("http://admin/health/ready"))).status;
  return { status, ready };
}

/** `<id> <point>@<height>` for each height from `from` to `to`. */
const each = (id: string, point: string, from: number, to: number): string[] =>
  Array.from({ length: to - from + 1 }, (_, i) => `${id} ${point}@${from + i}`);

describe.each(PROCESS_BACKENDS)("issue 00074: the reported head follows the source's latest finalized head, on $name", (backend: ProcessBackend) => {
  beforeAll(() => backend.start(), 180_000);
  afterAll(() => backend.stop(), 60_000);

  it("the head finalized during a batch shows at once: head, lag, state and readiness from it; processing unchanged", async () => {
    const db = await backend.database();
    const log: string[] = [];
    const holds = new Map<bigint, Hold>([
      [10n, hold()],
      [398n, hold()],
    ]);
    const logging = loggingModule("watch", log, ["on-finalized", "on-fetch"]);
    const watch: ModuleDeclaration = {
      ...logging,
      points: {
        ...logging.points,
        async "on-compute"(_p, b) {
          await holds.get(b.height)?.wait();
        },
      },
    };
    const build = testBuild([watch]);
    const source = new InMemoryBlockSource({ head: 400n });
    const handle = startProcess({
      declarations: build.declarations,
      config: {
        data: { entries: [core(db.setting, 1, { extra: { followingThreshold: 3, readinessLag: 5 } }), entryOf(watch, 1)] },
      },
      source,
      log: () => undefined,
    });
    try {
      await (holds.get(10n) as Hold).reached;
      // The batch the loop read: head 400, cursor 9.
      expect(handle.status()).toMatchObject({ state: "syncing", ready: false, cursor: 9n, head: 400n, lag: 391n });
      source.finalize(600n);
      // The source holds 600 now: it is the head reported, with the lag from it, while the loop is still in its batch.
      expect(handle.status()).toMatchObject({ state: "syncing", ready: false, cursor: 9n, head: 600n, lag: 591n });
      const during = await admin(handle);
      expect(during.status).toMatchObject({ state: "syncing", cursor: "9", head: "600", lag: "591" });
      expect(during.status.node).toMatchObject({ finalizedHead: "600" });
      expect(during.ready).toBe(503);

      (holds.get(10n) as Hold).release();
      await (holds.get(398n) as Hold).reached;
      // Cursor 397, two heights before the batch's end: 203 behind the source's head — syncing, not ready. The head the
      // loop read (400) would make it following and ready (lag 3), then syncing again once the loop read 600.
      expect(handle.status()).toMatchObject({ state: "syncing", ready: false, cursor: 397n, head: 600n, lag: 203n });
      const near = await admin(handle);
      expect(near.status).toMatchObject({ state: "syncing", head: "600", lag: "203" });
      expect(near.ready).toBe(503);

      (holds.get(398n) as Hold).release();
      expect(await settle(handle, source, 600n)).toBe("waiting");
      expect(handle.status()).toMatchObject({ state: "following", ready: true, cursor: 600n, head: 600n, lag: 0n });
      // The loop read the head once per batch, as before: 600's on-finalized after height 400, before 401.
      expect(log).toEqual([
        "watch on-finalized@400",
        ...each("watch", "on-fetch", 1, 400),
        "watch on-finalized@600",
        ...each("watch", "on-fetch", 401, 600),
      ]);
    } finally {
      for (const held of holds.values()) held.release();
      await handle.stop();
    }
  }, 240_000);
});
