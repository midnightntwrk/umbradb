/**
 * The SQL of `core-block-parsed` (`./core-block-parsed.ts`): its table, its migration, and the statement it writes each
 * block's transactions with.
 *
 * **The table** `core_block_parsed.transactions (height, tx_index) → tx_hash, kind, size` has one row per
 * transaction. It is append-only and range-partitioned by height (`../height-partitions.ts`). [design §10]
 */

import type { BlockWriteHandle } from "../../db/api.js";
import type { ParsedTransaction } from "../../ledger/types.js";
import { heightPartitionsSql } from "../height-partitions.js";

/** Its table: one row per transaction. */
export const TRANSACTIONS_TABLE = "core_block_parsed.transactions";

/** `core-block-parsed`'s migrations: applied once and recorded under `core-block-parsed`; they never change. [DB-9] */
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

/** Inserts `transactions`, block `height`'s, as rows of the transactions table, in one statement. */
export async function insertTransactionRows(
  w: Pick<BlockWriteHandle, "execute">,
  height: bigint,
  transactions: readonly ParsedTransaction[],
): Promise<void> {
  await w.execute(INSERT_SQL, [
    height,
    transactions.map((transaction) => BigInt(transaction.index)),
    transactions.map((transaction) => transaction.hash),
    transactions.map((transaction) => transaction.kind),
    transactions.map((transaction) => transaction.size),
  ]);
}
