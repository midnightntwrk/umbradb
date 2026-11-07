/**
 * The core module `core-tx-results`: each transaction's outcome as the chain recorded it (`success`, `partial` or
 * `failure`), as the `block` item `tx-results` and as one row per transaction in `core_tx_results.results`. It is off
 * by default and may start mid-chain. [CD-6; CORE-ARCH §4.11; design §10]
 *
 * Which segments failed is not recorded here: the chain's event for a partial success carries only the transaction
 * hash, so segment results come from `core-ledger-state`. [Q19]
 *
 * **The outcome** of a transaction ({@link outcomeOf}) is read from the chain event that placed it in `block-parsed`:
 * its `eventIndex` into `chain-events` (`src/backbone/core-block-parsed/placement.ts`), matched to its extrinsic by the
 * event's phase. It is read the way the official indexer reads it (`midnight-indexer`
 * `chain-indexer/src/infra/subxt_node/runtimes/v2_1_0.rs`, `EventExt::outcome`, `SystemTransaction::transaction`):
 * [CD-6]
 *
 * | Event | Outcome |
 * |---|---|
 * | `Midnight::TxApplied` | `success` |
 * | `Midnight::TxPartialSuccess` | `partial` |
 * | `System::ExtrinsicFailed` | `failure` |
 * | `MidnightSystem::SystemTransactionApplied` | `success` |
 *
 * Block 0 has no events: every transaction of its body is `success`, just as the official indexer treats the genesis
 * transactions as all applied (`genesis_transactions`).
 *
 * **The item** `tx-results` holds the outcomes in transaction order: `tx-results[i]` belongs to
 * `block-parsed.transactions[i]`. It is a frozen array of `ChainOutcome` (`src/ledger/types.ts`), exactly what the
 * ledger's `apply` takes as `ApplyInput.outcomes`, so `core-ledger-state` passes it on unchanged.
 *
 * **At `on-db-write`** it writes one row per transaction, in one statement. **The table** and every statement are in
 * `./sql.ts`.
 */

import { z } from "zod";
import { UMBRADB_VERSION } from "../../config/build.js";
import type { BlockWriteHandle } from "../../db/api.js";
import type { ChainOutcome } from "../../ledger/types.js";
import { type BlockContext, defineModule, type ItemSink } from "../../modules/declaration.js";
import { type BlockTransaction, blockParsedItemOf } from "../core-block-parsed/core-block-parsed.js";
import { MIDNIGHT, MIDNIGHT_SYSTEM, SYSTEM } from "../core-block-parsed/placement.js";
import { chainEventsItemOf } from "../core-chain-events/core-chain-events.js";
import type { ChainEvent } from "../core-chain-events/events.js";
import { CORE_TX_RESULTS_MIGRATIONS, insertResultRows } from "./sql.js";

/** The module's id. */
export const CORE_TX_RESULTS_ID = "core-tx-results";

/** The `block` (and `table`) item it provides. */
export const TX_RESULTS_ITEM = "tx-results";

/** The outcome each event gives the transaction it placed, by `<pallet>::<event>` (see the module comment). */
export const OUTCOMES: Readonly<Record<string, ChainOutcome>> = Object.freeze({
  [`${MIDNIGHT.pallet}::${MIDNIGHT.applied}`]: "success",
  [`${MIDNIGHT.pallet}::${MIDNIGHT.partial}`]: "partial",
  [`${SYSTEM.pallet}::${SYSTEM.failed}`]: "failure",
  [`${MIDNIGHT_SYSTEM.pallet}::${MIDNIGHT_SYSTEM.applied}`]: "success",
});

/**
 * The outcome of `transaction` of block `height`, from the event of `events` that placed it (see the module comment);
 * throws when that event is missing or gives no outcome.
 */
export function outcomeOf(height: bigint, transaction: BlockTransaction, events: readonly ChainEvent[]): ChainOutcome {
  if (transaction.eventIndex === null) {
    if (height === 0n) return "success";
    throw new Error(`block ${height}: transaction ${transaction.index} names no chain event, as only block 0's may`);
  }
  // `chain-events[i]` is the block's event i (core-chain-events numbers them by their place).
  const event = events[transaction.eventIndex];
  const outcome = event === undefined ? undefined : OUTCOMES[`${event.pallet}::${event.name}`];
  if (outcome === undefined) {
    throw new Error(
      `block ${height}: transaction ${transaction.index} names the chain event ${transaction.eventIndex}, ` +
        `${event === undefined ? "which the block does not have" : `${event.pallet}::${event.name}, which gives no outcome`}`,
    );
  }
  return outcome;
}

/** Block `b`'s `tx-results`: one outcome per transaction of `block-parsed`, in its order (see the module comment). */
export function txResultsOf(b: BlockContext): readonly ChainOutcome[] {
  const { transactions } = blockParsedItemOf(b, CORE_TX_RESULTS_ID);
  const events = chainEventsItemOf(b, CORE_TX_RESULTS_ID);
  return Object.freeze(transactions.map((transaction) => outcomeOf(b.height, transaction, events)));
}

/** `core-tx-results`' `on-parse`: puts {@link txResultsOf}'s item. */
export async function coreTxResultsOnParse(b: BlockContext, out: ItemSink): Promise<void> {
  out.put(TX_RESULTS_ITEM, txResultsOf(b));
}

/** The `tx-results` item of `b`; throws a `TypeError` when it has none. */
export function txResultsItemOf(b: BlockContext): readonly ChainOutcome[] {
  const results = b.items.get(TX_RESULTS_ITEM);
  if (!Array.isArray(results)) {
    throw new TypeError(
      `the block at height ${b.height} has no tx-results item core-tx-results can write: it puts it at on-parse`,
    );
  }
  return results as readonly ChainOutcome[];
}

/** The rows of block `b`'s outcomes, written in one statement (see the module comment). */
export async function writeResultRows(w: Pick<BlockWriteHandle, "execute">, b: BlockContext): Promise<void> {
  const results = txResultsItemOf(b);
  if (results.length === 0) return;
  await insertResultRows(w, b.height, results);
}

/**
 * `core-tx-results` (see the module comment): a core module that requires `chain-events` and `block-parsed` and
 * provides `tx-results`, a `block` item and its table.
 */
export const CORE_TX_RESULTS = defineModule({
  id: CORE_TX_RESULTS_ID,
  version: UMBRADB_VERSION,
  side: "public",
  requires: ["chain-events", "block-parsed"],
  provides: [
    {
      name: TX_RESULTS_ITEM,
      lifetimes: ["block", "table"],
      table: { schema: "core_tx_results", tables: ["results"], kind: "append-only" },
    },
  ],
  startsMidChain: true,
  configSchema: z.object({}),
  migrations: CORE_TX_RESULTS_MIGRATIONS.map(({ id, sql }) => ({ id, sql })),
  points: {
    async "on-parse"(_p, b, out) {
      await coreTxResultsOnParse(b, out);
    },
    async "on-db-write"(_p, b, w) {
      await writeResultRows(w, b);
    },
  },
});
