/**
 * `core-contract-logs-fast`'s ledger task, which reads the logs without needing the ledger state. It runs in the ledger
 * worker on the block's one parse (`nativeTransaction` of the kept arrays) and gives each transaction's `log` sites
 * (`./transcripts.ts`) as plain data. [CC-3, LG-7, LG-17; design §5.5]
 *
 * A transaction that calls no contract has no sites (a system transaction has no intent), and neither does any
 * transaction on ledger v8, which has no MIP-0002 logs. [Q54]
 *
 * The task's result is the module's `block` item {@link CONTRACT_LOG_SITES_ITEM}, which the module's `on-parse` reads.
 * This file imports only what the task needs, because the worker's entry loads it (`../ledger-tasks.ts`).
 */

import type { LedgerTask, LedgerTaskBlock } from "../../ledger/types.js";
import { type LogSite, logSitesOf } from "./transcripts.js";

/** The module's id. */
export const CORE_CONTRACT_LOGS_FAST_ID = "core-contract-logs-fast";

/** The `block` item the task's result becomes: each transaction's `log` sites, in `block-parsed`'s order. */
export const CONTRACT_LOG_SITES_ITEM = "contract-log-sites";

/** The ledgers with no MIP-0002 logs. [Q54] */
export const LEDGERS_WITHOUT_LOGS: readonly string[] = Object.freeze(["v8"]);

/** The task (see the module comment). */
export const CONTRACT_LOG_SITES_TASK: LedgerTask = Object.freeze({
  name: CONTRACT_LOG_SITES_ITEM,
  needsState: false,
  run({ ledger, transactions, packages }: LedgerTaskBlock): readonly (readonly LogSite[])[] {
    if (LEDGERS_WITHOUT_LOGS.includes(ledger)) return transactions.map(() => []);
    return transactions.map((transaction) => logSitesOf(transaction, packages));
  },
});
