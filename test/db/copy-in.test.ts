import { afterAll, beforeAll, describe, expect, it } from "vitest";
import type { Database, Transaction } from "../../src/db/api.js";
import { copyFromBlob, copyIn } from "../../src/db/copy-in.js";
import { openPglite } from "../../src/db/pglite.js";
import { type PostgresTestServer, startPostgresServer } from "./postgres-server.js";

/**
 * `COPY … FROM stdin` with its data on both backends (`src/db/copy-in.ts`), as a restore loads a dump: the data in
 * chunks of whole lines, in `COPY`'s text format. Data the server refuses, and a data source that fails, roll the
 * transaction back with an error rather than hanging it, and the database serves the next transaction.
 */

const COPY = "COPY t.rows (id, note) FROM stdin;";
const committedHeight = async () => null;

let server: PostgresTestServer;
beforeAll(async () => {
  server = await startPostgresServer();
}, 120_000);
afterAll(async () => {
  await server?.stop();
});

const BACKENDS: readonly { readonly name: string; open(): Promise<Database> }[] = [
  {
    name: "PostgreSQL",
    async open() {
      const created = await server.createDatabase();
      return created.open({ committedHeight, readConnections: 1 });
    },
  },
  { name: "PGlite", open: () => openPglite({ dataDir: "memory://", committedHeight, developmentOptIn: true }) },
];

async function* chunks(...texts: string[]): AsyncGenerator<string> {
  yield* texts;
}

const notes = (db: Database) =>
  db.transaction(async (tx) => (await tx.query("SELECT id, note FROM t.rows ORDER BY id")).map((row) => [row.id, row.note]));

const failure = (promise: Promise<unknown>) =>
  promise.then(
    () => null,
    (error: unknown) => error,
  );

describe.each(BACKENDS)("COPY … FROM stdin on $name", (backend) => {
  it("loads a COPY's data given in chunks, escapes and NULLs read as COPY's text format reads them", async () => {
    const db = await backend.open();
    try {
      await db.transaction((tx) => tx.execute("CREATE SCHEMA t").then(() => tx.execute("CREATE TABLE t.rows (id int, note text)")));
      await db.transaction((tx) => copyIn(tx, COPY, chunks("1\tline\\nbreak\n2\t\\N\n", "3\ttab\\there\\\\\n", "4\t\n")));
      expect(await notes(db)).toEqual([
        [1, "line\nbreak"],
        [2, null],
        [3, "tab\there\\"],
        [4, ""],
      ]);
    } finally {
      await db.close();
    }
  });

  it("rolls back a COPY whose data the server refuses, or whose data fails to come, and serves the next transaction", async () => {
    const db = await backend.open();
    try {
      await db.transaction((tx) => tx.execute("CREATE SCHEMA t").then(() => tx.execute("CREATE TABLE t.rows (id int, note text)")));
      const refused = await failure(db.transaction((tx) => copyIn(tx, COPY, chunks("1\ta\n", "not-an-id\tb\n", "3\tc\n"))));
      expect(refused).toMatchObject({ code: "database-error" });
      const broken = (async function* () {
        yield "1\ta\n";
        throw new Error("the file could not be read");
      })();
      expect(await failure(db.transaction((tx) => copyIn(tx, COPY, broken)))).toMatchObject({
        message: "the file could not be read",
      });
      expect(await notes(db)).toEqual([]);
      await db.transaction((tx) => copyIn(tx, COPY, chunks("5\te\n")));
      expect(await notes(db)).toEqual([[5, "e"]]);
    } finally {
      await db.close();
    }
  });
});

describe("the COPY path's guards", () => {
  it("refuses a handle that is not a transaction a backend opened", async () => {
    const handle = { query: async () => [], execute: async () => 0 } as Transaction;
    await expect(copyIn(handle, COPY, chunks())).rejects.toThrow("not a transaction the database API opened");
  });

  it("reads PGlite's COPY from its blob device, and refuses a statement that is no COPY … FROM stdin", () => {
    expect(copyFromBlob(COPY)).toBe("COPY t.rows (id, note) FROM '/dev/blob'");
    expect(() => copyFromBlob("COPY t.rows TO stdout;")).toThrow("not a COPY … FROM stdin");
  });
});
