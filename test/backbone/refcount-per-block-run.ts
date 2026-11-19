import { CORE_LEDGER_STATE_MIGRATIONS, addRootCounts, insertNodes } from "../../src/backbone/core-ledger-state/sql.js";
import type { Database } from "../../src/db/api.js";
import type { ApplyBlock, AppliedState, GenesisBlock } from "../../src/ledger/worker/engine.js";
import { isEvictionRefused } from "../../src/ledger/worker/engine.js";
import { type LedgerHost, startLedgerWorker } from "../../src/ledger/worker/host.js";
import type { FixtureData } from "../ledger/fixtures/sweep-test-loader.js";
import { BACKENDS } from "../db/backends.js";
import { SWEEP_LOADER, sweepTables, type TableSnapshot } from "./ledger-graph-tapes.js";
import { refcountStep, sqlRefcountTables, writeRefcount } from "./refcount-step.js";

/**
 * The per-block build run end to end, as the tests' reference of what a run of this build stores: its own ledger
 * worker (the test package of the DAG fixture), its own PGlite database holding `core_ledger_state`'s tables, and at
 * every block what `core-ledger-state` did before it reclaimed through `on-settle`: the state after h − 1 held from
 * the database, the block applied, the per-block step (`./refcount-step.ts`) computed from the tables after h − 1 and
 * the block's own flush, the step's deletions evicted before the block's transaction (a refusal ending the worker
 * thread, the new one loading the state after h − 1 from the database and applying the block again, its step computed
 * again and evicted), then the block's node writes, root counts and step in one transaction, and the block committed
 * to the worker. So its flushes are its own worker's, not the build's, and a restart is handled as the earlier build
 * handled it. The blocks are given as the build's run gave them to its worker (genesis and every apply). Imports
 * nothing of Vitest.
 */

/** What a run of the build gave its worker: block 0's input and each later block's (the last attempt's). */
export interface WorkerInputs {
  genesis: GenesisBlock | undefined;
  readonly applies: Map<bigint, ApplyBlock>;
}

/** Inputs to record, filled by {@link recordingInputs}. */
export const workerInputs = (): WorkerInputs => ({ genesis: undefined, applies: new Map() });

/** `host` recording the block inputs it is given into `inputs`. */
export function recordingInputs(inputs: WorkerInputs): (host: LedgerHost) => LedgerHost {
  return (host) =>
    new Proxy(host, {
      get(target, name, receiver) {
        if (name === "genesis") {
          return (input: GenesisBlock, read: Parameters<LedgerHost["genesis"]>[1]) => {
            inputs.genesis = input;
            return target.genesis(input, read);
          };
        }
        if (name === "apply") {
          return (input: ApplyBlock, read: Parameters<LedgerHost["apply"]>[1]) => {
            inputs.applies.set(input.height, input);
            return target.apply(input, read);
          };
        }
        return Reflect.get(target, name, receiver) as unknown;
      },
    });
}

/** What the per-block run gave: the tables after every block, its worker's restarts. */
export interface PerBlockRun {
  readonly tables: Map<bigint, TableSnapshot>;
  readonly restarts: number;
}

/** Runs blocks 0 to `last` of `inputs` the per-block way (see the module comment), its package told `data`. */
export async function perBlockRun(inputs: WorkerInputs, data: FixtureData, last: bigint): Promise<PerBlockRun> {
  const backend = BACKENDS.find((candidate) => candidate.singleQueue) as (typeof BACKENDS)[number];
  await backend.start();
  const host = startLedgerWorker({ loader: SWEEP_LOADER, loaderData: data });
  let db: Database | undefined;
  try {
    db = (await backend.database(`CREATE SCHEMA core_ledger_state;\n${CORE_LEDGER_STATE_MIGRATIONS.map((m) => m.sql).join("\n")}`)).db;
    const database = db;
    host.useDatabase({ read: (body) => database.read(body) });
    const tables = new Map<bigint, TableSnapshot>();
    let parent: AppliedState | undefined;
    for (let h = 0n; h <= last; h++) {
      const genesis = inputs.genesis;
      const input = inputs.applies.get(h);
      if (h === 0n && genesis === undefined) throw new Error("no input recorded for block 0");
      if (h > 0n && input === undefined) throw new Error(`no input recorded for block ${h}`);
      // The block applied on the state after h − 1 held from the database, and its step from the tables after h − 1.
      const computed = async () =>
        database.read(async (read) => {
          if (h > 0n && parent !== undefined) {
            await host.load({ ledger: parent.ledger, height: parent.height, hash: parent.hash, stateKey: parent.stateKey }, read);
          }
          const applied = h === 0n ? await host.genesis(genesis as GenesisBlock, read) : await host.apply(input as ApplyBlock, read);
          const step = await refcountStep(sqlRefcountTables(read), applied.batch, { height: h, on: true });
          return { applied, step };
        });
      let { applied, step } = await computed();
      if (step.deleted.length > 0) {
        try {
          await host.evict(step.deleted);
        } catch (error) {
          if (!isEvictionRefused(error)) throw error;
          // The earlier build: a new thread, the block applied again on the state after h − 1, a second refusal fails.
          await host.restart();
          ({ applied, step } = await computed());
          if (step.deleted.length > 0) await host.evict(step.deleted);
        }
      }
      await database.transaction(async (tx) => {
        let written = 0;
        for (let at = 0; at < applied.batch.inserts.length; at += 1_000) written += await insertNodes(tx, applied.batch.inserts.slice(at, at + 1_000));
        const counts = applied.batch.rootCounts.filter((count) => count.delta !== 0);
        if (counts.length > 0) await addRootCounts(tx, counts);
        await writeRefcount(tx, step, written);
      });
      await host.commit({ height: h, hash: applied.hash });
      parent = applied;
      tables.set(h, await database.read((read) => sweepTables(read)));
    }
    return { tables, restarts: host.restarts };
  } finally {
    await host.close();
    await db?.close();
    await backend.stop();
  }
}

/** The tables whose rows are compared whole: the node tables and the root counts. */
const NODE_TABLES = ["nodes", "ref_counts", "unreferenced", "root_counts"] as const;

/**
 * The heights at which `got` and `want` differ in the complete rows of {@link NODE_TABLES} (each table's digest of its
 * rows, `data` and child lists included), each with the tables that differ; empty when they agree throughout.
 */
export function wholeRowDifferences(got: ReadonlyMap<bigint, TableSnapshot>, want: ReadonlyMap<bigint, TableSnapshot>): string[] {
  const problems: string[] = [];
  for (const [height, expected] of want) {
    const have = got.get(height);
    if (have === undefined) {
      problems.push(`no tables after ${height}`);
      continue;
    }
    const tables = NODE_TABLES.filter((table) => have.digests.get(table) !== expected.digests.get(table));
    if (tables.length > 0) problems.push(`after ${height}: ${tables.join(", ")} differ`);
  }
  return problems;
}
