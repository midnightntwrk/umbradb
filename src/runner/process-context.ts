/**
 * The process contexts (`openspec/changes/core-arch/specs/modules/spec.md` MD-7; `specs/runner/spec.md` RN-1, RN-4;
 * `design.md` §6; CORE-ARCH §4.10's `ProcessContext`): what every callback of a module gets first — the `process` items
 * it may read, its revisions, and `publish` for the `process` items it provides.
 *
 * **One context per module** ({@link ProcessContexts.of}), the same object in its `on-start-db` — run by the migration
 * runner through {@link ProcessContexts.startDbPart} — and at every point the runner calls afterwards (`on-start-api`,
 * the finalized loop's points, start and stop), so a module sees one context for the whole process.
 *
 * **Publishing (MD-7).** A module publishes an item from its own `on-start-db` only — the context knows which module's
 * `on-start-db` is running, as the migration runner runs them one at a time —, only an item it declares with the
 * `process` lifetime, and once: one value per item for the whole process, so a second publish of an item by its module
 * or by another of its providers is refused too. Any other call is refused: it throws at the call, and the refusal
 * also fails the callback when the module catches it — `on-start-db` here; `on-start-api` in `registerModuleApis`
 * (`./module-api.ts`); the loop's points through {@link ProcessContexts.watch} (the loop's misuses, `./loop.ts`). A
 * publish made after the module's `on-start-db` ended (a timer) fails the startup at the seal, or the loop when it runs.
 *
 * **Reading.** A context's `items` is a read-only view: from `on-start-api` on — once {@link ProcessContexts.seal} ran,
 * after every `on-start-db` — the published items the module requires or provides, in publication order; empty before
 * (MD-7: "visible … from `on-start-api` on"), so no `on-start-db` depends on the order of its providers' setups.
 *
 * **`process-item-missing`.** The seal refuses startup when an item that a module of this process requires — a part
 * active in a range the process may run, the cursor's included (RN-11 re-delivers there), not one whose revisions all
 * ended below it — and that some part declares with the `process` lifetime was not published.
 */

import { UmbraError } from "../db/errors.js";
import type { MigrationPart } from "../db/migrate.js";
import { migrationPart } from "../modules/adapters.js";
import type { ModuleDeclaration, ProcessContext, Revision } from "../modules/declaration.js";
import type { ResolvedGraph } from "../modules/graph.js";

/** Told of each refused `publish`: the refusal, and the module whose context it was called on. */
export type MisuseListener = (error: Error, module: string) => void;

/** Where refused calls of the process contexts are reported, for the finalized loop (`LoopInput.misuses`). */
export interface MisuseReports {
  /**
   * Calls `listener` for each later refusal, and at once with the first one made before, if any; returns what stops
   * the reports.
   */
  watch(listener: MisuseListener): () => void;
}

/** What the contexts are made from. */
export interface ProcessContextsInput {
  /** The database's resolved graph: its `modules` (every part, in startup order) and the `ranges` the process may run. */
  readonly graph: Pick<ResolvedGraph, "modules" | "ranges">;
  /** Each module's revisions, in start order (task 4.3 gives them); none when not given. */
  readonly revisionsOf?: (id: string) => readonly Revision[];
}

/** Why a `publish` is refused. */
export interface PublishRefusal {
  readonly reason: "after-startup" | "outside-on-start-db" | "not-declared" | "published-twice";
  readonly message: string;
}

const RULE = "a process item is published once, from its provider's on-start-db (MD-7)";

/** Whether `part` declares `item` with the `process` lifetime. */
const providesProcessItem = (part: ModuleDeclaration, item: string): boolean =>
  part.provides.some((declared) => declared.name === item && declared.lifetimes.includes("process"));

/** Names in words: `a`, `a and b`, `a, b and c`. */
function names(list: readonly string[]): string {
  return list.length <= 1 ? list.join("") : `${list.slice(0, -1).join(", ")} and ${list.at(-1)}`;
}

/** The `items` of one module's context: a read-only view of the published items it may see (see the module comment). */
class ProcessItems implements ReadonlyMap<string, unknown> {
  readonly #entries: () => Map<string, unknown>;

  constructor(entries: () => Map<string, unknown>) {
    this.#entries = entries;
    Object.freeze(this);
  }

  get [Symbol.toStringTag](): string {
    return "ProcessItems";
  }

  get size(): number {
    return this.#entries().size;
  }

  get(key: string): unknown {
    return this.#entries().get(key);
  }

  has(key: string): boolean {
    return this.#entries().has(key);
  }

  forEach(callback: (value: unknown, key: string, map: ReadonlyMap<string, unknown>) => void, thisArg?: unknown): void {
    for (const [key, value] of this.#entries()) callback.call(thisArg, value, key, this);
  }

  entries(): MapIterator<[string, unknown]> {
    return this.#entries().entries();
  }

  keys(): MapIterator<string> {
    return this.#entries().keys();
  }

  values(): MapIterator<unknown> {
    return this.#entries().values();
  }

  [Symbol.iterator](): MapIterator<[string, unknown]> {
    return this.#entries().entries();
  }
}

/** The process contexts of one process (see the module comment). */
export class ProcessContexts implements MisuseReports {
  readonly #parts: ReadonlyMap<string, ModuleDeclaration>;
  /** The parts that may run a point in this process: active in a range of the graph's `ranges`. */
  readonly #running: ReadonlySet<string>;
  readonly #revisionsOf: (id: string) => readonly Revision[];
  readonly #contexts = new Map<string, ProcessContext>();
  /** Each published item's value and the module that published it, in publication order. */
  readonly #published = new Map<string, { readonly module: string; readonly value: unknown }>();
  /** The module whose `on-start-db` is running, if any. */
  #window: string | undefined;
  #sealed = false;
  readonly #refusals = new Map<string, Error>();
  #first: { readonly error: Error; readonly module: string } | undefined;
  /** The watchers, each in a wrapper of its own: one listener given twice is two watchers. */
  readonly #listeners = new Set<{ readonly listener: MisuseListener }>();

  constructor(input: ProcessContextsInput) {
    this.#parts = new Map(input.graph.modules.map((part) => [part.id, part]));
    this.#running = new Set(input.graph.ranges.flatMap((range) => range.order.map((part) => part.id)));
    this.#revisionsOf = input.revisionsOf ?? (() => []);
  }

  /** Whether the seal ran: from `on-start-api` on. */
  get sealed(): boolean {
    return this.#sealed;
  }

  /** The context of part `id`: made on first use, the same object afterwards. Throws for an id the graph lacks. */
  of(id: string): ProcessContext {
    let context = this.#contexts.get(id);
    if (context === undefined) {
      const part = this.#parts.get(id);
      if (part === undefined) throw new Error(`ProcessContexts: ${id} is no part of this database's graph`);
      const visible = new Set([...part.requires, ...part.provides.map(({ name }) => name)]);
      context = Object.freeze({
        items: new ProcessItems(
          () =>
            new Map(
              this.#sealed
                ? [...this.#published].filter(([name]) => visible.has(name)).map(([name, { value }]) => [name, value])
                : [],
            ),
        ),
        revisions: Object.freeze([...this.#revisionsOf(id)]),
        publish: (item: string, value: unknown): void => this.#publish(part, item, value),
      });
      this.#contexts.set(id, context);
    }
    return context;
  }

  /**
   * The migration runner's part of `declaration` (`migrationPart`), its `on-start-db` run with the module's context in
   * the module's publishing window: a refused publish of the module during it fails it, caught or not.
   */
  startDbPart(declaration: ModuleDeclaration): MigrationPart {
    const part = migrationPart(declaration, this.of(declaration.id));
    const setup = part.onStartDb;
    if (setup === undefined) return part;
    return {
      ...part,
      onStartDb: async (w) => {
        this.#window = declaration.id;
        try {
          await setup(w);
        } finally {
          this.#window = undefined;
        }
        const refused = this.#refusals.get(declaration.id);
        if (refused !== undefined) throw refused;
      },
    };
  }

  /**
   * Ends the publishing, once every part's `on-start-db` has run (MD-7): throws the first refused publish, if any, then
   * `process-item-missing` for the first item a module of this process requires that was not published (in startup
   * order, then the module's `requires` order); otherwise the items become visible. Throws when called twice.
   */
  seal(): void {
    if (this.#sealed) throw new Error("ProcessContexts: the contexts are sealed once, after every on-start-db");
    this.check();
    const providers = new Map<string, string[]>();
    for (const part of this.#parts.values()) {
      for (const { name } of part.provides) {
        if (providesProcessItem(part, name)) providers.set(name, [...(providers.get(name) ?? []), part.id]);
      }
    }
    const missing = new Map<string, string[]>();
    for (const part of this.#parts.values()) {
      if (!this.#running.has(part.id)) continue;
      for (const item of part.requires) {
        if (providers.has(item) && !this.#published.has(item)) missing.set(item, [...(missing.get(item) ?? []), part.id]);
      }
    }
    const [first] = missing;
    if (first !== undefined) {
      const [item, modules] = first;
      const by = providers.get(item) as string[];
      throw new UmbraError(
        "process-item-missing",
        `the process item ${item}, which ${names(modules)} ${modules.length === 1 ? "requires" : "require"}, was not ` +
          `published by the on-start-db of its provider${by.length === 1 ? "" : "s"} ${names(by)} (MD-7)`,
        { item, modules, providers: by },
      );
    }
    this.#sealed = true;
  }

  /** The first refused publish on module `id`'s context, if any. */
  refusalOf(id: string): Error | undefined {
    return this.#refusals.get(id);
  }

  /** Throws the first refused publish of the process, if any. */
  check(): void {
    if (this.#first !== undefined) throw this.#first.error;
  }

  /** Reports each refusal to `listener`, and the first one made before at once (see {@link MisuseReports}). */
  watch(listener: MisuseListener): () => void {
    const watcher = { listener };
    this.#listeners.add(watcher);
    if (this.#first !== undefined) listener(this.#first.error, this.#first.module);
    return () => {
      this.#listeners.delete(watcher);
    };
  }

  /** Why `part` may not publish `item` now, or undefined (see the module comment). */
  protected publishRefusal(part: ModuleDeclaration, item: string): PublishRefusal | undefined {
    const what = `${part.id} published the process item ${String(item)}`;
    if (this.#sealed) {
      return { reason: "after-startup", message: `${what} after startup's on-start-db callbacks ran: ${RULE}` };
    }
    if (this.#window !== part.id) {
      return { reason: "outside-on-start-db", message: `${what} outside its on-start-db callback: ${RULE}` };
    }
    if (!providesProcessItem(part, item)) {
      return {
        reason: "not-declared",
        message:
          `${part.id} published the item ${String(item)}, which it does not declare with the process lifetime: a ` +
          "module publishes only the process items it declares (MD-7)",
      };
    }
    const earlier = this.#published.get(item);
    if (earlier !== undefined) {
      const twice = earlier.module === part.id ? `${what} twice` : `${what}, which ${earlier.module} published already`;
      return { reason: "published-twice", message: `${twice}: ${RULE}` };
    }
    return undefined;
  }

  /** `publish` on `part`'s context. */
  #publish(part: ModuleDeclaration, item: string, value: unknown): void {
    const refusal = this.publishRefusal(part, item);
    if (refusal === undefined) {
      this.#published.set(item, { module: part.id, value });
      return;
    }
    const error = new Error(refusal.message);
    if (!this.#refusals.has(part.id)) this.#refusals.set(part.id, error);
    this.#first ??= { error, module: part.id };
    for (const { listener } of [...this.#listeners]) listener(error, part.id);
    throw error;
  }
}
