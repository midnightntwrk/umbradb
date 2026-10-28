import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { PROCESS_BACKENDS } from "../../runner/process-backends.js";
import { PATIENCE_MS } from "../ingest-harness.js";
import { a168Problems, a168Run, withoutNodeFields } from "./node-fields-harness.js";

/**
 * A168's committed negative control (task 8.3a), on PostgreSQL 18.6 and PGlite 0.5.10: the same run as
 * `./node-fields.test.ts`'s, with every snapshot the runner publishes carrying the node's best head, connection and
 * queue depth as null — what `/status` showed before this task (`withoutNodeFields`) —, fails A168's oracle in exactly
 * those fields in every phase, and nothing else: each body still validates (null is the schema's "no value yet"), and
 * the retries, the cursor, the head, the state and `finality-stall` still show. Each phase reads `/status` for a shorter
 * time than the test's: every phase is expected to run out of it.
 */

/** How long a phase reads `/status` here: each one runs out of it. */
const PHASE_PATIENCE_MS = 8_000;

describe.each(PROCESS_BACKENDS)("A168's negative control on $name", (backend) => {
  beforeAll(() => backend.start(), 180_000);
  afterAll(() => backend.stop(), 60_000);

  it("a process that publishes none of the node's three fields fails A168 in exactly those", async () => {
    const observed = await a168Run(await backend.database(), { patienceMs: PHASE_PATIENCE_MS, wrap: withoutNodeFields });
    expect(a168Problems(observed)).toEqual([
      'before the first connection: node.connection is null, not "connecting"',
      "before the first connection: node.queueDepth is null, not 0",
      'connected, the queue full: node.connection is null, not "connected"',
      'connected, the queue full: node.bestHead is null, not "102"',
      "connected, the queue full: node.queueDepth is null, not 2",
      'connected, 101 taken from the queue: node.connection is null, not "connected"',
      'connected, 101 taken from the queue: node.bestHead is null, not "102"',
      "connected, 101 taken from the queue: node.queueDepth is null, not 1",
      'the node gone: node.connection is null, not "retrying"',
      'the node gone, retries counting: node.connection is null, not "retrying"',
      'after the stop: node.connection is null, not "closed"',
    ]);
  }, PATIENCE_MS * 2);
});
