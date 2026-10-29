// A host's own ledger worker entry: it imports the modules the host ships and calls `runLedgerWorker` with them and
// UmbraDB's core modules' tasks. Started from its TypeScript source with `typeScriptEntry` (`src/ledger/worker/host.ts`).
// [LG-17, MD-1; design §5.5]
// Erasable TypeScript only: the worker runs it through Node.js's type stripping.

import { CORE_LEDGER_TASK_MODULES } from "../../../src/backbone/ledger-tasks.js";
import { runLedgerWorker } from "../../../src/ledger/worker/run.js";
import { modules } from "./task-modules.js";

await runLedgerWorker([...CORE_LEDGER_TASK_MODULES, ...modules]);
