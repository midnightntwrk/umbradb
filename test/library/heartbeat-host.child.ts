import { writeFileSync } from "node:fs";
import { engineInputOf, handleOf, startUmbraDB, type UmbraDBOptions } from "../../src/library/start-umbradb.js";
import { InMemoryBlockSource } from "../../src/runner/in-memory-source.js";
import { startProcess } from "../runner/process-build.js";
import { cursorReaches, libraryData, PGLITE_MEMORY, rowsModule } from "./library-fixtures.js";

/**
 * A host program for the last clause, run by `./mounted-admin.test.ts`: it starts UmbraDB with no listener (its admin
 * mounted only), lets it reach the in-memory head, writes its result file and returns without stopping it. Nothing of
 * UmbraDB's own may then keep the event loop alive: the process must end by itself. `mode: "control"` starts the same
 * through the engine with the negative control's heartbeat, whose timer keeps Node.js running.
 */

interface Job {
  readonly mode: "library" | "control";
  readonly resultFile: string;
}

const job = JSON.parse(process.argv[2] as string) as Job;
const m = rowsModule("m");
const options: UmbraDBOptions = {
  config: { data: libraryData(PGLITE_MEMORY, [m]) },
  modules: [m],
  source: new InMemoryBlockSource({ head: 2n }),
};
const handle =
  job.mode === "library"
    ? startUmbraDB(options)
    : (() => {
        const { input } = engineInputOf(options);
        return handleOf(startProcess({ ...input, adminSeams: { heartbeatKeepsAlive: true } }));
      })();
await handle.started;
await cursorReaches(handle, 2n);
writeFileSync(job.resultFile, JSON.stringify({ reached: String(handle.status().cursor) }));
