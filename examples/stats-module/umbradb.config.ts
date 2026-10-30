import { CORE_BLOCK_PARSED, CORE_CHAIN_EVENTS, CORE_TX_RESULTS, coreEntry, defineConfig } from "umbradb";
import { statsModule } from "./stats-module.ts";

export const modules = [statsModule];

export default defineConfig({
  entries: [
    coreEntry({
      start: 0,
      config: {
        network: "preview",
        node: process.env.STATS_NODE ?? "wss://rpc.preview.midnight.network",
        database: { kind: "pglite", path: "data/preview" },
        listen: {
          api: process.env.STATS_API ?? "127.0.0.1:18080",
          admin: process.env.STATS_ADMIN ?? "127.0.0.1:18081",
        },
        developmentOptIn: true, // PGlite is a development database
      },
    }),
    CORE_CHAIN_EVENTS.entry({ start: 0, config: {} }),
    CORE_BLOCK_PARSED.entry({ start: 0, config: {} }),
    CORE_TX_RESULTS.entry({ start: 0, config: {} }),
    statsModule.entry({ start: 0, config: { countSystem: true, recentLimit: 5 } }),
  ],
});
