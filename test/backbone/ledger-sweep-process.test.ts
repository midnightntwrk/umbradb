import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { startLedgerWorker } from "../../src/ledger/worker/host.js";
import { CHANGE, LAST, REVERT, stateNodes } from "../ledger/fixtures/sweep-fixture.js";
import { PROCESS_BACKENDS, type ProcessDatabase } from "../runner/process-backends.js";
import { committed, ingest, PATIENCE_MS } from "./ingest-harness.js";
import { heldNodeProblems } from "./ledger-storage-checks.js";
import {
  modelOfFixture,
  modelProblems,
  SWEEP_LOADER,
  sweepCore,
  sweepTables,
  sweepTape,
  sweepWatcher,
  type TableSnapshot,
  tablesByHeight,
} from "./sweep-tapes.js";

/**
 * A105 `[DIFF]` (task 12.5; `openspec/changes/core-arch/acceptance.md` A105, LG-14): `core-ledger-state`'s
 * fixed-budget mark-and-sweep through the real process, on PostgreSQL 18 and PGlite 0.5.10, with K = 50, over task
 * 12.5's DAG fixture (`test/ledger/fixtures/sweep-fixture.ts`: wide trees, a new root every block, a marking round larger
 * than the budget) served by a test package in the ledger worker (`sweep-test-loader.ts`, which stores nodes as the
 * vendored packages do and honours evictions): after every block the sweep's row, its grey set, its marks and the stored
 * nodes are the reference model's (`./sweep-model.ts`) — on both backends, which are then equal —; the nodes of subtree
 * 0's first version, deleted by the sweep while its second version stood, are needed again at the fixture's REVERT and
 * inserted again (LG-14's "Reused content after a deletion"); with `sweep: off` nothing is deleted. The committed
 * negative control (insertion order) is `ledger-sweep.negative-control.test.ts`.
 */

const hex = (bytes: Uint8Array): string => Buffer.from(bytes).toString("hex");

/** Runs the fixture on `db` with `settings`; the tables after every height, and the keys the package was told to evict. */
async function runFixture(db: ProcessDatabase, settings: Readonly<Record<string, unknown>> = {}) {
  const seen = new Map<bigint, TableSnapshot>();
  let evicted: readonly string[] = [];
  let worker: ReturnType<typeof startLedgerWorker> | undefined;
  const process = await ingest(db, sweepTape().records, {
    start: 0n,
    core: sweepCore(),
    user: [sweepWatcher(seen)],
    settings,
    ledgerWorker: () => (worker = startLedgerWorker({ loader: SWEEP_LOADER })),
  });
  let status;
  try {
    await committed(process, BigInt(LAST), PATIENCE_MS * 2);
    status = process.handle.status();
    ({ evicted } = (await worker?.probe()) as { evicted: readonly string[] });
  } finally {
    await process.close();
  }
  return { status, tables: await tablesByHeight(seen, db, BigInt(LAST)), evicted };
}

/** The keys of subtree 0's first version (its node and leaves), which the fixture deletes and needs again. */
const firstVersion = (): string[] => stateNodes(0).slice(1, 6).map((node) => hex(node.key));

describe("A105 (LG-14): the fixed-budget mark-and-sweep, against its reference model", () => {
  beforeAll(() => Promise.all(PROCESS_BACKENDS.map((backend) => backend.start())), 180_000);
  afterAll(() => Promise.all(PROCESS_BACKENDS.map((backend) => backend.stop())), 60_000);

  it("[[ledger.sweep-cross-backend-identical]] A105: K = 50 over wide trees and interleaved new roots, the grey, marked and stored sets are the reference model's after every block, on PostgreSQL and on PGlite", async () => {
    const model = modelOfFixture();
    // The fixture is what A105 asks: one marking round does not fit in the budget, cycles complete, nodes are deleted.
    expect((model[0]?.grey.length ?? 0) + (model[0]?.marks.length ?? 0)).toBeGreaterThan(50);
    expect(model.at(-1)?.cycle).toBeGreaterThanOrEqual(4n);
    const runs: Map<bigint, TableSnapshot>[] = [];
    for (const backend of PROCESS_BACKENDS) {
      const db = await backend.database();
      const run = await runFixture(db);
      expect(run.status, backend.name).toMatchObject({ cursor: BigInt(LAST), reason: null });
      expect(modelProblems(run.tables, model), backend.name).toEqual([]);
      // Every node the sweep deleted was evicted from the worker's package, and nothing else.
      expect([...run.evicted].sort(), backend.name).toEqual(model.flatMap((snapshot) => snapshot.deleted).sort());
      // A node deleted and needed again is inserted again: subtree 0's first version, deleted while its second stood.
      const again = firstVersion();
      const deletedAt = model.findIndex((snapshot) => again.some((key) => snapshot.deleted.includes(key)));
      expect(deletedAt, backend.name).toBeGreaterThan(CHANGE);
      expect(deletedAt, backend.name).toBeLessThan(REVERT);
      for (const key of again) {
        expect(run.tables.get(BigInt(REVERT - 1))?.nodes.includes(key), `${backend.name}: ${key} before ${REVERT}`).toBe(false);
        expect(run.tables.get(BigInt(REVERT))?.nodes.includes(key), `${backend.name}: ${key} at ${REVERT}`).toBe(true);
      }
      expect(await heldNodeProblems(db), backend.name).toEqual([]);
      runs.push(run.tables);
    }
    // The same rows on both backends after every block.
    expect(JSON.stringify([...(runs[0] ?? [])], (_k, v: unknown) => (typeof v === "bigint" ? `${v}` : v))).toBe(
      JSON.stringify([...(runs[1] ?? [])], (_k, v: unknown) => (typeof v === "bigint" ? `${v}` : v)),
    );
  }, PATIENCE_MS * 4);

  it("A105: a revision turning the sweep off clears its sets in its first block and deletes nothing; one turning it on again starts a new cycle", async () => {
    // On to 44 (mid-cycle), off from 45 (a revision), on again from 70: the tables after every block are the model's.
    const off = (h: number): boolean => h >= 45 && h < 70;
    const model = modelOfFixture(LAST, off);
    expect(model[44]?.phase).not.toBe("idle");
    expect(model[44]?.marks.length).toBeGreaterThan(0);
    for (const backend of PROCESS_BACKENDS) {
      const db = await backend.database();
      const seen = new Map<bigint, TableSnapshot>();
      const process = await ingest(db, sweepTape().records, {
        start: 0n,
        core: sweepCore(),
        user: [sweepWatcher(seen)],
        revisions: [
          { start: 45n, settings: { sweep: "off" } },
          { start: 70n, settings: { sweep: "on" } },
        ],
        ledgerWorker: () => startLedgerWorker({ loader: SWEEP_LOADER }),
      });
      try {
        await committed(process, BigInt(LAST), PATIENCE_MS * 2);
      } finally {
        await process.close();
      }
      const tables = await tablesByHeight(seen, db, BigInt(LAST));
      expect(modelProblems(tables, model), backend.name).toEqual([]);
      expect(tables.get(45n), backend.name).toMatchObject({ phase: "idle", sweepAfter: null, grey: [], marks: [] });
      expect(tables.get(69n)?.nodes.length, backend.name).toBeGreaterThan(tables.get(45n)?.nodes.length ?? 0);
      expect(tables.get(70n)?.cycle, backend.name).toBe((tables.get(69n)?.cycle ?? 0n) + 1n);
    }
  }, PATIENCE_MS * 4);

  it("A105: with sweep off nothing is deleted, and the sweep's tables stay as their migration left them", async () => {
    for (const backend of PROCESS_BACKENDS) {
      const db = await backend.database();
      const run = await runFixture(db, { sweep: "off" });
      expect(run.status, backend.name).toMatchObject({ cursor: BigInt(LAST), reason: null });
      const model = modelOfFixture(LAST, () => true);
      expect(modelProblems(run.tables, model), backend.name).toEqual([]);
      expect(run.evicted, backend.name).toEqual([]);
      let before: readonly string[] = [];
      for (let h = 0; h <= LAST; h++) {
        const tables = run.tables.get(BigInt(h)) as TableSnapshot;
        expect(before.every((key) => tables.nodes.includes(key)), `${backend.name} at ${h}`).toBe(true);
        expect([tables.cycle, tables.phase, tables.sweepAfter, tables.grey.length, tables.marks.length]).toEqual([0n, "idle", null, 0, 0]);
        before = tables.nodes;
      }
      // Every node any state of the fixture holds is stored.
      const all = new Set(Array.from({ length: LAST + 1 }, (_, h) => stateNodes(h).map((node) => hex(node.key))).flat());
      expect((await sweepTables(db)).nodes).toEqual([...all].sort());
    }
  }, PATIENCE_MS * 4);
});
