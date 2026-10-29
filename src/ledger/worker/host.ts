/**
 * The ledger worker, seen from the main thread. {@link startLedgerWorker} starts a worker thread running the ledger
 * engine (`./engine.ts`, through `./entry.ts`) and returns a {@link LedgerHost}. Each of its calls is a message to the
 * thread, answered by a message. Both carry plain data, structured-cloned: transaction bytes, block facts and outcomes
 * go in; `ParsedTransaction`s, state keys, roots, summaries, outputs and node batches come out. Ledger states, parsed
 * native objects and the packages stay in the thread. [LG-7, LG-10, Q36, Q49; design §5.3]
 *
 * The main thread never blocks on the worker: it awaits its answers, and answers the worker's node requests
 * (`./node-bridge.ts`) from the read handle the request was given. Some requests are given none, such as a parse at
 * `on-parse`, which has no database handle but whose deploys' addresses serialize nodes a stored state shares. Such a
 * request is answered from the read of another request in flight, if one has a read: a node's bytes depend only on
 * its key, so any read of committed data serves. Otherwise it is answered from a read of the process's database
 * ({@link LedgerHost.useDatabase}), or from the read of a request that arrives first. This matters on PGlite, which has
 * a single queue: `core-ledger-state`'s `on-compute` read holds it while its apply waits behind the parse in the
 * worker, so a new read of the database would wait for ever; the apply's open read answers instead.
 *
 * **A step's time** is not bounded. A ledger step may take minutes (the v8 → v9 conversion, loading a large state),
 * and nothing cuts a height off for being slow. It is reported instead: {@link LedgerHost.activity} names the step in
 * progress, with its kind, its block's height and how long it has run (counted from when it began, since a request sent
 * behind others waits for them in the worker). This is plain data for the process's status; the heartbeat and the
 * admin endpoints keep running on their own threads. [RN-17, Q71]
 *
 * **A failure of the thread** fails the request in progress and every later one with one {@link LedgerWorkerFailure},
 * which {@link LedgerHost.failure} keeps. Such a failure is the thread ending, an uncaught error, or the package
 * trapping (a WebAssembly `RuntimeError`, after which the module's memory is in no known state, so the thread is
 * ended). The module whose callback awaited the request fails, and processing halts with `callback-error` naming the
 * module and the point. A failed request that is not a trap (a block the engine refuses, a package that will not load)
 * fails that request only. [RN-8; design §11]
 *
 * **The thread's entry** ({@link ledgerWorkerEntry}):
 * - next to a build, the compiled `entry.js`;
 * - from the TypeScript sources (development, the tests), `entry.ts` through Node.js's type stripping, with a resolve
 *   hook that maps the sources' `.js` imports to their `.ts` files, as the admin worker does (`src/admin/server.ts`).
 *   {@link typeScriptEntry} does this for any entry of TypeScript sources, a host's own included.
 *
 * The worker imports its adapters from `../load.ts` unless {@link LedgerWorkerOptions.loader} names a test package's
 * loader. It runs the ledger tasks of the modules its entry gives it (`./run.ts`); UmbraDB's entry (`./entry.ts`)
 * also adds those of {@link LedgerWorkerOptions.modules}.
 *
 * {@link inThreadLedger} is the same interface over an engine on the main thread, for the tests and for a negative
 * control that moves ledger work to the main thread. It cannot read stored nodes, since that would block the thread
 * that owns the database. [A101]
 */

import { existsSync } from "node:fs";
import { Worker } from "node:worker_threads";
import type { LedgerName, ParsedTransaction } from "../types.js";
import {
  type AppliedState,
  type ApplyBlock,
  type BlockId,
  type GenesisBlock,
  LedgerEngine,
  type LedgerLoader,
  type LoadedState,
  type LoadState,
  type LedgerWorkerModule,
  ledgerTasksOf,
  type TaskRun,
} from "./engine.js";
import { BridgeServer, bridgeMemory, type NodeReader } from "./node-bridge.js";
import type { FromLedgerWorker, LedgerRequest, LedgerRequestKind, SerializedError, ToLedgerWorker } from "./protocol.js";


/** The step a ledger worker runs now (see the module comment). */
export interface LedgerActivity {
  readonly kind: LedgerRequestKind;
  /** The height of the block it works on; null for a step of no block (a probe). */
  readonly height: bigint | null;
  /**
   * How long it has run, in milliseconds: since it was sent, or since the worker answered the request before it, if
   * later (the worker runs requests one at a time, in order).
   */
  readonly sinceMs: number;
}

/** What the bridge reads stored nodes through for a request given no read: the process's database. */
export interface NodeDatabase {
  read<T>(body: (read: NodeReader) => Promise<T>): Promise<T>;
}

/** The ledger worker, as the main thread uses it (see the module comment). */
export interface LedgerHost {
  /** The database a request given no read has its stored nodes read from (see the module comment); none unless given. */
  useDatabase(database: NodeDatabase | null): void;
  /** Parses block `block`'s transactions once with `ledger` and keeps them for its apply. [LG-7] */
  parse(ledger: LedgerName, block: BlockId, transactions: readonly Uint8Array[]): Promise<readonly ParsedTransaction[]>;
  /** The root of a genesis state. It reads no stored node: at block 0 no node is stored yet. [IN-7] */
  genesisRoot(ledger: LedgerName, bytes: Uint8Array): Promise<Uint8Array>;
  /** Applies block 0; stored nodes, if any are needed, are read through `read`. [IN-7] */
  genesis(input: GenesisBlock, read?: NodeReader): Promise<AppliedState>;
  /** Applies a block after 0; stored nodes are read through `read`. [LG-8] */
  apply(input: ApplyBlock, read?: NodeReader): Promise<AppliedState>;
  /** `block` committed: its state becomes the committed one (false when it was not pending). */
  commit(block: BlockId): Promise<boolean>;
  /** Drops kept parses: of heights up to `upTo`, and of the blocks `hashes` names. */
  release(drop: { readonly upTo?: bigint; readonly hashes?: readonly Uint8Array[] }): Promise<number>;
  /**
   * Makes the state the database stores for a block, by its key, the committed one. It is read through `read` unless
   * the worker holds it already; `core-ledger-state` asks for the state at h − 1 before each apply. [LG-11]
   */
  load(input: LoadState, read?: NodeReader): Promise<LoadedState>;
  /** A retained state's root: the state is loaded by its key, through `read`, beside the committed one. [LG-12] */
  retained(input: LoadState, read?: NodeReader): Promise<{ readonly stateRoot: Uint8Array }>;
  /**
   * Makes the worker's packages forget the nodes the sweep deletes. Rejects when one is still in use, with an
   * `EvictionRefused` (`./engine.ts`), once the worker has freed what it can. [LG-14]
   */
  evict(keys: readonly Uint8Array[]): Promise<number>;
  /**
   * Ends the worker thread and starts a new one. The new thread holds no state, so the next block's state at h − 1 is
   * loaded from the database. The parses kept for blocks not yet released are sent to it again: a parse in flight is
   * answered by the new thread, and a ledger task's request in flight runs there again. Any other request in flight
   * fails. Rejects for a worker that failed or is closed. [LG-14, Q144 B]
   */
  restart(): Promise<void>;
  /** How many times {@link LedgerHost.restart} started a new thread. */
  readonly restarts: number;
  /**
   * Runs one module's ledger tasks for block `input` and returns their results by task name (`../tasks.ts`). The
   * state's stored nodes, if a `needsState` task reads any, are read through `read`. [LG-17]
   */
  tasks(input: TaskRun, read?: NodeReader): Promise<Readonly<Record<string, unknown>>>;
  /** A test package's loader's `probe()` (plain data), or null without one. */
  probe(): Promise<unknown>;
  /** The step in progress, or null. */
  activity(): LedgerActivity | null;
  /** The node-store bridge's requests answered so far, and the nodes they carried. */
  bridge(): { readonly requests: number; readonly nodes: number };
  /** The failure that ended the worker, or null. */
  readonly failure: LedgerWorkerFailure | null;
  /** Ends the worker; later calls reject. Calling it again returns the same promise. */
  close(): Promise<void>;
}

/** What {@link startLedgerWorker} takes. */
export interface LedgerWorkerOptions {
  /**
   * A module the worker imports its adapters from in place of `src/ledger/load.ts`: one exporting
   * `loadLedger(ledger, options, loaderData)` and, optionally, `probe()`, as a test package's loader does. [A92, A101,
   * A106]
   */
  readonly loader?: URL | string;
  /** Plain data given to the loader's `loadLedger`. */
  readonly loaderData?: unknown;
  /** The node-store bridge's first size, in bytes. */
  readonly bridgeBytes?: number;
  /** The thread's entry ({@link ledgerWorkerEntry} unless given). */
  readonly entry?: URL;
  /**
   * A module whose `modules` export lists the host's user modules, which UmbraDB's entry (`./entry.ts`) imports in the
   * thread for their ledger tasks. For the `umbradb` command it is the configuration file. [LG-17, MD-1, CF-1, Q106]
   */
  readonly modules?: URL | string;
}

/** The failure that ended a ledger worker (see the module comment). */
export class LedgerWorkerFailure extends Error {
  constructor(message: string, options?: ErrorOptions) {
    super(message, options);
    this.name = "LedgerWorkerFailure";
  }
}

/** The thread's entry for the host module at `base` (see the module comment). */
export function ledgerWorkerEntry(base: string = import.meta.url): URL {
  const compiled = new URL("./entry.js", base);
  if (existsSync(compiled)) return compiled;
  return typeScriptEntry(new URL("./entry.ts", base));
}

/**
 * A worker entry running the TypeScript module `source` through Node.js's type stripping, its `.js` imports of `.ts`
 * files resolved (see the module comment): a host's own ledger worker entry from its sources.
 */
export function typeScriptEntry(source: URL): URL {
  const bootstrap = `
import { registerHooks } from "node:module";
registerHooks({
  resolve(specifier, context, nextResolve) {
    try {
      return nextResolve(specifier, context);
    } catch (error) {
      if (/^\\.\\.?\\//.test(specifier) && specifier.endsWith(".js")) return nextResolve(specifier.slice(0, -3) + ".ts", context);
      throw error;
    }
  },
});
await import(${JSON.stringify(source.href)});
`;
  return new URL(`data:text/javascript,${encodeURIComponent(bootstrap)}`);
}

/** An error the worker sent, as an error of this thread (its class kept for the common ones). */
export function errorOf(sent: SerializedError): Error {
  const Class = sent.name === "RangeError" ? RangeError : sent.name === "TypeError" ? TypeError : Error;
  const error = new Class(sent.message);
  if (Class === Error && sent.name !== "Error") error.name = sent.name;
  return error;
}

/** The height a request works on, for {@link LedgerActivity}. */
function heightOf(request: LedgerRequest): bigint | null {
  switch (request.type) {
    case "parse":
    case "commit":
      return request.block.height;
    case "genesis":
    case "apply":
    case "load":
    case "retained":
    case "tasks":
      return request.input.height;
    case "genesis-root":
      return 0n;
    default:
      return null;
  }
}

/** A parse request as sent. */
type ParseRequest = Extract<LedgerRequest, { readonly type: "parse" }>;

const hexOf = (bytes: Uint8Array): string => Array.from(bytes, (byte) => byte.toString(16).padStart(2, "0")).join("");

/**
 * The parses a worker keeps, as the main thread sent them: each parse until a release drops it, as the
 * engine keeps and drops them (`./engine.ts`'s `parse` and `release`, by the block's hash), so that a restarted worker
 * is sent them again.
 */
class SentParses {
  readonly #byHash = new Map<string, ParseRequest>();

  sent(request: LedgerRequest): void {
    if (request.type === "parse") this.#byHash.set(hexOf(request.block.hash), request);
    if (request.type !== "release") return;
    const named = new Set((request.drop.hashes ?? []).map(hexOf));
    for (const [key, parse] of [...this.#byHash]) {
      if (named.has(key) || (request.drop.upTo !== undefined && parse.block.height <= request.drop.upTo)) this.#byHash.delete(key);
    }
  }

  /** The parses kept now, in the order they were sent. */
  kept(): readonly ParseRequest[] {
    return [...this.#byHash.values()];
  }
}

/** A request in flight. */
interface Pending {
  readonly request: LedgerRequest;
  readonly kind: LedgerRequestKind;
  readonly height: bigint | null;
  readonly sent: number;
  readonly read: NodeReader | null;
  resolve(value: unknown): void;
  reject(error: unknown): void;
}

/** A worker thread of a host: a thread, its bridge, and whether the host ended it to start another (`restart`). */
interface Thread {
  readonly worker: Worker;
  readonly bridge: BridgeServer;
  readonly exited: Promise<void>;
  retired: boolean;
}

/** Starts a ledger worker (see the module comment). */
export function startLedgerWorker(options: LedgerWorkerOptions = {}): LedgerHost {
  const loader = options.loader === undefined ? null : new URL(options.loader).href;
  const modules = options.modules === undefined ? null : new URL(options.modules).href;
  const entry = options.entry ?? ledgerWorkerEntry();
  const pending = new Map<number, Pending>();
  const parses = new SentParses();
  let database: NodeDatabase | null = null;
  /** Node requests of requests given no read, waiting for a read (see the module comment). */
  const waiting = new Set<(read: NodeReader) => void>();
  let next = 1;
  /** When the worker last answered a request: the next one in order began then, if it was sent by then. */
  let answeredAt = performance.now();
  let failure: LedgerWorkerFailure | null = null;
  let closed = false;
  let closing: Promise<void> | undefined;
  let restarts = 0;
  /** The bridge requests and nodes of the threads ended by a restart. */
  const before = { requests: 0, nodes: 0 };

  const fail = (error: LedgerWorkerFailure): void => {
    if (failure !== null || closed) return;
    failure = error;
    for (const request of pending.values()) request.reject(error);
    pending.clear();
    void thread.worker.terminate();
  };

  /** A new worker thread, its messages and its end handled while it is the host's (see {@link LedgerHost.restart}). */
  const spawn = (): Thread => {
    const memory = bridgeMemory(options.bridgeBytes);
    const worker = new Worker(entry, { workerData: { memory, loader, loaderData: options.loaderData, modules } });
    const started: Thread = {
      worker,
      bridge: new BridgeServer(memory),
      exited: new Promise<void>((resolve) => worker.once("exit", () => resolve())),
      retired: false,
    };
    worker.on("message", (message: FromLedgerWorker) => {
      if (!started.retired) onMessage(message);
    });
    worker.on("error", (error: Error) => {
      if (!started.retired) fail(new LedgerWorkerFailure(`the ledger worker failed: ${error.message}`, { cause: error }));
    });
    worker.on("exit", (code) => {
      if (!started.retired) fail(new LedgerWorkerFailure(`the ledger worker exited with code ${code}`));
    });
    return started;
  };

  /** Answers the worker's node request for request `id` (see the module comment). */
  const answerNode = (id: number): void => {
    const { bridge } = thread;
    const own = pending.get(id)?.read ?? [...pending.values()].find((request) => request.read !== null)?.read ?? null;
    if (own !== null || database === null) {
      void bridge.answer(own);
      return;
    }
    let answered = false;
    const once = async (read: NodeReader | null): Promise<void> => {
      if (answered) return;
      answered = true;
      waiting.delete(viaRequest);
      await bridge.answer(read);
    };
    const viaRequest = (read: NodeReader): void => void once(read);
    waiting.add(viaRequest);
    database.read((read) => once(read)).catch(() => once(null));
  };

  const onMessage = (message: FromLedgerWorker): void => {
    if (message.type === "node") {
      answerNode(message.id);
      return;
    }
    answeredAt = performance.now();
    const request = pending.get(message.id);
    if (message.ok) {
      pending.delete(message.id);
      request?.resolve(message.value);
    } else if (message.fatal) {
      fail(new LedgerWorkerFailure(`the ledger worker's package failed and its thread ended: ${message.error.name}: ${message.error.message}`));
    } else {
      pending.delete(message.id);
      request?.reject(errorOf(message.error));
    }
  };

  let thread = spawn();

  /** Posts `request` to the current thread under a new number, `entry` its pending record. */
  const post = (request: LedgerRequest, record: Omit<Pending, "request" | "kind" | "height" | "sent">): void => {
    const id = next++;
    pending.set(id, { request, kind: request.type, height: heightOf(request), sent: performance.now(), ...record });
    thread.worker.postMessage({ id, request } satisfies ToLedgerWorker);
  };

  const send = <T>(request: LedgerRequest, read?: NodeReader): Promise<T> => {
    if (failure !== null) return Promise.reject(failure);
    if (closed) return Promise.reject(new Error("the ledger worker is closed"));
    parses.sent(request);
    return new Promise<T>((resolve, reject) => {
      post(request, { read: read ?? null, resolve: resolve as (value: unknown) => void, reject });
      if (read !== undefined) for (const waiter of [...waiting]) waiter(read);
    });
  };

  return {
    useDatabase(given) {
      database = given;
    },
    parse: (ledger, block, transactions) => send({ type: "parse", ledger, block, transactions: [...transactions] }),
    genesisRoot: (ledger, bytes) => send({ type: "genesis-root", ledger, bytes }),
    genesis: (input, read) => send({ type: "genesis", input }, read),
    apply: (input, read) => send({ type: "apply", input }, read),
    commit: (block) => send({ type: "commit", block }),
    release: (drop) => send({ type: "release", drop }),
    load: (input, read) => send({ type: "load", input }, read),
    retained: (input, read) => send({ type: "retained", input }, read),
    evict: (keys) => send({ type: "evict", keys: [...keys] }),
    tasks: (input, read) => send({ type: "tasks", input }, read),
    probe: () => send({ type: "probe" }),
    async restart() {
      if (failure !== null) throw failure;
      if (closed) throw new Error("the ledger worker is closed");
      const old = thread;
      old.retired = true;
      before.requests += old.bridge.stats.requests;
      before.nodes += old.bridge.stats.nodes;
      const inFlight = [...pending.values()];
      pending.clear();
      thread = spawn();
      restarts += 1;
      answeredAt = performance.now();
      // The parses kept for blocks not released yet, sent again in their order, a parse still in flight answered by
      // the new thread; any other request in flight but a ledger task's fails (it ran on the thread that ended).
      const parsing = new Map(inFlight.filter((request) => request.kind === "parse").map((request) => [hexOf((request.request as ParseRequest).block.hash), request]));
      for (const request of parses.kept()) {
        const key = hexOf(request.block.hash);
        post(request, parsing.get(key) ?? { read: null, resolve: () => undefined, reject: () => undefined });
        parsing.delete(key);
      }
      for (const request of parsing.values()) post(request.request, request);
      // A ledger task's request in flight — another block's, run at its module's `on-parse` while this one computed —
      // runs again there, on the parse sent again: a task keeps nothing between requests (one that needs the state
      // fails there, as the new thread holds none).
      for (const request of inFlight) if (request.kind === "tasks") post(request.request, request);
      for (const request of inFlight) {
        if (request.kind !== "parse" && request.kind !== "tasks") {
          request.reject(new Error(`the ledger worker was restarted while its ${request.kind} request ran`));
        }
      }
      await old.worker.terminate();
      await old.exited;
    },
    get restarts() {
      return restarts;
    },
    activity() {
      const [first] = pending.values();
      if (first === undefined) return null;
      const began = Math.max(first.sent, answeredAt);
      return Object.freeze({ kind: first.kind, height: first.height, sinceMs: performance.now() - began });
    },
    bridge: () => ({ requests: before.requests + thread.bridge.stats.requests, nodes: before.nodes + thread.bridge.stats.nodes }),
    get failure() {
      return failure;
    },
    close() {
      closing ??= (async () => {
        const wasFailed = failure !== null;
        closed = true;
        for (const request of pending.values()) request.reject(new Error("the ledger worker is closed"));
        pending.clear();
        if (!wasFailed) await thread.worker.terminate();
        await thread.exited;
      })();
      return closing;
    },
  };
}

/** What {@link inThreadLedger} takes. */
export interface InThreadLedgerOptions {
  /** What loads an adapter: `loadLedgerPackage` unless given. */
  readonly load?: LedgerLoader;
  /** The modules whose ledger tasks the engine runs; none unless given. */
  readonly modules?: readonly LedgerWorkerModule[];
  /** The engine's plain-data check (`EngineOptions.checkPlainData`); on unless a negative control turns it off. */
  readonly checkPlainData?: boolean;
}

/** The ledger worker's interface over an engine on the main thread (see the module comment). */
export function inThreadLedger(options: InThreadLedgerOptions = {}): LedgerHost {
  let engine: LedgerEngine | undefined;
  const engineOf = async (): Promise<LedgerEngine> => {
    if (engine === undefined) {
      const load = options.load ?? (await import("../load.js")).loadLedgerPackage;
      engine = new LedgerEngine({
        load,
        tasks: ledgerTasksOf(options.modules ?? []),
        ...(options.checkPlainData === undefined ? {} : { checkPlainData: options.checkPlainData }),
      });
    }
    return engine;
  };
  const parses = new SentParses();
  let chain: Promise<unknown> = Promise.resolve();
  let closed = false;
  let restarts = 0;
  let current: { kind: LedgerRequestKind; height: bigint | null; sent: number } | null = null;
  const run = <T>(request: LedgerRequest, work: (engine: LedgerEngine) => Promise<T> | T): Promise<T> => {
    if (closed) return Promise.reject(new Error("the ledger worker is closed"));
    parses.sent(request);
    const result = chain.then(async () => {
      current = { kind: request.type, height: heightOf(request), sent: performance.now() };
      try {
        return await work(await engineOf());
      } finally {
        current = null;
      }
    });
    chain = result.catch(() => undefined);
    return result;
  };
  const parse = (request: ParseRequest) => run(request, (e) => e.parse(request.ledger, request.block, request.transactions));
  return {
    useDatabase: () => undefined,
    parse: (ledger, block, transactions) => parse({ type: "parse", ledger, block, transactions: [...transactions] }),
    genesisRoot: (ledger, bytes) => run({ type: "genesis-root", ledger, bytes }, (e) => e.genesisRoot(ledger, bytes)),
    genesis: (input) => run({ type: "genesis", input }, (e) => e.genesis(input)),
    apply: (input) => run({ type: "apply", input }, (e) => e.apply(input)),
    commit: (block) => run({ type: "commit", block }, (e) => e.commit(block)),
    release: (drop) => run({ type: "release", drop }, (e) => e.release(drop)),
    load: (input) => run({ type: "load", input }, (e) => e.load(input)),
    retained: (input) => run({ type: "retained", input }, (e) => e.retained(input)),
    evict: (keys) => run({ type: "evict", keys: [...keys] }, (e) => e.evict(keys)),
    tasks: (input) => run({ type: "tasks", input }, (e) => e.tasks(input)),
    probe: () => run({ type: "probe" }, () => null),
    async restart() {
      if (closed) throw new Error("the ledger worker is closed");
      // A new engine (the old one, its states and parses, dropped), sent the kept parses again (see `startLedgerWorker`).
      await chain;
      engine = undefined;
      restarts += 1;
      for (const request of parses.kept()) parse(request).catch(() => undefined);
    },
    get restarts() {
      return restarts;
    },
    activity: () => (current === null ? null : Object.freeze({ kind: current.kind, height: current.height, sinceMs: performance.now() - current.sent })),
    bridge: () => ({ requests: 0, nodes: 0 }),
    failure: null,
    async close() {
      closed = true;
      await chain;
    },
  };
}
