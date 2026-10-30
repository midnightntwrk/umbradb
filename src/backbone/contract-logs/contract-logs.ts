/**
 * The shared item `contract-logs`: the MIP-0002 events of a block, that is, the contract logs of the applied segments,
 * as the ledger emits them. Its two providers give it alike:
 * - `core-contract-logs-full`, from the full apply's `vm-logs`;
 * - the development-only `core-contract-logs-fast`, from the transcripts, without state, or else a halt.
 *
 * [CC-2, CC-3, Q19, Q20, Q21; CORE-ARCH §4.7, §4.11]
 *
 * At most one of them is active at a height. One may stop at a height and the other start at the next, with no schema
 * change; for example, a database restored from a backup taken with `-full` may be continued with `-fast`.
 * [MD-6, CC-4]
 *
 * **The item is shared.** Both providers declare it in its own schema, `contract_logs` (the item's name with `-`
 * replaced by `_`), with the same `table` declaration and the same migrations (`CONTRACT_LOGS_MIGRATIONS`, in
 * `./sql.ts`). The database API records them under the item's name and runs them once, under the item's role
 * `umbradb_i_contract_logs`; the provider active at each height writes under that role. Both providers take their
 * declaration from here ({@link contractLogsItem}), so they cannot differ (which would be
 * `shared-item-migrations-differ`). [DB-8, Q89]
 *
 * **The `block` item** is a frozen array of {@link ContractLog} in emission order: the order the ledger emitted the
 * logs, with `index` numbering them in the block from 0. `-full` puts it at `on-compute` and `-fast` at `on-parse`, so a
 * module requiring `contract-logs` can read it from `on-compute` on, whichever provider is active.
 *
 * **The table** and every statement are in `./sql.ts`.
 *
 * Ledger v8 has no MIP-0002 events, so no v8 block has a row. [Q54]
 */

import type { BlockWriteHandle } from "../../db/api.js";
import type { LogEventType } from "../../ledger/types.js";
import type { BlockContext, ItemDeclaration } from "../../modules/declaration.js";
import { CONTRACT_LOGS_MIGRATIONS, CONTRACT_LOGS_SCHEMA, insertLogRows } from "./sql.js";

/** The item both providers give. [Q20] */
export const CONTRACT_LOGS_ITEM = "contract-logs";

/** A MIP-0002 event of a block: a contract log of an applied segment, as both providers give it. */
export interface ContractLog {
  /** The index of its transaction in the block, in `block-parsed`'s order. [CD-5] */
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
        "on-db-write (core-contract-logs-full at on-compute, core-contract-logs-fast at on-parse)",
    );
  }
  return logs as readonly ContractLog[];
}

/** Writes `logs`, block `height`'s, as rows of `contract_logs.logs`, in one statement; none for no logs. */
export async function writeLogRows(
  w: Pick<BlockWriteHandle, "execute">,
  height: bigint,
  logs: readonly ContractLog[],
): Promise<void> {
  if (logs.length === 0) return;
  await insertLogRows(w, height, logs);
}
