import { afterAll, afterEach, beforeAll, describe, expect, it } from "vitest";
import { bindCoreLedgerState, CORE_LEDGER_STATE_ID, coreLedgerState, countsCopyOf, knownKeysOf } from "../../src/backbone/core-ledger-state/core-ledger-state.js";
import type { CopyFault } from "../../src/backbone/core-ledger-state/counts-copy.js";
import { KNOWN_KEYS_MAX, KnownKeySet, keyText } from "../../src/backbone/core-ledger-state/run-reclaim.js";
import {
  CORE_LEDGER_STATE_MIGRATIONS,
  NODES_TABLE,
  ROOT_COUNTS_TABLE,
  UNREFERENCED_TABLE,
} from "../../src/backbone/core-ledger-state/sql.js";
import { StoredKeys } from "../../src/backbone/core-ledger-state/stored-keys.js";
import type { PostgresParts } from "../../src/config/database-parts.js";
import type { BlockWriteHandle, ReadHandle, Transaction } from "../../src/db/api.js";
import { UmbraError } from "../../src/db/errors.js";
import { statementText } from "../../src/db/repeated-statements.js";
import { childRefKeys } from "../../src/ledger/node-refs.js";
import { type AppliedState, EvictionRefused } from "../../src/ledger/worker/engine.js";
import type { LedgerHost } from "../../src/ledger/worker/host.js";
import { NODES_SQL, type NodeReader } from "../../src/ledger/worker/node-bridge.js";
import type { BlockContext, ProcessContext } from "../../src/modules/declaration.js";
import { FinalizedLoop, type HeightRun, type HeldHeight, type LoopInput } from "../../src/runner/loop.js";
import { startTrace, stopTrace, traceDropBlock, traceEndBlock, type TraceSink } from "../../src/trace/trace.js";
import { LAST, REVERT, stateNodes } from "../ledger/fixtures/sweep-fixture.js";
import { countersMemory } from "../ledger/fixtures/sweep-test-loader.js";
import { hex } from "../ledger/node-format.js";
import { BACKENDS, type TestBackend } from "../db/backends.js";
import { type CommitFault, CommitProxy } from "../runner/commit-proxy.js";
import { PROCESS_BACKENDS, type ProcessBackend, type ProcessDatabase } from "../runner/process-backends.js";
import { PATIENCE_MS } from "./ingest-harness.js";
import { FIRST_VERSION } from "./ledger-refcount-halts.js";
import { type DagRun, type DagRunOptions, runDag, runProblems } from "./refcount-process.js";
import { made, ref } from "./run-reclaim.js";
import { NO_TOPICS } from "../helpers/topic-sink.js";

/**
 * The keys found stored that `core-ledger-state` keeps for a process context (`src/backbone/core-ledger-state/
 * stored-keys.ts`): the keys its reclamation's `missing` read found stored, used by the next block's settle only when
 * that block's context says the block before continues into it (`b.continues`: its `COMMIT` answered in the same run
 * of the loop, on the writer's session still in use), emptied at `on-compute` otherwise, and emptied at once when a
 * settle throws. Every key a run deletes leaves the set; it holds at most its bound.
 * - **On its own**: `begin` with the block's `continues`; the trace's `knownEmptied` for a settle that did not start
 *   from what earlier heights learned (the block before did not continue into it, or the bound emptied the set while it
 *   ran), the same for every attempt of a height after a failure.
 * - **Through the module's callbacks**, on PostgreSQL 18 and PGlite 0.5.10: `on-compute` over a fake ledger worker and a
 *   read at h − 1 that answers the parent's state and time; `on-db-write` and `on-settle` in one transaction of the
 *   database, on `core_ledger_state`'s own tables. Every block flushes one new node, persisted, that references the
 *   stored key c (but the blocks made empty), so the `missing` read asks the database about c exactly when the set
 *   lacks it. Consecutive blocks that continue keep c and do not ask about it again (the control); the set is emptied
 *   by a block that does not continue the one before, after `on-settle` throws (its net write, its computation's read,
 *   a refused eviction with restarts off), and by its bound at a continuing block's settle; it is not emptied by a
 *   refused eviction's worker restart, nor by a read through the handle lent to the worker while the eviction is
 *   awaited. `knownEmptied` is 1 on the committed line of a height made again after attempts that failed with nothing
 *   learned between, and on the line of a continuing block whose settle met the bound, not on the next.
 * - **Through the process**, on the extended DAG fixture (`./refcount-process.ts`), on both backends: a lost connection
 *   at a height's net write, alone and after a refused eviction, empties the set, and the height made again asks the
 *   database about every key it needs. On PostgreSQL through a proxy that ends the writer's backend at a `COMMIT`
 *   (`../runner/commit-proxy.ts`), the height held with its outcome unknown: not committed, the height made again
 *   asks about every key; committed, the height after it does. The tables are a clean run's.
 * - **Another writer between a lost `COMMIT` and the reconnection** (PostgreSQL): process A, `sweep` off, found K
 *   stored and keeps it; its `COMMIT` of 84 does not reach the server, and while it is away process B, with a revision
 *   turning `sweep` on at 84, commits 84 and deletes K, then stops. A reads the cursor at 84 with the block's hash,
 *   takes 84 as committed, and at 85 references K again without flushing it: its block does not continue the one
 *   before, the set is emptied, and the `missing` read halts 85 with `missing-reference`. The negative control has the
 *   loop tell every block it continues: A answers K from its set and commits 85 with a reference to a key that is no
 *   row.
 * - **The copy of the counts and child lists** (`src/backbone/core-ledger-state/counts-copy.ts`), emptied at the same
 *   events, through the same callbacks on both backends, each block above 1 also releasing the node the block before
 *   persisted: blocks that continue have it answer what the settles before read or wrote (verifying, nothing
 *   differs); it is emptied by a block that does not continue the one before, by a settle that throws (its net
 *   write; a read; a refused eviction with restarts off), and by its bound at a continuing block's update
 *   (`copyEmptied` on that line, not the next, and the set not emptied); a refused eviction's restart leaves it: refused
 *   at 4 after 1 to 3 filled it, 5 answers from it what 3 wrote and 4 did not write again, which a restart that empties
 *   it (the control) does not; a height made again after a
 *   rollback reads every count and list, and with the negative control `kept-after-failure` reads a root count its
 *   rolled-back settle had already changed: verifying, it halts with `copy-mismatch`; not, it deletes a node a block
 *   early. The runs through a lost connection or a lost `COMMIT` above verify the copy, and it answers nothing at the
 *   height that lost it.
 */

const hash = (byte: number): Uint8Array => new Uint8Array(32).fill(byte);

/** A trace sink keeping the height lines in memory. */
function memoryTrace(): { readonly sink: TraceSink; lines(): Record<string, unknown>[] } {
  let blocks = "";
  return {
    sink: { blocks: (text) => void (blocks += text), statements: () => undefined, worker: () => undefined },
    lines: () => (blocks === "" ? [] : blocks.trimEnd().split("\n").map((line) => JSON.parse(line) as Record<string, unknown>)),
  };
}

/** A height line's `missing` reads, each as `[keys asked, keys answered missing]`. */
const missingOf = (line: Record<string, unknown> | undefined): [number, number][] =>
  ((line?.reads ?? []) as [string, number, number, number][]).filter(([kind]) => kind === "missing").map(([, asked, , answered]) => [asked, answered]);

/** The heights of `lines` with `knownEmptied`. */
const emptiedAt = (lines: readonly Record<string, unknown>[]): unknown[] => lines.filter((line) => line.knownEmptied !== undefined).map((line) => line.h);

describe("the keys found stored, on their own", () => {
  /** `keys` holding `n` keys. */
  const holding = (keys: StoredKeys, n = 1): void => {
    for (let i = 0; i < n; i++) keys.known.learn(`key ${i}`.padEnd(32, "."));
  };

  it("a block that continues the one before keeps the set; one that does not empties it, and its settle starts afresh, once", () => {
    const keys = new StoredKeys();
    holding(keys);
    keys.begin(true);
    expect([keys.known.size, keys.settled(keys.known.emptied)]).toEqual([1, false]);
    keys.begin(false);
    expect(keys.known.size).toBe(0);
    holding(keys);
    // The settle that follows did not start from what earlier heights learned; the next one, continuing, does.
    expect(keys.settled(keys.known.emptied)).toBe(true);
    keys.begin(true);
    expect([keys.known.size, keys.settled(keys.known.emptied)]).toEqual([1, false]);
    // An empty set that does not continue: still afresh.
    const empty = new StoredKeys();
    empty.begin(false);
    expect(empty.settled(empty.known.emptied)).toBe(true);
  });

  it("the bound emptying the set while a settle runs makes that settle start afresh; a failed settle empties the set at once", () => {
    const keys = new StoredKeys(new KnownKeySet(2));
    keys.begin(true);
    holding(keys, 2);
    const before = keys.known.emptied;
    keys.known.learn("a third key".padEnd(32, "."));
    expect([keys.known.size, keys.settled(before)]).toEqual([1, true]);
    keys.begin(true);
    keys.failed();
    expect(keys.known.size).toBe(0);
  });

  it("every attempt of a height after a failure starts afresh, whatever the attempts before it did: the committed one says so", () => {
    const keys = new StoredKeys();
    // h − 1 committed with c learned; h's first attempt continues and fails after its settle.
    holding(keys);
    keys.begin(true);
    expect(keys.settled(keys.known.emptied)).toBe(false);
    // Two attempts made again, each not continuing; neither learns a key; the first fails after its settle.
    for (const attempt of [2, 3]) {
      keys.begin(false);
      expect([keys.known.size, keys.settled(keys.known.emptied)], `attempt ${attempt}`).toEqual([0, true]);
    }
  });
});

/** Every block's new node references this stored key. */
const C = made("c");
/** A stored node with no reference and no root count, queued: the first run deletes it. */
const Q = made("q");
/** The state root the fake worker and the node agree on, and the state stored after h − 1 has. */
const ROOT = Uint8Array.of(0, ...hash(0x40));

const SCHEMA = `CREATE SCHEMA core_ledger_state;\n${CORE_LEDGER_STATE_MIGRATIONS.map((m) => m.sql).join("\n")}`;

/** Block `height`'s context: no transaction, `core-contract-states` not active; `continues` as given. */
function blockAt(height: bigint, continues: boolean): BlockContext {
  return {
    height,
    hash: hash(Number(height) + 1),
    parentHash: hash(Number(height)),
    items: new Map(
      Object.entries({
        "block-header": { specVersion: 2_000_000, timestampMs: 1_750_000_006_000n },
        "ledger-version": "v9",
        "block-parsed": { ledger: "v9", transactions: [] },
        "tx-results": Object.freeze([]),
        "chain-events": Object.freeze([]),
      }),
    ),
    settings: {},
    active: () => false,
    continues,
  };
}

/**
 * Block `height` as the fake worker applies it: one new node, persisted, that references c; nothing when `empty`. With
 * `releasing`, a block above 1 also releases the node the block before persisted.
 */
function appliedAt(height: bigint, empty: boolean, releasing = false): AppliedState {
  const fresh = made(`n${height}`, [ref(C)]);
  const released = releasing && height > 1n ? [{ key: made(`n${height - 1n}`, [ref(C)]).keyBytes, delta: -1 }] : [];
  return {
    ledger: "v9",
    height,
    hash: hash(Number(height) + 1),
    stateKey: hash(0x30),
    stateRoot: ROOT,
    summary: {
      zswapFirstFree: 3n,
      zswapRoot: Uint8Array.of(0x73, 1),
      dustCommitmentFirstFree: 4n,
      dustCommitmentRoot: Uint8Array.of(0x73, 2),
      dustGenerationFirstFree: 5n,
      dustGenerationRoot: Uint8Array.of(0x73, 3),
    },
    output: { results: [], events: [], logs: [], parameters: Uint8Array.of(1) },
    contracts: [],
    batch: empty
      ? { inserts: [], rootCounts: [] }
      : { inserts: [{ key: fresh.keyBytes, data: fresh.data, children: fresh.children }], rootCounts: [{ key: fresh.keyBytes, delta: 1 }, ...released] },
  };
}

/**
 * The read at h − 1 that `on-compute` gets: the parent's time, its stored state, whose root is {@link ROOT}, and the
 * keys of the states stored after the heights `$1` to `$2` − 1 (a run's first block reads those it releases from then).
 */
function parentRead(height: bigint): ReadHandle {
  return {
    height: height - 1n,
    async query(statement, params = []) {
      const sql = statementText(statement);
      if (sql.includes("extract(epoch")) return [{ ms: 1n }];
      if (sql.includes("JOIN core_block_commit.blocks")) return [{ state_key: hash(0x30), state_root: ROOT, hash: hash(Number(height)), ledger_version: "v9" }];
      if (sql.includes("height >= $1 AND height < $2")) {
        const [from, to] = params as [bigint, bigint];
        return Array.from({ length: Number(to - from) }, (_, i) => ({ height: from + BigInt(i), state_key: hash(0x30) }));
      }
      throw new Error(`the read at h − 1 has no answer for ${sql}`);
    },
  };
}

class RolledBack extends Error {}

/** What a {@link chainOn} chain is made with. */
interface ChainOptions {
  /** q stored and queued: the first run deletes it and sends an eviction. */
  readonly queued?: boolean;
  /** The fake worker refuses every eviction. */
  readonly refuse?: boolean;
  /** The fake worker refuses the eviction of this height only. */
  readonly refuseAt?: bigint;
  /** The worker restart after a refused eviction also empties the copy (a negative control's seam). */
  readonly clearAtRestart?: boolean;
  /** `restartOnRefusedEviction: false`. */
  readonly noRestart?: boolean;
  /** The fake worker reads c's row through the lent handle while it evicts, as for a parse given no read. */
  readonly lentRead?: boolean;
  /** The heights whose block flushes nothing and changes no root count. */
  readonly empty?: readonly bigint[];
  /** Each block above 1 also releases the node the block before persisted (`appliedAt`). */
  readonly releasing?: boolean;
  /** The `core` entry's `reclamationCache`: the copy of the counts and child lists; its defaults unless given. */
  readonly reclamationCache?: { readonly keys?: number; readonly verify?: boolean };
  /** A fault put into the copy's use (a negative control's). */
  readonly copyFault?: CopyFault;
}

/**
 * One process context of `core-ledger-state` on a new database of `backend`, whose `nodes` holds c (persisted) and,
 * with `queued`, q in the queue. The chain tells each block whether the block before continues into it as the loop
 * would: the block before committed in this chain, and no attempt failed since.
 */
async function chainOn(backend: TestBackend, options: ChainOptions = {}) {
  const { db } = await backend.database(SCHEMA);
  await db.transaction(async (tx) => {
    for (const node of options.queued === true ? [C, Q] : [C]) {
      await tx.execute(`INSERT INTO ${NODES_TABLE} (node_key, data, children) VALUES ($1, $2, $3)`, [node.keyBytes, node.data, node.children]);
    }
    await tx.execute(`INSERT INTO ${ROOT_COUNTS_TABLE} (node_key, count) VALUES ($1, 1)`, [C.keyBytes]);
    if (options.queued === true) await tx.execute(`INSERT INTO ${UNREFERENCED_TABLE} (node_key) VALUES ($1)`, [Q.keyBytes]);
  });
  let failNetWrite = false;
  let failQueueRead = false;
  const module = coreLedgerState({
    ...(options.noRestart === true ? { restartOnRefusedEviction: false } : {}),
    ...(options.copyFault === undefined ? {} : { copyFault: options.copyFault }),
    refcountWriter: (w) =>
      failNetWrite
        ? {
            execute: async () => {
              throw new Error("the net write failed (the test's fault)");
            },
          }
        : w,
  });
  const p: ProcessContext = {
    items: new Map([
      [
        "config",
        {
          entries: [
            {
              id: "core",
              start: 0,
              buildVersion: true,
              settings: { retainStates: 1_000, ...(options.reclamationCache === undefined ? {} : { reclamationCache: options.reclamationCache }) },
            },
          ],
        },
      ],
    ]),
    revisions: [],
    publish() {},
  };
  let restarts = 0;
  /** The reads lent to the worker, and those taken back; the rows read through a lent read while evicting. */
  const lent: NodeReader[] = [];
  let unlent = 0;
  const readWhileEvicting: string[] = [];
  const empty = new Set(options.empty ?? []);
  /** The height the fake worker applied last: the one whose settle evicts. */
  let applying: bigint | null = null;
  const host = {
    async load() {
      return { stateRoot: ROOT, loaded: false };
    },
    async apply(input: { readonly height: bigint }) {
      applying = input.height;
      return appliedAt(input.height, empty.has(input.height), options.releasing === true);
    },
    lend(read: NodeReader) {
      lent.push(read);
      return async () => {
        unlent += 1;
      };
    },
    async evict() {
      if (options.lentRead === true) {
        const rows = await (lent.at(-1) as NodeReader).query(NODES_SQL, [[C.keyBytes]]);
        readWhileEvicting.push(...rows.map((row) => hex(row.node_key as Uint8Array)));
      }
      if (options.refuse === true || (options.refuseAt !== undefined && applying === options.refuseAt)) {
        throw new EvictionRefused("still held by a live object (the test's fault)");
      }
      return 1;
    },
    async restart() {
      restarts += 1;
      if (options.clearAtRestart === true) countsCopyOf(p)?.clear();
    },
    async commit() {
      return true;
    },
  } as unknown as LedgerHost;
  bindCoreLedgerState(p, { ledger: host, source: { ledgerStateRoot: async () => ROOT, genesisState: async () => ROOT } });
  const point = <K extends "on-compute" | "on-db-write" | "on-settle">(name: K) => {
    const callback = module.points[name];
    if (callback === undefined) throw new Error(`core-ledger-state has no ${name}`);
    return callback;
  };
  /** The block that committed last in this chain, none after a failed attempt (as the loop's run). */
  let lastCommitted: bigint | null = null;
  return {
    /**
     * Block `height`: its `on-compute`, then its `on-db-write` and `on-settle` in one transaction, committed unless
     * `rollBack` (thrown after the settle); `continues` as the loop would say unless given. Resolves with the keys, as
     * hex, the `missing` read gave the database, and the error, if one was thrown. A block that commits ends its trace
     * line; one that does not drops it.
     */
    async block(height: bigint, given: { readonly rollBack?: boolean; readonly continues?: boolean } = {}): Promise<{ readonly asked: readonly string[]; readonly error: unknown }> {
      const b = blockAt(height, given.continues ?? lastCommitted === height - 1n);
      await point("on-compute")(p, b, parentRead(height), { put() {} });
      const asked: string[] = [];
      try {
        await db.transaction(async (tx: Transaction) => {
          const w: BlockWriteHandle = {
            height: height - 1n,
            async query(statement, params = []) {
              const sql = statementText(statement);
              if (sql.includes("WHERE NOT EXISTS")) asked.push(...(params[0] as Uint8Array[]).map(hex));
              if (failQueueRead && sql.startsWith(`SELECT node_key FROM ${UNREFERENCED_TABLE}`)) throw new Error("the queue's read failed (the test's fault)");
              return tx.query(statement, params);
            },
            execute: (sql, params) => tx.execute(sql, params),
          };
          await point("on-db-write")(p, b, w, NO_TOPICS);
          await point("on-settle")(p, { first: height, last: height }, w);
          if (given.rollBack === true) throw new RolledBack();
        });
      } catch (error) {
        traceDropBlock();
        lastCommitted = null;
        return { asked, error: error instanceof RolledBack ? null : error };
      }
      lastCommitted = height;
      // The module's own points after the commit, when it declares any.
      await module.points["on-after-db-write"]?.(p, b, { height, query: async () => [] });
      traceEndBlock(height);
      return { asked, error: null };
    },
    failNetWrite(on: boolean): void {
      failNetWrite = on;
    },
    failQueueRead(on: boolean): void {
      failQueueRead = on;
    },
    /** Puts the set at its bound without c: c forgotten, other keys learned up to {@link KNOWN_KEYS_MAX}. */
    fillWithoutC(): void {
      const { known } = knownKeysOf(p);
      known.forget(keyText(C.keyBytes));
      for (let n = 0; known.size < KNOWN_KEYS_MAX; n++) known.learn(`another key ${n}`.padEnd(32, "."));
    },
    /** Whether the set holds c. */
    holdsC: (): boolean => knownKeysOf(p).known.has(keyText(C.keyBytes)),
    /** How many keys' counts and child lists the copy holds. */
    copySize: () => countsCopyOf(p)?.size,
    /** Puts the copy's counts at its bound with keys no block meets. */
    fillCopy(): void {
      const copy = countsCopyOf(p);
      if (copy === null) throw new Error("the chain has no copy");
      for (let n = 0; copy.size.counts < copy.max; n++) copy.learnCounts(`another key ${n}`.padEnd(32, "."), { row: true, refs: 1, roots: 0 });
    },
    /** Whether the database holds the row of block `height`'s node. */
    async stored(height: bigint): Promise<boolean> {
      const rows = await db.read((read) => read.query(`SELECT 1 FROM ${NODES_TABLE} WHERE node_key = $1`, [made(`n${height}`, [ref(C)]).keyBytes]));
      return rows.length === 1;
    },
    size: (): number => knownKeysOf(p).known.size,
    restarts: (): number => restarts,
    /** How many reads were lent and taken back, and the keys read through a lent read while evicting. */
    lending: () => ({ lent: lent.length, unlent, read: [...readWhileEvicting] }),
    close: () => db.close(),
  };
}

/** The lines `[h, knownHits, knownEmptied]` of a trace. */
const hitsAndEmptied = (lines: readonly Record<string, unknown>[]): unknown[][] => lines.map((line) => [line.h, line.knownHits, line.knownEmptied]);

describe.each(BACKENDS)("the keys found stored, through the module's callbacks, on $name", (backend: TestBackend) => {
  beforeAll(() => backend.start(), 180_000);
  afterAll(() => backend.stop(), 60_000);
  afterEach(() => stopTrace());

  it("control: consecutive blocks that continue keep c, which the first found stored, and do not ask the database about it again; knownEmptied only at the first", async () => {
    const chain = await chainOn(backend);
    const trace = memoryTrace();
    try {
      startTrace(trace.sink);
      // A process's first block does not continue: the set is empty, c is asked about, found stored and learned.
      expect(await chain.block(1n)).toEqual({ asked: [C.key], error: null });
      for (const height of [2n, 3n, 4n]) expect(await chain.block(height), `block ${height}`).toEqual({ asked: [], error: null });
      expect([chain.holdsC(), chain.size()]).toEqual([true, 1]);
      stopTrace();
      const lines = trace.lines();
      expect(lines.map((line) => missingOf(line))).toEqual([[[1, 0]], [], [], []]);
      expect(hitsAndEmptied(lines)).toEqual([
        [1, 0, 1],
        [2, 1, undefined],
        [3, 1, undefined],
        [4, 1, undefined],
      ]);
    } finally {
      await chain.close();
    }
  }, 120_000);

  it("a block whose context says the block before does not continue into it empties the set at its on-compute: it asks about c again", async () => {
    const chain = await chainOn(backend);
    const trace = memoryTrace();
    try {
      startTrace(trace.sink);
      await chain.block(1n);
      await chain.block(2n);
      expect(chain.holdsC()).toBe(true);
      expect(await chain.block(3n, { continues: false })).toEqual({ asked: [C.key], error: null });
      expect(await chain.block(4n)).toEqual({ asked: [], error: null });
      stopTrace();
      expect(hitsAndEmptied(trace.lines())).toEqual([
        [1, 0, 1],
        [2, 1, undefined],
        [3, 0, 1],
        [4, 1, undefined],
      ]);
    } finally {
      await chain.close();
    }
  }, 120_000);

  it("on-settle that throws (its net write failed) empties the set before its error goes on; the height made again asks about c", async () => {
    const chain = await chainOn(backend);
    const trace = memoryTrace();
    try {
      startTrace(trace.sink);
      await chain.block(1n);
      chain.failNetWrite(true);
      const failed = await chain.block(2n);
      // The settle was answered from the set, then its net write failed: the set is empty when the error goes on.
      expect(failed.asked).toEqual([]);
      expect(String(failed.error)).toMatch(/the net write failed/);
      expect(chain.size()).toBe(0);
      chain.failNetWrite(false);
      expect(await chain.block(2n)).toEqual({ asked: [C.key], error: null });
      expect(await chain.block(3n)).toEqual({ asked: [], error: null });
      stopTrace();
      expect(hitsAndEmptied(trace.lines())).toEqual([
        [1, 0, 1],
        [2, 0, 1],
        [3, 1, undefined],
      ]);
    } finally {
      await chain.close();
    }
  }, 120_000);

  it("on-settle that throws in its computation (a read failed) empties the set before its error goes on", async () => {
    const chain = await chainOn(backend);
    try {
      await chain.block(1n);
      expect(chain.holdsC()).toBe(true);
      chain.failQueueRead(true);
      const failed = await chain.block(2n);
      expect(String(failed.error)).toMatch(/the queue's read failed/);
      expect(chain.size()).toBe(0);
    } finally {
      await chain.close();
    }
  }, 120_000);

  it("a refused eviction with restarts off throws in on-settle and empties the set, the key the settle learned among them", async () => {
    const chain = await chainOn(backend, { queued: true, refuse: true, noRestart: true });
    try {
      const failed = await chain.block(1n);
      expect(failed.asked).toEqual([C.key]);
      expect(String(failed.error)).toMatch(/still held by a live object/);
      expect([chain.size(), chain.restarts()]).toEqual([0, 0]);
    } finally {
      await chain.close();
    }
  }, 120_000);

  it("a block whose transaction rolled back after its settle: the height made again does not continue, empties the set and asks about c", async () => {
    const chain = await chainOn(backend);
    const trace = memoryTrace();
    try {
      startTrace(trace.sink);
      await chain.block(1n);
      expect(await chain.block(2n, { rollBack: true })).toEqual({ asked: [], error: null });
      expect(chain.holdsC()).toBe(true);
      expect(await chain.block(2n)).toEqual({ asked: [C.key], error: null });
      expect(await chain.block(3n)).toEqual({ asked: [], error: null });
      stopTrace();
      expect(hitsAndEmptied(trace.lines())).toEqual([
        [1, 0, 1],
        [2, 0, 1],
        [3, 1, undefined],
      ]);
    } finally {
      await chain.close();
    }
  }, 120_000);

  it("a height made again after attempts that failed with nothing learned between: its committed line has knownEmptied 1", async () => {
    const chain = await chainOn(backend, { empty: [2n] });
    const trace = memoryTrace();
    try {
      startTrace(trace.sink);
      // Block 1 learns c. Block 2 needs no key: its first attempt continues and rolls back after its settle; the second
      // does not continue, empties the set and rolls back too; the third commits.
      expect(await chain.block(1n)).toEqual({ asked: [C.key], error: null });
      expect(await chain.block(2n, { rollBack: true })).toEqual({ asked: [], error: null });
      expect(await chain.block(2n, { rollBack: true })).toEqual({ asked: [], error: null });
      expect(chain.size()).toBe(0);
      expect(await chain.block(2n)).toEqual({ asked: [], error: null });
      expect(await chain.block(3n)).toEqual({ asked: [C.key], error: null });
      stopTrace();
      expect(hitsAndEmptied(trace.lines())).toEqual([
        [1, 0, 1],
        [2, 0, 1],
        [3, 0, undefined],
      ]);
    } finally {
      await chain.close();
    }
  }, 120_000);

  it("a continuing block whose settle finds c stored when the set holds its bound without c: the set is emptied before c enters, that height's line has knownEmptied 1, and the next block's has none", async () => {
    const chain = await chainOn(backend);
    const trace = memoryTrace();
    try {
      startTrace(trace.sink);
      expect(await chain.block(1n)).toEqual({ asked: [C.key], error: null });
      chain.fillWithoutC();
      expect([chain.size(), chain.holdsC()]).toEqual([KNOWN_KEYS_MAX, false]);
      // Block 2 continues block 1; its settle asks about c, finds it stored, and learning it empties the full set first.
      expect(await chain.block(2n)).toEqual({ asked: [C.key], error: null });
      expect([chain.size(), chain.holdsC()]).toEqual([1, true]);
      expect(await chain.block(3n)).toEqual({ asked: [], error: null });
      stopTrace();
      expect(hitsAndEmptied(trace.lines())).toEqual([
        [1, 0, 1],
        [2, 0, 1],
        [3, 1, undefined],
      ]);
      // The mark at 2 is the set's: the copy of the counts and child lists, far from its bound, was not emptied there.
      expect(trace.lines().map((line) => line.copyEmptied)).toEqual([1, undefined, undefined]);
    } finally {
      await chain.close();
    }
  }, 120_000);

  it("a refused eviction's worker restart leaves the set: the run deletes q, the worker is restarted, and the next height does not ask about c", async () => {
    const chain = await chainOn(backend, { queued: true, refuse: true });
    try {
      expect(await chain.block(1n)).toEqual({ asked: [C.key], error: null });
      expect(chain.restarts()).toBe(1);
      expect(chain.holdsC()).toBe(true);
      expect(await chain.block(2n)).toEqual({ asked: [], error: null });
      expect(chain.restarts()).toBe(1);
    } finally {
      await chain.close();
    }
  }, 120_000);

  it("a read through the handle on-settle lends the worker while its eviction is awaited changes nothing of the set: the next height does not ask about c", async () => {
    const chain = await chainOn(backend, { queued: true, lentRead: true });
    const trace = memoryTrace();
    try {
      startTrace(trace.sink);
      // Block 1 deletes q: its eviction is awaited with the block's handle lent, and the worker reads c through it.
      expect(await chain.block(1n)).toEqual({ asked: [C.key], error: null });
      expect(chain.lending()).toEqual({ lent: 1, unlent: 1, read: [C.key] });
      expect(await chain.block(2n)).toEqual({ asked: [], error: null });
      expect([chain.holdsC(), chain.size()]).toEqual([true, 1]);
      stopTrace();
      expect(hitsAndEmptied(trace.lines())).toEqual([
        [1, 0, 1],
        [2, 1, undefined],
      ]);
    } finally {
      await chain.close();
    }
  }, 120_000);
});

/** The lines `[h, copyHits, copyMisses, copyEmptied]` of a trace. */
const copyLines = (lines: readonly Record<string, unknown>[]): unknown[][] => lines.map((line) => [line.h, line.copyHits, line.copyMisses, line.copyEmptied]);

/**
 * The copy of the counts and child lists (`src/backbone/core-ledger-state/counts-copy.ts`) through the same callbacks:
 * each block above 1 also releases the node the block before persisted, so a settle reads the counts of the node its
 * block persists (new), of the one it releases and of the one queued since the block before, and the child list of
 * that queued one, which it deletes. The copy holds all but the first from the settles before.
 */
describe.each(BACKENDS)("the copy of the counts and child lists, through the module's callbacks, on $name", (backend: TestBackend) => {
  beforeAll(() => backend.start(), 180_000);
  afterAll(() => backend.stop(), 60_000);
  afterEach(() => stopTrace());

  it("control: consecutive blocks that continue, verifying: the copy answers what the settles before read or wrote, the new node's counts are read, nothing differs; copyEmptied only at the first", async () => {
    const chain = await chainOn(backend, { releasing: true, reclamationCache: { verify: true } });
    const trace = memoryTrace();
    try {
      startTrace(trace.sink);
      for (const height of [1n, 2n, 3n, 4n]) expect((await chain.block(height)).error, `block ${height}`).toBeNull();
      stopTrace();
      expect(copyLines(trace.lines())).toEqual([
        [1, 0, 1, 1],
        [2, 1, 1, undefined],
        [3, 3, 1, undefined],
        [4, 3, 1, undefined],
      ]);
      // n3 and n4, each with its list; n1 and n2 deleted, and gone from it.
      expect(chain.copySize()).toEqual({ counts: 2, lists: 2 });
    } finally {
      await chain.close();
    }
  }, 120_000);

  it("a block whose context says the block before does not continue into it empties the copy at its on-compute: its settle reads every count and list from the database", async () => {
    const chain = await chainOn(backend, { releasing: true });
    const trace = memoryTrace();
    try {
      startTrace(trace.sink);
      await chain.block(1n);
      await chain.block(2n);
      expect(chain.copySize()).toEqual({ counts: 2, lists: 2 });
      expect((await chain.block(3n, { continues: false })).error).toBeNull();
      for (const height of [4n, 5n]) expect((await chain.block(height)).error).toBeNull();
      stopTrace();
      expect(copyLines(trace.lines())).toEqual([
        [1, 0, 1, 1],
        [2, 1, 1, undefined],
        // Emptied: the counts of n1, n2 and n3, and n1's list, read.
        [3, 0, 4, 1],
        // n2's list, written at 2, was emptied with the rest: read at 4, when n2 is deleted.
        [4, 2, 2, undefined],
        [5, 3, 1, undefined],
      ]);
    } finally {
      await chain.close();
    }
  }, 120_000);

  it("on-settle that throws (its net write failed) empties the copy before its error goes on, the counts it read among them; the height made again reads them all", async () => {
    const chain = await chainOn(backend, { releasing: true });
    const trace = memoryTrace();
    try {
      startTrace(trace.sink);
      await chain.block(1n);
      await chain.block(2n);
      chain.failNetWrite(true);
      expect(String((await chain.block(3n)).error)).toMatch(/the net write failed/);
      expect(chain.copySize()).toEqual({ counts: 0, lists: 0 });
      chain.failNetWrite(false);
      expect((await chain.block(3n)).error).toBeNull();
      stopTrace();
      expect(copyLines(trace.lines())).toEqual([
        [1, 0, 1, 1],
        [2, 1, 1, undefined],
        [3, 0, 4, 1],
      ]);
    } finally {
      await chain.close();
    }
  }, 120_000);

  it("on-settle that throws in its computation (a read failed) empties the copy at once, the counts and lists of the blocks before among them", async () => {
    const chain = await chainOn(backend, { releasing: true });
    try {
      await chain.block(1n);
      await chain.block(2n);
      expect(chain.copySize()).toEqual({ counts: 2, lists: 2 });
      chain.failQueueRead(true);
      expect(String((await chain.block(3n)).error)).toMatch(/the queue's read failed/);
      expect(chain.copySize()).toEqual({ counts: 0, lists: 0 });
    } finally {
      await chain.close();
    }
  }, 120_000);

  it("a refused eviction with restarts off throws in on-settle and empties the copy", async () => {
    const chain = await chainOn(backend, { queued: true, refuse: true, noRestart: true, releasing: true });
    try {
      expect(String((await chain.block(1n)).error)).toMatch(/still held by a live object/);
      expect(chain.copySize()).toEqual({ counts: 0, lists: 0 });
    } finally {
      await chain.close();
    }
  }, 120_000);

  /**
   * Blocks 1 to 5, each above 1 releasing the node the block before persisted, the eviction of 4 (which deletes n2)
   * refused once: the trace's `[h, copyHits, copyMisses, copyEmptied]` lines, and the worker restarts. With
   * `clearAtRestart`, the restart also empties the copy (the negative control).
   */
  async function refusedAt4(clearAtRestart: boolean) {
    const chain = await chainOn(backend, { releasing: true, refuseAt: 4n, clearAtRestart, reclamationCache: { verify: true } });
    const trace = memoryTrace();
    try {
      startTrace(trace.sink);
      for (const height of [1n, 2n, 3n, 4n, 5n]) expect((await chain.block(height)).error, `block ${height}`).toBeNull();
      stopTrace();
      return { lines: copyLines(trace.lines()), restarts: chain.restarts() };
    } finally {
      await chain.close();
    }
  }

  it("a refused eviction's worker restart leaves the copy: refused at 4, after the copy was filled by 1 to 3, 5 answers from it the counts and list of n3, which 3 wrote and 4 did not write again", async () => {
    const { lines, restarts } = await refusedAt4(false);
    expect(restarts).toBe(1);
    expect(lines).toEqual([
      [1, 0, 1, 1],
      [2, 1, 1, undefined],
      [3, 3, 1, undefined],
      [4, 3, 1, undefined],
      // n3's counts (queued at 4) and its list, and n4's counts, from the copy; n5's read.
      [5, 3, 1, undefined],
    ]);
  }, 120_000);

  it("control: a restart that empties the copy fails that case: 4's line says the copy was emptied, and 5 reads n3's counts and list again", async () => {
    const { lines, restarts } = await refusedAt4(true);
    expect(restarts).toBe(1);
    expect(lines.slice(3)).toEqual([
      [4, 3, 1, 1],
      [5, 1, 3, undefined],
    ]);
  }, 120_000);

  it("a continuing block whose net write would take the copy past its bound: the copy is emptied before the new node enters, that height's line has copyEmptied 1, the next block's none, and the set is not emptied", async () => {
    const chain = await chainOn(backend, { releasing: true, reclamationCache: { keys: 4, verify: true } });
    const trace = memoryTrace();
    try {
      startTrace(trace.sink);
      expect((await chain.block(1n)).error).toBeNull();
      chain.fillCopy();
      expect(chain.copySize()).toEqual({ counts: 4, lists: 1 });
      // Block 2 continues block 1: n2's counts are read and not held (the copy is full); n2 entering at the update
      // would pass the bound, so the copy is emptied first.
      expect((await chain.block(2n)).error).toBeNull();
      expect(chain.copySize()).toEqual({ counts: 1, lists: 1 });
      expect((await chain.block(3n)).error).toBeNull();
      stopTrace();
      expect(copyLines(trace.lines())).toEqual([
        [1, 0, 1, 1],
        [2, 1, 1, 1],
        // n1's counts and list were emptied at 2: read again, with n3's.
        [3, 1, 3, undefined],
      ]);
      expect(trace.lines().map((line) => line.knownEmptied)).toEqual([1, undefined, undefined]);
    } finally {
      await chain.close();
    }
  }, 120_000);

  /**
   * Blocks 1 and 2, then 3 rolled back after its settle and made again (`continues` false), verifying or not, with the
   * copy's fault when given: the error of 3 made again, its trace line, and whether n2's row is stored after it.
   */
  async function remade(verify: boolean, copyFault?: CopyFault) {
    const chain = await chainOn(backend, { releasing: true, reclamationCache: { verify }, ...(copyFault === undefined ? {} : { copyFault }) });
    const trace = memoryTrace();
    try {
      startTrace(trace.sink);
      await chain.block(1n);
      await chain.block(2n);
      expect((await chain.block(3n, { rollBack: true })).error).toBeNull();
      // The settle of the rolled-back 3 had updated the copy: n3 held new, n2 released.
      expect(chain.copySize()).toEqual({ counts: 2, lists: 2 });
      const { error } = await chain.block(3n);
      stopTrace();
      return { error, lines: copyLines(trace.lines()), n2Stored: await chain.stored(2n) };
    } finally {
      await chain.close();
    }
  }

  it("a block whose transaction rolled back after its settle: the height made again does not continue, empties the copy and reads every count and list; the verifying copy finds nothing, and n2 stays stored, queued", async () => {
    for (const verify of [false, true]) {
      const { error, lines, n2Stored } = await remade(verify);
      expect(error, `verify ${verify}`).toBeNull();
      expect(lines.at(-1), `verify ${verify}`).toEqual([3, 0, 4, 1]);
      expect(n2Stored, `verify ${verify}`).toBe(true);
    }
  }, 120_000);

  it("control: with kept-after-failure (the copy not emptied for a block that does not continue), 3 made again reads root counts its rolled-back settle already changed: the verifying copy halts with copy-mismatch, and without it n2 is deleted a block early", async () => {
    const verifying = await remade(true, "kept-after-failure");
    expect(verifying.error).toBeInstanceOf(UmbraError);
    const details = (verifying.error as UmbraError).details as Record<string, unknown>;
    expect(details).toMatchObject({ reason: "copy-mismatch", height: 3n, what: "counts" });
    expect([`0x${made("n2", [ref(C)]).key}`, `0x${made("n3", [ref(C)]).key}`]).toContain(details.key);
    const quiet = await remade(false, "kept-after-failure");
    expect(quiet.error).toBeNull();
    expect(quiet.n2Stored).toBe(false);
  }, 120_000);
});

/**
 * The keys height `h`'s settle needed: the references of the nodes the block flushed with another child list than the
 * row's after h − 1 (a list that is the row's own is not checked), and the keys it raised, less those it flushed.
 */
function neededAt(run: DagRun, h: bigint): Set<string> {
  const flush = run.batches.get(h);
  const rows = run.tables.get(h - 1n)?.rows ?? new Map<string, Uint8Array>();
  const flushed = new Set((flush?.inserts ?? []).map((node) => hex(node.key)));
  const referenced = (flush?.inserts ?? [])
    .filter((node) => {
      const row = rows.get(hex(node.key));
      return row === undefined || Buffer.compare(row, node.children) !== 0;
    })
    .flatMap((node) => childRefKeys(node.children).map(hex));
  const raised = (flush?.rootCounts ?? []).filter((change) => change.delta > 0).map((change) => hex(change.key));
  return new Set([...referenced, ...raised].filter((key) => !flushed.has(key)));
}

/** A run of the extended DAG on `db`, traced. */
async function traced(db: ProcessDatabase, options: Omit<DagRunOptions, "dag"> = {}): Promise<{ readonly run: DagRun; readonly lines: Record<string, unknown>[] }> {
  const trace = memoryTrace();
  startTrace(trace.sink);
  let run: DagRun;
  try {
    run = await runDag(db, { dag: "extended", ...options });
  } finally {
    stopTrace();
  }
  return { run, lines: trace.lines() };
}

/**
 * The checks of a run that lost the set at height `at`, against `clean` (the same run with no fault): the run reached
 * the last height, the tables after every block are the clean run's, `at` asked the database about every key it
 * needed and the set answered none, and `knownEmptied` is on the first height and `at` only. The faulted runs verify
 * the copy of the counts and child lists (`reclamationCache.verify`), which was emptied at the same heights and answered
 * nothing at `at`.
 */
function lostAt(clean: { readonly run: DagRun; readonly lines: Record<string, unknown>[] }, faulted: { readonly run: DagRun; readonly lines: Record<string, unknown>[] }, at: bigint): void {
  const { run, lines } = faulted;
  expect(run.status).toMatchObject({ cursor: BigInt(LAST), reason: null });
  expect(run.lines.filter((line) => line.includes("retries in"))).toHaveLength(1);
  expect(runProblems(run, "extended")).toEqual([]);
  for (let height = 0n; height <= BigInt(LAST); height++) {
    expect([...(run.tables.get(height)?.digests ?? [])], `after ${height}`).toEqual([...(clean.run.tables.get(height)?.digests ?? [])]);
  }
  const line = lines.find((candidate) => candidate.h === Number(at));
  expect(missingOf(line)).toEqual([[neededAt(run, at).size, 0]]);
  expect(line?.knownHits).toBe(0);
  // The clean run's same height answered some of the keys it needed from the set.
  const plain = clean.lines.find((candidate) => candidate.h === Number(at));
  expect(plain?.knownHits as number).toBeGreaterThan(0);
  expect(((missingOf(plain)[0] ?? [0])[0] as number) + (plain?.knownHits as number)).toBe(neededAt(clean.run, at).size);
  expect(emptiedAt(lines)).toEqual([0, Number(at)]);
  expect(lines.filter((candidate) => candidate.copyEmptied !== undefined).map((candidate) => candidate.h)).toEqual([0, Number(at)]);
  expect(line?.copyHits).toBe(0);
}

/**
 * The height the faults are put at, from the clean run's trace: the first above 1 whose settle answered keys from the
 * set and changed counts; with `deleting`, one whose settle also deleted nodes, so that it sends an eviction; with
 * `next`, one whose next height answers keys from the set too.
 */
function faultHeight(lines: readonly Record<string, unknown>[], options: { readonly deleting?: boolean; readonly next?: boolean } = {}): bigint {
  const answers = (h: number): boolean => ((lines.find((line) => line.h === h)?.knownHits as number | undefined) ?? 0) > 0;
  const line = lines.find((candidate) => {
    const sizes = candidate.st as number[];
    const h = candidate.h as number;
    return h > 1 && answers(h) && (sizes[3] as number) > 0 && (options.deleting !== true || (sizes[4] as number) > 0) && (options.next !== true || answers(h + 1));
  });
  expect(line).toBeDefined();
  return BigInt(line?.h as number);
}

/** The settings of a faulted run: the copy of the counts and child lists verifying each answer. */
const VERIFYING = { reclamationCache: { verify: true } } as const;

/** A loss of the writer's connection at a statement of a block's net write. */
const lossAtNetWrite = (at: bigint, state: { lost: boolean }): DagRunOptions["core"] => ({
  refcountWriter: (w, height) =>
    height !== at || state.lost
      ? w
      : {
          execute: async () => {
            state.lost = true;
            throw new UmbraError("connection-lost", "the writer's connection was lost at the net write (the test's fault)");
          },
        },
});

describe.each(PROCESS_BACKENDS)("the keys found stored through a lost connection, through the process on $name", (backend: ProcessBackend) => {
  beforeAll(() => backend.start(), 180_000);
  afterAll(() => backend.stop(), 60_000);
  afterEach(() => stopTrace());

  let clean: ReturnType<typeof traced> | undefined;
  const cleanRun = (): ReturnType<typeof traced> => (clean ??= backend.database().then((db) => traced(db)));

  it("at h's net write: on-settle throws, the set is emptied, and h made again asks the database about every key it needs; the tables are a clean run's", async () => {
    const plain = await cleanRun();
    const h = faultHeight(plain.lines);
    const state = { lost: false };
    const run = await traced(await backend.database(), { settings: { backoffCeilingMs: 20, ...VERIFYING }, core: lossAtNetWrite(h, state) });
    expect(state.lost).toBe(true);
    lostAt(plain, run, h);
  }, PATIENCE_MS * 4);

  it("a refused eviction at h, then a lost connection at h's net write: two worker restarts, one retry; the set is emptied by the failed settle, h made again asks every key it needs, and the tables are a clean run's", async () => {
    const plain = await cleanRun();
    const h = faultHeight(plain.lines, { deleting: true });
    const state = { lost: false };
    const run = await traced(await backend.database(), {
      data: { counters: countersMemory(), refuseAt: `${h}`, threads: 1_000 },
      settings: { backoffCeilingMs: 20, ...VERIFYING },
      core: lossAtNetWrite(h, state),
    });
    expect(state.lost).toBe(true);
    // One restart for each attempt of h, after its eviction was refused; neither empties the set.
    expect(run.run.restarts).toBe(2);
    expect(run.lines.find((line) => line.h === Number(h))?.evictRefused).toBe(1);
    lostAt(plain, run, h);
  }, PATIENCE_MS * 6);
});

/**
 * A loop whose `COMMIT` of `at` the proxy ends: armed once `at`'s transaction body has run, `fault` before the server
 * got the `COMMIT` or after it committed, `then` run while the process is away. It records whether each held height's
 * outcome was unknown (`uncertain`).
 */
function armingLoop(proxy: CommitProxy, db: ProcessDatabase, at: bigint, fault: CommitFault, uncertain: boolean[], then?: () => Promise<void>, continuing = false): new (input: LoopInput) => FinalizedLoop {
  let armed = false;
  return class ArmingLoop extends FinalizedLoop {
    protected override async write(tx: Transaction, run: HeightRun): Promise<void> {
      await super.write(tx, run);
      if (run.height === at && !armed) {
        armed = true;
        void proxy.arm(fault, { terminate: () => (db.terminateWriter as () => Promise<number>)(), ...(then === undefined ? {} : { then }) });
      }
    }

    protected override held(held: HeldHeight): HeldHeight | undefined {
      uncertain.push(held.uncertain);
      return super.held(held);
    }

    // The negative control's seam: every block told the block before continues into it.
    protected override continues(run: HeightRun): boolean {
      return continuing || super.continues(run);
    }
  };
}

describe("the keys found stored through a lost COMMIT answer and another writer, through the process on PostgreSQL 18", () => {
  const backend = PROCESS_BACKENDS.find((candidate) => candidate.kind === "postgres") as ProcessBackend;
  beforeAll(() => backend.start(), 180_000);
  afterAll(() => backend.stop(), 60_000);
  afterEach(() => stopTrace());

  let clean: ReturnType<typeof traced> | undefined;
  const cleanRun = (): ReturnType<typeof traced> => (clean ??= backend.database().then((db) => traced(db)));

  /** A traced run through a proxy that ends the writer's backend at the `COMMIT` of `at`. */
  async function lostCommit(at: bigint, fault: CommitFault) {
    const db = await backend.database();
    const proxy = await CommitProxy.start(db.setting as PostgresParts);
    const uncertain: boolean[] = [];
    try {
      const run = await traced({ ...db, setting: proxy.setting(db.setting as PostgresParts) }, {
        settings: { backoffCeilingMs: 20, ...VERIFYING },
        loop: armingLoop(proxy, db, at, fault, uncertain),
      });
      return { ...run, uncertain, faults: proxy.faults };
    } finally {
      await proxy.close();
    }
  }

  it("a COMMIT of h that did not reach the server: h is held with its outcome unknown, made again from on-compute, does not continue, and asks every key it needs; the tables are a clean run's", async () => {
    const plain = await cleanRun();
    const h = faultHeight(plain.lines);
    const run = await lostCommit(h, "before");
    expect(run.uncertain).toEqual([true]);
    lostAt(plain, run, h);
  }, PATIENCE_MS * 4);

  it("a COMMIT of h that the server committed and whose answer was lost: h is not made again, and h + 1 does not continue, empties the set and asks every key it needs; the tables are a clean run's", async () => {
    const plain = await cleanRun();
    const h = faultHeight(plain.lines, { next: true });
    const run = await lostCommit(h, "after");
    expect(run.uncertain).toEqual([true]);
    lostAt(plain, run, h + 1n);
  }, PATIENCE_MS * 4);

  /**
   * Process A, `sweep` off, its `COMMIT` of 84 not reaching the server; while A is away, process B on the same
   * database, with a revision turning `sweep` on at 84, commits 84 and stops. A then reads the cursor at 84 and goes on
   * from 85, up to it or a halt. `continuing`: the loop tells every block of A it continues (the negative control).
   */
  async function takenOver(continuing: boolean) {
    const db = await backend.database();
    const proxy = await CommitProxy.start(db.setting as PostgresParts);
    const uncertain: boolean[] = [];
    let other: DagRun | undefined;
    const then = async (): Promise<void> => {
      other = await runDag(db, {
        dag: "extended",
        resume: BigInt(REVERT - 2),
        last: REVERT - 1,
        // A's configuration up to 83, and the revision at 84 a process may add above the cursor.
        settings: { sweep: "off", backoffCeilingMs: 20 },
        revisions: [{ start: BigInt(REVERT - 1), settings: { sweep: "on" } }],
      });
    };
    try {
      const run = await runDag(
        { ...db, setting: proxy.setting(db.setting as PostgresParts) },
        {
          dag: "extended",
          last: REVERT,
          halts: true,
          settings: { sweep: "off", backoffCeilingMs: 20 },
          loop: armingLoop(proxy, db, BigInt(REVERT - 1), "before", uncertain, then, continuing),
        },
      );
      return { run, other: other as DagRun, uncertain };
    } finally {
      await proxy.close();
    }
  }

  it("another writer commits h while this process's COMMIT of h is lost and deletes a key this process found stored: the cursor read takes h as committed, h + 1 does not continue, and referencing the key again halts it with missing-reference", async () => {
    const { run, other, uncertain } = await takenOver(false);
    expect(uncertain).toEqual([true]);
    // B committed 84 and deleted K, which A found stored at block 1 and, with sweep off, never deleted.
    expect(other.status).toMatchObject({ cursor: BigInt(REVERT - 1), reason: null });
    expect((other.evicted.get(BigInt(REVERT - 1)) ?? []).includes(hex(FIRST_VERSION.key))).toBe(true);
    expect(run.status).toMatchObject({
      state: "halted",
      cursor: BigInt(REVERT - 1),
      reason: { code: "ledger-refcount-invalid", height: BigInt(REVERT), module: CORE_LEDGER_STATE_ID, point: "on-settle" },
    });
    expect((run.errors.at(-1) as UmbraError).details).toMatchObject({ reason: "missing-reference", height: BigInt(REVERT), key: `0x${hex(FIRST_VERSION.key)}` });
  }, PATIENCE_MS * 6);

  it("control: with the loop telling every block it continues, the same takeover lets 85 answer the deleted key from the set and commit a reference to a key that is no row", async () => {
    const { run, uncertain } = await takenOver(true);
    expect(uncertain).toEqual([true]);
    // The assertion fails: 85 commits.
    expect(run.status).toMatchObject({ cursor: BigInt(REVERT), reason: null });
    const root = hex((stateNodes(REVERT, "extended")[0] as { key: Uint8Array }).key);
    expect(runProblems(run, "extended")).toContain(`after ${REVERT}: (a) I1: ${root} references ${hex(FIRST_VERSION.key)}, which is not a row`);
  }, PATIENCE_MS * 6);
});
