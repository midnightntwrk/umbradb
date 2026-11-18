import { setTimeout as sleep } from "node:timers/promises";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { cursorHeight } from "../../src/backbone/core-block-commit/sql.js";
import type { Database } from "../../src/db/api.js";
import { TAKE_WRITER_LOCK_SQL, WRITER_LOCK_CLASS, WRITER_LOCK_HOLDER_SQL, WRITER_LOCK_KEY } from "../../src/db/writer-lock.js";
import { FinalizedLoop } from "../../src/runner/loop.js";
import { startPgliteServer, type PgliteTestServer } from "../db/pglite-server.js";
import { type PostgresTestDatabase, type PostgresTestServer, startPostgresServer } from "../db/postgres-server.js";
import { entry } from "../modules/graph-fixtures.js";
import {
  continuesExpected,
  continuesModule,
  continuesOf,
  continuesProblems,
  type COptions,
  H,
  HEAD,
} from "./block-continues-harness.js";
import { cursorOf, InMemoryBlockSource, loopInput, startWith } from "./loop-harness.js";

/**
 * The writer's session and a block context's `continues`, on PostgreSQL 18 and PGlite 0.5.10. A block before
 * continues into a height only if the writer's session that committed it is still the one in use: on PostgreSQL a
 * session lost between two transactions is replaced by the next one, which takes the writer lock again, and another
 * writer may have held the lock and changed the database in between. So:
 * - the database says which session the writer has (`Database.writerSession`): a number that changes whenever the
 *   session is replaced, null while it has none it can use;
 * - PostgreSQL: the writer's session lost while the loop waits between two heights, another writer taking the lock,
 *   changing a row and releasing it before the loop goes on: the next height's `continues` is false;
 * - PostgreSQL: the session lost while a height's callbacks run with `continues` true, another writer in between: the
 *   height's attempt fails before it writes, retryable, and the height made again says `continues` false;
 * - PGlite: one session serves the process's life, so its number never changes and `continues` is true from a run's
 *   second height, as before.
 */

/** Releases the writer lock `TAKE_WRITER_LOCK_SQL` took on the same session. */
const UNLOCK_SQL = `SELECT pg_advisory_unlock(${WRITER_LOCK_CLASS}, hashtext('${WRITER_LOCK_KEY}')) AS unlocked`;

/** Waits until `db` says its writer has no session it can use (the driver saw the loss), or 5 s. */
async function lossNoticed(db: Database): Promise<void> {
  for (let attempt = 0; attempt < 200; attempt++) {
    if ((db as Partial<Pick<Database, "writerSession">>).writerSession?.() === null) return;
    await sleep(25);
  }
}

/**
 * Another writer between two of `db`'s transactions: the session holding the writer lock is terminated, and once `db`
 * noticed, the test's own session takes the lock, runs `change` and releases the lock.
 */
async function anotherWriter(database: PostgresTestDatabase, db: Database, change: string): Promise<void> {
  const [holder] = await database.admin.unsafe(WRITER_LOCK_HOLDER_SQL);
  await database.terminate(Number(holder?.pid));
  await lossNoticed(db);
  const [took] = await database.admin.unsafe(TAKE_WRITER_LOCK_SQL);
  if (took?.locked !== true) throw new Error("the test's writer could not take the writer lock");
  await database.admin.unsafe(change);
  await database.admin.unsafe(UNLOCK_SQL);
}

describe("the writer's session on PostgreSQL 18", () => {
  let server: PostgresTestServer | undefined;
  beforeAll(async () => {
    server = await startPostgresServer();
  }, 180_000);
  afterAll(() => server?.stop(), 60_000);

  it("a number once a transaction ran, the same through later ones, null once the session was lost, and another once the next transaction opened a new one", async () => {
    const database = await (server as PostgresTestServer).createDatabase();
    const db = database.open({ committedHeight: cursorHeight });
    try {
      expect(db.writerSession()).toBeNull();
      await db.transaction(async (tx) => tx.query("SELECT 1"));
      const first = db.writerSession();
      expect(first).toBeTypeOf("number");
      await db.transaction(async (tx) => tx.query("SELECT 1"));
      expect(db.writerSession()).toBe(first);
      // Inside a transaction it is the transaction's session.
      expect(await db.transaction(async () => db.writerSession())).toBe(first);
      const [holder] = await database.admin.unsafe(WRITER_LOCK_HOLDER_SQL);
      await database.terminate(Number(holder?.pid));
      await lossNoticed(db);
      expect(db.writerSession()).toBeNull();
      const second = await db.transaction(async () => db.writerSession());
      expect(second).toBeTypeOf("number");
      expect(second).not.toBe(first);
      expect(db.writerSession()).toBe(second);
    } finally {
      await db.close();
    }
    expect(db.writerSession()).toBeNull();
  }, 60_000);

  /** Module `c` over a fresh database, a source and a loop over it. */
  async function setUp(options: COptions = {}, head: bigint = HEAD) {
    const database = await (server as PostgresTestServer).createDatabase();
    const db = database.open({ committedHeight: cursorHeight });
    const log: string[] = [];
    const module = continuesModule(log, options);
    const started = await startWith(db, [module], [entry("c", 1)]);
    const source = new InMemoryBlockSource({ head });
    const stop = new AbortController();
    const loop = new FinalizedLoop(loopInput(started, source, stop));
    return { database, db, log, source, loop, stop };
  }

  it("the session lost while the loop waits between two heights, another writer in between: the next height's continues is false, the one after true", async () => {
    const { database, db, log, source, loop, stop } = await setUp({}, H);
    try {
      const running = loop.run().then(
        () => undefined,
        (error: unknown) => error,
      );
      await source.waiting(H);
      expect(await cursorOf(db)).toBe(H);
      // The other writer changes a row of the block before, as one that rewrites the database would.
      await anotherWriter(database, db, `UPDATE c.rows SET height = height WHERE height = ${H}`);
      source.finalize(HEAD);
      if ((await Promise.race([source.waiting(HEAD).then(() => "waiting" as const), running])) === "waiting") stop.abort();
      expect(await running).toBeUndefined();
      const expected = continuesExpected(HEAD, {
        [`on-compute@${H + 1n}`]: [false],
        [`on-db-write@${H + 1n}`]: [false],
        [`on-after-db-write@${H + 1n}`]: [false],
      });
      expect(continuesProblems(continuesOf(log), expected)).toEqual([]);
      expect(await cursorOf(db)).toBe(HEAD);
    } finally {
      await db.close();
    }
  }, 120_000);

  it("the session lost while a height's callbacks run with continues true, another writer in between: that attempt fails before it writes, retryable; made again it says false", async () => {
    let done = false;
    let context: { database: PostgresTestDatabase; db: Database } | undefined;
    const { database, db, log, source, loop, stop } = await setUp({
      atCompute: async (height) => {
        if (height !== H || done || context === undefined) return;
        done = true;
        await anotherWriter(context.database, context.db, `UPDATE c.rows SET height = height WHERE height = ${H - 1n}`);
      },
    });
    context = { database, db };
    const run = async (): Promise<unknown> => {
      const running = loop.run().then(
        () => undefined,
        (error: unknown) => error,
      );
      if ((await Promise.race([source.waiting(HEAD).then(() => "waiting" as const), running])) === "waiting") stop.abort();
      return running;
    };
    try {
      const failure = await run();
      expect(failure).toMatchObject({ height: H, committed: false });
      expect((failure as { cause?: { code?: string; retryable?: boolean } }).cause).toMatchObject({ code: "connection-lost", retryable: true });
      // Nothing of the attempt was written: its transaction failed before the first on-db-write.
      expect(await cursorOf(db)).toBe(H - 1n);
      expect(log).not.toContain(`c on-db-write@${H} true`);
      expect(await run()).toBeUndefined();
      const expected = continuesExpected(HEAD, {
        [`on-compute@${H}`]: [true, false],
        [`on-db-write@${H}`]: [false],
        [`on-after-db-write@${H}`]: [false],
      });
      expect(continuesProblems(continuesOf(log), expected)).toEqual([]);
      expect(await cursorOf(db)).toBe(HEAD);
    } finally {
      await db.close();
    }
  }, 120_000);
});

describe("the writer's session on PGlite 0.5.10", () => {
  let server: PgliteTestServer | undefined;
  beforeAll(async () => {
    server = await startPgliteServer();
  }, 180_000);
  afterAll(() => server?.stop(), 60_000);

  it("one session for the process's life: the same number before and through every transaction and height, so continues is true from a run's second height; null once closed", async () => {
    const database = await (server as PgliteTestServer).createDatabase();
    const db = await database.open({ committedHeight: cursorHeight });
    const sessions: unknown[] = [];
    const log: string[] = [];
    const record = async (): Promise<void> => {
      sessions.push((db as Partial<Pick<Database, "writerSession">>).writerSession?.());
    };
    await record();
    const module = continuesModule(log, { atCompute: record });
    const started = await startWith(db, [module], [entry("c", 1)]);
    const source = new InMemoryBlockSource({ head: HEAD });
    const stop = new AbortController();
    const loop = new FinalizedLoop(loopInput(started, source, stop));
    try {
      const running = loop.run().then(
        () => undefined,
        (error: unknown) => error,
      );
      if ((await Promise.race([source.waiting(HEAD).then(() => "waiting" as const), running])) === "waiting") stop.abort();
      expect(await running).toBeUndefined();
      await record();
      expect(sessions).toHaveLength(Number(HEAD) + 2);
      expect(typeof sessions[0]).toBe("number");
      expect(new Set(sessions).size).toBe(1);
      expect(continuesProblems(continuesOf(log), continuesExpected(HEAD))).toEqual([]);
    } finally {
      await db.close();
    }
    expect(db.writerSession()).toBeNull();
  }, 120_000);
});
