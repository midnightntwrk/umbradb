import { Worker } from "node:worker_threads";

// Runs one request against a fresh instance of a vendored ledger package, in a worker thread (fixtures/fresh-instance.mjs).

export interface StoredNode {
  key: Uint8Array;
  data: Uint8Array;
  children: Uint8Array;
}

export interface FreshInstanceRequest {
  packagePath: string;
  op: "load" | "convert";
  key: Uint8Array;
  nodes: StoredNode[];
  /** The hex key of a node the store returns with its first payload byte flipped. */
  tamper?: string;
}

export interface FreshInstanceResult {
  stateRoot?: Uint8Array;
  stateKey?: Uint8Array;
  readsBeforeSerialize?: number;
  serialized?: Uint8Array;
  batch?: { inserts: StoredNode[]; rootCounts: { key: Uint8Array; delta: number }[] };
  requested: string[];
  error?: string;
  errorName?: string | null;
}

export function runInFreshInstance(request: FreshInstanceRequest): Promise<FreshInstanceResult> {
  return new Promise((resolve, reject) => {
    const worker = new Worker(new URL("./fixtures/fresh-instance.mjs", import.meta.url), { workerData: request });
    let settled = false;
    worker.once("message", (message: FreshInstanceResult) => {
      settled = true;
      resolve(message);
      void worker.terminate();
    });
    worker.once("error", (error) => {
      if (!settled) reject(error);
    });
    worker.once("exit", (code) => {
      if (!settled) reject(new Error(`the worker exited with code ${code} before answering`));
    });
  });
}
