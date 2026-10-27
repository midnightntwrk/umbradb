import type { TapeRecord } from "../../tools/tape/index.js";
import { E, type EventSpec, ledgerTransactions } from "../backbone/chain-data-tapes.js";
import { eventsValue, finalizedWithEvents, RUNTIME_2_0 } from "../backbone/events-fixtures.js";
import {
  blockRef,
  type ChainBlock,
  chainBlock,
  chainOf,
  finalizedHead,
  headRead,
  ledgerTransaction,
  opening,
} from "../backbone/fetch-fixtures.js";

/**
 * The synthetic tapes of the browser build's tests (task 16.1; A129–A132), in the node's answer shapes
 * (`test/backbone/fetch-fixtures.ts`, `events-fixtures.ts`): blocks 0 to {@link BrowserChain.last} of runtime 2.0, the
 * blocks {@link LEDGER_HEIGHTS} with real ledger v9 transactions (`test/ledger/adapter-fixtures.ts`: regular ones and a
 * system one, each with its `TxApplied` or `SystemTransactionApplied` event), so that `core-block-parsed` parses them
 * in the ledger worker and `core-tx-results` records their outcomes.
 *
 * **Sessions** (TT-2: the tape node serves its k-th connection the k-th session):
 * - {@link headSession}: a page with a new database asks the node's finalized head (BR-2: S is the head at creation) on
 *   a connection of its own — `chain_getFinalizedHead`, then the head's header —, which then ends;
 * - {@link syncSession}: the process on a new database from S, the head S at first, then each height to `to` finalized
 *   in turn (a finalized-head notification once the height before was fetched), so the process commits S to `to`;
 * - {@link resumeSession}: the process again on a database whose cursor is `cursor` (an OPFS database after a reload):
 *   the node's head is the cursor, so it resumes there and waits; {@link continueSession}: the same, then each height
 *   to `to` finalized in turn;
 * - {@link restoreSession}: a restore's checks against the node (BK-3, BK-5) — block 0, the finalized head (the
 *   source's subscriptions first), the block at the backup's height when the head is not below it —;
 *   {@link otherGenesisSession}: a node whose block 0 is another chain's.
 *
 * A session the page keeps open while a later one waits for the next connection (a reload's) ends with {@link
 * KEPT_OPEN}: a call record nothing asks, then the `disconnect` that separates the sessions — which, coming after a
 * record never answered, is never reached, so the connection is not dropped (TT-3).
 */

/** The end of a session the page keeps open (see the module comment): a call no process makes, then the separator. */
export const KEPT_OPEN: readonly TapeRecord[] = Object.freeze([
  { method: "chain_getBlockHash", params: [999_999], result: `0x${"09".repeat(32)}` },
  { disconnect: true },
]);

/** The heights that hold ledger transactions. */
export const LEDGER_HEIGHTS: readonly bigint[] = [4n, 6n];

/** The chain of the browser tapes. */
export interface BrowserChain {
  readonly blocks: readonly ChainBlock[];
  /** The last block's height. */
  readonly last: bigint;
  /** Each height's events (as the node's `System::Events` value encodes them). */
  readonly events: ReadonlyMap<bigint, readonly EventSpec[]>;
  /** The genesis hash, `0x` hex: the tests' `custom` network's `genesisHash`. */
  readonly genesis: string;
  /** How many ledger transactions each height holds. */
  readonly transactions: ReadonlyMap<bigint, number>;
}

/** Blocks 0 to `last` (see the module comment). */
export function browserChain(last = 9n): BrowserChain {
  const { regular, system } = ledgerTransactions(4, 1);
  const byHeight = new Map<bigint, { extrinsics: Uint8Array[]; events: EventSpec[] }>();
  // Height 4: two regular transactions; height 6: a system one and two regular ones.
  const [r1, r2, r3, r4] = regular as [Uint8Array, Uint8Array, Uint8Array, Uint8Array];
  const [s1] = system as [Uint8Array];
  byHeight.set(4n, {
    extrinsics: [ledgerTransaction([...r1]), ledgerTransaction([...r2])],
    events: [E.success(0), E.txApplied(1, r1), E.success(1), E.txApplied(2, r2), E.success(2)],
  });
  byHeight.set(6n, {
    extrinsics: [ledgerTransaction([...r3]), ledgerTransaction([...r4])],
    events: [E.success(0), E.txApplied(1, r3), E.success(1), E.txApplied(2, r4), E.success(2), E.systemApplied("finalization", s1)],
  });
  const blocks = chainOf(last, (height) => ({
    specVersion: RUNTIME_2_0.specVersion,
    timestampPallet: RUNTIME_2_0.shape.timestampIndex,
    extrinsics: byHeight.get(height)?.extrinsics ?? [],
  }));
  const events = new Map<bigint, readonly EventSpec[]>();
  const transactions = new Map<bigint, number>();
  for (let height = 0n; height <= last; height++) {
    events.set(height, byHeight.get(height)?.events ?? [E.success(0)]);
    transactions.set(height, height === 4n ? 2 : height === 6n ? 3 : 0);
  }
  return Object.freeze({ blocks, last, events, genesis: (blocks[0] as ChainBlock).hex, transactions });
}

const at = (chain: BrowserChain, height: bigint): ChainBlock => {
  const block = chain.blocks[Number(height)];
  if (block === undefined) throw new Error(`the browser chain has no block ${height}`);
  return block;
};

/** A finalized height's calls: its block, the runtime at its parent (with the metadata when `metadata`), its events. */
function height(chain: BrowserChain, h: bigint, metadata: boolean): TapeRecord[] {
  const value = eventsValue((chain.events.get(h) ?? []).map((event) => event.record));
  return finalizedWithEvents(at(chain, h), RUNTIME_2_0, value, metadata);
}

/** A page's question for the node's finalized head, `head` (BR-2; see the module comment). */
export function headSession(chain: BrowserChain, head: bigint): TapeRecord[] {
  return [...headRead(at(chain, head)), { disconnect: true }];
}

/** The process on a new database from S = `start` to `to` (see the module comment). */
export function syncSession(chain: BrowserChain, start: bigint, to: bigint): TapeRecord[] {
  const records: TapeRecord[] = [...opening(at(chain, 0n), at(chain, start)), ...height(chain, start, true)];
  for (let h = start + 1n; h <= to; h++) records.push(finalizedHead(at(chain, h)), ...height(chain, h, false));
  return records;
}

/** The process again on a database whose cursor is `cursor`, the node's head there (see the module comment). */
export function resumeSession(chain: BrowserChain, cursor: bigint): TapeRecord[] {
  return [
    ...opening(at(chain, 0n), at(chain, cursor)),
    { method: "chain_getBlockHash", params: [Number(cursor)], result: at(chain, cursor).hex },
  ];
}

/** The process again on a database whose cursor is `cursor`, then each height to `to` (see the module comment). */
export function continueSession(chain: BrowserChain, cursor: bigint, to: bigint): TapeRecord[] {
  const records = resumeSession(chain, cursor);
  // A new run of the process asks the runtime's metadata again, at the first height it fetches.
  for (let h = cursor + 1n; h <= to; h++) records.push(finalizedHead(at(chain, h)), ...height(chain, h, h === cursor + 1n));
  return records;
}

/**
 * A restore's reads of the node whose finalized head is `head`, for a backup at `backupHeight` (see the module comment);
 * the connection kept open ({@link KEPT_OPEN}) until the restore closes it, so its node client never connects again.
 */
export function restoreSession(chain: BrowserChain, head: bigint, backupHeight: bigint): TapeRecord[] {
  const records = [...opening(at(chain, 0n), at(chain, head))];
  if (backupHeight <= head) records.push(...blockRef(at(chain, backupHeight)));
  return [...records, ...KEPT_OPEN];
}

/** A restore's first read of a node whose block 0 is another chain's: `backup-genesis-mismatch`. */
export function otherGenesisSession(): TapeRecord[] {
  return [...blockRef(chainBlock(0n, null, { branch: "another chain" })), ...KEPT_OPEN];
}

