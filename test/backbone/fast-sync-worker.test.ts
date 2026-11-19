import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { z } from "zod";
import { retainedStatesOf } from "../../src/backbone/core-ledger-state/core-ledger-state.js";
import type { ReadHandle } from "../../src/db/api.js";
import type { BlockContext, ModuleDeclaration } from "../../src/modules/declaration.js";
import { COUNTERS, countersMemory } from "../ledger/fixtures/sweep-test-loader.js";
import { rootOf } from "../ledger/fixtures/sweep-fixture.js";
import { PROCESS_BACKENDS, type ProcessBackend } from "../runner/process-backends.js";
import { tapeTest } from "../tape/real/real-tapes.js";
import { refusalHeight, tableDifferences } from "./eviction-restart.js";
import {
  chunked,
  commitGroups,
  faultAt,
  loggingHost,
  type ParseProbe,
  parsingLoop,
  PLAIN,
  probing,
  restartingBefore,
} from "./fast-sync-worker.js";
import { PATIENCE_MS } from "./ingest-harness.js";
import { CONVERSION_LAST, conversionRun, DEVNET_F } from "./refcount-conversion.js";
import { runDag, runProblems } from "./refcount-process.js";

/**
 * The ledger worker across chunks of blocks in one transaction (fast-sync mode), through the real process on the DAG
 * fixtures of `./refcount-process.ts` (the original, and the extended one that writes nodes again in their other form),
 * on PostgreSQL 18 and PGlite 0.5.10, with `core-ledger-state`'s `checkKept` and `reclamationCache.verify` on:
 * - chunks of 3 and 50: each block's `committed` told once, in groups after the chunk's last apply; no restart; the
 *   tables after every block (read inside the open transaction for a block after a chunk's first) those of the mode
 *   off; the fixture's checks pass;
 * - a chunk failing retryably at its third block: one restart; the tables equal a run with the mode off whose worker
 *   is restarted with the cursor before the chunk;
 * - a package refusing an eviction inside a chunk: the restart there, the next block loading the state after it
 *   through the transaction; the tables those of the mode off with the same refusal;
 * - a parse given no read, sent while a chunk's transaction is open, of a node the chunk wrote: answered through a
 *   view of the transaction within 15 s;
 * - a module loading a retained state at `on-after-db-write`: inside the window at the chunk's last height it loads,
 *   below it `state-not-retained`;
 * - the devnet's v8 → v9 conversion inside what would be one chunk (tape-gated): the chunk commits before the
 *   conversion block, and the tables equal the mode off's.
 */

const DAGS = ["original", "extended"] as const;

/** Module `retain`: at `on-after-db-write` of each block, loads the retained state of that block; records each outcome. */
function retaining(outcomes: string[]): ModuleDeclaration {
  return {
    id: "retain",
    version: "1.0.0",
    side: "public",
    requires: ["ledger-state"],
    provides: [{ name: "retain-rows", lifetimes: ["table"], table: { schema: "retain", tables: ["rows"], kind: "append-only" } }],
    startsMidChain: true,
    configSchema: z.object({}),
    migrations: [{ id: "001", sql: "CREATE TABLE retain.rows (height bigint PRIMARY KEY)" }],
    points: {
      async "on-after-db-write"(p, b: BlockContext, read: ReadHandle) {
        try {
          await retainedStatesOf(p).load(b.height, read);
          outcomes.push(`${b.height} at ${read.height} loaded`);
        } catch (error) {
          outcomes.push(`${b.height} at ${read.height} ${(error as { code?: string }).code ?? "other"}`);
        }
      },
    },
  };
}

describe("the ledger worker across chunks, through the process, on PostgreSQL and on PGlite", () => {
  beforeAll(() => Promise.all(PROCESS_BACKENDS.map((backend) => backend.start())), 180_000);
  afterAll(() => Promise.all(PROCESS_BACKENDS.map((backend) => backend.stop())), 60_000);

  for (const backend of PROCESS_BACKENDS as readonly ProcessBackend[]) {
    for (const dag of DAGS) {
      it(`on ${backend.name}, the ${dag} DAG in chunks of 3 and 50: commits once per block after its chunk's COMMIT, no restart, the tables of the mode off`, async () => {
        const off = await runDag(await backend.database(), { dag, core: { checkKept: true }, settings: PLAIN });
        expect(runProblems(off, dag)).toEqual([]);
        for (const blocks of [3, 50]) {
          const log: string[] = [];
          const on = await runDag(await backend.database(), {
            dag,
            core: { checkKept: true },
            settings: chunked(blocks),
            worker: (host) => loggingHost(host, log),
          });
          const at = `${backend.name}, ${dag}, chunks of ${blocks}`;
          expect(on.restarts, at).toBe(0);
          expect(on.errors, at).toEqual([]);
          const { groups, problems } = commitGroups(log);
          expect(problems, at).toEqual([]);
          expect(groups.flat(), at).toEqual(Array.from({ length: 101 }, (_, i) => BigInt(i)));
          // The chunks: groups of `blocks` commits each told at once, after the chunk's last apply.
          expect(Math.max(...groups.map((group) => group.length)), at).toBe(blocks);
          expect(tableDifferences(on.tables, off.tables), at).toEqual([]);
          expect(runProblems(on, dag), at).toEqual([]);
        }
      }, PATIENCE_MS * 6);
    }

    it(`on ${backend.name}, a chunk failing retryably at its third block: one restart, the tables of the mode off restarted before the chunk`, async () => {
      // Chunks of 3 from S = 0: 3..5 fails at 5's writes once; its blocks were applied ahead of their commit.
      const reference = await runDag(await backend.database(), {
        core: { checkKept: true },
        settings: PLAIN,
        user: [faultAt(5n)],
        worker: (host) => restartingBefore(host, 2n),
      });
      expect(reference.restarts).toBe(1);
      const log: string[] = [];
      const on = await runDag(await backend.database(), {
        core: { checkKept: true },
        settings: chunked(3),
        user: [faultAt(5n)],
        worker: (host) => loggingHost(host, log),
      });
      // The rollback of 3..5, the thread led past 3 and 4, restarted it once.
      expect(on.restarts).toBe(1);
      expect(on.lines.filter((line) => line.includes("retries in"))).toHaveLength(1);
      expect(log).toContain("rolledBack 5");
      expect(tableDifferences(on.tables, reference.tables)).toEqual([]);
      expect(runProblems(on)).toEqual([]);
    }, PATIENCE_MS * 4);

    it(`on ${backend.name}, a package refusing an eviction inside a chunk: the restart there, the tables of the mode off with the same refusal`, async () => {
      const h = refusalHeight();
      // A chunk from S = 0 to h + 1: h is inside it, the block after it computed through the open transaction.
      const blocks = Number(h) + 2;
      const plainMemory = countersMemory();
      const off = await runDag(await backend.database(), {
        core: { checkKept: true },
        settings: PLAIN,
        data: { counters: plainMemory, refuseAt: `${h}`, threads: 1 },
      });
      const memory = countersMemory();
      const on = await runDag(await backend.database(), {
        core: { checkKept: true },
        settings: chunked(blocks),
        data: { counters: memory, refuseAt: `${h}`, threads: 1 },
      });
      expect(off.restarts).toBe(1);
      expect(on.restarts).toBe(1);
      // The thread after the restart loaded the state after h from the store, through the transaction still open.
      expect(Atomics.load(new Int32Array(memory), COUNTERS.storeLoads)).toBe(1);
      expect(tableDifferences(on.tables, off.tables)).toEqual([]);
      expect(runProblems(on)).toEqual([]);
    }, PATIENCE_MS * 4);

    it(`on ${backend.name}, a parse given no read while a chunk is open reads a node the chunk wrote, through a view, within 15 s`, async () => {
      const probe: ParseProbe = { ledger: undefined, host: undefined, outcome: undefined };
      // The root of the state after 0, written by the chunk's first block: not in the pending block's batch (1's), which
      // the worker serves itself, so its read reaches the main thread.
      const node = Buffer.from(rootOf(0, "extended").slice(1)).toString("hex");
      const run = await runDag(await backend.database(), {
        dag: "extended",
        core: { checkKept: true },
        settings: chunked(3),
        data: { parseReads: node },
        loop: parsingLoop(probe, 2n, 15_000),
        worker: (host) => probing(host, probe),
      });
      // Found through a view of the chunk 0..2, still open when 2 is computed.
      expect(probe.outcome).toContain(`(it read ${node}: stored)`);
      expect(run.cursor).toBe(100n);
      expect(runProblems(run, "extended")).toEqual([]);
    }, PATIENCE_MS * 2);

    it(`on ${backend.name}, a retained state loaded at on-after-db-write: inside the window at the chunk's last height, else state-not-retained`, async () => {
      const outcomes: string[] = [];
      const run = await runDag(await backend.database(), {
        settings: { ...chunked(5), retainStates: 2 },
        user: [retaining(outcomes)],
      });
      expect(run.cursor).toBe(100n);
      const parsed = outcomes.map((line) => {
        const [height, , at, outcome] = line.split(" ");
        return { height: BigInt(height as string), at: BigInt(at as string), outcome };
      });
      // Each block once, its read at the chunk's last height; loaded while that height is within 2 of it.
      expect(parsed.map((entry) => entry.height)).toEqual(Array.from({ length: 101 }, (_, i) => BigInt(i)));
      for (const entry of parsed) expect(entry.outcome, `${entry.height} at ${entry.at}`).toBe(entry.at - entry.height <= 2n ? "loaded" : "state-not-retained");
      expect(parsed.some((entry) => entry.outcome === "state-not-retained")).toBe(true);
    }, PATIENCE_MS * 2);

    tapeTest(
      "devnet-v8-v9-0-235",
      `on ${backend.name}: the v8 → v9 conversion block inside what would be one chunk: the chunk commits before it, and the tables equal the mode off's`,
      async (found) => {
        const off = await conversionRun(await backend.database(), found, 0);
        const log: string[] = [];
        // Chunks of 50 from S = 0: 100..107 holds F = 103.
        const on = await conversionRun(await backend.database(), found, 0, {}, {
          settings: { fastSync: { blocks: 50, distance: 0 } },
          worker: (host) => loggingHost(host, log),
        });
        expect(log.indexOf(`committed ${DEVNET_F - 1n}`)).toBeGreaterThan(-1);
        expect(log.indexOf(`committed ${DEVNET_F - 1n}`)).toBeLessThan(log.indexOf(`apply ${DEVNET_F}`));
        expect(log.indexOf(`committed ${DEVNET_F - 2n}`)).toBeGreaterThan(log.indexOf(`apply ${DEVNET_F - 1n}`));
        expect(tableDifferences(on.tables, off.tables)).toEqual([]);
        expect(on.tables.has(CONVERSION_LAST)).toBe(true);
      },
      { timeoutMs: PATIENCE_MS * 4 },
    );
  }
});
