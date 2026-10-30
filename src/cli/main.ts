#!/usr/bin/env node
/**
 * The `umbradb` command's entry (`package.json` `bin`): runs the command of the process's arguments (`./command.ts`)
 * and sets its exit status. It is left out of the coverage report, as it runs only as a process of its own
 * (`test/cli/umbradb.test.ts`, the pack smoke test); {@link runMain} itself is covered. [LS-6]
 */

import { runMain } from "./command.js";

await runMain(process);
