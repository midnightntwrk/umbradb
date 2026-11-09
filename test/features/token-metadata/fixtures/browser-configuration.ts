import { CORE_BLOCK_PARSED } from "../../../../src/backbone/core-block-parsed/core-block-parsed.js";
import { CORE_CHAIN_EVENTS } from "../../../../src/backbone/core-chain-events/core-chain-events.js";
import { CORE_CONTRACT_LOGS_FAST } from "../../../../src/backbone/core-contract-logs-fast/core-contract-logs-fast.js";
import { coreEntry, defineConfig } from "../../../../src/config/entries.js";
import { TOKEN_METADATA } from "../../../../src/features/token-metadata/token-metadata.js";
import type { ModuleDeclaration } from "../../../../src/modules/declaration.js";
import { type BrowserConfiguration, type BrowserRun, databaseOf } from "../../../../browser/src/configuration.js";

/**
 * The browser page's configuration for `token-metadata`: the core on stagenet from the page's S, with
 * `core-chain-events`, `core-block-parsed`, `core-contract-logs-fast` and `token-metadata` from S, stopping at the page's
 * `stop` parameter when given.
 */
function core(run: BrowserRun) {
  const stop = run.params.stop;
  const modules = [CORE_CHAIN_EVENTS, CORE_BLOCK_PARSED, CORE_CONTRACT_LOGS_FAST, TOKEN_METADATA as ModuleDeclaration];
  return {
    data: defineConfig({
      entries: [
        coreEntry({
          start: run.start,
          ...(stop === undefined ? {} : { stop: Number(stop) }),
          config: { network: "stagenet", node: run.node, database: databaseOf(run.storage, "core"), developmentOptIn: true },
        }),
        ...modules.map((module) => ({ id: module.id, version: module.version, start: run.start, config: {} })),
      ] as never,
    }),
    modules: [TOKEN_METADATA as ModuleDeclaration],
  };
}

const configuration: BrowserConfiguration = { core };
export default configuration;
