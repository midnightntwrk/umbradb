/**
 * `startUmbraDB`: UmbraDB run as a library, in the host program's own process. It starts the process through the
 * engine (`../runner/process.ts`, which `umbradb run` and the browser demo start through too) and returns its handle at
 * once. [LM-1, LM-2, LM-9, LM-10; design §3.3, §4]
 *
 * **It never throws.** Every option is read once and held to its shape (`./options.ts`); a malformed one, and every
 * refusal of the configuration, rejects {@link UmbraDBHandle.started} instead, the process ending `refused` by itself
 * (`closed` resolves). [LM-1, LM-10, L62]
 *
 * **It does nothing to the host program by default.** It gives the engine none of the command's ports — no SIGUSR2
 * listener, no backup at the stop, no admin listener, the worker threads' output into the host's `log` — and the
 * host's `log` only when given; the configuration is the one given, `{ file }` or `{ data }`, no file looked for. A
 * `core` revision that sets `backupAtStop` or `backupOnSignal`, which only the command acts on, is refused
 * (`library-setting-refused`). [LM-2, G1–G5, L47]
 *
 * **User modules** (design §6): a `{ file }`'s own `modules` export; with `{ data }`, `modules` objects or
 * `modulesFrom`, a module file both threads import. Given twice, they are refused (`modules-given-twice`). [LM-7]
 *
 * **`cwd`.** Every relative path the process meets — a `{ file }`, a PGlite `path`, a backup's target — resolves
 * against `cwd`, the host's working directory (`process.cwd()`) unless given; a relative `cwd` resolves against it
 * once, here. This module is the one place a library process reads the working directory. [LM-2, G8, G10, D-14]
 *
 * **The handle is a facade** ({@link UmbraDBHandle}): exactly the members of design §4, none of the engine's test seams
 * nor its `backup(out, seams)`; {@link UmbraDBStarted} holds the module API's address, the side and S — never the
 * checked settings, which hold the TLS key and the database's password. [LM-9, L52]
 *
 * **The network.** A host's request is held to its shape here (`network`, design §5.1) and given to the engine,
 * which opens no listener and makes no link for a library process: a surface listens only where the network plan
 * (`planNetwork`) puts it. [LM-3, G4, N1]
 *
 * **The handlers** exist from the return on. `privateLink.accept(channel)` closes a channel the process does not
 * accept (`private-link-not-accepting`), logs a line and throws nothing. The module API's (`api.http`, `api.upgrade`)
 * and admin's (`admin.http`) answer a request they cannot serve with 503 and the lifecycle's body — `{ error: { code:
 * "not-serving", message }, state, reason }`, the message from the state's name only. [LM-4, LM-5, LM-6, N9]
 */

import type { IncomingMessage, ServerResponse } from "node:http";
import { resolve } from "node:path";
import type { Duplex } from "node:stream";
import type { BackupWritten } from "../backup/backup.js";
import { UMBRADB_VERSION } from "../config/build.js";
import type { ProcessSide } from "../config/core-settings.js";
import type { ModuleDeclaration } from "../modules/declaration.js";
import { VERSION_HEADER } from "../runner/api-server.js";
import type { InMemoryBlockSource } from "../runner/in-memory-source.js";
import type { ProcessReason } from "../runner/failures.js";
import {
  type EngineInput,
  type ProcessCondition,
  type ProcessHandle,
  type ProcessingEnd,
  type ProcessListening,
  type ProcessStatus,
  startProcess,
  type StartedProcess,
} from "../runner/process.js";
import type { NetworkRequest } from "../runner/resolve.js";
import type { PrivateLinkChannel } from "./channels.js";
import { librarySettingsRefusal, modulesGivenTwice, optionFindings, optionsRefusal, readOptions } from "./options.js";

/** An address a surface listens at once bound: the host as the system reports it, and the port. [LM-3, LM-9] */
export interface Address {
  readonly host: string;
  readonly port: number;
}

/** A handler of Node.js's HTTP server `request` event, which a host calls from its own server. [LM-4] */
export type NodeHttpHandler = (request: IncomingMessage, response: ServerResponse) => void;

/** A handler of Node.js's HTTP server `upgrade` event (the module API's WebSocket subscriptions). [LM-4] */
export type NodeUpgradeHandler = (request: IncomingMessage, socket: Duplex, head: Buffer) => void;

/** The network request (design §5.1): every surface off unless asked. [LM-3] */
export type UmbraDBNetwork = NetworkRequest;

/** What `startUmbraDB` takes (design §4). [LM-1, LM-2, LM-3, LM-8, LM-9] */
export interface UmbraDBOptions {
  /** The configuration: a file (a path relative to {@link cwd}, or a file URL), or its data; required. [CF-1] */
  readonly config: { readonly file: string | URL } | { readonly data: unknown };
  /** The base of every relative path; `process.cwd()` unless given. [LM-2, G8] */
  readonly cwd?: string;
  /** The user modules as objects, with `{ data }`; none of them may declare ledger tasks. [LM-7] */
  readonly modules?: readonly ModuleDeclaration[];
  /**
   * With `{ data }`: the URL of an ES module whose `modules` export lists the user modules, which the main thread and
   * the ledger worker both import — the way to give a module that declares ledger tasks. [LM-7]
   */
  readonly modulesFrom?: URL;
  /** An in-memory chain in place of the node. [LM-8] */
  readonly source?: InMemoryBlockSource;
  /** Aborting it stops the process as {@link UmbraDBHandle.stop} does. [LM-9, RN-13] */
  readonly signal?: AbortSignal;
  /** Where the process's log lines go, redacted, and the worker threads' output; nothing is written without it. */
  readonly log?: (line: string) => void;
  /** The public configuration hash a private process accepts at this start (`umbradb run --update-hash`). [PP-14] */
  readonly acceptPublicConfigHash?: string;
  /** The network request; no listener and no link unless asked. [LM-3] */
  readonly network?: UmbraDBNetwork;
}

/** How processing ended (the engine's). [LM-9] */
export type UmbraDBEnd = ProcessingEnd;

/** Why a process is refused or halted: a code, its height, module and point, never a message. [LM-9, AE-5, AE-6] */
export type UmbraDBReason = ProcessReason;

/** One of AE-3's conditions. [LM-9, AE-3] */
export type UmbraDBCondition = ProcessCondition;

/** A backup written by {@link UmbraDBHandle.backup}: its file and its manifest. [BK-1] */
export type UmbraDBBackup = BackupWritten;

/** The process's state now: the engine's, and the addresses its surfaces are bound at. [LM-9, AE-3] */
export interface UmbraDBStatus extends ProcessStatus {
  readonly listening: ProcessListening;
}

/** What a process that started gives: its module API's address (null without a listener), its side, and S. [LM-9] */
export interface UmbraDBStarted {
  readonly api: Address | null;
  readonly side: ProcessSide;
  readonly start: bigint;
}

/** A library process (design §4): exactly these members. [LM-9, L52] */
export interface UmbraDBHandle {
  status(): UmbraDBStatus;
  /** Resolves once startup completed and the loop runs; rejects with a refusal or a startup failure; marked handled. */
  readonly started: Promise<UmbraDBStarted>;
  /** Resolves with how processing ended; never rejects. */
  readonly ended: Promise<UmbraDBEnd>;
  /** Resolves once the process has closed; always resolves. */
  readonly closed: Promise<void>;
  stop(): Promise<void>;
  pause(): Promise<void>;
  resume(): void;
  /** Writes a backup to `target` (relative to `cwd`), replacing the file there. [BK-1] */
  backup(target: string): Promise<UmbraDBBackup>;
  readonly api: { readonly http: NodeHttpHandler; readonly upgrade: NodeUpgradeHandler };
  readonly admin: { readonly http: NodeHttpHandler };
  readonly privateLink: { readonly accept: (channel: PrivateLinkChannel) => void };
}

/** The content type of every answer the handlers write themselves. */
const JSON_TYPE = "application/json; charset=utf-8";

/** A reason as JSON: its height as decimal text. */
const reasonJson = (reason: ProcessReason | null) =>
  reason === null ? null : { code: reason.code, height: reason.height === null ? null : String(reason.height), module: reason.module, point: reason.point };

/**
 * The lifecycle's body for `status` (design §5.3): the module API's error envelope, `not-serving`, its message from the
 * state's name only, with the state and the reason. [LM-5, AE-6]
 */
export function lifecycleBody(status: Pick<ProcessStatus, "state" | "reason">): string {
  return JSON.stringify({
    error: { code: "not-serving", message: `this handler does not serve while the process is ${status.state}` },
    state: status.state,
    reason: reasonJson(status.reason),
  });
}

/** Writes the lifecycle's 503 to `response`, with `extra` headers; nothing when the host already answered. */
function answerNotServing(response: ServerResponse, status: ProcessStatus, extra: Readonly<Record<string, string>>): void {
  try {
    if (response.headersSent) return;
    const body = lifecycleBody(status);
    response.writeHead(503, {
      "Content-Type": JSON_TYPE,
      "Content-Length": String(Buffer.byteLength(body)),
      "Cache-Control": "no-store",
      ...extra,
    });
    response.end(body);
  } catch {
    // The host's response could not be written (its connection ended): there is nothing to answer.
  }
}

/** Writes the lifecycle's 503 on an upgrade's socket, then ends it. */
function refuseUpgrade(socket: Duplex, status: ProcessStatus): void {
  try {
    const body = lifecycleBody(status);
    socket.end(
      "HTTP/1.1 503 Service Unavailable\r\n" +
        `Content-Type: ${JSON_TYPE}\r\nContent-Length: ${Buffer.byteLength(body)}\r\nConnection: close\r\n` +
        `${VERSION_HEADER}: ${UMBRADB_VERSION}\r\n\r\n${body}`,
    );
  } catch {
    socket.destroy();
  }
}

/** The host's log, never throwing: a line its log refuses is lost. */
function guardedLog(log: unknown): ((line: string) => void) | undefined {
  if (typeof log !== "function") return undefined;
  return (line) => {
    try {
      (log as (line: string) => void)(line);
    } catch {
      // The host's log threw: the line is lost, the process goes on.
    }
  };
}

/**
 * Where the engine takes the user modules from (design §6): a `{ file }`'s own `modules` export, `modulesFrom`'s module
 * file, or the `modules` objects (none: an empty list). [LM-7, CF-1]
 */
function userModulesOf(values: Readonly<Record<string, unknown>>): EngineInput["userModules"] & object {
  const config = values.config as Readonly<Record<string, unknown>> | undefined;
  if (config !== undefined && "file" in config) return { from: "config" };
  if (values.modulesFrom instanceof URL) return { from: values.modulesFrom };
  return { modules: (values.modules as readonly unknown[] | undefined) ?? [] };
}

/** The handle's `started` from the engine's: its module API's address, side and S, never the settings. [L52] */
const startedOf = (started: StartedProcess): UmbraDBStarted =>
  Object.freeze({ api: started.api, side: started.side, start: started.start });

/**
 * Starts UmbraDB in this process (see the module comment) and returns its handle at once; never throws. [LM-1, LM-9]
 */
export function startUmbraDB(options: UmbraDBOptions): UmbraDBHandle {
  const read = readOptions(options);
  const refusal = optionsRefusal(optionFindings(read)) ?? modulesGivenTwice(read.values);
  const values = refusal === null ? read.values : {};
  // The host's log, when it is one, also tells a refusal of the other options. [AE-3]
  const log = guardedLog(read.values.log);
  // The one read of the host's working directory. [G10, D-14]
  const cwd = typeof values.cwd === "string" ? resolve(process.cwd(), values.cwd) : process.cwd();
  const input: EngineInput = {
    // A refusal of the options is given before anything is read, so the configuration is then none. [LM-10]
    config: refusal === null ? (values.config as EngineInput["config"]) : { data: null },
    cwd,
    userModules: userModulesOf(values),
    network: (values.network as NetworkRequest | undefined) ?? {},
    ...(log === undefined ? {} : { log }),
    ...(values.signal === undefined ? {} : { signal: values.signal as AbortSignal }),
    ...(values.source === undefined ? {} : { source: values.source as InMemoryBlockSource }),
    ...(values.acceptPublicConfigHash === undefined ? {} : { acceptPublicConfigHash: values.acceptPublicConfigHash as string }),
    // The settings only the command acts on are refused once the process's core revision is known. [LM-2, G3, L47]
    library: {
      refusal,
      resolved: (resolved) => {
        const refused = librarySettingsRefusal(resolved.core);
        if (refused !== null) throw refused;
      },
    },
  };
  return handleOf(startProcess(input), log);
}

/** The facade over the engine's `handle` (see the module comment). [LM-9, L52] */
function handleOf(handle: ProcessHandle, log: ((line: string) => void) | undefined): UmbraDBHandle {
  const started = handle.started.then(startedOf);
  // As the engine's: a host that never attaches a handler gets no unhandled rejection. [LM-9]
  started.catch(() => undefined);
  const notServing: NodeHttpHandler = (_request, response) =>
    answerNotServing(response, handle.status(), { [VERSION_HEADER]: UMBRADB_VERSION });
  return Object.freeze({
    status: (): UmbraDBStatus => Object.freeze({ ...handle.status(), listening: handle.listening() }),
    started,
    ended: handle.ended,
    closed: handle.closed,
    stop: () => handle.stop(),
    pause: () => handle.pause(),
    resume: () => handle.resume(),
    backup: (target: string) => handle.backup(target),
    api: Object.freeze({
      http: notServing,
      upgrade: (_request: IncomingMessage, socket: Duplex) => refuseUpgrade(socket, handle.status()),
    }),
    admin: Object.freeze({
      http: (_request: IncomingMessage, response: ServerResponse) => answerNotServing(response, handle.status(), {}),
    }),
    privateLink: Object.freeze({
      accept: (channel: PrivateLinkChannel) => {
        try {
          channel.close();
        } catch {
          // A carrier whose close throws is ended as far as this process goes.
        }
        log?.("private link: a channel was closed (private-link-not-accepting): this process accepts no channels");
      },
    }),
  });
}
