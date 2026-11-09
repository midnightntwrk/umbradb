/**
 * `startUmbraDB`: UmbraDB run as a library, in the host program's own process. It starts the process through the
 * engine (`../runner/process.ts`, which `umbradb run` and the browser demo start through too) and returns its handle at
 * once.
 *
 * **It never throws.** Every option is read once and held to its shape (`./options.ts`); a malformed one, and every
 * refusal of the configuration, rejects {@link UmbraDBHandle.started} instead, the process ending `refused` by itself
 * (`closed` resolves).
 *
 * **It does nothing to the host program by default.** It gives the engine none of the command's ports — no SIGUSR2
 * listener, no backup at the stop, no admin listener unless the request asks admin to listen, the worker threads'
 * output into the host's `log` — and the host's `log` only when given; the configuration is the one given, `{ file }` or `{ data }`, no file looked for. A
 * `core` revision that sets `backupAtStop` or `backupOnSignal`, which only the command acts on, is refused
 * (`library-setting-refused`).
 *
 * **An in-memory chain** (`source`): read only when it is exactly an `InMemoryBlockSource` with none of the engine's hook
 * members, on a public process (`source-refused`); the process then makes no node client, and `node`, validated as the
 * configuration format requires, is never contacted.
 *
 * **User modules**: a `{ file }`'s own `modules` export; with `{ data }`, `modules` objects or
 * `modulesFrom`, a module file both threads import. Given twice, they are refused (`modules-given-twice`).
 *
 * **`cwd`.** Every relative path the process meets — a `{ file }`, a PGlite `path`, a backup's target — resolves
 * against `cwd`, the host's working directory (`process.cwd()`) unless given; a relative `cwd` resolves against it
 * once, here. This module is the one place a library process reads the working directory, and only for a `cwd` absent
 * or relative: an absolute one is used as it is. A working directory that cannot be read (removed under the host) is a
 * finding at `cwd` that refuses the options.
 *
 * **The handle is a facade** ({@link UmbraDBHandle}): exactly the members listed below, none of the engine's test seams
 * nor its `backup(out, seams)`; {@link UmbraDBStarted} holds the module API's address, the side and S — never the
 * checked settings, which hold the TLS key and the database's password.
 *
 * **The network.** A host's request is held to its shape here (`network`) and given to the engine, whose
 * network plan (`planNetwork`) combines it with the addresses the configuration writes and refuses what it gets wrong
 * (`network-address-conflict`, `private-link-misconfigured`): nothing listens or connects unless asked. The admin
 * listener's thread (the engine's admin port) is given only when the request asks admin to listen.
 *
 * **The handlers** exist from the return on, whether or not a surface listens; they are the engine's. The module API's
 * (`api.http`, `api.upgrade`) apply the module API listener's per-request and per-message rules and headers, and answer
 * 503 with the lifecycle's body — `{ error: { code: "not-serving", message }, state, reason }` — while the module API
 * does not serve (starting, refused, after a stop's drain). Admin's (`admin.http`) answers the four endpoints from the
 * process's snapshot in memory, in every state and after `closed`. `privateLink.accept(channel)` is the engine's: with
 * `publicSide: { channels: true }` it queues the channel until the link starts, then serves it as a session of the
 * link (`../private/core-channels.ts`); a channel the process does not accept — another request, after a refusal or
 * once stopping — is closed (`private-link-not-accepting`), a line logged, nothing thrown. `messagePortChannel`
 * (`./channels.ts`) adapts a `MessagePort` to a channel. The host owns what its own server and channels do: TLS,
 * authentication, Origin policy, connection and rate limits, and its own error answers.
 */

import { isAbsolute, resolve } from "node:path";
import { startAdminServer } from "../admin/server.js";
import type { BackupWritten } from "../backup/backup.js";
import type { ProcessSide } from "../config/core-settings.js";
import type { Finding } from "../config/validate.js";
import type { ModuleDeclaration } from "../modules/declaration.js";
import type { NodeHttpHandler, NodeUpgradeHandler } from "../runner/api-answers.js";
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
import {
  cwdUnreadable,
  librarySettingsRefusal,
  modulesGivenTwice,
  optionFindings,
  optionsRefusal,
  privateSourceRefusal,
  readOptions,
  sourceRefusal,
} from "./options.js";

/** An address a surface listens at once bound: the host as the system reports it, and the port. */
export interface Address {
  readonly host: string;
  readonly port: number;
}

export type { NodeHttpHandler, NodeUpgradeHandler };

/** The network request: every surface off unless asked. */
export type UmbraDBNetwork = NetworkRequest;

/** What `startUmbraDB` takes. */
export interface UmbraDBOptions {
  /** The configuration: a file (a path relative to {@link cwd}, or a file URL), or its data; required. */
  readonly config: { readonly file: string | URL } | { readonly data: unknown };
  /** The base of every relative path; `process.cwd()` unless given. */
  readonly cwd?: string;
  /** The user modules as objects, with `{ data }`; none of them may declare ledger tasks. */
  readonly modules?: readonly ModuleDeclaration[];
  /**
   * With `{ data }`: the URL of an ES module whose `modules` export lists the user modules, which the main thread and
   * the ledger worker both import — the way to give a module that declares ledger tasks.
   */
  readonly modulesFrom?: URL;
  /**
   * An in-memory chain in place of the node, on a public process: exactly an `InMemoryBlockSource`, no subclass. With it
   * the process makes no node client and never contacts `node`.
   */
  readonly source?: InMemoryBlockSource;
  /** Aborting it stops the process as {@link UmbraDBHandle.stop} does. */
  readonly signal?: AbortSignal;
  /** Where the process's log lines go, redacted, and the worker threads' output; nothing is written without it. */
  readonly log?: (line: string) => void;
  /** The public configuration hash a private process accepts at this start (`umbradb run --update-hash`). */
  readonly acceptPublicConfigHash?: string;
  /** The network request; no listener and no link unless asked. */
  readonly network?: UmbraDBNetwork;
}

/** How processing ended (the engine's). */
export type UmbraDBEnd = ProcessingEnd;

/** Why a process is refused or halted: a code, its height, module and point, never a message. */
export type UmbraDBReason = ProcessReason;

/** One of the conditions. */
export type UmbraDBCondition = ProcessCondition;

/** A backup written by {@link UmbraDBHandle.backup}: its file and its manifest. */
export type UmbraDBBackup = BackupWritten;

/** The process's state now: the engine's, and the addresses its surfaces are bound at. */
export interface UmbraDBStatus extends ProcessStatus {
  readonly listening: ProcessListening;
}

/** What a process that started gives: its module API's address (null without a listener), its side, and S. */
export interface UmbraDBStarted {
  readonly api: Address | null;
  readonly side: ProcessSide;
  readonly start: bigint;
}

/** A library process: exactly these members. */
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
  /** Writes a backup to `target` (relative to `cwd`), replacing the file there. */
  backup(target: string): Promise<UmbraDBBackup>;
  readonly api: { readonly http: NodeHttpHandler; readonly upgrade: NodeUpgradeHandler };
  readonly admin: { readonly http: NodeHttpHandler };
  readonly privateLink: { readonly accept: (channel: PrivateLinkChannel) => void };
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
 * Where the engine takes the user modules from: a `{ file }`'s own `modules` export, `modulesFrom`'s module
 * file, or the `modules` objects (none: an empty list).
 */
function userModulesOf(values: Readonly<Record<string, unknown>>): EngineInput["userModules"] & object {
  const config = values.config as Readonly<Record<string, unknown>> | undefined;
  if (config !== undefined && "file" in config) return { from: "config" };
  if (values.modulesFrom instanceof URL) return { from: values.modulesFrom };
  return { modules: (values.modules as readonly unknown[] | undefined) ?? [] };
}

/**
 * The process's `cwd` for `given`, the `cwd` option as read: one given absolute as it is, without reading the host's
 * working directory; else that directory — the one read of it — and a relative `cwd` resolved against it
 * once. When `process.cwd()` throws (the directory removed under the host), `unread` is the finding at `cwd` that
 * refuses the options through `started`: `startUmbraDB` never throws for it.
 */
function cwdOf(given: unknown): { readonly cwd: string } | { readonly unread: Finding } {
  if (typeof given === "string" && isAbsolute(given)) return { cwd: given };
  const relative = typeof given === "string" ? given : undefined;
  try {
    const host = process.cwd();
    return { cwd: relative === undefined ? host : resolve(host, relative) };
  } catch (error) {
    return { unread: cwdUnreadable(relative, error) };
  }
}

/** Whether the network request, as checked, asks admin to listen: `true`, or `{ host?, port }`. */
function listensForAdmin(network: unknown): boolean {
  const admin = (network as NetworkRequest | undefined)?.admin;
  return admin === true || (typeof admin === "object" && admin !== null);
}

/** The handle's `started` from the engine's: its module API's address, side and S, never the settings. */
const startedOf = (started: StartedProcess): UmbraDBStarted =>
  Object.freeze({ api: started.api, side: started.side, start: started.start });

/**
 * What `startUmbraDB` gives the engine for `options`: the options read once and checked, their refusal given to the
 * engine to throw at its configuration step, the host's `log` guarded. Exported for the tests, which start the engine
 * with this input plus a seam of their own.
 */
export function engineInputOf(options: UmbraDBOptions): { readonly input: EngineInput } {
  const read = readOptions(options);
  const directory = cwdOf(read.values.cwd);
  const refusal =
    optionsRefusal([...optionFindings(read), ...("unread" in directory ? [directory.unread] : [])]) ??
    modulesGivenTwice(read.values) ??
    sourceRefusal(read.values.source);
  const values = refusal === null ? read.values : {};
  // The host's log, when it is one, also tells a refusal of the other options.
  const log = guardedLog(read.values.log);
  const input: EngineInput = {
    // A refusal of the options is given before anything is read, so the configuration is then none.
    config: refusal === null ? (values.config as EngineInput["config"]) : { data: null },
    // A refused start resolves no path (its refusal is thrown at the configuration step's start): the working
    // directory that could not be read is then the `cwd` as given, or the empty path.
    cwd: "cwd" in directory ? directory.cwd : typeof read.values.cwd === "string" ? read.values.cwd : "",
    userModules: userModulesOf(values),
    network: (values.network as NetworkRequest | undefined) ?? {},
    // The admin thread only when admin is asked to listen (`true`, or an address in code).
    ...(listensForAdmin(values.network) ? { adminListener: startAdminServer } : {}),
    ...(log === undefined ? {} : { log }),
    ...(values.signal === undefined ? {} : { signal: values.signal as AbortSignal }),
    // The host's in-memory chain: the process's block source, and no node client.
    ...(values.source === undefined ? {} : { inMemorySource: values.source as InMemoryBlockSource }),
    ...(values.acceptPublicConfigHash === undefined ? {} : { acceptPublicConfigHash: values.acceptPublicConfigHash as string }),
    // The settings only the command acts on are refused once the process's core revision is known.
    library: {
      refusal,
      resolved: (resolved) => {
        const refused = privateSourceRefusal(resolved.side, values.source) ?? librarySettingsRefusal(resolved.core);
        if (refused !== null) throw refused;
      },
    },
  };
  return { input };
}

/**
 * Starts UmbraDB in this process (see the module comment) and returns its handle at once; never throws.
 */
export function startUmbraDB(options: UmbraDBOptions): UmbraDBHandle {
  return handleOf(startProcess(engineInputOf(options).input));
}

/**
 * The facade over the engine's `handle` (see the module comment). Exported for the tests, which take the handle a host
 * gets over an engine started with {@link engineInputOf}'s input plus a seam of their own (a node client that counts
 * its connections).
 */
export function handleOf(handle: ProcessHandle): UmbraDBHandle {
  const started = handle.started.then(startedOf);
  // As the engine's: a host that never attaches a handler gets no unhandled rejection.
  started.catch(() => undefined);
  return Object.freeze({
    status: (): UmbraDBStatus => Object.freeze({ ...handle.status(), listening: handle.listening() }),
    started,
    ended: handle.ended,
    closed: handle.closed,
    stop: () => handle.stop(),
    pause: () => handle.pause(),
    resume: () => handle.resume(),
    backup: (target: string) => handle.backup(target),
    // The engine's handlers, from the return on.
    api: Object.freeze({ http: handle.api.http, upgrade: handle.api.upgrade }),
    admin: Object.freeze({ http: handle.admin.http }),
    // The engine's: it queues, serves or refuses the channel, and never throws.
    privateLink: Object.freeze({ accept: (channel: PrivateLinkChannel) => handle.privateLink.accept(channel) }),
  });
}
