/**
 * The SQL of `core-tx-results` (`./core-tx-results.ts`): its table, its migration, and the statement it writes each
 * block's outcomes with.
 *
 * **The table** `core_tx_results.results (height, tx_index) → outcome` has one row per transaction, its outcome one
 * of `success`, `partial` and `failure` (a `CHECK`). It is append-only and range-partitioned by height
 * (`../height-partitions.ts`). [CD-6; design §10]
 */

import type { BlockWriteHandle } from "../../db/api.js";
import type { ChainOutcome } from "../../ledger/types.js";
import { heightPartitionsSql } from "../height-partitions.js";

/** Its table: one row per transaction. */
export const RESULTS_TABLE = "core_tx_results.results";

/** `core-tx-results`' migrations: applied once, recorded under `core-tx-results`, never changed. [DB-9] */
export const CORE_TX_RESULTS_MIGRATIONS: readonly { readonly id: string; readonly sql: string }[] = Object.freeze([
  {
    id: "001",
    sql: `CREATE TABLE ${RESULTS_TABLE} (
  height bigint NOT NULL CHECK (height >= 0),
  tx_index bigint NOT NULL CHECK (tx_index >= 0),
  outcome text NOT NULL CHECK (outcome IN ('success', 'partial', 'failure')),
  PRIMARY KEY (height, tx_index)
) PARTITION BY RANGE (height);
${heightPartitionsSql(RESULTS_TABLE)}`,
  },
]);

const INSERT_SQL = `INSERT INTO ${RESULTS_TABLE} (height, tx_index, outcome)
  SELECT $1::bigint, r.tx_index, r.outcome FROM unnest($2::bigint[], $3::text[]) AS r (tx_index, outcome)`;

/** Inserts `results`, block `height`'s in transaction order, in one statement: `results[i]` as `tx_index` i. */
export async function insertResultRows(
  w: Pick<BlockWriteHandle, "execute">,
  height: bigint,
  results: readonly ChainOutcome[],
): Promise<void> {
  await w.execute(INSERT_SQL, [height, results.map((_outcome, index) => BigInt(index)), [...results]]);
}
