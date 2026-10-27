import { nodeSourceOf } from "../../src/backbone/core-block-fetch/index.js";
import { startProcess } from "../runner/process-build.js";
import { chainDeclarations } from "./chain-build.js";
import { watched, watcher } from "./ingest-harness.js";
import { LEDGER_CORE } from "./ledger-restart.js";

/**
 * A process for A102's restart test (task 12.4; LG-11), started by `ledger-storage.test.ts` with `node --import tsx`
 * and one JSON argument ({@link RestartJob}): the process as `umbradb run` starts it — `startProcess` with the
 * configuration file and the node source (`nodeSourceOf`) over the tape node the test serves, the ledger in its worker
 * thread — and the build `ingest-harness.ts`'s `ingest` makes with the ledger's core modules, as the test's restart
 * builds it. It reports `at` (one JSON line on stdout) once its cursor is the tape's finalized head, and the test kills
 * it with SIGKILL. It exits by itself once its parent is no longer the test's (Vitest's bail, a test's timeout).
 */

export interface RestartJob {
  readonly configFile: string;
  /** The finalized head of the tape, which the process commits before it reports. */
  readonly cursor: string;
}

export type RestartEvent =
  | { readonly event: "at"; readonly cursor: string }
  | { readonly event: "ended"; readonly status: string };

function report(event: RestartEvent): void {
  process.stdout.write(`${JSON.stringify(event)}\n`);
}

const job = JSON.parse(process.argv[2] as string) as RestartJob;
const parent = process.ppid;
const orphanGuard = setInterval(() => {
  if (process.ppid !== parent) process.exit(4);
}, 1_000);

const handle = startProcess({
  declarations: chainDeclarations([watcher(watched())], { core: LEDGER_CORE }),
  config: { file: job.configFile },
  source: (core, shared) => nodeSourceOf(core, shared),
  log: () => undefined,
});
const poll = setInterval(() => {
  const status = handle.status();
  if (status.cursor === BigInt(job.cursor)) {
    clearInterval(poll);
    report({ event: "at", cursor: job.cursor });
  } else if (status.ended !== null || status.state === "halted" || status.state === "refused") {
    clearInterval(poll);
    report({ event: "ended", status: JSON.stringify(status, (_k, v: unknown) => (typeof v === "bigint" ? `${v}` : v)) });
  }
}, 20);
await handle.closed;
clearInterval(orphanGuard);
