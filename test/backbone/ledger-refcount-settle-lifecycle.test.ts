import { setTimeout as sleep } from "node:timers/promises";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import type { PostgresParts } from "../../src/config/database-parts.js";
import type { Transaction } from "../../src/db/api.js";
import { type LedgerHost, startLedgerWorker } from "../../src/ledger/worker/host.js";
import { FinalizedLoop, type HeightRun, type LoopInput } from "../../src/runner/loop.js";
import { settlesWithin } from "../db/backends.js";
import { LAST } from "../ledger/fixtures/sweep-fixture.js";
import { COUNTERS, countersMemory } from "../ledger/fixtures/sweep-test-loader.js";
import { type CommitFault, CommitProxy } from "../runner/commit-proxy.js";
import { PROCESS_BACKENDS, type ProcessBackend, type ProcessDatabase } from "../runner/process-backends.js";
import { committed, type Ingest, ingest, PATIENCE_MS } from "./ingest-harness.js";
import {
  SWEEP_LOADER,
  seenTables,
  sweepCore,
  sweepTables,
  sweepTape,
  sweepWatcher,
  type TableSnapshot,
  workerRecord,
} from "./ledger-graph-tapes.js";
import { type DagRun, runDag } from "./refcount-process.js";

/**
 * A stop and a pause asked for while `core-ledger-state`'s `on-settle` awaits the ledger worker, on PostgreSQL 18 and
 * PGlite 0.5.10, on the extended DAG fixture through the real process. The worker's eviction of block h (the first
 * whose reclamation deletes nodes) is held until the test lets it go:
 * - a stop asked for then waits for the block's transaction: it has not ended while the eviction is held, and once the
 *   eviction is answered h commits and the process stops at h, its tables those of a run with no stop; a process
 *   started again on the database goes on to the fixture's last height with the same tables;
 * - a pause asked for then takes effect between heights: it has not resolved while the eviction is held, h commits,
 *   the loop is paused at h and starts no height until resumed, and then goes on to the last height with the same
 *   tables.
 *
 * And on PostgreSQL 18, a `COMMIT` of block h whose answer is lost, with the ledger worker in the process (a proxy
 * between the process and the server ends the writer's backend at that `COMMIT`, `../runner/commit-proxy.ts`): the
 * cursor read after the reconnection decides. When the server committed h, h is not computed again: the worker
 * applied it and was sent its eviction once, and its commit reaches the worker at h's `on-after-db-write`; when it did
 * not, h is made again from `on-compute`: applied again (the worker gives its pending result) and its eviction sent
 * again. Either way the worker loads no state from the database, and the tables after every block are a run's with no
 * fault.
 */

/** The tables whose rows are compared whole: every table of `core_ledger_state`, by its digest. */
const digestsOf = (snapshot: TableSnapshot | undefined): [string, string][] => [...(snapshot?.digests ?? [])];

/** A process on `db` whose worker holds the eviction of block `at` until `release` is called (see the module comment). */
async function heldAt(db: ProcessDatabase, at: bigint): Promise<{ readonly process: Ingest; readonly reached: Promise<void>; release(): void }> {
  let reach!: () => void;
  const reached = new Promise<void>((resolve) => (reach = resolve));
  let release!: () => void;
  const released = new Promise<void>((resolve) => (release = resolve));
  const holding = (host: LedgerHost): LedgerHost => {
    let height: bigint | null = null;
    return new Proxy(host, {
      get(target, name, receiver) {
        if (name === "apply") {
          return (input: Parameters<LedgerHost["apply"]>[0], read: Parameters<LedgerHost["apply"]>[1]) => {
            height = input.height;
            return target.apply(input, read);
          };
        }
        if (name === "evict") {
          return async (keys: readonly Uint8Array[]) => {
            if (height === at) {
              reach();
              await released;
            }
            return target.evict(keys);
          };
        }
        return Reflect.get(target, name, receiver) as unknown;
      },
    });
  };
  const process = await ingest(db, sweepTape(LAST, "extended").records, {
    start: 0n,
    core: sweepCore(),
    // The modules of `runDag`'s runs, so that one can go on from this process's database.
    user: [sweepWatcher(seenTables(), workerRecord())],
    ledgerWorker: () => holding(startLedgerWorker({ loader: SWEEP_LOADER, loaderData: { dag: "extended" } })),
  });
  return { process, reached, release };
}

describe.each(PROCESS_BACKENDS)("a stop and a pause while on-settle awaits the worker, on $name", (backend: ProcessBackend) => {
  beforeAll(() => backend.start(), 180_000);
  afterAll(() => backend.stop(), 60_000);

  let clean: Promise<DagRun> | undefined;
  /** The run with no stop or pause (made once): the tables after every block. */
  const cleanRun = (): Promise<DagRun> => (clean ??= backend.database().then((db) => runDag(db, { dag: "extended" })));
  /** The first block whose reclamation deletes nodes. */
  const deletingHeight = async (): Promise<bigint> =>
    [...(await cleanRun()).evicted].filter(([, keys]) => keys.length > 0).map(([height]) => height).sort((a, b) => (a < b ? -1 : 1))[0] as bigint;

  it("a stop asked for while the eviction is awaited waits for the block's transaction: h commits, the process stops at h, and a new process goes on from there to the same tables", async () => {
    const plain = await cleanRun();
    const h = await deletingHeight();
    const db = await backend.database();
    const { process, reached, release } = await heldAt(db, h);
    let stopping: Promise<void> | undefined;
    try {
      await reached;
      stopping = process.handle.stop();
      // The block's transaction is open, awaiting the worker: the stop waits for it.
      expect(await settlesWithin(stopping, 300)).toBe(false);
      release();
      await stopping;
      expect(process.handle.status()).toMatchObject({ cursor: h, ended: { kind: "signal" } });
    } finally {
      release();
      if (stopping === undefined) await process.close();
      else {
        await stopping;
        await process.node.close();
      }
    }
    expect(digestsOf(await sweepTables(db))).toEqual(digestsOf(plain.tables.get(h)));
    const again = await runDag(db, { dag: "extended", resume: h });
    expect(again.status).toMatchObject({ cursor: BigInt(LAST), reason: null });
    expect(digestsOf(again.tables.get(BigInt(LAST)))).toEqual(digestsOf(plain.tables.get(BigInt(LAST))));
  }, PATIENCE_MS * 4);

  it("a pause asked for while the eviction is awaited takes effect once h committed: the loop starts no height until resumed, then goes on to the same tables", async () => {
    const plain = await cleanRun();
    const h = await deletingHeight();
    const db = await backend.database();
    const { process, reached, release } = await heldAt(db, h);
    try {
      await reached;
      const pausing = process.handle.pause();
      expect(await settlesWithin(pausing, 300)).toBe(false);
      release();
      await pausing;
      expect(process.handle.status().cursor).toBe(h);
      // Paused: no height starts.
      await sleep(500);
      expect(process.handle.status().cursor).toBe(h);
      process.handle.resume();
      await committed(process, BigInt(LAST), PATIENCE_MS * 2);
    } finally {
      release();
      await process.close();
    }
    expect(digestsOf(await sweepTables(db))).toEqual(digestsOf(plain.tables.get(BigInt(LAST))));
  }, PATIENCE_MS * 4);
});

describe("a COMMIT whose answer is lost, with the ledger worker in the process, on PostgreSQL 18", () => {
  const backend = PROCESS_BACKENDS.find((candidate) => candidate.kind === "postgres") as ProcessBackend;
  beforeAll(() => backend.start(), 180_000);
  afterAll(() => backend.stop(), 60_000);

  let clean: Promise<DagRun> | undefined;
  const cleanRun = (): Promise<DagRun> => (clean ??= backend.database().then((db) => runDag(db, { dag: "extended" })));

  /** A run through a proxy that ends the writer's backend at the `COMMIT` of `at`, `fault` before or after the server. */
  async function lostAt(at: bigint, fault: CommitFault) {
    const db = await backend.database();
    const proxy = await CommitProxy.start(db.setting as PostgresParts);
    const memory = countersMemory();
    const applies = new Map<bigint, number>();
    const evictions = new Map<bigint, number>();
    let armed = false;
    class ArmingLoop extends FinalizedLoop {
      protected override async write(tx: Transaction, run: HeightRun): Promise<void> {
        await super.write(tx, run);
        if (run.height === at && !armed) {
          armed = true;
          void proxy.arm(fault, { terminate: () => (db.terminateWriter as () => Promise<number>)() });
        }
      }
    }
    const counting = (host: LedgerHost): LedgerHost => {
      let height: bigint | null = null;
      return new Proxy(host, {
        get(target, name, receiver) {
          if (name === "apply") {
            return (input: Parameters<LedgerHost["apply"]>[0], read: Parameters<LedgerHost["apply"]>[1]) => {
              height = input.height;
              applies.set(input.height, (applies.get(input.height) ?? 0) + 1);
              return target.apply(input, read);
            };
          }
          if (name === "evict") {
            return (keys: readonly Uint8Array[]) => {
              if (height !== null) evictions.set(height, (evictions.get(height) ?? 0) + 1);
              return target.evict(keys);
            };
          }
          return Reflect.get(target, name, receiver) as unknown;
        },
      });
    };
    let run: DagRun;
    try {
      run = await runDag(
        { ...db, setting: proxy.setting(db.setting as PostgresParts) },
        { dag: "extended", data: { counters: memory }, settings: { backoffCeilingMs: 20 }, loop: ArmingLoop as new (input: LoopInput) => FinalizedLoop, worker: counting },
      );
    } finally {
      await proxy.close();
    }
    const shared = new Int32Array(memory);
    return { run, faults: proxy.faults, applies, evictions, storeLoads: Atomics.load(shared, COUNTERS.storeLoads), threads: Atomics.load(shared, COUNTERS.threads) };
  }

  for (const [fault, outcome] of [
    ["after", "committed: h is not computed again"],
    ["before", "not committed: h is made again from on-compute"],
  ] as const) {
    it(`the server ${fault === "after" ? "committed h" : "did not commit h"} and its answer was lost: ${outcome}, and the tables after every block are a clean run's`, async () => {
      const plain = await cleanRun();
      const h = [...plain.evicted].filter(([, keys]) => keys.length > 0).map(([height]) => height).sort((a, b) => (a < b ? -1 : 1))[0] as bigint;
      const lost = await lostAt(h, fault);
      expect(lost.faults).toEqual([fault]);
      expect(lost.run.lines.filter((line) => line.includes("retries in"))).toHaveLength(1);
      expect(lost.run.status).toMatchObject({ cursor: BigInt(LAST), reason: null });
      const times = fault === "after" ? 1 : 2;
      expect(lost.applies.get(h)).toBe(times);
      expect(lost.evictions.get(h)).toBe(times);
      expect(lost.applies.get(h + 1n)).toBe(1);
      // The worker never loaded a state from the database: it held the state after h, pending, throughout.
      expect({ threads: lost.threads, storeLoads: lost.storeLoads }).toEqual({ threads: 1, storeLoads: 0 });
      for (let height = 0n; height <= BigInt(LAST); height++) {
        expect(digestsOf(lost.run.tables.get(height)), `after ${height}`).toEqual(digestsOf(plain.tables.get(height)));
      }
    }, PATIENCE_MS * 4);
  }
});

