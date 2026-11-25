/**
 * `COPY … FROM stdin` with its data, for a restore only (`src/backup/restore.ts`): a backup's dump loads its tables
 * this way. The backends register the path for every transaction they open ({@link allowCopyIn}), keyed by the
 * transaction itself, as `./multi-statement.ts` does, so no handle built on a transaction reaches it.
 *
 * - **PostgreSQL:** the writer session's copy stream (`./postgres.ts`).
 * - **PGlite:** one `COPY … FROM '/dev/blob'` per chunk, the chunk as the engine's blob (`./pglite.ts`).
 */

import type { Transaction } from "./api.js";

/** Runs a `COPY … FROM stdin` statement with its data: chunks of whole lines in `COPY`'s text format. */
export type CopyInRunner = (sql: string, chunks: AsyncIterable<string>) => Promise<void>;

const runners = new WeakMap<Transaction, CopyInRunner>();

/** Called by a backend for each transaction it opens. */
export function allowCopyIn(tx: Transaction, run: CopyInRunner): void {
  runners.set(tx, run);
}

/**
 * Runs `sql`, a `COPY … FROM stdin`, with the data `chunks` give, in the transaction `tx`. A failure aborts the
 * transaction, as a statement's does. Throws if `tx` is not a transaction a backend opened.
 */
export async function copyIn(tx: Transaction, sql: string, chunks: AsyncIterable<string>): Promise<void> {
  const run = runners.get(tx);
  if (run === undefined) throw new Error("copyIn: the handle is not a transaction the database API opened");
  await run(sql, chunks);
}

/** `sql`, a `COPY … FROM stdin`, reading from PGlite's blob device instead. */
export function copyFromBlob(sql: string): string {
  const rewritten = sql.replace(/\bFROM\s+stdin\s*;?\s*$/i, "FROM '/dev/blob'");
  if (rewritten === sql) throw new Error(`copyFromBlob: not a COPY … FROM stdin: ${sql.slice(0, 200)}`);
  return rewritten;
}
