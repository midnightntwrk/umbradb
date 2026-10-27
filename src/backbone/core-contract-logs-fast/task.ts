/**
 * `core-contract-logs-fast`'s ledger task (`openspec/changes/core-arch/specs/contract-data/spec.md` CC-3: it reads logs
 * "in a ledger task that does not need the state"; `specs/ledger/spec.md` LG-17; `design.md` §5.5; task 12.6): in the
 * ledger worker, on the block's one parse (`nativeTransaction` of the kept arrays, LG-7), each transaction's `log` sites
 * (`./transcripts.ts`) — none for a transaction that calls no contract (a system transaction has no intent), and none
 * on ledger v8, which has no MIP-0002 logs (owner decision Q54) —, plain data. Its result is the module's `block` item {@link CONTRACT_LOG_SITES_ITEM}, which the
 * module's `on-parse` reads. This file imports only what the task needs: the worker's entry loads it
 * (`../ledger-tasks.ts`).
 */

import type { LedgerTask, LedgerTaskBlock } from "../../ledger/types.js";
import { type LogSite, logSitesOf } from "./transcripts.js";

/** The module's id. */
export const CORE_CONTRACT_LOGS_FAST_ID = "core-contract-logs-fast";

/** The `block` item the task's result becomes: each transaction's `log` sites, in `block-parsed`'s order. */
export const CONTRACT_LOG_SITES_ITEM = "contract-log-sites";

/** The ledgers with no MIP-0002 logs (Q54). */
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
