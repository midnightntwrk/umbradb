/**
 * UmbraDB's own ledger worker entry: the thread `startLedgerWorker` starts unless it is given another entry. It runs
 * the ledger worker (`./run.ts`) with the ledger tasks of UmbraDB's core modules (`src/backbone/ledger-tasks.ts`).
 * [MD-1; design §5.3, §5.5]
 *
 * If `workerData.modules` names a module, the tasks of that module's user modules are added: its `modules` export, the
 * same export a configuration file uses for its user modules (`src/config/load.ts`'s `MODULES_EXPORT`). For the
 * `umbradb` command that module is the configuration file, which is the host program and is imported here just as on
 * the main thread; nothing is loaded by name. [MD-1, CF-1, Q106]
 *
 * The browser build bundles this entry and names no module there. It runs only as a thread of its own, so it is out
 * of coverage. [design §9.2]
 */

import { workerData } from "node:worker_threads";
import { CORE_LEDGER_TASK_MODULES } from "../../backbone/ledger-tasks.js";
import { type LedgerWorkerModule, runLedgerWorker } from "./run.js";

/** The `modules` export of the module at `url` (none without it); throws for one that is not a list. */
async function userModulesOf(url: string): Promise<readonly LedgerWorkerModule[]> {
  const imported = (await import(url)) as { readonly modules?: unknown };
  if (imported.modules === undefined) return [];
  if (!Array.isArray(imported.modules)) throw new TypeError(`${url} exports modules as something other than a list`);
  return imported.modules as readonly LedgerWorkerModule[];
}

const named = (workerData as { readonly modules?: string | null } | null)?.modules ?? null;
await runLedgerWorker([...CORE_LEDGER_TASK_MODULES, ...(named === null ? [] : await userModulesOf(named))]);
