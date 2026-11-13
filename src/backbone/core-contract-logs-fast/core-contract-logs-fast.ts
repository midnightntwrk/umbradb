/**
 * The core module `core-contract-logs-fast`: the MIP-0002 events of every block, read from its transcripts without the
 * ledger state, as the shared item `contract-logs` (`../contract-logs/`) and its tables `contract_logs.logs` and
 * `contract_logs.unresolved`. A log site it cannot read exactly is an unresolved site: it is recorded, with its reason,
 * and never turned into a log. On a block without unresolved sites it stores exactly the rows `core-contract-logs-full`
 * would store. It runs only when development modules are explicitly enabled, and it may start mid-chain, since nothing
 * it reads depends on an earlier block.
 *
 * **Its ledger task** (`./task.ts`) runs in the ledger worker on the block's one parse. It reads each transaction's
 * `log` sites, in the ledger's emission order (`./transcripts.ts`); there are none on ledger v8. The result is the
 * module's `block` item `contract-log-sites`, put before the module's own `on-parse` callback runs
 * (`src/ledger/tasks.ts`).
 *
 * **At `on-parse`** (after `core-block-parsed`'s, whose item it requires) it takes those sites, and each transaction's
 * chain outcome from the event that placed it (`chain-events`, read as `core-tx-results` reads it: `outcomeOf`). Then,
 * for each transaction, in the block's order ({@link fastLogsFrom}):
 * - a chain failure: nothing, since the ledger never ran it and `-full` has no log of it;
 * - a full success: each site in emission order. A literal gives its log (from `decodeLogItem`); an oversized literal
 *   gives none; any other site is unresolved (`not-a-literal`, `conditional`);
 * - a partial success: its guaranteed section ran, so its guaranteed sites are read as a full success's. Its fallible
 *   sites are unresolved (`partial-transaction`): the chain's `TxPartialSuccess` does not say which fallible segments
 *   failed, so not which of their logs the ledger kept. An oversized literal there gives nothing either way.
 *
 * Logs and unresolved sites are numbered by one count in the block from 0, in emission order (`../contract-logs/`):
 * every site that gives a log or is unresolved takes the next number. So a block without unresolved sites has
 * `-full`'s numbers, and in a block with some, each log keeps the place its site gives it, whatever the unresolved sites
 * emitted.
 *
 * The logical segment of every contract log is 0 in the ledger ({@link LOGICAL_SEGMENT}).
 *
 * **At `on-db-write`** it writes the item's logs and its unresolved sites, one statement each (none for none).
 *
 * The declaration ({@link CORE_CONTRACT_LOGS_FAST}) is a constant over its reader and rule; a negative control's build
 * composes its own with {@link coreContractLogsFast}.
 */

import { z } from "zod";
import { UMBRADB_VERSION } from "../../config/build.js";
import type { ChainOutcome } from "../../ledger/types.js";
import { type BlockContext, type DefinedModule, defineModule, type ModuleDeclaration } from "../../modules/declaration.js";
import {
  type ContractLog,
  contractLogsBlock,
  type ContractLogsBlock,
  contractLogsItem,
  contractLogsItemOf,
  contractLogsMigrations,
  CONTRACT_LOGS_ITEM,
  type UnresolvedLogSite,
  unresolvedLogSitesOf,
  writeLogRows,
  writeUnresolvedRows,
} from "../contract-logs/contract-logs.js";
import { type BlockTransaction, blockParsedItemOf } from "../core-block-parsed/core-block-parsed.js";
import { chainEventsItemOf } from "../core-chain-events/core-chain-events.js";
import { outcomeOf } from "../core-tx-results/core-tx-results.js";
import { CONTRACT_LOG_SITES_ITEM, CONTRACT_LOG_SITES_TASK, CORE_CONTRACT_LOGS_FAST_ID } from "./task.js";
import type { LogSite } from "./transcripts.js";

export { CONTRACT_LOG_SITES_ITEM, CONTRACT_LOG_SITES_TASK, CORE_CONTRACT_LOGS_FAST_ID, LEDGERS_WITHOUT_LOGS } from "./task.js";

/**
 * Reads the `log` sites of a block's transactions somewhere else than the module's ledger task: a negative control's
 * seam (its main-thread reading, a second parse, `test/backbone/main-thread-log-reader.ts`).
 */
export interface FastLogReader {
  /** Each of `transactions`' sites, in its order; none for a ledger without MIP-0002 logs. */
  read(ledger: string, transactions: readonly Uint8Array[]): Promise<readonly (readonly LogSite[])[]>;
}

/**
 * The logical segment of every contract log: the ledger's event source for a contract call's events is segment 0 in
 * the guaranteed section and `GUARANTEED_SEGMENT` (0) in a fallible one (`midnight-ledger` 9.1.0.0-rc.5
 * `ledger/src/semantics.rs` `apply_section`), as `-full`'s `vm-logs` carry it.
 */
export const LOGICAL_SEGMENT = 0;

/** The rule from a block's transactions, outcomes and sites to its item, as {@link fastLogsFrom} has it. */
export type FastLogsRule = (
  height: bigint,
  transactions: readonly BlockTransaction[],
  outcomes: readonly ChainOutcome[],
  sites: readonly (readonly LogSite[])[],
) => ContractLogsBlock;

/**
 * Block `height`'s logs and unresolved log sites from its `transactions` (`block-parsed`'s), their chain `outcomes` and
 * each one's log `sites` (see the module comment). Throws when the three do not have one entry per transaction.
 */
export function fastLogsFrom(
  height: bigint,
  transactions: readonly BlockTransaction[],
  outcomes: readonly ChainOutcome[],
  sites: readonly (readonly LogSite[])[],
): ContractLogsBlock {
  if (outcomes.length !== transactions.length) throw new Error(`block ${height}: ${outcomes.length} outcomes for ${transactions.length} transactions`);
  if (sites.length !== transactions.length) throw new Error(`block ${height}: ${transactions.length} transactions and ${sites.length} readings`);
  const logs: ContractLog[] = [];
  const unresolved: UnresolvedLogSite[] = [];
  let index = 0;
  transactions.forEach((transaction, i) => {
    const outcome = outcomes[i];
    if (outcome === "failure") return;
    for (const site of sites[i] as readonly LogSite[]) {
      const literal = "literal" in site.read ? site.read.literal : undefined;
      // An oversized literal gives no log, whether or not its segment ran.
      if (literal === null) continue;
      const where = { transaction: transaction.index, index: index++, address: site.address, entryPoint: site.entryPoint };
      const position = { segment: site.segment, fallible: site.fallible, call: site.call, op: site.op };
      if (outcome === "partial" && site.fallible) {
        unresolved.push({ ...where, reason: "partial-transaction", ...position });
      } else if ("unsure" in site.read) {
        unresolved.push({ ...where, reason: site.read.unsure, ...position });
      } else if (literal !== undefined) {
        logs.push({ ...where, logicalSegment: LOGICAL_SEGMENT, version: literal.version, eventType: literal.eventType, data: literal.data });
      }
    }
  });
  return { logs, unresolved };
}

/** What {@link coreContractLogsFast} reads with, and its rule a negative control may replace. */
export interface CoreContractLogsFastOptions {
  /** Where the transcripts are read: the module's ledger task (its `contract-log-sites` item) unless given. */
  readonly reader?: FastLogReader;
  /** The rule from the sites to the item: {@link fastLogsFrom} unless given. */
  readonly rule?: FastLogsRule;
}

/** Block `b`'s `log` sites: its `contract-log-sites` item (the ledger task's), or `reader`'s; one list per transaction. */
async function sitesOf(b: BlockContext, transactions: readonly BlockTransaction[], ledger: string, reader?: FastLogReader): Promise<readonly (readonly LogSite[])[]> {
  if (reader === undefined) {
    const sites = b.items.get(CONTRACT_LOG_SITES_ITEM) as readonly (readonly LogSite[])[] | undefined;
    if (sites === undefined) throw new Error(`block ${b.height}: ${CORE_CONTRACT_LOGS_FAST_ID} has no ${CONTRACT_LOG_SITES_ITEM} item, its ledger task's`);
    return sites;
  }
  const calling = transactions.filter((transaction) => transaction.segments.some((segment) => segment.calls.length > 0));
  const read = await reader.read(ledger, calling.map((transaction) => transaction.bytes));
  if (read.length !== calling.length) throw new Error(`block ${b.height}: the reader read ${read.length} of ${calling.length} transactions`);
  const byIndex = new Map(calling.map((transaction, k) => [transaction.index, read[k] as readonly LogSite[]]));
  return transactions.map((transaction) => byIndex.get(transaction.index) ?? []);
}

/** Block `b`'s logs and unresolved log sites (see the module comment). */
export async function fastLogsOf(b: BlockContext, options: CoreContractLogsFastOptions = {}): Promise<ContractLogsBlock> {
  const { ledger, transactions } = blockParsedItemOf(b, CORE_CONTRACT_LOGS_FAST_ID);
  const events = chainEventsItemOf(b, CORE_CONTRACT_LOGS_FAST_ID);
  const outcomes = transactions.map((transaction) => outcomeOf(b.height, transaction, events));
  const sites = await sitesOf(b, transactions, ledger, options.reader);
  return (options.rule ?? fastLogsFrom)(b.height, transactions, outcomes, sites);
}

/**
 * `core-contract-logs-fast` with `options` (see the module comment): a development-only core module that requires
 * `chain-events` and `block-parsed`, provides the shared `contract-logs` and its ledger task's `contract-log-sites`, and
 * may start mid-chain.
 */
export function coreContractLogsFast(options: CoreContractLogsFastOptions = {}): DefinedModule<ModuleDeclaration> {
  return defineModule({
    id: CORE_CONTRACT_LOGS_FAST_ID,
    version: UMBRADB_VERSION,
    side: "public",
    requires: ["chain-events", "block-parsed"],
    provides: [contractLogsItem(), { name: CONTRACT_LOG_SITES_ITEM, lifetimes: ["block"] }],
    startsMidChain: true,
    developmentOnly: true,
    configSchema: z.object({}),
    migrations: contractLogsMigrations(),
    ledgerTasks: [CONTRACT_LOG_SITES_TASK],
    points: {
      async "on-parse"(_p, b, out) {
        const { logs, unresolved } = await fastLogsOf(b, options);
        out.put(CONTRACT_LOGS_ITEM, contractLogsBlock(logs, unresolved));
      },
      async "on-db-write"(_p, b, w) {
        await writeLogRows(w, b.height, contractLogsItemOf(b, CORE_CONTRACT_LOGS_FAST_ID));
        await writeUnresolvedRows(w, b.height, unresolvedLogSitesOf(b, CORE_CONTRACT_LOGS_FAST_ID));
      },
    },
  });
}

/** `core-contract-logs-fast` (see the module comment). */
export const CORE_CONTRACT_LOGS_FAST = coreContractLogsFast();
