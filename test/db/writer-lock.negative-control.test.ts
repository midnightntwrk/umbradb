import { afterAll, beforeAll, beforeEach, describe, expect, it, vi } from "vitest";
import type * as WriterLock from "../../src/db/writer-lock.js";
import { startWriter } from "../../src/db/writer-lock.js";
import { UmbraError } from "../../src/db/errors.js";
import { type PostgresTestServer, startPostgresServer } from "./postgres-server.js";
import {
  expectLockLostWhenTakenMeanwhile,
  expectLockRetakenAfterTermination,
  expectSecondPostgresWriterRefused,
  writerLockHolders,
  writesTable,
} from "./writer-lock-checks.js";

/**
 * A17's committed negative controls on PostgreSQL (DB-11): two wrong writer locks, each of which must make A17's own
 * checks (`writer-lock-checks.ts`, run by `writer-lock.test.ts`) fail.
 *
 * - **A lock released when its statement ends instead of with the session:** `pg_try_advisory_xact_lock`, taken in
 *   autocommit on the writer's session, is released as soon as its statement's own transaction ends, so the writer
 *   holds nothing and a second writer starts.
 * - **A writer that skips the re-take after a lost session:** the lock is taken on the first session only; after the
 *   writer's backend is terminated, the next session writes without it.
 *
 * `vi.mock` replaces `takeWriterLock` of `src/db/writer-lock.ts` in this file's module graph only, so the PostgreSQL
 * backend (`src/db/postgres.ts`, opened through `./postgres-server.ts`) is built with the wrong lock the current test
 * chooses; with `variant.current = "api"` it calls the real one, and the checks pass in this build too.
 */

const variant = vi.hoisted(() => ({ current: "api" as "api" | "statement-scoped" | "no-retake" }));

vi.mock("../../src/db/writer-lock.js", async (importOriginal) => {
  const actual = await importOriginal<typeof WriterLock>();
  const takeWriterLock: typeof actual.takeWriterLock = async (session, attempt) => {
    if (variant.current === "statement-scoped") {
      const [row] = await session.query("SELECT pg_try_advisory_xact_lock(3, hashtext('umbradb-writer')) AS locked");
      if (row?.locked !== true) throw new UmbraError("writer-lock-held", "the statement-scoped lock is held", {});
      return;
    }
    if (variant.current === "no-retake" && attempt === "again") return;
    return actual.takeWriterLock(session, attempt);
  };
  return { ...actual, takeWriterLock };
});

let server: PostgresTestServer;

beforeAll(async () => {
  server = await startPostgresServer();
}, 180_000);

afterAll(async () => {
  await server?.stop();
}, 60_000);

beforeEach(() => {
  variant.current = "api";
});

/** The assertion error `check` fails with; fails the test if `check` passes or fails otherwise. */
async function assertionFailure(check: Promise<unknown>): Promise<Error> {
  try {
    await check;
  } catch (error) {
    if (error instanceof Error && error.name === "AssertionError") return error;
    throw error;
  }
  throw new Error("the check passed, but the negative control must make it fail");
}

describe("A17's negative controls on PostgreSQL (DB-11)", () => {
  it("passes A17's checks in this file's build with the real lock", async () => {
    await expectSecondPostgresWriterRefused(await server.createDatabase());
    await expectLockRetakenAfterTermination(await server.createDatabase());
    await expectLockLostWhenTakenMeanwhile(await server.createDatabase());
  }, 120_000);

  it("a lock released when its statement ends makes the second-writer check fail: two writers write", async () => {
    variant.current = "statement-scoped";
    await assertionFailure(expectSecondPostgresWriterRefused(await server.createDatabase()));
    // The reason, shown directly: both start, neither holds the lock, both write.
    const database = await server.createDatabase();
    await writesTable(database);
    const [a, b] = [database.open(), database.open()];
    await startWriter(a);
    await startWriter(b);
    await a.transaction((tx) => tx.execute("INSERT INTO w.writes VALUES ('a', 1)"));
    await b.transaction((tx) => tx.execute("INSERT INTO w.writes VALUES ('b', 1)"));
    expect(await writerLockHolders(database)).toEqual([]);
    const writers = await database.admin.unsafe("SELECT DISTINCT writer FROM w.writes ORDER BY writer");
    expect(writers.map((row) => row.writer)).toEqual(["a", "b"]);
  }, 120_000);

  it("a writer that skips the re-take after a lost session makes the re-take and lost-lock checks fail", async () => {
    variant.current = "no-retake";
    const retake = await assertionFailure(expectLockRetakenAfterTermination(await server.createDatabase()));
    expect(retake.message).toMatch(/deeply equal/);
    const lost = await assertionFailure(expectLockLostWhenTakenMeanwhile(await server.createDatabase()));
    expect(lost.message).toMatch(/expected an UmbraError, but the call resolved/);
  }, 120_000);
});
