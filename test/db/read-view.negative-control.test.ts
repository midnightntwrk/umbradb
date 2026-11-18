import { afterAll, beforeAll, beforeEach, describe, expect, it, vi } from "vitest";
import { UmbraError } from "../../src/db/errors.js";
import { readView } from "../../src/db/read-view.js";
import type * as Sql from "../../src/db/read-view-sql.js";
import type * as Refusal from "../../src/db/statement-refusal.js";
import { BACKENDS, TEST_CURSOR } from "./backends.js";
import {
  behindAFailureProblems,
  cannotWriteProblems,
  CONTROL_REFUSED,
  controlProblems,
  failedStatementProblems,
  listenProblems,
  SCHEMA,
  sessionAuthorizationProblems,
  settingsProblems,
  WRITES_REFUSED,
} from "./read-view-checks.js";

/**
 * The read view's committed negative controls: three wrong builds, each of which must make its named checks of
 * `read-view-checks.ts` (run by `read-view.test.ts`) fail, on PostgreSQL 18 and PGlite 0.5.10.
 *
 * - **A, an open that is not read-only:** `OPEN` without `SET TRANSACTION READ ONLY`. The read-only check fails: every
 *   write in a view runs (and is undone by the close).
 * - **B, a close that only releases:** `CLOSE` as `RELEASE SAVEPOINT` alone. After a failed statement the release is
 *   refused, so the view fails with the close's error and the outer transaction is rolled back; a setting, a role or a
 *   `LISTEN` of a view stays.
 * - **C, a check that refuses nothing:** transaction control and a session authorization reach the server, each
 *   command in a transaction of its own.
 *
 * `vi.mock` replaces the texts of `src/db/read-view-sql.ts` and the check of `src/db/statement-refusal.ts` in this
 * file's module graph only; with `variant.current = "real"` both are the real ones, and every named check passes in
 * this build too.
 */

const variant = vi.hoisted(() => ({ current: "real" as "real" | "A" | "B" | "C" }));

vi.mock("../../src/db/read-view-sql.js", async (importOriginal) => {
  const actual = await importOriginal<typeof Sql>();
  return {
    get OPEN() {
      return variant.current === "A" ? "SAVEPOINT umbradb_read_view; RESET ALL; RESET ROLE" : actual.OPEN;
    },
    get CLOSE() {
      return variant.current === "B" ? "RELEASE SAVEPOINT umbradb_read_view" : actual.CLOSE;
    },
  };
});

vi.mock("../../src/db/statement-refusal.js", async (importOriginal) => {
  const actual = await importOriginal<typeof Refusal>();
  const controlStatement: typeof actual.controlStatement = (sql) => (variant.current === "C" ? null : actual.controlStatement(sql));
  return { ...actual, controlStatement };
});

beforeEach(() => {
  variant.current = "real";
});

describe.each(BACKENDS)("negative controls of the read view on $name", { timeout: 120_000 }, (backend) => {
  beforeAll(() => backend.start(), 180_000);
  afterAll(() => backend.stop(), 60_000);

  const fresh = async () => (await backend.database(SCHEMA, TEST_CURSOR)).db;

  it("passes the named checks in this file's build with the real texts and check", async () => {
    for (const check of [
      cannotWriteProblems,
      failedStatementProblems,
      behindAFailureProblems,
      settingsProblems,
      listenProblems,
      controlProblems,
      sessionAuthorizationProblems,
    ]) {
      expect(await check(await fresh()), check.name).toEqual([]);
    }
  });

  it("A: an open without SET TRANSACTION READ ONLY makes the read-only check fail", async () => {
    variant.current = "A";
    const problems = await cannotWriteProblems(await fresh());
    expect(problems).toContain('transaction_read_only inside: {"transaction_read_only":"off"}, not {"transaction_read_only":"on"}');
    for (const [sql, sqlstate] of WRITES_REFUSED.filter(([, state]) => state === "25006")) {
      expect(problems).toContain(`${sql}: "ok", not "${sqlstate}"`);
    }
  });

  it("B: a close that only releases makes the failure, settings and LISTEN checks fail", async () => {
    variant.current = "B";
    const failed = await failedStatementProblems(await fresh());
    expect(failed).toContainEqual(expect.stringMatching(/^SELECT 1\/0 AS x: the view failed: 25P02$/));
    expect(failed).toContainEqual(expect.stringMatching(/^the transaction failed: 25P02$/));
    expect(failed).toContainEqual(expect.stringMatching(/^rows stored: \[\], not \[100001,100002\]$/));
    const behind = await behindAFailureProblems(await fresh());
    expect(behind).toContainEqual(expect.stringMatching(/^behind a failure: the view failed: 25P02$/));
    expect(behind).toContainEqual(expect.stringMatching(/^rows stored: \[\], not/));
    const settings = await settingsProblems(await fresh());
    expect(settings).toContainEqual(expect.stringMatching(/^the outer after SET TimeZone = 'Asia\/Tokyo': .*"zone":"Asia\/Tokyo"/));
    expect(settings).toContainEqual(expect.stringMatching(/^the outer's own role and settings after a view: /));
    expect(await listenProblems(await fresh())).toContain("listening after the view's transaction: {\"n\":1}, not {\"n\":0}");
  });

  it("B, shown directly: the close's error wins over the body's result, and the transaction refuses every later statement and rolls back", async () => {
    variant.current = "B";
    const db = await fresh();
    let viewError: unknown;
    let later: unknown;
    const outcome = await db
      .transaction(async (tx) => {
        await tx.execute("INSERT INTO t.rows VALUES (1, 'outer')");
        viewError = await readView(tx, { height: null }, async (read) => {
          await read.query("SELECT 1/0 AS x").catch(() => undefined);
          return "the body's result";
        }).catch((error: unknown) => error);
        later = await tx.execute("INSERT INTO t.rows VALUES (2, 'outer')").catch((error: unknown) => error);
      })
      .then(
        () => "committed",
        (error: unknown) => error,
      );
    expect(viewError).toBeInstanceOf(UmbraError);
    expect((viewError as UmbraError).details.sqlstate).toBe("25P02");
    expect(later).toBe(viewError);
    expect(outcome).toBe(viewError);
    expect(await db.read((read) => read.query("SELECT count(*)::int AS n FROM t.rows"))).toEqual([{ n: 0 }]);
  });

  it("B, shown directly: the close's error wins over the body's own error too", async () => {
    variant.current = "B";
    const db = await fresh();
    const own = new Error("the body's own error");
    let viewError: unknown;
    const outcome = await db
      .transaction(async (tx) => {
        await tx.execute("INSERT INTO t.rows VALUES (1, 'outer')");
        viewError = await readView(tx, { height: null }, async (read) => {
          await read.query("SELECT 1/0 AS x").catch(() => undefined);
          throw own;
        }).catch((error: unknown) => error);
      })
      .then(
        () => "committed",
        (error: unknown) => error,
      );
    expect(viewError).toBeInstanceOf(UmbraError);
    expect(viewError).not.toBe(own);
    expect((viewError as UmbraError).details.sqlstate).toBe("25P02");
    expect(outcome).toBe(viewError);
    // The control in this build: with the real close, the same body's own error is what the view rejects with.
    variant.current = "real";
    const real = await fresh();
    const rejected = await real.transaction((tx) =>
      readView(tx, { height: null }, async (read) => {
        await read.query("SELECT 1/0 AS x").catch(() => undefined);
        throw own;
      }).catch((error: unknown) => error),
    );
    expect(rejected).toBe(own);
  });

  it("C: a check that refuses nothing makes the control and session-authorization checks fail", async () => {
    variant.current = "C";
    const control = await controlProblems(await fresh());
    // Every command, in its own transaction, was answered by the server (`ok` or an SQLSTATE), not by the check.
    for (const [sql] of CONTROL_REFUSED) {
      const outcomes = control.find((problem) => problem.startsWith(`${sql}: its two outcomes: [`));
      expect(outcomes, sql).toBeDefined();
      expect(outcomes, sql).not.toContain('its two outcomes: ["control-refused');
    }
    // What the commands that end the transaction did, each to its own transaction: the close failed, and the view with it.
    for (const sql of ["COMMIT", "END", "ROLLBACK", "ABORT", "; COMMIT"]) {
      expect(control, sql).toContain(`${sql}: its two outcomes: ["ok","ok"], not ["control-refused ${sql.replace("; ", "")}","ok"]`);
      expect(control, sql).toContain(`${sql}: its view: the view failed: 25P01`);
    }
    const authorization = await sessionAuthorizationProblems(await fresh());
    expect(authorization).toContainEqual(expect.stringMatching(/^through a read handle: \["ok"/));
    if (backend.singleQueue) {
      // PGlite: nothing undoes the session authorization the read set.
      expect(authorization).toContainEqual(
        expect.stringMatching(/^the next read after the read: \{"current_user":"umbradb_read_view_check","session_user":"umbradb_read_view_check"\}/),
      );
    }
  });
});
