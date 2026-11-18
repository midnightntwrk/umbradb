import { afterAll, afterEach, describe, expect, it, vi } from "vitest";
import type { StoredNode } from "../../src/ledger/types.js";
import type { AppliedState, BlockId, ApplyBlock, LoadState } from "../../src/ledger/worker/engine.js";
import { LedgerEngine } from "../../src/ledger/worker/engine.js";
import { followedRecord, inThreadLedger, type LedgerHost, startLedgerWorker } from "../../src/ledger/worker/host.js";
import type { NodeReader } from "../../src/ledger/worker/node-bridge.js";
import { NETWORK_ID, RAW, T0 } from "./adapter-fixtures.js";
import type { LoggedRequest } from "./fixtures/request-log-loader.js";

/**
 * What the ledger worker's host sends its thread when the engine tells it what became of a block's transaction
 * (`src/ledger/worker/host.ts`): `written` (the block's rows are in the open transaction), `committed` (the `COMMIT`
 * that holds it answered, or the cursor read after a lost answer found it committed) and `rolledBack` (that
 * transaction ended without committing, or the block's run ended before it was written). Both hosts, over the real v9
 * package:
 * - `startLedgerWorker`, whose thread records every request it receives (`./fixtures/request-log-loader.ts`);
 * - `inThreadLedger`, whose engine's calls are recorded on the main thread.
 *
 * In the sequences the loop gives: `committed(h)` sends the commit of h, then the release of the parses kept up to h,
 * once each, not awaited (the next block's apply finds h committed, since the thread answers in order); the commit only
 * when the host sent the thread an apply or the genesis of h, so a block nothing applied gets the release alone;
 * `written` and `rolledBack` send nothing, so a block made again after a rollback is applied on the same committed
 * state and gets the pending state back. On a closed host the facts throw nothing and leave no rejection behind.
 *
 * The host's record of the facts ({@link followedRecord}): the blocks an apply or the genesis of which was sent and
 * not yet committed, and the blocks written in the open transaction and not yet committed. It is bounded: a block
 * leaves it when it is committed, through `committed` or a direct `commit` that answered; a block written leaves the
 * written list when its transaction rolls back too; an applied block stays across a rollback (it is made again) and
 * a restart of the thread (the record is the host's).
 *
 * **Blocks written in one transaction** (a chunk of heights a..b). The host notes each block written and not committed
 * that a `load` it sent names, or that is the parent of an `apply` it sent (`ledPast`): the thread was led past it,
 * holding as its base a state the database holds only in the open transaction. At `rolledBack`, with a note left, it
 * restarts the thread, not awaited, so the next request runs on a thread that holds no state and has the kept parses;
 * `committed(h)` forgets the notes at or below h, and any restart all of them. The six cases: a rollback after two or
 * more blocks were applied (one restart); a rollback with one block applied (none, the pending result returned); a
 * `COMMIT` at k − 1 after `load(k − 1)` was sent (none at `rolledBack(k)`); a refused eviction mid-chunk (the caller's
 * restart, then a note again, then a later rollback restarts again); a `COMMIT` whose answer was lost (nothing until
 * the cursor read, then `committed`, or `rolledBack` and the restart); a thread that failed (the restart's rejection
 * dropped). Normal mode never notes: `load(h − 1)` follows h − 1's `COMMIT`.
 */

const LONG = 240_000;
const LOGGER = new URL("./fixtures/request-log-loader.ts", import.meta.url);
const hash = (byte: number): Uint8Array => new Uint8Array(32).fill(byte);
const at = (height: bigint): BlockId => ({ height, hash: hash(Number(height) + 1) });

const genesisInput = () => ({
  ledger: "v9" as const,
  ...at(0n),
  parentHash: new Uint8Array(32),
  timestampMs: BigInt(T0),
  transactions: 0,
  genesisState: RAW.v9.LedgerState.blank(NETWORK_ID).serialize(),
  includesBlockZero: true,
});

function applyBlock(height: bigint): ApplyBlock {
  return {
    ledger: "v9",
    ...at(height),
    parentHash: at(height - 1n).hash,
    timestampMs: BigInt(T0) + height * 6_000n,
    parentTimestampMs: BigInt(T0) + (height - 1n) * 6_000n,
    firstRegularAtParentTime: false,
    transactions: 0,
  };
}

/** A request as a line: its type and height, a release's `≤upTo`. */
const line = (type: string, height: bigint | null, upTo: bigint | null = null): string =>
  upTo !== null ? `${type} ≤${upTo}` : height === null ? type : `${type} ${height}`;

/** A host under test, and the requests its thread (or engine) received so far, every earlier one answered. */
interface Recorded {
  readonly host: LedgerHost;
  readonly requests: () => Promise<string[]>;
}

const hosts: LedgerHost[] = [];
afterAll(async () => {
  await Promise.all(hosts.map((host) => host.close()));
});
afterEach(() => {
  vi.restoreAllMocks();
});

/** A worker thread's host whose thread logs each request; the probe that reads the log is left out of it. */
function workerHost(): Recorded {
  const host = startLedgerWorker({ loader: LOGGER });
  hosts.push(host);
  return {
    host,
    async requests() {
      const logged = (await host.probe()) as readonly LoggedRequest[];
      return logged.filter((request) => request.type !== "probe").map((request) => line(request.type, request.height, request.upTo));
    },
  };
}

/**
 * An in-thread host whose engine's calls are logged; a probe through its chain waits for the earlier requests. The
 * engine's own commit inside a `load` (of the pending state it holds) is not a request, and is not logged.
 */
function inThreadHost(): Recorded {
  const log: string[] = [];
  let loading = false;
  const record = <K extends "genesis" | "apply" | "commit" | "release" | "load">(name: K, label: (arg: never) => string) => {
    const original = LedgerEngine.prototype[name] as (...args: unknown[]) => unknown;
    vi.spyOn(LedgerEngine.prototype, name).mockImplementation(function (this: LedgerEngine, ...args: unknown[]) {
      if (!(name === "commit" && loading)) log.push(label(args[0] as never));
      if (name !== "load") return original.apply(this, args) as never;
      // The engine commits a pending state it is asked to load before its first await.
      loading = true;
      try {
        return original.apply(this, args) as never;
      } finally {
        loading = false;
      }
    } as never);
  };
  record("genesis", (input: { height: bigint }) => line("genesis", input.height));
  record("apply", (input: { height: bigint }) => line("apply", input.height));
  record("commit", (block: BlockId) => line("commit", block.height));
  record("release", (drop: { upTo?: bigint }) => line("release", null, drop.upTo ?? null));
  record("load", (input: { height: bigint }) => line("load", input.height));
  const parse = LedgerEngine.prototype.parse;
  vi.spyOn(LedgerEngine.prototype, "parse").mockImplementation(function (this: LedgerEngine, ...args: Parameters<typeof parse>) {
    log.push(line("parse", args[1].height));
    return parse.apply(this, args);
  });
  const host = inThreadLedger();
  hosts.push(host);
  return {
    host,
    async requests() {
      await host.probe();
      return [...log];
    },
  };
}

const HOSTS = [
  { name: "the worker thread's host (startLedgerWorker)", make: workerHost },
  { name: "the in-thread host (inThreadLedger)", make: inThreadHost },
] as const;

describe.each(HOSTS)("$name follows the transaction", ({ make }) => {
  it("committed(h) sends the commit of h, then the release up to h, once each and not awaited; written sends nothing", { timeout: LONG }, async () => {
    const { host, requests } = make();
    await host.genesis(genesisInput());
    host.written(at(0n));
    expect(host.committed(at(0n))).toBeUndefined();
    // Applied on the state after 0, which the commit sent before it made the committed one.
    await host.apply(applyBlock(1n));
    host.written(at(1n));
    host.committed(at(1n));
    await host.apply(applyBlock(2n));
    expect(await requests()).toEqual(["genesis 0", "commit 0", "release ≤0", "apply 1", "commit 1", "release ≤1", "apply 2"]);
  });

  it("a transaction rolled back after its block was written: nothing is sent, and the block made again gets its pending state back and commits once", { timeout: LONG }, async () => {
    const { host, requests } = make();
    await host.genesis(genesisInput());
    host.written(at(0n));
    host.committed(at(0n));
    const first = await host.apply(applyBlock(1n));
    host.written(at(1n));
    host.rolledBack(at(1n));
    const again = await host.apply(applyBlock(1n));
    expect(again.stateRoot).toEqual(first.stateRoot);
    expect(again.batch).toEqual(first.batch);
    host.written(at(1n));
    host.committed(at(1n));
    await host.apply(applyBlock(2n));
    expect(await requests()).toEqual(["genesis 0", "commit 0", "release ≤0", "apply 1", "apply 1", "commit 1", "release ≤1", "apply 2"]);
  });

  it("a run that failed before its block was written, a run stopped before its transaction, and a COMMIT whose answer was lost: nothing is sent until committed", { timeout: LONG }, async () => {
    const { host, requests } = make();
    await host.genesis(genesisInput());
    host.written(at(0n));
    host.committed(at(0n));
    // Failed after its apply, before its transaction (a later on-compute callback).
    await host.apply(applyBlock(1n));
    host.rolledBack(at(1n));
    // Made again; written; its COMMIT's answer lost: nothing is told until the cursor read says committed.
    await host.apply(applyBlock(1n));
    host.written(at(1n));
    expect(await requests()).toEqual(["genesis 0", "commit 0", "release ≤0", "apply 1", "apply 1"]);
    host.committed(at(1n));
    // A height stopped before its transaction began: told rolled back, never written.
    host.rolledBack(at(2n));
    await host.apply(applyBlock(2n));
    expect(await requests()).toEqual(["genesis 0", "commit 0", "release ≤0", "apply 1", "apply 1", "commit 1", "release ≤1", "apply 2"]);
  });

  it("committed(h) of a block the host sent no apply or genesis of: the release up to h alone, no commit", { timeout: LONG }, async () => {
    const { host, requests } = make();
    // As where core-block-parsed runs and core-ledger-state does not: nothing is applied, every block is committed.
    for (const height of [1n, 2n]) {
      host.written(at(height));
      host.committed(at(height));
    }
    // Applied and committed: the commit; then one never applied: the release alone.
    await host.genesis(genesisInput());
    host.written(at(0n));
    host.committed(at(0n));
    await host.apply(applyBlock(1n));
    host.committed(at(1n));
    host.committed(at(2n));
    expect(await requests()).toEqual(["release ≤1", "release ≤2", "genesis 0", "commit 0", "release ≤0", "apply 1", "commit 1", "release ≤1", "release ≤2"]);
  });

  it("on a closed host the facts throw nothing and leave no rejection behind", { timeout: LONG }, async () => {
    const { host } = make();
    await host.close();
    expect(() => {
      host.written(at(1n));
      host.committed(at(1n));
      host.rolledBack(at(1n));
    }).not.toThrow();
    // A rejection left unhandled would fail the run here.
    await new Promise((resolve) => setTimeout(resolve, 50));
  });
  it("the record: applied and written blocks while they are open, none once committed, through committed or a direct commit that answered", { timeout: LONG }, async () => {
    const { host } = make();
    const record = () => {
      const followed = followedRecord(host);
      if (followed === undefined) throw new Error("the host keeps no record of the facts");
      return { applied: followed.applied.map((block) => block.height), written: followed.written.map((block) => block.height) };
    };
    expect(record()).toEqual({ applied: [], written: [] });
    await host.genesis(genesisInput());
    expect(record()).toEqual({ applied: [0n], written: [] });
    host.written(at(0n));
    expect(record()).toEqual({ applied: [0n], written: [0n] });
    host.committed(at(0n));
    expect(record()).toEqual({ applied: [], written: [] });
    // A block made again after a rollback: written leaves, applied stays, and the second apply replaces it.
    await host.apply(applyBlock(1n));
    host.written(at(1n));
    host.rolledBack(at(1n));
    expect(record()).toEqual({ applied: [1n], written: [] });
    await host.apply(applyBlock(1n));
    expect(record()).toEqual({ applied: [1n], written: [] });
    host.written(at(1n));
    host.committed(at(1n));
    expect(record()).toEqual({ applied: [], written: [] });
    // A caller's own apply, commit and release, as the per-block reference runs do: committed by the direct commit.
    for (let height = 2n; height <= 21n; height++) {
      await host.apply(applyBlock(height));
      expect(record().applied, `apply ${height}`).toEqual([height]);
      expect(await host.commit(at(height))).toBe(true);
      expect(record(), `commit ${height}`).toEqual({ applied: [], written: [] });
      await host.release({ upTo: height });
    }
  });

  it("the record across a restart of the thread: an applied block not committed stays, and its commit is still sent once committed", { timeout: LONG }, async () => {
    const { host } = make();
    await host.genesis(genesisInput());
    host.written(at(0n));
    host.committed(at(0n));
    await host.apply(applyBlock(1n));
    host.written(at(1n));
    await host.restart();
    const followed = followedRecord(host);
    expect(followed?.applied.map((block) => block.height)).toEqual([1n]);
    expect(followed?.written.map((block) => block.height)).toEqual([1n]);
    host.committed(at(1n));
    expect(followedRecord(host)).toEqual({ applied: [], written: [], ledPast: [] });
  });
});

/** The state of `applied` as `core-ledger-state` asks the worker to hold it before the next block's apply. */
const loadOf = (applied: AppliedState): LoadState => ({ ledger: "v9", height: applied.height, hash: applied.hash, stateKey: applied.stateKey });

/** The heights of the blocks `host` notes as led past (see the module comment). */
const ledPast = (host: LedgerHost): bigint[] | undefined => followedRecord(host)?.ledPast.map((block) => block.height);

/** Blocks 0 (genesis) committed, then 1 and 2 applied and written in one open transaction, 1 loaded before 2's apply. */
async function twoWritten(host: LedgerHost): Promise<{ one: AppliedState; two: AppliedState }> {
  await host.genesis(genesisInput());
  host.written(at(0n));
  host.committed(at(0n));
  const one = await host.apply(applyBlock(1n));
  host.written(at(1n));
  expect(ledPast(host)).toEqual([]);
  await host.load(loadOf(one));
  const two = await host.apply(applyBlock(2n));
  host.written(at(2n));
  expect(ledPast(host)).toEqual([1n]);
  return { one, two };
}

describe.each(HOSTS)("$name across blocks written in one transaction", ({ make }) => {
  it("a rollback after two blocks or more were applied: one restart, not awaited; the next request runs on a thread that holds no state and has the kept parses", { timeout: LONG }, async () => {
    const { host, requests } = make();
    await host.parse("v9", at(4n), []);
    const { two } = await twoWritten(host);
    await host.load(loadOf(two));
    await host.apply(applyBlock(3n));
    expect(ledPast(host)).toEqual([1n, 2n]);
    for (const height of [1n, 2n, 3n]) host.rolledBack(at(height));
    expect(host.restarts).toBe(1);
    expect(ledPast(host)).toEqual([]);
    expect(followedRecord(host)?.written).toEqual([]);
    await expect(host.apply(applyBlock(1n))).rejects.toThrow(/holds no state/);
    expect((await requests()).slice(-2)).toEqual(["parse 4", "apply 1"]);
    expect(host.restarts).toBe(1);
  });

  it("a rollback with one block applied: no restart, and the block made again gets its pending result back", { timeout: LONG }, async () => {
    const { host, requests } = make();
    await host.genesis(genesisInput());
    host.written(at(0n));
    host.committed(at(0n));
    const first = await host.apply(applyBlock(1n));
    host.written(at(1n));
    expect(ledPast(host)).toEqual([]);
    host.rolledBack(at(1n));
    expect(host.restarts).toBe(0);
    const again = await host.apply(applyBlock(1n));
    expect(again.batch).toEqual(first.batch);
    expect(await requests()).toEqual(["genesis 0", "commit 0", "release ≤0", "apply 1", "apply 1"]);
  });

  it("a COMMIT at k − 1 after load(k − 1) was sent: committed forgets the note, and rolledBack(k) restarts nothing", { timeout: LONG }, async () => {
    const { host, requests } = make();
    const { one, two } = await twoWritten(host);
    // Block 2 failed before its first write: the transaction commits at 1, and 2 is made alone.
    host.committed(at(1n));
    expect(ledPast(host)).toEqual([]);
    host.rolledBack(at(2n));
    expect(host.restarts).toBe(0);
    await host.load(loadOf(one));
    const again = await host.apply(applyBlock(2n));
    expect(again.batch).toEqual(two.batch);
    expect(await requests()).toEqual([
      "genesis 0",
      "commit 0",
      "release ≤0",
      "apply 1",
      "load 1",
      "apply 2",
      "commit 1",
      "release ≤1",
      "load 1",
      "apply 2",
    ]);
  });

  it("a refused eviction mid-chunk: the caller's restart forgets the notes, the next block's load notes again, and a later rollback restarts again", { timeout: LONG }, async () => {
    const { host } = make();
    const { two } = await twoWritten(host);
    // Block 2's settle: the package refuses an eviction, and core-ledger-state restarts the thread.
    await host.restart();
    expect(host.restarts).toBe(1);
    expect(ledPast(host)).toEqual([]);
    // Block 3's on-compute loads the state after 2 (through the open transaction's view, here none: it fails).
    await host.load(loadOf(two)).catch(() => undefined);
    expect(ledPast(host)).toEqual([2n]);
    for (const height of [1n, 2n, 3n]) host.rolledBack(at(height));
    expect(host.restarts).toBe(2);
    expect(ledPast(host)).toEqual([]);
  });

  it("a COMMIT whose answer was lost: nothing until the cursor read; found committed, the commits and no restart", { timeout: LONG }, async () => {
    const { host, requests } = make();
    await twoWritten(host);
    expect(host.restarts).toBe(0);
    expect(ledPast(host)).toEqual([1n]);
    host.committed(at(1n));
    host.committed(at(2n));
    expect(host.restarts).toBe(0);
    expect(followedRecord(host)).toEqual({ applied: [], written: [], ledPast: [] });
    expect(await requests()).toEqual([
      "genesis 0",
      "commit 0",
      "release ≤0",
      "apply 1",
      "load 1",
      "apply 2",
      "commit 1",
      "release ≤1",
      "commit 2",
      "release ≤2",
    ]);
  });

  it("a COMMIT whose answer was lost: found not committed, rolledBack restarts the thread once", { timeout: LONG }, async () => {
    const { host } = make();
    await twoWritten(host);
    host.rolledBack(at(1n));
    host.rolledBack(at(2n));
    expect(host.restarts).toBe(1);
    await expect(host.apply(applyBlock(1n))).rejects.toThrow(/holds no state/);
  });

  it("on a closed host the restart's rejection is dropped: the facts throw nothing and leave no rejection behind", { timeout: LONG }, async () => {
    const { host } = make();
    await twoWritten(host);
    await host.close();
    expect(() => {
      host.rolledBack(at(1n));
      host.rolledBack(at(2n));
    }).not.toThrow();
    await new Promise((resolve) => setTimeout(resolve, 50));
    await expect(host.apply(applyBlock(1n))).rejects.toThrow(/closed/);
  });
});

/** A test package's loader that ends its thread at an apply (`./fixtures/ledger-test-loader.ts`). */
const TEST_LOADER = new URL("./fixtures/ledger-test-loader.ts", import.meta.url);

describe("the worker thread's host when its thread failed inside a chunk", () => {
  it("the restart's rejection is dropped, and every later request fails with the thread's failure", { timeout: LONG }, async () => {
    const host = startLedgerWorker({ loader: TEST_LOADER, loaderData: { exitAt: "3" } });
    hosts.push(host);
    const { two } = await twoWritten(host);
    await host.load(loadOf(two));
    const failed = await host.apply(applyBlock(3n)).catch((error: unknown) => error);
    expect(host.failure).toBe(failed);
    for (const height of [1n, 2n, 3n]) host.rolledBack(at(height));
    await new Promise((resolve) => setTimeout(resolve, 50));
    expect(host.restarts).toBe(0);
    await expect(host.apply(applyBlock(1n))).rejects.toBe(failed);
  });
});

/** A read of the stored nodes `nodes` holds, as the node-store bridge asks for them. */
function nodesReader(nodes: Map<string, StoredNode>): NodeReader {
  const hex = (bytes: Uint8Array): string => Buffer.from(bytes).toString("hex");
  return {
    async query(_sql, params) {
      const keys = (params?.[0] ?? []) as Uint8Array[];
      return keys.flatMap((key) => {
        const node = nodes.get(hex(key));
        return node === undefined ? [] : [{ node_key: node.key, data: node.data, children: node.children }];
      });
    },
  };
}

/** The keys of a batch's inserts, as hex, sorted. */
const insertedKeys = (applied: AppliedState): string[] =>
  applied.batch.inserts.map((node) => Buffer.from(node.key).toString("hex")).sort();

describe("the negative control of the restart rule: a host whose rolledBack is not forwarded", () => {
  /**
   * Blocks 1 and 2 in one transaction that rolls back, then block 1 made again on the state at 0 loaded from the
   * database (genesis's nodes only); `forward` tells the host the rollback or not. Returns block 1's two applies.
   */
  async function madeAgain(forward: boolean): Promise<{ first: AppliedState; again: AppliedState }> {
    const host = startLedgerWorker();
    hosts.push(host);
    const stored = new Map<string, StoredNode>();
    const genesis = await host.genesis(genesisInput());
    for (const node of genesis.batch.inserts) stored.set(Buffer.from(node.key).toString("hex"), node);
    host.written(at(0n));
    host.committed(at(0n));
    const read = nodesReader(stored);
    const first = await host.apply(applyBlock(1n), read);
    host.written(at(1n));
    await host.load(loadOf(first), read);
    await host.apply(applyBlock(2n), read);
    host.written(at(2n));
    if (forward) for (const height of [1n, 2n]) host.rolledBack(at(height));
    // Made again: the state at 0 from the database, then block 1 on it.
    await host.load(loadOf(genesis), read);
    const again = await host.apply(applyBlock(1n), read);
    return { first, again };
  }

  it("forwarded: the block applied again flushes the nodes it flushed the first time", { timeout: LONG }, async () => {
    const { first, again } = await madeAgain(true);
    expect(insertedKeys(first).length).toBeGreaterThan(0);
    expect(insertedKeys(again)).toEqual(insertedKeys(first));
  });

  it("not forwarded: the block applied again returns a batch without the nodes it flushed the first time", { timeout: LONG }, async () => {
    const { first, again } = await madeAgain(false);
    const missing = insertedKeys(first).filter((key) => !insertedKeys(again).includes(key));
    expect(missing.length).toBeGreaterThan(0);
  });
});
