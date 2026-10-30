/**
 * Ledger tasks, from the main thread: what makes a module's declared `ledgerTasks` run in the ledger worker for each
 * block and become the module's `block` items. A task's function cannot cross to the worker, so the worker gets it
 * from its entry (`./worker/run.ts`'s `runLedgerWorker`, which the host's entry calls with the modules it ships). The
 * main thread only names the task: the module's id, the task's name, the block, its ledger and how many transactions
 * `block-parsed` holds. [LG-7, LG-17, MD-1, Q49; design §5.5]
 *
 * **When.** {@link withLedgerTasks} gives a module with tasks the points that run them, around its own callbacks:
 *
 * - A task without `needsState` runs at the module's `on-parse`. That is after `core-block-parsed`'s `on-parse`, whose
 *   item the module must require (declaration validation checks this for `ledgerTasks`), so the worker still holds the
 *   block's parse. It also runs for a queued best block, so its item is published before `on-compute` and kept when a
 *   height is processed again from `on-compute`. [MD-2, IN-10]
 * - A task with `needsState` runs at the module's `on-compute`, after `core-ledger-state`'s, whose item `ledger-state`
 *   the module requires. It runs on the state before the block, which the worker holds as committed until the block's
 *   `on-after-db-write` (after a restart, the worker loads it at `core-ledger-state`'s `on-compute`). [LG-17]
 *
 * Each result is put as the module's `block` item named after the task, before the module's own callback at that point
 * runs; that callback sees it among its block context's items.
 *
 * **Failures.** A task fails its request with a `LedgerTaskFailed` naming the module, the task, the height and why when
 * it throws, or when it returns anything but structured-cloneable plain data (`./plain-data.ts`; a WebAssembly-backed
 * object, for example). The callback then fails, and processing halts with `callback-error` naming the module and the
 * point; a queued best block that fails is dropped instead, and met again at finality. A trap in a task ends the
 * worker, as a trap in an apply does. A module whose tasks the worker's entry does not provide fails the same way,
 * naming its entry. [RN-8]
 */

import type { ReadHandle } from "../db/api.js";
import type { BlockContext, ItemSink, ModuleDeclaration, PointCallbacks, ProcessContext } from "../modules/declaration.js";
import type { DeclarationSet } from "../modules/validation.js";
import type { LedgerName, LedgerTask } from "./types.js";
import type { LedgerHost } from "./worker/host.js";

/** The item every ledger task's block comes from: `core-block-parsed`'s. [CD-5] */
export const TASKS_BLOCK_ITEM = "block-parsed";

/** The item a module with a `needsState` task requires: `core-ledger-state`'s. [LG-17] */
export const TASKS_STATE_ITEM = "ledger-state";

const BOUND = new WeakMap<ProcessContext, LedgerHost>();

/**
 * Binds the module of process context `context`, which declares ledger tasks, to the process's ledger worker, before
 * the loop runs (the runner's, `src/runner/process.ts`). Throws when `context` is bound already.
 */
export function bindLedgerTasks(context: ProcessContext, host: LedgerHost): void {
  if (BOUND.has(context)) throw new Error("bindLedgerTasks: a module's ledger tasks are bound once per process context");
  BOUND.set(context, host);
}

/** The ledger worker bound to `p` (see {@link bindLedgerTasks}); throws, naming the module, when there is none. */
function boundHost(p: ProcessContext, module: string): LedgerHost {
  const host = BOUND.get(p);
  if (host === undefined) {
    throw new Error(
      `${module} declares ledger tasks and ran with a process context the runner did not bind to a ledger worker ` +
        "(bindLedgerTasks): its tasks run in the worker",
    );
  }
  return host;
}

/** Freezes plain data deeply (a `Uint8Array`, which cannot be frozen, left as it is). */
function frozen<T>(value: T): T {
  if (value === null || typeof value !== "object" || value instanceof Uint8Array || Object.isFrozen(value)) return value;
  for (const inner of Object.values(value)) frozen(inner);
  return Object.freeze(value);
}

/** Block `b`'s results of `tasks` of `module`, run in the worker (see the module comment), by task name. */
async function resultsOf(
  p: ProcessContext,
  b: BlockContext,
  module: string,
  tasks: readonly LedgerTask[],
  read?: Pick<ReadHandle, "query">,
): Promise<[string, unknown][]> {
  const parsed = b.items.get(TASKS_BLOCK_ITEM) as { readonly ledger: string; readonly transactions: readonly unknown[] } | undefined;
  if (parsed === undefined) {
    throw new Error(`${module}'s ledger tasks run on ${TASKS_BLOCK_ITEM}, which block ${b.height} does not have`);
  }
  const results = await boundHost(p, module).tasks(
    {
      height: b.height,
      hash: b.hash,
      parentHash: b.parentHash,
      ledger: parsed.ledger as LedgerName,
      transactions: parsed.transactions.length,
      module,
      tasks: tasks.map((task) => task.name),
    },
    read,
  );
  return tasks.map((task) => [task.name, frozen(results[task.name])]);
}

/** `b` with `results` among its items. */
function withItems(b: BlockContext, results: readonly [string, unknown][]): BlockContext {
  return Object.freeze({ ...b, items: new Map([...b.items, ...results]) });
}

/**
 * `declaration` with the points that run its ledger tasks (see the module comment); itself when it declares none. Its
 * own callbacks are called as before, with its `points` as `this`.
 */
export function withLedgerTasks(declaration: ModuleDeclaration): ModuleDeclaration {
  const tasks = declaration.ledgerTasks ?? [];
  if (tasks.length === 0) return declaration;
  const own = declaration.points;
  const points: Partial<PointCallbacks> = { ...own };
  const stateless = tasks.filter((task) => !task.needsState);
  const stateful = tasks.filter((task) => task.needsState);
  if (stateless.length > 0) {
    points["on-parse"] = async (p: ProcessContext, b: BlockContext, out: ItemSink): Promise<void> => {
      const results = await resultsOf(p, b, declaration.id, stateless);
      for (const [name, value] of results) out.put(name, value);
      await own["on-parse"]?.call(own, p, withItems(b, results), out);
    };
  }
  if (stateful.length > 0) {
    points["on-compute"] = async (p: ProcessContext, b: BlockContext, read: ReadHandle, out: ItemSink): Promise<void> => {
      const results = await resultsOf(p, b, declaration.id, stateful, read);
      for (const [name, value] of results) out.put(name, value);
      await own["on-compute"]?.call(own, p, withItems(b, results), read, out);
    };
  }
  return Object.freeze({ ...declaration, points: Object.freeze(points) });
}

/** `set` with {@link withLedgerTasks} applied to every module (the backbone parts declare none). */
export function withLedgerTaskPoints(set: DeclarationSet<ModuleDeclaration>): DeclarationSet<ModuleDeclaration> {
  return Object.freeze({
    backbone: set.backbone,
    core: Object.freeze(set.core.map(withLedgerTasks)),
    user: Object.freeze(set.user.map(withLedgerTasks)),
  });
}

/** Whether `declaration` declares ledger tasks: its process context is bound to the worker. */
export const hasLedgerTasks = (declaration: ModuleDeclaration): boolean => (declaration.ledgerTasks ?? []).length > 0;
