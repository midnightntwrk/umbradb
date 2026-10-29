import { afterAll, beforeAll, describe, expect, it } from "vitest";
import type { AdminSnapshot } from "../../src/admin/types.js";
import { type AdminStarter, startAdminServer } from "../../src/admin/server.js";
import { PRIVATE_BACKENDS, START_TIMEOUT_MS, TEST_TIMEOUT_MS } from "./backends.js";
import { instancesProblems, instancesRun } from "./privacy-checks.js";

/**
 * The committed negative control for what `/status` shows of a private instance, on PostgreSQL 18.6 and PGlite 0.5.10.
 * It uses the same run and oracle (`./privacy-checks.ts`) over 5 blocks, with `keeper` independent. The core's admin
 * endpoints are served from snapshots that show one field more of each private instance than the four allowed: the
 * hash of its last `hello` or report, which the core's transport knows. The oracle finds it in the core's `/status`.
 * [A120, PP-9]
 */

/** An admin starter whose snapshots add `hash` to each private instance the core's `/status` shows. */
function showingMore(): AdminStarter {
  const shown = (snapshot: AdminSnapshot): AdminSnapshot => {
    const instances = snapshot.status.privateInstances;
    if (instances === null) return snapshot;
    const more = instances.map((instance) => ({ ...instance, hash: `0x${"00".repeat(32)}` }));
    return { ...snapshot, status: { ...snapshot.status, privateInstances: more } };
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

describe.each(PRIVATE_BACKENDS)("A120's negative control on $name", (backend) => {
  beforeAll(() => backend.start(), START_TIMEOUT_MS);
  afterAll(() => backend.stop(), START_TIMEOUT_MS);

  it(
    "a core whose /status shows more of an instance than its id, connection, lockstep flag and height fails A120's oracle",
    async () => {
      const run = await instancesRun(backend, { head: 5n, lockstep: false, coreAdmin: showingMore() });
      const problems = instancesProblems(run);
      expect(problems.filter((problem) => problem.includes("other fields than id, connected, lockstep, height"))).toHaveLength(2);
      expect(problems.filter((problem) => !problem.includes("other fields than"))).toEqual([]);
    },
    TEST_TIMEOUT_MS,
  );
});
