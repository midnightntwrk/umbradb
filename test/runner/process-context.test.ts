import { afterAll, beforeAll, describe, expect, it } from "vitest";
import type { Database, SchemaWriteHandle } from "../../src/db/api.js";
import { UmbraError } from "../../src/db/errors.js";
import type {
  ItemDeclaration,
  ModuleDeclaration,
  PointName,
  ProcessContext,
  Revision,
} from "../../src/modules/declaration.js";
import { type ResolvedGraph, resolveGraph } from "../../src/modules/graph.js";
import { CallbackFailure } from "../../src/runner/dispatch.js";
import { FinalizedLoop, HeightFailure } from "../../src/runner/loop.js";
import {
  type MisuseListener,
  ProcessContexts,
  type PublishRefusal,
} from "../../src/runner/process-context.js";
import { declaration } from "../modules/declarations.js";
import { BACKBONE, CORE_CHAIN, entry, graphInput } from "../modules/graph-fixtures.js";
import { cursorOf, RUNNER_BACKENDS } from "./loop-harness.js";
import {
  type ContextsClass,
  InMemoryBlockSource,
  processLoopInput,
  publishingBackbone,
  rejection,
  runLoop,
  STAND_INS,
  startProcess,
  startThroughSeal,
} from "./process-harness.js";

/**
 * Process items and the `ProcessContext`:
 * - one process context per module, the same object in its `on-start-db` (through `startDatabase`) and at every point;
 * - `publish` only from the module's own `on-start-db`, once per item, only an item the module declares with the
 *   `process` lifetime; any other call fails the callback, even when the module catches the refusal;
 * - the items visible in `items` to the modules requiring them (and to their providers) from `on-start-api` on;
 * - `process-item-missing` when every `on-start-db` has run and an item a module of the process requires was not
 *   published. [MD-7; CORE-ARCH §4.10]
 *
 * The acceptance case runs through the runner's startup and loop on both backends; the rules themselves are also
 * tested without a database. [A74]
 */

const CLIENT: ItemDeclaration = { name: "client", lifetimes: ["process"] };
const LATE: ItemDeclaration = { name: "late", lifetimes: ["process"] };
const VALUE = Object.freeze({ connected: true });

/** A schema write handle that is never used: the tests without a database call `on-start-db` with it. */
const UNUSED_WRITE: SchemaWriteHandle = Object.freeze({
  height: null,
  query: () => Promise.reject(new Error("not used")),
  execute: () => Promise.reject(new Error("not used")),
});

/** `provider` (provides `client` and `late`, both `process`) with `points`. */
const provider = (points: ModuleDeclaration["points"], rest: Partial<ModuleDeclaration> = {}): ModuleDeclaration =>
  declaration("provider", { provides: [CLIENT, LATE], migrations: [], points, ...rest });

/** `consumer` (requires `client`) with `points`. */
const consumer = (points: ModuleDeclaration["points"], rest: Partial<ModuleDeclaration> = {}): ModuleDeclaration =>
  declaration("consumer", { requires: ["client"], provides: [], migrations: [], points, ...rest });

/** A provider that publishes `client` in its `on-start-db`. */
const publisher = (rest: ModuleDeclaration["points"] = {}): ModuleDeclaration =>
  provider({
    async "on-start-db"(p) {
      p.publish("client", VALUE);
    },
    ...rest,
  });

/** The test backbone of `graph-fixtures.ts` with a `core-chain` that publishes its process items (no database). */
const BACKBONE_PUBLISHING: readonly ModuleDeclaration[] = BACKBONE.map((part) =>
  part.id === "core-chain"
    ? {
        ...CORE_CHAIN,
        points: {
          async "on-start-db"(p) {
            for (const [name, value] of Object.entries({ ...STAND_INS, db: { read: () => undefined } })) p.publish(name, value);
          },
        },
      }
    : part,
);

/** The graph of `user` with the publishing test backbone, from S = 1, a new database unless `cursor` is given. */
function graphOf(user: readonly ModuleDeclaration[], entries = user.map((d) => entry(d.id, 1)), cursor: bigint | null = null) {
  return resolveGraph(graphInput(user, entries, { backbone: BACKBONE_PUBLISHING, cursor }));
}

/** Runs every part's `on-start-db` in startup order, as `startDatabase` does, through `contexts`' parts. */
async function setUp(contexts: ProcessContexts, graph: ResolvedGraph): Promise<void> {
  for (const part of graph.modules) await contexts.startDbPart(part).onStartDb?.(UNUSED_WRITE);
}

/** The error `body` throws; fails the test if it does not. */
function thrown(body: () => unknown): unknown {
  try {
    body();
  } catch (error) {
    return error;
  }
  throw new Error("expected a throw");
}

describe("process contexts (MD-7), without a database", () => {
  it("gives each module one context, the same object every time, with its revisions in start order, frozen", () => {
    const revisions: Revision[] = [
      { start: 1n, stop: 9n, version: "1.0.0", settings: { k: 1 } },
      { start: 10n, stop: null, version: "1.0.0", settings: { k: 2 } },
    ];
    const graph = graphOf([publisher(), consumer({})]);
    const contexts = new ProcessContexts({ graph, revisionsOf: (id) => (id === "consumer" ? revisions : []) });
    const context = contexts.of("consumer");
    expect(contexts.of("consumer")).toBe(context);
    expect(contexts.of("provider")).not.toBe(context);
    expect(context.revisions).toEqual(revisions);
    expect(Object.isFrozen(context.revisions)).toBe(true);
    expect(Object.isFrozen(context)).toBe(true);
    expect(contexts.of("provider").revisions).toEqual([]);
    expect(new ProcessContexts({ graph }).of("consumer").revisions).toEqual([]);
    expect(() => contexts.of("nobody")).toThrow(/nobody is no part of this database's graph/);
  });

  it("shows a published item to the modules requiring it from on-start-api on, not during on-start-db", async () => {
    const seen: Record<string, unknown> = {};
    const graph = graphOf([
      publisher(),
      consumer({
        async "on-start-db"(p) {
          seen.startDb = [...p.items.keys()];
        },
      }),
      declaration("bystander", { provides: [], migrations: [] }),
    ]);
    const contexts = new ProcessContexts({ graph });
    // The consumer's on-start-db runs after the provider's (startup order), and still sees no item.
    await setUp(contexts, graph);
    expect(seen.startDb).toEqual([]);
    expect(contexts.sealed).toBe(false);
    contexts.seal();
    expect(contexts.sealed).toBe(true);
    const items = contexts.of("consumer").items;
    expect(items.get("client")).toBe(VALUE);
    expect(items.has("client")).toBe(true);
    // Only what the module requires (or provides): not the backbone's items, which it does not require.
    expect([...items.keys()]).toEqual(["client"]);
    expect(items.size).toBe(1);
    // The provider sees the items it published; a module requiring none sees nothing.
    expect([...contexts.of("provider").items.keys()]).toEqual(["client"]);
    expect(contexts.of("bystander").items.size).toBe(0);
    expect([...contexts.of("core-block-fetch").items.keys()]).toEqual(["node-client", "ledger-table"]);
    expect([...contexts.of("core-chain").items.keys()]).toEqual(["config", "node-client", "ledger-table", "db"]);
  });

  it("gives a read-only view of the items, a ReadonlyMap the module cannot change", async () => {
    const graph = graphOf([publisher(), consumer({})]);
    const contexts = new ProcessContexts({ graph });
    const items = contexts.of("consumer").items;
    // A view: the same object before and after the seal, empty before it.
    expect(items.size).toBe(0);
    expect(items.get("client")).toBeUndefined();
    expect(items.has("client")).toBe(false);
    await setUp(contexts, graph);
    contexts.seal();
    expect(contexts.of("consumer").items).toBe(items);
    expect([...items]).toEqual([["client", VALUE]]);
    expect([...items.entries()]).toEqual([["client", VALUE]]);
    expect([...items.values()]).toEqual([VALUE]);
    const visited: unknown[] = [];
    const self = {};
    items.forEach(function (this: unknown, value, key, map) {
      visited.push([value, key, map === items, this === self]);
    }, self);
    expect(visited).toEqual([[VALUE, "client", true, true]]);
    expect(items.get("db")).toBeUndefined();
    expect(String(items)).toBe("[object ProcessItems]");
    expect("set" in items).toBe(false);
    expect("delete" in items).toBe(false);
    expect("clear" in items).toBe(false);
    expect(Object.isFrozen(items)).toBe(true);
  });

  it("refuses a second publish of an item, failing the on-start-db callback even when the module catches it", async () => {
    for (const caught of [false, true]) {
      const graph = graphOf([
        provider({
          async "on-start-db"(p) {
            p.publish("client", VALUE);
            try {
              p.publish("client", "again");
            } catch (error) {
              if (!caught) throw error;
            }
          },
        }),
        consumer({}),
      ]);
      const contexts = new ProcessContexts({ graph });
      const error = await rejection(setUp(contexts, graph));
      expect(error).toBeInstanceOf(Error);
      expect((error as Error).message).toBe(
        "provider published the process item client twice: a process item is published once, from its provider's " +
          "on-start-db",
      );
      expect(contexts.refusalOf("provider")).toBe(error);
      expect(contexts.refusalOf("consumer")).toBeUndefined();
    }
  });

  it("refuses an item another provider published: one value per item for the whole process", async () => {
    const other = declaration("other", {
      provides: [CLIENT],
      migrations: [],
      points: {
        async "on-start-db"(p) {
          p.publish("client", "mine");
        },
      },
    });
    const graph = graphOf([publisher(), other], [entry("provider", 1, 9), entry("other", 10)]);
    const contexts = new ProcessContexts({ graph });
    // Startup order: other before provider (by id), so provider's publish is the second.
    const error = await rejection(setUp(contexts, graph));
    expect((error as Error).message).toBe(
      "provider published the process item client, which other published already: a process item is published once, " +
        "from its provider's on-start-db",
    );
  });

  it("refuses an item the module does not declare, or declares without the process lifetime", async () => {
    const cases: [string, ItemDeclaration[]][] = [
      ["unknown", [CLIENT]],
      ["client", [{ name: "client", lifetimes: ["block"] }]],
      ["client", [{ name: "other", lifetimes: ["process"] }]],
    ];
    for (const [item, provides] of cases) {
      const graph = graphOf([
        declaration("lone", {
          provides,
          migrations: [],
          points: {
            async "on-start-db"(p) {
              p.publish(item, 1);
            },
          },
        }),
      ]);
      const contexts = new ProcessContexts({ graph });
      const error = await rejection(setUp(contexts, graph));
      expect((error as Error).message).toBe(
        `lone published the item ${item}, which it does not declare with the process lifetime: a module publishes ` +
          "only the process items it declares",
      );
    }
  });

  it("refuses a publish outside the module's own on-start-db: in another's, and after the seal", async () => {
    let kept: ProcessContext | undefined;
    const graph = graphOf([
      provider({
        async "on-start-db"(p) {
          kept = p;
          p.publish("client", VALUE);
        },
      }),
      consumer({
        async "on-start-db"() {
          (kept as ProcessContext).publish("late", 1);
        },
      }),
    ]);
    const contexts = new ProcessContexts({ graph });
    const error = await rejection(setUp(contexts, graph));
    expect((error as Error).message).toBe(
      "provider published the process item late outside its on-start-db callback: a process item is published once, " +
        "from its provider's on-start-db",
    );
    // The refusal is the provider's, which called publish; the consumer's callback failed with it.
    expect(contexts.refusalOf("provider")).toBe(error);

    const later = graphOf([publisher(), consumer({})]);
    const sealed = new ProcessContexts({ graph: later });
    await setUp(sealed, later);
    sealed.seal();
    expect((thrown(() => sealed.of("provider").publish("late", 1)) as Error).message).toBe(
      "provider published the process item late after startup's on-start-db callbacks ran: a process item is " +
        "published once, from its provider's on-start-db",
    );
  });

  it("refuses at the seal a publish made after its module's on-start-db ended, before any other refusal", async () => {
    let kept: ProcessContext | undefined;
    const graph = graphOf([
      provider({
        async "on-start-db"(p) {
          kept = p;
          p.publish("client", VALUE);
        },
      }),
      consumer({}),
    ]);
    const contexts = new ProcessContexts({ graph });
    await setUp(contexts, graph);
    const late = thrown(() => (kept as ProcessContext).publish("late", 1));
    expect(thrown(() => contexts.seal())).toBe(late);
    expect(contexts.sealed).toBe(false);
    expect(() => contexts.check()).toThrow(late as Error);
  });

  it("refuses startup with process-item-missing when a required process item was not published", async () => {
    const graph = graphOf([provider({}), consumer({}), consumer({}, { id: "also" })]);
    const contexts = new ProcessContexts({ graph });
    await setUp(contexts, graph);
    const error = thrown(() => contexts.seal());
    expect(error).toBeInstanceOf(UmbraError);
    expect((error as UmbraError).code).toBe("process-item-missing");
    expect((error as UmbraError).details).toEqual({ item: "client", modules: ["also", "consumer"], providers: ["provider"] });
    expect((error as UmbraError).message).toBe(
      "the process item client, which also and consumer require, was not published by the on-start-db of its " +
        "provider provider",
    );
    expect(contexts.sealed).toBe(false);
  });

  it("names the first missing item in startup order, and every provider of it", async () => {
    const graph = graphOf([provider({}), consumer({}, { requires: ["late", "client"] })]);
    const contexts = new ProcessContexts({ graph });
    await setUp(contexts, graph);
    const error = thrown(() => contexts.seal()) as UmbraError;
    expect(error.details).toEqual({ item: "late", modules: ["consumer"], providers: ["provider"] });
    // With late published by the first of two providers handing over at 10, client is the one missing; both its
    // providers are named.
    const publishesLate = provider({
      async "on-start-db"(p) {
        p.publish("late", 1);
      },
    });
    const twin = declaration("twin", { provides: [CLIENT, LATE], migrations: [] });
    const next = graphOf(
      [publishesLate, twin, consumer({}, { requires: ["late", "client"] })],
      [entry("provider", 1, 9), entry("twin", 10), entry("consumer", 1)],
    );
    const again = new ProcessContexts({ graph: next });
    await setUp(again, next);
    const missing = thrown(() => again.seal()) as UmbraError;
    expect(missing.details).toEqual({ item: "client", modules: ["consumer"], providers: ["provider", "twin"] });
    expect(missing.message).toBe(
      "the process item client, which consumer requires, was not published by the on-start-db of its providers " +
        "provider and twin",
    );
  });

  it("does not ask for an item no module of this process requires, nor one only ended modules require", () => {
    // Nobody requires late: it may stay unpublished.
    const graph = graphOf([publisher(), consumer({})]);
    const contexts = new ProcessContexts({ graph });
    return setUp(contexts, graph).then(() => {
      expect(() => contexts.seal()).not.toThrow();
      // A consumer whose revisions all ended below the cursor's range runs no point in this process: not counted.
      const ended = graphOf([provider({}), consumer({})], [entry("provider", 1), entry("consumer", 1, 4)], 9n);
      expect(ended.ranges.some((range) => range.order.some((part) => part.id === "consumer"))).toBe(false);
      const quiet = new ProcessContexts({ graph: ended });
      return setUp(quiet, ended).then(() => expect(() => quiet.seal()).not.toThrow());
    });
  });

  it("counts a module stopping at the cursor, which runs again there (RN-11)", async () => {
    const atCursor = graphOf([provider({}), consumer({})], [entry("provider", 1), entry("consumer", 1, 9)], 9n);
    const contexts = new ProcessContexts({ graph: atCursor });
    await setUp(contexts, atCursor);
    expect((thrown(() => contexts.seal()) as UmbraError).code).toBe("process-item-missing");
  });

  it("does not take a required block or table item for a process item", async () => {
    const graph = graphOf([
      declaration("maker", { provides: [{ name: "thing", lifetimes: ["block"] }], migrations: [] }),
      declaration("user", { requires: ["thing"], provides: [], migrations: [] }),
    ]);
    const contexts = new ProcessContexts({ graph });
    await setUp(contexts, graph);
    expect(() => contexts.seal()).not.toThrow();
  });

  it("refuses to seal twice, and gives no on-start-db to a part that registers none", async () => {
    const graph = graphOf([publisher(), consumer({})]);
    const contexts = new ProcessContexts({ graph });
    expect(contexts.startDbPart(graph.modules.find((part) => part.id === "consumer") as ModuleDeclaration).onStartDb).toBe(
      undefined,
    );
    const part = contexts.startDbPart(graph.modules.find((p) => p.id === "provider") as ModuleDeclaration);
    expect(part).toMatchObject({ id: "provider", version: "1.0.0", migrations: [] });
    await setUp(contexts, graph);
    contexts.seal();
    expect(() => contexts.seal()).toThrow(/sealed once/);
  });

  it("calls on-start-db as a method of the module's points, with its context, and passes its error on unchanged", async () => {
    const failure = new Error("setup broke");
    let self: unknown;
    let context: unknown;
    const module = provider({
      async "on-start-db"(this: unknown, p) {
        self = this;
        context = p;
        p.publish("client", VALUE);
        throw failure;
      },
    });
    const graph = graphOf([module, consumer({})]);
    const contexts = new ProcessContexts({ graph });
    const part = contexts.startDbPart(graph.modules.find((p) => p.id === "provider") as ModuleDeclaration);
    await expect(part.onStartDb?.(UNUSED_WRITE)).rejects.toBe(failure);
    expect(self).toBe(module.points);
    expect(context).toBe(contexts.of("provider"));
    // The window closed with the failure: a later publish is refused.
    expect(() => contexts.of("provider").publish("late", 1)).toThrow(/outside its on-start-db/);
  });

  it("reports every refusal to its watchers, and the first one at once to a watcher that comes later", async () => {
    const graph = graphOf([publisher(), consumer({})]);
    const contexts = new ProcessContexts({ graph });
    const heard: [string, string][] = [];
    const listener: MisuseListener = (error, module) => heard.push([module, error.message]);
    contexts.watch(listener);
    expect(() => contexts.check()).not.toThrow();
    const first = thrown(() => contexts.of("provider").publish("client", 1)) as Error;
    const second = thrown(() => contexts.of("consumer").publish("client", 1)) as Error;
    expect(heard).toEqual([
      ["provider", first.message],
      ["consumer", second.message],
    ]);
    const late: [string, Error][] = [];
    contexts.watch((error, module) => late.push([module, error]));
    expect(late).toEqual([["provider", first]]);
    expect(() => contexts.check()).toThrow(first);
    expect(contexts.refusalOf("consumer")).toBe(second);
    // A module's later refusal is reported too, and its first one kept.
    const third = thrown(() => contexts.of("provider").publish("late", 1)) as Error;
    expect(heard.at(-1)).toEqual(["provider", third.message]);
    expect(contexts.refusalOf("provider")).toBe(first);
    // Each watcher hears the first refusal when it starts watching, and nothing once it stopped.
    const counted: string[] = [];
    const stop = contexts.watch((_error, module) => counted.push(module));
    const again = contexts.watch((_error, module) => counted.push(module));
    stop();
    stop();
    thrown(() => contexts.of("consumer").publish("late", 1));
    expect(counted).toEqual(["provider", "provider", "consumer"]);
    again();
    thrown(() => contexts.of("consumer").publish("late", 1));
    expect(counted).toHaveLength(3);
  });
});

// ── process items through the runner's startup and loop, on both backends [A74] ───────────────────────────────────

/** A recorder of what `consumer` sees of `client`, by point, and the contexts it was given. */
function watching(): { readonly seen: [string, unknown][]; readonly contexts: Set<ProcessContext>; readonly module: ModuleDeclaration } {
  const seen: [string, unknown][] = [];
  const contexts = new Set<ProcessContext>();
  const note = (point: PointName, p: ProcessContext, height?: bigint) => {
    contexts.add(p);
    seen.push([height === undefined ? point : `${point}@${height}`, p.items.get("client")]);
  };
  const module = consumer({
    async "on-start-db"(p) {
      note("on-start-db", p);
    },
    async "on-start-api"(p) {
      note("on-start-api", p);
    },
    async "on-finalized"(p, head) {
      note("on-finalized", p, head.height);
    },
    async "on-fetch"(p, b) {
      note("on-fetch", p, b.height);
    },
    async "on-parse"(p, b) {
      note("on-parse", p, b.height);
    },
    async "on-compute"(p, b) {
      note("on-compute", p, b.height);
    },
    async "on-db-write"(p, b) {
      note("on-db-write", p, b.height);
    },
    async "on-after-db-write"(p, b) {
      note("on-after-db-write", p, b.height);
    },
  });
  return { seen, contexts, module };
}

/** A provider that publishes `client` in its `on-start-db` and `late` from `point` (catching the refusal or not). */
function latePublisher(point: "on-compute" | "on-after-db-write" | "on-start-api", caught: boolean): ModuleDeclaration {
  const late = (p: ProcessContext): void => {
    try {
      p.publish("late", "too late");
    } catch (error) {
      if (!caught) throw error;
    }
  };
  return publisher({
    async [point](p: ProcessContext) {
      late(p);
    },
  } as ModuleDeclaration["points"]);
}

/**
 * The process items' oracle, through the runner's startup and loop on `backend`, for contexts of class `Contexts`: the
 * problems found, none for the real contexts. [A74, MD-7]
 */
async function a74Problems(
  database: () => Promise<{ readonly db: Database }>,
  Contexts: ContextsClass = ProcessContexts,
): Promise<string[]> {
  const problems: string[] = [];
  // Visible from on-start-api on, to every callback of the requiring module, through one context.
  {
    const { db } = await database();
    const { seen, contexts, module } = watching();
    const process = await startProcess(db, [publisher(), module], [entry("provider", 1), entry("consumer", 1)], {
      contexts: Contexts,
      listen: null,
    });
    await runLoop(process, new InMemoryBlockSource({ head: 1n }), 1n);
    await process.close();
    const expected: [string, unknown][] = [
      ["on-start-db", undefined],
      ["on-start-api", VALUE],
      ...["on-finalized", "on-fetch", "on-parse", "on-compute", "on-db-write", "on-after-db-write"].map(
        (point): [string, unknown] => [`${point}@1`, VALUE],
      ),
    ];
    if (JSON.stringify(seen) !== JSON.stringify(expected)) problems.push(`visibility: ${JSON.stringify(seen)}`);
    if (contexts.size !== 1) problems.push(`the consumer was given ${contexts.size} contexts`);
  }
  // Published twice in on-start-db: startup fails.
  {
    const { db } = await database();
    const twice = provider({
      async "on-start-db"(p) {
        p.publish("client", VALUE);
        p.publish("client", VALUE);
      },
    });
    const outcome = await startProcess(db, [twice, consumer({})], [entry("provider", 1), entry("consumer", 1)], {
      contexts: Contexts,
      listen: null,
    }).then(
      async (process) => {
        await process.close();
        return "started";
      },
      (error: unknown) => error,
    );
    if (!(outcome instanceof Error && /twice/.test(outcome.message))) problems.push(`twice: ${String(outcome)}`);
  }
  // Published from on-compute: the callback fails, and the height with it.
  {
    const { db } = await database();
    const process = await startProcess(
      db,
      [latePublisher("on-compute", false), consumer({})],
      [entry("provider", 1), entry("consumer", 1)],
      { contexts: Contexts, listen: null },
    );
    const outcome = await runLoop(process, new InMemoryBlockSource({ head: 1n }), 1n).then(
      () => "ran",
      (error: unknown) => error,
    );
    await process.close();
    if (!(outcome instanceof HeightFailure && outcome.point === "on-compute" && outcome.module === "provider")) {
      problems.push(`from on-compute: ${String(outcome)}`);
    }
  }
  // Left unpublished: startup refuses with process-item-missing.
  {
    const { db } = await database();
    const outcome = await startThroughSeal(db, [provider({}), consumer({})], [entry("provider", 1), entry("consumer", 1)], {
      contexts: Contexts,
    }).then(
      () => "sealed",
      (error: unknown) => error,
    );
    if (!(outcome instanceof UmbraError && outcome.code === "process-item-missing")) problems.push(`missing: ${String(outcome)}`);
  }
  return problems;
}

/** A negative control: contexts that let a module publish an item a second time. */
class AllowsTwice extends ProcessContexts {
  protected override publishRefusal(part: ModuleDeclaration, item: string): PublishRefusal | undefined {
    const refusal = super.publishRefusal(part, item);
    return refusal?.reason === "published-twice" ? undefined : refusal;
  }
}

/** A negative control: contexts that let a module publish outside its own on-start-db. */
class AllowsOutside extends ProcessContexts {
  protected override publishRefusal(part: ModuleDeclaration, item: string): PublishRefusal | undefined {
    const refusal = super.publishRefusal(part, item);
    return refusal?.reason === "outside-on-start-db" || refusal?.reason === "after-startup" ? undefined : refusal;
  }
}

describe.each(RUNNER_BACKENDS)("A74: process items through the runner on $name (MD-7)", (backend) => {
  beforeAll(() => backend.start(), 180_000);
  afterAll(() => backend.stop(), 60_000);

  it("passes A74's checks with the real process contexts", async () => {
    expect(await a74Problems(() => backend.database())).toEqual([]);
  }, 120_000);

  it("negative control: contexts that allow a second publish fail A74 (twice)", async () => {
    const problems = await a74Problems(() => backend.database(), AllowsTwice);
    expect(problems).toHaveLength(1);
    expect(problems[0]).toMatch(/^twice: started$/);
  }, 120_000);

  it("negative control: contexts that allow a publish outside on-start-db fail A74 (from on-compute)", async () => {
    const problems = await a74Problems(() => backend.database(), AllowsOutside);
    expect(problems).toHaveLength(1);
    expect(problems[0]).toMatch(/^from on-compute: ran$/);
  }, 120_000);

  it("gives the requiring module the core's process items, db the read-only database (CD-1, A144)", async () => {
    const { db } = await backend.database();
    const { backbone, item } = publishingBackbone(db);
    const got: unknown[] = [];
    const reader = declaration("reader", {
      requires: ["db", "config"],
      provides: [],
      migrations: [],
      points: {
        async "on-start-api"(p) {
          got.push(p.items.get("db"), p.items.get("config"), [...p.items.keys()]);
          // Outside its read's job, the item reads the committed height (none yet).
          got.push(await (p.items.get("db") as typeof item).read(async (read) => read.height));
        },
      },
    });
    const process = await startProcess(db, [reader], [entry("reader", 1)], { backbone, listen: null });
    await process.close();
    expect(got).toEqual([item, STAND_INS.config, ["config", "db"], null]);
  }, 60_000);

  it("fails startup when on-start-db publishes twice, caught or not, before any on-start-api", async () => {
    for (const caught of [false, true]) {
      const { db } = await backend.database();
      let api = false;
      const twice = provider({
        async "on-start-db"(p) {
          p.publish("client", VALUE);
          try {
            p.publish("client", VALUE);
          } catch (error) {
            if (!caught) throw error;
          }
        },
        async "on-start-api"() {
          api = true;
        },
      });
      const error = await rejection(startProcess(db, [twice, consumer({})], [entry("provider", 1), entry("consumer", 1)]));
      expect((error as Error).message).toMatch(/^provider published the process item client twice/);
      expect(api).toBe(false);
    }
  }, 60_000);

  it("fails startup when on-start-db publishes an item it does not declare", async () => {
    const { db } = await backend.database();
    const undeclared = provider({
      async "on-start-db"(p) {
        p.publish("client", VALUE);
        p.publish("stranger", VALUE);
      },
    });
    const error = await rejection(startProcess(db, [undeclared, consumer({})], [entry("provider", 1), entry("consumer", 1)]));
    expect((error as Error).message).toMatch(/^provider published the item stranger, which it does not declare/);
  }, 60_000);

  it("fails the height when on-compute publishes, caught or not; nothing of it commits", async () => {
    for (const caught of [false, true]) {
      const { db } = await backend.database();
      const process = await startProcess(
        db,
        [latePublisher("on-compute", caught), consumer({})],
        [entry("provider", 1), entry("consumer", 1)],
        { listen: null },
      );
      const failure = await rejection(runLoop(process, new InMemoryBlockSource({ head: 2n }), 2n));
      await process.close();
      expect(failure).toBeInstanceOf(HeightFailure);
      const { height, point, module, committed } = failure as HeightFailure;
      expect({ height, point, module, committed }).toEqual({
        height: 1n,
        point: "on-compute",
        module: "provider",
        committed: false,
      });
      expect(((failure as HeightFailure).cause as Error).message).toMatch(
        /^provider published the process item late after startup's on-start-db callbacks ran/,
      );
      expect(await cursorOf(db)).toBeNull();
    }
  }, 60_000);

  it("stops after the commit when on-after-db-write publishes and catches the refusal", async () => {
    const { db } = await backend.database();
    const process = await startProcess(
      db,
      [latePublisher("on-after-db-write", true), consumer({})],
      [entry("provider", 1), entry("consumer", 1)],
      { listen: null },
    );
    const failure = (await rejection(runLoop(process, new InMemoryBlockSource({ head: 2n }), 2n))) as HeightFailure;
    await process.close();
    const { height, point, module, committed } = failure;
    expect({ height, point, module, committed }).toEqual({
      height: 1n,
      point: "on-after-db-write",
      module: "provider",
      committed: true,
    });
    expect(await cursorOf(db)).toBe(1n);
  }, 60_000);

  it("fails startup when on-start-api publishes, caught or not", async () => {
    for (const caught of [false, true]) {
      const { db } = await backend.database();
      const failure = await rejection(
        startProcess(db, [latePublisher("on-start-api", caught), consumer({})], [entry("provider", 1), entry("consumer", 1)]),
      );
      expect(failure).toBeInstanceOf(CallbackFailure);
      expect({ point: (failure as CallbackFailure).point, module: (failure as CallbackFailure).module }).toEqual({
        point: "on-start-api",
        module: "provider",
      });
      expect(((failure as CallbackFailure).cause as Error).message).toMatch(/after startup's on-start-db callbacks ran/);
    }
  }, 60_000);

  it("stops the loop for a publish from a timer the module set, naming the module, none of the points", async () => {
    const { db } = await backend.database();
    let kept: ProcessContext | undefined;
    const keeper = publisher({
      async "on-start-api"(p) {
        kept = p;
      },
    });
    const process = await startProcess(db, [keeper, consumer({})], [entry("provider", 1), entry("consumer", 1)], {
      listen: null,
    });
    const source = new InMemoryBlockSource({ head: 1n });
    const controller = new AbortController();
    const running = new FinalizedLoop(processLoopInput(process, source, controller)).run();
    await source.waiting(1n);
    // While the loop waits, a timer of the module publishes: refused, and the loop stops at the next height.
    expect(() => (kept as ProcessContext).publish("late", 1)).toThrow(/after startup/);
    source.finalize(2n);
    const failure = (await rejection(running)) as HeightFailure;
    controller.abort();
    await process.close();
    const { height, point, module, committed } = failure;
    expect({ height, point, module, committed }).toEqual({ height: 2n, point: undefined, module: "provider", committed: false });
    expect(await cursorOf(db)).toBe(1n);
  }, 60_000);

  it("refuses startup with process-item-missing after every on-start-db ran, before any on-start-api", async () => {
    const { db } = await backend.database();
    const ran: string[] = [];
    const silent = provider({
      async "on-start-db"() {
        ran.push("provider on-start-db");
      },
      async "on-start-api"() {
        ran.push("provider on-start-api");
      },
    });
    const last = declaration("zz-last", {
      provides: [],
      migrations: [],
      points: {
        async "on-start-db"() {
          ran.push("zz-last on-start-db");
        },
      },
    });
    const error = await rejection(
      startProcess(db, [silent, consumer({}), last], [entry("provider", 1), entry("consumer", 1), entry("zz-last", 1)]),
    );
    expect(error).toBeInstanceOf(UmbraError);
    expect((error as UmbraError).code).toBe("process-item-missing");
    expect((error as UmbraError).details).toEqual({ item: "client", modules: ["consumer"], providers: ["provider"] });
    expect(ran).toEqual(["provider on-start-db", "zz-last on-start-db"]);
  }, 60_000);
});
