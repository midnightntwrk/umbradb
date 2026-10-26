/**
 * SCALE values read with a runtime's type registry (`scale-info`'s portable registry, `src/backbone/core-block-fetch/
 * metadata.ts`; task 11.1): what `core-chain-events` decodes a block's chain events with (CD-4), and
 * `core-block-parsed` a ledger transaction's call arguments (CD-5). Every type the registry can define is read —
 * composites, variants, sequences, arrays, tuples, primitives, compacts and bit sequences — exactly as
 * `parity-scale-codec` encodes it, and the value is plain data:
 *
 * | Type | Value |
 * |---|---|
 * | `bool` | `boolean` |
 * | `u8`, `u16`, `u32`, `i8`, `i16`, `i32` | `number` |
 * | `u64`, `u128`, `u256`, `i64`, `i128`, `i256` | `bigint` |
 * | `char`, `str` | `string` |
 * | `Compact<T>` | as `T`, the unsigned primitive under any single-field composites (`CompactAs`) |
 * | a sequence or an array of `u8` | `Uint8Array` (a copy) |
 * | another sequence or array, a tuple | an array |
 * | a composite | its fields (below) |
 * | a variant | its name when it has no fields, else `{ <name>: <its fields> }` |
 * | a bit sequence | `{ bits, data }`: the bit count and the store's bytes as encoded |
 *
 * Fields: an object by name when every field is named; the one field's own value when there is exactly one unnamed
 * field (a newtype, such as `H256` or `TxApplied(TxAppliedDetails)`); otherwise an array (none: `[]`). The value is
 * determined by the type and the bytes, so two readers with one registry give one value.
 *
 * {@link canonicalJson} writes a value as JSON for a `jsonb` column (`core_chain_events.events.fields`, `design.md`
 * §10): keys sorted, no space, a `bigint` as its decimal text (a JSON string: integers of 64 bits and wider may be
 * outside the signed 64-bit range the determinism `CHECK` allows a JSON number, Q57), bytes as `0x` lowercase hex.
 *
 * A value is read exactly or not at all: bytes that end too soon, a variant index the type does not have, a `bool`
 * other than 0 or 1, a `char` that is no Unicode scalar value, a string that is not UTF-8, a compact larger than its
 * type, a type id the registry lacks, or types nested deeper than {@link MAX_DEPTH}, throw a `ScaleError`. Pure: no
 * Node.js import.
 */

import type { MetadataField, MetadataType, Primitive, TypeDef } from "../core-block-fetch/metadata.js";
import type { ScaleReader } from "../core-block-fetch/scale.js";

/** A value read with the type registry (see the module comment). */
export type ScaleValue =
  | boolean
  | number
  | bigint
  | string
  | Uint8Array
  | readonly ScaleValue[]
  | { readonly [name: string]: ScaleValue };

/** How deep types may nest in one value: deeper is refused, as no runtime's events come near it. */
export const MAX_DEPTH = 128;

/** The byte width of each fixed-width integer primitive, and whether it is signed. */
const INTEGERS: Readonly<Partial<Record<Primitive, readonly [number, boolean]>>> = Object.freeze({
  u8: [1, false],
  u16: [2, false],
  u32: [4, false],
  u64: [8, false],
  u128: [16, false],
  u256: [32, false],
  i8: [1, true],
  i16: [2, true],
  i32: [4, true],
  i64: [8, true],
  i128: [16, true],
  i256: [32, true],
});

/** The primitives read as a `number`: their values are safe integers. */
const SMALL = new Set<Primitive>(["u8", "u16", "u32", "i8", "i16", "i32"]);

/** The store types of a bit sequence, by their byte width. */
const BIT_STORES: Readonly<Partial<Record<Primitive, number>>> = Object.freeze({ u8: 1, u16: 2, u32: 4, u64: 8 });

/** `bytes` as a little-endian integer, two's complement when `signed`. */
function littleEndian(bytes: Uint8Array, signed: boolean): bigint {
  let value = 0n;
  for (let index = bytes.length - 1; index >= 0; index--) value = (value << 8n) | BigInt(bytes[index] as number);
  if (signed && bytes.length > 0 && ((bytes[bytes.length - 1] as number) & 0x80) !== 0) value -= 1n << BigInt(bytes.length * 8);
  return value;
}

/** Reads values of a type registry's types (see the module comment). */
export class ValueReader {
  readonly #types: ReadonlyMap<number, MetadataType>;

  constructor(types: ReadonlyMap<number, MetadataType>) {
    this.#types = types;
  }

  /** The definition of type `id`; throws a `ScaleError` when the registry lacks it. */
  def(id: number, r: ScaleReader): TypeDef {
    const type = this.#types.get(id);
    if (type === undefined) throw r.error(`the type id ${id}, which the type registry lacks`);
    return type.def;
  }

  /** A value of type `id`, read from `r`. */
  value(r: ScaleReader, id: number, depth = 0): ScaleValue {
    if (depth > MAX_DEPTH) throw r.error(`types nested deeper than ${MAX_DEPTH}`);
    const def = this.def(id, r);
    switch (def.kind) {
      case "composite":
        return this.fields(r, def.fields, depth + 1);
      case "variant": {
        const at = r.offset;
        const index = r.u8();
        const variant = def.variants.find((candidate) => candidate.index === index);
        if (variant === undefined) {
          throw r.errorAt(at, `the variant index ${index}, which the type ${id} does not have`);
        }
        if (variant.fields.length === 0) return variant.name;
        return Object.freeze({ [variant.name]: this.fields(r, variant.fields, depth + 1) });
      }
      case "sequence":
        return this.#items(r, def.type, r.count(), depth);
      case "array":
        return this.#items(r, def.type, def.length, depth);
      case "tuple":
        return Object.freeze(def.types.map((type) => this.value(r, type, depth + 1)));
      case "primitive":
        return this.#primitive(r, def.primitive);
      case "compact":
        return this.#compact(r, def.type, depth);
      case "bitSequence":
        return this.#bits(r, def.store);
    }
  }

  /** The value of `fields`, read in order (see the module comment's "Fields"). */
  fields(r: ScaleReader, fields: readonly MetadataField[], depth = 0): ScaleValue {
    const values = fields.map((field) => this.value(r, field.type, depth + 1));
    if (fields.length > 0 && fields.every((field) => field.name !== null)) {
      const object: Record<string, ScaleValue> = {};
      fields.forEach((field, index) => {
        object[field.name as string] = values[index] as ScaleValue;
      });
      return Object.freeze(object);
    }
    if (fields.length === 1) return values[0] as ScaleValue;
    return Object.freeze(values);
  }

  /** `count` values of `type`: bytes when `type` is `u8`. */
  #items(r: ScaleReader, type: number, count: number, depth: number): ScaleValue {
    const inner = this.def(type, r);
    if (inner.kind === "primitive" && inner.primitive === "u8") return r.bytes(count).slice();
    const items: ScaleValue[] = [];
    for (let index = 0; index < count; index++) items.push(this.value(r, type, depth + 1));
    return Object.freeze(items);
  }

  #primitive(r: ScaleReader, primitive: Primitive): ScaleValue {
    const at = r.offset;
    switch (primitive) {
      case "bool": {
        const byte = r.u8();
        if (byte > 1) throw r.errorAt(at, `a bool ${byte}, not 0 or 1`);
        return byte === 1;
      }
      case "char": {
        const code = r.u32();
        if (code > 0x10ffff || (code >= 0xd800 && code <= 0xdfff)) {
          throw r.errorAt(at, `a char ${code}, which is no Unicode scalar value`);
        }
        return String.fromCodePoint(code);
      }
      case "str":
        return r.string();
      default: {
        const [width, signed] = INTEGERS[primitive] as readonly [number, boolean];
        const value = littleEndian(r.bytes(width), signed);
        return SMALL.has(primitive) ? Number(value) : value;
      }
    }
  }

  /** `Compact<T>`: `T` is an unsigned primitive, or a composite of one field whose type is one (`CompactAs`). */
  #compact(r: ScaleReader, type: number, depth: number): ScaleValue {
    let def = this.def(type, r);
    for (let level = 0; def.kind === "composite" && def.fields.length === 1; level++) {
      if (level + depth > MAX_DEPTH) throw r.error(`types nested deeper than ${MAX_DEPTH}`);
      def = this.def((def.fields[0] as MetadataField).type, r);
    }
    const unsigned = def.kind === "primitive" ? INTEGERS[def.primitive] : undefined;
    if (def.kind !== "primitive" || unsigned === undefined || unsigned[1]) {
      throw r.error(`a compact of the type ${type}, which is no unsigned integer`);
    }
    const at = r.offset;
    const value = r.compact();
    if (value >= 1n << BigInt(unsigned[0] * 8)) {
      throw r.errorAt(at, `the compact ${value}, too large for ${def.primitive}`);
    }
    return SMALL.has(def.primitive) ? Number(value) : value;
  }

  /** A bit sequence (`bitvec`'s encoding): a compact bit count, then that many bits' store elements. */
  #bits(r: ScaleReader, store: number): ScaleValue {
    const def = this.def(store, r);
    const width = def.kind === "primitive" ? BIT_STORES[def.primitive] : undefined;
    if (width === undefined) throw r.error(`a bit sequence stored in the type ${store}, which is not u8, u16, u32 or u64`);
    const bits = r.count();
    const elements = Math.ceil(bits / (width * 8));
    return Object.freeze({ bits, data: r.bytes(elements * width).slice() });
  }
}

const HEX = "0123456789abcdef";

/** `bytes` as `0x`-prefixed lowercase hex. */
export function hexOf(bytes: Uint8Array): string {
  let text = "0x";
  for (const byte of bytes) text += (HEX[byte >> 4] as string) + (HEX[byte & 15] as string);
  return text;
}

/** `value` as canonical JSON text (see the module comment). */
export function canonicalJson(value: ScaleValue): string {
  switch (typeof value) {
    case "boolean":
      return value ? "true" : "false";
    case "number":
      return String(value);
    case "bigint":
      return `"${value}"`;
    case "string":
      return JSON.stringify(value);
    default:
      if (value instanceof Uint8Array) return `"${hexOf(value)}"`;
      if (Array.isArray(value)) return `[${(value as readonly ScaleValue[]).map(canonicalJson).join(",")}]`;
      return `{${Object.keys(value)
        .sort()
        .map((key) => `${JSON.stringify(key)}:${canonicalJson((value as Record<string, ScaleValue>)[key] as ScaleValue)}`)
        .join(",")}}`;
  }
}
