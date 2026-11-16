/**
 * The benchmark (`bench/`, spec FR-150–154, story 6, SC-005) against the module in UmbraDB's real process on
 * PostgreSQL 18, over the synthetic chain of real v9 transactions (`./server-chain.ts`; snapshot at 4 while following,
 * tail to 7), with the wallets A and B of the chain and C, a generated wallet that received nothing.
 *
 * The server runs in this process, so its memory is this process's and its request lines are the module's log
 * lines as it hands them over. The sync's status samples are taken from the process handle while it syncs, as
 * `run/sync.mjs record` takes them from the admin route. The transfer row reads a record in the format `send` writes
 * (`client/main.ts`), with the timings of the transfer spike's run on Preprod: the benchmark reads the record, it does
 * not transfer.
 *
 * Both PIR schemes (spec 00058 FR-050): the snapshot built at the start is SimplePIR's; the benchmark then asks the
 * server for a SimplePIR and an IPIR+SP snapshot at one height and measures both, and `compare` puts them side by side.
 */

import { execFile } from "node:child_process";
import { existsSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { promisify } from "node:util";
import postgres from "postgres";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { RAW } from "../../../test/ledger/adapter-fixtures.js";
import { PROCESS_BACKENDS, type ProcessDatabase } from "../../../test/runner/process-backends.js";
import { keysFromZswapSeed } from "../client/keys.ts";
import type { Ledger } from "../client/ledger.ts";
import { compileKernel, Kernel } from "../kernel/index.ts";
import { compileIpirWasm } from "../ipir/wallet-node.ts";
import { ipirMasksBytes, ipirRequestBytes, ipirResponseBytes } from "../ipir/sizes.ts";
import { ROUTES, toHex } from "../shared/index.ts";
import { parseStatusSamples, readSyncRecords, syncRate } from "../bench/bench-chain.ts";
import { compareRuns, renderComparison } from "../bench/bench-compare.ts";
import { parseDockerMemory, selfProbe } from "../bench/bench-probes.ts";
import { COLUMNS, fmtBytes, fmtMs, missingCells, renderReport, section8 } from "../bench/bench-report.ts";
import type { BenchResults } from "../bench/bench-results.ts";
import { type BenchOptions, type BenchWallet, runBench, transferRow } from "../bench/bench-run.ts";
import { pairRequests, parseServerLines } from "../bench/bench-server-log.ts";
import type { Reader } from "../bench/bench-splits.ts";
import { ADMIN_SECRET, builtAt, type ModuleRun, startModule, stoppedAt } from "./client-harness.ts";
import { type ScenarioChain, scenarioChain } from "./server-chain.ts";

const LONG = 600_000;
const backend = PROCESS_BACKENDS.find((candidate) => candidate.kind === "postgres")!;
const ledger = RAW.v9 as unknown as Ledger;
const SEEDS = { A: new Uint8Array(32).fill(0xa1), B: new Uint8Array(32).fill(0xb2), C: new Uint8Array(32).fill(0xc3) };
const run = promisify(execFile);
const BENCH = fileURLToPath(new URL("../bench/bench.ts", import.meta.url));
const installed = existsSync(new URL("../client/node_modules/@midnightntwrk/ledger-v9/package.json", import.meta.url));

/** A record as `send` writes it (format of `client/main.ts`), with spike E3's timings on Preprod. */
const TRANSFER_RECORD = {
  startedAt: "2026-11-13T05:33:21.639Z",
  wallet: "A",
  network: "preprod",
  token: "ccfdc19774aea0e419bc53a6e65e0d13792e858dde64c7383ca4586aebb96975",
  amount: "400000000",
  recipient: "mn_shield-addr_preprod1example",
  timings: { feeWalletSyncMs: 827_000, syncMs: 1_500, pathMs: 8, stateMs: 33, spendMs: 8, balanceMs: 940, signMs: 2, proveMs: 11_900, validateMs: 500, toInBlockMs: 1_600, toFinalizedMs: 14_400 },
  coin: { position: 69_250, value: "1000000000", source: "snapshot", lowerPathFromPir: true },
  unprovenBytes: 9_870,
  transaction: {
    txHash: "12c0a806f7bf7df908a01e1216289220afa0eca9370d9a00b38228257eb48e7c",
    identifiers: [],
    bytes: 18_526,
    validation: "ok",
    finalized: { blockHash: "0xd6869394", blockHeight: 3_399_948 },
    inBlock: { blockHash: "0xd6869394", blockHeight: 3_399_948 },
    timings: { balanceMs: 940, signMs: 2, proveMs: 11_900, validateMs: 500, toInBlockMs: 1_600, toFinalizedMs: 14_400 },
  },
  finishedAt: "2026-11-13T05:48:00.000Z",
  peakRssBytes: 812_000_000,
};

let chain: ScenarioChain;
let db: ProcessDatabase;
let sql: ReturnType<typeof postgres>;
let reader: Reader;
let r: ModuleRun;
let dir: string;
let syncDir: string;

const wallets = (...names: (keyof typeof SEEDS)[]): BenchWallet[] => names.map((n) => ({ label: n, source: "seed", zswapSeed: SEEDS[n] }));

function options(over: Partial<BenchOptions> = {}): BenchOptions {
  const { serverMemory = selfProbe(), ...rest } = over;
  return {
    server: r.origin,
    ledger,
    ledgerName: "vendored v9 (ledger-9.1.0.1)",
    wallets: wallets("A", "B", "C"),
    workDir: mkdtempSync(join(dir, "work-")),
    clientThreads: 2,
    scanThreads: [1, 2],
    pathSplits: [16, 8, 2, 0],
    buildThreads: 2,
    db: reader,
    pssData: join(dir, "server"),
    syncRecords: readSyncRecords(syncDir),
    statusUrl: null,
    serverLog: { source: "the module's log lines (in-process)", lines: async () => [...r.logs] },
    serverMemory,
    build: null,
    adminSecret: ADMIN_SECRET,
    ipirWasm: () => compileIpirWasm(),
    transfer: { record: TRANSFER_RECORD, source: "a record in send's format" },
    log: () => {},
    ...rest,
  };
}

beforeAll(async () => {
  chain = await scenarioChain();
  dir = mkdtempSync(join(tmpdir(), "pss-bench-"));
  syncDir = join(dir, "sync");
  mkdirSync(syncDir);
  await backend.start();
  db = await backend.database();
  const s = db.setting as { host: string; port: number; user: string; name: string; password?: string };
  sql = postgres({ host: s.host, port: s.port, user: s.user, database: s.name, password: s.password ?? "", max: 1, onnotice: () => {}, types: { bigint: postgres.BigInt } });
  reader = { query: async (q, params) => [...(await sql.unsafe(q, (params ?? []) as never[]))] as Record<string, unknown>[] };
  r = await startModule(chain, db, {
    stop: 7,
    config: { dataDir: join(dir, "server"), pathSplit: 2, queriesPerCall: 16, snapshotEvery: 4, adminSecret: ADMIN_SECRET, threads: 2 },
  });
  // The sync's status samples, as `run/sync.mjs record` writes them from the admin route.
  const lines: string[] = [];
  let last = "";
  const sample = (): void => {
    const status = r.handle.status();
    const line = { state: status.state, cursor: status.cursor === null ? null : String(status.cursor), head: status.head === null ? null : String(status.head) };
    if (JSON.stringify(line) !== last) {
      lines.push(JSON.stringify({ at: Date.now(), ...line }));
      last = JSON.stringify(line);
    }
  };
  const timer = setInterval(sample, 5);
  try {
    await stoppedAt(r, 7);
  } finally {
    clearInterval(timer);
    sample();
  }
  writeFileSync(join(syncDir, "status.jsonl"), `${lines.join("\n")}\n`);
  writeFileSync(join(syncDir, "runs.jsonl"), `${JSON.stringify({ label: "test", startedAt: new Date().toISOString() })}\n`);
  await builtAt(r, 4);
}, LONG);

afterAll(async () => {
  await r?.close();
  await sql?.end();
  await backend.stop();
  if (dir !== undefined) rmSync(dir, { recursive: true, force: true });
}, LONG);

describe("the benchmark on the synthetic chain (snapshot at 4, tail to 7)", () => {
  let results: BenchResults;

  beforeAll(async () => {
    results = await runBench(options());
  }, LONG);

  it("SC-005 shape: every cell of spec §8 has a value, for the server and for each wallet's client, and the report says so", () => {
    expect(missingCells(results)).toEqual([]);
    const rows = section8(results);
    const parts = new Set(rows.map((x) => x.part));
    for (const part of [
      "Chain sync (core modules)",
      "Read events for a snapshot",
      "Build scan file",
      "Build tree and paths",
      "Build read table and setup data",
      "Build path table and setup data",
      "Build nullifier table and setup data",
      "Download scan file, block roots, setup data",
      "Scan",
      "Read coins (one call)",
      "Nullifier lookups (one call)",
      "Lower paths to spend (one call)",
      "Tail",
      "Whole `sync`",
      "Transfer",
    ]) {
      expect(parts.has(part), part).toBe(true);
    }
    // Each wallet's client has its own rows; the PIR calls have a server row per wallet's call.
    for (const w of ["A", "B", "C"]) {
      expect(rows.filter((x) => x.side === `client ${w}`).map((x) => x.part)).toEqual([
        "Download scan file, block roots, setup data",
        "Scan",
        "Read coins (one call)",
        "Nullifier lookups (one call)",
        "Lower paths to spend (one call)",
        "Tail",
        "Whole `sync`",
        // The transfer record names its sender, A.
        ...(w === "A" ? ["Transfer"] : []),
      ]);
      expect(rows.filter((x) => x.side === `server (${w}'s call)`).map((x) => x.part)).toEqual(["Read coins (one call)", "Nullifier lookups (one call)", "Lower paths to spend (one call)"]);
    }
    // The spec's "—" cells stay empty, every other cell has text.
    const chainRow = rows.find((x) => x.part === "Chain sync (core modules)")!;
    expect([chainRow.cells.memory.kind, chainRow.cells.inFlight.kind]).toEqual(["na", "na"]);
    for (const x of rows) for (const c of COLUMNS) if (x.cells[c].kind === "value") expect((x.cells[c] as { text: string }).text).not.toContain("?");
    const report = renderReport(results);
    expect(report).toContain("Every cell of the table has a value.");
    expect(report).not.toContain("not measured");
  });

  it("FR-150: the snapshot, its counts, the machine and the software versions", () => {
    expect(results.network).toBe("custom");
    expect(results.snapshot).toMatchObject({ height: 4, outputs: 9, nullifiers: 1, pathSplit: 2, queriesPerCall: 16, builtByBench: false });
    expect(results.machine.cores).toBeGreaterThan(0);
    expect(results.machine.node).toBe(process.version);
    expect(results.software.umbradb).toMatch(/^\d+\.\d+\.\d+/);
    expect(results.software.kernelDigest).toMatch(/^[0-9a-f]{64}$/);
    expect(results.serverBuild!.source).toContain("build-stats.json");
    // The read table's setup step writes its public artifact (SimplePIR: the setup data, `readPublic` since 00058).
    expect(results.serverBuild!.steps.readSetup!.bytes).toBe(results.snapshot.artifacts.readPublic);
    expect(results.snapshot.scheme).toBe("simplepir");
    expect(results.readEvents).toMatchObject({ rows: 9 + 1, height: 4 });
    expect(results.chainSync.database!.bytes).toBeGreaterThan(0);
    expect(results.chainSync.database!.schemas.map((s) => s.schema)).toContain("core_ledger_state");
    expect(results.chainSync.cursor).toBe(7);
    expect(results.chainSync.rate!.toHeight).toBeGreaterThan(results.chainSync.rate!.fromHeight);
    expect(results.chainSync.rate!.toHeight).toBeLessThanOrEqual(7);
    expect(results.chainSync.rate!.heightsPerSecond).toBeGreaterThan(0);
    expect(results.chainSync.runs).toBe(1);
    // 00058: the tables described without a scheme's words; what each served table holds, from the module's status.
    const t = results.snapshot.tables;
    expect(results.snapshot.padding).toBeNull();
    expect(t.read).toMatchObject({ records: 9, recordBytes: 98, groups: t.read!.cols, requestBytes: t.read!.cols * 4, responseBytes: t.read!.rows * 4, publicBytes: results.snapshot.artifacts.readPublic });
    expect(t.path).toMatchObject({ recordBytes: 64, requestBytes: t.path!.cols * 4, responseBytes: t.path!.rows * 4 });
    expect(results.server.heldBytes).toEqual({ read: 2 * t.read!.rows * t.read!.cols, path: 2 * t.path!.rows * t.path!.cols, nullifier: 2 * t.nullifier!.rows * t.nullifier!.cols });
    expect(results.snapshot.onDisk).toEqual(results.snapshot.artifacts);
    expect(results.build).toBeNull();
  });

  it("FR-151: each wallet's sync is measured step by step for the client, and the PIR calls on the server from its own log lines", () => {
    const byLabel = Object.fromEntries(results.wallets.map((w) => [w.label, w]));
    expect([byLabel.A!.coins.found, byLabel.B!.coins.found, byLabel.C!.coins.found]).toEqual([9, 5, 0]);
    for (const w of results.wallets) {
      expect(w.read.calls).toBe(1);
      expect(w.nullifier.calls).toBe(1);
      // A call is exactly queriesPerCall × C (up) and × R (down) values plus the 40-byte header: the served table's,
      // which the in-process build at the served k reproduces.
      const served = results.pathSplits.find((p) => p.k === results.snapshot.pathSplit)!;
      expect([w.read.bytesUp, w.read.bytesDown]).toEqual([40 + 16 * served.cols * 4, 40 + 16 * served.rows * 4]);
      expect(w.read.serverMs).not.toBeNull();
      expect(w.nullifier.serverMs).not.toBeNull();
      expect(w.read.clientPeakRssBytes).toBeGreaterThan(0);
      expect(w.read.serverPeakRssBytes).toBeGreaterThan(0);
      expect(Object.values(w.downloads).every((d) => !d.cached && d.bytes === d.size && d.serverMs !== null)).toBe(true);
      expect(w.cacheBytes).toBe(Object.values(w.downloads).reduce((n, d) => n + d.size, 0));
      expect(w.tail.outputs).toBe(15 - 9);
      expect(w.tail.serverMs).not.toBeNull();
      expect(w.stateBytes).toBeGreaterThan(0);
      expect(w.computingMs).toBeLessThanOrEqual(w.totalMs);
      expect(w.bytesDown).toBe(w.requests.reduce((n, q) => n + q.answerBytes, 0));
      // The path read after the sync: its public artifact and one call of the path table's size, the server's time
      // from its log line.
      const path = results.snapshot.tables.path!;
      expect(w.path).toMatchObject({ calls: 1, bytesUp: 40 + 16 * path.cols * 4, bytesDown: 40 + 16 * path.rows * 4 });
      expect(w.path!.public).toMatchObject({ size: path.publicBytes, bytes: path.publicBytes, cached: false });
      expect(w.path!.serverMs).not.toBeNull();
      expect(w.path!.requests.map((q) => `${q.method} ${q.route}`)).toEqual([`GET ${ROUTES.blob}<digest>`, `POST ${ROUTES.queryPath}`]);
    }
    // A holds coins in blocks full at the snapshot; C holds none, and still sends one full call.
    expect(byLabel.A!.path!.paths).toBeGreaterThan(0);
    expect(byLabel.C!.path!.paths).toBe(0);
    // 8 requests of each sync, and the path read's 2 (its public artifact, its call).
    expect(results.server.log).toContain("30 of 30 requests paired");
  });

  it("FR-152: the naive baseline is every output in full (256 bytes) and every nullifier (32 bytes) of the snapshot", () => {
    expect(results.naive).toEqual({ outputs: 9, nullifiers: 1, outputBytes: 9 * 256, nullifierBytes: 32, totalBytes: 9 * 256 + 32 });
    expect(renderReport(results)).toContain(`9 × 256 B + 1 × 32 B = **${fmtBytes(9 * 256 + 32)}**`);
  });

  it("FR-153: the read and path tables at k = 16, 8 and 0 (and the served 2) from the module's builder in-process; at the served k it gives the served snapshot", () => {
    expect(results.pathSplits.map((p) => p.k)).toEqual([16, 8, 2, 0]);
    for (const p of results.pathSplits) {
      // Q58: the read record is 98 bytes at every k; the path table holds the k lower hashes (none at k = 0).
      expect(p.recordBytes).toBe(98);
      expect(p.path === null ? 0 : p.path.recordBytes).toBe(32 * p.k);
      expect(p.path === null).toBe(p.k === 0);
      expect(p.sizes.blockRoots).toBe(32 * p.blocks);
      expect(p.call.bytesUp).toBe(40 + 16 * p.cols * 4);
      expect(p.call.bytesDown).toBe(40 + 16 * p.rows * 4);
      expect(p.call.recordsChecked).toBeGreaterThan(0);
      expect(p.steps.tree!.hashes).toBeGreaterThanOrEqual(0);
      if (p.path !== null) {
        expect([p.steps.pathTable, p.steps.pathSetup].every((x) => x !== null)).toBe(true);
        if (p.path.call !== null) {
          expect(p.path.call.bytesUp).toBe(40 + 16 * p.path.cols * 4);
          expect(p.path.call.recordsChecked).toBeGreaterThan(0);
        }
      } else expect([p.steps.pathTable, p.steps.pathSetup]).toEqual([null, null]);
    }
    expect(results.pathSplits.map((p) => p.blocks)).toEqual([1, 1, 3, 9]);
    expect(results.pathSplits.find((p) => p.k === 2)).toMatchObject({ sameAsServed: true, snapshotId: results.snapshot.id });
    expect(results.pathSplits.filter((p) => p.k !== 2).every((p) => p.sameAsServed === null)).toBe(true);
    const report = renderReport(results);
    expect(report).toContain("## The read and path tables at each `pathSplit` (FR-153, Q58)");
    expect(report).toContain("yes (same identifier)");
  });

  it("FR-154 + FR-142: the report lists every request each wallet made with the server's line for it, and their shapes are identical", () => {
    expect(results.requestShapesIdentical).toBe(true);
    const expected = [
      `GET ${ROUTES.manifest}`,
      `GET ${ROUTES.blob}<digest>`,
      `GET ${ROUTES.blob}<digest>`,
      `GET ${ROUTES.blob}<digest>`,
      `GET ${ROUTES.blob}<digest>`,
      `POST ${ROUTES.queryRead}`,
      `POST ${ROUTES.queryNullifier}`,
      `GET ${ROUTES.tail}`,
    ];
    for (const w of results.wallets) {
      expect(w.requests.map((q) => `${q.method} ${q.route}`)).toEqual(expected);
      for (const q of w.requests) {
        expect(q.server, `${w.label} ${q.route}`).not.toBeNull();
        expect(q.server!.status).toBe(q.status);
        expect(q.server!.bodyBytes).toBe(q.bodyBytes);
        expect(q.server!.answerBytes).toBe(q.answerBytes);
      }
    }
    const report = renderReport(results);
    expect(report).toContain("are **identical** for A, B, C");
    expect(report).toContain(`| \`POST ${ROUTES.queryRead}\` | 3 |`);
  });

  it("the scan by thread count, and the transfer row from send's record", () => {
    expect(results.scanSweep.map((s) => [s.threads, s.entries])).toEqual([[1, 9], [2, 9]]);
    expect(results.transfer).toMatchObject({ wallet: "A", submitted: true, block: 3_399_948, bytesSubmitted: 18_526, peakRssBytes: 812_000_000 });
    const transfer = section8(results).find((x) => x.part === "Transfer")!;
    expect(transfer.side).toBe("client A");
    expect((transfer.cells.computing as { text: string }).text).toBe(`path ${fmtMs(8)}, state ${fmtMs(33)} (+ spend ${fmtMs(8)}), proving ${fmtMs(11_900)}, Dust balancing ${fmtMs(940)}, to finality ${fmtMs(14_400)}`);
  });

  it("a dry-run record of send (no transaction) fills what it ran and says the rest did not run", () => {
    // `send --dry-run` stops before the fee wallet: no transaction, and only the timings of the steps it ran.
    const { transaction: _dropped, ...rest } = TRANSFER_RECORD;
    const dry = { ...rest, timings: { syncMs: 350, pathMs: 8, stateMs: 33, spendMs: 8 } };
    const row = section8({ ...results, transfer: transferRow(dry, "a dry run") }).find((x) => x.part === "Transfer")!;
    expect(row.cells.memory).toEqual({ kind: "value", text: fmtBytes(812_000_000) });
    expect(row.cells.inFlight).toEqual({ kind: "missing", why: "not run (the record is a dry run)" });
    expect(row.cells.computing).toEqual({ kind: "missing", why: "not run (the record is a dry run)" });
  });

  it("results.json holds no key, seed, public key, nullifier or commitment of any wallet, and renders the same report after a round trip", () => {
    const text = JSON.stringify(results);
    const kernel = new Kernel(compileKernel());
    const secrets: string[] = [];
    for (const seed of Object.values(SEEDS)) {
      const keys = keysFromZswapSeed(ledger, seed, kernel);
      secrets.push(toHex(seed), toHex(keys.scanSecret), toHex(keys.coinPublicKey), toHex(keys.encryptionPublicKey));
    }
    for (const w of Object.values(chain.wallets)) for (const c of w.local.coins) secrets.push(c.nonce);
    for (const s of chain.spends) secrets.push(s.nullifier);
    for (const secret of secrets) expect(text.includes(secret.slice(0, 16)), secret.slice(0, 8)).toBe(false);
    const again = JSON.parse(JSON.stringify(results)) as BenchResults;
    expect(renderReport(again)).toBe(renderReport(results));
  });
});

describe("without the optional inputs, each cell says why it has no value", () => {
  it("one wallet, no database, statistics, logs, memory, sync records or transfer: exactly those cells are missing, and the report renders", { timeout: LONG }, async () => {
    const results = await runBench(
      options({ wallets: wallets("C"), db: null, pathSplits: [], pssData: null, syncRecords: null, serverLog: null, serverMemory: null, transfer: null, scanThreads: [1] }),
    );
    const gaps = missingCells(results).map((g) => `${g.part} / ${g.side} / ${g.column}`);
    expect(gaps.sort()).toEqual(
      [
        "Chain sync (core modules) / server / storage",
        "Chain sync (core modules) / server / computing",
        "Read events for a snapshot / server / memory",
        "Read events for a snapshot / server / computing",
        ...["Build scan file", "Build tree and paths", "Build read table and setup data", "Build path table and setup data", "Build nullifier table and setup data"].flatMap((p) => [`${p} / server / storage`, `${p} / server / memory`, `${p} / server / computing`]),
        "Read coins (one call) / server (C's call) / memory",
        "Read coins (one call) / server (C's call) / computing",
        "Nullifier lookups (one call) / server (C's call) / memory",
        "Nullifier lookups (one call) / server (C's call) / computing",
        "Lower paths to spend (one call) / server (C's call) / memory",
        "Lower paths to spend (one call) / server (C's call) / computing",
        "Transfer / client / memory",
        "Transfer / client / inFlight",
        "Transfer / client / computing",
      ].sort(),
    );
    const report = renderReport(results);
    expect(report).toContain("**not measured:** not run (no transfer record given: --transfer)");
    expect(report).toContain(`**${gaps.length} cells without a value:**`);
    expect(results.requestShapesIdentical).toBeNull();
    expect(results.pathSplits).toEqual([]);
  });

});

describe("parts of the benchmark", () => {
  it("docker stats lines, the module's log lines (plain and with a docker logs prefix), and pairing by route, status and time", () => {
    expect(parseDockerMemory("\u001b[J\u001b[H754.4MiB / 30.06GiB\u001b[K")).toBe(Math.round(754.4 * 1024 * 1024));
    expect(parseDockerMemory("1.5GiB / 30GiB")).toBe(Math.round(1.5 * 1024 ** 3));
    expect(parseDockerMemory("\u001b[K")).toBeNull();
    const plain = '{"pss":true,"at":"2026-11-13T08:09:00.099Z","event":"request","route":"POST /pss/v1/query/read","status":200,"bodyBytes":74536,"answerBytes":80296,"range":null,"ms":1.267}';
    const docker = `2026-11-13T08:09:00.137443585Z {"pss":true,"at":"2026-11-13T08:09:00.137Z","event":"request","route":"GET /pss/v1/blob/:digest","status":200,"bodyBytes":0,"answerBytes":20952,"range":"bytes=0-","ms":0.5}`;
    const other = '2026-11-13T08:46:58.525050085Z stopping (signal: SIGTERM): height 230972 is in progress';
    const built = '{"pss":true,"at":"2026-11-13T08:09:01.000Z","event":"build-done","height":7}';
    const lines = parseServerLines([docker, other, plain, built, "not json {", ""]);
    expect(lines.map((l) => [l.route, l.ms])).toEqual([
      ["POST /pss/v1/query/read", 1.267],
      ["GET /pss/v1/blob/:digest", 0.5],
    ]);
    const t = Date.parse("2026-11-13T08:09:00.100Z");
    const records = [
      { method: "POST" as const, path: ROUTES.queryRead, bodyBytes: 74536, status: 200, answerBytes: 80296, ms: 3 },
      { method: "GET" as const, path: `${ROUTES.blob}${"ab".repeat(32)}`, bodyBytes: 0, status: 200, answerBytes: 20952, ms: 2 },
      { method: "GET" as const, path: ROUTES.tail, bodyBytes: 0, status: 200, answerBytes: 10, ms: 1 },
    ];
    const used = new Set<(typeof lines)[number]>();
    const paired = pairRequests(records, [t, t + 40, t + 50], lines, used);
    expect(paired.map((p) => [p.route, p.server?.ms ?? null, p.server?.range ?? null])).toEqual([
      [ROUTES.queryRead, 1.267, null],
      [`${ROUTES.blob}<digest>`, 0.5, "bytes=0-"],
      [ROUTES.tail, null, null],
    ]);
    // A line is used once; without the answer times nothing is paired.
    expect(pairRequests(records, [t, t + 40, t + 50], lines, used).every((p) => p.server === null)).toBe(true);
    expect(pairRequests(records, null, lines, new Set()).every((p) => p.server === null)).toBe(true);
    // Two artifacts fetched 2 ms apart: the first answer arrived nearer the second's line; the lengths decide.
    const blob = (at: string, answerBytes: number) =>
      `{"pss":true,"at":"${at}","event":"request","route":"GET /pss/v1/blob/:digest","status":200,"bodyBytes":0,"answerBytes":${answerBytes},"range":null,"ms":0.1}`;
    const two = parseServerLines([blob("2026-11-13T08:10:00.000Z", 324), blob("2026-11-13T08:10:00.004Z", 96)]);
    const fetched = [
      { method: "GET" as const, path: `${ROUTES.blob}${"01".repeat(32)}`, bodyBytes: 0, status: 200, answerBytes: 324, ms: 3 },
      { method: "GET" as const, path: `${ROUTES.blob}${"02".repeat(32)}`, bodyBytes: 0, status: 200, answerBytes: 96, ms: 1 },
    ];
    const at = Date.parse("2026-11-13T08:10:00.003Z");
    expect(pairRequests(fetched, [at, at + 2], two, new Set()).map((p) => p.server?.answerBytes)).toEqual([324, 96]);
  });

  it("heights per second from status samples: gaps (restarts) left out, following the head left out while there is syncing, windows by height", () => {
    const samples = parseStatusSamples(
      [
        { at: 0, state: "syncing", cursor: "0" },
        { at: 1000, state: "syncing", cursor: "100" },
        { at: 2000, state: "syncing", cursor: "300" },
        { at: 200_000, state: "syncing", cursor: "300" }, // a restart: 198 s apart
        { at: 201_000, state: "syncing", cursor: "400" },
        { at: 207_000, state: "following", cursor: "401" },
        { at: 213_000, state: "following", cursor: "402" },
        { at: 214_000, state: "syncing", cursor: null },
      ]
        .map((x) => JSON.stringify(x))
        .join("\n"),
    );
    expect(samples).toHaveLength(7);
    const rate = syncRate(samples, { windows: 4 })!;
    // Syncing pairs only: 100 + 200 + 100 heights in 3 s; the following pairs (and the 198 s gap) are left out.
    expect(rate).toMatchObject({ heights: 400, seconds: 3, heightsPerSecond: 400 / 3, fromHeight: 0, toHeight: 400, gaps: 1, samples: 7 });
    expect(rate.windows.map((w) => [w.fromHeight, Math.round(w.heightsPerSecond)])).toEqual([
      [0, 100],
      [100, 200],
      [300, 100],
    ]);
    // Only following: its own pace.
    expect(syncRate(samples.slice(4))!.heightsPerSecond).toBeCloseTo(2 / 12, 5);
    expect(syncRate([])).toBeNull();
  });

  it("formatting", () => {
    expect([fmtBytes(32), fmtBytes(2048), fmtBytes(5 * 1024 ** 2), fmtBytes(1.25 * 1024 ** 3)]).toEqual(["32 B", "2.00 KiB", "5.00 MiB", "1.25 GiB"]);
    expect([fmtMs(0.5), fmtMs(5.25), fmtMs(250), fmtMs(12_340), fmtMs(125_000), fmtMs(5.5 * 3_600_000)]).toEqual(["0.50 ms", "5.3 ms", "250 ms", "12.34 s", "2 min 5 s", "5.50 h"]);
  });
});

describe.skipIf(!installed)("the command line (with the client's install)", () => {
  it("bench.ts run against the server, with its process's memory sampled by ps, then bench.ts report adds a transfer record", { timeout: LONG }, async () => {
    const out = join(dir, "cli-results");
    const seed = join(dir, "a.seed");
    writeFileSync(seed, toHex(SEEDS.A), { mode: 0o600 });
    const s = db.setting as { host: string; port: number; user: string; name: string; password?: string };
    const passwordFile = join(dir, "pg-password");
    writeFileSync(passwordFile, s.password ?? "", { mode: 0o600 });
    const args = [
      BENCH, "run", "--server", r.origin, "--zswap-seed-file", seed, "--threads", "2", "--scan-threads", "1", "--path-splits", "2,0", "--build-threads", "2",
      "--db-url", `postgres://${s.user}@${s.host}:${s.port}/${s.name}`, "--db-password-file", passwordFile, "--pss-data", join(dir, "server"),
      "--sync-records", syncDir, "--server-pid", String(process.pid), "--out", out,
    ];
    const ran = await run(process.execPath, args, { env: { PATH: process.env.PATH ?? "" }, maxBuffer: 64 * 1024 * 1024 });
    expect(ran.stderr).toContain("wrote");
    const results = JSON.parse(readFileSync(join(out, "results.json"), "utf8")) as BenchResults;
    expect(results.wallets.map((w) => [w.label, w.coins.found])).toEqual([["seed-a-seed", 9]]);
    expect(results.server.memory).toContain(`process ${process.pid}`);
    expect(results.wallets[0]!.read.serverPeakRssBytes).toBeGreaterThan(0);
    expect(results.software.ledger).toMatch(/^@midnightntwrk\/ledger-v9 1\.0\.1$/);
    expect(results.pathSplits.map((p) => [p.k, p.sameAsServed])).toEqual([[2, true], [0, null]]);
    // Without a server log, the server's times are the only cells missing besides the transfer.
    expect(new Set(missingCells(results).map((g) => `${g.part} / ${g.column}`))).toEqual(
      new Set(["Read coins (one call) / computing", "Nullifier lookups (one call) / computing", "Lower paths to spend (one call) / computing", "Transfer / memory", "Transfer / inFlight", "Transfer / computing"]),
    );
    expect(readFileSync(join(out, "REPORT.md"), "utf8")).toContain("# Private shielded sync: benchmark on custom");
    const record = join(dir, "transfer.json");
    writeFileSync(record, JSON.stringify(TRANSFER_RECORD));
    await run(process.execPath, [BENCH, "report", join(out, "results.json"), "--transfer", record], { env: { PATH: process.env.PATH ?? "" } });
    const again = JSON.parse(readFileSync(join(out, "results.json"), "utf8")) as BenchResults;
    expect(again.transfer).toMatchObject({ submitted: true, bytesSubmitted: 18_526 });
    expect(new Set(missingCells(again).map((g) => g.part))).toEqual(new Set(["Read coins (one call)", "Nullifier lookups (one call)", "Lower paths to spend (one call)"]));
    expect(readFileSync(join(out, "REPORT.md"), "utf8")).toContain("finalized in block 3,399,948");
  });
});

describe("the benchmark asks the server for its snapshot", () => {
  it("--build: a snapshot at the latest height (7) is built through the admin route and measured; its tail is empty", { timeout: LONG }, async () => {
    const results = await runBench(options({ wallets: wallets("B"), build: { adminSecret: ADMIN_SECRET }, pathSplits: [2], scanThreads: [1] }));
    expect(results.snapshot).toMatchObject({ height: 7, outputs: 15, nullifiers: 3, builtByBench: true });
    expect(results.serverBuild!.source).toContain("admin build at 7");
    expect(results.wallets[0]!.tail.outputs).toBe(0);
    expect(results.wallets[0]!.coins.found).toBe(5);
    expect(results.pathSplits[0]!.sameAsServed).toBe(true);
    expect(missingCells(results)).toEqual([]);
  });
});

describe("both schemes (00058 FR-050): the benchmark asks for a SimplePIR and an IPIR+SP snapshot at one height", () => {
  let simple: BenchResults;
  let ipir: BenchResults;

  beforeAll(async () => {
    simple = await runBench(options({ build: { adminSecret: ADMIN_SECRET, height: 7, scheme: "simplepir" }, pathSplits: [2], scanThreads: [1] }));
    ipir = await runBench(options({ build: { adminSecret: ADMIN_SECRET, height: 7, scheme: "ipir-sp" }, pathSplits: [2], scanThreads: [1] }));
  }, LONG);

  it("IPIR+SP: every cell has a value, each wallet finds what it finds under SimplePIR, and every call is the scheme's size", () => {
    expect(simple.snapshot).toMatchObject({ height: 7, scheme: "simplepir", builtByBench: true });
    expect(ipir.snapshot).toMatchObject({ height: 7, scheme: "ipir-sp", builtByBench: true, padding: null });
    expect(ipir.snapshot.id).not.toBe(simple.snapshot.id);
    expect(ipir.build).toMatchObject({ height: 7, scheme: "ipir-sp", padding: null });
    expect(ipir.build!.rssPeakBytes).toBeGreaterThan(0);
    expect(ipir.build!.rssAfterBytes).toBeGreaterThan(0);
    expect(missingCells(ipir)).toEqual([]);
    const coins = (r: BenchResults) => r.wallets.map((w) => [w.label, w.coins.found, w.coins.spent, w.coins.unspent, w.path?.paths]);
    expect(coins(ipir)).toEqual(coins(simple));
    for (const name of ["read", "path", "nullifier"] as const) {
      const t = ipir.snapshot.tables[name]!;
      expect(t.rows % 2048, name).toBe(0);
      expect(t.groups, name).toBe(t.rows);
      expect(t.requestBytes, name).toBe(ipirRequestBytes(t.rows));
      expect(t.responseBytes, name).toBe(ipirResponseBytes(t.cols));
      expect(t.publicBytes, name).toBe(ipirMasksBytes(t.cols));
      expect(t.tableBytes, name).toBe(2 * t.rows * t.cols);
      // The add-on's cells and compiled packing (33,587,200 bytes per 2,048 columns).
      expect(ipir.server.heldBytes![name], name).toBe(2 * t.rows * t.cols + 33_587_200 * (t.cols / 2048));
    }
    const t = ipir.snapshot.tables;
    for (const w of ipir.wallets) {
      expect([w.read.bytesUp, w.read.bytesDown]).toEqual([40 + 16 * ipirRequestBytes(t.read!.rows), 40 + 16 * ipirResponseBytes(t.read!.cols)]);
      expect([w.downloads.readPublic.bytes, w.downloads.nullifierPublic.bytes]).toEqual([t.read!.publicBytes, t.nullifier!.publicBytes]);
      expect(w.path).toMatchObject({ calls: 1, bytesUp: 40 + 16 * ipirRequestBytes(t.path!.rows), bytesDown: 40 + 16 * ipirResponseBytes(t.path!.cols) });
      expect(w.path!.serverMs).not.toBeNull();
      expect(w.read.serverMs).not.toBeNull();
    }
    expect(ipir.wallets.find((w) => w.label === "A")!.path!.paths).toBeGreaterThan(0);
    // The setup steps carry the add-on's report: its noise sample under the limit.
    for (const step of ["readSetup", "pathSetup", "nullifierSetup"] as const) {
      expect(ipir.serverBuild!.steps[step]!.scheme!.maxPhaseErrorLog2, step).toBeLessThan(37);
      expect(ipir.serverBuild!.steps[step]!.bytes, step).toBe(ipirMasksBytes(ipir.serverBuild!.steps[step]!.scheme!.cols!));
    }
    expect(ipir.requestShapesIdentical).toBe(true);
  });

  it("IPIR+SP in-process (FR-153): the build at the served k gives the served snapshot; every record read is checked against the table file", () => {
    expect(ipir.pathSplits.map((p) => [p.k, p.sameAsServed])).toEqual([[2, true]]);
    const p = ipir.pathSplits[0]!;
    expect(p.groups).toBe(p.rows);
    expect(p.call.bytesUp).toBe(40 + 16 * ipirRequestBytes(p.rows));
    expect(p.call.recordsChecked).toBeGreaterThan(0);
    expect(p.path!.call!.recordsChecked).toBeGreaterThan(0);
    expect(simple.pathSplits.map((x) => [x.k, x.sameAsServed])).toEqual([[2, true]]);
  });

  it("the report names the scheme's artifacts and groups, and compare puts both schemes side by side", () => {
    const report = renderReport(ipir);
    expect(report).toContain("| Build read table and masks | server |");
    expect(report).toContain("records per row");
    expect(report).toContain("largest phase error 2^");
    expect(report).not.toContain("setup data");
    expect(renderReport(simple)).toContain("| Build read table and setup data | server |");
    const c = compareRuns([{ file: join(dir, "simple", "results.json"), results: simple }, { file: join(dir, "ipir", "results.json"), results: ipir }], dir);
    expect(c.sizes.map((x) => x.entries)).toEqual([15]);
    expect(c.sizes[0]!.files).toEqual({ simplepir: ["simple/results.json"], "ipir-sp": ["ipir/results.json"] });
    const row = (name: string) => c.sizes[0]!.rows.find((r) => r.name === name)!;
    expect(row("read call: up").values["ipir-sp"]).toMatchObject({ median: 40 + 16 * ipirRequestBytes(ipir.snapshot.tables.read!.rows), n: 3 });
    expect(row("read call: up").values.simplepir.median).toBe(simple.wallets[0]!.read.bytesUp);
    expect(row("read: one query up").values["ipir-sp"].median).toBe(ipirRequestBytes(ipir.snapshot.tables.read!.rows));
    expect(row("Server: held by the read table (as the scheme reports)").values.simplepir.median).toBe(simple.server.heldBytes!.read);
    expect(row("Wallet: once per snapshot, read and nullifier public artifacts").values["ipir-sp"].median).toBe(t(ipir, "read") + t(ipir, "nullifier"));
    // No run at 1,000,000: SC-002 is not checked; SC-003 asks for three sizes.
    expect(c.sc002.met).toBeNull();
    expect(c.sc003.met).toBe(false);
    const tables = renderComparison(c);
    expect(tables).toContain("| Group | Figure | SimplePIR | IPIR+SP | IPIR+SP ÷ SimplePIR | How |");
    expect(tables).toContain("**SC-002**");
    expect(tables).not.toContain("**not measured**");
  });
});

function t(r: BenchResults, name: "read" | "nullifier"): number {
  return r.snapshot.tables[name]!.publicBytes;
}
