import { PGlite } from "@electric-sql/pglite";
import { chmodSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { setTimeout as sleep } from "node:timers/promises";
import { cursorHeight } from "../../src/backbone/core-block-commit/core-block-commit.js";
import { readManifestLine, type Manifest } from "../../src/backup/manifest.js";
import { commandBuild } from "../../src/cli/build-modules.js";
import { loadConfig } from "../../src/config/load.js";
import type { CommittedHeight, ReadHandle } from "../../src/db/api.js";
import { openPglite, PGLITE_START_PARAMS } from "../../src/db/pglite.js";
import { openPostgres } from "../../src/db/postgres.js";
import { contentsHash } from "../../src/determinism/contents-hash.js";
import { InMemoryBlockSource } from "../../src/runner/in-memory-source.js";
import type { BackupSignals, ProcessHandle, ProcessInput } from "../../src/runner/process.js";
import { spawnChild } from "../child-processes.js";
import type { CliProject } from "../cli/cli-fixtures.js";
import { startPostgresServer, type PostgresTestServer } from "../db/postgres-server.js";
import { coreSettings, startProcess } from "../runner/process-build.js";

/**
 * What the backups' tests share (tasks 15.1, 15.2; BK-1 to BK-4, PP-12; `design.md` §9.1).
 *
 * **The chain and the build.** A process over an in-memory block source (`InMemoryBlockSource`, its blocks committing as
 * fast as the database takes them) with the `umbradb` command's build — UmbraDB's backbone with the real `core-digest`
 * — and one user module, `ticker`, from a configuration file of a command project (`../cli/cli-fixtures.ts`), so that
 * `umbradb backup` reads the same file and build: at every height `ticker` appends a row to `ticker.rows`, updates the
 * one row of `ticker.tally` (the height and a running total) and appends a row to `ticker.log`, a table declared
 * `deterministic: false` with a `serial` key and a `now()` time (Q76), which a backup carries and the contents hash
 * records by name only. Every table of a database at height h is then a function of h. Its migration also makes a
 * routine and an enum in its schema, whose owners and privileges a restore gives back (A125).
 *
 * **The tools.** `pg_dump` 18 is never assumed on the machine: the PostgreSQL server's container runs the pinned image
 * (`test/postgres-image.ts`), whose PostgreSQL 18.6 client the backup runs through a wrapper named by
 * `UMBRADB_PG_DUMP` ({@link BackupBackend.env}): a script that runs `docker exec -i` of that container's `pg_dump` with
 * the arguments it was given, the `--dbname` URL's host and port turned into the container's own (`127.0.0.1:5432`),
 * the password passed on in `PGPASSWORD` as the backup gives it. `pglite-tools` is the exact development dependency
 * (0.4.10, PGlite 0.5.10's).
 *
 * **Loading a dump without the restore** ({@link BackupBackend.load}, task 15.1's own view of a backup): the file into a
 * new database by PostgreSQL's own `psql` in the same container (`-v ON_ERROR_STOP=1`), or by PGlite's `exec` on a new
 * engine started with the backend's start parameters, the `psql` meta-commands (`\restrict`, `\unrestrict`) left out.
 */

/** How long a process may take to reach a height on a loaded machine. */
export const PATIENCE_MS = Number(process.env.UMBRADB_TEST_PATIENCE_MS ?? 300_000);

/**
 * The module `ticker`, as a module package's file declares it, importing `defineModule` from `builders`; `variant`
 * gives another version, or another text of its migration (a build that changed it).
 */
export function tickerModule(
  builders: string,
  variant: { readonly version?: string; readonly migrationComment?: string } = {},
): string {
  return [
    'import { z } from "zod";',
    `import { defineModule } from ${JSON.stringify(builders)};`,
    "",
    "export const ticker = defineModule({",
    '  id: "ticker",',
    `  version: ${JSON.stringify(variant.version ?? "1.0.0")},`,
    '  side: "public",',
    '  requires: ["block-header"],',
    "  provides: [",
    '    { name: "ticker-rows", lifetimes: ["table"], table: { schema: "ticker", tables: ["rows", "tally"], kind: "mutable" } },',
    '    { name: "ticker-log", lifetimes: ["table"], table: { schema: "ticker", tables: ["log"], kind: "append-only", deterministic: false } },',
    "  ],",
    "  startsMidChain: true,",
    "  configSchema: z.object({}),",
    "  migrations: [{",
    '    id: "001",',
    "    sql: `CREATE TABLE ticker.rows (height bigint PRIMARY KEY, note text NOT NULL);",
    "CREATE TABLE ticker.tally (id smallint PRIMARY KEY, height bigint NOT NULL, total bigint NOT NULL);",
    "INSERT INTO ticker.tally (id, height, total) VALUES (1, 0, 0);",
    "CREATE FUNCTION ticker.triangle(h bigint) RETURNS bigint LANGUAGE sql IMMUTABLE AS 'SELECT h * (h + 1) / 2';",
    "CREATE TYPE ticker.mood AS ENUM ('calm', 'busy');",
    `CREATE TABLE ticker.log (id serial PRIMARY KEY, height bigint NOT NULL, at timestamptz NOT NULL DEFAULT now());${variant.migrationComment === undefined ? "" : ` -- ${variant.migrationComment}`}\`,`,
    "  }],",
    "  points: {",
    '    async "on-db-write"(_p, b, w) {',
    '      await w.execute("INSERT INTO ticker.rows (height, note) VALUES ($1, $2)", [b.height, `line;\\n\'${b.height}\'`]);',
    '      await w.execute("UPDATE ticker.tally SET height = $1, total = total + $1 WHERE id = 1", [b.height]);',
    '      await w.execute("INSERT INTO ticker.log (height) VALUES ($1)", [b.height]);',
    "    },",
    "  },",
    "});",
    "",
  ].join("\n");
}

/** The tables `ticker` declares `deterministic: false`. */
export const TICKER_OPTED_OUT = Object.freeze([Object.freeze({ schema: "ticker", table: "log" })]);

/** What a configuration file of these tests holds besides `ticker`'s entry. */
export interface TickerConfig {
  /** The `database` setting. */
  readonly database: string;
  /** The core's stop. */
  readonly stop?: number;
  /** More `core` settings (`backupAtStop`, `developmentOptIn`). */
  readonly extra?: Readonly<Record<string, unknown>>;
  /** The module file `ticker` is imported from; `./ticker.ts` unless given. */
  readonly module?: string;
  /** `ticker`'s entry (a TypeScript expression); `ticker.entry({ start: 1, config: {} })` unless given, none for null. */
  readonly entry?: string | null;
  /** S; 1 unless given. */
  readonly start?: number;
}

let files = 0;

/**
 * Writes a configuration file (under its own name: Node.js caches a file's first evaluation) that imports `ticker`,
 * exports `modules = [ticker]` and lists the core from S = 1 and `ticker` from 1; returns its absolute path.
 */
export function writeTickerConfig(project: CliProject, options: TickerConfig): string {
  files += 1;
  const core = JSON.stringify(coreSettings(options.database, { listen: { admin: "127.0.0.1:0" }, ...options.extra }));
  const stop = options.stop === undefined ? "" : `, stop: ${options.stop}`;
  return project.write(
    `backup-${files}.config.ts`,
    [
      `import { coreEntry, defineConfig, versionEntry } from ${JSON.stringify(project.builders)};`,
      `import { ticker } from ${JSON.stringify(options.module ?? "./ticker.ts")};`,
      "void versionEntry;",
      "export const modules = [ticker];",
      "export default defineConfig({",
      "  entries: [",
      `    coreEntry({ start: ${options.start ?? 1}${stop}, config: ${core} }),`,
      ...(options.entry === null ? [] : [`    ${options.entry ?? "ticker.entry({ start: 1, config: {} })"},`]),
      "  ],",
      "});",
      "",
    ].join("\n"),
  );
}

/** A process of a ticker configuration file over an in-memory chain whose head is `head`. */
export interface TickerProcess {
  readonly handle: ProcessHandle;
  readonly source: InMemoryBlockSource;
  readonly lines: string[];
  /** Waits until the cursor is at least `height`; rejects if processing ends first or `PATIENCE_MS` passes. */
  reach(height: bigint): Promise<void>;
  /**
   * Raises the chain's head by one block every {@link FEED_MS} until it is `to`, as a node finalizes blocks, and stops
   * when processing ends. Without it the in-memory source holds every block from the start, and on PGlite the loop then
   * never yields to the event loop (its statements settle within microtasks): nothing timed — a poll, a backup asked for
   * meanwhile — runs before the last block commits. Fed, the loop waits for each block, as it waits for a node.
   */
  feed(to: bigint): void;
}

/** How often {@link TickerProcess.feed} finalizes the next block. */
export const FEED_MS = 5;

/** What {@link startTicker} takes besides the file and the chain. */
export interface TickerOptions {
  /** Where SIGUSR2 comes from (`backupOnSignal`): a test's emitter in place of Node.js's `process`. */
  readonly backupSignals?: BackupSignals;
}

/**
 * Starts the process of the configuration `file` over an in-memory chain up to `head` (see the module comment), or over
 * `chain` — the configuration's node through `core-block-fetch`'s node source (`nodeSourceOf`), say.
 */
export async function startTicker(
  file: string,
  head: bigint,
  chain?: ProcessInput["source"],
  options: TickerOptions = {},
): Promise<TickerProcess> {
  const loaded = await loadConfig({ file });
  const source = new InMemoryBlockSource({ head });
  const lines: string[] = [];
  const handle = startProcess({
    declarations: commandBuild(loaded.modules),
    config: { data: loaded.data, file: loaded.file },
    source: chain ?? source,
    ...(options.backupSignals === undefined ? {} : { backupSignals: options.backupSignals }),
    log: (line) => lines.push(line),
  });
  return {
    handle,
    source,
    lines,
    feed(to) {
      const timer = setInterval(() => {
        if (source.head >= to || handle.status().ended !== null) clearInterval(timer);
        else source.finalize(source.head + 1n);
      }, FEED_MS);
      void handle.ended.finally(() => clearInterval(timer));
    },
    async reach(height) {
      const deadline = Date.now() + PATIENCE_MS;
      for (;;) {
        const status = handle.status();
        if (status.cursor !== null && status.cursor >= height) return;
        if (status.ended !== null) throw new Error(`processing ended (${status.ended.kind}) at ${String(status.cursor)}: ${lines.join(" | ")}`);
        if (Date.now() > deadline) throw new Error(`the cursor is ${String(status.cursor)}, not ${height}, after ${PATIENCE_MS} ms`);
        await sleep(10);
      }
    },
  };
}

/** One database of a test, by its `database` setting. */
export interface BackupDatabase {
  readonly setting: string;
  /** Runs `body` on a read through the database API (PGlite: only while no process holds the directory). */
  read<T>(body: (read: ReadHandle) => Promise<T>, committedHeight?: CommittedHeight): Promise<T>;
  /** One statement's rows, through a read. */
  query(sql: string): Promise<Record<string, unknown>[]>;
}

/** A backend of the backups' tests. */
export interface BackupBackend {
  readonly name: string;
  readonly kind: "postgres" | "pglite";
  start(): Promise<void>;
  stop(): Promise<void>;
  database(): Promise<BackupDatabase>;
  /** What a backup's environment needs: `PATH`, and on PostgreSQL `UMBRADB_PG_DUMP` naming the container's `pg_dump`. */
  env(): Record<string, string>;
  /** Loads the backup file `file` into a new database, as PostgreSQL's `psql` or PGlite's `exec` runs it. */
  load(file: string): Promise<BackupDatabase>;
}

/** The text a PGlite engine runs of a backup file: every line but `psql`'s meta-commands. */
function pgliteText(file: string): string {
  return readFileSync(file, "utf8")
    .split("\n")
    .filter((line) => !line.startsWith("\\"))
    .join("\n");
}

/**
 * The wrapper script that runs the container's `pg_dump` (see the module comment): a POSIX shell script that rewrites
 * the `--dbname` URL's host and port to the container's own and `exec`s `docker exec -i`, passing `PGPASSWORD` and
 * `PGAPPNAME` on.
 */
function pgDumpWrapper(container: string): string {
  return [
    "#!/bin/sh",
    "for arg do",
    "  shift",
    '  case "$arg" in',
    "    --dbname=*) arg=$(printf '%s' \"$arg\" | sed -E 's#@[^/]*/#@127.0.0.1:5432/#') ;;",
    "  esac",
    '  set -- "$@" "$arg"',
    "done",
    `exec docker exec -i -e PGPASSWORD -e PGAPPNAME ${container} pg_dump "$@"`,
    "",
  ].join("\n");
}

/** Writes an executable script `name` into `dir` and returns its path. */
export function writeScript(dir: string, name: string, text: string): string {
  mkdirSync(dir, { recursive: true });
  const path = join(dir, name);
  writeFileSync(path, text);
  chmodSync(path, 0o755);
  return path;
}

/** Runs `docker exec -i <container> <command…>` with `input` on its stdin; rejects unless it exits 0. */
function dockerExec(container: string, command: readonly string[], input: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const child = spawnChild("docker", ["exec", "-i", container, ...command], { stdio: ["pipe", "pipe", "pipe"] });
    let stderr = "";
    child.stderr?.setEncoding("utf8").on("data", (chunk: string) => {
      stderr += chunk;
    });
    child.stdout?.resume();
    child.once("error", reject);
    child.once("close", (code) => (code === 0 ? resolve() : reject(new Error(`${command[0]} exited ${code}: ${stderr}`))));
    child.stdin?.end(input);
  });
}

function postgresBackend(): BackupBackend {
  let server: PostgresTestServer | undefined;
  let tools: string | undefined;
  const of = (url: string): BackupDatabase => {
    const read = async <T>(body: (read: ReadHandle) => Promise<T>, committedHeight: CommittedHeight = cursorHeight) => {
      const db = openPostgres({ url, committedHeight, readConnections: 1 });
      try {
        return await db.read(body);
      } finally {
        await db.close();
      }
    };
    return { setting: url, read, query: (sql) => read((r) => r.query(sql)) };
  };
  return {
    name: "PostgreSQL 18",
    kind: "postgres",
    async start() {
      server = await startPostgresServer();
      tools = mkdtempSync(join(tmpdir(), "umbradb-backup-tools-"));
      writeScript(tools, "pg_dump", pgDumpWrapper(server.container.getId()));
    },
    async stop() {
      if (tools !== undefined) rmSync(tools, { recursive: true, force: true });
      await server?.stop();
    },
    async database() {
      if (server === undefined) throw new Error("backend not started");
      return of((await server.createDatabase()).url);
    },
    env: () => ({ PATH: String(process.env.PATH), UMBRADB_PG_DUMP: join(tools as string, "pg_dump") }),
    async load(file) {
      if (server === undefined) throw new Error("backend not started");
      const created = await server.createDatabase();
      const url = new URL(created.url);
      url.hostname = "127.0.0.1";
      url.port = "5432";
      const psql = ["psql", "-X", "-q", "-v", "ON_ERROR_STOP=1", `--dbname=${url}`];
      await dockerExec(server.container.getId(), psql, readFileSync(file, "utf8"));
      return of(created.url);
    },
  };
}

function pgliteBackend(): BackupBackend {
  let root: string | undefined;
  let next = 0;
  const directory = () => join(root as string, `db-${next++}`);
  const of = (dir: string): BackupDatabase => {
    const read = async <T>(body: (read: ReadHandle) => Promise<T>, committedHeight: CommittedHeight = cursorHeight) => {
      const db = await openPglite({ dataDir: dir, committedHeight, developmentOptIn: true });
      try {
        return await db.read(body);
      } finally {
        await db.close();
      }
    };
    return { setting: `pglite:${dir}`, read, query: (sql) => read((r) => r.query(sql)) };
  };
  return {
    name: "PGlite 0.5.10",
    kind: "pglite",
    async start() {
      root = mkdtempSync(join(tmpdir(), "umbradb-backup-"));
    },
    async stop() {
      if (root !== undefined) rmSync(root, { recursive: true, force: true });
    },
    async database() {
      if (root === undefined) throw new Error("backend not started");
      return of(directory());
    },
    env: () => ({ PATH: String(process.env.PATH) }),
    async load(file) {
      if (root === undefined) throw new Error("backend not started");
      const dir = directory();
      const engine = await PGlite.create(dir, { startParams: [...PGLITE_START_PARAMS] });
      try {
        await engine.exec(pgliteText(file));
      } finally {
        await engine.close();
      }
      return of(dir);
    },
  };
}

/** PostgreSQL 18.6 and PGlite 0.5.10. */
export const BACKUP_BACKENDS: readonly BackupBackend[] = [postgresBackend(), pgliteBackend()];

/** A backup file's manifest. */
export function manifestOf(file: string): Manifest {
  const text = readFileSync(file, "utf8");
  return readManifestLine(text.slice(0, text.indexOf("\n")));
}

/** The contents hash of `db` as `0x` hex, `ticker.log` recorded by name only. */
export async function hashOf(db: BackupDatabase): Promise<string> {
  const hash = await db.read((read) => contentsHash(read, { optedOut: TICKER_OPTED_OUT }));
  return `0x${Buffer.from(hash).toString("hex")}`;
}

/**
 * The height every table of a ticker database holds (see the module comment), table by table: the highest committed
 * block, `ticker.rows`' last height and count, `ticker.tally`'s height, `ticker.log`'s last height, the highest height
 * any per-table digest was changed at.
 */
export async function tableHeights(db: BackupDatabase): Promise<Record<string, string>> {
  const [row] = await db.query(`SELECT
    (SELECT max(height) FROM core_block_commit.blocks)::text AS blocks,
    (SELECT max(height) FROM ticker.rows)::text AS rows,
    (SELECT count(*) FROM ticker.rows)::text AS row_count,
    (SELECT height FROM ticker.tally WHERE id = 1)::text AS tally,
    (SELECT max(height) FROM ticker.log)::text AS log,
    (SELECT max(height) FROM core_digest.tables)::text AS digests`);
  return row as Record<string, string>;
}

/** What {@link tableHeights} gives for a database at height `h` (S = 1; each table changes at every height). */
export function heightsAt(h: string): Record<string, string> {
  return { blocks: h, rows: h, row_count: h, tally: h, log: h, digests: h };
}

/** An ACL column's privileges as text, its items in one order (an ACL's order changes no privilege). */
const acl = (column: string) =>
  `coalesce((SELECT string_agg(item::text, ',' ORDER BY item::text COLLATE "C") FROM unnest(${column}) AS item), '')`;

/**
 * The owners and privileges of a database's schemas, relations, routines, enums, domains, ranges and default privileges,
 * one line each (A125:
 * "compared in the catalogs"): PostgreSQL's own schemas left out; each ACL's items sorted, since the order in which
 * grants were made — migrations under default privileges, or a restore's grants after it — changes no privilege. The
 * login's name is in them (an owner, a grantor), so two databases compare on one backend.
 */
export const CATALOG_SQL = `SELECT kind, schema, name, owner, acl FROM (
  SELECT 'schema' AS kind, n.nspname::text AS schema, '' AS name, pg_get_userbyid(n.nspowner)::text AS owner,
    ${acl("n.nspacl")} AS acl FROM pg_namespace n
  UNION ALL
  SELECT 'relation ' || c.relkind::text, n.nspname::text, c.relname::text, pg_get_userbyid(c.relowner)::text,
    ${acl("c.relacl")}
    FROM pg_class c JOIN pg_namespace n ON n.oid = c.relnamespace WHERE c.relkind IN ('r', 'p', 'v', 'm', 'S', 'f')
  UNION ALL
  SELECT 'routine', n.nspname::text, p.oid::regprocedure::text, pg_get_userbyid(p.proowner)::text,
    ${acl("p.proacl")}
    FROM pg_proc p JOIN pg_namespace n ON n.oid = p.pronamespace
  UNION ALL
  SELECT 'type ' || t.typtype::text, n.nspname::text, t.typname::text, pg_get_userbyid(t.typowner)::text,
    ${acl("t.typacl")}
    FROM pg_type t JOIN pg_namespace n ON n.oid = t.typnamespace WHERE t.typtype IN ('e', 'd', 'r')
  UNION ALL
  SELECT 'default ' || d.defaclobjtype::text, coalesce(n.nspname::text, ''), '', pg_get_userbyid(d.defaclrole)::text,
    ${acl("d.defaclacl")}
    FROM pg_default_acl d LEFT JOIN pg_namespace n ON n.oid = d.defaclnamespace
) catalog
WHERE schema NOT LIKE 'pg\\_%' AND schema <> 'information_schema'
ORDER BY kind, schema COLLATE "C", name COLLATE "C", owner COLLATE "C", acl COLLATE "C"`;

/** {@link CATALOG_SQL}'s lines of `db`. */
export async function catalogOf(db: BackupDatabase): Promise<string[]> {
  return (await db.query(CATALOG_SQL)).map((row) => `${row.kind} ${row.schema}.${row.name} owner=${row.owner} acl=${row.acl}`);
}

/** A worker of `./restore-kill.worker.ts`, killed once it says it is loading. */
export interface KilledRestore {
  /** What it printed. */
  readonly stdout: string;
  /** How it ended: SIGKILL. */
  readonly signal: NodeJS.Signals | null;
}

/**
 * Starts `./restore-kill.worker.ts` with `job` (`RestoreJob`), waits until it says it is loading (`patienceMs`), kills it
 * with SIGKILL and resolves once it ended.
 */
export async function killedRestore(job: Readonly<Record<string, unknown>>, patienceMs = PATIENCE_MS): Promise<KilledRestore> {
  const worker = new URL("./restore-kill.worker.ts", import.meta.url).pathname;
  const child = spawnChild(process.execPath, ["--import", "tsx", worker, JSON.stringify(job)], {
    cwd: new URL("../..", import.meta.url).pathname,
    stdio: ["ignore", "pipe", "pipe"],
  });
  let stdout = "";
  let stderr = "";
  child.stdout?.setEncoding("utf8").on("data", (chunk: string) => {
    stdout += chunk;
  });
  child.stderr?.setEncoding("utf8").on("data", (chunk: string) => {
    stderr += chunk;
  });
  const exited = new Promise<NodeJS.Signals | null>((resolve) => child.once("close", (_code, signal) => resolve(signal)));
  const deadline = Date.now() + patienceMs;
  while (!stdout.includes("loading ")) {
    if (child.exitCode !== null || child.signalCode !== null || Date.now() > deadline) {
      child.kill("SIGKILL");
      throw new Error(`the restore never said it was loading: ${stdout} ${stderr.slice(-2000)}`);
    }
    await sleep(20);
  }
  child.kill("SIGKILL");
  return { stdout, signal: await exited };
}
