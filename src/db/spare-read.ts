/**
 * A read of a database that does not wait for a pooled reader: what the ledger worker's host reads stored nodes through
 * for a request given no read (`src/ledger/worker/host.ts`).
 *
 * The worker runs one request at a time and blocks while it waits for a stored node. A read of the pool would wait for
 * a free reader; when every reader is held by a read whose own request waits in the worker behind the blocked one, none
 * is ever free. So the PostgreSQL backend gives a read that takes a pooled reader when one is free and otherwise runs
 * on one reader kept apart from the pool, opened at its first use ({@link allowSpareRead}, `./postgres.ts`). PGlite has
 * one queue and no reader to keep apart: its spare read is its read.
 */

import type { Database } from "./api.js";

const spares = new WeakMap<object, Database["read"]>();

/** Called by a backend for a database it opens whose reads may wait for one another: `read` is its spare read. */
export function allowSpareRead(db: Database, read: Database["read"]): void {
  spares.set(db, read);
}

/** The spare read of `db` (see the module comment); `db`'s own read when its backend registered none. */
export function spareRead(db: Pick<Database, "read">): Database["read"] {
  return spares.get(db) ?? ((body, options) => db.read(body, options));
}
