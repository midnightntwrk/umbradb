/**
 * UmbraDB's own ledger worker entry (`openspec/changes/core-arch/design.md` §5.3, §5.5; `specs/modules/spec.md` MD-1;
 * tasks 12.3, 12.6): the thread `startLedgerWorker` starts unless given another entry. It runs the ledger worker
 * (`./run.ts`) with the ledger tasks of UmbraDB's core modules (`src/backbone/ledger-tasks.ts`) and of the user modules
 * of the module `workerData.modules` names, if any — its `modules` export, as a configuration file exports its user
 * modules (`src/config/load.ts`'s `MODULES_EXPORT`, CF-1, Q106): for the `umbradb` command the configuration file, which
 * is the host program and is imported here as on the main thread; nothing is loaded by name (MD-1). The browser build
 * bundles this entry (§9.2), which names no module there. Runs only as a thread of its own (out of coverage).
 */

import { workerData } from "node:worker_threads";
import { CORE_LEDGER_TASK_MODULES } from "../../backbone/ledger-tasks.js";
import { type LedgerWorkerModule, runLedgerWorker } from "./run.js";

/** The `modules` export of the module at `url` (none without it); throws for one that is not a list. */
async function userModulesOf(url: string): Promise<readonly LedgerWorkerModule[]> {
  const imported = (await import(url)) as { readonly modules?: unknown };
  if (imported.modules === undefined) return [];
  if (!Array.isArray(imported.modules)) throw new TypeError(`${url} exports modules as something other than a list (CF-1)`);
  return imported.modules as readonly LedgerWorkerModule[];
}

const named = (workerData as { readonly modules?: string | null } | null)?.modules ?? null;
await runLedgerWorker([...CORE_LEDGER_TASK_MODULES, ...(named === null ? [] : await userModulesOf(named))]);
