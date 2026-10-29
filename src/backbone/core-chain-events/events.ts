/**
 * A block's chain events, decoded. The `System::Events` value of the block's own state
 * (`src/backbone/core-block-fetch/events.ts`) is read with the runtime metadata of the parent block's state, which is
 * the runtime that executed the block. Each event comes with its place in the block, its phase, its pallet and name,
 * its fields, its topics and its bytes. [CD-4, LG-4]
 *
 * **The encoding** (pinned against the node's sources, `midnight-node` 2.1.0-rc.4 at `1b2b31c`, whose `polkadot-sdk` is
 * `shieldedtech/polkadot-sdk` `stable2606` at `6b0ce48`): `frame_system`'s storage value `Events` is
 * `Vec<Box<EventRecord<RuntimeEvent, Hash>>>` (`substrate/frame/system/src/lib.rs`, `pub(super) type Events`; a `Box`
 * encodes as its content), `EventRecord { phase: Phase, event: RuntimeEvent, topics: Vec<Hash> }`, and `Phase` the enum
 * `ApplyExtrinsic(u32)`, `Finalization`, `Initialization`. `RuntimeEvent` is the runtime's enum of every pallet's event
 * enum, its variant index the pallet's index (`construct_runtime`, `runtime/src/lib.rs`'s `pallet_index`), its variant
 * name the pallet's name. The types come from the metadata, never from these names' positions: the value type of the
 * storage entry `Events` of the pallet whose storage prefix is `System`, which must be a sequence of a composite with
 * the fields `phase` (a variant of `ApplyExtrinsic` with one `u32`, `Finalization` and `Initialization`), `event` (a
 * variant each of whose variants has one field, a pallet's event enum) and `topics` (a sequence) — anything else is
 * refused. The official indexer reads the same bytes the same way: fetched at the block, decoded with the parent's
 * runtime, also at an upgrade's enactment block (`midnight-indexer` `chain-indexer/src/infra/subxt_node/runtimes.rs`,
 * `make_block_details`).
 *
 * **An event** ({@link ChainEvent}): its index in the block (from 0, the order of `Events`), its phase and, under
 * `ApplyExtrinsic(i)`, the extrinsic index `i`, the pallet's name and index, the event's name and index within its
 * pallet's enum, its fields read with the registry (`./scale-value.ts`), its topics, and its bytes: the record's own
 * SCALE bytes — phase, event and topics as `Events` holds them —, so the compact count followed by every event's bytes
 * is the storage value again, and a reader with the metadata can decode what this one does not.
 *
 * A block's events are decoded exactly or not at all: bytes that end before an event does, or go on after the last, a
 * pallet or event index the metadata does not have, and a field that cannot be read, throw. Pure: no Node.js import.
 */

import { SYSTEM_EVENTS } from "../core-block-fetch/events.js";
import type { MetadataType, MetadataVariant, RuntimeMetadataView, TypeDef } from "../core-block-fetch/metadata.js";
import { ScaleReader } from "../core-block-fetch/scale.js";
import { type ScaleValue, ValueReader } from "./scale-value.js";

/** An event's phase: before the extrinsics, applying extrinsic `extrinsicIndex`, after them. */
export type EventPhase = "initialization" | "apply-extrinsic" | "finalization";

/** One chain event of a block (see the module comment). */
export interface ChainEvent {
  /** Its place in the block's events, from 0. */
  readonly index: number;
  readonly phase: EventPhase;
  /** Under `ApplyExtrinsic(i)`, `i`; null otherwise. */
  readonly extrinsicIndex: number | null;
  /** The pallet's name, as `RuntimeEvent` names it. */
  readonly pallet: string;
  readonly palletIndex: number;
  /** The event's name within its pallet's event enum. */
  readonly name: string;
  readonly eventIndex: number;
  /** The event's fields (`./scale-value.ts`'s value of the variant's fields). */
  readonly fields: ScaleValue;
  readonly topics: readonly Uint8Array[];
  /** The record's SCALE bytes: phase, event, topics. */
  readonly bytes: Uint8Array;
}

/** The types of an event record, found in the metadata. */
interface RecordTypes {
  /** Phase variants by index: their phase, and whether they carry the extrinsic index. */
  readonly phases: ReadonlyMap<number, EventPhase>;
  /** `RuntimeEvent`'s variants by index (pallets). */
  readonly pallets: ReadonlyMap<number, MetadataVariant>;
  /** The topics' type. */
  readonly topics: number;
}

/** What the metadata says of `Events` that this decoder cannot read: refused with the reason. */
function refused(height: bigint, why: string): Error {
  return new Error(
    `the runtime metadata block ${height}'s events are decoded with ${why}, so its System::Events cannot be read`,
  );
}

function namedField(def: TypeDef, name: string): number | undefined {
  return def.kind === "composite" ? def.fields.find((field) => field.name === name)?.type : undefined;
}

/** The record types of `metadata` (see the module comment); throws for metadata whose `Events` it cannot read. */
function recordTypes(metadata: RuntimeMetadataView, height: bigint): RecordTypes {
  const pallet = metadata.pallets.find((candidate) => candidate.storage?.prefix === SYSTEM_EVENTS.prefix);
  const entry = pallet?.storage?.entries.find((candidate) => candidate.name === SYSTEM_EVENTS.entry);
  if (entry === undefined) throw refused(height, `no storage entry ${SYSTEM_EVENTS.prefix}::${SYSTEM_EVENTS.entry}`);
  if (entry.kind !== "plain") throw refused(height, `${SYSTEM_EVENTS.prefix}::${SYSTEM_EVENTS.entry} a map`);
  const get = (id: number): MetadataType => metadata.types.get(id) as MetadataType;
  const value = get(entry.value).def;
  if (value.kind !== "sequence") throw refused(height, `System::Events a ${value.kind}, not a sequence of event records`);
  const record = get(value.type)?.def;
  const phase = record === undefined ? undefined : namedField(record, "phase");
  const event = record === undefined ? undefined : namedField(record, "event");
  const topics = record === undefined ? undefined : namedField(record, "topics");
  if (record?.kind !== "composite" || record.fields.length !== 3 || phase === undefined || event === undefined || topics === undefined) {
    throw refused(height, "an event record that is not the composite { phase, event, topics }");
  }
  const phaseDef = get(phase)?.def;
  const phases = new Map<number, EventPhase>();
  for (const variant of phaseDef?.kind === "variant" ? phaseDef.variants : []) {
    const u32 = variant.fields.length === 1 ? get((variant.fields[0] as { readonly type: number }).type)?.def : undefined;
    if (variant.name === "ApplyExtrinsic" && u32?.kind === "primitive" && u32.primitive === "u32") {
      phases.set(variant.index, "apply-extrinsic");
    } else if (variant.name === "Finalization" && variant.fields.length === 0) {
      phases.set(variant.index, "finalization");
    } else if (variant.name === "Initialization" && variant.fields.length === 0) {
      phases.set(variant.index, "initialization");
    } else {
      throw refused(height, `a phase variant ${variant.name}, not ApplyExtrinsic(u32), Finalization or Initialization`);
    }
  }
  if (phases.size !== 3) throw refused(height, "a phase that is not ApplyExtrinsic(u32), Finalization and Initialization");
  const eventDef = get(event)?.def;
  if (eventDef?.kind !== "variant" || eventDef.variants.some((variant) => variant.fields.length !== 1)) {
    throw refused(height, "a RuntimeEvent that is not an enum of one pallet event each");
  }
  const topicsDef = get(topics)?.def;
  if (topicsDef?.kind !== "sequence") throw refused(height, "topics that are not a sequence");
  return { phases, pallets: new Map(eventDef.variants.map((variant) => [variant.index, variant])), topics };
}

/**
 * Block `height`'s chain events: `bytes` (its `System::Events` value; null for none) decoded with `metadata` (the
 * runtime in its parent's state), see the module comment.
 */
export function decodeChainEvents(metadata: RuntimeMetadataView, bytes: Uint8Array | null, height: bigint): readonly ChainEvent[] {
  if (bytes === null) return Object.freeze([]);
  const types = recordTypes(metadata, height);
  const values = new ValueReader(metadata.types);
  const r = new ScaleReader(bytes, `the events of block ${height}`);
  const count = r.count();
  const events: ChainEvent[] = [];
  for (let index = 0; index < count; index++) {
    const start = r.offset;
    const phaseIndex = r.u8();
    const phase = types.phases.get(phaseIndex);
    if (phase === undefined) {
      throw r.errorAt(start, `event ${index} has the phase index ${phaseIndex}, which the metadata does not have`);
    }
    const extrinsicIndex = phase === "apply-extrinsic" ? r.u32() : null;
    const palletAt = r.offset;
    const palletIndex = r.u8();
    const pallet = types.pallets.get(palletIndex);
    if (pallet === undefined) {
      throw r.errorAt(palletAt, `event ${index} is of the pallet index ${palletIndex}, which the metadata's RuntimeEvent does not have`);
    }
    const eventType = (pallet.fields[0] as { readonly type: number }).type;
    const eventDef = values.def(eventType, r);
    if (eventDef.kind !== "variant") throw r.errorAt(palletAt, `the pallet ${pallet.name}'s event type is no enum`);
    const variantAt = r.offset;
    const eventIndex = r.u8();
    const variant = eventDef.variants.find((candidate) => candidate.index === eventIndex);
    if (variant === undefined) {
      throw r.errorAt(variantAt, `event ${index} is ${pallet.name}'s event index ${eventIndex}, which the metadata does not have`);
    }
    const fields = values.fields(r, variant.fields);
    const topicsAt = r.offset;
    const topics = values.value(r, types.topics);
    if (!Array.isArray(topics) || !topics.every((topic) => topic instanceof Uint8Array)) {
      throw r.errorAt(topicsAt, `event ${index}'s topics are not hashes (byte strings)`);
    }
    events.push(
      Object.freeze({
        index,
        phase,
        extrinsicIndex,
        pallet: pallet.name,
        palletIndex,
        name: variant.name,
        eventIndex,
        fields,
        topics: topics as readonly Uint8Array[],
        bytes: bytes.slice(start, r.offset),
      }),
    );
  }
  r.end();
  return Object.freeze(events);
}
