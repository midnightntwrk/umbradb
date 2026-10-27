import { connect, createServer, type Server, type Socket } from "node:net";

/**
 * A TCP proxy between a process and its PostgreSQL server that terminates the writer's backend at a `COMMIT` (task
 * 10.4; IN-11, A86): "the backend is terminated after the server committed h but before the client saw the result",
 * and "… before the server got the `COMMIT`", made deterministic. The process's `database` URL names the proxy
 * ({@link CommitProxy.url}); every connection it opens — the writer's session and the read pool's — goes through it.
 *
 * {@link CommitProxy.arm} arms it for the next `COMMIT` a client sends — the simple-protocol `Query` message
 * `Q, length 11, "COMMIT\0"`, which is how the database API ends every transaction (`src/db/postgres.ts`); reads end
 * with `ROLLBACK` and are not matched, so the connection that sends it is the writer's:
 * - `"before"`: the `COMMIT` is held, never forwarded, and the writer's backend is terminated with its transaction
 *   open, so the server rolls it back — nothing of it is committed;
 * - `"after"`: the `COMMIT` is forwarded, and once the server's `CommandComplete` for it (`C, length 11, "COMMIT\0"`) is
 *   read — sent after the commit is durable — it is held, and the writer's backend is terminated: the server
 *   committed, the client never learns it.
 * Terminating is the arm's `terminate` (`pg_terminate_backend` of the session holding the writer lock, through a
 * connection of the test's own: `ProcessDatabase.terminateWriter`), which resolves once PostgreSQL no longer lists the
 * backend; then the writer's connection to the client is ended, without anything more of the server's, so the client
 * sees its connection lost during the `COMMIT` (`connection-lost`, DB-13). The read pool's connections are left
 * alone. New connections then wait until the arm's `then` (a test's action while the process is away: another
 * writer's change) has completed, so the process's reconnected writer cannot come before it. Listens on 127.0.0.1 at
 * a port the system gives, of at least 10000 (the repository's rule for test ports).
 */

/** When the proxy terminates the writer: before forwarding the `COMMIT`, or after the server answered it. */
export type CommitFault = "before" | "after";

/** What a fault does (see the module comment). */
export interface CommitArm {
  /** Terminates the writer's backend; resolves once it is gone. */
  readonly terminate: () => Promise<unknown>;
  /** Runs while the process is away, before any new connection reaches the server. */
  readonly then?: () => Promise<void>;
}

/** A `COMMIT` sent on the simple protocol: `Q`, its length (4 + 7), the text and its terminator. */
const COMMIT_QUERY = Buffer.from([0x51, 0, 0, 0, 11, ...Buffer.from("COMMIT", "ascii"), 0]);
/** The server's `CommandComplete` for a `COMMIT`: `C`, its length (4 + 7), the tag and its terminator. */
const COMMIT_COMPLETE = Buffer.from([0x43, 0, 0, 0, 11, ...Buffer.from("COMMIT", "ascii"), 0]);

/** One proxied connection: the client's socket and the server's; `cut` once its fault began (nothing more passes). */
interface Pair {
  readonly client: Socket;
  readonly server: Socket;
  cut: boolean;
}

/** What a {@link CommitProxy.arm} asked for. */
interface Armed extends CommitArm {
  readonly fault: CommitFault;
  readonly done: () => void;
}

/** Whether `chunk`, after the last `tail` bytes of its stream, holds `pattern`. */
function holds(tail: Uint8Array, chunk: Buffer, pattern: Buffer): boolean {
  return Buffer.concat([tail, chunk]).includes(pattern);
}

/** The last `pattern.length - 1` bytes of `tail` followed by `chunk`: what a pattern split across chunks needs. */
function tailOf(tail: Uint8Array, chunk: Buffer, pattern: Buffer): Uint8Array {
  const joined = Buffer.concat([tail, chunk]);
  return Uint8Array.prototype.slice.call(joined, Math.max(0, joined.length - (pattern.length - 1)));
}

/** The proxy (see the module comment). */
export class CommitProxy {
  readonly #server: Server;
  readonly #upstream: { readonly host: string; readonly port: number };
  readonly #pairs = new Set<Pair>();
  #armed: Armed | undefined;
  /** While set, new connections wait for it before reaching the server. */
  #gate: Promise<void> | undefined;
  /** The faults made so far: each one's kind, or why it failed. */
  readonly #faults: string[] = [];

  private constructor(server: Server, upstream: { readonly host: string; readonly port: number }) {
    this.#server = server;
    this.#upstream = upstream;
  }

  /** Starts a proxy to the PostgreSQL server of `url` (a `postgres://` URL). */
  static async start(url: string): Promise<CommitProxy> {
    const parsed = new URL(url);
    const upstream = { host: parsed.hostname, port: Number(parsed.port) };
    const server = createServer();
    const proxy = new CommitProxy(server, upstream);
    server.on("connection", (client) => void proxy.#accept(client));
    for (let attempt = 0; ; attempt++) {
      const port = 10_000 + Math.floor(Math.random() * 50_000);
      const listening = await new Promise<boolean>((resolve) => {
        const failed = (): void => resolve(false);
        server.once("error", failed);
        server.listen(port, "127.0.0.1", () => {
          server.removeListener("error", failed);
          resolve(true);
        });
      });
      if (listening) break;
      if (attempt > 50) throw new Error("the commit proxy found no free port");
    }
    return proxy;
  }

  /** `url` with its host and port the proxy's. */
  url(url: string): string {
    const parsed = new URL(url);
    const address = this.#server.address();
    if (address === null || typeof address === "string") throw new Error("the commit proxy is not listening");
    parsed.hostname = "127.0.0.1";
    parsed.port = String(address.port);
    return parsed.toString();
  }

  /** The faults made so far, in order: each one's kind (`"before"`, `"after"`), or `"<kind> failed: <why>"`. */
  get faults(): readonly string[] {
    return [...this.#faults];
  }

  /**
   * Arms the proxy for the next `COMMIT` (see the module comment); resolves once it terminated the writer there, ended
   * its connection, and `then` completed.
   */
  arm(fault: CommitFault, arm: CommitArm): Promise<void> {
    if (this.#armed !== undefined) throw new Error("the commit proxy is armed already");
    return new Promise((resolve) => {
      this.#armed = { fault, ...arm, done: resolve };
    });
  }

  /** Closes the listener and every connection. */
  async close(): Promise<void> {
    for (const pair of this.#pairs) this.#end(pair);
    await new Promise<void>((resolve) => this.#server.close(() => resolve()));
  }

  async #accept(client: Socket): Promise<void> {
    client.pause();
    client.on("error", () => undefined);
    await this.#gate;
    if (client.destroyed) return;
    const server = connect(this.#upstream.port, this.#upstream.host);
    server.on("error", () => undefined);
    const pair: Pair = { client, server, cut: false };
    this.#pairs.add(pair);
    const forget = (): void => this.#end(pair);
    client.on("close", forget);
    server.on("close", forget);
    let clientTail: Uint8Array = new Uint8Array(0);
    let serverTail: Uint8Array = new Uint8Array(0);
    /** Set once this connection's `COMMIT` went to the server in `"after"` mode: its answer is the cue. */
    let awaiting: Armed | undefined;
    client.on("data", (chunk: Buffer) => {
      if (pair.cut) return;
      const armed = this.#armed;
      if (armed !== undefined && awaiting === undefined && holds(clientTail, chunk, COMMIT_QUERY)) {
        if (armed.fault === "before") {
          void this.#fault(armed, pair);
          return;
        }
        awaiting = armed;
      }
      clientTail = tailOf(clientTail, chunk, COMMIT_QUERY);
      server.write(chunk);
    });
    server.on("data", (chunk: Buffer) => {
      if (pair.cut) return;
      if (awaiting !== undefined && holds(serverTail, chunk, COMMIT_COMPLETE)) {
        void this.#fault(awaiting, pair);
        return;
      }
      serverTail = tailOf(serverTail, chunk, COMMIT_COMPLETE);
      client.write(chunk);
    });
    client.resume();
  }

  /**
   * `armed`'s fault on the writer's connection `pair`: nothing more passes on it, the writer's backend is terminated,
   * the connection ended; new connections wait until `then` completed.
   */
  async #fault(armed: Armed, pair: Pair): Promise<void> {
    if (this.#armed !== armed) return;
    this.#armed = undefined;
    pair.cut = true;
    let open!: () => void;
    this.#gate = new Promise<void>((resolve) => {
      open = resolve;
    });
    try {
      await armed.terminate();
      this.#end(pair);
      await armed.then?.();
      this.#faults.push(armed.fault);
    } catch (error) {
      this.#end(pair);
      this.#faults.push(`${armed.fault} failed: ${error instanceof Error ? error.message : String(error)}`);
    } finally {
      this.#gate = undefined;
      open();
      armed.done();
    }
  }

  #end(pair: Pair): void {
    this.#pairs.delete(pair);
    pair.client.destroy();
    pair.server.destroy();
  }
}
