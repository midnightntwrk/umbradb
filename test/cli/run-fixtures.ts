import type { ChildProcess } from "node:child_process";
import { setTimeout as sleep } from "node:timers/promises";
import { type TapeRecord, TapeNode } from "../../tools/tape/index.js";
import { type ChainBlock, chainOf, finalized, hex, opening, RUNTIME } from "../backbone/fetch-fixtures.js";
import { spawnChild } from "../child-processes.js";
import type { CliProject } from "./cli-fixtures.js";
import type { DatabaseParts } from "../../src/config/database-parts.js";

/**
 * What the tests of `umbradb run` share: a chain on a tape node, the user module `stats` as a module package's file
 * declares it, a configuration file that imports it, lists its entry and exports it in `modules`, and the command run
 * in a child process until it is signalled. [A152, CF-1, LS-6, MD-1, Q106 B]
 *
 * The chain is synthetic, in the node's own answer shapes (`test/backbone/fetch-fixtures.ts`): blocks 0–5, the head 5,
 * the process starting at S = 1. The `core` entry's network is `custom`, its genesis hash the chain's block 0 and its
 * ledger table one row (every `spec_version` is ledger v9's), so the configured network and the node agree. Its admin
 * listener is on `127.0.0.1:0` (the process logs the port), never the default `0.0.0.0:8081` on a shared machine.
 * [CF-4]
 */

/** The chain's blocks 0 to {@link HEAD}. */
export const HEAD = 5n;
export const CHAIN: readonly ChainBlock[] = Object.freeze(chainOf(HEAD));

/** The chain's tape: the opening of a new database (block 0, the subscriptions, the head), then heights 1 to 5. */
export function chainTape(): TapeRecord[] {
  const at = (height: bigint) => CHAIN[Number(height)] as ChainBlock;
  return [
    ...opening(at(0n), at(HEAD)),
    ...finalized(at(1n), RUNTIME, true),
    ...[2n, 3n, 4n, 5n].flatMap((height) => finalized(at(height))),
  ];
}

/** A tape node serving {@link chainTape}. */
export function chainNode(): Promise<TapeNode> {
  return TapeNode.start({ records: chainTape() });
}

/** The ledger table of the tests' custom network: every `spec_version` is ledger v9's. [LG-3] */
const LEDGER_TABLE = { rows: [{ specVersionMin: 0, specVersionMax: 4_294_967_295, ledger: "v9" }] };

/** The `core` settings of a process on `database` reading the chain from `node` (see the module comment). */
export function runCoreSettings(database: DatabaseParts, node: string, extra: Readonly<Record<string, unknown>> = {}): string {
  return JSON.stringify({
    network: "custom",
    genesisHash: hex((CHAIN[0] as ChainBlock).hash),
    ledgerTable: LEDGER_TABLE,
    database,
    node,
    developmentOptIn: true,
    listen: { admin: "127.0.0.1:0" },
    ...extra,
  });
}

/**
 * The user module `stats` 1.2.0 as its package's file declares it, importing `defineModule` from `builders` and `zod`:
 * at every height it writes a row with its data setting `label` (recorded in the history), which is how a test sees
 * that it runs. `pollMs` is an operational setting from 1. [CF-4]
 */
export function statsModule(builders: string, id = "stats"): string {
  const schema = id.replaceAll("-", "_");
  return [
    'import { z } from "zod";',
    `import { defineModule } from ${JSON.stringify(builders)};`,
    "",
    `export const ${id.replaceAll("-", "")} = defineModule({`,
    `  id: ${JSON.stringify(id)},`,
    '  version: "1.2.0",',
    '  side: "public",',
    '  requires: ["block-header"],',
    `  provides: [{ name: "${id}-rows", lifetimes: ["table"], table: { schema: "${schema}", tables: ["rows"], kind: "append-only" } }],`,
    "  startsMidChain: true,",
    "  configSchema: z.object({",
    '    label: z.string().min(1).meta({ kind: "data" }),',
    '    pollMs: z.number().int().min(1).default(1000).meta({ kind: "operational" }),',
    "  }),",
    `  migrations: [{ id: "001", sql: "CREATE TABLE ${schema}.rows (height bigint PRIMARY KEY, label text NOT NULL)" }],`,
    "  points: {",
    '    async "on-db-write"(_p, b, w) {',
    `      await w.execute("INSERT INTO ${schema}.rows (height, label) VALUES ($1, $2)", [b.height, b.settings.label]);`,
    "    },",
    "  },",
    "});",
    "",
  ].join("\n");
}

/** What a configuration file of these tests holds besides its `core` entry. */
export interface StatsConfig {
  /** The `core` settings (JSON). */
  readonly core: string;
  /** `stats.entry`'s `config` (a TypeScript expression); `{ label: "s" }` unless given. */
  readonly statsConfig?: string;
  /** The `modules` export (a TypeScript expression), or none; `[stats]` unless given. */
  readonly modules?: string | null;
  /** The import of the module's file; `./stats.ts` unless given. */
  readonly statsFile?: string;
  /** More lines before the default export. */
  readonly before?: readonly string[];
  /** More entries (TypeScript expressions). */
  readonly entries?: readonly string[];
}

/**
 * A configuration file that imports `stats`, lists `stats.entry({ start: 1, config })` and — unless `modules` is null —
 * exports `modules`: the scenario "A user module from the configuration file". [CF-1]
 */
export function statsConfig(builders: string, options: StatsConfig): string {
  const modules = options.modules === undefined ? "[stats]" : options.modules;
  return [
    `import { coreEntry, defineConfig } from ${JSON.stringify(builders)};`,
    `import { stats } from ${JSON.stringify(options.statsFile ?? "./stats.ts")};`,
    ...(options.before ?? []),
    ...(modules === null ? [] : [`export const modules = ${modules};`]),
    "export default defineConfig({",
    "  entries: [",
    `    coreEntry({ start: 1, config: ${options.core} }),`,
    `    stats.entry({ start: 1, config: ${options.statsConfig ?? '{ label: "s" }'} }),`,
    ...(options.entries ?? []).map((entry) => `    ${entry},`),
    "  ],",
    "});",
    "",
  ].join("\n");
}

/** The admin listener's port in a process's log (`admin endpoints listening on 127.0.0.1:<port>`), or null. */
export function adminPortIn(log: string): number | null {
  const match = /admin endpoints listening on 127\.0\.0\.1:(\d+)/.exec(log);
  return match === null ? null : Number(match[1]);
}

/** `umbradb run` in a child process (the bundled command), its output as it comes. */
export interface RunningCommand {
  readonly child: ChildProcess;
  stdout(): string;
  stderr(): string;
  /** Resolves with the exit code (−1 for a signal that ended it) once it ended. */
  readonly exited: Promise<number>;
  /** Resolves with the admin listener's port once the process logged it; rejects if it ended first or `patienceMs` passed. */
  adminPort(patienceMs: number): Promise<number>;
}

/** Starts `node <cli> run …args` in `cwd` (see {@link RunningCommand}). */
export function runInChild(project: CliProject, args: readonly string[], cwd: string = project.dir): RunningCommand {
  const child = spawnChild(process.execPath, [project.cli, "run", ...args], {
    cwd,
    env: { ...process.env },
    stdio: ["ignore", "pipe", "pipe"],
  });
  let out = "";
  let err = "";
  child.stdout?.setEncoding("utf8").on("data", (chunk: string) => {
    out += chunk;
  });
  child.stderr?.setEncoding("utf8").on("data", (chunk: string) => {
    err += chunk;
  });
  let ended = false;
  const exited = new Promise<number>((resolve, reject) => {
    child.on("error", reject);
    child.on("close", (code) => {
      ended = true;
      resolve(code ?? -1);
    });
  });
  return {
    child,
    stdout: () => out,
    stderr: () => err,
    exited,
    async adminPort(patienceMs) {
      const deadline = Date.now() + patienceMs;
      for (;;) {
        const port = adminPortIn(err);
        if (port !== null) return port;
        if (ended) throw new Error(`umbradb run ended before its admin listener listened:\n${out}\n${err}`);
        if (Date.now() > deadline) throw new Error(`no admin listener within ${patienceMs} ms:\n${out}\n${err}`);
        await sleep(25);
      }
    },
  };
}

/** Resolves with `exited` unless it takes longer than `ms`: then kills the child and rejects. */
export async function exitWithin(run: RunningCommand, ms: number): Promise<number> {
  let timer: NodeJS.Timeout | undefined;
  const late = new Promise<never>((_, reject) => {
    timer = setTimeout(() => {
      run.child.kill("SIGKILL");
      reject(new Error(`umbradb run did not exit within ${ms} ms of its signal:\n${run.stdout()}\n${run.stderr()}`));
    }, ms);
  });
  try {
    return await Promise.race([run.exited, late]);
  } finally {
    clearTimeout(timer);
  }
}
