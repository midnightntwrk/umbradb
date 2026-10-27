/**
 * The configuration `npm run build:browser` bundles (`./configuration.ts`; `openspec/changes/core-arch/specs/browser/
 * spec.md` BR-1, BR-2; task 16.1): the core of the network the page's `network` parameter names (`preview` unless
 * given; with `custom`, the `genesis` parameter is its genesis hash), reading the chain from the page's `node`, from S,
 * with the core modules that may start mid-chain — `core-chain-events`, `core-block-parsed` (whose parses run in the
 * ledger worker) and `core-tx-results`; `core-ledger-state` needs history from genesis or a restored backup (LG-16,
 * BR-2), so it is not enabled. No user module and no private instance: a build with its own configuration module adds
 * them (`node browser/build.ts --configuration <module>`).
 */

import { CORE_BLOCK_PARSED } from "../../src/backbone/core-block-parsed/core-block-parsed.js";
import { CORE_CHAIN_EVENTS } from "../../src/backbone/core-chain-events/core-chain-events.js";
import { CORE_TX_RESULTS } from "../../src/backbone/core-tx-results/core-tx-results.js";
import { coreEntry, defineConfig } from "../../src/config/entries.js";
import { type BrowserConfiguration, type BrowserRun, databaseOf } from "./configuration.js";

const NETWORKS = ["mainnet", "preprod", "preview", "stagenet", "custom"] as const;

function core(run: BrowserRun) {
  const network = (NETWORKS as readonly string[]).includes(run.params.network ?? "") ? run.params.network : "preview";
  const custom = network === "custom" ? { genesisHash: run.params.genesis } : {};
  const modules = [CORE_CHAIN_EVENTS, CORE_BLOCK_PARSED, CORE_TX_RESULTS].map((module) => ({
    id: module.id,
    version: module.version,
    start: run.start,
    config: {},
  }));
  return {
    data: defineConfig({
      entries: [
        coreEntry({
          start: run.start,
          config: { network, ...custom, node: run.node, database: databaseOf(run.storage, "core"), developmentOptIn: true } as never,
        }),
        ...(modules as never[]),
      ],
    }),
    modules: [],
  };
}

const configuration: BrowserConfiguration = { core };

export default configuration;
