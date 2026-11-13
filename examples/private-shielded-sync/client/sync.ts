/**
 * `sync` (spec FR-110–115, stories 2–4): fetch the manifest; download the scan file, block roots and both setup-data
 * artifacts (skipping cached ones); scan; read the matches by PIR; decrypt and check each; look their nullifiers up by
 * PIR; fetch the tail and apply it; return the wallet's local state.
 *
 * Checks that cost nothing are made on the server's data: the manifest's identifier is its SHA-256; each artifact's
 * digest and size; the block roots give the manifest's root; a record's lower path gives its block's root; every coin's
 * commitment is recomputed from the decrypted coin (a scan match that fails is dropped and reported, FR-111); the
 * snapshot's block roots and the tail's give the tail's root. A snapshot replaced while the client syncs (409, or a
 * tail of another snapshot) starts the sync again from the new manifest, at most `maxAttempts` times.
 */

import { createHash } from "node:crypto";
import type { Coin, Kernel, ScanPool } from "../kernel/index.ts";
import { type Multiplier, LWE_N, setupMatrix } from "../pir/index.ts";
import {
  CIPHERTEXT_BYTES,
  decodeManifest,
  decodeNullifierRecord,
  decodeReadRecord,
  decodeTailOutput,
  equalBytes,
  FORMAT_VERSION,
  type Manifest,
  type ReadRecord,
  NULLIFIER_RECORD_BYTES,
  SCAN_ENTRY_BYTES,
  splitTail,
  TAIL_OUTPUT_BYTES,
  toHex,
} from "../shared/index.ts";
import { BlobCache, type FetchStat } from "./cache.ts";
import { type PssHttp, type RequestRecord, SnapshotReplaced } from "./http.ts";
import type { WalletKeys } from "./keys.ts";
import type { Ledger } from "./ledger.ts";
import { type CallStats, emptyCallStats, lookupNullifiers, readPositions } from "./pir-calls.ts";
import type { TreeView } from "./send.ts";
import { type CoinRecord, type PendingTransfer, type RejectedMatch, STATE_FORMAT, type WalletState } from "./state.ts";
import { type Hash2, levelsRoot, NODE_BYTES, rootFromPath, TREE_DEPTH, treeLevels } from "./tree.ts";

export interface SyncOptions {
  readonly ledger: Ledger;
  readonly keys: WalletKeys;
  readonly http: PssHttp;
  readonly cache: BlobCache;
  readonly kernel: Kernel;
  readonly scanPool: ScanPool;
  readonly multiplier: Multiplier;
  /** The network the manifest must name, if given. */
  readonly network?: string;
  /** The previous state: its pending transfers carry over until a sync confirms them (FR-128). */
  readonly previous?: WalletState | null;
  readonly maxAttempts?: number;
  readonly log?: (line: string) => void;
}

/** What each step took (spec §8's client rows). Times in milliseconds. */
export interface SyncStats {
  attempts: number;
  manifest: { ms: number; bytes: number };
  downloads: { scan: FetchStat; blockRoots: FetchStat; readSetup: FetchStat; nullifierSetup: FetchStat };
  cacheBytes: number;
  scan: { ms: number; entries: number; threads: number; matches: number };
  read: CallStats;
  decrypt: { ms: number; accepted: number; rejected: number };
  nullifier: CallStats & { lookups: number };
  tail: { ms: number; bytes: number; clientMs: number; outputs: number; nullifiers: number; matches: number };
  totalMs: number;
  bytesUp: number;
  bytesDown: number;
  requests: RequestRecord[];
}

export interface SyncResult {
  readonly state: WalletState;
  readonly stats: SyncStats;
  readonly manifest: Manifest;
  /** The tree data a transfer's path is built from (the snapshot's block roots and this sync's tail). */
  readonly view: TreeView;
}

const hex = toHex;

/** The upper tree's root over a list of block roots (32 bytes each), cut at k. */
export function rootOverBlocks(blockRoots: Uint8Array, k: number, hash: Hash2): Uint8Array {
  const roots: Uint8Array[] = [];
  for (let off = 0; off < blockRoots.length; off += NODE_BYTES) roots.push(blockRoots.subarray(off, off + NODE_BYTES));
  return levelsRoot(treeLevels(roots, TREE_DEPTH - k, hash));
}

/** A scan match after its checks: the coin with its commitment and lower path, or why it was dropped (FR-111). */
export type CheckedMatch = { readonly coin: Coin; readonly commitment: Uint8Array; readonly lowerPath: readonly Uint8Array[] | null } | { readonly reason: string };

/**
 * The ledger's own decryption of a full ciphertext (the kernel's `decrypt_coin`) and the commitment check: the coin is
 * kept only if `coinCommitment(coin, coinPublicKey)` equals the record's commitment.
 */
export function checkCiphertext(kernel: Kernel, keys: WalletKeys, ciphertext: Uint8Array, commitment: Uint8Array, lowerPath: readonly Uint8Array[] | null): CheckedMatch {
  const coin = kernel.decryptCoin(ciphertext, keys.scanSecret);
  if (coin === null) return { reason: "the ciphertext does not decrypt to a coin" };
  if (!equalBytes(kernel.commitment(coin, keys.coinPublicKey), commitment)) return { reason: "the decrypted coin's commitment differs from the record's" };
  return { coin, commitment, lowerPath };
}

/**
 * A scan match read by PIR: its scan entry (point, 4 bytes of element 0) and its read record (commitment, elements
 * 1–5, lower path). Element 0 encrypts zero, so it equals the first pad: the scan matched its first 4 bytes, and the
 * commitment check confirms the rest. A lower path must give the snapshot's root of the record's block.
 */
export function checkSnapshotMatch(
  kernel: Kernel,
  keys: WalletKeys,
  entry: Uint8Array,
  record: ReadRecord,
  indexInBlock: number,
  blockRoot: Uint8Array,
): CheckedMatch {
  if (record.elements === null) return { reason: "the record has no ciphertext" };
  const point = entry.subarray(0, 32);
  const pads = kernel.pads(point, keys.scanSecret);
  if (pads === null) return { reason: "the point is not one the ledger accepts" };
  if (!equalBytes(pads.subarray(0, 4), entry.subarray(32, 36))) return { reason: "the scan entry is not the wallet's" };
  if (record.lowerPath !== null) {
    const root = rootFromPath(kernel.leaf(record.commitment), indexInBlock, record.lowerPath, (a, b) => kernel.hash2(a, b)!);
    if (!equalBytes(root, blockRoot)) return { reason: "the record's lower path does not give its block's root" };
  }
  const ciphertext = new Uint8Array(CIPHERTEXT_BYTES);
  ciphertext.set(point, 0);
  ciphertext.set(pads.subarray(0, 32), 32);
  ciphertext.set(record.elements, 64);
  return checkCiphertext(kernel, keys, ciphertext, record.commitment, record.lowerPath);
}

/** The local state's record of a checked coin; its nullifier is the ledger's `coinNullifier`. */
function coinRecord(ledger: Ledger, keys: WalletKeys, position: number, m: { readonly coin: Coin; readonly commitment: Uint8Array; readonly lowerPath: readonly Uint8Array[] | null }, source: CoinRecord["source"]): CoinRecord {
  const info = { type: hex(m.coin.tokenType), nonce: hex(m.coin.nonce), value: m.coin.value };
  return {
    position,
    tokenType: info.type,
    value: m.coin.value.toString(),
    nonce: info.nonce,
    commitment: hex(m.commitment),
    nullifier: ledger.coinNullifier(info, keys.zswap.coinSecretKey),
    lowerPath: m.lowerPath === null ? null : m.lowerPath.map(hex),
    source,
    spent: null,
  };
}

/** Runs `sync`, starting again when the snapshot is replaced (at most `maxAttempts` times). */
export async function sync(options: SyncOptions): Promise<SyncResult> {
  const attempts = options.maxAttempts ?? 3;
  let last: unknown;
  for (let attempt = 1; attempt <= attempts; attempt++) {
    try {
      const result = await syncOnce(options);
      result.stats.attempts = attempt;
      return result;
    } catch (error) {
      if (!(error instanceof SnapshotReplaced)) throw error;
      options.log?.(`the snapshot was replaced during the sync (attempt ${attempt}); starting again from the new manifest`);
      last = error;
    }
  }
  throw new Error(`the snapshot was replaced ${attempts} times during the sync`, { cause: last });
}

async function syncOnce(options: SyncOptions): Promise<SyncResult> {
  const { ledger, keys, http, cache, kernel, scanPool, multiplier } = options;
  const log = options.log ?? (() => {});
  const hash: Hash2 = (a, b) => kernel.hash2(a, b)!;
  const firstRequest = http.records.length;
  const started = performance.now();

  // 1. Manifest.
  let t = performance.now();
  const served = await http.manifest();
  const idBytes = new Uint8Array(createHash("sha256").update(served.bytes).digest());
  const id = hex(idBytes);
  if (served.servedId !== null && served.servedId !== id) throw new Error(`the manifest's bytes do not hash to the identifier the server names (${served.servedId})`);
  const manifest = decodeManifest(served.bytes);
  if (manifest.formatVersion !== FORMAT_VERSION) throw new Error(`manifest format ${manifest.formatVersion}`);
  if (options.network !== undefined && manifest.network !== options.network) {
    throw new Error(`the server serves network ${manifest.network}, not ${options.network}`);
  }
  if (manifest.pir.n !== LWE_N) throw new Error(`the manifest's PIR dimension ${manifest.pir.n} is not ${LWE_N}`);
  const manifestStat = { ms: performance.now() - t, bytes: served.bytes.length };
  const k = manifest.pathSplit;
  const blockSize = 2 ** k;
  const firstFree = manifest.firstFree;
  log(`manifest ${id.slice(0, 16)}…: height ${manifest.height}, first_free ${firstFree}, k ${k}`);

  // 2. Downloads (the same four artifacts for every wallet).
  const a = manifest.artifacts;
  const downloads = {
    scan: await cache.fetch(http, a.scan),
    blockRoots: await cache.fetch(http, a.blockRoots),
    readSetup: await cache.fetch(http, a.readSetup),
    nullifierSetup: await cache.fetch(http, a.nullifierSetup),
  };
  const scanFile = cache.read(a.scan);
  const blockRoots = cache.read(a.blockRoots);
  if (!equalBytes(rootOverBlocks(blockRoots, k, hash), Buffer.from(manifest.root, "hex"))) {
    throw new Error("the snapshot's block roots do not give the manifest's root");
  }

  // 3. Scan.
  t = performance.now();
  const matches = await scanPool.scan(scanFile, keys.scanSecret);
  const scanStat = { ms: performance.now() - t, entries: firstFree, threads: scanPool.threads, matches: matches.length };
  log(`scan: ${firstFree} entries, ${matches.length} matches, ${Math.round(scanStat.ms)} ms`);

  // 4. Read the matches by PIR; decrypt and check each.
  const read = emptyCallStats();
  const readSetup = setupMatrix(cache.read(a.readSetup), a.readTable.rows);
  const records = await readPositions(http, manifest, idBytes, readSetup, matches, multiplier, read);
  t = performance.now();
  const coins: CoinRecord[] = [];
  const rejected: RejectedMatch[] = [];
  const take = (position: number, checked: CheckedMatch, source: CoinRecord["source"]): void => {
    if ("reason" in checked) rejected.push({ position, reason: checked.reason });
    else coins.push(coinRecord(ledger, keys, position, checked, source));
  };
  for (const position of matches) {
    const record = decodeReadRecord(records.get(position)!, k);
    const block = Math.floor(position / blockSize);
    const entry = scanFile.subarray(SCAN_ENTRY_BYTES * position, SCAN_ENTRY_BYTES * (position + 1));
    take(position, checkSnapshotMatch(kernel, keys, entry, record, position % blockSize, blockRoots.subarray(block * NODE_BYTES, (block + 1) * NODE_BYTES)), "snapshot");
  }
  const decryptMs = performance.now() - t;

  // 5. Nullifier lookups by PIR (one full call even with no coin).
  const nullifierStats = { ...emptyCallStats(), lookups: coins.length };
  const nullifierSetup = setupMatrix(cache.read(a.nullifierSetup), a.nullifierTable.rows);
  const found = await lookupNullifiers(http, manifest, idBytes, nullifierSetup, coins.map((c) => c.nullifier), multiplier, nullifierStats);
  for (let i = 0; i < coins.length; i++) {
    const entry = found.get(coins[i]!.nullifier);
    if (entry) coins[i] = { ...coins[i]!, spent: { height: entry.height, txIndex: entry.txIndex, source: "snapshot" } };
  }

  // 6. The tail.
  t = performance.now();
  const tailBytes = await http.tail();
  const tailFetchMs = performance.now() - t;
  t = performance.now();
  const tail = splitTail(tailBytes);
  if (!equalBytes(tail.header.snapshotId, idBytes)) throw new SnapshotReplaced("the tail belongs to another snapshot", hex(tail.header.snapshotId));
  const t0 = Math.floor(firstFree / blockSize) * blockSize;
  const outputs = tail.outputs.length / TAIL_OUTPUT_BYTES;
  if (tail.commitments.length !== (firstFree - t0) * 32) throw new Error("the tail's commitments do not cover the snapshot's partial block");
  if (tail.header.firstFree !== firstFree + outputs) throw new Error("the tail's first_free does not match its outputs");
  const allRoots = new Uint8Array((t0 / blockSize) * NODE_BYTES + tail.blockRoots.length);
  allRoots.set(blockRoots.subarray(0, (t0 / blockSize) * NODE_BYTES), 0);
  allRoots.set(tail.blockRoots, (t0 / blockSize) * NODE_BYTES);
  if (!equalBytes(rootOverBlocks(allRoots, k, hash), tail.header.root)) throw new Error("the tail's block roots do not give the tail's root");
  // Every tail output is tested (the client has their full ciphertexts): the kernel's scan on their 36-byte entries,
  // then the ledger's decryption and the commitment check on the matches (FR-113).
  const entries = new Uint8Array(outputs * SCAN_ENTRY_BYTES);
  const decodedOutputs = Array.from({ length: outputs }, (_, i) => decodeTailOutput(tail.outputs.subarray(i * TAIL_OUTPUT_BYTES, (i + 1) * TAIL_OUTPUT_BYTES)));
  decodedOutputs.forEach((o, i) => {
    if (o.ciphertext !== null) entries.set(o.ciphertext.subarray(0, SCAN_ENTRY_BYTES), i * SCAN_ENTRY_BYTES);
  });
  const tailMatches = outputs === 0 ? [] : await scanPool.scan(entries, keys.scanSecret);
  for (const i of tailMatches) {
    const o = decodedOutputs[i]!;
    take(firstFree + i, checkCiphertext(kernel, keys, o.ciphertext!, o.commitment, null), "tail");
  }
  const tailNullifiers = new Map<string, { height: number; txIndex: number }>();
  for (let off = 0; off < tail.nullifiers.length; off += NULLIFIER_RECORD_BYTES) {
    const e = decodeNullifierRecord(tail.nullifiers.subarray(off, off + NULLIFIER_RECORD_BYTES));
    tailNullifiers.set(hex(e.nullifier), { height: e.height, txIndex: e.txIndex });
  }
  for (let i = 0; i < coins.length; i++) {
    const c = coins[i]!;
    const spent = c.spent === null ? tailNullifiers.get(c.nullifier) : undefined;
    if (spent) coins[i] = { ...c, spent: { ...spent, source: "tail" } };
  }
  const tailClientMs = performance.now() - t;

  // 7. Pending transfers (FR-128): one stays until its spend is seen on chain and its change output is found.
  const byNullifier = new Map(coins.map((c) => [c.nullifier, c]));
  const commitments = new Set(coins.map((c) => c.commitment));
  const pending: PendingTransfer[] = (options.previous?.pending ?? []).filter((p) => {
    const spentSeen = byNullifier.get(p.spent.nullifier)?.spent != null || tailNullifiers.has(p.spent.nullifier);
    const changeSeen = p.change === null || commitments.has(p.change.commitment);
    return !(spentSeen && changeSeen);
  });

  coins.sort((x, y) => x.position - y.position);
  const state: WalletState = {
    format: STATE_FORMAT,
    network: manifest.network,
    snapshot: { id, height: manifest.height, firstFree, pathSplit: k },
    tail: { height: tail.header.height, blockHash: hex(tail.header.blockHash), firstFree: tail.header.firstFree, root: hex(tail.header.root) },
    coins,
    rejected,
    pending,
    syncedAt: new Date().toISOString(),
  };
  const requests = http.records.slice(firstRequest);
  const stats: SyncStats = {
    attempts: 1,
    manifest: manifestStat,
    downloads,
    cacheBytes: cache.sizeOf([a.scan, a.blockRoots, a.readSetup, a.nullifierSetup]),
    scan: scanStat,
    read,
    decrypt: { ms: decryptMs, accepted: coins.filter((c) => c.source === "snapshot").length, rejected: rejected.length },
    nullifier: nullifierStats,
    tail: { ms: tailFetchMs, bytes: tailBytes.length, clientMs: tailClientMs, outputs, nullifiers: tailNullifiers.size, matches: tailMatches.length },
    totalMs: performance.now() - started,
    bytesUp: requests.reduce((n, r) => n + r.bodyBytes, 0),
    bytesDown: requests.reduce((n, r) => n + r.answerBytes, 0),
    requests,
  };
  log(`sync: ${coins.length} coins (${coins.filter((c) => c.spent === null).length} unspent), ${rejected.length} rejected, tail at ${tail.header.height}`);
  return { state, stats, manifest, view: { pathSplit: k, snapshotFirstFree: firstFree, snapshotBlockRoots: blockRoots, tail } };
}
