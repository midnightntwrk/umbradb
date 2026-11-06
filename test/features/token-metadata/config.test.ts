import { writeFileSync } from "node:fs";
import { join } from "node:path";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { type InstalledProject, installedProject, runNode } from "../../examples/example-checks.js";

/**
 * Task 4.3: a configuration file of an installed project that imports `TOKEN_METADATA` from `umbradb`, lists it in its
 * `modules` and writes its entry with `TOKEN_METADATA.entry(...)`, with `core-contract-logs-fast` and the core modules it
 * and the module require, passes `umbradb config check`. **Negative control:** the same file with the entry but without
 * the module in its `modules` fails it. (`config check` does not resolve the modules' items; a missing provider is
 * refused at startup.) [TM-1; design D9]
 */

const config = (listed: boolean) => `import { CORE_BLOCK_PARSED, CORE_CHAIN_EVENTS, CORE_CONTRACT_LOGS_FAST, coreEntry, defineConfig, TOKEN_METADATA } from "umbradb";

export const modules = [${listed ? "TOKEN_METADATA" : ""}];

const start = 1_000_000;

export default defineConfig({
  entries: [
    coreEntry({
      start,
      config: {
        network: "preview",
        node: "wss://rpc.preview.midnight.network",
        database: { kind: "pglite", path: "data/preview" },
        developmentOptIn: true,
      },
    }),
    CORE_CHAIN_EVENTS.entry({ start, config: {} }),
    CORE_BLOCK_PARSED.entry({ start, config: {} }),
    CORE_CONTRACT_LOGS_FAST.entry({ start, config: {} }),
    TOKEN_METADATA.entry({ start, config: {} }),
  ],
});
`;

describe("TOKEN_METADATA in a configuration file (task 4.3)", () => {
  let project: InstalledProject;

  beforeAll(async () => {
    project = await installedProject();
  }, 300_000);
  afterAll(() => project?.remove());

  it("passes umbradb config check, as an installed project runs it", async () => {
    writeFileSync(join(project.dir, "umbradb.config.ts"), config(true));
    const result = await runNode([project.command, "config", "check", "umbradb.config.ts"], project.dir);
    expect(result.output).toContain("passed: every check that ran passed");
    expect(result.code).toBe(0);
  }, 120_000);

  it("[NEG] fails it when the file writes the module's entry but does not list the module in its modules", async () => {
    writeFileSync(join(project.dir, "umbradb.config.ts"), config(false));
    const result = await runNode([project.command, "config", "check", "umbradb.config.ts"], project.dir);
    expect(result.code).not.toBe(0);
    expect(result.output).toContain("token-metadata");
  }, 120_000);
});
