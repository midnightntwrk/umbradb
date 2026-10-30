import { startPgliteServer } from "../db/pglite-server.js";
import type { TestServer } from "./postgres-database.js";

/**
 * The PGlite 0.5.10 databases of the determinism suites: the twin of `postgres-database.ts`, behind the same
 * `TestDatabase` interface. Each read is the database API's PGlite read handle: one queued job, with results mapped the
 * way the database API maps them. Each database is a fresh in-memory engine (`../db/pglite-server.ts`). Setup SQL runs
 * on the engine outside the API, between reads. [DB-2, DB-4]
 *
 * `readWithoutSnapshot` runs each statement as a read of its own (a job of its own in the queue), as on PostgreSQL. The
 * snapshot test that commits between a read's statements runs on PostgreSQL only: on PGlite nothing can commit while a
 * read runs, which `../db/pglite-no-outside-read.test.ts` checks. [DB-4, A11]
 */
export async function startPglite(): Promise<TestServer> {
  const server = await startPgliteServer();
  return {
    async create() {
      const database = await server.createDatabase();
      const db = await database.open();
      return {
        exec: (sql) => database.exec(sql),
        read: (body) => db.read(body),
        readWithoutSnapshot: (body) => body({ query: (sql, params) => db.read((read) => read.query(sql, params)) }),
      };
    },
    stop: () => server.stop(),
  };
}
