/**
 * The part of Node.js's `Buffer` that UmbraDB's sources use, for the browser build (`openspec/changes/core-arch/
 * design.md` §9.2; task 16.1): `Buffer.from` of text (UTF-8, hex, latin1, base64), of bytes and of an `ArrayBuffer`
 * view, `toString` in those encodings, `equals`, `Buffer.byteLength`, `Buffer.alloc`, `Buffer.concat`,
 * `Buffer.isBuffer` and `Buffer.compare`. The build gives it only to the files of `src/` that name `Buffer` (an import
 * added as each is bundled), never to a dependency: PGlite tests for a global `Buffer` to choose Node.js's paths.
 * Anything else of Node.js's `Buffer` is absent, so a new use fails at once rather than differing quietly.
 * `test/browser/shims.test.ts` holds each operation equal to Node.js's on random inputs.
 */

/** The encodings this `Buffer` reads and writes (Node.js's names). */
export type BufferEncoding = "utf8" | "utf-8" | "hex" | "latin1" | "binary" | "base64" | "ascii";

const encoder = new TextEncoder();
const decoder = new TextDecoder("utf-8");

const HEX = Array.from({ length: 256 }, (_, byte) => byte.toString(16).padStart(2, "0"));

function encodingOf(encoding: string | undefined): BufferEncoding {
  const name = (encoding ?? "utf8").toLowerCase();
  if (["utf8", "utf-8", "hex", "latin1", "binary", "base64", "ascii"].includes(name)) return name as BufferEncoding;
  throw new TypeError(`Unknown encoding: ${encoding}`);
}

/** Node.js's hex reading: pairs of hex digits up to the first pair that is not one. */
function fromHex(text: string): Uint8Array {
  const out = new Uint8Array(text.length >>> 1);
  let i = 0;
  for (; i < out.length; i++) {
    const pair = text.slice(i * 2, i * 2 + 2);
    if (!/^[0-9a-fA-F]{2}$/.test(pair)) break;
    out[i] = Number.parseInt(pair, 16);
  }
  return i === out.length ? out : out.slice(0, i);
}

const BASE64 = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";

/** Node.js's base64 reading: standard and URL-safe letters, padding and anything else skipped. */
function fromBase64(text: string): Uint8Array {
  const values: number[] = [];
  for (const char of text) {
    const value = char === "-" ? 62 : char === "_" ? 63 : BASE64.indexOf(char);
    if (char === "=") break;
    if (value >= 0) values.push(value);
  }
  const out = new Uint8Array(Math.floor((values.length * 6) / 8));
  let bits = 0;
  let acc = 0;
  let at = 0;
  for (const value of values) {
    acc = (acc << 6) | value;
    bits += 6;
    if (bits >= 8) {
      bits -= 8;
      out[at++] = (acc >>> bits) & 0xff;
    }
  }
  return out;
}

function toBase64(bytes: Uint8Array): string {
  let out = "";
  for (let i = 0; i < bytes.length; i += 3) {
    const a = bytes[i] as number;
    const b = bytes[i + 1];
    const c = bytes[i + 2];
    out += BASE64[a >>> 2];
    out += BASE64[((a & 3) << 4) | ((b ?? 0) >>> 4)];
    out += b === undefined ? "=" : BASE64[((b & 15) << 2) | ((c ?? 0) >>> 6)];
    out += c === undefined ? "=" : BASE64[c & 63];
  }
  return out;
}

/** One character per byte (masked), in pieces small enough for `String.fromCharCode`'s arguments. */
function charCodes(bytes: Uint8Array, mask: number): string {
  let out = "";
  for (let i = 0; i < bytes.length; i += 8192) {
    out += String.fromCharCode(...Array.from(bytes.subarray(i, i + 8192), (byte) => byte & mask));
  }
  return out;
}

function bytesOfText(text: string, encoding: BufferEncoding): Uint8Array {
  switch (encoding) {
    case "utf8":
    case "utf-8":
      return encoder.encode(text);
    case "hex":
      return fromHex(text);
    case "base64":
      return fromBase64(text);
    case "latin1":
    case "binary":
    case "ascii":
      // One byte per UTF-16 code unit, as Node.js writes them (a surrogate pair is two).
      return Uint8Array.from({ length: text.length }, (_, i) => text.charCodeAt(i) & 0xff);
  }
}

export class Buffer extends Uint8Array {
  /** Bytes of text, a copy of bytes or an array of numbers, or a view of an `ArrayBuffer` (as Node.js's). */
  static override from(value: unknown, encodingOrOffset?: unknown, length?: unknown): Buffer {
    if (typeof value === "string") return Buffer.#of(bytesOfText(value, encodingOf(encodingOrOffset as string | undefined)));
    if (value instanceof ArrayBuffer || (typeof SharedArrayBuffer !== "undefined" && value instanceof SharedArrayBuffer)) {
      const offset = (encodingOrOffset as number | undefined) ?? 0;
      const size = (length as number | undefined) ?? value.byteLength - offset;
      return new Buffer(value as ArrayBuffer, offset, size);
    }
    if (ArrayBuffer.isView(value)) {
      const view = value as ArrayBufferView;
      return Buffer.#of(new Uint8Array(view.buffer, view.byteOffset, view.byteLength).slice());
    }
    if (Array.isArray(value)) return Buffer.#of(Uint8Array.from(value as number[], (n) => n & 0xff));
    throw new TypeError("Buffer.from: the browser build's Buffer takes text, bytes, an array or an ArrayBuffer");
  }

  static #of(bytes: Uint8Array): Buffer {
    return new Buffer(bytes.buffer as ArrayBuffer, bytes.byteOffset, bytes.byteLength);
  }

  static alloc(size: number, fill: number = 0): Buffer {
    const out = new Buffer(size);
    if (fill !== 0) out.fill(fill);
    return out;
  }

  static byteLength(value: string | ArrayBufferView | ArrayBuffer, encoding?: string): number {
    if (typeof value === "string") return bytesOfText(value, encodingOf(encoding)).length;
    return value.byteLength;
  }

  static isBuffer(value: unknown): value is Buffer {
    return value instanceof Buffer;
  }

  static concat(list: readonly Uint8Array[], totalLength?: number): Buffer {
    const size = totalLength ?? list.reduce((sum, item) => sum + item.length, 0);
    const out = new Buffer(size);
    let at = 0;
    for (const item of list) {
      if (at >= size) break;
      const part = item.subarray(0, size - at);
      out.set(part, at);
      at += part.length;
    }
    return out;
  }

  static compare(a: Uint8Array, b: Uint8Array): -1 | 0 | 1 {
    const length = Math.min(a.length, b.length);
    for (let i = 0; i < length; i++) {
      const x = a[i] as number;
      const y = b[i] as number;
      if (x !== y) return x < y ? -1 : 1;
    }
    return a.length === b.length ? 0 : a.length < b.length ? -1 : 1;
  }

  override toString(encoding?: string, start = 0, end = this.length): string {
    const bytes = this.subarray(start, end);
    switch (encodingOf(encoding)) {
      case "utf8":
      case "utf-8":
        return decoder.decode(bytes);
      case "hex": {
        let out = "";
        for (const byte of bytes) out += HEX[byte];
        return out;
      }
      case "base64":
        return toBase64(bytes);
      case "latin1":
      case "binary":
        return charCodes(bytes, 0xff);
      case "ascii":
        return charCodes(bytes, 0x7f);
    }
  }

  equals(other: Uint8Array): boolean {
    return Buffer.compare(this, other) === 0;
  }
}
