import postgres from "postgres";
import type { Database, ReadHandle, Transaction } from "../../src/db/api.js";
import { UmbraError } from "../../src/db/errors.js";
import { runMultiStatement } from "../../src/db/multi-statement.js";
import { readView } from "../../src/db/read-view.js";
import { CLOSE, OPEN } from "../../src/db/read-view-sql.js";
import { STATEMENT_KEY_LENGTH, startTrace, stopTrace, traceEndBlock, type TraceSink } from "../../src/trace/trace.js";

/**
 * The read view's guarantees (`src/db/read-view.ts`), shared by `read-view.test.ts` (on PostgreSQL 18 and PGlite
 * 0.5.10) and its committed negative control (`read-view.negative-control.test.ts`); imports nothing of Vitest. Each
 * check runs its scenario on a database of its own and returns its problems, one text each: none when the guarantee
 * holds. A statement's outcome is written as `ok`, its SQLSTATE, `control-refused <command>`, or the code of another
 * error.
 *
 * Unless a check says otherwise, its views run inside one transaction that first inserts the row {@link BEFORE}; the
 * transaction then inserts {@link AFTER} and commits, and both rows must be stored.
 */

/** A role the checks switch to; it may read `t.rows` and `t.blocks` and insert into `t.rows`. */
export const ROLE = "umbradb_read_view_check";

/** The schema every check's database starts with. */
export const SCHEMA = `
  CREATE SCHEMA t;
  CREATE TABLE t.blocks (height bigint PRIMARY KEY);
  CREATE TABLE t.rows (height bigint PRIMARY KEY, label text NOT NULL);
  CREATE SEQUENCE t.seq;
  CREATE PROCEDURE t.commits() LANGUAGE plpgsql AS $$ BEGIN COMMIT; END $$;
  DO $$ BEGIN CREATE ROLE ${ROLE} NOLOGIN; EXCEPTION WHEN duplicate_object THEN NULL; END $$;
  GRANT USAGE ON SCHEMA t TO ${ROLE};
  GRANT SELECT, INSERT ON t.rows TO ${ROLE};
  GRANT SELECT ON t.blocks TO ${ROLE};
`;

/** The rows the outer transaction writes before its views and after them. */
export const BEFORE = 100_001;
export const AFTER = 100_002;

/** What every view reports as its height. */
const OPTIONS = { height: 7n } as const;

/** A statement that fails with a division by zero (`22012`) 0.2 s after it starts. */
const SLOW_FAILURE = "SELECT 1/(SELECT 0 FROM pg_sleep(0.2)) AS x";

/** A statement's or a call's outcome, as the problems name it. */
export function outcomeOf(error: unknown): string {
  if (error instanceof UmbraError) {
    if (error.details.reason === "control-refused") return `control-refused ${String(error.details.command)}`;
    return String(error.details.sqlstate ?? error.details.reason ?? error.code);
  }
  return `thrown: ${error instanceof Error ? error.message : String(error)}`;
}

/** `ok`, or how `run` failed. */
async function tried(run: () => Promise<unknown>): Promise<string> {
  try {
    await run();
    return "ok";
  } catch (error) {
    return outcomeOf(error);
  }
}

const shown = (value: unknown): string =>
  JSON.stringify(value, (_key, item: unknown) => (typeof item === "bigint" ? `${item}n` : item));

/** Adds a problem when `got` and `expected` differ (compared as JSON). */
function compare(problems: string[], name: string, got: unknown, expected: unknown): void {
  if (shown(got) !== shown(expected)) problems.push(`${name}: ${shown(got)}, not ${shown(expected)}`);
}

/** The heights stored in `t.rows`, in order. */
async function storedHeights(db: Database): Promise<number[]> {
  const rows = await db.read((read) => read.query("SELECT height::int AS height FROM t.rows ORDER BY height"));
  return rows.map((row) => row.height as number);
}

/**
 * Runs `body` in one transaction between the outer rows {@link BEFORE} and {@link AFTER}, commits, and returns the
 * body's problems, a failure of the transaction, and a difference in the heights stored (`stored`: those the body
 * writes, besides the two).
 */
async function inOuter(
  db: Database,
  body: (tx: Transaction, problems: string[]) => Promise<void>,
  stored: readonly number[] = [],
): Promise<string[]> {
  const problems: string[] = [];
  try {
    await db.transaction(async (tx) => {
      await tx.execute("INSERT INTO t.rows VALUES ($1, 'outer, before the views')", [BEFORE]);
      await body(tx, problems);
      await tx.execute("INSERT INTO t.rows VALUES ($1, 'outer, after the views')", [AFTER]);
    });
  } catch (error) {
    problems.push(`the transaction failed: ${outcomeOf(error)}`);
  }
  try {
    compare(problems, "rows stored", await storedHeights(db), [...stored, BEFORE, AFTER].sort((a, b) => a - b));
  } catch (error) {
    problems.push(`reading the rows stored failed: ${outcomeOf(error)}`);
  }
  return problems;
}

/** Deletes every row of `t.rows` as the login, so that a check can run {@link inOuter} again. */
async function emptied(db: Database, problems: string[]): Promise<void> {
  await db.transaction(async (tx) => {
    await tx.execute("RESET ROLE");
    await tx.execute("DELETE FROM t.rows");
  }).catch((error: unknown) => {
    problems.push(`emptying t.rows failed: ${outcomeOf(error)}`);
  });
}

/** One view on `tx`; its result, or how it failed as a problem (and undefined). */
async function view<T>(
  tx: Transaction,
  problems: string[],
  name: string,
  body: (read: ReadHandle) => Promise<T>,
): Promise<T | undefined> {
  try {
    return await readView(tx, OPTIONS, body);
  } catch (error) {
    problems.push(`${name}: the view failed: ${outcomeOf(error)}`);
    return undefined;
  }
}

/** The statements a view refuses because it is read-only, each with its SQLSTATE. */
export const WRITES_REFUSED: readonly (readonly [string, string])[] = [
  ["INSERT INTO t.rows VALUES (2, 'view')", "25006"],
  ["UPDATE t.rows SET label = 'changed'", "25006"],
  ["DELETE FROM t.rows", "25006"],
  ["SELECT height FROM t.rows FOR UPDATE", "25006"],
  ["WITH w AS (INSERT INTO t.rows VALUES (3, 'with') RETURNING height) SELECT * FROM w", "25006"],
  ["EXPLAIN ANALYZE INSERT INTO t.rows VALUES (4, 'explain')", "25006"],
  ["CREATE TABLE t.made (x int)", "25006"],
  ["CREATE TEMP TABLE scratch (x int)", "25006"],
  ["COMMENT ON TABLE t.rows IS 'changed'", "25006"],
  ["TRUNCATE t.rows", "25006"],
  ["SELECT nextval('t.seq')", "25006"],
  ["SELECT setval('t.seq', 50)", "25006"],
  ["SET TRANSACTION READ WRITE", "25001"],
  ["SET LOCAL transaction_read_only = off", "25001"],
  ["SELECT set_config('transaction_read_only', 'off', true)", "25001"],
];

/**
 * A view cannot write: it reads `transaction_read_only` as `on`, and each of {@link WRITES_REFUSED}, in a view of its
 * own, fails with its SQLSTATE. Afterwards the outer is read-write and nothing is changed.
 */
export async function cannotWriteProblems(db: Database): Promise<string[]> {
  return inOuter(db, async (tx, problems) => {
    const readOnly = await view(tx, problems, "transaction_read_only", async (read) => (await read.query("SHOW transaction_read_only"))[0]);
    compare(problems, "transaction_read_only inside", readOnly, { transaction_read_only: "on" });
    for (const [sql, sqlstate] of WRITES_REFUSED) {
      const outcome = await view(tx, problems, sql, (read) => tried(() => read.query(sql)));
      if (outcome !== undefined) compare(problems, sql, outcome, sqlstate);
    }
    const [after] = await tx.query(
      `SELECT current_setting('transaction_read_only') AS ro, (SELECT count(*)::int FROM t.rows) AS n,
              (SELECT label FROM t.rows WHERE height = ${BEFORE}) AS label, to_regclass('t.made') IS NOT NULL AS made,
              (SELECT is_called FROM t.seq) AS called, obj_description('t.rows'::regclass) AS comment`,
    );
    compare(problems, "the outer after the views", after, {
      ro: "off",
      n: 1,
      label: "outer, before the views",
      made: false,
      called: false,
      comment: null,
    });
  });
}

/**
 * A view sees the outer transaction's uncommitted rows, each view exactly those written before it: 100 views, each
 * after one more outer `INSERT`.
 */
export async function seesOuterRowsProblems(db: Database): Promise<string[]> {
  const heights = Array.from({ length: 100 }, (_, i) => 1_000 + i);
  return inOuter(
    db,
    async (tx, problems) => {
      for (const [i, height] of heights.entries()) {
        await tx.execute("INSERT INTO t.rows VALUES ($1, 'between views')", [height]);
        const seen = await view(tx, problems, `view ${i + 1}`, async (read) =>
          (await read.query("SELECT count(*)::int AS n, max(height)::int AS last FROM t.rows WHERE height < 2000"))[0],
        );
        compare(problems, `view ${i + 1}`, seen, { n: i + 1, last: height });
      }
    },
    heights,
  );
}

/** Seven ways a statement fails inside a view, each with its SQLSTATE. */
export const FAILURES: readonly (readonly [string, readonly unknown[], string])[] = [
  ["SELECT 1/0 AS x", [], "22012"],
  ["SELECT * FROM t.missing", [], "42P01"],
  ["SELEC 1", [], "42601"],
  ["SELECT 'x'::int AS x", [], "22P02"],
  ["SELECT $1::int AS x", ["abc"], "22P02"],
  ["INSERT INTO t.rows VALUES (2, 'view')", [], "25006"],
  ["SELECT count(*) FROM t.rows; SELECT 2", [], "42601"],
];

/**
 * A failed statement does not abort the outer transaction: in a view of its own, each of {@link FAILURES} reaches the
 * body as its own error, the view's next statement fails `25P02`, the view resolves, and the outer reads and writes
 * after it.
 */
export async function failedStatementProblems(db: Database): Promise<string[]> {
  return inOuter(db, async (tx, problems) => {
    for (const [sql, params, sqlstate] of FAILURES) {
      const outcomes = await view(tx, problems, sql, async (read) => [
        await tried(() => read.query(sql, [...params])),
        await tried(() => read.query("SELECT count(*) AS n FROM t.rows")),
      ]);
      if (outcomes !== undefined) compare(problems, sql, outcomes, [sqlstate, "25P02"]);
      const outer = await tried(() => tx.query("SELECT count(*) AS n FROM t.rows"));
      compare(problems, `the outer after ${sql}`, outer, "ok");
    }
  });
}

/**
 * Three statements sent without waiting behind a statement that fails 0.2 s after it starts each fail `25P02` and are
 * not sent again; the outer reads its row after the view.
 */
export async function behindAFailureProblems(db: Database): Promise<string[]> {
  return inOuter(db, async (tx, problems) => {
    const outcomes = await view(tx, problems, "behind a failure", (read) =>
      Promise.all([
        tried(() => read.query(SLOW_FAILURE)),
        tried(() => read.query("SELECT label FROM t.rows WHERE height = $1", [BEFORE])),
        tried(() => read.query("SELECT count(*) AS n FROM t.rows")),
        tried(() => read.query("SELECT 1 AS one")),
      ]),
    );
    if (outcomes !== undefined) compare(problems, "the four statements", outcomes, ["22012", "25P02", "25P02", "25P02"]);
    const [row] = await tx.query("SELECT label FROM t.rows WHERE height = $1", [BEFORE]).catch(() => []);
    compare(problems, "the outer's row after the view", row, { label: "outer, before the views" });
  });
}

/** Settings and roles a view's statement changes; each must be undone by the view's close. */
export const SETTING_CHANGES: readonly string[] = [
  "SET TimeZone = 'Asia/Tokyo'",
  "SET LOCAL TimeZone = 'Asia/Tokyo'",
  "SET SESSION TimeZone = 'Asia/Tokyo'",
  "SELECT set_config('TimeZone', 'Asia/Tokyo', false)",
  "SELECT set_config('TimeZone', 'Asia/Tokyo', true)",
  "SET bytea_output = escape",
  "SELECT set_config('bytea_output', 'escape', true)",
  "SET search_path = pg_catalog",
  "SET LOCAL work_mem = '8MB'",
  "SELECT set_config('umbradb.view_check', 'in the view', false)",
  "SELECT set_config('umbradb.view_check', 'in the view', true)",
  `SET ROLE ${ROLE}`,
  `SET LOCAL ROLE ${ROLE}`,
  `SELECT set_config('role', '${ROLE}', false)`,
];

/** What the settings check reads. A custom setting first made in a view reads `''` after it: read as unset. */
const SETTINGS_PROBE = `SELECT current_setting('TimeZone') AS zone, current_setting('bytea_output') AS bytea_output,
    current_setting('search_path') AS path, current_setting('work_mem') AS work_mem,
    coalesce(current_setting('umbradb.view_check', true), '') AS custom, current_user::text AS who,
    '\\x01ff'::bytea::text AS bytes`;

/**
 * A view cannot change the session for later statements: each of {@link SETTING_CHANGES}, in a view of its own, takes
 * effect inside it and is undone in the outer, in the next transaction and in the next read. Then the outer's own
 * `SET LOCAL ROLE`, local setting and local time zone: inside a view the role is the login and the time zone the
 * session's; after a view that sets the same setting and time zone, the outer's are back.
 */
export async function settingsProblems(db: Database): Promise<string[]> {
  const problems = await inOuter(db, async (tx, problems) => {
    const [before] = await tx.query(SETTINGS_PROBE);
    for (const change of SETTING_CHANGES) {
      const inside = await view(tx, problems, change, async (read) => {
        await read.query(change);
        return (await read.query(SETTINGS_PROBE))[0];
      });
      if (inside !== undefined && shown(inside) === shown(before)) problems.push(`${change}: changed nothing inside the view`);
      compare(problems, `the outer after ${change}`, (await tx.query(SETTINGS_PROBE))[0], before);
    }
  });
  try {
    const [baseline] = await db.read((read) => read.query(SETTINGS_PROBE));
    compare(problems, "the next transaction", (await db.transaction((tx) => tx.query(SETTINGS_PROBE)))[0], baseline);
    compare(problems, "the next read", (await db.read((read) => read.query(SETTINGS_PROBE)))[0], baseline);
  } catch (error) {
    problems.push(`after the views: ${outcomeOf(error)}`);
  }
  const own = "SELECT current_user::text AS who, current_setting('umbradb.capture_height', true) AS capture, current_setting('TimeZone') AS zone";
  await emptied(db, problems);
  problems.push(
    ...(await inOuter(db, async (tx, problems) => {
      const [{ login }] = (await tx.query("SELECT session_user::text AS login")) as [{ login: string }];
      await tx.execute(`SET LOCAL ROLE ${ROLE}`);
      await tx.query("SELECT set_config('umbradb.capture_height', '7:h10', true)");
      await tx.execute("SET LOCAL TimeZone = 'Asia/Tokyo'");
      const [before] = await tx.query(own);
      compare(problems, "the outer's own role and settings", before, { who: ROLE, capture: "7:h10", zone: "Asia/Tokyo" });
      const inside = await view(tx, problems, "a view that sets the outer's setting", async (read) => {
        const [seen] = await read.query("SELECT current_user::text AS who, current_setting('TimeZone') AS zone");
        await read.query("SELECT set_config('umbradb.capture_height', 'set in the view', true)");
        await read.query("SET LOCAL TimeZone = 'Europe/Paris'");
        return seen;
      });
      compare(problems, "inside a view: the login and the session's time zone", inside, { who: login, zone: "UTC" });
      compare(problems, "the outer's own role and settings after a view", (await tx.query(own))[0], before);
    })),
  );
  return problems;
}

/** Statements a view refuses before sending them, each with the command it names. */
export const CONTROL_REFUSED: readonly (readonly [string, string])[] = [
  ["COMMIT", "COMMIT"],
  ["END", "END"],
  ["ROLLBACK", "ROLLBACK"],
  ["ABORT", "ABORT"],
  ["COMMIT AND CHAIN", "COMMIT"],
  ["ROLLBACK AND CHAIN", "ROLLBACK"],
  ["BEGIN", "BEGIN"],
  ["START TRANSACTION", "START"],
  ["SAVEPOINT w", "SAVEPOINT"],
  ["SAVEPOINT umbradb_read_view", "SAVEPOINT"],
  ["RELEASE SAVEPOINT umbradb_read_view", "RELEASE"],
  ["ROLLBACK TO SAVEPOINT umbradb_read_view", "ROLLBACK"],
  ["PREPARE TRANSACTION 'read_view_check'", "PREPARE TRANSACTION"],
  ["COMMIT PREPARED 'read_view_check'", "COMMIT"],
  ["ROLLBACK PREPARED 'read_view_check'", "ROLLBACK"],
  ["/* a comment */ -- another\n  commit", "COMMIT"],
  ["SET SESSION AUTHORIZATION DEFAULT", "SET SESSION AUTHORIZATION"],
  ["SET LOCAL session_authorization TO DEFAULT", "SET SESSION AUTHORIZATION"],
];

/** Statements the check lets through and the server refuses inside a view, each with its SQLSTATE. */
export const SERVER_REFUSED: readonly (readonly [string, string])[] = [
  ["DO $$ BEGIN COMMIT; END $$", "2D000"],
  ["DO $$ BEGIN ROLLBACK; END $$", "2D000"],
  ["CALL t.commits()", "2D000"],
  ["SELECT 1 AS one; COMMIT", "42601"],
];

/**
 * A view cannot end or leave the outer transaction: each of {@link CONTROL_REFUSED}, in a view of its own, is refused
 * with `control-refused` and its command before it is sent, so the view's next statement is answered; each of
 * {@link SERVER_REFUSED} fails with its SQLSTATE. The outer reads its one row after every view.
 */
export async function controlProblems(db: Database): Promise<string[]> {
  return inOuter(db, async (tx, problems) => {
    for (const [sql, command] of CONTROL_REFUSED) {
      const outcomes = await view(tx, problems, sql, async (read) => [
        await tried(() => read.query(sql)),
        await tried(() => read.query("SELECT 1 AS one")),
      ]);
      if (outcomes !== undefined) compare(problems, sql, outcomes, [`control-refused ${command}`, "ok"]);
    }
    for (const [sql, sqlstate] of SERVER_REFUSED) {
      const outcome = await view(tx, problems, sql, (read) => tried(() => read.query(sql)));
      if (outcome !== undefined) compare(problems, sql, outcome, sqlstate);
    }
    const counted = await tx.query("SELECT count(*)::int AS n FROM t.rows").catch((error: unknown) => outcomeOf(error));
    compare(problems, "the outer after the views", counted, [{ n: 1 }]);
  });
}

/**
 * Cursors and prepared statements: the outer's cursor moved inside a view keeps its position; one declared
 * inside is gone after it (`34000`); a driver-prepared or SQL-prepared write is refused inside and usable after; a
 * statement prepared by name inside outlives the view.
 */
export async function cursorsAndPreparedProblems(db: Database): Promise<string[]> {
  const insert = "INSERT INTO t.rows VALUES ($1, $2)";
  const count = "SELECT count(*)::int AS n FROM t.rows WHERE height < $1";
  return inOuter(
    db,
    async (tx, problems) => {
      for (let height = 1; height <= 5; height++) await tx.execute(insert, [height, `row ${height}`]);
      await tx.execute("PREPARE read_view_insert (bigint, text) AS INSERT INTO t.rows VALUES ($1, $2)");
      await tx.execute("PREPARE read_view_count AS SELECT count(*)::int AS n FROM t.rows WHERE height < 100");
      await tx.execute("EXECUTE read_view_insert (6, 'row 6')");
      await tx.execute("DECLARE read_view_cursor CURSOR FOR SELECT height::int AS height FROM t.rows ORDER BY height");
      compare(problems, "the outer's first fetch", await tx.query("FETCH 1 FROM read_view_cursor"), [{ height: 1 }]);
      const inside = await view(tx, problems, "the first view", async (read) => ({
        fetch: await read.query("FETCH 1 FROM read_view_cursor"),
        driverCount: (await read.query(count, [100]))[0]?.n,
        executeCount: (await read.query("EXECUTE read_view_count"))[0]?.n,
        declared: await tried(() => read.query("DECLARE read_view_inner CURSOR FOR SELECT 1 AS one")),
        innerFetch: await read.query("FETCH 1 FROM read_view_inner"),
        prepared: await tried(() => read.query("PREPARE read_view_inside AS SELECT 7 AS n")),
        driverInsert: await tried(() => read.query(insert, [7, "view"])),
      }));
      compare(problems, "inside the first view", inside, {
        fetch: [{ height: 2 }],
        driverCount: 6,
        executeCount: 6,
        declared: "ok",
        innerFetch: [{ one: 1 }],
        prepared: "ok",
        driverInsert: "25006",
      });
      const executeInsert = await view(tx, problems, "the second view", (read) =>
        tried(() => read.query("EXECUTE read_view_insert (8, 'view')")),
      );
      compare(problems, "EXECUTE of a prepared write inside a view", executeInsert, "25006");
      compare(problems, "the outer's fetch after the views", await tx.query("FETCH 1 FROM read_view_cursor"), [{ height: 3 }]);
      await tx.execute("SAVEPOINT probe");
      compare(problems, "the cursor declared inside, after the view", await tried(() => tx.query("FETCH 1 FROM read_view_inner")), "34000");
      await tx.execute("ROLLBACK TO SAVEPOINT probe");
      await tx.execute("RELEASE SAVEPOINT probe");
      compare(problems, "the statement prepared inside, after the view", await tx.query("EXECUTE read_view_inside"), [{ n: 7 }]);
      compare(problems, "the driver-prepared write after the views", await tried(() => tx.execute(insert, [9, "after"])), "ok");
      compare(problems, "EXECUTE of the prepared write after the views", await tried(() => tx.execute("EXECUTE read_view_insert (10, 'after')")), "ok");
      compare(problems, "the outer's last fetch", await tx.query("FETCH 1 FROM read_view_cursor"), [{ height: 4 }]);
      await tx.execute("CLOSE read_view_cursor");
      for (const name of ["read_view_insert", "read_view_count", "read_view_inside"]) await tx.execute(`DEALLOCATE ${name}`);
    },
    [1, 2, 3, 4, 5, 6, 9, 10],
  );
}

/**
 * A view takes no transaction id and leaves the locks as they were, and `now()` is the outer's: 1,000 views, each
 * reading `pg_current_xact_id_if_assigned()` and `now()`, in a transaction that has written nothing; it writes its two
 * rows afterwards.
 */
export async function noTransactionIdProblems(db: Database): Promise<string[]> {
  const problems: string[] = [];
  const state =
    "SELECT pg_current_xact_id_if_assigned()::text AS xid, now()::text AS now, " +
    "(SELECT count(*)::int FROM pg_locks WHERE pid = pg_backend_pid()) AS locks";
  try {
    await db.transaction(async (tx) => {
      const [before] = await tx.query(state);
      compare(problems, "the transaction id before the views", before?.xid, null);
      const seen = new Set<string>();
      for (let i = 0; i < 1_000; i++) {
        const [inside] = (await readView(tx, OPTIONS, (read) =>
          read.query("SELECT pg_current_xact_id_if_assigned()::text AS xid, now()::text AS now"),
        )) as [{ xid: unknown; now: unknown }];
        seen.add(shown(inside));
      }
      compare(problems, "inside the views", [...seen], [shown({ xid: null, now: before?.now })]);
      compare(problems, "the transaction id, the clock and the locks after the views", (await tx.query(state))[0], before);
      await tx.execute("INSERT INTO t.rows VALUES ($1, 'outer, after the views'), ($2, 'outer, after the views')", [BEFORE, AFTER]);
    });
  } catch (error) {
    problems.push(`the transaction failed: ${outcomeOf(error)}`);
  }
  compare(problems, "rows stored", await storedHeights(db), [BEFORE, AFTER]);
  return problems;
}

/**
 * The view's own edges: a view asked for while one is open on the same transaction throws a programming error before
 * anything is sent, and the open view goes on; a handle reports the height it was given and, used after its body
 * settled, fails with `handle-closed` (`handle: "read"`) and sends nothing; a view that sends no statement resolves; a
 * view of an object no backend opened throws before its body runs.
 */
export async function edgeProblems(db: Database): Promise<string[]> {
  return inOuter(db, async (tx, problems) => {
    let nestedRan = false;
    const nested = await view(tx, problems, "the outer view", async (read) => {
      const refused = await readView(tx, OPTIONS, async () => {
        nestedRan = true;
      }).then(
        () => "resolved",
        (error: unknown) => (error instanceof UmbraError ? outcomeOf(error) : `Error: ${(error as Error).message}`),
      );
      const [row] = await read.query("SELECT count(*)::int AS n FROM t.rows");
      return { refused, n: row?.n, height: read.height };
    });
    if (nested === undefined || !/^Error: readView: .*open/.test(nested.refused)) {
      problems.push(`a nested view: ${shown(nested?.refused)}, not a programming error naming the open view`);
    }
    compare(problems, "the outer view after the nested one was refused", { n: nested?.n, height: nested?.height, nestedRan }, {
      n: 1,
      height: 7n,
      nestedRan: false,
    });
    compare(problems, "a view after the first closed", await view(tx, problems, "again", async (read) => (await read.query("SELECT 1 AS one"))[0]), { one: 1 });

    let kept: ReadHandle | undefined;
    await view(tx, problems, "a view whose handle is kept", async (read) => {
      kept = read;
      await read.query("SELECT 1 AS one");
    });
    const late = await kept?.query("SELECT 1 AS one").then(
      () => "resolved",
      (error: unknown) => (error instanceof UmbraError ? shown([error.code, error.details]) : outcomeOf(error)),
    );
    compare(problems, "a handle used after its view", late, shown(["handle-closed", { handle: "read" }]));
    compare(problems, "the kept handle's height", kept?.height, 7n);

    let emptyKept: ReadHandle | undefined;
    compare(problems, "a view that sends nothing", await view(tx, problems, "empty", async (read) => {
      emptyKept = read;
      return "nothing sent";
    }), "nothing sent");
    compare(problems, "its handle used after it", await tried(async () => emptyKept?.query("SELECT 1")), "handle-closed");

    // An object shaped as a transaction, which no backend opened, forwarding to the real one.
    const lookalike: Transaction = { query: (sql, params) => tx.query(sql, params), execute: (sql, params) => tx.execute(sql, params) };
    let lookalikeRan = false;
    const refused = await tried(() =>
      readView(lookalike, OPTIONS, async () => {
        lookalikeRan = true;
      }),
    );
    compare(problems, "a view of a transaction no backend opened", [refused, lookalikeRan], [
      "thrown: readView: the handle is not a transaction the database API opened",
      false,
    ]);
  });
}

/**
 * The outer transaction already aborted: a view that sends nothing resolves; a view's first statement fails with the
 * open's error (`25P02`), the close is not sent, and the transaction is reported as rolled back
 * (`commit-rolled-back`), with nothing stored.
 */
export async function abortedOuterProblems(db: Database): Promise<string[]> {
  const problems: string[] = [];
  const outcome = await tried(() =>
    db.transaction(async (tx) => {
      await tx.execute("INSERT INTO t.rows VALUES ($1, 'outer')", [BEFORE]);
      compare(problems, "the failing outer statement", await tried(() => tx.query("SELECT 1/0 AS x")), "22012");
      compare(problems, "an empty view", await tried(() => readView(tx, OPTIONS, async () => "nothing sent")), "ok");
      compare(problems, "a view's first statement", await tried(() => readView(tx, OPTIONS, (read) => read.query("SELECT 1 AS one"))), "25P02");
      const caught = await tried(() =>
        readView(tx, OPTIONS, async (read) => {
          const first = await tried(() => read.query("SELECT 1 AS one"));
          const second = await tried(() => read.query("SELECT 2 AS two"));
          compare(problems, "a view's statements when its first failed", [first, second], ["25P02", "25P02"]);
        }),
      );
      compare(problems, "a view whose body caught its first statement's error", caught, "ok");
    }),
  );
  compare(problems, "the transaction", outcome, "commit-rolled-back");
  compare(problems, "rows stored", await storedHeights(db), []);
  return problems;
}

/**
 * `LISTEN` in a view is undone by its close: after the outer commits, its session listens to no channel. The control:
 * the same `LISTEN` sent by a transaction itself is in effect after its commit.
 */
export async function listenProblems(db: Database): Promise<string[]> {
  const channels = "SELECT count(*)::int AS n FROM pg_listening_channels()";
  const problems = await inOuter(db, async (tx, problems) => {
    const sent = await view(tx, problems, "LISTEN", (read) => tried(() => read.query("LISTEN read_view_channel")));
    compare(problems, "LISTEN in the view", sent, "ok");
  });
  try {
    compare(problems, "listening after the view's transaction", (await db.transaction((tx) => tx.query(channels)))[0], { n: 0 });
    await db.transaction((tx) => tx.execute("LISTEN read_view_channel"));
    compare(problems, "listening after a transaction's own LISTEN", (await db.transaction((tx) => tx.query(channels)))[0], { n: 1 });
    await db.transaction((tx) => tx.execute("UNLISTEN *"));
  } catch (error) {
    problems.push(`the transactions after the view failed: ${outcomeOf(error)}`);
  }
  return problems;
}

/**
 * PostgreSQL: a `NOTIFY` sent in a view is not delivered to a listener on another connection after the commit, while
 * the outer's own `NOTIFY` is (the control that the listener hears).
 */
export async function notifyProblems(db: Database, url: string): Promise<string[]> {
  const listener = postgres(url, { max: 1, onnotice: () => undefined });
  const heard: string[] = [];
  try {
    await listener.listen("read_view_notify", (payload) => heard.push(payload));
    const problems = await inOuter(db, async (tx, problems) => {
      const sent = await view(tx, problems, "NOTIFY", (read) => tried(() => read.query("NOTIFY read_view_notify, 'from the view'")));
      compare(problems, "NOTIFY in the view", sent, "ok");
      await tx.execute("NOTIFY read_view_notify, 'from the outer'");
    });
    const deadline = Date.now() + 10_000;
    while (!heard.includes("from the outer") && Date.now() < deadline) await new Promise((resolve) => setTimeout(resolve, 20));
    await new Promise((resolve) => setTimeout(resolve, 300));
    compare(problems, "notifications heard after the commit", heard, ["from the outer"]);
    return problems;
  } finally {
    await listener.end({ timeout: 5 });
  }
}

/** The key the block trace's statement totals give a text (`src/trace/trace.ts`). */
const traceKey = (text: string): string => text.replace(/\s+/g, " ").slice(0, STATEMENT_KEY_LENGTH);

/**
 * PostgreSQL: the block trace counts a view's open and close once each under their texts, and in the height's `sqlN`:
 * three views of one statement each, in a transaction of two inserts, are 13 statements with its `BEGIN` and
 * `COMMIT`.
 */
export async function traceProblems(db: Database): Promise<string[]> {
  const problems: string[] = [];
  // The writer's session opened (its lock and probe) before the trace starts.
  await db.transaction((tx) => tx.query("SELECT 1 AS one"));
  const kept = { blocks: [] as string[], statements: [] as string[] };
  const sink: TraceSink = {
    blocks: (text) => kept.blocks.push(text),
    statements: (json) => kept.statements.push(json),
    worker: () => undefined,
  };
  startTrace(sink);
  try {
    await db.transaction(async (tx) => {
      await tx.execute("INSERT INTO t.rows VALUES ($1, 'outer, before the views')", [BEFORE]);
      for (let i = 0; i < 3; i++) await readView(tx, OPTIONS, (read) => read.query("SELECT count(*) AS n FROM t.rows"));
      await tx.execute("INSERT INTO t.rows VALUES ($1, 'outer, after the views')", [AFTER]);
    });
    traceEndBlock(1n);
  } catch (error) {
    problems.push(`the traced transaction failed: ${outcomeOf(error)}`);
  } finally {
    stopTrace();
  }
  const totals = JSON.parse(kept.statements.at(-1) ?? "[]") as { q: string; n: number }[];
  const counted = (text: string) => totals.find((entry) => entry.q === traceKey(text))?.n ?? 0;
  compare(problems, "the statement totals of the open, the close and the view's statement", [counted(OPEN), counted(CLOSE), counted("SELECT count(*) AS n FROM t.rows")], [3, 3, 3]);
  const [line] = kept.blocks.join("").trimEnd().split("\n").map((text) => JSON.parse(text) as { sqlN?: number });
  compare(problems, "the height's sqlN", line?.sqlN, 13);
  compare(problems, "rows stored", await storedHeights(db), [BEFORE, AFTER]);
  return problems;
}

/** The text whose executions the prepared-statements check counts. */
const READ_ROW = "SELECT * FROM t.rows WHERE height = $1";

/** The executions of {@link READ_ROW} prepared on the session `handle` runs on (0 when it is not prepared there). */
async function runsOf(handle: { query(sql: string): Promise<Record<string, unknown>[]> }): Promise<number> {
  const rows = await handle.query("SELECT statement, (generic_plans + custom_plans)::int AS runs FROM pg_prepared_statements");
  return (rows.find((row) => row.statement === READ_ROW)?.runs as number | undefined) ?? 0;
}

/**
 * PostgreSQL: a view leaves the session's prepared texts prepared. {@link READ_ROW}'s executions keep rising across
 * views on the writer, and on the read pool's session after the writer's views. With `viaMultiStatement`, the same
 * open and close texts are sent through the migrations' path instead, which counts a schema change at each call: the
 * control that the count would stop.
 */
export async function preparedTextProblems(db: Database, viaMultiStatement = false): Promise<string[]> {
  const problems: string[] = [];
  const thrice = async (handle: { query(sql: string, params?: unknown[]): Promise<unknown> }) => {
    for (let i = 0; i < 3; i++) await handle.query(READ_ROW, [BEFORE]);
  };
  const counts: Record<string, number> = {};
  try {
    counts.readerBefore = await db.read(async (read) => {
      await thrice(read);
      return runsOf(read);
    });
    await db.transaction(async (tx) => {
      await tx.execute("INSERT INTO t.rows VALUES ($1, 'outer, before the views')", [BEFORE]);
      await thrice(tx);
      counts.writerBefore = await runsOf(tx);
      const viewOf = async (body: (read: { query(sql: string, params?: unknown[]): Promise<Record<string, unknown>[]> }) => Promise<void>) => {
        if (!viaMultiStatement) return readView(tx, OPTIONS, body);
        await runMultiStatement(tx, OPEN);
        await body(tx);
        await runMultiStatement(tx, CLOSE);
      };
      await viewOf(async (read) => {
        await read.query(READ_ROW, [BEFORE]);
        counts.writerInsideTheFirstView = await runsOf(read);
      });
      await thrice(tx);
      counts.writerAfterTheFirstView = await runsOf(tx);
      await viewOf(async (read) => {
        await read.query(READ_ROW, [BEFORE]);
      });
      await thrice(tx);
      counts.writerAfterTheSecondView = await runsOf(tx);
      await tx.execute("INSERT INTO t.rows VALUES ($1, 'outer, after the views')", [AFTER]);
    });
    counts.writerNextTransaction = await db.transaction(async (tx) => {
      await thrice(tx);
      return runsOf(tx);
    });
    counts.readerAfter = await db.read(async (read) => {
      await thrice(read);
      return runsOf(read);
    });
  } catch (error) {
    problems.push(`the prepared-text check failed: ${outcomeOf(error)}`);
  }
  compare(problems, "executions of the prepared text", counts, {
    readerBefore: 3,
    writerBefore: 3,
    writerInsideTheFirstView: 4,
    writerAfterTheFirstView: 7,
    writerAfterTheSecondView: 11,
    writerNextTransaction: 14,
    readerAfter: 6,
  });
  return problems;
}

/**
 * A session authorization cannot be set through a read handle or a view: each form is refused before it is sent, and
 * `current_user` and `session_user` are the login in the next read and the next transaction. On PGlite nothing would
 * undo it; the check needs a database of its own, since a form let through changes the engine's session for its life.
 */
export async function sessionAuthorizationProblems(db: Database): Promise<string[]> {
  const problems: string[] = [];
  const who = "SELECT current_user::text AS current_user, session_user::text AS session_user";
  const forms = [
    `SET SESSION AUTHORIZATION ${ROLE}`,
    `SET LOCAL SESSION AUTHORIZATION ${ROLE}`,
    `SET session_authorization = '${ROLE}'`,
    `SET LOCAL "session_authorization" TO '${ROLE}'`,
  ];
  const expected = forms.map(() => "control-refused SET SESSION AUTHORIZATION");
  try {
    const [before] = await db.read((read) => read.query(who));
    const throughRead = await db.read(async (read) => {
      const outcomes: string[] = [];
      for (const sql of forms) outcomes.push(await tried(() => read.query(sql)));
      return outcomes;
    });
    compare(problems, "through a read handle", throughRead, expected);
    compare(problems, "the next read after the read", (await db.read((read) => read.query(who)))[0], before);
    problems.push(
      ...(await inOuter(db, async (tx, problems) => {
        const throughView = await view(tx, problems, "through a view", async (read) => {
          const outcomes: string[] = [];
          for (const sql of forms) outcomes.push(await tried(() => read.query(sql)));
          return outcomes;
        });
        compare(problems, "through a view", throughView, expected);
        compare(problems, "the outer after the view", (await tx.query(who))[0], before);
      })),
    );
    compare(problems, "the next read after the view", (await db.read((read) => read.query(who)))[0], before);
    compare(problems, "the next transaction after the view", (await db.transaction((tx) => tx.query(who)))[0], before);
  } catch (error) {
    problems.push(`the session-authorization check failed: ${outcomeOf(error)}`);
  }
  return problems;
}
