import { mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { startUmbraDB, type UmbraDBHandle } from "../../src/library/start-umbradb.js";
import { InMemoryBlockSource } from "../../src/runner/in-memory-source.js";
import { cursorReaches, libraryData } from "./library-fixtures.js";

/**
 * A host program whose working directory was removed under it, run by `./start-umbradb.test.ts` through
 * `./quiet-child.ts` (issue 00067): it moves into a directory of its own, removes it — `process.cwd()` then throws
 * (`ENOENT … uv_cwd`) — and starts UmbraDB three times on a PGlite directory at the relative `path` `data/db`: with the
 * job's absolute `cwd`, without `cwd`, and with a relative one. It writes how each call went to its result file: whether
 * `startUmbraDB` threw, how `started` settled, the cursor reached and the state at `closed`. [LM-1, LM-2, G8, D-14]
 */

interface Job {
  /** An existing absolute directory, the host's `cwd` in the first run. */
  readonly cwd: string;
  readonly resultFile: string;
}

const job = JSON.parse(process.argv[2] as string) as Job;

/** How one call went. */
interface Run {
  readonly name: string;
  readonly threw: string | null;
  readonly refused: { readonly code: string; readonly reason: string | null; readonly option: string | null; readonly message: string } | null;
  readonly cursor: string | null;
  readonly state: string | null;
}

const gone = mkdtempSync(join(tmpdir(), "umbradb-gone-cwd-"));
process.chdir(gone);
rmSync(gone, { recursive: true, force: true });
let cwdThrows = false;
try {
  process.cwd();
} catch {
  cwdThrows = true;
}

const database = { kind: "pglite", path: "data/db" } as const;
const runs: Run[] = [];
for (const [name, cwd] of [
  ["absolute", job.cwd],
  ["absent", undefined],
  ["relative", "sub"],
] as const) {
  let handle: UmbraDBHandle;
  try {
    handle = startUmbraDB({
      config: { data: libraryData(database) },
      ...(cwd === undefined ? {} : { cwd }),
      source: new InMemoryBlockSource({ head: 3n }),
    });
  } catch (error) {
    runs.push({ name, threw: String(error), refused: null, cursor: null, state: null });
    continue;
  }
  const refused = await handle.started.then(
    () => null,
    (error: { code?: string; message?: string; details?: { reason?: string; option?: string } }) => ({
      code: String(error.code),
      reason: error.details?.reason ?? null,
      option: error.details?.option ?? null,
      message: String(error.message),
    }),
  );
  if (refused === null) {
    await cursorReaches(handle, 3n);
    await handle.stop();
  }
  await handle.closed;
  const status = handle.status();
  runs.push({ name, threw: null, refused, cursor: status.cursor === null ? null : String(status.cursor), state: status.state });
}

writeFileSync(job.resultFile, JSON.stringify({ cwdThrows, runs }));
