/**
 * The runner's side of the admin endpoints (`openspec/changes/core-arch/specs/admin-endpoints/spec.md` AE-1–AE-3,
 * AE-6; `design.md` §1; CORE-ARCH §4.18): what a process (`../runner/process.ts`, `startProcess` with `admin`) runs on
 * its main thread for them — the heartbeat, the publication of `status()`, and the admin listener's life.
 *
 * - **From `startProcess` on:** the heartbeat ticks every second (`../runner/heartbeat.ts`), and each tick publishes the
 *   snapshot of `status()` (`./snapshot.ts`) when it changed; so does every step the runner tells — startup's end,
 *   processing's end, the stop's start ({@link ProcessAdmin.follow}, {@link ProcessAdmin.publish}).
 * - **The listener** starts as soon as the configuration gives its address: {@link ProcessAdmin.serve}, once the
 *   process's `core` revision is known (Q102) and before the database opens, on its `listen.admin` (CF-4's default
 *   `0.0.0.0:8081`), its liveness timeout and its redaction; a listener that cannot listen refuses startup (Node.js's
 *   error, the runner's `listen-failed`, Q115). A startup refused before that ({@link ProcessAdmin.refused}) still
 *   answers — on the configuration's `listen.admin` as loaded when it is an address ({@link earlyAdminAddress}), else on
 *   CF-4's default (Q127, shipped A) —, its reason redacted by the configuration's secrets as the validation reads
 *   them; a listener that cannot listen then is logged.
 * - **At `stop()`**, after the database closed: {@link ProcessAdmin.close} ends the heartbeat and the listener's
 *   thread. Nothing of it is left to keep Node.js alive.
 */

import { buildCoreVersion } from "../config/build.js";
import { CORE_ENTRY_ID } from "../config/entries.js";
import { DEFAULT_ADMIN_ADDRESS } from "../config/core-settings.js";
import { type PlainData, samePlainData } from "../config/plain-data.js";
import { configRedactor, type Redactor } from "../config/redact.js";
import type { CheckedConfig, CheckedEntry, ConfigInput } from "../config/validate.js";
import { parseAddress } from "../runner/api-server.js";
import { Heartbeat } from "../runner/heartbeat.js";
import type { ProcessStatus } from "../runner/process.js";
import { earlyRedactor, shownSettings } from "./redaction.js";
import { type AdminServer, type AdminStarter, startAdminServer } from "./server.js";
import { DEFAULT_LIVENESS_TIMEOUT_MS, snapshotOf } from "./snapshot.js";
import type { AdminSnapshot, ConfigSnapshot } from "./types.js";

/** Whether `value` is an object (not null, not a list). */
const isObject = (value: unknown): value is Readonly<Record<string, unknown>> =>
  typeof value === "object" && value !== null && !Array.isArray(value);

/** Whether `value` is an address `host:port` (CF-4), as the listener parses it. */
function isAddress(value: unknown): value is string {
  try {
    parseAddress(value as string);
    return true;
  } catch {
    return false;
  }
}

/**
 * Where a startup refused before its configuration was validated listens (Q127, shipped A): the `listen.admin` of
 * the loaded configuration's latest `core` entry of the build's version (Q102's revision, read without the validation),
 * when it is an address; otherwise — no such entry, an entry whose `listen` names no admin address (CF-4's default
 * applies), an address that is not one, no configuration loaded — CF-4's default, `0.0.0.0:8081`.
 */
export function earlyAdminAddress(data: unknown): string {
  const entries = isObject(data) && Array.isArray(data.entries) ? (data.entries as readonly unknown[]) : [];
  const version = buildCoreVersion() as unknown as PlainData;
  let latest: Readonly<Record<string, unknown>> | undefined;
  for (const entry of entries) {
    if (!isObject(entry) || entry.id !== CORE_ENTRY_ID || !Number.isSafeInteger(entry.start)) continue;
    if (!samePlainData(entry.version as PlainData, version)) continue;
    if (latest === undefined || (entry.start as number) > (latest.start as number)) latest = entry;
  }
  const listen = isObject(latest?.config) ? latest.config.listen : undefined;
  const admin = isObject(listen) ? listen.admin : undefined;
  return isAddress(admin) ? admin : DEFAULT_ADMIN_ADDRESS;
}

/** What a {@link ProcessAdmin} takes. */
export interface ProcessAdminOptions {
  /** The process's `status()`. */
  readonly status: () => ProcessStatus;
  /** The process's log (its redaction applied). */
  readonly log: (line: string) => void;
  /** How the listener starts: {@link startAdminServer} (its worker thread) unless given (the negative controls'). */
  readonly start?: AdminStarter;
}

/** The runner's side of the admin endpoints (see the module comment). */
export class ProcessAdmin {
  readonly #status: () => ProcessStatus;
  readonly #log: (line: string) => void;
  readonly #start: AdminStarter;
  readonly #heartbeat: Heartbeat;
  #redactor: Redactor = earlyRedactor(undefined);
  #liveness = DEFAULT_LIVENESS_TIMEOUT_MS;
  #config: ConfigSnapshot = Object.freeze({ core: null });
  #loaded: ConfigInput | undefined;
  /** The listener: starting, listening, or failed (once tried, never again). */
  #listening: Promise<AdminServer | undefined> | undefined;
  #server: AdminServer | undefined;
  #published: string | undefined;
  #closed = false;
  #closing: Promise<void> | undefined;

  /** Starts the heartbeat, which publishes at each tick. */
  constructor(options: ProcessAdminOptions) {
    this.#status = options.status;
    this.#log = options.log;
    this.#start = options.start ?? startAdminServer;
    this.#heartbeat = new Heartbeat(() => this.publish());
  }

  /** The configuration as loaded, not yet validated: for a startup refused before it is ({@link refused}). */
  loaded(input: ConfigInput): void {
    this.#loaded = input;
    this.#redactor = earlyRedactor(input);
  }

  /**
   * The process's `core` revision is known (`core` of `checked`): starts the listener on its `listen.admin`, with its
   * liveness timeout and the configuration's redaction; resolves once it listens, rejects when it cannot.
   */
  async serve(checked: CheckedConfig, core: CheckedEntry): Promise<void> {
    if (this.#closed || this.#listening !== undefined) return;
    const settings = core.settings as Readonly<Record<string, unknown>>;
    this.#redactor = configRedactor(checked);
    this.#liveness = settings.livenessTimeoutMs as number;
    this.#config = Object.freeze({ core: Object.freeze({ start: core.start, settings: shownSettings(this.#redactor, core) }) });
    const { admin } = settings.listen as { readonly admin: string };
    await this.#listen(admin, true);
  }

  /**
   * Startup refused before {@link serve}: starts the listener on {@link earlyAdminAddress} of the configuration as
   * loaded; a listener that cannot listen is logged. Nothing when the listener was tried already.
   */
  async refused(): Promise<void> {
    if (this.#closed || this.#listening !== undefined) return;
    await this.#listen(earlyAdminAddress(this.#loaded?.config.data), false);
  }

  /** Starts the listener at `address`; its failure rejects when `rethrow`, else is logged. */
  async #listen(address: string, rethrow: boolean): Promise<void> {
    const first = this.#snapshot();
    const listening = this.#start({
      address,
      beat: this.#heartbeat.buffer,
      snapshot: first,
      onFailure: (error) => this.#log(`admin endpoints failed: ${error.message}`),
    }).then(
      (server) => {
        this.#server = server;
        this.#published = JSON.stringify(first);
        this.#log(`admin endpoints listening on ${server.host}:${server.port}`);
        // What changed while it started.
        this.publish();
        return server;
      },
      (error: unknown) => {
        if (rethrow) throw error;
        this.#log(`admin endpoints cannot listen on ${address}: ${(error as Error).message}`);
        return undefined;
      },
    );
    this.#listening = listening.catch(() => undefined);
    await listening;
  }

  /** The snapshot of `status()` now. */
  #snapshot(): AdminSnapshot {
    return snapshotOf(this.#status(), { livenessTimeoutMs: this.#liveness, redactor: this.#redactor, config: this.#config });
  }

  /** Publishes the snapshot of `status()` to the listener when it changed since the last one it was sent. */
  publish(): void {
    if (this.#closed || this.#server === undefined) return;
    const snapshot = this.#snapshot();
    const text = JSON.stringify(snapshot);
    if (text === this.#published) return;
    this.#published = text;
    this.#server.publish(snapshot);
  }

  /** Publishes once each of `steps` settles (startup's end, processing's end). */
  follow(...steps: readonly Promise<unknown>[]): void {
    for (const step of steps) void step.then(() => this.publish(), () => this.publish());
  }

  /** Ends the heartbeat, then the listener and its thread (waiting for one still starting); calling it again: the same. */
  close(): Promise<void> {
    this.#closing ??= (async () => {
      this.#closed = true;
      this.#heartbeat.stop();
      const server = await this.#listening;
      await server?.close();
    })();
    return this.#closing;
  }
}
