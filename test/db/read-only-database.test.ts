import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { afterAll, beforeAll, describe, expect, expectTypeOf, it } from "vitest";
import type { Database, ReadHandle, ReadOnlyDatabase, ReadOptions } from "../../src/db/api.js";
import { UmbraError } from "../../src/db/errors.js";
import { type MigrationPart, startDatabase } from "../../src/db/migrate.js";
import { openPglite } from "../../src/db/pglite.js";
import { readOnlyDatabase } from "../../src/db/read-only.js";
import { planSchemas, type SchemaModule, type SchemaPlan } from "../../src/db/roles.js";
import { type BlockWrites, openBlockWrites, runOnStartDb } from "../../src/db/write-handles.js";
import { askedLater, BACKENDS, settlesWithin, TEST_CURSOR, TEST_SCHEMA } from "./backends.js";
import { readOnlyProblems } from "./read-only-checks.js";

/**
 * The read-only database of the `db` item (task 2.8; A144; CD-1, RN-4, DB-2, DB-4, DB-15; owner decision Q73, resolved
 * E). `core-chain` provides the `process` item `db` (CD-1), and a module that requires it reads through it for work
 * outside the points; it offers `read` and nothing that writes, opens a transaction or closes the database. Inside a
 * callback a module uses the handle it was given (RN-4): on PGlite a `db.read` from inside its own `on-db-write` — which
 * runs in the block's job of the one queue — fails at once with `nested-call` (task 2.2's guard, kept by Q73), and on
 * PostgreSQL it runs on a pooled read connection, outside the block's transaction, and returns the data committed
 * before the block. Modules are trusted (Q46): what is checked here is what a module finds by ordinary use, not a
 * defence against one that goes around it.
 *
 * Built here on the database API: {@link readOnlyDatabase} makes the item from a `Database`. "A module that requires
 * `db` gets" it through `ProcessContext.items` once `core-chain` publishes it (task 10.2) and the runner hands process
 * items to modules (task 5.2a); the runner's own `on-db-write` loop is played here by the test calling
 * {@link BlockWrites.write} inside one transaction of the database API, as task 2.6's tests do.
 */

/** The type-level form of A144's check: true when `T` offers `read` and nothing else. */
type OffersReadOnly<T> = [keyof T] extends ["read"] ? (["read"] extends [keyof T] ? true : false) : false;

// ---------------------------------------------------------------------------------------------------------------------
// Helpers

async function failure(run: () => Promise<unknown>): Promise<UmbraError> {
  try {
    await run();
  } catch (error) {
    if (error instanceof UmbraError) return error;
    throw error;
  }
  throw new Error("expected an UmbraError, but the call resolved");
}

/** What `run` rejects with, or "resolved". */
function outcome(run: Promise<unknown>): Promise<unknown> {
  return run.then(
    () => "resolved",
    (error: unknown) => error,
  );
}

/** Q73's refusal on PGlite: `database-error`, `nested-call`, not retryable. */
function expectNestedCall(error: unknown): void {
  expect(error).toBeInstanceOf(UmbraError);
  const refused = error as UmbraError;
  expect(refused.code).toBe("database-error");
  expect(refused.retryable).toBe(false);
  expect(refused.details).toEqual({ reason: "nested-call", call: "read" });
}

/** Two modules, each with one table its rows record the role they were written under. */
const MODULES: readonly (SchemaModule & MigrationPart)[] = [tablePart("a"), tablePart("b")];

function tablePart(id: string): SchemaModule & MigrationPart {
  return {
    id,
    version: "1.0.0",
    requires: [],
    provides: [{ name: `${id}-rows`, table: { schema: id, tables: ["t"] } }],
    migrations: [{ id: "001", sql: `CREATE TABLE ${id}.t (k bigint PRIMARY KEY)` }],
  };
}

const INSERT_A = "INSERT INTO a.t (k) VALUES ($1::bigint)";
const INSERT_B = "INSERT INTO b.t (k) VALUES ($1::bigint)";

/** What a read sees: its reported height, the cursor, and both modules' rows. */
async function snapshot(read: ReadHandle): Promise<Record<string, unknown>> {
  const [cursor] = await read.query("SELECT max(height) AS height FROM t.blocks");
  return {
    height: read.height,
    cursor: cursor?.height,
    a: (await read.query("SELECT k FROM a.t ORDER BY k")).map((row) => row.k),
    b: (await read.query("SELECT k FROM b.t ORDER BY k")).map((row) => row.k),
  };
}

/**
 * Runs `body` as the block at `height`: one transaction of the database API whose first statement writes the cursor's
 * row (as `core-block-commit` does first in every block, CD-3), then the parts' `on-db-write` calls, opened as the
 * runner opens them (`openBlockWrites`, with the cursor before the block as the handles' height).
 */
function block<T>(db: Database, plan: SchemaPlan, height: bigint, body: (writes: BlockWrites) => Promise<T>): Promise<T> {
  return db.transaction(async (tx) => {
    await tx.execute("INSERT INTO t.blocks VALUES ($1)", [height]);
    return body(openBlockWrites(tx, plan, { height: height === 1n ? null : height - 1n }));
  });
}

// ---------------------------------------------------------------------------------------------------------------------
// The type

describe("the db item's type (CD-1, Q73, A144)", () => {
  it("offers read only — the database API's read, with the read option — and nothing that writes, opens a transaction or closes", () => {
    expectTypeOf<keyof ReadOnlyDatabase>().toEqualTypeOf<"read">();
    expectTypeOf<OffersReadOnly<ReadOnlyDatabase>>().toEqualTypeOf<true>();
    expectTypeOf<ReadOnlyDatabase["read"]>().toEqualTypeOf<Database["read"]>();
    expectTypeOf<Parameters<ReadOnlyDatabase["read"]>[1]>().toEqualTypeOf<ReadOptions | undefined>();
    expectTypeOf(readOnlyDatabase).parameters.toEqualTypeOf<[Database]>();
    expectTypeOf(readOnlyDatabase).returns.toEqualTypeOf<ReadOnlyDatabase>();
    const misuse = (db: ReadOnlyDatabase) => [
      // @ts-expect-error A144: the db item opens no transaction.
      db.transaction,
      // @ts-expect-error A144: the db item does not close the database.
      db.close,
      // @ts-expect-error A144: the db item does not write.
      db.execute,
      // @ts-expect-error A144: statements run through a read's handle, not the item.
      db.query,
    ];
    expectTypeOf(misuse).toBeFunction();
  });

  it("negative control: the check finds a type that also offers transaction, close or the database", () => {
    expectTypeOf<OffersReadOnly<Database>>().toEqualTypeOf<false>();
    expectTypeOf<OffersReadOnly<ReadOnlyDatabase & Pick<Database, "transaction">>>().toEqualTypeOf<false>();
    expectTypeOf<OffersReadOnly<ReadOnlyDatabase & Pick<Database, "close">>>().toEqualTypeOf<false>();
    expectTypeOf<OffersReadOnly<ReadOnlyDatabase & { readonly database: Database }>>().toEqualTypeOf<false>();
    expectTypeOf<OffersReadOnly<Record<never, never>>>().toEqualTypeOf<false>();
  });
});

// ---------------------------------------------------------------------------------------------------------------------
// Without a backend: what the item passes to the database's read

describe("readOnlyDatabase over any Database (CD-1, DB-15)", () => {
  /** A database whose read records its arguments; it has nothing else a test may call. */
  function recording(answer: (args: unknown[]) => Promise<unknown>): { db: Database; calls: unknown[][] } {
    const calls: unknown[][] = [];
    const db: Database = {
      read: ((...args: unknown[]) => {
        calls.push(args);
        return answer(args);
      }) as Database["read"],
      transaction: () => Promise.reject(new Error("the db item must never open a transaction")),
      close: () => Promise.reject(new Error("the db item must never close the database")),
    };
    return { db, calls };
  }

  it("passes the body and the read option to the database's read unchanged, and its result back", async () => {
    const result = { the: "body's result" };
    const { db, calls } = recording(async () => result);
    const ro = readOnlyDatabase(db);
    const body = async (read: ReadHandle) => read.height;
    const options: ReadOptions = { timeoutMs: 1234 };
    expect(await ro.read(body, options)).toBe(result);
    expect(await ro.read(body)).toBe(result);
    expect(calls).toHaveLength(2);
    expect(calls[0]?.[0]).toBe(body);
    expect(calls[0]?.[1]).toBe(options);
    expect(calls[1]?.[0]).toBe(body);
    expect(calls[1]?.[1]).toBeUndefined();
  });

  it("passes the database's error back unchanged", async () => {
    const own = new UmbraError("query-timeout", "the database's own", { timeoutMs: 1, setting: "statement_timeout" });
    const { db } = recording(() => Promise.reject(own));
    await expect(readOnlyDatabase(db).read(async () => 1)).rejects.toBe(own);
  });

  it("works when its read is taken off the item, as a module may destructure it", async () => {
    const { db, calls } = recording(async () => "read");
    const { read } = readOnlyDatabase(db);
    expect(await read(async () => 1, { timeoutMs: 5 })).toBe("read");
    expect(calls).toHaveLength(1);
  });

  it("is frozen: an assignment to it — a mistake in one module — throws and changes it for no other module", () => {
    const { db } = recording(async () => undefined);
    const ro = readOnlyDatabase(db);
    expect(Object.isFrozen(ro)).toBe(true);
    expect(() => {
      (ro as unknown as Record<string, unknown>).transaction = db.transaction;
    }).toThrow(TypeError);
    expect(() => {
      (ro as unknown as Record<string, unknown>).read = db.read;
    }).toThrow(TypeError);
    expect(readOnlyProblems(ro, db)).toEqual([]);
  });

  it("negative control: A144's runtime check finds the database itself, a transaction beside read, a prototype path and a held database", () => {
    const { db } = recording(async () => undefined);
    const read = readOnlyDatabase(db).read;
    expect(readOnlyProblems(readOnlyDatabase(db), db)).toEqual([]);
    expect(readOnlyProblems(db, db)).toEqual(
      expect.arrayContaining(["it is the database itself", "it offers transaction", "it offers close"]),
    );
    expect(readOnlyProblems({ read, transaction: db.transaction }, db)).toEqual(
      expect.arrayContaining(["its own properties are [read, transaction]", "it offers transaction"]),
    );
    expect(readOnlyProblems({ read, close: () => db.close() }, db)).toContain("it offers close");
    // Own properties `read` alone, the transaction found through the prototype.
    const throughPrototype = Object.assign(Object.create({ transaction: db.transaction }) as object, { read });
    expect(readOnlyProblems(throughPrototype, db)).toEqual(["it offers transaction"]);
    expect(readOnlyProblems(Object.assign(Object.create(db) as object, { read }), db)).toEqual(
      expect.arrayContaining(["it offers transaction", "it offers close"]),
    );
    expect(readOnlyProblems({ read, database: db }, db)).toEqual(
      expect.arrayContaining(["its database holds the database"]),
    );
    const readHoldingIt = Object.assign((body: never, options?: ReadOptions) => db.read(body, options), { db });
    expect(readOnlyProblems({ read: readHoldingIt }, db)).toEqual(["its db holds the database"]);
    expect(readOnlyProblems({}, db)).toEqual(["its own properties are []", "it has no read function"]);
  });
});

// ---------------------------------------------------------------------------------------------------------------------
// Over the PGlite backend's own object

// The suites over BACKENDS get PGlite databases through the test server's wrapper (`pglite-server.ts`), whose `read`
// is a closure; the backend's own object is a class instance whose `read` uses `this`. `core-chain` will make the item
// from that object, so the item must work over it too — also with its `read` taken off the item.
describe("the db item over the PGlite backend's own Database, as openPglite returns it (A144)", () => {
  it("reads and reports its height, offers nothing else of the database, and refuses a read from inside a job with nested-call", async () => {
    const db = await openPglite({ dataDir: "memory://", committedHeight: TEST_CURSOR, developmentOptIn: true });
    try {
      await db.transaction(async (tx) => {
        await tx.execute("CREATE SCHEMA t");
        await tx.execute("CREATE TABLE t.blocks (height bigint PRIMARY KEY)");
      });
      const ro = readOnlyDatabase(db);
      expect(readOnlyProblems(ro, db)).toEqual([]);
      expect(await ro.read(async (read) => read.height)).toBeNull();
      await db.transaction((tx) => tx.execute("INSERT INTO t.blocks VALUES (1)"));
      const { read } = ro;
      expect(await read(async (handle) => handle.height)).toBe(1n);
      const nested = await db.transaction(async () => {
        const inner = ro.read(async (handle) => handle.height);
        expect(await settlesWithin(inner, 1_000)).toBe(true);
        return inner.catch((error: unknown) => error);
      });
      expectNestedCall(nested);
    } finally {
      await db.close();
    }
  }, 60_000);
});

// ---------------------------------------------------------------------------------------------------------------------
// [DOC]

describe("A144 [DOC]: the module guide", () => {
  const guide = readFileSync(join(dirname(fileURLToPath(import.meta.url)), "..", "..", "docs", "module-guide.md"), "utf8");
  const heading = "\n## Reading through `db`\n";
  const start = guide.indexOf(heading);
  const end = guide.indexOf("\n## ", start + 1);
  const section = start === -1 ? "" : guide.slice(start, end === -1 ? undefined : end);

  it("has a section on reading through db, beside the one on writing in callbacks", () => {
    const writing = guide.indexOf("\n## Writing in callbacks\n");
    expect(writing).toBeGreaterThan(-1);
    expect(start).toBeGreaterThan(writing);
  });

  it("states when to use the handle and when db.read, and what db.read does inside a callback on each backend", () => {
    for (const text of [
      "Inside a callback, use the handle it is given",
      "Use `db.read` for work outside the points",
      "a timer, a background job, a check at startup",
      "Never call `db.read` inside a callback that has a handle",
      "`reason: nested-call`",
      "the state before the block, without any of the block's writes",
      "never cut off",
    ]) {
      expect(section, text).toContain(text);
    }
  });

  it("states what the read option does on each backend", () => {
    for (const text of ["`db.read(body)` is not bounded", "{ timeoutMs }", "`query-timeout`", "PGlite enforces neither timeout"]) {
      expect(section, text).toContain(text);
    }
  });
});

// ---------------------------------------------------------------------------------------------------------------------
// On both backends

// Each test opens a fresh database and migrates two parts before its blocks: a few seconds on PostgreSQL under the full
// conformance run's parallel load (task 2.6's suite saw 5 s), so each test gets 30 s.
describe.each(BACKENDS)("the read-only db item on $name (A144)", { timeout: 30_000 }, (backend) => {
  beforeAll(() => backend.start(), 180_000);
  afterAll(() => backend.stop(), 60_000);

  /** A fresh database with the test cursor, the two modules migrated as startup will, and its `db` item. */
  async function setUp(): Promise<{ readonly db: Database; readonly plan: SchemaPlan; readonly ro: ReadOnlyDatabase }> {
    const { db } = await backend.database(TEST_SCHEMA, TEST_CURSOR);
    const plan = planSchemas(MODULES);
    await startDatabase(db, { plan, parts: MODULES, committedVersions: new Map(), handles: { height: null } });
    return { db, plan, ro: readOnlyDatabase(db) };
  }

  it("offers read only, at run time: no transaction, close or write, nothing else of the database, no path to it", async () => {
    const { db, ro } = await setUp();
    expect(readOnlyProblems(ro, db)).toEqual([]);
    expect(Object.keys(ro)).toEqual(["read"]);
    for (const name of ["transaction", "close", "execute", "query"]) {
      expect(name in ro).toBe(false);
      expect((ro as unknown as Record<string, unknown>)[name]).toBeUndefined();
    }
    // The only way in is a read: its handle reads, and a write through it is refused by the read-only transaction.
    const handleKeys = await ro.read(async (read) => Reflect.ownKeys(read).map(String).sort());
    expect(handleKeys).toEqual(["height", "query"]);
    const refused = await failure(() => ro.read((read) => read.query("INSERT INTO a.t (k) VALUES (1)")));
    expect(refused.code).toBe("database-error");
    expect(refused.details.sqlstate).toBe("25006");
    expect(await ro.read((read) => read.query("SELECT k FROM a.t"))).toEqual([]);
  });

  it("negative control: the runtime check finds the database itself on this backend, and one that offers transaction beside read", async () => {
    const { db, ro } = await setUp();
    expect(readOnlyProblems(db, db)).toEqual(
      expect.arrayContaining(["it is the database itself", "it offers transaction", "it offers close"]),
    );
    expect(readOnlyProblems({ read: ro.read, transaction: (body: never) => db.transaction(body) }, db)).toContain(
      "it offers transaction",
    );
  });

  it("makes each db.read see one committed height and report it, also when the writer commits between two statements", async () => {
    const { db, plan, ro } = await setUp();
    expect(await ro.read(async (read) => read.height)).toBeNull();
    await block(db, plan, 1n, (writes) => writes.write("a", (w) => w.execute(INSERT_A, [1])));
    const commit = askedLater(() => block(db, plan, 2n, (writes) => writes.write("a", (w) => w.execute(INSERT_A, [2]))));
    const seen = await ro.read(async (read) => {
      const first = await snapshot(read);
      commit.gate();
      // On PGlite the block waits in the one queue until the read ends (DB-4); on PostgreSQL it commits now (DB-5).
      if (backend.singleQueue) expect(await settlesWithin(commit.result, 50)).toBe(false);
      else await commit.result;
      return { first, second: await snapshot(read) };
    });
    await commit.result;
    const atOne = { height: 1n, cursor: 1n, a: [1n], b: [] };
    expect(seen).toEqual({ first: atOne, second: atOne });
    expect(await ro.read(snapshot)).toEqual({ height: 2n, cursor: 2n, a: [1n, 2n], b: [] });
  });

  it("A144: a db.read from inside the module's own on-db-write fails at once with nested-call on PGlite, and on PostgreSQL returns the data committed before the block", async () => {
    const { db, plan, ro } = await setUp();
    await block(db, plan, 1n, (writes) => writes.write("a", (w) => w.execute(INSERT_A, [1])));
    let seen: unknown;
    let throughHandle: unknown;
    await block(db, plan, 2n, async (writes) => {
      await writes.write("b", (w) => w.execute(INSERT_B, [20]));
      await writes.write("a", async (w) => {
        await w.execute(INSERT_A, [2]);
        const read = ro.read(snapshot);
        // On PGlite the callback runs in the block's job: a read that waited in the queue would never settle.
        expect(await settlesWithin(read, 1_000)).toBe(true);
        seen = await read.then(
          (value) => value,
          (error: unknown) => error,
        );
        // The handle the callback was given sees the block's own writes.
        throughHandle = {
          height: w.height,
          a: (await w.query("SELECT k FROM a.t ORDER BY k")).map((row) => row.k),
          b: (await w.query("SELECT k FROM b.t ORDER BY k")).map((row) => row.k),
        };
      });
    });
    if (backend.singleQueue) {
      expectNestedCall(seen);
    } else {
      // The last committed height, and none of the block's rows: not its cursor row, not an earlier callback's row,
      // not the callback's own.
      expect(seen).toEqual({ height: 1n, cursor: 1n, a: [1n], b: [] });
    }
    expect(throughHandle).toEqual({ height: 1n, a: [1n, 2n], b: [20n] });
    // The refused (PGlite) or outside (PostgreSQL) read changed nothing: the block committed every row.
    expect(await ro.read(snapshot)).toEqual({ height: 2n, cursor: 2n, a: [1n, 2n], b: [20n] });
  });

  it("does the same from inside the module's own on-start-db, which runs in a transaction of its own", async () => {
    const { db, plan, ro } = await setUp();
    await block(db, plan, 1n, (writes) => writes.write("a", (w) => w.execute(INSERT_A, [1])));
    let seen: unknown;
    await runOnStartDb(db, plan, "a", { height: 1n }, async (w) => {
      await w.execute(INSERT_A, [100]);
      const read = ro.read(snapshot);
      expect(await settlesWithin(read, 1_000)).toBe(true);
      seen = await read.catch((error: unknown) => error);
    });
    if (backend.singleQueue) expectNestedCall(seen);
    else expect(seen).toEqual({ height: 1n, cursor: 1n, a: [1n], b: [] });
    expect(await ro.read(snapshot)).toEqual({ height: 1n, cursor: 1n, a: [1n, 100n], b: [] });
  });

  it("does the same from inside a read's body, as the read handles given to callbacks are", async () => {
    const { db, plan, ro } = await setUp();
    await block(db, plan, 1n, (writes) => writes.write("a", (w) => w.execute(INSERT_A, [1])));
    const seen = await db.read(async () => {
      const read = ro.read(async (inner) => inner.height);
      expect(await settlesWithin(read, 1_000)).toBe(true);
      return read.catch((error: unknown) => error);
    });
    if (backend.singleQueue) expectNestedCall(seen);
    else expect(seen).toBe(1n);
  });

  it("passes the read option through: refused alike on both backends, applied on PostgreSQL only (DB-15)", async () => {
    const { ro } = await setUp();
    const invalid = await failure(() => ro.read(async () => 1, { timeoutMs: 0 }));
    expect(invalid.code).toBe("invalid-configuration");
    expect(invalid.details).toEqual({ parameter: "timeoutMs" });
    const timeouts = (options?: ReadOptions) =>
      ro.read(
        async (read) =>
          (
            await read.query(
              "SELECT current_setting('statement_timeout') AS statement, " +
                "current_setting('idle_in_transaction_session_timeout') AS idle",
            )
          )[0],
        options,
      );
    expect(await timeouts()).toEqual({ statement: "0", idle: "0" });
    expect(await timeouts({ timeoutMs: 1500 })).toEqual(
      backend.singleQueue ? { statement: "0", idle: "0" } : { statement: "1500ms", idle: "1500ms" },
    );
    if (!backend.singleQueue) {
      const started = performance.now();
      const ended = await failure(() => ro.read((read) => read.query("SELECT pg_sleep(10)"), { timeoutMs: 500 }));
      expect(ended.code).toBe("query-timeout");
      expect(ended.retryable).toBe(false);
      expect(ended.details).toEqual({ timeoutMs: 500, setting: "statement_timeout" });
      expect(performance.now() - started).toBeLessThan(5_000);
    }
  });
});
