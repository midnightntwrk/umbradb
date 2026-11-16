/**
 * What one worker of the IPIR+SP pool (`./pool.ts`) does with a message: it holds one instance of the wallet's
 * WebAssembly (`./engine.ts`, `IpirLocal`), the tables opened on it and the calls not yet freed. Platform-neutral: the
 * entry files (`./pool-worker-node.ts` for `worker_threads`, the page's `../web/ipir-worker.ts` for a Web Worker) pass
 * each message to {@link ipirWorker}'s handler and post its reply.
 *
 * Every message is handled to its end before the next, so a `free` posted after a `decode` runs after it. A request's
 * secret is drawn inside this worker's instance from this worker's `crypto.getRandomValues` and never leaves it: a
 * reply carries the request bytes or the decoded cells only.
 */

import { IpirLocal, type IpirLocalCall, type IpirLocalTable } from "./engine.ts";
import type { IpirTableParams } from "./wallet.ts";

/** A message to a worker. Table and call numbers are the pool's. */
export type IpirTask =
  | { readonly id: number; readonly op: "init"; readonly module: WebAssembly.Module }
  | { readonly id: number; readonly op: "open"; readonly table: number; readonly params: IpirTableParams }
  | { readonly id: number; readonly op: "call"; readonly table: number; readonly call: number; readonly rows: readonly number[] }
  | { readonly id: number; readonly op: "decode"; readonly call: number; readonly responses: Uint8Array; readonly wanted: number }
  | { readonly id: number; readonly op: "free-call"; readonly call: number }
  | { readonly id: number; readonly op: "free-table"; readonly table: number }
  | { readonly id: number; readonly op: "close" };

/** A worker's answer to the task of the same `id`. */
export interface IpirReply {
  readonly id: number;
  readonly error?: string;
  /** `call`: the requests' bytes. */
  readonly requests?: Uint8Array;
  /** `decode`: `wanted × cols` cells. */
  readonly cells?: Uint16Array;
}

/** A reply and the buffers to move with it instead of copying. */
export interface IpirPosted {
  readonly reply: IpirReply;
  readonly transfer: ArrayBuffer[];
}

/** One worker's state; the returned function answers one task. */
export function ipirWorker(): (task: IpirTask) => IpirPosted {
  let local: IpirLocal | null = null;
  const tables = new Map<number, IpirLocalTable>();
  /** The calls not yet freed, each with its table's number. */
  const calls = new Map<number, { readonly call: IpirLocalCall; readonly table: number }>();

  const run = (task: IpirTask): Omit<IpirReply, "id"> => {
    switch (task.op) {
      case "init":
        local = new IpirLocal(task.module);
        return {};
      case "open": {
        if (local === null) throw new Error("the worker has no WebAssembly yet");
        tables.set(task.table, local.openTable(task.params));
        return {};
      }
      case "call": {
        const table = tables.get(task.table);
        if (table === undefined) throw new Error(`the worker has no table ${task.table}`);
        const call = table.call(task.rows);
        calls.set(task.call, { call, table: task.table });
        return { requests: call.requests };
      }
      case "decode": {
        const made = calls.get(task.call);
        if (made === undefined) throw new Error(`the worker has no call ${task.call}`);
        return { cells: made.call.decode(task.responses, task.wanted) };
      }
      case "free-call":
        // A call this worker never made (its making failed) is nothing to free.
        calls.get(task.call)?.call.free();
        calls.delete(task.call);
        return {};
      case "free-table":
        // Freeing the table frees its calls too.
        tables.get(task.table)?.free();
        tables.delete(task.table);
        for (const [number, made] of calls) if (made.table === task.table) calls.delete(number);
        return {};
      case "close":
        for (const made of calls.values()) made.call.free();
        calls.clear();
        for (const table of tables.values()) table.free();
        tables.clear();
        local = null;
        return {};
    }
  };

  return (task) => {
    try {
      const reply = { id: task.id, ...run(task) };
      const transfer: ArrayBuffer[] = [];
      if (reply.requests !== undefined) transfer.push(reply.requests.buffer as ArrayBuffer);
      if (reply.cells !== undefined) transfer.push(reply.cells.buffer as ArrayBuffer);
      return { reply, transfer };
    } catch (error) {
      return { reply: { id: task.id, error: error instanceof Error ? error.message : String(error) }, transfer: [] };
    }
  };
}
