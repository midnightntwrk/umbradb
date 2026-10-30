/**
 * The page's message network, as a worker sees it. The process transport between the core worker and each private
 * worker runs over `postMessage`, through `MessagePort`s the page hands out (`./broker.ts`). A worker that listens (the
 * core's `listen.transport`) names its address. A worker that connects (a private process's `coreTransport`) asks the
 * page for that address and gets one end of a new `MessageChannel`, whose other end goes to the listener. Nothing of it
 * leaves the page: no network request is made. [BR-1, BR-3, PP-4; design §8, §9.2]
 *
 * `./ws.ts` and `./http.ts` build `ws`'s and `node:http`'s small surface that `src/private/` uses on top of it, so the
 * transport's own code — its six messages, `hello` first, reads, `report`, lockstep, closes with their codes — runs in
 * the browser unchanged.
 */

/** What the page's broker and a worker say to each other on the worker's network port. */
export type NetworkMessage =
  | { readonly net: "listen"; readonly address: string }
  | { readonly net: "unlisten"; readonly address: string }
  | { readonly net: "connect"; readonly id: number; readonly address: string }
  | { readonly net: "connected"; readonly id: number; readonly port: MessagePort }
  | { readonly net: "refused"; readonly id: number }
  | { readonly net: "accept"; readonly address: string; readonly port: MessagePort };

let page: MessagePort | null = null;
const listeners = new Map<string, (port: MessagePort) => void>();
const connecting = new Map<number, { resolve(port: MessagePort): void; reject(error: Error): void }>();
let next = 1;

/** Joins the page's network through `port` (the worker's first message gives it). */
export function useNetwork(port: MessagePort): void {
  page = port;
  port.onmessage = (event: MessageEvent<NetworkMessage>) => {
    const message = event.data;
    if (message.net === "accept") {
      const accept = listeners.get(message.address);
      if (accept === undefined) message.port.close();
      else accept(message.port);
    } else if (message.net === "connected" || message.net === "refused") {
      const waiting = connecting.get(message.id);
      connecting.delete(message.id);
      if (message.net === "connected") waiting?.resolve(message.port);
      else waiting?.reject(Object.assign(new Error("nothing listens at that address on the page"), { code: "ECONNREFUSED" }));
    }
  };
}

function pagePort(): MessagePort {
  if (page === null) throw new Error("this worker has not joined the page's message network");
  return page;
}

/** Listens at `address`: each connection to it comes to `accept` as a port. */
export function listen(address: string, accept: (port: MessagePort) => void): void {
  if (listeners.has(address)) {
    throw Object.assign(new Error(`address in use on the page: ${address}`), { code: "EADDRINUSE" });
  }
  listeners.set(address, accept);
  pagePort().postMessage({ net: "listen", address } satisfies NetworkMessage);
}

/** Stops listening at `address`. */
export function unlisten(address: string): void {
  if (!listeners.delete(address)) return;
  pagePort().postMessage({ net: "unlisten", address } satisfies NetworkMessage);
}

/** Connects to `address`: resolves with this end's port, or rejects (`ECONNREFUSED`) when nothing listens there. */
export function connect(address: string): Promise<MessagePort> {
  const id = next++;
  return new Promise<MessagePort>((resolve, reject) => {
    connecting.set(id, { resolve, reject });
    try {
      pagePort().postMessage({ net: "connect", id, address } satisfies NetworkMessage);
    } catch (error) {
      connecting.delete(id);
      reject(error as Error);
    }
  });
}
