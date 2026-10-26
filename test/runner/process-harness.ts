import { createServer } from "node:net";
import { readCursor } from "../../src/backbone/core-block-commit/core-block-commit.js";
import type { Database, ReadOnlyDatabase } from "../../src/db/api.js";
import { startDatabase } from "../../src/db/migrate.js";
import { readOnlyDatabase } from "../../src/db/read-only.js";
import type { SchemaPlan } from "../../src/db/roles.js";
import { schemaPlan } from "../../src/modules/adapters.js";
import type { ModuleDeclaration, Revision } from "../../src/modules/declaration.js";
import { type EntryRange, type ResolvedGraph, resolveGraph } from "../../src/modules/graph.js";
import { validateDeclarations } from "../../src/modules/validation.js";
import { type StartedModuleApi, startModuleApi } from "../../src/runner/api-server.js";
import { InMemoryBlockSource } from "../../src/runner/in-memory-source.js";
import { FinalizedLoop, type LoopInput } from "../../src/runner/loop.js";
import { ApiRoutes, type ModuleApi } from "../../src/runner/module-api.js";
import { ProcessContexts } from "../../src/runner/process-context.js";
import { CORE_CHAIN } from "../modules/graph-fixtures.js";
import { LOOP_BACKBONE } from "./loop-harness.js";

/**
 * What the tests of process items and module APIs share (task 5.2a; MD-7, RN-1, RN-15, RN-16, DB-15): a startup as the
 * runner assembles it — the declarations validated, the cursor read, the graph resolved from it, the schema plan, one
 * process context per module (`ProcessContexts`), `startDatabase` with each part's `on-start-db` in its publishing
 * window, the contexts sealed (`process-item-missing`), `on-start-api` and the module API on `listen.api`
 * (`startModuleApi`) — then the finalized loop with the same contexts, until it waits for the in-memory source's head.
 *
 * The test backbone is `loop-harness.ts`'s with a `core-chain` that publishes its four process items in its
 * `on-start-db`, as the real part will (task 10.2): `config`, `node-client` and `ledger-table` as stand-ins, and `db` as
 * the read-only database over the database (CD-1, Q73).
 */

/** The stand-ins `core-chain` publishes for `config`, `node-client` and `ledger-table`. */
export const STAND_INS = Object.freeze({
  config: Object.freeze({ entries: [] }),
  "node-client": Object.freeze({ kind: "test node client" }),
  "ledger-table": Object.freeze({ rows: [] }),
});

/** The test backbone with a `core-chain` that publishes its process items, `db` the read-only database over `db`. */
export function publishingBackbone(db: Database): { readonly backbone: ModuleDeclaration[]; readonly item: ReadOnlyDatabase } {
  const item = readOnlyDatabase(db);
  const chain: ModuleDeclaration = {
    ...CORE_CHAIN,
    points: {
      async "on-start-db"(p) {
        for (const [name, value] of Object.entries(STAND_INS)) p.publish(name, value);
        p.publish("db", item);
      },
    },
  };
  return { backbone: LOOP_BACKBONE.map((part) => (part.id === "core-chain" ? chain : part)), item };
}

/** A class of process contexts (the real one, or a negative control's). */
export type ContextsClass = new (input: ConstructorParameters<typeof ProcessContexts>[0]) => ProcessContexts;

/** How a test starts a process. */
export interface ProcessOptions {
  readonly start?: bigint;
  /** The backbone; default {@link publishingBackbone}'s. */
  readonly backbone?: readonly ModuleDeclaration[];
  /** `listen.api`; default `127.0.0.1:0` (a free port the system picks, above 10000); null for none. */
  readonly listen?: string | null;
  readonly apiReadTimeoutMs?: number;
  readonly revisionsOf?: (id: string) => readonly Revision[];
  readonly contexts?: ContextsClass;
  readonly routes?: ApiRoutes;
  /** The database the module API reads through; default the process's database. */
  readonly apiDb?: Pick<Database, "read">;
  readonly onError?: (error: unknown, where: { readonly module: string; readonly route: string }) => void;
}

/** A process started up to its loop. */
export interface Process {
  readonly db: Database;
  readonly graph: ResolvedGraph;
  readonly plan: SchemaPlan;
  readonly contexts: ProcessContexts;
  readonly started: StartedModuleApi;
  readonly api: ModuleApi;
  /** `http://host:port` of the module API listener; throws when there is none. */
  readonly url: string;
  /** `ws://host:port` of the module API listener; throws when there is none. */
  readonly ws: string;
  close(): Promise<void>;
}

/** The parts of a startup up to `startDatabase` and the seal, without `on-start-api`. */
export interface SealedStart {
  readonly graph: ResolvedGraph;
  readonly plan: SchemaPlan;
  readonly contexts: ProcessContexts;
}

/** Validation, the cursor, the graph, the plan, the contexts, `startDatabase` and the seal (MD-7). */
export async function startThroughSeal(
  db: Database,
  user: readonly ModuleDeclaration[],
  entries: readonly EntryRange[],
  options: ProcessOptions = {},
): Promise<SealedStart> {
  const backbone = options.backbone ?? publishingBackbone(db).backbone;
  const cursor = (await db.read((read) => readCursor(read)))?.height ?? null;
  const graph = resolveGraph({
    declarations: validateDeclarations({ backbone, core: [], user }),
    start: options.start ?? 1n,
    entries,
    developmentOptIn: false,
    cursor,
  });
  const plan = schemaPlan(graph.modules);
  const Contexts = options.contexts ?? ProcessContexts;
  const contexts = new Contexts({ graph, ...(options.revisionsOf === undefined ? {} : { revisionsOf: options.revisionsOf }) });
  await startDatabase(db, {
    plan,
    parts: graph.modules.map((part) => contexts.startDbPart(part)),
    committedVersions: new Map(),
    handles: { height: cursor },
  });
  contexts.seal();
  return { graph, plan, contexts };
}

/** Starts a process on `db` (see the module comment) up to its loop, which {@link runLoop} runs. */
export async function startProcess(
  db: Database,
  user: readonly ModuleDeclaration[],
  entries: readonly EntryRange[],
  options: ProcessOptions = {},
): Promise<Process> {
  const { graph, plan, contexts } = await startThroughSeal(db, user, entries, options);
  const listen = options.listen === undefined ? "127.0.0.1:0" : options.listen;
  const started = await startModuleApi({
    graph,
    contexts,
    db: options.apiDb ?? db,
    ...(listen === null ? {} : { address: listen }),
    apiReadTimeoutMs: options.apiReadTimeoutMs ?? 30_000,
    ...(options.routes === undefined ? {} : { routes: options.routes }),
    ...(options.onError === undefined ? {} : { onError: options.onError }),
  });
  const origin = (scheme: string): string => {
    if (started.server === null) throw new Error("the process has no module API listener");
    if (started.server.port < 10_000) throw new Error(`the module API listens on port ${started.server.port}, below 10000`);
    return `${scheme}://${started.server.host}:${started.server.port}`;
  };
  return {
    db,
    graph,
    plan,
    contexts,
    started,
    api: started.api,
    get url() {
      return origin("http");
    },
    get ws() {
      return origin("ws");
    },
    close: () => started.close(),
  };
}

/** The loop's input over `process` and `source`, stopped by `controller`: the process's contexts and misuse reports. */
export function processLoopInput(
  process: Pick<Process, "db" | "graph" | "plan" | "contexts">,
  source: InMemoryBlockSource,
  controller: AbortController,
): LoopInput {
  return {
    db: process.db,
    graph: process.graph,
    plan: process.plan,
    source,
    contextOf: (id) => process.contexts.of(id),
    misuses: process.contexts,
    signal: controller.signal,
  };
}

/** Runs the loop over `process` and `source` until it waits for a head above `above`; rejects with its failure. */
export async function runLoop(
  process: Pick<Process, "db" | "graph" | "plan" | "contexts">,
  source: InMemoryBlockSource,
  above: bigint,
): Promise<void> {
  const controller = new AbortController();
  const running = new FinalizedLoop(processLoopInput(process, source, controller)).run();
  try {
    await Promise.race([source.waiting(above), running]);
  } finally {
    controller.abort();
  }
  await running;
}

/** What `run` rejects with; fails the test if it resolves. */
export async function rejection(run: Promise<unknown>): Promise<unknown> {
  try {
    await run;
  } catch (error) {
    return error;
  }
  throw new Error("expected a rejection");
}

/** A TCP port from 10000 up that nothing listens on now: one the system gives, checked, then released. */
export async function freePort(): Promise<number> {
  for (;;) {
    const port = await new Promise<number>((resolve, reject) => {
      const server = createServer();
      server.once("error", reject);
      server.listen(0, "127.0.0.1", () => {
        const address = server.address();
        server.close(() => resolve(typeof address === "object" && address !== null ? address.port : 0));
      });
    });
    if (port >= 10_000) return port;
  }
}

export { ApiRoutes, InMemoryBlockSource };
