/**
 * The Web Workers a call's work is spread over (`ipir-worker.js`, `multiply-worker.js`), as the three sides use them:
 *
 * - the client (`./worker.ts`, itself a Web Worker) asks for one with {@link startCallWorker} and talks to it over a
 *   `MessagePort`;
 * - the page (`./page.ts`) starts it ({@link serveCallWorkers}) and hands it the other end of the port;
 * - the started worker serves that port ({@link onCallWorkerPort}).
 *
 * The page starts them, not the client: a worker that starts its own workers fails to load their scripts in some
 * embedded browsers, while a page's workers load everywhere. Typed arrays over a `SharedArrayBuffer` and compiled
 * WebAssembly modules pass through the port as they would through the worker itself (the page is cross-origin
 * isolated, `./serve.ts`).
 */

/** The scripts the page starts on the client's request, and no other. */
export const CALL_WORKER_SCRIPTS = ["ipir-worker.js", "multiply-worker.js"] as const;
export type CallWorkerScript = (typeof CALL_WORKER_SCRIPTS)[number];

interface StartMessage {
  readonly startCallWorker: { readonly script: CallWorkerScript; readonly n: number; readonly port: MessagePort };
}
interface FailedMessage {
  readonly callWorkerFailed: { readonly n: number; readonly message: string };
}
const STOP = { stopCallWorker: true } as const;

// ── the client's side ────────────────────────────────────────────────────────────────────────────────────────────

/** A worker the page started for the client. */
export interface CallWorker {
  /** Messages to and from the worker. */
  readonly port: MessagePort;
  /** Called if the worker's script fails to load or throws outside a message. */
  onFail(handler: (error: Error) => void): void;
  /** Stops the worker. */
  stop(): void;
}

const failHandlers = new Map<number, (error: Error) => void>();
let nextWorker = 1;

/** Client: asks the page for a worker running `script`. */
export function startCallWorker(script: CallWorkerScript): CallWorker {
  const n = nextWorker++;
  const { port1, port2 } = new MessageChannel();
  (self as unknown as { postMessage(message: StartMessage, transfer: Transferable[]): void }).postMessage({ startCallWorker: { script, n, port: port2 } }, [port2]);
  return {
    port: port1,
    onFail: (handler) => void failHandlers.set(n, handler),
    stop() {
      failHandlers.delete(n);
      port1.postMessage(STOP);
      port1.close();
    },
  };
}

/** Client: true when `data` is the page's word that a call worker failed (passed on to that worker's handler). */
export function callWorkerFailed(data: unknown): boolean {
  const failed = (data as Partial<FailedMessage> | null)?.callWorkerFailed;
  if (failed === undefined) return false;
  failHandlers.get(failed.n)?.(new Error(failed.message));
  return true;
}

// ── the page's side ──────────────────────────────────────────────────────────────────────────────────────────────

/**
 * Page: returns a function that, given a message from the client's worker, starts the call worker it asks for and
 * returns true, or returns false for any other message.
 */
export function serveCallWorkers(client: Worker): (data: unknown) => boolean {
  return (data) => {
    const start = (data as Partial<StartMessage> | null)?.startCallWorker;
    if (start === undefined) return false;
    const { script, n, port } = start;
    const failed = (message: string): void => client.postMessage({ callWorkerFailed: { n, message } } satisfies FailedMessage);
    if (!CALL_WORKER_SCRIPTS.includes(script)) {
      failed(`the page starts no worker ${JSON.stringify(script)}`);
      return true;
    }
    try {
      const worker = new Worker(script, { type: "module", name: script });
      worker.onerror = (event) => failed(event.message || `${script} failed to load`);
      worker.postMessage({ port }, [port]);
    } catch (error) {
      failed(error instanceof Error ? error.message : String(error));
    }
    return true;
  };
}

// ── the started worker's side ────────────────────────────────────────────────────────────────────────────────────

/**
 * Call worker: `serve` answers each message that arrives on the client's port and returns its reply with the buffers
 * to move; the worker closes itself when the client stops it.
 */
export function onCallWorkerPort<Task, Reply>(serve: (task: Task) => { reply: Reply; transfer: Transferable[] }): void {
  self.onmessage = (event: MessageEvent<{ port: MessagePort }>) => {
    const { port } = event.data;
    port.onmessage = (message: MessageEvent<Task | typeof STOP>) => {
      if ((message.data as Partial<typeof STOP> | null)?.stopCallWorker === true) {
        port.close();
        self.close();
        return;
      }
      const { reply, transfer } = serve(message.data as Task);
      port.postMessage(reply, transfer);
    };
  };
}
