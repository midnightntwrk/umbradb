import { PostgreSqlContainer, type StartedPostgreSqlContainer } from "@testcontainers/postgresql";
import postgres from "postgres";
import { afterAll, beforeAll, describe, expect, it, vi } from "vitest";
import { POSTGRES_IMAGE } from "../postgres-image.js";
import type * as Probe from "../../src/db/durability-probe.js";
import { startDatabase } from "../../src/db/migrate.js";
import { openPostgres } from "../../src/db/postgres.js";
import { planSchemas } from "../../src/db/roles.js";
import { startWriter } from "../../src/db/writer-lock.js";
import { expectRefusedBeforeAnyWrite } from "./durability-checks.js";
import { WRITER_LOCK_HOLDERS_SQL } from "./writer-lock-checks.js";

/**
 * A18's committed negative control (DB-12): a durability probe that ignores `fsync` must make A18's `fsync=off` check
 * (`durability-checks.ts`, run by `durability-probe.test.ts`) fail.
 *
 * `vi.mock` replaces `probeDurability` of `src/db/durability-probe.ts`, in this file's module graph only, with the real
 * probe's own steps minus its `fsync` check: `full_page_writes` with its override, the pooler check and the
 * `synchronous_commit` warning, each from the module's exports. The PostgreSQL backend (`src/db/postgres.ts`) then runs
 * that probe when its writer starts, and a server with `fsync=off` starts and migrates.
 */

vi.mock("../../src/db/durability-probe.js", async (importOriginal) => {
  const actual = await importOriginal<typeof Probe>();
  const probeDurability: typeof actual.probeDurability = async (session, options) => {
    const read = async (name: string) => String((await session.query("SELECT current_setting($1) AS v", [name]))[0]?.v);
    const violation = actual.classifyFullPageWrites(await read("full_page_writes"), options.fullPageWritesOffAllowed);
    if (violation !== null) throw actual.durabilityRefusal([violation]);
    const seen = await actual.probeAdvisoryLockVisibility(session);
    actual.assertNoTransactionPooler(seen.acquired, seen.visibleCount);
    const warning = actual.classifySynchronousCommit(await read("synchronous_commit"));
    return warning === null ? [] : [warning];
  };
  return { ...actual, probeDurability };
});

let fsyncOff: StartedPostgreSqlContainer;

beforeAll(async () => {
  fsyncOff = await new PostgreSqlContainer(POSTGRES_IMAGE).withCommand(["postgres", "-c", "fsync=off"]).start();
}, 180_000);

afterAll(async () => {
  await fsyncOff?.stop();
}, 60_000);

describe("A18's negative control: a durability probe that ignores fsync", () => {
  it("makes A18's fsync=off check fail: the writer starts and startup migrates on a server with fsync=off", async () => {
    let failure: unknown;
    try {
      await expectRefusedBeforeAnyWrite(fsyncOff.getConnectionUri(), "durability-fsync-off");
    } catch (error) {
      failure = error;
    }
    expect(failure).toBeInstanceOf(Error);
    expect((failure as Error).name).toBe("AssertionError");
    expect((failure as Error).message).toMatch(/expected an UmbraError, but the call resolved/);

    // The reason, shown directly: with fsync=off, the writer starts and startup creates core_chain. (The check's
    // writer, closed, leaves the server a moment after its client closed.)
    const admin = postgres(fsyncOff.getConnectionUri(), { max: 1, onnotice: () => undefined });
    await expect.poll(async () => (await admin.unsafe(WRITER_LOCK_HOLDERS_SQL)).length, { timeout: 5_000 }).toBe(0);
    await admin.end({ timeout: 5 });
    const db = openPostgres({ url: fsyncOff.getConnectionUri(), committedHeight: async () => null });
    try {
      expect(await startWriter(db)).toEqual({ durabilityWarnings: [] });
      await startDatabase(db, { plan: planSchemas([]), parts: [], committedVersions: new Map() });
      const [row] = await db.read((read) => read.query("SELECT current_setting('fsync') AS fsync"));
      expect(row?.fsync).toBe("off");
    } finally {
      await db.close();
    }
  }, 120_000);
});
