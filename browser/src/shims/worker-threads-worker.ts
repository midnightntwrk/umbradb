/**
 * `node:worker_threads` inside a worker the browser build starts with `./worker-threads-host.ts`'s `Worker` — the
 * ledger worker, whose entry is `src/ledger/worker/entry.ts` unchanged (`openspec/changes/core-arch/design.md` §5.3,
 * §9.2; task 16.1): `workerData` is the first message's, and `parentPort` the worker's own port. {@link runEntry}
 * waits for that first message, then imports the entry, which reads `workerData` as it starts.
 *
 * A Web Worker's port delivers each message as it comes, listener or not, while a Node.js port holds messages until a
 * listener is attached; the entry attaches its listener only once it has loaded its ledger packages, and the host may
 * send requests meanwhile. So every message after the first is held here, in order, until `parentPort.on("message")`
 * is called, and then given to it.
 */

/** The worker's global scope, as this module uses it. */
interface Scope {
  postMessage(value: unknown): void;
  addEventListener(type: "message", listener: (event: MessageEvent) => void): void;
}

const scope = globalThis as unknown as Scope;

const held: unknown[] = [];
let deliver: ((value: unknown) => void) | null = null;
let first: ((value: unknown) => void) | null = null;
const firstMessage = new Promise<unknown>((resolve) => {
  first = resolve;
});

scope.addEventListener("message", (event) => {
  if (first !== null) {
    const resolve = first;
    first = null;
    resolve(event.data);
    return;
  }
  if (deliver === null) held.push(event.data);
  else deliver(event.data);
});

/** The data the host gave the worker: set from its first message before the entry runs. */
export let workerData: unknown;

export const isMainThread = false;

export const parentPort = Object.freeze({
  postMessage(value: unknown): void {
    scope.postMessage(value);
  },
  on(event: string, listener: (value: unknown) => void): unknown {
    if (event !== "message") return parentPort;
    deliver = listener;
    for (const value of held.splice(0)) listener(value);
    return parentPort;
  },
});

/** Waits for the host's first message, takes its `workerData`, then runs `entry` (an import of the worker's entry). */
export async function runEntry(entry: () => Promise<unknown>): Promise<void> {
  workerData = ((await firstMessage) as { readonly workerData?: unknown }).workerData;
  await entry();
}

export class Worker {
  constructor() {
    throw new Error("the ledger worker starts no worker of its own");
  }
}
