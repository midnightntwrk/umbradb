/**
 * The node-backed block source (`openspec/changes/core-arch/specs/chain-data/spec.md` CD-2, `specs/ingest/spec.md`
 * IN-4 to IN-8, `specs/runner/spec.md` RN-1, RN-14; `design.md` §3; CORE-ARCH §4.4; task 10.3): the block source of
 * the backbone part `core-block-fetch` (`./core-block-fetch.ts`), over the node client (`src/node/`) — the one node
 * connection of the process, which `core-chain` also publishes as `node-client`.
 *
 * **The finalized head** (IN-4). At its first use the source subscribes to the finalized heads and the new heads, then
 * reads the head (`chain_getFinalizedHead`, and `chain_getHeader` for its height), and from then on the finalized
 * notifications only raise it: a notification above the head raises it, one at or below it is checked (below). After a
 * reconnect (the client's `restarted`) it reads the head again rather than trusting notifications that may have been
 * lost. A head header's hash is computed from the header (`./header.ts`), as notifications carry none.
 *
 * **Finality conflicts** (IN-4). A finalized notification whose hash differs from the finalized hash the source knows at
 * its height — the head's, one read by `chain_getBlockHash`, or, at or below the loop's cursor, the database's
 * (`QueueRunner.storedHash`) — fails the source with `finality-conflict`: a finalized block never changes. The failure
 * rejects the loop's next call, so processing halts with that code (`design.md` §11). Before the loop runs (startup),
 * a notification at or below the cursor is compared with what the source knows only; IN-3's check of the cursor's
 * hash covers startup.
 *
 * **The finalized prefetch** (IN-5). While the loop runs, the source prepares the finalized heights from the loop's
 * cursor + 1 up to the lower of the cursor + `prefetchWindow` and the head the loop last read (`finalizedHead`, so that
 * the head's `on-finalized` comes before any of its heights' `on-fetch`) — never more than `prefetchWindow` heights
 * above the cursor fetched or held (A80) —, `concurrency` of them at a time (bounded concurrency): per height
 * `chain_getBlockHash` (the finalized hash, IN-4), then the queued block of that hash, if any, or else `chain_getBlock`
 * and `on-fetch` and `on-parse` through the runner (`QueueRunner.prepare`). The loop takes each height prepared
 * (`prepared`), in order, so every height is still committed in its own transaction (RN-6). A queued block at the height
 * with another hash is dropped with everything queued above it (`on-rollback`) and the finalized block fetched; the
 * heights look into the queue in height order, so such a drop is one `on-rollback`, from the lowest.
 *
 * **The best-block queue** (IN-6). For each new-heads notification above the finalized head (and the cursor) the source
 * fires `on-best-block`, fetches the block (`chain_getBlock`) and runs `on-fetch` and `on-parse` for it; it appends the
 * block if its parent is the top of the queue (the finalized head when the queue is empty), and otherwise walks the
 * block's parents back (`chain_getHeader`) to a queued block or the finalized head, drops every queued block above that
 * common ancestor (`on-rollback`, once, naming them lowest first), and fetches and parses the blocks between it and the
 * new one. Its calls are made without retries: any error on a best block — a node error or timeout, a decode, a
 * callback — drops that block, which is processed again at finality (IN-10). The queue holds at most `tipCap` blocks;
 * while it is full, new best blocks are not queued and the source reports the condition `finality-stall` (A81). A best
 * block is queued only while the loop follows the head — the head no more than `prefetchWindow` above the cursor: during
 * a catch-up the prefetch serves those heights, and the queue would hold blocks far above the window (decision record
 * question Q129). When the finalized head rises to a height where the queue holds another hash, the queued blocks
 * from there on are dropped (`on-rollback`). Every queue change, the prefetch's taking of a queued block included, runs
 * one at a time.
 *
 * **What `/status` shows** ({@link NodeBlockSource.nodeView}; AE-5, task 8.3a): the best head the node announced last —
 * each new-heads notification's height, taken before anything decides whether the block is queued, so also during
 * startup, a catch-up and while the queue is full — and the queue's length.
 *
 * **While the loop runs only.** The source runs callbacks only between the loop's `attach` and the function it returns;
 * when a run ends (stopped, halted, retried) the queue and the prefetch are dropped, and the next run starts afresh.
 * `close` (the process's stop) ends its subscriptions and counts as its failure: a pending wait, and every later call,
 * ends with "the node source is closed".
 *
 * **Block 0** (IN-7) goes the same path: `chain_getBlockHash(0)`, `chain_getBlock`, its metadata read at its own hash
 * (`contentStateOf`), its runtime from its `MNSV` digest; its time is 0 without a `Timestamp::set` (`./extrinsics.ts`).
 * Its ledger path — the genesis state, the root at block 0, the cNight registrations — is `core-ledger-state`'s and
 * `core-chain-events`' (tasks 12.3, 11.1).
 *
 * **The items** `core-block-fetch` publishes for a block ({@link NodeBlockSource.blockItems}, `./items.ts`): from the
 * block fetched, the ledger table (`selectLedgerVersion`, LG-1, LG-2) and the metadata of the runtime in its parent's
 * state (`RuntimeMetadata.forBlock`, LG-4: one `state_getRuntimeVersion` a block, one `state_getMetadata` a runtime),
 * which decodes its extrinsics. Every call it makes is one of IN-8's.
 *
 * **A block's chain events** ({@link NodeBlockSource.blockEvents}, `./events.ts`; task 11.1): `System::Events` read with
 * `state_getStorage` at the block's own hash, for `core-chain-events` (CD-4), which decodes them; a queued best block's
 * without retries, as its other calls (IN-10).
 *
 * **The ledger's root and genesis state** ({@link NodeBlockSource.ledgerStateRoot}, {@link NodeBlockSource.genesisState},
 * `./ledger-source.ts`; task 12.3): `midnight_ledgerStateRoot` at a finalized block's hash and
 * `system_properties.genesis_state`, for `core-ledger-state` (LG-15, IN-7), with the client's retries — it asks only for
 * finalized heights, at `on-compute`.
 */

import { UmbraError } from "../../db/errors.js";
import { type BlockLedgerSource, genesisStateOf } from "./ledger-source.js";
import { RuntimeMetadata, type MetadataBlock, type RuntimeMetadataEntry } from "../../ledger/metadata.js";
import { type LedgerTable, selectLedgerVersion } from "../../ledger/version-table.js";
import type { NodeClient, NodeSubscription } from "../../node/client.js";
import type { NodeBlock, NodeHeader } from "../../node/decode.js";
import type { ReadHandle } from "../../db/api.js";
import type { BlockItems } from "../../runner/block-context.js";
import type {
  BlockRef,
  BlockSource,
  PreparedBlock,
  QueueRunner,
  SourceCondition,
  SourceNodeView,
} from "../../runner/block-source.js";
import { readCursor } from "../core-block-commit/core-block-commit.js";
import { blockTimeOf, decodeExtrinsics } from "./extrinsics.js";
import { headerHash } from "./header.js";
import { type BlockEventSource, systemEventsKey } from "./events.js";
import type { BlockItemSource, CoreBlockItems } from "./items.js";
import { readRuntimeMetadata, type RuntimeMetadataView } from "./metadata.js";

/** How many finalized heights the prefetch fetches at once unless given (IN-5's bounded concurrency). */
export const DEFAULT_PREFETCH_CONCURRENCY = 8;

/** What the node source is made from. */
export interface NodeSourceOptions {
  /** The node client: the process's one node connection. */
  readonly client: NodeClient;
  /** IN-5's window: the most heights above the cursor fetched or held (CF-4's `prefetchWindow`, 64 by default). */
  readonly prefetchWindow: number;
  /** IN-6's bound: the most best blocks queued (CF-4's `tipCap`, 600 by default). */
  readonly tipCap: number;
  /** How many heights the prefetch fetches at once; {@link DEFAULT_PREFETCH_CONCURRENCY} unless given. */
  readonly concurrency?: number;
}

/** A best block in the queue: the block and its items (`on-fetch`'s and `on-parse`'s). */
interface QueuedBlock {
  readonly block: BlockRef;
  readonly items: BlockItems;
}

/** A finalized height the prefetch prepares. */
interface Prefetch {
  readonly promise: Promise<PreparedBlock>;
}

/** A pending {@link NodeBlockSource.waitForHead}. */
interface HeadWait {
  readonly above: bigint;
  resolve(): void;
  reject(error: unknown): void;
}

const HEX = "0123456789abcdef";

/** `bytes` as `0x`-prefixed lowercase hex. */
function hexOf(bytes: Uint8Array): string {
  let text = "0x";
  for (const byte of bytes) text += (HEX[byte >> 4] as string) + (HEX[byte & 15] as string);
  return text;
}

/** Whether two byte strings are equal. */
function sameBytes(a: Uint8Array, b: Uint8Array): boolean {
  return a.length === b.length && a.every((byte, index) => byte === b[index]);
}

/** A positive integer option, or a `RangeError`. */
function positive(value: number, name: string): number {
  if (!Number.isSafeInteger(value) || value < 1) throw new RangeError(`the node source's ${name} is a positive integer, not ${value}`);
  return value;
}

/** `header`'s block as the runner sees it. */
function refOf(header: NodeHeader, hash: Uint8Array): BlockRef {
  return Object.freeze({ height: header.number, hash, parentHash: header.parentHash });
}

/** The block source over the node (see the module comment). */
export class NodeBlockSource implements BlockSource, BlockItemSource, BlockEventSource, BlockLedgerSource {
  /** The node client, the process's one connection. */
  protected readonly client: NodeClient;
  readonly #window: number;
  readonly #tipCap: number;
  readonly #concurrency: number;

  // ── the finalized head ──────────────────────────────────────────────────────────────────────────────────────────
  #head: BlockRef | undefined;
  #started: Promise<void> | undefined;
  /** Finalized notifications that came before the head was first read. */
  readonly #early: NodeHeader[] = [];
  readonly #waits = new Set<HeadWait>();
  readonly #subscriptions: NodeSubscription[] = [];
  /** The finalized hashes read by height (`chain_getBlockHash`), above the cursor: IN-4's finality check. */
  readonly #finalized = new Map<bigint, Uint8Array>();
  /**
   * The first failure (a finality conflict, a finalized subscription's error, the close): every later call rejects
   * with it.
   */
  #failure: unknown;
  #closed = false;

  // ── the loop ────────────────────────────────────────────────────────────────────────────────────────────────────
  /**
   * The loop's cursor as the source knows it: the cursor it read at the start of its run (`cursor`), then the height
   * before the one it asked for last (`prepared`); null on a new database before its first height.
   */
  #cursor: bigint | null = null;
  /** The head the loop last read while it ran (`finalizedHead`): the prefetch's bound. */
  #announced: bigint | null = null;
  #runner: QueueRunner | undefined;
  /** Counts the loop's runs: work begun in an earlier run is dropped. */
  #epoch = 0;

  // ── the prefetch and the queue ──────────────────────────────────────────────────────────────────────────────────
  readonly #prefetch = new Map<bigint, Prefetch>();
  #active = 0;
  readonly #slots: (() => void)[] = [];
  /**
   * The last height's look into the queue (`#take`) begun in this run: each height's waits for the one below it, so the
   * queued blocks a finalized hash drops are dropped in height order, with one `on-rollback` from the lowest.
   */
  #lastTake: Promise<void> = Promise.resolve();
  #queue: QueuedBlock[] = [];
  #queueWork: Promise<void> = Promise.resolve();
  /** The highest best block the node announced while the queue ran. */
  #best: bigint | null = null;
  /** The best head the node announced last, whatever the queue did with it (`/status`'s); null before any. */
  #announcedBest: bigint | null = null;
  /** The blocks being prepared, by hash: what `core-block-fetch`'s `on-fetch` reads, and whether best (no retries). */
  readonly #fetched = new Map<string, { readonly node: NodeBlock; readonly best: boolean }>();

  // ── the metadata ────────────────────────────────────────────────────────────────────────────────────────────────
  readonly #metadata: RuntimeMetadata;
  readonly #bestMetadata: RuntimeMetadata;
  readonly #views = new WeakMap<Uint8Array, RuntimeMetadataView>();

  constructor(options: NodeSourceOptions) {
    this.client = options.client;
    this.#window = positive(options.prefetchWindow, "prefetchWindow");
    this.#tipCap = positive(options.tipCap, "tipCap");
    this.#concurrency = positive(options.concurrency ?? DEFAULT_PREFETCH_CONCURRENCY, "concurrency");
    const client = options.client;
    this.#metadata = new RuntimeMetadata(client);
    this.#bestMetadata = new RuntimeMetadata({
      runtimeVersion: (at) => client.runtimeVersion(at, { retry: false }),
      metadata: (at) => client.metadata(at, { retry: false }),
    });
  }

  // ── the block source ────────────────────────────────────────────────────────────────────────────────────────────

  /** The blocks table's last row, read through `read` (`readCursor`); the source's view of the cursor. */
  async cursor(read: Pick<ReadHandle, "query">): Promise<BlockRef | null> {
    const cursor = await readCursor(read);
    this.#cursor = cursor?.height ?? null;
    return cursor;
  }

  async finalizedHead(): Promise<BlockRef> {
    await this.#start();
    this.#throwFailure();
    const head = this.#head as BlockRef;
    if (this.#runner !== undefined) this.#announced = head.height;
    return head;
  }

  async waitForHead(above: bigint, signal: AbortSignal): Promise<void> {
    signal.throwIfAborted();
    await this.#start();
    signal.throwIfAborted();
    this.#throwFailure();
    if ((this.#head as BlockRef).height > above) return;
    await new Promise<void>((resolve, reject) => {
      const wait: HeadWait = {
        above,
        resolve: () => {
          done();
          resolve();
        },
        reject: (error) => {
          done();
          reject(error);
        },
      };
      const abort = (): void => wait.reject(signal.reason);
      const done = (): void => {
        this.#waits.delete(wait);
        signal.removeEventListener("abort", abort);
      };
      signal.addEventListener("abort", abort);
      this.#waits.add(wait);
    });
  }

  /** The finalized block at `height`: `chain_getBlockHash`, then `chain_getHeader` for its parent hash. */
  async block(height: bigint): Promise<BlockRef> {
    const hash = await this.client.blockHash(height);
    const header = await this.client.header(hash);
    this.#checkHeight(header, height, "chain_getHeader");
    return refOf(header, hash);
  }

  attach(runner: QueueRunner): () => void {
    this.#epoch += 1;
    const epoch = this.#epoch;
    this.#reset();
    this.#runner = runner;
    return () => {
      if (this.#epoch !== epoch) return;
      this.#epoch += 1;
      this.#runner = undefined;
      this.#reset();
    };
  }

  async prepared(height: bigint): Promise<PreparedBlock> {
    this.#throwFailure();
    if (this.#runner === undefined) throw new Error("the node source prepares heights only while the loop runs (attach)");
    this.#cursor = height - 1n;
    for (const key of this.#prefetch.keys()) if (key < height) this.#prefetch.delete(key);
    for (const key of this.#finalized.keys()) if (key < height - 1n) this.#finalized.delete(key);
    this.#queued(async () => {
      this.#queue = this.#queue.filter((queued) => queued.block.height >= height);
    }).catch(() => undefined);
    this.#fill();
    const prefetch = this.#prefetch.get(height) ?? this.#begin(height);
    const prepared = await prefetch.promise;
    this.#prefetch.delete(height);
    return prepared;
  }

  /** Resolves once the queue's work asked for so far is done (each best block, each head's check): for tests. */
  idle(): Promise<void> {
    return this.#queueWork;
  }

  nodeView(): SourceNodeView {
    return Object.freeze({ bestHead: this.#announcedBest, queueDepth: this.#queue.length });
  }

  conditions(): readonly SourceCondition[] {
    if (this.#queue.length < this.#tipCap || this.#best === null) return [];
    return [Object.freeze({ code: "finality-stall", tipCap: this.#tipCap, height: this.#best })];
  }

  async close(): Promise<void> {
    // Every later call, and every wait still pending, ends with this, unless the source failed before.
    this.#fail(new Error("the node source is closed"));
    this.#closed = true;
    for (const subscription of this.#subscriptions.splice(0)) subscription.cancel();
    this.#epoch += 1;
    this.#runner = undefined;
    this.#reset();
  }

  /** The items `core-block-fetch` publishes for `block` (see the module comment and `./items.ts`). */
  async blockItems(block: BlockRef, table: LedgerTable | undefined): Promise<CoreBlockItems> {
    const fetched = this.#fetched.get(hexOf(block.hash));
    const best = fetched?.best ?? false;
    const node = fetched?.node ?? (await this.client.block(block.hash));
    const { header } = node;
    this.#checkHeight(header, block.height, "chain_getBlock");
    if (!sameBytes(header.parentHash, block.parentHash)) {
      throw new Error(`the node's block ${hexOf(block.hash)} names another parent than the block ${block.height} given`);
    }
    if (table === undefined) {
      throw new Error("core-block-fetch has no ledger-table item to choose the ledger version of a block with (LG-1)");
    }
    const { specVersion, ledger } = selectLedgerVersion(table, { height: block.height, hash: block.hash, digest: header.digest });
    const metadata = await this.metadataOf({ ...block, specVersion }, best);
    const view = this.#view(metadata.metadata, block.height);
    const extrinsics = decodeExtrinsics(view, node.extrinsics, block.height);
    const timestampMs = blockTimeOf(view, extrinsics, block.height);
    return Object.freeze({
      "block-header": Object.freeze({
        height: block.height,
        hash: block.hash,
        parentHash: block.parentHash,
        stateRoot: header.stateRoot,
        extrinsicsRoot: header.extrinsicsRoot,
        digest: header.digest,
        specVersion,
        timestampMs,
      }),
      "block-body": Object.freeze({ specVersion: metadata.specVersion, extrinsics }),
      "runtime-metadata": metadata,
      "ledger-version": ledger,
    });
  }

  /**
   * `block`'s chain events as the node stores them: `System::Events` in its own state, `state_getStorage` at its hash
   * (`./events.ts`); a best block's read without retries (IN-10). Null when the state holds no value there.
   */
  async blockEvents(block: BlockRef): Promise<Uint8Array | null> {
    const best = this.#fetched.get(hexOf(block.hash))?.best ?? false;
    return this.client.storage(systemEventsKey(), block.hash, best ? { retry: false } : undefined);
  }

  /** The node's ledger state root after `block` (LG-15): `midnight_ledgerStateRoot` at its hash, with the client's retries. */
  async ledgerStateRoot(block: BlockRef): Promise<Uint8Array> {
    return this.client.ledgerStateRoot(block.hash);
  }

  /** The genesis ledger state (IN-7): `system_properties.genesis_state`, with the client's retries. */
  async genesisState(): Promise<Uint8Array> {
    return genesisStateOf(await this.client.systemProperties());
  }

  // ── seams (a negative control's) ────────────────────────────────────────────────────────────────────────────────

  /**
   * The metadata `block`'s content is decoded with (LG-4): the runtime in its parent's state (`forBlock`); a best
   * block's read without retries (IN-10).
   */
  protected metadataOf(block: MetadataBlock, best: boolean): Promise<RuntimeMetadataEntry> {
    return (best ? this.#bestMetadata : this.#metadata).forBlock(block);
  }

  /** The last height the prefetch prepares with the loop's cursor at `cursor` and the head at `head` (IN-5). */
  protected windowEnd(cursor: bigint, head: bigint): bigint {
    const end = cursor + BigInt(this.#window);
    return end < head ? end : head;
  }

  /** The finalized subscription was made again after a reconnect: the head is read again (IN-4). */
  protected restarted(): void {
    void this.#readHead().catch((error: unknown) => this.#fail(error));
  }

  /** Whether a queued block with the finalized hash at its height goes on with its items (IN-4, IN-6: it does). */
  protected usesQueued(_block: BlockRef): boolean {
    return true;
  }

  // ── the finalized head ──────────────────────────────────────────────────────────────────────────────────────────

  /** Subscribes and reads the head once; a start that failed is made again by the next call. */
  #start(): Promise<void> {
    this.#started ??= this.#subscribe().catch((error: unknown) => {
      this.#started = undefined;
      throw error;
    });
    return this.#started;
  }

  async #subscribe(): Promise<void> {
    if (this.#closed) throw new Error("the node source is closed");
    this.#subscriptions.push(
      await this.client.subscribeFinalizedHeads({
        header: (header) => this.#onFinalized(header),
        restarted: () => this.restarted(),
        error: (error) => this.#fail(error),
      }),
    );
    this.#subscriptions.push(
      await this.client.subscribeNewHeads({
        header: (header) => this.#onBest(header),
        // A best block the client could not read is not queued (IN-10).
        error: () => undefined,
      }),
    );
    await this.#readHead();
  }

  /** Reads the node's finalized head (IN-4: at start, and after a reconnect) and raises the head to it. */
  async #readHead(): Promise<void> {
    const hash = await this.client.finalizedHead();
    const header = await this.client.header(hash);
    this.#finalizedAt(refOf(header, hash));
    for (const early of this.#early.splice(0)) this.#onFinalized(early);
  }

  #onFinalized(header: NodeHeader): void {
    if (this.#failure !== undefined) return;
    if (this.#head === undefined) {
      this.#early.push(header);
      return;
    }
    this.#finalizedAt(refOf(header, headerHash(header)));
  }

  /** A finalized block the node reported (see the module comment): raises the head, or checks it. */
  #finalizedAt(block: BlockRef): void {
    const head = this.#head;
    if (head === undefined || block.height > head.height) {
      this.#head = block;
      this.#finalized.set(block.height, block.hash);
      for (const wait of [...this.#waits]) if (block.height > wait.above) wait.resolve();
      this.#queued((runner) => this.#dropFrom(runner, block)).catch(() => undefined);
      return;
    }
    const known = this.#finalized.get(block.height);
    if (known !== undefined) {
      if (!sameBytes(known, block.hash)) this.#fail(this.#conflict(block, known, "the finalized hash read there"));
      return;
    }
    const runner = this.#runner;
    if (runner === undefined || this.#cursor === null || block.height > this.#cursor) return;
    runner.storedHash(block.height).then(
      (stored) => {
        if (stored !== null && !sameBytes(stored, block.hash)) this.#fail(this.#conflict(block, stored, "the database's block"));
      },
      () => undefined,
    );
  }

  #conflict(block: BlockRef, known: Uint8Array, what: string): UmbraError {
    return new UmbraError(
      "finality-conflict",
      `the node reported the finalized block ${hexOf(block.hash)} at height ${block.height}, but ${what} is ` +
        `${hexOf(known)}: a finalized block never changes (IN-4); processing halts`,
      { height: block.height, hash: hexOf(block.hash), stored: hexOf(known) },
    );
  }

  /** Records the source's first failure — a close counts as one — and ends every wait with it. */
  #fail(error: unknown): void {
    if (this.#failure !== undefined) return;
    this.#failure = error;
    for (const wait of [...this.#waits]) wait.reject(error);
  }

  #throwFailure(): void {
    if (this.#failure !== undefined) throw this.#failure;
  }

  #checkHeight(header: NodeHeader, height: bigint, method: string): void {
    if (header.number !== height) {
      throw new UmbraError("node-error", `the node's ${method} answer for height ${height} is the block of height ${header.number}`, {
        method,
        height,
        number: header.number,
      });
    }
  }

  // ── the prefetch ────────────────────────────────────────────────────────────────────────────────────────────────

  /** Drops the queue and the prefetch (a run ended, or began). */
  #reset(): void {
    this.#prefetch.clear();
    this.#lastTake = Promise.resolve();
    this.#queue = [];
    this.#best = null;
    this.#announced = null;
  }

  /** Begins every height of the window not yet begun (see the module comment). */
  #fill(): void {
    const announced = this.#announced;
    if (this.#runner === undefined || this.#cursor === null || announced === null || this.#failure !== undefined) return;
    const end = this.windowEnd(this.#cursor, announced);
    for (let height = this.#cursor + 1n; height <= end; height++) if (!this.#prefetch.has(height)) this.#begin(height);
  }

  /** Begins preparing the finalized height `height`, once a slot is free. */
  #begin(height: bigint): Prefetch {
    const runner = this.#runner as QueueRunner;
    const epoch = this.#epoch;
    // Heights begin in order (`#fill`, `prepared`): each one's take waits for the height below's.
    const below = this.#lastTake;
    let taken = (): void => undefined;
    this.#lastTake = new Promise<void>((resolve) => {
      taken = resolve;
    });
    const promise = this.#prepareFinalized(runner, height, epoch, below, taken);
    // The loop awaits it when it reaches the height; a run that ended leaves it unawaited.
    promise.catch(() => undefined);
    const prefetch: Prefetch = { promise };
    this.#prefetch.set(height, prefetch);
    return prefetch;
  }

  async #slot<T>(task: () => Promise<T>): Promise<T> {
    while (this.#active >= this.#concurrency) await new Promise<void>((resolve) => this.#slots.push(resolve));
    this.#active += 1;
    try {
      return await task();
    } finally {
      this.#active -= 1;
      this.#slots.shift()?.();
    }
  }

  /**
   * The finalized height `height` prepared (see the module comment), for the loop's run `epoch`: its hash read and its
   * block fetched and parsed each in a slot (bounded concurrency), and between them, holding no slot, its take from the
   * queue once the height below has had its own (`below`; `taken` lets the height above have its).
   */
  async #prepareFinalized(
    runner: QueueRunner,
    height: bigint,
    epoch: number,
    below: Promise<void>,
    taken: () => void,
  ): Promise<PreparedBlock> {
    const live = (): void => {
      if (epoch !== this.#epoch) throw new Error("the loop's run that asked for this height ended");
    };
    let hash: Uint8Array;
    let queued: PreparedBlock | undefined;
    try {
      hash = await this.#slot(async () => {
        live();
        const read = await this.client.blockHash(height);
        live();
        return read;
      });
      this.#finalized.set(height, hash);
      await below;
      queued = await this.#queued((current) => this.#take(current, height, hash), runner);
    } finally {
      taken();
    }
    live();
    if (queued !== undefined) return queued;
    return this.#slot(async () => {
      const node = await this.client.block(hash);
      live();
      this.#checkHeight(node.header, height, "chain_getBlock");
      return this.#prepare(runner, refOf(node.header, hash), node, false);
    });
  }

  /** `on-fetch` and `on-parse` for `block`, fetched as `node`, through `runner`. */
  async #prepare(runner: QueueRunner, block: BlockRef, node: NodeBlock, best: boolean): Promise<PreparedBlock> {
    const key = hexOf(block.hash);
    this.#fetched.set(key, { node, best });
    try {
      return Object.freeze({ block, items: await runner.prepare(block) });
    } finally {
      this.#fetched.delete(key);
    }
  }

  // ── the queue ───────────────────────────────────────────────────────────────────────────────────────────────────

  /**
   * Runs `task` after every queue change before it, one at a time, with the runner it was asked under (`runner`, else
   * the current one); does nothing and resolves undefined when the loop does not run, or its run ended meanwhile.
   */
  #queued<T>(task: (runner: QueueRunner) => Promise<T>, runner = this.#runner): Promise<T | undefined> {
    const epoch = this.#epoch;
    const run = this.#queueWork.then(() =>
      runner === undefined || epoch !== this.#epoch ? undefined : task(runner),
    );
    this.#queueWork = run.then(
      () => undefined,
      () => undefined,
    );
    return run;
  }

  /**
   * The queued block at `height` if it has the finalized hash `hash`, taken from the queue; a queued block there with
   * another hash is dropped with everything queued above it (`on-rollback`, IN-4).
   */
  async #take(runner: QueueRunner, height: bigint, hash: Uint8Array): Promise<PreparedBlock | undefined> {
    const index = this.#queue.findIndex((queued) => queued.block.height === height);
    if (index < 0) return undefined;
    const queued = this.#queue[index] as QueuedBlock;
    if (sameBytes(queued.block.hash, hash)) {
      this.#queue.splice(index, 1);
      return this.usesQueued(queued.block) ? Object.freeze({ block: queued.block, items: queued.items }) : undefined;
    }
    const dropped = this.#queue.splice(index);
    await runner.rollback(dropped.map((entry) => entry.block));
    return undefined;
  }

  /** The finalized head rose to `head`: a queued block at its height with another hash is dropped, and those above it. */
  async #dropFrom(runner: QueueRunner, head: BlockRef): Promise<void> {
    const index = this.#queue.findIndex((queued) => queued.block.height === head.height);
    if (index < 0 || sameBytes((this.#queue[index] as QueuedBlock).block.hash, head.hash)) return;
    const dropped = this.#queue.splice(index);
    // The blocks are dropped whatever a callback does: an error on queued blocks drops them (IN-10).
    await runner.rollback(dropped.map((entry) => entry.block)).catch(() => undefined);
  }

  #onBest(header: NodeHeader): void {
    this.#announcedBest = header.number;
    if (this.#runner === undefined || this.#failure !== undefined) return;
    // A notification may come before the head read that the subscription preceded has settled: after it.
    const started = this.#started;
    this.#queued(async (runner) => {
      await started?.catch(() => undefined);
      await this.#bestBlock(runner, header);
    }).catch(() => undefined);
  }

  /** A new best block (see the module comment); any error drops it (IN-10). */
  async #bestBlock(runner: QueueRunner, header: NodeHeader): Promise<void> {
    const head = this.#head;
    const cursor = this.#cursor;
    const height = header.number;
    if (head === undefined || cursor === null || height <= head.height || height <= cursor) return;
    // Q129: queued only while the loop follows the head.
    if (head.height - cursor > BigInt(this.#window)) return;
    if (this.#best === null || height > this.#best) this.#best = height;
    const hash = headerHash(header);
    if (this.#queue.some((queued) => sameBytes(queued.block.hash, hash))) return;
    if (this.#queue.length >= this.#tipCap) return;
    const epoch = this.#epoch;
    const live = (): void => {
      if (epoch !== this.#epoch) throw new Error("the loop's run ended");
    };
    const block = refOf(header, hash);
    try {
      await runner.bestBlock(block);
      const node = await this.client.block(hash, { retry: false });
      live();
      this.#checkHeight(node.header, height, "chain_getBlock");
      const prepared = await this.#prepare(runner, block, node, true);
      live();
      await this.#place(runner, { block, items: prepared.items }, live);
    } catch {
      // IN-10: an error on a queued best block drops it, without retry; it is processed again at finality.
    }
  }

  /**
   * Puts the best block `entry` into the queue (IN-6): appended, or after the walk to the common ancestor; `live` throws
   * once the loop's run ended. A block the finalized head passed meanwhile is queued too: every later take of its height
   * by the prefetch runs after this, so the finalized hash there decides — used, or dropped with `on-rollback`.
   */
  async #place(runner: QueueRunner, entry: QueuedBlock, live: () => void): Promise<void> {
    const { block } = entry;
    const top = this.#queue.at(-1)?.block ?? (this.#head as BlockRef);
    if (top.height === block.height - 1n && sameBytes(top.hash, block.parentHash)) {
      this.#queue.push(entry);
      return;
    }
    // The finalized head reached the block's height while it was being prepared (task 11.1: a fast-finalizing chain):
    // queued as it is, above every queued block, so the prefetch's take at its height — which runs after this — uses it
    // when it is the finalized block, and drops it with `on-rollback` when not; it is never fetched and parsed again.
    if (block.height <= (this.#head as BlockRef).height && this.#queue.every((queued) => queued.block.height < block.height)) {
      this.#queue.push(entry);
      return;
    }
    // The walk: the new block's parents back to a queued block or the finalized head.
    const branch: { readonly hash: Uint8Array; readonly header: NodeHeader }[] = [];
    let parent = block.parentHash;
    let height = block.height - 1n;
    let ancestor: number;
    for (;;) {
      const queued = this.#queue.findIndex((q) => q.block.height === height && sameBytes(q.block.hash, parent));
      if (queued >= 0) {
        ancestor = queued;
        break;
      }
      const head = this.#head as BlockRef;
      if (height <= head.height) {
        if (height === head.height && sameBytes(head.hash, parent)) {
          ancestor = -1;
          break;
        }
        throw new Error(`the best block ${hexOf(block.hash)} does not descend from the finalized head`);
      }
      const parentHeader = await this.client.header(parent, { retry: false });
      live();
      this.#checkHeight(parentHeader, height, "chain_getHeader");
      branch.unshift({ hash: parent, header: parentHeader });
      parent = parentHeader.parentHash;
      height -= 1n;
    }
    if (ancestor + 1 + branch.length + 1 > this.#tipCap) return;
    const dropped = this.#queue.splice(ancestor + 1);
    if (dropped.length > 0) await runner.rollback(dropped.map((queued) => queued.block));
    for (const { hash, header } of branch) {
      const ref = refOf(header, hash);
      const node = await this.client.block(hash, { retry: false });
      live();
      const { items } = await this.#prepare(runner, ref, node, true);
      live();
      this.#queue.push({ block: ref, items });
    }
    this.#queue.push(entry);
  }

  /** The metadata `bytes` read (`./metadata.ts`), once per runtime. */
  #view(bytes: Uint8Array, height: bigint): RuntimeMetadataView {
    let view = this.#views.get(bytes);
    if (view === undefined) {
      try {
        view = readRuntimeMetadata(bytes);
      } catch (error) {
        throw new Error(`the runtime metadata block ${height} is decoded with cannot be read: ${(error as Error).message}`, {
          cause: error,
        });
      }
      this.#views.set(bytes, view);
    }
    return view;
  }
}

/**
 * The node source a process runs with (5.3's `source: (core) => …`; what `umbradb run` passes, task 4.4): over the
 * process's node client, with the `core` revision's `prefetchWindow` and `tipCap` (CF-4, Q102). Throws when the process
 * has no node client (its `core` revision has no `node`).
 */
export function nodeSourceOf(
  core: { readonly settings: unknown },
  shared: { readonly nodeClient: NodeClient | null },
): NodeBlockSource {
  if (shared.nodeClient === null) {
    throw new UmbraError("invalid-configuration", "the process has no node to read the chain from: the core entry's node", {
      field: "node",
    });
  }
  const settings = core.settings as { readonly prefetchWindow: number; readonly tipCap: number };
  return new NodeBlockSource({ client: shared.nodeClient, prefetchWindow: settings.prefetchWindow, tipCap: settings.tipCap });
}
