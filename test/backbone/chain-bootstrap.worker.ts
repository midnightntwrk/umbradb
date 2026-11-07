import { InMemoryBlockSource } from "../../src/runner/in-memory-source.js";
import { startProcess } from "../runner/process-build.js";
import { type WorkEvent, workModule } from "../runner/sigterm-module.js";
import { chainDeclarations } from "./chain-build.js";

/**
 * A process for the check that a bootstrap killed before S commits is repeated on the next start. [IN-2, A77]
 *
 * `chain-process.test.ts` starts it with `node --import tsx` and one JSON argument ({@link Job}). It reports each event
 * as one JSON line on stdout ({@link WorkerEvent}), and the test kills it with SIGKILL. The modes:
 * - `wait`: S is above the source's finalized head, so the process waits (`starting` with `waiting-for-node`) after
 *   the bootstrap's migrations and `core-chain`'s `on-start-db` have committed. It reports `waiting`.
 * - `hold`: the head is at S. Module `w`'s `on-db-write` of S, inside block S's transaction, waits for ever after its
 *   first row (`sigterm-module.ts`). It reports `in-db-write`.
 *
 * The build is the chain's (`chain-build.ts`) with `w`, the same build the test's restart uses.
 */

export interface Job {
  readonly configFile: string;
  readonly head: number;
  readonly mode: "wait" | "hold";
  /** The height whose `on-db-write` of `w` holds (`hold`). */
  readonly at?: number;
}

export type WorkerEvent =
  | WorkEvent
  | { readonly event: "waiting"; readonly height: string }
  | { readonly event: "refused"; readonly message: string }
  | { readonly event: "log"; readonly line: string };

function report(event: WorkerEvent): void {
  process.stdout.write(`${JSON.stringify(event)}\n`);
}

const job = JSON.parse(process.argv[2] as string) as Job;
// Orphaned — the test died without killing it (Vitest's bail, a timeout) — its parent is no longer the test's: exit.
const parent = process.ppid;
const keepAlive = setInterval(() => {
  if (process.ppid !== parent) process.exit(4);
}, 1_000);

const never = new Promise<void>(() => undefined);
const handle = startProcess({
  declarations: chainDeclarations([
    workModule({ rows: 2, ...(job.at === undefined ? {} : { at: job.at }), hold: never, report }),
  ]),
  config: { file: job.configFile },
  source: new InMemoryBlockSource({ head: BigInt(job.head) }),
  log: (line) => report({ event: "log", line }),
});
handle.started.catch((error: unknown) => report({ event: "refused", message: String(error) }));
if (job.mode === "wait") {
  const poll = setInterval(() => {
    const waiting = handle.status().conditions.find((condition) => condition.code === "waiting-for-node");
    if (waiting !== undefined) {
      clearInterval(poll);
      report({ event: "waiting", height: String(waiting.height) });
    }
  }, 20);
}
await handle.ended;
clearInterval(keepAlive);
