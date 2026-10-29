/**
 * The ledger tasks of UmbraDB's core modules, in the form the ledger worker's entry passes them to `runLedgerWorker`
 * (`src/ledger/worker/entry.ts`): each core module that declares ledger tasks, with its id and its tasks. These are the
 * same task objects the module's declaration holds, taken from a file that imports only what the task needs, so the
 * worker loads none of the module's main-thread code. A host's own ledger worker entry passes these along with its own
 * modules. [LG-17; design §5.5]
 */

import { CONTRACT_LOG_SITES_TASK, CORE_CONTRACT_LOGS_FAST_ID } from "./core-contract-logs-fast/task.js";
import type { LedgerWorkerModule } from "../ledger/worker/engine.js";

/** UmbraDB's core modules that declare ledger tasks, with their tasks (see the module comment). */
export const CORE_LEDGER_TASK_MODULES: readonly LedgerWorkerModule[] = Object.freeze([
  Object.freeze({ id: CORE_CONTRACT_LOGS_FAST_ID, ledgerTasks: Object.freeze([CONTRACT_LOG_SITES_TASK]) }),
]);
