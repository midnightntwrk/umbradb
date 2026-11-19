import { afterEach, describe, expect, it, type MockInstance, vi } from "vitest";
import { loadLedgerPackage } from "../../src/ledger/load.js";
import type { ApplyInput, ChainOutcome, LedgerName, LedgerPackage, LedgerPackageOptions, StoredNode } from "../../src/ledger/types.js";
import { APPLY_NEEDS_NEW_THREAD, type AppliedState, type ApplyBlock, type BlockId, isApplyNeedsNewThread, LedgerEngine } from "../../src/ledger/worker/engine.js";
import {
  block as fixtureBlock,
  callTransaction,
  cellValue,
  contractFixture,
  FAILING_PROGRAM,
  failingSystemTransaction,
  hex,
  logProgram,
  NETWORK_ID,
  RAW,
  referenceReplay,
  systemTransaction,
  T0,
  zswapOutputTransaction,
} from "./adapter-fixtures.js";

// The ledger worker's logic, run here in the test's thread over the real v9 adapter (the worker thread runs the same
// engine, `worker-host.test.ts`). Oracles: the reference replay (`./adapter-fixtures.ts`, which uses the packages' own
// API, never the adapters) and the vendored package's own exports.

const LONG = 240_000;
const hash = (byte: number): Uint8Array => new Uint8Array(32).fill(byte);
const at = (height: bigint): BlockId => ({ height, hash: hash(Number(height) + 1) });

/** Counts the v9 package's native deserializations while a test runs (the adapter's parses). */
function countParses(): { count(): number; restore(): void } {
  let count = 0;
  const spies: MockInstance[] = [];
  for (const kind of ["Transaction", "SystemTransaction"] as const) {
    const target = RAW.v9[kind] as unknown as { deserialize(...args: unknown[]): unknown };
    const original = target.deserialize.bind(target);
    spies.push(
      vi.spyOn(target, "deserialize").mockImplementation((...args: unknown[]) => {
        count += 1;
        return original(...args);
      }),
    );
  }
  return { count: () => count, restore: () => spies.forEach((spy) => spy.mockRestore()) };
}

/** Each object and array of `value` is plain (`Object`, `Array`), each typed array a `Uint8Array`: what crosses threads. */
function plainProblems(value: unknown, path = "value"): string[] {
  if (value === null || typeof value !== "object") return typeof value === "function" ? [`${path} is a function`] : [];
  if (value instanceof Uint8Array) return Object.getPrototypeOf(value) === Uint8Array.prototype ? [] : [`${path} is no plain Uint8Array`];
  const proto = Object.getPrototypeOf(value);
  if (Array.isArray(value)) return value.flatMap((item, index) => plainProblems(item, `${path}[${index}]`));
  if (proto !== Object.prototype) return [`${path} has the prototype ${proto?.constructor?.name}`];
  return Object.entries(value).flatMap(([key, item]) => plainProblems(item, `${path}.${key}`));
}

/** Block `height`'s apply input (v9, at T0 + 6 s × height, the parent 6 s older). */
function applyBlock(height: bigint, transactions: number, rest: Partial<ApplyBlock> = {}): ApplyBlock {
  return {
    ledger: "v9",
    ...at(height),
    parentHash: at(height - 1n).hash,
    timestampMs: BigInt(T0) + height * 6_000n,
    parentTimestampMs: BigInt(T0) + (height - 1n) * 6_000n,
    firstRegularAtParentTime: false,
    transactions,
    ...rest,
  };
}

const blankGenesis = (): Uint8Array => RAW.v9.LedgerState.blank(NETWORK_ID).serialize();

let counter: ReturnType<typeof countParses> | undefined;
afterEach(() => counter?.restore());

/** An engine over the real adapters, past block 0 (a blank genesis, no transaction): committed at 0. */
async function atGenesis(engine = new LedgerEngine({ load: loadLedgerPackage })): Promise<{ engine: LedgerEngine; zero: AppliedState }> {
  const genesis = blankGenesis();
  const zero = await engine.genesis({
    ledger: "v9",
    ...at(0n),
    parentHash: new Uint8Array(32),
    timestampMs: BigInt(T0),
    transactions: 0,
    genesisState: genesis,
    includesBlockZero: true,
  });
  expect(engine.commit(at(0n))).toBe(true);
  return { engine, zero };
}

describe("the ledger worker's engine", () => {
  it("parses each transaction once and keeps the parse for the block's apply", { timeout: LONG }, async () => {
    const { engine } = await atGenesis();
    const contract = await contractFixture(RAW.v9);
    const transactions = [systemTransaction("v9"), contract.deploy, zswapOutputTransaction(RAW.v9)];
    counter = countParses();
    const parsed = await engine.parse("v9", at(1n), transactions);
    expect(counter.count()).toBe(3);
    expect(parsed.map((t) => [t.index, t.kind, t.size])).toEqual(transactions.map((t, i) => [i, i === 0 ? "system" : "regular", t.length]));
    expect(plainProblems(parsed)).toEqual([]);
    expect(structuredClone(parsed)).toEqual(parsed);
    // The same block again (a retried height): the kept parse, nothing parsed again.
    const again = await engine.parse("v9", at(1n), transactions.map((t) => t.slice()));
    expect(again).toEqual(parsed);
    expect(counter.count()).toBe(3);
    const applied = await engine.apply(applyBlock(1n, 3));
    expect(counter.count()).toBe(3);
    expect(applied.output.results.map((r) => r.outcome)).toEqual(["success", "success", "success"]);
    expect(engine.holds().parsed).toEqual([hex(at(1n).hash)]);
  });

  it("applies a block as the reference replay does, with plain data out and its batch of nodes", { timeout: LONG }, async () => {
    const { engine, zero } = await atGenesis();
    const contract = await contractFixture(RAW.v9);
    const transactions = [
      systemTransaction("v9"),
      contract.deploy,
      callTransaction(RAW.v9, contract, logProgram([cellValue(Uint8Array.of(7))])),
      callTransaction(RAW.v9, contract, logProgram([cellValue(Uint8Array.of(3))]), FAILING_PROGRAM),
      zswapOutputTransaction(RAW.v9),
    ];
    await engine.parse("v9", at(1n), transactions);
    const applied = await engine.apply(applyBlock(1n, transactions.length));

    const reference = referenceReplay(RAW.v9, RAW.v9.LedgerState.deserialize(blankGenesis()), {
      ...fixtureBlock(transactions),
      height: 1n,
      hash: at(1n).hash,
      parentHash: at(0n).hash,
      timestampMs: BigInt(T0) + 6_000n,
      parentTimestampMs: BigInt(T0),
    });
    expect(reference.types).toEqual(["system", "success", "success", "partialSuccess", "success"]);
    expect(hex(applied.stateRoot)).toBe(hex(RAW.v9.stateRoot(reference.state)));
    expect(hex(applied.stateKey)).toBe(hex(RAW.v9.stateKey(reference.state)));
    expect(applied.summary.zswapFirstFree).toBe(reference.state.zswap.firstFree);
    // The six tree values of the reference state, by the package's `stateTrees`.
    expect(applied.summary).toEqual(RAW.v9.stateTrees(reference.state));
    expect(applied.output.results.map((r) => r.outcome)).toEqual(["success", "success", "success", "partial", "success"]);
    // The call's log and the partial success's guaranteed segment's.
    expect(applied.output.logs.map((log) => [log.transaction, log.index])).toEqual([
      [2, 0],
      [3, 1],
    ]);
    expect([applied.ledger, applied.height, hex(applied.hash)]).toEqual(["v9", 1n, hex(at(1n).hash)]);
    expect(plainProblems(applied)).toEqual([]);
    expect(structuredClone(applied)).toEqual(applied);
    // The state after the block persisted, the one before released, in one batch with the new nodes.
    expect(applied.batch.rootCounts.map((c) => [hex(c.key), c.delta]).sort()).toEqual(
      [
        [hex(applied.stateKey), 1],
        [hex(zero.stateKey), -1],
      ].sort(),
    );
    expect(applied.batch.inserts.map((node) => hex(node.key))).toContain(hex(applied.stateKey));
  });

  it("skips a transaction the chain failed, as the outcomes say, and checks their number", { timeout: LONG }, async () => {
    const run = async (outcomes: readonly ChainOutcome[] | undefined) => {
      const { engine } = await atGenesis();
      const transactions = [zswapOutputTransaction(RAW.v9), zswapOutputTransaction(RAW.v9)];
      await engine.parse("v9", at(1n), transactions);
      const input = applyBlock(1n, 2, outcomes === undefined ? {} : { outcomes });
      const applied = await engine.apply(input);
      const reference = referenceReplay(RAW.v9, RAW.v9.LedgerState.deserialize(blankGenesis()), { ...input, transactions });
      expect(hex(applied.stateRoot)).toBe(hex(RAW.v9.stateRoot(reference.state)));
      return applied;
    };
    const skipped = await run(["success", "failure"]);
    expect(skipped.output.results.map((r) => r.outcome)).toEqual(["success", "failure"]);
    const replayed = await run(undefined);
    expect(replayed.output.results.map((r) => r.outcome)).toEqual(["success", "success"]);
    expect(hex(skipped.stateRoot)).not.toBe(hex(replayed.stateRoot));
    const { engine } = await atGenesis();
    await engine.parse("v9", at(1n), [zswapOutputTransaction(RAW.v9)]);
    await expect(engine.apply(applyBlock(1n, 1, { outcomes: ["success", "success"] }))).rejects.toThrow(RangeError);
  });

  it("gives block 0 both genesis cases: a genesis state that includes its transactions, and one that does not", { timeout: LONG }, async () => {
    const transactions = [systemTransaction("v9"), zswapOutputTransaction(RAW.v9)];
    const block0 = { ...fixtureBlock(transactions), height: 0n, hash: at(0n).hash, parentHash: new Uint8Array(32), parentTimestampMs: BigInt(T0) };
    const blank = RAW.v9.LedgerState.blank(NETWORK_ID);
    const included = referenceReplay(RAW.v9, blank, block0).state;

    // The genesis state already holds block 0's transactions: they run on an empty state for their results only.
    const first = new LedgerEngine({ load: loadLedgerPackage });
    await first.parse("v9", at(0n), transactions);
    const genesis = included.serialize();
    expect(hex(await first.genesisRoot("v9", genesis))).toBe(hex(RAW.v9.stateRoot(included)));
    const includes = await first.genesis({ ledger: "v9", ...at(0n), parentHash: new Uint8Array(32), timestampMs: BigInt(T0), transactions: 2, genesisState: genesis, includesBlockZero: true });
    expect(hex(includes.stateRoot)).toBe(hex(RAW.v9.stateRoot(included)));
    expect(includes.output.results.map((r) => r.outcome)).toEqual(["success", "success"]);
    expect(includes.output.events.map((e) => e.kind)).toContain("zswap-output");

    // It does not: they are applied to it.
    const second = new LedgerEngine({ load: loadLedgerPackage });
    await second.parse("v9", at(0n), transactions);
    const applies = await second.genesis({
      ledger: "v9",
      ...at(0n),
      parentHash: new Uint8Array(32),
      timestampMs: BigInt(T0),
      transactions: 2,
      genesisState: genesis,
      includesBlockZero: false,
    });
    const twice = referenceReplay(RAW.v9, RAW.v9.LedgerState.deserialize(genesis), block0).state;
    expect(hex(applies.stateRoot)).toBe(hex(RAW.v9.stateRoot(twice)));
    expect(hex(applies.stateRoot)).not.toBe(hex(includes.stateRoot));
    expect(applies.batch.rootCounts.map((c) => [hex(c.key), c.delta])).toEqual([[hex(applies.stateKey), 1]]);

    // A genesis state of another network: its own id makes the empty state, so its transactions — of that network —
    // apply there (with the adapter's own id, "undeployed", they would be malformed: a failure).
    const preview = new LedgerEngine({ load: loadLedgerPackage });
    const other = RAW.v9.LedgerState.blank("preview").serialize();
    const token = RAW.v9.shieldedToken().raw;
    const output = RAW.v9.ZswapOutput.new(RAW.v9.createShieldedCoinInfo(token, 10n), 0, RAW.v9.sampleCoinPublicKey(), RAW.v9.sampleEncryptionPublicKey());
    const previewOutput = RAW.v9.Transaction.fromParts("preview", RAW.v9.ZswapOffer.fromOutput(output, token, 10n), undefined, undefined)
      .eraseProofs()
      .serialize();
    await preview.parse("v9", at(0n), [previewOutput]);
    const previewZero = await preview.genesis({ ledger: "v9", ...at(0n), parentHash: new Uint8Array(32), timestampMs: BigInt(T0), transactions: 1, genesisState: other, includesBlockZero: true });
    expect(hex(previewZero.stateRoot)).toBe(hex(RAW.v9.stateRoot(RAW.v9.LedgerState.blank("preview"))));
    expect(previewZero.output.results.map((r) => r.outcome)).toEqual(["success"]);
  });

  it("leaves no state when block 0 cannot be applied (a system transaction that fails cannot be replayed)", { timeout: LONG }, async () => {
    const engine = new LedgerEngine({ load: loadLedgerPackage });
    const failing = [failingSystemTransaction("v9")];
    await engine.parse("v9", at(0n), failing);
    const input = { ledger: "v9" as const, ...at(0n), parentHash: new Uint8Array(32), timestampMs: BigInt(T0), transactions: 1, genesisState: blankGenesis() };
    await expect(engine.genesis({ ...input, includesBlockZero: false })).rejects.toThrow(/system transaction 0 of block 0 failed/);
    await expect(engine.genesis({ ...input, includesBlockZero: true })).rejects.toThrow(/system transaction 0 of block 0 failed/);
    expect(engine.holds()).toMatchObject({ committed: null, pending: null });
    await expect(engine.genesis({ ...input, height: 1n, includesBlockZero: true })).rejects.toThrow(RangeError);
  });

  it("returns the same result for the same block again (a retried height), and discards a pending one for another", { timeout: LONG }, async () => {
    const { engine } = await atGenesis();
    const transactions = [zswapOutputTransaction(RAW.v9)];
    await engine.parse("v9", at(1n), transactions);
    const apply = vi.spyOn(RAW.v9.LedgerState.prototype, "apply");
    try {
      const first = await engine.apply(applyBlock(1n, 1));
      const calls = apply.mock.calls.length;
      const again = await engine.apply(applyBlock(1n, 1));
      expect(again).toEqual(first);
      expect(apply.mock.calls.length).toBe(calls);
      // Another block at that height (not a finalized one, but a test of the rule): applied anew from the state at 0.
      await engine.parse("v9", { height: 1n, hash: hash(0xee) }, transactions);
      const other = await engine.apply(applyBlock(1n, 1, { hash: hash(0xee) }));
      expect(apply.mock.calls.length).toBe(calls + 1);
      expect(hex(other.hash)).toBe(hex(hash(0xee)));
      expect(engine.holds().pending).toEqual({ height: 1n, hash: hash(0xee) });
    } finally {
      apply.mockRestore();
    }
  });

  it("applies only on the state committed at h − 1, of the block's ledger and parent, with its parse", { timeout: LONG }, async () => {
    const fresh = new LedgerEngine({ load: loadLedgerPackage });
    await expect(fresh.apply(applyBlock(1n, 0))).rejects.toThrow(/holds no state/);
    const { engine } = await atGenesis();
    await expect(engine.apply(applyBlock(2n, 0))).rejects.toThrow(/at 0, not 1/);
    await expect(engine.apply(applyBlock(1n, 0, { parentHash: hash(0x77) }))).rejects.toThrow(/parent/);
    await expect(engine.apply(applyBlock(1n, 0, { ledger: "v8" }))).rejects.toThrow(/v8.*v9|conversion/);
    await expect(engine.apply(applyBlock(1n, 2))).rejects.toThrow(/parsed 0 transactions/);
    await expect(
      engine.genesis({ ledger: "v9", ...at(0n), parentHash: new Uint8Array(32), timestampMs: 0n, transactions: 0, genesisState: blankGenesis(), includesBlockZero: true }),
    ).rejects.toThrow(/block 0/);
    // Committed blocks move on; a commit of a block not pending changes nothing, as when the callbacks are delivered
    // again after a restart.
    expect(engine.commit(at(5n))).toBe(false);
    const one = await engine.apply(applyBlock(1n, 0));
    expect(engine.holds()).toMatchObject({ committed: at(0n), pending: at(1n) });
    expect(engine.commit(at(1n))).toBe(true);
    expect(engine.holds()).toMatchObject({ committed: at(1n), pending: null });
    const two = await engine.apply(applyBlock(2n, 0));
    expect(two.batch.rootCounts.map((c) => [hex(c.key), c.delta]).sort()).toEqual(
      [
        [hex(two.stateKey), 1],
        [hex(one.stateKey), -1],
      ].sort(),
    );
  });

  it("applies a block ahead on the pending state, with the result and batch of an apply after the commit", { timeout: LONG }, async () => {
    // Everything of a result but the nodes its batch inserts: the engines of this thread share one package, so the
    // second to apply a block flushes none of its nodes (`worker-host.test.ts` compares whole batches, between threads).
    const facts = (applied: AppliedState) => ({ ...applied, batch: { rootCounts: applied.batch.rootCounts } });
    const transactions = [zswapOutputTransaction(RAW.v9)];
    const { engine } = await atGenesis();
    await engine.parse("v9", at(1n), transactions);
    await engine.parse("v9", at(2n), [systemTransaction("v9")]);
    const one = await engine.apply(applyBlock(1n, 1));
    // Without the mark the rule of the committed parent stands.
    await expect(engine.apply(applyBlock(2n, 1))).rejects.toThrow(/at 0, not 1/);
    const two = await engine.apply(applyBlock(2n, 1, { ahead: true }));
    expect(two.batch.inserts.length).toBeGreaterThan(0);
    // The oracle: an engine that applies block 2 after block 1 committed.
    const serial = (await atGenesis()).engine;
    await serial.parse("v9", at(1n), transactions);
    const serialOne = await serial.apply(applyBlock(1n, 1));
    serial.commit(at(1n));
    await serial.parse("v9", at(2n), [systemTransaction("v9")]);
    const serialTwo = await serial.apply(applyBlock(2n, 1));
    expect(facts(one)).toEqual(facts(serialOne));
    expect(facts(two)).toEqual(facts(serialTwo));
    // Its batch releases the pending state's key when none is named, as an apply on a committed state does.
    expect(two.batch.rootCounts.map((c) => [hex(c.key), c.delta]).sort()).toEqual(
      [
        [hex(two.stateKey), 1],
        [hex(one.stateKey), -1],
      ].sort(),
    );
    expect(engine.holds()).toMatchObject({ committed: at(0n), pending: at(1n), ahead: [at(2n)] });
    // Both pending batches' nodes are the engine's to serve.
    for (const node of [...one.batch.inserts, ...two.batch.inserts]) expect(engine.pendingNode(node.key)).toEqual(node);
    // The same blocks again (a retried height, its settle sending the apply ahead again): the same results, nothing
    // applied again.
    const apply = vi.spyOn(RAW.v9.LedgerState.prototype, "apply");
    try {
      expect(await engine.apply(applyBlock(1n, 1))).toEqual(one);
      expect(await engine.apply(applyBlock(2n, 1, { ahead: true }))).toEqual(two);
      expect(apply.mock.calls.length).toBe(0);
    } finally {
      apply.mockRestore();
    }
    expect(engine.holds()).toMatchObject({ committed: at(0n), pending: at(1n), ahead: [at(2n)] });
    // Only the oldest pending block commits; the block applied ahead then is the pending one, and asked for unmarked at
    // its turn it is given back.
    expect(engine.commit(at(2n))).toBe(false);
    expect(engine.commit(at(1n))).toBe(true);
    expect(engine.holds()).toMatchObject({ committed: at(1n), pending: at(2n), ahead: [] });
    for (const node of one.batch.inserts) {
      if (!two.batch.inserts.some((other) => hex(other.key) === hex(node.key))) expect(engine.pendingNode(node.key)).toBeUndefined();
    }
    expect(await engine.apply(applyBlock(2n, 1))).toEqual(two);
    expect(engine.commit(at(2n))).toBe(true);
    // With nothing pending, a block marked ahead is an ordinary apply on the committed state.
    const three = await engine.apply(applyBlock(3n, 0, { ahead: true }));
    const serialThree = (serial.commit(at(2n)), await serial.apply(applyBlock(3n, 0)));
    expect(facts(three)).toEqual(facts(serialThree));
    expect(engine.holds()).toMatchObject({ committed: at(2n), pending: at(3n), ahead: [] });
  });

  it("applies ahead only on the newest pending block, its parent, of the same ledger; an unmarked apply of another block drops every pending state", { timeout: LONG }, async () => {
    const { engine } = await atGenesis();
    await engine.apply(applyBlock(1n, 0));
    await expect(engine.apply(applyBlock(3n, 0, { ahead: true }))).rejects.toThrow(/newest pending block is 1, which is not its parent/);
    await expect(engine.apply(applyBlock(2n, 0, { ahead: true, parentHash: hash(0x77) }))).rejects.toThrow(/not its parent/);
    await expect(engine.apply(applyBlock(2n, 0, { ahead: true, ledger: "v8" }))).rejects.toThrow(/never applied ahead/);
    await expect(engine.apply(applyBlock(2n, 2, { ahead: true }))).rejects.toThrow(/parsed 0 transactions/);
    expect(engine.holds()).toMatchObject({ committed: at(0n), pending: at(1n), ahead: [] });
    // A chain: each block on the pending state of the one before.
    const two = await engine.apply(applyBlock(2n, 0, { ahead: true }));
    const three = await engine.apply(applyBlock(3n, 0, { ahead: true }));
    await expect(engine.apply(applyBlock(5n, 0, { ahead: true }))).rejects.toThrow(/newest pending block is 3, which is not its parent/);
    expect(engine.holds()).toMatchObject({ committed: at(0n), pending: at(1n), ahead: [at(2n), at(3n)] });
    // Each releases the state before it, as the same blocks applied one commit at a time do.
    expect(three.batch.rootCounts.map((c) => [hex(c.key), c.delta]).sort()).toEqual([[hex(three.stateKey), 1], [hex(two.stateKey), -1]].sort());
    // Any of them again: its result, nothing applied.
    expect(await engine.apply(applyBlock(3n, 0, { ahead: true }))).toEqual(three);
    // The state at the pending block asked for as the committed one (its commit not yet delivered): it commits, and
    // the blocks applied ahead stay.
    const key = (await engine.apply(applyBlock(1n, 0))).stateKey;
    expect((await engine.load({ ledger: "v9", ...at(1n), stateKey: key })).loaded).toBe(false);
    expect(engine.holds()).toMatchObject({ committed: at(1n), pending: at(2n), ahead: [at(3n)] });
    expect(engine.commit(at(2n))).toBe(true);
    expect(engine.holds()).toMatchObject({ committed: at(2n), pending: at(3n), ahead: [] });
    // Another block at the pending height, unmarked: applied anew on the committed state, every pending state dropped.
    const other = await engine.apply(applyBlock(3n, 0, { hash: hash(0xee) }));
    expect(hex(other.hash)).toBe(hex(hash(0xee)));
    expect(engine.holds()).toMatchObject({ committed: at(2n), pending: { height: 3n, hash: hash(0xee) }, ahead: [] });
  });

  it("gives block 0 again while pending, with its outcomes, and refuses a parse of another ledger", { timeout: LONG }, async () => {
    const engine = new LedgerEngine({ load: loadLedgerPackage });
    const transactions = [zswapOutputTransaction(RAW.v9)];
    await engine.parse("v9", at(0n), transactions);
    const input = {
      ledger: "v9" as const,
      ...at(0n),
      parentHash: new Uint8Array(32),
      timestampMs: BigInt(T0),
      transactions: 1,
      outcomes: ["success"] as const,
      genesisState: blankGenesis(),
      includesBlockZero: false,
    };
    const zero = await engine.genesis(input);
    expect(await engine.genesis(input)).toBe(zero);
    expect(zero.output.results.map((r) => r.outcome)).toEqual(["success"]);
    const other = new LedgerEngine({ load: loadLedgerPackage });
    await other.parse("v9", at(0n), transactions);
    await expect(other.genesis({ ...input, ledger: "v8" })).rejects.toThrow(/parsed 1 transactions of it with v9, not 1/);
  });

  it("gives a pending block's result back only for the input it was applied from, and refuses any other input for it, what it holds left as it is", { timeout: LONG }, async () => {
    const { engine } = await atGenesis();
    const one = await engine.apply(applyBlock(1n, 0));
    const a = hash(0xa1);
    const given: Partial<ApplyBlock> = { contracts: [a], release: [one.stateKey] };
    const two = await engine.apply(applyBlock(2n, 0, { ...given, ahead: true }));
    expect(two.contracts.map((contract) => hex(contract.address))).toEqual([hex(a)]);
    // The same input built apart, marked ahead or not: the pending result itself.
    expect(await engine.apply(applyBlock(2n, 0, { ahead: true, contracts: [Uint8Array.from(a)], release: [Uint8Array.from(one.stateKey)] }))).toBe(two);
    expect(await engine.apply(applyBlock(2n, 0, given))).toBe(two);
    // Any member that differs: refused, naming the member, marked ahead or not.
    const others = [
      ["contracts", { contracts: [hash(0xb2)] }],
      ["contracts", { contracts: [] }],
      ["contracts", { contracts: undefined }],
      ["contracts", { contracts: [a, a] }],
      ["release", { release: [] }],
      ["release", { release: undefined }],
      ["release", { release: [hash(0xc3)] }],
      ["timestampMs", { timestampMs: 1n }],
      ["parentTimestampMs", { parentTimestampMs: 1n }],
      ["firstRegularAtParentTime", { firstRegularAtParentTime: true }],
      ["outcomes", { outcomes: [] }],
      ["parentHash", { parentHash: hash(0x77) }],
      ["ledger", { ledger: "v8" }],
      ["transactions", { transactions: 1 }],
      ["contracts, release", { contracts: [], release: [] }],
    ] as unknown as readonly (readonly [string, Partial<ApplyBlock>])[];
    for (const [member, other] of others) {
      for (const ahead of [true, false]) {
        const refused = await engine.apply(applyBlock(2n, 0, { ...given, ...other, ...(ahead ? { ahead } : {}) })).catch((error: unknown) => error);
        expect(isApplyNeedsNewThread(refused), `${member}, ahead ${ahead}`).toBe(true);
        expect((refused as Error).name).toBe(APPLY_NEEDS_NEW_THREAD);
        expect((refused as Error).message, member).toContain(`block 2 is pending in this ledger worker thread, applied from another input (it differs in ${member})`);
      }
    }
    // The oldest pending block likewise, asked for at a retried height's turn.
    expect(await engine.apply(applyBlock(1n, 0))).toBe(one);
    await expect(engine.apply(applyBlock(1n, 0, { timestampMs: 1n }))).rejects.toThrow(/block 1 is pending .* \(it differs in timestampMs\)/);
    // A refusal changes nothing: both blocks pending, their results given back for their inputs.
    expect(engine.holds()).toMatchObject({ committed: at(0n), pending: at(1n), ahead: [at(2n)] });
    expect(await engine.apply(applyBlock(2n, 0, given))).toBe(two);
    expect(engine.commit(at(1n))).toBe(true);
    expect(engine.commit(at(2n))).toBe(true);
    // Block 0 too.
    const fresh = new LedgerEngine({ load: loadLedgerPackage });
    const genesis = { ledger: "v9" as const, ...at(0n), parentHash: new Uint8Array(32), timestampMs: BigInt(T0), transactions: 0, genesisState: blankGenesis(), includesBlockZero: true };
    const zero = await fresh.genesis(genesis);
    expect(await fresh.genesis({ ...genesis, genesisState: blankGenesis() })).toBe(zero);
    await expect(fresh.genesis({ ...genesis, timestampMs: 1n })).rejects.toThrow(/block 0 is pending .* \(it differs in timestampMs\)/);
    await expect(fresh.genesis({ ...genesis, includesBlockZero: false })).rejects.toThrow(/it differs in includesBlockZero/);
    expect(fresh.holds()).toMatchObject({ committed: null, pending: at(0n) });
  });

  it("keeps a copy of a pending block's input: a later change of the buffers it was given does not change what the block is compared with", { timeout: LONG }, async () => {
    const { engine } = await atGenesis();
    const contract = hash(0xa1);
    const one = await engine.apply(applyBlock(1n, 0, { contracts: [contract] }));
    contract.fill(0xb2);
    // The buffer now names another contract: the pending block was applied from the one it named then.
    await expect(engine.apply(applyBlock(1n, 0, { contracts: [contract] }))).rejects.toThrow(/it differs in contracts/);
    expect(await engine.apply(applyBlock(1n, 0, { contracts: [hash(0xa1)] }))).toBe(one);
  });

  it("drops kept parses of committed heights and of dropped best blocks", { timeout: LONG }, async () => {
    const { engine } = await atGenesis();
    await engine.parse("v9", at(1n), [zswapOutputTransaction(RAW.v9)]);
    await engine.parse("v9", at(2n), [zswapOutputTransaction(RAW.v9)]);
    await engine.parse("v9", { height: 2n, hash: hash(0xbb) }, [zswapOutputTransaction(RAW.v9)]);
    await engine.parse("v9", at(3n), []);
    await engine.parse("v9", { height: 2n, hash: hash(0x00) }, [zswapOutputTransaction(RAW.v9)]);
    await engine.parse("v9", { height: 0n, hash: hash(0xff) }, [zswapOutputTransaction(RAW.v9)]);
    // By height, then by hash.
    expect(engine.holds().parsed).toEqual([hex(hash(0xff)), hex(at(1n).hash), hex(hash(0x00)), hex(at(2n).hash), hex(hash(0xbb))]);
    expect(await engine.release({ hashes: [hash(0x00), hash(0xff)] })).toBe(2);
    expect(engine.holds().parsed).toHaveLength(3);
    expect(await engine.release({ hashes: [hash(0xbb)] })).toBe(1);
    expect(await engine.release({ upTo: 1n })).toBe(1);
    expect(engine.holds().parsed).toEqual([hex(at(2n).hash)]);
    expect(await engine.release({ upTo: 5n, hashes: [hash(0x01)] })).toBe(1);
    expect(engine.holds().parsed).toEqual([]);
  });

  it("hands the adapter each block's times, the rule and outcomes as given; block 0 its own time as its parent's", { timeout: LONG }, async () => {
    const inputs: ApplyInput[] = [];
    const engine = new LedgerEngine({
      load: async (ledger, options) => {
        const adapter = await loadLedgerPackage(ledger, options);
        return { ...adapter, apply: (state, input) => (inputs.push(input), adapter.apply(state, input)) };
      },
    });
    await engine.parse("v9", at(0n), [zswapOutputTransaction(RAW.v9)]);
    await engine.genesis({ ledger: "v9", ...at(0n), parentHash: new Uint8Array(32), timestampMs: BigInt(T0), transactions: 1, genesisState: blankGenesis(), includesBlockZero: false });
    engine.commit(at(0n));
    await engine.parse("v9", at(1n), [zswapOutputTransaction(RAW.v9)]);
    await engine.apply(applyBlock(1n, 1, { firstRegularAtParentTime: true, parentTimestampMs: 77n, outcomes: ["partial"] }));
    expect(inputs.map((i) => [i.height, i.timestampMs, i.parentTimestampMs, i.firstRegularAtParentTime, i.outcomes])).toEqual([
      [0n, BigInt(T0), BigInt(T0), false, undefined],
      [1n, BigInt(T0) + 6_000n, 77n, true, ["partial"]],
    ]);
  });

  it("installs its node store in the package at the first block, once, by loading the state it just made", { timeout: LONG }, async () => {
    const loads: string[] = [];
    const store = { get: () => null };
    const engine = new LedgerEngine({
      store,
      load: async (ledger, options) => {
        const adapter = await loadLedgerPackage(ledger, options);
        return {
          ...adapter,
          load: (key, given) => {
            loads.push(`${hex(key)} ${given === store}`);
            return adapter.load(key, given);
          },
        };
      },
    });
    const zero = await engine.genesis({ ledger: "v9", ...at(0n), parentHash: new Uint8Array(32), timestampMs: BigInt(T0), transactions: 0, genesisState: blankGenesis(), includesBlockZero: true });
    engine.commit(at(0n));
    await engine.apply(applyBlock(1n, 0));
    expect(loads).toEqual([`${hex(zero.stateKey)} true`]);
    // Without a store (the main thread's engine), nothing is installed.
    const plain = new LedgerEngine({ load: loadLedgerPackage });
    await plain.genesis({ ledger: "v9", ...at(0n), parentHash: new Uint8Array(32), timestampMs: BigInt(T0), transactions: 0, genesisState: blankGenesis(), includesBlockZero: true });
  });

  it("loads each ledger's adapter once, and again after a failed load", async () => {
    const loads: string[] = [];
    let fail = true;
    const load = async (ledger: LedgerName, options: LedgerPackageOptions): Promise<LedgerPackage> => {
      loads.push(`${ledger} ${options.networkId}`);
      if (fail) {
        fail = false;
        throw new Error("no package here");
      }
      return loadLedgerPackage(ledger, options);
    };
    const engine = new LedgerEngine({ load });
    await expect(engine.parse("v9", at(1n), [zswapOutputTransaction(RAW.v9)])).rejects.toThrow(/no package here/);
    await engine.parse("v9", at(1n), [zswapOutputTransaction(RAW.v9)]);
    await engine.parse("v9", at(2n), [zswapOutputTransaction(RAW.v9)]);
    // A block without transactions loads nothing.
    await engine.parse("v8", at(3n), []);
    expect(loads).toEqual(["v9 undeployed", "v9 undeployed"]);
  });

  it("loads a state by its key from the store it is given (the node-store bridge's side)", { timeout: LONG }, async () => {
    const { engine, zero } = await atGenesis();
    const stored = new Map(zero.batch.inserts.map((node) => [hex(node.key), node]));
    const asked: string[] = [];
    const reading = new LedgerEngine({
      load: loadLedgerPackage,
      store: {
        get(key) {
          asked.push(hex(key));
          return stored.get(hex(key)) ?? null;
        },
      },
    });
    const loaded = await reading.load({ ledger: "v9", ...at(0n), stateKey: zero.stateKey });
    expect(hex(loaded.stateRoot)).toBe(hex(zero.stateRoot));
    // The pending block's nodes are the engine's to serve until it commits (the database holds them from then on).
    await engine.parse("v9", at(1n), [zswapOutputTransaction(RAW.v9)]);
    const one = await engine.apply(applyBlock(1n, 1));
    const inserted = one.batch.inserts[0] as StoredNode;
    expect(engine.pendingNode(inserted.key)).toEqual(inserted);
    expect(engine.pendingNode(new Uint8Array(32))).toBeUndefined();
    engine.commit(at(1n));
    expect(engine.pendingNode(inserted.key)).toBeUndefined();
    // Loading again replaces the state it held.
    expect(hex((await reading.load({ ledger: "v9", ...at(0n), stateKey: zero.stateKey })).stateRoot)).toBe(hex(zero.stateRoot));
    expect(reading.holds()).toMatchObject({ committed: at(0n), pending: null });
    // In this thread the package already holds the nodes in memory; a fresh worker reads them (worker-host.test.ts).
    expect(asked.length).toBeLessThanOrEqual(1);
    await expect(new LedgerEngine({ load: loadLedgerPackage }).load({ ledger: "v9", ...at(0n), stateKey: zero.stateKey })).rejects.toThrow(
      /no node store/,
    );
    void engine;
  });

  it("applies no block after an apply failed once its state was made, since the package holds a part of it; a pending block still gets its result, and a failure before that changes nothing", { timeout: LONG }, async () => {
    const rootCounts = (applied: AppliedState) => applied.batch.rootCounts.map((count) => [hex(count.key), count.delta]).sort();
    // A contract address of 3 bytes: the package throws when it reads the contract's keys, after the engine persisted
    // the new state's key.
    const malformed = Uint8Array.of(1, 2, 3);
    // The engines of this thread share one package: what a failed apply left in it is flushed away before the next
    // engine is used, so that each case starts from a package with nothing pending.
    const drain = (): void => void RAW.v9.flushNodes();
    const { engine, zero } = await atGenesis();
    const failure = await engine.apply(applyBlock(1n, 0, { contracts: [malformed] })).catch((error: unknown) => error);
    expect(failure).toBeInstanceOf(Error);
    expect(failure).not.toBeInstanceOf(WebAssembly.RuntimeError);
    expect(isApplyNeedsNewThread(failure)).toBe(false);
    expect(engine.holds()).toMatchObject({ committed: at(0n), pending: null });
    // The block with the right input, at its turn or ahead, and any other block: refused, naming the failed apply.
    for (const input of [applyBlock(1n, 0), applyBlock(1n, 0, { ahead: true }), applyBlock(1n, 0, { hash: hash(0xee) })]) {
      const refused = await engine.apply(input).catch((error: unknown) => error);
      expect(isApplyNeedsNewThread(refused)).toBe(true);
      expect((refused as Error).message).toMatch(/block 1 cannot be applied in this ledger worker thread: the apply of block 1 failed after its state was made/);
    }
    // What does not apply goes on: a parse, a commit of nothing, an eviction of nothing.
    expect(await engine.parse("v9", at(1n), [])).toEqual([]);
    expect(engine.commit(at(1n))).toBe(false);
    expect(await engine.evict([])).toBe(0);
    drain();
    // An engine with a pending block: the block applied ahead on it fails so, and the pending block, made again, still
    // gets its result (it was made before the failure).
    const second = (await atGenesis()).engine;
    const one = await second.apply(applyBlock(1n, 0));
    await expect(second.apply(applyBlock(2n, 0, { ahead: true, contracts: [malformed] }))).rejects.toThrow();
    expect(await second.apply(applyBlock(1n, 0))).toBe(one);
    await expect(second.apply(applyBlock(2n, 0, { ahead: true }))).rejects.toThrow(/block 2 cannot be applied in this ledger worker thread: the apply of block 2 failed/);
    expect(second.holds()).toMatchObject({ committed: at(0n), pending: at(1n), ahead: [] });
    drain();
    // Failures before the state is made (a block the engine refuses, a missing parse, the adapter's own apply throwing):
    // the next apply gives the root counts of one apply.
    const third = (await atGenesis()).engine;
    await expect(third.apply(applyBlock(2n, 0))).rejects.toThrow(/at 0, not 1/);
    await expect(third.apply(applyBlock(1n, 2))).rejects.toThrow(/parsed 0 transactions/);
    await third.parse("v9", { height: 1n, hash: hash(0xdd) }, [failingSystemTransaction("v9")]);
    await expect(third.apply(applyBlock(1n, 1, { hash: hash(0xdd) }))).rejects.toThrow(/system transaction 0 of block 1 failed/);
    const applied = await third.apply(applyBlock(1n, 0));
    expect(rootCounts(applied)).toEqual(
      [
        [hex(applied.stateKey), 1],
        [hex(zero.stateKey), -1],
      ].sort(),
    );
    // Block 0 after a failed block 0.
    const fresh = new LedgerEngine({
      load: async (ledger, options) => {
        const adapter = await loadLedgerPackage(ledger, options);
        return { ...adapter, flush: () => { throw new Error("the flush failed (the test's)"); } };
      },
    });
    const genesis = { ledger: "v9" as const, ...at(0n), parentHash: new Uint8Array(32), timestampMs: BigInt(T0), transactions: 0, genesisState: blankGenesis(), includesBlockZero: true };
    await expect(fresh.genesis(genesis)).rejects.toThrow(/the flush failed/);
    await expect(fresh.genesis(genesis)).rejects.toThrow(/block 0 cannot be applied in this ledger worker thread: the apply of block 0 failed after its state was made \(the flush failed/);
    drain();
    // Whatever was thrown, an error or not.
    const other = new LedgerEngine({
      load: async (ledger, options) => {
        const adapter = await loadLedgerPackage(ledger, options);
        return {
          ...adapter,
          flush: () => {
            throw "no flush";
          },
        };
      },
    });
    await expect(other.genesis(genesis)).rejects.toBe("no flush");
    await expect(other.genesis(genesis)).rejects.toThrow(/the apply of block 0 failed after its state was made \(no flush\)/);
    drain();
  });
});
