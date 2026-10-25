import { setTimeout as sleep } from "node:timers/promises";
import type { Database, Row } from "../../src/db/api.js";
import { type MigrationPart, startDatabase } from "../../src/db/migrate.js";
import { planSchemas, type SchemaModule, type SchemaPlan } from "../../src/db/roles.js";
import { openBlockWrites } from "../../src/db/write-handles.js";
import type { Settings } from "../db/backends.js";

/**
 * A141's long-work half (DB-15, owner decision Q71), as checks shared by the suite (`zero-timeouts.test.ts`, both
 * backends) and its negative control (`test/db/zero-timeouts.negative-control.test.ts`, a build without the zeros): the
 * writer, migrations, setup and the read handles given to callbacks run work the runner must finish, so with database
 * defaults of 1 s for every server-side timeout a 5 s migration, a block transaction left idle 5 s while a callback
 * awaits, and a callback's read running 5 s all complete, and `SHOW` in each reports 0. Each check does the work and
 * returns what it saw; it rejects when the work fails, which is what the negative control asserts.
 *
 * The five timeouts are DB-15's (`idle_session_timeout` by owner decision Q93): a server, database or role default
 * for it would end the writer's session between blocks, and the writer lock with it (DB-11).
 */

/** Every server-side timeout at 1 s: A141's hostile defaults. */
export const ONE_SECOND_TIMEOUTS: Settings = [
  ["statement_timeout", "1s"],
  ["lock_timeout", "1s"],
  ["idle_in_transaction_session_timeout", "1s"],
  ["transaction_timeout", "1s"],
  ["idle_session_timeout", "1s"],
];

export const TIMEOUT_NAMES: readonly string[] = ONE_SECOND_TIMEOUTS.map(([name]) => name);

/** Each timeout as `SHOW` prints it (`current_setting`), one column per name. */
export const SHOW_TIMEOUTS = `SELECT ${TIMEOUT_NAMES.map((name) => `current_setting('${name}') AS ${name}`).join(", ")}`;

/** What `SHOW` reports for each timeout when it is 0. */
export const ALL_ZERO: Readonly<Record<string, string>> = Object.fromEntries(TIMEOUT_NAMES.map((name) => [name, "0"]));

/** What `SHOW` reports for each timeout at A141's hostile defaults. */
export const ALL_ONE_SECOND: Readonly<Record<string, string>> = Object.fromEntries(ONE_SECOND_TIMEOUTS);

/** The work each check does: A141's 5 s. */
export const LONG_MS = 5_000;

/** A gap longer than the 1 s defaults, where a check also idles (setup, a callback's read, the writer between blocks). */
export const IDLE_GAP_MS = 2_000;

/**
 * One module, `m`, with the migrations the checks need: its table, the table each place writes what `SHOW` reported
 * there, and (`slowMigration`) a migration that runs 5 s and records its own settings at its end.
 */
function part(slowMigration: boolean, onStartDb?: MigrationPart["onStartDb"]): SchemaModule & MigrationPart {
  const migrations = [
    { id: "001", sql: "CREATE TABLE m.t (k bigint PRIMARY KEY)" },
    {
      id: "002",
      sql: `CREATE TABLE m.seen (place text PRIMARY KEY, ${TIMEOUT_NAMES.map((name) => `${name} text NOT NULL`).join(", ")})`,
    },
  ];
  if (slowMigration) {
    migrations.push({
      id: "003",
      sql: `SELECT pg_sleep(${LONG_MS / 1000}); INSERT INTO m.seen SELECT 'migration', s.* FROM (${SHOW_TIMEOUTS}) AS s;`,
    });
  }
  return {
    id: "m",
    version: "1.0.0",
    requires: [],
    provides: [{ name: "m-rows", table: { schema: "m", tables: ["t", "seen"] } }],
    migrations,
    ...(onStartDb === undefined ? {} : { onStartDb }),
  };
}

const RECORD_SEEN = `INSERT INTO m.seen SELECT $1::text, s.* FROM (${SHOW_TIMEOUTS}) AS s`;

/** The module's schema plan and its migrations applied (quickly: no slow migration, no setup). */
export async function migrated(db: Database): Promise<SchemaPlan> {
  const parts = [part(false)];
  const plan = planSchemas(parts);
  await startDatabase(db, { plan, parts, committedVersions: new Map(), handles: { height: null } });
  return plan;
}

/** The settings one place recorded in `m.seen`, as `SHOW` printed them. */
export async function seenAt(db: Database, place: string): Promise<Record<string, unknown> | undefined> {
  const rows = await db.read((read) => read.query(`SELECT * FROM m.seen WHERE place = $1`, [place]));
  if (rows[0] === undefined) return undefined;
  const { place: _place, ...settings } = rows[0];
  return settings;
}

/** What one check saw: the settings `SHOW` reported where the work ran, and how long the work took. */
export interface Outcome {
  readonly settings: Readonly<Record<string, unknown>>;
  readonly ms: number;
}

/**
 * A 5 s migration (`SELECT pg_sleep(5)` in a migration of its own) and then the part's setup (`on-start-db`), which
 * idles 2 s in its transaction before it writes: both through the migration runner (`startDatabase`), on the writer.
 * Resolves with what each recorded.
 */
export async function slowMigrationAndSetup(
  db: Database,
): Promise<{ readonly migration: Outcome; readonly setup: Outcome }> {
  let setupMs = 0;
  const parts = [
    part(true, async (w) => {
      const started = performance.now();
      await sleep(IDLE_GAP_MS);
      await w.execute(RECORD_SEEN, ["setup"]);
      setupMs = performance.now() - started;
    }),
  ];
  const plan = planSchemas(parts);
  const started = performance.now();
  await startDatabase(db, { plan, parts, committedVersions: new Map(), handles: { height: null } });
  const ms = performance.now() - started;
  return {
    migration: { settings: (await seenAt(db, "migration")) ?? {}, ms },
    setup: { settings: (await seenAt(db, "setup")) ?? {}, ms: setupMs },
  };
}

/**
 * A block transaction left idle 5 s while `m`'s `on-db-write` awaits, through the real block write handle (DB-3), then
 * the callback writes a row: resolves once the block committed, with what the callback saw after its wait.
 */
export async function idleBlock(db: Database, plan: SchemaPlan, key: bigint): Promise<Outcome> {
  let settings: Row = {};
  const started = performance.now();
  await db.transaction(async (tx) => {
    await openBlockWrites(tx, plan, { height: null }).write("m", async (w) => {
      await sleep(LONG_MS);
      settings = (await w.query(SHOW_TIMEOUTS))[0] ?? {};
      await w.execute("INSERT INTO m.t VALUES ($1::bigint)", [key]);
    });
  });
  return { settings, ms: performance.now() - started };
}

/**
 * A callback's read running 5 s on the block write handle (`on-db-write` reads committed data plus the block's own
 * writes through it, DB-3): resolves once the block committed, with what the callback saw.
 */
export async function slowReadInBlock(db: Database, plan: SchemaPlan, key: bigint): Promise<Outcome> {
  let settings: Row = {};
  let ms = 0;
  await db.transaction(async (tx) => {
    await openBlockWrites(tx, plan, { height: null }).write("m", async (w) => {
      settings = (await w.query(SHOW_TIMEOUTS))[0] ?? {};
      const started = performance.now();
      await w.query(`SELECT pg_sleep(${LONG_MS / 1000})`);
      ms = performance.now() - started;
      await w.execute("INSERT INTO m.t VALUES ($1::bigint)", [key]);
    });
  });
  return { settings, ms };
}

/**
 * The read handle a callback outside the block transaction gets (`on-compute`, `on-after-db-write`, … — design §2: a
 * read of the database API without the read option, on PostgreSQL a pooled read connection): a statement running 5 s,
 * then 2 s idle in the read's transaction, then one more statement. Resolves with what it saw.
 */
export async function slowCallbackRead(db: Database): Promise<Outcome> {
  return db.read(async (read) => {
    const settings = (await read.query(SHOW_TIMEOUTS))[0] ?? {};
    const started = performance.now();
    await read.query(`SELECT pg_sleep(${LONG_MS / 1000})`);
    await sleep(IDLE_GAP_MS);
    await read.query("SELECT 1 AS one");
    return { settings, ms: performance.now() - started };
  });
}

/**
 * The writer idle 2 s between two transactions (`idle_session_timeout`, decision record Q93): resolves with the
 * backend process each transaction ran on (`pg_backend_pid()`) — the same one when the writer's session, and with it
 * the writer lock (DB-11), outlived the gap — and what the second one saw.
 */
export async function writerIdleBetweenBlocks(
  db: Database,
): Promise<{ readonly before: unknown; readonly after: unknown; readonly settings: Row }> {
  const pid = "SELECT pg_backend_pid() AS pid";
  const before = (await db.transaction((tx) => tx.query(pid)))[0]?.pid;
  await sleep(IDLE_GAP_MS);
  return db.transaction(async (tx) => ({
    before,
    after: (await tx.query(pid))[0]?.pid,
    settings: (await tx.query(SHOW_TIMEOUTS))[0] ?? {},
  }));
}
