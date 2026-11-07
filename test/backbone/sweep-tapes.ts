import { createHash } from "node:crypto";
import { z } from "zod";
import { CORE_CONTRACT_STATES } from "../../src/backbone/core-contract-states/core-contract-states.js";
import type { NodeBatch } from "../../src/ledger/types.js";
import { startLedgerWorker } from "../../src/ledger/worker/host.js";
import type { ModuleDeclaration } from "../../src/modules/declaration.js";
import type { ProcessDatabase } from "../runner/process-backends.js";
import type { FoundTape } from "../tape/real/real-tapes.js";
import { committed, ingest } from "./ingest-harness.js";
import { modelBatch, recordingWorker, type TableSnapshot, workerRecord } from "./ledger-graph-tapes.js";
import { cappedAt, devnetSettings, LEDGER_CORE } from "./ledger-restart.js";
import { nodeSet } from "./refcount-model.js";
import { SweepModel } from "./sweep-model.js";

/**
 * R4's oracle: a counting run's batches fed, block by block, to the sweep's reference model (`./sweep-model.ts`), its
 * node set compared with the counting run's, on the DAG fixture ({@link sweepComparisonOf}) and on the recorded tapes
 * ({@link sweepTapeComparison}). It stays, with the sweep's model, until R2's and R4's tests are retired; the DAG
 * fixture's process plumbing is `./ledger-graph-tapes.ts`. [R4, LG-14]
 *
 * Imports nothing of Vitest.
 */

const hex = (bytes: Uint8Array): string => Buffer.from(bytes).toString("hex");

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
