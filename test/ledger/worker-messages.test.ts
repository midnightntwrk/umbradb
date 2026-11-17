import { afterEach, describe, expect, it } from "vitest";
import { loadLedgerPackage } from "../../src/ledger/load.js";
import type { StoredNode } from "../../src/ledger/types.js";
import { type ApplyBlock, type AppliedState, type BlockId, LedgerEngine } from "../../src/ledger/worker/engine.js";
import { type LedgerHost, startLedgerWorker } from "../../src/ledger/worker/host.js";
import { startTrace, stopTrace, traceEndBlock, type TraceSink } from "../../src/trace/trace.js";
import { addingUpProblems, sumOf, type WorkerLine } from "../trace/worker-time.js";
import { contractFixture, hex, NETWORK_ID, RAW, T0, zswapOutputTransaction } from "./adapter-fixtures.js";
import type { SeenMessage } from "./fixtures/message-spy-loader.js";

/**
 * The messages between the main thread and the ledger worker, seen in the worker's thread
 * (`./fixtures/message-spy-loader.ts`), for one sequence of requests that loads a stored state through the node-store
 * bridge and applies two blocks on it.
 * - Not traced: every message has the keys it had before the trace of the worker's time existed, and the worker posts
 *   answers and node requests only.
 * - Traced (`src/trace/trace.ts` started before the worker): the worker computes the same; each request, answer and
 *   node request also says when it was posted; the worker posts one entry per applied block, whose parts add up to its
 *   span and whose node waits are the bridge's requests; and the main thread's height gets each request type's round
 *   trips, the answers' way back and the node requests' times.
 */

const LONG = 240_000;
const SPY = new URL("./fixtures/message-spy-loader.ts", import.meta.url);
const hash = (byte: number): Uint8Array => new Uint8Array(32).fill(byte);
const at = (height: bigint): BlockId => ({ height, hash: hash(Number(height) + 1) });

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

/** A reader over `stored` that answers after a turn of the event loop, as a database would. */
function mapReader(stored: ReadonlyMap<string, StoredNode>) {
  return {
    async query(_sql: string, params: unknown[] = []): Promise<Record<string, unknown>[]> {
      await new Promise((resolve) => setImmediate(resolve));
      return (params[0] as Uint8Array[]).flatMap((key) => {
        const node = stored.get(hex(key));
        return node === undefined ? [] : [{ node_key: node.key, data: node.data, children: node.children }];
      });
    },
  };
}

/**
 * The nodes of a v9 state with a contract and a zswap output, after block 1, flushed in this thread; and block 2's
 * transaction, made once (a zswap output is random) so that every run of the sequence applies the same block.
 */
async function storedState(): Promise<{ stateKey: Uint8Array; nodes: Map<string, StoredNode>; next: Uint8Array }> {
  const engine = new LedgerEngine({ load: loadLedgerPackage });
  const zero = await engine.genesis({
    ledger: "v9",
    ...at(0n),
    parentHash: new Uint8Array(32),
    timestampMs: BigInt(T0),
    transactions: 0,
    genesisState: RAW.v9.LedgerState.blank(NETWORK_ID).serialize(),
    includesBlockZero: true,
  });
  engine.commit(at(0n));
  const contract = await contractFixture(RAW.v9);
  await engine.parse("v9", at(1n), [contract.deploy, zswapOutputTransaction(RAW.v9)]);
  const one = await engine.apply(applyBlock(1n, 2));
  const nodes = new Map<string, StoredNode>();
  for (const node of [...zero.batch.inserts, ...one.batch.inserts]) nodes.set(hex(node.key), node);
  return { stateKey: one.stateKey, nodes, next: zswapOutputTransaction(RAW.v9) };
}

function memorySink() {
  const kept = { blocks: "", worker: "" };
  const sink: TraceSink = {
    blocks: (text) => void (kept.blocks += text),
    statements: () => undefined,
    worker: (text) => void (kept.worker += text),
  };
  const lines = (text: string): WorkerLine[] => (text === "" ? [] : text.trimEnd().split("\n").map((line) => JSON.parse(line) as WorkerLine));
  return { sink, blocks: () => lines(kept.blocks), worker: () => lines(kept.worker) };
}

/** What one run of the sequence gave. */
interface Sequence {
  readonly applied: readonly AppliedState[];
  readonly seen: readonly SeenMessage[];
  readonly bridge: { readonly requests: number; readonly nodes: number };
}

const hosts: LedgerHost[] = [];
afterEach(async () => {
  stopTrace();
  await Promise.all(hosts.splice(0).map((host) => host.close()));
});

/** The sequence (see the module comment) on a new worker; `ended` runs once its last apply is answered. */
async function sequence(stored: Awaited<ReturnType<typeof storedState>>, ended: () => void = () => undefined): Promise<Sequence> {
  const reader = mapReader(stored.nodes);
  const host = startLedgerWorker({ loader: SPY });
  hosts.push(host);
  await host.load({ ledger: "v9", ...at(1n), stateKey: stored.stateKey }, reader);
  await host.parse("v9", at(2n), [stored.next]);
  const two = await host.apply(applyBlock(2n, 1), reader);
  expect(await host.commit(at(2n))).toBe(true);
  await host.release({ upTo: 2n });
  await host.parse("v9", at(3n), []);
  const three = await host.apply(applyBlock(3n, 0), reader);
  ended();
  const seen = (await host.probe()) as readonly SeenMessage[];
  return { applied: [two, three], seen, bridge: host.bridge() };
}

const REQUESTS = ["load", "parse", "apply", "commit", "release", "parse", "apply", "probe"];
const of = (seen: readonly SeenMessage[], way: SeenMessage["way"], type?: string): SeenMessage[] =>
  seen.filter((message) => message.way === way && (type === undefined || message.type === type));

describe("the messages between the main thread and the ledger worker", () => {
  it("not traced, carry what they carried, and the worker posts nothing but answers and node requests; traced, they also say when they were posted, and the worker's whole time is recorded", { timeout: LONG }, async () => {
    const stored = await storedState();

    const plain = await sequence(stored);
    expect(of(plain.seen, "in").map((message) => message.type)).toEqual(REQUESTS);
    for (const message of of(plain.seen, "in")) expect(message.keys).toEqual(["id", "request"]);
    // Every answer but the probe's own, which is posted after the probe ran.
    expect(of(plain.seen, "out", "answer")).toHaveLength(REQUESTS.length - 1);
    for (const message of of(plain.seen, "out", "answer")) expect(message.keys).toEqual(["type", "id", "ok", "value"]);
    expect(plain.bridge.requests).toBeGreaterThan(0);
    expect(of(plain.seen, "out", "node")).toHaveLength(plain.bridge.requests);
    for (const message of of(plain.seen, "out", "node")) expect(message.keys).toEqual(["type", "id"]);
    // Nothing else is posted: no trace entry.
    expect(of(plain.seen, "out")).toHaveLength(REQUESTS.length - 1 + plain.bridge.requests);

    const trace = memorySink();
    startTrace(trace.sink);
    const traced = await sequence(stored, () => traceEndBlock(3n));
    stopTrace();
    // The same results, the same requests of the node store.
    expect(traced.applied).toEqual(plain.applied);
    expect(traced.bridge).toEqual(plain.bridge);
    // The probe is posted after the trace's height ended and before the trace stopped: it says when, too.
    expect(of(traced.seen, "in").map((message) => message.type)).toEqual(REQUESTS);
    for (const message of of(traced.seen, "in")) expect(message.keys).toEqual(["id", "request", "at"]);
    for (const message of of(traced.seen, "out", "answer")) expect(message.keys).toEqual(["type", "id", "ok", "value", "at"]);
    expect(of(traced.seen, "out", "node")).toHaveLength(traced.bridge.requests);
    for (const message of of(traced.seen, "out", "node")) expect(message.keys).toEqual(["type", "id", "at"]);
    expect(of(traced.seen, "out", "trace").map((message) => message.keys)).toEqual([["type", "entry"], ["type", "entry"]]);

    // The worker's entries: one per applied block, each with the requests that ran since the one before.
    const [two, three] = trace.worker() as [WorkerLine, WorkerLine];
    expect(trace.worker()).toHaveLength(2);
    expect(two).toMatchObject({ h: 2, tx: 1, "rqN.load": 1, "rqN.parse": 1, "rqN.apply": 1 });
    expect(three).toMatchObject({ h: 3, tx: 0, "rqN.commit": 1, "rqN.release": 1, "rqN.parse": 1, "rqN.apply": 1 });
    for (const type of ["load", "parse", "apply"]) expect(two[`rq.${type}`], type).toBeGreaterThan(0);
    // The apply of block 2 goes on after its entry: the rest of it, its answer's post included, is in the next one.
    for (const key of ["rq.commit", "rq.release", "rq.parse", "rq.apply", "post.apply", "post.commit"]) expect(three[key], key).toBeGreaterThanOrEqual(0);
    expect(two["post.apply"]).toBeUndefined();
    expect(addingUpProblems([two, three])).toEqual([]);
    // Negative control: without the apply's time the parts of an entry do not add up to its span.
    expect(addingUpProblems([two, three].map(({ "rq.apply": _apply, ...rest }) => rest))).toHaveLength(2);
    // The node waits are the bridge's requests, the nodes those its answers carried; each wait fell inside a request,
    // and those of the apply inside its phases.
    const total = (key: string): number => [two, three].reduce((sum, entry) => sum + ((entry[key] as number | undefined) ?? 0), 0);
    expect(total("nodeWaits")).toBe(traced.bridge.requests);
    expect(total("nodeGot")).toBe(traced.bridge.nodes);
    expect(total("nodeGets")).toBeGreaterThanOrEqual(traced.bridge.requests);
    expect(two["node.rq.load"]).toBeGreaterThan(0);
    for (const entry of [two, three]) {
      expect(sumOf(entry, "node.rq.")).toBeCloseTo((entry.nodeWaitMs as number | undefined) ?? 0, 1);
      expect(((entry["node.adapterApply"] as number | undefined) ?? 0) + ((entry["node.settle"] as number | undefined) ?? 0)).toBeLessThanOrEqual(((entry["node.rq.apply"] as number | undefined) ?? 0) + 0.01);
      expect(entry.idleMs).toBeGreaterThan(0);
      expect(entry.transitMs as number).toBeLessThanOrEqual(entry.idleMs as number);
      expect(entry.queuedMs).toBeGreaterThanOrEqual(0);
    }

    // The main thread's height: each request type's round trips, the answers' way back, the node requests' times.
    const [block] = trace.blocks() as [WorkerLine];
    expect(block).toMatchObject({ h: 3, "rtN.load": 1, "rtN.parse": 2, "rtN.apply": 2, "rtN.commit": 1, "rtN.release": 1, nodeReads: traced.bridge.requests });
    for (const type of ["load", "parse", "apply", "commit", "release"]) expect(block[`rt.${type}`], type).toBeGreaterThan(0);
    // A round trip holds the request's run in the worker.
    expect(block["rt.load"] as number).toBeGreaterThanOrEqual(two["rq.load"] as number);
    expect(block.backMs).toBeGreaterThan(0);
    expect(block.nodeNoticeMs).toBeGreaterThan(0);
    expect(block.nodeReadMs).toBeGreaterThan(0);
    // The worker is blocked from before its node request is posted until after the main thread has noticed it.
    expect(block.nodeNoticeMs as number).toBeLessThanOrEqual(total("nodeWaitMs") + 0.01);
  });
});
