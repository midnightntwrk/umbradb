import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { acquirePgliteLock, PGLITE_LOCK_SUFFIX, quietImport, SQLITE_WARNING_HOOK } from "../../src/db/pglite-lock.js";

/**
 * A fresh process for L3's real import of `node:sqlite` (its warning is emitted once per process, at the first import),
 * run by `./sqlite-warning.test.ts` through `../library/quiet-child.ts`. Its job names a mode:
 * - `"locks-ab"`, `"locks-ba"`: two PGlite directories' locks acquired at once — their shared import of `node:sqlite`
 *   — awaited in that order;
 * - `"fail-first"`, `"fail-second"`: two acquisitions at once, one of which fails once the import is done (its lock
 *   file's path is a directory: `open-failed`), called first or second — so that the failing one finishes first, or
 *   last: the two acquisitions after one shared import finish in their call order, and this is how either finishes first;
 * - `"another"`: while the two acquisitions' import runs (the wrapper installed), the host emits another
 *   `ExperimentalWarning`, which must reach its `warning` listener and stderr;
 * - `"replaced"`: while it runs, the host replaces `process.emitWarning`, and must keep its replacement;
 * - `"control"`: the negative control's import of `node:sqlite` through the same wrapper with nothing dropped.
 *
 * It writes to its result file the warnings a `warning` listener saw, whether `process.emitWarning` is the one it
 * had before (or, `"replaced"`, the host's replacement), and each acquisition's outcome in the order they finished; the
 * parent reads the child's stderr whole. [L3, G2]
 */

const job = JSON.parse(process.argv[2] as string) as { readonly mode: string; readonly resultFile: string };
const warnings: string[] = [];
process.on("warning", (warning) => warnings.push(`${warning.name}: ${warning.message}`));
const original = process.emitWarning;
const root = mkdtempSync(join(tmpdir(), "umbradb-sqlite-warning-"));

/** Another experimental warning, as a host's own code emits one. */
const ANOTHER = "Another feature is an experimental feature and might change at any time";

/** The host's replacement of `process.emitWarning` (`"replaced"`): it passes everything to the original. */
const replacement = ((...args: unknown[]) => (original as (...given: unknown[]) => void).apply(process, args)) as typeof process.emitWarning;

try {
  const finished: string[] = [];
  if (job.mode === "control") {
    await quietImport(() => import("node:sqlite"), SQLITE_WARNING_HOOK, () => false)();
  } else {
    const a = join(root, "a");
    const b = join(root, "b");
    const broken = join(root, "broken");
    mkdirSync(a);
    mkdirSync(b);
    mkdirSync(broken);
    // The broken directory's lock file is a directory: its acquisition fails after the shared import.
    mkdirSync(`${broken}${PGLITE_LOCK_SUFFIX}`);
    const acquire = (name: string, dir: string): Promise<void> =>
      acquirePgliteLock(dir).then(
        () => void finished.push(`${name} acquired`),
        (error: { code?: string; details?: { reason?: string } }) => void finished.push(`${name} ${error.code} ${error.details?.reason}`),
      );
    const order = job.mode === "fail-first" ? [["broken", broken], ["b", b]] : job.mode === "fail-second" ? [["a", a], ["broken", broken]] : [["a", a], ["b", b]];
    const first = acquire(order[0]?.[0] as string, order[0]?.[1] as string);
    const second = acquire(order[1]?.[0] as string, order[1]?.[1] as string);
    // The wrapper is installed now, the import running.
    if (job.mode === "another") process.emitWarning(ANOTHER, "ExperimentalWarning");
    if (job.mode === "replaced") process.emitWarning = replacement;
    if (job.mode === "locks-ba") {
      await second;
      await first;
    } else {
      await first;
      await second;
    }
  }
  // A warning reaches its listeners on a later turn.
  await new Promise((resolve) => setImmediate(resolve));
  const restored = process.emitWarning === (job.mode === "replaced" ? replacement : original);
  writeFileSync(job.resultFile, JSON.stringify({ warnings, restored, finished }));
} finally {
  rmSync(root, { recursive: true, force: true });
}
