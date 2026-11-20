// The umbradb host's configuration: deploy.sh installs it as ~umbradb/umbradb.config.ts on every deploy. The host's
// own settings are in config.json next to it (provision.sh creates it from deploy/config.json; never overwritten).
// Each systemd instance umbradb@<network> runs it with UMBRADB_NETWORK=<network>.
import { existsSync, readFileSync } from "node:fs";
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
  versionEntry,
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
} as const;

// A restored backup's core revisions, from its manifest (deploy.sh restore writes them). Those an earlier build ran
// (another ledger build changes the core version) are kept as recorded; this build's core runs from the next height.
type Revision = {
  start: string;
  stop: string | null;
  version: string;
  data: NonNullable<Parameters<typeof versionEntry>[0]["config"]>;
};
const historyFile = `${import.meta.dirname}/history/${network}.json`;
const restored: { height: string; core: Revision[] } | undefined = existsSync(historyFile)
  ? JSON.parse(readFileSync(historyFile, "utf8"))
  : undefined;

// JSON with sorted keys, to compare core versions.
const canonical = (value: unknown): string =>
  JSON.stringify(value, (_key, v) =>
    v !== null && typeof v === "object" && !Array.isArray(v) ? Object.fromEntries(Object.entries(v).sort(([a], [b]) => (a < b ? -1 : a > b ? 1 : 0)))
      : v,
  );

function coreEntries() {
  if (restored === undefined) return [coreEntry({ start: 0, config: core })];
  const thisBuild = canonical(coreEntry({ start: 0, config: core }).version);
  const entries = restored.core.map((r) => {
    const heights = { start: Number(r.start), ...(r.stop === null ? {} : { stop: Number(r.stop) }) };
    const version = JSON.parse(r.version);
    return canonical(version) === thisBuild
      ? coreEntry({ ...heights, config: core })
      : versionEntry({ id: "core", ...heights, version, config: r.data });
  });
  const last = restored.core.at(-1);
  if (last !== undefined && canonical(JSON.parse(last.version)) !== thisBuild) {
    entries.push(coreEntry({ start: Number(restored.height) + 1, config: core }));
  }
  return entries;
}

export const modules = [TOKEN_METADATA, TOKEN_METADATA_API];

export default defineConfig({
  entries: [
    ...coreEntries(),
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
