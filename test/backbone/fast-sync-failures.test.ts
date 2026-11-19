import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { z } from "zod";
import type { PostgresParts } from "../../src/config/database-parts.js";
import type { Transaction } from "../../src/db/api.js";
import { UmbraError } from "../../src/db/errors.js";
import type { BlockContext, ModuleDeclaration, PointName } from "../../src/modules/declaration.js";
import { FinalizedLoop, type HeightRun, type LoopInput } from "../../src/runner/loop.js";
import { LAST } from "../ledger/fixtures/sweep-fixture.js";
import { type CommitFault, CommitProxy } from "../runner/commit-proxy.js";
import { PROCESS_BACKENDS, type ProcessBackend, type ProcessDatabase } from "../runner/process-backends.js";
import { tableDifferences } from "./eviction-restart.js";
import { equalityWatcher, hashDifferences, hashed, type Hashed } from "./fast-sync-equality.js";
import { restartingBefore } from "./fast-sync-worker.js";
import { PATIENCE_MS } from "./ingest-harness.js";
import { type DagRun, type DagRunOptions, runDag, runProblems } from "./refcount-process.js";

/**
 * Fast-sync mode's failure rule through the real process on the original DAG fixture, on PostgreSQL 18 and PGlite
 * 0.5.10: chunks of 5, a fault at block 12, in the middle of the chunk 10..14. After each, the sync runs to the end (a
 * failure that is not retried halts both modes at the same block), and every table of every schema is equal to the
 * reference's at every height the run hashed (`./fast-sync-equality.ts`): the mode off with the same fault, its
 * worker restarted with the cursor at 9 where the chunk rolled back after its worker was led past 10 and 11 (a worker
 * restart can change the form a later node is stored in, in either mode).
 * - a retryable failure (a lost connection) at `on-compute`, `on-db-write`, `on-settle` and `on-after-db-write` of 12;
 * - a failure that is not retried, at `on-db-write` of 12: both halt at 12, cursor 11;
 * - with a deferred constraint in the module's schema, which keeps every block in a transaction of its own: the
 *   constraint broken by 12's row, and a deferred foreign key that 12's row violates and 13's row would repair. In both
 *   12's own `COMMIT` answers with the error, as with the mode off: both halt at 12, and no chunk rolled back, so the
 *   worker is not restarted and the reference is the plain mode off;
 * - PostgreSQL only: the writer's connection lost with the transaction open (its backend terminated at 12's
 *   writes), and the chunk's `COMMIT` lost before and after the server committed it (a proxy terminating the writer
 *   at that `COMMIT`).
 */

const K = 12n;
const BLOCKS = 5;

/**
 * Module `fault`: writes `(height, k)` at `on-db-write` (k 1 at 10 and, when `deferred`, at K: its unique constraint,
 * then declared deferred, breaks K's `COMMIT`); when `orphan`, a child row at K whose parent row it writes at K + 1
 * (its foreign key, then declared deferred, is violated at K's `COMMIT`, and would not be at K + 1's); at `point` of K
 * fails once, after its write, with a lost connection when `retryable`, or calls `at` there. Its schema has a
 * deferrable constraint only with `deferred` or `orphan`.
 */
function faulting(options: {
  readonly point?: PointName;
  readonly retryable?: boolean;
  readonly deferred?: boolean;
  readonly orphan?: boolean;
  readonly at?: () => Promise<void>;
}): ModuleDeclaration {
  let fired = false;
  const fault = async (point: PointName, height: bigint): Promise<void> => {
    if (height !== K || fired) return;
    if (options.at !== undefined && point === "on-db-write") {
      fired = true;
      await options.at();
      return;
    }
    if (options.point !== point) return;
    fired = true;
    if (options.retryable === true) throw new UmbraError("connection-lost", `the connection was lost at ${point} of ${height} (the test's module)`);
    throw new Error(`fault failed at ${point} of ${height}`);
  };
  return {
    id: "fault",
    version: "1.0.0",
    side: "public",
    requires: ["block-header"],
    provides: [
      { name: "fault-rows", lifetimes: ["table"], table: { schema: "fault", tables: ["rows", "parents", "children"], kind: "append-only" } },
    ],
    startsMidChain: true,
    configSchema: z.object({}),
    migrations: [
      {
        id: "001",
        sql:
          `CREATE TABLE fault.rows (height bigint PRIMARY KEY, k int${options.deferred === true ? ", CONSTRAINT k_once UNIQUE (k) DEFERRABLE INITIALLY DEFERRED" : ""}); ` +
          "CREATE TABLE fault.parents (height bigint PRIMARY KEY, id bigint NOT NULL UNIQUE); " +
          "CREATE TABLE fault.children (height bigint PRIMARY KEY, parent bigint NOT NULL" +
          `${options.orphan === true ? ", CONSTRAINT child_parent FOREIGN KEY (parent) REFERENCES fault.parents (id) DEFERRABLE INITIALLY DEFERRED" : ""})`,
      },
    ],
    points: {
      async "on-compute"(_p, b: BlockContext) {
        await fault("on-compute", b.height);
      },
      async "on-db-write"(_p, b: BlockContext, w) {
        const k = b.height === 10n || (options.deferred === true && b.height === K) ? 1 : null;
        await w.execute("INSERT INTO fault.rows (height, k) VALUES ($1, $2)", [b.height, k]);
        if (options.orphan === true && b.height === K) await w.execute("INSERT INTO fault.children (height, parent) VALUES ($1, 1)", [b.height]);
        if (options.orphan === true && b.height === K + 1n) await w.execute("INSERT INTO fault.parents (height, id) VALUES ($1, 1)", [b.height]);
        await fault("on-db-write", b.height);
      },
      async "on-settle"(_p, run) {
        await fault("on-settle", run.first);
      },
      async "on-after-db-write"(_p, b: BlockContext) {
        await fault("on-after-db-write", b.height);
      },
    },
  };
}

/** One run with the watcher: its result and its hashes. */
async function watched(db: ProcessDatabase, options: DagRunOptions): Promise<{ readonly run: DagRun; readonly seen: Hashed }> {
  const seen = hashed();
  const run = await runDag(db, { ...options, user: [equalityWatcher(seen), ...(options.user ?? [])] });
  return { run, seen };
}

/** Checks `on` against `reference`: every hash both took, and the ledger state's tables at every height. */
function sameAsReference(on: { run: DagRun; seen: Hashed }, reference: { run: DagRun; seen: Hashed }, at: string): void {
  expect(hashDifferences(on.seen.inside, reference.seen.inside), at).toEqual([]);
  expect(hashDifferences(on.seen.committed, reference.seen.committed), at).toEqual([]);
  expect(tableDifferences(on.run.tables, reference.run.tables), at).toEqual([]);
  expect(on.run.cursor, at).toBe(reference.run.cursor);
}

describe("fast-sync mode's failure rule through the process, on PostgreSQL and on PGlite", () => {
  beforeAll(() => Promise.all(PROCESS_BACKENDS.map((backend) => backend.start())), 180_000);
  afterAll(() => Promise.all(PROCESS_BACKENDS.map((backend) => backend.stop())), 60_000);

  const chunked = { fastSync: { blocks: BLOCKS, distance: 0 }, backoffCeilingMs: 20 };
  const plain = { backoffCeilingMs: 20 };

  for (const backend of PROCESS_BACKENDS as readonly ProcessBackend[]) {
    for (const point of ["on-compute", "on-db-write", "on-settle", "on-after-db-write"] as const) {
      it(`on ${backend.name}, a retryable failure at ${point} of ${K}, in the middle of the chunk 10..14: the sync runs to the end, the tables those of the reference`, async () => {
        // The writes' failure rolls the chunk back after the worker was led past 10 and 11: the reference's worker is
        // restarted with the cursor at 9. A failure before the writes commits at 11, and one after the COMMIT is
        // after everything: the plain mode off.
        const rolledBack = point === "on-db-write" || point === "on-settle";
        const reference = await watched(await backend.database(), {
          settings: plain,
          user: [faulting({ point, retryable: true })],
          ...(rolledBack ? { worker: (host) => restartingBefore(host, 9n) } : {}),
        });
        const on = await watched(await backend.database(), { settings: chunked, user: [faulting({ point, retryable: true })] });
        const at = `${backend.name}, ${point}`;
        expect(on.run.cursor, at).toBe(BigInt(LAST));
        expect(on.run.restarts, at).toBe(rolledBack ? 1 : 0);
        expect(runProblems(on.run), at).toEqual([]);
        sameAsReference(on, reference, at);
      }, PATIENCE_MS * 3);
    }

    it(`on ${backend.name}, a failure that is not retried at on-db-write of ${K}: both modes halt at ${K}, the tables the same`, async () => {
      // The chunk rolls back after its worker was led past 10 and 11: the reference's restarted with the cursor at 9.
      const reference = await watched(await backend.database(), {
        settings: plain,
        user: [faulting({ point: "on-db-write" })],
        halts: true,
        worker: (host) => restartingBefore(host, 9n),
      });
      const on = await watched(await backend.database(), { settings: chunked, user: [faulting({ point: "on-db-write" })], halts: true });
      expect(on.run.restarts).toBe(1);
      for (const run of [reference.run, on.run]) {
        expect(run.status).toMatchObject({ state: "halted", cursor: K - 1n, reason: { height: K, point: "on-db-write", module: "fault" } });
      }
      sameAsReference(on, reference, backend.name);
    }, PATIENCE_MS * 3);

    it(`on ${backend.name}, a deferred foreign key that ${K} violates and ${K + 1n} would repair: both modes halt at ${K}, the tables the same`, async () => {
      // The key is deferrable, so no chunk forms: 12's own COMMIT fails in both modes, nothing rolled back but 12, and
      // the worker is not restarted.
      const reference = await watched(await backend.database(), { settings: plain, user: [faulting({ orphan: true })], halts: true });
      const on = await watched(await backend.database(), { settings: chunked, user: [faulting({ orphan: true })], halts: true });
      expect(on.run.restarts).toBe(0);
      for (const run of [reference.run, on.run]) {
        expect(run.status).toMatchObject({ state: "halted", cursor: K - 1n, reason: { height: K, code: "database-error", point: null, module: null } });
      }
      sameAsReference(on, reference, backend.name);
    }, PATIENCE_MS * 3);

    it(`on ${backend.name}, a deferred constraint broken by ${K}'s row: both modes halt at ${K}, whose own COMMIT fails, the tables the same`, async () => {
      // The constraint is deferrable, so no chunk forms: as the case above.
      const reference = await watched(await backend.database(), { settings: plain, user: [faulting({ deferred: true })], halts: true });
      const on = await watched(await backend.database(), { settings: chunked, user: [faulting({ deferred: true })], halts: true });
      expect(on.run.restarts).toBe(0);
      for (const run of [reference.run, on.run]) {
        expect(run.status).toMatchObject({ state: "halted", cursor: K - 1n, reason: { height: K, code: "database-error", point: null, module: null } });
      }
      sameAsReference(on, reference, backend.name);
    }, PATIENCE_MS * 3);

    it.runIf(backend.name.startsWith("PostgreSQL"))(`on ${backend.name}, the writer's connection lost with the chunk's transaction open: held, then stored again; the tables those of the reference`, async () => {
      const referenceDb = await backend.database();
      const reference = await watched(referenceDb, {
        settings: plain,
        user: [faulting({ at: async () => void (await (referenceDb.terminateWriter as () => Promise<number>)()) })],
        worker: (host) => restartingBefore(host, 9n),
      });
      const db = await backend.database();
      const on = await watched(db, { settings: chunked, user: [faulting({ at: async () => void (await (db.terminateWriter as () => Promise<number>)()) })] });
      expect(on.run.cursor).toBe(BigInt(LAST));
      expect(on.run.restarts).toBe(1);
      sameAsReference(on, reference, backend.name);
    }, PATIENCE_MS * 3);

    for (const fault of ["after", "before"] as const satisfies readonly CommitFault[]) {
      it.runIf(backend.name.startsWith("PostgreSQL"))(`on ${backend.name}, the chunk's COMMIT lost ${fault === "after" ? "after the server committed it" : "before the server got it"}: settled by the next run; the tables those of the reference`, async () => {
        /** A run through a proxy that ends the writer's backend at the COMMIT of the transaction that wrote 14. */
        const lost = async (settings: Readonly<Record<string, unknown>>, worker?: DagRunOptions["worker"]) => {
          const db = await backend.database();
          const proxy = await CommitProxy.start(db.setting as PostgresParts);
          let armed = false;
          class ArmingLoop extends FinalizedLoop {
            protected override async write(tx: Transaction, run: HeightRun): Promise<void> {
              await super.write(tx, run);
              if (run.height === 14n && !armed) {
                armed = true;
                void proxy.arm(fault, { terminate: () => (db.terminateWriter as () => Promise<number>)() });
              }
            }
          }
          try {
            return await watched(
              { ...db, setting: proxy.setting(db.setting as PostgresParts) },
              { settings, loop: ArmingLoop as new (input: LoopInput) => FinalizedLoop, ...(worker === undefined ? {} : { worker }) },
            );
          } finally {
            await proxy.close();
          }
        };
        // Lost before the server got it, the chunk 10..14 rolled back after its worker was led past 10 to 13.
        const reference = await lost(plain, fault === "before" ? (host) => restartingBefore(host, 9n) : undefined);
        const on = await lost(chunked);
        expect(on.run.cursor).toBe(BigInt(LAST));
        expect(on.run.restarts).toBe(fault === "before" ? 1 : 0);
        expect(runProblems(on.run)).toEqual([]);
        sameAsReference(on, reference, `${backend.name}, ${fault}`);
      }, PATIENCE_MS * 3);
    }
  }
});
