import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { statusWhen } from "../admin/admin-harness.js";
import { PRIVATE_BACKENDS, START_TIMEOUT_MS, TEST_TIMEOUT_MS } from "./backends.js";
import { launchPublicCore } from "./builds.js";
import { instancesProblems, instancesRun, originOf } from "./privacy-checks.js";

/**
 * What the core's `/status` shows of a private instance, on PostgreSQL 18.6 and PGlite 0.5.10. Keys are not checked
 * here: they belong to a module, not the core. [A120 CI, PP-9, AE-5, Q154]
 * - The core shows each private instance with only its id, connection, lockstep flag and synced height: a lockstep
 *   instance at the head, an independent one connected. [A120 CI, PP-9]
 * - Each instance shows its public cursor and its lockstep flag. [A120 CI]
 * - A listed instance the core never saw shows as not connected, lockstep, with no height. [PP-9, Q24]
 *
 * The committed negative control, a core whose `/status` shows more of an instance, is in
 * `./privacy.negative-control.test.ts`.
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
