import type { ChildProcess } from "node:child_process";
import { createHash } from "node:crypto";
import { once } from "node:events";
import { appendFileSync, readFileSync } from "node:fs";
import { createInterface } from "node:readline";
import { setTimeout as sleep } from "node:timers/promises";
import { fileURLToPath } from "node:url";
import { z } from "zod";
import { refcountStep, sqlRefcountTables, writeRefcount } from "../../src/backbone/core-ledger-state/refcount.js";
import type { DatabaseParts } from "../../src/config/database-parts.js";
import { openConfiguredDatabase } from "../../src/config/database.js";
import type { BlockWriteHandle, Database, ReadHandle, Transaction } from "../../src/db/api.js";
import { WRITER_LOCK_HOLDER_SQL } from "../../src/db/writer-lock.js";
import type { NodeBatch } from "../../src/ledger/types.js";
import { type LedgerHost, startLedgerWorker } from "../../src/ledger/worker/host.js";
import { contentsHash } from "../../src/library/contents-hash.js";
import type { ModuleDeclaration } from "../../src/modules/declaration.js";
import { FinalizedLoop, type HeightRun, type LoopInput } from "../../src/runner/loop.js";
import { readTapeFile, type TapeRecord } from "../../tools/tape/index.js";
import { spawnChild } from "../child-processes.js";
import type { FixtureDag } from "../ledger/fixtures/sweep-fixture.js";
import { cursorIn, type ProcessDatabase } from "../runner/process-backends.js";
import { ingest, type Ingest } from "./ingest-harness.js";
import { recordingWorker, SWEEP_LOADER, sweepCore, sweepTables, sweepTape, type TableSnapshot, type WorkerRecord, workerRecord } from "./ledger-graph-tapes.js";
import { cappedAt, restartAt } from "./ledger-restart.js";
import { fixtureProblems, storedProblems } from "./refcount-checks.js";
import { nodeSet } from "./refcount-model.js";

/**
 * Restarts and crashes of the process at named points, for R13 and R14: a run is one or more **segments**, each a
 * process of its own (`./refcount-restart.worker.ts`, started with {@link spawnChild}) that reads back only the
 * database the segment before it left. [R13, R14, LG-11, LG-14, RN-6]
 *
 * **The named points.** A segment is told one point and height to stop at ({@link Hold}); there it reports that it was
 * reached (one JSON line on its standard output), then either holds for ever, for the test to kill it with SIGKILL (a
 * crash), or stops the process, which ends after the height (a restart). The points of `core-ledger-state`'s block are
 * put through the seams the process already has: [R14]
 * - `before-step`: in `on-compute`, once the ledger worker answered the block's apply, before the reclamation step;
 * - `after-eviction`: in `on-compute`, once the worker answered the step's eviction, before the block's transaction;
 * - `after-node-writes`: in `on-db-write`, after the block's node writes, before the step's first statement
 *   (`refcountWriter`, the handle the step's statements run through);
 * - `between-step-writes`: after the step's first statement, before its second;
 * - `before-commit`: the block transaction's body ended (every `on-db-write`, the cursor check), before its `COMMIT`
 *   (a `FinalizedLoop` whose `write` reports it);
 * - `after-commit`: the `COMMIT` returned, before `on-after-db-write` (its `commit`);
 * - `between-commits`: R14's negative control only, between its own transaction's commit and the block's.
 *
 * **What a segment records.** Its module `restart-watch` appends, after every block it commits (its `on-after-db-write`,
 * a read at h), one line to the run's observation file ({@link Observed}): every block, what can be read cheaply on
 * a recorded tape — the node set (kept from one full read of `nodes` when the process starts, then from the rows the
 * block wrote or deleted, read back; its row count checked against the table's), `root_counts`, the block's `states`
 * row and the number of them, and `core_digest.tables` (each byte-hashed table's running digest); and, after the heights
 * the job names, `core_ledger_state`'s tables as `./ledger-graph-tapes.ts` reads them and the block's batch (a line of
 * its own, written at `on-compute`), with the contents hash where the job asks it (or why the computation refused
 * it). A line is written synchronously, so a killed segment loses none. [R13, R14, R3]
 *
 * **The negative controls' seams.** R13's ({@link SegmentJob.emptiesQueue}): a segment that empties `unreferenced`
 * before its process starts. R14's ({@link SegmentJob.control}): a build whose `ref_counts` and `unreferenced`
 * statements run in a transaction of their own, committed before the block's (the loop computes the block's step from
 * the read at h − 1 and the block's batch, as `core-ledger-state` does, and writes those two tables), while the block's
 * transaction writes the rest. [R13, R14]
 *
 * Imports nothing of Vitest, so that the worker process runs the same build.
 */

/** A named point (see the module comment). */
export type RestartPoint =
  | "before-step"
  | "after-eviction"
  | "after-node-writes"
  | "between-step-writes"
  | "before-commit"
  | "after-commit"
  | "between-commits";

/** Where a segment stops: the point, the height, and whether it holds there for the kill or stops the process. */
export interface Hold {
  readonly point: RestartPoint;
  readonly height: number;
  readonly then: "hold" | "stop";
}

/** The chain a run processes: the DAG fixture, or a recorded tape with its `core` settings. */
export type RestartChain =
  | { readonly dag: FixtureDag }
  | { readonly tape: string; readonly settings: Readonly<Record<string, unknown>> };

/** What one segment is given (plain data: the worker's one JSON argument). */
export interface SegmentJob {
  /** The `database` setting of the run's database. */
  readonly database: DatabaseParts;
  readonly chain: RestartChain;
  /** The last height: the segment ends once its cursor is there, unless it stops first. */
  readonly last: number;
  /** The cursor the database holds (decimal), for a segment that starts on it; none on a new database. */
  readonly resume?: string;
  /** The observation file the segment appends to. */
  readonly observe: string;
  /**
   * The heights after which the watcher also reads `core_ledger_state`'s tables and records their summary: all of them,
   * when it also records the tables themselves and every block's batch (the DAG fixture, whose R3 the test runs with
   * the fixture's oracle), or those listed.
   */
  readonly full: "every" | readonly number[];
  /** Those of them after which it also records the contents hash: all of them unless given. */
  readonly hashed?: readonly number[];
  /** Those of them at which the segment runs R3 itself, from the stored rows (a recorded tape; none unless given). */
  readonly checked?: readonly number[];
  readonly hold?: Hold;
  /** R14's negative control's build (see the module comment). */
  readonly control?: "own-transaction";
  /** R13's negative control: the segment empties `unreferenced` before its process starts. */
  readonly emptiesQueue?: true;
}

/** What a segment reports on its standard output, one JSON line each; and what an inspection reports. */
export type SegmentEvent =
  | { readonly event: "reached"; readonly point: RestartPoint; readonly height: number }
  | { readonly event: "inspected"; readonly cursor: number | null; readonly tables: SnapshotJson; readonly contents: string }
  | {
      readonly event: "ended";
      readonly cursor: string | null;
      readonly state: string;
      readonly reason: string | null;
      readonly why: "last" | "stopped" | "ended";
      /** The process's last log lines, when it ended otherwise. */
      readonly log?: readonly string[];
    };

/** What can be read after every block on a recorded tape (each field a SHA-256 of its text, or a count). [R13] */
export interface Light {
  readonly nodeSet: string;
  readonly nodes: number;
  readonly rows: number;
  readonly roots: string;
  readonly state: string;
  readonly states: number;
  readonly digests: string;
}

/** The tables after a block in brief: each `core_ledger_state` table's digest (`sweepTables`'), and the node set's. */
export interface Summary {
  readonly digests: readonly [string, string][];
  readonly nodeSet: string;
}

/** One block's observation (see the module comment). */
export interface Observed {
  readonly height: number;
  readonly light: Light;
  /** Where the tables were read: each `core_ledger_state` table's digest, and the node set's SHA-256. */
  readonly summary?: Summary;
  /** Where R3 ran in the segment: what it found, and the rows outside `R_{h−1} ∪ R_h`. */
  readonly r3?: { readonly problems: readonly string[]; readonly outside: number };
  readonly tables?: TableSnapshot;
  readonly contents?: string;
  /** What the watcher found wrong in itself: a node set kept apart from the table's. */
  readonly problems: readonly string[];
}

const hex = (bytes: Uint8Array): string => Buffer.from(bytes).toString("hex");
const bytes = (text: string): Uint8Array => Uint8Array.from(Buffer.from(text, "hex"));
const sha = (text: string): string => createHash("sha256").update(text).digest("hex");

// ── Serialization of what a segment records ─────────────────────────────────────────────────────────────────────────

type SnapshotJson = {
  readonly rows: [string, string][];
  readonly refs: [string, number][];
  readonly roots: [string, number][];
  readonly queue: string[];
  readonly states: [string, string][];
  readonly contracts: readonly string[];
  readonly digests: [string, string][];
};

const snapshotJson = (t: TableSnapshot): SnapshotJson => ({
  rows: [...t.rows].map(([k, c]) => [k, hex(c)]),
  refs: [...t.refs],
  roots: [...t.roots],
  queue: [...t.queue],
  states: [...t.states].map(([h, k]) => [`${h}`, k]),
  contracts: t.contracts,
  digests: [...t.digests],
});

const snapshotOf = (j: SnapshotJson): TableSnapshot => ({
  rows: new Map(j.rows.map(([k, c]) => [k, bytes(c)])),
  refs: new Map(j.refs),
  roots: new Map(j.roots),
  queue: new Set(j.queue),
  states: new Map(j.states.map(([h, k]) => [BigInt(h), k])),
  contracts: j.contracts,
  digests: new Map(j.digests),
});

type BatchJson = { readonly inserts: [string, string, string][]; readonly rootCounts: [string, number][] };

const batchJson = (b: NodeBatch): BatchJson => ({
  inserts: b.inserts.map((n) => [hex(n.key), hex(n.data), hex(n.children)]),
  rootCounts: b.rootCounts.map((c) => [hex(c.key), c.delta]),
});

const batchOf = (j: BatchJson): NodeBatch => ({
  inserts: j.inserts.map(([key, data, children]) => ({ key: bytes(key), data: bytes(data), children: bytes(children) })),
  rootCounts: j.rootCounts.map(([key, delta]) => ({ key: bytes(key), delta })),
});

type Line =
  | { readonly kind: "batch"; readonly height: number; readonly batch: BatchJson }
  | {
      readonly kind: "after";
      readonly height: number;
      readonly light: Light;
      readonly summary?: Summary;
      readonly r3?: { readonly problems: string[]; readonly outside: number };
      readonly tables?: SnapshotJson;
      readonly contents?: string;
      readonly problems: string[];
    };

// ── The segment's own side: the watcher, the points, the process ───────────────────────────────────────────────────

/**
 * The contents hash `read` sees, as hex; or, for a database whose counts or queue do not match its rows, which the
 * computation refuses (`ledger-refcount-invalid`), `refused: ` and the error. [DT-3, LG-11]
 */
async function contentsOf(read: Pick<ReadHandle, "query">): Promise<string> {
  return contentsHash(read).then(hex, (error: unknown) => `refused: ${String(error)}`);
}

/** One statement's read of what {@link Light} holds, at height `$1`. */
const LIGHT_SQL = `SELECT (SELECT count(*) FROM core_ledger_state.nodes)::int AS rows,
  (SELECT coalesce(string_agg(encode(node_key, 'hex') || ' ' || count, ',' ORDER BY node_key), '') FROM core_ledger_state.root_counts) AS roots,
  (SELECT s::text FROM core_ledger_state.states s WHERE s.height = $1::bigint) AS state,
  (SELECT count(*) FROM core_ledger_state.states)::int AS states,
  (SELECT coalesce(string_agg(d::text, ',' ORDER BY d."schema", d."table"), '') FROM core_digest.tables d) AS digests`;
const ALL_NODES_SQL = "SELECT encode(node_key, 'hex') AS k, children FROM core_ledger_state.nodes";
const SOME_NODES_SQL = "SELECT encode(node_key, 'hex') AS k, children FROM core_ledger_state.nodes WHERE node_key = ANY($1::bytea[])";

/**
 * The node set of `core_ledger_state.nodes` kept in memory: each row's key and the keys it embeds, counted, so that a
 * key embedded in two rows stays while one of them does. Built from one read of every row, then kept from the rows a
 * block wrote or deleted, read back. [R13; design §1 "node set"]
 */
class NodeSetKeeper {
  #rows: Map<string, readonly string[]> | null = null;
  readonly #count = new Map<string, number>();

  #add(key: string, children: Uint8Array): void {
    const keys = [...nodeSet([[key, children]])];
    this.#rows?.set(key, keys);
    for (const k of keys) this.#count.set(k, (this.#count.get(k) ?? 0) + 1);
  }

  #remove(key: string): void {
    for (const k of this.#rows?.get(key) ?? []) {
      const left = (this.#count.get(k) as number) - 1;
      if (left === 0) this.#count.delete(k);
      else this.#count.set(k, left);
    }
    this.#rows?.delete(key);
  }

  /** Brings the set to the tables `read` sees, given the keys the block wrote or deleted (all, the first time). */
  async update(read: Pick<ReadHandle, "query">, changed: ReadonlySet<string>): Promise<void> {
    if (this.#rows === null) {
      this.#rows = new Map();
      for (const row of await read.query(ALL_NODES_SQL)) this.#add(row.k as string, Uint8Array.from(row.children as Uint8Array));
      return;
    }
    for (const key of changed) this.#remove(key);
    if (changed.size === 0) return;
    for (const row of await read.query(SOME_NODES_SQL, [[...changed].map(bytes)])) this.#add(row.k as string, Uint8Array.from(row.children as Uint8Array));
  }

  get rows(): number {
    return this.#rows?.size ?? 0;
  }

  /** The node set's keys, sorted. */
  keys(): string[] {
    return [...this.#count.keys()].sort();
  }
}

/** The watcher module `restart-watch` (see the module comment): its lines go to `sink`. */
function restartWatcher(
  record: WorkerRecord,
  heights: { readonly every: boolean; readonly full: (h: number) => boolean; readonly hashed: (h: number) => boolean; readonly checked: (h: number) => boolean },
  sink: (line: Line) => void,
): ModuleDeclaration {
  const kept = new NodeSetKeeper();
  /** The tables at h − 1 of a height R3 runs at, read at its `on-compute`. */
  const before = new Map<number, TableSnapshot>();
  return {
    id: "restart-watch",
    version: "1.0.0",
    side: "public",
    requires: ["block-header", "ledger-state"],
    provides: [{ name: "restart-watch-rows", lifetimes: ["table"], table: { schema: "restart_watch", tables: ["rows"], kind: "append-only" } }],
    startsMidChain: true,
    configSchema: z.object({}),
    migrations: [{ id: "001", sql: "CREATE TABLE restart_watch.rows (height bigint PRIMARY KEY)" }],
    points: {
      async "on-compute"(_p, b, read) {
        const h = Number(b.height);
        const batch = record.batches.get(b.height);
        if (heights.every && batch !== undefined) sink({ kind: "batch", height: h, batch: batchJson(batch) });
        if (heights.checked(h)) before.set(h, await sweepTables(read));
      },
      async "on-after-db-write"(_p, b, read) {
        const h = Number(b.height);
        const changed = new Set([...(record.batches.get(b.height)?.inserts ?? []).map((n) => hex(n.key)), ...(record.evicted.get(b.height) ?? [])]);
        await kept.update(read, changed);
        const [row] = await read.query(LIGHT_SQL, [b.height]);
        const keys = kept.keys();
        const light: Light = {
          nodeSet: sha(keys.join(",")),
          nodes: keys.length,
          rows: row?.rows as number,
          roots: sha(row?.roots as string),
          state: sha(String(row?.state)),
          states: row?.states as number,
          digests: sha(row?.digests as string),
        };
        const problems: string[] = [];
        if (kept.rows !== light.rows) problems.push(`after ${h}: the node set kept holds ${kept.rows} rows, nodes ${light.rows}`);
        if (!heights.full(h)) {
          sink({ kind: "after", height: h, light, problems });
          return;
        }
        const tables = await sweepTables(read);
        const stored = [...nodeSet(tables.rows)].sort();
        if (stored.join(",") !== keys.join(",")) problems.push(`after ${h}: the node set kept is not the node set of nodes' rows`);
        const summary: Summary = { digests: [...tables.digests], nodeSet: sha(stored.join(",")) };
        // R3 runs where this process computed the block; a block delivered again after a restart was checked before it.
        let r3: { problems: string[]; outside: number } | undefined;
        const was = before.get(h);
        const batch = record.batches.get(b.height);
        if (heights.checked(h) && was !== undefined) {
          before.delete(h);
          r3 = batch === undefined ? { problems: [`after ${h}: R3 had no batch`], outside: 0 } : storedRowsProblems(was, tables, batch, b.height);
        }
        sink({
          kind: "after",
          height: h,
          light,
          summary,
          ...(r3 === undefined ? {} : { r3 }),
          ...(heights.every ? { tables: snapshotJson(tables) } : {}),
          ...(heights.hashed(h) ? { contents: await contentsOf(read) } : {}),
          problems,
        });
      },
    },
  };
}

/** `host` reporting, through `reached`, its block's apply answered and its eviction answered. [R14] */
function pointWorker(host: LedgerHost, reached: (point: RestartPoint, height: bigint) => Promise<void>): LedgerHost {
  let height: bigint | null = null;
  return {
    useDatabase: (database) => host.useDatabase(database),
    parse: (ledger, block, transactions) => host.parse(ledger, block, transactions),
    genesisRoot: (ledger, bytes) => host.genesisRoot(ledger, bytes),
    genesis: (input, read) => host.genesis(input, read),
    async apply(input, read) {
      const applied = await host.apply(input, read);
      height = input.height;
      await reached("before-step", input.height);
      return applied;
    },
    commit: (block) => host.commit(block),
    release: (drop) => host.release(drop),
    load: (input, read) => host.load(input, read),
    retained: (input, read) => host.retained(input, read),
    async evict(keys) {
      const taken = await host.evict(keys);
      if (height !== null) await reached("after-eviction", height);
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

/** Whether `sql` is the step's deletion of rows from `nodes` (the one statement of the step on another table). */
const deletesNodes = (sql: string): boolean => /^DELETE FROM core_ledger_state\.nodes\b/.test(sql);

/**
 * A `FinalizedLoop` reporting `before-commit` and `after-commit`; with `own`, R14's negative control's, which writes the
 * block's `ref_counts` and `unreferenced` in a transaction of its own before the block's and reports `between-commits`.
 * [R14, RN-6]
 */
function pointLoop(
  reached: (point: RestartPoint, height: bigint) => Promise<void>,
  own?: (db: Database, run: HeightRun) => Promise<void>,
): new (input: LoopInput) => FinalizedLoop {
  return class PointLoop extends FinalizedLoop {
    protected override async write(tx: Transaction, run: HeightRun): Promise<void> {
      await super.write(tx, run);
      await reached("before-commit", run.height);
    }

    protected override async commit(run: HeightRun): Promise<void> {
      if (own !== undefined) {
        await own(this.input.db, run);
        await reached("between-commits", run.height);
      }
      await super.commit(run);
      await reached("after-commit", run.height);
    }
  };
}

/**
 * R14's negative control's two halves (see the module comment): the loop's own transaction, which computes the block's
 * step as `core-ledger-state` does and runs its `ref_counts` and `unreferenced` statements, and the handle the block's
 * step runs through, which answers those statements with the rows they affected there and runs the rest. [R14]
 */
function ownTransaction(record: WorkerRecord): {
  readonly own: (db: Database, run: HeightRun) => Promise<void>;
  readonly writer: (w: Pick<BlockWriteHandle, "execute">) => Pick<BlockWriteHandle, "execute">;
} {
  const affected: number[] = [];
  return {
    async own(db, run) {
      const batch = record.batches.get(run.height);
      if (batch === undefined) throw new Error(`the control's loop has no batch for ${run.height}`);
      const step = await db.read((read) => refcountStep(sqlRefcountTables(read), batch, { height: run.height, on: true }));
      await db.transaction(async (tx) => {
        const diverted: Pick<BlockWriteHandle, "execute"> = {
          async execute(sql, params) {
            if (deletesNodes(sql)) return ((params?.[0] as readonly unknown[] | undefined) ?? []).length;
            const rows = await tx.execute(sql, params);
            affected.push(rows);
            return rows;
          },
        };
        await writeRefcount(diverted, step, step.newNodes.length + step.rewritten.length);
      });
    },
    writer: (w) => ({
      async execute(sql, params) {
        if (deletesNodes(sql)) return w.execute(sql, params);
        const rows = affected.shift();
        if (rows === undefined) throw new Error("the control's block ran a statement its own transaction did not");
        return rows;
      },
    }),
  };
}

/** The segment `job` running in this process: its process over a tape node, ended by {@link Segment.finished}. */
export interface Segment {
  readonly run: Ingest;
  /** Resolves once the process stopped, reached the job's last height (then stopped), or ended otherwise. */
  finished(): Promise<SegmentEvent>;
}

/** Starts segment `job` in this process (the worker's body), reporting its events through `report`. [R13, R14] */
export async function startSegment(job: SegmentJob, report: (event: SegmentEvent) => void): Promise<Segment> {
  const record = workerRecord();
  const among = (heights: readonly number[]): ((h: number) => boolean) => {
    const set = new Set(heights);
    return (h) => set.has(h);
  };
  const full = job.full === "every" ? () => true : among(job.full);
  const heights = { every: job.full === "every", full, hashed: job.hashed === undefined ? full : among(job.hashed), checked: among(job.checked ?? []) };
  let stopping = false;
  let run: Ingest | undefined;
  const forever = new Promise<never>(() => undefined);
  const reached = async (point: RestartPoint, height: bigint): Promise<void> => {
    if (job.hold?.point !== point || BigInt(job.hold.height) !== height) return;
    report({ event: "reached", point, height: Number(height) });
    if (job.hold.then === "hold") await forever;
    stopping = true;
    void run?.handle.stop();
  };
  const control = job.control === "own-transaction" ? ownTransaction(record) : undefined;
  const core = sweepCore({
    refcountWriter: (w, height) => {
      const through = control?.writer(w) ?? w;
      let statements = 0;
      return {
        async execute(sql, params) {
          if (statements === 0) await reached("after-node-writes", height);
          else if (statements === 1) await reached("between-step-writes", height);
          statements += 1;
          return through.execute(sql, params);
        },
      };
    },
  });
  const sink = (line: Line): void => appendFileSync(job.observe, `${JSON.stringify(line)}\n`);
  const user = [restartWatcher(record, heights, sink)];
  let records: readonly TapeRecord[];
  let settings: Readonly<Record<string, unknown>> | undefined;
  let worker: () => LedgerHost;
  if ("dag" in job.chain) {
    records = sweepTape(job.last, job.chain.dag).records;
    const data = job.chain.dag === "original" ? {} : { dag: job.chain.dag };
    worker = () => startLedgerWorker({ loader: SWEEP_LOADER, loaderData: data });
  } else {
    records = cappedAt(readTapeFile(job.chain.tape).records, BigInt(job.last));
    settings = job.chain.settings;
    worker = () => startLedgerWorker();
  }
  if (job.resume !== undefined) records = restartAt(records, BigInt(job.resume));
  if (job.emptiesQueue === true) {
    const opened = await openConfiguredDatabase({ settings: { database: job.database, developmentOptIn: true } } as never, { committedHeight: async () => null, cwd: process.cwd() });
    try {
      await opened.transaction((tx) => tx.execute("DELETE FROM core_ledger_state.unreferenced"));
    } finally {
      await opened.close();
    }
  }
  const database: ProcessDatabase = {
    setting: job.database,
    query: () => Promise.reject(new Error("a segment reads its database through its process only")),
  };
  run = await ingest(database, records, {
    start: 0n,
    core,
    user,
    ...(settings === undefined ? {} : { settings }),
    ledgerWorker: () => recordingWorker(pointWorker(worker(), reached), record),
    loop: pointLoop(reached, control?.own),
  });
  const started = run;
  return {
    run: started,
    async finished() {
      const ended = (why: "last" | "stopped" | "ended"): SegmentEvent => {
        const status = started.handle.status();
        return {
          event: "ended",
          cursor: status.cursor === null ? null : `${status.cursor}`,
          state: status.state,
          reason: status.reason === null ? null : JSON.stringify(status.reason, (_k, v: unknown) => (typeof v === "bigint" ? `${v}` : v)),
          why,
          ...(why === "ended" ? { log: started.lines.slice(-6) } : {}),
        };
      };
      for (;;) {
        const status = started.handle.status();
        if (stopping) {
          await started.close();
          return ended("stopped");
        }
        if (status.cursor === BigInt(job.last)) {
          await started.close();
          return ended("last");
        }
        if (status.ended !== null || status.state === "halted" || status.state === "refused") {
          const event = ended("ended");
          await started.close();
          return event;
        }
        await sleep(20);
      }
    },
  };
}

// ── The test's side: segments, runs, and what they are compared by ──────────────────────────────────────────────────

const WORKER = fileURLToPath(new URL("./refcount-restart.worker.ts", import.meta.url));
/** How long a worker that reported its end may take to exit before it is killed. */
const EXIT_GRACE_MS = 15_000;
const REPOSITORY = fileURLToPath(new URL("../..", import.meta.url));

/** How a segment went: its events, the point it reached, how it ended, and whether the test killed it. */
export interface SegmentOutcome {
  readonly events: readonly SegmentEvent[];
  readonly reached: Extract<SegmentEvent, { event: "reached" }> | undefined;
  readonly ended: Extract<SegmentEvent, { event: "ended" }> | undefined;
  readonly killed: boolean;
}

/**
 * Runs the worker with `job` as a process of its own and waits, up to `patience` ms, until `done` holds for its events
 * (then for its exit) or `kill` does (then kills it with SIGKILL); fails when it exits first or the time runs out.
 */
async function runWorker(
  job: SegmentJob | { readonly inspect: DatabaseParts },
  done: (events: readonly SegmentEvent[]) => boolean,
  kill: (events: readonly SegmentEvent[]) => boolean,
  patience: number,
): Promise<{ readonly events: readonly SegmentEvent[]; readonly killed: boolean }> {
  let child: ChildProcess | undefined;
  const events: SegmentEvent[] = [];
  let stderr = "";
  try {
    child = spawnChild(process.execPath, ["--import", "tsx", WORKER, JSON.stringify(job)], { cwd: REPOSITORY, stdio: ["ignore", "pipe", "pipe"] });
    const started = child;
    started.stderr?.on("data", (chunk: Buffer) => {
      stderr = (stderr + chunk.toString()).slice(-8_000);
    });
    createInterface({ input: started.stdout as NodeJS.ReadableStream }).on("line", (line) => {
      if (line.startsWith("{")) events.push(JSON.parse(line) as SegmentEvent);
    });
    const exited = once(started, "close");
    const deadline = Date.now() + patience;
    for (;;) {
      if (kill(events)) {
        started.kill("SIGKILL");
        await Promise.race([exited, sleep(patience)]);
        return { events, killed: true };
      }
      if (done(events)) {
        // Its work is done (a segment's process stopped, its database closed): it is given a while to exit by itself.
        await Promise.race([exited, sleep(EXIT_GRACE_MS)]);
        return { events, killed: false };
      }
      if (started.exitCode !== null || started.signalCode !== null) {
        throw new Error(`the worker exited (${started.exitCode ?? started.signalCode}) early: events ${JSON.stringify(events)}; stderr ${stderr}`);
      }
      if (Date.now() > deadline) throw new Error(`the worker did not end in ${patience} ms: events ${JSON.stringify(events)}; stderr ${stderr}`);
      await sleep(20);
    }
  } finally {
    if (child !== undefined && child.exitCode === null && child.signalCode === null) child.kill("SIGKILL");
  }
}

/**
 * Runs segment `job` as a process of its own on `db` and waits, up to `patience` ms, for its end: a segment holding at
 * its point is killed with SIGKILL; on PostgreSQL its writer session is then ended (on PGlite the operating system
 * released the lock with the process). [R13, R14]
 */
export async function runSegment(db: ProcessDatabase, job: SegmentJob, patience: number): Promise<SegmentOutcome> {
  const { events, killed } = await runWorker(
    job,
    (seen) => seen.some((e) => e.event === "ended"),
    (seen) => job.hold?.then === "hold" && seen.some((e) => e.event === "reached"),
    patience,
  );
  // The killed process's writer session outlives it until PostgreSQL sees its connection gone (Docker's port forwarding
  // can keep it a minute): it is ended as a crashed client's would be, its open transaction rolled back.
  // A session that ended by itself meanwhile leaves nothing to end.
  if (killed && db.admin !== undefined) {
    const admin = db.admin;
    const held = async (): Promise<boolean> => (await admin.unsafe(WRITER_LOCK_HOLDER_SQL)).length > 0;
    try {
      if (await held()) await db.terminateWriter?.();
    } catch (error) {
      if (await held()) throw error;
    }
  }
  return {
    events,
    reached: events.find((e): e is Extract<SegmentEvent, { event: "reached" }> => e.event === "reached"),
    ended: events.find((e): e is Extract<SegmentEvent, { event: "ended" }> => e.event === "ended"),
    killed,
  };
}

/** A run as its observation file holds it: the observation after each height, and each height's committed batch. */
export interface ObservedRun {
  /** The observation after each height (its last; every observation of a height is the same, else see `problems`). */
  readonly after: ReadonlyMap<number, Observed>;
  /** The batch of each height the watcher recorded it for: the last recorded, that of the attempt that committed. */
  readonly batches: ReadonlyMap<bigint, NodeBatch>;
  /** The watcher's own problems, and the heights observed twice differently. */
  readonly problems: readonly string[];
}

/** The run that the observation file `file` holds (see {@link ObservedRun}). */
export function observedRun(file: string): ObservedRun {
  const after = new Map<number, Observed>();
  const batches = new Map<bigint, NodeBatch>();
  const problems: string[] = [];
  for (const text of readFileSync(file, "utf8").split("\n")) {
    if (text === "") continue;
    const line = JSON.parse(text) as Line;
    if (line.kind === "batch") {
      batches.set(BigInt(line.height), batchOf(line.batch));
      continue;
    }
    const observed: Observed = {
      height: line.height,
      light: line.light,
      ...(line.summary === undefined ? {} : { summary: line.summary }),
      ...(line.r3 === undefined ? {} : { r3: line.r3 }),
      ...(line.tables === undefined ? {} : { tables: snapshotOf(line.tables) }),
      ...(line.contents === undefined ? {} : { contents: line.contents }),
      problems: line.problems,
    };
    const earlier = after.get(line.height);
    const same = (a: unknown, b: unknown): boolean => a === undefined || b === undefined || JSON.stringify(a) === JSON.stringify(b);
    if (earlier !== undefined && !(same(earlier.light, observed.light) && same(earlier.summary, observed.summary) && same(earlier.contents, observed.contents))) {
      problems.push(`after ${line.height}: observed twice, differently`);
    }
    problems.push(...line.problems);
    // A block delivered again after a restart is observed again; R3's result stays the one of the run that computed it.
    after.set(line.height, earlier?.r3 !== undefined && observed.r3 === undefined ? { ...observed, r3: earlier.r3 } : observed);
  }
  return { after, batches, problems };
}

/** The tables after each height a run recorded them for. */
export function tablesOf(run: ObservedRun): Map<bigint, TableSnapshot> {
  return new Map([...run.after].flatMap(([h, o]) => (o.tables === undefined ? [] : [[BigInt(h), o.tables] as const])));
}

/** The content-defined tables, whose bytes two runs need not share (`design.md` §4.4). */
const CONTENT_DEFINED: ReadonlySet<string> = new Set(["nodes", "ref_counts", "unreferenced"]);

/**
 * Where `got`'s summaries differ from `want`'s, at every height `want` summarized: a table of `core_ledger_state`
 * that is not content-defined, by its rows' digest, or the node set. Empty when they agree. [R13, R14; as A160]
 */
export function summaryDifferences(got: ObservedRun, want: ObservedRun): string[] {
  const problems: string[] = [];
  for (const [h, expected] of want.after) {
    if (expected.summary === undefined) continue;
    const have = got.after.get(h)?.summary;
    if (have === undefined) {
      problems.push(`after ${h}: no tables read`);
      continue;
    }
    const digests = new Map(have.digests);
    const tables = expected.summary.digests.filter(([t, d]) => !CONTENT_DEFINED.has(t) && digests.get(t) !== d).map(([t]) => t);
    if (have.nodeSet !== expected.summary.nodeSet) tables.push("the node set");
    if (tables.length > 0) problems.push(`after ${h}: ${tables.join(", ")} differ`);
  }
  return problems;
}

/**
 * The fields of {@link Light} two runs must agree on, each named for a problem's text: not the number of `nodes`' rows,
 * which a content-defined table's bytes decide (`design.md` §4.4).
 */
const LIGHT_NAMES: Readonly<Record<Exclude<keyof Light, "rows">, string>> = {
  nodeSet: "the node set",
  nodes: "the node set's size",
  roots: "root_counts",
  state: "the block's states row",
  states: "the number of states rows",
  digests: "core_digest.tables",
};

/**
 * Where `got` differs from `want` at heights `from` to `to`: a height either has not observed; after every height the
 * node set, `root_counts`, the `states` row and count, and `core_digest.tables` ({@link Light}); and where both recorded
 * them, the contents hash. Empty when they agree. [R13, R14]
 */
export function observedDifferences(got: ObservedRun, want: ObservedRun, from: number, to: number): string[] {
  const problems: string[] = [];
  for (let h = from; h <= to; h++) {
    const have = got.after.get(h);
    const expected = want.after.get(h);
    if (have === undefined || expected === undefined) {
      problems.push(`after ${h}: ${have === undefined ? "the run" : "the run compared with"} observed nothing`);
      continue;
    }
    const named = (Object.keys(LIGHT_NAMES) as (keyof typeof LIGHT_NAMES)[]).filter((field) => have.light[field] !== expected.light[field]).map((field) => LIGHT_NAMES[field]);
    if (have.contents !== undefined && expected.contents !== undefined && have.contents !== expected.contents) named.push("the contents hash");
    if (named.length > 0) problems.push(`after ${h}: ${named.join(", ")} differ`);
  }
  return problems;
}

/** What the database holds, read from outside any process of it: its cursor, its tables, its contents hash. */
export interface DatabaseNow {
  readonly cursor: number | null;
  readonly tables: TableSnapshot;
  /** The contents hash as hex, or why it was refused. */
  readonly contents: string;
}

/**
 * The worker's inspection (its body for `{ inspect }`): the database of `parts` opened as a process opens it, and its
 * cursor, tables and contents hash read in one read. Run as a process of its own, since an opened PGlite directory
 * stays locked for the opening process's life. [R14]
 */
export async function inspectDatabase(parts: DatabaseParts): Promise<SegmentEvent> {
  const database = await openConfiguredDatabase({ settings: { database: parts, developmentOptIn: true } } as never, { committedHeight: async () => null, cwd: process.cwd() });
  try {
    return await database.read(async (read) => {
      const [row] = await read.query("SELECT max(height)::text AS h FROM core_block_commit.blocks");
      const cursor = row?.h === null || row?.h === undefined ? null : Number(row.h);
      return { event: "inspected", cursor, tables: snapshotJson(await sweepTables(read)), contents: await contentsOf(read) };
    });
  } finally {
    await database.close();
  }
}

/** The database of `db` read from outside its process ({@link inspectDatabase}, in a process of its own). [R14] */
export async function databaseNow(db: ProcessDatabase, patience: number): Promise<DatabaseNow> {
  const { events } = await runWorker({ inspect: db.setting }, (seen) => seen.some((e) => e.event === "inspected"), () => false, patience);
  const found = events.find((e): e is Extract<SegmentEvent, { event: "inspected" }> => e.event === "inspected") as Extract<SegmentEvent, { event: "inspected" }>;
  return { cursor: found.cursor, tables: snapshotOf(found.tables), contents: found.contents };
}

/**
 * R3 on a recorded tape after height `h`, from the stored rows (`before` after h − 1, `after` after h, `batch` h's):
 * its clauses (a)–(d) ({@link storedProblems}), `K_h`'s reach going through the child lists stored after h − 1 with
 * the batch's over them (`through` `"written"`), and the number of rows outside `R_{h−1} ∪ R_h`, as a line of the
 * observation file carries them. [R3, R13]
 */
export function storedRowsProblems(
  before: TableSnapshot,
  after: TableSnapshot,
  batch: NodeBatch,
  h: bigint,
): { readonly problems: string[]; readonly outside: number } {
  const check = storedProblems(h, before, after, batch, { through: "written" });
  return { problems: [...check.problems], outside: check.outside };
}

/** What every segment of a run shares. */
export interface RunPlan {
  readonly chain: RestartChain;
  readonly last: number;
  readonly observe: string;
  readonly full: SegmentJob["full"];
  readonly hashed?: SegmentJob["hashed"];
  readonly checked?: SegmentJob["checked"];
}

/** The job of `plan`'s next segment on `db`: from the database's cursor (none on a new database), with `segment`'s own. */
export async function jobFor(
  db: ProcessDatabase,
  plan: RunPlan,
  segment: Pick<SegmentJob, "hold" | "control" | "emptiesQueue"> = {},
): Promise<SegmentJob> {
  const cursor = await cursorIn(db);
  return { database: db.setting, ...plan, ...(cursor === null ? {} : { resume: `${cursor}` }), ...segment };
}

/**
 * Where a run restarted or crashed on the DAG fixture `dag` (`restarted`) differs from an uninterrupted one, heights 0
 * to `last`: after every height, the node set, the byte-hashed tables (`core_ledger_state`'s that are not
 * content-defined, `core_digest.tables`, the contents hash) and R3's check; and the watcher's own problems. [R13, R14,
 * R3]
 */
export function restartProblems(restarted: ObservedRun, uninterrupted: ObservedRun, dag: FixtureDag, last: number): string[] {
  const tables = tablesOf(restarted);
  // R3 runs over the heights recorded from 0 on, each with its tables and batch; a run that ended early is short.
  let recorded = -1;
  while (recorded < last && tables.has(BigInt(recorded + 1)) && restarted.batches.has(BigInt(recorded + 1))) recorded += 1;
  return [
    ...restarted.problems,
    ...observedDifferences(restarted, uninterrupted, 0, last),
    ...summaryDifferences(restarted, uninterrupted),
    ...(recorded < last ? [`R3: the run recorded no tables or batch for ${recorded + 1}`] : []),
    ...fixtureProblems(dag, tables, restarted.batches, recorded).map((p) => `R3 ${p}`),
  ];
}

/**
 * Where the database a crash left (`now`, read from outside once the process was killed) is not the uninterrupted
 * run's after `cursor`: its cursor, a table of `core_ledger_state` (by its bytes: the killed run's history is the
 * uninterrupted one's), the contents hash. Empty when it is that run's database after that height, nothing of
 * another height mixed in. [R14, RN-6]
 */
export function mixProblems(now: DatabaseNow, uninterrupted: ObservedRun, cursor: number): string[] {
  if (now.cursor !== cursor) return [`the crash left the cursor at ${now.cursor}, not ${cursor}`];
  const want = uninterrupted.after.get(cursor);
  if (want?.tables === undefined || want.contents === undefined) return [`the uninterrupted run recorded no tables after ${cursor}`];
  const tables = [...new Set([...want.tables.digests.keys(), ...now.tables.digests.keys()])].filter((t) => want.tables?.digests.get(t) !== now.tables.digests.get(t));
  if (want.contents !== now.contents) tables.push("the contents hash");
  return tables.length === 0 ? [] : [`the database the crash left is not the uninterrupted run's after ${cursor}: ${tables.join(", ")} differ`];
}
