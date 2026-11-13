/**
 * The shared item `contract-logs`: the MIP-0002 events of a block, that is, the contract logs of the applied segments,
 * as the ledger emits them. Its two providers give it alike:
 * - `core-contract-logs-full`, from the full apply's `vm-logs`;
 * - the development-only `core-contract-logs-fast`, from the transcripts, without state. A log site it cannot read
 *   exactly is an **unresolved site** instead of a log.
 *
 * At most one of them is active at a height. One may stop at a height and the other start at the next, with no schema
 * change; for example, a database restored from a backup taken with `-full` may be continued with `-fast`.
 *
 * **The item is shared.** Both providers declare it in its own schema, `contract_logs` (the item's name with `-`
 * replaced by `_`), with the same `table` declaration and the same migrations (`CONTRACT_LOGS_MIGRATIONS`, in
 * `./sql.ts`). The database API records them under the item's name and runs them once, under the item's role
 * `umbradb_i_contract_logs`; the provider active at each height writes under that role. Both providers take their
 * declaration from here ({@link contractLogsItem}), so they cannot differ (which would be
 * `shared-item-migrations-differ`).
 *
 * **The `block` item** ({@link ContractLogsBlock}) holds the block's logs and its unresolved sites, each a frozen array
 * in emission order. Both are numbered by one count in the block from 0 (`index`): every log site of an applied part
 * takes the next number, whether it gives a log or is unresolved; a site that gives no log (a literal over the
 * emitted-log bound) takes none. So the logs of a block without unresolved sites are numbered as the ledger emits them,
 * and in a block with some, every log keeps the place its site gives it. `-full` puts the item at `on-compute`, with
 * no unresolved sites, and `-fast` at `on-parse`, so a module requiring `contract-logs` can read it from `on-compute`
 * on, whichever provider is active: the logs with {@link contractLogsItemOf}, the sites with
 * {@link unresolvedLogSitesOf}.
 *
 * **The tables** and every statement are in `./sql.ts`: `logs`, and `unresolved`, which only `-fast` writes.
 *
 * Ledger v8 has no MIP-0002 events, so no v8 block has a row in either.
 */

import type { BlockWriteHandle } from "../../db/api.js";
import type { LogEventType } from "../../ledger/types.js";
import type { BlockContext, ItemDeclaration } from "../../modules/declaration.js";
import {
  CONTRACT_LOGS_MIGRATIONS,
  CONTRACT_LOGS_SCHEMA,
  insertLogRows,
  insertUnresolvedRows,
  type UnresolvedReason,
} from "./sql.js";

/** The item both providers give. */
export const CONTRACT_LOGS_ITEM = "contract-logs";

/** A MIP-0002 event of a block: a contract log of an applied segment, as both providers give it. */
export interface ContractLog {
  /** The index of its transaction in the block, in `block-parsed`'s order. */
  readonly transaction: number;
  /** Its number in the block, in emission order, from 0 (see the module comment). */
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
 * A log site `core-contract-logs-fast` cannot read exactly: a `log` op of a call's transcript whose log, if any, is not
 * known from the transcript and the chain alone. It is never a log, and nothing is guessed for it.
 */
export interface UnresolvedLogSite {
  /** The index of its transaction in the block, in `block-parsed`'s order. */
  readonly transaction: number;
  /** Its number in the block, from 0, counted with the logs (see the module comment). */
  readonly index: number;
  /** The called contract (32 bytes). */
  readonly address: Uint8Array;
  /** The call's entry point, as bytes. */
  readonly entryPoint: Uint8Array;
  readonly reason: UnresolvedReason;
  /** The segment of the call's intent. */
  readonly segment: number;
  /** True for a site of the call's fallible transcript. */
  readonly fallible: boolean;
  /** The call's place among its intent's actions. */
  readonly call: number;
  /** The `log` op's place in the transcript's program. */
  readonly op: number;
}

/** The `block` item: a block's logs and its unresolved log sites (see the module comment). */
export interface ContractLogsBlock {
  readonly logs: readonly ContractLog[];
  readonly unresolved: readonly UnresolvedLogSite[];
}

/**
 * The `table` and `block` declaration of the item, the same for both providers (see the module comment): append-only,
 * in the item's schema.
 */
export function contractLogsItem(): ItemDeclaration {
  return {
    name: CONTRACT_LOGS_ITEM,
    lifetimes: ["block", "table"],
    table: { schema: CONTRACT_LOGS_SCHEMA, tables: ["logs", "unresolved"], kind: "append-only" },
  };
}

/** The migrations as a declaration takes them: new objects, the same ids and SQL. */
export function contractLogsMigrations(): { id: string; sql: string }[] {
  return CONTRACT_LOGS_MIGRATIONS.map(({ id, sql }) => ({ id, sql }));
}

/** The `block` item of `logs` and `unresolved`, frozen through, as a provider puts it. */
export function contractLogsBlock(logs: readonly ContractLog[], unresolved: readonly UnresolvedLogSite[] = []): ContractLogsBlock {
  return Object.freeze({
    logs: Object.freeze(logs.map((log) => Object.freeze({ ...log }))),
    unresolved: Object.freeze(unresolved.map((site) => Object.freeze({ ...site }))),
  });
}

/** The `contract-logs` item of `b`; throws a `TypeError` naming `module` when it has none. */
function blockItemOf(b: BlockContext, module: string): ContractLogsBlock {
  const item = b.items.get(CONTRACT_LOGS_ITEM) as Partial<ContractLogsBlock> | undefined;
  if (item === undefined || item === null || !Array.isArray(item.logs) || !Array.isArray(item.unresolved)) {
    throw new TypeError(
      `the block at height ${b.height} has no contract-logs item ${module} can read: its provider puts it before ` +
        "on-db-write (core-contract-logs-full at on-compute, core-contract-logs-fast at on-parse)",
    );
  }
  return item as ContractLogsBlock;
}

/** The logs of `b`'s `contract-logs` item; throws a `TypeError` naming `module` when it has none. */
export function contractLogsItemOf(b: BlockContext, module: string): readonly ContractLog[] {
  return blockItemOf(b, module).logs;
}

/** The unresolved log sites of `b`'s `contract-logs` item; throws a `TypeError` naming `module` when it has none. */
export function unresolvedLogSitesOf(b: BlockContext, module: string): readonly UnresolvedLogSite[] {
  return blockItemOf(b, module).unresolved;
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

/**
 * Writes `sites`, block `height`'s unresolved log sites, as rows of `contract_logs.unresolved`, in one statement; none
 * for no sites.
 */
export async function writeUnresolvedRows(
  w: Pick<BlockWriteHandle, "execute">,
  height: bigint,
  sites: readonly UnresolvedLogSite[],
): Promise<void> {
  if (sites.length === 0) return;
  await insertUnresolvedRows(w, height, sites);
}
