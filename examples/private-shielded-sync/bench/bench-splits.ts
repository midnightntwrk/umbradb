/**
 * The read table at several `pathSplit` values for one snapshot height (spec FR-153: k = 16, 8 and 0), without
 * touching the running server: the benchmark reads the snapshot's stored events from the database with the module's
 * own query (`server/sql.ts`), fills the module's own index (`server/zswap-index.ts`), and runs the module's own builder
 * in its worker thread (`server/build-host.ts`, which also measures each step's peak memory) once per k into a
 * temporary data directory. The build checks `first_free` and the root against the core's rows at S, as the server's
 * does, so a build at the served k, height and call size reproduces the served snapshot's identifier (FR-145).
 *
 * For each k it then makes one read call of `queriesPerCall` requests with client and server in this process (no
 * network), through the snapshot's scheme (`../pir/scheme.ts`): the client's request build, the server's decoding of
 * the body and its answer, the client's decoding of the answer, after one call to warm the threads. Every record of the
 * call's groups is checked against the table file the build wrote, read directly (`storedRecords`: the one place
 * here that knows each scheme's file).
 */

import { readFileSync, rmSync } from "node:fs";
import { join } from "node:path";
import { paddedCalls, readCell } from "../client/pir-calls.ts";
import { deserializeGrid, inlineMultiplier, type Multiplier, openWalletScheme, readRecord, type TableTransfer, type WalletSchemeOptions, WorkerMultiplier } from "../pir/index.ts";
import { readIpirRecord } from "../pir/ipir/encode.ts";
import { openServerScheme } from "../pir/server-schemes.ts";
import { decodeAnswerBody, decodeQueryBody, encodeAnswerBody, encodeQueryBody, equalBytes, fromHex, type Manifest, type PirTableRef, toHex } from "../shared/index.ts";
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

const stepOf = (s: { ms: number; bytes?: number; hashes?: number; hashesPerSecond?: number; peakRssBytes: number; scheme?: Readonly<Record<string, number>> } | undefined): BuildStep | null =>
  s === undefined ? null : { ms: s.ms, bytes: s.bytes, hashes: s.hashes, hashesPerSecond: s.hashesPerSecond, peakRssBytes: s.peakRssBytes, ...(s.scheme === undefined ? {} : { scheme: s.scheme }) };

/**
 * Record `slot` of group `group` read straight from a table file as the build wrote it (no PIR): the reference a PIR
 * read must equal. SimplePIR's file is a 32-byte header and the grid's cells (a group is a column); IPIR+SP's is the
 * column-major 16-bit cells with no header (a group is a row).
 */
export function storedRecords(scheme: string, ref: PirTableRef, file: Uint8Array): (group: number, slot: number) => Uint8Array {
  if (scheme === "simplepir") {
    const grid = deserializeGrid(file);
    return (group, slot) => readRecord(grid, group, slot);
  }
  if (scheme === "ipir-sp") {
    const { rows, cols, cellsPerRecord } = ref.layout;
    if (file.length !== 2 * rows * cols) throw new Error(`an IPIR+SP table file of ${rows} × ${cols} cells is ${2 * rows * cols} bytes, got ${file.length}`);
    // A copy at offset 0, so that its 16-bit view is aligned.
    const cells = new Uint16Array(new Uint8Array(file).buffer);
    return (group, slot) => readIpirRecord(cells, rows, group, slot, cellsPerRecord, ref.recordBytes);
  }
  throw new Error(`the benchmark cannot read a ${scheme} table file`);
}

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
  /** IPIR+SP: the wallet's WebAssembly (`compileIpirWasm`); unused for SimplePIR. */
  readonly ipirWasm?: WalletSchemeOptions["ipirWasm"];
}

/** One build and one read call per k (see the module comment). */
export async function pathSplitRuns(o: SplitOptions): Promise<PathSplitRun[]> {
  const out: PathSplitRun[] = [];
  const m = o.manifest;
  const server = await openServerScheme(m.scheme, { threads: o.threads });
  const client: Multiplier = o.clientThreads > 1 ? new WorkerMultiplier(o.clientThreads) : inlineMultiplier;
  const wallet = await openWalletScheme(m, { multiplier: client, ...(o.ipirWasm === undefined ? {} : { ipirWasm: o.ipirWasm }) });
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
        scheme: m.scheme,
        threads: o.threads,
        dataDir,
        slice: o.events.index.slice(o.events.index.outputsAt(m.height), o.events.index.nullifiersAt(m.height)),
        // A padded snapshot is built padded the same way, so the build at the served k gives the served snapshot.
        ...(m.padding === undefined ? {} : { padding: m.padding.size }),
      };
      o.log(`path split ${k}: building the snapshot at ${m.height} in-process`);
      const started = performance.now();
      const outcome = await runBuildWorker(job);
      const buildMs = performance.now() - started;
      const r = outcome.result;
      const idBytes = fromHex(r.id, 32);
      // Tables made answerable here, released after this k; the nullifier table is not called, so its transfer is freed.
      const adopted: { release(): void }[] = [];
      const walletTables: { dispose(): void }[] = [];
      server.discardTransfer(r.tables.nullifier);
      /**
       * One call to a table (read or path) through the scheme: build, the server's decoding and answer, decode, every
       * record checked against the table file's own.
       */
      const callOn = async (ref: PirTableRef, publicDigest: string, transfer: TableTransfer) => {
        const stored = storedRecords(m.scheme, ref, new Uint8Array(readFileSync(join(r.dir, ref.digest))));
        const table = await server.adoptTable(ref, transfer);
        adopted.push(table);
        const walletTable = await wallet.openTable(ref, new Uint8Array(readFileSync(join(r.dir, publicDigest))));
        walletTables.push(walletTable);
        return async (groups: readonly number[]) => {
          o.probe.mark();
          const from = Date.now();
          let t = performance.now();
          const prepared = await walletTable.prepareCall(groups);
          const body = encodeQueryBody({ snapshotId: idBytes, count: groups.length, payload: prepared.requests }, walletTable.requestBytes);
          const clientBuildMs = performance.now() - t;
          t = performance.now();
          const q = decodeQueryBody(body, table.requestBytes, { queriesPerCall: m.queriesPerCall, snapshotId: idBytes });
          const answers = await table.answer(q.payload, q.count);
          const answerBody = encodeAnswerBody({ snapshotId: idBytes, count: q.count, payload: answers }, table.responseBytes);
          const serverMultiplyMs = performance.now() - t;
          t = performance.now();
          const decoded = decodeAnswerBody(answerBody, walletTable.responseBytes, { count: groups.length, snapshotId: idBytes });
          const records = await prepared.decode(decoded.payload, groups.length);
          const clientDecodeMs = performance.now() - t;
          o.probe.mark();
          let checked = 0;
          groups.forEach((group, v) => {
            for (let slot = 0; slot < ref.perGroup && group * ref.perGroup + slot < ref.records; slot++) {
              if (!equalBytes(records[v]![slot]!, stored(group, slot))) {
                throw new Error(`k ${k}: the PIR read of group ${group}, slot ${slot} differs from the table's record`);
              }
              checked++;
            }
          });
          return { vectors: groups.length, bytesUp: body.length, bytesDown: answerBody.length, clientBuildMs, serverMultiplyMs, clientDecodeMs, peakRssBytes: o.probe.peak(from, Date.now()), recordsChecked: checked };
        };
      };
      /** A warm-up call, then the measured one, over `wanted`'s groups padded to a full call. */
      const measure = async (ref: PirTableRef, publicDigest: string, transfer: TableTransfer, wanted: readonly number[]) => {
        const call = await callOn(ref, publicDigest, transfer);
        await call(paddedCalls(wanted, ref.groups, m.queriesPerCall)[0]!.groups); // warms both sides' threads
        return call(paddedCalls(wanted, ref.groups, m.queriesPerCall)[0]!.groups);
      };
      const a = r.manifest.artifacts;
      const ref = a.readTable;
      let measured: PathSplitRun["call"];
      let path: PathSplitRun["path"] = null;
      let pathAdopted = false;
      try {
        measured = await measure(ref, a.readPublic.digest, r.tables.read, o.positions.filter((p) => p < r.manifest.firstFree).map((p) => readCell(r.manifest, p, ref).group));
        // The path table (Q58): the positions a wallet would spend from, those in blocks full at the snapshot.
        const pathRef = a.pathTable;
        const pathPublicRef = a.pathPublic;
        if (r.tables.path !== null && pathRef !== undefined && pathPublicRef !== undefined) {
          const full = Math.floor(o.events.firstFree / 2 ** k) * 2 ** k;
          const spendable = o.positions.filter((p) => p < full).map((p) => readCell(r.manifest, p, pathRef).group);
          pathAdopted = spendable.length > 0;
          const pathCall = spendable.length === 0 ? null : await measure(pathRef, pathPublicRef.digest, r.tables.path, spendable);
          const l = pathRef.layout;
          path = { recordBytes: pathRef.recordBytes, rows: l.rows, cols: l.cols, groups: pathRef.groups, perGroup: pathRef.perGroup, tableBytes: pathRef.size, publicBytes: pathPublicRef.size, call: pathCall };
        }
      } finally {
        for (const t of walletTables) t.dispose();
        for (const t of adopted) t.release();
        if (!pathAdopted && r.tables.path !== null) server.discardTransfer(r.tables.path);
      }
      out.push({
        k,
        snapshotId: r.id,
        sameAsServed: k === m.pathSplit ? r.id === o.servedId : null,
        recordBytes: ref.recordBytes,
        rows: ref.layout.rows,
        cols: ref.layout.cols,
        groups: ref.groups,
        perGroup: ref.perGroup,
        blocks: a.blockRoots.blocks,
        sizes: { blockRoots: a.blockRoots.size, readTable: ref.size, readPublic: a.readPublic.size },
        steps: Object.fromEntries(BUILD_STEP_NAMES.map((name) => [name, stepOf(outcome.steps[name])])) as Record<BuildStepName, BuildStep | null>,
        buildMs,
        threads: o.threads,
        path,
        call: measured,
      });
      o.log(`path split ${k}: ${m.scheme} ${ref.layout.rows} × ${ref.layout.cols}, built in ${Math.round(buildMs)} ms, call ${Math.round(measured.serverMultiplyMs)} ms on the server side; snapshot ${r.id.slice(0, 16)}…${k === m.pathSplit ? (r.id === o.servedId ? " (= the served one)" : " (differs from the served one)") : ""}`);
      rmSync(dataDir, { recursive: true, force: true });
      if (!equalBytes(fromHex(r.manifest.root, 32), o.events.root)) throw new Error(`k ${k}: the build's root is not the core's (${toHex(o.events.root)})`);
    }
  } finally {
    wallet.dispose();
    await server.close();
    await client.close();
  }
  return out;
}
