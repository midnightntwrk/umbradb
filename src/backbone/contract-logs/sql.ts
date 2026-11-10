/**
 * The SQL of the shared item `contract-logs` (`./contract-logs.ts`): its schema and tables, its migrations, and the
 * statements its providers write each block's logs and unresolved log sites with.
 *
 * **The tables**, both append-only and range-partitioned by height, are keyed by `(height, tx_index, log_index)`, where
 * `log_index` is the number of the log site in the block (`./contract-logs.ts`):
 * - `contract_logs.logs` (migration `001`): one row per log. Each row holds the contract's address, the entry point,
 *   the logical segment, the log's version and event type, and its data in the ledger's tagged serialization.
 * - `contract_logs.unresolved` (migration `002`): one row per unresolved log site, which only `core-contract-logs-fast`
 *   writes. Each row holds the contract's address, the entry point, the reason, and where the site is in its
 *   transaction: its intent's segment, whether it is in the fallible section, the call's place among the intent's
 *   actions and the `log` op's place in the transcript's program.
 */

import type { BlockWriteHandle } from "../../db/api.js";
import type { LogEventType } from "../../ledger/types.js";
import { heightPartitionsSql } from "../height-partitions.js";
import type { ContractLog, UnresolvedLogSite } from "./contract-logs.js";

/** Its schema: the item's name with `-` replaced by `_`, as for every shared item. */
export const CONTRACT_LOGS_SCHEMA = "contract_logs";

/** Its table: one row per log. */
export const LOGS_TABLE = "contract_logs.logs";

/** Its table of unresolved log sites: one row per site `core-contract-logs-fast` cannot read exactly. */
export const UNRESOLVED_TABLE = "contract_logs.unresolved";

/** The event types of a MIP-0002 log, as the ledger names them. */
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

/**
 * Why a log site is unresolved (`./contract-logs.ts`):
 * - `not-a-literal`: the value it logs is not a literal the transcript pushes right before it (read from the
 *   contract's state, or computed);
 * - `conditional`: a branch or jump before it may skip it or its push;
 * - `partial-transaction`: it is in a fallible segment of a partially successful transaction, and the chain does not
 *   say which fallible segments failed.
 */
export const UNRESOLVED_REASONS = Object.freeze(["not-a-literal", "conditional", "partial-transaction"] as const);

/** One of {@link UNRESOLVED_REASONS}. */
export type UnresolvedReason = (typeof UNRESOLVED_REASONS)[number];

const types = LOG_EVENT_TYPES.map((type) => `'${type}'`).join(", ");
const reasons = UNRESOLVED_REASONS.map((reason) => `'${reason}'`).join(", ");

/**
 * The item's migrations, the same for both providers. They are recorded under the item's name, applied once and never
 * changed; `002` is applied at the next start of a database that has `001` only.
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
  {
    id: "002",
    sql: `CREATE TABLE ${UNRESOLVED_TABLE} (
  height bigint NOT NULL CHECK (height >= 0),
  tx_index bigint NOT NULL CHECK (tx_index >= 0),
  log_index bigint NOT NULL CHECK (log_index >= 0),
  contract_address bytea NOT NULL CHECK (octet_length(contract_address) = 32),
  entry_point bytea NOT NULL,
  reason text NOT NULL CHECK (reason IN (${reasons})),
  segment integer NOT NULL CHECK (segment >= 0 AND segment <= 65535),
  fallible boolean NOT NULL,
  call_index bigint NOT NULL CHECK (call_index >= 0),
  op_index bigint NOT NULL CHECK (op_index >= 0),
  PRIMARY KEY (height, tx_index, log_index)
) PARTITION BY RANGE (height);
${heightPartitionsSql(UNRESOLVED_TABLE)}`,
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

const INSERT_UNRESOLVED_SQL = `INSERT INTO ${UNRESOLVED_TABLE} (height, tx_index, log_index, contract_address, entry_point,
  reason, segment, fallible, call_index, op_index)
  SELECT $1::bigint, u.tx_index, u.log_index, u.contract_address, u.entry_point, u.reason, u.segment, u.fallible,
    u.call_index, u.op_index
  FROM unnest($2::bigint[], $3::bigint[], $4::bytea[], $5::bytea[], $6::text[], $7::integer[], $8::boolean[],
    $9::bigint[], $10::bigint[])
    AS u (tx_index, log_index, contract_address, entry_point, reason, segment, fallible, call_index, op_index)`;

/** Inserts `sites`, block `height`'s unresolved log sites, as rows of the unresolved table, in one statement. */
export async function insertUnresolvedRows(
  w: Pick<BlockWriteHandle, "execute">,
  height: bigint,
  sites: readonly UnresolvedLogSite[],
): Promise<void> {
  await w.execute(INSERT_UNRESOLVED_SQL, [
    height,
    sites.map((site) => BigInt(site.transaction)),
    sites.map((site) => BigInt(site.index)),
    sites.map((site) => site.address),
    sites.map((site) => site.entryPoint),
    sites.map((site) => site.reason),
    sites.map((site) => site.segment),
    sites.map((site) => site.fallible),
    sites.map((site) => BigInt(site.call)),
    sites.map((site) => BigInt(site.op)),
  ]);
}
