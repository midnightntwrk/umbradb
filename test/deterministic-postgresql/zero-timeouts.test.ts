import { afterAll, beforeAll, describe, expect, it } from "vitest";
import type { Database } from "../../src/db/api.js";
import { SESSION_SETTINGS, ZERO_TIMEOUTS } from "../../src/deterministic-postgresql/index.js";
import { BACKENDS } from "../db/backends.js";
import {
  ALL_ONE_SECOND,
  ALL_ZERO,
  IDLE_GAP_MS,
  idleBlock,
  LONG_MS,
  migrated,
  ONE_SECOND_TIMEOUTS,
  SHOW_TIMEOUTS,
  slowCallbackRead,
  slowMigrationAndSetup,
  slowReadInBlock,
  TIMEOUT_NAMES,
  writerIdleBetweenBlocks,
} from "./zero-timeouts-checks.js";

/**
 * The zero timeouts of the `deterministic_postgresql` component (`design.md` §4, "Session settings (Q65) and timeouts
 * (Q71)"; DB-15; task 2.7), on PostgreSQL 18 and on PGlite 0.5.10 — A141's long-work half. Every session of the
 * database API starts with `statement_timeout`, `lock_timeout`, `idle_in_transaction_session_timeout`,
 * `transaction_timeout` and `idle_session_timeout` at 0, whatever the database's defaults (PostgreSQL: `ALTER DATABASE`
 * and `ALTER ROLE … IN DATABASE`; PGlite: its configuration file), because the writer, migrations, setup and the read
 * handles given to callbacks run work the runner must finish. Here every one of them defaults to 1 s, and a 5 s
 * migration, setup idle 2 s, a block transaction left idle 5 s while a callback awaits, a callback's read running 5 s
 * (on the block write handle, and on a read handle outside the block) and the writer idle 2 s between blocks all
 * complete, with `SHOW` reporting 0 in each. `idle_session_timeout` is DB-15's fifth (owner decision Q93).
 *
 * Before its long work, each test checks that a read and a transaction report the zeros: on PGlite a nonzero
 * `idle_in_transaction_session_timeout`, `transaction_timeout` or `idle_session_timeout` hangs the engine — the whole
 * process, synchronously (design §14; probe 2026-10-25) — so a build without the zeros must fail there, at once, not
 * hang the suite. That such a build fails the long work itself is shown on PostgreSQL by
 * `test/db/zero-timeouts.negative-control.test.ts`, and the PGlite hang, bounded, in a process of its own by
 * `test/db/pglite-timeouts.test.ts`.
 *
 * These tests wait seconds on purpose; each has a timeout far above its work (the default 5 s fails under load).
 */

const TEST_TIMEOUT = 60_000;

/**
 * How much shorter than asked a wait may measure on `performance.now()`: Node's timers run on a millisecond loop clock,
 * and PGlite's `pg_sleep(5)` measured 4,999.35 ms once — the bounds below only show the work really took its time.
 */
const CLOCK_SLACK_MS = 50;

describe("the zero timeouts are session settings of the component (DB-15, Q71, Q93)", () => {
  it("names the five timeouts at 0, and every session starts with them after the five pinned settings", () => {
    expect(ZERO_TIMEOUTS).toEqual([
      ["statement_timeout", "0"],
      ["lock_timeout", "0"],
      ["idle_in_transaction_session_timeout", "0"],
      ["transaction_timeout", "0"],
      ["idle_session_timeout", "0"],
    ]);
    expect(SESSION_SETTINGS.slice(-ZERO_TIMEOUTS.length)).toEqual(ZERO_TIMEOUTS);
    expect(ZERO_TIMEOUTS.map(([name]) => name)).toEqual(TIMEOUT_NAMES);
  });
});

describe.each(BACKENDS)("A141: the writer, migrations, setup and callback reads are never cut off on $name", (backend) => {
  beforeAll(() => backend.start(), 180_000);
  afterAll(() => backend.stop(), 60_000);

  /** A fresh database whose own defaults set every timeout to 1 s, checked by a session that pins nothing. */
  async function hostile(): Promise<Database> {
    const { db, unpinned } = await backend.database("SELECT 1", undefined, ONE_SECOND_TIMEOUTS);
    // Control: the defaults are in effect for any session that does not pin the timeouts.
    expect(unpinned).toEqual(ALL_ONE_SECOND);
    return db;
  }

  /** A read and a transaction both report every timeout at 0: checked before any long work (see the file comment). */
  async function expectZeros(db: Database): Promise<void> {
    expect((await db.read((read) => read.query(SHOW_TIMEOUTS)))[0]).toEqual(ALL_ZERO);
    expect((await db.transaction((tx) => tx.query(SHOW_TIMEOUTS)))[0]).toEqual(ALL_ZERO);
  }

  it("starts every read and every transaction with the five timeouts at 0, over 1 s database defaults", async () => {
    const db = await hostile();
    await expectZeros(db);
    // And again after an idle gap longer than the defaults: neither the read connection nor the writer was ended.
    await new Promise((resolve) => setTimeout(resolve, IDLE_GAP_MS));
    await expectZeros(db);
  }, TEST_TIMEOUT);

  it("completes a 5 s migration and setup idle 2 s, and SHOW reports 0 in each", async () => {
    const db = await hostile();
    await expectZeros(db);
    const { migration, setup } = await slowMigrationAndSetup(db);
    expect(migration.settings).toEqual(ALL_ZERO);
    expect(migration.ms).toBeGreaterThanOrEqual(LONG_MS - CLOCK_SLACK_MS);
    expect(setup.settings).toEqual(ALL_ZERO);
    expect(setup.ms).toBeGreaterThanOrEqual(IDLE_GAP_MS - CLOCK_SLACK_MS);
  }, TEST_TIMEOUT);

  it("commits a block transaction left idle 5 s while a callback awaits, and SHOW reports 0 there", async () => {
    const db = await hostile();
    await expectZeros(db);
    const plan = await migrated(db);
    const outcome = await idleBlock(db, plan, 1n);
    expect(outcome.settings).toEqual(ALL_ZERO);
    expect(outcome.ms).toBeGreaterThanOrEqual(LONG_MS - CLOCK_SLACK_MS);
    expect(await db.read((read) => read.query("SELECT k FROM m.t"))).toEqual([{ k: 1n }]);
  }, TEST_TIMEOUT);

  it("completes a callback's read running 5 s on its block write handle, and SHOW reports 0 there", async () => {
    const db = await hostile();
    await expectZeros(db);
    const plan = await migrated(db);
    const outcome = await slowReadInBlock(db, plan, 2n);
    expect(outcome.settings).toEqual(ALL_ZERO);
    expect(outcome.ms).toBeGreaterThanOrEqual(LONG_MS - CLOCK_SLACK_MS);
    expect(await db.read((read) => read.query("SELECT k FROM m.t"))).toEqual([{ k: 2n }]);
  }, TEST_TIMEOUT);

  it("completes a callback's read handle outside the block running 5 s and idle 2 s, and SHOW reports 0 there", async () => {
    const db = await hostile();
    await expectZeros(db);
    const outcome = await slowCallbackRead(db);
    expect(outcome.settings).toEqual(ALL_ZERO);
    expect(outcome.ms).toBeGreaterThanOrEqual(LONG_MS + IDLE_GAP_MS - CLOCK_SLACK_MS);
  }, TEST_TIMEOUT);

  it("keeps the writer's session across 2 s idle between blocks (idle_session_timeout, Q93)", async () => {
    const db = await hostile();
    await expectZeros(db);
    const { before, after, settings } = await writerIdleBetweenBlocks(db);
    expect(before).toEqual(expect.any(Number));
    expect(after).toBe(before);
    expect(settings).toEqual(ALL_ZERO);
  }, TEST_TIMEOUT);

  it.skipIf(backend.singleQueue)(
    "lets a writer transaction wait 2 s for a lock a read holds (lock_timeout; PGlite has one session and no lock waits)",
    async () => {
      const db = await hostile();
      await expectZeros(db);
      await migrated(db);
      let readHolds!: () => void;
      const held = new Promise<void>((resolve) => {
        readHolds = resolve;
      });
      // An API-style read holds ACCESS SHARE on m.t for 2 s, as a module's read would while a migration alters it.
      const reading = db.read(async (read) => {
        await read.query("SELECT count(*) AS n FROM m.t");
        readHolds();
        await new Promise((resolve) => setTimeout(resolve, IDLE_GAP_MS));
        return read.query("SELECT 1 AS one");
      });
      await held;
      const started = performance.now();
      await db.transaction(async (tx) => {
        await tx.execute("LOCK TABLE m.t IN ACCESS EXCLUSIVE MODE");
        await tx.execute("INSERT INTO m.t VALUES (3)");
      });
      const waited = performance.now() - started;
      expect(await reading).toEqual([{ one: 1 }]);
      // It waited for the read to end, past the 1 s default, and was not refused.
      expect(waited).toBeGreaterThan(1_000);
      expect(await db.read((read) => read.query("SELECT k FROM m.t"))).toEqual([{ k: 3n }]);
    },
    TEST_TIMEOUT,
  );
});
