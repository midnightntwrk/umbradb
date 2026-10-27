/**
 * The core module `core-contract-logs-fast` (`openspec/changes/core-arch/specs/contract-data/spec.md` CC-3, CC-4;
 * `design.md` §10, §11; CORE-ARCH §4.11; decision record Q19 option D, Q20, Q21, Q54; task 13.1): the MIP-0002 events
 * of every block read from its transcripts without the ledger state, as the shared item `contract-logs`
 * (`../contract-logs/`) and its table `contract_logs.logs` — exactly the rows `core-contract-logs-full` would store, or a
 * halt. Development only (MD-5: the development opt-in); it may start mid-chain, as nothing it reads depends on an
 * earlier block.
 *
 * **Its ledger task** (`./task.ts`, LG-17; task 12.6) reads, in the ledger worker on the block's one parse, each
 * transaction's `log` sites in the ledger's emission order (`./transcripts.ts`; none on ledger v8, Q54): the module's
 * `block` item `contract-log-sites`, put at its `on-parse` before its own callback runs (`src/ledger/tasks.ts`).
 * **At `on-parse`** (after `core-block-parsed`'s, whose item it requires) it takes those sites and each transaction's
 * chain outcome from the event that placed it (`chain-events`, as `core-tx-results` reads it: `outcomeOf`).
 * Then, per transaction ({@link fastLogsFrom}):
 * - a chain failure: no log (the ledger never ran it; `-full` has none);
 * - a full success: each literal's log (`decodeLogItem`'s; an oversized one is none), numbered in the block from 0 in
 *   the order the ledger emits them — and a halt on any other log (`not-a-literal`, `conditional`);
 * - a partial success with any log: a halt (`partial-transaction`): the chain's `TxPartialSuccess` does not say which
 *   fallible segments failed (Q19), so neither which logs the ledger kept nor how the block's later logs are numbered.
 *
 * The halt is `fast-log-unsupported` (`design.md` §11, "Processing halts"; Q21 A): an `UmbraError` naming the height, the
 * transaction (its index and hash), the segment, the call, the op and why ({@link unsureLogError}); the runner halts
 * processing at that height with the code, `on-parse` and this module (RN-8), before the block's transaction — a
 * queued best block's failure is dropped and met again at finality. Its logical segment is the ledger's for every
 * contract log: 0 ({@link LOGICAL_SEGMENT}).
 *
 * **At `on-db-write`** it writes the item's logs, one row each, in one statement.
 *
 * The declaration ({@link CORE_CONTRACT_LOGS_FAST}) is a constant over its reader and rule; a negative control's build
 * composes its own with {@link coreContractLogsFast}.
 */

import { z } from "zod";
import { UMBRADB_VERSION } from "../../config/build.js";
import { UmbraError } from "../../db/errors.js";
import type { ChainOutcome } from "../../ledger/types.js";
import { type BlockContext, defineModule, type ModuleDeclaration } from "../../modules/declaration.js";
import {
  type ContractLog,
  contractLogsItem,
  contractLogsItemOf,
  contractLogsMigrations,
  CONTRACT_LOGS_ITEM,
  frozenLogs,
  writeLogRows,
} from "../contract-logs/contract-logs.js";
import { type BlockTransaction, blockParsedItemOf } from "../core-block-parsed/core-block-parsed.js";
import { chainEventsItemOf } from "../core-chain-events/core-chain-events.js";
import { outcomeOf } from "../core-tx-results/core-tx-results.js";
import { CONTRACT_LOG_SITES_ITEM, CONTRACT_LOG_SITES_TASK, CORE_CONTRACT_LOGS_FAST_ID } from "./task.js";
import type { LogSite, UnsureReason } from "./transcripts.js";

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

/** A log `-fast` cannot read exactly, and why (see the module comment). */
export interface UnsureLog {
  readonly height: bigint;
  readonly transaction: BlockTransaction;
  readonly reason: "partial-transaction" | UnsureReason;
  /** The log site: the unsure one, or a partial success's first. */
  readonly site: LogSite;
}

const WHY: Readonly<Record<UnsureLog["reason"], string>> = {
  "partial-transaction":
    "its transaction is partially successful, and the chain does not say which fallible segments failed, so neither " +
    "which of its logs the ledger kept nor how the block's later logs are numbered",
  "not-a-literal":
    "the value it logs is not a literal the transcript pushes right before it: a value read from the contract's state, " +
    "or computed",
  conditional: "a branch or jump before it may skip it or its push: whether it runs, and what it logs, depends on a value at run time",
};

const hex = (bytes: Uint8Array): string => `0x${Buffer.from(bytes).toString("hex")}`;

/** The halt of an {@link UnsureLog} (`fast-log-unsupported`; see the module comment). */
export function unsureLogError(unsure: UnsureLog): UmbraError {
  const { height, transaction, reason, site } = unsure;
  return new UmbraError(
    "fast-log-unsupported",
    `core-contract-logs-fast cannot read log op ${site.op} of call ${site.call} (contract ${hex(site.address)}) in the ` +
      `${site.fallible ? "fallible" : "guaranteed"} transcript of segment ${site.segment} of transaction ` +
      `${transaction.index} (${hex(transaction.hash)}) at height ${height} exactly: ${WHY[reason]}. ` +
      "core-contract-logs-full, from the full apply, stores every log (CC-3, Q21)",
    {
      height,
      transaction: transaction.index,
      hash: hex(transaction.hash),
      reason,
      segment: site.segment,
      fallible: site.fallible,
      call: site.call,
      op: site.op,
      address: hex(site.address),
    },
  );
}

/** {@link unsureLogError}, thrown: the rule as shipped. */
function halt(unsure: UnsureLog): never {
  throw unsureLogError(unsure);
}

/**
 * Block `height`'s logs from its `transactions` (`block-parsed`'s), their chain `outcomes` and each one's log `sites`
 * (see the module comment); `onUnsure` is told of each log it cannot read exactly — the rule halts —, which then gives
 * no row.
 */
export function fastLogsFrom(
  height: bigint,
  transactions: readonly BlockTransaction[],
  outcomes: readonly ChainOutcome[],
  sites: readonly (readonly LogSite[])[],
  onUnsure: (unsure: UnsureLog) => void,
): ContractLog[] {
  if (outcomes.length !== transactions.length) throw new Error(`block ${height}: ${outcomes.length} outcomes for ${transactions.length} transactions`);
  if (sites.length !== transactions.length) throw new Error(`block ${height}: ${transactions.length} transactions and ${sites.length} readings`);
  const logs: ContractLog[] = [];
  transactions.forEach((transaction, i) => {
    const list = sites[i] as readonly LogSite[];
    const outcome = outcomes[i];
    if (outcome === "failure" || list.length === 0) return;
    if (outcome === "partial") {
      onUnsure({ height, transaction, reason: "partial-transaction", site: list[0] as LogSite });
      return;
    }
    for (const site of list) {
      if ("unsure" in site.read) {
        onUnsure({ height, transaction, reason: site.read.unsure, site });
        continue;
      }
      const literal = site.read.literal;
      if (literal === null) continue;
      logs.push({
        transaction: transaction.index,
        index: logs.length,
        address: site.address,
        entryPoint: site.entryPoint,
        logicalSegment: LOGICAL_SEGMENT,
        version: literal.version,
        eventType: literal.eventType,
        data: literal.data,
      });
    }
  });
  return logs;
}

/** What {@link coreContractLogsFast} reads with, and its rule a negative control may replace. */
export interface CoreContractLogsFastOptions {
  /** Where the transcripts are read: the module's ledger task (its `contract-log-sites` item) unless given. */
  readonly reader?: FastLogReader;
  /** CC-3: what a log it cannot read exactly does; the halt (`fast-log-unsupported`). */
  readonly onUnsure?: (unsure: UnsureLog) => void;
}

/** Block `b`'s `log` sites: its `contract-log-sites` item (the ledger task's), or `reader`'s; one list per transaction. */
async function sitesOf(b: BlockContext, transactions: readonly BlockTransaction[], ledger: string, reader?: FastLogReader): Promise<readonly (readonly LogSite[])[]> {
  if (reader === undefined) {
    const sites = b.items.get(CONTRACT_LOG_SITES_ITEM) as readonly (readonly LogSite[])[] | undefined;
    if (sites === undefined) throw new Error(`block ${b.height}: ${CORE_CONTRACT_LOGS_FAST_ID} has no ${CONTRACT_LOG_SITES_ITEM} item, its ledger task's (LG-17)`);
    return sites;
  }
  const calling = transactions.filter((transaction) => transaction.segments.some((segment) => segment.calls.length > 0));
  const read = await reader.read(ledger, calling.map((transaction) => transaction.bytes));
  if (read.length !== calling.length) throw new Error(`block ${b.height}: the reader read ${read.length} of ${calling.length} transactions`);
  const byIndex = new Map(calling.map((transaction, k) => [transaction.index, read[k] as readonly LogSite[]]));
  return transactions.map((transaction) => byIndex.get(transaction.index) ?? []);
}

/** Block `b`'s logs (see the module comment). */
export async function fastLogsOf(b: BlockContext, options: CoreContractLogsFastOptions = {}): Promise<ContractLog[]> {
  const { ledger, transactions } = blockParsedItemOf(b, CORE_CONTRACT_LOGS_FAST_ID);
  const events = chainEventsItemOf(b, CORE_CONTRACT_LOGS_FAST_ID);
  const outcomes = transactions.map((transaction) => outcomeOf(b.height, transaction, events));
  const sites = await sitesOf(b, transactions, ledger, options.reader);
  return fastLogsFrom(b.height, transactions, outcomes, sites, options.onUnsure ?? halt);
}

/**
 * `core-contract-logs-fast` with `options` (see the module comment): a development-only core module that requires
 * `chain-events` and `block-parsed`, provides the shared `contract-logs` and its ledger task's `contract-log-sites`, and
 * may start mid-chain.
 */
export function coreContractLogsFast(options: CoreContractLogsFastOptions = {}): ModuleDeclaration {
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
        out.put(CONTRACT_LOGS_ITEM, frozenLogs(await fastLogsOf(b, options)));
      },
      async "on-db-write"(_p, b, w) {
        await writeLogRows(w, b.height, contractLogsItemOf(b, CORE_CONTRACT_LOGS_FAST_ID));
      },
    },
  });
}

/** `core-contract-logs-fast` (see the module comment). */
export const CORE_CONTRACT_LOGS_FAST = coreContractLogsFast();
