/**
 * The core module `core-contract-logs-full` (`openspec/changes/core-arch/specs/contract-data/spec.md` CC-2, CC-4;
 * `design.md` §10; CORE-ARCH §4.11; decision record Q19 option A, Q20, Q54; task 13.1): the MIP-0002 events of every
 * block exactly as the ledger emitted them while applying it — `core-ledger-state`'s `vm-logs`, the contract logs of
 * the applied segments only, so none of a fallible segment that failed —, as the shared item `contract-logs`
 * (`../contract-logs/`) and its table `contract_logs.logs`. Off by default; it cannot start mid-chain, as the ledger
 * state it needs cannot (LG-16). Ledger v8's adapter reports no logs (Q54), so no v8 block has a row.
 *
 * **At `on-compute`** (after `core-ledger-state`'s, whose `vm-logs` it requires) it puts `contract-logs`: each `VmLog`
 * of the block as a {@link ContractLog} — its transaction, its number in the block, the contract, the entry point, the
 * logical segment, the version, the event type and the data, as the ledger gave them; the physical segment is not part
 * of the item or its table (`design.md` §10). **At `on-db-write`** it writes them, one row each, in one statement.
 *
 * The declaration ({@link CORE_CONTRACT_LOGS_FULL}) is a constant over its rule; a negative control's build composes its
 * own with {@link coreContractLogsFull}, the logs taken another way.
 */

import { z } from "zod";
import { UMBRADB_VERSION } from "../../config/build.js";
import type { VmLog } from "../../ledger/types.js";
import { type BlockContext, defineModule, type ModuleDeclaration } from "../../modules/declaration.js";
import {
  type ContractLog,
  contractLogsItem,
  contractLogsItemOf,
  contractLogsMigrations,
  CONTRACT_LOGS_ITEM,
  frozenLogs,
  writeLogRows,
} from "../contract-logs/contract-logs.js";
import { VM_LOGS_ITEM } from "../core-ledger-state/core-ledger-state.js";

/** The module's id. */
export const CORE_CONTRACT_LOGS_FULL_ID = "core-contract-logs-full";

/** The `vm-logs` item of `b` (`core-ledger-state`'s, LG-16); throws a `TypeError` when it has none. */
export function vmLogsItemOf(b: BlockContext): readonly VmLog[] {
  const logs = b.items.get(VM_LOGS_ITEM);
  if (!Array.isArray(logs)) {
    throw new TypeError(
      `the block at height ${b.height} has no vm-logs item ${CORE_CONTRACT_LOGS_FULL_ID} can read: core-ledger-state puts ` +
        "it at on-compute (LG-16)",
    );
  }
  return logs as readonly VmLog[];
}

/** Block `b`'s logs: its `vm-logs`, each as a {@link ContractLog} (see the module comment). */
export function fullLogsOf(b: BlockContext): readonly ContractLog[] {
  return vmLogsItemOf(b).map((log) => ({
    transaction: log.transaction,
    index: log.index,
    address: log.address,
    entryPoint: log.entryPoint,
    logicalSegment: log.logicalSegment,
    version: log.version,
    eventType: log.eventType,
    data: log.data,
  }));
}

/** The rule a negative control may replace (see the module comment). */
export interface CoreContractLogsFullOptions {
  /** CC-2: the block's logs; {@link fullLogsOf}, the ledger's `vm-logs`. */
  readonly logsOf?: (b: BlockContext) => readonly ContractLog[] | Promise<readonly ContractLog[]>;
}

/**
 * `core-contract-logs-full` with `options`' rule (see the module comment): a core module that requires `vm-logs`
 * (`core-ledger-state`'s), provides the shared `contract-logs` and cannot start mid-chain.
 */
export function coreContractLogsFull(options: CoreContractLogsFullOptions = {}): ModuleDeclaration {
  return defineModule({
    id: CORE_CONTRACT_LOGS_FULL_ID,
    version: UMBRADB_VERSION,
    side: "public",
    requires: [VM_LOGS_ITEM],
    provides: [contractLogsItem()],
    startsMidChain: false,
    configSchema: z.object({}),
    migrations: contractLogsMigrations(),
    points: {
      async "on-compute"(_p, b, _read, out) {
        out.put(CONTRACT_LOGS_ITEM, frozenLogs(await (options.logsOf ?? fullLogsOf)(b)));
      },
      async "on-db-write"(_p, b, w) {
        await writeLogRows(w, b.height, contractLogsItemOf(b, CORE_CONTRACT_LOGS_FULL_ID));
      },
    },
  });
}

/** `core-contract-logs-full` (see the module comment). */
export const CORE_CONTRACT_LOGS_FULL = coreContractLogsFull();
