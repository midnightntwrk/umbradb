import postgres from "postgres";
import { NodeBlockSource, nodeSourceOf } from "../../src/backbone/core-block-fetch/index.js";
import type { MetadataBlock, RuntimeMetadataEntry } from "../../src/ledger/metadata.js";
import type { NodeClient } from "../../src/node/client.js";
import { startProcess } from "../runner/process-build.js";
import { chainDeclarations } from "./chain-build.js";
import { fenceAt, watched, watcher } from "./ingest-harness.js";

/**
 * A process for the crash test. `ingest-crash.test.ts` starts it with `node --import tsx` and one JSON argument
 * ({@link CrashJob}). It runs:
 * - the process as `umbradb run` starts it: `startProcess` with the configuration file and the node source
 *   (`nodeSourceOf`) over the tape node the test serves;
 * - the chain's build with the watching module, as the test's restart builds it.
 * [A76, IN-1]
 *
 * It reports `queued` (one JSON line on stdout) once the finalized head is committed and its queue is full. The test
 * sets `tipCap` to 20, so `finality-stall` means 20 best blocks are queued. The test then kills it with SIGKILL. [IN-6]
 *
 * With `tipsTo`, it runs a negative control's node source instead. That source writes each best block it fetches into
 * the watching module's table, on a connection of its own to that PostgreSQL database. This is tip writing, which the
 * core forbids. [IN-1]
 *
 * It exits by itself once its parent is no longer the test's (Vitest's bail, a test's timeout).
 */

export interface CrashJob {
  readonly configFile: string;
  /** The finalized head of the tape, which the process commits before it reports. */
  readonly finalized: string;
  /** The PostgreSQL database a control's source writes best blocks into. */
  readonly tipsTo?: string;
}

export type CrashEvent =
  | { readonly event: "queued"; readonly height: string }
  | { readonly event: "refused"; readonly message: string };

function report(event: CrashEvent): void {
  process.stdout.write(`${JSON.stringify(event)}\n`);
}

const job = JSON.parse(process.argv[2] as string) as CrashJob;
const parent = process.ppid;
const orphanGuard = setInterval(() => {
  if (process.ppid !== parent) process.exit(4);
}, 1_000);

/** The control's source: every best block it fetches written into `watch.rows` (see the module comment). */
function tipWriter(url: string): typeof NodeBlockSource {
  const sql = postgres(url, { max: 1, onnotice: () => undefined });
  return class extends NodeBlockSource {
    protected override async metadataOf(block: MetadataBlock, best: boolean): Promise<RuntimeMetadataEntry> {
      if (best) await sql`INSERT INTO watch.rows (height, hash) VALUES (${block.height.toString()}, ${Buffer.from(block.hash)})`;
      return super.metadataOf(block, best);
    }
  };
}

const handle = startProcess({
  declarations: chainDeclarations([watcher(watched()), fenceAt(BigInt(job.finalized))]),
  config: { file: job.configFile },
  source: (core, shared) => {
    if (job.tipsTo === undefined) return nodeSourceOf(core, shared);
    const settings = core.settings as { readonly prefetchWindow: number; readonly tipCap: number };
    const Writer = tipWriter(job.tipsTo);
    return new Writer({ client: shared.nodeClient as NodeClient, prefetchWindow: settings.prefetchWindow, tipCap: settings.tipCap });
  },
  log: () => undefined,
});
handle.started.catch((error: unknown) => report({ event: "refused", message: String(error) }));
const poll = setInterval(() => {
  const status = handle.status();
  const stall = status.conditions.find((condition) => condition.code === "finality-stall");
  if (stall !== undefined && "height" in stall && status.cursor === BigInt(job.finalized)) {
    clearInterval(poll);
    report({ event: "queued", height: String(stall.height) });
  }
}, 20);
await handle.closed;
clearInterval(orphanGuard);
