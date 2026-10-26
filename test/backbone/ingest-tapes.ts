import type { TapeRecord } from "../../tools/tape/index.js";
import {
  blockRef,
  type ChainBlock,
  chainOf,
  finalized,
  finalizedHead,
  headRead,
  hex,
  MAINNET_PALLETS,
  metadataOf,
  opening,
  RUNTIME,
  type Runtime,
  subscriptions,
} from "./fetch-fixtures.js";
import type { Decoded } from "./ingest-checks.js";

/**
 * The tapes task 10.3's criteria and their negative controls share (`ingest.test.ts`, `ingest.negative-control.test.ts`):
 * synthetic, in the node's answer shapes (`./fetch-fixtures.ts`).
 */

/**
 * A79's tape over `chain` (blocks 0–20): heads 10 (read and notified), 13, 13, 12; a disconnect; the head read again
 * after the reconnect (16 — 14 to 16 finalized meanwhile, their notifications lost), then 20. The notification of 20
 * goes out only once 14–16 were asked, so a source that does not read the head again never gets it.
 */
export function a79Tape(chain: readonly ChainBlock[]): TapeRecord[] {
  const at = (height: number): ChainBlock => chain[height] as ChainBlock;
  const heights = (from: number, to: number): number[] => Array.from({ length: to - from + 1 }, (_, i) => from + i);
  return [
    ...blockRef(at(0)),
    ...subscriptions(),
    ...headRead(at(10)),
    finalizedHead(at(10)),
    finalizedHead(at(13)),
    ...finalized(at(11), RUNTIME, true),
    ...finalized(at(12)),
    ...finalized(at(13)),
    finalizedHead(at(13)),
    finalizedHead(at(12)),
    { disconnect: true },
    // The client connects again and makes both subscriptions again; the source reads the head again.
    ...subscriptions(),
    ...headRead(at(16)),
    ...heights(14, 16).flatMap((h) => finalized(at(h))),
    finalizedHead(at(20)),
    ...heights(17, 20).flatMap((h) => finalized(at(h))),
  ];
}

/**
 * A89's synthetic devnet upgrade: runtime 1_000_000 (v8 on preprod) builds blocks 1 to U = 3, whose `set_code` puts
 * 2_000_000 (v9) in U's own state; F = 4 is the first block it builds. The new runtime moved the timestamp pallet from
 * index 1 to 2 and put `Preimage` at 1, so U's `Timestamp::set` (pallet 1) reads as the timestamp only with the old
 * metadata. The tape answers the parent's-state reads the source makes, and the own-state reads a wrong source would
 * make, so that a control fails exactly at U.
 */
export function upgradeTape(): { records: TapeRecord[]; upgrade: ChainBlock[]; expected: Decoded[] } {
  const OLD: Runtime = { specVersion: 1_000_000, metadata: metadataOf(MAINNET_PALLETS) };
  const NEW: Runtime = {
    specVersion: 2_000_000,
    metadata: metadataOf([
      { name: "System", index: 0, calls: [{ name: "remark", index: 0, args: ["bytes"] }] },
      { name: "Preimage", index: 1, calls: [{ name: "note_preimage", index: 0, args: ["bytes"] }] },
      { name: "Timestamp", index: 2, calls: [{ name: "set", index: 0, args: ["compact-u64"] }] },
      { name: "Midnight", index: 5, calls: [{ name: "send_mn_transaction", index: 0, args: ["bytes"] }] },
    ]),
  };
  const upgrade = chainOf(5n, (h) => (h <= 3n ? { specVersion: OLD.specVersion, timestampPallet: 1 } : { specVersion: NEW.specVersion, timestampPallet: 2 }));
  const block = (h: number) => upgrade[h] as ChainBlock;
  const stateAfter = (h: number): Runtime => (h < 3 ? OLD : NEW);
  const records: TapeRecord[] = [
    ...opening(block(0), block(5)),
    ...finalized(block(1), stateAfter(0), true),
    ...finalized(block(2), stateAfter(1)),
    ...finalized(block(3), stateAfter(2)),
    ...finalized(block(4), stateAfter(3), true),
    ...finalized(block(5), stateAfter(4)),
    // What a source decoding with a block's own state would also read: block 1's metadata there, block 5's runtime.
    { method: "state_getMetadata", params: [block(1).hex], result: hex(OLD.metadata) },
    { method: "state_getRuntimeVersion", params: [block(5).hex], result: { specName: "midnight", specVersion: NEW.specVersion, implVersion: 0, transactionVersion: 2 } },
  ];
  const expected: Decoded[] = [1, 2, 3, 4, 5].map((h) => ({
    height: BigInt(h),
    specVersion: h <= 3 ? OLD.specVersion : NEW.specVersion,
    calls: ["Timestamp.set"],
  }));
  return { records, upgrade, expected };
}
