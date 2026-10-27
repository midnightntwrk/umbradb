import { z } from "zod";
import { CORE_BLOCK_PARSED } from "../../../src/backbone/core-block-parsed/core-block-parsed.js";
import { CORE_CHAIN_EVENTS } from "../../../src/backbone/core-chain-events/core-chain-events.js";
import { CORE_LEDGER_STATE } from "../../../src/backbone/core-ledger-state/core-ledger-state.js";
import { CORE_TX_RESULTS } from "../../../src/backbone/core-tx-results/core-tx-results.js";
import { coreEntry, defineConfig } from "../../../src/config/entries.js";
import type { ModuleDeclaration } from "../../../src/modules/declaration.js";
import {
  type BrowserConfiguration,
  type BrowserRun,
  databaseOf,
  type ProcessConfiguration,
} from "../../../browser/src/configuration.js";

/**
 * The configuration the browser build's tests bundle into their page (task 16.1; A129–A132), and that the Node.js run
 * of A132 takes too: one module for both, so "the same configuration" is the same code. Imports nothing of Node.js or
 * Vitest (the page bundles it).
 *
 * Neither process's `core` entry sets the development opt-in: the browser build sets it on every `core` entry (BR-1),
 * and A132's Node.js run does what the build does (`withDevelopmentOptIn`).
 *
 * **The core** reads the tests' `custom` network (the tape's genesis hash, the page's `genesis` parameter; every
 * `spec_version` is ledger v9's) from the page's `node`, from S, with the core modules the page's `modules` parameter
 * lists (comma-separated; `core-chain-events,core-block-parsed,core-tx-results` unless given — `core-block-parsed`'s
 * parses run in the ledger worker) and the user module `probe`, which writes, at each height, the block's hash and a
 * `jsonb` document with integers beyond 2^53 (what the JSON reader must read without loss for equal contents hashes:
 * A132's negative control reads it with `JSON.parse`), and a `double precision` third of it in a table declared
 * `deterministic: false` (Q76: the contents hash names it only, so both runs must pass the schema plan's list), and
 * whose module API answers `GET /probe/:height` with that document. With `api=1` the module API answers on the core worker's channel (`listen.api`); with `private=1` the core
 * listens for private instances on the page's network (`listen.transport` `core:1`), and with `lockstep=1` it lists the
 * private instance `p1` as lockstep.
 *
 * **The private instance `p1`** (with `private=1`) reads public data through the core's transport (`coreTransport`
 * `core:1`), from S, with the private module `shadow`, which stores each public block's hash as the core committed it.
 */

/** The page's parameter values the configuration reads (each text). */
const param = (run: BrowserRun, name: string): string | undefined => run.params[name];

/** Every `spec_version` is ledger v9's (LG-3: a `custom` network gives its own rows). */
const LEDGER_TABLE = { rows: [{ specVersionMin: 0, specVersionMax: 4_294_967_295, ledger: "v9" }] };

/** The core modules a run may enable. */
const CORE_MODULES: Readonly<Record<string, ModuleDeclaration>> = {
  [CORE_CHAIN_EVENTS.id]: CORE_CHAIN_EVENTS,
  [CORE_BLOCK_PARSED.id]: CORE_BLOCK_PARSED,
  [CORE_TX_RESULTS.id]: CORE_TX_RESULTS,
  [CORE_LEDGER_STATE.id]: CORE_LEDGER_STATE,
};

const DEFAULT_MODULES = [CORE_CHAIN_EVENTS.id, CORE_BLOCK_PARSED.id, CORE_TX_RESULTS.id].join(",");

/** The `probe` document of `height`: integers beyond 2^53, which `JSON.parse` would round. */
export function probeDocument(height: bigint): string {
  return `{"height": ${height}, "big": ${9_007_199_254_740_993n + height * 1_000n}, "list": [${2n ** 62n + height}, -${2n ** 60n}]}`;
}

/** The user module `probe` (see the module comment). */
export const PROBE: ModuleDeclaration = {
  id: "probe",
  version: "1.0.0",
  side: "public",
  requires: ["block-header"],
  provides: [
    { name: "probe-rows", lifetimes: ["table"], table: { schema: "probe", tables: ["rows"], kind: "append-only" } },
    {
      name: "probe-notes",
      lifetimes: ["table"],
      table: { schema: "probe", tables: ["notes"], kind: "append-only", deterministic: false },
    },
  ],
  startsMidChain: true,
  configSchema: z.object({}),
  migrations: [
    {
      id: "001",
      sql:
        "CREATE TABLE probe.rows (height bigint PRIMARY KEY, hash bytea NOT NULL, doc jsonb NOT NULL);\n" +
        "CREATE TABLE probe.notes (height bigint PRIMARY KEY, third double precision NOT NULL)",
    },
  ],
  points: {
    async "on-start-api"(_p, api) {
      api.http("GET", "/probe/:height", async (request, read) => {
        const [row] = await read.query("SELECT doc FROM probe.rows WHERE height = $1", [BigInt(request.params.height as string)]);
        return row === undefined
          ? { status: 404, body: { error: `no probe row at ${request.params.height}` } }
          : { status: 200, body: { readHeight: `${read.height}`, doc: row.doc } };
      });
    },
    async "on-db-write"(_p, b, w) {
      await w.execute("INSERT INTO probe.rows (height, hash, doc) VALUES ($1, $2, $3::jsonb)", [b.height, b.hash, probeDocument(b.height)]);
      await w.execute("INSERT INTO probe.notes (height, third) VALUES ($1, $2::double precision / 3)", [b.height, b.height]);
    },
  },
};

/** The private module `shadow` (see the module comment). */
export const SHADOW: ModuleDeclaration = {
  id: "shadow",
  version: "1.0.0",
  side: "private",
  requires: ["blocks"],
  provides: [
    { name: "shadow-public", lifetimes: ["block"] },
    { name: "shadow-rows", lifetimes: ["table"], table: { schema: "shadow", tables: ["rows"], kind: "append-only" } },
  ],
  startsMidChain: true,
  configSchema: z.object({}),
  migrations: [{ id: "001", sql: "CREATE TABLE shadow.rows (height bigint PRIMARY KEY, public_hash bytea NOT NULL)" }],
  points: {
    async "on-fetch"(_p, b, out, read) {
      if (read === undefined) throw new Error("shadow's on-fetch got no read of public data");
      const [row] = await read.query("SELECT hash FROM core_block_commit.blocks WHERE height = $1", [b.height]);
      if (row === undefined) throw new Error(`no public block at ${b.height} in a read at ${read.height}`);
      out.put("shadow-public", row.hash);
    },
    async "on-db-write"(_p, b, w) {
      await w.execute("INSERT INTO shadow.rows (height, public_hash) VALUES ($1, $2)", [b.height, b.items.get("shadow-public")]);
    },
  },
};

/** The core's configuration for `run` (see the module comment). */
export function coreConfiguration(run: BrowserRun): ProcessConfiguration {
  const modules = (param(run, "modules") ?? DEFAULT_MODULES).split(",").filter((id) => id !== "");
  const listen = {
    ...(param(run, "api") === "1" ? { api: "core:2" } : {}),
    ...(param(run, "private") === "1" ? { transport: "core:1" } : {}),
  };
  const transport = Object.keys(listen).length === 0 ? {} : { listen };
  const lockstep = param(run, "lockstep") === "1" ? { lockstepInstances: ["p1"] } : {};
  return {
    data: defineConfig({
      entries: [
        coreEntry({
          start: run.start,
          config: {
            network: "custom",
            genesisHash: param(run, "genesis"),
            ledgerTable: LEDGER_TABLE,
            node: run.node,
            database: databaseOf(run.storage, "core"),
            ...transport,
            ...lockstep,
          } as never,
        }),
        ...modules.map((id) => {
          const module = CORE_MODULES[id];
          if (module === undefined) throw new Error(`the tests' configuration has no core module ${id}`);
          return { id, version: module.version, start: run.start, config: {} } as never;
        }),
        { id: PROBE.id, version: PROBE.version, start: run.start, config: {} } as never,
      ],
    }),
    modules: [PROBE],
  };
}

/** The private instance `p1`'s configuration for `run` (see the module comment). */
export function privateConfiguration(run: BrowserRun): ProcessConfiguration {
  return {
    data: defineConfig({
      entries: [
        coreEntry({
          start: run.start,
          config: {
            network: "custom",
            genesisHash: param(run, "genesis"),
            ledgerTable: LEDGER_TABLE,
            database: databaseOf(run.storage, "p1"),
            instanceId: "p1",
            coreTransport: "core:1",
          } as never,
        }),
        { id: SHADOW.id, version: SHADOW.version, start: run.start, config: {} } as never,
      ],
    }),
    modules: [SHADOW],
  };
}

const configuration: BrowserConfiguration = {
  core: coreConfiguration,
  instances: (run) => (param(run, "private") === "1" ? [{ id: "p1", configure: privateConfiguration }] : []),
};

export default configuration;
