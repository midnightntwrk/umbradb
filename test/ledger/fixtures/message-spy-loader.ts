// A loader of the ledger worker tests (`startLedgerWorker({ loader })`) that loads the real adapters and records, in
// the worker's thread, the shape of every message the thread receives and posts: which way it went, its type and its
// keys in order. `LedgerHost.probe()` answers the record. `test/ledger/worker-messages.test.ts` reads it to see what a
// traced process adds to the messages and that an untraced one adds nothing.
// Erasable TypeScript only: the worker runs it through Node.js's type stripping.

import { parentPort } from "node:worker_threads";
import { loadLedgerPackage } from "../../../src/ledger/load.js";
import type { LedgerName, LedgerPackage, LedgerPackageOptions } from "../../../src/ledger/types.js";

/** One message as the worker's thread saw it. */
export interface SeenMessage {
  /** `in`: from the main thread; `out`: posted by the worker. */
  readonly way: "in" | "out";
  /** A request's type, or what the worker posted: `answer`, `node` or `trace`. */
  readonly type: string;
  /** The message's own keys, in order. */
  readonly keys: readonly string[];
}

const seen: SeenMessage[] = [];

// This module is imported before the worker listens (`src/ledger/worker/run.ts`), so it sees every message.
if (parentPort !== null) {
  const port = parentPort;
  const post = port.postMessage.bind(port);
  port.postMessage = (message: Record<string, unknown>): void => {
    seen.push({ way: "out", type: String(message.type), keys: Object.keys(message) });
    post(message);
  };
  port.on("message", (message: { readonly request?: { readonly type?: unknown } }) => {
    seen.push({ way: "in", type: String(message.request?.type), keys: Object.keys(message) });
  });
}

/** The ledger worker's loader: the real adapter. */
export function loadLedger(ledger: LedgerName, options: LedgerPackageOptions): Promise<LedgerPackage> {
  return loadLedgerPackage(ledger, options);
}

/** Every message so far, the probe's own request included and its answer not. */
export function probe(): readonly SeenMessage[] {
  return [...seen];
}
