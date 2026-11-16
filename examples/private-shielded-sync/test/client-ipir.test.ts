/**
 * IPIR+SP end to end (spec 00058 stories 1, 2 and 4; FR-001 to FR-003, FR-010, FR-013 to FR-015, FR-020 to FR-023,
 * FR-030, FR-031; SC-004, SC-005; the edge cases): the module in UmbraDB's real process on PostgreSQL 18 over the
 * synthetic chain of real v9 transactions (`./server-chain.ts`), its setting `scheme: "ipir-sp"`, a snapshot built at
 * 4 while following and the tail to 7; the client's `sync`, `send`'s path read and the command line against it.
 *
 * - Wallets A, B (coins from every source) and C (none) sync through IPIR+SP: each equals the ledger's own replay of
 *   the stored events; their requests have identical sequences of route and size, one full call per table each.
 * - The same height built under SimplePIR (the admin body's `scheme`) gives the same coins, spent flags and lower
 *   paths; built under IPIR+SP again, the same snapshot identifier. A spend on an IPIR+SP lower path is accepted by
 *   the chain.
 * - Refusals: bodies of another length, another snapshot (409 first), a snapshot replaced during a sync; a padded
 *   snapshot; a padding no IPIR+SP table holds; a restart (tables set up again from their files); a restart without
 *   the add-on (IPIR+SP snapshots ignored, SimplePIR built and served); a wallet without the WebAssembly.
 *
 * Needs the add-on (`ipir/build.sh native`). The command line's part needs the client's install (skipped without it).
 */

import { execFile } from "node:child_process";
import { existsSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { promisify } from "node:util";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { RAW } from "../../../test/ledger/adapter-fixtures.js";
import { PROCESS_BACKENDS, type ProcessDatabase } from "../../../test/runner/process-backends.js";
import { BlobCache } from "../client/cache.ts";
import { compareWithClient, readZswapEvents, replayZswapEvents } from "../client/cross-check.ts";
import { type FetchLike, PssHttp } from "../client/http.ts";
import { keysFromZswapSeed, walletKeys, type WalletKeys } from "../client/keys.ts";
import type { Ledger } from "../client/ledger.ts";
import { coinPath, planTransfer } from "../client/send.ts";
import { type CoinRecord, unspentCoins, type WalletState } from "../client/state.ts";
import { lowerPathsByPir, pathInTable, sync, type SyncResult } from "../client/sync.ts";
import { ipirMasksBytes, ipirRequestBytes, ipirResponseBytes } from "../ipir/sizes.ts";
import { compileIpirWasm } from "../ipir/wallet-node.ts";
import { compileKernel, Kernel, ScanPool } from "../kernel/index.ts";
import { bucketOf, inlineMultiplier, openWalletScheme } from "../pir/index.ts";
import { decodeManifest, encodeQueryBody, fromHex, type Manifest, OCTET_STREAM, ROUTES, snapshotId, toHex } from "../shared/index.ts";
import { STATS_FILE } from "../server/store.ts";
import { ADMIN_SECRET, adminStatus, builtAt, type ModuleRun, startModule, stoppedAt } from "./client-harness.ts";
import { type ScenarioChain, scenarioChain } from "./server-chain.ts";

const LONG = 600_000;
const backend = PROCESS_BACKENDS.find((candidate) => candidate.kind === "postgres")!;
const ledger = RAW.v9 as unknown as Ledger;
const SEEDS = { A: new Uint8Array(32).fill(0xa1), B: new Uint8Array(32).fill(0xb2), C: new Uint8Array(32).fill(0xc3) } as const;
const QUERIES_PER_CALL = 8;
const MAIN = fileURLToPath(new URL("../client/main.ts", import.meta.url));
const installed = existsSync(new URL("../client/node_modules/@midnightntwrk/ledger-v9/package.json", import.meta.url));
const run = promisify(execFile);
const auth = { Authorization: `Bearer ${ADMIN_SECRET}` };

let chain: ScenarioChain;
let db: ProcessDatabase;
let r: ModuleRun;
let kernel: Kernel;
let scanPool: ScanPool;
let wasm: WebAssembly.Module;
let dir: string;
const keys: Record<"A" | "B" | "C", WalletKeys> = {} as never;
const config = (extra: Record<string, unknown> = {}): Record<string, unknown> => ({
  dataDir: join(dir, "server"),
  pathSplit: 2,
  queriesPerCall: QUERIES_PER_CALL,
  snapshotEvery: 4,
  adminSecret: ADMIN_SECRET,
  threads: 2,
  scheme: "ipir-sp",
  ...extra,
});

function recordingFetch(before?: (url: string) => Promise<void>): FetchLike {
  return async (url, init) => {
    await before?.(url);
    return fetch(url, init);
  };
}

/** A sync of one wallet as the command line makes it, with the committed WebAssembly unless told otherwise. */
async function syncWallet(name: "A" | "B" | "C", options: { before?: (url: string) => Promise<void>; withoutWasm?: boolean } = {}): Promise<SyncResult & { http: PssHttp; cache: BlobCache }> {
  const http = new PssHttp(r.origin, { fetch: recordingFetch(options.before) });
  const cache = new BlobCache(mkdtempSync(join(dir, `cache-${name}-`)));
  const result = await sync({
    ledger,
    keys: keys[name],
    http,
    cache,
    kernel,
    scanPool,
    multiplier: inlineMultiplier,
    ...(options.withoutWasm === true ? {} : { ipirWasm: () => wasm }),
    network: "custom",
    previous: null,
  });
  return { ...result, http, cache };
}

/** The ledger's own replay of the stored events for a seed up to `upto`, against the client's state: no difference. */
async function expectLedgerAgrees(seed: Uint8Array, state: WalletState, upto: number, label: string): Promise<void> {
  const rows = await readZswapEvents((q) => db.query(q), upto);
  const report = compareWithClient(replayZswapEvents({ v9: ledger }, seed, rows, upto), state, rows);
  expect(report.differences, label).toEqual([]);
  expect(report.equal, label).toBe(true);
  expect(state.rejected, label).toEqual([]);
}

async function manifestOf(): Promise<{ manifest: Manifest; id: string }> {
  const answer = await fetch(`${r.origin}${ROUTES.manifest}`);
  expect(answer.status).toBe(200);
  const bytes = new Uint8Array(await answer.arrayBuffer());
  return { manifest: decodeManifest(bytes), id: toHex(snapshotId(bytes)) };
}

async function requestBuild(body: Record<string, unknown>): Promise<Response> {
  return fetch(`${r.origin}${ROUTES.adminSnapshot}`, { method: "POST", headers: { ...auth, "Content-Type": "application/json" }, body: JSON.stringify(body) });
}

/** Asks for a build and waits for it; the status's last build. */
async function buildWith(body: { height: number; scheme?: string; padding?: number }): Promise<Record<string, any>> {
  const answer = await requestBuild(body);
  expect(answer.status, await answer.clone().text()).toBe(202);
  return (await builtAt(r, body.height)).last as Record<string, any>;
}

/** The coins of a state as compared between schemes: everything but where their lower path came from. */
const coinsOf = (state: WalletState) => state.coins.map((c) => ({ position: c.position, value: c.value, tokenType: c.tokenType, nonce: c.nonce, commitment: c.commitment, nullifier: c.nullifier, spent: c.spent, source: c.source }));

const recipientOf = (k: WalletKeys) => ({ coinPublicKey: toHex(k.coinPublicKey), encryptionPublicKey: toHex(k.encryptionPublicKey) });

beforeAll(async () => {
  chain = await scenarioChain();
  kernel = new Kernel(compileKernel());
  scanPool = new ScanPool({ threads: 2 });
  wasm = compileIpirWasm();
  keys.A = walletKeys(chain.wallets.A.keys as never, kernel);
  keys.B = walletKeys(chain.wallets.B.keys as never, kernel);
  keys.C = keysFromZswapSeed(ledger, SEEDS.C, kernel);
  dir = mkdtempSync(join(tmpdir(), "pss-ipir-module-"));
  await backend.start();
  db = await backend.database();
  r = await startModule(chain, db, { stop: 7, config: config() });
  await stoppedAt(r, 7);
  await builtAt(r, 4);
}, LONG);

afterAll(async () => {
  delete process.env.PSS_IPIR_ADDON;
  await r?.close();
  await scanPool?.close();
  await backend.stop();
  if (dir !== undefined) rmSync(dir, { recursive: true, force: true });
}, LONG);

describe("the module with scheme: ipir-sp, the snapshot at 4 and the tail to 7", () => {
  const results: Partial<Record<"A" | "B" | "C", SyncResult & { http: PssHttp; cache: BlobCache }>> = {};
  let first: { manifest: Manifest; id: string };

  beforeAll(async () => {
    first = await manifestOf();
    for (const name of ["A", "B", "C"] as const) results[name] = await syncWallet(name);
  }, LONG);

  it("story 2: the setting builds IPIR+SP snapshots; the manifest names the scheme and the masks; each setup step records its noise sample (FR-015)", async () => {
    const { manifest, id } = first;
    expect(manifest.scheme).toBe("ipir-sp");
    expect(manifest.height).toBe(4);
    const a = manifest.artifacts;
    expect([a.readTable.layout, a.pathTable!.layout, a.nullifierTable.layout].map((l) => [l.rows, l.cols])).toEqual([[2048, 2048], [2048, 2048], [2048, 2048]]);
    expect([a.readPublic.size, a.pathPublic!.size, a.nullifierPublic.size]).toEqual([ipirMasksBytes(2048), ipirMasksBytes(2048), ipirMasksBytes(2048)]);
    const status = await adminStatus(r);
    expect(status.current).toMatchObject({ id, scheme: "ipir-sp", height: 4 });
    expect(status.settings.scheme).toBe("ipir-sp");
    const stats = JSON.parse(readFileSync(join(dir, "server", "snapshots", id, STATS_FILE), "utf8")) as Record<string, any>;
    expect(stats.scheme).toBe("ipir-sp");
    for (const step of ["readSetup", "pathSetup", "nullifierSetup"]) {
      const s = stats.steps[step].scheme as Record<string, number>;
      expect(s.phaseLimitLog2, step).toBe(37);
      expect(s.maxPhaseErrorLog2, step).toBeLessThan(37);
      expect(s.checkedRows, step).toBe(3);
    }
  });

  it("stories 1 and 2 + FR-030: wallets A, B and C sync through IPIR+SP; each equals the ledger's replay with zero differences", { timeout: LONG }, async () => {
    for (const name of ["A", "B", "C"] as const) {
      const { state, stats } = results[name]!;
      expect([state.snapshot.height, state.tail.height]).toEqual([4, 7]);
      await expectLedgerAgrees(SEEDS[name], state, 7, name);
      // The masks came through the blob cache, once per table; no setup data exists under IPIR+SP.
      expect([stats.downloads.readPublic.size, stats.downloads.nullifierPublic.size]).toEqual([ipirMasksBytes(2048), ipirMasksBytes(2048)]);
    }
    expect(results.A!.state.coins.map((c) => c.value).sort()).toEqual(["100", "200", "300", "70", "60", "50", "7", "8", "9"].sort());
    expect(results.A!.state.coins.filter((c) => c.spent !== null).map((c) => [c.value, c.spent!.height, c.spent!.source]).sort()).toEqual([["100", 4, "snapshot"], ["200", 7, "tail"]]);
    expect(results.B!.state.coins.map((c) => c.value).sort()).toEqual(["1", "200", "40", "50", "60"]);
    expect(results.C!.state.coins).toEqual([]);
  });

  it("FR-020, FR-021 + SC-005: the three wallets' requests have identical routes and sizes; each sends one full call per table of 8 requests with a fresh secret each", () => {
    const shape = (name: "A" | "B" | "C") => results[name]!.http.records.map((q) => [q.method, q.path, q.bodyBytes, q.answerBytes]);
    // Identical except the blobs' answers (the same files) and the tail; method, route, body and answer sizes.
    expect(shape("B")).toEqual(shape("A"));
    expect(shape("C")).toEqual(shape("A"));
    for (const name of ["A", "B", "C"] as const) {
      const { stats, http } = results[name]!;
      expect([stats.read.calls, stats.nullifier.calls], name).toEqual([1, 1]);
      const calls = http.records.filter((q) => q.method === "POST");
      expect(calls.map((q) => q.path)).toEqual([ROUTES.queryRead, ROUTES.queryNullifier]);
      for (const q of calls) {
        expect(q.bodyBytes).toBe(40 + QUERIES_PER_CALL * ipirRequestBytes(2048));
        expect(q.answerBytes).toBe(40 + QUERIES_PER_CALL * ipirResponseBytes(2048));
      }
    }
    // 40 + 8 × 40,228 bytes up and 40 + 8 × 5,700 down per call on this snapshot.
    expect(results.A!.stats.read.bytesUp).toBe(321_864);
    expect(results.A!.stats.read.bytesDown).toBe(45_640);
  });

  it("FR-010 + story 4: under SimplePIR at the same height the coins, spent flags and lower paths are the same; a spend on an IPIR+SP lower path is accepted by the chain; IPIR+SP again gives the same identifier (FR-013)", { timeout: LONG }, async () => {
    const ipirA = results.A!;
    const wanted = ipirA.state.coins.filter((c) => pathInTable(ipirA.manifest, c));
    expect(wanted.length).toBeGreaterThan(0);
    const viaIpir = await lowerPathsByPir({ http: ipirA.http, cache: ipirA.cache, kernel, multiplier: inlineMultiplier, ipirWasm: () => wasm }, ipirA, wanted);
    expect(viaIpir.stats.calls).toBe(1);
    expect(viaIpir.stats.public.size).toBe(ipirMasksBytes(2048));
    expect(viaIpir.stats.bytesUp).toBe(40 + QUERIES_PER_CALL * ipirRequestBytes(2048));

    // A spend built on the lower path read through IPIR+SP (Q58) is accepted by the chain's own Zswap state.
    const coin: CoinRecord = unspentCoins(ipirA.state).find((c) => viaIpir.paths.has(c.position))!;
    const withPath: CoinRecord = { ...coin, lowerPath: viaIpir.paths.get(coin.position)! };
    const { siblings, root } = coinPath(ipirA.view, withPath, kernel);
    expect(toHex(root)).toBe(ipirA.state.tail.root);
    const plan = planTransfer({ ledger, keys: keys.A, network: chain.scenario.networkId, coin: withPath, siblings, root, recipient: recipientOf(keys.B), amount: BigInt(coin.value) - 1n });
    let refused: string | null = null;
    try {
      chain.zswap.tryApply(plan.offer as never);
    } catch (e) {
      refused = String(e);
    }
    expect(refused).toBeNull();

    // The same height under SimplePIR, by the admin body's scheme.
    const simple = await buildWith({ height: 4, scheme: "simplepir" });
    expect(simple).toMatchObject({ ok: true, scheme: "simplepir" });
    expect(simple.id).not.toBe(first.id);
    for (const name of ["A", "B"] as const) {
      const again = await syncWallet(name);
      expect(again.manifest.scheme).toBe("simplepir");
      expect(coinsOf(again.state), name).toEqual(coinsOf(results[name]!.state));
      if (name === "A") {
        const viaSimple = await lowerPathsByPir({ http: again.http, cache: again.cache, kernel, multiplier: inlineMultiplier }, again, wanted);
        expect([...viaSimple.paths.entries()]).toEqual([...viaIpir.paths.entries()]);
      }
    }

    // IPIR+SP again at 4: the same snapshot as the one the setting built.
    const back = await buildWith({ height: 4, scheme: "ipir-sp" });
    expect(back).toMatchObject({ ok: true, scheme: "ipir-sp", id: first.id });
    expect((await manifestOf()).id).toBe(first.id);
  });

  it("FR-022: a body of another length is refused before any work (400); another snapshot is 409 first, even at another length; another count is 400", async () => {
    const { manifest, id } = await manifestOf();
    expect(manifest.scheme).toBe("ipir-sp");
    const post = (route: string, snapshot: Uint8Array, count: number, each: number) =>
      fetch(`${r.origin}${route}`, {
        method: "POST",
        headers: { "Content-Type": OCTET_STREAM },
        body: encodeQueryBody({ snapshotId: snapshot, count, payload: new Uint8Array(count * each) }, each) as Uint8Array<ArrayBuffer>,
      });
    const own = fromHex(id, 32);
    const each = ipirRequestBytes(2048);
    for (const route of [ROUTES.queryRead, ROUTES.queryPath, ROUTES.queryNullifier]) {
      const short = await post(route, own, QUERIES_PER_CALL, each - 1);
      expect(short.status, route).toBe(400);
      expect(await short.json()).toMatchObject({ error: { code: "invalid-query", message: expect.stringContaining(`must be ${40 + QUERIES_PER_CALL * each} bytes`) } });
      const other = await post(route, new Uint8Array(32).fill(7), QUERIES_PER_CALL, each - 1);
      expect(other.status, route).toBe(409);
      expect(await other.json()).toMatchObject({ error: { code: "snapshot-replaced" }, snapshot: id });
      expect((await post(route, own, QUERIES_PER_CALL - 1, each)).status, route).toBe(400);
    }
    // A body of the right length that holds no request of this table is refused before any work (400): zeros, and a
    // genuine call to the read table sent to the nullifier route (same shape, another setup).
    const zeros = await post(ROUTES.queryRead, own, QUERIES_PER_CALL, each);
    expect(zeros.status).toBe(400);
    expect(await zeros.json()).toMatchObject({ error: { code: "invalid-query", message: expect.stringContaining("not a request of this IPIR+SP table") } });
    const scheme = await openWalletScheme(manifest, { ipirWasm: () => wasm });
    const readTable = await scheme.openTable(manifest.artifacts.readTable, new Uint8Array(await (await fetch(`${r.origin}${ROUTES.blob}${manifest.artifacts.readPublic.digest}`)).arrayBuffer()));
    const genuine = await readTable.prepareCall(Array.from({ length: QUERIES_PER_CALL }, (_, i) => i));
    scheme.dispose();
    const misrouted = await fetch(`${r.origin}${ROUTES.queryNullifier}`, {
      method: "POST",
      headers: { "Content-Type": OCTET_STREAM },
      body: encodeQueryBody({ snapshotId: own, count: QUERIES_PER_CALL, payload: genuine.requests }, each) as Uint8Array<ArrayBuffer>,
    });
    expect(misrouted.status).toBe(400);
    expect((await adminStatus(r)).current.id).toBe(id);
  });

  it("story 2 scenario 3 + FR-031: a wallet not given the WebAssembly stops with a message naming the scheme and the file", { timeout: LONG }, async () => {
    await expect(syncWallet("A", { withoutWasm: true })).rejects.toThrow(/PIR scheme "ipir-sp" is not available in this build: this wallet was not given its WebAssembly \(ipir\/pss-ipir\.wasm\)/);
  });

  it("a snapshot replaced during a sync (edge case): the first read call meets an IPIR+SP snapshot built at 7 meanwhile; 409, then the sync starts again with the same result as the ledger's", { timeout: LONG }, async () => {
    let built = false;
    const result = await syncWallet("A", {
      before: async (url) => {
        if (!built && url.endsWith(ROUTES.queryRead)) {
          built = true;
          expect((await requestBuild({ height: 7 })).status).toBe(202);
          await builtAt(r, 7);
        }
      },
    });
    expect(built).toBe(true);
    expect(result.stats.attempts).toBe(2);
    expect(result.http.records.some((q) => q.status === 409)).toBe(true);
    expect([result.manifest.scheme, result.state.snapshot.height]).toEqual(["ipir-sp", 7]);
    await expectLedgerAgrees(SEEDS.A, result.state, 7, "A at 7");
    expect(result.state.coins.every((c) => c.source === "snapshot")).toBe(true);
  });

  it("a padded IPIR+SP snapshot (Q57): A finds the same coins among 2,000 entries; a padding no IPIR+SP table holds is refused before anything is read (507)", { timeout: LONG }, async () => {
    const plain = await syncWallet("A");
    const last = await buildWith({ height: 7, padding: 2000, scheme: "ipir-sp" });
    expect(last).toMatchObject({ ok: true, padding: 2000, scheme: "ipir-sp" });
    const padded = await syncWallet("A");
    expect(padded.manifest.padding).toEqual({ size: 2000 });
    expect(coinsOf(padded.state)).toEqual(coinsOf(plain.state));
    await expectLedgerAgrees(SEEDS.A, padded.state, 7, "A padded");
    const tooLarge = await requestBuild({ height: 7, padding: 30_000_000, scheme: "ipir-sp" });
    expect(tooLarge.status).toBe(507);
    expect(await tooLarge.json()).toMatchObject({ error: { code: "table-too-large", message: expect.stringContaining("ipir-sp: the read table of 30,000,000 records") }, neededCells: 30_000_000 * 49, maxCells: 2 ** 30 });
    expect((await adminStatus(r)).building).toBeNull();
  });

  describe.skipIf(!installed)("the command line (with the client's install)", () => {
    it("sync through IPIR+SP writes the state and prints the balance; cross-check finds no difference", { timeout: LONG }, async () => {
      const seedFile = join(dir, "a.seed");
      writeFileSync(seedFile, Buffer.from(SEEDS.A).toString("hex"), { mode: 0o600 });
      const cli = async (args: readonly string[]) => {
        try {
          const { stdout, stderr } = await run(process.execPath, [MAIN, ...args], { env: { PATH: process.env.PATH ?? "" }, maxBuffer: 64 * 1024 * 1024 });
          return { stdout, stderr, code: 0 };
        } catch (e) {
          const err = e as { stdout: string; stderr: string; code: number };
          return { stdout: err.stdout, stderr: err.stderr, code: err.code };
        }
      };
      const common = ["--zswap-seed-file", seedFile, "--data", join(dir, "cli"), "--threads", "2"];
      const synced = await cli(["sync", ...common, "--server", r.origin, "--stats", join(dir, "cli-stats.json")]);
      expect(synced.code, synced.stderr).toBe(0);
      expect(synced.stdout).toContain("unspent coins (7)");
      const stats = JSON.parse(readFileSync(join(dir, "cli-stats.json"), "utf8")) as Record<string, any>;
      // The served snapshot is the padded one at 7: A's 9 coins sit in 9 rows of the read table, two calls of 8; the
      // nullifier calls follow how many buckets its 9 nullifiers fall in (FR-021).
      const state = JSON.parse(readFileSync(join(dir, "cli", "wallets", "seed-a.seed", "state.json"), "utf8")) as WalletState;
      const { manifest } = await manifestOf();
      expect(manifest.padding).toEqual({ size: 2000 });
      const buckets = new Set(state.coins.map((c) => bucketOf(fromHex(c.nullifier, 32), manifest.artifacts.nullifierTable.bucketBits)));
      expect([stats.read.calls, stats.nullifier.calls]).toEqual([2, Math.ceil(buckets.size / QUERIES_PER_CALL)]);
      expect(stats.downloads.readPublic.size).toBe(ipirMasksBytes(2048));
      const s = db.setting as { host: string; port: number; user: string; name: string; password?: string };
      const passwordFile = join(dir, "pg-password");
      writeFileSync(passwordFile, s.password ?? "", { mode: 0o600 });
      const checked = await cli(["cross-check", ...common, "--db-url", `postgres://${s.user}@${s.host}:${s.port}/${s.name}`, "--db-password-file", passwordFile]);
      expect(checked.code, checked.stderr).toBe(0);
      expect(JSON.parse(checked.stdout)).toMatchObject({ upto: 7, equal: true, differences: [] });
    });
  });

  it("restart: the stored IPIR+SP snapshot is set up again from its files and served; without the add-on, IPIR+SP snapshots are ignored and SimplePIR is built and served (edge case)", { timeout: LONG }, async () => {
    const served = await manifestOf();
    await r.close();
    r = await startModule(chain, db, { stop: 7, config: config({ snapshotEvery: 0 }) });
    await stoppedAt(r, 7);
    expect((await manifestOf()).id).toBe(served.id);
    const again = await syncWallet("A");
    await expectLedgerAgrees(SEEDS.A, again.state, 7, "A after restart");
    expect(again.manifest.padding).toEqual({ size: 2000 });

    await r.close();
    process.env.PSS_IPIR_ADDON = join(dir, "no-such-add-on.node");
    try {
      r = await startModule(chain, db, { stop: 7, config: config({ snapshotEvery: 0 }) });
      await stoppedAt(r, 7);
      const lines = r.logs.map((line) => JSON.parse(line) as Record<string, unknown>);
      const ignored = lines.filter((line) => line.event === "snapshot-ignored");
      expect(ignored.length).toBe(2);
      for (const line of ignored) expect(String(line.why)).toMatch(/PIR scheme "ipir-sp" is not available in this build: its native add-on is not built/);
      expect(lines.some((line) => line.event === "scheme-unavailable" && line.scheme === "ipir-sp")).toBe(true);
      expect((await fetch(`${r.origin}${ROUTES.manifest}`)).status).toBe(503);
      expect((await requestBuild({ height: 7 })).status).toBe(501);
      expect(await buildWith({ height: 7, scheme: "simplepir" })).toMatchObject({ ok: true, scheme: "simplepir" });
      const simple = await syncWallet("A");
      expect(simple.manifest.scheme).toBe("simplepir");
      await expectLedgerAgrees(SEEDS.A, simple.state, 7, "A under SimplePIR without the add-on");
    } finally {
      delete process.env.PSS_IPIR_ADDON;
    }
  });
});
