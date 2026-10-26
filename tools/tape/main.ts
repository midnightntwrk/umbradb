/**
 * The tape tools' command line (task 9.2): `npx tsx tools/tape/main.ts record|check --node <ws-url> --out <file>`.
 * Everything it does is `./command.ts`'s (tested there); this file only connects it to the process: its arguments,
 * its output, Ctrl-C (SIGINT) or SIGTERM as the end of a recording, and its exit code.
 */

import { runTapeCommand } from "./command.js";

process.exitCode = await runTapeCommand(process.argv.slice(2), {
  out: (line) => process.stdout.write(`${line}\n`),
  err: (line) => process.stderr.write(`${line}\n`),
  // Taken over only while recording, so Ctrl-C still ends `check` as it ends any process.
  untilStopped: () =>
    new Promise<void>((resolve) => {
      process.once("SIGINT", () => resolve());
      process.once("SIGTERM", () => resolve());
    }),
});
