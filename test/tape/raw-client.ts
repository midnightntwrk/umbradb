import { WebSocket } from "ws";

/**
 * A bare JSON-RPC client for the tape node's tests (task 9.1): one WebSocket, every frame the tape node sends kept in
 * arrival order, as text and parsed, so a test can check the exact frames — the ids, the notifications and their order
 * — that the node client (`src/node/`) reads for it in `node-client.test.ts`.
 *
 * **Barriers instead of waiting.** The tape node reads a connection's frames in order and sends every answer that is
 * not delayed while it reads the request, with the notifications that answer lets through right after it. So once the
 * answer to a later request has arrived, every frame the node sent for the earlier ones without a delay has arrived
 * too: {@link RawClient.barrier} sends a request no tape holds and waits for its `not-on-tape` answer, which lets a
 * test check that something has *not* been sent (a delayed answer, a notification held back, a call that times out)
 * without waiting any length of time.
 */

/** A frame the tape node sent, parsed. */
export interface Frame {
  readonly jsonrpc: "2.0";
  readonly id?: number | string | null;
  readonly result?: unknown;
  readonly error?: { readonly code: number; readonly message: string; readonly data?: unknown };
  readonly method?: string;
  readonly params?: { readonly subscription: number | string; readonly result: unknown };
}

/** The method of a barrier request: no tape of these tests records it. */
export const BARRIER_METHOD = "test_barrier";

/** How long, in real time, a test waits for a frame the node must send at once, before it fails naming it. */
const WAIT_MS = 15_000;

export class RawClient {
  /** Every frame received, as text, in arrival order. */
  readonly texts: string[] = [];
  /** Every frame received, parsed, in arrival order. */
  readonly frames: Frame[] = [];
  /** Resolves with the close code once the connection has ended. */
  readonly closed: Promise<number>;

  readonly #socket: WebSocket;
  #nextId = 1;
  #waiters: { readonly match: (frame: Frame) => boolean; readonly resolve: (frame: Frame) => void }[] = [];

  private constructor(socket: WebSocket, closed: Promise<number>) {
    this.#socket = socket;
    this.closed = closed;
    socket.on("message", (data) => {
      const text = String(data);
      const frame = JSON.parse(text) as Frame;
      this.texts.push(text);
      this.frames.push(frame);
      for (const waiter of [...this.#waiters]) {
        if (!waiter.match(frame)) continue;
        this.#waiters = this.#waiters.filter((other) => other !== waiter);
        waiter.resolve(frame);
      }
    });
  }

  /** Opens a connection to `url`; resolves once it is open. */
  static open(url: string): Promise<RawClient> {
    const socket = new WebSocket(url);
    const closed = new Promise<number>((resolve) => socket.on("close", (code) => resolve(code)));
    socket.on("error", () => {});
    return new Promise((resolve, reject) => {
      socket.once("open", () => resolve(new RawClient(socket, closed)));
      closed.then((code) => reject(new Error(`the connection ended before it opened (${code})`)));
    });
  }

  /** Sends a text frame as it is. */
  send(text: string): void {
    this.#socket.send(text);
  }

  /** Sends `bytes` as a text frame, UTF-8 or not. */
  sendTextBytes(bytes: Uint8Array): void {
    this.#socket.send(bytes, { binary: false });
  }

  /** Sends a JSON-RPC request and returns its id (the next number unless `id` is given). */
  request(method: string, params: unknown, id: number | string = this.#nextId++): number | string {
    this.send(JSON.stringify({ jsonrpc: "2.0", id, method, params }));
    return id;
  }

  /** Sends a request and resolves with its answer. */
  call(method: string, params: unknown, id?: number | string): Promise<Frame> {
    return this.answer(this.request(method, params, id));
  }

  /** Resolves with the answer to the request `id`, whenever it arrives (at once if it has). */
  answer(id: number | string): Promise<Frame> {
    return this.waitFor((frame) => frame.id === id, `the answer to request ${JSON.stringify(id)}`);
  }

  /** Resolves with the first frame, received or to come, that `match` accepts; fails naming `what` after a while. */
  waitFor(match: (frame: Frame) => boolean, what: string): Promise<Frame> {
    const found = this.frames.find(match);
    if (found !== undefined) return Promise.resolve(found);
    return new Promise((resolve, reject) => {
      const timer = setTimeout(() => {
        this.#waiters = this.#waiters.filter((other) => other.match !== match);
        reject(new Error(`no frame came for ${what}`));
      }, WAIT_MS);
      this.#waiters.push({
        match,
        resolve: (frame) => {
          clearTimeout(timer);
          resolve(frame);
        },
      });
    });
  }

  /** Whether the answer to request `id` has arrived. */
  answered(id: number | string): boolean {
    return this.frames.some((frame) => frame.id === id);
  }

  /** The notifications received, in order. */
  notifications(): Frame[] {
    return this.frames.filter((frame) => frame.id === undefined);
  }

  /** Waits for the answer to a request no tape holds: every frame sent without a delay before it has arrived. */
  async barrier(): Promise<void> {
    const frame = await this.call(BARRIER_METHOD, []);
    if (frame.error?.message !== `not-on-tape: ${BARRIER_METHOD}`) {
      throw new Error(`the barrier was answered ${JSON.stringify(frame)}`);
    }
  }

  /** Stops reading the connection, so that what the node writes backs up once the system's buffers are full. */
  pause(): void {
    this.#socket.pause();
  }

  /** Reads the connection again. */
  resume(): void {
    this.#socket.resume();
  }

  /** Closes the connection and waits until it has ended. */
  async close(): Promise<void> {
    this.#socket.close();
    await this.closed;
  }
}
