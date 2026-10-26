/**
 * The block source (`openspec/changes/core-arch/specs/runner/spec.md` RN-14, `specs/ingest/spec.md`; `design.md` §3):
 * the runner's only view of the chain. Through it the runner learns the cursor, the finalized head and each finalized
 * block's height, hash and parent hash, and it processes heights only up to the finalized head it reports.
 *
 * The node-backed source is the backbone part `core-block-fetch` (CD-2, task 10.3); the in-memory one, for tests and
 * module authors, is `./in-memory-source.ts`. Both read the cursor from the cursor table of `core-block-commit`
 * (`src/backbone/core-block-commit/`, CD-3), through the read they are given.
 */

import type { ReadHandle } from "../db/api.js";

/** A block as the runner sees it: its height, hash and parent hash (`design.md` §3). */
export interface BlockRef {
  readonly height: bigint;
  readonly hash: Uint8Array;
  readonly parentHash: Uint8Array;
}

/** The runner's view of the chain (`design.md` §3, RN-14). */
export interface BlockSource {
  /** The last committed block, read through `read` (the cursor table's last row); null before block S commits. */
  cursor(read: Pick<ReadHandle, "query">): Promise<BlockRef | null>;
  /** The highest height the runner may process, as a block. */
  finalizedHead(): Promise<BlockRef>;
  /**
   * Resolves when the finalized head exceeds `above`, at once if it does already; rejects with `signal`'s reason when
   * `signal` aborts, also when it was aborted before the call.
   */
  waitForHead(above: bigint, signal: AbortSignal): Promise<void>;
  /** The finalized block at `height`, at most the finalized head. */
  block(height: bigint): Promise<BlockRef>;
}
