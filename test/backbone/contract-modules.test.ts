import { describe, expect, it, vi } from "vitest";
import {
  type ContractLog,
  contractLogsBlock,
  contractLogsItemOf,
  unresolvedLogSitesOf,
  writeLogRows,
  writeUnresolvedRows,
} from "../../src/backbone/contract-logs/contract-logs.js";
import { CONTRACT_LOGS_MIGRATIONS, LOG_EVENT_TYPES, UNRESOLVED_REASONS } from "../../src/backbone/contract-logs/sql.js";
import type { BlockTransaction } from "../../src/backbone/core-block-parsed/core-block-parsed.js";
import {
  CONTRACT_LOG_SITES_TASK,
  CORE_CONTRACT_LOGS_FAST_ID,
  fastLogsFrom,
  fastLogsOf,
} from "../../src/backbone/core-contract-logs-fast/core-contract-logs-fast.js";
import { mainThreadLogReader as inThreadLogReader } from "./main-thread-log-reader.js";
import { literalAt, type LogSite, logSitesOf } from "../../src/backbone/core-contract-logs-fast/transcripts.js";
import { fullLogsOf } from "../../src/backbone/core-contract-logs-full/core-contract-logs-full.js";
import { contractStatesOf, writeStateRows } from "../../src/backbone/core-contract-states/core-contract-states.js";
import { CONTRACT_STATES_MIGRATIONS } from "../../src/backbone/core-contract-states/sql.js";
import { loadLedgerPackage } from "../../src/ledger/load.js";
import type { ChainOutcome, LedgerPackage, VmLog } from "../../src/ledger/types.js";
import type { BlockContext } from "../../src/modules/declaration.js";
import type * as v9 from "../../vendor/ledger/v9/pkg/midnight_ledger_wasm_v9_fs.js";
import {
  block,
  callTransaction,
  cellValue,
  contractFixture,
  hex,
  logProgram,
  markersOf,
  NETWORK_ID,
  RAW,
  T0,
  utf8,
  VERIFIER_KEY,
  zswapOutputTransaction,
} from "../ledger/adapter-fixtures.js";
import { LOG_STATE, wrapper } from "./contract-data-checks.js";

/**
 * The contract-data modules, tested in parts.
 * - `core-contract-logs-fast`: its literal rule over a transcript's ops; its reading of a transaction's transcripts in
 *   the ledger's emission order, held to the vendored v9 package's own apply on a transaction of two intents; its rows
 *   and halts per outcome; its ledger task, on ledger v8, v9 and v9-rc3.
 * - `core-contract-logs-full`: its rows from `vm-logs`.
 * - `core-contract-states`: its rows from the `ledger-state` item's keys.
 * - The shared table's columns.
 *
 * The process tests are in `contract-data.test.ts`.
 */

const op = (name: string, args?: Record<string, unknown>): unknown => (args === undefined ? name : { [name]: args });
const push = (byte: number): unknown => ({ push: { storage: false, value: cellValue(Uint8Array.of(byte)) } });

describe("core-contract-logs-fast's literal rule (a literal pushed by the transcript on an unconditional path)", () => {
  it("takes the value of a push right before the log, and only when no branch or jump before them can skip either", () => {
    const cases: [string, unknown[], number, "literal" | "not-a-literal" | "conditional"][] = [
      ["push, log", [push(1), "log"], 1, "literal"],
      ["a storage push, log", [{ push: { storage: true, value: cellValue(Uint8Array.of(1)) } }, "log"], 1, "literal"],
      ["log first: a value of the initial stack (the state)", ["log"], 0, "not-a-literal"],
      ["dup 0, log: the state read", [op("dup", { n: 0 }), "log"], 1, "not-a-literal"],
      ["idx, log", [op("idx", { cached: false, pushPath: false, path: [] }), "log"], 1, "not-a-literal"],
      ["push, swap, log", [push(1), op("swap", { n: 0 }), "log"], 2, "not-a-literal"],
      ["a branch skipping the push", [push(1), op("branch", { skip: 1 }), push(2), "log"], 3, "conditional"],
      ["a branch skipping the log", [push(1), op("branch", { skip: 2 }), push(2), "log"], 3, "conditional"],
      ["a branch skipping past both", [push(1), op("branch", { skip: 5 }), push(2), "log", "pop", "pop"], 3, "conditional"],
      ["a jump landing on the log", [op("jmp", { skip: 1 }), push(2), "log"], 2, "conditional"],
      ["a branch ending before the push", [push(1), op("branch", { skip: 1 }), "pop", push(2), "log"], 4, "literal"],
      ["a branch of skip 0", [push(1), op("branch", { skip: 0 }), push(2), "log"], 3, "literal"],
      ["a jump ending before the push", [op("jmp", { skip: 2 }), "pop", "pop", push(2), "log"], 4, "literal"],
      ["a branch after the log", [push(2), "log", push(1), op("branch", { skip: 1 }), "pop"], 1, "literal"],
      ["ckpt, push, log", ["ckpt", push(3), "log"], 2, "literal"],
    ];
    for (const [name, program, at, expected] of cases) {
      const read = literalAt(program, at);
      expect(typeof read === "string" ? read : "literal", name).toBe(expected);
      if (expected === "literal") expect((read as { value: unknown }).value, name).toEqual((program[at - 1] as { push: { value: unknown } }).push.value);
    }
    expect(() => literalAt([push(1)], 0)).toThrow(/not a log/);
  });
});

const GAS = { readTime: 0n, computeTime: 2_000_000_000n, bytesWritten: 65_536n, bytesDeleted: 65_536n };
const EFFECTS = {
  claimedNullifiers: [],
  claimedShieldedReceives: [],
  claimedShieldedSpends: [],
  claimedContractCalls: [],
  shieldedMints: new Map(),
  unshieldedMints: new Map(),
  unshieldedInputs: new Map(),
  unshieldedOutputs: new Map(),
  claimedUnshieldedSpends: new Map(),
};

/** A call prototype of `emit` on `address` with those transcripts (`test/ledger/adapter-fixtures.ts`'s, less gas). */
function prototype(address: Uint8Array, guaranteed: v9.Op<v9.AlignedValue>[], fallible?: v9.Op<v9.AlignedValue>[]) {
  const raw = RAW.v9;
  const operation = new raw.ContractOperation();
  operation.verifierKey = VERIFIER_KEY;
  const transcript = (program: v9.Op<v9.AlignedValue>[]) => ({ gas: GAS, effects: EFFECTS, program });
  const empty = { value: [], alignment: [] };
  return new raw.ContractCallPrototype(
    hex(address),
    "emit",
    operation,
    transcript(guaranteed),
    fallible === undefined ? undefined : transcript(fallible),
    [],
    empty,
    empty,
    raw.communicationCommitmentRandomness(),
    "emit",
  );
}

/**
 * One proof-erased transaction of two intents (segment 2 set before segment 1), each calling a contract with a
 * guaranteed and a fallible transcript that log.
 */
function twoIntentCall(first: Uint8Array, second: Uint8Array): Uint8Array {
  const raw = RAW.v9;
  const ttl = new Date(T0 + 60_000);
  const one = raw.Intent.new(ttl).addCall(prototype(first, logProgram([cellValue(Uint8Array.of(1))]), ["ckpt", ...logProgram([cellValue(Uint8Array.of(3))])]));
  const two = raw.Intent.new(ttl).addCall(
    prototype(second, logProgram([wrapper(1, 5, cellValue(Uint8Array.of(2)))]), ["ckpt", ...logProgram([cellValue(Uint8Array.of(4)), cellValue(Uint8Array.of(5))])]),
  );
  const unproven = raw.Transaction.fromParts(NETWORK_ID, undefined, undefined, one);
  unproven.intents = new Map([
    [2, two],
    [1, unproven.intents!.get(1)!],
  ]);
  return unproven.eraseProofs().serialize();
}

/** `block-parsed`'s transaction `index` of `bytes` (the fields `-fast` reads). */
function parsedOf(adapter: LedgerPackage, bytes: Uint8Array, index: number, eventIndex: number | null = null): BlockTransaction {
  return { ...adapter.parseTransaction(bytes, index), phase: "apply-extrinsic", extrinsicIndex: index + 1, eventIndex };
}

/** The ledger's own logs as `contract-logs` rows. */
const asRows = (logs: readonly VmLog[]): ContractLog[] =>
  logs.map(({ physicalSegment: _physical, ...log }) => ({ ...log }));

describe("core-contract-logs-fast's reading of a transaction's transcripts", () => {
  it("reads every call's transcripts in the ledger's emission order — the guaranteed ones of each intent by segment, then the fallible ones — and its rows are the v9 package's own logs", async () => {
    const adapter = await loadLedgerPackage("v9", { networkId: NETWORK_ID });
    const [first, second] = [await contractFixture(RAW.v9), await contractFixture(RAW.v9)];
    const deployed = adapter.apply(adapter.emptyState(), block([first.deploy, second.deploy])).state;
    const single = callTransaction(RAW.v9, first, logProgram([cellValue(Uint8Array.of(7))]));
    const two = twoIntentCall(first.address, second.address);
    const input = block([single, two, zswapOutputTransaction(RAW.v9)], { height: 2n, timestampMs: BigInt(T0 + 6_000), parentTimestampMs: BigInt(T0) });
    const { output } = adapter.apply(deployed, input);
    expect(output.results.map((result) => result.outcome)).toEqual(["success", "success", "success"]);
    expect(output.logs.map((log) => [log.transaction, log.physicalSegment, hex(log.address)])).toEqual([
      [0, 1, hex(first.address)],
      [1, 1, hex(first.address)],
      [1, 2, hex(second.address)],
      [1, 1, hex(first.address)],
      [1, 2, hex(second.address)],
      [1, 2, hex(second.address)],
    ]);

    const transactions = input.transactions.map((bytes, index) => parsedOf(adapter, bytes, index));
    const sites = await inThreadLogReader().read("v9", transactions.map((t) => t.bytes));
    expect(sites[1]!.map((site) => [site.segment, site.fallible, site.call, site.op])).toEqual([
      [1, false, 0, 1],
      [2, false, 0, 1],
      [1, true, 0, 2],
      [2, true, 0, 2],
      [2, true, 0, 4],
    ]);
    expect(sites[2]).toEqual([]);
    const rows = fastLogsFrom(2n, transactions, ["success", "success", "success"], sites);
    expect(rows).toEqual({ logs: asRows(output.logs), unresolved: [] });
    for (const site of sites.flat()) expect(structuredClone(site)).toEqual(site);
  });

  it("reads nothing of a transaction without calls, gives a site of every log op, and marks an oversized literal as no log", async () => {
    const contract = await contractFixture(RAW.v9);
    const bytes = callTransaction(RAW.v9, contract, [push(1) as v9.Op<v9.AlignedValue>, "log", ...LOG_STATE, { push: { storage: false, value: cellValue(new Uint8Array(1_100).fill(1)) } }, "log"]);
    const [sites, none] = await inThreadLogReader().read("v9", [bytes, zswapOutputTransaction(RAW.v9)]);
    expect(none).toEqual([]);
    expect(sites!.map((site) => ("literal" in site.read ? (site.read.literal === null ? "none" : site.read.literal.eventType) : site.read.unsure))).toEqual([
      "Misc",
      "not-a-literal",
      "none",
    ]);
    expect(sites![0]).toMatchObject({ segment: 1, fallible: false, call: 0, op: 1, address: contract.address, entryPoint: utf8("emit") });
    // The package's own natives: logSitesOf on a transaction the test deserialized; the intent and the call its getters
    // gave freed at once, as the adapter frees them (no object the collector has not reached keeps a node).
    const native = RAW.v9.Transaction.deserialize(...markersOf(bytes), bytes);
    type Freeable = { free(): void };
    const freed = [
      vi.spyOn(RAW.v9.Intent.prototype as unknown as Freeable, "free"),
      vi.spyOn(RAW.v9.ContractCall.prototype as unknown as Freeable, "free"),
    ];
    try {
      expect(logSitesOf(native, { "@umbradb/vendored-ledger-v9": RAW.v9 }).map((site) => site.op)).toEqual([1, 3, 5]);
      expect(freed.map((spy) => spy.mock.calls.length)).toEqual([1, 1]);
    } finally {
      for (const spy of freed) spy.mockRestore();
    }
    expect(() => logSitesOf(native, {})).toThrow(/vendored-ledger-v9/);
    // A call after a deploy in one intent is that intent's action 1.
    const state = new RAW.v9.ContractState();
    state.data = new RAW.v9.ChargedState(RAW.v9.StateValue.newArray());
    const intent = RAW.v9.Intent.new(new Date(T0 + 60_000))
      .addDeploy(new RAW.v9.ContractDeploy(state))
      .addCall(prototype(contract.address, logProgram([cellValue(Uint8Array.of(2))])));
    const second = RAW.v9.Transaction.fromParts(NETWORK_ID, undefined, undefined, intent).eraseProofs().serialize();
    expect((await inThreadLogReader().read("v9", [second]))[0]!.map((s) => [s.segment, s.call, s.op])).toEqual([[1, 1, 1]]);
    // An entry point that is no UTF-8 text: the package gives its bytes, which the site keeps.
    const named = callTransaction(RAW.v9, contract, logProgram([cellValue(Uint8Array.of(1))]), undefined, T0 + 60_000, Uint8Array.of(0xff, 0xfe));
    const [sitesOfNamed] = await inThreadLogReader().read("v9", [named]);
    expect(sitesOfNamed?.[0]?.entryPoint).toEqual(Uint8Array.of(0xff, 0xfe));
  });

  it("in its ledger task, reads no ledger v8 transaction (v8 logs are no MIP-0002 events), a transaction without calls as none, and a runtime 2.0 block's with the rc.3 package, its rows that package's own logs as on v9", async () => {
    // v8: nothing read, not even the packages.
    const v8 = await CONTRACT_LOG_SITES_TASK.run({ height: 1n, hash: new Uint8Array(32), ledger: "v8", transactions: [{}, {}], packages: {} });
    expect(v8).toEqual([[], []]);
    for (const ledger of ["v9", "v9-rc3"] as const) {
      const adapter = await loadLedgerPackage(ledger, { networkId: NETWORK_ID });
      const raw = RAW[ledger];
      const contract = await contractFixture(raw);
      const deployed = adapter.apply(adapter.emptyState(), block([contract.deploy])).state;
      const call = callTransaction(raw, contract, logProgram([cellValue(Uint8Array.of(7)), wrapper(1, 5, cellValue(Uint8Array.of(2)))]));
      const input = block([call, zswapOutputTransaction(raw)], { height: 2n, timestampMs: BigInt(T0 + 6_000), parentTimestampMs: BigInt(T0) });
      const transactions = input.transactions.map((bytes, index) => parsedOf(adapter, bytes, index));
      const sites = (await CONTRACT_LOG_SITES_TASK.run({
        height: 2n,
        hash: input.hash,
        ledger,
        transactions: input.transactions.map((bytes) => adapter.nativeTransaction(bytes)),
        packages: adapter.rawPackages(),
      })) as readonly (readonly LogSite[])[];
      expect(sites[0]?.map((site) => [site.segment, site.fallible, site.call, site.op]), ledger).toEqual([
        [1, false, 0, 1],
        [1, false, 0, 3],
      ]);
      expect(sites[1], ledger).toEqual([]);
      const { output } = adapter.apply(deployed, input);
      expect(output.logs, ledger).toHaveLength(2);
      expect(fastLogsFrom(2n, transactions, ["success", "success"], sites), ledger).toEqual({ logs: asRows(output.logs), unresolved: [] });
    }
  });
});

const ADDRESS = new Uint8Array(32).fill(0xab);
const site = (rest: Partial<LogSite>, read: LogSite["read"]): LogSite => ({
  segment: 1,
  fallible: false,
  call: 0,
  op: 1,
  address: ADDRESS,
  entryPoint: utf8("emit"),
  read,
  ...rest,
});
const item = (byte: number) => ({ version: 1, eventType: "Misc" as const, data: Uint8Array.of(byte) });
const tx = (index: number): BlockTransaction => ({
  index,
  hash: new Uint8Array(32).fill(index + 1),
  kind: "regular",
  size: 10,
  bytes: Uint8Array.of(index),
  segments: [],
  phase: "apply-extrinsic",
  extrinsicIndex: index + 1,
  eventIndex: index,
});
/** A `block` item's logs and unresolved sites as `[transaction, index, data byte]` and `[transaction, index, reason, op]`. */
const shapeOf = ({ logs, unresolved }: ReturnType<typeof fastLogsFrom>) => ({
  logs: logs.map((row) => [row.transaction, row.index, row.data[0]]),
  unresolved: unresolved.map((u) => [u.transaction, u.index, u.reason, u.op]),
});

describe("core-contract-logs-fast's rows and unresolved sites per outcome", () => {
  it("stores a successful transaction's literal logs numbered in the block, skips oversized ones, and nothing of a failed transaction", () => {
    const sites = [
      [site({}, { literal: item(1) }), site({ op: 3 }, { literal: null }), site({ fallible: true, segment: 2 }, { literal: item(2) })],
      [site({}, { literal: item(3) }), site({}, { unsure: "not-a-literal" })],
      [site({}, { literal: item(4) })],
    ];
    const outcomes: ChainOutcome[] = ["success", "failure", "success"];
    const { logs: rows, unresolved } = fastLogsFrom(5n, [tx(0), tx(1), tx(2)], outcomes, sites);
    expect(rows.map((row) => [row.transaction, row.index, row.logicalSegment, row.data[0]])).toEqual([
      [0, 0, 0, 1],
      [0, 1, 0, 2],
      [2, 2, 0, 4],
    ]);
    expect(rows[0]).toEqual({ transaction: 0, index: 0, address: ADDRESS, entryPoint: utf8("emit"), logicalSegment: 0, ...item(1) });
    // The failed transaction's unsure site is no unresolved site: the ledger never ran it.
    expect(unresolved).toEqual([]);
  });

  it("records a site it cannot read exactly as unresolved, with its reason and place, and numbers it with the logs: one not a literal, one behind a branch", () => {
    const { logs, unresolved } = fastLogsFrom(
      7n,
      [tx(0), tx(1), tx(2)],
      ["success", "success", "success"],
      [
        [site({}, { literal: item(1) }), site({ op: 3, call: 2 }, { unsure: "not-a-literal" }), site({ op: 5 }, { literal: item(2) })],
        [site({ op: 4, segment: 3, fallible: true }, { unsure: "conditional" })],
        [site({}, { literal: item(3) })],
      ],
    );
    expect(shapeOf({ logs, unresolved })).toEqual({
      logs: [
        [0, 0, 1],
        [0, 2, 2],
        [2, 4, 3],
      ],
      unresolved: [
        [0, 1, "not-a-literal", 3],
        [1, 3, "conditional", 4],
      ],
    });
    expect(unresolved[0]).toEqual({
      transaction: 0, index: 1, address: ADDRESS, entryPoint: utf8("emit"), reason: "not-a-literal", segment: 1, fallible: false, call: 2, op: 3,
    });
    expect(unresolved[1]).toMatchObject({ segment: 3, fallible: true, call: 0 });
  });

  it("reads a partial success's guaranteed sites as a success's and records its fallible ones unresolved (partial-transaction); an oversized literal takes no number", () => {
    const { logs, unresolved } = fastLogsFrom(
      8n,
      [tx(0), tx(1)],
      ["partial", "success"],
      [
        [
          site({ op: 1 }, { literal: item(1) }),
          site({ op: 3 }, { unsure: "not-a-literal" }),
          site({ fallible: true, op: 2 }, { literal: item(2) }),
          site({ fallible: true, op: 4 }, { unsure: "conditional" }),
          site({ fallible: true, op: 6 }, { literal: null }),
        ],
        [site({}, { literal: item(3) })],
      ],
    );
    expect(shapeOf({ logs, unresolved })).toEqual({
      logs: [
        [0, 0, 1],
        [1, 4, 3],
      ],
      unresolved: [
        [0, 1, "not-a-literal", 3],
        [0, 2, "partial-transaction", 2],
        [0, 3, "partial-transaction", 4],
      ],
    });
    // A partial success without a log gives nothing.
    expect(fastLogsFrom(8n, [tx(0)], ["partial"], [[]])).toEqual({ logs: [], unresolved: [] });
  });

  it("refuses readings or outcomes that are not one per transaction", () => {
    expect(() => fastLogsFrom(7n, [tx(0)], ["success"], [])).toThrow(/1 transactions and 0 readings/);
    expect(() => fastLogsFrom(7n, [tx(0)], [], [[]])).toThrow(/0 outcomes for 1 transactions/);
  });

  it("negative control: numbering the logs alone, as before unresolved sites, moves a later log's index, which the numbering check names", () => {
    const sites = [[site({}, { unsure: "not-a-literal" }), site({ op: 3 }, { literal: item(1) })]];
    const real = fastLogsFrom(9n, [tx(0)], ["success"], sites);
    const logsAlone = { ...real, logs: real.logs.map((log, k) => ({ ...log, index: k })) };
    expect(real.logs.map((log) => log.index)).toEqual([1]);
    expect(logsAlone.logs.map((log) => log.index)).not.toEqual(real.logs.map((log) => log.index));
  });
});

describe("core-contract-logs-fast's reading of a block", () => {
  it("asks its reader for the transactions that call a contract only, and gives each its own sites; the outcomes are the chain events'", async () => {
    const calls = (n: number) => [{ segment: 1, calls: Array.from({ length: n }, () => ({ address: ADDRESS, entryPoint: utf8("emit") })), deploys: [] }];
    const parsed = (index: number, n: number): BlockTransaction => ({ ...tx(index), segments: n === 0 ? [] : calls(n) });
    const event = (index: number, name: string) => ({ index, pallet: "Midnight", name, fields: {} });
    const b = {
      height: 9n,
      items: new Map<string, unknown>([
        ["block-parsed", { ledger: "v9", transactions: [parsed(0, 0), parsed(1, 1), parsed(2, 0), parsed(3, 1)] }],
        ["chain-events", [event(0, "TxApplied"), event(1, "TxApplied"), event(2, "TxApplied"), event(3, "TxApplied")]],
      ]),
    } as unknown as BlockContext;
    const asked: Uint8Array[][] = [];
    const reader = {
      async read(_ledger: string, transactions: readonly Uint8Array[]) {
        asked.push([...transactions]);
        return transactions.map((bytes) => [site({}, { literal: item(bytes[0]! + 10) })]);
      },
    };
    const { logs: rows } = await fastLogsOf(b, { reader });
    expect(asked).toEqual([[Uint8Array.of(1), Uint8Array.of(3)]]);
    expect(rows.map((row) => [row.transaction, row.index, row.data[0]])).toEqual([
      [1, 0, 11],
      [3, 1, 13],
    ]);
    // A failed transaction's sites give no row: its outcome is the event's.
    const failed = { ...b, items: new Map(b.items).set("chain-events", [event(0, "TxApplied"), { index: 1, pallet: "System", name: "ExtrinsicFailed", fields: {} }, event(2, "TxApplied"), event(3, "TxApplied")]) } as BlockContext;
    expect((await fastLogsOf(failed, { reader })).logs.map((row) => row.transaction)).toEqual([3]);
    // The rule a negative control replaces is the one called, with the block's height, transactions, outcomes and sites.
    const seen: unknown[] = [];
    const rule = (...args: Parameters<typeof fastLogsFrom>) => (seen.push([args[0], args[1].length, args[2], args[3].length]), { logs: [], unresolved: [] });
    expect(await fastLogsOf(b, { reader, rule })).toEqual({ logs: [], unresolved: [] });
    expect(seen).toEqual([[9n, 4, ["success", "success", "success", "success"], 4]]);
    const short = { async read() { return []; } };
    await expect(fastLogsOf(b, { reader: short })).rejects.toThrow(/read 0 of 2 transactions/);
  });
});

describe("core-contract-logs-full's rows", () => {
  it("are the block's vm-logs as the ledger gave them, without the physical segment; a block without the item fails", () => {
    const log: VmLog = { transaction: 1, index: 0, address: ADDRESS, entryPoint: utf8("emit"), logicalSegment: 0, physicalSegment: 2, ...item(9) };
    const b = { height: 3n, items: new Map([["vm-logs", [log]]]) } as unknown as BlockContext;
    expect(fullLogsOf(b)).toEqual([{ transaction: 1, index: 0, address: ADDRESS, entryPoint: utf8("emit"), logicalSegment: 0, ...item(9) }]);
    expect(() => fullLogsOf({ height: 3n, items: new Map() } as unknown as BlockContext)).toThrow(/no vm-logs item/);
    expect(() => contractLogsItemOf({ height: 3n, items: new Map() } as unknown as BlockContext, CORE_CONTRACT_LOGS_FAST_ID)).toThrow(/no contract-logs item/);
  });
});

describe("core-contract-states' rows", () => {
  it("are the ledger-state item's keys, one per contract, a contract the state does not hold left out; keys of one kind only fail", () => {
    const keys = (address: number, state: number | null, zswap: number | null) => ({
      address: new Uint8Array(32).fill(address),
      stateKey: state === null ? null : new Uint8Array(32).fill(state),
      zswapStateKey: zswap === null ? null : new Uint8Array(32).fill(zswap),
    });
    const b = (contracts: unknown[]) => ({ height: 4n, items: new Map([["ledger-state", { contracts }]]) }) as unknown as BlockContext;
    expect(contractStatesOf(b([keys(1, 2, 3), keys(4, null, null), keys(5, 6, 7)])).map((row) => [row.address[0], row.stateKey[0], row.zswapStateKey[0]])).toEqual([
      [1, 2, 3],
      [5, 6, 7],
    ]);
    expect(() => contractStatesOf(b([keys(1, 2, null)]))).toThrow(/one of its keys/);
    expect(() => contractStatesOf({ height: 4n, items: new Map() } as unknown as BlockContext)).toThrow(/no ledger-state item/);
  });

  it("are written in one statement, none for no row, as are the logs", async () => {
    const statements: unknown[][] = [];
    const w = { execute: async (sql: string, params: unknown[]) => (statements.push([sql, params]), 1) };
    await writeStateRows(w, 4n, []);
    await writeLogRows(w, 4n, []);
    expect(statements).toEqual([]);
    await writeStateRows(w, 4n, [{ address: ADDRESS, stateKey: ADDRESS, zswapStateKey: ADDRESS }]);
    await writeLogRows(w, 4n, [{ transaction: 2, index: 0, address: ADDRESS, entryPoint: utf8("emit"), logicalSegment: 0, ...item(1) }]);
    expect(statements).toHaveLength(2);
    expect(statements[0]![1]).toEqual([4n, [ADDRESS], [ADDRESS], [ADDRESS]]);
    expect(statements[1]![1]).toEqual([4n, [2n], [0n], [ADDRESS], [utf8("emit")], [0], [1n], ["Misc"], [Uint8Array.of(1)]]);
    await writeUnresolvedRows(w, 4n, []);
    expect(statements).toHaveLength(2);
    await writeUnresolvedRows(w, 4n, [
      { transaction: 3, index: 1, address: ADDRESS, entryPoint: utf8("emit"), reason: "conditional", segment: 2, fallible: true, call: 1, op: 4 },
    ]);
    expect(statements).toHaveLength(3);
    expect(statements[2]![0]).toMatch(/^INSERT INTO contract_logs\.unresolved /);
    expect(statements[2]![1]).toEqual([4n, [3n], [1n], [ADDRESS], [utf8("emit")], ["conditional"], [2], [true], [1n], [4n]]);
  });
});

describe("the contract-logs block item", () => {
  const at = (item: unknown) => ({ height: 3n, items: new Map([["contract-logs", item]]) }) as unknown as BlockContext;
  const log: ContractLog = { transaction: 0, index: 1, address: ADDRESS, entryPoint: utf8("emit"), logicalSegment: 0, ...item(5) };
  const unresolvedSite = { transaction: 0, index: 0, address: ADDRESS, entryPoint: utf8("emit"), reason: "not-a-literal" as const, segment: 1, fallible: false, call: 0, op: 3 };

  it("holds a block's logs and its unresolved sites, frozen through; -full's has no unresolved sites", () => {
    const item = contractLogsBlock([log], [unresolvedSite]);
    expect(contractLogsItemOf(at(item), "reader")).toEqual([log]);
    expect(unresolvedLogSitesOf(at(item), "reader")).toEqual([unresolvedSite]);
    expect(Object.isFrozen(item) && Object.isFrozen(item.logs) && Object.isFrozen(item.logs[0]) && Object.isFrozen(item.unresolved[0])).toBe(true);
    expect(contractLogsBlock([log]).unresolved).toEqual([]);
  });

  it("a block without the item, or with a bare array of logs (the item before unresolved sites), fails naming the module", () => {
    expect(() => contractLogsItemOf(at(undefined), "reader")).toThrow(/no contract-logs item reader can read/);
    expect(() => unresolvedLogSitesOf(at(Object.freeze([log])), "reader")).toThrow(/no contract-logs item reader can read/);
    expect(() => contractLogsItemOf(at({ logs: [log] }), "reader")).toThrow(/no contract-logs item/);
  });
});

describe("the contract tables", () => {
  /** The columns the first migration's `CREATE TABLE` gives its table, in their order. */
  const created = (sql: string): string[] =>
    (/\(\n([\s\S]*?)\n\)/.exec(sql)?.[1] as string).split("\n").map((l) => /^\s*([a-z_]+) [a-z]/.exec(l)?.[1]).filter((c): c is string => c !== undefined && c !== "primary");

  it("contract_logs.logs, contract_logs.unresolved and core_contract_states.states have exactly their columns; the event types are the eleven, the reasons the three", () => {
    expect(CONTRACT_LOGS_MIGRATIONS.map((migration) => migration.id)).toEqual(["001", "002"]);
    expect(created(CONTRACT_LOGS_MIGRATIONS[0]!.sql)).toEqual([
      "height", "tx_index", "log_index", "contract_address", "entry_point", "logical_segment", "log_version", "event_type", "data",
    ]);
    expect(created(CONTRACT_LOGS_MIGRATIONS[1]!.sql)).toEqual([
      "height", "tx_index", "log_index", "contract_address", "entry_point", "reason", "segment", "fallible", "call_index", "op_index",
    ]);
    expect(UNRESOLVED_REASONS).toEqual(["not-a-literal", "conditional", "partial-transaction"]);
    expect(created(CONTRACT_STATES_MIGRATIONS[0]!.sql)).toEqual(["contract_address", "height", "state_key", "zswap_state_key"]);
    expect(LOG_EVENT_TYPES).toEqual([
      "ShieldedSpend", "ShieldedReceive", "ShieldedMint", "ShieldedBurn",
      "UnshieldedSpend", "UnshieldedReceive", "UnshieldedMint", "UnshieldedBurn",
      "Paused", "Unpaused", "Misc",
    ]);
  });
});
