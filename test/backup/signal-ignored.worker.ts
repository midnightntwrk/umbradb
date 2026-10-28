import { EventEmitter } from "node:events";
import { runFailed, runProcess } from "../../src/cli/run.js";
import type { IgnoredJob } from "./signal-ignored-fixtures.js";

/**
 * `umbradb run`'s stand-in for A175's negative control (task 15.1c; BK-1, owner decision Q173 C), started by
 * `signal-ignored.negative-control.test.ts` with `node --import tsx` and one JSON argument ({@link IgnoredJob}): the
 * command's `runProcess` on the configuration file, its log on stderr, exiting 1 when processing was refused or halted
 * and 0 otherwise, as `umbradb run` does. With `signals: "command"` SIGUSR2 reaches the process as the command's own
 * (this process's signals); with `"unconnected"` the process is given an emitter of its own that nothing emits on, and
 * the command none — so SIGUSR2 reaches no listener: task 15.1a's command without `backupOnSignal`. It exits on its
 * own once its parent is no longer the test's.
 */

const job = JSON.parse(process.argv[2] as string) as IgnoredJob;
const parent = process.ppid;
const orphanGuard = setInterval(() => {
  if (process.ppid !== parent) process.exit(4);
}, 500);
orphanGuard.unref();

const unconnected = new EventEmitter();
const end = await runProcess(
  { file: job.configFile, cwd: job.cwd, log: (line) => process.stderr.write(`${line}\n`) },
  job.signals === "unconnected" ? { backupSignals: unconnected } : {},
);
process.exitCode = runFailed(end) ? 1 : 0;
