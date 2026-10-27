import { z } from "zod";
import { CORE_BLOCK_PARSED } from "../../src/backbone/core-block-parsed/core-block-parsed.js";
import { CORE_CHAIN_EVENTS } from "../../src/backbone/core-chain-events/core-chain-events.js";
import { type CoreLedgerStateOptions, coreLedgerState } from "../../src/backbone/core-ledger-state/core-ledger-state.js";
import { CORE_TX_RESULTS } from "../../src/backbone/core-tx-results/core-tx-results.js";
import type { ModuleDeclaration } from "../../src/modules/declaration.js";
import type { TapeRecord } from "../../tools/tape/index.js";
import { LAST, rootOf, stateNodes } from "../ledger/fixtures/sweep-fixture.js";
import type { ProcessDatabase } from "../runner/process-backends.js";
import { E } from "./chain-data-tapes.js";
import { eventsValue, finalizedWithEvents, RUNTIME_2_0 } from "./events-fixtures.js";
import { type ChainBlock, chainOf, opening } from "./fetch-fixtures.js";
import { type ModelSnapshot, SweepModel } from "./sweep-model.js";

/**
 * Task 12.5's process fixture (A105, LG-14): a tape whose ledger is the test package of
 * `test/ledger/fixtures/sweep-test-loader.ts` — the DAG of `sweep-fixture.ts` at each height, its roots on the tape as
 * the node's —, the ledger's core modules with `core-ledger-state`'s budget K = 50, a module recording the sweep's
 * tables at every cursor, and the reference model's account of the same blocks (`./sweep-model.ts`), the batches being
 * what a package storing exactly the model's nodes flushes, `retainStates` 0. Imports nothing of Vitest.
 */

/** The test package's loader, which the ledger worker imports. */
export const SWEEP_LOADER = new URL("../ledger/fixtures/sweep-test-loader.ts", import.meta.url);

/** The fixture's budget. */
export const K = 50;

const hex = (bytes: Uint8Array): string => Buffer.from(bytes).toString("hex");

/** The tape of the fixture's chain, heights 0 to `last`: no transaction, every root the fixture's. */
export function sweepTape(last: number = LAST): { readonly records: TapeRecord[]; readonly chain: readonly ChainBlock[] } {
  const chain = chainOf(BigInt(last), () => ({ specVersion: RUNTIME_2_0.specVersion, timestampPallet: RUNTIME_2_0.shape.timestampIndex }));
  const records: TapeRecord[] = [
    ...opening(chain[0] as ChainBlock, chain.at(-1) as ChainBlock),
    { method: "system_properties", params: [], result: { genesis_extrinsics: [], genesis_state: "00" } },
  ];
  for (const block of chain) {
    const events = block.height === 0n ? null : eventsValue([E.success(0).record]);
    records.push(
      ...finalizedWithEvents(block, RUNTIME_2_0, events, block.height === 0n),
      { method: "midnight_ledgerStateRoot", params: [block.hex], result: [...rootOf(Number(block.height))] },
    );
  }
  return { records, chain };
}

/** The ledger's core modules with `core-ledger-state`'s budget K and `options`. */
export function sweepCore(options: CoreLedgerStateOptions = {}): readonly ModuleDeclaration[] {
  return [CORE_CHAIN_EVENTS, CORE_BLOCK_PARSED, CORE_TX_RESULTS, coreLedgerState({ sweepBudget: K, ...options })];
}

/** The sweep's tables as a snapshot: the row, the grey set, the marks and the stored nodes, every list sorted. */
export type TableSnapshot = Omit<ModelSnapshot, "deleted">;

/** The sweep's tables read through `read` (see {@link TableSnapshot}). */
export async function sweepTables(read: { query(sql: string): Promise<Record<string, unknown>[]> }): Promise<TableSnapshot> {
  const [row] = await read.query("SELECT cycle::text AS c, phase, encode(sweep_after, 'hex') AS a FROM core_ledger_state.sweep");
  const keys = async (table: string): Promise<string[]> =>
    (await read.query(`SELECT encode(node_key, 'hex') AS k FROM core_ledger_state.${table} ORDER BY node_key`)).map((r) => r.k as string);
  return {
    cycle: BigInt(row?.c as string),
    phase: row?.phase as TableSnapshot["phase"],
    sweepAfter: (row?.a as string | null) ?? null,
    grey: await keys("grey"),
    marks: await keys("marks"),
    nodes: await keys("nodes"),
  };
}

/**
 * A user module recording, at each height's `on-compute`, the sweep's tables as committed at the cursor h − 1
 * (`seen.get(h − 1)`).
 */
export function sweepWatcher(seen: Map<bigint, TableSnapshot>): ModuleDeclaration {
  return {
    id: "sweep-watch",
    version: "1.0.0",
    side: "public",
    requires: ["block-header"],
    provides: [{ name: "sweep-watch-rows", lifetimes: ["table"], table: { schema: "sweep_watch", tables: ["rows"], kind: "append-only" } }],
    startsMidChain: true,
    configSchema: z.object({}),
    migrations: [{ id: "001", sql: "CREATE TABLE sweep_watch.rows (height bigint PRIMARY KEY)" }],
    points: {
      async "on-compute"(_p, b, read) {
        if (b.height > 0n) seen.set(b.height - 1n, await sweepTables(read));
      },
    },
  };
}

/** The tables after every height of a run: the watcher's, and the last height's read from `db` once the process stopped. */
export async function tablesByHeight(seen: ReadonlyMap<bigint, TableSnapshot>, db: ProcessDatabase, last: bigint): Promise<Map<bigint, TableSnapshot>> {
  const all = new Map(seen);
  all.set(last, await sweepTables(db));
  return all;
}

/** The reference model's account of the fixture, heights 0 to `last` (`sweep` on unless `off` says so at a height). */
export function modelOfFixture(last: number = LAST, off: (h: number) => boolean = () => false): ModelSnapshot[] {
  const model = new SweepModel(K);
  const snapshots: ModelSnapshot[] = [];
  let previous: string | null = null;
  for (let h = 0; h <= last; h++) {
    const nodes = stateNodes(h);
    const root = hex((nodes[0] as { key: Uint8Array }).key);
    const inserts = nodes.filter((n) => !model.has(hex(n.key))).map((n) => ({ key: hex(n.key), children: n.children }));
    const deltas = [{ key: root, delta: 1 }, ...(previous === null ? [] : [{ key: previous, delta: -1 }])];
    snapshots.push(model.block({ inserts, deltas }, !off(h)));
    previous = root;
  }
  return snapshots;
}

/** The heights whose tables differ from the model's, each with what differs; empty when every height agrees. */
export function modelProblems(tables: ReadonlyMap<bigint, TableSnapshot>, model: readonly ModelSnapshot[]): string[] {
  const problems: string[] = [];
  for (const [h, expected] of model.entries()) {
    const got = tables.get(BigInt(h));
    if (got === undefined) {
      problems.push(`no tables recorded after ${h}`);
      continue;
    }
    const fields = (["cycle", "phase", "sweepAfter", "grey", "marks", "nodes"] as const).filter(
      (field) => JSON.stringify(got[field], (_k, v: unknown) => (typeof v === "bigint" ? `${v}` : v)) !== JSON.stringify(expected[field], (_k, v: unknown) => (typeof v === "bigint" ? `${v}` : v)),
    );
    if (fields.length > 0) problems.push(`after ${h}: ${fields.join(", ")} differ from the model's`);
  }
  return problems;
}
