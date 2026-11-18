/**
 * The client end to end (spec stories 2–4, FR-110–115, FR-140, FR-142, FR-143, SC-001, SC-003) against the module in
 * UmbraDB's real process on PostgreSQL 18, over the synthetic chain of real v9 transactions (`./server-chain.ts`):
 * a snapshot built at height 4 while following, the tail to 7.
 *
 * Wallets: A and B of the chain (A: coins found by the scan in full and partial blocks, one spent before the snapshot,
 * one after it, three in the tail; B: one spent after the snapshot, two in the tail), and C, a generated wallet that
 * received nothing. The client runs with the repository's vendored ledger 9 package (the same release as
 * `@midnightntwrk/ledger-v9` 1.0.1, which the command line loads).
 */

import { mkdtempSync, rmSync, statSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { RAW } from "../../../test/ledger/adapter-fixtures.js";
import { PROCESS_BACKENDS, type ProcessDatabase } from "../../../test/runner/process-backends.js";
import { BlobCache } from "../client/cache.ts";
import { compareWithClient, readZswapEvents, replayZswapEvents } from "../client/cross-check.ts";
import { type FetchLike, PssHttp } from "../client/http.ts";
import { keysFromZswapSeed, walletKeys, type WalletKeys } from "../client/keys.ts";
import type { Ledger } from "../client/ledger.ts";
import { formatBalance, readState, unspentCoins, type WalletState, writeState } from "../client/state.ts";
import { checkCiphertext, checkLowerPath, checkSnapshotMatch, lowerPathsByPir, pathInTable, sync, type SyncResult } from "../client/sync.ts";
import { compileKernel, Kernel, ScanPool } from "../kernel/index.ts";
import { WorkerMultiplier } from "../pir/index.ts";
import { decodeReadRecord, encodeReadRecord, ROUTES, toHex } from "../shared/index.ts";
import { ADMIN_SECRET, buildAt, builtAt, type ModuleRun, startModule, stoppedAt } from "./client-harness.ts";
import { type ScenarioChain, scenarioChain } from "./server-chain.ts";

const LONG = 600_000;
const backend = PROCESS_BACKENDS.find((candidate) => candidate.kind === "postgres")!;
const ledger = RAW.v9 as unknown as Ledger;
const SEED_C = new Uint8Array(32).fill(0xc3);

let chain: ScenarioChain;
let db: ProcessDatabase;
let r: ModuleRun;
let kernel: Kernel;
let scanPool: ScanPool;
let multiplier: WorkerMultiplier;
let dir: string;
const keys: Record<"A" | "B" | "C", WalletKeys> = {} as never;

/** One request as sent: its URL and body bytes (for FR-143), beside the client's own record (FR-142). */
interface Sent {
  readonly url: string;
  readonly body: Uint8Array;
}

function recordingFetch(sent: Sent[], before?: (url: string, init: RequestInit) => Promise<void>): FetchLike {
  return async (url, init) => {
    await before?.(url, init);
    const body = init.body instanceof Uint8Array ? new Uint8Array(init.body) : new Uint8Array(0);
    sent.push({ url, body });
    return fetch(url, init);
  };
}

async function syncWallet(
  name: "A" | "B" | "C",
  options: { cache?: string; previous?: WalletState | null; sent?: Sent[]; before?: (url: string, init: RequestInit) => Promise<void> } = {},
): Promise<SyncResult & { http: PssHttp }> {
  const http = new PssHttp(r.origin, { fetch: recordingFetch(options.sent ?? [], options.before) });
  const result = await sync({
    ledger,
    keys: keys[name],
    http,
    cache: new BlobCache(options.cache ?? mkdtempSync(join(dir, `cache-${name}-`))),
    kernel,
    scanPool,
    multiplier,
    network: "custom",
    previous: options.previous ?? null,
  });
  return { ...result, http };
}

/** The ledger's own result for a wallet seed: replay of the stored events up to `upto` (FR-140). */
async function ledgerReplay(seed: Uint8Array, upto: number) {
  const rows = await readZswapEvents((q) => db.query(q), upto);
  return { rows, replay: replayZswapEvents({ v9: ledger }, seed, rows, upto) };
}

beforeAll(async () => {
  chain = await scenarioChain();
  kernel = new Kernel(compileKernel());
  scanPool = new ScanPool({ threads: 2 });
  multiplier = new WorkerMultiplier(2);
  keys.A = walletKeys(chain.wallets.A.keys as never, kernel);
  keys.B = walletKeys(chain.wallets.B.keys as never, kernel);
  keys.C = keysFromZswapSeed(ledger, SEED_C, kernel);
  dir = mkdtempSync(join(tmpdir(), "pss-client-"));
  await backend.start();
  db = await backend.database();
  r = await startModule(chain, db, {
    stop: 7,
    config: { dataDir: join(dir, "server"), pathSplit: 2, queriesPerCall: 16, snapshotEvery: 4, adminSecret: ADMIN_SECRET, threads: 2 },
  });
  await stoppedAt(r, 7);
  await builtAt(r, 4);
}, LONG);

afterAll(async () => {
  await r?.close();
  await scanPool?.close();
  await multiplier?.close();
  await backend.stop();
  if (dir !== undefined) rmSync(dir, { recursive: true, force: true });
}, LONG);

describe("sync on the synthetic chain (snapshot at 4, tail to 7)", () => {
  const results: Partial<Record<"A" | "B" | "C", SyncResult & { http: PssHttp; sent: Sent[] }>> = {};

  beforeAll(async () => {
    for (const name of ["A", "B", "C"] as const) {
      const sent: Sent[] = [];
      results[name] = { ...(await syncWallet(name, { sent })), sent };
    }
  }, LONG);

  it("stories 2–4 + FR-140 + SC-001: each wallet's coins, spends and balance equal the ledger's own replay of the stored events with the same keys, with zero differences", { timeout: LONG }, async () => {
    for (const [name, seed] of [["A", new Uint8Array(32).fill(0xa1)], ["B", new Uint8Array(32).fill(0xb2)], ["C", SEED_C]] as const) {
      const { state } = results[name]!;
      expect(state.tail.height).toBe(7);
      expect(state.snapshot.height).toBe(4);
      const { rows, replay } = await ledgerReplay(seed, 7);
      const report = compareWithClient(replay, state, rows);
      expect(report.differences, name).toEqual([]);
      expect(report.outOfScope).toEqual([]);
      expect(report.equal).toBe(true);
      expect(report.balances.client).toEqual(report.balances.ledger);
      expect(state.rejected).toEqual([]);
    }
    // Not vacuous: A and B hold coins from every source; C holds none. Outputs merged in one offer take positions in
    // the ledger's order (by commitment), so a coin is named by its value and its offer's positions.
    const check = (state: WalletState, expected: Record<string, { at: readonly number[]; spent?: [number, "snapshot" | "tail"] }>) => {
      expect(state.coins.map((c) => c.value).sort()).toEqual(Object.keys(expected).sort());
      for (const c of state.coins) {
        const e = expected[c.value]!;
        expect(e.at, `coin of ${c.value}`).toContain(c.position);
        expect(c.source).toBe(c.position < 9 ? "snapshot" : "tail");
        expect(c.spent === null ? null : [c.spent.height, c.spent.source]).toEqual(e.spent ?? null);
      }
      expect(new Set(state.coins.map((c) => c.position)).size).toBe(state.coins.length);
    };
    check(results.A!.state, {
      "100": { at: [0, 1, 2], spent: [4, "snapshot"] },
      "200": { at: [0, 1, 2], spent: [7, "tail"] },
      "300": { at: [0, 1, 2] },
      "70": { at: [6] },
      "60": { at: [7, 8] },
      "50": { at: [9] },
      "7": { at: [11, 12, 13] },
      "8": { at: [11, 12, 13] },
      "9": { at: [11, 12, 13] },
    });
    check(results.B!.state, {
      "50": { at: [3, 4], spent: [5, "tail"] },
      "60": { at: [3, 4] },
      "40": { at: [7, 8] },
      "1": { at: [10] },
      "200": { at: [14] },
    });
    expect(results.C!.state.coins).toEqual([]);
  });

  it("the client's unspent coins equal each wallet's own ZswapLocalState, which applied every offer of the chain", () => {
    for (const name of ["A", "B"] as const) {
      const local = [...chain.wallets[name].local.coins].map((c) => [Number(c.mt_index), c.type, c.value.toString(), c.nonce]).sort((x, y) => Number(x[0]) - Number(y[0]));
      const client = unspentCoins(results[name]!.state).map((c) => [c.position, c.tokenType, c.value, c.nonce]);
      expect(client).toEqual(local);
    }
  });

  it("story 3 (Q58): a sync reads no lower path; a coin in a block full at the snapshot has one in the path table, read only to spend", () => {
    for (const name of ["A", "B"] as const) {
      const { state, manifest } = results[name]!;
      expect(state.coins.every((c) => c.lowerPath === null)).toBe(true);
      // k = 2 and first_free 9 at the snapshot: blocks 0–3 and 4–7 are full, position 8 is in the partial block.
      expect(state.coins.filter((c) => pathInTable(manifest, c)).map((c) => c.position)).toEqual(state.coins.filter((c) => c.position < 8).map((c) => c.position));
    }
    expect(results.A!.state.coins.some((c) => c.position === 8 || c.position >= 9)).toBe(true);
  });

  it("FR-112, story 2 scenario 2, story 3 scenario 3: every wallet, with 9, 5 or no coins, sends one full call to each table", () => {
    for (const name of ["A", "B", "C"] as const) {
      const { stats } = results[name]!;
      expect([stats.read.calls, stats.nullifier.calls], name).toEqual([1, 1]);
    }
    expect(results.A!.stats.scan.matches).toBe(5);
    expect(results.C!.stats.scan.matches).toBe(0);
  });

  it("FR-142 + SC-003: the requests of three syncs (9, 5 and no coins) have identical sequences of method, path and body length", () => {
    const shape = (name: "A" | "B" | "C") => results[name]!.http.records.map((q) => [q.method, q.path, q.bodyBytes]);
    expect(shape("A").length).toBeGreaterThan(5);
    expect(shape("B")).toEqual(shape("A"));
    expect(shape("C")).toEqual(shape("A"));
    // The sequence: manifest, four artifacts, a read call, a nullifier call, the tail.
    expect(shape("A").map(([m, p]) => `${m} ${String(p).replace(/[0-9a-f]{64}$/, "<digest>")}`)).toEqual([
      `GET ${ROUTES.manifest}`,
      `GET ${ROUTES.blob}<digest>`,
      `GET ${ROUTES.blob}<digest>`,
      `GET ${ROUTES.blob}<digest>`,
      `GET ${ROUTES.blob}<digest>`,
      `POST ${ROUTES.queryRead}`,
      `POST ${ROUTES.queryNullifier}`,
      `GET ${ROUTES.tail}`,
    ]);
  });

  it("FR-143 + SC-003: no request URL or body holds the bytes (or hex) of a secret key or of the wallet's public keys; nor its coins' nullifiers or commitments", () => {
    const contains = (haystack: Uint8Array, needle: Uint8Array): boolean => Buffer.from(haystack).indexOf(Buffer.from(needle)) >= 0;
    /** Every 8-byte window of each value, as bytes and as hex text. */
    const needles = (values: readonly Uint8Array[]): Uint8Array[] =>
      values.flatMap((v) => {
        const out: Uint8Array[] = [];
        for (let i = 0; i + 8 <= v.length; i++) {
          out.push(v.subarray(i, i + 8));
          out.push(new TextEncoder().encode(toHex(v.subarray(i, i + 8))));
        }
        return out;
      });
    for (const name of ["A", "B", "C"] as const) {
      const k = keys[name];
      const values = [
        k.scanSecret,
        k.zswap.encryptionSecretKey.yesIKnowTheSecurityImplicationsOfThis_serialize(),
        k.zswap.coinSecretKey.yesIKnowTheSecurityImplicationsOfThis_serialize(),
        k.coinPublicKey,
        k.encryptionPublicKey,
        ...results[name]!.state.coins.flatMap((c) => [Buffer.from(c.nullifier, "hex"), Buffer.from(c.commitment, "hex")]),
      ].map((v) => new Uint8Array(v));
      const all = needles(values);
      const sent = results[name]!.sent;
      expect(sent.length).toBe(results[name]!.http.records.length);
      for (const s of sent) {
        const url = new TextEncoder().encode(s.url);
        for (const n of all) {
          expect(contains(url, n), `${name}: URL ${s.url}`).toBe(false);
          expect(contains(s.body, n), `${name}: body of ${s.url}`).toBe(false);
        }
      }
      // Negative control: the search finds a key planted in a body.
      const planted = new Uint8Array(100);
      planted.set(k.coinPublicKey.subarray(3, 11), 40);
      expect(all.some((n) => contains(planted, n))).toBe(true);
    }
  });

  it("FR-110: a second sync with the same cache downloads no artifact; the state carries no pending transfer", { timeout: LONG }, async () => {
    const cache = mkdtempSync(join(dir, "cache-again-"));
    await syncWallet("B", { cache });
    const again = await syncWallet("B", { cache });
    expect(Object.values(again.stats.downloads).map((d) => d.cached)).toEqual([true, true, true, true]);
    expect(again.http.records.filter((q) => q.path.startsWith(ROUTES.blob))).toEqual([]);
    expect(again.state.coins).toEqual(results.B!.state.coins);
  });

  it("FR-114, FR-115: the local state is written in a private directory, read back equal, and printed as a balance per token type with the unspent coins", () => {
    const path = join(dir, "wallets", "A", "state.json");
    const bytes = writeState(path, results.A!.state);
    expect(bytes).toBeGreaterThan(0);
    expect(statSync(path).mode & 0o777).toBe(0o600);
    expect(statSync(join(dir, "wallets", "A")).mode & 0o777).toBe(0o700);
    expect(readState(path)).toEqual(JSON.parse(JSON.stringify(results.A!.state)));
    const text = formatBalance(results.A!.state);
    const token = results.A!.state.coins[0]!.tokenType;
    expect(text).toContain(`${token}  ${300 + 70 + 60 + 50 + 7 + 8 + 9}`);
    expect(text).toContain("unspent coins (7)");
  });
});

describe("FR-111: a scan match the record does not confirm is dropped and reported", () => {
  it("a wrong commitment prefix, no ciphertext, an entry that is not the wallet's, a chance match; the genuine record passes; a lower path that does not give the block root fails its check", { timeout: LONG }, async () => {
    const { state, manifest, view } = await syncWallet("A");
    const coin = state.coins.find((c) => c.position === 2)!;
    const http = new PssHttp(r.origin);
    const cache = new BlobCache(mkdtempSync(join(dir, "cache-probe-")));
    await cache.fetch(http, manifest.artifacts.scan);
    const scanFile = cache.read(manifest.artifacts.scan);
    const entry = scanFile.subarray(36 * 2, 36 * 3);
    // The genuine record, rebuilt from the stored output.
    const stored = await db.query("SELECT commitment, ciphertext FROM core_ledger_state.events WHERE kind = 'zswap-output' AND tree_index = 2");
    const ciphertext = new Uint8Array(stored[0]!.ciphertext as Buffer);
    const commitment = new Uint8Array(stored[0]!.commitment as Buffer);
    const record = decodeReadRecord(encodeReadRecord(commitment, ciphertext));
    const genuine = checkSnapshotMatch(kernel, keys.A, entry, record);
    expect("coin" in genuine && toHex(genuine.commitment)).toBe(toHex(commitment));
    expect(toHex(commitment)).toBe(coin.commitment);
    const wrongPrefix = { ...record, commitmentPrefix: record.commitmentPrefix.map((b, i) => (i === 15 ? b ^ 1 : b)) };
    expect(checkSnapshotMatch(kernel, keys.A, entry, wrongPrefix)).toEqual({ reason: "the decrypted coin's commitment differs from the record's" });
    expect(checkSnapshotMatch(kernel, keys.A, entry, { ...record, elements: null })).toEqual({ reason: "the record has no ciphertext" });
    expect(checkSnapshotMatch(kernel, keys.B, entry, record)).toEqual({ reason: "the scan entry is not the wallet's" });
    // A match by chance on the 4 bytes: the other elements decrypt to garbage or to a coin whose commitment differs.
    const elements = record.elements!.map((b, i) => (i === 40 ? b ^ 1 : b));
    expect("reason" in checkSnapshotMatch(kernel, keys.A, entry, { ...record, elements })).toBe(true);
    expect("coin" in checkCiphertext(kernel, keys.A, ciphertext, commitment, null)).toBe(true);
    // The lower path a spend reads: right for the coin, wrong with one hash changed.
    const { paths } = await lowerPathsByPir({ http, cache, kernel, multiplier }, { manifest, state, view }, [coin]);
    const lower = paths.get(2)!.map((h) => new Uint8Array(Buffer.from(h, "hex")));
    const blockRoot = view.snapshotBlockRoots.subarray(0, 32);
    expect(checkLowerPath(kernel, commitment, 2, lower, blockRoot)).toBe(true);
    expect(checkLowerPath(kernel, commitment, 1, lower, blockRoot)).toBe(false);
  });
});

describe("a snapshot replaced during a sync (spec edge case: 409, start again from the new manifest)", () => {
  it("the first read call meets a new snapshot (built at 7 meanwhile): the server answers 409 and the client syncs again from the new manifest, with the same coins", { timeout: LONG }, async () => {
    let built = false;
    const result = await syncWallet("A", {
      before: async (url) => {
        if (!built && url.endsWith(ROUTES.queryRead)) {
          built = true;
          await buildAt(r, 7);
        }
      },
    });
    expect(built).toBe(true);
    expect(result.stats.attempts).toBe(2);
    expect(result.http.records.some((q) => q.status === 409)).toBe(true);
    expect(result.state.snapshot.height).toBe(7);
    // At 7 every coin is read from the snapshot, and spends at or below 7 from the nullifier table.
    const { rows, replay } = await ledgerReplay(new Uint8Array(32).fill(0xa1), 7);
    expect(compareWithClient(replay, result.state, rows).differences).toEqual([]);
    expect(result.state.coins.every((c) => c.source === "snapshot")).toBe(true);
    expect(result.state.coins.filter((c) => c.spent !== null).map((c) => c.spent!.source)).toEqual(["snapshot", "snapshot"]);
  });
});
