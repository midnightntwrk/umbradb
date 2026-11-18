import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { z } from "zod";
import type { Transaction } from "../../src/db/api.js";
import { UmbraError } from "../../src/db/errors.js";
import type { BlockContext, ModuleDeclaration } from "../../src/modules/declaration.js";
import { FinalizedLoop, type HeightRun, type LoopInput } from "../../src/runner/loop.js";
import { PROCESS_BACKENDS, type ProcessBackend } from "../runner/process-backends.js";
import { equalityWatcher, hashDifferences, hashed } from "./fast-sync-equality.js";
import { restartingBefore } from "./fast-sync-worker.js";
import { PATIENCE_MS } from "./ingest-harness.js";
import { runDag } from "./refcount-process.js";

/**
 * The negative controls of `fast-sync-equality.test.ts`, through the real process on the extended DAG fixture, chunks
 * of 5 with block 12's writes failing once with a lost connection (the chunk 10..14 rolls back and is stored again):
 * - `on-after-db-write` delivered before the `COMMIT` (right after each block's writes, PostgreSQL: on PGlite a read
 *   inside the transaction is refused): a callback of a block of the chunk that rolled back is seen, its block
 *   delivered twice;
 * - `continues` true at the first block stored again after the rollback (whenever the height has a block before it):
 *   with `reclamationCache.verify` the copy of the counts and child lists, kept from the rolled-back chunk, halts with
 *   `copy-mismatch`; without it the tables differ from the reference's.
 */

/** `on-after-db-write` right after each block's writes, inside the transaction. */
class AfterBeforeCommit extends FinalizedLoop {
  protected override async write(tx: Transaction, run: HeightRun): Promise<void> {
    await super.write(tx, run);
    await this.after(run);
  }
}

/** `continues` true whenever the height has a block before it. */
class KeepsContinuing extends FinalizedLoop {
  protected override continues(run: HeightRun): boolean {
    return run.previous !== null;
  }
}

/** Module `fault`: its `on-db-write` of 12 fails once with a lost connection; its `on-after-db-write` heights in `seen`. */
function faulting(seen: bigint[]): ModuleDeclaration {
  let failed = false;
  return {
    id: "fault",
    version: "1.0.0",
    side: "public",
    requires: ["block-header"],
    provides: [{ name: "fault-rows", lifetimes: ["table"], table: { schema: "fault", tables: ["rows"], kind: "append-only" } }],
    startsMidChain: true,
    configSchema: z.object({}),
    migrations: [{ id: "001", sql: "CREATE TABLE fault.rows (height bigint PRIMARY KEY)" }],
    points: {
      async "on-db-write"(_p, b: BlockContext, w) {
        await w.execute("INSERT INTO fault.rows (height) VALUES ($1)", [b.height]);
        if (b.height !== 12n || failed) return;
        failed = true;
        throw new UmbraError("connection-lost", "the connection was lost at 12 (the test's module)");
      },
      async "on-after-db-write"(_p, b: BlockContext) {
        seen.push(b.height);
      },
    },
  };
}

describe("the negative controls of fast-sync mode's equality, through the process", () => {
  beforeAll(() => Promise.all(PROCESS_BACKENDS.map((backend) => backend.start())), 180_000);
  afterAll(() => Promise.all(PROCESS_BACKENDS.map((backend) => backend.stop())), 60_000);

  const chunked = { fastSync: { blocks: 5, distance: 0 }, backoffCeilingMs: 20 };

  for (const backend of PROCESS_BACKENDS as readonly ProcessBackend[]) {
    it.runIf(backend.name.startsWith("PostgreSQL"))(`on ${backend.name}, on-after-db-write before the COMMIT: a callback of a block of the chunk that rolled back is seen`, async () => {
      const real: bigint[] = [];
      await runDag(await backend.database(), { dag: "extended", settings: chunked, user: [faulting(real)] });
      expect(real.filter((h) => h === 10n)).toHaveLength(1);
      const control: bigint[] = [];
      await runDag(await backend.database(), {
        dag: "extended",
        settings: chunked,
        user: [faulting(control)],
        loop: AfterBeforeCommit as new (input: LoopInput) => FinalizedLoop,
        halts: true,
      });
      // 10 and 11's callbacks ran before the chunk rolled back, and again for the blocks stored again.
      expect(control.filter((h) => h === 10n).length).toBeGreaterThan(1);
    }, PATIENCE_MS * 3);

    it(`on ${backend.name}, continues true at the first block stored again after a rollback: copy-mismatch with the verification, tables that differ without it`, async () => {
      const reference = hashed();
      await runDag(await backend.database(), {
        dag: "extended",
        settings: { backoffCeilingMs: 20 },
        user: [equalityWatcher(reference, { where: ["committed"] }), faulting([])],
        worker: (host) => restartingBefore(host, 9n),
      });
      const verifying = await runDag(await backend.database(), {
        dag: "extended",
        settings: { ...chunked, reclamationCache: { verify: true } },
        user: [faulting([])],
        loop: KeepsContinuing as new (input: LoopInput) => FinalizedLoop,
        halts: true,
      });
      expect(verifying.status.state).toBe("halted");
      const reason = JSON.stringify(verifying.status.reason, (_key, value: unknown) => (typeof value === "bigint" ? `${value}` : value));
      expect(`${reason} ${verifying.lines.join(" ")}`).toContain("copy-mismatch");
      const quiet = hashed();
      const run = await runDag(await backend.database(), {
        dag: "extended",
        settings: { ...chunked, reclamationCache: { verify: false } },
        user: [equalityWatcher(quiet, { where: ["committed"] }), faulting([])],
        loop: KeepsContinuing as new (input: LoopInput) => FinalizedLoop,
        halts: true,
      });
      const broken = run.status.state === "halted" || hashDifferences(quiet.committed, reference.committed).length > 0;
      expect(broken).toBe(true);
    }, PATIENCE_MS * 4);
  }
});
