/**
 * `sync` (spec FR-110–115, stories 2–4): fetch the manifest; open its PIR scheme; download the scan file, block roots
 * and the public artifacts of the read and nullifier tables (skipping cached ones); scan; read the matches by PIR;
 * decrypt and check each; look their nullifiers up by PIR; fetch the tail and apply it; return the wallet's local state.
 * A manifest naming a scheme this build does not have stops the sync with a message naming it (00058 story 2).
 *
 * Checks that cost nothing are made on the server's data: the manifest's identifier is its SHA-256; each artifact's
 * digest and size; the block roots give the manifest's root; a record's lower path gives its block's root; every coin's
 * commitment is recomputed from the decrypted coin (a scan match that fails is dropped and reported, FR-111); the
 * snapshot's block roots and the tail's give the tail's root. A snapshot replaced while the client syncs (409, or a
 * tail of another snapshot) starts the sync again from the new manifest, at most `maxAttempts` times.
 */

import { createHash } from "node:crypto";
import type { Coin, Kernel, ScanPool } from "../kernel/index.ts";
import { type Multiplier, type NullifierEntry, openWalletScheme, type WalletScheme } from "../pir/index.ts";
import {
  CIPHERTEXT_BYTES,
  decodeManifest,
  decodePathRecord,
  decodeNullifierRecord,
  decodeReadRecord,
  decodeTailOutput,
  equalBytes,
  FORMAT_VERSION,
  type Manifest,
  type ReadRecord,
  NULLIFIER_RECORD_BYTES,
  positionAtSlot,
  rebuildElements,
  SCAN_ENTRY_BYTES,
  slotCount,
  slotOf,
  splitTail,
  TAIL_OUTPUT_BYTES,
  toHex,
} from "../shared/index.ts";
import { BlobCache, type FetchStat } from "./cache.ts";
import { type PssHttp, type RequestRecord, SnapshotReplaced } from "./http.ts";
import type { WalletKeys } from "./keys.ts";
import type { Ledger } from "./ledger.ts";
import { type CallStats, emptyCallStats, lookupNullifiers, readPaths, readPositions } from "./pir-calls.ts";
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
  /** SimplePIR: the multiplication for the wallet's side of each call (`../pir/scheme.ts`). */
  readonly multiplier: Multiplier;
  /** The network the manifest must name, if given. */
  readonly network?: string;
  /** The previous state: its pending transfers carry over until a sync confirms them (FR-128). */
  readonly previous?: WalletState | null;
  readonly maxAttempts?: number;
  readonly log?: (line: string) => void;
  /** Told when each step starts and ends (the benchmark measures each step's peak memory with it). */
  readonly onStep?: (step: SyncStep, phase: "start" | "end") => void;
}

/** The steps of a sync, in order (spec FR-110; §8's client rows). */
export const SYNC_STEPS = ["manifest", "downloads", "scan", "read", "decrypt", "nullifier", "tail"] as const;
export type SyncStep = (typeof SYNC_STEPS)[number];

/** What each step took (spec §8's client rows). Times in milliseconds. */
export interface SyncStats {
  attempts: number;
  manifest: { ms: number; bytes: number };
  /** The four downloads; `readPublic` and `nullifierPublic` are the scheme's public artifacts (SimplePIR: setup data). */
  downloads: { scan: FetchStat; blockRoots: FetchStat; readPublic: FetchStat; nullifierPublic: FetchStat };
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
 * kept only if `coinCommitment(coin, coinPublicKey)` starts with `expected` — the full commitment (a tail output) or the
 * read record's first 16 bytes (Q58). The recomputed commitment is returned.
 */
export function checkCiphertext(kernel: Kernel, keys: WalletKeys, ciphertext: Uint8Array, expected: Uint8Array, lowerPath: readonly Uint8Array[] | null): CheckedMatch {
  const coin = kernel.decryptCoin(ciphertext, keys.scanSecret);
  if (coin === null) return { reason: "the ciphertext does not decrypt to a coin" };
  const commitment = kernel.commitment(coin, keys.coinPublicKey);
  if (!equalBytes(commitment.subarray(0, expected.length), expected)) return { reason: "the decrypted coin's commitment differs from the record's" };
  return { coin, commitment, lowerPath };
}

/**
 * A scan match read by PIR: its scan entry (point, 4 bytes of element 0) and its read record (16 bytes of the
 * commitment, elements 1–5 shrunk). Element 0 encrypts zero, so it equals the first pad: the scan matched its first 4
 * bytes. The wallet rebuilds elements 1–5 from its pads, decrypts the ledger's way, and checks the recomputed
 * commitment's first 16 bytes. The lower path is not read here; a spend reads it (`checkLowerPath`).
 */
export function checkSnapshotMatch(kernel: Kernel, keys: WalletKeys, entry: Uint8Array, record: ReadRecord): CheckedMatch {
  if (record.elements === null) return { reason: "the record has no ciphertext" };
  const point = entry.subarray(0, 32);
  const pads = kernel.pads(point, keys.scanSecret);
  if (pads === null) return { reason: "the point is not one the ledger accepts" };
  if (!equalBytes(pads.subarray(0, 4), entry.subarray(32, 36))) return { reason: "the scan entry is not the wallet's" };
  const ciphertext = new Uint8Array(CIPHERTEXT_BYTES);
  ciphertext.set(point, 0);
  ciphertext.set(pads.subarray(0, 32), 32);
  ciphertext.set(rebuildElements(record.elements, pads), 64);
  return checkCiphertext(kernel, keys, ciphertext, record.commitmentPrefix, null);
}

/** Whether a lower path read from the path table gives its block's root from the coin's commitment. */
export function checkLowerPath(kernel: Kernel, commitment: Uint8Array, indexInBlock: number, lowerPath: readonly Uint8Array[], blockRoot: Uint8Array): boolean {
  return equalBytes(rootFromPath(kernel.leaf(commitment), indexInBlock, lowerPath, (a, b) => kernel.hash2(a, b)!), blockRoot);
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

/** Whether a snapshot coin's lower path is in the path table: its block was full at the snapshot (k > 0). */
export function pathInTable(manifest: Pick<Manifest, "pathSplit" | "firstFree">, coin: Pick<CoinRecord, "position" | "source">): boolean {
  const size = 2 ** manifest.pathSplit;
  return manifest.pathSplit > 0 && coin.source === "snapshot" && coin.position < Math.floor(manifest.firstFree / size) * size;
}

/**
 * What reading lower paths to spend cost (Q58): the path table's public artifact (SimplePIR: setup data; once per
 * snapshot) and the call.
 */
export interface PathReadStats extends CallStats {
  readonly public: FetchStat;
  readonly ms: number;
}

/**
 * Reads the lower paths of `coins` from the path table by PIR, to spend them (Q58): downloads the table's public
 * artifact the first time (cached by digest), reads the positions in one padded call, and checks each path against its
 * block's root from the coin's commitment. Returns the paths as hex, by position.
 */
export async function lowerPathsByPir(
  options: Pick<SyncOptions, "http" | "cache" | "kernel" | "multiplier">,
  result: Pick<SyncResult, "manifest" | "state" | "view">,
  coins: readonly Pick<CoinRecord, "position" | "commitment" | "source">[],
): Promise<{ paths: Map<number, string[]>; stats: PathReadStats }> {
  const { http, cache, kernel, multiplier } = options;
  const m = result.manifest;
  const ref = m.artifacts.pathTable;
  const publicRef = m.artifacts.pathPublic;
  if (ref === undefined || publicRef === undefined) throw new Error("the snapshot has no path table (path split 0)");
  for (const c of coins) if (!pathInTable(m, c)) throw new Error(`position ${c.position} has no path in the path table (its block was not full at the snapshot)`);
  const started = performance.now();
  const scheme = await openWalletScheme(m, { multiplier });
  let records: Map<number, Uint8Array>;
  const call = emptyCallStats();
  let fetched: FetchStat;
  try {
    fetched = await cache.fetch(http, publicRef);
    const table = await scheme.openTable(ref, cache.read(publicRef));
    try {
      records = await readPaths(http, m, Buffer.from(result.state.snapshot.id, "hex"), table, coins.map((c) => c.position), call);
    } finally {
      table.dispose();
    }
  } finally {
    scheme.dispose();
  }
  const k = m.pathSplit;
  const size = 2 ** k;
  const paths = new Map<number, string[]>();
  for (const c of coins) {
    const lower = decodePathRecord(records.get(c.position)!, k);
    if (lower === null) throw new Error(`the path table holds no path for position ${c.position}`);
    const block = Math.floor(c.position / size);
    const blockRoot = result.view.snapshotBlockRoots.subarray(block * NODE_BYTES, (block + 1) * NODE_BYTES);
    if (!checkLowerPath(kernel, Buffer.from(c.commitment, "hex"), c.position % size, lower, blockRoot)) {
      throw new Error(`the lower path read for position ${c.position} does not give its block's root`);
    }
    paths.set(c.position, lower.map(hex));
  }
  return { paths, stats: { ...call, public: fetched, ms: performance.now() - started } };
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
  const { http } = options;
  const step = options.onStep ?? (() => {});
  const firstRequest = http.records.length;
  const started = performance.now();

  // 1. Manifest.
  step("manifest", "start");
  const t = performance.now();
  const served = await http.manifest();
  const idBytes = new Uint8Array(createHash("sha256").update(served.bytes).digest());
  const id = hex(idBytes);
  if (served.servedId !== null && served.servedId !== id) throw new Error(`the manifest's bytes do not hash to the identifier the server names (${served.servedId})`);
  const manifest = decodeManifest(served.bytes);
  if (manifest.formatVersion !== FORMAT_VERSION) throw new Error(`manifest format ${manifest.formatVersion}`);
  if (options.network !== undefined && manifest.network !== options.network) {
    throw new Error(`the server serves network ${manifest.network}, not ${options.network}`);
  }
  // The scheme's parameters are checked against this build's here (SimplePIR: all five of them); a scheme this build
  // does not have stops the sync with its name.
  const scheme = await openWalletScheme(manifest, { multiplier: options.multiplier });
  try {
    return await syncWith(options, scheme, { manifest, idBytes, id, manifestStat: { ms: performance.now() - t, bytes: served.bytes.length }, started, firstRequest });
  } finally {
    scheme.dispose();
  }
}

/** What step 1 of a sync gives the rest. */
interface ManifestStep {
  readonly manifest: Manifest;
  readonly idBytes: Uint8Array;
  readonly id: string;
  readonly manifestStat: { readonly ms: number; readonly bytes: number };
  readonly started: number;
  readonly firstRequest: number;
}

/** Steps 1 (its end) to 7 of a sync, with the snapshot's scheme open. */
async function syncWith(options: SyncOptions, scheme: WalletScheme, at: ManifestStep): Promise<SyncResult> {
  const { ledger, keys, http, cache, kernel, scanPool } = options;
  const log = options.log ?? (() => {});
  const step = options.onStep ?? (() => {});
  const hash: Hash2 = (a, b) => kernel.hash2(a, b)!;
  const { manifest, idBytes, id, manifestStat, started, firstRequest } = at;
  let t: number;
  const k = manifest.pathSplit;
  const blockSize = 2 ** k;
  const firstFree = manifest.firstFree;
  log(`manifest ${id.slice(0, 16)}…: height ${manifest.height}, first_free ${firstFree}, k ${k}`);
  step("manifest", "end");

  // 2. Downloads (the same four artifacts for every wallet).
  step("downloads", "start");
  const a = manifest.artifacts;
  const downloads = {
    scan: await cache.fetch(http, a.scan),
    blockRoots: await cache.fetch(http, a.blockRoots),
    readPublic: await cache.fetch(http, a.readPublic),
    nullifierPublic: await cache.fetch(http, a.nullifierPublic),
  };
  const scanFile = cache.read(a.scan);
  const blockRoots = cache.read(a.blockRoots);
  if (!equalBytes(rootOverBlocks(blockRoots, k, hash), Buffer.from(manifest.root, "hex"))) {
    throw new Error("the snapshot's block roots do not give the manifest's root");
  }
  step("downloads", "end");

  // 3. Scan.
  step("scan", "start");
  t = performance.now();
  // The scan finds slots; a padded snapshot's slot maps to its tree position, or to none for noise (Q57).
  const matches: number[] = [];
  let noiseMatches = 0;
  for (const s of await scanPool.scan(scanFile, keys.scanSecret)) {
    const position = positionAtSlot(manifest, s);
    if (position === null) noiseMatches++;
    else matches.push(position);
  }
  const scanStat = { ms: performance.now() - t, entries: slotCount(manifest), threads: scanPool.threads, matches: matches.length };
  log(`scan: ${scanStat.entries} entries, ${matches.length} matches${noiseMatches > 0 ? ` (and ${noiseMatches} in the padding, dropped)` : ""}, ${Math.round(scanStat.ms)} ms`);
  step("scan", "end");

  // 4. Read the matches by PIR; decrypt and check each.
  step("read", "start");
  const read = emptyCallStats();
  const readTable = await scheme.openTable(a.readTable, cache.read(a.readPublic));
  let records: Map<number, Uint8Array>;
  try {
    records = await readPositions(http, manifest, idBytes, readTable, matches, read);
  } finally {
    readTable.dispose();
  }
  step("read", "end");
  step("decrypt", "start");
  t = performance.now();
  const coins: CoinRecord[] = [];
  const rejected: RejectedMatch[] = [];
  const take = (position: number, checked: CheckedMatch, source: CoinRecord["source"]): void => {
    if ("reason" in checked) rejected.push({ position, reason: checked.reason });
    else coins.push(coinRecord(ledger, keys, position, checked, source));
  };
  for (const position of matches) {
    const record = decodeReadRecord(records.get(position)!);
    const slot = slotOf(manifest, position);
    const entry = scanFile.subarray(SCAN_ENTRY_BYTES * slot, SCAN_ENTRY_BYTES * (slot + 1));
    const checked = checkSnapshotMatch(kernel, keys, entry, record);
    // With k = 0 the path is all above the blocks: there is no lower path to read.
    take(position, "reason" in checked || k > 0 ? checked : { ...checked, lowerPath: [] }, "snapshot");
  }
  const decryptMs = performance.now() - t;
  step("decrypt", "end");

  // 5. Nullifier lookups by PIR (one full call even with no coin).
  step("nullifier", "start");
  const nullifierStats = { ...emptyCallStats(), lookups: coins.length };
  const nullifierTable = await scheme.openTable(a.nullifierTable, cache.read(a.nullifierPublic));
  let found: Map<string, NullifierEntry | null>;
  try {
    found = await lookupNullifiers(http, manifest, idBytes, nullifierTable, coins.map((c) => c.nullifier), nullifierStats);
  } finally {
    nullifierTable.dispose();
  }
  for (let i = 0; i < coins.length; i++) {
    const entry = found.get(coins[i]!.nullifier);
    if (entry) coins[i] = { ...coins[i]!, spent: { height: entry.height, txIndex: entry.txIndex, source: "snapshot" } };
  }
  step("nullifier", "end");

  // 6. The tail.
  step("tail", "start");
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
  step("tail", "end");

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
    cacheBytes: cache.sizeOf([a.scan, a.blockRoots, a.readPublic, a.nullifierPublic]),
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
