// The umbradb host's configuration: deploy.sh installs it as ~umbradb/umbradb.config.ts on every deploy. The host's
// own settings are in config.json next to it (provision.sh creates it from deploy/config.json; never overwritten).
// Each systemd instance umbradb@<network> runs it with UMBRADB_NETWORK=<network>.
import { readFileSync } from "node:fs";
import {
  CORE_BLOCK_PARSED,
  CORE_CHAIN_EVENTS,
  CORE_CONTRACT_LOGS_FULL,
  CORE_CONTRACT_STATES,
  CORE_LEDGER_STATE,
  CORE_TX_RESULTS,
  coreEntry,
  defineConfig,
  TOKEN_METADATA,
  TOKEN_METADATA_API,
} from "umbradb";

// nginx (provision.sh) serves the API at /<network>/ and the admin endpoints at /<network>/admin/ from these ports.
const PORTS = {
  preview: { admin: "127.0.0.1:8081", api: "127.0.0.1:8091" },
  preprod: { admin: "127.0.0.1:8082", api: "127.0.0.1:8092" },
  mainnet: { admin: "127.0.0.1:8083", api: "127.0.0.1:8093" },
};

const network = process.env.UMBRADB_NETWORK as keyof typeof PORTS;
const ports = PORTS[network];
if (ports === undefined) throw new Error(`UMBRADB_NETWORK is "${network}", not one of ${Object.keys(PORTS)}`);

const settingsFile = `${import.meta.dirname}/config.json`;
const settings: Partial<Record<string, { node?: string }>> = JSON.parse(readFileSync(settingsFile, "utf8"));
const node = settings[network]?.node ?? "";
if (node === "") throw new Error(`no node URL for ${network}: set ${network}.node in ${settingsFile}`);

const core = {
  network,
  node,
  // Peer authentication over the local socket: the umbradb OS user logs in as the umbradb role.
  database: { kind: "postgres", host: "/var/run/postgresql", user: "umbradb", name: `umbradb_${network}` },
  listen: ports,
  apiDocs: "ui",
} as const;

export const modules = [TOKEN_METADATA, TOKEN_METADATA_API];

export default defineConfig({
  // A restored or exported database's revisions (deploy.sh restore, umbradb history export); none on a new database.
  history: `./history/${network}.json`,
  entries: [
    coreEntry({ start: 0, config: core }),
    CORE_CHAIN_EVENTS.entry({ start: 0, config: {} }),
    CORE_BLOCK_PARSED.entry({ start: 0, config: {} }),
    CORE_TX_RESULTS.entry({ start: 0, config: {} }),
    CORE_LEDGER_STATE.entry({ start: 0, config: {} }),
    CORE_CONTRACT_STATES.entry({ start: 0, config: {} }),
    CORE_CONTRACT_LOGS_FULL.entry({ start: 0, config: {} }),
    TOKEN_METADATA.entry({ start: 0, config: {} }),
    TOKEN_METADATA_API.entry({ start: 0, config: {} }),
  ],
});
