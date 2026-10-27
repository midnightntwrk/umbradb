/**
 * The ledger tasks of UmbraDB's core modules (`openspec/changes/core-arch/specs/ledger/spec.md` LG-17;
 * `design.md` §5.5; task 12.6), as the ledger worker's entry gives them to `runLedgerWorker`
 * (`src/ledger/worker/entry.ts`): each core module that declares ledger tasks, by its id and its tasks — the very task
 * objects its declaration holds, from a file that imports no more than the task needs, so the worker loads none of
 * the module's main-thread code. A host's own ledger worker entry passes these with its own modules.
 */

import { CONTRACT_LOG_SITES_TASK, CORE_CONTRACT_LOGS_FAST_ID } from "./core-contract-logs-fast/task.js";
import type { LedgerWorkerModule } from "../ledger/worker/engine.js";

/** UmbraDB's core modules that declare ledger tasks, with their tasks (see the module comment). */
export const CORE_LEDGER_TASK_MODULES: readonly LedgerWorkerModule[] = Object.freeze([
  Object.freeze({ id: CORE_CONTRACT_LOGS_FAST_ID, ledgerTasks: Object.freeze([CONTRACT_LOG_SITES_TASK]) }),
]);
