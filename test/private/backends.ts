import { mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { cursorHeight } from "../../src/backbone/core-block-commit/core-block-commit.js";
import type { CommittedHeight, ReadHandle } from "../../src/db/api.js";
import { openPglite } from "../../src/db/pglite.js";
import { openPostgres } from "../../src/db/postgres.js";
import { startPostgresServer, type PostgresTestServer } from "../db/postgres-server.js";

/**
 * Databases for the private processes' tests (task 14.1): each test gets a public database, for a core, and private
 * databases, each for one private process — on PostgreSQL 18 (one Testcontainers server; a private database runs in its
 * own instance in production, Q90, which changes nothing the tests look at, since every check is per database) or on
 * PGlite 0.5.10 (a data directory each, with the development opt-in).
 *
 * On PostgreSQL the processes connect with logins of their own, as deployments do: the core as the server's login
 * (`test`), a private process to its own database as `umbradb_private`, and to the public database as `umbradb_reader`,
 * which may only read (`pg_read_all_data`). Every database records each session that logs in — its login and
 * application name — through a login event trigger (PostgreSQL 17+) into `public.session_log`, a table of the schema
 * `public`, which neither the determinism rules nor the contents hash read (DT-3): A112's view of which connections
 * reached which database, every one of them, not samples.
 */

/** The private process's login on PostgreSQL. */
export const PRIVATE_LOGIN = "umbradb_private";

/** The login a private process reads the public database with. */
export const READER_LOGIN = "umbradb_reader";

/** One session a PostgreSQL database saw log in. */
export interface SessionSeen {
  readonly login: string;
  readonly application: string;
}

/** One database of a test. */
export interface TestDatabase {
  /** The `database` setting of the process that owns it (CF-4). */
  readonly setting: string;
  /** PostgreSQL: the setting of the login that may only read it — a private process's `publicDatabase`. */
  readonly readerSetting?: string;
  /** PostgreSQL: every session that logged in to the database, in order. */
  sessions?(): Promise<SessionSeen[]>;
  /**
   * PostgreSQL: how many sessions of `login` are connected to the database once they have had up to 5 s to end (0 as
   * soon as none is).
   */
  connected?(login: string): Promise<number>;
  /**
   * PostgreSQL: how many of the database API's sessions (`application_name` `umbradb`) of `login` have a transaction open
   * on the database now (`pg_stat_activity`'s `xact_start`), the asking session not counted.
   */
  openTransactions?(login: string): Promise<number>;
  /**
   * Runs `body` with a read of the database through the database API, its height `committedHeight`'s: on PGlite only
   * while no process holds it open (this process reuses its lock).
   */
  read<T>(body: (read: ReadHandle) => Promise<T>, committedHeight?: CommittedHeight): Promise<T>;
}

/** A backend that hands out the databases of a test. */
export interface PrivateBackend {
  readonly name: string;
  readonly kind: "postgres" | "pglite";
  start(): Promise<void>;
  stop(): Promise<void>;
  /** A new, empty database, for a core or a private process. */
  database(owner: "public" | "private"): Promise<TestDatabase>;
}

/** The login event trigger and its table (see the module comment). */
const SESSION_LOG_SQL = `
CREATE TABLE public.session_log (position bigint GENERATED ALWAYS AS IDENTITY, login text, application text);
GRANT INSERT ON public.session_log TO PUBLIC;
CREATE FUNCTION public.log_session() RETURNS event_trigger LANGUAGE plpgsql SECURITY DEFINER AS $$
BEGIN
  INSERT INTO public.session_log (login, application) VALUES (session_user, current_setting('application_name'));
END $$;
CREATE EVENT TRIGGER log_session ON login EXECUTE FUNCTION public.log_session();`;

const noHeight: CommittedHeight = async () => null;

/** `url` with another login and password. */
function withLogin(url: string, login: string): string {
  const next = new URL(url);
  next.username = login;
  next.password = login;
  return next.toString();
}

function postgresBackend(): PrivateBackend {
  let server: PostgresTestServer | undefined;
  return {
    name: "PostgreSQL 18",
    kind: "postgres",
    async start() {
      server = await startPostgresServer();
      const created = await server.createDatabase();
      await created.exec(
        `CREATE ROLE ${PRIVATE_LOGIN} LOGIN SUPERUSER PASSWORD '${PRIVATE_LOGIN}'; ` +
          `CREATE ROLE ${READER_LOGIN} LOGIN PASSWORD '${READER_LOGIN}'; GRANT pg_read_all_data TO ${READER_LOGIN};`,
      );
    },
    async stop() {
      await server?.stop();
    },
    async database(owner) {
      if (server === undefined) throw new Error("backend not started");
      const database = await server.createDatabase();
      await database.exec(SESSION_LOG_SQL);
      const setting = owner === "public" ? database.url : withLogin(database.url, PRIVATE_LOGIN);
      return {
        setting,
        readerSetting: withLogin(database.url, READER_LOGIN),
        async sessions() {
          const rows = await database.admin.unsafe("SELECT login, application FROM public.session_log ORDER BY position");
          return rows.map((row) => ({ login: String(row.login), application: String(row.application) }));
        },
        async connected(login) {
          let count = 0;
          for (let attempt = 0; attempt < 200; attempt++) {
            const [row] = await database.admin.unsafe(
              "SELECT count(*)::int AS n FROM pg_stat_activity WHERE datname = current_database() AND usename = $1",
              [login],
            );
            count = Number(row?.n);
            if (count === 0) return 0;
            await new Promise((resolve) => setTimeout(resolve, 25));
          }
          return count;
        },
        async openTransactions(login) {
          const [row] = await database.admin.unsafe(
            "SELECT count(*)::int AS open FROM pg_stat_activity WHERE datname = current_database() AND pid <> pg_backend_pid() " +
              "AND backend_type = 'client backend' AND application_name = 'umbradb' AND usename = $1 AND xact_start IS NOT NULL",
            [login],
          );
          return Number(row?.open);
        },
        async read(body, committedHeight = cursorHeight) {
          const db = openPostgres({ url: database.url, committedHeight: committedHeight ?? noHeight, readConnections: 1 });
          try {
            return await db.read(body);
          } finally {
            await db.close();
          }
        },
      };
    },
  };
}

function pgliteBackend(): PrivateBackend {
  let root: string | undefined;
  let next = 0;
  return {
    name: "PGlite 0.5.10",
    kind: "pglite",
    async start() {
      root = mkdtempSync(join(tmpdir(), "umbradb-private-"));
    },
    async stop() {
      if (root !== undefined) rmSync(root, { recursive: true, force: true });
    },
    async database(owner) {
      if (root === undefined) throw new Error("backend not started");
      const directory = join(root, `${owner}-${next++}`);
      return {
        setting: `pglite:${directory}`,
        async read(body, committedHeight = cursorHeight) {
          const db = await openPglite({ dataDir: directory, committedHeight, developmentOptIn: true });
          try {
            return await db.read(body);
          } finally {
            await db.close();
          }
        },
      };
    },
  };
}

/** PostgreSQL 18 and PGlite 0.5.10. */
export const PRIVATE_BACKENDS: readonly PrivateBackend[] = [postgresBackend(), pgliteBackend()];

/**
 * How long a test of these files may take on a loaded machine: the longest, A116's, took 30 s on a quiet machine and
 * 342 s at a load average of about 77 (task 0.5, 2026-10-26), its wait for the private process ({@link
 * REACH_TIMEOUT_MS}) included.
 */
export const TEST_TIMEOUT_MS = 900_000;

/**
 * How long a test waits for a private process to reach a height (`PrivateProcess.reach`): A116's catch-up of 10 heights
 * after its restart did not end within the former 180 s at a load average of about 77 (task 0.5, 2026-10-26).
 */
export const REACH_TIMEOUT_MS = 600_000;

/** How long starting a backend (a container) may take on a loaded machine. */
export const START_TIMEOUT_MS = 180_000;
