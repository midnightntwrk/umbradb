/**
 * Which Midnight transactions a block holds, and in what order the ledger applied them, found before any is parsed:
 * from the block's body (`block-body`) and its chain events (`chain-events`). [CD-5, CD-2, CD-4]
 *
 * **The pinned node** (`midnight-node` 2.1.0-rc.4):
 * - A regular transaction is the argument `midnight_tx: Vec<u8>` of an unsigned extrinsic calling
 *   `Midnight::send_mn_transaction` (`pallets/midnight/src/lib.rs`, call index 0, validated by `ValidateUnsigned`). A
 *   signed or general extrinsic may carry governance calls only (`runtime/src/check_call_filter.rs`,
 *   `CheckCallFilter`).
 * - Its dispatch deposits `Midnight::TxApplied(TxAppliedDetails { tx_hash })` when the ledger applied every segment,
 *   and `Midnight::TxPartialSuccess` when not. A dispatch that fails leaves none of its events (every call is
 *   transactional); `frame_system` then records `System::ExtrinsicFailed { dispatch_error, dispatch_info }` under the
 *   same phase, `ApplyExtrinsic(i)`.
 * - A system transaction is never in the body after block 0. The runtime builds it (a cNight observation inherent, the
 *   bridge, or a governance motion dispatching `MidnightSystem::send_mn_system_transaction` as Root) and applies it
 *   with `MidnightSystem::SystemTransactionApplied(SystemTransactionApplied { hash, serialized_system_transaction })`
 *   (`pallets/midnight-system/src/lib.rs`, `apply_and_emit`). That event is the only place its bytes are. (The pallet
 *   `CNightObservation` has an event of the same name carrying only a hash; it is not a transaction.)
 *
 * **The order** is the order of the transactions' chain events, as the official indexer reads it (`midnight-indexer`
 * `chain-indexer/src/infra/subxt_node/runtimes.rs`, `transactions`). Each event is matched to its extrinsic by its
 * phase, never by its place among the events: [CD-5]
 * - `MidnightSystem::SystemTransactionApplied` is a system transaction, with the event's phase as the chain stamped it;
 * - `Midnight::TxApplied`, `Midnight::TxPartialSuccess` or `System::ExtrinsicFailed` under `ApplyExtrinsic(i)` is the
 *   regular transaction of extrinsic `i`, if `i` carries one. An `ExtrinsicFailed` of any other extrinsic belongs to no
 *   transaction (it is a failed inherent or governance call), and neither does a top-level `MidnightSystem` extrinsic
 *   (Root only, so in an executed block it failed);
 * - **Block 0** has no events (Substrate emits none at genesis). Every `Midnight` and `MidnightSystem` extrinsic of its
 *   body is a transaction, regular or system, in body order, under `ApplyExtrinsic(i)`, as in the official indexer's
 *   `genesis_transactions`. [IN-7]
 *
 * **Anything else refuses the block** (it throws), where the official indexer logs a divergence and goes on:
 * - a regular transaction with no outcome event, or with two;
 * - `TxApplied` or `TxPartialSuccess` under a phase whose extrinsic carries no regular transaction, or carries one this
 *   decoder cannot see (a signed or general extrinsic, whose call is not decoded,
 *   `src/backbone/core-block-fetch/extrinsics.ts`);
 * - a call or event whose fields are not the bytes these rules read.
 *
 * A block is placed exactly or not at all. The module is pure: it has no Node.js import. [Q132]
 */

import type { BlockBody } from "../core-block-fetch/items.js";
import type { MetadataVariant, RuntimeMetadataView } from "../core-block-fetch/metadata.js";
import { ScaleReader } from "../core-block-fetch/scale.js";
import type { ChainEvent, EventPhase } from "../core-chain-events/events.js";
import { type ScaleValue, ValueReader } from "../core-chain-events/scale-value.js";

/** The pallets, calls and events the rules read, by name. */
export const MIDNIGHT = Object.freeze({
  pallet: "Midnight",
  call: "send_mn_transaction",
  applied: "TxApplied",
  partial: "TxPartialSuccess",
} as const);
export const MIDNIGHT_SYSTEM = Object.freeze({
  pallet: "MidnightSystem",
  call: "send_mn_system_transaction",
  applied: "SystemTransactionApplied",
  bytes: "serialized_system_transaction",
} as const);
export const SYSTEM = Object.freeze({ pallet: "System", failed: "ExtrinsicFailed" } as const);

/** A transaction of a block, placed (see the module comment); not yet parsed. */
export interface ChainTransaction {
  /** Its place in the order the ledger applied the block's transactions, from 0. [CD-5] */
  readonly index: number;
  readonly kind: "regular" | "system";
  /** The transaction as the chain carries it: the ledger's tagged serialization. */
  readonly bytes: Uint8Array;
  /** The phase its event was recorded under (block 0: `ApplyExtrinsic` of its extrinsic). */
  readonly phase: EventPhase;
  /** Under `apply-extrinsic`, the extrinsic's index: a regular transaction's own extrinsic. */
  readonly extrinsicIndex: number | null;
  /** The event that applied or failed it (an index into `chain-events`); null at block 0. */
  readonly eventIndex: number | null;
}

/** A refusal of block `height` (see the module comment). */
function refuse(height: bigint, why: string): Error {
  return new Error(`block ${height}: ${why}, so its transactions cannot be placed`);
}

/** Whether `event` is `pallet`'s event `name`. */
const is = (event: ChainEvent, pallet: string, name: string): boolean => event.pallet === pallet && event.name === name;

/** The one field of `variant`'s value, read from `args`, as bytes; throws for any other shape. */
function bytesArgument(metadata: RuntimeMetadataView, variant: MetadataVariant, args: Uint8Array, what: string): Uint8Array {
  const [field, ...more] = variant.fields;
  if (field === undefined || more.length > 0) throw new Error(`${what} has ${variant.fields.length} arguments, not one Vec<u8>`);
  const r = new ScaleReader(args, what);
  const bytes = new ValueReader(metadata.types).value(r, field.type);
  r.end();
  if (!(bytes instanceof Uint8Array)) throw new Error(`${what}'s argument is not a Vec<u8>`);
  return bytes;
}

/** The call variant `extrinsic` calls, from `metadata` (the extrinsic was named with it by `core-block-fetch`). */
function callVariant(metadata: RuntimeMetadataView, palletIndex: number, callIndex: number): MetadataVariant {
  const pallet = metadata.pallets.find((candidate) => candidate.index === palletIndex);
  const def = pallet?.calls === null || pallet === undefined ? undefined : metadata.types.get(pallet.calls)?.def;
  const variant = def?.kind === "variant" ? def.variants.find((candidate) => candidate.index === callIndex) : undefined;
  if (variant === undefined) throw new Error(`the runtime metadata has no call ${callIndex} of the pallet ${palletIndex}`);
  return variant;
}

/** The transactions the body's extrinsics carry, by extrinsic index: `Midnight`'s, and `MidnightSystem`'s too. */
function carried(
  height: bigint,
  body: BlockBody,
  metadata: () => RuntimeMetadataView,
): Map<number, { readonly kind: "regular" | "system"; readonly bytes: Uint8Array }> {
  const transactions = new Map<number, { readonly kind: "regular" | "system"; readonly bytes: Uint8Array }>();
  for (const extrinsic of body.extrinsics) {
    const call = extrinsic.call;
    if (call === null) continue;
    const kind =
      call.pallet === MIDNIGHT.pallet && call.call === MIDNIGHT.call
        ? "regular"
        : call.pallet === MIDNIGHT_SYSTEM.pallet && call.call === MIDNIGHT_SYSTEM.call
          ? "system"
          : undefined;
    if (kind === undefined) continue;
    const view = metadata();
    const what = `the ${call.pallet}::${call.call} call of extrinsic ${extrinsic.index} of block ${height}`;
    const bytes = bytesArgument(view, callVariant(view, call.palletIndex, call.callIndex), call.args, what);
    transactions.set(extrinsic.index, Object.freeze({ kind, bytes }));
  }
  return transactions;
}

/** A system transaction's bytes from its `SystemTransactionApplied` event. */
function systemBytes(height: bigint, event: ChainEvent): Uint8Array {
  const fields = event.fields as { readonly [name: string]: ScaleValue };
  const bytes = typeof fields === "object" && fields !== null ? fields[MIDNIGHT_SYSTEM.bytes] : undefined;
  if (!(bytes instanceof Uint8Array)) {
    throw refuse(height, `event ${event.index}, ${MIDNIGHT_SYSTEM.pallet}::${MIDNIGHT_SYSTEM.applied}, has no ${MIDNIGHT_SYSTEM.bytes} bytes`);
  }
  return bytes;
}

/**
 * Block `height`'s transactions, placed in the order the ledger applied them (see the module comment): `body` is its
 * `block-body`, `events` its `chain-events`, `metadata` the runtime metadata its body was named with (read only when an
 * extrinsic carries a transaction).
 */
export function placeTransactions(
  height: bigint,
  body: BlockBody,
  events: readonly ChainEvent[],
  metadata: () => RuntimeMetadataView,
): readonly ChainTransaction[] {
  const carriedBy = carried(height, body, metadata);
  const placed: ChainTransaction[] = [];
  const push = (transaction: Omit<ChainTransaction, "index">): void => {
    placed.push(Object.freeze({ index: placed.length, ...transaction }));
  };
  if (height === 0n) {
    for (const [extrinsicIndex, { kind, bytes }] of [...carriedBy].sort(([a], [b]) => a - b)) {
      push({ kind, bytes, phase: "apply-extrinsic", extrinsicIndex, eventIndex: null });
    }
    return Object.freeze(placed);
  }
  const regular = new Map([...carriedBy].filter(([, transaction]) => transaction.kind === "regular"));
  const signed = new Set(body.extrinsics.filter((extrinsic) => extrinsic.call === null).map((extrinsic) => extrinsic.index));
  const taken = new Set<number>();
  for (const event of events) {
    if (is(event, MIDNIGHT_SYSTEM.pallet, MIDNIGHT_SYSTEM.applied)) {
      push({ kind: "system", bytes: systemBytes(height, event), phase: event.phase, extrinsicIndex: event.extrinsicIndex, eventIndex: event.index });
      continue;
    }
    const applied = is(event, MIDNIGHT.pallet, MIDNIGHT.applied) || is(event, MIDNIGHT.pallet, MIDNIGHT.partial);
    if (!applied && !is(event, SYSTEM.pallet, SYSTEM.failed)) continue;
    const i = event.extrinsicIndex;
    const own = i === null ? undefined : regular.get(i);
    if (i !== null && taken.has(i)) {
      throw refuse(height, `event ${event.index}, ${event.pallet}::${event.name}, is a second outcome of extrinsic ${i}'s transaction`);
    }
    if (own === undefined) {
      if (!applied) continue;
      const where =
        i === null
          ? `under ${event.phase}`
          : signed.has(i)
            ? `under extrinsic ${i}, which is signed (its call is not decoded; only governance calls may be signed)`
            : `under extrinsic ${i}, which carries no Midnight transaction`;
      throw refuse(height, `event ${event.index}, ${event.pallet}::${event.name}, is ${where}`);
    }
    taken.add(i as number);
    push({ kind: "regular", bytes: own.bytes, phase: event.phase, extrinsicIndex: i, eventIndex: event.index });
  }
  const missing = [...regular.keys()].filter((index) => !taken.has(index)).sort((a, b) => a - b);
  if (missing.length > 0) {
    throw refuse(height, `the Midnight transaction of extrinsic ${missing.join(", ")} has no TxApplied, TxPartialSuccess or ExtrinsicFailed event`);
  }
  return Object.freeze(placed);
}
