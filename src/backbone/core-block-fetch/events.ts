/**
 * A block's chain events as the node stores them: the `System::Events` storage value in the block's own state. They
 * are read with `state_getStorage` at the block's hash, where the runtime that executed the block left them.
 * `core-chain-events` decodes them with the metadata of the runtime in the parent block's state (`runtime-metadata`),
 * which is the runtime that executed the block. [CD-4, IN-8, LG-4]
 *
 * The block source gives the bytes ({@link BlockEventSource}). The node source reads them from the node; for a queued
 * best block it reads them without retries, like its other calls for such a block. The in-memory source gives none,
 * since its blocks have no events. [IN-10]
 *
 * The bytes are the SCALE encoding of `Vec<EventRecord<RuntimeEvent, Hash>>` (`frame_system`'s `Events`,
 * `EventRecord { phase, event, topics }`). They are `null` when the state holds no value under the key: at block 0,
 * whose genesis state no block executed (Substrate emits no events at genesis), and in any state where `Events` was
 * never written. Pure: no Node.js import.
 */

import type { BlockRef } from "../../runner/block-source.js";

/**
 * The storage key of `System::Events`, a new array at every call (a typed array cannot be frozen):
 * `twox128("System") ++ twox128("Events")` — FRAME's key of a plain storage value, the pallet's storage prefix then the
 * entry's name, each hashed with XXH64 twice (`Twox128`). The node's runtime holds the same key in its whitelist test
 * (`midnight-node` 2.1.0-rc.4 `runtime/src/lib.rs`, "System Events"), and the repository's mainnet answers hold the
 * prefix `twox128("System")` (`test/node/fixtures/mainnet-answers.json`).
 */
export function systemEventsKey(): Uint8Array {
  return Uint8Array.from([
    0x26, 0xaa, 0x39, 0x4e, 0xea, 0x56, 0x30, 0xe0, 0x7c, 0x48, 0xae, 0x0c, 0x95, 0x58, 0xce, 0xf7,
    0x80, 0xd4, 0x1e, 0x5e, 0x16, 0x05, 0x67, 0x65, 0xbc, 0x84, 0x61, 0x85, 0x10, 0x72, 0xc9, 0xd7,
  ]);
}

/** The storage prefix and the entry name {@link systemEventsKey} hashes: what the metadata must name. */
export const SYSTEM_EVENTS = Object.freeze({ prefix: "System", entry: "Events" } as const);

/** What `core-chain-events` reads a block's events from: its block source (bound by the runner). */
export interface BlockEventSource {
  /** The `System::Events` value of `block`'s own state, or null when there is none (see the module comment). */
  blockEvents(block: BlockRef): Promise<Uint8Array | null>;
}

/** Whether `source` gives `core-chain-events` a block's events (the node source, the in-memory source). */
export function isBlockEventSource(source: unknown): source is BlockEventSource {
  return typeof (source as Partial<BlockEventSource> | null)?.blockEvents === "function";
}
