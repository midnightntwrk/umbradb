/**
 * The wallet's Dust sync (spec 00062 story 2, FR-020 to FR-025): download the Dust file, the wallet's first coins and
 * generation updates and the Dust parameters from the module, then walk each of the wallet's chains through the file.
 *
 * A chain starts from a first coin (a `dust-initial-utxo` event) whose owner is the wallet's Dust public key. The walk
 * computes the coin's nullifier, searches the file for its prefix from the first entry whose commitment position is
 * above the coin's own (a spend's new commitment is always appended after the coin it spends), derives the next coin
 * from the matching entry with the ledger's `successorDustUtxo`, and repeats from the entry after the match.
 *
 * The generation record passed to `successorDustUtxo` is the first coin's, with its `dtime` once an update of that
 * record (same nonce) exists: the Night output behind a chain is spent once, so a record has at most one `dtime`; a
 * `dtime` later than a spend's declared time leaves the value derived for that spend unchanged (checked against the
 * ledger in `test/dust-walk.test.ts`).
 *
 * Nothing here confirms a match yet (the private check, FR-023, is not built): each step reports the entry it was
 * taken from. The walk takes a {@link DustCheck} for that: called with a chain's last derived coin once the chain has
 * no further match, it drops a match the check refuses and resumes the search after it. The command line passes none.
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
} from "../shared/index.ts";
import type { PssHttp } from "./http.ts";
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

export interface DustChain {
  readonly start: DustChainStart;
  /** The generation record the walk passed (the first coin's, with its update's `dtime` when there is one). */
  readonly generation: DustGeneration;
  readonly steps: readonly DustStep[];
  /** Entries whose match the check refused, in the order dropped. */
  readonly dropped: readonly number[];
  /** The chain's current coin: the last step's, or the first coin. */
  readonly coin: DustCoin;
}

/**
 * Checks a chain's last derived coin, taken from file entry `entry`: true when it is the coin the chain recorded there
 * (the private check of FR-023 reads the commitment at the coin's position).
 */
export type DustCheck = (coin: DustCoin, entry: number) => boolean | Promise<boolean>;

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

/** Walks one chain through the file. */
export async function walkDustChain(file: DustFileView, start: DustChainStart, updates: readonly DustUpdate[], functions: DustFunctions, check?: DustCheck): Promise<DustChain> {
  const generation = generationOf(start, updates);
  const steps: DustStep[] = [];
  const dropped: number[] = [];
  let coin = start.coin;
  let from = file.firstAbove(Number(coin.mtIndex));
  for (;;) {
    const found = file.find(dustPrefixOfField(functions.nullifier(coin), file.prefixBytes), from);
    if (found >= 0) {
      const e = file.entry(found);
      coin = functions.successor(coin, new Date(e.time * 1000), e.fee, BigInt(e.position), generation);
      steps.push({ entry: found, position: e.position, time: e.time, fee: e.fee, coin });
      from = found + 1;
      continue;
    }
    // No further match: the last derived coin is checked (a first coin is public and needs none); a refused match is
    // dropped and the search resumes after it from the coin before.
    const last = steps.at(-1);
    if (last === undefined || check === undefined || (await check(last.coin, last.entry))) break;
    steps.pop();
    dropped.push(last.entry);
    coin = steps.at(-1)?.coin ?? start.coin;
    from = last.entry + 1;
  }
  return { start, generation, steps, dropped, coin };
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

/** The Dust file, downloaded and checked against its manifest. */
export async function downloadDustFile(http: PssHttp): Promise<{ manifest: DustManifest; file: DustFileView }> {
  const manifest = await http.dustManifest();
  if (manifest.version !== 1) throw new Error(`a Dust manifest of version ${String(manifest.version)}; this wallet reads version 1`);
  const chunks: DustChunk[] = [];
  for (const [n, ref] of manifest.chunks.entries()) {
    const bytes = await http.dustChunk(n);
    const sha256 = createHash("sha256").update(bytes).digest("hex");
    if (bytes.length !== ref.bytes || sha256 !== ref.sha256) throw new Error(`Dust chunk ${n}: ${bytes.length} bytes with SHA-256 ${sha256}, the manifest names ${ref.bytes} and ${ref.sha256}`);
    const chunk = decodeDustChunk(bytes);
    if (chunk.first !== ref.first || chunk.count !== ref.count || chunk.firstHeight !== ref.firstHeight) throw new Error(`Dust chunk ${n} is not the one the manifest lists`);
    chunks.push(chunk);
  }
  const file = new DustFileView(chunks, manifest.prefixBytes);
  if (file.entries !== manifest.entries) throw new Error(`the Dust chunks hold ${file.entries} entries, the manifest ${manifest.entries}`);
  return { manifest, file };
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
  readonly at: Date;
  readonly ms: number;
}

/**
 * The whole Dust sync of one wallet: the key from its Dust seed (FR-020, as the wallet SDK derives it), the downloads,
 * and a walk of each chain. The secret key is cleared before this returns.
 */
export async function dustSync(options: { readonly ledger: Ledger; readonly dustSeed: Uint8Array; readonly http: PssHttp; readonly check?: DustCheck; readonly now?: Date; readonly log?: (line: string) => void }): Promise<DustSyncResult> {
  const { ledger, http } = options;
  const log = options.log ?? (() => {});
  const started = performance.now();
  const secretKey = ledger.DustSecretKey.fromSeed(options.dustSeed);
  try {
    const owner = secretKey.publicKey;
    const { manifest, file } = await downloadDustFile(http);
    log(`Dust file to height ${manifest.height}: ${manifest.entries} entries in ${manifest.chunks.length} chunks`);
    const parameters = await http.dustParameters();
    const params = new ledger.DustParameters(BigInt(parameters.nightDustRatio), BigInt(parameters.generationDecayRate), BigInt(parameters.dustGracePeriodSeconds));
    const { starts, updates } = decodeDustCoins(ledger, await http.dustCoins(owner), owner);
    log(`${starts.length} first coins and ${updates.length} generation updates of this key in the era`);
    const functions = ledgerDustFunctions(ledger, secretKey, params);
    const chains: DustChain[] = [];
    for (const start of starts) chains.push(await walkDustChain(file, start, updates, functions, options.check));
    const at = options.now ?? new Date();
    const values = chains.map((c) => ledger.updatedValue(c.coin.ctime, c.coin.initialValue, c.generation, at, params));
    const commitments = chains.map((c) => ledger.dustCommitment(c.coin));
    return { manifest, parameters, owner, chains, updates, values, commitments, at, ms: performance.now() - started };
  } finally {
    secretKey.clear();
  }
}
