import { afterAll, beforeAll, describe, expect, it } from "vitest";
import type { AdminSnapshot } from "../../src/admin/types.js";
import { type AdminStarter, startAdminServer } from "../../src/admin/server.js";
import { PRIVATE_BACKENDS, START_TIMEOUT_MS, TEST_TIMEOUT_MS } from "./backends.js";
import { privacyProblems, privacyRun } from "./privacy-checks.js";

/**
 * A120's committed negative controls (task 14.4; PP-10), on PostgreSQL 18.6 and PGlite 0.5.10, each through A120's own
 * run and oracle over 10 blocks, `keeper` independent:
 * - **a process that logs a key's bytes**: `keeper`'s module fails its `on-key` with an error whose message holds the
 *   key's bytes as hex without `0x` — the form the configuration does not hold, so the log's redaction leaves it —, and
 *   the process logs its halt with that message: the scan finds them in a log line of `keeper`;
 * - **a status that shows them**: `keeper`'s admin endpoints are served from snapshots whose `/config` carries the
 *   configuration's test keys as written (an unredacted secret field): the scan finds them in `keeper`'s `/config`.
 */

/** An admin starter whose snapshots show `testKeys` of the process's `core` revision as `keys` (unredacted). */
function showingKeys(keys: () => unknown): AdminStarter {
  const shown = (snapshot: AdminSnapshot): AdminSnapshot => {
    const core = snapshot.config.core;
    if (core === null) return snapshot;
    return { ...snapshot, config: { ...snapshot.config, core: { ...core, settings: { ...core.settings, testKeys: keys() as never } } } };
  };
  return async (options) => {
    const server = await startAdminServer({ ...options, snapshot: shown(options.snapshot) });
    return {
      host: server.host,
      port: server.port,
      threadId: server.threadId,
      publish: (snapshot) => server.publish(shown(snapshot)),
      close: () => server.close(),
    };
  };
}

describe.each(PRIVATE_BACKENDS)("A120's negative controls on $name", (backend) => {
  beforeAll(() => backend.start(), START_TIMEOUT_MS);
  afterAll(() => backend.stop(), START_TIMEOUT_MS);

  it(
    "a private process that logs a key's bytes fails A120's scan",
    async () => {
      const run = await privacyRun(backend, {
        head: 10n,
        lockstep: false,
        keeperPoints: {
          async "on-key"(_p, key) {
            throw new Error(`cannot take the key ${Buffer.from(key.bytes).toString("hex")}`);
          },
        },
      });
      const problems = privacyProblems(run);
      expect(problems).toContain("a log line of keeper holds the key's bytes as hex");
      expect(run.cursors.keeper).toBe(2n);
    },
    TEST_TIMEOUT_MS,
  );

  it(
    "a /config that shows the test keys fails A120's scan",
    async () => {
      let keys: unknown = null;
      const run = await privacyRun(backend, { head: 10n, lockstep: false, keeperAdmin: showingKeys(() => keys), onKey: (key) => (keys = [key]) });
      const problems = privacyProblems(run);
      expect(problems).toContain("the answer of keeper /config holds the key's bytes as hex");
      expect(problems.filter((problem) => !problem.startsWith("the answer of keeper /config"))).toEqual([]);
    },
    TEST_TIMEOUT_MS,
  );
});
