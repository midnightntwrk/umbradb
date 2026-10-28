import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { PROCESS_BACKENDS } from "./process-backends.js";
import { a169Problems, a169Run, blockScenario, ignoringSource, PATIENCE_MS } from "./loop-stop-harness.js";
import { STOP_LIMIT_MS } from "./startup-stop-harness.js";

/**
 * A169's committed negative control (task 5.3c; RN-13, issue 00042): a loop whose node calls ignore the stop — its
 * block source, the node source, on a node client of its own that the stop does not reach (`ignoringSource`), as every
 * node call of the loop did before task 5.3c — fails A169's oracle while it waits for h + 1's block: the process does
 * not close within 5 s, processing has not ended, a node client stays open, and it keeps connecting after the stop.
 */

describe("negative control (A169): a loop whose node calls ignore the stop", () => {
  beforeAll(() => Promise.all(PROCESS_BACKENDS.map((backend) => backend.start())), 180_000);
  afterAll(() => Promise.all(PROCESS_BACKENDS.map((backend) => backend.stop())), 60_000);

  it(
    "fails A169 on PostgreSQL and on PGlite: no close within 5 s, no end, a client open, connection attempts after the stop",
    async () => {
      const scenario = blockScenario();
      const found: Record<string, string[]> = {};
      for (const backend of PROCESS_BACKENDS) {
        const { observed } = await a169Run(backend, await backend.database(), scenario, "stop", ignoringSource);
        found[backend.name] = a169Problems(scenario, observed);
      }
      const failed = [
        `the process did not close within ${STOP_LIMIT_MS} ms of its stop`,
        `processing ended not at all within ${STOP_LIMIT_MS} ms of the stop, not by the signal`,
        "node clients not closed: 1 of 2",
        expect.stringMatching(/^connection attempts to the node after the stop: [1-9]\d*$/),
      ];
      // No "the database was not closed" nor rows above h: the clean-up closed the source's client, and the process
      // then closed, h + 1 not committed.
      expect(found).toEqual(Object.fromEntries(PROCESS_BACKENDS.map((backend) => [backend.name, failed])));
    },
    4 * PATIENCE_MS + 240_000,
  );
});
