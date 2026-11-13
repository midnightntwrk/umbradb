/**
 * The read table at several `pathSplit` values for one snapshot height (spec FR-153: k = 16, 8 and 0), without
 * touching the running server: the benchmark reads the snapshot's stored events from the database with the module's
 * own query (`server/sql.ts`), fills the module's own index (`server/zswap-index.ts`), and runs the module's own builder
 * in its worker thread (`server/build-host.ts`, which also measures each step's peak memory) once per k into a
 * temporary data directory. The build checks `first_free` and the root against the core's rows at S, as the server's
 * does, so a build at the served k, height and call size reproduces the served snapshot's identifier (FR-145).
 *
 * For each k it then makes one read call of `queriesPerCall` vectors with client and server in this process (no
 * network): the client's query build, the server's decoding of the body and its multiplication, the client's decoding
 * of the answer, after one call to warm the multiplication's threads. Every record of the call's columns is checked
 * against the table's own (a direct read).
 */

import { readFileSync, rmSync } from "node:fs";
import { join } from "node:path";
import { paddedCalls } from "../client/pir-calls.ts";
import {
  answerQueries,
  buildQueries,
  columnRecords,
  decodeAnswers,
  type Grid,
  inlineMultiplier,
  type Multiplier,
  readRecord,
  setupMatrix,
  type TableInfo,
  WorkerMultiplier,
} from "../pir/index.ts";
import { decodeAnswerBody, decodeQueryBody, encodeAnswerBody, encodeQueryBody, equalBytes, fromHex, type Manifest, toHex } from "../shared/index.ts";
import type { BuildJob } from "../server/build.ts";
import { runBuildWorker } from "../server/build-host.ts";
import { genesisHashOf, stateAt, zswapEvents } from "../server/sql.ts";
import { rootFromStored } from "../server/tree.ts";
import { ZswapIndex } from "../server/zswap-index.ts";
import type { MemoryProbe } from "./bench-probes.ts";
import { BUILD_STEP_NAMES, type BuildStep, type BuildStepName, type EventRead, type PathSplitRun } from "./bench-results.ts";

export interface Reader {
  query(sql: string, params?: unknown[]): Promise<Record<string, unknown>[]>;
}

/** The snapshot's stored events in the module's index, and the core's rows at S. */
export interface SnapshotEvents {
  readonly index: ZswapIndex;
  readonly read: EventRead;
  readonly blockHash: Uint8Array;
  readonly genesisHash: Uint8Array;
  readonly firstFree: number;
  readonly root: Uint8Array;
}

/** Reads every Zswap output and nullifier at or below `height` with the module's query, measured. */
export async function readSnapshotEvents(db: Reader, height: number, probe: MemoryProbe): Promise<SnapshotEvents> {
  probe.mark();
  const from = Date.now();
  const started = performance.now();
  const groups = await zswapEvents(db, -1, height);
  const index = new ZswapIndex();
  let rows = 0;
  for (const group of groups) {
    index.appendHeight(group.height, group.outputs, group.nullifiers);
    rows += group.outputs.length + group.nullifiers.length;
  }
  index.advanceTo(height);
  const ms = performance.now() - started;
  probe.mark();
  if (index.error !== null) throw new Error(`the stored events are not usable: ${index.error}`);
  const state = await stateAt(db, height);
  const genesisHash = await genesisHashOf(db);
  if (state === null) throw new Error(`the database stores no ledger state at ${height}`);
  if (genesisHash === null) throw new Error("the database records no genesis hash");
  return {
    index,
    read: { rows, ms, rowsPerSecond: ms > 0 ? (rows * 1000) / ms : 0, peakRssBytes: probe.peak(from, Date.now()), height },
    blockHash: state.hash,
    genesisHash,
    firstFree: state.firstFree,
    root: rootFromStored(state.root),
  };
}

const gridOf = (t: { rows: number; cols: number; perColumn: number; cellsPerRecord: number; recordBytes: number; records: number; cells: SharedArrayBuffer }): Grid => ({
  rows: t.rows,
  cols: t.cols,
  perColumn: t.perColumn,
  cellsPerRecord: t.cellsPerRecord,
  recordBytes: t.recordBytes,
  records: t.records,
  cells: new Int16Array(t.cells),
});

const stepOf = (s: { ms: number; bytes?: number; hashes?: number; hashesPerSecond?: number; peakRssBytes: number } | undefined): BuildStep => {
  if (s === undefined) throw new Error("the build reported no such step");
  return { ms: s.ms, bytes: s.bytes, hashes: s.hashes, hashesPerSecond: s.hashesPerSecond, peakRssBytes: s.peakRssBytes };
};

export interface SplitOptions {
  readonly events: SnapshotEvents;
  /** The served snapshot: its height, network, call size and identifier. */
  readonly manifest: Manifest;
  readonly servedId: string;
  readonly ks: readonly number[];
  /** Threads of the build's multiplication and of the server side of the call. */
  readonly threads: number;
  /** Threads of the client side of the call. */
  readonly clientThreads: number;
  /** Where the builds are written (removed after each). */
  readonly workDir: string;
  /** Read-table positions a wallet would read (its scan matches); the call reads their columns, padded. */
  readonly positions: readonly number[];
  readonly probe: MemoryProbe;
  readonly log: (line: string) => void;
}

/** One build and one read call per k (see the module comment). */
export async function pathSplitRuns(o: SplitOptions): Promise<PathSplitRun[]> {
  const out: PathSplitRun[] = [];
  const m = o.manifest;
  const server: Multiplier = new WorkerMultiplier(o.threads);
  const client: Multiplier = o.clientThreads > 1 ? new WorkerMultiplier(o.clientThreads) : inlineMultiplier;
  try {
    for (const k of o.ks) {
      const dataDir = join(o.workDir, `k${k}`);
      const job: BuildJob = {
        height: m.height,
        blockHash: o.events.blockHash,
        genesisHash: o.events.genesisHash,
        network: m.network,
        expectedFirstFree: o.events.firstFree,
        expectedRoot: o.events.root,
        pathSplit: k,
        queriesPerCall: m.queriesPerCall,
        threads: o.threads,
        dataDir,
        slice: o.events.index.slice(o.events.index.outputsAt(m.height), o.events.index.nullifiersAt(m.height)),
      };
      o.log(`path split ${k}: building the snapshot at ${m.height} in-process`);
      const started = performance.now();
      const outcome = await runBuildWorker(job);
      const buildMs = performance.now() - started;
      const r = outcome.result;
      const ref = r.manifest.artifacts.readTable;
      const grid = gridOf(r.readGrid);
      const setup = setupMatrix(new Uint8Array(readFileSync(join(r.dir, r.manifest.artifacts.readSetup.digest))), grid.rows);
      const info: TableInfo = { ...grid, seed: fromHex(ref.seed, 32) };
      const idBytes = fromHex(r.id, 32);
      const wanted = o.positions.filter((p) => p < grid.records).map((p) => Math.floor(p / grid.perColumn));
      const call = async (columns: readonly number[]) => {
        o.probe.mark();
        const from = Date.now();
        let t = performance.now();
        const batch = await buildQueries(info, columns, client);
        const body = encodeQueryBody({ snapshotId: idBytes, count: columns.length, values: batch.queries }, grid.cols);
        const clientBuildMs = performance.now() - t;
        t = performance.now();
        const q = decodeQueryBody(body, grid.cols, { queriesPerCall: m.queriesPerCall, snapshotId: idBytes });
        const answers = await answerQueries(grid, q.values, q.count, server);
        const answerBody = encodeAnswerBody({ snapshotId: idBytes, count: q.count, values: answers }, grid.rows);
        const serverMultiplyMs = performance.now() - t;
        t = performance.now();
        const decoded = decodeAnswerBody(answerBody, grid.rows, { count: columns.length, snapshotId: idBytes });
        const values = await decodeAnswers(setup, batch, decoded.values, client);
        const clientDecodeMs = performance.now() - t;
        o.probe.mark();
        let checked = 0;
        columns.forEach((column, v) => {
          const records = columnRecords(grid, values[v]!);
          for (let slot = 0; slot < grid.perColumn && column * grid.perColumn + slot < grid.records; slot++) {
            if (!equalBytes(records[slot]!, readRecord(grid, column, slot))) {
              throw new Error(`k ${k}: the PIR read of column ${column}, slot ${slot} differs from the table's record`);
            }
            checked++;
          }
        });
        return { bytesUp: body.length, bytesDown: answerBody.length, clientBuildMs, serverMultiplyMs, clientDecodeMs, peakRssBytes: o.probe.peak(from, Date.now()), checked };
      };
      const [first] = paddedCalls(wanted, grid.cols, m.queriesPerCall);
      await call(first!.columns); // warms both multiplications' threads
      const measured = await call(paddedCalls(wanted, grid.cols, m.queriesPerCall)[0]!.columns);
      out.push({
        k,
        snapshotId: r.id,
        sameAsServed: k === m.pathSplit ? r.id === o.servedId : null,
        recordBytes: grid.recordBytes,
        rows: grid.rows,
        cols: grid.cols,
        perColumn: grid.perColumn,
        blocks: r.manifest.artifacts.blockRoots.blocks,
        sizes: { blockRoots: r.manifest.artifacts.blockRoots.size, readTable: ref.size, readSetup: r.manifest.artifacts.readSetup.size },
        steps: Object.fromEntries(BUILD_STEP_NAMES.map((name) => [name, stepOf(outcome.steps[name])])) as Record<BuildStepName, BuildStep>,
        buildMs,
        threads: o.threads,
        call: {
          vectors: m.queriesPerCall,
          bytesUp: measured.bytesUp,
          bytesDown: measured.bytesDown,
          clientBuildMs: measured.clientBuildMs,
          serverMultiplyMs: measured.serverMultiplyMs,
          clientDecodeMs: measured.clientDecodeMs,
          peakRssBytes: measured.peakRssBytes,
          recordsChecked: measured.checked,
        },
      });
      o.log(`path split ${k}: ${grid.rows} × ${grid.cols}, built in ${Math.round(buildMs)} ms, call ${Math.round(measured.serverMultiplyMs)} ms on the server side; snapshot ${r.id.slice(0, 16)}…${k === m.pathSplit ? (r.id === o.servedId ? " (= the served one)" : " (differs from the served one)") : ""}`);
      rmSync(dataDir, { recursive: true, force: true });
      if (!equalBytes(fromHex(r.manifest.root, 32), o.events.root)) throw new Error(`k ${k}: the build's root is not the core's (${toHex(o.events.root)})`);
    }
  } finally {
    await server.close();
    await client.close();
  }
  return out;
}
