/**
 * A block's extrinsics, decoded with the runtime metadata of its parent's state (CD-2, LG-4; task 10.3), as far as
 * `core-block-fetch` needs: each extrinsic's version and, for an unsigned ("bare") one, its call — the pallet and the
 * call by name, from their index bytes, and its encoded arguments — and the block's own time from its `Timestamp::set`
 * inherent, as the official indexer reads it (`chain-indexer/src/infra/subxt_node/runtimes.rs`, `CallExt::timestamp`).
 *
 * **The format** (`sp_runtime::generic::UncheckedExtrinsic`): a compact length, then the version byte — `0x04` an
 * unsigned extrinsic of version 4, `0x84` a signed one, `0x05` a bare extrinsic of version 5, `0x45` a general one
 * (transaction extensions) — then, for the unsigned and bare kinds, the call: the pallet's index, the call's index
 * within the pallet's call enum, the call's arguments. A signed or general extrinsic's call follows its signature or
 * extensions, whose lengths only the full type registry gives; `core-block-fetch` leaves those calls to the modules that
 * decode them (`core-block-parsed`, task 11.1): their `call` is null. Inherents — `Timestamp::set` among them — are
 * always unsigned. Midnight blocks hold both versions (block 3,174,332 on mainnet: `0x05` inherents and `0x04` ledger
 * transactions, `test/node/fixtures/mainnet-answers.json`).
 *
 * **The block's time** (`block-header`'s `timestampMs`, the blocks table's `block_time`, Q74): the one `Timestamp::set`
 * call's argument, a `Compact<u64>` of milliseconds. Every block but block 0 has exactly one (Substrate's timestamp
 * pallet fails a block without it); block 0, built from the chain's genesis, may have none, and is then given 0, as the
 * official indexer does (`timestamp.unwrap_or(0)`, `chain-indexer/src/infra/subxt_node.rs`). Anything else throws: a
 * block is decoded exactly or not at all. Pure: no Node.js import.
 */

import type { MetadataPallet, MetadataVariant, RuntimeMetadataView, TypeDef } from "./metadata.js";
import { ScaleReader } from "./scale.js";

/** An unsigned extrinsic's call, named with the metadata. */
export interface ExtrinsicCall {
  readonly pallet: string;
  readonly palletIndex: number;
  readonly call: string;
  readonly callIndex: number;
  /** The call's arguments, SCALE-encoded as the call's fields give them. */
  readonly args: Uint8Array;
}

/** One extrinsic of a block's body. */
export interface BodyExtrinsic {
  /** Its place in the body, from 0. */
  readonly index: number;
  /** The extrinsic as the node sent it, its length prefix included. */
  readonly bytes: Uint8Array;
  /** The extrinsic format's version: 4 or 5. */
  readonly version: 4 | 5;
  /** Signed (version 4) or general (version 5): its call follows a signature or extensions, and is not decoded here. */
  readonly signed: boolean;
  /** The call of an unsigned or bare extrinsic; null for a signed or general one. */
  readonly call: ExtrinsicCall | null;
}

/** The pallet whose calls hold the block time, and its call. */
const TIMESTAMP = Object.freeze({ pallet: "Timestamp", call: "set" });

/** The variants of `pallet`'s call enum (none when it has no calls). */
function callVariants(metadata: RuntimeMetadataView, pallet: MetadataPallet): readonly MetadataVariant[] {
  if (pallet.calls === null) return [];
  const def = (metadata.types.get(pallet.calls) as { readonly def: TypeDef }).def;
  if (def.kind !== "variant") {
    throw new Error(`the runtime metadata gives the pallet ${pallet.name} a call type that is no enum (${def.kind})`);
  }
  return def.variants;
}

/**
 * The call of the unsigned extrinsic whose call starts at `r` (block `height`, extrinsic `index`), named with
 * `metadata`: throws for a pallet index or a call index the metadata does not know.
 */
function callOf(metadata: RuntimeMetadataView, r: ScaleReader, height: bigint, index: number): ExtrinsicCall {
  const palletIndex = r.u8();
  const callIndex = r.u8();
  const where = `extrinsic ${index} of block ${height}`;
  const pallet = metadata.pallets.find((candidate) => candidate.index === palletIndex);
  if (pallet === undefined) {
    throw new Error(
      `${where} calls the pallet with index ${palletIndex}, which the runtime metadata of its parent's state does not ` +
        "have: the block cannot be decoded with that runtime (LG-4)",
    );
  }
  const variant = callVariants(metadata, pallet).find((candidate) => candidate.index === callIndex);
  if (variant === undefined) {
    throw new Error(
      `${where} calls ${pallet.name}'s call with index ${callIndex}, which the runtime metadata of its parent's state ` +
        "does not have: the block cannot be decoded with that runtime (LG-4)",
    );
  }
  return Object.freeze({ pallet: pallet.name, palletIndex, call: variant.name, callIndex, args: r.rest() });
}

/** Extrinsic `index` of block `height`, decoded with `metadata` (see the module comment). */
function decodeExtrinsic(metadata: RuntimeMetadataView, bytes: Uint8Array, height: bigint, index: number): BodyExtrinsic {
  const r = new ScaleReader(bytes, `extrinsic ${index} of block ${height}`);
  const length = r.count();
  if (length !== r.remaining) throw r.error(`its length prefix says ${length} bytes, and ${r.remaining} follow`);
  const format = r.u8();
  const kind =
    format === 0x04 || format === 0x05 ? "bare" : format === 0x84 || format === 0x45 ? "signed" : undefined;
  if (kind === undefined) {
    throw r.error(`the extrinsic format byte 0x${format.toString(16).padStart(2, "0")}, not 0x04, 0x84, 0x05 or 0x45`);
  }
  const version = (format & 0x0f) === 4 ? 4 : 5;
  const call = kind === "bare" ? callOf(metadata, r, height, index) : null;
  return Object.freeze({ index, bytes, version, signed: kind === "signed", call });
}

/** Block `height`'s `extrinsics`, each decoded with `metadata` (see the module comment). */
export function decodeExtrinsics(
  metadata: RuntimeMetadataView,
  extrinsics: readonly Uint8Array[],
  height: bigint,
): readonly BodyExtrinsic[] {
  return Object.freeze(extrinsics.map((bytes, index) => decodeExtrinsic(metadata, bytes, height, index)));
}

/** Whether the type `id` of `metadata` is `Compact<u64>`. */
function isCompactU64(metadata: RuntimeMetadataView, id: number): boolean {
  const def = metadata.types.get(id)?.def;
  if (def?.kind !== "compact") return false;
  const inner = metadata.types.get(def.type)?.def;
  return inner?.kind === "primitive" && inner.primitive === "u64";
}

/**
 * Block `height`'s own time in milliseconds, from the `Timestamp::set` call of its `body` (see the module comment):
 * 0 for a block 0 without one; throws for any other block without exactly one, or a call whose argument is not one
 * `Compact<u64>`.
 */
export function blockTimeOf(metadata: RuntimeMetadataView, body: readonly BodyExtrinsic[], height: bigint): bigint {
  const sets = body.filter((extrinsic) => extrinsic.call?.pallet === TIMESTAMP.pallet && extrinsic.call.call === TIMESTAMP.call);
  if (sets.length === 0 && height === 0n) return 0n;
  if (sets.length !== 1) {
    throw new Error(
      `block ${height} has ${sets.length === 0 ? "no" : sets.length} Timestamp::set calls, where every block but block 0 ` +
        "has exactly one: its time cannot be read (Q74)",
    );
  }
  const call = (sets[0] as BodyExtrinsic).call as ExtrinsicCall;
  const pallet = metadata.pallets.find((candidate) => candidate.index === call.palletIndex) as MetadataPallet;
  const { fields } = callVariants(metadata, pallet).find((variant) => variant.index === call.callIndex) as MetadataVariant;
  if (fields.length !== 1 || !isCompactU64(metadata, (fields[0] as { readonly type: number }).type)) {
    throw new Error(
      `the runtime metadata gives Timestamp::set of block ${height} the arguments ${fields.length} field(s), not one ` +
        "Compact<u64> of milliseconds",
    );
  }
  const r = new ScaleReader(call.args, `the Timestamp::set argument of block ${height}`);
  const now = r.compact();
  r.end();
  if (now > 0xffff_ffff_ffff_ffffn) throw new Error(`the Timestamp::set argument of block ${height} is above 2^64 - 1`);
  return now;
}
