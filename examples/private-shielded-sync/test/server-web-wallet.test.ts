/**
 * The page's Wallet tab (phase 10) under Node: its sync (`web/wallet-sync.ts`) over the page's own shielded and Dust
 * steps (`web/shielded-steps.ts`, `web/dust-steps.ts`), as the page's worker runs it, and its view (`web/wallet-view.ts`).
 *
 * The test world: the module in UmbraDB's real process on PostgreSQL 18 over the synthetic chain (`./server-chain.ts`;
 * snapshot at 4, tail to 7), for the shielded routes, as the client's tests run it (`./client-harness.ts`); the Dust
 * routes from the Dust world (`./server-dust-world.ts`: a wallet's three chains among other wallets' coins, a check
 * table built with the module's own builder), the requests to `/dust/…` sent there. The world's first coins are made
 * with the ledger's functions, not taken from events, so the coins answer is decoded by a stand-in for its key.
 *
 * - Wallet A of the chain with the Dust world's key: its shielded balances equal the ledger's own replay of the stored
 *   events with A's seed (per token type, the unspent coins' sum and count); its Dust chains are the world's (A's end
 *   checked, B's not checkable yet, C nothing to check) with their values at a fixed time; every step ran in order,
 *   and each step's waiting time is its requests' and the rest computing.
 * - A second sync of the same wallet downloads less: the snapshot's files, the Dust chunks and the check table's
 *   public artifact are held, and the opened tables kept.
 * - A wallet with nothing (a seed that received nothing, a new Dust key): zero balances, no error.
 * - A step that fails (the tail refused) is named with its message; the steps before it stay, with their cost.
 * - The scan (phase 11): Node has no WebGPU, so the sync scans on the CPU and says why; with a GPU scanner it scans
 *   there, and where the scanner does not start or fails it falls back to the CPU with the reason; the balances are the
 *   same every way. The stand-in scanner answers with the CPU kernel: that the WebGPU kernel's matches equal the CPU
 *   kernel's on the same entries is the GPU check's (`gpu/check.ts`, Deno), not Node's.
 */

import { mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import * as ledger from "../../../vendor/ledger/v9/pkg/midnight_ledger_wasm_v9_fs.js";
import { PROCESS_BACKENDS, type ProcessDatabase } from "../../../test/runner/process-backends.js";
import { readZswapEvents, replayZswapEvents } from "../client/cross-check.ts";
import { type FetchLike, PssHttp } from "../client/http.ts";
import { keysFromZswapSeed } from "../client/keys.ts";
import type { Ledger } from "../client/ledger.ts";
import { compileKernel, Kernel } from "../kernel/kernel.ts";
import { inlineMultiplier } from "../pir/index.ts";
import { DustSteps } from "../web/dust-steps.ts";
import { type GpuScan, ShieldedSteps } from "../web/shielded-steps.ts";
import { runWalletSync, type WalletSyncResult, walletSyncSteps } from "../web/wallet-sync.ts";
import { walletBalancesHtml, walletCostHtml, walletFailureHtml, walletScanText } from "../web/wallet-view.ts";
import { ADMIN_SECRET, builtAt, type ModuleRun, startModule, stoppedAt } from "./client-harness.ts";
import { type DustRoutes, DUST_SEED, dustWorld } from "./server-dust-world.ts";
import { type ScenarioChain, scenarioChain } from "./server-chain.ts";

const LONG = 600_000;
const backend = PROCESS_BACKENDS.find((candidate) => candidate.kind === "postgres")!;
const L = ledger as unknown as Ledger;
const SEED_A = new Uint8Array(32).fill(0xa1);
const SEED_C = new Uint8Array(32).fill(0xc3);
type Json = Record<string, any>;

let chain: ScenarioChain;
let db: ProcessDatabase;
let r: ModuleRun;
let dir: string;
let kernel: Kernel;
let world: Awaited<ReturnType<typeof dustWorld>>;
let routes: DustRoutes;
/** The Dust values are taken at this time, after every coin of the world. */
let NOW: Date;

beforeAll(async () => {
  chain = await scenarioChain();
  kernel = new Kernel(compileKernel());
  dir = mkdtempSync(join(tmpdir(), "pss-web-wallet-"));
  await backend.start();
  db = await backend.database();
  r = await startModule(chain, db, {
    stop: 7,
    config: { dataDir: join(dir, "server"), pathSplit: 2, queriesPerCall: 16, snapshotEvery: 4, adminSecret: ADMIN_SECRET, threads: 2 },
  });
  await stoppedAt(r, 7);
  await builtAt(r, 4);
  world = await dustWorld();
  routes = await world.serve("simplepir");
  NOW = new Date(Date.UTC(2026, 10, 18));
}, LONG);

afterAll(async () => {
  world?.dispose();
  await r?.close();
  await backend.stop();
  if (dir !== undefined) rmSync(dir, { recursive: true, force: true });
}, LONG);

/** Requests to `/dust/…` go to the Dust world, the others to the module; `refuse` answers 500 for the paths it names. */
function worldFetch(refuse: (path: string) => boolean = () => false): FetchLike {
  return async (url, init) => {
    const path = new URL(url).pathname;
    if (refuse(path)) return new Response(JSON.stringify({ error: { code: "refused-by-the-test", message: "the test refused this request" } }), { status: 500, headers: { "Content-Type": "application/json" } });
    return path.includes("/dust/") ? routes.fetch(url, init) : fetch(url, init);
  };
}

/** A wallet as the page's worker holds one: its shielded and Dust steps over one client, and its sync's steps. */
function pageWallet(zswapSeed: Uint8Array, dustSeed: Uint8Array, fetchLike: FetchLike, scan: { gpu?: () => Promise<GpuScan>; useGpu?: boolean } = {}) {
  const http = new PssHttp(r.origin, { fetch: fetchLike });
  const shielded = new ShieldedSteps({ ledger: L, kernel, http, multiplier: inlineMultiplier, ipirWasm: async () => Promise.reject(new Error("no IPIR+SP here")), ...(scan.gpu === undefined ? {} : { gpu: scan.gpu }) });
  const dust = new DustSteps({
    ledger: L,
    http,
    cache: new Map(),
    scheme: { multiplier: inlineMultiplier },
    now: () => NOW,
    decodeCoins: (answer, owner) => (owner === world.owner ? { starts: [world.A, world.B, world.C], updates: [] } : { starts: [], updates: [] }),
  });
  const keys = () => {
    shielded.setKeys(keysFromZswapSeed(L, zswapSeed, kernel));
    dust.setSeed(dustSeed);
    return { source: "the test's seeds" };
  };
  const steps = walletSyncSteps({ keys, shielded, dust, ...(scan.useGpu === undefined ? {} : { gpu: scan.useGpu }) });
  const progress: string[] = [];
  return { http, shielded, dust, steps, progress, sync: () => runWalletSync(steps, { http, progress: (t) => progress.push(t) }) };
}

/** The ledger's own balances for a seed: its replay of the stored events to 7, unspent coins summed per token type. */
async function ledgerBalances(seed: Uint8Array): Promise<{ tokenType: string; balance: string; coins: number }[]> {
  const rows = await readZswapEvents((q) => db.query(q), 7);
  const replay = replayZswapEvents({ v9: L }, seed, rows, 7);
  const by = new Map<string, { balance: bigint; coins: number }>();
  for (const p of replay.unspent) {
    const c = replay.received.get(p)!;
    const t = by.get(c.tokenType) ?? { balance: 0n, coins: 0 };
    by.set(c.tokenType, { balance: t.balance + BigInt(c.value), coins: t.coins + 1 });
  }
  return [...by.entries()].sort(([a], [b]) => (a < b ? -1 : 1)).map(([tokenType, t]) => ({ tokenType, balance: t.balance.toString(), coins: t.coins }));
}

const NAMES = ["keys", "files", "scan", "read", "nullifiers", "tail", "summary", "dustFile", "dustWalk", "dustCheck"];

describe("the Wallet tab's sync (phase 10)", () => {
  let first: WalletSyncResult;
  let second: WalletSyncResult;
  let w: ReturnType<typeof pageWallet>;

  it("a wallet with shielded coins and Dust chains: every step in order; the shielded balances are the ledger's own replay's; the Dust chains the world's, with their status and values; each step's waiting is its requests' time", { timeout: LONG }, async () => {
    w = pageWallet(SEED_A, DUST_SEED, worldFetch());
    first = await w.sync();
    expect(first.failed).toBeNull();
    expect(first.steps.map((s) => s.name)).toEqual(NAMES);
    expect(first.steps.every((s) => s.ok)).toBe(true);
    // The step in progress was told, each in its turn.
    const told = first.steps.map((s, i) => w.progress.indexOf(`step ${i + 1} of 10: ${s.label}`));
    expect(told.every((at, i) => at >= 0 && (i === 0 || at > told[i - 1]!))).toBe(true);
    expect(w.progress[0]).toBe("step 1 of 10: Wallet keys");
    expect(w.progress.some((p) => p.startsWith("step 3 of 10: Find my outputs (scan): scanned "))).toBe(true);

    const expected = await ledgerBalances(SEED_A);
    expect(expected.length).toBeGreaterThan(0);
    expect(first.balances.shielded).toEqual(expected);

    const values = [world.A2, world.B2, world.C.coin].map((coin, i) => L.updatedValue(coin.ctime, coin.initialValue, [world.A, world.B, world.C][i]!.generation, NOW, world.params));
    expect(first.balances.dust).toMatchObject({
      chains: [
        { chain: 1, status: "checked", valueNow: values[0]!.toString(), statusText: "checked: the record at position 30 is the last coin's commitment" },
        { chain: 2, status: "not-checkable", valueNow: values[1]!.toString(), statusText: "not checkable yet: the check table covers positions below 64" },
        { chain: 3, status: "no-spend", valueNow: values[2]!.toString(), statusText: "nothing to check: the first coin is public" },
      ],
      total: values.reduce((t, v) => t + v, 0n).toString(),
    });

    // The cost: per step, its requests' bytes and time; the parts and the whole add up; no debug request was made.
    const records = w.http.records;
    expect(first.cost.requests).toBe(records.length);
    expect(first.cost.up).toBe(records.reduce((t, x) => t + x.bodyBytes, 0));
    expect(first.cost.down).toBe(records.reduce((t, x) => t + x.answerBytes, 0));
    expect(records.some((x) => x.path.includes("/debug/"))).toBe(false);
    for (const s of first.steps) {
      expect(s.waitMs + s.computeMs).toBeCloseTo(s.ms, 1);
      expect(s.waitMs).toBeGreaterThanOrEqual(0);
    }
    expect(first.steps.find((s) => s.name === "scan")).toMatchObject({ requests: 0, up: 0, down: 0, waitMs: 0 });
    expect(first.steps.find((s) => s.name === "dustWalk")).toMatchObject({ requests: 0 });
    const { shielded, dust } = first.cost.parts;
    expect([shielded.requests + dust.requests, shielded.up + dust.up, shielded.down + dust.down]).toEqual([first.cost.requests, first.cost.up, first.cost.down]);
    expect(shielded.down).toBeGreaterThan(0);
    expect(dust.down).toBeGreaterThan(0);
    // Each step's answer is the Details step's (the page fills its cards with them).
    expect(first.steps.find((s) => s.name === "files")!.answer).toMatchObject({ manifest: { height: 4 }, tablesKept: false });
    expect(first.steps.find((s) => s.name === "dustCheck")!.answer).toMatchObject({ check: { commitments: 64 } });

    // The view: one row per token type, the three chains and their total, the cost by part.
    const html = walletBalancesHtml(first);
    for (const t of expected) expect(html).toContain(BigInt(t.balance).toLocaleString("en-US"));
    expect(html).toContain("not checkable yet: the check table covers positions below 64");
    expect(html).toContain(BigInt(first.balances.dust!.total).toLocaleString("en-US"));
    const cost = walletCostHtml(first);
    expect(cost).toMatch(/Last sync: .+ of processing \(the wallet computing .+, waiting for the server .+\); up .+, down .+ in \d+ requests\./);
    expect(cost).toContain("shielded (with the keys)");
    expect(walletFailureHtml(first)).toBe("");
    // Node has no WebGPU: the CPU scanned, and the page says why, beside the cost.
    expect(first.scan).toMatchObject({ gpu: false, device: null, fallback: "this browser has no WebGPU" });
    expect(first.scan!.ms).toBe(first.steps.find((s) => s.name === "scan")!.ms);
    expect(walletScanText(first)).toMatch(/^Scan: on the CPU \(the WebAssembly kernel, one thread\), [\d,]+ entries in .+, because the GPU scan did not run: this browser has no WebGPU\.$/);
    expect(cost).toContain("because the GPU scan did not run: this browser has no WebGPU");
    // The per-step table keeps the scan's time.
    expect(cost).toContain(`<td class="mono">Find my outputs (scan)</td><td class="mono">${first.scan!.ms >= 1000 ? `${(first.scan!.ms / 1000).toFixed(1)} s` : `${Math.round(first.scan!.ms)} ms`}</td>`);
  });

  it("a second sync of the same wallet downloads less: the files, the Dust chunks and the check table's public artifact are held, the opened tables kept; the same balances", { timeout: LONG }, async () => {
    const before = w.http.records.length;
    second = await w.sync();
    expect(second.ok).toBe(true);
    expect(second.balances).toEqual(first.balances);
    expect(second.cost.down).toBeLessThan(first.cost.down);
    expect(second.cost.requests).toBe(w.http.records.length - before);
    const files = second.steps.find((s) => s.name === "files")!;
    expect(files.answer).toMatchObject({ tablesKept: true });
    expect((files.answer!.downloads as Json[]).every((d) => d.cached === true)).toBe(true);
    expect(files.requests).toBe(1);
    expect(second.steps.find((s) => s.name === "dustFile")!.answer).toMatchObject({ chunksDownloaded: 0 });
    expect(second.steps.find((s) => s.name === "dustCheck")!.answer).toMatchObject({ check: { publicArtifact: { cached: true } } });
  });

  it("the scan (phase 11): on the GPU when it starts; on the CPU with the reason when it does not start or fails, or when asked; the same matches and balances every way; the Details box's scan still fails without a GPU", { timeout: LONG }, async () => {
    const expected = await ledgerBalances(SEED_A);
    // A stand-in GPU scanner: the CPU kernel's answer, so the sync's GPU path is followed with known matches.
    let gpuScans = 0;
    const standIn: GpuScan = {
      description: "a stand-in adapter",
      scan: async (entries, secret) => {
        gpuScans++;
        return kernel.scan(entries, secret);
      },
    };
    const runs = {
      gpu: await pageWallet(SEED_A, DUST_SEED, worldFetch(), { gpu: async () => standIn }).sync(),
      noAdapter: await pageWallet(SEED_A, DUST_SEED, worldFetch(), { gpu: async () => Promise.reject(new Error("this browser's WebGPU gives no GPU adapter")) }).sync(),
      failed: await pageWallet(SEED_A, DUST_SEED, worldFetch(), { gpu: async () => ({ scan: async () => Promise.reject(new Error("the GPU device was lost")) }) }).sync(),
      cpuAsked: await pageWallet(SEED_A, DUST_SEED, worldFetch(), { gpu: async () => standIn, useGpu: false }).sync(),
    };
    expect(gpuScans).toBe(1);
    expect(runs.gpu.scan).toMatchObject({ gpu: true, device: "a stand-in adapter", fallback: null });
    expect(walletScanText(runs.gpu)).toMatch(/^Scan: on the GPU \(WebGPU, a stand-in adapter\), [\d,]+ entries in .+\.$/);
    expect(runs.noAdapter.scan).toMatchObject({ gpu: false, fallback: "this browser's WebGPU gives no GPU adapter" });
    expect(runs.failed.scan).toMatchObject({ gpu: false, fallback: "the GPU device was lost" });
    expect(runs.cpuAsked.scan).toMatchObject({ gpu: false, fallback: null });
    expect(walletScanText(runs.cpuAsked)).toMatch(/one thread\), [\d,]+ entries in [^,]+\.$/);
    const matchesOf = (x: WalletSyncResult) => (x.steps.find((s) => s.name === "scan")!.answer!.matches as Json[]).map((m) => m.position);
    for (const [name, run] of Object.entries(runs)) {
      expect(run.ok, name).toBe(true);
      expect(run.balances.shielded, name).toEqual(expected);
      expect(matchesOf(run), name).toEqual(matchesOf(first));
    }
    expect(matchesOf(first).length).toBeGreaterThan(0);
    // The Details tab's scan with its box ticked and no GPU fails as before (no fallback there).
    const details = pageWallet(SEED_A, DUST_SEED, worldFetch());
    details.steps[0]!.run(() => {});
    await details.shielded.getFiles({ debug: false });
    await expect(details.shielded.scan({ gpu: true })).rejects.toThrow("this browser has no WebGPU");
  });

  it("a wallet with nothing: zero balances shown plainly, no error", { timeout: LONG }, async () => {
    const empty = pageWallet(SEED_C, crypto.getRandomValues(new Uint8Array(32)), worldFetch());
    const result = await empty.sync();
    expect(result.ok).toBe(true);
    expect(result.balances).toEqual({ shielded: [], dust: { chains: [], total: "0", checkTable: expect.any(String) } });
    const html = walletBalancesHtml(result);
    expect(html).toContain("<td class=\"mono\">none</td><td class=\"mono\">0</td><td class=\"mono\">0</td>");
    expect(html).toContain("no Dust chain in the era");
    expect(html).not.toContain("error");
  });

  it("a step that fails is named with its message; the steps before it stay, with their cost; the balances not reached are said to be unknown", { timeout: LONG }, async () => {
    const failing = pageWallet(SEED_A, DUST_SEED, worldFetch((path) => path.endsWith("/tail")));
    const result = await failing.sync();
    expect(result.ok).toBe(false);
    expect(result.failed).toMatchObject({ step: "tail", label: "Get the tail" });
    expect(result.failed!.message).toContain("500");
    expect(result.steps.map((s) => [s.name, s.ok])).toEqual([["keys", true], ["files", true], ["scan", true], ["read", true], ["nullifiers", true], ["tail", false]]);
    expect(result.steps.at(-1)!.error).toContain("the test refused this request");
    expect(result.cost.requests).toBe(failing.http.records.length);
    expect(result.balances).toEqual({ shielded: null, dust: null });
    expect(walletFailureHtml(result)).toContain("Get the tail failed: GET /pss/v1/tail: 500");
    expect(walletFailureHtml(result)).toContain("Completed before it: Wallet keys, Get the files, Find my outputs (scan), Fetch records by PIR, Check nullifiers by PIR.");
    expect(walletBalancesHtml(result)).toContain("Not known: the shielded sync did not complete.");
    // A Dust failure keeps the shielded balances.
    const dustDown = pageWallet(SEED_A, DUST_SEED, worldFetch((path) => path.endsWith("/dust/manifest")));
    const partial = await dustDown.sync();
    expect(partial.failed).toMatchObject({ step: "dustFile", label: "Dust: get the file and my first coins" });
    expect(partial.balances.shielded).toEqual(await ledgerBalances(SEED_A));
    expect(partial.balances.dust).toBeNull();
  });
});
