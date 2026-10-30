import { afterAll, describe, expect, it } from "vitest";
import { CORE_LEDGER_TASK_MODULES } from "../../src/backbone/ledger-tasks.js";
import { loadLedgerPackage } from "../../src/ledger/load.js";
import { bindLedgerTasks, hasLedgerTasks, withLedgerTaskPoints, withLedgerTasks } from "../../src/ledger/tasks.js";
import type { LedgerPackage, LedgerTask } from "../../src/ledger/types.js";
import { type ApplyBlock, type BlockId, isEvictionRefused, LEDGER_TASK_FAILED, LedgerEngine, ledgerTasksOf, type TaskRun } from "../../src/ledger/worker/engine.js";
import { inThreadLedger, type LedgerHost, LedgerWorkerFailure, startLedgerWorker, typeScriptEntry } from "../../src/ledger/worker/host.js";
import { runLedgerWorker } from "../../src/ledger/worker/run.js";
import type { BlockContext, ItemSink, ModuleDeclaration, ProcessContext } from "../../src/modules/declaration.js";
import { callTransaction, cellValue, contractFixture, hex, NETWORK_ID, RAW, T0, zswapOutputTransaction } from "./adapter-fixtures.js";
import type { TestLoaderData } from "./fixtures/ledger-test-loader.js";
import { CALL_ARGS_TASK, type CallArgsItem, callArgsModule, FAULT_AT, NATIVE_LEAK_TASK, STATE_BEFORE_TASK, THROWING_TASK } from "./fixtures/task-modules.js";

// Ledger tasks: a module's functions the ledger worker runs for each block, with the native parsed objects of the
// block's one parse, `rawPackages()` and, when declared, the state before the block. They are tested:
// - in the engine (`LedgerEngine.tasks`);
// - in a worker thread started from UmbraDB's entry (the host's modules named by `modules`) or from a host's own
//   (`runLedgerWorker`);
// - on the main thread (`withLedgerTasks`: the points that run them and put their results as the module's items).
// [LG-7, LG-17, Q49; design §5.5]

const LONG = 240_000;
const LOADER = new URL("./fixtures/ledger-test-loader.ts", import.meta.url);
const TASK_MODULES = new URL("./fixtures/task-modules.ts", import.meta.url);
const TASK_ENTRY = new URL("./fixtures/task-worker-entry.ts", import.meta.url);
const hash = (byte: number): Uint8Array => new Uint8Array(32).fill(byte);
const at = (height: bigint): BlockId => ({ height, hash: hash(Number(height) + 1) });
const hosts: LedgerHost[] = [];
afterAll(async () => {
  await Promise.all(hosts.map((host) => host.close()));
});

const genesisInput = () => ({
  ledger: "v9" as const,
  ...at(0n),
  parentHash: new Uint8Array(32),
  timestampMs: BigInt(T0),
  transactions: 0,
  genesisState: RAW.v9.LedgerState.blank(NETWORK_ID).serialize(),
  includesBlockZero: true,
});

function applyBlock(height: bigint, transactions: number): ApplyBlock {
  return {
    ledger: "v9",
    ...at(height),
    parentHash: at(height - 1n).hash,
    timestampMs: BigInt(T0) + height * 6_000n,
    parentTimestampMs: BigInt(T0) + (height - 1n) * 6_000n,
    firstRegularAtParentTime: false,
    transactions,
  };
}

const run = (height: bigint, transactions: number, module: string, tasks: readonly string[]): TaskRun => ({
  ...at(height),
  parentHash: at(height - 1n).hash,
  ledger: "v9",
  transactions,
  module,
  tasks,
});

const TEST_MODULES = [
  { id: "call-args", ledgerTasks: [CALL_ARGS_TASK] },
  { id: "state-before", ledgerTasks: [STATE_BEFORE_TASK] },
  { id: "native-leak", ledgerTasks: [NATIVE_LEAK_TASK] },
  { id: "task-throws", ledgerTasks: [THROWING_TASK] },
];

/** A block 1 calling a fixture contract twice (pushing 1, then 2 and 3) and making a zswap output, with block 0 before. */
async function calling() {
  const contract = await contractFixture(RAW.v9);
  const push = (...bytes: number[]) => bytes.flatMap((byte) => [{ push: { storage: false, value: cellValue(Uint8Array.of(byte)) } }, "pop" as const]);
  const transactions = [
    contract.deploy,
    callTransaction(RAW.v9, contract, push(1) as never, undefined, T0 + 60_000),
    zswapOutputTransaction(RAW.v9),
    callTransaction(RAW.v9, contract, push(2, 3) as never, undefined, T0 + 60_000),
  ];
  const serialized = (byte: number) => {
    const value = RAW.v9.StateValue.decode(cellValue(Uint8Array.of(byte)));
    try {
      return hex(RAW.v9.serializeStateValue(value));
    } finally {
      (value as unknown as { free(): void }).free();
    }
  };
  const expected: CallArgsItem = {
    calls: [
      { transaction: 1, segment: 1, address: hex(contract.address), entryPoint: "emit", pushes: [serialized(1)] },
      { transaction: 3, segment: 1, address: hex(contract.address), entryPoint: "emit", pushes: [serialized(2), serialized(3)] },
    ],
    stateGiven: false,
  };
  return { transactions, expected };
}

describe("ledger tasks in the engine (task 12.6; LG-17)", () => {
  it("runs a module's tasks on the block's one parse — its native objects, rawPackages(), the state before the block when declared — and gives plain data", { timeout: LONG }, async () => {
    const engine = new LedgerEngine({ load: loadLedgerPackage, tasks: ledgerTasksOf(TEST_MODULES) });
    const zero = await engine.genesis(genesisInput());
    engine.commit(at(0n));
    const { transactions, expected } = await calling();
    // This thread's package counts its transactions' deserializations from here on.
    const deserialized: string[] = [];
    const originals = { regular: RAW.v9.Transaction.deserialize, system: RAW.v9.SystemTransaction.deserialize };
    RAW.v9.Transaction.deserialize = ((...args: Parameters<typeof originals.regular>) => {
      deserialized.push(hex(args.at(-1) as Uint8Array));
      return originals.regular(...args);
    }) as typeof originals.regular;
    try {
      await engine.parse("v9", at(1n), transactions);
      expect(await engine.tasks(run(1n, 4, "call-args", ["call-arguments"]))).toEqual({ "call-arguments": expected });
      // The state before the block: the committed one, at h − 1.
      const before = (await engine.tasks(run(1n, 4, "state-before", ["root-before"])))["root-before"] as { root: Uint8Array };
      expect(hex(before.root)).toBe(hex(zero.stateRoot));
      // After the apply, before the commit, still the state at h − 1; after the commit, refused for block 1.
      await engine.apply(applyBlock(1n, 4));
      expect(hex(((await engine.tasks(run(1n, 4, "state-before", ["root-before"])))["root-before"] as { root: Uint8Array }).root)).toBe(hex(zero.stateRoot));
      engine.commit(at(1n));
      await expect(engine.tasks(run(1n, 4, "state-before", ["root-before"]))).rejects.toThrow(/needs the state before the block, and the ledger worker holds the state at 1/);
      // Block 0 has no state before it: a task that declares needsState gets none there.
      const fresh = new LedgerEngine({ load: loadLedgerPackage, tasks: ledgerTasksOf(TEST_MODULES) });
      expect(await fresh.tasks({ ...run(0n, 0, "state-before", ["root-before"]), parentHash: new Uint8Array(32) })).toEqual({ "root-before": { height: 0n, root: null } });
      // One parse per transaction, the tasks' and the apply's included.
      expect(deserialized.sort()).toEqual(transactions.map(hex).sort());
    } finally {
      RAW.v9.Transaction.deserialize = originals.regular;
    }
  });

  it("fails a task that throws, returns a ledger package's object, or that the worker's entry does not give, naming the module and the task", { timeout: LONG }, async () => {
    const engine = new LedgerEngine({ load: loadLedgerPackage, tasks: ledgerTasksOf(TEST_MODULES) });
    await engine.parse("v9", at(FAULT_AT), [zswapOutputTransaction(RAW.v9)]);
    const failed = async (input: TaskRun): Promise<Error> => (await engine.tasks(input).catch((error: unknown) => error)) as Error;
    const leaked = await failed(run(FAULT_AT, 1, "native-leak", ["leaked-object"]));
    expect(leaked.name).toBe(LEDGER_TASK_FAILED);
    expect(leaked.message).toBe(
      "the ledger task leaked-object of native-leak at block 3 returned an object of the class LedgerState at $.state: a task " +
        "returns structured-cloneable plain data, never a ledger package's object",
    );
    const thrown = await failed(run(FAULT_AT, 1, "task-throws", ["thrown-result"]));
    expect(thrown.message).toBe("the ledger task thrown-result of task-throws at block 3 threw: the throwing task gives up at 3");
    expect((await failed(run(FAULT_AT, 1, "unknown-module", ["x"]))).message).toMatch(/^the ledger task x of unknown-module at block 3 is not one the ledger worker has/);
    expect((await failed(run(FAULT_AT, 1, "call-args", ["other"]))).name).toBe(LEDGER_TASK_FAILED);
    // A block whose parse the worker does not keep, or of another size, is refused before any task runs.
    await expect(engine.tasks(run(4n, 1, "call-args", ["call-arguments"]))).rejects.toThrow(/parsed 0 transactions of it/);
    await expect(engine.tasks(run(FAULT_AT, 2, "call-args", ["call-arguments"]))).rejects.toThrow(/parsed 1 transactions of it/);
    expect(isEvictionRefused(leaked)).toBe(false);
    // A trap is thrown as it is: the worker ends.
    const trap: LedgerTask = { name: "trap", needsState: false, run: () => { throw new WebAssembly.RuntimeError("unreachable"); } };
    const trapping = new LedgerEngine({ load: loadLedgerPackage, tasks: ledgerTasksOf([{ id: "traps", ledgerTasks: [trap] }]) });
    await expect(trapping.tasks(run(FAULT_AT, 0, "traps", ["trap"]))).rejects.toBeInstanceOf(WebAssembly.RuntimeError);
    // The check off (a negative control's engine): the package's object leaves.
    const unchecked = new LedgerEngine({ load: loadLedgerPackage, tasks: ledgerTasksOf(TEST_MODULES), checkPlainData: false });
    await unchecked.parse("v9", at(FAULT_AT), []);
    const leak = (await unchecked.tasks(run(FAULT_AT, 0, "native-leak", ["leaked-object"])))["leaked-object"] as { state: { free(): void } };
    expect(leak.state).toBeInstanceOf(RAW.v9.LedgerState);
    leak.state.free();
  });

  it("checks a block's parse as plain data before it leaves (LG-7)", async () => {
    const native = new LedgerEngine({
      load: async () => ({ ledger: "v9", parseTransaction: () => ({ index: 0, hash: new Uint8Array(32), kind: "regular", size: 1, bytes: Uint8Array.of(1), segments: [{ segment: 1, calls: [{ address: new Date(0) }], deploys: [] }] }) }) as unknown as LedgerPackage,
    });
    await expect(native.parse("v9", at(1n), [Uint8Array.of(1)])).rejects.toThrow(
      "the v9 adapter parsed block 1 into an object of the class Date at $[0].segments[0].calls[0].address, not plain data",
    );
  });
});

describe("ledger tasks in a worker thread (task 12.6; LG-17, MD-1)", () => {
  it("runs the tasks of the modules UmbraDB's entry imports from `modules`, its core modules' too, with each transaction parsed once in the thread", { timeout: LONG }, async () => {
    const host = startLedgerWorker({ loader: LOADER, loaderData: { count: true } satisfies TestLoaderData, modules: TASK_MODULES });
    hosts.push(host);
    await host.genesis(genesisInput());
    await host.commit(at(0n));
    const { transactions, expected } = await calling();
    await host.parse("v9", at(1n), transactions);
    expect(await host.tasks(run(1n, 4, "call-args", ["call-arguments"]))).toEqual({ "call-arguments": expected });
    // UmbraDB's core module's task: -fast's log sites (its calls pop what they push: no log).
    expect(await host.tasks(run(1n, 4, "core-contract-logs-fast", ["contract-log-sites"]))).toEqual({ "contract-log-sites": [[], [], [], []] });
    // Its failure crosses as plain data, its name kept; no trap, so the worker goes on.
    await host.parse("v9", at(FAULT_AT), []);
    await expect(host.tasks(run(FAULT_AT, 0, "native-leak", ["leaked-object"]))).rejects.toMatchObject({ name: LEDGER_TASK_FAILED });
    expect(host.failure).toBeNull();
    const { deserialized } = (await host.probe()) as { deserialized: Uint8Array[] };
    expect(deserialized.map(hex).sort()).toEqual(transactions.map(hex).sort());
  });

  it("runs a task's request in flight at a restart (Q144 B) again on the new thread, on the parse sent again; one that needs the state fails there", { timeout: LONG }, async () => {
    const host = startLedgerWorker({ loader: LOADER, loaderData: { count: true } satisfies TestLoaderData, modules: TASK_MODULES });
    hosts.push(host);
    const { transactions, expected } = await calling();
    await host.parse("v9", at(1n), transactions);
    // Both still in flight when the thread is restarted (their answers need this thread's event loop).
    const stateless = host.tasks(run(1n, 4, "call-args", ["call-arguments"]));
    const stateful = host.tasks(run(1n, 4, "state-before", ["root-before"])).then(
      () => null,
      (error: unknown) => error,
    );
    const probing = host.probe().then(
      () => null,
      (error: unknown) => error,
    );
    await host.restart();
    expect(await stateless).toEqual({ "call-arguments": expected });
    expect(await stateful).toMatchObject({ name: LEDGER_TASK_FAILED, message: expect.stringMatching(/needs the state before the block, and the ledger worker holds no state/) });
    expect(String(await probing)).toMatch(/restarted while its probe request ran/);
    // The new thread parsed the block once (its kept parse sent again); the task parsed nothing.
    const { deserialized } = (await host.probe()) as { deserialized: Uint8Array[] };
    expect(deserialized.map(hex).sort()).toEqual(transactions.map(hex).sort());
    expect(host.failure).toBeNull();
  });

  it("runs the tasks a host's own entry gives runLedgerWorker; without `modules`, UmbraDB's entry has its core modules' only", { timeout: LONG }, async () => {
    const own = startLedgerWorker({ entry: typeScriptEntry(TASK_ENTRY) });
    const core = startLedgerWorker();
    hosts.push(own, core);
    for (const host of [own, core]) await host.parse("v9", at(1n), []);
    expect(await own.tasks(run(1n, 0, "call-args", ["call-arguments"]))).toEqual({ "call-arguments": { calls: [], stateGiven: false } });
    expect(await own.tasks(run(1n, 0, "core-contract-logs-fast", ["contract-log-sites"]))).toEqual({ "contract-log-sites": [] });
    await expect(core.tasks(run(1n, 0, "call-args", ["call-arguments"]))).rejects.toThrow(/is not one the ledger worker has/);
    expect(await core.tasks(run(1n, 0, "core-contract-logs-fast", ["contract-log-sites"]))).toEqual({ "contract-log-sites": [] });
    // A trap in a task ends the worker, as an apply's does: that request and every later one fail.
    const trapping = startLedgerWorker({ entry: typeScriptEntry(TASK_ENTRY) });
    hosts.push(trapping);
    await trapping.parse("v9", at(FAULT_AT), []);
    await expect(trapping.tasks(run(FAULT_AT, 0, "task-traps", ["trapped-result"]))).rejects.toBeInstanceOf(LedgerWorkerFailure);
    expect(trapping.failure?.message).toMatch(/RuntimeError: unreachable/);
    await expect(trapping.parse("v9", at(4n), [])).rejects.toBeInstanceOf(LedgerWorkerFailure);
    await expect(runLedgerWorker([])).rejects.toThrow(/runs in the ledger worker's thread/);
    expect(() => ledgerTasksOf([null as never])).toThrow(TypeError);
    expect([...ledgerTasksOf([...CORE_LEDGER_TASK_MODULES, { id: "x" }]).entries()].map(([id, tasks]) => [id, tasks.length])).toEqual([
      ["core-contract-logs-fast", 1],
      ["x", 0],
    ]);
  });

  it("on the main thread's engine (a negative control's ledger) runs the tasks it is given, the plain-data check on unless turned off", { timeout: LONG }, async () => {
    const host = inThreadLedger({ modules: TEST_MODULES });
    await host.parse("v9", at(FAULT_AT), []);
    await expect(host.tasks(run(FAULT_AT, 0, "native-leak", ["leaked-object"]))).rejects.toThrow(/an object of the class LedgerState/);
    const unchecked = inThreadLedger({ modules: TEST_MODULES, checkPlainData: false });
    await unchecked.parse("v9", at(FAULT_AT), []);
    const leak = (await unchecked.tasks(run(FAULT_AT, 0, "native-leak", ["leaked-object"])))["leaked-object"] as { state: { free(): void } };
    expect(leak.state).toBeInstanceOf(RAW.v9.LedgerState);
    leak.state.free();
  });
});

describe("ledger tasks on the main thread (task 12.6; LG-17)", () => {
  const block = (height: bigint, items: Record<string, unknown> = {}): BlockContext => ({
    height,
    hash: hash(Number(height) + 1),
    parentHash: hash(Number(height)),
    items: new Map(Object.entries({ "block-parsed": { ledger: "v9", transactions: [{}, {}] }, ...items })),
    settings: {},
    active: () => true,
  });
  const context = (): ProcessContext => ({ items: new Map(), revisions: [], publish() {} });
  const sink = () => {
    const put: [string, unknown][] = [];
    return { put, sink: { put: (item: string, value: unknown) => void put.push([item, value]) } as ItemSink };
  };

  it("gives a module with tasks the points that run them in the worker and put their results as its items, before its own callbacks, which see them", async () => {
    const asked: unknown[] = [];
    const host = {
      async tasks(input: TaskRun, read: unknown) {
        asked.push({ ...input, read: read !== undefined });
        return Object.fromEntries(input.tasks.map((name) => [name, { name, list: [1, { deep: true }] }]));
      },
    } as unknown as LedgerHost;
    const calls: unknown[] = [];
    const declaration: ModuleDeclaration = {
      ...callArgsModule(),
      requires: ["block-parsed", "ledger-state"],
      provides: [
        { name: "call-arguments", lifetimes: ["block"] },
        { name: "root-before", lifetimes: ["block"] },
      ],
      ledgerTasks: [CALL_ARGS_TASK, STATE_BEFORE_TASK],
      points: {
        async "on-parse"(this: unknown, _p, b) {
          calls.push(["on-parse", this === declaration.points, b.items.get("call-arguments")]);
        },
        async "on-compute"(this: unknown, _p, b) {
          calls.push(["on-compute", this === declaration.points, b.items.get("root-before"), b.items.get("call-arguments")]);
        },
      },
    };
    const wrapped = withLedgerTasks(declaration);
    expect(hasLedgerTasks(wrapped)).toBe(true);
    expect(wrapped).not.toBe(declaration);
    expect(Object.isFrozen(wrapped.points)).toBe(true);
    const p = context();
    bindLedgerTasks(p, host);
    expect(() => bindLedgerTasks(p, host)).toThrow(/bound once/);
    const parse = sink();
    await wrapped.points["on-parse"]?.(p, block(5n), parse.sink);
    expect(parse.put).toEqual([["call-arguments", { name: "call-arguments", list: [1, { deep: true }] }]]);
    expect(Object.isFrozen(parse.put[0]?.[1])).toBe(true);
    expect(Object.isFrozen((parse.put[0]?.[1] as { list: unknown[] }).list[1])).toBe(true);
    const compute = sink();
    const read = { query: async () => [] } as never;
    await wrapped.points["on-compute"]?.(p, block(5n, { "call-arguments": "from on-parse" }), read, compute.sink);
    expect(compute.put).toEqual([["root-before", { name: "root-before", list: [1, { deep: true }] }]]);
    expect(calls).toEqual([
      ["on-parse", true, { name: "call-arguments", list: [1, { deep: true }] }],
      ["on-compute", true, { name: "root-before", list: [1, { deep: true }] }, "from on-parse"],
    ]);
    expect(asked).toEqual([
      { ...run(5n, 2, "call-args", ["call-arguments"]), parentHash: hash(5), read: false },
      { ...run(5n, 2, "call-args", ["root-before"]), parentHash: hash(5), read: true },
    ]);
    // A module without its own callbacks gets the points all the same; a module without tasks is itself.
    const bare = withLedgerTasks({ ...declaration, points: {} });
    await bare.points["on-parse"]?.(p, block(5n), sink().sink);
    const plain = { ...declaration, ledgerTasks: [] };
    expect(withLedgerTasks(plain)).toBe(plain);
    expect(hasLedgerTasks(plain)).toBe(false);
    const set = withLedgerTaskPoints({ backbone: [plain], core: [declaration], user: [plain] });
    expect(set.backbone[0]).toBe(plain);
    expect(set.core[0]).not.toBe(declaration);
    expect(set.user[0]).toBe(plain);
  });

  it("fails the callback unbound, without block-parsed, or with the worker's failure", async () => {
    const wrapped = withLedgerTasks(callArgsModule());
    await expect(wrapped.points["on-parse"]?.(context(), block(1n), sink().sink)).rejects.toThrow(/did not bind to a ledger worker/);
    const p = context();
    bindLedgerTasks(p, { tasks: async () => Promise.reject(new Error("the ledger task call-args of call-args at block 1 threw: no")) } as unknown as LedgerHost);
    await expect(wrapped.points["on-parse"]?.(p, block(1n), sink().sink)).rejects.toThrow(/the ledger task call-args of call-args at block 1 threw/);
    const empty: BlockContext = { ...block(1n), items: new Map() };
    await expect(wrapped.points["on-parse"]?.(p, empty, sink().sink)).rejects.toThrow(/run on block-parsed, which block 1 does not have/);
  });
});
