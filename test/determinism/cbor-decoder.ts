/**
 * A test-only CBOR decoder and RFC 8949 §4.2.1 checker, written independently of `src/determinism/cbor.ts` so the
 * property tests of A53 have an oracle that does not share code with the encoder under test.
 *
 * It decodes the subset DT-1 allows (unsigned and negative integers, byte strings, text strings, arrays, maps,
 * `false`, `true`, `null`) and reports every departure from core deterministic encoding it can see: an argument not
 * in its shortest form, an indefinite length, map keys not in strictly ascending bytewise order of their encodings,
 * a tag, a float or other simple value, invalid UTF-8, and trailing bytes. It recurses, so it is meant for the
 * moderately nested values the property tests generate, not for the deep-nesting tests.
 */

/** A decoded map entry, with the raw bytes of its key and of the whole entry (key then value). */
export interface DecodedEntry {
  readonly key: Decoded;
  readonly value: Decoded;
  readonly keyBytes: Uint8Array;
  readonly entryBytes: Uint8Array;
}

/** A decoded item: integers are `bigint`, maps keep their entries in encoded order. */
export type Decoded =
  | bigint
  | string
  | Uint8Array
  | boolean
  | null
  | readonly Decoded[]
  | DecodedMap;

/** The result of checking one encoded item. `value` is absent when the bytes could not be decoded at all. */
export interface CheckResult {
  readonly value?: Decoded;
  readonly violations: readonly string[];
}

class Abort extends Error {}

const fatalUtf8 = new TextDecoder("utf-8", { fatal: true });

function compareBytes(a: Uint8Array, b: Uint8Array): number {
  const n = Math.min(a.length, b.length);
  for (let i = 0; i < n; i++) {
    const d = (a[i] as number) - (b[i] as number);
    if (d !== 0) return d;
  }
  return a.length - b.length;
}

/** Decodes one CBOR item and lists every core-deterministic-encoding violation found. */
export function checkCanonical(bytes: Uint8Array): CheckResult {
  let pos = 0;
  const violations: string[] = [];

  const byteAt = (offset: number): number => {
    if (offset >= bytes.length) {
      violations.push(`truncated at ${offset}`);
      throw new Abort();
    }
    return bytes[offset] as number;
  };

  const readArgument = (info: number, start: number): bigint => {
    if (info < 24) return BigInt(info);
    const widths: Record<number, number> = { 24: 1, 25: 2, 26: 4, 27: 8 };
    const width = widths[info];
    if (width === undefined) {
      violations.push(info === 31 ? `indefinite length at ${start}` : `reserved additional information at ${start}`);
      throw new Abort();
    }
    let value = 0n;
    for (let i = 0; i < width; i++) value = (value << 8n) | BigInt(byteAt(pos + i));
    pos += width;
    const smallest: Record<number, bigint> = { 1: 24n, 2: 0x100n, 4: 0x1_0000n, 8: 0x1_0000_0000n };
    if (value < (smallest[width] as bigint)) violations.push(`non-shortest argument at ${start}`);
    return value;
  };

  const readLength = (argument: bigint, start: number): number => {
    if (argument > BigInt(bytes.length - pos)) {
      violations.push(`length beyond the input at ${start}`);
      throw new Abort();
    }
    return Number(argument);
  };

  const item = (): Decoded => {
    const start = pos;
    const initial = byteAt(pos);
    pos += 1;
    const major = initial >> 5;
    const info = initial & 0x1f;
    if (major === 7) {
      if (info === 20) return false;
      if (info === 21) return true;
      if (info === 22) return null;
      violations.push(`simple value or float outside the subset at ${start}`);
      throw new Abort();
    }
    if (major === 6) {
      violations.push(`tag outside the subset at ${start}`);
      throw new Abort();
    }
    const argument = readArgument(info, start);
    switch (major) {
      case 0:
        return argument;
      case 1:
        return -1n - argument;
      case 2: {
        const length = readLength(argument, start);
        const out = bytes.slice(pos, pos + length);
        pos += length;
        return out;
      }
      case 3: {
        const length = readLength(argument, start);
        const raw = bytes.subarray(pos, pos + length);
        pos += length;
        try {
          return fatalUtf8.decode(raw);
        } catch {
          violations.push(`invalid UTF-8 at ${start}`);
          throw new Abort();
        }
      }
      case 4: {
        const length = readLength(argument, start);
        const out: Decoded[] = [];
        for (let i = 0; i < length; i++) out.push(item());
        return out;
      }
      default: {
        // major type 5
        const length = readLength(argument, start);
        const headBytes = bytes.slice(start, pos);
        const entries: DecodedEntry[] = [];
        let previous: Uint8Array | undefined;
        for (let i = 0; i < length; i++) {
          const keyStart = pos;
          const key = item();
          const keyBytes = bytes.slice(keyStart, pos);
          const value = item();
          const entryBytes = bytes.slice(keyStart, pos);
          if (previous !== undefined) {
            const order = compareBytes(previous, keyBytes);
            if (order === 0) violations.push(`duplicate map key at ${keyStart}`);
            else if (order > 0) violations.push(`map keys not in ascending order at ${keyStart}`);
          }
          previous = keyBytes;
          entries.push({ key, value, keyBytes, entryBytes });
        }
        return { map: entries, headBytes };
      }
    }
  };

  try {
    const value = item();
    if (pos !== bytes.length) violations.push(`trailing bytes at ${pos}`);
    return { value, violations };
  } catch (error) {
    if (error instanceof Abort) return { violations };
    throw error;
  }
}

/** A structural form used to compare an input value with a decoded one, independent of map order. */
export type Plain =
  | bigint
  | string
  | boolean
  | null
  | { readonly bytes: string }
  | readonly Plain[]
  | { readonly map: readonly (readonly [string, Plain])[] };

function sortedEntries(entries: (readonly [string, Plain])[]): (readonly [string, Plain])[] {
  return entries.sort((a, b) => (a[0] < b[0] ? -1 : a[0] > b[0] ? 1 : 0));
}

/** A decoded map, as opposed to the other decoded objects (byte strings and arrays). */
export interface DecodedMap {
  readonly map: readonly DecodedEntry[];
  readonly headBytes: Uint8Array;
}

/** Whether `value` is a decoded map. */
export function isDecodedMap(value: Decoded): value is DecodedMap {
  return value !== null && typeof value === "object" && !(value instanceof Uint8Array) && !Array.isArray(value);
}

/** The structural form of a decoded item (map keys must be text strings). */
export function plainOfDecoded(value: Decoded): Plain {
  if (value instanceof Uint8Array) return { bytes: toHex(value) };
  if (Array.isArray(value)) return (value as readonly Decoded[]).map(plainOfDecoded);
  if (isDecodedMap(value)) {
    return {
      map: sortedEntries(
        value.map.map((entry) => {
          if (typeof entry.key !== "string") throw new Error("non-text map key");
          return [entry.key, plainOfDecoded(entry.value)] as const;
        }),
      ),
    };
  }
  return value as bigint | string | boolean | null;
}

/** The structural form of an encoder input: numbers become `bigint`, objects become key-sorted entry lists. */
export function plainOfInput(value: unknown): Plain {
  if (typeof value === "number") return BigInt(value);
  if (value instanceof Uint8Array) return { bytes: toHex(value) };
  if (Array.isArray(value)) return value.map(plainOfInput);
  if (value !== null && typeof value === "object") {
    return {
      map: sortedEntries(
        Object.keys(value).map((key) => [key, plainOfInput((value as Record<string, unknown>)[key])] as const),
      ),
    };
  }
  return value as bigint | string | boolean | null;
}

/** Lowercase hex of `bytes`. */
export function toHex(bytes: Uint8Array): string {
  let out = "";
  for (const b of bytes) out += b.toString(16).padStart(2, "0");
  return out;
}

/** Bytes of a hex string (whitespace ignored). */
export function fromHex(hex: string): Uint8Array {
  const clean = hex.replace(/\s+/g, "");
  if (clean.length % 2 !== 0 || /[^0-9a-f]/i.test(clean)) throw new Error(`bad hex: ${hex}`);
  const out = new Uint8Array(clean.length / 2);
  for (let i = 0; i < out.length; i++) out[i] = Number.parseInt(clean.slice(2 * i, 2 * i + 2), 16);
  return out;
}

/** Concatenates byte arrays. */
export function concatBytes(...parts: readonly Uint8Array[]): Uint8Array {
  const out = new Uint8Array(parts.reduce((n, p) => n + p.length, 0));
  let offset = 0;
  for (const p of parts) {
    out.set(p, offset);
    offset += p.length;
  }
  return out;
}
