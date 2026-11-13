/**
 * The module's in-memory index of Zswap outputs and nullifiers (spec FR-010–013), loaded once from
 * `core_ledger_state.events` at start and extended after each committed height. Snapshots and the tail are built from
 * it, so no request and no build holds a long database read.
 *
 * - Outputs by tree position: commitment (32), evidence kind, ciphertext (224, zero without one), height. Positions
 *   are dense: an output is taken only at position `count` (FR-013); anything else marks the index broken, and every
 *   later build fails with that reason.
 * - Zswap nullifiers (FR-012; DUST spends are another kind and never read) with height and transaction index, in
 *   application order.
 *
 * The arrays live in `SharedArrayBuffer`s that only grow by reallocation: a build worker given a buffer and a count
 * reads `[0, count)`, which never changes, while the main thread appends.
 */

import type { ZswapEvidence } from "umbradb";
import { CIPHERTEXT_BYTES } from "../shared/records.ts";

export const COMMITMENT_BYTES = 32;
export const NULLIFIER_BYTES = 32;

/** Evidence kinds as stored in the index (one byte each). */
export const EVIDENCE_CODE = Object.freeze({ none: 0, ciphertext: 1, public: 2 } as const);

/** An output as read from a stored row or a `ledger-events` item. */
export interface OutputEvent {
  readonly height: number;
  readonly txIndex: number;
  readonly position: number;
  readonly commitment: Uint8Array;
  readonly evidence: ZswapEvidence;
  readonly ciphertext: Uint8Array | null;
}

/** A Zswap input's nullifier, as read from a stored row or a `ledger-events` item. */
export interface NullifierEvent {
  readonly height: number;
  readonly txIndex: number;
  readonly nullifier: Uint8Array;
}

/** A byte array in shared memory that grows by reallocation. */
export class GrowableBytes {
  #buffer: SharedArrayBuffer;
  #bytes: Uint8Array;
  #length = 0;

  constructor(initial = 1 << 16) {
    this.#buffer = new SharedArrayBuffer(initial);
    this.#bytes = new Uint8Array(this.#buffer);
  }

  get length(): number {
    return this.#length;
  }

  /** The current buffer; bytes `[0, length)` of it never change. */
  get buffer(): SharedArrayBuffer {
    return this.#buffer;
  }

  get bytes(): Uint8Array {
    return this.#bytes.subarray(0, this.#length);
  }

  #reserve(extra: number): void {
    const need = this.#length + extra;
    if (need <= this.#buffer.byteLength) return;
    let size = this.#buffer.byteLength;
    while (size < need) size *= 2;
    const next = new SharedArrayBuffer(size);
    const bytes = new Uint8Array(next);
    bytes.set(this.#bytes.subarray(0, this.#length));
    this.#buffer = next;
    this.#bytes = bytes;
  }

  push(chunk: Uint8Array): void {
    this.#reserve(chunk.length);
    this.#bytes.set(chunk, this.#length);
    this.#length += chunk.length;
  }

  pushZeros(count: number): void {
    this.#reserve(count);
    this.#bytes.fill(0, this.#length, this.#length + count);
    this.#length += count;
  }

  pushU32(value: number): void {
    this.#reserve(4);
    new DataView(this.#buffer).setUint32(this.#length, value, true);
    this.#length += 4;
  }

  pushByte(value: number): void {
    this.#reserve(1);
    this.#bytes[this.#length] = value;
    this.#length += 1;
  }

  u32At(index: number): number {
    return new DataView(this.#buffer).getUint32(index * 4, true);
  }
}

/** The outputs' and nullifiers' arrays for a build: shared buffers and counts. */
export interface IndexSlice {
  readonly outputs: number;
  readonly commitments: SharedArrayBuffer;
  readonly ciphertexts: SharedArrayBuffer;
  readonly evidence: SharedArrayBuffer;
  readonly nullifiers: number;
  readonly nullifierValues: SharedArrayBuffer;
  readonly nullifierHeights: SharedArrayBuffer;
  readonly nullifierTxs: SharedArrayBuffer;
}

export class ZswapIndex {
  /** The last height included; −1 before any. */
  #height = -1;
  #outputs = 0;
  #nullifiers = 0;
  #error: string | null = null;
  readonly #commitments = new GrowableBytes();
  readonly #ciphertexts = new GrowableBytes(1 << 20);
  readonly #evidence = new GrowableBytes(1 << 12);
  readonly #outputHeights = new GrowableBytes();
  readonly #nullifierValues = new GrowableBytes();
  readonly #nullifierHeights = new GrowableBytes();
  readonly #nullifierTxs = new GrowableBytes();

  get height(): number {
    return this.#height;
  }

  get outputs(): number {
    return this.#outputs;
  }

  get nullifiers(): number {
    return this.#nullifiers;
  }

  /** Why the index cannot be used for a snapshot (positions not dense), or null. */
  get error(): string | null {
    return this.#error;
  }

  /**
   * Adds one committed height's events (outputs in any order; nullifiers in application order). Heights must
   * increase. Outputs are placed by position; positions must continue the index exactly (FR-013), else the index is
   * marked broken (nothing of the height is taken) and stays so.
   */
  appendHeight(height: number, outputs: readonly OutputEvent[], nullifiers: readonly NullifierEvent[]): void {
    if (!Number.isSafeInteger(height) || height <= this.#height) {
      throw new Error(`index heights must increase: ${height} after ${this.#height}`);
    }
    if (this.#error === null) {
      // Every event is checked before anything is taken, so a malformed one leaves the index as it was.
      const sorted = [...outputs].sort((a, b) => a.position - b.position);
      for (let i = 0; i < sorted.length; i++) {
        const o = sorted[i]!;
        checkOutput(o, height);
        if (o.position !== this.#outputs + i) {
          this.#error = `output positions are not dense at height ${height}: expected ${this.#outputs + i}, found ${o.position}`;
          break;
        }
      }
      for (const n of nullifiers) {
        if (n.nullifier.length !== NULLIFIER_BYTES) throw new Error(`a nullifier of ${n.nullifier.length} bytes at height ${height}`);
      }
      if (this.#error === null) {
        for (const o of sorted) this.#pushOutput(o);
        for (const n of nullifiers) this.#pushNullifier(height, n);
      }
    }
    this.#height = height;
  }

  /** Marks the index unusable for snapshots, with the reason (the first one given stays). */
  markBroken(reason: string): void {
    this.#error ??= reason;
  }

  /** Marks the index as at `height` without events (heights with none, or a range read as one). */
  advanceTo(height: number): void {
    if (height < this.#height) throw new Error(`index heights must not decrease: ${height} after ${this.#height}`);
    this.#height = height;
  }

  #pushOutput(o: OutputEvent): void {
    this.#commitments.push(o.commitment);
    this.#evidence.pushByte(EVIDENCE_CODE[o.evidence]);
    if (o.ciphertext !== null && o.evidence === "ciphertext") this.#ciphertexts.push(o.ciphertext);
    else this.#ciphertexts.pushZeros(CIPHERTEXT_BYTES);
    this.#outputHeights.pushU32(o.height);
    this.#outputs++;
  }

  #pushNullifier(height: number, n: NullifierEvent): void {
    this.#nullifierValues.push(n.nullifier);
    this.#nullifierHeights.pushU32(height);
    this.#nullifierTxs.pushU32(n.txIndex);
    this.#nullifiers++;
  }

  /** Outputs created at or below `height`: the tree's `first_free` there. */
  outputsAt(height: number): number {
    return upperBound(this.#outputHeights, this.#outputs, height);
  }

  /** Nullifiers spent at or below `height`. */
  nullifiersAt(height: number): number {
    return upperBound(this.#nullifierHeights, this.#nullifiers, height);
  }

  commitment(position: number): Uint8Array {
    return this.#commitments.bytes.subarray(position * COMMITMENT_BYTES, (position + 1) * COMMITMENT_BYTES);
  }

  /** The ciphertext of an output with one, else null. */
  ciphertext(position: number): Uint8Array | null {
    if (this.#evidence.bytes[position] !== EVIDENCE_CODE.ciphertext) return null;
    return this.#ciphertexts.bytes.subarray(position * CIPHERTEXT_BYTES, (position + 1) * CIPHERTEXT_BYTES);
  }

  nullifier(index: number): { readonly nullifier: Uint8Array; readonly height: number; readonly txIndex: number } {
    return {
      nullifier: this.#nullifierValues.bytes.subarray(index * NULLIFIER_BYTES, (index + 1) * NULLIFIER_BYTES),
      height: this.#nullifierHeights.u32At(index),
      txIndex: this.#nullifierTxs.u32At(index),
    };
  }

  /** The shared buffers and counts of the first `outputs` outputs and `nullifiers` nullifiers. */
  slice(outputs: number, nullifiers: number): IndexSlice {
    if (outputs > this.#outputs || nullifiers > this.#nullifiers) throw new Error("a slice beyond the index");
    return {
      outputs,
      commitments: this.#commitments.buffer,
      ciphertexts: this.#ciphertexts.buffer,
      evidence: this.#evidence.buffer,
      nullifiers,
      nullifierValues: this.#nullifierValues.buffer,
      nullifierHeights: this.#nullifierHeights.buffer,
      nullifierTxs: this.#nullifierTxs.buffer,
    };
  }
}

/** Throws unless `o` is a well-formed output of `height`. */
function checkOutput(o: OutputEvent, height: number): void {
  if (o.height !== height) throw new Error(`an output of height ${o.height} given for height ${height}`);
  if (!Number.isSafeInteger(o.position) || o.position < 0) throw new Error(`an output position ${o.position} at height ${height}`);
  if (o.commitment.length !== COMMITMENT_BYTES) throw new Error(`a commitment of ${o.commitment.length} bytes at ${o.position}`);
  if (!Object.hasOwn(EVIDENCE_CODE, o.evidence)) throw new Error(`unknown evidence ${String(o.evidence)} at ${o.position}`);
  if (o.evidence === "ciphertext" ? o.ciphertext?.length !== CIPHERTEXT_BYTES : o.ciphertext !== null) {
    throw new Error(`output ${o.position} has evidence ${o.evidence} and a ciphertext of ${o.ciphertext?.length ?? "no"} bytes`);
  }
}

/** The number of the first `count` u32 values (non-decreasing) that are ≤ `value`. */
function upperBound(values: GrowableBytes, count: number, value: number): number {
  let lo = 0;
  let hi = count;
  while (lo < hi) {
    const mid = (lo + hi) >>> 1;
    if (values.u32At(mid) <= value) lo = mid + 1;
    else hi = mid;
  }
  return lo;
}
