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
const context = (): ProcessContext => ({ items: new Map(), revisions: [], publish() {} });

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
    batch: { inserts: [], rootCounts: [] },
    ...rest,
  };
}

/** A fake ledger worker recording what it is asked, and a source answering `root`. */
function bound(root: Uint8Array, result: AppliedState = applied(1n)) {
  const asked: unknown[] = [];
  const host = {
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
  const p = context();
  bindCoreLedgerState(p, { ledger: host, source });
  return { p, asked, host };
}

const reading = (rows: Record<string, unknown>[]) => ({ query: async () => rows });

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
    expect(asked[0]).toMatchObject({
      apply: { height: 1n, timestampMs: 1_750_000_006_000n, parentTimestampMs: 1_750_000_000_000n, firstRegularAtParentTime: true, transactions: 0, outcomes: [] },
      read: true,
    });
    await expect(applyBlock(p, block(1n), reading([]))).rejects.toThrow(/holds no block 0 to take the parent time from/);
    await expect(parentTimeOf(reading([{ ms: "0" }]), block(4n), 5n)).resolves.toBe(5n);
    await expect(parentTimeOf(reading([]), block(0n), 5n)).resolves.toBe(5n);
  });

  it("refuses outcomes of another number than the block's transactions", async () => {
    const { p } = bound(applied(1n).stateRoot);
    const parsed = { ledger: "v9", transactions: [{ index: 0 }] };
    await expect(applyBlock(p, block(1n, { "block-parsed": parsed, "tx-results": [] }), reading([{ ms: 1n }]))).rejects.toThrow(
      /0 chain outcomes for 1 transactions/,
    );
    // A rule replacing the outcomes (a negative control's) is given none.
    const { p: q, asked } = bound(applied(1n).stateRoot);
    await applyBlock(q, block(1n, { "block-parsed": parsed, "tx-results": ["success"] }), reading([{ ms: 1n }]), { outcomes: () => undefined });
    expect(asked[0]).not.toHaveProperty("apply.outcomes");
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
