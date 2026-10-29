import type { TapeRecord } from "../../tools/tape/index.js";
import { bareExtrinsic, type ChainBlock, compact, content, hex } from "./fetch-fixtures.js";

/**
 * Synthetic runtimes with chain events, for the tests of `core-chain-events`, `core-block-parsed` and
 * `core-tx-results`. They hold metadata V14 in `frame-metadata`'s layout over `scale-info`'s portable registry, written
 * here independently of the code under test. The metadata holds the types, calls, events and the `System::Events`
 * storage entry of a Midnight runtime. The fixtures also give the SCALE bytes of `System::Events` values, as a node
 * gives them. [CD-4, CD-5, CD-6]
 *
 * **The runtime** follows the real Midnight node metadata files (`midnight-indexer` 2.1.0-rc.4's `.node/*`):
 * - pallet indices: `System` 0, `Timestamp` 1, `Grandpa` 3, `Midnight` 5, `MidnightSystem` 6, `CNightObservation` 13,
 *   `Session` 30, `FederatedAuthorityObservation` 45;
 * - `System`'s events: `ExtrinsicSuccess` { dispatch_info } 0, `ExtrinsicFailed` { dispatch_error, dispatch_info } 1,
 *   `CodeUpdated` 2 (no fields up to runtime 2.0, `{ hash }` from 2.1, the real change {@link V2_1} models),
 *   `Remarked` { sender, hash } 5;
 * - `Midnight`'s calls: `send_mn_transaction` 0 and `set_tx_size_weight` 1 (Root only);
 * - `Midnight`'s events, each with one unnamed field (a details struct): `ContractCall` 0, `ContractDeploy` 1,
 *   `TxApplied` 2, `PayoutMinted` 4, `TxPartialSuccess` 7;
 * - `MidnightSystem`'s `SystemTransactionApplied` { hash, serialized_system_transaction } 0;
 * - `CNightObservation`'s own `SystemTransactionApplied` { system_transaction_hash } 3 (a hash only);
 * - `Session`'s `NewSession` { session_index } 0;
 * - `Grandpa`'s `NewAuthorities` { authority_set: Vec<([u8; 32], u64)> } 0.
 *
 * The shared types:
 * - `DispatchEventInfo` is { weight: { ref_time, proof_size: Compact<u64> }, class, pays_fee };
 * - `DispatchError` has `Other` 0, `CannotLookup` 1, `BadOrigin` 2 and `Module(ModuleError { index, error: [u8; 4] })` 3;
 * - `Phase` is `ApplyExtrinsic(u32)` 0, `Finalization` 1, `Initialization` 2;
 * - an event record is { phase, event, topics: Vec<H256> }.
 */

// ── SCALE ───────────────────────────────────────────────────────────────────────────────────────────────────────────

const text = (value: string): number[] => {
  const bytes = [...Buffer.from(value, "utf8")];
  return [...compact(bytes.length), ...bytes];
};
const vec = <T>(items: readonly T[], each: (item: T) => number[]): number[] => [...compact(items.length), ...items.flatMap(each)];
const none = [0];
const some = (inner: number[]): number[] => [1, ...inner];
const u32 = (value: number): number[] => [value & 0xff, (value >> 8) & 0xff, (value >> 16) & 0xff, (value >>> 24) & 0xff];
const u64 = (value: bigint): number[] => Array.from({ length: 8 }, (_, i) => Number((value >> BigInt(8 * i)) & 0xffn));
const u128 = (value: bigint): number[] => Array.from({ length: 16 }, (_, i) => Number((value >> BigInt(8 * i)) & 0xffn));

// ── a portable type registry ────────────────────────────────────────────────────────────────────────────────────────

/** A field: its name (null for an unnamed one) and its type id. */
export type Field = readonly [name: string | null, type: number];

/** Builds `scale-info`'s portable registry, one type at a time. */
export class Registry {
  readonly #types: number[][] = [];

  /** Adds a type, returning its id. */
  add(path: readonly string[], def: readonly number[]): number {
    const id = this.#types.length;
    this.#types.push([...compact(id), ...vec(path, text), ...vec([], () => []), ...def, ...vec([], text)]);
    return id;
  }

  primitive(name: "bool" | "char" | "str" | "u8" | "u16" | "u32" | "u64" | "u128" | "i8" | "i16" | "i32" | "i64" | "i128"): number {
    const index = ["bool", "char", "str", "u8", "u16", "u32", "u64", "u128", "u256", "i8", "i16", "i32", "i64", "i128", "i256"].indexOf(name);
    return this.add([], [5, index]);
  }

  composite(path: readonly string[], fields: readonly Field[]): number {
    return this.add(path, [0, ...vec(fields, field)]);
  }

  variant(path: readonly string[], variants: readonly { name: string; index: number; fields?: readonly Field[] }[]): number {
    return this.add(path, [
      1,
      ...vec(variants, (variant) => [...text(variant.name), ...vec(variant.fields ?? [], field), variant.index, ...vec([], text)]),
    ]);
  }

  sequence(type: number): number {
    return this.add([], [2, ...compact(type)]);
  }

  array(length: number, type: number): number {
    return this.add([], [3, ...u32(length), ...compact(type)]);
  }

  tuple(types: readonly number[]): number {
    return this.add([], [4, ...vec(types, (type) => compact(type))]);
  }

  compactOf(type: number): number {
    return this.add([], [6, ...compact(type)]);
  }

  bits(store: number, order: number): number {
    return this.add([], [7, ...compact(store), ...compact(order)]);
  }

  /** The registry's bytes. */
  bytes(): number[] {
    return [...compact(this.#types.length), ...this.#types.flat()];
  }
}

function field([name, type]: Field): number[] {
  return [...(name === null ? none : some(text(name))), ...compact(type), ...none, ...vec([], text)];
}

// ── metadata V14 ────────────────────────────────────────────────────────────────────────────────────────────────────

/** A storage entry of a test pallet. */
export type StorageSpec =
  | { readonly name: string; readonly kind: "plain"; readonly value: number }
  | { readonly name: string; readonly kind: "map"; readonly hashers: readonly number[]; readonly key: number; readonly value: number };

/** A pallet of a test runtime's metadata. */
export interface PalletMetadata {
  readonly name: string;
  readonly index: number;
  readonly calls?: number;
  readonly event?: number;
  readonly storage?: { readonly prefix: string; readonly entries: readonly StorageSpec[] };
}

/** Metadata V14 (the magic, the version, the registry, the pallets, the extrinsic metadata, the runtime type). */
export function metadataV14(registry: Registry, pallets: readonly PalletMetadata[], extrinsic: number, runtime: number): Uint8Array {
  const entry = (spec: StorageSpec): number[] => [
    ...text(spec.name),
    1,
    ...(spec.kind === "plain"
      ? [0, ...compact(spec.value)]
      : [1, ...vec(spec.hashers, (hasher) => [hasher]), ...compact(spec.key), ...compact(spec.value)]),
    ...vec([0], (byte) => [byte]),
    ...vec(["A storage entry."], text),
  ];
  const pallet = (spec: PalletMetadata): number[] => [
    ...text(spec.name),
    ...(spec.storage === undefined ? none : some([...text(spec.storage.prefix), ...vec(spec.storage.entries, entry)])),
    ...(spec.calls === undefined ? none : some(compact(spec.calls))),
    ...(spec.event === undefined ? none : some(compact(spec.event))),
    ...vec([], () => []),
    ...none,
    spec.index,
  ];
  return Uint8Array.from([
    0x6d,
    0x65,
    0x74,
    0x61,
    14,
    ...registry.bytes(),
    ...vec(pallets, pallet),
    ...compact(extrinsic),
    4,
    ...vec([], () => []),
    ...compact(runtime),
  ]);
}

// ── a Midnight runtime ──────────────────────────────────────────────────────────────────────────────────────────────

/** How a test runtime differs from {@link V2_0}'s layout. */
export interface RuntimeShape {
  /** `System::CodeUpdated` carries `{ hash }` (runtime 2.1) rather than nothing (up to 2.0). */
  readonly codeUpdatedHash: boolean;
  /** The `Timestamp` pallet's index: 1, or 2 with `Preimage` at 1 (the synthetic runtime upgrade). */
  readonly timestampIndex: 1 | 2;
  /** Leave the `System::Events` storage entry out (a metadata it cannot be read with). */
  readonly noEventsEntry?: boolean;
}

/** Runtime 2.0's layout: `CodeUpdated` without fields, `Timestamp` at 1. */
export const V2_0: RuntimeShape = Object.freeze({ codeUpdatedHash: false, timestampIndex: 1 });

/** Runtime 2.1's: `CodeUpdated { hash }`, and `Preimage` at 1 with `Timestamp` at 2. */
export const V2_1: RuntimeShape = Object.freeze({ codeUpdatedHash: true, timestampIndex: 2 });

/** A test runtime: its `spec_version` and metadata, and its pallet indices. */
export interface EventsRuntime {
  readonly specVersion: number;
  readonly metadata: Uint8Array;
  readonly shape: RuntimeShape;
}

/** The metadata of a Midnight runtime of `shape` (see the module comment). */
export function midnightMetadata(shape: RuntimeShape): Uint8Array {
  const t = new Registry();
  const u8 = t.primitive("u8");
  const u32Type = t.primitive("u32");
  const u64Type = t.primitive("u64");
  const u128Type = t.primitive("u128");
  const compactU64 = t.compactOf(u64Type);
  const bytes = t.sequence(u8);
  const array32 = t.array(32, u8);
  const array4 = t.array(4, u8);
  const h256 = t.composite(["primitive_types", "H256"], [[null, array32]]);
  const accountId = t.composite(["sp_core", "crypto", "AccountId32"], [[null, array32]]);
  const weight = t.composite(["sp_weights", "weight_v2", "Weight"], [["ref_time", compactU64], ["proof_size", compactU64]]);
  const dispatchClass = t.variant(["frame_support", "dispatch", "DispatchClass"], [
    { name: "Normal", index: 0 },
    { name: "Operational", index: 1 },
    { name: "Mandatory", index: 2 },
  ]);
  const pays = t.variant(["frame_support", "dispatch", "Pays"], [{ name: "Yes", index: 0 }, { name: "No", index: 1 }]);
  const info = t.composite(["frame_system", "DispatchEventInfo"], [["weight", weight], ["class", dispatchClass], ["pays_fee", pays]]);
  const moduleError = t.composite(["sp_runtime", "ModuleError"], [["index", u8], ["error", array4]]);
  const dispatchError = t.variant(["sp_runtime", "DispatchError"], [
    { name: "Other", index: 0 },
    { name: "CannotLookup", index: 1 },
    { name: "BadOrigin", index: 2 },
    { name: "Module", index: 3, fields: [[null, moduleError]] },
  ]);
  const systemEvent = t.variant(["frame_system", "pallet", "Event"], [
    { name: "ExtrinsicSuccess", index: 0, fields: [["dispatch_info", info]] },
    { name: "ExtrinsicFailed", index: 1, fields: [["dispatch_error", dispatchError], ["dispatch_info", info]] },
    { name: "CodeUpdated", index: 2, fields: shape.codeUpdatedHash ? [["hash", h256]] : [] },
    { name: "Remarked", index: 5, fields: [["sender", accountId], ["hash", h256]] },
  ]);
  const txDetails = t.composite(["pallet_midnight", "pallet", "TxAppliedDetails"], [["tx_hash", array32]]);
  const callDetails = t.composite(["pallet_midnight", "pallet", "CallDetails"], [["tx_hash", array32], ["contract_address", bytes]]);
  const payout = t.composite(["pallet_midnight", "pallet", "PayoutDetails"], [["amount", u128Type], ["receiver", bytes]]);
  const midnightEvent = t.variant(["pallet_midnight", "pallet", "Event"], [
    { name: "ContractCall", index: 0, fields: [[null, callDetails]] },
    { name: "ContractDeploy", index: 1, fields: [[null, callDetails]] },
    { name: "TxApplied", index: 2, fields: [[null, txDetails]] },
    { name: "PayoutMinted", index: 4, fields: [[null, payout]] },
    { name: "TxPartialSuccess", index: 7, fields: [[null, txDetails]] },
  ]);
  const systemApplied = t.composite(["pallet_midnight_system", "pallet", "SystemTransactionApplied"], [
    ["hash", array32],
    ["serialized_system_transaction", bytes],
  ]);
  const midnightSystemEvent = t.variant(["pallet_midnight_system", "pallet", "Event"], [
    { name: "SystemTransactionApplied", index: 0, fields: [[null, systemApplied]] },
  ]);
  const cnightApplied = t.composite(["pallet_cnight_observation", "pallet", "SystemTransactionApplied"], [
    ["system_transaction_hash", array32],
  ]);
  const cnightEvent = t.variant(["pallet_cnight_observation", "pallet", "Event"], [
    { name: "SystemTransactionApplied", index: 3, fields: [[null, cnightApplied]] },
  ]);
  const sessionEvent = t.variant(["pallet_partner_chains_session", "pallet", "Event"], [
    { name: "NewSession", index: 0, fields: [["session_index", u32Type]] },
  ]);
  const authority = t.tuple([array32, u64Type]);
  const grandpaEvent = t.variant(["pallet_grandpa", "pallet", "Event"], [
    { name: "NewAuthorities", index: 0, fields: [["authority_set", t.sequence(authority)]] },
  ]);
  const runtimeEvent = t.variant(["midnight_node_runtime", "RuntimeEvent"], [
    { name: "System", index: 0, fields: [[null, systemEvent]] },
    { name: "Grandpa", index: 3, fields: [[null, grandpaEvent]] },
    { name: "Midnight", index: 5, fields: [[null, midnightEvent]] },
    { name: "MidnightSystem", index: 6, fields: [[null, midnightSystemEvent]] },
    { name: "CNightObservation", index: 13, fields: [[null, cnightEvent]] },
    { name: "Session", index: 30, fields: [[null, sessionEvent]] },
  ]);
  const phase = t.variant(["frame_system", "Phase"], [
    { name: "ApplyExtrinsic", index: 0, fields: [[null, u32Type]] },
    { name: "Finalization", index: 1 },
    { name: "Initialization", index: 2 },
  ]);
  const record = t.composite(["frame_system", "EventRecord"], [["phase", phase], ["event", runtimeEvent], ["topics", t.sequence(h256)]]);
  const records = t.sequence(record);
  const call = (path: string, name: string, args: readonly Field[]) => t.variant([path, "pallet", "Call"], [{ name, index: 0, fields: args }]);
  const systemCall = call("frame_system", "remark", [["remark", bytes]]);
  const timestampCall = call("pallet_timestamp", "set", [["now", compactU64]]);
  const preimageCall = call("pallet_preimage", "note_preimage", [["bytes", bytes]]);
  const midnightCall = t.variant(["pallet_midnight", "pallet", "Call"], [
    { name: "send_mn_transaction", index: 0, fields: [["midnight_tx", bytes]] },
    { name: "set_tx_size_weight", index: 1, fields: [["new_weight", weight]] },
  ]);
  const midnightSystemCall = call("pallet_midnight_system", "send_mn_system_transaction", [["midnight_system_tx", bytes]]);
  const cnightCall = call("pallet_cnight_observation", "process_tokens", [["utxos", bytes]]);
  const federatedCall = call("pallet_federated_authority_observation", "reset_members", [["members", bytes]]);
  const extrinsic = t.composite(["sp_runtime", "generic", "UncheckedExtrinsic"], []);
  const runtime = t.composite(["midnight_node_runtime", "Runtime"], []);
  const events = shape.noEventsEntry ? [] : [{ name: "Events", kind: "plain" as const, value: records }];
  return metadataV14(
    t,
    [
      { name: "System", index: 0, calls: systemCall, event: systemEvent, storage: { prefix: "System", entries: [{ name: "Number", kind: "plain", value: u32Type }, ...events] } },
      ...(shape.timestampIndex === 2 ? [{ name: "Preimage", index: 1, calls: preimageCall }] : []),
      { name: "Timestamp", index: shape.timestampIndex, calls: timestampCall },
      { name: "Grandpa", index: 3, event: grandpaEvent },
      { name: "Midnight", index: 5, calls: midnightCall, event: midnightEvent },
      { name: "MidnightSystem", index: 6, calls: midnightSystemCall, event: midnightSystemEvent },
      { name: "CNightObservation", index: 13, calls: cnightCall, event: cnightEvent },
      { name: "Session", index: 30, event: sessionEvent },
      { name: "FederatedAuthorityObservation", index: 45, calls: federatedCall },
    ],
    extrinsic,
    runtime,
  );
}

/** A test runtime of `shape` with `specVersion`. */
export function eventsRuntime(specVersion: number, shape: RuntimeShape): EventsRuntime {
  return Object.freeze({ specVersion, metadata: midnightMetadata(shape), shape });
}

/** Runtime 2.0 (v9 on preprod) with {@link V2_0}'s layout: the chain of most tests. */
export const RUNTIME_2_0 = eventsRuntime(2_000_000, V2_0);

// ── events ──────────────────────────────────────────────────────────────────────────────────────────────────────────

/** An event's phase: `ApplyExtrinsic(i)` as `i`, or the two others by name. */
export type Phase = number | "finalization" | "initialization";

const phaseBytes = (phase: Phase): number[] =>
  phase === "finalization" ? [1] : phase === "initialization" ? [2] : [0, ...u32(phase)];

/** One event record's SCALE bytes: phase, pallet index, event index, fields, topics. */
export function record(phase: Phase, pallet: number, event: number, fields: readonly number[], topics: readonly Uint8Array[] = []): number[] {
  return [...phaseBytes(phase), pallet, event, ...fields, ...vec(topics, (topic) => [...topic])];
}

/** A `System::Events` value: a compact count, then the records. */
export function eventsValue(records: readonly (readonly number[])[]): Uint8Array {
  return Uint8Array.from([...compact(records.length), ...records.flat()]);
}

/** `DispatchEventInfo { weight: { ref_time, proof_size }, class, pays_fee }`. */
export function dispatchInfo(refTime = 0n, proofSize = 0n, dispatchClass = 0, paysFee = 0): number[] {
  return [...compact(refTime), ...compact(proofSize), dispatchClass, paysFee];
}

/** The events of the test runtime, by name: each gives its record. */
export const ev = Object.freeze({
  success: (i: Phase, info = dispatchInfo()) => record(i, 0, 0, info),
  failed: (i: Phase, error: readonly number[] = [2], info = dispatchInfo()) => record(i, 0, 1, [...error, ...info]),
  /** `CodeUpdated` as runtime 2.0 writes it (no fields), or 2.1 (`{ hash }`). */
  codeUpdated: (i: Phase, hash?: Uint8Array) => record(i, 0, 2, hash === undefined ? [] : [...hash]),
  remarked: (i: Phase, sender: Uint8Array, hash: Uint8Array, topics: readonly Uint8Array[] = []) => record(i, 0, 5, [...sender, ...hash], topics),
  txApplied: (i: Phase, hash: Uint8Array) => record(i, 5, 2, [...hash]),
  txPartial: (i: Phase, hash: Uint8Array) => record(i, 5, 7, [...hash]),
  contractCall: (i: Phase, hash: Uint8Array, address: Uint8Array) => record(i, 5, 0, [...hash, ...compact(address.length), ...address]),
  payout: (i: Phase, amount: bigint, receiver: Uint8Array) => record(i, 5, 4, [...u128(amount), ...compact(receiver.length), ...receiver]),
  systemApplied: (i: Phase, hash: Uint8Array, bytes: Uint8Array) => record(i, 6, 0, [...hash, ...compact(bytes.length), ...bytes]),
  cnightApplied: (i: Phase, hash: Uint8Array) => record(i, 13, 3, [...hash]),
  newSession: (i: Phase, index: number) => record(i, 30, 0, u32(index)),
  newAuthorities: (i: Phase, set: readonly (readonly [Uint8Array, bigint])[]) => record(i, 3, 0, vec(set, ([key, w]) => [...key, ...u64(w)])),
});

/** `DispatchError::Module(ModuleError { index, error })`. */
export function moduleError(index: number, error: readonly [number, number, number, number]): number[] {
  return [3, index, ...error];
}

// ── extrinsics and tape records ─────────────────────────────────────────────────────────────────────────────────────

/** A top-level `MidnightSystem::send_mn_system_transaction` (version 4, unsigned) carrying `bytes`: block 0's form. */
export function systemExtrinsic(bytes: Uint8Array): Uint8Array {
  return bareExtrinsic(0x04, 6, 0, [...compact(bytes.length), ...bytes]);
}

/** A `System::remark` extrinsic (a stand-in for a governance or other non-Midnight call). */
export function remarkExtrinsic(bytes: readonly number[] = [1]): Uint8Array {
  return bareExtrinsic(0x04, 0, 0, [...compact(bytes.length), ...bytes]);
}

/** A top-level `Midnight::set_tx_size_weight(new_weight)` (version 4, unsigned): Root only, so it fails; no transaction. */
export function weightExtrinsic(refTime = 1n, proofSize = 2n): Uint8Array {
  return bareExtrinsic(0x04, 5, 1, [...compact(refTime), ...compact(proofSize)]);
}

/** A signed (version 4) extrinsic: its call follows a signature, and is not decoded (`core-block-fetch`). */
export function signedExtrinsic(): Uint8Array {
  const body = [0x84, ...new Array<number>(40).fill(7)];
  return Uint8Array.from([...compact(body.length), ...body]);
}

/** The storage key of `System::Events`, as hex: `twox128("System") ++ twox128("Events")`. */
export const SYSTEM_EVENTS_STORAGE = "0x26aa394eea5630e07c48ae0c9558cef780d41e5e16056765bc8461851072c9d7";

/** `state_getStorage(System::Events, block)` answering `events` (null: no value). */
export function eventsRead(block: ChainBlock, events: Uint8Array | null): TapeRecord {
  return { method: "state_getStorage", params: [SYSTEM_EVENTS_STORAGE, block.hex], result: events === null ? null : hex(events) };
}

/**
 * The calls of a finalized height with its events: `chain_getBlockHash`, its content ({@link content}: the block, the
 * runtime version at its parent's state and, when `metadata`, the metadata there) and `System::Events` at its hash.
 */
export function finalizedWithEvents(block: ChainBlock, runtime: EventsRuntime, events: Uint8Array | null, metadata = false): TapeRecord[] {
  return [
    { method: "chain_getBlockHash", params: [Number(block.height)], result: block.hex },
    ...content(block, runtime, metadata),
    eventsRead(block, events),
  ];
}
