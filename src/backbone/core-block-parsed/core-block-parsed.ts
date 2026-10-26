/**
 * The core module `core-block-parsed` (`openspec/changes/core-arch/specs/chain-data/spec.md` CD-5; `design.md` §10;
 * CORE-ARCH §4.11; decision record Q4, Q49; task 11.1): every block's Midnight transactions, parsed once with the
 * ledger package of the block's ledger version, as the `block` item `block-parsed` and one row per transaction in
 * `core_block_parsed.transactions`. Off by default; it may start mid-chain (each block's transactions are its own).
 *
 * **At `on-parse`** ({@link coreBlockParsedOnParse}) it places the block's transactions in the order the ledger applied
 * them — the order of their chain events, each matched to its extrinsic by its phase; block 0's in body order —
 * (`./placement.ts`, from `block-body`, `chain-events` and, for the call arguments, `runtime-metadata`), has them
 * parsed once (`./parser.ts`: in this thread until task 12.3's ledger worker) with the ledger of `ledger-version`,
 * checks each parse names the kind the chain gave it (a regular transaction's bytes that the ledger reads as a system
 * transaction, or the reverse, refuse the block), and puts `block-parsed` ({@link BlockParsed}): the ledger version
 * and, per transaction, the ledger's plain data (`ParsedTransaction`: its index, hash, kind, size, bytes and segments,
 * Q49) with where the chain put it (its phase, extrinsic index and event index), frozen. A block without a transaction
 * loads no ledger package.
 *
 * **At `on-db-write`** one row per transaction (`design.md` §10): `core_block_parsed.transactions (height, tx_index) →
 * tx_hash, kind, size`, in one statement; append-only, range-partitioned by height.
 *
 * The declaration ({@link CORE_BLOCK_PARSED}) is a constant over the in-thread parser; a test's or a negative control's
 * build composes its own from {@link coreBlockParsedOnParse} with another parser or placement.
 */

import { z } from "zod";
import { UMBRADB_VERSION } from "../../config/build.js";
import type { BlockWriteHandle } from "../../db/api.js";
import type { ParsedTransaction } from "../../ledger/types.js";
import { type BlockContext, defineModule, type ItemSink } from "../../modules/declaration.js";
import { ledgerVersionOf } from "../core-block-commit/core-block-commit.js";
import type { BlockBody } from "../core-block-fetch/items.js";
import { chainEventsItemOf, metadataView, runtimeMetadataOf } from "../core-chain-events/core-chain-events.js";
import type { EventPhase } from "../core-chain-events/events.js";
import { heightPartitionsSql } from "../height-partitions.js";
import { inThreadParser, type TransactionParser } from "./parser.js";
import { placeTransactions } from "./placement.js";

/** The module's id. */
export const CORE_BLOCK_PARSED_ID = "core-block-parsed";

/** The `block` (and `table`) item it provides. */
export const BLOCK_PARSED_ITEM = "block-parsed";

/** Its table: one row per transaction. */
export const TRANSACTIONS_TABLE = "core_block_parsed.transactions";

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
  /** In application order (CD-5): `transactions[i].index` is `i`. */
  readonly transactions: readonly BlockTransaction[];
}

/** What {@link coreBlockParsedOnParse} parses and places with: the module's own unless a test gives others. */
export interface BlockParsedOptions {
  readonly parser?: TransactionParser;
  readonly place?: typeof placeTransactions;
}

/** `core-block-parsed`'s migrations (DB-9): applied once, recorded under `core-block-parsed`; never changed. */
export const CORE_BLOCK_PARSED_MIGRATIONS: readonly { readonly id: string; readonly sql: string }[] = Object.freeze([
  {
    id: "001",
    sql: `CREATE TABLE ${TRANSACTIONS_TABLE} (
  height bigint NOT NULL CHECK (height >= 0),
  tx_index bigint NOT NULL CHECK (tx_index >= 0),
  tx_hash bytea NOT NULL CHECK (octet_length(tx_hash) = 32),
  kind text NOT NULL CHECK (kind IN ('regular', 'system')),
  size integer NOT NULL CHECK (size > 0),
  PRIMARY KEY (height, tx_index)
) PARTITION BY RANGE (height);
${heightPartitionsSql(TRANSACTIONS_TABLE)}`,
  },
]);

const INSERT_SQL = `INSERT INTO ${TRANSACTIONS_TABLE} (height, tx_index, tx_hash, kind, size)
  SELECT $1::bigint, t.tx_index, t.tx_hash, t.kind, t.size
  FROM unnest($2::bigint[], $3::bytea[], $4::text[], $5::integer[]) AS t (tx_index, tx_hash, kind, size)`;

/** The parser of {@link CORE_BLOCK_PARSED}: in this thread, an adapter per ledger version loaded once per process. */
const PARSER = inThreadParser();

/** The `block-body` item of `b`; throws a `TypeError` when it has none. */
function blockBodyOf(b: BlockContext): BlockBody {
  const body = b.items.get("block-body") as Partial<BlockBody> | undefined;
  if (!Array.isArray(body?.extrinsics)) {
    throw new TypeError(
      `the block at height ${b.height} has no block-body item core-block-parsed can read: core-block-fetch puts it at ` +
        "on-fetch (CD-2)",
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
  );
  if (parsed.length !== placed.length) {
    throw new Error(`block ${b.height}: the parser gave ${parsed.length} transactions for ${placed.length}`);
  }
  const transactions = placed.map((transaction, index): BlockTransaction => {
    const plain = parsed[index] as ParsedTransaction;
    if (plain.kind !== transaction.kind) {
      throw new Error(
        `block ${b.height}: transaction ${index} is ${transaction.kind === "regular" ? "a regular" : "a system"} ` +
          `transaction on the chain, and the ledger ${ledger} reads its bytes as ${plain.kind === "regular" ? "a regular" : "a system"} one (CD-5)`,
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
      `the block at height ${b.height} has no block-parsed item ${module} can read: core-block-parsed puts it at on-parse (CD-5)`,
    );
  }
  return parsed as BlockParsed;
}

/** The rows of block `b`'s transactions, written in one statement (see the module comment). */
export async function writeTransactionRows(w: Pick<BlockWriteHandle, "execute">, b: BlockContext): Promise<void> {
  const { transactions } = blockParsedItemOf(b, CORE_BLOCK_PARSED_ID);
  if (transactions.length === 0) return;
  await w.execute(INSERT_SQL, [
    b.height,
    transactions.map((transaction) => BigInt(transaction.index)),
    transactions.map((transaction) => transaction.hash),
    transactions.map((transaction) => transaction.kind),
    transactions.map((transaction) => transaction.size),
  ]);
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
    async "on-parse"(_p, b, out) {
      await coreBlockParsedOnParse(b, out);
    },
    async "on-db-write"(_p, b, w) {
      await writeTransactionRows(w, b);
    },
  },
});
