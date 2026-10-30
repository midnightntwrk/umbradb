import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { loadLedgerPackage } from "../../src/ledger/load.js";
import type { StoredNode } from "../../src/ledger/types.js";
import { type ApplyBlock, type BlockId, LedgerEngine } from "../../src/ledger/worker/engine.js";
import { errorOf, inThreadLedger, type LedgerHost, LedgerWorkerFailure, startLedgerWorker } from "../../src/ledger/worker/host.js";
import { BACKENDS, type TestBackend } from "../db/backends.js";
import {
  callTransaction,
  cellValue,
  contractFixture,
  hex,
  logProgram,
  NETWORK_ID,
  RAW,
  systemTransaction,
  T0,
  zswapOutputTransaction,
} from "./adapter-fixtures.js";
import type { TestLoaderData } from "./fixtures/ledger-test-loader.js";

// The ledger worker (a worker thread running the engine of `worker-engine.test.ts`) and the node-store bridge, through
// which the worker reads stored nodes synchronously from a database the main thread owns. What crosses is plain data.
// A crash of the thread, or a trap of the package, fails every request from then on. A request's step is reported
// while it runs. [LG-7, LG-10, LG-11; design §5.3]

const LONG = 240_000;
const LOADER = new URL("./fixtures/ledger-test-loader.ts", import.meta.url);
const hash = (byte: number): Uint8Array => new Uint8Array(32).fill(byte);
const at = (height: bigint): BlockId => ({ height, hash: hash(Number(height) + 1) });
const hosts: LedgerHost[] = [];
const started = (data?: TestLoaderData, bridgeBytes?: number): LedgerHost => {
  const host = startLedgerWorker({ loader: LOADER, ...(data === undefined ? {} : { loaderData: data }), ...(bridgeBytes === undefined ? {} : { bridgeBytes }) });
  hosts.push(host);
  return host;
};
afterAll(async () => {
  await Promise.all(hosts.map((host) => host.close()));
});

const genesisInput = (genesisState: Uint8Array, transactions = 0) => ({
  ledger: "v9" as const,
  ...at(0n),
  parentHash: new Uint8Array(32),
  timestampMs: BigInt(T0),
  transactions,
  genesisState,
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

/** A reader over `stored` that answers after a turn of the event loop, as a database would; counts its queries. */
function mapReader(stored: ReadonlyMap<string, StoredNode>) {
  const queries: string[][] = [];
  return {
    queries,
    async query(_sql: string, params: unknown[] = []): Promise<Record<string, unknown>[]> {
      await new Promise((resolve) => setImmediate(resolve));
      const keys = (params[0] as Uint8Array[]).map(hex);
      queries.push(keys);
      return keys.flatMap((k) => {
        const node = stored.get(k);
        return node === undefined ? [] : [{ node_key: node.key, data: node.data, children: node.children }];
      });
    },
  };
}

describe("the ledger worker (design §5.3; LG-7, LG-10)", () => {
  it("parses and applies in its thread, giving the engine's plain data and parsing each transaction once", { timeout: LONG }, async () => {
    const host = started({ count: true });
    const engine = new LedgerEngine({ load: loadLedgerPackage });
    const genesis = RAW.v9.LedgerState.blank(NETWORK_ID).serialize();
    const contract = await contractFixture(RAW.v9);
    const transactions = [
      systemTransaction("v9"),
      contract.deploy,
      callTransaction(RAW.v9, contract, logProgram([cellValue(Uint8Array.of(5))])),
      zswapOutputTransaction(RAW.v9),
    ];
    const [workerZero, threadZero] = await Promise.all([host.genesis(genesisInput(genesis)), engine.genesis(genesisInput(genesis))]);
    expect(workerZero).toEqual(threadZero);
    await host.commit(at(0n));
    engine.commit(at(0n));
    const parsed = await host.parse("v9", at(1n), transactions);
    expect(parsed).toEqual(await engine.parse("v9", at(1n), transactions));
    for (const transaction of parsed) expect(Object.getPrototypeOf(transaction)).toBe(Object.prototype);
    const applied = await host.apply(applyBlock(1n, 4));
    expect(applied).toEqual(await engine.apply(applyBlock(1n, 4)));
    expect(applied.output.logs).toHaveLength(1);
    const { deserialized } = (await host.probe()) as { deserialized: Uint8Array[] };
    expect(deserialized.map(hex)).toEqual(transactions.map(hex));
    expect(host.activity()).toBeNull();
    expect(host.failure).toBeNull();
  });

  it("reports the step it runs while it runs, and nothing after (LG-10)", { timeout: LONG }, async () => {
    const host = started({ slowAt: { height: "1", ms: 1_500 } });
    await host.genesis(genesisInput(RAW.v9.LedgerState.blank(NETWORK_ID).serialize()));
    await host.commit(at(0n));
    const applying = host.apply(applyBlock(1n, 0));
    await new Promise((resolve) => setTimeout(resolve, 300));
    const activity = host.activity();
    expect(activity).toMatchObject({ kind: "apply", height: 1n });
    expect(activity?.sinceMs).toBeGreaterThanOrEqual(200);
    await applying;
    expect(host.activity()).toBeNull();
    const { hold } = (await host.probe()) as { hold: { start: string; end: string } };
    expect(BigInt(hold.end) - BigInt(hold.start)).toBeGreaterThanOrEqual(1_500_000_000n);
  });

  it("times a step from when it began, not from when it was sent behind another (LG-10)", { timeout: LONG }, async () => {
    const host = started({ slowAt: [{ height: "1", ms: 3_000 }, { height: "2", ms: 3_000 }, { height: "3", ms: 1_000 }] });
    await host.genesis(genesisInput(RAW.v9.LedgerState.blank(NETWORK_ID).serialize()));
    await host.commit(at(0n));
    // Sent together: the apply of 2 waits in the worker behind the apply of 1 (3 s) and the commit of 1.
    const first = host.apply(applyBlock(1n, 0));
    const committing = host.commit(at(1n));
    const second = host.apply(applyBlock(2n, 0));
    second.catch(() => undefined);
    await first;
    await committing;
    await new Promise((resolve) => setTimeout(resolve, 300));
    const activity = host.activity();
    expect(activity).toMatchObject({ kind: "apply", height: 2n });
    // About 300 ms; counted from when it was sent, it would be 3.3 s or more.
    expect(activity?.sinceMs).toBeGreaterThanOrEqual(200);
    expect(activity?.sinceMs).toBeLessThan(2_500);
    await second;
    expect(host.activity()).toBeNull();
    // Sent to an idle worker 600 ms after its last answer: it begins when sent.
    await host.commit(at(2n));
    await new Promise((resolve) => setTimeout(resolve, 600));
    const third = host.apply(applyBlock(3n, 0));
    expect(host.activity()?.sinceMs).toBeLessThan(300);
    await third;
  });

  it("fails every request once its thread ends, and names why (a halt of the step that used it)", { timeout: LONG }, async () => {
    const host = started({ exitAt: "1" });
    await host.genesis(genesisInput(RAW.v9.LedgerState.blank(NETWORK_ID).serialize()));
    await host.commit(at(0n));
    const error = await host.apply(applyBlock(1n, 0)).catch((e: unknown) => e);
    expect(error).toBeInstanceOf(LedgerWorkerFailure);
    expect((error as Error).message).toMatch(/exited with code 3/);
    expect(host.failure).toBe(error);
    await expect(host.parse("v9", at(2n), [])).rejects.toBe(error);
    await expect(host.commit(at(1n))).rejects.toBe(error);
  });

  it("ends its thread when the package traps, so nothing runs on a module in an unknown state", { timeout: LONG }, async () => {
    const host = started({ trapAt: "1" });
    await host.genesis(genesisInput(RAW.v9.LedgerState.blank(NETWORK_ID).serialize()));
    await host.commit(at(0n));
    const error = await host.apply(applyBlock(1n, 0)).catch((e: unknown) => e);
    expect(error).toBeInstanceOf(LedgerWorkerFailure);
    expect((error as Error).message).toMatch(/RuntimeError: unreachable/);
    await expect(host.probe()).rejects.toBe(error);
  });

  it("keeps working after a request that failed without a trap, and after a failed load of a package", { timeout: LONG }, async () => {
    const failing = started({ failLoad: true });
    await expect(failing.parse("v9", at(1n), [zswapOutputTransaction(RAW.v9)])).rejects.toThrow(/refuses to load/);
    expect(failing.failure).toBeNull();
    const host = started();
    await expect(host.apply(applyBlock(1n, 0))).rejects.toThrow(/holds no state/);
    expect(host.failure).toBeNull();
    await host.genesis(genesisInput(RAW.v9.LedgerState.blank(NETWORK_ID).serialize()));
  });

  it("fails at once when its thread cannot start (its loader does not load)", { timeout: LONG }, async () => {
    const host = startLedgerWorker({ loader: new URL("./fixtures/no-such-loader.ts", import.meta.url) });
    hosts.push(host);
    const error = await host.genesisRoot("v9", RAW.v9.LedgerState.blank(NETWORK_ID).serialize()).catch((e: unknown) => e);
    expect(error).toBeInstanceOf(LedgerWorkerFailure);
    expect((error as Error).message).toMatch(/^the ledger worker failed: .*no-such-loader/);
  });

  it("answers a genesis state's root and a release, and fails the requests in flight when closed", { timeout: LONG }, async () => {
    const host = started({ slowAt: { height: "1", ms: 2_000 } });
    const genesis = RAW.v9.LedgerState.blank(NETWORK_ID).serialize();
    expect(hex(await host.genesisRoot("v9", genesis))).toBe(hex(RAW.v9.stateRoot(RAW.v9.LedgerState.blank(NETWORK_ID))));
    expect(await host.release({ upTo: 5n })).toBe(0);
    await host.genesis(genesisInput(genesis));
    await host.commit(at(0n));
    const applying = host.apply(applyBlock(1n, 0)).catch((e: unknown) => e);
    expect(host.activity()).toMatchObject({ kind: "apply", height: 1n });
    await host.close();
    expect(((await applying) as Error).message).toMatch(/closed/);
    expect(host.failure).toBeNull();
  });

  it("refuses requests once closed; closing twice is closing once", async () => {
    const host = started();
    const closing = host.close();
    expect(host.close()).toBe(closing);
    await closing;
    await expect(host.parse("v9", at(1n), [])).rejects.toThrow(/closed/);
  });

  it("names a worker's error by its class", () => {
    expect(errorOf({ name: "RangeError", message: "r" })).toBeInstanceOf(RangeError);
    expect(errorOf({ name: "TypeError", message: "t" })).toBeInstanceOf(TypeError);
    const custom = errorOf({ name: "UmbraError", message: "u" });
    expect([custom.constructor, custom.name, custom.message]).toEqual([Error, "UmbraError", "u"]);
    expect(errorOf({ name: "Error", message: "e" }).name).toBe("Error");
  });

  it("on the main thread (a negative control's ledger) does the same work, but cannot read stored nodes", { timeout: LONG }, async () => {
    const host = inThreadLedger();
    hosts.push(host);
    const genesis = RAW.v9.LedgerState.blank(NETWORK_ID).serialize();
    expect(hex(await host.genesisRoot("v9", genesis))).toBe(hex(RAW.v9.stateRoot(RAW.v9.LedgerState.blank(NETWORK_ID))));
    expect(host.activity()).toBeNull();
    const pendingZero = host.genesis(genesisInput(genesis));
    expect(host.activity()).toBeNull();
    const zero = await pendingZero;
    expect(await host.commit(at(0n))).toBe(true);
    expect(await host.release({ upTo: 0n })).toBe(0);
    expect(host.bridge()).toEqual({ requests: 0, nodes: 0 });
    expect(host.failure).toBeNull();
    await host.parse("v9", at(1n), [zswapOutputTransaction(RAW.v9)]);
    expect((await host.apply(applyBlock(1n, 1))).output.results.map((r) => r.outcome)).toEqual(["success"]);
    // The state it holds is kept (nothing to read); any other one would have to be read, which it cannot.
    expect(await host.load({ ledger: "v9", ...at(0n), stateKey: zero.stateKey }, mapReader(new Map()))).toEqual({ stateRoot: zero.stateRoot, loaded: false });
    await expect(host.load({ ledger: "v9", ...at(0n), stateKey: new Uint8Array(32).fill(7) }, mapReader(new Map()))).rejects.toThrow(/main thread/);
    await expect(host.retained({ ledger: "v9", ...at(0n), stateKey: zero.stateKey }, mapReader(new Map()))).rejects.toThrow(/main thread/);
    expect(await host.probe()).toBeNull();
    // While a step runs, it is reported; once closed, nothing runs.
    let seen: unknown = null;
    const slow = inThreadLedger({
      load: async (ledger, options) => {
        seen = slow.activity();
        return loadLedgerPackage(ledger, options);
      },
    });
    await slow.genesisRoot("v9", genesis);
    expect(seen).toMatchObject({ kind: "genesis-root", height: 0n });
    await slow.close();
    await expect(slow.parse("v9", at(1n), [])).rejects.toThrow(/closed/);
  });
});

describe("the node-store bridge (design §5.3, LG-11): the worker reads stored nodes through the main thread", () => {
  /** The nodes of a v9 state with a contract and a zswap output, flushed in this thread: the store a writer wrote. */
  async function storedState(): Promise<{ stateKey: Uint8Array; stateRoot: Uint8Array; nodes: StoredNode[] }> {
    const engine = new LedgerEngine({ load: loadLedgerPackage });
    const zero = await engine.genesis(genesisInput(RAW.v9.LedgerState.blank(NETWORK_ID).serialize()));
    engine.commit(at(0n));
    const contract = await contractFixture(RAW.v9);
    const transactions = [contract.deploy, zswapOutputTransaction(RAW.v9)];
    await engine.parse("v9", at(1n), transactions);
    const one = await engine.apply(applyBlock(1n, 2));
    const nodes = new Map<string, StoredNode>();
    for (const node of [...zero.batch.inserts, ...one.batch.inserts]) nodes.set(hex(node.key), node);
    return { stateKey: one.stateKey, stateRoot: one.stateRoot, nodes: [...nodes.values()] };
  }

  it("loads a stored state in a fresh worker, its root node first, prefetching each node's referenced keys", { timeout: LONG }, async () => {
    const { stateKey, stateRoot, nodes } = await storedState();
    const reader = mapReader(new Map(nodes.map((node) => [hex(node.key), node])));
    const host = started();
    const loaded = await host.load({ ledger: "v9", ...at(1n), stateKey }, reader);
    expect(hex(loaded.stateRoot)).toBe(hex(stateRoot));
    expect(reader.queries[0]?.[0]).toBe(hex(stateKey));
    // The next block reads the state's nodes it needs through the bridge, each query with the referenced keys.
    await host.parse("v9", at(2n), [zswapOutputTransaction(RAW.v9)]);
    const before = reader.queries.length;
    const two = await host.apply(applyBlock(2n, 1), reader);
    expect(two.output.results.map((r) => r.outcome)).toEqual(["success"]);
    // Within one request no key is asked twice: a prefetched node is served from the worker's side.
    const asked = reader.queries.slice(before).flat();
    expect(asked.length).toBeGreaterThan(0);
    expect(new Set(asked).size).toBe(asked.length);
    // A miss brought the node's referenced nodes along (one statement for them): fewer requests than nodes sent.
    expect(reader.queries.some((keys) => keys.length > 1)).toBe(true);
    const { requests, nodes: sent } = host.bridge();
    expect(requests).toBeGreaterThan(0);
    expect(requests).toBeLessThan(sent);
  });

  it("grows its shared memory for a node larger than it", { timeout: LONG }, async () => {
    const { stateKey, stateRoot, nodes } = await storedState();
    const host = started(undefined, 64);
    const loaded = await host.load({ ledger: "v9", ...at(1n), stateKey }, mapReader(new Map(nodes.map((node) => [hex(node.key), node]))));
    expect(hex(loaded.stateRoot)).toBe(hex(stateRoot));
  });

  it("fails the request for a missing node, a request with no read, and a node that does not match its key", { timeout: LONG }, async () => {
    const { stateKey, nodes } = await storedState();
    const host = started();
    await expect(host.load({ ledger: "v9", ...at(1n), stateKey }, mapReader(new Map()))).rejects.toThrow(/has no node/);
    expect(host.failure).toBeNull();
    await expect(host.load({ ledger: "v9", ...at(1n), stateKey })).rejects.toThrow(/no read/);
    expect(host.failure).toBeNull();
    // A stored root whose bytes were changed: the package checks every node against its key and aborts. [LG-11]
    const tampered = new Map(nodes.map((node) => [hex(node.key), node]));
    const root = tampered.get(hex(stateKey)) as StoredNode;
    const data = Uint8Array.from(root.data);
    data[0] = (data[0] as number) ^ 0xff;
    tampered.set(hex(stateKey), { ...root, data });
    const error = await host.load({ ledger: "v9", ...at(1n), stateKey }, mapReader(tampered)).catch((e: unknown) => e);
    expect(error).toBeInstanceOf(LedgerWorkerFailure);
    expect(host.failure).toBe(error);
  });

  it("reads a request's nodes, given no read, through another request's read, the database, or a read that comes later", { timeout: LONG }, async () => {
    const { stateKey, stateRoot, nodes } = await storedState();
    const stored = new Map(nodes.map((node) => [hex(node.key), node]));
    const input = { ledger: "v9" as const, ...at(1n), stateKey };
    // Another request in flight with a read: the load, queued first in the worker, reads through the apply's read.
    const first = started();
    const theirs = mapReader(stored);
    const loading = first.load(input);
    const applying = first.apply(applyBlock(2n, 0), theirs).catch((e: unknown) => e);
    expect(hex((await loading).stateRoot)).toBe(hex(stateRoot));
    await applying;
    expect(theirs.queries[0]?.[0]).toBe(hex(stateKey));
    // The process's database, when no request has a read.
    const second = started();
    const database = mapReader(stored);
    second.useDatabase({ read: (body) => body(database) });
    expect(hex((await second.load(input)).stateRoot)).toBe(hex(stateRoot));
    expect(database.queries[0]?.[0]).toBe(hex(stateKey));
    // A database whose read cannot begin (PGlite's queue held by the read a later apply brings): that apply's read.
    const third = started();
    third.useDatabase({ read: () => new Promise(() => undefined) });
    const later = mapReader(stored);
    const waiting = third.load(input);
    await new Promise((resolve) => setTimeout(resolve, 200));
    const queued = third.apply(applyBlock(2n, 0), later).catch((e: unknown) => e);
    expect(hex((await waiting).stateRoot)).toBe(hex(stateRoot));
    await queued;
    expect(later.queries[0]?.[0]).toBe(hex(stateKey));
    // A database whose read fails: no node.
    const fourth = started();
    fourth.useDatabase({ read: async () => Promise.reject(new Error("closed")) });
    await expect(fourth.load(input)).rejects.toThrow(/has no node/);
    expect(fourth.failure).toBeNull();
  });

  describe.each(BACKENDS)("on $name", (backend: TestBackend) => {
    beforeAll(() => backend.start(), 180_000);
    afterAll(() => backend.stop(), 60_000);

    it("reads the nodes from a database through a read handle of the main thread", { timeout: LONG }, async () => {
      const { stateKey, stateRoot, nodes } = await storedState();
      const values = nodes
        .map((node) => `('\\x${hex(node.key)}', '\\x${hex(node.data)}', '\\x${hex(node.children)}')`)
        .join(",\n");
      const { db } = await backend.database(
        `CREATE SCHEMA core_ledger_state;
CREATE TABLE core_ledger_state.nodes (node_key bytea PRIMARY KEY, data bytea NOT NULL, children bytea NOT NULL);
INSERT INTO core_ledger_state.nodes VALUES ${values};`,
        async () => null,
      );
      try {
        const host = started();
        const loaded = await db.read((read) => host.load({ ledger: "v9", ...at(1n), stateKey }, read));
        expect(hex(loaded.stateRoot)).toBe(hex(stateRoot));
        await host.parse("v9", at(2n), [zswapOutputTransaction(RAW.v9)]);
        const two = await db.read((read) => host.apply(applyBlock(2n, 1), read));
        expect(two.output.results.map((r) => r.outcome)).toEqual(["success"]);
      } finally {
        await db.close();
      }
    });
  });
});
