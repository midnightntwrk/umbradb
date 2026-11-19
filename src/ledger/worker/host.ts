/**
 * The ledger worker, seen from the main thread. {@link startLedgerWorker} starts a worker thread running the ledger
 * engine (`./engine.ts`, through `./entry.ts`) and returns a {@link LedgerHost}. Each of its calls is a message to the
 * thread, answered by a message. Both carry plain data, structured-cloned: transaction bytes, block facts and outcomes
 * go in; `ParsedTransaction`s, state keys, roots, summaries, outputs and node batches come out. Ledger states, parsed
 * native objects and the packages stay in the thread.
 *
 * The main thread never blocks on the worker: it awaits its answers, and answers the worker's node requests
 * (`./node-bridge.ts`) from the read handle the request was given. Some requests are given none, such as a parse at
 * `on-parse`, which has no database handle but whose deploys' addresses serialize nodes a stored state shares. Such a
 * request is answered from a read lent for it (below), else from the read of another request in flight, if one has a
 * read, else from a read of the process's database ({@link LedgerHost.useDatabase}), or from a read that is lent or
 * that a request brings first. On PGlite, which has a single queue, `core-ledger-state`'s `on-compute` read holds it
 * while its apply waits behind the parse in the worker, so a new read of the database would wait for ever; the apply's
 * open read answers instead.
 *
 * A caller that awaits a request given no read while it holds an open read lends that read ({@link LedgerHost.lend}):
 * it answers the node requests of every request given none, those already waiting for a read too, until it is taken
 * back. `core-ledger-state` lends its block transaction's handle while it awaits its eviction: a request sent before
 * the eviction and given no read (a later block's parse at `on-parse`) may wait in the worker for a stored node, and on
 * PGlite a read of the database waits behind that open transaction. It sends the apply of the next block, marked ahead
 * (`ApplyBlock.ahead`), with no read, since it outlives the callback that sends it; that block's `on-compute` lends
 * its read while it awaits the result.
 *
 * **The reads that serve a block applied ahead.** The apply of block n marked ahead runs on the pending state after
 * n − 1, whose batch the worker serves itself, so every other node it reads was stored by a block up to n − 2 and is
 * not deleted before n settles. A read that sees the committed height n − 2 or a later one holds each of them; an older
 * one may lack a node written since, and a missing node inside the package can pass for a transaction that failed. So a
 * node request of an apply ahead is answered only through: a read lent while it runs (the block transaction's handle of
 * n − 1, then n's `on-compute` read); the read of another request in flight that reports a committed height
 * (`NodeReader.height`) of n − 2 or more; or a read of the process's database, opened for that request, which sees
 * the height committed then, n − 2 or n − 1. It is never answered through an older read or one that reports no height,
 * and while it waits for the database's read it takes a lent read or such a request's read that comes first. On PGlite
 * every read open while an apply ahead runs is the queue's current job, which began after the transaction of n − 1
 * ended, so it sees n − 2 or n − 1, and a request it brings answers the node request that waits behind it for the
 * queue. On PostgreSQL the process gives a read that does not wait for the reader pool (`src/db/postgres.ts`), so the
 * node request is answered while every pooled reader is held by reads whose own requests wait behind the apply ahead.
 *
 * **A step's time** is not bounded. A ledger step may take minutes (the v8 → v9 conversion, loading a large state),
 * and nothing cuts a height off for being slow. It is reported instead: {@link LedgerHost.activity} names the step in
 * progress, with its kind, its block's height and how long it has run (counted from when it began, since a request sent
 * behind others waits for them in the worker). This is plain data for the process's status; the heartbeat and the
 * admin endpoints keep running on their own threads.
 *
 * **A failure of the thread** fails the request in progress and every later one with one {@link LedgerWorkerFailure},
 * which {@link LedgerHost.failure} keeps. Such a failure is the thread ending, an uncaught error, or the package
 * trapping (a WebAssembly `RuntimeError`, after which the module's memory is in no known state, so the thread is
 * ended). The module whose callback awaited the request fails, and processing halts with `callback-error` naming the
 * module and the point. A failed request that is not a trap (a block the engine refuses, a package that will not load)
 * fails that request only.
 *
 * **A trap in an apply marked ahead** (`ApplyBlock.ahead`) ends that thread only, and the host does not fail: the block
 * is judged at its own turn, as a run without blocks applied ahead judges it. A new thread takes the old one's place,
 * as at {@link LedgerHost.restart}, and is sent again, in their order, the parses kept and every request sent after the
 * trapped one (the old thread ran none of them: it answers in order and runs nothing after a trap), but the applies
 * marked ahead, which fail, as the trapped one does. `core-ledger-state` then drops the result applied ahead (the
 * thread that applied it ended) and applies the block at its turn in the new thread: a block whose own apply traps
 * there fails the host at its height. An apply that the engine refuses with `ApplyNeedsNewThread` (`./engine.ts`)
 * fails that request only, like any failure that is not a trap: the caller restarts the thread.
 *
 * **What became of each block's transaction** ({@link LedgerHost.written}, {@link LedgerHost.committed},
 * {@link LedgerHost.rolledBack}). The engine (`src/runner/loop.ts`) tells the host, as facts, what happened to the
 * transaction that holds each block, and the host alone decides what the thread is sent:
 * - `committed(h)`: the `COMMIT` that holds h answered, or the cursor read after a lost answer found h committed. When
 *   the host sent the thread an apply or the genesis of h (`core-ledger-state` applies every block it is active at), it
 *   sends the commit of h, so that the state after h becomes the committed one (h + 1, if applied ahead on h's pending
 *   state before, stays pending on it); then, always, the release of the parses kept up to h. So a block nothing
 *   applied (a height where `core-block-parsed` runs and `core-ledger-state` does not, or the cursor's block
 *   re-delivered after a restart) gets the release alone. Neither is awaited: the thread answers in order, so a later
 *   request (h + 1's load and its apply at its turn) finds h committed, and a thread that failed fails it.
 * - `written(h)`: h's rows are in the open transaction. `rolledBack(h)`: h will not be committed by the transaction it
 *   was processed for, which ended without committing, or h's run ended before it was written. Neither sends anything:
 *   the host keeps the blocks written in the open transaction and not yet committed, which a commit or a rollback ends.
 *
 * The host's record of the facts ({@link followedRecord}) is bounded by the transactions not yet committed: a block
 * applied (its apply or genesis sent) stays until a block at or above it is committed, through `committed` or a
 * caller's own {@link LedgerHost.commit} that answered (the per-block reference runs of the tests commit directly); it
 * stays across a rollback, since the block is made again, and across a restart of the thread, since the record is the
 * host's. A block written stays until it is committed or its transaction rolls back.
 *
 * After a `COMMIT` whose answer was lost the host is told nothing until the engine's cursor read says what became of
 * it. A block made again after a rollback is applied on the same committed state, and the pending state the thread kept
 * serves it (`./engine.ts`).
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
 * **In a traced process** (`src/trace/trace.ts`; nothing of this otherwise, and the messages are then as without it)
 * a request is posted with the clock both threads share (`at`, `./protocol.ts`), and the height being processed when a
 * message of the worker is handled gets, in ms:
 * - `rt.<type>`: each request's round trip, from its post to its answer handled, summed by the request's type, and
 *   `rtN.<type>`, how many answers;
 * - `backMs`: from the worker posting an answer to this thread handling it, which is the answer's way back and the
 *   time this thread was busy with something else;
 * - `nodeNoticeMs`: the same for the worker's node requests, during which the worker is blocked; `nodeReadMs`: from
 *   handling a node request to waking the worker (the wait for a read where none was open, the statements, the
 *   answer written); `nodeReads`: how many.
 *
 * {@link inThreadLedger} is the same interface over an engine on the main thread, for the tests and for a negative
 * control that moves ledger work to the main thread. It cannot read stored nodes, since that would block the thread
 * that owns the database.
 */

import { existsSync } from "node:fs";
import { Worker } from "node:worker_threads";
import { drainWorkerOutput, type WorkerOutput, workerStreams } from "../../runner/worker-output.js";
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
import { traceAdd, traceWorker, tracing } from "../../trace/trace.js";
import { traceClock } from "../../trace/worker-trace.js";


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
  /**
   * Lends `read` to the requests given none (see the module comment), those already waiting for a read included, until
   * the returned function is called. That function resolves once no node request is still answered through `read`, so
   * the caller awaits it before its read ends. One read is lent at a time: a second replaces the first until it is
   * taken back.
   */
  lend(read: NodeReader): () => Promise<void>;
  /** Parses block `block`'s transactions once with `ledger` and keeps them for its apply. */
  parse(ledger: LedgerName, block: BlockId, transactions: readonly Uint8Array[]): Promise<readonly ParsedTransaction[]>;
  /** The root of a genesis state. It reads no stored node: at block 0 no node is stored yet. */
  genesisRoot(ledger: LedgerName, bytes: Uint8Array): Promise<Uint8Array>;
  /** Applies block 0; stored nodes, if any are needed, are read through `read`. */
  genesis(input: GenesisBlock, read?: NodeReader): Promise<AppliedState>;
  /** Applies a block after 0; stored nodes are read through `read`. */
  apply(input: ApplyBlock, read?: NodeReader): Promise<AppliedState>;
  /**
   * `block` committed: its state becomes the committed one (false when it was not pending). The host sends it itself at
   * {@link LedgerHost.committed}.
   */
  commit(block: BlockId): Promise<boolean>;
  /** Drops kept parses: of heights up to `upTo`, and of the blocks `hashes` names. */
  release(drop: { readonly upTo?: bigint; readonly hashes?: readonly Uint8Array[] }): Promise<number>;
  /**
   * `block`'s rows are in the open transaction: its `on-db-write` and `on-settle` callbacks and the cursor check ended
   * (see the module comment). Nothing is sent.
   */
  written(block: BlockId): void;
  /**
   * The `COMMIT` that holds `block` answered, or the cursor read after a lost answer found it committed: the block's
   * commit is sent when an apply or the genesis of it was, then the release of the parses kept up to its height,
   * neither awaited (see the module comment).
   */
  committed(block: BlockId): void;
  /**
   * `block` will not be committed by the transaction it was processed for: that transaction ended without committing,
   * or the block's run ended before it was written (see the module comment). Nothing is sent.
   */
  rolledBack(block: BlockId): void;
  /**
   * Makes the state the database stores for a block, by its key, the committed one. It is read through `read` unless
   * the worker holds it already; `core-ledger-state` asks for the state at h − 1 before each apply.
   */
  load(input: LoadState, read?: NodeReader): Promise<LoadedState>;
  /** A retained state's root: the state is loaded by its key, through `read`, beside the committed one. */
  retained(input: LoadState, read?: NodeReader): Promise<{ readonly stateRoot: Uint8Array }>;
  /**
   * Makes the worker's packages forget the nodes reclamation deletes. Rejects when one is still in use, with an
   * `EvictionRefused` (`./engine.ts`), once the worker has freed what it can.
   */
  evict(keys: readonly Uint8Array[]): Promise<number>;
  /**
   * Ends the worker thread and starts a new one. The new thread holds no state, so the next block's state at h − 1 is
   * loaded from the database. The parses kept for blocks not yet released are sent to it again: a parse in flight is
   * answered by the new thread, and a ledger task's request in flight runs there again. Any other request in flight
   * fails. Rejects for a worker that failed or is closed.
   */
  restart(): Promise<void>;
  /** How many times a new thread took the old one's place: at {@link LedgerHost.restart}, or after a trap ahead. */
  readonly restarts: number;
  /**
   * Runs one module's ledger tasks for block `input` and returns their results by task name (`../tasks.ts`). The
   * state's stored nodes, if a `needsState` task reads any, are read through `read`.
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
   * `loadLedger(ledger, options, loaderData)` and, optionally, `probe()`, as a test package's loader does.
   */
  readonly loader?: URL | string;
  /** Plain data given to the loader's `loadLedger`. */
  readonly loaderData?: unknown;
  /** The node-store bridge's first size, in bytes. */
  readonly bridgeBytes?: number;
  /** The thread's entry ({@link ledgerWorkerEntry} unless given). */
  readonly entry?: URL;
  /**
   * Whether a node request of a block applied ahead is answered only through a read that sees the block before its
   * parent or a later one (see the module comment); true (false: a negative control's, which answers it through the
   * read of any request in flight).
   */
  readonly aheadReadsCurrent?: boolean;
  /**
   * A module whose `modules` export lists the host's user modules, which UmbraDB's entry (`./entry.ts`) imports in the
   * thread for their ledger tasks. For the `umbradb` command it is the configuration file.
   */
  readonly modules?: URL | string;
  /**
   * Where the thread's standard output and standard error go (`../../runner/worker-output.ts`): inherited from the
   * process unless given, as Node.js does; the engine gives its log, or `"inherit"` for `umbradb run`. A restarted
   * thread's go to the same place.
   */
  readonly output?: WorkerOutput;
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

/** Whether `request` applies a block ahead (`ApplyBlock.ahead`). */
const isAhead = (request: LedgerRequest): boolean => request.type === "apply" && request.input.ahead === true;

/**
 * Whether `read` holds every stored node the apply of block `height` marked ahead reads (see the module comment): it
 * reports a committed height of `height` − 2 or more.
 */
const servesAhead = (read: NodeReader, height: bigint): boolean => typeof read.height === "bigint" && read.height >= height - 2n;

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

/** The requests a host's facts send: the host's own commit and release. */
interface CommitRequests {
  commit(block: BlockId): Promise<boolean>;
  release(drop: { readonly upTo: bigint }): Promise<number>;
}

/** A host's facts of each block's transaction, told of every request the host sends ({@link transactionFacts}). */
interface TransactionFacts extends Pick<LedgerHost, "written" | "committed" | "rolledBack"> {
  /** `request` was sent to the thread. */
  sent(request: LedgerRequest): void;
  /** What the facts keep now ({@link followedRecord}). */
  record(): FollowedRecord;
  /** A caller's own commit of `block` answered: it and every block below it are committed. */
  directlyCommitted(block: BlockId): void;
}

/**
 * What a host keeps of the facts (see the module comment): the blocks an apply or the genesis of which was sent and
 * that are not committed yet, and the blocks written in the open transaction and not committed yet, each in height
 * order. Each list holds the blocks of the transactions not yet committed, so it stays small.
 */
export interface FollowedRecord {
  readonly applied: readonly BlockId[];
  readonly written: readonly BlockId[];
}

/** The facts of each host this module made, for {@link followedRecord}. */
const FACTS = new WeakMap<LedgerHost, TransactionFacts>();

/** What `host` keeps of the facts, if this module made it (a wrapper of a host keeps none of its own). */
export function followedRecord(host: LedgerHost): FollowedRecord | undefined {
  return FACTS.get(host)?.record();
}

/**
 * A host's facts of each block's transaction, over its own requests (see the module comment): `committed` sends the
 * block's commit when an apply or the genesis of the block was sent, then the release up to its height, neither
 * awaited, a rejection dropped (a thread that failed fails the next block's apply); `written` and `rolledBack` keep
 * what the open transaction holds and send nothing.
 */
function transactionFacts(requests: CommitRequests): TransactionFacts {
  /** The blocks an apply or the genesis of which was sent and that are not committed yet, by hash. */
  const applied = new Map<string, BlockId>();
  /** The blocks written in the open transaction and not yet committed. */
  let open: BlockId[] = [];
  return {
    sent(request) {
      if (request.type !== "genesis" && request.type !== "apply") return;
      applied.set(hexOf(request.input.hash), Object.freeze({ height: request.input.height, hash: request.input.hash }));
    },
    written(block) {
      open.push(Object.freeze({ height: block.height, hash: block.hash }));
    },
    committed(block) {
      open = open.filter((written) => written.height > block.height);
      const wasApplied = applied.get(hexOf(block.hash))?.height === block.height;
      for (const [key, sent] of [...applied]) if (sent.height <= block.height) applied.delete(key);
      if (wasApplied) void requests.commit({ height: block.height, hash: block.hash }).catch(() => undefined);
      void requests.release({ upTo: block.height }).catch(() => undefined);
    },
    rolledBack() {
      open = [];
    },
    directlyCommitted(block) {
      for (const [key, sent] of [...applied]) if (sent.height <= block.height) applied.delete(key);
    },
    record() {
      const byHeight = (a: BlockId, b: BlockId): number => (a.height < b.height ? -1 : a.height > b.height ? 1 : 0);
      return Object.freeze({ applied: Object.freeze([...applied.values()].sort(byHeight)), written: Object.freeze([...open]) });
    },
  };
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
  // The host's facts of each block's transaction, over its own commit and release (made below).
  const facts = transactionFacts({ commit: (block) => commit(block), release: (drop) => release(drop) });
  let database: NodeDatabase | null = null;
  /**
   * Node requests of requests given no read, waiting for a read (see the module comment): each is offered a read that
   * is lent (`lent` true) or that a request brings, and takes it when it may be answered through it.
   */
  const waiting = new Set<(read: NodeReader, lent: boolean) => void>();
  const aheadReadsCurrent = options.aheadReadsCurrent !== false;
  /** The reads lent to the requests given none ({@link LedgerHost.lend}), the last one first to answer. */
  const lent: NodeReader[] = [];
  /** The node requests being answered through each lent read. */
  const answering = new Map<NodeReader, Set<Promise<void>>>();
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
    const output = options.output ?? "inherit";
    const worker = new Worker(entry, {
      // `trace`: whether this process is traced (`src/trace/trace.ts`), so the thread posts its applies' entries.
      workerData: { memory, loader, loaderData: options.loaderData, modules, trace: tracing() },
      ...workerStreams(output),
    });
    drainWorkerOutput(worker, "ledger worker", output);
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

  /**
   * Answers a node request through `read`; in a traced process `from` is when the node request was handled, and the
   * time from then to the worker woken is recorded (null otherwise: nothing is).
   */
  const answerTimed = (bridge: BridgeServer, read: NodeReader | null, from: number | null): Promise<void> => {
    const answer = bridge.answer(read);
    // A lent read is not taken back while it answers a node request.
    const running = read === null ? undefined : answering.get(read);
    if (running !== undefined) {
      running.add(answer);
      void answer.then(
        () => running.delete(answer),
        () => running.delete(answer),
      );
    }
    if (from === null) return answer;
    return answer.then(() => {
      traceAdd("nodeReadMs", performance.now() - from);
      traceAdd("nodeReads", 1);
    });
  };

  /**
   * Answers the worker's node request for request `id` (see the module comment). In a traced process `at` is when the
   * worker posted it, and the times of the module comment are recorded.
   */
  const answerNode = (id: number, at: number | undefined): void => {
    const { bridge } = thread;
    const from = tracing() ? performance.now() : null;
    if (from !== null && at !== undefined) traceAdd("nodeNoticeMs", traceClock() - at);
    const request = pending.get(id);
    // The block a node request of an apply ahead is for: only a read that sees the block before its parent serves it.
    const ahead = aheadReadsCurrent && request !== undefined && isAhead(request.request) ? request.height : null;
    const serves = (read: NodeReader): boolean => ahead === null || servesAhead(read, ahead);
    const own = request?.read ?? lent.at(-1) ?? [...pending.values()].find((other) => other.read !== null && serves(other.read))?.read ?? null;
    if (own !== null || database === null) {
      void answerTimed(bridge, own, from);
      return;
    }
    let answered = false;
    const once = async (read: NodeReader | null): Promise<void> => {
      if (answered) return;
      answered = true;
      waiting.delete(offered);
      await answerTimed(bridge, read, from);
    };
    const offered = (read: NodeReader, lentRead: boolean): void => {
      if (lentRead || serves(read)) void once(read);
    };
    waiting.add(offered);
    database.read((read) => once(read)).catch(() => once(null));
  };

  const onMessage = (message: FromLedgerWorker): void => {
    if (message.type === "node") {
      answerNode(message.id, message.at);
      return;
    }
    if (message.type === "trace") {
      traceWorker(message.entry);
      return;
    }
    answeredAt = performance.now();
    const request = pending.get(message.id);
    if (tracing()) {
      if (message.at !== undefined) traceAdd("backMs", traceClock() - message.at);
      if (request !== undefined) {
        traceAdd(`rt.${request.kind}`, answeredAt - request.sent);
        traceAdd(`rtN.${request.kind}`, 1);
      }
    }
    if (message.ok) {
      pending.delete(message.id);
      request?.resolve(message.value);
    } else if (message.fatal) {
      const trap = `the ledger worker's package failed and its thread ended: ${message.error.name}: ${message.error.message}`;
      if (request === undefined || !isAhead(request.request) || failure !== null || closed) {
        fail(new LedgerWorkerFailure(trap));
        return;
      }
      // An apply marked ahead: the block is judged at its own turn (see the module comment).
      pending.delete(message.id);
      const old = replace((other) => !isAhead(other.request));
      void old.worker.terminate();
      request.reject(new LedgerWorkerFailure(`${trap}, while applying block ${heightOf(request.request)} ahead; a new thread took its place`));
    } else {
      pending.delete(message.id);
      request?.reject(errorOf(message.error));
    }
  };

  let thread = spawn();

  /**
   * Ends the current thread and starts a new one in its place: the parses kept for blocks not released are sent to it
   * again in their order, a parse in flight answered by the new thread; every other request in flight is sent again in
   * its order when `again` says so, and fails otherwise. Returns the ended thread, for its termination.
   */
  const replace = (again: (request: Pending) => boolean): Thread => {
    const old = thread;
    old.retired = true;
    before.requests += old.bridge.stats.requests;
    before.nodes += old.bridge.stats.nodes;
    const inFlight = [...pending.values()];
    pending.clear();
    thread = spawn();
    restarts += 1;
    answeredAt = performance.now();
    const parsing = new Map(inFlight.filter((request) => request.kind === "parse").map((request) => [hexOf((request.request as ParseRequest).block.hash), request]));
    for (const request of parses.kept()) {
      const key = hexOf(request.block.hash);
      post(request, parsing.get(key) ?? { read: null, resolve: () => undefined, reject: () => undefined });
      parsing.delete(key);
    }
    for (const request of parsing.values()) post(request.request, request);
    for (const request of inFlight) {
      if (request.kind === "parse") continue;
      if (again(request)) post(request.request, request);
      else request.reject(new Error(`the ledger worker was restarted while its ${request.kind} request ran`));
    }
    return old;
  };

  /**
   * Posts `request` to the current thread under a new number, `entry` its pending record. In a traced process the
   * message also says when it was posted.
   */
  const post = (request: LedgerRequest, record: Omit<Pending, "request" | "kind" | "height" | "sent">): void => {
    const id = next++;
    pending.set(id, { request, kind: request.type, height: heightOf(request), sent: performance.now(), ...record });
    thread.worker.postMessage((tracing() ? { id, request, at: traceClock() } : { id, request }) satisfies ToLedgerWorker);
  };

  const send = <T>(request: LedgerRequest, read?: NodeReader): Promise<T> => {
    if (failure !== null) return Promise.reject(failure);
    if (closed) return Promise.reject(new Error("the ledger worker is closed"));
    parses.sent(request);
    facts.sent(request);
    return new Promise<T>((resolve, reject) => {
      post(request, { read: read ?? null, resolve: resolve as (value: unknown) => void, reject });
      if (read !== undefined) for (const waiter of [...waiting]) waiter(read, false);
    });
  };

  const commit = (block: BlockId): Promise<boolean> => send({ type: "commit", block });
  const release = (drop: { readonly upTo?: bigint; readonly hashes?: readonly Uint8Array[] }): Promise<number> =>
    send({ type: "release", drop });

  const host: LedgerHost = {
    useDatabase(given) {
      database = given;
    },
    lend(read) {
      lent.push(read);
      if (!answering.has(read)) answering.set(read, new Set());
      for (const waiter of [...waiting]) waiter(read, true);
      return async () => {
        const at = lent.lastIndexOf(read);
        if (at >= 0) lent.splice(at, 1);
        if (lent.includes(read)) return;
        const running = answering.get(read);
        answering.delete(read);
        if (running !== undefined) await Promise.allSettled([...running]);
      };
    },
    parse: (ledger, block, transactions) => send({ type: "parse", ledger, block, transactions: [...transactions] }),
    genesisRoot: (ledger, bytes) => send({ type: "genesis-root", ledger, bytes }),
    genesis: (input, read) => send({ type: "genesis", input }, read),
    apply: (input, read) => send({ type: "apply", input }, read),
    // A caller's own commit retires the block from the record, as the commit `committed` sends does.
    commit: (block) =>
      commit(block).then((done) => {
        facts.directlyCommitted(block);
        return done;
      }),
    release,
    written: facts.written,
    committed: facts.committed,
    rolledBack: facts.rolledBack,
    load: (input, read) => send({ type: "load", input }, read),
    retained: (input, read) => send({ type: "retained", input }, read),
    evict: (keys) => send({ type: "evict", keys: [...keys] }),
    tasks: (input, read) => send({ type: "tasks", input }, read),
    probe: () => send({ type: "probe" }),
    async restart() {
      if (failure !== null) throw failure;
      if (closed) throw new Error("the ledger worker is closed");
      // The parses kept for blocks not released yet, sent again in their order, a parse still in flight answered by
      // the new thread; any other request in flight but a ledger task's fails (it ran on the thread that ended). A
      // ledger task's request in flight — another block's, run at its module's `on-parse` while this one computed —
      // runs again there, on the parse sent again: a task keeps nothing between requests (one that needs the state
      // fails there, as the new thread holds none).
      const old = replace((request) => request.kind === "tasks");
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
  FACTS.set(host, facts);
  return host;
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
  // The host's facts of each block's transaction, over its own commit and release (made below).
  const facts = transactionFacts({ commit: (block) => commit(block), release: (drop) => release(drop) });
  let chain: Promise<unknown> = Promise.resolve();
  let closed = false;
  let restarts = 0;
  let current: { kind: LedgerRequestKind; height: bigint | null; sent: number } | null = null;
  const run = <T>(request: LedgerRequest, work: (engine: LedgerEngine) => Promise<T> | T): Promise<T> => {
    if (closed) return Promise.reject(new Error("the ledger worker is closed"));
    parses.sent(request);
    facts.sent(request);
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
  const commit = (block: BlockId): Promise<boolean> => run({ type: "commit", block }, (e) => e.commit(block));
  const release = (drop: { readonly upTo?: bigint; readonly hashes?: readonly Uint8Array[] }): Promise<number> =>
    run({ type: "release", drop }, (e) => e.release(drop));
  const host: LedgerHost = {
    useDatabase: () => undefined,
    // The engine runs on this thread and reads no stored node through a bridge: nothing to lend.
    lend: () => () => Promise.resolve(),
    parse: (ledger, block, transactions) => parse({ type: "parse", ledger, block, transactions: [...transactions] }),
    genesisRoot: (ledger, bytes) => run({ type: "genesis-root", ledger, bytes }, (e) => e.genesisRoot(ledger, bytes)),
    genesis: (input) => run({ type: "genesis", input }, (e) => e.genesis(input)),
    apply: (input) => run({ type: "apply", input }, (e) => e.apply(input)),
    // A caller's own commit retires the block from the record, as the commit `committed` sends does.
    commit: (block) =>
      commit(block).then((done) => {
        facts.directlyCommitted(block);
        return done;
      }),
    release,
    written: facts.written,
    committed: facts.committed,
    rolledBack: facts.rolledBack,
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
  FACTS.set(host, facts);
  return host;
}
