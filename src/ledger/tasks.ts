/**
 * Ledger tasks, from the main thread (`openspec/changes/core-arch/specs/ledger/spec.md` LG-7, LG-17; `design.md` §5.5;
 * decision record Q49; task 12.6): what makes a module's declared `ledgerTasks` run in the ledger worker each block and
 * become the module's `block` items. A task's function cannot cross to the worker, so the worker has it from its entry
 * (`./worker/run.ts`'s `runLedgerWorker`, which the host's entry calls with the modules it ships, MD-1); the main thread
 * names it: the module's id and the task's name, the block, its ledger and how many transactions `block-parsed` holds.
 *
 * **When.** {@link withLedgerTasks} gives a module with tasks the points that run them, around its own callbacks: a
 * task without `needsState` runs at the module's `on-parse` — after `core-block-parsed`'s, whose item the module
 * requires (MD-2's check of `ledgerTasks`), so the worker keeps the block's parse —, a queued best block's included,
 * so its item is published before `on-compute` and kept when a height is processed again from `on-compute` (IN-10); a
 * task with `needsState` runs at the module's `on-compute` — after `core-ledger-state`'s, whose item `ledger-state` the
 * module requires —, on the state before the block, which the worker holds as committed until the block's
 * `on-after-db-write` (a restarted process's worker has loaded it at `core-ledger-state`'s `on-compute`). Each result is
 * put as the module's `block` item named as the task, before the module's own callback at that point runs, which sees it
 * in its block context's items.
 *
 * **Failures.** A task that throws, or returns anything but structured-cloneable plain data (`./plain-data.ts`: a
 * WebAssembly-backed object among others), fails its request with a `LedgerTaskFailed` naming the module, the task, the
 * height and why; the callback fails, and processing halts with `callback-error` naming the module and the point (RN-8;
 * a queued best block's failure drops it, met again at finality). A trap in a task ends the worker, as an apply's does.
 * A module whose tasks the worker's entry does not give fails alike, naming its entry.
 */

import type { ReadHandle } from "../db/api.js";
import type { BlockContext, ItemSink, ModuleDeclaration, PointCallbacks, ProcessContext } from "../modules/declaration.js";
import type { DeclarationSet } from "../modules/validation.js";
import type { LedgerName, LedgerTask } from "./types.js";
import type { LedgerHost } from "./worker/host.js";

/** The item every ledger task's block comes from: `core-block-parsed`'s (CD-5). */
export const TASKS_BLOCK_ITEM = "block-parsed";

/** The item a module with a `needsState` task requires: `core-ledger-state`'s (LG-17). */
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
        "(bindLedgerTasks): its tasks run in the worker (LG-17)",
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
    throw new Error(`${module}'s ledger tasks run on ${TASKS_BLOCK_ITEM}, which block ${b.height} does not have (LG-17)`);
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
