/**
 * The benchmark's run (spec FR-150–154, story 6): the flow of spec §1 against a running server, measured part by
 * part, as `BenchResults` (`bench-results.ts`). `bench.ts` is its command line; the tests call it directly.
 *
 * In order:
 * 1. Optionally asks the server for a snapshot (the admin route: at a height, with a scheme and a padding when given)
 *    and waits for it, sampling the server's memory around it.
 * 2. The manifest; the server's own build statistics for that snapshot (`<dataDir>/snapshots/<id>/build-stats.json`);
 *    with the admin secret, the bytes each served table says it holds.
 * 3. Each wallet's `sync` (the client's own code, `client/sync.ts`) as a fresh client: its own artifact cache, scan
 *    threads and PIR threads; each step's duration and the peak memory of this process and of the server while it ran;
 *    every request with the server's log line for it. Then, as `send` would, the lower paths of its coins from the path
 *    table (`lowerPathsByPir`), measured the same way.
 * 4. The scan of the snapshot's scan file at several thread counts.
 * 5. With the database: its size; the snapshot's stored events read with the module's own query; the read table built
 *    in-process for each `pathSplit` (FR-153) and one read call on each.
 * 6. The sync's speed from its status records; the transfer from the record `send` wrote; the naive baseline (FR-152).
 *
 * Every scheme runs through the seam (`../pir/scheme.ts`); IPIR+SP's wallet needs `ipirWasm` (spec 00058 FR-050).
 * Nothing secret enters the results: wallets are labels with counts.
 */

import { execFileSync } from "node:child_process";
import { createHash } from "node:crypto";
import { existsSync, mkdirSync, readFileSync, statSync } from "node:fs";
import { arch, availableParallelism, cpus, loadavg, platform, release, totalmem } from "node:os";
import { join } from "node:path";
import { BlobCache } from "../client/cache.ts";
import { type FetchLike, PssHttp } from "../client/http.ts";
import { keysFromZswapSeed, type WalletKeys } from "../client/keys.ts";
import type { Ledger } from "../client/ledger.ts";
import { writeState } from "../client/state.ts";
import { lowerPathsByPir, pathInTable, SYNC_STEPS, type SyncResult, type SyncStep, sync } from "../client/sync.ts";
import { committedKernelDigest, compileKernel, Kernel, ScanPool } from "../kernel/index.ts";
import { inlineMultiplier, type Multiplier, type WalletSchemeOptions, WorkerMultiplier } from "../pir/index.ts";
import { decodeManifest, type Manifest, ROUTES } from "../shared/index.ts";
import { slotCount } from "../shared/padding.ts";
import { cursorOf, databaseSize, type StatusSample, syncRate } from "./bench-chain.ts";
import type { MemoryProbe } from "./bench-probes.ts";
import { selfProbe } from "./bench-probes.ts";
import {
  BUILD_STEP_NAMES,
  type BenchResults,
  type BenchTableName,
  type BuildStep,
  type BuildStepName,
  type CallRow,
  type ChainSync,
  type EventRead,
  type PathRead,
  type PathSplitRun,
  RESULTS_FORMAT,
  type ScanSweepRow,
  TABLE_NAMES,
  type TableShape,
  type TransferRow,
  type WalletRun,
} from "./bench-results.ts";
import { pairRequests, parseServerLines, type ServerRequestLine } from "./bench-server-log.ts";
import { pathSplitRuns, type Reader, readSnapshotEvents } from "./bench-splits.ts";

export interface BenchWallet {
  readonly label: string;
  readonly source: "mnemonic" | "seed";
  readonly zswapSeed: Uint8Array;
}

export interface BenchOptions {
  /** The module API's origin. */
  readonly server: string;
  readonly ledger: Ledger;
  /** The ledger package the client runs on, for the report. */
  readonly ledgerName: string;
  readonly wallets: readonly BenchWallet[];
  /** Caches, local states and builds; the caller removes it. */
  readonly workDir: string;
  /** The network the manifest must name, if given. */
  readonly network?: string;
  readonly clientThreads: number;
  readonly scanThreads: readonly number[];
  /** FR-153's `pathSplit` values (none without a database). */
  readonly pathSplits: readonly number[];
  /** Threads of the in-process builds and the server side of their calls; the server's own count when null. */
  readonly buildThreads: number | null;
  /** The server's database (read only), or null. */
  readonly db: Reader | null;
  /** The module's data directory (for `build-stats.json`), or null. */
  readonly pssData: string | null;
  /** The sync's status samples and number of runs, or null. */
  readonly syncRecords: { readonly samples: readonly StatusSample[]; readonly runs: number | null } | null;
  /** The admin `/status` URL (module versions), or null. */
  readonly statusUrl: string | null;
  /** The server's log lines since a time, and where they come from; null when not available. */
  readonly serverLog: { readonly source: string; lines(since: Date): Promise<string[]> } | null;
  /** The server's memory, or null when it cannot be sampled. */
  readonly serverMemory: MemoryProbe | null;
  /**
   * Ask the server for a snapshot first (admin route): at `height` (else its latest), with `scheme` and `padding` for
   * this one build when given (00058 FR-002; Q57).
   */
  readonly build: { readonly adminSecret: string; readonly height?: number; readonly scheme?: string; readonly padding?: number; readonly timeoutMs?: number } | null;
  /** The admin secret, to read the module's status (the bytes its tables hold) when no build is asked for. */
  readonly adminSecret?: string;
  /** The scheme the served snapshot must use (the benchmark refuses another); none: any. */
  readonly scheme?: string;
  /** Read each wallet's lower paths from the path table after its sync, as `send` does (default true). */
  readonly pathRead?: boolean;
  /** IPIR+SP: the wallet's WebAssembly (`compileIpirWasm`); SimplePIR runs without it. */
  readonly ipirWasm?: WalletSchemeOptions["ipirWasm"];
  /** The record `send` wrote, or null. */
  readonly transfer: { readonly record: Record<string, unknown>; readonly source: string } | null;
  readonly log: (line: string) => void;
  readonly fetch?: FetchLike;
  /** Extra lines for the report's notes. */
  readonly notes?: readonly string[];
}

const fetchOf = (o: BenchOptions): FetchLike => o.fetch ?? ((u, init) => fetch(u, init));

/** The module's admin status (`GET` of the admin snapshot route). */
async function adminStatus(o: BenchOptions, secret: string): Promise<Record<string, any>> {
  const answer = await fetchOf(o)(`${new URL(o.server).origin}${ROUTES.adminSnapshot}`, { method: "GET", headers: { Authorization: `Bearer ${secret}` } });
  if (answer.status !== 200) throw new Error(`GET ${ROUTES.adminSnapshot}: ${answer.status}`);
  return (await answer.json()) as Record<string, any>;
}

const median = (xs: readonly number[]): number | null => {
  if (xs.length === 0) return null;
  const s = [...xs].sort((a, b) => a - b);
  return s.length % 2 === 1 ? s[(s.length - 1) / 2]! : (s[s.length / 2 - 1]! + s[s.length / 2]!) / 2;
};

/**
 * Asks the server for a snapshot and waits until it is served (decision Q33's admin route; 00058: with a scheme and a
 * padding). The server's resident memory: the probe's peak in the second before the request, its peak from the request
 * to the snapshot being served, and once served, the median of its peaks over 250 ms windows from 1 to 3 s after.
 */
async function requestBuild(o: BenchOptions): Promise<NonNullable<BenchResults["build"]>> {
  const build = o.build!;
  const f = fetchOf(o);
  const url = `${new URL(o.server).origin}${ROUTES.adminSnapshot}`;
  const auth = { Authorization: `Bearer ${build.adminSecret}` };
  const status = (): Promise<Record<string, any>> => adminStatus(o, build.adminSecret);
  const before = (await status()).last?.finishedAt ?? null;
  const body = { ...(build.height === undefined ? {} : { height: build.height }), ...(build.scheme === undefined ? {} : { scheme: build.scheme }), ...(build.padding === undefined ? {} : { padding: build.padding }) };
  const memory = o.serverMemory;
  // Let a sparse probe take a sample or two first.
  if (memory !== null) await new Promise((resolve) => setTimeout(resolve, 1000));
  const askedAt = Date.now();
  const answer = await f(url, { method: "POST", headers: { ...auth, "Content-Type": "application/json" }, body: JSON.stringify(body) });
  if (answer.status !== 202) throw new Error(`POST ${ROUTES.adminSnapshot} ${JSON.stringify(body)}: ${answer.status} ${(await answer.text()).slice(0, 400)}`);
  const requested = ((await answer.json()) as Record<string, any>).building?.height;
  o.log(`snapshot requested at height ${String(requested)}${build.scheme === undefined ? "" : `, scheme ${build.scheme}`}${build.padding === undefined ? "" : `, padded to ${build.padding}`}; waiting for the build`);
  const deadline = Date.now() + (build.timeoutMs ?? 2 * 3600 * 1000);
  while (Date.now() < deadline) {
    await new Promise((resolve) => setTimeout(resolve, 500));
    const s = await status();
    if (s.building === null && s.last?.finishedAt !== before && s.last !== null && s.last !== undefined) {
      if (s.last.ok !== true) throw new Error(`the snapshot build failed: ${s.last.code}: ${s.last.message}`);
      const servedAt = Date.now();
      o.log(`snapshot ${String(s.last.id).slice(0, 16)}… built at ${s.last.height} in ${Math.round(s.last.totalMs)} ms`);
      let after: number | null = null;
      if (memory !== null) {
        // 1 to 3 s after: the median of the probe's peaks over 250 ms windows.
        const peaks: number[] = [];
        for (let at = servedAt + 1250; at <= servedAt + 3000; at += 250) {
          await new Promise((resolve) => setTimeout(resolve, Math.max(0, at - Date.now())));
          memory.mark();
          const x = memory.peak(at - 250, at);
          if (x !== null) peaks.push(x);
        }
        after = median(peaks);
      }
      return {
        height: typeof s.last.height === "number" ? s.last.height : null,
        scheme: build.scheme ?? (typeof s.last.scheme === "string" ? s.last.scheme : null),
        padding: build.padding ?? null,
        ms: servedAt - askedAt,
        rssBeforeBytes: memory?.peak(askedAt - 1000, askedAt) ?? null,
        rssPeakBytes: memory?.peak(askedAt, servedAt) ?? null,
        rssAfterBytes: after,
      };
    }
  }
  throw new Error("the snapshot build did not finish in time");
}

const numberOr = (x: unknown): number | null => (typeof x === "number" && Number.isFinite(x) ? x : null);

/** The served snapshot's `build-stats.json`, as the server rows of spec §8. */
function serverBuildFromStats(path: string): NonNullable<BenchResults["serverBuild"]> {
  const s = JSON.parse(readFileSync(path, "utf8")) as Record<string, any>;
  const step = (name: BuildStepName): BuildStep | null => {
    const x = s.steps?.[name];
    if (x === undefined || x === null) return null;
    const scheme = x.scheme !== null && typeof x.scheme === "object" ? (x.scheme as Record<string, number>) : undefined;
    return { ms: x.ms, bytes: x.bytes, hashes: x.hashes, hashesPerSecond: x.hashesPerSecond, peakRssBytes: numberOr(x.peakRssBytes), ...(scheme === undefined ? {} : { scheme }) };
  };
  const read = (x: Record<string, any> | null | undefined, height: number): EventRead | null =>
    x === null || x === undefined ? null : { rows: x.rows, ms: x.ms, rowsPerSecond: x.rowsPerSecond, peakRssBytes: numberOr(x.peakRssBytes), height: x.height ?? height };
  return {
    source: `the server's build-stats.json (${s.trigger ?? "?"} build at ${s.height}, ${s.threads ?? "?"} threads)`,
    totalMs: numberOr(s.totalMs),
    threads: numberOr(s.threads),
    steps: Object.fromEntries(BUILD_STEP_NAMES.map((n) => [n, step(n)])) as Record<BuildStepName, BuildStep | null>,
    indexLoad: read(s.indexLoad, s.indexLoad?.height ?? 0),
    indexSlice: read(s.readEvents, s.height),
  };
}

/** The transfer row from the record `send` writes (`<data>/transfers/<time>.json` or `--out`). */
export function transferRow(record: Record<string, any>, source: string): TransferRow {
  const tx = (record.transaction ?? null) as Record<string, any> | null;
  const t = (record.timings ?? {}) as Record<string, unknown>;
  const submitted = tx !== null && tx.finalized !== null && tx.finalized !== undefined;
  return {
    source,
    wallet: typeof record.wallet === "string" ? record.wallet : null,
    submitted,
    txHash: typeof tx?.txHash === "string" ? tx.txHash : null,
    block: submitted ? numberOr(tx!.finalized.blockHeight) : null,
    bytesSubmitted: submitted ? numberOr(tx!.bytes) : null,
    unprovenBytes: numberOr(record.unprovenBytes),
    peakRssBytes: numberOr(record.peakRssBytes),
    timings: {
      feeWalletSyncMs: numberOr(t.feeWalletSyncMs),
      syncMs: numberOr(t.syncMs),
      pathMs: numberOr(t.pathMs),
      stateMs: numberOr(t.stateMs),
      spendMs: numberOr(t.spendMs),
      balanceMs: numberOr(t.balanceMs),
      proveMs: numberOr(t.proveMs),
      validateMs: numberOr(t.validateMs),
      toInBlockMs: numberOr(t.toInBlockMs),
      toFinalizedMs: numberOr(t.toFinalizedMs),
    },
  };
}

function machine(): BenchResults["machine"] {
  return { cpu: cpus()[0]?.model ?? "unknown", cores: availableParallelism(), memoryBytes: totalmem(), platform: `${platform()} ${release()}`, arch: arch(), node: process.version };
}

function repositoryVersion(): { version: string; commit: string | null } {
  const root = new URL("../../../", import.meta.url);
  let version = "unknown";
  try {
    version = (JSON.parse(readFileSync(new URL("package.json", root), "utf8")) as { version: string }).version;
  } catch {
    // not in a checkout
  }
  let commit: string | null = null;
  try {
    commit = execFileSync("git", ["rev-parse", "--short=12", "HEAD"], { cwd: root, encoding: "utf8", stdio: ["ignore", "pipe", "ignore"] }).trim();
    const dirty = execFileSync("git", ["status", "--porcelain", "--untracked-files=no"], { cwd: root, encoding: "utf8", stdio: ["ignore", "pipe", "ignore"] }).trim();
    if (dirty !== "") commit = `${commit} (with uncommitted changes)`;
  } catch {
    // not a git checkout
  }
  return { version, commit };
}

/** A wallet's sync, measured; its row is finished once the server's log lines are read. */
interface WalletOutcome {
  readonly keys: WalletKeys;
  readonly cache: BlobCache;
  /** Read-table positions its scan matched (kept in memory for FR-153's call; never written). */
  readonly positions: readonly number[];
  /** Its requests' paths, digests included (for FR-142's comparison). */
  readonly paths: readonly string[];
  finish(lines: readonly ServerRequestLine[], used: Set<ServerRequestLine>): WalletRun;
}

/** What the scheme options of a wallet's sync and path read are. */
const walletSchemeOptions = (o: BenchOptions): Pick<WalletSchemeOptions, "ipirWasm"> => (o.ipirWasm === undefined ? {} : { ipirWasm: o.ipirWasm });

async function runWallet(o: BenchOptions, w: BenchWallet, kernel: Kernel, module: WebAssembly.Module, manifest: Manifest, snapshotId: string, self: MemoryProbe): Promise<WalletOutcome> {
  const keys = keysFromZswapSeed(o.ledger, w.zswapSeed, kernel);
  const scanPool = new ScanPool({ threads: o.clientThreads, module });
  const multiplier: Multiplier = o.clientThreads > 1 ? new WorkerMultiplier(o.clientThreads) : inlineMultiplier;
  const answeredAt: number[] = [];
  const f = fetchOf(o);
  const http = new PssHttp(o.server, {
    fetch: async (url, init) => {
      const response = await f(url, init);
      answeredAt.push(Date.now());
      return response;
    },
  });
  const cache = new BlobCache(join(o.workDir, "cache", w.label));
  const windows = {} as Record<SyncStep, { from: number; to: number }>;
  const server = o.serverMemory;
  self.mark();
  const from = Date.now();
  let result: SyncResult;
  let to = 0;
  /** Answers received by the end of the sync (the path read's come after). */
  let syncAnswers = 0;
  let pathRead: { stats: Awaited<ReturnType<typeof lowerPathsByPir>>["stats"]; paths: number; records: number; from: number; to: number } | null = null;
  try {
    result = await sync({
      ledger: o.ledger,
      keys,
      http,
      cache,
      kernel,
      scanPool,
      multiplier,
      ...walletSchemeOptions(o),
      ...(o.network === undefined ? {} : { network: o.network }),
      previous: null,
      log: (line) => o.log(`${w.label}: ${line}`),
      onStep: (step, phase) => {
        self.mark();
        server?.mark();
        if (phase === "start") windows[step] = { from: Date.now(), to: Date.now() };
        else windows[step]!.to = Date.now();
      },
    });
    self.mark();
    to = Date.now();
    syncAnswers = answeredAt.length;
    if (result.state.snapshot.id !== snapshotId) throw new Error(`${w.label} synced against snapshot ${result.state.snapshot.id}, not the benchmark's ${snapshotId}: the server replaced it`);
    // The lower paths `send` would read to spend this wallet's unspent coins (Q58): one padded call, random groups
    // only when it has none in a full block.
    if ((o.pathRead ?? true) && result.manifest.artifacts.pathTable !== undefined) {
      const coins = result.state.coins.filter((c) => c.spent === null && pathInTable(result.manifest, c));
      const records = http.records.length;
      self.mark();
      server?.mark();
      const pathFrom = Date.now();
      const read = await lowerPathsByPir({ http, cache, kernel, multiplier, ...walletSchemeOptions(o) }, result, coins);
      self.mark();
      server?.mark();
      pathRead = { stats: read.stats, paths: read.paths.size, records, from: pathFrom, to: Date.now() };
      o.log(`${w.label}: ${read.paths.size} lower path(s) read from the path table and checked against their blocks' roots`);
    }
  } finally {
    await scanPool.close();
    await multiplier.close();
  }
  const stateBytes = writeState(join(o.workDir, "wallets", w.label, "state.json"), result.state);
  const stats = result.stats;
  const coins = result.state.coins;
  const peak = (s: SyncStep) => ({
    ms: windows[s] === undefined ? 0 : windows[s].to - windows[s].from,
    clientPeakRssBytes: windows[s] === undefined ? null : self.peak(windows[s].from, windows[s].to),
    serverPeakRssBytes: windows[s] === undefined || server === null ? null : server.peak(windows[s].from, windows[s].to),
  });
  const steps = Object.fromEntries(SYNC_STEPS.map((s) => [s, peak(s)])) as WalletRun["steps"];
  const requestMs = stats.requests.reduce((n, r) => n + r.ms, 0);
  const finish = (serverLines: readonly ServerRequestLine[], used: Set<ServerRequestLine>): WalletRun => {
    // A sync started again (409) reports its last attempt's requests: the last ones answered before the path read.
    const n = stats.requests.length;
    const zipped = syncAnswers >= n ? answeredAt.slice(syncAnswers - n, syncAnswers) : null;
    const requests = pairRequests(stats.requests, zipped, serverLines, used);
    const serverMsOf = (path: string): number | null => {
      const matched = requests.filter((r) => r.route === path);
      if (matched.length === 0 || matched.some((r) => r.server === null)) return null;
      return matched.reduce((n, r) => n + r.server!.ms, 0);
    };
    const callRow = (c: typeof stats.read, path: string, step: SyncStep): CallRow => {
      const calls = Math.max(1, c.calls);
      const serverMs = serverMsOf(path);
      return {
        calls: c.calls,
        bytesUp: c.bytesUp / calls,
        bytesDown: c.bytesDown / calls,
        roundTripMs: c.roundTripMs / calls,
        clientBuildMs: c.buildMs / calls,
        clientDecodeMs: c.decodeMs / calls,
        serverMs: serverMs === null ? null : serverMs / calls,
        clientPeakRssBytes: steps[step].clientPeakRssBytes,
        serverPeakRssBytes: steps[step].serverPeakRssBytes,
      };
    };
    const downloads = Object.fromEntries(
      (["scan", "blockRoots", "readPublic", "nullifierPublic"] as const).map((name) => {
        const d = stats.downloads[name];
        const r = requests.find((q, i) => stats.requests[i]!.path === `${ROUTES.blob}${d.digest}`);
        return [name, { size: d.size, bytes: d.bytes, ms: d.ms, cached: d.cached, serverMs: r?.server?.ms ?? null }];
      }),
    ) as WalletRun["downloads"];
    let path: PathRead | null = null;
    if (pathRead !== null) {
      const p = pathRead;
      const records = http.records.slice(p.records);
      const pathRequests = pairRequests(records, answeredAt.length >= syncAnswers + records.length ? answeredAt.slice(syncAnswers, syncAnswers + records.length) : null, serverLines, used);
      const calls = Math.max(1, p.stats.calls);
      const queried = pathRequests.filter((q) => q.route === ROUTES.queryPath);
      const serverMs = queried.length === 0 || queried.some((q) => q.server === null) ? null : queried.reduce((n, q) => n + q.server!.ms, 0) / calls;
      const blob = pathRequests.find((q, i) => records[i]!.path === `${ROUTES.blob}${p.stats.public.digest}`);
      path = {
        calls: p.stats.calls,
        bytesUp: p.stats.bytesUp / calls,
        bytesDown: p.stats.bytesDown / calls,
        roundTripMs: p.stats.roundTripMs / calls,
        clientBuildMs: p.stats.buildMs / calls,
        clientDecodeMs: p.stats.decodeMs / calls,
        serverMs,
        clientPeakRssBytes: self.peak(p.from, p.to),
        serverPeakRssBytes: server === null ? null : server.peak(p.from, p.to),
        paths: p.paths,
        public: { size: p.stats.public.size, bytes: p.stats.public.bytes, ms: p.stats.public.ms, cached: p.stats.public.cached, serverMs: blob?.server?.ms ?? null },
        ms: p.stats.ms,
        requests: pathRequests,
      };
    }
    return {
      label: w.label,
      source: w.source,
      coins: {
        found: coins.length,
        fromSnapshot: coins.filter((c) => c.source === "snapshot").length,
        fromTail: coins.filter((c) => c.source === "tail").length,
        spent: coins.filter((c) => c.spent !== null).length,
        unspent: coins.filter((c) => c.spent === null).length,
        rejected: result.state.rejected.length,
        tokenTypes: new Set(coins.map((c) => c.tokenType)).size,
      },
      scanMatches: stats.scan.matches,
      steps,
      attempts: stats.attempts,
      totalMs: stats.totalMs,
      computingMs: Math.max(0, stats.totalMs - requestMs),
      bytesUp: stats.bytesUp,
      bytesDown: stats.bytesDown,
      stateBytes,
      peakRssBytes: self.peak(from, to),
      manifest: stats.manifest,
      downloads,
      cacheBytes: stats.cacheBytes,
      scan: { ms: stats.scan.ms, entries: stats.scan.entries, threads: stats.scan.threads, microsPerOutput: stats.scan.entries > 0 ? (stats.scan.ms * 1000) / stats.scan.entries : 0 },
      read: callRow(stats.read, ROUTES.queryRead, "read"),
      decrypt: stats.decrypt,
      nullifier: { ...callRow(stats.nullifier, ROUTES.queryNullifier, "nullifier"), lookups: stats.nullifier.lookups },
      tail: { bytes: stats.tail.bytes, ms: stats.tail.ms, clientMs: stats.tail.clientMs, outputs: stats.tail.outputs, nullifiers: stats.tail.nullifiers, matches: stats.tail.matches, serverMs: serverMsOf(ROUTES.tail) },
      requests,
      path,
    };
  };
  const positions = [...coins.filter((c) => c.source === "snapshot").map((c) => c.position), ...result.state.rejected.map((r) => r.position)].filter((p) => p < manifest.firstFree);
  return { keys, cache, positions, paths: stats.requests.map((r) => r.path), finish };
}

/** The scan of `scanFile` at each thread count, after a warm-up of every worker. */
async function scanSweep(o: BenchOptions, module: WebAssembly.Module, scanFile: Uint8Array, secret: Uint8Array, self: MemoryProbe): Promise<ScanSweepRow[]> {
  const rows: ScanSweepRow[] = [];
  const entries = scanFile.length / 36;
  for (const threads of o.scanThreads) {
    const pool = new ScanPool({ threads, module });
    try {
      await pool.scan(scanFile.subarray(0, Math.min(scanFile.length, 36 * 64 * threads)), secret);
      self.mark();
      const from = Date.now();
      const started = performance.now();
      await pool.scan(scanFile, secret);
      const ms = performance.now() - started;
      self.mark();
      rows.push({
        threads,
        entries,
        ms,
        microsPerOutput: entries > 0 ? (ms * 1000) / entries : 0,
        microsPerOutputPerThread: entries > 0 ? (ms * 1000 * threads) / entries : 0,
        peakRssBytes: self.peak(from, Date.now()),
      });
      o.log(`scan sweep: ${threads} thread(s), ${entries} outputs in ${Math.round(ms)} ms`);
    } finally {
      await pool.close();
    }
  }
  return rows;
}

/** Each artifact's file under the module's data directory and its size on disk (null when it is not there). */
function onDisk(pssData: string, id: string, manifest: Manifest): Record<string, number> {
  const out: Record<string, number> = {};
  for (const [name, ref] of Object.entries(manifest.artifacts)) {
    const file = join(pssData, "snapshots", id, ref.digest);
    if (existsSync(file)) out[name] = statSync(file).size;
  }
  return out;
}

/** The naive baseline (FR-152): every output slot in full (256 bytes) and every nullifier entry (32 bytes). */
export function naiveOf(manifest: Manifest): BenchResults["naive"] {
  const outputs = slotCount(manifest);
  const nullifiers = manifest.artifacts.nullifierTable.records;
  return { outputs, nullifiers, outputBytes: outputs * 256, nullifierBytes: nullifiers * 32, totalBytes: outputs * 256 + nullifiers * 32 };
}

/**
 * The snapshot's tables from the manifest, with the bytes of one request and one response measured on the first call
 * the benchmark made to each: `(body − 40) / queriesPerCall`.
 */
function tableShapes(manifest: Manifest, wallets: readonly WalletRun[]): Record<BenchTableName, TableShape | null> {
  const a = manifest.artifacts;
  const q = manifest.queriesPerCall;
  const perQuery = (bytes: number | undefined): number | null => (bytes === undefined ? null : (bytes - 40) / q);
  const first = wallets[0];
  const shape = (ref: typeof a.readTable | undefined, publicRef: { size: number } | undefined, call: CallRow | null | undefined): TableShape | null =>
    ref === undefined || publicRef === undefined
      ? null
      : {
          records: ref.records,
          recordBytes: ref.recordBytes,
          groups: ref.groups,
          perGroup: ref.perGroup,
          rows: ref.layout.rows,
          cols: ref.layout.cols,
          tableBytes: ref.size,
          publicBytes: publicRef.size,
          requestBytes: call === null || call === undefined || call.calls === 0 ? null : perQuery(call.bytesUp),
          responseBytes: call === null || call === undefined || call.calls === 0 ? null : perQuery(call.bytesDown),
        };
  return {
    read: shape(a.readTable, a.readPublic, first?.read),
    path: shape(a.pathTable, a.pathPublic, wallets.find((w) => w.path !== null)?.path),
    nullifier: shape(a.nullifierTable, a.nullifierPublic, first?.nullifier),
  };
}

/** Runs the benchmark (see the module comment). */
export async function runBench(o: BenchOptions): Promise<BenchResults> {
  if (o.wallets.length === 0) throw new Error("the benchmark needs at least one wallet");
  const labels = new Set(o.wallets.map((w) => w.label));
  if (labels.size !== o.wallets.length) throw new Error("wallet labels must differ");
  for (const label of labels) if (!/^[A-Za-z0-9_-]+$/.test(label)) throw new Error(`a wallet label takes letters, digits, - and _: ${label}`);
  mkdirSync(o.workDir, { recursive: true });
  const startedAt = new Date();
  const loadStart = loadavg();
  const self = selfProbe();
  const notes: string[] = [...(o.notes ?? [])];
  try {
    const build = o.build === null ? null : await requestBuild(o);
    // The snapshot under test.
    const http = new PssHttp(o.server, { fetch: fetchOf(o) });
    const served = await http.manifest();
    const id = createHash("sha256").update(served.bytes).digest("hex");
    const manifest = decodeManifest(served.bytes);
    o.log(`snapshot ${id.slice(0, 16)}… at height ${manifest.height}: ${manifest.scheme}, ${manifest.firstFree} outputs${manifest.padding === undefined ? "" : ` padded to ${manifest.padding.size}`}, ${manifest.artifacts.nullifierTable.records} nullifier entries, k ${manifest.pathSplit}`);
    const scheme = o.scheme ?? o.build?.scheme;
    if (scheme !== undefined && manifest.scheme !== scheme) throw new Error(`the served snapshot uses ${manifest.scheme}, not ${scheme}`);
    // The bytes each served table says it holds, from the module's status (a module without the field gives nulls).
    let heldBytes: BenchResults["server"]["heldBytes"] = null;
    const secret = o.build?.adminSecret ?? o.adminSecret;
    if (secret !== undefined) {
      try {
        const current = (await adminStatus(o, secret)).current as { id?: string; heldBytes?: Partial<Record<BenchTableName, number | null>> } | null;
        if (current?.id !== id) notes.push(`The module's status names another snapshot (${String(current?.id).slice(0, 16)}…) than the manifest: the bytes its tables hold were not recorded.`);
        else heldBytes = Object.fromEntries(TABLE_NAMES.map((t) => [t, typeof current.heldBytes?.[t] === "number" ? current.heldBytes[t] : null])) as Record<BenchTableName, number | null>;
      } catch (error) {
        notes.push(`The module's status could not be read: ${error instanceof Error ? error.message : String(error)}`);
      }
    }
    let serverBuild: BenchResults["serverBuild"] = null;
    const statsFile = o.pssData === null ? null : join(o.pssData, "snapshots", id, "build-stats.json");
    if (statsFile !== null && existsSync(statsFile)) serverBuild = serverBuildFromStats(statsFile);
    else if (statsFile !== null) notes.push(`No build-stats.json for the served snapshot under ${o.pssData}.`);

    // The wallets, each as a fresh client.
    const module = compileKernel();
    const kernel = new Kernel(module);
    const runs: WalletOutcome[] = [];
    for (const w of o.wallets) {
      o.log(`wallet ${w.label}: sync`);
      runs.push(await runWallet(o, w, kernel, module, manifest, id, self));
      (globalThis as { gc?: () => void }).gc?.();
    }

    // The scan at each thread count, on the first wallet's key.
    const first = runs[0]!;
    const scanRows = await scanSweep(o, module, first.cache.read(manifest.artifacts.scan), first.keys.scanSecret, self);

    // The database: its size, the snapshot's events, the read table at each k (FR-153).
    let chainDatabase: ChainSync["database"] = null;
    let cursor: number | null = null;
    let readEvents: EventRead | null = null;
    let splits: PathSplitRun[] = [];
    if (o.db !== null) {
      const query = (sql: string, params?: unknown[]) => o.db!.query(sql, params);
      chainDatabase = await databaseSize(query);
      cursor = await cursorOf(query);
      o.log(`reading the stored events up to ${manifest.height}`);
      const events = await readSnapshotEvents(o.db, manifest.height, self);
      readEvents = events.read;
      o.log(`read ${events.read.rows} rows in ${Math.round(events.read.ms)} ms`);
      const threads = o.buildThreads ?? serverBuild?.threads ?? 4;
      splits = await pathSplitRuns({
        events,
        manifest,
        servedId: id,
        ks: o.pathSplits,
        threads,
        clientThreads: o.clientThreads,
        workDir: join(o.workDir, "builds"),
        positions: first.positions,
        probe: self,
        log: o.log,
        ...walletSchemeOptions(o),
      });
    } else {
      notes.push("No database was given: the chain sync's size, the event read and the pathSplit builds (FR-153) were not measured.");
    }
    if (serverBuild === null) {
      const own = splits.find((s) => s.k === manifest.pathSplit);
      if (own !== undefined) {
        serverBuild = {
          source: `the benchmark's in-process build with the module's builder at k = ${own.k}, ${own.threads} threads (no build-stats.json)`,
          totalMs: own.buildMs,
          threads: own.threads,
          steps: own.steps,
          indexLoad: null,
          indexSlice: null,
        };
      }
    }

    // The server's view of each wallet's requests (FR-154).
    let serverLines: ServerRequestLine[] = [];
    let logSource = "not available (no server log given)";
    if (o.serverLog !== null) {
      try {
        serverLines = parseServerLines(await o.serverLog.lines(new Date(startedAt.getTime() - 60_000)));
        logSource = o.serverLog.source;
      } catch (error) {
        logSource = `${o.serverLog.source}: ${error instanceof Error ? error.message : String(error)}`;
      }
    }
    const used = new Set<ServerRequestLine>();
    const wallets = runs.map((r) => r.finish(serverLines, used));
    const all = wallets.flatMap((w) => [...w.requests, ...(w.path?.requests ?? [])]);
    const matched = all.filter((q) => q.server !== null).length;
    if (o.serverLog !== null) logSource = `${logSource}; ${matched} of ${all.length} requests paired with a server line`;

    // Status records: modules and versions.
    let serverModules: BenchResults["software"]["serverModules"] = null;
    if (o.statusUrl !== null) {
      try {
        const status = (await (await fetchOf(o)(o.statusUrl, { method: "GET" })).json()) as { modules?: { id: string; version: string }[] };
        serverModules = (status.modules ?? []).map((m) => ({ id: m.id, version: m.version }));
      } catch (error) {
        notes.push(`The admin status could not be read: ${error instanceof Error ? error.message : String(error)}`);
      }
    }

    // FR-142 on the benchmark's own syncs: method, path (an artifact's digest included) and body length, in order.
    const shapes = runs.map((r, i) => JSON.stringify(wallets[i]!.requests.map((q, j) => [q.method, r.paths[j], q.bodyBytes])));
    const repo = repositoryVersion();
    const statsMachine = o.pssData === null || statsFile === null || !existsSync(statsFile) ? null : ((JSON.parse(readFileSync(statsFile, "utf8")) as { machine?: Record<string, unknown> }).machine ?? null);
    const results: BenchResults = {
      kind: "private-shielded-sync bench",
      format: RESULTS_FORMAT,
      startedAt: startedAt.toISOString(),
      finishedAt: new Date().toISOString(),
      loadAverage: { start: loadStart.map((x) => Math.round(x * 100) / 100), end: loadavg().map((x) => Math.round(x * 100) / 100) },
      machine: machine(),
      software: {
        umbradb: repo.version,
        commit: repo.commit,
        kernelDigest: committedKernelDigest(),
        ledger: o.ledgerName,
        serverModules,
        serverMachine: statsMachine,
      },
      network: manifest.network,
      server: {
        origin: new URL(o.server).origin,
        memory: o.serverMemory?.method ?? "not sampled (give --server-container or --server-pid)",
        log: logSource,
        threads: serverBuild?.threads ?? null,
        heldBytes,
      },
      build,
      snapshot: {
        id,
        height: manifest.height,
        blockHash: manifest.blockHash,
        outputs: manifest.firstFree,
        nullifiers: manifest.artifacts.nullifierTable.records,
        pathSplit: manifest.pathSplit,
        queriesPerCall: manifest.queriesPerCall,
        blocks: manifest.artifacts.blockRoots.blocks,
        artifacts: Object.fromEntries(Object.entries(manifest.artifacts).map(([name, ref]) => [name, ref.size])),
        onDisk: o.pssData === null ? null : onDisk(o.pssData, id, manifest),
        scheme: manifest.scheme,
        pir: { ...manifest.pir },
        padding: manifest.padding?.size ?? null,
        tables: tableShapes(manifest, wallets),
        builtByBench: o.build !== null,
      },
      chainSync: {
        database: chainDatabase,
        cursor,
        rate: o.syncRecords === null ? null : syncRate(o.syncRecords.samples),
        runs: o.syncRecords?.runs ?? null,
        modules: serverModules?.map((m) => m.id) ?? null,
      },
      serverBuild,
      readEvents,
      wallets,
      scanSweep: scanRows,
      pathSplits: splits,
      naive: naiveOf(manifest),
      requestShapesIdentical: shapes.length < 2 ? null : shapes.every((s) => s === shapes[0]),
      transfer: o.transfer === null ? null : transferRow(o.transfer.record, o.transfer.source),
      notes,
    };
    return results;
  } finally {
    await self.stop();
    await o.serverMemory?.stop();
  }
}
