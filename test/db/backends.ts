import type { CommittedHeight, Database } from "../../src/db/api.js";
import { type DriverConnectionOptions, driverConnectionOptions } from "../../src/db/postgres.js";
import { type PgliteTestServer, startPgliteServer } from "./pglite-server.js";
import { type PostgresTestServer, startPostgresServer } from "./postgres-server.js";

/**
 * The backends the database API's backend-neutral tests run on: PostgreSQL 18 and PGlite 0.5.10. Every suite that
 * iterates {@link BACKENDS} runs on both.
 */
export interface TestBackend {
  readonly name: string;
  /**
   * True on PGlite, where every read and transaction is a job of one queue: a commit asked for while a read is open
   * waits until the read ends, so a test must not wait for it inside the read. False on PostgreSQL, where the writer
   * commits while reads are open.
   */
  readonly singleQueue: boolean;
  start(): Promise<void>;
  stop(): Promise<void>;
  /**
   * A fresh, empty database with `setup` applied outside the API, opened through the API. With `defaults`, the
   * database's own defaults set each `[name, value]` before the API opens it — on PostgreSQL `ALTER DATABASE … SET` and
   * `ALTER ROLE <the login> IN DATABASE … SET`, on PGlite the data directory's configuration file (`ALTER SYSTEM`,
   * `postgresql.auto.conf`), PGlite's single-user mode applying neither of the others — so that a test can show the
   * API's own session settings win over them.
   */
  database(setup: string, committedHeight?: CommittedHeight, defaults?: Settings): Promise<TestDatabase>;
  /**
   * As {@link database}, with every text that reaches the database through the API recorded in `sent`, in order: on
   * PostgreSQL each text the driver writes to a connection of the API (its `debug` hook; a text written again is
   * recorded again), the writer's and the readers' alike; on PGlite each call of the engine's `query` and `exec`. The
   * API's own statements (`BEGIN`, the committed height, `COMMIT`, …) are among them.
   */
  counted(setup: string, committedHeight?: CommittedHeight): Promise<TestDatabase & { readonly sent: string[] }>;
}

/** Setting names with their values, `[name, value]`, as PostgreSQL's `SET` takes them. */
export type Settings = readonly (readonly [string, string])[];

export interface TestDatabase {
  readonly db: Database;
  /**
   * PostgreSQL only: the database's URL, so that another process (such as a child with another time zone) can open the
   * same database through the API. A PGlite database lives in this process's memory and has none.
   */
  readonly url?: string;
  /** Runs SQL (several statements allowed) outside the API, committed when it returns; never while a read is open. */
  exec(sql: string): Promise<void>;
  /**
   * PGlite only: calls `heard` with the payload of every notification of `channel` the engine's one session receives
   * from now on (the engine's own `listen`, outside the API; never while a read or a transaction is open). On
   * PostgreSQL a test listens on a connection of its own to `url`.
   */
  listen?(channel: string, heard: (payload: string) => void): Promise<void>;
  /**
   * With `defaults`: what a session that pins nothing starts with, for each of their names (`current_setting`), read
   * outside the API once the defaults were set — the control that they are in effect. Empty without `defaults`.
   */
  readonly unpinned: Readonly<Record<string, string>>;
}

function postgresBackend(): TestBackend {
  let server: PostgresTestServer | undefined;
  return {
    name: "PostgreSQL 18",
    singleQueue: false,
    async start() {
      server = await startPostgresServer();
    },
    async stop() {
      await server?.stop();
    },
    async database(setup, committedHeight, defaults = []) {
      if (server === undefined) throw new Error("backend not started");
      const database = await server.createDatabase();
      await database.exec(setup);
      const unpinned = await database.setDefaults(defaults);
      return {
        db: database.open(committedHeight === undefined ? {} : { committedHeight }),
        url: database.url,
        exec: (sql) => database.exec(sql),
        unpinned,
      };
    },
    async counted(setup, committedHeight) {
      if (server === undefined) throw new Error("backend not started");
      const database = await server.createDatabase();
      await database.exec(setup);
      const sent: string[] = [];
      // The driver calls `debug` with each text as it builds the message it writes to the connection.
      const driverOptions = (connection: Parameters<typeof driverConnectionOptions>[0]) =>
        ({
          ...driverConnectionOptions(connection),
          debug: (_connection: number, text: string) => sent.push(text),
        }) as DriverConnectionOptions;
      return {
        db: database.open({ ...(committedHeight === undefined ? {} : { committedHeight }), driverOptions }),
        url: database.url,
        exec: (sql) => database.exec(sql),
        unpinned: {},
        sent,
      };
    },
  };
}

function pgliteBackend(): TestBackend {
  let server: PgliteTestServer | undefined;
  return {
    name: "PGlite 0.5.10",
    singleQueue: true,
    async start() {
      server = await startPgliteServer();
    },
    async stop() {
      await server?.stop();
    },
    async database(setup, committedHeight, defaults = []) {
      if (server === undefined) throw new Error("backend not started");
      const database = await server.createDatabase({ configuration: defaults });
      await database.exec(setup);
      return {
        db: await database.open(committedHeight === undefined ? {} : { committedHeight }),
        exec: (sql) => database.exec(sql),
        listen: async (channel, heard) => {
          await database.engine.listen(channel, heard);
        },
        unpinned: database.unpinned,
      };
    },
    async counted(setup, committedHeight) {
      if (server === undefined) throw new Error("backend not started");
      const database = await server.createDatabase();
      await database.exec(setup);
      const sent: string[] = [];
      const { engine } = database;
      const query = engine.query.bind(engine);
      const exec = engine.exec.bind(engine);
      engine.query = ((text: string, ...rest: unknown[]) => {
        sent.push(text);
        return (query as (...all: unknown[]) => unknown)(text, ...rest);
      }) as typeof engine.query;
      engine.exec = ((text: string, ...rest: unknown[]) => {
        sent.push(text);
        return (exec as (...all: unknown[]) => unknown)(text, ...rest);
      }) as typeof engine.exec;
      return {
        db: await database.open(committedHeight === undefined ? {} : { committedHeight }),
        exec: (sql) => database.exec(sql),
        unpinned: database.unpinned,
        sent,
      };
    },
  };
}

export const BACKENDS: readonly TestBackend[] = [postgresBackend(), pgliteBackend()];

/** The committed height of the test schema `t`: the highest height in `t.blocks`, null when it is empty. */
export const TEST_CURSOR: CommittedHeight = async (read) => {
  const [row] = await read.query("SELECT max(height) AS height FROM t.blocks");
  return (row?.height ?? null) as bigint | null;
};

/** The test schema `t`: a cursor table and a second table each committed height writes to. */
export const TEST_SCHEMA = `
  CREATE SCHEMA t;
  CREATE TABLE t.blocks (height bigint PRIMARY KEY);
  CREATE TABLE t.rows (height bigint PRIMARY KEY, label text NOT NULL);
`;

/** True if `promise` settles within `ms` milliseconds (it is not awaited further). */
export async function settlesWithin(promise: Promise<unknown>, ms: number): Promise<boolean> {
  let timer: ReturnType<typeof setTimeout> | undefined;
  const late = new Promise<boolean>((resolve) => {
    timer = setTimeout(() => resolve(false), ms);
  });
  const settled = promise.then(
    () => true,
    () => true,
  );
  try {
    return await Promise.race([settled, late]);
  } finally {
    clearTimeout(timer);
  }
}

/**
 * Asks for `run` once `gate()` is called — from outside whatever job calls the gate: the callback is registered here,
 * so it runs in the caller's context, as a writer or a request elsewhere would (a call from inside a PGlite job is
 * refused).
 */
export function askedLater<T>(run: () => Promise<T>): { readonly gate: () => void; readonly result: Promise<T> } {
  let gate!: () => void;
  const asked = new Promise<void>((resolve) => {
    gate = resolve;
  });
  return { gate, result: asked.then(run) };
}
