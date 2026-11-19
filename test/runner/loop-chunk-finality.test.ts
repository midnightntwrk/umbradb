import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { UmbraError } from "../../src/db/errors.js";
import type { BlockSource } from "../../src/runner/block-source.js";
import { type CaseOutcome, runCase } from "./loop-chunk-runs.js";
import type { InMemoryBlockSource, RunnerBackend } from "./loop-harness.js";
import { RUNNER_BACKENDS } from "./loop-harness.js";

/**
 * A finality conflict the source records while a chunk's transaction is open (`src/runner/loop.ts`, fast-sync mode),
 * on PostgreSQL 18 and PGlite 0.5.10. The node source keeps its first failure and gives it at the loop's next call
 * (`finalizedHead`, `prepared`, `waitForHead`); the stand-in here does the same over the in-memory chain, recording
 * the conflict during block 7's writes, heights 1 to 20.
 * - With the mode off the block in progress commits and the loop halts at the next height it asks the source for: 8,
 *   the cursor at 7.
 * - In chunks of 5 the loop asks the source for nothing while the chunk 6..10 is open: the chunk commits, and the loop
 *   halts at 11, the cursor at 10. That is at most the chunk's length later, and nothing above the chunk is stored.
 */

const HEAD = 20n;

/** The in-memory chain as a source that gives the failure it recorded, once it has one, at each call for the chain. */
function recording(memory: InMemoryBlockSource, state: { failure: UmbraError | undefined }): BlockSource {
  const check = (): void => {
    if (state.failure !== undefined) throw state.failure;
  };
  return {
    cursor: (read) => memory.cursor(read),
    latestHead: () => memory.latestHead(),
    async finalizedHead() {
      check();
      return memory.finalizedHead();
    },
    async waitForHead(above, signal) {
      check();
      await memory.waitForHead(above, signal);
    },
    async block(height) {
      check();
      return memory.block(height);
    },
  };
}

/** One run: the conflict recorded at `f`'s `on-db-write` of 7. */
async function conflicting(backend: RunnerBackend, blocks: number | undefined): Promise<CaseOutcome> {
  const state: { failure: UmbraError | undefined } = { failure: undefined };
  return runCase(backend, {
    head: HEAD,
    ...(blocks === undefined ? {} : { blocks }),
    source: (memory) => recording(memory, state),
    async at(point, height) {
      if (point !== "on-db-write" || height !== 7n) return;
      state.failure = new UmbraError("finality-conflict", "the node reported another finalized block at height 3 (the test's source)", { height: 3n });
    },
  });
}

/** The code of the error behind a run's only failure. */
const codeOf = (outcome: CaseOutcome): unknown => (outcome.failures[0]?.cause as UmbraError | undefined)?.code;

describe.each(RUNNER_BACKENDS)("a finality conflict recorded while a chunk is open, on $name", (backend) => {
  beforeAll(() => backend.start(), 180_000);
  afterAll(() => backend.stop(), 60_000);

  it("halts once the chunk committed, at the height above it, where the mode off halts at the next height", async () => {
    const off = await conflicting(backend, undefined);
    expect(off.failures.map((failure) => [failure.height, failure.committed])).toEqual([[8n, false]]);
    expect(codeOf(off)).toBe("finality-conflict");
    expect(off.cursor).toBe(7n);
    const on = await conflicting(backend, 5);
    expect(on.failures.map((failure) => [failure.height, failure.committed])).toEqual([[11n, false]]);
    expect(codeOf(on)).toBe("finality-conflict");
    expect(on.cursor).toBe(10n);
    // The whole chunk committed in its one transaction, and nothing above it was begun.
    expect(on.facts).toEqual(Array.from({ length: 10 }, (_, i) => `told committed ${i + 1}`));
    // The read before the first chunk, then 1..5 and 6..10.
    expect(on.order.filter((mark) => mark === "BEGIN")).toHaveLength(3);
    expect(on.order.filter((mark) => /^on-(fetch|parse)@(1[1-9]|20)$/.test(mark))).toEqual([]);
  }, 120_000);
});
