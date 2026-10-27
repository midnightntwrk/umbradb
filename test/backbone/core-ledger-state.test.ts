import { describe, expect, it } from "vitest";
import { bindLedgerParser, boundLedgerParser, CORE_BLOCK_PARSED } from "../../src/backbone/core-block-parsed/core-block-parsed.js";
import { workerParser } from "../../src/backbone/core-block-parsed/parser.js";
import {
  applyBlock,
  bindCoreLedgerState,
  boundLedger,
  CORE_LEDGER_STATE,
  CORE_LEDGER_STATE_MIGRATIONS,
  itemsOf,
  NODES_PER_STATEMENT,
  parentTimeOf,
  retainedStates,
  retainedStatesOf,
  revisionsOf,
  writeBlock,
} from "../../src/backbone/core-ledger-state/core-ledger-state.js";
import { UmbraError } from "../../src/db/errors.js";
import type { AppliedState } from "../../src/ledger/worker/engine.js";
import type { LedgerHost } from "../../src/ledger/worker/host.js";
import type { BlockContext, ProcessContext } from "../../src/modules/declaration.js";

// Task 12.3 of `openspec/changes/core-arch` (specs/ledger LG-11, LG-15, LG-16; design.md §10): `core-ledger-state`'s
// parts on their own — the binding, the checks before a block's apply, the root check's error, the writes of a block's
// batch and rows — over a fake ledger worker and block source. The process tests (`ledger-state.test.ts`) run the real
// ones.

const hash = (byte: number): Uint8Array => new Uint8Array(32).fill(byte);
/** A `config` item whose `core` revisions have the `retainStates` of each `[start, retainStates]` (task 12.4). */
const config = (...revisions: readonly (readonly [number, number])[]) => ({
  entries: revisions.map(([start, retainStates]) => ({ id: "core", start, settings: { retainStates } })),
});
const context = (core = config([0, 0])): ProcessContext => ({ items: new Map([["config", core]]), revisions: [], publish() {} });

function block(height: bigint, items: Record<string, unknown> = {}): BlockContext {
  return {
    height,
    hash: hash(Number(height) + 1),
    parentHash: hash(Number(height)),
    items: new Map(Object.entries({
      "block-header": { specVersion: 2_000_000, timestampMs: 1_750_000_006_000n },
      "ledger-version": "v9",
      "block-parsed": { ledger: "v9", transactions: [] },
      "tx-results": Object.freeze([]),
      ...items,
    })),
    settings: {},
    active: () => true,
  };
}

function applied(height: bigint, rest: Partial<AppliedState> = {}): AppliedState {
  return {
    ledger: "v9",
    height,
    hash: hash(Number(height) + 1),
    stateKey: hash(0x40),
    stateRoot: Uint8Array.of(0, ...hash(0x40)),
    summary: {
      zswapFirstFree: 3n,
      zswapRoot: null,
      dustCommitmentFirstFree: null,
      dustCommitmentRoot: null,
      dustGenerationFirstFree: null,
      dustGenerationRoot: null,
    },
    output: { results: [], events: [], logs: [], parameters: Uint8Array.of(1) },
    contracts: [],
    batch: { inserts: [], rootCounts: [] },
    ...rest,
  };
}

/** The root the fake worker gives for the stored state at h − 1 ({@link reading}'s). */
const STORED_ROOT = Uint8Array.of(0, ...hash(0x30));

/** A fake ledger worker recording what it is asked, and a source answering `root`. */
function bound(root: Uint8Array, result: AppliedState = applied(1n), p: ProcessContext = context()) {
  const asked: unknown[] = [];
  const host = {
    async load(input: unknown, read: unknown) {
      asked.push({ load: input, read: read !== undefined });
      return { stateRoot: STORED_ROOT, loaded: false };
    },
    async retained(input: unknown) {
      asked.push({ retained: input });
      return { stateRoot: STORED_ROOT };
    },
    async apply(input: unknown, read: unknown) {
      asked.push({ apply: input, read: read !== undefined });
      return result;
    },
    async genesis(input: unknown) {
      asked.push({ genesis: input });
      return result;
    },
    async genesisRoot() {
      return Uint8Array.of(9);
    },
    async commit(b: unknown) {
      asked.push({ commit: b });
      return true;
    },
    async release(drop: unknown) {
      asked.push({ release: drop });
      return 0;
    },
    async parse(...args: unknown[]) {
      asked.push({ parse: args });
      return [];
    },
  } as unknown as LedgerHost;
  const source = { ledgerStateRoot: async () => root, genesisState: async () => Uint8Array.of(7) };
  bindCoreLedgerState(p, { ledger: host, source });
  return { p, asked, host };
}

/**
 * A read answering each of `core-ledger-state`'s statements: the parent's time `rows`; the state stored after a block
 * (key `0x30…`, {@link STORED_ROOT}, ledger v9) unless `state` says otherwise; and the keys of the states from `$1` to
 * `$2` − 1, `0x30 + height` each, unless `keys` gives them. `queries` records each statement's parameters.
 */
function reading(
  rows: Record<string, unknown>[],
  rest: { state?: Record<string, unknown> | null; keys?: (from: bigint, to: bigint) => Record<string, unknown>[]; height?: bigint | null } = {},
) {
  const queries: unknown[][] = [];
  return {
    height: rest.height ?? null,
    queries,
    async query(sql: string, params: unknown[] = []) {
      queries.push(params);
      if (sql.includes("extract(epoch")) return rows;
      if (sql.includes("JOIN core_block_commit.blocks")) {
        if (rest.state === null) return [];
        return [{ state_key: hash(0x30), state_root: STORED_ROOT, hash: hash(Number(params[0]) + 1), ledger_version: "v9", ...rest.state }];
      }
      if (sql.includes("height >= $1")) {
        const [from, to] = params as [bigint, bigint];
        if (rest.keys !== undefined) return rest.keys(from, to);
        return Array.from({ length: Number(to - from) }, (_, i) => ({ height: from + BigInt(i), state_key: hash(0x30 + Number(from) + i) }));
      }
      throw new Error(`the fake read has no answer for ${sql}`);
    },
  };
}

describe("core-ledger-state's parts (LG-11, LG-15, LG-16)", () => {
  it("is bound once per process context, and refuses to run unbound", async () => {
    const { p } = bound(applied(1n).stateRoot);
    expect(() => bindCoreLedgerState(p, boundLedger(p))).toThrow(/bound once/);
    expect(() => boundLedger(context())).toThrow(/did not bind/);
    await expect(applyBlock(context(), block(1n), reading([]))).rejects.toThrow(/did not bind/);
  });

  it("applies a block with LG-8's rule for its runtime and its parent's time read at h − 1", async () => {
    const { p, asked } = bound(applied(1n).stateRoot);
    await applyBlock(p, block(1n), reading([{ ms: 1_750_000_000_000n }]));
    expect(asked[1]).toMatchObject({
      apply: { height: 1n, timestampMs: 1_750_000_006_000n, parentTimestampMs: 1_750_000_000_000n, firstRegularAtParentTime: true, transactions: 0, outcomes: [] },
      read: true,
    });
    await expect(applyBlock(p, block(1n), reading([]))).rejects.toThrow(/holds no block 0 to take the parent time from/);
    await expect(parentTimeOf(reading([{ ms: "0" }]), block(4n), 5n)).resolves.toBe(5n);
    await expect(parentTimeOf(reading([]), block(0n), 5n)).resolves.toBe(5n);
  });

  it("refuses outcomes of another number than the block's transactions", async () => {
    const { p } = bound(applied(1n).stateRoot);
    const parsed = { ledger: "v9", transactions: [{ index: 0, segments: [] }] };
    await expect(applyBlock(p, block(1n, { "block-parsed": parsed, "tx-results": [] }), reading([{ ms: 1n }]))).rejects.toThrow(
      /0 chain outcomes for 1 transactions/,
    );
    // A rule replacing the outcomes (a negative control's) is given none.
    const { p: q, asked } = bound(applied(1n).stateRoot);
    await applyBlock(q, block(1n, { "block-parsed": parsed, "tx-results": ["success"] }), reading([{ ms: 1n }]), { outcomes: () => undefined });
    expect(asked[1]).not.toHaveProperty("apply.outcomes");
  });

  it("halts with root-mismatch, naming both roots, when the state's root is not the node's (LG-15)", async () => {
    const { p } = bound(Uint8Array.of(0, 1, 2));
    const error = await applyBlock(p, block(1n), reading([{ ms: 1n }])).catch((e: unknown) => e);
    expect(error).toBeInstanceOf(UmbraError);
    expect(error).toMatchObject({
      code: "root-mismatch",
      details: { height: 1n, hash: `0x${"02".repeat(32)}`, node: "0x000102", computed: `0x00${"40".repeat(32)}` },
    });
    expect((error as Error).message).toMatch(/after block 1 .* is 0x0040.*and the node's is 0x000102/);
  });

  it("fails with the node's error when the node's root cannot be read", async () => {
    const p = context();
    const { host } = bound(Uint8Array.of(1));
    bindCoreLedgerState(p, { ledger: host, source: { ledgerStateRoot: async () => Promise.reject(new Error("node down")), genesisState: async () => Uint8Array.of(7) } });
    void STORED_ROOT;
    await expect(applyBlock(p, block(1n), reading([{ ms: 1n }]))).rejects.toThrow("node down");
    // At block 0 the outcomes a rule gives (none) are passed as they are.
    const { p: q, asked } = bound(applied(0n).stateRoot, applied(0n));
    await applyBlock(q, block(0n), reading([]), { outcomes: () => undefined });
    expect(asked[0]).not.toHaveProperty("genesis.outcomes");
  });

  it("takes block 0's genesis state from the source and decides IN-7's case by the roots", async () => {
    const { p, asked } = bound(applied(0n).stateRoot, applied(0n));
    await applyBlock(p, block(0n), reading([]));
    expect(asked[0]).toMatchObject({ genesis: { height: 0n, genesisState: Uint8Array.of(7), includesBlockZero: false, timestampMs: 1_750_000_006_000n } });
    const { p: q, asked: told } = bound(applied(0n).stateRoot, applied(0n));
    await applyBlock(q, block(0n), reading([]), { includesBlockZero: () => true });
    expect(told[0]).toMatchObject({ genesis: { includesBlockZero: true } });
  });

  it("writes a block's batch in chunks, its root counts as signed changes, and its rows; nothing for what it has not", async () => {
    const statements: { sql: string; params: unknown[] }[] = [];
    const w = { execute: async (sql: string, params: unknown[] = []) => (statements.push({ sql, params }), 1) };
    const inserts = Array.from({ length: NODES_PER_STATEMENT + 1 }, (_, i) => ({ key: hash(i % 256), data: Uint8Array.of(i % 256), children: Uint8Array.of(0) }));
    await writeBlock(
      w,
      applied(5n, {
        batch: { inserts, rootCounts: [{ key: hash(1), delta: 1 }, { key: hash(2), delta: 0 }, { key: hash(3), delta: -1 }] },
        output: {
          results: [{ outcome: "partial", segments: [{ segment: 0, success: true }, { segment: 1, success: false }] }],
          events: [
            { transaction: 0, kind: "zswap-output", logicalSegment: 0, physicalSegment: 0, bytes: Uint8Array.of(1), nullifier: null, commitment: hash(9), treeIndex: 4n, contractAddress: null },
            { transaction: 0, kind: "param-change", logicalSegment: 1, physicalSegment: 1, bytes: Uint8Array.of(2), nullifier: null, commitment: null, treeIndex: null, contractAddress: null },
            { transaction: 2, kind: "contract-deploy", logicalSegment: 1, physicalSegment: 1, bytes: Uint8Array.of(3), nullifier: null, commitment: null, treeIndex: null, contractAddress: hash(8) },
          ],
          logs: [],
          parameters: Uint8Array.of(1),
        },
      }),
    );
    expect(statements.map((s) => s.sql.split(" ").slice(0, 3).join(" "))).toEqual([
      "INSERT INTO core_ledger_state.nodes",
      "INSERT INTO core_ledger_state.nodes",
      "WITH d AS",
      "INSERT INTO core_ledger_state.states",
      "INSERT INTO core_ledger_state.segment_results",
      "INSERT INTO core_ledger_state.events",
    ]);
    expect((statements[0]?.params[0] as unknown[]).length).toBe(NODES_PER_STATEMENT);
    expect((statements[1]?.params[0] as unknown[]).length).toBe(1);
    expect(statements[2]?.params).toEqual([[hash(1), hash(3)], [1, -1]]);
    expect(statements[3]?.params).toEqual([5n, hash(0x40), applied(5n).stateRoot, 3n, null, null, null, null, null]);
    expect(statements[4]?.params).toEqual([5n, [0n, 0n], [0, 1], [true, false]]);
    expect(statements[5]?.params.slice(0, 4)).toEqual([5n, [0n, 0n, 2n], [0n, 1n, 0n], ["zswap-output", "param-change", "contract-deploy"]]);

    statements.length = 0;
    await writeBlock(w, applied(6n));
    expect(statements.map((s) => s.sql.split(" ").slice(0, 3).join(" "))).toEqual(["INSERT INTO core_ledger_state.states"]);
  });

  it("gives its items as frozen plain data, and its on-db-write the block its on-compute applied, only that one", async () => {
    const items = itemsOf(applied(1n));
    expect(items.state).toMatchObject({ ledger: "v9", height: 1n, stateKey: hash(0x40), zswapFirstFree: 3n, parameters: Uint8Array.of(1) });
    expect(Object.isFrozen(items.state) && Object.isFrozen(items.events) && Object.isFrozen(items.segments) && Object.isFrozen(items.logs)).toBe(true);
    const { p, asked } = bound(applied(1n).stateRoot);
    const put = new Map<string, unknown>();
    const points = CORE_LEDGER_STATE.points;
    const w = { execute: async () => 1 } as never;
    await expect(points["on-db-write"]?.(p, block(1n), w)).rejects.toThrow(/applied no such block/);
    await points["on-compute"]?.(p, block(1n), reading([{ ms: 1n }]) as never, { put: (k, v) => put.set(k, v) });
    expect([...put.keys()]).toEqual(["ledger-state", "ledger-events", "segment-results", "vm-logs"]);
    await expect(points["on-db-write"]?.(p, block(2n), w)).rejects.toThrow(/applied no such block/);
    await points["on-compute"]?.(p, block(1n), reading([{ ms: 1n }]) as never, { put: () => undefined });
    await points["on-db-write"]?.(p, block(1n), w);
    await expect(points["on-db-write"]?.(p, block(1n), w)).rejects.toThrow(/applied no such block/);
    await points["on-after-db-write"]?.(p, block(1n), {} as never);
    expect(asked.at(-1)).toEqual({ commit: { height: 1n, hash: hash(2) } });
    // Unbound, the commit is no one's.
    await points["on-after-db-write"]?.(context(), block(1n), {} as never);
  });

  it("has the worker hold the state stored at h − 1 before the apply, and fails when its root is not the stored one (LG-11)", async () => {
    const { p, asked } = bound(applied(3n).stateRoot, applied(3n));
    const read = reading([{ ms: 1n }]);
    await applyBlock(p, block(3n), read);
    expect(asked[0]).toEqual({ load: { ledger: "v9", height: 2n, hash: hash(3), stateKey: hash(0x30) }, read: true });
    expect(read.queries[0]).toEqual([2n]);
    // A stored state whose root is not what the worker loads, and a height with no stored state, fail the block.
    const { p: q } = bound(applied(3n).stateRoot, applied(3n));
    await expect(applyBlock(q, block(3n), reading([{ ms: 1n }], { state: { state_root: Uint8Array.of(9) } }))).rejects.toThrow(
      /loaded for block 2 has the root 0x0030.*stores 0x09 for it \(LG-11\)/,
    );
    await expect(applyBlock(q, block(3n), reading([{ ms: 1n }], { state: null }))).rejects.toThrow(/holds no state after block 2 \(LG-11\)/);
    await expect(applyBlock(q, block(3n), reading([{ ms: 1n }], { state: { state_key: "no" } }))).rejects.toThrow(TypeError);
    // A negative control's rule: no load asked.
    const { p: r, asked: none } = bound(applied(3n).stateRoot, applied(3n));
    await applyBlock(r, block(3n), reading([{ ms: 1n }]), { loadParent: false });
    expect(none.some((call) => "load" in (call as object))).toBe(false);
  });

  it("gives the apply the block's ledger and the keys of the states leaving LG-12's window, refusing a missing one", async () => {
    // retainStates 2 until 9, then 0 from 10: block 10 releases the states of 7 to 9 (L(9) = 7, L(10) = 10).
    const p = context(config([0, 2], [10, 0]));
    const { asked } = bound(applied(10n).stateRoot, applied(10n), p);
    const read = reading([{ ms: 1n }]);
    await applyBlock(p, block(10n, { "ledger-version": "v9" }), read, { ledgerOf: (b, parent) => (b.height === 10n ? parent : "v8") });
    expect(read.queries.find((q) => q.length === 2)).toEqual([7n, 10n]);
    expect(asked[1]).toMatchObject({ apply: { ledger: "v9", release: [hash(0x37), hash(0x38), hash(0x39)], contracts: [] } });
    // With a constant window of 2, block 11 of the same history releases nothing new below 10 … and block 5 releases 2.
    const { p: q, asked: told } = bound(applied(5n).stateRoot, applied(5n), context(config([0, 2])));
    await applyBlock(q, block(5n), reading([{ ms: 1n }]));
    expect(told[1]).toMatchObject({ apply: { release: [hash(0x32)] } });
    // A window the table cannot fill (a states row missing) fails the block.
    const { p: s } = bound(applied(10n).stateRoot, applied(10n), context(config([0, 2], [10, 0])));
    await expect(applyBlock(s, block(10n), reading([{ ms: 1n }], { keys: () => [{ height: 7n, state_key: hash(1) }] }))).rejects.toThrow(
      /releases the states of 7 to 9, and core_ledger_state.states holds 1 of them/,
    );
    // The parent's ledger reaches the rule: v8 at h − 1.
    const { p: t, asked: v8 } = bound(applied(4n).stateRoot, applied(4n));
    await applyBlock(t, block(4n), reading([{ ms: 1n }], { state: { ledger_version: "v8" } }), { ledgerOf: (_b, parent) => parent });
    expect(v8[1]).toMatchObject({ apply: { ledger: "v8" } });
  });

  it("persists the keys of the contracts the block calls or deploys, each once in byte order, while core-contract-states is active (LG-13)", async () => {
    const parsed = {
      ledger: "v9",
      transactions: [
        { index: 0, segments: [{ segment: 0, calls: [{ address: hash(9), entryPoint: Uint8Array.of(1) }], deploys: [{ address: hash(2) }] }] },
        { index: 1, segments: [{ segment: 1, calls: [{ address: hash(2), entryPoint: Uint8Array.of(1) }, { address: hash(5), entryPoint: Uint8Array.of(2) }], deploys: [] }] },
      ],
    };
    const items = { "block-parsed": parsed, "tx-results": ["success", "success"] };
    const { p, asked } = bound(applied(3n).stateRoot, applied(3n));
    await applyBlock(p, { ...block(3n, items), active: (id) => id === "core-contract-states" }, reading([{ ms: 1n }]));
    expect(asked[1]).toMatchObject({ apply: { contracts: [hash(2), hash(5), hash(9)] } });
    const { p: q, asked: inactive } = bound(applied(3n).stateRoot, applied(3n));
    await applyBlock(q, { ...block(3n, items), active: () => false }, reading([{ ms: 1n }]));
    expect(inactive[1]).toMatchObject({ apply: { contracts: [] } });
    // The item carries the keys the worker persisted.
    const keys = [{ address: hash(2), stateKey: hash(3), zswapStateKey: hash(4) }];
    expect(itemsOf(applied(3n, { contracts: keys })).state.contracts).toEqual(keys);
  });

  it("publishes its retained states at on-start-db: the window at a cursor, a load inside it, state-not-retained outside (LG-12)", async () => {
    const p = context(config([0, 3]));
    const { asked } = bound(applied(1n).stateRoot, applied(1n), p);
    let published: [string, unknown] | undefined;
    await CORE_LEDGER_STATE.points["on-start-db"]?.({ ...p, publish: (item, value) => (published = [item, value]) }, {} as never);
    expect(published?.[0]).toBe("ledger-state");
    const states = retainedStates(p);
    expect(states.window(null)).toBeNull();
    expect(states.window(10n)).toEqual({ from: 7n, to: 10n });
    const at10 = reading([], { height: 10n });
    await expect(states.load(7n, at10)).resolves.toEqual({ ledger: "v9", height: 7n, hash: hash(8), stateKey: hash(0x30), stateRoot: STORED_ROOT });
    expect(asked.at(-1)).toEqual({ retained: { ledger: "v9", height: 7n, hash: hash(8), stateKey: hash(0x30) } });
    for (const [height, read] of [
      [6n, at10],
      [11n, at10],
      [0n, reading([], { height: null })],
    ] as const) {
      const error = await states.load(height, read).catch((e: unknown) => e);
      expect(error).toBeInstanceOf(UmbraError);
      expect(error).toMatchObject({ code: "state-not-retained", details: { height } });
    }
    await expect(states.load(6n, at10)).rejects.toThrow(/after block 6 is not retained at the cursor 10: the window holds the states of 7 to 10/);
    await expect(states.load(0n, reading([], { height: null }))).rejects.toThrow(/no block is committed/);
    // A stored state whose root the worker does not give back fails.
    await expect(states.load(8n, reading([], { height: 10n, state: { state_root: Uint8Array.of(1) } }))).rejects.toThrow(/another root/);
    // A module requiring ledger-state finds it as its process item.
    const module: ProcessContext = { items: new Map([["ledger-state", states]]), revisions: [], publish() {} };
    expect(retainedStatesOf(module)).toBe(states);
    expect(() => retainedStatesOf(context())).toThrow(/does not require ledger-state/);
    expect(() => revisionsOf({ items: new Map(), revisions: [], publish() {} })).toThrow(/without the config item/);
  });

  it("declares its tables, cannot start mid-chain, and creates no table it does not declare", () => {
    expect(CORE_LEDGER_STATE.startsMidChain).toBe(false);
    const declared = CORE_LEDGER_STATE.provides.flatMap((item) => (item.table?.tables ?? []).map((t) => `${item.table?.schema}.${t}`)).sort();
    const created = [...(CORE_LEDGER_STATE_MIGRATIONS[0]?.sql ?? "").matchAll(/CREATE TABLE (\S+) \(/g)].map((m) => m[1]).sort();
    expect(created).toEqual(declared);
  });
});

describe("core-block-parsed in the ledger worker (CD-5, LG-7)", () => {
  it("parses through the worker bound to its process context, and releases its parses", async () => {
    const { host, asked } = bound(Uint8Array.of(1));
    const p = context();
    bindLedgerParser(p, host);
    expect(() => bindLedgerParser(p, host)).toThrow(/bound once/);
    expect(boundLedgerParser(p)).toBe(host);
    expect(() => boundLedgerParser(context())).toThrow(/did not bind/);
    const points = CORE_BLOCK_PARSED.points;
    await points["on-after-db-write"]?.(p, block(4n));
    await points["on-rollback"]?.(p, [{ height: 5n, hash: hash(5), parentHash: hash(4) }]);
    await points["on-after-db-write"]?.(context(), block(4n));
    await points["on-rollback"]?.(context(), []);
    expect(asked).toEqual([{ release: { upTo: 4n } }, { release: { hashes: [hash(5)] } }]);
    const parser = workerParser(host);
    await expect(parser.parse("v9", [Uint8Array.of(1)])).rejects.toThrow(TypeError);
    expect(await parser.parse("v9", [], { height: 1n, hash: hash(2) })).toEqual([]);
    expect(await parser.parse("v9", [Uint8Array.of(1)], { height: 1n, hash: hash(2) })).toEqual([]);
    expect(asked.at(-1)).toEqual({ parse: ["v9", { height: 1n, hash: hash(2) }, [Uint8Array.of(1)]] });
  });
});
