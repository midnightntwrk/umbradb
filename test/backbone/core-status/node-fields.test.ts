import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { PROCESS_BACKENDS } from "../../runner/process-backends.js";
import { PATIENCE_MS } from "../ingest-harness.js";
import { a168Problems, a168Run, privateRun } from "./node-fields-harness.js";

/**
 * A core against a tape node shows its node on `/status`, on PostgreSQL 18.6 and PGlite 0.5.10. [A168 CI, AE-5]
 * - Before the first connection, the connection is `connecting`.
 * - Once connected, it is `connected`, with `node.bestHead` the best head the node announced last and `node.queueDepth`
 *   the best-block queue's length.
 * - With the node gone, it is `retrying`, with `node.retries` counting.
 * - After the stop, it is `closed`.
 *
 * A private process shows no node: the three fields are null with it. Every body read validates against
 * `./status.schema.json`. [A66]
 *
 * The run and the oracle are in `./node-fields-harness.ts`. The committed negative control, a process whose published
 * state carries none of the three fields, is `./node-fields.negative-control.test.ts`.
 */

/** How long a phase reads `/status` for what it expects once the process shows its precondition (a loaded machine). */
const PHASE_PATIENCE_MS = 30_000;

describe.each(PROCESS_BACKENDS)("A168: the node's fields on /status on $name", (backend) => {
  beforeAll(() => backend.start(), 180_000);
  afterAll(() => backend.stop(), 60_000);

  it("A168: connecting, then connected with the best head announced last and the queue's depth, retrying, closed", async () => {
    const observed = await a168Run(await backend.database(), { patienceMs: PHASE_PATIENCE_MS });
    expect(a168Problems(observed)).toEqual([]);
    expect(observed.phases.map((phase) => phase.name)).toEqual([
      "before the first connection",
      "connected, the queue full",
      "connected, 101 taken from the queue",
      "the node gone",
      "the node gone, retries counting",
      "after the stop",
    ]);
  }, PATIENCE_MS * 2);

  it("A168: a private process shows no node, so none of the three", async () => {
    const observed = await privateRun(backend, PHASE_PATIENCE_MS);
    expect(a168Problems(observed)).toEqual([]);
    expect(observed.phases.map((phase) => phase.name)).toEqual(["a private process at 3"]);
  }, PATIENCE_MS * 2);
});
