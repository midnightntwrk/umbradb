import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { afterAll, beforeAll, describe, expect, it, vi } from "vitest";
import type { Database } from "../../src/db/api.js";
import { UmbraError } from "../../src/db/errors.js";
import type * as SettingsModule from "../../src/deterministic-postgresql/settings.js";
import { SESSION_SETTINGS, ZERO_TIMEOUTS } from "../../src/deterministic-postgresql/index.js";
import {
  ALL_ONE_SECOND,
  idleBlock,
  migrated,
  ONE_SECOND_TIMEOUTS,
  SHOW_TIMEOUTS,
  slowCallbackRead,
  slowMigrationAndSetup,
  slowReadInBlock,
  writerIdleBetweenBlocks,
} from "../deterministic-postgresql/zero-timeouts-checks.js";
import { BACKENDS } from "./backends.js";

/**
 * The negative control of A141's long-work half (task 2.7): this file's module graph is built with the component's
 * session settings lacking the zero timeouts (`vi.mock` of `src/deterministic-postgresql/settings.ts`), so the database
 * API pins only the five settings of Q65. With every timeout defaulting to 1 s, each check of
 * `test/deterministic-postgresql/zero-timeouts-checks.ts` that passes on the real build must fail here: the database's
 * timeouts reach the writer, the migrations, setup and the callbacks' reads, and cut their work off.
 *
 * PostgreSQL only: on PGlite such a build hangs the process (a timeout that fires hangs the engine synchronously), so
 * PGlite's half runs, bounded, in processes of their own (`pglite-timeouts.test.ts`).
 */

vi.mock("../../src/deterministic-postgresql/settings.js", async (importOriginal) => {
  const real = await importOriginal<typeof SettingsModule>();
  return { ...real, ZERO_TIMEOUTS: [], SESSION_SETTINGS: real.PINNED_SETTINGS };
});

const SETTINGS_SOURCE = fileURLToPath(new URL("../../src/deterministic-postgresql/settings.ts", import.meta.url));
const TEST_TIMEOUT = 60_000;
const postgres = BACKENDS.find((backend) => !backend.singleQueue)!;

/** What `run` rejects with; fails the test if it resolves. */
async function rejection(run: Promise<unknown>): Promise<unknown> {
  return run.then(
    (value) => {
      throw new Error(`expected the check to fail without the zeros, but it resolved: ${String(value)}`);
    },
    (error: unknown) => error,
  );
}

describe("negative control: without the zero timeouts, A141's long work is cut off on PostgreSQL 18", () => {
  beforeAll(() => postgres.start(), 180_000);
  afterAll(() => postgres.stop(), 60_000);

  async function hostile(): Promise<Database> {
    const { db, unpinned } = await postgres.database("SELECT 1", undefined, ONE_SECOND_TIMEOUTS);
    expect(unpinned).toEqual(ALL_ONE_SECOND);
    return db;
  }

  it("runs a build without the zeros, while the real settings file has them", async () => {
    expect(ZERO_TIMEOUTS).toEqual([]);
    expect(SESSION_SETTINGS.map(([name]) => name)).not.toContain("statement_timeout");
    const real = await vi.importActual<typeof SettingsModule>("../../src/deterministic-postgresql/settings.js");
    expect(real.ZERO_TIMEOUTS).toHaveLength(5);
    expect(real.SESSION_SETTINGS.slice(-5)).toEqual(real.ZERO_TIMEOUTS);
    // The mock replaces exports only: the file itself is the one the real build uses.
    expect(readFileSync(SETTINGS_SOURCE, "utf8")).toContain('["idle_in_transaction_session_timeout", "0"]');
  });

  it("lets the database's 1 s timeouts reach every read and transaction", async () => {
    const db = await hostile();
    expect((await db.read((read) => read.query(SHOW_TIMEOUTS)))[0]).toEqual(ALL_ONE_SECOND);
    expect((await db.transaction((tx) => tx.query(SHOW_TIMEOUTS)))[0]).toEqual(ALL_ONE_SECOND);
  }, TEST_TIMEOUT);

  it("cuts off the 5 s migration", async () => {
    const db = await hostile();
    const error = await rejection(slowMigrationAndSetup(db));
    expect(error).toBeInstanceOf(UmbraError);
  }, TEST_TIMEOUT);

  it("ends the block transaction left idle 5 s while a callback awaits", async () => {
    const db = await hostile();
    const plan = await migrated(db);
    const error = await rejection(idleBlock(db, plan, 1n));
    expect(error).toMatchObject({ code: "connection-lost" });
  }, TEST_TIMEOUT);

  it("cuts off a callback's read running 5 s on its block write handle", async () => {
    const db = await hostile();
    const plan = await migrated(db);
    const error = await rejection(slowReadInBlock(db, plan, 2n));
    expect(error).toBeInstanceOf(UmbraError);
  }, TEST_TIMEOUT);

  it("cuts off a callback's read handle outside the block running 5 s", async () => {
    const db = await hostile();
    const error = await rejection(slowCallbackRead(db));
    expect(error).toBeInstanceOf(UmbraError);
  }, TEST_TIMEOUT);

  it("loses the writer's session, and the writer lock with it, across 2 s idle between blocks", async () => {
    const db = await hostile();
    const { before, after } = await writerIdleBetweenBlocks(db);
    expect(after).not.toBe(before);
  }, TEST_TIMEOUT);
});
