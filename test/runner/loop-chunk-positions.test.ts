import { afterAll, beforeAll, describe, expect, it } from "vitest";
import type { BlockSource } from "../../src/runner/block-source.js";
import { type CaseOptions, count, type Fault, runCase, tablesCompared, where } from "./loop-chunk-runs.js";
import type { InMemoryBlockSource } from "./loop-harness.js";
import { RUNNER_BACKENDS } from "./loop-harness.js";

/**
 * The failure rule of chunks at a chunk's first and last block (`src/runner/loop.ts`, fast-sync mode;
 * `loop-chunk-failures.test.ts` has a block in the middle), on PostgreSQL 18 and PGlite 0.5.10: heights 1 to 10 in
 * chunks of 5 (1..5, 6..10), against the mode off with the same fault, at block 6 and at block 10. A fault at
 * `on-fetch`, `on-parse`, `on-compute`, `on-db-write`, `on-settle`, the cursor check and `on-after-db-write`, once,
 * retryable (a lost connection) and not; the loop runs again after a retryable failure, as the process does.
 *
 * Each case checks the halt (height, point, module, committed) or the retry; the cursor; the follower's facts; the
 * failing callback called as often as with the mode off; nothing fetched again up to the failing block; `continues`
 * false at every block stored again; and the tables at every height committed, against the mode off.
 */

const HEAD = 10n;
const FIRST = 6n;

type FaultAt = Fault["at"] | "cursor-check";

/** The case's options for a fault at `at` of block `k`: `f`'s fault, or a cursor check that reads no cursor once. */
function faulted(at: FaultAt, k: bigint, retryable: boolean): Pick<CaseOptions, "faults" | "at" | "source"> {
  if (at !== "cursor-check") return { faults: [{ at, height: k, retryable }] };
  const arm = { cursor: false, fired: false };
  return {
    async at(point, height) {
      if (point !== "on-settle" || height !== k || arm.fired) return;
      arm.fired = true;
      arm.cursor = true;
    },
    // The cursor check reads the cursor through the transaction: once armed, it reads none.
    source: (memory: InMemoryBlockSource): BlockSource => ({
      cursor: async (read) => {
        if (arm.cursor && "execute" in read) {
          arm.cursor = false;
          return null;
        }
        return memory.cursor(read);
      },
      finalizedHead: () => memory.finalizedHead(),
      latestHead: () => memory.latestHead(),
      waitForHead: (above, signal) => memory.waitForHead(above, signal),
      block: (height) => memory.block(height),
    }),
  };
}

const committed = (from: bigint, to: bigint): string[] => Array.from({ length: Number(to - from + 1n) }, (_, i) => `told committed ${from + BigInt(i)}`);
const rolledBack = (from: bigint, to: bigint): string[] => Array.from({ length: Number(to - from + 1n) }, (_, i) => `told rolledBack ${from + BigInt(i)}`);

describe.each(RUNNER_BACKENDS)("the failure rule at a chunk's first and last block on $name", (backend) => {
  beforeAll(() => backend.start(), 180_000);
  afterAll(() => backend.stop(), 60_000);

  const POINTS: readonly FaultAt[] = ["on-fetch", "on-parse", "on-compute", "on-db-write", "on-settle", "cursor-check", "on-after-db-write"];

  for (const [place, k] of [
    ["first", FIRST],
    ["last", HEAD],
  ] as const) {
    for (const at of POINTS) {
      for (const retryable of at === "cursor-check" ? [false] : [false, true]) {
        it(`a ${retryable ? "retryable" : "non-retryable"} failure at ${at} of block ${k}, the ${place} block of the chunk 6..10`, async () => {
          const off = await runCase(backend, { head: HEAD, ...faulted(at, k, retryable) });
          const on = await runCase(backend, { head: HEAD, blocks: 5, ...faulted(at, k, retryable) });
          // The same halt, or the same retry, as the mode off.
          expect(on.failures.map(where)).toEqual(off.failures.map(where));
          expect(on.failures.map((failure) => failure.height)).toEqual([k]);
          const writes = at === "on-db-write" || at === "on-settle" || at === "cursor-check";
          const after = at === "on-after-db-write";
          // The cursor: the mode off's, but after a failure once the chunk committed, where it is the chunk's last block.
          expect(off.cursor).toBe(retryable ? HEAD : after ? k : k - 1n);
          expect(on.cursor).toBe(retryable || after ? HEAD : k - 1n);
          // The follower's facts.
          if (writes && k === HEAD) {
            // 6 to 9 were written in the chunk that rolled back, and are stored again one per transaction.
            expect(on.facts).toEqual([...committed(1n, 5n), ...rolledBack(FIRST, HEAD), ...committed(FIRST, retryable ? HEAD : HEAD - 1n)]);
          } else if (after && !retryable) {
            expect(on.facts).toEqual(committed(1n, HEAD));
          } else {
            expect(on.facts).toEqual(off.facts);
          }
          // The failing callback as often as the mode off calls it; after a commit the retry re-delivers the cursor's
          // block, which is the chunk's last.
          const failingCall = at === "cursor-check" ? `on-settle@${k}` : `${at}@${k}`;
          if (after && retryable && k === FIRST) {
            expect([6n, 7n, 8n, 9n, 10n].map((h) => count(on.calls, `on-after-db-write@${h}`))).toEqual([1, 0, 0, 0, 1]);
            expect([6n, 7n, 8n, 9n, 10n].map((h) => count(off.calls, `on-after-db-write@${h}`))).toEqual([2, 1, 1, 1, 1]);
          } else {
            expect(count(on.calls, failingCall)).toBe(count(off.calls, failingCall));
          }
          for (let h = 1n; h <= k; h++) {
            for (const point of ["on-fetch", "on-parse"]) expect(count(on.order, `${point}@${h}`), `${point}@${h}`).toBe(count(off.order, `${point}@${h}`));
          }
          // Blocks stored again: from on-compute, continues false.
          if (writes && k === HEAD) {
            for (let h = FIRST; h < HEAD; h++) {
              const computes = on.seen.filter((entry) => entry.point === "on-compute" && entry.height === h);
              expect(computes.map((entry) => entry.continues), `on-compute@${h}`).toEqual([true, false]);
            }
          }
          const tables = tablesCompared(on, off);
          expect(tables.differing).toEqual([]);
          expect(tables.compared).toBeGreaterThan(0);
        }, 120_000);
      }
    }
  }
});
