/**
 * The read-only database of the `db` item (CD-1, RN-4; owner decision Q73, resolved E;
 * `openspec/changes/core-arch/design.md` §6). `core-chain` provides the `process` item `db`, and a module that requires
 * it reads through it for work outside the points — a timer, a background job, a check at startup. It offers `read`
 * (DB-2: one consistent read at the latest committed height, which it reports) and nothing that writes, opens a
 * transaction or closes the database: modules write only through the handles RN-4 gives their callbacks.
 *
 * {@link readOnlyDatabase} makes the item from a {@link Database}. Its `read` is the database's, with the same arguments
 * — the body and the read option (DB-15) passed through unchanged, so a read without `timeoutMs` is not bounded and one
 * with it is bounded as the database API bounds it (on PostgreSQL only) — and the same result or error. Everything else
 * comes from the database's own `read`: on PGlite a call from inside a running job of the same database — a callback
 * inside the block's transaction, `on-start-db`'s, or a read's body — fails at once with `nested-call` (DB-4, task 2.2's
 * guard), and on PostgreSQL it runs on a pooled read connection and sees committed data only, never the open block's.
 *
 * The item is a frozen object whose one property is `read`, a function that holds the database in its closure: a
 * module finds no `transaction`, no `close` and no write on it by ordinary use — no property, prototype or value leads
 * to the database. One item is shared by every module that requires `db`, and it is frozen so that an assignment to it,
 * a mistake in one module, throws instead of changing it for the others. Modules are trusted (Q46): nothing here
 * defends against one that goes around the item; the module guide gives the rules (`docs/module-guide.md`).
 */

import type { Database, ReadHandle, ReadOnlyDatabase, ReadOptions } from "./api.js";

/** The `db` item over `db`: its `read`, and nothing else of it (see the module comment). */
export function readOnlyDatabase(db: Database): ReadOnlyDatabase {
  return Object.freeze({
    read: <T>(body: (read: ReadHandle) => Promise<T>, options?: ReadOptions): Promise<T> => db.read(body, options),
  });
}
