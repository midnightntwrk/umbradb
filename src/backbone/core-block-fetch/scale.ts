/**
 * SCALE, Substrate's encoding (`parity-scale-codec`), as far as `core-block-fetch` reads and writes it (task 10.3): the
 * compact integers, length-prefixed byte strings, UTF-8 strings, options and vectors of a block header, an extrinsic and
 * the runtime metadata (`./metadata.ts`, `./extrinsics.ts`, `./header.ts`).
 *
 * A {@link ScaleReader} reads one value from start to end and throws a {@link ScaleError} — naming what it read, at
 * which byte, and why — for bytes that end too soon, a compact integer too large for what is read, a string that is not
 * UTF-8, or an option tag other than 0 or 1: a value is read exactly or not at all, never guessed (as the node client's
 * answers, task 10.1). Pure: no Node.js import.
 */

/** Bytes that are not the SCALE value read. */
export class ScaleError extends Error {
  constructor(what: string, offset: number, why: string) {
    super(`cannot read ${what} as SCALE at byte ${offset}: ${why}`);
    this.name = "ScaleError";
  }
}

const UTF8 = new TextDecoder("utf-8", { fatal: true });

/** Reads SCALE values from `bytes`, front to back (see the module comment). */
export class ScaleReader {
  readonly #bytes: Uint8Array;
  readonly #what: string;
  #offset = 0;

  /** `what` names the value in errors, e.g. `the runtime metadata`. */
  constructor(bytes: Uint8Array, what: string) {
    this.#bytes = bytes;
    this.#what = what;
  }

  /** The bytes read so far. */
  get offset(): number {
    return this.#offset;
  }

  /** The bytes left to read. */
  get remaining(): number {
    return this.#bytes.length - this.#offset;
  }

  /** A {@link ScaleError} at the current byte. */
  error(why: string): ScaleError {
    return new ScaleError(this.#what, this.#offset, why);
  }

  /** A {@link ScaleError} at the byte `offset`, one read earlier. */
  errorAt(offset: number, why: string): ScaleError {
    return new ScaleError(this.#what, offset, why);
  }

  /** The next `length` bytes, as a view of the input. */
  bytes(length: number): Uint8Array {
    if (length > this.remaining) {
      throw this.error(`${length} bytes are needed and ${this.remaining} are left`);
    }
    const out = this.#bytes.subarray(this.#offset, this.#offset + length);
    this.#offset += length;
    return out;
  }

  /** Every byte left. */
  rest(): Uint8Array {
    return this.bytes(this.remaining);
  }

  /** A `u8`. */
  u8(): number {
    return this.bytes(1)[0] as number;
  }

  /** A little-endian `u32`. */
  u32(): number {
    const b = this.bytes(4);
    return ((b[0] as number) | ((b[1] as number) << 8) | ((b[2] as number) << 16) | ((b[3] as number) << 24)) >>> 0;
  }

  /** A compact integer (`Compact<T>`), of any size. */
  compact(): bigint {
    const first = this.u8();
    const mode = first & 0b11;
    if (mode === 0) return BigInt(first >> 2);
    if (mode === 1) return BigInt((first | (this.u8() << 8)) >> 2);
    if (mode === 2) {
      const rest = this.bytes(3);
      return BigInt(((first | ((rest[0] as number) << 8) | ((rest[1] as number) << 16) | ((rest[2] as number) << 24)) >>> 0) >>> 2);
    }
    let value = 0n;
    const length = (first >> 2) + 4;
    const digits = this.bytes(length);
    for (let index = length - 1; index >= 0; index--) value = (value << 8n) | BigInt(digits[index] as number);
    return value;
  }

  /** A compact integer that is a count or an index: at most 2^32 − 1, as SCALE's lengths and type ids are. */
  count(): number {
    const at = this.#offset;
    const value = this.compact();
    if (value > 0xffff_ffffn) throw new ScaleError(this.#what, at, `the compact ${value} is above 2^32 - 1`);
    return Number(value);
  }

  /** A length-prefixed byte string (`Vec<u8>`), as a view of the input. */
  byteString(): Uint8Array {
    return this.bytes(this.count());
  }

  /** A length-prefixed UTF-8 string. */
  string(): string {
    const at = this.#offset;
    const bytes = this.byteString();
    try {
      return UTF8.decode(bytes);
    } catch {
      throw new ScaleError(this.#what, at, "a string that is not UTF-8");
    }
  }

  /** An `Option<T>`: null for `None` (0), `read()` for `Some` (1). */
  option<T>(read: () => T): T | null {
    const at = this.#offset;
    const tag = this.u8();
    if (tag === 0) return null;
    if (tag === 1) return read();
    throw new ScaleError(this.#what, at, `an option tag ${tag}, not 0 or 1`);
  }

  /** A `Vec<T>`: a compact count, then each element. */
  vector<T>(read: (index: number) => T): T[] {
    const length = this.count();
    const out: T[] = [];
    for (let index = 0; index < length; index++) out.push(read(index));
    return out;
  }

  /** Throws unless every byte was read. */
  end(): void {
    if (this.remaining !== 0) throw this.error(`${this.remaining} bytes are left after the value`);
  }
}

/** `value` as a SCALE compact integer. Throws a `RangeError` for a negative value. */
export function encodeCompact(value: bigint): Uint8Array {
  if (value < 0n) throw new RangeError(`a SCALE compact integer is not negative: ${value}`);
  if (value < 1n << 6n) return Uint8Array.of(Number(value) << 2);
  if (value < 1n << 14n) {
    const n = (Number(value) << 2) | 1;
    return Uint8Array.of(n & 0xff, n >> 8);
  }
  if (value < 1n << 30n) {
    const n = (Number(value) << 2) | 2;
    return Uint8Array.of(n & 0xff, (n >> 8) & 0xff, (n >> 16) & 0xff, (n >>> 24) & 0xff);
  }
  const digits: number[] = [];
  for (let rest = value; rest > 0n; rest >>= 8n) digits.push(Number(rest & 0xffn));
  return Uint8Array.of(((digits.length - 4) << 2) | 0b11, ...digits);
}

/** `parts` one after another. */
export function concatBytes(parts: readonly Uint8Array[]): Uint8Array {
  const out = new Uint8Array(parts.reduce((length, part) => length + part.length, 0));
  let offset = 0;
  for (const part of parts) {
    out.set(part, offset);
    offset += part.length;
  }
  return out;
}
