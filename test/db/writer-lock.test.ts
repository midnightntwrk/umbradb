import { once } from "node:events";
import { existsSync, mkdirSync, rmSync, symlinkSync, writeFileSync } from "node:fs";
import { createServer } from "node:net";
import { join, relative } from "node:path";
import { createInterface } from "node:readline";
import { afterAll, afterEach, beforeAll, describe, expect, it } from "vitest";
import { startDatabase } from "../../src/db/migrate.js";
import { openPglite } from "../../src/db/pglite.js";
import { acquirePgliteLock, PGLITE_LOCK_BUSY_TIMEOUT_MS, pgliteLockFile } from "../../src/db/pglite-lock.js";
import { openPostgres } from "../../src/db/postgres.js";
import { planSchemas } from "../../src/db/roles.js";
import { startWriter, TAKE_WRITER_LOCK_SQL, takeWriterLock } from "../../src/db/writer-lock.js";
import { cleanUp, firstOf, startWriterProcess, workDirectory } from "./pglite-processes.js";
import { type PostgresTestServer, startPostgresServer } from "./postgres-server.js";
import {
  expectLockLostWhenTakenMeanwhile,
  expectLockRetakenAfterTermination,
  expectSecondPgliteProcessRefused,
  expectSecondPostgresWriterRefused,
  lockReleased,
  rejection,
  writerLockHolders,
} from "./writer-lock-checks.js";
import { spawnChild } from "../child-processes.js";
import { connectionOfUrl } from "./connection.js";

/**
 * A17 [FAULT] (DB-11): exactly one process writes each database. This file holds the halves that run in this process
 * (and the single-writer test, which also starts PGlite processes); the PGlite signal and race halves are in
 * `pglite-writer-processes.test.ts`, the committed negative controls in `writer-lock.negative-control.test.ts` and
 * there.
 *
 * PostgreSQL: the writer holds `pg_try_advisory_lock(3, hashtext('umbradb-writer'))` on its writer session, taken when
 * the session opens — at the writer's start, or before the first transaction — and taken again on every new session
 * after a lost one; a second writer refuses with `writer-lock-held`, and a writer that finds the lock taken when it
 * reconnects fails with `writer-lock-lost` for good. "Stays up, not ready" and "processing halts" are the runner's
 * (task 5.x): here the database API's errors are checked.
 *
 * PGlite: `openPglite` takes the operating-system lock (`node:sqlite`, `BEGIN EXCLUSIVE` on
 * `<data directory>.lock.sqlite`) before PGlite opens, for the process's life; `memory://` takes none.
 */

let server: PostgresTestServer;

beforeAll(async () => {
  server = await startPostgresServer();
}, 180_000);

afterAll(async () => {
  await server?.stop();
}, 60_000);

afterEach(async () => {
  await cleanUp();
});

const noHeight = async (): Promise<bigint | null> => null;

/** Holds a SHARED lock on the file argv[1] (a read transaction) for 50 ms, reporting when it took and released it. */
const SHARED_FOR_A_MOMENT = `
const { DatabaseSync } = require("node:sqlite");
const db = new DatabaseSync(process.argv[1]);
db.exec("BEGIN");
db.prepare("SELECT count(*) FROM sqlite_master").get();
process.stdout.write("shared " + Date.now() + "\\n");
setTimeout(() => {
  db.exec("COMMIT");
  process.stdout.write("released " + Date.now() + "\\n");
  db.close();
}, 50);
`;

describe("A17 — one writer per database (DB-11)", () => {
  it("[[db.writer-lock.single-writer]] A17: a second writer refuses with writer-lock-held, on PostgreSQL and on PGlite", async () => {
    await expectSecondPostgresWriterRefused(await server.createDatabase());
    await expectSecondPgliteProcessRefused(join(workDirectory(), "pgdata"));
  }, 180_000);
});

describe("the PostgreSQL writer lock (DB-11)", () => {
  it("holds the lock on the writer's session from the writer's start; the read sessions hold none", async () => {
    const database = await server.createDatabase();
    const db = database.open();
    expect(await writerLockHolders(database)).toEqual([]);
    expect(await startWriter(db)).toEqual({ durabilityWarnings: [] });
    const writerPid = await db.transaction(async (tx) => (await tx.query("SELECT pg_backend_pid() AS pid"))[0]?.pid);
    expect(await writerLockHolders(database)).toEqual([writerPid]);
    const readerPid = await db.read(async (read) => (await read.query("SELECT pg_backend_pid() AS pid"))[0]?.pid);
    expect(readerPid).not.toBe(writerPid);
    expect(await writerLockHolders(database)).toEqual([writerPid]);
  }, 60_000);

  it("takes the lock before the first write when the writer was not started first", async () => {
    const database = await server.createDatabase();
    const a = database.open();
    const pid = await a.transaction(async (tx) => (await tx.query("SELECT pg_backend_pid() AS pid"))[0]?.pid);
    expect(await writerLockHolders(database)).toEqual([pid]);
    const b = database.open();
    const refused = await rejection(() => b.transaction(async () => undefined));
    expect(refused.code).toBe("writer-lock-held");
  }, 60_000);

  it("is held before any migration: a second writer's startup refuses with writer-lock-held and creates nothing", async () => {
    const database = await server.createDatabase();
    const a = database.open();
    await startWriter(a);
    const b = database.open();
    const plan = planSchemas([]);
    const refused = await rejection(() => startDatabase(b, { plan, parts: [], committedVersions: new Map(), handles: { height: null } }));
    expect(refused.code).toBe("writer-lock-held");
    const [row] = await database.admin.unsafe("SELECT to_regnamespace('core_chain') IS NULL AS absent");
    expect(row?.absent).toBe(true);
    // The holder's startup runs.
    await startDatabase(a, { plan, parts: [], committedVersions: new Map(), handles: { height: null } });
    const [after] = await database.admin.unsafe("SELECT to_regnamespace('core_chain') IS NULL AS absent");
    expect(after?.absent).toBe(false);
  }, 60_000);

  it("names the session that holds the lock in the refusal, and never the URL", async () => {
    const database = await server.createDatabase();
    const a = database.open();
    await startWriter(a);
    const holder = await a.transaction(async (tx) => (await tx.query("SELECT pg_backend_pid() AS pid"))[0]?.pid);
    const refused = await rejection(() => startWriter(database.open()));
    expect(refused.details).toEqual({ backend: "postgresql", holder });
    expect(refused.message).toContain(String(holder));
    expect(refused.message).not.toContain(database.url);
  }, 60_000);

  it("re-takes the lock on the new session after the writer's backend is terminated, before the next write", async () => {
    await expectLockRetakenAfterTermination(await server.createDatabase());
  }, 60_000);

  it("fails with writer-lock-lost, for good, when another writer took the lock while the connection was lost", async () => {
    await expectLockLostWhenTakenMeanwhile(await server.createDatabase());
  }, 60_000);

  it("refuses a second writer only while the first holds the lock: once it closes, the second takes it", async () => {
    const database = await server.createDatabase();
    const a = database.open();
    await startWriter(a);
    const b = database.open();
    expect((await rejection(() => startWriter(b))).code).toBe("writer-lock-held");
    await a.close();
    await lockReleased(database);
    await startWriter(b);
    const pid = await b.transaction(async (tx) => (await tx.query("SELECT pg_backend_pid() AS pid"))[0]?.pid);
    expect(await writerLockHolders(database)).toEqual([pid]);
  }, 60_000);

  it("keeps one lock per database: writers of two databases on one server both start", async () => {
    const [one, two] = [await server.createDatabase(), await server.createDatabase()];
    await startWriter(one.open());
    await startWriter(two.open());
    expect(await writerLockHolders(one)).toHaveLength(1);
    expect(await writerLockHolders(two)).toHaveLength(1);
  }, 60_000);

  it("gives connection-lost (retryable), not a lock error, when the writer cannot connect", async () => {
    const closed = createServer();
    await new Promise<void>((resolve) => closed.listen(0, "127.0.0.1", resolve));
    const port = (closed.address() as { port: number }).port;
    await new Promise<void>((resolve) => closed.close(() => resolve()));
    const db = openPostgres({ connection: connectionOfUrl(`postgres://u:p@127.0.0.1:${port}/x`), committedHeight: noHeight, connectTimeoutSeconds: 2 });
    try {
      const error = await rejection(() => startWriter(db));
      expect(error.code).toBe("connection-lost");
      expect(error.retryable).toBe(true);
      expect((await rejection(() => db.transaction(async () => undefined))).code).toBe("connection-lost");
    } finally {
      await db.close();
    }
  }, 60_000);

  it("refuses to start a closed database's writer with handle-closed", async () => {
    const database = await server.createDatabase();
    const db = database.open();
    await db.close();
    expect((await rejection(() => startWriter(db))).code).toBe("handle-closed");
  }, 60_000);

  it("names no holder when the holder ended before it could be named", async () => {
    // A session whose lock is refused and on which pg_locks then lists no holder: the holder ended in between.
    const session = { query: async (sql: string) => (sql === TAKE_WRITER_LOCK_SQL ? [{ locked: false }] : []) };
    const held = await rejection(() => takeWriterLock(session, "first"));
    expect(held).toMatchObject({ code: "writer-lock-held", details: { backend: "postgresql", holder: null } });
    expect(held.message).toMatch(/^another session holds/);
    const lost = await rejection(() => takeWriterLock(session, "again"));
    expect(lost).toMatchObject({ code: "writer-lock-lost", details: { backend: "postgresql", holder: null } });
    expect(lost.message).toContain("another session held");
  });

  it("refuses an object the database API did not open", async () => {
    const fake = { read: async () => undefined, transaction: async () => undefined, close: async () => undefined };
    await expect(startWriter(fake as never)).rejects.toThrow(/not a database the database API opened/);
  });
});

describe("the PGlite operating-system lock (DB-11, owner decision Q50)", () => {
  it("takes <data directory>.lock.sqlite before PGlite opens, and refuses a second opening in this process however the directory is written", async () => {
    const work = workDirectory();
    const dataDir = join(work, "pgdata");
    const first = await openPglite({ dataDir, committedHeight: noHeight, developmentOptIn: true });
    expect(existsSync(`${dataDir}.lock.sqlite`)).toBe(true);
    expect(pgliteLockFile(dataDir)).toBe(pgliteLockFile(`${dataDir}/`));
    symlinkSync(dataDir, join(work, "link"));
    for (const spelling of [dataDir, `${dataDir}/`, `file://${dataDir}`, join(work, ".", "x", "..", "pgdata"), join(work, "link")]) {
      const started = performance.now();
      const refused = await rejection(() => openPglite({ dataDir: spelling, committedHeight: noHeight, developmentOptIn: true }));
      expect(refused.code, spelling).toBe("writer-lock-held");
      expect(refused.retryable).toBe(false);
      expect(refused.details).toEqual({ backend: "pglite", holder: "this process" });
      expect(performance.now() - started).toBeLessThan(1_000);
    }
    await first.close();
  }, 120_000);

  it("gives a directory not created yet one lock file however it is written: a trailing /., a relative path", async () => {
    const work = workDirectory();
    const expected = pgliteLockFile(join(work, "new"));
    expect(pgliteLockFile(`${work}/new/.`)).toBe(expected);
    expect(pgliteLockFile(`${work}/x/../new`)).toBe(expected);
    expect(pgliteLockFile(relative(process.cwd(), join(work, "new")))).toBe(expected);
    const db = await openPglite({ dataDir: `${work}/new/.`, committedHeight: noHeight, developmentOptIn: true });
    expect(existsSync(expected!)).toBe(true);
    const refused = await rejection(() => openPglite({ dataDir: join(work, "new"), committedHeight: noHeight, developmentOptIn: true }));
    expect(refused.code).toBe("writer-lock-held");
    await db.close();
  }, 60_000);

  it("keeps the lock for the process's life: after close, this process reopens the directory and another process is still refused", async () => {
    const dataDir = join(workDirectory(), "pgdata");
    const first = await openPglite({ dataDir, committedHeight: noHeight, developmentOptIn: true });
    await first.transaction((tx) => tx.execute("CREATE TABLE kept (k integer PRIMARY KEY)"));
    await first.close();
    const other = startWriterProcess({ mode: "lock", dataDir });
    expect(await other.next(firstOf("locked", "refused"))).toMatchObject({ event: "refused", code: "writer-lock-held" });
    const again = await openPglite({ dataDir, committedHeight: noHeight, developmentOptIn: true });
    expect(await again.read((read) => read.query("SELECT count(*)::int AS n FROM kept"))).toEqual([{ n: 0 }]);
    await again.close();
  }, 120_000);

  it("refuses another process's data directory: a process holding the lock makes openPglite refuse at once", async () => {
    const dataDir = join(workDirectory(), "pgdata");
    const holder = startWriterProcess({ mode: "lock", dataDir });
    expect(await holder.next(firstOf("locked", "refused"))).toMatchObject({ event: "locked" });
    const started = performance.now();
    const refused = await rejection(() => openPglite({ dataDir, committedHeight: noHeight, developmentOptIn: true }));
    const elapsed = performance.now() - started;
    expect(refused.code).toBe("writer-lock-held");
    expect(refused.details).toEqual({ backend: "pglite", holder: "another process" });
    expect(elapsed).toBeLessThan(1_000);
    expect(elapsed).toBeGreaterThanOrEqual(PGLITE_LOCK_BUSY_TIMEOUT_MS * 0.9);
    expect(existsSync(join(dataDir, "PG_VERSION"))).toBe(false);
  }, 60_000);

  it("waits out a starter's momentary SHARED lock instead of refusing (decision record Q92)", async () => {
    // What a racing starter does inside its own `BEGIN EXCLUSIVE`: hold SHARED on the lock file for an instant. Here a
    // process holds it with a read transaction for 50 ms, below the busy timeout; with a busy timeout of 0 the lock
    // would be refused although nobody holds it.
    const dataDir = join(workDirectory(), "pgdata");
    const lockFile = pgliteLockFile(dataDir)!;
    const reader = spawnChild(process.execPath, ["--no-warnings", "-e", SHARED_FOR_A_MOMENT, lockFile], { stdio: ["ignore", "pipe", "pipe"] });
    const lines = createInterface({ input: reader.stdout! });
    const reports: Record<string, number> = {};
    const shared = new Promise<void>((resolve) =>
      lines.on("line", (line) => {
        const [event, at] = line.split(" ");
        reports[event!] = Number(at);
        if (event === "shared") resolve();
      }),
    );
    try {
      await shared;
      const askedAt = Date.now();
      const lock = await acquirePgliteLock(dataDir);
      expect(lock?.file).toBe(lockFile);
      await once(reader, "close");
      // The lock was asked for while the other process still held SHARED, and taken once it let go.
      expect(askedAt).toBeLessThan(reports.released!);
      lock?.endUse();
    } finally {
      if (reader.exitCode === null) reader.kill("SIGKILL");
    }
  }, 60_000);

  it("takes no lock for memory://: each in-memory database is its own", async () => {
    const one = await openPglite({ dataDir: "memory://", committedHeight: noHeight, developmentOptIn: true });
    const two = await openPglite({ dataDir: "memory://", committedHeight: noHeight, developmentOptIn: true });
    expect(pgliteLockFile("memory://")).toBeUndefined();
    await one.transaction((tx) => tx.execute("CREATE TABLE only_one (k integer)"));
    expect(await two.read((read) => read.query("SELECT to_regclass('only_one') IS NULL AS absent"))).toEqual([{ absent: true }]);
    await Promise.all([one.close(), two.close()]);
  }, 60_000);

  it("refuses data directories PGlite keeps in a browser (idb://, opfs-ahp://) before anything opens", async () => {
    for (const dataDir of ["idb://umbradb", "opfs-ahp://umbradb"]) {
      const refused = await rejection(() => openPglite({ dataDir, committedHeight: noHeight, developmentOptIn: true }));
      expect(refused.code).toBe("invalid-configuration");
      expect(refused.details).toEqual({ parameter: "database" });
    }
  });

  it("reports a lock file it cannot open or lock as open-failed: a directory in its place, a file that is not SQLite's", async () => {
    const work = workDirectory();
    const [occupied, garbage] = [join(work, "occupied"), join(work, "garbage")];
    mkdirSync(`${occupied}.lock.sqlite`);
    writeFileSync(`${garbage}.lock.sqlite`, "not a SQLite database, but long enough to have a header of its own".repeat(10));
    const notOpened = await rejection(() => openPglite({ dataDir: occupied, committedHeight: noHeight, developmentOptIn: true }));
    expect(notOpened).toMatchObject({ code: "database-error", details: { reason: "open-failed" } });
    expect(notOpened.message).toMatch(/cannot be opened/);
    const notLocked = await rejection(() => openPglite({ dataDir: garbage, committedHeight: noHeight, developmentOptIn: true }));
    expect(notLocked).toMatchObject({ code: "database-error", details: { reason: "open-failed" } });
    expect(notLocked.message).toMatch(/cannot be locked/);
    expect(existsSync(occupied)).toBe(false);
    expect(existsSync(garbage)).toBe(false);
  }, 60_000);

  it("keeps the lock when PGlite then fails to open the directory, and lets this process open it once repaired", async () => {
    const dataDir = join(workDirectory(), "pgdata");
    mkdirSync(dataDir);
    writeFileSync(join(dataDir, "PG_VERSION"), "99\n");
    const failed = await rejection(() => openPglite({ dataDir, committedHeight: noHeight, developmentOptIn: true }));
    expect(failed).toMatchObject({ code: "database-error", details: { reason: "open-failed" } });
    const other = startWriterProcess({ mode: "lock", dataDir });
    expect(await other.next(firstOf("locked", "refused"))).toMatchObject({ event: "refused", code: "writer-lock-held" });
    rmSync(dataDir, { recursive: true });
    const db = await openPglite({ dataDir, committedHeight: noHeight, developmentOptIn: true });
    expect(await db.read((read) => read.query("SELECT 1 AS one"))).toEqual([{ one: 1 }]);
    await db.close();
  }, 120_000);

  it("reports a data directory it cannot lock as open-failed, creating nothing: a file, a missing parent", async () => {
    const work = workDirectory();
    const file = join(work, "a-file");
    writeFileSync(file, "x");
    for (const dataDir of [file, join(work, "missing", "pgdata")]) {
      const error = await rejection(() => openPglite({ dataDir, committedHeight: noHeight, developmentOptIn: true }));
      expect(error.code, dataDir).toBe("database-error");
      expect(error.details).toEqual({ reason: "open-failed" });
      expect(existsSync(`${dataDir}.lock.sqlite`)).toBe(false);
    }
  }, 60_000);
});
