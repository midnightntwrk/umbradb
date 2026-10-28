import { appendFileSync } from "node:fs";
import { watchFileModes } from "./file-modes.js";

/**
 * A174's observer in a process of its own (task 15.1b; `./file-modes.ts`): loaded with `node --import tsx --import
 * <this file>` before the `umbradb` command, it watches the directory `UMBRADB_TEST_MODES_DIR` names and, when the
 * process exits, appends what it saw as one JSON line to the file `UMBRADB_TEST_MODES_LOG` names.
 */

const dir = process.env.UMBRADB_TEST_MODES_DIR;
const log = process.env.UMBRADB_TEST_MODES_LOG;
if (dir === undefined || log === undefined) {
  throw new Error("file-modes.preload.ts needs UMBRADB_TEST_MODES_DIR and UMBRADB_TEST_MODES_LOG");
}
const watch = watchFileModes(dir);
process.on("exit", () => {
  watch.stop();
  appendFileSync(log, `${JSON.stringify(watch.observations())}\n`);
});
