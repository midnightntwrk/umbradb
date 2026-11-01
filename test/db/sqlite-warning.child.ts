import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { acquirePgliteLock, quietImport, SQLITE_WARNING_HOOK } from "../../src/db/pglite-lock.js";

/**
 * A fresh process for L3's real import of `node:sqlite` (its warning is emitted once per process, at the first import),
 * run by `./sqlite-warning.test.ts` through `../library/quiet-child.ts`. Its job names a mode:
 * - `"locks-ab"`, `"locks-ba"`: two PGlite directories' locks acquired at once — their shared import of `node:sqlite`
 *   — awaited in that order;
 * - `"control"`: the negative control's import of `node:sqlite` through the same wrapper with nothing dropped.
 *
 * It writes to its result file the warnings a `warning` listener saw and whether `process.emitWarning` is the one it
 * had before; the parent reads the child's stderr whole. [L3, G2]
 */

const job = JSON.parse(process.argv[2] as string) as { readonly mode: string; readonly resultFile: string };
const warnings: string[] = [];
process.on("warning", (warning) => warnings.push(`${warning.name}: ${warning.message}`));
const original = process.emitWarning;
const root = mkdtempSync(join(tmpdir(), "umbradb-sqlite-warning-"));
try {
  if (job.mode === "control") {
    await quietImport(() => import("node:sqlite"), SQLITE_WARNING_HOOK, () => false)();
  } else {
    const a = join(root, "a");
    const b = join(root, "b");
    mkdirSync(a);
    mkdirSync(b);
    const first = acquirePgliteLock(a);
    const second = acquirePgliteLock(b);
    if (job.mode === "locks-ab") {
      await first;
      await second;
    } else {
      await second;
      await first;
    }
  }
  // A warning reaches its listeners on a later turn.
  await new Promise((resolve) => setImmediate(resolve));
  writeFileSync(job.resultFile, JSON.stringify({ warnings, restored: process.emitWarning === original }));
} finally {
  rmSync(root, { recursive: true, force: true });
}
