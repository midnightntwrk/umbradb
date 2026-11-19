import { afterAll, afterEach, describe, expect, it, vi } from "vitest";
import type { BlockId, ApplyBlock } from "../../src/ledger/worker/engine.js";
import { LedgerEngine } from "../../src/ledger/worker/engine.js";
import { followedRecord, inThreadLedger, type LedgerHost, startLedgerWorker } from "../../src/ledger/worker/host.js";
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

/** An in-thread host whose engine's calls are logged; a probe through its chain waits for the earlier requests. */
function inThreadHost(): Recorded {
  const log: string[] = [];
  const record = <K extends "genesis" | "apply" | "commit" | "release" | "load">(name: K, label: (arg: never) => string) => {
    const original = LedgerEngine.prototype[name] as (...args: unknown[]) => unknown;
    vi.spyOn(LedgerEngine.prototype, name).mockImplementation(function (this: LedgerEngine, ...args: unknown[]) {
      log.push(label(args[0] as never));
      return original.apply(this, args) as never;
    } as never);
  };
  record("genesis", (input: { height: bigint }) => line("genesis", input.height));
  record("apply", (input: { height: bigint }) => line("apply", input.height));
  record("commit", (block: BlockId) => line("commit", block.height));
  record("release", (drop: { upTo?: bigint }) => line("release", null, drop.upTo ?? null));
  record("load", (input: { height: bigint }) => line("load", input.height));
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
    expect(followedRecord(host)).toEqual({ applied: [], written: [] });
  });
});
