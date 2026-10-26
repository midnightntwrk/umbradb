import { readFileSync } from "node:fs";
import { afterAll, beforeAll, describe, expect, it, vi } from "vitest";
import type { ApplyOutput, LedgerPackage, LogItem, ParsedTransaction, StoredNode } from "../../src/ledger/types.js";
import {
  block,
  callTransaction,
  cellValue,
  contractFixture,
  FAILING_PROGRAM,
  failingSystemTransaction,
  fromHex,
  GLOBAL_TTL_MS,
  hex,
  type Ledger,
  logProgram,
  markersOf,
  mixedIntent,
  NETWORK_ID,
  RAW,
  referenceReplay,
  sha256,
  systemTransaction,
  T0,
  twoSegmentDeploy,
  unprovenDeploy,
  utf8,
  wrappedLog,
  zswapOutputTransaction,
} from "./adapter-fixtures.js";
import {
  expectNoV8Logs,
  expectRecordedRelease,
  expectSmallStateReloadsByKey,
  logValueInputs,
} from "./adapter-checks.js";
import { AdapterWorkerHost, type LoadedState, type Replayed } from "./adapter-worker-host.js";
import { decodeChildren, refsOf, storedNodeKey } from "./node-format.js";

// Task 12.1 of `openspec/changes/core-arch` (A98; LG-6, LG-7, LG-8, CC-2, owner decisions Q49, Q54, Q55): the one
// adapter test suite, run against the v8 adapter (`adapter-v8.test.ts`) and the v9 adapter (`adapter-v9.test.ts`).
// Version-specific clauses are parameters: `logs` is "none" for v8 (Q54) and "decoded" for v9. Expected values come
// from the recorded vendor files, the node's own state roots (`fixtures/genesis/node-roots.json`), the independent node
// format (`node-format.ts`), the packages' own functions, and a reference replay with the published API
// (`adapter-fixtures.ts`), never from the adapter under test.

export interface AdapterSubject {
  ledger: Ledger;
  load(): Promise<LedgerPackage>;
  /** Q54: whether `apply` reports contract logs. */
  logs: "none" | "decoded";
}

interface NodeRoot {
  file: string;
  ledger: Ledger;
  network: string;
  stateRoot: string;
}

const GENESIS = new URL("./fixtures/genesis/", import.meta.url);
const NODE_ROOTS = (JSON.parse(readFileSync(new URL("node-roots.json", GENESIS), "utf8")) as { states: NodeRoot[] })
  .states;

const LONG = 120_000;
const WORKER = 240_000;

/** Whether every value inside is plain, structured-cloneable data: no native ledger object anywhere. */
function plainEverywhere(value: unknown): boolean {
  if (value === null || ["string", "number", "boolean", "bigint", "undefined"].includes(typeof value)) return true;
  if (value instanceof Uint8Array) return Object.getPrototypeOf(value) === Uint8Array.prototype;
  if (Array.isArray(value)) return value.every(plainEverywhere);
  if (typeof value !== "object" || Object.getPrototypeOf(value) !== Object.prototype) return false;
  return Object.values(value as Record<string, unknown>).every(plainEverywhere);
}

const counts = (batch: { rootCounts: { key: Uint8Array; delta: number }[] }): [string, number][] =>
  batch.rootCounts.map((count) => [hex(count.key), count.delta]);

const allSegments = (segments: number[], success: boolean): { segment: number; success: boolean }[] =>
  segments.map((segment) => ({ segment, success }));

export function describeLedgerPackage(subject: AdapterSubject): void {
  const raw = RAW[subject.ledger];
  const host = new AdapterWorkerHost();
  // Everything this file's adapter flushed so far: the store the database would hold.
  const store = new Map<string, StoredNode>();
  let adapter: LedgerPackage;

  const flushInto = (): void => {
    for (const node of adapter.flush().inserts) store.set(hex(node.key), node);
  };
  const loadInWorker = (key: Uint8Array, nodes: StoredNode[]) =>
    host.run<LoadedState>({ op: "load", ledger: subject.ledger, networkId: NETWORK_ID, key, nodes });

  beforeAll(async () => {
    adapter = await subject.load();
    await host.start();
  }, WORKER);
  afterAll(() => host.stop());

  describe(`${subject.ledger} adapter: the recorded release and packages (A98)`, () => {
    it("versionName and rawPackages() are the release and the package vendor/ledger records", () => {
      expectRecordedRelease(adapter, subject.ledger, raw);
    });
  });

  describe(`${subject.ledger} adapter: states (LG-6, Q55)`, () => {
    for (const fixture of NODE_ROOTS.filter((root) => root.ledger === subject.ledger)) {
      it(`stateRoot of the ${fixture.network} genesis state is the node's block-0 root, also reloaded by its stateKey`, {
        timeout: WORKER,
      }, async () => {
        const state = adapter.genesisState(Uint8Array.from(readFileSync(new URL(fixture.file, GENESIS))));
        expect(hex(adapter.stateRoot(state))).toBe(fixture.stateRoot);
        const key = adapter.stateKey(state);
        expect(`00${hex(key)}`).toBe(fixture.stateRoot);
        adapter.persist(key);
        const batch = adapter.flush();
        for (const node of batch.inserts) {
          expect(hex(storedNodeKey(node.data, node.children))).toBe(hex(node.key));
          const refs = refsOf(decodeChildren(node.children)).map(hex).sort();
          expect(adapter.childRefs(node.children).map(hex).sort()).toEqual(refs);
          store.set(hex(node.key), node);
        }
        expect(counts(batch)).toEqual([[hex(key), 1]]);
        const loaded = await loadInWorker(key, [...store.values()]);
        expect(loaded.error).toBeUndefined();
        expect(hex(loaded.result!.stateRoot)).toBe(fixture.stateRoot);
        // In this thread the nodes are still in memory; the load goes through the same call.
        const here = adapter.load(key, { get: (wanted) => store.get(hex(wanted)) ?? null });
        expect(hex(adapter.stateRoot(here))).toBe(fixture.stateRoot);

        adapter.release(key);
        expect(counts(adapter.flush())).toEqual([[hex(key), -1]]);
        expect(adapter.contractStateKey(state, new Uint8Array(32))).toBeNull();
        expect(adapter.contractZswapStateKey(state, new Uint8Array(32))).toBeNull();
      });
    }

    it("a state under the 1,024-byte embedding limit reloads by its stateKey (Q55)", { timeout: WORKER }, async () => {
      flushInto();
      await expectSmallStateReloadsByKey(adapter, host, store);
    });

    it("a load from a store without the key fails", { timeout: WORKER }, async () => {
      const loaded = await loadInWorker(new Uint8Array(32).fill(7), []);
      expect(loaded.error).toMatch(/no node/);
    });

    it("a deployed contract's state and zswap state have keys, and persisting them flushes their nodes", {
      timeout: LONG,
    }, async () => {
      flushInto();
      const contract = await contractFixture(raw);
      const { state } = adapter.apply(adapter.emptyState(), block([contract.deploy]));
      const stateKey = adapter.contractStateKey(state, contract.address)!;
      const zswapKey = adapter.contractZswapStateKey(state, contract.address)!;
      expect(stateKey).toHaveLength(32);
      expect(zswapKey).toHaveLength(32);
      adapter.persist(stateKey);
      adapter.persist(zswapKey);
      const batch = adapter.flush();
      expect(batch.rootCounts.map((count) => hex(count.key)).sort()).toEqual([hex(stateKey), hex(zswapKey)].sort());
      for (const node of batch.inserts) store.set(hex(node.key), node);
      expect(store.has(hex(stateKey))).toBe(true);
      expect(store.has(hex(zswapKey))).toBe(true);
      // The contract state holds its operation's verifier key (2,311 bytes) as a node of its own, which the live state
      // still holds: the package refuses to forget it.
      const roots = new Set([hex(stateKey), hex(zswapKey)]);
      const children = batch.inserts.filter((node) => !roots.has(hex(node.key)));
      expect(children.length).toBeGreaterThan(0);
      expect(() => adapter.evict(children.map((node) => node.key))).toThrow(/still held by a live object/);
      expect(() => adapter.evict([])).not.toThrow();
    });
  });

  describe(`${subject.ledger} adapter: parsing (LG-7)`, () => {
    it("parses a proven deploy into its plain data, with the ledger's own transaction hash", {
      timeout: LONG,
    }, async () => {
      const contract = await contractFixture(raw);
      const parsed = adapter.parseTransaction(contract.deploy, 3);
      const native = raw.Transaction.deserialize("signature", "proof", "binding", contract.deploy);
      expect(parsed).toEqual({
        index: 3,
        hash: fromHex(native.transactionHash()),
        kind: "regular",
        size: contract.deploy.length,
        bytes: contract.deploy,
        segments: [{ segment: 1, calls: [], deploys: [{ address: contract.address }] }],
      });
      expect(hex(parsed.hash)).toBe(hex(sha256(contract.deploy)));
      expect(plainEverywhere(parsed)).toBe(true);
      expect(structuredClone(parsed)).toEqual(parsed);
    });

    it("parses a contract call, a zswap-only transaction and a system transaction", { timeout: LONG }, async () => {
      const contract = await contractFixture(raw);
      const call = callTransaction(raw, contract, logProgram([cellValue(Uint8Array.of(1))]));
      const zswap = zswapOutputTransaction(raw);
      const system = systemTransaction(subject.ledger);
      const parsed = [call, zswap, system].map((bytes, index) => adapter.parseTransaction(bytes, index));
      expect(parsed.map((tx) => [tx.index, tx.kind, tx.size, hex(tx.hash)])).toEqual([
        [0, "regular", call.length, hex(sha256(call))],
        [1, "regular", zswap.length, hex(sha256(zswap))],
        [2, "system", system.length, hex(sha256(system))],
      ]);
      expect(parsed[0]!.segments).toEqual([
        { segment: 1, calls: [{ address: contract.address, entryPoint: utf8("emit") }], deploys: [] },
      ]);
      expect(parsed[1]!.segments).toEqual([]);
      expect(parsed[2]!.segments).toEqual([]);
      for (const tx of parsed) {
        expect(plainEverywhere(tx)).toBe(true);
        expect(structuredClone(tx)).toEqual(tx);
      }
    });

    it("parses each transaction once: apply and nativeTransaction reuse what parseTransaction parsed", {
      timeout: LONG,
    }, async () => {
      const contract = await contractFixture(raw);
      const call = callTransaction(raw, contract, logProgram([cellValue(Uint8Array.of(2))]));
      const transactions = [systemTransaction(subject.ledger), contract.deploy, call];
      const regular = vi.spyOn(raw.Transaction, "deserialize");
      const system = vi.spyOn(raw.SystemTransaction, "deserialize");
      try {
        transactions.forEach((bytes, index) => adapter.parseTransaction(bytes, index));
        const native = adapter.nativeTransaction(transactions[1]!);
        expect(native).toBeInstanceOf(raw.Transaction);
        expect(adapter.nativeTransaction(transactions[2]!)).toBeInstanceOf(raw.Transaction);
        expect(adapter.nativeTransaction(transactions[0]!)).toBeInstanceOf(raw.SystemTransaction);
        const { output } = adapter.apply(adapter.emptyState(), block(transactions));
        expect(output.results.map((result) => result.outcome)).toEqual(["success", "success", "success"]);
        expect(adapter.nativeTransaction(transactions[1]!)).toBe(native);
        expect([regular.mock.calls.length, system.mock.calls.length]).toEqual([2, 1]);

        // Bytes never parsed before are parsed once, by whichever call comes first.
        const copies = transactions.map((bytes) => Uint8Array.from(bytes));
        adapter.apply(adapter.emptyState(), block(copies));
        copies.forEach((bytes, index) => adapter.parseTransaction(bytes, index));
        expect([regular.mock.calls.length, system.mock.calls.length]).toEqual([4, 2]);
      } finally {
        regular.mockRestore();
        system.mockRestore();
      }
    });

    it("parses a transaction with two segments in segment order, and an entry point that is not UTF-8", {
      timeout: LONG,
    }, async () => {
      const two = await twoSegmentDeploy(raw);
      expect(adapter.parseTransaction(two.bytes, 0).segments).toEqual([
        { segment: 1, calls: [], deploys: [{ address: two.addresses[0] }] },
        { segment: 2, calls: [], deploys: [{ address: two.addresses[1] }] },
      ]);
      const contract = await contractFixture(raw);
      const binary = Uint8Array.of(0xff, 0xfe, 0x00);
      const program = logProgram([cellValue(Uint8Array.of(1))]);
      const call = callTransaction(raw, contract, program, undefined, T0 + 60_000, binary);
      const calls = adapter.parseTransaction(call, 0).segments[0]!.calls;
      expect(calls).toEqual([{ address: contract.address, entryPoint: binary }]);
      // The package gives a UTF-8 entry point as a string; its bytes are its UTF-8 encoding.
      const accented = callTransaction(raw, contract, program, undefined, T0 + 60_000, "émit");
      expect(adapter.parseTransaction(accented, 0).segments[0]!.calls[0]!.entryPoint).toEqual(utf8("émit"));
    });

    it("lists an intent's calls and deploys, and neither for a maintenance update", { timeout: LONG }, async () => {
      const contract = await contractFixture(raw);
      const mixed = mixedIntent(raw, contract);
      expect(adapter.parseTransaction(mixed.bytes, 0).segments).toEqual([
        {
          segment: 1,
          calls: [{ address: contract.address, entryPoint: utf8("emit") }],
          deploys: [{ address: mixed.deployed }],
        },
      ]);
    });

    it("refuses bytes that are not a transaction of this ledger version, and an index that is not one", async () => {
      for (const text of [
        "midnight:ledger-state[v18]:",
        "midnight:transaction[v9]",
        "midnight:transaction[v9](sig,proof,pedersen-schnorr[v1]):",
        "midnight:transaction[v9](signature[v1],nonsense,binding):",
        "midnight:transaction[v9](signature[v1],proof,nonsense):",
        "midnight:transaction[v9](signature[v1],nonsense,pedersen-schnorr[v1]):",
        "midnight:mytransaction[v9](signature[v1],proof,pedersen-schnorr[v1]):",
        "midnight:transaction[v9](signature[v1],proof,pedersen-schnorr[v1])x:",
        "midnight:system-transaction[v6]]",
        "notmidnt:system-transaction[v6]:",
      ]) {
        expect(() => adapter.parseTransaction(utf8(text), 0), text).toThrow(/not a transaction/);
      }
      expect(() => adapter.parseTransaction(Uint8Array.of(1, 2, 3), 0)).toThrow(/not a transaction/);
      expect(() => adapter.nativeTransaction(utf8("midnight:transaction[v9]((),(),x):"))).toThrow(/not a transaction/);
      const other = subject.ledger === "v8" ? systemTransaction("v9") : systemTransaction("v8");
      expect(() => adapter.parseTransaction(other, 0)).toThrow();
      const contract = await contractFixture(raw);
      for (const index of [-1, 1.5, Number.NaN, 2 ** 53]) {
        expect(() => adapter.parseTransaction(contract.deploy, index)).toThrow(RangeError);
      }
    }, LONG);
  });

  describe(`${subject.ledger} adapter: applying a block (LG-8, LG-16)`, () => {
    it("applies a block of a system transaction, a deploy, two calls and a zswap output as the reference replay does", {
      timeout: LONG,
    }, async () => {
      const contract = await contractFixture(raw);
      const logged = [cellValue(Uint8Array.of(9)), wrappedLog(1, 5, cellValue(Uint8Array.of(4, 5)))];
      const transactions = [
        systemTransaction(subject.ledger),
        contract.deploy,
        callTransaction(raw, contract, logProgram(logged)),
        callTransaction(raw, contract, logProgram([cellValue(Uint8Array.of(3))]), FAILING_PROGRAM),
        zswapOutputTransaction(raw),
      ];
      const input = block(transactions);
      const start = adapter.emptyState();
      const rootBefore = hex(adapter.stateRoot(start));
      const { state, output } = adapter.apply(start, input);
      expect(hex(adapter.stateRoot(start)), "apply leaves the state it is given as it was").toBe(rootBefore);

      const reference = referenceReplay(raw, raw.LedgerState.blank(NETWORK_ID), input);
      expect(reference.types).toEqual(["system", "success", "success", "partialSuccess", "success"]);
      expect(hex(adapter.stateRoot(state))).toBe(hex(raw.stateRoot(reference.state)));
      expect(hex(output.parameters)).toBe(hex(reference.state.parameters.serialize()));

      expect(output.results).toEqual([
        { outcome: "success", segments: [] },
        { outcome: "success", segments: allSegments([0, 1], true) },
        { outcome: "success", segments: allSegments([0, 1], true) },
        { outcome: "partial", segments: [{ segment: 0, success: true }, { segment: 1, success: false }] },
        { outcome: "success", segments: allSegments([0], true) },
      ]);

      const where = output.events.map((event) => [
        event.transaction,
        event.kind,
        event.logicalSegment,
        event.physicalSegment,
      ]);
      expect(where).toEqual([
        [1, "contract-deploy", 0, 1],
        [4, "zswap-output", 0, 0],
      ]);
      const [deployed, zswap] = output.events;
      expect(deployed!.contractAddress).toEqual(contract.address);
      expect([deployed!.nullifier, deployed!.commitment, deployed!.treeIndex]).toEqual([null, null, null]);
      const zswapEvent = raw.Event.deserialize(zswap!.bytes);
      expect(zswapEvent.content.tag).toBe("zswapOutput");
      const content = zswapEvent.content as { commitment: string; mtIndex: bigint };
      expect(zswap!.commitment).toEqual(fromHex(content.commitment));
      expect(zswap!.treeIndex).toBe(content.mtIndex);
      expect([zswap!.nullifier, zswap!.contractAddress]).toEqual([null, null]);
      for (const event of output.events) {
        expect(Buffer.from(event.bytes.subarray(0, 15)).toString("latin1")).toBe("midnight:event[");
      }

      if (subject.logs === "none") {
        expect(reference.events[2]).toEqual(["ContractLog", "ContractLog"]);
        expect(output.logs).toEqual([]);
      } else {
        const v9 = RAW.v9;
        const decoded = (encoded: (typeof logged)[number]): LogItem =>
          v9.decodeLogItem(v9.serializeStateValue(v9.StateValue.decode(encoded)))!;
        const origin = { address: contract.address, entryPoint: utf8("emit"), logicalSegment: 0, physicalSegment: 1 };
        expect(output.logs).toEqual([
          { ...decoded(logged[0]!), transaction: 2, index: 0, ...origin },
          { ...decoded(logged[1]!), transaction: 2, index: 1, ...origin },
          { ...decoded(cellValue(Uint8Array.of(3))), transaction: 3, index: 2, ...origin },
        ]);
        expect(output.logs.map((log) => [log.version, log.eventType])).toEqual([
          [0, "Misc"],
          [1, "UnshieldedReceive"],
          [0, "Misc"],
        ]);
      }
      expect(plainEverywhere(output)).toBe(true);
      expect(structuredClone(output)).toEqual(output);
    });

    it("an empty block changes only what the post-block update changes, as the reference replay does", {
      timeout: LONG,
    }, () => {
      const input = block([], { height: 5n, timestampMs: BigInt(T0 + 30_000), parentTimestampMs: BigInt(T0 + 24_000) });
      const { state, output } = adapter.apply(adapter.emptyState(), input);
      expect(output.results).toEqual([]);
      expect(output.events).toEqual([]);
      expect(output.logs).toEqual([]);
      const reference = referenceReplay(raw, raw.LedgerState.blank(NETWORK_ID), input);
      expect(hex(adapter.stateRoot(state))).toBe(hex(raw.stateRoot(reference.state)));
      // The post-block update is given the block's fullness, zero here, never the package's default of one half.
      const halfFull = raw.LedgerState.blank(NETWORK_ID).postBlockUpdate(new Date(T0 + 30_000));
      expect(hex(adapter.stateRoot(state))).not.toBe(hex(raw.stateRoot(halfFull)));
    });

    it("a transaction the ledger fails, or that is malformed, leaves the state as it was", {
      timeout: LONG,
    }, async () => {
      const contract = await contractFixture(raw);
      const failing = callTransaction(raw, contract, FAILING_PROGRAM.slice(1));
      const expired = (await contractFixture(raw, T0 - 1_000)).deploy;
      const deployed = adapter.apply(adapter.emptyState(), block([contract.deploy])).state;
      const next = block([failing, expired], {
        height: 2n,
        timestampMs: BigInt(T0 + 6_000),
        parentTimestampMs: BigInt(T0),
      });
      const { state, output } = adapter.apply(deployed, next);
      expect(output.results).toEqual([
        { outcome: "failure", segments: allSegments([0, 1], false) },
        { outcome: "failure", segments: allSegments([0, 1], false) },
      ]);
      expect([output.events, output.logs]).toEqual([[], []]);
      const unchanged = adapter.apply(deployed, { ...next, transactions: [] }).state;
      expect(hex(adapter.stateRoot(state))).toBe(hex(adapter.stateRoot(unchanged)));
    });

    it("reports every segment of a successful transaction with two segments", { timeout: LONG }, async () => {
      const two = await twoSegmentDeploy(raw);
      const { output } = adapter.apply(adapter.emptyState(), block([two.bytes]));
      expect(output.results).toEqual([{ outcome: "success", segments: allSegments([0, 1, 2], true) }]);
      expect(output.events.map((event) => [event.kind, event.physicalSegment, hex(event.contractAddress!)])).toEqual([
        ["contract-deploy", 1, hex(two.addresses[0])],
        ["contract-deploy", 2, hex(two.addresses[1])],
      ]);
    });

    it("throws when a system transaction fails, or when the block's fullness exceeds the block limits", {
      timeout: LONG,
    }, async () => {
      const failing = block([zswapOutputTransaction(raw), failingSystemTransaction(subject.ledger)]);
      expect(() => adapter.apply(adapter.emptyState(), failing)).toThrow(/system transaction 1 of block 1 failed/);
      // 20 deploys write more than the block limit of 50,000 bytes.
      const deploys = await Promise.all(
        Array.from({ length: 20 }, () => contractFixture(raw).then((fixture) => fixture.deploy)),
      );
      expect(() => adapter.apply(adapter.emptyState(), block(deploys, { height: 7n }))).toThrow(
        /block 7's fullness exceeds the block limits/,
      );
    });
  });

  describe(`${subject.ledger} adapter: the replay rules (LG-8)`, () => {
    // An intent whose TTL is 3 s beyond the block time + `global_ttl` is malformed at the block time and well formed at
    // the parent block's timestamp + 12 s (6 s after the block time here). The ledger's own replay protection then
    // fails it at the block time (`IntentTtlTooFarInFuture`), so its outcome is a failure either way; which times it
    // was checked at shows the rule, as the reference replay's outcomes show the rest.
    const far = (): Promise<Uint8Array> =>
      contractFixture(raw, T0 + GLOBAL_TTL_MS + 3_000).then((fixture) => fixture.deploy);
    const outcomes = (output: ApplyOutput): string[] => output.results.map((result) => result.outcome);
    const skewed = { firstRegularAtParentTime: true };

    /** The times, relative to the block time, at which `apply` checked each regular transaction's well-formedness. */
    function checkedAt(run: () => void): number[] {
      const spy = vi.spyOn(raw.Transaction.prototype, "wellFormed");
      try {
        run();
        return spy.mock.calls.map((call) => (call[2] as Date).getTime() - T0);
      } finally {
        spy.mockRestore();
      }
    }

    it("checks a first regular transaction malformed at the block time again at the parent's time + 12 s only where the runtime skewed it", {
      timeout: LONG,
    }, async () => {
      const tx = await far();
      expect(checkedAt(() => adapter.apply(adapter.emptyState(), block([tx], skewed)))).toEqual([0, 6_000]);
      const unskewed = { firstRegularAtParentTime: false };
      expect(checkedAt(() => adapter.apply(adapter.emptyState(), block([tx], unskewed)))).toEqual([0]);
      const ok = (await contractFixture(raw)).deploy;
      expect(checkedAt(() => adapter.apply(adapter.emptyState(), block([ok], skewed)))).toEqual([0]);
    });

    it("keeps the parent's time for the regular transactions before the first to apply, and only for those", {
      timeout: LONG,
    }, async () => {
      const expired = (await contractFixture(raw, T0 - 1_000)).deploy;
      const ok = (await contractFixture(raw)).deploy;
      const [first, second] = [await far(), await far()];
      const input = block([expired, systemTransaction(subject.ledger), first, ok, second], skewed);
      let output: ApplyOutput | undefined;
      const times = checkedAt(() => (output = adapter.apply(adapter.emptyState(), input).output));
      expect(times).toEqual([0, 6_000, 0, 6_000, 0, 0]);
      expect(outcomes(output!)).toEqual(["failure", "success", "failure", "success", "failure"]);
      const reference = referenceReplay(raw, raw.LedgerState.blank(NETWORK_ID), input);
      expect(reference.types).toEqual(["malformed", "system", "failure", "success", "malformed"]);
      const after = adapter.apply(adapter.emptyState(), input).state;
      expect(hex(adapter.stateRoot(after))).toBe(hex(raw.stateRoot(reference.state)));
    });
  });

  describe(`${subject.ledger} adapter: contract logs (CC-2, CC-3, Q54)`, () => {
    if (subject.logs === "none") {
      it("decodeLogItem returns null for every input and apply returns no logs (Q54)", { timeout: LONG }, async () => {
        await expectNoV8Logs(adapter);
      });
    } else {
      it("decodeLogItem is the VM's own decoding", () => {
        for (const value of logValueInputs()) expect(adapter.decodeLogItem(value)).toEqual(RAW.v9.decodeLogItem(value));
        expect(adapter.decodeLogItem(logValueInputs()[0]!)!.eventType).toBe("UnshieldedReceive");
        expect(() => adapter.decodeLogItem(Uint8Array.of(1, 2, 3))).toThrow();
      });
    }
  });

  describe(`${subject.ledger} adapter: in a worker thread (LG-7, Q49)`, () => {
    it("gives in a fresh worker the same plain data as here, and it crosses threads by structured clone unchanged", {
      timeout: WORKER,
    }, async () => {
      const contract = await contractFixture(raw);
      const call = callTransaction(raw, contract, logProgram([cellValue(Uint8Array.of(8))]));
      const blocks = [
        block([systemTransaction(subject.ledger), contract.deploy]),
        block([call, zswapOutputTransaction(raw)], {
          height: 2n,
          timestampMs: BigInt(T0 + 6_000),
          parentTimestampMs: BigInt(T0),
        }),
      ];
      let state = adapter.emptyState();
      const here: Replayed = { parsed: [], outputs: [], roots: [], stateKey: new Uint8Array() };
      for (const input of blocks) {
        here.parsed.push(
          input.transactions.map((bytes, index): ParsedTransaction => adapter.parseTransaction(bytes, index)),
        );
        const applied = adapter.apply(state, input);
        here.outputs.push(applied.output);
        here.roots.push(adapter.stateRoot(applied.state));
        state = applied.state;
      }
      here.stateKey = adapter.stateKey(state);
      const there = await host.run<Replayed>({ op: "replay", ledger: subject.ledger, networkId: NETWORK_ID, blocks });
      expect(there.error).toBeUndefined();
      expect(there.result).toEqual(here);
      expect(structuredClone(here)).toEqual(here);
      expect(plainEverywhere(here)).toBe(true);
    });
  });

  describe(`${subject.ledger} adapter: what the interface gives each version`, () => {
    it(subject.ledger === "v9" ? "has convertFromV8 (LG-9)" : "has no convertFromV8 (v9 only)", () => {
      expect(typeof adapter.convertFromV8).toBe(subject.ledger === "v9" ? "function" : "undefined");
    });

    it("parses with the markers a transaction's own tag names", { timeout: LONG }, async () => {
      const contract = await contractFixture(raw);
      const proven = (): ReturnType<typeof raw.Transaction.deserialize> =>
        raw.Transaction.deserialize("signature", "proof", "binding", contract.deploy);
      const segments = adapter.parseTransaction(contract.deploy, 0).segments;
      expect(markersOf(contract.deploy)).toEqual(["signature", "proof", "binding"]);
      const erased = proven().eraseProofs().serialize();
      expect(markersOf(erased)).toEqual(["signature", "no-proof", "no-binding"]);
      expect(adapter.parseTransaction(erased, 0).segments).toEqual(segments);
      expect(adapter.nativeTransaction(erased)).toBeInstanceOf(raw.Transaction);
      const unsigned = proven().eraseSignatures().serialize();
      const unsignedTag = Buffer.from(unsigned.subarray(0, 40)).toString("latin1");
      expect(unsignedTag).toMatch(/^midnight:transaction\[v[0-9]+\]\(\(\),proof,/);
      expect(adapter.parseTransaction(unsigned, 0).segments).toEqual(segments);
      const unproven = unprovenDeploy(raw);
      expect(Buffer.from(unproven.subarray(0, 90)).toString("latin1")).toMatch(/proof-preimage,embedded-fr\[v1\]\)/);
      expect(adapter.parseTransaction(unproven, 0).segments).toHaveLength(1);
    });
  });
}
