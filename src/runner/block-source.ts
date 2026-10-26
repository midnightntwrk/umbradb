/**
 * The block source (`openspec/changes/core-arch/specs/runner/spec.md` RN-14, `specs/ingest/spec.md`; `design.md` §3):
 * the runner's only view of the chain. Through it the runner learns the cursor, the finalized head and each finalized
 * block's height, hash and parent hash, and it processes heights only up to the finalized head it reports.
 *
 * The node-backed source is the backbone part `core-block-fetch` (CD-2, task 10.3); the in-memory one, for tests and
 * module authors, is `./in-memory-source.ts`. Both read the cursor from the cursor table of `core-block-commit`
 * (`src/backbone/core-block-commit/`, CD-3), through the read they are given. A private process's source is
 * `core-private-source`'s (`src/backbone/core-private-source/`, PP-3): its blocks are the public database's, its
 * cursor that part's own table.
 */

import type { ChainCheck, ChainCheckInput } from "../backbone/core-chain/core-chain.js";
import type { CommittedHeight, ReadHandle } from "../db/api.js";

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
  /**
   * A private process's source only (`core-private-source`, PP-3; decision record Q100): runs `body` with a read of the
   * public data its blocks come from, one per `on-fetch` callback, at the public database's committed height. The
   * core's sources have none: their `on-fetch` gets no handle (RN-4).
   */
  readonly fetchRead?: <T>(body: (read: ReadHandle) => Promise<T>) => Promise<T>;
  /**
   * A private process's source only: how a read of the process's database learns its committed height (DB-2) — the
   * private cursor's height. Absent for the core's sources, whose cursor is the cursor table's (`cursorHeight`).
   */
  readonly committedHeight?: CommittedHeight;
  /**
   * A source whose chain is not a node's checks it its own way at startup, in place of `core-chain`'s checks against the
   * node (IN-3, `checkChain`): a private process's (`core-private-source`, PP-1, PP-2), which never talks to the node.
   * Given what `checkChain` is given; resolves with the chain's genesis hash, which `core-chain` records.
   */
  checkChain?(input: ChainCheckInput): Promise<ChainCheck>;
  /** Closes what the source opened (a private process's public database); the process calls it once it has stopped. */
  close?(): Promise<void>;
}
