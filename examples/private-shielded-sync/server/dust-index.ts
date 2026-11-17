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
 *   Dust public key), each as its event's bytes, which the wallet decodes with its own ledger package.
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
  /** The owner (Dust public key) of a first coin. */
  firstCoinOwner(bytes: Uint8Array): bigint;
  /** The owner of the generation record a generation update changes. */
  updateOwner(bytes: Uint8Array): bigint;
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
  return {
    spend(bytes) {
      const c = content(bytes, "dustSpendProcessed");
      const ms = (c.declaredTime as Date).getTime();
      // The ledger's timestamps are whole seconds; anything else would derive another coin in the wallet.
      if (!Number.isSafeInteger(ms) || ms < 0 || ms % 1000 !== 0) throw new Error(`a spend declaring the time ${String(c.declaredTime)}`);
      const position = Number(c.commitmentIndex as bigint);
      return { time: ms / 1000, fee: c.vFee as bigint, position };
    },
    firstCoinOwner: (bytes) => owner((content(bytes, "dustInitialUtxo").output as { owner?: unknown } | undefined)?.owner),
    updateOwner: (bytes) => owner((content(bytes, "dustGenerationDtimeUpdate").update as { annotation?: { owner?: unknown } } | undefined)?.annotation?.owner),
    parameters: (bytes) => dustParametersOfText(ledger.Event.deserialize(bytes).toString(true)),
    initial: { nightDustRatio: initial.nightDustRatio, generationDecayRate: initial.generationDecayRate, dustGracePeriodSeconds: initial.dustGracePeriodSeconds },
  };
}

/** One event checked and decoded, ready to be taken. */
type Decoded =
  | { readonly kind: "spend"; readonly height: number; readonly prefix: Uint8Array; readonly time: number; readonly fee: bigint; readonly position: number; readonly commitment: Uint8Array }
  | { readonly kind: "first-coin" | "update"; readonly height: number; readonly owner: bigint; readonly bytes: Uint8Array }
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
  #changed: { readonly values: DustParameterValues; readonly height: number } | null = null;
  // Encoded chunks: every full one, and the last one at its entry count.
  readonly #full = new Map<number, EncodedDustChunk>();
  #last: { readonly entries: number; readonly chunk: EncodedDustChunk } | null = null;
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
      case "dust-initial-utxo":
        return { kind: "first-coin", height, owner: decoder.firstCoinOwner(e.bytes), bytes: e.bytes };
      case "dust-generation-dtime-update":
        return { kind: "update", height, owner: decoder.updateOwner(e.bytes), bytes: e.bytes };
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

  /** The number of chunks the file has now. */
  get chunks(): number {
    return Math.ceil(this.entries / this.chunkEntries);
  }

  /** Chunk `n` encoded, or null when the file has no such chunk. A full chunk is encoded once. */
  chunk(n: number): EncodedDustChunk | null {
    if (!Number.isSafeInteger(n) || n < 0 || n >= this.chunks) return null;
    const first = n * this.chunkEntries;
    const count = Math.min(this.chunkEntries, this.entries - first);
    const full = count === this.chunkEntries;
    if (full) {
      const kept = this.#full.get(n);
      if (kept !== undefined) return kept;
    } else if (this.#last !== null && this.#last.entries === this.entries) {
      return this.#last.chunk;
    }
    const entries: DustEntry[] = [];
    for (let i = first; i < first + count; i++) entries.push(this.entry(i));
    const bytes = encodeDustChunk(dustChunkOf(first, this.#heights[first]!, entries, this.prefixBytes));
    const chunk: EncodedDustChunk = { bytes, sha256: createHash("sha256").update(bytes).digest("hex"), full };
    if (full) this.#full.set(n, chunk);
    else this.#last = { entries: this.entries, chunk };
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

/** A coin event as the coins route answers it: its height and its bytes in hexadecimal. */
export const coinEventJson = (e: DustCoinEvent): DustEventJson => ({ height: e.height, bytes: toHex(e.bytes) });
