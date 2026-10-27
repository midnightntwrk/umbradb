import { EventEmitter } from "node:events";
import { readFileSync } from "node:fs";
import { createServer, type Server, type Socket } from "node:net";
import { join } from "node:path";
import { performance } from "node:perf_hooks";
import { setTimeout as sleep } from "node:timers/promises";
import { NodeBlockSource, nodeSourceOf } from "../../src/backbone/core-block-fetch/node-source.js";
import { type ChainCheck, type ChainCheckInput, checkChain } from "../../src/backbone/core-chain/index.js";
import { privateIntake } from "../../src/backbone/core-private-source/index.js";
import { commandBuild } from "../../src/cli/build-modules.js";
import { coreEntry } from "../../src/config/entries.js";
import { NodeClient, type NodeClientOptions } from "../../src/node/client.js";
import type { ConnectSocket } from "../../src/node/socket.js";
import { connectWebSocket } from "../../src/node/ws-socket.js";
import { type ProcessHandle, type ProcessInput, terminationSignal } from "../../src/runner/process.js";
import type { ProcessBackend, ProcessDatabase } from "./process-backends.js";
import { core, coreSettings, startProcess, testBuild } from "./process-build.js";
import { freePort } from "./process-harness.js";

/**
 * What A167's tests share (task 5.3b; RN-13 as amended: "During startup it SHALL stop before startup's next step and
 * end any wait for the node at once, an unreachable node's retries included"; `startup-stop.test.ts` and its negative
 * control `startup-stop.negative-control.test.ts`): a process on a new database whose startup waits for a node it
 * cannot reach — a closed port, so every connection is refused and the node client retries it with IN-10's back-off —,
 * stopped there by `ProcessHandle.stop()` or by SIGTERM (`terminationSignal` on an emitter of the test's), what it did
 * then ({@link A167Observation}), and the oracle {@link a167Problems}.
 *
 * The process is the tests' build (`process-build.ts`) with the node source on the `core` entry's `node`
 * (`nodeSourceOf`, as `umbradb run` makes it) and `backoffCeilingMs` 1 s, so a client that kept retrying would connect
 * again every second. Its node clients — the one it makes, through the `nodeClient` seam, and any a negative control's
 * startup makes — connect through a connector that counts each attempt and those made once the test stopped the
 * process, and note whether they were closed ({@link NodeWatch}). After the bound the test closes whatever the process
 * left open, so that a process that did not stop (the defect, a negative control) still ends and closes its database.
 *
 * Also a private process (PP-1: it never talks to the node; its view of the chain is its public side): one whose
 * startup waits for a core transport that accepts the connection and never answers ({@link privateRun}).
 */

/** A167's bound: the process ends within 5 s of its stop. */
export const STOP_LIMIT_MS = 5_000;

/** How long the tests watch for a connection attempt once the process closed or the bound passed: two retries. */
export const WATCH_MS = 2_500;

/** How long a process may take to reach its retrying startup on a loaded machine (task 0.5's notes). */
export const PATIENCE_MS = 120_000;

/** The `core` entry's `backoffCeilingMs` here: a client that kept retrying would connect again every second. */
export const CEILING_MS = 1_000;

/** A node client that notes whether it was closed. */
class WatchedClient extends NodeClient {
  closedByProcess = false;

  override close(): Promise<void> {
    this.closedByProcess = true;
    return super.close();
  }
}

/**
 * The node clients a process made and their connection attempts: each attempt is counted, and counted again as late
 * once {@link stopped} is set — set by the test in the same turn as it stops the process, so an attempt the process
 * scheduled before the stop and made after it counts as late.
 */
export class NodeWatch {
  stopped = false;
  attempts = 0;
  late = 0;
  readonly #clients: WatchedClient[] = [];

  readonly connect: ConnectSocket = (url, events, timers) => {
    this.attempts += 1;
    if (this.stopped) this.late += 1;
    return connectWebSocket(url, events, timers);
  };

  /** A client on `options` (the process's, with its `onRetry`), connecting through {@link connect}. */
  client(options: NodeClientOptions): NodeClient {
    const client = new WatchedClient({ ...options, connect: this.connect });
    this.#clients.push(client);
    return client;
  }

  get clients(): number {
    return this.#clients.length;
  }

  /** How many of the clients were not closed. */
  open(): number {
    return this.#clients.filter((client) => !client.closedByProcess).length;
  }

  /** Closes every client (the test's clean-up of a process that did not stop): its calls end with `handle-closed`. */
  async closeAll(): Promise<void> {
    await Promise.all(this.#clients.map((client) => client.close()));
  }
}

/** How a test stops the process: `ProcessHandle.stop()`, or SIGTERM through `terminationSignal`. */
export type StopBy = "stop" | "sigterm";

/** What one A167 run showed. */
export interface A167Observation {
  /** Before the stop: the state, and the attempts of its `node-retrying` condition (null without one). */
  readonly before: { readonly state: string; readonly retrying: number | null };
  /** The state just after the stop. */
  readonly atStop: string;
  /** From the stop to `closed`, in milliseconds; null when it had not closed within {@link STOP_LIMIT_MS}. */
  readonly closedMs: number | null;
  /** How processing had ended at that point (`ended`'s kind), or null when it had not. */
  readonly ended: string | null;
  /** The state then. */
  readonly after: string;
  /** The node clients the process made, and how many of them were not closed by the end of the watch. */
  readonly clients: number;
  readonly openClients: number;
  /** Connection attempts to the node before the stop, and after it until the end of the watch. */
  readonly attemptsBefore: number;
  readonly attemptsAfter: number;
  /** Null when the database the process opened was closed; otherwise how it was not. */
  readonly unclean: string | null;
}

/** A167's oracle: every problem with what was observed, none when A167 holds. */
export function a167Problems(observed: A167Observation): string[] {
  const problems: string[] = [];
  const { before } = observed;
  if (before.state !== "starting" || before.retrying === null || observed.attemptsBefore < 2) {
    problems.push(
      `before the stop the process was ${before.state} with node-retrying at ${before.retrying} after ` +
        `${observed.attemptsBefore} connection attempts, not starting and retrying the node`,
    );
  }
  if (observed.atStop !== "stopping") problems.push(`the stop left the process ${observed.atStop}, not stopping`);
  if (observed.closedMs === null) problems.push(`the process did not close within ${STOP_LIMIT_MS} ms of its stop`);
  if (observed.ended !== "signal") {
    problems.push(`processing ended ${observed.ended ?? "not at all"} within ${STOP_LIMIT_MS} ms of the stop, not by the signal`);
  }
  if (observed.after !== "stopping") problems.push(`after the stop the process was ${observed.after}, not stopping`);
  if (observed.openClients > 0) problems.push(`node clients not closed: ${observed.openClients} of ${observed.clients}`);
  if (observed.attemptsAfter > 0) problems.push(`connection attempts to the node after the stop: ${observed.attemptsAfter}`);
  if (observed.unclean !== null) problems.push(`the database was not closed: ${observed.unclean}`);
  return problems;
}

/** PGlite's `pg_control` state: 1 when shut down, 6 in production (`DBState`, at byte 16). */
const controlState = (directory: string): number => readFileSync(join(directory, "global", "pg_control")).readUInt32LE(16);

/** Null when the process's database is closed: no session of the process left (PostgreSQL), or shut down (PGlite). */
export async function databaseLeftOpen(kind: ProcessBackend["kind"], db: ProcessDatabase): Promise<string | null> {
  if (kind === "pglite") {
    const state = controlState(db.directory as string);
    return state === 1 ? null : `PGlite's pg_control state is ${state}, not 1 (shut down)`;
  }
  const sql = "SELECT count(*)::int AS n FROM pg_stat_activity WHERE datname = current_database() AND application_name = 'umbradb'";
  const deadline = Date.now() + 30_000;
  for (;;) {
    const [row] = await db.query(sql);
    const sessions = Number(row?.n);
    if (sessions === 0) return null;
    if (Date.now() > deadline) return `${sessions} sessions of the process are still open`;
    await sleep(50);
  }
}

/** The process's `node-retrying` attempts, or null without the condition. */
function retryingOf(handle: ProcessHandle): number | null {
  const condition = handle.status().conditions.find((one) => one.code === "node-retrying");
  return condition !== undefined && "attempts" in condition ? condition.attempts : null;
}

/** Waits until startup retries the node: `starting`, with `node-retrying` at 2 attempts or more. */
async function startupRetrying(handle: ProcessHandle, watch: NodeWatch): Promise<void> {
  const deadline = Date.now() + PATIENCE_MS;
  for (;;) {
    const { state } = handle.status();
    const retrying = retryingOf(handle);
    if (state === "starting" && retrying !== null && retrying >= 2 && watch.attempts >= 2) return;
    if (state !== "starting" || Date.now() > deadline) {
      throw new Error(`startup never retried the node: ${JSON.stringify(handle.status(), (_, v) => (typeof v === "bigint" ? `${v}` : v))}`);
    }
    await sleep(20);
  }
}

/** Resolves with the milliseconds from `from` to `closed`, or null once {@link STOP_LIMIT_MS} passed first. */
async function closedWithin(handle: ProcessHandle, from: number): Promise<number | null> {
  let timer: NodeJS.Timeout | undefined;
  const late = new Promise<null>((resolve) => {
    timer = setTimeout(() => resolve(null), STOP_LIMIT_MS);
  });
  try {
    return await Promise.race([handle.closed.then(() => performance.now() - from), late]);
  } finally {
    clearTimeout(timer);
  }
}

/**
 * A negative control's startup check against the node, given the run's {@link NodeWatch} and the options the process
 * made its client with.
 */
export type CheckOf = (watch: NodeWatch, options: () => NodeClientOptions) => NonNullable<ProcessInput["checkChain"]>;

/**
 * A167's run on `db` (see the module comment): the process's startup retries the node, `by` stops it, and the run
 * observes the state, `closed` against the bound, how processing ended, the node clients and their connection attempts
 * over {@link WATCH_MS} more, then — after closing what the process left — whether the database was closed. `check`
 * replaces startup's checks against the node (a negative control's).
 */
export async function a167Run(
  backend: ProcessBackend,
  db: ProcessDatabase,
  by: StopBy,
  check?: CheckOf,
): Promise<A167Observation> {
  const node = `ws://127.0.0.1:${await freePort()}`;
  const watch = new NodeWatch();
  let options: NodeClientOptions | undefined;
  const signals = new EventEmitter();
  const termination = by === "sigterm" ? terminationSignal(signals) : undefined;
  const handle = startProcess({
    declarations: testBuild([]).declarations,
    config: { data: { entries: [core(db.setting, 1, { extra: { node, backoffCeilingMs: CEILING_MS } })] } },
    source: nodeSourceOf,
    nodeClient: (given) => {
      options = given;
      return watch.client(given);
    },
    ...(check === undefined ? {} : { checkChain: check(watch, () => options as NodeClientOptions) }),
    ...(termination === undefined ? {} : { signal: termination.signal }),
    log: () => undefined,
  });
  let observed: Omit<A167Observation, "unclean">;
  try {
    await startupRetrying(handle, watch);
    const before = { state: handle.status().state, retrying: retryingOf(handle) };
    const attemptsBefore = watch.attempts;
    watch.stopped = true;
    const from = performance.now();
    if (by === "stop") void handle.stop();
    else signals.emit("SIGTERM");
    const atStop = handle.status().state;
    const closedMs = await closedWithin(handle, from);
    const ended = handle.status().ended?.kind ?? null;
    const after = handle.status().state;
    await sleep(WATCH_MS);
    observed = {
      before,
      atStop,
      closedMs,
      ended,
      after,
      clients: watch.clients,
      openClients: watch.open(),
      attemptsBefore,
      attemptsAfter: watch.late,
    };
  } finally {
    // A process that did not stop: its clients closed, so that its startup's node calls end and it closes.
    await watch.closeAll();
    await handle.stop();
    termination?.dispose();
  }
  return { ...observed, unclean: await databaseLeftOpen(backend.kind, db) };
}

/**
 * The negative control's startup (A167): `core-chain`'s checks against the node as they are, asked through a node
 * source over a client of its own — made from the process's options, so the process shows its `node-retrying` — that
 * the stop does not reach: its wait for block 0 ignores the stop, as every startup's did before task 5.3b.
 */
export const ignoringWait: CheckOf =
  (watch, options) =>
  (input: ChainCheckInput): Promise<ChainCheck> =>
    checkChain({ ...input, source: new NodeBlockSource({ client: watch.client(options()), prefetchWindow: 64, tipCap: 600 }) });

/** A core transport that accepts every connection and never answers (a WebSocket handshake that never completes). */
export interface SilentCore {
  readonly address: string;
  /** Connections accepted, and those accepted once {@link stopped} was set. */
  readonly accepted: () => number;
  readonly late: () => number;
  stopped: boolean;
  close(): Promise<void>;
}

/** Starts a {@link SilentCore} on a free port of 127.0.0.1. */
export async function silentCore(): Promise<SilentCore> {
  const sockets: Socket[] = [];
  let accepted = 0;
  let late = 0;
  const core: { stopped: boolean } = { stopped: false };
  const server: Server = createServer((socket) => {
    accepted += 1;
    if (core.stopped) late += 1;
    sockets.push(socket);
    socket.on("error", () => undefined);
  });
  await new Promise<void>((resolve, reject) => {
    server.once("error", reject);
    server.listen(0, "127.0.0.1", () => resolve());
  });
  const { port } = server.address() as { readonly port: number };
  return Object.assign(core, {
    address: `127.0.0.1:${port}`,
    accepted: () => accepted,
    late: () => late,
    async close() {
      for (const socket of sockets) socket.destroy();
      await new Promise<void>((resolve) => server.close(() => resolve()));
    },
  });
}

/** What a private process's run showed (see {@link privateRun}). */
export interface PrivateObservation {
  readonly before: string;
  readonly accepted: number;
  readonly atStop: string;
  readonly closedMs: number | null;
  readonly ended: string | null;
  readonly late: number;
  readonly unclean: string | null;
}

/** The private run's oracle: every problem, none when its wait for its public side ended at the stop. */
export function privateProblems(observed: PrivateObservation): string[] {
  const problems: string[] = [];
  if (observed.before !== "starting" || observed.accepted < 1) {
    problems.push(`before the stop the process was ${observed.before} with ${observed.accepted} connections to the core`);
  }
  if (observed.atStop !== "stopping") problems.push(`the stop left the process ${observed.atStop}, not stopping`);
  if (observed.closedMs === null) problems.push(`the process did not close within ${STOP_LIMIT_MS} ms of its stop`);
  if (observed.ended !== "signal") {
    problems.push(`processing ended ${observed.ended ?? "not at all"} within ${STOP_LIMIT_MS} ms of the stop, not by the signal`);
  }
  if (observed.late > 0) problems.push(`connections to the core after the stop: ${observed.late}`);
  if (observed.unclean !== null) problems.push(`the database was not closed: ${observed.unclean}`);
  return problems;
}

/**
 * A private process on `db` whose startup waits for its public side — its core transport at a {@link SilentCore}, its
 * public database read through it —, stopped by `ProcessHandle.stop()` once the core accepted its connection.
 */
export async function privateRun(backend: ProcessBackend, db: ProcessDatabase): Promise<PrivateObservation> {
  const silent = await silentCore();
  const settings = coreSettings(db.setting, {
    backoffCeilingMs: CEILING_MS,
    instanceId: "a167-private",
    coreTransport: silent.address,
  });
  delete settings.node;
  const intake = privateIntake();
  const handle = startProcess({
    declarations: commandBuild([], { side: "private", intake }),
    config: { data: { entries: [coreEntry({ start: 1, config: settings as never })] } },
    source: (entry, shared) => intake.source(entry, shared),
    side: "private",
    log: () => undefined,
  });
  let observed: Omit<PrivateObservation, "unclean">;
  try {
    const deadline = Date.now() + PATIENCE_MS;
    while (silent.accepted() < 1 && handle.status().state === "starting" && Date.now() < deadline) await sleep(20);
    // The transport's handshake waits now; a little longer shows that it keeps waiting.
    await sleep(500);
    const before = handle.status().state;
    const accepted = silent.accepted();
    silent.stopped = true;
    const from = performance.now();
    void handle.stop();
    const atStop = handle.status().state;
    const closedMs = await closedWithin(handle, from);
    const ended = handle.status().ended?.kind ?? null;
    await sleep(WATCH_MS);
    observed = { before, accepted, atStop, closedMs, ended, late: silent.late() };
  } finally {
    // A process that did not stop: the core's side closed, so that its transport's handshake fails and it closes.
    await silent.close();
    await handle.stop();
  }
  return { ...observed, unclean: await databaseLeftOpen(backend.kind, db) };
}
