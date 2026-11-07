import { PostgreSqlContainer, type StartedPostgreSqlContainer } from "@testcontainers/postgresql";
import { existsSync } from "node:fs";
import { join } from "node:path";
import postgres from "postgres";
import { afterAll, afterEach, beforeAll, describe, expect, it } from "vitest";
import { POSTGRES_IMAGE } from "../postgres-image.js";
import type { Row } from "../../src/db/api.js";
import {
  assertNoTransactionPooler,
  classifyFsync,
  classifyFullPageWrites,
  classifySynchronousCommit,
  probeAdvisoryLockVisibility,
  probeDurability,
} from "../../src/db/durability-probe.js";
import { UmbraError } from "../../src/db/errors.js";
import { startDatabase } from "../../src/db/migrate.js";
import { openPglite } from "../../src/db/pglite.js";
import { openPostgres, type PostgresOptions } from "../../src/db/postgres.js";
import { planSchemas } from "../../src/db/roles.js";
import { startWriter } from "../../src/db/writer-lock.js";
import { expectRefusedBeforeAnyWrite } from "./durability-checks.js";
import { cleanUp, workDirectory } from "./pglite-processes.js";
import { BACKEND_END_MS, rejection, WRITER_LOCK_HOLDERS_SQL } from "./writer-lock-checks.js";
import { startContainers } from "../containers.js";
import { connectionOfUrl } from "./connection.js";

/**
 * The durability probe at its new path, `src/db/durability-probe.ts`. It moved from 0.9.5's
 * `src/postgres/durability-probe.ts` with its behaviour unchanged. [design §4, §13]
 *
 * On PostgreSQL 18, startup refuses with `fsync=off`, with a detected transaction pooler, and with
 * `full_page_writes=off` unless `fullPageWritesOffAllowed` is set. On PGlite, startup refuses without the development
 * opt-in. [A18 CI, DB-12, CF-9]
 *
 * 0.9.5's cases are all here, against the database API:
 * - the pure classifiers, exhaustively, with no server (B1–B3, B6);
 * - the live servers, one per setting, started with `-c`, through the writer's start. The writer's start takes the
 *   writer lock and then runs the probe on the writer's session before any write (B1–B5, the concurrent sentinel
 *   holder).
 *
 * What changed from 0.9.5:
 * - each refusal is an `UmbraError` with its own error code (`durability-fsync-off`, `durability-full-page-writes-off`,
 *   `durability-pooler`) instead of 0.9.5's two classes; [design §11]
 * - the override is `fullPageWritesOffAllowed`; [CF-4]
 * - the probe runs at the writer's start instead of inside 0.9.5's `runMigrations`.
 *
 * "Startup refuses" (the refused state) belongs to the runner; here the writer's start, its transactions and
 * `startDatabase` refuse.
 *
 * PostgreSQL 18 images turn data checksums on by default. A server started with `full_page_writes=off` still starts and
 * reports `off`, so the probe's cases are unchanged.
 */

const noHeight = async (): Promise<bigint | null> => null;

/** A server started with `-c` for each of `settings` (not started yet: {@link startContainers} starts them together). */
function server(settings: string[]): PostgreSqlContainer {
  const container = new PostgreSqlContainer(POSTGRES_IMAGE);
  const args = settings.flatMap((setting) => ["-c", setting]);
  return args.length > 0 ? container.withCommand(["postgres", ...args]) : container;
}

describe("the durability probe — classifiers, no server (DB-12)", () => {
  it("classifyFsync: off is a violation with its code, on is clean (B1)", () => {
    expect(classifyFsync("off")).toMatchObject({ code: "durability-fsync-off", setting: "fsync", value: "off" });
    expect(classifyFsync("on")).toBeNull();
  });

  it("classifyFullPageWrites: off is refused unless allowed, on is clean (B3)", () => {
    expect(classifyFullPageWrites("off", false)).toMatchObject({
      code: "durability-full-page-writes-off",
      setting: "full_page_writes",
      value: "off",
    });
    expect(classifyFullPageWrites("off", false)!.message).toContain("fullPageWritesOffAllowed");
    expect(classifyFullPageWrites("off", true)).toBeNull();
    expect(classifyFullPageWrites("on", false)).toBeNull();
  });

  it("classifySynchronousCommit: off is a lost-tail warning, never a violation (B2); local, remote_write, remote_apply and on are durable (B2b)", () => {
    expect(classifySynchronousCommit("off")).toMatchObject({ kind: "lost-tail", setting: "synchronous_commit", value: "off" });
    for (const durable of ["local", "remote_write", "remote_apply", "on"]) expect(classifySynchronousCommit(durable)).toBeNull();
  });

  it("probeAdvisoryLockVisibility reports what it saw even when its unlock fails (the session was lost meanwhile)", async () => {
    const answers: Record<string, Row[]> = {
      pid: [{ pid: 42 }],
      lock: [{ acquired: true }],
      seen: [{ visible: 1 }],
    };
    const session = {
      query: async (sql: string): Promise<Row[]> => {
        if (sql.includes("pg_advisory_unlock")) throw new Error("connection lost");
        if (sql.includes("pg_try_advisory_lock")) return answers.lock!;
        if (sql.includes("pg_locks")) return answers.seen!;
        return answers.pid!;
      },
    };
    expect(await probeAdvisoryLockVisibility(session)).toEqual({ acquired: true, visibleCount: 1 });
  });

  it("assertNoTransactionPooler: only a lock taken but not seen is a pooler (durability-pooler); not taken fails open (B6)", () => {
    expect(() => assertNoTransactionPooler(true, 1)).not.toThrow();
    let thrown: unknown;
    try {
      assertNoTransactionPooler(true, 0);
    } catch (error) {
      thrown = error;
    }
    expect(thrown).toBeInstanceOf(UmbraError);
    expect(thrown).toMatchObject({ code: "durability-pooler", retryable: false });
    expect(() => assertNoTransactionPooler(false, 0)).not.toThrow();
    expect(() => assertNoTransactionPooler(false, 3)).not.toThrow();
  });
});

describe("A18 — the durability probe on PostgreSQL 18 (DB-12)", () => {
  let healthy: StartedPostgreSqlContainer;
  let fsyncOff: StartedPostgreSqlContainer;
  let fullPageWritesOff: StartedPostgreSqlContainer;
  let bothOff: StartedPostgreSqlContainer;
  let syncOff: StartedPostgreSqlContainer;
  let syncLocal: StartedPostgreSqlContainer;

  beforeAll(async () => {
    // Started together; if one fails, the others are stopped (`startContainers`), so a failed setup leaves none.
    [healthy, fsyncOff, fullPageWritesOff, bothOff, syncOff, syncLocal] = await startContainers([
      server([]),
      server(["fsync=off"]),
      server(["full_page_writes=off"]),
      server(["fsync=off", "full_page_writes=off"]),
      server(["synchronous_commit=off"]),
      server(["synchronous_commit=local"]),
    ]);
  }, 240_000);

  afterAll(async () => {
    await Promise.all([healthy, fsyncOff, fullPageWritesOff, bothOff, syncOff, syncLocal].map((c) => c?.stop()));
  }, 60_000);

  /** Opens `container`'s database, starts its writer and runs startup with no parts; resolves with the warnings. */
  async function startsAndMigrates(container: StartedPostgreSqlContainer, options: Partial<PostgresOptions> = {}) {
    const db = openPostgres({ connection: connectionOfUrl(container.getConnectionUri()), committedHeight: noHeight, ...options });
    try {
      const { durabilityWarnings } = await startWriter(db);
      await startDatabase(db, { plan: planSchemas([]), parts: [], committedVersions: new Map(), handles: { height: null } });
      const [row] = await db.read((read) => read.query("SELECT to_regclass('core_chain.migrations') IS NOT NULL AS made"));
      expect(row?.made).toBe(true);
      return durabilityWarnings;
    } finally {
      await db.close();
      await released(container);
    }
  }

  /** Waits until no session of `container` holds the writer lock (a closed session leaves a moment later). */
  async function released(container: StartedPostgreSqlContainer): Promise<void> {
    const admin = postgres(container.getConnectionUri(), { max: 1, onnotice: () => undefined });
    try {
      await expect
        .poll(async () => (await admin.unsafe(WRITER_LOCK_HOLDERS_SQL)).length, { timeout: BACKEND_END_MS })
        .toBe(0);
    } finally {
      await admin.end({ timeout: 5 });
    }
  }

  it("A18 (B4): a healthy server — the writer starts with no warning and startup proceeds", async () => {
    expect(await startsAndMigrates(healthy)).toEqual([]);
  }, 60_000);

  it("A18 (B1): fsync=off refuses with durability-fsync-off before any write or migration, and the refused writer holds no lock", async () => {
    const refused = await expectRefusedBeforeAnyWrite(fsyncOff.getConnectionUri(), "durability-fsync-off");
    expect(refused.details).toMatchObject({ setting: "fsync", value: "off" });
    expect(refused.message).toMatch(/fsync=off/);
    expect(refused.message).not.toContain(fsyncOff.getConnectionUri());
  }, 60_000);

  it("takes the writer lock before it probes: another holder is writer-lock-held even on a server the probe would refuse", async () => {
    const holder = postgres(fsyncOff.getConnectionUri(), { max: 1, onnotice: () => undefined });
    try {
      await holder.unsafe("SELECT pg_advisory_lock(3, hashtext('umbradb-writer'))");
      const db = openPostgres({ connection: connectionOfUrl(fsyncOff.getConnectionUri()), committedHeight: noHeight });
      try {
        expect((await rejection(() => startWriter(db))).code).toBe("writer-lock-held");
      } finally {
        await db.close();
      }
    } finally {
      await holder.end({ timeout: 5 });
    }
    await released(fsyncOff);
  }, 60_000);

  it("A18 (B3): full_page_writes=off refuses with durability-full-page-writes-off unless fullPageWritesOffAllowed is set", async () => {
    const refused = await expectRefusedBeforeAnyWrite(fullPageWritesOff.getConnectionUri(), "durability-full-page-writes-off");
    expect(refused.details).toMatchObject({ setting: "full_page_writes", value: "off" });
    expect(refused.message).toContain("fullPageWritesOffAllowed");
    await expectRefusedBeforeAnyWrite(fullPageWritesOff.getConnectionUri(), "durability-full-page-writes-off", {
      fullPageWritesOffAllowed: false,
    });
    expect(await startsAndMigrates(fullPageWritesOff, { fullPageWritesOffAllowed: true })).toEqual([]);
  }, 60_000);

  it("refuses fsync=off and full_page_writes=off together with durability-fsync-off, naming both; the override does not cover fsync", async () => {
    const refused = await expectRefusedBeforeAnyWrite(bothOff.getConnectionUri(), "durability-fsync-off");
    expect(refused.details.violations).toEqual([
      { code: "durability-fsync-off", setting: "fsync", value: "off" },
      { code: "durability-full-page-writes-off", setting: "full_page_writes", value: "off" },
    ]);
    expect(refused.message).toMatch(/fsync=off.*full_page_writes=off/s);
    const allowed = await expectRefusedBeforeAnyWrite(bothOff.getConnectionUri(), "durability-fsync-off", {
      fullPageWritesOffAllowed: true,
    });
    expect(allowed.details.violations).toEqual([{ code: "durability-fsync-off", setting: "fsync", value: "off" }]);
  }, 60_000);

  it("(B2) synchronous_commit=off is a lost-tail warning, not a refusal: the writer starts and reports it", async () => {
    const warnings = await startsAndMigrates(syncOff);
    expect(warnings).toHaveLength(1);
    expect(warnings[0]).toMatchObject({ kind: "lost-tail", setting: "synchronous_commit", value: "off" });
  }, 60_000);

  it("(B2b) synchronous_commit=local is durable: no warning", async () => {
    expect(await startsAndMigrates(syncLocal)).toEqual([]);
  }, 60_000);

  it("reports the first start's warnings again to a later start of the same writer", async () => {
    const db = openPostgres({ connection: connectionOfUrl(syncOff.getConnectionUri()), committedHeight: noHeight });
    try {
      await db.transaction(async () => undefined);
      expect((await startWriter(db)).durabilityWarnings).toHaveLength(1);
    } finally {
      await db.close();
    }
  }, 60_000);

  /** One session of `url`, as the probe takes it: statements in autocommit, one after another. */
  function directSession(url: string) {
    const sql = postgres(url, { max: 1, onnotice: () => undefined });
    return {
      query: async (text: string, params: unknown[] = []) => [...(await sql.unsafe(text, params as string[]))] as Row[],
      end: () => sql.end({ timeout: 5 }),
    };
  }

  it("A18: a transaction pooler — statements of one session reaching different backends — is refused with durability-pooler", async () => {
    // A pooler in transaction mode hands each statement outside a transaction to any free backend: here, two.
    const [one, two] = [directSession(healthy.getConnectionUri()), directSession(healthy.getConnectionUri())];
    let next = 0;
    const pooled = { query: (text: string, params?: unknown[]) => (next++ % 2 === 0 ? one : two).query(text, params) };
    try {
      const refused = await rejection(() => probeDurability(pooled, { fullPageWritesOffAllowed: false }));
      expect(refused.code).toBe("durability-pooler");
      expect(refused.retryable).toBe(false);
      expect(refused.message).toMatch(/pooler/);
      // The same probe on one direct session passes.
      expect(await probeDurability(one, { fullPageWritesOffAllowed: false })).toEqual([]);
    } finally {
      await Promise.all([one.end(), two.end()]);
    }
  }, 60_000);

  it("(B5) probeAdvisoryLockVisibility observes its own session advisory lock on a direct session, and releases it", async () => {
    const session = directSession(healthy.getConnectionUri());
    try {
      const seen = await probeAdvisoryLockVisibility(session);
      expect(seen.acquired).toBe(true);
      expect(seen.visibleCount).toBeGreaterThanOrEqual(1);
      expect(() => assertNoTransactionPooler(seen.acquired, seen.visibleCount)).not.toThrow();
      const [left] = await session.query("SELECT count(*)::int AS n FROM pg_locks WHERE locktype = 'advisory' AND pid = pg_backend_pid()");
      expect(left?.n).toBe(0);
    } finally {
      await session.end();
    }
  }, 60_000);

  it("fails open, not as a pooler, when another session holds this session's sentinel key", async () => {
    const [mine, other] = [directSession(healthy.getConnectionUri()), directSession(healthy.getConnectionUri())];
    try {
      const [row] = await mine.query("SELECT pg_backend_pid() AS pid");
      await other.query("SELECT pg_advisory_lock(3, hashtext($1))", [`umbradb:durability-probe:pooler:${row?.pid}`]);
      expect(await probeAdvisoryLockVisibility(mine)).toEqual({ acquired: false, visibleCount: 0 });
      expect(await probeDurability(mine, { fullPageWritesOffAllowed: false })).toEqual([]);
    } finally {
      await Promise.all([mine.end(), other.end()]);
    }
  }, 60_000);
});

describe("A18 — PGlite only under the development opt-in (DB-12, CF-9)", () => {
  afterEach(async () => {
    await cleanUp();
  });

  it("A18: refuses PGlite without the development opt-in, naming PGlite and the opt-in, before anything is created", async () => {
    const dataDir = join(workDirectory(), "pgdata");
    for (const target of ["memory://", dataDir]) {
      const refused = await rejection(() => openPglite({ dataDir: target, committedHeight: noHeight, developmentOptIn: false }));
      expect(refused.code).toBe("development-opt-in-required");
      expect(refused.retryable).toBe(false);
      expect(refused.details).toEqual({ feature: "pglite" });
      expect(refused.message).toMatch(/PGlite/);
      expect(refused.message).toContain("developmentOptIn");
      expect(refused.message).not.toContain(dataDir);
    }
    expect(existsSync(dataDir)).toBe(false);
    expect(existsSync(`${dataDir}.lock.sqlite`)).toBe(false);
  }, 60_000);

  it("opens PGlite under the development opt-in", async () => {
    const db = await openPglite({ dataDir: "memory://", committedHeight: noHeight, developmentOptIn: true });
    expect(await startWriter(db)).toEqual({ durabilityWarnings: [] });
    await db.close();
    expect((await rejection(() => startWriter(db))).code).toBe("handle-closed");
  }, 60_000);
});
