/**
 * The messages between the main thread and the ledger worker. They hold plain data only, the values Node.js's
 * structured clone carries (objects, arrays, strings, numbers, booleans, `bigint`s, `null`, `Uint8Array`s), and never
 * an object of a ledger package. Types only.
 */

import type { WorkerTraceEntry } from "../../trace/worker-trace.js";
import type { LedgerName } from "../types.js";
import type { ApplyBlock, BlockId, GenesisBlock, LoadState, TaskRun } from "./engine.js";

/** A request of the main thread, by kind (each one `LedgerEngine`'s method of that name, `./engine.ts`). */
export type LedgerRequest =
  | { readonly type: "parse"; readonly ledger: LedgerName; readonly block: BlockId; readonly transactions: Uint8Array[] }
  | { readonly type: "genesis-root"; readonly ledger: LedgerName; readonly bytes: Uint8Array }
  | { readonly type: "genesis"; readonly input: GenesisBlock }
  | { readonly type: "apply"; readonly input: ApplyBlock }
  | { readonly type: "commit"; readonly block: BlockId }
  | { readonly type: "release"; readonly drop: { readonly upTo?: bigint; readonly hashes?: readonly Uint8Array[] } }
  | { readonly type: "load"; readonly input: LoadState }
  | { readonly type: "retained"; readonly input: LoadState }
  | { readonly type: "evict"; readonly keys: Uint8Array[] }
  | { readonly type: "tasks"; readonly input: TaskRun }
  | { readonly type: "probe" };

/** A request's kind. */
export type LedgerRequestKind = LedgerRequest["type"];

/**
 * A request as sent: its number, which its answer and its node requests name. In a traced process only
 * (`src/trace/trace.ts`), also `at`: the clock both threads share (`src/trace/worker-trace.ts`'s `traceClock`, ms)
 * when it was posted.
 */
export interface ToLedgerWorker {
  readonly id: number;
  readonly request: LedgerRequest;
  readonly at?: number;
}

/** An error as the worker sends it: its class's name and its message. */
export interface SerializedError {
  readonly name: string;
  readonly message: string;
}

/**
 * What the worker sends: an answer, a node request of the request `id` serves (`./node-bridge.ts`), or, in a traced
 * process only, an applied block's trace entry (`src/trace/worker-trace.ts`). In a traced process only, an answer and
 * a node request also carry `at`: the shared clock when the worker posted them ({@link ToLedgerWorker}). An answer
 * carries `memory` where the runtime reports it: the bytes the thread held outside its JavaScript heap when it
 * answered, its ledger packages' WebAssembly memory and a few MiB more (`src/trace/memory.ts`'s
 * `threadExternalBytes`).
 */
export type FromLedgerWorker =
  | { readonly type: "answer"; readonly id: number; readonly ok: true; readonly value: unknown; readonly memory?: number; readonly at?: number }
  | {
      readonly type: "answer";
      readonly id: number;
      readonly ok: false;
      readonly fatal: boolean;
      readonly error: SerializedError;
      readonly memory?: number;
      readonly at?: number;
    }
  | { readonly type: "node"; readonly id: number; readonly at?: number }
  | { readonly type: "trace"; readonly entry: WorkerTraceEntry };
