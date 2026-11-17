/**
 * The module's in-memory index of the Dust events of the current ledger era (spec 00062 FR-001, FR-007, FR-010,
 * FR-011, FR-013), loaded once from `core_ledger_state.events` at start and extended after each committed height, as
 * the Zswap index is (`./zswap-index.ts`).
 *
 * - **Spends** (`dust-spend-processed`), in chain order: block height, nullifier prefix (from the stored `nullifier`),
 *   declared time in seconds and fee (from the event's bytes), commitment position (the stored `tree_index`) and the
 *   new commitment (32 bytes, kept for the private check). They make the Dust file (`../shared/dust-file.ts`): a full
 *   chunk is encoded once and kept; the last one is encoded again when it has grown.
 * - **First coins** (`dust-initial-utxo`) and **generation updates** (`dust-generation-dtime-update`), by owner (the
 *   Dust public key), each as its event's bytes, which the wallet decodes with its own ledger package; and each first
 *   coin's position and commitment (computed by the decoder), which with the spends' new commitments fill the Dust
 *   commitment tree's positions for the check table (`commitments`, `./dust-check.ts`).
 * - **The Dust parameters**: the ledger's initial ones, or those of the era's last `param-change` event.
 *
 * Events below the era's first height (the setting `dustEraHeight`) are ignored: the Dust state restarts there, and the
 * commitment positions and generation indexes start again.
 *
 * A spend's fee and declared time, and the owner of a first coin or an update, are only in the event's bytes, so the
 * index decodes them with a {@link DustDecoder}: the ledger package's ({@link ledgerDustDecoder}), or a test's. An event
 * it cannot decode, or a commitment position that does not rise, marks the index broken (nothing of that height is
 * taken), and every Dust route then answers with the reason.
 */

import { createHash } from "node:crypto";
import type * as V9 from "../../../vendor/ledger/v9/pkg/midnight_ledger_wasm_v9_fs.js";
import {
  DUST_CHUNK_ENTRIES,
  DUST_PREFIX_BYTES,
  dustChunkOf,
  dustChunkRanges,
  type DustEntry,
  type DustEventJson,
  type DustManifest,
  dustPrefix,
  encodeDustChunk,
} from "../shared/dust-file.ts";
import type { DustGenerationRecord } from "../shared/dust-check.ts";
import { toHex } from "../shared/manifest.ts";
import { GrowableBytes } from "./zswap-index.ts";

/** The first height of Preprod's current ledger era: its first `midnight:event[v14]:` event (spec 00062, measured). */
export const DEFAULT_DUST_ERA_HEIGHT = 3_348_434;

/** The event kinds the index reads. */
export const DUST_EVENT_KINDS = ["dust-spend-processed", "dust-initial-utxo", "dust-generation-dtime-update", "param-change"] as const;
export type DustEventKind = (typeof DUST_EVENT_KINDS)[number];

export const isDustEventKind = (kind: string): kind is DustEventKind => (DUST_EVENT_KINDS as readonly string[]).includes(kind);

/** A Dust event as read from a stored row or a `ledger-events` item. */
export interface DustEvent {
  readonly height: number;
  readonly txIndex: number;
  readonly kind: DustEventKind;
  /** The ledger's serialization of the event. */
  readonly bytes: Uint8Array;
  /** A spend's nullifier (32 bytes, the field element little-endian); null for the other kinds. */
  readonly nullifier: Uint8Array | null;
  /** A spend's new commitment (as `nullifier`); null for the other kinds. */
  readonly commitment: Uint8Array | null;
  /** A spend's commitment position, a first coin's generation index; null for the other kinds. */
  readonly treeIndex: number | null;
}

/** The three Dust parameters (`DustParameters`). */
export interface DustParameterValues {
  readonly nightDustRatio: bigint;
  readonly generationDecayRate: bigint;
  readonly dustGracePeriodSeconds: bigint;
}

/** What the index needs from the ledger package. Each method throws on bytes that are not an event of its kind. */
export interface DustDecoder {
  /** A spend's declared time (whole seconds since the Unix epoch), fee and commitment position. */
  spend(bytes: Uint8Array): { readonly time: number; readonly fee: bigint; readonly position: number };
  /**
   * A first coin's owner (Dust public key), its position in the Dust commitment tree, and its commitment (32 bytes,
   * the field element little-endian), which the event does not carry and the ledger computes (`dustCommitment`).
   */
  firstCoin(bytes: Uint8Array): {
    readonly owner: bigint;
    readonly position: number;
    readonly commitment: Uint8Array;
    /** Its generation record's index in the generation tree, and the record (phase 9). */
    readonly generationIndex: number;
    readonly generation: DustGenerationRecord;
  };
  /** The owner of the generation record a generation update changes. */
  update(bytes: Uint8Array): { readonly owner: bigint; readonly nonce: string; readonly dtime: number | null };
  /**
   * The generation tree's root over `records` (record `i` at index `i`), as the ledger computes it: each record's leaf
   * is its `merkle_hash`, which only the ledger package computes (phase 9).
   */
  generationRoot(records: readonly DustGenerationRecord[]): bigint;
  /** The Dust parameters a `param-change` event sets. */
  parameters(bytes: Uint8Array): DustParameterValues;
  /** The ledger's initial Dust parameters. */
  readonly initial: DustParameterValues;
}

/** A first coin or a generation update, as the coins route answers it. */
export interface DustCoinEvent {
  readonly height: number;
  readonly bytes: Uint8Array;
}

/** An encoded chunk and its SHA-256 (hexadecimal). */
export interface EncodedDustChunk {
  readonly bytes: Uint8Array;
  readonly sha256: string;
  /** Whether it holds a full chunk's entries, and so never changes. */
  readonly full: boolean;
}

/** The Dust parameters in force: the initial ones, or a `param-change` event's at `height`. */
export interface DustParametersInForce {
  readonly values: DustParameterValues;
  readonly source: "initial" | "param-change";
  readonly height: number | null;
}

/** `dust: DustParameters { … }` in a `param-change` event's `toString(true)`; the grace period is in seconds. */
const DUST_PARAMETERS_TEXT =
  /dust: DustParameters \{ night_dust_ratio: (\d+), generation_decay_rate: (\d+), dust_grace_period: Duration\((\d+)\) \}/;

/** The Dust parameters in a `LedgerParameters` rendering (`Event.toString(true)` of a `param-change` event). */
export function dustParametersOfText(text: string): DustParameterValues {
  const found = DUST_PARAMETERS_TEXT.exec(text);
  if (found === null) throw new Error("a parameter change without its Dust parameters");
  return { nightDustRatio: BigInt(found[1]!), generationDecayRate: BigInt(found[2]!), dustGracePeriodSeconds: BigInt(found[3]!) };
}

type Ledger = typeof V9;

/** A field element as 32 bytes, little-endian (as the core stores a Dust spend's commitment). */
export function fieldBytes(value: bigint): Uint8Array {
  if (value < 0n || value >= 1n << 256n) throw new RangeError(`not a 32-byte field element: ${value}`);
  const out = new Uint8Array(32);
  let rest = value;
  for (let i = 0; i < 32; i++) {
    out[i] = Number(rest & 0xffn);
    rest >>= 8n;
  }
  return out;
}

/** The decoder of the ledger package (the repository's vendored build of `@midnightntwrk/ledger-v9` 1.0.1). */
export function ledgerDustDecoder(ledger: Ledger): DustDecoder {
  const content = (bytes: Uint8Array, tag: string): Record<string, unknown> => {
    const c = ledger.Event.deserialize(bytes).content as unknown as Record<string, unknown>;
    if (c.tag !== tag) throw new Error(`an event tagged ${String(c.tag)} where ${tag} was expected`);
    return c;
  };
  const owner = (value: unknown): bigint => {
    if (typeof value !== "bigint" || value < 0n) throw new Error("an owner that is not a Dust public key");
    return value;
  };
  const initial = ledger.LedgerParameters.initialParameters().dust;
  /** A generation record as the generation file holds it (`dtime` in whole seconds, or null). */
  const recordOf = (g: V9.DustGenerationInfo): DustGenerationRecord => {
    const ms = g.dtime?.getTime();
    if (ms !== undefined && (!Number.isSafeInteger(ms) || ms % 1000 !== 0)) throw new Error(`a generation record whose dtime is ${String(g.dtime)}`);
    return { value: g.value, owner: owner(g.owner), nonce: g.nonce, dtime: ms === undefined ? null : ms / 1000 };
  };
  return {
    spend(bytes) {
      const c = content(bytes, "dustSpendProcessed");
      const ms = (c.declaredTime as Date).getTime();
      // The ledger's timestamps are whole seconds; anything else would derive another coin in the wallet.
      if (!Number.isSafeInteger(ms) || ms < 0 || ms % 1000 !== 0) throw new Error(`a spend declaring the time ${String(c.declaredTime)}`);
      const position = Number(c.commitmentIndex as bigint);
      return { time: ms / 1000, fee: c.vFee as bigint, position };
    },
    firstCoin(bytes) {
      const c = content(bytes, "dustInitialUtxo");
      const output = c.output as V9.QualifiedDustOutput | undefined;
      const generation = c.generation as V9.DustGenerationInfo | undefined;
      if (output === undefined || generation === undefined) throw new Error("a first coin without its output or generation record");
      return {
        owner: owner(output.owner),
        position: Number(output.mtIndex),
        commitment: fieldBytes(ledger.dustCommitment(output)),
        generationIndex: Number(c.generationIndex as bigint),
        generation: recordOf(generation),
      };
    },
    update(bytes) {
      const annotation = (content(bytes, "dustGenerationDtimeUpdate").update as { annotation?: V9.DustGenerationInfo } | undefined)?.annotation;
      if (annotation === undefined) throw new Error("a generation update without its record");
      const record = recordOf(annotation);
      return { owner: owner(record.owner), nonce: record.nonce, dtime: record.dtime };
    },
    generationRoot: (records) => dustGenerationRoot(ledger, records),
    parameters: (bytes) => dustParametersOfText(ledger.Event.deserialize(bytes).toString(true)),
    initial: { nightDustRatio: initial.nightDustRatio, generationDecayRate: initial.generationDecayRate, dustGracePeriodSeconds: initial.dustGracePeriodSeconds },
  };
}

/** One event checked and decoded, ready to be taken. */
type Decoded =
  | { readonly kind: "spend"; readonly height: number; readonly prefix: Uint8Array; readonly time: number; readonly fee: bigint; readonly position: number; readonly commitment: Uint8Array }
  | {
      readonly kind: "first-coin";
      readonly height: number;
      readonly owner: bigint;
      readonly bytes: Uint8Array;
      readonly position: number;
      readonly commitment: Uint8Array;
      readonly generationIndex: number;
      readonly generation: DustGenerationRecord;
    }
  | { readonly kind: "update"; readonly height: number; readonly owner: bigint; readonly bytes: Uint8Array; readonly nonce: string; readonly dtime: number | null }
  | { readonly kind: "parameters"; readonly height: number; readonly values: DustParameterValues };

export interface DustIndexOptions {
  /** The first height of the ledger era the index covers. */
  readonly eraHeight: number;
  /** Entries per chunk (the file's default unless a test gives another). */
  readonly chunkEntries?: number;
  readonly prefixBytes?: number;
}

export class DustIndex {
  readonly eraHeight: number;
  readonly chunkEntries: number;
  readonly prefixBytes: number;
  #decoder: DustDecoder | null = null;
  /** The last height included; −1 before any. */
  #height = -1;
  #error: string | null = null;
  // Spends, one entry per field.
  readonly #heights: number[] = [];
  readonly #times: number[] = [];
  readonly #fees: bigint[] = [];
  readonly #positions: number[] = [];
  readonly #prefixes = new GrowableBytes();
  readonly #commitments = new GrowableBytes();
  // First coins and updates, by owner.
  readonly #owners = new Map<bigint, { firstCoins: DustCoinEvent[]; updates: DustCoinEvent[] }>();
  #firstCoins = 0;
  #updates = 0;
  // First coins' heights, positions and commitments (computed by the decoder), for the check table.
  readonly #coinHeights: number[] = [];
  readonly #coinPositions: number[] = [];
  readonly #coinCommitments = new GrowableBytes();
  // First coins' generation indexes and records, and the updates' records (nonce and dtime), for the generation tree.
  readonly #coinGenerationIndexes: number[] = [];
  readonly #coinGenerations: DustGenerationRecord[] = [];
  readonly #updateHeights: number[] = [];
  readonly #updateRecords: { readonly nonce: string; readonly dtime: number | null }[] = [];
  #changed: { readonly values: DustParameterValues; readonly height: number } | null = null;
  // Encoded chunks: every full one, and the last one at its entry count.
  readonly #full = new Map<number, EncodedDustChunk>();
  #last: { readonly first: number; readonly count: number; readonly chunk: EncodedDustChunk } | null = null;
  #manifest: { readonly height: number; readonly entries: number; readonly manifest: DustManifest } | null = null;

  constructor(options: DustIndexOptions) {
    if (!Number.isSafeInteger(options.eraHeight) || options.eraHeight < 0) throw new Error(`an era height is a whole number ≥ 0: ${options.eraHeight}`);
    this.eraHeight = options.eraHeight;
    this.chunkEntries = options.chunkEntries ?? DUST_CHUNK_ENTRIES;
    this.prefixBytes = options.prefixBytes ?? DUST_PREFIX_BYTES;
    if (!Number.isSafeInteger(this.chunkEntries) || this.chunkEntries < 1) throw new Error(`entries per chunk must be ≥ 1: ${this.chunkEntries}`);
  }

  /** Gives the index its decoder; events are taken only once it has one. */
  useDecoder(decoder: DustDecoder): void {
    this.#decoder = decoder;
  }

  get height(): number {
    return this.#height;
  }

  /** Spends listed: the file's entry count. */
  get entries(): number {
    return this.#heights.length;
  }

  /** Why the index cannot be served, or null. */
  get error(): string | null {
    return this.#error;
  }

  /** Marks the index unusable, with the reason (the first one given stays). */
  markBroken(reason: string): void {
    this.#error ??= reason;
  }

  /**
   * Adds one committed height's Dust events, in chain order. Heights must increase. A height below the era is taken as
   * having none. Every event is checked and decoded before anything is taken, so an event the index cannot read marks
   * it broken with the reason and leaves it as it was.
   */
  appendHeight(height: number, events: readonly DustEvent[]): void {
    if (!Number.isSafeInteger(height) || height <= this.#height) throw new Error(`Dust index heights must increase: ${height} after ${this.#height}`);
    if (this.#error === null && height >= this.eraHeight && events.length > 0) {
      const decoder = this.#decoder;
      if (decoder === null) {
        this.#error = "the Dust index has no ledger package to decode the events with";
      } else {
        try {
          const decoded = events.map((e) => this.#decode(decoder, height, e));
          let last = this.#positions.at(-1) ?? -1;
          for (const d of decoded) {
            if (d.kind !== "spend") continue;
            if (d.position <= last) throw new Error(`a Dust commitment position ${d.position} after ${last}`);
            last = d.position;
          }
          for (const d of decoded) this.#take(d);
        } catch (cause) {
          this.#error = `the Dust events of height ${height} cannot be read: ${cause instanceof Error ? cause.message : String(cause)}`;
        }
      }
    }
    this.#height = height;
  }

  /** Marks the index as at `height` without events (heights with none, or a range read as one). */
  advanceTo(height: number): void {
    if (height < this.#height) throw new Error(`Dust index heights must not decrease: ${height} after ${this.#height}`);
    this.#height = height;
  }

  #decode(decoder: DustDecoder, height: number, e: DustEvent): Decoded {
    if (e.height !== height) throw new Error(`an event of height ${e.height} given for height ${height}`);
    switch (e.kind) {
      case "dust-spend-processed": {
        if (e.nullifier?.length !== 32 || e.commitment?.length !== 32 || e.treeIndex === null) throw new Error("a spend without its nullifier, commitment or position");
        const { time, fee, position } = decoder.spend(e.bytes);
        if (position !== e.treeIndex) throw new Error(`a spend whose event names position ${position} and whose row ${e.treeIndex}`);
        return { kind: "spend", height, prefix: dustPrefix(e.nullifier, this.prefixBytes), time, fee, position, commitment: e.commitment };
      }
      case "dust-initial-utxo": {
        const coin = decoder.firstCoin(e.bytes);
        if (!Number.isSafeInteger(coin.position) || coin.position < 0 || coin.commitment.length !== 32) throw new Error("a first coin without its position or commitment");
        return { kind: "first-coin", height, bytes: e.bytes, ...coin };
      }
      case "dust-generation-dtime-update":
        return { kind: "update", height, bytes: e.bytes, ...decoder.update(e.bytes) };
      case "param-change":
        return { kind: "parameters", height, values: decoder.parameters(e.bytes) };
    }
  }

  #take(d: Decoded): void {
    switch (d.kind) {
      case "spend":
        this.#heights.push(d.height);
        this.#times.push(d.time);
        this.#fees.push(d.fee);
        this.#positions.push(d.position);
        this.#prefixes.push(d.prefix);
        this.#commitments.push(d.commitment);
        return;
      case "first-coin":
      case "update": {
        if (d.kind === "first-coin") {
          this.#coinHeights.push(d.height);
          this.#coinPositions.push(d.position);
          this.#coinCommitments.push(d.commitment);
          this.#coinGenerationIndexes.push(d.generationIndex);
          this.#coinGenerations.push(d.generation);
        } else {
          this.#updateHeights.push(d.height);
          this.#updateRecords.push({ nonce: d.nonce, dtime: d.dtime });
        }
        let lists = this.#owners.get(d.owner);
        if (lists === undefined) {
          lists = { firstCoins: [], updates: [] };
          this.#owners.set(d.owner, lists);
        }
        const event = { height: d.height, bytes: Uint8Array.from(d.bytes) };
        if (d.kind === "first-coin") {
          lists.firstCoins.push(event);
          this.#firstCoins++;
        } else {
          lists.updates.push(event);
          this.#updates++;
        }
        return;
      }
      case "parameters":
        this.#changed = { values: d.values, height: d.height };
        return;
    }
  }

  /** Spend `i` of the file. */
  entry(i: number): DustEntry & { readonly height: number } {
    if (!Number.isInteger(i) || i < 0 || i >= this.entries) throw new Error(`the Dust file has no entry ${i}`);
    return {
      height: this.#heights[i]!,
      prefix: this.#prefixes.bytes.slice(i * this.prefixBytes, (i + 1) * this.prefixBytes),
      time: this.#times[i]!,
      fee: this.#fees[i]!,
      position: this.#positions[i]!,
    };
  }

  /** The new commitment of spend `i` (32 bytes, the field element little-endian). */
  commitment(i: number): Uint8Array {
    if (!Number.isInteger(i) || i < 0 || i >= this.entries) throw new Error(`the Dust file has no entry ${i}`);
    return this.#commitments.bytes.slice(i * 32, (i + 1) * 32);
  }

  /**
   * The Dust commitment tree's leaves at `height` (the index's by default) by position, for the check table (spec
   * 00062 FR-012): each spend's new commitment and each first coin's, at or below `height`. Throws
   * {@link DustCoverageError} unless they fill every position from 0 to the largest exactly once.
   */
  commitments(height: number = this.#height): { readonly height: number; readonly count: number; readonly bytes: Uint8Array } {
    if (height > this.#height) throw new Error(`the Dust index is at ${this.#height}, not ${height}`);
    const spends = countAtOrBelow(this.#heights, height);
    const coins = countAtOrBelow(this.#coinHeights, height);
    let count = 0;
    for (let i = 0; i < spends; i++) count = Math.max(count, this.#positions[i]! + 1);
    for (let j = 0; j < coins; j++) count = Math.max(count, this.#coinPositions[j]! + 1);
    const bytes = new Uint8Array(count * 32);
    const filled = new Uint8Array(count);
    const put = (position: number, from: Uint8Array, at: number, what: string): void => {
      if (filled[position] !== 0) throw new DustCoverageError(`the Dust commitment position ${position} is filled twice (the second time by ${what})`);
      filled[position] = 1;
      bytes.set(from.subarray(at * 32, at * 32 + 32), position * 32);
    };
    const spent = this.#commitments.bytes;
    for (let i = 0; i < spends; i++) put(this.#positions[i]!, spent, i, `spend ${i}`);
    const firsts = this.#coinCommitments.bytes;
    for (let j = 0; j < coins; j++) put(this.#coinPositions[j]!, firsts, j, `a first coin at height ${this.#coinHeights[j]}`);
    const empty = filled.indexOf(0);
    if (empty >= 0) {
      throw new DustCoverageError(
        `the Dust commitment position ${empty} is empty: the era's ${spends} spends and ${coins} first coins up to height ${height} do not fill positions 0 to ${count - 1}`,
      );
    }
    return { height, count, bytes };
  }

  /**
   * Every generation record of the era at `height` (the index's by default), record `i` at generation index `i`: each
   * first coin's record, with the `dtime` of the last update of that record (same nonce) at or below `height`. Throws
   * {@link DustCoverageError} unless the indexes run from 0 without a gap or a repeat (phase 9).
   */
  generationRecords(height: number = this.#height): DustGenerationRecord[] {
    if (height > this.#height) throw new Error(`the Dust index is at ${this.#height}, not ${height}`);
    const coins = countAtOrBelow(this.#coinHeights, height);
    const updates = countAtOrBelow(this.#updateHeights, height);
    const dtimes = new Map<string, number | null>();
    for (let u = 0; u < updates; u++) dtimes.set(this.#updateRecords[u]!.nonce, this.#updateRecords[u]!.dtime);
    const out: (DustGenerationRecord | undefined)[] = new Array(coins);
    for (let j = 0; j < coins; j++) {
      const i = this.#coinGenerationIndexes[j]!;
      if (i >= coins || out[i] !== undefined) throw new DustCoverageError(`the Dust generation index ${i} is out of range or given twice (${coins} first coins up to height ${height})`);
      const g = this.#coinGenerations[j]!;
      out[i] = dtimes.has(g.nonce) ? { ...g, dtime: dtimes.get(g.nonce)! } : g;
    }
    return out as DustGenerationRecord[];
  }

  /** The generation tree's root over `records`, by the ledger (the decoder); null before the index has one. */
  generationRoot(records: readonly DustGenerationRecord[]): bigint | null {
    return this.#decoder === null ? null : this.#decoder.generationRoot(records);
  }

  /** The number of chunks the file has now. */
  get chunks(): number {
    return Math.ceil(this.entries / this.chunkEntries);
  }

  /**
   * Chunk `n` encoded, with its first `count` entries (all it holds now unless given), or null when the file has no
   * such chunk or not that many entries in it. A chunk is a function of its entries, so chunk `n` at a given count never
   * changes: a wallet asks for the count its manifest names, and gets those bytes however the file grew since. A full
   * chunk is encoded once; the last partial one is kept at its count.
   */
  chunk(n: number, count?: number): EncodedDustChunk | null {
    if (!Number.isSafeInteger(n) || n < 0 || n >= this.chunks) return null;
    const first = n * this.chunkEntries;
    const held = Math.min(this.chunkEntries, this.entries - first);
    if (count !== undefined && (!Number.isSafeInteger(count) || count < 1 || count > held)) return null;
    count ??= held;
    const full = count === this.chunkEntries;
    if (full) {
      const kept = this.#full.get(n);
      if (kept !== undefined) return kept;
    } else if (this.#last !== null && this.#last.first === first && this.#last.count === count) {
      return this.#last.chunk;
    }
    const entries: DustEntry[] = [];
    for (let i = first; i < first + count; i++) entries.push(this.entry(i));
    const bytes = encodeDustChunk(dustChunkOf(first, this.#heights[first]!, entries, this.prefixBytes));
    const chunk: EncodedDustChunk = { bytes, sha256: createHash("sha256").update(bytes).digest("hex"), full };
    if (full) this.#full.set(n, chunk);
    else this.#last = { first, count, chunk };
    return chunk;
  }

  /** The file's manifest at the index's height. */
  manifest(): DustManifest {
    const kept = this.#manifest;
    if (kept !== null && kept.height === this.#height && kept.entries === this.entries) return kept.manifest;
    const chunks = dustChunkRanges(this.entries, this.chunkEntries).map(({ first, count }, n) => {
      const chunk = this.chunk(n)!;
      return { first, count, firstHeight: this.#heights[first]!, lastHeight: this.#heights[first + count - 1]!, bytes: chunk.bytes.length, sha256: chunk.sha256 };
    });
    const manifest: DustManifest = {
      version: 1,
      eraHeight: this.eraHeight,
      height: this.#height,
      entries: this.entries,
      chunkEntries: this.chunkEntries,
      prefixBytes: this.prefixBytes,
      chunks,
    };
    this.#manifest = { height: this.#height, entries: this.entries, manifest };
    return manifest;
  }

  /** The first coins and generation updates of one owner, each list in chain order. */
  coinsOf(owner: bigint): { readonly firstCoins: readonly DustCoinEvent[]; readonly updates: readonly DustCoinEvent[] } {
    return this.#owners.get(owner) ?? { firstCoins: [], updates: [] };
  }

  /** The Dust parameters in force at the index's height; null before the index has a decoder. */
  parameters(): DustParametersInForce | null {
    if (this.#changed !== null) return { values: this.#changed.values, source: "param-change", height: this.#changed.height };
    const decoder = this.#decoder;
    return decoder === null ? null : { values: decoder.initial, source: "initial", height: null };
  }

  /** What the admin status route reports. */
  status(): Record<string, unknown> {
    return {
      eraHeight: this.eraHeight,
      height: this.#height,
      entries: this.entries,
      chunks: this.chunks,
      firstCoins: this.#firstCoins,
      updates: this.#updates,
      owners: this.#owners.size,
      parameters: this.#changed === null ? "initial" : `param-change at ${this.#changed.height}`,
      error: this.#error,
    };
  }
}

/** The Dust events do not fill the commitment positions exactly once: the check table cannot be built. */
export class DustCoverageError extends Error {}

/** How many of the non-decreasing `values` are at most `limit`. */
function countAtOrBelow(values: readonly number[], limit: number): number {
  let lo = 0;
  let hi = values.length;
  while (lo < hi) {
    const mid = (lo + hi) >>> 1;
    if (values[mid]! <= limit) lo = mid + 1;
    else hi = mid;
  }
  return lo;
}

/** A coin event as the coins route answers it: its height and its bytes in hexadecimal. */
export const coinEventJson = (e: DustCoinEvent): DustEventJson => ({ height: e.height, bytes: toHex(e.bytes) });

/**
 * The generation tree's root over `records` (record `i` at index `i`), by the ledger: each inserted into a Dust local
 * state, which computes the record's leaf (`merkle_hash`, not exposed in JavaScript). About 7 ms a record (Preprod's
 * 1,676 in 12 s), so the server runs it in the snapshot's build worker, not on its event loop.
 */
export function dustGenerationRoot(ledger: typeof V9, records: readonly DustGenerationRecord[]): bigint {
  let local = new ledger.DustLocalState(ledger.LedgerParameters.initialParameters().dust);
  records.forEach((r, i) => {
    local = local.insertGenerationInfo(BigInt(i), { value: r.value, owner: r.owner, nonce: r.nonce, dtime: r.dtime === null ? undefined : new Date(r.dtime * 1000) }, undefined);
  });
  return local.generatingTreeRoot() ?? 0n;
}
