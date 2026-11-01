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
 * listener, no backup at the stop, no admin listener unless the request asks admin to listen, the worker threads'
 * output into the host's `log` — and the host's `log` only when given; the configuration is the one given, `{ file }` or `{ data }`, no file looked for. A
 * `core` revision that sets `backupAtStop` or `backupOnSignal`, which only the command acts on, is refused
 * (`library-setting-refused`). [LM-2, G1–G5, L47]
 *
 * **An in-memory chain** (`source`): read only when it is exactly an `InMemoryBlockSource` with none of the engine's hook
 * members, on a public process (`source-refused`); the process then makes no node client, and `node`, validated as the
 * configuration format requires, is never contacted. [LM-8]
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
 * **The network.** A host's request is held to its shape here (`network`, design §5.1) and given to the engine, whose
 * network plan (`planNetwork`) combines it with the addresses the configuration writes and refuses what it gets wrong
 * (`network-address-conflict`, `private-link-misconfigured`): nothing listens or connects unless asked. The admin
 * listener's thread (the engine's admin port) is given only when the request asks admin to listen. [LM-3, G4, G9, N1]
 *
 * **The handlers** exist from the return on, whether or not a surface listens; they are the engine's. The module API's
 * (`api.http`, `api.upgrade`) apply the module API listener's per-request and per-message rules and headers, and answer
 * 503 with the lifecycle's body — `{ error: { code: "not-serving", message }, state, reason }` — while the module API
 * does not serve (starting, refused, after a stop's drain). Admin's (`admin.http`) answers the four endpoints from the
 * process's snapshot in memory, in every state and after `closed`. `privateLink.accept(channel)` closes a channel the
 * process does not accept (`private-link-not-accepting`), logs a line and throws nothing. The host owns what its own
 * server does: TLS, authentication, Origin policy, connection and rate limits, and its own error answers.
 * [LM-4, LM-5, LM-6, N7, N8, N9]
 */

import { resolve } from "node:path";
import { startAdminServer } from "../admin/server.js";
import type { BackupWritten } from "../backup/backup.js";
import type { ProcessSide } from "../config/core-settings.js";
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
  librarySettingsRefusal,
  modulesGivenTwice,
  optionFindings,
  optionsRefusal,
  privateSourceRefusal,
  readOptions,
  sourceRefusal,
} from "./options.js";

/** An address a surface listens at once bound: the host as the system reports it, and the port. [LM-3, LM-9] */
export interface Address {
  readonly host: string;
  readonly port: number;
}

export type { NodeHttpHandler, NodeUpgradeHandler };

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
  /**
   * An in-memory chain in place of the node, on a public process: exactly an `InMemoryBlockSource`, no subclass. With it
   * the process makes no node client and never contacts `node`. [LM-8]
   */
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

/** Whether the network request, as checked, asks admin to listen: `true`, or `{ host?, port }`. [LM-3, G9] */
function listensForAdmin(network: unknown): boolean {
  const admin = (network as NetworkRequest | undefined)?.admin;
  return admin === true || (typeof admin === "object" && admin !== null);
}

/** The handle's `started` from the engine's: its module API's address, side and S, never the settings. [L52] */
const startedOf = (started: StartedProcess): UmbraDBStarted =>
  Object.freeze({ api: started.api, side: started.side, start: started.start });

/**
 * What `startUmbraDB` gives the engine for `options`, and the host's `log` (guarded) for the handle: the options read
 * once and checked, their refusal given to the engine to throw at its configuration step. Exported for the tests, which
 * start the engine with this input plus a seam of their own. [LM-1, LM-10]
 */
export function engineInputOf(options: UmbraDBOptions): {
  readonly input: EngineInput;
  readonly log: ((line: string) => void) | undefined;
} {
  const read = readOptions(options);
  const refusal =
    optionsRefusal(optionFindings(read)) ?? modulesGivenTwice(read.values) ?? sourceRefusal(read.values.source);
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
    // The admin thread only when admin is asked to listen (`true`, or an address in code). [G4, G9, LM-3]
    ...(listensForAdmin(values.network) ? { adminListener: startAdminServer } : {}),
    ...(log === undefined ? {} : { log }),
    ...(values.signal === undefined ? {} : { signal: values.signal as AbortSignal }),
    // The host's in-memory chain: the process's block source, and no node client. [LM-8, L49]
    ...(values.source === undefined ? {} : { inMemorySource: values.source as InMemoryBlockSource }),
    ...(values.acceptPublicConfigHash === undefined ? {} : { acceptPublicConfigHash: values.acceptPublicConfigHash as string }),
    // The settings only the command acts on are refused once the process's core revision is known. [LM-2, G3, L47]
    library: {
      refusal,
      resolved: (resolved) => {
        const refused = privateSourceRefusal(resolved.side, values.source) ?? librarySettingsRefusal(resolved.core);
        if (refused !== null) throw refused;
      },
    },
  };
  return { input, log };
}

/**
 * Starts UmbraDB in this process (see the module comment) and returns its handle at once; never throws. [LM-1, LM-9]
 */
export function startUmbraDB(options: UmbraDBOptions): UmbraDBHandle {
  const { input, log } = engineInputOf(options);
  return handleOf(startProcess(input), log);
}

/**
 * The facade over the engine's `handle` (see the module comment); `log` the host's, guarded. Exported for the tests,
 * which take the handle a host gets over an engine started with {@link engineInputOf}'s input plus a seam of their own
 * (a node client that counts its connections). [LM-9, L52]
 */
export function handleOf(handle: ProcessHandle, log: ((line: string) => void) | undefined): UmbraDBHandle {
  const started = handle.started.then(startedOf);
  // As the engine's: a host that never attaches a handler gets no unhandled rejection. [LM-9]
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
    // The engine's handlers, from the return on. [LM-4, LM-5]
    api: Object.freeze({ http: handle.api.http, upgrade: handle.api.upgrade }),
    admin: Object.freeze({ http: handle.admin.http }),
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
