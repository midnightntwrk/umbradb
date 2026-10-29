import { once } from "node:events";
import { request } from "node:http";
import { setTimeout as sleep } from "node:timers/promises";
import { MessageChannel, Worker } from "node:worker_threads";
import { z } from "zod";
import { serveAdmin, type FromAdmin } from "../../src/admin/serve.js";
import { type AdminServer, type AdminStarter, startAdminServer } from "../../src/admin/server.js";
import { answerAdmin, ADMIN_ROUTES } from "../../src/admin/routes.js";
import type { AdminAnswer, AdminSnapshot, AdminView, StatusSnapshot } from "../../src/admin/types.js";
import { CORE_HEALTH } from "../../src/backbone/core-health/index.js";
import { CORE_STATUS } from "../../src/backbone/core-status/index.js";
import { CORE_CONFIG } from "../../src/backbone/core-config/index.js";
import { UNVALIDATED_CONFIG } from "../../src/admin/configuration.js";
import { coreEntry } from "../../src/config/entries.js";
import type { ReadOnlyDatabase } from "../../src/db/api.js";
import type { ModuleDeclaration } from "../../src/modules/declaration.js";
import { parseAddress } from "../../src/runner/api-server.js";
import type { BlockSource } from "../../src/runner/block-source.js";
import { InMemoryBlockSource } from "../../src/runner/in-memory-source.js";
import { type ProcessHandle, startProcess } from "../../src/runner/process.js";
import { genesisBlock, genesisHex, TEST_LEDGER_TABLE } from "../private/builds.js";
import { coreSettings, entryOf, testBuild, type TestBuildOptions } from "../runner/process-build.js";
import type { DatabaseParts } from "../../src/config/database-parts.js";

/**
 * Helpers for the admin endpoints' tests:
 * - a process started with its admin endpoints on `listen.admin` (`127.0.0.1:0`, a port the system gives, checked to
 *   be ≥ 10000), and requests to them;
 * - the prober that times their answers off the main thread;
 * - the oracle for answer times and routes; [A62]
 * - the oracle for the endpoints in each process state; [A64]
 * - the admin servers of the negative controls.
 * [AE-1–AE-3, AE-6]
 */

/**
 * The test network: `custom`, with its own ledger table and its genesis hash the in-memory chain's block 0
 * ({@link adminSource}), so the configured genesis and the chain's agree (as the helpers of `test/private/builds.ts`).
 */
export const ADMIN_GENESIS = genesisHex(0x81);

/** The in-memory chain of the tests at `head`: block 0 the test network's genesis ({@link ADMIN_GENESIS}). */
export function adminSource(head: bigint): InMemoryBlockSource {
  return new InMemoryBlockSource({ head, blocks: [genesisBlock(ADMIN_GENESIS)] });
}

/** The `core` settings of the tests on `database`, on the test network: `coreSettings`' with `extra` over them. */
export function adminCoreSettings(database: DatabaseParts, extra: Readonly<Record<string, unknown>> = {}): Record<string, unknown> {
  return coreSettings(database, { network: "custom", genesisHash: ADMIN_GENESIS, ledgerTable: TEST_LEDGER_TABLE, ...extra });
}

/**
 * How `/config` shows the `database` setting `database`: its parts, the password as `[redacted]`. [CF-4, Q167 A]
 */
export function shownDatabase(database: DatabaseParts): Record<string, unknown> {
  return "password" in database && database.password !== undefined ? { ...database, password: "[redacted]" } : { ...database };
}

/** A `core` entry of the tests from `start` (see {@link adminCoreSettings}). */
export function adminCore(
  database: DatabaseParts,
  start = 1,
  rest: { readonly stop?: number; readonly extra?: Readonly<Record<string, unknown>> } = {},
) {
  return coreEntry({
    start,
    ...(rest.stop === undefined ? {} : { stop: rest.stop }),
    config: adminCoreSettings(database, rest.extra) as never,
  });
}

/**
 * A user module that keeps the core's `db` item (the process's database, read-only) from its `on-start-api` on: how a
 * test reads the process's database from outside its callbacks (the runner has no `onChecked` hook).
 */
export function dbKeeper(keep: (db: ReadOnlyDatabase) => void): ModuleDeclaration {
  return {
    id: "keeper",
    version: "1.0.0",
    side: "public",
    requires: ["db"],
    provides: [],
    startsMidChain: true,
    configSchema: z.object({}),
    migrations: [],
    points: {
      async "on-start-api"(p) {
        keep(p.items.get("db") as ReadOnlyDatabase);
      },
    },
  };
}

/**
 * The backbone parts of the admin endpoints that have a declaration, which the tests' build carries beside the test
 * backbone (`testBuild`), as the command's build does (`src/cli/build-modules.ts`): `core-health`, `core-status` and
 * `core-config`.
 */
export const ADMIN_BACKBONE = [CORE_HEALTH, CORE_STATUS, CORE_CONFIG] as const;

/**
 * A published status for the endpoints' unit tests: a public process `following` at 3, ready, `given` over it. What
 * nothing has reported yet is null. [AE-5]
 */
export function statusSnapshot(given: Partial<StatusSnapshot> = {}): StatusSnapshot {
  return {
    state: "following",
    ready: true,
    conditions: [],
    cursor: "3",
    head: "3",
    lag: "0",
    reason: null,
    instance: { role: "core", id: null },
    lastCommitAt: null,
    node: { finalizedHead: "3", bestHead: null, connection: null, retries: 0, queueDepth: null, tipCap: 600, finalityStall: false },
    modules: null,
    ledger: null,
    privateInstances: null,
    public: null,
    ...given,
  };
}

/** A whole snapshot for the endpoints' unit tests: {@link statusSnapshot}'s, the default settings, `given` over it. [CF-4] */
export function adminSnapshot(given: Partial<AdminSnapshot> = {}): AdminSnapshot {
  return { livenessTimeoutMs: 30_000, readinessLag: null, startedNs: "0", status: statusSnapshot(), config: UNVALIDATED_CONFIG, ...given };
}

/** The four endpoints. [AE-1] */
export const ENDPOINTS = ["/health/live", "/health/ready", "/status", "/config"] as const;

/** One answer of the admin listener (or the module API's). */
export interface Answered {
  readonly method: string;
  readonly path: string;
  /** Null when no answer came (the error's code in `error`). */
  readonly status: number | null;
  readonly error: string | null;
  readonly contentType: string | null;
  readonly text: string;
  /** The body as JSON, or undefined when it is none. */
  readonly json: unknown;
}

/** `method path` against `origin` (`http://host:port`), the path sent as written (no normalization). */
export function ask(origin: string, path: string, method = "GET", timeoutMs = 10_000): Promise<Answered> {
  const { hostname, port } = new URL(origin);
  return new Promise((resolve) => {
    const done = (status: number | null, error: string | null, contentType: string | null, text: string) => {
      let json: unknown;
      try {
        json = text === "" ? undefined : JSON.parse(text);
      } catch {
        json = undefined;
      }
      resolve({ method, path, status, error, contentType, text, json });
    };
    const outgoing = request({ hostname, port, path, method, agent: false, timeout: timeoutMs }, (answer) => {
      const chunks: Buffer[] = [];
      answer.on("data", (chunk: Buffer) => chunks.push(chunk));
      answer.on("end", () =>
        done(answer.statusCode ?? null, null, answer.headers["content-type"] ?? null, Buffer.concat(chunks).toString("utf8")),
      );
    });
    outgoing.on("timeout", () => outgoing.destroy(Object.assign(new Error("timeout"), { code: "TIMEOUT" })));
    outgoing.on("error", (error: NodeJS.ErrnoException) => done(null, error.code ?? error.message, null, ""));
    outgoing.end();
  });
}

/** The four endpoints' answers. */
export interface Observation {
  readonly live: Answered;
  readonly ready: Answered;
  readonly status: Answered;
  readonly config: Answered;
}

/** Asks the four endpoints, one after the other. */
export async function observe(origin: string): Promise<Observation> {
  const [live, ready, status, config] = [
    await ask(origin, "/health/live"),
    await ask(origin, "/health/ready"),
    await ask(origin, "/status"),
    await ask(origin, "/config"),
  ];
  return { live, ready, status, config } as Observation;
}

/** `/status`'s body, as the admin worker writes it. */
export type StatusBody = {
  readonly state: string;
  readonly ready: boolean;
  readonly conditions: readonly Record<string, unknown>[];
  readonly cursor: string | null;
  readonly head: string | null;
  readonly lag: string | null;
  readonly reason: Record<string, unknown> | null;
};

/** Asks `/status` until `wanted` holds of its body (or `patienceMs` ran out: then the last body, for the message). */
export async function statusWhen(
  origin: string,
  wanted: (body: StatusBody) => boolean,
  patienceMs = 20_000,
): Promise<StatusBody> {
  const until = Date.now() + patienceMs;
  let last: Answered | undefined;
  for (;;) {
    last = await ask(origin, "/status");
    const body = last.json as StatusBody | undefined;
    if (last.status === 200 && body !== undefined && wanted(body)) return body;
    if (Date.now() > until) {
      throw new Error(`/status never matched within ${patienceMs} ms; last: ${last.status} ${last.text || last.error}`);
    }
    await sleep(50);
  }
}

/** What {@link startWithAdmin} takes. */
export interface AdminRunOptions {
  /** The `database` setting. */
  readonly database: DatabaseParts;
  readonly user?: readonly ModuleDeclaration[];
  /** More settings of the `core` entry; `listen.admin` is `127.0.0.1:0` unless they give it. */
  readonly extra?: Readonly<Record<string, unknown>>;
  /** The core's stop. */
  readonly stop?: number;
  /** The entries in place of the `core` entry and one entry per user module from 1. */
  readonly entries?: readonly unknown[];
  /** The block source; the tests' in-memory chain ({@link adminSource}) at `head` (3 by default) unless given. */
  readonly source?: BlockSource;
  readonly head?: bigint;
  /** How the admin server starts; the real worker's unless given (the negative controls'). */
  readonly starter?: AdminStarter;
  readonly build?: TestBuildOptions;
  /** Adds {@link dbKeeper} (and its entry from 1), so that {@link AdminRun.db} gives the process's database. */
  readonly keepDb?: boolean;
  /** The process's side; public unless given. */
  readonly side?: "public" | "private";
}

/** A process started with its admin endpoints. */
export interface AdminRun {
  readonly handle: ProcessHandle;
  readonly lines: string[];
  readonly source: BlockSource;
  /** The in-memory source, when the run made it. */
  readonly memory: InMemoryBlockSource | null;
  /** The address the process asked its admin listener for. */
  readonly requested: Promise<string>;
  /** The admin server once it listens; rejects when it could not. */
  readonly server: Promise<AdminServer>;
  /** `http://host:port` of the admin listener. */
  origin(): Promise<string>;
  /** The process's database, read-only, once its `on-start-api` ran (with {@link AdminRunOptions.keepDb}). */
  db(): Promise<ReadOnlyDatabase>;
}

/** The `listen` setting of `extra` with `admin` on `127.0.0.1:0` unless it gives one. */
function listenOf(extra: Readonly<Record<string, unknown>>): Record<string, unknown> {
  const given = (extra.listen ?? {}) as Readonly<Record<string, unknown>>;
  return { admin: "127.0.0.1:0", ...given };
}

/** Starts a process of the test build with its admin endpoints (see {@link AdminRunOptions}). */
export function startWithAdmin(options: AdminRunOptions): AdminRun {
  let kept!: (db: ReadOnlyDatabase) => void;
  const database = new Promise<ReadOnlyDatabase>((resolve) => {
    kept = resolve;
  });
  const user = [...(options.user ?? []), ...(options.keepDb === true ? [dbKeeper(kept)] : [])];
  const build = testBuild(user, options.build);
  const lines: string[] = [];
  const memory = options.source === undefined ? adminSource(options.head ?? 3n) : null;
  const source = options.source ?? (memory as InMemoryBlockSource);
  const extra = { ...(options.extra ?? {}), listen: listenOf(options.extra ?? {}) };
  const entries = options.entries ?? [
    adminCore(options.database, 1, { extra, ...(options.stop === undefined ? {} : { stop: options.stop }) }),
    ...user.map((part) => entryOf(part, 1)),
  ];
  let asked!: (address: string) => void;
  const requested = new Promise<string>((resolve) => {
    asked = resolve;
  });
  let listened!: (server: AdminServer) => void;
  let failed!: (error: unknown) => void;
  const server = new Promise<AdminServer>((resolve, reject) => {
    listened = resolve;
    failed = reject;
  });
  server.catch(() => undefined);
  const starter = options.starter ?? startAdminServer;
  const handle = startProcess({
    declarations: { ...build.declarations, backbone: [...build.declarations.backbone, ...ADMIN_BACKBONE] },
    config: { data: { entries } },
    source,
    ...(options.side === undefined ? {} : { side: options.side }),
    log: (line) => lines.push(line),
    admin: async (start) => {
      asked(start.address);
      try {
        const started = await starter(start);
        if (started.port < 10_000) throw new Error(`the admin listener listens on port ${started.port}, below 10000`);
        listened(started);
        return started;
      } catch (error) {
        failed(error);
        throw error;
      }
    },
  });
  return {
    handle,
    lines,
    source,
    memory,
    requested,
    server,
    origin: async () => {
      const { host, port } = await server;
      return `http://${host}:${port}`;
    },
    db: () => database,
  };
}

/** A gate a callback awaits until the test opens it. */
export interface Gate {
  /** Resolves once a callback reached the gate. */
  readonly reached: Promise<void>;
  /** What a callback awaits. */
  wait(): Promise<void>;
  open(): void;
}

/** A new, closed {@link Gate}. */
export function gate(): Gate {
  let reach!: () => void;
  let release!: () => void;
  const reached = new Promise<void>((resolve) => {
    reach = resolve;
  });
  const opened = new Promise<void>((resolve) => {
    release = resolve;
  });
  return {
    reached,
    wait: () => {
      reach();
      return opened;
    },
    open: () => release(),
  };
}

// ── Answer timing: the prober [A62] ──────────────────────────────────────────────────────────────────────────────

/** One request the prober made. */
export interface ProbeRecord {
  readonly path: string;
  readonly status: number | null;
  readonly error: string | null;
  /** When it was sent: `process.hrtime.bigint()` as decimal text. */
  readonly sent: string;
  /** How long its answer took, from the request. */
  readonly ms: number;
  /** The answer's body as text, when the prober was asked for bodies. */
  readonly body?: string;
}

/** A running prober (`prober.mjs`). */
export interface Prober {
  /** Stops it and resolves with every request it made. */
  stop(): Promise<ProbeRecord[]>;
}

/**
 * Starts the prober on `origin`'s `paths`, every `intervalMs`, keeping each answer's body with `bodies`. Resolves once
 * it runs.
 */
export async function startProber(
  origin: string,
  paths: readonly string[],
  intervalMs = 150,
  options: { readonly bodies?: boolean } = {},
): Promise<Prober> {
  const worker = new Worker(new URL("./prober.mjs", import.meta.url), {
    workerData: { origin, paths, intervalMs, timeoutMs: 30_000, bodies: options.bodies === true },
  });
  const messages: { type: string; records?: ProbeRecord[] }[] = [];
  const next = (type: string) =>
    new Promise<{ type: string; records?: ProbeRecord[] }>((resolve, reject) => {
      const look = () => {
        const found = messages.find((message) => message.type === type);
        if (found !== undefined) resolve(found);
        else setTimeout(look, 10);
      };
      worker.once("error", reject);
      look();
    });
  worker.on("message", (message: { type: string; records?: ProbeRecord[] }) => messages.push(message));
  await next("ready");
  return {
    async stop() {
      worker.postMessage("stop");
      const { records } = await next("records");
      await worker.terminate();
      return records as ProbeRecord[];
    },
  };
}

/** A hold of the main thread or of the database: from `start` to `end`, `process.hrtime.bigint()`. */
export interface Hold {
  start: bigint;
  end: bigint;
}

/** A new hold, not yet started. */
export const newHold = (): Hold => ({ start: 0n, end: 0n });

/** How many requests of each path a hold must see, so that "each answers within 1 s" is not vacuous. [A62] */
export const PROBES_DURING_HOLD = 4;
/** The bound on an answer's time. [A62] */
export const ANSWER_MS = 1_000;

/**
 * The timing oracle. For each of `paths`, it counts the requests sent during `hold`, from its start to 1 s before its
 * end (so that a request sent near its end could not be answered after it ended anyway). There must be at least
 * {@link PROBES_DURING_HOLD}, and each must be answered, with a status of `expected`, within {@link ANSWER_MS}. [A62]
 */
export function timingProblems(
  records: readonly ProbeRecord[],
  hold: Hold,
  expected: Readonly<Record<string, readonly number[]>>,
): string[] {
  const problems: string[] = [];
  if (hold.start === 0n || hold.end <= hold.start) return ["the hold never started or never ended"];
  const last = hold.end - BigInt(ANSWER_MS) * 1_000_000n;
  for (const [path, statuses] of Object.entries(expected)) {
    const during = records.filter((record) => record.path === path && BigInt(record.sent) >= hold.start && BigInt(record.sent) <= last);
    if (during.length < PROBES_DURING_HOLD) {
      problems.push(`${path}: only ${during.length} requests were sent during the hold, not ${PROBES_DURING_HOLD}`);
    }
    for (const record of during) {
      if (record.status === null) problems.push(`${path}: no answer (${record.error}) after ${Math.round(record.ms)} ms`);
      else if (record.ms > ANSWER_MS) problems.push(`${path}: answered ${record.status} after ${Math.round(record.ms)} ms`);
      else if (!statuses.includes(record.status)) problems.push(`${path}: answered ${record.status}, not ${statuses.join(" or ")}`);
    }
  }
  return problems;
}

// ── Routes [A62] ─────────────────────────────────────────────────────────────────────────────────────────────────

/** Requests that are none of the four endpoints; any other method or path answers 404. [AE-1] */
export const OTHER_REQUESTS: readonly (readonly [method: string, path: string])[] = [
  ["GET", "/"],
  ["GET", "/health"],
  ["GET", "/health/"],
  ["GET", "/health/live/"],
  ["GET", "/health/live/x"],
  ["GET", "/HEALTH/LIVE"],
  ["GET", "/Status"],
  ["GET", "/status/"],
  ["GET", "/config.json"],
  ["GET", "/health%2Flive"],
  ["GET", "/%73tatus"],
  ["GET", "//status"],
  ["GET", "/health/ready%20"],
  ["GET", "/keys"],
  ["GET", "/metrics"],
  ["GET", "*"],
  ["POST", "/status"],
  ["PUT", "/config"],
  ["DELETE", "/health/live"],
  ["PATCH", "/health/ready"],
  ["OPTIONS", "/status"],
  ["HEAD", "/health/live"],
  ["POST", "/health/ready"],
];

/**
 * The route oracle over the admin listener's answers:
 * - each of the four endpoints answered (`GET`; `/status?…` is `/status`) with JSON: the health endpoints 200 or 503,
 *   `/status` and `/config` 200;
 * - every other request in `others` (the module's own paths among them) answered 404, `not-found`, with JSON unless it
 *   is a `HEAD`.
 * [A62]
 */
export function routeProblems(endpoints: readonly Answered[], others: readonly Answered[]): string[] {
  const problems: string[] = [];
  for (const answer of endpoints) {
    const allowed = answer.path.startsWith("/health/") ? [200, 503] : [200];
    if (answer.status === null || !allowed.includes(answer.status)) {
      problems.push(`${answer.method} ${answer.path} answered ${answer.status ?? answer.error}, not ${allowed.join(" or ")}`);
    } else if (typeof answer.json !== "object" || answer.json === null) {
      problems.push(`${answer.method} ${answer.path} answered no JSON object`);
    }
  }
  for (const answer of others) {
    if (answer.status !== 404) {
      problems.push(`${answer.method} ${answer.path} answered ${answer.status ?? answer.error}, not 404`);
      continue;
    }
    if (answer.method === "HEAD") continue;
    const code = (answer.json as { error?: { code?: unknown } } | undefined)?.error?.code;
    if (code !== "not-found") problems.push(`${answer.method} ${answer.path}: 404 without the not-found body`);
  }
  return problems;
}

// ── Endpoints in each state [A64] ────────────────────────────────────────────────────────────────────────────────

/** What the four endpoints must answer in a state. [A64] */
export interface Expected {
  readonly state: string;
  readonly ready: boolean;
  /** Fields the reason must have; null for none. */
  readonly reason?: Readonly<Record<string, unknown>> | null;
}

/**
 * The endpoint-state oracle. In the state `expected`:
 * - `/health/live` answers 200, as a refused or halted process stays up and live; [AE-3]
 * - `/health/ready` answers 200 when ready and 503 otherwise;
 * - `/status` answers 200 with the state and readiness, and its reason with the fields expected (or none);
 * - `/config` answers 200.
 * [A64]
 */
export function stateProblems(seen: Observation, expected: Expected): string[] {
  const problems: string[] = [];
  if (seen.live.status !== 200) problems.push(`live answered ${seen.live.status ?? seen.live.error}, not 200`);
  const ready = expected.ready ? 200 : 503;
  if (seen.ready.status !== ready) problems.push(`ready answered ${seen.ready.status ?? seen.ready.error}, not ${ready}`);
  const body = seen.status.json as StatusBody | undefined;
  if (seen.status.status !== 200 || body === undefined) {
    problems.push(`/status answered ${seen.status.status ?? seen.status.error}, not 200 with JSON`);
  } else {
    if (body.state !== expected.state) problems.push(`/status says ${body.state}, not ${expected.state}`);
    if (body.ready !== expected.ready) problems.push(`/status says ready ${body.ready}, not ${expected.ready}`);
    if (expected.reason === null && body.reason !== null) problems.push("/status has a reason, and none applies");
    if (expected.reason !== undefined && expected.reason !== null) {
      for (const [field, value] of Object.entries(expected.reason)) {
        if (body.reason?.[field] !== value) {
          problems.push(`/status's reason has ${field} ${JSON.stringify(body.reason?.[field])}, not ${JSON.stringify(value)}`);
        }
      }
    }
  }
  if (seen.config.status !== 200) problems.push(`/config answered ${seen.config.status ?? seen.config.error}, not 200`);
  return problems;
}

// ── The negative controls' admin servers ─────────────────────────────────────────────────────────────────────────

/** How a control's server answers a request. */
export type Answerer = (method: string, url: string, view: AdminView) => AdminAnswer | Promise<AdminAnswer>;

/**
 * An admin server on the **main thread**, the first negative control of the answer-time test: the very `serveAdmin` the
 * worker runs, over a message channel in this thread, answering with `answer` (the real route table's by default).
 * [A62]
 */
export function mainThreadAdmin(answer?: Answerer): AdminStarter {
  return async ({ address, beat, snapshot }) => {
    const { host, port } = parseAddress(address);
    const { port1, port2 } = new MessageChannel();
    const messages: FromAdmin[] = [];
    port1.on("message", (message: FromAdmin) => messages.push(message));
    serveAdmin({ host, port, beat, snapshot, channel: port2, ...(answer === undefined ? {} : { answer }) });
    const next = async (type: FromAdmin["type"] | "listen-failed") => {
      for (;;) {
        const found = messages.find((message) => message.type === type || message.type === "listen-failed");
        if (found !== undefined) return found;
        await sleep(5);
      }
    };
    const listening = await next("listening");
    if (listening.type !== "listening") throw Object.assign(new Error("listen failed"), { syscall: "listen" });
    let closing: Promise<void> | undefined;
    return {
      host: listening.host,
      port: listening.port,
      threadId: null,
      publish: (next) => port1.postMessage({ type: "snapshot", snapshot: next }),
      close: () => {
        closing ??= (async () => {
          port1.postMessage({ type: "close" });
          await next("closed");
          port1.close();
          port2.close();
        })();
        return closing;
      },
    };
  };
}

/**
 * An admin server that **reads the database**, the second negative control of the answer-time test. It runs on the main
 * thread, as it must to hold a database. Its `/status` reads the cursor through `database()` before it answers; it
 * answers every other request as the real route table does. [A62]
 */
export function databaseReadingAdmin(database: () => Promise<ReadOnlyDatabase>): AdminStarter {
  return mainThreadAdmin(async (method, url, view) => {
    if (method === "GET" && url === "/status") {
      const db = await database();
      const rows = await db.read((read) => read.query("SELECT max(height)::text AS h FROM core_block_commit.blocks"));
      const cursor = (rows[0]?.h as string | null | undefined) ?? null;
      return { status: 200, body: { ...view.snapshot.status, cursor, uptimeMs: 0 } };
    }
    return answerAdmin(ADMIN_ROUTES, method, url, view);
  });
}

/** Waits for `emitter`'s `event`, or `ms`; true when the event came. */
export async function within(emitter: Promise<unknown>, ms: number): Promise<boolean> {
  return Promise.race([emitter.then(() => true), sleep(ms, false)]);
}

export { once };
