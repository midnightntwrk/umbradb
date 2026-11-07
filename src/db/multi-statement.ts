/**
 * SQL of several statements in one call, for migrations only. A migration is one SQL text (`{ id, sql }`) that may hold
 * many statements, function bodies and comments. It runs in one transaction together with its `core_chain.migrations`
 * row. [DB-9, MD-1; design §4]
 *
 * A {@link Transaction}'s `query` and `execute` run one statement per call, on PostgreSQL's extended protocol
 * (parameters as text), which rejects a second statement (`42601`). A multi-statement text needs the simple protocol
 * instead: on PostgreSQL the writer session's simple query, on PGlite the engine's `exec`, inside the transaction's
 * job. [DB-9]
 *
 * The backends register that path for every transaction they open ({@link allowMultiStatement}), keyed by the
 * transaction object itself; nothing else holds it. Only the migration runner (`./migrate.ts`) calls
 * {@link runMultiStatement}. A `Transaction` keeps exactly `query` and `execute`, so a handle built on one (such as the
 * write handles callbacks get, `./write-handles.ts`) offers no way to the script path, and any object that is not a
 * transaction a backend opened is rejected. Modules are trusted: this keeps the path out of the callbacks' reach by
 * construction, not against a module that imports UmbraDB's internals. [Q46]
 */

import type { Transaction } from "./api.js";

/** Runs a multi-statement text in its transaction; results are not returned. */
export type MultiStatementRunner = (sql: string) => Promise<void>;

const runners = new WeakMap<Transaction, MultiStatementRunner>();

/** Called by a backend for each transaction it opens: `run` sends a multi-statement text inside that transaction. */
export function allowMultiStatement(tx: Transaction, run: MultiStatementRunner): void {
  runners.set(tx, run);
}

/**
 * Runs `sql`, which may hold several statements, in the transaction `tx`, as one simple-protocol text: a statement that
 * fails aborts the transaction, as one sent alone does. Fails with `handle-closed` once the transaction ended, and
 * with the backends' errors (`database-error`, `truncate-not-allowed`, `connection-lost`) as a statement does. Throws
 * if `tx` is not a transaction a backend opened.
 */
export async function runMultiStatement(tx: Transaction, sql: string): Promise<void> {
  const run = runners.get(tx);
  if (run === undefined) {
    throw new Error("runMultiStatement: the handle is not a transaction the database API opened");
  }
  await run(sql);
}
