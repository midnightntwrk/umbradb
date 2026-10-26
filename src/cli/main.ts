#!/usr/bin/env node
/**
 * The `umbradb` command's entry (`package.json` `bin`; LS-6): runs the command of the process's arguments
 * (`./command.ts`) and sets its exit status. Left out of the coverage report, as it runs only as a process of its own
 * (`test/cli/umbradb.test.ts`, the pack smoke test); {@link runMain} itself is covered.
 */

import { runMain } from "./command.js";

await runMain(process);
