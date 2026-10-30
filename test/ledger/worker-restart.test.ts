import { afterAll, describe, expect, it } from "vitest";
import { loadLedgerPackage } from "../../src/ledger/load.js";
import type { LedgerPackage, StoredNode } from "../../src/ledger/types.js";
import { type ApplyBlock, type BlockId, EvictionRefused, isEvictionRefused, LedgerEngine } from "../../src/ledger/worker/engine.js";
import { errorOf, inThreadLedger, type LedgerHost, LedgerWorkerFailure, startLedgerWorker } from "../../src/ledger/worker/host.js";
import { hex, NETWORK_ID, RAW, T0, zswapOutputTransaction } from "./adapter-fixtures.js";
import type { TestLoaderData } from "./fixtures/ledger-test-loader.js";

// The ledger worker is restarted (its thread ended and a new one started, `LedgerHost.restart`) when the package still
// refuses an eviction after the worker freed what it can (`EvictionRefused`). The new thread:
// - holds no state: the next block's state at h − 1 is loaded from the database through the bridge;
// - is sent again the parses kept for blocks not released yet, and answers a parse that was in flight;
// - fails any other request that was in flight.
//
// The main thread's engine (`inThreadLedger`) restarts the same way. Runs in real threads over the real v9 package,
// with the test loader recording what each thread parsed. [LG-14, Q144 B; design §5.3, §5.4]

const LONG = 240_000;
const LOADER = new URL("./fixtures/ledger-test-loader.ts", import.meta.url);
const hash = (byte: number): Uint8Array => new Uint8Array(32).fill(byte);
const at = (height: bigint): BlockId => ({ height, hash: hash(Number(height) + 1) });
const hosts: LedgerHost[] = [];
const started = (data?: TestLoaderData): LedgerHost => {
  const host = startLedgerWorker({ loader: LOADER, ...(data === undefined ? {} : { loaderData: data }) });
  hosts.push(host);
  return host;
};
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

/** A read handle over the nodes written so far, as the bridge queries `core_ledger_state.nodes`. */
function reader(stored: ReadonlyMap<string, StoredNode>) {
  return {
    async query(_sql: string, params: unknown[] = []): Promise<Record<string, unknown>[]> {
      return (params[0] as Uint8Array[]).map(hex).flatMap((k) => {
        const node = stored.get(k);
        return node === undefined ? [] : [{ node_key: node.key, data: node.data, children: node.children }];
      });
    },
  };
}

const parsedIn = async (host: LedgerHost): Promise<string[]> => ((await host.probe()) as { deserialized: Uint8Array[] }).deserialized.map(hex);

describe("the ledger worker's restart (task 12.5a; LG-14, Q144 B)", () => {
  it("starts a new thread holding no state, sends it the kept parses again, answers a parse in flight there and fails any other request in flight; the state at h − 1 loads through the bridge and h applies as without the restart", { timeout: LONG }, async () => {
    const heartbeat = new SharedArrayBuffer(4 * 8);
    const beats = new Int32Array(heartbeat);
    const host = started({ count: true, heartbeat });
    const engine = new LedgerEngine({ load: loadLedgerPackage });
    const nodes = new Map<string, StoredNode>();
    const read = reader(nodes);
    const two = [zswapOutputTransaction(RAW.v9)];
    const three = [zswapOutputTransaction(RAW.v9)];
    // Blocks 0 and 1 in the worker (their nodes written), and in this thread's engine for the reference.
    for (const applied of [await host.genesis(genesisInput(), read), await engine.genesis(genesisInput())]) {
      for (const node of applied.batch.inserts) nodes.set(hex(node.key), node);
    }
    await host.commit(at(0n));
    engine.commit(at(0n));
    const one = [zswapOutputTransaction(RAW.v9)];
    await host.parse("v9", at(1n), one);
    const appliedOne = await host.apply(applyBlock(1n, 1), read);
    for (const node of appliedOne.batch.inserts) nodes.set(hex(node.key), node);
    await host.commit(at(1n));
    expect(await host.release({ upTo: 1n })).toBe(1);
    await engine.parse("v9", at(1n), one);
    await engine.apply(applyBlock(1n, 1));
    engine.commit(at(1n));

    // Block 2 parsed and kept; block 3's parse and a probe still in flight when the thread is restarted.
    await host.parse("v9", at(2n), two);
    expect(await parsedIn(host)).toEqual([...one, ...two].map(hex));
    const parsingThree = host.parse("v9", at(3n), three);
    const probing = host.probe().then(
      () => null,
      (error: unknown) => error,
    );
    await host.restart();
    expect(host.restarts).toBe(1);
    expect(host.failure).toBeNull();
    expect(String(await probing)).toMatch(/restarted while its probe request ran/);
    expect((await parsingThree).map((t) => hex(t.hash))).toEqual((await engine.parse("v9", at(3n), three)).map((t) => hex(t.hash)));
    // A new thread: it parsed blocks 2 and 3 once each (sent again, the in-flight one answered there), nothing else.
    expect(await parsedIn(host)).toEqual([...two, ...three].map(hex));
    // The thread that ended runs no more; the new one does (each beats while it runs, once it loaded a package).
    expect(Atomics.load(beats, 0)).toBe(2);
    const ended = Atomics.load(beats, 1);
    const running = Atomics.load(beats, 2);
    await new Promise((resolve) => setTimeout(resolve, 200));
    expect(Atomics.load(beats, 1)).toBe(ended);
    expect(Atomics.load(beats, 2)).toBeGreaterThan(running);
    // It holds no state: block 2 is refused until the state at 1 is loaded, through the bridge, from the stored nodes.
    await expect(host.apply(applyBlock(2n, 1), read)).rejects.toThrow(/holds no state/);
    const before = host.bridge().requests;
    expect(await host.load({ ledger: "v9", ...at(1n), stateKey: appliedOne.stateKey }, read)).toEqual({ stateRoot: appliedOne.stateRoot, loaded: true });
    expect(host.bridge().requests).toBeGreaterThan(before);
    // Block 2 applies on it, with its kept parse, as the uninterrupted engine applies it.
    await engine.parse("v9", at(2n), two);
    const reference = await engine.apply(applyBlock(2n, 1));
    const again = await host.apply(applyBlock(2n, 1), read);
    expect(hex(again.stateRoot)).toBe(hex(reference.stateRoot));
    expect(hex(again.stateKey)).toBe(hex(reference.stateKey));
    expect(again.output).toEqual(reference.output);
    expect(await parsedIn(host)).toEqual([...two, ...three].map(hex));

    // A released parse is not sent again: after block 2's release and another restart, only block 3's is kept.
    await host.commit(at(2n));
    expect(await host.release({ upTo: 2n })).toBe(1);
    const bridged = host.bridge();
    expect(bridged.requests).toBeGreaterThan(0);
    await host.restart();
    expect(host.restarts).toBe(2);
    // The bridge's counts go on across the threads.
    expect(host.bridge()).toEqual(bridged);
    expect(await parsedIn(host)).toEqual(three.map(hex));
    // So are the parses a release names by hash.
    await host.release({ hashes: [at(3n).hash] });
    await host.restart();
    expect(await parsedIn(host)).toEqual([]);
    expect(host.failure).toBeNull();
  });

  it("is refused once the worker failed or was closed", { timeout: LONG }, async () => {
    const failed = started({ exitAt: "1" });
    await failed.genesis(genesisInput(), reader(new Map()));
    await failed.commit(at(0n));
    await failed.parse("v9", at(1n), []);
    await expect(failed.apply(applyBlock(1n, 0))).rejects.toBeInstanceOf(LedgerWorkerFailure);
    await expect(failed.restart()).rejects.toBeInstanceOf(LedgerWorkerFailure);
    const closed = started();
    await closed.close();
    await expect(closed.restart()).rejects.toThrow(/closed/);
  });

  it("restarts the main thread's engine alike: a new engine holding no state, given the kept parses again", { timeout: LONG }, async () => {
    const host = inThreadLedger();
    await host.genesis(genesisInput());
    await host.commit(at(0n));
    await host.parse("v9", at(1n), [zswapOutputTransaction(RAW.v9)]);
    await host.restart();
    expect(host.restarts).toBe(1);
    await expect(host.apply(applyBlock(1n, 1))).rejects.toThrow(/holds no state/);
    // Block 0 again on the new engine, then block 1 with the parse sent again.
    await host.genesis(genesisInput());
    await host.commit(at(0n));
    expect((await host.apply(applyBlock(1n, 1))).output.results.map((r) => r.outcome)).toEqual(["success"]);
    await host.close();
    await expect(host.restart()).rejects.toThrow(/closed/);
  });

  it("names a refusal after the worker freed what it can, keeps that name across the threads, and never retries a trap", async () => {
    const refused = new EvictionRefused("still held");
    expect(isEvictionRefused(refused)).toBe(true);
    expect(isEvictionRefused(errorOf({ name: refused.name, message: refused.message }))).toBe(true);
    expect(isEvictionRefused(new Error("still held"))).toBe(false);
    expect(isEvictionRefused("EvictionRefused")).toBe(false);
    // An adapter whose eviction traps: the trap is thrown as it is, not retried, not named a refusal.
    let tries = 0;
    const trapping = { ledger: "v9", evict: () => { tries += 1; throw new WebAssembly.RuntimeError("unreachable"); }, forgetTransactions: () => undefined } as unknown as LedgerPackage;
    const engine = new LedgerEngine({ load: async () => trapping });
    await engine.genesisRoot("v9", new Uint8Array()).catch(() => undefined);
    await expect(engine.evict([hash(9)])).rejects.toBeInstanceOf(WebAssembly.RuntimeError);
    expect(tries).toBe(1);
    // An adapter that refuses twice: the second refusal is an EvictionRefused naming the package's message.
    let refusals = 0;
    const refusing = { ledger: "v9", evict: () => { refusals += 1; throw new Error("still held by a live object"); }, forgetTransactions: () => undefined } as unknown as LedgerPackage;
    const other = new LedgerEngine({ load: async () => refusing });
    await other.genesisRoot("v9", new Uint8Array()).catch(() => undefined);
    const error = await other.evict([hash(9)]).catch((thrown: unknown) => thrown);
    expect(isEvictionRefused(error)).toBe(true);
    expect((error as Error).message).toMatch(/still held by a live object/);
    expect(refusals).toBe(2);
    // An adapter whose second try traps: the trap, not a refusal.
    let second = 0;
    const thenTraps = {
      ledger: "v9",
      evict: () => {
        second += 1;
        if (second === 1) throw new Error("still held by a live object");
        throw new WebAssembly.RuntimeError("unreachable");
      },
      forgetTransactions: () => undefined,
    } as unknown as LedgerPackage;
    const third = new LedgerEngine({ load: async () => thenTraps });
    await third.genesisRoot("v9", new Uint8Array()).catch(() => undefined);
    await expect(third.evict([hash(9)])).rejects.toBeInstanceOf(WebAssembly.RuntimeError);
  });
});
