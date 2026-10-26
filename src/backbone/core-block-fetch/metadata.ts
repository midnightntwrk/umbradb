/**
 * The runtime metadata `core-block-fetch` decodes a block's content with (CD-2, LG-4; task 10.3): `state_getMetadata`'s
 * answer, read far enough to name each extrinsic's call — the portable type registry and the pallets with their
 * indices and call enums.
 *
 * **Which version.** `state_getMetadata` answers the runtime API `Metadata_metadata`, which FRAME's `construct_runtime`
 * implements with metadata **V14** for every runtime (newer versions only through `Metadata_metadata_at_version`, which
 * IN-8 does not list), so V14 is read whole and its end checked; V15, whose registry and pallets differ from V14's only by
 * the pallets' documentation, is read up to its pallets; any other version is refused. The layout is `frame-metadata`'s
 * (`RuntimeMetadataPrefixed`: the magic `meta`, the version byte, then the version's struct) over `scale-info`'s portable
 * registry, whose encoding every version shares — checked against a Midnight node's V16 metadata file (task 10.3's
 * probe; the record).
 *
 * The value read is frozen: types by id, and the pallets in their order with their index (the byte that opens their
 * calls), the type ids of their call, event and error enums, and their storage entries — the storage prefix and, per
 * entry, its name, modifier and types (task 11.1: `core-chain-events` finds `System::Events`' type there, CD-4). Pure: no
 * Node.js import.
 */

import { ScaleError, ScaleReader } from "./scale.js";

/** `scale-info`'s primitive types, in their encoding's order. */
export const PRIMITIVES = Object.freeze([
  "bool",
  "char",
  "str",
  "u8",
  "u16",
  "u32",
  "u64",
  "u128",
  "u256",
  "i8",
  "i16",
  "i32",
  "i64",
  "i128",
  "i256",
] as const);

export type Primitive = (typeof PRIMITIVES)[number];

/** A field of a composite or a variant. */
export interface MetadataField {
  readonly name: string | null;
  readonly type: number;
  readonly typeName: string | null;
}

/** A variant of an enum. */
export interface MetadataVariant {
  readonly name: string;
  readonly index: number;
  readonly fields: readonly MetadataField[];
}

/** A type's definition (`scale-info`'s `TypeDef`). */
export type TypeDef =
  | { readonly kind: "composite"; readonly fields: readonly MetadataField[] }
  | { readonly kind: "variant"; readonly variants: readonly MetadataVariant[] }
  | { readonly kind: "sequence"; readonly type: number }
  | { readonly kind: "array"; readonly length: number; readonly type: number }
  | { readonly kind: "tuple"; readonly types: readonly number[] }
  | { readonly kind: "primitive"; readonly primitive: Primitive }
  | { readonly kind: "compact"; readonly type: number }
  | { readonly kind: "bitSequence"; readonly store: number; readonly order: number };

/** A type of the registry. */
export interface MetadataType {
  readonly id: number;
  readonly path: readonly string[];
  readonly params: readonly { readonly name: string; readonly type: number | null }[];
  readonly def: TypeDef;
}

/** The storage hashers, in their encoding's order (`frame-metadata`'s `StorageHasher`). */
export const STORAGE_HASHERS = Object.freeze([
  "Blake2_128",
  "Blake2_256",
  "Blake2_128Concat",
  "Twox128",
  "Twox256",
  "Twox64Concat",
  "Identity",
] as const);

/** One storage entry of a pallet (`StorageEntryMetadata`): its name, its modifier and its types. */
export type MetadataStorageEntry =
  | {
      readonly name: string;
      readonly modifier: "optional" | "default";
      readonly kind: "plain";
      /** The value's type id. */
      readonly value: number;
    }
  | {
      readonly name: string;
      readonly modifier: "optional" | "default";
      readonly kind: "map";
      readonly hashers: readonly (typeof STORAGE_HASHERS)[number][];
      readonly key: number;
      readonly value: number;
    };

/** A pallet's storage (`PalletStorageMetadata`): the prefix its keys start with (hashed), and its entries in order. */
export interface MetadataStorage {
  readonly prefix: string;
  readonly entries: readonly MetadataStorageEntry[];
}

/**
 * A pallet: its name, its index, the type ids of its call, event and error enums (null for none), and its storage (null
 * for none).
 */
export interface MetadataPallet {
  readonly name: string;
  readonly index: number;
  readonly calls: number | null;
  readonly event: number | null;
  readonly error: number | null;
  readonly storage: MetadataStorage | null;
}

/** What `core-block-fetch` reads of a runtime's metadata. */
export interface RuntimeMetadataView {
  readonly version: 14 | 15;
  readonly types: ReadonlyMap<number, MetadataType>;
  readonly pallets: readonly MetadataPallet[];
}

/** The magic that opens every metadata: `meta`. */
export const METADATA_MAGIC = Object.freeze([0x6d, 0x65, 0x74, 0x61] as const);

const strings = (r: ScaleReader): string[] => r.vector(() => r.string());

function field(r: ScaleReader): MetadataField {
  const name = r.option(() => r.string());
  const type = r.count();
  const typeName = r.option(() => r.string());
  strings(r);
  return Object.freeze({ name, type, typeName });
}

function typeDef(r: ScaleReader): TypeDef {
  const at = r.offset;
  const tag = r.u8();
  switch (tag) {
    case 0:
      return { kind: "composite", fields: Object.freeze(r.vector(() => field(r))) };
    case 1:
      return {
        kind: "variant",
        variants: Object.freeze(
          r.vector(() => {
            const name = r.string();
            const fields = Object.freeze(r.vector(() => field(r)));
            const index = r.u8();
            strings(r);
            return Object.freeze({ name, index, fields });
          }),
        ),
      };
    case 2:
      return { kind: "sequence", type: r.count() };
    case 3: {
      const length = r.u32();
      return { kind: "array", length, type: r.count() };
    }
    case 4:
      return { kind: "tuple", types: Object.freeze(r.vector(() => r.count())) };
    case 5: {
      const index = r.u8();
      const primitive = PRIMITIVES[index];
      if (primitive === undefined) throw r.error(`a primitive type ${index}, beyond i256 (14)`);
      return { kind: "primitive", primitive };
    }
    case 6:
      return { kind: "compact", type: r.count() };
    case 7: {
      const store = r.count();
      return { kind: "bitSequence", store, order: r.count() };
    }
    default:
      throw new ScaleError("the runtime metadata", at, `a type definition ${tag}, beyond BitSequence (7)`);
  }
}

/** `scale-info`'s portable registry: every type by its id (ids unique). */
export function readTypeRegistry(r: ScaleReader): Map<number, MetadataType> {
  const types = new Map<number, MetadataType>();
  r.vector(() => {
    const at = r.offset;
    const id = r.count();
    const path = Object.freeze(strings(r));
    const params = Object.freeze(
      r.vector(() => {
        const name = r.string();
        return Object.freeze({ name, type: r.option(() => r.count()) });
      }),
    );
    const def = Object.freeze(typeDef(r));
    strings(r);
    if (types.has(id)) throw new ScaleError("the runtime metadata", at, `the type id ${id} given twice`);
    types.set(id, Object.freeze({ id, path, params, def }));
  });
  return types;
}

/** One `StorageEntryMetadata`: its name, modifier and types; its default value and documentation stepped over. */
function storageEntry(r: ScaleReader): MetadataStorageEntry {
  const name = r.string();
  const modifierByte = r.u8();
  if (modifierByte > 1) throw r.error(`a storage modifier ${modifierByte}, not Optional (0) or Default (1)`);
  const modifier = modifierByte === 0 ? "optional" : "default";
  const at = r.offset;
  const kind = r.u8();
  let entry: MetadataStorageEntry;
  if (kind === 0) {
    entry = { name, modifier, kind: "plain", value: r.count() };
  } else if (kind === 1) {
    const hashers = Object.freeze(
      r.vector(() => {
        const hasher = r.u8();
        const known = STORAGE_HASHERS[hasher];
        if (known === undefined) throw r.error(`a storage hasher ${hasher}, beyond Identity (6)`);
        return known;
      }),
    );
    const key = r.count();
    entry = { name, modifier, kind: "map", hashers, key, value: r.count() };
  } else {
    throw new ScaleError("the runtime metadata", at, `a storage entry type ${kind}, not Plain (0) or Map (1)`);
  }
  r.byteString();
  strings(r);
  return Object.freeze(entry);
}

function pallet(r: ScaleReader, version: 14 | 15): MetadataPallet {
  const name = r.string();
  const storage = r.option(() => {
    const prefix = r.string();
    return Object.freeze({ prefix, entries: Object.freeze(r.vector(() => storageEntry(r))) });
  });
  const calls = r.option(() => r.count());
  const event = r.option(() => r.count());
  r.vector(() => {
    r.string();
    r.count();
    r.byteString();
    strings(r);
  });
  const error = r.option(() => r.count());
  const index = r.u8();
  if (version === 15) strings(r);
  return Object.freeze({ name, index, calls, event, error, storage });
}

/** V14's extrinsic metadata and the runtime's type, read to check the metadata's end. */
function v14Tail(r: ScaleReader): void {
  r.count();
  r.u8();
  r.vector(() => {
    r.string();
    r.count();
    r.count();
  });
  r.count();
}

/**
 * `bytes` — `state_getMetadata`'s answer — read (see the module comment): throws a `ScaleError` for bytes that are not
 * metadata V14 or V15, a type a pallet names that the registry lacks, or two pallets with one index.
 */
export function readRuntimeMetadata(bytes: Uint8Array): RuntimeMetadataView {
  const r = new ScaleReader(bytes, "the runtime metadata");
  const magic = r.bytes(4);
  if (!METADATA_MAGIC.every((byte, index) => magic[index] === byte)) throw new ScaleError("the runtime metadata", 0, "no magic `meta`");
  const versionByte = r.u8();
  if (versionByte !== 14 && versionByte !== 15) {
    throw new ScaleError(
      "the runtime metadata",
      4,
      `metadata version ${versionByte}: state_getMetadata gives version 14 (core-block-fetch reads 14 and 15)`,
    );
  }
  const version = versionByte;
  const types = readTypeRegistry(r);
  const pallets = Object.freeze(r.vector(() => pallet(r, version)));
  if (version === 14) {
    v14Tail(r);
    r.end();
  }
  const indices = new Set<number>();
  for (const { name, index, calls, event, error, storage } of pallets) {
    if (indices.has(index)) throw new ScaleError("the runtime metadata", 0, `two pallets with the index ${index}`);
    indices.add(index);
    const stored = (storage?.entries ?? []).flatMap((entry) => (entry.kind === "plain" ? [entry.value] : [entry.key, entry.value]));
    for (const type of [calls, event, error, ...stored]) {
      if (type !== null && !types.has(type)) {
        throw new ScaleError("the runtime metadata", 0, `the pallet ${name} names the type ${type}, which the registry lacks`);
      }
    }
  }
  return Object.freeze({ version, types, pallets });
}
