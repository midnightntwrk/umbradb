import { writeFileSync } from "node:fs";
import { join } from "node:path";
import type { DatabaseParts } from "../../src/config/database-parts.js";
import { startUmbraDB } from "../../src/library/start-umbradb.js";
import { InMemoryBlockSource } from "../../src/runner/in-memory-source.js";
import { startProcess } from "../runner/process-build.js";
import { cursorReaches, libraryData, rowsModule } from "./library-fixtures.js";

/**
 * A host program for the quiet-host criteria, run by `./guarantees.test.ts` through `./quiet-child.ts`:
 * it starts UmbraDB without `log`, as a host does, in each of the runs below, and writes to its result file what it
 * observed of `process` — every listener added to it during the runs (its `newListener` event, which sees one added
 * and removed again too), every event's listener count before the runs, while the first one runs and after all of
 * them, and `process.exitCode` before and after — and how each run ended. The parent reads the child's stdout and
 * stderr whole.
 *
 * **The runs** (`mode: "quiet"`), each on a database of its own from the job: start → 5 blocks → `backup()` → `stop()`;
 * a start refused at its configuration (`livenessTimeoutMs: "30s"`); a start refused after its database opened (a
 * migration whose SQL fails); a failed SQL statement (a module's `on-db-write`, which halts); a halt (a module's
 * `on-db-write` that throws). On a PGlite directory the first opening is the process's import of `node:sqlite`.
 *
 * **The negative controls** run the first run through the engine with one of the command's ports, each breaking one
 * criterion: `"control-listener"` the SIGUSR2 port (`backupSignals: process`) with `backupOnSignal` set, a listener while
 * it runs; `"control-output"` the command's log on stderr; `"control-exit-code"` the engine's stop setting
 * `process.exitCode` at its database step (the fault tests' `closeFault` point).
 */

interface Job {
  readonly mode: "quiet" | "control-listener" | "control-output" | "control-exit-code";
  /** One database per run, in the runs' order. */
  readonly databases: readonly DatabaseParts[];
  /** Where the backups go. */
  readonly dir: string;
  readonly resultFile: string;
}

const job = JSON.parse(process.argv[2] as string) as Job;

/** Every event's listener count of `process`. */
const listeners = (): Record<string, number> =>
  Object.fromEntries(process.eventNames().map((name) => [String(name), process.listenerCount(name)]));

/** How a run ended: its state, its reason's code, and what it says of itself. */
interface Outcome {
  readonly state: string;
  readonly code: string | null;
  readonly note: string;
}

/** What a run's handle says of its state: the library's, or the engine's. */
interface Stated {
  status(): { readonly state: string; readonly reason: { readonly code: string } | null };
}

const outcome = (handle: Stated, note = ""): Outcome => {
  const status = handle.status();
  return { state: status.state, code: status.reason?.code ?? null, note };
};

/** Waits until `handle` is `state`, or 60 s. */
async function until(handle: Stated, states: readonly string[]): Promise<void> {
  for (let waited = 0; !states.includes(handle.status().state) && waited < 60_000; waited += 10) {
    await new Promise((resolve) => setTimeout(resolve, 10));
  }
}

// Every listener added to `process` from here on, whenever it is added and whether or not it is removed again: the
// runs must add none, for any event. The listener counts are also sampled while the first run follows.
const added: string[] = [];
process.on("newListener", (event: string | symbol) => {
  added.push(String(event));
});
const before = listeners();
const exitCodeBefore = process.exitCode ?? null;
let during: Record<string, number> = {};
const outcomes: Outcome[] = [];
const [first, refusedLate, failingSql, halting] = job.databases.slice(1);
const db = job.databases[0] as DatabaseParts;

if (job.mode === "quiet") {
  // 1. start → blocks → backup → stop
  const m = rowsModule("m");
  const run = startUmbraDB({ config: { data: libraryData(db, [m]) }, modules: [m], source: new InMemoryBlockSource({ head: 5n }) });
  await run.started;
  await cursorReaches(run, 5n);
  during = listeners();
  const backup = await run.backup(join(job.dir, "run.backup"));
  await run.stop();
  await run.closed;
  outcomes.push(outcome(run, `backup at ${backup.manifest.height}`));
  // 2. refused at its configuration
  const early = startUmbraDB({ config: { data: libraryData(first as DatabaseParts, [], { livenessTimeoutMs: "30s" }) } });
  await early.started.catch(() => undefined);
  await early.closed;
  outcomes.push(outcome(early));
  // 3. refused after its database opened
  const broken = rowsModule("broken", undefined, { migrations: [{ id: "001", sql: "CREATE TABLE broken.rows (height bigint PRIMARY KEY" }] });
  const late = startUmbraDB({
    config: { data: libraryData(refusedLate as DatabaseParts, [broken]) },
    modules: [broken],
    source: new InMemoryBlockSource({ head: 3n }),
  });
  await late.started.catch(() => undefined);
  await late.stop();
  outcomes.push(outcome(late));
  // 4. a failed SQL statement
  const sql = rowsModule("sql", undefined, {
    points: {
      async "on-db-write"(_p, _b, w) {
        await w.execute("INSERT INTO sql.nowhere (height) VALUES (1)", []);
      },
    },
  });
  const failed = startUmbraDB({
    config: { data: libraryData(failingSql as DatabaseParts, [sql]) },
    modules: [sql],
    source: new InMemoryBlockSource({ head: 3n }),
  });
  await failed.started;
  await until(failed, ["halted"]);
  await failed.stop();
  outcomes.push(outcome(failed));
  // 5. a halt
  const thrower = rowsModule("thrower", undefined, {
    points: {
      async "on-db-write"(_p, b) {
        if (b.height === 2n) throw new Error("thrower fails at 2");
      },
    },
  });
  const halted = startUmbraDB({
    config: { data: libraryData(halting as DatabaseParts, [thrower]) },
    modules: [thrower],
    source: new InMemoryBlockSource({ head: 3n }),
  });
  await halted.started;
  await until(halted, ["halted"]);
  await halted.stop();
  outcomes.push(outcome(halted));
} else {
  const m = rowsModule("m");
  const source = new InMemoryBlockSource({ head: 5n });
  const handle = startProcess({
    config: { data: libraryData(db, [m], job.mode === "control-listener" ? { backupOnSignal: join(job.dir, "signal.backup") } : {}) },
    userModules: { modules: [m] },
    network: {},
    source,
    ...(job.mode === "control-listener" ? { backupSignals: process } : {}),
    ...(job.mode === "control-output" ? { log: (line: string) => void process.stderr.write(`${line}\n`) } : {}),
    // The engine's stop, at its database step, sets the exit status (the fault tests' named point).
    ...(job.mode === "control-exit-code"
      ? {
          closeFault: (step: string) => {
            if (step === "database") process.exitCode = 3;
          },
        }
      : {}),
  });
  await handle.started;
  while (handle.status().cursor !== 5n) await new Promise((resolve) => setTimeout(resolve, 10));
  during = listeners();
  await handle.stop();
  outcomes.push(outcome(handle));
}

// What a later turn might still add (a listener, a warning) is seen.
await new Promise((resolve) => setImmediate(resolve));
writeFileSync(
  job.resultFile,
  JSON.stringify({
    before,
    during,
    after: listeners(),
    added,
    exitCode: { before: exitCodeBefore, after: process.exitCode ?? null },
    outcomes,
  }),
);
// The child's own exit status stays its own: the parent reads the result.
process.exitCode = 0;
