import { commandBuild } from "../../src/cli/build-modules.js";
import { loadConfig } from "../../src/config/load.js";
import { InMemoryBlockSource } from "../../src/runner/in-memory-source.js";
import { terminationSignal } from "../../src/runner/process.js";
import { startProcess } from "../runner/process-build.js";

/**
 * A running process for A163's real signal (task 15.1a; BK-1, Q152 B), started by `signal-backup.test.ts` with `node
 * --import tsx` and one JSON argument ({@link SignalJob}): `startProcess` (the tests' own, which serves no admin
 * endpoints) as `umbradb run` starts it — the configuration file and its modules, SIGTERM through `terminationSignal`,
 * SIGUSR2 from this process itself (no `backupSignals` given) — over an in-memory chain that finalizes one block every
 * `feedMs` once startup completed, as a node does, so that blocks keep committing. It reports each event as one JSON
 * line on stdout ({@link SignalEvent}): its log lines, each new cursor, and `closed` once the process has stopped and
 * closed; then it lets Node.js end by itself. It exits on its own once its parent is no longer the test's.
 */

export interface SignalJob {
  readonly configFile: string;
  readonly feedMs: number;
}

export type SignalEvent =
  | { readonly event: "log"; readonly line: string }
  | { readonly event: "cursor"; readonly height: string }
  | { readonly event: "refused"; readonly message: string }
  | { readonly event: "closed"; readonly ended: string };

function report(event: SignalEvent): void {
  process.stdout.write(`${JSON.stringify(event)}\n`);
}

const job = JSON.parse(process.argv[2] as string) as SignalJob;
const parent = process.ppid;
const orphanGuard = setInterval(() => {
  if (process.ppid !== parent) process.exit(4);
}, 500);

const termination = terminationSignal();
const loaded = await loadConfig({ file: job.configFile });
const source = new InMemoryBlockSource({ head: 1n });
const handle = startProcess({
  declarations: commandBuild(loaded.modules),
  config: { data: loaded.data, file: loaded.file },
  source,
  signal: termination.signal,
  log: (line) => report({ event: "log", line }),
});
let feed: NodeJS.Timeout | undefined;
handle.started.then(
  () => {
    feed = setInterval(() => source.finalize(source.head + 1n), job.feedMs);
  },
  (error: unknown) => report({ event: "refused", message: String(error) }),
);
let cursor: bigint | null = null;
const watch = setInterval(() => {
  const now = handle.status().cursor;
  if (now !== null && now !== cursor) {
    cursor = now;
    report({ event: "cursor", height: String(now) });
  }
}, 10);

await handle.closed;
clearInterval(feed);
clearInterval(watch);
clearInterval(orphanGuard);
termination.dispose();
report({ event: "closed", ended: (await handle.ended).kind });
