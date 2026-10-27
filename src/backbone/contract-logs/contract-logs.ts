/**
 * The shared item `contract-logs` (`openspec/changes/core-arch/specs/contract-data/spec.md` CC-2 to CC-4,
 * `specs/database/spec.md` DB-8, `specs/modules/spec.md` MD-6; `design.md` §10; CORE-ARCH §4.7, §4.11; decision record
 * Q19, Q20, Q21, Q89; task 13.1): the MIP-0002 events of a block — the contract logs of the applied segments, as the
 * ledger emits them — that its two providers give alike, `core-contract-logs-full` (from the full apply's `vm-logs`)
 * and the development-only `core-contract-logs-fast` (from the transcripts, without state, or a halt). At most one of
 * them is active at a height (MD-6); one may stop at a height and the other start at the next (CC-4), a database
 * restored from a backup taken with `-full` and continued with `-fast` among them, with no schema change.
 *
 * **The item is shared** (DB-8, Q89): both providers declare it in its own schema, `contract_logs` (the item's name with
 * `-` → `_`), with the same `table` declaration and the same migrations ({@link CONTRACT_LOGS_MIGRATIONS}), which the
 * database API records under the item's name and runs once, under the item's role `umbradb_i_contract_logs`, under
 * which the provider active at each height writes. Both providers take their declaration of it from here
 * ({@link contractLogsItem}), so they cannot differ (`shared-item-migrations-differ` otherwise).
 *
 * **The `block` item** is a frozen array of {@link ContractLog}, in emission order — the order the ledger emitted the
 * logs, `index` numbering them in the block from 0 —, put by `-full` at `on-compute` and by `-fast` at `on-parse`; a
 * module requiring `contract-logs` reads it from `on-compute` on, whichever provider is active.
 *
 * **The table** `contract_logs.logs` (`design.md` §10): one row per log, keyed by `(height, tx_index, log_index)` —
 * `log_index` the log's number in the block —, with the contract's address, the entry point, the logical segment, the
 * log's version and event type, and its data in the ledger's tagged serialization; append-only, range-partitioned by
 * height. Ledger v8 has no MIP-0002 events (owner decision Q54): no v8 block has a row.
 */

import type { BlockWriteHandle } from "../../db/api.js";
import type { LogEventType } from "../../ledger/types.js";
import type { BlockContext, ItemDeclaration } from "../../modules/declaration.js";
import { heightPartitionsSql } from "../height-partitions.js";

/** The item both providers give (Q20). */
export const CONTRACT_LOGS_ITEM = "contract-logs";

/** Its schema: the item's name with `-` → `_` (a shared item's, DB-8, Q89). */
export const CONTRACT_LOGS_SCHEMA = "contract_logs";

/** Its table: one row per log. */
export const LOGS_TABLE = "contract_logs.logs";

/** The event types of a MIP-0002 log, as the ledger names them (`specs/contract-data/spec.md`'s list). */
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
 * The item's migrations (DB-9), the same for both providers (DB-8: recorded under the item's name, run once): applied
 * once, never changed.
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

/** A MIP-0002 event of a block: a contract log of an applied segment, as both providers give it. */
export interface ContractLog {
  /** The index of its transaction in the block (`block-parsed`'s order, CD-5). */
  readonly transaction: number;
  /** Its number in the block, in emission order, from 0. */
  readonly index: number;
  /** The contract that logged it (32 bytes). */
  readonly address: Uint8Array;
  /** The entry point of the call that logged it, as bytes. */
  readonly entryPoint: Uint8Array;
  /** The logical segment of the ledger's event source (`ledger/src/events.rs` `EventSource`). */
  readonly logicalSegment: number;
  /** The MIP-0002 version (a `u32`). */
  readonly version: number;
  readonly eventType: LogEventType;
  /** The logged data in the ledger's tagged serialization. */
  readonly data: Uint8Array;
}

/**
 * The `table` and `block` declaration of the item, the same for both providers (see the module comment): append-only,
 * in the item's schema.
 */
export function contractLogsItem(): ItemDeclaration {
  return {
    name: CONTRACT_LOGS_ITEM,
    lifetimes: ["block", "table"],
    table: { schema: CONTRACT_LOGS_SCHEMA, tables: ["logs"], kind: "append-only" },
  };
}

/** The migrations as a declaration takes them: new objects, the same ids and SQL. */
export function contractLogsMigrations(): { id: string; sql: string }[] {
  return CONTRACT_LOGS_MIGRATIONS.map(({ id, sql }) => ({ id, sql }));
}

/** `logs` frozen, each log frozen, as the `block` item is put. */
export function frozenLogs(logs: readonly ContractLog[]): readonly ContractLog[] {
  return Object.freeze(logs.map((log) => Object.freeze({ ...log })));
}

/** The `contract-logs` item of `b`; throws a `TypeError` naming `module` when it has none. */
export function contractLogsItemOf(b: BlockContext, module: string): readonly ContractLog[] {
  const logs = b.items.get(CONTRACT_LOGS_ITEM);
  if (!Array.isArray(logs)) {
    throw new TypeError(
      `the block at height ${b.height} has no contract-logs item ${module} can read: its provider puts it before ` +
        "on-db-write (core-contract-logs-full at on-compute, core-contract-logs-fast at on-parse; CC-2, CC-3)",
    );
  }
  return logs as readonly ContractLog[];
}

const INSERT_SQL = `INSERT INTO ${LOGS_TABLE} (height, tx_index, log_index, contract_address, entry_point, logical_segment,
  log_version, event_type, data)
  SELECT $1::bigint, l.tx_index, l.log_index, l.contract_address, l.entry_point, l.logical_segment, l.log_version,
    l.event_type, l.data
  FROM unnest($2::bigint[], $3::bigint[], $4::bytea[], $5::bytea[], $6::integer[], $7::bigint[], $8::text[], $9::bytea[])
    AS l (tx_index, log_index, contract_address, entry_point, logical_segment, log_version, event_type, data)`;

/** Writes `logs`, block `height`'s, as rows of `contract_logs.logs`, in one statement; none for no logs. */
export async function writeLogRows(
  w: Pick<BlockWriteHandle, "execute">,
  height: bigint,
  logs: readonly ContractLog[],
): Promise<void> {
  if (logs.length === 0) return;
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
