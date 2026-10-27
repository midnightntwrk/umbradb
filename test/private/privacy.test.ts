import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { statusWhen } from "../admin/admin-harness.js";
import { PRIVATE_BACKENDS, START_TIMEOUT_MS, TEST_TIMEOUT_MS } from "./backends.js";
import { launchPublicCore } from "./builds.js";
import { instancesProblems, instancesRun, originOf } from "./privacy-checks.js";

/**
 * A120 `[CI]` (task 14.4; PP-9, AE-5; its key half withdrawn by owner decision Q154, task 14.4a), on PostgreSQL 18.6 and
 * PGlite 0.5.10: the core's `/status` shows of each private instance only its id, connection, lockstep flag and synced
 * height — a lockstep instance at the head, an independent one connected —, each instance its public cursor and its
 * lockstep flag; and a listed instance the core never saw, not connected, lockstep, with no height. The committed
 * negative control, a core whose `/status` shows more of an instance, is `./privacy.negative-control.test.ts`'s.
 */

describe.each(PRIVATE_BACKENDS)("A120: what the core's /status shows of a private instance on $name (PP-9)", (backend) => {
  beforeAll(() => backend.start(), START_TIMEOUT_MS);
  afterAll(() => backend.stop(), START_TIMEOUT_MS);

  it(
    "A120: the core's /status shows only each instance's id, connection, lockstep flag and synced height",
    async () => {
      const run = await instancesRun(backend, { head: 20n, lockstep: true });
      expect(instancesProblems(run)).toEqual([]);
      expect(run.status.core.privateInstances).toEqual(
        expect.arrayContaining([
          { id: "keeper", connected: true, lockstep: true, height: "20" },
          expect.objectContaining({ id: "other", connected: true, lockstep: false }),
        ]),
      );
    },
    TEST_TIMEOUT_MS,
  );

  it(
    "the core's /status shows a listed instance it never saw: not connected, lockstep, no height (PP-9, Q24)",
    async () => {
      const publicDb = await backend.database("public");
      const core = launchPublicCore({
        database: publicDb.setting,
        head: 3n,
        extra: { listen: { admin: "127.0.0.1:0" }, lockstepInstances: ["absent"] },
        admin: true,
      });
      try {
        await core.handle.started;
        const origin = await originOf(core.lines, "the core");
        const shown = (body: unknown) => (body as { privateInstances: unknown }).privateInstances;
        const body = await statusWhen(origin, (each) => Array.isArray(shown(each)) && (shown(each) as unknown[]).length > 0, 120_000);
        expect(shown(body)).toEqual([{ id: "absent", connected: false, lockstep: true, height: null }]);
      } finally {
        await core.stop();
      }
    },
    TEST_TIMEOUT_MS,
  );
});
