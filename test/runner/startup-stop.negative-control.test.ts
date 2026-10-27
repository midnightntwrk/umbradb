import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { PROCESS_BACKENDS } from "./process-backends.js";
import { a167Problems, a167Run, ignoringWait, PATIENCE_MS, STOP_LIMIT_MS } from "./startup-stop-harness.js";

/**
 * A167's committed negative control (task 5.3b; RN-13): a startup whose wait for the node ignores the stop —
 * `core-chain`'s checks against the node asked through a node client of the startup's own, which the stop does not
 * reach (`ignoringWait`), as every startup's wait did before task 5.3b — fails A167's oracle: the process does not
 * close within 5 s, processing has not ended, a node client stays open, and it keeps connecting after the stop.
 */

describe("negative control (A167): a startup whose wait for the node ignores the stop", () => {
  beforeAll(() => Promise.all(PROCESS_BACKENDS.map((backend) => backend.start())), 180_000);
  afterAll(() => Promise.all(PROCESS_BACKENDS.map((backend) => backend.stop())), 60_000);

  it(
    "fails A167 on PostgreSQL and on PGlite: no close within 5 s, no end, a client open, connection attempts after the stop",
    async () => {
      const found: Record<string, string[]> = {};
      for (const backend of PROCESS_BACKENDS) {
        found[backend.name] = a167Problems(await a167Run(backend, await backend.database(), "stop", ignoringWait));
      }
      const failed = [
        `the process did not close within ${STOP_LIMIT_MS} ms of its stop`,
        `processing ended not at all within ${STOP_LIMIT_MS} ms of the stop, not by the signal`,
        expect.stringMatching(/^node clients not closed: [12] of 2$/),
        expect.stringMatching(/^connection attempts to the node after the stop: [1-9]\d*$/),
      ];
      // No "the database was not closed": the clean-up closed the startup's own client, and the process then closed.
      expect(found).toEqual(Object.fromEntries(PROCESS_BACKENDS.map((backend) => [backend.name, failed])));
    },
    4 * PATIENCE_MS + 240_000,
  );
});
