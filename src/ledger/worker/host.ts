/**
 * The ledger worker, from the main thread (`openspec/changes/core-arch/design.md` §5.3; `specs/ledger/spec.md` LG-7,
 * LG-10; decision record Q36, Q49; task 12.3): {@link startLedgerWorker} starts a worker thread running the ledger
 * engine (`./engine.ts`, through `./entry.ts`) and gives a {@link LedgerHost}, whose every call is a message to the
 * thread answered by a message — plain data both ways, structured-cloned: transactions' bytes, block facts and
 * outcomes in, `ParsedTransaction`s, state keys, roots, summaries, outputs and node batches out. Ledger states, parsed
 * native objects and the packages stay in the thread. The main thread never waits on the worker: it awaits its answers,
 * and answers the worker's node requests (`./node-bridge.ts`) from the read handle the request was given. A request
 * given none — a parse at `on-parse`, which has no database handle, whose deploys' addresses serialize nodes a stored
 * state shares — is answered from the read of another request in flight, if one has a read (a node's bytes are its
 * key's, so any read of committed data serves), else from a read of the process's database ({@link
 * LedgerHost.useDatabase}) or, should a request with a read come first, from that one's: on PGlite, whose one queue
 * `core-ledger-state`'s `on-compute` read holds while its apply waits behind the parse in the worker, a read of the
 * database would wait for ever; the apply's read is open and answers instead.
 *
 * **A step's time** is not bounded: a ledger step may take minutes (the v8 → v9 conversion, a large state's load), and
 * nothing cuts a height off for being slow (RN-17, Q71). It is reported: {@link LedgerHost.activity} names the step in
 * progress — its kind, its block's height, how long it has run (from when it began: a request sent behind others waits
 * for them in the worker) —, plain data for the process's status, while the heartbeat and the admin endpoints keep
 * running on their own threads.
 *
 * **A failure of the thread** — it ends, an uncaught error, or the package trapping (a WebAssembly `RuntimeError`,
 * after which the module's memory is in no known state, so the thread is ended) — fails the request in progress and
 * every later one with one {@link LedgerWorkerFailure}, which {@link LedgerHost.failure} keeps: the module whose
 * callback awaited it fails, and processing halts with `callback-error` naming the module and the point (RN-8,
 * `design.md` §11). A failed request that is no trap (a block the engine refuses, a package that will not load) fails
 * that request only.
 *
 * **The thread's entry** ({@link ledgerWorkerEntry}): beside a build, the compiled `entry.js`; from the TypeScript
 * sources (development, the tests), `entry.ts` through Node.js's type stripping, with a resolve hook mapping the
 * sources' `.js` imports to their `.ts` files, as the admin worker's (`src/admin/server.ts`). The worker imports its
 * adapters from `../load.ts` unless {@link LedgerWorkerOptions.loader} names a test package's loader.
 *
 * {@link inThreadLedger} is the same interface over an engine on the main thread: a negative control's (A101: ledger
 * work moved to the main thread) and the tests'. It cannot read stored nodes, which would block the thread that owns
 * the database.
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
  /** Block `block`'s transactions parsed once with `ledger` and kept for its apply (LG-7). */
  parse(ledger: LedgerName, block: BlockId, transactions: readonly Uint8Array[]): Promise<readonly ParsedTransaction[]>;
  /** The root of a genesis state (IN-7): it reads no stored node (at block 0 no node is stored yet). */
  genesisRoot(ledger: LedgerName, bytes: Uint8Array): Promise<Uint8Array>;
  /** Block 0 (IN-7); stored nodes, if any are needed, read through `read`. */
  genesis(input: GenesisBlock, read?: NodeReader): Promise<AppliedState>;
  /** A block after 0 (LG-8); stored nodes read through `read`. */
  apply(input: ApplyBlock, read?: NodeReader): Promise<AppliedState>;
  /** `block` committed: its state becomes the committed one (false when it was not pending). */
  commit(block: BlockId): Promise<boolean>;
  /** Drops kept parses: of heights up to `upTo`, and of the blocks `hashes` names. */
  release(drop: { readonly upTo?: bigint; readonly hashes?: readonly Uint8Array[] }): Promise<number>;
  /**
   * The state the database stores for a block, by its key, as the committed one — read through `read` unless the
   * worker holds it already (LG-11; task 12.4: `core-ledger-state` asks for the state at h − 1 before each apply).
   */
  load(input: LoadState, read?: NodeReader): Promise<LoadedState>;
  /** A retained state's root, the state loaded by its key aside through `read` (LG-12; task 12.4). */
  retained(input: LoadState, read?: NodeReader): Promise<{ readonly stateRoot: Uint8Array }>;
  /**
   * The nodes the sweep deletes, forgotten by the worker's packages (LG-14; task 12.5); rejects when one is in use —
   * with an `EvictionRefused` (`./engine.ts`) once the worker freed what it can.
   */
  evict(keys: readonly Uint8Array[]): Promise<number>;
  /**
   * Ends the worker thread and starts a new one (LG-14, owner decision Q144 B; task 12.5a): the new thread holds no
   * state, so the next block's state at h − 1 is loaded from the database; the parses kept for blocks not released yet
   * are sent to it again (a parse in flight is answered by it), and any other request in flight fails. Rejects for a
   * worker that failed or is closed.
   */
  restart(): Promise<void>;
  /** How many times {@link LedgerHost.restart} started a new thread. */
  readonly restarts: number;
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
   * `loadLedger(ledger, options, loaderData)` and, optionally, `probe()` — a test package's (A92, A101, A106).
   */
  readonly loader?: URL | string;
  /** Plain data given to the loader's `loadLedger`. */
  readonly loaderData?: unknown;
  /** The node-store bridge's first size, in bytes. */
  readonly bridgeBytes?: number;
  /** The thread's entry ({@link ledgerWorkerEntry} unless given). */
  readonly entry?: URL;
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
  const source = new URL("./entry.ts", base);
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
 * The parses a worker keeps, as the main thread sent them (task 12.5a): each parse until a release drops it, as the
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
    const worker = new Worker(entry, { workerData: { memory, loader, loaderData: options.loaderData } });
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
      // the new thread; any other request in flight fails (it ran on the thread that ended).
      const parsing = new Map(inFlight.filter((request) => request.kind === "parse").map((request) => [hexOf((request.request as ParseRequest).block.hash), request]));
      for (const request of parses.kept()) {
        const key = hexOf(request.block.hash);
        post(request, parsing.get(key) ?? { read: null, resolve: () => undefined, reject: () => undefined });
        parsing.delete(key);
      }
      for (const request of parsing.values()) post(request.request, request);
      for (const request of inFlight) {
        if (request.kind !== "parse") request.reject(new Error(`the ledger worker was restarted while its ${request.kind} request ran (LG-14, Q144 B)`));
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
}

/** The ledger worker's interface over an engine on the main thread (see the module comment). */
export function inThreadLedger(options: InThreadLedgerOptions = {}): LedgerHost {
  let engine: LedgerEngine | undefined;
  const engineOf = async (): Promise<LedgerEngine> => {
    if (engine === undefined) {
      const load = options.load ?? (await import("../load.js")).loadLedgerPackage;
      engine = new LedgerEngine({ load });
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
