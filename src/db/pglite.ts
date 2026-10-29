/**
 * The PGlite backend of the database API (`./api.ts`), over `@electric-sql/pglite` 0.5.10: PostgreSQL 18.6 compiled
 * to WebAssembly, run in this process, with one session. [DB-1, DB-2, DB-4, DB-13; design §4]
 *
 * **One queue.** Every read and every transaction is one *job* of one queue. Jobs run one at a time, in the order they
 * were asked for, and a job holds the session from its first statement to its last, also while its body awaits
 * something that is not the database. A block transaction is therefore one exclusive job: no read runs between its
 * `BEGIN` and its `COMMIT`, and a read asked for meanwhile waits until the `COMMIT`, then sees the block. [DB-4, A11]
 * - A **read**: `BEGIN ISOLATION LEVEL REPEATABLE READ READ ONLY`; then `RESET ALL` and `RESET ROLE`, so that a
 *   setting or role a transaction left on the one session does not reach the read (on PostgreSQL a read runs on a
 *   connection of its own and never sees one); then the committed height, read by the process's
 *   {@link CommittedHeight}; then the body's statements; then `ROLLBACK`, which also undoes the resets and any `SET`
 *   the body ran. Nothing commits while the job runs, so every statement sees the height the read reports. [DB-2]
 * - A **transaction**: `BEGIN`; the body's statements; then `COMMIT` when the body resolves, or `ROLLBACK` when the
 *   body rejects, with the body's own error. A `COMMIT` that PostgreSQL answers with `ROLLBACK` (a failed statement
 *   aborted the transaction and the body caught its error) is an error, never a commit. A migration's text of several
 *   statements runs in it through the engine's `exec`, by the path only the migration runner takes
 *   (`./multi-statement.ts`).
 *
 * A read handle or transaction used after its job ended fails with `handle-closed`, before anything reaches the engine.
 * A job's body runs in the async context of the code that asked for it, as on PostgreSQL.
 *
 * **Calls from inside a job.** A body that calls `read` or `transaction` on the same database, instead of using the
 * handle it was given, asks for a job that cannot start before its own job ends; awaited, it would wait forever. Such a
 * call, made while the calling code's own job (or a job of the same database further out) still runs, is rejected at
 * once with `database-error`, `reason: nested-call`; `AsyncLocalStorage` tells which job is running. Code a job started
 * that calls after the job's body has ended (a timer it set) is an ordinary caller. The owner chose to keep this guard.
 * [Q73]
 *
 * **Results and parameters** go through the `deterministic_postgresql` component's mapping, as on PostgreSQL. PGlite
 * hands over every value as the text PostgreSQL printed — every parser it has is replaced by the identity for each
 * statement, and a type it has no parser for arrives as text anyway — with the column's type OID; `rowMode: "array"`
 * keeps columns that share a name. Every parameter is sent as the text the mapping gives it, untyped, through
 * serializers that keep it unchanged (PGlite's own would rewrite `boolean`, `json` and `bytea` texts). The engine must
 * run with the component's {@link SESSION_SETTINGS} as start parameters ({@link PGLITE_START_PARAMS}): they win over
 * the data directory's `postgresql.conf` and `postgresql.auto.conf` (PGlite's initdb writes the host's time zone there)
 * and survive `RESET ALL`, while `ALTER DATABASE … SET` and `ALTER ROLE … SET` are not applied in PGlite's single-user
 * mode at all; {@link openPgliteOn} refuses an engine that does not run with them.
 *
 * **Timeouts.** PGlite enforces no server-side timeout, and one that fires hangs the engine, and so the whole process,
 * synchronously: a nonzero `idle_in_transaction_session_timeout`, `transaction_timeout` or `idle_session_timeout` once
 * its time passed (`electric-sql/pglite#1058`; checked on 0.5.10, 2026-10-25). The session settings' zero timeouts
 * keep a configuration file's from reaching the engine. A read with the read option (`timeoutMs`, a module API
 * request's) sets neither of the two a PostgreSQL read sets: PGlite is a development backend, and its API reads are
 * not bounded. The option is still checked as on PostgreSQL. [DB-15, Q71, DB-12, DB-1]
 *
 * **Errors.** PGlite runs in this process: there is no connection to lose, so no error of this backend is
 * `connection-lost`, the one retryable code. A statement the server refused (severity `ERROR`) is `database-error`
 * with the server's SQLSTATE and the names it gives, as on PostgreSQL (never its `detail`, which can hold row values,
 * nor the statement's parameters), or `truncate-not-allowed` for the `deterministic_postgresql` component's `TRUNCATE`
 * refusal. [DB-13, DB-14]
 *
 * Anything else (a `FATAL` or `PANIC`, a WebAssembly trap, an exception inside PGlite) means the engine itself failed:
 * `database-error` with `reason: engine-failed`, not retryable, since no retry on the same engine can succeed. Every
 * later read and transaction fails the same way, and only opening the data directory again (a process restart, after
 * the runner halts) recovers. [DB-13]
 *
 * **Closing.** Once closing starts, nothing more reaches the engine: the jobs still waiting and the running job's later
 * statements fail with `handle-closed`, and a transaction whose `COMMIT` was not yet sent is not committed (the engine
 * discards it when it closes). A statement already sent is waited for, then the engine is closed.
 *
 * **One writer, development only.** {@link openPglite} refuses without the development opt-in
 * (`development-opt-in-required`: PGlite runs without fsync). It then takes the data directory's operating-system lock
 * (`./pglite-lock.ts`; none for `memory://`) before PGlite opens it, so a second process fails with `writer-lock-held`
 * and never opens the directory; the lock is held for the process's life. {@link openPgliteOn}, the seam for an engine
 * already open, checks neither: whoever opened the engine did. [DB-11, DB-12]
 */

import { AsyncLocalStorage, AsyncResource } from "node:async_hooks";
import { PGlite, type QueryOptions, types } from "@electric-sql/pglite";
import { mapRows, parameterText, type Row, SESSION_SETTINGS } from "../deterministic-postgresql/index.js";
import type { CommittedHeight, Database, ReadHandle, ReadOptions, Transaction } from "./api.js";
import { commitRolledBack, handleClosed, statementRefused, UmbraError } from "./errors.js";
import { pgliteNeedsDevelopmentOptIn } from "./durability-probe.js";
import { allowMultiStatement } from "./multi-statement.js";
import { READS_BYPASS_QUEUE } from "./pglite-build-flags.js";
import { acquirePgliteLock } from "./pglite-lock.js";
import { readTimeoutMs } from "./read-options.js";
import { allowWriterStart } from "./writer-lock.js";

/**
 * The start parameters of every PGlite engine the database API uses: PGlite's own (`PGlite.defaultStartParams`, which
 * a `startParams` option replaces rather than extends), then `-c name=value` for each of {@link SESSION_SETTINGS}.
 */
export const PGLITE_START_PARAMS: readonly string[] = [
  ...PGlite.defaultStartParams,
  ...SESSION_SETTINGS.flatMap(([name, value]) => ["-c", `${name}=${value}`]),
];

/** Options of {@link openPglite}. */
export interface PgliteOptions {
  /** Where the database lives: a directory on a local file system, or `memory://` for one held in memory only. */
  readonly dataDir: string;
  /** How a read learns its committed height. [DB-2] */
  readonly committedHeight: CommittedHeight;
  /** The core entry's `developmentOptIn`: PGlite opens only under it. [CF-4, CF-9, DB-12] */
  readonly developmentOptIn: boolean;
}

/**
 * Opens the PGlite backend on the database at `options.dataDir`, creating it if the directory is empty: refuses without
 * the development opt-in (`development-opt-in-required`) before anything is opened or created; takes the directory's
 * writer lock (`writer-lock-held` when another process, or another opening in this one, holds it); then starts one
 * engine with {@link PGLITE_START_PARAMS}. A directory or engine that cannot open is `database-error` (`reason:
 * open-failed`), not retryable.
 */
export async function openPglite(options: PgliteOptions): Promise<Database> {
  if (options.developmentOptIn !== true) throw pgliteNeedsDevelopmentOptIn();
  const lock = await acquirePgliteLock(options.dataDir);
  const endUse = () => lock?.endUse();
  let engine: PGlite;
  try {
    engine = await PGlite.create(options.dataDir, { startParams: [...PGLITE_START_PARAMS] });
  } catch (error) {
    endUse();
    const message = error instanceof Error ? error.message : String(error);
    throw new UmbraError(
      "database-error",
      `PGlite could not open the database at ${JSON.stringify(options.dataDir)}: ${message}`,
      { reason: "open-failed" },
      { cause: error },
    );
  }
  try {
    return await openOn(engine, options.committedHeight, endUse);
  } catch (error) {
    await engine.close().catch(() => undefined);
    endUse();
    throw error;
  }
}

/**
 * Opens the PGlite backend on an engine that is already open — the database API's only user of it from now on, which
 * closes it when the database closes. The engine must have been started with {@link PGLITE_START_PARAMS}: an engine
 * whose session, or whose `RESET` values, differ from a session setting (a pinned one or a zero timeout) is refused with
 * `invalid-configuration`, naming the setting, and left open.
 */
export async function openPgliteOn(
  engine: PGlite,
  options: { readonly committedHeight: CommittedHeight },
): Promise<Database> {
  return openOn(engine, options.committedHeight, () => undefined);
}

/** {@link openPgliteOn}, with what to do once the database has closed its engine. */
async function openOn(engine: PGlite, committedHeight: CommittedHeight, afterClose: () => void): Promise<Database> {
  const database = new PgliteDatabase(engine, committedHeight, afterClose);
  await database.checkPinnedSettings();
  allowWriterStart(database, async () => {
    if (database.isClosed) throw handleClosed("database");
    return { durabilityWarnings: [] };
  });
  exclusiveJobs.set(database, (body) => database.exclusive(body));
  return database;
}

/**
 * What one exclusive job of a PGlite database gives its body ({@link exclusiveJob}): reads of committed data, and the
 * engine itself for a tool that speaks to it directly, such as `pg_dump` of `@electric-sql/pglite-tools`. [BK-1]
 */
export interface ExclusiveJob {
  /**
   * Runs `body` with a read handle, as {@link Database.read} does — `REPEATABLE READ READ ONLY`, the session's
   * settings and role reset, the committed height read first — inside the job, then rolls the read back. Reads run one
   * at a time, never while the engine is in use.
   */
  read<T>(body: (read: ReadHandle) => Promise<T>): Promise<T>;
  /**
   * The engine, with no transaction open: what a tool runs on it runs in the job, so nothing commits meanwhile. When
   * the body ends, any transaction it left open is rolled back, and the session's settings and role are reset to the
   * engine's start parameters (`RESET ALL`, `RESET ROLE`), so nothing a tool set reaches a later job.
   */
  readonly engine: PGlite;
}

const exclusiveJobs = new WeakMap<Database, <T>(body: (job: ExclusiveJob) => Promise<T>) => Promise<T>>();

/**
 * Runs `body` as one job of the PGlite database `db`'s queue, so no transaction commits while it runs (a backup's
 * manifest and dump see one committed height); resolves with its result. Returns null for a database that is not a
 * PGlite database the API opened. [DB-4, BK-1]
 */
export function exclusiveJob<T>(db: Database, body: (job: ExclusiveJob) => Promise<T>): Promise<T> | null {
  const run = exclusiveJobs.get(db);
  return run === undefined ? null : run(body);
}

interface ServerErrorFields {
  readonly message?: unknown;
  readonly severity?: unknown;
  readonly code?: unknown;
  readonly constraint?: unknown;
  readonly table?: unknown;
  readonly schema?: unknown;
  readonly column?: unknown;
}

/**
 * An error PGlite threw for a statement, as an {@link UmbraError}. A statement the server refused (severity `ERROR`,
 * with a SQLSTATE) is `database-error` with the SQLSTATE and the constraint, table, schema and column the server named
 * (`truncate-not-allowed` for the component's `TRUNCATE` refusal). Anything else is the engine failing
 * (`reason: engine-failed`). Neither is retryable. [DB-13, DB-14]
 */
export function classifyPgliteError(error: unknown): UmbraError {
  const fields: ServerErrorFields = typeof error === "object" && error !== null ? (error as ServerErrorFields) : {};
  const message = typeof fields.message === "string" ? fields.message : String(error);
  if (fields.severity === "ERROR" && typeof fields.code === "string") {
    const details: Record<string, unknown> = { sqlstate: fields.code };
    for (const name of ["constraint", "table", "schema", "column"] as const) {
      if (typeof fields[name] === "string") details[name] = fields[name];
    }
    return statementRefused(message, details, error);
  }
  return new UmbraError("database-error", `the PGlite engine failed: ${message}`, { reason: "engine-failed" }, {
    cause: error,
  });
}

/** Every later read and transaction after the engine failed. */
function failedEarlier(failure: UmbraError): UmbraError {
  return new UmbraError(
    "database-error",
    "the PGlite engine failed earlier, so nothing more can run on it until the database is opened again " +
      `(${failure.message})`,
    { reason: "engine-failed" },
    { cause: failure },
  );
}

function nestedCall(call: "read" | "transaction"): UmbraError {
  return new UmbraError(
    "database-error",
    `db.${call}() was called inside a running read or transaction of the same PGlite database: that job holds the ` +
      "database's one queue until it ends, so the call could never run; use the handle the job was given",
    { reason: "nested-call", call },
  );
}

/** A running job, and the job of the same or another database that asked for it, if any. */
interface Job {
  readonly owner: PgliteDatabase;
  /** True while the job's body (or the committed height before it) runs. */
  running: boolean;
  readonly outer: Job | undefined;
}

/** The job the current code runs in, if any. [Q73] */
const currentJob = new AsyncLocalStorage<Job>();

const keepText = (text: string): string => text;

/** Serializers that send each parameter's text unchanged, whatever type PostgreSQL gives the parameter. */
const TEXT_SERIALIZERS = new Proxy({}, { get: () => keepText }) as NonNullable<QueryOptions["serializers"]>;

/** What a statement gave back. */
interface Outcome {
  readonly rows: Row[];
  readonly count: number;
  readonly command: string | undefined;
}

/** The queue: jobs one at a time, in the order asked for. [DB-4] */
class JobQueue {
  private readonly waiting: { readonly run: () => Promise<void>; readonly refuse: (error: unknown) => void }[] = [];
  private busy = false;

  /** Runs `job` once every job asked for before it has ended, in the async context of the caller. */
  add<T>(job: () => Promise<T>): Promise<T> {
    return new Promise<T>((resolve, reject) => {
      this.waiting.push({ run: AsyncResource.bind(() => job().then(resolve, reject)), refuse: reject });
      if (!this.busy) this.next();
    });
  }

  /** Refuses every job still waiting. */
  refuseWaiting(error: () => UmbraError): void {
    for (const entry of this.waiting.splice(0)) entry.refuse(error());
  }

  private next(): void {
    const entry = this.waiting.shift();
    this.busy = entry !== undefined;
    if (entry !== undefined) void entry.run().finally(() => this.next());
  }
}

class PgliteDatabase implements Database {
  private readonly queue = new JobQueue();
  private readonly options: QueryOptions;
  /** Statements sent to the engine and not yet settled. */
  private readonly sent = new Set<Promise<void>>();
  private closing: Promise<void> | undefined;
  private closed = false;
  private failure: UmbraError | undefined;

  constructor(
    private readonly engine: PGlite,
    private readonly committedHeight: CommittedHeight,
    private readonly afterClose: () => void,
  ) {
    // An identity for every type PGlite has a parser for — its defaults, and the array types it registered when it
    // started — so that none of its parsers runs; a type it has no parser for comes back as text anyway.
    const parsers: Record<string, (text: string) => string> = {};
    for (const key of [...Object.keys(types.parsers), ...Object.keys(engine.parsers)]) parsers[key] = keepText;
    this.options = { rowMode: "array", parsers, serializers: TEXT_SERIALIZERS };
  }

  read<T>(body: (read: ReadHandle) => Promise<T>, options?: ReadOptions): Promise<T> {
    // Checked as on PostgreSQL, and then not applied: PGlite enforces neither timeout and hangs once one fires.
    // [DB-15]
    try {
      readTimeoutMs(options);
    } catch (error) {
      return Promise.reject(error);
    }
    const refused = this.refusal("read");
    if (refused !== undefined) return Promise.reject(refused);
    const outer = currentJob.getStore();
    const job = () => this.runRead(body, outer);
    // For the read-isolation test's negative control only: a build with this flag lets reads run at once, outside the
    // queue. [A11]
    return READS_BYPASS_QUEUE ? job() : this.queue.add(job);
  }

  transaction<T>(body: (tx: Transaction) => Promise<T>): Promise<T> {
    const refused = this.refusal("transaction");
    if (refused !== undefined) return Promise.reject(refused);
    const outer = currentJob.getStore();
    return this.queue.add(() => this.runTransaction(body, outer));
  }

  close(): Promise<void> {
    if (this.closing === undefined) {
      this.closed = true;
      this.closing = this.shutDown();
    }
    return this.closing;
  }

  /** True once closing started. */
  get isClosed(): boolean {
    return this.closed;
  }

  /** Refuses the engine unless every session setting is the session's value and its `RESET` value. */
  async checkPinnedSettings(): Promise<void> {
    const names = SESSION_SETTINGS.map(([name]) => name.toLowerCase());
    const { rows } = await this.statement(
      "SELECT lower(name) AS name, setting, reset_val FROM pg_settings WHERE lower(name) = ANY($1::text[])",
      [names],
    );
    for (const [name, value] of SESSION_SETTINGS) {
      const row = rows.find((candidate) => candidate.name === name.toLowerCase());
      if (row?.setting !== value || row.reset_val !== value) {
        throw new UmbraError(
          "invalid-configuration",
          `the PGlite engine runs with ${name} = ${JSON.stringify(row?.setting)} (after RESET: ` +
            `${JSON.stringify(row?.reset_val)}), not ${JSON.stringify(value)}: start it with PGLITE_START_PARAMS ` +
            "(src/db/pglite.ts), which pins the settings the database API relies on: how values print, and the zero " +
            "timeouts",
          { parameter: name },
        );
      }
    }
  }

  private refusal(call: "read" | "transaction"): UmbraError | undefined {
    if (this.closed) return handleClosed("database");
    if (this.failure !== undefined) return failedEarlier(this.failure);
    for (let job = currentJob.getStore(); job !== undefined; job = job.outer) {
      if (job.owner === this && job.running) return nestedCall(call);
    }
    return undefined;
  }

  private runRead<T>(body: (read: ReadHandle) => Promise<T>, outer: Job | undefined): Promise<T> {
    const job: Job = { owner: this, running: true, outer };
    return currentJob.run(job, async () => {
      try {
        return await this.readInJob(body, () => {
          job.running = false;
        });
      } finally {
        job.running = false;
      }
    });
  }

  /**
   * A read inside the running job: `REPEATABLE READ READ ONLY`, then `RESET ALL` and `RESET ROLE`, then the committed
   * height, then `body`'s statements, then `ROLLBACK`; `ended` is called once `body` settled, before it. [DB-2]
   */
  private async readInJob<T>(body: (read: ReadHandle) => Promise<T>, ended: () => void = () => undefined): Promise<T> {
    let open = true;
    try {
      // One call to the engine for the three: they are sent in this order either way.
      await this.script("BEGIN ISOLATION LEVEL REPEATABLE READ READ ONLY; RESET ALL; RESET ROLE");
      const query = async (sql: string, params?: unknown[]): Promise<Row[]> => {
        if (!open) throw handleClosed("read");
        return (await this.statement(sql, params)).rows;
      };
      const height = await this.committedHeight({ query });
      return await body({ height, query });
    } finally {
      open = false;
      ended();
      await this.end();
    }
  }

  /** One exclusive job ({@link exclusiveJob}): `body` with reads and the engine, then the session reset. */
  exclusive<T>(body: (job: ExclusiveJob) => Promise<T>): Promise<T> {
    const refused = this.refusal("transaction");
    if (refused !== undefined) return Promise.reject(refused);
    const outer = currentJob.getStore();
    return this.queue.add(() => {
      const job: Job = { owner: this, running: true, outer };
      return currentJob.run(job, async () => {
        let open = true;
        const read = <R>(inner: (read: ReadHandle) => Promise<R>): Promise<R> =>
          open ? this.readInJob(inner) : Promise.reject(handleClosed("read"));
        const running = body({ read, engine: this.engine });
        // A close waits for the body, as for a statement sent, before it closes the engine the body may be using.
        const settled = running.then(
          () => undefined,
          () => undefined,
        );
        this.sent.add(settled);
        void settled.then(() => this.sent.delete(settled));
        try {
          return await running;
        } finally {
          open = false;
          job.running = false;
          await this.resetSession();
        }
      });
    });
  }

  /**
   * After an exclusive job: a transaction its body left open rolled back, and every setting and the role back to the
   * engine's start parameters, so nothing a tool set on the one session reaches a later job; nothing is sent after
   * closing started or the engine failed, and a reset that fails counts as the engine failing.
   */
  private async resetSession(): Promise<void> {
    if (this.closed || this.failure !== undefined) return;
    try {
      if (this.engine.isInTransaction()) await this.statement("ROLLBACK");
      await this.statement("RESET ALL");
      await this.statement("RESET ROLE");
    } catch (error) {
      this.failure ??= new UmbraError(
        "database-error",
        `the PGlite engine failed: resetting the session after an exclusive job failed: ${(error as Error).message}`,
        { reason: "engine-failed" },
        { cause: error },
      );
    }
  }

  private runTransaction<T>(body: (tx: Transaction) => Promise<T>, outer: Job | undefined): Promise<T> {
    const job: Job = { owner: this, running: true, outer };
    return currentJob.run(job, async () => {
      try {
        await this.statement("BEGIN");
        let open = true;
        const statement = (sql: string, params: unknown[] | undefined): Promise<Outcome> => {
          if (!open) throw handleClosed("transaction");
          return this.statement(sql, params);
        };
        const tx: Transaction = {
          query: async (sql, params) => (await statement(sql, params)).rows,
          execute: async (sql, params) => (await statement(sql, params)).count,
        };
        allowMultiStatement(tx, async (sql) => {
          if (!open) throw handleClosed("transaction");
          await this.script(sql);
        });
        let result: T;
        try {
          result = await body(tx);
        } catch (error) {
          open = false;
          job.running = false;
          await this.end();
          throw error;
        }
        open = false;
        job.running = false;
        const commit = await this.statement("COMMIT");
        // PostgreSQL answers COMMIT with ROLLBACK when a failed statement aborted the transaction.
        if (commit.command !== "COMMIT") throw commitRolledBack();
        return result;
      } finally {
        job.running = false;
      }
    });
  }

  /**
   * Rolls back the job's transaction. After closing started or the engine failed, nothing is sent (the engine discards
   * an open transaction when it closes); a `ROLLBACK` that fails leaves the session in an unknown state, so the engine
   * counts as failed and no later job runs on it.
   */
  private async end(): Promise<void> {
    if (this.closed || this.failure !== undefined) return;
    try {
      await this.statement("ROLLBACK");
    } catch (error) {
      this.failure ??= new UmbraError(
        "database-error",
        `the PGlite engine failed: ROLLBACK failed, so the session's state is unknown: ${(error as Error).message}`,
        { reason: "engine-failed" },
        { cause: error },
      );
    }
  }

  /**
   * Sends one statement to the engine (PostgreSQL's extended protocol: one statement, parameters as text) and maps its
   * result. Its parameters are checked before anything is sent; after closing started or the engine failed, nothing
   * is sent.
   */
  private async statement(sql: string, params: readonly unknown[] = []): Promise<Outcome> {
    const texts = params.map((value, index) => parameterText(value, index));
    const result = await this.send(() => this.engine.query<unknown[]>(sql, texts, this.options));
    const columns = result.fields.map((field) => ({ name: field.name, type: field.dataTypeID }));
    const rows = mapRows(columns, result.rows as (string | null)[][]);
    return { rows, count: result.rowCount ?? 0, command: result.command };
  }

  /**
   * Sends a text of several statements to the engine (`exec`, the simple protocol), inside the job's transaction (a
   * migration's, `./multi-statement.ts`); its results are not read. As {@link statement}, nothing is sent after closing
   * started or the engine failed.
   */
  private async script(sql: string): Promise<void> {
    await this.send(() => this.engine.exec(sql, this.options));
  }

  /**
   * Sends one call to the engine unless closing started or the engine failed; a call still running is waited for
   * before the engine closes. A PGlite error as an {@link UmbraError}; an engine failure is kept, and refuses every
   * later call.
   */
  private async send<T>(call: () => Promise<T>): Promise<T> {
    if (this.closed) throw handleClosed("database");
    if (this.failure !== undefined) throw failedEarlier(this.failure);
    const sending = call();
    const settled = sending.then(
      () => undefined,
      () => undefined,
    );
    this.sent.add(settled);
    void settled.then(() => this.sent.delete(settled));
    try {
      return await sending;
    } catch (error) {
      const classified = classifyPgliteError(error);
      if (classified.details.reason === "engine-failed") this.failure ??= classified;
      throw classified;
    }
  }

  private async shutDown(): Promise<void> {
    this.queue.refuseWaiting(() => handleClosed("database"));
    await Promise.all(this.sent);
    if (!this.engine.closed) await this.engine.close().catch(() => undefined);
    this.afterClose();
  }
}
