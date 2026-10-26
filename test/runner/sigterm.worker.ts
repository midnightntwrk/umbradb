import { InMemoryBlockSource } from "../../src/runner/in-memory-source.js";
import { startProcess, terminationSignal } from "../../src/runner/process.js";
import { testBuild } from "./process-build.js";
import { type WorkEvent, workModule } from "./sigterm-module.js";

/**
 * A process for A48 (task 5.3; RN-13), started by `sigterm.test.ts` with `node --import tsx` and one JSON argument
 * ({@link Job}); it reports each event as one JSON line on stdout ({@link WorkerEvent}).
 *
 * `runner`: the process as `umbradb run` starts it (task 4.4) — `startProcess` with the configuration file, its signal
 * from {@link terminationSignal} — over the test build with module `w` (`sigterm-module.ts`), whose `on-db-write` at
 * height `at` waits for the SIGTERM inside its block's transaction. Once the process has stopped and closed, the worker
 * reports `closed` and lets Node.js end the process by itself: anything the runner left open would keep it alive.
 *
 * `exit-at-once` is the negative control's: its SIGTERM handler exits at once, without awaiting the block.
 */

export interface Job {
  readonly configFile: string;
  readonly head: number;
  readonly at: number;
  readonly rows: number;
  readonly mode: "runner" | "exit-at-once";
}

export type WorkerEvent =
  | WorkEvent
  | { readonly event: "started" }
  | { readonly event: "refused"; readonly message: string }
  | { readonly event: "closed"; readonly state: string; readonly ended: string }
  | { readonly event: "log"; readonly line: string };

function report(event: WorkerEvent): void {
  process.stdout.write(`${JSON.stringify(event)}\n`);
}

const job = JSON.parse(process.argv[2] as string) as Job;
if (job.mode === "exit-at-once") process.once("SIGTERM", () => process.exit(0));
// `w` waits inside its block for the signal; its listener comes after the negative control's, which exits first.
const hold = new Promise<void>((resolve) => {
  process.once("SIGTERM", () => resolve());
});
const termination = job.mode === "runner" ? terminationSignal() : undefined;
// The in-memory source holds nothing open while the loop waits: the heartbeat (task 8.x) and a node source would. The
// same interval ends a worker whose test died without stopping it (Vitest's bail, a test's timeout): `w` would hold its
// block open for ever. Orphaned, its parent is no longer the test's.
const parent = process.ppid;
const keepAlive = setInterval(() => {
  if (process.ppid !== parent) process.exit(4);
}, 1_000);

const build = testBuild([workModule({ rows: job.rows, at: job.at, hold, report })]);
const handle = startProcess({
  declarations: build.declarations,
  config: { file: job.configFile },
  source: new InMemoryBlockSource({ head: BigInt(job.head) }),
  ...(termination === undefined ? {} : { signal: termination.signal }),
  log: (line) => report({ event: "log", line }),
});
handle.started.then(
  () => report({ event: "started" }),
  (error: unknown) => report({ event: "refused", message: String(error) }),
);
await handle.closed;
report({ event: "closed", state: handle.status().state, ended: (await handle.ended).kind });
termination?.dispose();
clearInterval(keepAlive);
