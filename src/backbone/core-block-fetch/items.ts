/**
 * The `block` items `core-block-fetch` publishes for every block (`openspec/changes/core-arch/specs/chain-data/spec.md`
 * CD-2; CORE-ARCH §4.11; task 10.3), and how a source gives them ({@link BlockItemSource}): the node source from the
 * node (`./node-source.ts`), the in-memory source (`src/runner/in-memory-source.ts`) from its own blocks, for tests and
 * module authors.
 *
 * - `block-header` ({@link CoreBlockHeader}): the block's height, hash and parent hash, its state and extrinsics roots,
 *   its digest items as the node sent them, the `spec_version` of its `MNSV` digest (LG-1) and its own time in
 *   milliseconds (the `Timestamp::set` call, `./extrinsics.ts`) — what `core-block-commit` reads of it
 *   (`BlockHeaderItem`: `specVersion`, `timestampMs`) among them.
 * - `block-body` ({@link BlockBody}): the extrinsics as fetched, in body order, each decoded with the metadata of the
 *   runtime in the block's parent's state — its version, and an unsigned extrinsic's call by name (LG-4).
 * - `runtime-metadata`: that runtime's `spec_version` and metadata, as `state_getMetadata` gave them
 *   (`RuntimeMetadataEntry`, `src/ledger/metadata.ts`: read at the parent's hash; block 0's at its own).
 * - `ledger-version`: the ledger the block's runtime maps to in the `ledger-table` item (LG-1, `selectLedgerVersion`),
 *   as text — `v8`, `v9` —, which `core-block-commit` stores.
 *
 * Pure types and one constant: no Node.js import.
 */

import type { BlockHeaderItem } from "../core-block-commit/core-block-commit.js";
import type { RuntimeMetadataEntry } from "../../ledger/metadata.js";
import type { LedgerTable } from "../../ledger/version-table.js";
import type { BlockRef } from "../../runner/block-source.js";
import type { BodyExtrinsic } from "./extrinsics.js";

/** The items' names, in the order `core-block-fetch` puts them. */
export const CORE_BLOCK_ITEMS = Object.freeze(["block-header", "block-body", "runtime-metadata", "ledger-version"] as const);

/** The `block-header` item (see the module comment). */
export interface CoreBlockHeader extends BlockHeaderItem {
  readonly height: bigint;
  readonly hash: Uint8Array;
  readonly parentHash: Uint8Array;
  readonly stateRoot: Uint8Array;
  readonly extrinsicsRoot: Uint8Array;
  /** The digest items, each as the node sent it (SCALE-encoded); the `MNSV` item among them. */
  readonly digest: readonly Uint8Array[];
}

/** The `block-body` item (see the module comment). */
export interface BlockBody {
  /** The `spec_version` of the runtime whose metadata decoded the extrinsics: the parent's state's (LG-4). */
  readonly specVersion: number;
  readonly extrinsics: readonly BodyExtrinsic[];
}

/** The four items of one block, by name. */
export interface CoreBlockItems {
  readonly "block-header": CoreBlockHeader;
  readonly "block-body": BlockBody;
  readonly "runtime-metadata": RuntimeMetadataEntry;
  readonly "ledger-version": string;
}

/**
 * What `core-block-fetch` reads a block's items from: its block source (bound to its process context by the runner).
 * `table` is the `ledger-table` item (LG-1), when published.
 */
export interface BlockItemSource {
  blockItems(block: BlockRef, table: LedgerTable | undefined): Promise<CoreBlockItems>;
}
