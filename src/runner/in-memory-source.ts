/**
 * The in-memory block source: the block-source interface over blocks held in memory, for tests and module authors.
 * [RN-14; design §3, §12]
 * - Its finalized head only rises ({@link InMemoryBlockSource.finalize}), as a node's does.
 * - The block at each height up to the head is the one it was given, or else {@link inMemoryBlock}'s, a chain whose
 *   hashes link.
 * - {@link InMemoryBlockSource.waitForHead} waits for the head to pass a height.
 * - Its cursor is the blocks table's last row, read through the read it is given (`core-block-commit`,
 *   `src/backbone/core-block-commit/`): the same table the node-backed source reads.
 *
 * It holds no queue and no best blocks. `on-best-block` and `on-rollback` belong to the node-backed source, and so does
 * the finality check; the parent check is `core-block-commit`'s, for every source. The loop runs `on-fetch` and
 * `on-parse` itself (no `prepared`). [IN-4, IN-6]
 *
 * **Its block items** ({@link InMemoryBlockSource.blockItems}). The real `core-block-fetch` publishes, at `on-fetch`,
 * the items its block source gives (`src/backbone/core-block-fetch/`), so a module author's build with UmbraDB's
 * backbone runs on this source too. Unless the options give a block's own (`items`), its blocks have the runtime
 * {@link IN_MEMORY_SPEC_VERSION}, the ledger {@link IN_MEMORY_LEDGER}, the time {@link IN_MEMORY_START_MS} + height ×
 * 6,000 ms (6-second blocks), no extrinsics and empty metadata. It decodes nothing: the `ledger-table` is not read. Its
 * blocks have no chain events ({@link InMemoryBlockSource.blockEvents} gives none to `core-chain-events`). [CD-2, CD-4]
 */

import { createHash } from "node:crypto";
import { readCursor } from "../backbone/core-block-commit/core-block-commit.js";
import type { CoreBlockItems } from "../backbone/core-block-fetch/items.js";
import type { ReadHandle } from "../db/api.js";
import type { BlockRef, BlockSource } from "./block-source.js";

/** The `spec_version` of every in-memory block unless given: runtime 2.0's, whose ledger is v9. [CORE-ARCH §4.8] */
export const IN_MEMORY_SPEC_VERSION = 2_000_000;

/** The ledger version of every in-memory block unless given. */
export const IN_MEMORY_LEDGER = "v9";

/** The time of the in-memory block at height 0 unless given, in milliseconds since 1970: 2025-06-15T15:06:40Z. */
export const IN_MEMORY_START_MS = 1_750_000_000_000n;

/** A block's own items, in place of the in-memory defaults: its runtime, its time, its ledger. */
export interface InMemoryItems {
  readonly specVersion?: number;
  readonly timestampMs?: bigint;
  readonly ledger?: string;
}

/** The hash of the default block at `height`: SHA-256 of the UTF-8 text `umbradb in-memory block <height>`. */
function hashAt(height: bigint): Uint8Array {
  return new Uint8Array(createHash("sha256").update(`umbradb in-memory block ${height}`, "utf8").digest());
}

/** Refuses a height below 0. */
function checkHeight(height: bigint, what: string): void {
  if (height < 0n) throw new RangeError(`${what} is at least 0, not ${height}`);
}

/**
 * The default block at `height` (frozen): its hash is {@link hashAt}'s, its parent hash the hash of the block before,
 * and block 0's parent hash 32 zero bytes, so the default blocks form one chain from genesis.
 */
export function inMemoryBlock(height: bigint): BlockRef {
  checkHeight(height, "an in-memory block's height");
  return Object.freeze({
    height,
    hash: hashAt(height),
    parentHash: height === 0n ? new Uint8Array(32) : hashAt(height - 1n),
  });
}

/** Options of {@link InMemoryBlockSource}. */
export interface InMemorySourceOptions {
  /** The finalized head to start with, at least 0. */
  readonly head: bigint;
  /** Blocks to give in place of the default ones at their heights (e.g. a block with another hash). */
  readonly blocks?: Iterable<BlockRef>;
  /** Each block's own items, in place of the defaults (see the module comment). */
  readonly items?: (block: BlockRef) => InMemoryItems;
}

/** One pending {@link InMemoryBlockSource.waitForHead}. */
interface Wait {
  readonly above: bigint;
  readonly wake: () => void;
}

/** The block source over blocks in memory (see the module comment). */
export class InMemoryBlockSource implements BlockSource {
  #head: bigint;
  readonly #blocks = new Map<bigint, BlockRef>();
  readonly #waits = new Set<Wait>();
  readonly #watchers: { readonly above: bigint; readonly resolve: () => void }[] = [];
  readonly #items: (block: BlockRef) => InMemoryItems;

  constructor(options: InMemorySourceOptions) {
    checkHeight(options.head, "the in-memory source's head");
    this.#head = options.head;
    for (const block of options.blocks ?? []) this.#blocks.set(block.height, block);
    this.#items = options.items ?? (() => ({}));
  }

  /** The finalized head. */
  get head(): bigint {
    return this.#head;
  }

  /**
   * Raises the finalized head to `head` and wakes every wait for a head below it. The same head again changes nothing;
   * a lower one is refused, as a finalized block stays finalized.
   */
  finalize(head: bigint): void {
    if (head < this.#head) {
      throw new RangeError(
        `the in-memory source's finalized head cannot go back from ${this.#head} to ${head}: a finalized block stays ` +
          "finalized",
      );
    }
    this.#head = head;
    for (const wait of [...this.#waits]) if (head > wait.above) wait.wake();
  }

  /** The cursor table's last row, read through `read` (`readCursor`). */
  cursor(read: Pick<ReadHandle, "query">): Promise<BlockRef | null> {
    return readCursor(read);
  }

  async finalizedHead(): Promise<BlockRef> {
    return this.#blockAt(this.#head);
  }

  async block(height: bigint): Promise<BlockRef> {
    if (height > this.#head) {
      throw new RangeError(`the in-memory source has no finalized block at ${height}: its finalized head is ${this.#head}`);
    }
    return this.#blockAt(height);
  }

  waitForHead(above: bigint, signal: AbortSignal): Promise<void> {
    if (signal.aborted) return Promise.reject(signal.reason);
    if (this.#head > above) return Promise.resolve();
    return new Promise<void>((resolve, reject) => {
      const done = (): void => {
        this.#waits.delete(wait);
        signal.removeEventListener("abort", abort);
      };
      const wait: Wait = {
        above,
        wake: () => {
          done();
          resolve();
        },
      };
      const abort = (): void => {
        done();
        reject(signal.reason);
      };
      signal.addEventListener("abort", abort);
      this.#waits.add(wait);
      for (const watcher of this.#watchers.splice(0)) {
        if (watcher.above === above) watcher.resolve();
        else this.#watchers.push(watcher);
      }
    });
  }

  /**
   * `core-block-fetch`'s items for `block` (see the module comment): the defaults, or the block's own from the options;
   * frozen.
   */
  async blockItems(block: BlockRef): Promise<CoreBlockItems> {
    const own = this.#items(block);
    const specVersion = own.specVersion ?? IN_MEMORY_SPEC_VERSION;
    const zeros = new Uint8Array(32);
    return Object.freeze({
      "block-header": Object.freeze({
        height: block.height,
        hash: block.hash,
        parentHash: block.parentHash,
        stateRoot: zeros,
        extrinsicsRoot: zeros,
        digest: Object.freeze([]),
        specVersion,
        timestampMs: own.timestampMs ?? IN_MEMORY_START_MS + block.height * 6_000n,
      }),
      "block-body": Object.freeze({ specVersion, extrinsics: Object.freeze([]) }),
      "runtime-metadata": Object.freeze({ specVersion, metadata: new Uint8Array(0) }),
      "ledger-version": own.ledger ?? IN_MEMORY_LEDGER,
    });
  }

  /** A block's chain events for `core-chain-events`: none, as its blocks have no extrinsics. [CD-4] */
  async blockEvents(_block: BlockRef): Promise<Uint8Array | null> {
    return null;
  }

  /**
   * Resolves once a {@link waitForHead} for a head above `above` is pending — at once if one is — for a test or a
   * module author to know that a runner has processed everything up to `above` and waits.
   */
  waiting(above: bigint): Promise<void> {
    for (const wait of this.#waits) if (wait.above === above) return Promise.resolve();
    return new Promise<void>((resolve) => {
      this.#watchers.push({ above, resolve });
    });
  }

  #blockAt(height: bigint): BlockRef {
    return this.#blocks.get(height) ?? inMemoryBlock(height);
  }
}
