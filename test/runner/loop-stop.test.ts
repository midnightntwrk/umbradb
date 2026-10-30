import { setTimeout as sleep } from "node:timers/promises";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { InMemoryBlockSource } from "../../src/runner/in-memory-source.js";
import { cursorIn, PROCESS_BACKENDS, type ProcessBackend } from "./process-backends.js";
import { core, entryOf, loggingModule, startProcess, testBuild } from "./process-build.js";
import {
  a169Problems,
  a169Run,
  blockScenario,
  type LoopStopScenario,
  PATIENCE_MS,
  restartedProblems,
  rootScenario,
} from "./loop-stop-harness.js";
import { NodeWatch, type StopBy } from "./startup-stop-harness.js";

/**
 * `[CI]` SIGTERM while the loop waits on an unreachable node. A tape node answers up to height h and then refuses
 * connections. SIGTERM, and likewise `ProcessHandle.stop()`, ends the process within 5 s while the running loop waits
 * for h + 1's block, and, with `core-ledger-state`, while its `on-compute` at h + 1 awaits the state root. It ends with
 * `ended` of kind `signal`, no connection attempt after the stop, and nothing of h + 1 stored; a restart against a node
 * that answers again processes h + 1. [A169 CI, RN-13]
 *
 * On PostgreSQL 18.6 and PGlite 0.5.10, each run on a new database (`loop-stop-harness.ts`: what is observed, and the
 * oracle `a169Problems`). The committed negative control is `loop-stop.negative-control.test.ts`.
 *
 * Also, with the SIGTERM-in-transaction case unchanged: a stop while a block transaction is open closes the node client
 * only once it has committed, since an open block transaction is let commit or roll back first. [A48, RN-13]
 */

/** No problem on either backend. */
const NONE = Object.fromEntries(PROCESS_BACKENDS.map((backend) => [backend.name, []]));

/** One run: the sync to h and the wait, the bound, the watch, the clean-up and the restart; a loaded machine (0.5). */
const RUN_TIMEOUT_MS = 2 * PATIENCE_MS + 60_000;

/**
 * A stop while `on-db-write` of 3 holds the block transaction open (an in-memory source to 5, the process's node
 * client made through a {@link NodeWatch}): every problem, none when the client stays open until the transaction has
 * committed — 3 committed, processing ended by the signal — and is closed then.
 */
async function openTransactionProblems(backend: ProcessBackend): Promise<string[]> {
  const db = await backend.database();
  let reached!: () => void;
  const inTransaction = new Promise<void>((resolve) => {
    reached = resolve;
  });
  let release!: () => void;
  const held = new Promise<void>((resolve) => {
    release = resolve;
  });
  const gate = loggingModule("gate", [], [], {
    points: {
      async "on-db-write"(_p, b) {
        if (b.height !== 3n) return;
        reached();
        await held;
      },
    },
  });
  const watch = new NodeWatch();
  const handle = startProcess({
    declarations: testBuild([gate]).declarations,
    config: { data: { entries: [core(db.setting, 1), entryOf(gate, 1)] } },
    source: new InMemoryBlockSource({ head: 5n }),
    nodeClient: (given) => watch.client(given),
    log: () => undefined,
  });
  const problems: string[] = [];
  try {
    await inTransaction;
    const stopped = handle.stop();
    // Long enough for a close at the stop to show, well within the transaction held open.
    await sleep(500);
    if (watch.open() !== 1) problems.push("the node client was closed while the block transaction of 3 was open");
    release();
    await stopped;
    const { ended, state } = handle.status();
    if (ended?.kind !== "signal" || state !== "stopping") {
      problems.push(`ended ${ended?.kind} in ${state}, not signal in stopping`);
    }
    if (watch.open() !== 0) problems.push("the node client was not closed once the transaction committed");
  } finally {
    release();
    await handle.stop();
  }
  const cursor = await cursorIn(db);
  if (cursor !== 3) problems.push(`the cursor after the stop is ${cursor}, not 3 (the open transaction committed)`);
  return problems;
}

/** The case on both backends for `scenario`, stopped `by`: each run's problems, its restart's included. [A169 CI] */
async function a169(scenario: LoopStopScenario, by: StopBy): Promise<Record<string, string[]>> {
  const found: Record<string, string[]> = {};
  for (const backend of PROCESS_BACKENDS) {
    const db = await backend.database();
    const { observed, lines } = await a169Run(backend, db, scenario, by);
    const problems = a169Problems(scenario, observed);
    // The log of a run that went wrong, for the reader of the failure.
    if (problems.length > 0) problems.push(`log: ${lines.slice(-15).join(" | ")}`);
    found[backend.name] = [...problems, ...(await restartedProblems(db, scenario))];
  }
  return found;
}

describe("A169: a stop while the running loop waits on an unreachable node ends the process (RN-13, task 5.3c)", () => {
  let root: LoopStopScenario;
  beforeAll(async () => {
    await Promise.all(PROCESS_BACKENDS.map((backend) => backend.start()));
    root = await rootScenario();
  }, 240_000);
  afterAll(() => Promise.all(PROCESS_BACKENDS.map((backend) => backend.stop())), 60_000);

  it.each<[StopBy, string]>([
    ["stop", "ProcessHandle.stop()"],
    ["sigterm", "SIGTERM (terminationSignal)"],
  ])(
    "A169: %s — %s while the loop waits for h + 1's block (the node source's prefetch, the node refusing connections) ends the process within 5 s: ended by the signal, the node client closed, no connection attempt after the stop, nothing of h + 1 stored, the database closed; a restart processes h + 1; on PostgreSQL and on PGlite",
    async (by) => {
      expect(await a169(blockScenario(), by)).toEqual(NONE);
    },
    2 * RUN_TIMEOUT_MS,
  );

  it.each<[StopBy, string]>([
    ["stop", "ProcessHandle.stop()"],
    ["sigterm", "SIGTERM (terminationSignal)"],
  ])(
    "A169: %s — %s while core-ledger-state's on-compute at h + 1 awaits the node's state root (the node refusing connections) ends the process within 5 s: ended by the signal, the node client closed, no connection attempt after the stop, nothing of h + 1 stored, the database closed; a restart processes h + 1; on PostgreSQL and on PGlite",
    async (by) => {
      expect(await a169(root, by)).toEqual(NONE);
    },
    2 * RUN_TIMEOUT_MS,
  );

  it(
    "A48 unchanged (RN-13): a stop while a block transaction is open closes the node client only once it has committed — the height committed, ended by the signal; on PostgreSQL and on PGlite",
    async () => {
      const found: Record<string, string[]> = {};
      for (const backend of PROCESS_BACKENDS) found[backend.name] = await openTransactionProblems(backend);
      expect(found).toEqual(NONE);
    },
    RUN_TIMEOUT_MS,
  );
});
