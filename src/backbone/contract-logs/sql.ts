/**
 * The SQL of the shared item `contract-logs` (`./contract-logs.ts`): its schema and table, its migration, and the
 * statement its providers write each block's logs with.
 *
 * **The table** `contract_logs.logs` has one row per log, keyed by `(height, tx_index, log_index)`, where `log_index`
 * is the log's number in the block. Each row holds the contract's address, the entry point, the logical segment, the
 * log's version and event type, and its data in the ledger's tagged serialization. The table is append-only and
 * range-partitioned by height. [design §10]
 */

import type { BlockWriteHandle } from "../../db/api.js";
import type { LogEventType } from "../../ledger/types.js";
import { heightPartitionsSql } from "../height-partitions.js";
import type { ContractLog } from "./contract-logs.js";

/** Its schema: the item's name with `-` replaced by `_`, as for every shared item. [DB-8, Q89] */
export const CONTRACT_LOGS_SCHEMA = "contract_logs";

/** Its table: one row per log. */
export const LOGS_TABLE = "contract_logs.logs";

/** The event types of a MIP-0002 log, as the ledger names them. [CC-2] */
export const LOG_EVENT_TYPES: readonly LogEventType[] = Object.freeze([
  "ShieldedSpend",
  "ShieldedReceive",
  "ShieldedMint",
  "ShieldedBurn",
  "UnshieldedSpend",
  "UnshieldedReceive",
  "UnshieldedMint",
  "UnshieldedBurn",
  "Paused",
  "Unpaused",
  "Misc",
] as const);

const types = LOG_EVENT_TYPES.map((type) => `'${type}'`).join(", ");

/**
 * The item's migrations, the same for both providers. They are recorded under the item's name, applied once and never
 * changed. [DB-8, DB-9]
 */
export const CONTRACT_LOGS_MIGRATIONS: readonly { readonly id: string; readonly sql: string }[] = Object.freeze([
  {
    id: "001",
    sql: `CREATE TABLE ${LOGS_TABLE} (
  height bigint NOT NULL CHECK (height >= 0),
  tx_index bigint NOT NULL CHECK (tx_index >= 0),
  log_index bigint NOT NULL CHECK (log_index >= 0),
  contract_address bytea NOT NULL CHECK (octet_length(contract_address) = 32),
  entry_point bytea NOT NULL,
  logical_segment integer NOT NULL CHECK (logical_segment >= 0),
  log_version bigint NOT NULL CHECK (log_version >= 0 AND log_version <= 4294967295),
  event_type text NOT NULL CHECK (event_type IN (${types})),
  data bytea NOT NULL,
  PRIMARY KEY (height, tx_index, log_index)
) PARTITION BY RANGE (height);
${heightPartitionsSql(LOGS_TABLE)}`,
  },
]);

const INSERT_SQL = `INSERT INTO ${LOGS_TABLE} (height, tx_index, log_index, contract_address, entry_point, logical_segment,
  log_version, event_type, data)
  SELECT $1::bigint, l.tx_index, l.log_index, l.contract_address, l.entry_point, l.logical_segment, l.log_version,
    l.event_type, l.data
  FROM unnest($2::bigint[], $3::bigint[], $4::bytea[], $5::bytea[], $6::integer[], $7::bigint[], $8::text[], $9::bytea[])
    AS l (tx_index, log_index, contract_address, entry_point, logical_segment, log_version, event_type, data)`;

/** Inserts `logs`, block `height`'s, as rows of the logs table, in one statement. */
export async function insertLogRows(
  w: Pick<BlockWriteHandle, "execute">,
  height: bigint,
  logs: readonly ContractLog[],
): Promise<void> {
  await w.execute(INSERT_SQL, [
    height,
    logs.map((log) => BigInt(log.transaction)),
    logs.map((log) => BigInt(log.index)),
    logs.map((log) => log.address),
    logs.map((log) => log.entryPoint),
    logs.map((log) => log.logicalSegment),
    logs.map((log) => BigInt(log.version)),
    logs.map((log) => log.eventType),
    logs.map((log) => log.data),
  ]);
}
