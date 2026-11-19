import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { CORE_LEDGER_STATE_ID } from "../../src/backbone/core-ledger-state/core-ledger-state.js";
import type { TransactionFollower } from "../../src/runner/transaction-follower.js";
import { PROCESS_BACKENDS } from "../runner/process-backends.js";
import { refusalHeight } from "./eviction-restart.js";
import { commitProblems, followRun } from "./host-follows.js";
import { PATIENCE_MS } from "./ingest-harness.js";

/**
 * The negative control of `ledger-host-follows.test.ts`, through the real process on PostgreSQL 18 and PGlite 0.5.10
 * with the extended DAG fixture (`./host-follows.ts`): the loop tells the ledger worker's host `committed` when a
 * block's body ends, before its `COMMIT`, and nothing when the `COMMIT` answers. With the `COMMIT` of h lost before it
 * landed, the oracle finds it wrong: the thread got a commit of h for a transaction that rolled back, and so held as
 * committed a state the database does not. h made again is then applied anew instead of getting its pending state
 * back, and the package, which still counts the lost transaction's nodes as stored, leaves them out of h's flush
 * (`src/ledger/worker/engine.ts`'s module comment on a block applied again): the reclamation's check halts processing
 * at h with `ledger-refcount-invalid`, where the real run (`ledger-host-follows.test.ts`) stores what an uninterrupted
 * run stores.
 */

const H = refusalHeight();
const LAST = Number(H) + 3;

/** The process's follower told `committed` at `written`, and not at the `COMMIT`'s answer. */
const early = (process: TransactionFollower): TransactionFollower => ({
  written: (block) => {
    process.written(block);
    process.committed(block);
  },
  committed: () => undefined,
  rolledBack: (block) => process.rolledBack(block),
});

describe.each(PROCESS_BACKENDS)("the negative control of the host's commit, on $name", (backend) => {
  beforeAll(() => backend.start(), 180_000);
  afterAll(() => backend.stop(), 60_000);

  it("a COMMIT lost before it landed: a commit of h for the lost transaction, and a halt at h", async () => {
    const follow = await followRun(await backend.database(), {
      last: LAST,
      lose: { at: H, how: "lost" },
      follower: early,
      halts: true,
    });
    expect(follow.run.status).toMatchObject({
      state: "halted",
      cursor: H - 1n,
      reason: { code: "ledger-refcount-invalid", height: H, module: CORE_LEDGER_STATE_ID, point: "on-settle" },
    });
    // What the thread was sent, against the heights that committed (0 to h − 1).
    const committed = Array.from({ length: Number(H) + 1 }, (_, h) => String(h));
    expect(commitProblems(follow, Number(H) - 1)).toEqual(
      expect.arrayContaining([
        `the thread got commits for ${committed.join(",")}, not one for each height of 0 to ${Number(H) - 1} in order`,
        `commit ${H} for a height never found committed`,
      ]),
    );
    expect(follow.counters).toMatchObject({ threads: 1 });
  }, PATIENCE_MS * 2);
});
