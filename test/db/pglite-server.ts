import { PGlite } from "@electric-sql/pglite";
import type { CommittedHeight, Database, ReadHandle, Transaction } from "../../src/db/api.js";
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
}

/** Hands out empty PGlite databases. */
export interface PgliteTestServer {
  createDatabase(): Promise<PgliteTestDatabase>;
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
  let clock = 0;

  const release = async (entry: Opened) => {
    opened.splice(opened.indexOf(entry), 1);
    if (entry.database !== undefined) await entry.database.close();
    else if (!entry.engine.closed) await entry.engine.close();
  };

  return {
    async createDatabase() {
      while (opened.length >= KEEP_OPEN) {
        const oldest = opened.reduce((a, b) => (a.lastUse <= b.lastUse ? a : b));
        await release(oldest);
      }
      const engine = await PGlite.create("memory://", { startParams: [...PGLITE_START_PARAMS], loadDataDir: template });
      const entry: Opened = { engine, database: undefined, lastUse: clock++ };
      opened.push(entry);
      const touch = () => {
        entry.lastUse = clock++;
      };
      return {
        engine,
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
            read<T>(body: (read: ReadHandle) => Promise<T>) {
              touch();
              return database.read(body);
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
    },
  };
}
