/**
 * The wallet's Dust sync (spec 00062 story 2, FR-020 to FR-025): download the Dust file, the wallet's first coins and
 * generation updates and the Dust parameters from the module, then walk each of the wallet's chains through the file.
 *
 * A chain starts from a first coin (a `dust-initial-utxo` event) whose owner is the wallet's Dust public key. The walk
 * computes the coin's nullifier, searches the file for its prefix from the first entry whose commitment position is
 * above the coin's own (a spend's new commitment is always appended after the coin it spends), derives the next coin
 * from the matching entry with the ledger's `successorDustUtxo`, and repeats from the entry after the match.
 *
 * The file is read once for all chains (spec 00062 phase 8): each chain's wanted prefix is kept in a map from prefix to
 * the chains waiting on it, and each entry, in order, is looked up there; a chain takes the entry when it is at or after
 * the chain's place, derives its next coin, and waits on that coin's prefix from the next entry on, in the same pass. A
 * successor's spend is always later in the file, so one pass finds every spend of every chain, as a search per chain
 * would (`walkDustChainsOneByOne`, kept as the reference the tests compare it with).
 *
 * The generation record passed to `successorDustUtxo` is the first coin's, with its `dtime` once an update of that
 * record (same nonce) exists: the Night output behind a chain is spent once, so a record has at most one `dtime`; a
 * `dtime` later than a spend's declared time leaves the value derived for that spend unchanged (checked against the
 * ledger in `test/dust-walk.test.ts`).
 *
 * A 4-byte prefix can match another wallet's spend, so a chain's end is checked (FR-023, `./dust-check.ts`): once no
 * chain finds a further match, the last derived coin of every chain with a spend is checked in one batch (one padded
 * PIR call per `queriesPerCall` chains); a refused match is dropped, that chain's search resumes after it from the coin
 * before, and its new end is checked in a further batch. A chain whose end the check table does not reach yet is
 * reported as not checkable. Without a check, each step still reports the file entry it was taken from.
 *
 * The ledger's functions are behind {@link DustFunctions}, so a test can replace them. The secret key never leaves
 * {@link ledgerDustFunctions}; nothing here logs or returns it.
 */

import { createHash } from "node:crypto";
import {
  decodeDustChunk,
  type DustChunk,
  type DustCoinsAnswer,
  type DustManifest,
  type DustParametersAnswer,
  dustPrefixOfField,
  findDustPrefix,
  fromHex,
  ROUTES,
} from "../shared/index.ts";
import { type DustChecker, type DustCheckOutcome, isDustCheckReplaced } from "./dust-check.ts";
import type { PssHttp, RequestRecord } from "./http.ts";
import type { Ledger } from "./ledger.ts";

/** A Dust coin as the ledger package gives it (`QualifiedDustOutput`). */
export type DustCoin = ReturnType<Ledger["successorDustUtxo"]>;
/** A generation record (`DustGenerationInfo`). */
export type DustGeneration = Parameters<Ledger["successorDustUtxo"]>[4];
type DustSecretKey = Parameters<Ledger["dustNullifier"]>[1];
type DustParameters = Parameters<Ledger["successorDustUtxo"]>[6];

/** What the walk needs from the ledger, with the wallet's secret key and the parameters bound in. */
export interface DustFunctions {
  nullifier(coin: DustCoin): bigint;
  successor(coin: DustCoin, time: Date, fee: bigint, position: bigint, generation: DustGeneration): DustCoin;
}

/** The ledger package's functions for one secret key and the parameters in force. */
export function ledgerDustFunctions(ledger: Ledger, secretKey: DustSecretKey, parameters: DustParameters): DustFunctions {
  return {
    nullifier: (coin) => ledger.dustNullifier(coin, secretKey),
    successor: (coin, time, fee, position, generation) => ledger.successorDustUtxo(coin, time, fee, position, generation, secretKey, parameters),
  };
}

/** A chain's first coin, from its `dust-initial-utxo` event. */
export interface DustChainStart {
  readonly height: number;
  readonly generationIndex: bigint;
  readonly coin: DustCoin;
  readonly generation: DustGeneration;
}

/** A generation update: its record's nonce and `dtime`. */
export interface DustUpdate {
  readonly height: number;
  readonly nonce: string;
  readonly dtime: Date | undefined;
}

/** One match taken: the file's entry, its public values, and the coin derived from it. */
export interface DustStep {
  readonly entry: number;
  readonly position: number;
  readonly time: number;
  readonly fee: bigint;
  readonly coin: DustCoin;
}

/**
 * Where a chain's walk ended: `no-spend` (its first coin is public and needs no check), `checked` (the last coin's
 * commitment is the one at its position), `not-checkable` (the check table does not reach its position yet), or
 * `unchecked` (no check was made).
 */
export type DustChainStatus = "no-spend" | "checked" | "not-checkable" | "unchecked";

export interface DustChain {
  readonly start: DustChainStart;
  /** The generation record the walk passed (the first coin's, with its update's `dtime` when there is one). */
  readonly generation: DustGeneration;
  readonly steps: readonly DustStep[];
  /** Entries whose match the check refused, in the order dropped. */
  readonly dropped: readonly number[];
  /** The chain's current coin: the last step's, or the first coin. */
  readonly coin: DustCoin;
  readonly status: DustChainStatus;
}

/**
 * Checks a chain's last derived coin, taken from file entry `entry`: true when it is the coin the chain recorded there
 * (the private check of FR-023 reads the commitment at the coin's position).
 */
export type DustCheck = (coin: DustCoin, entry: number) => boolean | Promise<boolean>;

/** Checks several chains' last derived coins at once (one PIR batch); one outcome per coin, in order. */
export type DustBatchCheck = (ends: readonly { readonly coin: DustCoin; readonly entry: number }[]) => Promise<readonly DustCheckOutcome[]>;

/** The decoded chunks of the file as one list of entries. */
export class DustFileView {
  readonly chunks: readonly DustChunk[];
  readonly entries: number;
  readonly prefixBytes: number;

  /** Chunks in order, each starting where the one before ended. */
  constructor(chunks: readonly DustChunk[], prefixBytes: number) {
    let next = 0;
    chunks.forEach((c, n) => {
      if (c.first !== next) throw new Error(`a Dust chunk starts at entry ${c.first}, the one before ended at ${next}`);
      if (c.prefixBytes !== prefixBytes) throw new Error(`a Dust chunk of ${c.prefixBytes}-byte prefixes in a file of ${prefixBytes}`);
      if (n > 0 && c.positions[0]! <= chunks[n - 1]!.positions[chunks[n - 1]!.count - 1]!) throw new Error(`the Dust chunk at entry ${c.first} does not continue the positions`);
      next += c.count;
    });
    this.chunks = chunks;
    this.entries = next;
    this.prefixBytes = prefixBytes;
  }

  /** The index of the chunk holding entry `entry` (0 ≤ entry < entries). */
  #chunkIndexOf(entry: number): number {
    let lo = 0;
    let hi = this.chunks.length - 1;
    while (lo < hi) {
      const mid = (lo + hi + 1) >>> 1;
      if (this.chunks[mid]!.first <= entry) lo = mid;
      else hi = mid - 1;
    }
    return lo;
  }

  entry(i: number): { readonly time: number; readonly fee: bigint; readonly position: number } {
    if (!Number.isInteger(i) || i < 0 || i >= this.entries) throw new Error(`the Dust file has no entry ${i}`);
    const c = this.chunks[this.#chunkIndexOf(i)]!;
    const k = i - c.first;
    return { time: c.times[k]!, fee: c.fees[k]!, position: c.positions[k]! };
  }

  /** The first entry whose commitment position is above `position` (positions rise), or `entries`. */
  firstAbove(position: number): number {
    let lo = 0;
    let hi = this.entries;
    while (lo < hi) {
      const mid = (lo + hi) >>> 1;
      if (this.entry(mid).position <= position) lo = mid + 1;
      else hi = mid;
    }
    return lo;
  }

  /** The first entry at or after `from` whose prefix is `prefix`, or −1. */
  find(prefix: Uint8Array, from: number): number {
    if (from >= this.entries) return -1;
    for (let c = this.#chunkIndexOf(Math.max(0, from)); c < this.chunks.length; c++) {
      const chunk = this.chunks[c]!;
      const at = findDustPrefix(chunk, prefix, Math.max(0, from - chunk.first));
      if (at >= 0) return chunk.first + at;
    }
    return -1;
  }
}

/** The generation record a chain's walk passes: the first coin's, with the `dtime` of the last update of that record. */
export function generationOf(start: DustChainStart, updates: readonly DustUpdate[]): DustGeneration {
  const update = updates.filter((u) => u.nonce === start.generation.nonce).at(-1);
  return update === undefined ? start.generation : { ...start.generation, dtime: update.dtime };
}

/** One chain's walk in progress. */
interface Walker {
  readonly start: DustChainStart;
  readonly generation: DustGeneration;
  readonly steps: DustStep[];
  readonly dropped: number[];
  coin: DustCoin;
  /** The file entry the search goes on from. */
  from: number;
  /** Null while its end waits for a check. */
  status: DustChainStatus | null;
}

/**
 * A prefix as a map key: its bytes little-endian as a number when it is at most 4 bytes (a 4-byte prefix is a 32-bit
 * number), else its bytes as a string. The filter index is its first two bytes (its first byte when it has one).
 */
function prefixKey(bytes: Uint8Array, at: number, width: number): number | string {
  if (width <= 4) {
    let v = 0;
    for (let k = width - 1; k >= 0; k--) v = v * 256 + bytes[at + k]!;
    return v;
  }
  let out = "";
  for (let k = 0; k < width; k++) out += String.fromCharCode(bytes[at + k]!);
  return out;
}
const filterIndex = (bytes: Uint8Array, at: number, width: number): number => bytes[at]! | (width > 1 ? bytes[at + 1]! << 8 : 0);
/** Whether this platform's 32-bit arrays are little-endian, as the prefixes' keys are. */
const LITTLE_ENDIAN = new Uint8Array(Uint32Array.of(1).buffer)[0] === 1;

/**
 * Advances `walkers` together in one pass over the file: each waits on its coin's nullifier prefix in a map (with a
 * count by the prefix's first two bytes, so most entries cost one array read), and takes an entry with that prefix at
 * or after its place; it then derives its next coin and waits on that coin's prefix from the next entry on. Two chains
 * may wait on one prefix: each takes the entry. The pass stops when no chain waits or the file ends.
 */
function advanceAll(file: DustFileView, walkers: readonly Walker[], functions: DustFunctions): void {
  if (walkers.length === 0) return;
  const width = file.prefixBytes;
  const waiting = new Map<number | string, Walker[]>();
  const counts = new Uint32Array(65_536);
  let left = 0;
  const wait = (w: Walker): void => {
    const prefix = dustPrefixOfField(functions.nullifier(w.coin), width);
    const key = prefixKey(prefix, 0, width);
    const list = waiting.get(key);
    if (list === undefined) waiting.set(key, [w]);
    else list.push(w);
    counts[filterIndex(prefix, 0, width)]!++;
    left++;
  };
  let from = file.entries;
  for (const w of walkers) {
    if (w.from >= file.entries) continue;
    wait(w);
    from = Math.min(from, w.from);
  }
  /** Entry `k` of `chunk` has a prefix some chain waits on (`key`, counted under `f`): the chains at or before it take it. */
  const hit = (chunk: DustChunk, k: number, key: number | string, f: number): void => {
    const list = waiting.get(key);
    if (list === undefined) return;
    const i = chunk.first + k;
    // A chain whose place is later (it started further on, or resumes after a dropped match) keeps waiting.
    const taking = list.filter((w) => w.from <= i);
    if (taking.length === 0) return;
    const staying = list.filter((w) => w.from > i);
    if (staying.length === 0) waiting.delete(key);
    else waiting.set(key, staying);
    counts[f]! -= taking.length;
    left -= taking.length;
    const time = chunk.times[k]!;
    const fee = chunk.fees[k]!;
    const position = chunk.positions[k]!;
    for (const w of taking) {
      w.coin = functions.successor(w.coin, new Date(time * 1000), fee, BigInt(position), w.generation);
      w.steps.push({ entry: i, position, time, fee, coin: w.coin });
      w.from = i + 1;
      if (w.from < file.entries) wait(w);
    }
  };
  for (const chunk of file.chunks) {
    if (left === 0) return;
    if (chunk.first + chunk.count <= from) continue;
    const prefixes = chunk.prefixes;
    const k0 = Math.max(0, from - chunk.first);
    if (width === 4 && LITTLE_ENDIAN && prefixes.byteOffset % 4 === 0) {
      // 4-byte prefixes read as 32-bit numbers, which are their keys: most entries cost one read and one count.
      const words = new Uint32Array(prefixes.buffer, prefixes.byteOffset, chunk.count);
      for (let k = k0; k < chunk.count; k++) {
        const v = words[k]!;
        if (counts[v & 0xffff] !== 0) {
          hit(chunk, k, v, v & 0xffff);
          if (left === 0) return;
        }
      }
    } else {
      for (let k = k0; k < chunk.count; k++) {
        const at = k * width;
        const f = filterIndex(prefixes, at, width);
        if (counts[f] !== 0) {
          hit(chunk, k, prefixKey(prefixes, at, width), f);
          if (left === 0) return;
        }
      }
    }
  }
}

/** Searches the file from the walker's place, taking every match, until none is found (one chain at a time). */
function advance(file: DustFileView, w: Walker, functions: DustFunctions): void {
  for (;;) {
    const found = file.find(dustPrefixOfField(functions.nullifier(w.coin), file.prefixBytes), w.from);
    if (found < 0) return;
    const e = file.entry(found);
    w.coin = functions.successor(w.coin, new Date(e.time * 1000), e.fee, BigInt(e.position), w.generation);
    w.steps.push({ entry: found, position: e.position, time: e.time, fee: e.fee, coin: w.coin });
    w.from = found + 1;
  }
}

/**
 * Walks every chain through the file, in one pass for all of them. With `check`, the chains' ends are checked together,
 * batch after batch, until every chain's end is confirmed, not checkable, or back at its first coin; the chains whose
 * last match was refused resume together, in one more pass from the earliest of their places. Without a check, each
 * chain ends `unchecked` (or `no-spend`).
 */
export async function walkDustChains(
  file: DustFileView,
  starts: readonly DustChainStart[],
  updates: readonly DustUpdate[],
  functions: DustFunctions,
  check?: DustBatchCheck,
): Promise<DustChain[]> {
  return walkWith((walkers) => advanceAll(file, walkers, functions), file, starts, updates, check);
}

/**
 * The same walk, searching the file once per chain: the reference `walkDustChains` is compared with in the tests and
 * the benchmark (`bench/dust-walk.ts`). Its results are the same; it reads the file once per chain.
 */
export async function walkDustChainsOneByOne(
  file: DustFileView,
  starts: readonly DustChainStart[],
  updates: readonly DustUpdate[],
  functions: DustFunctions,
  check?: DustBatchCheck,
): Promise<DustChain[]> {
  return walkWith((walkers) => {
    for (const w of walkers) advance(file, w, functions);
  }, file, starts, updates, check);
}

async function walkWith(
  advanceMany: (walkers: readonly Walker[]) => void,
  file: DustFileView,
  starts: readonly DustChainStart[],
  updates: readonly DustUpdate[],
  check?: DustBatchCheck,
): Promise<DustChain[]> {
  const walkers: Walker[] = starts.map((start) => ({
    start,
    generation: generationOf(start, updates),
    steps: [],
    dropped: [],
    coin: start.coin,
    from: file.firstAbove(Number(start.coin.mtIndex)),
    status: null,
  }));
  advanceMany(walkers);
  for (;;) {
    for (const w of walkers) if (w.status === null && w.steps.length === 0) w.status = "no-spend";
    const open = walkers.filter((w) => w.status === null);
    if (open.length === 0) break;
    if (check === undefined) {
      for (const w of open) w.status = "unchecked";
      break;
    }
    const outcomes = await check(open.map((w) => ({ coin: w.coin, entry: w.steps.at(-1)!.entry })));
    const resuming: Walker[] = [];
    open.forEach((w, i) => {
      const outcome = outcomes[i];
      if (outcome === "match") w.status = "checked";
      else if (outcome === "beyond") w.status = "not-checkable";
      else if (outcome === "mismatch") {
        // The last match was another wallet's: dropped, and the search resumes after it from the coin before.
        const last = w.steps.pop()!;
        w.dropped.push(last.entry);
        w.coin = w.steps.at(-1)?.coin ?? w.start.coin;
        w.from = last.entry + 1;
        resuming.push(w);
      } else throw new Error(`a check gave ${String(outcome)} for a chain's end`);
    });
    advanceMany(resuming);
  }
  return walkers.map((w) => ({ start: w.start, generation: w.generation, steps: w.steps, dropped: w.dropped, coin: w.coin, status: w.status! }));
}

/** Walks one chain through the file, its end checked one coin at a time by `check` when given. */
export async function walkDustChain(file: DustFileView, start: DustChainStart, updates: readonly DustUpdate[], functions: DustFunctions, check?: DustCheck): Promise<DustChain> {
  const batch: DustBatchCheck | undefined =
    check === undefined ? undefined : async (ends) => Promise.all(ends.map(async (e) => ((await check(e.coin, e.entry)) ? ("match" as const) : ("mismatch" as const))));
  return (await walkDustChains(file, [start], updates, functions, batch))[0]!;
}

/** The first coins and updates of a coins answer, decoded; events of another owner, or another kind, are refused. */
export function decodeDustCoins(ledger: Ledger, answer: DustCoinsAnswer, owner: bigint): { starts: DustChainStart[]; updates: DustUpdate[] } {
  if (answer.owner !== owner.toString()) throw new Error("the server answered for another owner");
  const content = (bytes: string, tag: string): Record<string, unknown> => {
    const c = ledger.Event.deserialize(fromHex(bytes)).content as unknown as Record<string, unknown>;
    if (c.tag !== tag) throw new Error(`the server gave an event tagged ${String(c.tag)} as a ${tag}`);
    return c;
  };
  const starts = answer.firstCoins.map((e): DustChainStart => {
    const c = content(e.bytes, "dustInitialUtxo") as { output: DustCoin; generation: DustGeneration; generationIndex: bigint };
    if (c.output.owner !== owner || c.generation.owner !== owner) throw new Error(`the server gave a first coin of another owner (height ${e.height})`);
    return { height: e.height, generationIndex: c.generationIndex, coin: c.output, generation: c.generation };
  });
  const updates = answer.updates.map((e): DustUpdate => {
    const c = content(e.bytes, "dustGenerationDtimeUpdate") as { update: { annotation: DustGeneration } };
    if (c.update.annotation.owner !== owner) throw new Error(`the server gave an update of another owner (height ${e.height})`);
    return { height: e.height, nonce: c.update.annotation.nonce, dtime: c.update.annotation.dtime };
  });
  return { starts, updates };
}

/**
 * Files kept by SHA-256 (the Dust file's chunks, the check table's public artifact): the command line's on disk
 * (`DiskDustCache`, `./cache.ts`), the page's in memory (a `Map`). A full chunk, and a chunk at a given entry count,
 * never changes, so a wallet that kept it never downloads it again.
 */
export interface DustCache {
  get(sha256: string): Uint8Array | undefined;
  set(sha256: string, bytes: Uint8Array): unknown;
}

/** One chunk of a download: where it came from and what it cost. */
export interface DustChunkFetch {
  readonly n: number;
  readonly first: number;
  readonly count: number;
  readonly firstHeight: number;
  readonly lastHeight: number;
  readonly bytes: number;
  readonly sha256: string;
  readonly cached: boolean;
  readonly ms: number;
}

/**
 * The Dust file, downloaded and checked against its manifest: each chunk at the entry count the manifest lists, from
 * `cache` when it holds the chunk's SHA-256 (checked again) and kept there once downloaded.
 */
export async function downloadDustFile(http: PssHttp, cache?: DustCache): Promise<{ manifest: DustManifest; file: DustFileView; chunks: DustChunkFetch[] }> {
  const manifest = await http.dustManifest();
  if (manifest.version !== 1) throw new Error(`a Dust manifest of version ${String(manifest.version)}; this wallet reads version 1`);
  const chunks: DustChunk[] = [];
  const fetches: DustChunkFetch[] = [];
  for (const [n, ref] of manifest.chunks.entries()) {
    const started = performance.now();
    const kept = cache?.get(ref.sha256);
    const cached = kept !== undefined && kept.length === ref.bytes && createHash("sha256").update(kept).digest("hex") === ref.sha256;
    const bytes = cached ? kept : await http.dustChunk(n, ref.count);
    const sha256 = createHash("sha256").update(bytes).digest("hex");
    if (bytes.length !== ref.bytes || sha256 !== ref.sha256) throw new Error(`Dust chunk ${n}: ${bytes.length} bytes with SHA-256 ${sha256}, the manifest names ${ref.bytes} and ${ref.sha256}`);
    const chunk = decodeDustChunk(bytes);
    if (chunk.first !== ref.first || chunk.count !== ref.count || chunk.firstHeight !== ref.firstHeight) throw new Error(`Dust chunk ${n} is not the one the manifest lists`);
    if (!cached) cache?.set(ref.sha256, bytes);
    chunks.push(chunk);
    fetches.push({ n, first: ref.first, count: ref.count, firstHeight: ref.firstHeight, lastHeight: ref.lastHeight, bytes: bytes.length, sha256, cached, ms: performance.now() - started });
  }
  const file = new DustFileView(chunks, manifest.prefixBytes);
  if (file.entries !== manifest.entries) throw new Error(`the Dust chunks hold ${file.entries} entries, the manifest ${manifest.entries}`);
  return { manifest, file, chunks: fetches };
}

/**
 * A chain as the command line and the page show it, every number that may pass 2^53 in decimal: the first coin, the
 * spends found (with their file entries), the check, the false matches dropped, and the current coin.
 */
export interface DustChainSummary {
  readonly firstCoinHeight: number;
  readonly generationIndex: string;
  /** Stars of Night behind the chain. */
  readonly nightValue: string;
  /** When the Night output was spent (the generation record's `dtime`), or null. */
  readonly dtime: string | null;
  readonly spends: number;
  /** The file entries the spends were taken from. */
  readonly entries: readonly number[];
  readonly status: DustChainStatus;
  readonly falseMatchesDropped: number;
  readonly droppedEntries: readonly number[];
  readonly coin: {
    readonly seq: number;
    readonly position: string;
    readonly ctime: string;
    /** Specks. */
    readonly valueAtCreation: string;
    readonly valueNow: string;
    readonly commitment: string;
  };
}

/** What the check of a chain found, in words (`commitments`: the positions the check table covers). */
export function dustStatusText(c: DustChainSummary, commitments: number | null): string {
  if (c.status === "checked") return `checked: the record at position ${c.coin.position} is the last coin's commitment`;
  if (c.status === "not-checkable") return `not checkable yet: the check table covers positions below ${commitments ?? "?"}`;
  if (c.status === "no-spend") return "nothing to check: the first coin is public";
  return "not checked";
}

export function dustChainSummary(c: DustChain, valueNow: bigint, commitment: bigint): DustChainSummary {
  return {
    firstCoinHeight: c.start.height,
    generationIndex: c.start.generationIndex.toString(),
    nightValue: c.start.generation.value.toString(),
    dtime: c.generation.dtime?.toISOString() ?? null,
    spends: c.steps.length,
    entries: c.steps.map((step) => step.entry),
    status: c.status,
    falseMatchesDropped: c.dropped.length,
    droppedEntries: c.dropped,
    coin: {
      seq: c.coin.seq,
      position: c.coin.mtIndex.toString(),
      ctime: c.coin.ctime.toISOString(),
      valueAtCreation: c.coin.initialValue.toString(),
      valueNow: valueNow.toString(),
      commitment: `0x${commitment.toString(16).padStart(64, "0")}`,
    },
  };
}

/** What a Dust sync moved, split as the command line prints it, from the requests' records (bodies' lengths). */
export function dustTransfer(records: readonly RequestRecord[]) {
  const sum = (paths: readonly string[], field: "answerBytes" | "bodyBytes"): number =>
    records.filter((r) => paths.some((p) => r.path.startsWith(p))).reduce((t, r) => t + r[field], 0);
  const checkPaths = [ROUTES.dustCheckManifest, ROUTES.dustCheckBlob, ROUTES.dustCheckQuery];
  return {
    requests: records.length,
    down: sum([""], "answerBytes"),
    up: sum([""], "bodyBytes"),
    manifest: sum([ROUTES.dustManifest], "answerBytes"),
    chunks: sum([ROUTES.dustChunk], "answerBytes"),
    coins: sum([ROUTES.dustCoins], "answerBytes"),
    parameters: sum([ROUTES.dustParameters], "answerBytes"),
    check: {
      requests: records.filter((r) => checkPaths.some((p) => r.path.startsWith(p))).length,
      manifest: sum([ROUTES.dustCheckManifest], "answerBytes"),
      publicArtifact: sum([ROUTES.dustCheckBlob], "answerBytes"),
      calls: records.filter((r) => r.path === ROUTES.dustCheckQuery).length,
      callsUp: sum([ROUTES.dustCheckQuery], "bodyBytes"),
      callsDown: sum([ROUTES.dustCheckQuery], "answerBytes"),
    },
  };
}

export interface DustSyncResult {
  readonly manifest: DustManifest;
  readonly parameters: DustParametersAnswer;
  /** The wallet's Dust public key. */
  readonly owner: bigint;
  readonly chains: readonly DustChain[];
  readonly updates: readonly DustUpdate[];
  /** Each chain's current coin's value at `at`, in Specks. */
  readonly values: readonly bigint[];
  /** Each chain's current coin's commitment. */
  readonly commitments: readonly bigint[];
  /** The check table used, when the chains were checked. */
  readonly checker: DustChecker | null;
  /** Each chunk of the download: from the cache or downloaded. */
  readonly chunks: readonly DustChunkFetch[];
  readonly at: Date;
  readonly ms: number;
}

/** A field element as 32 bytes, little-endian (as the check table holds a commitment). */
export function fieldBytes(value: bigint): Uint8Array {
  const out = new Uint8Array(32);
  let rest = value;
  for (let i = 0; i < 32; i++) {
    out[i] = Number(rest & 0xffn);
    rest >>= 8n;
  }
  return out;
}

/**
 * The whole Dust sync of one wallet: the key from its Dust seed (FR-020, as the wallet SDK derives it), the downloads,
 * and a walk of each chain, checked through the check table when `openChecker` is given (FR-023). A check table
 * replaced while the wallet calls it (409) is opened again and the walk made again, at most twice. The secret key is
 * cleared before this returns; the checker is the caller's to dispose.
 */
export async function dustSync(options: {
  readonly ledger: Ledger;
  readonly dustSeed: Uint8Array;
  readonly http: PssHttp;
  /** Opens the check table; null when the server serves none (the chains then end unchecked). */
  readonly openChecker?: () => Promise<DustChecker | null>;
  /** Keeps the chunks by SHA-256, so a later sync downloads only the new ones. */
  readonly cache?: DustCache;
  readonly now?: Date;
  readonly log?: (line: string) => void;
}): Promise<DustSyncResult> {
  const { ledger, http } = options;
  const log = options.log ?? (() => {});
  const started = performance.now();
  const secretKey = ledger.DustSecretKey.fromSeed(options.dustSeed);
  let checker: DustChecker | null = null;
  try {
    const owner = secretKey.publicKey;
    const { manifest, file, chunks: fetches } = await downloadDustFile(http, options.cache);
    log(`Dust file to height ${manifest.height}: ${manifest.entries} entries in ${manifest.chunks.length} chunks`);
    const parameters = await http.dustParameters();
    const params = new ledger.DustParameters(BigInt(parameters.nightDustRatio), BigInt(parameters.generationDecayRate), BigInt(parameters.dustGracePeriodSeconds));
    const { starts, updates } = decodeDustCoins(ledger, await http.dustCoins(owner), owner);
    log(`${starts.length} first coins and ${updates.length} generation updates of this key in the era`);
    const functions = ledgerDustFunctions(ledger, secretKey, params);
    let chains: DustChain[] = [];
    for (let attempt = 1; ; attempt++) {
      try {
        if (options.openChecker !== undefined) {
          checker = await options.openChecker();
          if (checker !== null && checker.manifest.eraHeight !== manifest.eraHeight) throw new Error(`the Dust check table's era starts at ${checker.manifest.eraHeight}, the file's at ${manifest.eraHeight}`);
          if (checker !== null) log(`Dust check table at height ${checker.manifest.height}: ${checker.manifest.commitments} commitments, ${checker.manifest.scheme}`);
        }
        const c = checker;
        const check: DustBatchCheck | undefined =
          c === null ? undefined : (ends) => c.check(ends.map((e) => ({ position: Number(e.coin.mtIndex), commitment: fieldBytes(ledger.dustCommitment(e.coin)) })));
        chains = await walkDustChains(file, starts, updates, functions, check);
        // A wallet with nothing to check still makes one call, as one with a chain to check does.
        if (c !== null && c.stats.calls === 0) await c.check([]);
        break;
      } catch (error) {
        if (!isDustCheckReplaced(error) || attempt >= 2) throw error;
        log("the Dust check table was replaced; opening the new one");
        checker?.dispose();
        checker = null;
      }
    }
    const at = options.now ?? new Date();
    const values = chains.map((c) => ledger.updatedValue(c.coin.ctime, c.coin.initialValue, c.generation, at, params));
    const commitments = chains.map((c) => ledger.dustCommitment(c.coin));
    return { manifest, parameters, owner, chains, updates, values, commitments, checker, chunks: fetches, at, ms: performance.now() - started };
  } catch (error) {
    checker?.dispose();
    throw error;
  } finally {
    secretKey.clear();
  }
}
