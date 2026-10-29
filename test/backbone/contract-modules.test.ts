import { readFileSync } from "node:fs";
import { describe, expect, it, vi } from "vitest";
import {
  CONTRACT_LOGS_MIGRATIONS,
  type ContractLog,
  contractLogsItemOf,
  LOG_EVENT_TYPES,
  writeLogRows,
} from "../../src/backbone/contract-logs/contract-logs.js";
import type { BlockTransaction } from "../../src/backbone/core-block-parsed/core-block-parsed.js";
import {
  CONTRACT_LOG_SITES_TASK,
  CORE_CONTRACT_LOGS_FAST_ID,
  fastLogsFrom,
  fastLogsOf,
  type UnsureLog,
} from "../../src/backbone/core-contract-logs-fast/core-contract-logs-fast.js";
import { mainThreadLogReader as inThreadLogReader } from "./main-thread-log-reader.js";
import { literalAt, type LogSite, logSitesOf } from "../../src/backbone/core-contract-logs-fast/transcripts.js";
import { fullLogsOf } from "../../src/backbone/core-contract-logs-full/core-contract-logs-full.js";
import {
  CONTRACT_STATES_MIGRATIONS,
  contractStatesOf,
  writeStateRows,
} from "../../src/backbone/core-contract-states/core-contract-states.js";
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
 * The contract-data modules, tested in parts. [CC-1, CC-2, CC-3; design §10]
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

describe("core-contract-logs-fast's literal rule (CC-3: a literal pushed by the transcript on an unconditional path)", () => {
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

describe("core-contract-logs-fast's reading of a transaction's transcripts (CC-3)", () => {
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
    const rows = fastLogsFrom(2n, transactions, ["success", "success", "success"], sites, unsureThrows);
    expect(rows).toEqual(asRows(output.logs));
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

  it("in its ledger task (task 12.6), reads no ledger v8 transaction (Q54: v8 logs are no MIP-0002 events), a transaction without calls as none, and a runtime 2.0 block's with the rc.3 package, its rows that package's own logs as on v9", async () => {
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
      expect(fastLogsFrom(2n, transactions, ["success", "success"], sites, unsureThrows), ledger).toEqual(asRows(output.logs));
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
const unsureThrows = (unsure: UnsureLog): never => {
  throw new Error(`unsure ${unsure.reason}`);
};

describe("core-contract-logs-fast's rows and halts per outcome (CC-3)", () => {
  it("stores a successful transaction's literal logs numbered in the block, skips oversized ones, and nothing of a failed transaction", () => {
    const sites = [
      [site({}, { literal: item(1) }), site({ op: 3 }, { literal: null }), site({ fallible: true, segment: 2 }, { literal: item(2) })],
      [site({}, { literal: item(3) }), site({}, { unsure: "not-a-literal" })],
      [site({}, { literal: item(4) })],
    ];
    const outcomes: ChainOutcome[] = ["success", "failure", "success"];
    const rows = fastLogsFrom(5n, [tx(0), tx(1), tx(2)], outcomes, sites, unsureThrows);
    expect(rows.map((row) => [row.transaction, row.index, row.logicalSegment, row.data[0]])).toEqual([
      [0, 0, 0, 1],
      [0, 1, 0, 2],
      [2, 2, 0, 4],
    ]);
    expect(rows[0]).toEqual({ transaction: 0, index: 0, address: ADDRESS, entryPoint: utf8("emit"), logicalSegment: 0, ...item(1) });
  });

  it("halts on a log it cannot read exactly: one not a literal, one behind a branch, and any log of a partial success; a partial success with no log halts nothing", () => {
    const seen: UnsureLog[] = [];
    const record = (unsure: UnsureLog): void => {
      seen.push(unsure);
    };
    const rows = fastLogsFrom(
      7n,
      [tx(0), tx(1), tx(2), tx(3)],
      ["success", "success", "partial", "partial"],
      [[site({}, { unsure: "not-a-literal" })], [site({ op: 4 }, { unsure: "conditional" })], [site({}, { literal: item(1) })], []],
      record,
    );
    expect(rows).toEqual([]);
    expect(seen.map((u) => [u.height, u.transaction.index, u.reason, u.site.op])).toEqual([
      [7n, 0, "not-a-literal", 1],
      [7n, 1, "conditional", 4],
      [7n, 2, "partial-transaction", 1],
    ]);
    expect(() => fastLogsFrom(7n, [tx(0)], ["partial"], [[site({}, { literal: item(1) })]], unsureThrows)).toThrow(/unsure partial-transaction/);
    expect(() => fastLogsFrom(7n, [tx(0)], ["success"], [], unsureThrows)).toThrow(/1 transactions and 0 readings/);
    expect(() => fastLogsFrom(7n, [tx(0)], [], [[]], unsureThrows)).toThrow(/0 outcomes for 1 transactions/);
  });
});

describe("core-contract-logs-fast's reading of a block (CC-3)", () => {
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
    const rows = await fastLogsOf(b, { reader });
    expect(asked).toEqual([[Uint8Array.of(1), Uint8Array.of(3)]]);
    expect(rows.map((row) => [row.transaction, row.index, row.data[0]])).toEqual([
      [1, 0, 11],
      [3, 1, 13],
    ]);
    // A failed transaction's sites give no row: its outcome is the event's.
    const failed = { ...b, items: new Map(b.items).set("chain-events", [event(0, "TxApplied"), { index: 1, pallet: "System", name: "ExtrinsicFailed", fields: {} }, event(2, "TxApplied"), event(3, "TxApplied")]) } as BlockContext;
    expect((await fastLogsOf(failed, { reader })).map((row) => row.transaction)).toEqual([3]);
    const short = { async read() { return []; } };
    await expect(fastLogsOf(b, { reader: short })).rejects.toThrow(/read 0 of 2 transactions/);
  });
});

describe("core-contract-logs-full's rows (CC-2)", () => {
  it("are the block's vm-logs as the ledger gave them, without the physical segment; a block without the item fails", () => {
    const log: VmLog = { transaction: 1, index: 0, address: ADDRESS, entryPoint: utf8("emit"), logicalSegment: 0, physicalSegment: 2, ...item(9) };
    const b = { height: 3n, items: new Map([["vm-logs", [log]]]) } as unknown as BlockContext;
    expect(fullLogsOf(b)).toEqual([{ transaction: 1, index: 0, address: ADDRESS, entryPoint: utf8("emit"), logicalSegment: 0, ...item(9) }]);
    expect(() => fullLogsOf({ height: 3n, items: new Map() } as unknown as BlockContext)).toThrow(/no vm-logs item/);
    expect(() => contractLogsItemOf({ height: 3n, items: new Map() } as unknown as BlockContext, CORE_CONTRACT_LOGS_FAST_ID)).toThrow(/no contract-logs item/);
  });
});

describe("core-contract-states' rows (CC-1)", () => {
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
  });
});

describe("the tables of design §10 (CC-1, CC-2)", () => {
  /** The columns the design gives `table`'s row (the key's, then the others'). [design §10] */
  function designColumns(table: string): string[] {
    const design = readFileSync(new URL("../../openspec/changes/core-arch/design.md", import.meta.url), "utf8");
    const line = design.split("\n").find((l) => l.includes(`| \`${table}\` |`)) as string;
    const cells = line.split("|").map((cell) => cell.trim());
    const key = (cells[3] as string).replace(/[()]/g, "").split(",").map((c) => c.trim());
    const others = (cells[4] as string).split(" — ")[0]!.split(/,(?![^(]*\))/).map((c) => /^\s*([a-z_]+)/.exec(c)?.[1] as string);
    return [...key, ...others];
  }
  const created = (sql: string): string[] =>
    (/\(\n([\s\S]*?)\n\)/.exec(sql)?.[1] as string).split("\n").map((l) => /^\s*([a-z_]+) [a-z]/.exec(l)?.[1]).filter((c): c is string => c !== undefined && c !== "primary");

  it("contract_logs.logs and core_contract_states.states have exactly design §10's columns, the event types the spec's", () => {
    expect(new Set(created(CONTRACT_LOGS_MIGRATIONS[0]!.sql))).toEqual(new Set(designColumns("contract_logs.logs")));
    expect(new Set(created(CONTRACT_STATES_MIGRATIONS[0]!.sql))).toEqual(new Set(designColumns("core_contract_states.states")));
    const spec = readFileSync(new URL("../../openspec/changes/core-arch/specs/contract-data/spec.md", import.meta.url), "utf8");
    for (const type of LOG_EVENT_TYPES) expect(spec).toContain(`\`${type}\``);
    expect(LOG_EVENT_TYPES).toHaveLength(11);
  });
});
