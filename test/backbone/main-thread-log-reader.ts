import type { FastLogReader } from "../../src/backbone/core-contract-logs-fast/core-contract-logs-fast.js";
import { LEDGERS_WITHOUT_LOGS } from "../../src/backbone/core-contract-logs-fast/task.js";
import { logSitesOf } from "../../src/backbone/core-contract-logs-fast/transcripts.js";
import { loadLedgerPackage } from "../../src/ledger/load.js";
import type { LedgerName, LedgerPackage, LedgerPackageOptions } from "../../src/ledger/types.js";

/**
 * `core-contract-logs-fast`'s reading in the calling thread, as the module did it before its reading moved into its
 * ledger task (`src/backbone/core-contract-logs-fast/task.ts`):
 * - the adapter of the block's ledger is loaded here once (and again after a failed load);
 * - each calling transaction is deserialized here a second time, and its native objects are freed once read;
 * - a ledger without logs (v8) reads none. [Q54]
 *
 * The tests use it to read a transaction's sites on this thread, and as the negative control of the ledger task's
 * parse count (a second parse on the main thread).
 */

/** What loads an adapter: `loadLedgerPackage`, or a test's. */
export type LoadAdapter = (ledger: LedgerName, options: LedgerPackageOptions) => Promise<LedgerPackage>;

/** A reader over adapters loaded in the calling thread, once per ledger version (see the module comment). */
export function mainThreadLogReader(load: LoadAdapter = loadLedgerPackage): FastLogReader {
  const adapters = new Map<string, Promise<LedgerPackage>>();
  return Object.freeze({
    async read(ledger: string, transactions: readonly Uint8Array[]) {
      if (LEDGERS_WITHOUT_LOGS.includes(ledger)) return transactions.map(() => []);
      if (transactions.length === 0) return [];
      let adapter = adapters.get(ledger);
      if (adapter === undefined) {
        adapter = load(ledger as LedgerName, { networkId: "undeployed" });
        adapters.set(ledger, adapter);
        adapter.catch(() => adapters.delete(ledger));
      }
      const loaded = await adapter;
      const packages = loaded.rawPackages();
      return transactions.map((bytes) => {
        try {
          return logSitesOf(loaded.nativeTransaction(bytes), packages);
        } finally {
          loaded.forgetTransactions([bytes]);
        }
      });
    },
  });
}
