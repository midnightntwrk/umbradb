import { afterAll, beforeAll, describe, expect, it } from "vitest";
import type { Database, Transaction } from "../../src/db/api.js";
import { UmbraError } from "../../src/db/errors.js";
import { losingCommits } from "./block-continues-harness.js";
import { type CaseOutcome, count, type Fault, runCase, tablesCompared, where } from "./loop-chunk-runs.js";
import { RUNNER_BACKENDS } from "./loop-harness.js";

/**
 * A failure kept for a block of a chunk until the loop reaches that block (`src/runner/loop.ts`, fast-sync mode), on
 * PostgreSQL 18 and PGlite 0.5.10: heights 1 to 10 in chunks of 5 (1..5, 6..10) against the mode off with the same
 * faults. Block 8's `on-compute` fails once inside the chunk 6..10, so the chunk commits at 7; whatever then fails
 * below 8, the failure stays 8's: the loop halts at 8 with the cursor at 7 and 8's `on-compute` is not called a second
 * time.
 * - block 6's `on-after-db-write` fails once with a lost connection, after the `COMMIT` at 7 answered;
 * - the same, after the `COMMIT` at 7 lost its answer and the next run's cursor read found it committed;
 * - a retryable failure of 8's `on-compute` is retried from `on-compute` once the loop reached 8, 8 not fetched again;
 * - the kept failure is dropped, and the observer told, when block 6's `on-after-db-write` stops processing.
 * A chunk's `COMMIT` answered with an error is its last block's failure: the blocks below it are stored again, and the
 * last block halts with that error, its callbacks not called again.
 */

const HEAD = 10n;
const COMPUTE_8: Fault = { at: "on-compute", height: 8n, retryable: false };
const AFTER_6: Fault = { at: "on-after-db-write", height: 6n, retryable: true };

/** The error a refused `COMMIT` answers with. */
const refused = (): UmbraError => new UmbraError("database-error", "the COMMIT was refused (the test's database)", { sqlstate: "53100" });

/** `db`, whose next transaction rolls back with {@link refused} once its body ended, when `state.armed`. */
function refusingCommits(db: Database): { readonly db: Database; readonly state: { armed: boolean } } {
  const state = { armed: false };
  const wrapped: Database = {
    read: (body, options) => db.read(body, options),
    transaction: <T>(body: (tx: Transaction) => Promise<T>): Promise<T> =>
      db.transaction(async (tx) => {
        const value = await body(tx);
        if (!state.armed) return value;
        state.armed = false;
        throw refused();
      }),
    writerSession: () => db.writerSession(),
    close: () => db.close(),
  };
  return { db: wrapped, state };
}

describe.each(RUNNER_BACKENDS)("a failure kept for a block of a chunk, on $name", (backend) => {
  beforeAll(() => backend.start(), 180_000);
  afterAll(() => backend.stop(), 60_000);

  const both = async (run: (blocks: number | undefined) => Promise<CaseOutcome>) => ({ off: await run(undefined), on: await run(5) });
  const chunks = (blocks: number | undefined) => (blocks === undefined ? {} : { blocks });

  it("survives a retry of a callback after the commit of a block below it: block 6's on-after-db-write fails once, retryably, and the loop still halts at 8", async () => {
    const faults = [COMPUTE_8, AFTER_6];
    const { off, on } = await both((blocks) => runCase(backend, { head: HEAD, faults, ...chunks(blocks) }));
    const expected = [
      { height: 6n, point: "on-after-db-write", module: "f", committed: true },
      { height: 8n, point: "on-compute", module: "f", committed: false },
    ];
    expect(off.failures.map(where)).toEqual(expected);
    expect(on.failures.map(where)).toEqual(expected);
    expect(off.cursor).toBe(7n);
    expect(on.cursor).toBe(7n);
    expect(count(off.calls, "on-compute@8")).toBe(1);
    expect(count(on.calls, "on-compute@8")).toBe(1);
    expect(on.dropped).toEqual([]);
    // 6 and 7 committed by the chunk, 8 told rolled back once.
    expect(on.facts).toEqual([...[1n, 2n, 3n, 4n, 5n, 6n, 7n].map((h) => `told committed ${h}`), "told rolledBack 8"]);
    const tables = tablesCompared(on, off);
    expect(tables.differing).toEqual([]);
    expect(tables.compared).toBeGreaterThan(0);
  }, 120_000);

  it("survives a COMMIT below it that lost its answer, and a retry of the callbacks the next run delivers", async () => {
    const lost = async (blocks: number | undefined): Promise<CaseOutcome> => {
      let losing: ReturnType<typeof losingCommits> | undefined;
      let armed = false;
      return runCase(backend, {
        head: HEAD,
        faults: [COMPUTE_8, AFTER_6],
        ...chunks(blocks),
        database: (raw) => (losing = losingCommits(raw)).db,
        // The COMMIT that holds block 7 lands and loses its answer.
        async at(point, height) {
          if (point !== "on-db-write" || height !== 7n || armed) return;
          armed = true;
          (losing as ReturnType<typeof losingCommits>).state.armed = "landed";
        },
      });
    };
    const { off, on } = await both(lost);
    const last = { height: 8n, point: "on-compute", module: "f", committed: false };
    expect(off.failures.map(where).at(-1)).toEqual(last);
    expect(on.failures.map(where)).toEqual([
      // The chunk's COMMIT at 7, its answer lost; then, found committed, 6's callback; then 8's kept failure.
      { height: 7n, point: undefined, module: undefined, committed: false },
      { height: 6n, point: "on-after-db-write", module: "f", committed: true },
      last,
    ]);
    expect(off.cursor).toBe(7n);
    expect(on.cursor).toBe(7n);
    expect(count(on.calls, "on-compute@8")).toBe(1);
    expect(on.dropped).toEqual([]);
  }, 120_000);

  it("is retried from on-compute once the loop reached its block when it is retryable, the block not fetched again", async () => {
    const faults: Fault[] = [{ at: "on-compute", height: 8n, retryable: true }, AFTER_6];
    const { off, on } = await both((blocks) => runCase(backend, { head: HEAD, faults, ...chunks(blocks) }));
    const expected = [
      { height: 6n, point: "on-after-db-write", module: "f", committed: true },
      { height: 8n, point: "on-compute", module: "f", committed: false },
    ];
    expect(off.failures.map(where)).toEqual(expected);
    expect(on.failures.map(where)).toEqual(expected);
    expect(off.cursor).toBe(HEAD);
    expect(on.cursor).toBe(HEAD);
    // Called once, its failure kept until the loop reached 8, then once more by the retry: as often as with the mode off.
    expect(count(on.calls, "on-compute@8")).toBe(2);
    expect(count(off.calls, "on-compute@8")).toBe(2);
    expect(count(on.calls, "on-fetch@8")).toBe(1);
    expect(count(on.calls, "on-parse@8")).toBe(1);
    expect(tablesCompared(on, off).differing).toEqual([]);
  }, 120_000);

  it("is dropped, and the observer told, when a block below it stops processing: block 6's on-after-db-write fails and the loop halts there", async () => {
    const faults: Fault[] = [COMPUTE_8, { at: "on-after-db-write", height: 6n, retryable: false }];
    const on = await runCase(backend, { head: HEAD, faults, blocks: 5 });
    expect(on.failures.map(where)).toEqual([{ height: 6n, point: "on-after-db-write", module: "f", committed: true }]);
    expect(on.cursor).toBe(7n);
    expect(on.dropped).toEqual([8n]);
    expect(count(on.calls, "on-compute@8")).toBe(1);
  }, 120_000);

  it("a COMMIT answered with an error is its last block's failure: the blocks below it are stored again, and the last halts with that error, not called again", async () => {
    const refusing = async (blocks: number | undefined): Promise<CaseOutcome> => {
      let commits: ReturnType<typeof refusingCommits> | undefined;
      let armed = false;
      return runCase(backend, {
        head: HEAD,
        ...chunks(blocks),
        database: (raw) => (commits = refusingCommits(raw)).db,
        // The COMMIT that holds block 10 is refused, once.
        async at(point, height) {
          if (point !== "on-db-write" || height !== HEAD || armed) return;
          armed = true;
          (commits as ReturnType<typeof refusingCommits>).state.armed = true;
        },
      });
    };
    const { off, on } = await both(refusing);
    const expected = [{ height: HEAD, point: undefined, module: undefined, committed: false }];
    expect(off.failures.map(where)).toEqual(expected);
    expect(on.failures.map(where)).toEqual(expected);
    // The error the COMMIT answered with, kept as it was.
    expect((on.failures[0]?.cause as UmbraError).details.sqlstate).toBe("53100");
    expect((off.failures[0]?.cause as UmbraError).details.sqlstate).toBe("53100");
    expect(off.cursor).toBe(HEAD - 1n);
    expect(on.cursor).toBe(HEAD - 1n);
    expect(on.facts).toEqual([
      ...[1n, 2n, 3n, 4n, 5n].map((h) => `told committed ${h}`),
      ...[6n, 7n, 8n, 9n, 10n].map((h) => `told rolledBack ${h}`),
      ...[6n, 7n, 8n, 9n].map((h) => `told committed ${h}`),
    ]);
    // 6 to 9 stored again from on-compute; 10's callbacks called once, as with the mode off.
    for (const point of ["on-compute", "on-db-write", "on-settle"]) {
      expect(count(on.calls, `${point}@9`), `${point}@9`).toBe(2);
      expect(count(on.calls, `${point}@10`), `${point}@10`).toBe(1);
      expect(count(off.calls, `${point}@10`), `${point}@10`).toBe(1);
    }
    for (let h = 1n; h <= HEAD; h++) expect(count(on.calls, `on-fetch@${h}`), `on-fetch@${h}`).toBe(1);
    expect(tablesCompared(on, off).differing).toEqual([]);
  }, 120_000);
});
