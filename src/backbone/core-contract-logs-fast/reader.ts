/**
 * Where `core-contract-logs-fast` reads a block's transcripts (`openspec/changes/core-arch/specs/contract-data/spec.md`
 * CC-3; `design.md` §5.5; task 13.1): a {@link FastLogReader} takes the block's ledger version and the bytes of the
 * transactions that call contracts (`block-parsed`'s), and gives each one's `log` sites (`./transcripts.ts`), plain data.
 *
 * CC-3 reads them "in a ledger task that does not need the state (LG-17)": the ledger worker's tasks, with the native
 * objects of the block's one parse, are task 12.6's, not built yet. Until they are, {@link inThreadLogReader} reads in
 * the calling thread — the process's main thread —, as `core-block-parsed` parsed in its own thread before task 12.3:
 * the adapter of the block's ledger loaded there once (`loadLedgerPackage`, again after a failed load), each
 * transaction deserialized there a second time and its native objects freed once read. `-fast` is development only
 * (MD-5, Q21), so the second parse costs only development runs; `./transcripts.ts`'s function takes what a ledger task
 * takes, so task 12.6 runs it in the worker on the block's own parse and replaces this reader.
 *
 * **Ledger v8 has no MIP-0002 logs** (owner decision Q54: its adapter's `decodeLogItem` is null, its `apply` reports
 * no logs, and `-full` stores none): the reader reads no v8 transaction and loads no v8 package, so `-fast` stores no v8
 * log either, and never halts on one.
 */

import { loadLedgerPackage } from "../../ledger/load.js";
import type { LedgerName, LedgerPackage, LedgerPackageOptions } from "../../ledger/types.js";
import { type LogSite, logSitesOf } from "./transcripts.js";

/** Reads the `log` sites of a block's transactions (see the module comment). */
export interface FastLogReader {
  /** Each of `transactions`' sites, in its order; none for a ledger without MIP-0002 logs. */
  read(ledger: string, transactions: readonly Uint8Array[]): Promise<readonly (readonly LogSite[])[]>;
}

/** The ledgers with no MIP-0002 logs (Q54). */
export const LEDGERS_WITHOUT_LOGS: readonly string[] = Object.freeze(["v8"]);

/** What loads an adapter: `loadLedgerPackage`, or a test's. */
export type LoadAdapter = (ledger: LedgerName, options: LedgerPackageOptions) => Promise<LedgerPackage>;

/** Parsing and reading read no network id (`LedgerPackageOptions`'s is for `emptyState` only). */
const READ_NETWORK_ID = "undeployed";

/** A reader over adapters loaded in the calling thread, once per ledger version (see the module comment). */
export function inThreadLogReader(load: LoadAdapter = loadLedgerPackage): FastLogReader {
  const adapters = new Map<string, Promise<LedgerPackage>>();
  return Object.freeze({
    async read(ledger: string, transactions: readonly Uint8Array[]): Promise<readonly (readonly LogSite[])[]> {
      if (LEDGERS_WITHOUT_LOGS.includes(ledger)) return transactions.map(() => []);
      if (transactions.length === 0) return [];
      let adapter = adapters.get(ledger);
      if (adapter === undefined) {
        adapter = load(ledger as LedgerName, { networkId: READ_NETWORK_ID });
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
