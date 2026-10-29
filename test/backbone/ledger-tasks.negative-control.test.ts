import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { coreContractLogsFast } from "../../src/backbone/core-contract-logs-fast/core-contract-logs-fast.js";
import { inThreadLedger } from "../../src/ledger/worker/host.js";
import { callArgsModule, FAULT_AT, modules, nativeLeakModule, readerModule, taskSeen } from "../ledger/fixtures/task-modules.js";
import { CORE_LEDGER_TASK_MODULES } from "../../src/backbone/ledger-tasks.js";
import { PROCESS_BACKENDS, type ProcessBackend } from "../runner/process-backends.js";
import { PATIENCE_MS } from "./ingest-harness.js";
import { LEDGER_CORE } from "./ledger-restart.js";
import { PARSE_CORE, plainWatchModule, runTasks, tasksScenario, transactionsOf } from "./ledger-tasks-checks.js";
import { mainThreadLogReader } from "./main-thread-log-reader.js";

/**
 * The ledger-task tests' committed negative controls, on PostgreSQL 18 and PGlite 0.5.10, over the runs of
 * `ledger-tasks.test.ts`: [LG-7, LG-17, CC-3]
 *
 * - **No plain-data check** (`checkPlainData: false`, on the main thread's engine, where no thread boundary copies a
 *   result). A task's WebAssembly-backed object is no longer refused, so the check that it fails the block with
 *   `callback-error` fails. The object reaches the module's callback, where the oracle (a structured-clone round trip
 *   of each block item) catches it. [A137]
 * - **`-fast` reading on the main thread again**, a second parse (its `reader` seam given
 *   `./main-thread-log-reader.ts`). Each calling transaction is parsed twice, so the check that the package's parse
 *   function runs once per transaction fails. [A137]
 */

describe.each(PROCESS_BACKENDS)("A137's negative controls on $name", (backend: ProcessBackend) => {
  beforeAll(() => backend.start(), 180_000);
  afterAll(() => backend.stop(), 60_000);

  it("A137 control: without the plain-data check, a task's WebAssembly-backed object does not fail the block and reaches a main-thread callback", async () => {
    const expected = await tasksScenario();
    const seen = taskSeen();
    const run = await runTasks(await backend.database(), expected, {
      core: PARSE_CORE,
      user: [nativeLeakModule(), plainWatchModule(seen, ["leaked-object"])],
      ledgerWorker: () => inThreadLedger({ modules: [...CORE_LEDGER_TASK_MODULES, ...modules], checkPlainData: false }),
    });
    // No halt: the block with the native object is committed …
    expect(run.status).toMatchObject({ cursor: expected.scenario.head, reason: null });
    // … and a main-thread callback got it: the structured-clone oracle finds it. [A137]
    expect(seen.notPlain.filter((problem) => problem.startsWith(`${FAULT_AT} leaked-object:`))).toHaveLength(1);
    expect(seen.notPlain.join("\n")).toMatch(/LedgerState/);
  }, PATIENCE_MS * 2);

  it("A137 control: -fast reading on the main thread again parses each calling transaction a second time", async () => {
    const expected = await tasksScenario();
    const fastOnMain = coreContractLogsFast({ reader: mainThreadLogReader() });
    const run = await runTasks(await backend.database(), expected, {
      core: [...LEDGER_CORE, fastOnMain],
      user: [callArgsModule(), readerModule("reader-a"), readerModule("reader-b"), readerModule("reader-c")],
    });
    expect(run.status).toMatchObject({ cursor: expected.scenario.head, reason: null });
    // The worker parsed each once; this thread parsed each calling transaction again.
    expect(run.workerParses.slice().sort()).toEqual(transactionsOf(expected));
    const calling = expected.scenario.transactions.filter((tx) => tx.height >= 2n).length;
    expect(run.mainParses).toHaveLength(calling);
    expect([...run.workerParses, ...run.mainParses].sort()).not.toEqual(transactionsOf(expected));
  }, PATIENCE_MS * 2);
});
