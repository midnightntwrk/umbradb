import { EventEmitter } from "node:events";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { runProcessCommand } from "../../src/cli/command.js";
import type { LedgerHost } from "../../src/ledger/worker/host.js";
import type { ProcessHandle, ProcessInput } from "../../src/runner/process.js";
import { type CliProject, cliProject, inProcess } from "./cli-fixtures.js";
import { runCoreSettings, statsConfig, statsModule } from "./run-fixtures.js";

/**
 * For the `umbradb` command, the configuration file is the host program. The ledger worker's entry imports it as the
 * main thread does, so the user modules it exports have their ledger tasks in the worker. The test runs `umbradb run`
 * in this process with its own `start`, which keeps what the command gives the runner: a public process's ledger
 * worker. Once started, the worker runs the ledger task of a user module the file exports, and UmbraDB's core modules'
 * tasks. [MD-1, LG-17; design §5.5]
 */

let project: CliProject;

/** A user module whose ledger task says where it came from: the file exports it. */
function fileTasksModule(builders: string): string {
  return [
    'import { z } from "zod";',
    `import { defineModule } from ${JSON.stringify(builders)};`,
    "",
    "export const fileTasks = defineModule({",
    '  id: "file-tasks",',
    '  version: "1.0.0",',
    '  side: "public",',
    '  requires: ["block-parsed"],',
    '  provides: [{ name: "file-item", lifetimes: ["block"] }],',
    "  startsMidChain: true,",
    "  configSchema: z.object({}),",
    "  migrations: [],",
    "  ledgerTasks: [",
    "    {",
    '      name: "file-item",',
    "      needsState: false,",
    '      run: (block) => ({ from: "the configuration file", height: block.height, transactions: block.transactions.length }),',
    "    },",
    "  ],",
    "  points: {},",
    "});",
    "",
  ].join("\n");
}

beforeAll(async () => {
  project = await cliProject();
  project.write("stats.ts", statsModule(project.builders));
  project.write("file-tasks.ts", fileTasksModule(project.builders));
}, 120_000);

afterAll(() => project?.remove());

describe("umbradb run's ledger worker (task 12.6; MD-1, LG-17)", () => {
  it("imports the configuration file in the worker: the user modules it exports have their ledger tasks there, beside UmbraDB's", { timeout: 120_000 }, async () => {
    project.write(
      "tasks.config.ts",
      statsConfig(project.builders, {
        core: runCoreSettings({ kind: "pglite", memory: true }, "ws://127.0.0.1:9/node"),
        before: ['import { fileTasks } from "./file-tasks.ts";'],
        modules: "[stats, fileTasks]",
      }),
    );
    let input: ProcessInput | undefined;
    const run = runProcessCommand({
      signals: new EventEmitter(),
      start: (given) => {
        input = given;
        return { started: Promise.resolve(), closed: Promise.resolve(), status: () => ({ ended: null }) } as unknown as ProcessHandle;
      },
    });
    await inProcess(["run", "--config", "tasks.config.ts"], project.dir, { run });
    expect(input?.ledgerWorker).toBeTypeOf("function");
    const host = (input?.ledgerWorker as () => LedgerHost)();
    try {
      const block = { height: 7n, hash: new Uint8Array(32).fill(8) };
      const named = (module: string, task: string) => ({ ...block, parentHash: new Uint8Array(32).fill(7), ledger: "v9" as const, transactions: 0, module, tasks: [task] });
      await host.parse("v9", block, []);
      expect(await host.tasks(named("file-tasks", "file-item"))).toEqual({ "file-item": { from: "the configuration file", height: 7n, transactions: 0 } });
      expect(await host.tasks(named("core-contract-logs-fast", "contract-log-sites"))).toEqual({ "contract-log-sites": [] });
      await expect(host.tasks(named("stats", "stats-rows"))).rejects.toThrow(/is not one the ledger worker has/);
    } finally {
      await host.close();
    }
  });
});
