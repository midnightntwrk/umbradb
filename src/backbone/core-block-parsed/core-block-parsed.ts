/**
 * The core module `core-block-parsed`. It parses every block's Midnight transactions once, with the ledger package of
 * the block's ledger version, and provides them as the `block` item `block-parsed` and as one row per transaction in
 * `core_block_parsed.transactions`. It is off by default, and it may start mid-chain, since each block's transactions
 * are its own. [CD-5, Q4, Q49; CORE-ARCH §4.11; design §10]
 *
 * **At `on-parse`** ({@link coreBlockParsedOnParse}) it:
 * - places the block's transactions in the order the ledger applied them (`./placement.ts`, from `block-body`,
 *   `chain-events` and, for the call arguments, `runtime-metadata`): the order of their chain events, each matched to
 *   its extrinsic by its phase, and block 0's in body order;
 * - has them parsed once with the ledger of `ledger-version` (`./parser.ts`), in the process's ledger worker, which
 *   keeps the parse for the block's apply;
 * - checks that each parse has the kind the chain gave it: a regular transaction's bytes that the ledger reads as a
 *   system transaction, or the reverse, refuse the block;
 * - checks that each parse has the hash its chain event carries, where the event carries one ({@link chainHashOf}): a
 *   ledger hash other than the chain's refuses the block;
 * - puts `block-parsed` ({@link BlockParsed}), frozen: the ledger version and, per transaction, the ledger's plain data
 *   (`ParsedTransaction`: its index, hash, kind, size, bytes and segments) with where the chain put it (its phase,
 *   extrinsic index and event index). [Q49]
 *
 * A block without a transaction loads no ledger package.
 *
 * **At `on-db-write`** it writes one row per transaction in one statement. **The table** and every statement are in
 * `./sql.ts`. [design §10]
 *
 * **The worker's parses** are released once their block has committed (`on-after-db-write`), and when a queued best
 * block is dropped (`on-rollback`), so the worker keeps no block it will not apply.
 *
 * The declaration ({@link CORE_BLOCK_PARSED}) is a constant. It finds the ledger worker through the process context,
 * which the runner binds to the process's worker ({@link bindLedgerParser}). A test's or a negative control's build
 * composes its own from {@link coreBlockParsedOnParse} with another parser, placement or chain-hash reading.
 */

import { z } from "zod";
import { UMBRADB_VERSION } from "../../config/build.js";
import type { BlockWriteHandle } from "../../db/api.js";
import type { ParsedTransaction } from "../../ledger/types.js";
import type { LedgerHost } from "../../ledger/worker/host.js";
import { type BlockContext, defineModule, type ItemSink, type ProcessContext } from "../../modules/declaration.js";
import { ledgerVersionOf } from "../core-block-commit/core-block-commit.js";
import type { BlockBody } from "../core-block-fetch/items.js";
import { chainEventsItemOf, metadataView, runtimeMetadataOf } from "../core-chain-events/core-chain-events.js";
import type { ChainEvent, EventPhase } from "../core-chain-events/events.js";
import { inThreadParser, type TransactionParser, workerParser } from "./parser.js";
import { MIDNIGHT, MIDNIGHT_SYSTEM, placeTransactions } from "./placement.js";
import { CORE_BLOCK_PARSED_MIGRATIONS, insertTransactionRows } from "./sql.js";

/** The module's id. */
export const CORE_BLOCK_PARSED_ID = "core-block-parsed";

/** The `block` (and `table`) item it provides. */
export const BLOCK_PARSED_ITEM = "block-parsed";

/** A transaction of `block-parsed`: the ledger's plain data and where the chain put it. */
export interface BlockTransaction extends ParsedTransaction {
  /** The phase its event was recorded under (block 0: `apply-extrinsic` of its extrinsic). */
  readonly phase: EventPhase;
  /** Under `apply-extrinsic`, the extrinsic's index. */
  readonly extrinsicIndex: number | null;
  /** The chain event that applied or failed it (an index into `chain-events`); null at block 0, which has none. */
  readonly eventIndex: number | null;
}

/** The `block-parsed` item (see the module comment). */
export interface BlockParsed {
  /** The ledger version that parsed them (`ledger-version`). */
  readonly ledger: string;
  /** In application order: `transactions[i].index` is `i`. [CD-5] */
  readonly transactions: readonly BlockTransaction[];
}

/** What {@link coreBlockParsedOnParse} parses and places with: the module's own unless a test gives others. */
export interface BlockParsedOptions {
  readonly parser?: TransactionParser;
  readonly place?: typeof placeTransactions;
  /**
   * The hash a placing chain event carries, which each transaction's ledger hash must equal: {@link chainHashOf}
   * unless given (a negative control's: none, so that a wrong placement reaches its criterion's oracle).
   */
  readonly chainHash?: (event: ChainEvent | undefined) => Uint8Array | null;
}

/** The parser of {@link coreBlockParsedOnParse} when none is given: in the calling thread (a test's build). */
const PARSER = inThreadParser();

const BOUND = new WeakMap<ProcessContext, LedgerHost>();

/**
 * Binds `core-block-parsed` to its process context `context` with the process's ledger worker, before the loop runs.
 * Throws when `context` is bound already.
 */
export function bindLedgerParser(context: ProcessContext, host: LedgerHost): void {
  if (BOUND.has(context)) throw new Error("bindLedgerParser: core-block-parsed is bound once per process context");
  BOUND.set(context, host);
}

/** The ledger worker bound to `p` (see {@link bindLedgerParser}); throws when there is none. */
export function boundLedgerParser(p: ProcessContext): LedgerHost {
  const host = BOUND.get(p);
  if (host === undefined) {
    throw new Error(
      "core-block-parsed ran with a process context the runner did not bind to a ledger worker (bindLedgerParser): it " +
        "parses in the worker, never on the main thread",
    );
  }
  return host;
}

const hexOf = (bytes: Uint8Array): string => `0x${Array.from(bytes, (byte) => byte.toString(16).padStart(2, "0")).join("")}`;
const sameBytes = (a: Uint8Array, b: Uint8Array): boolean => a.length === b.length && a.every((byte, i) => byte === b[i]);

/**
 * The transaction hash a placing chain event carries — `Midnight::TxApplied` and `TxPartialSuccess`'s `tx_hash`,
 * `MidnightSystem::SystemTransactionApplied`'s `hash` —, or null for an event that carries none (`ExtrinsicFailed`).
 */
export function chainHashOf(event: ChainEvent | undefined): Uint8Array | null {
  if (event === undefined) return null;
  const fields = event.fields as { readonly [name: string]: unknown } | null;
  const field =
    event.pallet === MIDNIGHT.pallet && (event.name === MIDNIGHT.applied || event.name === MIDNIGHT.partial)
      ? "tx_hash"
      : event.pallet === MIDNIGHT_SYSTEM.pallet && event.name === MIDNIGHT_SYSTEM.applied
        ? "hash"
        : null;
  const value = field === null || typeof fields !== "object" || fields === null ? undefined : fields[field];
  return value instanceof Uint8Array ? value : null;
}

/** The `block-body` item of `b`; throws a `TypeError` when it has none. */
function blockBodyOf(b: BlockContext): BlockBody {
  const body = b.items.get("block-body") as Partial<BlockBody> | undefined;
  if (!Array.isArray(body?.extrinsics)) {
    throw new TypeError(
      `the block at height ${b.height} has no block-body item core-block-parsed can read: core-block-fetch puts it at ` +
        "on-fetch",
    );
  }
  return body as BlockBody;
}

/** Block `b`'s `block-parsed` (see the module comment). */
export async function blockParsedOf(b: BlockContext, options: BlockParsedOptions = {}): Promise<BlockParsed> {
  const body = blockBodyOf(b);
  const events = chainEventsItemOf(b, CORE_BLOCK_PARSED_ID);
  const ledger = ledgerVersionOf(b);
  const metadata = () => metadataView(runtimeMetadataOf(b, CORE_BLOCK_PARSED_ID).metadata, b.height);
  const placed = (options.place ?? placeTransactions)(b.height, body, events, metadata);
  const parsed = await (options.parser ?? PARSER).parse(
    ledger,
    placed.map((transaction) => transaction.bytes),
    { height: b.height, hash: b.hash },
  );
  if (parsed.length !== placed.length) {
    throw new Error(`block ${b.height}: the parser gave ${parsed.length} transactions for ${placed.length}`);
  }
  const transactions = placed.map((transaction, index): BlockTransaction => {
    const plain = parsed[index] as ParsedTransaction;
    if (plain.kind !== transaction.kind) {
      throw new Error(
        `block ${b.height}: transaction ${index} is ${transaction.kind === "regular" ? "a regular" : "a system"} ` +
          `transaction on the chain, and the ledger ${ledger} reads its bytes as ${plain.kind === "regular" ? "a regular" : "a system"} one`,
      );
    }
    const chainHash = transaction.eventIndex === null ? null : (options.chainHash ?? chainHashOf)(events[transaction.eventIndex]);
    if (chainHash !== null && !sameBytes(chainHash, plain.hash)) {
      throw new Error(
        `block ${b.height}: transaction ${index}'s hash is ${hexOf(plain.hash)} to the ledger ${ledger}, and its chain ` +
          `event ${transaction.eventIndex} carries ${hexOf(chainHash)}`,
      );
    }
    return Object.freeze({
      ...plain,
      index,
      phase: transaction.phase,
      extrinsicIndex: transaction.extrinsicIndex,
      eventIndex: transaction.eventIndex,
    });
  });
  return Object.freeze({ ledger, transactions: Object.freeze(transactions) });
}

/** `core-block-parsed`'s `on-parse`: puts {@link blockParsedOf}'s item. */
export async function coreBlockParsedOnParse(b: BlockContext, out: ItemSink, options: BlockParsedOptions = {}): Promise<void> {
  out.put(BLOCK_PARSED_ITEM, await blockParsedOf(b, options));
}

/** The `block-parsed` item of `b`; throws a `TypeError` naming `module` when it has none. */
export function blockParsedItemOf(b: BlockContext, module: string): BlockParsed {
  const parsed = b.items.get(BLOCK_PARSED_ITEM) as Partial<BlockParsed> | undefined;
  if (!Array.isArray(parsed?.transactions)) {
    throw new TypeError(
      `the block at height ${b.height} has no block-parsed item ${module} can read: core-block-parsed puts it at on-parse`,
    );
  }
  return parsed as BlockParsed;
}

/** The rows of block `b`'s transactions, written in one statement (see the module comment). */
export async function writeTransactionRows(w: Pick<BlockWriteHandle, "execute">, b: BlockContext): Promise<void> {
  const { transactions } = blockParsedItemOf(b, CORE_BLOCK_PARSED_ID);
  if (transactions.length === 0) return;
  await insertTransactionRows(w, b.height, transactions);
}

/**
 * `core-block-parsed` (see the module comment): a core module that requires `block-body`, `runtime-metadata` and
 * `ledger-version` (`core-block-fetch`'s) and `chain-events` (`core-chain-events`'), and provides `block-parsed`, a
 * `block` item and its table.
 */
export const CORE_BLOCK_PARSED = defineModule({
  id: CORE_BLOCK_PARSED_ID,
  version: UMBRADB_VERSION,
  side: "public",
  requires: ["block-body", "runtime-metadata", "ledger-version", "chain-events"],
  provides: [
    {
      name: BLOCK_PARSED_ITEM,
      lifetimes: ["block", "table"],
      table: { schema: "core_block_parsed", tables: ["transactions"], kind: "append-only" },
    },
  ],
  startsMidChain: true,
  configSchema: z.object({}),
  migrations: CORE_BLOCK_PARSED_MIGRATIONS.map(({ id, sql }) => ({ id, sql })),
  points: {
    async "on-parse"(p, b, out) {
      await coreBlockParsedOnParse(b, out, { parser: workerParser(boundLedgerParser(p)) });
    },
    async "on-db-write"(_p, b, w) {
      await writeTransactionRows(w, b);
    },
    async "on-after-db-write"(p, b) {
      // Not awaited (as `core-ledger-state`'s commit): this callback holds a read, on PGlite the one queue, and the
      // release may wait in the worker behind a parse whose stored nodes need it.
      void BOUND.get(p)
        ?.release({ upTo: b.height })
        .catch(() => undefined);
    },
    async "on-rollback"(p, dropped) {
      void BOUND.get(p)
        ?.release({ hashes: dropped.map((block) => block.hash) })
        .catch(() => undefined);
    },
  },
});
