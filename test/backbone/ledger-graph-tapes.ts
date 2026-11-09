import { z } from "zod";
import { CORE_BLOCK_PARSED } from "../../src/backbone/core-block-parsed/core-block-parsed.js";
import { CORE_CHAIN_EVENTS } from "../../src/backbone/core-chain-events/core-chain-events.js";
import { type CoreLedgerStateOptions, coreLedgerState } from "../../src/backbone/core-ledger-state/core-ledger-state.js";
import { CORE_TX_RESULTS } from "../../src/backbone/core-tx-results/core-tx-results.js";
import type { NodeBatch } from "../../src/ledger/types.js";
import type { LedgerHost } from "../../src/ledger/worker/host.js";
import type { ModuleDeclaration } from "../../src/modules/declaration.js";
import type { TapeRecord } from "../../tools/tape/index.js";
import { type FixtureDag, LAST, rootOf, stateNodes } from "../ledger/fixtures/sweep-fixture.js";
import type { ProcessDatabase } from "../runner/process-backends.js";
import { E } from "./chain-data-tapes.js";
import { eventsValue, finalizedWithEvents, RUNTIME_2_0 } from "./events-fixtures.js";
import { type ChainBlock, chainOf, opening } from "./fetch-fixtures.js";
import { type RefcountBatch, RefcountModel, type RefcountModelStep, type RefcountTables } from "./refcount-model.js";

/**
 * The DAG fixture's process plumbing, with `retainStates` 0:
 * - a tape whose ledger is the test package of `test/ledger/fixtures/sweep-test-loader.ts`: the DAG of
 *   `sweep-fixture.ts` at each height (the original or the extended one), with its roots on the tape as the node's;
 * - the ledger's core modules;
 * - a module recording `core_ledger_state`'s tables at every cursor, with each block's batch, which the worker's answers
 *   give ({@link recordingWorker});
 * - the reference model's account of the same blocks (`./refcount-model.ts`): fed the batches a run recorded, or,
 *   on the original DAG, those of a package storing exactly the model's rows.
 *
 * Imports nothing of Vitest.
 */

/** The test package's loader, which the ledger worker imports. */
export const SWEEP_LOADER = new URL("../ledger/fixtures/sweep-test-loader.ts", import.meta.url);

const hex = (bytes: Uint8Array): string => Buffer.from(bytes).toString("hex");

/** The tape of the fixture's chain, heights 0 to `last`: no transaction, every root `dag`'s. */
export function sweepTape(last: number = LAST, dag: FixtureDag = "original"): { readonly records: TapeRecord[]; readonly chain: readonly ChainBlock[] } {
  const chain = chainOf(BigInt(last), () => ({ specVersion: RUNTIME_2_0.specVersion, timestampPallet: RUNTIME_2_0.shape.timestampIndex }));
  const records: TapeRecord[] = [
    ...opening(chain[0] as ChainBlock, chain.at(-1) as ChainBlock),
    { method: "system_properties", params: [], result: { genesis_extrinsics: [], genesis_state: "00" } },
  ];
  for (const block of chain) {
    const events = block.height === 0n ? null : eventsValue([E.success(0).record]);
    records.push(
      ...finalizedWithEvents(block, RUNTIME_2_0, events, block.height === 0n),
      { method: "midnight_ledgerStateRoot", params: [block.hex], result: [...rootOf(Number(block.height), dag)] },
    );
  }
  return { records, chain };
}

/** The ledger's core modules with `core-ledger-state`'s rules `options`. */
export function sweepCore(options: CoreLedgerStateOptions = {}): readonly ModuleDeclaration[] {
  return [CORE_CHAIN_EVENTS, CORE_BLOCK_PARSED, CORE_TX_RESULTS, coreLedgerState(options)];
}

/**
 * `core_ledger_state`'s tables after a block, read through the check's own queries: `nodes` (each row's child list),
 * `ref_counts`, `root_counts` and `unreferenced` by hex key, with the keys `states` and `core_contract_states.states`
 * store, and a digest of every table of the schema.
 */
export interface TableSnapshot extends RefcountTables {
  /** `states`: the state key stored after each height. */
  readonly states: ReadonlyMap<bigint, string>;
  /** The state and zswap-state keys `core_contract_states.states` stores, sorted; none without that table. */
  readonly contracts: readonly string[];
  /** Each table of `core_ledger_state` (partitions in their table), by name: the MD5 of its rows' text, in order. */
  readonly digests: ReadonlyMap<string, string>;
}

type Reader = { query(sql: string): Promise<Record<string, unknown>[]> };

const bytesOf = (value: unknown): Uint8Array => Uint8Array.from(value as Uint8Array);

/**
 * The tables read through `read` (see {@link TableSnapshot}); without their digests (an empty map) when `digests` is
 * false, for a check that reads the tables at many heights of a long run.
 */
export async function sweepTables(read: Reader, options: { readonly digests?: boolean } = {}): Promise<TableSnapshot> {
  const counts = async (table: string): Promise<Map<string, number>> =>
    new Map((await read.query(`SELECT encode(node_key, 'hex') AS k, count FROM core_ledger_state.${table} ORDER BY node_key`)).map((r) => [r.k as string, Number(r.count)]));
  const rows = new Map(
    (await read.query("SELECT encode(node_key, 'hex') AS k, children FROM core_ledger_state.nodes ORDER BY node_key")).map((r) => [r.k as string, bytesOf(r.children)]),
  );
  const queue = new Set((await read.query("SELECT encode(node_key, 'hex') AS k FROM core_ledger_state.unreferenced ORDER BY node_key")).map((r) => r.k as string));
  const states = new Map(
    (await read.query("SELECT height::text AS h, encode(state_key, 'hex') AS k FROM core_ledger_state.states ORDER BY height")).map((r) => [BigInt(r.h as string), r.k as string]),
  );
  const [present] = await read.query("SELECT to_regclass('core_contract_states.states') IS NOT NULL AS present");
  const contracts =
    present?.present === true
      ? (
          await read.query(
            "SELECT DISTINCT encode(k, 'hex') AS k FROM core_contract_states.states, LATERAL (VALUES (state_key), (zswap_state_key)) AS v (k) ORDER BY 1",
          )
        ).map((r) => r.k as string)
      : [];
  const names = await read.query(
    `SELECT c.relname AS t FROM pg_class c JOIN pg_namespace n ON n.oid = c.relnamespace
     WHERE n.nspname = 'core_ledger_state' AND c.relkind IN ('r', 'p') AND NOT c.relispartition ORDER BY 1`,
  );
  const digests = new Map<string, string>();
  for (const { t } of options.digests === false ? [] : names) {
    const [row] = await read.query(`SELECT md5(coalesce(string_agg(r::text, ',' ORDER BY r::text), '')) AS d FROM core_ledger_state.${t as string} r`);
    digests.set(t as string, row?.d as string);
  }
  return { rows, refs: await counts("ref_counts"), roots: await counts("root_counts"), queue, states, contracts, digests };
}

/**
 * What a run's ledger worker answered, in the main thread: each height's flushed batch (the last apply of the height:
 * a worker restarted at h applies h again) and the keys each height had evicted (an eviction refused records none).
 */
export interface WorkerRecord {
  readonly batches: Map<bigint, NodeBatch>;
  readonly evicted: Map<bigint, string[]>;
}

/** An empty {@link WorkerRecord}. */
export const workerRecord = (): WorkerRecord => ({ batches: new Map(), evicted: new Map() });

/** `host`, its every block's batch and eviction recorded in `record` (the other calls passed through as they are). */
export function recordingWorker(host: LedgerHost, record: WorkerRecord): LedgerHost {
  let height: bigint | null = null;
  return {
    useDatabase: (database) => host.useDatabase(database),
    parse: (ledger, block, transactions) => host.parse(ledger, block, transactions),
    genesisRoot: (ledger, bytes) => host.genesisRoot(ledger, bytes),
    async genesis(input, read) {
      const applied = await host.genesis(input, read);
      height = input.height;
      record.batches.set(input.height, applied.batch);
      return applied;
    },
    async apply(input, read) {
      const applied = await host.apply(input, read);
      height = input.height;
      record.batches.set(input.height, applied.batch);
      return applied;
    },
    commit: (block) => host.commit(block),
    release: (drop) => host.release(drop),
    load: (input, read) => host.load(input, read),
    retained: (input, read) => host.retained(input, read),
    async evict(keys) {
      const taken = await host.evict(keys);
      if (height !== null) record.evicted.set(height, [...(record.evicted.get(height) ?? []), ...keys.map(hex)].sort());
      return taken;
    },
    tasks: (input, read) => host.tasks(input, read),
    probe: () => host.probe(),
    restart: () => host.restart(),
    get restarts() {
      return host.restarts;
    },
    activity: () => host.activity(),
    bridge: () => host.bridge(),
    get failure() {
      return host.failure;
    },
    close: () => host.close(),
  };
}

/** What the watcher saw: the tables as committed at each cursor, and each block's batch. */
export interface Seen {
  readonly tables: Map<bigint, TableSnapshot>;
  readonly batches: Map<bigint, NodeBatch>;
}

/** An empty {@link Seen}. */
export const seenTables = (): Seen => ({ tables: new Map(), batches: new Map() });

/**
 * A user module requiring `ledger-state`, so that it runs after `core-ledger-state`'s `on-compute`. At each height's
 * `on-compute` it records the tables as committed at the cursor h − 1 (`seen.tables.get(h − 1)`) and, from `record`
 * when given, the batch the worker flushed for h (`seen.batches.get(h)`).
 */
export function sweepWatcher(seen: Seen, record?: WorkerRecord): ModuleDeclaration {
  return {
    id: "sweep-watch",
    version: "1.0.0",
    side: "public",
    requires: ["block-header", "ledger-state"],
    provides: [{ name: "sweep-watch-rows", lifetimes: ["table"], table: { schema: "sweep_watch", tables: ["rows"], kind: "append-only" } }],
    startsMidChain: true,
    configSchema: z.object({}),
    migrations: [{ id: "001", sql: "CREATE TABLE sweep_watch.rows (height bigint PRIMARY KEY)" }],
    points: {
      async "on-compute"(_p, b, read) {
        if (b.height > 0n) seen.tables.set(b.height - 1n, await sweepTables(read));
        const batch = record?.batches.get(b.height);
        if (batch !== undefined) seen.batches.set(b.height, batch);
      },
    },
  };
}

/** The tables after every height of a run: the watcher's, and the last height's read from `db` once the process stopped. */
export async function tablesByHeight(seen: Seen, db: ProcessDatabase, last: bigint): Promise<Map<bigint, TableSnapshot>> {
  const all = new Map(seen.tables);
  all.set(last, await sweepTables(db));
  return all;
}

/** A batch as the model takes it: hex keys, root changes of 0 left out. */
export function modelBatch(batch: NodeBatch): RefcountBatch {
  return {
    inserts: batch.inserts.map((node) => ({ key: hex(node.key), children: node.children })),
    rootCounts: batch.rootCounts.filter((count) => count.delta !== 0).map((count) => ({ key: hex(count.key), delta: count.delta })),
  };
}

/**
 * The model fed `batches`, heights 0 to `last` (`sweep` on unless `off` says so at a height): its step at every
 * height. Throws when a height has no batch.
 */
export function modelOfBatches(batches: ReadonlyMap<bigint, NodeBatch>, last: number, off: (h: number) => boolean = () => false): RefcountModelStep[] {
  const model = new RefcountModel();
  const steps: RefcountModelStep[] = [];
  for (let h = 0; h <= last; h++) {
    const batch = batches.get(BigInt(h));
    if (batch === undefined) throw new Error(`no batch recorded for height ${h}`);
    steps.push(model.block(modelBatch(batch), !off(h)));
  }
  return steps;
}

/**
 * The model's account of the original DAG, heights 0 to `last` (`sweep` on unless `off` says so at a height): each
 * batch is what a package storing exactly the model's rows flushes — the state's nodes the model does not hold, the new
 * root persisted and the one before released.
 */
export function modelOfFixture(last: number = LAST, off: (h: number) => boolean = () => false): RefcountModelStep[] {
  const model = new RefcountModel();
  const steps: RefcountModelStep[] = [];
  let previous: string | null = null;
  for (let h = 0; h <= last; h++) {
    const nodes = stateNodes(h);
    const root = hex((nodes[0] as { key: Uint8Array }).key);
    const inserts = nodes.filter((n) => !model.tables.rows.has(hex(n.key))).map((n) => ({ key: hex(n.key), children: n.children }));
    const rootCounts = [{ key: root, delta: 1 }, ...(previous === null ? [] : [{ key: previous, delta: -1 }])];
    steps.push(model.block({ inserts, rootCounts }, !off(h)));
    previous = root;
  }
  return steps;
}

/** A map's or a set's entries as text, sorted, bytes as hex. */
const text = (entries: ReadonlyMap<string, unknown> | ReadonlySet<string>): string =>
  JSON.stringify([...entries].sort(), (_k, v: unknown) => (v instanceof Uint8Array ? hex(v) : v));

/** The heights whose tables differ from the model's (rows with their child lists, counts, root counts, queue). */
export function modelProblems(tables: ReadonlyMap<bigint, TableSnapshot>, model: readonly RefcountModelStep[]): string[] {
  const problems: string[] = [];
  for (const [h, step] of model.entries()) {
    const got = tables.get(BigInt(h));
    if (got === undefined) {
      problems.push(`no tables recorded after ${h}`);
      continue;
    }
    const fields = (["rows", "refs", "roots", "queue"] as const).filter((field) => text(got[field]) !== text(step.after[field]));
    if (fields.length > 0) problems.push(`after ${h}: ${fields.join(", ")} differ from the model's`);
  }
  return problems;
}
