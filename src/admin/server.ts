/**
 * The admin listener in a worker thread of its own (`openspec/changes/core-arch/specs/admin-endpoints/spec.md` AE-1;
 * `design.md` §1; CORE-ARCH §4.18): {@link startAdminServer} starts the thread (`./worker.ts`, which runs
 * `./serve.ts`) on `listen.admin` — parsed by the module API listener's `parseAddress`, the one thing the two listeners
 * share (task 5.2a) — with the heartbeat's shared memory and the first snapshot, and resolves once it listens.
 * {@link AdminServer.publish} sends it each new snapshot; {@link AdminServer.close} ends its listener, then its thread,
 * so nothing of it outlives the process's `stop()`: a thread cannot outlive its process in any case.
 *
 * **The thread's entry** ({@link workerEntry}): beside a build, the compiled `worker.js`; from the TypeScript sources
 * (development, the tests), `worker.ts` through Node.js's type stripping, with a resolve hook that maps the sources'
 * `.js` imports to their `.ts` files — so the thread loads exactly the sources the main thread does.
 */

import { existsSync } from "node:fs";
import { Worker } from "node:worker_threads";
import { parseAddress } from "../runner/api-server.js";
import type { FromAdmin, ToAdmin } from "./serve.js";
import type { AdminSnapshot } from "./types.js";

/** How long closing waits for the listener to close before it ends the thread anyway. */
export const ADMIN_CLOSE_TIMEOUT_MS = 2_000;

/** What starting an admin listener takes. */
export interface AdminStartOptions {
  /** `listen.admin` (CF-4): `host:port`. */
  readonly address: string;
  /** The heartbeat's shared memory (`../runner/heartbeat.ts`). */
  readonly beat: SharedArrayBuffer;
  /** The snapshot to answer from until the first {@link AdminServer.publish}. */
  readonly snapshot: AdminSnapshot;
  /** Told when the listener's thread fails after it listened (it then answers no more). */
  readonly onFailure?: (error: Error) => void;
}

/** An admin listener that listens. */
export interface AdminServer {
  /** The address it listens on, as the system reports it. */
  readonly host: string;
  /** The port it listens on: `listen.admin`'s, or the one the system gave for port 0. */
  readonly port: number;
  /** Its thread's id while the thread runs, -1 once the thread ended; null for a listener on the main thread. */
  readonly threadId: number | null;
  /** Sends it the snapshot to answer from; harmless once it closed. */
  publish(snapshot: AdminSnapshot): void;
  /** Ends its listener and every connection, then its thread; resolves once both ended. Calling it again: the same. */
  close(): Promise<void>;
}

/** How a process starts its admin listener: {@link startAdminServer}, or a negative control's. */
export type AdminStarter = (options: AdminStartOptions) => Promise<AdminServer>;

/** The thread's entry for the server module at `base` (see the module comment). */
export function workerEntry(base: string = import.meta.url): URL {
  const compiled = new URL("./worker.js", base);
  if (existsSync(compiled)) return compiled;
  const source = new URL("./worker.ts", base);
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

/** The error of a listener that cannot listen: Node.js's code, and `syscall` `listen` (the runner's `listen-failed`). */
function listenError(code: string, address: string): Error {
  return Object.assign(new Error(`admin listener: listen ${code} on ${address}`), { code, syscall: "listen" });
}

/**
 * Starts the admin listener in a worker thread of its own (see the module comment): resolves once it listens; rejects
 * with Node.js's code and `syscall: "listen"` when it cannot, with a `TypeError` for an address that is not
 * `host:port`, and when the thread ends first. `entry` is the thread's entry ({@link workerEntry} unless given).
 */
export async function startAdminServer(options: AdminStartOptions, entry: URL = workerEntry()): Promise<AdminServer> {
  const { host, port } = parseAddress(options.address);
  const worker = new Worker(entry, { workerData: { host, port, beat: options.beat, snapshot: options.snapshot } });
  const exited = new Promise<void>((resolve) => worker.once("exit", () => resolve()));
  const closed = new Promise<void>((resolve) =>
    worker.on("message", (message: FromAdmin) => {
      if (message.type === "closed") resolve();
    }),
  );
  const listening = await new Promise<Extract<FromAdmin, { type: "listening" }>>((resolve, reject) => {
    const settle = (message: FromAdmin) => {
      if (message.type === "listening") resolve(message);
      else if (message.type === "listen-failed") reject(listenError(message.code, options.address));
    };
    worker.on("message", settle);
    worker.once("error", reject);
    worker.once("exit", (code) => reject(new Error(`the admin worker exited with code ${code} before it listened`)));
  }).catch(async (error: unknown) => {
    await worker.terminate();
    throw error;
  });
  worker.removeAllListeners("error");
  worker.on("error", (error: Error) => options.onFailure?.(error));
  let ended = false;
  void exited.then(() => {
    ended = true;
  });
  let closing: Promise<void> | undefined;
  return {
    host: listening.host,
    port: listening.port,
    get threadId() {
      return worker.threadId;
    },
    publish: (snapshot) => {
      if (!ended) worker.postMessage({ type: "snapshot", snapshot } satisfies ToAdmin);
    },
    close: () => {
      closing ??= (async () => {
        if (!ended) {
          worker.postMessage({ type: "close" } satisfies ToAdmin);
          let timer: NodeJS.Timeout | undefined;
          await Promise.race([closed, exited, new Promise<void>((resolve) => (timer = setTimeout(resolve, ADMIN_CLOSE_TIMEOUT_MS)))]);
          clearTimeout(timer);
          await worker.terminate();
        }
        await exited;
      })();
      return closing;
    },
  };
}
