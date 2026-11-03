import { createHash } from "node:crypto";
import { z } from "zod";
import { CORE_BLOCK_PARSED } from "../../src/backbone/core-block-parsed/core-block-parsed.js";
import { CORE_CHAIN_EVENTS } from "../../src/backbone/core-chain-events/core-chain-events.js";
import { CORE_CONTRACT_STATES } from "../../src/backbone/core-contract-states/core-contract-states.js";
import { type CoreLedgerStateOptions, coreLedgerState } from "../../src/backbone/core-ledger-state/core-ledger-state.js";
import { CORE_TX_RESULTS } from "../../src/backbone/core-tx-results/core-tx-results.js";
import type { NodeBatch } from "../../src/ledger/types.js";
import { type LedgerHost, startLedgerWorker } from "../../src/ledger/worker/host.js";
import type { ModuleDeclaration } from "../../src/modules/declaration.js";
import type { TapeRecord } from "../../tools/tape/index.js";
import { type FixtureDag, LAST, rootOf, stateNodes } from "../ledger/fixtures/sweep-fixture.js";
import type { ProcessDatabase } from "../runner/process-backends.js";
import type { FoundTape } from "../tape/real/real-tapes.js";
import { E } from "./chain-data-tapes.js";
import { eventsValue, finalizedWithEvents, RUNTIME_2_0 } from "./events-fixtures.js";
import { type ChainBlock, chainOf, opening } from "./fetch-fixtures.js";
import { committed, ingest } from "./ingest-harness.js";
import { cappedAt, devnetSettings, LEDGER_CORE } from "./ledger-restart.js";
import { nodeSet, type RefcountBatch, RefcountModel, type RefcountModelStep, type RefcountTables } from "./refcount-model.js";
import { SweepModel } from "./sweep-model.js";

/**
 * The DAG fixture's process plumbing, with `retainStates` 0: [A105, A160, R3, LG-14]
 * - a tape whose ledger is the test package of `test/ledger/fixtures/sweep-test-loader.ts`: the DAG of
 *   `sweep-fixture.ts` at each height (the original or the extended one), with its roots on the tape as the node's;
 * - the ledger's core modules;
 * - a module recording `core_ledger_state`'s tables at every cursor, with each block's batch, which the worker's answers
 *   give ({@link recordingWorker});
 * - the reference model's account of the same blocks (R1's, `./refcount-model.ts`): fed the batches a run recorded, or,
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
 * store, and a digest of every table of the schema. [R3, A105, A160, LG-11, LG-14]
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
 * false, for a check that reads the tables at many heights of a long run. [R3]
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
 * [A105, A160, R3]
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
 * when given, the batch the worker flushed for h (`seen.batches.get(h)`). [A105, R3]
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
 * R1's model fed `batches`, heights 0 to `last` (`sweep` on unless `off` says so at a height): its step at every
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
 * R1's model's account of the original DAG, heights 0 to `last` (`sweep` on unless `off` says so at a height): each
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

// ── R4: a counting run's batches fed to the sweep's reference model ─────────────────────────────────────────────────

/** A budget no run's cycle reaches: each cycle of the sweep's model starts and ends in its block. [R4] */
export const WHOLE_CYCLE = 1_000_000;

/** What a {@link SweepComparison} saw over the heights it compared. [R4] */
export interface SweepComparisonSeen {
  /** The heights compared, and the first and last of them. */
  heights: number;
  first: bigint | null;
  last: bigint | null;
  /** The heights at which the sweep's model held nodes the counting run did not. */
  strictSubset: number;
  /** The blocks after which the sweep's model's cycle had not ended. */
  cycleUnfinished: number;
  /** The rows the sweep's model deleted, over every block. */
  sweptDeleted: number;
  /** The batch nodes whose key a batch wrote before (written again, or again after a deletion). */
  writtenAgain: number;
  /** The most nodes either side held after a block. */
  most: number;
}

/**
 * The sweep's reference model (`./sweep-model.ts`, its `budget`) fed a counting run's batches block by block, its node
 * set compared after every block with the counting run's: `equal`, or the counting run's a `subset` of it. The sweep's
 * model keeps a node's first child list and counting its last, so they are compared by node set: every key held as a
 * row or embedded in a row ({@link nodeSet}). The comparison holds only while every key is written in one form; a key
 * written with another child list than before is reported, and so is, for `equal`, a cycle that does not end in its
 * block (the budget then does not fit). [R4, LG-14]
 */
export class SweepComparison {
  readonly #model: SweepModel;
  readonly #budget: number;
  readonly #relation: "equal" | "subset";
  /** Each key's child list, the one every batch writes for it. */
  readonly #lists = new Map<string, Uint8Array>();
  /** Each row's embedded keys, by key, with the child list they were read from. */
  readonly #embedded = new Map<string, { readonly children: Uint8Array; readonly keys: readonly string[] }>();
  readonly seen: SweepComparisonSeen = {
    heights: 0,
    first: null,
    last: null,
    strictSubset: 0,
    cycleUnfinished: 0,
    sweptDeleted: 0,
    writtenAgain: 0,
    most: 0,
  };

  constructor(budget: number, relation: "equal" | "subset") {
    this.#model = new SweepModel(budget);
    this.#budget = budget;
    this.#relation = relation;
  }

  /**
   * Feeds block `height`'s `batch` to the sweep's model (`sweep` as `on` says) and compares the node sets after it,
   * `rows` the counting run's rows after the block with their child lists. The problem at `height`, or null.
   */
  block(height: bigint, batch: NodeBatch, rows: Iterable<readonly [string, Uint8Array]>, on = true): string | null {
    for (const { key, children } of batch.inserts) {
      const k = hex(key);
      const first = this.#lists.get(k);
      if (first === undefined) this.#lists.set(k, children);
      else {
        this.seen.writtenAgain += 1;
        if (Buffer.compare(first, children) !== 0) return `height ${height}: ${k} is written in another form than before`;
      }
    }
    const { inserts, rootCounts } = modelBatch(batch);
    const swept = this.#model.block({ inserts, deltas: rootCounts }, on);
    if (on && swept.phase !== "idle") {
      if (this.#relation === "equal") return `height ${height}: the sweep's cycle does not end in its block (budget ${this.#budget})`;
      this.seen.cycleUnfinished += 1;
    }
    const counted = this.#nodeSet(rows);
    const held = this.#nodeSet(swept.nodes.map((k) => [k, this.#lists.get(k) as Uint8Array] as const));
    const onlyCounted = [...counted].filter((k) => !held.has(k)).sort();
    const onlySwept = [...held].filter((k) => !counted.has(k)).sort();
    if (onlyCounted.length > 0 || (this.#relation === "equal" && onlySwept.length > 0)) {
      const list = (keys: readonly string[]): string =>
        `[${keys.slice(0, 8).join(", ")}${keys.length > 8 ? `, … ${keys.length - 8} more` : ""}]`;
      return `node sets differ at height ${height}: only counting holds ${list(onlyCounted)}, only the sweep ${list(onlySwept)}`;
    }
    this.seen.heights += 1;
    this.seen.first ??= height;
    this.seen.last = height;
    this.seen.sweptDeleted += swept.deleted.length;
    if (onlySwept.length > 0) this.seen.strictSubset += 1;
    this.seen.most = Math.max(this.seen.most, counted.size, held.size);
    return null;
  }

  /** The node set of `rows`, each row's embedded keys read once per child list. */
  #nodeSet(rows: Iterable<readonly [string, Uint8Array]>): Set<string> {
    const keys = new Set<string>();
    for (const [key, children] of rows) {
      let entry = this.#embedded.get(key);
      if (entry === undefined || (entry.children !== children && Buffer.compare(entry.children, children) !== 0)) {
        entry = { children, keys: [...nodeSet([[key, children]])].filter((k) => k !== key) };
        this.#embedded.set(key, entry);
      }
      keys.add(key);
      for (const k of entry.keys) keys.add(k);
    }
    return keys;
  }
}

/**
 * R4 on a run of the DAG fixture: its batches (`batches`, heights 0 to `last`) fed to the sweep's model of `budget`,
 * the node sets compared after every block with the run's rows (`tables`). Every problem, and what the comparison saw.
 * [R4]
 */
export function sweepComparisonOf(
  batches: ReadonlyMap<bigint, NodeBatch>,
  tables: ReadonlyMap<bigint, Pick<TableSnapshot, "rows">>,
  last: number,
  budget: number,
  relation: "equal" | "subset",
): { readonly problems: readonly string[]; readonly seen: SweepComparisonSeen } {
  const comparison = new SweepComparison(budget, relation);
  const problems: string[] = [];
  for (let h = 0n; h <= BigInt(last); h++) {
    const batch = batches.get(h);
    const after = tables.get(h);
    if (batch === undefined || after === undefined) {
      problems.push(`no batch or no tables recorded for height ${h}`);
      break;
    }
    const problem = comparison.block(h, batch, after.rows);
    if (problem !== null) problems.push(problem);
  }
  return { problems, seen: comparison.seen };
}

/**
 * The stored rows' digest a tape run checks after every block: their number, and the MD5 of each key's hex followed by
 * its child list's MD5, in key order.
 */
const ROWS_DIGEST_SQL =
  "SELECT count(*)::int AS n, md5(coalesce(string_agg(encode(node_key, 'hex') || md5(children), '' ORDER BY node_key), '')) AS d FROM core_ledger_state.nodes";

/** The {@link ROWS_DIGEST_SQL} reading of `rows`, computed here. */
function rowsDigest(rows: ReadonlyMap<string, Uint8Array>): string {
  const text = [...rows.keys()]
    .sort()
    .map((key) => `${key}${createHash("md5").update(rows.get(key) as Uint8Array).digest("hex")}`)
    .join("");
  return `${rows.size} ${createHash("md5").update(text).digest("hex")}`;
}

/** What R4's comparison on a recorded tape gave. [R4] */
export interface TapeComparison {
  /** The last height the run committed. */
  readonly cursor: bigint;
  readonly status: unknown;
  /** Every problem: a height whose stored rows are not the ones the batches and evictions give, or R4's. */
  readonly problems: readonly string[];
  readonly seen: SweepComparisonSeen;
  /** The rows the counting run stored after its last height, and the rows it deleted over the run. */
  readonly rows: number;
  readonly deleted: number;
}

/** The `core` settings of a recorded tape: its network's, and for the devnet its custom network and v8/v9 table. */
export function tapeSettings(found: FoundTape): Readonly<Record<string, unknown>> {
  return found.tape.network === "custom" ? devnetSettings(found) : { network: found.tape.network };
}

/**
 * R4 on a recorded tape: the counting build runs `found` from genesis to its range's end on `db` (the ledger core with
 * `core-contract-states`, `retainStates` 0, `sweep` on), and each block's batch is fed to the sweep's model with
 * {@link WHOLE_CYCLE}, its node set compared with the counting run's after every block. The counting run's rows after
 * each block are the rows after the block before with the block's batch written and its evictions deleted; a watcher
 * module holds them to the database's after every block ({@link ROWS_DIGEST_SQL} at the next block's `on-compute`, and
 * once the process stopped for the last). Each block is compared once the next block's `on-compute` shows it
 * committed, so the comparison holds only committed blocks; nothing of the tables is kept between blocks. [R4, LG-14]
 */
export async function sweepTapeComparison(db: ProcessDatabase, found: FoundTape, patienceMs: number): Promise<TapeComparison> {
  const to = BigInt(found.tape.to);
  const record = workerRecord();
  const comparison = new SweepComparison(WHOLE_CYCLE, "equal");
  const rows = new Map<string, Uint8Array>();
  const problems: string[] = [];
  let next = 0n;
  let deleted = 0;
  /** Block `h`'s batch and evictions applied to the rows, which must then read `stored`; then R4's comparison at h. */
  const compare = (h: bigint, stored: string): void => {
    const batch = record.batches.get(h);
    if (batch === undefined) {
      problems.push(`no batch recorded for height ${h}`);
      return;
    }
    for (const node of batch.inserts) rows.set(hex(node.key), node.children);
    for (const key of new Set(record.evicted.get(h) ?? [])) {
      if (rows.delete(key)) deleted += 1;
      else problems.push(`height ${h} evicted ${key}, which is not stored`);
    }
    const tracked = rowsDigest(rows);
    if (tracked !== stored) problems.push(`the rows stored after ${h} (${stored}) are not those the batches and evictions give (${tracked})`);
    const problem = comparison.block(h, batch, rows);
    if (problem !== null) problems.push(problem);
    record.batches.delete(h);
    record.evicted.delete(h);
    next = h + 1n;
  };
  const read = async (reader: { query(sql: string): Promise<Record<string, unknown>[]> }): Promise<string> => {
    const [row] = await reader.query(ROWS_DIGEST_SQL);
    return `${row?.n as number} ${row?.d as string}`;
  };
  const watcher: ModuleDeclaration = {
    id: "sweep-compare",
    version: "1.0.0",
    side: "public",
    requires: ["block-header", "ledger-state"],
    provides: [{ name: "sweep-compare-rows", lifetimes: ["table"], table: { schema: "sweep_compare", tables: ["rows"], kind: "append-only" } }],
    startsMidChain: true,
    configSchema: z.object({}),
    migrations: [{ id: "001", sql: "CREATE TABLE sweep_compare.rows (height bigint PRIMARY KEY)" }],
    points: {
      async "on-compute"(_p, b, reader) {
        // A height processed again computes the same height: the block before it was compared already.
        if (b.height > 0n && b.height - 1n === next) compare(b.height - 1n, await read(reader));
      },
    },
  };
  const { records } = found.read();
  const process = await ingest(db, cappedAt(records, to), {
    start: 0n,
    stop: to,
    core: [...LEDGER_CORE, CORE_CONTRACT_STATES],
    user: [watcher],
    settings: tapeSettings(found),
    ledgerWorker: () => recordingWorker(startLedgerWorker(), record),
  });
  let status;
  try {
    await committed(process, to, patienceMs);
  } finally {
    status = process.handle.status();
    await process.close();
  }
  const cursor = (status.cursor ?? -1n) as bigint;
  if (cursor === to && next === to) compare(to, await read(db));
  return { cursor, status, problems, seen: comparison.seen, rows: rows.size, deleted };
}
