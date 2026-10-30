/**
 * The block source: the runner's only view of the chain. Through it the runner learns the cursor, the finalized head
 * and each finalized block's height, hash and parent hash. It processes heights only up to the finalized head the
 * source reports. [RN-1, RN-14, IN-4, IN-5, IN-6; design §3]
 *
 * The node-backed source is the backbone part `core-block-fetch` (`src/backbone/core-block-fetch/`); the in-memory one,
 * for tests and module authors, is `./in-memory-source.ts`. Both read the cursor from the cursor table of
 * `core-block-commit` (`src/backbone/core-block-commit/`), through the read they are given. A private process's source
 * is `core-private-source`'s (`src/backbone/core-private-source/`): its blocks are the public database's, and its
 * cursor is that part's own table. [CD-2, CD-3, PP-3]
 *
 * **A source that fetches ahead.** The node source prefetches finalized blocks and keeps a queue of best blocks. While
 * the loop runs, it is given the runner's dispatch interface for its queue ({@link QueueRunner},
 * {@link BlockSource.attach}). It hands the loop each finalized height already prepared ({@link BlockSource.prepared}):
 * its `on-fetch` and `on-parse` have run and their items are published, so the loop goes on to `on-start-height` and
 * `on-compute` with them. A queued block with the finalized hash goes on to `on-compute` with its parsed data.
 * [IN-4, IN-5, IN-6]
 *
 * The runner exposes `on-best-block` and `on-rollback` only through that interface, and never calls them itself. A
 * source without `prepared` (the in-memory one, a private process's) leaves `on-fetch` and `on-parse` to the loop.
 * [RN-1]
 */

import type { ChainCheck, ChainCheckInput } from "../backbone/core-chain/core-chain.js";
import type { CommittedHeight, ReadHandle } from "../db/api.js";
import type { ModuleDeclaration } from "../modules/declaration.js";
import type { BlockItems } from "./block-context.js";

/** A block as the runner sees it: its height, hash and parent hash. [design §3] */
export interface BlockRef {
  readonly height: bigint;
  readonly hash: Uint8Array;
  readonly parentHash: Uint8Array;
}

/** The runner's view of the chain. [RN-14; design §3] */
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
   * A private process's source only (`core-private-source`): runs `body` with a read of the public data its blocks
   * come from, one per `on-fetch` callback of the block at `height`. The read is at the public database's committed
   * height; on a lockstep instance that is exactly `height`, checked again after `body`. [PP-3, PP-6, Q100, Q142]
   *
   * The core's sources have none: their `on-fetch` gets no handle. [RN-4]
   */
  readonly fetchRead?: <T>(body: (read: ReadHandle) => Promise<T>, height: bigint) => Promise<T>;
  /**
   * A private process's source only: how a read of the process's database learns its committed height, which is the
   * private cursor's height. Absent for the core's sources, whose cursor is the cursor table's (`cursorHeight`). [DB-2]
   */
  readonly committedHeight?: CommittedHeight;
  /**
   * A source whose chain is not a node's checks it its own way at startup, in place of `core-chain`'s checks against the
   * node (`checkChain`). This is a private process's source (`core-private-source`), which never talks to the node. It
   * is given what `checkChain` is given, and resolves with the chain's genesis hash, which `core-chain` records.
   * [IN-3, PP-1, PP-2]
   */
  checkChain?(input: ChainCheckInput): Promise<ChainCheck>;
  /**
   * A source that cannot run some modules refuses them at startup, given the resolved graph's modules after the chain
   * check and before any migration. A private process's source that is not lockstep refuses a module declaring
   * `needsLockstep` (`needs-lockstep-not-listed`). [PP-6]
   */
  checkModules?(modules: readonly ModuleDeclaration[]): void;
  /**
   * Optional (a source that fetches ahead): the loop gives the source its `QueueRunner` as each of its runs starts.
   * The source may run the queue-side points through it until the returned function is called, which the loop does when
   * the run ends: stopped, halted, or before a retry runs it again.
   */
  attach?(runner: QueueRunner): () => void;
  /**
   * Optional, with {@link attach}: the finalized block at `height` (the loop's next height, the cursor + 1), prepared:
   * its `on-fetch` and `on-parse` have run through the runner and their items are published. Rejects with the height's
   * failure: a node's, or a callback's (`CallbackFailure`), which halts at that height. [RN-8]
   */
  prepared?(height: bigint): Promise<PreparedBlock>;
  /** Optional: the source's conditions now, such as `finality-stall` while its queue is full. [AE-3, IN-6] */
  conditions?(): readonly SourceCondition[];
  /**
   * Optional (a source over the node): what `/status` shows of the node besides the finalized head, namely the best
   * head it announced last and the best-block queue's length. The connection's state is the node client's. [AE-5]
   */
  nodeView?(): SourceNodeView;
  /**
   * Optional: closes what the source opened and ends its own work (a private process's public database, the node
   * source's subscriptions and queue). The process calls it once it has stopped.
   */
  close?(): Promise<void>;
}

/** A finalized block prepared ahead: the block and its `block` items, `on-fetch`'s and `on-parse`'s published. */
export interface PreparedBlock {
  readonly block: BlockRef;
  readonly items: BlockItems;
}

/**
 * The runner's dispatch interface for a source's queue, given by the finalized loop (`./loop.ts`). Each point runs
 * through the point dispatch, in the order of the range holding the block's height, with each module's process context.
 * It never runs inside the loop's own points, so the loop's misuse watch names a refused `publish` made here by its
 * module and the point the loop was then dispatching, or no point while it waits. [RN-1, IN-5, IN-6]
 */
export interface QueueRunner {
  /**
   * `on-fetch`, then `on-parse`, for `block`: each callback with its block context and an item sink, as the loop gives
   * them. Resolves with the block's items, or rejects with the dispatch's `CallbackFailure`. Throws for a height no
   * range of the graph holds. [RN-4, RN-5]
   */
  prepare(block: BlockRef): Promise<BlockItems>;
  /** `on-best-block` for `header`, in series, with no database handle. [IN-6, RN-4] */
  bestBlock(header: BlockRef): Promise<void>;
  /**
   * `on-rollback` for `dropped`, lowest first, in series, with no database handle, in the range of the first.
   * [IN-4, IN-6]
   */
  rollback(dropped: readonly BlockRef[]): Promise<void>;
  /**
   * The hash of the block the database holds at `height` (the blocks table's row), or null. The finality check compares
   * it with the finalized block's hash. [IN-4]
   */
  storedHash(height: bigint): Promise<Uint8Array | null>;
}

/**
 * The condition while a source's best-block queue is full: `tipCap` blocks are queued, so new best blocks are not.
 * `height` is the highest best block the node announced. [IN-6, AE-3]
 */
export interface FinalityStallCondition {
  readonly code: "finality-stall";
  readonly tipCap: number;
  readonly height: bigint;
}

/** A condition a block source reports. [AE-3] */
export type SourceCondition = FinalityStallCondition;

/** What a source over the node reports of it for `/status` ({@link BlockSource.nodeView}). [AE-5] */
export interface SourceNodeView {
  /** The height of the best head the node announced last (its latest new-heads notification); null before any. */
  readonly bestHead: bigint | null;
  /** How many best blocks the queue holds now: 0 while it holds none. [IN-6] */
  readonly queueDepth: number;
}
