import { PGlite } from "@electric-sql/pglite";
import { mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import type { CommittedHeight, Database, ReadHandle, ReadOptions, Transaction } from "../../src/db/api.js";
import { openPgliteOn, PGLITE_START_PARAMS } from "../../src/db/pglite.js";

/**
 * PGlite databases for the database API's tests, the twin of `postgres-server.ts`: each database is its own in-memory
 * PGlite 0.5.10 engine (`memory://`), started with the backend's pinned start parameters and loaded from one template
 * data directory, so that no test pays for PGlite's initdb (~0.5 s) — a database from the template takes ~0.1 s.
 *
 * Each engine holds ~140 MB, so at most {@link KEEP_OPEN} stay open: creating one more closes the least recently used
 * (its database then refuses further use with `handle-closed`, so a test that kept an old database open fails loudly
 * instead of exhausting memory).
 *
 * Setup and changes outside the API go through {@link PgliteTestDatabase.exec}, which runs on the engine itself —
 * PGlite's own `exec`, not the database API — and refuses to run while a read or a transaction of the API is open on
 * the engine (it would run inside that job's transaction).
 *
 * A database whose configuration file must set something (`configuration`) lives in a temporary data directory
 * instead, loaded from the same template, its settings written with `ALTER SYSTEM` (`postgresql.auto.conf`) by an
 * engine started without the backend's start parameters; the directory is deleted by {@link PgliteTestServer.stop}.
 */

/** How many engines stay open at once. */
const KEEP_OPEN = 6;

/** One empty PGlite database. */
export interface PgliteTestDatabase {
  /** The engine under the database: the test's own handle on it (setup, fault injection, statement traces). */
  readonly engine: PGlite;
  /** Runs SQL (several statements allowed) on the engine, outside the API, while no read or transaction is open. */
  exec(sql: string): Promise<void>;
  /** Opens the API's PGlite backend on the engine; closed by {@link PgliteTestServer.stop} if not before. */
  open(options?: { readonly committedHeight?: CommittedHeight }): Promise<Database>;
  /**
   * With `configuration`: what an engine started without the backend's start parameters reports for each of its
   * names (`current_setting`), read before the engine under test started — the control that the configuration file is
   * in effect. Empty without `configuration`.
   */
  readonly unpinned: Readonly<Record<string, string>>;
}

/** Hands out empty PGlite databases. */
export interface PgliteTestServer {
  /** A new database; with `configuration`, `[name, value]` pairs its data directory's configuration file sets. */
  createDatabase(options?: {
    readonly configuration?: readonly (readonly [string, string])[];
  }): Promise<PgliteTestDatabase>;
  stop(): Promise<void>;
}

const noCommittedHeight = async (): Promise<bigint | null> => null;

interface Opened {
  readonly engine: PGlite;
  database: Database | undefined;
  lastUse: number;
}

export async function startPgliteServer(): Promise<PgliteTestServer> {
  const first = await PGlite.create("memory://", { startParams: [...PGLITE_START_PARAMS] });
  const template = await first.dumpDataDir("none");
  await first.close();
  const opened: Opened[] = [];
  const directories: string[] = [];
  let clock = 0;

  /**
   * A data directory from the template whose configuration file sets `configuration`, and what an engine without the
   * backend's start parameters reports for each name there. That engine runs one statement right after it starts and
   * closes, so a timeout it reads (a nonzero `idle_session_timeout` hangs PGlite once it fires) cannot fire.
   */
  const configuredDirectory = async (
    configuration: readonly (readonly [string, string])[],
  ): Promise<{ readonly directory: string; readonly unpinned: Record<string, string> }> => {
    const directory = mkdtempSync(join(tmpdir(), "umbradb-pglite-configured-"));
    directories.push(directory);
    const writer = await PGlite.create(directory, { loadDataDir: template });
    for (const [name, value] of configuration) await writer.exec(`ALTER SYSTEM SET ${name} = '${value}'`);
    await writer.close();
    const plain = await PGlite.create(directory);
    try {
      const shown = configuration.map(([name]) => `current_setting('${name}') AS "${name}"`).join(", ");
      const { rows } = await plain.query<Record<string, string>>(`SELECT ${shown}`);
      return { directory, unpinned: { ...rows[0] } };
    } finally {
      await plain.close();
    }
  };

  const release = async (entry: Opened) => {
    opened.splice(opened.indexOf(entry), 1);
    if (entry.database !== undefined) await entry.database.close();
    else if (!entry.engine.closed) await entry.engine.close();
  };

  return {
    async createDatabase(options) {
      while (opened.length >= KEEP_OPEN) {
        const oldest = opened.reduce((a, b) => (a.lastUse <= b.lastUse ? a : b));
        await release(oldest);
      }
      const configuration = options?.configuration ?? [];
      let engine: PGlite;
      let unpinned: Record<string, string> = {};
      if (configuration.length === 0) {
        engine = await PGlite.create("memory://", { startParams: [...PGLITE_START_PARAMS], loadDataDir: template });
      } else {
        const configured = await configuredDirectory(configuration);
        unpinned = configured.unpinned;
        engine = await PGlite.create(configured.directory, { startParams: [...PGLITE_START_PARAMS] });
      }
      const entry: Opened = { engine, database: undefined, lastUse: clock++ };
      opened.push(entry);
      const touch = () => {
        entry.lastUse = clock++;
      };
      return {
        engine,
        unpinned,
        async exec(sql) {
          touch();
          if (engine.isInTransaction()) {
            throw new Error("exec outside the API while a read or transaction of the API is open on the engine");
          }
          await engine.exec(sql);
        },
        async open(options) {
          touch();
          const database = await openPgliteOn(engine, { committedHeight: options?.committedHeight ?? noCommittedHeight });
          entry.database = database;
          return {
            read<T>(body: (read: ReadHandle) => Promise<T>, readOptions?: ReadOptions) {
              touch();
              return database.read(body, readOptions);
            },
            transaction<T>(body: (tx: Transaction) => Promise<T>) {
              touch();
              return database.transaction(body);
            },
            close: () => database.close(),
          };
        },
      };
    },
    async stop() {
      await Promise.allSettled([...opened].map((entry) => release(entry)));
      for (const directory of directories.splice(0)) rmSync(directory, { recursive: true, force: true });
    },
  };
}
