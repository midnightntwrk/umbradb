/**
 * The node client: JSON-RPC 2.0 over one WebSocket to the Midnight node. It is refactored out of 0.9.5's
 * `chain-archive-sync/node-rpc-client.ts`, which made one HTTP POST per call, with no subscriptions and no retry. It is
 * the `node-client` item that `core-chain` provides, and `core-block-fetch` reads the chain through it. `core-chain`'s
 * startup checks ask the block source, which the node-backed source answers from the node.
 * [IN-8, IN-9, IN-10; design §1, §3]
 *
 * **Calls.** There is one method per allowed node call (`./methods.ts`), with its parameters typed and its answer read
 * into typed values (`./decode.ts`). A block is always named by its hash or its height, never left to the node's best
 * block, so every answer is about a block the caller chose. {@link NodeClient.call} sends a raw call, and refuses any
 * method outside the allowed calls before it is sent. Each call is sent once per try, with a fresh id. An answer is
 * paired with its call by id, in whatever order answers come; an answer whose call already ended (timed out, aborted)
 * is dropped. [IN-8]
 *
 * **Subscriptions.** {@link NodeClient.subscribeNewHeads} and {@link NodeClient.subscribeFinalizedHeads} deliver each
 * notification's header, in the order the node sends them, from the subscription's answer on (including a
 * notification read in the same batch as the answer). A cancelled subscription is dropped on the client's side and
 * never re-established. No `chain_unsubscribe…` call is sent, since it is not an allowed call; the node ends the
 * subscription with the connection. After a reconnect, every live subscription is made again and its subscriber is
 * told (`restarted`) before its next header. Notifications may have been lost meanwhile, so the runner reads the
 * finalized head again: the finalized subscription is only a bound, which may jump, repeat or be lost.
 * [IN-4, IN-8; design §3]
 *
 * **One connection, reconnected.** The client connects at its first call or subscription, and from then on keeps one
 * connection until {@link NodeClient.close}. When the connection fails or ends, the client connects again after
 * {@link backoffDelay} of the failed connections since the node last answered on one: 1 s, 2 s, 4 s, … up to
 * `backoffCeilingMs` (30 s by default), without limit. A connection the node accepts and drops before answering does
 * not reset the count. A connection attempt not open within the call timeout is given up and counts as failed.
 * [IN-10]
 *
 * The connection's state, as `/status` shows it ({@link NodeClient.connection}), is one of:
 * - `connecting` before the first connection opened (the client is unused, or its first attempt is pending);
 * - `connected` while one is open;
 * - `retrying` from a failed or lost connection until the next one opens (its back-off and each attempt);
 * - `closed` once closed.
 *
 * `onConnectionChange` reports each change. [AE-5]
 *
 * **Timeouts and retries.** Every try of a call ends after its timeout (`callTimeoutMs`, 30 s by default, or the
 * call's `timeoutMs`). The connection stays open; the transport's heartbeat finds a dead one (`./ws-socket.ts`). A call
 * retries by default. A retryable failure (`node-unreachable`: a lost or refused connection, a timeout, HTTP 429 or a
 * 5xx status, the node's rate limit) waits {@link backoffDelay} of its own tries and is sent again, on the next
 * connection if this one is gone. This repeats without limit, until the call is answered, fails otherwise, is aborted
 * by its `signal`, or the client is closed. [IN-10]
 *
 * `retry: false` makes the first failure final, and fails at once while the client has no connection. That is the
 * rule for a queued best block, which is dropped instead of retried. A failure that is not retryable
 * (`node-requirement`, `node-error`) is never retried. The `node-retrying` condition is {@link NodeClient.retrying}:
 * true while the connection is being re-established or any call waits for its next try. `onRetryingChange` reports
 * each change, and `onRetry` each retry scheduled. [IN-10]
 *
 * **Errors** are `UmbraError`s (`./errors.ts`) whose codes say whether the failure is retried or halts the process.
 * None names the node's URL, which is a `secret` field. [IN-9, IN-10, CF-4]
 */

import { UmbraError } from "../db/errors.js";
import { backoffDelay } from "./backoff.js";
import {
  blockAnswer,
  byteArrayAnswer,
  bytesAnswer,
  bytesParameter,
  countParameter,
  hashAnswer,
  hashParameter,
  headerAnswer,
  heightParameter,
  keysAnswer,
  type NodeBlock,
  type NodeHeader,
  type NodeRuntimeVersion,
  objectAnswer,
  runtimeVersionAnswer,
} from "./decode.js";
import {
  badAnswer,
  blockUnavailable,
  callTimedOut,
  clientClosed,
  type ConnectionFailure,
  connectionFailure,
  invalidOption,
  invalidParameter,
  methodNotAllowed,
  rpcFailure,
} from "./errors.js";
import { isNodeCallMethod, type NodeCallMethod, type NodeMethod, type SubscribeMethod } from "./methods.js";
import { type ConnectSocket, type NodeSocket, type NodeTimers, SYSTEM_TIMERS } from "./socket.js";
import { connectWebSocket } from "./ws-socket.js";

/** The time a call, or a connection attempt, waits for the node's answer by default. */
export const DEFAULT_CALL_TIMEOUT_MS = 30_000;

/** `backoffCeilingMs`'s default. [CF-4] */
export const DEFAULT_BACKOFF_CEILING_MS = 30_000;

/** The node connection's state, one of four (see the module comment and {@link NodeClient.connection}). [AE-5] */
export type NodeConnection = "connecting" | "connected" | "retrying" | "closed";

export interface NodeClientOptions {
  /** The node's WebSocket URL (`ws://` or `wss://`), the `core` entry's `node` field: a secret, never shown. */
  readonly url: string;
  /** The longest wait between retries (`backoffCeilingMs`); 30 000 by default. [CF-4] */
  readonly backoffCeilingMs?: number;
  /** How long a call, or a connection attempt, waits for an answer; 30 000 by default. */
  readonly callTimeoutMs?: number;
  /** Opens the connection; `ws` by default (`./ws-socket.ts`). */
  readonly connect?: ConnectSocket;
  /** The clock every timer of the client and its transport runs on; the global timers by default. */
  readonly timers?: NodeTimers;
  /** Called each time a retry is scheduled: a call's next try, or the next connection attempt. */
  readonly onRetry?: (retry: NodeRetry) => void;
  /** Called each time {@link NodeClient.retrying} changes. */
  readonly onRetryingChange?: (retrying: boolean) => void;
  /** Called each time {@link NodeClient.connection} changes, with the new state. */
  readonly onConnectionChange?: (connection: NodeConnection) => void;
}

/** One call's options. */
export interface NodeCallOptions {
  /** Retry a retryable failure with back-off, without limit; true by default. [IN-10] */
  readonly retry?: boolean;
  /** This call's timeout per try, in milliseconds; the client's `callTimeoutMs` by default. */
  readonly timeoutMs?: number;
  /** Ends the call, and its retries, with the signal's reason. */
  readonly signal?: AbortSignal;
}

/** A retry scheduled: of a call (its method), or of the connection (`connect`). */
export interface NodeRetry {
  readonly operation: NodeMethod | "connect";
  /** 1 for the first retry. */
  readonly attempt: number;
  readonly delayMs: number;
  /** The failure retried. */
  readonly error: UmbraError;
}

/** Receives a head subscription's notifications. */
export interface HeadSubscriber {
  /** A notification's header. */
  header(header: NodeHeader): void;
  /** The subscription was made again on a new connection: notifications may have been lost meanwhile. */
  restarted?(): void;
  /**
   * A notification the client could not read (a `node-error`), an exception of this subscriber's own callbacks, a
   * subscription that could not be made again after a reconnect, or a connection refused for good (a handshake
   * answered with a status other than 429 or 5xx). The subscription stays; a notification it could not read is
   * dropped.
   */
  error?(error: unknown): void;
}

/** A live subscription. */
export interface NodeSubscription {
  /** Stops delivering; nothing is sent to the node. [IN-8] */
  cancel(): void;
}

type State = "idle" | "connecting" | "open" | "waiting" | "closed";

interface Connection {
  socket: NodeSocket | undefined;
  opened: boolean;
  ended: boolean;
  connectTimer: unknown;
  /** Resolves `close()` once the socket reports it ended. */
  whenEnded?: () => void;
}

interface Waiter {
  readonly method: NodeMethod;
  readonly retry: boolean;
  resolve(): void;
  reject(error: unknown): void;
}

interface Pending {
  readonly method: NodeMethod;
  /** Reads the answer as soon as it arrives, before any later message (a subscription's id). */
  readonly onAnswer: ((result: unknown) => void) | undefined;
  resolve(result: unknown): void;
  reject(error: unknown): void;
}

interface Subscription {
  readonly method: SubscribeMethod;
  readonly subscriber: HeadSubscriber;
  live: boolean;
  /** The node's id of the subscription on the current connection (as JSON text), or null. */
  nodeId: string | null;
  /** Made on a connection that ended: to be made again when the next one opens. */
  needsAgain: boolean;
}

export class NodeClient {
  readonly #url: string;
  readonly #timeoutMs: number;
  readonly #ceilingMs: number;
  readonly #connect: ConnectSocket;
  readonly #timers: NodeTimers;
  readonly #onRetry: ((retry: NodeRetry) => void) | undefined;
  readonly #onRetryingChange: ((retrying: boolean) => void) | undefined;
  readonly #onConnectionChange: ((connection: NodeConnection) => void) | undefined;

  #state: State = "idle";
  #connection: Connection | undefined;
  /** Connections failed since the node last answered on one. */
  #failures = 0;
  #lastFailure: ConnectionFailure | undefined;
  #reconnectTimer: unknown;
  #reconnecting = false;
  #retryingCalls = 0;
  #reported = false;
  /** The connection's state last reported to `onConnectionChange` (a new client's is `connecting`). */
  #reportedConnection: NodeConnection = "connecting";
  #nextId = 1;
  #closed: Promise<void> | undefined;
  readonly #waiters = new Set<Waiter>();
  readonly #pending = new Map<number, Pending>();
  readonly #sleeps = new Set<(error: unknown) => void>();
  readonly #subscriptions = new Set<Subscription>();
  readonly #byNodeId = new Map<string, Subscription>();

  constructor(options: NodeClientOptions) {
    let url: URL;
    try {
      url = new URL(options.url);
    } catch {
      throw invalidOption("node", "not-a-url");
    }
    if (url.protocol !== "ws:" && url.protocol !== "wss:") throw invalidOption("node", "not-a-websocket-url");
    this.#url = options.url;
    this.#timeoutMs = positive(options.callTimeoutMs ?? DEFAULT_CALL_TIMEOUT_MS, "callTimeoutMs");
    this.#ceilingMs = positive(options.backoffCeilingMs ?? DEFAULT_BACKOFF_CEILING_MS, "backoffCeilingMs");
    this.#connect = options.connect ?? connectWebSocket;
    this.#timers = options.timers ?? SYSTEM_TIMERS;
    this.#onRetry = options.onRetry;
    this.#onRetryingChange = options.onRetryingChange;
    this.#onConnectionChange = options.onConnectionChange;
  }

  /**
   * The `node-retrying` condition: the connection is being re-established, or a call waits for its next try. [IN-10]
   */
  get retrying(): boolean {
    return this.#reconnecting || this.#retryingCalls > 0;
  }

  /**
   * The connection's state: `closed` once closed; `connected` while a connection is open; `retrying` from a failed or
   * lost connection until the next one opens; `connecting` before the first one opened. [AE-5]
   */
  get connection(): NodeConnection {
    if (this.#state === "closed") return "closed";
    if (this.#state === "open") return "connected";
    return this.#reconnecting ? "retrying" : "connecting";
  }

  /** `chain_getFinalizedHead`: the hash of the node's finalized head. */
  async finalizedHead(options?: NodeCallOptions): Promise<Uint8Array> {
    const method = "chain_getFinalizedHead";
    return hashAnswer(method, "result", await this.call(method, [], options));
  }

  /** `chain_getBlockHash(height)`: the hash of the block at `height`; `node-requirement` when the node has none. */
  async blockHash(height: bigint, options?: NodeCallOptions): Promise<Uint8Array> {
    const method = "chain_getBlockHash";
    const result = await this.call(method, [heightParameter(method, height)], options);
    if (result === null) throw blockUnavailable(method, { height });
    return hashAnswer(method, "result", result);
  }

  /** `chain_getHeader(hash)`; `node-requirement` when the node does not have the block. */
  async header(hash: Uint8Array, options?: NodeCallOptions): Promise<NodeHeader> {
    const method = "chain_getHeader";
    const block = hashParameter(method, "hash", hash);
    const result = await this.call(method, [block], options);
    if (result === null) throw blockUnavailable(method, { block });
    return headerAnswer(method, "result", result);
  }

  /** `chain_getBlock(hash)`: its header and extrinsics; `node-requirement` when the node does not have it (pruned). */
  async block(hash: Uint8Array, options?: NodeCallOptions): Promise<NodeBlock> {
    const method = "chain_getBlock";
    const block = hashParameter(method, "hash", hash);
    const result = await this.call(method, [block], options);
    if (result === null) throw blockUnavailable(method, { block });
    return blockAnswer(method, result);
  }

  /** `state_getRuntimeVersion(at)`: the runtime version of the block `at`. */
  async runtimeVersion(at: Uint8Array, options?: NodeCallOptions): Promise<NodeRuntimeVersion> {
    const method = "state_getRuntimeVersion";
    return runtimeVersionAnswer(method, await this.call(method, [hashParameter(method, "at", at)], options));
  }

  /** `state_getMetadata(at)`: the runtime metadata at the block `at`, SCALE-encoded. */
  async metadata(at: Uint8Array, options?: NodeCallOptions): Promise<Uint8Array> {
    const method = "state_getMetadata";
    return bytesAnswer(method, "result", await this.call(method, [hashParameter(method, "at", at)], options));
  }

  /** `state_getStorage(key, at)`: the value under `key` in the state of the block `at`, or null when there is none. */
  async storage(key: Uint8Array, at: Uint8Array, options?: NodeCallOptions): Promise<Uint8Array | null> {
    const method = "state_getStorage";
    const params = [bytesParameter(method, "key", key), hashParameter(method, "at", at)];
    const result = await this.call(method, params, options);
    return result === null ? null : bytesAnswer(method, "result", result);
  }

  /**
   * `state_getKeysPaged(prefix, count, startKey, at)`: up to `count` keys under `prefix` in the state of the block
   * `at`, in key order, after `startKey` (from the first when null). The
   * indexer calls it for block 0's registrations only. [IN-8]
   */
  async storageKeys(
    prefix: Uint8Array,
    count: number,
    startKey: Uint8Array | null,
    at: Uint8Array,
    options?: NodeCallOptions,
  ): Promise<readonly Uint8Array[]> {
    const method = "state_getKeysPaged";
    const params = [
      bytesParameter(method, "prefix", prefix),
      countParameter(method, "count", count),
      startKey === null ? null : bytesParameter(method, "startKey", startKey),
      hashParameter(method, "at", at),
    ];
    return keysAnswer(method, await this.call(method, params, options));
  }

  /** `midnight_ledgerStateRoot(at)`: the ledger state root after the block `at`. [LG-15] */
  async ledgerStateRoot(at: Uint8Array, options?: NodeCallOptions): Promise<Uint8Array> {
    const method = "midnight_ledgerStateRoot";
    return byteArrayAnswer(method, await this.call(method, [hashParameter(method, "at", at)], options));
  }

  /** `system_properties`: the chain's properties (`genesis_state` among them), as the node gives them. [IN-7] */
  async systemProperties(options?: NodeCallOptions): Promise<Readonly<Record<string, unknown>>> {
    const method = "system_properties";
    return objectAnswer(method, await this.call(method, [], options));
  }

  /** `chain_subscribeNewHeads`: each new best block's header. [IN-6] */
  subscribeNewHeads(subscriber: HeadSubscriber): Promise<NodeSubscription> {
    return this.#subscribe("chain_subscribeNewHeads", subscriber);
  }

  /** `chain_subscribeFinalizedHeads`: each finalized head's header, a bound that may jump, repeat or be lost. [IN-4] */
  subscribeFinalizedHeads(subscriber: HeadSubscriber): Promise<NodeSubscription> {
    return this.#subscribe("chain_subscribeFinalizedHeads", subscriber);
  }

  /**
   * Sends `method` with `params` and resolves with the node's raw `result`; refuses a method outside the allowed node
   * calls. [IN-8]
   */
  async call(method: NodeCallMethod, params: readonly unknown[], options: NodeCallOptions = {}): Promise<unknown> {
    if (!isNodeCallMethod(method)) throw methodNotAllowed(method);
    return this.#withRetry(method, params, options, undefined);
  }

  /**
   * Closes the connection for good: every call in flight or waiting, and every subscription, ends with
   * `handle-closed`, and nothing is sent or connected any more. Resolves once the connection has ended.
   */
  close(): Promise<void> {
    if (this.#closed !== undefined) return this.#closed;
    this.#state = "closed";
    this.#timers.clearTimeout(this.#reconnectTimer);
    const error = clientClosed();
    for (const waiter of [...this.#waiters]) waiter.reject(error);
    for (const pending of [...this.#pending.values()]) pending.reject(error);
    for (const sleep of [...this.#sleeps]) sleep(error);
    for (const subscription of this.#subscriptions) subscription.live = false;
    this.#subscriptions.clear();
    this.#byNodeId.clear();
    this.#reconnecting = false;
    this.#report();
    this.#reportConnection();
    const connection = this.#connection;
    this.#connection = undefined;
    if (connection === undefined || connection.ended || connection.socket === undefined) {
      this.#closed = Promise.resolve();
    } else {
      const socket = connection.socket;
      this.#closed = new Promise((resolve) => {
        connection.whenEnded = resolve;
        socket.close();
      });
    }
    return this.#closed;
  }

  async #subscribe(method: SubscribeMethod, subscriber: HeadSubscriber): Promise<NodeSubscription> {
    if (this.#state === "closed") throw clientClosed();
    const subscription: Subscription = { method, subscriber, live: true, nodeId: null, needsAgain: false };
    this.#subscriptions.add(subscription);
    try {
      await this.#withRetry(method, [], {}, (result) => this.#confirm(subscription, result, false));
    } catch (error) {
      subscription.live = false;
      this.#subscriptions.delete(subscription);
      throw error;
    }
    return { cancel: () => this.#cancel(subscription) };
  }

  /** Records the node's id for a subscription, as its answer arrives; tells the subscriber when it was made again. */
  #confirm(subscription: Subscription, result: unknown, again: boolean): void {
    if (typeof result !== "string" && typeof result !== "number") {
      throw badAnswer(subscription.method, "result", result, "a subscription id");
    }
    if (!subscription.live) return;
    subscription.nodeId = JSON.stringify(result);
    this.#byNodeId.set(subscription.nodeId, subscription);
    if (again) this.#deliver(subscription, (subscriber) => subscriber.restarted?.());
  }

  #cancel(subscription: Subscription): void {
    subscription.live = false;
    this.#subscriptions.delete(subscription);
    if (subscription.nodeId !== null) this.#byNodeId.delete(subscription.nodeId);
    subscription.nodeId = null;
  }

  /** Runs a subscriber callback; its exception goes to the subscriber's `error`. */
  #deliver(subscription: Subscription, run: (subscriber: HeadSubscriber) => void): void {
    try {
      run(subscription.subscriber);
    } catch (error) {
      subscription.subscriber.error?.(error);
    }
  }

  /** Makes a subscription again on the connection just opened. */
  #again(subscription: Subscription): void {
    subscription.needsAgain = false;
    this.#withRetry(subscription.method, [], {}, (result) => this.#confirm(subscription, result, true)).catch(
      (error: unknown) => {
        if (subscription.live) this.#deliver(subscription, (subscriber) => subscriber.error?.(error));
      },
    );
  }

  /** One call, with its retries. [IN-10] */
  async #withRetry(
    method: NodeMethod,
    params: readonly unknown[],
    options: NodeCallOptions,
    onAnswer: ((result: unknown) => void) | undefined,
  ): Promise<unknown> {
    const retry = options.retry ?? true;
    const timeoutMs = options.timeoutMs ?? this.#timeoutMs;
    if (!Number.isSafeInteger(timeoutMs) || timeoutMs < 1) {
      throw invalidParameter(method, "timeoutMs", "a positive integer");
    }
    const signal = options.signal;
    if (this.#state === "closed") throw clientClosed();
    let attempt = 0;
    try {
      for (;;) {
        signal?.throwIfAborted();
        try {
          return await this.#try(method, params, timeoutMs, retry, signal, onAnswer);
        } catch (error) {
          if (!retry || !isRetryable(error)) throw error;
          attempt += 1;
          if (attempt === 1) {
            this.#retryingCalls += 1;
            this.#report();
          }
          const delayMs = backoffDelay(attempt, this.#ceilingMs);
          this.#onRetry?.({ operation: method, attempt, delayMs, error });
          await this.#sleep(delayMs, signal);
        }
      }
    } finally {
      if (attempt > 0) {
        this.#retryingCalls -= 1;
        this.#report();
      }
    }
  }

  /** One try: waits for an open connection, sends, and waits for the answer or the timeout. */
  async #try(
    method: NodeMethod,
    params: readonly unknown[],
    timeoutMs: number,
    retry: boolean,
    signal: AbortSignal | undefined,
    onAnswer: ((result: unknown) => void) | undefined,
  ): Promise<unknown> {
    await this.#opened(method, retry, signal);
    // The connection opened; a socket may still have ended it before this continuation ran.
    const socket = this.#state === "open" ? this.#connection?.socket : undefined;
    if (socket === undefined) {
      if (this.#state === "closed") throw clientClosed();
      throw connectionFailure(this.#lastFailure as ConnectionFailure, method, this.#timeoutMs);
    }
    const id = this.#nextId++;
    return new Promise((resolve, reject) => {
      const settle = (): void => {
        this.#timers.clearTimeout(timer);
        this.#pending.delete(id);
        signal?.removeEventListener("abort", onAbort);
      };
      const onAbort = (): void => {
        settle();
        reject(signal?.reason);
      };
      const timer = this.#timers.setTimeout(() => {
        settle();
        reject(callTimedOut(method, timeoutMs));
      }, timeoutMs);
      this.#pending.set(id, {
        method,
        onAnswer,
        resolve: (result) => {
          settle();
          resolve(result);
        },
        reject: (error) => {
          settle();
          reject(error);
        },
      });
      signal?.addEventListener("abort", onAbort, { once: true });
      socket.send(JSON.stringify({ jsonrpc: "2.0", id, method, params }));
    });
  }

  /** Resolves once the connection is open; with `retry: false`, fails at once while there is none. */
  async #opened(method: NodeMethod, retry: boolean, signal: AbortSignal | undefined): Promise<void> {
    if (this.#state === "idle") this.#startConnecting();
    if (this.#state === "open") return;
    if (this.#state === "closed") throw clientClosed();
    if (this.#state === "waiting") {
      // Without retry, or after a failure no retry clears (a refused handshake), the call fails now.
      const failure = connectionFailure(this.#lastFailure as ConnectionFailure, method, this.#timeoutMs);
      if (!retry || !failure.retryable) throw failure;
    }
    await new Promise<void>((resolve, reject) => {
      const done = (): void => {
        this.#waiters.delete(waiter);
        signal?.removeEventListener("abort", onAbort);
      };
      const onAbort = (): void => {
        done();
        reject(signal?.reason);
      };
      const waiter: Waiter = {
        method,
        retry,
        resolve: () => {
          done();
          resolve();
        },
        reject: (error) => {
          done();
          reject(error);
        },
      };
      this.#waiters.add(waiter);
      signal?.addEventListener("abort", onAbort, { once: true });
    });
  }

  #startConnecting(): void {
    this.#state = "connecting";
    const connection: Connection = { socket: undefined, opened: false, ended: false, connectTimer: undefined };
    this.#connection = connection;
    connection.connectTimer = this.#timers.setTimeout(
      () => this.#ended(connection, { kind: "connect-timeout" }),
      this.#timeoutMs,
    );
    try {
      connection.socket = this.#connect(
        this.#url,
        {
          open: () => this.#open(connection),
          message: (text) => this.#message(connection, text),
          closed: (failure) => this.#ended(connection, failure),
        },
        this.#timers,
      );
    } catch {
      this.#ended(connection, { kind: "connect-failed" });
    }
  }

  #open(connection: Connection): void {
    if (connection.ended || connection !== this.#connection) return;
    this.#timers.clearTimeout(connection.connectTimer);
    connection.opened = true;
    this.#state = "open";
    this.#reconnecting = false;
    this.#report();
    this.#reportConnection();
    for (const waiter of [...this.#waiters]) waiter.resolve();
    for (const subscription of this.#subscriptions) if (subscription.needsAgain) this.#again(subscription);
  }

  #message(connection: Connection, text: string): void {
    if (connection.ended || connection !== this.#connection) return;
    let message: unknown;
    try {
      message = JSON.parse(text);
    } catch {
      message = undefined;
    }
    if (!isRecord(message) || message.jsonrpc !== "2.0") {
      this.#ended(connection, { kind: "bad-frame" });
      return;
    }
    if ("id" in message) {
      this.#failures = 0;
      this.#answer(message);
      return;
    }
    const params = message.params;
    const notification =
      typeof message.method === "string" && isRecord(params) && "subscription" in params && "result" in params;
    if (!notification) {
      this.#ended(connection, { kind: "bad-frame" });
      return;
    }
    this.#failures = 0;
    this.#notification(params.subscription, params.result);
  }

  #answer(message: Record<string, unknown>): void {
    const pending = typeof message.id === "number" ? this.#pending.get(message.id) : undefined;
    if (pending === undefined) return;
    if ("error" in message) {
      pending.reject(rpcFailure(pending.method, message.error));
      return;
    }
    if (!("result" in message)) {
      pending.reject(badAnswer(pending.method, "result", undefined, "a result or an error"));
      return;
    }
    try {
      pending.onAnswer?.(message.result);
    } catch (error) {
      pending.reject(error);
      return;
    }
    pending.resolve(message.result);
  }

  #notification(id: unknown, result: unknown): void {
    const subscription = this.#byNodeId.get(JSON.stringify(id));
    if (subscription === undefined) return;
    let header: NodeHeader;
    try {
      header = headerAnswer(subscription.method, "params.result", result);
    } catch (error) {
      this.#deliver(subscription, (subscriber) => subscriber.error?.(error));
      return;
    }
    this.#deliver(subscription, (subscriber) => subscriber.header(header));
  }

  /** A connection failed or ended: fail what was on it, and connect again after the back-off. */
  #ended(connection: Connection, failure: ConnectionFailure): void {
    if (connection.ended) return;
    connection.ended = true;
    this.#timers.clearTimeout(connection.connectTimer);
    connection.whenEnded?.();
    if (failure.kind === "connect-timeout" || failure.kind === "bad-frame") connection.socket?.close();
    if (connection !== this.#connection) return;
    this.#connection = undefined;
    for (const pending of [...this.#pending.values()]) {
      pending.reject(connectionFailure(failure, pending.method, this.#timeoutMs));
    }
    for (const subscription of this.#subscriptions) {
      if (subscription.nodeId === null) continue;
      this.#byNodeId.delete(subscription.nodeId);
      subscription.nodeId = null;
      subscription.needsAgain = true;
    }
    const error = connectionFailure(failure, null, this.#timeoutMs);
    for (const waiter of [...this.#waiters]) {
      if (!waiter.retry || !error.retryable) waiter.reject(connectionFailure(failure, waiter.method, this.#timeoutMs));
    }
    if (!error.retryable) {
      for (const subscription of this.#subscriptions) {
        this.#deliver(subscription, (subscriber) => subscriber.error?.(error));
      }
    }
    this.#lastFailure = failure;
    this.#failures += 1;
    this.#state = "waiting";
    this.#reconnecting = true;
    this.#report();
    this.#reportConnection();
    const delayMs = backoffDelay(this.#failures, this.#ceilingMs);
    this.#onRetry?.({ operation: "connect", attempt: this.#failures, delayMs, error });
    this.#reconnectTimer = this.#timers.setTimeout(() => this.#startConnecting(), delayMs);
  }

  /** Waits `ms` on the client's clock; ends with the signal's reason, or `handle-closed` on `close()`. */
  #sleep(ms: number, signal: AbortSignal | undefined): Promise<void> {
    return new Promise((resolve, reject) => {
      const done = (): void => {
        this.#timers.clearTimeout(timer);
        this.#sleeps.delete(end);
        signal?.removeEventListener("abort", onAbort);
      };
      const end = (error: unknown): void => {
        done();
        reject(error);
      };
      const onAbort = (): void => end(signal?.reason);
      const timer = this.#timers.setTimeout(() => {
        done();
        resolve();
      }, ms);
      this.#sleeps.add(end);
      signal?.addEventListener("abort", onAbort, { once: true });
    });
  }

  #report(): void {
    const retrying = this.retrying;
    if (retrying === this.#reported) return;
    this.#reported = retrying;
    this.#onRetryingChange?.(retrying);
  }

  /**
   * Tells `onConnectionChange` the connection's state when it changed: after a close, an open and an end. A new
   * attempt changes none (the first reads `connecting` as the unused client did, a later one `retrying` as its back-off
   * did), so `#startConnecting` does not report.
   */
  #reportConnection(): void {
    const connection = this.connection;
    if (connection === this.#reportedConnection) return;
    this.#reportedConnection = connection;
    this.#onConnectionChange?.(connection);
  }
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function isRetryable(error: unknown): error is UmbraError {
  return error instanceof UmbraError && error.retryable;
}

function positive(value: number, field: "callTimeoutMs" | "backoffCeilingMs"): number {
  if (!Number.isSafeInteger(value) || value < 1) throw invalidOption(field, "not-a-positive-integer");
  return value;
}
