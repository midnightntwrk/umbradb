import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { callArgsModule, FAULT_AT, nativeLeakModule, readerModule, stateBeforeModule, taskSeen, throwingModule } from "../ledger/fixtures/task-modules.js";
import { PROCESS_BACKENDS, type ProcessBackend } from "../runner/process-backends.js";
import { linesBetween, logLines } from "./contract-data-checks.js";
import { restartAt } from "./ledger-restart.js";
import { ingest, PATIENCE_MS } from "./ingest-harness.js";
import {
  expectedCallArgs,
  PARSE_CORE,
  plainWatchModule,
  runTasks,
  TASKS_CORE,
  tasksScenario,
  transactionsOf,
} from "./ledger-tasks-checks.js";

/**
 * Ledger tasks, on PostgreSQL 18 and PGlite 0.5.10, through the real process (`./ledger-tasks-checks.ts`):
 * - A test module's ledger task decodes each contract call's arguments in the ledger worker, with the native parsed
 *   objects and `rawPackages()`. Its `on-compute` receives them as its `block` item.
 * - With that task, `-fast`'s task (`-fast` also reads in a ledger task) and three modules reading `block-parsed`, the
 *   package's parse function runs once per transaction: in the worker, never on the main thread.
 * - A task that returns a WebAssembly-backed object, or throws, fails the block with `callback-error` naming the
 *   module and the task.
 * - A task without `needsState` gets no state and runs mid-chain. A module with a `needsState` task, which gets the
 *   state before each block, refuses to start where `core-ledger-state` is not active.
 * - No main-thread callback receives a native ledger object: each `block` item passes a structured-clone round trip.
 *
 * Committed negative controls: `ledger-tasks.negative-control.test.ts`. [A137 CI, LG-7, LG-17, CC-3]
 */

describe.each(PROCESS_BACKENDS)("A137 (LG-7, LG-17): ledger tasks through the process on $name", (backend: ProcessBackend) => {
  beforeAll(() => backend.start(), 180_000);
  afterAll(() => backend.stop(), 60_000);

  it("A137: a task decodes each call's arguments in the worker and the module's on-compute receives them; with -fast's task and three readers of block-parsed, each transaction is parsed once, in the worker; every block item is plain data; a needsState task gets the state before each block", async () => {
    const expected = await tasksScenario();
    const seen = taskSeen();
    const user = [
      callArgsModule(seen),
      stateBeforeModule(seen),
      readerModule("reader-a", seen),
      readerModule("reader-b", seen),
      readerModule("reader-c", seen),
      plainWatchModule(seen, ["call-arguments", "root-before", "contract-logs"]),
    ];
    const db = await backend.database();
    const run = await runTasks(db, expected, { core: TASKS_CORE, user });
    expect(run.status).toMatchObject({ cursor: expected.scenario.head, reason: null });
    // The call arguments, decoded in the worker, as the module's block item at its on-compute; no state given.
    expect(seen.callArgs).toEqual(expectedCallArgs(expected));
    // The package parsed each transaction once — in the worker, for core-block-parsed, the apply, call-args' and -fast's
    // tasks — and never on the main thread.
    expect(run.workerParses.slice().sort()).toEqual(transactionsOf(expected));
    expect(run.mainParses).toEqual([]);
    for (const reader of ["reader-a", "reader-b", "reader-c"]) {
      expect(seen.readers.get(reader), reader).toEqual(expected.scenario.heights.map((height, h) => [BigInt(h), height.types.length]));
    }
    // -fast, reading in its ledger task, stored every log of the range.
    expect(await logLines(db)).toEqual(linesBetween(expected.logs, 0n, expected.scenario.head));
    // No callback on the main thread got anything but plain data.
    expect(seen.notPlain).toEqual([]);
    expect(seen.callArgs.size).toBeGreaterThan(0);
    // The state before each block: block 0 has none; at h, the root of the state after h − 1.
    expect(seen.stateBefore.get(0n)?.item).toEqual({ height: 0n, root: null });
    for (let h = 1n; h <= expected.scenario.head; h++) {
      expect(seen.stateBefore.get(h)?.item, `at ${h}`).toEqual({ height: h, root: seen.stateBefore.get(h - 1n)?.after });
    }
  }, PATIENCE_MS * 4);

  it("A137: a task returning a WebAssembly-backed object fails the block with callback-error naming the module and the task", async () => {
    const expected = await tasksScenario();
    const run = await runTasks(await backend.database(), expected, { core: PARSE_CORE, user: [nativeLeakModule()], halts: true });
    expect(run.status).toMatchObject({ state: "halted", cursor: FAULT_AT - 1n, reason: { code: "callback-error", height: FAULT_AT, module: "native-leak", point: "on-parse" } });
    expect(run.lines.find((line) => line.includes("processing halted"))).toMatch(
      /processing halted \(callback-error\).*the ledger task leaked-object of native-leak at block 3 returned an object of the class LedgerState at \$\.state/,
    );
  }, PATIENCE_MS * 2);

  it("A137: a task that throws fails the block with callback-error naming the module and the task", async () => {
    const expected = await tasksScenario();
    const run = await runTasks(await backend.database(), expected, { core: PARSE_CORE, user: [throwingModule()], halts: true });
    expect(run.status).toMatchObject({ state: "halted", cursor: FAULT_AT - 1n, reason: { code: "callback-error", height: FAULT_AT, module: "task-throws", point: "on-parse" } });
    expect(run.lines.find((line) => line.includes("processing halted"))).toMatch(
      /processing halted \(callback-error\).*the ledger task thrown-result of task-throws at block 3 threw: the throwing task gives up at 3/,
    );
  }, PATIENCE_MS * 2);

  it("A137: a task without needsState gets no state and runs mid-chain, without core-ledger-state", async () => {
    const expected = await tasksScenario();
    const seen = taskSeen();
    // S = 2: the tape with the header and metadata of block 1, which a start there reads (`./ledger-restart.ts`). [Q135 A]
    const records = restartAt(expected.scenario.records, 1n);
    const run = await runTasks(await backend.database(), expected, { start: 2n, core: PARSE_CORE, user: [callArgsModule(seen)], records });
    expect(run.status).toMatchObject({ cursor: expected.scenario.head, reason: null });
    const all = expectedCallArgs(expected);
    expect([...seen.callArgs.keys()]).toEqual([2n, 3n, 4n, 5n]);
    for (const [height, item] of seen.callArgs) expect(item, `at ${height}`).toEqual(all.get(height));
    expect([...seen.callArgs.values()].every((item) => item.stateGiven === false)).toBe(true);
    expect(run.workerParses.slice().sort()).toEqual(transactionsOf(expected, 2n));
  }, PATIENCE_MS * 2);

  it("A137: a module with a needsState task refuses to start where core-ledger-state is not active", async () => {
    const expected = await tasksScenario();
    const process = await ingest(await backend.database(), expected.scenario.records, { start: 0n, core: PARSE_CORE, user: [stateBeforeModule()] });
    try {
      const refusal = await process.handle.started.catch((error: unknown) => error);
      expect(refusal).toMatchObject({ code: "item-no-provider", details: { module: "state-before", item: "ledger-state" } });
      expect(process.handle.status()).toMatchObject({ state: "refused", reason: { code: "item-no-provider" } });
    } finally {
      await process.close();
    }
  }, PATIENCE_MS);
});
