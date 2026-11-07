/**
 * The node-store bridge: how the ledger worker reads stored nodes synchronously from a database the main thread owns.
 * The ledger package reads a node it does not hold in memory through a synchronous `NodeStore.get` (`../types.ts`).
 * The worker's store ({@link bridgeStore}) writes the node's key into memory both threads share, sends the main thread
 * a message naming the request it serves, and blocks with `Atomics.wait`. The main thread ({@link BridgeServer}), which
 * never blocks on the worker, reads the node through the read handle that request was given, writes it back and wakes
 * the worker. [LG-10, LG-11; design §5.3]
 *
 * **Batched.** A miss also brings along the nodes the missed node references. The main thread reads their keys from
 * its child list (`../node-refs.ts`, without a ledger package) and reads them in one more statement. The worker serves
 * them from its side for the rest of its request (the next request drops them), so walking a state costs one round
 * trip per level rather than per node.
 *
 * **The shared memory** ({@link bridgeMemory}) is a growable `SharedArrayBuffer`. It starts with a 16-byte header of
 * four `Int32`s:
 * - the state: idle, asked or answered;
 * - the answer's length;
 * - the answer's status: nodes, or an error;
 * - unused.
 *
 * The data follows: the worker writes the key there and the main thread the answer. The answer is its node count
 * (`u32`), then for each node its key (32 bytes), its payload and its child list, each of the last two preceded by its
 * length (`u32`), all little-endian. The main thread grows the memory for an answer that does not fit, up to
 * {@link BRIDGE_MAX_BYTES}. A node larger than that is an error; referenced nodes that do not fit are left out.
 *
 * **Failures** never throw into the package, which would turn a throwing store into an abort. On an error (no read
 * given to the request, a failed statement, a node too large) the store answers "no node" and keeps the error. The
 * worker reports it along with the request's own failure ({@link BridgeStore.lastError}).
 */

import type { ReadHandle } from "../../db/api.js";
import { childRefKeys } from "../node-refs.js";
import type { NodeStore, StoredNode } from "../types.js";

/** The header's `Int32` slots. */
const STATE = 0;
const LENGTH = 1;
const STATUS = 2;
const HEADER_BYTES = 16;
const KEY_BYTES = 32;

/** The state slot's values. */
const IDLE = 0;
const ASKED = 1;
const ANSWERED = 2;

/** The status slot's values. */
const NODES = 0;
const ERROR = 1;

/** The shared memory's first size unless given: 1 MiB. */
export const BRIDGE_INITIAL_BYTES = 1 << 20;

/** The largest the shared memory grows to: 256 MiB. */
export const BRIDGE_MAX_BYTES = 256 << 20;

/** The statement reading stored nodes by key from `core_ledger_state.nodes`. [design §10] */
export const NODES_SQL = "SELECT node_key, data, children FROM core_ledger_state.nodes WHERE node_key = ANY($1::bytea[])";

/** What the main thread reads nodes through: a read handle's `query`. */
export type NodeReader = Pick<ReadHandle, "query">;

/** The layout of the shared memory's header (see the module comment), for the tests. */
export const BRIDGE_LAYOUT = Object.freeze({ STATE, LENGTH, STATUS, HEADER_BYTES, KEY_BYTES, IDLE, ASKED, ANSWERED, NODES, ERROR });

/** A growable `SharedArrayBuffer` (ES2024, Node.js 20 and later): the compiler's library here is ES2023's. */
interface Growable {
  readonly byteLength: number;
  readonly maxByteLength: number;
  grow(length: number): void;
}

/**
 * The bridge's shared memory (see the module comment), of `initial` bytes, growable to `max` ({@link BRIDGE_MAX_BYTES}
 * unless given: a test's smaller bound).
 */
export function bridgeMemory(initial: number = BRIDGE_INITIAL_BYTES, max: number = BRIDGE_MAX_BYTES): SharedArrayBuffer {
  const size = Math.max(HEADER_BYTES + KEY_BYTES, initial);
  const Constructor = SharedArrayBuffer as unknown as new (length: number, options: { maxByteLength: number }) => SharedArrayBuffer;
  return new Constructor(size, { maxByteLength: Math.max(size, max) });
}

const growable = (memory: SharedArrayBuffer): Growable => memory as unknown as Growable;

const hexOf = (bytes: Uint8Array): string => Array.from(bytes, (byte) => byte.toString(16).padStart(2, "0")).join("");

/** The encoded size of `nodes`. */
function encodedSize(nodes: readonly StoredNode[]): number {
  return 4 + nodes.reduce((sum, node) => sum + KEY_BYTES + 8 + node.data.length + node.children.length, 0);
}

/** `nodes` encoded into `target` at `offset` (see the module comment); returns the bytes written. */
export function encodeNodes(nodes: readonly StoredNode[], target: Uint8Array, offset = 0): number {
  const view = new DataView(target.buffer, target.byteOffset, target.byteLength);
  let at = offset;
  view.setUint32(at, nodes.length, true);
  at += 4;
  for (const node of nodes) {
    target.set(node.key, at);
    at += KEY_BYTES;
    for (const part of [node.data, node.children]) {
      view.setUint32(at, part.length, true);
      at += 4;
      target.set(part, at);
      at += part.length;
    }
  }
  return at - offset;
}

/** The nodes {@link encodeNodes} wrote at `offset` of `source`, copied out. */
export function decodeNodes(source: Uint8Array, offset = 0): StoredNode[] {
  const view = new DataView(source.buffer, source.byteOffset, source.byteLength);
  let at = offset;
  const count = view.getUint32(at, true);
  at += 4;
  const nodes: StoredNode[] = [];
  for (let i = 0; i < count; i++) {
    const key = source.slice(at, at + KEY_BYTES);
    at += KEY_BYTES;
    const parts: Uint8Array[] = [];
    for (let p = 0; p < 2; p++) {
      const length = view.getUint32(at, true);
      at += 4;
      parts.push(source.slice(at, at + length));
      at += length;
    }
    nodes.push({ key, data: parts[0] as Uint8Array, children: parts[1] as Uint8Array });
  }
  return nodes;
}

/** A node as a database row gives it (`bytea` columns as bytes). */
function rowNode(row: Record<string, unknown>): StoredNode {
  const bytes = (name: string): Uint8Array => {
    const value = row[name];
    if (!(value instanceof Uint8Array)) throw new TypeError(`core_ledger_state.nodes.${name} is not bytes`);
    return value;
  };
  return { key: bytes("node_key"), data: bytes("data"), children: bytes("children") };
}

/** The main thread's side of the bridge (see the module comment). */
export class BridgeServer {
  readonly #memory: SharedArrayBuffer;
  readonly #control: Int32Array;
  #requests = 0;
  #nodes = 0;

  constructor(memory: SharedArrayBuffer) {
    this.#memory = memory;
    this.#control = new Int32Array(memory, 0, 4);
  }

  /** The worker's requests answered so far, and the nodes they carried. */
  get stats(): { readonly requests: number; readonly nodes: number } {
    return { requests: this.#requests, nodes: this.#nodes };
  }

  /**
   * Answers the worker's request for the node whose key it wrote, reading through `reader` — the read handle the
   * request the worker serves was given, or null when it was given none — and wakes it.
   */
  async answer(reader: NodeReader | null): Promise<void> {
    if (Atomics.load(this.#control, STATE) !== ASKED) return;
    const key = new Uint8Array(this.#memory, HEADER_BYTES, KEY_BYTES).slice();
    const memory = growable(this.#memory);
    const max = memory.maxByteLength;
    this.#requests += 1;
    try {
      if (reader === null) {
        throw new Error(`no read is open for the ledger worker's request: node ${hexOf(key)} cannot be read`);
      }
      const nodes = (await reader.query(NODES_SQL, [[key]])).map(rowNode);
      const found = nodes.find((node) => hexOf(node.key) === hexOf(key));
      const answer: StoredNode[] = found === undefined ? [] : [found];
      if (found !== undefined) {
        const refs = [...new Map(childRefKeys(found.children).map((ref) => [hexOf(ref), ref])).values()];
        if (refs.length > 0) {
          const byKey = new Map((await reader.query(NODES_SQL, [refs])).map((row) => {
            const node = rowNode(row);
            return [hexOf(node.key), node] as const;
          }));
          for (const ref of refs) {
            const node = byKey.get(hexOf(ref));
            if (node !== undefined && encodedSize([...answer, node]) + HEADER_BYTES <= max) answer.push(node);
          }
        }
      }
      const size = HEADER_BYTES + encodedSize(answer);
      if (size > max) throw new Error(`node ${hexOf(key)} is larger than the bridge's ${max} bytes`);
      if (size > memory.byteLength) memory.grow(size);
      const written = encodeNodes(answer, new Uint8Array(this.#memory), HEADER_BYTES);
      this.#nodes += answer.length;
      this.#settle(NODES, written);
    } catch (error) {
      const message = new TextEncoder().encode(error instanceof Error ? error.message : String(error));
      const room = new Uint8Array(this.#memory, HEADER_BYTES);
      const bytes = message.subarray(0, room.length);
      room.set(bytes);
      this.#settle(ERROR, bytes.length);
    }
  }

  #settle(status: number, length: number): void {
    Atomics.store(this.#control, STATUS, status);
    Atomics.store(this.#control, LENGTH, length);
    Atomics.store(this.#control, STATE, ANSWERED);
    Atomics.notify(this.#control, STATE);
  }
}

/** The worker's node store over the bridge (see the module comment). */
export interface BridgeStore extends NodeStore {
  /** Starts a request: the referenced nodes an earlier request was sent and did not use are dropped, and its error. */
  begin(): void;
  /** The error of the last read that failed during the current request, if any. */
  readonly lastError: string | null;
}

/**
 * The worker's side of the bridge over `memory`; `ask` tells the main thread a key is waiting (see the module comment);
 * `local` serves first the nodes the database does not hold yet (the pending block's batch, `LedgerEngine.pendingNode`).
 */
export function bridgeStore(
  memory: SharedArrayBuffer,
  ask: () => void,
  local: (key: Uint8Array) => StoredNode | undefined = () => undefined,
): BridgeStore {
  const control = new Int32Array(memory, 0, 4);
  const sent = new Map<string, StoredNode>();
  let lastError: string | null = null;
  const served = (node: StoredNode) => ({ data: node.data, children: node.children });
  return {
    get lastError() {
      return lastError;
    },
    begin() {
      sent.clear();
      lastError = null;
    },
    get(key) {
      const own = local(key);
      if (own !== undefined) return served(own);
      const wanted = hexOf(key);
      const kept = sent.get(wanted);
      if (kept !== undefined) {
        sent.delete(wanted);
        return served(kept);
      }
      new Uint8Array(memory, HEADER_BYTES, KEY_BYTES).set(key);
      Atomics.store(control, STATE, ASKED);
      ask();
      while (Atomics.load(control, STATE) === ASKED) Atomics.wait(control, STATE, ASKED);
      const length = Atomics.load(control, LENGTH);
      const status = Atomics.load(control, STATUS);
      const data = new Uint8Array(memory, HEADER_BYTES, length).slice();
      Atomics.store(control, STATE, IDLE);
      if (status === ERROR) {
        lastError = new TextDecoder().decode(data);
        return null;
      }
      const [first, ...rest] = decodeNodes(data);
      for (const node of rest) sent.set(hexOf(node.key), node);
      return first === undefined ? null : served(first);
    },
  };
}
