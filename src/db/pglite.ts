/**
 * The PGlite backend of the database API (`./api.ts`; DB-1, DB-2, DB-4, DB-13; `openspec/changes/core-arch/design.md`
 * §4), over `@electric-sql/pglite` 0.5.10: PostgreSQL 18.6 compiled to WebAssembly, run in this process, with one
 * session.
 *
 * **One queue (DB-4).** Every read and every transaction is one *job* of one queue. Jobs run one at a time, in the
 * order they were asked for, and a job holds the session from its first statement to its last — also while its body
 * awaits something that is not the database. A block transaction is therefore one exclusive job: no read runs between
 * its `BEGIN` and its `COMMIT` (A11), and a read asked for meanwhile waits until the `COMMIT`, then sees the block.
 * - A **read** (DB-2): `BEGIN ISOLATION LEVEL REPEATABLE READ READ ONLY`; then `RESET ALL` and `RESET ROLE`, so that a
 *   setting or role a transaction left on the one session does not reach the read (on PostgreSQL a read runs on a
 *   connection of its own and never sees one); then the committed height, read by the process's
 *   {@link CommittedHeight}; then the body's statements; then `ROLLBACK`, which also undoes the resets and any `SET`
 *   the body ran. Nothing commits while the job runs, so every statement sees the height the read reports.
 * - A **transaction**: `BEGIN`; the body's statements; `COMMIT` when the body resolves — a `COMMIT` that PostgreSQL
 *   answers with `ROLLBACK` (a failed statement aborted the transaction and the body caught its error) is an error,
 *   never a commit — or `ROLLBACK` when the body rejects, with the body's own error.
 * A read handle or transaction used after its job ended fails with `handle-closed`, before anything reaches the engine.
 * A job's body runs in the async context of the code that asked for it, as on PostgreSQL.
 *
 * **Calls from inside a job (Q73, resolved E by the owner, which keeps this guard).** A body that calls `read` or
 * `transaction` on the same database, instead of using the handle it was given, asks for a job that cannot start
 * before its own job ends; awaited, it would wait forever. Such a call, made while the calling code's own job — or a
 * job of the same database further out — still runs (which `AsyncLocalStorage` tells), is refused at once with
 * `database-error`, `reason: nested-call`. Code a job started that calls after the job's body has ended (a timer it
 * set) is an ordinary caller.
 *
 * **Results and parameters** go through `./mapping.ts`, as on PostgreSQL. PGlite hands over every value as the text
 * PostgreSQL printed — every parser it has is replaced by the identity for each statement, and a type it has no
 * parser for arrives as text anyway — with the column's type OID; `rowMode: "array"` keeps columns that share a
 * name. Every parameter is sent as the text `./mapping.ts` gives it, untyped, through serializers that keep it
 * unchanged (PGlite's own would rewrite `boolean`, `json` and `bytea` texts). The engine must run with
 * {@link PINNED_SETTINGS} as start parameters ({@link PGLITE_START_PARAMS}): they win over the data directory's
 * `postgresql.conf` and `postgresql.auto.conf` (PGlite's initdb writes the host's time zone there) and survive `RESET
 * ALL`, while `ALTER DATABASE … SET` and `ALTER ROLE … SET` are not applied in PGlite's single-user mode at all;
 * {@link openPgliteOn} refuses an engine that does not run with them.
 *
 * **Errors (DB-13).** PGlite runs in this process: there is no connection to lose, so no error of this backend is
 * `connection-lost`, the one retryable code. A statement the server refused (severity `ERROR`) is `database-error`
 * with the server's SQLSTATE and the names it gives, as on PostgreSQL — never its `detail` (which can hold row values)
 * nor the statement's parameters. Anything else — a `FATAL` or `PANIC`, a WebAssembly trap, an exception inside PGlite
 * — means the engine itself failed: `database-error` with `reason: engine-failed`, not retryable, since no retry on the
 * same engine can succeed; every later read and transaction fails the same way, and only opening the data directory
 * again (a process restart, after the runner halts) recovers.
 *
 * **Closing.** Once closing starts, nothing more reaches the engine: the jobs still waiting and the running job's later
 * statements fail with `handle-closed`, and a transaction whose `COMMIT` was not yet sent is not committed (the engine
 * discards it when it closes). A statement already sent is waited for, then the engine is closed.
 */

import { AsyncLocalStorage, AsyncResource } from "node:async_hooks";
import { PGlite, type QueryOptions, types } from "@electric-sql/pglite";
import type { CommittedHeight, Database, ReadHandle, Transaction } from "./api.js";
import { commitRolledBack, handleClosed, UmbraError } from "./errors.js";
import { mapRows, PINNED_SETTINGS, parameterText, type Row } from "./mapping.js";
import { READS_BYPASS_QUEUE } from "./pglite-build-flags.js";

/**
 * The start parameters of every PGlite engine the database API uses: PGlite's own (`PGlite.defaultStartParams`, which
 * a `startParams` option replaces rather than extends), then `-c name=value` for each of {@link PINNED_SETTINGS}.
 */
export const PGLITE_START_PARAMS: readonly string[] = [
  ...PGlite.defaultStartParams,
  ...PINNED_SETTINGS.flatMap(([name, value]) => ["-c", `${name}=${value}`]),
];

/** Options of {@link openPglite}. */
export interface PgliteOptions {
  /** Where the database lives: a directory on a local file system, or `memory://` for one held in memory only. */
  readonly dataDir: string;
  /** How a read learns its committed height (DB-2). */
  readonly committedHeight: CommittedHeight;
}

/**
 * Opens the PGlite backend on the database at `options.dataDir`, creating it if the directory is empty: one engine
 * started with {@link PGLITE_START_PARAMS}. An engine that cannot open is `database-error` (`reason: open-failed`),
 * not retryable.
 */
export async function openPglite(options: PgliteOptions): Promise<Database> {
  let engine: PGlite;
  try {
    engine = await PGlite.create(options.dataDir, { startParams: [...PGLITE_START_PARAMS] });
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    throw new UmbraError(
      "database-error",
      `PGlite could not open the database at ${JSON.stringify(options.dataDir)}: ${message}`,
      { reason: "open-failed" },
      { cause: error },
    );
  }
  try {
    return await openPgliteOn(engine, { committedHeight: options.committedHeight });
  } catch (error) {
    await engine.close().catch(() => undefined);
    throw error;
  }
}

/**
 * Opens the PGlite backend on an engine that is already open — the database API's only user of it from now on, which
 * closes it when the database closes. The engine must have been started with {@link PGLITE_START_PARAMS}: an engine
 * whose session, or whose `RESET` values, differ from a pinned setting is refused with `invalid-configuration`, naming
 * the setting, and left open.
 */
export async function openPgliteOn(
  engine: PGlite,
  options: { readonly committedHeight: CommittedHeight },
): Promise<Database> {
  const database = new PgliteDatabase(engine, options.committedHeight);
  await database.checkPinnedSettings();
  return database;
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
 * An error PGlite threw for a statement, as an {@link UmbraError} (DB-13): a statement the server refused (severity
 * `ERROR`, with a SQLSTATE) is `database-error` with the SQLSTATE and the constraint, table, schema and column the
 * server named; anything else is the engine failing (`reason: engine-failed`). Neither is retryable.
 */
export function classifyPgliteError(error: unknown): UmbraError {
  const fields: ServerErrorFields = typeof error === "object" && error !== null ? (error as ServerErrorFields) : {};
  const message = typeof fields.message === "string" ? fields.message : String(error);
  if (fields.severity === "ERROR" && typeof fields.code === "string") {
    const details: Record<string, unknown> = { sqlstate: fields.code };
    for (const name of ["constraint", "table", "schema", "column"] as const) {
      if (typeof fields[name] === "string") details[name] = fields[name];
    }
    return new UmbraError("database-error", message, details, { cause: error });
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
      "database's one queue until it ends, so the call could never run; use the handle the job was given (Q73)",
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

/** The job the current code runs in, if any (Q73). */
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

/** The queue: jobs one at a time, in the order asked for (DB-4). */
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
  ) {
    // An identity for every type PGlite has a parser for — its defaults, and the array types it registered when it
    // started — so that none of its parsers runs; a type it has no parser for comes back as text anyway.
    const parsers: Record<string, (text: string) => string> = {};
    for (const key of [...Object.keys(types.parsers), ...Object.keys(engine.parsers)]) parsers[key] = keepText;
    this.options = { rowMode: "array", parsers, serializers: TEXT_SERIALIZERS };
  }

  read<T>(body: (read: ReadHandle) => Promise<T>): Promise<T> {
    const refused = this.refusal("read");
    if (refused !== undefined) return Promise.reject(refused);
    const outer = currentJob.getStore();
    const job = () => this.runRead(body, outer);
    // A11's negative control only: a build with this flag lets reads run at once, outside the queue.
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

  /** Refuses the engine unless every pinned setting is the session's value and its `RESET` value. */
  async checkPinnedSettings(): Promise<void> {
    const names = PINNED_SETTINGS.map(([name]) => name.toLowerCase());
    const { rows } = await this.statement(
      "SELECT lower(name) AS name, setting, reset_val FROM pg_settings WHERE lower(name) = ANY($1::text[])",
      [names],
    );
    for (const [name, value] of PINNED_SETTINGS) {
      const row = rows.find((candidate) => candidate.name === name.toLowerCase());
      if (row?.setting !== value || row.reset_val !== value) {
        throw new UmbraError(
          "invalid-configuration",
          `the PGlite engine runs with ${name} = ${JSON.stringify(row?.setting)} (after RESET: ` +
            `${JSON.stringify(row?.reset_val)}), not ${JSON.stringify(value)}: start it with PGLITE_START_PARAMS ` +
            "(src/db/pglite.ts), which pins the settings the database API's result mapping reads",
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
      let open = true;
      try {
        await this.statement("BEGIN ISOLATION LEVEL REPEATABLE READ READ ONLY");
        await this.statement("RESET ALL");
        await this.statement("RESET ROLE");
        const query = async (sql: string, params?: unknown[]): Promise<Row[]> => {
          if (!open) throw handleClosed("read");
          return (await this.statement(sql, params)).rows;
        };
        const height = await this.committedHeight({ query });
        return await body({ height, query });
      } finally {
        open = false;
        job.running = false;
        await this.end();
      }
    });
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
    if (this.closed) throw handleClosed("database");
    if (this.failure !== undefined) throw failedEarlier(this.failure);
    const sending = this.engine.query<unknown[]>(sql, texts, this.options);
    const settled = sending.then(
      () => undefined,
      () => undefined,
    );
    this.sent.add(settled);
    void settled.then(() => this.sent.delete(settled));
    let result: Awaited<typeof sending>;
    try {
      result = await sending;
    } catch (error) {
      const classified = classifyPgliteError(error);
      if (classified.details.reason === "engine-failed") this.failure ??= classified;
      throw classified;
    }
    const columns = result.fields.map((field) => ({ name: field.name, type: field.dataTypeID }));
    const rows = mapRows(columns, result.rows as (string | null)[][]);
    return { rows, count: result.rowCount ?? 0, command: result.command };
  }

  private async shutDown(): Promise<void> {
    this.queue.refuseWaiting(() => handleClosed("database"));
    await Promise.all(this.sent);
    if (!this.engine.closed) await this.engine.close().catch(() => undefined);
  }
}
