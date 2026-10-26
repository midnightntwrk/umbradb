import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { PGlite } from "@electric-sql/pglite";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import type { Database } from "../../src/db/api.js";
import { UmbraError } from "../../src/db/errors.js";
import { classifyPgliteError, openPglite, openPgliteOn, PGLITE_START_PARAMS } from "../../src/db/pglite.js";
import { PINNED_SETTINGS, SESSION_SETTINGS } from "../../src/deterministic-postgresql/index.js";
import { askedLater, settlesWithin, TEST_CURSOR, TEST_SCHEMA } from "./backends.js";
import { type PgliteTestDatabase, type PgliteTestServer, startPgliteServer } from "./pglite-server.js";

/**
 * The PGlite backend's own behaviour (task 2.2; DB-2, DB-4, DB-13, Q65, Q73), beyond what the backend-neutral suites
 * check on both backends: every read and every transaction is one job of one queue, run one at a time in the order
 * asked for; a call from inside a running job is refused (Q73) instead of waiting forever; closing lets nothing more
 * reach the engine; a failure of the engine itself is reported and stops all later work; and the engine must run with
 * the pinned session settings, which win over a hostile configuration.
 */

let server: PgliteTestServer;

beforeAll(async () => {
  server = await startPgliteServer();
}, 120_000);

afterAll(async () => {
  await server?.stop();
}, 60_000);

async function failure(run: () => Promise<unknown>): Promise<UmbraError> {
  try {
    await run();
  } catch (error) {
    if (error instanceof UmbraError) return error;
    throw error;
  }
  throw new Error("expected an UmbraError");
}

async function fresh(): Promise<{ database: PgliteTestDatabase; db: Database }> {
  const database = await server.createDatabase();
  await database.exec(TEST_SCHEMA);
  return { database, db: await database.open({ committedHeight: TEST_CURSOR }) };
}

const commitHeight = (db: Database, height: bigint) =>
  db.transaction(async (tx) => {
    await tx.execute("INSERT INTO t.blocks VALUES ($1)", [height]);
    await tx.execute("INSERT INTO t.rows VALUES ($1, $2)", [height, `row ${height}`]);
  });

const nextTurn = () => new Promise<void>((resolve) => setImmediate(resolve));

describe("DB-4 — every read and transaction is a job of one queue", () => {
  it("lets a transaction asked for during a read wait until the read ends; the read never sees it", async () => {
    const { db } = await fresh();
    await commitHeight(db, 1n);
    const commit = askedLater(() => commitHeight(db, 2n));
    const seen = await db.read(async (read) => {
      commit.gate();
      const before = await read.query("SELECT count(*) AS n FROM t.rows");
      // Many turns of the event loop and a timer: the transaction could have run by now if anything let it.
      for (let i = 0; i < 20; i++) await nextTurn();
      expect(await settlesWithin(commit.result, 30)).toBe(false);
      const after = await read.query("SELECT count(*) AS n FROM t.rows");
      return [read.height, before, after];
    });
    expect(seen).toEqual([1n, [{ n: 1n }], [{ n: 1n }]]);
    await commit.result;
    expect(await db.read(async (read) => read.height)).toBe(2n);
  });

  it("lets a read asked for during a transaction wait until its COMMIT, then see the committed rows", async () => {
    const { db } = await fresh();
    const read = askedLater(() =>
      db.read(async (handle) => [handle.height, await handle.query("SELECT label FROM t.rows ORDER BY height")]),
    );
    await db.transaction(async (tx) => {
      await tx.execute("INSERT INTO t.blocks VALUES (1)");
      read.gate();
      for (let i = 0; i < 20; i++) await nextTurn();
      expect(await settlesWithin(read.result, 30)).toBe(false);
      await tx.execute("INSERT INTO t.rows VALUES (1, 'committed')");
    });
    expect(await read.result).toEqual([1n, [{ label: "committed" }]]);
  });

  it("runs jobs one at a time, in the order they were asked for, reads and transactions alike", async () => {
    const { db } = await fresh();
    const log: string[] = [];
    const job = async (name: string, kind: "read" | "transaction") => {
      const body = async (handle: { query(sql: string): Promise<unknown> }) => {
        log.push(`${name} begins`);
        await handle.query("SELECT pg_sleep(0.005)");
        await nextTurn();
        await handle.query("SELECT 1");
        log.push(`${name} ends`);
      };
      return kind === "read" ? db.read(body) : db.transaction(body);
    };
    await Promise.all([
      job("r1", "read"),
      job("t1", "transaction"),
      job("r2", "read"),
      job("r3", "read"),
      job("t2", "transaction"),
      job("r4", "read"),
    ]);
    expect(log).toEqual(["r1", "t1", "r2", "r3", "t2", "r4"].flatMap((name) => [`${name} begins`, `${name} ends`]));
  });

  it("holds the queue while a body waits for something that is not the database", async () => {
    const { db } = await fresh();
    let release!: () => void;
    const elsewhere = new Promise<void>((resolve) => {
      release = resolve;
    });
    const holding = db.read(async (read) => {
      await elsewhere;
      return read.height;
    });
    const commit = commitHeight(db, 1n);
    expect(await settlesWithin(commit, 50)).toBe(false);
    release();
    expect(await holding).toBeNull();
    await commit;
    expect(await db.read(async (read) => read.height)).toBe(1n);
  });

  it("goes on after a job whose body failed, and after one whose statement failed", async () => {
    const { db } = await fresh();
    const own = new Error("own");
    await expect(db.read(async () => Promise.reject(own))).rejects.toBe(own);
    expect((await failure(() => db.transaction((tx) => tx.execute("INSERT INTO t.nope VALUES (1)")))).code).toBe(
      "database-error",
    );
    await commitHeight(db, 1n);
    expect(await db.read(async (read) => read.height)).toBe(1n);
  });
});

describe("Q73 — a call from inside a running job is refused, not left waiting for that job", () => {
  it("refuses db.read and db.transaction called inside a read's body", async () => {
    const { db } = await fresh();
    const errors = await db.read(async () => [
      await failure(() => db.read(async () => 1)),
      await failure(() => db.transaction(async () => 1)),
    ]);
    for (const [error, call] of [
      [errors[0], "read"],
      [errors[1], "transaction"],
    ] as const) {
      expect(error?.code).toBe("database-error");
      expect(error?.retryable).toBe(false);
      expect(error?.details).toEqual({ reason: "nested-call", call });
      expect(error?.message).toContain("inside a running read or transaction");
    }
  });

  it("refuses them inside a transaction's body, which can still commit", async () => {
    const { db } = await fresh();
    const refused = await db.transaction(async (tx) => {
      await tx.execute("INSERT INTO t.blocks VALUES (1)");
      const nested = [
        (await failure(() => db.read(async (read) => read.height))).details,
        (await failure(() => db.transaction(async () => undefined))).details,
      ];
      await tx.execute("INSERT INTO t.rows VALUES (1, 'after the refusals')");
      return nested;
    });
    expect(refused).toEqual([
      { reason: "nested-call", call: "read" },
      { reason: "nested-call", call: "transaction" },
    ]);
    expect(await db.read((read) => read.query("SELECT label FROM t.rows"))).toEqual([{ label: "after the refusals" }]);
  });

  it("refuses a call that would close a cycle through another database's job", async () => {
    const a = await fresh();
    const b = await fresh();
    // a's read waits for b's read, whose body asks for a read of a: that read could never start.
    const refused = await a.db.read(async () =>
      b.db.read(async () => (await failure(() => a.db.read(async (read) => read.height))).details),
    );
    expect(refused).toEqual({ reason: "nested-call", call: "read" });
    // Between two databases the call itself is no mistake: a's job may read b.
    expect(await a.db.read(async () => b.db.read(async (read) => read.height))).toBeNull();
  });

  it("accepts a call that code started inside a job makes after that job ended", async () => {
    const { db } = await fresh();
    let later!: Promise<bigint | null>;
    await db.transaction(async (tx) => {
      await tx.execute("INSERT INTO t.blocks VALUES (5)");
      later = new Promise((resolve, reject) => {
        setTimeout(() => {
          db.read(async (read) => read.height).then(resolve, reject);
        }, 20);
      });
    });
    expect(await later).toBe(5n);
  });
});

describe("closing", () => {
  it("refuses the jobs still waiting, and the running job's later statements, with handle-closed", async () => {
    const { database, db } = await fresh();
    const sent: string[] = [];
    let closing = false;
    const query = database.engine.query.bind(database.engine);
    database.engine.query = ((sql: string, ...rest: unknown[]) => {
      if (closing) sent.push(sql);
      return (query as (...args: unknown[]) => unknown)(sql, ...rest);
    }) as typeof database.engine.query;
    // A job held open by its body; a transaction and a read waiting behind it.
    let release!: () => void;
    const held = new Promise<void>((resolve) => {
      release = resolve;
    });
    const job = db.read(async (read) => {
      await held;
      return read.query("SELECT 1 AS one");
    });
    const queued = [db.transaction(async () => 1), db.read(async () => 2)].map((p) => p.catch((e: unknown) => e));
    await nextTurn();
    closing = true;
    const closed = db.close();
    release();
    const [jobError, ...queuedErrors] = await Promise.all([job.catch((e: unknown) => e), ...queued]);
    await closed;
    for (const error of [jobError, ...queuedErrors]) {
      expect(error).toBeInstanceOf(UmbraError);
      expect((error as UmbraError).code).toBe("handle-closed");
    }
    expect(sent).toEqual([]);
    expect(database.engine.closed).toBe(true);
    expect((await failure(() => db.read(async () => 1))).code).toBe("handle-closed");
    await db.close();
  });

  it("refuses the waiting jobs at once, while the running job still holds the queue, and closes the engine", async () => {
    const { database, db } = await fresh();
    let release!: () => void;
    const held = new Promise<void>((resolve) => {
      release = resolve;
    });
    const job = db.read(async () => held);
    const waiting = [db.transaction(async () => 1), db.read(async () => 2)].map((p) => p.catch((e: unknown) => e));
    await nextTurn();
    const closed = db.close();
    for (const refused of await Promise.all(waiting)) {
      expect(refused).toBeInstanceOf(UmbraError);
      expect((refused as UmbraError).code).toBe("handle-closed");
    }
    await closed;
    expect(database.engine.closed).toBe(true);
    release();
    await job;
  });

  it("waits for a statement already sent to the engine before closing it", async () => {
    const { database, db } = await fresh();
    const result = await db.read(async (read) => {
      const inFlight = read.query("SELECT pg_sleep(0.05), 'done' AS state");
      const closed = db.close();
      const rows = await inFlight;
      await closed;
      return rows;
    });
    expect(result).toEqual([{ pg_sleep: "", state: "done" }]);
    expect(database.engine.closed).toBe(true);
  });
});

describe("errors (DB-13): PGlite has no connection to lose", () => {
  it("reports a statement's error as database-error with the server's names and no row values, not retryable", async () => {
    const { db } = await fresh();
    await commitHeight(db, 1n);
    const error = await failure(() => commitHeight(db, 1n));
    expect(error.code).toBe("database-error");
    expect(error.retryable).toBe(false);
    expect(error.details).toEqual({ sqlstate: "23505", constraint: "blocks_pkey", table: "blocks", schema: "t" });
    expect(JSON.stringify(error.details)).not.toContain("(height)=(1)");
  });

  it("classifies by the error's shape: a server ERROR is database-error; anything else is the engine failing", () => {
    const server = Object.assign(new Error("duplicate"), { severity: "ERROR", code: "23505", table: "x", detail: "v" });
    expect(classifyPgliteError(server)).toMatchObject({ code: "database-error", details: { sqlstate: "23505", table: "x" } });
    for (const failed of [
      Object.assign(new Error("terminating"), { severity: "FATAL", code: "57P01" }),
      Object.assign(new Error("panic"), { severity: "PANIC", code: "XX000" }),
      new WebAssembly.RuntimeError("unreachable"),
      new TypeError("Cannot read properties of undefined"),
      "a string",
    ]) {
      const classified = classifyPgliteError(failed);
      expect(classified.code).toBe("database-error");
      expect(classified.retryable).toBe(false);
      expect(classified.details.reason).toBe("engine-failed");
    }
  });

  it("stops all later work after the engine fails, and still closes", async () => {
    const { database, db } = await fresh();
    await commitHeight(db, 1n);
    const query = database.engine.query.bind(database.engine);
    let fail = true;
    database.engine.query = ((...args: unknown[]) => {
      if (fail) {
        fail = false;
        return Promise.reject(new WebAssembly.RuntimeError("memory access out of bounds"));
      }
      return (query as (...a: unknown[]) => unknown)(...args);
    }) as typeof database.engine.query;
    const first = await failure(() => db.read(async (read) => read.query("SELECT 1")));
    expect(first.code).toBe("database-error");
    expect(first.retryable).toBe(false);
    expect(first.details.reason).toBe("engine-failed");
    expect(first.message).toContain("memory access out of bounds");
    for (const later of [() => db.read(async () => 1), () => db.transaction(async () => 1)]) {
      const error = await failure(later);
      expect(error.details).toEqual({ reason: "engine-failed" });
    }
    await db.close();
    expect(database.engine.closed).toBe(true);
  });

  it("counts the engine as failed when a ROLLBACK fails, since the session's state is then unknown", async () => {
    const { database, db } = await fresh();
    const query = database.engine.query.bind(database.engine);
    database.engine.query = ((sql: string, ...rest: unknown[]) => {
      if (sql === "ROLLBACK") {
        return Promise.reject(Object.assign(new Error("cannot roll back"), { severity: "ERROR", code: "XX000" }));
      }
      return (query as (...a: unknown[]) => unknown)(sql, ...rest);
    }) as typeof database.engine.query;
    // The read itself succeeds: its rows were read before the ROLLBACK.
    expect(await db.read((read) => read.query("SELECT 1 AS one"))).toEqual([{ one: 1 }]);
    const later = await failure(() => db.transaction(async () => 1));
    expect(later.details).toEqual({ reason: "engine-failed" });
    expect(later.message).toContain("ROLLBACK failed");
    database.engine.query = query;
    await db.close();
  });

  it("reports an engine closed outside the API as failed, and still closes", async () => {
    const { database, db } = await fresh();
    await database.engine.close();
    const error = await failure(() => db.read(async (read) => read.height));
    expect(error.code).toBe("database-error");
    expect(error.details).toEqual({ reason: "engine-failed" });
    expect(error.message).toContain("PGlite is closed");
    await db.close();
    expect((await failure(() => db.read(async () => 1))).code).toBe("handle-closed");
  });
});

describe("opening (DB-1, Q65)", () => {
  const settings = `SELECT current_setting('bytea_output') AS bytea_output, current_setting('DateStyle') AS date_style,
                           current_setting('IntervalStyle') AS interval_style, current_setting('TimeZone') AS time_zone,
                           current_setting('extra_float_digits') AS extra_float_digits`;
  const PINNED = {
    bytea_output: "hex",
    date_style: "ISO, MDY",
    interval_style: "postgres",
    time_zone: "UTC",
    extra_float_digits: "1",
  };
  const HOSTILE: readonly (readonly [string, string])[] = [
    ["bytea_output", "escape"],
    ["DateStyle", "German, DMY"],
    ["IntervalStyle", "iso_8601"],
    ["TimeZone", "Asia/Tokyo"],
    ["extra_float_digits", "0"],
  ];
  // Every data directory inside one temporary root, removed with it: the PGlite lock keeps its file beside the data
  // directory (`<directory>.lock.sqlite`, src/db/pglite-lock.ts), which removing the directory alone would leave in the
  // system's temporary folder (docs/issues/00021).
  let root: string | undefined;
  let made = 0;
  const directory = () => {
    root ??= mkdtempSync(join(tmpdir(), "umbradb-pglite-test-"));
    const dataDir = join(root, `db-${++made}`);
    mkdirSync(dataDir);
    return dataDir;
  };
  afterAll(() => {
    if (root !== undefined) rmSync(root, { recursive: true, force: true });
  });

  it("starts the engine with PGlite's own start parameters and the session settings: the five pinned, the zero timeouts", () => {
    expect(PGLITE_START_PARAMS.slice(0, PGlite.defaultStartParams.length)).toEqual(PGlite.defaultStartParams);
    expect(PGLITE_START_PARAMS.slice(PGlite.defaultStartParams.length)).toEqual(
      SESSION_SETTINGS.flatMap(([name, value]) => ["-c", `${name}=${value}`]),
    );
    expect(SESSION_SETTINGS.slice(0, PINNED_SETTINGS.length)).toEqual(PINNED_SETTINGS);
  });

  it("opens an in-memory database with the pinned settings, and closes it", async () => {
    const db = await openPglite({ dataDir: "memory://", committedHeight: async () => null, developmentOptIn: true });
    expect(await db.read((read) => read.query(settings))).toEqual([PINNED]);
    expect(await db.transaction((tx) => tx.query(settings))).toEqual([PINNED]);
    await db.close();
    expect((await failure(() => db.read(async () => 1))).code).toBe("handle-closed");
  }, 60_000);

  it("pins the five settings over a hostile configuration file, database and role defaults (non-vacuous: the control reads them)", async () => {
    const dataDir = directory();
    const plain = await PGlite.create(dataDir);
    for (const [name, value] of HOSTILE) await plain.exec(`ALTER SYSTEM SET ${name} = '${value}'`);
    await plain.exec("ALTER DATABASE postgres SET bytea_output = 'escape'");
    await plain.exec("ALTER ROLE postgres SET TimeZone = 'America/New_York'");
    await plain.close();
    // Control: a plain engine on the same directory runs with the hostile values.
    const control = await PGlite.create(dataDir);
    expect((await control.query(settings)).rows).toEqual([
      {
        bytea_output: "escape",
        date_style: "German, DMY",
        interval_style: "iso_8601",
        time_zone: "Asia/Tokyo",
        extra_float_digits: "0",
      },
    ]);
    await control.close();

    const db = await openPglite({ dataDir, committedHeight: async () => null, developmentOptIn: true });
    expect(await db.read((read) => read.query(settings))).toEqual([PINNED]);
    const [row] = await db.read((read) =>
      read.query("SELECT '\\x00ff'::bytea AS bytes, '1 day 2 hours'::interval AS iv, 0.1::float4 AS f"),
    );
    expect(row).toEqual({ bytes: new Uint8Array([0, 255]), iv: "1 day 02:00:00", f: 0.1 });
    await db.close();
  }, 60_000);

  it("keeps committed rows across closing and reopening a data directory", async () => {
    const dataDir = directory();
    const first = await openPglite({ dataDir, committedHeight: TEST_CURSOR, developmentOptIn: true });
    await first.transaction(async (tx) => {
      await tx.execute("CREATE SCHEMA t");
      await tx.execute("CREATE TABLE t.blocks (height bigint PRIMARY KEY)");
      await tx.execute("INSERT INTO t.blocks VALUES (7)");
    });
    await first.close();
    const second = await openPglite({ dataDir, committedHeight: TEST_CURSOR, developmentOptIn: true });
    expect(await second.read(async (read) => read.height)).toBe(7n);
    await second.close();
  }, 60_000);

  it("refuses an engine started without the pinned settings, naming the setting", async () => {
    const engine = await PGlite.create("memory://", {
      startParams: [...PGlite.defaultStartParams, "-c", "TimeZone=Asia/Tokyo"],
    });
    const error = await failure(() => openPgliteOn(engine, { committedHeight: async () => null }));
    expect(error.code).toBe("invalid-configuration");
    expect(error.details).toEqual({ parameter: "TimeZone" });
    expect(error.message).toContain("PGLITE_START_PARAMS");
    expect(engine.closed).toBe(false);
    await engine.close();
  }, 60_000);

  it("refuses an engine whose pinned values are only session settings, which RESET ALL would undo", async () => {
    const engine = await PGlite.create("memory://", {
      startParams: [...PGlite.defaultStartParams, "-c", "bytea_output=escape"],
    });
    for (const [name, value] of PINNED_SETTINGS) await engine.exec(`SET ${name} = '${value}'`);
    const error = await failure(() => openPgliteOn(engine, { committedHeight: async () => null }));
    expect(error.code).toBe("invalid-configuration");
    expect(error.details).toEqual({ parameter: "bytea_output" });
    await engine.close();
  }, 60_000);

  it("refuses an engine started without the zero timeouts, naming the first that differs (DB-15)", async () => {
    // `lock_timeout` above 0 is one PGlite does not hang on (task 2.7's probe), so the engine stays usable to close.
    const engine = await PGlite.create("memory://", {
      startParams: [
        ...PGlite.defaultStartParams,
        ...PINNED_SETTINGS.flatMap(([name, value]) => ["-c", `${name}=${value}`]),
        "-c",
        "lock_timeout=1000",
      ],
    });
    const error = await failure(() => openPgliteOn(engine, { committedHeight: async () => null }));
    expect(error.code).toBe("invalid-configuration");
    expect(error.details).toEqual({ parameter: "lock_timeout" });
    expect(error.message).toContain("zero timeouts");
    expect(engine.closed).toBe(false);
    await engine.close();
  }, 60_000);

  it("refuses an engine whose session changed a pinned setting after it started, naming the setting", async () => {
    const engine = await PGlite.create("memory://", { startParams: [...PGLITE_START_PARAMS] });
    await engine.exec("SET TimeZone = 'Asia/Tokyo'");
    const error = await failure(() => openPgliteOn(engine, { committedHeight: async () => null }));
    expect(error.code).toBe("invalid-configuration");
    expect(error.details).toEqual({ parameter: "TimeZone" });
    await engine.close();
  }, 60_000);

  it("reports an engine that cannot open as database-error, not retryable", async () => {
    const file = join(directory(), "not-a-directory");
    writeFileSync(file, "x");
    const error = await failure(() => openPglite({ dataDir: file, committedHeight: async () => null, developmentOptIn: true }));
    expect(error.code).toBe("database-error");
    expect(error.retryable).toBe(false);
    expect(error.details).toEqual({ reason: "open-failed" });
  }, 60_000);
});
