/**
 * Where `core-block-parsed` has a block's transactions parsed (`openspec/changes/core-arch/specs/chain-data/spec.md`
 * CD-5, `specs/ledger/spec.md` LG-7; decision record Q4, Q49; task 11.1): a {@link TransactionParser} takes the
 * block's transactions in application order and the block's ledger version, and gives each one's plain data
 * (`ParsedTransaction`, `src/ledger/types.ts`) — one parse per transaction: the adapter keeps the native object it made
 * under the very array it parsed (`src/ledger/adapter.ts`), so a later step given the same array (the apply of
 * `core-ledger-state`, a ledger task) parses nothing again.
 *
 * **Until task 12.3's ledger worker:** {@link inThreadParser} parses in the thread `core-block-parsed` runs in, with
 * the adapter of the block's ledger version loaded there once (`loadLedgerPackage`). CD-5 places the parse in the
 * ledger worker (`design.md` §5.3, §5.5), which task 12.3 builds: there it parses each block's transactions once, keeps
 * the native objects for the block's apply and ledger tasks, and posts the plain data back — a `TransactionParser` of
 * its own, given to `core-block-parsed` in place of this one. Parsing reads no network id (`LedgerPackageOptions`'s is
 * for `emptyState` only), so this parser's adapters are made with {@link PARSE_NETWORK_ID}.
 */

import { loadLedgerPackage } from "../../ledger/load.js";
import type { LedgerName, LedgerPackage, LedgerPackageOptions, ParsedTransaction } from "../../ledger/types.js";

/** Parses a block's transactions, each once (see the module comment). */
export interface TransactionParser {
  /**
   * `transactions` — in application order, the index of each its place — parsed with the adapter of `ledger` (the
   * block's `ledger-version`); throws when one is not a transaction of that ledger version.
   */
  parse(ledger: string, transactions: readonly Uint8Array[]): Promise<readonly ParsedTransaction[]>;
}

/** The network id of the in-thread parser's adapters: parsing reads none (see the module comment). */
export const PARSE_NETWORK_ID = "undeployed";

/** What loads an adapter: `loadLedgerPackage`, or a test's. */
export type LoadLedger = (ledger: LedgerName, options: LedgerPackageOptions) => Promise<LedgerPackage>;

/** A parser over adapters loaded in this thread, once per ledger version (see the module comment). */
export function inThreadParser(load: LoadLedger = loadLedgerPackage): TransactionParser {
  const adapters = new Map<string, Promise<LedgerPackage>>();
  return Object.freeze({
    async parse(ledger: string, transactions: readonly Uint8Array[]): Promise<readonly ParsedTransaction[]> {
      if (transactions.length === 0) return Object.freeze([]);
      let adapter = adapters.get(ledger);
      if (adapter === undefined) {
        adapter = load(ledger as LedgerName, { networkId: PARSE_NETWORK_ID });
        adapters.set(ledger, adapter);
        adapter.catch(() => adapters.delete(ledger));
      }
      const loaded = await adapter;
      return Object.freeze(transactions.map((bytes, index) => loaded.parseTransaction(bytes, index)));
    },
  });
}
