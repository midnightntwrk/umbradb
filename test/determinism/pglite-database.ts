import { startPgliteServer } from "../db/pglite-server.js";
import type { TestServer } from "./postgres-database.js";

/**
 * The PGlite 0.5.10 databases of the determinism suites (task 2.2), the twin of `postgres-database.ts` behind the same
 * `TestDatabase` interface: each read is the database API's PGlite read handle — one queued job (DB-2, DB-4), results
 * mapped as DB-2 maps them — and each database a fresh in-memory engine (`../db/pglite-server.ts`). Setup SQL runs on
 * the engine outside the API, between reads.
 *
 * `readWithoutSnapshot` runs each statement as a read of its own (a job of its own in the queue), as on PostgreSQL. The
 * snapshot test that commits between a read's statements is PostgreSQL's only: on PGlite nothing can commit while a
 * read runs (DB-4), which A11 checks (`../db/pglite-no-outside-read.test.ts`).
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
