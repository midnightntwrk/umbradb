import { InMemoryBlockSource } from "../../src/runner/in-memory-source.js";
import type { PointName } from "../../src/modules/declaration.js";
import { type CrashEvent, crashModule } from "./crash-module.js";
import { startProcess, testBuild } from "./process-build.js";

/**
 * A process for the crash tests, started by `crash.test.ts` with `node --import tsx` and one JSON argument
 * ({@link CrashJob}): the process as `umbradb run` starts it (`startProcess` with the configuration file) over the test
 * build with module `c` (`crash-module.ts`), which holds for ever at the job's point and height. It reports each event
 * as one JSON line on stdout; the test kills it with SIGKILL once `c` holds. [A44, A46, RN-9, RN-11]
 *
 * Like `sigterm.worker.ts`, it exits by itself once its parent is no longer the test's (Vitest's bail, a test's timeout),
 * since `c` would otherwise hold it up for ever.
 */

export interface CrashJob {
  readonly configFile: string;
  readonly head: number;
  readonly hold: { readonly point: PointName; readonly height: number };
}

export type CrashWorkerEvent = CrashEvent | { readonly event: "started" } | { readonly event: "refused"; readonly message: string };

function report(event: CrashWorkerEvent): void {
  process.stdout.write(`${JSON.stringify(event)}\n`);
}

const job = JSON.parse(process.argv[2] as string) as CrashJob;
const parent = process.ppid;
const orphanGuard = setInterval(() => {
  if (process.ppid !== parent) process.exit(4);
}, 1_000);

const build = testBuild([crashModule({ hold: job.hold, report })]);
const handle = startProcess({
  declarations: build.declarations,
  config: { file: job.configFile },
  source: new InMemoryBlockSource({ head: BigInt(job.head) }),
  log: () => undefined,
});
handle.started.then(
  () => report({ event: "started" }),
  (error: unknown) => report({ event: "refused", message: String(error) }),
);
await handle.closed;
clearInterval(orphanGuard);
