import type { NodeBatch } from "../../src/ledger/types.js";
import type { LedgerHost } from "../../src/ledger/worker/host.js";
import { NODES_SQL } from "../../src/ledger/worker/node-bridge.js";
import type { FixtureNode } from "../ledger/fixtures/sweep-fixture.js";
import type { TableSnapshot } from "./ledger-graph-tapes.js";
import type { DagRun } from "./refcount-process.js";

/**
 * What the tests read of a rewrite on the DAG fixture, shared by `ledger-refcount-rewrite.test.ts` and its negative
 * controls. Imports nothing of Vitest.
 * - {@link rowProblems}, the row check: after the block, the row of a node written again holds the child list written;
 * - {@link readingLoads}: a ledger worker whose loads record every row the node-store bridge reads for them, so a test
 *   sees the child list a restarted worker loaded;
 * - {@link joined}: the runs of one database, stopped and started again, as one run's tables and batches.
 */

const hex = (bytes: Uint8Array): string => Buffer.from(bytes).toString("hex");

/** The row check: the row of `node`'s key in `after` holds `node`'s child list; `before` names the list it kept. */
export function rowProblems(after: TableSnapshot, node: FixtureNode, before?: FixtureNode): string[] {
  const key = hex(node.key);
  const stored = after.rows.get(key);
  if (stored === undefined) return [`${key} is not a row`];
  if (Buffer.compare(stored, node.children) === 0) return [];
  const kept = before !== undefined && Buffer.compare(stored, before.children) === 0;
  return [`the row of ${key} holds ${kept ? "the child list written before" : `another child list (${hex(stored)})`}, not ${hex(node.children)}`];
}

/** `host`, every row the node-store bridge reads for its loads recorded in `rows` by hex key (the last read kept). */
export function readingLoads(host: LedgerHost, rows: Map<string, Uint8Array>): LedgerHost {
  return new Proxy(host, {
    get(target, property) {
      if (property === "load") {
        const load: LedgerHost["load"] = (input, read) =>
          target.load(
            input,
            read === undefined
              ? read
              : {
                  async query(sql, params) {
                    const found = await read.query(sql, params);
                    if (sql === NODES_SQL) for (const row of found) rows.set(hex(row.node_key as Uint8Array), Uint8Array.from(row.children as Uint8Array));
                    return found;
                  },
                },
          );
        return load;
      }
      const value: unknown = Reflect.get(target, property, target);
      return typeof value === "function" ? (value as (...args: unknown[]) => unknown).bind(target) : value;
    },
  });
}

/** The tables and batches of `runs` on one database, each started again where the one before stopped. */
export function joined(runs: readonly DagRun[]): { readonly tables: Map<bigint, TableSnapshot>; readonly batches: Map<bigint, NodeBatch> } {
  const tables = new Map<bigint, TableSnapshot>();
  const batches = new Map<bigint, NodeBatch>();
  for (const run of runs) {
    for (const [height, snapshot] of run.tables) tables.set(height, snapshot);
    for (const [height, batch] of run.batches) batches.set(height, batch);
  }
  return { tables, batches };
}
