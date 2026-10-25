/**
 * The write handles of DB-3 and their closing (`openspec/changes/core-arch/design.md` §2, §4 "Write handles"; CORE-ARCH
 * §4.10; RN-3, RN-4, DB-6, DB-14), built on a {@link Transaction} of the database API.
 *
 * **Block write handles.** {@link openBlockWrites} takes the block transaction the runner opened with
 * {@link Database.transaction} — on PostgreSQL the writer's (DB-5), on PGlite one exclusive job of the queue (DB-4) —
 * and runs the parts' `on-db-write` callbacks in it, one at a time, in the order the runner calls
 * {@link BlockWrites.write} (RN-3's). For each callback: the part's role is set first — `SET LOCAL ROLE` to its write
 * role (a shared item's provider writes under the item's role, Q89), or `RESET ROLE` for UmbraDB's own parts
 * ({@link OWN_PARTS}), which write as the writer's login — so that whatever the callback before it left, a callback
 * never runs under another part's role; the callback gets a handle of its own; when the callback settles the handle
 * closes, and after a callback that returned the block goes back to the login (`RESET ROLE`), which also undoes a role
 * the callback selected itself. A callback asked for while another runs is refused before anything is sent (a
 * programming error: `on-db-write` runs in series). A block write handle is the block's transaction, so it reads
 * committed data plus what earlier callbacks wrote in the block (DB-3); it writes what its role may, its own schema
 * (DB-6); it never carries the migration mark, so `TRUNCATE` of a guarded table is refused in it (DB-14, A73).
 *
 * **Schema write handles.** {@link runOnStartDb} runs a part's `on-start-db` in a transaction of its own, under the
 * part's role in the same way, with a schema write handle (DB-3, RN-4); the migration runner calls it after the part's
 * migrations (`./migrate.ts`).
 *
 * **Closing (A10).** A handle offers CORE-ARCH §4.10's `height`, `query` and `execute`, nothing else: no way to the
 * transaction it forwards to, nor to the migrations' script path (`./multi-statement.ts`). Once its callback returns
 * or throws, every call fails at once with `handle-closed` (`details: { handle, module, point }`) before anything is
 * sent: from a stored reference or a timer, while the block transaction is still open — so never under the role of the
 * part that runs now — or after it ended, and on PGlite without waiting in the queue. Each such use is also reported to
 * {@link WriteHandleOptions.onClosedUse}: DB-3 makes it a callback error whether or not the module's own code catches
 * it, so that the runner halts (RN-8). A statement the callback sent before it returned runs under its role before the
 * role changes, since both backends send a transaction's statements in the order they are asked for. `height` is a
 * value, not a use: it stays readable.
 *
 * Modules are trusted (Q46): the roles and the closing stop mistakes, not a module that goes around them.
 */

import type { BlockWriteHandle, Database, SchemaWriteHandle, Transaction } from "./api.js";
import { type UmbraError, writeHandleClosed } from "./errors.js";
import { OWN_PARTS, type SchemaPlan, setModuleRole } from "./roles.js";

/** What every write handle a block or a startup hands out reports, and whom it tells of a use after closing. */
export interface WriteHandleOptions {
  /**
   * The committed height each handle reports as `height` (CORE-ARCH §4.10: the committed data it reads): for the block
   * at h, the cursor before it, h − 1 (null for the first block); at startup, the cursor (null before any height
   * commits).
   */
  readonly height: bigint | null;
  /**
   * Called at once with the error of every use of a handle after its callback ended — the error that call rejects
   * with, `handle-closed` naming the part and the point — whether or not the module's code handles it: the runner
   * treats it as that part's callback error and halts (DB-3, RN-8). It must not throw.
   */
  readonly onClosedUse?: (error: UmbraError) => void;
}

/** The `on-db-write` callbacks of one block transaction, in series (RN-3, RN-4). */
export interface BlockWrites {
  /**
   * Runs `part`'s `on-db-write` callback with a block write handle under the part's role, and resolves with its result;
   * the handle closes when the callback settles. Rejects with the callback's own error unchanged (the runner rolls the
   * block back and halts, RN-8), and throws for a part neither in the plan nor UmbraDB's own, and for a call made while
   * another part's callback runs, before anything is sent.
   */
  write<T>(part: string, callback: (w: BlockWriteHandle) => Promise<T>): Promise<T>;
}

type Point = "on-db-write" | "on-start-db";

/**
 * Sets the role `part` writes under, for the rest of the transaction or until another is set: its write role for a
 * module of the plan, the writer's login for UmbraDB's own parts. Throws, sending nothing, for any other part.
 */
async function setPartRole(tx: Transaction, plan: SchemaPlan, part: string): Promise<void> {
  if (OWN_PARTS.includes(part)) await tx.execute("RESET ROLE");
  else await setModuleRole(tx, plan, part);
}

/**
 * Runs `callback` with a handle for `part` at `point` on `tx`, after setting the part's role; closes the handle when the
 * callback settles, then, after a callback that returned, goes back to the login. After one that threw nothing is sent
 * (its transaction may be aborted, and the runner rolls it back), and the callback's error passes through unchanged.
 */
async function runCallback<T>(
  tx: Transaction,
  plan: SchemaPlan,
  part: string,
  point: Point,
  options: WriteHandleOptions,
  callback: (w: BlockWriteHandle) => Promise<T>,
): Promise<T> {
  await setPartRole(tx, plan, part);
  let open = true;
  const refuse = (): UmbraError => {
    const error = writeHandleClosed(point === "on-db-write" ? "block-write" : "schema-write", part);
    options.onClosedUse?.(error);
    return error;
  };
  const handle: BlockWriteHandle = {
    height: options.height,
    async query(sql, params) {
      if (!open) throw refuse();
      return tx.query(sql, params);
    },
    async execute(sql, params) {
      if (!open) throw refuse();
      return tx.execute(sql, params);
    },
  };
  let result: T;
  try {
    result = await callback(handle);
  } finally {
    open = false;
  }
  await tx.execute("RESET ROLE");
  return result;
}

/**
 * Opens the `on-db-write` calls of the block transaction `tx` (see the module comment). The runner calls
 * {@link BlockWrites.write} once per part, in RN-3's order, awaiting each.
 */
export function openBlockWrites(tx: Transaction, plan: SchemaPlan, options: WriteHandleOptions): BlockWrites {
  let running: string | undefined;
  return {
    async write(part, callback) {
      if (running !== undefined) {
        throw new Error(
          `openBlockWrites: the on-db-write of ${part} was asked for while the one of ${running} runs; the callbacks of ` +
            "on-db-write run in series, each awaited before the next (RN-3)",
        );
      }
      running = part;
      try {
        return await runCallback(tx, plan, part, "on-db-write", options, callback);
      } finally {
        running = undefined;
      }
    },
  };
}

/**
 * Runs `part`'s `on-start-db` callback in a transaction of its own, under the part's role, with a schema write handle
 * that closes when the callback settles (DB-3, RN-4): committed when the callback resolves, rolled back when it rejects
 * (with its error, unchanged). Throws, before the callback runs, for a part neither in the plan nor UmbraDB's own.
 */
export function runOnStartDb(
  db: Database,
  plan: SchemaPlan,
  part: string,
  options: WriteHandleOptions,
  callback: (w: SchemaWriteHandle) => Promise<void>,
): Promise<void> {
  return db.transaction((tx) => runCallback(tx, plan, part, "on-start-db", options, callback));
}
