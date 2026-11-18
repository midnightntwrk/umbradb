// A loader of the ledger worker tests (`startLedgerWorker({ loader })`) that records, in the worker's thread, every
// request the thread receives: its type, the height of its block or input, a release's `upTo`, and when it arrived, on
// the clock every thread of the process shares (`performance.timeOrigin + performance.now()`, as
// `src/trace/worker-trace.ts`'s `traceClock`). It loads the adapters with the loader its data names
// ({@link RequestLogData}: a test package's), or the real ones. `LedgerHost.probe()` answers the record, its own
// request included. Erasable TypeScript only: the worker runs it through Node.js's type stripping.

import { parentPort } from "node:worker_threads";
import type { LedgerName, LedgerPackage, LedgerPackageOptions } from "../../../src/ledger/types.js";
import type { LedgerRequest } from "../../../src/ledger/worker/protocol.js";

/** One request as the worker's thread received it. */
export interface LoggedRequest {
  readonly type: string;
  /**
   * The height of its block (`parse`, `commit`) or input (`genesis`, `apply`, `load`, `retained`, `tasks`); else null.
   */
  readonly height: bigint | null;
  /** A release's `upTo`; else null. */
  readonly upTo: bigint | null;
  /** When it arrived, in ms on the clock every thread shares. */
  readonly at: number;
}

/** What the loader is given: the loader to load the adapters with (a URL) and its data; the real adapters without. */
export interface RequestLogData {
  readonly loader?: string;
  readonly data?: unknown;
}

const seen: LoggedRequest[] = [];

/** The height a request names, as `src/ledger/worker/host.ts` reads it for its activity. */
function heightOf(request: LedgerRequest): bigint | null {
  if (request.type === "parse" || request.type === "commit") return request.block.height;
  if ("input" in request) return request.input.height;
  return null;
}

// This module is imported before the worker listens (`src/ledger/worker/run.ts`), so it sees every request.
if (parentPort !== null) {
  parentPort.on("message", (message: { readonly request?: LedgerRequest }) => {
    const { request } = message;
    if (request === undefined) return;
    seen.push({
      type: request.type,
      height: heightOf(request),
      upTo: request.type === "release" ? (request.drop.upTo ?? null) : null,
      at: performance.timeOrigin + performance.now(),
    });
  });
}

/** The ledger worker's loader: the one `data` names, given its data, or the real adapters. */
export async function loadLedger(ledger: LedgerName, options: LedgerPackageOptions, data?: RequestLogData | null): Promise<LedgerPackage> {
  if (data?.loader === undefined) {
    const { loadLedgerPackage } = await import("../../../src/ledger/load.js");
    return loadLedgerPackage(ledger, options);
  }
  const inner = (await import(data.loader)) as {
    loadLedger(ledger: LedgerName, options: LedgerPackageOptions, data: unknown): Promise<LedgerPackage>;
  };
  return inner.loadLedger(ledger, options, data.data);
}

/** Every request so far, in the order received. */
export function probe(): readonly LoggedRequest[] {
  return [...seen];
}
