/**
 * The private shielded sync module's declaration (spec FR-002, FR-003): a public-side module that requires the core's
 * ledger events and states, owns no tables, starts at any height (`startsMidChain`), and registers its routes in
 * `on-start-api`. `./module.ts` passes it to `defineModule`; it imports only types from `umbradb`, so a test can run
 * it through UmbraDB's own sources.
 */

import type { ModuleDeclaration, ProcessContext } from "umbradb";
import { type PssOptions, PssServer, settingsOfContext } from "./server.ts";
import { SETTINGS_SCHEMA } from "./settings.ts";

/** The module's id; its entry in a configuration file is `pssModule.entry({ start, config })`. */
export const PSS_MODULE_ID = "private-shielded-sync";
export const PSS_MODULE_VERSION = "0.1.0";

/** The declaration, with one server per process context. */
export function pssDeclaration(options: PssOptions = {}) {
  const servers = new WeakMap<ProcessContext, PssServer>();
  const serverOf = (p: ProcessContext): PssServer => {
    const server = servers.get(p);
    if (server === undefined) throw new Error("the private-shielded-sync module's on-start-db has not run in this process");
    return server;
  };
  return {
    id: PSS_MODULE_ID,
    version: PSS_MODULE_VERSION,
    side: "public",
    // `ledger-events`: core_ledger_state.events and each block's events; `ledger-state`: core_ledger_state.states and
    // each block's tree values; `blocks`: block hashes; `config`: the network's name.
    requires: ["ledger-events", "ledger-state", "blocks", "config"],
    provides: [],
    startsMidChain: true,
    configSchema: SETTINGS_SCHEMA,
    migrations: [],
    points: {
      async "on-start-db"(p, w) {
        const server = new PssServer(settingsOfContext(p), options);
        servers.set(p, server);
        await server.start(w);
        options.observe?.(server);
      },
      async "on-start-api"(p, api) {
        serverOf(p).routes(p, api);
      },
      async "on-finalized"(p, head) {
        serverOf(p).finalized(head.height);
      },
      async "on-db-write"(p, b) {
        serverOf(p).stash(b);
      },
      async "on-after-db-write"(p, b, read) {
        await serverOf(p).committed(b, read);
      },
    },
  } satisfies ModuleDeclaration;
}
