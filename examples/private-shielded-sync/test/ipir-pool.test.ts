/**
 * A call's IPIR+SP requests on worker threads (`ipir/pool.ts`, `ipir/engine.ts`) against a table the add-on built:
 *
 * - on real `worker_threads` (`ipir/pool-node.ts`) and on the calling thread, a call's requests are answered by the
 *   add-on and decode to their rows; errors of one call leave the pool usable;
 * - with the workers' code run on the test's thread (so their WebAssembly calls can be observed): request `q` goes to
 *   worker `q mod threads`; every state is freed (review F7); a random source that repeats itself across workers gives
 *   no call (review F8); a worker thread that dies fails every waiting and later call.
 *
 * Needs the add-on (`ipir/build.sh native`).
 */

import { afterAll, beforeAll, describe, expect, it, vi } from "vitest";
import { checkDistinctKeys, inlineIpirEngine, type IpirEngine, type IpirWorkers } from "../ipir/engine.ts";
import { buildIpirTable, type IpirBuiltTable } from "../ipir/native.ts";
import { nodeIpirPool } from "../ipir/pool-node.ts";
import { IpirPool, type IpirPort } from "../ipir/pool.ts";
import { ipirWorker, type IpirReply, type IpirTask } from "../ipir/pool-worker.ts";
import { IPIR_HEADER_BYTES, IPIR_KEY_BYTES, ipirRequestBytes, ipirResponseBytes } from "../ipir/sizes.ts";
import { IpirTableClient, type IpirRequest } from "../ipir/wallet.ts";
import { compileIpirWasm } from "../ipir/wallet-node.ts";

const ROWS = 2048;
const COLS = 2048;
const SEED = new Uint8Array(32).fill(21);
const SNAPSHOT = new Uint8Array(32).fill(22);
const REQUEST = ipirRequestBytes(ROWS);
const RESPONSE = ipirResponseBytes(COLS);

/** Deterministic pseudo-random cells (xorshift32), column-major. */
const cells = new Uint16Array(ROWS * COLS);
{
  let x = 0x9e3779b9;
  for (let i = 0; i < cells.length; i++) {
    x ^= x << 13;
    x ^= x >>> 17;
    x ^= x << 5;
    cells[i] = x & 0xffff;
  }
}
const rowOf = (row: number): Uint16Array => Uint16Array.from({ length: COLS }, (_, col) => cells[col * ROWS + row]!);

let wasm: WebAssembly.Module;
let built: IpirBuiltTable;
const params = () => ({ rows: ROWS, cols: COLS, seed: SEED, snapshot: SNAPSHOT, masks: built.masks });

beforeAll(async () => {
  wasm = compileIpirWasm();
  built = await buildIpirTable({ cells, rows: ROWS, cols: COLS, seed: SEED, snapshot: SNAPSHOT });
}, 120_000);

afterAll(() => built.table.release());

/** The workers' code on this thread: each port answers in a microtask, in the order posted. */
function sameThreadPorts(options: { silent?: (worker: number, task: IpirTask) => boolean } = {}) {
  const posted: { worker: number; task: IpirTask }[] = [];
  const fail: ((error: Error) => void)[] = [];
  let terminated = 0;
  let spawned = 0;
  const spawn = (): IpirPort => {
    const worker = spawned++;
    const handle = ipirWorker();
    let onReply: (reply: IpirReply) => void = () => undefined;
    return {
      post(task) {
        posted.push({ worker, task });
        if (options.silent?.(worker, task) === true) return;
        queueMicrotask(() => onReply(handle(task).reply));
      },
      listen(reply, error) {
        onReply = reply;
        fail.push(error);
      },
      busy: () => undefined,
      terminate: async () => {
        terminated++;
      },
    };
  };
  return { spawn, posted, fail, spawnedCount: () => spawned, terminatedCount: () => terminated };
}

describe.each([
  ["the calling thread", (): { engine(): Promise<IpirEngine>; close(): Promise<void> } => ({ engine: async () => inlineIpirEngine(wasm), close: async () => undefined })],
  ["3 worker threads", () => {
    const pool = nodeIpirPool(3);
    return { engine: () => pool.engine(wasm), close: () => pool.close() };
  }],
] as const)("a call on %s", (_name, make) => {
  const made = make();
  let engine: IpirEngine;

  beforeAll(async () => {
    engine = await made.engine();
  });
  afterAll(() => made.close());

  it("makes one request per row, in order; the add-on's answers decode to the wanted rows", async () => {
    const table = await engine.openTable(params());
    expect(table.sizes).toMatchObject({ requestBytes: REQUEST, responseBytes: RESPONSE });
    const rows = [5, 1024, 2047, 5, 77, 300, 1, 0];
    const call = await table.call(rows);
    expect(call.requests.length).toBe(rows.length * REQUEST);
    checkDistinctKeys(call.requests, rows.length, REQUEST);
    const answers = await built.table.respond(call.requests, rows.length);
    const decoded = await call.decode(answers, 5);
    expect(decoded).toHaveLength(5);
    decoded.forEach((got, q) => expect(Buffer.from(got.buffer, got.byteOffset, got.byteLength).equals(Buffer.from(rowOf(rows[q]!).buffer)), `request ${q}`).toBe(true));
    // Every request, the padding ones too, decodes when asked for.
    const all = await call.decode(answers, rows.length);
    all.forEach((got, q) => expect(got[17], `request ${q}`).toBe(rowOf(rows[q]!)[17]));
    expect(await call.decode(answers, 0)).toEqual([]);
    call.free();
    call.free();
    await expect(call.decode(answers, 1)).rejects.toThrow(/freed/);
    table.free();
  });

  it("refuses a row outside the table, masks of another setup, a freed table; later calls still work", async () => {
    const table = await engine.openTable(params());
    await expect(table.call([0, 1, 2, ROWS])).rejects.toThrow(/outside a table/);
    await expect(engine.openTable({ ...params(), snapshot: new Uint8Array(32).fill(23) })).rejects.toThrow(/cannot open the IPIR\+SP table/);
    const call = await table.call([9, 10, 11, 12]);
    await expect(call.decode(new Uint8Array(4 * RESPONSE), 5)).rejects.toThrow(/wanted 5 of 4/);
    const answers = await built.table.respond(call.requests, 4);
    expect((await call.decode(answers, 4))[3]![3]).toBe(rowOf(12)[3]);
    table.free();
    table.free();
    await expect(table.call([0])).rejects.toThrow(/freed/);
    await expect(call.decode(answers, 1)).rejects.toThrow(/freed|no call/);
  });
});

describe("the pool", () => {
  it("starts its workers once, at the first use, and stops them on close", async () => {
    const ports = sameThreadPorts();
    const pool: IpirWorkers = new IpirPool(4, ports.spawn);
    expect(pool.threads).toBe(4);
    expect(ports.spawnedCount()).toBe(0);
    const first = await pool.engine(wasm);
    const second = await pool.engine(wasm);
    expect([first.threads, second.threads, ports.spawnedCount()]).toEqual([4, 4, 4]);
    expect(ports.posted.filter((p) => p.task.op === "init")).toHaveLength(4);
    await pool.close();
    await pool.close();
    expect(ports.posted.filter((p) => p.task.op === "close").map((p) => p.worker)).toEqual([0, 1, 2, 3]);
    expect(ports.terminatedCount()).toBe(4);
    await expect(pool.engine(wasm)).rejects.toThrow(/closed/);
    // A pool never used starts nothing.
    const unused = sameThreadPorts();
    await new IpirPool(2, unused.spawn).close();
    expect(unused.spawnedCount()).toBe(0);
    expect(() => new IpirPool(0, unused.spawn)).toThrow(/thread count/);
  });

  it("deals request q to worker q mod threads, and sends each worker only its wanted answers to decode", async () => {
    const ports = sameThreadPorts();
    const pool = new IpirPool(3, ports.spawn);
    const engine = await pool.engine(wasm);
    const table = await engine.openTable(params());
    expect(ports.posted.filter((p) => p.task.op === "open").map((p) => p.worker)).toEqual([0, 1, 2]);
    const rows = [100, 101, 102, 103, 104, 105, 106];
    const call = await table.call(rows);
    const dealt = ports.posted.flatMap((p) => (p.task.op === "call" ? [[p.worker, p.task.rows] as const] : []));
    expect(dealt).toEqual([
      [0, [100, 103, 106]],
      [1, [101, 104]],
      [2, [102, 105]],
    ]);
    const answers = await built.table.respond(call.requests, rows.length);
    // Wanted: the first four requests, so worker 0 decodes two and the others one each.
    const decoded = await call.decode(answers, 4);
    decoded.forEach((got, q) => expect(got[5], `request ${q}`).toBe(rowOf(rows[q]!)[5]));
    const decodes = ports.posted.flatMap((p) => (p.task.op === "decode" ? [[p.worker, p.task.wanted, p.task.responses.length] as const] : []));
    expect(decodes).toEqual([
      [0, 2, 2 * RESPONSE],
      [1, 1, RESPONSE],
      [2, 1, RESPONSE],
    ]);
    // A call of two requests uses two workers only.
    const small = await table.call([1, 2]);
    expect(ports.posted.filter((p) => p.task.op === "call" && p.task.rows.length <= 1).map((p) => p.worker)).toEqual([0, 1]);
    small.free();
    await pool.close();
  });

  it("review F7: states are freed with their call, with their table, when a call fails part-way, and on close", async () => {
    const made: { freed: boolean }[] = [];
    const request = IpirTableClient.prototype.request;
    const spy = vi.spyOn(IpirTableClient.prototype, "request").mockImplementation(function (this: IpirTableClient, row: number): IpirRequest {
      const r = request.call(this, row);
      const entry = { freed: false };
      const free = r.state.free.bind(r.state);
      (r.state as { free(): void }).free = () => {
        entry.freed = true;
        free();
      };
      made.push(entry);
      return r;
    });
    const live = () => made.filter((e) => !e.freed).length;
    /** Frees are posted, not awaited: a later task to every worker has passed them. */
    const settled = async (engine: IpirEngine) => {
      await expect(engine.openTable({ ...params(), masks: built.masks.subarray(1) })).rejects.toThrow();
    };
    try {
      const pool = new IpirPool(3, sameThreadPorts().spawn);
      const engine = await pool.engine(wasm);
      const table = await engine.openTable(params());
      const call = await table.call([0, 1, 2, 3, 4]);
      expect([made.length, live()]).toEqual([5, 5]);
      call.free();
      await settled(engine);
      expect(live()).toBe(0);
      // A call that fails in one worker: the requests the other workers made are freed too.
      await expect(table.call([0, 1, 2, 3, ROWS])).rejects.toThrow(/outside a table/);
      await settled(engine);
      expect(live()).toBe(0);
      // Calls never answered: freed with their table, or when the pool is closed.
      await table.call([5, 6, 7, 8]);
      expect(live()).toBe(4);
      table.free();
      await settled(engine);
      expect(live()).toBe(0);
      const other = await engine.openTable(params());
      await other.call([9, 10]);
      expect(live()).toBe(2);
      await pool.close();
      expect(live()).toBe(0);
    } finally {
      spy.mockRestore();
    }
  });

  it("review F8: a random source that gives every worker the same bytes gives no call", async () => {
    const pool = new IpirPool(2, sameThreadPorts().spawn);
    const engine = await pool.engine(wasm);
    const table = await engine.openTable(params());
    const spy = vi.spyOn(globalThis.crypto, "getRandomValues");
    try {
      // Each worker's instance takes its first draw (it has no earlier one to compare with); the pool sees two
      // requests under one key.
      spy.mockImplementation((a) => {
        new Uint8Array(a!.buffer, a!.byteOffset, a!.byteLength).fill(0x5a);
        return a;
      });
      await expect(table.call([3, 4])).rejects.toThrow(/requests 0 and 1 of one IPIR\+SP call carry the same key: the random source repeated itself/);
    } finally {
      spy.mockRestore();
    }
    // A working source again: distinct keys.
    const call = await table.call([3, 3, 3, 3]);
    const key = (q: number) => Buffer.from(call.requests.subarray(q * REQUEST + IPIR_HEADER_BYTES, q * REQUEST + IPIR_HEADER_BYTES + IPIR_KEY_BYTES));
    expect(new Set([0, 1, 2, 3].map((q) => key(q).toString("hex"))).size).toBe(4);
    // The check itself: a copied key is found, wherever it is.
    const copied = call.requests.slice();
    copied.set(key(1), 3 * REQUEST + IPIR_HEADER_BYTES);
    expect(() => checkDistinctKeys(copied, 4, REQUEST)).toThrow(/requests 1 and 3/);
    await pool.close();
  });

  it("a worker thread that dies fails every waiting and later call", async () => {
    // Worker 1 never answers a call.
    const ports = sameThreadPorts({ silent: (worker, task) => worker === 1 && task.op === "call" });
    const pool = new IpirPool(2, ports.spawn);
    const engine = await pool.engine(wasm);
    const table = await engine.openTable(params());
    const waiting = table.call([1, 2, 3]);
    const outcome = expect(waiting).rejects.toThrow(/an IPIR\+SP worker failed: out of memory/);
    await new Promise((resolve) => setTimeout(resolve, 20));
    ports.fail[1]!(new Error("out of memory"));
    await outcome;
    expect(ports.terminatedCount()).toBe(2);
    await expect(table.call([1])).rejects.toThrow(/an IPIR\+SP worker failed/);
    await expect(pool.engine(wasm).then((e) => e.openTable(params()))).rejects.toThrow(/an IPIR\+SP worker failed/);
    await pool.close();
  });
});
