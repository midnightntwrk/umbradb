import { createHash } from "node:crypto";
import type { TapeRecord } from "../../tools/tape/index.js";
import {
  failingSystemTransaction,
  RAW,
  systemTransaction,
  unprovenDeploy,
  zswapOutputTransaction,
} from "../ledger/adapter-fixtures.js";
import {
  dispatchInfo,
  ev,
  eventsRuntime,
  type EventsRuntime,
  eventsValue,
  finalizedWithEvents,
  moduleError,
  type Phase,
  remarkExtrinsic,
  RUNTIME_2_0,
  systemExtrinsic,
  V2_0,
  V2_1,
} from "./events-fixtures.js";
import { type ChainBlock, chainOf, hex, ledgerTransaction, opening } from "./fetch-fixtures.js";

/**
 * The synthetic tapes of the chain-data process tests (`chain-data.test.ts`, `chain-data.negative-control.test.ts`),
 * in the node's answer shapes (`./fetch-fixtures.ts`, `./events-fixtures.ts`). Each comes with what the database must
 * then hold: every event's row, and every transaction's row and outcome. [A91, A92, A93]
 *
 * The transactions are real ledger v9 transactions (`test/ledger/adapter-fixtures.ts`: proof-erased zswap outputs,
 * unproven deploys, `DistributeReserve` and `PayBlockRewardsToTreasury`), so the real adapter parses them. Their hash
 * is the SHA-256 of their bytes: the ledger's hash (`midnight-ledger` `Transaction::transaction_hash`) and the one the
 * node's events carry. No real node is involved: the real recorded tapes (`test/tape/real/`) replace these.
 */

const DISPATCH_CLASSES = ["Normal", "Operational", "Mandatory"] as const;
const PAYS = ["Yes", "No"] as const;

/** A JSON value as the database API reads a `jsonb` back. */
export type Json = string | number | boolean | null | readonly Json[] | { readonly [key: string]: Json };

/** An event a tape's block holds, with the row `core_chain_events.events` must hold for it. */
export interface EventSpec {
  readonly record: readonly number[];
  readonly phase: "initialization" | "apply-extrinsic" | "finalization";
  readonly extrinsicIndex: number | null;
  readonly pallet: string;
  readonly name: string;
  readonly fields: Json;
}

const phaseOf = (phase: Phase) =>
  typeof phase === "number"
    ? { phase: "apply-extrinsic" as const, extrinsicIndex: phase }
    : { phase: phase as "initialization" | "finalization", extrinsicIndex: null };

const sha = (bytes: Uint8Array): Uint8Array => new Uint8Array(createHash("sha256").update(bytes).digest());
const fill = (byte: number, length = 32): Uint8Array => new Uint8Array(length).fill(byte);

/** `DispatchEventInfo` as its row's JSON holds it. */
const info = (ref = 0n, proof = 0n, dispatchClass = 0, pays = 0): Json => ({
  dispatch_info: { class: DISPATCH_CLASSES[dispatchClass] as string, pays_fee: PAYS[pays] as string, weight: { proof_size: `${proof}`, ref_time: `${ref}` } },
});

/** The test runtime's events with their expected rows. */
export const E = Object.freeze({
  success: (i: Phase, ref = 0n, proof = 0n, c = 0, pays = 0): EventSpec => ({
    record: ev.success(i, dispatchInfo(ref, proof, c, pays)),
    ...phaseOf(i),
    pallet: "System",
    name: "ExtrinsicSuccess",
    fields: info(ref, proof, c, pays),
  }),
  badOrigin: (i: Phase): EventSpec => ({
    record: ev.failed(i, [2]),
    ...phaseOf(i),
    pallet: "System",
    name: "ExtrinsicFailed",
    fields: { dispatch_error: "BadOrigin", ...(info() as object) },
  }),
  moduleFailed: (i: Phase, index: number, error: number): EventSpec => ({
    record: ev.failed(i, moduleError(index, [error, 0, 0, 0])),
    ...phaseOf(i),
    pallet: "System",
    name: "ExtrinsicFailed",
    fields: { dispatch_error: { Module: { error: hex([error, 0, 0, 0]), index } }, ...(info() as object) },
  }),
  codeUpdated: (i: Phase, hash?: Uint8Array): EventSpec => ({
    record: ev.codeUpdated(i, hash),
    ...phaseOf(i),
    pallet: "System",
    name: "CodeUpdated",
    fields: hash === undefined ? [] : { hash: hex(hash) },
  }),
  remarked: (i: Phase, sender: Uint8Array, hash: Uint8Array, topics: readonly Uint8Array[] = []): EventSpec => ({
    record: ev.remarked(i, sender, hash, topics),
    ...phaseOf(i),
    pallet: "System",
    name: "Remarked",
    fields: { hash: hex(hash), sender: hex(sender) },
  }),
  txApplied: (i: Phase, transaction: Uint8Array): EventSpec => ({
    record: ev.txApplied(i, sha(transaction)),
    ...phaseOf(i),
    pallet: "Midnight",
    name: "TxApplied",
    fields: { tx_hash: hex(sha(transaction)) },
  }),
  txPartial: (i: Phase, transaction: Uint8Array): EventSpec => ({
    record: ev.txPartial(i, sha(transaction)),
    ...phaseOf(i),
    pallet: "Midnight",
    name: "TxPartialSuccess",
    fields: { tx_hash: hex(sha(transaction)) },
  }),
  payout: (i: Phase, amount: bigint, receiver: Uint8Array): EventSpec => ({
    record: ev.payout(i, amount, receiver),
    ...phaseOf(i),
    pallet: "Midnight",
    name: "PayoutMinted",
    fields: { amount: `${amount}`, receiver: hex(receiver) },
  }),
  systemApplied: (i: Phase, transaction: Uint8Array): EventSpec => ({
    record: ev.systemApplied(i, sha(transaction), transaction),
    ...phaseOf(i),
    pallet: "MidnightSystem",
    name: "SystemTransactionApplied",
    fields: { hash: hex(sha(transaction)), serialized_system_transaction: hex(transaction) },
  }),
  newSession: (i: Phase, index: number): EventSpec => ({
    record: ev.newSession(i, index),
    ...phaseOf(i),
    pallet: "Session",
    name: "NewSession",
    fields: { session_index: index },
  }),
  newAuthorities: (i: Phase, set: readonly (readonly [Uint8Array, bigint])[]): EventSpec => ({
    record: ev.newAuthorities(i, set),
    ...phaseOf(i),
    pallet: "Grandpa",
    name: "NewAuthorities",
    fields: { authority_set: set.map(([key, weight]) => [hex(key), `${weight}`]) },
  }),
});

/** A transaction a tape's block holds, with its rows in `core_block_parsed.transactions` and `core_tx_results.results`. */
export interface TransactionSpec {
  readonly height: bigint;
  readonly index: number;
  readonly kind: "regular" | "system";
  readonly bytes: Uint8Array;
  readonly hash: Uint8Array;
  readonly outcome: "success" | "partial" | "failure";
}

/** A tape and what the database must hold after it. */
export interface Scenario {
  readonly records: TapeRecord[];
  readonly start: bigint;
  readonly head: bigint;
  readonly chain: readonly ChainBlock[];
  /** Each processed height's `System::Events` value as the tape serves it (null: none). */
  readonly values: ReadonlyMap<bigint, Uint8Array | null>;
  /** Each processed height's events (empty for none). */
  readonly events: ReadonlyMap<bigint, readonly EventSpec[]>;
  readonly transactions: readonly TransactionSpec[];
}

/** A block of a scenario: its extra extrinsics and events (null: no `Events` value), and the runtime that built it. */
interface BlockSpec {
  readonly extrinsics?: readonly Uint8Array[];
  readonly events: readonly EventSpec[] | null;
  /** Its `Timestamp::set` (true unless false: block 0 of a genesis without one). */
  readonly timestamp?: boolean;
}

/**
 * A scenario over blocks 0 to `blocks.length − 1` of one runtime (or `runtimeOf` per height: the runtime that built the
 * block, whose parent's state holds it), processed from `start`.
 */
function scenario(
  start: bigint,
  blocks: readonly BlockSpec[],
  transactions: readonly TransactionSpec[],
  runtimeOf: (height: bigint) => EventsRuntime = () => RUNTIME_2_0,
): Scenario {
  const chain = chainOf(BigInt(blocks.length - 1), (h) => {
    const spec = blocks[Number(h)] as BlockSpec;
    const runtime = runtimeOf(h);
    return {
      specVersion: runtime.specVersion,
      timestampPallet: runtime.shape.timestampIndex,
      extrinsics: spec.extrinsics ?? [],
      ...(spec.timestamp === false ? { timestampMs: null } : {}),
    };
  });
  const head = chain.at(-1) as ChainBlock;
  const values = new Map<bigint, Uint8Array | null>();
  const events = new Map<bigint, readonly EventSpec[]>();
  const records: TapeRecord[] = [...opening(chain[0] as ChainBlock, head)];
  let lastSpec: number | null = null;
  for (let h = start; h <= head.height; h++) {
    const spec = blocks[Number(h)] as BlockSpec;
    const value = spec.events === null ? null : eventsValue(spec.events.map((event) => event.record));
    values.set(h, value);
    events.set(h, spec.events ?? []);
    // The runtime in the parent's state decodes the block (block 0: its own); its metadata is read at its first block.
    const runtime = runtimeOf(h);
    records.push(...finalizedWithEvents(chain[Number(h)] as ChainBlock, runtime, value, runtime.specVersion !== lastSpec));
    lastSpec = runtime.specVersion;
  }
  return { records, start, head: head.height, chain, values, events, transactions };
}

/** Distinct real ledger v9 transactions: `regular` regular ones (zswap outputs and unproven deploys), `system` system ones. */
export function ledgerTransactions(regular: number, system: number): { regular: Uint8Array[]; system: Uint8Array[] } {
  const r = Array.from({ length: regular }, (_, i) => (i % 2 === 0 ? zswapOutputTransaction(RAW.v9) : unprovenDeploy(RAW.v9)));
  const s = [systemTransaction("v9"), failingSystemTransaction("v9")].slice(0, system);
  if (s.length !== system) throw new Error("two system transactions at most");
  const all = [...r, ...s].map((bytes) => hex(bytes));
  if (new Set(all).size !== all.length) throw new Error("the fixtures gave two equal transactions");
  return { regular: r, system: s };
}

/** A transaction's expected rows: its height and index, kind, bytes, the ledger's hash (SHA-256 of the bytes), outcome. */
export const transactionSpec = (
  height: bigint,
  index: number,
  kind: "regular" | "system",
  bytes: Uint8Array,
  outcome: TransactionSpec["outcome"] = "success",
): TransactionSpec => Object.freeze({ height, index, kind, bytes, hash: sha(bytes), outcome });
const transaction = transactionSpec;

/**
 * The events range: blocks 1–6 from S = 1. It has events under every phase, of five pallets, with topics, a `u128` and
 * a tuple sequence; an empty `Events` value (block 3), none (block 4), and 41 events in one block (block 5). [A91]
 */
export function a91RangeScenario(): Scenario {
  const remark = [remarkExtrinsic()];
  const many = Array.from({ length: 40 }, (_, i) => E.remarked(1, fill(i), fill(0x80 + i), i % 3 === 0 ? [fill(0xf0 + (i % 16))] : []));
  return scenario(1n, [
    { events: null },
    {
      extrinsics: remark,
      events: [
        E.newSession("initialization", 7),
        E.success(0, 185_012_000n, 1_493n, 2, 0),
        E.remarked(1, fill(0x33), fill(0x44), [fill(0x01), fill(0x02)]),
        E.success(1, 77_708_157_001n, 0n, 0, 1),
        E.newAuthorities("finalization", [[fill(0x55), 1n], [fill(0x66), 18_446_744_073_709_551_615n]]),
      ],
    },
    { extrinsics: remark, events: [E.success(0), E.badOrigin(1), E.moduleFailed(1, 5, 3)] },
    { events: [] },
    { events: null },
    { extrinsics: remark, events: [E.success(0), ...many, E.success(1)] },
    { events: [E.payout(0, 2n ** 100n, Uint8Array.of(1, 2)), E.success(0)] },
  ], []);
}

/**
 * The runtimes of the runtime-upgrade scenario: 1_000_000 (v8 on preprod, 2.0's layout) builds 1 to U = 3; 2_000_000
 * (2.1's layout) builds from F = 4. [A91]
 */
export const OLD_RUNTIME = eventsRuntime(1_000_000, V2_0);
export const NEW_RUNTIME = eventsRuntime(2_000_000, V2_1);
export const U = 3n;

/**
 * The runtime upgrade. U's events are the old runtime's: its `CodeUpdated` has no fields, where the new runtime's has a
 * hash. F's events are the new runtime's (a `CodeUpdated { hash }` under `Initialization`, as a migration might write).
 * The tape answers the parent's-state reads the module makes and, for the negative control, `state_getMetadata` at
 * each block's own hash. [A91]
 */
export function a91UpgradeScenario(): Scenario {
  const remark = [remarkExtrinsic()];
  const base = scenario(
    1n,
    [
      { events: null },
      { extrinsics: remark, events: [E.success(0), E.success(1)] },
      { extrinsics: remark, events: [E.success(0), E.success(1)] },
      { extrinsics: remark, events: [E.success(0), E.codeUpdated(1), E.success(1, 5n, 6n, 2, 1)] },
      { extrinsics: remark, events: [E.codeUpdated("initialization", fill(0x77)), E.success(0), E.success(1)] },
      { extrinsics: remark, events: [E.success(0), E.success(1)] },
    ],
    [],
    (h) => (h <= U ? OLD_RUNTIME : NEW_RUNTIME),
  );
  const ownState = [1n, 2n, 4n, 5n].map((h): TapeRecord => ({
    method: "state_getMetadata",
    params: [(base.chain[Number(h)] as ChainBlock).hex],
    result: hex(h < U ? OLD_RUNTIME.metadata : NEW_RUNTIME.metadata),
  }));
  return { ...base, records: [...base.records, ...ownState] };
}

/**
 * The parse scenario. Block 1 holds regular R1 (extrinsic 1), a system transaction S applied during a governance
 * extrinsic (2), and regular R2 (3); they are stored as 0 = R1, 1 = S, 2 = R2. Block 2 holds none. [A92]
 */
export function a92Scenario(): Scenario {
  const { regular: [r1, r2], system: [s] } = ledgerTransactions(2, 1) as { regular: [Uint8Array, Uint8Array]; system: [Uint8Array] };
  return scenario(
    1n,
    [
      { events: null },
      {
        extrinsics: [ledgerTransaction([...r1]), remarkExtrinsic(), ledgerTransaction([...r2])],
        events: [E.success(0), E.txApplied(1, r1), E.success(1), E.systemApplied(2, s), E.success(2), E.txApplied(3, r2), E.success(3)],
      },
      { events: [E.success(0)] },
    ],
    [transaction(1n, 0, "regular", r1), transaction(1n, 1, "system", s), transaction(1n, 2, "regular", r2)],
  );
}

/**
 * The parse scenario's block 0: S0, R0a, a remark and R0b in its body, no events, no `Timestamp::set`. They are stored
 * as 0 = S0, 1 = R0a, 2 = R0b. [A92]
 */
export function a92GenesisScenario(): Scenario {
  const { regular: [ra, rb], system: [s0] } = ledgerTransactions(2, 1) as { regular: [Uint8Array, Uint8Array]; system: [Uint8Array] };
  return scenario(
    0n,
    [
      { timestamp: false, extrinsics: [systemExtrinsic(s0), ledgerTransaction([...ra]), remarkExtrinsic(), ledgerTransaction([...rb])], events: null },
      { events: [E.success(0)] },
    ],
    [transaction(0n, 0, "system", s0), transaction(0n, 1, "regular", ra), transaction(0n, 2, "regular", rb)],
  );
}

/**
 * The outcomes scenario. Block 1 holds A (extrinsic 1, `TxApplied`), a failing remark (2), B (3, `TxPartialSuccess`),
 * C (4, `ExtrinsicFailed`) and a system transaction at finalization; their outcomes are success, partial, failure,
 * success. The remark's `ExtrinsicFailed` comes before B's outcome, so an outcome taken by its place among the events
 * goes wrong. [A93]
 */
export function a93Scenario(): Scenario {
  const { regular: [a, b, c], system: [s] } = ledgerTransactions(3, 1) as { regular: [Uint8Array, Uint8Array, Uint8Array]; system: [Uint8Array] };
  return scenario(
    1n,
    [
      { events: null },
      {
        extrinsics: [ledgerTransaction([...a]), remarkExtrinsic(), ledgerTransaction([...b]), ledgerTransaction([...c])],
        events: [
          E.success(0),
          E.txApplied(1, a),
          E.success(1),
          E.badOrigin(2),
          E.txPartial(3, b),
          E.success(3),
          E.moduleFailed(4, 5, 8),
          E.systemApplied("finalization", s),
        ],
      },
      { events: [E.success(0)] },
    ],
    [
      transaction(1n, 0, "regular", a, "success"),
      transaction(1n, 1, "regular", b, "partial"),
      transaction(1n, 2, "regular", c, "failure"),
      transaction(1n, 3, "system", s, "success"),
    ],
  );
}
