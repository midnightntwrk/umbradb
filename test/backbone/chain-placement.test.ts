import { describe, expect, it } from "vitest";
import {
  type BlockParsed,
  blockParsedOf,
  type BlockTransaction,
  writeTransactionRows,
} from "../../src/backbone/core-block-parsed/core-block-parsed.js";
import { inThreadParser, PARSE_NETWORK_ID, type TransactionParser } from "../../src/backbone/core-block-parsed/parser.js";
import { type ChainTransaction, placeTransactions } from "../../src/backbone/core-block-parsed/placement.js";
import { decodeExtrinsics } from "../../src/backbone/core-block-fetch/extrinsics.js";
import type { BlockBody } from "../../src/backbone/core-block-fetch/items.js";
import { readRuntimeMetadata } from "../../src/backbone/core-block-fetch/metadata.js";
import { type ChainEvent, decodeChainEvents } from "../../src/backbone/core-chain-events/events.js";
import type { ScaleValue } from "../../src/backbone/core-chain-events/scale-value.js";
import { outcomeOf, txResultsOf, writeResultRows } from "../../src/backbone/core-tx-results/core-tx-results.js";
import { loadLedgerPackage } from "../../src/ledger/load.js";
import type { LedgerName, LedgerPackage, ParsedTransaction } from "../../src/ledger/types.js";
import type { BlockContext } from "../../src/modules/declaration.js";
import { RAW, systemTransaction, unprovenDeploy, zswapOutputTransaction } from "../ledger/adapter-fixtures.js";
import {
  ev,
  eventsValue,
  metadataV14,
  midnightMetadata,
  moduleError,
  record,
  Registry,
  remarkExtrinsic,
  signedExtrinsic,
  systemExtrinsic,
  V2_0,
  weightExtrinsic,
} from "./events-fixtures.js";
import { bareExtrinsic, compact, ledgerTransaction, timestampSet } from "./fetch-fixtures.js";

/**
 * Task 11.1's placement of a block's transactions (CD-5), their outcomes (CD-6) and their parse, without a process:
 * the official indexer's cases (`midnight-indexer` `chain-indexer/src/infra/subxt_node/runtimes.rs`'s tests — a failed
 * Midnight extrinsic keeps its place, a governance system transaction among user transactions, system transactions
 * under every phase, block 0 in body order, a top-level `MidnightSystem` extrinsic is no transaction), each of its
 * divergences refused here, and the parser's one parse per transaction. The process-level criteria (A91–A93) are
 * `chain-data.test.ts`'s.
 */

const METADATA = midnightMetadata(V2_0);
const VIEW = readRuntimeMetadata(METADATA);
const fill = (byte: number, length = 32): Uint8Array => new Uint8Array(length).fill(byte);
const tx = (byte: number): Uint8Array => fill(byte, 8);

/** A block's body and events, as the items give them. */
function block(height: bigint, extrinsics: readonly Uint8Array[], records: readonly (readonly number[])[] | null) {
  const body: BlockBody = { specVersion: 2_000_000, extrinsics: decodeExtrinsics(VIEW, extrinsics, height) };
  const events = decodeChainEvents(VIEW, records === null ? null : eventsValue(records), height);
  return { body, events };
}

/** The placement, summarized: kind, first byte of the bytes, phase and the event's name. */
function placed(height: bigint, extrinsics: readonly Uint8Array[], records: readonly (readonly number[])[] | null): string[] {
  const { body, events } = block(height, extrinsics, records);
  return placeTransactions(height, body, events, () => VIEW).map((t: ChainTransaction) => {
    const phase = t.phase === "apply-extrinsic" ? `${t.extrinsicIndex}` : t.phase;
    const event = t.eventIndex === null ? "-" : `${(events[t.eventIndex] as ChainEvent).pallet}.${(events[t.eventIndex] as ChainEvent).name}`;
    return `${t.index} ${t.kind === "regular" ? "R" : "S"}${t.bytes[0]} @${phase} ${event}`;
  });
}

const place = (height: bigint, extrinsics: readonly Uint8Array[], records: readonly (readonly number[])[] | null) => {
  const { body, events } = block(height, extrinsics, records);
  return () => placeTransactions(height, body, events, () => VIEW);
};

describe("placing a block's transactions (CD-5)", () => {
  it("numbers a system transaction between two regular ones 0, 1, 2 in the order of their events", () => {
    const extrinsics = [timestampSet(1n), ledgerTransaction([...tx(1)]), remarkExtrinsic(), ledgerTransaction([...tx(3)])];
    const records = [
      ev.success(0),
      ev.txApplied(1, fill(1)),
      ev.success(1),
      ev.systemApplied(2, fill(2), tx(2)),
      ev.success(2),
      ev.txApplied(3, fill(3)),
      ev.success(3),
    ];
    expect(placed(5n, extrinsics, records)).toEqual([
      "0 R1 @1 Midnight.TxApplied",
      "1 S2 @2 MidnightSystem.SystemTransactionApplied",
      "2 R3 @3 Midnight.TxApplied",
    ]);
    const all = place(5n, extrinsics, records)();
    expect(all.map((t) => [...t.bytes])).toEqual([[...tx(1)], [...tx(2)], [...tx(3)]]);
    expect(Object.isFrozen(all) && all.every((t) => Object.isFrozen(t))).toBe(true);
  });

  it("numbers block 0's transactions in body order, regular and system, with no events", () => {
    const extrinsics = [systemExtrinsic(tx(7)), ledgerTransaction([...tx(8)]), remarkExtrinsic(), ledgerTransaction([...tx(9)]), systemExtrinsic(tx(6))];
    expect(placed(0n, extrinsics, null)).toEqual(["0 S7 @0 -", "1 R8 @1 -", "2 R9 @3 -", "3 S6 @4 -"]);
    // Block 0's events, were there any, do not change its order (Substrate emits none at genesis).
    expect(placed(0n, extrinsics, [ev.txApplied(3, fill(9))])).toEqual(["0 S7 @0 -", "1 R8 @1 -", "2 R9 @3 -", "3 S6 @4 -"]);
  });

  it("keeps a failed Midnight extrinsic in its place, and a partial one, by their events' phases", () => {
    const extrinsics = [timestampSet(1n), ledgerTransaction([...tx(1)]), remarkExtrinsic(), ledgerTransaction([...tx(3)]), ledgerTransaction([...tx(4)])];
    const records = [
      ev.success(0),
      ev.txApplied(1, fill(1)),
      ev.success(1),
      ev.failed(2, [2]),
      ev.txPartial(3, fill(3)),
      ev.success(3),
      ev.failed(4, moduleError(5, [3, 0, 0, 0])),
    ];
    expect(placed(9n, extrinsics, records)).toEqual([
      "0 R1 @1 Midnight.TxApplied",
      "1 R3 @3 Midnight.TxPartialSuccess",
      "2 R4 @4 System.ExtrinsicFailed",
    ]);
  });

  it("keeps the phase the chain stamped on a system transaction: initialization, an extrinsic's, finalization", () => {
    const extrinsics = [timestampSet(1n), ledgerTransaction([...tx(3)])];
    const records = [
      ev.systemApplied("initialization", fill(1), tx(1)),
      ev.success(0),
      ev.systemApplied(1, fill(2), tx(2)),
      ev.txApplied(1, fill(3)),
      ev.success(1),
      ev.systemApplied(2, fill(4), tx(4)),
      ev.systemApplied("finalization", fill(5), tx(5)),
    ];
    expect(placed(7n, extrinsics, records)).toEqual([
      "0 S1 @initialization MidnightSystem.SystemTransactionApplied",
      "1 S2 @1 MidnightSystem.SystemTransactionApplied",
      "2 R3 @1 Midnight.TxApplied",
      "3 S4 @2 MidnightSystem.SystemTransactionApplied",
      "4 S5 @finalization MidnightSystem.SystemTransactionApplied",
    ]);
  });

  it("takes no transaction from a top-level MidnightSystem extrinsic, a CNightObservation hash event or another failure", () => {
    const extrinsics = [timestampSet(1n), systemExtrinsic(tx(9)), remarkExtrinsic()];
    const records = [ev.success(0), ev.failed(1, [2]), ev.cnightApplied(2, fill(8)), ev.failed(2, [1])];
    expect(placed(4n, extrinsics, records)).toEqual([]);
  });

  it("takes no transaction from Midnight's other call, set_tx_size_weight (Root only)", () => {
    const extrinsics = [timestampSet(1n), weightExtrinsic(), ledgerTransaction([...tx(2)])];
    expect(placed(4n, extrinsics, [ev.success(0), ev.failed(1, [2]), ev.txApplied(2, fill(2))])).toEqual(["0 R2 @2 Midnight.TxApplied"]);
    expect(placed(0n, extrinsics, null)).toEqual(["0 R2 @2 -"]);
  });

  it("matches outcomes to extrinsics by their phase, not by their place among the events", () => {
    // ExtrinsicFailed of the remark (2) comes before B's outcome: by order it would be B's, by phase it is nobody's.
    const extrinsics = [timestampSet(1n), ledgerTransaction([...tx(1)]), remarkExtrinsic(), ledgerTransaction([...tx(3)]), ledgerTransaction([...tx(4)])];
    const records = [ev.success(0), ev.txApplied(1, fill(1)), ev.success(1), ev.failed(2), ev.txPartial(3, fill(3)), ev.success(3), ev.failed(4)];
    const { body, events } = block(3n, extrinsics, records);
    const all = placeTransactions(3n, body, events, () => VIEW);
    expect(all.map((t) => [t.extrinsicIndex, t.eventIndex])).toEqual([[1, 1], [3, 4], [4, 6]]);
  });

  it("reads the metadata only when an extrinsic carries a transaction", () => {
    const { body, events } = block(4n, [timestampSet(1n), remarkExtrinsic()], [ev.success(0), ev.success(1)]);
    expect(placeTransactions(4n, body, events, () => {
      throw new Error("read");
    })).toEqual([]);
    const carried = block(4n, [ledgerTransaction([...tx(1)])], [ev.txApplied(0, fill(1))]);
    expect(() => placeTransactions(4n, carried.body, carried.events, () => {
      throw new Error("read");
    })).toThrow("read");
  });

  it("refuses a block whose events do not account for each Midnight transaction exactly once", () => {
    const one = [timestampSet(1n), ledgerTransaction([...tx(1)])];
    // A second outcome: applied twice, or applied and failed.
    expect(place(6n, one, [ev.success(0), ev.txApplied(1, fill(1)), ev.txApplied(1, fill(9)), ev.success(1)])).toThrow(
      /block 6: event 2, Midnight::TxApplied, is a second outcome of extrinsic 1's transaction, so its transactions cannot be placed \(CD-5\)/,
    );
    expect(place(6n, one, [ev.txApplied(1, fill(1)), ev.failed(1)])).toThrow(/event 1, System::ExtrinsicFailed, is a second outcome/);
    // Succeeded without TxApplied or TxPartialSuccess, or no event at all.
    expect(place(6n, one, [ev.success(0), ev.success(1)])).toThrow(
      /the Midnight transaction of extrinsic 1 has no TxApplied, TxPartialSuccess or ExtrinsicFailed event/,
    );
    expect(place(6n, [...one, ledgerTransaction([...tx(2)])], [ev.txApplied(1, fill(1))])).toThrow(/of extrinsic 2 has no TxApplied/);
    // An applied outcome under an extrinsic with no Midnight transaction, a signed one, or no extrinsic at all.
    expect(place(6n, [timestampSet(1n), remarkExtrinsic()], [ev.txApplied(1, fill(1))])).toThrow(
      /event 0, Midnight::TxApplied, is under extrinsic 1, which carries no Midnight transaction/,
    );
    expect(place(6n, [timestampSet(1n), signedExtrinsic()], [ev.txPartial(1, fill(1))])).toThrow(
      /event 0, Midnight::TxPartialSuccess, is under extrinsic 1, which is signed \(its call is not decoded; only governance calls may be signed\)/,
    );
    expect(place(6n, one, [ev.txApplied("initialization", fill(1)), ev.txApplied(1, fill(1))])).toThrow(/event 0, Midnight::TxApplied, is under initialization/);
    // A failure of a signed or a missing extrinsic is not a Midnight transaction's, and is no refusal.
    expect(placed(6n, [timestampSet(1n), signedExtrinsic()], [ev.success(0), ev.failed(1), ev.failed(7)])).toEqual([]);
  });

  it("refuses a Midnight call whose argument, or a system transaction event whose fields, are not the bytes they carry", () => {
    // send_mn_transaction with its Vec<u8> followed by a stray byte.
    const stray = bareExtrinsic(0x04, 5, 0, [...compact(2), 1, 2, 9]);
    expect(place(6n, [stray], [ev.txApplied(0, fill(1))])).toThrow(/send_mn_transaction call of extrinsic 0 of block 6 as SCALE at byte 3: 1 bytes are left/);
    // SystemTransactionApplied with a hash and no bytes, as CNightObservation's.
    const noBytes = record(0, 6, 0, [...fill(1)]);
    expect(() => {
      const events = decodeChainEvents(VIEW, eventsValue([noBytes]), 6n);
      return events;
    }).toThrow(/cannot read the events of block 6/);
    const fake: ChainEvent = Object.freeze({
      index: 0,
      phase: "apply-extrinsic",
      extrinsicIndex: 0,
      pallet: "MidnightSystem",
      palletIndex: 6,
      name: "SystemTransactionApplied",
      eventIndex: 0,
      fields: { hash: fill(1) },
      topics: [],
      bytes: new Uint8Array(0),
    });
    expect(() => placeTransactions(6n, { specVersion: 1, extrinsics: [] }, [fake], () => VIEW)).toThrow(
      /event 0, MidnightSystem::SystemTransactionApplied, has no serialized_system_transaction bytes/,
    );
  });
});

describe("each transaction's chain outcome (CD-6)", () => {
  const transaction = (index: number, eventIndex: number | null): BlockTransaction =>
    ({ index, eventIndex, phase: "apply-extrinsic", extrinsicIndex: 0, hash: fill(0), kind: "regular", size: 1, bytes: tx(0), segments: [] }) as BlockTransaction;

  it("gives TxApplied success, TxPartialSuccess partial, ExtrinsicFailed failure and SystemTransactionApplied success", () => {
    const { events } = block(2n, [], [ev.txApplied(1, fill(1)), ev.txPartial(2, fill(2)), ev.failed(3), ev.systemApplied(4, fill(4), tx(4))]);
    expect([0, 1, 2, 3].map((i) => outcomeOf(2n, transaction(i, i), events))).toEqual(["success", "partial", "failure", "success"]);
  });

  it("gives block 0's transactions success, and refuses an event that is missing or gives no outcome", () => {
    expect(outcomeOf(0n, transaction(0, null), [])).toBe("success");
    expect(() => outcomeOf(5n, transaction(0, null), [])).toThrow(/block 5: transaction 0 names no chain event, as only block 0's may/);
    const { events } = block(5n, [], [ev.success(0), ev.cnightApplied(1, fill(1))]);
    expect(() => outcomeOf(5n, transaction(0, 0), events)).toThrow(/names the chain event 0, System::ExtrinsicSuccess, which gives no outcome/);
    expect(() => outcomeOf(5n, transaction(0, 1), events)).toThrow(/CNightObservation::SystemTransactionApplied, which gives no outcome/);
    expect(() => outcomeOf(5n, transaction(0, 2), events)).toThrow(/names the chain event 2, which the block does not have/);
  });

  it("gives tx-results in block-parsed's order, as ApplyInput.outcomes takes them", () => {
    const { events } = block(2n, [], [ev.txPartial(3, fill(3)), ev.txApplied(1, fill(1))]);
    const parsed: BlockParsed = { ledger: "v9", transactions: [transaction(0, 1), transaction(1, 0)] };
    const context = { height: 2n, items: new Map<string, unknown>([["block-parsed", parsed], ["chain-events", events]]) } as unknown as BlockContext;
    const results = txResultsOf(context);
    expect(results).toEqual(["success", "partial"]);
    expect(Object.isFrozen(results)).toBe(true);
  });
});

describe("the parse (CD-5, LG-7)", () => {
  /** A loader that counts loads and wraps the real adapter's parse to count parses. */
  function counting(fail = 0) {
    const counts = { loads: 0, parses: 0 };
    let failures = fail;
    const load = async (ledger: LedgerName): Promise<LedgerPackage> => {
      counts.loads += 1;
      if (failures > 0) {
        failures -= 1;
        throw new Error("load failed");
      }
      const adapter = await loadLedgerPackage(ledger, { networkId: PARSE_NETWORK_ID });
      return {
        ...adapter,
        parseTransaction(bytes: Uint8Array, index: number): ParsedTransaction {
          counts.parses += 1;
          return adapter.parseTransaction(bytes, index);
        },
      };
    };
    return { counts, parser: inThreadParser(load) };
  }

  it("parses each transaction once, with its index, loading a ledger version's adapter once", async () => {
    const { counts, parser } = counting();
    const regular = zswapOutputTransaction(RAW.v9);
    const system = systemTransaction("v9");
    const first = await parser.parse("v9", [regular, system]);
    expect(first.map((t) => [t.index, t.kind, t.size])).toEqual([[0, "regular", regular.length], [1, "system", system.length]]);
    expect(first[0]?.bytes).toBe(regular);
    await parser.parse("v9", [unprovenDeploy(RAW.v9)]);
    expect(counts).toEqual({ loads: 1, parses: 3 });
    expect(await parser.parse("v9", [])).toEqual([]);
    expect(counts.loads).toBe(1);
  });

  it("loads nothing for a block without transactions, and loads again after a failed load", async () => {
    const { counts, parser } = counting(1);
    expect(await parser.parse("v8", [])).toEqual([]);
    expect(counts.loads).toBe(0);
    await expect(parser.parse("v9", [systemTransaction("v9")])).rejects.toThrow("load failed");
    expect((await parser.parse("v9", [systemTransaction("v9")]))[0]?.kind).toBe("system");
    expect(counts.loads).toBe(2);
  });

  it("refuses a transaction the chain names regular whose bytes the ledger reads as a system transaction", async () => {
    const system = systemTransaction("v9");
    const extrinsics = [timestampSet(1n), ledgerTransaction([...system])];
    const { body, events } = block(8n, extrinsics, [ev.success(0), ev.txApplied(1, fill(1)), ev.success(1)]);
    const context = {
      height: 8n,
      items: new Map<string, unknown>([
        ["block-body", body],
        ["chain-events", events],
        ["ledger-version", "v9"],
        ["runtime-metadata", { specVersion: 2_000_000, metadata: METADATA }],
      ]),
    } as unknown as BlockContext;
    await expect(blockParsedOf(context)).rejects.toThrow(
      /block 8: transaction 0 is a regular transaction on the chain, and the ledger v9 reads its bytes as a system one \(CD-5\)/,
    );
    const short: TransactionParser = { parse: async () => [] };
    await expect(blockParsedOf(context, { parser: short })).rejects.toThrow(/block 8: the parser gave 0 transactions for 1/);
  });
});

describe("the remaining refusals of placement, core-block-parsed and core-tx-results", () => {
  const context = (items: Record<string, unknown>, height = 8n) => ({ height, items: new Map(Object.entries(items)) }) as unknown as BlockContext;

  it("refuses a Midnight call of another shape than one Vec<u8>, or one the metadata does not have", () => {
    const t = new Registry();
    const u8 = t.primitive("u8");
    const u32 = t.primitive("u32");
    const bytes = t.sequence(u8);
    const two = t.variant(["pallet_midnight", "pallet", "Call"], [{ name: "send_mn_transaction", index: 0, fields: [["a", bytes], ["b", bytes]] }]);
    const word = t.variant(["pallet_midnight_system", "pallet", "Call"], [{ name: "send_mn_system_transaction", index: 0, fields: [["n", u32]] }]);
    const view = readRuntimeMetadata(metadataV14(t, [{ name: "Midnight", index: 5, calls: two }, { name: "MidnightSystem", index: 6, calls: word }], u8, u8));
    const body = (extrinsic: Uint8Array): BlockBody => ({ specVersion: 1, extrinsics: decodeExtrinsics(view, [extrinsic], 0n) });
    expect(() => placeTransactions(0n, body(bareExtrinsic(0x04, 5, 0, [...compact(0), ...compact(0)])), [], () => view)).toThrow(
      /the Midnight::send_mn_transaction call of extrinsic 0 of block 0 has 2 arguments, not one Vec<u8>/,
    );
    expect(() => placeTransactions(0n, body(bareExtrinsic(0x04, 6, 0, [1, 0, 0, 0])), [], () => view)).toThrow(/call of extrinsic 0 of block 0's argument is not a Vec<u8>/);
    // The body named with one metadata, the arguments read with another that lacks the call.
    const named = { specVersion: 1, extrinsics: decodeExtrinsics(VIEW, [ledgerTransaction([1])], 0n) };
    const other = t.variant(["pallet_midnight", "pallet", "Call"], [{ name: "set_tx_size_weight", index: 1, fields: [["w", u32]] }]);
    const lacking = readRuntimeMetadata(metadataV14(t, [{ name: "Midnight", index: 5, calls: other }], u8, u8));
    expect(() => placeTransactions(0n, named, [], () => lacking)).toThrow(/the runtime metadata has no call 0 of the pallet 5/);
    const noCalls = readRuntimeMetadata(metadataV14(t, [{ name: "Midnight", index: 5 }], u8, u8));
    expect(() => placeTransactions(0n, named, [], () => noCalls)).toThrow(/the runtime metadata has no call 0 of the pallet 5/);
  });

  it("refuses a SystemTransactionApplied whose fields are no record, and names every Midnight extrinsic without an outcome", () => {
    const fake = (fields: ScaleValue): ChainEvent =>
      Object.freeze({ index: 0, phase: "finalization", extrinsicIndex: null, pallet: "MidnightSystem", palletIndex: 6, name: "SystemTransactionApplied", eventIndex: 0, fields, topics: [], bytes: new Uint8Array(0) });
    expect(() => placeTransactions(3n, { specVersion: 1, extrinsics: [] }, [fake("x")], () => VIEW)).toThrow(/has no serialized_system_transaction bytes/);
    expect(() => placeTransactions(3n, { specVersion: 1, extrinsics: [] }, [fake({ serialized_system_transaction: "0x00" })], () => VIEW)).toThrow(
      /has no serialized_system_transaction bytes/,
    );
    const three = [timestampSet(1n), ledgerTransaction([...tx(3)]), ledgerTransaction([...tx(2)]), ledgerTransaction([...tx(1)])];
    expect(place(3n, three, [ev.success(0), ev.txApplied(2, fill(2))])).toThrow(/the Midnight transaction of extrinsic 1, 3 has no TxApplied/);
  });

  it("refuses a block without block-body, block-parsed or tx-results to read, and a system transaction the ledger reads as regular", async () => {
    await expect(blockParsedOf(context({}))).rejects.toThrow(/the block at height 8 has no block-body item core-block-parsed can read/);
    const w = { execute: async () => 1 };
    await expect(writeTransactionRows(w, context({}))).rejects.toThrow(/has no block-parsed item core-tx-results|has no block-parsed item core-block-parsed can read/);
    expect(() => txResultsOf(context({ "chain-events": [] }))).toThrow(/has no block-parsed item core-tx-results can read/);
    await expect(writeResultRows(w, context({}))).rejects.toThrow(/the block at height 8 has no tx-results item core-tx-results can write/);
    const regular = zswapOutputTransaction(RAW.v9);
    const { events } = block(8n, [], [ev.systemApplied(0, fill(1), regular)]);
    const items = {
      "block-body": { specVersion: 2_000_000, extrinsics: [] },
      "chain-events": events,
      "ledger-version": "v9",
      "runtime-metadata": { specVersion: 2_000_000, metadata: METADATA },
    };
    await expect(blockParsedOf(context(items))).rejects.toThrow(
      /block 8: transaction 0 is a system transaction on the chain, and the ledger v9 reads its bytes as a regular one \(CD-5\)/,
    );
  });
});
